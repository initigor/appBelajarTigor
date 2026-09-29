import { baris, kode, output, pg, pgk } from './_bersama/buat.js';

export default {
  id: 'ujian-2-struktur-data',
  judul: 'Ujian 2: Array, Object & JS Modern',
  ikon: '📝',
  deskripsi: 'Method array, object & JSON, destructuring, spread, dan optional chaining.',
  chapterIds: [4, 5, 6],
  setelahChapter: 6,
  lulus: 70,
  xp: 120,
  komposisi: { 'pilihan-ganda': 8, 'prediksi-output': 3, kode: 2 },
  soal: [
    // ---------- Chapter 4: Array ----------
    pgk('u2-01', 4, 'Manakah method array untuk menambah elemen di **akhir** array?', ['push', 'pop', 'shift', 'unshift'], 0,
      '`push` menambah di akhir (padanan `append` di Python). `pop` mengambil dari akhir, `unshift` menambah di awal, dan `shift` mengambil dari awal.', 'array-dasar'),
    pgk('u2-02', 4, 'Apa yang dikembalikan oleh `[1, 2, 3].map((x) => x * 2)`?', ['[2, 4, 6]', '12', 'undefined', '[1, 2, 3]'], 0,
      '`map` membuat **array baru** berisi hasil callback untuk setiap elemen, dan array aslinya tidak berubah.', 'array-foreach-map'),
    pg('u2-03', 4, 'Apa perbedaan `filter` dan `find`?',
      ['`filter` mengembalikan array semua yang cocok, `find` mengembalikan elemen pertama yang cocok', '`filter` mengubah array asli, `find` tidak', '`find` mengembalikan array, `filter` mengembalikan boolean', 'Keduanya sama persis'], 0,
      '`filter` selalu mengembalikan array (bisa kosong), sedangkan `find` mengembalikan satu elemen pertama yang cocok atau `undefined` jika tidak ada.', 'array-filter-find'),
    pg('u2-04', 4, 'Mengapa `[10, 1, 5, 100].sort()` menghasilkan urutan yang "aneh" (`[1, 10, 100, 5]`)?',
      ['Tanpa pembanding, sort() mengurutkan elemen sebagai string', 'sort() hanya bisa dipakai untuk string', 'Array harus diubah menjadi object dulu', 'sort() otomatis mengurutkan dari besar ke kecil'], 0,
      'Tanpa fungsi pembanding, elemen dikonversi ke string dan diurutkan seperti kamus ("10" < "100" < "5"). Untuk angka pakai `sort((a, b) => a - b)`.', 'array-sort'),
    pg('u2-05', 4, baris('Apa yang terjadi pada kode berikut?', '', '~~~js', 'const daftar = [1, 2];', 'daftar.push(3);', '~~~'),
      ['Tidak error: `const` hanya melarang mengganti variabelnya, isi array tetap boleh berubah', 'Error, karena isi array `const` tidak boleh diubah', 'Error, karena `push` tidak ada pada array `const`', 'Tidak error, tetapi `push` tidak berpengaruh'], 0,
      '`const` mengunci variabel supaya tidak diberi array lain (`daftar = [...]`), tetapi isi array-nya tetap bisa diubah.', 'array-dasar'),
    pg('u2-06', 4, baris('Apa yang terjadi pada `a` setelah kode ini dijalankan?', '', '~~~js', 'const a = [1, 2, 3];', 'const b = a;', 'b.push(4);', '~~~'),
      ['`a` ikut berubah karena `a` dan `b` menunjuk array yang sama', '`a` tidak berubah', 'Terjadi error', '`b` menjadi undefined'], 0,
      'Variabel array menyimpan referensi. `const b = a` **tidak** menyalin isinya, sehingga perubahan lewat `b` terlihat juga di `a`. Untuk menyalin pakai `[...a]` atau `a.slice()`.', 'array-referensi-salinan'),
    pg('u2-07', 4, 'Pada `arr.reduce((acc, n) => acc + n, 0)`, apa fungsi argumen kedua yaitu `0`?',
      ['Nilai awal akumulator `acc`', 'Indeks awal iterasi', 'Batas maksimum hasil', 'Jumlah putaran yang dijalankan'], 0,
      'Argumen kedua `reduce` adalah nilai awal untuk `acc`. Dengan nilai awal `0`, penjumlahan array kosong pun aman (hasilnya 0).', 'array-reduce'),

    // ---------- Chapter 5: Object ----------
    pg('u2-08', 5, 'Kapan **wajib** memakai bracket `obj[kunci]` dan bukan titik `obj.kunci`?',
      ['Saat nama properti disimpan di dalam sebuah variabel', 'Saat object dideklarasikan dengan `const`', 'Saat nilai properti berupa string', 'Tidak pernah, keduanya selalu boleh dipakai bergantian'], 0,
      '`obj.kunci` mencari properti bernama harfiah "kunci". Kalau nama properti ada di variabel `kunci`, harus `obj[kunci]`.', 'object-literal'),
    pgk('u2-09', 5, 'Apa hasil `Object.keys({ a: 1, b: 2 })`?', ['["a", "b"]', '[1, 2]', '[["a", 1], ["b", 2]]', '2'], 0,
      '`Object.keys` menghasilkan array nama properti. `Object.values` menghasilkan nilainya, dan `Object.entries` menghasilkan pasangan `[kunci, nilai]`.', 'object-keys-values-entries'),
    pg('u2-10', 5, 'Apa hasil mengakses properti yang **tidak ada** pada sebuah object, misalnya `mhs.hobi`?', ['undefined', 'Terjadi error (seperti KeyError di Python)', 'null', '""'], 0,
      'JavaScript mengembalikan `undefined` untuk properti yang tidak ada, tanpa error. Error baru muncul jika kamu mengakses properti dari `undefined` itu sendiri.', 'object-literal'),
    pgk('u2-11', 5, 'Fungsi manakah yang mengubah **teks JSON** menjadi object JavaScript?', ['JSON.parse', 'JSON.stringify', 'JSON.decode', 'Object.fromJSON'], 0,
      '`JSON.parse(teks)` → object (padanan `json.loads`). Kebalikannya `JSON.stringify(obj)` → teks (padanan `json.dumps`).', 'json'),
    pgk('u2-12', 5, 'Manakah yang **bukan** JSON yang valid?', ['{"a": 1}', "{'a': 1}", '[1, 2]', '{"a": [1, 2]}'], 1,
      'JSON mewajibkan kutip dua untuk kunci dan string. Tanda kutip satu tidak valid di JSON (walau valid di kode JavaScript).', 'json'),
    pg('u2-13', 5, baris('Pada kode berikut, `this` merujuk ke apa?', '', '~~~js', 'const mhs = {', '  nama: "Budi",', '  sapa() {', '    return "Halo, " + this.nama;', '  },', '};', '~~~'),
      ['Object yang memiliki method tersebut (`mhs`)', 'Object `window`', 'Fungsi `sapa` itu sendiri', 'Selalu `undefined`'], 0,
      'Di dalam method yang dipanggil sebagai `mhs.sapa()`, `this` adalah `mhs`, mirip `self` di Python (tetapi tidak perlu ditulis sebagai parameter).', 'object-method-shorthand'),

    // ---------- Chapter 6: JS Modern ----------
    pgk('u2-14', 6, 'Manakah cara yang benar mengambil `nama` dan `umur` dari object `user` dengan destructuring?',
      ['const { nama, umur } = user;', 'const [nama, umur] = user;', 'const nama, umur = user;', 'const (nama, umur) = user;'], 0,
      'Untuk object dipakai kurung kurawal `{ }` dan nama variabel harus sama dengan nama properti. Kurung siku `[ ]` dipakai untuk array.', 'destructuring-object'),
    pg('u2-15', 6, 'Apa arti `...` pada `const salinan = [...asli, 4];`?',
      ['Spread: menyebarkan isi array `asli` ke array baru', 'Rest: mengumpulkan sisa argumen fungsi', 'Komentar yang berarti "dan seterusnya"', 'Deklarasi array kosong'], 0,
      'Spread membongkar isi array/object ke tempat lain. `[...asli, 4]` membuat array baru berisi semua isi `asli` lalu 4.', 'spread'),
    pgk('u2-16', 6, 'Apa hasil `user?.alamat?.kota` jika `user` **tidak punya** properti `alamat`?', ['undefined', 'TypeError', 'null', '""'], 0,
      'Optional chaining `?.` berhenti dengan aman dan menghasilkan `undefined` bila bagian sebelumnya `null`/`undefined`, tanpa error.', 'optional-chaining-nullish'),
    pg('u2-17', 6, 'Jika `x` bernilai `0`, apa beda `x || 10` dengan `x ?? 10`?',
      ['`x || 10` menghasilkan 10, sedangkan `x ?? 10` menghasilkan 0', 'Keduanya menghasilkan 10', 'Keduanya menghasilkan 0', '`x || 10` menghasilkan 0, sedangkan `x ?? 10` menghasilkan 10'], 0,
      '`||` mengganti semua nilai falsy (termasuk `0` dan `""`), sedangkan `??` hanya mengganti `null` dan `undefined`. Karena itu `??` lebih aman untuk angka.', 'optional-chaining-nullish'),
    pg('u2-18', 6, 'Apa fungsi `...sisa` pada `function jumlah(...sisa) { }`?',
      ['Rest parameter: mengumpulkan semua argumen menjadi sebuah array bernama `sisa`', 'Spread: memecah array menjadi argumen', 'Memberi nilai default pada parameter', 'Menandai parameter yang wajib berupa string'], 0,
      'Rest parameter (`...nama`) menampung berapa pun argumen ke dalam satu array, mirip `*args` di Python.', 'rest-parameter'),
    pgk('u2-19', 6, 'Apa hasil `true && "Halo"`?', ['true', '"Halo"', 'false', 'undefined'], 1,
      '`&&` mengembalikan operand kiri jika falsy, selain itu operand kanan. Karena `true` truthy, hasilnya `"Halo"`. Pola inilah yang dipakai `{kondisi && <Elemen />}` di React.', 'short-circuit'),

    // ---------- Prediksi output ----------
    output('u2-o1', 4,
      baris('const a = [3, 1, 2];', 'const b = a.map((x) => x * 2);', 'console.log(a);', 'console.log(b);'),
      baris('[3, 1, 2]', '[6, 2, 4]'),
      '`map` membuat array baru, sehingga `a` tetap `[3, 1, 2]` sedangkan `b` berisi setiap elemen dikali dua.', 'array-foreach-map'),
    output('u2-o2', 4,
      baris('const angka = [5, 12, 8, 1];', 'angka.sort();', 'console.log(angka);'),
      '[1, 12, 5, 8]',
      '`sort()` tanpa pembanding mengurutkan sebagai string: "1" < "12" < "5" < "8". Selain itu `sort` mengubah array asli.', 'array-sort'),
    output('u2-o3', 4,
      baris('const hasil = [1, 2, 3, 4].reduce((acc, n) => acc + n * n, 0);', 'console.log(hasil);'),
      '30',
      'Akumulator mulai dari 0 lalu ditambah kuadrat tiap elemen: 1 + 4 + 9 + 16 = 30.', 'array-reduce'),
    output('u2-o4', 4,
      baris('const a = [1, 2, 3];', 'const b = a;', 'const c = [...a];', 'b.push(4);', 'console.log(a.length, c.length);', 'console.log(a === b, a === c);'),
      baris('4 3', 'true false'),
      '`b` adalah referensi yang sama dengan `a`, jadi `push` lewat `b` mengubah `a` (panjang 4). `c` adalah salinan (panjang tetap 3). `a === b` benar karena satu array yang sama, `a === c` salah karena array berbeda.', 'array-referensi-salinan'),
    output('u2-o5', 6,
      baris('const p = { nama: "Sinta", umur: 20 };', 'const q = { ...p, umur: 21, kota: "Solo" };', 'console.log(p.umur, q.umur);', 'console.log(Object.keys(q));'),
      baris('20 21', "['nama', 'umur', 'kota']"),
      'Spread menyalin `p` ke object baru lalu `umur` ditimpa. Object asli `p` tidak berubah. Urutan kunci: `nama`, `umur` (posisi awal dipertahankan), lalu `kota`.', 'spread'),
    output('u2-o6', 5,
      baris('const teks = JSON.stringify({ a: 1, b: [2, 3] });', 'console.log(teks);', 'console.log(typeof teks);', 'console.log(JSON.parse(teks).b[1]);'),
      baris('{"a":1,"b":[2,3]}', 'string', '3'),
      '`JSON.stringify` menghasilkan **string** tanpa spasi. `JSON.parse` mengembalikannya menjadi object sehingga `.b[1]` bernilai 3.', 'json'),
    output('u2-o7', 6,
      baris('const { a, b = 5, ...sisa } = { a: 1, c: 3, d: 4 };', 'console.log(a, b, sisa);'),
      '1 5 { c: 3, d: 4 }',
      '`a` diambil (1), `b` tidak ada sehingga memakai default 5, dan `...sisa` mengumpulkan properti lain: `{ c: 3, d: 4 }`.', 'rest-parameter'),
    output('u2-o8', 6,
      baris('const user = { profil: null };', 'console.log(user.profil?.nama);', 'console.log(user.profil?.nama ?? "Tamu");', 'console.log(0 || 10, 0 ?? 10);'),
      baris('undefined', 'Tamu', '10 0'),
      '`?.` menghasilkan `undefined` tanpa error, `??` menggantinya dengan "Tamu". `0 || 10` menghasilkan 10 (karena 0 falsy), tetapi `0 ?? 10` tetap 0.', 'optional-chaining-nullish'),
    output('u2-o9', 6,
      baris('let x = 1, y = 2;', '[x, y] = [y, x];', 'const [p, ...q] = [x, y, 9];', 'console.log(x, y);', 'console.log(q);'),
      baris('2 1', '[1, 9]'),
      'Destructuring array menukar nilai: x = 2, y = 1. Lalu `[x, y, 9]` = `[2, 1, 9]`; `p` = 2 dan `q` menampung sisanya `[1, 9]`.', 'destructuring-array'),

    // ---------- Menulis kode ----------
    kode('u2-k1', 4, {
      jenis: 'js',
      pelajaran: 'array-filter-find',
      tugas: baris(
        'Buat fungsi **`hapusDuplikat(arr)`** yang mengembalikan **array baru** tanpa elemen kembar. Urutan kemunculan pertama dipertahankan, dan array `arr` tidak boleh diubah.',
        '',
        '- `hapusDuplikat([1, 2, 2, 3, 1])` → `[1, 2, 3]`',
        '- `hapusDuplikat(["a", "b", "a"])` → `["a", "b"]`',
      ),
      kodeAwal: 'function hapusDuplikat(arr) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function hapusDuplikat(arr) {',
        '  return arr.filter((x, i) => arr.indexOf(x) === i);',
        '}',
        '',
      ),
      penjelasan: 'Elemen dipertahankan hanya jika posisinya sekarang sama dengan posisi kemunculan pertamanya: `arr.indexOf(x) === i`. `filter` sudah membuat array baru.',
      tes: [
        {
          nama: 'hapusDuplikat',
          cek(ctx) {
            const kasus = [[[1, 2, 2, 3, 1], [1, 2, 3]], [['a', 'b', 'a'], ['a', 'b']], [[], []], [[5, 5, 5], [5]], [[3, 1, 2], [3, 1, 2]]];
            for (const [masuk, harap] of kasus) {
              const salinan = [...masuk];
              const r = ctx.panggil('hapusDuplikat', masuk);
              if (JSON.stringify(r) !== JSON.stringify(harap)) return `hapusDuplikat(${JSON.stringify(salinan)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
              if (JSON.stringify(masuk) !== JSON.stringify(salinan)) return 'Array masukan ikut berubah. Jangan ubah array asli (buat array baru).';
              if (r === masuk) return 'Fungsi harus mengembalikan array baru, bukan array masukan itu sendiri.';
            }
            return true;
          },
        },
      ],
    }),
    kode('u2-k2', 4, {
      jenis: 'js',
      pelajaran: 'array-sort',
      tugas: baris(
        'Buat fungsi **`urutkanBerdasarkan(daftar, kunci)`** yang mengembalikan **array baru** berisi object dari `daftar`, diurutkan **menaik** menurut properti bernama `kunci`. Array `daftar` tidak boleh berubah. Angka harus diurutkan sebagai angka (9 sebelum 10), string secara abjad.',
        '',
        '`urutkanBerdasarkan([{ n: "B", umur: 30 }, { n: "A", umur: 20 }], "umur")` → `[{ n: "A", umur: 20 }, { n: "B", umur: 30 }]`',
      ),
      kodeAwal: 'function urutkanBerdasarkan(daftar, kunci) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function urutkanBerdasarkan(daftar, kunci) {',
        '  return daftar.slice().sort((a, b) => {',
        '    if (a[kunci] < b[kunci]) return -1;',
        '    if (a[kunci] > b[kunci]) return 1;',
        '    return 0;',
        '  });',
        '}',
        '',
      ),
      penjelasan: 'Salin dulu dengan `slice()` supaya array asli aman (`sort` mengubah array di tempat), lalu beri fungsi pembanding yang membandingkan `a[kunci]` dan `b[kunci]` (bracket karena nama properti ada di variabel).',
      tes: [
        {
          nama: 'urutkanBerdasarkan',
          cek(ctx) {
            const angka = [{ v: 10 }, { v: 9 }, { v: 100 }, { v: 1 }];
            const r1 = ctx.panggil('urutkanBerdasarkan', angka, 'v');
            if (JSON.stringify(r1.map((x) => x.v)) !== '[1,9,10,100]') return `Urutan angka: ${JSON.stringify(r1.map((x) => x.v))}, seharusnya [1,9,10,100]. Angka harus dibandingkan sebagai angka.`;
            if (JSON.stringify(angka.map((x) => x.v)) !== '[10,9,100,1]') return 'Array masukan ikut berubah. Salin dulu sebelum mengurutkan.';
            if (r1 === angka) return 'Fungsi harus mengembalikan array baru.';
            const nama = [{ nama: 'Sinta' }, { nama: 'Andi' }, { nama: 'Budi' }];
            const r2 = ctx.panggil('urutkanBerdasarkan', nama, 'nama');
            if (JSON.stringify(r2.map((x) => x.nama)) !== '["Andi","Budi","Sinta"]') return `Urutan nama: ${JSON.stringify(r2.map((x) => x.nama))}, seharusnya ["Andi","Budi","Sinta"].`;
            const kosong = ctx.panggil('urutkanBerdasarkan', [], 'x');
            return (Array.isArray(kosong) && kosong.length === 0) || 'Untuk array kosong hasilnya harus array kosong.';
          },
        },
      ],
    }),
    kode('u2-k3', 5, {
      jenis: 'js',
      pelajaran: 'object-keys-values-entries',
      tugas: baris(
        'Buat fungsi **`hitungFrekuensi(arr)`** yang mengembalikan **object** berisi berapa kali setiap elemen muncul.',
        '',
        '- `hitungFrekuensi(["a", "b", "a"])` → `{ a: 2, b: 1 }`',
        '- `hitungFrekuensi([])` → `{}`',
      ),
      kodeAwal: 'function hitungFrekuensi(arr) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function hitungFrekuensi(arr) {',
        '  const hasil = {};',
        '  for (const x of arr) {',
        '    hasil[x] = (hasil[x] ?? 0) + 1;',
        '  }',
        '  return hasil;',
        '}',
        '',
      ),
      penjelasan: 'Bracket `hasil[x]` dipakai karena nama propertinya ada di variabel `x`. Jika belum ada, `hasil[x]` bernilai `undefined`, sehingga `?? 0` memberi nilai awal 0 sebelum ditambah 1.',
      tes: [
        {
          nama: 'hitungFrekuensi',
          cek(ctx) {
            const kasus = [[['a', 'b', 'a'], { a: 2, b: 1 }], [[], {}], [['x', 'x', 'x'], { x: 3 }], [['kopi', 'teh', 'kopi', 'kopi', 'teh'], { kopi: 3, teh: 2 }]];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('hitungFrekuensi', masuk);
              const bentuk = (o) => JSON.stringify(Object.entries(o ?? {}).sort());
              if (typeof r !== 'object' || r === null || Array.isArray(r) || bentuk(r) !== bentuk(harap)) return `hitungFrekuensi(${JSON.stringify(masuk)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u2-k4', 6, {
      jenis: 'js',
      pelajaran: 'optional-chaining-nullish',
      tugas: baris(
        'Buat fungsi **`ringkasProfil({ nama, kota, kontak })`** (parameternya langsung di-*destructure*) yang mengembalikan string `"<nama> (<kota>) - <email>"`.',
        '',
        '- `kota` boleh tidak ada → pakai `"Tidak diketahui"`',
        '- `kontak` boleh tidak ada (bahkan `null`), dan `kontak.email` boleh tidak ada → pakai `"-"`',
        '',
        'Contoh:',
        '- `{ nama: "Sinta", kota: "Solo", kontak: { email: "sinta@mail.com" } }` → `"Sinta (Solo) - sinta@mail.com"`',
        '- `{ nama: "Budi" }` → `"Budi (Tidak diketahui) - -"`',
      ),
      kodeAwal: 'function ringkasProfil({ nama, kota, kontak }) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'function ringkasProfil({ nama, kota = "Tidak diketahui", kontak }) {',
        '  const email = kontak?.email ?? "-";',
        '  return nama + " (" + kota + ") - " + email;',
        '}',
        '',
      ),
      penjelasan: 'Nilai default `kota = "Tidak diketahui"` di destructuring menangani kota yang tidak ada. `kontak?.email ?? "-"` aman walau `kontak` `null`/`undefined` atau tidak punya `email`.',
      tes: [
        {
          nama: 'ringkasProfil',
          cek(ctx) {
            const kasus = [
              [{ nama: 'Sinta', kota: 'Solo', kontak: { email: 'sinta@mail.com' } }, 'Sinta (Solo) - sinta@mail.com'],
              [{ nama: 'Budi' }, 'Budi (Tidak diketahui) - -'],
              [{ nama: 'Ayu', kontak: {} }, 'Ayu (Tidak diketahui) - -'],
              [{ nama: 'Dodi', kota: 'Medan', kontak: null }, 'Dodi (Medan) - -'],
            ];
            for (const [masuk, harap] of kasus) {
              const r = ctx.panggil('ringkasProfil', masuk);
              if (r !== harap) return `ringkasProfil(${JSON.stringify(masuk)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
            }
            return true;
          },
        },
      ],
    }),
  ],
};
