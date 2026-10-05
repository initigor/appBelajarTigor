// Bab 10 Arsikom — Paralelisme & Arsitektur Modern. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-flynn': {
    intisari: 'Paralelisme hadir sebagai ILP, DLP, dan TLP; taksonomi Flynn membaginya menjadi SISD, SIMD, MISD, dan MIMD, sedangkan Hukum Amdahl membatasi manfaat menambah inti.',
    rangkuman: [
      'Tiga tingkat paralelisme: **ILP** (hardware, otomatis), **DLP** (operasi sama pada banyak data), **TLP** (banyak thread).',
      '**Flynn**: **SISD** (komputer klasik), **SIMD** (satu instruksi, banyak data: instruksi vektor, GPU), **MISD** (jarang), **MIMD** (multicore, klaster).',
      'MIMD memori bersama (thread, multicore) vs terdistribusi (message passing, MPI).',
      '**SMT/Hyper-Threading**: satu inti fisik menjalankan 2 thread dengan tambahan kinerja ±20–30%.',
      'Hukum Amdahl membatasi percepatan dari menambah inti: bagian serial harus kecil.',
    ],
    soal: [
      {
        tanya: 'Instruksi vektor AVX yang menjumlahkan 8 float sekaligus dengan satu instruksi termasuk kategori Flynn ...',
        benar: 'SIMD',
        salah: ['SISD', 'MISD', 'MIMD'],
        jelas: 'Satu aliran instruksi bekerja pada banyak elemen data sekaligus: SIMD.',
      },
      {
        tanya: 'Prosesor multicore tempat tiap inti menjalankan program/thread berbeda dengan data berbeda termasuk ...',
        benar: 'MIMD',
        salah: ['SISD', 'SIMD', 'MISD'],
        jelas: 'Banyak prosesor, masing-masing dengan instruksi dan data sendiri adalah ciri MIMD.',
      },
      {
        tanya: 'Program 90% paralel dijalankan pada 8 inti. Berapa speedup menurut Amdahl?',
        benar: 'Sekitar 4,7',
        salah: ['8', '7,2', '10'],
        jelas: 'Speedup = 1 / (0,1 + 0,9/8) = 1 / 0,2125 ≈ 4,7. Bagian serial 10% menahan percepatan.',
      },
      {
        tanya: 'Berapa tambahan kinerja kira-kira yang diberikan SMT (Hyper-Threading) pada satu inti?',
        benar: 'Sekitar 20–30%',
        salah: ['100% (dua kali lipat)', 'Tidak ada sama sekali', 'Sekitar 400%'],
        jelas: 'Kedua thread berbagi unit eksekusi dan cache sehingga keuntungan hanya mengisi slot yang menganggur.',
      },
      {
        tanya: 'Menjumlahkan dua array besar elemen demi elemen paling tepat dikategorikan sebagai paralelisme ...',
        benar: 'Data-level (DLP)',
        salah: ['Instruction-level saja tanpa data', 'Thread-level dengan tugas berbeda-beda', 'Tidak dapat diparalelkan'],
        jelas: 'Operasi yang sama pada banyak data adalah DLP, cocok untuk SIMD dan GPU.',
      },
    ],
  },

  'arsikom-multicore': {
    intisari: 'Pada multicore, protokol koherensi seperti MESI menjaga agar semua inti melihat data terbaru; false sharing, race condition, dan sinkronisasi atomik adalah isu utama pemrograman paralel.',
    rangkuman: [
      '**Koherensi cache** memastikan semua inti melihat nilai terbaru satu alamat. **MESI**: Modified, Exclusive, Shared, Invalid, dengan snooping dan write-invalidate.',
      'Skala besar memakai **directory-based coherence**.',
      '**False sharing**: variabel berbeda di satu baris cache menyebabkan ping-pong; atasi dengan padding.',
      'Konsistensi memori mengatur urutan antar-alamat; ARM/RISC-V butuh fence eksplisit.',
      'Sinkronisasi memakai instruksi atomik (**test-and-set, CAS, fetch-and-add**); hindari race condition, deadlock, dan lock contention.',
    ],
    soal: [
      {
        tanya: 'Inti 0 menulis ke baris cache yang berstatus Shared (inti 1 juga memilikinya). Apa yang terjadi pada protokol MESI?',
        benar: 'Salinan inti 1 menjadi Invalid dan baris inti 0 menjadi Modified',
        salah: ['Kedua baris menjadi Exclusive', 'Baris inti 0 menjadi Invalid dan inti 1 menjadi Modified', 'Tidak ada yang berubah sampai baris diusir'],
        jelas: 'Penulisan pada baris S mengirim invalidate ke cache lain, sehingga pemilik menjadi M dan yang lain I.',
      },
      {
        tanya: 'Sebuah inti membaca baris yang tidak dimiliki cache lain mana pun. Keadaan MESI yang dipakai adalah ...',
        benar: 'Exclusive (E)',
        salah: ['Modified (M)', 'Shared (S)', 'Invalid (I)'],
        jelas: 'Bersih dan satu-satunya salinan berarti Exclusive. Keadaan E memungkinkan penulisan berikutnya tanpa memberi tahu siapa pun.',
      },
      {
        tanya: 'Apa yang dimaksud false sharing?',
        benar: 'Dua thread menulis variabel berbeda yang berada di baris cache yang sama sehingga baris bolak-balik antar-inti',
        salah: ['Dua thread berbagi variabel yang sama dengan lock', 'Cache menyimpan data yang tidak pernah dipakai', 'Thread berbagi register yang sama'],
        jelas: 'Koherensi bekerja pada tingkat baris cache (64 byte), sehingga penulisan variabel berbeda dalam baris yang sama tetap menginvalidasi inti lain.',
      },
      {
        tanya: 'Dua thread masing-masing menjalankan `counter++` 1000 kali pada variabel bersama tanpa sinkronisasi. Hasil akhirnya ...',
        benar: 'Bisa kurang dari 2000 karena sebagian pembaruan hilang (race condition)',
        salah: ['Selalu tepat 2000', 'Selalu tepat 1000', 'Selalu lebih dari 2000'],
        jelas: '`counter++` terdiri dari LOAD, ADD, STORE yang dapat saling menyela, sehingga satu pembaruan bisa menimpa yang lain.',
      },
      {
        tanya: 'Apa yang dilakukan instruksi atomik Compare-and-Swap (CAS)?',
        benar: 'Jika nilai saat ini sama dengan nilai yang diharapkan, ganti dengan nilai baru, semuanya sebagai satu operasi tak terpisahkan',
        salah: ['Menukar isi dua register secara berurutan tanpa memeriksa nilai apa pun sebelumnya dan tanpa jaminan operasi tidak disela inti lain', 'Menyalin seluruh baris cache ke memori', 'Menghentikan semua inti lain selama satu detik'],
        jelas: 'CAS adalah blok bangunan lock dan struktur data lock-free; atomisitas dijamin hardware lewat penguncian baris cache.',
      },
    ],
  },

  'arsikom-gpu': {
    intisari: 'GPU mengoptimalkan throughput dengan ribuan inti sederhana yang menjalankan thread dalam warp (SIMT) dan menyembunyikan latensi memori lewat perpindahan antar-warp, tetapi transfer data lewat PCIe sering menjadi bottleneck.',
    rangkuman: [
      '**CPU**: sedikit inti kompleks, optimasi **latensi**. **GPU**: ribuan inti sederhana, optimasi **throughput**.',
      'Model **SIMT**: kernel ditulis per thread; thread dikelompokkan dalam **warp** (32) yang menjalankan instruksi sama. **Divergensi** warp memperlambat.',
      'GPU menyembunyikan latensi dengan **banyak warp**, bukan cache/OoO. **Coalescing** akses memori penting.',
      'Transfer data CPU↔GPU lewat PCIe sering menjadi bottleneck; tinggikan **arithmetic intensity**.',
      'GPU unggul untuk perkalian matriks dan AI (Tensor Core); kode bercabang dan serial lebih cocok untuk CPU.',
    ],
    soal: [
      {
        tanya: 'Berapa jumlah thread dalam satu warp pada GPU NVIDIA?',
        benar: '32',
        salah: ['8', '256', '1024'],
        jelas: 'Warp NVIDIA berisi 32 thread yang mengeksekusi instruksi yang sama secara serentak (AMD memakai wavefront 32 atau 64).',
      },
      {
        tanya: 'Apa dampak divergensi warp (thread dalam satu warp mengambil cabang if/else berbeda)?',
        benar: 'Kedua jalur dijalankan berurutan sehingga waktu bertambah',
        salah: ['Semua thread berhenti selamanya', 'GPU otomatis menambah jumlah core', 'Tidak ada dampak sama sekali'],
        jelas: 'Hardware mengeksekusi satu jalur sementara thread lain dimatikan, lalu jalur sebaliknya. Warp 50/50 memakan dua kali waktu.',
      },
      {
        tanya: 'Bagaimana GPU menutupi latensi akses memori global yang tinggi?',
        benar: 'Berpindah ke warp lain yang siap berjalan ketika satu warp menunggu data',
        salah: ['Dengan cache L1 yang sangat besar dan prediksi cabang', 'Dengan menaikkan frekuensi clock secara dinamis', 'Dengan menjalankan instruksi secara out-of-order seperti CPU'],
        jelas: 'GPU mengandalkan paralelisme thread masif dan pergantian warp tanpa biaya, bukan cache besar atau OoO.',
      },
      {
        tanya: 'Perbedaan filosofi desain utama CPU dan GPU adalah ...',
        benar: 'CPU mengoptimasi latensi satu tugas, GPU mengoptimasi throughput banyak tugas',
        salah: ['CPU hanya melakukan grafik, GPU hanya melakukan aritmetika bulat', 'CPU memiliki lebih banyak inti daripada GPU', 'GPU tidak memiliki memori sama sekali'],
        jelas: 'CPU: sedikit inti kuat dengan kontrol canggih. GPU: ribuan ALU sederhana untuk pekerjaan seragam yang masif.',
      },
      {
        tanya: 'Mengirim 1 GB data ke GPU lewat PCIe 4.0 x16 (±30 GB/s) kira-kira memakan waktu ...',
        benar: '± 33 ms',
        salah: ['± 33 µs', '± 3,3 detik', '± 0,3 ms'],
        jelas: '1 GB / 30 GB/s ≈ 0,033 detik. Bila komputasinya hanya beberapa ms, transfer data menjadi bottleneck.',
      },
    ],
  },

  'arsikom-tren': {
    intisari: 'Karena daya dan panas membatasi kinerja, arsitektur modern memakai inti heterogen, SoC dengan memori terpadu, akselerator domain-spesifik, dan packaging seperti chiplet dan HBM.',
    rangkuman: [
      '**Daya dan panas** membatasi kinerja: dark silicon, DVFS, power gating; metrik utama adalah kinerja per watt.',
      '**Heterogenitas**: inti big dan LITTLE; **SoC** menyatukan CPU, GPU, NPU dan lainnya dengan memori terpadu.',
      '**Akselerator domain-spesifik** (GPU, TPU/NPU, enkoder video, kripto) 10–1000× lebih efisien untuk tugas khusus.',
      'Packaging: **HBM**, **chiplet**, **3D stacking** mengatasi memory wall dan biaya.',
      'ISA: ARM, x86, dan **RISC-V** terbuka. Keamanan (Spectre/Meltdown) kini menjadi bagian desain arsitektur.',
    ],
    soal: [
      {
        tanya: 'Apa yang dimaksud dark silicon?',
        benar: 'Sebagian transistor di chip tidak boleh dinyalakan bersamaan karena batas daya dan panas',
        salah: ['Bagian chip yang rusak saat produksi', 'Silikon yang dicat hitam untuk menyerap panas', 'Transistor yang hanya dipakai untuk tampilan layar'],
        jelas: 'Jumlah transistor naik lebih cepat daripada kemampuan chip membuang panas, sehingga sebagian harus "gelap" pada suatu waktu.',
      },
      {
        tanya: 'Apa tujuan arsitektur big.LITTLE?',
        benar: 'Menjalankan tugas berat pada inti kuat dan tugas ringan pada inti hemat daya demi efisiensi energi',
        salah: ['Membuat semua inti di chip berukuran dan berkemampuan sama persis agar penjadwalan di sistem operasi lebih sederhana', 'Menggandakan memori utama', 'Mengganti GPU dengan inti kecil'],
        jelas: 'Penjadwal OS menempatkan thread pada jenis inti yang cocok, menghemat baterai tanpa mengorbankan kinerja puncak.',
      },
      {
        tanya: 'Apa keunggulan memori terpadu (unified memory) pada SoC seperti Apple Silicon?',
        benar: 'CPU dan GPU berbagi RAM yang sama sehingga data tidak perlu disalin',
        salah: ['Memori tidak memerlukan alamat', 'RAM tidak lagi dibutuhkan sama sekali', 'Kecepatan clock otomatis dua kali lipat'],
        jelas: 'Tidak ada penyalinan lewat PCIe antara memori CPU dan GPU, sehingga lebih hemat waktu dan energi.',
      },
      {
        tanya: 'Mengapa akselerator domain-spesifik seperti TPU dibuat?',
        benar: 'Perangkat keras khusus untuk tugas tertentu jauh lebih efisien daripada CPU serbaguna',
        salah: ['Karena CPU tidak dapat melakukan perkalian', 'Untuk menggantikan sistem operasi', 'Karena transistor tidak bisa dibuat kecil lagi sama sekali'],
        jelas: 'Dengan memetakan komputasi dominan (misal perkalian matriks) langsung ke hardware, efisiensi bisa 10–1000× lebih baik.',
      },
      {
        tanya: 'Kerentanan Spectre dan Meltdown memanfaatkan fitur CPU apa?',
        benar: 'Eksekusi spekulatif yang meninggalkan jejak di cache',
        salah: ['Instruksi penjumlahan bilangan bulat', 'Refresh DRAM', 'Penggunaan RISC-V'],
        jelas: 'Instruksi spekulatif yang dibatalkan tetap mengubah keadaan cache yang bisa diukur penyerang (side channel).',
      },
    ],
  },

  'arsikom-rangkuman': {
    intisari: 'Satu baris kode melibatkan seluruh tumpukan komputer: kompilator, OS, memori virtual, cache, pipeline, ALU, gerbang logika, dan transistor, dengan kinerja yang diatur oleh Waktu CPU = IC × CPI × T.',
    rangkuman: [
      'Satu baris kode melibatkan **seluruh** tumpukan: kompilator, OS, memori virtual, cache, pipeline, ALU, gerbang, dan transistor.',
      'Kinerja = **IC × CPI × T**; hambatan umum: memori (memory wall), cabang, dependensi, bagian serial (Amdahl).',
      'Lima ide pengikat: **abstraksi**, **lokalitas**, **paralelisme**, **percepat kasus umum**, dan **kompromi**.',
      'Memahami arsitektur membantu men-debug dan mengoptimasi: cache, race condition, overflow, endianness, floating point.',
    ],
    soal: [
      {
        tanya: 'Rumus Waktu CPU yang menyatukan seluruh bab adalah ...',
        benar: 'Waktu CPU = IC × CPI × T',
        salah: ['Waktu CPU = IC + CPI + T', 'Waktu CPU = IC / (CPI × T)', 'Waktu CPU = CPI × jumlah register'],
        jelas: 'Jumlah instruksi × siklus per instruksi × periode clock. IC dari kompilator/ISA, CPI dari organisasi, T dari teknologi.',
      },
      {
        tanya: 'Saat program mengakses halaman memori yang belum ada di RAM, urutan yang benar adalah ...',
        benar: 'Page fault (exception) → OS meminta disk memuat halaman lewat DMA → interupsi selesai → instruksi diulang',
        salah: ['CPU mengisi halaman itu dengan nol tanpa bantuan OS', 'TLB menyalin halaman dari register', 'Cache L1 membaca halaman dari ROM'],
        jelas: 'Exception memicu OS, DMA memindahkan data dari penyimpanan tanpa CPU, interupsi menandai selesai, lalu instruksi yang gagal dijalankan ulang.',
      },
      {
        tanya: 'Program di mesin 16 inti hanya sedikit lebih cepat daripada di 4 inti. Penyebab yang paling mungkin adalah ...',
        benar: 'Bagian serial yang besar (Amdahl), false sharing, atau kontensi lock',
        salah: ['Instruksi penjumlahan tidak bekerja pada banyak inti', 'Frekuensi clock turun menjadi nol', 'Jumlah register bertambah terlalu banyak'],
        jelas: 'Menambah inti hanya mempercepat bagian paralel; sinkronisasi dan koherensi cache menambah biaya.',
      },
      {
        tanya: 'Bagian perangkat keras mana yang menerjemahkan alamat virtual menjadi fisik dengan cepat dalam satu akses memori?',
        benar: 'TLB (di dalam MMU)',
        salah: ['Cache instruksi L1', 'Register flag', 'Unit pembagi'],
        jelas: 'TLB menyimpan terjemahan terbaru sehingga hampir semua akses tidak perlu menelusuri tabel halaman.',
      },
      {
        tanya: 'Manakah yang BUKAN salah satu dari lima ide pengikat Arsikom?',
        benar: 'Selalu menaikkan frekuensi clock tanpa batas',
        salah: ['Abstraksi berlapis', 'Memanfaatkan lokalitas dan hierarki', 'Percepat kasus umum'],
        jelas: 'Frekuensi tidak bisa naik terus karena dinding daya. Ide pengikatnya adalah abstraksi, lokalitas, paralelisme, percepat kasus umum, dan kompromi.',
      },
    ],
  },
};
