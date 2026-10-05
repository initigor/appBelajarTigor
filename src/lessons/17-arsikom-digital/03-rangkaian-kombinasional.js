export default {
  id: 'arsikom-kombinasional',
  judul: 'Rangkaian Kombinasional: Adder, Multiplexer, Decoder',
  tipe: 'teks',
  xp: 25,
  materi: `
# Rangkaian Kombinasional: Adder, Multiplexer, Decoder ➕🔀

Rangkaian **kombinasional** adalah rangkaian yang keluarannya **hanya bergantung pada masukan saat ini**, tanpa ingatan. Begitu masukan berubah, keluaran menyesuaikan setelah delay propagasi. Penjumlah, pemilih data, dan pengubah alamat di CPU semuanya kombinasional.

## Half adder dan full adder

### Half adder: menjumlah dua bit

~~~
Sum   S = A ⊕ B
Carry C = A · B
~~~

| A | B | Sum | Carry |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

Disebut "half" karena **tidak menerima carry masuk**, sehingga tidak bisa dirantai untuk bilangan multi-bit.

### Full adder: dua bit + carry masuk

~~~
Sum       S    = A ⊕ B ⊕ Cin
Carry out Cout = A·B + Cin·(A ⊕ B)
~~~

Full adder dibangun dari **dua half adder** dan satu gerbang OR:

~~~
HA1:  S1 = A ⊕ B          C1 = A · B
HA2:  Sum = S1 ⊕ Cin      C2 = S1 · Cin
Cout = C1 + C2
~~~

Cara kerjanya: HA1 menjumlah A dan B, HA2 menjumlah hasilnya (S1) dengan Cin. Carry keluar adalah OR dari kedua carry sementara.

## Penjumlah n bit: ripple-carry

Rangkai n full adder; carry keluar tiap tahap menjadi carry masuk tahap berikutnya.

~~~
        A3 B3     A2 B2     A1 B1     A0 B0
         │  │      │  │      │  │      │  │
 Cout ◄─[FA3]◄────[FA2]◄────[FA1]◄────[FA0]◄── Cin=0
         │         │         │         │
         S3        S2        S1        S0
~~~

Sederhana, tetapi **lambat**: carry harus "merambat" dari bit terendah sampai tertinggi. Delay total ∝ n. Untuk 64 bit, carry menunggu 64 tahap.

### Carry-lookahead adder (CLA)

Alih-alih menunggu carry, hitung langsung dari masukan. Definisikan untuk tiap bit i:

- **Generate** Gᵢ = Aᵢ · Bᵢ: bit ini **menghasilkan** carry sendiri.
- **Propagate** Pᵢ = Aᵢ ⊕ Bᵢ: bit ini **meneruskan** carry yang masuk.

Maka:

~~~
C1 = G0 + P0·C0
C2 = G1 + P1·G0 + P1·P0·C0
C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0
~~~

Semua carry dihitung **paralel** dari G, P, dan C0 dalam dua tingkat gerbang, bukan berantai. Harganya: gerbang semakin banyak dan lebar. Adder praktis memakai blok CLA 4 bit yang dirantai secara hierarkis.

### Pengurang dan penjumlah/pengurang gabungan

Dengan A − B = A + ~B + 1, tambahkan **XOR di tiap bit B** dan satu sinyal **SUB**:

~~~
Bᵢ' = Bᵢ ⊕ SUB        Cin awal = SUB
SUB = 0 → A + B       SUB = 1 → A + ~B + 1 = A − B
~~~

Satu rangkaian melakukan penjumlahan dan pengurangan. Flag overflow bertanda: **V = C_n ⊕ C_(n−1)** (carry masuk dan keluar MSB, sesuai pelajaran overflow).

## Multiplexer (MUX): pemilih data

MUX meneruskan **salah satu dari 2ⁿ masukan data** ke keluaran, dipilih oleh **n saluran seleksi**.

**MUX 2-ke-1**:

~~~
Y = S' · I0 + S · I1       S=0 → Y=I0,  S=1 → Y=I1
~~~

~~~
 I0 ──┐
      │ MUX 2:1 ── Y
 I1 ──┘   ▲
          S
~~~

**MUX 4-ke-1** memakai 2 saluran seleksi (S1 S0): Y = I[S1S0]. Secara umum 2ⁿ masukan data membutuhkan n saluran seleksi.

Kegunaan MUX sangat luas:

- Memilih operasi mana yang hasilnya dikirim keluar ALU.
- Memilih register mana yang dibaca (register file).
- Memilih sumber berikutnya untuk program counter (urutan atau lompatan).
- Sebagai **pembangkit fungsi logika universal**: MUX 2ⁿ-ke-1 dapat mengimplementasikan fungsi n+1 variabel apa pun hanya dengan menghubungkan masukan data ke 0, 1, atau variabel. Prinsip ini dipakai **FPGA** (tabel *look-up* pada dasarnya MUX besar).

## Decoder: pengubah kode menjadi satu saluran aktif

**Decoder n-ke-2ⁿ** menerima n bit dan mengaktifkan **tepat satu** dari 2ⁿ keluaran (*one-hot*).

**Decoder 2-ke-4:**

| A1 | A0 | D0 | D1 | D2 | D3 |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | **1** | 0 | 0 | 0 |
| 0 | 1 | 0 | **1** | 0 | 0 |
| 1 | 0 | 0 | 0 | **1** | 0 |
| 1 | 1 | 0 | 0 | 0 | **1** |

Persamaan: D0 = A1'·A0', D1 = A1'·A0, D2 = A1·A0', D3 = A1·A0. Setiap keluaran adalah sebuah **minterm**: decoder adalah "kamus minterm". Biasanya ada masukan **Enable** (jika 0, semua keluaran mati).

Kegunaan utama:

- **Decoding alamat memori**: bit alamat tinggi dipilih untuk mengaktifkan satu chip memori atau satu baris sel (Bab 8).
- **Memilih register tujuan tulis** pada register file.
- Menggerakkan tampilan 7-segmen.

**Encoder** adalah kebalikannya (2ⁿ masukan → kode n bit). **Priority encoder** menangani beberapa masukan aktif sekaligus dengan memilih yang prioritasnya tertinggi, dipakai pada pengendali interupsi.

## Komparator

Rangkaian yang membandingkan dua bilangan. Untuk 1 bit: A = B adalah XNOR(A, B). Untuk n bit, semua bit harus sama (AND dari semua XNOR). Pada CPU, perbandingan biasanya dikerjakan oleh pengurang + flag.

## Ringkasan: kapan sesuatu "kombinasional"?

| Kombinasional | Sekuensial (pelajaran berikutnya) |
| --- | --- |
| Keluaran = f(masukan sekarang) | Keluaran = f(masukan sekarang, **keadaan sebelumnya**) |
| Tanpa umpan balik, tanpa memori | Ada umpan balik dan memori |
| Contoh: adder, MUX, decoder, ALU | Contoh: flip-flop, register, counter |

## Rangkuman

- **Full adder**: S = A⊕B⊕Cin, Cout = AB + Cin(A⊕B). Dirantai menjadi **ripple-carry** (lambat, delay ∝ n).
- **Carry-lookahead** memakai Generate (AB) dan Propagate (A⊕B) agar semua carry dihitung paralel.
- Penjumlah/pengurang: XOR pada B dengan sinyal SUB dan Cin = SUB. Overflow bertanda V = C_n ⊕ C_(n−1).
- **MUX** memilih satu dari 2ⁿ masukan lewat n saluran seleksi; **decoder** mengaktifkan satu dari 2ⁿ keluaran (one-hot), dipakai untuk decoding alamat.
- Rangkaian kombinasional tidak punya memori; rangkaian sekuensial punya.
`,
};
