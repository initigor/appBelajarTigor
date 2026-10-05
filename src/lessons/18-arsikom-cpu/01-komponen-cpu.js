export default {
  id: 'arsikom-komponen-cpu',
  judul: 'Komponen CPU dan Register',
  tipe: 'teks',
  xp: 20,
  materi: `
# Komponen CPU dan Register 🧠

**CPU** (*Central Processing Unit*, prosesor) adalah otak komputer: ia mengambil instruksi dari memori, memahaminya, lalu mengerjakannya. Di bab sebelumnya kamu sudah membangun bagian-bagiannya dari gerbang: ALU, register, MUX, dan FSM. Sekarang kita menyatukannya menjadi satu CPU.

## Tiga bagian utama

~~~
+----------------------------- CPU ------------------------------+
|                                                                 |
|   +----------------+       +------------------------------+     |
|   |  UNIT KONTROL  |       |       DATAPATH               |     |
|   |   (CU)         |──────►|  +------+     +-----------+  |     |
|   |   FSM yang     | sinyal|  | ALU  |◄───►| Register  |  |     |
|   |   mengatur     | kontrol  +------+     | file, PC, |  |     |
|   |   semuanya     |       |               | IR, ...   |  |     |
|   +-------▲--------+       +---------------+-----------+--+     |
|           │ opcode, flag                       │                |
+-----------┼────────────────────────────────────┼────────────────+
            │          bus (alamat, data, kontrol)│
        ┌───┴──────────────────────────────────┴───┐
        │            MEMORI  &  I/O                 │
        └───────────────────────────────────────────┘
~~~

| Bagian | Peran |
| --- | --- |
| **ALU** | Melakukan operasi aritmetika dan logika |
| **Register** | Penyimpan super cepat di dalam CPU |
| **Unit kontrol (CU)** | Membaca instruksi, lalu mengirim sinyal kontrol ke ALU, register, memori, dan bus tentang apa yang harus dilakukan pada tiap langkah |
| **Interkoneksi internal** | Jalur yang menghubungkan ALU dan register (disebut *datapath*) |

ALU, register, dan jalur datanya disebut **datapath** (jalur data); **unit kontrol** adalah "sutradaranya". Datapath mengerjakan, unit kontrol menyuruh.

## Register: memori tercepat

Register adalah kumpulan flip-flop di dalam chip CPU. Mengaksesnya jauh lebih cepat daripada memori utama:

| Tingkat | Waktu akses khas |
| --- | --- |
| Register | ±0,3 ns (kurang dari satu siklus clock) |
| Cache L1 | ±1 ns |
| RAM (DRAM) | ±60–100 ns |
| SSD | ±100.000 ns |

Karena itu operasi aritmetika dikerjakan **pada register**, dan data dari memori harus dibawa ke register lebih dulu. Jumlah register sangat sedikit (puluhan), tetapi pemakaiannya sangat menentukan kinerja.

### 1. Register yang terlihat programmer (user-visible)

Bagian dari arsitektur: dapat dipakai langsung oleh instruksi.

- **Register umum** (*general purpose*, GPR): menyimpan data atau alamat. x86-64: 16 register 64 bit (\`RAX\`, \`RBX\`, \`RCX\`, \`RDX\`, \`RSI\`, \`RDI\`, \`RBP\`, \`RSP\`, \`R8\`–\`R15\`). ARM64: 31 register (\`X0\`–\`X30\`). MIPS/RISC-V: 32 register.
- **Register data** dan **register alamat**: pada arsitektur lama dipisah; sekarang umumnya digabung.
- **Register kondisi / flag** (*status register*): menyimpan flag Z, N, C, V hasil ALU (\`RFLAGS\` di x86).
- **Register khusus pemrogram**: \`SP\` (*stack pointer*) menunjuk puncak stack; \`FP\`/\`BP\` untuk *frame* fungsi.

Pada MIPS, register \`$0\` selalu bernilai **0** dan tidak bisa diubah: trik hardware untuk menyediakan konstanta 0 tanpa instruksi tambahan.

### 2. Register kontrol dan status (internal)

Dipakai CPU untuk menjalankan siklus instruksi:

| Register | Kepanjangan | Isi dan fungsi |
| --- | --- | --- |
| **PC** | Program Counter (di x86: \`RIP\`) | **Alamat instruksi berikutnya** yang akan diambil. Otomatis bertambah tiap instruksi, atau diisi alamat baru oleh lompatan |
| **IR** | Instruction Register | **Instruksi yang sedang dieksekusi** (hasil fetch) |
| **MAR** | Memory Address Register | **Alamat** lokasi memori yang akan dibaca/ditulis. Terhubung ke bus alamat |
| **MBR / MDR** | Memory Buffer / Data Register | **Data** yang baru dibaca dari, atau akan ditulis ke, memori. Terhubung ke bus data |
| **PSW** | Program Status Word | Flag status, mode (user/kernel), dan bit pengaktif interupsi |

Alur data umum: **PC → MAR → (bus alamat) → memori → (bus data) → MBR → IR**. Itu adalah fase *fetch* yang dibahas di pelajaran berikutnya.

## Datapath dan sinyal kontrol

Pada datapath, setiap register dan ALU dihubungkan lewat bus dan MUX. Unit kontrol mengendalikan:

- Register mana yang diaktifkan untuk **ditulis** (sinyal Load).
- Register mana yang dibaca ke ALU (pilihan MUX).
- Operasi ALU apa yang dilakukan (kode kontrol ALU).
- Kapan memori dibaca atau ditulis (sinyal \`MemRead\`, \`MemWrite\`).

### Contoh sederhana: instruksi \`ADD R3, R1, R2\`

1. CU memerintahkan register file membaca **R1** dan **R2** (dua port baca).
2. CU memilih operasi **ADD** untuk ALU.
3. Hasil dari ALU ditulis ke **R3** (port tulis, sinyal \`RegWrite\` aktif).
4. PC bertambah ke instruksi berikutnya.

Seluruhnya diatur oleh sinyal kontrol yang dihasilkan dari opcode di IR.

## Lebar CPU: "CPU 64 bit" itu apa?

Biasanya berarti **register umum dan ALU berlebar 64 bit**, serta alamat memori 64 bit (secara praktis 48 bit terpakai pada x86-64, sekitar 256 TiB). Implikasi: bilangan bulat 64 bit dikerjakan dalam satu instruksi, sedangkan CPU 8 bit harus memakai beberapa instruksi untuk bilangan 32 bit.

## Bagaimana CPU berhubungan dengan kode C

~~~c
int total = a + b;     // di dalam fungsi
~~~

Variabel lokal \`a\`, \`b\`, \`total\` sering **hidup di register** (kalau cukup register). Hanya bila register habis atau alamatnya diambil (\`&a\`), nilainya disimpan di memori (stack). Itu alasan loop kecil yang memakai sedikit variabel sangat cepat: semuanya di register.

## Rangkuman

- CPU = **unit kontrol** (mengatur, FSM) + **datapath** (ALU + register + jalur data), terhubung ke memori dan I/O lewat bus.
- Register adalah memori tercepat (≪ 1 ns); operasi aritmetika dikerjakan pada register.
- Register terlihat programmer: GPR, flag, SP. Register internal: **PC** (alamat instruksi berikutnya), **IR** (instruksi saat ini), **MAR** (alamat memori), **MBR/MDR** (data memori), **PSW**.
- Unit kontrol membaca opcode di IR lalu mengeluarkan sinyal kontrol (RegWrite, MemRead, kontrol ALU) untuk mengatur datapath.
- "CPU 64 bit" berarti register dan ALU 64 bit serta alamat 64 bit.
`,
};
