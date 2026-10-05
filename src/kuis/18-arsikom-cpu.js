// Bab 5 Arsikom — Struktur CPU & Siklus Instruksi. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-komponen-cpu': {
    intisari: 'CPU terdiri dari unit kontrol (mengatur) dan datapath (ALU + register). Register seperti PC, IR, MAR, dan MBR menyimpan alamat dan data yang dipakai dalam siklus instruksi.',
    rangkuman: [
      'CPU = **unit kontrol** (FSM yang mengeluarkan sinyal kontrol) + **datapath** (ALU, register, jalur data).',
      'Register adalah memori tercepat (≪ 1 ns); operasi aritmetika dikerjakan pada register.',
      '**PC**: alamat instruksi berikutnya. **IR**: instruksi saat ini. **MAR**: alamat memori yang diakses. **MBR/MDR**: data dari/ke memori. **PSW**: flag dan status.',
      'Unit kontrol membaca opcode di IR lalu mengeluarkan sinyal kontrol seperti RegWrite, MemRead, dan kode operasi ALU.',
      '"CPU 64 bit" berarti register dan ALU 64 bit serta alamat 64 bit.',
    ],
    soal: [
      {
        tanya: 'Register mana yang menyimpan alamat instruksi berikutnya yang akan diambil?',
        benar: 'PC (Program Counter)',
        salah: ['IR (Instruction Register)', 'MBR (Memory Buffer Register)', 'SP (Stack Pointer)'],
        jelas: 'PC menunjuk instruksi berikutnya. IR menyimpan instruksi yang sedang dikerjakan, dan MBR menampung data yang baru dibaca dari memori.',
      },
      {
        tanya: 'Register yang terhubung ke bus alamat dan menyimpan alamat lokasi memori yang akan dibaca/ditulis adalah ...',
        benar: 'MAR',
        salah: ['MBR', 'IR', 'PSW'],
        jelas: 'MAR (Memory Address Register) menaruh alamat di bus alamat, sedangkan MBR/MDR membawa datanya melalui bus data.',
      },
      {
        tanya: 'Apa peran unit kontrol dalam CPU?',
        benar: 'Membaca instruksi dan mengirim sinyal kontrol yang mengatur ALU, register, dan memori',
        salah: ['Melakukan operasi penjumlahan dan logika', 'Menyimpan data yang sering dipakai agar cepat diakses', 'Menghubungkan CPU ke perangkat I/O luar'],
        jelas: 'Datapath (ALU dan register) mengerjakan, sedangkan unit kontrol memerintahkan langkah apa yang harus terjadi pada tiap saat.',
      },
      {
        tanya: 'Mengapa operasi aritmetika dikerjakan pada register, bukan langsung di memori utama?',
        benar: 'Register jauh lebih cepat (kurang dari satu siklus clock) daripada memori utama',
        salah: ['Memori utama tidak dapat menyimpan bilangan', 'ALU hanya dapat menyala bila memori mati', 'Register memiliki kapasitas lebih besar daripada RAM'],
        jelas: 'Akses register sekitar 0,3 ns, sementara DRAM puluhan hingga ratusan kali lebih lambat. Karena itu data dibawa ke register lebih dulu.',
      },
      {
        tanya: 'Apa keistimewaan register `$0` pada arsitektur MIPS?',
        benar: 'Nilainya selalu 0 dan tidak bisa diubah',
        salah: ['Menyimpan alamat instruksi berikutnya', 'Menyimpan flag hasil ALU', 'Menunjuk puncak stack'],
        jelas: 'Register konstanta nol menyediakan nilai 0 tanpa instruksi tambahan. PC, flag, dan SP adalah register yang berbeda.',
      },
    ],
  },

  'arsikom-siklus-instruksi': {
    intisari: 'CPU terus mengulang siklus fetch (ambil instruksi di alamat PC), decode (tafsirkan opcode), dan execute (kerjakan); PC dinaikkan pada saat fetch dan instruksi lompat menimpanya.',
    rangkuman: [
      '**Fetch**: MAR ← PC; MBR ← M[MAR] dan PC ← PC+1; IR ← MBR.',
      '**Decode**: unit kontrol membaca opcode di IR dan menentukan sinyal kontrol.',
      '**Execute** bergantung jenis: pemrosesan data, transfer data (LOAD/STORE), kontrol aliran (JMP/JZ), atau I/O.',
      'PC dinaikkan saat fetch; instruksi lompat menimpa PC. Instruksi seperti ADD butuh akses memori untuk instruksi dan untuk operandnya.',
      'Single-cycle CPI = 1 (clock lambat), multi-cycle 3–5, pipeline ≈ 1.',
    ],
    soal: [
      {
        tanya: 'Manakah urutan transfer register yang benar untuk fase fetch?',
        benar: 'MAR ← PC; MBR ← M[MAR] dan PC ← PC + 1; IR ← MBR',
        salah: ['IR ← PC; MAR ← IR; PC ← MBR', 'MBR ← PC; MAR ← M[MBR]; IR ← PC', 'PC ← IR; MAR ← MBR; M[MAR] ← IR'],
        jelas: 'Alamat dari PC dikirim lewat MAR, memori membalas ke MBR (PC ikut naik), lalu instruksi dipindahkan ke IR.',
      },
      {
        tanya: 'Berapa kali minimal akses memori yang dibutuhkan eksekusi satu instruksi `ADD 14` (operand di memori) pada mesin akumulator?',
        benar: '2 kali: satu untuk fetch instruksi dan satu untuk operand',
        salah: ['1 kali saja', '3 kali', '0 kali karena semuanya di register'],
        jelas: 'Fetch membaca instruksi dari memori, lalu execute membaca operand M[14]. Itulah alasan akses memori menjadi pembatas kinerja.',
      },
      {
        tanya: 'Apa yang terjadi pada PC ketika instruksi `JMP X` dieksekusi?',
        benar: 'PC diisi alamat X sehingga menimpa nilai yang sudah dinaikkan saat fetch',
        salah: ['PC dinaikkan satu lagi', 'PC diatur ke 0', 'PC tidak berubah'],
        jelas: 'Lompatan = PC ← alamat target. Selanjutnya fetch mengambil instruksi dari alamat baru itu.',
      },
      {
        tanya: 'Instruksi `STORE X` termasuk kategori instruksi ...',
        benar: 'Transfer data',
        salah: ['Pemrosesan data', 'Kontrol aliran', 'I/O'],
        jelas: 'STORE menulis isi register (AC) ke memori. Pemrosesan data melibatkan ALU dan kontrol aliran mengubah PC.',
      },
      {
        tanya: 'Apa kelemahan desain CPU single-cycle (setiap instruksi tepat satu siklus clock)?',
        benar: 'Periode clock harus selebar instruksi terlama sehingga clock menjadi lambat',
        salah: ['Instruksi tidak bisa mengakses memori', 'CPI-nya selalu lebih besar dari 5', 'Tidak dapat melakukan penjumlahan'],
        jelas: 'Semua instruksi dipaksa selesai dalam satu siklus, jadi siklus harus cukup panjang bagi instruksi paling lama (misalnya load).',
      },
    ],
  },

  'arsikom-bus-dasar': {
    intisari: 'Tiga bus menghubungkan CPU dengan memori dan I/O: bus alamat menentukan ruang alamat (2ⁿ), bus data menentukan lebar transfer, dan bus kontrol mengatur jenis operasi.',
    rangkuman: [
      '**Bus alamat** (satu arah, n jalur → 2ⁿ alamat), **bus data** (dua arah, byte per transfer), **bus kontrol** (Read/Write, clock, interrupt, ready).',
      'Bandwidth = lebar bus data × transfer per detik. DDR4-3200 64 bit = 25,6 GB/s per kanal.',
      'Siklus baca: alamat → MAR → bus alamat; sinyal Read; memori menaruh data; CPU menangkap di MBR. Memori lambat menyebabkan **wait state**.',
      'I/O dapat **memory-mapped** (alamat di ruang memori, `volatile` di C) atau **port-mapped** (`IN`/`OUT` x86).',
      'Bus bersama butuh arbitrasi; sistem modern memakai hierarki bus dan sambungan titik-ke-titik.',
    ],
    soal: [
      {
        tanya: 'Sebuah CPU memiliki bus alamat 20 jalur. Berapa kapasitas memori yang dapat dialamatinya (byte-addressable)?',
        benar: '1 MiB',
        salah: ['20 KiB', '64 KiB', '4 GiB'],
        jelas: '2²⁰ = 1.048.576 byte = 1 MiB (seperti pada Intel 8086).',
      },
      {
        tanya: 'Berapa bandwidth satu kanal memori dengan bus data 64 bit dan 3,2 miliar transfer per detik?',
        benar: '25,6 GB/s',
        salah: ['3,2 GB/s', '12,8 GB/s', '204,8 GB/s'],
        jelas: '64 bit = 8 byte; 8 × 3,2 × 10⁹ = 25,6 × 10⁹ byte/s.',
      },
      {
        tanya: 'Bus manakah yang bersifat satu arah, dari CPU menuju memori/I/O?',
        benar: 'Bus alamat',
        salah: ['Bus data', 'Bus kontrol seluruhnya', 'Semua bus bersifat satu arah'],
        jelas: 'CPU yang menentukan lokasi yang diakses sehingga alamat hanya mengalir keluar. Bus data dua arah karena data bisa dibaca atau ditulis.',
      },
      {
        tanya: 'Untuk apa kata kunci `volatile` dipakai pada pointer ke register perangkat memory-mapped di C?',
        benar: 'Agar kompiler tidak mengoptimasi dan setiap akses benar-benar dilakukan ke alamat itu',
        salah: ['Agar nilai register tidak pernah bisa berubah', 'Agar variabel disimpan di cache L1', 'Agar alamat dipindahkan otomatis ke RAM'],
        jelas: 'Nilai register perangkat bisa berubah di luar program, sehingga kompiler dilarang menyimpan salinannya atau menghapus akses yang tampak berulang.',
      },
      {
        tanya: 'Instruksi `IN` dan `OUT` pada x86 dipakai untuk ...',
        benar: 'Mengakses perangkat I/O melalui ruang alamat I/O terpisah (port-mapped I/O)',
        salah: ['Membaca dan menulis memori utama', 'Memanggil dan mengembalikan dari fungsi', 'Menaikkan dan menurunkan stack pointer'],
        jelas: 'Port-mapped I/O memiliki ruang alamat terpisah dari memori dan diakses dengan instruksi khusus, berbeda dengan memory-mapped I/O.',
      },
    ],
  },

  'arsikom-interupsi': {
    intisari: 'Interupsi membiarkan perangkat memberi tahu CPU saat siap sehingga CPU tidak membuang waktu polling; saat terjadi, CPU menyimpan PC dan PSW, menjalankan ISR dari tabel vektor, lalu IRET memulihkan keadaan.',
    rangkuman: [
      '**Polling** membuat CPU menunggu sia-sia (busy waiting); **interupsi** memberi tahu CPU saat perangkat siap.',
      'Interupsi berasal dari luar (hardware, timer); **exception** berasal dari instruksi (bagi nol, page fault); **system call** = software interrupt.',
      'Siklus interupsi: cek setelah tiap instruksi → simpan PC + PSW → ambil alamat ISR dari tabel vektor → jalankan ISR → `IRET`.',
      'Interupsi dapat di-mask, diprioritaskan, dan bersarang; **NMI** tidak bisa dimatikan.',
      'Interupsi menjadi dasar multitasking (timer), system call, page fault, dan I/O di OS.',
    ],
    soal: [
      {
        tanya: 'Apa kelemahan utama polling dibanding interupsi?',
        benar: 'CPU terbuang menunggu (busy waiting) padahal bisa mengerjakan hal lain',
        salah: ['Polling tidak dapat membaca data dari perangkat', 'Polling membutuhkan tabel vektor yang sangat besar', 'Polling selalu menyebabkan overflow pada stack'],
        jelas: 'Pada polling CPU berulang kali memeriksa status perangkat. Pada interupsi, perangkat sendiri yang memberi tahu saat siap.',
      },
      {
        tanya: 'Manakah yang termasuk exception (sinkron, berasal dari instruksi yang sedang berjalan)?',
        benar: 'Pembagian bilangan bulat dengan nol',
        salah: ['Tombol keyboard ditekan', 'Paket jaringan tiba', 'Timer berdetak'],
        jelas: 'Pembagian dengan nol dipicu oleh instruksi yang sedang dieksekusi. Ketiga lainnya adalah interupsi hardware yang asinkron.',
      },
      {
        tanya: 'Apa yang disimpan CPU (biasanya di stack) saat menerima interupsi?',
        benar: 'PC (alamat instruksi berikutnya) dan PSW/flag',
        salah: ['Seluruh isi memori utama', 'Hanya isi akumulator', 'Alamat ISR yang telah selesai'],
        jelas: 'PC dan PSW disimpan agar program yang disela dapat dilanjutkan persis di tempatnya setelah ISR selesai.',
      },
      {
        tanya: 'Apa fungsi instruksi `IRET`/`RTI` di akhir ISR?',
        benar: 'Memulihkan PC dan PSW dari stack sehingga program yang disela dilanjutkan',
        salah: ['Menghapus tabel vektor interupsi', 'Mematikan semua interupsi untuk selamanya', 'Mengulang ISR dari awal'],
        jelas: 'IRET mengembalikan keadaan yang disimpan saat interupsi dan melompat ke instruksi yang tertunda.',
      },
      {
        tanya: 'Interupsi jenis apa yang tidak bisa dinonaktifkan (di-mask) oleh program?',
        benar: 'NMI (non-maskable interrupt)',
        salah: ['Interupsi timer', 'Interupsi keyboard', 'Semua interupsi bisa dinonaktifkan'],
        jelas: 'NMI dirancang untuk kejadian kritis seperti kegagalan daya atau hardware sehingga tidak boleh diabaikan.',
      },
    ],
  },

  'arsikom-cpu-mini': {
    intisari: 'Siklus fetch-decode-execute dapat disimulasikan dalam beberapa baris kode: loop mengambil instruksi di mem[pc], menaikkan pc, memisahkan opcode dan alamat, lalu memilih tindakan.',
    rangkuman: [
      'Fetch = `ir = mem[pc]; pc += 1`; decode = `op = ir >> 4`, `alamat = ir & 0xF`; execute = memilih tindakan sesuai opcode.',
      'Kode mesin dibentuk dari opcode dan operand: `LOAD 12` → `0x1C`, `ADD 13` → `0x2D`.',
      'Program dan data berbagi satu memori; lompatan = menulis ke PC. `while` dibentuk dari `JZ` dan `JMP`.',
      'Jumlah instruksi dan CPI memungkinkan menghitung waktu eksekusi; lebar register menentukan kapan overflow terjadi.',
    ],
    soal: [
      {
        tanya: 'Pada CPU mini (format [opcode 4 bit | alamat 4 bit]), berapa kode mesin `LOAD 12` jika opcode LOAD = 0x1?',
        benar: '`0x1C`',
        salah: ['`0xC1`', '`0x12`', '`0x1A`'],
        jelas: 'Opcode 1 di 4 bit atas dan alamat 12 (heksa C) di 4 bit bawah: 0001 1100 = 0x1C.',
      },
      {
        tanya: 'Instruksi mesin `0x2D` pada CPU mini (ADD = 0x2) berarti ...',
        benar: 'ADD 13',
        salah: ['ADD 2', 'LOAD 13', 'STORE 13'],
        jelas: 'Nibble atas 2 = ADD dan nibble bawah D = 13. Operasi AC ← AC + M[13].',
      },
      {
        tanya: 'M[12] = 7 dan M[13] = 9. Setelah program `LOAD 12; ADD 13; STORE 14; HALT` selesai, berapa M[14]?',
        benar: '16',
        salah: ['7', '9', '2'],
        jelas: 'AC ← 7, AC ← 7 + 9 = 16, lalu M[14] ← 16.',
      },
      {
        tanya: 'Program perkalian berulang (8 instruksi per putaran, ditambah LOAD, JZ, HALT di akhir) dijalankan dengan penghitung awal 2. Berapa instruksi yang dieksekusi?',
        benar: '19',
        salah: ['16', '11', '35'],
        jelas: '2 putaran × 8 instruksi = 16, ditambah 3 instruksi terakhir (LOAD, JZ, HALT) = 19. Dengan penghitung 4 hasilnya 35.',
      },
      {
        tanya: 'Mengapa pada simulator ada operasi `& 0xFF` setelah `ADD`?',
        benar: 'Untuk membatasi AC pada 8 bit sehingga 200 + 100 menjadi 44 (overflow)',
        salah: ['Untuk mengubah hasil menjadi bilangan negatif', 'Untuk mempercepat penjumlahan', 'Untuk memeriksa apakah hasilnya genap'],
        jelas: 'Register 8 bit hanya menyimpan 0–255. Topeng 0xFF meniru wrap-around: 300 − 256 = 44.',
      },
    ],
  },
};
