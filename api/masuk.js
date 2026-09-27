// POST /api/masuk  { username, password }  →  { username, token }
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, json } from '../server/http.js';
import { buatToken, cocokPassword } from '../server/auth.js';
import { batasi, kunciUser } from '../server/sesi.js';

export const POST = aman(async (req) => {
  const db = ambilDb();
  const body = await bacaJson(req);
  const username = String(body.username ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  if (!username || !password) throw new HttpError(400, 'Isi username dan password.');

  // Maksimal 10 percobaan gagal per 15 menit untuk setiap username (mencegah tebak-tebakan password).
  const kunciBatas = `batas:masuk:${username}`;
  await batasi(db, kunciBatas, 10, 900, 'Terlalu banyak percobaan masuk. Tunggu 15 menit lalu coba lagi.');

  const user = await db.get(kunciUser(username));
  const cocok = user ? await cocokPassword(password, user.hash) : false;
  if (!cocok) throw new HttpError(401, 'Username atau password salah.');

  await db.del(kunciBatas);
  return json(200, { username, token: buatToken(username, user.versi ?? 1) });
});
