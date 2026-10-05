// Bab 1 Arsikom — Pengantar & Kinerja. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'arsikom-apa-itu': {
    intisari: '**Arsitektur** adalah apa yang terlihat oleh programmer (misalnya set instruksi), sedangkan **organisasi** adalah cara hardware mewujudkannya (misalnya ada tidaknya cache atau unit perkalian khusus).',
    rangkuman: [
      '**Arsitektur** = atribut yang tampak programmer: set instruksi (ISA), ukuran data, mode pengalamatan, mekanisme I/O.',
      '**Organisasi** = unit operasional dan interkoneksinya: sinyal kontrol, antarmuka, teknologi memori, cache. Tidak terlihat oleh programmer.',
      'Satu arsitektur bisa punya banyak organisasi berbeda, sehingga satu keluarga prosesor menawarkan harga/kinerja beragam yang tetap saling kompatibel.',
      'Empat fungsi komputer: pengolahan data, penyimpanan data, perpindahan data, dan kontrol. Empat komponen: CPU, memori, I/O, interkoneksi.',
      'Komputer dipahami lewat lapisan abstraksi; **ISA** adalah kontrak antara software dan hardware.',
    ],
    soal: [
      {
        tanya: 'Manakah yang termasuk keputusan **organisasi** komputer, bukan arsitektur?',
        benar: 'Instruksi perkalian dikerjakan dengan unit perkalian khusus atau penjumlahan berulang',
        salah: ['Jumlah bit yang dipakai untuk bilangan bulat', 'Daftar instruksi yang dipahami CPU', 'Mode pengalamatan yang tersedia bagi programmer'],
        jelas: 'Programmer hanya melihat bahwa instruksi perkalian ada (arsitektur). Cara mengerjakannya di dalam chip adalah urusan organisasi.',
      },
      {
        tanya: 'Mengapa Core i3 dan Core i9 dapat menjalankan program x86-64 yang sama?',
        benar: 'Keduanya memiliki arsitektur (ISA) yang sama walaupun organisasinya berbeda',
        salah: ['Keduanya memiliki jumlah inti dan ukuran cache yang sama', 'Keduanya memiliki organisasi internal yang identik', 'Program di-compile ulang otomatis setiap kali dijalankan'],
        jelas: 'Kompatibilitas biner dijaga oleh ISA yang sama. Jumlah inti, cache, dan lebar eksekusi adalah organisasi yang boleh berbeda.',
      },
      {
        tanya: 'Empat komponen struktural utama sebuah komputer adalah ...',
        benar: 'CPU, memori utama, I/O, dan interkoneksi sistem',
        salah: ['CPU, ALU, register, dan cache', 'Keyboard, monitor, CPU, hard disk, dan printer sebagai pelengkap sistem', 'Sistem operasi, compiler, CPU, dan memori'],
        jelas: 'ALU, register, dan cache adalah bagian dari CPU/memori, sedangkan keyboard dan monitor hanyalah contoh perangkat I/O.',
      },
      {
        tanya: 'Dalam tumpukan level abstraksi, di manakah posisi ISA?',
        benar: 'Batas antara software (di atas) dan mikroarsitektur hardware (di bawah)',
        salah: ['Di level tertinggi, tepat di bawah aplikasi pengguna', 'Di level terendah, bersama transistor', 'Di dalam sistem operasi saja'],
        jelas: 'ISA adalah kontrak: software hanya perlu tahu ISA, sedangkan hardware boleh mengubah implementasinya selama kontrak terpenuhi.',
      },
    ],
  },

  'arsikom-sejarah': {
    intisari: 'Generasi komputer ditandai teknologi komponennya (tabung vakum, transistor, IC, VLSI). Hukum Moore mendorong pertumbuhan transistor, dan berakhirnya Dennard scaling membawa kita ke era multicore.',
    rangkuman: [
      'Generasi 1 tabung vakum (ENIAC, 1946), generasi 2 transistor, generasi 3 sirkuit terpadu (IC, IBM System/360), generasi 4 LSI/VLSI dan mikroprosesor (Intel 4004, 1971).',
      'ENIAC harus dikabel ulang untuk berganti program, dan masalah itu dijawab konsep **stored-program**.',
      '**IBM System/360** (1964) memperkenalkan konsep keluarga: satu arsitektur dengan banyak model.',
      '**Hukum Moore**: jumlah transistor per chip berlipat dua kira-kira tiap dua tahun. Ini pengamatan empiris, bukan hukum alam.',
      'Sekitar 2005 Dennard scaling berakhir: frekuensi clock mentok karena daya dan panas, sehingga industri beralih ke **banyak inti**.',
    ],
    soal: [
      {
        tanya: 'Apa kelemahan utama ENIAC yang kemudian dijawab oleh konsep stored-program?',
        benar: 'Memprogramnya berarti menyambung ulang kabel dan saklar secara manual',
        salah: ['Ia hanya bisa menyimpan data dalam bilangan biner', 'Ia tidak dapat melakukan perhitungan aritmetika', 'Ia tidak memiliki unit input sama sekali'],
        jelas: 'ENIAC tidak menyimpan program di memori. Setiap ganti program diperlukan pengabelan ulang yang bisa memakan hari. Stored-program menyimpan program sebagai data.',
      },
      {
        tanya: 'Teknologi apa yang menandai generasi ketiga komputer?',
        benar: 'Sirkuit terpadu (Integrated Circuit)',
        salah: ['Tabung vakum', 'Transistor diskrit', 'Memori inti magnetik'],
        jelas: 'IC menaruh banyak transistor pada satu keping silikon. Tabung vakum adalah generasi 1 dan transistor diskrit generasi 2.',
      },
      {
        tanya: 'Sebuah chip memiliki 4 miliar transistor. Menurut Hukum Moore (berlipat dua tiap 2 tahun), kira-kira berapa jumlahnya 6 tahun kemudian?',
        benar: '32 miliar',
        salah: ['8 miliar', '12 miliar', '16 miliar'],
        jelas: '6 tahun = 3 kali penggandaan, sehingga 4 × 2³ = 32 miliar transistor.',
      },
      {
        tanya: 'Mengapa produsen chip berhenti menaikkan frekuensi clock dan beralih ke banyak inti?',
        benar: 'Daya dan panas naik terlalu cepat dengan frekuensi (dinding daya)',
        salah: ['Transistor tidak bisa dibuat lebih kecil lagi sejak 1980', 'Sistem operasi tidak mendukung clock di atas 1 GHz', 'Memori tidak bisa bekerja pada frekuensi apa pun'],
        jelas: 'Daya dinamis kira-kira ∝ V² × f. Setelah Dennard scaling berakhir, menaikkan frekuensi membuat chip terlalu panas, jadi menambah inti menjadi jalan keluarnya.',
      },
    ],
  },

  'arsikom-von-neumann': {
    intisari: 'Arsitektur von Neumann menyimpan instruksi dan data di memori yang sama (fleksibel tetapi punya bottleneck), sedangkan Harvard memisahkan keduanya. Prosesor modern memakai gabungan: modified Harvard.',
    rangkuman: [
      '**von Neumann**: instruksi dan data berbagi satu memori dan satu bus. Prinsip utamanya stored-program: program adalah data.',
      '**von Neumann bottleneck**: fetch instruksi dan akses data berebut satu jalur, sehingga CPU sering menunggu memori. Cache adalah solusi utamanya.',
      '**Harvard**: memori dan bus instruksi terpisah dari data, sehingga bisa diakses serentak. Umum di mikrokontroler dan DSP.',
      'Prosesor modern adalah **modified Harvard**: RAM bersama (von Neumann), tetapi cache L1 dipisah menjadi I-cache dan D-cache.',
      'Karena program adalah data, kode bisa ditimpa. Ini dasar serangan *buffer overflow*.',
    ],
    soal: [
      {
        tanya: 'Ciri khas arsitektur von Neumann adalah ...',
        benar: 'Instruksi dan data disimpan dalam memori yang sama',
        salah: ['Instruksi dan data memiliki memori dan bus terpisah', 'Program hanya bisa diubah dengan mengganti kabel', 'CPU tidak memiliki register sama sekali'],
        jelas: 'Konsep stored-program menyimpan instruksi dan data dalam memori yang sama. Memori terpisah adalah ciri Harvard.',
      },
      {
        tanya: 'Apa yang dimaksud dengan von Neumann bottleneck?',
        benar: 'Instruksi dan data memakai jalur yang sama ke memori sehingga CPU sering menunggu',
        salah: ['CPU terlalu lambat dibandingkan memori', 'Memori terlalu kecil untuk menyimpan program', 'Jumlah register di CPU terlalu sedikit'],
        jelas: 'Satu jalur bersama harus melayani fetch instruksi sekaligus akses data, sehingga keduanya tidak bisa berjalan serentak. Kecepatan CPU yang jauh melampaui memori memperparahnya.',
      },
      {
        tanya: 'Bagaimana cache L1 pada prosesor modern disusun?',
        benar: 'Dipisah menjadi cache instruksi dan cache data (gaya Harvard)',
        salah: ['Satu cache gabungan untuk instruksi dan data', 'Hanya menyimpan instruksi, sedangkan data langsung ke RAM', 'Hanya menyimpan data, sedangkan instruksi langsung ke RAM'],
        jelas: 'Pemisahan I-cache dan D-cache memungkinkan fetch instruksi dan akses data berlangsung bersamaan. Di level RAM, ruang alamat tetap bersama.',
      },
      {
        tanya: 'Arsitektur mana yang lebih cocok untuk mikrokontroler kecil yang programnya tetap di memori flash?',
        benar: 'Harvard, karena program dan data terpisah serta bisa diakses bersamaan',
        salah: ['von Neumann, karena program harus bisa ditimpa data', 'Tidak ada yang cocok, karena mikrokontroler tidak punya memori', 'Harvard, karena hanya Harvard yang memiliki register'],
        jelas: 'Banyak mikrokontroler (AVR, PIC) memakai Harvard: program di flash, data di SRAM. Register ada di kedua arsitektur.',
      },
    ],
  },

  'arsikom-kinerja': {
    intisari: 'Waktu CPU = IC × CPI × T. Karena kinerja bergantung pada tiga faktor sekaligus, frekuensi clock saja tidak cukup untuk menilai kecepatan.',
    rangkuman: [
      '**Latensi** = lama satu tugas selesai, **throughput** = jumlah tugas per satuan waktu. Kinerja = 1 / waktu eksekusi.',
      '**Waktu CPU = IC × CPI × T = (IC × CPI) / f**. IC: jumlah instruksi, CPI: siklus per instruksi, T: periode clock, f = 1/T.',
      'IC dipengaruhi algoritma, compiler, dan ISA. CPI dipengaruhi organisasi hardware dan campuran instruksi. T dipengaruhi teknologi.',
      'CPI rata-rata = Σ(CPI jenis × fraksi jenis). Clock tinggi dengan CPI tinggi bisa sama lambatnya dengan clock rendah.',
      'MIPS dan FLOPS tidak adil antar-ISA. Gunakan **benchmark** program nyata seperti SPEC.',
    ],
    soal: [
      {
        tanya: 'Program menjalankan 4 × 10⁹ instruksi dengan CPI 2 pada CPU 4 GHz. Berapa waktu CPU-nya?',
        benar: '2 detik',
        salah: ['0,5 detik', '1 detik', '8 detik'],
        jelas: 'Waktu = (IC × CPI) / f = (4×10⁹ × 2) / (4×10⁹) = 2 detik.',
      },
      {
        tanya: 'Mesin A (2 GHz, CPI 1,0) dan mesin B (4 GHz, CPI 3,0) menjalankan program yang sama dengan ISA yang sama. Mesin mana yang lebih cepat?',
        benar: 'Mesin A, karena waktunya 0,5 ns per instruksi dibanding 0,75 ns',
        salah: ['Mesin B, karena frekuensi clock-nya lebih tinggi', 'Keduanya sama cepat', 'Tidak bisa ditentukan sama sekali'],
        jelas: 'Waktu per instruksi = CPI / f. A: 1,0/2 GHz = 0,5 ns. B: 3,0/4 GHz = 0,75 ns. A lebih cepat meski clock-nya lebih rendah.',
      },
      {
        tanya: 'Campuran instruksi: 60% ALU (CPI 1), 25% load/store (CPI 4), 15% cabang (CPI 2). Berapa CPI rata-ratanya?',
        benar: '1,9',
        salah: ['2,3', '2,33', '1,5'],
        jelas: 'CPI = 1×0,6 + 4×0,25 + 2×0,15 = 0,6 + 1,0 + 0,3 = 1,9.',
      },
      {
        tanya: 'Mengapa MIPS tidak cocok untuk membandingkan prosesor dengan ISA berbeda?',
        benar: 'Satu instruksi di ISA tertentu bisa setara beberapa instruksi di ISA lain',
        salah: ['MIPS hanya bisa dihitung untuk prosesor dengan satu inti', 'MIPS tidak dipengaruhi frekuensi clock', 'MIPS selalu menghasilkan angka yang sama untuk semua program'],
        jelas: 'Instruksi tidak sebanding antar-ISA. Mesin dengan MIPS lebih tinggi pun bisa membutuhkan lebih banyak instruksi untuk tugas yang sama dan selesai lebih lambat.',
      },
    ],
  },

  'arsikom-amdahl': {
    intisari: 'Hukum Amdahl: bagian program yang tidak bisa dipercepat membatasi percepatan keseluruhan, sehingga yang paling menguntungkan adalah mempercepat bagian yang paling dominan.',
    rangkuman: [
      '**Speedup = 1 / ((1 − f) + f / s)**, dengan f = fraksi waktu yang dipercepat dan s = faktor percepatannya.',
      'Batas maksimum speedup (s → ∞) adalah **1 / (1 − f)**. Bagian yang tidak bisa dipercepat menjadi batasnya.',
      'Mempercepat bagian dominan sedikit sering mengalahkan mempercepat bagian kecil berkali-kali lipat.',
      'Menambah inti memberi manfaat makin kecil bila masih ada bagian serial. **Gustafson** melihatnya dengan ukuran masalah yang ikut membesar.',
      'Pedoman desain: percepat kasus umum, manfaatkan paralelisme dan lokalitas, hirarki memori, serta efisiensi energi.',
    ],
    soal: [
      {
        tanya: 'Sebuah bagian yang memakai 80% waktu dipercepat 4 kali. Berapa speedup keseluruhan?',
        benar: '2,5',
        salah: ['4', '3,2', '5'],
        jelas: 'Speedup = 1 / (0,2 + 0,8/4) = 1 / 0,4 = 2,5.',
      },
      {
        tanya: 'Jika 90% program bisa diparalelkan, berapa batas speedup maksimum berapapun jumlah prosesornya?',
        benar: '10',
        salah: ['9', '90', 'Tidak ada batas'],
        jelas: 'Batas maksimum = 1 / (1 − f) = 1 / 0,1 = 10. Sisa 10% bagian serial menjadi penghalang.',
      },
      {
        tanya: 'Program memakai 60% waktu di fungsi X dan 40% di fungsi Y. Mana yang menghasilkan speedup lebih besar?',
        benar: 'Mempercepat X sebesar 2× (speedup ≈ 1,43) dibanding Y sebesar 3× (≈ 1,36)',
        salah: ['Mempercepat Y sebesar 3×, karena angkanya lebih besar', 'Keduanya persis sama', 'Tidak ada yang berpengaruh'],
        jelas: 'X 2×: 1/(0,4 + 0,6/2) = 1/0,7 ≈ 1,43. Y 3×: 1/(0,6 + 0,4/3) = 1/0,733 ≈ 1,36. Bagian dominan menang meski percepatannya lebih kecil.',
      },
      {
        tanya: 'Apa inti perbedaan pandangan Gustafson dibanding Amdahl?',
        benar: 'Gustafson mengasumsikan ukuran masalah ikut membesar bersama jumlah prosesor',
        salah: ['Gustafson menganggap semua program 100% paralel', 'Gustafson menolak bahwa ada bagian serial', 'Gustafson hanya berlaku untuk prosesor tunggal'],
        jelas: 'Amdahl memakai ukuran masalah tetap. Gustafson memperhitungkan bahwa komputer yang lebih besar dipakai untuk masalah yang lebih besar, sehingga bagian serial relatif mengecil.',
      },
    ],
  },
};
