// Bab 6 Arsikom — Set Instruksi & Pengalamatan. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-format-instruksi': {
    intisari: 'Instruksi memuat opcode dan operand; makin sedikit alamat per instruksi, makin pendek instruksinya tetapi makin banyak instruksi yang dibutuhkan. Panjang instruksi tetap memudahkan decode dan pipeline.',
    rangkuman: [
      'Instruksi memuat **opcode**, operand sumber, operand tujuan, dan alamat instruksi berikutnya (implisit).',
      'Untuk X = (A+B)×(C−D): **3 alamat** → 3 instruksi, **2 alamat** → 6, **1 alamat/akumulator** → 7, **0 alamat/stack** → 8.',
      'Panjang **tetap** (RISC) memudahkan decode dan pipeline; panjang **variabel** (x86, 1–15 byte) lebih padat tetapi rumit.',
      '**Expanding opcode** menukar bit operand dengan opcode agar format pendek memuat banyak instruksi.',
      'Operand berupa register (ringkas), alamat memori (panjang), atau immediate (konstanta).',
    ],
    soal: [
      {
        tanya: 'Berapa instruksi yang dibutuhkan untuk X = (A + B) × (C − D) pada mesin 3 alamat (dengan dua variabel sementara)?',
        benar: '3',
        salah: ['6', '7', '8'],
        jelas: 'ADD T1,A,B; SUB T2,C,D; MUL X,T1,T2. Mesin 2 alamat butuh 6, akumulator 7, dan stack 8.',
      },
      {
        tanya: 'Gaya instruksi manakah yang memakai operand implisit dari puncak stack dan dipakai oleh bytecode Java?',
        benar: '0 alamat (mesin stack)',
        salah: ['3 alamat', '2 alamat', '1 alamat (akumulator)'],
        jelas: 'Mesin stack mengambil operand dari puncak stack sehingga hanya PUSH/POP yang menyebut alamat.',
      },
      {
        tanya: 'Apa keunggulan utama instruksi berpanjang tetap seperti pada MIPS dan ARM?',
        benar: 'Decode sederhana dan alamat instruksi berikutnya mudah diketahui sehingga cocok untuk pipeline',
        salah: ['Program selalu lebih pendek daripada x86', 'Dapat menampung instruksi dengan operand tak terbatas', 'Tidak perlu register sama sekali'],
        jelas: 'Dengan panjang seragam, fetch tahu persis posisi instruksi berikutnya (PC + 4), dan field-field decode berada di posisi tetap.',
      },
      {
        tanya: 'Instruksi 16 bit dengan field 4 bit memakai opcode 0000–1110 untuk 15 instruksi 3-alamat. Berapa instruksi 2-alamat maksimum dengan memperluas opcode 1111 (tanpa perluasan lanjutan)?',
        benar: '16',
        salah: ['15', '1', '256'],
        jelas: 'Awalan 1111 diikuti ekstensi 4 bit menghasilkan 16 opcode 8 bit, dan 8 bit sisanya cukup untuk dua alamat 4 bit.',
      },
      {
        tanya: 'Berapa bit minimum untuk menyebut satu dari 32 register dalam sebuah instruksi?',
        benar: '5 bit',
        salah: ['3 bit', '8 bit', '32 bit'],
        jelas: '2⁵ = 32, sehingga 5 bit cukup. Inilah sebabnya operand register membuat instruksi lebih ringkas daripada alamat memori 32 bit.',
      },
    ],
  },

  'arsikom-jenis-instruksi': {
    intisari: 'Instruksi dikelompokkan menjadi transfer data, aritmetika, logika/bit, kontrol aliran, I/O, dan sistem; tipe suatu nilai ditentukan oleh instruksi yang dipakai, bukan oleh bit-nya.',
    rangkuman: [
      'Enam golongan: **transfer data**, **aritmetika**, **logika/bit**, **kontrol aliran** (lompat, panggil, kembali), **I/O**, dan **sistem**.',
      'Pada RISC hanya `LOAD`/`STORE` yang mengakses memori.',
      '`if`/`while`/`for`/fungsi dikompilasi menjadi perbandingan + lompat bersyarat + `CALL`/`RET`.',
      'Mesin tidak mencatat tipe nilai: **instruksi yang dipakai** yang menentukan tafsirannya.',
      '**SIMD** memproses banyak elemen data dengan satu instruksi.',
    ],
    soal: [
      {
        tanya: 'Struktur `if`, `while`, dan `for` pada bahasa tingkat tinggi terutama diterjemahkan menjadi instruksi ...',
        benar: 'Perbandingan dan lompat bersyarat',
        salah: ['Transfer data ke I/O', 'SIMD', 'Instruksi privileged saja'],
        jelas: 'Percabangan dan perulangan bekerja dengan mengubah PC secara bersyarat sehingga memakai perbandingan dan branch/jump.',
      },
      {
        tanya: 'Instruksi `JZ alamat` (jump if zero) termasuk golongan ...',
        benar: 'Kontrol aliran',
        salah: ['Aritmetika', 'Transfer data', 'Input/Output'],
        jelas: 'JZ mengubah PC bila flag Z menyala, jadi ia mengatur aliran eksekusi program.',
      },
      {
        tanya: 'Apa yang dilakukan instruksi SIMD?',
        benar: 'Memproses beberapa elemen data sekaligus dengan satu instruksi',
        salah: ['Menjalankan satu instruksi pada beberapa CPU yang berbeda program', 'Menyalin satu instruksi ke seluruh memori', 'Menggantikan fungsi unit kontrol'],
        jelas: 'Satu register lebar (misal 128 bit) menyimpan beberapa elemen dan satu instruksi menjumlahkan seluruhnya sekaligus.',
      },
      {
        tanya: 'Mengapa casting atau pointer yang salah di C dapat membaca "sampah"?',
        benar: 'Mesin tidak mencatat tipe nilai; instruksi yang dipakai yang menentukan cara menafsirkan bit',
        salah: ['Memori otomatis mengubah isi saat dibaca dengan tipe lain', 'CPU menolak membaca bit dengan tipe berbeda', 'Setiap tipe data memakai memori fisik yang berbeda'],
        jelas: 'Bit yang sama dapat dibaca sebagai int, float, atau karakter. Tidak ada label tipe di perangkat keras.',
      },
      {
        tanya: 'Apa fungsi instruksi `NOP`?',
        benar: 'Tidak melakukan apa-apa selain memakai satu siklus (dan memajukan PC)',
        salah: ['Menghentikan CPU selamanya', 'Menghapus isi register', 'Memanggil layanan sistem operasi'],
        jelas: 'NOP dipakai untuk padding, penundaan, atau pengisi slot pipeline. HLT yang menghentikan CPU.',
      },
    ],
  },

  'arsikom-pengalamatan': {
    intisari: 'Mode pengalamatan menentukan cara bidang operand ditafsirkan menjadi alamat efektif (EA): immediate memakai nilainya langsung, direct dan indirect mengacu memori, register dan displacement memakai isi register.',
    rangkuman: [
      '**Immediate**: operand = A. **Direct**: M[A]. **Indirect**: M[M[A]]. **Register**: R. **Register indirect**: M[R]. **Displacement**: M[A + R]. **PC-relative**: M[PC + A].',
      'Jumlah akses memori: immediate/register 0; direct, register indirect, displacement 1; indirect 2.',
      'Displacement adalah dasar akses `a[i]`, `s.field`, dan lompatan PC-relative.',
      'Tulis dulu rumus **EA**, baru tentukan apakah operand adalah EA sendiri (immediate) atau isi memori di EA.',
      'RISC memakai sedikit mode (register, immediate, base+offset); CISC banyak mode.',
    ],
    soal: [
      {
        tanya: 'Keadaan: A = 100, M[100] = 300, M[300] = 500, R1 = 200, M[200] = 777. Berapa operand pada mode **indirect**?',
        benar: '500',
        salah: ['100', '300', '777'],
        jelas: 'EA = M[100] = 300, operand = M[300] = 500.',
      },
      {
        tanya: 'Dengan keadaan yang sama, berapa operand pada mode **register indirect** memakai R1?',
        benar: '777',
        salah: ['200', '300', '100'],
        jelas: 'EA = R1 = 200 lalu operand = M[200] = 777. Nilai 200 adalah isi register, yaitu mode register biasa.',
      },
      {
        tanya: 'Dengan keadaan yang sama, berapa alamat efektif pada mode displacement (A + R1)?',
        benar: '300',
        salah: ['100', '200', '500'],
        jelas: 'EA = A + R1 = 100 + 200 = 300. Operannya adalah M[300] = 500.',
      },
      {
        tanya: 'Berapa akses memori yang dibutuhkan untuk mengambil operand pada mode indirect?',
        benar: '2',
        salah: ['0', '1', '3'],
        jelas: 'Satu akses memperoleh alamat sebenarnya (M[A]), satu lagi mengambil operandnya.',
      },
      {
        tanya: 'Pernyataan C `s.field` pada struct paling tepat dipetakan ke mode pengalamatan ...',
        benar: 'Base + displacement',
        salah: ['Immediate', 'Indirect', 'PC-relative'],
        jelas: 'Register berisi alamat dasar struct, dan konstanta displacement adalah offset anggota di dalam struct.',
      },
    ],
  },

  'arsikom-cisc-risc': {
    intisari: 'CISC memiliki banyak instruksi kompleks berpanjang variabel, sedangkan RISC memakai instruksi sederhana berpanjang tetap dengan arsitektur load-store sehingga mudah di-pipeline. x86 modern menerjemahkan CISC menjadi µops RISC.',
    rangkuman: [
      '**CISC** (x86): banyak instruksi kompleks, panjang variabel, operand memori boleh langsung, program padat.',
      '**RISC** (ARM, MIPS, RISC-V): instruksi sederhana, panjang tetap, **load-store**, banyak register, sedikit mode alamat.',
      'RISC lahir dari pengamatan bahwa kompilator jarang memakai instruksi kompleks.',
      'RISC mudah di-pipeline: panjang sama, format seragam, memori hanya lewat LOAD/STORE.',
      'x86 modern menerjemahkan instruksi CISC menjadi **µops** RISC di dalam chip. Waktu CPU = IC × CPI × T.',
    ],
    soal: [
      {
        tanya: 'Apa arti arsitektur **load-store**?',
        benar: 'Hanya instruksi LOAD dan STORE yang boleh mengakses memori; operasi lain bekerja pada register',
        salah: ['Semua instruksi aritmetika boleh langsung memakai operand memori', 'Setiap instruksi harus menyimpan hasilnya ke disk', 'CPU hanya punya dua instruksi, LOAD dan STORE'],
        jelas: 'Dalam RISC, ADD dan sejenisnya hanya antar-register. Data memori dibawa dulu ke register lewat LOAD dan dikembalikan dengan STORE.',
      },
      {
        tanya: 'Mengapa prosesor x86 modern tetap cepat walaupun ISA-nya CISC?',
        benar: 'Decoder menerjemahkan instruksi x86 menjadi mikro-operasi sederhana ala RISC yang dijalankan di pipeline',
        salah: ['Semua instruksi x86 sebenarnya sudah berpanjang tetap', 'x86 tidak memakai pipeline sama sekali', 'Program x86 selalu dikompilasi ulang ke ARM saat dijalankan'],
        jelas: 'Dari luar tetap CISC demi kompatibilitas, tetapi inti eksekusinya memakai µops sederhana yang mudah di-pipeline dan di-superscalar.',
      },
      {
        tanya: 'Faktor mana yang membuat RISC mudah di-pipeline?',
        benar: 'Instruksi berpanjang sama, berformat seragam, dan akses memori hanya lewat LOAD/STORE',
        salah: ['Jumlah instruksinya selalu lebih sedikit dari 10', 'Setiap instruksi harus memakai alamat memori absolut', 'Menggunakan microcode untuk setiap instruksi'],
        jelas: 'Keseragaman membuat tiap tahap pipeline mudah dibuat dan diseimbangkan.',
      },
      {
        tanya: 'Manakah ciri yang paling khas dari CISC?',
        benar: 'Instruksi berpanjang variabel dengan banyak mode pengalamatan',
        salah: ['Jumlah register umum yang sangat banyak (32 atau lebih)', 'Semua instruksi tepat 4 byte', 'Akses memori hanya lewat LOAD/STORE'],
        jelas: 'x86 memiliki instruksi 1–15 byte dan banyak mode alamat. Ketiga ciri lainnya adalah ciri RISC.',
      },
      {
        tanya: 'Apa keistimewaan utama RISC-V dibanding ARM dari sisi lisensi?',
        benar: 'ISA terbuka tanpa biaya lisensi',
        salah: ['ISA tertutup yang hanya boleh dipakai satu perusahaan', 'Hanya dapat dipakai di komputer super', 'Merupakan versi 64 bit dari x86'],
        jelas: 'RISC-V adalah ISA RISC terbuka sehingga siapa pun boleh membuat prosesor tanpa membayar lisensi ISA.',
      },
    ],
  },

  'arsikom-assembly': {
    intisari: 'Assembly MIPS menerjemahkan C menjadi instruksi 3-operand antar-register dengan lw/sw untuk memori; pola if memakai bne/beq yang membalik kondisi, dan setiap instruksi dikodekan dalam format R, I, atau J 32 bit.',
    rangkuman: [
      'MIPS: 32 register 32 bit (`$zero`, `$t*`, `$s*`, `$a*`, `$v*`, `$sp`, `$ra`), instruksi 3-operand, memori hanya lewat `lw`/`sw`.',
      'Array: geser kiri 2 (× 4) + alamat dasar + `lw`/`sw`. If: `beq`/`bne` yang membalik kondisi. Loop: label + lompat bersyarat + `j`.',
      'Tiga format 32 bit: **R**, **I**, **J**. `add $t0,$s1,$s2` = `0x02324020`.',
      'Immediate 16 bit di-sign-extend; konstanta lebih besar butuh `lui` + `ori`.',
    ],
    soal: [
      {
        tanya: 'Apa fungsi instruksi `sll $t1, $s0, 2` ketika menghitung alamat elemen array `int`?',
        benar: 'Mengalikan indeks dengan 4 (ukuran int dalam byte)',
        salah: ['Membagi indeks dengan 4', 'Menambahkan 2 ke alamat dasar', 'Membandingkan indeks dengan 2'],
        jelas: 'Geser kiri 2 posisi = × 4. Alamat elemen = alamat dasar + 4 × indeks.',
      },
      {
        tanya: 'Berapa kode mesin heksa `add $t0, $s1, $s2` (opcode 0, funct 0x20; $s1=17, $s2=18, $t0=8)?',
        benar: '`0x02324020`',
        salah: ['`0x02324022`', '`0x00124020`', '`0x20324020`'],
        jelas: '000000 10001 10010 01000 00000 100000 = 0000 0010 0011 0010 0100 0000 0010 0000 = 0x02324020.',
      },
      {
        tanya: 'Untuk `if (i == j) f = g + h; else f = g - h;`, instruksi percabangan pertama yang dibuat kompilator adalah ...',
        benar: '`bne` ke label Else (kondisi dibalik)',
        salah: ['`beq` ke label Exit', '`j` ke label Else tanpa syarat', '`slt` lalu `jr`'],
        jelas: 'Kompilator membalik kondisi: jika i ≠ j lompat ke Else. Kalau tidak, jatuh ke blok-then lalu `j Exit`.',
      },
      {
        tanya: 'Sebuah array `int A[]` memiliki alamat dasar di $s3. Berapa offset byte untuk `A[12]`?',
        benar: '48',
        salah: ['12', '24', '96'],
        jelas: 'Setiap int 4 byte: 12 × 4 = 48, sehingga `lw $t0, 48($s3)`.',
      },
      {
        tanya: 'Format instruksi MIPS mana yang dipakai oleh `lw $t0, 4($s1)`?',
        benar: 'I-type',
        salah: ['R-type', 'J-type', 'Format khusus 64 bit'],
        jelas: 'I-type memuat opcode, rs, rt, dan immediate 16 bit (offset 4). R-type dipakai instruksi register seperti `add`.',
      },
    ],
  },

  'arsikom-stack-prosedur': {
    intisari: 'Stack (LIFO, ditunjuk SP) menyimpan alamat kembali, register tersimpan, dan variabel lokal setiap pemanggilan fungsi; ia memungkinkan rekursi, tetapi juga membuka celah buffer overflow.',
    rangkuman: [
      '**Stack** = area LIFO yang ditunjuk **SP**; biasanya tumbuh ke alamat rendah. `PUSH` mengurangi SP lalu menulis; `POP` membaca lalu menaikkan SP.',
      'Alamat kembali: x86 `call`/`ret` memakai stack; MIPS `jal` menyimpan di `$ra` dan `jr $ra` kembali.',
      'Tiap pemanggilan punya **stack frame**: alamat kembali, register tersimpan, variabel lokal; dibebaskan dengan menaikkan SP.',
      'Konvensi: argumen di register, hasil di `$v0`/`rax`; caller-saved vs callee-saved.',
      'Rekursi tak berbatas menyebabkan **stack overflow**; array lokal yang meluap menimpa alamat kembali (**buffer overflow**).',
    ],
    soal: [
      {
        tanya: 'Pada x86, apa yang terjadi pada SP saat instruksi `push` dijalankan?',
        benar: 'SP dikurangi (stack tumbuh ke alamat rendah), lalu nilai ditulis di SP',
        salah: ['SP dinaikkan, lalu nilai ditulis', 'SP tidak berubah', 'SP dikosongkan menjadi nol'],
        jelas: 'Stack tumbuh ke bawah: push mengurangi SP dulu (8 byte di x86-64) lalu menyimpan data di alamat baru itu.',
      },
      {
        tanya: 'Di mana MIPS menyimpan alamat kembali saat instruksi `jal` dijalankan?',
        benar: 'Di register `$ra`',
        salah: ['Di puncak stack secara otomatis', 'Di register `$zero`', 'Di register `$sp`'],
        jelas: '`jal` menyimpan PC+4 di `$ra`, dan `jr $ra` memakainya untuk kembali. Fungsi bukan-daun harus menyimpan `$ra` ke stack.',
      },
      {
        tanya: 'Mengapa fungsi yang memanggil fungsi lain di MIPS harus menyimpan `$ra` di stack?',
        benar: 'Pemanggilan fungsi berikutnya akan menimpa `$ra`, sehingga alamat kembali asli hilang',
        salah: ['Karena `$ra` hanya dapat dibaca setelah disalin ke stack', 'Karena stack lebih cepat daripada register', 'Karena `$ra` selalu bernilai 0'],
        jelas: 'Hanya ada satu `$ra`. Tanpa disimpan, `jal` kedua menimpanya dan fungsi pertama tak tahu ke mana harus kembali.',
      },
      {
        tanya: 'Bagaimana buffer overflow di stack dapat menimbulkan pembajakan eksekusi?',
        benar: 'Data yang melewati batas array lokal menimpa alamat kembali sehingga `ret` melompat ke kode penyerang',
        salah: ['Overflow menghapus seluruh program dari memori', 'Overflow memaksa CPU melakukan reset', 'Overflow hanya mengubah isi register flag'],
        jelas: 'Alamat kembali berada di atas variabel lokal. Menimpanya mengontrol ke mana `ret` melompat.',
      },
      {
        tanya: 'Apa penyebab umum StackOverflowError (Java) atau segmentation fault akibat stack di C?',
        benar: 'Rekursi tanpa kondisi berhenti atau terlalu dalam sehingga stack frame menghabiskan ruang stack',
        salah: ['Terlalu banyak memakai variabel global', 'Menggunakan bilangan floating point', 'Menggunakan operator pembagian'],
        jelas: 'Setiap pemanggilan menambah satu frame. Ukuran stack terbatas (sekitar 1–8 MiB) sehingga kedalaman tak terbatas akan menghabiskannya.',
      },
    ],
  },
};
