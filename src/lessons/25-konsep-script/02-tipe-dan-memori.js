export default {
  id: 'konsep-tipe-memori',
  judul: 'Sistem Tipe dan Manajemen Memori',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Sistem Tipe dan Manajemen Memori 🧠

Dua ciri bahasa yang paling memengaruhi pengalaman memrogram: **bagaimana bahasa memperlakukan tipe data** dan **siapa yang mengurus memori**. Keduanya menjelaskan mengapa C terasa "keras" dan Python terasa "longgar".

## Apa itu tipe data?

**Tipe** menentukan jenis nilai (bilangan bulat, pecahan, teks, daftar), ukurannya di memori, dan operasi apa yang boleh dilakukan. Menjumlahkan dua angka masuk akal; menjumlahkan angka dengan daftar tidak.

## Tipe statis vs tipe dinamis

| | **Tipe statis** | **Tipe dinamis** |
| --- | --- | --- |
| Tipe diperiksa | Saat **kompilasi** (sebelum jalan) | Saat **runtime** (ketika kode dijalankan) |
| Tipe melekat pada | **Variabel** | **Nilai** (objek) |
| Deklarasi | Wajib: \`int umur = 20;\` | Tidak perlu: \`umur = 20\` |
| Galat tipe | Terdeteksi dini oleh compiler | Baru muncul saat baris dijalankan |
| Contoh | C, C++, Java, Go, Rust, TypeScript | Python, JavaScript, Ruby, PHP |

Di bahasa dinamis, **variabel hanyalah nama** yang boleh menunjuk ke nilai bertipe apa pun dari waktu ke waktu:

~~~python
x = 10
print(type(x))
x = "sepuluh"
print(type(x))
x = [1, 2, 3]
print(type(x))
~~~

Di Java atau C hal itu ditolak compiler, karena \`x\` dideklarasikan sebagai \`int\` selamanya.

**Duck typing** adalah gaya khas bahasa dinamis: *"jika berjalan seperti bebek dan bersuara seperti bebek, maka ia bebek."* Yang penting objek **mampu melakukan operasi yang dibutuhkan**, bukan apa nama tipenya:

~~~python
def panjang_dua_kali(benda):
    return len(benda) * 2     # cukup ada len(); berlaku untuk teks, list, dll.

print(panjang_dua_kali("halo"))
print(panjang_dua_kali([1, 2, 3]))
~~~

Python juga mendukung **type hint** (\`def f(x: int) -> int\`) yang tidak dipaksa saat runtime tetapi bisa diperiksa oleh alat seperti **mypy** dan editor, jalan tengah antara kebebasan dan keamanan.

## Tipe kuat vs tipe lemah

Pembedaan ini **berbeda** dari statis/dinamis. Ia menjawab: apakah bahasa mau **mengubah tipe diam-diam** saat tipenya tidak cocok?

- **Tipe kuat (strong)**: menolak operasi tipe tidak cocok, kecuali kamu mengonversi secara eksplisit. **Python** termasuk kuat.
- **Tipe lemah (weak)**: banyak **konversi implisit** (otomatis). **JavaScript** dan C punya sisi lemah.

~~~python
# galat
print("umur: " + 20)
~~~

Python menolak (\`TypeError\`) dan memintamu memilih: \`"umur: " + str(20)\`. JavaScript justru mengubah angka itu menjadi teks secara otomatis (\`"umur: " + 20\` menghasilkan \`"umur: 20"\`), dan \`"5" * 2\` menghasilkan \`10\`. Nyaman, tetapi sering memicu kejutan.

| | Statis | Dinamis |
| --- | --- | --- |
| **Kuat** | Java, Rust, Go | Python, Ruby |
| **Lemah** | C | JavaScript, PHP |

## Manajemen memori: siapa yang membersihkan?

Setiap objek yang dibuat program memakan memori. Memori yang tidak lagi dipakai harus **dikembalikan**; kalau tidak, program makin membengkak (**memory leak**).

### Memori: stack dan heap

- **Stack**: tempat variabel lokal dan data pemanggilan fungsi; cepat, otomatis dibebaskan saat fungsi selesai.
- **Heap**: tempat objek yang hidup lebih lama atau ukurannya dinamis; dibebaskan sesuai kebijakan bahasa.

### Tiga pendekatan

| Pendekatan | Cara kerja | Contoh | Risiko |
| --- | --- | --- | --- |
| **Manual** | Programmer yang meminta dan melepaskan (\`malloc\`/\`free\`) | C, C++ (klasik) | Lupa \`free\` → leak; \`free\` dua kali atau pakai setelah bebas → crash dan celah keamanan |
| **Garbage collector (GC)** | Runtime mencari objek yang tidak terjangkau lalu menghapusnya secara otomatis | Java, C#, Go, JavaScript | Jeda GC sesekali; memori lebih boros |
| **Reference counting** | Tiap objek menghitung berapa nama yang menunjuknya; nol → dibuang | Python (CPython), Swift | Siklus referensi butuh GC tambahan |
| **Kepemilikan (ownership)** | Compiler membuktikan kapan memori boleh dibebaskan | Rust | Kurva belajar curam |

### Menyaksikan reference counting di Python

Variabel di Python hanyalah **nama yang menunjuk ke objek**. Dua nama bisa menunjuk objek yang sama:

~~~python
import sys

a = [1, 2, 3]
b = a                      # b menunjuk ke objek yang SAMA, bukan salinan
print("sama objek?", a is b)
print("id sama?   ", id(a) == id(b))

b.append(4)
print("a sekarang:", a)    # a ikut berubah!

c = a.copy()               # salinan baru
c.append(5)
print("a:", a, "| c:", c)
~~~

Ini sumber bug klasik pemula: mengubah \`b\` ternyata mengubah \`a\`. Cara memeriksanya: \`is\` membandingkan **identitas objek**, \`==\` membandingkan **isi**.

~~~python
x = [1, 2]
y = [1, 2]
print(x == y)    # True: isinya sama
print(x is y)    # False: dua objek berbeda
~~~

Python menghitung referensi tiap objek. Hitungannya bisa dilihat dengan \`sys.getrefcount\` (angkanya satu lebih besar karena pemanggilan fungsi itu sendiri ikut menunjuk objek):

~~~python
import sys

data = [10, 20]
print(sys.getrefcount(data))
lain = data
print(sys.getrefcount(data))
del lain
print(sys.getrefcount(data))
~~~

Ketika hitungan mencapai nol, memori langsung dibebaskan. Python juga memiliki **GC siklik** untuk kasus dua objek yang saling menunjuk.

## Mutable vs immutable

Objek **immutable** (tidak bisa diubah setelah dibuat): angka, string, tuple. Objek **mutable**: list, dict, set. Mengubah objek mutable lewat satu nama terlihat dari semua nama lain yang menunjuk ke sana.

~~~python
teks = "halo"
teks_besar = teks.upper()     # membuat string BARU, teks asli tak berubah
print(teks, teks_besar)
~~~

## Rangkuman

- **Tipe statis**: diperiksa saat kompilasi, tipe melekat pada variabel (C, Java). **Tipe dinamis**: diperiksa saat runtime, tipe melekat pada nilai (Python, JavaScript).
- **Kuat vs lemah** adalah soal konversi implisit: Python kuat (\`"a" + 1\` → \`TypeError\`), JavaScript lemah.
- **Duck typing**: yang penting objek mendukung operasi yang dibutuhkan; **type hint** menambah keamanan opsional.
- Memori: **stack** (cepat, otomatis) dan **heap**. Pengelolaannya **manual** (C), **GC** (Java, JS), **reference counting** (Python), atau **ownership** (Rust).
- Di Python, variabel adalah nama yang menunjuk ke objek: \`b = a\` tidak menyalin; \`is\` membandingkan identitas, \`==\` membandingkan isi.
`,
};
