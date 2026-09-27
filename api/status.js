// GET /api/status → diagnosis konfigurasi server (tanpa pernah menampilkan nilai rahasia).
// Buka https://<domain-kamu>/api/status di browser untuk mengecek apakah database & AUTH_SECRET sudah terbaca.
import { ambilDb, deteksiKonfigurasi, envMiripDatabase } from '../server/db.js';
import { aman, json } from '../server/http.js';

export const GET = aman(async () => {
  const konfig = deteksiKonfigurasi();
  const secret = process.env.AUTH_SECRET ?? '';

  let koneksi = 'tidak dicoba';
  if (konfig) {
    try {
      const db = ambilDb();
      await db.set('status:ping', { waktu: Date.now() }, { ex: 60 });
      koneksi = (await db.get('status:ping')) ? 'berhasil' : 'gagal membaca data';
    } catch (e) {
      koneksi = `gagal: ${e.message}`;
    }
  }

  const diVercel = Boolean(process.env.VERCEL);
  const masalah = [];
  if (!konfig) {
    if (diVercel) masalah.push('Database belum terhubung: hubungkan Upstash/Redis ke project di tab Storage (centang Production), lalu Redeploy.');
  } else if (koneksi !== 'berhasil') {
    masalah.push(`Env var database ada, tapi koneksi ${koneksi}.`);
  }
  if (secret.length < 16 && diVercel) masalah.push('AUTH_SECRET belum diatur (minimal 16 karakter) di Settings → Environment Variables, lalu Redeploy.');

  return json(200, {
    siap: masalah.length === 0,
    masalah,
    database: konfig
      ? { jenis: konfig.jenis, envDipakai: konfig.nama, koneksi }
      : diVercel
        ? null
        : { jenis: 'memori (khusus laptop, data hilang saat server dimatikan)' },
    authSecret: secret.length >= 16 ? 'ada' : secret ? 'terlalu pendek' : 'tidak ada',
    envMiripDatabase: envMiripDatabase(),
    lingkungan: process.env.VERCEL_ENV ?? 'lokal',
  });
});
