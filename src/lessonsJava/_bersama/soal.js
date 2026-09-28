// Helper bersama untuk bank soal "Uji Pemahaman" (dan "Latihan V-3"). Lihat src/pages/UjiPemahamanJava.jsx.
//
// Skema satu soal:
//   { id, lessonId, tipe: 'pilihan-ganda'|'isian-singkat'|'prediksi-output'|'kode-singkat', penjelasan, ...field khusus tipe }
//   - pilihan-ganda   : { pertanyaan, kode?, pilihan: [{teks, benar}] }
//   - isian-singkat   : { pertanyaan, kode?, kunci: string|string[] }               (dibandingkan longgar: trim, lowercase, spasi dirapikan)
//   - prediksi-output : { kode, kelasUtama? }                                       (kode dijalankan sungguhan, dibandingkan dgn ctx.samaOutput)
//   - kode-singkat    : { instruksi, kelasUtama, kodeAwal: {nama,isi}[], tes: [{nama, stdin, harap}] }

/** Pilih `jumlah` soal per pelajaran untuk satu attempt uji, menghindari id yang sudah pernah dipakai bila memungkinkan. */
export function pilihSoalAttempt(bank, lessonIds, idSudahDipakai, jumlah = 2) {
  const dipakai = new Set(idSudahDipakai);
  const hasil = {};
  const dipakaiBaru = new Set(dipakai);
  for (const lessonId of lessonIds) {
    const semua = bank[lessonId] ?? [];
    const belum = semua.filter((s) => !dipakai.has(s.id));
    const kolam = belum.length >= jumlah ? belum : semua; // bank habis -> boleh mengulang
    const dipilih = acakAmbil(kolam, Math.min(jumlah, semua.length));
    hasil[lessonId] = dipilih;
    for (const s of dipilih) dipakaiBaru.add(s.id);
  }
  return { soalPerLesson: hasil, idDipakaiBaru: [...dipakaiBaru] };
}

function acakAmbil(arr, n) {
  const salinan = [...arr];
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
  }
  return salinan.slice(0, n);
}

/** Normalisasi longgar untuk jawaban isian-singkat. */
export function normalKunci(s) {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}
export function cocokKunci(jawaban, kunci) {
  const daftar = Array.isArray(kunci) ? kunci : [kunci];
  const n = normalKunci(jawaban);
  return daftar.some((k) => normalKunci(k) === n);
}
