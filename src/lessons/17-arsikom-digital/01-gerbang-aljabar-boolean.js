export default {
  id: 'arsikom-gerbang',
  judul: 'Gerbang Logika & Aljabar Boolean',
  tipe: 'teks',
  xp: 20,
  materi: `
# Gerbang Logika & Aljabar Boolean 🔌

Kita turun ke level paling bawah: **logika digital**. Semua yang dilakukan CPU, dari menjumlah sampai menjalankan program, dibangun dari blok sederhana bernama **gerbang logika** (*logic gate*). Satu gerbang mengambil satu atau lebih sinyal 0/1 dan menghasilkan satu sinyal 0/1 menurut aturan tetap.

## Gerbang dasar

| Gerbang | Notasi Boolean | Keluaran bernilai 1 jika ... |
| --- | --- | --- |
| **NOT** (inverter) | A' atau Ā | A = 0 |
| **AND** | A · B (atau AB) | A dan B keduanya 1 |
| **OR** | A + B | A atau B (atau keduanya) 1 |
| **NAND** | (AB)' | **bukan** keduanya 1 |
| **NOR** | (A + B)' | tidak ada yang 1 |
| **XOR** | A ⊕ B | A dan B **berbeda** |
| **XNOR** | (A ⊕ B)' | A dan B **sama** |

Tabel kebenaran untuk dua masukan:

| A | B | AND | OR | NAND | NOR | XOR | XNOR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 |

Operator bitwise yang kamu pelajari sebelumnya (\`&\`, \`|\`, \`^\`, \`~\`) adalah gerbang-gerbang ini yang bekerja pada 32 atau 64 bit sekaligus.

## Dari transistor ke gerbang

Gerbang dibangun dari **transistor** yang berperan sebagai saklar elektronik. Teknologi dominan, **CMOS**, menyusun transistor pMOS dan nMOS berpasangan:

- **NOT** memakai 2 transistor.
- **NAND** dan **NOR** memakai 4 transistor.
- **AND** dan **OR** sebenarnya = NAND/NOR + inverter, sehingga memakai 6 transistor.

Itu sebabnya NAND dan NOR lebih murah dan cepat daripada AND dan OR. Setiap gerbang punya **delay propagasi** (waktu keluaran menyesuaikan setelah masukan berubah), biasanya beberapa pikodetik pada teknologi modern. Jumlah gerbang yang dilewati sinyal menentukan seberapa cepat clock bisa berjalan.

### Gerbang universal

**NAND saja** (atau NOR saja) cukup untuk membangun semua fungsi logika lain:

~~~
NOT A      = NAND(A, A)
A AND B    = NOT( NAND(A, B) )
A OR B     = NAND( NOT A, NOT B )
~~~

Karena itu satu jenis gerbang bisa dicetak jutaan kali di chip. Ini bukan trik teori: memori flash NAND dinamai dari strukturnya.

## Aljabar Boolean

Aljabar Boolean (George Boole, 1854) memberi aturan untuk memanipulasi ekspresi logika sehingga rangkaian bisa **disederhanakan** (lebih sedikit gerbang = lebih murah, cepat, hemat daya).

| Hukum | Bentuk AND | Bentuk OR |
| --- | --- | --- |
| Identitas | A · 1 = A | A + 0 = A |
| Nol/Satu | A · 0 = 0 | A + 1 = 1 |
| Idempoten | A · A = A | A + A = A |
| Komplemen | A · A' = 0 | A + A' = 1 |
| Involusi | (A')' = A | |
| Komutatif | AB = BA | A + B = B + A |
| Asosiatif | (AB)C = A(BC) | (A+B)+C = A+(B+C) |
| Distributif | A(B + C) = AB + AC | A + BC = (A+B)(A+C) |
| Absorpsi | A(A + B) = A | A + AB = A |

Perhatikan hukum distributif bentuk OR, **A + BC = (A+B)(A+C)**, yang tidak ada padanannya di aljabar biasa.

### Hukum De Morgan (paling penting!)

~~~
(A · B)' = A' + B'          NAND = OR dari komplemen
(A + B)' = A' · B'          NOR  = AND dari komplemen
~~~

Cara mengingat: "pecahkan garis, ganti operator". Hukum ini dipakai terus-menerus, termasuk saat kamu menulis \`!(a && b)\` = \`!a || !b\` di program.

### Contoh penyederhanaan

Sederhanakan F = AB + AB'.

~~~
F = A(B + B')     faktorkan A
  = A · 1         komplemen
  = A
~~~

Rangkaian dua AND, satu OR, satu NOT menyusut menjadi sehelai kabel.

Contoh lain, F = A + A'B:

~~~
F = (A + A')(A + B)   distributif OR
  = 1 · (A + B)       komplemen
  = A + B
~~~

## Bentuk kanonik: dari tabel kebenaran ke rumus

Tabel kebenaran menjelaskan fungsi sepenuhnya. Untuk mengubahnya menjadi rumus:

- **Minterm** (mᵢ): hasil AND dari **semua variabel**, yang bernilai 1 tepat pada baris ke-i. Contoh 3 variabel: m₃ (011) = A'BC.
- **SOP** (*Sum of Products*): OR dari semua minterm pada baris yang keluarannya **1**.

**Contoh: fungsi mayoritas** 3 masukan, keluaran 1 bila minimal dua masukan bernilai 1.

| A | B | C | F |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | **1** |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | **1** |
| 1 | 1 | 0 | **1** |
| 1 | 1 | 1 | **1** |

SOP kanonik: **F = A'BC + AB'C + ABC' + ABC = Σm(3, 5, 6, 7)**.

Disederhanakan dengan aljabar (gunakan ABC + ABC = ABC, tiga kali):

~~~
F = A'BC + ABC  +  AB'C + ABC  +  ABC' + ABC
  = BC(A' + A)  +  AC(B' + B)  +  AB(C' + C)
  = BC + AC + AB
~~~

Bentuk dualnya adalah **POS** (*Product of Sums*): AND dari **maxterm** pada baris keluaran 0. Keduanya setara; SOP lebih lazim dipakai.

Untuk fungsi dengan banyak variabel, penyederhanaan dengan aljabar mudah salah. Pelajaran berikutnya memperkenalkan cara visual: **Karnaugh map**.

## Rangkuman

- Gerbang dasar: NOT, AND, OR, NAND, NOR, XOR, XNOR. NAND dan NOR bersifat **universal**.
- Gerbang dibuat dari transistor CMOS: NOT 2 transistor, NAND/NOR 4 transistor.
- Hukum aljabar Boolean (identitas, komplemen, distributif, absorpsi) dan **De Morgan** memungkinkan penyederhanaan rangkaian.
- Tabel kebenaran → **SOP**: OR dari minterm pada baris keluaran 1. Contoh mayoritas: F = AB + AC + BC.
`,
};
