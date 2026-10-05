export default {
  id: 'arsikom-logika-geser',
  judul: 'Operasi Logika Bit dan Pergeseran',
  tipe: 'teks',
  xp: 15,
  materi: `
# Operasi Logika Bit dan Pergeseran 🧮

Selain berhitung, ALU melakukan operasi **bitwise**: memanipulasi bit satu per satu. Operasi ini murah (satu siklus), dan menjadi dasar bendera/flag, kompresi, kriptografi, grafika, dan driver perangkat keras. Hampir semua bahasa yang kamu pakai (C, Java, Python) punya operatornya.

## Empat operasi dasar

| Operasi | C/Java/Python | Aturan per bit |
| --- | --- | --- |
| AND | \`a & b\` | 1 hanya jika **kedua** bit 1 |
| OR | \`a \\| b\` | 1 jika **salah satu** bit 1 |
| XOR | \`a ^ b\` | 1 jika kedua bit **berbeda** |
| NOT | \`~a\` | membalik tiap bit |

Contoh dengan 4 bit:

~~~
   1100            1100            1100
 & 1010          | 1010          ^ 1010          ~ 1100
 ------          ------          ------          ------
   1000            1110            0110            0011
~~~

Jangan tertukar dengan operator logika \`&&\`, \`||\`, \`!\` yang bekerja pada nilai benar/salah seluruh ekspresi, bukan per bit.

## Topeng bit (bit mask): resep yang wajib hafal

Variabel \`x\` menyimpan banyak flag dalam satu bilangan. Operasi pada bit ke-\`k\` (dihitung dari kanan, mulai 0):

| Tujuan | Ekspresi | Prinsip |
| --- | --- | --- |
| **Mengambil** bit k | \`(x >> k) & 1\` | Geser lalu AND dengan 1 |
| **Menyalakan** bit k (set) | \`x \\| (1 << k)\` | OR dengan 1 memaksa jadi 1 |
| **Mematikan** bit k (clear) | \`x & ~(1 << k)\` | AND dengan 0 memaksa jadi 0 |
| **Membalik** bit k (toggle) | \`x ^ (1 << k)\` | XOR dengan 1 membalik |
| **Mengambil 4 bit bawah** | \`x & 0x0F\` | Topeng mempertahankan bit tertentu |

Contoh: \`x = 0b10110100\`, nyalakan bit 0 dan matikan bit 7:

~~~
x            = 10110100
x | 0b00000001 = 10110101      (set bit 0)
x & 0b01111111 = 00110100      (clear bit 7)
~~~

### Contoh nyata: izin berkas

~~~c
#define BACA   4   // 100
#define TULIS  2   // 010
#define JALAN  1   // 001

int izin = BACA | TULIS;                  // 110 = 6
if (izin & TULIS) { /* boleh menulis */ }
izin = izin & ~TULIS;                     // cabut hak tulis
~~~

### Contoh nyata: warna RGB dalam satu integer

~~~c
unsigned color = (r << 16) | (g << 8) | b;     // 0xRRGGBB
unsigned hijau = (color >> 8) & 0xFF;          // ambil kembali g
~~~

## Operasi geser (shift)

Menggeser seluruh bit ke kiri atau kanan sebanyak n posisi.

### Geser kiri: \`x << n\`

Bit bergeser ke kiri, bit baru di kanan diisi 0. Efeknya: **mengalikan dengan 2ⁿ** (selama tidak overflow).

~~~
13 = 00001101
13 << 1 = 00011010 = 26
13 << 2 = 00110100 = 52
~~~

### Geser kanan logika: isi dengan 0 di kiri

~~~
13 = 00001101
13 >> 1 = 00000110 = 6      (13 / 2 dibulatkan ke bawah)
~~~

### Geser kanan aritmetika: isi dengan **bit tanda**

Untuk bilangan **bertanda**, geser kanan harus mempertahankan tanda supaya hasilnya tetap ÷ 2:

~~~
−8 = 11111000
−8 >> 1 (aritmetika) = 11111100 = −4     ✓
−8 >> 1 (logika)     = 01111100 = +124   ✗ salah tanda
~~~

Geser kanan aritmetika membagi dengan 2ⁿ **dibulatkan ke bawah** (menuju −∞): \`−7 >> 1\` = **−4**, sedangkan pembagian C \`−7 / 2\` = −3 (dipotong ke nol). Itulah perbedaan halus keduanya.

| Bahasa | Geser kanan |
| --- | --- |
| C | \`>>\` pada tipe bertanda: aritmetika di hampir semua compiler (implementation-defined); pada unsigned: logika |
| Java | \`>>\` aritmetika, \`>>>\` logika |
| Python | \`>>\` aritmetika (bilangan bulat tak terbatas) |

### Rotasi

*Rotate* menggeser bit yang keluar dari satu sisi masuk kembali di sisi lain, tidak ada bit yang hilang. Dipakai di kriptografi dan hash. Banyak CPU punya instruksi \`ROL\`/\`ROR\`.

## Trik klasik yang sering muncul

1. **x & (x − 1)** mematikan bit 1 paling kanan. Contoh: 12 (1100) & 11 (1011) = 1000.
2. **Cek pangkat dua**: \`x > 0 && (x & (x - 1)) == 0\`. Pangkat dua hanya punya satu bit 1.
3. **Menghitung jumlah bit 1** (*popcount*): ulangi \`x &= x - 1\` sampai 0, hitung berapa kali. CPU modern punya instruksi \`POPCNT\`.
4. **x & −x** mengisolasi bit 1 paling kanan: 12 (1100) & −12 (…110100) = 0100.
5. **Mengalikan 10**: \`(x << 3) + (x << 1)\` (8x + 2x).
6. **x ^ x = 0** dan **x ^ 0 = x**. Menukar dua variabel tanpa variabel bantu: \`a ^= b; b ^= a; a ^= b;\` (trik klasik; kurang berguna dibanding menulis temp biasa).

~~~python
def pangkat_dua(x):
    return x > 0 and (x & (x - 1)) == 0

def hitung_bit(x):
    n = 0
    while x:
        x &= x - 1      # buang bit 1 paling kanan
        n += 1
    return n

print(pangkat_dua(64), pangkat_dua(100))   # True False
print(hitung_bit(0b10110100))              # 4
~~~

Kompiler sendiri sering mengganti perkalian dan pembagian dengan pangkat dua menjadi geser, karena geser jauh lebih cepat.

## Rangkuman

- **AND** mempertahankan bit (topeng), **OR** menyalakan bit, **XOR** membalik bit, **NOT** membalik semuanya.
- Resep bit k: ambil \`(x>>k)&1\`, set \`x|(1<<k)\`, clear \`x&~(1<<k)\`, toggle \`x^(1<<k)\`.
- Geser kiri n = × 2ⁿ. Geser kanan logika isi 0; geser kanan **aritmetika** isi bit tanda dan menjaga tanda bilangan bertanda.
- Geser kanan aritmetika membulatkan ke bawah (−7 >> 1 = −4); pembagian C memotong ke nol (−7 / 2 = −3).
- Trik: \`x & (x-1)\` buang bit 1 paling kanan, cek pangkat dua, popcount.
`,
};
