export default {
  id: 'arsikom-hierarki-memori',
  judul: 'Hierarki Memori dan Prinsip Lokalitas',
  tipe: 'teks',
  xp: 20,
  materi: `
# Hierarki Memori dan Prinsip Lokalitas 🗄️

Kita ingin memori yang **sangat besar**, **sangat cepat**, dan **murah**. Sayangnya ketiganya saling bertentangan: makin cepat sebuah teknologi memori, makin mahal dan makin kecil kapasitasnya. Solusi cerdas komputer: **tumpuk beberapa jenis memori** dan manfaatkan fakta bahwa program mengakses memori dengan **pola yang bisa ditebak**.

## Mengapa tidak satu memori saja?

| Teknologi | Waktu akses khas | Harga relatif per GB | Kapasitas khas |
| --- | --- | --- | --- |
| Register | ±0,3 ns | sangat mahal | ratusan byte |
| Cache SRAM (L1) | ±1 ns | ±ribuan kali DRAM | 32–64 KiB |
| Cache SRAM (L2/L3) | 3–40 ns | mahal | 256 KiB – puluhan MiB |
| DRAM (RAM utama) | 50–100 ns | 1× (acuan) | 8–64 GiB |
| SSD | 50–100 µs | ±1/10 DRAM | 256 GB – beberapa TB |
| Hard disk (HDD) | 5–10 ms | ±1/100 DRAM | 1 – 20 TB |

Dari register ke HDD, waktu akses naik sekitar **sepuluh juta kali lipat**. Seandainya register diakses dalam 1 detik, mengambil data dari HDD setara menunggu ±4 bulan.

CPU modern bisa menjalankan ratusan instruksi dalam waktu yang diperlukan DRAM untuk menjawab satu permintaan. Kesenjangan ini disebut **memory wall**: kecepatan CPU tumbuh jauh lebih cepat daripada kecepatan memori selama puluhan tahun.

## Hierarki memori

~~~
        Lebih cepat, lebih kecil, lebih mahal per byte
                          ▲
                    ┌──────────┐
                    │ Register │   di dalam CPU
                    ├──────────┤
                    │ Cache L1 │   SRAM, per inti
                    ├──────────┤
                    │ Cache L2 │   SRAM
                    ├──────────┤
                    │ Cache L3 │   SRAM, bersama antar inti
                    ├──────────┤
                    │ RAM (DRAM)│  memori utama
                    ├──────────┤
                    │ SSD / HDD │  penyimpanan sekunder
                    └──────────┘
                          ▼
        Lebih lambat, lebih besar, lebih murah per byte
~~~

Prinsipnya: **level atas menyimpan salinan sebagian isi level di bawahnya**. Program melihat seluruhnya sebagai satu memori besar, tetapi sebagian besar akses terjawab oleh level atas yang cepat. Hasilnya: **kecepatan mendekati level teratas, kapasitas dan biaya mendekati level terbawah**.

Mengapa ini berhasil? Karena **prinsip lokalitas**.

## Prinsip lokalitas

Program tidak mengakses memori secara acak. Mereka cenderung memakai ulang dan mengakses data yang berdekatan:

### Lokalitas temporal (waktu)

> Data yang baru saja diakses **kemungkinan besar akan diakses lagi** dalam waktu dekat.

Contoh: variabel loop \`i\`, \`jumlah\`, instruksi di dalam loop yang dieksekusi berkali-kali, fungsi yang sering dipanggil.

**Penerapan:** simpan data yang baru dipakai di level yang lebih cepat (cache).

### Lokalitas spasial (ruang)

> Jika sebuah lokasi diakses, **lokasi di dekatnya kemungkinan akan diakses** juga.

Contoh: elemen array diakses berurutan (\`a[0], a[1], a[2]...\`), instruksi program dieksekusi berurutan, anggota struct berdekatan.

**Penerapan:** ketika mengambil satu byte dari memori, ambil sekaligus **satu blok** (misalnya 64 byte) di sekitarnya.

~~~c
int jumlah = 0;
for (int i = 0; i < n; i++)
    jumlah += a[i];
~~~

Kode ini memiliki **lokalitas temporal** (\`jumlah\`, \`i\`, dan instruksi loop dipakai berulang) dan **lokalitas spasial** (\`a[i]\` berurutan di memori, dan akses a[i+1] biasanya sudah ada di blok yang barusan dimuat).

## Istilah dasar cache

Ketika CPU meminta data:

- **Hit**: data **ada** di level yang dicek (cepat).
- **Miss**: data **tidak ada**, harus diambil dari level di bawahnya (lambat).
- **Hit rate** = hit / seluruh akses. **Miss rate** = 1 − hit rate.
- **Hit time**: waktu mengakses level itu bila hit. **Miss penalty**: tambahan waktu untuk mengambil dari level bawah.
- Unit pemindahan antar level disebut **blok** (atau *cache line*), biasanya **64 byte**.

Dengan hit rate 95%, hanya 1 dari 20 akses yang membayar penalti mahal, sehingga kecepatan rata-rata hampir sama dengan cache.

## Contoh dampak lokalitas pada kode

Dua program berikut menjumlahkan matriks yang sama, hasilnya identik:

~~~c
#define N 1024
int a[N][N];

// Versi A: baris demi baris
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        jumlah += a[i][j];

// Versi B: kolom demi kolom
for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++)
        jumlah += a[i][j];
~~~

C menyimpan array 2D **berurutan per baris** (*row-major*). Pada Versi A, \`a[i][j]\` dan \`a[i][j+1]\` bersebelahan: satu blok 64 byte memuat 16 \`int\`, jadi hanya **1 miss per 16 akses** (≈ 6%). Pada Versi B, tiap akses melompat 4096 byte (satu baris) sehingga hampir **setiap akses menyentuh blok berbeda** dan miss (≈ 100% bila matriks lebih besar dari cache). Versi B bisa **5–20 kali lebih lambat**, padahal jumlah operasinya sama.

Pelajaran: **urutan akses memori sama pentingnya dengan algoritma**. Python dengan NumPy dan Java juga mengalami hal yang sama pada level hardware.

## Rangkuman

- Teknologi memori saling bertukar antara kecepatan, kapasitas, dan harga, sehingga dibuat **hierarki**: register → cache L1/L2/L3 → DRAM → SSD/HDD.
- Hierarki berhasil karena **lokalitas temporal** (data yang baru dipakai dipakai lagi) dan **lokalitas spasial** (data berdekatan dipakai bersama), sehingga blok data disalin ke level lebih cepat.
- Istilah: hit, miss, hit rate, hit time, miss penalty, blok (≈ 64 byte).
- **Memory wall**: CPU jauh lebih cepat daripada DRAM, sehingga cache penting.
- Pola akses memengaruhi kecepatan secara dramatis (row-major vs column-major).
`,
};
