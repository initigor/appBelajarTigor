// GET /api/riwayat  →  { riwayat | null }
// PUT /api/riwayat  { riwayat: { percobaan, dihapus, reset } }  →  { disimpan }
// Riwayat percobaan ujian per akun, supaya bisa ditinjau di semua perangkat. Penggabungan antarperangkat
// dilakukan di klien (src/state/gabungRiwayat.js); server hanya memvalidasi bentuk dan menyimpan.
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, json } from '../server/http.js';
import { kunciRiwayat, penggunaAktif } from '../server/sesi.js';

const MAKS_PERCOBAAN = 400;
const MAKS_DIHAPUS = 300;

export const GET = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const riwayat = await db.get(kunciRiwayat(username));
  return json(200, { riwayat: riwayat ?? null });
});

export const PUT = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const { riwayat } = await bacaJson(req, 900 * 1024);

  if (!riwayat || typeof riwayat !== 'object' || Array.isArray(riwayat)) throw new HttpError(400, 'Data riwayat tidak valid.');
  const { percobaan, dihapus, reset } = riwayat;
  if (!Array.isArray(percobaan) || percobaan.length > MAKS_PERCOBAAN) throw new HttpError(400, 'Daftar percobaan tidak valid.');
  for (const p of percobaan) {
    const ok =
      p && typeof p.id === 'string' && p.id.length <= 60 && typeof p.ujianId === 'string' && p.ujianId.length <= 100 && Number.isFinite(p.waktu) && Array.isArray(p.soal);
    if (!ok) throw new HttpError(400, 'Ada percobaan yang bentuknya tidak valid.');
  }

  const disimpan = Date.now();
  await db.set(kunciRiwayat(username), {
    percobaan,
    dihapus: Array.isArray(dihapus) ? dihapus.filter((x) => typeof x === 'string' && x.length <= 60).slice(-MAKS_DIHAPUS) : [],
    reset: Number.isFinite(reset) ? reset : 0,
    disimpan,
  });
  return json(200, { disimpan });
});
