# LatihKode: Latihan JavaScript → React

Website latihan coding interaktif ala Codédex untuk belajar **JavaScript** sampai **React**, dalam Bahasa Indonesia. Setiap konsep dibandingkan dengan C dan Python. Website ini hanya berjalan di komputermu sendiri (localhost), tanpa login dan tanpa backend.

- **13 chapter, 90 pelajaran**, dari dasar JavaScript sampai backend Node.js & API — setiap chapter ditutup dengan mini proyek
- Editor kode (CodeMirror) + Console + Tes otomatis (✅/❌) + Preview untuk DOM/React
- Petunjuk bertahap; tombol solusi baru muncul setelah 3 kali mencoba
- XP, streak harian, progress per chapter, dan kode terakhir di tiap pelajaran disimpan di `localStorage`
- Tema terang/gelap, bisa ekspor/impor progress
- Berjalan **offline** setelah `npm install`

## Cara menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
```

```bash
npm run dev
```

Lalu buka http://localhost:5173.

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan website (mode pengembangan) |
| `npm run dev:hp` | Sama, tapi bisa dibuka dari iPad/HP di Wi-Fi yang sama |
| `npm run build` | Membuat versi produksi di folder `dist/` |
| `npm run preview` | Menjalankan hasil build |
| `npm run check-lessons` | Mengecek semua pelajaran (lihat di bawah) |
| `npm run ikon` | Membuat ulang ikon PNG aplikasi dari `public/ikon.svg` |

## Deploy ke Vercel & pasang sebagai aplikasi

LatihKode adalah **PWA** (Progressive Web App): bisa dipasang di layar utama HP/iPad/laptop, terbuka layar penuh, dan **tetap jalan offline** setelah dibuka sekali. Syaratnya, website dibuka lewat **HTTPS**, jadi cara termudah adalah deploy ke Vercel (gratis).

1. Buka https://vercel.com/new, masuk dengan akun GitHub, lalu **Import** repository `appBelajarTigor`.
2. Pengaturan sudah dibaca otomatis dari `vercel.json` (Framework: Vite, Build: `npm run build`, Output: `dist`). Klik **Deploy**.
3. Setelah selesai, kamu mendapat alamat seperti `https://app-belajar-tigor.vercel.app`. Setiap `git push` ke `main` akan otomatis men-deploy ulang.
4. Buka alamat itu di HP, lalu:
   - **Android (Chrome):** ketuk tombol **📲 Install** di beranda atau di header.
   - **iPhone/iPad (Safari):** buka menu **Pengaturan → Cara pasang aplikasi** untuk tutorial bergambar. Singkatnya: **Bagikan → Tambahkan ke Layar Utama → Tambah**.

Halaman tutorial lengkap ada di `/install` di dalam aplikasi.

| File | Fungsi |
| --- | --- |
| `vite.config.js` (VitePWA) | manifest + service worker (semua file, termasuk Babel, disimpan untuk offline) |
| `vercel.json` | semua URL diarahkan ke `index.html`, supaya `/belajar/...` tidak 404 |
| `public/ikon.svg` | ikon utama. Jalankan `npm run ikon` untuk membuat ulang PNG-nya |
| `src/state/install.js` | tombol install Android (`beforeinstallprompt`) & deteksi iOS |

## Akun & sinkronisasi progress (Vercel Functions + Upstash Redis)

Akun bersifat **opsional**. Tanpa akun, progress tersimpan di perangkat (localStorage) seperti biasa. Dengan akun (username + password), progress disimpan juga di cloud, sehingga bisa dilanjutkan dari perangkat lain.

### Setup sekali di Vercel
1. Buka project di dashboard Vercel → tab **Storage** → **Create Database** → pilih **Upstash (Redis)** → paket **Free** → **Connect** ke project ini. Vercel otomatis menambahkan env var `KV_REST_API_URL` dan `KV_REST_API_TOKEN`.
2. **Settings → Environment Variables** → tambahkan `AUTH_SECRET` berisi teks acak minimal 16 karakter. Contoh cara membuatnya:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Jangan pernah mengganti nilai ini setelah dipakai, karena semua pengguna akan otomatis keluar.
3. **Deployments → Redeploy** supaya env var baru terbaca.

