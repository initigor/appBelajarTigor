export default {
  id: 'py-testing',
  judul: 'Menguji Kode: assert, unittest, dan doctest',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Menguji Kode: assert, unittest, dan doctest ✅

"Kodeku jalan di komputerku" bukan bukti kodemu benar. **Pengujian otomatis** adalah program kecil yang menjalankan kodemu dengan masukan yang diketahui dan memeriksa apakah hasilnya sesuai harapan. Tes yang baik adalah jaring pengaman: kamu bisa mengubah atau memperbaiki kode dengan percaya diri karena kerusakan akan langsung ketahuan (**regresi**).

## Kode yang akan diuji

~~~python
def kategori_bmi(berat, tinggi_m):
    """Mengembalikan kategori BMI: kurus, normal, atau gemuk."""
    if berat <= 0 or tinggi_m <= 0:
        raise ValueError("berat dan tinggi harus positif")
    bmi = berat / tinggi_m ** 2
    if bmi < 18.5:
        return "kurus"
    if bmi < 25:
        return "normal"
    return "gemuk"

print(kategori_bmi(70, 1.75))
~~~

## assert: tes paling sederhana

\`assert kondisi\` tidak melakukan apa-apa bila benar, dan melempar \`AssertionError\` bila salah.

~~~python
assert kategori_bmi(50, 1.75) == "kurus"
assert kategori_bmi(70, 1.75) == "normal"
assert kategori_bmi(100, 1.75) == "gemuk"
print("semua assert lolos")
~~~

~~~python
# galat
assert kategori_bmi(70, 1.75) == "gemuk", "70 kg / 1,75 m seharusnya normal"
~~~

Cukup untuk percobaan cepat, tetapi tidak memberi laporan rapi dan berhenti di galat pertama.

## unittest: kerangka pengujian bawaan

\`unittest\` mengelompokkan tes dalam class turunan \`TestCase\`. Tiap method yang namanya diawali \`test_\` adalah satu tes.

~~~python
import sys
import unittest

class TesKategoriBMI(unittest.TestCase):
    def test_kurus(self):
        self.assertEqual(kategori_bmi(50, 1.75), "kurus")

    def test_normal(self):
        self.assertEqual(kategori_bmi(70, 1.75), "normal")

    def test_gemuk(self):
        self.assertEqual(kategori_bmi(100, 1.75), "gemuk")

    def test_batas_atas_normal(self):
        # 24,99 masih normal, 25 sudah gemuk
        self.assertEqual(kategori_bmi(76.5, 1.75), "normal")

    def test_masukan_negatif(self):
        with self.assertRaises(ValueError):
            kategori_bmi(-5, 1.7)

def jalankan(kelas_tes):
    suite = unittest.TestLoader().loadTestsFromTestCase(kelas_tes)
    unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)

jalankan(TesKategoriBMI)
~~~

Di terminal biasanya cukup menaruh kode di berkas \`test_bmi.py\` lalu menjalankan \`python -m unittest\`.

### Assertion yang sering dipakai

| Method | Memeriksa |
| --- | --- |
| \`assertEqual(a, b)\` | \`a == b\` |
| \`assertTrue(x)\` / \`assertFalse(x)\` | kondisi benar/salah |
| \`assertIn(a, b)\` | \`a\` ada di \`b\` |
| \`assertAlmostEqual(a, b, places=3)\` | angka float hampir sama |
| \`assertRaises(Galat)\` | kode melempar exception itu |
| \`assertIsNone(x)\` | \`x is None\` |

### setUp: menyiapkan data bersama

~~~python
import sys
import unittest

class Keranjang:
    def __init__(self):
        self.isi = {}
    def tambah(self, nama, harga, jumlah=1):
        if jumlah <= 0:
            raise ValueError("jumlah harus positif")
        self.isi[nama] = (harga, self.isi.get(nama, (harga, 0))[1] + jumlah)
    def total(self):
        return sum(h * j for h, j in self.isi.values())

class TesKeranjang(unittest.TestCase):
    def setUp(self):                      # dijalankan SEBELUM tiap tes
        self.k = Keranjang()
        self.k.tambah("buku", 15_000, 2)

    def test_total_awal(self):
        self.assertEqual(self.k.total(), 30_000)

    def test_tambah_barang_sama(self):
        self.k.tambah("buku", 15_000)
        self.assertEqual(self.k.total(), 45_000)

    def test_jumlah_tidak_valid(self):
        with self.assertRaises(ValueError):
            self.k.tambah("pensil", 2_500, 0)

suite = unittest.TestLoader().loadTestsFromTestCase(TesKeranjang)
unittest.TextTestRunner(stream=sys.stdout).run(suite)
~~~

Setiap tes mendapat objek \`Keranjang\` **baru**, sehingga tes saling bebas. Itu prinsip penting: **tes tidak boleh bergantung pada urutan atau hasil tes lain**.

## Apa yang membuat tes yang baik?

1. **Cepat** dan **otomatis**: bisa dijalankan kapan saja tanpa campur tangan.
2. **Independen**: tidak saling memengaruhi.
3. **Menguji satu hal** per tes dengan nama yang menjelaskan maksudnya.
4. Mencakup **kasus normal, kasus tepi, dan kasus galat**: daftar kosong, nol, angka negatif, batas nilai.
5. **Deterministik**: hasil sama setiap kali (hindari bergantung pada waktu atau angka acak tanpa seed).

## Test-Driven Development (TDD)

Siklus pengembangan yang membalik urutan biasa:

~~~
 1. MERAH   : tulis tes untuk fitur yang belum ada → tes gagal
 2. HIJAU   : tulis kode secukupnya agar tes lolos
 3. REFAKTOR: rapikan kode, tes menjaga agar tetap benar
 (ulangi)
~~~

Hasilnya kode yang **teruji sejak awal** dan desain yang lebih sederhana.

## doctest: contoh di docstring yang sekaligus menjadi tes

Contoh interaktif di docstring (\`>>>\`) dijalankan dan hasilnya dibandingkan dengan yang tertulis.

~~~python
import doctest

def kali_dua(x):
    """Menggandakan nilai.

    >>> kali_dua(4)
    8
    >>> kali_dua("ha")
    'haha'
    """
    return x * 2

doctest.run_docstring_examples(kali_dua, globals(), verbose=False)
print("doctest selesai (tidak ada keluaran galat = lolos)")
~~~

Dokumentasi yang selalu terbukti benar karena dijalankan sebagai tes.

## pytest: alternatif yang lebih ringkas

**pytest** (dipasang dengan \`pip install pytest\`) sangat populer karena tesnya cukup berupa **fungsi biasa** dengan \`assert\`, dengan laporan galat yang detail:

~~~py
# test_bmi.py
import pytest
from bmi import kategori_bmi

def test_normal():
    assert kategori_bmi(70, 1.75) == "normal"

def test_masukan_negatif():
    with pytest.raises(ValueError):
        kategori_bmi(-5, 1.7)

@pytest.mark.parametrize("berat, harapan", [(50, "kurus"), (70, "normal"), (100, "gemuk")])
def test_kategori(berat, harapan):
    assert kategori_bmi(berat, 1.75) == harapan
~~~

Jalankan dengan \`pytest\` di terminal. \`parametrize\` menjalankan satu tes untuk banyak data.

## Cakupan (coverage)

Alat seperti **coverage.py** mengukur persentase baris kode yang dijalankan oleh tes. Cakupan tinggi tidak menjamin bebas bug, tetapi cakupan rendah menunjukkan bagian yang tidak teruji sama sekali.

## Latihan mandiri

1. Tulis fungsi \`apakah_kabisat(tahun)\` lalu 6 tes (tahun biasa, habis dibagi 4, abad, abad kelipatan 400, dll.).
2. Tulis tes untuk fungsi yang mengembalikan huruf terbanyak, termasuk teks kosong.
3. Ubah satu fungsi dengan sengaja agar salah, lalu lihat tes mana yang gagal.

## Rangkuman

- **Tes otomatis** memeriksa kode dengan masukan yang diketahui dan menangkap regresi.
- \`assert\` untuk pengecekan cepat; **unittest** (\`TestCase\`, \`assertEqual\`, \`assertRaises\`, \`setUp\`) untuk suite yang terstruktur; **doctest** untuk contoh di docstring; **pytest** untuk tes berupa fungsi biasa dengan \`parametrize\`.
- Tes yang baik: cepat, independen, menguji satu hal, mencakup kasus normal/tepi/galat, dan deterministik.
- **TDD**: merah → hijau → refaktor. **Coverage** menunjukkan bagian kode yang belum teruji.
`,
};
