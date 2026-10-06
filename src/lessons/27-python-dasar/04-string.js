export default {
  id: 'py-string',
  judul: 'String: Indeks, Slicing, dan Method',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# String: Indeks, Slicing, dan Method 🔤

**String** (\`str\`) adalah rangkaian karakter Unicode. Hampir setiap program memproses teks: nama, pesan, berkas, dan data dari web.

## Membuat string

~~~python
a = "kutip dua"
b = 'kutip satu'
c = "Dia berkata: 'halo'"          # kutip satu di dalam kutip dua
d = """Teks
beberapa
baris"""                           # kutip tiga: boleh berbaris-baris

print(a, b, c, sep=" | ")
print(d)
~~~

**Escape sequence** memakai garis miring terbalik:

| Kode | Arti |
| --- | --- |
| \`\\n\` | baris baru |
| \`\\t\` | tab |
| \`\\\\\` | satu garis miring terbalik |
| \`\\"\` | kutip dua |

~~~python
print("Baris 1\\nBaris 2\\tBertab")
print("Lokasi: C:\\\\Users\\\\Budi")
print(r"Raw string: C:\\Users\\Budi \\n tidak diproses")    # awalan r = raw
~~~

## Indeks

Tiap karakter punya **indeks** mulai dari **0**. Indeks negatif menghitung dari belakang (-1 = terakhir).

~~~
 p   y   t   h   o   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
~~~

~~~python
kata = "python"
print(kata[0])      # p
print(kata[3])      # h
print(kata[-1])     # n (terakhir)
print(len(kata))    # 6
~~~

~~~python
# galat
kata = "python"
print(kata[10])
~~~

## Slicing: mengambil potongan

Bentuk: \`teks[mulai:akhir:langkah]\`. **Awal termasuk, akhir tidak termasuk.**

~~~python
kata = "pemrograman"
print(kata[0:3])     # pem
print(kata[3:])      # rograman  (sampai akhir)
print(kata[:3])      # pem       (dari awal)
print(kata[-4:])     # aman
print(kata[::2])     # setiap 2 karakter
print(kata[::-1])    # dibalik!
~~~

## String itu immutable

Karakter di dalam string **tidak bisa diubah** langsung; kamu membuat string baru.

~~~python
# galat
kata = "halo"
kata[0] = "H"
~~~

~~~python
kata = "halo"
kata = "H" + kata[1:]
print(kata)
~~~

## Operasi dasar

~~~python
print("Halo, " + "Dunia")      # penyambungan
print("ha" * 3)                 # pengulangan
print("an" in "banana")         # keanggotaan
print(len("Indonesia"))
~~~

## Method string yang sering dipakai

Method adalah fungsi milik objek, dipanggil dengan titik. Karena string immutable, method **mengembalikan string baru** dan tidak mengubah aslinya.

| Method | Fungsi | Contoh → hasil |
| --- | --- | --- |
| \`upper()\` / \`lower()\` | huruf besar/kecil | \`"Halo".upper()\` → \`"HALO"\` |
| \`title()\` | kapital tiap kata | \`"belajar python".title()\` |
| \`strip()\` | buang spasi di tepi | \`"  hi  ".strip()\` → \`"hi"\` |
| \`replace(a, b)\` | ganti teks | \`"apel".replace("a", "A")\` |
| \`split(sep)\` | pecah jadi list | \`"a,b,c".split(",")\` |
| \`join(daftar)\` | gabung list jadi string | \`"-".join(["a","b"])\` |
| \`find(x)\` | posisi pertama (-1 bila tak ada) | \`"banana".find("na")\` |
| \`count(x)\` | hitung kemunculan | \`"banana".count("a")\` |
| \`startswith\` / \`endswith\` | awalan/akhiran | \`"data.csv".endswith(".csv")\` |
| \`isdigit()\`, \`isalpha()\` | cek isi | \`"123".isdigit()\` |

~~~python
teks = "  Belajar Python itu Menyenangkan  "

print(teks.strip())
print(teks.lower())
print(teks.strip().replace("Python", "Pemrograman"))
print(teks.split())                     # tanpa argumen: pecah di spasi mana pun
print("data.csv".endswith(".csv"))
print("banana".count("a"), "banana".find("nan"))
print("-".join(["2026", "10", "07"]))
~~~

Method bisa **dirantai** karena tiap method mengembalikan string:

~~~python
email = "  Budi.Santoso@Contoh.COM  "
print(email.strip().lower())
~~~

## f-string: menyisipkan nilai ke dalam teks

Awali string dengan \`f\` lalu tulis ekspresi di dalam \`{ }\`. Ini cara modern yang paling dianjurkan.

~~~python
nama = "Budi"
umur = 20
print(f"{nama} berumur {umur} tahun")
print(f"Tahun depan {umur + 1} tahun")
print(f"Nama dalam huruf besar: {nama.upper()}")
~~~

### Pemformatan

Setelah titik dua \`:\` bisa ditentukan format:

~~~python
harga = 1234567.891
persen = 0.2375

print(f"{harga:.2f}")          # 2 angka desimal
print(f"{harga:,.2f}")         # pemisah ribuan
print(f"{persen:.1%}")         # persentase
print(f"{7:03d}")              # lebar 3, isi nol di depan -> 007
print(f"{'kiri':<10}|{'kanan':>10}|{'tengah':^10}|")
print(f"{255:b} {255:x} {255:o}")    # biner, heksa, oktal
~~~

## Memproses string

Contoh: menghitung jumlah huruf vokal.

~~~python
kalimat = "Saya belajar Python di Latihkode"
vokal = "aiueo"

jumlah = 0
for ch in kalimat.lower():
    if ch in vokal:
        jumlah += 1
print("Jumlah vokal:", jumlah)
~~~

Contoh: pengecekan palindrom (dibaca sama dari depan dan belakang):

~~~python
def palindrom(teks):
    bersih = "".join(ch.lower() for ch in teks if ch.isalnum())
    return bersih == bersih[::-1]

print(palindrom("Katak"))
print(palindrom("Ibu Ratna antar ubi"))
print(palindrom("Python"))
~~~

## Latihan mandiri

1. Ubah \`"belajar python itu asyik"\` menjadi \`"Belajar Python Itu Asyik"\`.
2. Ambil nama domain dari \`"budi@contoh.com"\` memakai \`split\` atau \`find\` dan slicing.
3. Cetak \`"Nilai: 85,50"\` dari variabel \`nilai = 85.5\` memakai f-string dengan dua desimal.

## Rangkuman

- String: kutip satu/dua/tiga, escape \`\\n \\t\`, dan raw string \`r"..."\`.
- Indeks mulai dari 0, negatif dari belakang; slicing \`[mulai:akhir:langkah]\` (akhir tidak termasuk); \`[::-1]\` membalik.
- String **immutable**: method seperti \`upper\`, \`strip\`, \`replace\` mengembalikan string baru.
- Method penting: \`split\`, \`join\`, \`find\`, \`count\`, \`startswith\`, \`endswith\`, \`isdigit\`.
- **f-string** (\`f"{x:.2f}"\`) adalah cara utama menyisipkan dan memformat nilai.
`,
};
