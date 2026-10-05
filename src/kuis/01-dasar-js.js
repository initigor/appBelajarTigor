// Chapter 1 — Dasar JavaScript. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'console-log': {
    intisari: '`console.log()` adalah cara JavaScript mencetak nilai ke console, setara `printf` di C dan `print` di Python, dan otomatis pindah baris.',
    rangkuman: [
      'Mencetak di JavaScript memakai `console.log(...)`. Hasilnya muncul di tab Console (di browser: DevTools, tombol F12).',
      '`console.log` **otomatis pindah baris**, jadi tidak perlu menulis `\\n` seperti di C.',
      'Beberapa nilai bisa dicetak sekaligus dengan memisahkannya koma: `console.log("Umurku", 20)` dicetak dengan spasi di antaranya.',
      'String boleh memakai kutip dua `"..."` maupun kutip satu `\'...\'`. Titik koma di akhir baris opsional, tetapi sebaiknya tetap ditulis.',
    ],
    soal: [
      {
        tanya: 'Perintah mana yang dipakai JavaScript untuk menampilkan nilai ke console?',
        benar: '`console.log()`',
        salah: ['`printf()`', '`print()`', '`echo()`'],
        jelas: '`printf` adalah milik C dan `print` milik Python. Di JavaScript, pencetakan ke console dilakukan lewat `console.log()`.',
      },
      {
        tanya: 'Apa yang dicetak oleh `console.log("Umurku", 20, "tahun");`?',
        benar: '`Umurku 20 tahun`',
        salah: ['`Umurku,20,tahun`', '`Umurku20tahun`', 'Error, karena `console.log` hanya menerima satu nilai'],
        jelas: 'Beberapa nilai yang dipisah koma dicetak berurutan dengan **spasi** di antaranya.',
      },
      {
        tanya: 'Dua pemanggilan `console.log` berurutan. Apakah kamu perlu menulis `\\n` supaya hasilnya tampil di baris berbeda?',
        benar: 'Tidak perlu, `console.log` otomatis pindah baris',
        salah: ['Perlu, kalau tidak hasilnya menyatu di satu baris', 'Perlu, tetapi hanya untuk angka', 'Tidak perlu, tetapi harus diakhiri titik koma agar pindah baris'],
        jelas: 'Setiap `console.log` mencetak satu baris sendiri. Titik koma bersifat opsional dan tidak ada hubungannya dengan pindah baris.',
      },
    ],
  },

  'komentar-variabel': {
    intisari: 'Pakai `const` untuk nilai yang tidak akan diganti dan `let` untuk nilai yang akan berubah. Komentar ditulis dengan `//` atau `/* */`.',
    rangkuman: [
      'Komentar satu baris memakai `//`, beberapa baris memakai `/* ... */`. Tanda `#` milik Python tidak berlaku di JavaScript.',
      '`const` membuat variabel yang **tidak bisa diberi nilai baru**. Mengubahnya memunculkan `TypeError: Assignment to constant variable`.',
      '`let` membuat variabel yang nilainya **boleh diganti**. Aturan praktis: mulai dengan `const`, ganti ke `let` hanya kalau memang perlu berubah.',
      '`var` adalah cara lama sebelum ada `let`/`const`, sebaiknya dihindari. Nama variabel memakai **camelCase**, mis. `nilaiAkhir`.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi jika kode ini dijalankan?\n\n~~~js\nconst nama = "Budi";\nnama = "Andi";\n~~~',
        benar: 'Terjadi `TypeError` karena `const` tidak boleh diberi nilai baru',
        salah: ['`nama` berubah menjadi "Andi" tanpa masalah', '`nama` tetap "Budi" dan baris kedua diabaikan diam-diam', 'Terjadi `SyntaxError` karena `nama` dideklarasikan dua kali'],
        jelas: 'Variabel `const` hanya boleh diisi satu kali. Menugaskan ulang langsung memunculkan `TypeError: Assignment to constant variable`.',
      },
      {
        tanya: 'Kamu membuat variabel `semester` yang nilainya akan naik setiap semester. Kata kunci mana yang paling tepat?',
        benar: '`let`',
        salah: ['`const`', '`int`', '`static`'],
        jelas: 'Nilai yang perlu diganti dideklarasikan dengan `let`. `int` adalah deklarasi tipe milik C, bukan JavaScript.',
      },
      {
        tanya: 'Gaya penulisan nama variabel yang lazim di JavaScript adalah ...',
        benar: 'camelCase, mis. `nilaiAkhir`',
        salah: ['snake_case, mis. `nilai_akhir`', 'Huruf kapital semua, mis. `NILAIAKHIR`', 'Selalu diawali garis bawah, mis. `_nilaiAkhir`'],
        jelas: 'Kebiasaan umum JavaScript adalah camelCase. Snake_case adalah kebiasaan Python.',
      },
      {
        tanya: 'Cara menulis komentar satu baris di JavaScript adalah ...',
        benar: '`// ini komentar`',
        salah: ['`# ini komentar`', '`-- ini komentar`', '`<!-- ini komentar -->`'],
        jelas: 'JavaScript memakai `//` (sama seperti C). `#` hanya untuk Python.',
      },
    ],
  },

  'tipe-data': {
    intisari: 'JavaScript hanya punya satu tipe angka (`number`) untuk bilangan bulat dan desimal; nilai yang belum diisi bertipe `undefined`, sedangkan `null` berarti sengaja dikosongkan.',
    rangkuman: [
      'Tipe dasar: `number`, `string`, `boolean` (`true`/`false` huruf kecil), `undefined`, dan `null`.',
      'JS **tidak membedakan** `int` dan `float`: `20` dan `3.14` sama-sama `number`.',
      '`let x;` tanpa nilai membuat `x` bernilai `undefined`. `null` dipakai untuk "sengaja kosong" (setara `None` di Python).',
      '`typeof` mengecek tipe sebuah nilai. Keanehan lama: `typeof null` menghasilkan `"object"`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `typeof 3.14`?',
        benar: '`"number"`',
        salah: ['`"float"`', '`"double"`', '`"decimal"`'],
        jelas: 'Semua angka di JavaScript bertipe `number`, baik bulat maupun desimal.',
      },
      {
        tanya: 'Apa isi dan tipe variabel `kosong` setelah `let kosong;`?',
        benar: 'Nilainya `undefined`, `typeof`-nya `"undefined"`',
        salah: ['Nilainya `null`, `typeof`-nya `"object"`', 'Nilainya `0`, `typeof`-nya `"number"`', 'Nilainya `""`, `typeof`-nya `"string"`'],
        jelas: 'Variabel yang dideklarasikan tanpa nilai otomatis bernilai `undefined`.',
      },
      {
        tanya: 'Apa hasil `typeof null`?',
        benar: '`"object"`, bug lama JavaScript yang dibiarkan demi kompatibilitas',
        salah: ['`"null"`', '`"undefined"`', '`"boolean"`'],
        jelas: 'Ini keanehan historis. Untuk memeriksa `null`, bandingkan langsung dengan `=== null`.',
      },
      {
        tanya: 'Nilai mana yang ditulis dengan benar sebagai boolean di JavaScript?',
        benar: '`true`',
        salah: ['`True`', '`TRUE`', '`"true"`'],
        jelas: 'Boolean JavaScript huruf kecil semua: `true` dan `false`. `True` milik Python. `"true"` dengan kutip adalah string, bukan boolean.',
      },
    ],
  },

  'operator-aritmatika': {
    intisari: 'Pembagian `/` di JavaScript selalu menghasilkan angka desimal bila tidak habis dibagi; untuk pembagian bulat gunakan `Math.floor(a / b)`.',
    rangkuman: [
      'Operator: `+ - * / % **` (`%` sisa bagi, `**` pangkat).',
      '`7 / 2` hasilnya **`3.5`** (bukan `3` seperti di C). Untuk pembagian bulat: `Math.floor(7 / 2)` → `3`.',
      'Operator gabungan dan increment sama dengan C: `+=`, `*=`, `++`, `--`. Python tidak punya `++`.',
      'Objek `Math` menyediakan fungsi matematika: `Math.round`, `Math.sqrt`, `Math.max`, `Math.abs`, dan lain-lain.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `7 / 2` di JavaScript?',
        benar: '`3.5`',
        salah: ['`3`', '`4`', '`3.0` (bertipe float terpisah dari `3.5`)'],
        jelas: 'Semua angka bertipe `number`, jadi pembagian tidak dibulatkan otomatis seperti pembagian `int` di C.',
      },
      {
        tanya: 'Bagaimana cara mendapatkan hasil bagi bulat `7 / 2 = 3` (seperti `//` di Python)?',
        benar: '`Math.floor(7 / 2)`',
        salah: ['`7 // 2`', '`Math.round(7 / 2)`', '`7 \\ 2`'],
        jelas: '`//` bukan operator pembagian di JS (itu komentar!). `Math.round(3.5)` malah menghasilkan 4, sedangkan `Math.floor` membulatkan ke bawah.',
      },
      {
        tanya: 'Berapa nilai `skor` setelah kode ini?\n\n~~~js\nlet skor = 10;\nskor += 5;\nskor *= 2;\n~~~',
        benar: '`30`',
        salah: ['`20`', '`25`', '`15`'],
        jelas: 'Mula-mula 10, lalu `+= 5` menjadi 15, lalu `*= 2` menjadi 30.',
      },
      {
        tanya: 'Operator mana yang menghitung **sisa bagi** (modulo)?',
        benar: '`%`',
        salah: ['`/`', '`**`', '`//`'],
        jelas: '`7 % 2` hasilnya `1`. `**` adalah pangkat, `/` adalah bagi.',
      },
    ],
  },

  'perbandingan-logika': {
    intisari: 'Selalu pakai `===` dan `!==` karena membandingkan nilai sekaligus tipe; `==` mengonversi tipe diam-diam dan sering memberi kejutan.',
    rangkuman: [
      '`===` (sama ketat) menuntut nilai **dan** tipe sama. `==` (sama longgar) mengonversi tipe dulu: `5 == "5"` bernilai `true`.',
      'Aturan emas: **selalu pakai `===` dan `!==`.** Operator lain sama dengan C: `<`, `>`, `<=`, `>=`.',
      'Operator logika: `&&` (dan), `||` (atau), `!` (bukan). Python memakai `and`, `or`, `not`.',
      'Tulisan `1 < x < 10` ala Python **tidak** bekerja benar di JS. Tulis `x > 1 && x < 10`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `5 === "5"`?',
        benar: '`false`, karena tipenya berbeda (number vs string)',
        salah: ['`true`, karena nilainya sama-sama lima', '`true`, karena `===` mengonversi tipe dulu', 'Error, tidak boleh membandingkan angka dengan string'],
        jelas: '`===` tidak mengonversi tipe. `5` (number) dan `"5"` (string) dianggap berbeda.',
      },
      {
        tanya: 'Operator "sama dengan" mana yang sebaiknya selalu kamu pakai?',
        benar: '`===`',
        salah: ['`==`', '`=`', '`:=`'],
        jelas: '`==` melakukan konversi tipe diam-diam sehingga hasilnya sering mengejutkan. Satu `=` adalah penugasan, bukan perbandingan.',
      },
      {
        tanya: 'Operator logika "dan" di JavaScript adalah ...',
        benar: '`&&`',
        salah: ['`and`', '`&`', '`AND`'],
        jelas: 'JS meniru C: `&&`, `||`, `!`. Kata `and`/`or`/`not` adalah milik Python.',
      },
      {
        tanya: 'Bagaimana cara yang benar menyatakan "x di antara 1 dan 10" di JavaScript?',
        benar: '`x > 1 && x < 10`',
        salah: ['`1 < x < 10`', '`x > 1 and x < 10`', '`x between 1, 10`'],
        jelas: '`1 < x < 10` tidak error, tetapi dihitung dua langkah: `1 < x` menghasilkan boolean, lalu boolean itu dibandingkan dengan 10, sehingga hasilnya hampir selalu `true`.',
      },
    ],
  },

  'konversi-tipe': {
    intisari: 'Operator `+` menggabung string kalau salah satu sisinya string, jadi input form (selalu string) harus diubah dulu dengan `Number()` sebelum dihitung.',
    rangkuman: [
      '`"2" + 3` hasilnya `"23"`: kalau ada string, `+` **menggabung**, bukan menjumlah. Operator `-` selalu matematika: `"10" - 3` → `7`.',
      'Konversi eksplisit: `Number("42")`, `parseInt("42px")`, `parseFloat("3.5kg")`, `String(42)`.',
      '`Number("abc")` menghasilkan `NaN` (bukan angka). `typeof NaN` adalah `"number"` dan `NaN === NaN` adalah `false`.',
      'Cek NaN dengan `Number.isNaN(x)`. Ingat: nilai dari form HTML selalu berupa **string**.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `"2" + 3`?',
        benar: '`"23"` (string)',
        salah: ['`5` (number)', '`"5"` (string)', 'Error, tidak boleh menjumlah string dengan angka'],
        jelas: 'Kalau salah satu operand string, `+` menggabungkan teks. Angka 3 ikut diubah menjadi `"3"`.',
      },
      {
        tanya: 'Kamu membaca dua angka dari form: `a = "20"` dan `b = "22"`. Bagaimana agar `a + b` menghasilkan `42`?',
        benar: '`Number(a) + Number(b)`',
        salah: ['`String(a) + String(b)`', '`a + b` sudah menghasilkan 42', '`parseInt(a + b)`'],
        jelas: '`a + b` menghasilkan `"2022"`. Ubah dulu keduanya menjadi number. `parseInt(a + b)` malah mengubah `"2022"` menjadi 2022.',
      },
      {
        tanya: 'Apa hasil `Number("abc")`?',
        benar: '`NaN`',
        salah: ['`0`', '`undefined`', 'Error yang menghentikan program'],
        jelas: 'Konversi yang gagal menghasilkan `NaN` (Not a Number), bukan error.',
      },
      {
        tanya: 'Cara yang benar untuk memeriksa apakah sebuah nilai adalah `NaN` adalah ...',
        benar: '`Number.isNaN(x)`',
        salah: ['`x === NaN`', '`x == undefined`', '`typeof x === "NaN"`'],
        jelas: '`NaN === NaN` selalu `false`, jadi tidak bisa dibandingkan langsung. Gunakan `Number.isNaN`.',
      },
    ],
  },

  'truthy-falsy': {
    intisari: 'Hanya ada 6 nilai falsy (`false`, `0`, `""`, `null`, `undefined`, `NaN`); semua nilai lain truthy, termasuk array kosong `[]` dan object kosong `{}`.',
    rangkuman: [
      'Dalam kondisi `if`, setiap nilai dianggap **truthy** atau **falsy**.',
      'Enam nilai falsy: `false`, `0` (dan `-0`), `""` (string kosong), `null`, `undefined`, `NaN`.',
      'Semua nilai lain truthy, termasuk `"0"`, `" "`, `[]`, dan `{}`. Ini beda dengan Python, di mana `[]` dan `{}` falsy.',
      'Cek array kosong dengan `arr.length === 0`. `Boolean(x)` atau `!!x` mengubah nilai menjadi `true`/`false`.',
    ],
    soal: [
      {
        tanya: 'Mana di antara nilai berikut yang **falsy**?',
        benar: '`0`',
        salah: ['`"0"`', '`[]`', '`{}`'],
        jelas: 'Angka `0` falsy. String `"0"` berisi karakter sehingga truthy, begitu pula array dan object kosong.',
      },
      {
        tanya: 'Apa hasil `Boolean([])`?',
        benar: '`true`, array kosong tetap truthy',
        salah: ['`false`, seperti di Python', '`undefined`', 'Error karena array tidak bisa diubah ke boolean'],
        jelas: 'Berbeda dengan Python, di JavaScript `[]` dan `{}` adalah truthy.',
      },
      {
        tanya: 'Cara paling tepat memeriksa apakah array `daftar` kosong?',
        benar: '`daftar.length === 0`',
        salah: ['`!daftar`', '`daftar == false`', '`daftar === null`'],
        jelas: '`!daftar` selalu `false` untuk array (array selalu truthy), sehingga tidak bisa mendeteksi kosong. Periksa panjangnya.',
      },
      {
        tanya: 'Berapa jumlah nilai falsy di JavaScript?',
        benar: 'Enam: `false`, `0`, `""`, `null`, `undefined`, `NaN`',
        salah: ['Tiga: `false`, `0`, `null`', 'Empat: `false`, `0`, `""`, `[]`', 'Banyak, tidak bisa dihitung'],
        jelas: 'Daftarnya terbatas pada enam nilai itu. Selain itu semuanya truthy.',
      },
    ],
  },

  'proyek-kalkulator-nilai': {
    intisari: 'Untuk menghitung nilai berbobot, kalikan setiap komponen dengan persentasenya (pakai bilangan bulat lalu bagi 100) supaya terhindar dari hasil desimal yang kurang rapi.',
    rangkuman: [
      'Nilai akhir berbobot: `(tugas * 20 + uts * 30 + uas * 50) / 100`.',
      'Desimal disimpan dalam floating point, jadi `0.1 + 0.2` hasilnya `0.30000000000000004`. Hitung dengan persen bulat lalu bagi 100 agar hasilnya rapi.',
      'Kondisi lulus cukup berupa perbandingan yang menghasilkan boolean: `const lulus = nilaiAkhir >= 70;`.',
      '`+` menggabung string: `"Nilai akhir: " + nilaiAkhir`. Cara yang lebih enak (template literal) dipelajari di Chapter 3.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `0.1 + 0.2` di JavaScript?',
        benar: '`0.30000000000000004`',
        salah: ['`0.3` persis', '`0.2`', '`NaN`'],
        jelas: 'Angka desimal disimpan sebagai floating point biner sehingga ada sedikit galat pembulatan, sama seperti di C dan Python.',
      },
      {
        tanya: 'Cara menulis `lulus` yang bernilai `true` jika `nilaiAkhir` minimal 70?',
        benar: '`const lulus = nilaiAkhir >= 70;`',
        salah: ['`const lulus = nilaiAkhir > 70;`', '`const lulus = "nilaiAkhir >= 70";`', '`const lulus = nilaiAkhir => 70;`'],
        jelas: '"Minimal 70" berarti 70 sudah termasuk, jadi pakai `>=`. Operator `=>` bukan perbandingan.',
      },
      {
        tanya: 'Tugas 80, UTS 70, UAS 90 dengan bobot 20% / 30% / 50%. Ekspresi yang menghitung nilai akhir dengan benar adalah ...',
        benar: '`(80 * 20 + 70 * 30 + 90 * 50) / 100`',
        salah: ['`(80 + 70 + 90) / 3`', '`80 * 20 + 70 * 30 + 90 * 50`', '`(80 + 70 + 90) * 100`'],
        jelas: 'Setiap komponen dikalikan bobotnya, dijumlahkan, lalu dibagi 100. Hasilnya 83.',
      },
    ],
  },
};
