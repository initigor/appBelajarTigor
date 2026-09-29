// Pengelompokan chapter ke dalam "materi" (container level atas di Beranda).
// Untuk memindahkan chapter ke materi lain, atau membuat materi baru, cukup ubah `chapterIds`.
// Chapter yang belum didaftarkan di sini tetap tampil, di container "Lainnya", jadi tidak akan hilang diam-diam.
export const daftarMateriJs = [
  {
    id: 'javascript',
    judul: 'JavaScript',
    ikon: '🟨',
    deskripsi: 'Dari dasar bahasa, fungsi, array & object, sampai DOM dan async.',
    chapterIds: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 'react',
    judul: 'React',
    ikon: '⚛️',
    deskripsi: 'Komponen, state, list, dan proyek akhir: web portofolio.',
    chapterIds: [9, 10, 11, 12],
  },
  {
    id: 'backend',
    judul: 'Backend Node.js',
    ikon: '🔌',
    deskripsi: 'Node.js, HTTP, dan membuat REST API sendiri.',
    chapterIds: [13],
  },
];

/** Gabungkan config materi dengan data chapter yang sebenarnya (urutan chapter mengikuti `chapterIds`). */
export function susunMateri(config, daftarChapter) {
  const dipakai = new Set();
  const hasil = config
    .map((m) => {
      const chapters = m.chapterIds.map((id) => daftarChapter.find((c) => c.id === id)).filter(Boolean);
      chapters.forEach((c) => dipakai.add(c.id));
      return { ...m, chapters };
    })
    .filter((m) => m.chapters.length > 0);

  const sisa = daftarChapter.filter((c) => !dipakai.has(c.id));
  if (sisa.length > 0) {
    hasil.push({ id: 'lainnya', judul: 'Lainnya', ikon: '📦', deskripsi: 'Chapter yang belum dikelompokkan.', chapterIds: sisa.map((c) => c.id), chapters: sisa });
  }
  return hasil;
}
