export default {
  id: 'py-class',
  judul: 'Class dan Objek',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Class dan Objek 🏛️

Sampai sekarang data (variabel, list, dict) dan perilaku (fungsi) terpisah. **Pemrograman berorientasi objek (OOP)** menyatukan keduanya: **class** adalah cetak biru, **objek** adalah benda nyata yang dibuat dari cetak biru itu. Hampir semua yang kamu pakai di Python sebenarnya objek: string, list, dict, bahkan fungsi.

## Class dan objek

Analogi: class \`Mobil\` adalah desain pabrik; setiap mobil di jalan adalah **objek** (*instance*) dari desain itu: sama-sama punya merek dan kecepatan, tetapi nilainya berbeda-beda.

~~~python
class Mahasiswa:
    def __init__(self, nama, nim):
        self.nama = nama          # atribut
        self.nim = nim
        self.nilai = []

    def tambah_nilai(self, n):    # method
        self.nilai.append(n)

    def rata_rata(self):
        return sum(self.nilai) / len(self.nilai) if self.nilai else 0

andi = Mahasiswa("Andi", "2026001")
budi = Mahasiswa("Budi", "2026002")

andi.tambah_nilai(80)
andi.tambah_nilai(90)
budi.tambah_nilai(70)

print(andi.nama, andi.rata_rata())
print(budi.nama, budi.rata_rata())
~~~

### Istilah penting

| Istilah | Arti |
| --- | --- |
| **Class** | Cetak biru: mendefinisikan atribut dan method |
| **Objek / instance** | Hasil pembuatan dari class: \`andi = Mahasiswa(...)\` |
| **Atribut** | Data milik objek: \`andi.nama\` |
| **Method** | Fungsi milik objek: \`andi.tambah_nilai(80)\` |
| \`__init__\` | **Konstruktor**: dijalankan otomatis saat objek dibuat |
| \`self\` | Referensi ke objek itu sendiri; parameter pertama setiap method |

### self itu apa?

Saat kamu menulis \`andi.tambah_nilai(80)\`, Python mengubahnya menjadi \`Mahasiswa.tambah_nilai(andi, 80)\`: **objeknya sendiri dikirim sebagai argumen pertama**, yang kita namai \`self\`. Karena itu method yang lupa menulis \`self\` akan error.

~~~python
class Contoh:
    def sapa(self):
        return f"Halo dari objek dengan id {id(self) % 1000}"

c = Contoh()
print(c.sapa() == Contoh.sapa(c))     # dua cara memanggil yang setara
~~~

## Atribut instance vs atribut class

Atribut yang dibuat lewat \`self.x\` milik **tiap objek**. Atribut yang ditulis langsung di badan class **dibagi** semua objek.

~~~python
class Kucing:
    jenis = "Felis catus"             # atribut class (bersama)

    def __init__(self, nama):
        self.nama = nama              # atribut instance (masing-masing)

a = Kucing("Tom")
b = Kucing("Mimi")
print(a.nama, b.nama, a.jenis, b.jenis)

Kucing.jenis = "Kucing domestik"       # mengubah untuk semua
print(a.jenis, b.jenis)
~~~

## Method khusus penyajian: __str__ dan __repr__

Secara bawaan mencetak objek menampilkan alamat memori yang tidak berguna. Definisikan \`__str__\` untuk tampilan yang ramah:

~~~python
class Titik:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Titik({self.x}, {self.y})"

p = Titik(3, 4)
print(p)
print([p, Titik(0, 0)])
~~~

## Enkapsulasi: melindungi data

Python tidak memaksa kerahasiaan, tetapi ada konvensi:

| Penulisan | Arti |
| --- | --- |
| \`nama\` | publik |
| \`_nama\` | "internal": sebaiknya jangan diakses dari luar (konvensi) |
| \`__nama\` | di-*name mangle* menjadi \`_Kelas__nama\` supaya tidak bentrok saat pewarisan |

Untuk menjaga aturan (misalnya saldo tidak boleh negatif), jangan biarkan atribut diubah sembarangan. Gunakan **method** atau **property**:

~~~python
class Rekening:
    def __init__(self, pemilik, saldo=0):
        self.pemilik = pemilik
        self._saldo = saldo

    @property
    def saldo(self):                  # dibaca seperti atribut: rek.saldo
        return self._saldo

    def setor(self, jumlah):
        if jumlah <= 0:
            raise ValueError("jumlah setor harus positif")
        self._saldo += jumlah

    def tarik(self, jumlah):
        if jumlah > self._saldo:
            raise ValueError("saldo tidak cukup")
        self._saldo -= jumlah

rek = Rekening("Budi", 100_000)
rek.setor(50_000)
rek.tarik(30_000)
print(rek.pemilik, rek.saldo)

try:
    rek.tarik(1_000_000)
except ValueError as e:
    print("Gagal:", e)
~~~

\`@property\` membuat method terbaca seperti atribut tetapi tetap bisa menjalankan logika (validasi, perhitungan). Menambah \`@saldo.setter\` memungkinkan penugasan dengan validasi.

~~~python
class Suhu:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @property
    def celsius(self):
        return self._c

    @celsius.setter
    def celsius(self, nilai):
        if nilai < -273.15:
            raise ValueError("di bawah nol mutlak")
        self._c = nilai

s = Suhu(100)
print(s.fahrenheit)
s.celsius = 0
print(s.fahrenheit)
~~~

## Method class dan static

~~~python
class Pengguna:
    jumlah = 0

    def __init__(self, nama):
        self.nama = nama
        Pengguna.jumlah += 1

    @classmethod
    def dari_teks(cls, teks):              # pembuat alternatif (factory)
        nama = teks.split(":")[1].strip()
        return cls(nama)

    @staticmethod
    def valid(nama):                       # tidak butuh self maupun cls
        return len(nama) >= 3

u = Pengguna.dari_teks("pengguna: Budi")
print(u.nama, Pengguna.jumlah, Pengguna.valid("Al"))
~~~

## Contoh gabungan: keranjang belanja

~~~python
class Barang:
    def __init__(self, nama, harga):
        self.nama = nama
        self.harga = harga

class Keranjang:
    def __init__(self):
        self.isi = []

    def tambah(self, barang, jumlah=1):
        self.isi.append((barang, jumlah))

    def total(self):
        return sum(b.harga * j for b, j in self.isi)

    def struk(self):
        for b, j in self.isi:
            print(f"{b.nama:<10}{j:>3} x {b.harga:>8,}")
        print(f"{'TOTAL':<10}{self.total():>16,}")

k = Keranjang()
k.tambah(Barang("Buku", 15_000), 2)
k.tambah(Barang("Pensil", 2_500), 4)
k.struk()
~~~

## Kapan memakai class?

Gunakan class bila ada **data dan perilaku yang selalu berjalan bersama** dan kamu butuh banyak "benda" sejenis (mahasiswa, rekening, karakter game). Untuk sekadar mengelompokkan data, dict atau \`dataclass\` sering cukup. Untuk perhitungan murni, fungsi biasa lebih sederhana. OOP bukan tujuan, melainkan alat.

## Latihan mandiri

1. Buat class \`Lingkaran\` dengan atribut jari-jari dan method \`luas()\` dan \`keliling()\`.
2. Buat class \`Buku\` dengan \`__str__\` yang rapi dan daftar buku yang bisa diurutkan menurut judul.
3. Tambahkan method \`transfer(tujuan, jumlah)\` pada class \`Rekening\`.

## Rangkuman

- **Class** adalah cetak biru; **objek** adalah instance-nya. \`__init__\` menyiapkan objek; \`self\` adalah objek itu sendiri.
- **Atribut instance** (\`self.x\`) milik tiap objek; **atribut class** dibagi semua objek.
- \`__str__\`/\`__repr__\` mengatur tampilan; \`_nama\` konvensi internal; \`@property\` membuat method terbaca seperti atribut dengan validasi.
- \`@classmethod\` (menerima \`cls\`, cocok untuk factory) dan \`@staticmethod\` (tanpa \`self\`/\`cls\`).
- Gunakan class bila data dan perilaku berjalan bersama; jangan memaksakan OOP.
`,
};
