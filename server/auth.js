// Password di-hash dengan scrypt (bawaan Node, tanpa library tambahan).
// Sesi memakai token bertanda tangan HMAC: base64url(payload).tanda_tangan, berlaku 60 hari.
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { HttpError } from './http.js';

const scrypt = promisify(scryptCb);
const UMUR_TOKEN_MS = 60 * 24 * 60 * 60 * 1000;

function rahasia() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.VERCEL) {
    throw new HttpError(503, 'AUTH_SECRET belum diatur. Tambahkan di Vercel → Settings → Environment Variables (minimal 16 karakter acak), lalu redeploy.');
  }
  return 'rahasia-pengembangan-lokal-saja';
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function cocokPassword(password, tersimpan) {
  const [jenis, saltB64, hashB64] = String(tersimpan).split('$');
  if (jenis !== 'scrypt' || !saltB64 || !hashB64) return false;
  const harap = Buffer.from(hashB64, 'base64');
  const hasil = await scrypt(password, Buffer.from(saltB64, 'base64'), harap.length);
  return timingSafeEqual(hasil, harap);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const tandaTangan = (data) => createHmac('sha256', rahasia()).update(data).digest('base64url');

/** `versi` naik saat password diganti, sehingga token lama otomatis tidak berlaku. */
export function buatToken(username, versi = 1) {
  const payload = b64url(JSON.stringify({ u: username, v: versi, exp: Date.now() + UMUR_TOKEN_MS }));
  return `${payload}.${tandaTangan(payload)}`;
}

/** Mengembalikan { username, versi } dari header Authorization, atau melempar 401. */
export function bacaToken(req) {
  const h = req.headers.get('authorization') ?? '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [payload, ttd] = token.split('.');
  if (!payload || !ttd) throw new HttpError(401, 'Silakan masuk terlebih dahulu.');
  const harap = Buffer.from(tandaTangan(payload));
  const dapat = Buffer.from(ttd);
  if (harap.length !== dapat.length || !timingSafeEqual(harap, dapat)) throw new HttpError(401, 'Sesi tidak valid. Silakan masuk lagi.');
  let isi;
  try {
    isi = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    throw new HttpError(401, 'Sesi tidak valid. Silakan masuk lagi.');
  }
  if (!isi.exp || isi.exp < Date.now()) throw new HttpError(401, 'Sesi sudah habis. Silakan masuk lagi.');
  return { username: isi.u, versi: isi.v ?? 1 };
}

const POLA_USERNAME = /^[a-z0-9_]{3,20}$/;

export function validasiAkun(body) {
  const username = String(body?.username ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  if (!POLA_USERNAME.test(username)) throw new HttpError(400, 'Username 3–20 karakter, hanya huruf kecil, angka, dan garis bawah (_).');
  if (password.length < 6) throw new HttpError(400, 'Password minimal 6 karakter.');
  if (password.length > 200) throw new HttpError(400, 'Password terlalu panjang.');
  return { username, password };
}
