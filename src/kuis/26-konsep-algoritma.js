// Konsep Pemrograman, Bab 3 — Algoritma & Teori Dasar. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'konsep-algoritma': {
    intisari: 'Algoritma dapat dinyatakan dalam bahasa alami, pseudocode, atau flowchart; dry run (menelusuri nilai variabel dengan tangan) menangkap bug logika sebelum kode dijalankan.',
    rangkuman: [
      'Algoritma dapat dinyatakan sebagai **bahasa alami**, **pseudocode**, atau **flowchart**; ketiganya bebas bahasa pemrograman.',
      'Contoh klasik: genap/ganjil, nilai terbesar (perulangan dengan "calon terbesar"), dan **algoritma Euclid** untuk FPB.',
      '**Dry run** menelusuri nilai variabel dengan tangan untuk menangkap bug logika.',
      'Alur kerja: pahami masalah → rancang algoritma → terjemahkan → uji → perbaiki.',
    ],
    soal: [
      {
        tanya: 'Pada flowchart, belah ketupat digunakan untuk ...',
        benar: 'Keputusan (percabangan ya/tidak)',
        salah: ['Mulai atau selesai', 'Masukan atau keluaran', 'Proses perhitungan'],
        jelas: 'Oval = mulai/selesai, jajar genjang = masukan/keluaran, persegi panjang = proses, belah ketupat = keputusan.',
      },
      {
        tanya: 'Algoritma Euclid dijalankan pada (a, b) = (48, 18). Berapa FPB-nya?',
        benar: '6',
        salah: ['3', '12', '18'],
        jelas: '(48,18) → (18,12) → (12,6) → (6,0), sehingga FPB = 6.',
      },
      {
        tanya: 'Apa tujuan dry run?',
        benar: 'Menelusuri nilai variabel langkah demi langkah dengan contoh kecil untuk menemukan bug logika',
        salah: ['Mengompilasi program tanpa menjalankannya', 'Menghapus variabel yang tidak dipakai', 'Mengukur kecepatan program secara otomatis'],
        jelas: 'Dry run (uji meja) dilakukan di kertas atau di kepala sebelum atau selain menjalankan kode.',
      },
      {
        tanya: 'Pada algoritma mencari nilai terbesar, apa langkah awalnya?',
        benar: 'Menganggap elemen pertama sebagai calon terbesar',
        salah: ['Mengurutkan daftar dari terkecil', 'Menjumlahkan semua elemen', 'Mengambil elemen terakhir sebagai hasil'],
        jelas: 'Calon awal diperbarui setiap menemukan elemen yang lebih besar saat menelusuri sisa daftar.',
      },
    ],
  },

  'konsep-berpikir-komputasional': {
    intisari: 'Berpikir komputasional terdiri dari dekomposisi, pengenalan pola, abstraksi, dan algoritma; semua algoritma dapat disusun dari urutan, percabangan, dan perulangan.',
    rangkuman: [
      '**Berpikir komputasional**: dekomposisi, pengenalan pola, abstraksi, dan algoritma.',
      'Fungsi adalah alat dekomposisi dan abstraksi: satu tugas, mudah diuji dan dipakai ulang.',
      'Semua algoritma dibangun dari **urutan**, **percabangan**, dan **perulangan** (teorema Böhm–Jacopini).',
      'Penugasan (`=`) berarti "simpan hasil sisi kanan ke nama di kiri"; urutan kondisi `if/elif` menentukan hasil.',
    ],
    soal: [
      {
        tanya: 'Memecah aplikasi kasir menjadi bagian "input barang", "hitung total", dan "cetak struk" adalah contoh ...',
        benar: 'Dekomposisi',
        salah: ['Abstraksi', 'Pengenalan pola', 'Kompilasi'],
        jelas: 'Dekomposisi memecah masalah besar menjadi bagian-bagian kecil yang bisa diselesaikan sendiri-sendiri.',
      },
      {
        tanya: 'Tiga struktur kontrol dasar yang cukup untuk menyatakan setiap algoritma adalah ...',
        benar: 'Urutan, percabangan, dan perulangan',
        salah: ['Variabel, konstanta, dan fungsi', 'Compiler, linker, dan loader', 'Stack, queue, dan tree'],
        jelas: 'Teorema Böhm–Jacopini: sequence, selection, dan iteration sudah mencukupi.',
      },
      {
        tanya: 'Apa arti `x = x + 1` dalam pemrograman?',
        benar: 'Hitung x + 1 lalu simpan hasilnya kembali ke x',
        salah: ['Persamaan matematika yang tidak mungkin benar', 'Membandingkan x dengan x + 1', 'Menghapus variabel x'],
        jelas: 'Penugasan bukan persamaan: sisi kanan dihitung dulu, hasilnya disimpan ke nama di kiri.',
      },
      {
        tanya: 'Pada FizzBuzz, mengapa kondisi `i % 15 == 0` harus dicek sebelum `i % 3 == 0`?',
        benar: 'Karena kelipatan 15 juga habis dibagi 3 sehingga akan salah tertangkap sebagai "Fizz" jika dicek belakangan',
        salah: ['Karena 15 adalah bilangan prima', 'Karena `elif` tidak boleh berada di awal', 'Karena Python hanya membaca kondisi pertama dan terakhir'],
        jelas: 'Pada rantai if/elif, kondisi pertama yang benar yang dijalankan; urutan yang salah menghasilkan bug logika.',
      },
    ],
  },

  'konsep-kompleksitas': {
    intisari: 'Big-O menyatakan laju pertumbuhan jumlah langkah terhadap ukuran masukan; algoritma dengan kelas lebih rendah (O(log n), O(n)) jauh lebih skalabel daripada O(n²) atau eksponensial.',
    rangkuman: [
      '**Big-O**: laju pertumbuhan langkah terhadap n; buang konstanta dan ambil suku dominan.',
      'Urutan: **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)**.',
      'Satu loop → O(n); loop bersarang → O(n²); membagi dua berulang → O(log n).',
      '**Binary search** (data terurut) ±20 langkah untuk 1 juta elemen, jauh lebih cepat daripada pencarian linear.',
      'Ada tukar-tambah waktu vs memori; Big-O biasanya melaporkan kasus terburuk.',
    ],
    soal: [
      {
        tanya: 'Kompleksitas waktu dari dua loop `for` bersarang yang masing-masing berulang n kali adalah ...',
        benar: 'O(n²)',
        salah: ['O(n)', 'O(log n)', 'O(2n)'],
        jelas: 'Badan loop dalam dijalankan n × n kali, sehingga kuadratik.',
      },
      {
        tanya: 'Notasi Big-O yang disederhanakan dari `3n² + 5n + 20` adalah ...',
        benar: 'O(n²)',
        salah: ['O(3n²)', 'O(n)', 'O(5n)'],
        jelas: 'Buang konstanta dan ambil suku dominan: untuk n besar suku n² mengalahkan yang lain.',
      },
      {
        tanya: 'Berapa langkah terburuk kira-kira binary search pada daftar terurut berisi 1.048.576 (2²⁰) elemen?',
        benar: 'Sekitar 20 langkah',
        salah: ['Sekitar 1.000 langkah', 'Sekitar 1 juta langkah', 'Tepat 2 langkah'],
        jelas: 'Tiap langkah membuang separuh data; log₂(2²⁰) = 20.',
      },
      {
        tanya: 'Syarat agar binary search dapat dipakai adalah ...',
        benar: 'Datanya harus sudah terurut',
        salah: ['Datanya harus berisi bilangan bulat negatif', 'Datanya harus berukuran genap', 'Datanya harus berada di dalam dict'],
        jelas: 'Binary search mengandalkan urutan untuk membuang separuh data yang pasti tidak berisi target.',
      },
      {
        tanya: 'Mengapa pengecekan `x in kumpulan_set` lebih cepat daripada `x in daftar_list` untuk data besar?',
        benar: 'Set memakai tabel hash dengan rata-rata O(1), sedangkan list menelusuri elemen satu per satu O(n)',
        salah: ['Set selalu memakai lebih sedikit memori daripada list', 'List tidak dapat dicari sama sekali', 'Set mengurutkan elemen secara otomatis'],
        jelas: 'Tabel hash langsung menuju posisi kunci; list harus membandingkan satu per satu (dengan harga memori tambahan untuk set).',
      },
    ],
  },

  'konsep-struktur-data': {
    intisari: 'Struktur data menentukan efisiensi operasi: list untuk akses indeks, stack LIFO, queue FIFO, hash table untuk pencarian cepat, serta tree dan graph untuk hierarki dan hubungan.',
    rangkuman: [
      '**Array/list**: akses indeks O(1), sisip tengah O(n). **Linked list**: sisip mudah, akses O(n).',
      '**Stack** (LIFO: undo, call stack), **queue** (FIFO: antrean; pakai `deque`).',
      '**Hash table** (dict/set): cari/sisip/hapus rata-rata O(1).',
      '**Tree** menyimpan hierarki, **graph** menyimpan hubungan.',
    ],
    soal: [
      {
        tanya: 'Struktur data mana yang cocok untuk fitur tombol Undo?',
        benar: 'Stack (LIFO)',
        salah: ['Queue (FIFO)', 'Hash table', 'Tree biner'],
        jelas: 'Perubahan terakhir harus dibatalkan lebih dulu: terakhir masuk, pertama keluar.',
      },
      {
        tanya: 'Struktur data yang menyimpan pasangan kunci → nilai dengan pencarian rata-rata O(1) adalah ...',
        benar: 'Hash table (dict)',
        salah: ['Linked list', 'Stack', 'Array tak terurut'],
        jelas: 'Fungsi hash mengubah kunci menjadi posisi sehingga pencarian langsung ke tempatnya.',
      },
      {
        tanya: 'Mengapa memakai `list.pop(0)` sebagai dequeue pada queue besar tidak efisien?',
        benar: 'Menghapus elemen pertama menggeser semua elemen lain sehingga O(n); `deque.popleft()` O(1)',
        salah: ['`pop(0)` selalu menghasilkan galat', 'List tidak dapat menyimpan antrean', '`pop(0)` menghapus seluruh list'],
        jelas: 'Array harus menggeser elemen setelah penghapusan di depan; deque dirancang untuk operasi di kedua ujung.',
      },
      {
        tanya: 'Peta jalan antarkota dengan jalan yang menghubungkannya paling cocok dimodelkan sebagai ...',
        benar: 'Graph',
        salah: ['Stack', 'Queue', 'Array satu dimensi'],
        jelas: 'Kota adalah simpul dan jalan adalah sisi: hubungan antar-objek adalah ciri graph.',
      },
    ],
  },

  'konsep-rekursi': {
    intisari: 'Rekursi adalah fungsi yang memanggil dirinya dengan masalah yang lebih kecil dan harus punya kasus dasar; memoization dan divide-and-conquer membuatnya efisien.',
    rangkuman: [
      '**Rekursi** butuh **kasus dasar** dan **kasus rekursif** yang mengecilkan masalah.',
      'Tiap pemanggilan membuat stack frame; terlalu dalam → `RecursionError`.',
      'Rekursi naif seperti Fibonacci bisa eksponensial; **memoization** (`functools.cache`) membuatnya linear.',
      '**Divide and conquer**: bagi → selesaikan → gabungkan (binary search O(log n), merge sort O(n log n)).',
    ],
    soal: [
      {
        tanya: 'Apa fungsi kasus dasar (base case) pada fungsi rekursif?',
        benar: 'Menghentikan rekursi dengan jawaban langsung tanpa memanggil diri sendiri',
        salah: ['Memanggil fungsi lain secara acak', 'Mengulang masalah yang sama persis', 'Menambah kedalaman stack sebanyak mungkin'],
        jelas: 'Tanpa kasus dasar rekursi tidak pernah berhenti dan memicu stack overflow.',
      },
      {
        tanya: 'Berapa nilai `faktorial(4)` jika `faktorial(n) = n * faktorial(n - 1)` dan `faktorial(0) = 1`?',
        benar: '24',
        salah: ['10', '16', '12'],
        jelas: '4 × 3 × 2 × 1 × 1 = 24.',
      },
      {
        tanya: 'Mengapa Fibonacci rekursif murni sangat lambat untuk n besar?',
        benar: 'Nilai yang sama dihitung ulang berkali-kali sehingga pemanggilan tumbuh eksponensial',
        salah: ['Karena Python tidak mendukung rekursi', 'Karena penjumlahan sangat mahal', 'Karena fungsi tidak memiliki kasus dasar'],
        jelas: 'Submasalah tumpang tindih; memoization menyimpan hasilnya sehingga tiap nilai dihitung sekali.',
      },
      {
        tanya: 'Merge sort termasuk strategi ...',
        benar: 'Divide and conquer',
        salah: ['Brute force tanpa pembagian masalah', 'Hashing', 'Greedy tanpa rekursi'],
        jelas: 'Daftar dibelah dua, tiap bagian diurutkan secara rekursif, lalu dua hasil terurut digabung.',
      },
      {
        tanya: 'Error apa yang muncul di Python bila rekursi tidak pernah mencapai kasus dasar?',
        benar: 'RecursionError (batas kedalaman rekursi terlampaui)',
        salah: ['ZeroDivisionError', 'SyntaxError', 'KeyError'],
        jelas: 'Python membatasi kedalaman rekursi (default sekitar 1000) untuk mencegah stack habis.',
      },
    ],
  },
};
