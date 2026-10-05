export default {
  id: 'arsikom-pengalamatan',
  judul: 'Mode Pengalamatan (Addressing Modes)',
  tipe: 'teks',
  xp: 25,
  materi: `
# Mode Pengalamatan (Addressing Modes) 🎯

Sebuah instruksi membawa bidang **operand** (misalnya angka 100). Tetapi apa arti angka itu? Apakah ia **nilai** yang akan dipakai, **alamat** tempat nilai berada, atau **petunjuk** untuk menghitung alamat? **Mode pengalamatan** adalah aturan penafsirannya. Konsep inilah yang menghasilkan alamat efektif (*effective address*, EA) yang benar-benar diakses.

Pelajari kesembilan mode berikut, karena soal ujian hampir selalu menanyakan "berapa nilai operand?" untuk skenario tertentu.

## Skenario bersama

Gunakan keadaan berikut untuk semua contoh:

~~~
Bidang operand A = 100
Register R1      = 200
Register PC      = 500 (alamat instruksi berikutnya)

Memori:
  M[100] = 300
  M[200] = 777
  M[300] = 500
  M[600] = 123       (600 = PC + 100)
  M[500] = 800
~~~

## 1. Immediate (langsung)

**Operand adalah nilainya sendiri.** Tidak ada akses memori.

~~~
operand = A            →  100
~~~

Dipakai untuk konstanta: \`ADD R1, #5\`. Ukuran konstanta terbatas oleh lebar bidang operand. Padanan C: \`x = 5\`.

## 2. Direct (langsung ke alamat / absolut)

Bidang operand adalah **alamat** data.

~~~
EA = A = 100           →  operand = M[100] = 300
~~~

**1 akses memori** untuk operand. Padanan C: variabel global dengan alamat tetap. Kelemahan: ruang alamat dibatasi lebar bidang operand.

## 3. Indirect (tak langsung)

Bidang operand adalah alamat dari **alamat** data (pointer).

~~~
EA = M[A] = M[100] = 300   →  operand = M[300] = 500
~~~

**2 akses memori** (lambat). Ruang alamat luas. Padanan C: \`**pp\` (pointer ke pointer), tabel lompat.

## 4. Register

Operand berada di **register** yang disebut oleh instruksi.

~~~
operand = R1 = 200
~~~

Tanpa akses memori, sangat cepat, dan nomor register hanya beberapa bit sehingga instruksi pendek. Mode paling dominan di RISC.

## 5. Register indirect

Register berisi **alamat** data.

~~~
EA = R1 = 200          →  operand = M[200] = 777
~~~

**1 akses memori.** Padanan C: dereferensi pointer \`*p\` ketika \`p\` ada di register.

## 6. Displacement (base + offset)

Alamat efektif = **isi register + konstanta** pada instruksi. Ada tiga gaya yang berbeda pada penggunaannya:

~~~
EA = A + R1 = 100 + 200 = 300   →  operand = M[300] = 500
~~~

| Gaya | Register berisi | Konstanta A berisi | Padanan C |
| --- | --- | --- | --- |
| **Base + displacement** | Alamat dasar objek/struct | Offset anggota | \`s.field\`, \`p->field\` |
| **Indexed** | Indeks | Alamat dasar array | \`a[i]\` bila a bersifat tetap |
| **Relative** (ke PC) | Selalu **PC** | Selisih/offset | Lompatan dekat, kode relokatif |

Pada **PC-relative**: \`EA = PC + A\`. Dengan PC = 500 dan A = 100, EA = 600 → operand M[600] = 123. Lompatan bersyarat hampir selalu relatif: cukup menyimpan selisih kecil, dan program tetap berfungsi di mana pun ia dimuat (*position independent code*).

Mode ini menjadi **tulang punggung akses array dan struct**:

~~~c
int a[10];
int x = a[i];        // alamat = alamat_dasar(a) + i × 4
~~~

Hardware x86 bahkan dapat menghitung *skala* sekaligus: \`mov eax, [ebx + esi*4 + 8]\` = ebx (dasar) + esi (indeks) × 4 + 8 (offset) dalam satu instruksi.

## 7. Stack

Operand diambil implisit dari **puncak stack** menggunakan SP. \`PUSH\` dan \`POP\` sekaligus menggeser SP (**auto-decrement/auto-increment**). Dipakai untuk pemanggilan fungsi dan mesin stack.

## Ringkasan perbandingan

Dengan skenario di atas:

| Mode | Cara menghitung | Nilai operand | Akses memori | Keunggulan | Kelemahan |
| --- | --- | --- | --- | --- | --- |
| Immediate | A | **100** | 0 | Cepat, tanpa memori | Nilai kecil, konstan |
| Direct | M[A] | **300** | 1 | Sederhana | Ruang alamat terbatas |
| Indirect | M[M[A]] | **500** | 2 | Ruang alamat luas | Lambat |
| Register | R1 | **200** | 0 | Sangat cepat | Jumlah register kecil |
| Register indirect | M[R1] | **777** | 1 | Alamat luas, instruksi pendek | — |
| Displacement | M[A + R1] | **500** | 1 | Array, struct, lokal | Penjumlahan alamat |
| PC-relative | M[PC + A] | **123** | 1 | Kode relokatif | Jarak terbatas |

## Contoh soal gaya ujian

> Sebuah instruksi \`LOAD 100\` dijalankan dengan keadaan seperti skenario di atas. Berapa nilai yang dimuat ke akumulator jika mode pengalamatannya (a) langsung, (b) tak langsung, (c) register indirect dengan R1?

Jawab: (a) immediate = **100**, (b) indirect: M[M[100]] = M[300] = **500**, (c) register indirect: M[R1] = M[200] = **777**.

Cara menghindari kesalahan: tulis dulu rumus **EA**, baru tentukan apakah nilai operand-nya adalah EA itu sendiri (immediate) atau isi memori di EA.

## Mengapa begitu banyak mode?

- **Efisiensi program**: satu instruksi dengan mode kompleks menggantikan beberapa instruksi sederhana (CISC).
- **Dukungan struktur data**: array (indexed), record (displacement), pointer (indirect), stack (auto-inc/dec).
- **Kompromi perancangan**: setiap mode menambah kompleksitas decoder. RISC memilih sedikit mode (biasanya register, immediate, dan base + displacement) supaya hardware sederhana dan cepat.

Mode alamat ARM dan x86 mencakup banyak sekali variasi (pre/post-increment, skala), sedangkan MIPS hanya mendukung beberapa saja.

## Rangkuman

- Mode pengalamatan menentukan **cara bidang operand ditafsirkan** untuk mendapat alamat efektif (EA).
- **Immediate**: operand = A. **Direct**: M[A]. **Indirect**: M[M[A]]. **Register**: R. **Register indirect**: M[R]. **Displacement**: M[A + R] (base/indexed/relative). **Stack**: puncak stack.
- Jumlah akses memori: immediate/register 0, direct/register indirect/displacement 1, indirect 2.
- Displacement adalah dasar akses \`a[i]\`, \`s.field\`, dan lompatan PC-relative.
- RISC memakai sedikit mode agar decoding sederhana, CISC banyak mode agar program ringkas.
`,
};
