// Python, Bab 5 — OOP di Python. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'py-class': {
    intisari: 'Class adalah cetak biru yang menyatukan data dan perilaku; objek dibuat dari class, __init__ menyiapkannya, dan self menunjuk objek itu sendiri.',
    rangkuman: [
      '**Class** adalah cetak biru; **objek** adalah instance-nya. `__init__` menyiapkan objek; `self` adalah objek itu sendiri.',
      '**Atribut instance** (`self.x`) milik tiap objek; **atribut class** dibagi semua objek.',
      '`__str__`/`__repr__` mengatur tampilan; `_nama` konvensi internal; `@property` membuat method terbaca seperti atribut.',
      '`@classmethod` (menerima `cls`, cocok untuk factory) dan `@staticmethod` (tanpa `self`/`cls`).',
    ],
    soal: [
      {
        tanya: 'Apa itu `self` pada method sebuah class?',
        benar: 'Referensi ke objek yang sedang memanggil method',
        salah: ['Nama class itu sendiri', 'Kata kunci untuk membuat objek baru', 'Variabel global bawaan Python'],
        jelas: '`andi.tambah_nilai(80)` diubah Python menjadi `Mahasiswa.tambah_nilai(andi, 80)`; `self` menerima `andi`.',
      },
      {
        tanya: 'Kapan method `__init__` dijalankan?',
        benar: 'Otomatis saat objek baru dibuat dari class',
        salah: ['Saat objek dihapus', 'Setiap kali atribut dibaca', 'Hanya bila dipanggil manual'],
        jelas: '`Mahasiswa("Andi", "2026001")` membuat objek lalu langsung memanggil `__init__`.',
      },
      {
        tanya: 'Apa perbedaan atribut class dan atribut instance?',
        benar: 'Atribut class dibagi semua objek, atribut instance (`self.x`) milik tiap objek',
        salah: ['Atribut class hanya bisa berupa angka', 'Atribut instance dibagi semua objek', 'Tidak ada perbedaan'],
        jelas: 'Mengubah atribut class mempengaruhi semua instance (selama tidak ditimpa), sedangkan `self.x` terpisah per objek.',
      },
      {
        tanya: 'Apa fungsi `@property` pada sebuah method?',
        benar: 'Membuat method dapat dibaca seperti atribut, sambil tetap menjalankan logika',
        salah: ['Membuat method menjadi privat sepenuhnya', 'Menghapus method dari class', 'Menjalankan method sekali saat impor'],
        jelas: 'Misalnya `rek.saldo` tanpa tanda kurung dapat menjalankan perhitungan atau validasi di baliknya.',
      },
      {
        tanya: 'Method khusus mana yang menentukan hasil `print(objek)`?',
        benar: '`__str__`',
        salah: ['`__init__`', '`__len__`', '`__add__`'],
        jelas: '`__str__` memberi tampilan ramah untuk pengguna; `__repr__` untuk tampilan tak ambigu bagi programmer.',
      },
    ],
  },

  'py-pewarisan': {
    intisari: 'Pewarisan memungkinkan class anak mewarisi dan mengganti perilaku class induk; polimorfisme membuat kode yang sama bekerja pada banyak jenis objek.',
    rangkuman: [
      '`class Anak(Induk):` mewarisi atribut dan method; **override** mengganti perilaku; `super()` memanggil induk.',
      '`isinstance`, `issubclass`, dan `__mro__` memeriksa hubungan pewarisan.',
      '**Polimorfisme**: kode yang sama bekerja pada banyak jenis objek lewat antarmuka yang sama.',
      '**Class abstrak** (`ABC`, `@abstractmethod`) memaksa anak mengimplementasikan method.',
      'Pewarisan = "adalah"; **komposisi** = "memiliki" (lebih disarankan).',
    ],
    soal: [
      {
        tanya: 'Untuk apa `super().__init__(nama, gaji)` dipakai di `__init__` class anak?',
        benar: 'Menjalankan inisialisasi class induk agar atribut induk terbentuk',
        salah: ['Menghapus class induk', 'Membuat objek baru dari class anak', 'Mengubah nama class'],
        jelas: 'Tanpa memanggil `__init__` induk, atribut yang dibuat oleh induk tidak akan ada.',
      },
      {
        tanya: 'Apa itu override pada pewarisan?',
        benar: 'Class anak mendefinisikan ulang method yang sudah ada di class induk',
        salah: ['Class induk menghapus method milik anak sehingga anak tidak memilikinya lagi', 'Dua class memakai nama yang sama', 'Menggabungkan dua objek menjadi satu'],
        jelas: 'Misalnya `Kucing.bersuara()` mengganti `Hewan.bersuara()` dengan perilaku sendiri.',
      },
      {
        tanya: 'Hubungan "Mobil memiliki Mesin" paling tepat dimodelkan dengan ...',
        benar: 'Komposisi: Mobil menyimpan objek Mesin',
        salah: ['Pewarisan: Mobil mewarisi dari Mesin', 'Fungsi lambda', 'Variabel global'],
        jelas: 'Pewarisan untuk hubungan "adalah"; komposisi untuk hubungan "memiliki".',
      },
      {
        tanya: 'Apa yang terjadi bila membuat objek dari class abstrak (`ABC`) yang masih punya `@abstractmethod`?',
        benar: 'TypeError karena class abstrak tidak bisa dibuat objeknya',
        salah: ['Objek dibuat tetapi methodnya kosong', 'Python otomatis mengisi method-nya', 'Program berhenti tanpa pesan'],
        jelas: 'Class abstrak memaksa turunannya mengimplementasikan semua method abstrak sebelum bisa diinstansiasi.',
      },
    ],
  },

  'py-dunder': {
    intisari: 'Method dunder (__nama__) membuat objek berperilaku seperti tipe bawaan: operator, len(), indeks, iterasi, pemanggilan, dan with.',
    rangkuman: [
      'Dunder memberi objekmu perilaku bawaan: `__repr__`/`__str__`, operator (`__add__`, `__eq__`, `__lt__`), koleksi (`__len__`, `__getitem__`, `__iter__`, `__contains__`).',
      '`__call__` membuat objek bisa dipanggil; `__enter__`/`__exit__` membuatnya bisa dipakai dengan `with`.',
      '`functools.total_ordering` melengkapi operator perbandingan.',
      'Objek yang dipakai di set/dict butuh `__eq__` dan `__hash__` yang konsisten.',
    ],
    soal: [
      {
        tanya: 'Penulisan `a + b` pada dua objek buatan sendiri memanggil method ...',
        benar: '`a.__add__(b)`',
        salah: ['`a.plus(b)`', '`a.__init__(b)`', '`b.__str__(a)`'],
        jelas: 'Operator overloading dilakukan dengan mendefinisikan method dunder yang sesuai.',
      },
      {
        tanya: 'Method dunder mana yang dipanggil oleh `len(objek)`?',
        benar: '`__len__`',
        salah: ['`__size__`', '`__count__`', '`__str__`'],
        jelas: 'Dengan `__len__` (dan `__getitem__`, `__iter__`) objekmu terasa seperti koleksi bawaan.',
      },
      {
        tanya: 'Untuk apa `__enter__` dan `__exit__` didefinisikan?',
        benar: 'Agar objek bisa dipakai dalam pernyataan `with`',
        salah: ['Agar objek bisa dicetak', 'Agar objek bisa diurutkan', 'Agar objek tidak bisa diubah'],
        jelas: '`__enter__` menyiapkan, `__exit__` membersihkan di akhir blok `with`, apa pun yang terjadi.',
      },
      {
        tanya: 'Apa yang perlu didefinisikan agar objek dapat menjadi elemen set atau kunci dict?',
        benar: '`__eq__` dan `__hash__` yang konsisten',
        salah: ['`__len__` dan `__call__`', '`__enter__` dan `__exit__`', 'Cukup `__init__`'],
        jelas: 'Set dan dict memakai hash untuk menempatkan objek dan `==` untuk membandingkan saat terjadi tabrakan.',
      },
    ],
  },

  'py-dataclass': {
    intisari: '@dataclass membuat __init__, __repr__, dan __eq__ otomatis dari field berantotasi tipe, sedangkan Enum menyatakan pilihan tetap bernama.',
    rangkuman: [
      '`@dataclass` membuat `__init__`, `__repr__`, `__eq__` otomatis; list/dict butuh `field(default_factory=...)`.',
      'Opsi: `frozen=True` (immutable), `order=True` (bisa dibandingkan); `asdict`, `replace`; `__post_init__` untuk validasi.',
      '**Enum** menyatakan pilihan tetap bernama (`Status.SELESAI`); anggota punya `.name` dan `.value`.',
      'dataclass dan Enum sering dipakai bersama untuk memodelkan data yang jelas dan aman.',
    ],
    soal: [
      {
        tanya: 'Apa yang dihasilkan otomatis oleh `@dataclass` pada sebuah class?',
        benar: '`__init__`, `__repr__`, dan `__eq__`',
        salah: ['Hanya `__del__`', 'Method untuk menyimpan ke database', 'Method `main()` untuk menjalankan program'],
        jelas: 'Cukup mendeklarasikan field dengan anotasi tipe; boilerplate dibuatkan Python.',
      },
      {
        tanya: 'Bagaimana nilai bawaan list kosong pada field dataclass yang benar?',
        benar: '`nilai: list = field(default_factory=list)`',
        salah: ['`nilai: list = []`', '`nilai: list = list`', '`nilai: list = None[]`'],
        jelas: 'Seperti default parameter fungsi, list literal akan dibagi antar-objek; dataclass bahkan menolaknya.',
      },
      {
        tanya: 'Apa efek `@dataclass(frozen=True)`?',
        benar: 'Field tidak bisa diubah setelah objek dibuat',
        salah: ['Objek disimpan di disk', 'Class tidak bisa diwariskan sama sekali', 'Semua field menjadi string'],
        jelas: 'Mengubah field memunculkan `FrozenInstanceError` (turunan AttributeError).',
      },
      {
        tanya: 'Jika `class Status(Enum): SELESAI = "selesai"`, apa hasil `Status.SELESAI.value`?',
        benar: '`"selesai"`',
        salah: ['`"SELESAI"`', '`1`', '`None`'],
        jelas: '`.name` bernilai "SELESAI" sedangkan `.value` adalah nilai yang diberikan, yaitu "selesai".',
      },
      {
        tanya: 'Apa keunggulan Enum dibanding memakai string mentah seperti "selesai"?',
        benar: 'Nama pilihan jelas dan salah ketik langsung terdeteksi sebagai galat',
        salah: ['Enum lebih cepat 1000 kali', 'Enum otomatis tersimpan ke berkas', 'Enum menghilangkan kebutuhan fungsi'],
        jelas: '`Status.SELESAII` langsung AttributeError, sedangkan string salah ketik diam-diam salah.',
      },
    ],
  },
};
