export default {
  id: 'arsikom-gpu',
  judul: 'GPU: Arsitektur Throughput',
  tipe: 'teks',
  xp: 25,
  materi: `
# GPU: Arsitektur Throughput 🎮

**GPU** (*Graphics Processing Unit*) dirancang awalnya untuk menggambar grafik 3D: menghitung warna jutaan piksel, tiap piksel dengan rumus yang sama. Karakter pekerjaan ini, **banyak data dengan operasi serupa**, membuat GPU berevolusi menjadi mesin paralel masif yang kini menjalankan hampir seluruh pelatihan kecerdasan buatan dan komputasi ilmiah.

## Dua filosofi desain: latensi vs throughput

| | **CPU** (optimasi **latensi**) | **GPU** (optimasi **throughput**) |
| --- | --- | --- |
| Tujuan | Selesaikan **satu** tugas secepat mungkin | Selesaikan **sebanyak mungkin** tugas per detik |
| Jumlah inti | Sedikit (4–64), kompleks | Ribuan (mis. 10.000+), sederhana |
| Kontrol | Out-of-order, prediksi cabang canggih, cache besar | Kontrol sederhana, cache kecil |
| Menutupi latensi memori | Cache besar + out-of-order + spekulasi | **Mengganti thread**: ketika satu menunggu memori, jalankan yang lain |
| Area chip | Banyak untuk kontrol dan cache | Banyak untuk **unit hitung (ALU)** |
| Cocok untuk | Logika bercabang, kode serial, OS | Aritmetika masif seragam (grafik, matriks, AI) |

Analogi: CPU = beberapa matematikawan jenius yang menyelesaikan soal sulit satu-satu. GPU = ribuan siswa yang masing-masing mengerjakan soal sederhana yang sama pada angka berbeda.

## Struktur GPU

~~~
 GPU
 ├── SM 0 (Streaming Multiprocessor)
 │     ├── Banyak "core" (unit ALU/FP) — mis. 128 per SM
 │     ├── Register file besar
 │     ├── Shared memory (SRAM cepat, dikelola programmer)
 │     └── Penjadwal warp
 ├── SM 1
 ├── ... (puluhan sampai >100 SM)
 └── Memori global (GDDR6/HBM), bandwidth 500 GB/s – beberapa TB/s
~~~

Contoh: GPU kelas atas memiliki lebih dari 16.000 core CUDA yang disusun dalam ±128 SM. AMD memakai istilah *Compute Unit*, Apple *GPU core*.

## Model eksekusi: SIMT dan warp

GPU memakai **SIMT** (*Single Instruction, Multiple Threads*), variasi SIMD:

- Programmer menulis kode untuk **satu thread** (sebuah *kernel*).
- GPU meluncurkan **ribuan hingga jutaan thread**.
- Thread dikelompokkan menjadi **warp** (NVIDIA: **32** thread; AMD: *wavefront* 32/64). **Seluruh thread dalam satu warp mengeksekusi instruksi yang sama pada saat yang sama** (pada data berbeda).

Contoh kernel penjumlahan vektor (CUDA):

~~~c
__global__ void tambah(float *a, float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // indeks unik thread ini
    if (i < n) c[i] = a[i] + b[i];                   // tiap thread mengerjakan SATU elemen
}

// peluncuran: 1 juta thread, tiap blok 256 thread
tambah<<<(n + 255) / 256, 256>>>(a, b, c, n);
~~~

Tidak ada loop: **loop-nya adalah jutaan thread**.

### Divergensi warp

Jika thread-thread dalam satu warp mengambil jalur **berbeda** pada \`if\`, hardware mengeksekusi kedua jalur **berurutan** dan mematikan thread yang tidak terlibat. Warp berisi 32 thread yang separuh masuk \`if\` dan separuh \`else\` memakan **dua kali waktu**. Kode GPU yang efisien menghindari percabangan yang berbeda dalam satu warp (kelemahan GPU pada logika bercabang).

## Menyembunyikan latensi dengan banyak thread

Akses memori global membutuhkan ±400–800 siklus. CPU menutupinya dengan cache dan out-of-order. GPU memakai cara lain: **terlalu banyak thread siap berjalan**. Ketika satu warp menunggu data, penjadwal **langsung berpindah ke warp lain** dengan biaya nol (register tiap thread tetap tersimpan di register file besar, tidak perlu disimpan/dipulihkan). Selama cukup banyak warp, unit hitung tidak pernah menganggur. Kuncinya adalah **paralelisme sangat besar**; GPU dengan sedikit thread justru lambat.

## Hierarki memori GPU

| Memori | Ukuran | Kecepatan | Dikelola oleh |
| --- | --- | --- | --- |
| **Register** | Ratusan KB per SM | Tercepat | Per thread |
| **Shared memory** | 48–228 KB per SM | Sangat cepat (SRAM) | **Programmer**, dipakai bersama satu blok thread |
| **Cache L1/L2** | Beberapa MB (L2) | Cepat | Hardware |
| **Memori global** (GDDR/HBM) | 8–80+ GB | Lambat (latensi tinggi) tetapi **bandwidth tinggi** (0,5–3 TB/s) | Seluruh thread |

Prinsip optimasi: **gabungkan akses** (*coalescing*): thread yang bersebelahan harus mengakses alamat yang bersebelahan agar menjadi satu transaksi besar. Mirip lokalitas spasial pada CPU. Gunakan shared memory untuk memakai ulang data (seperti *blocking* di Bab 8).

## Bottleneck: memindahkan data

GPU yang terpisah (kartu diskret) memiliki memori sendiri dan terhubung lewat **PCIe** (±32 GB/s untuk x16 Gen4), jauh lebih lambat daripada bandwidth memori GPU sendiri (ratusan GB/s sampai TB/s). Menyalin data ke GPU bisa lebih lama daripada menghitungnya bila komputasi ringan:

~~~
Contoh: kirim 1 GB data ke GPU lewat PCIe 4.0 x16 ≈ 1 / 30 ≈ 33 ms
        menghitungnya di GPU mungkin hanya 2 ms → transfer mendominasi
~~~

Aturan emas: **pindahkan data sedikit, lakukan komputasi banyak** (*arithmetic intensity* tinggi). Perkalian matriks adalah contoh ideal: O(n³) operasi untuk O(n²) data. Sistem **memori terpadu** (Apple Silicon, konsol game, APU) membuat CPU dan GPU berbagi memori yang sama sehingga tidak perlu menyalin.

## Kenapa GPU penting untuk AI?

Jaringan saraf didominasi **perkalian matriks** dan operasi elemen-demi-elemen, yaitu paralelisme data murni. GPU modern menambahkan **unit khusus** (*Tensor Core*) yang mengerjakan perkalian-akumulasi matriks kecil (mis. 4×4) dalam satu instruksi pada presisi rendah (FP16/BF16/INT8). Kombinasi itu membuat pelatihan model ratusan kali lebih cepat daripada CPU.

~~~python
# PyTorch: satu baris memindahkan perhitungan ke GPU
import torch
a = torch.randn(4096, 4096, device="cuda")
b = torch.randn(4096, 4096, device="cuda")
c = a @ b        # perkalian matriks 4096×4096 dijalankan ribuan core paralel
~~~

## Kapan memakai GPU, kapan CPU?

| Tugas | Cocok |
| --- | --- |
| Perkalian matriks, konvolusi, simulasi fisika, rendering | **GPU** |
| Logika bisnis penuh \`if\`, akses data acak, struktur pohon/graf tak teratur | **CPU** |
| Banyak data kecil dengan operasi sederhana yang berbeda-beda | CPU |
| Operasi bergantung berantai (serial) | CPU |

Hukum Amdahl berlaku: bagian serial program tetap dijalankan CPU, GPU hanya mempercepat bagian paralel dan transfer data mengurangi manfaatnya.

## Rangkuman

- **CPU**: sedikit inti kompleks, optimasi **latensi**. **GPU**: ribuan inti sederhana, optimasi **throughput**.
- Model **SIMT**: kernel ditulis per thread; thread dikelompokkan dalam **warp** (32) yang menjalankan instruksi sama. **Divergensi** warp memperlambat.
- GPU menyembunyikan latensi dengan **banyak warp**, bukan cache/OoO. Hierarki: register → shared memory → L1/L2 → memori global (bandwidth TB/s). **Coalescing** penting.
- Transfer data CPU↔GPU lewat PCIe sering menjadi bottleneck; tinggikan **arithmetic intensity**.
- GPU unggul untuk perkalian matriks dan AI (Tensor Core); kode bercabang dan serial lebih cocok untuk CPU.
`,
};
