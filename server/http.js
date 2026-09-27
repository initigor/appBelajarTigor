// Helper kecil untuk Vercel Functions bergaya Web API (Request → Response).

export class HttpError extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function bacaJson(req, maksByte = 64 * 1024) {
  const teks = await req.text();
  if (teks.length > maksByte) throw new HttpError(413, `Data terlalu besar (maks. ${Math.round(maksByte / 1024)} KB).`);
  try {
    return teks ? JSON.parse(teks) : {};
  } catch {
    throw new HttpError(400, 'Format data tidak valid.');
  }
}

/** Bungkus handler supaya error selalu dikembalikan sebagai JSON { pesan }. */
export function aman(handler) {
  return async (req) => {
    try {
      return await handler(req);
    } catch (e) {
      if (e instanceof HttpError) return json(e.status, { pesan: e.message });
      console.error(e);
      return json(500, { pesan: 'Terjadi kesalahan di server. Coba lagi sebentar lagi.' });
    }
  };
}

export function ipDari(req) {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'lokal';
}
