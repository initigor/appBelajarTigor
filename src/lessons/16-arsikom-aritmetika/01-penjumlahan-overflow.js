export default {
  id: 'arsikom-penjumlahan',
  judul: 'Penjumlahan, Pengurangan, dan Overflow',
  tipe: 'teks',
  xp: 20,
  materi: `
# Penjumlahan, Pengurangan, dan Overflow ➕

Penjumlahan adalah operasi paling mendasar di ALU. Hampir semua operasi lain (pengurangan, perkalian, perbandingan, alamat memori) dibangun darinya. Di pelajaran ini kamu belajar cara kerjanya bit demi bit, dan yang lebih penting: **kapan hasilnya salah**.

## Penjumlahan biner

Aturannya sama dengan desimal, hanya lebih sederhana. Tiap kolom menjumlahkan dua bit ditambah **carry** (bawaan) dari kolom kanan:

| Bit A | Bit B | Carry masuk | Hasil | Carry keluar |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Inilah tabel kebenaran sebuah **full adder** (pelajaran Logika Digital akan membangunnya dari gerbang).

**Contoh 8 bit tak bertanda: 45 + 30**

~~~
carry :  0 1 1 1 1 0 0 0
A     :  0 0 1 0 1 1 0 1   (45)
B     :  0 0 0 1 1 1 1 0   (30)
         ---------------
hasil :  0 1 0 0 1 0 1 1   (75)  ✓
~~~

## Overflow: hasil tidak muat

Register hanya punya n bit. Jika hasil sebenarnya membutuhkan lebih dari n bit, sebagian hilang. Bergantung pada interpretasi bilangan (tak bertanda atau bertanda), "tidak muat" berarti hal berbeda.

### Overflow pada bilangan tak bertanda

Terjadi bila ada **carry keluar dari bit paling kiri (MSB)**.

~~~
   11001000  (200)
 + 01100100  (100)
 ----------
 1 00101100  → carry keluar = 1, hasil 8 bit = 44
~~~

300 tidak muat di 8 bit (maksimum 255). Hasil 44 = 300 − 256 (berputar balik, *wrap-around*).

### Overflow pada bilangan bertanda (komplemen 2)

Carry keluar **bukan** tanda overflow bertanda. Tandanya berbeda:

> Overflow bertanda terjadi bila **carry masuk ke MSB ≠ carry keluar dari MSB**.
> Cara mudah: jika dua operand **bertanda sama** tetapi hasilnya **bertanda berbeda**.

~~~
   01100100  (+100)
 + 00110010  (+50)
 ----------
   10010110  → dibaca sebagai −106 (bukan +150!)
~~~

150 tidak muat dalam rentang −128…127. Hasil +100 + 50 yang "negatif" jelas keliru.

Dua fakta penting:

- Menjumlahkan **positif + negatif tidak pernah overflow** (hasil selalu antara kedua operand).
- Bilangan yang sama bisa menjadi overflow tak bertanda tetapi tidak overflow bertanda, dan sebaliknya. Contoh: \`11111111 + 00000001\` = carry keluar 1 (overflow unsigned: 255+1) tetapi sebagai bilangan bertanda itu −1 + 1 = 0 (tidak overflow).

## Flag status CPU

ALU menghasilkan beberapa bit status yang disimpan di register flag (*status register*). Empat yang paling umum:

| Flag | Nama | Menyala bila |
| --- | --- | --- |
| **Z** | Zero | Hasil = 0 |
| **N** (atau S) | Negative/Sign | Bit tertinggi hasil = 1 |
| **C** | Carry | Ada carry keluar dari MSB (overflow tak bertanda) |
| **V** (atau O) | Overflow | Overflow bertanda |

Satu operasi penjumlahan menghasilkan semua flag sekaligus. Instruksi **lompat bersyarat** kemudian memeriksanya (\`JE\`, \`JG\`, \`JB\`, ...). Karena itu instruksi perbandingan pada dasarnya adalah **pengurangan yang hasilnya dibuang**, hanya flag-nya yang dipakai.

## Pengurangan memakai penjumlahan

Berkat komplemen 2, pengurangan tidak butuh rangkaian khusus:

~~~
A − B = A + (−B) = A + (~B) + 1
~~~

**Contoh 4 bit: 9 − 5**

~~~
 A  = 1001       (9)
~B  = 1010       (balik bit dari 0101)
+1  (carry masuk awal = 1)
      1001
    + 1010
    +    1
    ------
     10100  → buang carry → 0100 = 4  ✓
~~~

Rangkaian pengurang di hardware berupa penjumlah yang input B-nya dilewatkan XOR dengan sinyal "kurangi", lalu carry awalnya diset 1 (Bab 4).

## Overflow di bahasa pemrograman

| Bahasa | Perilaku saat int bertanda overflow |
| --- | --- |
| **C / C++** | *Undefined behavior* untuk tipe bertanda (compiler bebas berasumsi tidak pernah terjadi!). Tipe \`unsigned\` terdefinisi: wrap-around modulo 2ⁿ |
| **Java** | Wrap-around senyap: \`Integer.MAX_VALUE + 1\` = \`-2147483648\` |
| **Python** | Tidak overflow: bilangan bulat berukuran bebas (otomatis diperluas) |

Cara memeriksa sebelum menjumlahkan di C:

~~~c
#include <limits.h>
int aman_tambah(int a, int b) {
    if (b > 0 && a > INT_MAX - b) return 0;   // akan overflow ke atas
    if (b < 0 && a < INT_MIN - b) return 0;   // akan overflow ke bawah
    return 1;
}
~~~

Overflow bukan masalah teori. Roket **Ariane 5** (1996) hancur beberapa detik setelah lepas landas karena konversi angka 64-bit ke bilangan bulat 16-bit yang overflow di perangkat lunak navigasi. Penghitung penonton video musik "Gangnam Style" di YouTube melampaui 2.147.483.647 pada 2014, batas bilangan 32 bit bertanda, dan YouTube kemudian memperbesar tipenya menjadi 64 bit.

### Aritmetika saturasi

Pada pengolahan gambar dan audio, wrap-around tidak diinginkan: piksel yang sudah putih (255) ditambah terang tidak seharusnya menjadi hitam. CPU/DSP menyediakan penjumlahan **saturasi** yang menahan hasil di nilai maksimum (255) alih-alih berputar balik.

## Rangkuman

- Penjumlahan biner: tiap kolom menjumlahkan dua bit dan carry masuk (full adder).
- **Overflow tak bertanda** = carry keluar dari MSB. **Overflow bertanda** = carry masuk MSB ≠ carry keluar MSB (dua operand bertanda sama menghasilkan tanda berbeda).
- Flag CPU: **Z**ero, **N**egative, **C**arry, o**V**erflow, dipakai oleh instruksi lompat bersyarat.
- Pengurangan: A − B = A + ~B + 1, sehingga hardware penjumlah dipakai ulang.
- C: overflow bertanda adalah undefined behavior, unsigned wrap-around; Java wrap-around; Python tidak overflow.
`,
};
