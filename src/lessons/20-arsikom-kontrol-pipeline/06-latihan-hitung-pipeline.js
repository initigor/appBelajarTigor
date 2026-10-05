export default {
  id: 'arsikom-pipeline-hitung',
  judul: 'Latihan Berhitung: Siklus dan CPI Pipeline',
  tipe: 'teks',
  xp: 25,
  materi: `
# Latihan Berhitung: Siklus dan CPI Pipeline 🧮

Soal ujian tentang pipeline hampir selalu berupa **hitungan**: berapa siklus, berapa stall, berapa CPI, berapa speedup. Pelajaran ini adalah kumpulan contoh terselesaikan lengkap dengan langkahnya. Kerjakan tiap soal sendiri di kertas sebelum membaca jawabannya.

## Rumus yang dipakai

~~~
Siklus pipeline ideal = k + (n − 1)              (k tahap, n instruksi)
Siklus tanpa pipeline = n × k
Speedup               = (n × k) / (k + n − 1)    → k bila n besar
CPI                   = 1 + (rata-rata stall per instruksi)
Waktu CPU             = IC × CPI × T
~~~

## Soal 1: siklus pipeline ideal

**Berapa siklus untuk menjalankan 50 instruksi pada pipeline 5 tahap tanpa hazard? Berapa speedup dibanding tanpa pipeline?**

~~~
Dengan pipeline: 5 + 49 = 54 siklus
Tanpa pipeline : 50 × 5 = 250 siklus
Speedup = 250 / 54 ≈ 4,63
~~~

## Soal 2: waktu tahap tidak seimbang

Waktu tahap: IF = 250 ps, ID = 150 ps, EX = 300 ps, MEM = 200 ps, WB = 100 ps. **Hitung periode clock pipeline, waktu tanpa pipeline per instruksi, dan speedup untuk n besar.**

~~~
Periode clock pipeline = tahap terlama = 300 ps (EX)
Waktu per instruksi tanpa pipeline = 250+150+300+200+100 = 1000 ps
Speedup (n besar) = 1000 / 300 ≈ 3,33
~~~

Walaupun 5 tahap, speedup hanya 3,33 karena tahap tidak seimbang. Memecah EX menjadi dua tahap 150 ps akan menurunkan clock ke 250 ps (tahap IF terlama), speedup 1000/250 = 4 (dengan 6 tahap).

## Soal 3: hazard RAW tanpa forwarding

~~~
add $t0, $s1, $s2
sub $t3, $t0, $s4
~~~

**Berapa siklus total kedua instruksi tanpa forwarding (register file: tulis di paruh pertama, baca di paruh kedua)?**

~~~
Siklus:   1  2  3  4  5  6  7  8
add:     IF ID EX ME WB
sub:        IF -- -- ID EX ME WB
~~~

\`add\` menulis \`$t0\` di siklus 5 (WB). \`sub\` baru bisa membaca di ID pada siklus 5 sehingga ada **2 stall**. \`sub\` selesai di siklus **8**. Total **8 siklus** (ideal untuk 2 instruksi = 6).

## Soal 4: dengan forwarding

Kode yang sama dengan forwarding penuh: hasil add (akhir EX siklus 3) diteruskan ke EX sub (siklus 4).

~~~
Siklus:   1  2  3  4  5  6
add:     IF ID EX ME WB
sub:        IF ID EX ME WB      ← tanpa stall
~~~

Total **6 siklus**, tanpa penundaan.

## Soal 5: load-use

~~~
lw  $t0, 0($s1)
add $t2, $t0, $s2
~~~

**Berapa siklus dengan forwarding penuh?**

~~~
Siklus:   1  2  3  4  5  6  7
lw:      IF ID EX ME WB
add:        IF ID -- EX ME WB      ← 1 stall (data lw baru ada setelah MEM di siklus 4)
~~~

Total **7 siklus**. Tanpa forwarding akan 8 siklus (2 stall).

## Soal 6: urutan tiga instruksi dengan beberapa hazard

~~~
1: lw  $t0, 0($s0)
2: add $t1, $t0, $s1     # load-use pada 1
3: sub $t2, $t1, $s2     # RAW pada 2 (ALU→ALU)
4: sw  $t2, 4($s0)       # RAW pada 3 (ALU→store)
~~~

Dengan forwarding penuh, hanya hazard load-use (1→2) yang menyebabkan stall. Hazard 2→3 dan 3→4 diselesaikan forwarding.

~~~
Siklus:   1  2  3  4  5  6  7  8  9
1 lw:    IF ID EX ME WB
2 add:      IF ID -- EX ME WB
3 sub:         IF -- ID EX ME WB
4 sw:             -- IF ID EX ME WB
~~~

Total **9 siklus** (ideal 4 instruksi = 8; 1 stall). CPI = 9 / 4 = **2,25** untuk potongan kecil ini (angka besar karena pengisian pipeline). Untuk program panjang, CPI ≈ 1 + 1/4 = 1,25 dari stall ini saja.

## Soal 7: CPI dari proporsi hazard

Sebuah program memiliki 25% instruksi \`lw\`. Dari seluruh \`lw\`, 40% langsung diikuti instruksi yang memakai hasilnya (load-use, 1 stall dengan forwarding). Cabang 20% dari instruksi, 10% di antaranya salah prediksi dengan penalti 3 siklus.

~~~
Stall load-use per instruksi = 0,25 × 0,40 × 1 = 0,10
Stall cabang per instruksi   = 0,20 × 0,10 × 3 = 0,06
CPI = 1 + 0,10 + 0,06 = 1,16
~~~

**Berapa speedup pipeline dibanding mesin multi-cycle dengan CPI = 4,5 pada clock yang sama?** 4,5 / 1,16 ≈ **3,88**.

## Soal 8: waktu eksekusi

Program: IC = 2 × 10⁹, CPI = 1,16, clock 2,5 GHz.

~~~
Waktu CPU = IC × CPI / f = (2×10⁹ × 1,16) / (2,5×10⁹) = 0,928 detik
~~~

## Soal 9: apakah pipeline lebih dalam selalu lebih baik?

Pipeline A: 5 tahap, clock 2 GHz (0,5 ns), CPI 1,2. Pipeline B: 10 tahap, clock 3,5 GHz, penalti cabang lebih besar sehingga CPI 1,6. Program sama (IC sama).

~~~
Waktu per instruksi A = 1,2 × 0,5 ns = 0,600 ns
Waktu per instruksi B = 1,6 / 3,5 GHz ≈ 0,457 ns
~~~

B masih lebih cepat (0,600 / 0,457 ≈ 1,31×). Tetapi jika CPI B naik jadi 2,2, waktunya 0,629 ns, lebih lambat dari A. **Keuntungan clock lebih tinggi tergerus oleh CPI yang naik**, itu pelajaran dari era Pentium 4.

## Strategi mengerjakan soal pipeline

1. **Gambar diagram pipeline** (baris instruksi × kolom siklus). Jangan menghitung di kepala.
2. Tandai dependensi **RAW** (register tujuan instruksi awal yang dibaca instruksi berikutnya). Perhatikan jaraknya (berurutan atau ada instruksi di antaranya).
3. Tentukan stall: tanpa forwarding, ALU→ALU berurutan 2 stall (1 stall bila ada satu instruksi di antara); dengan forwarding, hanya load-use 1 stall.
4. Total siklus = k + (n − 1) + jumlah stall.
5. CPI = total siklus / n (atau 1 + stall rata-rata).

## Rangkuman

- Siklus pipeline = **k + n − 1 + stall**; speedup ideal → k, tetapi dibatasi tahap terlama dan stall.
- Tanpa forwarding: RAW berurutan = 2 stall. Dengan forwarding: ALU→ALU 0 stall, **load-use 1 stall**.
- **CPI = 1 + Σ(frekuensi × tingkat kejadian × penalti)** (load-use, cabang salah prediksi).
- Waktu CPU = IC × CPI / f. Pipeline lebih dalam menaikkan clock tetapi dapat menaikkan CPI; yang penting adalah hasil akhir waktu per instruksi.
`,
};
