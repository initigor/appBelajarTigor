# LatihKode: Latihan JavaScript → React

Website latihan coding interaktif ala Codédex untuk belajar **JavaScript** sampai **React**, dalam Bahasa Indonesia. Setiap konsep dibandingkan dengan C dan Python. Website ini hanya berjalan di komputermu sendiri (localhost), tanpa login dan tanpa backend.

- **12 chapter, 83 pelajaran**, dan setiap chapter ditutup dengan mini proyek
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
| `npm run build` | Membuat versi produksi di folder `dist/` |
| `npm run preview` | Menjalankan hasil build |
| `npm run check-lessons` | Mengecek semua pelajaran (lihat di bawah) |

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
        └── ... sampai 12-proyek-akhir/
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
