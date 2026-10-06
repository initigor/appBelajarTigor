// Konsep Pemrograman, Bab 2 — Script, Tipe & Paradigma. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'konsep-script': {
    intisari: 'Script adalah program (biasanya pendek) untuk mengotomatiskan tugas atau menyambungkan sistem, umumnya ditulis dalam bahasa tingkat tinggi yang diinterpretasi dan punya REPL.',
    rangkuman: [
      '**Bahasa script** umumnya tingkat tinggi, diinterpretasi, bertipe dinamis, dan punya REPL (Bash, PowerShell, Python, JavaScript, Perl, Ruby, PHP, Lua).',
      'Kegunaan: otomasi, pemrosesan data, administrasi sistem, integrasi layanan, web, prototipe.',
      'Dijalankan dengan `python skrip.py` atau lewat **shebang** (`#!/usr/bin/env python3`).',
      '`if __name__ == "__main__":` memisahkan kode utama dari kode yang bisa diimpor sebagai modul.',
      '**REPL** (Read-Eval-Print Loop) dan notebook mempercepat eksperimen.',
    ],
    soal: [
      {
        tanya: 'Manakah yang paling tepat menggambarkan "script"?',
        benar: 'Program (sering pendek) untuk mengotomatiskan tugas atau menyambungkan sistem',
        salah: ['Program yang hanya bisa dibuat dengan assembly', 'Program yang pasti tidak punya fungsi', 'Berkas biner hasil kompilasi C'],
        jelas: 'Istilah script menggambarkan peran (otomasi dan penyambung), bukan jaminan teknis tertentu.',
      },
      {
        tanya: 'Apa fungsi baris `#!/usr/bin/env python3` di awal script di Linux/macOS?',
        benar: 'Memberi tahu sistem interpreter mana yang dipakai untuk menjalankan script',
        salah: ['Mengomentari seluruh isi script', 'Mengompilasi script menjadi program biner', 'Menghapus semua variabel di awal'],
        jelas: 'Shebang menentukan interpreter, sehingga script dapat dijalankan langsung (`./halo.py`) setelah diberi izin eksekusi.',
      },
      {
        tanya: 'Apa arti `if __name__ == "__main__":` pada berkas Python?',
        benar: 'Blok di bawahnya hanya berjalan bila berkas dijalankan langsung, bukan saat diimpor',
        salah: ['Blok di bawahnya hanya berjalan saat diimpor', 'Memeriksa apakah nama berkas "main"', 'Mencegah berkas dijalankan sama sekali'],
        jelas: 'Saat dijalankan langsung `__name__` bernilai "__main__"; saat diimpor bernilai nama modul.',
      },
      {
        tanya: 'Singkatan REPL berarti ...',
        benar: 'Read-Eval-Print Loop',
        salah: ['Run-Execute-Parse-Link', 'Read-Edit-Publish-Log', 'Remote-Execute-Python-Library'],
        jelas: 'REPL membaca masukan, mengevaluasi, mencetak hasil, lalu mengulang. Notebook adalah versi yang lebih nyaman.',
      },
    ],
  },

  'konsep-tipe-memori': {
    intisari: 'Tipe statis diperiksa saat kompilasi dan tipe dinamis saat runtime; kuat/lemah menyangkut konversi implisit. Memori dikelola manual, lewat garbage collector, reference counting, atau ownership.',
    rangkuman: [
      '**Tipe statis**: diperiksa saat kompilasi, melekat pada variabel (C, Java). **Tipe dinamis**: diperiksa saat runtime, melekat pada nilai (Python, JavaScript).',
      '**Kuat vs lemah** soal konversi implisit: Python kuat (`"a" + 1` → `TypeError`), JavaScript lemah.',
      'Memori: **stack** (cepat, otomatis) dan **heap**; pengelolaan: **manual** (C), **GC** (Java, JS), **reference counting** (Python), **ownership** (Rust).',
      'Di Python variabel adalah nama yang menunjuk objek: `b = a` tidak menyalin; `is` membandingkan identitas, `==` membandingkan isi.',
    ],
    soal: [
      {
        tanya: 'Python termasuk bahasa dengan sistem tipe ...',
        benar: 'Dinamis dan kuat',
        salah: ['Statis dan lemah', 'Dinamis dan lemah', 'Statis dan kuat'],
        jelas: 'Tipe diperiksa saat runtime (dinamis) dan Python menolak operasi tipe tidak cocok tanpa konversi eksplisit (kuat).',
      },
      {
        tanya: 'Apa hasil kode ini di Python?\n\n~~~python\na = [1, 2]\nb = a\nb.append(3)\nprint(a)\n~~~',
        benar: '[1, 2, 3]',
        salah: ['[1, 2]', '[3]', 'Error'],
        jelas: '`b = a` tidak menyalin: keduanya menunjuk list yang sama, jadi perubahan lewat b terlihat di a.',
      },
      {
        tanya: 'Perbedaan `==` dan `is` pada Python adalah ...',
        benar: '`==` membandingkan isi, `is` membandingkan apakah keduanya objek yang sama',
        salah: ['`==` membandingkan identitas, `is` membandingkan isi', 'Keduanya selalu menghasilkan nilai yang sama', '`is` hanya bisa dipakai untuk angka'],
        jelas: '`[1,2] == [1,2]` bernilai True, tetapi `[1,2] is [1,2]` False karena dua objek berbeda.',
      },
      {
        tanya: 'Pendekatan manajemen memori mana yang dipakai CPython untuk membebaskan objek?',
        benar: 'Reference counting (ditambah GC untuk siklus)',
        salah: ['Programmer wajib memanggil free()', 'Tidak ada pembebasan memori sama sekali', 'Compiler membuktikan kepemilikan seperti Rust'],
        jelas: 'Tiap objek menghitung referensinya; saat nol, memorinya dibebaskan. GC siklik menangani objek yang saling menunjuk.',
      },
      {
        tanya: 'Manakah yang termasuk objek immutable di Python?',
        benar: 'String dan tuple',
        salah: ['List dan dict', 'Set dan list', 'Dict dan set'],
        jelas: 'String, tuple, dan angka tidak bisa diubah setelah dibuat; list, dict, dan set bisa.',
      },
    ],
  },

  'konsep-paradigma': {
    intisari: 'Paradigma adalah gaya berpikir menyusun program: imperatif (prosedural, OOP) menjelaskan bagaimana, deklaratif (fungsional, SQL) menjelaskan apa.',
    rangkuman: [
      '**Imperatif** (prosedural, OOP) menjelaskan *bagaimana*; **deklaratif** (fungsional, SQL, HTML) menjelaskan *apa*.',
      '**OOP**: enkapsulasi, pewarisan, polimorfisme, abstraksi.',
      '**Fungsional**: fungsi murni, data immutable, fungsi sebagai nilai (`map`, `filter`).',
      'Banyak bahasa modern multi-paradigma; pilih gaya yang paling jelas untuk masalahnya.',
    ],
    soal: [
      {
        tanya: 'Query `SELECT nama FROM mahasiswa WHERE nilai >= 70` termasuk paradigma ...',
        benar: 'Deklaratif',
        salah: ['Imperatif prosedural', 'Berorientasi objek', 'Assembly'],
        jelas: 'SQL menyatakan hasil yang diinginkan; basis data yang memilih cara mengambilnya.',
      },
      {
        tanya: 'Manakah pilar OOP yang berarti "satu antarmuka, banyak perilaku"?',
        benar: 'Polimorfisme',
        salah: ['Enkapsulasi', 'Pewarisan', 'Kompilasi'],
        jelas: 'Misalnya method `bersuara()` menghasilkan perilaku berbeda pada objek kucing dan anjing.',
      },
      {
        tanya: 'Ciri khas pemrograman fungsional adalah ...',
        benar: 'Fungsi murni dan fungsi yang dapat dipakai sebagai nilai',
        salah: ['Wajib memakai variabel global yang terus berubah', 'Hanya bisa dipakai untuk antarmuka web', 'Tidak boleh memakai fungsi sama sekali'],
        jelas: 'Fungsi murni tidak punya efek samping, dan fungsi bisa dikirim ke fungsi lain (`map`, `filter`).',
      },
      {
        tanya: 'Perbedaan fokus imperatif dan deklaratif adalah ...',
        benar: 'Imperatif menjelaskan bagaimana mengerjakannya, deklaratif menjelaskan apa hasil yang diinginkan',
        salah: ['Imperatif hanya untuk bahasa tingkat rendah', 'Deklaratif tidak pernah menghasilkan keluaran', 'Keduanya persis sama'],
        jelas: 'Imperatif memberi perintah langkah demi langkah; deklaratif menyatakan tujuan dan membiarkan sistem memilih caranya.',
      },
    ],
  },

  'konsep-lingkungan': {
    intisari: 'Programmer memakai editor/IDE, terminal, manajer paket, lingkungan virtual, dan Git; library dipanggil kodemu, sedangkan framework memanggil kodemu.',
    rangkuman: [
      '**Editor/IDE/notebook** untuk menulis kode; fitur penting: highlighting, autocomplete, linter, formatter, debugger.',
      '**Terminal** dan **shell** menjalankan perintah (CLI); **PATH** menentukan di mana program dicari.',
      '**Library** (kamu memanggil), **framework** (memanggil kodemu), **API** (antarmuka); dikelola oleh **manajer paket** (pip, npm, Maven).',
      '**Virtual environment** memisahkan kebergantungan antarproyek.',
      '**Git** merekam riwayat kode: repo, commit, branch, merge, remote, pull request.',
    ],
    soal: [
      {
        tanya: 'Perbedaan library dan framework adalah ...',
        benar: 'Library dipanggil oleh kodemu, sedangkan framework yang memanggil kodemu',
        salah: ['Library selalu lebih besar daripada framework', 'Framework hanya ada di Python', 'Keduanya tidak pernah memiliki kebergantungan'],
        jelas: 'Pada framework berlaku inversion of control: kerangka menentukan alur dan memanggil bagian kode yang kamu tulis.',
      },
      {
        tanya: 'Perintah untuk memasang pustaka Python bernama `requests` adalah ...',
        benar: '`pip install requests`',
        salah: ['`npm install requests`', '`git install requests`', '`python requests.exe`'],
        jelas: 'pip adalah manajer paket Python (repositori PyPI); npm untuk JavaScript.',
      },
      {
        tanya: 'Mengapa memakai virtual environment pada proyek Python?',
        benar: 'Agar tiap proyek punya kebergantungan (versi pustaka) yang terpisah',
        salah: ['Agar kode berjalan dalam bahasa lain', 'Agar Python tidak perlu dipasang', 'Agar kode otomatis menjadi lebih cepat'],
        jelas: 'Proyek berbeda bisa membutuhkan versi pustaka berbeda; lingkungan virtual mencegah bentrok.',
      },
      {
        tanya: 'Dalam Git, apa itu commit?',
        benar: 'Rekaman perubahan pada riwayat proyek dengan pesan penjelasan',
        salah: ['Penghapusan seluruh riwayat repo', 'Salinan repo di komputer orang lain', 'Program yang mengompilasi kode'],
        jelas: 'Commit adalah "foto" keadaan kode pada suatu waktu; branch dan merge dibangun di atas rangkaian commit.',
      },
    ],
  },

  'konsep-galat-debugging': {
    intisari: 'Galat dibedakan menjadi syntax (sebelum jalan), runtime (exception saat jalan), dan logic (hasil salah tanpa pesan); debugging yang sistematis mencakup membaca traceback, mempersempit masalah, dan menguji hipotesis.',
    rangkuman: [
      'Tiga jenis galat: **syntax** (sebelum jalan), **runtime** (saat jalan, ada exception), **logic** (hasil salah tanpa pesan galat).',
      'Baca **traceback dari bawah ke atas**: jenis galat, lokasi, lalu rantai pemanggilan.',
      'Langkah debugging: reproduksi → baca pesan → persempit → hipotesis → perbaiki satu hal → verifikasi.',
      'Alat: print debugging, `assert`, debugger (`breakpoint()`), linter, type checker, tes otomatis.',
    ],
    soal: [
      {
        tanya: 'Program berjalan sampai selesai tanpa pesan galat, tetapi hasilnya salah. Ini galat ...',
        benar: 'Logika',
        salah: ['Sintaks', 'Runtime', 'Linker'],
        jelas: 'Galat logika tidak memunculkan pesan; hanya terdeteksi dengan membandingkan hasil dengan yang diharapkan.',
      },
      {
        tanya: 'Dari mana sebaiknya traceback Python dibaca untuk menemukan jenis galat?',
        benar: 'Dari baris paling bawah, yang menyebut jenis galat dan pesannya',
        salah: ['Dari baris paling atas saja', 'Tidak perlu dibaca karena tidak informatif', 'Hanya dari nomor baris pertama yang disebut'],
        jelas: 'Baris terakhir memuat nama exception dan pesannya; baris di atasnya menunjukkan jejak pemanggilan menuju ke sana.',
      },
      {
        tanya: 'Exception apa yang muncul dari `int("abc")`?',
        benar: 'ValueError',
        salah: ['TypeError', 'NameError', 'KeyError'],
        jelas: 'Tipenya benar (string) tetapi nilainya tidak bisa diubah menjadi bilangan bulat, jadi ValueError.',
      },
      {
        tanya: 'Apa fungsi `assert kondisi, "pesan"`?',
        benar: 'Menghentikan program dengan pesan jelas bila kondisi bernilai salah',
        salah: ['Mengulang program sampai kondisi benar', 'Mengubah kondisi menjadi benar secara otomatis', 'Menyembunyikan galat dari pengguna'],
        jelas: 'Assertion menyatakan sesuatu yang harus benar; bila tidak, program berhenti tepat di tempat asumsi itu dilanggar.',
      },
      {
        tanya: 'Manakah langkah debugging yang TIDAK sistematis?',
        benar: 'Mengubah banyak bagian kode sekaligus sampai bug hilang',
        salah: ['Mereproduksi bug dengan langkah yang pasti', 'Mempersempit masalah dengan contoh minimal', 'Memverifikasi perbaikan setelah mengubah satu hal'],
        jelas: 'Mengubah banyak hal sekaligus membuat sulit tahu perubahan mana yang berpengaruh dan bisa menimbulkan bug baru.',
      },
    ],
  },
};
