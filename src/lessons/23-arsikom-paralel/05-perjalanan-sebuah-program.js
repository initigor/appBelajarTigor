export default {
  id: 'arsikom-rangkuman',
  judul: 'Rangkuman Akhir: Perjalanan Sebuah Program dari C sampai Transistor',
  tipe: 'teks',
  xp: 30,
  materi: `
# Rangkuman Akhir: Perjalanan Sebuah Program 🧭

Saatnya menyatukan semuanya. Kita ikuti satu baris kode, dan lihat **setiap konsep** dari sepuluh bab ikut bekerja.

~~~c
int c = a + b;     // di dalam sebuah program C yang sudah kamu jalankan
~~~

## Tahap 0: sebelum berjalan: kompilasi dan penyimpanan

1. **Kompilator** menerjemahkan C ke assembly lalu **kode mesin** sesuai **ISA** target (Bab 6): mis. \`lw\`, \`lw\`, \`add\`, \`sw\` pada RISC atau \`mov/add/mov\` pada x86. Variabel lokal dialokasikan ke **register** atau ke **stack frame** (Bab 6).
2. Hasilnya disimpan sebagai berkas di **SSD** (Bab 9), yaitu deretan byte instruksi dan data. Isi berkas ini sendiri hanyalah angka biner (Bab 2), berpola sebagai **instruksi** karena arsitektur **von Neumann** menyimpan program sebagai data (Bab 1).

## Tahap 1: memuat program

3. Pengguna menjalankan program. **Sistem operasi** membuat proses dan menyiapkan **tabel halaman** untuk ruang alamat virtualnya (Bab 8). Halaman kode **belum semuanya dimuat**: dimuat sesuai kebutuhan (**demand paging**).
4. Saat CPU pertama kali mengakses halaman yang belum ada, terjadi **page fault** (sebuah exception, Bab 5). OS meminta SSD membaca halaman itu lewat **DMA** (Bab 9). CPU menjalankan proses lain selagi menunggu; **interupsi** dari SSD memberi tahu saat selesai (Bab 5 dan 9).

## Tahap 2: fetch

5. **PC** berisi alamat virtual instruksi berikutnya (Bab 5).
6. **TLB** menerjemahkan alamat virtual ke fisik (Bab 8). Bila TLB miss, hardware menelusuri tabel halaman.
7. Alamat fisik dikirim ke **cache instruksi L1** (Bab 8). Kemungkinan besar **hit** (lokalitas spasial: instruksi berurutan). Bila miss: cari di L2, L3, lalu **DRAM** lewat **bus memori** (Bab 5 dan 8) dan satu blok 64 byte dibawa masuk.
8. Beberapa instruksi sekaligus diambil (CPU **superscalar** mengambil 4–8 instruksi per siklus, Bab 7). Cabang dipandu oleh **prediktor cabang** (Bab 7).

## Tahap 3: decode dan rename

9. **Decoder** menafsirkan kode biner instruksi: mengenali opcode dan field register (Bab 6). Pada x86, instruksi CISC diterjemahkan menjadi **µops RISC** (Bab 6).
10. **Register renaming** memberi nama fisik baru pada register tujuan untuk menghilangkan ketergantungan palsu (Bab 7).
11. Instruksi masuk **reservation station** dan **reorder buffer** (Bab 7).

## Tahap 4: execute

12. Untuk memuat \`a\` dan \`b\`: instruksi \`lw\` menghitung alamat (**base + displacement**, Bab 6) dengan ALU, mengakses **D-cache L1** (hit/miss seperti di atas, Bab 8), membawa nilai ke register.
13. Begitu kedua operand siap (**forwarding**, Bab 7), instruksi \`add\` dikirim ke ALU (**out-of-order**, Bab 7).
14. **ALU** (Bab 4) melakukan penjumlahan: rantai **full adder** (atau **carry-lookahead**, Bab 4) yang dibangun dari **gerbang logika** (AND, OR, XOR) yang terbuat dari **transistor CMOS** (Bab 4). Bilangan dikodekan **komplemen 2** (Bab 2); bila hasilnya tidak muat dalam 32 bit, flag **overflow** menyala (Bab 3).
15. Hasil ditulis ke **register** (flip-flop, Bab 4) yang memiliki waktu **setup/hold** yang dipatuhi oleh periode clock (Bab 4).

## Tahap 5: komit dan simpan

16. Hasil dikomit berurutan lewat **reorder buffer** (Bab 7) sehingga seolah-olah program berjalan berurutan.
17. Instruksi \`sw\` menaruh nilai ke **store buffer** lalu D-cache (**write-back + write-allocate**, Bab 8). Baris cache ditandai **dirty**. Bila inti lain berbagi data itu, protokol **MESI** menginvalidasi salinannya (Bab 10).
18. Saat baris diusir (LRU), blok ditulis ke **DRAM** (Bab 8), yang harus **di-refresh** berkala (Bab 8).

## Tahap 6: waktu dan kinerja

19. Seluruh urutan ini berulang miliaran kali per detik. Kinerjanya: **Waktu CPU = IC × CPI × T** (Bab 1). IC bergantung kompilator dan ISA, CPI bergantung pipeline, cache, dan prediksi cabang (Bab 7 dan 8), T bergantung teknologi dan critical path (Bab 4).
20. Bila program ini dijalankan paralel pada banyak inti atau dikirim ke GPU (Bab 10), speedup dibatasi oleh **Hukum Amdahl** (Bab 1) dan oleh koherensi serta sinkronisasi (Bab 10).

## Peta bab ke tahap

| Bab | Peran dalam perjalanan program |
| --- | --- |
| 1. Pengantar & kinerja | Kerangka: von Neumann, CPI, Amdahl |
| 2. Representasi data | Instruksi, bilangan, karakter sebagai bit |
| 3. Aritmetika | Operasi ALU, overflow, floating point |
| 4. Logika digital | Gerbang, adder, register, ALU, clock |
| 5. CPU & siklus instruksi | Fetch, decode, execute, bus, interupsi |
| 6. Set instruksi | Format, pengalamatan, RISC/CISC, assembly, stack |
| 7. Kontrol & pipeline | Hardwired/microcode, hazard, superscalar, OoO |
| 8. Memori & cache | Hierarki, cache, memori virtual, TLB |
| 9. I/O & penyimpanan | Bus, DMA, interupsi, SSD, RAID |
| 10. Paralelisme | Multicore, koherensi, GPU, tren modern |

## Lima ide yang mengikat semuanya

1. **Abstraksi berlapis**: tiap level menyembunyikan detail level di bawahnya melalui antarmuka (ISA, API, protokol).
2. **Lokalitas dan hierarki**: dekatkan data yang sering dipakai (register, cache, TLB, page cache).
3. **Paralelisme di mana-mana**: pipeline, superscalar, SIMD, multicore, DMA, GPU.
4. **Percepat kasus umum** dan ukur dengan benar (Amdahl, CPI, AMAT).
5. **Selalu ada kompromi**: kecepatan vs biaya vs daya vs kompleksitas vs keandalan.

## Cara memakai pengetahuan ini

- Mengapa kode ini lambat? Periksa **pola akses memori** (cache), **percabangan tak terprediksi**, dan **dependensi data**.
- Mengapa bug ini hanya muncul kadang-kadang? Mungkin **race condition**, **overflow**, atau **endianness**.
- Mengapa program ini tidak lebih cepat di 16 inti? **Bagian serial**, **false sharing**, atau **kontensi lock**.
- Mengapa float memberi hasil aneh? **IEEE 754** dan pembulatan.
- Mengapa program C ini crash dengan segmentation fault? **Memori virtual**, **stack**, **buffer overflow**.

Itulah inti Arsikom: kamu tidak lagi memperlakukan komputer sebagai kotak hitam. Selamat, dan sekarang waktunya ujian akhir. 🎓

## Rangkuman

- Satu baris kode melibatkan **seluruh** tumpukan: kompilator, OS, memori virtual, cache, pipeline, ALU, gerbang, dan transistor.
- Kinerja = IC × CPI × T; hambatan umum: memori (memory wall), cabang, dependensi, bagian serial (Amdahl).
- Lima ide pengikat: abstraksi, lokalitas, paralelisme, percepat kasus umum, dan kompromi.
`,
};
