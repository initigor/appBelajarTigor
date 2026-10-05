export default {
  id: 'arsikom-bus-lanjut',
  judul: 'Interkoneksi: Bus, Arbitrasi, dan Sambungan Serial Modern',
  tipe: 'teks',
  xp: 20,
  materi: `
# Interkoneksi: Bus, Arbitrasi, dan Sambungan Serial Modern 🔗

Di Bab 5 kamu mengenal bus alamat, data, dan kontrol sebagai kabel bersama antara CPU, memori, dan I/O. Di pelajaran ini kita memperdalam: bagaimana bus bersama diatur, kenapa desain lama mentok, dan apa yang menggantikannya (PCIe, USB).

## Desain bus: pilihan-pilihan penting

| Aspek | Pilihan | Dampak |
| --- | --- | --- |
| **Lebar** | Lebar bus data/alamat | Makin lebar, makin banyak bit per transfer, tetapi makin banyak kabel/pin |
| **Sinkron vs asinkron** | Memakai clock bersama atau handshake | **Sinkron**: sederhana dan cepat, tetapi semua perangkat harus mengikuti clock. **Asinkron**: perangkat lambat dan cepat bisa bercampur, rumit |
| **Multiplexed vs terpisah** | Alamat dan data berbagi jalur atau terpisah | Multiplexed hemat jalur tetapi lebih lambat |
| **Jenis transfer** | Single, **burst** (alamat sekali, beberapa data berturut) | Burst memanfaatkan lokalitas dan menaikkan throughput |
| **Arbitrasi** | Siapa boleh memakai bus | Lihat di bawah |

### Sinkron vs asinkron

- **Sinkron**: setiap transfer terjadi pada tepi clock tertentu. Bus memori dan PCIe bersifat sinkron.
- **Asinkron**: pengirim dan penerima berjabat tangan (*handshake*) dengan sinyal \`Request\` dan \`Acknowledge\`; tidak ada clock bersama. Cocok untuk perangkat dengan kecepatan sangat beragam.

## Arbitrasi bus

Hanya satu **master** boleh mengendalikan bus bersama pada satu waktu. Bila CPU dan pengontrol DMA ingin memakainya bersamaan, harus ada aturan.

| Skema | Cara kerja | Catatan |
| --- | --- | --- |
| **Daisy chain** | Sinyal "grant" diteruskan berantai dari perangkat ke perangkat. Perangkat dekat arbiter berprioritas tinggi | Sederhana; perangkat paling ujung bisa **kelaparan** (*starvation*) |
| **Arbiter terpusat paralel** | Tiap perangkat punya garis request/grant sendiri ke arbiter pusat | Prioritas fleksibel; banyak kabel |
| **Terdistribusi** | Perangkat saling bernegosiasi sendiri tanpa arbiter pusat | Tidak ada titik kegagalan tunggal; kompleks |

Kriteria arbitrasi yang baik: **adil** (tidak ada yang kelaparan) dan **prioritas** (perangkat kritis, misalnya DMA disk, dilayani cepat).

## Hierarki bus

Satu bus untuk semua tidak bisa efisien: perangkat cepat (memori) dan lambat (keyboard) saling menghambat, dan bus panjang membatasi clock. Maka dibuat **hierarki**:

~~~
 +--------+      bus memori (sangat cepat)       +---------+
 |  CPU   |◄═══════════════════════════════════►|   RAM   |
 +---┬----+
     │  PCIe (cepat, point-to-point)
 +---▼----+──► GPU
 |  Chipset|──► NVMe SSD
 |  (PCH)  |──► USB, SATA, audio, jaringan (lebih lambat)
 +---------+
~~~

Pada PC lama, "northbridge" (dekat CPU, cepat) dan "southbridge" (periferal) adalah chip terpisah. Sekarang northbridge dilebur ke **dalam CPU** (pengontrol memori dan jalur PCIe ada di chip CPU), dan sisanya ditangani **PCH** (*Platform Controller Hub*).

## Mengapa bus paralel bersama mentok?

Bus paralel lama (PCI, ISA) mengirim banyak bit sekaligus pada banyak kabel. Pada frekuensi tinggi muncul masalah:

- **Clock skew**: sinyal clock dan data tiba pada waktu sedikit berbeda di tiap kabel; makin cepat clock, makin kecil toleransinya.
- **Crosstalk**: kabel berdekatan saling mengganggu.
- **Bus bersama**: makin banyak perangkat, makin tinggi beban listrik dan makin rendah frekuensi maksimum.

Solusinya terasa tidak intuitif: **serial lebih cepat daripada paralel**. Kirim bit satu per satu pada **satu pasang kabel diferensial** dengan clock tertanam di dalam data, tetapi pada laju sangat tinggi (puluhan Gbps per pasang). Untuk bandwidth lebih besar, **tambah jumlah pasangan (lane)**, bukan frekuensi.

## PCI Express (PCIe)

**PCIe** adalah sambungan **point-to-point serial**: tiap perangkat punya jalur sendiri ke *root complex* (CPU/chipset), bukan berbagi bus. Satu **lane** terdiri dari dua pasang kabel (satu arah kirim, satu arah terima, dapat bersamaan, *full duplex*). Bandwidth dinaikkan dengan menggabung lane: x1, x4, x8, x16.

| Generasi | Laju per lane | Bandwidth per lane (satu arah) | x16 (satu arah) |
| --- | --- | --- | --- |
| PCIe 3.0 | 8 GT/s | ±0,98 GB/s | ±15,8 GB/s |
| PCIe 4.0 | 16 GT/s | ±1,97 GB/s | ±31,5 GB/s |
| PCIe 5.0 | 32 GT/s | ±3,94 GB/s | ±63 GB/s |

(GT/s = giga-transfer per detik; PCIe 3.0 ke atas memakai penyandian 128b/130b sehingga hampir tidak ada pemborosan.)

Pemakaian: kartu grafis (x16), SSD **NVMe** (x4), kartu jaringan cepat.

## USB (Universal Serial Bus)

Bus serial untuk periferal eksternal dengan topologi **pohon** (hub), mendukung *hot-plug* dan menyalurkan daya.

| Versi | Kecepatan maksimum teoretis |
| --- | --- |
| USB 2.0 | 480 Mbit/s |
| USB 3.0 / 3.2 Gen 1 | 5 Gbit/s |
| USB 3.1 / 3.2 Gen 2 | 10 Gbit/s |
| USB4 | 40 Gbit/s |

Catatan satuan: Gbit/s dibagi 8 menjadi GB/s; 5 Gbit/s ≈ 0,5 GB/s setelah overhead penyandian.

## Penyimpanan dan jaringan

| Antarmuka | Kegunaan | Kecepatan khas |
| --- | --- | --- |
| **SATA III** | HDD dan SSD 2,5" | 6 Gbit/s ≈ 600 MB/s |
| **NVMe (PCIe 4.0 x4)** | SSD cepat | ±7 GB/s |
| **Ethernet** | Jaringan | 1 / 2,5 / 10 Gbit/s |

## Rangkuman

- Pilihan desain bus: lebar, **sinkron** (clock bersama) vs **asinkron** (handshake), multiplexed vs terpisah, transfer burst, dan **arbitrasi**.
- Arbitrasi: **daisy chain** (sederhana, rawan starvation), **terpusat paralel**, **terdistribusi**.
- Sistem memakai **hierarki bus**: memori cepat dekat CPU, periferal lebih lambat lewat chipset/PCH.
- Bus paralel bersama mentok karena clock skew, crosstalk, dan beban; **serial point-to-point** (PCIe, USB, SATA) menang dengan menambah **lane**.
- PCIe 4.0 x16 ≈ 31,5 GB/s per arah; NVMe memakai PCIe x4; USB4 hingga 40 Gbit/s.
`,
};
