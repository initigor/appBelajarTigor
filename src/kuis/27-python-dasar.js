// Python, Bab 1 — Mulai Python. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-pengenalan': {
    intisari: 'Python adalah bahasa tingkat tinggi yang mudah dibaca; kode dijalankan dengan print() dan REPL, komentar diawali #, dan blok dibentuk oleh indentasi.',
    rangkuman: [
      'Python: bahasa tingkat tinggi, mudah dibaca, bertipe dinamis, dipakai untuk skrip, data, AI, dan web.',
      '`print()` mencetak nilai; di REPL/notebook nilai ekspresi terakhir ditampilkan otomatis.',
      'Komentar diawali `#`; docstring memakai `"""..."""`.',
      '**Indentasi** (4 spasi) membentuk blok; baris pembuka blok diakhiri titik dua `:`.',
    ],
    soal: [
      {
        tanya: 'Siapa pencipta bahasa Python?',
        benar: 'Guido van Rossum',
        salah: ['Dennis Ritchie', 'James Gosling', 'Brendan Eich'],
        jelas: 'Guido van Rossum merilis Python pada 1991. Dennis Ritchie membuat C, James Gosling Java, dan Brendan Eich JavaScript.',
      },
      {
        tanya: 'Bagaimana cara menulis komentar satu baris di Python?',
        benar: 'Diawali tanda `#`',
        salah: ['Diawali `//`', 'Diawali `--`', 'Diapit `/* ... */`'],
        jelas: 'Python memakai `#`. Tanda `//` dan `/* */` milik C/Java/JavaScript.',
      },
      {
        tanya: 'Apa peran indentasi pada Python?',
        benar: 'Menentukan blok kode (menggantikan kurung kurawal)',
        salah: ['Hanya mempercantik tampilan dan boleh diabaikan', 'Mengubah tipe variabel', 'Mempercepat eksekusi program'],
        jelas: 'Indentasi bermakna: baris yang menjorok adalah bagian dari blok `if`, `for`, `def`, dan sebagainya. Indentasi salah menimbulkan `IndentationError`.',
      },
      {
        tanya: 'Apa yang ditampilkan notebook bila sel hanya berisi `12 * 7`?',
        benar: '84',
        salah: ['`12 * 7`', 'Tidak ada apa pun karena tidak memakai print', 'Error karena tidak ada print'],
        jelas: 'Di REPL dan notebook nilai ekspresi terakhir ditampilkan otomatis, jadi hasilnya 84.',
      },
    ],
  },

  'py-variabel-tipe': {
    intisari: 'Variabel Python dibuat lewat penugasan tanpa deklarasi tipe; tipe melekat pada nilai, dan konversi harus dilakukan eksplisit.',
    rangkuman: [
      'Variabel dibuat dengan `=`; nama memakai snake_case, peka huruf besar-kecil, dan tidak boleh kata kunci atau diawali angka.',
      'Tipe dasar: `int` (tak terbatas), `float`, `str`, `bool`, `None`; `type()` memeriksa tipe.',
      'Tipe dinamis dan kuat: konversi harus eksplisit (`int()`, `float()`, `str()`).',
      '`int()` memotong, `round()` membulatkan; float tidak selalu eksak (`0.1 + 0.2`).',
    ],
    soal: [
      {
        tanya: 'Manakah nama variabel yang valid di Python?',
        benar: '`nilai_akhir`',
        salah: ['`2nilai`', '`class`', '`nilai akhir`'],
        jelas: 'Nama tidak boleh diawali angka, tidak boleh kata kunci (`class`), dan tidak boleh mengandung spasi.',
      },
      {
        tanya: 'Apa hasil `int(3.99)`?',
        benar: '3',
        salah: ['4', '3.99', 'Error'],
        jelas: '`int()` memotong bagian pecahan. Untuk membulatkan gunakan `round(3.99)` yang hasilnya 4.',
      },
      {
        tanya: 'Apa yang terjadi pada `"Umur: " + 20`?',
        benar: 'TypeError karena string dan integer tidak dapat disambung langsung',
        salah: ['Menghasilkan "Umur: 20"', 'Menghasilkan 20', 'Menghasilkan "Umur: " saja'],
        jelas: 'Python bertipe kuat dan tidak mengonversi diam-diam. Gunakan `str(20)` atau f-string.',
      },
      {
        tanya: 'Mengapa `0.1 + 0.2 == 0.3` bernilai False di Python?',
        benar: 'Float disimpan dalam biner sehingga 0.1 dan 0.2 hanya berupa pendekatan',
        salah: ['Python salah menghitung penjumlahan', 'Karena hasilnya selalu berupa string', 'Karena 0.3 bukan bilangan yang valid'],
        jelas: 'Banyak pecahan desimal tidak eksak di biner (IEEE 754). Bandingkan dengan toleransi atau `round`.',
      },
      {
        tanya: 'Apa nilai `type(None)`?',
        benar: '`NoneType`',
        salah: ['`int`', '`bool`', '`null`'],
        jelas: '`None` adalah satu-satunya nilai bertipe `NoneType`; Python tidak punya `null`.',
      },
    ],
  },

  'py-operator': {
    intisari: 'Python punya operator aritmetika (/ selalu float, // membulatkan ke bawah), perbandingan yang dapat berantai, dan logika dengan short-circuit.',
    rangkuman: [
      'Aritmetika: `+ - * / // % **`; `/` selalu float, `//` membulatkan **ke bawah**, `%` mengikuti tanda pembagi.',
      'Penugasan gabungan `+=`, `*=`, dll. (tidak ada `++`); `=` penugasan, `==` perbandingan.',
      'Perbandingan bisa berantai: `18 <= umur < 25`.',
      'Logika `and`, `or`, `not` dengan short-circuit; nilai falsy: `0`, `""`, `[]`, `{}`, `None`, `False`.',
    ],
    soal: [
      {
        tanya: 'Berapa hasil `-7 // 2` di Python?',
        benar: '-4',
        salah: ['-3', '-3.5', '3'],
        jelas: 'Pembagian bulat membulatkan ke bawah (menuju −∞), berbeda dengan C/Java yang memotong ke nol.',
      },
      {
        tanya: 'Berapa hasil `2 ** 3 ** 2`?',
        benar: '512',
        salah: ['64', '36', '81'],
        jelas: 'Operator pangkat dikerjakan dari kanan: 2 ** (3 ** 2) = 2 ** 9 = 512.',
      },
      {
        tanya: 'Nilai `x` setelah `x = 5; x += 2; x *= 3` adalah ...',
        benar: '21',
        salah: ['17', '11', '10'],
        jelas: 'x = 5, lalu 7, lalu 7 × 3 = 21.',
      },
      {
        tanya: 'Manakah yang bernilai falsy di Python?',
        benar: 'List kosong `[]`',
        salah: ['String `"0"`', 'List `[0]`', 'Angka `-1`'],
        jelas: 'Koleksi kosong adalah falsy. `"0"` (string tak kosong), `[0]`, dan `-1` semuanya truthy.',
      },
      {
        tanya: 'Apa hasil `7 / 2` dan `7 // 2`?',
        benar: '3.5 dan 3',
        salah: ['3 dan 3', '3.5 dan 3.5', '3 dan 3.5'],
        jelas: '`/` selalu menghasilkan float; `//` menghasilkan hasil bagi bulat.',
      },
    ],
  },

  'py-string': {
    intisari: 'String adalah deretan karakter yang immutable; diakses dengan indeks dan slicing, diproses dengan method, dan disisipi nilai lewat f-string.',
    rangkuman: [
      'Indeks mulai dari 0, negatif dari belakang; slicing `[mulai:akhir:langkah]` (akhir tidak termasuk); `[::-1]` membalik.',
      'String **immutable**: method seperti `upper`, `strip`, `replace` mengembalikan string baru.',
      'Method penting: `split`, `join`, `find`, `count`, `startswith`, `endswith`, `isdigit`.',
      '**f-string** (`f"{x:.2f}"`) adalah cara utama menyisipkan dan memformat nilai.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `"python"[1:4]`?',
        benar: '`yth`',
        salah: ['`pyth`', '`ytho`', '`yt`'],
        jelas: 'Indeks 1, 2, 3 (akhir 4 tidak termasuk): y, t, h.',
      },
      {
        tanya: 'Apa hasil `"python"[::-1]`?',
        benar: '`nohtyp`',
        salah: ['`python`', '`pytho`', '`ohtyp`'],
        jelas: 'Langkah −1 menelusuri dari belakang sehingga string terbalik.',
      },
      {
        tanya: 'Apa yang terjadi pada `kata = "halo"; kata[0] = "H"`?',
        benar: 'TypeError karena string tidak dapat diubah (immutable)',
        salah: ['kata menjadi "Halo"', 'kata menjadi "H"', 'Tidak terjadi apa-apa'],
        jelas: 'Karakter string tidak bisa ditimpa; buat string baru, misalnya `"H" + kata[1:]`.',
      },
      {
        tanya: 'Apa hasil `"a,b,c".split(",")`?',
        benar: '`["a", "b", "c"]`',
        salah: ['`"abc"`', '`("a", "b", "c")`', '`"a b c"`'],
        jelas: '`split` memecah string menjadi list. Kebalikannya adalah `",".join(...)`.',
      },
      {
        tanya: 'Apa keluaran `print(f"{3.14159:.2f}")`?',
        benar: '3.14',
        salah: ['3.1', '3.142', '3.14159'],
        jelas: 'Spesifikasi `.2f` menampilkan float dengan dua angka desimal.',
      },
    ],
  },

  'py-input-output': {
    intisari: 'input() membaca satu baris dan selalu mengembalikan string, sehingga perlu dikonversi bila butuh angka; print() dapat diatur lewat sep dan end.',
    rangkuman: [
      '`print(..., sep=..., end=...)` mengatur pemisah dan akhir cetakan.',
      '`input(pesan)` selalu mengembalikan **string**; ubah dengan `int()`/`float()` bila butuh angka.',
      'Pola dasar program: **masukan → proses → keluaran**.',
      'Masukan tidak valid (`int("abc")`) memicu `ValueError` yang ditangani dengan `try/except`.',
    ],
    soal: [
      {
        tanya: 'Pengguna mengetik 3 dan 4 pada `a = input(); b = input(); print(a + b)`. Apa keluarannya?',
        benar: '34',
        salah: ['7', '3 4', 'Error'],
        jelas: '`input()` mengembalikan string, jadi `+` menyambung teks: "3" + "4" = "34".',
      },
      {
        tanya: 'Apa keluaran `print("a", "b", sep="-")`?',
        benar: 'a-b',
        salah: ['a b', 'a,b', 'ab-'],
        jelas: 'Parameter `sep` mengganti pemisah bawaan (spasi) antar-argumen.',
      },
      {
        tanya: 'Apa keluaran dua perintah `print("Halo", end="!")` lalu `print("Dunia")`?',
        benar: 'Halo!Dunia',
        salah: ['Halo! Dunia', 'Halo\\nDunia', 'Halo!\\nDunia'],
        jelas: '`end="!"` mengganti baris baru dengan tanda seru, sehingga cetakan berikutnya menyambung di baris yang sama.',
      },
      {
        tanya: 'Cara yang benar membaca umur sebagai angka bulat adalah ...',
        benar: '`umur = int(input("Umur: "))`',
        salah: ['`umur = input(int("Umur: "))`', '`umur = input("Umur: ") + 0`', '`umur = number(input())`'],
        jelas: 'Bungkus hasil `input()` dengan `int()` untuk mengubah string menjadi bilangan bulat.',
      },
    ],
  },

  'py-percabangan': {
    intisari: 'if/elif/else memilih blok berdasarkan kondisi dan hanya blok pertama yang benar yang dijalankan; ternary dan match menyediakan bentuk ringkas.',
    rangkuman: [
      '`if`/`elif`/`else` memilih blok berdasarkan kondisi; blok pertama yang benar dijalankan; **urutan** penting.',
      'Gabungkan kondisi dengan `and`, `or`, `not`; nilai kosong dianggap falsy.',
      'Ekspresi ternary: `a if kondisi else b`.',
      '`match`/`case` (3.10+) mencocokkan pola; `_` adalah kasus bawaan.',
    ],
    soal: [
      {
        tanya: 'Untuk `nilai = 78` dengan rantai `if nilai >= 85: "A" / elif nilai >= 75: "B" / elif nilai >= 60: "C" / else: "D"`, apa hasilnya?',
        benar: 'B',
        salah: ['A', 'C', 'D'],
        jelas: '78 tidak memenuhi `>= 85` tetapi memenuhi `>= 75`, sehingga blok B dijalankan dan sisanya dilewati.',
      },
      {
        tanya: 'Apa hasil `"genap" if 7 % 2 == 0 else "ganjil"`?',
        benar: '"ganjil"',
        salah: ['"genap"', '7', 'Error sintaks'],
        jelas: '7 % 2 = 1, kondisi salah sehingga nilai setelah `else` dipakai.',
      },
      {
        tanya: 'Mengapa `if x = 5:` menimbulkan galat?',
        benar: '`=` adalah penugasan; perbandingan harus memakai `==`',
        salah: ['Karena x tidak boleh bernilai 5', 'Karena `if` tidak mengizinkan angka', 'Karena harus memakai tanda kurung kurawal'],
        jelas: 'Penugasan tidak boleh berada pada kondisi `if`. Tertukarnya `=` dan `==` adalah bug klasik.',
      },
      {
        tanya: 'Pada `match`, kasus `case _:` berfungsi sebagai ...',
        benar: 'Kasus bawaan yang cocok dengan nilai apa pun',
        salah: ['Kasus yang hanya cocok dengan garis bawah', 'Penanda akhir `match`', 'Pemanggilan fungsi bernama `_`'],
        jelas: 'Wildcard `_` menangkap semua yang tidak cocok dengan kasus sebelumnya, mirip `default` pada switch.',
      },
    ],
  },

  'py-perulangan': {
    intisari: 'for menelusuri koleksi (range menghasilkan angka dengan batas akhir tidak termasuk), while mengulang selama kondisi benar, dan break/continue/else mengatur alur loop.',
    rangkuman: [
      '`for` menelusuri koleksi; `range(mulai, akhir, langkah)` menghasilkan angka (akhir **tidak** termasuk); `enumerate` memberi indeks.',
      '`while` mengulang selama kondisi benar: pastikan kondisi akhirnya menjadi salah.',
      '`break` keluar dari loop, `continue` melewati iterasi; `else` pada loop berjalan bila tidak ada `break`.',
      'Loop bersarang mengalikan jumlah iterasi; waspadai off-by-one dan loop tak berujung.',
    ],
    soal: [
      {
        tanya: 'Apa hasil `list(range(2, 11, 3))`?',
        benar: '`[2, 5, 8]`',
        salah: ['`[2, 5, 8, 11]`', '`[3, 6, 9]`', '`[2, 4, 6, 8, 10]`'],
        jelas: 'Mulai 2, langkah 3: 2, 5, 8, lalu 11 tidak dimasukkan karena batas akhir 11 tidak termasuk.',
      },
      {
        tanya: 'Nilai terakhir yang dihasilkan `range(5)` adalah ...',
        benar: '4',
        salah: ['5', '0', '6'],
        jelas: '`range(5)` menghasilkan 0, 1, 2, 3, 4.',
      },
      {
        tanya: 'Apa fungsi `continue` di dalam loop?',
        benar: 'Melewati sisa iterasi saat ini dan lanjut ke iterasi berikutnya',
        salah: ['Menghentikan seluruh loop', 'Mengulang loop dari awal', 'Menutup program'],
        jelas: '`break` yang menghentikan loop; `continue` hanya melompati iterasi sekarang.',
      },
      {
        tanya: 'Kapan blok `else` pada sebuah loop `for` dijalankan?',
        benar: 'Ketika loop selesai tanpa pernah terkena `break`',
        salah: ['Setiap kali ada iterasi', 'Hanya ketika terjadi error', 'Ketika loop berhenti karena `break`'],
        jelas: 'Cocok untuk pencarian: `else` berarti "tidak ditemukan".',
      },
      {
        tanya: 'Berapa hasil `sum(range(1, 101))`?',
        benar: '5050',
        salah: ['5000', '5151', '4950'],
        jelas: 'Jumlah 1 sampai 100 = 100 × 101 / 2 = 5050 (batas 101 tidak termasuk).',
      },
    ],
  },
};
