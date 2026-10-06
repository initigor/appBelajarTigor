export default {
  id: 'py-iterasi',
  judul: 'Iterasi Cerdas: enumerate, zip, sorted, dan Teman-temannya',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Iterasi Cerdas: enumerate, zip, sorted, dan Teman-temannya 🧭

Python punya sekumpulan fungsi bawaan yang membuat perulangan jauh lebih ringkas dan "Pythonic". Menguasainya membuat kodemu pendek, jelas, dan sering lebih cepat.

## Objek yang bisa ditelusuri (iterable)

Apa pun yang bisa dipakai di \`for ... in\` disebut **iterable**: list, tuple, string, set, dict, \`range\`, berkas, dan generator.

~~~python
for x in [1, 2]:       print("list", x)
for x in (1, 2):       print("tuple", x)
for x in "ab":         print("string", x)
for x in {1, 2}:       print("set", x)
for x in range(2):     print("range", x)
~~~

## enumerate: indeks + nilai

~~~python
warna = ["merah", "hijau", "biru"]

for i, w in enumerate(warna):
    print(i, w)

for i, w in enumerate(warna, start=1):
    print(f"{i}. {w}")
~~~

## zip: menelusuri beberapa koleksi serentak

\`zip\` memasangkan elemen yang berposisi sama dan berhenti pada koleksi **terpendek**.

~~~python
nama = ["Andi", "Budi", "Cici"]
nilai = [80, 75, 90]
kota = ["Jakarta", "Bandung", "Medan"]

for n, s, k in zip(nama, nilai, kota):
    print(n, s, k)

# membuat dict dari dua list
print(dict(zip(nama, nilai)))
~~~

Kebalikannya (*unzip*):

~~~python
pasangan = [("a", 1), ("b", 2), ("c", 3)]
huruf, angka = zip(*pasangan)
print(huruf, angka)
~~~

## sorted dan reversed

~~~python
angka = [5, 2, 9, 1]

print(sorted(angka))
print(sorted(angka, reverse=True))
print(list(reversed(angka)))

mahasiswa = [("Andi", 80), ("Budi", 92), ("Cici", 75)]
print(sorted(mahasiswa, key=lambda m: m[1], reverse=True))
~~~

## min, max, sum, any, all

~~~python
nilai = [80, 75, 90, 65]

print(min(nilai), max(nilai), sum(nilai))
print(max(["pisang", "ara", "semangka"], key=len))

print(any(n < 70 for n in nilai))      # ada yang di bawah 70?
print(all(n >= 60 for n in nilai))     # semua lulus?
~~~

## map dan filter

~~~python
angka = [1, 2, 3, 4, 5, 6]

kuadrat = list(map(lambda n: n * n, angka))
genap = list(filter(lambda n: n % 2 == 0, angka))
print(kuadrat)
print(genap)
~~~

Dalam praktik banyak orang lebih suka **comprehension** (pelajaran berikutnya) untuk keperluan yang sama.

## Slicing sebagai alat iterasi

~~~python
data = list(range(10))

print(data[::2])          # setiap elemen kedua
print(data[1::2])
print(data[-3:])          # tiga terakhir

# memecah menjadi potongan berukuran 3
for i in range(0, len(data), 3):
    print(data[i:i + 3])
~~~

## Iterasi dua arah: membandingkan elemen bertetangga

~~~python
suhu = [30, 32, 31, 35, 36]

for sebelum, sesudah in zip(suhu, suhu[1:]):
    arah = "naik" if sesudah > sebelum else "turun"
    print(sebelum, "->", sesudah, arah)
~~~

## Iterator itu sekali pakai

\`zip\`, \`map\`, \`filter\`, dan \`enumerate\` mengembalikan **iterator** yang **habis** setelah dipakai sekali:

~~~python
pasangan = zip([1, 2], ["a", "b"])
print(list(pasangan))
print(list(pasangan))     # kosong: sudah habis
~~~

Ubah jadi list bila perlu dipakai berulang.

## Memeriksa isi dan menggabungkan

~~~python
from itertools import chain, islice, product

print(list(chain([1, 2], [3], [4, 5])))              # menyambung beberapa iterable
print(list(islice(range(100), 5)))                   # 5 elemen pertama
print(list(product("AB", [1, 2])))                   # semua kombinasi (hasil kali kartesius)
~~~

## Contoh: menggabungkan semuanya

Cari mahasiswa dengan nilai tertinggi, lalu tampilkan peringkat:

~~~python
nama = ["Andi", "Budi", "Cici", "Dina"]
nilai = [80, 92, 75, 92]

data = sorted(zip(nama, nilai), key=lambda p: p[1], reverse=True)
for peringkat, (n, s) in enumerate(data, start=1):
    print(f"{peringkat}. {n} ({s})")

tertinggi = max(nilai)
print("Nilai tertinggi diraih:", [n for n, s in zip(nama, nilai) if s == tertinggi])
~~~

## Latihan mandiri

1. Gabungkan list nama dan umur menjadi satu dict dengan \`zip\`.
2. Cetak setiap kata dari sebuah kalimat beserta nomor urutnya.
3. Periksa apakah sebuah list sudah terurut naik dengan \`zip\` dan \`all\`.

## Rangkuman

- \`enumerate(x, start=n)\` memberi indeks dan nilai; \`zip(a, b, ...)\` menelusuri beberapa koleksi serentak (berhenti di yang terpendek).
- \`sorted(x, key=..., reverse=...)\` membuat list terurut baru; \`reversed\` membalik; \`min\`/\`max\`/\`sum\` meringkas.
- \`any\` dan \`all\` menguji kondisi pada banyak elemen; \`map\`/\`filter\` mentransformasi dan menyaring.
- Iterator (\`zip\`, \`map\`, \`filter\`, \`enumerate\`) hanya bisa dipakai **sekali**.
- \`itertools\` (\`chain\`, \`islice\`, \`product\`) menyediakan alat iterasi tambahan.
`,
};
