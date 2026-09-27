import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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

export default defineConfig({
  plugins: [
    react(),
    apiLokal(),
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
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 5000 },
});
