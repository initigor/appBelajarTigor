export default {
  id: 'arsikom-siklus-instruksi',
  judul: 'Siklus Instruksi: Fetch, Decode, Execute',
  tipe: 'teks',
  xp: 25,
  materi: `
# Siklus Instruksi: Fetch, Decode, Execute 🔄

Inilah inti cara kerja komputer. Setiap program, mulai dari "Halo Dunia" sampai game 3D, dijalankan CPU dengan **mengulang tiga langkah yang sama miliaran kali per detik**:

~~~
┌──────────► FETCH   ambil instruksi dari memori (alamat di PC)
│                │
│                ▼
│            DECODE  tafsirkan opcode, tentukan apa yang harus dilakukan
│                │
│                ▼
└────────── EXECUTE  kerjakan (hitung, baca/tulis memori, lompat)
~~~

## Notasi transfer register (RTL)

Untuk mendeskripsikan langkah-langkah di dalam CPU, dipakai notasi **transfer register**: \`A ← B\` berarti isi B disalin ke A, \`M[x]\` berarti isi memori di alamat x. Satu baris pada satu **waktu t** berisi transfer yang bisa terjadi serentak.

## Fase 1: Fetch (ambil instruksi)

Tujuan: membawa instruksi yang alamatnya di **PC** ke **IR**.

~~~
t1:  MAR ← PC               alamat instruksi dikirim ke bus alamat
t2:  MBR ← M[MAR]           memori membalas dengan isi instruksi lewat bus data
     PC  ← PC + 1           PC maju (di mesin 4-byte: PC + 4)
t3:  IR  ← MBR              instruksi tersimpan di IR
~~~

Perhatikan: **PC dinaikkan segera pada fase fetch**, sebelum instruksi dikerjakan, sehingga instruksi berikutnya selalu siap. Instruksi lompat nanti menimpa nilai PC itu.

## Fase 2: Decode (tafsirkan)

Unit kontrol membaca bagian **opcode** di IR dan menentukan:

- Jenis operasi (tambah, load, lompat ...).
- Operand ada di mana (register, memori, nilai langsung di dalam instruksi).
- Sinyal kontrol apa yang akan dikeluarkan pada fase execute.

Pada fase ini bagian instruksi dipecah: contoh format 8 bit \`[opcode 4 bit | alamat 4 bit]\`.

## Fase 3: Execute (kerjakan)

Isinya bergantung pada instruksi. Empat kategori besar:

| Kategori | Contoh | Yang terjadi |
| --- | --- | --- |
| **Pemrosesan data** | \`ADD\`, \`AND\`, \`SHL\` | ALU menghitung dari register/operand |
| **Transfer data** | \`LOAD\`, \`STORE\`, \`MOV\` | Data bergerak antara register dan memori/I/O |
| **Kontrol aliran** | \`JMP\`, \`JZ\`, \`CALL\`, \`RET\` | PC diisi alamat baru |
| **I/O** | \`IN\`, \`OUT\` | Data ke/dari perangkat |

### Contoh transfer register untuk tiap jenis (mesin akumulator)

Misalkan instruksi memiliki format [opcode | alamat], dan CPU memiliki register akumulator **AC**.

**LOAD X** (AC ← M[X]):

~~~
t1: MAR ← IR[alamat]
t2: MBR ← M[MAR]
t3: AC  ← MBR
~~~

**ADD X** (AC ← AC + M[X]):

~~~
t1: MAR ← IR[alamat]
t2: MBR ← M[MAR]
t3: AC  ← AC + MBR          (ALU menjumlahkan)
~~~

**STORE X** (M[X] ← AC):

~~~
t1: MAR ← IR[alamat]
t2: MBR ← AC
t3: M[MAR] ← MBR
~~~

**JMP X** (lompat):

~~~
t1: PC ← IR[alamat]         menimpa PC yang sudah dinaikkan saat fetch
~~~

**JZ X** (lompat jika AC = 0): \`jika (AC == 0) maka PC ← IR[alamat]\`. Instruksi lompat bersyarat inilah yang menerjemahkan \`if\` dan \`while\` dalam program.

## Gambaran lengkap: mengeksekusi \`ADD 14\`

Misalkan PC = 2, dan M[2] berisi instruksi \`ADD 14\`, M[14] berisi 3, AC = 5.

| Langkah | Operasi | Hasil |
| --- | --- | --- |
| Fetch t1 | MAR ← PC | MAR = 2 |
| Fetch t2 | MBR ← M[2]; PC ← PC+1 | MBR = ADD 14, PC = 3 |
| Fetch t3 | IR ← MBR | IR = ADD 14 |
| Decode | CU membaca opcode = ADD | siap menjalankan penjumlahan |
| Exec t1 | MAR ← 14 | MAR = 14 |
| Exec t2 | MBR ← M[14] | MBR = 3 |
| Exec t3 | AC ← AC + MBR | AC = 5 + 3 = **8** |

Satu instruksi sederhana saja membutuhkan **dua kali akses memori** (satu untuk instruksinya, satu untuk operandnya).

## Siklus lengkap: ada fase tambahan

Diagram status siklus instruksi yang lengkap (Stallings):

~~~
        ┌─────────────────────────────────────────┐
        ▼                                         │
 [Fetch instruksi] → [Decode] → [Hitung alamat operand]
                                        │
                      [Fetch operand (bisa berulang)]
                                        │
                      [Operasi data] → [Simpan hasil]
                                        │
                              [Cek interupsi] ──────┘
~~~

- **Indirect cycle**: bila operand dialamati secara tidak langsung (alamat ada di memori), butuh satu akses memori tambahan untuk memperoleh alamat sebenarnya.
- **Interrupt cycle**: setelah tiap instruksi selesai, CPU memeriksa apakah ada interupsi yang menunggu (pelajaran berikutnya).

## Kecepatan dan hubungannya dengan CPI

Siklus di atas tidak harus selesai dalam satu siklus clock. Pada desain sederhana (**multi-cycle**), tiap langkah di atas memakan satu siklus clock dan instruksi berbeda memakan jumlah siklus berbeda: itulah asal konsep **CPI** yang kamu pelajari di Bab 1.

| Desain | Siklus per instruksi (CPI) | Catatan |
| --- | --- | --- |
| **Single-cycle** | 1 | Clock lambat (menyesuaikan instruksi terlama) |
| **Multi-cycle** | 3–5 | Clock cepat, instruksi sederhana selesai lebih cepat |
| **Pipeline** (Bab 7) | ≈ 1 | Banyak instruksi tumpang tindih |

CPU modern tidak mengerjakan fetch → decode → execute satu per satu, melainkan membuat tahap-tahapnya **bertumpuk** supaya selagi satu instruksi dieksekusi, instruksi berikutnya sedang di-decode dan yang sesudahnya di-fetch. Hasilnya: kira-kira satu instruksi selesai per siklus.

## Rangkuman

- Siklus instruksi: **fetch** (MAR ← PC; MBR ← M[MAR]; PC ← PC+1; IR ← MBR) → **decode** (CU membaca opcode) → **execute**. Diulang terus.
- **PC dinaikkan saat fetch**; instruksi lompat menimpa PC.
- Satu instruksi seperti ADD butuh akses memori untuk instruksinya dan untuk operandnya.
- Execute bergantung jenis instruksi: pemrosesan data, transfer data, kontrol aliran, atau I/O.
- Siklus lengkap juga dapat memuat *indirect cycle* dan *interrupt cycle*. Pipeline membuat tahapan bertumpuk agar CPI mendekati 1.
`,
};
