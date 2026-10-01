// Riwayat percobaan ujian (jawaban + hasil penilaian per soal) supaya hasil ujian bisa ditinjau
// berulang kali. Disimpan di localStorage perangkat ini, TERPISAH dari progress: jawaban (apalagi kode)
// cukup besar, jadi tidak ikut sinkron ke cloud. Hanya skor ringkas yang ada di progress.ujian.
//
// Satu percobaan: {
//   id, ujianId, waktu, persen, poin, maks, lulus, perChapter,
//   soal: [{ id, benar, jawaban, urutan, pesan }]   // urut seperti saat dikerjakan
// }
// Soal sendiri (pertanyaan, kunci, pembahasan) tidak disalin: dibaca dari bank soal saat ditinjau.
const KUNCI = 'latihkode:ujian-riwayat:v1';
export const MAKS_PER_UJIAN = 20;
const MAKS_KARAKTER_JAWABAN = 20000;

function muat() {
  try {
    const d = JSON.parse(localStorage.getItem(KUNCI) ?? 'null');
    return Array.isArray(d?.percobaan) ? d.percobaan : [];
  } catch {
    return [];
  }
}

function simpan(percobaan) {
  // Penyimpanan penuh: buang percobaan paling lama satu per satu sampai muat.
  let isi = percobaan;
  while (true) {
    try {
      localStorage.setItem(KUNCI, JSON.stringify({ percobaan: isi }));
      return;
    } catch {
      if (isi.length <= 1) return;
      isi = isi.slice(0, -1);
    }
  }
}

/** Semua percobaan, terbaru di atas. Jika `ujianId` diberikan, hanya milik ujian itu. */
export function daftarRiwayat(ujianId) {
  const semua = muat().sort((a, b) => b.waktu - a.waktu);
  return ujianId ? semua.filter((p) => p.ujianId === ujianId) : semua;
}

export function ambilPercobaan(id) {
  return muat().find((p) => p.id === id) ?? null;
}

const potong = (j) => (typeof j === 'string' && j.length > MAKS_KARAKTER_JAWABAN ? j.slice(0, MAKS_KARAKTER_JAWABAN) : j);

/** Simpan satu percobaan baru; mengembalikan id-nya. Percobaan terlama di atas batas per ujian dibuang. */
export function simpanPercobaan({ ujianId, ringkasan, daftarSoal, benar, urutan, jawaban, pesan }) {
  const waktu = Date.now();
  const percobaan = {
    id: `r-${waktu.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    ujianId,
    waktu,
    persen: ringkasan.persen,
    poin: ringkasan.poin,
    maks: ringkasan.maks,
    lulus: ringkasan.lulus,
    perChapter: ringkasan.perChapter,
    soal: daftarSoal.map((s) => ({
      id: s.id,
      benar: Boolean(benar[s.id]),
      jawaban: potong(jawaban[s.id] ?? null),
      urutan: urutan[s.id] ?? null,
      pesan: pesan[s.id] ?? null,
    })),
  };
  const semua = [percobaan, ...muat()].sort((a, b) => b.waktu - a.waktu);
  const lolos = [];
  const hitung = {};
  for (const p of semua) {
    hitung[p.ujianId] = (hitung[p.ujianId] ?? 0) + 1;
    if (hitung[p.ujianId] <= MAKS_PER_UJIAN) lolos.push(p);
  }
  simpan(lolos);
  return percobaan.id;
}

export function hapusPercobaan(id) {
  simpan(muat().filter((p) => p.id !== id));
}

export function hapusSemuaRiwayat() {
  try {
    localStorage.removeItem(KUNCI);
  } catch {
    /* abaikan */
  }
}
