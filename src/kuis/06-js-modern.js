// Chapter 6 — JavaScript Modern. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'destructuring-object': {
    intisari: 'Destructuring object (`const { nama, umur } = user`) mengambil beberapa properti sekaligus berdasarkan **nama** propertinya; bisa diberi nama baru, nilai default, dan dipakai langsung di parameter fungsi (props React).',
    rangkuman: [
      '`const { nama, umur } = user;` membuat variabel `nama` dan `umur` dari properti yang namanya sama.',
      'Ganti nama: `const { nama: namaUser } = user;`. Nilai default (bila `undefined`): `const { hobi = "tidak ada" } = user;`.',
      'Bersarang: `const { profil: { email } } = data;` mengambil `data.profil.email` ke variabel `email`.',
      'Di parameter fungsi: `function kartu({ nama, umur = 17 }) { ... }`. Pola ini sangat umum untuk **props** di React.',
    ],
    soal: [
      {
        tanya: 'Apa isi variabel `namaUser` setelah kode ini?\n\n~~~js\nconst user = { nama: "Budi", umur: 20 };\nconst { nama: namaUser } = user;\n~~~',
        benar: '`"Budi"`',
        salah: ['`"nama"`', '`undefined`', '`{ nama: "Budi" }`'],
        jelas: 'Bentuk `{ nama: namaUser }` berarti "ambil properti `nama`, simpan ke variabel `namaUser`".',
      },
      {
        tanya: 'Apa isi `hobi`?\n\n~~~js\nconst user = { nama: "Budi" };\nconst { hobi = "tidak ada" } = user;\n~~~',
        benar: '`"tidak ada"`',
        salah: ['`undefined`', '`null`', 'Error karena properti `hobi` tidak ada'],
        jelas: 'Nilai default dipakai ketika properti bernilai `undefined` (atau tidak ada).',
      },
      {
        tanya: 'Pada destructuring object, variabel mana yang dibuat oleh `const { umur, nama } = user;`?',
        benar: '`umur` dan `nama`, diambil berdasarkan nama properti (urutan tidak berpengaruh)',
        salah: ['`umur` dari properti pertama dan `nama` dari properti kedua', 'Hanya `umur`, karena yang lain diabaikan', 'Tidak ada, sintaks ini hanya untuk array'],
        jelas: 'Destructuring object memakai **nama**, bukan posisi. Itu berbeda dengan destructuring array.',
      },
      {
        tanya: 'Kenapa destructuring di parameter, `function Kartu({ nama, umur })`, sangat sering muncul di React?',
        benar: 'Props dikirim ke komponen sebagai satu object sehingga mudah dibongkar langsung',
        salah: ['Karena React tidak mengizinkan parameter biasa', 'Karena destructuring membuat komponen lebih cepat dirender', 'Karena `const` tidak bisa dipakai di dalam komponen'],
        jelas: 'Komponen menerima satu object `props`. Destructuring di parameter mengambil properti yang dibutuhkan dengan ringkas.',
      },
    ],
  },

  'destructuring-array': {
    intisari: 'Destructuring array (`const [x, y] = arr`) membongkar array berdasarkan **posisi**, mirip unpacking tuple di Python; polanya dipakai di `useState` dan untuk menukar nilai tanpa variabel sementara.',
    rangkuman: [
      '`const [w1, w2] = warna;` mengambil elemen pertama dan kedua berdasarkan posisinya.',
      'Lewati elemen dengan koma kosong: `const [, , ketiga] = warna;`. Sisanya dikumpulkan dengan `...`: `const [pertama, ...sisa] = arr;`.',
      'Menukar nilai tanpa variabel sementara: `[x, y] = [y, x];`.',
      'Fungsi bisa mengembalikan beberapa nilai lewat array, lalu dibongkar: `const [hasil, sisa] = bagiDanSisa(17, 5);`. Begitu pula `const [jumlah, setJumlah] = useState(0);`.',
    ],
    soal: [
      {
        tanya: 'Apa isi `x` dan `y` setelah kode ini?\n\n~~~js\nlet x = 1, y = 2;\n[x, y] = [y, x];\n~~~',
        benar: '`x = 2`, `y = 1`',
        salah: ['`x = 1`, `y = 2`', '`x = 2`, `y = 2`', '`x = 1`, `y = 1`'],
        jelas: 'Sisi kanan membuat array `[2, 1]` lebih dulu, lalu dibongkar ke `x` dan `y`, sehingga nilainya tertukar.',
      },
      {
        tanya: 'Apa isi `ketiga`?\n\n~~~js\nconst warna = ["merah", "hijau", "biru"];\nconst [, , ketiga] = warna;\n~~~',
        benar: '`"biru"`',
        salah: ['`"merah"`', '`"hijau"`', '`undefined`'],
        jelas: 'Koma kosong melewati elemen di posisi itu. Dua koma kosong melewati dua elemen pertama.',
      },
      {
        tanya: 'Pada `const [jumlah, setJumlah] = useState(0);`, kenapa sintaks `[ ]` yang dipakai?',
        benar: '`useState` mengembalikan array dua elemen, lalu dibongkar berdasarkan posisinya',
        salah: ['Karena `useState` mengembalikan object berisi `jumlah` dan `setJumlah`', 'Karena kurung siku wajib untuk semua deklarasi variabel', 'Karena `jumlah` dan `setJumlah` harus berada dalam array agar bisa diubah'],
        jelas: 'Destructuring array bergantung pada posisi, jadi nama variabelnya bebas ditentukan sendiri.',
      },
      {
        tanya: 'Apa isi `sisanya`?\n\n~~~js\nconst [juara1, ...sisanya] = ["A", "B", "C"];\n~~~',
        benar: '`["B", "C"]`',
        salah: ['`"B"`', '`["A", "B", "C"]`', '`["C"]`'],
        jelas: '`...sisanya` mengumpulkan semua elemen setelah elemen yang sudah diambil.',
      },
    ],
  },

  'spread': {
    intisari: 'Spread `...` menumpahkan isi array/object ke tempat lain; ia membuat salinan baru dan menjadi alat utama update state React, tetapi hanya menyalin **satu tingkat** (shallow).',
    rangkuman: [
      'Array: `[...a, ...b]` (gabung), `[...a]` (salinan), `[0, ...a, 99]` (sisip). `Math.max(...b)` membuka isi array menjadi argumen.',
      'Object: `{ ...user }` (salinan), `{ ...user, umur: 21 }` (perbarui), `{ ...user, kota: "Bandung" }` (tambah properti).',
      '**Urutan penting:** properti yang ditulis belakangan menimpa yang sebelumnya. `{ ...user, umur: 21 }` memberi umur 21; `{ umur: 21, ...user }` umur kembali ke milik `user`.',
      'Spread hanya menyalin **satu tingkat**. Untuk properti bersarang, spread juga tingkat dalamnya: `{ ...user, alamat: { ...user.alamat, kota: "Jakarta" } }`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil kode ini?\n\n~~~js\nconst user = { nama: "Budi", umur: 20 };\nconst baru = { ...user, umur: 21 };\n~~~',
        benar: '`{ nama: "Budi", umur: 21 }`',
        salah: ['`{ nama: "Budi", umur: 20 }`', '`{ umur: 21 }`', '`{ nama: "Budi", umur: [20, 21] }`'],
        jelas: 'Properti `umur: 21` ditulis setelah `...user`, jadi menimpa nilai lama. `user` sendiri tidak berubah.',
      },
      {
        tanya: 'Apa hasil kode ini?\n\n~~~js\nconst user = { nama: "Budi", umur: 20 };\nconst baru = { umur: 21, ...user };\n~~~',
        benar: '`umur` tetap 20',
        salah: ['`umur` menjadi 21', 'Terjadi error karena kunci kembar', '`umur` menjadi `undefined`'],
        jelas: 'Yang ditulis belakangan menang. Itu sebabnya urutan spread dan properti baru penting.',
      },
      {
        tanya: 'Bagaimana cara menambahkan `itemBaru` ke array state `daftar` dengan gaya React (tanpa mengubah array lama)?',
        benar: '`[...daftar, itemBaru]`',
        salah: ['`daftar.push(itemBaru)`', '`daftar = daftar + itemBaru`', '`daftar.append(itemBaru)`'],
        jelas: '`push` mengubah array lama sehingga referensinya sama dan React tidak mendeteksi perubahan. Spread membuat array baru.',
      },
      {
        tanya: 'Spread `{ ...user }` menyalin berapa tingkat?',
        benar: 'Satu tingkat (shallow); object di dalamnya tetap berbagi referensi',
        salah: ['Semua tingkat (deep copy)', 'Nol tingkat, hanya referensi yang disalin', 'Dua tingkat saja'],
        jelas: 'Properti yang berupa object/array di dalam `user` tetap menunjuk ke object yang sama. Spread tingkat dalam juga bila ingin mengubahnya dengan aman.',
      },
    ],
  },

  'rest-parameter': {
    intisari: 'Rest `...` (di sisi kiri / parameter) **mengumpulkan** sisa nilai menjadi array atau object, sedangkan spread `...` (di sisi kanan) **membongkar**; rest harus berada paling akhir.',
    rangkuman: [
      '**Rest parameter:** `function jumlah(...angka)` mengumpulkan argumen berapa pun menjadi satu array (setara `*args` Python).',
      'Parameter biasa boleh ada di depan, tetapi rest harus **paling akhir**: `function log(level, ...pesan)`.',
      '**Rest dalam destructuring object:** `const { password, ...userAman } = user;` memisahkan `password` dan mengumpulkan sisanya tanpa mengubah `user`.',
      'Bedakan: **spread** membongkar (saat memanggil / di sisi kanan), **rest** mengumpulkan (di parameter / sisi kiri). Di React: `function Tombol({ label, ...sisa })`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `jumlah(1, 2, 3, 4)`?\n\n~~~js\nfunction jumlah(...angka) {\n  return angka.reduce((a, b) => a + b, 0);\n}\n~~~',
        benar: '`10`',
        salah: ['`1`', '`[1, 2, 3, 4]`', '`NaN`'],
        jelas: '`angka` menjadi array `[1, 2, 3, 4]` yang kemudian dijumlahkan oleh `reduce`.',
      },
      {
        tanya: 'Apa isi `userAman`?\n\n~~~js\nconst user = { id: 7, nama: "Budi", password: "rahasia" };\nconst { password, ...userAman } = user;\n~~~',
        benar: '`{ id: 7, nama: "Budi" }`',
        salah: ['`{ password: "rahasia" }`', '`{ id: 7, nama: "Budi", password: "rahasia" }`', '`["id", "nama"]`'],
        jelas: '`password` diambil sendiri, dan `...userAman` mengumpulkan properti sisanya ke object baru.',
      },
      {
        tanya: 'Manakah deklarasi fungsi dengan rest parameter yang **valid**?',
        benar: '`function log(level, ...pesan) { }`',
        salah: ['`function log(...pesan, level) { }`', '`function log(...pesan, ...lain) { }`', '`function log(...) { }`'],
        jelas: 'Rest parameter harus paling akhir dan hanya boleh satu, serta harus diberi nama.',
      },
      {
        tanya: 'Apa perbedaan spread dan rest?',
        benar: 'Spread membongkar isi, rest mengumpulkan sisa menjadi satu array/object',
        salah: ['Spread hanya untuk array, rest hanya untuk string', 'Keduanya sama persis dan bisa ditukar', 'Spread untuk parameter, rest untuk argumen'],
        jelas: 'Tanda `...`-nya sama, tetapi perannya berlawanan sesuai posisinya.',
      },
    ],
  },

  'optional-chaining-nullish': {
    intisari: '`?.` berhenti dengan aman menjadi `undefined` saat bagian di kirinya `null`/`undefined`, dan `??` memberi nilai cadangan **hanya** untuk `null`/`undefined` (tidak untuk `0` atau `""` seperti `||`).',
    rangkuman: [
      '`user.alamat?.kota` menghasilkan `undefined` (bukan error) bila `user.alamat` tidak ada. Berlaku juga untuk `arr?.[0]` dan `obj.fungsi?.()`.',
      '`x ?? cadangan` memakai cadangan hanya jika `x` adalah **`null` atau `undefined`**.',
      '`x || cadangan` memakai cadangan untuk **semua nilai falsy** (`0`, `""`, `false`, dll.). Itu bisa salah bila `0` adalah data valid.',
      'Kombinasi umum: `user.alamat?.kota ?? "Tidak diketahui"`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `user.alamat.kota` jika `user = { nama: "Budi" }`?',
        benar: 'Error `TypeError`',
        salah: ['`undefined`', '`null`', '`""`'],
        jelas: 'Mengakses properti dari `undefined` memicu error. Dengan `user.alamat?.kota`, hasilnya `undefined` tanpa error.',
      },
      {
        tanya: 'Berapa nilai `a` dan `b`?\n\n~~~js\nconst stok = 0;\nconst a = stok || 10;\nconst b = stok ?? 10;\n~~~',
        benar: '`a = 10`, `b = 0`',
        salah: ['`a = 0`, `b = 10`', '`a = 10`, `b = 10`', '`a = 0`, `b = 0`'],
        jelas: '`0` falsy sehingga `||` mengambil cadangan, tetapi `0` bukan `null`/`undefined` jadi `??` mempertahankannya.',
      },
      {
        tanya: 'Operator mana yang tepat untuk memberi nilai default pada `limit` tanpa mengganti `0`?',
        benar: '`limit ?? 10`',
        salah: ['`limit || 10`', '`limit && 10`', '`limit ? 10`'],
        jelas: '`??` hanya menggantikan `null`/`undefined`, sehingga `0` yang valid tetap dipertahankan.',
      },
      {
        tanya: 'Apa hasil `user?.alamat?.kota` jika `user` sendiri bernilai `undefined`?',
        benar: '`undefined`, tanpa error',
        salah: ['`TypeError`', '`null`', '`"kota"`'],
        jelas: 'Setiap `?.` menghentikan rantai dengan aman begitu bagian di kirinya `null`/`undefined`.',
      },
    ],
  },

  'short-circuit': {
    intisari: '`&&` dan `||` tidak selalu menghasilkan boolean: keduanya mengembalikan **salah satu operandnya** dan berhenti mengevaluasi bila hasil sudah pasti (short-circuit); di React, hati-hati `{jumlah && ...}` saat `jumlah` bernilai `0`.',
    rangkuman: [
      '`a || b` mengembalikan `a` jika truthy, kalau tidak `b`. Contoh: `"" || "Anonim"` → `"Anonim"`.',
      '`a && b` mengembalikan `a` jika falsy, kalau tidak `b`. Contoh: `true && "Halo"` → `"Halo"`.',
      '**Short-circuit:** bagian kanan tidak dievaluasi bila hasil sudah pasti dari bagian kiri (`false && fungsi()` tidak memanggil `fungsi`).',
      'Di JSX, `{jumlahPesan > 0 && <p>...</p>}` aman. `{jumlah && <p>...</p>}` saat `jumlah = 0` menampilkan **angka 0**; gunakan kondisi boolean.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `"" || "Anonim"`?',
        benar: '`"Anonim"`',
        salah: ['`true`', '`""`', '`false`'],
        jelas: '`""` falsy, jadi `||` mengembalikan operand di kanan.',
      },
      {
        tanya: 'Apa hasil `true && "Halo"`?',
        benar: '`"Halo"`',
        salah: ['`true`', '`false`', '`undefined`'],
        jelas: 'Karena `true` truthy, `&&` mengembalikan operand kedua apa adanya, bukan sekadar `true`.',
      },
      {
        tanya: 'Apa yang tampil di layar React jika `jumlah = 0` pada `{jumlah && <p>Ada pesan</p>}`?',
        benar: 'Angka `0`',
        salah: ['Tidak ada apa-apa', 'Tulisan "Ada pesan"', 'Error'],
        jelas: '`0 && x` menghasilkan `0`, dan React menampilkan angka. Pakai `{jumlah > 0 && ...}`.',
      },
      {
        tanya: 'Apa maksud "short-circuit" pada `false && fungsi()`?',
        benar: '`fungsi()` tidak dijalankan karena hasilnya sudah pasti `false`',
        salah: ['`fungsi()` dijalankan lebih dulu baru dicek', 'Terjadi error korsleting pada program', '`false` otomatis diubah menjadi `true`'],
        jelas: 'Jika operand kiri `&&` sudah falsy, operand kanan tidak dievaluasi sama sekali.',
      },
    ],
  },

  'proyek-pengaturan-profil': {
    intisari: 'Proyek ini menggabungkan destructuring dengan default, `?.` dan `??` untuk data yang tidak lengkap, serta spread untuk menggabung pengaturan default dengan milik user tanpa mengubah object aslinya.',
    rangkuman: [
      'Data dari API sering tidak lengkap, jadi gunakan `?.` dan `??`: `respon.sosmed?.instagram ?? "-"`.',
      'Gabung default dan milik user: `{ ...DEFAULT, ...user }`. Properti bersarang digabung **per tingkat** dengan spread di tiap tingkat.',
      'Destructuring dengan default membuat kode ringkas: `const { nama, kontak: { email } = {} } = respon;`.',
      'Jangan mengubah object aslinya (mis. `PENGATURAN_DEFAULT`). Selalu hasilkan object baru.',
    ],
    soal: [
      {
        tanya: 'Apa isi `final`?\n\n~~~js\nconst DEFAULT = { tema: "terang", bahasa: "id" };\nconst user = { tema: "gelap" };\nconst final = { ...DEFAULT, ...user };\n~~~',
        benar: '`{ tema: "gelap", bahasa: "id" }`',
        salah: ['`{ tema: "terang", bahasa: "id" }`', '`{ tema: "gelap" }`', '`{ tema: ["terang", "gelap"], bahasa: "id" }`'],
        jelas: 'Properti milik `user` ditulis belakangan sehingga menimpa default, sementara `bahasa` yang tidak diatur tetap memakai default.',
      },
      {
        tanya: 'Nilai `respon.sosmed` adalah `null`. Bagaimana mengambil `respon.sosmed.instagram` dengan aman dan cadangan `"-"`?',
        benar: '`respon.sosmed?.instagram ?? "-"`',
        salah: ['`respon.sosmed.instagram || "-"`', '`respon.sosmed?.instagram && "-"`', '`respon?.sosmed.instagram ?? "-"`'],
        jelas: '`respon.sosmed` bernilai `null`, jadi akses `.instagram` langsung akan error. `?.` setelah `sosmed` melindunginya, dan `??` memberi cadangan.',
      },
      {
        tanya: 'Kenapa `PENGATURAN_DEFAULT` tidak boleh diubah langsung oleh fungsi `gabungPengaturan`?',
        benar: 'Default dipakai ulang oleh pemanggilan lain',
        salah: ['Karena object tidak bisa diubah di JavaScript', 'Karena `const` selalu membuat object beku', 'Karena spread tidak bisa dipakai pada object yang diubah'],
        jelas: 'Mengubah object bersama membuat hasil pemanggilan berikutnya salah. Menghasilkan object baru menghindari efek samping itu.',
      },
    ],
  },
};
