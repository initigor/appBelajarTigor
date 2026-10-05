export default {
  id: 'arsikom-bus-dasar',
  judul: 'Bus Sistem dan Cara CPU Mengakses Memori',
  tipe: 'teks',
  xp: 20,
  materi: `
# Bus Sistem dan Cara CPU Mengakses Memori 🚌

CPU, memori, dan perangkat I/O adalah komponen terpisah. Mereka dihubungkan oleh **bus**: kumpulan kabel (atau jalur pada papan sirkuit) yang dipakai bersama untuk memindahkan sinyal. Pelajaran ini membahas bus pada level dasar. Bus modern (PCIe, USB, bus memori) dibahas di Bab 9.

## Tiga jenis bus

~~~
        +-------+           +----------+          +--------+
        |  CPU  |           |  MEMORI  |          |  I/O   |
        +---+---+           +----+-----+          +---+----+
            |    BUS ALAMAT (satu arah, CPU → lainnya)   |
            |============================================|
            |    BUS DATA   (dua arah)                   |
            |============================================|
            |    BUS KONTROL (baca/tulis, clock, ...)    |
            |============================================|
~~~

| Bus | Arah | Fungsi | Lebarnya menentukan |
| --- | --- | --- | --- |
| **Bus alamat** | CPU → memori/I/O | Menyatakan **lokasi** yang diakses | Ukuran ruang alamat: n jalur → **2ⁿ** lokasi |
| **Bus data** | Dua arah | Membawa **isi** yang dibaca atau ditulis | Berapa bit dipindahkan per transfer |
| **Bus kontrol** | Dua arah | Menyatakan **jenis** operasi dan sinkronisasi | — |

Sinyal pada bus kontrol antara lain: **Memory Read**, **Memory Write**, **I/O Read/Write**, **clock**, **interrupt request**, **bus request/grant** (untuk perangkat yang ingin memakai bus), dan **ready/wait** (memori yang lambat meminta CPU menunggu).

### Lebar bus dan kapasitas

- Bus alamat 16 jalur → 2¹⁶ = 65.536 alamat = **64 KiB** (CPU 8 bit klasik seperti Z80 dan 6502).
- Bus alamat 20 jalur → 2²⁰ = **1 MiB** (Intel 8086).
- Bus alamat 32 jalur → **4 GiB** (batas sistem 32 bit).
- Bus data lebar: tiap transfer membawa lebih banyak byte. Bus data 64 bit memindahkan 8 byte sekali jalan.

### Throughput (bandwidth) bus

~~~
Bandwidth = lebar bus data (byte) × jumlah transfer per detik
~~~

Contoh: memori DDR4-3200 dengan bus data 64 bit (8 byte) melakukan 3,2 miliar transfer per detik per kanal:

~~~
8 byte × 3,2 × 10⁹ = 25,6 × 10⁹ byte/s = 25,6 GB/s per kanal
~~~

Dua kanal (*dual channel*) menggandakannya menjadi 51,2 GB/s.

## Siklus baca memori

Contoh CPU membaca satu word dari alamat A:

1. CPU menaruh alamat A di **MAR → bus alamat**.
2. CPU mengaktifkan sinyal kontrol **Memory Read**.
3. Memori (setelah **waktu akses**) menaruh data di **bus data**.
4. CPU menangkap data ke **MBR** dan menurunkan sinyal Read.

Siklus **tulis** serupa: CPU menaruh alamat **dan** data, lalu mengaktifkan **Memory Write**.

Bila memori terlalu lambat, ia mengaktifkan sinyal **wait**/**not ready** dan CPU menyisipkan **wait state** (siklus clock kosong) sampai data siap. Inilah alasan mendasar mengapa kecepatan memori membatasi kecepatan sistem (**memory wall**), dan mengapa dibuat cache (Bab 8).

## Peta memori dan I/O

CPU hanya "melihat" satu ruang alamat. Isinya dibagi-bagi ke beberapa perangkat, dikenali dari **bit alamat teratas** oleh **decoder alamat** (ingat decoder di Bab 4):

~~~
Alamat       Isi
0x0000_0000  ┌───────────────┐
             │ ROM / flash   │  (program boot, firmware)
0x0001_0000  ├───────────────┤
             │ RAM           │  (data dan program yang berjalan)
0x2000_0000  ├───────────────┤
             │ Register I/O  │  (timer, UART, GPIO)
             └───────────────┘
~~~

Ada dua cara menjangkau perangkat I/O:

| Cara | Prinsip | Contoh |
| --- | --- | --- |
| **Memory-mapped I/O** | Register perangkat diberi alamat di ruang alamat memori; diakses dengan instruksi load/store biasa | ARM, RISC-V, MIPS; kartu grafis |
| **Port-mapped (isolated) I/O** | Ruang alamat I/O terpisah dengan instruksi khusus | \`IN\` / \`OUT\` pada x86 |

Contoh C untuk memory-mapped I/O pada mikrokontroler (alamatnya fiktif):

~~~c
#include <stdint.h>
#define GPIO_OUT (*(volatile uint32_t *)0x40020014)

void nyalakan_led(void) {
    GPIO_OUT |= (1u << 5);     // tulis ke alamat perangkat, bukan ke RAM biasa
}
~~~

Kata kunci \`volatile\` memberi tahu kompiler bahwa nilai di alamat itu bisa berubah di luar program dan setiap akses harus benar-benar dilakukan, tidak boleh dioptimasi.

## Bus bersama: masalah dan solusi

Bus yang dipakai bergantian oleh banyak komponen butuh **arbitrasi**: hanya satu pihak boleh "berbicara" (menjadi *master*) pada satu waktu. Tanpa aturan, dua perangkat mengirim bersamaan akan bertabrakan. Masalah lain: semakin banyak perangkat, semakin panjang kabel, semakin lambat clock-nya.

Karena itu sistem modern memakai **hierarki bus**: bus cepat dan pendek untuk CPU–memori, bus lebih lambat untuk periferal, dan sambungan titik-ke-titik (point-to-point) seperti PCIe dan interkoneksi prosesor. Topiknya dilanjutkan di Bab 9.

## Rangkuman

- Tiga bus: **alamat** (CPU → lainnya, n jalur → 2ⁿ alamat), **data** (dua arah, menentukan byte per transfer), **kontrol** (Read/Write, clock, interrupt, ready ...).
- Bandwidth = lebar bus data × transfer per detik (DDR4-3200 64 bit = 25,6 GB/s per kanal).
- Siklus baca: alamat → MAR → bus alamat; sinyal Read; memori menaruh data; CPU menangkap di MBR. Memori lambat menyebabkan **wait state**.
- Perangkat I/O dapat memakai **memory-mapped I/O** (alamat di ruang memori, \`volatile\` di C) atau **port-mapped** (\`IN\`/\`OUT\` x86).
- Bus bersama membutuhkan arbitrasi; sistem modern memakai hierarki bus dan sambungan titik-ke-titik.
`,
};
