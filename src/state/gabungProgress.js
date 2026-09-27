// Menggabungkan progress dari dua sumber (perangkat ini & cloud) tanpa kehilangan pelajaran yang sudah selesai.
//
// Aturan:
// - Jika salah satu sisi pernah di-reset SETELAH sisi lain terakhir diubah, sisi lain itu diabaikan
//   (dia belum "tahu" ada reset, jadi datanya dianggap usang).
// - selesai   : gabungan keduanya (tanggal paling awal dipakai)
// - percobaan : ambil yang terbesar
// - kode      : ambil dari sisi yang lebih baru diubah; pelajaran yang hanya ada di satu sisi tetap dipakai
// - streak    : ambil yang tanggal terakhirnya paling baru (jika sama, jumlah terbesar)

const kosong = () => ({ selesai: {}, kode: {}, percobaan: {}, streak: { jumlah: 0, terakhir: null }, diubah: 0, resetPada: 0 });

function rapikan(p) {
  const k = kosong();
  if (!p || typeof p !== 'object') return k;
  return {
    selesai: p.selesai ?? k.selesai,
    kode: p.kode ?? k.kode,
    percobaan: p.percobaan ?? k.percobaan,
    streak: p.streak ?? k.streak,
    diubah: p.diubah ?? 0,
    resetPada: p.resetPada ?? 0,
  };
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

  return { selesai, kode, percobaan, streak, diubah: Math.max(a.diubah, b.diubah), resetPada };
}

/** Bagian progress yang dikirim ke cloud (tema tetap per perangkat). */
export function bagianCloud(p) {
  const { selesai, kode, percobaan, streak, diubah, resetPada } = rapikan(p);
  return { selesai, kode, percobaan, streak, diubah, resetPada };
}
