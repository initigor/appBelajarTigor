export default {
  id: 'py-dataclass',
  judul: 'dataclass dan Enum',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# dataclass dan Enum 🧱

Banyak class hanya berfungsi sebagai **wadah data**. Menulis \`__init__\`, \`__repr__\`, dan \`__eq__\` berulang-ulang untuk itu membosankan. Python menyediakan **dataclass** untuk menghasilkannya otomatis, dan **Enum** untuk pilihan tetap yang bernama.

## Masalah: boilerplate

~~~python
class Buku:
    def __init__(self, judul, penulis, tahun):
        self.judul = judul
        self.penulis = penulis
        self.tahun = tahun

    def __repr__(self):
        return f"Buku(judul={self.judul!r}, penulis={self.penulis!r}, tahun={self.tahun!r})"

    def __eq__(self, lain):
        return (self.judul, self.penulis, self.tahun) == (lain.judul, lain.penulis, lain.tahun)

print(Buku("Laskar Pelangi", "Andrea Hirata", 2005))
~~~

## dataclass

Dengan \`@dataclass\` cukup menuliskan **field beserta tipenya**; Python membuatkan \`__init__\`, \`__repr__\`, dan \`__eq__\`:

~~~python
from dataclasses import dataclass

@dataclass
class Buku:
    judul: str
    penulis: str
    tahun: int

b1 = Buku("Laskar Pelangi", "Andrea Hirata", 2005)
b2 = Buku("Laskar Pelangi", "Andrea Hirata", 2005)

print(b1)
print(b1 == b2)
print(b1.judul, b1.tahun)
~~~

Anotasi tipe di sini **menentukan field**; Python tidak memaksa tipenya.

### Nilai bawaan dan field list

~~~python
from dataclasses import dataclass, field

@dataclass
class Mahasiswa:
    nama: str
    nim: str
    semester: int = 1                       # nilai bawaan
    nilai: list = field(default_factory=list)   # list/dict butuh default_factory!

m = Mahasiswa("Andi", "2026001")
m.nilai.append(85)
print(m)

n = Mahasiswa("Budi", "2026002", semester=3)
print(n.nilai)                              # list terpisah untuk tiap objek
~~~

Seperti pada parameter fungsi, **jangan** memakai \`[]\` langsung sebagai default; gunakan \`field(default_factory=list)\`.

### Opsi berguna

~~~python
from dataclasses import dataclass, asdict, replace

@dataclass(frozen=True, order=True)       # frozen: immutable; order: bisa dibandingkan
class Versi:
    mayor: int
    minor: int
    patch: int = 0

a = Versi(1, 2)
b = Versi(1, 10)
print(a < b)
print(sorted([b, a, Versi(0, 9)]))

print(asdict(a))                           # jadi dict
print(replace(a, patch=5))                 # salinan dengan perubahan

try:
    a.mayor = 9
except Exception as e:
    print("Ditolak:", type(e).__name__)
~~~

### Method dan logika tambahan

dataclass tetap class biasa: boleh punya method dan \`__post_init__\` (dijalankan setelah \`__init__\`) untuk validasi:

~~~python
from dataclasses import dataclass

@dataclass
class Produk:
    nama: str
    harga: float
    stok: int = 0

    def __post_init__(self):
        if self.harga < 0:
            raise ValueError("harga tidak boleh negatif")

    def nilai_stok(self):
        return self.harga * self.stok

p = Produk("Buku", 15_000, 10)
print(p, p.nilai_stok())

try:
    Produk("Salah", -1)
except ValueError as e:
    print("Gagal:", e)
~~~

### Kapan memakai apa?

| Kebutuhan | Pilihan |
| --- | --- |
| Data berbentuk tabel/record dengan field tetap | **dataclass** |
| Hanya pasangan nama-nilai sederhana yang berubah-ubah | dict |
| Record kecil immutable ringan | \`namedtuple\` atau \`dataclass(frozen=True)\` |
| Banyak perilaku dan aturan | class biasa |

## Enum: pilihan tetap bernama

Bila sebuah nilai hanya boleh salah satu dari beberapa pilihan (hari, status pesanan, level log), pakai **Enum** daripada string/angka mentah yang rawan salah ketik.

~~~python
from enum import Enum

class Status(Enum):
    MENUNGGU = "menunggu"
    DIPROSES = "diproses"
    SELESAI = "selesai"

s = Status.DIPROSES
print(s)
print(s.name, s.value)
print(s == Status.DIPROSES, s is Status.SELESAI)

for status in Status:
    print(status.name, "->", status.value)

print(Status("selesai"))              # cari lewat nilai
~~~

Keunggulan: **nama jelas**, tidak bisa salah ketik (\`Status.SELESAII\` langsung galat), dan IDE bisa membantu melengkapi.

~~~python
# galat
from enum import Enum

class Arah(Enum):
    ATAS = 1

print(Arah.BAWAH)
~~~

### Enum dengan perilaku

~~~python
from enum import Enum

class Hari(Enum):
    SENIN = 1
    SELASA = 2
    SABTU = 6
    MINGGU = 7

    def libur(self):
        return self in (Hari.SABTU, Hari.MINGGU)

for h in Hari:
    print(f"{h.name:<7} libur? {h.libur()}")
~~~

### Enum + dataclass

~~~python
from dataclasses import dataclass
from enum import Enum

class Prioritas(Enum):
    RENDAH = 1
    SEDANG = 2
    TINGGI = 3

@dataclass
class Tugas:
    judul: str
    prioritas: Prioritas = Prioritas.SEDANG
    selesai: bool = False

daftar = [
    Tugas("Belajar Python", Prioritas.TINGGI),
    Tugas("Cuci baju"),
    Tugas("Baca novel", Prioritas.RENDAH),
]

for t in sorted(daftar, key=lambda t: t.prioritas.value, reverse=True):
    print(f"[{t.prioritas.name:<6}] {t.judul}")
~~~

## Latihan mandiri

1. Buat dataclass \`Titik3D\` dan hitung jaraknya ke titik asal dengan sebuah method.
2. Buat Enum \`Level\` (DEBUG, INFO, ERROR) dan fungsi log yang hanya mencetak pesan bila levelnya cukup tinggi.
3. Buat dataclass \`Pesanan\` dengan field \`status\` bertipe Enum dan daftar \`items\`.

## Rangkuman

- \`@dataclass\` membuat \`__init__\`, \`__repr__\`, \`__eq__\` otomatis dari field berantotasi tipe; nilai bawaan boleh, tetapi list/dict butuh \`field(default_factory=...)\`.
- Opsi: \`frozen=True\` (immutable), \`order=True\` (bisa dibandingkan); \`asdict\`, \`replace\`; \`__post_init__\` untuk validasi.
- **Enum** menyatakan pilihan tetap bernama (\`Status.SELESAI\`), anggota punya \`.name\` dan \`.value\`; menghindari "string ajaib".
- dataclass dan Enum sering dipakai bersama untuk memodelkan data yang jelas dan aman.
`,
};
