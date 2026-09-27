// Web Worker: menjalankan kode JS user di thread terpisah supaya infinite loop tidak membekukan tab.
import { jalankanJs } from './jsEngine.js';
import { formatError } from './tes.js';
import { pelajaranById } from '../lessons/index.js';

let runAktif = null;

// Promise yang reject tanpa .catch / try-catch.
self.addEventListener('unhandledrejection', (ev) => {
  ev.preventDefault();
  if (runAktif === null) return;
  const teks = `Uncaught (in promise) ${formatError(ev.reason)}\n💡 Ada Promise yang gagal tapi tidak ditangani. Tambahkan .catch(...) atau try/catch.`;
  self.postMessage({ tipe: 'log', runId: runAktif, entri: { level: 'error', text: teks } });
});

self.onmessage = async ({ data }) => {
  if (data.tipe === 'ping') {
    self.postMessage({ tipe: 'pong' });
    return;
  }
  const { runId, kode, pelajaranId } = data;
  runAktif = runId;
  const pelajaran = pelajaranById[pelajaranId];
  const hasil = await jalankanJs({
    kode,
    pelajaran,
    onLog: (entri) => self.postMessage({ tipe: 'log', runId, entri }),
  });
  self.postMessage({ tipe: 'selesai', runId, hasil });
};
