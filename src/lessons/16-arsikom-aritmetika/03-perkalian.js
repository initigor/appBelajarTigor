export default {
  id: 'arsikom-perkalian',
  judul: 'Perkalian: Shift-and-Add dan Algoritma Booth',
  tipe: 'teks',
  xp: 20,
  materi: `
# Perkalian: Shift-and-Add dan Algoritma Booth ✖️

Perkalian di komputer pada dasarnya adalah penjumlahan berulang yang dirapikan dengan pergeseran. Di sini kamu akan menelusuri algoritmanya langkah demi langkah, persis seperti yang diminta pada soal ujian Arsikom.

## Perkalian tak bertanda: cara sekolah dalam biner

Perkalian biner jauh lebih mudah dari desimal, sebab tiap digit pengali hanya 0 atau 1:

- Digit pengali = **1** → tulis salinan bilangan yang dikali (*multiplicand*).
- Digit pengali = **0** → tulis nol.
- Tiap digit berikutnya digeser satu posisi ke kiri, lalu semua hasil sementara (*partial product*) dijumlahkan.

**Contoh: 1011 (11) × 1101 (13)**

~~~
        1011     (multiplicand M = 11)
      × 1101     (multiplier   Q = 13)
      ------
        1011     ← bit 0 = 1  → M
       0000      ← bit 1 = 0  → 0   (geser 1)
      1011       ← bit 2 = 1  → M   (geser 2)
     1011        ← bit 3 = 1  → M   (geser 3)
   ----------
   10001111      = 143   (11 × 13 = 143 ✓)
~~~

Hasil perkalian n bit × n bit membutuhkan hingga **2n bit**.

## Implementasi hardware: tiga register

Alih-alih menyiapkan 2n bit untuk semua penjumlahan, hardware memakai:

- **M**: register multiplicand (n bit).
- **A**: akumulator (n bit), awalnya 0.
- **Q**: register multiplier (n bit). Setelah selesai, hasil 2n bit berada di **A:Q** (A bagian tinggi, Q bagian rendah).
- **C**: satu bit carry dari penjumlahan.

Algoritma, diulang **n kali**:

1. Jika bit paling kanan Q (Q₀) = 1 → A = A + M (carry masuk C).
2. Geser kanan seluruh rangkaian **C, A, Q** satu bit. Bit terendah A masuk ke bit tertinggi Q, bit terendah Q lenyap (sudah dipakai).

**Contoh: 0011 (3) × 0101 (5), 4 bit**

| Langkah | Q₀ | Aksi | A | Q |
| --- | --- | --- | --- | --- |
| awal | | | 0000 | 0101 |
| 1 | 1 | A = A + M, lalu geser | 0001 | 1010 |
| 2 | 0 | hanya geser | 0000 | 1101 |
| 3 | 1 | A = A + M, lalu geser | 0001 | 1110 |
| 4 | 0 | hanya geser | 0000 | 1111 |

Hasil A:Q = \`0000 1111\` = **15** ✓.

Mengapa Q tidak habis? Tiap geser membebaskan satu bit di kiri Q yang langsung diisi bagian rendah hasil. A dan Q berbagi register 2n bit yang makin lama makin penuh oleh hasil.

## Bilangan bertanda: kenapa cara di atas gagal

Menerapkan shift-and-add pada bilangan komplemen 2 begitu saja memberi hasil salah, karena bit tanda dihitung bernilai positif 2ⁿ⁻¹ padahal seharusnya negatif. Ada dua pendekatan: ubah semua ke positif lalu perbaiki tanda hasil, atau pakai **algoritma Booth**, yang menangani bilangan bertanda secara langsung dan sekaligus mempercepat deretan bit 1.

## Algoritma Booth

### Gagasan

Deret bit 1 beruntun dapat ditulis sebagai selisih dua pangkat dua:

~~~
0111100  =  1000000 − 0000100  =  2⁶ − 2²  = 64 − 4 = 60
~~~

Jadi alih-alih menjumlahkan 4 kali untuk empat bit 1, cukup **1 pengurangan di awal** deret dan **1 penjumlahan di akhir** deret. Semakin panjang deret 1, semakin banyak yang dihemat. Booth menelusuri bit Q dari kanan dengan satu bit bantu **Q₋₁** (awalnya 0) dan memeriksa **pasangan (Q₀, Q₋₁)**:

| Q₀ Q₋₁ | Artinya | Aksi |
| --- | --- | --- |
| 0 0 | di tengah deret 0 | hanya geser |
| 1 1 | di tengah deret 1 | hanya geser |
| 1 0 | **awal** deret 1 | **A = A − M**, lalu geser |
| 0 1 | **akhir** deret 1 | **A = A + M**, lalu geser |

Geser yang dipakai adalah **geser kanan aritmetika** pada rangkaian (A, Q, Q₋₁): bit tanda A disalin ke kiri.

### Contoh: 3 × (−4), 4 bit

M = 0011 (+3), Q = 1100 (−4), −M = 1101. Hasil yang diharapkan: −12.

| Langkah | Q₀ Q₋₁ | Aksi | A | Q | Q₋₁ |
| --- | --- | --- | --- | --- | --- |
| awal | | | 0000 | 1100 | 0 |
| 1 | 0 0 | geser | 0000 | 0110 | 0 |
| 2 | 0 0 | geser | 0000 | 0011 | 0 |
| 3 | 1 0 | A = A − M = 1101, geser | 1110 | 1001 | 1 |
| 4 | 1 1 | geser | 1111 | 0100 | 1 |

Hasil A:Q = \`1111 0100\` = −128 + 64 + 32 + 16 + 4 = **−12** ✓.

Perhatikan langkah 3: pada langkah ini Q₀ = 1 dan Q₋₁ = 0, tanda awal deret 1 (bit 2 dan 3 dari Q = "11"). Karena bit tertinggi Q adalah bit tanda negatif, deret 1 itu mewakili −4. Booth menanganinya tanpa kasus khusus.

### Kelebihan dan pengembangan

- Menangani **bilangan bertanda** tanpa perlakuan khusus.
- Cepat untuk pengali dengan deret 1 panjang.
- **Booth radix-4** (modified Booth) memeriksa 3 bit sekaligus dan menghasilkan separuh jumlah hasil sementara, dipakai di banyak ALU modern.

## Perkalian di hardware modern

CPU modern tidak mengulang n langkah. Mereka menghitung **semua hasil sementara sekaligus** dengan susunan penjumlah paralel (*array multiplier*, *Wallace tree*), sehingga perkalian 64 bit selesai dalam sekitar 3–4 siklus clock, hanya sedikit lebih lambat daripada penjumlahan (1 siklus). Harganya: banyak transistor.

## Hal praktis untuk programmer

- Perkalian dua \`int\` 32 bit menghasilkan 64 bit. Di C, \`int * int\` **memotong** ke 32 bit (dan overflow bertanda = *undefined behavior*). Untuk hasil penuh, konversi dulu: \`(long long)a * b\`.
- Perkalian dengan pangkat dua = geser kiri. Kompiler otomatis melakukan \`x * 8\` → \`x << 3\`.
- Instruksi CPU biasanya menyediakan dua bentuk: perkalian dengan hasil terpotong (n bit) dan perkalian dengan hasil penuh 2n bit (disimpan di dua register, misalnya \`HI\`/\`LO\` di MIPS atau \`RDX:RAX\` di x86).

## Rangkuman

- Perkalian biner: tiap bit pengali 1 → tambahkan multiplicand yang digeser, 0 → tambahkan nol. Hasil bisa 2n bit.
- Hardware shift-and-add memakai register M, A, Q (+ carry C): ulangi n kali **(jika Q₀=1: A = A + M) lalu geser kanan C,A,Q**. Hasil di A:Q.
- **Booth** menangani bilangan bertanda: pasangan (Q₀,Q₋₁) = 10 → A−M, 01 → A+M, 00 atau 11 → hanya geser (aritmetika).
- Perkalian modern memakai array/Wallace tree sehingga paralel dan cepat. Perkalian dengan 2ⁿ cukup digeser.
`,
};
