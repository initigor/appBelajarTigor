// Worker klasik (bukan module) untuk menjalankan Python lewat Pyodide di /lab.
// Dimuat dari CDN jsdelivr (COEP: credentialless mengizinkan ini tanpa header CORP eksplisit dari jsdelivr,
// tapi jsdelivr memang sudah mengirim Cross-Origin-Resource-Policy: cross-origin).
const PYODIDE_VERSI = 'v0.28.0';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSI}/full/`;

let pyodideReadyPromise = null;
let sab = null; // SharedArrayBuffer utk jembatan stdin sinkron: Int32 di [0]=sinyal, [1]=panjang; byte data mulai offset 8
let int32 = null;

function kirim(tipe, data) {
  postMessage({ tipe, ...data });
}

/** Diminta oleh Pyodide setiap kali Python membutuhkan input (mis. dipanggil dari input()). Blocking (Atomics.wait). */
function bacaStdinSinkron(buf) {
  if (!int32) return 0; // stdin belum disiapkan (SharedArrayBuffer gagal dibuat, mis. tidak cross-origin isolated)
  kirim('perlu-stdin', {});
  const batasMs = 100;
  for (;;) {
    const hasil = Atomics.wait(int32, 0, 0, batasMs);
    if (hasil === 'timed-out') continue; // terus menunggu; bisa dipakai utk cek interrupt kalau perlu nanti
    // hasil === 'ok' atau 'not-equal' -> data sudah siap (atau baru saja disiapkan sebelum wait sempat jalan)
    const panjang = Atomics.load(int32, 1);
    const bytes = new Uint8Array(sab, 8, panjang);
    const n = Math.min(panjang, buf.length);
    buf.set(bytes.subarray(0, n), 0);
    Atomics.store(int32, 0, 0); // reset sinyal utk permintaan berikutnya
    return n;
  }
}

async function pastikanPyodideSiap() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      kirim('status', { pesan: 'Memuat Python (Pyodide)…', persen: 10 });
      importScripts(PYODIDE_INDEX_URL + 'pyodide.js');
      // eslint-disable-next-line no-undef
      const pyodide = await loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
        stdout: (msg) => kirim('stdout', { teks: msg + '\n' }),
        stderr: (msg) => kirim('stderr', { teks: msg + '\n' }),
      });
      kirim('status', { pesan: 'Python siap.', persen: 100 });
      pyodide.setStdin({ read: bacaStdinSinkron });
      return pyodide;
    })();
  }
  return pyodideReadyPromise;
}

onmessage = async (ev) => {
  const { tipe } = ev.data;
  if (tipe === 'siapkan-stdin') {
    sab = ev.data.sab;
    int32 = new Int32Array(sab);
    return;
  }
  if (tipe === 'jalankan') {
    try {
      const pyodide = await pastikanPyodideSiap();
      try {
        // Mode proyek (Workspace): tulis SEMUA berkas ke filesystem virtual Pyodide dulu,
        // supaya `import modul_lain` antar-berkas benar-benar bekerja, baru jalankan entryPoint.
        if (ev.data.berkas) {
          for (const [path, isi] of Object.entries(ev.data.berkas)) {
            const bagian = path.split('/');
            let dir = '';
            for (let i = 0; i < bagian.length - 1; i++) {
              dir += (dir ? '/' : '') + bagian[i];
              try {
                pyodide.FS.mkdir(dir);
              } catch {
                /* sudah ada */
              }
            }
            pyodide.FS.writeFile(path, isi);
          }
          const kodeUtama = ev.data.berkas[ev.data.entryPoint] ?? '';
          await pyodide.runPythonAsync(kodeUtama);
        } else {
          await pyodide.runPythonAsync(ev.data.kode);
        }
        kirim('selesai', { kode: 0 });
      } catch (e) {
        kirim('stderr', { teks: String(e?.message ?? e) + '\n' });
        kirim('selesai', { kode: 1 });
      }
    } catch (e) {
      kirim('stderr', { teks: `Gagal memuat Python: ${e?.message ?? e}\n` });
      kirim('selesai', { kode: 1 });
    }
  }
};
