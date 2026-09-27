import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
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
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  worker: { format: 'es' },
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 5000 },
});
