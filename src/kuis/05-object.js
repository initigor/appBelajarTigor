// Chapter 5 — Object. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'object-literal': {
    intisari: 'Object adalah kumpulan pasangan kunci-nilai yang diakses dengan titik (`mhs.nama`) atau bracket (`mhs["nama"]`); bracket wajib dipakai bila nama kunci tersimpan di variabel.',
    rangkuman: [
      'Object ditulis `{ nama: "Budi", ipk: 3.45 }`, gabungan `struct` (C) dan `dict` (Python); antarproperti dipisah **koma**.',
      '`obj.kunci` untuk nama tetap, `obj[variabel]` bila nama kunci ada di variabel. `obj.kunci` mencari properti bernama harfiah "kunci".',
      'Ubah/tambah dengan penugasan (`mhs.ipk = 3.6`, `mhs.jurusan = "TI"`), hapus dengan `delete mhs.aktif`.',
      'Mengakses properti yang tidak ada menghasilkan `undefined` (bukan `KeyError`). `const` pada object hanya mengunci variabelnya, bukan isinya.',
    ],
    soal: [
      {
        tanya: 'Berapa nilai `hasil`?\n\n~~~js\nconst mhs = { nama: "Budi", ipk: 3.45 };\nconst kunci = "ipk";\nconst hasil = mhs[kunci];\n~~~',
        benar: '`3.45`',
        salah: ['`undefined`', '`"ipk"`', '`"Budi"`'],
        jelas: 'Bracket memakai **isi variabel** `kunci` ("ipk") sebagai nama properti. `mhs.kunci` justru akan mencari properti bernama "kunci" dan menghasilkan `undefined`.',
      },
      {
        tanya: 'Apa hasil `mhs.hobi` jika object `mhs` tidak punya properti `hobi`?',
        benar: '`undefined`',
        salah: ['Error `KeyError`', '`null`', '`""`'],
        jelas: 'JavaScript tidak melempar error untuk properti yang tidak ada, hanya memberi `undefined`.',
      },
      {
        tanya: 'Cara menghapus properti `aktif` dari object `mhs` adalah ...',
        benar: '`delete mhs.aktif`',
        salah: ['`mhs.aktif = delete`', '`remove mhs.aktif`', '`mhs.pop("aktif")`'],
        jelas: 'Operator `delete` menghapus properti. `pop` adalah method array.',
      },
      {
        tanya: 'Apakah kode ini error?\n\n~~~js\nconst mhs = { nama: "Budi" };\nmhs.nama = "Andi";\n~~~',
        benar: 'Tidak, `const` hanya mengunci variabel `mhs`, bukan isi object-nya',
        salah: ['Ya, `const` melarang perubahan apa pun', 'Ya, properti object tidak boleh diubah setelah dibuat', 'Tidak, tetapi nilainya tetap "Budi"'],
        jelas: 'Sama seperti array: `const` melarang `mhs = {...}` (penugasan ulang), tetapi isinya boleh diubah.',
      },
    ],
  },

  'object-method-shorthand': {
    intisari: 'Method adalah fungsi di dalam object; `this` merujuk object pemiliknya (jangan pakai arrow function untuk method yang butuh `this`), dan shorthand `{ nama, umur }` menyingkat `{ nama: nama, umur: umur }`.',
    rangkuman: [
      'Method ditulis singkat: `{ tambah(a, b) { return a + b; } }` dan dipanggil `obj.tambah(2, 3)`.',
      'Di dalam method, `this` = object pemilik method (mirip `self` di Python, tetapi tidak ditulis sebagai parameter).',
      '**Arrow function tidak punya `this` sendiri.** Untuk method yang memakai `this`, pakai bentuk `sapa() { ... }`, bukan `sapa: () => ...`.',
      '**Shorthand property:** bila nama variabel sama dengan nama kunci, tulis sekali: `{ nama, umur }`. Pola ini sering muncul di React.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `mhs.sapa()`?\n\n~~~js\nconst mhs = {\n  nama: "Budi",\n  sapa() {\n    return `Halo, saya ${this.nama}`;\n  },\n};\n~~~',
        benar: '`"Halo, saya Budi"`',
        salah: ['`"Halo, saya undefined"`', '`"Halo, saya ${this.nama}"`', 'Error, `this` tidak boleh dipakai di object'],
        jelas: 'Saat dipanggil sebagai `mhs.sapa()`, `this` merujuk ke `mhs`, sehingga `this.nama` bernilai "Budi".',
      },
      {
        tanya: 'Apa yang dilakukan `{ nama, umur }` jika variabel `nama` dan `umur` sudah ada?',
        benar: 'Membuat object `{ nama: nama, umur: umur }` (shorthand property)',
        salah: ['Membuat array `[nama, umur]`', 'Mengosongkan variabel `nama` dan `umur`', 'Menyebabkan `SyntaxError`'],
        jelas: 'Bila nama kunci sama dengan nama variabel, cukup tulis sekali. Hasilnya sama dengan penulisan panjang.',
      },
      {
        tanya: 'Kenapa method yang memakai `this` sebaiknya **tidak** ditulis sebagai arrow function (`sapa: () => ...`)?',
        benar: 'Arrow function tidak punya `this` sendiri',
        salah: ['Arrow function tidak boleh memakai `return`', 'Arrow function selalu lebih lambat', 'Arrow function tidak bisa disimpan di dalam object'],
        jelas: 'Arrow function mengambil `this` dari lingkungan luarnya, bukan dari object pemanggil method.',
      },
      {
        tanya: 'Apa itu method?',
        benar: 'Fungsi yang menjadi properti sebuah object',
        salah: ['Fungsi yang dikirim sebagai argumen', 'Fungsi tanpa parameter', 'Variabel yang bernilai `null`'],
        jelas: '`s.toUpperCase()` adalah method karena fungsi itu milik object string. Object buatanmu pun bisa punya method.',
      },
    ],
  },

  'object-keys-values-entries': {
    intisari: 'Object tidak bisa langsung di-`for...of` atau di-`map`; ubah dulu jadi array dengan `Object.keys`, `Object.values`, atau `Object.entries`, dan kembalikan dengan `Object.fromEntries`.',
    rangkuman: [
      '`Object.keys(obj)` → array kunci, `Object.values(obj)` → array nilai, `Object.entries(obj)` → array pasangan `[kunci, nilai]`.',
      'Mengulang object: `for (const [kunci, nilai] of Object.entries(obj)) { ... }` (padanan `d.items()` di Python).',
      'Karena hasilnya array, method array bisa dipakai: `Object.values(stok).reduce((a, b) => a + b, 0)`.',
      '`Object.fromEntries(pasangan)` adalah kebalikannya (array pasangan → object). Mengecek kunci: `"a" in obj`; jumlah properti: `Object.keys(obj).length`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `Object.entries({ a: 1, b: 2 })`?',
        benar: '`[["a", 1], ["b", 2]]`',
        salah: ['`["a", "b"]`', '`[1, 2]`', '`{ a: 1, b: 2 }`'],
        jelas: '`entries` menghasilkan array berisi pasangan `[kunci, nilai]`. `keys` hanya kunci dan `values` hanya nilai.',
      },
      {
        tanya: 'Cara menghitung jumlah semua nilai di `stok = { apel: 10, jeruk: 0, mangga: 7 }` adalah ...',
        benar: '`Object.values(stok).reduce((a, b) => a + b, 0)`',
        salah: ['`stok.reduce((a, b) => a + b, 0)`', '`Object.keys(stok).reduce((a, b) => a + b, 0)` (menjumlah semua kunci)', '`stok.length`'],
        jelas: 'Object tidak punya `reduce`. Ubah dulu menjadi array nilai lewat `Object.values`. `Object.keys` memberi nama buah (bukan angka).',
      },
      {
        tanya: 'Cara mengetahui jumlah properti di sebuah object `obj` adalah ...',
        benar: '`Object.keys(obj).length`',
        salah: ['`obj.length`', '`len(obj)`', '`obj.size()`'],
        jelas: 'Object biasa tidak punya `length`. Hitung panjang array kuncinya.',
      },
      {
        tanya: 'Mana yang mengulang pasangan kunci-nilai dari object `stok` dengan benar?',
        benar: '`for (const [k, v] of Object.entries(stok)) { ... }`',
        salah: ['`for (const [k, v] of stok) { ... }` (langsung pada object)', '`for (const k, v in stok) { ... }`', '`stok.forEach((k, v) => { ... })`'],
        jelas: 'Object tidak iterable, jadi `for...of` langsung pada `stok` akan error. Pakai `Object.entries`.',
      },
    ],
  },

  'array-of-object': {
    intisari: 'Array of object (daftar produk, mahasiswa, postingan) adalah bentuk data paling umum di web; semua method array bisa dipakai dengan mengakses properti object di dalam callback.',
    rangkuman: [
      'Bentuk datanya `[{ nama: "Budi", ipk: 3.4 }, { nama: "Sinta", ipk: 3.8 }]` (C: array of struct; Python: list of dict).',
      'Ambil satu kolom: `data.map((m) => m.nama)`; saring: `data.filter((m) => m.ipk >= 3.5)`; cari satu: `data.find((m) => m.nama === "Sinta")`.',
      'Urutkan berdasarkan properti dengan menyalin dulu: `data.slice().sort((a, b) => b.ipk - a.ipk)` (atau `toSorted`).',
      'Rata-rata/total: `data.reduce((acc, m) => acc + m.ipk, 0)`. Di React, data seperti ini diubah menjadi daftar elemen lewat `map`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `[{ nama: "Budi" }, { nama: "Sinta" }].map((m) => m.nama)`?',
        benar: '`["Budi", "Sinta"]`',
        salah: ['`[{ nama: "Budi" }, { nama: "Sinta" }]`', '`"BudiSinta"`', '`[nama, nama]`'],
        jelas: '`map` mengubah tiap object menjadi nilai properti `nama`-nya.',
      },
      {
        tanya: 'Method mana yang mengambil **satu** object pertama dengan `nama === "Sinta"`?',
        benar: '`find`',
        salah: ['`filter`', '`map`', '`includes`'],
        jelas: '`find` mengembalikan elemennya langsung (atau `undefined`). `filter` mengembalikan array, bahkan bila hanya satu hasil.',
      },
      {
        tanya: 'Cara mengurutkan `data` berdasarkan `ipk` dari tertinggi **tanpa mengubah array asli**?',
        benar: '`data.slice().sort((a, b) => b.ipk - a.ipk)`',
        salah: ['`data.sort((a, b) => b.ipk - a.ipk)`', '`data.slice().sort()`', '`data.sort("ipk")`'],
        jelas: '`sort` mengubah array asli, jadi salin dulu dengan `slice()`. `sort()` tanpa pembanding tidak bisa mengurutkan berdasarkan properti.',
      },
      {
        tanya: 'Apa hasil `[{ ipk: 3 }, { ipk: 4 }].reduce((acc, m) => acc + m.ipk, 0)`?',
        benar: '`7`',
        salah: ['`3.5`', '`[3, 4]`', '`0`'],
        jelas: '`reduce` menjumlahkan properti `ipk` dari awal 0: 0 + 3 + 4 = 7. Untuk rata-rata bagi dengan jumlah elemen (7 / 2 = 3.5).',
      },
    ],
  },

  'json': {
    intisari: 'JSON adalah format teks untuk bertukar data: `JSON.stringify` mengubah object menjadi teks, `JSON.parse` mengubah teks kembali menjadi object, dan aturannya lebih ketat daripada object JS.',
    rangkuman: [
      '`JSON.stringify(obj)` → teks JSON; `JSON.stringify(obj, null, 2)` → teks rapi dengan indentasi 2 spasi.',
      '`JSON.parse(teks)` → object/array JavaScript. Padanan Python: `json.dumps` / `json.loads`.',
      'Aturan JSON: kunci dan string wajib kutip dua, tidak boleh koma di elemen terakhir, tidak boleh berisi fungsi atau `undefined`.',
      'Kegunaan: menerima data dari API (`fetch(...).json()`), menyimpan ke `localStorage` (hanya bisa string), dan salinan dalam `JSON.parse(JSON.stringify(obj))` atau `structuredClone(obj)`.',
    ],
    soal: [
      {
        tanya: 'Fungsi mana yang mengubah **teks JSON** menjadi object JavaScript?',
        benar: '`JSON.parse`',
        salah: ['`JSON.stringify`', '`JSON.decode`', '`JSON.object`'],
        jelas: '`parse` membaca teks menjadi data, `stringify` melakukan sebaliknya.',
      },
      {
        tanya: 'Mana yang merupakan teks JSON yang **valid**?',
        benar: '`{"nama": "Budi", "umur": 20}`',
        salah: ['`{nama: "Budi", umur: 20}`', '`{\'nama\': \'Budi\'}`', '`{"nama": "Budi", "umur": 20,}`'],
        jelas: 'JSON mewajibkan kunci dan string memakai kutip dua, dan tidak mengizinkan koma di akhir. Pilihan lain melanggar salah satu aturan itu.',
      },
      {
        tanya: '`localStorage` hanya bisa menyimpan string. Cara menyimpan sebuah object ke dalamnya adalah ...',
        benar: 'Ubah dulu dengan `JSON.stringify(obj)`',
        salah: ['Langsung `localStorage.setItem("k", obj)`', 'Ubah dulu dengan `JSON.parse(obj)`', 'Object tidak bisa disimpan sama sekali'],
        jelas: 'Menyimpan object langsung hanya menghasilkan teks `"[object Object]"`. Gunakan `stringify` saat menyimpan dan `parse` saat membaca.',
      },
      {
        tanya: 'Cara membuat **salinan dalam (deep copy)** dari object `obj` adalah ...',
        benar: '`structuredClone(obj)`',
        salah: ['`const salin = obj`', '`obj.copy()`', '`Object.keys(obj)`'],
        jelas: '`structuredClone` (atau `JSON.parse(JSON.stringify(obj))`) menyalin sampai ke object di dalamnya. `const salin = obj` hanya menyalin referensi.',
      },
    ],
  },

  'proyek-keranjang-belanja': {
    intisari: 'Keranjang belanja adalah array of object: subtotal = `harga * jumlah`, total = `reduce`, dan menambah produk berarti menaikkan `jumlah` bila sudah ada atau menambah item baru bila belum, tanpa mengubah array lama.',
    rangkuman: [
      'Subtotal satu item: `item.harga * item.jumlah`; total: `keranjang.reduce((acc, i) => acc + i.harga * i.jumlah, 0)`.',
      'Total barang (bukan jumlah jenis): `keranjang.reduce((acc, i) => acc + i.jumlah, 0)`.',
      'Tambah produk: cek dengan `find`/`some`; kalau ada, `map` dan naikkan `jumlah` item itu, kalau belum, `[...keranjang, { ...produk, jumlah: 1 }]`.',
      'Format Rupiah dengan `(65000).toLocaleString("id-ID")` → `"65.000"`. Pecah masalah menjadi fungsi-fungsi kecil.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `(65000).toLocaleString("id-ID")`?',
        benar: '`"65.000"`',
        salah: ['`"65,000"`', '`"Rp65000"`', '`65000`'],
        jelas: 'Locale `id-ID` memakai titik sebagai pemisah ribuan. Hasilnya berupa string.',
      },
      {
        tanya: 'Keranjang berisi Kopi (25000 × 2) dan Roti (15000 × 1). Berapa **total harga**-nya?',
        benar: '`65000`',
        salah: ['`40000`', '`3`', '`80000`'],
        jelas: '25000 × 2 + 15000 × 1 = 65000. Angka 3 adalah total **item**, bukan total harga.',
      },
      {
        tanya: 'Produk yang ditambahkan sudah ada di keranjang. Apa yang seharusnya terjadi?',
        benar: '`jumlah` item tersebut dinaikkan, tidak membuat baris baru',
        salah: ['Produk ditambahkan lagi sebagai baris baru', 'Keranjang dikosongkan', 'Produk lama dihapus dan diabaikan'],
        jelas: 'Satu produk cukup satu baris dengan `jumlah` yang bertambah. Item baru hanya dibuat bila produknya belum ada.',
      },
    ],
  },
};
