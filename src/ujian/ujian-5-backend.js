import { baris, kode, output, pg, pgk } from './_bersama/buat.js';

export default {
  id: 'ujian-5-backend',
  judul: 'Ujian 5: Backend Node.js & API',
  ikon: '📝',
  deskripsi: 'Node.js & npm, HTTP request/response, routing, query & params, REST CRUD, dan middleware.',
  chapterIds: [13],
  setelahChapter: 13,
  lulus: 70,
  xp: 150,
  komposisi: { 'pilihan-ganda': 8, 'prediksi-output': 3, kode: 2 },
  soal: [
    // ---------- Node.js & npm ----------
    pg('u5-01', 13, 'Apa perbedaan utama menjalankan JavaScript di **Node.js** dibanding di browser?',
      ['Tidak ada `window`/`document` (tidak ada halaman web), tetapi bisa mengakses file dan jaringan', 'Node.js tidak mendukung fungsi dan array', 'Node.js hanya bisa menjalankan satu baris kode', 'Di Node.js, semua variabel otomatis menjadi global'], 0,
      'Node.js menjalankan JavaScript di luar browser (terminal/server) memakai mesin V8 yang sama. Tidak ada `document`, tetapi ada modul seperti `fs` dan `http`.', 'node-apa-itu'),
    pg('u5-02', 13, 'Apa yang dilakukan perintah `npm install express`?',
      ['Memasang paket express dan mencatatnya di `dependencies` pada package.json', 'Menjalankan server express', 'Menghapus paket express', 'Membuat folder proyek baru bernama express'], 0,
      '`npm install <nama>` mengunduh paket ke `node_modules` dan mencatatnya di `package.json` (mirip `pip install` + `requirements.txt`).', 'node-apa-itu'),
    pg('u5-03', 13, 'Apa isi dan fungsi file `package.json`?',
      ['Mencatat identitas proyek Node.js dan daftar paket yang dipakai', 'Menyimpan seluruh kode program', 'Berisi data pengguna aplikasi', 'Menyimpan password server'], 0,
      '`package.json` adalah "kartu identitas" proyek: nama, versi, script, dan `dependencies`. Dengannya `npm install` tahu paket apa yang harus dipasang.', 'node-apa-itu'),
    pg('u5-04', 13, 'Apa yang dilakukan `npm install` (tanpa nama paket) di folder proyek?',
      ['Memasang semua paket yang tercatat di package.json', 'Memasang paket terbaru dari seluruh npm', 'Menghapus folder node_modules', 'Menjalankan proyek'], 0,
      'Tanpa nama paket, npm membaca `package.json` dan memasang semua dependensi yang tercatat.', 'node-apa-itu'),
    pgk('u5-05', 13, 'Manakah penulisan modul bergaya **ES Modules**?',
      ["import express from 'express';", "const express = require('express');", '#include <express>', 'use express;'], 0,
      "`import ... from ...` adalah ES Modules (modern). `require(...)` adalah gaya lama CommonJS.", 'node-apa-itu'),

    // ---------- HTTP ----------
    pgk('u5-06', 13, 'Method HTTP mana yang lazim dipakai untuk **membuat data baru** pada REST API?', ['GET', 'POST', 'DELETE', 'HEAD'], 1,
      '`POST` membuat data baru. `GET` mengambil, `PUT`/`PATCH` mengubah, dan `DELETE` menghapus.', 'node-rest-crud'),
    pg('u5-07', 13, 'Apa arti status code **404**?',
      ['Not Found: sumber daya yang diminta tidak ada', 'Server mengalami kesalahan internal', 'Data baru berhasil dibuat', 'Pengguna belum login'], 0,
      '`404 Not Found` termasuk kelompok `4xx` (kesalahan dari sisi pengirim request), misalnya id yang diminta tidak ada.', 'node-http-siklus'),
    pgk('u5-08', 13, 'Status code mana yang paling tepat setelah server **berhasil membuat data baru**?', ['200', '201', '301', '404'], 1,
      '`201 Created` khusus untuk menandakan data baru berhasil dibuat. `200 OK` untuk sukses umum.', 'node-http-siklus'),
    pg('u5-09', 13, 'Status code berawalan `5xx` (misalnya 500) menandakan kesalahan di pihak mana?', ['Server', 'Pengirim request (client)', 'Jaringan internet', 'Browser'], 0,
      '`5xx` = kesalahan di sisi **server**. `4xx` = kesalahan dari sisi pengirim (data salah, tidak ditemukan, dll.).', 'node-http-siklus'),
    pg('u5-10', 13, 'Sebuah HTTP request terdiri dari tiga bagian utama. Apa saja?',
      ['Method, URL/path, dan body (data yang dikirim)', 'Nama, umur, dan alamat', 'Status code, pesan, dan body', 'Judul, isi, dan footer'], 0,
      'Request memuat method (jenis aksi), path (alamat tujuan), dan body (data, biasanya JSON, untuk POST/PUT). Status code adalah bagian dari **response**.', 'node-http-siklus'),

    // ---------- Routing, query & params ----------
    pg('u5-11', 13, 'Pada route `/produk/:id`, apa arti `:id`?',
      ['Route param: bagian path yang berubah-ubah, nilainya dibaca lewat `req.params.id`', 'Komentar yang diabaikan Express', 'Nama file yang harus ada di server', 'Query string bernama id'], 0,
      'Segmen berawalan `:` cocok dengan apa saja di path request. Untuk `/produk/7`, `req.params` berisi `{ id: "7" }`.', 'node-routing'),
    pg('u5-12', 13, 'Pada request `GET /produk?kota=Bandung&limit=5`, berapa nilai `req.query.limit`?', ['5 (number)', '"5" (string)', '"limit=5"', 'undefined'], 1,
      'Nilai di `req.query` dan `req.params` **selalu string**. Ubah dengan `Number(...)` jika perlu dihitung.', 'node-query-params'),
    pgk('u5-13', 13, 'Bagian `kota=Bandung` pada URL `/produk?kota=Bandung` dibaca dari mana di Express?', ['req.params', 'req.query', 'req.body', 'req.method'], 1,
      'Bagian setelah tanda `?` adalah *query string* dan tersedia di `req.query`. `req.params` khusus untuk segmen path seperti `:id`.', 'node-query-params'),
    pg('u5-14', 13, 'Apa yang dilakukan `decodeURIComponent("Toko%20Maju")`?', ['Mengubahnya menjadi "Toko Maju"', 'Mengubahnya menjadi "Toko20Maju"', 'Menghapus tanda %', 'Menghasilkan error'], 0,
      '`%20` adalah spasi yang di-*encode* di URL. `decodeURIComponent` mengembalikannya ke bentuk asli.', 'node-query-params'),

    // ---------- REST & CRUD ----------
    pgk('u5-15', 13, 'Endpoint mana yang mengikuti konvensi REST untuk **menghapus** produk ber-id 7?',
      ['DELETE /produk/7', 'GET /hapusProduk?id=7', 'POST /produk/hapus/7', 'PUT /produk/7'], 0,
      'REST menamai endpoint dengan *resource* (`/produk/7`) dan memakai method HTTP (`DELETE`) untuk menyatakan aksinya.', 'node-rest-crud'),
    pg('u5-16', 13, 'CRUD adalah singkatan dari empat operasi dasar data. Apa saja?', ['Create, Read, Update, Delete', 'Connect, Run, Upload, Download', 'Copy, Rename, Undo, Deploy', 'Call, Return, Use, Debug'], 0,
      'Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).', 'node-rest-crud'),

    // ---------- Middleware & validasi ----------
    pg('u5-17', 13, 'Apa tugas `next()` di dalam sebuah middleware Express?',
      ['Meneruskan request ke middleware/handler berikutnya', 'Menutup koneksi server', 'Mengirim response ke client', 'Mengulang request dari awal'], 0,
      'Middleware bisa berhenti dengan mengirim response sendiri, atau memanggil `next()` supaya proses lanjut ke berikutnya.', 'node-middleware'),
    pg('u5-18', 13, 'Mengapa server tidak boleh langsung mempercayai data yang dikirim client?',
      ['Data dari client bisa salah bentuk atau berbahaya, sehingga harus divalidasi lebih dulu', 'Karena data dari client selalu terenkripsi', 'Karena client tidak boleh mengirim data ke server', 'Karena server hanya menerima angka'], 0,
      'Siapa pun bisa mengirim request apa saja. Validasi (mis. di middleware) memastikan hanya data yang benar yang masuk ke logika bisnis.', 'node-middleware'),
    pgk('u5-19', 13, 'Status code mana yang paling tepat ketika client mengirim body yang **tidak valid** (misalnya nama produk kosong)?', ['200', '400', '404', '500'], 1,
      '`400 Bad Request` menandakan permintaan dari client salah/tidak valid. `500` untuk kesalahan di sisi server.', 'node-middleware'),
    pg('u5-20', 13, 'Pada proyek kalkulator UMKM, mengapa BEP dibulatkan dengan `Math.ceil` (ke atas)?',
      ['Karena unit tidak bisa pecahan, dan harus dijual sampai biaya tetap benar-benar tertutup', 'Karena `Math.ceil` lebih cepat dari `Math.round`', 'Karena hasilnya harus selalu bilangan genap', 'Supaya hasilnya selalu lebih kecil dari biaya tetap'], 0,
      'BEP = biaya tetap / (harga jual − biaya variabel per unit). Kalau hasilnya 33,2 unit, kamu harus menjual 34 unit agar impas, bukan 33.', 'proyek-kalkulator-umkm'),

    // ---------- Prediksi output ----------
    output('u5-o1', 13,
      baris('const url = new URL("http://x.com/produk?kota=Bandung&limit=5");', 'console.log(Object.fromEntries(url.searchParams));', 'console.log(typeof url.searchParams.get("limit"));'),
      baris("{ kota: 'Bandung', limit: '5' }", 'string'),
      'Semua nilai query string berupa **string**, termasuk `limit`, sehingga `typeof` menghasilkan `"string"`.', 'node-query-params'),
    output('u5-o2', 13,
      baris('console.log(decodeURIComponent("Toko%20Maju"));', 'console.log("/produk/7".split("/"));', 'console.log("/produk/7".split("/").filter(Boolean));'),
      baris('Toko Maju', "['', 'produk', '7']", "['produk', '7']"),
      'Path diawali `/`, jadi `split("/")` menghasilkan elemen pertama string kosong. `filter(Boolean)` membuang elemen kosong itu. Teknik ini dipakai untuk mencocokkan route segmen demi segmen.', 'node-routing'),
    output('u5-o3', 13,
      baris('const data = [{ id: 1 }, { id: 2 }, { id: 3 }];', 'const baru = data.filter((d) => d.id !== 2);', 'console.log(data.length, baru.length);', 'console.log(baru.map((d) => d.id));'),
      baris('3 2', '[1, 3]'),
      '`filter` membuat array baru tanpa item ber-id 2, sedangkan `data` asli tetap 3 item. Inilah pola "hapus tanpa mutasi" pada CRUD.', 'node-rest-crud'),
    output('u5-o4', 13,
      baris(
        'function cek(req) {',
        '  if (!req.body?.nama) return { error: "Nama wajib", status: 400 };',
        '  return req;',
        '}',
        'console.log(cek({ body: {} }));',
        'console.log(cek({ body: { nama: "A" } }).body.nama);',
      ),
      baris("{ error: 'Nama wajib', status: 400 }", 'A'),
      'Body tanpa `nama` gagal validasi sehingga fungsi mengembalikan object error berstatus 400. Body yang valid dikembalikan apa adanya, jadi `.body.nama` adalah `"A"`.', 'node-middleware'),
    output('u5-o5', 13,
      baris('const params = { id: "7" };', 'console.log(params.id + 1);', 'console.log(Number(params.id) + 1);', 'console.log(typeof params.id);'),
      baris('71', '8', 'string'),
      '`req.params.id` adalah string, jadi `"7" + 1` menggabung menjadi `"71"`. Setelah diubah dengan `Number(...)` barulah hasilnya 8.', 'node-query-params'),
    output('u5-o6', 13,
      baris(
        'function jalankan(fns, req) {',
        '  let sekarang = req;',
        '  for (const fn of fns) {',
        '    const hasil = fn(sekarang);',
        '    if (hasil && "error" in hasil) return hasil;',
        '    sekarang = hasil;',
        '  }',
        '  return sekarang;',
        '}',
        'const a = (r) => ({ ...r, log: true });',
        'const b = (r) => (r.admin ? r : { error: "Dilarang", status: 403 });',
        'console.log(jalankan([a, b], { admin: true }));',
        'console.log(jalankan([a, b], { admin: false }));',
      ),
      baris('{ admin: true, log: true }', "{ error: 'Dilarang', status: 403 }"),
      'Middleware `a` menambahkan `log: true`. Untuk admin, `b` meneruskan request; untuk bukan admin, `b` mengembalikan object error sehingga rantai berhenti dan error itulah hasilnya.', 'node-middleware'),

    // ---------- Menulis kode ----------
    kode('u5-k1', 13, {
      jenis: 'js',
      pelajaran: 'node-routing',
      tugas: baris(
        'Buat fungsi **`cocokPath(pola, path)`** yang mencocokkan sebuah path dengan pola route bergaya Express.',
        '',
        '- Path dan pola dipecah per segmen (`/`). Jumlah segmen harus sama.',
        '- Segmen pola yang diawali `:` cocok dengan apa saja, dan nilainya dikumpulkan sebagai params.',
        '- Cocok → kembalikan object params; tidak cocok → kembalikan `null`.',
        '',
        'Contoh:',
        '- `cocokPath("/produk/:id", "/produk/7")` → `{ id: "7" }`',
        '- `cocokPath("/toko/:t/produk/:id", "/toko/A/produk/9")` → `{ t: "A", id: "9" }`',
        '- `cocokPath("/produk/:id", "/toko/7")` → `null`',
        '- `cocokPath("/produk", "/produk")` → `{}`',
      ),
      kodeAwal: 'function cocokPath(pola, path) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function cocokPath(pola, path) {',
        '  const segPola = pola.split("/").filter(Boolean);',
        '  const segPath = path.split("/").filter(Boolean);',
        '  if (segPola.length !== segPath.length) return null;',
        '  const params = {};',
        '  for (let i = 0; i < segPola.length; i++) {',
        '    if (segPola[i].startsWith(":")) {',
        '      params[segPola[i].slice(1)] = segPath[i];',
        '    } else if (segPola[i] !== segPath[i]) {',
        '      return null;',
        '    }',
        '  }',
        '  return params;',
        '}',
        '',
      ),
      penjelasan: 'Pecah keduanya dengan `split("/").filter(Boolean)`, pastikan jumlah segmen sama, lalu bandingkan satu per satu: segmen berawalan `:` menjadi param, selain itu harus sama persis.',
      tes: [
        {
          nama: 'cocokPath',
          cek(ctx) {
            const kasus = [
              ['/produk/:id', '/produk/7', { id: '7' }],
              ['/toko/:t/produk/:id', '/toko/A/produk/9', { t: 'A', id: '9' }],
              ['/produk/:id', '/toko/7', null],
              ['/produk', '/produk', {}],
              ['/produk/:id', '/produk/7/detail', null],
              ['/produk/:id', '/produk', null],
            ];
            for (const [pola, path, harap] of kasus) {
              const r = ctx.panggil('cocokPath', pola, path);
              if (JSON.stringify(r) !== JSON.stringify(harap)) return `cocokPath("${pola}", "${path}") mengembalikan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u5-k2', 13, {
      jenis: 'js',
      pelajaran: 'node-query-params',
      tugas: baris(
        'Buat fungsi **`bacaFilter(query)`**. `query` adalah string setelah tanda `?` (tanpa `?` itu sendiri), mis. `"kota=Bandung&limit=5"`. Kembalikan object:',
        '',
        '~~~js',
        '{ kota: <string>, limit: <number> }',
        '~~~',
        '',
        '- `kota` default `""` (kosong). Nilainya perlu di-`decodeURIComponent` (mis. `Toko%20Maju` → `Toko Maju`).',
        '- `limit` diubah menjadi **angka**. Jika tidak ada atau bukan angka yang valid, pakai `10`.',
        '',
        'Contoh: `bacaFilter("kota=Bandung&limit=5")` → `{ kota: "Bandung", limit: 5 }`; `bacaFilter("")` → `{ kota: "", limit: 10 }`',
      ),
      kodeAwal: 'function bacaFilter(query) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function bacaFilter(query) {',
        '  const q = {};',
        '  if (query) {',
        '    for (const pasangan of query.split("&")) {',
        '      const [kunci, nilai] = pasangan.split("=");',
        '      q[decodeURIComponent(kunci)] = decodeURIComponent(nilai ?? "");',
        '    }',
        '  }',
        '  const limit = Number(q.limit);',
        '  return {',
        '    kota: q.kota ?? "",',
        '    limit: q.limit !== undefined && q.limit !== "" && Number.isFinite(limit) ? limit : 10,',
        '  };',
        '}',
        '',
      ),
      penjelasan: 'Nilai query selalu string, jadi `limit` harus dikonversi dengan `Number(...)`. Cek `Number.isFinite` untuk menangani "abc" (NaN), dan perlakukan nilai kosong sebagai tidak valid.',
      tes: [
        {
          nama: 'bacaFilter',
          cek(ctx) {
            const kasus = [
              ['kota=Bandung&limit=5', { kota: 'Bandung', limit: 5 }],
              ['', { kota: '', limit: 10 }],
              ['kota=Toko%20Maju', { kota: 'Toko Maju', limit: 10 }],
              ['limit=abc', { kota: '', limit: 10 }],
              ['limit=25&kota=Solo', { kota: 'Solo', limit: 25 }],
              ['limit=', { kota: '', limit: 10 }],
            ];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('bacaFilter', masuk);
              if (JSON.stringify(r) !== JSON.stringify(harap) && JSON.stringify({ kota: r?.kota, limit: r?.limit }) !== JSON.stringify(harap)) {
                return `bacaFilter(${JSON.stringify(masuk)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
              }
              if (typeof r?.limit !== 'number') return `limit harus bertipe number, bukan ${typeof r?.limit} (untuk masukan ${JSON.stringify(masuk)}).`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u5-k3', 13, {
      jenis: 'js',
      pelajaran: 'node-rest-crud',
      tugas: baris(
        'Anggap `daftar` adalah array tagihan `{ id, atasNama, lunas }`. Buat fungsi **`tandaiLunas(daftar, id)`**:',
        '',
        '- Kembalikan **array baru** dengan tagihan ber-`id` tersebut diubah menjadi `lunas: true` (tagihan lain tidak berubah).',
        '- Jika `id` tidak ditemukan, kembalikan `null`.',
        '- Array `daftar` dan object di dalamnya **tidak boleh diubah** (tanpa mutasi).',
      ),
      kodeAwal: 'function tandaiLunas(daftar, id) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function tandaiLunas(daftar, id) {',
        '  if (!daftar.some((t) => t.id === id)) return null;',
        '  return daftar.map((t) => (t.id === id ? { ...t, lunas: true } : t));',
        '}',
        '',
      ),
      penjelasan: 'Cek dulu apakah id ada (`some`). Lalu `map` membuat array baru: item yang cocok diganti object baru `{ ...t, lunas: true }`, sisanya dipakai apa adanya.',
      tes: [
        {
          nama: 'tandaiLunas',
          cek(ctx) {
            const daftar = [{ id: 1, atasNama: 'Budi', lunas: false }, { id: 2, atasNama: 'Sinta', lunas: false }];
            const beku = JSON.stringify(daftar);
            const r = ctx.panggil('tandaiLunas', daftar, 2);
            if (!Array.isArray(r)) return `tandaiLunas(daftar, 2) mengembalikan ${JSON.stringify(r)}, seharusnya array baru.`;
            if (JSON.stringify(r) !== JSON.stringify([{ id: 1, atasNama: 'Budi', lunas: false }, { id: 2, atasNama: 'Sinta', lunas: true }])) return `Hasil: ${JSON.stringify(r)}. Hanya tagihan id 2 yang boleh berubah menjadi lunas: true.`;
            if (JSON.stringify(daftar) !== beku) return 'Array/object asli ikut berubah. Jangan mengubah data asli (buat object & array baru).';
            if (r === daftar) return 'Harus mengembalikan array baru, bukan array masukan itu sendiri.';
            const tidak = ctx.panggil('tandaiLunas', daftar, 99);
            return tidak === null || `Untuk id yang tidak ada, hasilnya harus null, bukan ${JSON.stringify(tidak)}.`;
          },
        },
      ],
    }),
    kode('u5-k4', 13, {
      jenis: 'js',
      pelajaran: 'node-middleware',
      tugas: baris(
        'Buat middleware sederhana **`validasiPendaftaran(req)`** untuk `req.body = { email, umur }`:',
        '',
        '- Jika `email` bukan string, atau tidak mengandung karakter `@` → kembalikan `{ error: "email tidak valid", status: 400 }`',
        '- Jika `umur` bukan angka, atau kurang dari 17 → kembalikan `{ error: "umur minimal 17 tahun", status: 400 }`',
        '- Jika keduanya valid → kembalikan `req` apa adanya.',
        '- Cek **email dulu**, baru umur. `req.body` bisa saja tidak ada (`undefined`); anggap itu tidak valid tanpa error.',
      ),
      kodeAwal: 'function validasiPendaftaran(req) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function validasiPendaftaran(req) {',
        '  const { email, umur } = req.body ?? {};',
        '  if (typeof email !== "string" || !email.includes("@")) {',
        '    return { error: "email tidak valid", status: 400 };',
        '  }',
        '  if (typeof umur !== "number" || umur < 17) {',
        '    return { error: "umur minimal 17 tahun", status: 400 };',
        '  }',
        '  return req;',
        '}',
        '',
      ),
      penjelasan: 'Cek tipe dulu (`typeof`) sebelum memakai method/perbandingan, dan beri `?? {}` pada `req.body` supaya body yang hilang tidak menimbulkan error.',
      tes: [
        {
          nama: 'validasiPendaftaran',
          cek(ctx) {
            const err = (pesan) => ({ error: pesan, status: 400 });
            const kasus = [
              [{ body: { email: 'a@b.com', umur: 20 } }, 'lolos'],
              [{ body: { email: 'a@b.com', umur: 17 } }, 'lolos'],
              [{ body: { email: 'tanpa-at', umur: 20 } }, err('email tidak valid')],
              [{ body: { email: 123, umur: 20 } }, err('email tidak valid')],
              [{ body: { email: 'a@b.com', umur: 16 } }, err('umur minimal 17 tahun')],
              [{ body: { email: 'a@b.com', umur: '20' } }, err('umur minimal 17 tahun')],
              [{ body: { email: 'salah', umur: 5 } }, err('email tidak valid')],
              [{}, err('email tidak valid')],
            ];
            for (const [req, harap] of kasus) {
              const r = ctx.panggil('validasiPendaftaran', req);
              const ok = harap === 'lolos' ? r === req : JSON.stringify(r) === JSON.stringify(harap);
              if (!ok) return `validasiPendaftaran(${JSON.stringify(req)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${harap === 'lolos' ? 'req itu sendiri' : JSON.stringify(harap)}.`;
            }
            return true;
          },
        },
      ],
    }),
  ],
};
