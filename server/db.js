// Akses database.
// Mendukung beberapa cara Vercel menghubungkan database Redis:
//   1. Upstash (REST)  : KV_REST_API_URL + KV_REST_API_TOKEN, atau UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//                        (termasuk versi dengan prefix, mis. STORAGE_KV_REST_API_URL)
//   2. Redis (TCP)     : REDIS_URL (mis. dari "Redis" di Vercel Marketplace), termasuk versi dengan prefix
//   3. Tanpa semua itu : di laptop memakai database sementara di memori; di Vercel memberi pesan error yang jelas.
import { Redis } from '@upstash/redis';
import { createClient } from 'redis';
import { HttpError } from './http.js';

const diVercel = Boolean(process.env.VERCEL);

/** Cari pasangan env var database. Mengembalikan { jenis, ... , nama: [nama env var] } atau null. */
export function deteksiKonfigurasi(env = process.env) {
  const kunci = Object.keys(env);
  // Upstash REST: <prefix>KV_REST_API_URL / <prefix>UPSTASH_REDIS_REST_URL
  for (const [akhirUrl, akhirToken] of [
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ]) {
    const kUrl = kunci.find((k) => k.endsWith(akhirUrl) && env[k] && env[k.slice(0, -akhirUrl.length) + akhirToken]);
    if (kUrl) {
      const kToken = kUrl.slice(0, -akhirUrl.length) + akhirToken;
      return { jenis: 'upstash-rest', url: env[kUrl], token: env[kToken], nama: [kUrl, kToken] };
    }
  }
  // Redis TCP: <prefix>REDIS_URL / <prefix>KV_URL (rediss://...)
  const kTcp = kunci.find((k) => /(^|_)(REDIS_URL|KV_URL)$/.test(k) && /^rediss?:\/\//.test(env[k] ?? ''));
  if (kTcp) return { jenis: 'redis-tcp', url: env[kTcp], nama: [kTcp] };
  return null;
}

/** Nama env var yang mirip konfigurasi database (untuk diagnosis; nilainya tidak pernah ditampilkan). */
export function envMiripDatabase(env = process.env) {
  return Object.keys(env)
    .filter((k) => /REDIS|UPSTASH|KV_|_KV|STORAGE/i.test(k))
    .sort();
}

function buatDbMemori() {
  const data = (globalThis.__latihkodeDb ??= new Map()); // { kunci: { nilai, kadaluarsa } }
  const ambil = (k) => {
    const e = data.get(k);
    if (!e) return null;
    if (e.kadaluarsa && e.kadaluarsa < Date.now()) {
      data.delete(k);
      return null;
    }
    return e;
  };
  return {
    jenis: 'memori',
    async get(k) {
      const e = ambil(k);
      return e ? structuredClone(e.nilai) : null;
    },
    async set(k, v, { nx = false, ex } = {}) {
      if (nx && ambil(k)) return null;
      data.set(k, { nilai: structuredClone(v), kadaluarsa: ex ? Date.now() + ex * 1000 : null });
      return 'OK';
    },
    async incr(k, ex) {
      const e = ambil(k);
      const n = (e?.nilai ?? 0) + 1;
      data.set(k, { nilai: n, kadaluarsa: e?.kadaluarsa ?? (ex ? Date.now() + ex * 1000 : null) });
      return n;
    },
    async del(...k) {
      k.forEach((x) => data.delete(x));
    },
  };
}

function buatDbUpstash({ url, token }) {
  const r = new Redis({ url, token });
  return {
    jenis: 'upstash-rest',
    get: (k) => r.get(k),
    set: (k, v, { nx = false, ex } = {}) => r.set(k, v, { ...(nx ? { nx: true } : {}), ...(ex ? { ex } : {}) }),
    async incr(k, ex) {
      const n = await r.incr(k);
      if (n === 1 && ex) await r.expire(k, ex);
      return n;
    },
    del: (...k) => r.del(...k),
  };
}

function buatDbTcp({ url }) {
  // Koneksi dipakai ulang antar-request selama fungsi masih "hangat".
  const klien = (globalThis.__latihkodeRedisTcp ??= createClient({ url }));
  let siap = null;
  const sambung = () => {
    if (klien.isOpen) return Promise.resolve();
    siap ??= klien.connect().finally(() => (siap = null));
    return siap;
  };
  const parse = (s) => {
    if (s === null || s === undefined) return null;
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  };
  return {
    jenis: 'redis-tcp',
    async get(k) {
      await sambung();
      return parse(await klien.get(k));
    },
    async set(k, v, { nx = false, ex } = {}) {
      await sambung();
      return klien.set(k, JSON.stringify(v), { ...(nx ? { NX: true } : {}), ...(ex ? { EX: ex } : {}) });
    },
    async incr(k, ex) {
      await sambung();
      const n = await klien.incr(k);
      if (n === 1 && ex) await klien.expire(k, ex);
      return n;
    },
    async del(...k) {
      await sambung();
      return klien.del(k);
    },
  };
}

let db = null;
export function ambilDb() {
  if (db) return db;
  const konfig = deteksiKonfigurasi();
  if (konfig?.jenis === 'upstash-rest') db = buatDbUpstash(konfig);
  else if (konfig?.jenis === 'redis-tcp') db = buatDbTcp(konfig);
  else if (diVercel) {
    const mirip = envMiripDatabase();
    throw new HttpError(
      503,
      'Database belum terhubung ke deployment ini. ' +
        (mirip.length
          ? `Env var yang terbaca: ${mirip.join(', ')}, tapi pasangan URL/token-nya tidak lengkap. `
          : 'Tidak ada env var database yang terbaca. ') +
        'Di Vercel: Storage → pilih database → Connect Project (centang Production), lalu Deployments → Redeploy. Detail: buka /api/status',
    );
  } else db = buatDbMemori();
  return db;
}
