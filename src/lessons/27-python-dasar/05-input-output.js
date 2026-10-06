export default {
  id: 'py-input-output',
  judul: 'Input dan Output Interaktif',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Input dan Output Interaktif ⌨️

Program yang berguna berinteraksi dengan penggunanya: meminta data, memprosesnya, lalu menampilkan hasil. Di Python, **masukan** lewat \`input()\` dan **keluaran** lewat \`print()\`.

## print() lebih dalam

\`print\` punya parameter bernama untuk mengatur tampilan:

| Parameter | Fungsi | Bawaan |
| --- | --- | --- |
| \`sep\` | pemisah antar-nilai | spasi |
| \`end\` | akhir cetakan | baris baru \`\\n\` |

~~~python
print("a", "b", "c")
print("a", "b", "c", sep="-")
print("Loading", end="...")
print("selesai")
print("Tanpa", "spasi", sep="")
~~~

Mencetak beberapa baris sekaligus:

~~~python
print("Baris 1\\nBaris 2\\nBaris 3")
print("=" * 20)
print("Judul".center(20))
print("=" * 20)
~~~

## input(): membaca dari pengguna

\`input(pesan)\` menampilkan pesan, menunggu pengguna mengetik lalu menekan Enter, dan **mengembalikan apa yang diketik sebagai string**.

Jalankan kotak di bawah: akan muncul kolom untuk mengetik jawabanmu di bawah kode.

~~~python
nama = input("Siapa namamu? ")
print(f"Halo, {nama}! Selamat belajar Python.")
~~~

### Jebakan terbesar: input() selalu menghasilkan string

~~~python
umur = input("Umurmu berapa? ")
print(type(umur))
print(umur + umur)       # menyambung teks, bukan menjumlahkan angka!
~~~

Ubah dulu ke angka dengan \`int()\` atau \`float()\`:

~~~python
umur = int(input("Umurmu berapa? "))
print("Tahun depan kamu berumur", umur + 1)
~~~

Jika pengguna mengetik sesuatu yang bukan angka, \`int()\` melempar \`ValueError\`. Cara menanganinya dibahas di bab penanganan galat.

## Contoh program: kalkulator indeks massa tubuh (BMI)

Alurnya klasik: **masukan → proses → keluaran**.

~~~python
berat = float(input("Berat badan (kg): "))
tinggi_cm = float(input("Tinggi badan (cm): "))

tinggi_m = tinggi_cm / 100
bmi = berat / tinggi_m ** 2

print(f"BMI kamu: {bmi:.1f}")
if bmi < 18.5:
    print("Kategori: kurus")
elif bmi < 25:
    print("Kategori: normal")
else:
    print("Kategori: gemuk")
~~~

## Beberapa masukan sekaligus

~~~python
# contoh input: 3 4
data = input("Masukkan dua angka dipisah spasi: ")
a, b = data.split()
print("Jumlah:", int(a) + int(b))
~~~

~~~python
# contoh input: 3 4
# bentuk ringkas dengan map
a, b = map(int, input("Dua angka dipisah spasi: ").split())
print(a * b)
~~~

## Memformat keluaran yang rapi

Tabel sederhana dengan lebar kolom tetap:

~~~python
barang = [("Buku", 3, 15000), ("Pensil", 10, 2500), ("Penghapus", 2, 4000)]

print(f"{'Barang':<12}{'Jml':>5}{'Harga':>10}{'Total':>12}")
print("-" * 39)
total_semua = 0
for nama, jumlah, harga in barang:
    total = jumlah * harga
    total_semua += total
    print(f"{nama:<12}{jumlah:>5}{harga:>10,}{total:>12,}")
print("-" * 39)
print(f"{'TOTAL':<27}{total_semua:>12,}")
~~~

## Membaca input di program sungguhan

Di komputermu, \`input()\` membaca dari keyboard di terminal. Untuk data yang banyak, program biasanya membaca dari **argumen command-line**, **berkas**, atau **API**, bukan menunggu orang mengetik (dibahas di bab selanjutnya).

## Latihan mandiri

1. Minta nama dan tahun lahir, lalu cetak "Halo <nama>, umurmu sekitar <n> tahun".
2. Minta panjang dan lebar, lalu cetak luas dan kelilingnya.
3. Minta suhu dalam Celsius, lalu cetak Fahrenheit dengan satu desimal.

## Rangkuman

- \`print(..., sep=..., end=...)\` mengatur pemisah dan akhir cetakan.
- \`input(pesan)\` membaca satu baris dan **selalu mengembalikan string**; ubah dengan \`int()\`/\`float()\` bila butuh angka.
- Pola dasar program: **masukan → proses → keluaran**.
- f-string dengan spesifikasi lebar dan format (\`:<12\`, \`:>10,\`, \`:.2f\`) membuat keluaran rapi.
- Masukan yang tidak sesuai (\`int("abc")\`) memicu \`ValueError\` — ditangani dengan \`try/except\`.
`,
};
