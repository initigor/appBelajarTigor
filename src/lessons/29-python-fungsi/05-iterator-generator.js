export default {
  id: 'py-generator',
  judul: 'Iterator dan Generator',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Iterator dan Generator 🔄

Pernahkah kamu bertanya bagaimana \`for x in daftar\` benar-benar bekerja? Jawabannya adalah **protokol iterator**. Memahaminya membuka pintu ke **generator**: fungsi yang menghasilkan nilai satu per satu secara "malas" sehingga bisa mengolah data sebesar apa pun.

## Iterable dan iterator

- **Iterable**: objek yang bisa ditelusuri (punya \`__iter__\`): list, string, dict, range...
- **Iterator**: objek yang menghasilkan elemen **satu per satu** lewat \`next()\` dan mengingat posisinya.

~~~python
daftar = ["a", "b", "c"]
it = iter(daftar)          # minta iterator dari iterable

print(next(it))
print(next(it))
print(next(it))
# next(it) lagi -> StopIteration (sudah habis)
~~~

Loop \`for\` sebenarnya melakukan ini: memanggil \`iter()\`, lalu \`next()\` berulang sampai \`StopIteration\`.

~~~python
# galat
it = iter([1])
next(it)
next(it)
~~~

## Iterator buatan sendiri

Cukup kelas dengan \`__iter__\` dan \`__next__\`:

~~~python
class HitungMundur:
    def __init__(self, awal):
        self.sekarang = awal

    def __iter__(self):
        return self

    def __next__(self):
        if self.sekarang <= 0:
            raise StopIteration
        nilai = self.sekarang
        self.sekarang -= 1
        return nilai

for n in HitungMundur(5):
    print(n, end=" ")
print()
~~~

Panjang dan merepotkan. **Generator** menyelesaikan hal yang sama dengan jauh lebih ringkas.

## Generator: fungsi dengan yield

Fungsi yang memakai \`yield\` alih-alih \`return\` menjadi **generator**. Setiap \`yield\` **menghasilkan satu nilai lalu menjeda** fungsi; pemanggilan berikutnya melanjutkan dari titik jeda dengan semua variabel lokalnya utuh.

~~~python
def hitung_mundur(awal):
    while awal > 0:
        yield awal
        awal -= 1

for n in hitung_mundur(5):
    print(n, end=" ")
print()
~~~

Lihat cara kerjanya langkah demi langkah:

~~~python
def tiga_pesan():
    print("mulai")
    yield "pesan 1"
    print("lanjut")
    yield "pesan 2"
    print("akhir")
    yield "pesan 3"

g = tiga_pesan()          # BELUM ada yang dijalankan
print(type(g))
print(next(g))
print(next(g))
print(next(g))
~~~

## Mengapa generator berguna?

### 1. Hemat memori (evaluasi malas)

Membuat list sejuta elemen memakan memori; generator menghasilkan satu per satu:

~~~python
import sys

def kuadrat_hingga(n):
    for i in range(n):
        yield i * i

daftar = [i * i for i in range(1_000_000)]
gen = kuadrat_hingga(1_000_000)

print("list     :", sys.getsizeof(daftar), "byte")
print("generator:", sys.getsizeof(gen), "byte")
print("jumlah   :", sum(kuadrat_hingga(1_000_000)))
~~~

### 2. Deret tak terbatas

Karena nilai dihitung saat diminta, generator boleh "tak berujung":

~~~python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 12)))      # ambil 12 pertama saja
~~~

### 3. Mengolah data besar baris demi baris

Pola khas: membaca berkas besar tanpa memuat semuanya.

~~~python
def baris_berisi(sumber, kata):
    for nomor, baris in enumerate(sumber, start=1):
        if kata in baris:
            yield nomor, baris.strip()

log = [
    "10:01 mulai",
    "10:02 ERROR koneksi gagal",
    "10:03 ok",
    "10:04 ERROR disk penuh",
]
for nomor, teks in baris_berisi(log, "ERROR"):
    print(nomor, teks)
~~~

## Pipeline generator

Generator bisa dirangkai seperti pipa pada shell: tiap tahap memproses satu elemen pada satu waktu, tanpa daftar perantara.

~~~python
def baca_angka():
    for teks in ["4", "x", "9", "16", "oops", "25"]:
        yield teks

def hanya_angka(sumber):
    for teks in sumber:
        if teks.isdigit():
            yield int(teks)

def akar(sumber):
    for n in sumber:
        yield n ** 0.5

print(list(akar(hanya_angka(baca_angka()))))
~~~

## Generator expression

Bentuk ringkas seperti list comprehension tetapi dengan kurung biasa:

~~~python
kuadrat = (n * n for n in range(1, 6))
print(next(kuadrat), next(kuadrat))
print(list(kuadrat))             # sisanya
print(list(kuadrat))             # sudah habis -> []
~~~

## yield from

Mendelegasikan ke generator/iterable lain:

~~~python
def gabung(*sumber):
    for s in sumber:
        yield from s

print(list(gabung([1, 2], "ab", range(3))))
~~~

## send() dan generator sebagai korutin (sekilas)

Generator juga bisa **menerima** nilai lewat \`send\`, dasar dari \`async/await\`:

~~~python
def rata_berjalan():
    total = 0
    n = 0
    rata = None
    while True:
        nilai = yield rata
        total += nilai
        n += 1
        rata = total / n

g = rata_berjalan()
next(g)                  # menyiapkan generator sampai yield pertama
print(g.send(10))
print(g.send(20))
print(g.send(60))
~~~

## Perbandingan

| | List | Generator |
| --- | --- | --- |
| Memori | Menyimpan semua elemen | Satu elemen pada satu waktu |
| Akses indeks, \`len\` | Ya | Tidak |
| Bisa ditelusuri ulang | Ya | **Sekali saja** |
| Deret tak berujung | Mustahil | Bisa |
| Cocok untuk | Data kecil yang dipakai berulang | Data besar/stream, pipeline |

## Latihan mandiri

1. Tulis generator \`kelipatan(n, batas)\` yang menghasilkan kelipatan n sampai batas.
2. Tulis generator bilangan prima tak berujung, lalu ambil 10 pertama dengan \`islice\`.
3. Buat pipeline: baca daftar kata → ubah ke huruf kecil → buang kata pendek → hitung panjangnya.

## Rangkuman

- **Iterable** punya \`__iter__\`; **iterator** menghasilkan elemen lewat \`next()\` sampai \`StopIteration\`; \`for\` memakai protokol ini.
- **Generator**: fungsi dengan \`yield\`; menjeda dan melanjutkan dengan state lokal utuh.
- Keunggulan: **hemat memori**, mendukung **deret tak berujung**, cocok untuk data besar dan **pipeline**.
- Generator hanya bisa ditelusuri **sekali**; \`yield from\` mendelegasikan; \`send\` mengirim nilai (dasar korutin).
`,
};
