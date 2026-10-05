// Bab 9 Arsikom — I/O, Bus & Penyimpanan. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-bus-lanjut': {
    intisari: 'Bus bersama butuh arbitrasi dan mentok pada frekuensi tinggi karena clock skew dan crosstalk, sehingga sistem modern memakai hierarki bus dan sambungan serial point-to-point seperti PCIe dengan banyak lane.',
    rangkuman: [
      'Pilihan desain bus: lebar, **sinkron** (clock bersama) vs **asinkron** (handshake), multiplexed vs terpisah, transfer burst, dan **arbitrasi**.',
      'Arbitrasi: **daisy chain** (sederhana, rawan starvation), **terpusat paralel**, **terdistribusi**.',
      'Sistem memakai **hierarki bus**: memori cepat dekat CPU, periferal lebih lambat lewat chipset/PCH; northbridge kini ada di dalam CPU.',
      'Bus paralel bersama mentok (clock skew, crosstalk); **serial point-to-point** (PCIe, USB, SATA) menang dengan menambah **lane**.',
      'PCIe 4.0 ≈ 1,97 GB/s per lane per arah; NVMe memakai PCIe x4; USB4 hingga 40 Gbit/s.',
    ],
    soal: [
      {
        tanya: 'Apa kelemahan utama arbitrasi bus daisy chain?',
        benar: 'Perangkat yang paling jauh dari arbiter bisa kelaparan (starvation)',
        salah: ['Tidak dapat dipakai oleh lebih dari satu perangkat', 'Membutuhkan satu kabel khusus per perangkat', 'Semua perangkat memiliki prioritas yang persis sama'],
        jelas: 'Sinyal grant diteruskan berantai sehingga perangkat dekat arbiter berprioritas tinggi, dan yang di ujung bisa tidak pernah mendapat giliran.',
      },
      {
        tanya: 'Mengapa sambungan serial (PCIe) dapat lebih cepat daripada bus paralel lama (PCI)?',
        benar: 'Bus paralel dibatasi clock skew dan crosstalk pada frekuensi tinggi, sedangkan serial dapat berjalan sangat cepat dan diperbanyak dengan lane',
        salah: ['Serial mengirim bit lebih banyak per siklus clock di setiap kabel', 'Serial tidak membutuhkan kabel sama sekali', 'Bus paralel tidak bisa mengirim data biner'],
        jelas: 'Skew antar-kabel membatasi bus paralel. Serial memakai satu pasang diferensial berkecepatan tinggi dan bandwidth ditambah lewat jumlah lane.',
      },
      {
        tanya: 'Berapa bandwidth kira-kira PCIe 4.0 x4 satu arah (≈ 1,97 GB/s per lane)?',
        benar: '± 7,9 GB/s',
        salah: ['± 2 GB/s', '± 31,5 GB/s', '± 0,5 GB/s'],
        jelas: '4 lane × 1,97 GB/s ≈ 7,9 GB/s. Itulah kecepatan SSD NVMe PCIe 4.0 x4. Angka 31,5 GB/s adalah x16.',
      },
      {
        tanya: 'Apa ciri bus asinkron dibanding bus sinkron?',
        benar: 'Tidak memakai clock bersama, melainkan handshake request/acknowledge',
        salah: ['Semua transfer terjadi pada tepi clock yang sama', 'Selalu lebih cepat dari bus sinkron', 'Hanya bisa dipakai untuk satu perangkat'],
        jelas: 'Asinkron cocok untuk perangkat dengan kecepatan sangat beragam karena mereka berjabat tangan, bukan mengikuti clock yang sama.',
      },
      {
        tanya: 'Apa yang terjadi pada northbridge pada sistem PC modern?',
        benar: 'Fungsinya (pengontrol memori dan jalur PCIe) dipindahkan ke dalam chip CPU',
        salah: ['Dihapus tanpa pengganti sehingga memori tak bisa diakses', 'Dipindahkan ke dalam monitor', 'Dijadikan chip khusus untuk keyboard'],
        jelas: 'Pengontrol memori dan PCIe kini berada di CPU, sedangkan periferal lain ditangani PCH (chipset).',
      },
    ],
  },

  'arsikom-teknik-io': {
    intisari: 'Polling membuat CPU menunggu dan menyalin data, interupsi memberi tahu CPU saat siap tetapi CPU tetap menyalin tiap unit, dan DMA memindahkan blok data tanpa CPU sehingga beban CPU hampir nol.',
    rangkuman: [
      '**Modul I/O** menjembatani CPU dan perangkat melalui register data, status, dan kontrol, ditambah buffering dan deteksi galat.',
      '**Polling**: CPU menunggu dan memindahkan data. **Interupsi**: perangkat memberi tahu, CPU tetap memindahkan tiap unit. **DMA**: pengontrol memindahkan blok langsung ke memori.',
      'Contoh 25.000 word/detik pada CPU 1 GHz: polling 1%, interupsi 1,25%, DMA 0,0025%.',
      'Interupsi unggul untuk perangkat yang jarang aktif; DMA untuk blok besar dan cepat.',
      'Jaringan sangat cepat memakai polling (NAPI) atau interrupt coalescing untuk mengurangi overhead interupsi.',
    ],
    soal: [
      {
        tanya: 'Pada teknik I/O mana CPU tidak ikut memindahkan data satu per satu, dan hanya mengatur serta menerima satu interupsi di akhir?',
        benar: 'DMA',
        salah: ['Polling (programmed I/O)', 'Interupsi per byte', 'Memory-mapped I/O saja'],
        jelas: 'Pada DMA, pengontrol DMA yang memindahkan seluruh blok. Polling dan interupsi mengharuskan CPU menyalin tiap unit.',
      },
      {
        tanya: 'Apa kelemahan utama programmed I/O dengan polling?',
        benar: 'CPU terbuang berulang kali memeriksa status (busy waiting)',
        salah: ['Perangkat tidak bisa mengirim data sama sekali', 'Membutuhkan tabel vektor interupsi', 'Hanya dapat bekerja pada bus 8 bit'],
        jelas: 'CPU sibuk menunggu padahal bisa mengerjakan hal lain. Itulah alasan interupsi dan DMA diciptakan.',
      },
      {
        tanya: 'Perangkat mentransfer 25.000 word/detik; satu polling 400 siklus. Berapa beban polling pada CPU 1 GHz?',
        benar: '1%',
        salah: ['0,1%', '10%', '25%'],
        jelas: '25.000 × 400 = 10⁷ siklus/detik, yaitu 1% dari 10⁹ siklus/detik.',
      },
      {
        tanya: 'Untuk perangkat yang hanya sesekali menghasilkan data (misalnya keyboard), teknik apa yang paling sesuai?',
        benar: 'I/O berbasis interupsi',
        salah: ['Polling terus-menerus', 'DMA blok besar', 'Menyalakan ulang CPU setiap kali'],
        jelas: 'Interupsi hanya memakai CPU saat ada data, sedangkan polling terus bertanya walau perangkat jarang aktif.',
      },
      {
        tanya: 'Register apa di modul I/O yang dibaca CPU untuk mengetahui apakah perangkat sudah siap?',
        benar: 'Register status',
        salah: ['Register data', 'Register kontrol', 'Register program counter'],
        jelas: 'Status melaporkan sibuk/siap/galat, data membawa isi yang dipindahkan, dan kontrol dipakai untuk memberi perintah.',
      },
    ],
  },

  'arsikom-dma': {
    intisari: 'Pengontrol DMA bertindak sebagai bus master dan memindahkan blok data langsung antara perangkat dan memori; CPU hanya memprogram transfer dan menerima satu interupsi di akhir, tetapi koherensi cache perlu diperhatikan.',
    rangkuman: [
      '**DMA** memindahkan blok data langsung antara perangkat dan memori; CPU hanya mengatur dan menerima satu interupsi di akhir.',
      'Register DMA: alamat, hitungan, kontrol, status. Pengontrol DMA adalah **bus master**.',
      'Mode: **burst**, **cycle stealing**, **transparent**.',
      'Masalah **koherensi cache** diatasi snooping hardware atau flush/invalidate oleh driver.',
      'DMA memakai alamat fisik: halaman di-pin, **IOMMU** dan **scatter-gather** untuk memori virtual.',
    ],
    soal: [
      {
        tanya: 'Pada transfer DMA 4 KiB dari disk, kapan CPU terlibat?',
        benar: 'Saat memprogram DMA di awal dan saat menerima interupsi selesai di akhir',
        salah: ['Pada setiap byte yang dipindahkan', 'Hanya pada pertengahan transfer', 'CPU tidak pernah terlibat sama sekali, bahkan untuk memulai'],
        jelas: 'CPU mengisi register alamat, hitungan, dan arah lalu mengerjakan hal lain; DMA mengirim satu interupsi saat hitungan mencapai nol.',
      },
      {
        tanya: 'Apa masalah koherensi yang dapat muncul ketika DMA menulis ke memori?',
        benar: 'Cache CPU masih menyimpan nilai lama sehingga CPU bisa membaca data basi',
        salah: ['Memori utama kehilangan seluruh isinya', 'DMA mengubah alamat virtual menjadi acak', 'CPU kehabisan register'],
        jelas: 'DMA menulis langsung ke RAM tanpa melewati cache CPU. Salinan lama di cache harus diinvalidasi (snooping atau oleh driver).',
      },
      {
        tanya: 'Pada mode cycle stealing, apa yang dilakukan DMA?',
        benar: 'Mengambil satu siklus bus di sela-sela CPU untuk memindahkan satu word',
        salah: ['Memegang bus sampai seluruh blok selesai', 'Menunggu CPU berhenti total', 'Menyalin isi cache CPU ke disk'],
        jelas: 'Cycle stealing menyisipkan transfer per word sehingga CPU melambat sedikit tetapi tidak terkunci lama. Memegang bus penuh adalah mode burst.',
      },
      {
        tanya: 'Mengapa buffer untuk DMA biasanya harus di-pin (dikunci) di memori fisik?',
        benar: 'DMA memakai alamat fisik dan OS tidak boleh memindahkan atau menukar halaman itu selama transfer',
        salah: ['Agar halaman dapat dipindahkan ke disk lebih cepat', 'Agar cache CPU tidak digunakan', 'Karena DMA hanya bisa mengakses register'],
        jelas: 'Jika OS memindahkan halaman di tengah transfer, DMA akan menulis ke alamat fisik yang salah.',
      },
      {
        tanya: 'Menyalin 1024 word dengan CPU memakai 20 siklus per word (20.480 siklus), sedangkan DMA butuh sekitar 1.000 siklus untuk persiapan + interupsi. Berapa kali lebih hemat?',
        benar: 'Sekitar 20 kali',
        salah: ['Sekitar 2 kali', 'Sekitar 200 kali', 'Tidak lebih hemat'],
        jelas: '20.480 / 1.000 ≈ 20,5. Selain itu CPU bebas mengerjakan hal lain selama transfer.',
      },
    ],
  },

  'arsikom-hdd-ssd': {
    intisari: 'Waktu akses HDD didominasi seek dan rotational latency mekanis, sedangkan SSD berbasis NAND flash tanpa bagian bergerak sehingga akses acaknya ratusan kali lebih cepat, dengan FTL mengelola penghapusan per blok.',
    rangkuman: [
      '**HDD**: waktu akses = **seek + rotational latency + transfer + controller**; rotational latency rata-rata = ½ putaran (7200 RPM ≈ 4,17 ms).',
      'Akses acak 4 KiB pada HDD ≈ 13 ms (±75 IOPS); akses berurutan jauh lebih efisien.',
      '**SSD**: NAND flash; hapus per blok, tulis per halaman; **FTL** mengelola pemetaan, garbage collection, wear leveling, dan TRIM.',
      'SSD ±100–1000× lebih cepat pada akses acak dan 3–30× pada berurutan; NVMe lewat PCIe jauh di atas SATA.',
      'Daya tahan tulis SSD terbatas (TBW). I/O sering menjadi pembatas kinerja sistem (Amdahl).',
    ],
    soal: [
      {
        tanya: 'Berapa rotational latency rata-rata HDD 7200 RPM?',
        benar: '± 4,17 ms',
        salah: ['± 8,33 ms', '± 1 ms', '± 0,5 ms'],
        jelas: 'Satu putaran = 60 / 7200 = 8,33 ms dan rata-rata setengahnya ≈ 4,17 ms.',
      },
      {
        tanya: 'Berapa rotational latency rata-rata HDD 5400 RPM?',
        benar: '± 5,56 ms',
        salah: ['± 11,1 ms', '± 4,17 ms', '± 2,8 ms'],
        jelas: 'Satu putaran = 60 / 5400 = 11,11 ms dan rata-rata setengahnya ≈ 5,56 ms.',
      },
      {
        tanya: 'Seek 8 ms, rotational latency rata-rata 4,17 ms, transfer 0,05 ms, controller 0,3 ms. Berapa waktu akses totalnya?',
        benar: '± 12,5 ms',
        salah: ['± 8,05 ms', '± 4,5 ms', '± 25 ms'],
        jelas: '8 + 4,17 + 0,05 + 0,3 = 12,52 ms. Hampir semua waktu terbuang untuk gerak mekanis.',
      },
      {
        tanya: 'Mengapa SSD memerlukan FTL (Flash Translation Layer)?',
        benar: 'Karena sel flash harus dihapus per blok sebelum ditulis ulang, sehingga penulisan dipetakan ke halaman kosong baru dan blok lama dibersihkan kemudian',
        salah: ['Karena flash menyimpan data sebagai muatan kapasitor yang harus di-refresh', 'Agar SSD bisa memutar piringan dengan cepat', 'Agar SSD bisa diakses lewat alamat virtual proses'],
        jelas: 'FTL menyembunyikan keterbatasan flash: pemetaan logis-fisik, garbage collection, wear leveling, dan TRIM.',
      },
      {
        tanya: 'Peningkatan terbesar SSD dibanding HDD terdapat pada ...',
        benar: 'Latensi dan IOPS akses acak',
        salah: ['Kapasitas maksimum per disk', 'Daya tahan tulis tak terbatas', 'Harga per gigabyte'],
        jelas: 'SSD tidak memiliki seek dan rotasi sehingga akses acak ratusan kali lebih cepat. Harga per GB masih lebih mahal dan daya tahan tulisnya terbatas.',
      },
    ],
  },

  'arsikom-raid': {
    intisari: 'RAID menggabungkan banyak disk dengan striping (kinerja) dan mirroring/parity (keandalan); parity adalah XOR blok data sehingga satu blok yang hilang dapat dipulihkan.',
    rangkuman: [
      '**RAID 0**: nS, tanpa toleransi. **RAID 1**: nS/2. **RAID 5**: (n−1)S, bertahan 1 disk, parity terdistribusi. **RAID 6**: (n−2)S, bertahan 2 disk. **RAID 10**: nS/2, mirror + stripe.',
      '**Parity = XOR** blok data; blok hilang dipulihkan dengan XOR blok lain (A ⊕ B = P → A = B ⊕ P).',
      'Update kecil pada RAID 5: P_baru = P_lama ⊕ data_lama ⊕ data_baru, sehingga butuh **4 operasi I/O**.',
      'Saat rebuild tidak ada redundansi pada RAID 5, sehingga disk besar mendorong RAID 6.',
      '**RAID bukan backup**: gunakan aturan 3-2-1.',
    ],
    soal: [
      {
        tanya: 'Berapa kapasitas usable RAID 5 dengan 5 disk @ 4 TB?',
        benar: '16 TB',
        salah: ['20 TB', '12 TB', '10 TB'],
        jelas: 'RAID 5 = (n − 1) × S = 4 × 4 TB = 16 TB (satu disk setara dipakai parity).',
      },
      {
        tanya: 'Apa konsekuensi bila satu disk pada RAID 0 rusak?',
        benar: 'Seluruh data array hilang karena tidak ada redundansi',
        salah: ['Data tetap utuh karena ada parity', 'Hanya setengah data hilang tetapi bisa dipulihkan', 'Array otomatis menjadi RAID 1'],
        jelas: 'RAID 0 hanya striping tanpa redundansi, sehingga satu disk rusak berarti kehilangan seluruh data.',
      },
      {
        tanya: 'RAID 5 tiga disk: disk B = 0101 dan parity P = 1001 (P = A ⊕ B). Disk A rusak. Berapa isi A?',
        benar: '1100',
        salah: ['0101', '1001', '0000'],
        jelas: 'A = B ⊕ P = 0101 ⊕ 1001 = 1100. XOR bersifat self-inverse.',
      },
      {
        tanya: 'Mengapa penulisan kecil acak pada RAID 5 lambat?',
        benar: 'Memperbarui satu blok membutuhkan 4 operasi I/O (baca data lama, baca parity lama, tulis data baru, tulis parity baru)',
        salah: ['Karena data harus ditulis ke semua disk secara bersamaan', 'Karena RAID 5 menolak menulis tanpa backup', 'Karena parity disimpan di cloud'],
        jelas: 'P_baru = P_lama ⊕ data_lama ⊕ data_baru memerlukan membaca nilai lama dan menulis dua blok.',
      },
      {
        tanya: 'Mengapa RAID tidak dapat menggantikan backup?',
        benar: 'RAID tidak melindungi dari penghapusan tidak sengaja, ransomware, atau bencana karena kesalahan ditulis ke semua disk',
        salah: ['RAID hanya bekerja pada satu disk', 'RAID membuat data selalu terenkripsi sehingga tak bisa disalin', 'RAID mengubah semua data menjadi parity sehingga tak terbaca'],
        jelas: 'RAID hanya melindungi dari kerusakan disk. Data yang terhapus atau terenkripsi ransomware terhapus/terenkripsi di semua disk sekaligus.',
      },
    ],
  },
};
