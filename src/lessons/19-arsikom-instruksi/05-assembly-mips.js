export default {
  id: 'arsikom-assembly',
  judul: 'Assembly MIPS: Dari C ke Kode Mesin',
  tipe: 'teks',
  xp: 30,
  materi: `
# Assembly MIPS: Dari C ke Kode Mesin 🛠️

**Assembly** adalah representasi tekstual dari kode mesin: satu baris assembly (hampir) setara satu instruksi mesin. Kita memakai **MIPS32**, RISC klasik yang bersih, sehingga pola penerjemahan C ke assembly terlihat jelas. Setelah memahami MIPS, membaca ARM atau RISC-V jauh lebih mudah.

## Register MIPS

MIPS punya **32 register** 32 bit, bernomor 0–31, dengan nama konvensional:

| Nama | Nomor | Kegunaan |
| --- | --- | --- |
| \`$zero\` | 0 | Selalu 0 |
| \`$v0\`–\`$v1\` | 2–3 | Nilai hasil fungsi |
| \`$a0\`–\`$a3\` | 4–7 | Argumen fungsi |
| \`$t0\`–\`$t7\` | 8–15 | Sementara (boleh ditimpa pemanggilan) |
| \`$s0\`–\`$s7\` | 16–23 | Disimpan (nilai dipertahankan antar-pemanggilan) |
| \`$t8\`–\`$t9\` | 24–25 | Sementara tambahan |
| \`$sp\` | 29 | Stack pointer |
| \`$ra\` | 31 | Alamat kembali (*return address*) |

## Instruksi dasar

| Instruksi | Arti | Contoh |
| --- | --- | --- |
| \`add rd, rs, rt\` | rd = rs + rt | \`add $t0, $s1, $s2\` |
| \`sub rd, rs, rt\` | rd = rs − rt | \`sub $t0, $s1, $s2\` |
| \`addi rt, rs, imm\` | rt = rs + imm (konstanta 16 bit) | \`addi $t0, $s1, -1\` |
| \`and\`, \`or\`, \`sll\`, \`srl\` | logika dan geser | \`sll $t1, $s3, 2\` (× 4) |
| \`lw rt, offset(rs)\` | rt = M[rs + offset] | \`lw $t0, 4($s1)\` |
| \`sw rt, offset(rs)\` | M[rs + offset] = rt | \`sw $t0, 4($s1)\` |
| \`beq rs, rt, label\` | lompat jika rs = rt | \`beq $s1, $s2, Exit\` |
| \`bne rs, rt, label\` | lompat jika rs ≠ rt | \`bne $s1, $s2, Else\` |
| \`slt rd, rs, rt\` | rd = 1 jika rs < rt | \`slt $t0, $s1, $s2\` |
| \`j label\` | lompat tak bersyarat | \`j Exit\` |
| \`jal label\` / \`jr $ra\` | panggil fungsi / kembali | |

## Pola 1: ekspresi aritmetika

~~~c
f = (g + h) - (i + j);      // f=$s0, g=$s1, h=$s2, i=$s3, j=$s4
~~~

~~~
add  $t0, $s1, $s2        # t0 = g + h
add  $t1, $s3, $s4        # t1 = i + j
sub  $s0, $t0, $t1        # f  = t0 - t1
~~~

Pada MIPS, **setiap instruksi punya tepat tiga operand register**: itu prinsip kesederhanaan yang membuat hardware cepat.

## Pola 2: array (dua langkah: hitung alamat → akses)

~~~c
A[12] = h + A[8];           // h=$s2, alamat dasar A di $s3
~~~

Tiap elemen \`int\` 4 byte, sehingga A[8] berada di offset 8 × 4 = 32 dan A[12] di offset 48:

~~~
lw   $t0, 32($s3)         # t0 = A[8]
add  $t0, $s2, $t0        # t0 = h + A[8]
sw   $t0, 48($s3)         # A[12] = t0
~~~

Untuk indeks variabel A[i], alamatnya dihitung dengan geser kiri 2 (× 4):

~~~
sll  $t1, $s0, 2          # t1 = i × 4
add  $t1, $t1, $s3        # t1 = alamat A + 4i
lw   $t0, 0($t1)          # t0 = A[i]
~~~

## Pola 3: if-else

~~~c
if (i == j) f = g + h;
else        f = g - h;
~~~

~~~
        bne  $s3, $s4, Else      # jika i != j, lompat ke Else
        add  $s0, $s1, $s2       # f = g + h
        j    Exit                # lewati else
Else:   sub  $s0, $s1, $s2       # f = g - h
Exit:
~~~

Perhatikan: kompilator **membalik kondisi** (\`==\` menjadi \`bne\`) dan melompat melewati blok yang tidak dijalankan.

## Pola 4: loop

~~~c
while (save[i] == k)   // save[] di $s6, i=$s3, k=$s5
    i += 1;
~~~

~~~
Loop:   sll  $t1, $s3, 2          # t1 = 4i
        add  $t1, $t1, $s6        # alamat save[i]
        lw   $t0, 0($t1)          # t0 = save[i]
        bne  $t0, $s5, Exit       # keluar jika save[i] != k
        addi $s3, $s3, 1          # i += 1
        j    Loop                 # ulangi
Exit:
~~~

Loop \`for\` dan \`do-while\` mengikuti pola yang sama: **label + lompat bersyarat + lompat tak bersyarat ke atas**.

## Kode mesin: tiga format instruksi

Setiap instruksi MIPS tepat 32 bit, dalam tiga format:

~~~
R-type (register):
 | opcode 6 | rs 5 | rt 5 | rd 5 | shamt 5 | funct 6 |

I-type (immediate / memori / branch):
 | opcode 6 | rs 5 | rt 5 |        immediate 16        |

J-type (jump):
 | opcode 6 |            alamat 26                      |
~~~

### Contoh encode: \`add $t0, $s1, $s2\`

R-type; opcode = 0, funct = 0x20 (ADD). Nomor register: \`$s1\` = 17, \`$s2\` = 18, \`$t0\` = 8.

~~~
opcode  rs     rt     rd     shamt  funct
000000  10001  10010  01000  00000  100000
→ 0000 0010 0011 0010 0100 0000 0010 0000
→ 0x02324020
~~~

### Contoh encode: \`lw $t0, 4($s1)\`

I-type; opcode LW = 0x23 (100011); rs = $s1 (17), rt = $t0 (8), imm = 4.

~~~
100011  10001  01000  0000000000000100
→ 1000 1110 0010 1000 0000 0000 0000 0100
→ 0x8E280004
~~~

### Contoh encode: \`addi $t0, $s1, -1\`

Opcode ADDI = 0x08 (001000), imm = −1 dalam 16 bit komplemen 2 = 0xFFFF.

~~~
001000  10001  01000  1111111111111111
→ 0x2228FFFF
~~~

Immediate dikenai **sign extension** menjadi 32 bit saat dipakai. Konstanta lebih dari 16 bit membutuhkan dua instruksi (\`lui\` + \`ori\`).

## Rasa perbandingan: x86

Untuk \`a = b + c\` (3 variabel di memori), x86 hanya perlu:

~~~
mov eax, [b]
add eax, [c]
mov [a], eax
~~~

Tampak lebih ringkas, tetapi operand memori dan panjang instruksi yang bervariasi membuat pipeline-nya lebih rumit (CISC vs RISC).

## Cara belajar yang efektif

- Tulis fungsi C kecil, lalu lihat assembly-nya di **Compiler Explorer** (godbolt.org) atau dengan \`gcc -S\`. Ubah -O0/-O2 dan bandingkan.
- Pakai simulator **MARS** atau **QtSpim** untuk menjalankan MIPS dan melihat register berubah langkah demi langkah.
- Berlatih "trace": tulis nilai register setelah tiap instruksi.

## Rangkuman

- MIPS: 32 register 32 bit (\`$zero\`, \`$t*\`, \`$s*\`, \`$a*\`, \`$v*\`, \`$sp\`, \`$ra\`), instruksi 3-operand, akses memori hanya lewat \`lw\`/\`sw\`.
- Pola: aritmetika → \`add/sub\`; array → geser kiri 2 + alamat dasar + \`lw/sw\`; if → \`beq/bne\` yang membalik kondisi; loop → label + \`bne/beq\` + \`j\`.
- Tiga format 32 bit: **R** (opcode, rs, rt, rd, shamt, funct), **I** (opcode, rs, rt, imm16), **J** (opcode, alamat 26).
- Contoh encode: \`add $t0,$s1,$s2\` = \`0x02324020\`; \`lw $t0,4($s1)\` = \`0x8E280004\`; \`addi $t0,$s1,-1\` = \`0x2228FFFF\`.
`,
};
