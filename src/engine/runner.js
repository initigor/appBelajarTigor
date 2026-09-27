// Orkestrator di browser: memilih worker (tipe 'js') atau iframe (tipe 'dom' / 'react').
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { flushSync } from 'react-dom';
// domEngine (berisi Babel, ~3 MB) dimuat saat pertama dibutuhkan saja.
import { semuaGagal } from './tes.js';

const BATAS_MS = 3000;

let worker = null;
let runBerikut = 1;

function ambilWorker() {
  if (!worker) worker = new Worker(new URL('./jsWorker.js', import.meta.url), { type: 'module' });
  return worker;
}

/** Siapkan worker di latar belakang supaya "Jalankan" pertama terasa cepat. */
export function panaskanWorker() {
  ambilWorker();
}

function jalankanDiWorker({ kode, pelajaran, onLog }) {
  return new Promise((resolve) => {
    const w = ambilWorker();
    const runId = runBerikut++;
    let timer = null;
    const batas = pelajaran.batasWaktu ?? BATAS_MS;
    const mulaiTimer = () => {
      timer = setTimeout(() => {
        w.terminate();
        worker = null;
        w.removeEventListener('message', onMsg);
        const pesan = `⏱️ Waktu habis: kode berjalan lebih dari ${batas / 1000} detik dan dihentikan.\n💡 Kemungkinan ada infinite loop. Cek kondisi berhenti pada while/for-mu.`;
        onLog?.({ level: 'error', text: pesan });
        resolve({ error: pesan, hasil: semuaGagal(pelajaran.tes, 'Kode dihentikan karena waktu habis.') });
      }, batas);
    };
    const onMsg = ({ data }) => {
      if (data.runId !== runId) return;
      if (data.tipe === 'mulai') return;
      if (data.tipe === 'log') onLog?.(data.entri);
      if (data.tipe === 'selesai') {
        clearTimeout(timer);
        w.removeEventListener('message', onMsg);
        resolve(data.hasil);
      }
    };
    w.addEventListener('message', onMsg);
    // Worker baru butuh waktu memuat modul; timer dimulai setelah pesan pertama "siap".
    siap(w).then(() => {
      mulaiTimer();
      w.postMessage({ runId, kode, pelajaranId: pelajaran.id });
    });
  });
}

const sudahSiap = new WeakSet();
function siap(w) {
  if (sudahSiap.has(w)) return Promise.resolve();
  return new Promise((resolve) => {
    // Kirim ping; worker membalas setelah semua modulnya termuat.
    const onPong = ({ data }) => {
      if (data.tipe === 'pong') {
        w.removeEventListener('message', onPong);
        sudahSiap.add(w);
        resolve();
      }
    };
    w.addEventListener('message', onPong);
    w.postMessage({ tipe: 'ping' });
  });
}

export function htmlPreview(pelajaran) {
  const isi = pelajaran.html ?? (pelajaran.tipe === 'react' ? '<div id="root"></div>' : '');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; margin: 16px; color: #1d1d2b; background: #fff; line-height: 1.5; }
    button { font: inherit; padding: 6px 14px; border-radius: 8px; border: 1px solid #b9b9d0; background: #f3f3fb; cursor: pointer; }
    button:hover { background: #e6e6f7; }
    input, textarea, select { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid #b9b9d0; }
    ${pelajaran.css ?? ''}
  </style></head><body>${isi}</body></html>`;
}

function muatIframe(iframe, html) {
  return new Promise((resolve) => {
    iframe.addEventListener('load', () => resolve(), { once: true });
    iframe.srcdoc = html;
  });
}

let rootLama = null;

let modulDom = null;

async function jalankanDiIframe({ kode, pelajaran, iframe, onLog }) {
  modulDom ??= import('./domEngine.js');
  if (rootLama) {
    try {
      rootLama.unmount();
    } catch {
      /* abaikan */
    }
    rootLama = null;
  }
  await muatIframe(iframe, htmlPreview(pelajaran));
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;

  // Error di event handler React dilaporkan ke window aplikasi, jadi tangkap sementara di sini juga.
  const onErrorInduk = (ev) => {
    if (!ev.error) return;
    onLog?.({ level: 'error', text: `${ev.error.name}: ${ev.error.message}` });
    ev.preventDefault();
  };
  window.addEventListener('error', onErrorInduk);
  win.addEventListener('unload', () => window.removeEventListener('error', onErrorInduk), { once: true });

  const { jalankanDom } = await modulDom;
  const batas = new Promise((resolve) =>
    setTimeout(() => resolve({ error: 'Waktu habis', hasil: semuaGagal(pelajaran.tes, 'Tes tidak selesai dalam 5 detik.') }), 5000),
  );
  return Promise.race([
    jalankanDom({
      kode,
      pelajaran,
      doc,
      win,
      React,
      ReactDOMClient,
      flushSync,
      onLog,
      onRoot: (r) => (rootLama = r),
    }),
    batas,
  ]);
}

/** Jalankan kode + tes. onLog dipanggil untuk setiap baris console (streaming). */
export function jalankanPelajaran({ kode, pelajaran, iframe, onLog }) {
  if (pelajaran.tipe === 'js') return jalankanDiWorker({ kode, pelajaran, onLog });
  return jalankanDiIframe({ kode, pelajaran, iframe, onLog });
}
