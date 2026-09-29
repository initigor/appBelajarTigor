// Fungsi bantu supaya file bank soal ringkas. Semua id soal harus unik di SEMUA ujian.
//
// pg(id, chapterId, pertanyaan, pilihan, indeksBenar, penjelasan, pelajaranId?)
//    - pertanyaan ditulis dalam Markdown (boleh berisi blok kode ~~~js ... ~~~)
//    - pilihan berupa teks biasa (bukan Markdown), jadi kode seperti `${nama}` tampil apa adanya
//    - pgk(...) = pg dengan pilihan berupa kode/nilai (ditampilkan monospace)
//
// output(id, chapterId, kode, kunci, penjelasan, pelajaranId?)
//    - kode dijalankan di engine yang sama dengan latihan; `kunci` = isi console persis (satu baris per console.log).
//      `npm run check-ujian` memastikan kunci ini cocok dengan hasil sebenarnya.
//
// kode(id, chapterId, { jenis: 'js'|'dom'|'react', tugas, kodeAwal, solusi, tes, penjelasan, pelajaran?, html?, css?, globals?, batasWaktu? })
//    - `tes` sama persis formatnya dengan tes di pelajaran biasa (ctx.panggil, ctx.klik, dst.)

export const pg = (id, chapterId, pertanyaan, pilihan, benar, penjelasan, pelajaran) => ({
  id,
  tipe: 'pilihan-ganda',
  chapterId,
  pelajaran,
  pertanyaan,
  pilihan,
  benar,
  penjelasan,
});

/** Sama seperti pg, tetapi pilihan jawabannya berupa KODE/nilai, jadi ditampilkan dengan huruf monospace. */
export const pgk = (...args) => ({ ...pg(...args), kodePilihan: true });

export const output = (id, chapterId, kode, kunci, penjelasan, pelajaran) => ({
  id,
  tipe: 'prediksi-output',
  chapterId,
  pelajaran,
  kode,
  kunci,
  penjelasan,
});

export const kode = (id, chapterId, opsi) => ({ id, tipe: 'kode', chapterId, ...opsi });

/** Gabungkan baris-baris kode menjadi satu string (berguna untuk cuplikan yang memuat backtick / ${...}). */
export const baris = (...b) => b.join('\n');
