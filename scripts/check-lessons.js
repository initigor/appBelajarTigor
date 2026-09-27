// Mengecek semua pelajaran:
//   1. `solusi` harus lolos SEMUA tes pelajaran itu.
//   2. `kodeAwal` TIDAK boleh langsung lolos semua tes (supaya latihannya tidak "gratis").
//
// Pemakaian:
//   npm run check-lessons            -> cek semua pelajaran
//   npm run check-lessons -- array   -> cek pelajaran yang id/file-nya mengandung "array"
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const folderPelajaran = join(root, 'src', 'lessons');
const filter = process.argv[2]?.toLowerCase();

// DOM global harus ada SEBELUM react-dom dimuat.
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
for (const k of ['HTMLElement', 'HTMLInputElement', 'HTMLIFrameElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent']) {
  globalThis[k] = dom.window[k];
}

const React = await import('react');
const ReactDOMClient = await import('react-dom/client');
const { flushSync } = await import('react-dom');
const { jalankanJs } = await import('../src/engine/jsEngine.js');
const { jalankanDom } = await import('../src/engine/domEngine.js');
const { susunPelajaran } = await import('../src/lessons/susun.js');

// Kode awal boleh saja punya Promise yang gagal tanpa .catch; jangan sampai script ini ikut mati.
process.on('unhandledRejection', () => {});

// Jangan tampilkan peringatan React (misalnya soal key) di output script.
const errorAsli = console.error;
console.error = () => {};

const modul = {};
for (const folder of readdirSync(folderPelajaran).sort()) {
  const p = join(folderPelajaran, folder);
  if (!statSync(p).isDirectory()) continue;
  for (const file of readdirSync(p).filter((f) => f.endsWith('.js')).sort()) {
    modul[`./${folder}/${file}`] = await import(pathToFileURL(join(p, file)).href);
  }
}

const { semuaPelajaran } = susunPelajaran(modul);
const target = semuaPelajaran.filter((p) => !filter || p.id.toLowerCase().includes(filter) || p.file.toLowerCase().includes(filter));

let rootLama = null;

async function jalankan(pelajaran, kode) {
  const batas = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout 8 detik')), 8000));
  if (pelajaran.tipe === 'js') return Promise.race([jalankanJs({ kode, pelajaran }), batas]);

  if (rootLama) {
    rootLama.unmount();
    rootLama = null;
  }
  document.head.innerHTML = pelajaran.css ? `<style>${pelajaran.css}</style>` : '';
  document.body.innerHTML = pelajaran.html ?? (pelajaran.tipe === 'react' ? '<div id="root"></div>' : '');
  return Promise.race([
    jalankanDom({
      kode,
      pelajaran,
      doc: document,
      win: window,
      React,
      ReactDOMClient,
      flushSync,
      onRoot: (r) => (rootLama = r),
    }),
    batas,
  ]);
}

let gagalTotal = 0;
for (const p of target) {
  const masalah = [];
  try {
    const hasilSolusi = await jalankan(p, p.solusi);
    for (const h of hasilSolusi.hasil.filter((h) => !h.lulus)) masalah.push(`solusi gagal tes "${h.nama}": ${h.pesan}`);
    if (hasilSolusi.error) masalah.push(`solusi menghasilkan error: ${hasilSolusi.error.split('\n')[0]}`);
    hasilSolusi.lepas?.();

    const hasilAwal = await jalankan(p, p.kodeAwal);
    if (hasilAwal.hasil.every((h) => h.lulus)) masalah.push('kodeAwal sudah lolos semua tes (latihan jadi "gratis")');
    hasilAwal.lepas?.();
  } catch (e) {
    masalah.push(`crash: ${e.stack ?? e}`);
  }
  if (masalah.length) {
    gagalTotal++;
    console.log(`❌ ${p.file}  (${p.id})`);
    for (const m of masalah) console.log(`     - ${m.replace(/\n/g, '\n       ')}`);
  } else {
    console.log(`✅ ${p.file}`);
  }
}

console.error = errorAsli;
console.log(`\n${target.length - gagalTotal}/${target.length} pelajaran OK.`);
if (rootLama) rootLama.unmount();
process.exit(gagalTotal ? 1 : 0);
