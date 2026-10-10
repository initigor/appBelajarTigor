// Menggabungkan progress dari dua sumber (perangkat ini & cloud) tanpa kehilangan pelajaran yang sudah selesai.
//
// Aturan:
// - Jika salah satu sisi pernah di-reset SETELAH sisi lain terakhir diubah, sisi lain itu diabaikan
//   (dia belum "tahu" ada reset, jadi datanya dianggap usang).
// - selesai   : gabungan keduanya (tanggal paling awal dipakai)
// - percobaan : ambil yang terbesar
// - kode      : ambil dari sisi yang lebih baru diubah; pelajaran yang hanya ada di satu sisi tetap dipakai
// - streak    : ambil yang tanggal terakhirnya paling baru (jika sama, jumlah terbesar)
// - kuis      : skor terbaik & percobaan diambil yang terbesar
// - ujian     : skor terbaik & percobaan diambil yang terbesar, lulus jika salah satu sudah lulus
// - mengetik  : bintang, WPM, akurasi terbaik & percobaan diambil yang terbesar

const kosong = () => ({ selesai: {}, kode: {}, percobaan: {}, ujian: {}, kuis: {}, mengetik: {}, streak: { jumlah: 0, terakhir: null }, diubah: 0, resetPada: 0 });

function rapikan(p) {
  const k = kosong();
  if (!p || typeof p !== 'object') return k;
  return {
    selesai: p.selesai ?? k.selesai,
    kode: p.kode ?? k.kode,
    percobaan: p.percobaan ?? k.percobaan,
    ujian: p.ujian ?? k.ujian,
    kuis: p.kuis ?? k.kuis,
    mengetik: p.mengetik ?? k.mengetik,
    streak: p.streak ?? k.streak,
    diubah: p.diubah ?? 0,
    resetPada: p.resetPada ?? 0,
  };
}

function gabungUjian(x = {}, y = {}) {
  const hasil = {};
  for (const id of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const p = x[id];
    const q = y[id];
    if (!p || !q) {
      hasil[id] = p ?? q;
      continue;
    }
    const baru = (p.terakhir?.waktu ?? 0) >= (q.terakhir?.waktu ?? 0) ? p : q;
    hasil[id] = {
      terbaik: Math.max(p.terbaik ?? 0, q.terbaik ?? 0),
      lulus: Boolean(p.lulus || q.lulus),
      tanggalLulus: [p.tanggalLulus, q.tanggalLulus].filter(Boolean).sort()[0] ?? null,
      percobaan: Math.max(p.percobaan ?? 0, q.percobaan ?? 0),
      xp: Math.max(p.xp || 0, q.xp || 0),
      terakhir: baru.terakhir,
      soalTerakhir: baru.soalTerakhir,
    };
  }
  return hasil;
}

function gabungKuis(x = {}, y = {}) {
  const hasil = {};
  for (const id of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const p = x[id];
    const q = y[id];
    if (!p || !q) {
      hasil[id] = p ?? q;
      continue;
    }
    const baru = (p.tanggal ?? '') >= (q.tanggal ?? '') ? p : q;
    hasil[id] = {
      terbaik: Math.max(p.terbaik ?? 0, q.terbaik ?? 0),
      terakhir: baru.terakhir,
      percobaan: Math.max(p.percobaan ?? 0, q.percobaan ?? 0),
      tanggal: baru.tanggal,
    };
  }
  return hasil;
}

function gabungMengetik(x = {}, y = {}) {
  const hasil = {};
  for (const id of new Set([...Object.keys(x), ...Object.keys(y)])) {
    const p = x[id];
    const q = y[id];
    if (!p || !q) {
      hasil[id] = p ?? q;
      continue;
    }
    hasil[id] = {
      bintang: Math.max(p.bintang ?? 0, q.bintang ?? 0),
      wpm: Math.max(p.wpm ?? 0, q.wpm ?? 0),
      akurasi: Math.max(p.akurasi ?? 0, q.akurasi ?? 0),
      percobaan: Math.max(p.percobaan ?? 0, q.percobaan ?? 0),
      tanggal: [p.tanggal, q.tanggal].filter(Boolean).sort().at(-1) ?? null,
    };
  }
  return hasil;
}

export function gabungProgress(lokalMentah, cloudMentah) {
  const lokal = rapikan(lokalMentah);
  const cloud = rapikan(cloudMentah);

  const resetPada = Math.max(lokal.resetPada, cloud.resetPada);
  const lokalUsang = resetPada > 0 && lokal.diubah < resetPada && lokal.resetPada < resetPada;
  const cloudUsang = resetPada > 0 && cloud.diubah < resetPada && cloud.resetPada < resetPada;
  const a = lokalUsang ? { ...kosong(), resetPada } : lokal;
  const b = cloudUsang ? { ...kosong(), resetPada } : cloud;

  const selesai = { ...b.selesai };
  for (const [id, s] of Object.entries(a.selesai)) {
    const lain = selesai[id];
    selesai[id] = !lain || (s.tanggal && s.tanggal < lain.tanggal) ? s : lain;
  }

  const percobaan = { ...b.percobaan };
  for (const [id, n] of Object.entries(a.percobaan)) percobaan[id] = Math.max(n, percobaan[id] ?? 0);

  const [baru, lama] = a.diubah >= b.diubah ? [a, b] : [b, a];
  const kode = { ...lama.kode, ...baru.kode };

  const sa = a.streak;
  const sb = b.streak;
  let streak;
  if (!sa.terakhir) streak = sb;
  else if (!sb.terakhir) streak = sa;
  else if (sa.terakhir !== sb.terakhir) streak = sa.terakhir > sb.terakhir ? sa : sb;
  else streak = sa.jumlah >= sb.jumlah ? sa : sb;

  const ujian = gabungUjian(a.ujian, b.ujian);
  const kuis = gabungKuis(a.kuis, b.kuis);
  const mengetik = gabungMengetik(a.mengetik, b.mengetik);

  return { selesai, kode, percobaan, ujian, kuis, mengetik, streak, diubah: Math.max(a.diubah, b.diubah), resetPada };
}

/** Bagian progress yang dikirim ke cloud (tema tetap per perangkat). */
export function bagianCloud(p) {
  const { selesai, kode, percobaan, ujian, kuis, mengetik, streak, diubah, resetPada } = rapikan(p);
  return { selesai, kode, percobaan, ujian, kuis, mengetik, streak, diubah, resetPada };
}
