export default {
  id: 'arsikom-karakter',
  judul: 'Representasi Karakter: ASCII, Unicode, UTF-8, BCD',
  tipe: 'teks',
  xp: 15,
  materi: `
# Representasi Karakter: ASCII, Unicode, UTF-8, BCD 🔤

Komputer hanya menyimpan angka, jadi huruf harus **disepakati** nomornya. Kesepakatan itu disebut **pengkodean karakter** (*character encoding*). Tanpa kesepakatan, dokumen yang kamu tulis di satu komputer akan tampil sebagai karakter acak di komputer lain (*mojibake*).

## ASCII (1963)

*American Standard Code for Information Interchange* memakai **7 bit**, menghasilkan 2⁷ = **128 karakter**: huruf Inggris, angka, tanda baca, dan karakter kontrol.

| Karakter | Desimal | Heksa | Catatan |
| --- | --- | --- | --- |
| \`'\\0'\` (NUL) | 0 | 0x00 | Penutup string di C |
| \`'\\n'\` (LF) | 10 | 0x0A | Baris baru (Linux/macOS) |
| \`'\\r'\` (CR) | 13 | 0x0D | Carriage return (Windows memakai CR+LF) |
| spasi | 32 | 0x20 | |
| \`'0'\` … \`'9'\` | 48 … 57 | 0x30 … 0x39 | |
| \`'A'\` … \`'Z'\` | 65 … 90 | 0x41 … 0x5A | |
| \`'a'\` … \`'z'\` | 97 … 122 | 0x61 … 0x7A | |

Pola yang bisa dimanfaatkan:

- Huruf besar dan kecil berbeda **tepat 32** (0x20), yaitu satu bit. \`'A'\` = 0100 0001, \`'a'\` = 0110 0001. Mengubah huruf kecil → besar cukup mematikan bit ke-5: \`c & ~0x20\`.
- Digit \`'0'\`…\`'9'\` berurutan dari 0x30, jadi **nilai digit = karakter − '0'**. Dalam C: \`int nilai = c - '0';\`.

~~~c
#include <stdio.h>
int main(void) {
    char c = '7';
    int n = c - '0';           // 55 - 48 = 7
    char besar = 'g' - 32;     // 'G'
    printf("%d %c\\n", n, besar);
    return 0;
}
~~~

ASCII 7 bit hanya muat dalam 1 byte dengan 1 bit bebas. Bit ke-8 itu kemudian dipakai untuk **ASCII extended** (128 karakter tambahan seperti é, ñ, Ω) yang berbeda-beda antar-negara (ISO-8859-1, Windows-1252, ...). Hasilnya kekacauan: tidak ada satu kode untuk semua bahasa.

## Unicode

**Unicode** memberi satu nomor unik, disebut ***code point***, untuk hampir setiap karakter dari semua bahasa di dunia, ditambah simbol dan emoji. Ditulis \`U+\` diikuti heksa:

| Karakter | Code point |
| --- | --- |
| A | U+0041 |
| é | U+00E9 |
| € | U+20AC |
| 世 | U+4E16 |
| 😀 | U+1F600 |

Ruang code point sampai U+10FFFF (lebih dari 1,1 juta slot). Unicode **bukan** cara menyimpan byte, melainkan daftar nomor. Cara mengubah nomor menjadi byte disebut **encoding**: UTF-8, UTF-16, atau UTF-32.

| Encoding | Ukuran per karakter | Catatan |
| --- | --- | --- |
| UTF-32 | Tetap 4 byte | Sederhana, boros |
| UTF-16 | 2 atau 4 byte | Dipakai internal Java (\`char\`), JavaScript, Windows |
| **UTF-8** | **1 sampai 4 byte** | Standar web dan Linux; **kompatibel dengan ASCII** |

## UTF-8: panjang variabel

Aturan penyandiannya: awalan bit pada byte pertama menyatakan panjang karakter, byte berikutnya selalu diawali \`10\`.

| Rentang code point | Byte | Pola biner |
| --- | --- | --- |
| U+0000 – U+007F | 1 | \`0xxxxxxx\` |
| U+0080 – U+07FF | 2 | \`110xxxxx 10xxxxxx\` |
| U+0800 – U+FFFF | 3 | \`1110xxxx 10xxxxxx 10xxxxxx\` |
| U+10000 – U+10FFFF | 4 | \`11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\` |

Huruf x diisi bit-bit code point.

**Contoh: é (U+00E9)** → 1110 1001, butuh 2 byte (rentang 0080–07FF), muatkan ke 11 bit \`000 1110 1001\`:

~~~
bit:   00011 101001
byte1: 110 00011 = 0xC3
byte2: 10 101001 = 0xA9
é = C3 A9
~~~

**Contoh: € (U+20AC)** → 3 byte: \`E2 82 AC\`. **Emoji 😀 (U+1F600)** → 4 byte: \`F0 9F 98 80\`.

Keunggulan UTF-8:

1. Teks ASCII murni **identik** dengan file ASCII (hemat dan kompatibel mundur).
2. Tidak ada masalah urutan byte (*endianness*) karena tiap unit adalah 1 byte.
3. Aman dibaca dari tengah: byte yang diawali \`10\` jelas bukan awal karakter.

## Dampak ke programmer

- Di C, string adalah **array byte yang diakhiri \`'\\0'\`**. \`"Hi"\` memakai 3 byte: \`48 69 00\`. \`strlen("é")\` bernilai **2** bila file UTF-8, karena \`strlen\` menghitung byte, bukan karakter.
- Di Python 3, \`str\` adalah deretan code point, sedangkan \`bytes\` adalah deretan byte. \`len("é")\` = 1, \`len("é".encode("utf-8"))\` = 2.
- Di Java, \`char\` adalah satuan UTF-16 16 bit. Emoji (di luar U+FFFF) memakai dua \`char\` (*surrogate pair*), sehingga \`"😀".length()\` = 2.

## BCD: menyimpan angka desimal dengan bit

**BCD** (*Binary Coded Decimal*) menyimpan **setiap digit desimal dalam 4 bit**.

~~~
59 (BCD)  = 0101 1001        (bukan biner murni 111011)
2026      = 0010 0000 0010 0110
~~~

Kelebihan: konversi ke tampilan angka mudah dan **pembulatan desimal persis** (tidak ada 0,1 yang berulang). Dipakai di kalkulator, jam digital, dan sistem keuangan. Kekurangan: boros (4 bit hanya dipakai untuk 10 dari 16 kombinasi) dan aritmetikanya lebih rumit.

## Rangkuman

- ASCII: 7 bit, 128 karakter. Huruf besar/kecil beda 32; digit '0' mulai 48, sehingga nilai digit = c − '0'.
- Unicode memberi nomor (code point) bagi karakter semua bahasa; UTF-8/16/32 adalah cara menyimpannya sebagai byte.
- UTF-8 panjang variabel 1–4 byte, kompatibel dengan ASCII, dan menjadi standar web.
- String C berakhir dengan byte 0 dan \`strlen\` menghitung byte; di UTF-8 satu karakter bisa lebih dari satu byte.
- BCD menyimpan tiap digit desimal dalam 4 bit: akurat untuk desimal, tetapi boros.
`,
};
