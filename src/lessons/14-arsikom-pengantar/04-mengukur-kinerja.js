export default {
  id: 'arsikom-kinerja',
  judul: 'Mengukur Kinerja: Clock, CPI, dan Waktu CPU',
  tipe: 'teks',
  xp: 15,
  materi: `
# Mengukur Kinerja: Clock, CPI, dan Waktu CPU ⏱️

"Komputer A lebih cepat dari B" itu pernyataan yang samar. Cepat untuk apa? Untuk satu program, atau banyak program sekaligus? Dalam Arsikom, kinerja punya **rumus**, dan rumus itu menunjukkan tuas mana yang bisa kamu tarik untuk mempercepat komputer.

## Dua ukuran kinerja yang berbeda

| Ukuran | Definisi | Penting untuk |
| --- | --- | --- |
| **Waktu respons** (*execution time*, latensi) | Berapa lama **satu** tugas selesai | Pengguna laptop: "kapan hasilnya keluar?" |
| **Throughput** | Berapa banyak tugas selesai per satuan waktu | Server: "berapa permintaan per detik?" |

Mengganti prosesor dengan yang lebih cepat meningkatkan keduanya. Menambah jumlah prosesor biasanya hanya meningkatkan throughput.

Kinerja didefinisikan sebagai kebalikan waktu eksekusi:

~~~
Kinerja(X) = 1 / Waktu eksekusi(X)
~~~

"X **n kali lebih cepat** dari Y" artinya:

~~~
n = Kinerja(X) / Kinerja(Y) = Waktu(Y) / Waktu(X)
~~~

Contoh: program berjalan 10 detik di A dan 15 detik di B. A lebih cepat 15/10 = **1,5 kali** dari B.

## Siklus clock

Semua kerja di dalam CPU diatur oleh **sinyal clock** yang berdenyut teratur.

- **Periode clock** (T): durasi satu siklus. Satuan detik (ns, ps).
- **Frekuensi clock** (f): jumlah siklus per detik. Satuan Hz (GHz = 10⁹ Hz).
- Hubungannya: **f = 1 / T**.

CPU 4 GHz memiliki periode 1 / (4×10⁹) = 0,25 ns.

## Rumus waktu CPU

Waktu CPU sebuah program = jumlah siklus clock yang dipakai × lama satu siklus.

~~~
Waktu CPU = Siklus clock CPU × T = Siklus clock CPU / f
~~~

Jumlah siklus bergantung pada **berapa instruksi** yang dijalankan dan **berapa siklus per instruksi**:

~~~
Siklus clock CPU = Jumlah instruksi (IC) × CPI
~~~

**CPI** (*Cycles Per Instruction*) adalah rata-rata siklus yang dibutuhkan per instruksi. Gabungkan keduanya, dan terbentuklah **persamaan kinerja klasik**:

~~~
Waktu CPU = IC × CPI × T  =  (IC × CPI) / f
~~~

Ketiga faktor ini masing-masing dipengaruhi oleh bagian sistem yang berbeda:

| Faktor | Dipengaruhi oleh |
| --- | --- |
| **IC** (jumlah instruksi) | Algoritma, bahasa, compiler, **arsitektur set instruksi** |
| **CPI** | **Organisasi** hardware (pipeline, cache), dan campuran instruksi |
| **T / f** | Teknologi fabrikasi dan organisasi hardware |

Satu alasan kenapa CISC vs RISC sulit dibandingkan: CISC menurunkan IC tetapi menaikkan CPI, RISC sebaliknya (Bab 6).

### Contoh 1: menghitung waktu CPU

Sebuah program menjalankan 2 × 10⁹ instruksi pada CPU 3 GHz dengan CPI rata-rata 1,5.

~~~
Waktu CPU = (2 × 10^9 × 1,5) / (3 × 10^9) = 1,0 detik
~~~

### Contoh 2: membandingkan dua mesin

Program yang sama dijalankan di dua mesin dengan ISA yang sama (jadi IC sama).

| Mesin | Clock | CPI |
| --- | --- | --- |
| A | 2 GHz | 2,0 |
| B | 3 GHz | 3,0 |

~~~
Waktu A = IC × 2,0 / 2 GHz = 1,0 × IC / 10^9  detik
Waktu B = IC × 3,0 / 3 GHz = 1,0 × IC / 10^9  detik
~~~

Waktunya **sama persis**! B punya clock lebih tinggi, tetapi CPI-nya juga lebih besar. **Jangan menilai kinerja dari frekuensi clock saja.**

### Contoh 3: campuran instruksi

CPI rata-rata bergantung pada proporsi tiap jenis instruksi:

~~~
CPI = Σ (CPI_i × F_i)      F_i = fraksi instruksi jenis i
~~~

| Jenis instruksi | CPI | Proporsi |
| --- | --- | --- |
| Aritmetika (ALU) | 1 | 50% |
| Load/Store | 3 | 30% |
| Cabang | 2 | 20% |

~~~
CPI = 1×0,5 + 3×0,3 + 2×0,2 = 0,5 + 0,9 + 0,4 = 1,8
~~~

Kalau Load/Store dipercepat menjadi CPI 2 (misalnya dengan cache lebih baik): CPI = 0,5 + 0,6 + 0,4 = 1,5. Itulah contoh bagaimana perbaikan organisasi menurunkan CPI.

## MIPS dan FLOPS: ukuran yang menyesatkan

- **MIPS** (*Million Instructions Per Second*) = IC / (waktu × 10⁶) = f / (CPI × 10⁶).
- **FLOPS**: operasi floating point per detik (GFLOPS, TFLOPS), dipakai di komputasi ilmiah dan GPU.

MIPS **tidak bisa dibandingkan antar-ISA**: satu instruksi di CISC bisa setara tiga instruksi RISC. Mesin dengan MIPS lebih tinggi pun bisa menyelesaikan program lebih lambat jika ia membutuhkan lebih banyak instruksi. Karena itu para insinyur menyindir MIPS sebagai *"Meaningless Indicator of Processor Speed"*.

## Benchmark: mengukur dengan program nyata

Karena kinerja bergantung pada beban kerja, perbandingan yang adil memakai **benchmark**: kumpulan program standar. Contohnya **SPEC CPU** (kumpulan aplikasi nyata seperti kompresi, kompiler, simulasi). Hasil biasanya dinyatakan sebagai rasio terhadap mesin acuan dan dirata-ratakan dengan **rata-rata geometrik**, supaya satu program tidak mendominasi.

Benchmark kecil buatan sendiri (misalnya loop kosong) mudah dimanipulasi oleh compiler dan tidak mewakili pemakaian sebenarnya.

## Rangkuman

- Kinerja = 1 / waktu eksekusi. Bedakan **latensi** (satu tugas) dari **throughput** (banyak tugas per waktu).
- **Waktu CPU = IC × CPI × T = (IC × CPI) / f.** IC dipengaruhi algoritma/compiler/ISA, CPI oleh organisasi, T oleh teknologi.
- Clock yang lebih tinggi **belum tentu** lebih cepat bila CPI atau IC lebih buruk.
- CPI rata-rata dihitung dari campuran instruksi: CPI = Σ(CPI_i × F_i).
- MIPS dan FLOPS bisa menyesatkan antar-ISA; gunakan **benchmark** program nyata seperti SPEC.
`,
};