Selama langkah di atas belum dilakukan, halaman Akun akan menampilkan pesan yang menjelaskan apa yang kurang.

### Jika muncul "Database belum terhubung"
Buka `https://<domain-kamu>/api/status` di browser. Halaman itu menampilkan env var database yang terbaca (hanya namanya), jenis database, hasil tes koneksi, dan status `AUTH_SECRET`.

| Yang terlihat di /api/status | Artinya & solusinya |
| --- | --- |
| `envMiripDatabase: []` | Deployment ini belum menerima env var database. Pastikan database sudah **Connect** ke project dengan environment **Production** dicentang, lalu **Redeploy**. Env var hanya terbaca oleh deployment yang dibuat setelahnya. |
| Ada nama env var, tapi `database: null` | Pasangan URL/token tidak lengkap. Cek **Settings → Environment Variables**. |
| `koneksi: "gagal: ..."` | Env var ada tapi salah/kedaluwarsa. Hubungkan ulang database, lalu Redeploy. |

Yang didukung: Upstash (`KV_REST_API_URL` + `KV_REST_API_TOKEN` atau `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, boleh dengan prefix) dan Redis biasa (`REDIS_URL`).

### Cara kerja
| Bagian | File |
| --- | --- |
| API (Vercel Functions) | `api/daftar.js`, `api/masuk.js`, `api/progress.js`, `api/akun.js` |
| Database, hash password, token sesi | `server/db.js`, `server/auth.js`, `server/sesi.js` |
| Sinkron di aplikasi | `src/state/akun.jsx`, `src/state/gabungProgress.js` |
| Halaman | `src/pages/Akun.jsx` (`/akun`) |

- Password disimpan sebagai **hash scrypt** (tidak pernah disimpan dalam bentuk aslinya).
- Login dibatasi 10 percobaan gagal per 15 menit per username.
- Sesi berlaku 60 hari. Mengganti password membuat perangkat lain otomatis keluar.
- Progress dikirim ke cloud ±1,5 detik setelah ada perubahan. Saat offline, progress disimpan di perangkat dan dikirim otomatis begitu online lagi.
- Saat masuk di perangkat baru, progress lokal dan cloud **digabung**: pelajaran selesai digabung, percobaan diambil yang terbanyak, dan kode diambil dari sisi yang lebih baru. Reset progress juga ikut tersinkron.
- Belum ada fitur "lupa password", karena akun tidak memakai email.

### Mencoba di laptop
`npm run dev` sudah menjalankan API juga. Tanpa `.env.local`, datanya disimpan di **memori** dan hilang saat dev server dimatikan, cocok untuk mencoba. Untuk memakai database sungguhan secara lokal, salin `.env.example` menjadi `.env.local` dan isi nilainya (atau jalankan `npx vercel env pull .env.local`).

## Belajar dari iPad atau HP (tanpa deploy)

`localhost` hanya bisa dibuka dari laptop itu sendiri. Supaya bisa dibuka dari iPad/HP:

1. Pastikan laptop dan iPad/HP tersambung ke **Wi-Fi yang sama**.
2. Jalankan `npm run dev:hp`. Terminal akan menampilkan alamat **Network**, misalnya `http://192.168.1.5:5173/`.
3. Buka alamat itu di Safari/Chrome di iPad/HP. Jika Windows menanyakan izin firewall untuk Node.js, izinkan untuk jaringan **Private**.
4. (Opsional) Di iPhone/iPad bisa langsung **Bagikan → Tambahkan ke Layar Utama**. Tombol install Android dan mode offline hanya aktif lewat HTTPS, jadi gunakan Vercel untuk itu.

Tampilan menyesuaikan ukuran layar:

| Layar | Tampilan pelajaran |
| --- | --- |
| Laptop / iPad landscape (≥ 1024px) | Materi dan editor berdampingan |
| iPad portrait (700–1023px) | Tab **Materi** / **Kode** (editor + output bertumpuk) |
| HP (< 700px) | Tab **Materi** / **Kode** / **Hasil** + tombol **Jalankan** di bawah |

Di layar sentuh, di atas editor muncul **baris simbol** (`( )`, `{ }`, `;`, `=>`, `${ }`, undo, dan lainnya), karena simbol-simbol ini sulit diketik di keyboard HP.

> Progress disimpan per browser, jadi progress di laptop dan di iPad terpisah. Pindahkan dengan **Pengaturan → Ekspor/Impor progress**.
> Selama `dev:hp` berjalan, website bisa dibuka siapa pun di Wi-Fi yang sama. Pakai di jaringan rumah, bukan Wi-Fi publik.

## Struktur folder

```
├── index.html
├── vite.config.js
├── scripts/
│   └── check-lessons.js      # cek otomatis: solusi lolos tes, kodeAwal belum lolos
└── src/
    ├── main.jsx, App.jsx      # entry, router, header
    ├── styles.css             # semua CSS + tema terang/gelap
    ├── pages/
    │   ├── Beranda.jsx        # peta chapter, XP, streak
    │   ├── Pelajaran.jsx      # halaman latihan (materi | editor + console/tes/preview)
    │   └── Pengaturan.jsx     # tema, ekspor/impor, reset progress
    ├── components/            # Editor, Markdown, ProgressBar, Confetti
    ├── state/progress.jsx     # progress, XP, streak, tema (localStorage)
    ├── engine/
    │   ├── runner.js          # memilih worker (js) atau iframe (dom/react)
    │   ├── jsWorker.js        # Web Worker untuk pelajaran JS (dimatikan setelah 3 detik)
    │   ├── jsEngine.js        # eksekusi kode JS + tes
    │   ├── domEngine.js       # eksekusi DOM/React di iframe (atau jsdom saat check-lessons)
    │   ├── babel.js           # compile JSX, import/export, pengaman infinite loop
    │   ├── tes.js             # sistem tes, pesan error ramah
    │   └── format.js          # format nilai untuk console
    └── lessons/
        ├── chapters.js        # daftar chapter
        ├── index.js / susun.js
        ├── _bersama/          # helper (bukan pelajaran): fetch palsu, potongan kode portofolio
        ├── 01-dasar-js/
        │   ├── 01-console-log.js
        │   └── ...
        └── ... sampai 13-backend-node/
```

## Cara menambah pelajaran

1. Buat file baru di folder chapter, misalnya `src/lessons/04-array/09-array-includes.js`. **Urutan pelajaran mengikuti nama file**, jadi beri awalan angka.
2. Isi dengan format berikut:

```js
export default {
  id: 'array-includes-lanjutan',   // unik, dipakai di URL: /belajar/<id>
  judul: 'Judul Pelajaran',
  tipe: 'js',                      // 'js' | 'dom' | 'react'
  xp: 20,
  proyek: false,                   // opsional: tandai sebagai mini proyek
  materi: `# Markdown materi ...`,
  tugas: `Instruksi tugas (markdown)`,
  kodeAwal: `// kode awal di editor\n`,
  solusi: `// solusi lengkap\n`,
  petunjuk: ['petunjuk 1', 'petunjuk 2'],
  tes: [
    {
      nama: 'tambah(2, 3) = 5',
      cek(ctx) {
        const hasil = ctx.panggil('tambah', 2, 3);
        if (hasil === '23') return 'Hasilnya "23". Apakah kamu menjumlahkan string?';
        return hasil === 5 || `tambah(2, 3) mengembalikan ${hasil}, seharusnya 5.`;
      },
    },
  ],

  // opsional
  html: '<button id="tombol">Klik</button>',  // HTML awal untuk tipe 'dom'
  css: '.aktif { color: red; }',              // CSS untuk preview dom/react
  globals: ({ tunda }) => ({ /* variabel global tambahan untuk tipe 'js' */ }),
  batasWaktu: 6000,                           // batas waktu worker (ms), default 3000
};
```

3. Jalankan `npm run check-lessons -- <sebagian-id>` untuk memastikan solusinya lolos.

> Tips: materi ditulis di template literal, jadi karakter `` ` `` harus ditulis `` \` `` dan `${` ditulis `\${`. Blok kode di markdown bisa memakai `~~~js` supaya tidak perlu escape backtick.

Untuk chapter baru, buat foldernya lalu daftarkan di `src/lessons/chapters.js`. File atau folder yang namanya diawali `_` dianggap helper, bukan pelajaran.

### Aturan tes

`cek(ctx)` boleh `async`. Hasilnya:
- `return true` → lulus
- `return 'pesan'` → gagal dengan pesan itu
- `ctx.harusLog(...)`, `ctx.fungsi(...)`, `ctx.cari(...)`, dan helper lain akan **melempar** pesan gagal otomatis
- nilai lain → gagal dengan pesan umum

### API `ctx`

Tersedia di semua tipe:

| | |
| --- | --- |
| `ctx.kode` | kode asli user |
| `ctx.kodeBersih` | kode tanpa komentar (untuk `react`: sudah di-compile dari JSX, jadi pakai `ctx.kode` untuk cek sintaks JSX) |
| `ctx.pakai(regex \| string)` | apakah `kodeBersih` memakai pola tertentu |
| `ctx.logs` | array teks yang dicetak `console.log` |
| `ctx.adaLog(teks)` / `ctx.harusLog(teks)` | cek output console (versi `harus` memberi pesan gagal yang ramah) |
| `ctx.error` | error runtime pertama (atau `null`) |

Tipe `js`:

| | |
| --- | --- |
| `ctx.ambil(nama)` / `ctx.variabel(nama)` | nilai variabel top-level user (`variabel` gagal jika belum ada) |
| `ctx.fungsi(nama)` | fungsi user (gagal jika belum dibuat) |
| `ctx.panggil(nama, ...args)` | panggil fungsi user; error diubah jadi pesan tes |
| `ctx.jalankanDengan({ nilai: 50 })` | jalankan ulang kode dengan nilai awal `const nilai = ...` diganti. Mengembalikan `{ logs, ambil, variabel, ... }` |
| `ctx.tangkapLog(async () => ...)` | teks console yang dicetak selama fungsi berjalan |
| `ctx.scope` | object berisi semua nama top-level (pakai `'x' in ctx.scope` untuk cek deklarasi) |

Tipe `dom` & `react` (state DOM terbawa dari tes ke tes berikutnya):

| | |
| --- | --- |
| `ctx.document`, `ctx.window` | document & window preview |
| `ctx.cari(selector)` / `ctx.cariSemua(selector)` / `ctx.ada(selector)` | cari elemen |
| `ctx.teks(selector \| elemen)` | textContent yang dirapikan |
| `ctx.tombol('teks')` | cari `<button>` berdasarkan tulisannya |
| `await ctx.klik(x)`, `await ctx.ketik(x, 'teks')`, `await ctx.kirim(form)` | simulasi interaksi (berfungsi untuk React juga) |
| `await ctx.tunggu(ms)` | menunggu |
| `ctx.ambil(nama)` | variabel top-level (khusus `dom`) |

Helper untuk pesan tes bisa di-import dari `src/engine/tes.js`: `gagal(pesan)`, `tampil(nilai)`, `samaDalam(a, b)`.

## `npm run check-lessons`

Script ini menjalankan setiap pelajaran di Node (DOM/React memakai jsdom) dan memastikan:
1. **solusi** lolos semua tesnya sendiri
2. **kodeAwal** belum lolos semua tes (supaya tidak ada latihan "gratis")

```bash
npm run check-lessons
```

```bash
npm run check-lessons -- react
```

## Cara kerja singkat

- **Pelajaran JS** dijalankan di **Web Worker**. `console.log` ditangkap dan dikirim ke panel Console. Jika kode berjalan lebih dari 3 detik (misalnya infinite loop), worker dimatikan dan dibuat ulang. `setTimeout`/Promise ditunggu sampai selesai (maks. 2 detik) sebelum tes dijalankan. Chapter 8 memakai `fetch` tiruan (`src/lessons/_bersama/apiPalsu.js`), jadi tetap bisa offline.
- **Pelajaran DOM/React** dijalankan di **iframe** (tab Preview). Iframe tidak bisa "dimatikan" seperti worker, jadi setiap loop disisipi pengaman lewat Babel: loop yang berjalan lebih dari 2 detik dihentikan dengan pesan error.
- **JSX** di-compile oleh `@babel/standalone` (dari npm, bukan CDN). `import { useState } from "react"` dan `export default App` didukung. React 19 tidak lagi menyediakan build UMD, jadi React untuk preview diambil dari bundle aplikasi.
