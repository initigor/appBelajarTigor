export default {
  id: 'konsep-kompleksitas',
  judul: 'Kompleksitas Algoritma dan Notasi Big-O',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Kompleksitas Algoritma dan Notasi Big-O 📈

Dua algoritma bisa sama-sama benar tetapi sangat berbeda **efisiensinya**. Pada data kecil perbedaan itu tidak terlihat, pada data besar bisa berarti **1 detik vs 1 hari**. **Analisis kompleksitas** adalah cara mengukur efisiensi tanpa bergantung pada kecepatan komputer tertentu.

## Mengapa tidak cukup mengukur waktu dengan stopwatch?

Waktu nyata bergantung pada CPU, bahasa, beban sistem, dan kebetulan. Yang ingin kita ketahui: **bagaimana kebutuhan waktu (atau memori) tumbuh ketika ukuran masukan (n) membesar?** Jawabannya diukur dengan **jumlah langkah** sebagai fungsi dari n.

## Notasi Big-O

**Big-O** menyatakan **batas atas laju pertumbuhan** jumlah langkah untuk n yang besar. Dua aturan penyederhanaan:

1. **Buang konstanta**: \`3n\` dan \`100n\` sama-sama **O(n)**.
2. **Ambil suku yang paling dominan**: \`n² + 5n + 20\` menjadi **O(n²)**, karena untuk n besar suku n² mengalahkan yang lain.

### Kelas yang paling sering muncul

| Notasi | Nama | Contoh | n = 10 | n = 1.000 | n = 1.000.000 |
| --- | --- | --- | --- | --- | --- |
| **O(1)** | Konstan | Ambil \`daftar[i]\`, akses dict | 1 | 1 | 1 |
| **O(log n)** | Logaritmik | Binary search | ~3 | ~10 | ~20 |
| **O(n)** | Linear | Cari nilai dalam list tak urut | 10 | 1.000 | 1 juta |
| **O(n log n)** | Linearitmik | Sorting yang baik (merge sort) | ~33 | ~10.000 | ~20 juta |
| **O(n²)** | Kuadratik | Dua loop bersarang | 100 | 1 juta | 10¹² (!) |
| **O(2ⁿ)** | Eksponensial | Mencoba semua himpunan bagian | 1.024 | 10³⁰¹ | mustahil |

Pada n = 1 juta, algoritma O(n) selesai dalam sepersekian detik, O(n²) memakan **berhari-hari**. Itulah mengapa memilih algoritma sering lebih penting daripada mengoptimasi kode.

## Menghitung kompleksitas dari kode

~~~python
# O(1): satu langkah, berapa pun ukuran daftar
def elemen_pertama(daftar):
    return daftar[0]

# O(n): satu loop menelusuri semua elemen
def jumlah(daftar):
    total = 0
    for x in daftar:
        total += x
    return total

# O(n^2): loop di dalam loop
def ada_pasangan_sama(daftar):
    for i in range(len(daftar)):
        for j in range(i + 1, len(daftar)):
            if daftar[i] == daftar[j]:
                return True
    return False
~~~

Panduan cepat: **satu loop atas n → O(n)**, **loop bersarang → kalikan**, **pembagian dua berulang → O(log n)**, **urutan blok → ambil yang terbesar**.

## Contoh nyata: pencarian linear vs biner

**Pencarian linear**: periksa satu per satu. Terburuk n langkah.
**Pencarian biner** (hanya untuk daftar **terurut**): periksa elemen tengah, buang separuh yang pasti salah, ulangi. Terburuk sekitar log₂ n langkah.

Mari hitung jumlah perbandingan sebenarnya untuk mencari angka di daftar berisi 1 juta elemen:

~~~python
def cari_linear(daftar, target):
    langkah = 0
    for x in daftar:
        langkah += 1
        if x == target:
            return langkah
    return langkah

def cari_biner(daftar, target):
    kiri, kanan = 0, len(daftar) - 1
    langkah = 0
    while kiri <= kanan:
        langkah += 1
        tengah = (kiri + kanan) // 2
        if daftar[tengah] == target:
            return langkah
        elif daftar[tengah] < target:
            kiri = tengah + 1
        else:
            kanan = tengah - 1
    return langkah

data = list(range(1_000_000))      # sudah terurut
target = 999_999                   # kasus terburuk untuk linear

print("linear:", cari_linear(data, target), "langkah")
print("biner :", cari_biner(data, target), "langkah")
~~~

Satu juta langkah melawan sekitar 20. Selisih yang makin besar seiring data bertambah. Kelemahan biner: datanya **harus terurut** (mengurutkan sendiri memakan O(n log n)), jadi cocok bila **banyak pencarian** dilakukan pada data yang sama.

## Kompleksitas waktu vs ruang

- **Waktu**: berapa langkah.
- **Ruang (space)**: berapa memori tambahan. Seringkali ada pertukaran: memakai lebih banyak memori (misalnya tabel hash) untuk mendapat waktu lebih cepat.

~~~python
daftar = list(range(100_000))
kumpulan = set(daftar)      # butuh memori tambahan

print(99_999 in daftar)     # O(n): menelusuri list
print(99_999 in kumpulan)   # O(1) rata-rata: lookup tabel hash
~~~

## Kasus terbaik, rata-rata, terburuk

Satu algoritma bisa berperilaku berbeda tergantung masukan. Untuk pencarian linear: terbaik **O(1)** (target di depan), terburuk **O(n)** (di belakang atau tidak ada). Big-O lazimnya melaporkan **kasus terburuk**, karena itu jaminan yang berguna.

## Mengukur dengan waktu nyata

Teori dan praktik sebaiknya dipadukan. Percobaan berikut menunjukkan pertumbuhan kuadratik: waktu untuk n dua kali lebih besar mendekati **empat kali** lebih lama:

~~~python
import time

def kuadratik(n):
    hitung = 0
    for i in range(n):
        for j in range(n):
            hitung += 1
    return hitung

for n in (200, 400, 800):
    mulai = time.perf_counter()
    kuadratik(n)
    print("n =", n, "->", round((time.perf_counter() - mulai) * 1000, 1), "ms")
~~~

## Rangkuman

- **Big-O** menyatakan laju pertumbuhan jumlah langkah terhadap ukuran masukan n; buang konstanta dan ambil suku dominan.
- Urutan dari cepat ke lambat: **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)**.
- Satu loop → O(n); loop bersarang → O(n²); membagi dua berulang → O(log n).
- **Binary search** (data terurut) jauh lebih cepat daripada pencarian linear: ±20 vs 1.000.000 langkah untuk 1 juta elemen.
- Ada tukar-tambah **waktu vs memori** (mis. set/dict). Big-O biasanya melaporkan kasus terburuk.
`,
};
