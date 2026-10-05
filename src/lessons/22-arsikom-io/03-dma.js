export default {
  id: 'arsikom-dma',
  judul: 'DMA: Direct Memory Access',
  tipe: 'teks',
  xp: 20,
  materi: `
# DMA: Direct Memory Access 🚚

Bayangkan CPU sebagai direktur perusahaan. Memindahkan kardus satu per satu dari truk ke gudang jelas bukan pekerjaan direktur: lebih baik direktur memberi instruksi sekali ("pindahkan 100 kardus dari truk ke gudang B") dan staf yang mengerjakannya. **DMA** adalah staf itu.

## Konsep

**DMA** (*Direct Memory Access*) memungkinkan pengontrol khusus memindahkan data **langsung antara perangkat I/O dan memori utama** tanpa tiap byte melewati register CPU.

~~~
              Tanpa DMA                                  Dengan DMA

  Perangkat ─► CPU ─► Memori                  Perangkat ─────────────► Memori
              (tiap byte lewat CPU)                  (DMA controller yang memindahkan)
~~~

## Komponen pengontrol DMA

Pengontrol DMA punya beberapa register yang diisi CPU:

| Register | Isi |
| --- | --- |
| **Address register** | Alamat memori awal tujuan/sumber transfer |
| **Count register** | Jumlah byte/word yang akan dipindahkan |
| **Control register** | Arah (baca/tulis), mode transfer, pengaktifan interupsi |
| **Status register** | Selesai? Galat? |

Pengontrol DMA bertindak sebagai **bus master**: ia dapat mengendalikan bus alamat, data, dan kontrol seperti halnya CPU.

## Langkah-langkah transfer DMA

Contoh: membaca satu blok 4 KiB dari disk ke memori.

1. **CPU memprogram DMA**: mengisi alamat memori tujuan, jumlah byte (4096), dan arah (perangkat → memori).
2. CPU memberi perintah ke perangkat disk, lalu **melanjutkan pekerjaan lain** (misalnya menjalankan proses lain).
3. Saat data siap, perangkat meminta layanan dari DMA (\`DREQ\`).
4. DMA **meminta bus** dari CPU (\`HOLD\`/\`Bus Request\`); setelah diberi (\`Bus Grant\`), ia menulis data ke alamat memori, menaikkan register alamat, dan menurunkan register hitungan.
5. Langkah 3–4 diulang sampai **hitungan = 0**.
6. DMA mengirim **satu interupsi** ke CPU: "transfer selesai". ISR memeriksa status dan membangunkan proses yang menunggu.

CPU hanya terlibat di **awal** (langkah 1–2) dan **akhir** (langkah 6): dua kali, bukan 4096 kali.

## Mencuri siklus vs burst

DMA dan CPU berbagi bus memori. Bagaimana pembagiannya?

| Mode | Cara kerja | Dampak |
| --- | --- | --- |
| **Burst (block)** | DMA memegang bus hingga seluruh blok selesai | Cepat untuk DMA, tetapi CPU terkunci dari memori selama blok |
| **Cycle stealing** | DMA "mencuri" satu siklus bus di sela-sela CPU, per word | CPU melambat sedikit tetapi tidak terkunci lama |
| **Transparent** | DMA memakai bus **hanya saat CPU tidak memakainya** | Tidak mengganggu CPU, tetapi lebih lambat dan lebih sulit |

Pada sistem modern dengan cache, CPU sering bekerja dari cache sehingga jarang memerlukan bus, dan DMA hampir tidak mengganggu.

## Kehadiran DMA dan cache

Ada masalah rumit: **koherensi**. Contoh:

- DMA menulis data baru dari disk ke memori alamat X. Tetapi **cache CPU** masih menyimpan nilai lama untuk X → CPU membaca data basi!
- Sebaliknya, CPU menulis X (write-back) sehingga nilai terbaru hanya ada di cache, lalu DMA membaca X dari memori → mengirim nilai lama keluar.

Solusi:

- **Hardware koherensi**: pengontrol memori/cache mengintip (*snoop*) transaksi DMA dan membatalkan/menulis balik baris cache yang terkait. (Umum di CPU modern.)
- **Perangkat lunak**: driver menandai buffer DMA sebagai *non-cacheable*, atau melakukan **flush/invalidate** cache secara eksplisit sebelum/sesudah transfer.

Inilah salah satu alasan penulisan driver itu sulit.

## DMA dan memori virtual

DMA memakai **alamat fisik**, tetapi program memakai alamat virtual. Buffer yang dipakai DMA harus:

- Berada di halaman yang **dikunci (pinned)** di memori, karena OS tidak boleh memindahkan atau menukarnya ke disk selama transfer.
- Dapat dialamati secara fisik. Perangkat modern memakai **IOMMU** (terjemahan alamat untuk perangkat) sehingga buffer virtual yang tidak berurutan secara fisik tetap bisa dipakai lewat **scatter-gather DMA**: satu transfer logis dipecah menjadi beberapa potongan fisik yang terdaftar dalam tabel deskriptor.

IOMMU juga melindungi: perangkat jahat atau berbug tidak bisa menulis ke memori sembarang tempat.

## Penerapan modern

DMA ada di mana-mana:

- **Disk/SSD**: NVMe memindahkan data ke memori melalui DMA (bus-mastering PCIe).
- **Kartu jaringan**: paket diterima langsung ke buffer di RAM, CPU diberi tahu lewat interupsi atau polling.
- **GPU dan kartu suara**.
- **Antar-memori**: *memcpy* tertentu dapat dipercepat oleh mesin DMA.

Bahkan CPU kecil (mikrokontroler) punya DMA untuk membaca sensor tanpa menggerakkan CPU.

## Contoh hitungan: manfaat DMA

Disk mentransfer 4 KiB dalam satu blok. Salin per word 4 byte oleh CPU = 1024 word. Misal biaya salin per word 20 siklus: 1024 × 20 = **20.480 siklus** CPU. Dengan DMA: persiapan 500 siklus + interupsi akhir 500 = **1.000 siklus**: **20 kali lebih hemat**, dan selama transfer CPU boleh mengerjakan hal lain.

## Rangkuman

- **DMA** memindahkan blok data langsung antara perangkat dan memori tanpa melewati CPU; CPU hanya mengatur dan menerima satu interupsi di akhir.
- Pengontrol DMA memiliki register alamat, hitungan, kontrol, dan status, serta menjadi **bus master**.
- Langkah: CPU memprogram DMA → perangkat meminta → DMA meminta bus dan menulis data → ulang sampai hitungan 0 → interupsi selesai.
- Mode: **burst**, **cycle stealing**, **transparent**.
- Masalah **koherensi cache** diatasi snooping hardware atau flush/invalidate oleh driver; DMA memakai alamat fisik, halaman di-pin, **IOMMU** dan **scatter-gather** untuk memori virtual.
`,
};
