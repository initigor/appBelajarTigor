import { daftarChapter, pelajaranById } from '../lessons/index.js';
import { jadikanPelajaran, susunUjian } from './susun.js';

const modul = import.meta.glob('./ujian-*.js', { eager: true });

export const daftarUjian = susunUjian(modul, {
  chapterAda: (id) => daftarChapter.some((c) => c.id === id),
  pelajaran: (id) => pelajaranById[id],
});

export const ujianById = Object.fromEntries(daftarUjian.map((u) => [u.id, u]));

/** Soal bertipe 'kode' dalam bentuk "pelajaran", untuk dijalankan oleh engine (termasuk di Web Worker). */
export const soalKodeById = Object.fromEntries(
  daftarUjian.flatMap((u) => u.soal.filter((s) => s.tipe === 'kode').map((s) => [s.id, jadikanPelajaran(s)])),
);
