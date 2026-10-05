export default {
  id: 'arsikom-sistem-bilangan',
  judul: 'Sistem Bilangan: Biner, Oktal, Desimal, Heksadesimal',
  tipe: 'teks',
  xp: 15,
  materi: `
# Sistem Bilangan: Biner, Oktal, Desimal, Heksadesimal 🔢

Komputer tidak mengenal huruf, gambar, atau angka desimal. Di dalamnya hanya ada **dua keadaan**: tegangan tinggi atau rendah, arus mengalir atau tidak. Kita menamai dua keadaan itu **0** dan **1**. Segala sesuatu (teks, foto, video, program) pada akhirnya adalah **deretan 0 dan 1**.

## Kenapa biner?

Sirkuit yang membedakan 2 keadaan jauh lebih andal daripada yang membedakan 10 tingkat tegangan. Derau listrik kecil tidak akan membuat 0 dikira 1 karena ada batas aman yang lebar (*noise margin*). Rangkaian logika dua keadaan juga sederhana dan murah dibuat dari transistor (Bab 4).

## Sistem bilangan posisional

Sistem yang kita pakai sehari-hari (desimal) adalah **posisional**: nilai sebuah digit bergantung pada **posisinya**. Pada basis (radix) **b**, bilangan dengan digit \`d₃ d₂ d₁ d₀\` bernilai:

~~~
nilai = d₃·b³ + d₂·b² + d₁·b¹ + d₀·b⁰
~~~

Contoh desimal (b = 10):

~~~
 4 7 2 5  =  4·10³ + 7·10² + 2·10¹ + 5·10⁰ = 4000 + 700 + 20 + 5
~~~

Sistem lain memakai rumus yang sama dengan basis berbeda:

| Sistem | Basis | Digit yang dipakai | Penulisan |
| --- | --- | --- | --- |
| Biner | 2 | 0, 1 | \`1011₂\`, \`0b1011\` |
| Oktal | 8 | 0–7 | \`17₈\`, \`017\` atau \`0o17\` |
| Desimal | 10 | 0–9 | \`2026\` |
| Heksadesimal | 16 | 0–9, A–F | \`2F₁₆\`, \`0x2F\` |

Pada heksadesimal, huruf A–F mewakili 10–15 (A=10, B=11, C=12, D=13, E=14, F=15).

### Tabel yang perlu dihafal (0–15)

| Desimal | Biner | Heksa | | Desimal | Biner | Heksa |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0000 | 0 | | 8 | 1000 | 8 |
| 1 | 0001 | 1 | | 9 | 1001 | 9 |
| 2 | 0010 | 2 | | 10 | 1010 | A |
| 3 | 0011 | 3 | | 11 | 1011 | B |
| 4 | 0100 | 4 | | 12 | 1100 | C |
| 5 | 0101 | 5 | | 13 | 1101 | D |
| 6 | 0110 | 6 | | 14 | 1110 | E |
| 7 | 0111 | 7 | | 15 | 1111 | F |

Satu digit heksa = **tepat 4 bit**, itulah sebabnya heksa dipakai untuk menulis data biner secara ringkas.

### Menghitung nilai bilangan biner

~~~
1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ = 8 + 0 + 2 + 1 = 11
~~~

Kuncinya hafal **pangkat dua**:

| Pangkat | 2⁰ | 2¹ | 2² | 2³ | 2⁴ | 2⁵ | 2⁶ | 2⁷ | 2⁸ | 2⁹ | 2¹⁰ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nilai | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 |

Dua hal penting dari n bit:

- Bisa menyimpan **2ⁿ nilai berbeda**.
- Bilangan tak bertanda (*unsigned*) terbesarnya adalah **2ⁿ − 1**.

Contoh: 8 bit → 256 kombinasi, rentang 0 sampai 255. 16 bit → 0 sampai 65.535. 32 bit → 0 sampai 4.294.967.295.

## Satuan penyimpanan

| Istilah | Arti |
| --- | --- |
| **Bit** | 1 digit biner |
| **Nibble** | 4 bit (satu digit heksa) |
| **Byte** | 8 bit, satuan alamat memori terkecil pada hampir semua komputer |
| **Word** | Ukuran "natural" data pada sebuah CPU (16, 32, atau 64 bit, **bergantung arsitektur**) |

Awalan besar punya dua versi yang sering dicampuradukkan:

| Awalan SI (desimal) | Nilai | Awalan biner (IEC) | Nilai |
| --- | --- | --- | --- |
| kB (kilobyte) | 10³ = 1.000 | KiB (kibibyte) | 2¹⁰ = 1.024 |
| MB | 10⁶ | MiB | 2²⁰ = 1.048.576 |
| GB | 10⁹ | GiB | 2³⁰ = 1.073.741.824 |
| TB | 10¹² | TiB | 2⁴⁰ |

Itulah sebabnya flashdisk "64 GB" terbaca ±59,6 GiB di Windows: pabrik memakai 10⁹, sistem operasi menampilkan dalam kelipatan 2³⁰ (64×10⁹ / 2³⁰ ≈ 59,6).

## Di mana kamu akan menemui tiap sistem

- **Biner**: bendera/bit-mask, operasi bit (\`&\`, \`|\`, \`<<\`), representasi internal.
- **Heksa**: alamat memori (\`0x7ffd...\`), kode warna web (\`#FF8800\` = merah FF, hijau 88, biru 00), dump memori, kode mesin.
- **Oktal**: izin berkas Unix. \`chmod 755\` = \`111 101 101\` = \`rwxr-xr-x\`, tiap digit oktal mewakili 3 bit (baca, tulis, eksekusi).

## Di bahasa pemrograman yang kamu kenal

~~~c
#include <stdio.h>
int main(void) {
    int n = 255;
    printf("%d %x %o\\n", n, n, n);   // 255 ff 377
    int mask = 0xFF;                  // literal heksa
    int perm = 0755;                  // literal oktal (diawali 0!)
    return 0;
}
~~~

~~~python
n = 255
print(bin(n), hex(n), oct(n))   # 0b11111111 0xff 0o377
print(int("1011", 2))           # 11  (dari string biner)
print(0b1011, 0xFF)             # 11 255
~~~

~~~java
int n = 255;
System.out.println(Integer.toBinaryString(n)); // 11111111
System.out.println(Integer.toHexString(n));    // ff
int dariBiner = Integer.parseInt("1011", 2);   // 11
~~~

> Hati-hati di C dan Java: literal yang diawali **0** dianggap **oktal**. \`int x = 010;\` bernilai **8**, bukan 10.

## Rangkuman

- Komputer memakai **biner** karena rangkaian dua keadaan murah, sederhana, dan tahan derau.
- Sistem posisional: nilai = Σ digit × basis^posisi. Basis penting: 2, 8, 10, 16.
- n bit menampung **2ⁿ nilai**; unsigned maksimum **2ⁿ − 1**. Satu digit heksa = 4 bit, satu digit oktal = 3 bit.
- Byte = 8 bit adalah satuan alamat terkecil. Word bergantung pada arsitektur. kB = 1.000 byte sedangkan KiB = 1.024 byte.
- Literal berawalan \`0x\` = heksa, \`0b\` = biner; di C/Java awalan \`0\` berarti oktal.
`,
};
