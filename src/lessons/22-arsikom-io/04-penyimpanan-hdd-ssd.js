export default {
  id: 'arsikom-hdd-ssd',
  judul: 'Penyimpanan: Hard Disk (HDD) dan SSD',
  tipe: 'teks',
  xp: 25,
  materi: `
# Penyimpanan: Hard Disk (HDD) dan SSD 💽

RAM hilang saat listrik mati dan kapasitasnya terbatas. Untuk menyimpan data **permanen** dan **besar** dibutuhkan penyimpanan sekunder. Dua teknologi utamanya sangat berbeda cara kerja dan karakteristiknya: **HDD** (mekanis, magnetik) dan **SSD** (elektronik, flash).

## Hard Disk Drive (HDD)

### Struktur fisik

~~~
        Piringan (platter)       Lengan + kepala baca/tulis
      ┌──────────────────┐            ╱
      │  ╭────────────╮  │   ────────╱▶ kepala melayang
      │  │  track     │  │             beberapa nanometer
      │  │  ╭──────╮  │  │             di atas permukaan
      │  │  │ pusat│  │  │
      │  │  ╰──────╯  │  │
      │  ╰────────────╯  │
      └──────────────────┘
~~~

- Satu atau lebih **piringan** magnetik berputar (5400 atau 7200 RPM, ada 10.000/15.000 untuk server).
- Data disimpan sebagai pola magnet pada lingkaran konsentris yang disebut **track**, dan tiap track dibagi menjadi **sektor** (512 byte atau 4 KiB).
- **Silinder**: kumpulan track yang sama posisinya di semua piringan.
- **Kepala baca/tulis** di ujung **lengan** bergerak ke track yang dituju.

### Waktu akses HDD

Untuk membaca sebuah sektor, ada beberapa tahap:

| Komponen | Arti | Nilai khas |
| --- | --- | --- |
| **Seek time** | Memindahkan lengan ke track yang benar | rata-rata 3–12 ms |
| **Rotational latency** | Menunggu sektor yang dituju berputar ke bawah kepala | rata-rata **setengah** putaran |
| **Transfer time** | Membaca data sebenarnya | ukuran / laju transfer |
| **Controller overhead** | Waktu pengontrol disk | ±0,1–1 ms |

~~~
Waktu akses = seek + rotasi + transfer + controller
~~~

**Rotational latency rata-rata** = ½ × waktu satu putaran:

~~~
7200 RPM:  satu putaran = 60 detik / 7200 = 8,33 ms
           rata-rata    = 8,33 / 2         ≈ 4,17 ms
5400 RPM:  satu putaran = 11,11 ms → rata-rata ≈ 5,56 ms
~~~

**Contoh:** baca 4 KiB secara acak pada HDD 7200 RPM, seek rata-rata 9 ms, laju transfer 100 MB/s, controller 0,2 ms.

~~~
Transfer = 4096 byte / 100.000.000 byte/s ≈ 0,04 ms
Total    = 9 + 4,17 + 0,04 + 0,2 ≈ 13,4 ms
~~~

Hanya **0,04 ms dari 13,4 ms** untuk benar-benar memindahkan data; sisanya menunggu gerakan mekanis. Akibatnya HDD hanya sanggup sekitar **75–100 operasi acak per detik** (IOPS ≈ 1 / 13,4 ms ≈ 75).

### Akses berurutan vs acak

Bila data dibaca **berurutan** (tanpa pindah track), seek dan rotasi hanya terjadi sekali di awal. HDD bisa mencapai 100–250 MB/s. Itulah kenapa sistem berkas berusaha menempatkan data berkas pada sektor berdekatan, dan mengapa **defragmentasi** dulu penting pada HDD.

## Solid-State Drive (SSD)

SSD menyimpan data di **chip NAND flash** (Pelajaran SRAM/DRAM/Flash): tanpa bagian bergerak.

### Komponen

- **Chip NAND flash**: sel yang menyimpan muatan (1–4 bit per sel).
- **Pengendali (controller)**: prosesor di dalam SSD yang mengatur seluruh operasi.
- **DRAM/cache** kecil untuk tabel pemetaan dan buffer.
- **Antarmuka**: SATA (maks ≈ 600 MB/s) atau **NVMe lewat PCIe** (3–14 GB/s).

### Flash Translation Layer (FTL)

Flash tidak bisa menimpa data langsung: sel harus **dihapus per blok** (ratusan KiB) sebelum ditulis ulang per **halaman** (4–16 KiB). Pengendali menyembunyikan ini lewat **FTL**:

- **Pemetaan logis → fisik**: sistem operasi menulis ke alamat logis X; FTL menaruhnya di halaman fisik **kosong baru** dan menandai halaman lama "basi".
- **Garbage collection**: menggabung blok berisi campuran halaman sah dan basi, lalu menghapusnya agar bisa dipakai lagi.
- **Wear leveling**: meratakan penghapusan ke semua blok karena tiap sel hanya tahan ribuan siklus hapus (TLC ±1.000–3.000).
- **TRIM**: OS memberi tahu SSD blok mana yang sudah tidak dipakai berkas.
- **Over-provisioning**: sebagian kapasitas dicadangkan untuk ruang kerja.

Konsekuensinya: kecepatan tulis SSD **turun saat hampir penuh** dan satu penulisan logis bisa menyebabkan beberapa penulisan fisik (*write amplification*).

### Karakteristik

| Metrik | HDD 7200 RPM | SSD SATA | SSD NVMe (PCIe 4.0) |
| --- | --- | --- | --- |
| Latensi akses acak | ±10 ms | ±0,1 ms | ±0,02–0,1 ms |
| Baca berurutan | 100–250 MB/s | ±550 MB/s | 3–7 GB/s |
| IOPS acak (4 KiB) | ±75–150 | ±50.000–100.000 | 500.000–1.000.000+ |
| Bagian bergerak | Ya | Tidak | Tidak |
| Tahan guncangan | Rendah | Tinggi | Tinggi |
| Harga per GB | Terendah | Menengah | Tertinggi (menurun) |
| Daya tahan tulis | Praktis tak terbatas | Terbatas (TBW) | Terbatas (TBW) |
| Konsumsi daya | Lebih tinggi | Rendah | Rendah–sedang (puncak tinggi) |

**Rasio kunci**: akses acak SSD ±**100–1000× lebih cepat** daripada HDD, sedangkan baca berurutan hanya 3–30× lebih cepat. Lonjakan terbesar ada pada **latensi akses acak**, hal yang paling terasa pada booting dan membuka aplikasi.

**TBW** (*Terabytes Written*): total data yang dijamin dapat ditulis sebelum sel aus, misalnya 600 TBW untuk SSD 1 TB, yang bagi pemakai biasa (±20 GB/hari) setara puluhan tahun.

## Menyimpan di mana? Posisi dalam hierarki

~~~
Register  ──  Cache  ──  DRAM   │   SSD (NVMe)  ──  SSD SATA  ──  HDD  ──  Pita/Cloud
(ns)          (ns)       (100ns)│   (10–100 µs)     (100 µs)     (10 ms)   (detik+)
                                │
                  volatil       │   nonvolatil (permanen)
~~~

Celah kecepatan antara DRAM (100 ns) dan SSD (50 µs) masih sekitar 500 kali. Teknologi baru seperti **memori persisten** (mis. 3D XPoint/Optane, kini dihentikan) mencoba mengisinya.

## Efisiensi: Amdahl pada I/O

Mempercepat CPU 10× tidak membuat komputer 10× lebih cepat bila waktu terbesar dihabiskan menunggu disk (Hukum Amdahl, Bab 1). Itulah mengapa mengganti HDD dengan SSD adalah peningkatan kinerja paling terasa pada komputer lama: bagian yang dipercepat (I/O) adalah bagian dominan.

## Rangkuman

- **HDD**: piringan berputar, track/sektor, kepala dan lengan mekanis. Waktu akses = **seek + rotational latency + transfer + controller**. Rotational latency rata-rata = ½ putaran (7200 RPM ≈ 4,17 ms). Akses acak 4 KiB ≈ 13 ms (±75 IOPS), jauh lebih lambat daripada baca berurutan.
- **SSD**: NAND flash tanpa bagian bergerak; pengendali dengan **FTL** (pemetaan, garbage collection, wear leveling, TRIM). Hapus per blok, tulis per halaman; daya tahan tulis terbatas (TBW).
- SSD ±100–1000× lebih cepat pada akses acak, 3–30× pada berurutan; NVMe lewat PCIe jauh melampaui SATA.
- Akses berurutan jauh lebih efisien daripada acak pada HDD; I/O sering menjadi pembatas kinerja sistem keseluruhan (Amdahl).
`,
};
