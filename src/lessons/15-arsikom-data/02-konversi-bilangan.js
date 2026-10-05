export default {
  id: 'arsikom-konversi',
  judul: 'Konversi Antar Sistem Bilangan',
  tipe: 'teks',
  xp: 15,
  materi: `
# Konversi Antar Sistem Bilangan 🔄

Ini keterampilan hitung paling sering diujikan di Arsikom. Ada empat arah konversi, dan semuanya punya prosedur mekanis yang pasti. Kuasai prosedurnya, bukan menghafal contoh.

## 1. Biner (atau basis lain) → Desimal

Jumlahkan **digit × basis^posisi**, dengan posisi dihitung dari kanan mulai 0.

~~~
110101₂ = 1·32 + 1·16 + 0·8 + 1·4 + 0·2 + 1·1
        = 32 + 16 + 0 + 4 + 0 + 1 = 53
~~~

Heksa dengan cara yang sama:

~~~
0x2F = 2·16¹ + 15·16⁰ = 32 + 15 = 47
0xB7 = 11·16 + 7 = 176 + 7 = 183
~~~

## 2. Desimal → Biner: pembagian berulang dengan 2

Bagi bilangan dengan 2, catat **sisa**, ulangi dengan hasil bagi sampai 0. Hasilnya adalah sisa-sisa itu dibaca dari **bawah ke atas**.

Ubah **156** ke biner:

| Pembagian | Hasil bagi | Sisa |
| --- | --- | --- |
| 156 ÷ 2 | 78 | **0** |
| 78 ÷ 2 | 39 | **0** |
| 39 ÷ 2 | 19 | **1** |
| 19 ÷ 2 | 9 | **1** |
| 9 ÷ 2 | 4 | **1** |
| 4 ÷ 2 | 2 | **0** |
| 2 ÷ 2 | 1 | **0** |
| 1 ÷ 2 | 0 | **1** |

Baca sisa dari bawah: **10011100₂**.

Verifikasi: 128 + 16 + 8 + 4 = 156 ✓.

Cara lain yang lebih cepat untuk bilangan kecil: kurangi dengan pangkat dua terbesar yang muat.

~~~
156 − 128 = 28   → bit 2⁷ = 1
 28 −  16 = 12   → bit 2⁴ = 1   (64 dan 32 tidak muat → 0)
 12 −   8 =  4   → bit 2³ = 1
  4 −   4 =  0   → bit 2² = 1
Biner: 1 0 0 1 1 1 0 0
~~~

Untuk basis 16, bagilah dengan 16 dengan cara sama. **500 ÷ 16 = 31 sisa 4; 31 ÷ 16 = 1 sisa 15 (F); 1 ÷ 16 = 0 sisa 1** → **0x1F4**.

## 3. Biner ↔ Heksa ↔ Oktal: kelompokkan bit

Ini jalan pintas terpenting. Karena 16 = 2⁴ dan 8 = 2³:

- **Heksa**: kelompokkan biner **4 bit** dari kanan.
- **Oktal**: kelompokkan biner **3 bit** dari kanan.
- Isi bagian kiri yang kurang dengan 0.

**Biner → heksa**

~~~
1101011110₂
→ kelompok 4 bit dari kanan:  11 | 0101 | 1110
→ lengkapi:                   0011 | 0101 | 1110
→ heksa:                        3  |   5  |   E      = 0x35E
~~~

**Heksa → biner**: ganti tiap digit dengan 4 bit.

~~~
0xA3C = 1010 | 0011 | 1100 = 101000111100₂
~~~

**Biner → oktal**

~~~
1101011₂ → 1 | 101 | 011 → 001 | 101 | 011 → 1 5 3 = 0o153 = 107
~~~

Desimal ↔ heksa/oktal tidak ada jalan pintas: lewati biner, atau pakai pembagian berulang langsung.

## 4. Pecahan (bilangan di belakang koma)

**Biner → desimal**: posisi di kanan koma bernilai 2⁻¹, 2⁻², 2⁻³ ... = 0,5; 0,25; 0,125; ...

~~~
101,101₂ = 4 + 0 + 1 + 0,5 + 0 + 0,125 = 5,625
~~~

**Desimal → biner**: untuk bagian bulat pakai pembagian 2. Untuk bagian pecahan, **kalikan 2 berulang**, catat bagian bulat yang muncul (itu bit berikutnya), lalu lanjutkan dengan sisa pecahannya.

Ubah **0,625**:

| Langkah | Hasil | Bit |
| --- | --- | --- |
| 0,625 × 2 | 1,25 | **1** |
| 0,25 × 2 | 0,5 | **0** |
| 0,5 × 2 | 1,0 | **1** |

Berhenti karena sisa pecahan = 0. Hasil: **0,101₂**. Maka 5,625 = **101,101₂**.

### Bahaya: tidak semua pecahan desimal "rapi" di biner

Ubah **0,1**:

~~~
0,1 × 2 = 0,2 → 0
0,2 × 2 = 0,4 → 0
0,4 × 2 = 0,8 → 0
0,8 × 2 = 1,6 → 1   (sisa 0,6)
0,6 × 2 = 1,2 → 1   (sisa 0,2)  ← 0,2 sudah pernah muncul: berulang!
0,2 × 2 = 0,4 → 0
...
0,1₁₀ = 0,0001100110011...₂   (tak berhingga, berulang)
~~~

Komputer hanya punya jumlah bit terbatas, jadi harus memotong deretan itu. Inilah sebab yang sebenarnya dari keanehan berikut (kamu akan memahaminya penuh di pelajaran IEEE 754):

~~~python
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
~~~

Hal ini terjadi di **semua** bahasa (C, Java, JavaScript), bukan bug Python.

## Cek cepat dan kebiasaan baik

- **Bit paling kanan** (LSB) menentukan genap/ganjil: 0 = genap, 1 = ganjil.
- **Menambah satu 0 di kanan** berarti ×2; menghapus satu bit kanan berarti ÷2 (bulat). Inilah operasi geser (*shift*).
- Selalu **verifikasi balik**: setelah konversi, hitung ulang ke desimal.
- Untuk n bit berisi semua 1: nilainya 2ⁿ − 1 (contoh 1111₂ = 15, 11111111₂ = 255).

## Contoh latihan berpikir

1. Ubah 0xFF ke desimal → 15·16 + 15 = **255**.
2. Ubah 200 ke biner 8 bit → 128 + 64 + 8 → **11001000**.
3. Ubah 11001000₂ ke heksa → 1100 | 1000 → **0xC8**.
4. Berapa digit heksa untuk 32 bit? 32 / 4 = **8 digit** (contoh 0xDEADBEEF).

## Rangkuman

- **Ke desimal**: jumlahkan digit × basis^posisi.
- **Desimal ke biner**: bagi 2 berulang, baca sisa dari bawah ke atas (bagian pecahan: kali 2 berulang, baca bagian bulat dari atas ke bawah).
- **Biner ↔ heksa**: kelompok 4 bit. **Biner ↔ oktal**: kelompok 3 bit. Lengkapi dengan 0 di kiri.
- Banyak pecahan desimal (seperti 0,1) berulang tak berhingga di biner sehingga hanya bisa didekati. Inilah akar keanehan 0,1 + 0,2 pada floating point.
`,
};
