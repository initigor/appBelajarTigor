import { baris, kode, output, pg, pgk } from './_bersama/buat.js';

export default {
  id: 'ujian-1-dasar',
  judul: 'Ujian 1: Dasar JavaScript',
  ikon: '📝',
  deskripsi: 'Variabel & tipe data, percabangan & loop, string & fungsi.',
  chapterIds: [1, 2, 3],
  setelahChapter: 3,
  lulus: 70,
  xp: 100,
  komposisi: { 'pilihan-ganda': 8, 'prediksi-output': 3, kode: 2 },
  soal: [
    // ---------- Chapter 1: Dasar JS ----------
    pgk('u1-01', 1, 'Apa hasil dari `typeof null`?', ['"null"', '"object"', '"undefined"', '"number"'], 1,
      '`typeof null` menghasilkan `"object"`. Ini keanehan lama JavaScript yang tidak pernah diperbaiki demi kompatibilitas.', 'tipe-data'),
    pgk('u1-02', 1, 'Manakah deklarasi variabel yang nilainya **tidak boleh diganti** setelah dibuat?',
      ['let umur = 20;', 'const umur = 20;', 'var umur = 20;', 'umur = 20;'], 1,
      '`const` membuat variabel yang tidak bisa diberi nilai baru. `let` boleh diganti, dan `var` adalah cara lama yang sebaiknya dihindari.', 'komentar-variabel'),
    pgk('u1-03', 1, 'Apa hasil dari `5 === "5"`?', ['true', 'false', '"5"', 'Error'], 1,
      '`===` membandingkan nilai **dan** tipe. Angka `5` dan string `"5"` tipenya berbeda, jadi hasilnya `false`.', 'perbandingan-logika'),
    pgk('u1-04', 1, 'Apa hasil dari ekspresi `"2" + 3`?', ['5', '"23"', 'NaN', 'TypeError'], 1,
      'Jika salah satu operand `+` adalah string, JavaScript menggabungkan (bukan menjumlahkan), hasilnya string `"23"`. Python akan error di sini, JavaScript tidak.', 'konversi-tipe'),
    pgk('u1-05', 1, 'Manakah nilai berikut yang bernilai **truthy**?', ['0', '""', '[]', 'null'], 2,
      'Nilai falsy hanya: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Array kosong `[]` itu truthy (berbeda dengan Python).', 'truthy-falsy'),
    pgk('u1-06', 1, 'Apa hasil dari `7 / 2` di JavaScript?', ['3', '3.5', '4', 'Error'], 1,
      'Semua angka di JavaScript bertipe `number`, jadi pembagian tidak membulatkan seperti `int / int` di C. Untuk pembagian bulat gunakan `Math.floor(7 / 2)`.', 'operator-aritmatika'),

    // ---------- Chapter 2: Percabangan & Loop ----------
    pgk('u1-07', 2, 'Bagaimana menulis `elif` (Python) di JavaScript?', ['elif', 'else if', 'elseif', 'otherwise'], 1,
      'Di JavaScript (seperti C) penulisannya dua kata terpisah: `else if`.', 'if-else'),
    pgk('u1-08', 2, 'Apa hasil dari `10 > 5 ? "A" : "B"`?', ['"A"', '"B"', 'true', 'false'], 0,
      'Operator ternary `kondisi ? nilaiJikaTrue : nilaiJikaFalse`. Karena `10 > 5` benar, hasilnya `"A"`.', 'ternary'),
    pg('u1-09', 2, 'Apa yang terjadi jika sebuah `case` di `switch` **tidak** diakhiri `break`?',
      ['Terjadi error sintaks', 'Eksekusi lanjut ke case berikutnya (fall through)', 'switch berhenti otomatis', 'case berikutnya dilewati'], 1,
      'Tanpa `break`, eksekusi "jatuh" ke `case` berikutnya sampai ketemu `break` atau akhir `switch`, sama seperti di C.', 'switch'),
    pgk('u1-10', 2, 'Loop mana yang badannya dijalankan **minimal sekali** walaupun kondisi awalnya salah?',
      ['for', 'while', 'do...while', 'for...of'], 2,
      '`do...while` menjalankan badan loop dulu, baru mengecek kondisi. Python tidak punya loop ini.', 'while-do-while'),
    pgk('u1-11', 2, 'Manakah padanan `for x in daftar:` (Python) di JavaScript?',
      ['for (const x of daftar) { }', 'for (const x in daftar) { }', 'for x in daftar { }', 'foreach x of daftar { }'], 0,
      '`for...of` mengambil isi array. `for...in` justru menghasilkan indeks (sebagai string), jadi jangan dipakai untuk array.', 'for-of-break-continue'),
    pg('u1-12', 2, 'Apa yang dilakukan `continue` di dalam sebuah loop?',
      ['Menghentikan seluruh loop', 'Melewati sisa badan loop dan lanjut ke putaran berikutnya', 'Keluar dari fungsi', 'Mengulang putaran yang sama dari awal'], 1,
      '`continue` melewati sisa badan loop pada putaran itu saja. Yang menghentikan seluruh loop adalah `break`.', 'for-of-break-continue'),

    // ---------- Chapter 3: String & Fungsi ----------
    pgk('u1-13', 3, 'Manakah cara menulis template literal yang benar untuk menyisipkan variabel `nama`?',
      ['"Halo ${nama}"', "'Halo ${nama}'", '`Halo ${nama}`', '`Halo {nama}`'], 2,
      'Template literal memakai backtick (`) dan `${...}`. Dengan tanda kutip biasa, `${nama}` hanya dianggap teks.', 'template-literal'),
    pgk('u1-14', 3, 'Apa yang dikembalikan sebuah fungsi JavaScript yang **tidak** punya `return`?', ['0', 'null', 'undefined', '""'], 2,
      'Tanpa `return`, fungsi mengembalikan `undefined` (padanan `None` di Python).', 'function-declaration'),
    pg('u1-15', 3, 'Apa arti `const kuadrat = (x) => x * x;`?',
      ['Fungsi yang mengembalikan hasil x * x', 'Fungsi yang mencetak x * x ke console', 'Variabel yang berisi hasil x * x', 'Error karena tidak memakai kurung kurawal'], 0,
      'Arrow function bentuk singkat (tanpa `{}`) otomatis me-return ekspresi di kanan `=>`.', 'arrow-function'),
    pgk('u1-16', 3, 'Manakah yang **mengirim fungsi** `sapa` sebagai callback, bukan memanggilnya?',
      ['jalankan(sapa)', 'jalankan(sapa())', 'jalankan("sapa")', 'jalankan(sapa;)'], 0,
      '`sapa` (tanpa kurung) adalah fungsinya. `sapa()` memanggil fungsi itu sekarang dan mengirim hasilnya.', 'callback'),
    pgk('u1-17', 3, 'Manakah cara yang benar untuk mengetahui panjang string `s`?', ['s.length', 's.length()', 'len(s)', 's.size'], 0,
      '`length` adalah **properti**, bukan method, jadi tanpa kurung. `len(s)` adalah gaya Python.', 'method-string'),
    pgk('u1-18', 3, baris('Apa hasil `salam()` untuk fungsi berikut?', '', '~~~js', 'function salam(nama = "Kawan") {', '  return "Halo, " + nama;', '}', '~~~'),
      ['"Halo, undefined"', '"Halo, Kawan"', 'Error', '"Halo, "'], 1,
      'Parameter default dipakai jika argumen tidak diberikan (atau `undefined`), jadi `nama` bernilai `"Kawan"`.', 'parameter-default'),

    // ---------- Prediksi output ----------
    output('u1-o1', 1,
      baris('let a = 5;', 'let b = "5";', 'console.log(a == b);', 'console.log(a === b);', 'console.log(a + b);'),
      baris('true', 'false', '55'),
      '`==` mengonversi tipe dulu sehingga `5 == "5"` bernilai `true`, tetapi `===` tidak, jadi `false`. `a + b` menggabung string menjadi `"55"`.', 'perbandingan-logika'),
    output('u1-o2', 1,
      baris('console.log(typeof 42);', 'console.log(typeof "42");', 'console.log(typeof undefined);', 'console.log(Boolean(""));'),
      baris('number', 'string', 'undefined', 'false'),
      'Tipe `42` adalah number dan `"42"` adalah string. String kosong `""` termasuk falsy, jadi `Boolean("")` bernilai `false`.', 'tipe-data'),
    output('u1-o3', 2,
      baris('for (let i = 1; i <= 5; i++) {', '  if (i === 2) continue;', '  if (i === 4) break;', '  console.log(i);', '}'),
      baris('1', '3'),
      'Saat `i` = 2 putaran dilewati (`continue`), dan saat `i` = 4 loop berhenti (`break`) sebelum mencetak, jadi hanya 1 dan 3 yang tercetak.', 'for-of-break-continue'),
    output('u1-o4', 2,
      baris('const n = 2;', 'switch (n) {', '  case 1:', '    console.log("satu");', '  case 2:', '    console.log("dua");', '  case 3:', '    console.log("tiga");', '    break;', '  default:', '    console.log("lainnya");', '}'),
      baris('dua', 'tiga'),
      'Cocok di `case 2`, lalu karena tidak ada `break`, eksekusi jatuh ke `case 3` dan berhenti di `break` di sana.', 'switch'),
    output('u1-o5', 2,
      baris('let x = 10;', 'do {', '  console.log(x);', '  x++;', '} while (x < 10);'),
      '10',
      '`do...while` menjalankan badan loop sekali dulu (mencetak 10), lalu kondisi `x < 10` sudah salah sehingga berhenti.', 'while-do-while'),
    output('u1-o6', 3,
      baris('const nama = "Budi";', 'const umur = 20;', 'console.log(`${nama} berumur ${umur + 1} tahun`);', 'console.log(nama.toUpperCase().slice(0, 2));'),
      baris('Budi berumur 21 tahun', 'BU'),
      'Isi `${...}` boleh ekspresi, jadi `umur + 1` = 21. `"BUDI".slice(0, 2)` mengambil dua karakter pertama: `BU`.', 'template-literal'),
    output('u1-o7', 3,
      baris('function tambah(a, b = 10) {', '  return a + b;', '}', 'console.log(tambah(1));', 'console.log(tambah(1, 2));', 'console.log(tambah(undefined, 5));'),
      baris('11', '3', 'NaN'),
      'Pada `tambah(undefined, 5)`, parameter `a` bernilai `undefined` (tidak punya default), dan `undefined + 5` menghasilkan `NaN`.', 'parameter-default'),
    output('u1-o8', 3,
      baris('function ulangi(n, aksi) {', '  for (let i = 0; i < n; i++) aksi(i);', '}', 'ulangi(3, (i) => console.log(i * 2));'),
      baris('0', '2', '4'),
      '`aksi(i)` dipanggil dengan i = 0, 1, 2, dan callback mencetak `i * 2`.', 'callback'),

    // ---------- Menulis kode ----------
    kode('u1-k1', 1, {
      jenis: 'js',
      pelajaran: 'tipe-data',
      tugas: baris(
        'Buat fungsi **`jenisNilai(x)`** yang mengembalikan string sesuai isi `x`:',
        '',
        '| Jika `x` berupa | Kembalikan |',
        '| --- | --- |',
        '| number | `"angka"` |',
        '| string | `"teks"` |',
        '| boolean | `"boolean"` |',
        '| `null` atau `undefined` | `"kosong"` |',
        '| selain itu (array, object, ...) | `"lainnya"` |',
      ),
      kodeAwal: 'function jenisNilai(x) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function jenisNilai(x) {',
        '  if (x === null || x === undefined) return "kosong";',
        '  if (typeof x === "number") return "angka";',
        '  if (typeof x === "string") return "teks";',
        '  if (typeof x === "boolean") return "boolean";',
        '  return "lainnya";',
        '}',
        '',
      ),
      penjelasan: 'Perhatikan `typeof null` adalah `"object"`, jadi `null` harus dicek terpisah lebih dulu.',
      tes: [
        {
          nama: 'jenisNilai',
          cek(ctx) {
            const kasus = [[5, 'angka'], [0, 'angka'], ['a', 'teks'], ['', 'teks'], [true, 'boolean'], [null, 'kosong'], [undefined, 'kosong'], [[], 'lainnya'], [{}, 'lainnya']];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('jenisNilai', masuk);
              if (r !== harap) return `jenisNilai(${JSON.stringify(masuk)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${harap}".`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u1-k2', 2, {
      jenis: 'js',
      pelajaran: 'if-else',
      tugas: baris(
        'Buat fungsi **`kategoriSuhu(suhu)`**:',
        '',
        '- di bawah 15 → `"Dingin"`',
        '- 15 sampai 25 (**termasuk** 15 dan 25) → `"Sejuk"`',
        '- di atas 25 → `"Panas"`',
      ),
      kodeAwal: 'function kategoriSuhu(suhu) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function kategoriSuhu(suhu) {',
        '  if (suhu < 15) return "Dingin";',
        '  if (suhu <= 25) return "Sejuk";',
        '  return "Panas";',
        '}',
        '',
      ),
      penjelasan: 'Perhatikan batasnya: 15 dan 25 termasuk "Sejuk", sehingga cabang kedua memakai `<= 25` (bukan `< 25`).',
      tes: [
        {
          nama: 'kategoriSuhu',
          cek(ctx) {
            const kasus = [[10, 'Dingin'], [14, 'Dingin'], [15, 'Sejuk'], [20, 'Sejuk'], [25, 'Sejuk'], [26, 'Panas'], [40, 'Panas'], [-5, 'Dingin']];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('kategoriSuhu', masuk);
              if (r !== harap) return `kategoriSuhu(${masuk}) mengembalikan ${JSON.stringify(r)}, seharusnya "${harap}".`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u1-k3', 2, {
      jenis: 'js',
      pelajaran: 'for-loop',
      tugas: 'Buat fungsi **`jumlahGenap(n)`** yang mengembalikan jumlah semua bilangan **genap** dari 1 sampai `n` (termasuk `n` jika genap). Contoh: `jumlahGenap(10)` → `30` (2 + 4 + 6 + 8 + 10).',
      kodeAwal: 'function jumlahGenap(n) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function jumlahGenap(n) {',
        '  let total = 0;',
        '  for (let i = 1; i <= n; i++) {',
        '    if (i % 2 === 0) total += i;',
        '  }',
        '  return total;',
        '}',
        '',
      ),
      penjelasan: 'Gunakan loop dari 1 sampai `n`, cek genap dengan `i % 2 === 0`, lalu akumulasikan ke variabel `total`.',
      tes: [
        {
          nama: 'jumlahGenap',
          cek(ctx) {
            const kasus = [[10, 30], [1, 0], [7, 12], [0, 0], [2, 2], [100, 2550]];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('jumlahGenap', masuk);
              if (r !== harap) return `jumlahGenap(${masuk}) mengembalikan ${JSON.stringify(r)}, seharusnya ${harap}.`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u1-k4', 3, {
      jenis: 'js',
      pelajaran: 'method-string',
      tugas: baris(
        'Buat fungsi **`inisial(nama)`** yang mengembalikan huruf pertama setiap kata dalam huruf **kapital**, digabung tanpa spasi. Abaikan spasi berlebih di awal/akhir.',
        '',
        '- `inisial("budi santoso")` → `"BS"`',
        '- `inisial("  sinta dewi lestari ")` → `"SDL"`',
        '- `inisial("andi")` → `"A"`',
      ),
      kodeAwal: 'function inisial(nama) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function inisial(nama) {',
        '  let hasil = "";',
        '  for (const kata of nama.trim().split(" ")) {',
        '    hasil += kata[0].toUpperCase();',
        '  }',
        '  return hasil;',
        '}',
        '',
      ),
      penjelasan: 'Rapikan dulu dengan `trim()`, pecah dengan `split(" ")`, ambil `kata[0]`, ubah ke huruf besar dengan `toUpperCase()`, lalu gabungkan.',
      tes: [
        {
          nama: 'inisial',
          cek(ctx) {
            const kasus = [['budi santoso', 'BS'], ['  sinta dewi lestari ', 'SDL'], ['andi', 'A'], ['Rina Putri', 'RP']];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('inisial', masuk);
              if (r !== harap) return `inisial(${JSON.stringify(masuk)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${harap}".`;
            }
            return true;
          },
        },
      ],
    }),
  ],
};
