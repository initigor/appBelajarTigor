// Sisi browser untuk kernel Python (lihat src/lab/pyKernelWorker.js). Eksekusi diantre satu per satu.
import { bikinSab, tulisBarisKeSab } from '../lab/stdinBridge.js';
import { keluaranDariSelesai, tambahKeluaran } from './keluaranPython.js';

/**
 * Buat satu kernel. `jalankan(kode, opsi)` mengembalikan Promise<keluaran[]>.
 * opsi: { onKeluaran(daftarBaru), onStatus({pesan,persen}), mintaInput() => Promise<string> }
 */
export function buatKernel() {
  let worker = null;
  let sab = null;
  let antrean = Promise.resolve();
  let aktif = null; // { id, opsi, keluaran, selesai(resolve), batal }
  let nomor = 0;

  const pastikan = () => {
    if (worker) return worker;
    worker = new Worker(new URL('../lab/pyKernelWorker.js', import.meta.url));
    sab = bikinSab();
    if (sab) worker.postMessage({ tipe: 'siapkan-stdin', sab });
    worker.onmessage = async (ev) => {
      const d = ev.data;
      if (d.tipe === 'status') return aktif?.opsi.onStatus?.({ pesan: d.pesan, persen: d.persen });
      if (!aktif || d.id !== aktif.id) return;
      if (d.tipe === 'stdout' || d.tipe === 'stderr') {
        aktif.keluaran = tambahKeluaran(aktif.keluaran, { jenis: 'stream', nama: d.tipe, teks: d.teks });
        aktif.opsi.onKeluaran?.(aktif.keluaran);
      } else if (d.tipe === 'perlu-stdin') {
        if (!sab || !aktif.opsi.mintaInput) return;
        const sel = aktif;
        const baris = await sel.opsi.mintaInput();
        if (aktif === sel && sab) {
          // gaung input (seperti terminal), supaya terlihat apa yang diketik
          sel.keluaran = tambahKeluaran(sel.keluaran, { jenis: 'stream', nama: 'stdout', teks: `${baris}\n` });
          sel.opsi.onKeluaran?.(sel.keluaran);
          tulisBarisKeSab(sab, baris);
        }
      } else if (d.tipe === 'selesai') {
        const sel = aktif;
        aktif = null;
        sel.selesai(keluaranDariSelesai(sel.keluaran, d));
      }
    };
    return worker;
  };

  return {
    /** Apakah input() didukung (butuh SharedArrayBuffer / cross-origin isolation). */
    get dukungInput() {
      return typeof SharedArrayBuffer !== 'undefined';
    },
    jalankan(kode, opsi = {}) {
      const giliran = antrean.then(
        () =>
          new Promise((resolve) => {
            const w = pastikan();
            const id = ++nomor;
            aktif = { id, opsi, keluaran: [], selesai: resolve };
            w.postMessage({ tipe: 'jalankan', id, kode });
          }),
      );
      antrean = giliran.catch(() => {});
      return giliran;
    },
    /** Matikan kernel (menghentikan eksekusi dan menghapus semua variabel). Eksekusi yang sedang jalan diselesaikan dengan keterangan. */
    reset(keterangan = 'Kernel dihentikan.') {
      worker?.terminate();
      worker = null;
      sab = null;
      if (aktif) {
        const sel = aktif;
        aktif = null;
        sel.selesai(keluaranDariSelesai(sel.keluaran, { hasil: null, gambar: [], galat: keterangan }));
      }
    },
    get sibuk() {
      return aktif !== null;
    },
  };
}

let bersama = null;
/** Kernel yang dipakai bersama oleh semua blok kode di satu halaman pelajaran. */
export function kernelBersama() {
  if (!bersama) bersama = buatKernel();
  return bersama;
}
