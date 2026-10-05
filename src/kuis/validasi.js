// Validasi bank kuis per pelajaran. Fungsi murni: dipakai oleh src/kuis/index.js (saat aplikasi dimuat)
// dan oleh scripts/check-kuis.js.
//
// Bentuk satu entri (kunci = id pelajaran):
// {
//   intisari: 'Kesimpulan dalam 1–2 kalimat.',
//   rangkuman: ['poin 1 (boleh `kode` & **tebal**)', ...],   // 3–6 poin
//   soal: [{ tanya, benar, salah: ['…', '…', '…'], jelas }],  // 3–5 soal pilihan ganda
// }
// `benar` ditulis terpisah dari `salah`; urutan pilihan diacak saat kuis ditampilkan.

export const MIN_SOAL = 3;
export const MAKS_SOAL = 5;

const teks = (x) => typeof x === 'string' && x.trim() !== '';

/** @returns {string[]} daftar masalah (kosong = valid) */
export function periksaKuis(kuisById, pelajaranById) {
  const masalah = [];
  const ada = (kondisi, pesan) => {
    if (!kondisi) masalah.push(pesan);
    return kondisi;
  };

  for (const id of Object.keys(kuisById)) ada(pelajaranById[id], `kuis "${id}": tidak ada pelajaran dengan id itu`);

  for (const id of Object.keys(pelajaranById)) {
    const k = kuisById[id];
    if (!ada(k, `pelajaran "${id}": belum punya kuis`)) continue;
    const di = `kuis "${id}"`;

    ada(teks(k.intisari), `${di}: intisari wajib diisi`);
    ada(Array.isArray(k.rangkuman) && k.rangkuman.length >= 3 && k.rangkuman.length <= 6 && k.rangkuman.every(teks), `${di}: rangkuman harus 3–6 poin teks`);
    if (!ada(Array.isArray(k.soal) && k.soal.length >= MIN_SOAL && k.soal.length <= MAKS_SOAL, `${di}: harus ${MIN_SOAL}–${MAKS_SOAL} soal`)) continue;

    const tanyaDipakai = new Set();
    k.soal.forEach((s, i) => {
      const dis = `${di} soal ${i + 1}`;
      ada(teks(s.tanya), `${dis}: tanya kosong`);
      ada(teks(s.jelas), `${dis}: jelas (penjelasan jawaban) wajib diisi`);
      if (tanyaDipakai.has(s.tanya)) masalah.push(`${dis}: pertanyaan kembar`);
      tanyaDipakai.add(s.tanya);
      if (!ada(teks(s.benar) && Array.isArray(s.salah) && s.salah.length >= 2 && s.salah.length <= 4 && s.salah.every(teks), `${dis}: butuh "benar" dan 2–4 pilihan "salah" berupa teks`)) return;
      const semua = [s.benar, ...s.salah];
      ada(new Set(semua.map((x) => x.trim())).size === semua.length, `${dis}: ada pilihan jawaban yang kembar`);
    });
  }
  return masalah;
}

/** Peringatan gaya (bukan error): jawaban benar selalu paling panjang membuat soal mudah ditebak. */
export function peringatanKuis(kuisById) {
  const hasil = [];
  for (const [id, k] of Object.entries(kuisById)) {
    const soal = k.soal ?? [];
    const terpanjang = soal.filter((s) => s.salah.every((x) => s.benar.length > x.length)).length;
    if (soal.length >= 3 && terpanjang === soal.length) hasil.push(`kuis "${id}": jawaban benar selalu pilihan terpanjang (mudah ditebak)`);
  }
  return hasil;
}
