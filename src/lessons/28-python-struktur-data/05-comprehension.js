export default {
  id: 'py-comprehension',
  judul: 'Comprehension: List, Dict, dan Set',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Comprehension: List, Dict, dan Set ✨

**Comprehension** adalah cara ringkas membuat koleksi baru dari koleksi lain dalam **satu ekspresi**. Ia ciri khas Python dan dipakai di mana-mana, dari skrip kecil sampai kode produksi.

## List comprehension

Bentuk dasar: \`[ekspresi for item in iterable]\`.

Cara biasa (4 baris):

~~~python
kuadrat = []
for n in range(1, 6):
    kuadrat.append(n * n)
print(kuadrat)
~~~

Dengan comprehension (1 baris):

~~~python
kuadrat = [n * n for n in range(1, 6)]
print(kuadrat)
~~~

Cara membacanya: *"buat list berisi n×n untuk setiap n dalam 1 sampai 5."*

### Dengan penyaringan (if)

\`[ekspresi for item in iterable if kondisi]\`

~~~python
angka = range(1, 21)

genap = [n for n in angka if n % 2 == 0]
kuadrat_ganjil = [n * n for n in angka if n % 2 == 1]
print(genap)
print(kuadrat_ganjil)
~~~

### Dengan if-else (memilih nilai)

Bila if-else berada di **ekspresi**, letaknya **di depan** \`for\`:

~~~python
nilai = [80, 55, 90, 40, 70]

status = ["lulus" if n >= 60 else "ulang" for n in nilai]
print(status)
~~~

Ringkasan posisi: **\`if\` sendirian di belakang** (menyaring); **\`if-else\` di depan** (menentukan nilai).

### Contoh praktis pada teks

~~~python
kalimat = "belajar python itu menyenangkan sekali"

panjang_kata = [len(k) for k in kalimat.split()]
kapital = [k.capitalize() for k in kalimat.split()]
kata_panjang = [k for k in kalimat.split() if len(k) > 6]

print(panjang_kata)
print(" ".join(kapital))
print(kata_panjang)
~~~

### Loop bersarang

Urutan \`for\` sama dengan urutan loop bersarang biasa:

~~~python
pasangan = [(x, y) for x in range(1, 4) for y in range(1, 4) if x != y]
print(pasangan)

# meratakan list 2D
matriks = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
rata = [angka for baris in matriks for angka in baris]
print(rata)

# transpos
transpos = [[baris[i] for baris in matriks] for i in range(3)]
print(transpos)
~~~

## Dict comprehension

\`{kunci: nilai for ...}\`

~~~python
kata = ["apel", "mangga", "jeruk"]

panjang = {k: len(k) for k in kata}
print(panjang)

kuadrat = {n: n ** 2 for n in range(1, 6)}
print(kuadrat)

harga = {"apel": 5000, "mangga": 8000, "jeruk": 4000}
mahal = {nama: h for nama, h in harga.items() if h > 4500}
print(mahal)

diskon = {nama: h * 0.9 for nama, h in harga.items()}
print(diskon)
~~~

## Set comprehension

\`{ekspresi for ...}\`, hasilnya unik.

~~~python
kalimat = "saya suka makan nasi goreng"
huruf_unik = {ch for ch in kalimat if ch.isalpha()}
print(sorted(huruf_unik))
print(len(huruf_unik))
~~~

## Generator expression

Dengan **kurung biasa** hasilnya **generator**: nilai dihasilkan satu per satu **saat dibutuhkan**, tanpa menyimpan semuanya di memori. Cocok untuk data besar atau saat hanya butuh hasil akhir seperti \`sum\`.

~~~python
import sys

daftar = [n * n for n in range(100_000)]
generator = (n * n for n in range(100_000))

print(sys.getsizeof(daftar) > sys.getsizeof(generator))
print(sum(n * n for n in range(1, 11)))     # tanpa membuat list perantara
~~~

## Kapan sebaiknya TIDAK memakai comprehension?

Comprehension memudahkan bila ringkas. Bila terlalu rumit, **loop biasa lebih mudah dibaca**.

~~~python
# sulit dibaca, hindari:
hasil = [x if x > 0 else -x for x in [1, -2, 3] if x != 0 for _ in range(2)]

# lebih baik loop biasa untuk logika yang rumit
hasil = []
for x in [1, -2, 3]:
    if x != 0:
        hasil.append(abs(x))
print(hasil)
~~~

Pedoman: **satu baris, satu gagasan**. Jangan memakai comprehension hanya untuk efek samping (misalnya \`[print(x) for x in data]\`); pakai loop biasa.

## Perbandingan kinerja

Comprehension umumnya sedikit lebih cepat daripada \`append\` dalam loop karena dioptimalkan di interpreter:

~~~python
import time

n = 300_000

mulai = time.perf_counter()
a = []
for i in range(n):
    a.append(i * 2)
t1 = time.perf_counter() - mulai

mulai = time.perf_counter()
b = [i * 2 for i in range(n)]
t2 = time.perf_counter() - mulai

print(a == b, "| loop:", round(t1 * 1000), "ms | comprehension:", round(t2 * 1000), "ms")
~~~

## Latihan mandiri

1. Dari \`[3, -1, 4, -5, 9]\` buat list yang hanya berisi nilai positifnya dikali dua.
2. Buat dict yang memetakan tiap kata dalam kalimat ke jumlah hurufnya.
3. Ubah \`["1", "2", "x", "4"]\` menjadi list angka yang hanya memuat elemen yang berupa digit.

## Rangkuman

- **List comprehension**: \`[ekspresi for x in iterable if kondisi]\`; \`if\` saja di belakang (menyaring), \`if-else\` di depan (memilih nilai).
- **Dict** \`{k: v for ...}\`, **set** \`{x for ...}\`, dan **generator** \`(x for ...)\` (malas, hemat memori).
- Loop bersarang dibaca sama seperti loop biasa dari kiri ke kanan.
- Gunakan bila ringkas dan jelas; pilih loop biasa untuk logika rumit atau efek samping.
`,
};
