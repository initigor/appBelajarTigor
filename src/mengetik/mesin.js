// Mesin latihan mengetik: murni (tanpa React/DOM) supaya bisa dites di Node.
//
// Aturan: kesalahan TIDAK maju. Posisi hanya bergerak bila karakter yang diketik benar, sehingga
// pengguna dipaksa menemukan tombol dan jari yang tepat (cara belajar mengetik sepuluh jari).
// Akurasi = ketukan benar / seluruh ketukan. Waktu aktif memotong jeda panjang agar WPM tidak
// "dihukum" saat pengguna berhenti sebentar.

export const JEDA_MAKS = 3000; // ms: jeda antar-ketukan yang dihitung paling lama

// ‘ ’ → '   “ ” → "   – — → -   spasi tak-terputus → spasi
const BENGKOK = { '‘': "'", '’': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ' };

/** Keyboard layar sentuh kadang mengganti kutip lurus dengan kutip melengkung (smart punctuation). */
export function normalisasi(teks) {
  return [...String(teks)]
    .map((c) => BENGKOK[c] ?? c)
    .join('')
    .replace(/\r\n?/g, '\n');
}

export function mulaiSesi(baris) {
  return {
    teks: baris.join('\n'),
    pos: 0,
    benar: 0,
    salah: 0,
    aktifMs: 0,
    terakhir: null,
    perKarakter: {}, // { [karakter sasaran]: { benar, salah } }
    salahTerakhir: null, // { sasaran, diketik, n } untuk memicu efek sesaat di layar
    selesai: false,
  };
}

/** Proses satu karakter yang diketik pada waktu `kini` (ms). Mengembalikan state baru. */
export function ketik(s, ch, kini) {
  if (s.selesai || ch === '' || ch == null) return s;
  const sasaran = s.teks[s.pos];
  const aktifMs = s.terakhir === null ? 0 : s.aktifMs + Math.min(Math.max(kini - s.terakhir, 0), JEDA_MAKS);
  const lama = s.perKarakter[sasaran] ?? { benar: 0, salah: 0 };
  if (ch === sasaran) {
    const pos = s.pos + 1;
    return {
      ...s,
      pos,
      benar: s.benar + 1,
      aktifMs,
      terakhir: kini,
      perKarakter: { ...s.perKarakter, [sasaran]: { ...lama, benar: lama.benar + 1 } },
      salahTerakhir: null,
      selesai: pos >= s.teks.length,
    };
  }
  return {
    ...s,
    salah: s.salah + 1,
    aktifMs,
    terakhir: kini,
    perKarakter: { ...s.perKarakter, [sasaran]: { ...lama, salah: lama.salah + 1 } },
    salahTerakhir: { sasaran, diketik: ch, n: (s.salahTerakhir?.n ?? 0) + 1 },
  };
}

export const akurasiDari = (benar, salah) => (benar + salah === 0 ? 100 : Math.round((benar / (benar + salah)) * 1000) / 10);

/** WPM standar: 5 karakter = 1 kata. Karakter pertama tidak punya selang waktu, jadi tidak dihitung. */
export function wpmDari(benar, aktifMs) {
  const menit = Math.max(aktifMs, 1000) / 60000;
  return Math.round((Math.max(benar - 1, 0) / 5 / menit) * 10) / 10;
}

export function ringkas(s) {
  const lemah = Object.entries(s.perKarakter)
    .filter(([, v]) => v.salah > 0)
    .map(([ch, v]) => ({ ch, salah: v.salah, total: v.benar + v.salah }))
    .sort((a, b) => b.salah - a.salah || a.ch.localeCompare(b.ch));
  return {
    wpm: wpmDari(s.benar, s.aktifMs),
    akurasi: akurasiDari(s.benar, s.salah),
    benar: s.benar,
    salah: s.salah,
    aktifMs: s.aktifMs,
    persen: s.teks.length ? Math.round((s.pos / s.teks.length) * 100) : 0,
    lemah,
  };
}

export const AMBANG = { bintang2: 92, bintang3: 97 };

/** 1★ selesai, 2★ akurasi ≥ 92%, 3★ akurasi ≥ 97% dan kecepatan mencapai target tahap. */
export function hitungBintang(hasil, targetWpm = 0) {
  if (hasil.akurasi >= AMBANG.bintang3 && hasil.wpm >= targetWpm) return 3;
  if (hasil.akurasi >= AMBANG.bintang2) return 2;
  return 1;
}

/** Posisi dalam banyak baris: { baris, kolom } dari indeks karakter di teks bergabung. */
export function posisiBaris(teks, pos) {
  let baris = 0;
  let awal = 0;
  for (let i = 0; i < pos && i < teks.length; i++) {
    if (teks[i] === '\n') {
      baris++;
      awal = i + 1;
    }
  }
  return { baris, kolom: pos - awal };
}
