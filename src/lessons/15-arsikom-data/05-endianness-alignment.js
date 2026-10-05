export default {
  id: 'arsikom-endian',
  judul: 'Memori Byte-Addressable: Endianness & Alignment',
  tipe: 'teks',
  xp: 15,
  materi: `
# Memori Byte-Addressable: Endianness & Alignment 📦

Data lebih besar dari 1 byte (misalnya \`int\` 32 bit) harus disimpan dalam beberapa byte berurutan. Dua pertanyaan muncul: **byte mana yang ditaruh lebih dulu?** (endianness) dan **di alamat mana boleh ditaruh?** (alignment). Keduanya memengaruhi program C, format berkas, dan komunikasi jaringan.

## Memori sebagai deretan byte

Memori utama adalah deretan sel berukuran **1 byte**, masing-masing punya **alamat** (nomor urut mulai 0).

~~~
alamat:  0x1000  0x1001  0x1002  0x1003  0x1004 ...
isi:      [ 78 ]  [ 56 ]  [ 34 ]  [ 12 ]  [ .. ]
~~~

Jika alamat memakai n bit, ada **2ⁿ alamat**. Alamat 32 bit → 2³² byte = 4 GiB (batas klasik komputer 32 bit). Alamat 64 bit → 16 EiB secara teori.

## Endianness: urutan byte

Misalkan kita simpan bilangan 32 bit \`0x12345678\` mulai alamat \`0x1000\`. Byte **0x12** adalah byte terpenting (MSB), **0x78** yang paling tidak penting (LSB).

| Urutan | Aturan | Isi di alamat 0x1000, 0x1001, 0x1002, 0x1003 |
| --- | --- | --- |
| **Big-endian** | Byte **terbesar** di alamat **terendah** | 12 34 56 78 |
| **Little-endian** | Byte **terkecil** di alamat **terendah** | 78 56 34 12 |

Asal nama: dari novel *Gulliver's Travels*, perdebatan memecahkan telur dari ujung besar (*big end*) atau ujung kecil (*little end*).

- **Little-endian**: x86, x86-64, hampir semua ARM yang dipakai sekarang (HP, laptop Apple), RISC-V.
- **Big-endian**: protokol jaringan (TCP/IP, disebut *network byte order*), format berkas tertentu, prosesor lama (SPARC, PowerPC klasik), serta Java (\`DataOutputStream\`).

Tidak ada yang "lebih benar". Little-endian punya sedikit keuntungan teknis (alamat suatu bilangan sama untuk ukuran 8, 16, 32 bit yang nilainya kecil; penjumlahan multi-byte mulai dari byte terendah), sedangkan big-endian lebih mudah dibaca manusia pada dump memori.

### Mendeteksi endianness di C

~~~c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    uint32_t x = 0x12345678;
    uint8_t *p = (uint8_t *)&x;       // lihat byte per byte
    printf("%02x %02x %02x %02x\\n", p[0], p[1], p[2], p[3]);
    return 0;
}
~~~

Pada PC x86 hasilnya \`78 56 34 12\` (little-endian). Pada mesin big-endian hasilnya \`12 34 56 78\`.

### Kapan endianness menjadi masalah?

- Mengirim \`int\` mentah lewat jaringan atau menyimpannya ke berkas, lalu dibaca di mesin berbeda: nilainya terbalik.
- Membaca format biner (gambar BMP, WAV, berkas ELF) yang menetapkan urutan tertentu.
- Mengetik alamat dari dump memori. Alamat \`0x12345678\` pada little-endian tampak sebagai \`78 56 34 12\`.

Solusi C yang baku: fungsi \`htonl()\`/\`ntohl()\` (host to network long) mengonversi antara urutan mesin dan urutan jaringan. Python punya modul \`struct\` (\`struct.pack(">I", x)\` = big-endian) dan \`int.to_bytes(4, "big")\`.

Catatan: endianness hanya soal **urutan byte** dalam satu nilai. **Urutan bit dalam byte tidak berubah**, dan array byte (misalnya string "ABCD") tetap tersimpan berurutan A, B, C, D di kedua jenis mesin.

## Alignment (perataan alamat)

Sebuah data berukuran *k* byte dikatakan **aligned** bila alamatnya kelipatan *k*. Misalnya \`int\` 4 byte sebaiknya di alamat 0, 4, 8, 12, ... dan bukan di alamat 1, 2, atau 3.

Kenapa? Memori dan cache dibaca dalam **blok yang rata** (misalnya 4 atau 8 byte dalam satu putaran). Data yang melintasi batas blok membutuhkan **dua akses**, atau pada beberapa CPU (ARM lama, MIPS, SPARC) menyebabkan *trap* (galat). x86 mentolerirnya tetapi tetap lebih lambat.

### Struct padding di C

Compiler menyisipkan **byte pengisi (padding)** supaya tiap anggota struct aligned.

~~~c
struct A { char c; int i; char d; };   // urutan: char, int, char
struct B { int i; char c; char d; };   // int dulu, lalu dua char
~~~

Tata letak \`struct A\` (anggap int = 4 byte dan alignment 4):

~~~
offset:  0     1  2  3    4  5  6  7    8     9 10 11
        [ c ][pad pad pad][   i (4 byte)  ][ d ][pad pad pad]
                                                  sizeof(A) = 12
~~~

Tata letak \`struct B\`:

~~~
offset:  0 1 2 3    4     5    6  7
        [   i    ][ c ][ d ][pad pad]
                          sizeof(B) = 8
~~~

Dua struct dengan isi yang sama tetapi berbeda urutan bisa berbeda ukuran 50%. Aturan praktis: **urutkan anggota dari yang terbesar ke terkecil** untuk meminimalkan padding. Ukuran struct total juga dibulatkan ke kelipatan alignment anggota terbesar supaya array of struct tetap aligned.

Padding adalah alasan kenapa menulis \`struct\` mentah ke berkas lalu membacanya di mesin/compiler lain berisiko.

## Rangkuman

- Memori adalah deretan byte beralamat. Alamat n bit menjangkau 2ⁿ byte.
- **Big-endian**: byte terbesar di alamat terendah. **Little-endian**: byte terkecil di alamat terendah (x86, ARM modern). Jaringan memakai big-endian.
- Endianness hanya memengaruhi urutan byte dalam satu nilai, bukan urutan bit dan bukan array byte.
- **Alignment**: data k byte sebaiknya di alamat kelipatan k agar diakses dalam satu operasi memori.
- Compiler C menambahkan **padding** pada struct. Urutan anggota memengaruhi \`sizeof\`.
`,
};
