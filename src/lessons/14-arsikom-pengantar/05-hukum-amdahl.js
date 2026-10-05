export default {
  id: 'arsikom-amdahl',
  judul: 'Hukum Amdahl & Prinsip Desain Kinerja',
  tipe: 'teks',
  xp: 15,
  materi: `
# Hukum Amdahl & Prinsip Desain Kinerja 📈

Bayangkan kamu punya anggaran untuk mempercepat komputer. Bagian mana yang sebaiknya diperbaiki? Memperbaiki bagian yang jarang dipakai walaupun hasilnya 100× lebih cepat nyaris tidak terasa. **Hukum Amdahl** menjadikan intuisi itu sebuah rumus.

## Rumus Amdahl

Misalkan sebuah program dibagi menjadi dua bagian:

- Fraksi **f** dari waktu eksekusi asli bisa dipercepat (*enhanced*).
- Sisanya, fraksi **(1 − f)**, tidak terpengaruh.
- Bagian yang bisa dipercepat dijalankan **s kali** lebih cepat.

Waktu eksekusi baru (relatif terhadap waktu lama = 1):

~~~
Waktu baru = (1 − f) + f / s
~~~

Sehingga percepatan keseluruhan (*speedup*):

~~~
Speedup = 1 / ((1 − f) + f / s)
~~~

### Contoh 1

Sebuah bagian yang memakan 80% waktu dipercepat 4 kali (f = 0,8; s = 4).

~~~
Speedup = 1 / (0,2 + 0,8/4) = 1 / (0,2 + 0,2) = 1 / 0,4 = 2,5
~~~

Walaupun bagian itu 4× lebih cepat, program secara keseluruhan hanya 2,5× lebih cepat.

### Contoh 2: percepatan tak terhingga pun ada batasnya

Dengan f = 0,8, bagaimana jika s sangat besar (s → ∞)?

~~~
Speedup maksimum = 1 / (1 − f) = 1 / 0,2 = 5
~~~

Sisa 20% yang tidak bisa dipercepat menjadi **batas atas**. Seberapapun cepatnya bagian paralel, program tidak akan lebih dari 5× lebih cepat.

| f (bagian yang dipercepat) | Batas speedup 1/(1−f) |
| --- | --- |
| 50% | 2 |
| 75% | 4 |
| 90% | 10 |
| 95% | 20 |
| 99% | 100 |

Untuk memanfaatkan 100 inti secara efektif, program harus **99% paralel**. Itu sangat sulit.

### Contoh 3: memilih perbaikan

Program memakai 70% waktu untuk operasi A dan 30% untuk operasi B. Mana lebih menguntungkan?

- Mempercepat A sebesar 2×: speedup = 1 / (0,3 + 0,7/2) = 1 / 0,65 ≈ **1,54**.
- Mempercepat B sebesar 10×: speedup = 1 / (0,7 + 0,3/10) = 1 / 0,73 ≈ **1,37**.

Perbaikan 2× pada bagian dominan **mengalahkan** perbaikan 10× pada bagian kecil.

## Penerapan pada paralelisme

Jika bagian paralel dijalankan pada N prosesor, s = N. Misalnya 90% program paralel (f = 0,9):

| Jumlah inti N | Speedup = 1/(0,1 + 0,9/N) |
| --- | --- |
| 2 | 1,82 |
| 4 | 3,08 |
| 8 | 4,71 |
| 16 | 6,40 |
| ∞ | 10 |

Menggandakan inti dari 8 ke 16 hanya menaikkan speedup dari 4,71 menjadi 6,40 (bukan 2×), dan makin lama makin sedikit manfaatnya (*diminishing returns*).

### Hukum Gustafson: pandangan yang lebih optimis

Amdahl mengasumsikan **ukuran masalah tetap**. Gustafson (1988) mencatat bahwa dengan komputer lebih besar, orang biasanya menyelesaikan **masalah yang lebih besar** (simulasi lebih halus, data lebih banyak), dan bagian serialnya relatif mengecil. Jika α adalah fraksi serial pada mesin paralel, *scaled speedup* untuk N prosesor:

~~~
Speedup = N − α × (N − 1)
~~~

Dengan 16 inti dan α = 0,1: 16 − 0,1 × 15 = **14,5**. Kedua hukum tidak bertentangan: mereka menjawab pertanyaan berbeda ("mempercepat tugas yang sama" vs "menyelesaikan tugas yang lebih besar dalam waktu sama").

## Prinsip-prinsip desain yang berkinerja baik

Dari Amdahl dan pengalaman puluhan tahun, lahir beberapa pedoman:

1. **Percepat kasus yang umum** (*make the common case fast*). Optimalkan hal yang paling sering terjadi (misalnya akses cache yang hit, instruksi sederhana), karena itu yang paling berpengaruh.
2. **Manfaatkan paralelisme.** Lakukan banyak hal sekaligus: pipeline, banyak inti, banyak unit eksekusi.
3. **Manfaatkan lokalitas.** Program cenderung memakai ulang data/instruksi yang barusan dipakai (*temporal*) dan data di dekatnya (*spatial*). Dasar dari cache (Bab 8).
4. **Hirarki memori.** Memori kecil-cepat di dekat CPU, besar-lambat di kejauhan, sehingga terasa cepat sekaligus besar sekaligus murah.
5. **Sederhana itu cepat** (prinsip RISC). Instruksi yang teratur memudahkan pipeline.

### Efisiensi energi

Hari ini kinerja juga dibatasi **daya dan panas**. Ukuran modern adalah **kinerja per watt**. Karena daya dinamis ∝ V² × f, menurunkan frekuensi sedikit dapat menghemat daya banyak. Itulah alasan HP memakai banyak inti hemat daya (*little*) bersama inti cepat (*big*), seperti arsitektur ARM big.LITTLE.

## Rangkuman

- **Hukum Amdahl**: Speedup = 1 / ((1 − f) + f / s). Bagian yang tidak bisa dipercepat membatasi hasil keseluruhan: batas maksimum 1 / (1 − f).
- Mempercepat bagian dominan (f besar) lebih berguna daripada mempercepat bagian kecil berkali-kali lipat.
- Menambah inti memberi manfaat yang makin kecil jika masih ada bagian serial. Hukum **Gustafson** melihatnya dari sisi masalah yang ikut membesar.
- Pedoman desain: percepat kasus umum, manfaatkan paralelisme dan lokalitas, gunakan hirarki memori, dan perhatikan energi.
`,
};
