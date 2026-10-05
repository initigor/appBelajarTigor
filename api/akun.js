// GET    /api/akun                                  →  { username, dibuat }
// POST   /api/akun  { passwordLama, passwordBaru }  →  { token }  (ganti password; sesi lain otomatis keluar)
// DELETE /api/akun  { password }                    →  { terhapus: true }  (hapus akun, progress, riwayat ujian & workspace)
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, json } from '../server/http.js';
import { buatToken, cocokPassword, hashPassword, validasiAkun } from '../server/auth.js';
import { batasi, kunciProgress, kunciRiwayat, kunciUser, kunciWorkspace, penggunaAktif } from '../server/sesi.js';

export const GET = aman(async (req) => {
  const db = ambilDb();
  const { username, user } = await penggunaAktif(req, db);
  return json(200, { username, dibuat: user.dibuat });
});

export const POST = aman(async (req) => {
  const db = ambilDb();
  const { username, user } = await penggunaAktif(req, db);
  const body = await bacaJson(req);
  await batasi(db, `batas:akun:${username}`, 10, 900, 'Terlalu banyak percobaan. Tunggu 15 menit.');
  if (!(await cocokPassword(String(body.passwordLama ?? ''), user.hash))) throw new HttpError(403, 'Password lama salah.');
  const { password } = validasiAkun({ username, password: body.passwordBaru });

  const versi = (user.versi ?? 1) + 1;
  await db.set(kunciUser(username), { ...user, hash: await hashPassword(password), versi });
  return json(200, { token: buatToken(username, versi) });
});

export const DELETE = aman(async (req) => {
  const db = ambilDb();
  const { username, user } = await penggunaAktif(req, db);
  const body = await bacaJson(req);
  await batasi(db, `batas:akun:${username}`, 10, 900, 'Terlalu banyak percobaan. Tunggu 15 menit.');
  if (!(await cocokPassword(String(body.password ?? ''), user.hash))) throw new HttpError(403, 'Password salah.');

  await db.del(kunciUser(username), kunciProgress(username), kunciRiwayat(username), kunciWorkspace(username));
  return json(200, { terhapus: true });
});
