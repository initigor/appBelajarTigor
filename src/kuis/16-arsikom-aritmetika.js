// Bab 3 Arsikom — Aritmetika Komputer. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-penjumlahan': {
    intisari: 'Overflow tak bertanda ditandai carry keluar dari MSB, sedangkan overflow bertanda terjadi bila carry masuk ke MSB berbeda dengan carry keluarnya. Pengurangan memakai penjumlah: A − B = A + ~B + 1.',
    rangkuman: [
      'Tiap kolom penjumlahan biner menjumlahkan dua bit dan carry masuk (full adder).',
      '**Overflow tak bertanda** = carry keluar dari MSB. **Overflow bertanda** = carry masuk MSB ≠ carry keluar MSB (dua operand bertanda sama, hasil bertanda beda).',
      'Flag CPU: **Z**ero, **N**egative, **C**arry, o**V**erflow; dipakai lompat bersyarat. Perbandingan = pengurangan yang hasilnya dibuang.',
      'Pengurangan: **A − B = A + ~B + 1**, sehingga hardware penjumlah dipakai ulang.',
      'C: overflow bertanda *undefined behavior*; Java wrap-around senyap; Python tidak overflow.',
    ],
    soal: [
      {
        tanya: 'Pada penjumlahan 8 bit tak bertanda 200 + 100, apa yang terjadi?',
        benar: 'Hasil 8 bit adalah 44 dengan carry keluar bernilai 1',
        salah: ['Hasil 300 tersimpan utuh di 8 bit', 'Hasilnya 255 karena register penuh', 'Hasilnya 0 tanpa carry'],
        jelas: '300 tidak muat di 8 bit. Hasil berputar balik: 300 − 256 = 44, dan carry keluar menandai overflow tak bertanda.',
      },
      {
        tanya: 'Kapan overflow terjadi pada penjumlahan komplemen 2 (bertanda)?',
        benar: 'Saat carry masuk ke MSB berbeda dari carry keluar dari MSB',
        salah: ['Setiap kali ada carry keluar dari MSB', 'Setiap kali hasilnya nol', 'Setiap kali salah satu operand negatif'],
        jelas: 'Carry keluar saja adalah tanda overflow tak bertanda. Untuk bertanda yang diperiksa adalah ketidaksamaan carry masuk dan carry keluar MSB.',
      },
      {
        tanya: 'Dua bilangan bertanda positif dijumlahkan dan hasil 8 bit-nya memiliki MSB = 1. Apa artinya?',
        benar: 'Terjadi overflow bertanda',
        salah: ['Hasilnya benar dan negatif', 'Terjadi overflow tak bertanda saja', 'Hasilnya pasti nol'],
        jelas: 'Positif + positif tidak mungkin negatif. Contoh: 100 + 50 = 150 tidak muat (maks 127) dan terbaca sebagai −106.',
      },
      {
        tanya: 'Bagaimana ALU mengerjakan A − B memakai rangkaian penjumlah?',
        benar: 'Menghitung A + (balikan bit B) + 1',
        salah: ['Menghitung A + B lalu membalik hasilnya', 'Menghitung B − A lalu menukar tanda', 'Memakai rangkaian pengurang yang sama sekali terpisah'],
        jelas: 'Komplemen 2 dari B adalah ~B + 1, sehingga A − B = A + ~B + 1.',
      },
      {
        tanya: 'Dalam Java, berapa hasil `Integer.MAX_VALUE + 1`?',
        benar: '−2147483648',
        salah: ['2147483648', '0', 'Melempar ArithmeticException'],
        jelas: 'Java melakukan wrap-around tanpa peringatan pada int 32 bit: 0x7FFFFFFF + 1 = 0x80000000 = −2³¹.',
      },
    ],
  },

  'arsikom-logika-geser': {
    intisari: 'Operasi bitwise (AND, OR, XOR, NOT) dan pergeseran memanipulasi bit langsung. Geser kiri n kali sama dengan × 2ⁿ, dan geser kanan aritmetika menjaga tanda bilangan bertanda.',
    rangkuman: [
      '**AND** mempertahankan bit (topeng), **OR** menyalakan bit, **XOR** membalik bit, **NOT** membalik semuanya.',
      'Bit k: ambil `(x>>k)&1`, set `x|(1<<k)`, clear `x&~(1<<k)`, toggle `x^(1<<k)`.',
      'Geser kiri n = × 2ⁿ. Geser kanan logika mengisi 0; **aritmetika** mengisi bit tanda.',
      'Geser kanan aritmetika membulatkan ke bawah (−7 >> 1 = −4), berbeda dari pembagian C yang memotong ke nol (−7 / 2 = −3).',
      '`x & (x-1)` membuang bit 1 paling kanan: dasar cek pangkat dua dan popcount.',
    ],
    soal: [
      {
        tanya: 'Berapa hasil `0b1100 & 0b1010`?',
        benar: '`0b1000`',
        salah: ['`0b1110`', '`0b0110`', '`0b0010`'],
        jelas: 'AND bernilai 1 hanya jika kedua bit 1: 1100 & 1010 = 1000. (1110 adalah OR, 0110 adalah XOR.)',
      },
      {
        tanya: 'Berapa hasil `13 << 2`?',
        benar: '52',
        salah: ['26', '15', '3'],
        jelas: 'Geser kiri 2 posisi = × 4: 13 × 4 = 52 (00001101 → 00110100).',
      },
      {
        tanya: 'Bagaimana cara mematikan (clear) bit ke-k pada variabel `x`?',
        benar: '`x & ~(1 << k)`',
        salah: ['`x | (1 << k)`', '`x ^ (1 << k)`', '`x & (1 << k)`'],
        jelas: 'AND dengan topeng yang bit k-nya 0 memaksa bit itu menjadi 0 dan mempertahankan bit lain. OR menyalakan, XOR membalik.',
      },
      {
        tanya: 'Berapa nilai −8 setelah digeser kanan aritmetika satu posisi (8 bit)?',
        benar: '−4',
        salah: ['+124', '−16', '−7'],
        jelas: '11111000 digeser kanan aritmetika (mengisi bit tanda 1) menjadi 11111100 = −4. Geser logika memberi 01111100 = +124.',
      },
      {
        tanya: 'Apa hasil `12 & 11` (yaitu `x & (x - 1)` untuk x = 12)?',
        benar: '8',
        salah: ['11', '0', '4'],
        jelas: '1100 & 1011 = 1000 = 8. Ekspresi ini membuang bit 1 yang paling kanan.',
      },
    ],
  },

  'arsikom-perkalian': {
    intisari: 'Perkalian hardware dikerjakan dengan geser-dan-tambah pada register M, A, Q; algoritma Booth memperluasnya ke bilangan bertanda dengan memeriksa pasangan bit (Q₀, Q₋₁).',
    rangkuman: [
      'Hasil perkalian n bit × n bit membutuhkan hingga **2n bit**, disimpan di A:Q.',
      'Shift-and-add: ulangi n kali **(jika Q₀ = 1: A = A + M) lalu geser kanan C, A, Q**.',
      '**Booth**: (Q₀,Q₋₁) = 10 → A = A − M; 01 → A = A + M; 00 atau 11 → hanya geser aritmetika. Menangani bilangan bertanda.',
      'Booth efisien untuk deret bit 1 panjang karena `0111100 = 2⁶ − 2²`.',
      'Hardware modern memakai array multiplier / Wallace tree; perkalian dengan 2ⁿ cukup digeser kiri.',
    ],
    soal: [
      {
        tanya: 'Berapa bit maksimum yang dibutuhkan untuk hasil perkalian dua bilangan tak bertanda 8 bit?',
        benar: '16 bit',
        salah: ['8 bit', '9 bit', '32 bit'],
        jelas: 'Hasil perkalian n bit × n bit membutuhkan hingga 2n bit. Itu sebabnya hasil disimpan di pasangan register A:Q.',
      },
      {
        tanya: 'Pada algoritma Booth, apa yang dilakukan bila pasangan (Q₀, Q₋₁) = (1, 0)?',
        benar: 'A = A − M, lalu geser kanan aritmetika',
        salah: ['A = A + M, lalu geser kanan', 'Hanya geser kanan', 'Berhenti karena hasil sudah ditemukan'],
        jelas: 'Pasangan 10 menandai awal deret bit 1, sehingga multiplicand dikurangkan. Pasangan 01 (akhir deret) menjumlahkan.',
      },
      {
        tanya: 'Berapa kali iterasi dilakukan untuk mengalikan dua bilangan 8 bit dengan shift-and-add?',
        benar: '8 kali, satu per bit pengali',
        salah: ['16 kali', '4 kali', '2 kali'],
        jelas: 'Satu iterasi untuk setiap bit multiplier (Q), jadi n iterasi untuk n bit.',
      },
      {
        tanya: 'Bagaimana kompiler biasanya mengerjakan `x * 8`?',
        benar: 'Menggantinya dengan geser kiri `x << 3`',
        salah: ['Memanggil algoritma Booth penuh', 'Menjumlahkan x sebanyak 8 kali dalam loop', 'Mengalikan lewat pembagian terbalik'],
        jelas: 'Perkalian dengan pangkat dua adalah geser kiri, jauh lebih murah daripada instruksi perkalian.',
      },
      {
        tanya: 'Mengapa shift-and-add tak bertanda biasa gagal untuk bilangan komplemen 2 negatif?',
        benar: 'Bit tanda diperlakukan bernilai positif 2ⁿ⁻¹ padahal seharusnya negatif',
        salah: ['Bilangan negatif tidak dapat disimpan di register', 'Geser kiri selalu menghasilkan overflow', 'Carry tidak pernah muncul pada bilangan negatif'],
        jelas: 'Dalam komplemen 2, MSB bernilai −2ⁿ⁻¹. Shift-and-add polos menganggapnya positif, sehingga hasil salah; Booth menanganinya.',
      },
    ],
  },

  'arsikom-pembagian': {
    intisari: 'Pembagian hardware dikerjakan bit demi bit dengan pengurangan dan geser (restoring division). Pembagian jauh lebih lambat daripada perkalian, dan C/Java memotong ke nol sedangkan Python membulatkan ke bawah.',
    rangkuman: [
      'dividend = divisor × hasil bagi + sisa, dengan 0 ≤ sisa < divisor.',
      '**Restoring**: ulangi n kali (geser kiri A:Q; A = A − M; jika negatif → restore dan Q₀ = 0, jika tidak → Q₀ = 1). Q = hasil bagi, A = sisa.',
      'Pembagian memakan 20–40 siklus, jauh lebih lambat dari perkalian (3–4) dan penjumlahan (1).',
      'C/Java: `-7/2 = -3`, `-7%2 = -1`. Python: `-7//2 = -4`, `-7%2 = 1`.',
      'Pembagian bulat dengan nol memicu exception. Kompiler mengganti pembagi pangkat dua dengan geser dan pembagi konstanta dengan perkalian.',
    ],
    soal: [
      {
        tanya: 'Pada pembagian 7 ÷ 2 (bulat), berapa hasil bagi dan sisanya?',
        benar: 'Hasil bagi 3, sisa 1',
        salah: ['Hasil bagi 3, sisa 0', 'Hasil bagi 4, sisa −1', 'Hasil bagi 2, sisa 3'],
        jelas: '7 = 2 × 3 + 1, dengan sisa selalu lebih kecil dari pembagi.',
      },
      {
        tanya: 'Berapa hasil `-7 / 2` dan `-7 % 2` dalam bahasa C (C99)?',
        benar: '−3 dan −1',
        salah: ['−4 dan 1', '−3 dan 1', '−4 dan −1'],
        jelas: 'C memotong ke nol: −7/2 = −3, dan sisa mengikuti tanda pembilang: −7 − (−3×2) = −1. Python-lah yang memberi −4 dan 1.',
      },
      {
        tanya: 'Pada restoring division, apa yang dilakukan jika hasil A − M negatif?',
        benar: 'A dikembalikan dengan A + M dan bit hasil bagi diisi 0',
        salah: ['A dibiarkan negatif dan bit hasil bagi diisi 1', 'Algoritma berhenti dengan galat', 'M digeser kanan lalu dikurangkan lagi'],
        jelas: 'Negatif berarti pembagi tidak muat. Pengurangan dibatalkan (restore) dan bit hasil bagi bernilai 0.',
      },
      {
        tanya: 'Mengapa `x % 2 == 1` bukan cara andal mengecek bilangan ganjil di C/Java?',
        benar: 'Untuk x negatif ganjil hasil `x % 2` adalah −1, bukan 1',
        salah: ['Operator % tidak bekerja pada bilangan bulat', 'Karena hasil `x % 2` selalu 0', 'Karena kompiler menolak ekspresi itu'],
        jelas: 'Sisa mengikuti tanda pembilang, jadi −3 % 2 = −1. Gunakan `x % 2 != 0` atau `x & 1`.',
      },
      {
        tanya: 'Bagaimana kompiler biasanya mengerjakan `x / 8` untuk x bertipe unsigned?',
        benar: 'Menggantinya menjadi geser kanan `x >> 3`',
        salah: ['Memanggil instruksi pembagian 8 kali', 'Mengalikan x dengan 8', 'Tidak bisa dioptimasi sama sekali'],
        jelas: 'Pembagian dengan pangkat dua pada bilangan tak bertanda identik dengan geser kanan logika.',
      },
    ],
  },

  'arsikom-ieee754': {
    intisari: 'IEEE 754 menyimpan bilangan pecahan sebagai tanda, eksponen berbias, dan pecahan: (−1)^s × 1.f × 2^(E−bias). Presisinya terbatas sehingga banyak pecahan desimal hanya didekati.',
    rangkuman: [
      'Single: 1/8/23 bit, bias 127. Double: 1/11/52 bit, bias 1023. Nilai = (−1)^s × 1.f × 2^(E − bias).',
      'Langkah mengkodekan: tanda → normalisasi 1,xxx × 2^e → E = e + bias → ambil pecahan. 5,75 = `0x40B80000`.',
      'Pola khusus: E = 0 → nol atau denormal; E = 255 → ∞ (f = 0) atau NaN (f ≠ 0). NaN ≠ NaN.',
      'Presisi terbatas: single ±7 digit, double ±15–16 digit. Bilangan bulat di atas 2²⁴ tidak selalu eksak di single.',
      'Penjumlahan float tidak asosiatif; bandingkan dengan toleransi dan jangan pakai float untuk uang.',
    ],
    soal: [
      {
        tanya: 'Bagaimana 32 bit single precision IEEE 754 dibagi?',
        benar: '1 bit tanda, 8 bit eksponen, 23 bit pecahan',
        salah: ['1 bit tanda, 11 bit eksponen, 20 bit pecahan', '8 bit tanda, 1 bit eksponen, 23 bit pecahan', '1 bit tanda, 23 bit eksponen, 8 bit pecahan'],
        jelas: 'Single memakai 1/8/23 dengan bias 127, sedangkan double memakai 1/11/52 dengan bias 1023.',
      },
      {
        tanya: 'Berapa nilai desimal bilangan single `0x41200000`?',
        benar: '10,0',
        salah: ['5,0', '2,5', '20,0'],
        jelas: 'E = 10000010 = 130 → e = 3. Pecahan 0100… → 1,01₂ × 2³ = 1010₂ = 10.',
      },
      {
        tanya: 'Bagaimana 5,75 dikodekan dalam single precision?',
        benar: '`0x40B80000`',
        salah: ['`0x40580000`', '`0xC0B80000`', '`0x41B80000`'],
        jelas: '5,75 = 1,0111₂ × 2² → E = 129 = 10000001, pecahan 0111… → 0 10000001 0111000… = 0x40B80000. (0xC0… berarti negatif.)',
      },
      {
        tanya: 'Pola eksponen semua 1 (E = 255 pada single) dengan pecahan tidak nol berarti ...',
        benar: 'NaN (Not a Number)',
        salah: ['Tak hingga positif', 'Nol negatif', 'Bilangan normal terbesar'],
        jelas: 'E = 255 dengan f = 0 adalah ±∞, sedangkan f ≠ 0 adalah NaN (misalnya hasil 0/0).',
      },
      {
        tanya: 'Cara yang tepat memeriksa apakah dua nilai floating point "sama" adalah ...',
        benar: 'Memeriksa apakah selisih mutlaknya lebih kecil dari toleransi kecil',
        salah: ['Memakai operator `==` karena float selalu eksak', 'Mengubah keduanya ke string lalu membandingkannya', 'Menjumlahkan keduanya dan memeriksa apakah genap'],
        jelas: 'Pembulatan membuat hasil perhitungan yang secara matematis sama bisa berbeda sedikit, sehingga bandingkan dengan toleransi (`math.isclose`).',
      },
    ],
  },
};
