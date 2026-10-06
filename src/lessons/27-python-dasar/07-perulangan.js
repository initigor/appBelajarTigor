export default {
  id: 'py-perulangan',
  judul: 'Perulangan: for, while, break, dan continue',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Perulangan: for, while, break, dan continue 🔁

**Perulangan** (*loop*) mengulang blok kode berkali-kali. Tanpanya, mencetak 1000 baris butuh 1000 baris kode; dengan loop cukup tiga.

## for: mengulang untuk setiap elemen

\`for\` menelusuri **koleksi** (list, string, range, dll.) dan menjalankan blok untuk tiap elemen.

~~~python
for buah in ["apel", "mangga", "jeruk"]:
    print("Saya suka", buah)
~~~

String juga bisa ditelusuri karakter demi karakter:

~~~python
for huruf in "Python":
    print(huruf, end=" ")
print()
~~~

## range(): deretan angka

| Bentuk | Menghasilkan |
| --- | --- |
| \`range(5)\` | 0, 1, 2, 3, 4 |
| \`range(2, 6)\` | 2, 3, 4, 5 |
| \`range(0, 10, 3)\` | 0, 3, 6, 9 |
| \`range(5, 0, -1)\` | 5, 4, 3, 2, 1 |

Batas akhir **tidak termasuk**.

~~~python
for i in range(5):
    print(i)

print(list(range(2, 11, 2)))      # bilangan genap 2..10
print(list(range(5, 0, -1)))      # hitung mundur
~~~

### Menjumlahkan dan menghitung

~~~python
total = 0
for angka in range(1, 101):
    total += angka
print("Jumlah 1..100 =", total)
~~~

Pola yang sering dipakai: **akumulator** (\`total\`, \`hitung\`) yang diinisialisasi sebelum loop dan diperbarui di dalamnya.

## enumerate(): indeks sekaligus nilai

~~~python
nama = ["Andi", "Budi", "Cici"]

for urutan, orang in enumerate(nama, start=1):
    print(urutan, orang)
~~~

Bandingkan dengan cara kikuk \`for i in range(len(nama))\`; \`enumerate\` lebih jelas.

## while: mengulang selama kondisi benar

Dipakai bila **jumlah pengulangan tidak diketahui di muka**.

~~~python
saldo = 1000
tahun = 0

while saldo < 2000:
    saldo *= 1.07           # bunga 7% per tahun
    tahun += 1

print(f"Butuh {tahun} tahun, saldo {saldo:.0f}")
~~~

**Awas loop tak berujung:** pastikan sesuatu di dalam loop akhirnya membuat kondisi menjadi salah.

~~~python
# jangan jalankan versi ini: kondisinya tak pernah salah
# while True:
#     print("selamanya")

n = 10
while n > 0:
    print(n, end=" ")
    n -= 3
print("selesai")
~~~

## break dan continue

- \`break\`: **keluar** dari loop sekarang juga.
- \`continue\`: **lewati** sisa iterasi ini, lanjut ke iterasi berikutnya.

~~~python
for angka in range(1, 11):
    if angka % 2 == 0:
        continue            # lewati bilangan genap
    if angka > 7:
        break               # berhenti setelah 7
    print(angka)
~~~

### Pola loop tak berujung yang disengaja

~~~python
data = ["a", "b", "stop", "c"]
i = 0
while True:
    if data[i] == "stop":
        break
    print(data[i])
    i += 1
~~~

## else pada loop

\`else\` pada loop dijalankan bila loop **selesai normal** (tidak lewat \`break\`). Cocok untuk pencarian:

~~~python
for n in [3, 5, 8, 11]:
    if n % 2 == 0:
        print("ada genap:", n)
        break
else:
    print("tidak ada bilangan genap")
~~~

## Loop bersarang

~~~python
for baris in range(1, 4):
    for kolom in range(1, 4):
        print(baris * kolom, end="\\t")
    print()
~~~

Pola bintang:

~~~python
tinggi = 5
for i in range(1, tinggi + 1):
    print(" " * (tinggi - i) + "*" * (2 * i - 1))
~~~

Jumlah iterasi total loop bersarang adalah **hasil kali** (3 × 3 = 9 di atas): ingat materi kompleksitas.

## Contoh: tebak angka

Menggunakan \`random\` dengan *seed* agar hasilnya tetap sama saat dicoba:

~~~python
import random

random.seed(7)
rahasia = random.randint(1, 20)
tebakan_pengguna = [10, 15, 17, 18]

for percobaan, tebakan in enumerate(tebakan_pengguna, start=1):
    if tebakan < rahasia:
        print(percobaan, tebakan, "terlalu kecil")
    elif tebakan > rahasia:
        print(percobaan, tebakan, "terlalu besar")
    else:
        print(percobaan, tebakan, "benar!")
        break
else:
    print("Gagal. Angkanya", rahasia)
~~~

## Contoh: bilangan prima

~~~python
def prima(n):
    if n < 2:
        return False
    for pembagi in range(2, int(n ** 0.5) + 1):
        if n % pembagi == 0:
            return False
    return True

print([n for n in range(2, 40) if prima(n)])
~~~

## Kesalahan umum

- **Off-by-one**: lupa bahwa \`range(5)\` berhenti di 4, atau batas akhir tidak termasuk.
- **Mengubah list saat menelusurinya** (menghapus elemen di dalam \`for\` atas list yang sama).
- **Loop tak berujung** karena variabel kendali tidak pernah diperbarui.
- Lupa menginisialisasi akumulator **sebelum** loop.

## Latihan mandiri

1. Cetak tabel perkalian 1–10 untuk angka pilihanmu.
2. Hitung faktorial 10 dengan loop.
3. Cetak deret Fibonacci sampai 100 dengan \`while\`.
4. Hitung jumlah digit sebuah bilangan (123 → 6) dengan \`while\` dan \`%\`.

## Rangkuman

- \`for\` menelusuri koleksi; \`range(mulai, akhir, langkah)\` menghasilkan angka (akhir **tidak** termasuk); \`enumerate\` memberi indeks.
- \`while\` mengulang selama kondisi benar: pastikan kondisi akhirnya menjadi salah.
- \`break\` keluar dari loop, \`continue\` melewati iterasi; \`else\` pada loop berjalan bila tidak ada \`break\`.
- Loop bersarang mengalikan jumlah iterasi.
- Waspadai off-by-one dan loop tak berujung.
`,
};
