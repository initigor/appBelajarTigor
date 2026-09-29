// Memeriksa semua bank soal ujian (src/ujian/ujian-*.js):
//   1. Struktur & id valid (id unik, chapterId sesuai, pelajaran yang ditautkan ada, komposisi tercukupi).
//   2. Soal "prediksi output": `kunci` harus SAMA dengan output console sebenarnya saat kode dijalankan.
//   3. Soal "kode": `solusi` harus lolos semua tes, dan `kodeAwal` TIDAK boleh langsung lolos semua tes.
//   4. Pemilihan soal acak menghasilkan komposisi yang tepat, tanpa soal kembar.
//
// Pemakaian:
//   npm run check-ujian             -> cek semua ujian
//   npm run check-ujian -- ujian-1  -> cek ujian yang id/file-nya mengandung "ujian-1"
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const filter = process.argv[2]?.toLowerCase();

// DOM global harus ada SEBELUM react-dom dimuat.
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
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
const { susunUjian, jadikanPelajaran, pilihSoal, ringkasKomposisi, samaOutput, nilaiStatis, urutanPilihan, hitungHasil } = await import('../src/ujian/susun.js');

process.on('unhandledRejection', () => {});
const errorAsli = console.error;
console.error = () => {};

// ---- muat pelajaran (sebagai acuan chapter & tautan) ----
const modulPelajaran = {};
const folderPelajaran = join(root, 'src', 'lessons');
for (const folder of readdirSync(folderPelajaran).sort()) {
  const p = join(folderPelajaran, folder);
  if (!statSync(p).isDirectory()) continue;
  for (const file of readdirSync(p).filter((f) => f.endsWith('.js')).sort()) {
    modulPelajaran[`./${folder}/${file}`] = await import(pathToFileURL(join(p, file)).href);
  }
}
const { semuaPelajaran, daftarChapter, pelajaranById } = susunPelajaran(modulPelajaran);

// ---- muat ujian ----
const folderUjian = join(root, 'src', 'ujian');
const modulUjian = {};
for (const file of readdirSync(folderUjian).filter((f) => /^ujian-.*\.js$/.test(f)).sort()) {
  modulUjian[`./${file}`] = await import(pathToFileURL(join(folderUjian, file)).href);
}

let daftarUjian;
try {
  daftarUjian = susunUjian(modulUjian, { chapterAda: (id) => daftarChapter.some((c) => c.id === id), pelajaran: (id) => pelajaranById[id] });
} catch (e) {
  console.log(`❌ Struktur bank soal tidak valid: ${e.message}`);
  process.exit(1);
}

let rootLama = null;
async function jalankanKode(pelajaran, kode) {
  const batas = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout 8 detik')), 8000));
  if (pelajaran.tipe === 'js') return Promise.race([jalankanJs({ kode, pelajaran }), batas]);
  if (rootLama) {
    rootLama.unmount();
    rootLama = null;
  }
  document.head.innerHTML = pelajaran.css ? `<style>${pelajaran.css}</style>` : '';
  document.body.innerHTML = pelajaran.html ?? (pelajaran.tipe === 'react' ? '<div id="root"></div>' : '');
  return Promise.race([
    jalankanDom({ kode, pelajaran, doc: document, win: window, React, ReactDOMClient, flushSync, onRoot: (r) => (rootLama = r) }),
    batas,
  ]);
}

const target = daftarUjian.filter((u) => !filter || u.id.toLowerCase().includes(filter) || u.file.toLowerCase().includes(filter));
let gagalTotal = 0;
let totalSoal = 0;

for (const u of target) {
  const masalah = [];
  const hitung = { 'pilihan-ganda': 0, 'prediksi-output': 0, kode: 0 };

  for (const s of u.soal) {
    totalSoal++;
    hitung[s.tipe]++;
    try {
      if (s.tipe === 'prediksi-output') {
        const r = await jalankanKode({ id: s.id, tipe: 'js', tes: [] }, s.kode);
        const log = r.logs.filter((l) => l.level !== 'error').map((l) => l.text).join('\n');
        if (r.error) masalah.push(`${s.id}: kode menghasilkan error: ${r.error.split('\n')[0]}`);
        else if (!samaOutput(log, s.kunci)) masalah.push(`${s.id}: kunci tidak cocok.\n         kunci : ${JSON.stringify(s.kunci)}\n         nyata : ${JSON.stringify(log)}`);
      } else if (s.tipe === 'kode') {
        const p = jadikanPelajaran(s);
        const sol = await jalankanKode(p, s.solusi);
        for (const h of sol.hasil.filter((h) => !h.lulus)) masalah.push(`${s.id}: solusi gagal tes "${h.nama}": ${h.pesan}`);
        if (sol.error) masalah.push(`${s.id}: solusi menghasilkan error: ${sol.error.split('\n')[0]}`);
        sol.lepas?.();
        const awal = await jalankanKode(p, s.kodeAwal);
        if (awal.hasil.every((h) => h.lulus)) masalah.push(`${s.id}: kodeAwal sudah lolos semua tes (soal jadi "gratis")`);
        awal.lepas?.();
      }
    } catch (e) {
      masalah.push(`${s.id}: crash: ${e.stack ?? e}`);
    }
  }

  // Pemilihan soal: komposisi tepat, tanpa kembar, dan bervariasi antar-percobaan.
  const ringkas = ringkasKomposisi(u);
  const semuaPercobaan = new Set();
  for (let i = 0; i < 100; i++) {
    const pilih = pilihSoal(u, {});
    const ids = pilih.map((s) => s.id);
    if (new Set(ids).size !== ids.length) masalah.push('pilihSoal menghasilkan soal kembar');
    if (pilih.length !== ringkas.soal) masalah.push(`pilihSoal menghasilkan ${pilih.length} soal, seharusnya ${ringkas.soal}`);
    semuaPercobaan.add(ids.slice().sort().join(','));
  }
  if (ringkas.soal < u.soal.length && semuaPercobaan.size < 2) masalah.push('pilihSoal tidak pernah bervariasi antar-percobaan');

  // Simulasi penilaian: menjawab semua benar harus 100%, semua salah 0%.
  const pilih = pilihSoal(u, {});
  const benar = {};
  const salah = {};
  for (const s of pilih) {
    const urutan = s.tipe === 'pilihan-ganda' ? urutanPilihan(s) : null;
    const jawabBenar = s.tipe === 'pilihan-ganda' ? urutan.indexOf(s.benar) : s.tipe === 'prediksi-output' ? s.kunci : null;
    benar[s.id] = s.tipe === 'kode' ? true : nilaiStatis(s, jawabBenar, urutan);
    salah[s.id] = false;
  }
  if (hitungHasil(u, pilih, benar).persen !== 100) masalah.push('simulasi semua benar ≠ 100%');
  if (hitungHasil(u, pilih, salah).persen !== 0) masalah.push('simulasi semua salah ≠ 0%');

  const info = `${u.soal.length} soal (${hitung['pilihan-ganda']} PG, ${hitung['prediksi-output']} output, ${hitung.kode} kode) → ujian ${ringkas.soal} soal / ${ringkas.poin} poin`;
  if (masalah.length) {
    gagalTotal++;
    console.log(`❌ ${u.file}  (${u.id}) — ${info}`);
    for (const m of masalah) console.log(`     - ${m}`);
  } else {
    console.log(`✅ ${u.file} — ${info}`);
  }
}

console.error = errorAsli;
console.log(`\n${target.length - gagalTotal}/${target.length} ujian OK (${totalSoal} soal diperiksa).`);
if (rootLama) rootLama.unmount();
process.exit(gagalTotal ? 1 : 0);
