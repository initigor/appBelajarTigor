export default {
  id: 'arsikom-hazard-kontrol',
  judul: 'Hazard Kontrol dan Prediksi Cabang',
  tipe: 'teks',
  xp: 25,
  materi: `
# Hazard Kontrol dan Prediksi Cabang 🔮

Pipeline berjalan baik selama instruksi berikutnya bisa ditebak: yaitu instruksi tepat sesudahnya. **Lompat bersyarat** (\`if\`, loop) mengganggu hal ini. Pipeline sudah terlanjur memasukkan instruksi berikutnya sebelum hasil percabangan diketahui. Itulah **hazard kontrol** (*branch hazard*).

## Masalahnya

~~~
beq $s0, $s1, Target     # percabangan: apakah lompat? baru diketahui di tahap EX (atau MEM)
add ...                  # sudah di-fetch! (benar kalau TIDAK lompat)
sub ...                  # sudah di-fetch juga
...
~~~

~~~
Siklus:   1  2  3  4  5  6  7
beq:     IF ID EX ME WB
i+1:        IF ID ..           ← harus dibuang jika ternyata lompat
i+2:           IF ..           ← juga dibuang
Target:           IF ID EX ...  ← baru bisa mulai di siklus 4/5
~~~

Jika percabangan diputuskan di tahap EX, setidaknya **2 instruksi salah** sudah masuk pipeline dan harus dibuang (*flush*). Itu **penalti cabang** (*branch penalty*): siklus yang terbuang. Pada pipeline dalam 15–20 tahap, penaltinya bisa 15–20 siklus.

Dalam program nyata, kira-kira **1 dari 5 instruksi adalah percabangan**, jadi ini masalah besar.

## Strategi penanganan

### 1. Stall sampai diketahui

Hentikan fetch sampai cabang selesai. Aman, tetapi **selalu** kena penalti, baik cabang diambil maupun tidak.

### 2. Memajukan keputusan cabang

Pindahkan perbandingan dan penghitungan alamat target ke tahap **ID** (dengan komparator dan penjumlah tambahan). Penalti turun jadi 1 siklus, tetapi hazard data jadi lebih rumit.

### 3. Prediksi "tidak diambil" (predict not taken)

Teruskan fetch seolah-olah cabang **tidak** terjadi. Jika benar: nol penalti. Jika salah: flush instruksi yang salah (penalti penuh).

### 4. Delayed branch

Instruksi tepat setelah cabang (*branch delay slot*) **selalu dieksekusi** apa pun hasilnya. Kompilator mengisi slot itu dengan instruksi bermanfaat. MIPS klasik memakainya. ISA modern tidak karena pipeline makin dalam.

### 5. Prediksi cabang dinamis (dominan saat ini)

CPU **menebak dari riwayat**: apakah cabang ini cenderung diambil atau tidak?

## Prediktor dinamis

### Prediktor 1-bit

Satu bit per cabang: "terakhir kali diambil (T) atau tidak (N)?" Prediksi = hasil terakhir.

Masalah pada **loop**: setiap kali loop selesai (satu N) lalu dimulai lagi, prediksi salah **dua kali**: sekali di akhir loop (diprediksi T, ternyata N), sekali di awal loop berikutnya (diprediksi N, ternyata T).

### Prediktor 2-bit (saturating counter)

Gunakan penghitung 2 bit berjenuh. Prediksi berubah hanya setelah **dua** kesalahan berturut-turut:

~~~
Keadaan:  00 = Strongly Not Taken   01 = Weakly Not Taken
          10 = Weakly Taken         11 = Strongly Taken

Prediksi "diambil" bila keadaan ≥ 10.
Jika cabang diambil: keadaan + 1 (maks 11).
Jika tidak diambil: keadaan − 1 (min 00).
~~~

**Contoh:** pola cabang (loop 3 iterasi): T, T, T, N, T, T, T, N, ... (T = diambil, N = tidak).

| | 1-bit | 2-bit (mulai di 10) |
| --- | --- | --- |
| T (benar?) | ✓ | ✓ → 11 |
| T | ✓ | ✓ → 11 |
| T | ✓ | ✓ → 11 |
| N | ✗ (diprediksi T) → N | ✗ (diprediksi T) → 10 |
| T | ✗ (diprediksi N) → T | ✓ (diprediksi T) → 11 |
| T | ✓ | ✓ → 11 |
| T | ✓ | ✓ → 11 |
| N | ✗ | ✗ → 10 |
| **Salah per 4 kejadian** | **2** | **1** |

Prediktor 2-bit hanya salah **sekali** per putaran loop, jauh lebih baik. Prediktor modern (*two-level adaptive*, *TAGE*, *perceptron*) menggunakan **riwayat beberapa cabang terakhir** sebagai konteks dan mencapai akurasi **95–99%** pada program umum.

### Branch Target Buffer (BTB)

Prediksi arah (diambil/tidak) belum cukup: pada tahap IF, CPU belum men-decode instruksi, jadi tidak tahu itu cabang dan **ke mana** targetnya. **BTB** adalah cache kecil yang menyimpan *alamat cabang → alamat target* dari cabang yang pernah dieksekusi. Pada fetch, jika alamat PC cocok dengan entri BTB, target langsung diprediksi tanpa menunggu decode.

## Biaya misprediksi: contoh hitungan

Misalkan:

- 20% dari instruksi adalah cabang.
- Prediktor 95% benar (5% salah).
- Penalti misprediksi: 15 siklus.
- CPI dasar tanpa penalti: 1.

~~~
Tambahan CPI = frekuensi cabang × tingkat salah × penalti
             = 0,20 × 0,05 × 15 = 0,15
CPI total = 1 + 0,15 = 1,15
~~~

Bandingkan jika selalu stall 15 siklus untuk setiap cabang tanpa prediksi:

~~~
Tambahan CPI = 0,20 × 15 = 3,0     →  CPI = 4,0
~~~

Prediksi cabang menurunkan CPI dari 4,0 menjadi 1,15, hampir **3,5 kali** lebih cepat.

Jika akurasi turun menjadi 90%: tambahan = 0,20 × 0,10 × 15 = 0,30 (CPI 1,30). Setiap persen akurasi sangat berharga pada pipeline dalam.

## Konsekuensi untuk programmer

Kode yang percabangannya sulit ditebak (data acak) lebih lambat daripada yang pola cabangnya teratur. Contoh terkenal:

~~~c
// Menjumlahkan elemen >= 128. Hasilnya SAMA, tetapi kecepatan berbeda 3–6×
// tergantung apakah array diurutkan atau acak.
for (i = 0; i < n; i++)
    if (data[i] >= 128) jumlah += data[i];
~~~

Jika \`data\` **diurutkan**, cabang berpola (semua N lalu semua T) dan hampir selalu benar diprediksi. Jika **acak**, prediktor menebak ±50% dan terkena penalti berulang. Beberapa kompiler mengganti cabang dengan instruksi *conditional move* (\`cmov\`) agar tidak ada percabangan sama sekali.

## Eksekusi spekulatif

Menebak lalu **mengeksekusi** instruksi di jalur tebakan sebelum tahu benar atau tidak disebut **eksekusi spekulatif**. Jika tebakan benar: dapat keuntungan waktu. Jika salah: hasil spekulatif dibuang. Teknik ini sangat bermanfaat, tetapi juga sumber kerentanan keamanan **Spectre** (2018): jejak spekulasi yang salah masih tersisa di cache dan bisa dibaca penyerang.

## Rangkuman

- **Hazard kontrol**: instruksi setelah cabang sudah masuk pipeline sebelum hasil cabang diketahui; salah tebak = flush dan penalti.
- Strategi: stall, majukan keputusan ke ID, **predict not taken**, delayed branch, dan **prediksi dinamis**.
- **Prediktor 2-bit** (saturating counter) hanya salah sekali per loop, lebih baik daripada 1-bit (dua kali). **BTB** menyimpan target cabang.
- Tambahan CPI = frekuensi cabang × tingkat salah × penalti (contoh 0,2 × 0,05 × 15 = 0,15).
- Eksekusi spekulatif mempercepat tetapi membuka celah seperti Spectre.
`,
};
