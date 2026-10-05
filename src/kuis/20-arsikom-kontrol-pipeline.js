// Bab 7 Arsikom — Unit Kontrol & Pipeline. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-unit-kontrol': {
    intisari: 'Unit kontrol membangkitkan sinyal kontrol dari opcode; hardwired memakai rangkaian logika (cepat, sulit diubah), sedangkan microprogrammed memakai mikroprogram di control store (fleksibel, lebih lambat).',
    rangkuman: [
      'Sinyal kontrol (RegWrite, ALUSrc, MemRead, MemWrite, Branch, ALUOp ...) ditentukan oleh opcode; tabel opcode → sinyal adalah tabel kebenaran.',
      '**Hardwired**: rangkaian logika/FSM langsung; cepat tetapi sulit diubah. Dipakai RISC.',
      '**Microprogrammed**: tiap instruksi dijalankan oleh mikroprogram di **control store**; fleksibel dan bisa diperbarui, tetapi lebih lambat. Dipakai CISC.',
      'Mikroinstruksi **horizontal** = satu bit per sinyal (lebar, cepat); **vertical** = terkode (sempit).',
      'CPU modern memadukan decoder hardwired untuk instruksi sederhana dan microcode untuk instruksi kompleks; microcode dapat diperbarui tanpa mengganti chip.',
    ],
    soal: [
      {
        tanya: 'Apa keunggulan utama unit kontrol hardwired dibanding microprogrammed?',
        benar: 'Lebih cepat karena sinyal dibangkitkan langsung oleh rangkaian logika',
        salah: ['Lebih mudah diubah tanpa merancang ulang chip', 'Dapat menyimpan lebih banyak instruksi di ROM', 'Tidak memerlukan clock'],
        jelas: 'Hardwired hanya melewati beberapa gerbang, sedangkan microprogrammed harus mengakses control store pada setiap langkah. Fleksibilitas adalah keunggulan microprogrammed.',
      },
      {
        tanya: 'Di mana mikroinstruksi pada unit kontrol microprogrammed disimpan?',
        benar: 'Di control store (biasanya ROM)',
        salah: ['Di register flag', 'Di cache data L1', 'Di dalam ALU'],
        jelas: 'Control store menyimpan mikroprogram untuk semua instruksi mesin. μPC mengalamatinya urut demi urut.',
      },
      {
        tanya: 'Pada datapath MIPS, bagaimana nilai sinyal kontrol untuk instruksi `sw`?',
        benar: 'MemWrite = 1 dan RegWrite = 0',
        salah: ['MemWrite = 0 dan RegWrite = 1', 'MemRead = 1 dan RegWrite = 1', 'Semua sinyal bernilai 0'],
        jelas: '`sw` menulis ke memori sehingga MemWrite aktif; ia tidak menulis register sehingga RegWrite = 0. `lw` kebalikannya.',
      },
      {
        tanya: 'Apa ciri mikroinstruksi bergaya horizontal?',
        benar: 'Satu bit untuk setiap sinyal kontrol sehingga lebar tetapi bisa mengaktifkan banyak sinyal sekaligus',
        salah: ['Field dikodekan rapat dan harus di-decode dulu', 'Hanya boleh mengaktifkan satu sinyal per siklus', 'Hanya dipakai pada unit kontrol hardwired'],
        jelas: 'Horizontal = lebar dan cepat; vertical = sempit dan terkode sehingga lebih hemat memori namun lebih lambat.',
      },
      {
        tanya: 'Manfaat nyata dari microcode pada CPU modern adalah ...',
        benar: 'Bug atau celah keamanan dapat ditambal lewat pembaruan microcode tanpa mengganti chip',
        salah: ['Seluruh instruksi menjadi jauh lebih cepat', 'CPU tidak lagi membutuhkan decoder', 'Chip tidak lagi memerlukan transistor'],
        jelas: 'Pembaruan microcode (dari BIOS atau OS) dapat mengubah perilaku sebagian instruksi, sehingga tidak perlu memproduksi chip baru.',
      },
    ],
  },

  'arsikom-pipeline': {
    intisari: 'Pipeline membagi eksekusi instruksi menjadi tahap yang tumpang tindih sehingga throughput naik hingga k kali, sedangkan periode clock ditentukan oleh tahap terlama.',
    rangkuman: [
      'Lima tahap klasik: **IF, ID, EX, MEM, WB**, dipisahkan register pipeline.',
      'Siklus tanpa pipeline = n × k; dengan pipeline = **k + n − 1**. Speedup ideal → k; CPI → 1.',
      'Pipeline meningkatkan **throughput**, bukan latensi satu instruksi.',
      'Periode clock = waktu tahap **terlama**; tahap tidak seimbang membuat speedup < k.',
      'RISC cocok untuk pipeline: panjang tetap, format seragam, akses memori hanya LOAD/STORE.',
    ],
    soal: [
      {
        tanya: 'Berapa siklus untuk menjalankan 100 instruksi pada pipeline 5 tahap tanpa hazard?',
        benar: '104',
        salah: ['100', '500', '105'],
        jelas: 'Siklus = k + (n − 1) = 5 + 99 = 104.',
      },
      {
        tanya: 'Waktu tahap pipeline: IF 200 ps, ID 100 ps, EX 200 ps, MEM 200 ps, WB 100 ps. Berapa periode clock yang dipakai?',
        benar: '200 ps',
        salah: ['100 ps', '160 ps', '800 ps'],
        jelas: 'Clock harus muat untuk tahap terlama, yaitu 200 ps. Rata-rata (160 ps) atau total (800 ps) bukan periode pipeline.',
      },
      {
        tanya: 'Dengan waktu tahap pada soal sebelumnya, berapa speedup pipeline untuk n sangat besar dibanding single-cycle 800 ps?',
        benar: '4',
        salah: ['5', '3', '8'],
        jelas: 'Speedup = 800 / 200 = 4, bukan 5 karena tahap tidak seimbang.',
      },
      {
        tanya: 'Pipeline terutama meningkatkan ...',
        benar: 'Throughput (jumlah instruksi selesai per satuan waktu)',
        salah: ['Latensi satu instruksi menjadi k kali lebih kecil', 'Jumlah register yang tersedia', 'Kapasitas memori utama'],
        jelas: 'Satu instruksi tetap melewati semua tahap, tetapi banyak instruksi diproses tumpang tindih sehingga laju penyelesaian naik.',
      },
      {
        tanya: 'Mengapa instruksi berpanjang tetap memudahkan pipeline?',
        benar: 'Tahap IF langsung tahu alamat instruksi berikutnya (PC + 4) dan field decode berada di posisi tetap',
        salah: ['Instruksi berpanjang tetap tidak pernah menimbulkan hazard', 'Instruksi berpanjang tetap tidak membutuhkan memori', 'Semua instruksi dikerjakan oleh unit kontrol microprogrammed'],
        jelas: 'Keseragaman menyederhanakan fetch dan decode sehingga tahap-tahap mudah dibuat seimbang.',
      },
    ],
  },

  'arsikom-hazard-data': {
    intisari: 'Hazard struktural diatasi dengan memisahkan sumber daya, sedangkan hazard data RAW diatasi dengan stall atau forwarding; load-use tetap membutuhkan satu stall.',
    rangkuman: [
      '**Hazard struktural**: dua instruksi memakai hardware sama bersamaan. Solusi: I-cache dan D-cache terpisah, register file multi-port.',
      '**RAW** (baca setelah tulis) adalah ketergantungan sejati; WAR dan WAW baru muncul pada out-of-order.',
      '**Stall** menyisipkan bubble; **forwarding** meneruskan hasil dari register pipeline langsung ke ALU.',
      'ALU → ALU berurutan: 2 stall tanpa forwarding, **0** dengan forwarding. **Load-use**: 1 stall walaupun ada forwarding.',
      'Kompilator dapat menjadwalkan ulang instruksi untuk mengisi jeda load-use.',
    ],
    soal: [
      {
        tanya: 'Apa yang dimaksud hazard RAW (Read After Write)?',
        benar: 'Sebuah instruksi membaca register yang akan ditulis oleh instruksi sebelumnya yang belum selesai',
        salah: ['Dua instruksi menulis ke register berbeda secara bersamaan', 'Instruksi membaca memori yang tidak ada', 'Dua instruksi memakai ALU yang sama tetapi untuk operasi berbeda'],
        jelas: 'RAW adalah ketergantungan data sejati: B membutuhkan nilai yang dihasilkan A. Hazard struktural adalah bentrok sumber daya.',
      },
      {
        tanya: '`add $s0,...` diikuti `sub $t2,$s0,...`. Berapa stall yang dibutuhkan pada pipeline 5 tahap dengan forwarding penuh?',
        benar: '0',
        salah: ['1', '2', '3'],
        jelas: 'Hasil add tersedia di akhir EX dan diteruskan ke EX sub tanpa menunggu WB.',
      },
      {
        tanya: '`lw $t0,...` langsung diikuti instruksi yang memakai `$t0`. Berapa stall minimum dengan forwarding penuh?',
        benar: '1',
        salah: ['0', '2', '4'],
        jelas: 'Data lw baru tersedia setelah tahap MEM, sedangkan instruksi berikutnya membutuhkannya di awal EX. Tidak bisa meneruskan mundur dalam waktu, sehingga 1 stall wajib.',
      },
      {
        tanya: 'Tanpa forwarding, dua instruksi berurutan dengan ketergantungan RAW ALU → ALU menyebabkan berapa stall (register file ditulis di paruh pertama dan dibaca di paruh kedua siklus)?',
        benar: '2',
        salah: ['0', '1', '5'],
        jelas: 'Instruksi kedua baru bisa membaca di ID setelah instruksi pertama mencapai WB, sehingga tertunda 2 siklus.',
      },
      {
        tanya: 'Cara umum menghilangkan hazard struktural pada akses memori (IF vs MEM) adalah ...',
        benar: 'Memisahkan cache instruksi dan cache data',
        salah: ['Menaikkan frekuensi clock', 'Menambah jumlah tahap pipeline', 'Menggunakan prediksi cabang'],
        jelas: 'Dengan dua cache terpisah, fetch instruksi dan akses data dapat berlangsung pada siklus yang sama.',
      },
    ],
  },

  'arsikom-hazard-kontrol': {
    intisari: 'Hazard kontrol disebabkan lompat bersyarat yang hasilnya belum diketahui saat instruksi berikutnya sudah masuk pipeline; prediksi cabang dinamis menurunkan penalti secara drastis.',
    rangkuman: [
      'Instruksi setelah cabang sudah masuk pipeline sebelum hasilnya diketahui; salah tebak = flush dan penalti.',
      'Strategi: stall, majukan keputusan ke ID, **predict not taken**, delayed branch, **prediksi dinamis**.',
      '**Prediktor 2-bit** hanya salah sekali per loop (1-bit dua kali). **BTB** menyimpan alamat target cabang.',
      'Tambahan CPI = frekuensi cabang × tingkat salah × penalti.',
      'Eksekusi spekulatif mempercepat tetapi membuka celah seperti Spectre.',
    ],
    soal: [
      {
        tanya: 'Pola cabang T, T, T, N berulang. Prediktor 2-bit (mulai keadaan 10) berapa kali salah per 4 kejadian pada kondisi stabil?',
        benar: '1 kali',
        salah: ['0 kali', '2 kali', '4 kali'],
        jelas: 'Keadaan hanya turun ke 10 setelah N dan naik lagi ke 11 pada T berikutnya, jadi hanya N yang salah diprediksi. Prediktor 1-bit salah dua kali.',
      },
      {
        tanya: '20% instruksi adalah cabang, 5% dari cabang salah prediksi, penalti 15 siklus. Berapa tambahan CPI?',
        benar: '0,15',
        salah: ['0,75', '3,0', '1,15'],
        jelas: 'Tambahan = 0,20 × 0,05 × 15 = 0,15 (CPI total 1,15).',
      },
      {
        tanya: 'Apa fungsi Branch Target Buffer (BTB)?',
        benar: 'Menyimpan pasangan alamat cabang dan alamat targetnya agar target dapat diprediksi saat fetch',
        salah: ['Menyimpan hasil operasi ALU terakhir', 'Menyimpan seluruh isi register file', 'Menghitung ulang flag setelah interupsi'],
        jelas: 'Pada tahap IF CPU belum tahu bahwa instruksi adalah cabang; BTB memberi tahu target berdasarkan alamat PC.',
      },
      {
        tanya: 'Mengapa memproses array yang sudah diurutkan dapat lebih cepat pada loop `if (data[i] >= 128) ...`?',
        benar: 'Pola cabang menjadi teratur sehingga prediktor hampir selalu benar',
        salah: ['Array terurut membuat jumlah instruksi menurun separuhnya', 'Array terurut tidak membutuhkan akses memori', 'Prediktor cabang dimatikan untuk data terurut'],
        jelas: 'Pada data terurut cabang berpola (banyak N diikuti banyak T) sehingga akurasi prediksi tinggi, sedangkan data acak ditebak salah sekitar separuhnya.',
      },
      {
        tanya: 'Kerentanan Spectre berkaitan dengan fitur CPU apa?',
        benar: 'Eksekusi spekulatif berdasarkan prediksi cabang',
        salah: ['Interupsi timer', 'Memori virtual yang tidak memakai paging', 'Instruksi aritmetika bilangan bulat'],
        jelas: 'Instruksi yang dieksekusi secara spekulatif meninggalkan jejak di cache yang dapat dibaca penyerang walaupun hasilnya dibuang.',
      },
    ],
  },

  'arsikom-superscalar': {
    intisari: 'CPU superscalar mengeluarkan beberapa instruksi per siklus; eksekusi out-of-order menjalankan instruksi saat operandnya siap, register renaming menghilangkan ketergantungan palsu, dan ROB mengomit hasil berurutan.',
    rangkuman: [
      '**ILP** = potensi instruksi independen; **IPC = 1 / CPI**.',
      '**Superscalar**: banyak unit eksekusi dan issue beberapa instruksi per siklus sehingga CPI < 1.',
      '**Out-of-order**: instruksi dijalankan saat operand siap; **ROB** mengomit berurutan agar tampak sekuensial dan exception presisi.',
      '**Register renaming** menghilangkan ketergantungan palsu WAR dan WAW; hanya RAW sejati yang tersisa.',
      'OoO digabung dengan prediksi cabang dan eksekusi spekulatif; VLIW menyerahkan penjadwalan ke kompilator. ILP terbatas sehingga industri beralih ke multicore.',
    ],
    soal: [
      {
        tanya: 'CPU superscalar memiliki CPI rata-rata 0,5. Berapa IPC-nya?',
        benar: '2',
        salah: ['0,5', '1', '4'],
        jelas: 'IPC = 1 / CPI = 1 / 0,5 = 2 instruksi per siklus.',
      },
      {
        tanya: 'Apa tujuan register renaming?',
        benar: 'Menghilangkan ketergantungan palsu WAR dan WAW dengan memakai register fisik yang berbeda',
        salah: ['Menghilangkan ketergantungan RAW sejati', 'Mengganti nama variabel di kode C', 'Memperbesar jumlah bit pada tiap register'],
        jelas: 'WAR/WAW hanya akibat nama register yang sama dipakai ulang. Dengan nama fisik baru, instruksi bisa dieksekusi tanpa saling menunggu. RAW tetap ada.',
      },
      {
        tanya: 'Apa fungsi Reorder Buffer (ROB) pada CPU out-of-order?',
        benar: 'Mengomit (retire) hasil instruksi sesuai urutan program agar keadaan yang terlihat tetap berurutan',
        salah: ['Menyimpan seluruh program dalam urutan terbalik', 'Menjalankan instruksi dalam urutan acak ke memori', 'Mengganti cache instruksi'],
        jelas: 'Eksekusi boleh tidak berurutan, tetapi komit harus berurutan supaya exception presisi dan program tampak sekuensial.',
      },
      {
        tanya: 'Mengapa eksekusi out-of-order membantu ketika sebuah `lw` mengalami cache miss?',
        benar: 'Instruksi lain yang tidak bergantung tetap berjalan sementara menunggu data',
        salah: ['Cache miss menjadi tidak pernah terjadi lagi', 'Seluruh instruksi di belakangnya dibatalkan', 'Memori menjadi lebih cepat'],
        jelas: 'Pada in-order semua instruksi di belakang tertahan; pada OoO yang siap tetap berjalan sehingga latensi memori tersembunyi sebagian.',
      },
      {
        tanya: 'Pada VLIW, siapa yang bertugas menemukan instruksi independen yang bisa dijalankan paralel?',
        benar: 'Kompilator',
        salah: ['Hardware saat program berjalan', 'Sistem operasi', 'Pengguna program'],
        jelas: 'VLIW memuat beberapa operasi independen dalam satu instruksi panjang yang disusun oleh kompilator. Pada superscalar OoO hardware yang melakukannya.',
      },
    ],
  },

  'arsikom-pipeline-hitung': {
    intisari: 'Soal pipeline dikerjakan dengan menggambar diagram, menghitung stall, lalu memakai rumus siklus = k + n − 1 + stall dan CPI = 1 + Σ(frekuensi × tingkat kejadian × penalti).',
    rangkuman: [
      'Siklus pipeline = **k + n − 1 + stall**; speedup ideal → k tetapi dibatasi tahap terlama dan stall.',
      'Tanpa forwarding: RAW berurutan = 2 stall. Dengan forwarding: ALU→ALU 0 stall, **load-use 1 stall**.',
      '**CPI = 1 + Σ(frekuensi × tingkat kejadian × penalti)** (load-use, cabang salah prediksi).',
      'Waktu CPU = IC × CPI / f. Pipeline lebih dalam menaikkan clock tetapi dapat menaikkan CPI.',
    ],
    soal: [
      {
        tanya: 'Berapa siklus untuk 50 instruksi pada pipeline 5 tahap tanpa hazard?',
        benar: '54',
        salah: ['50', '250', '55'],
        jelas: 'Siklus = 5 + (50 − 1) = 54. Tanpa pipeline akan 250 siklus.',
      },
      {
        tanya: 'Waktu tahap: IF 250, ID 150, EX 300, MEM 200, WB 100 ps. Berapa speedup pipeline (n besar) dibanding tanpa pipeline?',
        benar: 'Sekitar 3,33',
        salah: ['5', '4', '1'],
        jelas: 'Total tanpa pipeline = 1000 ps, clock pipeline = 300 ps (tahap terlama), sehingga 1000/300 ≈ 3,33.',
      },
      {
        tanya: '`lw $t0,0($s1)` diikuti `add $t2,$t0,$s2`. Berapa total siklus dengan forwarding penuh pada pipeline 5 tahap?',
        benar: '7',
        salah: ['6', '8', '5'],
        jelas: 'Ideal 6 siklus untuk 2 instruksi, ditambah 1 stall load-use = 7.',
      },
      {
        tanya: '25% instruksi lw, 40% darinya load-use (1 stall); 20% cabang, 10% salah prediksi dengan penalti 3. Berapa CPI?',
        benar: '1,16',
        salah: ['1,10', '1,06', '1,36'],
        jelas: '1 + 0,25×0,40×1 + 0,20×0,10×3 = 1 + 0,10 + 0,06 = 1,16.',
      },
      {
        tanya: 'Program 10⁹ instruksi dengan CPI 1,2 pada clock 2 GHz. Berapa waktu CPU-nya?',
        benar: '0,6 detik',
        salah: ['1,2 detik', '0,5 detik', '2,4 detik'],
        jelas: 'Waktu = IC × CPI / f = (10⁹ × 1,2) / (2 × 10⁹) = 0,6 detik.',
      },
    ],
  },
};
