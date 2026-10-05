// Chapter 4 — Array. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'array-dasar': {
    intisari: 'Array JS mirip list Python: ukurannya bisa berubah dan isinya boleh campur tipe; `const` hanya mencegah variabelnya diganti array lain, bukan isi array diubah.',
    rangkuman: [
      '`push(x)` menambah di akhir, `pop()` mengambil dan menghapus dari akhir, `unshift(x)` menambah di awal, `shift()` mengambil dan menghapus dari awal.',
      '`pop()` dan `shift()` **mengembalikan** elemen yang diambil, jadi bisa disimpan di variabel.',
      '`const` pada array hanya melarang `arr = [...]` (diganti array lain); mengubah isi lewat `arr[1] = ...` atau `push` tetap boleh.',
      'Indeks di luar batas menghasilkan `undefined` (bukan error seperti `IndexError` di Python). Elemen terakhir: `arr.at(-1)`.',
    ],
    soal: [
      {
        tanya: 'Method mana yang menambahkan elemen di **awal** array?',
        benar: '`unshift(x)`',
        salah: ['`push(x)`', '`shift(x)`', '`prepend(x)`'],
        jelas: '`push` menambah di akhir. `shift()` justru mengambil dari awal, dan `prepend` tidak ada di JavaScript.',
      },
      {
        tanya: 'Berapa nilai `dilayani` dan isi `antrian` setelah kode ini?\n\n~~~js\nconst antrian = ["Andi", "Budi", "Citra"];\nconst dilayani = antrian.shift();\n~~~',
        benar: '`dilayani = "Andi"`, `antrian = ["Budi", "Citra"]`',
        salah: ['`dilayani = "Citra"`, `antrian = ["Andi", "Budi"]`', '`dilayani = "Andi"`, `antrian` tetap utuh', '`dilayani = undefined`, `antrian = ["Budi", "Citra"]`'],
        jelas: '`shift()` menghapus elemen pertama dari array asli dan mengembalikannya.',
      },
      {
        tanya: 'Apakah kode ini error?\n\n~~~js\nconst buah = ["apel", "jeruk"];\nbuah.push("mangga");\n~~~',
        benar: 'Tidak, `const` hanya melarang `buah` diganti dengan array lain',
        salah: ['Ya, `const` melarang segala perubahan pada array', 'Ya, `push` hanya boleh untuk `let`', 'Tidak, tetapi `buah` tetap berisi dua elemen'],
        jelas: 'Isi array boleh berubah. Yang dilarang `const` adalah penugasan ulang variabelnya, misalnya `buah = []`.',
      },
      {
        tanya: 'Apa hasil `[][5]` (mengakses indeks di luar batas)?',
        benar: '`undefined`',
        salah: ['Error `IndexError`', '`null`', '`0`'],
        jelas: 'JavaScript tidak melempar error untuk indeks di luar batas, hanya menghasilkan `undefined`.',
      },
    ],
  },

  'array-slice-includes': {
    intisari: '`includes` mengecek keberadaan, `indexOf` mencari posisi (`-1` bila tidak ada), dan `slice` memotong tanpa mengubah array asli, tidak seperti `splice`.',
    rangkuman: [
      '`arr.includes(x)` → `true`/`false`; `arr.indexOf(x)` → posisi, atau **`-1`** bila tidak ada.',
      '`arr.slice(awal, akhir)` mengambil potongan **tanpa mengubah** array asli; indeks `akhir` tidak ikut. `arr.slice(-n)` mengambil n terakhir.',
      '`a + b` pada dua array **bukan** penggabungan, hasilnya string. Gunakan `a.concat(b)` atau spread `[...a, ...b]`.',
      '`splice` namanya mirip `slice` tetapi **mengubah** array asli. Kalau ragu, pakai `slice`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `["Sen", "Sel", "Rab", "Kam", "Jum"].slice(1, 3)`?',
        benar: '`["Sel", "Rab"]`',
        salah: ['`["Sel", "Rab", "Kam"]`', '`["Sen", "Sel", "Rab"]`', '`["Sen", "Sel"]`'],
        jelas: '`slice(1, 3)` mengambil indeks 1 dan 2. Indeks akhir (3) tidak ikut.',
      },
      {
        tanya: 'Apa hasil `["a", "b"].indexOf("z")`?',
        benar: '`-1`',
        salah: ['`undefined`', '`0`', '`null`'],
        jelas: 'Berbeda dengan `index()` Python yang error, `indexOf` mengembalikan `-1` jika elemen tidak ditemukan.',
      },
      {
        tanya: 'Apa hasil `[1, 2] + [3]`?',
        benar: '`"1,23"` (sebuah string)',
        salah: ['`[1, 2, 3]`', '`[4]`', 'Error'],
        jelas: 'Operator `+` mengubah kedua array menjadi string lalu menggabungkannya. Untuk menggabung array gunakan `concat` atau spread.',
      },
      {
        tanya: 'Apa beda `slice` dan `splice`?',
        benar: '`slice` tidak mengubah array asli, `splice` mengubahnya',
        salah: ['`slice` mengubah array asli, `splice` tidak', 'Keduanya sama, hanya beda penulisan', '`slice` hanya untuk string, `splice` hanya untuk array'],
        jelas: '`slice` mengembalikan array baru (aman), sedangkan `splice` menghapus/menyisipkan langsung pada array asli.',
      },
    ],
  },

  'array-foreach-map': {
    intisari: '`map` mengubah setiap elemen menjadi array baru dengan panjang yang sama (padanan list comprehension), sedangkan `forEach` hanya menjalankan sesuatu untuk tiap elemen dan tidak mengembalikan apa-apa.',
    rangkuman: [
      '`arr.forEach((elemen, indeks) => ...)` menjalankan callback untuk tiap elemen; tidak mengembalikan apa-apa.',
      '`arr.map((x) => ...)` mengembalikan **array baru** dengan panjang sama; array asli tidak berubah.',
      'Callback `map` **harus return** sesuatu. Kalau pakai kurawal tanpa `return`, hasilnya array berisi `undefined`.',
      '`map` adalah cara menampilkan daftar data menjadi elemen HTML di React (Chapter 11).',
    ],
    soal: [
      {
        tanya: 'Apa hasil kode ini?\n\n~~~js\n[1, 2, 3].map((x) => { x * 2 });\n~~~',
        benar: '`[undefined, undefined, undefined]`',
        salah: ['`[2, 4, 6]`', '`[1, 2, 3]`', '`undefined`'],
        jelas: 'Dengan kurawal, callback butuh `return` eksplisit. Tanpa itu, setiap elemen menjadi `undefined`.',
      },
      {
        tanya: 'Method mana yang mengubah tiap elemen menjadi array **baru** dengan panjang sama?',
        benar: '`map`',
        salah: ['`forEach`', '`filter`', '`find`'],
        jelas: '`forEach` tidak mengembalikan apa-apa, `filter` bisa menghasilkan array lebih pendek, dan `find` mengembalikan satu elemen.',
      },
      {
        tanya: 'Berapa nilai `hasil`?\n\n~~~js\nconst hasil = ["a", "b"].forEach((x) => x.toUpperCase());\n~~~',
        benar: '`undefined`',
        salah: ['`["A", "B"]`', '`["a", "b"]`', '`2`'],
        jelas: '`forEach` tidak mengembalikan nilai. Untuk mendapatkan array baru, pakai `map`.',
      },
      {
        tanya: 'Padanan `[x * x for x in angka]` (Python) di JavaScript adalah ...',
        benar: '`angka.map((x) => x * x)`',
        salah: ['`angka.forEach((x) => x * x)`', '`angka.filter((x) => x * x)`', '`angka.reduce((x) => x * x)`'],
        jelas: 'List comprehension yang mengubah setiap elemen sepadan dengan `map`.',
      },
    ],
  },

  'array-filter-find': {
    intisari: '`filter` mengambil **semua** elemen yang lolos syarat (array baru), `find` hanya elemen **pertama** yang cocok, `some` mengecek "ada minimal satu", dan `every` mengecek "semuanya".',
    rangkuman: [
      '`filter(cb)` mengembalikan array baru berisi elemen yang callback-nya bernilai `true`; hasilnya bisa kosong `[]`.',
      '`find(cb)` mengembalikan elemen **pertama** yang cocok, atau `undefined` bila tidak ada. `findIndex` mengembalikan posisinya (`-1` bila tidak ada).',
      '`some(cb)` → `true` bila ada minimal satu yang cocok (padanan `any`); `every(cb)` → `true` bila semuanya cocok (padanan `all`).',
      '`filter` dan `map` sama-sama mengembalikan array, jadi bisa dirangkai: `.filter(...).map(...)`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `[5, 12, 8, 21, 3].filter((x) => x > 7)`?',
        benar: '`[12, 8, 21]`',
        salah: ['`12`', '`[5, 3]`', '`[12]`'],
        jelas: '`filter` mengembalikan semua elemen yang lolos, dalam urutan aslinya.',
      },
      {
        tanya: 'Apa hasil `[5, 12, 8, 21].find((x) => x > 7)`?',
        benar: '`12`',
        salah: ['`[12, 8, 21]`', '`1`', '`true`'],
        jelas: '`find` berhenti pada elemen pertama yang cocok dan mengembalikan elemennya sendiri (bukan array, bukan indeks).',
      },
      {
        tanya: 'Method mana yang menjawab "apakah **semua** elemen lebih dari 0?"',
        benar: '`every`',
        salah: ['`some`', '`find`', '`includes`'],
        jelas: '`every` mengembalikan `true` hanya jika seluruh elemen lolos. `some` cukup satu elemen saja.',
      },
      {
        tanya: 'Apa hasil `[1, 2, 3].find((x) => x > 100)`?',
        benar: '`undefined`',
        salah: ['`-1`', '`[]`', '`null`'],
        jelas: '`find` mengembalikan `undefined` jika tidak ada yang cocok. `-1` adalah hasil `findIndex`, dan `[]` hasil `filter`.',
      },
    ],
  },

  'array-reduce': {
    intisari: '`reduce` meringkas array menjadi **satu nilai** dengan akumulator; selalu beri nilai awal sebagai argumen kedua supaya array kosong tidak menyebabkan error.',
    rangkuman: [
      'Bentuk: `arr.reduce((akumulator, elemen) => nilaiAkumulatorBaru, nilaiAwal)`.',
      'Pada putaran pertama `acc` adalah nilai awal; hasil callback menjadi `acc` pada putaran berikutnya; hasil akhir adalah `acc` terakhir.',
      'JS tidak punya `sum()` bawaan, jadi menjumlah array biasanya: `arr.reduce((acc, n) => acc + n, 0)`.',
      '**Selalu beri nilai awal.** Tanpa nilai awal, `reduce` pada array kosong akan error.',
    ],
    soal: [
      {
        tanya: 'Berapa hasil kode ini?\n\n~~~js\n[5, 10, 15].reduce((acc, n) => acc + n, 0)\n~~~',
        benar: '`30`',
        salah: ['`15`', '`[5, 10, 15]`', '`0`'],
        jelas: 'Mulai dari 0, lalu 0+5=5, 5+10=15, 15+15=30.',
      },
      {
        tanya: 'Apa fungsi argumen **kedua** pada `arr.reduce(callback, 0)`?',
        benar: 'Nilai awal akumulator',
        salah: ['Jumlah maksimum putaran', 'Indeks elemen pertama yang diproses', 'Nilai yang dikembalikan jika callback error'],
        jelas: 'Argumen kedua adalah nilai awal `acc`. Tanpa itu, `reduce` memakai elemen pertama sebagai awal, dan error untuk array kosong.',
      },
      {
        tanya: 'Apa hasil `[].reduce((acc, n) => acc + n, 0)`?',
        benar: '`0`, yaitu nilai awalnya',
        salah: ['`undefined`', 'Error karena array kosong', '`NaN`'],
        jelas: 'Karena ada nilai awal, `reduce` pada array kosong langsung mengembalikan nilai awal itu.',
      },
      {
        tanya: 'Method yang paling cocok untuk meringkas array menjadi satu nilai, misalnya total harga, adalah ...',
        benar: '`reduce`',
        salah: ['`map`', '`filter`', '`forEach`'],
        jelas: '`reduce` menggabungkan semua elemen menjadi satu hasil. `map` dan `filter` menghasilkan array.',
      },
    ],
  },

  'array-sort': {
    intisari: '`sort()` tanpa pembanding mengurutkan sebagai string (salah untuk angka) dan **mengubah array asli**; pakai `(a, b) => a - b` serta `toSorted` atau `slice().sort()` untuk hasil terurut tanpa mengubah aslinya.',
    rangkuman: [
      '`sort()` tanpa argumen mengubah elemen menjadi string lalu mengurutkannya seperti kamus: `[10, 1, 5, 100].sort()` → `[1, 10, 100, 5]`.',
      'Untuk angka, beri pembanding: `(a, b) => a - b` (naik) atau `(a, b) => b - a` (turun). Untuk teks: `a.localeCompare(b)`.',
      '`sort` mengurutkan **di tempat**: array asli ikut berubah.',
      'Tanpa mengubah aslinya: `arr.toSorted((a, b) => a - b)` (cara modern) atau `arr.slice().sort(...)` (salin dulu).',
    ],
    soal: [
      {
        tanya: 'Fungsi apa yang mengurutkan array **tanpa mengubah array aslinya**?',
        benar: '`toSorted(...)`, atau `slice().sort(...)`',
        salah: ['`sort(...)` langsung pada array', '`splice(...).sort(...)`', '`reverse(...)`'],
        jelas: '`sort` dan `splice` sama-sama mengubah array asli. `toSorted` langsung mengembalikan array baru, sedangkan `slice()` membuat salinan dulu sebelum di-`sort`.',
      },
      {
        tanya: 'Apa hasil `[10, 1, 5, 100].sort()`?',
        benar: '`[1, 10, 100, 5]`',
        salah: ['`[1, 5, 10, 100]`', '`[100, 10, 5, 1]`', '`[5, 10, 100, 1]`'],
        jelas: 'Tanpa pembanding, elemen diurutkan sebagai string: `"1" < "10" < "100" < "5"`.',
      },
      {
        tanya: 'Pembanding mana yang mengurutkan angka dari besar ke kecil?',
        benar: '`(a, b) => b - a`',
        salah: ['`(a, b) => a - b`', '`(a, b) => a > b`', '`(a) => -a`'],
        jelas: 'Hasil positif berarti `b` ditaruh sebelum `a`, sehingga angka yang lebih besar di depan. `a - b` mengurutkan naik.',
      },
      {
        tanya: 'Cara yang tepat mengurutkan nama A–Z tanpa terpengaruh huruf besar/kecil adalah ...',
        benar: '`nama.slice().sort((a, b) => a.localeCompare(b))`',
        salah: ['`nama.sort()`', '`nama.sort((a, b) => a - b)`', '`nama.sort(true)`'],
        jelas: '`localeCompare` membandingkan teks dengan benar. `a - b` pada string menghasilkan `NaN`, dan `sort()` polos mengurutkan huruf kapital lebih dulu.',
      },
    ],
  },

  'array-referensi-salinan': {
    intisari: 'Variabel array menyimpan **referensi**, bukan isinya: `b = a` bukan salinan. Buat salinan dengan `[...a]` atau `a.slice()`, dan di React selalu buat array **baru** daripada mengubah yang lama.',
    rangkuman: [
      '`const b = a;` membuat `b` menunjuk array yang **sama**; `b.push(4)` juga mengubah `a` (seperti dua pointer ke memori yang sama).',
      'Salinan: `a.slice()`, `[...a]` (spread, paling umum di React), atau `Array.from(a)`.',
      '`===` membandingkan **referensi**: `[1, 2] === [1, 2]` adalah `false`, tetapi `x === y` bernilai `true` bila keduanya menunjuk array yang sama.',
      'React mendeteksi perubahan dengan membandingkan referensi, jadi pakai pola **tidak mengubah yang lama**: `[...lama, item]`, `lama.filter(...)`, `lama.map(...)`.',
    ],
    soal: [
      {
        tanya: 'Berapa isi `a` setelah kode ini?\n\n~~~js\nconst a = [1, 2, 3];\nconst b = a;\nb.push(4);\n~~~',
        benar: '`[1, 2, 3, 4]`',
        salah: ['`[1, 2, 3]`', '`[4]`', 'Error karena `b` adalah `const`'],
        jelas: '`b = a` hanya menyalin referensi. Keduanya menunjuk array yang sama sehingga perubahan lewat `b` terlihat di `a`.',
      },
      {
        tanya: 'Apa hasil `[1, 2] === [1, 2]`?',
        benar: '`false`, karena keduanya dua array berbeda di memori',
        salah: ['`true`, karena isinya sama', '`true`, karena tipenya sama', 'Error, array tidak boleh dibandingkan'],
        jelas: '`===` pada array/object membandingkan referensi, bukan isi.',
      },
      {
        tanya: 'Mana cara yang benar membuat **salinan** array `a`?',
        benar: '`const salinan = [...a];`',
        salah: ['`const salinan = a;`', '`const salinan = a.length;`', '`const salinan = a.pop();`'],
        jelas: 'Spread `[...a]` membuat array baru berisi elemen yang sama. `const salinan = a` hanya menyalin referensi.',
      },
      {
        tanya: 'Kenapa di React kita membuat array baru (mis. `[...lama, item]`) daripada `lama.push(item)`?',
        benar: 'React mendeteksi perubahan lewat perbandingan referensi',
        salah: ['`push` tidak ada di React', 'Array baru dijalankan lebih cepat oleh browser', 'React melarang penggunaan method array apa pun'],
        jelas: 'Jika referensinya sama, React menganggap state tidak berubah dan tampilan tidak diperbarui.',
      },
    ],
  },

  'proyek-statistik-nilai': {
    intisari: 'Proyek ini memadukan `reduce` (jumlah), `filter` (yang lulus), `map` (bonus), dan `sort` (urutan), dengan membulatkan hasil memakai `Math.round(x * 10) / 10`.',
    rangkuman: [
      'Rata-rata: jumlahkan dengan `reduce`, lalu bagi dengan `nilai.length`.',
      'Membulatkan ke 1 desimal sebagai **number**: `Math.round(x * 10) / 10`. `toFixed(1)` menghasilkan **string**.',
      'Menghitung yang memenuhi syarat: `nilai.filter((n) => n >= batas).length`.',
      'Nilai terbesar/terkecil: `Math.max(...nilai)` / `Math.min(...nilai)`. Untuk hasil terurut tanpa mengubah aslinya, `slice()` dulu atau pakai `toSorted`.',
    ],
    soal: [
      {
        tanya: 'Apa tipe hasil `(72.4567).toFixed(1)`?',
        benar: 'String, yaitu `"72.5"`',
        salah: ['Number, yaitu `72.5`', 'Boolean', '`undefined`'],
        jelas: '`toFixed` mengembalikan string. Untuk mendapatkan number gunakan `Math.round(x * 10) / 10`.',
      },
      {
        tanya: 'Cara menghitung **berapa banyak** nilai yang >= 60 dari array `nilai`?',
        benar: '`nilai.filter((n) => n >= 60).length`',
        salah: ['`nilai.find((n) => n >= 60).length`', '`nilai.map((n) => n >= 60)`', '`nilai.includes(60)`'],
        jelas: '`filter` menyaring yang lolos, lalu `.length` menghitung jumlahnya.',
      },
      {
        tanya: 'Apa hasil `Math.max(...[3, 9, 2])`?',
        benar: '`9`',
        salah: ['`[3, 9, 2]`', '`3`', '`NaN`'],
        jelas: 'Spread `...` membuka isi array menjadi argumen terpisah: `Math.max(3, 9, 2)`.',
      },
    ],
  },
};
