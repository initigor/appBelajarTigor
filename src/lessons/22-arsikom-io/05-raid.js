export default {
  id: 'arsikom-raid',
  judul: 'RAID: Kinerja dan Keandalan dengan Banyak Disk',
  tipe: 'teks',
  xp: 25,
  materi: `
# RAID: Kinerja dan Keandalan dengan Banyak Disk 🗃️

Satu disk bisa **rusak**: tidak ada disk yang hidup selamanya. Satu disk juga **terbatas kecepatannya**. **RAID** (*Redundant Array of Independent Disks*) menggabungkan beberapa disk sehingga tampak sebagai **satu disk logis** yang lebih cepat dan/atau lebih tahan kerusakan.

## Dua teknik dasar

1. **Striping** (pemecahan): data dipecah menjadi potongan (*stripe unit*) dan disebar ke beberapa disk → **performa**: disk-disk bekerja paralel.
2. **Redundansi**: menyimpan salinan (**mirroring**) atau informasi tambahan (**parity**) → **keandalan**: data bisa dipulihkan setelah disk rusak.

Bermacam-macam kombinasi keduanya disebut **level RAID**. Gunakan n = jumlah disk, S = kapasitas tiap disk.

## RAID 0: striping murni

Data berselang-seling pada semua disk, **tanpa redundansi**.

~~~
Data: A1 A2 A3 A4 A5 A6
 Disk 0: A1 A3 A5
 Disk 1: A2 A4 A6
~~~

- **Kapasitas**: n × S (semua dipakai).
- **Kinerja**: baca dan tulis hingga **n kali lebih cepat** (paralel).
- **Keandalan**: **buruk**: jika **satu** disk rusak, **seluruh data hilang**. Kemungkinan gagal malah meningkat dengan jumlah disk.
- **Cocok untuk**: data sementara yang butuh kecepatan (penyuntingan video, cache), bukan data penting.

## RAID 1: mirroring

Setiap data **ditulis ke dua disk** (salinan identik).

~~~
 Disk 0: A B C D
 Disk 1: A B C D     ← cermin
~~~

- **Kapasitas**: n × S / 2 (setengah terbuang untuk salinan).
- **Kinerja**: baca bisa lebih cepat (dua disk melayani paralel), tulis seperti satu disk.
- **Keandalan**: bertahan bila satu disk dari tiap pasangan rusak.
- **Cocok untuk**: data penting berskala kecil (sistem operasi, basis data kecil). Mahal: 100% overhead.

## RAID 5: striping + parity terdistribusi

Data di-stripe dan ada **satu blok paritas** per baris stripe. Parity **disebar bergantian** di semua disk (bukan satu disk khusus, supaya tidak jadi bottleneck).

~~~
         Disk 0   Disk 1   Disk 2   Disk 3
Baris 1:   A1       A2       A3      P(A)
Baris 2:   B1       B2      P(B)      B3
Baris 3:   C1      P(C)      C2       C3
Baris 4:  P(D)      D1       D2       D3
~~~

**Parity = XOR** dari blok data pada satu baris stripe:

~~~
P = A1 ⊕ A2 ⊕ A3
~~~

- **Kapasitas**: (n − 1) × S (satu disk setara dipakai untuk parity).
- **Keandalan**: bertahan bila **satu** disk rusak. Minimal 3 disk.
- **Kinerja**: baca cepat (n−1 disk berkontribusi). Tulis lebih lambat (lihat penalti di bawah).

### Contoh: parity dan pemulihan

Tiga blok data 4 bit: A = \`1010\`, B = \`0110\`, C = \`1100\`.

~~~
P = A ⊕ B ⊕ C
  = 1010 ⊕ 0110 = 1100
  = 1100 ⊕ 1100 = 0000
P = 0000
~~~

Misalkan disk berisi **B rusak**. Pulihkan dengan XOR dari semua blok yang masih ada, termasuk parity:

~~~
B = A ⊕ C ⊕ P = 1010 ⊕ 1100 ⊕ 0000
  = 0110 ⊕ 0000 = 0110     ✓ (sama dengan B semula)
~~~

Prinsipnya: XOR bersifat **self-inverse**: bila X ⊕ Y = Z, maka X = Y ⊕ Z. Satu bit parity per baris cukup memulihkan satu disk yang diketahui hilang (karena kita tahu **disk mana** yang rusak, bit itulah yang dicari).

### Penalti penulisan kecil RAID 5

Mengubah **satu blok data** (*small write*) memerlukan pembaruan parity juga, tanpa membaca seluruh baris:

~~~
P_baru = P_lama ⊕ data_lama ⊕ data_baru
~~~

Untuk itu: **baca data lama, baca parity lama, tulis data baru, tulis parity baru = 4 operasi I/O** untuk 1 penulisan logis. Itu sebabnya RAID 5 lambat untuk beban tulis acak kecil (basis data).

### Rebuild dan risiko

Saat disk rusak diganti, seluruh isinya dibangun ulang dari disk lain. Selama itu (berjam-jam sampai berhari-hari pada disk besar) **tidak ada redundansi**: satu kerusakan lagi berarti kehilangan data. Pada disk berkapasitas besar, kemungkinan galat baca saat rebuild tidak kecil, yang mendorong penggunaan RAID 6.

## RAID 6: dua parity

Seperti RAID 5 tetapi dengan **dua blok paritas independen** per baris (P dan Q).

- **Kapasitas**: (n − 2) × S.
- **Keandalan**: bertahan bila **dua** disk rusak bersamaan. Minimal 4 disk.
- **Harga**: penalti tulis lebih besar (6 I/O untuk small write), dan hitungan parity kedua lebih rumit.
- **Cocok untuk**: array besar dengan disk berkapasitas besar.

## RAID 10 (1+0): mirror lalu stripe

Kumpulan pasangan **mirror**, lalu data di-**stripe** di seluruh pasangan itu.

~~~
 Pasangan 1: Disk0 = Disk1 (cermin)   ┐
 Pasangan 2: Disk2 = Disk3 (cermin)   ┘ ← data di-stripe di antara pasangan
~~~

- **Kapasitas**: n × S / 2. Minimal 4 disk.
- **Kinerja**: sangat baik (baca dan tulis, tanpa penalti parity).
- **Keandalan**: bertahan bila satu disk per pasangan rusak (tidak kedua disk di pasangan yang sama).
- Pilihan untuk basis data dan beban kerja tulis berat, walau boros kapasitas.

## Perbandingan (n = 4 disk @ 2 TB)

| Level | Kapasitas usable | Toleransi kegagalan | Performa baca | Performa tulis | Catatan |
| --- | --- | --- | --- | --- | --- |
| **RAID 0** | 8 TB | **0** disk | Sangat tinggi | Sangat tinggi | Berisiko |
| **RAID 1** | 2 TB (pasangan 2 disk) | 1 disk dari pasangan | Tinggi | Normal | Mirror |
| **RAID 5** | 6 TB | **1** disk | Tinggi | Sedang (penalti 4 I/O) | Parity |
| **RAID 6** | 4 TB | **2** disk | Tinggi | Lebih rendah | Dua parity |
| **RAID 10** | 4 TB | 1 per pasangan | Sangat tinggi | Tinggi | Mirror + stripe |

Rumus ringkas: RAID 0 → nS; RAID 1/10 → nS/2; RAID 5 → (n−1)S; RAID 6 → (n−2)S.

## RAID bukan pengganti backup

Hal yang sering disalahpahami:

- RAID melindungi dari **kerusakan disk**, bukan dari **penghapusan tidak sengaja**, **ransomware**, **bug perangkat lunak**, **kebakaran/pencurian**, atau **kerusakan kontroler**. Data yang terhapus terhapus di semua disk sekaligus.
- Aturan emas **3-2-1**: 3 salinan data, di 2 jenis media berbeda, 1 di lokasi lain (luar situs).

## Implementasi

- **RAID hardware**: kartu pengontrol khusus dengan cache baterai.
- **RAID software**: dikelola OS (Linux \`mdadm\`, ZFS, Windows Storage Spaces, Btrfs). Sekarang sangat umum karena CPU cukup cepat menghitung parity.

## Rangkuman

- **RAID** menggabungkan banyak disk: **striping** (kinerja paralel), **mirroring/parity** (keandalan).
- **RAID 0**: nS, tanpa toleransi kegagalan. **RAID 1**: nS/2, bertahan satu disk per pasangan. **RAID 5**: (n−1)S, bertahan satu disk, parity terdistribusi, penalti tulis 4 I/O. **RAID 6**: (n−2)S, bertahan dua disk. **RAID 10**: nS/2, mirror + stripe, kinerja tinggi.
- **Parity = XOR** blok data; blok yang hilang dipulihkan dengan XOR dari blok lain (contoh: A=1010, B=0110, C=1100 → P=0000; B = A⊕C⊕P).
- Update kecil RAID 5: P_baru = P_lama ⊕ data_lama ⊕ data_baru.
- **RAID bukan backup**: gunakan aturan 3-2-1.
`,
};
