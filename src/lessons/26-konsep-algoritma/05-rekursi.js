export default {
  id: 'konsep-rekursi',
  judul: 'Rekursi dan Divide-and-Conquer',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Rekursi dan Divide-and-Conquer 🔁

**Rekursi** adalah teknik di mana **sebuah fungsi memanggil dirinya sendiri** untuk menyelesaikan versi yang lebih kecil dari masalah yang sama. Awalnya terasa ajaib, tetapi ia sangat alami untuk masalah yang strukturnya berulang di dalam dirinya: folder di dalam folder, pohon, dan banyak algoritma pengurutan dan pencarian.

## Dua syarat wajib

Setiap fungsi rekursif harus punya:

1. **Kasus dasar (base case)**: kondisi paling sederhana yang dijawab **langsung** tanpa memanggil diri. Ini yang menghentikan rekursi.
2. **Kasus rekursif**: memecah masalah menjadi masalah yang **lebih kecil** dan memanggil diri sendiri pada versi lebih kecil itu.

Tanpa kasus dasar (atau tanpa masalah yang mengecil), rekursi **tak pernah berhenti** dan memicu *stack overflow*.

## Contoh klasik: faktorial

n! = n × (n−1) × ... × 1. Perhatikan pola berulangnya: **n! = n × (n−1)!**, dan **0! = 1**.

~~~python
def faktorial(n):
    if n == 0:                       # kasus dasar
        return 1
    return n * faktorial(n - 1)      # kasus rekursif

print(faktorial(5))
~~~

### Menelusuri pemanggilan

~~~
faktorial(4)
= 4 * faktorial(3)
= 4 * (3 * faktorial(2))
= 4 * (3 * (2 * faktorial(1)))
= 4 * (3 * (2 * (1 * faktorial(0))))
= 4 * (3 * (2 * (1 * 1)))      ← kasus dasar tercapai, lalu hasil "mengalir kembali"
= 24
~~~

Di balik layar, setiap pemanggilan membuat satu **stack frame** di *call stack* (lihat Arsikom). Pemanggilan baru bertumpuk sampai kasus dasar, lalu ditutup satu per satu dari yang paling atas. Bisa dilihat dengan mencetak kedalamannya:

~~~python
def hitung_mundur(n, kedalaman=0):
    print("  " * kedalaman + f"masuk n={n}")
    if n == 0:
        print("  " * kedalaman + "kasus dasar!")
        return
    hitung_mundur(n - 1, kedalaman + 1)
    print("  " * kedalaman + f"keluar n={n}")

hitung_mundur(3)
~~~

## Rekursi vs perulangan

Hampir semua rekursi dapat ditulis ulang sebagai loop, dan sebaliknya:

~~~python
def faktorial_loop(n):
    hasil = 1
    for i in range(2, n + 1):
        hasil *= i
    return hasil

print(faktorial_loop(5))
~~~

| | Rekursi | Perulangan |
| --- | --- | --- |
| Kejelasan | Jelas untuk masalah berstruktur rekursif (pohon, divide-and-conquer) | Jelas untuk iterasi sederhana |
| Memori | Memakai stack (satu frame per pemanggilan) | Konstan |
| Risiko | Stack overflow bila terlalu dalam | Hampir tidak ada |
| Kecepatan | Ada beban pemanggilan fungsi | Biasanya lebih cepat |

Python membatasi kedalaman rekursi (default sekitar 1000) untuk mencegah stack habis:

~~~python
# galat
def tanpa_henti(n):
    return tanpa_henti(n + 1)

tanpa_henti(0)
~~~

## Jebakan: rekursi yang boros (Fibonacci)

Deret Fibonacci: F(0)=0, F(1)=1, F(n)=F(n−1)+F(n−2). Versi rekursif murni sangat elegan tetapi **sangat boros**, karena menghitung ulang nilai yang sama berkali-kali (waktu **O(2ⁿ)**):

~~~python
panggilan = 0

def fib(n):
    global panggilan
    panggilan += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(20), "dengan", panggilan, "pemanggilan")
~~~

Hampir 22.000 pemanggilan hanya untuk F(20)! Perbaikannya adalah **memoization**: simpan hasil yang sudah dihitung dan pakai ulang. Python menyediakannya lewat \`functools.cache\`:

~~~python
from functools import cache

panggilan = 0

@cache
def fib_cepat(n):
    global panggilan
    panggilan += 1
    if n < 2:
        return n
    return fib_cepat(n - 1) + fib_cepat(n - 2)

print(fib_cepat(20), "dengan", panggilan, "pemanggilan")
print(fib_cepat(80))     # versi tanpa cache tidak akan selesai dalam waktu wajar
~~~

Hanya 21 pemanggilan, dan F(80) pun seketika. Ini contoh **pemrograman dinamis**: pecah masalah menjadi submasalah yang tumpang tindih, lalu simpan hasilnya.

## Divide and conquer

Strategi besar: **bagi** masalah menjadi bagian lebih kecil, **selesaikan** tiap bagian (secara rekursif), lalu **gabungkan** hasilnya.

| Algoritma | Bagi | Gabung | Waktu |
| --- | --- | --- | --- |
| **Binary search** | Buang separuh daftar | – | O(log n) |
| **Merge sort** | Belah daftar jadi dua | Gabung dua daftar terurut | O(n log n) |
| **Quick sort** | Partisi di sekitar pivot | – | O(n log n) rata-rata |

### Binary search secara rekursif

~~~python
def cari(daftar, target, kiri, kanan):
    if kiri > kanan:                      # kasus dasar: tidak ada
        return -1
    tengah = (kiri + kanan) // 2
    if daftar[tengah] == target:          # kasus dasar: ketemu
        return tengah
    if daftar[tengah] < target:
        return cari(daftar, target, tengah + 1, kanan)
    return cari(daftar, target, kiri, tengah - 1)

data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(cari(data, 23, 0, len(data) - 1))
print(cari(data, 7, 0, len(data) - 1))
~~~

### Merge sort

~~~python
def urutkan(daftar):
    if len(daftar) <= 1:                  # kasus dasar
        return daftar
    tengah = len(daftar) // 2
    kiri = urutkan(daftar[:tengah])       # bagi + selesaikan
    kanan = urutkan(daftar[tengah:])
    return gabung(kiri, kanan)            # gabungkan

def gabung(a, b):
    hasil = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            hasil.append(a[i]); i += 1
        else:
            hasil.append(b[j]); j += 1
    return hasil + a[i:] + b[j:]

print(urutkan([38, 27, 43, 3, 9, 82, 10]))
~~~

## Cara berpikir rekursif

1. Tentukan **kasus dasar** (masalah paling kecil yang jawabannya jelas).
2. Anggap fungsi **sudah benar** untuk masalah yang lebih kecil (percaya pada rekursi).
3. Susun jawaban masalah sekarang dari jawaban masalah yang lebih kecil.
4. Pastikan setiap pemanggilan **mendekat** ke kasus dasar.

## Rangkuman

- **Rekursi** = fungsi memanggil dirinya; butuh **kasus dasar** dan **kasus rekursif** yang mengecilkan masalah.
- Tiap pemanggilan membuat stack frame; terlalu dalam → stack overflow (\`RecursionError\` di Python).
- Rekursi naif seperti Fibonacci bisa eksponensial; **memoization** (\`functools.cache\`) memangkasnya menjadi linear.
- **Divide and conquer**: bagi → selesaikan → gabungkan (binary search O(log n), merge sort O(n log n)).
- Rekursi dan perulangan setara kuasanya; pilih yang paling jelas untuk masalahnya.
`,
};
