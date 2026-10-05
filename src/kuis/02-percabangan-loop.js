// Chapter 2 — Percabangan & Loop. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'if-else': {
    intisari: 'Sintaks `if` JavaScript sama dengan C: kondisi dalam kurung `( )`, blok dalam kurung kurawal `{ }`, dan `elif` Python ditulis `else if`.',
    rangkuman: [
      'Bentuknya `if (kondisi) { ... } else if (kondisi) { ... } else { ... }`.',
      'Kondisi **wajib** dalam kurung, dan blok ditandai `{ }` (bukan indentasi seperti Python).',
      'Kalau nilai variabel ditentukan di dalam cabang, deklarasikan dulu di luar dengan `let` (mis. `let kategori;`).',
      'Variabel yang dideklarasikan **di dalam** blok `{ }` tidak bisa dipakai dari luar blok (scope blok, sama seperti C).',
    ],
    soal: [
      {
        tanya: 'Padanan `elif` Python di JavaScript adalah ...',
        benar: '`else if`',
        salah: ['`elif`', '`elseif`', '`otherwise`'],
        jelas: 'JavaScript menulisnya sebagai dua kata: `else if`.',
      },
      {
        tanya: 'Kamu ingin mengisi `kategori` dari dalam cabang `if`, lalu mencetaknya di luar `if`. Cara yang benar?',
        benar: 'Deklarasikan `let kategori;` sebelum `if`, lalu isi di dalam cabang',
        salah: ['Deklarasikan `const kategori` di dalam cabang `if`', 'Deklarasikan `let kategori` di dalam cabang `if` lalu cetak di luar', 'Tidak perlu deklarasi, langsung isi saja'],
        jelas: 'Variabel yang dideklarasikan di dalam `{ }` hanya hidup di blok itu. Deklarasi di luar membuatnya bisa dipakai di mana saja setelahnya, dan `let` dipakai karena nilainya diisi belakangan.',
      },
      {
        tanya: 'Mana penulisan `if` yang benar di JavaScript?',
        benar: '`if (suhu > 30) { ... }`',
        salah: ['`if suhu > 30: ...`', '`if suhu > 30 { ... }`', '`if (suhu > 30) then ...`'],
        jelas: 'Kondisi wajib dikurung `( )`. Bentuk dengan titik dua adalah Python, dan `then` bukan kata kunci JavaScript.',
      },
    ],
  },

  'ternary': {
    intisari: 'Ternary `kondisi ? nilaiA : nilaiB` memilih satu dari dua **nilai** dalam satu ekspresi, sehingga bisa dipakai di tempat `if` tidak bisa, termasuk di dalam JSX React.',
    rangkuman: [
      'Bentuknya `kondisi ? nilaiJikaTrue : nilaiJikaFalse`; padanan Python: `a if kondisi else b`.',
      'Ternary adalah **ekspresi** (menghasilkan nilai), sedangkan `if` adalah **statement**. Karena itu ternary bisa langsung dipakai di `console.log(...)` atau penggabungan string.',
      'Hasilnya bisa disimpan di `const` dalam satu baris, tanpa trik `let` + `if`.',
      'Jangan menumpuk ternary terlalu dalam. Kalau pilihannya lebih dari dua, `if/else` lebih mudah dibaca.',
    ],
    soal: [
      {
        tanya: 'Apa isi `status` setelah kode ini?\n\n~~~js\nconst umur = 15;\nconst status = umur >= 17 ? "dewasa" : "anak";\n~~~',
        benar: '`"anak"`',
        salah: ['`"dewasa"`', '`true`', '`false`'],
        jelas: '`15 >= 17` bernilai `false`, jadi yang diambil adalah nilai setelah tanda `:`, yaitu `"anak"`.',
      },
      {
        tanya: 'Apa perbedaan mendasar ternary dengan `if/else`?',
        benar: 'Ternary adalah ekspresi yang menghasilkan nilai, `if` adalah statement',
        salah: ['Ternary lebih cepat dijalankan daripada `if`', 'Ternary hanya boleh untuk angka', '`if` hanya boleh dipakai di dalam fungsi'],
        jelas: 'Karena menghasilkan nilai, ternary bisa ditaruh di dalam ekspresi lain (mis. `console.log` atau JSX), sedangkan `if` tidak bisa.',
      },
      {
        tanya: 'Kapan sebaiknya **tidak** memakai ternary?',
        benar: 'Saat pilihannya lebih dari dua sehingga ternary harus ditumpuk dalam',
        salah: ['Saat hanya memilih satu dari dua nilai', 'Saat hasilnya mau disimpan ke `const`', 'Saat dipakai di dalam `console.log`'],
        jelas: 'Ternary bersarang seperti `a ? b : c ? d : e` susah dibaca. Untuk tiga pilihan atau lebih, `if/else` lebih jelas.',
      },
    ],
  },

  'switch': {
    intisari: '`switch` membandingkan nilai dengan `===` ke setiap `case`; tanpa `break` eksekusi akan jatuh ke `case` berikutnya.',
    rangkuman: [
      'Bentuk: `switch (nilai) { case 1: ...; break; default: ... }`, sama dengan C.',
      'Tanpa `break`, eksekusi **jatuh (fall through)** ke `case` berikutnya. Kadang disengaja agar beberapa `case` berbagi satu blok.',
      '`default` adalah cabang bila tidak ada `case` yang cocok (seperti `else`).',
      'Perbandingan memakai `===`: `case "1"` tidak cocok dengan angka `1`. Berbeda dari C, `case` boleh berupa string.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi jika sebuah `case` tidak diakhiri `break`?',
        benar: 'Eksekusi lanjut ke kode `case` berikutnya (fall through)',
        salah: ['Terjadi `SyntaxError`', 'Program berhenti dan keluar dari `switch`', 'Hanya `default` yang dijalankan'],
        jelas: 'Tanpa `break`, JavaScript terus menjalankan baris di bawahnya, termasuk `case` berikutnya, sampai ketemu `break` atau akhir `switch`.',
      },
      {
        tanya: 'Diberikan `switch (x)` dengan `x = 1` (number) dan satu `case "1":`. Apakah `case` itu cocok?',
        benar: 'Tidak, karena dibandingkan dengan `===` sehingga tipenya harus sama',
        salah: ['Ya, karena nilainya sama-sama satu', 'Ya, `switch` memakai `==`', 'Tidak, `case` tidak boleh berupa string'],
        jelas: '`switch` memakai perbandingan ketat (`===`). Angka `1` dan string `"1"` berbeda tipe.',
      },
      {
        tanya: 'Cabang `default` pada `switch` dijalankan ketika ...',
        benar: 'tidak ada `case` yang cocok',
        salah: ['selalu, sebelum `case` lain dicek', 'hanya jika ada `break` di `case` terakhir', 'hanya kalau nilainya `undefined`'],
        jelas: '`default` berperan sebagai `else`: dipakai bila semua `case` tidak cocok.',
      },
      {
        tanya: 'Bagaimana membuat "Sabtu" dan "Minggu" menjalankan blok yang sama?',
        benar: 'Tulis `case "Sabtu":` dan `case "Minggu":` berurutan tanpa `break` di antaranya',
        salah: ['Tulis `case "Sabtu", "Minggu":`', 'Tulis `case "Sabtu" || "Minggu":`', 'Tidak bisa, harus menulis dua blok terpisah'],
        jelas: 'Fall through yang disengaja membuat beberapa `case` berbagi satu blok. Bentuk koma tidak ada, dan `"Sabtu" || "Minggu"` hanya bernilai `"Sabtu"`.',
      },
    ],
  },

  'for-loop': {
    intisari: 'Loop `for` JavaScript identik dengan C (`for (let i = 0; i < n; i++)`); gunakan `let` untuk penghitung, dan variabel penampung dideklarasikan di luar loop.',
    rangkuman: [
      'Bentuk: `for (let i = 1; i <= n; i++) { ... }`: inisialisasi; syarat lanjut; langkah.',
      'Penghitung pakai **`let`**, bukan `const`, karena nilainya berubah (`i++`).',
      'Padanan Python `range(n)` adalah `for (let i = 0; i < n; i++)`, dan `range(1, n + 1)` adalah `for (let i = 1; i <= n; i++)`.',
      'Pola akumulator: deklarasikan `let total = 0;` **sebelum** loop, lalu `total += i` di dalamnya.',
    ],
    soal: [
      {
        tanya: 'Kenapa variabel penghitung loop `for` dideklarasikan dengan `let`, bukan `const`?',
        benar: 'Karena nilainya berubah di setiap putaran (`i++`)',
        salah: ['Karena `const` tidak boleh dipakai di dalam loop', 'Karena `let` membuat loop lebih cepat', 'Karena `const` hanya untuk string'],
        jelas: '`i++` menugaskan nilai baru. `const` melarang itu dan akan memunculkan `TypeError`.',
      },
      {
        tanya: 'Berapa nilai `total` setelah kode ini?\n\n~~~js\nlet total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\n~~~',
        benar: '`10`',
        salah: ['`4`', '`6`', '`24`'],
        jelas: '1 + 2 + 3 + 4 = 10. Perhatikan `i <= 4`: angka 4 ikut dihitung.',
      },
      {
        tanya: 'Padanan `for i in range(5):` (Python) di JavaScript adalah ...',
        benar: '`for (let i = 0; i < 5; i++)`',
        salah: ['`for (let i = 0; i <= 5; i++)`', '`for (let i = 1; i < 5; i++)`', '`for (i in 5)`'],
        jelas: '`range(5)` menghasilkan 0 sampai 4, jadi mulai dari 0 dan berhenti sebelum 5 (`i < 5`).',
      },
    ],
  },

  'while-do-while': {
    intisari: '`while` mengecek syarat sebelum menjalankan badan loop, sedangkan `do...while` menjalankan badan **minimal sekali** baru mengecek syarat.',
    rangkuman: [
      '`while (syarat) { ... }` dipakai bila jumlah putaran belum diketahui, hanya syarat berhentinya.',
      '`do { ... } while (syarat);` menjalankan badan loop **minimal satu kali**, baru mengecek syarat. Python tidak punya do-while.',
      'Pada `do...while`, titik koma setelah `while (...)` jangan lupa ditulis.',
      'Kalau syarat tidak pernah menjadi `false`, terjadi **infinite loop**. Pastikan ada sesuatu di dalam loop yang mengubah syaratnya.',
    ],
    soal: [
      {
        tanya: 'Apa perbedaan utama `do...while` dengan `while`?',
        benar: '`do...while` menjalankan badan loop minimal sekali sebelum mengecek syarat',
        salah: ['`do...while` mengecek syarat dua kali', '`do...while` tidak bisa memakai `break`', '`while` selalu menjalankan badan minimal sekali'],
        jelas: 'Pada `do...while` syarat dicek di akhir putaran, jadi badan loop pasti jalan sekali walau syarat awalnya salah.',
      },
      {
        tanya: 'Berapa kali "Halo" tercetak?\n\n~~~js\nlet n = 5;\ndo {\n  console.log("Halo");\n} while (n < 0);\n~~~',
        benar: 'Satu kali',
        salah: ['Nol kali', 'Lima kali', 'Terjadi infinite loop'],
        jelas: 'Badan `do` jalan dulu satu kali. Setelah itu `n < 0` bernilai `false` sehingga loop berhenti.',
      },
      {
        tanya: 'Penyebab paling umum infinite loop pada `while` adalah ...',
        benar: 'Syarat tidak pernah menjadi `false` karena variabelnya tidak diubah di dalam loop',
        salah: ['Menulis `let` di luar loop', 'Memakai kurung kurawal `{ }`', 'Memakai `break` di dalam loop'],
        jelas: 'Kalau tidak ada yang mengubah variabel syarat, kondisinya terus bernilai `true` dan loop tidak pernah selesai.',
      },
    ],
  },

  'for-of-break-continue': {
    intisari: '`for...of` mengambil **isi** setiap elemen array; `break` keluar dari loop, dan `continue` melompati sisa putaran saat itu.',
    rangkuman: [
      '`for (const b of buah) { ... }` mengambil setiap elemen tanpa indeks (padanan Python: `for b in buah:`).',
      '`const` boleh dipakai di `for...of` karena setiap putaran membuat variabel baru.',
      '**Jebakan:** `for...in` pada array menghasilkan **indeks** (berupa string), bukan isinya. Untuk array pakai `for...of`.',
      '`break` = keluar dari loop sekarang juga; `continue` = lewati sisa putaran ini lalu lanjut ke putaran berikutnya.',
    ],
    soal: [
      {
        tanya: 'Apa yang diberikan `for (const x in ["a", "b"])` pada variabel `x`?',
        benar: 'Indeksnya (sebagai string): `"0"` lalu `"1"`',
        salah: ['Isinya: `"a"` lalu `"b"`', 'Panjang array: `2`', 'Error, `for...in` tidak boleh untuk array'],
        jelas: '`for...in` menelusuri kunci/indeks. Untuk mendapatkan isi array gunakan `for...of`.',
      },
      {
        tanya: 'Apa yang dicetak kode ini?\n\n~~~js\nfor (const n of [1, 2, 3, 4, 5]) {\n  if (n === 2) continue;\n  if (n === 4) break;\n  console.log(n);\n}\n~~~',
        benar: '`1` lalu `3`',
        salah: ['`1`, `2`, `3`', '`1`, `3`, `5`', '`1` saja'],
        jelas: '2 dilewati oleh `continue`. Saat `n` mencapai 4, `break` menghentikan loop sehingga 5 tidak pernah diproses.',
      },
      {
        tanya: 'Apa yang dilakukan `continue` di dalam loop?',
        benar: 'Melewati sisa badan loop pada putaran itu dan lanjut ke putaran berikutnya',
        salah: ['Keluar dari loop sepenuhnya', 'Mengulang putaran yang sama dari awal', 'Menghentikan seluruh program'],
        jelas: '`continue` hanya melewati sisa putaran saat ini. Yang keluar dari loop adalah `break`.',
      },
    ],
  },

  'proyek-fizzbuzz': {
    intisari: 'Pada FizzBuzz, cabang yang paling spesifik (habis dibagi 3 **dan** 5) harus dicek lebih dulu, kalau tidak angka 15 akan berhenti di cabang "Fizz".',
    rangkuman: [
      '"Habis dibagi k" ditulis `i % k === 0`.',
      'Dalam rangkaian `if / else if`, **urutan pengecekan penting**: kondisi pertama yang benar yang dijalankan, sisanya dilewati.',
      'Cabang paling spesifik (`i % 3 === 0 && i % 5 === 0`) ditaruh paling awal, baru cabang yang lebih umum.',
      'Proyek ini menggabungkan tiga hal: **loop** (`for`), **modulo** (`%`), dan **percabangan** (`if / else if / else`).',
    ],
    soal: [
      {
        tanya: 'Dalam FizzBuzz, cabang mana yang harus dicek **pertama**?',
        benar: 'Habis dibagi 3 **dan** 5',
        salah: ['Habis dibagi 3', 'Habis dibagi 5', 'Selain itu (cetak angkanya)'],
        jelas: 'Angka 15 habis dibagi 3 dan 5 sekaligus. Kalau cabang "3 saja" dicek lebih dulu, 15 akan tercetak "Fizz" dan tidak pernah sampai ke "FizzBuzz".',
      },
      {
        tanya: 'Ekspresi yang bernilai `true` jika `i` habis dibagi 3 adalah ...',
        benar: '`i % 3 === 0`',
        salah: ['`i / 3 === 0`', '`i % 3 === 3`', '`i === 3`'],
        jelas: '`%` memberi sisa bagi. Habis dibagi berarti sisanya 0.',
      },
      {
        tanya: 'Dalam rangkaian `if ... else if ... else`, apa yang terjadi setelah satu kondisi terpenuhi?',
        benar: 'Cabang itu dijalankan dan kondisi sisanya tidak dicek lagi',
        salah: ['Semua cabang tetap dicek dan dijalankan jika benar', 'Hanya cabang `else` yang dijalankan', 'Program berhenti seluruhnya'],
        jelas: 'Itulah sebabnya urutan penting: cabang pertama yang cocok "mengambil" nilainya.',
      },
    ],
  },
};
