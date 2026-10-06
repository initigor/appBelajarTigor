export default {
  id: 'py-parameter',
  judul: 'Parameter: Bawaan, Keyword, *args, dan **kwargs',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Parameter: Bawaan, Keyword, *args, dan **kwargs 🎛️

Python sangat fleksibel dalam cara fungsi menerima argumen. Pelajaran ini membahas semua variasinya, termasuk jebakan paling terkenal di Python: **default mutable**.

## Argumen posisional dan keyword

~~~python
def perkenalan(nama, umur, kota):
    return f"{nama}, {umur} tahun, dari {kota}"

print(perkenalan("Budi", 20, "Bandung"))                 # posisional (urutan penting)
print(perkenalan(kota="Medan", nama="Ani", umur=19))     # keyword (urutan bebas)
print(perkenalan("Cici", kota="Solo", umur=21))          # campuran (posisional dulu)
~~~

## Nilai bawaan (default)

Parameter boleh punya nilai bawaan sehingga **opsional**:

~~~python
def diskon(harga, persen=10):
    return harga - harga * persen / 100

print(diskon(100_000))             # persen = 10
print(diskon(100_000, 25))
print(diskon(100_000, persen=5))
~~~

Parameter berdefault harus **setelah** yang tidak berdefault:

~~~python
# galat
def salah(a=1, b):
    return a + b
~~~

## Jebakan: default yang mutable

Nilai bawaan dievaluasi **sekali saat fungsi didefinisikan**, bukan setiap dipanggil. Bila berupa list/dict, ia **dibagi** antar-pemanggilan:

~~~python
def tambah_buah(buah, keranjang=[]):      # BERBAHAYA
    keranjang.append(buah)
    return keranjang

print(tambah_buah("apel"))
print(tambah_buah("jeruk"))               # apel ikut muncul!
~~~

Cara yang benar: pakai \`None\` sebagai penanda lalu buat list baru di dalam fungsi:

~~~python
def tambah_buah(buah, keranjang=None):
    if keranjang is None:
        keranjang = []
    keranjang.append(buah)
    return keranjang

print(tambah_buah("apel"))
print(tambah_buah("jeruk"))
~~~

## *args: jumlah argumen bebas

Tanda \`*\` mengumpulkan argumen posisional ekstra menjadi **tuple**:

~~~python
def jumlahkan(*angka):
    print(angka, type(angka))
    return sum(angka)

print(jumlahkan(1, 2, 3))
print(jumlahkan(10, 20, 30, 40, 50))
print(jumlahkan())
~~~

\`print()\` sendiri memakai pola ini: \`print("a", "b", "c", ...)\`.

## **kwargs: keyword argument bebas

Tanda \`**\` mengumpulkan argumen keyword ekstra menjadi **dict**:

~~~python
def buat_profil(nama, **info):
    profil = {"nama": nama}
    profil.update(info)
    return profil

print(buat_profil("Budi", umur=20, kota="Bandung", hobi="catur"))
~~~

Urutan lengkap parameter: \`def f(biasa, default=1, *args, **kwargs)\`.

~~~python
def serba(a, b=2, *args, **kwargs):
    print("a =", a, "| b =", b, "| args =", args, "| kwargs =", kwargs)

serba(1)
serba(1, 9, 8, 7, x=1, y=2)
~~~

## Membongkar saat memanggil (unpacking)

Tanda \`*\` dan \`**\` juga dipakai **saat memanggil** untuk membongkar list/dict menjadi argumen:

~~~python
def volume(p, l, t):
    return p * l * t

ukuran = [2, 3, 4]
print(volume(*ukuran))             # setara volume(2, 3, 4)

data = {"p": 2, "l": 3, "t": 5}
print(volume(**data))              # setara volume(p=2, l=3, t=5)
~~~

## Parameter khusus posisi atau keyword

Python mengizinkan membatasi cara argumen dikirim: \`/\` (sebelumnya posisional saja) dan \`*\` (sesudahnya keyword saja).

~~~python
def hitung(a, b, /, *, pembulatan=2):
    return round(a / b, pembulatan)

print(hitung(10, 3))
print(hitung(10, 3, pembulatan=4))
~~~

Keyword-only membuat panggilan lebih jelas pada fungsi dengan banyak opsi: \`pembulatan=4\` lebih terbaca daripada angka 4 mentah.

## Argumen adalah referensi

Fungsi menerima **referensi** ke objek yang sama. Mengubah objek **mutable** di dalam fungsi terlihat dari luar; mengganti nama lokal tidak:

~~~python
def tambah_satu(daftar):
    daftar.append(1)          # mengubah list asli

def ganti(daftar):
    daftar = [99]             # hanya mengganti nama lokal

a = [0]
tambah_satu(a)
ganti(a)
print(a)
~~~

## Contoh: fungsi serbaguna

~~~python
def cetak_tabel(judul, *baris, lebar=12, pemisah="|"):
    print(judul.center(lebar * 2 + 1, "="))
    for kiri, kanan in baris:
        print(f"{kiri:<{lebar}}{pemisah}{kanan:>{lebar}}")

cetak_tabel("NILAI", ("Andi", 80), ("Budi", 92), lebar=10)
~~~

## Latihan mandiri

1. Tulis fungsi \`rata_rata(*angka)\` yang menerima berapa pun angka.
2. Tulis fungsi dengan parameter default \`sapaan="Halo"\` dan \`**opsi\`.
3. Jelaskan mengapa \`def f(x, hasil=[])\` berbahaya, lalu perbaiki.

## Rangkuman

- Argumen bisa **posisional** atau **keyword**; parameter berdefault harus setelah yang tidak berdefault.
- **Jangan** memakai list/dict sebagai nilai bawaan; pakai \`None\` lalu buat baru di dalam fungsi.
- \`*args\` mengumpulkan posisional ekstra (tuple), \`**kwargs\` mengumpulkan keyword ekstra (dict).
- \`*\` dan \`**\` saat memanggil membongkar list/dict menjadi argumen; \`/\` dan \`*\` pada definisi membatasi cara pengiriman.
- Argumen adalah referensi: mengubah objek mutable terlihat dari luar fungsi.
`,
};
