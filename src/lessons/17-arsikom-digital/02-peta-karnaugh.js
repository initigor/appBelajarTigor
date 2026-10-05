export default {
  id: 'arsikom-kmap',
  judul: 'Penyederhanaan dengan Peta Karnaugh',
  tipe: 'teks',
  xp: 20,
  materi: `
# Penyederhanaan dengan Peta Karnaugh 🗺️

Menyederhanakan fungsi Boolean dengan aljabar bergantung pada kejelian menebak langkah. **Peta Karnaugh** (*K-map*) mengubahnya menjadi **permainan mengelompokkan kotak**, yang pasti berhasil untuk 2 sampai 4 (maksimal 5–6) variabel.

## Ide dasarnya

Dua minterm yang **hanya berbeda 1 bit** dapat digabung dan satu variabel hilang:

~~~
A'BC + ABC = BC(A' + A) = BC
~~~

Susunan K-map menaruh minterm yang bertetangga (beda satu bit) **bersebelahan secara fisik**, sehingga pasangan seperti itu mudah terlihat.

## Kode Gray: kunci susunan

Baris dan kolom K-map tidak diurutkan 00, 01, 10, 11, melainkan **kode Gray** 00, 01, **11**, **10**, supaya setiap dua urutan bertetangga hanya beda 1 bit.

### K-map 3 variabel (A baris, BC kolom)

~~~
          BC
        00  01  11  10
      +----+----+----+----+
 A=0  | m0 | m1 | m3 | m2 |
      +----+----+----+----+
 A=1  | m4 | m5 | m7 | m6 |
      +----+----+----+----+
~~~

### K-map 4 variabel (AB baris, CD kolom)

~~~
           CD
         00   01   11   10
       +----+----+----+----+
 AB=00 | m0 | m1 | m3 | m2 |
       +----+----+----+----+
    01 | m4 | m5 | m7 | m6 |
       +----+----+----+----+
    11 | m12| m13| m15| m14|
       +----+----+----+----+
    10 | m8 | m9 | m11| m10|
       +----+----+----+----+
~~~

Kolom paling kiri dan paling kanan juga bertetangga (**map berbentuk gulungan**), begitu juga baris atas dan bawah. Sudut-sudut keempatnya pun bertetangga satu sama lain.

## Aturan pengelompokan

1. Isi kotak dengan **1** pada minterm yang keluarannya 1 (sisanya 0).
2. Lingkari kelompok berisi **1** berbentuk **persegi panjang**.
3. Ukuran kelompok harus **pangkat dua**: 1, 2, 4, 8, 16.
4. Kelompok boleh **tumpang tindih** dan **melewati tepi**.
5. Buat kelompok **sebesar mungkin** dan gunakan **sesedikit mungkin** kelompok sampai semua angka 1 tertutup.
6. Dari setiap kelompok, **variabel yang berubah dihapus**, variabel yang tetap ditulis (nilai 1 sebagai A, nilai 0 sebagai A'). Jumlahkan (OR) semua suku.

Kelompok berukuran 2ᵏ menghapus **k variabel**: kelompok 2 menghapus 1 variabel, kelompok 4 menghapus 2, kelompok 8 menghapus 3.

## Contoh 1: fungsi mayoritas (3 variabel)

F = Σm(3, 5, 6, 7):

~~~
          BC
        00  01  11  10
 A=0  |  0 | 0 | 1 | 0 |
 A=1  |  0 | 1 | 1 | 1 |
~~~

- Kelompok m3 + m7 (kolom BC = 11, A berubah): **BC**.
- Kelompok m5 + m7 (baris A = 1, kolom BC = 01 dan 11; B berubah, A dan C tetap 1): **AC**.
- Kelompok m6 + m7 (A = 1, B = 1, C berubah): **AB**.

**F = AB + AC + BC**, sama dengan hasil aljabar, tetapi ditemukan dalam hitungan detik. Perhatikan m7 dipakai tiga kali, tumpang tindih itu sah.

## Contoh 2: 4 variabel dengan kelompok yang "melingkar"

F(A,B,C,D) = Σm(0, 1, 2, 5, 8, 9, 10):

~~~
           CD
         00   01   11   10
 AB=00 |  1 |  1 |  0 |  1 |
    01 |  0 |  1 |  0 |  0 |
    11 |  0 |  0 |  0 |  0 |
    10 |  1 |  1 |  0 |  1 |
~~~

- **Empat sudut** m0, m2, m8, m10: B tetap 0 dan D tetap 0 → **B'D'** (kelompok 4 yang melewati tepi).
- **m0, m1, m8, m9** (baris atas dan bawah, kolom 00 dan 01): B tetap 0, C tetap 0 → **B'C'**.
- **m1 + m5** (kolom 01, baris 00 dan 01): A tetap 0, C tetap 0, D tetap 1 → **A'C'D**.

**F = B'D' + B'C' + A'C'D.** Tidak ada cara lebih ringkas.

Dengan aljabar murni, 7 minterm × 4 variabel butuh banyak langkah dan mudah terlewat.

## Don't care (kondisi bebas)

Kadang kombinasi masukan tertentu **tidak pernah terjadi** atau keluarannya tidak penting. Tandai dengan **X** (*don't care*). Pada K-map, X boleh dianggap **1** (jika membantu membuat kelompok lebih besar) atau **0** (diabaikan).

Contoh klasik: dekoder BCD ke tampilan 7-segmen. Masukan 4 bit hanya valid untuk 0–9, jadi kombinasi 10–15 adalah X, dan itu membuat rangkaian jauh lebih sederhana.

## Bentuk POS dari K-map

Untuk mendapat **POS**, kelompokkan angka **0**, tulis hasilnya sebagai fungsi F', lalu ambil komplemen dengan De Morgan. SOP biasanya lebih umum.

## Mengubah SOP menjadi rangkaian

SOP dua tingkat (AND lalu OR) bisa dibangun **hanya dengan NAND**: bentuk **NAND-NAND**. Dengan De Morgan, dua tingkat NAND setara dengan AND-OR. Ini sering dipakai karena NAND lebih murah (CMOS).

## Keterbatasan

- K-map praktis hingga **4–5 variabel**. Di atas itu dipakai algoritma **Quine–McCluskey** atau heuristik **Espresso** yang dijalankan program (alat sintesis logika).
- Untuk rangkaian modern, penyederhanaan dikerjakan otomatis oleh sintesis (Verilog/VHDL → gerbang). Namun memahami K-map melatih intuisi bahwa **struktur logika menentukan biaya dan kecepatan**.

## Rangkuman

- K-map menyusun minterm dengan **kode Gray** sehingga tetangga hanya beda satu bit. Tepi kiri/kanan dan atas/bawah bersambung.
- Kelompokkan angka 1 dalam persegi panjang berukuran 2ᵏ, sebesar mungkin, sesedikit mungkin; kelompok 2ᵏ menghapus k variabel.
- Tulis variabel yang tetap pada tiap kelompok, lalu OR-kan hasilnya (SOP).
- **Don't care (X)** boleh dianggap 0 atau 1 sesuai keuntungan.
- K-map praktis sampai ±4–5 variabel; sisanya memakai Quine–McCluskey atau alat sintesis.
`,
};
