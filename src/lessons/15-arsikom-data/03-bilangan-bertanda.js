export default {
  id: 'arsikom-bertanda',
  judul: 'Bilangan Bertanda: Sign-Magnitude, Komplemen 1, Komplemen 2',
  tipe: 'teks',
  xp: 20,
  materi: `
# Bilangan Bertanda: Komplemen 2 ➖

Bilangan biner biasa hanya bisa menyatakan 0 ke atas. Bagaimana menyimpan **−5**? Perangkat keras tidak punya tanda minus, hanya bit. Ada beberapa cara menyandikan tanda. Hanya satu yang menang: **komplemen 2** (*two's complement*), dipakai oleh hampir semua komputer di dunia.

Kita pakai 8 bit sebagai contoh. Bit paling kiri (MSB, *most significant bit*) berperan sebagai **bit tanda**: 0 = positif, 1 = negatif.

## Cara 1: Sign-Magnitude

MSB = tanda, 7 bit sisanya = besaran (nilai mutlak).

~~~
+5 = 0 0000101
−5 = 1 0000101      ← hanya bit tanda yang dibalik
~~~

- Rentang: **−127 sampai +127**.
- Masalah 1: ada **dua nol**: \`00000000\` (+0) dan \`10000000\` (−0).
- Masalah 2: penjumlahan butuh logika rumit (cek tanda, bandingkan besaran, pilih tambah atau kurang).

## Cara 2: Komplemen 1

Bilangan negatif = **membalik semua bit** bilangan positifnya.

~~~
+5 = 00000101
−5 = 11111010
~~~

- Rentang: −127 sampai +127. Masih **dua nol**: \`00000000\` dan \`11111111\`.
- Penjumlahan butuh trik *end-around carry* (carry dari MSB ditambahkan lagi ke LSB).

## Cara 3: Komplemen 2 (yang dipakai komputer)

Bilangan negatif = **komplemen 1 lalu tambah 1**.

~~~
+5           = 00000101
balik bit    = 11111010
tambah 1     = 11111011   ← inilah −5
~~~

### Membaca nilai komplemen 2

MSB bernilai **negatif**: −2ⁿ⁻¹. Bit lain seperti biasa.

~~~
11111011 = −1·128 + 1·64 + 1·32 + 1·16 + 1·8 + 0·4 + 1·2 + 1·1
         = −128 + 64 + 32 + 16 + 8 + 2 + 1
         = −128 + 123 = −5   ✓
~~~

### Rentang

Untuk n bit: **−2ⁿ⁻¹ sampai 2ⁿ⁻¹ − 1**.

| Bit | Rentang bertanda | Rentang tak bertanda |
| --- | --- | --- |
| 8 | −128 … 127 | 0 … 255 |
| 16 | −32.768 … 32.767 | 0 … 65.535 |
| 32 | −2.147.483.648 … 2.147.483.647 | 0 … 4.294.967.295 |
| 64 | ±9,22 × 10¹⁸ | 0 … 1,8 × 10¹⁹ |

Perhatikan **asimetri**: ada satu bilangan negatif lebih banyak daripada positif (−128 ada, +128 tidak). Itu karena nol memakai satu pola dari sisi "non-negatif".

### Keunggulan komplemen 2

1. **Hanya satu nol** (\`00000000\`).
2. **Penjumlahan dan pengurangan memakai rangkaian yang sama** untuk bilangan bertanda dan tak bertanda. CPU tidak perlu tahu apakah bit-bit itu dianggap bertanda atau tidak, hanya interpretasinya yang beda.
3. **Pengurangan = penjumlahan dengan negasi**: A − B = A + (−B). Tidak perlu rangkaian pengurang terpisah.

Contoh: 5 + (−3)

~~~
   00000101   (+5)
 + 11111101   (−3)
 ----------
 1 00000010   → buang carry keluar → 00000010 = +2  ✓
~~~

Contoh: −5 + (−3)

~~~
   11111011   (−5)
 + 11111101   (−3)
 ----------
 1 11111000   → buang carry → 11111000 = −128+64+32+16+8 = −8  ✓
~~~

### Jalan pintas menegasikan (membalik tanda)

Dari kanan, **salin semua bit sampai bit '1' pertama (termasuk)**, lalu **balik semua bit sisanya**.

~~~
 0010 1100  (44)
 salin 100 dari kanan, balik sisanya:
 1101 0100  (−44)
~~~

Cek: 11010100 = −128 + 64 + 16 + 4 = −44 ✓.

### Kasus khusus: negasi bilangan terkecil

Tak ada +128 di 8 bit, jadi menegasikan −128 (\`10000000\`) menghasilkan **−128 lagi** (balik → 01111111, tambah 1 → 10000000). Di C, \`abs(INT_MIN)\` adalah *undefined behavior* karena alasan yang sama.

## Perluasan tanda (*sign extension*)

Memperlebar bilangan bertanda dari 8 ke 16 bit tanpa mengubah nilainya: **salin bit tanda ke bit-bit baru di kiri**.

~~~
−5 (8 bit)   = 11111011
−5 (16 bit)  = 1111111111111011       ← diisi 1
+5 (8 bit)   = 00000101
+5 (16 bit)  = 0000000000000101       ← diisi 0
~~~

Untuk bilangan **tak bertanda** yang dipakai adalah *zero extension* (isi dengan 0). Kesalahan memilih keduanya adalah sumber bug klasik saat menggeser tipe data di C.

## Contoh jebakan di C

~~~c
#include <stdio.h>
int main(void) {
    unsigned char u = 200;          // 11001000
    signed char   s = (signed char)u;
    printf("%d %d\\n", u, s);        // 200 -56  (11001000 = -128+64+8)

    int a = -1;
    unsigned int b = 1;
    if (a < b) printf("benar\\n");
    else       printf("salah\\n");   // cetak "salah"!
    return 0;
}
~~~

Pada perbandingan \`a < b\`, \`a\` dikonversi ke unsigned: \`-1\` menjadi \`0xFFFFFFFF\` = 4.294.967.295, jauh lebih besar dari 1. Aturan praktis: **jangan mencampur bilangan bertanda dan tak bertanda dalam satu ekspresi**.

## Cara keempat (sekilas): representasi *excess-K* / bias

Nilai disimpan sebagai (nilai asli + K). Dengan K = 127 pada 8 bit, nilai −127…128 disimpan sebagai 0…255. Cara ini dipakai untuk **eksponen pada floating point** (pelajaran berikutnya), supaya bilangan bisa dibandingkan seperti bilangan tak bertanda.

## Rangkuman

- **Sign-magnitude** dan **komplemen 1** punya dua representasi nol dan penjumlahan yang rumit. **Komplemen 2** tidak.
- Komplemen 2: negatif = balik semua bit + 1. Rentang n bit: **−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1**; MSB bernilai −2ⁿ⁻¹.
- Penjumlahan/pengurangan memakai hardware yang sama untuk bertanda dan tak bertanda; A − B = A + (−B).
- Perluasan tanda: salin MSB ke bit tambahan (bertanda) atau isi 0 (tak bertanda).
- Waspadai campuran signed/unsigned di C dan negasi dari bilangan terkecil.
`,
};
