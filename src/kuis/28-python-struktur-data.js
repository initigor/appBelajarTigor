// Python, Bab 2 — Struktur Data Python. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-list': {
    intisari: 'List adalah deretan berurutan yang bisa diubah; b = a tidak menyalin, dan sort() mengubah di tempat sambil mengembalikan None.',
    rangkuman: [
      'List = deretan berurutan yang **mutable**.',
      'Ubah dengan `lst[i] = x`, `append`, `insert`, `extend`, `remove`, `pop`.',
      '`sort()` mengubah di tempat (mengembalikan `None`); `sorted()` membuat list baru.',
      '`b = a` tidak menyalin; pakai `copy()` atau `a[:]`, dan `copy.deepcopy` untuk list bersarang.',
      'Hati-hati `[[0]*3]*2`: gunakan comprehension untuk list 2D.',
    ],
    soal: [
      {
        tanya: 'Apa keluaran kode ini?\n\n~~~python\na = [1, 2]\nb = a\nb.append(3)\nprint(a)\n~~~',
        benar: '`[1, 2, 3]`',
        salah: ['`[1, 2]`', '`[3]`', '`[1, 2, 3, 3]`'],
        jelas: '`b = a` membuat dua nama untuk list yang sama, sehingga perubahan lewat b terlihat di a.',
      },
      {
        tanya: 'Apa nilai `hasil` setelah `hasil = [3, 1, 2].sort()`?',
        benar: '`None`',
        salah: ['`[1, 2, 3]`', '`[3, 1, 2]`', 'Error'],
        jelas: '`sort()` mengurutkan di tempat dan mengembalikan None. Untuk list baru gunakan `sorted()`.',
      },
      {
        tanya: 'Apa hasil `[10, 20, 30][-1]`?',
        benar: '30',
        salah: ['10', '20', 'IndexError'],
        jelas: 'Indeks negatif menghitung dari belakang; −1 adalah elemen terakhir.',
      },
      {
        tanya: 'Mengapa `grid = [[0] * 3] * 2` berbahaya?',
        benar: 'Kedua baris adalah list yang sama, sehingga mengubah satu baris mengubah keduanya',
        salah: ['Karena menghasilkan list kosong', 'Karena `*` tidak boleh dipakai pada list', 'Karena hasilnya selalu berupa tuple'],
        jelas: 'Perkalian mengulang referensi yang sama. Gunakan `[[0] * 3 for _ in range(2)]`.',
      },
    ],
  },

  'py-tuple-set': {
    intisari: 'Tuple berurutan dan immutable, sedangkan set tanpa urutan dan tanpa duplikat dengan operasi himpunan yang cepat.',
    rangkuman: [
      '**Tuple**: berurutan, immutable; satu elemen butuh koma `(5,)`; dipakai untuk data tetap, kunci dict, dan mengembalikan banyak nilai.',
      '**Packing/unpacking**: `a, b = b, a`; `pertama, *sisa = daftar`.',
      '**Set**: tanpa urutan dan tanpa duplikat; `set()` untuk set kosong; cek `in` sangat cepat.',
      'Operasi himpunan: `|` gabungan, `&` irisan, `-` selisih, `^` selisih simetris.',
    ],
    soal: [
      {
        tanya: 'Manakah yang merupakan tuple berisi satu elemen?',
        benar: '`(5,)`',
        salah: ['`(5)`', '`[5]`', '`{5}`'],
        jelas: '`(5)` hanyalah angka 5 dalam kurung. Koma yang membuat tuple. `{5}` adalah set.',
      },
      {
        tanya: 'Berapa `len(set([1, 2, 2, 3, 3, 3]))`?',
        benar: '3',
        salah: ['6', '2', '1'],
        jelas: 'Set membuang duplikat sehingga hanya 1, 2, 3 yang tersisa.',
      },
      {
        tanya: 'Apa hasil `{1, 2, 3} & {2, 3, 4}`?',
        benar: '`{2, 3}`',
        salah: ['`{1, 2, 3, 4}`', '`{1, 4}`', '`{1}`'],
        jelas: '`&` adalah irisan: elemen yang ada di kedua set.',
      },
      {
        tanya: 'Bagaimana membuat set kosong?',
        benar: '`set()`',
        salah: ['`{}`', '`[]`', '`()`'],
        jelas: '`{}` membuat dict kosong. Set kosong harus ditulis `set()`.',
      },
      {
        tanya: 'Apa yang terjadi pada `titik = (3, 4); titik[0] = 10`?',
        benar: 'TypeError karena tuple tidak bisa diubah',
        salah: ['titik menjadi (10, 4)', 'titik menjadi (10,)', 'Tidak ada galat tetapi tidak ada perubahan'],
        jelas: 'Tuple immutable: elemennya tidak bisa ditimpa.',
      },
    ],
  },

  'py-dict': {
    intisari: 'Dictionary menyimpan pasangan kunci-nilai dengan pencarian cepat; get() mengakses dengan aman dan items() menelusuri pasangan.',
    rangkuman: [
      '**dict**: pasangan kunci → nilai; kunci unik dan hashable; urutan penyisipan terjaga.',
      'Akses: `d[k]` (KeyError bila tidak ada) atau `d.get(k, bawaan)`; ubah dengan `d[k] = v`, `update`, `pop`, `del`.',
      'Telusuri dengan `keys()`, `values()`, `items()`; pola hitung: `d[k] = d.get(k, 0) + 1`.',
      'Gabung dengan `{**a, **b}` atau `a | b`; `b = a` tidak menyalin.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `{"a": 1}.get("x", 0)`?',
        benar: '0',
        salah: ['None', 'KeyError', '1'],
        jelas: '`get` mengembalikan nilai bawaan (argumen kedua) bila kunci tidak ada, tanpa galat.',
      },
      {
        tanya: 'Exception apa yang muncul dari `{"a": 1}["x"]`?',
        benar: 'KeyError',
        salah: ['IndexError', 'ValueError', 'NameError'],
        jelas: 'Mengakses kunci yang tidak ada lewat `d[k]` memicu KeyError.',
      },
      {
        tanya: 'Cara menelusuri kunci dan nilai sekaligus pada dict `d` adalah ...',
        benar: '`for k, v in d.items():`',
        salah: ['`for k, v in d:`', '`for k, v in d.keys():`', '`for k, v in d.values():`'],
        jelas: '`items()` menghasilkan pasangan (kunci, nilai) yang bisa di-unpack.',
      },
      {
        tanya: 'Apa hasil `{**{"x": 1, "y": 2}, **{"y": 20}}`?',
        benar: '`{"x": 1, "y": 20}`',
        salah: ['`{"x": 1, "y": 2}`', '`{"y": 20}`', '`{"x": 1, "y": [2, 20]}`'],
        jelas: 'Pada penggabungan, dict yang di kanan menimpa nilai kunci yang sama.',
      },
      {
        tanya: 'Mengapa list tidak boleh dipakai sebagai kunci dict?',
        benar: 'Karena list mutable dan tidak hashable',
        salah: ['Karena list terlalu panjang', 'Karena list tidak punya indeks', 'Karena list hanya berisi angka'],
        jelas: 'Kunci harus hashable (immutable). Gunakan tuple sebagai gantinya.',
      },
    ],
  },

  'py-iterasi': {
    intisari: 'enumerate, zip, sorted, any, dan all membuat iterasi ringkas; iterator seperti zip hanya bisa dipakai sekali.',
    rangkuman: [
      '`enumerate(x, start=n)` memberi indeks dan nilai; `zip(a, b, ...)` menelusuri beberapa koleksi serentak (berhenti di yang terpendek).',
      '`sorted(x, key=..., reverse=...)` membuat list terurut baru; `min`/`max`/`sum` meringkas.',
      '`any` dan `all` menguji kondisi pada banyak elemen.',
      'Iterator (`zip`, `map`, `filter`, `enumerate`) hanya bisa dipakai **sekali**.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `list(zip([1, 2, 3], ["a", "b"]))`?',
        benar: '`[(1, "a"), (2, "b")]`',
        salah: ['`[(1, "a"), (2, "b"), (3, None)]`', '`[1, "a", 2, "b"]`', 'Error karena panjangnya berbeda'],
        jelas: '`zip` berhenti pada koleksi terpendek.',
      },
      {
        tanya: 'Bagaimana membuat `enumerate` mulai dari angka 1?',
        benar: '`enumerate(daftar, start=1)`',
        salah: ['`enumerate(daftar + 1)`', '`enumerate(1, daftar)`', '`enumerate(daftar)[1:]`'],
        jelas: 'Parameter `start` menentukan nomor awal penghitung.',
      },
      {
        tanya: 'Apa hasil `any(n < 70 for n in [80, 65, 90])`?',
        benar: 'True',
        salah: ['False', '65', 'Error'],
        jelas: '`any` bernilai True bila minimal satu elemen memenuhi kondisi; 65 < 70.',
      },
      {
        tanya: 'Apa isi `pasangan` kedua kali dipanggil `list(pasangan)` bila `pasangan = zip([1], ["a"])`?',
        benar: 'List kosong, karena iterator sudah habis',
        salah: ['Sama seperti pertama kali', 'Error StopIteration', 'None'],
        jelas: '`zip` mengembalikan iterator sekali pakai. Ubah menjadi list bila perlu dipakai berulang.',
      },
    ],
  },

  'py-comprehension': {
    intisari: 'Comprehension membuat list, dict, atau set dari koleksi lain dalam satu ekspresi; if saja berada di belakang, if-else di depan.',
    rangkuman: [
      '**List comprehension**: `[ekspresi for x in iterable if kondisi]`.',
      '`if` saja di belakang (menyaring); `if-else` di depan (memilih nilai).',
      '**Dict** `{k: v for ...}`, **set** `{x for ...}`, dan **generator** `(x for ...)` (malas, hemat memori).',
      'Gunakan bila ringkas dan jelas; pilih loop biasa untuk logika rumit atau efek samping.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `[n * n for n in range(1, 6) if n % 2 == 1]`?',
        benar: '`[1, 9, 25]`',
        salah: ['`[1, 4, 9, 16, 25]`', '`[4, 16]`', '`[1, 3, 5]`'],
        jelas: 'Hanya n ganjil (1, 3, 5) yang diambil, lalu dikuadratkan.',
      },
      {
        tanya: 'Di mana posisi `if-else` bila dipakai untuk memilih nilai pada list comprehension?',
        benar: 'Di depan kata `for`: `[a if cond else b for x in data]`',
        salah: ['Di belakang `for` seperti penyaringan', 'Di dalam kurung terpisah setelah list', 'Tidak boleh dipakai pada comprehension'],
        jelas: '`if` tanpa `else` untuk menyaring ditulis di belakang; `if-else` adalah ekspresi sehingga ditaruh di depan.',
      },
      {
        tanya: 'Apa hasil `{k: len(k) for k in ["a", "bb"]}`?',
        benar: '`{"a": 1, "bb": 2}`',
        salah: ['`["a", "bb"]`', '`{1, 2}`', '`{"a", "bb"}`'],
        jelas: 'Dict comprehension memetakan tiap kata ke panjangnya.',
      },
      {
        tanya: 'Apa keunggulan generator expression `(n * n for n in range(10**6))` dibanding list comprehension?',
        benar: 'Nilai dihasilkan satu per satu sehingga hemat memori',
        salah: ['Hasilnya langsung dapat diindeks', 'Hasilnya selalu lebih akurat', 'Dapat ditelusuri berkali-kali'],
        jelas: 'Generator bersifat malas dan hanya bisa ditelusuri sekali, tetapi tidak menyimpan seluruh elemen di memori.',
      },
    ],
  },
};
