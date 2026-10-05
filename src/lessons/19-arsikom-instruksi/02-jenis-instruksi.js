export default {
  id: 'arsikom-jenis-instruksi',
  judul: 'Jenis-Jenis Instruksi dan Tipe Operand',
  tipe: 'teks',
  xp: 15,
  materi: `
# Jenis-Jenis Instruksi dan Tipe Operand 🧰

Walaupun CPU berbeda-beda, instruksinya jatuh ke beberapa golongan yang sangat mirip. Mengenali golongan ini memudahkanmu membaca assembly arsitektur apa pun (x86, ARM, MIPS, RISC-V).

## Enam golongan utama

### 1. Transfer data

Memindahkan data antar register atau antara register dan memori. **Tidak mengubah nilainya**, hanya menyalin.

| Instruksi | Arti | Contoh |
| --- | --- | --- |
| \`MOV\` / \`MOVE\` | Salin register ke register (atau immediate) | \`MOV R1, R2\` |
| \`LOAD\` / \`LW\` | Memori → register | \`LW R1, 8(R2)\` |
| \`STORE\` / \`SW\` | Register → memori | \`SW R1, 8(R2)\` |
| \`PUSH\` / \`POP\` | Dari/ke puncak stack | \`PUSH R1\` |

Operasi transfer menjelaskan banyak hal: pada RISC, **hanya LOAD dan STORE** yang boleh menyentuh memori (arsitektur *load-store*).

### 2. Aritmetika

\`ADD\`, \`SUB\`, \`MUL\`, \`DIV\`, \`INC\`, \`DEC\`, \`NEG\`, \`ABS\`. Berlaku untuk bilangan bulat; versi floating point biasanya berawalan F (\`FADD\`, \`FMUL\`). Instruksi ini juga mengatur **flag** (Z, N, C, V).

### 3. Logika dan bit

| Jenis | Instruksi |
| --- | --- |
| Operasi bitwise | \`AND\`, \`OR\`, \`XOR\`, \`NOT\` |
| Geser dan putar | \`SHL\`/\`SLL\`, \`SHR\`/\`SRL\`, \`SAR\`/\`SRA\`, \`ROL\`, \`ROR\` |
| Uji dan set bit | \`TEST\`, \`BTS\` |

Dipakai untuk topeng bit, kriptografi, dan pengalian/pembagian pangkat dua (Bab 3).

### 4. Perbandingan dan kontrol aliran

Mengubah urutan eksekusi dengan menimpa **PC**.

| Jenis | Instruksi | Perilaku |
| --- | --- | --- |
| **Lompat tak bersyarat** | \`JMP\`, \`J\` | PC ← alamat target |
| **Lompat bersyarat (branch)** | \`JZ\`, \`JNE\`, \`BEQ\`, \`BNE\`, \`BLT\` | PC ← target **jika** kondisi (flag/perbandingan) terpenuhi |
| **Panggil prosedur** | \`CALL\`, \`JAL\` | Simpan alamat kembali, lompat ke fungsi |
| **Kembali** | \`RET\`, \`JR $ra\` | Ambil alamat kembali, PC ← alamat itu |
| **Perbandingan** | \`CMP\`, \`SLT\` | Mengubah flag / menghasilkan 0 atau 1 |

\`if\`, \`while\`, \`for\`, dan pemanggilan fungsi dalam bahasa tingkat tinggi semuanya diterjemahkan menjadi instruksi golongan ini.

### 5. Input/Output

\`IN\`, \`OUT\` (port-mapped), atau memakai \`LOAD\`/\`STORE\` ke alamat khusus (memory-mapped, Bab 5).

### 6. Sistem dan kontrol CPU

\`SYSCALL\`/\`INT\` (panggil layanan OS), \`HLT\` (hentikan CPU), \`NOP\` (tidak melakukan apa-apa, 1 siklus), \`CLI\`/\`STI\` (matikan/nyalakan interupsi), instruksi mengubah mode privileged. Instruksi-instruksi *privileged* hanya boleh dijalankan oleh kernel, bukan program biasa.

## Menerjemahkan C ke golongan instruksi

~~~c
int jumlah = 0;
for (int i = 0; i < n; i++) {
    jumlah += a[i];
}
~~~

Kira-kira kompiler akan menghasilkan:

| Bagian C | Golongan instruksi |
| --- | --- |
| \`jumlah = 0\`, \`i = 0\` | Transfer data (immediate ke register) |
| \`a[i]\` | Hitung alamat (aritmetika/geser) lalu \`LOAD\` |
| \`jumlah += ...\`, \`i++\` | Aritmetika |
| \`i < n\` | Perbandingan |
| Kembali ke awal loop jika benar | Lompat bersyarat |

Satu baris C bisa menjadi 5–10 instruksi mesin.

## Tipe data pada tingkat mesin

Instruksi mengoperasikan beberapa **tipe operand**:

| Tipe | Ukuran | Catatan |
| --- | --- | --- |
| **Alamat** | 32/64 bit | Dianggap bilangan tak bertanda |
| **Bilangan bulat** | 8, 16, 32, 64 bit | Bertanda atau tak bertanda; instruksi berbeda (mis. \`MUL\` vs \`IMUL\`, \`SHR\` vs \`SAR\`) |
| **Floating point** | 32/64 bit | IEEE 754, unit tersendiri (FPU) |
| **Karakter** | 8/16 bit | ASCII, UTF-16 |
| **Data logika / bit** | 1 sampai n bit | Flag, topeng bit |
| **Vektor (SIMD)** | 128–512 bit | Satu instruksi memproses beberapa elemen sekaligus (Bab 10) |

Mesin tidak mencatat **tipe** sebuah nilai: bit-bit yang sama bisa berarti bilangan bulat, floating point, atau karakter. **Instruksi yang dipakai** yang menentukan tafsirannya. Itulah alasan casting dan pointer yang salah di C bisa membaca sampah.

## Contoh instruksi SIMD

Instruksi biasa memproses satu nilai. Instruksi **SIMD** (*Single Instruction, Multiple Data*) memproses **banyak nilai sekaligus** dalam register lebar:

~~~
Register 128 bit berisi 4 bilangan float 32 bit:
   [ a3 | a2 | a1 | a0 ]
 + [ b3 | b2 | b1 | b0 ]
 = [ a3+b3 | a2+b2 | a1+b1 | a0+b0 ]      ← satu instruksi, empat penjumlahan
~~~

Dipakai pada grafika, audio, video, dan AI (SSE, AVX pada x86; NEON pada ARM).

## Rangkuman

- Enam golongan: **transfer data**, **aritmetika**, **logika/bit**, **kontrol aliran** (lompat, panggil, kembali), **I/O**, dan **sistem**.
- Pada RISC, hanya LOAD/STORE yang mengakses memori. \`if/while/for/fungsi\` menjadi perbandingan + lompat bersyarat + CALL/RET.
- Tipe operand: alamat, bilangan bulat, floating point, karakter, bit logika, dan vektor. Tipenya ditentukan oleh **instruksi yang dipakai**, bukan oleh bit-nya.
- **SIMD** memproses banyak data dengan satu instruksi.
`,
};
