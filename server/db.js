// Akses database.
// - Di Vercel: Upstash Redis (dibuat dari dashboard Vercel → Storage). Env var diisi otomatis oleh Vercel.
// - Di laptop tanpa env var: database sementara di memori (hilang saat server dimatikan), cukup untuk mencoba.
import { Redis } from '@upstash/redis';
import { HttpError } from './http.js';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const diVercel = Boolean(process.env.VERCEL);

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

function buatDbRedis() {
  const r = new Redis({ url, token });
  return {
    jenis: 'redis',
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

let db = null;
export function ambilDb() {
  if (db) return db;
  if (url && token) db = buatDbRedis();
  else if (diVercel) {
    throw new HttpError(503, 'Database belum dihubungkan. Di dashboard Vercel: Storage → buat Upstash Redis → Connect ke project ini, lalu redeploy.');
  } else db = buatDbMemori();
  return db;
}
