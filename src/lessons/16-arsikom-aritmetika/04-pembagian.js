export default {
  id: 'arsikom-pembagian',
  judul: 'Pembagian Bilangan Bulat',
  tipe: 'teks',
  xp: 20,
  materi: `
# Pembagian Bilangan Bulat ➗

Pembagian adalah operasi paling lambat dan paling rumit di ALU. Pada banyak CPU, satu pembagian membutuhkan **20 sampai 40 siklus**, sedangkan penjumlahan 1 siklus dan perkalian 3–4 siklus. Ini sebabnya programmer berpengalaman menghindari pembagian di loop panas, dan kompiler berusaha menggantinya.

## Istilah

~~~
        hasil bagi (quotient)
          ───────
pembagi ) pembilang      ← dividend
(divisor)
          sisa (remainder)

dividend = divisor × quotient + remainder      (0 ≤ remainder < divisor)
~~~

## Pembagian biner dengan cara bersusun

Cara sekolah pada biner mudah: tiap langkah hanya ada dua pilihan, pembagi "muat" (hasil bit 1) atau tidak muat (bit 0).

**Contoh: 0111 (7) ÷ 0010 (2)**

~~~
          0011      → hasil bagi 3
      ┌────────
0010 ) 0111
        0       ← 0 tidak muat 10? tulis 0
       01       ← 01 < 10      → bit 0
       011      ← 011 ≥ 10     → bit 1, sisa 011 − 010 = 001
       0011     ← turunkan 1 → 011 ≥ 10 → bit 1, sisa 001
~~~

Hasil bagi 0011 (3), sisa 0001 (1): 7 = 2×3 + 1 ✓.

## Algoritma hardware: restoring division

Register yang dipakai: **M** (pembagi), **A** (sisa sementara, awalnya 0), **Q** (awalnya berisi dividend, nanti berisi hasil bagi).

Diulang **n kali**:

1. **Geser kiri** pasangan A:Q satu bit (bit tertinggi Q masuk ke A).
2. **A = A − M**.
3. Jika hasilnya **negatif** → pembagi tidak muat: **kembalikan** (*restore*) A = A + M, dan Q₀ = **0**.
   Jika **tidak negatif** → muat: pertahankan A, dan Q₀ = **1**.

Hasil akhir: **Q = hasil bagi**, **A = sisa**.

**Trace 7 ÷ 2 (4 bit)**: M = 0010, A = 0000, Q = 0111.

| Langkah | Setelah geser kiri (A : Q) | A − M | Keputusan | A | Q |
| --- | --- | --- | --- | --- | --- |
| 1 | 0000 : 1110 | negatif | restore, Q₀ = 0 | 0000 | 1110 |
| 2 | 0001 : 1100 | negatif | restore, Q₀ = 0 | 0001 | 1100 |
| 3 | 0011 : 1000 | 0001 ≥ 0 | simpan, Q₀ = 1 | 0001 | 1001 |
| 4 | 0011 : 0010 | 0001 ≥ 0 | simpan, Q₀ = 1 | 0001 | 0011 |

Akhir: Q = 0011 = **3** (hasil bagi), A = 0001 = **1** (sisa). ✓

Pada langkah 1 dan 2, "A − M negatif" berarti pembagi lebih besar dari sisa sementara; pengurangan dibatalkan dengan menambah M kembali.

### Non-restoring division

Langkah restore memakan waktu tambahan. Varian **non-restoring** menghilangkannya: jika A negatif pada langkah berikut, cukup **menambah** M (alih-alih restore lalu mengurangi), karena (A + M) − 2M... setara. Hasilnya lebih cepat, hanya perlu satu koreksi akhir. Prinsip yang perlu diingat: restoring melakukan satu pengurangan per bit hasil dan kadang satu penambahan pemulih, non-restoring selalu tepat satu penjumlahan atau pengurangan per bit.

CPU modern memakai varian lebih cepat (SRT division) yang menghasilkan beberapa bit hasil per siklus, namun tetap jauh lebih lambat daripada perkalian.

## Pembagian bertanda dan sisa negatif

Ada dua konvensi pembulatan, dan bahasa yang berbeda memilih berbeda:

| Ekspresi | C99 / Java (potong ke nol) | Python (floor, ke −∞) |
| --- | --- | --- |
| \`7 / 2\` | 3 | 3 |
| \`-7 / 2\` | **−3** | **−4** |
| \`-7 % 2\` | **−1** (tanda mengikuti pembilang) | **1** (tanda mengikuti pembagi) |

Di C dan Java berlaku: \`(a / b) * b + (a % b) == a\`. Di Python berlaku hal yang sama dengan floor, sehingga \`-7 // 2 = -4\` dan \`-7 % 2 = 1\` (karena −4×2 + 1 = −7).

Konsekuensinya: **jangan memakai \`x % 2 == 1\` untuk mengecek bilangan ganjil di C/Java**. Untuk x = −3, \`x % 2\` = −1 sehingga cek itu gagal. Pakai \`x % 2 != 0\` atau \`x & 1\`.

## Kasus khusus

- **Pembagian dengan nol**: pada bilangan bulat, CPU memicu **exception** (x86: *divide error*, program berhenti: "Floating point exception" di C Linux, \`ZeroDivisionError\` di Python, \`ArithmeticException\` di Java). Pada floating point, hasilnya ±∞ atau NaN (pelajaran IEEE 754).
- **INT_MIN / −1**: hasil +2³¹ tidak muat di 32 bit bertanda, sehingga overflow, dan pada x86 juga memicu exception.

## Cara kompiler menghindari pembagian

- **Pembagi pangkat dua**: untuk bilangan tak bertanda, \`x / 8\` menjadi \`x >> 3\`, dan \`x % 8\` menjadi \`x & 7\`. Untuk bilangan bertanda perlu koreksi kecil agar hasil dipotong ke nol, bukan ke −∞.
- **Pembagi konstanta**: \`x / 10\` diubah menjadi perkalian dengan konstanta "ajaib" ≈ 2ⁿ/10 lalu geser kanan. Perkalian + geser sekitar 4 siklus melawan 25+ siklus untuk pembagian sungguhan.
- **Pembagi variabel** tidak bisa dioptimasi seperti itu. Contoh: hitung rata-rata dengan satu pembagian di luar loop, bukan satu pembagian per elemen.

## Latihan berpikir

1. 13 ÷ 4 → hasil bagi 3, sisa 1 (1101 = 4 × 0011 + 0001).
2. Jika divisor = 0, apa yang terjadi? exception, bukan hasil.
3. Berapa langkah pada restoring division 8 bit? **8** langkah, satu per bit dividend.

## Rangkuman

- Pembagian: dividend = divisor × hasil bagi + sisa. Hasil bagi didapat bit demi bit dari **pengurangan berulang** dan geser.
- **Restoring division**: ulangi n kali (geser kiri A:Q, A = A − M; jika negatif → restore dan Q₀ = 0, jika tidak → Q₀ = 1). Hasil: Q = hasil bagi, A = sisa.
- Non-restoring menghilangkan langkah restore. Pembagian jauh lebih lambat daripada perkalian atau penjumlahan.
- C/Java memotong hasil ke nol (−7/2 = −3, −7%2 = −1); Python membulatkan ke −∞ (−7//2 = −4, −7%2 = 1).
- Pembagian dengan nol memicu exception. Kompiler mengganti pembagi pangkat dua dengan geser dan pembagi konstanta dengan perkalian.
`,
};
