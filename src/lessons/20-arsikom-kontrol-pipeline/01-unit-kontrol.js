export default {
  id: 'arsikom-unit-kontrol',
  judul: 'Unit Kontrol: Hardwired vs Microprogrammed',
  tipe: 'teks',
  xp: 25,
  materi: `
# Unit Kontrol: Hardwired vs Microprogrammed 🎛️

Datapath (ALU, register, bus) hanya kumpulan otot. **Unit kontrol** adalah sarafnya: ia membaca instruksi dan mengirim **sinyal kontrol** ke setiap bagian agar melakukan hal yang tepat pada saat yang tepat. Pelajaran ini menjawab: bagaimana sinyal-sinyal itu dibangkitkan?

## Sinyal kontrol: contoh pada datapath MIPS

Sebuah instruksi hanya berubah menjadi tindakan fisik lewat sinyal-sinyal seperti:

| Sinyal | Arti bila aktif |
| --- | --- |
| \`RegWrite\` | Tulis hasil ke register file |
| \`RegDst\` | Register tujuan = rd (R-type) atau rt (I-type) |
| \`ALUSrc\` | Operand kedua ALU = immediate (bukan register) |
| \`MemRead\` / \`MemWrite\` | Baca / tulis memori data |
| \`MemtoReg\` | Data yang ditulis ke register berasal dari memori (bukan ALU) |
| \`Branch\` | Instruksi adalah lompat bersyarat |
| \`ALUOp\` | Jenis operasi untuk ALU (2 bit, diterjemahkan lagi oleh pengendali ALU) |

Nilai sinyal bergantung pada **opcode**:

| Instruksi | RegDst | ALUSrc | MemtoReg | RegWrite | MemRead | MemWrite | Branch | ALUOp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **R-type** (add, sub ...) | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 10 |
| **lw** | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 00 |
| **sw** | X | 1 | X | 0 | 0 | 1 | 0 | 00 |
| **beq** | X | 0 | X | 0 | 0 | 0 | 1 | 01 |

(X = don't care.) Perhatikan bahwa tabel ini **adalah tabel kebenaran**: masukannya opcode 6 bit, keluarannya sinyal kontrol. Fungsi seperti ini bisa disederhanakan dengan K-map atau diimplementasikan sebagai decoder + gerbang OR (Bab 4). Misalnya \`RegWrite = R-type OR lw\`.

## Cara 1: Hardwired (kendali terpasang)

Unit kontrol dibangun sebagai **rangkaian logika** (gerbang, decoder, FSM) yang langsung menghasilkan sinyal dari opcode dan keadaan.

~~~
 opcode, flag ─►┌───────────────────┐
 clock ────────►│ FSM + logika      │──► sinyal kontrol
 keadaan ──────►│ kombinasional     │
                └───────────────────┘
~~~

Kelebihan:

- **Sangat cepat**, karena hanya delay beberapa gerbang.
- Hemat area untuk set instruksi sederhana.

Kekurangan:

- **Sulit diubah**: menambah instruksi atau memperbaiki bug berarti merancang ulang rangkaian dan memproduksi chip baru.
- Untuk ISA kompleks (ratusan instruksi, mode alamat banyak), rangkaiannya sangat besar dan rawan salah.

Dipakai oleh CPU **RISC**: instruksi sedikit dan seragam, sehingga kendalinya kecil dan cepat.

## Cara 2: Microprogrammed (kendali terprogram)

Gagasan Maurice Wilkes (1951): **perlakukan kendali sebagai program kecil**. Setiap instruksi mesin dijalankan oleh **mikroprogram**: deretan **mikroinstruksi** yang disimpan dalam memori khusus bernama **control store** (biasanya ROM).

~~~
 Opcode (IR) ─► [pemetaan] ─► alamat awal mikroprogram
                                   │
                  ┌────────────────▼─────────────────┐
                  │  μPC (micro program counter)     │
                  └────────────────┬─────────────────┘
                                   ▼
                       ┌─────────────────────┐
                       │   CONTROL STORE      │   isi = mikroinstruksi
                       │   (ROM / flash)      │
                       └──────────┬──────────┘
                                  ▼
                  [ register mikroinstruksi ] ──► sinyal kontrol ke datapath
                                  │
                         alamat mikroinstruksi berikutnya
~~~

**Mikroinstruksi** terdiri dari field bit yang **langsung** berupa sinyal kontrol, ditambah informasi alamat mikroinstruksi berikutnya (atau cabang bersyarat).

### Contoh mikroprogram sederhana

Fase **fetch** untuk mesin akumulator, ditulis sebagai mikroinstruksi (satu per baris, tiap kolom = sebuah sinyal):

| μ-alamat | Sinyal aktif | Operasi (RTL) | Berikutnya |
| --- | --- | --- | --- |
| 0 | PC_out, MAR_in, MemRead | MAR ← PC | 1 |
| 1 | MemData_out, MBR_in, PC_inc | MBR ← M[MAR]; PC ← PC+1 | 2 |
| 2 | MBR_out, IR_in | IR ← MBR | pemetaan opcode |
| 3 (ADD) | IR_addr_out, MAR_in, MemRead | MAR ← IR[alamat] | 4 |
| 4 (ADD) | MemData_out, MBR_in | MBR ← M[MAR] | 5 |
| 5 (ADD) | MBR_out, ALU_add, AC_in | AC ← AC + MBR | 0 (kembali ke fetch) |

Setelah fetch, "pemetaan opcode" membawa μPC ke alamat awal mikroprogram instruksi bersangkutan (misalnya 3 untuk ADD). Di akhir mikroprogram, ia kembali ke 0 untuk instruksi berikutnya.

### Horizontal vs vertical

| Gaya | Isi mikroinstruksi | Ciri |
| --- | --- | --- |
| **Horizontal** | Satu bit untuk **setiap** sinyal kontrol (bisa ratusan bit) | Lebar, cepat, bisa mengaktifkan banyak sinyal sekaligus (paralelisme) |
| **Vertical** | Field **dikodekan**, perlu didecode | Sempit, hemat memori, lebih lambat |

## Perbandingan

| Aspek | **Hardwired** | **Microprogrammed** |
| --- | --- | --- |
| Kecepatan | Lebih cepat | Lebih lambat (akses control store tiap langkah) |
| Fleksibilitas | Rendah | Tinggi: ubah isi ROM |
| Kompleksitas desain | Sulit untuk ISA besar | Lebih sistematis, mirip menulis program |
| Perbaikan bug / instruksi baru | Rancang ulang chip | **Update microcode** |
| Cocok untuk | RISC (MIPS, ARM, RISC-V) | CISC (x86 klasik, mainframe) |

## Microcode di komputer modern

- Banyak instruksi sederhana x86 diterjemahkan langsung oleh decoder hardwired ke µops.
- **Instruksi yang rumit** (misalnya \`rep movsb\`, instruksi sistem) dijalankan lewat **microcode ROM**.
- CPU Intel dan AMD dapat menerima **pembaruan microcode** (dari BIOS atau sistem operasi) untuk memperbaiki bug atau menambal celah keamanan (misalnya Spectre) **tanpa mengganti chip**. Inilah manfaat nyata kendali terprogram.

## Rangkuman

- Unit kontrol membangkitkan **sinyal kontrol** (RegWrite, ALUSrc, MemRead, ...) dari opcode. Tabel opcode → sinyal adalah tabel kebenaran.
- **Hardwired**: rangkaian logika/FSM langsung; cepat tetapi sulit diubah (RISC).
- **Microprogrammed**: setiap instruksi dijalankan oleh mikroprogram di **control store**; fleksibel dan bisa diperbarui, tetapi lebih lambat (CISC).
- Mikroinstruksi **horizontal** = satu bit per sinyal (lebar, cepat); **vertical** = terkode (sempit).
- CPU modern memadukan keduanya: decoder hardwired untuk instruksi sederhana, microcode untuk yang kompleks.
`,
};
