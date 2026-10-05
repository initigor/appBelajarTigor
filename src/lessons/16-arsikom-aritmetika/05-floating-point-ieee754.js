export default {
  id: 'arsikom-ieee754',
  judul: 'Bilangan Pecahan: Floating Point IEEE 754',
  tipe: 'teks',
  xp: 25,
  materi: `
# Bilangan Pecahan: Floating Point IEEE 754 🔬

Bagaimana komputer menyimpan 3,14 atau 6,02 × 10²³? Bilangan bulat tidak cukup. Solusinya mirip **notasi ilmiah**: simpan **angka penting** (significand) dan **eksponen** secara terpisah, sehingga titik desimalnya "mengambang" (*floating*). Standarnya adalah **IEEE 754** (1985, direvisi 2008 dan 2019), dipakai oleh hampir semua CPU, GPU, dan bahasa pemrograman.

## Ide dasar: notasi ilmiah dalam biner

Desimal: 5,75 = 5,75 × 10⁰. Biner: 5,75 = 101,11₂ = **1,0111₂ × 2²** (geser titik sehingga hanya ada satu angka 1 di depan koma, disebut **bentuk ternormalisasi**).

Setiap bilangan ternormalisasi memiliki bentuk:

~~~
(−1)^s  ×  1.f  ×  2^e
~~~

Tiga bagian yang disimpan: **tanda s** (1 bit), **eksponen e**, dan **pecahan f** (digit setelah koma). Angka **1** di depan koma selalu ada pada bentuk ternormalisasi, jadi **tidak disimpan** (*hidden bit*), memberi satu bit presisi gratis.

## Format single dan double precision

| | Single (float, 32 bit) | Double (double, 64 bit) |
| --- | --- | --- |
| Tanda | 1 bit | 1 bit |
| Eksponen | 8 bit | 11 bit |
| Pecahan | 23 bit | 52 bit |
| Bias eksponen | 127 | 1023 |
| Presisi (digit desimal) | ±7 | ±15–16 |
| Nilai terbesar | ≈ 3,4 × 10³⁸ | ≈ 1,8 × 10³⁰⁸ |

~~~
 31  30        23 22                                  0
+---+------------+-------------------------------------+
| s | eksponen   |            pecahan (f)              |
+---+------------+-------------------------------------+
   1     8 bit               23 bit
~~~

**Eksponen berbias**: eksponen sebenarnya bisa negatif, tetapi disimpan sebagai bilangan **tak bertanda** dengan menambah bias (127 untuk single). Eksponen tersimpan **E = e + 127**. Dengan begitu dua bilangan float positif bisa dibandingkan hanya dengan membandingkan pola bit-nya sebagai bilangan bulat.

Nilai bilangan ternormalisasi single:

~~~
nilai = (−1)^s × (1 + f/2²³) × 2^(E − 127)         untuk 1 ≤ E ≤ 254
~~~

## Contoh 1: mengkodekan 5,75 ke single

1. Tanda: positif → s = **0**.
2. Biner: 5,75 = 101,11₂. Normalisasi: **1,0111 × 2²**.
3. Eksponen: e = 2 → E = 2 + 127 = 129 = **10000001**.
4. Pecahan: ambil digit setelah koma "0111", lengkapi 0 hingga 23 bit: \`01110000000000000000000\`.

~~~
0 | 10000001 | 01110000000000000000000
→ 0100 0000 1011 1000 0000 0000 0000 0000
→ 0x40B80000
~~~

## Contoh 2: mengkodekan −0,15625

1. s = **1** (negatif).
2. 0,15625 = 5/32 = 0,00101₂ = **1,01 × 2⁻³**.
3. E = −3 + 127 = 124 = **01111100**.
4. f = 01 diikuti nol.

~~~
1 | 01111100 | 01000000000000000000000
→ 1011 1110 0010 0000 0000 0000 0000 0000
→ 0xBE200000
~~~

## Contoh 3: membaca 0x41200000

~~~
0x41200000 = 0100 0001 0010 0000 ...
s = 0,  E = 10000010 = 130,  f = 0100000...
nilai = + 1,01₂ × 2^(130−127) = 1,01₂ × 2³ = 1010₂ = 10,0
~~~

## Nilai khusus

Dua pola eksponen sengaja dicadangkan:

| Eksponen E | Pecahan f | Arti |
| --- | --- | --- |
| 0 | 0 | **±0** (ada +0 dan −0) |
| 0 | ≠ 0 | **Denormal**: (−1)^s × 0,f × 2⁻¹²⁶, mengisi celah antara 0 dan bilangan normal terkecil, pelan-pelan menuju nol (*gradual underflow*) |
| 1 … 254 | bebas | Bilangan normal |
| 255 | 0 | **±∞** (hasil overflow atau 1/0) |
| 255 | ≠ 0 | **NaN** (*Not a Number*, hasil 0/0, √−1, ∞−∞) |

Konsekuensi yang perlu diketahui:

- \`1.0 / 0.0\` = **+∞** (tidak error, beda dengan pembagian bulat).
- \`0.0 / 0.0\` = **NaN**, dan **NaN ≠ NaN** (bahkan terhadap dirinya sendiri). Cek dengan \`isnan(x)\`.
- Single: bilangan normal terkecil 2⁻¹²⁶ ≈ 1,18 × 10⁻³⁸. Denormal terkecil 2⁻¹⁴⁹ ≈ 1,4 × 10⁻⁴⁵.

## Presisi dan pembulatan

Float punya **24 bit** angka penting (23 + 1 hidden). Artinya:

- Bilangan bulat dapat disimpan **tepat** hanya sampai 2²⁴ = 16.777.216. Di atas itu ada bilangan bulat yang tidak bisa direpresentasikan. Misalnya \`16777217\` tersimpan sebagai \`16777216\`.
- **Jarak antar bilangan** makin besar saat nilainya makin besar. Bilangan di sekitar 10⁹ pada single berjarak 64 satu sama lain.
- **Machine epsilon**: selisih antara 1,0 dan bilangan float berikutnya. Single: 2⁻²³ ≈ 1,19 × 10⁻⁷. Double: 2⁻⁵² ≈ 2,22 × 10⁻¹⁶.

Hasil operasi dibulatkan ke bilangan terdekat yang dapat direpresentasikan (default: **round to nearest, ties to even**).

### Kenapa 0,1 + 0,2 ≠ 0,3

0,1 berulang tak berhingga di biner (\`0,0001100110011...\`). Disimpan sebagai pendekatan terdekat:

~~~
0,1 (double) = 0,1000000000000000055511151231257827...   (sedikit lebih besar)
0,1 (single) = 0,100000001490116...                      (0x3DCCCCCD)
~~~

Menjumlahkan dua pendekatan menghasilkan 0,30000000000000004 pada double, bukan pendekatan terdekat 0,3.

## Penjumlahan floating point

Berbeda dengan bilangan bulat, penjumlahan float memerlukan beberapa langkah:

1. **Samakan eksponen**: geser kanan significand bilangan yang eksponennya lebih kecil.
2. **Jumlahkan** significand.
3. **Normalisasi** hasil (geser, sesuaikan eksponen).
4. **Bulatkan**.

Contoh: 1,1₂ × 2⁰ (1,5) + 1,0₂ × 2⁻² (0,25) → samakan: 1,10 + 0,01 = **1,11₂** × 2⁰ = 1,75 ✓.

Kalau selisih eksponen sangat besar, bilangan kecil **hilang seluruhnya** (*absorption*): \`1e16 + 1\` pada double tetap \`1e16\`.

### Penjumlahan float tidak asosiatif

~~~python
>>> (1e16 + -1e16) + 1
1.0
>>> 1e16 + (-1e16 + 1)
0.0            # -1e16 + 1 dibulatkan kembali menjadi -1e16
~~~

Urutan penjumlahan memengaruhi hasil. Inilah sebabnya paralelisasi penjumlahan array (urutan berbeda) bisa menghasilkan angka yang sedikit berbeda.

## Aturan praktis memakai float

1. **Jangan bandingkan float dengan \`==\`.** Bandingkan selisih dengan toleransi: \`abs(a - b) < 1e-9\` atau \`math.isclose(a, b)\`.
2. **Jangan pakai float untuk uang.** Simpan sen sebagai bilangan bulat, atau pakai tipe desimal (\`Decimal\` di Python, \`BigDecimal\` di Java).
3. Hindari mengurangkan dua bilangan yang hampir sama (*catastrophic cancellation*), dan menjumlahkan bilangan sangat besar dengan sangat kecil.
4. Gunakan **double** secara default; **float** hanya jika memori/kecepatan (GPU, grafika) lebih penting daripada presisi.
5. Di C, \`(int)3.99\` memotong ke \`3\`, bukan membulatkan.

~~~c
#include <stdio.h>
#include <math.h>
int main(void) {
    double a = 0.1 + 0.2;
    printf("%.17g\\n", a);              // 0.30000000000000004
    printf("%d\\n", a == 0.3);          // 0
    printf("%d\\n", fabs(a - 0.3) < 1e-9);   // 1
    return 0;
}
~~~

## Format lain yang akan kamu temui

| Format | Bit | Eksponen | Pecahan | Dipakai di |
| --- | --- | --- | --- | --- |
| FP16 (half) | 16 | 5 | 10 | Grafika, inferensi AI |
| bfloat16 | 16 | 8 | 7 | Pelatihan AI (rentang seperti float32, presisi rendah) |
| FP32 | 32 | 8 | 23 | Umum, GPU |
| FP64 | 64 | 11 | 52 | Komputasi ilmiah |

## Rangkuman

- IEEE 754: (−1)^s × 1.f × 2^(E − bias). Single: 1/8/23 bit, bias 127. Double: 1/11/52 bit, bias 1023.
- Langkah mengkodekan: tentukan tanda, normalisasi ke 1,xxx × 2^e, hitung E = e + bias, ambil pecahan. Contoh: 5,75 = 0x40B80000.
- Pola khusus: E=0 → nol/denormal; E=255 (single) → ∞ (f=0) atau NaN (f≠0).
- Float punya presisi terbatas (single ±7 digit, double ±15–16): pecahan seperti 0,1 hanya didekati, bilangan bulat > 2²⁴ tidak selalu eksak di single.
- Penjumlahan float tidak asosiatif. Jangan bandingkan dengan \`==\`, dan jangan pakai float untuk uang.
`,
};
