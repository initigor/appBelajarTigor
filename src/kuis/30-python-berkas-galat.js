// Python, Bab 4 — Berkas & Penanganan Galat. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-exception': {
    intisari: 'try/except menangani exception tanpa menghentikan program; tangkap jenis yang spesifik, gunakan finally untuk pembersihan, dan raise untuk melempar galat sendiri.',
    rangkuman: [
      '`try`/`except` menangani exception; `else` bila tidak ada galat; `finally` selalu dijalankan.',
      'Tangkap exception yang **spesifik** (`except ValueError as e`), jangan `except:` kosong.',
      '`raise` melempar exception; buat exception sendiri dengan mewarisi `Exception`.',
      'Gaya Python **EAFP**: coba dulu, tangani galatnya.',
    ],
    soal: [
      {
        tanya: 'Exception apa yang muncul dari `int("abc")`?',
        benar: 'ValueError',
        salah: ['TypeError', 'KeyError', 'IndexError'],
        jelas: 'Tipe argumen benar (string), tetapi isinya tidak bisa diubah menjadi bilangan bulat.',
      },
      {
        tanya: 'Kapan blok `finally` dijalankan?',
        benar: 'Selalu, baik terjadi exception maupun tidak',
        salah: ['Hanya bila terjadi exception', 'Hanya bila tidak terjadi exception', 'Hanya bila program berhasil mencetak sesuatu'],
        jelas: '`finally` dipakai untuk pembersihan seperti menutup berkas atau koneksi.',
      },
      {
        tanya: 'Mengapa `except:` kosong (menangkap semuanya) sebaiknya dihindari?',
        benar: 'Ia menelan semua galat, termasuk bug yang seharusnya terlihat',
        salah: ['Karena tidak diizinkan oleh Python', 'Karena membuat program lebih lambat dua kali lipat', 'Karena hanya bisa dipakai di dalam fungsi'],
        jelas: 'Menangkap semuanya menyembunyikan penyebab masalah. Tangkap jenis yang spesifik yang memang kamu tahu cara menanganinya.',
      },
      {
        tanya: 'Gaya EAFP ("Easier to Ask Forgiveness than Permission") berarti ...',
        benar: 'Mencoba operasi langsung lalu menangani galat bila terjadi',
        salah: ['Memeriksa semua kemungkinan sebelum mencoba', 'Tidak pernah menangani galat', 'Menulis kode tanpa fungsi'],
        jelas: 'Contohnya `try: x = data["k"] except KeyError: ...` alih-alih `if "k" in data`.',
      },
      {
        tanya: 'Bagaimana melempar galat sendiri bila daftar nilai kosong?',
        benar: '`raise ValueError("daftar nilai tidak boleh kosong")`',
        salah: ['`throw ValueError("...")`', '`error("daftar nilai tidak boleh kosong")`', '`return ValueError`'],
        jelas: 'Python memakai `raise`, bukan `throw` seperti Java/JavaScript.',
      },
    ],
  },

  'py-file': {
    intisari: 'Berkas dibuka dengan open() dan sebaiknya selalu memakai with agar tertutup otomatis; mode w menimpa isi, a menambah, dan membaca per baris hemat memori.',
    rangkuman: [
      '`open(nama, mode)`; mode `"r"` baca, `"w"` tulis (menimpa), `"a"` tambah, `"b"` biner.',
      '**Selalu pakai `with`** agar berkas ditutup otomatis; sebutkan `encoding="utf-8"`.',
      'Baca dengan `read()`, `readline()`, `readlines()`, atau menelusuri objek berkas baris demi baris (hemat memori).',
      '`write` tidak menambah baris baru otomatis; tangani `FileNotFoundError`; `pathlib.Path` untuk jalur yang rapi.',
    ],
    soal: [
      {
        tanya: 'Mode `open()` manakah yang menambah isi di akhir berkas tanpa menghapus isi lama?',
        benar: '`"a"`',
        salah: ['`"w"`', '`"r"`', '`"x"`'],
        jelas: '`"w"` menimpa seluruh isi, `"r"` hanya membaca, `"x"` gagal bila berkas sudah ada.',
      },
      {
        tanya: 'Apa keuntungan memakai `with open(...) as f:`?',
        benar: 'Berkas ditutup otomatis, bahkan bila terjadi galat',
        salah: ['Berkas dienkripsi otomatis', 'Berkas dibaca dua kali lebih cepat', 'Berkas dapat dibuka tanpa nama'],
        jelas: '`with` menjamin pembersihan seperti blok try/finally, tetapi lebih ringkas.',
      },
      {
        tanya: 'Apa akibat membuka berkas yang sudah berisi data dengan mode `"w"`?',
        benar: 'Isi lama terhapus dan diganti dengan yang baru ditulis',
        salah: ['Data baru ditambahkan di akhir', 'Terjadi galat selalu', 'Berkas dibuka hanya untuk dibaca'],
        jelas: 'Mode tulis memotong berkas menjadi kosong. Gunakan `"a"` untuk menambah.',
      },
      {
        tanya: 'Cara paling hemat memori untuk memproses berkas teks yang sangat besar adalah ...',
        benar: 'Menelusuri objek berkas dengan `for baris in f:`',
        salah: ['Memanggil `f.read()` lalu memecah semuanya', 'Menyalin berkas ke list besar dulu', 'Membuka berkas berkali-kali'],
        jelas: 'Menelusuri objek berkas membaca satu baris pada satu waktu.',
      },
    ],
  },

  'py-json-csv': {
    intisari: 'JSON menyimpan data bersarang (object↔dict, array↔list), sedangkan CSV menyimpan tabel teks yang dibaca dengan modul csv, bukan split(",").',
    rangkuman: [
      '**JSON**: `json.loads`/`dumps` untuk teks, `json.load`/`dump` untuk berkas; `indent` merapikan.',
      'Padanan: object↔dict, array↔list, `true/false/null`↔`True/False/None`.',
      '**CSV**: gunakan `csv.DictReader`/`DictWriter` (bukan `split(",")`), buka dengan `newline=""`; semua nilai dibaca sebagai string.',
      'JSON cocok untuk API/konfigurasi, CSV untuk data tabel dan spreadsheet.',
    ],
    soal: [
      {
        tanya: 'Fungsi mana yang mengubah **teks JSON** menjadi objek Python?',
        benar: '`json.loads()`',
        salah: ['`json.dumps()`', '`json.dump()`', '`json.parse()`'],
        jelas: '`loads` = load string. `dumps` mengubah objek menjadi teks, dan `load`/`dump` bekerja dengan objek berkas.',
      },
      {
        tanya: 'Padanan `null` pada JSON di Python adalah ...',
        benar: '`None`',
        salah: ['`0`', '`""`', '`False`'],
        jelas: 'JSON `null` menjadi `None`; `true`/`false` menjadi `True`/`False`.',
      },
      {
        tanya: 'Tipe apa yang dihasilkan `csv.DictReader` untuk nilai kolom angka seperti `85`?',
        benar: 'String ("85")',
        salah: ['int', 'float', 'bool'],
        jelas: 'CSV tidak menyimpan tipe: semua dibaca sebagai string dan harus diubah sendiri dengan `int()`/`float()`.',
      },
      {
        tanya: 'Mengapa memecah baris CSV dengan `split(",")` berisiko?',
        benar: 'Data bisa berisi koma di dalam tanda kutip sehingga terpecah salah',
        salah: ['Karena `split` tidak bisa dipakai pada string', 'Karena CSV tidak menggunakan koma sama sekali', 'Karena `split` hanya bekerja untuk angka'],
        jelas: 'Modul `csv` memahami aturan kutip, misalnya `"Jakarta, Indonesia"` sebagai satu kolom.',
      },
    ],
  },
};
