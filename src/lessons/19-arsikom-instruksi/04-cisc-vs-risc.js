export default {
  id: 'arsikom-cisc-risc',
  judul: 'CISC vs RISC',
  tipe: 'teks',
  xp: 20,
  materi: `
# CISC vs RISC ⚔️

Dua filosofi besar merancang set instruksi bertentangan secara mendasar, dan perdebatannya membentuk industri prosesor. Hari ini hampir semua HP memakai **RISC (ARM)** dan hampir semua PC lama memakai **CISC (x86)**. Pelajaran ini menjelaskan kenapa.

## Latar belakang

Pada 1960–1970-an, memori mahal dan lambat, kompilator primitif. Perancang CPU menambah **instruksi yang sangat kuat** (misalnya satu instruksi untuk menyalin string, atau menghitung polinomial) supaya program pendek dan pemrograman assembly mudah. Hasilnya: **CISC** (*Complex Instruction Set Computer*), contohnya VAX dan x86.

Pada awal 1980-an, tim di IBM (801), Berkeley (RISC-I, David Patterson), dan Stanford (MIPS, John Hennessy) mengukur program nyata. Temuannya mengejutkan:

- Kompilator hampir tidak memakai instruksi kompleks; sebagian besar waktu dihabiskan di **instruksi sederhana** (load, store, add, branch).
- Instruksi kompleks memaksa seluruh CPU menjadi lambat dan rumit.

Gagasannya: **buat hardware sederhana dan cepat, serahkan kerumitan ke kompilator**. Lahirlah **RISC** (*Reduced Instruction Set Computer*).

## Ciri-ciri

| Aspek | **CISC** (x86) | **RISC** (ARM, MIPS, RISC-V) |
| --- | --- | --- |
| Jumlah instruksi | Banyak (ratusan) | Sedikit (puluhan sampai ±100) |
| Kompleksitas instruksi | Tinggi (satu instruksi bisa banyak langkah) | Sederhana, satu langkah |
| Panjang instruksi | **Variabel** (1–15 byte) | **Tetap** (biasanya 4 byte) |
| Akses memori | Banyak instruksi boleh langsung ke memori | Hanya **LOAD/STORE** (*load-store architecture*) |
| Mode pengalamatan | Banyak dan rumit | Sedikit (register, immediate, base+offset) |
| Jumlah register umum | Sedikit (x86: 8 → 16) | **Banyak** (32) |
| CPI | Bervariasi, sering > 1 | Hampir 1 (mudah di-pipeline) |
| Ukuran program | Lebih kecil (kode padat) | Lebih besar (lebih banyak instruksi) |
| Unit kontrol | Banyak memakai **microcode** | **Hardwired** (sirkuit langsung) |
| Beban kompilator | Ringan | Berat (optimasi penting) |

## Contoh langsung: \`a = b + c\` dengan a, b, c di memori

**CISC (x86)** dapat menaruh operand memori langsung di instruksi aritmetika:

~~~
mov  eax, [b]        ; eax = b
add  eax, [c]        ; eax = eax + c   (operand dari memori)
mov  [a], eax        ; a = eax
~~~

**RISC (MIPS)**: aritmetika hanya antar-register, memori hanya lewat \`lw\`/\`sw\`:

~~~
lw   $t0, b          ; t0 = b
lw   $t1, c          ; t1 = c
add  $t2, $t0, $t1   ; t2 = t0 + t1
sw   $t2, a          ; a = t2
~~~

RISC memakai lebih banyak instruksi (4 vs 3), tetapi **tiap instruksi sederhana, berukuran sama, dan seragam waktu**, sehingga cocok untuk pipeline (Bab 7).

## Kenapa RISC mudah di-pipeline?

Pipeline membutuhkan instruksi yang:

- **Panjang sama**: tahap fetch tahu persis letak instruksi berikutnya (PC + 4).
- **Format seragam**: field opcode dan register di posisi tetap, sehingga decode dan pembacaan register serentak.
- **Hanya LOAD/STORE ke memori**: tahap akses memori hanya ada pada dua jenis instruksi.
- **Durasi kira-kira sama**: mudah menyeimbangkan tahap.

x86 dengan instruksi 1–15 byte dan operand memori di mana-mana sangat sulit di-pipeline secara langsung.

## Prosesor x86 modern: CISC di luar, RISC di dalam

Intel dan AMD menemukan jalan tengah. Dari sisi **luar** (ISA yang kamu lihat), x86 tetap CISC demi kompatibilitas dengan puluhan tahun perangkat lunak. Di **dalam**, **decoder** menerjemahkan instruksi x86 menjadi **mikro-operasi (µops)** sederhana ala RISC, yang dijalankan oleh inti pipeline superscalar.

~~~
  Instruksi x86 (kompleks, panjang variabel)
            │
       [ decoder ]   →  µop sederhana (RISC-like)
            │
   [ pipeline superscalar, out-of-order ]
~~~

Dengan begitu x86 mendapat kompatibilitas CISC dan kecepatan RISC, dengan harga kerumitan decoder dan daya lebih besar.

## ARM, RISC-V, dan MIPS

- **ARM**: RISC yang mendominasi ponsel dan tablet (efisiensi daya), serta masuk ke laptop (Apple M-series) dan server. Lisensi berbayar.
- **RISC-V**: ISA RISC **terbuka** (tanpa biaya lisensi), berkembang pesat untuk mikrokontroler dan riset. Format bersih dan modular. Banyak digunakan pengajaran modern.
- **MIPS**: RISC klasik yang jelas dan sederhana, dipilih sebagai bahasa pengajaran, termasuk di buku Patterson & Hennessy.

## Apakah perdebatannya sudah selesai?

Praktisnya, perbedaan makin kabur:

- RISC modern menambah instruksi (SIMD, kriptografi), jadi tidak lagi "reduced" secara harfiah.
- CISC modern membangun inti RISC di dalamnya.
- Yang tersisa adalah perbedaan **efisiensi energi** (RISC unggul pada decoding sederhana) dan **ekosistem** (x86 untuk PC/server warisan, ARM untuk mobile dan makin ke server/laptop, RISC-V untuk pendatang baru).

Yang abadi adalah kerangka berpikirnya: waktu CPU = IC × CPI × T. CISC menekan **IC** (jumlah instruksi) tetapi cenderung menaikkan CPI; RISC menaikkan IC tetapi menekan **CPI** dan memungkinkan **T** (periode clock) yang kecil.

## Rangkuman

- **CISC**: banyak instruksi kompleks, panjang variabel, operand memori boleh langsung, banyak mode alamat, program padat (x86).
- **RISC**: instruksi sederhana, panjang tetap, load-store, banyak register, sedikit mode alamat, mudah di-pipeline (ARM, MIPS, RISC-V).
- RISC lahir dari pengamatan bahwa kompilator jarang memakai instruksi kompleks.
- x86 modern menerjemahkan instruksi CISC menjadi **µops RISC** di dalam chip.
- Waktu CPU = IC × CPI × T: CISC menekan IC, RISC menekan CPI dan T.
`,
};
