export default {
  id: 'konsep-berpikir-komputasional',
  judul: 'Berpikir Komputasional dan Struktur Kontrol',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Berpikir Komputasional dan Struktur Kontrol 🧩

**Berpikir komputasional** (*computational thinking*) adalah cara memecahkan masalah yang membuatnya bisa dikerjakan komputer, dan ia berguna bahkan tanpa menulis kode. Pelajaran ini membahas empat keterampilan intinya, lalu tiga blok bangunan yang dipakai semua algoritma.

## Empat pilar

| Pilar | Pertanyaan kunci | Contoh: merancang aplikasi kasir |
| --- | --- | --- |
| **Dekomposisi** | Bagaimana memecah masalah besar menjadi bagian kecil? | Pisahkan: input barang, hitung total, hitung diskon, cetak struk |
| **Pengenalan pola** | Apa yang berulang atau mirip? | Semua barang punya nama, harga, jumlah, pola hitung yang sama |
| **Abstraksi** | Detail apa yang penting, apa yang bisa diabaikan? | Barang cukup diwakili nama dan harga, warna kemasan diabaikan |
| **Algoritma** | Langkah apa, dalam urutan apa? | Tulis langkah-langkah hitung total dan diskon |

### Dekomposisi dalam kode: fungsi

Masalah: *hitung total belanja dengan diskon 10% bila total di atas 100.000*. Pecah menjadi bagian-bagian, tiap bagian jadi fungsi dengan satu tugas:

~~~python
def hitung_subtotal(keranjang):
    return sum(harga * jumlah for harga, jumlah in keranjang)

def hitung_diskon(subtotal):
    return subtotal * 0.10 if subtotal > 100_000 else 0

def total_bayar(keranjang):
    subtotal = hitung_subtotal(keranjang)
    return subtotal - hitung_diskon(subtotal)

keranjang = [(25_000, 2), (40_000, 1), (15_000, 3)]   # (harga, jumlah)
print("Subtotal:", hitung_subtotal(keranjang))
print("Total bayar:", total_bayar(keranjang))
~~~

Keuntungannya: tiap fungsi **mudah diuji sendiri**, **dipakai ulang**, dan perubahan aturan diskon hanya menyentuh satu tempat.

### Abstraksi: menyembunyikan detail

Kamu memakai \`print\` tanpa tahu bagaimana huruf digambar di layar. Fungsi yang baik adalah **kotak hitam** dengan tugas jelas: kamu cukup tahu *apa* yang dilakukannya (nama, masukan, keluaran), tidak perlu tahu *bagaimana*. Abstraksi bertingkat inilah yang membuat sistem sebesar sistem operasi bisa dibangun oleh ribuan orang.

## Tiga struktur kontrol

Teorema **Böhm–Jacopini** (1966) menyatakan bahwa **setiap algoritma** dapat dinyatakan hanya dengan tiga struktur ini:

~~~
 1. Urutan (sequence)     2. Percabangan (selection)       3. Perulangan (iteration)

     langkah A                 ┌── ya ──► langkah A            ┌─► langkah A ──┐
        │                      │                               │               │
     langkah B           ◇ kondisi ?                           └── ya ◄── ◇ lagi? ──tidak──►
        │                      │
     langkah C                 └── tidak ──► langkah B
~~~

### 1. Urutan

Instruksi dikerjakan **satu per satu dari atas ke bawah**. Urutan penting: menukar dua baris dapat mengubah hasil.

~~~python
suhu_c = 36.6
suhu_f = suhu_c * 9 / 5 + 32
print(suhu_c, "C =", suhu_f, "F")
~~~

### 2. Percabangan

Memilih jalur berdasarkan **kondisi**.

~~~python
nilai = 76

if nilai >= 85:
    huruf = "A"
elif nilai >= 70:
    huruf = "B"
elif nilai >= 55:
    huruf = "C"
else:
    huruf = "D"

print("Nilai", nilai, "-> grade", huruf)
~~~

### 3. Perulangan

Mengulang blok selama kondisi terpenuhi atau untuk setiap elemen.

~~~python
# perulangan dengan jumlah pasti
for hari in range(1, 4):
    print("Hari ke-", hari)

# perulangan dengan kondisi
saldo = 100
bulan = 0
while saldo < 150:
    saldo = saldo * 1.10      # bunga 10% per bulan
    bulan += 1
print("Butuh", bulan, "bulan, saldo:", round(saldo, 2))
~~~

## Variabel, ekspresi, dan penugasan

- **Variabel**: nama untuk lokasi penyimpanan nilai yang bisa berubah.
- **Konstanta**: nilai yang tidak diubah (di Python berupa konvensi huruf kapital: \`PAJAK = 0.11\`).
- **Ekspresi**: gabungan nilai dan operator yang menghasilkan nilai (\`harga * jumlah\`).
- **Penugasan** (\`=\`) **bukan** persamaan matematika: ia berarti "hitung sisi kanan, lalu simpan ke nama di kiri". Karena itu \`x = x + 1\` valid dan berarti "naikkan x satu".

~~~python
x = 5
x = x + 1
print(x)
~~~

## Contoh gabungan: tebak FizzBuzz

Soal klasik: untuk angka 1 sampai 15 cetak "Fizz" bila habis dibagi 3, "Buzz" bila habis dibagi 5, "FizzBuzz" bila keduanya, selain itu angkanya. Ia memakai ketiga struktur sekaligus:

~~~python
for i in range(1, 16):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
~~~

Perhatikan **urutan pengecekan**: kondisi \`i % 15\` harus dicek lebih dulu. Jika \`i % 3\` dicek duluan, angka 15 salah dianggap "Fizz". Bug logika semacam ini sering muncul dari urutan kondisi.

## Rangkuman

- **Berpikir komputasional**: dekomposisi (pecah masalah), pengenalan pola, abstraksi (sembunyikan detail), dan algoritma (langkah terurut).
- Fungsi adalah alat dekomposisi dan abstraksi: satu tugas, mudah diuji dan dipakai ulang.
- Semua algoritma dibangun dari **urutan**, **percabangan**, dan **perulangan** (teorema Böhm–Jacopini).
- Penugasan (\`=\`) berarti "simpan hasil sisi kanan ke nama di kiri", bukan kesamaan; urutan kondisi \`if/elif\` menentukan hasil.
`,
};
