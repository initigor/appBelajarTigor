export default {
  id: 'arsikom-tren',
  judul: 'Tren Arsitektur Modern: SoC, Akselerator, dan Efisiensi',
  tipe: 'teks',
  xp: 20,
  materi: `
# Tren Arsitektur Modern: SoC, Akselerator, dan Efisiensi 🔭

Apa yang terjadi ketika frekuensi clock mentok (dinding daya), ILP mendekati batas, dan Hukum Moore melambat? Dalam kuliah penerimaan Turing Award (2018), **John Hennessy dan David Patterson** (penemu RISC) menyebut era sekarang sebagai **"zaman keemasan baru arsitektur komputer"**: kemajuan tidak lagi datang gratis dari transistor yang lebih kecil, tetapi dari **arsitektur yang lebih cerdas**. Pelajaran ini merangkum tren utamanya.

## 1. Energi adalah batas utama

Segalanya kini dibatasi **daya dan panas**, bukan jumlah transistor. Konsekuensinya:

- **Dark silicon**: tidak semua transistor di chip bisa dinyalakan bersamaan tanpa melebihi batas panas. Sebagian harus "gelap" pada saat tertentu.
- Metrik penting: **kinerja per watt** dan **kinerja per joule**, bukan kinerja mentah saja.
- **DVFS** (*Dynamic Voltage and Frequency Scaling*): inti menurunkan tegangan dan frekuensi saat beban ringan (daya ∝ V² × f), dan **turbo boost** menaikkannya sesaat saat dibutuhkan.
- **Power gating / clock gating**: komponen yang menganggur dimatikan.

## 2. Heterogenitas: big.LITTLE dan inti hibrida

Satu jenis inti tidak optimal untuk semua beban. Chip modern memadukan:

| Jenis inti | Ciri | Tugas |
| --- | --- | --- |
| **Inti kinerja (big / P-core)** | Lebar, out-of-order dalam, frekuensi tinggi, boros daya | Tugas interaktif berat |
| **Inti efisiensi (LITTLE / E-core)** | Sederhana, mungkin in-order, hemat daya | Tugas latar belakang, beban ringan |

Dipakai pada **ARM big.LITTLE** (ponsel), Apple M-series, dan Intel Alder Lake dan sesudahnya. Penjadwal OS menempatkan tiap thread pada jenis inti yang tepat.

## 3. System-on-Chip (SoC)

Alih-alih chip terpisah di papan sirkuit, semua dilebur dalam **satu chip**:

~~~
 +----------------------------------------------+
 |                    SoC                       |
 |  CPU (big+LITTLE)   GPU     NPU (AI)         |
 |  Pengontrol memori   ISP kamera   Modem 5G   |
 |  Enkoder/dekoder video   Keamanan   I/O      |
 +----------------------------------------------+
~~~

Keuntungan: jarak data lebih pendek (hemat energi dan latensi), ukuran kecil, **memori terpadu** (CPU, GPU, NPU berbagi RAM yang sama sehingga tidak perlu menyalin data, kunci efisiensi Apple Silicon). Dipakai di semua ponsel, konsol game, dan makin banyak laptop.

## 4. Akselerator domain-spesifik

Karena menaikkan kinerja serbaguna makin mahal, strateginya berpindah ke **perangkat keras khusus** untuk tugas tertentu, yang bisa **10–1000× lebih efisien** daripada CPU untuk tugas itu:

| Akselerator | Tugas |
| --- | --- |
| **GPU** | Grafik, komputasi paralel, AI |
| **NPU / TPU** (*Tensor/Neural Processing Unit*) | Inferensi/pelatihan jaringan saraf: inti berupa **systolic array** perkalian matriks |
| **Enkoder/dekoder video** | H.264/H.265/AV1 |
| **Mesin kriptografi** | AES, SHA (instruksi \`AES-NI\` di x86) |
| **DSP, ISP** | Sinyal audio/gambar kamera |
| **FPGA / ASIC** | Logika yang dapat diprogram ulang / dirancang khusus |

Prinsip Amdahl: percepat yang dominan. Contoh nyata: TPU Google dirancang karena perhitungan menunjukkan jaringan saraf akan membebani pusat data jika hanya memakai CPU.

## 5. Memori dan packaging: mengatasi memory wall

- **HBM** (*High Bandwidth Memory*): tumpukan chip DRAM (3D) di samping prosesor dengan jalur sangat lebar → bandwidth > 1 TB/s; dipakai GPU kelas data center dan akselerator AI.
- **Chiplet**: alih-alih satu die raksasa (yield rendah dan mahal), beberapa **die kecil** digabung dalam satu paket (AMD Ryzen/EPYC). Biaya turun, fleksibel.
- **3D stacking**: menumpuk cache atau logika secara vertikal (mis. AMD 3D V-Cache menambah SRAM L3 di atas die inti).
- **Memori nonvolatil cepat dan CXL**: sambungan baru untuk memori bersama antar-perangkat.

## 6. ISA terbuka dan ekosistem

- **ARM** meluas dari ponsel ke laptop (Apple M-series) dan server (AWS Graviton).
- **x86** (Intel/AMD) tetap dominan di PC dan server lama, dengan pesaing yang makin kuat.
- **RISC-V**: ISA RISC **terbuka** yang berkembang di mikrokontroler, akselerator, dan penelitian; tanpa biaya lisensi ISA. Memungkinkan perusahaan menambah instruksi khusus.

## 7. Keamanan sebagai pertimbangan arsitektur

Optimasi kinerja (eksekusi spekulatif, cache bersama, prediksi cabang) ternyata membuka **kanal samping (side channel)**: **Spectre** dan **Meltdown** (2018) memanfaatkan jejak spekulasi di cache. Konsekuensi:

- Mitigasi di CPU dan OS (sering menurunkan kinerja beberapa persen).
- Fitur hardware keamanan baru: enklave terenkripsi (SGX, TrustZone), enkripsi memori, tag memori (ARM MTE), **pointer authentication** untuk mencegah buffer overflow/ROP.
- Pertimbangan keamanan kini dibahas sejak awal perancangan, bukan belakangan.

## 8. Cakrawala yang masih jauh

| Teknologi | Gagasan | Status |
| --- | --- | --- |
| **Komputasi kuantum** | Qubit dalam superposisi; algoritma tertentu (faktorisasi, simulasi molekul) eksponensial lebih cepat | Riset; tidak menggantikan CPU, melainkan akselerator khusus |
| **Neuromorphic** | Meniru neuron dan sinapsis, hemat energi | Riset awal |
| **In-memory computing** | Menghitung di dalam memori untuk mengurangi pergerakan data | Riset dan prototipe |
| **Fotonik** | Interkoneksi optik antar-chip | Mulai muncul di pusat data |

Hal yang mendasari semuanya: memindahkan data lebih mahal (waktu dan energi) daripada menghitungnya. Mengurangi pergerakan data adalah tema berulang dari register, cache, memori terpadu, sampai in-memory computing.

## Apa artinya untuk kamu sebagai programmer?

1. **Paralelisme bukan opsional**: kinerja datang dari banyak inti, SIMD, dan GPU. Pelajari thread, async, dan perpustakaan paralel.
2. **Perhatikan lokalitas data**: struktur data dan pola akses menentukan kinerja nyata (Bab 8).
3. **Pilih alat yang tepat**: CPU untuk logika, GPU/akselerator untuk komputasi data besar.
4. **Energi penting**: kode efisien bukan hanya cepat tetapi juga hemat baterai dan biaya pusat data.
5. **Memahami arsitektur membuat kamu lebih baik dalam debugging dan optimasi** di bahasa apa pun.

## Rangkuman

- **Daya dan panas** membatasi kinerja: dark silicon, DVFS, power gating; metrik utama adalah kinerja per watt.
- **Heterogenitas**: inti big dan LITTLE; **SoC** menyatukan CPU, GPU, NPU, dan lainnya dengan memori terpadu.
- **Akselerator domain-spesifik** (GPU, TPU/NPU, enkoder video, kripto) 10–1000× lebih efisien untuk tugas khusus.
- Packaging: **HBM**, **chiplet**, **3D stacking** mengatasi memory wall dan biaya.
- ISA: ARM, x86, dan **RISC-V** terbuka. Keamanan (Spectre/Meltdown) kini bagian dari desain arsitektur.
- Memindahkan data lebih mahal daripada menghitungnya, sehingga lokalitas dan paralelisme adalah keterampilan inti programmer.
`,
};
