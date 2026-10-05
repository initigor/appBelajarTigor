// Chapter 13 — Backend dengan Node.js. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'node-apa-itu': {
    intisari: 'Node.js menjalankan JavaScript **di luar browser** (terminal/server) dengan mesin V8; tidak ada `window` atau `document`, tetapi punya akses file dan jaringan, dan paket dikelola npm lewat `package.json`.',
    rangkuman: [
      'Node.js = JavaScript di luar browser (mesin V8 seperti Chrome), dijalankan lewat `node app.js`. Tidak ada `window`/`document`, tetapi ada akses `fs`, `http`, dll.',
      'Dipakai untuk backend/API server, script otomatisasi, dan tools build (Vite adalah program Node.js).',
      '**npm** mengelola paket pihak ketiga (seperti `pip`). `package.json` mencatat identitas proyek dan `dependencies` (seperti `requirements.txt`).',
      '`npm install express` memasang satu paket dan mencatatnya; `npm install` tanpa nama memasang semua yang tercatat (ke `node_modules`). Modul: CommonJS (`require`) atau ES Modules (`import`/`export`).',
    ],
    soal: [
      {
        tanya: 'Apa yang **tidak** tersedia di Node.js dibanding di browser?',
        benar: '`window` dan `document`',
        salah: ['Fungsi `console.log`', 'Operator `+` dan `-`', 'Tipe data `string`'],
        jelas: 'Node.js tidak punya halaman web, jadi object DOM seperti `window` dan `document` tidak ada.',
      },
      {
        tanya: 'Apa fungsi `npm install` tanpa menyebut nama paket?',
        benar: 'Memasang semua paket yang tercatat di `package.json`',
        salah: ['Memperbarui Node.js ke versi terbaru', 'Menghapus folder `node_modules`', 'Membuat file `package.json` kosong'],
        jelas: 'Perintah ini membaca `dependencies` di `package.json` dan memasang semuanya.',
      },
      {
        tanya: 'Mana yang merupakan gaya modul modern (ES Modules)?',
        benar: '`import express from "express";`',
        salah: ['`const express = require("express");`', '`include <express>`', '`load("express")`'],
        jelas: '`require` adalah gaya CommonJS yang lama. ES Modules memakai `import` dan `export`.',
      },
      {
        tanya: 'Perintah untuk menjalankan file `app.js` dengan Node.js adalah ...',
        benar: '`node app.js`',
        salah: ['`./app.js`', '`js app.js`', '`npm app.js`'],
        jelas: 'Mirip `python app.py`, tetapi untuk JavaScript: `node app.js`.',
      },
    ],
  },

  'node-http-siklus': {
    intisari: 'HTTP bekerja dengan pola request (method + path + body) dari client dan response (status code + body) dari server; digit pertama status code menunjukkan kategori: 2xx sukses, 4xx salah pengirim, 5xx salah server.',
    rangkuman: [
      'Request punya **method** (`GET` ambil, `POST` kirim baru, `PUT`/`PATCH` ubah, `DELETE` hapus), **path** (`/api/produk`), dan **body** (biasanya JSON, untuk `POST`/`PUT`).',
      'Response punya **status code** dan **body**. `2xx` sukses (`200` OK, `201` Created), `4xx` salah dari sisi pengirim (`400` Bad Request, `404` Not Found), `5xx` salah di server (`500`).',
      'Di Express, status dan body ditentukan eksplisit: `res.status(404).json({ pesan: "Produk tidak ditemukan" })`.',
      '`res.ok` pada `fetch` hanyalah singkatan dari "status-nya 2xx".',
    ],
    soal: [
      {
        tanya: 'Method HTTP yang dipakai untuk **mengambil** data adalah ...',
        benar: '`GET`',
        salah: ['`POST`', '`PUT`', '`DELETE`'],
        jelas: '`GET` untuk membaca, `POST` untuk membuat baru, `PUT`/`PATCH` untuk mengubah, `DELETE` untuk menghapus.',
      },
      {
        tanya: 'Status code `404` berarti ...',
        benar: 'Not Found: sumber daya yang diminta tidak ada',
        salah: ['Server mengalami error internal', 'Request berhasil dan data baru dibuat', 'Server menolak karena sedang sibuk'],
        jelas: '`404` termasuk kategori `4xx`, yakni kesalahan dari sisi pengirim/permintaan. Error internal server adalah `500`.',
      },
      {
        tanya: 'Kategori status code yang menandakan **sukses** adalah ...',
        benar: '`2xx`',
        salah: ['`1xx`', '`4xx`', '`5xx`'],
        jelas: '`200` OK dan `201` Created termasuk `2xx`. `4xx` salah pengirim, `5xx` salah server.',
      },
      {
        tanya: 'Server baru saja berhasil membuat data baru dari request `POST`. Status yang paling tepat adalah ...',
        benar: '`201 Created`',
        salah: ['`404 Not Found`', '`500 Internal Server Error`', '`400 Bad Request`'],
        jelas: '`201` khusus menandakan data baru berhasil dibuat. `200` juga sukses tetapi lebih umum.',
      },
    ],
  },

  'node-routing': {
    intisari: 'Routing mencocokkan method dan path request dengan daftar route terdaftar segmen demi segmen; bagian yang berawalan `:` (mis. `:id`) adalah route param yang nilainya dibaca lewat `req.params`.',
    rangkuman: [
      'Express mendaftarkan route sebagai pasangan (method, path) dengan fungsi penangannya: `app.get("/produk/:id", (req, res) => { ... })`.',
      '`:id` adalah **route param**: request ke `/produk/7` membuat `req.params` menjadi `{ id: "7" }`.',
      'Saat request datang, Express **mencocokkan** method + path dengan route terdaftar, segmen demi segmen; route pertama yang cocok yang dijalankan.',
      'Segmen biasa harus sama persis, sedangkan segmen berawalan `:` cocok dengan nilai apa pun dan disimpan sebagai param.',
    ],
    soal: [
      {
        tanya: 'Berapa isi `req.params` untuk request `GET /produk/7` pada route `/produk/:id`?',
        benar: '`{ id: "7" }`',
        salah: ['`{ id: 7 }`', '`{ produk: 7 }`', '`{}`'],
        jelas: 'Nama param diambil dari path route (`id`) dan nilainya selalu berupa string.',
      },
      {
        tanya: 'Apa arti tanda `:` pada path `/produk/:id`?',
        benar: 'Penanda route param: bagian path yang nilainya bisa berubah-ubah',
        salah: ['Penanda komentar', 'Pemisah antara method dan path', 'Penanda bahwa route hanya boleh dipakai sekali'],
        jelas: 'Bagian berawalan `:` cocok dengan nilai apa pun dan bisa dibaca lewat `req.params`.',
      },
      {
        tanya: 'Apakah route `GET /produk/:id` cocok dengan request `POST /produk/7`?',
        benar: 'Tidak, karena method-nya berbeda',
        salah: ['Ya, karena path-nya cocok', 'Ya, method tidak ikut dicocokkan', 'Tidak, karena angka tidak boleh dipakai di path'],
        jelas: 'Pencocokan mencakup method **dan** path. Keduanya harus sesuai.',
      },
      {
        tanya: 'Saat beberapa route terdaftar, route mana yang dijalankan untuk sebuah request?',
        benar: 'Route pertama yang cocok dengan method dan path request',
        salah: ['Semua route yang terdaftar dijalankan berurutan', 'Route terakhir yang terdaftar', 'Route yang namanya paling pendek'],
        jelas: 'Express mencari yang cocok dari awal dan menjalankan route pertama itu.',
      },
    ],
  },

  'node-query-params': {
    intisari: '`req.params` berisi bagian tetap path (`/produk/:id`) dan `req.query` berisi pasangan setelah `?` (`?kota=Bandung&limit=5`); keduanya selalu berupa **string**, jadi ubah dengan `Number()` bila perlu dihitung.',
    rangkuman: [
      '**Route param** (`req.params`) adalah bagian dari path: `/produk/7` → `{ id: "7" }`.',
      '**Query string** (`req.query`) adalah bagian setelah `?`, pasangan `kunci=nilai` dipisah `&`: `?kota=Bandung&limit=5` → `{ kota: "Bandung", limit: "5" }`.',
      'Nilai di `req.query` dan `req.params` **selalu string**, walau tampak seperti angka. Konversi sendiri dengan `Number(...)`.',
      'Karakter khusus di-*encode* (`%20` untuk spasi). `decodeURIComponent("Toko%20Maju")` → `"Toko Maju"`.',
    ],
    soal: [
      {
        tanya: 'Untuk `GET /produk?kota=Bandung&limit=5`, apa tipe data `req.query.limit`?',
        benar: 'String, yaitu `"5"`',
        salah: ['Number, yaitu `5`', 'Boolean `true`', '`undefined`'],
        jelas: 'Semua nilai query dan param berupa string. Gunakan `Number(req.query.limit)` bila ingin menghitung.',
      },
      {
        tanya: 'Mana bagian URL yang menjadi `req.query` pada `/produk/7?urut=harga`?',
        benar: '`urut=harga` (bagian setelah tanda `?`)',
        salah: ['`7`', '`/produk`', '`produk/7`'],
        jelas: '`7` adalah route param (jika route-nya `/produk/:id`). Query string adalah yang mengikuti `?`.',
      },
      {
        tanya: 'Apa hasil `decodeURIComponent("Toko%20Maju")`?',
        benar: '`"Toko Maju"`',
        salah: ['`"Toko%20Maju"`', '`"Toko20Maju"`', '`"TokoMaju"`'],
        jelas: '`%20` adalah spasi yang di-encode, dan fungsi ini mengembalikannya.',
      },
      {
        tanya: 'Query `limit=5` harus dipakai untuk menghitung `limit + 1` = 6. Apa yang perlu dilakukan?',
        benar: 'Mengubahnya dulu dengan `Number(req.query.limit)`',
        salah: ['Tidak perlu apa-apa, JavaScript otomatis menghitung', 'Menambahkan tanda kutip lagi', 'Memakai `decodeURIComponent` pada angka'],
        jelas: '`"5" + 1` menghasilkan `"51"` (penggabungan string), jadi konversi ke number dulu.',
      },
    ],
  },

  'node-rest-crud': {
    intisari: 'REST menamai endpoint berdasarkan resource dan memakai HTTP method untuk aksinya (CRUD: Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE); fungsi CRUD sebaiknya mengembalikan array/object baru, bukan memutasi data asli.',
    rangkuman: [
      'REST: path berupa **resource** (`/produk`), bukan aksi, dan method menentukan aksinya.',
      '**CRUD:** `POST /produk` (Create), `GET /produk` dan `GET /produk/:id` (Read), `PUT`/`PATCH /produk/:id` (Update), `DELETE /produk/:id` (Delete).',
      'Server sungguhan menyimpan data di database; untuk belajar disimulasikan dengan **array di memori**.',
      'Fungsi CRUD tidak boleh memutasi array asli: kembalikan **array/object baru** (spread, `filter`, `map`), seperti prinsip di Chapter 4 dan 6.',
    ],
    soal: [
      {
        tanya: 'Method dan path mana yang membuat produk **baru** dalam gaya REST?',
        benar: '`POST /produk`',
        salah: ['`GET /produk/baru`', '`DELETE /produk`', '`PUT /produk/buat`'],
        jelas: 'REST memakai method sebagai aksi: `POST` untuk membuat. Path cukup menyebut resource-nya.',
      },
      {
        tanya: 'CRUD adalah singkatan dari ...',
        benar: 'Create, Read, Update, Delete',
        salah: ['Copy, Run, Upload, Download', 'Connect, Request, Update, Deploy', 'Create, Reload, Undo, Debug'],
        jelas: 'Keempat aksi dasar pada data: membuat, membaca, mengubah, menghapus.',
      },
      {
        tanya: 'Cara yang benar menambah produk ke `daftar` dalam fungsi CRUD (tanpa mutasi)?',
        benar: '`return [...daftar, produkBaru];`',
        salah: ['`daftar.push(produkBaru); return daftar;`', '`return daftar.push(produkBaru);`', '`daftar[daftar.length] = produkBaru;`'],
        jelas: 'Spread membuat array baru. `push` memutasi array asli dan mengembalikan jumlah elemen, bukan array.',
      },
      {
        tanya: 'Method HTTP mana yang menghapus produk dengan id tertentu?',
        benar: '`DELETE /produk/:id`',
        salah: ['`GET /produk/:id/hapus`', '`POST /produk/:id`', '`PUT /produk`'],
        jelas: '`DELETE` memang disediakan untuk aksi menghapus resource.',
      },
    ],
  },

  'node-middleware': {
    intisari: 'Middleware adalah fungsi yang berjalan **sebelum** handler utama untuk logging, cek login, atau validasi input; ia memanggil `next()` untuk lanjut atau menjawab sendiri (mis. `400`) untuk berhenti, dan data dari client tidak boleh langsung dipercaya.',
    rangkuman: [
      'Middleware jalan **sebelum** handler utama: logging, cek login (`401`), validasi input. Ia memanggil `next()` untuk lanjut, atau berhenti dengan mengirim response sendiri.',
      '**Jangan pernah percaya data dari client.** Validasi bentuknya dulu; bila salah balas `400 Bad Request` dengan pesan jelas dan jangan lanjut ke logika bisnis.',
      'Di Express: `app.post("/produk", cekLogin, handler)`. Handler hanya jalan bila `cekLogin` memanggil `next()`.',
      'Di chapter ini disederhanakan: tiap fungsi menerima `req` lalu **mengembalikan** `req` (lanjut) atau `{ error, status }` (berhenti).',
    ],
    soal: [
      {
        tanya: 'Apa tugas `next()` di dalam middleware Express?',
        benar: 'Melanjutkan ke middleware atau handler berikutnya',
        salah: ['Menghentikan server', 'Mengirim response sukses ke client', 'Mengulang middleware dari awal'],
        jelas: 'Kalau `next()` tidak dipanggil (dan tidak ada response), rantai berhenti.',
      },
      {
        tanya: 'Request `POST /produk` berisi `harga` yang bukan angka. Status response yang tepat dari middleware validasi adalah ...',
        benar: '`400 Bad Request`',
        salah: ['`200 OK`', '`404 Not Found`', '`500 Internal Server Error`'],
        jelas: 'Data tidak valid adalah kesalahan dari sisi pengirim (`4xx`), khususnya `400`.',
      },
      {
        tanya: 'Kenapa data dari client tidak boleh langsung dipercaya?',
        benar: 'Karena bisa salah bentuk atau berbahaya',
        salah: ['Karena data client selalu berupa angka', 'Karena server tidak bisa membaca data client', 'Karena validasi hanya diperlukan saat testing'],
        jelas: 'Client bisa mengirim apa saja, termasuk data kosong atau berbahaya. Validasi melindungi logika bisnis dan database.',
      },
      {
        tanya: 'Apa yang terjadi pada handler utama jika middleware validasi mengirim response `400` tanpa memanggil `next()`?',
        benar: 'Handler utama tidak dijalankan',
        salah: ['Handler tetap dijalankan setelahnya', 'Server otomatis restart', 'Handler dijalankan dua kali'],
        jelas: 'Middleware yang menjawab sendiri menghentikan rantai, sehingga logika bisnis tidak menerima data tidak valid.',
      },
    ],
  },

  'proyek-kalkulator-umkm': {
    intisari: 'API kalkulator UMKM menggabungkan HTTP, routing, validasi, dan rumus bisnis: HPP = bahan + tenaga kerja + operasional, harga jual = HPP × (1 + margin%), dan BEP = biaya tetap / (harga jual − biaya variabel per unit) dibulatkan ke atas.',
    rangkuman: [
      '**HPP** (Harga Pokok Produksi) = biaya bahan + tenaga kerja + operasional, per unit.',
      '**Harga jual** = `hpp * (1 + margin / 100)` dibulatkan ke rupiah terdekat (`Math.round`); keuntungan per unit = harga jual − HPP.',
      '**BEP** = `biayaTetap / (hargaJual − biayaVariabelPerUnit)` dibulatkan **ke atas** (`Math.ceil`), karena unit tidak bisa pecahan. Bila `hargaJual` tidak lebih besar dari biaya variabel, BEP mustahil → `null`.',
      'Endpoint `POST /api/hitung` memvalidasi input dulu (balas `400` bila salah), lalu menghitung dan membalas `{ status, body }`.',
    ],
    soal: [
      {
        tanya: 'HPP sebuah kue Rp8.000 dan margin keuntungan 25%. Berapa harga jualnya?',
        benar: 'Rp10.000',
        salah: ['Rp8.025', 'Rp8.250', 'Rp11.000'],
        jelas: '8000 × (1 + 25 / 100) = 8000 × 1,25 = 10.000.',
      },
      {
        tanya: 'Kenapa BEP dibulatkan ke atas dengan `Math.ceil`?',
        benar: 'Karena unit tidak bisa pecahan dan modal baru balik setelah unit penuh terjual',
        salah: ['Karena `Math.ceil` lebih cepat dihitung', 'Karena BEP selalu bilangan genap', 'Karena `Math.round` tidak tersedia'],
        jelas: 'Jika hasilnya 3,2 unit, kamu perlu menjual 4 unit agar benar-benar impas.',
      },
      {
        tanya: 'Apa yang dikembalikan `hitungBep` jika `hargaJual` tidak lebih besar dari `biayaVariabelPerUnit`?',
        benar: '`null`, karena BEP mustahil tercapai (rugi terus per unit)',
        salah: ['`0`', '`Infinity`', 'Selalu `1`'],
        jelas: 'Selisih harga dan biaya variabel nol atau negatif membuat rumus tidak bermakna, sehingga hasilnya dianggap tidak ada.',
      },
      {
        tanya: 'Request ke `POST /api/hitung` berisi data yang tidak lengkap. Apa yang seharusnya dilakukan endpoint?',
        benar: 'Membalas `400 Bad Request` dengan pesan yang jelas, tanpa menghitung',
        salah: ['Tetap menghitung dengan nilai tebakan', 'Membalas `200 OK` dengan hasil `NaN`', 'Membalas `500` agar client mencoba lagi'],
        jelas: 'Input tidak valid adalah kesalahan pengirim. Berikan `400`, jangan lanjutkan ke logika bisnis.',
      },
    ],
  },
};
