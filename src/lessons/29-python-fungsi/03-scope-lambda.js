export default {
  id: 'py-scope-lambda',
  judul: 'Scope, Lambda, Closure, dan Decorator',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Scope, Lambda, Closure, dan Decorator 🎯

Pelajaran ini membahas hal-hal yang membuat fungsi Python benar-benar kuat: di mana sebuah variabel "hidup" (scope), fungsi anonim, fungsi yang mengingat lingkungannya (closure), dan pembungkus fungsi (decorator).

## Scope: jangkauan sebuah nama

Variabel hanya dikenali di **bagian program tertentu**. Python mencari nama dengan aturan **LEGB**:

| Tingkat | Arti |
| --- | --- |
| **L**ocal | di dalam fungsi saat ini |
| **E**nclosing | di fungsi pembungkus (fungsi dalam fungsi) |
| **G**lobal | di level berkas/modul |
| **B**uilt-in | nama bawaan Python (\`len\`, \`print\`, ...) |

~~~python
pajak = 0.11                     # global

def harga_akhir(harga):
    total = harga * (1 + pajak)  # total: lokal; pajak: dicari ke global
    return total

print(harga_akhir(100))
# print(total)  -> NameError: total hanya hidup di dalam fungsi
~~~

~~~python
# galat
def hitung():
    hasil = 10

hitung()
print(hasil)
~~~

### Variabel lokal "menutupi" yang global

~~~python
x = "global"

def f():
    x = "lokal"           # membuat variabel LOKAL baru, bukan mengubah global
    print("di dalam:", x)

f()
print("di luar:", x)
~~~

### global dan nonlocal

Untuk **mengubah** variabel di luar, deklarasikan dulu. Gunakan sesedikit mungkin karena membuat kode sulit diuji:

~~~python
hitungan = 0

def tambah():
    global hitungan
    hitungan += 1

tambah(); tambah()
print(hitungan)
~~~

~~~python
# galat
total = 0

def tambah(n):
    total += n        # tanpa 'global': Python menganggap total lokal -> UnboundLocalError

tambah(5)
~~~

Cara lebih baik: kirim sebagai parameter dan kembalikan hasilnya.

## Lambda: fungsi anonim satu ekspresi

\`lambda parameter: ekspresi\` membuat fungsi kecil tanpa nama dan tanpa \`return\` eksplisit.

~~~python
kuadrat = lambda x: x * x
tambah = lambda a, b: a + b

print(kuadrat(6), tambah(2, 3))
~~~

Kegunaan utama: dikirim sebagai argumen, terutama untuk \`key=\`:

~~~python
mahasiswa = [("Andi", 80), ("Budi", 92), ("Cici", 75)]

print(sorted(mahasiswa, key=lambda m: m[1]))
print(max(mahasiswa, key=lambda m: m[1]))
print(sorted(["pisang", "ara", "kiwi"], key=lambda k: (len(k), k)))
~~~

Lambda hanya boleh **satu ekspresi**. Untuk logika yang lebih panjang, pakai \`def\`.

## Fungsi di dalam fungsi dan closure

Fungsi boleh didefinisikan di dalam fungsi lain, dan fungsi dalam **mengingat** variabel dari fungsi pembungkusnya meski pembungkusnya sudah selesai. Inilah **closure**.

~~~python
def pembuat_pengali(faktor):
    def kali(x):
        return x * faktor      # 'faktor' diingat dari lingkungan luar
    return kali

kali_tiga = pembuat_pengali(3)
kali_sepuluh = pembuat_pengali(10)

print(kali_tiga(7), kali_sepuluh(7))
~~~

Closure bisa menjaga **state** tanpa kelas:

~~~python
def penghitung():
    hitung = 0
    def tambah():
        nonlocal hitung        # ubah variabel milik fungsi pembungkus
        hitung += 1
        return hitung
    return tambah

a = penghitung()
print(a(), a(), a())
b = penghitung()
print(b())                      # penghitung terpisah
~~~

## Decorator: membungkus fungsi

**Decorator** adalah fungsi yang menerima fungsi dan mengembalikan fungsi baru dengan tambahan perilaku (log, pengukuran waktu, cache, otorisasi). Ditulis dengan \`@nama\` di atas definisi.

Langkah demi langkah, tanpa sintaks \`@\`:

~~~python
def catat(fungsi):
    def pembungkus(*args, **kwargs):
        print(f"memanggil {fungsi.__name__}{args}")
        hasil = fungsi(*args, **kwargs)
        print(f"hasil: {hasil}")
        return hasil
    return pembungkus

def tambah(a, b):
    return a + b

tambah = catat(tambah)          # ganti dengan versi yang dibungkus
tambah(2, 3)
~~~

Sintaks \`@catat\` adalah singkatan untuk hal yang sama:

~~~python
def catat(fungsi):
    def pembungkus(*args, **kwargs):
        print(f"memanggil {fungsi.__name__}{args}")
        return fungsi(*args, **kwargs)
    return pembungkus

@catat
def kali(a, b):
    return a * b

print(kali(4, 5))
~~~

Decorator untuk mengukur waktu:

~~~python
import time
from functools import wraps

def ukur_waktu(fungsi):
    @wraps(fungsi)              # menjaga nama & docstring fungsi asli
    def pembungkus(*args, **kwargs):
        mulai = time.perf_counter()
        hasil = fungsi(*args, **kwargs)
        print(f"{fungsi.__name__} selesai dalam {(time.perf_counter() - mulai) * 1000:.2f} ms")
        return hasil
    return pembungkus

@ukur_waktu
def jumlah_besar(n):
    return sum(range(n))

print(jumlah_besar(1_000_000))
~~~

Decorator bawaan yang akan sering kamu jumpai: \`@staticmethod\`, \`@classmethod\`, \`@property\` (bab OOP), \`@functools.cache\` (memoization), dan \`@dataclass\`.

## Rangkuman

- **Scope** mengikuti aturan **LEGB**; variabel lokal menutupi global; ubah variabel luar dengan \`global\`/\`nonlocal\` (sebaiknya dihindari).
- **lambda**: fungsi anonim satu ekspresi, terutama untuk \`key=\` pada \`sorted\`/\`max\`/\`min\`.
- **Closure**: fungsi dalam yang mengingat variabel pembungkusnya (menjaga state tanpa kelas).
- **Decorator**: fungsi yang membungkus fungsi lain (\`@nama\`); gunakan \`functools.wraps\` untuk menjaga identitas fungsi asli.
`,
};
