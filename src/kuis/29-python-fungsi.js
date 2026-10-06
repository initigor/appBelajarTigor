// Python, Bab 3 — Fungsi & Modul. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-fungsi': {
    intisari: 'Fungsi didefinisikan dengan def dan dijalankan saat dipanggil; return menghasilkan nilai, sedangkan print hanya menampilkan.',
    rangkuman: [
      '`def nama(parameter):` mendefinisikan fungsi; memanggilnya dengan `nama(argumen)`.',
      '`return` menghasilkan nilai dan menghentikan fungsi; tanpa `return` hasilnya `None`; beberapa nilai dikembalikan sebagai tuple.',
      '**Docstring** menjelaskan fungsi; **type hint** bersifat opsional.',
      'Fungsi adalah objek: bisa disimpan, dikirim, dan dikembalikan.',
    ],
    soal: [
      {
        tanya: 'Apa nilai yang dikembalikan fungsi yang tidak memiliki pernyataan `return`?',
        benar: '`None`',
        salah: ['0', 'String kosong', 'Error saat dipanggil'],
        jelas: 'Fungsi tanpa return mengembalikan None secara otomatis.',
      },
      {
        tanya: 'Apa perbedaan `print(x)` dan `return x` di dalam fungsi?',
        benar: '`print` hanya menampilkan ke layar, `return` menghasilkan nilai yang bisa dipakai lagi',
        salah: ['Keduanya sama persis', '`return` menampilkan ke layar, `print` menyimpan nilai', '`print` menghentikan fungsi, `return` tidak'],
        jelas: 'Nilai dari `return` bisa disimpan atau dipakai dalam ekspresi; hasil `print` hanyalah teks di layar.',
      },
      {
        tanya: 'Apa tipe hasil `def f(): return 1, 2` lalu `type(f())`?',
        benar: '`tuple`',
        salah: ['`list`', '`int`', '`set`'],
        jelas: 'Mengembalikan beberapa nilai sebenarnya mengembalikan tuple yang bisa di-unpack.',
      },
      {
        tanya: 'Apa perbedaan `sapa` dan `sapa()` pada fungsi bernama `sapa`?',
        benar: '`sapa` adalah objek fungsinya, `sapa()` menjalankannya',
        salah: ['Keduanya menjalankan fungsi', '`sapa()` hanya mendefinisikan fungsi', 'Tidak ada perbedaan'],
        jelas: 'Tanda kurung memanggil fungsi. Tanpa kurung kamu hanya merujuk ke objek fungsinya.',
      },
    ],
  },

  'py-parameter': {
    intisari: 'Python mendukung argumen posisional, keyword, nilai bawaan, *args dan **kwargs; default yang mutable adalah jebakan klasik.',
    rangkuman: [
      'Argumen bisa **posisional** atau **keyword**; parameter berdefault harus setelah yang tidak berdefault.',
      '**Jangan** memakai list/dict sebagai nilai bawaan; pakai `None` lalu buat baru di dalam fungsi.',
      '`*args` mengumpulkan posisional ekstra (tuple), `**kwargs` mengumpulkan keyword ekstra (dict).',
      '`*` dan `**` saat memanggil membongkar list/dict menjadi argumen.',
    ],
    soal: [
      {
        tanya: 'Mengapa `def tambah(x, hasil=[])` berbahaya?',
        benar: 'List default dibuat sekali dan dibagi antar-pemanggilan',
        salah: ['Karena list tidak boleh menjadi parameter', 'Karena `hasil` selalu bernilai None', 'Karena Python melarang nilai bawaan'],
        jelas: 'Nilai bawaan dievaluasi sekali saat definisi. Gunakan `hasil=None` lalu buat list baru di dalam fungsi.',
      },
      {
        tanya: 'Dalam `def f(*angka)`, apa tipe `angka` di dalam fungsi?',
        benar: 'tuple',
        salah: ['list', 'dict', 'set'],
        jelas: '`*args` mengumpulkan argumen posisional ekstra menjadi tuple.',
      },
      {
        tanya: 'Dalam `def f(**info)`, `f(a=1, b=2)` membuat `info` berisi ...',
        benar: '`{"a": 1, "b": 2}`',
        salah: ['`(1, 2)`', '`["a", "b"]`', '`{1, 2}`'],
        jelas: '`**kwargs` mengumpulkan argumen keyword menjadi dict.',
      },
      {
        tanya: 'Apa kegunaan `volume(*[2, 3, 4])` pada `def volume(p, l, t)`?',
        benar: 'Membongkar list menjadi tiga argumen posisional',
        salah: ['Mengalikan seluruh isi list dengan 2 lalu mengirim hasilnya sebagai satu argumen', 'Menghapus elemen list', 'Membuat list baru berisi tiga fungsi'],
        jelas: 'Tanda `*` saat memanggil membongkar iterable menjadi argumen, setara `volume(2, 3, 4)`.',
      },
    ],
  },

  'py-scope-lambda': {
    intisari: 'Python mencari nama dengan aturan LEGB; lambda adalah fungsi anonim satu ekspresi, closure mengingat variabel pembungkus, dan decorator membungkus fungsi.',
    rangkuman: [
      '**Scope** mengikuti aturan **LEGB** (Local, Enclosing, Global, Built-in).',
      '**lambda**: fungsi anonim satu ekspresi, terutama untuk `key=` pada `sorted`/`max`/`min`.',
      '**Closure**: fungsi dalam yang mengingat variabel pembungkusnya.',
      '**Decorator** (`@nama`) membungkus fungsi; `@catat` di atas `def f` setara `f = catat(f)`.',
    ],
    soal: [
      {
        tanya: 'Singkatan LEGB menggambarkan urutan pencarian nama. Apa urutannya?',
        benar: 'Local, Enclosing, Global, Built-in',
        salah: ['Global, Local, Built-in, Enclosing', 'Built-in, Global, Enclosing, Local', 'Local, Global, Enclosing, Built-in'],
        jelas: 'Python mencari di fungsi saat ini, fungsi pembungkus, tingkat modul, lalu nama bawaan.',
      },
      {
        tanya: 'Apa hasil `pembuat_pengali(3)(7)` jika `def pembuat_pengali(f): def kali(x): return x * f; return kali`?',
        benar: '21',
        salah: ['10', '3', '7'],
        jelas: 'Fungsi `kali` mengingat `f = 3` (closure), sehingga 7 × 3 = 21.',
      },
      {
        tanya: 'Mengapa `total += n` di dalam fungsi bisa memicu `UnboundLocalError` bila `total` didefinisikan di luar fungsi?',
        benar: 'Penugasan menjadikan `total` variabel lokal yang belum diberi nilai',
        salah: ['Karena `+=` tidak boleh dipakai di fungsi', 'Karena total harus bertipe string', 'Karena lambda tidak ada'],
        jelas: 'Python menganggap nama yang ditugasi di dalam fungsi sebagai lokal. Gunakan `global`/`nonlocal` atau kirim sebagai parameter.',
      },
      {
        tanya: 'Penulisan `@catat` di atas `def tambah(...)` setara dengan ...',
        benar: '`tambah = catat(tambah)`',
        salah: ['`catat = tambah(catat)`', '`tambah()` dipanggil dua kali', '`del tambah`'],
        jelas: 'Decorator menerima fungsi dan mengembalikan fungsi pengganti.',
      },
      {
        tanya: 'Lambda cocok dipakai untuk ...',
        benar: 'Fungsi kecil satu ekspresi, misalnya `key=lambda m: m[1]`',
        salah: ['Fungsi dengan banyak baris dan loop', 'Mendefinisikan kelas', 'Mengimpor modul'],
        jelas: 'Lambda hanya boleh satu ekspresi; logika yang lebih panjang sebaiknya memakai `def`.',
      },
    ],
  },

  'py-modul': {
    intisari: 'Setiap berkas .py adalah modul yang diimpor dengan import; pustaka standar menyediakan banyak alat siap pakai, dan nama berkas tidak boleh menimpa modul bawaan.',
    rangkuman: [
      '`import modul`, `from modul import nama`, `import modul as alias`; hindari `import *`.',
      'Setiap berkas `.py` adalah modul; **package** adalah folder berisi modul; Python mencari modul lewat `sys.path`.',
      'Pustaka standar yang penting: `math`, `random`, `datetime`, `collections`, `statistics`, `pathlib`, `itertools`, `functools`.',
      'Jangan menamai berkasmu sama dengan modul bawaan (mis. `random.py`).',
    ],
    soal: [
      {
        tanya: 'Apa manfaat `random.seed(42)`?',
        benar: 'Membuat urutan bilangan acak dapat diulang dengan hasil yang sama',
        salah: ['Membuat bilangan acak lebih besar', 'Menghentikan modul random', 'Mengunci Python pada versi 42'],
        jelas: 'Seed menentukan titik awal generator acak sehingga hasilnya deterministik, berguna untuk pengujian.',
      },
      {
        tanya: 'Mengapa berbahaya menamai berkasmu `random.py`?',
        benar: 'Python bisa mengimpor berkasmu alih-alih modul `random` bawaan',
        salah: ['Karena nama berkas tidak boleh berisi huruf kecil', 'Karena random hanya tersedia di Linux', 'Karena berkas akan terhapus otomatis'],
        jelas: 'Folder skrip dicari lebih dulu, sehingga berkasmu menimpa modul bawaan dan memunculkan galat membingungkan.',
      },
      {
        tanya: 'Apa kegunaan `if __name__ == "__main__":` di sebuah modul?',
        benar: 'Menjalankan blok hanya bila berkas dijalankan langsung, bukan saat diimpor',
        salah: ['Mencegah modul diimpor', 'Menghapus semua fungsi saat dijalankan', 'Mengganti nama modul menjadi main'],
        jelas: 'Berkas yang dijalankan langsung punya `__name__ == "__main__"`; saat diimpor `__name__` berisi nama modulnya.',
      },
      {
        tanya: 'Berapa hasil `(date(2026, 10, 7) - date(2026, 10, 1)).days` dengan `from datetime import date`?',
        benar: '6',
        salah: ['7', '5', '0'],
        jelas: 'Selisih dua objek `date` adalah `timedelta`; 7 − 1 = 6 hari.',
      },
    ],
  },

  'py-generator': {
    intisari: 'Generator (fungsi dengan yield) menghasilkan nilai satu per satu secara malas sehingga hemat memori, mendukung deret tak berujung, tetapi hanya bisa ditelusuri sekali.',
    rangkuman: [
      '**Iterable** punya `__iter__`; **iterator** menghasilkan elemen lewat `next()` sampai `StopIteration`.',
      '**Generator**: fungsi dengan `yield`; menjeda dan melanjutkan dengan state lokal utuh.',
      'Keunggulan: **hemat memori**, mendukung **deret tak berujung**, cocok untuk data besar dan **pipeline**.',
      'Generator hanya bisa ditelusuri **sekali**; `yield from` mendelegasikan.',
    ],
    soal: [
      {
        tanya: 'Apa yang dilakukan `yield` di dalam fungsi?',
        benar: 'Menghasilkan satu nilai lalu menjeda fungsi hingga nilai berikutnya diminta',
        salah: ['Mengakhiri fungsi sepenuhnya seperti return', 'Menghapus semua variabel lokal', 'Memanggil fungsi lain secara paralel'],
        jelas: 'Fungsi dengan `yield` menjadi generator; state-nya tersimpan di antara nilai-nilai yang dihasilkan.',
      },
      {
        tanya: 'Apa yang terjadi bila `next(it)` dipanggil pada iterator yang sudah habis?',
        benar: 'Muncul `StopIteration`',
        salah: ['Mengembalikan None', 'Mengulang dari elemen pertama', 'Mengembalikan list kosong'],
        jelas: 'Itulah cara iterator memberi tahu loop `for` bahwa tidak ada elemen lagi.',
      },
      {
        tanya: 'Mengapa generator cocok untuk memproses berkas yang sangat besar?',
        benar: 'Hanya satu elemen yang berada di memori pada satu waktu',
        salah: ['Generator mengompresi berkas otomatis', 'Generator menjalankan kode lebih cepat dari C', 'Generator mengubah berkas menjadi dict'],
        jelas: 'Evaluasi malas menghindari memuat seluruh data sekaligus.',
      },
      {
        tanya: 'Mengapa `list(islice(fibonacci(), 12))` dapat bekerja walau `fibonacci()` tak berujung?',
        benar: 'Generator menghasilkan nilai hanya saat diminta, dan islice berhenti setelah 12',
        salah: ['Karena fibonacci() sebenarnya berhenti di 12', 'Karena Python menghitung seluruh deret lebih dulu', 'Karena islice mengubah generator menjadi fungsi biasa'],
        jelas: 'Evaluasi malas memungkinkan deret tak berujung selama konsumen hanya mengambil sebagian.',
      },
    ],
  },
};
