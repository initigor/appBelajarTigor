export default {
  id: 'arsikom-deteksi-error',
  judul: 'Deteksi & Koreksi Kesalahan: Parity dan Hamming',
  tipe: 'teks',
  xp: 20,
  materi: `
# Deteksi & Koreksi Kesalahan: Parity dan Hamming 🛡️

Perangkat keras tidak sempurna. Sinar kosmik, derau listrik, dan sel memori yang menua dapat **membalik satu bit**. Pada transmisi jaringan atau memori server, satu bit yang berubah bisa merusak data penting. Solusinya: sisipkan **bit tambahan (redundansi)** yang memungkinkan kesalahan **terdeteksi**, bahkan **dikoreksi**.

## Bit paritas (parity bit)

Ide paling sederhana: tambahkan 1 bit sehingga jumlah bit '1' total selalu **genap** (*even parity*) atau selalu **ganjil** (*odd parity*).

Data 7 bit: \`1011001\` (empat bit '1').

~~~
Even parity: jumlah '1' sudah genap (4)      → bit paritas = 0 → 1011001|0
Data 1011011 (lima bit '1')                  → bit paritas = 1 → 1011011|1
~~~

Penerima menghitung ulang paritas. Jika ganjil padahal harusnya genap, **ada kesalahan**.

Keterbatasan:

- Hanya mendeteksi **jumlah kesalahan ganjil** (1, 3, 5, ... bit). Kesalahan 2 bit saling meniadakan dan lolos.
- Hanya **mendeteksi**, tidak tahu bit mana yang salah, jadi tidak bisa mengoreksi.

Cukup untuk saluran yang jarang salah (serial lama, sebagian cache). Rumus paritas genap memakai XOR: paritas = d₁ ⊕ d₂ ⊕ ... ⊕ dₙ.

## Jarak Hamming

**Jarak Hamming** antara dua kata kode = jumlah posisi bit yang berbeda.

~~~
10110      jarak = 2   (posisi 2 dan 4 berbeda)
11100
~~~

Jika jarak **minimum** antar semua kata kode sah adalah **d**, maka kode itu:

- **Mendeteksi** sampai **d − 1** kesalahan bit.
- **Mengoreksi** sampai **⌊(d − 1) / 2⌋** kesalahan bit.

Parity memiliki d = 2, jadi mendeteksi 1 bit, mengoreksi 0. Untuk mengoreksi 1 bit diperlukan d = 3.

## Kode Hamming (7,4)

Richard Hamming menciptakan kode yang menambahkan **3 bit paritas** pada **4 bit data** sehingga **1 bit salah dapat dikoreksi** (jarak minimum 3).

Posisi bit diberi nomor 1 sampai 7. **Bit paritas ditaruh di posisi pangkat dua (1, 2, 4)**, bit data di sisanya (3, 5, 6, 7).

~~~
posisi:   1   2   3   4   5   6   7
isi:      p1  p2  d1  p4  d2  d3  d4
~~~

Setiap bit paritas menjaga sekelompok posisi, yaitu posisi yang bit tertentu dari nomornya bernilai 1:

| Paritas | Menjaga posisi | Alasan |
| --- | --- | --- |
| p1 | 1, 3, 5, 7 | Nomor posisi dengan bit ke-0 = 1 |
| p2 | 2, 3, 6, 7 | Nomor posisi dengan bit ke-1 = 1 |
| p4 | 4, 5, 6, 7 | Nomor posisi dengan bit ke-2 = 1 |

Masing-masing dipilih agar paritas genap kelompoknya.

### Contoh: mengkodekan data 1011

d1 = 1, d2 = 0, d3 = 1, d4 = 1.

~~~
p1 = d1 ⊕ d2 ⊕ d4 = 1 ⊕ 0 ⊕ 1 = 0
p2 = d1 ⊕ d3 ⊕ d4 = 1 ⊕ 1 ⊕ 1 = 1
p4 = d2 ⊕ d3 ⊕ d4 = 0 ⊕ 1 ⊕ 1 = 0

posisi:  1  2  3  4  5  6  7
kata:    0  1  1  0  0  1  1     → 0110011
~~~

### Contoh: mendeteksi dan mengoreksi

Misalkan di perjalanan bit ke-5 terbalik: diterima \`0110111\`.

Penerima menghitung ulang tiap kelompok (XOR semua bit di kelompok itu):

~~~
Kelompok p1 (pos 1,3,5,7): 0 ⊕ 1 ⊕ 1 ⊕ 1 = 1   → s1 = 1  (salah)
Kelompok p2 (pos 2,3,6,7): 1 ⊕ 1 ⊕ 1 ⊕ 1 = 0   → s2 = 0  (benar)
Kelompok p4 (pos 4,5,6,7): 0 ⊕ 1 ⊕ 1 ⊕ 1 = 1   → s4 = 1  (salah)

Sindrom = s4 s2 s1 = 101₂ = 5
~~~

**Sindrom langsung menunjuk posisi bit yang salah: 5.** Balik bit ke-5 → \`0110011\`, data benar kembali. Jika sindrom = 000, tidak ada kesalahan (satu bit).

Rahasianya: tiap posisi punya "kombinasi kelompok" unik (kode biner nomornya sendiri), jadi pola kelompok yang gagal mengidentifikasi posisinya.

### SECDED: dipakai di memori server

Hamming(7,4) memperbaiki 1 bit, tetapi 2 bit salah dapat disalahartikan sebagai 1 bit lain dan "dikoreksi" dengan keliru. Tambahkan **satu bit paritas keseluruhan** → **SECDED** (*Single Error Correct, Double Error Detect*): koreksi 1 bit, deteksi 2 bit.

**Memori ECC** pada server dan workstation menyimpan 8 bit tambahan untuk tiap 64 bit data (Hamming(72,64) SECDED). Biayanya 12,5% memori ekstra, imbalannya data tidak diam-diam rusak.

## CRC dan checksum

Untuk data besar (paket jaringan, berkas, blok disk), kode yang dipakai adalah **CRC** (*Cyclic Redundancy Check*): deretan bit data dianggap polinomial, dibagi dengan polinomial pembangkit tertentu, dan sisa bagi (misalnya 32 bit) ditambahkan di akhir. CRC sangat andal mendeteksi **kesalahan beruntun** (*burst error*). Ethernet, ZIP, dan PNG memakai CRC-32. **Checksum** sederhana (jumlahkan semua byte) lebih ringan tetapi lebih lemah (dipakai di header IP).

CRC hanya **mendeteksi**, lalu data dikirim ulang. Hamming dan sejenisnya dipakai ketika kirim ulang tidak praktis (memori, penyimpanan, komunikasi satelit).

## Rangkuman

- Redundansi bit memungkinkan **deteksi** dan **koreksi** kesalahan.
- **Parity**: 1 bit ekstra, hanya mendeteksi kesalahan ganjil, tidak bisa mengoreksi.
- **Jarak Hamming** minimum d: mendeteksi d−1 bit dan mengoreksi ⌊(d−1)/2⌋ bit.
- **Hamming(7,4)**: 3 bit paritas di posisi 1, 2, 4. Sindrom (hasil pengecekan kelompok) = nomor posisi bit yang salah.
- **SECDED** (koreksi 1, deteksi 2) dipakai di memori ECC; **CRC** dipakai untuk jaringan dan berkas.
`,
};
