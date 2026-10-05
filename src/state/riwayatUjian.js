// Riwayat percobaan ujian (jawaban + hasil penilaian per soal) supaya hasil ujian bisa ditinjau
// berulang kali. Disimpan di localStorage dan, bila sudah masuk akun, disinkronkan ke cloud
// (lihat src/state/akun.jsx) sehingga muncul di semua perangkat. Penggabungan antarperangkat
// ada di src/state/gabungRiwayat.js. Hanya skor ringkas yang ada di progress.ujian.
//
// Satu percobaan: {
//   id, ujianId, waktu, persen, poin, maks, lulus, perChapter,
//   soal: [{ id, benar, jawaban, urutan, pesan }]   // urut seperti saat dikerjakan
// }
// Soal sendiri (pertanyaan, kunci, pembahasan) tidak disalin: dibaca dari bank soal saat ditinjau.
import { useSyncExternalStore } from 'react';
import { MAKS_PER_UJIAN, bersihkanRiwayat, rapikanRiwayat } from './gabungRiwayat.js';

export { MAKS_PER_UJIAN };
const KUNCI = 'latihkode:ujian-riwayat:v1';
const MAKS_KARAKTER_JAWABAN = 20000;

function muat() {
  try {
    return rapikanRiwayat(JSON.parse(localStorage.getItem(KUNCI) ?? 'null'));
  } catch {
    return rapikanRiwayat(null);
  }
}

function tulis(r) {
  // Penyimpanan penuh: buang percobaan paling lama satu per satu sampai muat.
  let isi = r;
  while (true) {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(isi));
      return;
    } catch {
      if (isi.percobaan.length <= 1) return;
      isi = { ...isi, percobaan: isi.percobaan.slice(0, -1) };
    }
  }
}

// ---------- Pemberitahuan perubahan ----------
// jenis 'lokal'   : pengguna menambah/menghapus riwayat -> perlu dikirim ke cloud
// jenis 'sinkron' : isi diganti oleh hasil sinkron      -> hanya perlu menyegarkan tampilan
let versi = 0;
const pendengar = new Set();
function umumkan(jenis) {
  versi++;
  pendengar.forEach((f) => f(jenis));
}
export function langgananRiwayat(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}
/** Angka yang naik setiap riwayat berubah; dipakai komponen supaya ikut menyegarkan tampilan. */
export function useVersiRiwayat() {
  return useSyncExternalStore(langgananRiwayat, () => versi, () => versi);
}

// ---------- Baca ----------

/** Semua percobaan, terbaru di atas. Jika `ujianId` diberikan, hanya milik ujian itu. */
export function daftarRiwayat(ujianId) {
  const semua = muat().percobaan.sort((a, b) => b.waktu - a.waktu);
  return ujianId ? semua.filter((p) => p.ujianId === ujianId) : semua;
}

export function ambilPercobaan(id) {
  return muat().percobaan.find((p) => p.id === id) ?? null;
}

// ---------- Tulis ----------

const potong = (j) => (typeof j === 'string' && j.length > MAKS_KARAKTER_JAWABAN ? j.slice(0, MAKS_KARAKTER_JAWABAN) : j);

/** Simpan satu percobaan baru; mengembalikan id-nya. Percobaan terlama di atas batas per ujian dibuang. */
export function simpanPercobaan({ ujianId, ringkasan, daftarSoal, benar, urutan, jawaban, pesan }) {
  const waktu = Date.now();
  const percobaan = {
    id: `r-${waktu.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
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
  const lama = muat();
  tulis(bersihkanRiwayat({ ...lama, percobaan: [percobaan, ...lama.percobaan] }));
  umumkan('lokal');
  return percobaan.id;
}

export function hapusPercobaan(id) {
  const lama = muat();
  tulis(bersihkanRiwayat({ ...lama, percobaan: lama.percobaan.filter((p) => p.id !== id), dihapus: [...lama.dihapus, id] }));
  umumkan('lokal');
}

/** Hapus seluruh riwayat, termasuk di perangkat lain (lewat penanda waktu `reset` saat sinkron). */
export function hapusSemuaRiwayat() {
  const lama = muat();
  tulis({ percobaan: [], dihapus: lama.dihapus, reset: Date.now() });
  umumkan('lokal');
}

// ---------- Sinkron ----------

/** Isi lengkap (termasuk batu nisan & reset) untuk digabung dengan cloud. */
export function ambilUntukSinkron() {
  return muat();
}

/** Ganti isi lokal dengan hasil gabungan dari sinkron. */
export function terapkanDariSinkron(gabungan) {
  tulis(rapikanRiwayat(gabungan));
  umumkan('sinkron');
}
