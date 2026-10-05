export default {
  id: 'arsikom-alu',
  judul: 'Merancang ALU Sederhana',
  tipe: 'teks',
  xp: 25,
  materi: `
# Merancang ALU Sederhana 🧮

**ALU** (*Arithmetic Logic Unit*) adalah bagian CPU yang melakukan perhitungan dan operasi logika. Semua yang kamu pelajari di Bab 2–4 bertemu di sini: bilangan komplemen 2, penjumlah, gerbang, dan MUX. Setelah pelajaran ini kamu bisa menjelaskan **bagaimana CPU memilih untuk menjumlah, mengurang, atau meng-AND** hanya dengan sinyal kontrol.

## Kerangka ALU

~~~
        A (n bit) ───┐
                     ▼
                 ┌───────┐
 Kontrol ──────► │  ALU  │──► Hasil (n bit)
 (operasi)       └───────┘──► Flag: Z, N, C, V
                     ▲
        B (n bit) ───┘
~~~

Masukan: dua operand A dan B (dari register) dan sinyal **kontrol operasi**. Keluaran: **hasil** dan **flag status** (Zero, Negative, Carry, oVerflow). Bagian lain CPU (unit kontrol) menentukan operasi apa yang dijalankan.

## Satu irisan bit (1-bit ALU slice)

ALU n bit dibuat dari n irisan 1 bit yang identik. Satu irisan menghitung **semua** operasi sekaligus, lalu sebuah **MUX** memilih hasil yang diinginkan:

~~~
 A ───────────────────┬──► AND ──┐
                      ├──► OR  ──┼──► MUX ──► Hasil
 B ──► XOR ◄─Binvert  │          │     ▲
        │             │          │   Operasi
        ▼             │          │
       B' ────────────┴──► Full Adder (A, B', CarryIn) ─┘
                              └──► CarryOut
~~~

- **AND**, **OR**, dan **penjumlah** bekerja serentak pada A dan B'.
- **Binvert**: bila 1, B dibalik (B' = B ⊕ Binvert). Dengan Binvert = 1 dan CarryIn awal = 1, penjumlah mengerjakan **A − B** (A + ~B + 1).
- **MUX** (dikendalikan sinyal Operasi) meneruskan salah satu hasil.

Irisan-irisan dirantai pada jalur CarryIn/CarryOut, membentuk penjumlah ripple-carry (atau lookahead pada versi cepat).

## Tabel kontrol

Sinyal kontrol ALU dibuat dari opcode instruksi. Salah satu tabel klasik (dari buku Patterson & Hennessy) memakai kode 4 bit: bit paling kiri (Ainvert, tidak dipakai di sini), lalu Binvert, lalu 2 bit Operasi yang memilih keluaran MUX (00 = AND, 01 = OR, 10 = penjumlah, 11 = hasil SLT). CarryIn awal sama dengan Binvert.

| Kontrol | Operasi | Binvert | Pemilihan MUX |
| --- | --- | --- | --- |
| 0000 | AND | 0 | AND |
| 0001 | OR | 0 | OR |
| 0010 | ADD | 0 | penjumlah |
| 0110 | SUB | 1 | penjumlah |
| 0111 | SLT (set on less than) | 1 | penjumlah + tanda |

**SLT** menghasilkan 1 bila A < B: kurangkan A − B dan ambil **bit tanda hasilnya** (disesuaikan overflow). Itulah cara hardware melakukan perbandingan.

## Contoh penelusuran (ALU 4 bit)

A = 0110 (6), B = 0011 (3).

- **ADD**: 0110 + 0011 = **1001** (9). Pada bilangan tak bertanda hasil 9, pada bertanda 4 bit nilainya −7: terjadi **overflow bertanda** (positif + positif → negatif), jadi V = 1.
- **SUB**: Binvert = 1 → B' = 1100, CarryIn = 1: 0110 + 1100 + 1 = 1 **0011**. Hasil 0011 (3), carry keluar 1 (artinya tidak ada "pinjaman" pada tak bertanda), Z = 0, N = 0.
- **AND**: 0110 · 0011 = **0010**.
- **OR**: 0110 + 0011 = **0111**.

## Flag status

| Flag | Cara hardware menghitungnya |
| --- | --- |
| **Z** (zero) | NOR dari **semua** bit hasil: 1 jika tidak ada bit 1 |
| **N** (negative) | Bit paling kiri (MSB) hasil |
| **C** (carry) | CarryOut dari irisan MSB |
| **V** (overflow) | CarryIn ⊕ CarryOut pada irisan MSB |

Flag disimpan di **register status** dan dipakai instruksi lompat bersyarat (JZ, JNE, JG ...). Perbandingan \`if (a == b)\` dikompilasi menjadi SUB (atau CMP) yang hasilnya dibuang, lalu lompat bila Z = 1.

## Pergeseran: barrel shifter

Menggeser dengan banyak posisi tidak boleh memakan banyak siklus. **Barrel shifter** menggeser **sejauh apa pun dalam satu siklus** dengan lapisan-lapisan MUX:

~~~
Lapisan 1: geser 0 atau 1 posisi   (dikendalikan bit 0 jumlah geser)
Lapisan 2: geser 0 atau 2 posisi   (bit 1)
Lapisan 3: geser 0 atau 4 posisi   (bit 2)
Lapisan 4: geser 0 atau 8 posisi   (bit 3)
...
~~~

Untuk menggeser sebanyak k posisi, tiap lapisan mengaktifkan bit k yang bersangkutan. Untuk n = 64 hanya diperlukan log₂ 64 = **6 lapisan MUX**, bukan 63 geser berturutan.

## Operasi yang lebih kompleks

| Operasi | Lokasi umum |
| --- | --- |
| Tambah, kurang, logika, geser, bandingkan | ALU utama (1 siklus) |
| Perkalian | Unit perkalian tersendiri (beberapa siklus, pipelined) |
| Pembagian | Unit pembagi (puluhan siklus) |
| Floating point (+, ×, ÷, √) | **FPU** (*floating-point unit*) terpisah |

CPU modern memiliki **beberapa ALU** (misalnya 4 ALU bilangan bulat, 2 unit FP) supaya beberapa instruksi dapat dikerjakan bersamaan (superscalar, Bab 7).

## Rangkuman

- ALU menerima dua operand dan sinyal kontrol, menghasilkan hasil dan flag **Z, N, C, V**.
- Irisan 1-bit menghitung AND, OR, dan penjumlahan serentak, lalu **MUX** memilih hasilnya. **Binvert** + CarryIn = 1 mengubah penjumlah menjadi pengurang.
- **SLT** memakai pengurangan dan bit tanda; **Z** = NOR dari semua bit hasil; **V** = CarryIn ⊕ CarryOut MSB.
- **Barrel shifter** memakai log₂ n lapisan MUX agar geser berapa pun selesai dalam satu siklus.
- Perkalian, pembagian, dan floating point biasanya ditangani unit terpisah.
`,
};
