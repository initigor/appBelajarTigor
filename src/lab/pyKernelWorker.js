// Worker klasik (bukan module) untuk "kernel" Python berbasis Pyodide: dipakai Workspace Notebook (.ipynb)
// dan blok kode Python interaktif di pelajaran. Namespace Python BERTAHAN antar-eksekusi (seperti Jupyter),
// jadi variabel dari sel sebelumnya masih ada di sel berikutnya sampai kernel di-restart.
const PYODIDE_VERSI = 'v0.28.0';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSI}/full/`;

let pyodideSiap = null;
let sab = null; // jembatan stdin sinkron: Int32 [0]=sinyal, [1]=panjang; byte data mulai offset 8
let int32 = null;
let idAktif = null;

const kirim = (tipe, data) => postMessage({ tipe, ...data });

/** Diminta Pyodide saat Python membutuhkan input (mis. input()). Memblokir worker lewat Atomics.wait. */
function bacaStdinSinkron(buf) {
  if (!int32) return 0; // tanpa SharedArrayBuffer: input() akan mendapat EOF
  kirim('perlu-stdin', { id: idAktif });
  for (;;) {
    const hasil = Atomics.wait(int32, 0, 0, 100);
    if (hasil === 'timed-out') continue;
    const panjang = Atomics.load(int32, 1);
    const bytes = new Uint8Array(sab, 8, panjang);
    const n = Math.min(panjang, buf.length);
    buf.set(bytes.subarray(0, n), 0);
    Atomics.store(int32, 0, 0);
    return n;
  }
}

const PEMBANTU_PYTHON = `
import sys, io, os, base64, warnings
os.environ["MPLBACKEND"] = "AGG"
warnings.filterwarnings("ignore", message="FigureCanvasAgg is non-interactive")
warnings.filterwarnings("ignore", message="Matplotlib is currently using agg")
from pyodide.code import eval_code_async

async def _jalankan_sel(kode):
    import __main__
    hasil = await eval_code_async(kode, globals=__main__.__dict__, filename="<sel>")
    return None if hasil is None else repr(hasil)

def _ambil_gambar():
    if "matplotlib.pyplot" not in sys.modules:
        return []
    import matplotlib.pyplot as plt
    hasil = []
    for n in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(n).savefig(buf, format="png", dpi=100, bbox_inches="tight")
        hasil.append(base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
    return hasil
`;

function aliran(namaTipe) {
  const dekoder = new TextDecoder();
  return {
    write: (buf) => {
      kirim(namaTipe, { id: idAktif, teks: dekoder.decode(buf, { stream: true }) });
      return buf.length;
    },
  };
}

async function pastikanSiap() {
  if (!pyodideSiap) {
    pyodideSiap = (async () => {
      kirim('status', { pesan: 'Memuat Python (Pyodide)…', persen: 15 });
      importScripts(PYODIDE_INDEX_URL + 'pyodide.js');
      // eslint-disable-next-line no-undef
      const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      pyodide.setStdout(aliran('stdout'));
      pyodide.setStderr(aliran('stderr'));
      pyodide.setStdin({ read: bacaStdinSinkron });
      await pyodide.runPythonAsync(PEMBANTU_PYTHON);
      kirim('status', { pesan: 'Python siap.', persen: 100 });
      return pyodide;
    })();
  }
  return pyodideSiap;
}

/** Ambil bagian traceback yang relevan (mulai dari kode milik pengguna), tanpa baris internal Pyodide. */
function rapikanGalat(pesan) {
  const baris = String(pesan).split('\n');
  const mulai = baris.findIndex((b) => b.includes('File "<sel>"'));
  if (mulai < 0) return String(pesan).trim();
  const isi = baris.slice(mulai).join('\n').trim();
  const galatSintaks = /^\s*(SyntaxError|IndentationError|TabError)/m.test(isi);
  return galatSintaks ? isi : `Traceback (most recent call last):\n${isi}`;
}

onmessage = async (ev) => {
  const d = ev.data;
  if (d.tipe === 'siapkan-stdin') {
    sab = d.sab;
    int32 = new Int32Array(sab);
    return;
  }
  if (d.tipe !== 'jalankan') return;
  idAktif = d.id;
  let pyodide;
  try {
    pyodide = await pastikanSiap();
  } catch (e) {
    kirim('selesai', { id: d.id, hasil: null, gambar: [], galat: `Gagal memuat Python: ${e?.message ?? e}` });
    return;
  }
  let hasil = null;
  let galat = null;
  try {
    await pyodide.loadPackagesFromImports(d.kode, {
      messageCallback: (m) => kirim('status', { pesan: m, persen: 60 }),
      errorCallback: () => {},
    });
    pyodide.globals.set('__kode__', d.kode);
    hasil = await pyodide.runPythonAsync('await _jalankan_sel(__kode__)');
  } catch (e) {
    galat = rapikanGalat(e?.message ?? e);
  }
  let gambar = [];
  try {
    const proxy = pyodide.globals.get('_ambil_gambar')();
    gambar = proxy.toJs();
    proxy.destroy?.();
  } catch {
    /* abaikan */
  }
  kirim('selesai', { id: d.id, hasil: hasil ?? null, gambar, galat });
};
