// Chapter 3 — String & Fungsi. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'template-literal': {
    intisari: 'Template literal (string dengan backtick) menyisipkan nilai lewat `${...}` dan boleh berisi ekspresi apa pun serta beberapa baris; padanannya f-string di Python.',
    rangkuman: [
      'Ditulis dengan **backtick** `` ` `` (bukan kutip), variabel disisipkan dengan `${nama}`.',
      'Isi `${ }` boleh ekspresi apa saja: `${umur + 1}` atau `${umur >= 17 ? "dewasa" : "anak"}`.',
      'String biasa tidak boleh ganti baris, tetapi template literal **boleh** (mirip `"""` di Python).',
      'Jauh lebih mudah dibaca daripada menyambung string dengan `+` berkali-kali.',
    ],
    soal: [
      {
        tanya: 'Apa yang dicetak kode ini?\n\n~~~js\nconst nama = "Budi";\nconsole.log(`Halo, ${nama}!`);\n~~~',
        benar: '`Halo, Budi!`',
        salah: ['`Halo, ${nama}!`', '`Halo, nama!`', 'Error, karena `${}` hanya berlaku di React'],
        jelas: 'Di dalam template literal, `${nama}` diganti dengan isi variabelnya.',
      },
      {
        tanya: 'Apa yang dicetak kode ini?\n\n~~~js\nconst nama = "Budi";\nconsole.log("Halo, ${nama}!");\n~~~',
        benar: '`Halo, ${nama}!` apa adanya',
        salah: ['`Halo, Budi!`', 'Error karena variabel tidak ditemukan', '`Halo, undefined!`'],
        jelas: 'Yang dipakai kutip biasa, bukan backtick. `${...}` hanya berfungsi di dalam template literal, jadi teksnya dicetak apa adanya.',
      },
      {
        tanya: 'Mana yang **tidak** bisa dilakukan oleh string dengan kutip biasa `"..."` tetapi bisa oleh template literal?',
        benar: 'Ditulis dalam beberapa baris tanpa menambah karakter khusus',
        salah: ['Disimpan di dalam `const`', 'Digabung dengan string lain', 'Dicetak dengan `console.log`'],
        jelas: 'Template literal boleh berisi baris baru langsung, mirip triple-quote Python. String biasa tidak.',
      },
      {
        tanya: 'Apa isi `${umur + 1}` jika `umur = 20`?',
        benar: '`21`, karena isi `${}` dihitung sebagai ekspresi',
        salah: ['`"20 + 1"`', '`201`', 'Error, `${}` hanya menerima nama variabel'],
        jelas: 'Apa pun di dalam `${ }` dievaluasi sebagai ekspresi JavaScript, termasuk penjumlahan.',
      },
    ],
  },

  'method-string': {
    intisari: 'Method string tidak mengubah string aslinya (string itu immutable) melainkan mengembalikan string baru, dan `length` adalah properti tanpa kurung.',
    rangkuman: [
      '`s.length` adalah **properti** (tanpa kurung), bukan fungsi seperti `len(s)` di Python.',
      'Method umum: `toUpperCase()`, `toLowerCase()`, `trim()`, `includes()`, `startsWith()`, `slice(a, b)`, `split()`, `indexOf()`.',
      '`s[-1]` di JS menghasilkan `undefined`; gunakan `s.at(-1)`. `replace` hanya mengganti kemunculan **pertama**; untuk semuanya pakai `replaceAll`.',
      'String **immutable**: `s.toUpperCase()` tidak mengubah `s`, hasilnya harus ditampung. Method boleh dirantai: `"  Budi ".trim().toUpperCase()`.',
    ],
    soal: [
      {
        tanya: 'Apa isi `s` setelah kode ini?\n\n~~~js\nconst s = "halo";\ns.toUpperCase();\n~~~',
        benar: '`"halo"`',
        salah: ['`"HALO"`', '`undefined`', 'Error, `const` tidak boleh dipanggil method'],
        jelas: 'Method string mengembalikan string baru dan tidak mengubah aslinya. Tampung hasilnya: `const besar = s.toUpperCase();`.',
      },
      {
        tanya: 'Bagaimana cara mengambil huruf **terakhir** dari string `s`?',
        benar: '`s.at(-1)`',
        salah: ['`s[-1]`', '`s.last()`', '`s.length`'],
        jelas: '`s[-1]` di JS menghasilkan `undefined`. `s.at(-1)` mendukung indeks negatif.',
      },
      {
        tanya: 'Apa hasil `"banana".replace("a", "o")`?',
        benar: '`"bonana"`, hanya kemunculan pertama yang diganti',
        salah: ['`"bonono"`', '`"banana"` (tidak berubah)', '`"oanana"`'],
        jelas: '`replace` dengan string hanya mengganti kemunculan pertama. Untuk mengganti semuanya gunakan `replaceAll`.',
      },
      {
        tanya: 'Berapa panjang `"Halo Dunia"` dan bagaimana cara mendapatkannya?',
        benar: '10, lewat `s.length` (tanpa kurung)',
        salah: ['10, lewat `s.length()`', '10, lewat `len(s)`', '9, lewat `s.length`'],
        jelas: '`length` adalah properti, bukan method, sehingga tidak diberi kurung. Spasi ikut dihitung.',
      },
    ],
  },

  'function-declaration': {
    intisari: 'Fungsi JS tanpa tipe seperti Python; kalau tidak ada `return` hasilnya `undefined`, dan `console.log` hanya **menampilkan** nilai sedangkan `return` **mengembalikannya**.',
    rangkuman: [
      'Bentuk: `function tambah(a, b) { return a + b; }`: tanpa tipe parameter maupun tipe kembalian.',
      'Tanpa `return`, fungsi mengembalikan **`undefined`** (di Python: `None`).',
      'JS **tidak mengecek jumlah argumen**: yang kurang menjadi `undefined`, yang berlebih diabaikan.',
      '`console.log` hanya menampilkan; `return` mengembalikan nilai agar bisa dipakai lagi. Fungsi `function` bisa dipanggil sebelum definisinya (hoisting).',
    ],
    soal: [
      {
        tanya: 'Berapa nilai `hasil`?\n\n~~~js\nfunction kaliDua(x) {\n  console.log(x * 2);\n}\nconst hasil = kaliDua(5);\n~~~',
        benar: '`undefined`',
        salah: ['`10`', '`5`', '`null`'],
        jelas: '`console.log` hanya menampilkan 10 di layar. Karena tidak ada `return`, fungsi mengembalikan `undefined`.',
      },
      {
        tanya: 'Apa perbedaan `return` dan `console.log` di dalam fungsi?',
        benar: '`return` mengembalikan nilai ke pemanggil, `console.log` hanya menampilkannya',
        salah: ['Keduanya sama, hanya beda nama', '`console.log` mengembalikan nilai ke pemanggil, `return` hanya menampilkannya di layar', '`return` hanya boleh dipakai di fungsi tanpa parameter'],
        jelas: 'Nilai yang hendak dipakai lagi (dijumlah, disimpan, dsb.) harus di-`return`.',
      },
      {
        tanya: 'Fungsi `function tambah(a, b) { return a + b; }` dipanggil sebagai `tambah(5)`. Hasilnya?',
        benar: '`NaN`, karena `b` bernilai `undefined`',
        salah: ['`5`', 'Error karena jumlah argumen kurang', '`0`'],
        jelas: 'JavaScript tidak mengecek jumlah argumen. `b` menjadi `undefined`, dan `5 + undefined` menghasilkan `NaN`.',
      },
      {
        tanya: 'Apa yang dimaksud hoisting pada fungsi `function nama() {}`?',
        benar: 'Fungsinya bisa dipanggil sebelum baris definisinya',
        salah: ['Fungsi otomatis dipanggil saat file dimuat', 'Fungsi tidak boleh punya parameter', 'Fungsi hanya bisa dipanggil sekali'],
        jelas: 'Deklarasi `function` diangkat (hoisted) sehingga di JS tidak perlu prototype seperti di C.',
      },
    ],
  },

  'arrow-function': {
    intisari: 'Arrow function `(x) => x * x` adalah cara singkat menulis fungsi; bila memakai kurawal `{ }` wajib menulis `return`, kalau tidak hasilnya `undefined`.',
    rangkuman: [
      'Bentuk dasar: `const kuadrat = (x) => { return x * x; };`; bentuk singkat: `const kuadrat = (x) => x * x;`.',
      'Tanpa parameter, kurung wajib: `() => "Halo!"`. Satu parameter, kurung boleh dihapus; dua atau lebih, wajib.',
      'Untuk mengembalikan object dengan bentuk singkat, bungkus dengan kurung: `(n) => ({ nama: n })`.',
      'Bila pakai kurawal `{ }`, **wajib** menulis `return`; `(x) => { x * 2 }` mengembalikan `undefined`.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `salah(4)`?\n\n~~~js\nconst salah = (x) => { x * 2 };\n~~~',
        benar: '`undefined`',
        salah: ['`8`', '`4`', '`NaN`'],
        jelas: 'Dengan kurawal, isi fungsi dianggap blok biasa. Tanpa `return`, tidak ada nilai yang dikembalikan.',
      },
      {
        tanya: 'Manakah arrow function yang benar-benar mengembalikan `x * x`?',
        benar: '`const f = (x) => x * x;`',
        salah: ['`const f = (x) => { x * x };`', '`const f = (x) -> x * x;`', '`const f = x => { x * x; };`'],
        jelas: 'Bentuk singkat tanpa kurawal mengembalikan ekspresinya otomatis. Dua pilihan lain memakai kurawal tanpa `return`, dan `->` bukan sintaks JavaScript.',
      },
      {
        tanya: 'Bagaimana arrow function singkat mengembalikan object `{ nama: n }`?',
        benar: '`(n) => ({ nama: n })`',
        salah: ['`(n) => { nama: n }`', '`(n) => nama: n`', '`(n) => [nama: n]`'],
        jelas: 'Tanpa kurung, `{ }` dibaca sebagai blok kode. Membungkus object dengan `( )` menegaskan bahwa itu object literal yang dikembalikan.',
      },
      {
        tanya: 'Mana yang benar untuk arrow function **tanpa parameter**?',
        benar: '`const sapa = () => "Halo!";`',
        salah: ['`const sapa = => "Halo!";`', '`const sapa = () -> "Halo!";`', '`const sapa = (void) => "Halo!";`'],
        jelas: 'Tanpa parameter, tanda kurung `()` wajib ditulis.',
      },
    ],
  },

  'parameter-default': {
    intisari: 'Parameter default (`function salam(nama = "Kawan")`) dipakai bila argumennya tidak diberikan atau bernilai `undefined`, bukan untuk `null`, `0`, atau `""`.',
    rangkuman: [
      'Tanpa default, argumen yang tidak diberikan bernilai `undefined` sehingga bisa muncul hasil seperti "Halo, undefined!".',
      'Sintaks: `function salam(nama = "Kawan")` atau `(x, n = 2) => x ** n` (sama seperti Python).',
      'Default hanya dipakai jika argumen **tidak diberikan atau `undefined`**. `null`, `0`, dan `""` dianggap sudah diberikan.',
      'Letakkan parameter default di **akhir** daftar parameter.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `salam(null)`?\n\n~~~js\nfunction salam(nama = "Kawan") {\n  return `Halo, ${nama}!`;\n}\n~~~',
        benar: '`"Halo, null!"`',
        salah: ['`"Halo, Kawan!"`', '`"Halo, undefined!"`', 'Error'],
        jelas: 'Nilai default hanya menggantikan `undefined`. `null` dianggap nilai yang sengaja diberikan.',
      },
      {
        tanya: 'Apa hasil `pangkat(3)`?\n\n~~~js\nconst pangkat = (x, n = 2) => x ** n;\n~~~',
        benar: '`9`',
        salah: ['`3`', '`6`', '`NaN`'],
        jelas: '`n` tidak diberikan sehingga memakai default 2. `3 ** 2` = 9.',
      },
      {
        tanya: 'Kapan nilai default parameter dipakai?',
        benar: 'Saat argumen tidak diberikan atau bernilai `undefined`',
        salah: ['Saat argumen bernilai `0` atau string kosong', 'Saat argumen bernilai `null` atau `false`', 'Selalu, argumen yang dikirim diabaikan'],
        jelas: 'Hanya `undefined` (atau argumen yang tidak dikirim) yang memicu default.',
      },
    ],
  },

  'callback': {
    intisari: 'Di JavaScript fungsi adalah nilai biasa; fungsi yang dikirim sebagai argumen ke fungsi lain disebut callback, dan yang dikirim adalah fungsinya (tanpa tanda kurung), bukan hasil pemanggilannya.',
    rangkuman: [
      'Fungsi bisa disimpan di variabel, dikirim sebagai argumen, dan dikembalikan dari fungsi lain.',
      'Fungsi yang dikirim sebagai argumen disebut **callback**: `jalankanDuaKali(() => console.log("Halo!"))`.',
      '**Kirim fungsinya, jangan panggil.** `jalankanDuaKali(sapa)` benar; `jalankanDuaKali(sapa())` memanggil `sapa` sekarang lalu mengirim hasilnya (`undefined`).',
      'Callback menjadi dasar `map`/`filter`/`forEach`, `addEventListener`, `setTimeout`, dan `onClick` di React.',
    ],
    soal: [
      {
        tanya: 'Apa itu callback?',
        benar: 'Fungsi yang dikirim sebagai argumen ke fungsi lain',
        salah: ['Fungsi yang memanggil dirinya sendiri', 'Fungsi yang tidak punya parameter', 'Fungsi yang selalu dijalankan paling akhir'],
        jelas: 'Callback hanyalah fungsi biasa yang diperlakukan sebagai nilai dan diteruskan ke fungsi lain agar dipanggil di waktu yang tepat.',
      },
      {
        tanya: 'Mana pemanggilan yang benar-benar **mengirim fungsi** `sapa` sebagai callback?',
        benar: '`jalankanDuaKali(sapa);`',
        salah: ['`jalankanDuaKali(sapa());`', '`jalankanDuaKali("sapa");`', '`jalankanDuaKali(return sapa);`'],
        jelas: '`sapa()` memanggil fungsinya sekarang dan mengirim hasilnya. Tanpa kurung, yang dikirim adalah fungsinya.',
      },
      {
        tanya: 'Berapa hasil `hitung(3, 4, (x, y) => x * y)`?\n\n~~~js\nfunction hitung(a, b, operasi) {\n  return operasi(a, b);\n}\n~~~',
        benar: '`12`',
        salah: ['`7`', '`34`', '`undefined`'],
        jelas: '`operasi` adalah callback `(x, y) => x * y` yang dipanggil dengan 3 dan 4.',
      },
      {
        tanya: 'Mana yang merupakan contoh pemakaian callback yang akan kamu temui nanti?',
        benar: '`setTimeout(() => console.log("hai"), 1000)`',
        salah: ['`console.log("hai")`', '`const x = 5`', '`let nama = "Budi"`'],
        jelas: 'Fungsi `() => ...` dikirim ke `setTimeout` dan dipanggil nanti oleh `setTimeout` setelah 1 detik.',
      },
    ],
  },

  'proyek-kartu-mahasiswa': {
    intisari: 'Proyek ini merangkai method string, template literal, function, dan parameter default: pecah dengan `split`, olah tiap kata, lalu gabungkan kembali dengan `join`.',
    rangkuman: [
      'Kapitalisasi satu kata: `kata[0].toUpperCase() + kata.slice(1).toLowerCase()`.',
      '`split(" ")` memecah string menjadi array kata; `join(" ")` menggabungkan array kembali menjadi string.',
      'Untuk mengubah tiap kata, tampung hasilnya di array baru dengan `push()` di dalam `for...of`, lalu `join`.',
      'Pecah masalah menjadi fungsi-fungsi kecil yang saling dipakai (mis. `formatNama` memakai `kapitalkan`) supaya mudah dibaca dan diuji.',
    ],
    soal: [
      {
        tanya: 'Apa hasil ekspresi ini?\n\n~~~js\nconst kata = "bUDI";\nkata[0].toUpperCase() + kata.slice(1).toLowerCase()\n~~~',
        benar: '`"Budi"`',
        salah: ['`"BUDI"`', '`"bUDI"`', '`"budi"`'],
        jelas: 'Huruf pertama dikapitalkan (`B`), sisanya (`UDI`) dikecilkan (`udi`), lalu digabung.',
      },
      {
        tanya: 'Apa hasil `"budi santoso".split(" ")`?',
        benar: '`["budi", "santoso"]`',
        salah: ['`"budi,santoso"`', '`["b", "u", "d", "i"]`', '`2`'],
        jelas: '`split` memecah string menjadi array berdasarkan pemisah yang diberikan.',
      },
      {
        tanya: 'Method yang menggabungkan array `["Budi", "Santoso"]` menjadi `"Budi Santoso"` adalah ...',
        benar: '`.join(" ")`',
        salah: ['`.split(" ")`', '`.concat(" ")`', '`.merge(" ")`'],
        jelas: '`join` adalah kebalikan `split`. `split` memecah string, `join` menyatukan array.',
      },
      {
        tanya: 'Apa hasil `"Budi Santoso".slice(-3)`?',
        benar: '`"oso"`',
        salah: ['`"Bud"`', '`"Santoso"`', '`"Budi"`'],
        jelas: '`slice` dengan angka negatif mengambil dari belakang, jadi 3 karakter terakhir.',
      },
    ],
  },
};
