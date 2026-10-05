export default {
  id: 'arsikom-amat',
  judul: 'Kinerja Cache: AMAT dan Dampaknya pada CPI',
  tipe: 'teks',
  xp: 25,
  materi: `
# Kinerja Cache: AMAT dan Dampaknya pada CPI 📊

Setelah mengetahui cara kerja cache, pertanyaan berikutnya: **seberapa besar cache membantu?** Jawabannya adalah rumus sederhana yang menjadi salah satu hitungan paling sering diujikan di Arsikom.

## Average Memory Access Time (AMAT)

Waktu akses memori rata-rata dengan satu level cache:

~~~
AMAT = Hit time + Miss rate × Miss penalty
~~~

- **Hit time**: waktu mengakses cache bila hit.
- **Miss rate**: persentase akses yang miss.
- **Miss penalty**: tambahan waktu mengambil data dari level di bawahnya.

### Contoh 1

Hit time 1 ns, miss rate 5%, miss penalty 100 ns.

~~~
AMAT = 1 + 0,05 × 100 = 1 + 5 = 6 ns
~~~

Tanpa cache, setiap akses 100 ns. Dengan cache: rata-rata 6 ns, **16,7× lebih cepat**. Perhatikan: walau hanya 5% yang miss, miss tersebut menyumbang **5 dari 6 ns**: miss penalty mendominasi.

### Contoh 2: akibat memperbaiki miss rate

Dari miss rate 5% menjadi 2% (cache lebih besar), tetapi hit time naik jadi 1,2 ns (cache lebih besar lebih lambat):

~~~
AMAT = 1,2 + 0,02 × 100 = 1,2 + 2 = 3,2 ns
~~~

Lebih baik (3,2 vs 6 ns). Namun jika hit time naik terlalu banyak, keuntungan hilang. Itulah kompromi desain: **ukuran, asosiativitas, dan hit time saling tarik-menarik**.

## Hierarki dua level

Dengan L1 dan L2, miss penalty L1 adalah AMAT dari L2:

~~~
AMAT = HitTime_L1 + MissRate_L1 × (HitTime_L2 + MissRate_L2 × MissPenalty_memori)
~~~

**Contoh:** L1: hit time 1 ns, miss rate 10%. L2: hit time 5 ns, **local miss rate** 20% (20% dari akses yang sampai ke L2 miss). Memori: 100 ns.

~~~
AMAT = 1 + 0,10 × (5 + 0,20 × 100)
     = 1 + 0,10 × (5 + 20)
     = 1 + 0,10 × 25 = 3,5 ns
~~~

Tanpa L2: 1 + 0,10 × 100 = 11 ns. L2 mengurangi AMAT dari 11 ns menjadi 3,5 ns.

Catatan: **local miss rate** (terhadap akses yang sampai level itu) berbeda dengan **global miss rate** (terhadap seluruh akses CPU). Global miss rate L2 = 0,10 × 0,20 = **2%**.

## Dampak pada CPI

Miss cache menyebabkan CPU **stall**. Tambahkan ke CPI:

~~~
CPI = CPI dasar + (akses memori per instruksi) × miss rate × miss penalty (dalam siklus)
~~~

**Contoh:** CPI dasar = 1,0 (tanpa miss). Setiap instruksi melakukan 1 fetch instruksi + 0,3 akses data = **1,3 akses memori per instruksi**. Miss rate gabungan 2%, miss penalty 100 siklus.

~~~
CPI = 1,0 + 1,3 × 0,02 × 100 = 1,0 + 2,6 = 3,6
~~~

CPI naik **3,6 kali**, hanya karena 2% miss! Memori (bukan CPU) menjadi pembatas kinerja. Jika miss rate diturunkan ke 1%: CPI = 1 + 1,3 = 2,3, **hampir 36% lebih cepat** hanya dengan memperbaiki perilaku cache.

Akibatnya: CPU 2× lebih cepat dengan memori sama tidak akan 2× lebih cepat. Mempercepat CPU menaikkan **miss penalty dalam satuan siklus** dan membuat memori kian dominan (inti **Hukum Amdahl** untuk memori).

## Cara meningkatkan kinerja cache

| Cara | Mengurangi | Harga yang dibayar |
| --- | --- | --- |
| Blok lebih besar | Compulsory miss | Miss penalty naik, polusi cache |
| Cache lebih besar | Capacity miss | Hit time dan biaya naik |
| Asosiativitas lebih tinggi | Conflict miss | Hit time dan daya naik |
| Cache multilevel | Miss penalty | Kompleksitas |
| Prefetching | Compulsory, capacity | Bandwidth terbuang bila salah |
| Prioritaskan read atas write | Miss penalty (read) | Kompleksitas |

### Optimasi di level perangkat lunak (kode kamu!)

Programmer sering lebih berpengaruh daripada perancang hardware:

1. **Loop interchange**: ubah urutan loop supaya akses berurutan di memori (kolom → baris pada array row-major).
2. **Blocking / tiling**: kerjakan data dalam potongan yang muat di cache. Contoh perkalian matriks besar: pecah menjadi blok 32×32 sehingga tiap blok digunakan berulang kali selagi ada di cache.
3. **Struktur data cache-friendly**: gunakan array dari struct berdekatan, bukan linked list yang tersebar. Struct of arrays vs array of structs.
4. **Hindari false sharing** pada program multi-thread (Bab 10).

~~~c
// Tanpa blocking: B[k][j] diakses kolom demi kolom → banyak miss untuk N besar
for (i = 0; i < N; i++)
  for (j = 0; j < N; j++)
    for (k = 0; k < N; k++)
      C[i][j] += A[i][k] * B[k][j];
~~~

Versi *tiled* membagi i, j, k menjadi blok dan dapat 3–10× lebih cepat untuk matriks besar. Perpustakaan seperti BLAS/NumPy melakukannya otomatis.

## Contoh soal ujian lengkap

> Prosesor 1 GHz memiliki CPI dasar 1,2 (semua akses hit). 30% instruksi adalah load/store. Cache instruksi miss 2%, cache data miss 5%. Miss penalty 50 siklus. Berapa CPI sebenarnya?

~~~
Stall dari instruksi = 1 × 0,02 × 50 = 1,0
Stall dari data      = 0,30 × 0,05 × 50 = 0,75
CPI = 1,2 + 1,0 + 0,75 = 2,95
~~~

Dari 2,95 siklus per instruksi, hanya 1,2 yang benar-benar bekerja: **59% waktu terbuang** menunggu memori.

## Rangkuman

- **AMAT = hit time + miss rate × miss penalty**. Dua level: AMAT = H₁ + M₁ × (H₂ + M₂ × penalti memori).
- Miss penalty mendominasi; miss rate kecil pun berdampak besar.
- **CPI = CPI dasar + (akses memori/instruksi) × miss rate × penalti**. Contoh: 1,0 + 1,3 × 0,02 × 100 = 3,6.
- Meningkatkan cache: blok lebih besar (compulsory), kapasitas (capacity), asosiativitas (conflict), multilevel (penalti), prefetching. Setiap perbaikan punya harga.
- Programmer dapat menolong lewat loop interchange, blocking, dan struktur data yang ramah cache.
`,
};
