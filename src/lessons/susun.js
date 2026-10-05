// Menyusun daftar chapter & pelajaran dari file-file pelajaran.
// Dipakai oleh aplikasi (lewat import.meta.glob) dan oleh scripts/check-lessons.js (lewat fs).
import { chapters } from './chapters.js';

const WAJIB = ['id', 'judul', 'tipe', 'xp', 'materi', 'tugas', 'kodeAwal', 'solusi', 'tes'];
// Pelajaran bertipe 'teks' (mis. Arsikom) hanya bacaan: selesai setelah kuisnya lulus, tanpa editor/tugas/tes.
const WAJIB_TEKS = ['id', 'judul', 'tipe', 'xp', 'materi'];

/** @param {Record<string, object>} modulPerPath  { './01-dasar-js/01-console-log.js': { default: {...} } } */
export function susunPelajaran(modulPerPath) {
  const paths = Object.keys(modulPerPath).sort();
  const daftar = [];
  const ids = new Set();
  for (const path of paths) {
    const m = path.match(/([^/]+)\/([^/]+)\.js$/);
    if (!m || m[1].startsWith('_') || m[2].startsWith('_')) continue; // folder/file berawalan _ = helper, bukan pelajaran
    const [, folder, file] = m;
    const chapter = chapters.find((c) => c.folder === folder);
    if (!chapter) throw new Error(`Folder "${folder}" belum didaftarkan di src/lessons/chapters.js`);
    const p = modulPerPath[path].default ?? modulPerPath[path];
    for (const f of p.tipe === 'teks' ? WAJIB_TEKS : WAJIB) if (p[f] === undefined) throw new Error(`Pelajaran ${path} tidak punya field "${f}"`);
    if (ids.has(p.id)) throw new Error(`id pelajaran "${p.id}" dipakai lebih dari sekali (${path})`);
    if (!['js', 'dom', 'react', 'teks'].includes(p.tipe)) throw new Error(`tipe pelajaran ${path} harus 'js', 'dom', 'react', atau 'teks'`);
    ids.add(p.id);
    daftar.push({ ...p, chapterId: chapter.id, file: `${folder}/${file}.js`, petunjuk: p.petunjuk ?? [] });
  }
  daftar.forEach((p, i) => {
    p.index = i;
    p.sebelum = daftar[i - 1]?.id ?? null;
    p.sesudah = daftar[i + 1]?.id ?? null;
  });
  const daftarChapter = chapters.map((c) => ({ ...c, pelajaran: daftar.filter((p) => p.chapterId === c.id) }));
  const byId = Object.fromEntries(daftar.map((p) => [p.id, p]));
  return { semuaPelajaran: daftar, daftarChapter, pelajaranById: byId };
}
