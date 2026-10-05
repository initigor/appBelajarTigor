// Menggabungkan riwayat ujian dari dua sumber (perangkat ini & cloud) tanpa kehilangan percobaan.
// Fungsi murni, tanpa React/DOM.
//
// Bentuk data: { percobaan: [...], dihapus: [idPercobaan], reset: timestamp }
// Aturan:
// - percobaan : gabungan keduanya (kunci = id percobaan, id unik di semua perangkat)
// - dihapus   : "batu nisan" id yang sengaja dihapus, supaya percobaan itu tidak hidup lagi saat sinkron
// - reset     : waktu terakhir seluruh riwayat dihapus; percobaan yang dibuat sebelum itu dibuang
// - hasil dibatasi MAKS_PER_UJIAN percobaan terbaru per ujian, sehingga semua perangkat konvergen ke isi yang sama

export const MAKS_PER_UJIAN = 20;
export const MAKS_DIHAPUS = 300;

const sah = (p) => p && typeof p.id === 'string' && typeof p.ujianId === 'string' && Number.isFinite(p.waktu) && Array.isArray(p.soal);

export function rapikanRiwayat(r) {
  return {
    percobaan: Array.isArray(r?.percobaan) ? r.percobaan.filter(sah) : [],
    dihapus: Array.isArray(r?.dihapus) ? r.dihapus.filter((x) => typeof x === 'string') : [],
    reset: Number.isFinite(r?.reset) ? r.reset : 0,
  };
}

/** Terapkan batas reset, batu nisan, dan batas per ujian pada satu kumpulan percobaan. */
export function bersihkanRiwayat(r, maksPerUjian = MAKS_PER_UJIAN) {
  const { percobaan, dihapus, reset } = rapikanRiwayat(r);
  const nisan = new Set(dihapus);
  const peta = new Map();
  for (const p of percobaan) {
    if (p.waktu > reset && !nisan.has(p.id) && !peta.has(p.id)) peta.set(p.id, p);
  }
  const hitung = {};
  const lolos = [];
  for (const p of [...peta.values()].sort((a, b) => b.waktu - a.waktu)) {
    hitung[p.ujianId] = (hitung[p.ujianId] ?? 0) + 1;
    if (hitung[p.ujianId] <= maksPerUjian) lolos.push(p);
  }
  return { percobaan: lolos, dihapus: dihapus.slice(-MAKS_DIHAPUS), reset };
}

export function gabungRiwayat(a, b, maksPerUjian = MAKS_PER_UJIAN) {
  const x = rapikanRiwayat(a);
  const y = rapikanRiwayat(b);
  return bersihkanRiwayat(
    {
      percobaan: [...x.percobaan, ...y.percobaan],
      dihapus: [...new Set([...x.dihapus, ...y.dihapus])],
      reset: Math.max(x.reset, y.reset),
    },
    maksPerUjian,
  );
}

/** Buang percobaan paling lama sampai ukuran JSON-nya muat di batas cloud. */
export function potongUkuranRiwayat(r, maksKarakter = 600 * 1024) {
  const hasil = { ...r, percobaan: [...r.percobaan] };
  while (hasil.percobaan.length > 1 && JSON.stringify(hasil).length > maksKarakter) hasil.percobaan.pop();
  return hasil;
}
