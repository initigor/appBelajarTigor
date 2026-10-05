// Bab 8 Arsikom — Memori & Cache. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-hierarki-memori': {
    intisari: 'Hierarki memori (register, cache, DRAM, SSD/HDD) memberi kecepatan mendekati level teratas dan kapasitas mendekati level terbawah karena program memiliki lokalitas temporal dan spasial.',
    rangkuman: [
      'Teknologi memori saling bertukar antara kecepatan, kapasitas, dan harga, sehingga disusun sebagai **hierarki**.',
      '**Lokalitas temporal**: data yang baru dipakai akan dipakai lagi. **Lokalitas spasial**: data di dekatnya akan dipakai juga, sehingga data dipindah dalam **blok** (±64 byte).',
      'Istilah: hit, miss, hit rate, miss rate, hit time, miss penalty.',
      '**Memory wall**: CPU jauh lebih cepat daripada DRAM, sehingga cache penting.',
      'Pola akses memengaruhi kecepatan secara dramatis: array 2D di C disimpan row-major, jadi akses baris demi baris jauh lebih cepat.',
    ],
    soal: [
      {
        tanya: 'Mengapa mengakses `a[i]` dalam loop berurutan memanfaatkan lokalitas spasial?',
        benar: 'Elemen berdekatan berada dalam blok cache yang sama sehingga satu miss membawa banyak data berguna',
        salah: ['Karena variabel i selalu disimpan di register sehingga tidak butuh cache', 'Karena array selalu disimpan di register CPU', 'Karena elemen array tidak pernah diakses dua kali'],
        jelas: 'Satu blok 64 byte memuat banyak elemen berurutan. Akses berikutnya sudah ada di cache. (Variabel i adalah lokalitas temporal.)',
      },
      {
        tanya: 'Cache memiliki hit rate 95%. Berapa proporsi akses yang harus membayar miss penalty?',
        benar: '5% (1 dari 20 akses)',
        salah: ['95%', '0,5%', '50%'],
        jelas: 'Miss rate = 1 − hit rate = 5%.',
      },
      {
        tanya: 'Array 2D `int a[N][N]` di C. Urutan loop mana yang lebih ramah cache?',
        benar: 'Loop luar i (baris), loop dalam j (kolom): `a[i][j]`',
        salah: ['Loop luar j, loop dalam i: `a[i][j]`', 'Keduanya sama karena jumlah operasinya sama', 'Tergantung kompiler, selalu acak'],
        jelas: 'C menyimpan baris berurutan (row-major). Loop dalam pada j membaca alamat berdekatan, sedangkan loop dalam pada i melompat satu baris tiap akses.',
      },
      {
        tanya: 'Apa yang dimaksud memory wall?',
        benar: 'Kecepatan CPU tumbuh jauh lebih cepat daripada kecepatan DRAM sehingga memori menjadi pembatas',
        salah: ['Batas ukuran maksimum RAM yang dapat dipasang', 'Dinding fisik antara CPU dan RAM di papan sirkuit yang membatasi jarak maksimum antar komponen di dalam komputer', 'Batas jumlah inti dalam satu CPU'],
        jelas: 'Selisih kecepatan CPU dan memori melebar bertahun-tahun, sehingga CPU sering menunggu data.',
      },
      {
        tanya: 'Manakah contoh lokalitas temporal?',
        benar: 'Variabel `jumlah` diakses berulang kali di setiap iterasi loop',
        salah: ['Membaca elemen array secara berurutan', 'Mengeksekusi instruksi program secara berurutan', 'Mengakses anggota struct yang berdekatan'],
        jelas: 'Lokalitas temporal = lokasi yang sama diakses lagi dalam waktu dekat. Tiga lainnya adalah lokalitas spasial.',
      },
    ],
  },

  'arsikom-sram-dram': {
    intisari: 'SRAM (flip-flop 6T) cepat dan mahal untuk cache; DRAM (1 transistor + kapasitor) padat dan murah tetapi harus di-refresh, dipakai sebagai memori utama; flash adalah memori nonvolatil yang dihapus per blok.',
    rangkuman: [
      '**SRAM**: flip-flop 6T, cepat, mahal, tanpa refresh → cache dan register.',
      '**DRAM**: 1T1C, padat dan murah, **wajib di-refresh** (±64 ms), dialamati lewat baris + kolom (RAS/CAS) → memori utama. DDR mentransfer dua kali per siklus clock.',
      'Nonvolatil: ROM → PROM → EPROM → EEPROM → **Flash**; NAND flash (SSD) dihapus per blok dan punya daya tahan terbatas (wear leveling).',
      'Memori dari chip kecil: lebar lewat chip paralel, kedalaman lewat decoder bank.',
      '**Interleaving** menyebar alamat berurutan ke banyak bank untuk menaikkan bandwidth.',
    ],
    soal: [
      {
        tanya: 'Mengapa DRAM harus di-refresh secara berkala?',
        benar: 'Muatan pada kapasitor sel bocor sehingga data hilang bila tidak ditulis ulang',
        salah: ['Karena DRAM memakai flip-flop yang berosilasi', 'Agar DRAM lebih cepat dari SRAM', 'Karena transistor DRAM terlalu panas'],
        jelas: 'Sel DRAM menyimpan bit sebagai muatan kapasitor yang bocor dalam puluhan milidetik, sehingga tiap baris di-refresh sekitar tiap 64 ms.',
      },
      {
        tanya: 'Memori mana yang biasa dipakai untuk cache CPU, dan berapa transistor per sel-nya?',
        benar: 'SRAM, umumnya 6 transistor per bit',
        salah: ['DRAM, 1 transistor per bit', 'Flash NAND, 2 transistor per bit', 'ROM, 8 transistor per bit'],
        jelas: 'Cache memerlukan kecepatan tinggi tanpa refresh sehingga memakai SRAM (flip-flop 6T). DRAM dipakai untuk memori utama.',
      },
      {
        tanya: 'Berapa chip 16K × 4 bit yang dibutuhkan untuk membangun memori 64 KiB (65.536 × 8 bit)?',
        benar: '8 chip',
        salah: ['4 chip', '2 chip', '16 chip'],
        jelas: 'Lebar: 8 / 4 = 2 chip berdampingan. Kedalaman: 65.536 / 16.384 = 4 bank. Total 2 × 4 = 8 chip.',
      },
      {
        tanya: 'Bagaimana sel NAND flash harus diperlakukan sebelum ditulis ulang?',
        benar: 'Harus dihapus per blok terlebih dahulu, lalu ditulis per halaman',
        salah: ['Dapat langsung ditimpa per byte', 'Harus di-refresh setiap 64 ms', 'Tidak dapat ditulis ulang sama sekali'],
        jelas: 'Flash tidak bisa menimpa sel secara langsung: penghapusan dilakukan per blok besar, dan siklus hapus terbatas, sehingga SSD memakai wear leveling.',
      },
      {
        tanya: 'Memori DDR4-3200 bekerja pada clock sebenarnya sekitar ...',
        benar: '1600 MHz',
        salah: ['3200 MHz', '800 MHz', '6400 MHz'],
        jelas: 'DDR mentransfer data pada tepi naik dan turun clock sehingga 3200 juta transfer per detik membutuhkan clock 1600 MHz.',
      },
    ],
  },

  'arsikom-cache-mapping': {
    intisari: 'Pemetaan cache menentukan di mana sebuah blok memori boleh disimpan: direct-mapped (satu tempat), fully associative (di mana saja), atau set-associative (satu set, N tempat). Alamat dibagi menjadi tag, index, dan offset.',
    rangkuman: [
      'Setiap baris cache memuat **valid, dirty, tag, data**. Alamat dibagi **tag | index | offset**.',
      'Offset = log₂(ukuran blok); index = log₂(jumlah set); tag = sisa bit.',
      '**Direct-mapped** (cepat, banyak conflict), **fully associative** (fleksibel, mahal), **set-associative N-way** (kompromi yang dipakai).',
      'Jumlah set = C / (B × N). Contoh: 32 KiB, 64 B, 4-way, 32 bit → offset 6, index 7, tag 19.',
      'Urutan blok 0, 8, 0, 6, 8 pada cache 4 blok: direct-mapped 5 miss, 2-way 4 miss, fully associative 3 miss.',
    ],
    soal: [
      {
        tanya: 'Alamat 32 bit, cache 32 KiB, blok 64 byte, 4-way set-associative. Berapa bit tag?',
        benar: '19 bit',
        salah: ['17 bit', '20 bit', '26 bit'],
        jelas: 'Set = 32768 / (64 × 4) = 128 → index 7 bit. Offset 6 bit. Tag = 32 − 7 − 6 = 19.',
      },
      {
        tanya: 'Dengan cache dan blok yang sama tetapi direct-mapped, berapa bit index?',
        benar: '9 bit',
        salah: ['6 bit', '7 bit', '13 bit'],
        jelas: 'Jumlah baris = 32768 / 64 = 512 → index = log₂ 512 = 9 bit.',
      },
      {
        tanya: 'Urutan akses blok 0, 8, 0, 6, 8 pada cache direct-mapped 4 baris (baris = blok mod 4) menghasilkan berapa miss?',
        benar: '5 miss',
        salah: ['3 miss', '4 miss', '2 miss'],
        jelas: 'Blok 0 dan 8 sama-sama ke baris 0 sehingga saling menimpa; 6 ke baris 2 sebagai miss pertama. Semua 5 akses miss.',
      },
      {
        tanya: 'Berapa bit tag pada cache fully associative dengan alamat 32 bit dan blok 64 byte?',
        benar: '26 bit',
        salah: ['32 bit', '6 bit', '0 bit'],
        jelas: 'Tidak ada index. Tag = 32 − offset (6) = 26 bit. Itu sebabnya fully associative membutuhkan banyak perbandingan tag.',
      },
      {
        tanya: 'Alamat 16 bit, cache direct-mapped 1 KiB, blok 16 byte. Berapa bit offset, index, dan tag?',
        benar: 'Offset 4, index 6, tag 6',
        salah: ['Offset 4, index 4, tag 8', 'Offset 6, index 4, tag 6', 'Offset 6, index 6, tag 4'],
        jelas: 'Offset = log₂ 16 = 4. Baris = 1024 / 16 = 64 → index 6. Tag = 16 − 6 − 4 = 6.',
      },
    ],
  },

  'arsikom-cache-kebijakan': {
    intisari: 'Cache memerlukan kebijakan penggantian (LRU paling umum), kebijakan penulisan (write-through atau write-back dengan dirty bit), dan miss dikelompokkan menjadi compulsory, capacity, dan conflict.',
    rangkuman: [
      '**Penggantian**: LRU usir blok yang paling lama tak dipakai; FIFO dan random lebih sederhana; direct-mapped tidak punya pilihan.',
      '**Write-through**: tulis ke cache dan memori sekaligus (pakai write buffer). **Write-back**: tulis ke cache saja dengan **dirty bit**, tulis ke memori saat diusir.',
      '**Write-allocate** (muat dulu saat write miss) cocok dengan write-back; **no-write-allocate** dengan write-through.',
      'Miss **3C**: **compulsory** (akses pertama), **capacity** (cache kecil), **conflict** (set bentrok).',
      'Prefetching, I/D cache terpisah di L1, dan hierarki inklusif/eksklusif menyempurnakan desain.',
    ],
    soal: [
      {
        tanya: 'Dalam satu set 2-way, blok A, B, A, C diakses berurutan (semua ke set yang sama, set awalnya kosong). Blok mana yang diusir oleh LRU saat C masuk?',
        benar: 'B',
        salah: ['A', 'C', 'Tidak ada yang diusir'],
        jelas: 'Setelah A, B, A: A paling baru dipakai dan B paling lama. LRU mengusir B.',
      },
      {
        tanya: 'Sebuah variabel ditulis 1.000 kali berturut-turut pada cache write-back. Berapa kali penulisan ke memori utama terjadi (sampai blok diusir)?',
        benar: 'Satu kali, saat baris diusir',
        salah: ['1.000 kali', 'Nol kali selamanya', '500 kali'],
        jelas: 'Write-back hanya menandai baris dirty dan menulis ke memori saat diusir. Write-through akan menulis 1.000 kali.',
      },
      {
        tanya: 'Miss yang terjadi pada akses pertama ke sebuah blok disebut ...',
        benar: 'Compulsory miss',
        salah: ['Capacity miss', 'Conflict miss', 'Coherence miss'],
        jelas: 'Blok yang belum pernah diakses pasti belum ada di cache (cold miss). Cara mengurangi: blok lebih besar atau prefetching.',
      },
      {
        tanya: 'Kebijakan pasangan yang lazim dengan write-back adalah ...',
        benar: 'Write-allocate',
        salah: ['No-write-allocate', 'Selalu bypass cache', 'Write-through buffer saja'],
        jelas: 'Dengan write-back, saat write miss blok dimuat dulu ke cache (write-allocate) lalu ditulis di sana, sehingga penulisan berikutnya bisa hit.',
      },
      {
        tanya: 'Cara paling langsung mengurangi capacity miss adalah ...',
        benar: 'Memperbesar ukuran cache',
        salah: ['Menaikkan asosiativitas cache', 'Memperkecil ukuran blok', 'Memakai kebijakan FIFO'],
        jelas: 'Capacity miss muncul karena data aktif tidak muat. Asosiativitas mengatasi conflict miss, bukan capacity.',
      },
    ],
  },

  'arsikom-amat': {
    intisari: 'AMAT = hit time + miss rate × miss penalty, dan miss cache menambah CPI sebesar akses memori per instruksi × miss rate × penalti sehingga memori bisa menjadi pembatas kinerja.',
    rangkuman: [
      '**AMAT = hit time + miss rate × miss penalty**. Dua level: AMAT = H₁ + M₁ × (H₂ + M₂ × penalti memori).',
      'Miss penalty mendominasi: miss rate kecil pun berdampak besar.',
      '**CPI = CPI dasar + (akses memori/instruksi) × miss rate × penalti**.',
      'Peningkatan cache: blok lebih besar (compulsory), kapasitas (capacity), asosiativitas (conflict), multilevel, prefetching; setiap perbaikan punya harga.',
      'Programmer dapat menolong lewat loop interchange, blocking, dan struktur data ramah cache.',
    ],
    soal: [
      {
        tanya: 'Hit time 2 ns, miss rate 4%, miss penalty 50 ns. Berapa AMAT?',
        benar: '4 ns',
        salah: ['2 ns', '2,04 ns', '52 ns'],
        jelas: 'AMAT = 2 + 0,04 × 50 = 2 + 2 = 4 ns.',
      },
      {
        tanya: 'L1: hit time 1 ns, miss rate 10%. L2: hit time 5 ns, local miss rate 20%. Memori: 100 ns. Berapa AMAT?',
        benar: '3,5 ns',
        salah: ['11 ns', '1,5 ns', '6 ns'],
        jelas: 'AMAT = 1 + 0,10 × (5 + 0,20 × 100) = 1 + 0,10 × 25 = 3,5 ns.',
      },
      {
        tanya: 'CPI dasar 1,0; 1,3 akses memori per instruksi; miss rate 2%; miss penalty 100 siklus. Berapa CPI sebenarnya?',
        benar: '3,6',
        salah: ['1,02', '2,0', '1,26'],
        jelas: 'CPI = 1,0 + 1,3 × 0,02 × 100 = 1,0 + 2,6 = 3,6.',
      },
      {
        tanya: 'Pada soal L1/L2 sebelumnya (miss L1 = 10%, local miss L2 = 20%), berapa global miss rate L2?',
        benar: '2%',
        salah: ['20%', '10%', '30%'],
        jelas: 'Global miss rate = 0,10 × 0,20 = 0,02 = 2% dari seluruh akses CPU.',
      },
      {
        tanya: 'CPI dasar 1,2; 1 fetch instruksi (miss 2%) dan 0,3 akses data (miss 5%) per instruksi; penalti 50 siklus. Berapa CPI?',
        benar: '2,95',
        salah: ['1,75', '2,2', '3,6'],
        jelas: 'Stall instruksi = 1 × 0,02 × 50 = 1,0; stall data = 0,3 × 0,05 × 50 = 0,75. CPI = 1,2 + 1,0 + 0,75 = 2,95.',
      },
    ],
  },

  'arsikom-memori-virtual': {
    intisari: 'Memori virtual memberi tiap proses alamat virtual yang diterjemahkan MMU ke alamat fisik lewat tabel halaman; halaman yang tidak ada di RAM memicu page fault dan dimuat dari disk.',
    rangkuman: [
      'Tiap proses memakai **alamat virtual**; **MMU** menerjemahkannya lewat **tabel halaman**. Halaman umumnya 4 KiB (offset 12 bit).',
      'VA = **VPN | offset**; PA = frame dari PTE + offset. Contoh: 0x00403A7C, VPN 0x403 → frame 0x12 → PA 0x12A7C.',
      'Tabel datar VA 32 bit memakai 4 MiB per proses; tabel **bertingkat** hanya mengalokasikan bagian yang dipakai (x86-64: 4 tingkat).',
      '**Page fault** → OS memuat halaman dari disk (demand paging). Fault sangat mahal: EAT dengan p = 1/1000 ≈ 8,2 µs vs 200 ns.',
      'Penggantian halaman: FIFO, LRU, Clock; **thrashing** bila working set tidak muat.',
    ],
    soal: [
      {
        tanya: 'Dengan halaman berukuran 4 KiB, berapa bit offset pada alamat virtual?',
        benar: '12 bit',
        salah: ['4 bit', '10 bit', '20 bit'],
        jelas: '4 KiB = 2¹² byte sehingga offset 12 bit. Sisanya adalah nomor halaman (VPN).',
      },
      {
        tanya: 'VA 32 bit, halaman 4 KiB, PTE 4 byte (tabel datar). Berapa ukuran tabel halaman satu proses?',
        benar: '4 MiB',
        salah: ['4 KiB', '1 MiB', '16 MiB'],
        jelas: 'VPN 20 bit → 2²⁰ entri × 4 byte = 4 MiB.',
      },
      {
        tanya: 'Halaman 4 KiB, VA = 0x00403A7C, dan VPN 0x403 dipetakan ke frame 0x12. Berapa alamat fisiknya?',
        benar: '0x12A7C',
        salah: ['0x403A7C', '0x12403', '0x1A7C0'],
        jelas: 'Offset 0xA7C tidak berubah; PA = (0x12 << 12) + 0xA7C = 0x12A7C.',
      },
      {
        tanya: 'Apa yang terjadi saat program mengakses halaman yang bit valid-nya 0 (tidak ada di RAM)?',
        benar: 'Terjadi page fault dan OS memuat halaman dari disk ke sebuah frame lalu instruksi diulang',
        salah: ['CPU langsung berhenti dan komputer mati', 'Program menerima nilai nol secara otomatis', 'MMU menulis halaman baru ke register'],
        jelas: 'Page fault adalah exception yang ditangani OS (demand paging). Bila alamat ilegal, proses dihentikan dengan segmentation fault.',
      },
      {
        tanya: 'Akses memori 200 ns, page fault 8 ms, tingkat fault 1/1000. Berapa EAT kira-kira?',
        benar: '8,2 µs',
        salah: ['200 ns', '8 ms', '208 ns'],
        jelas: 'EAT = 0,999 × 200 + 0,001 × 8.000.000 ≈ 199,8 + 8000 ≈ 8200 ns. Hanya 0,1% fault membuat sistem ±40× lebih lambat.',
      },
    ],
  },

  'arsikom-tlb': {
    intisari: 'TLB adalah cache untuk terjemahan alamat virtual → fisik sehingga terjemahan hampir gratis; bila TLB hit halaman pasti ada di memori, dan alur lengkap akses melibatkan TLB, tabel halaman, dan cache.',
    rangkuman: [
      '**TLB** menyimpan terjemahan VPN → frame. Miss memicu *page table walk*; PTE tidak valid memicu page fault.',
      '**TLB reach** = entri × ukuran halaman (64 × 4 KiB = 256 KiB); **huge pages** memperluasnya.',
      '**EAT** = α × (t_TLB + t_mem) + (1 − α) × (t_TLB + 2 t_mem). Contoh α = 98% → 103 ns.',
      'TLB hit ⇒ halaman ada di memori; halaman tidak di memori ⇒ data tidak mungkin ada di cache.',
      'L1 modern memakai **VIPT**; konteks switch memakai flush TLB atau ASID/PCID.',
    ],
    soal: [
      {
        tanya: 'TLB memiliki 64 entri dan halaman 4 KiB. Berapa TLB reach-nya?',
        benar: '256 KiB',
        salah: ['64 KiB', '4 MiB', '16 KiB'],
        jelas: '64 × 4 KiB = 256 KiB.',
      },
      {
        tanya: 't_TLB = 1 ns, t_mem = 100 ns, hit rate TLB 98%, tabel halaman satu tingkat. Berapa EAT?',
        benar: '103 ns',
        salah: ['101 ns', '200 ns', '100 ns'],
        jelas: 'EAT = 0,98 × 101 + 0,02 × 201 = 98,98 + 4,02 = 103,0 ns.',
      },
      {
        tanya: 'Kombinasi mana yang MUSTAHIL terjadi?',
        benar: 'TLB hit tetapi halaman tidak ada di tabel halaman (tidak valid)',
        salah: ['TLB miss, tabel halaman hit, cache hit', 'TLB hit, cache miss', 'TLB miss, page fault, cache miss'],
        jelas: 'Entri TLB hanya ada bila PTE valid. Jadi TLB hit menjamin halaman ada di memori.',
      },
      {
        tanya: 'Apa manfaat ASID/PCID pada TLB?',
        benar: 'Menandai entri TLB dengan proses pemiliknya sehingga TLB tidak perlu di-flush saat pindah proses',
        salah: ['Menaikkan ukuran halaman menjadi 2 MiB', 'Mengganti tabel halaman dengan segmentasi', 'Mempercepat clock CPU'],
        jelas: 'Tanpa ASID, saat OS berpindah proses seluruh TLB harus dikosongkan karena terjemahannya milik proses lama.',
      },
      {
        tanya: 'Mengapa cache L1 modern memakai VIPT (virtually indexed, physically tagged)?',
        benar: 'Index cache dan lookup TLB dapat berjalan paralel, lalu tag dibandingkan dengan alamat fisik',
        salah: ['Agar cache tidak perlu memiliki tag', 'Agar cache dapat menyimpan alamat virtual saja tanpa terjemahan sama sekali', 'Agar blok cache berukuran 4 KiB'],
        jelas: 'Index diambil dari bit offset halaman yang tidak berubah saat terjemahan, sehingga cache dan TLB bekerja bersamaan dan hasilnya sudah tak ambigu.',
      },
    ],
  },
};
