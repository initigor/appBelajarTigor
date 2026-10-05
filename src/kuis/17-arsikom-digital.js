// Bab 4 Arsikom — Logika Digital. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-gerbang': {
    intisari: 'Semua rangkaian digital dibangun dari gerbang logika; NAND dan NOR bersifat universal, dan hukum De Morgan serta aljabar Boolean dipakai untuk menyederhanakan rangkaian.',
    rangkuman: [
      'Gerbang dasar: NOT, AND, OR, NAND, NOR, XOR (1 bila masukan berbeda), XNOR (1 bila sama).',
      '**NAND** dan **NOR** bersifat **universal**: semua fungsi logika dapat dibuat dari salah satunya.',
      'CMOS: NOT 2 transistor, NAND/NOR 4 transistor, AND/OR 6 transistor.',
      '**De Morgan**: (AB)\' = A\' + B\' dan (A+B)\' = A\'B\'. Hukum lain: komplemen, distributif, absorpsi.',
      'Tabel kebenaran → **SOP** (OR dari minterm baris keluaran 1). Contoh mayoritas: F = AB + AC + BC.',
    ],
    soal: [
      {
        tanya: 'Kapan keluaran gerbang XOR dua masukan bernilai 1?',
        benar: 'Ketika kedua masukannya berbeda',
        salah: ['Ketika kedua masukannya sama dengan 1', 'Ketika paling sedikit satu masukan bernilai 1', 'Ketika kedua masukannya sama'],
        jelas: 'XOR bernilai 1 jika masukan berbeda (01 atau 10). Kondisi "salah satu atau keduanya 1" adalah OR, dan "kedua sama" adalah XNOR.',
      },
      {
        tanya: 'Menurut hukum De Morgan, (A · B)\' sama dengan ...',
        benar: 'A\' + B\'',
        salah: ['A\' · B\'', 'A + B', '(A + B)\''],
        jelas: 'Pecahkan garis, ganti operator: komplemen dari AND adalah OR dari komplemen-komplemen. Ini juga berarti `!(a && b) == (!a || !b)`.',
      },
      {
        tanya: 'Sederhanakan F = AB + AB\'.',
        benar: 'A',
        salah: ['B', 'A + B', '1'],
        jelas: 'F = A(B + B\') = A · 1 = A.',
      },
      {
        tanya: 'Mengapa NAND disebut gerbang universal?',
        benar: 'Semua gerbang lain (NOT, AND, OR, dst.) dapat dibangun hanya dari NAND',
        salah: ['NAND dipakai di semua komputer di seluruh dunia', 'NAND tidak butuh transistor sama sekali', 'NAND selalu menghasilkan keluaran 1'],
        jelas: 'NOT A = NAND(A,A), AND = NAND lalu NOT, OR = NAND dari komplemen masukan. Satu jenis gerbang cukup untuk semua fungsi.',
      },
      {
        tanya: 'Berapa jumlah transistor CMOS yang umumnya dipakai gerbang NAND dua masukan?',
        benar: '4',
        salah: ['2', '6', '8'],
        jelas: 'NOT memakai 2 transistor, NAND dan NOR 4, sedangkan AND/OR memakai 6 karena berupa NAND/NOR ditambah inverter.',
      },
    ],
  },

  'arsikom-kmap': {
    intisari: 'Peta Karnaugh menyederhanakan fungsi Boolean dengan mengelompokkan angka 1 yang bertetangga (kode Gray); kelompok berukuran 2ᵏ menghapus k variabel.',
    rangkuman: [
      'Baris/kolom K-map memakai **kode Gray** (00, 01, 11, 10) agar tetangga hanya beda 1 bit. Tepi kiri-kanan dan atas-bawah bersambung.',
      'Kelompokkan 1 dalam persegi panjang berukuran **pangkat dua**, sebesar mungkin, sesedikit mungkin; tumpang tindih diperbolehkan.',
      'Kelompok 2ᵏ menghapus **k variabel**; tulis variabel yang tetap lalu OR-kan semua suku (SOP).',
      '**Don\'t care (X)** boleh dianggap 0 atau 1 sesuai keuntungan.',
      'K-map praktis sampai ±4–5 variabel; di atasnya dipakai Quine–McCluskey atau alat sintesis.',
    ],
    soal: [
      {
        tanya: 'Dalam urutan apa kolom K-map 4 variabel (CD) disusun?',
        benar: '00, 01, 11, 10',
        salah: ['00, 01, 10, 11', '00, 10, 01, 11', '11, 10, 01, 00'],
        jelas: 'Urutan kode Gray memastikan kolom bertetangga hanya berbeda satu bit sehingga pasangannya bisa digabung.',
      },
      {
        tanya: 'Satu kelompok berisi 4 kotak 1 pada K-map menghapus berapa variabel?',
        benar: '2 variabel',
        salah: ['1 variabel', '4 variabel', '3 variabel'],
        jelas: 'Kelompok berukuran 2ᵏ menghapus k variabel. 4 = 2², jadi dua variabel hilang.',
      },
      {
        tanya: 'Bentuk sederhana F = Σm(3, 5, 6, 7) (fungsi mayoritas 3 masukan) adalah ...',
        benar: 'AB + AC + BC',
        salah: ['ABC', 'A + B + C', 'AB + C'],
        jelas: 'm3+m7 = BC, m5+m7 = AC, m6+m7 = AB. Tiga kelompok berukuran 2 yang saling tumpang tindih di m7.',
      },
      {
        tanya: 'Pada K-map 4 variabel, empat sudut (m0, m2, m8, m10) membentuk satu kelompok. Apa suku hasilnya?',
        benar: 'B\'D\'',
        salah: ['A\'C\'', 'BD', 'A\'B\'C\'D\''],
        jelas: 'Pada keempat sudut, B selalu 0 dan D selalu 0, sedangkan A dan C berubah. Hasilnya B\'D\'.',
      },
      {
        tanya: 'Bagaimana kotak don\'t care (X) diperlakukan saat mengelompokkan?',
        benar: 'Boleh dianggap 1 jika membantu membentuk kelompok lebih besar, atau diabaikan',
        salah: ['Selalu dianggap 0', 'Selalu dianggap 1 dan wajib dikelompokkan', 'Menyebabkan fungsi tak bisa disederhanakan'],
        jelas: 'Kondisi X tidak pernah terjadi atau tidak penting, sehingga bebas dipilih sebagai 0 atau 1 demi hasil paling sederhana.',
      },
    ],
  },

  'arsikom-kombinasional': {
    intisari: 'Rangkaian kombinasional (adder, MUX, decoder) memiliki keluaran yang hanya bergantung pada masukan saat ini. Ripple-carry sederhana tetapi lambat, carry-lookahead menghitung carry secara paralel.',
    rangkuman: [
      '**Full adder**: S = A⊕B⊕Cin, Cout = AB + Cin(A⊕B). Dirantai menjadi **ripple-carry**, dengan delay ∝ n.',
      '**Carry-lookahead**: Generate G = A·B, Propagate P = A⊕B; semua carry dihitung paralel.',
      'Penjumlah/pengurang: XOR pada B dengan sinyal SUB dan Cin = SUB. Overflow bertanda V = C_n ⊕ C_(n−1).',
      '**MUX** memilih satu dari 2ⁿ masukan lewat n saluran seleksi. **Decoder** n-ke-2ⁿ mengaktifkan tepat satu keluaran (one-hot).',
      'Kombinasional tidak punya memori; sekuensial memiliki umpan balik dan keadaan.',
    ],
    soal: [
      {
        tanya: 'Sebuah full adder menerima A = 1, B = 1, Cin = 1. Berapa Sum dan Cout?',
        benar: 'Sum = 1, Cout = 1',
        salah: ['Sum = 0, Cout = 1', 'Sum = 1, Cout = 0', 'Sum = 0, Cout = 0'],
        jelas: '1 + 1 + 1 = 3 = 11₂, sehingga Sum = 1 (bit rendah) dan Cout = 1 (bit tinggi).',
      },
      {
        tanya: 'Mengapa penjumlah ripple-carry lambat untuk bilangan lebar?',
        benar: 'Carry harus merambat berurutan dari bit terendah ke tertinggi',
        salah: ['Tiap full adder membutuhkan clock tersendiri', 'Karena memakai gerbang XOR yang sangat lambat', 'Karena jumlah bit hasil selalu dua kali lipat'],
        jelas: 'Tiap tahap menunggu carry dari tahap sebelumnya, sehingga delay total sebanding dengan jumlah bit. Carry-lookahead menghitung carry paralel.',
      },
      {
        tanya: 'Berapa saluran seleksi yang dibutuhkan sebuah MUX 8-ke-1?',
        benar: '3',
        salah: ['8', '4', '2'],
        jelas: '2ⁿ masukan data membutuhkan n saluran seleksi; 8 = 2³ sehingga n = 3.',
      },
      {
        tanya: 'Berapa keluaran yang aktif (bernilai 1) pada satu waktu di decoder 3-ke-8 yang diaktifkan?',
        benar: 'Tepat satu',
        salah: ['Tiga', 'Semuanya', 'Delapan dikurangi tiga'],
        jelas: 'Decoder bersifat one-hot: tiap kombinasi masukan mengaktifkan tepat satu keluaran, sehingga cocok untuk decoding alamat.',
      },
      {
        tanya: 'Bagaimana satu rangkaian penjumlah dapat juga melakukan pengurangan?',
        benar: 'Masukan B di-XOR dengan sinyal SUB dan carry awal diisi SUB',
        salah: ['Masukan A dikalikan dengan −1 di setiap tahap', 'Carry awal diisi 0 dan hasil digeser kiri', 'Menambah satu full adder khusus di bit terendah saja'],
        jelas: 'Dengan SUB = 1, B menjadi ~B dan carry awal 1, sehingga hasilnya A + ~B + 1 = A − B.',
      },
    ],
  },

  'arsikom-flipflop': {
    intisari: 'Latch dan flip-flop menyimpan satu bit lewat umpan balik. D flip-flop menangkap masukan hanya pada tepi clock, dan critical path menentukan periode clock minimum.',
    rangkuman: [
      'Rangkaian sekuensial punya ingatan lewat **umpan balik**. **SR latch**: S=1 set, R=1 reset, 00 tahan, **11 terlarang**.',
      '**D latch** transparan saat Enable = 1 (sensitif level). **D flip-flop** menangkap D hanya pada **tepi clock** (Q⁺ = D).',
      '**T flip-flop**: Q⁺ = T⊕Q (toggle). **JK** tidak punya keadaan terlarang.',
      'Syarat waktu: **setup**, **hold**, dan **clock-to-Q**. Pelanggaran bisa menyebabkan **metastabilitas**.',
      'Periode clock minimum **T ≥ t_cq + t_logika(maks) + t_setup**.',
    ],
    soal: [
      {
        tanya: 'Kombinasi masukan mana yang dilarang pada SR latch (NOR)?',
        benar: 'S = 1 dan R = 1',
        salah: ['S = 0 dan R = 0', 'S = 1 dan R = 0', 'S = 0 dan R = 1'],
        jelas: 'S=R=0 berarti menahan, 10 set, 01 reset. Pada S=R=1 kedua keluaran 0 sehingga Q dan Q\' tidak lagi berlawanan.',
      },
      {
        tanya: 'Kapan sebuah D flip-flop sensitif tepi menyalin D ke Q?',
        benar: 'Hanya pada tepi naik (atau turun) clock',
        salah: ['Selama clock bernilai 1', 'Setiap kali D berubah', 'Selama clock bernilai 0'],
        jelas: 'Flip-flop "memotret" D hanya pada tepi clock. Selama level clock tinggi (transparan) adalah ciri latch.',
      },
      {
        tanya: 'Jalur logika terlama 2,6 ns, t_cq = 0,4 ns, t_setup = 0,4 ns. Berapa frekuensi clock maksimum kira-kira?',
        benar: '294 MHz',
        salah: ['385 MHz', '250 MHz', '2,9 GHz'],
        jelas: 'T ≥ 0,4 + 2,6 + 0,4 = 3,4 ns, sehingga f ≤ 1/3,4 ns ≈ 294 MHz.',
      },
      {
        tanya: 'Sebuah T flip-flop berada pada Q = 0 dan masukan T = 1 saat tepi clock. Berapa Q berikutnya?',
        benar: '1',
        salah: ['0', 'Tidak terdefinisi', 'Sama dengan Q\' sebelumnya dikalikan T'],
        jelas: 'Q⁺ = T ⊕ Q = 1 ⊕ 0 = 1. T = 1 membalik (toggle) keadaan.',
      },
      {
        tanya: 'Apa penyebab metastabilitas pada flip-flop?',
        benar: 'Masukan D berubah pada jendela setup/hold di sekitar tepi clock',
        salah: ['Frekuensi clock terlalu rendah', 'Terlalu banyak flip-flop memakai clock yang sama', 'Tegangan sumber terlalu tinggi'],
        jelas: 'Jika D berubah dekat tepi clock, flip-flop dapat berada di tegangan antara 0 dan 1 selama waktu yang tak menentu. Sinyal asinkron dilewatkan synchronizer.',
      },
    ],
  },

  'arsikom-register-counter': {
    intisari: 'Register adalah kumpulan D flip-flop berbagi clock, counter adalah register yang bertambah tiap clock, dan FSM (register keadaan + logika) adalah dasar unit kontrol CPU.',
    rangkuman: [
      '**Register** = n D flip-flop berbagi clock dengan sinyal Load. **Register file** = register + decoder (tulis) + MUX (baca), umumnya 2 port baca dan 1 port tulis.',
      '**Shift register** menggeser bit tiap clock (SIPO/PISO untuk komunikasi serial); geser = × atau ÷ 2.',
      '**Counter** biner: bit ke-i toggle bila semua bit di bawahnya 1. Counter sinkron lebih cepat daripada ripple. PC = counter dengan load.',
      '**FSM** = register keadaan + logika keadaan-berikutnya + logika keluaran. N keadaan butuh ⌈log₂ N⌉ flip-flop.',
      '**Moore**: keluaran dari keadaan saja; **Mealy**: keadaan dan masukan. Unit kontrol CPU adalah sebuah FSM.',
    ],
    soal: [
      {
        tanya: 'Mengapa register file CPU umumnya memiliki 2 port baca dan 1 port tulis?',
        benar: 'Agar instruksi seperti ADD R3, R1, R2 dapat membaca dua operand dan menulis satu hasil sekaligus',
        salah: ['Agar register dapat disimpan lebih lama', 'Karena setiap register hanya menyimpan satu bit', 'Agar clock bisa berjalan dua kali lebih cepat'],
        jelas: 'Instruksi tiga alamat membutuhkan dua sumber dibaca bersamaan dan satu tujuan ditulis.',
      },
      {
        tanya: 'Sebuah counter biner 3 bit berada pada 111. Berapa nilainya pada clock berikutnya?',
        benar: '000',
        salah: ['1000', '110', '111'],
        jelas: 'Counter 3 bit berputar balik: setelah nilai maksimum 7 (111) ia kembali ke 0 (000).',
      },
      {
        tanya: 'Berapa flip-flop minimum untuk menyimpan keadaan sebuah FSM dengan 5 keadaan?',
        benar: '3',
        salah: ['2', '4', '5'],
        jelas: '⌈log₂ 5⌉ = 3, karena 2 flip-flop hanya mewakili 4 keadaan.',
      },
      {
        tanya: 'Untuk apa shift register tipe SIPO (serial-in, parallel-out) dipakai?',
        benar: 'Mengubah bit serial yang datang satu per satu menjadi byte paralel',
        salah: ['Mengalikan bilangan dengan konstanta', 'Menghitung jumlah clock yang berlalu', 'Memilih satu dari banyak masukan data'],
        jelas: 'Penerima UART/SPI mengumpulkan bit yang tiba berurutan lalu membacanya sekaligus sebagai satu byte.',
      },
      {
        tanya: 'Pada counter biner sinkron, kapan flip-flop bit ke-2 (Q2) toggle?',
        benar: 'Ketika Q1 dan Q0 sama-sama bernilai 1',
        salah: ['Setiap tepi clock', 'Ketika Q0 bernilai 0', 'Ketika Q3 bernilai 1'],
        jelas: 'Bit ke-i toggle bila semua bit di bawahnya 1: T2 = Q1·Q0.',
      },
    ],
  },

  'arsikom-alu': {
    intisari: 'ALU dibuat dari irisan 1-bit yang menghitung AND, OR, dan penjumlahan serentak lalu dipilih MUX; Binvert plus CarryIn = 1 menjadikannya pengurang, dan flag Z, N, C, V dihasilkan dari hasil serta carry.',
    rangkuman: [
      'ALU menerima dua operand dan sinyal kontrol, lalu menghasilkan hasil dan flag **Z, N, C, V**.',
      'Irisan 1-bit menghitung AND, OR, dan penjumlahan serentak; **MUX** memilih hasil sesuai operasi.',
      '**Binvert = 1 dan CarryIn = 1** membuat penjumlah mengerjakan A − B.',
      '**SLT** memakai pengurangan dan bit tanda; **Z** = NOR semua bit hasil; **V** = CarryIn ⊕ CarryOut MSB.',
      '**Barrel shifter** memakai log₂ n lapisan MUX sehingga geser berapa pun selesai dalam satu siklus.',
    ],
    soal: [
      {
        tanya: 'Sinyal kontrol apa yang membuat ALU berbasis penjumlah mengerjakan A − B?',
        benar: 'Binvert = 1 dan CarryIn awal = 1',
        salah: ['Binvert = 0 dan CarryIn awal = 1', 'Binvert = 1 dan CarryIn awal = 0', 'Memilih keluaran AND pada MUX'],
        jelas: 'B dibalik (~B) lalu carry awal 1 ditambahkan: A + ~B + 1 = A − B.',
      },
      {
        tanya: 'Bagaimana flag Zero (Z) dihitung oleh hardware?',
        benar: 'NOR dari seluruh bit hasil',
        salah: ['AND dari seluruh bit hasil', 'Bit paling kiri dari hasil', 'CarryOut dari irisan MSB'],
        jelas: 'NOR bernilai 1 hanya jika semua masukannya 0, yaitu ketika hasil seluruhnya nol. Bit paling kiri adalah flag N.',
      },
      {
        tanya: 'Berapa lapisan MUX yang diperlukan barrel shifter 32 bit?',
        benar: '5',
        salah: ['32', '16', '31'],
        jelas: 'Setiap lapisan menggeser 0 atau 2ᵏ posisi; untuk 32 bit cukup log₂ 32 = 5 lapisan.',
      },
      {
        tanya: 'Pada ALU 4 bit dengan A = 0110 dan B = 0011, berapa hasil operasi AND?',
        benar: '0010',
        salah: ['0111', '1001', '0011'],
        jelas: 'AND per bit: 0110 · 0011 = 0010. (0111 adalah OR, 1001 adalah ADD.)',
      },
      {
        tanya: 'Bagaimana flag overflow V dihitung?',
        benar: 'CarryIn XOR CarryOut pada irisan MSB',
        salah: ['CarryOut dari irisan MSB saja', 'NOR dari semua bit hasil', 'Bit tanda hasil di-AND dengan CarryIn'],
        jelas: 'Overflow bertanda terjadi bila carry masuk dan carry keluar MSB berbeda. CarryOut saja menunjukkan flag C.',
      },
    ],
  },
};
