export default {
  id: 'arsikom-superscalar',
  judul: 'Superscalar dan Out-of-Order Execution',
  tipe: 'teks',
  xp: 25,
  materi: `
# Superscalar dan Out-of-Order Execution 🚀

Pipeline membuat CPI mendekati **1** (satu instruksi selesai per siklus). Apakah bisa lebih baik? Ya: mengerjakan **lebih dari satu instruksi per siklus**. Inilah yang dilakukan CPU modern, dengan CPI jauh di bawah 1 (IPC 3–6 pada kode yang bersahabat).

## ILP: paralelisme tingkat instruksi

**ILP** (*Instruction-Level Parallelism*) adalah ukuran seberapa banyak instruksi dalam satu program yang **independen** dan dapat berjalan serentak.

~~~
1: a = b + c      ┐ 1, 2, 3 saling bebas → bisa dijalankan serentak
2: d = e * f      │
3: g = h - i      ┘
4: j = a + d      ← bergantung pada 1 dan 2 (RAW), harus menunggu
~~~

Kinerja diukur dengan **IPC** (*Instructions Per Cycle*) = 1 / CPI.

## Superscalar

CPU **superscalar** punya **beberapa unit eksekusi** dan dapat **mengeluarkan (issue) beberapa instruksi sekaligus** tiap siklus.

~~~
Siklus 1:  [IF: i1 i2]            ← fetch 2 instruksi sekaligus
Siklus 2:  [ID: i1 i2]
Siklus 3:  [EX: i1 | EX: i2]      ← 2 ALU bekerja paralel
~~~

**Lebar issue** (*issue width*): 2-way, 4-way, 6-way... Inti modern punya lebar 4–8 dan 4–12 unit eksekusi (ALU bilangan bulat, unit load/store, unit floating-point/vektor, unit cabang).

Contoh: pipeline 5 tahap, 2-way superscalar, 100 instruksi independen → hanya sekitar 50 + 4 = 54 siklus, IPC ≈ 1,85.

Namun instruksi **tidak selalu independen**. Hazard data semakin sering muncul, dan di sinilah teknik berikutnya berperan.

## In-order vs out-of-order

| | **In-order** | **Out-of-order (OoO)** |
| --- | --- | --- |
| Urutan eksekusi | Sesuai urutan program | Sesuai **ketersediaan operand** |
| Instruksi yang tertahan | Menghentikan semua di belakangnya | Instruksi lain yang siap tetap berjalan |
| Kerumitan | Sederhana, hemat daya | Rumit, besar, boros |
| Dipakai di | Inti hemat daya (little core), mikrokontroler | CPU kinerja tinggi (x86 modern, ARM big core) |

### Masalah pada in-order

~~~
1: lw  $t0, 0($s0)     ← cache miss! butuh 100 siklus
2: add $t1, $t0, $s1   ← bergantung pada 1 → harus menunggu
3: sub $t2, $s2, $s3   ← TIDAK bergantung, tapi tertahan di belakang 2
4: and $t3, $s4, $s5   ← juga bebas, tertahan
~~~

Pada in-order, instruksi 3 dan 4 menganggur 100 siklus, padahal bisa dikerjakan. OoO membiarkan 3 dan 4 **mendahului** 2.

## Cara kerja out-of-order (gambaran)

Alur umum (disederhanakan dari algoritma Tomasulo):

~~~
 In-order                 Out-of-order                    In-order
┌────────────────┐   ┌─────────────────────────┐   ┌──────────────┐
│ Fetch & decode │ → │ Issue queue / reservation│ → │ Commit (retire)│
│ Rename register│   │ stations + unit eksekusi │   │ via Reorder    │
│                │   │ (jalan saat operand siap)│   │ Buffer (ROB)   │
└────────────────┘   └─────────────────────────┘   └──────────────┘
~~~

1. **Fetch, decode, rename** berurutan.
2. Instruksi masuk **reservation station / issue queue** dan menunggu operandnya. Begitu operand siap, dieksekusi di unit yang tersedia, **tidak peduli urutannya**.
3. Hasil dikirim lewat **common data bus** ke instruksi yang menunggu (forwarding generalisasi).
4. Hasil dimasukkan ke **Reorder Buffer (ROB)**. Instruksi **dikomit (retire) berurutan** sesuai urutan program, dari kepala ROB. Hasil akhir yang terlihat programmer (register dan memori) tetap tampak seolah-olah dikerjakan berurutan. Ini menjaga **presisi exception**: bila instruksi ke-7 menyebabkan galat, instruksi ke-8 dan seterusnya tidak boleh sudah mengubah keadaan yang terlihat.

## Register renaming: menghilangkan WAR dan WAW

Ketergantungan **WAR** dan **WAW** sebenarnya bukan dependensi data sejati, hanya akibat **nama register yang sama dipakai ulang**. CPU memiliki lebih banyak register fisik (puluhan sampai ratusan) daripada register arsitektural (16–32), dan menugaskan register fisik baru untuk setiap penulisan.

~~~
Sebelum renaming:                Sesudah renaming (P = register fisik):
1: R1 = R2 + R3                  1: P10 = P2 + P3
2: R4 = R1 * R5   (RAW pada R1)  2: P11 = P10 * P5     (RAW sejati, tetap)
3: R1 = R6 + R7   (WAR dgn 2,    3: P12 = P6 + P7      (bebas! menulis P12, bukan P10)
                   WAW dgn 1)
~~~

Setelah renaming, instruksi 3 tidak lagi bergantung pada 1 atau 2 dan bisa dieksekusi **sebelum atau bersama** keduanya. Hanya RAW sejati yang tersisa.

## Eksekusi spekulatif dan komit

OoO hampir selalu digabung dengan **prediksi cabang**: CPU menebak arah cabang dan mengeksekusi instruksi di jalur tebakan jauh sebelum cabang selesai. Hasilnya ditahan di ROB. Jika tebakan **benar**, komit seperti biasa. Jika **salah**, seluruh entri spekulatif di ROB dibuang (*squash*) dan register rename dipulihkan. Jendela instruksi yang diawasi bisa mencapai **ratusan instruksi** (ROB berukuran 200–600 entri pada inti modern).

## Jalan lain: VLIW

Alih-alih hardware mencari paralelisme saat berjalan, **VLIW** (*Very Long Instruction Word*) menyerahkan tugas itu pada **kompilator**: satu "instruksi" panjang berisi beberapa operasi independen yang dijalankan paralel. Hardware sederhana, tetapi kode bergantung pada detail mikroarsitektur (Itanium Intel, DSP). Pendekatan OoO akhirnya lebih berhasil untuk CPU serbaguna.

## Batas-batas ILP

Meski hardware makin pintar, ILP dalam satu program terbatas (sekitar 2–4 pada kode umum):

- Ketergantungan data sejati (RAW).
- Cabang yang tidak dapat diprediksi dan miss cache (menunggu memori puluhan hingga ratusan siklus).
- Biaya hardware naik jauh lebih cepat daripada manfaatnya (*diminishing returns*), dan daya meningkat.

Karena itulah industri beralih ke **banyak inti** (thread-level parallelism) dan unit vektor, yang dibahas di Bab 10.

## Rangkuman

- **ILP** = potensi instruksi independen. **IPC** = 1 / CPI.
- **Superscalar**: banyak unit eksekusi dan issue beberapa instruksi per siklus, sehingga CPI < 1.
- **Out-of-order**: instruksi dijalankan saat operandnya siap, bukan menurut urutan program; **ROB** mengomit hasilnya berurutan agar tampak sekuensial dan exception tetap presisi.
- **Register renaming** menghilangkan ketergantungan palsu WAR dan WAW; hanya RAW sejati yang tersisa.
- OoO digabung dengan prediksi cabang dan **eksekusi spekulatif**. VLIW menyerahkan penjadwalan ke kompilator.
- ILP terbatas, sehingga industri beralih ke multicore.
`,
};
