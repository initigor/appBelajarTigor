export default {
  id: 'py-tuple-set',
  judul: 'Tuple dan Set',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Tuple dan Set 🧱

Selain list, Python punya dua koleksi dasar lain dengan sifat khas: **tuple** (berurutan tetapi **tidak bisa diubah**) dan **set** (**tanpa urutan** dan **tanpa duplikat**).

## Tuple

**Tuple** mirip list tetapi **immutable**: setelah dibuat, isinya tidak bisa diganti. Ditulis dengan kurung biasa.

~~~python
titik = (3, 4)
hari = ("Senin", "Selasa", "Rabu")
satu = (5,)               # tuple satu elemen: wajib ada koma!
kosong = ()

print(titik, type(titik))
print(type((5)), type(satu))   # (5) hanyalah angka 5 dalam kurung
~~~

Indeks, slicing, \`len\`, \`in\`, dan loop bekerja sama seperti list:

~~~python
hari = ("Senin", "Selasa", "Rabu", "Kamis")
print(hari[0], hari[-1], hari[1:3], len(hari))
for h in hari:
    print(h)
~~~

Tetapi tidak bisa diubah:

~~~python
# galat
titik = (3, 4)
titik[0] = 10
~~~

### Mengapa memakai tuple?

- **Keamanan**: data yang tidak boleh berubah (koordinat, tanggal, konfigurasi).
- **Bisa jadi kunci dict** dan elemen set (list tidak bisa, karena mutable).
- Sedikit **lebih ringan dan cepat** dibanding list.
- Cara alami fungsi **mengembalikan beberapa nilai**.

### Packing dan unpacking

~~~python
data = ("Budi", 20, "Informatika")      # packing
nama, umur, jurusan = data              # unpacking
print(nama, umur, jurusan)

a, b = 1, 2
a, b = b, a                             # tukar nilai
print(a, b)

pertama, *sisa = [10, 20, 30, 40]       # * menampung sisanya
print(pertama, sisa)
~~~

~~~python
def min_maks(angka):
    return min(angka), max(angka)       # mengembalikan tuple

terkecil, terbesar = min_maks([5, 2, 9, 1])
print(terkecil, terbesar)
~~~

### Tuple bernama

\`namedtuple\` memberi nama pada tiap posisi sehingga kode lebih jelas:

~~~python
from collections import namedtuple

Titik = namedtuple("Titik", ["x", "y"])
p = Titik(3, 4)
print(p.x, p.y, p)
~~~

## Set

**Set** adalah kumpulan elemen **unik tanpa urutan**. Ditulis dengan kurung kurawal (set kosong harus \`set()\`, karena \`{}\` adalah dict kosong).

~~~python
huruf = {"a", "b", "c", "a", "b"}      # duplikat otomatis hilang
print(huruf)
print(len(huruf))

print(type({}), type(set()))
~~~

Karena tidak berurutan, **tidak ada indeks**. Elemen harus **hashable** (immutable): angka, string, tuple — bukan list.

### Operasi dasar

~~~python
tags = {"python", "web"}
tags.add("data")
tags.add("python")          # sudah ada: tidak ada efek
tags.discard("web")         # hapus tanpa error bila tidak ada
print(tags)

print("data" in tags)       # pengecekan keanggotaan sangat cepat (O(1))
~~~

### Mengubah list jadi set (hapus duplikat)

~~~python
angka = [1, 2, 2, 3, 3, 3, 4]
unik = set(angka)
print(unik)
print(sorted(unik))
print(len(angka), "->", len(unik))
~~~

### Operasi himpunan

Seperti himpunan matematika:

| Operasi | Operator | Method | Arti |
| --- | --- | --- | --- |
| Gabungan | \`a \\| b\` | \`union\` | semua elemen dari keduanya |
| Irisan | \`a & b\` | \`intersection\` | elemen yang ada di keduanya |
| Selisih | \`a - b\` | \`difference\` | ada di a, tidak di b |
| Selisih simetris | \`a ^ b\` | \`symmetric_difference\` | ada di salah satunya saja |

~~~python
kelas_a = {"Andi", "Budi", "Cici"}
kelas_b = {"Budi", "Dina", "Cici", "Eka"}

print("Gabungan:", kelas_a | kelas_b)
print("Ikut keduanya:", kelas_a & kelas_b)
print("Hanya kelas A:", kelas_a - kelas_b)
print("Hanya salah satu:", kelas_a ^ kelas_b)
print("A subset B?", {"Budi"} <= kelas_b)
~~~

### Contoh: menemukan duplikat

~~~python
nama = ["Ani", "Budi", "Ani", "Cici", "Budi", "Ani"]

dilihat = set()
duplikat = set()
for n in nama:
    if n in dilihat:
        duplikat.add(n)
    dilihat.add(n)
print(duplikat)
~~~

## Perbandingan tiga koleksi

| | List | Tuple | Set |
| --- | --- | --- | --- |
| Tanda | \`[ ]\` | \`( )\` | \`{ }\` |
| Berurutan | Ya | Ya | Tidak |
| Bisa diubah | Ya | **Tidak** | Ya |
| Duplikat | Boleh | Boleh | **Tidak** |
| Akses indeks | Ya | Ya | Tidak |
| Cek \`in\` | O(n) | O(n) | **O(1)** |
| Cocok untuk | Data berurutan yang berubah | Data tetap, kunci dict | Keunikan, himpunan, pencarian cepat |

## Frozenset

\`frozenset\` adalah versi set yang immutable (bisa jadi kunci dict atau anggota set lain).

~~~python
beku = frozenset([1, 2, 3])
print(beku, 2 in beku)
~~~

## Latihan mandiri

1. Dari \`[3, 1, 3, 2, 1]\` hasilkan list tanpa duplikat yang tetap berurutan menurut kemunculan pertama.
2. Cari huruf yang sama di kata \`"python"\` dan \`"typhoon"\` dengan set.
3. Buat fungsi yang mengembalikan nama, umur, dan kota sebagai tuple lalu unpack hasilnya.

## Rangkuman

- **Tuple**: berurutan, **immutable**, \`(1, 2)\`; satu elemen butuh koma \`(5,)\`; dipakai untuk data tetap, kunci dict, dan mengembalikan banyak nilai.
- **Packing/unpacking**: \`a, b = b, a\`; \`pertama, *sisa = daftar\`; \`namedtuple\` memberi nama pada posisi.
- **Set**: tanpa urutan dan tanpa duplikat; \`set()\` untuk set kosong; cek \`in\` sangat cepat.
- Operasi himpunan: \`|\` gabungan, \`&\` irisan, \`-\` selisih, \`^\` selisih simetris.
`,
};
