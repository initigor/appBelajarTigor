// Konsep Pemrograman, Bab 1 — Dasar Bahasa Pemrograman. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'konsep-apa-itu-program': {
    intisari: 'Algoritma adalah langkah penyelesaian masalah yang bebas bahasa; program adalah algoritma yang ditulis dalam bahasa pemrograman agar bisa dijalankan komputer.',
    rangkuman: [
      '**Algoritma** = langkah-langkah logis dan terurut; **program** = algoritma dalam bahasa pemrograman; **bahasa** = sintaks + semantik.',
      'Komputer hanya mengerti **kode mesin**; compiler/interpreter menjembatani manusia dan mesin.',
      'Algoritma yang baik: berhingga, jelas, punya masukan/keluaran, dan efektif.',
      'Bahasa = spesifikasi + implementasi (Python vs CPython/PyPy).',
    ],
    soal: [
      {
        tanya: 'Apa hubungan algoritma dan program?',
        benar: 'Program adalah algoritma yang ditulis dalam bahasa pemrograman',
        salah: ['Algoritma adalah program yang sudah dikompilasi', 'Algoritma hanya ada di Python', 'Keduanya sama persis dan tidak berbeda sama sekali'],
        jelas: 'Algoritma bebas bahasa, sedangkan program adalah perwujudannya dalam sebuah bahasa pemrograman tertentu.',
      },
      {
        tanya: 'Kode yang melanggar aturan penulisan bahasa (misalnya kurung tidak ditutup) melanggar ...',
        benar: 'Sintaks',
        salah: ['Semantik', 'Algoritma', 'Kode mesin'],
        jelas: 'Sintaks adalah aturan penulisan; semantik adalah arti. Kode bisa benar sintaks tetapi salah arti (bug logika).',
      },
      {
        tanya: 'Manakah yang BUKAN ciri algoritma yang baik?',
        benar: 'Boleh berjalan tanpa batas waktu',
        salah: ['Berhingga: akhirnya berhenti', 'Langkah-langkahnya jelas dan tidak ambigu', 'Memiliki minimal satu keluaran'],
        jelas: 'Algoritma harus berhingga. Ciri lainnya: jelas, punya masukan (nol atau lebih) dan keluaran, serta efektif.',
      },
      {
        tanya: 'CPython dan PyPy adalah ...',
        benar: 'Dua implementasi dari bahasa Python',
        salah: ['Dua bahasa pemrograman yang berbeda', 'Dua versi sistem operasi', 'Dua jenis algoritma pengurutan'],
        jelas: 'Python adalah spesifikasi bahasa. CPython (resmi, ditulis dalam C) dan PyPy (dengan JIT) adalah program yang menjalankannya.',
      },
    ],
  },

  'konsep-low-high': {
    intisari: 'Makin rendah tingkat sebuah bahasa, makin dekat ke hardware dan makin besar kendalinya; makin tinggi, makin mudah ditulis dan portabel tetapi biasanya lebih lambat.',
    rangkuman: [
      'Tingkat bahasa: **kode mesin → assembly → C (menengah) → Python/Java/JS (tinggi)**.',
      'Kode mesin dan assembly **terikat arsitektur CPU**; bahasa tingkat tinggi tidak.',
      'Assembly diterjemahkan oleh **assembler**; bahasa tingkat tinggi oleh **compiler atau interpreter**.',
      'Bahasa tingkat tinggi lebih lambat karena lapisan abstraksi, tetapi bagian berat sering diserahkan ke pustaka berbahasa C.',
    ],
    soal: [
      {
        tanya: 'Manakah urutan tingkat bahasa dari yang PALING RENDAH ke paling tinggi?',
        benar: 'Kode mesin, assembly, C, Python',
        salah: ['Python, C, assembly, kode mesin', 'Assembly, kode mesin, Python, C', 'C, kode mesin, assembly, Python'],
        jelas: 'Kode mesin paling dekat hardware, lalu assembly (mnemonik), C (menengah), dan Python (tinggi).',
      },
      {
        tanya: 'Apa penerjemah dari bahasa assembly ke kode mesin?',
        benar: 'Assembler',
        salah: ['Interpreter', 'Linker', 'Debugger'],
        jelas: 'Assembler menerjemahkan mnemonik assembly menjadi kode mesin. Linker menyatukan berkas objek.',
      },
      {
        tanya: 'Mengapa program assembly untuk x86 tidak bisa langsung dijalankan di CPU ARM?',
        benar: 'Assembly terikat pada set instruksi CPU tertentu',
        salah: ['Assembly hanya dapat dipakai di Windows', 'ARM tidak memiliki memori', 'Assembly selalu berukuran terlalu besar'],
        jelas: 'Setiap arsitektur punya set instruksi sendiri. Bahasa tingkat tinggi tidak terikat satu CPU.',
      },
      {
        tanya: 'Mengapa `sum(range(n))` di Python biasanya lebih cepat daripada loop `for` manual?',
        benar: 'Pekerjaannya dilakukan oleh kode tingkat rendah (C) di dalam interpreter',
        salah: ['Karena `sum` mengabaikan sebagian angka', 'Karena loop `for` tidak diizinkan di Python', 'Karena `sum` memakai GPU secara otomatis'],
        jelas: 'Loop manual dijalankan langkah demi langkah oleh interpreter; `sum` adalah fungsi bawaan yang berjalan dalam kode C.',
      },
      {
        tanya: 'C sering disebut bahasa tingkat menengah karena ...',
        benar: 'Sintaksnya tingkat tinggi tetapi ia memberi akses langsung ke memori lewat pointer',
        salah: ['Ia hanya bisa dipakai untuk program berukuran menengah', 'Ia tidak memerlukan compiler', 'Ia diterjemahkan langsung oleh browser'],
        jelas: 'C memiliki fungsi, tipe, dan struktur kontrol seperti bahasa tinggi, tetapi juga manajemen memori manual seperti bahasa rendah.',
      },
    ],
  },

  'konsep-compiler-interpreter': {
    intisari: 'Compiler menerjemahkan seluruh program sebelum dijalankan dan menghasilkan program baru; interpreter menerjemahkan sambil menjalankan. Banyak bahasa modern adalah hibrida lewat bytecode.',
    rangkuman: [
      '**Compiler**: terjemahkan seluruh kode sebelum jalan, hasilkan program; cepat dijalankan, galat tertangkap di muka (C, C++, Go, Rust).',
      '**Interpreter**: terjemahkan sambil menjalankan; fleksibel tetapi lebih lambat (Python, Ruby, PHP).',
      'Banyak bahasa **hibrida**: dikompilasi ke bytecode lalu dijalankan mesin virtual (Java, Python, JavaScript).',
      'Python mengompilasi seluruh berkas ke bytecode lebih dulu: galat sintaks muncul sebelum eksekusi, galat runtime saat baris tercapai.',
    ],
    soal: [
      {
        tanya: 'Perbedaan utama compiler dan interpreter adalah ...',
        benar: 'Compiler menerjemahkan seluruh kode sebelum dijalankan, interpreter menerjemahkan sambil menjalankan',
        salah: ['Compiler hanya dipakai untuk bahasa assembly, sedangkan interpreter hanya dipakai untuk bahasa C dan C++', 'Interpreter selalu lebih cepat daripada compiler', 'Compiler tidak dapat mendeteksi galat sama sekali'],
        jelas: 'Compiler bekerja di muka dan menghasilkan program; interpreter mengeksekusi langsung sambil membaca kode.',
      },
      {
        tanya: 'Mengapa file Python yang punya galat sintaks di baris ke-10 tidak menjalankan baris 1–9 sama sekali?',
        benar: 'Python mengompilasi seluruh berkas ke bytecode lebih dulu sehingga galat sintaks muncul sebelum eksekusi',
        salah: ['Python hanya membaca baris ke-10', 'Python tidak punya tahap pembacaan kode', 'Baris 1–9 selalu dihapus otomatis'],
        jelas: 'Parsing dan kompilasi ke bytecode mencakup seluruh berkas. Galat runtime baru muncul saat barisnya dijalankan.',
      },
      {
        tanya: 'Alur kerja Java yang benar adalah ...',
        benar: '.java → javac → .class (bytecode) → dijalankan JVM',
        salah: ['.java → dijalankan langsung oleh CPU', '.java → JVM → javac → .class', '.class → javac → .java'],
        jelas: 'javac mengompilasi sumber ke bytecode, lalu JVM (interpreter + JIT) menjalankannya di platform mana pun.',
      },
      {
        tanya: 'Apa keunggulan program hasil kompilasi (misalnya dari C) dibanding interpretasi murni?',
        benar: 'Biasanya berjalan lebih cepat dan banyak galat tipe/sintaks tertangkap sebelum dijalankan',
        salah: ['Selalu dapat dijalankan di semua sistem operasi tanpa dikompilasi ulang', 'Tidak membutuhkan langkah build sama sekali', 'Kode sumbernya otomatis menjadi lebih pendek'],
        jelas: 'Hasil kompilasi terikat platform dan perlu build, tetapi lebih cepat dijalankan dan lebih banyak galat ditemukan dini.',
      },
    ],
  },

  'konsep-tahap-kompilasi': {
    intisari: 'Kode sumber diproses lewat lexer (token), parser (AST), analisis semantik, IR, optimasi, code generation, linking, dan loader sebelum dijalankan CPU.',
    rangkuman: [
      'Jalur kompilasi: **lexer → parser (AST) → analisis semantik → IR → optimasi → code generation → linking → loader**.',
      '**Token** adalah satuan terkecil bermakna; **AST** menyatakan struktur dan prioritas operator.',
      'Galat sintaks berasal dari parser, galat tipe dari analisis semantik, *undefined reference* dari linker.',
      'Optimasi (constant folding, inlining, loop unrolling) mempercepat tanpa mengubah hasil.',
      '**Linker** menyatukan berkas objek dan pustaka (static vs dynamic); **loader** memuat program ke memori.',
    ],
    soal: [
      {
        tanya: 'Tahap apa yang memecah teks kode menjadi token seperti nama, angka, dan operator?',
        benar: 'Analisis leksikal (lexer)',
        salah: ['Linking', 'Optimasi', 'Loading'],
        jelas: 'Lexer mengelompokkan karakter menjadi token. Parser kemudian menyusunnya menjadi pohon sintaks.',
      },
      {
        tanya: 'Mengapa `1 + 2 * 3` dihitung sebagai `1 + (2 * 3)`?',
        benar: 'Parser membangun AST yang menempatkan perkalian lebih dalam sehingga dikerjakan lebih dulu',
        salah: ['Lexer menghapus tanda tambah', 'Linker mengubah urutan angka', 'Loader menghitung dari kanan ke kiri'],
        jelas: 'Tata bahasa menentukan prioritas operator. Hasilnya tercermin pada struktur AST.',
      },
      {
        tanya: 'Apa yang dilakukan constant folding?',
        benar: 'Menghitung ekspresi konstan saat kompilasi, mis. `60 * 60 * 24` menjadi 86400',
        salah: ['Melipat berkas kode menjadi lebih kecil', 'Mengubah semua variabel menjadi konstanta', 'Menghapus semua komentar dari program'],
        jelas: 'Hasil ekspresi yang pasti dihitung di muka sehingga tidak perlu dihitung berulang saat program berjalan.',
      },
      {
        tanya: 'Pesan "undefined reference to ..." paling mungkin berasal dari tahap ...',
        benar: 'Linking',
        salah: ['Analisis leksikal', 'Parsing', 'Pembacaan input saat runtime'],
        jelas: 'Linker gagal menemukan definisi fungsi/variabel yang dipakai di berkas lain atau pustaka.',
      },
    ],
  },

  'konsep-bytecode-jit': {
    intisari: 'Bytecode adalah bentuk antara netral-CPU yang dijalankan mesin virtual; JIT mengompilasi bagian program yang sering dipakai menjadi kode mesin saat berjalan sehingga portabel dan cepat.',
    rangkuman: [
      '**Bytecode** = bentuk antara netral-CPU; **VM** = program yang menjalankannya (JVM, VM CPython, V8).',
      'Keuntungan: **portabilitas**; kerugian: lebih lambat daripada kode mesin asli.',
      '**JIT** mengompilasi bagian "panas" menjadi kode mesin saat berjalan; **AOT** mengompilasi semuanya sebelum jalan.',
      'Strategi: **interpretasi**, **AOT**, **JIT**; sebagian besar bahasa modern hibrida.',
      'Python bisa dipercepat dengan pustaka native (NumPy), PyPy (JIT), atau kompilasi bagian kritis. `dis.dis` memperlihatkan bytecode.',
    ],
    soal: [
      {
        tanya: 'Mengapa file `.class` Java dapat dijalankan di Windows, Linux, dan macOS?',
        benar: 'Karena berupa bytecode netral-CPU yang dijalankan oleh JVM yang tersedia di tiap platform',
        salah: ['Karena `.class` berisi kode mesin untuk semua CPU sekaligus', 'Karena Java tidak memakai memori', 'Karena `.class` diterjemahkan manual oleh pengguna'],
        jelas: 'Yang berbeda per platform hanya JVM-nya; bytecode-nya sama. Itu inti "write once, run anywhere".',
      },
      {
        tanya: 'Apa yang dilakukan JIT compiler?',
        benar: 'Mengompilasi bagian program yang sering dijalankan menjadi kode mesin saat program berjalan',
        salah: ['Mengompilasi seluruh program sebelum diunduh pengguna', 'Mengubah kode mesin menjadi kode sumber', 'Menghapus bytecode yang tidak dipakai dari disk'],
        jelas: 'JIT memantau hot spot (misalnya loop) dan menerjemahkannya ke kode mesin asli untuk kecepatan.',
      },
      {
        tanya: 'Manakah yang termasuk strategi AOT (Ahead-Of-Time)?',
        benar: 'C dikompilasi ke program sebelum dijalankan',
        salah: ['Python menjalankan bytecode instruksi demi instruksi', 'HotSpot mengompilasi loop panas saat berjalan', 'Interpreter shell membaca perintah satu per satu'],
        jelas: 'AOT menerjemahkan seluruh program sebelum eksekusi. Tiga lainnya adalah interpretasi atau JIT.',
      },
      {
        tanya: 'Fungsi `dis.dis(f)` pada Python digunakan untuk ...',
        benar: 'Menampilkan bytecode yang dihasilkan dari fungsi f',
        salah: ['Menghapus fungsi f dari memori', 'Mengubah fungsi f menjadi kode C', 'Menjalankan fungsi f dengan GPU'],
        jelas: 'Modul `dis` (disassembler) memperlihatkan instruksi bytecode yang dijalankan VM CPython.',
      },
    ],
  },
};
