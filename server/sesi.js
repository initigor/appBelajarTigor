import { bacaToken } from './auth.js';
import { HttpError } from './http.js';

export const kunciUser = (u) => `user:${u}`;
export const kunciProgress = (u) => `progress:${u}`;

/** Pastikan request membawa token yang valid & akunnya masih ada. */
export async function penggunaAktif(req, db) {
  const { username, versi } = bacaToken(req);
  const user = await db.get(kunciUser(username));
  if (!user) throw new HttpError(401, 'Akun tidak ditemukan. Silakan masuk lagi.');
  if ((user.versi ?? 1) !== versi) throw new HttpError(401, 'Password akun ini sudah diganti. Silakan masuk lagi.');
  return { username, user };
}

/** Batasi percobaan: melempar 429 jika `kunci` sudah dipakai lebih dari `maks` kali dalam `detik`. */
export async function batasi(db, kunci, maks, detik, pesan) {
  const n = await db.incr(kunci, detik);
  if (n > maks) throw new HttpError(429, pesan);
}
