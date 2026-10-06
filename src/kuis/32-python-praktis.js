// Python, Bab 6 — Python di Dunia Nyata. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-venv-pip': {
    intisari: 'pip memasang paket dari PyPI, dan virtual environment memberi tiap proyek kebergantungan yang terpisah; requirements.txt mencatat paket dan versinya.',
    rangkuman: [
      '**pip** memasang paket dari PyPI; gunakan `python -m pip ...`.',
      '**Virtual environment** (`python -m venv .venv`, lalu aktifkan) memberi tiap proyek kebergantungan terpisah.',
      '`pip freeze > requirements.txt` mencatat paket; `pip install -r requirements.txt` memasangnya lagi.',
      'Jangan meng-commit `.venv/`; cantumkan di `.gitignore`.',
    ],
    soal: [
      {
        tanya: 'Apa tujuan utama virtual environment?',
        benar: 'Memisahkan kebergantungan (versi pustaka) antarproyek',
        salah: ['Membuat Python berjalan lebih cepat', 'Mengompilasi kode menjadi .exe', 'Menyimpan kode ke cloud'],
        jelas: 'Tiap proyek punya paket sendiri sehingga versi yang berbeda tidak saling merusak.',
      },
      {
        tanya: 'Perintah yang membuat virtual environment bernama `.venv` adalah ...',
        benar: '`python -m venv .venv`',
        salah: ['`pip install venv .venv`', '`python venv --create`', '`git venv .venv`'],
        jelas: '`venv` adalah modul bawaan Python yang dijalankan dengan `python -m venv`.',
      },
      {
        tanya: 'Untuk apa `pip freeze > requirements.txt` dipakai?',
        benar: 'Mencatat daftar paket beserta versinya agar lingkungan bisa dibuat ulang',
        salah: ['Membekukan komputer sampai pip selesai', 'Menghapus semua paket', 'Mengunci Python pada satu versi selamanya'],
        jelas: 'Berkas itu kemudian dipasang dengan `pip install -r requirements.txt`.',
      },
      {
        tanya: 'Mengapa folder `.venv/` sebaiknya dimasukkan ke `.gitignore`?',
        benar: 'Isinya besar dan dapat dibuat ulang dari requirements.txt',
        salah: ['Karena berisi kode sumber rahasia perusahaan', 'Karena Git tidak bisa menyimpan folder', 'Karena .venv hanya berfungsi di komputer yang membuatnya sehingga Git menolaknya'],
        jelas: 'Yang dibagikan cukup daftar kebergantungan; setiap orang membuat lingkungannya sendiri.',
      },
    ],
  },

  'py-script-cli': {
    intisari: 'Skrip command-line menerima argumen lewat sys.argv atau argparse, yang memberi opsi, nilai bawaan, dan --help otomatis; pola main() dan kode keluar membuatnya rapi dan dapat diuji.',
    rangkuman: [
      '`sys.argv` berisi argumen command-line mentah (semua string; elemen pertama nama skrip).',
      '`argparse`: argumen posisional, opsi (`--x`), flag (`store_true`), `type`, `choices`, `nargs`, serta `--help` otomatis.',
      'Pola baik: fungsi logika terpisah + `main(argumen=None)` + `if __name__ == "__main__":`.',
      '**Kode keluar** 0 = sukses, selain itu gagal (`sys.exit(1)`); pesan galat ke `stderr`.',
    ],
    soal: [
      {
        tanya: 'Jika dijalankan `python sapa.py Budi`, apa isi `sys.argv`?',
        benar: '`["sapa.py", "Budi"]`',
        salah: ['`["Budi"]`', '`["python", "sapa.py", "Budi"]`', '`["sapa.py"]`'],
        jelas: 'Elemen pertama adalah nama skrip, sisanya argumen yang diketik, semuanya string.',
      },
      {
        tanya: 'Apa fungsi `action="store_true"` pada `add_argument("--verbose", ...)`?',
        benar: 'Membuat flag yang bernilai True bila diberikan dan False bila tidak',
        salah: ['Menyimpan nilai ke berkas', 'Mewajibkan pengguna mengetik "true"', 'Membuat argumen berupa list'],
        jelas: 'Flag adalah saklar tanpa nilai: cukup menulis `--verbose`.',
      },
      {
        tanya: 'Kode keluar (exit code) berapa yang lazim berarti program berhasil?',
        benar: '0',
        salah: ['1', '-1', '255'],
        jelas: 'Konvensi shell: 0 sukses, selain itu gagal. `sys.exit(1)` menandakan galat.',
      },
      {
        tanya: 'Mengapa fungsi `main(argumen=None)` dengan `parse_args(argumen)` berguna?',
        benar: 'Dapat dipanggil dengan daftar argumen langsung sehingga mudah diuji tanpa terminal',
        salah: ['Agar skrip otomatis berjalan di semua OS', 'Agar tidak perlu memakai argparse', 'Agar argumen disimpan permanen'],
        jelas: 'Jika `argumen` adalah None, argparse membaca `sys.argv`; selain itu memakai daftar yang diberikan.',
      },
    ],
  },

  'py-regex': {
    intisari: 'Regex mendeskripsikan pola teks; modul re menyediakan search, match, fullmatch, findall, sub, dan split, dan pola ditulis sebagai raw string.',
    rangkuman: [
      'Regex dipakai lewat modul `re` dengan **raw string** (`r"..."`).',
      '`search` (di mana saja), `match` (awal), `fullmatch` (seluruh teks), `findall`/`finditer`, `sub`, `split`, `compile`.',
      'Elemen: kelas karakter (`\\d \\w \\s [a-z]`), kuantifier (`* + ? {n,m}`), jangkar (`^ $ \\b`), pilihan (`|`), grup (`( )`).',
      'Kuantifier serakah secara bawaan; `?` membuatnya non-greedy.',
      'Jangan memakai regex untuk menguraikan HTML/JSON; waspadai pola yang lambat (ReDoS).',
    ],
    soal: [
      {
        tanya: 'Apa hasil `re.findall(r"\\d+", "a12b345")`?',
        benar: '`["12", "345"]`',
        salah: ['`["1", "2", "3", "4", "5"]`', '`["a12b345"]`', '`["12345"]`'],
        jelas: '`\\d+` mengambil urutan satu digit atau lebih, sehingga dua kelompok angka ditemukan.',
      },
      {
        tanya: 'Perbedaan `re.search` dan `re.fullmatch` adalah ...',
        benar: '`search` mencari pola di mana saja, `fullmatch` mewajibkan seluruh teks cocok',
        salah: ['`search` hanya untuk angka', '`fullmatch` mencari dari belakang', 'Keduanya persis sama'],
        jelas: 'Untuk validasi format gunakan `fullmatch`; untuk mencari potongan gunakan `search`.',
      },
      {
        tanya: 'Apa hasil `re.sub(r"\\d", "#", "PIN 4821")`?',
        benar: '`PIN ####`',
        salah: ['`#### 4821`', '`PIN 4821`', '`PIN #`'],
        jelas: '`sub` mengganti setiap digit dengan "#".',
      },
      {
        tanya: 'Apa hasil `re.findall(r"<.+?>", "<b>x</b>")`?',
        benar: '`["<b>", "</b>"]`',
        salah: ['`["<b>x</b>"]`', '`["x"]`', '`[]`'],
        jelas: 'Tanda `?` membuat `.+` non-greedy sehingga berhenti pada `>` pertama, bukan menelan seluruh teks.',
      },
      {
        tanya: 'Mengapa pola regex sebaiknya ditulis sebagai raw string `r"..."`?',
        benar: 'Agar garis miring terbalik (seperti `\\d`) tidak diproses oleh Python sebagai escape',
        salah: ['Agar pola dijalankan lebih cepat', 'Agar regex bisa memakai huruf Unicode', 'Raw string wajib untuk semua string'],
        jelas: 'Tanpa awalan r, `"\\d"` bisa menimbulkan peringatan karena Python menafsirkan escape-nya lebih dulu.',
      },
    ],
  },

  'py-testing': {
    intisari: 'Tes otomatis memeriksa kode dengan masukan yang diketahui; unittest, doctest, dan pytest membantu menangkap regresi, dan TDD menulis tes lebih dulu.',
    rangkuman: [
      '`assert` untuk pengecekan cepat; **unittest** untuk suite terstruktur; **doctest** untuk contoh di docstring; **pytest** untuk tes berupa fungsi biasa.',
      'Tes yang baik: cepat, independen, menguji satu hal, mencakup kasus normal/tepi/galat, dan deterministik.',
      '**TDD**: merah → hijau → refaktor.',
      '**Coverage** menunjukkan bagian kode yang belum teruji.',
    ],
    soal: [
      {
        tanya: 'Method pada `unittest.TestCase` dikenali sebagai tes bila namanya diawali ...',
        benar: '`test_`',
        salah: ['`check_`', '`run_`', '`assert_`'],
        jelas: 'Loader unittest mengumpulkan method berawalan `test`.',
      },
      {
        tanya: 'Manakah cara menguji bahwa sebuah fungsi melempar `ValueError`?',
        benar: '`with self.assertRaises(ValueError): fungsi(...)`',
        salah: ['`self.assertEqual(fungsi(...), ValueError)`', '`self.assertTrue(ValueError)`', '`try: fungsi(...)` tanpa except'],
        jelas: '`assertRaises` lolos bila blok melempar exception yang disebut.',
      },
      {
        tanya: 'Urutan siklus TDD yang benar adalah ...',
        benar: 'Tes gagal (merah) → kode secukupnya agar lolos (hijau) → refaktor',
        salah: ['Tulis kode dulu → tes belakangan', 'Refaktor → tes → kode', 'Hijau → merah → hijau tanpa kode'],
        jelas: 'TDD menulis tes lebih dulu, memastikan tes gagal, lalu membuatnya lolos dan merapikan kode.',
      },
      {
        tanya: 'Mengapa tes sebaiknya independen satu sama lain?',
        benar: 'Agar hasil tidak bergantung pada urutan eksekusi dan mudah menemukan penyebab kegagalan',
        salah: ['Agar program lebih pendek', 'Agar tes tidak perlu dijalankan', 'Agar semua tes memakai satu variabel global'],
        jelas: '`setUp` membuat data baru untuk tiap tes supaya tes tidak saling memengaruhi.',
      },
    ],
  },

  'py-numpy-pandas': {
    intisari: 'NumPy menyediakan array cepat dengan operasi vektor, pandas menyediakan DataFrame untuk data tabel, dan matplotlib membuat grafik; ketiganya cepat karena ditulis dalam C.',
    rangkuman: [
      '**NumPy**: array homogen dengan operasi vektor yang cepat; `shape`, indeks 2D, `axis`, dan *boolean masking*.',
      '**pandas**: `DataFrame`/`Series`; saring (`df[df["x"] > 5]`), kolom baru, `sort_values`, `groupby`, `describe`, `read_csv`.',
      '**matplotlib**: `plt.plot`, `bar`, `hist`, lalu `plt.show()`; pandas punya `df.plot(...)`.',
      'Alur data: muat → bersihkan → jelajahi → analisis → sampaikan (sering di notebook).',
    ],
    soal: [
      {
        tanya: 'Apa hasil `np.array([1, 2, 3]) * 2`?',
        benar: '`array([2, 4, 6])`',
        salah: ['`[1, 2, 3, 1, 2, 3]`', '`array([1, 2, 3, 2])`', 'TypeError'],
        jelas: 'Array NumPy menerapkan operasi per elemen. List biasa `[1, 2, 3] * 2` justru menggandakan isinya.',
      },
      {
        tanya: 'Apa fungsi `nilai[nilai >= 60]` pada array NumPy `nilai`?',
        benar: 'Mengambil hanya elemen yang bernilai minimal 60 (boolean masking)',
        salah: ['Mengubah semua elemen menjadi 60', 'Menghapus array dari memori', 'Mengurutkan array dari terbesar'],
        jelas: 'Ekspresi `nilai >= 60` menghasilkan array True/False yang dipakai sebagai penyaring indeks.',
      },
      {
        tanya: 'Untuk apa `df.groupby("jurusan")["nilai"].mean()` dipakai?',
        benar: 'Menghitung rata-rata nilai untuk setiap jurusan',
        salah: ['Mengurutkan jurusan secara abjad saja', 'Menghapus kolom nilai', 'Menyimpan df ke berkas CSV'],
        jelas: '`groupby` mengelompokkan baris berdasarkan kolom, lalu `mean` merangkum tiap kelompok.',
      },
      {
        tanya: 'Mengapa NumPy jauh lebih cepat daripada loop Python biasa untuk menghitung array besar?',
        benar: 'Operasinya ditulis dalam C pada memori yang rapat dan berlaku sekaligus ke seluruh elemen',
        salah: ['NumPy mengabaikan sebagian data', 'NumPy memakai koneksi internet', 'NumPy mengubah Python menjadi bahasa lain'],
        jelas: 'Operasi vektor menghindari beban interpreter per elemen dan memanfaatkan SIMD di kode C.',
      },
    ],
  },
};
