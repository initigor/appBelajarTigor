export default {
  id: 'arsikom-format-instruksi',
  judul: 'Format Instruksi dan Jumlah Alamat',
  tipe: 'teks',
  xp: 20,
  materi: `
# Format Instruksi dan Jumlah Alamat 📐

**Instruksi mesin** adalah deretan bit yang dipahami CPU. Kumpulan seluruh instruksi yang dikenali sebuah CPU disebut **set instruksi** (ISA). Bab ini membahas ISA dari sudut pandang desain: apa isi sebuah instruksi, dan pilihan apa yang dihadapi perancang.

## Unsur-unsur sebuah instruksi

Setiap instruksi harus menjawab empat pertanyaan:

| Unsur | Pertanyaan | Wujud dalam instruksi |
| --- | --- | --- |
| **Opcode** | Operasi apa? | Kode bit (mis. ADD = 0010) |
| **Operand sumber** | Data masukan dari mana? | Register, alamat memori, atau nilai langsung (*immediate*) |
| **Operand tujuan** | Hasil disimpan di mana? | Register atau alamat memori |
| **Instruksi berikutnya** | Lanjut ke mana? | Biasanya implisit: instruksi sesudahnya (PC + panjang). Lompatan menyebutnya eksplisit |

Format sederhana:

~~~
 +----------+----------+----------+----------+
 |  opcode  | operand1 | operand2 | operand3 |
 +----------+----------+----------+----------+
~~~

Alamat operand dapat berupa nomor register, alamat memori, atau konstanta yang tertanam langsung dalam instruksi.

## Berapa alamat per instruksi?

Pilihan paling mendasar: berapa operand yang disebut eksplisit. Mari lihat bagaimana mengkode ekspresi **X = (A + B) × (C − D)** pada tiap gaya. (T1 dan T2 adalah penyimpan sementara.)

### 3 alamat: \`OP tujuan, sumber1, sumber2\`

~~~
ADD  T1, A, B        ; T1 = A + B
SUB  T2, C, D        ; T2 = C − D
MUL  X, T1, T2       ; X = T1 × T2
~~~

**3 instruksi.** Rapi dan mudah dipahami kompiler; dipakai RISC (MIPS, ARM, RISC-V). Namun tiap instruksi panjang karena membawa tiga alamat.

### 2 alamat: \`OP tujuan, sumber\` (tujuan juga menjadi operand: tujuan ← tujuan OP sumber)

~~~
MOV  T1, A
ADD  T1, B           ; T1 = A + B
MOV  T2, C
SUB  T2, D           ; T2 = C − D
MUL  T1, T2          ; T1 = T1 × T2
MOV  X, T1
~~~

**6 instruksi.** Instruksi lebih pendek, tetapi butuh \`MOV\` ekstra karena operand tujuan ikut tertimpa. Gaya x86.

### 1 alamat: akumulator

Satu operand disebut eksplisit, operand lain **implisit** di akumulator (AC).

~~~
LOAD  A              ; AC = A
ADD   B              ; AC = AC + B
STORE T              ; T = AC
LOAD  C
SUB   D              ; AC = C − D
MUL   T              ; AC = AC × T
STORE X
~~~

**7 instruksi.** Mesin lama dan mikrokontroler kecil.

### 0 alamat: mesin stack

Semua operand diambil dari **puncak stack** secara implisit. Hanya \`PUSH\` dan \`POP\` yang menyebut alamat.

~~~
PUSH A
PUSH B
ADD                   ; ambil dua teratas, dorong A+B
PUSH C
PUSH D
SUB
MUL
POP  X
~~~

**8 instruksi**, tetapi sebagian besar tanpa operand sama sekali. Dipakai **Java Virtual Machine** (bytecode) dan kalkulator RPN. Cocok untuk ekspresi bersarang, namun akses data acak sulit.

### Ringkasan

| Alamat | Instruksi pada contoh | Panjang tiap instruksi | Contoh |
| --- | --- | --- | --- |
| 3 | 3 | Panjang | MIPS, ARM, RISC-V |
| 2 | 6 | Sedang | x86 |
| 1 | 7 | Pendek | Akumulator klasik |
| 0 | 8 | Sangat pendek | JVM, mesin stack |

**Kompromi**: lebih banyak alamat per instruksi → program lebih **pendek** (lebih sedikit instruksi) tetapi tiap instruksi **lebih panjang** dan siklus fetch lebih berat. Lebih sedikit alamat → instruksi ringkas, tetapi butuh lebih banyak instruksi.

## Panjang instruksi

Pilihan penting lain: instruksi berukuran **tetap** atau **variabel**?

| Aspek | Panjang tetap (RISC) | Panjang variabel (CISC) |
| --- | --- | --- |
| Contoh | MIPS, ARM: 4 byte semua | x86: 1 sampai 15 byte |
| Decode | Mudah, cepat | Rumit |
| Fetch dan pipeline | Mudah (alamat berikutnya = PC + 4) | Sulit (perlu tahu panjang dulu) |
| Kepadatan kode | Lebih boros | Lebih padat |

Panjang instruksi juga harus **sejalan** dengan lebar bus dan memori: instruksi dua kali lebar bus butuh dua kali fetch.

## Opcode yang diperluas (expanding opcode)

Panjang instruksi terbatas, jadi bit harus dibagi antara opcode dan operand. Teknik **expanding opcode** memakai opcode pendek untuk instruksi beroperand banyak, dan opcode lebih panjang (dengan memakai bit operand) untuk instruksi beroperand sedikit.

**Contoh: instruksi 16 bit, setiap field 4 bit.**

~~~
Instruksi 3 alamat:   [opcode 4][A 4][B 4][C 4]
    memakai opcode 0000 sampai 1110  →  15 instruksi 3-alamat
    opcode 1111 dipakai sebagai AWALAN untuk memperluas

Instruksi 2 alamat:   [1111][ekstensi 4][A 4][B 4]
    ekstensi 0000 sampai 1111        →  sampai 16 instruksi 2-alamat
~~~

Dengan memakai awalan dan bit-bit operand yang tidak diperlukan, satu format 16 bit dapat menampung ratusan instruksi dari berbagai jumlah operand. Rancang opcode pendek untuk instruksi yang paling sering dipakai supaya program kecil.

## Isi operand: apa saja yang bisa diacu?

Operand dapat berupa:

- **Register**: cepat, hanya perlu beberapa bit (32 register = 5 bit).
- **Alamat memori**: butuh banyak bit (alamat 32 bit = 32 bit!), sehingga RISC melarangnya pada instruksi aritmetika.
- **Nilai langsung (immediate)**: konstanta di dalam instruksi, misalnya \`ADDI R1, R2, 5\`. Ukurannya terbatas (mis. 16 bit pada MIPS).

Karena nomor register sangat pendek, **instruksi berbasis register jauh lebih ringkas** daripada berbasis alamat memori. Itulah alasan arsitektur modern memiliki banyak register.

## Rangkuman

- Instruksi memuat **opcode**, **operand sumber**, **operand tujuan**, dan (implisit) alamat instruksi berikutnya.
- Jumlah alamat: **3** (X = (A+B)×(C−D) → 3 instruksi), **2** (6), **1/akumulator** (7), **0/stack** (8). Makin sedikit alamat, instruksi makin pendek tetapi jumlah instruksi bertambah.
- Panjang **tetap** (RISC) mempermudah decode dan pipeline; panjang **variabel** (x86) lebih padat tetapi rumit.
- **Expanding opcode** menukar bit operand dengan opcode agar format yang pendek memuat banyak instruksi.
- Operand berupa register (ringkas), alamat memori (panjang), atau immediate (konstanta).
`,
};
