export default {
  id: 'py-pewarisan',
  judul: 'Pewarisan dan Polimorfisme',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Pewarisan dan Polimorfisme 🧬

**Pewarisan** (*inheritance*) memungkinkan sebuah class baru **mewarisi** atribut dan method class lain, lalu menambah atau mengubahnya. Ia menghindari penyalinan kode dan memodelkan hubungan **"adalah sebuah"** (*is-a*): kucing *adalah* hewan.

## Dasar pewarisan

~~~python
class Hewan:
    def __init__(self, nama):
        self.nama = nama

    def makan(self):
        return f"{self.nama} sedang makan"

    def bersuara(self):
        return "..."

class Kucing(Hewan):                 # Kucing mewarisi dari Hewan
    def bersuara(self):              # override: mengganti perilaku
        return "Meong!"

class Anjing(Hewan):
    def bersuara(self):
        return "Guk guk!"

tom = Kucing("Tom")
rex = Anjing("Rex")

print(tom.makan())                   # method warisan
print(tom.bersuara(), rex.bersuara())
~~~

- **Class induk** (*parent*/*superclass*): \`Hewan\`.
- **Class anak** (*child*/*subclass*): \`Kucing\`, \`Anjing\`.
- **Override**: anak mendefinisikan ulang method induk.

## super(): memanggil induk

Bila anak punya atribut tambahan, panggil \`__init__\` induk lewat \`super()\` supaya inisialisasi induk tidak terlewat:

~~~python
class Pegawai:
    def __init__(self, nama, gaji):
        self.nama = nama
        self.gaji = gaji

    def info(self):
        return f"{self.nama}, gaji {self.gaji:,}"

class Manajer(Pegawai):
    def __init__(self, nama, gaji, tunjangan):
        super().__init__(nama, gaji)         # inisialisasi bagian induk
        self.tunjangan = tunjangan

    def info(self):
        return super().info() + f" + tunjangan {self.tunjangan:,}"

m = Manajer("Sinta", 10_000_000, 2_000_000)
print(m.info())
~~~

## isinstance dan issubclass

~~~python
print(isinstance(m, Manajer), isinstance(m, Pegawai), isinstance(m, str))
print(issubclass(Manajer, Pegawai))
print(type(m).__name__, [k.__name__ for k in Manajer.__mro__])
~~~

\`__mro__\` (*method resolution order*) menunjukkan urutan class yang dicari Python saat mencari sebuah method: dari kelas objek sendiri naik ke induk, lalu ke \`object\` (induk dari semua class).

## Polimorfisme: satu antarmuka, banyak perilaku

Karena semua hewan punya \`bersuara()\`, kode yang memakainya **tidak perlu tahu jenis persisnya**:

~~~python
class Hewan:
    def __init__(self, nama):
        self.nama = nama
    def bersuara(self):
        raise NotImplementedError("anak class harus mengimplementasikan bersuara()")

class Kucing(Hewan):
    def bersuara(self): return "Meong!"

class Sapi(Hewan):
    def bersuara(self): return "Mooo!"

class Bebek(Hewan):
    def bersuara(self): return "Kwek!"

kandang = [Kucing("Tom"), Sapi("Bessie"), Bebek("Donal")]
for h in kandang:
    print(f"{h.nama}: {h.bersuara()}")          # pemanggilan sama, hasil berbeda
~~~

Menambah \`Domba\` tidak mengubah loop sama sekali: itulah kekuatan polimorfisme. Python juga mendukung **duck typing**: objek apa pun yang punya \`bersuara()\` bisa dipakai, bahkan tanpa mewarisi \`Hewan\`.

## Class abstrak

\`abc\` memaksa anak mengimplementasikan method tertentu:

~~~python
from abc import ABC, abstractmethod

class Bentuk(ABC):
    @abstractmethod
    def luas(self):
        ...

class Persegi(Bentuk):
    def __init__(self, sisi):
        self.sisi = sisi
    def luas(self):
        return self.sisi ** 2

class Lingkaran(Bentuk):
    def __init__(self, r):
        self.r = r
    def luas(self):
        return 3.14159 * self.r ** 2

for b in [Persegi(4), Lingkaran(3)]:
    print(type(b).__name__, round(b.luas(), 2))

try:
    Bentuk()                         # class abstrak tidak bisa dibuat objeknya
except TypeError as e:
    print("Ditolak:", e)
~~~

## Pewarisan ganda

Python mengizinkan mewarisi dari **lebih dari satu** class (*multiple inheritance*), dengan urutan ditentukan oleh MRO. Gunakan hemat; pola yang aman adalah **mixin** kecil yang hanya menambah satu kemampuan.

~~~python
class BisaTerbang:
    def terbang(self):
        return f"{self.nama} terbang"

class BisaBerenang:
    def berenang(self):
        return f"{self.nama} berenang"

class Bebek(BisaTerbang, BisaBerenang):
    def __init__(self, nama):
        self.nama = nama

d = Bebek("Donal")
print(d.terbang(), "|", d.berenang())
print([k.__name__ for k in Bebek.__mro__])
~~~

## Komposisi vs pewarisan

Pewarisan memodelkan **"adalah"**. Bila hubungannya **"memiliki"** (*has-a*), pakai **komposisi**: objek menyimpan objek lain.

~~~python
class Mesin:
    def nyalakan(self):
        return "Mesin menyala"

class Mobil:                           # Mobil MEMILIKI Mesin, bukan "adalah" Mesin
    def __init__(self):
        self.mesin = Mesin()

    def jalan(self):
        return self.mesin.nyalakan() + ", mobil melaju"

print(Mobil().jalan())
~~~

Pedoman praktis: **utamakan komposisi**; pakai pewarisan hanya bila hubungan "adalah" benar-benar jelas dan stabil. Pohon pewarisan yang dalam membuat kode sulit dipahami.

## Contoh: sistem gaji

~~~python
class Karyawan:
    def __init__(self, nama):
        self.nama = nama
    def gaji(self):
        raise NotImplementedError

class Tetap(Karyawan):
    def __init__(self, nama, bulanan):
        super().__init__(nama)
        self.bulanan = bulanan
    def gaji(self):
        return self.bulanan

class Harian(Karyawan):
    def __init__(self, nama, tarif, hari):
        super().__init__(nama)
        self.tarif = tarif
        self.hari = hari
    def gaji(self):
        return self.tarif * self.hari

tim = [Tetap("Andi", 8_000_000), Harian("Budi", 300_000, 22)]
for k in tim:
    print(f"{k.nama:<6} {k.gaji():>12,}")
print("Total:", sum(k.gaji() for k in tim))
~~~

## Latihan mandiri

1. Buat class \`Kendaraan\` dengan anak \`Motor\` dan \`Mobil\` yang punya method \`biaya_parkir()\` berbeda.
2. Tambahkan class \`Bentuk\` abstrak dengan method \`keliling()\` dan dua anak.
3. Ubah contoh \`Mobil\`/\`Mesin\` agar mobil bisa memiliki beberapa roda (komposisi dengan list).

## Rangkuman

- \`class Anak(Induk):\` mewarisi atribut dan method; **override** mengganti perilaku; \`super()\` memanggil induk.
- \`isinstance\`, \`issubclass\`, dan \`__mro__\` memeriksa dan menelusuri hubungan pewarisan.
- **Polimorfisme**: kode yang sama bekerja pada banyak jenis objek lewat antarmuka yang sama; Python juga mendukung duck typing.
- **Class abstrak** (\`ABC\`, \`@abstractmethod\`) memaksa anak mengimplementasikan method.
- Pewarisan = "adalah"; **komposisi** = "memiliki" (lebih disarankan). Pewarisan ganda dan mixin dipakai hemat.
`,
};
