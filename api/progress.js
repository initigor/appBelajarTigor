// GET /api/progress  →  { progress | null }
// PUT /api/progress  { progress }  →  { disimpan }
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, json } from '../server/http.js';
import { kunciProgress, penggunaAktif } from '../server/sesi.js';

const BAGIAN = ['selesai', 'kode', 'percobaan', 'streak'];

export const GET = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const progress = await db.get(kunciProgress(username));
  return json(200, { progress: progress ?? null });
});

export const PUT = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const { progress } = await bacaJson(req, 900 * 1024);

  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) throw new HttpError(400, 'Data progress tidak valid.');
  for (const k of BAGIAN) {
    if (typeof progress[k] !== 'object' || progress[k] === null) throw new HttpError(400, `Data progress tidak lengkap (${k}).`);
  }

  const disimpan = Date.now();
  // Klien lama belum mengirim 'ujian'. Jangan sampai menimpa hasil ujian yang sudah tersimpan dengan kosong.
  const lama = await db.get(kunciProgress(username));
  const kirimUjian = progress.ujian && typeof progress.ujian === 'object' && !Array.isArray(progress.ujian);
  await db.set(kunciProgress(username), {
    selesai: progress.selesai,
    kode: progress.kode,
    percobaan: progress.percobaan,
    ujian: kirimUjian ? progress.ujian : (lama?.ujian ?? {}),
    streak: progress.streak,
    diubah: Number(progress.diubah) || disimpan,
    resetPada: Number(progress.resetPada) || 0,
    disimpan,
  });
  return json(200, { disimpan });
});
