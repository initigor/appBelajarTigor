export default {
  id: 'py-list',
  judul: 'List: Koleksi yang Bisa Diubah',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# List: Koleksi yang Bisa Diubah 📋

**List** adalah struktur data paling serbaguna di Python: deretan nilai **berurutan** dan **bisa diubah** (*mutable*). Ditulis dengan kurung siku. Di balik layar ia adalah array dinamis (lihat materi struktur data).

~~~python
buah = ["apel", "mangga", "jeruk"]
campur = [1, "dua", 3.0, True, None]     # tipenya boleh berbeda-beda
kosong = []

print(buah)
print(campur)
print(len(buah), len(kosong))
~~~

## Indeks dan slicing

Sama seperti string: indeks mulai dari 0, negatif dari belakang, dan slicing \`[mulai:akhir:langkah]\`.

~~~python
nilai = [80, 75, 90, 65, 88]

print(nilai[0])         # elemen pertama
print(nilai[-1])        # terakhir
print(nilai[1:4])       # indeks 1,2,3
print(nilai[:2])        # dua pertama
print(nilai[::-1])      # dibalik
~~~

## Mengubah list

Berbeda dengan string, isi list **bisa diubah langsung**:

~~~python
nilai = [80, 75, 90]
nilai[1] = 78           # ganti elemen
print(nilai)

nilai.append(95)        # tambah di akhir
nilai.insert(0, 70)     # sisipkan di indeks 0
print(nilai)
~~~

## Method list yang penting

| Method | Fungsi |
| --- | --- |
| \`append(x)\` | tambah \`x\` di akhir |
| \`insert(i, x)\` | sisipkan \`x\` di indeks \`i\` |
| \`extend(lain)\` | tambahkan semua elemen \`lain\` |
| \`remove(x)\` | hapus kemunculan pertama \`x\` |
| \`pop(i)\` | ambil & hapus elemen indeks \`i\` (bawaan: terakhir) |
| \`index(x)\` | indeks pertama \`x\` |
| \`count(x)\` | berapa kali \`x\` muncul |
| \`sort()\` | urutkan **di tempat** |
| \`reverse()\` | balik urutan di tempat |
| \`copy()\` | salinan dangkal |
| \`clear()\` | kosongkan |

~~~python
angka = [5, 3, 8, 3, 1]

angka.append(10)
angka.remove(3)              # hanya yang pertama
print(angka)

terakhir = angka.pop()
print("diambil:", terakhir, "sisa:", angka)

print(angka.index(8), angka.count(3))
~~~

### sort() vs sorted()

\`sort()\` mengubah list aslinya dan mengembalikan \`None\`. \`sorted()\` membuat list baru dan membiarkan yang asli.

~~~python
data = [4, 1, 3, 2]

baru = sorted(data)
print(baru, data)           # data tidak berubah

data.sort(reverse=True)
print(data)

kata = ["pisang", "ara", "kiwi", "apel"]
print(sorted(kata))
print(sorted(kata, key=len))      # urut berdasarkan panjang
~~~

Kesalahan klasik: \`hasil = data.sort()\` membuat \`hasil\` bernilai \`None\`.

## Fungsi bawaan untuk list

~~~python
nilai = [80, 75, 90, 65, 88]

print(len(nilai))
print(sum(nilai))
print(min(nilai), max(nilai))
print(sum(nilai) / len(nilai))
print(90 in nilai)
~~~

## Menelusuri list

~~~python
nilai = [80, 75, 90]

for n in nilai:
    print(n)

for i, n in enumerate(nilai):
    print(i, n)
~~~

## Operasi gabung dan ulang

~~~python
a = [1, 2]
b = [3, 4]
print(a + b)
print(a * 3)
print([0] * 5)
~~~

## Salinan vs referensi (jebakan penting!)

\`b = a\` **tidak menyalin**: keduanya menunjuk list yang sama.

~~~python
a = [1, 2, 3]
b = a
b.append(4)
print(a)                  # a ikut berubah

c = a.copy()              # salinan baru (juga: a[:] atau list(a))
c.append(5)
print(a, c)
~~~

\`copy()\` hanya **salinan dangkal**: list di dalam list masih dibagi.

~~~python
matriks = [[1, 2], [3, 4]]
salinan = matriks.copy()
salinan[0][0] = 99
print(matriks)            # ikut berubah karena list dalamnya dibagi

import copy
dalam = copy.deepcopy(matriks)
dalam[0][0] = 0
print(matriks, dalam)
~~~

Jebakan lain saat membuat list 2D:

~~~python
salah = [[0] * 3] * 2      # DUA referensi ke SATU list yang sama
salah[0][0] = 1
print(salah)

benar = [[0] * 3 for _ in range(2)]
benar[0][0] = 1
print(benar)
~~~

## List bersarang

~~~python
nilai_kelas = [
    ["Andi", 80, 90],
    ["Budi", 75, 85],
]
print(nilai_kelas[1][0], nilai_kelas[1][2])

for nama, uts, uas in nilai_kelas:
    print(f"{nama}: rata-rata {(uts + uas) / 2}")
~~~

## List sebagai stack dan queue

~~~python
tumpukan = []
tumpukan.append("a")
tumpukan.append("b")
print(tumpukan.pop())     # b (LIFO)
~~~

Untuk antrean gunakan \`collections.deque\`, karena \`list.pop(0)\` lambat untuk data besar.

## Menghapus berdasarkan indeks atau irisan

~~~python
huruf = list("abcdefg")
del huruf[0]
del huruf[1:3]
print(huruf)
~~~

## Latihan mandiri

1. Buat list berisi 5 nilai, lalu cetak rata-rata, nilai tertinggi, dan terendah.
2. Hapus semua angka negatif dari list \`[3, -1, 4, -5, 9]\` (petunjuk: buat list baru).
3. Urutkan daftar nama berdasarkan huruf terakhirnya dengan \`key=\`.

## Rangkuman

- List = deretan berurutan yang **mutable**: \`[1, "dua", 3.0]\`.
- Indeks/slicing seperti string; ubah dengan \`lst[i] = x\`, \`append\`, \`insert\`, \`extend\`, \`remove\`, \`pop\`.
- \`sort()\` mengubah di tempat (mengembalikan \`None\`); \`sorted()\` membuat list baru; \`key=\` menentukan kriteria.
- \`b = a\` tidak menyalin; pakai \`copy()\`/\`a[:]\`, dan \`copy.deepcopy\` untuk list bersarang.
- Hati-hati \`[[0]*3]*2\`: gunakan comprehension untuk list 2D.
`,
};
