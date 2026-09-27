// POST /api/daftar  { username, password }  →  { username, token }
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, ipDari, json } from '../server/http.js';
import { buatToken, hashPassword, validasiAkun } from '../server/auth.js';
import { batasi, kunciUser } from '../server/sesi.js';

export const POST = aman(async (req) => {
  const db = ambilDb();
  const { username, password } = validasiAkun(await bacaJson(req));
  await batasi(db, `batas:daftar:${ipDari(req)}`, 10, 3600, 'Terlalu banyak pendaftaran dari jaringan ini. Coba lagi 1 jam lagi.');

  const hash = await hashPassword(password);
  const dibuat = await db.set(kunciUser(username), { hash, versi: 1, dibuat: Date.now() }, { nx: true });
  if (!dibuat) throw new HttpError(409, 'Username sudah dipakai. Pilih yang lain.');

  return json(201, { username, token: buatToken(username, 1) });
});
