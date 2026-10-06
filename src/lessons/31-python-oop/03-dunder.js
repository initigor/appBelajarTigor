export default {
  id: 'py-dunder',
  judul: 'Method Khusus (Dunder) dan Operator Overloading',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Method Khusus (Dunder) dan Operator Overloading ✨

Pernah heran mengapa \`len(daftar)\`, \`a + b\`, dan \`for x in ...\` bekerja pada objek bawaan? Jawabannya: Python memanggil **method khusus** yang namanya diapit **dua garis bawah** (*double underscore*, disingkat **dunder**): \`__len__\`, \`__add__\`, \`__iter__\`, dan seterusnya. Dengan mendefinisikannya di class buatanmu, objekmu bisa berperilaku seperti tipe bawaan.

## Contoh: Vektor yang bisa dijumlahkan

~~~python
class Vektor:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vektor({self.x}, {self.y})"

    def __add__(self, lain):                 # a + b
        return Vektor(self.x + lain.x, self.y + lain.y)

    def __sub__(self, lain):                 # a - b
        return Vektor(self.x - lain.x, self.y - lain.y)

    def __mul__(self, skalar):               # a * angka
        return Vektor(self.x * skalar, self.y * skalar)

    def __eq__(self, lain):                  # a == b
        return self.x == lain.x and self.y == lain.y

    def __abs__(self):                       # abs(a)
        return (self.x ** 2 + self.y ** 2) ** 0.5

a = Vektor(3, 4)
b = Vektor(1, 2)

print(a + b)
print(a - b)
print(a * 3)
print(a == Vektor(3, 4))
print(abs(a))
~~~

Menulis \`a + b\` otomatis memanggil \`a.__add__(b)\`. Ini disebut **operator overloading**.

## Daftar dunder yang paling berguna

### Representasi

| Dunder | Dipanggil oleh | Tujuan |
| --- | --- | --- |
| \`__repr__\` | \`repr(x)\`, tampilan di REPL/list | Tampilan **tak ambigu** untuk programmer |
| \`__str__\` | \`str(x)\`, \`print(x)\` | Tampilan **ramah** untuk pengguna |

### Operator

| Dunder | Operator |
| --- | --- |
| \`__add__\`, \`__sub__\`, \`__mul__\`, \`__truediv__\` | \`+  -  *  /\` |
| \`__eq__\`, \`__lt__\`, \`__le__\` | \`==  <  <=\` |
| \`__neg__\`, \`__abs__\` | \`-x\`, \`abs(x)\` |
| \`__bool__\` | \`bool(x)\`, kondisi \`if x:\` |

### Koleksi dan iterasi

| Dunder | Dipanggil oleh |
| --- | --- |
| \`__len__\` | \`len(x)\` |
| \`__getitem__\` | \`x[i]\`, slicing |
| \`__setitem__\` | \`x[i] = v\` |
| \`__contains__\` | \`item in x\` |
| \`__iter__\`, \`__next__\` | \`for ... in x\` |

### Siklus hidup

| Dunder | Dipanggil |
| --- | --- |
| \`__init__\` | setelah objek dibuat |
| \`__del__\` | saat objek dibuang (jarang dipakai) |
| \`__enter__\`, \`__exit__\` | masuk/keluar blok \`with\` |
| \`__call__\` | objek dipanggil seperti fungsi: \`x()\` |

## Contoh: objek yang berperilaku seperti list

~~~python
class Playlist:
    def __init__(self, nama):
        self.nama = nama
        self._lagu = []

    def tambah(self, judul):
        self._lagu.append(judul)

    def __len__(self):
        return len(self._lagu)

    def __getitem__(self, i):
        return self._lagu[i]

    def __contains__(self, judul):
        return judul in self._lagu

    def __iter__(self):
        return iter(self._lagu)

    def __str__(self):
        return f"Playlist '{self.nama}' ({len(self)} lagu)"

p = Playlist("Santai")
p.tambah("Lagu A")
p.tambah("Lagu B")
p.tambah("Lagu C")

print(p)
print(len(p), p[0], p[-1], "Lagu B" in p)
for lagu in p:
    print("-", lagu)
print(list(reversed(p)))
~~~

Dengan beberapa dunder, objekmu langsung bisa dipakai dengan \`len\`, indeks, \`in\`, \`for\`, \`reversed\`, bahkan \`sorted\`.

## Perbandingan dan pengurutan

~~~python
from functools import total_ordering

@total_ordering
class Mahasiswa:
    def __init__(self, nama, ipk):
        self.nama = nama
        self.ipk = ipk

    def __eq__(self, lain):
        return self.ipk == lain.ipk

    def __lt__(self, lain):
        return self.ipk < lain.ipk

    def __repr__(self):
        return f"{self.nama}({self.ipk})"

kelas = [Mahasiswa("Andi", 3.4), Mahasiswa("Budi", 3.8), Mahasiswa("Cici", 3.1)]
print(sorted(kelas))
print(max(kelas))
print(kelas[0] >= kelas[2])        # __ge__ disediakan oleh total_ordering
~~~

## Objek yang bisa dipanggil: __call__

~~~python
class Pengali:
    def __init__(self, faktor):
        self.faktor = faktor

    def __call__(self, x):
        return x * self.faktor

kali_lima = Pengali(5)
print(kali_lima(8))
print(list(map(kali_lima, [1, 2, 3])))
~~~

## Context manager: __enter__ dan __exit__

Class yang bisa dipakai dengan \`with\` (seperti berkas): menyiapkan di awal dan **membersihkan di akhir apa pun yang terjadi**.

~~~python
class Pengukur:
    def __enter__(self):
        import time
        self.mulai = time.perf_counter()
        return self

    def __exit__(self, jenis, nilai, jejak):
        import time
        durasi = (time.perf_counter() - self.mulai) * 1000
        print(f"Selesai dalam {durasi:.1f} ms")
        return False            # False: jangan menelan exception

with Pengukur():
    total = sum(range(500_000))
print(total)
~~~

## Hash dan set

Agar objek dapat dipakai sebagai kunci dict atau elemen set, ia harus **hashable**: definisikan \`__eq__\` **dan** \`__hash__\` yang konsisten.

~~~python
class Titik:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, lain):
        return (self.x, self.y) == (lain.x, lain.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __repr__(self):
        return f"T({self.x},{self.y})"

kumpulan = {Titik(1, 2), Titik(1, 2), Titik(3, 4)}
print(len(kumpulan), kumpulan)
~~~

## Hati-hati dengan overloading

- Pakai operator hanya bila **artinya alami** (\`Vektor + Vektor\` ya; \`Pengguna + Pengguna\` meragukan).
- Jaga konsistensi: bila mendefinisikan \`__eq__\`, pikirkan \`__hash__\`.
- \`__repr__\` yang baik sangat membantu debugging; \`__str__\` opsional.

## Latihan mandiri

1. Buat class \`Pecahan\` (pembilang, penyebut) dengan \`+\`, \`==\`, dan \`__str__\` ("3/4").
2. Buat class \`Kotak\` yang bisa di-\`len\`, di-iterasi, dan diperiksa dengan \`in\`.
3. Buat context manager \`SementaraDiam\` yang mencetak "mulai"/"selesai" di sekitar blok \`with\`.

## Rangkuman

- **Dunder** (\`__nama__\`) memberi objekmu perilaku bawaan: \`__repr__\`/\`__str__\`, operator (\`__add__\`, \`__eq__\`, \`__lt__\`), koleksi (\`__len__\`, \`__getitem__\`, \`__iter__\`, \`__contains__\`).
- \`__call__\` membuat objek bisa dipanggil; \`__enter__\`/\`__exit__\` membuatnya bisa dipakai dengan \`with\`.
- \`functools.total_ordering\` melengkapi operator perbandingan dari \`__eq__\` dan \`__lt__\`.
- Objek yang dipakai di set/dict butuh \`__eq__\` dan \`__hash__\` yang konsisten.
- Gunakan overloading hanya bila artinya alami.
`,
};
