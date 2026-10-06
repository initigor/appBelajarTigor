export default {
  id: 'py-variabel-tipe',
  judul: 'Variabel dan Tipe Data',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Variabel dan Tipe Data 📦

**Variabel** adalah nama untuk menyimpan nilai sehingga bisa dipakai lagi. Di Python, variabel dibuat saat pertama kali diberi nilai (**penugasan**) dengan tanda \`=\`, tanpa deklarasi tipe.

~~~python
nama = "Budi"
umur = 20
tinggi = 172.5
mahasiswa = True

print(nama, umur, tinggi, mahasiswa)
~~~

## Aturan penamaan

- Boleh berisi huruf, angka, dan garis bawah \`_\`; **tidak boleh diawali angka**.
- **Peka huruf besar-kecil**: \`nama\` dan \`Nama\` berbeda.
- Tidak boleh memakai **kata kunci** Python (\`if\`, \`for\`, \`class\`, \`True\`, ...).
- Konvensi: huruf kecil dengan garis bawah (**snake_case**): \`nilai_akhir\`, \`jumlah_barang\`. Konstanta ditulis huruf besar: \`PAJAK = 0.11\`.

~~~python
# galat
2nama = "salah"
~~~

~~~python
import keyword
print(keyword.kwlist)      # daftar kata kunci yang tidak boleh jadi nama variabel
~~~

## Tipe data dasar

| Tipe | Nama Python | Contoh | Keterangan |
| --- | --- | --- | --- |
| Bilangan bulat | \`int\` | \`42\`, \`-7\`, \`1_000_000\` | Ukuran **tak terbatas** (hanya dibatasi memori) |
| Bilangan pecahan | \`float\` | \`3.14\`, \`-0.5\`, \`2e3\` | Presisi ganda (IEEE 754) |
| Teks | \`str\` | \`"halo"\`, \`'dunia'\` | Rangkaian karakter Unicode |
| Boolean | \`bool\` | \`True\`, \`False\` | Subtipe dari \`int\` (True = 1) |
| Tidak ada nilai | \`NoneType\` | \`None\` | Padanan \`null\` |

Fungsi \`type()\` menampilkan tipe sebuah nilai:

~~~python
print(type(42))
print(type(3.14))
print(type("halo"))
print(type(True))
print(type(None))
~~~

### Bilangan bulat tanpa batas

Tidak seperti \`int\` di C atau Java, \`int\` Python tidak pernah overflow:

~~~python
print(2 ** 100)
print(len(str(2 ** 1000)), "digit")
~~~

### Float tidak selalu eksak

Seperti di semua bahasa (lihat materi IEEE 754 di Arsikom), pecahan disimpan dalam biner sehingga hasil tertentu tidak tepat:

~~~python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(round(0.1 + 0.2, 2) == 0.3)
~~~

## Tipe dinamis: nama bisa menunjuk nilai apa saja

~~~python
x = 10
print(x, type(x))

x = "sepuluh"
print(x, type(x))
~~~

Variabel hanyalah **nama yang menunjuk ke objek**; tipenya melekat pada **nilai**, bukan pada nama.

## Konversi tipe (type casting)

Python bertipe kuat: ia tidak mengubah tipe diam-diam. Gunakan fungsi konversi:

| Fungsi | Hasil |
| --- | --- |
| \`int("42")\` | 42 |
| \`float("3.5")\` | 3.5 |
| \`str(100)\` | \`"100"\` |
| \`bool(0)\`, \`bool("a")\` | \`False\`, \`True\` |

~~~python
umur_teks = "20"
umur = int(umur_teks)
print(umur + 1)

print(str(7) + "7")        # penyambungan teks
print(int(3.99))            # int() MEMOTONG, bukan membulatkan
print(round(3.99))          # round() membulatkan
~~~

~~~python
# galat
print("Umur: " + 20)
~~~

~~~python
print("Umur: " + str(20))
~~~

~~~python
# galat
int("dua puluh")
~~~

## Penugasan ganda dan penukaran

~~~python
a = b = c = 0               # tiga nama, satu nilai
x, y = 5, 10                # penugasan beberapa nilai sekaligus (tuple unpacking)
x, y = y, x                 # tukar nilai tanpa variabel bantu
print(a, b, c, x, y)
~~~

## Menghapus dan memeriksa variabel

~~~python
data = 100
del data                    # menghapus nama
print("data" in dir())      # apakah nama masih ada?
~~~

## None: "tidak ada nilai"

\`None\` menyatakan ketiadaan nilai (hasil fungsi tanpa \`return\`, atau nilai awal yang belum diisi). Bandingkan dengan \`is\`:

~~~python
hasil = None
if hasil is None:
    print("belum ada hasil")
~~~

## Latihan mandiri

1. Buat variabel untuk namamu, tahun lahir, dan tinggi badan, lalu cetak masing-masing beserta tipenya.
2. Hitung umurmu dari tahun lahir dan tahun sekarang.
3. Apa hasil \`int("3") + float("2.5")\`? Tebak dulu tipenya, lalu jalankan.

## Rangkuman

- Variabel dibuat dengan penugasan (\`=\`); nama memakai snake_case, peka huruf besar-kecil, dan tidak boleh kata kunci.
- Tipe dasar: \`int\` (tak terbatas), \`float\`, \`str\`, \`bool\`, \`None\`; \`type()\` memeriksa tipe.
- Tipe dinamis dan kuat: nama bisa menunjuk nilai apa pun, tetapi konversi harus eksplisit (\`int()\`, \`float()\`, \`str()\`).
- \`int()\` memotong, \`round()\` membulatkan; float tidak selalu eksak (\`0.1 + 0.2\`).
- \`None\` = tidak ada nilai; bandingkan dengan \`is None\`.
`,
};
