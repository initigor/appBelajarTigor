// Chapter 8 — Asynchronous JavaScript. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'async-settimeout': {
    intisari: 'JavaScript tidak "tidur" menunggu: `setTimeout` menjadwalkan fungsi untuk dijalankan nanti sementara kode berikutnya langsung lanjut, karena JS hanya punya satu thread dan callback menunggu giliran di event loop.',
    rangkuman: [
      '`setTimeout(fn, ms)` menjadwalkan `fn` setelah `ms` milidetik (1000 ms = 1 detik); kode setelahnya **tidak menunggu**.',
      'Bahkan `setTimeout(fn, 0)` dijalankan **setelah** semua kode yang sedang berjalan selesai (antrian *event loop*).',
      '`setInterval(fn, ms)` mengulang terus-menerus. Hentikan dengan `clearInterval(id)`; `setTimeout`/`setInterval` mengembalikan **id** untuk dibatalkan.',
      'Menahan program seperti `sleep()` di C/Python akan membuat halaman web macet, itu sebabnya JS memakai penjadwalan.',
    ],
    soal: [
      {
        tanya: 'Urutan output kode ini?\n\n~~~js\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");\n~~~',
        benar: '`A`, `C`, `B`',
        salah: ['`A`, `B`, `C`', '`B`, `A`, `C`', '`C`, `A`, `B`'],
        jelas: 'Callback `setTimeout` masuk antrian dan baru dijalankan setelah kode yang sedang berjalan selesai, walaupun waktunya 0 ms.',
      },
      {
        tanya: 'Satuan waktu pada `setTimeout(fn, 1000)` adalah ...',
        benar: 'Milidetik, jadi 1000 berarti 1 detik',
        salah: ['Detik, jadi 1000 berarti 1000 detik', 'Menit, jadi 1000 berarti 1000 menit', 'Mikrodetik, jadi 1000 berarti 1 milidetik'],
        jelas: 'Waktu `setTimeout` dan `setInterval` selalu dalam milidetik.',
      },
      {
        tanya: 'Kenapa `setInterval` perlu dihentikan dengan `clearInterval(id)`?',
        benar: 'Tanpa itu ia akan berjalan terus tanpa henti',
        salah: ['Agar callback-nya dijalankan sekali saja', 'Agar nilai `id` tidak error', 'Karena `setInterval` otomatis berhenti, jadi `clearInterval` hanya opsional'],
        jelas: '`setInterval` berulang sampai dibatalkan. Simpan `id`-nya dan panggil `clearInterval(id)` saat sudah cukup.',
      },
      {
        tanya: 'Kenapa JavaScript di browser tidak memakai `sleep()` yang menghentikan program, seperti di C?',
        benar: 'Karena seluruh halaman akan macet: tombol tidak bisa diklik dan animasi berhenti',
        salah: ['Karena JavaScript tidak mengenal konsep waktu', 'Karena `sleep` hanya ada di Python', 'Karena browser melarang pemakaian detik'],
        jelas: 'JS hanya punya satu thread; menahannya berarti semua hal lain di halaman ikut tertahan.',
      },
    ],
  },

  'async-promise-then': {
    intisari: 'Promise adalah object yang "berjanji" akan berisi hasil nanti (pending → fulfilled/rejected); `.then` menangani keberhasilan secara berantai, `.catch` menangani error, dan `fetch` mengembalikan Promise.',
    rangkuman: [
      'Tiga keadaan Promise: **pending** (menunggu), **fulfilled** (berhasil, ada nilainya), **rejected** (gagal, ada error).',
      '`.then(callback)` jalan saat berhasil, dan nilai yang di-`return` diteruskan ke `.then` berikutnya (berantai).',
      '`.catch(callback)` menangkap error di mana pun dalam rantai.',
      '`fetch(url)` mengembalikan Promise; `res.json()` juga Promise sehingga butuh `.then` lagi. Kode setelah `fetch` langsung lanjut tanpa menunggu.',
    ],
    soal: [
      {
        tanya: 'Apa yang dikembalikan `fetch("/api/mahasiswa")` **segera** setelah dipanggil?',
        benar: 'Sebuah Promise yang masih pending',
        salah: ['Array data mahasiswa', 'Object respons lengkap dengan datanya', '`undefined`'],
        jelas: 'Data baru tersedia nanti. `fetch` langsung mengembalikan Promise yang berjanji akan berisi respons.',
      },
      {
        tanya: 'Apa urutan output?\n\n~~~js\nfetch("/api/mahasiswa").then(() => console.log("data siap"));\nconsole.log("selanjutnya");\n~~~',
        benar: '`selanjutnya`, lalu `data siap`',
        salah: ['`data siap`, lalu `selanjutnya`', 'Hanya `data siap`', 'Hanya `selanjutnya`'],
        jelas: 'Kode setelah `fetch` tidak menunggu. Callback `.then` baru dijalankan setelah respons datang.',
      },
      {
        tanya: 'Kenapa setelah `fetch(...)` perlu `.then((res) => res.json())` lalu `.then` lagi?',
        benar: 'Karena `res.json()` juga mengembalikan Promise, hasilnya diterima di `.then` berikutnya',
        salah: ['Karena `.then` pertama hanya boleh dipakai sekali', 'Karena `json()` mengembalikan string yang harus diubah dulu', 'Supaya request dikirim dua kali'],
        jelas: 'Membaca isi respons juga butuh waktu sehingga hasilnya berupa Promise. Nilai yang di-return dari `.then` diteruskan ke `.then` berikutnya.',
      },
      {
        tanya: 'Kapan callback `.catch` dijalankan?',
        benar: 'Saat ada error atau penolakan (rejected) di mana pun dalam rantai Promise',
        salah: ['Selalu, setelah semua `.then` selesai', 'Hanya saat respons berstatus 200', 'Hanya jika `.then` pertama gagal'],
        jelas: '`.catch` menangkap kegagalan dari Promise sebelumnya dalam rantai.',
      },
    ],
  },

  'async-membuat-promise': {
    intisari: '`new Promise((resolve, reject) => ...)` membungkus pekerjaan yang butuh waktu: panggil `resolve(nilai)` saat berhasil dan `reject(new Error(...))` saat gagal, salah satunya sekali saja.',
    rangkuman: [
      '`new Promise((resolve, reject) => { ... })`: `resolve` dan `reject` adalah **fungsi** yang diberikan kepadamu.',
      '`resolve(nilai)` → masuk ke `.then`; `reject(new Error("..."))` → masuk ke `.catch`. Panggil salah satunya, **sekali saja**.',
      'Selalu `reject` dengan `new Error(...)` (bukan string) supaya penerima bisa membaca `.message`.',
      'Contoh klasik, "sleep" JavaScript: `const tunggu = (ms) => new Promise((resolve) => setTimeout(resolve, ms));`.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi pada `bagi(1, 0).catch((e) => console.log(e.message))`?\n\n~~~js\nfunction bagi(a, b) {\n  return new Promise((resolve, reject) => {\n    if (b === 0) reject(new Error("Tidak bisa membagi dengan nol"));\n    else resolve(a / b);\n  });\n}\n~~~',
        benar: 'Mencetak `Tidak bisa membagi dengan nol`',
        salah: ['Mencetak `Infinity`', 'Mencetak `undefined`', 'Tidak ada yang tercetak, karena `reject` tidak bisa ditangkap oleh `.catch`'],
        jelas: '`b === 0` menyebabkan `reject`, sehingga Promise masuk jalur `.catch` dan `e.message` berisi pesan error.',
      },
      {
        tanya: 'Kenapa `reject` sebaiknya diberi `new Error("...")` dan bukan string biasa?',
        benar: 'Agar penerima bisa membaca `e.message` dan stack trace',
        salah: ['Karena `reject` tidak menerima string', 'Karena string tidak bisa ditangkap `.catch`, hanya object bawaan yang bisa', 'Agar Promise lebih cepat selesai'],
        jelas: 'Object `Error` membawa `message` dan jejak error. Itu konvensi yang dipakai kode lain saat menangani kegagalan.',
      },
      {
        tanya: 'Apa yang dilakukan `resolve(nilai)` di dalam `new Promise`?',
        benar: 'Menandai Promise berhasil dengan hasil `nilai` sehingga `.then` dijalankan',
        salah: ['Menandai Promise gagal', 'Mengulang Promise dari awal', 'Menghentikan seluruh program JavaScript yang sedang berjalan di tab itu'],
        jelas: '`resolve` mengisi hasil Promise. `reject` kebalikannya (gagal).',
      },
      {
        tanya: 'Implementasi "tunggu sebentar" (`tunggu(ms)`) berbasis Promise adalah ...',
        benar: '`new Promise((resolve) => setTimeout(resolve, ms))`',
        salah: ['`new Promise((resolve) => resolve(ms))`', '`new Promise(() => setTimeout)`', '`setTimeout(() => new Promise(), ms)` lalu menunggu hasilnya dengan `await`'],
        jelas: 'Promise di-resolve oleh `setTimeout` setelah `ms` milidetik. Pilihan pertama langsung selesai tanpa menunggu.',
      },
    ],
  },

  'async-await': {
    intisari: '`async/await` membuat kode asynchronous terbaca dari atas ke bawah: `await` menunggu Promise dan memberi nilainya, hanya boleh dipakai di fungsi `async`, dan fungsi `async` selalu mengembalikan Promise.',
    rangkuman: [
      '`await promise` menunggu Promise selesai lalu memberikan nilainya; fungsi berhenti sejenak tetapi halaman tetap responsif.',
      '`await` hanya boleh di dalam fungsi **`async`** (atau level teratas modul).',
      'Fungsi `async` **selalu mengembalikan Promise**, jadi pemanggilnya juga harus `await` atau memakai `.then`.',
      'Lupa `await` menghasilkan `Promise { <pending> }`, bukan datanya. Python punya sintaks yang sama (`async def` / `await`).',
    ],
    soal: [
      {
        tanya: 'Apa isi `nama`?\n\n~~~js\nasync function ambilNama() { return "Budi"; }\nconst nama = ambilNama();\n~~~',
        benar: 'Sebuah Promise (belum `"Budi"`)',
        salah: ['`"Budi"`', '`undefined`', 'Error karena fungsi `async` tidak boleh dipanggil biasa'],
        jelas: 'Fungsi `async` selalu mengembalikan Promise. Gunakan `await ambilNama()` atau `.then` untuk mendapatkan "Budi".',
      },
      {
        tanya: 'Di mana kata kunci `await` boleh dipakai?',
        benar: 'Di dalam fungsi `async`',
        salah: ['Di mana saja di dalam fungsi apa pun', 'Hanya di luar fungsi', 'Hanya di dalam `.then`'],
        jelas: '`await` hanya sah di dalam fungsi `async` (atau di level teratas modul).',
      },
      {
        tanya: 'Apa keunggulan `async/await` dibanding rantai `.then`?',
        benar: 'Kode asynchronous terbaca dari atas ke bawah seperti kode biasa',
        salah: ['Request jaringan menjadi lebih cepat', 'Tidak perlu lagi memakai `fetch`', 'Error tidak pernah terjadi'],
        jelas: 'Fungsionalitasnya sama dengan Promise; yang berubah adalah keterbacaannya.',
      },
      {
        tanya: 'Apa yang dikembalikan oleh fungsi `async` yang melakukan `return 5`?',
        benar: 'Promise yang berisi `5`',
        salah: ['`5`', '`undefined`', '`Promise` yang selalu gagal'],
        jelas: 'Nilai yang di-return dibungkus Promise. Pemanggil mendapatkan `5` lewat `await` atau `.then`.',
      },
    ],
  },

  'async-try-catch': {
    intisari: '`try/catch/finally` menangani exception, dan Promise yang reject berubah menjadi exception saat di-`await`; `fetch` hanya reject bila koneksi gagal, jadi status 404/500 harus dicek sendiri dengan `res.ok`.',
    rangkuman: [
      '`try { ... } catch (e) { ... } finally { ... }`: `finally` **selalu** dijalankan. `throw new Error("x")` melempar error (Python: `raise`).',
      'C tidak punya exception, sehingga di C kita mengecek nilai return; di JS error bisa ditangkap dengan `try/catch`.',
      'Dengan async/await, Promise yang **reject** menjadi exception saat di-`await`, sehingga bisa ditangkap `try/catch` biasa.',
      '**`fetch` TIDAK error untuk 404/500**: ia hanya reject bila koneksi gagal. Cek `res.ok` dan lempar error sendiri bila `!res.ok`.',
    ],
    soal: [
      {
        tanya: '`fetch("/api/mahasiswa/99")` dijawab server dengan status 404. Apa yang terjadi pada Promise `fetch`?',
        benar: 'Tetap berhasil (fulfilled); statusnya harus dicek lewat `res.ok`',
        salah: ['Reject dengan error 404', 'Mengembalikan `null`', 'Reject dengan `TypeError`'],
        jelas: '`fetch` hanya reject untuk kegagalan jaringan. Respons 404/500 tetap dianggap berhasil, jadi periksa `res.ok`.',
      },
      {
        tanya: 'Kapan blok `finally` dijalankan?',
        benar: 'Selalu, baik ada error maupun tidak',
        salah: ['Hanya jika ada error', 'Hanya jika tidak ada error', 'Hanya jika `catch` tidak ada'],
        jelas: '`finally` cocok untuk pekerjaan "bersih-bersih" yang harus terjadi apa pun hasilnya.',
      },
      {
        tanya: 'Bagaimana menangkap Promise yang gagal saat memakai `await`?',
        benar: 'Membungkusnya dengan `try { ... } catch (e) { ... }`',
        salah: ['Tidak bisa ditangkap, harus memakai `.then` saja', 'Memakai `if (res === error)`', 'Menulis `await.catch()` setelah fungsi'],
        jelas: 'Promise yang reject menjadi exception saat di-`await`, jadi `try/catch` biasa bisa menangkapnya.',
      },
      {
        tanya: 'Apa padanan `raise ValueError("x")` Python di JavaScript?',
        benar: '`throw new Error("x")`',
        salah: ['`raise new Error("x")`', '`return new Error("x")`', '`catch new Error("x")`'],
        jelas: '`throw` melempar error. `catch` hanya dipakai untuk menangkap, dan `return` tidak melempar apa pun.',
      },
    ],
  },

  'async-promise-all': {
    intisari: '`Promise.all([...])` menjalankan beberapa Promise yang tidak saling bergantung **bersamaan** dan menghasilkan array hasil dengan urutan yang sama; kalau salah satu gagal, seluruhnya reject.',
    rangkuman: [
      'Tiga `await` berurutan menunggu satu per satu (0,2 + 0,2 + 0,2 detik). `Promise.all` menjalankannya paralel (±0,2 detik).',
      '`const [a, b, c] = await Promise.all([p1, p2, p3]);` menerima array Promise dan mengembalikan array hasil **dengan urutan sama**.',
      'Jika **salah satu** Promise gagal, `Promise.all` langsung reject.',
      'Cara umum: `await Promise.all(kota.map((k) => ambilJson(...)))`. Tidak ada `await` di dalam array: mulai semuanya dulu, baru tunggu bersama. (Setara `asyncio.gather` di Python.)',
    ],
    soal: [
      {
        tanya: 'Tiga request yang saling tidak bergantung masing-masing butuh 0,2 detik. Berapa kira-kira total waktu dengan `Promise.all`?',
        benar: '±0,2 detik',
        salah: ['±0,6 detik', '±0,4 detik', '±0 detik, karena langsung selesai'],
        jelas: 'Karena berjalan bersamaan, total waktunya mengikuti yang paling lama. Dengan `await` berurutan totalnya 0,6 detik.',
      },
      {
        tanya: 'Jika salah satu Promise di dalam `Promise.all` gagal, apa hasilnya?',
        benar: '`Promise.all` langsung reject',
        salah: ['Promise yang gagal diabaikan dan sisanya tetap dikembalikan', 'Semua Promise diulang otomatis', 'Hasilnya array berisi `null` pada Promise yang gagal'],
        jelas: '`Promise.all` bersifat "semua atau tidak sama sekali". Satu kegagalan membuat seluruhnya reject.',
      },
      {
        tanya: 'Urutan isi array hasil `Promise.all([a(), b(), c()])` mengikuti ...',
        benar: 'Urutan Promise di array input, bukan urutan siapa yang selesai lebih dulu',
        salah: ['Urutan Promise yang selesai lebih dulu', 'Urutan abjad hasilnya', 'Acak'],
        jelas: 'Hasil ke-1 selalu dari Promise ke-1, walaupun yang ke-3 selesai lebih cepat.',
      },
      {
        tanya: 'Manakah cara yang benar-benar menjalankan tiga request secara **paralel**?',
        benar: '`const [a, b, c] = await Promise.all([f1(), f2(), f3()]);`',
        salah: ['`const a = await f1(); const b = await f2(); const c = await f3();`', '`const a = await f1(), b = await f2();`', '`await f1(); await f2(); await f3();`'],
        jelas: 'Pada pilihan lain, setiap `await` menunggu selesai sebelum request berikutnya dimulai.',
      },
    ],
  },

  'proyek-dashboard-async': {
    intisari: 'Dashboard menggabungkan dua endpoint yang tidak saling bergantung dengan `Promise.all`, menangani user yang tidak ada (404) lewat `res.ok`, dan mengurutkan tanggal ISO sebagai string dengan `localeCompare`.',
    rangkuman: [
      'Ambil profil dan tulisan **secara paralel**: `const [profil, posts] = await Promise.all([ambilJson(...), ambilJson(...)]);`.',
      'Tangani user yang tidak ada: periksa `res.ok` dan lempar `Error`, lalu tangkap di tempat yang memanggil dengan `try/catch`.',
      'Tanggal ISO `"2025-03-02"` bisa dibandingkan sebagai string, jadi terbaru dulu: `posts.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal))`.',
      'Bentuk akhir dibuat dengan `map` (judul) dan `.length` (jumlah). Selalu `slice()` sebelum `sort` agar data asli tidak berubah.',
    ],
    soal: [
      {
        tanya: 'Profil user dan daftar tulisannya tidak saling bergantung. Cara terbaik mengambilnya?',
        benar: '`Promise.all` untuk keduanya sekaligus',
        salah: ['`await` yang pertama baru yang kedua', 'Loop `setInterval` sampai keduanya siap', 'Mengambil profil saja dan tulisannya diabaikan'],
        jelas: 'Dua request independen sebaiknya paralel dengan `Promise.all` agar total waktunya lebih singkat.',
      },
      {
        tanya: 'Kenapa tanggal berformat `"2025-03-02"` bisa diurutkan dengan `localeCompare`?',
        benar: 'Format ISO membuat urutan abjadnya sama dengan urutan waktunya',
        salah: ['Karena `localeCompare` otomatis mengenali tanggal', 'Karena string tanggal otomatis berubah menjadi number', 'Karena `sort` selalu mengurutkan tanggal dengan benar'],
        jelas: 'Tahun-bulan-hari dengan angka berpanjang tetap membuat perbandingan string identik dengan perbandingan waktu.',
      },
      {
        tanya: 'Server menjawab 404 untuk user yang tidak ada. Bagaimana kamu mendeteksinya?',
        benar: 'Memeriksa `res.ok` lalu melempar `Error` bila `false`',
        salah: ['Menunggu `fetch` otomatis reject', 'Memeriksa apakah hasil `fetch` bernilai `null`', 'Memakai `finally` saja'],
        jelas: '`fetch` tidak reject untuk 404, jadi pemeriksaan `res.ok` wajib dilakukan sendiri.',
      },
    ],
  },
};
