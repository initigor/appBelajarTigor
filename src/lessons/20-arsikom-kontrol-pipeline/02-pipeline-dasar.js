export default {
  id: 'arsikom-pipeline',
  judul: 'Pipeline Dasar: Lima Tahap dan Speedup',
  tipe: 'teks',
  xp: 25,
  materi: `
# Pipeline Dasar: Lima Tahap dan Speedup 🏭

Bayangkan mencuci pakaian dengan 4 tahap: cuci, kering, setrika, lipat. Dengan satu orang, tiap beban baru dimulai setelah beban sebelumnya **selesai** semua tahap. Dengan **pipeline**, begitu beban pertama pindah ke mesin pengering, beban kedua masuk mesin cuci. Semua mesin bekerja sekaligus, dan satu beban selesai setiap satu tahap, bukan setiap empat tahap.

CPU melakukan hal yang persis sama pada instruksi. Inilah teknik **terpenting** untuk kinerja CPU sejak 1980-an.

## Lima tahap klasik (MIPS)

Instruksi dipecah menjadi tahap-tahap yang masing-masing dikerjakan oleh bagian hardware berbeda:

| Tahap | Singkatan | Pekerjaan |
| --- | --- | --- |
| 1. Instruction Fetch | **IF** | Ambil instruksi dari memori (alamat PC), PC ← PC + 4 |
| 2. Instruction Decode | **ID** | Decode, baca register sumber dari register file |
| 3. Execute | **EX** | ALU menghitung (operasi atau alamat memori) |
| 4. Memory access | **MEM** | LOAD/STORE mengakses memori data |
| 5. Write Back | **WB** | Tulis hasil kembali ke register |

Antar-tahap dipasang **register pipeline** (IF/ID, ID/EX, EX/MEM, MEM/WB) untuk menyimpan hasil sementara sehingga tiap tahap bisa mengerjakan instruksi berbeda pada clock yang sama.

## Diagram waktu (pipeline diagram)

Tiap baris = satu instruksi, tiap kolom = satu siklus clock.

**Tanpa pipeline** (satu instruksi selesai dulu): 5 siklus per instruksi.

~~~
Siklus:   1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
Instr 1: IF ID EX ME WB
Instr 2:                IF ID EX ME WB
Instr 3:                               IF ID EX ME WB
~~~

**Dengan pipeline**: instruksi baru masuk tiap siklus.

~~~
Siklus:   1  2  3  4  5  6  7
Instr 1: IF ID EX ME WB
Instr 2:    IF ID EX ME WB
Instr 3:       IF ID EX ME WB
~~~

Tiga instruksi selesai dalam **7 siklus** (bukan 15). Pada siklus 5 lima tahap sedang sibuk sekaligus (IF instruksi 5, dst. bila lebih banyak).

## Menghitung kinerja

Untuk pipeline dengan **k tahap** dan **n instruksi** (tanpa hazard, tiap tahap 1 siklus):

~~~
Siklus tanpa pipeline = n × k
Siklus dengan pipeline = k + (n − 1)
~~~

(k siklus untuk instruksi pertama menembus semua tahap, lalu tiap siklus berikutnya selesai satu instruksi.)

**Contoh:** k = 5, n = 100.

~~~
Tanpa pipeline: 100 × 5 = 500 siklus
Dengan pipeline: 5 + 99 = 104 siklus
Speedup = 500 / 104 ≈ 4,81
~~~

Untuk n sangat besar, speedup mendekati **k** (jumlah tahap): speedup ideal = k. CPI mendekati **1**, padahal tanpa pipeline multi-cycle CPI ≈ 5.

### Pipeline tidak mempercepat satu instruksi

Satu instruksi tetap melewati k tahap. **Latensi** tidak turun (malah bisa naik sedikit karena overhead register pipeline), tetapi **throughput** naik sampai k kali. Ini perbedaan latensi vs throughput dari Bab 1.

## Pengaruh waktu tiap tahap

Periode clock harus muat untuk tahap **terlama**. Misalkan waktu tiap tahap (contoh klasik):

| Tahap | IF | ID | EX | MEM | WB |
| --- | --- | --- | --- | --- | --- |
| Waktu (ps) | 200 | 100 | 200 | 200 | 100 |

- **Single-cycle**: satu instruksi (lw) memakai semua tahap = 200+100+200+200+100 = **800 ps**; clock = 800 ps.
- **Pipeline**: clock = tahap terlama = **200 ps**.

Speedup untuk n instruksi besar = 800 / 200 = **4**, **bukan 5** (padahal ada lima tahap), karena tahap tidak seimbang. Tahap pendek (ID, WB) menganggur sebagian waktunya.

**Contoh 3 instruksi \`lw\`:**

~~~
Tanpa pipeline: 3 × 800 = 2400 ps
Dengan pipeline: (5 + 3 − 1) × 200 = 7 × 200 = 1400 ps   → speedup 1,71
~~~

Untuk n kecil, waktu pengisian pipeline (*fill time*) masih besar sehingga speedup belum maksimum. Untuk 1.000.000 instruksi: 800 ps × 10⁶ vs ≈ 200 ps × 10⁶ → speedup ≈ 4.

### Cara meningkatkan speedup

1. **Seimbangkan tahap**: pecah tahap panjang menjadi lebih pendek. Itulah mengapa CPU modern punya pipeline dalam (Pentium 4: 20–31 tahap, inti modern 14–20).
2. Tambah tahap membuat clock lebih cepat tetapi memperbesar **penalti** saat pipeline harus dikosongkan (hazard kontrol).

## Mengapa ISA RISC cocok untuk pipeline?

- **Panjang instruksi tetap**: IF langsung tahu posisi instruksi berikutnya.
- **Format seragam**: ID dapat membaca register sambil men-decode.
- **Load/store**: akses memori hanya di satu tahap (MEM), sedangkan operasi ALU di tahap EX. Pada CISC dengan operand memori, kedua kebutuhan bertabrakan.
- **Operand memori selaras (aligned)**: satu akses cukup.

## Hal-hal yang bisa mengganggu pipeline: hazard

Ideal CPI = 1 hanya jika instruksi saling bebas. Kenyataannya ada tiga jenis **hazard** yang memaksa pipeline berhenti (*stall*), dibahas pada dua pelajaran berikutnya:

1. **Structural hazard**: dua instruksi butuh sumber daya hardware yang sama pada saat yang sama.
2. **Data hazard**: instruksi butuh hasil dari instruksi sebelumnya yang belum selesai.
3. **Control hazard**: instruksi lompat belum diketahui hasilnya, sedangkan instruksi berikutnya sudah terlanjur masuk pipeline.

CPI sebenarnya: **CPI = 1 + (stall rata-rata per instruksi)**.

## Rangkuman

- Pipeline membagi eksekusi instruksi menjadi tahap (IF, ID, EX, MEM, WB) yang berjalan **tumpang tindih** pada instruksi berbeda.
- Siklus tanpa pipeline = n × k; dengan pipeline = **k + n − 1**. Speedup ideal → k, CPI → 1.
- Pipeline meningkatkan **throughput**, bukan latensi satu instruksi.
- Periode clock = waktu tahap **terlama**; tahap yang tidak seimbang membuat speedup < k (mis. 800/200 = 4, bukan 5).
- Hazard (struktural, data, kontrol) menyebabkan stall sehingga CPI > 1.
`,
};
