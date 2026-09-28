# LatihKode: Latihan JavaScript → React & Java — PBO

Website latihan coding interaktif ala Codédex, dalam Bahasa Indonesia, dengan **dua jalur belajar terpisah**: JavaScript → React, dan Java (Pemrograman Berorientasi Obyek). Setiap konsep dibandingkan dengan C dan Python. Website ini hanya berjalan di komputermu sendiri (localhost), tanpa login dan tanpa backend cloud wajib.

- **Jalur JavaScript → React**: 13 chapter, 90 pelajaran, dari dasar JS sampai backend Node.js & API — setiap chapter ditutup dengan mini proyek. Dijalankan di Web Worker/iframe (aman, offline).
- **Jalur Java — PBO** (lihat [bagian tersendiri di bawah](#course-java--pbo)): 2 pekan, 18 pelajaran, kode Java **sungguhan** dikompilasi & dijalankan lewat JDK di komputermu. Punya "Uji Pemahaman" (lewati pelajaran yang sudah dikuasai) dan "Latihan V-3" (persiapan verifikasi tatap muka).
- Editor kode (CodeMirror) + Console + Tes otomatis (✅/❌) + Preview untuk DOM/React
- Petunjuk bertahap; tombol solusi baru muncul setelah 3 kali mencoba
- XP, streak harian, progress per chapter, dan kode terakhir di tiap pelajaran disimpan di `localStorage` (progress Java disimpan **terpisah** dari progress JS/React)
- Tema terang/gelap, bisa ekspor/impor progress
- Jalur JavaScript berjalan **offline** setelah `npm install`; jalur Java butuh JDK terpasang (lihat di bawah)

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
| `npm run check-lessons` | Mengecek semua pelajaran JS **dan** Java (lihat di bawah) |
| `npm run check-lessons-java` | Mengecek pelajaran Java saja lewat JDK sungguhan |
| `npm run check-bank-java` | Mengecek semua soal `prediksi-output` di bank Uji Pemahaman Java bisa dikompilasi & dijalankan |
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

## `/lab`: Uji Kelayakan Runtime Browser (WebAssembly, tanpa server)

Sedang dieksplorasi: menjalankan **semua** bahasa (JS, Python, Java) langsung di browser lewat WebAssembly — tanpa server eksekusi kode — supaya situs bisa di-deploy sebagai frontend statis murni (Vercel Hobby gratis) dan dipakai dari perangkat mana pun termasuk iPad. Halaman `/lab` adalah purwarupa uji kelayakan: satu editor, satu terminal (xterm.js), tombol Jalankan per bahasa.

**Status per 28 Sept 2026** (dites di lingkungan pengembangan; JDK 25 + Chromium modern dengan SharedArrayBuffer/Atomics penuh):

| Bahasa | Runtime | Status |
| --- | --- | --- |
| JavaScript | Web Worker | ✅ Bekerja, termasuk `prompt()` interaktif (jembatan pesan async ke terminal) |
| Python | [Pyodide](https://pyodide.org/) di Web Worker | ✅ Bekerja, termasuk `input()` interaktif sungguhan (SharedArrayBuffer + `Atomics.wait`, mengikuti [pola resmi Pyodide](https://pyodide.org/en/stable/usage/streams.html)) |
| Java | [CheerpJ 4.3](https://cheerpj.com/) (JVM WebAssembly), kompilasi lewat `javac` yang berjalan di dalam CheerpJ sendiri (pola dari [leaningtech/javafiddle](https://github.com/leaningtech/javafiddle), pakai `tools.jar` OpenJDK di `public/java/tools.jar`) | ❌ **Tidak layak** — lihat kesimpulan di bawah |

### Temuan uji Java/CheerpJ — KESIMPULAN: CheerpJ tidak dipakai untuk Java

- `cheerpjInit()` selesai cepat (~50ms) dan berhasil.
- **`cheerpjRunMain(...)` tidak pernah selesai** (menggantung tanpa pesan galat, tanpa aktivitas jaringan sama sekali) — dicoba: program trivial tanpa `main`, classpath tanpa `tools.jar` sama sekali, kontainer display yang benar, **kedua** mode COEP (`credentialless`/`require-corp`), dan versi CheerpJ 3.1 (API-nya beda, tidak cocok dengan pola javafiddle) — semua menggantung tanpa batas (diuji sampai ±4 menit).
- **Dikonfirmasi ulang oleh pengguna di Safari iPad A16 sungguhan (lingkungan target sebenarnya): sama-sama menggantung tanpa akhir.** Jadi ini bukan sekadar keanehan lingkungan pengujian (Chromium yang disematkan di aplikasi desktop Claude) — reproducible di dua browser engine berbeda.
- **Kemungkinan penyebab** (dari riset komunitas CheerpJ, bukan dugaan semata): CheerpJ menjalankan **seluruh** thread Java di atas **satu** thread JavaScript secara kooperatif (bukan preemptive seperti JVM sungguhan). Ada laporan pengguna lain dengan gejala serupa ("hangs after main is starting") yang disebabkan kode yang tidak pernah menyerahkan kendali (busy-wait/spin-loop) — `javac` adalah program besar dan kompleks yang kemungkinan memakai pola sinkronisasi yang tidak cocok dengan model ini.
- **Tidak ditemukan API resmi CheerpJ untuk stdin/`Scanner` interaktif** sama sekali (tidak relevan lagi karena compile+run dasarnya sudah tidak jalan).

**Keputusan:** jalur Java **tetap memakai runner lokal `javac`/`java` sungguhan** (lihat bagian "Course Java — PBO" di bawah, sudah terverifikasi bekerja sempurna) — artinya course Java **hanya bisa dipakai lewat `npm run dev` di komputer dengan JDK terpasang**, bukan lewat deploy Vercel/diakses dari iPad. Jalur JavaScript dan Python **tetap lanjut** memakai runtime WebAssembly di atas (keduanya sudah terbukti bekerja, termasuk di Safari iPad sungguhan untuk Python) untuk mencapai tujuan "bisa di-deploy & dipakai dari mana saja dengan biaya nol".

### Temuan lain: regresi COOP/COEP yang sudah diperbaiki

Memasang header `Cross-Origin-Opener-Policy`/`Cross-Origin-Embedder-Policy` (wajib untuk `SharedArrayBuffer`) sempat **mematahkan seluruh course JavaScript yang sudah ada** — Worker modul (`src/engine/jsWorker.js`) gagal dimuat (`ERR_BLOCKED_BY_RESPONSE`) karena jalur internal Vite untuk mentransformasi entry Worker (`?worker_file`) ternyata **tidak** menyertakan header yang diset lewat `server.headers`/`preview.headers`. Diperbaiki dengan memasang header itu lewat middleware sendiri (plugin `headerIsolasiSilangAsal()`, `enforce: 'pre'`) di [vite.config.js](vite.config.js) — sudah diverifikasi ulang: seluruh pelajaran JS **dan** DOM/React kembali berjalan normal.

### Lisensi CheerpJ

CheerpJ Community Edition **gratis untuk penggunaan personal/non-komersial saja** (dikonfirmasi dari banner konsol saat runtime dimuat: "FOR PERSONAL AND NON-BUSINESS USE ONLY"). `tools.jar` yang dipakai untuk kompilasi berasal dari OpenJDK (GPL v2 + Classpath Exception, dari proyek open-source `leaningtech/javafiddle`, MIT). Atribusi lengkap akan ditambahkan ke README dan halaman "Tentang" begitu jalur Java ini benar-benar dipakai.

### Cara mencoba `/lab` secara lokal

```bash
npm run dev
```

Buka `http://localhost:5173/lab`. Chip "Cross-origin isolated" di kanan atas harus ✅ (kalau ⚠️, `input()` Python tidak akan interaktif).

## Course Java — PBO

Jalur belajar Java (Pemrograman Berorientasi Obyek) mengikuti materi Pekan 2 (Dasar Pemrograman Java) dan Pekan 3 (Kelas dan Objek) mata kuliah PBO — tapi **berdiri sendiri**, tidak bercampur dengan materi JavaScript. (Course ini masih memakai runner server lokal `javac`/`java`, lihat di bawah — belum dipindahkan ke CheerpJ karena status uji kelayakan di atas.)

### Wajib: pasang JDK

Beda dengan jalur JavaScript, kode Java **benar-benar dikompilasi & dijalankan** (`javac` lalu `java`) di komputermu lewat server dev lokal — bukan simulasi.

1. Pasang **Java Development Kit (JDK) 21** atau lebih baru — misalnya [Eclipse Temurin](https://adoptium.net/) atau [Microsoft Build of OpenJDK](https://learn.microsoft.com/java/openjdk/download).
2. Pastikan JDK (bukan cuma JRE) masuk ke `PATH`: buka terminal **baru** lalu jalankan
   ```bash
   javac -version
   java -version
   ```
   Keduanya harus mencetak nomor versi. Kalau hanya `java -version` yang berhasil, yang terpasang JRE, bukan JDK.
3. Mulai ulang `npm run dev` supaya server dev membaca `PATH` yang baru.

Kalau JDK belum terpasang, halaman pelajaran Java akan menampilkan instruksi pemasangan (bukan error mentah). Jalur JavaScript & React tidak terpengaruh sama sekali.

**Penting:** fitur ini **hanya aktif lewat `npm run dev` / `npm run preview` di komputermu sendiri**. Endpoint `/devjava/*` sengaja tidak pernah ikut ter-deploy ke Vercel (tidak ada JDK di sana) — di situs produksi, jalur itu otomatis dikembalikan ke halaman utama.

### Cara kerja

| Bagian | File |
| --- | --- |
| Runner (spawn `javac`/`java`, timeout, batas output) | `server/javaRunner.js` |
| Terjemahan pesan galat javac/java → Bahasa Indonesia | `server/javaGalat.js` |
| Plugin Vite yang menyambungkan runner ke browser (`/devjava/status`, `/devjava/run`, `/devjava/uji`) | `vite.config.js` (fungsi `javaLokal()`) |
| Klien di browser (compile+run, urai hasil tes, dsb.) | `src/engine/javaClient.js` |
| Halaman pelajaran & Uji Pemahaman | `src/pages/PelajaranJava.jsx`, `src/pages/UjiPemahamanJava.jsx` |
| Progress (terpisah dari JS/React) | `src/state/progressJava.jsx` |
| Konten pelajaran & bank soal | `src/lessonsJava/` |

### Lima jenis latihan (`subtipe` pada tiap pelajaran)

| `subtipe` | Cara dites | Contoh field wajib |
| --- | --- | --- |
| `kode-output` | Kompilasi sekali, jalankan dengan beberapa `stdin`, bandingkan `stdout` | `kelasUtama`, `kodeAwal`, `solusi`, `tes: [{nama, stdin, harap}]` |
| `kode-kelas` | Kode siswa dikompilasi bersama kelas tester tersembunyi (`Penguji.java` + `tesUtamaIsi`) yang memakai **reflection** untuk memeriksa `private`, constructor, `static` | `tesUtamaNama`, `tesUtamaIsi`, `daftarTes` |
| `prediksi` | Siswa menulis prediksi output, cuplikan dijalankan sungguhan untuk membandingkan | `kodeCuplikan`, `penjelasan` |
| `bedah-galat` | Kode bermasalah dijalankan otomatis untuk menangkap pesan galat asli; siswa menjawab pilihan ganda lalu memperbaiki kodenya | `kodeBermasalah`, `pilihanPenyebab`, `jenisGalatBenar`, `solusi`, `tes` |
| `diagram-memori` | Pilihan ganda tentang objek/rujukan pada sebuah cuplikan, dikonfirmasi dengan menjalankannya | `kodeCuplikan`, `pertanyaan: [{judul, teks, pilihan}]` |

Helper reflection tersembunyi (`Penguji.java`) ada di `src/lessonsJava/_bersama/penguji.js` — jangan diubah per-pelajaran, cukup panggil `Penguji.cek(nama, kondisi, pesanGagal)` dkk. dari `tesUtamaIsi`.

### Uji Pemahaman & Latihan V-3

Tiap pekan (Pekan 2 **dan** Pekan 3) punya dua jalur saat pertama kali dibuka: **"Uji Pemahaman"** (lewati pekan itu kalau sudah dikuasai) atau **"Belajar dari awal"**. Uji Pemahaman menampilkan 2 soal per pelajaran (diacak dari bank ≥4 soal/pelajaran di `src/lessonsJava/_bersama/bankPekan2.js` / `bankPekan3.js`) — pelajaran yang semua soalnya benar otomatis ditandai selesai, sisanya masuk daftar **remedial** (bisa diulang dengan soal baru lewat "Uji ulang bagian yang salah"). Pekan 3 juga punya **"Latihan V-3"** (`?v3=1`) — format sama, tapi murni catatan latihan (tidak mengubah status pelajaran), untuk persiapan verifikasi tatap muka di kelas.

### Cara menambah pelajaran atau soal Java

1. Pelajaran baru: buat file di `src/lessonsJava/pekan-2/` atau `pekan-3/` (urutan mengikuti nama file), isi sesuai `subtipe` yang dipilih (lihat contoh pelajaran yang ada untuk masing-masing subtipe).
2. Soal bank: tambahkan ke object `bankPekan2`/`bankPekan3` di `src/lessonsJava/_bersama/`, dengan `id` unik dan `lessonId` yang cocok — minimal 4 soal per pelajaran.
3. Jalankan `npm run check-lessons-java -- <sebagian-id>` untuk memverifikasi solusinya benar-benar lolos lewat JDK.

## Struktur folder

```
├── index.html
├── vite.config.js             # + plugin javaLokal() untuk runner Java (dev only)
├── server/
│   ├── javaRunner.js          # spawn javac/java, timeout, batas output
│   └── javaGalat.js           # terjemahan pesan galat javac/java
├── scripts/
│   ├── check-lessons.js       # cek pelajaran JS: solusi lolos tes, kodeAwal belum lolos
│   └── check-lessons-java.js  # cek pelajaran Java lewat JDK sungguhan
└── src/
    ├── main.jsx, App.jsx      # entry, router, header
    ├── styles.css             # semua CSS + tema terang/gelap
    ├── pages/
    │   ├── Beranda.jsx        # peta chapter JS + jalur Java, XP, streak
    │   ├── Pelajaran.jsx      # halaman latihan JS (materi | editor + console/tes/preview)
    │   ├── PelajaranJava.jsx  # halaman latihan Java (kelima subtipe)
    │   ├── UjiPemahamanJava.jsx  # Uji Pemahaman & Latihan V-3
    │   └── Pengaturan.jsx     # tema, ekspor/impor, reset progress
    ├── components/            # Editor, EditorJava, Markdown, ProgressBar, Confetti, ChapterCard
    ├── state/
    │   ├── progress.jsx       # progress JS/React (localStorage)
    │   └── progressJava.jsx   # progress Java: TERPISAH, + jalur/remedial/riwayat uji
    ├── engine/
    │   ├── runner.js          # memilih worker (js) atau iframe (dom/react)
    │   ├── jsWorker.js        # Web Worker untuk pelajaran JS (dimatikan setelah 3 detik)
    │   ├── jsEngine.js        # eksekusi kode JS + tes
    │   ├── domEngine.js       # eksekusi DOM/React di iframe (atau jsdom saat check-lessons)
    │   ├── javaClient.js      # klien browser utk runner Java (/devjava/*)
    │   ├── babel.js           # compile JSX, import/export, pengaman infinite loop
    │   ├── tes.js             # sistem tes, pesan error ramah
    │   └── format.js          # format nilai untuk console
    ├── lessons/               # konten jalur JavaScript → React
    │   ├── chapters.js, index.js, susun.js
    │   ├── _bersama/          # helper (bukan pelajaran): fetch palsu, potongan kode portofolio
    │   ├── 01-dasar-js/
    │   └── ... sampai 13-backend-node/
    └── lessonsJava/           # konten jalur Java — PBO
        ├── chapters.js, index.js, susun.js
        ├── _bersama/          # Penguji.java, bank soal Uji Pemahaman, helper soal
        ├── pekan-2/
        └── pekan-3/
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

Menjalankan **kedua** checker berurutan:

1. `scripts/check-lessons.js` — tiap pelajaran JS di Node (DOM/React memakai jsdom), memastikan **solusi** lolos semua tesnya sendiri dan **kodeAwal** belum lolos semua tes (supaya tidak ada latihan "gratis").
2. `scripts/check-lessons-java.js` — tiap pelajaran Java lewat JDK sungguhan (butuh `javac`/`java` di `PATH`; kalau tidak ada, langkah ini dilewati dengan pesan jelas), dengan pemeriksaan yang disesuaikan per `subtipe` (lihat bagian Course Java — PBO).

```bash
npm run check-lessons
```

```bash
npm run check-lessons -- react       # filter pelajaran JS
npm run check-lessons-java -- array  # filter pelajaran Java saja
```

## Cara kerja singkat

- **Pelajaran JS** dijalankan di **Web Worker**. `console.log` ditangkap dan dikirim ke panel Console. Jika kode berjalan lebih dari 3 detik (misalnya infinite loop), worker dimatikan dan dibuat ulang. `setTimeout`/Promise ditunggu sampai selesai (maks. 2 detik) sebelum tes dijalankan. Chapter 8 memakai `fetch` tiruan (`src/lessons/_bersama/apiPalsu.js`), jadi tetap bisa offline.
- **Pelajaran DOM/React** dijalankan di **iframe** (tab Preview). Iframe tidak bisa "dimatikan" seperti worker, jadi setiap loop disisipi pengaman lewat Babel: loop yang berjalan lebih dari 2 detik dihentikan dengan pesan error.
- **JSX** di-compile oleh `@babel/standalone` (dari npm, bukan CDN). `import { useState } from "react"` dan `export default App` didukung. React 19 tidak lagi menyediakan build UMD, jadi React untuk preview diambil dari bundle aplikasi.
- **Pelajaran Java** dijalankan **sungguhan** lewat `javac`/`java` di komputermu (bukan Worker/iframe) — lihat bagian **Course Java — PBO** di atas untuk detail lengkap.
