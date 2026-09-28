import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { jalankanJava, jalankanUji, statusJdk } from './server/javaRunner.js';

// `server.headers`/`preview.headers` Vite TIDAK dipasang pada respons internal `?worker_file`
// (jalur khusus Vite utk mentransformasi entry Worker) — jadi Worker module (mis. engine/jsWorker.js)
// gagal dimuat begitu COOP/COEP aktif (ERR_BLOCKED_BY_RESPONSE). Pasang manual lewat middleware sendiri,
// paling awal, supaya berlaku ke SEMUA respons termasuk yang dilewati handler internal itu.
function headerIsolasiSilangAsal() {
  const pasang = (middlewares) => {
    middlewares.use((req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    });
  };
  return {
    name: 'header-isolasi-silang-asal',
    enforce: 'pre',
    configureServer: (server) => pasang(server.middlewares),
    configurePreviewServer: (server) => pasang(server.middlewares),
  };
}

// Menjalankan fungsi di folder api/ (Vercel Functions) di dev server lokal,
// supaya fitur akun bisa dicoba dengan `npm run dev` tanpa Vercel CLI.
// Tanpa env var database, server memakai database sementara di memori.
function apiLokal() {
  const pasang = (server, muatModul) => {
    const env = loadEnv('development', process.cwd(), '');
    for (const k of ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'AUTH_SECRET']) {
      if (env[k] && !process.env[k]) process.env[k] = env[k];
    }
    server.middlewares.use(async (req, res, next) => {
      if (!req.url.startsWith('/api/')) return next();
      const kirim = (status, pesan) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ pesan }));
      };
      const nama = req.url.slice(5).split('?')[0];
      if (!/^[a-z0-9-]+$/.test(nama)) return kirim(404, 'Endpoint tidak ada.');
      let modul;
      try {
        modul = await muatModul(`/api/${nama}.js`);
      } catch {
        return kirim(404, 'Endpoint tidak ada.');
      }
      const handler = modul[req.method];
      if (!handler) return kirim(405, 'Metode tidak didukung.');
      const potongan = [];
      for await (const c of req) potongan.push(c);
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: Object.entries(req.headers).filter(([, v]) => typeof v === 'string'),
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(potongan),
      });
      const response = await handler(request);
      res.statusCode = response.status;
      response.headers.forEach((v, k) => res.setHeader(k, v));
      res.end(Buffer.from(await response.arrayBuffer()));
    });
  };
  return {
    name: 'api-lokal',
    configureServer: (server) => pasang(server, (p) => server.ssrLoadModule(p)),
    configurePreviewServer: (server) => pasang(server, (p) => import(`.${p}?t=${Date.now()}`)),
  };
}

// Menjalankan kode Java sungguhan (javac lalu java) di komputer ini, HANYA saat `npm run dev`/`npm run preview`.
// Di luar folder api/ dengan sengaja: tidak boleh ikut ter-deploy sebagai Vercel Function (di sana tidak ada JDK).
// Jalur /devjava/ tidak pernah ada di build produksi (dist/), jadi di Vercel jalur ini otomatis 404 lewat rewrite SPA.
function javaLokal() {
  return {
    name: 'java-lokal',
    configureServer: (server) => pasangJavaLokal(server.middlewares),
    configurePreviewServer: (server) => pasangJavaLokal(server.middlewares),
  };
}

function pasangJavaLokal(middlewares) {
  middlewares.use(async (req, res, next) => {
    if (!req.url.startsWith('/devjava/')) return next();
    const kirim = (status, body) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(body));
    };
    try {
      if (req.method === 'GET' && req.url === '/devjava/status') {
        return kirim(200, await statusJdk());
      }
      if (req.method === 'POST' && req.url === '/devjava/run') {
        const potongan = [];
        for await (const c of req) potongan.push(c);
        let body;
        try {
          body = JSON.parse(Buffer.concat(potongan).toString('utf8') || '{}');
        } catch {
          return kirim(400, { fase: 'internal', berhasil: false, pesan: 'Data permintaan tidak valid.' });
        }
        const { berkas, kelasUtama, stdin } = body;
        if (!Array.isArray(berkas) || berkas.length === 0 || typeof kelasUtama !== 'string') {
          return kirim(400, { fase: 'internal', berhasil: false, pesan: 'Permintaan harus menyertakan berkas[] dan kelasUtama.' });
        }
        return kirim(200, await jalankanJava({ berkas, kelasUtama, stdin: typeof stdin === 'string' ? stdin : '' }));
      }
      if (req.method === 'POST' && req.url === '/devjava/uji') {
        const potongan = [];
        for await (const c of req) potongan.push(c);
        let body;
        try {
          body = JSON.parse(Buffer.concat(potongan).toString('utf8') || '{}');
        } catch {
          return kirim(400, { fase: 'internal', berhasil: false, pesan: 'Data permintaan tidak valid.' });
        }
        const { berkas, kelasUtama, kasus } = body;
        if (!Array.isArray(berkas) || berkas.length === 0 || typeof kelasUtama !== 'string' || !Array.isArray(kasus)) {
          return kirim(400, { fase: 'internal', berhasil: false, pesan: 'Permintaan harus menyertakan berkas[], kelasUtama, dan kasus[].' });
        }
        return kirim(200, await jalankanUji({ berkas, kelasUtama, kasus }));
      }
      return kirim(404, { pesan: 'Endpoint tidak ada.' });
    } catch (e) {
      return kirim(500, { fase: 'internal', berhasil: false, pesan: `Kesalahan server: ${e.message}` });
    }
  });
}

export default defineConfig({
  plugins: [
    headerIsolasiSilangAsal(),
    react(),
    apiLokal(),
    javaLokal(),
    // Membuat app bisa di-install (PWA) dan tetap jalan offline setelah dibuka sekali.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ikon.svg', 'ikon-180.png'],
      manifest: {
        name: 'LatihKode: JavaScript & React',
        short_name: 'LatihKode',
        description: 'Latihan coding interaktif JavaScript sampai React, dalam Bahasa Indonesia.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#12111c',
        theme_color: '#6d4aff',
        icons: [
          { src: '/ikon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/ikon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/ikon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // Babel (untuk JSX) berukuran ±3 MB, jadi batas default 2 MB dinaikkan.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  worker: { format: 'es' },
  // Cross-origin isolation (dibutuhkan SharedArrayBuffer -> stdin interaktif Python/Pyodide di /lab)
  // dipasang lewat plugin headerIsolasiSilangAsal() di atas, bukan di sini — lihat catatan di plugin itu.
  // Header yang sama juga dipasang di vercel.json untuk produksi.
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 5000 },
});
