// Bab 2 Arsikom — Representasi Data. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-sistem-bilangan': {
    intisari: 'Komputer memakai biner karena rangkaian dua keadaan murah dan tahan derau. Nilai bilangan posisional = Σ digit × basis^posisi, dan satu digit heksa tepat mewakili 4 bit.',
    rangkuman: [
      'Sistem posisional: nilai = Σ digit × basis^posisi. Basis penting: 2 (biner), 8 (oktal), 10 (desimal), 16 (heksa).',
      'n bit menampung **2ⁿ nilai**; bilangan tak bertanda terbesar adalah **2ⁿ − 1**.',
      'Satu digit heksa = **4 bit**, satu digit oktal = **3 bit**. Heksa dipakai untuk alamat memori dan warna, oktal untuk izin berkas Unix.',
      'Byte = 8 bit. Word bergantung arsitektur. **kB = 1.000 byte**, sedangkan **KiB = 1.024 byte**.',
      'Di C/Java, literal berawalan `0` adalah oktal: `010` bernilai 8.',
    ],
    soal: [
      {
        tanya: 'Berapa nilai desimal dari bilangan biner `1101`?',
        benar: '13',
        salah: ['11', '14', '15'],
        jelas: '1101₂ = 1·8 + 1·4 + 0·2 + 1·1 = 13.',
      },
      {
        tanya: 'Berapa bilangan tak bertanda terbesar yang dapat disimpan dalam 10 bit?',
        benar: '1.023',
        salah: ['1.024', '1.000', '512'],
        jelas: 'Nilai terbesar n bit adalah 2ⁿ − 1 = 2¹⁰ − 1 = 1.023. Angka 1.024 adalah jumlah kombinasinya, bukan nilai terbesarnya.',
      },
      {
        tanya: 'Berapa nilai desimal dari `0x2F`?',
        benar: '47',
        salah: ['37', '62', '215'],
        jelas: '0x2F = 2·16 + 15 = 32 + 15 = 47. Huruf F bernilai 15.',
      },
      {
        tanya: 'Mengapa flashdisk berlabel "64 GB" terbaca sekitar 59,6 GiB di sistem operasi?',
        benar: 'Produsen memakai 1 GB = 10⁹ byte, sedangkan OS menampilkan dalam kelipatan 2³⁰ byte',
        salah: ['Sebagian kapasitas selalu dipakai untuk sistem file', 'Flashdisk rusak sehingga kapasitasnya berkurang', 'Karena 1 byte sama dengan 10 bit'],
        jelas: '64 × 10⁹ / 2³⁰ ≈ 59,6. Selisih ini murni akibat dua definisi awalan (SI vs biner), bukan kerusakan.',
      },
      {
        tanya: 'Di bahasa C, berapa nilai `int x = 010;`?',
        benar: '8',
        salah: ['10', '2', 'Error kompilasi'],
        jelas: 'Literal berawalan 0 adalah oktal. 010₈ = 1·8 + 0 = 8.',
      },
    ],
  },

  'arsikom-konversi': {
    intisari: 'Desimal ke biner memakai pembagian 2 berulang (sisa dibaca dari bawah), biner ke heksa memakai pengelompokan 4 bit, dan banyak pecahan desimal tidak berhingga di biner.',
    rangkuman: [
      '**Ke desimal**: jumlahkan digit × basis^posisi (posisi dihitung dari kanan mulai 0).',
      '**Desimal → biner**: bagi 2 berulang, baca sisa dari **bawah ke atas**. Untuk pecahan: kali 2 berulang, baca bagian bulat dari atas ke bawah.',
      '**Biner ↔ heksa**: kelompok 4 bit dari kanan. **Biner ↔ oktal**: kelompok 3 bit. Lengkapi 0 di kiri.',
      'Pecahan seperti 0,1 berulang tak berhingga di biner (`0,000110011…`) sehingga hanya bisa didekati.',
      'Selalu verifikasi balik ke desimal setelah konversi.',
    ],
    soal: [
      {
        tanya: 'Ubah 156 (desimal) ke biner.',
        benar: '10011100',
        salah: ['10011010', '10101100', '11001100'],
        jelas: '156 = 128 + 16 + 8 + 4 → bit 2⁷, 2⁴, 2³, 2² bernilai 1 → 10011100.',
      },
      {
        tanya: 'Berapa nilai desimal dari `0xB7`?',
        benar: '183',
        salah: ['171', '177', '187'],
        jelas: '0xB7 = 11·16 + 7 = 176 + 7 = 183.',
      },
      {
        tanya: 'Ubah `1101011110` (biner) ke heksadesimal.',
        benar: '0x35E',
        salah: ['0x3AE', '0xD78', '0x1B7'],
        jelas: 'Kelompok 4 bit dari kanan: 11 | 0101 | 1110 → 0011 | 0101 | 1110 → 3, 5, E.',
      },
      {
        tanya: 'Berapa bentuk biner dari pecahan desimal 0,625?',
        benar: '0,101',
        salah: ['0,011', '0,110', '0,1001'],
        jelas: '0,625×2 = 1,25 (bit 1); 0,25×2 = 0,5 (bit 0); 0,5×2 = 1,0 (bit 1). Hasil 0,101₂ = 0,5 + 0,125.',
      },
      {
        tanya: 'Mengapa `0.1 + 0.2 == 0.3` bernilai `false` di hampir semua bahasa pemrograman?',
        benar: 'Pecahan 0,1 dan 0,2 berulang tak berhingga di biner sehingga hanya tersimpan sebagai pendekatan',
        salah: ['Operator + tidak akurat untuk bilangan desimal', 'Itu bug pada interpreter Python', 'Komputer tidak bisa menyimpan angka di bawah 1'],
        jelas: 'Hanya pecahan berpenyebut pangkat dua yang eksak di biner. Pendekatan 0,1 dan 0,2 yang dijumlahkan sedikit berbeda dari pendekatan 0,3.',
      },
    ],
  },

  'arsikom-bertanda': {
    intisari: 'Komputer memakai komplemen 2 untuk bilangan bertanda: negatif = balik semua bit lalu tambah 1. Dengan itu penjumlahan dan pengurangan memakai satu rangkaian yang sama.',
    rangkuman: [
      'Sign-magnitude dan komplemen 1 punya **dua representasi nol** dan penjumlahan yang rumit.',
      'Komplemen 2: negatif = **balik semua bit + 1**. Rentang n bit: **−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1**. MSB bernilai −2ⁿ⁻¹.',
      'Pengurangan A − B dikerjakan sebagai A + (−B), dan carry keluar dibuang.',
      'Perluasan tanda: salin MSB ke bit baru (bertanda), atau isi 0 (tak bertanda).',
      'Hati-hati mencampur signed dan unsigned di C, serta negasi dari bilangan terkecil (−128 pada 8 bit).',
    ],
    soal: [
      {
        tanya: 'Bagaimana −5 dinyatakan dalam komplemen 2 dengan 8 bit?',
        benar: '11111011',
        salah: ['10000101', '11111010', '00000101'],
        jelas: '+5 = 00000101 → balik bit = 11111010 → tambah 1 = 11111011. (10000101 adalah sign-magnitude, 11111010 komplemen 1.)',
      },
      {
        tanya: 'Berapa nilai desimal pola 8 bit `10000001` jika dibaca sebagai komplemen 2?',
        benar: '−127',
        salah: ['−1', '129', '−126'],
        jelas: 'MSB bernilai −128, ditambah bit terendah 1: −128 + 1 = −127.',
      },
      {
        tanya: 'Berapa rentang bilangan bertanda komplemen 2 dengan 16 bit?',
        benar: '−32.768 sampai 32.767',
        salah: ['−32.767 sampai 32.767', '0 sampai 65.535', '−65.536 sampai 65.535'],
        jelas: 'Rentang = −2¹⁵ sampai 2¹⁵ − 1. Ada satu bilangan negatif lebih banyak karena nol memakai satu pola dari sisi non-negatif.',
      },
      {
        tanya: 'Hasil penjumlahan 8 bit `00001010` + `11110110` (setelah carry keluar dibuang)?',
        benar: '00000000',
        salah: ['11111111', '00000100', '10000000'],
        jelas: '11110110 = −10, jadi 10 + (−10) = 0. Hasil penuh 1 00000000; carry ke-9 dibuang.',
      },
      {
        tanya: 'Perluas −3 (`11111101`, 8 bit) menjadi 16 bit dengan sign extension.',
        benar: '1111111111111101',
        salah: ['0000000011111101', '1000000011111101', '1111111100000011'],
        jelas: 'Bit tanda (1) disalin ke 8 bit baru di kiri. Mengisi 0 menghasilkan 253 (zero extension), yang mengubah nilainya.',
      },
    ],
  },

  'arsikom-karakter': {
    intisari: 'Karakter disimpan sebagai angka menurut sebuah encoding. ASCII memakai 7 bit; Unicode memberi nomor ke semua karakter dunia dan UTF-8 menyimpannya dalam 1–4 byte.',
    rangkuman: [
      '**ASCII**: 7 bit, 128 karakter. Huruf besar dan kecil beda 32; digit `0` dimulai dari 48 sehingga nilai digit = `c - \'0\'`.',
      '**Unicode** memberi *code point* (U+0041, U+1F600). **UTF-8/16/32** adalah cara menyimpan code point sebagai byte.',
      '**UTF-8**: panjang variabel 1–4 byte, kompatibel dengan ASCII, standar web.',
      'String C berakhir dengan byte 0 dan `strlen` menghitung **byte**, bukan karakter.',
      '**BCD** menyimpan tiap digit desimal dalam 4 bit: akurat untuk desimal tetapi boros.',
    ],
    soal: [
      {
        tanya: 'Dalam C, apa hasil ekspresi `\'9\' - \'0\'`?',
        benar: '9 (bilangan bulat)',
        salah: ['57', '48', 'Karakter \'9\''],
        jelas: 'Kode ASCII \'9\' = 57 dan \'0\' = 48, selisihnya 9. Inilah cara standar mengubah karakter digit menjadi nilainya.',
      },
      {
        tanya: 'Berapa byte yang dibutuhkan UTF-8 untuk karakter "é" (U+00E9)?',
        benar: '2 byte',
        salah: ['1 byte', '3 byte', '4 byte'],
        jelas: 'Code point U+0080–U+07FF memakai 2 byte (110xxxxx 10xxxxxx). é dikodekan sebagai C3 A9.',
      },
      {
        tanya: 'Mengapa `strlen("é")` bernilai 2 pada berkas berenkode UTF-8?',
        benar: '`strlen` menghitung byte, dan é memakai 2 byte',
        salah: ['é dihitung sebagai dua karakter terpisah oleh Unicode', '`strlen` selalu menambah 1 untuk karakter non-ASCII', 'Karena é adalah karakter kontrol'],
        jelas: '`strlen` berhenti pada byte 0 dan menghitung byte, bukan karakter Unicode. Karakter non-ASCII di UTF-8 memakai lebih dari satu byte.',
      },
      {
        tanya: 'Berapa byte UTF-8 untuk emoji 😀 (U+1F600)?',
        benar: '4 byte',
        salah: ['2 byte', '3 byte', '1 byte'],
        jelas: 'Code point di atas U+FFFF memakai 4 byte (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx): F0 9F 98 80.',
      },
      {
        tanya: 'Bagaimana angka desimal 59 disimpan dalam BCD?',
        benar: '0101 1001',
        salah: ['0011 1011', '0101 1011', '1001 0101'],
        jelas: 'Tiap digit desimal memakai 4 bit sendiri: 5 → 0101 dan 9 → 1001. Biner murni 59 adalah 111011.',
      },
    ],
  },

  'arsikom-endian': {
    intisari: 'Endianness menentukan urutan byte sebuah nilai di memori (little-endian pada x86/ARM), sedangkan alignment dan padding memengaruhi alamat serta ukuran struct.',
    rangkuman: [
      '**Big-endian**: byte terbesar di alamat terendah. **Little-endian**: byte terkecil di alamat terendah (x86, ARM modern). Jaringan memakai big-endian.',
      'Endianness hanya memengaruhi urutan **byte** dalam satu nilai multi-byte, bukan urutan bit dalam byte dan bukan urutan elemen array.',
      'Alamat n bit menjangkau **2ⁿ byte** (32 bit = 4 GiB).',
      '**Alignment**: data k byte sebaiknya di alamat kelipatan k agar diakses dalam satu operasi.',
      'Compiler C menambah **padding** di struct, sehingga urutan anggota memengaruhi `sizeof`.',
    ],
    soal: [
      {
        tanya: 'Nilai 32 bit `0x12345678` disimpan little-endian mulai alamat 0x1000. Byte apa yang ada di alamat 0x1000?',
        benar: '0x78',
        salah: ['0x12', '0x34', '0x56'],
        jelas: 'Little-endian menaruh byte terkecil (LSB) di alamat terendah: 78 56 34 12.',
      },
      {
        tanya: 'Urutan byte yang dipakai protokol jaringan (network byte order) adalah ...',
        benar: 'Big-endian',
        salah: ['Little-endian', 'Mengikuti urutan CPU pengirim', 'Urutan acak yang disepakati tiap koneksi'],
        jelas: 'Standar TCP/IP memakai big-endian. Karena itu mesin little-endian harus mengonversi dengan `htonl`/`htons` sebelum mengirim.',
      },
      {
        tanya: 'Dengan `int` 4 byte dan alignment 4, berapa `sizeof` struct `{ char a; int b; char c; }`?',
        benar: '12 byte',
        salah: ['6 byte', '8 byte', '9 byte'],
        jelas: 'a di offset 0, padding 3 byte, b di offset 4–7, c di offset 8, lalu padding 3 byte agar total kelipatan 4 = 12.',
      },
      {
        tanya: 'Berapa ukuran ruang alamat memori pada sistem dengan alamat 32 bit (byte-addressable)?',
        benar: '4 GiB',
        salah: ['32 MiB', '1 GiB', '16 GiB'],
        jelas: '2³² byte = 4.294.967.296 byte = 4 GiB.',
      },
      {
        tanya: 'Apa yang TIDAK dipengaruhi oleh endianness?',
        benar: 'Urutan karakter "ABCD" dalam array char',
        salah: ['Urutan byte pada int 32 bit di memori', 'Hasil membaca bilangan 16 bit dari berkas biner', 'Tampilan byte dalam dump memori suatu bilangan'],
        jelas: 'Array byte tersimpan berurutan A, B, C, D pada kedua jenis mesin. Endianness hanya mengatur urutan byte di dalam satu nilai multi-byte.',
      },
    ],
  },

  'arsikom-deteksi-error': {
    intisari: 'Redundansi bit memungkinkan deteksi dan koreksi kesalahan: parity hanya mendeteksi kesalahan ganjil, sedangkan kode Hamming dapat menunjuk dan mengoreksi satu bit yang salah.',
    rangkuman: [
      '**Parity**: 1 bit ekstra agar jumlah bit 1 genap/ganjil. Hanya mendeteksi kesalahan **ganjil**, tidak bisa mengoreksi.',
      '**Jarak Hamming** minimum d: mendeteksi d−1 bit dan mengoreksi ⌊(d−1)/2⌋ bit.',
      '**Hamming(7,4)**: bit paritas di posisi 1, 2, 4 (pangkat dua). Sindrom = nomor posisi bit yang salah.',
      '**SECDED** (koreksi 1 bit, deteksi 2 bit) dipakai di memori ECC server.',
      '**CRC** dipakai untuk jaringan dan berkas karena andal mendeteksi kesalahan beruntun (burst).',
    ],
    soal: [
      {
        tanya: 'Data 7 bit `1101011`. Berapa bit paritas yang ditambahkan untuk even parity?',
        benar: '1',
        salah: ['0', '2', 'Tidak perlu ditambah'],
        jelas: 'Jumlah bit 1 pada 1101011 adalah 5 (ganjil). Bit paritas 1 membuat totalnya 6 (genap).',
      },
      {
        tanya: 'Kesalahan apa yang TIDAK dapat dideteksi oleh satu bit paritas?',
        benar: 'Dua bit yang berubah sekaligus',
        salah: ['Satu bit yang berubah', 'Tiga bit yang berubah', 'Lima bit yang berubah'],
        jelas: 'Dua bit yang berubah menjaga paritas tetap sama, sehingga lolos. Parity hanya mendeteksi jumlah kesalahan ganjil.',
      },
      {
        tanya: 'Sebuah kode memiliki jarak Hamming minimum 3. Apa kemampuannya?',
        benar: 'Mendeteksi 2 kesalahan dan mengoreksi 1 kesalahan',
        salah: ['Mengoreksi 2 kesalahan', 'Hanya mendeteksi 1 kesalahan', 'Mengoreksi 3 kesalahan tetapi tidak mendeteksi apa pun'],
        jelas: 'Mendeteksi d−1 = 2 bit dan mengoreksi ⌊(3−1)/2⌋ = 1 bit.',
      },
      {
        tanya: 'Pada kode Hamming(7,4), di posisi manakah bit-bit paritas diletakkan?',
        benar: '1, 2, dan 4',
        salah: ['5, 6, dan 7', '1, 3, dan 5', '3, 5, dan 6'],
        jelas: 'Bit paritas ditaruh di posisi pangkat dua (1, 2, 4); posisi 3, 5, 6, 7 untuk data.',
      },
      {
        tanya: 'Setelah menerima kata Hamming(7,4), penerima mendapat sindrom `110` (biner). Bit di posisi berapa yang salah?',
        benar: 'Posisi 6',
        salah: ['Posisi 3', 'Posisi 4', 'Tidak ada yang salah'],
        jelas: 'Sindrom dibaca sebagai bilangan biner s4 s2 s1 = 110₂ = 6, sehingga bit posisi 6 yang harus dibalik.',
      },
    ],
  },
};
