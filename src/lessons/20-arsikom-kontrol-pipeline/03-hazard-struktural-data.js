export default {
  id: 'arsikom-hazard-data',
  judul: 'Hazard Struktural dan Hazard Data (Forwarding)',
  tipe: 'teks',
  xp: 25,
  materi: `
# Hazard Struktural dan Hazard Data (Forwarding) ⚠️

**Hazard** adalah situasi di mana instruksi berikutnya **tidak boleh** dieksekusi pada siklus yang seharusnya, sehingga pipeline harus menunggu (*stall*) atau mengambil tindakan khusus. Pelajaran ini membahas dua jenis pertama.

## 1. Hazard struktural

Dua instruksi memerlukan **sumber daya hardware yang sama** pada siklus yang sama.

**Contoh klasik:** satu memori untuk instruksi dan data. Ketika instruksi \`lw\` berada di tahap MEM (mengakses data), instruksi ke-4 setelahnya berada di tahap IF (mengambil instruksi). Keduanya butuh memori pada siklus yang sama.

~~~
Siklus:   1  2  3  4  5  6
lw:      IF ID EX ME WB
i2:         IF ID EX ME WB
i3:            IF ID EX ME WB
i4:               IF ID EX ME WB   ← IF di siklus 4 bentrok dengan MEM lw (siklus 4)
~~~

Solusi:

- **Pisahkan sumber daya**: cache instruksi dan cache data terpisah (Harvard di level cache, ingat Bab 1). Inilah alasan CPU modern punya I-cache dan D-cache terpisah.
- **Register file** dibuat dengan 2 port baca + 1 port tulis, dan menulis di paruh pertama siklus sementara membaca di paruh kedua sehingga WB dan ID tidak bentrok.
- Menambah unit fungsi (beberapa ALU). Bila tidak, tunda salah satu instruksi (stall).

Hazard struktural bisa dihindari **seluruhnya** dengan desain yang cukup mewah, sehingga jarang menjadi masalah utama.

## 2. Hazard data

Instruksi bergantung pada **hasil** instruksi sebelumnya yang belum ditulis ke register.

~~~
add $s0, $t0, $t1     # menghasilkan $s0 (ditulis di WB, siklus 5)
sub $t2, $s0, $t3     # butuh $s0 di ID (siklus 3) → terlalu cepat!
~~~

~~~
Siklus:      1  2  3  4  5  6
add $s0,...: IF ID EX ME WB      ← $s0 baru tertulis di siklus 5
sub $t2,$s0: .. IF ID EX ME WB   ← membaca $s0 di siklus 3 → nilai LAMA (salah!)
~~~

### Tiga jenis ketergantungan data

| Jenis | Singkatan | Arti | Contoh |
| --- | --- | --- | --- |
| **Read After Write** | **RAW** (true dependence) | Instruksi B **membaca** apa yang A **tulis** | \`add r1,..\` lalu \`sub .., r1\` |
| **Write After Read** | **WAR** (anti-dependence) | B **menulis** apa yang A masih **baca** | \`add .., r1\` lalu \`sub r1,..\` |
| **Write After Write** | **WAW** (output dependence) | B **menulis** tempat yang sama dengan A | \`add r1,..\` lalu \`sub r1,..\` |

Pada pipeline in-order 5 tahap sederhana, **hanya RAW** yang menjadi masalah. WAR dan WAW baru muncul pada eksekusi out-of-order (pelajaran superscalar), dan diselesaikan dengan *register renaming*.

### Solusi 1: stall (gelembung / bubble)

Hentikan instruksi yang bergantung sampai hasilnya siap, dengan menyisipkan **bubble** (siklus kosong).

Tanpa forwarding, instruksi \`sub\` harus menunggu \`add\` selesai **WB** (hasil sudah di register file) baru ID-nya boleh membaca. Dengan write di paruh pertama siklus dan read di paruh kedua:

~~~
Siklus:      1  2  3  4  5  6  7  8
add $s0,...: IF ID EX ME WB
sub $t2,$s0:    IF -- -- ID EX ME WB      ← 2 siklus stall (ID di siklus 5)
~~~

Dua siklus terbuang untuk satu ketergantungan RAW antar instruksi yang berurutan. Pada kode nyata sangat sering terjadi.

### Solusi 2: forwarding (bypassing)

Hasil add sebenarnya sudah **tersedia di akhir tahap EX** (siklus 3), jauh sebelum ditulis ke register file. Alih-alih menunggu WB, **teruskan langsung** hasil dari register pipeline EX/MEM ke masukan ALU instruksi berikutnya, memakai **MUX tambahan** dan unit pendeteksi (*forwarding unit*) yang membandingkan nomor register.

~~~
Siklus:      1  2  3  4  5  6
add $s0,...: IF ID EX ME WB
                    │ hasil
                    └──────┐ (forward)
sub $t2,$s0:    IF ID EX ME WB     ← EX di siklus 4 memakai hasil dari add. TANPA STALL!
~~~

Kini add dan sub berurutan tanpa menunda satu siklus pun.

Aturan forwarding sederhana: jika register sumber instruksi di EX sama dengan register tujuan instruksi di EX/MEM (atau MEM/WB) dan instruksi itu menulis register, ambil nilainya dari register pipeline tersebut, bukan dari register file.

### Hazard load-use: forwarding tidak cukup

\`lw\` baru **mendapat datanya di akhir MEM** (siklus 4), sedangkan instruksi berikutnya butuh data itu di **awal EX** (siklus 4). Tidak mungkin meneruskan "mundur dalam waktu".

~~~
lw  $t0, 0($s1)
add $t2, $t0, $s2      ← butuh $t0 segera
~~~

~~~
Siklus:      1  2  3  4  5  6  7
lw  $t0,...: IF ID EX ME WB
add $t2,$t0:    IF ID -- EX ME WB      ← 1 stall wajib (EX di siklus 5), lalu forward dari MEM/WB
~~~

Jadi \`lw\` yang langsung diikuti instruksi pemakainya selalu dikenai **1 siklus stall**, bahkan dengan forwarding penuh. Itulah **load-use hazard**.

### Solusi 3: penjadwalan kode oleh kompilator

Kompilator dapat **mengurutkan ulang** instruksi untuk mengisi jeda load-use dengan instruksi lain yang tidak bergantung.

~~~
Sebelum:                       Sesudah (dijadwalkan ulang):
lw  $t1, 0($s0)                lw  $t1, 0($s0)
add $t3, $t1, $s1  ← stall     lw  $t2, 4($s0)        ← diisi instruksi lain
lw  $t2, 4($s0)                add $t3, $t1, $s1      ← $t1 sudah siap
add $t4, $t2, $s1  ← stall     add $t4, $t2, $s1
~~~

Dua stall hilang tanpa mengubah hasil program.

## Ringkasan: stall tanpa dan dengan forwarding

| Skenario (instruksi berurutan, dependensi RAW) | Tanpa forwarding | Dengan forwarding |
| --- | --- | --- |
| ALU → ALU (\`add\` lalu \`sub\` yang memakai hasilnya) | 2 stall | **0 stall** |
| \`lw\` → ALU (load-use) | 2 stall | **1 stall** |
| ALU → ALU dengan 1 instruksi di antara | 1 stall | 0 stall |

## Rangkuman

- **Hazard struktural**: dua instruksi memakai hardware yang sama bersamaan. Solusi: pisahkan sumber daya (I-cache dan D-cache terpisah, register file multi-port).
- **Hazard data** karena ketergantungan: **RAW** (benar-benar bergantung), WAR, WAW. Pada pipeline in-order sederhana hanya RAW yang bermasalah.
- **Stall** menyisipkan bubble; **forwarding** meneruskan hasil dari register pipeline langsung ke masukan ALU sehingga ALU→ALU tanpa stall.
- **Load-use hazard** tetap butuh **1 stall** walaupun ada forwarding; kompilator dapat menjadwalkan ulang kode untuk menghindarinya.
`,
};
