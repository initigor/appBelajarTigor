// Menyusun daftar pekan & pelajaran Java dari file-file pelajaran (analog src/lessons/susun.js untuk JS).
import { chaptersJava } from './chapters.js';

const WAJIB_UMUM = ['id', 'judul', 'tipe', 'subtipe', 'pekan', 'xp', 'materi', 'tugas'];
const SUBTIPE_VALID = ['kode-output', 'kode-kelas', 'prediksi', 'bedah-galat', 'diagram-memori'];
const WAJIB_PER_SUBTIPE = {
  'kode-output': ['kelasUtama', 'kodeAwal', 'solusi', 'tes'],
  'kode-kelas': ['kodeAwal', 'solusi', 'tesUtamaNama', 'tesUtamaIsi', 'daftarTes'],
  prediksi: ['kodeCuplikan', 'penjelasan'],
  'bedah-galat': ['kodeBermasalah', 'kelasUtama', 'pilihanPenyebab', 'jenisGalatBenar', 'penjelasan', 'solusi', 'tes'],
  'diagram-memori': ['kodeCuplikan', 'pertanyaan', 'penjelasan'],
};

/** @param {Record<string, object>} modulPerPath */
export function susunPelajaranJava(modulPerPath) {
  const paths = Object.keys(modulPerPath).sort();
  const daftar = [];
  const ids = new Set();
  for (const path of paths) {
    const m = path.match(/([^/]+)\/([^/]+)\.js$/);
    if (!m || m[1].startsWith('_') || m[2].startsWith('_')) continue;
    const [, folder, file] = m;
    const chapter = chaptersJava.find((c) => c.folder === folder);
    if (!chapter) throw new Error(`Folder "${folder}" belum didaftarkan di src/lessonsJava/chapters.js`);
    const p = modulPerPath[path].default ?? modulPerPath[path];
    for (const f of WAJIB_UMUM) if (p[f] === undefined) throw new Error(`Pelajaran Java ${path} tidak punya field "${f}"`);
    if (p.tipe !== 'java') throw new Error(`Pelajaran Java ${path}: field "tipe" harus 'java'`);
    if (!SUBTIPE_VALID.includes(p.subtipe)) throw new Error(`Pelajaran Java ${path}: subtipe "${p.subtipe}" tidak dikenal`);
    for (const f of WAJIB_PER_SUBTIPE[p.subtipe]) {
      if (p[f] === undefined) throw new Error(`Pelajaran Java ${path} (subtipe ${p.subtipe}) tidak punya field "${f}"`);
    }
    if (ids.has(p.id)) throw new Error(`id pelajaran Java "${p.id}" dipakai lebih dari sekali (${path})`);
    ids.add(p.id);
    daftar.push({ ...p, chapterId: chapter.id, file: `${folder}/${file}.js`, petunjuk: p.petunjuk ?? [] });
  }
  daftar.forEach((p, i) => {
    p.index = i;
    p.sebelum = daftar[i - 1]?.id ?? null;
    p.sesudah = daftar[i + 1]?.id ?? null;
  });
  const daftarChapterJava = chaptersJava.map((c) => ({ ...c, pelajaran: daftar.filter((p) => p.chapterId === c.id) }));
  const byId = Object.fromEntries(daftar.map((p) => [p.id, p]));
  return { semuaPelajaranJava: daftar, daftarChapterJava, pelajaranByIdJava: byId };
}
