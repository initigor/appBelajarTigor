export default {
  id: 'arsikom-flynn',
  judul: 'Paralelisme dan Taksonomi Flynn',
  tipe: 'teks',
  xp: 20,
  materi: `
# Paralelisme dan Taksonomi Flynn 🧵

Sejak sekitar 2005, kecepatan **satu** inti hampir tidak naik lagi (dinding daya, Bab 1), dan pipeline/superscalar sudah mendekati batas ILP (Bab 7). Satu-satunya jalan menaikkan kinerja adalah **mengerjakan banyak hal sekaligus** pada banyak unit pengolah. Bab terakhir ini membahas **paralelisme**: bentuk-bentuknya, hardware-nya, dan tantangannya.

## Tiga tingkat paralelisme

| Jenis | Singkatan | Arti | Contoh |
| --- | --- | --- | --- |
| **Instruction-Level Parallelism** | ILP | Banyak instruksi dari satu aliran dikerjakan bersamaan (hardware menemukannya otomatis) | Pipeline, superscalar, out-of-order (Bab 7) |
| **Data-Level Parallelism** | DLP | **Operasi yang sama** pada banyak data | Penjumlahan dua array, filter gambar, perkalian matriks |
| **Thread/Task-Level Parallelism** | TLP | Banyak aliran instruksi (thread/proses) independen | Server web melayani banyak pengguna, aplikasi multi-thread |

Satu program bisa memakai ketiganya sekaligus. ILP dikelola hardware; DLP dan TLP biasanya harus **dituliskan** oleh programmer (atau kompilator/perpustakaan).

## Taksonomi Flynn (1966)

Michael Flynn mengelompokkan komputer berdasarkan **jumlah aliran instruksi** dan **aliran data**:

| | **Satu aliran data** | **Banyak aliran data** |
| --- | --- | --- |
| **Satu aliran instruksi** | **SISD** | **SIMD** |
| **Banyak aliran instruksi** | **MISD** | **MIMD** |

### SISD: Single Instruction, Single Data

Satu instruksi pada satu data pada satu waktu. Itulah komputer von Neumann klasik (inti tunggal tanpa paralelisme eksplisit). Walau pipeline membuat hardware di dalamnya paralel, dari sudut pandang programmer tetap berurutan.

### SIMD: Single Instruction, Multiple Data

**Satu instruksi** dikerjakan **serentak pada banyak elemen data**.

~~~
 Satu instruksi: ADD
   a0 a1 a2 a3          ← vektor A
 + b0 b1 b2 b3          ← vektor B
 = c0 c1 c2 c3          ← 4 penjumlahan sekaligus
~~~

Bentuk SIMD:

- **Instruksi vektor di CPU**: SSE/AVX (x86; register 128/256/512 bit), NEON/SVE (ARM). Register 256 bit memuat 8 float 32 bit sehingga satu instruksi memproses 8 elemen.
- **GPU**: ribuan elemen sekaligus (variasi SIMT, pelajaran GPU).

Cocok untuk **DLP**: gambar, audio, video, jaringan saraf, ilmu pengetahuan. Perpustakaan seperti NumPy otomatis memakai instruksi SIMD:

~~~python
import numpy as np
a = np.arange(1_000_000, dtype=np.float32)
b = np.arange(1_000_000, dtype=np.float32)
c = a + b          # satu operasi vektor, memakai SIMD di dalamnya (±puluhan kali lebih cepat dari loop Python)
~~~

### MISD: Multiple Instruction, Single Data

Banyak instruksi berbeda pada **data yang sama**. Sangat jarang; kadang dikaitkan dengan sistem toleran kesalahan (beberapa unit memproses data yang sama lalu hasilnya divoting, mis. komputer pengendali pesawat).

### MIMD: Multiple Instruction, Multiple Data

Banyak prosesor, **masing-masing menjalankan instruksi sendiri pada data sendiri**. Inilah **multicore**, server multi-prosesor, dan klaster. Paling umum dan paling fleksibel (dapat menangani DLP maupun TLP).

MIMD dibagi menurut cara memori diorganisasikan:

| | **Memori bersama** (shared memory) | **Memori terdistribusi** (message passing) |
| --- | --- | --- |
| Prinsip | Semua prosesor melihat **satu ruang alamat** | Tiap prosesor punya memori **sendiri**; berkomunikasi dengan **pesan** lewat jaringan |
| Contoh | Multicore, server multi-socket (SMP, NUMA) | Klaster, superkomputer |
| Pemrograman | Thread (pthreads, Java Thread, OpenMP) | MPI |
| Kelebihan | Mudah berbagi data | Skalabel hingga ribuan node |
| Kekurangan | Koherensi cache, skalabilitas terbatas | Komunikasi eksplisit, lebih rumit |

## Hardware multithreading

Satu inti sering menganggur menunggu memori. **Multithreading** membuat inti seolah memiliki beberapa aliran instruksi sehingga unit yang menganggur dipakai thread lain:

| Jenis | Cara |
| --- | --- |
| **Fine-grained** | Ganti thread tiap siklus (dipakai GPU) |
| **Coarse-grained** | Ganti thread hanya saat stall panjang (cache miss besar) |
| **SMT** (*Simultaneous Multithreading*; **Hyper-Threading** pada Intel) | Instruksi dari **beberapa thread diterbitkan pada siklus yang sama** ke unit eksekusi superscalar |

Dengan SMT, satu inti fisik tampil sebagai 2 **inti logis** untuk OS. Tambahan kinerja biasanya **20–30%**, bukan 100%, karena kedua thread berbagi unit eksekusi dan cache.

## Hukum Amdahl kembali

Menambah inti hanya mempercepat bagian **paralel** (Bab 1). Mengingat contoh: program 90% paralel pada 8 inti hanya mencapai speedup **4,7**, dan pada 64 inti **8,8**. Karena itu:

- Bagian serial harus dikecilkan.
- Overhead sinkronisasi dan komunikasi mengurangi lagi.
- **Skala kuat** (*strong scaling*: masalah tetap, tambah inti) dibatasi Amdahl; **skala lemah** (*weak scaling*: masalah ikut membesar) seperti Gustafson lebih optimis.

## Contoh: menjumlahkan array besar paralel

~~~
Serial:    jumlah = a[0] + a[1] + ... + a[N-1]               (N langkah)

Paralel (4 thread):
   thread0: s0 = a[0 .. N/4)          ┐
   thread1: s1 = a[N/4 .. N/2)        │ dikerjakan bersamaan
   thread2: s2 = a[N/2 .. 3N/4)       │
   thread3: s3 = a[3N/4 .. N)         ┘
   hasil = s0 + s1 + s2 + s3          ← gabung (bagian serial, kecil)
~~~

Waktu ≈ N/4 + overhead gabung, hampir 4× lebih cepat. Pola **dekomposisi → kerjakan paralel → gabungkan** (*map-reduce*) adalah resep dasar paralelisme data.

Namun paralelisme tidak gratis: membagi pekerjaan, sinkronisasi, dan menyatukan hasil menambah kerumitan, serta bug yang sulit dilacak (*data race*, *deadlock*), topik pelajaran berikutnya.

## Rangkuman

- Tiga tingkat paralelisme: **ILP** (hardware, otomatis), **DLP** (operasi sama pada banyak data), **TLP** (banyak thread).
- **Taksonomi Flynn**: **SISD** (komputer klasik), **SIMD** (satu instruksi, banyak data: instruksi vektor, GPU), **MISD** (jarang), **MIMD** (banyak prosesor independen: multicore, klaster).
- MIMD: **memori bersama** (thread, multicore) vs **terdistribusi** (message passing, MPI).
- **SMT/Hyper-Threading**: satu inti fisik menjalankan 2 thread (±20–30% lebih cepat).
- Hukum Amdahl membatasi percepatan dari menambah inti: bagian serial harus kecil.
`,
};
