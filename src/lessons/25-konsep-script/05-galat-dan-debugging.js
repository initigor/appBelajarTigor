export default {
  id: 'konsep-galat-debugging',
  judul: 'Jenis Galat dan Cara Debugging',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Jenis Galat dan Cara Debugging 🐞

Setiap programmer, dari pemula sampai ahli, menghabiskan sebagian besar waktunya **mencari dan memperbaiki kesalahan**. Istilah *bug* populer sejak 1947, ketika seekor ngengat sungguhan ditemukan menyangkut di relai komputer Harvard Mark II. Keterampilan debugging yang sistematis membuatmu jauh lebih cepat daripada menebak-nebak.

## Tiga jenis galat

| Jenis | Kapan muncul | Penyebab | Dideteksi oleh |
| --- | --- | --- | --- |
| **Syntax error** (kompilasi) | Sebelum program berjalan | Melanggar aturan tata bahasa: tanda kurung kurang, salah indentasi, salah ketik kata kunci | Parser (compiler/interpreter) |
| **Runtime error** (eksekusi) | Saat program berjalan | Operasi yang mustahil: bagi dengan nol, berkas tidak ada, indeks di luar batas | Runtime, berupa *exception* |
| **Logic error** (logika) | Program jalan "normal" tetapi **hasilnya salah** | Algoritma atau kondisi yang salah | Hanya kamu (lewat pengujian) |

Yang paling berbahaya adalah galat logika: **tidak ada pesan galat sama sekali**.

### 1. Syntax error

Pesannya biasanya menunjuk baris dan jenis masalahnya:

~~~python
# galat
for i in range(3)
    print(i)
~~~

Pesan \`expected ':'\` memberi tahu bahwa titik dua setelah \`for ...\` terlupa. Ingatlah: baris yang ditunjuk kadang **baris sesudah** kesalahan sebenarnya (misalnya kurung yang belum ditutup di baris sebelumnya).

### 2. Runtime error

Sintaks benar, tetapi sesuatu tak mungkin dikerjakan. Python menghentikan program dan mencetak **traceback**:

~~~python
# galat
daftar = [10, 20, 30]
print(daftar[5])
~~~

Jenis exception yang paling sering ditemui:

| Exception | Penyebab khas |
| --- | --- |
| \`NameError\` | Memakai variabel yang belum dibuat (atau salah ketik nama) |
| \`TypeError\` | Operasi pada tipe yang salah (\`"a" + 1\`) |
| \`ValueError\` | Tipe benar tetapi nilai tidak masuk akal (\`int("abc")\`) |
| \`IndexError\` | Indeks di luar panjang list |
| \`KeyError\` | Kunci tidak ada di dict |
| \`ZeroDivisionError\` | Membagi dengan nol |
| \`FileNotFoundError\` | Berkas yang dibuka tidak ada |
| \`AttributeError\` | Objek tidak punya atribut/method itu |

### 3. Logic error

Perhatikan fungsi rata-rata ini. Ia berjalan tanpa pesan galat, tetapi jawabannya salah:

~~~python
def rata_rata(nilai):
    total = 0
    for n in nilai:
        total += n
    return total / len(nilai) + 1     # BUG: "+ 1" tidak seharusnya ada

print(rata_rata([80, 90, 100]))       # seharusnya 90.0
~~~

Tidak ada yang berteriak. Satu-satunya cara tahu adalah **membandingkan dengan hasil yang kamu harapkan**.

## Membaca traceback

Traceback dibaca dari **bawah ke atas**: baris terakhir menyebut **jenis galat dan pesannya**, baris-baris di atasnya menunjukkan **jejak pemanggilan** sampai ke sana.

~~~python
# galat
def bagi(a, b):
    return a / b

def hitung():
    return bagi(10, 0)

hitung()
~~~

Bacalah: \`ZeroDivisionError: division by zero\` (apa), lalu baris \`return a / b\` di \`bagi\` (di mana), lalu \`hitung\` yang memanggilnya (siapa yang memanggil).

## Langkah debugging yang sistematis

1. **Reproduksi**: temukan langkah pasti yang memunculkan bug. Bug yang tidak bisa diulang tidak bisa diperbaiki.
2. **Baca pesan galat** dengan teliti (jenis, baris, nilai).
3. **Persempit**: potong masalah menjadi bagian sekecil mungkin (komentari kode, buat contoh minimal).
4. **Buat hipotesis** tentang penyebabnya, lalu **uji**: bukan mengubah acak.
5. **Perbaiki satu hal** pada satu waktu.
6. **Verifikasi** bahwa bug hilang dan tidak ada yang rusak (uji ulang).
7. **Pahami penyebab akarnya** supaya tidak terulang.

## Alat bantu debugging

### Print debugging

Cetak nilai di titik-titik penting untuk melihat apa yang sebenarnya terjadi:

~~~python
def hitung_diskon(harga, persen):
    print("DEBUG harga =", harga, "persen =", persen)
    potongan = harga * persen / 100
    print("DEBUG potongan =", potongan)
    return harga - potongan

print(hitung_diskon(200000, 15))
~~~

### Assertion

\`assert\` menyatakan sesuatu yang **harus benar**; bila salah, program berhenti dengan jelas di tempat itu.

~~~python
# galat
def rata_rata(nilai):
    assert len(nilai) > 0, "daftar nilai tidak boleh kosong"
    return sum(nilai) / len(nilai)

print(rata_rata([]))
~~~

### Debugger

Debugger menjalankan program **langkah demi langkah**: memasang *breakpoint*, melihat isi variabel, dan melangkah baris demi baris (*step over*/*step into*). Tersedia di VS Code, PyCharm, dan lewat \`pdb\` (\`import pdb; pdb.set_trace()\` atau \`breakpoint()\`). Untuk bug yang rumit, debugger jauh lebih efisien daripada tumpukan \`print\`.

### Linter, type checker, dan tes

- **Linter** (pylint, flake8, ruff) menandai kode mencurigakan **tanpa menjalankannya**.
- **Type checker** (mypy) memeriksa type hint.
- **Tes otomatis** (unittest, pytest) menjalankan kode dengan masukan yang diketahui dan mencocokkan hasilnya, sehingga galat logika terdeteksi di muka dan **regresi** (perbaikan yang merusak hal lain) tertangkap.

### Teknik "rubber duck"

Jelaskan kodemu baris demi baris, dengan suara keras, kepada bebek karet (atau teman). Seringkali kamu menemukan sendiri kesalahannya di tengah penjelasan.

## Kebiasaan yang mencegah bug

- Tulis **fungsi kecil** yang melakukan satu hal.
- Beri **nama yang jelas** pada variabel.
- Uji dengan **kasus tepi**: daftar kosong, nol, angka negatif, teks sangat panjang.
- Jangan menyalin-tempel kode yang tidak kamu pahami.
- Commit sering supaya mudah kembali ke kondisi yang berfungsi.

## Rangkuman

- Tiga jenis galat: **syntax** (sebelum jalan), **runtime** (saat jalan, ada exception), **logic** (hasil salah tanpa pesan galat).
- Baca **traceback dari bawah ke atas**: jenis galat, lokasi, lalu rantai pemanggilan.
- Langkah debugging: reproduksi → baca pesan → persempit → hipotesis → perbaiki satu hal → verifikasi.
- Alat: print debugging, \`assert\`, debugger (\`breakpoint()\`), linter, type checker, dan tes otomatis.
- Pencegahan: fungsi kecil, nama jelas, uji kasus tepi, commit sering.
`,
};
