export default {
  id: 'py-numpy-pandas',
  judul: 'NumPy, pandas, dan matplotlib: Python untuk Data',
  tipe: 'teks',
  interaktif: 'python',
  xp: 35,
  materi: `
# NumPy, pandas, dan matplotlib: Python untuk Data 📊

Salah satu alasan terbesar Python mendominasi dunia data dan AI adalah tiga pustaka ini:

| Pustaka | Fungsi |
| --- | --- |
| **NumPy** | Array angka berkinerja tinggi dan operasi matematikanya |
| **pandas** | Tabel data (DataFrame): memuat, membersihkan, merangkum |
| **matplotlib** | Membuat grafik |

Mereka **ditulis dalam C**, sehingga jauh lebih cepat daripada loop Python biasa (ingat pelajaran bahasa tingkat rendah vs tinggi).

> **Catatan:** pada pemakaian pertama di halaman ini, ketiga pustaka diunduh otomatis dari internet saat kamu menekan **▶ Jalankan** (beberapa megabyte, jadi butuh waktu beberapa detik). Setelah itu sesi berikutnya lebih cepat. Di **Python Notebook** di Workspace, hasilnya persis sama dan grafik tampil di bawah sel.

## NumPy: array

\`ndarray\` adalah array **homogen** (semua elemen bertipe sama) yang disimpan rapat di memori, dengan operasi **vektor** yang berlaku ke seluruh elemen sekaligus (SIMD di balik layar).

~~~python
import numpy as np

a = np.array([1, 2, 3, 4, 5])
print(a)
print(type(a), a.dtype, a.shape)

print(a * 2)               # operasi per elemen, tanpa loop
print(a + 10)
print(a ** 2)
print(a.mean(), a.sum(), a.max())
~~~

Bandingkan dengan list biasa yang \`* 2\` berarti **menggandakan** isinya:

~~~python
import numpy as np
print([1, 2, 3] * 2)
print(np.array([1, 2, 3]) * 2)
~~~

### Membuat array

~~~python
import numpy as np

print(np.zeros(4))
print(np.ones((2, 3)))
print(np.arange(0, 10, 2))
print(np.linspace(0, 1, 5))        # 5 titik sama jarak dari 0 sampai 1
print(np.eye(3))
~~~

### Array 2D, shape, dan indeks

~~~python
import numpy as np

m = np.array([[1, 2, 3],
              [4, 5, 6]])

print(m.shape)               # (baris, kolom)
print(m[0, 2], m[1])         # elemen; baris
print(m[:, 1])               # kolom kedua
print(m.T)                   # transpos
print(m.sum(axis=0), m.sum(axis=1))      # jumlah per kolom, per baris
print(m.reshape(3, 2))
~~~

### Boolean masking: menyaring

~~~python
import numpy as np

nilai = np.array([80, 55, 90, 40, 72])

print(nilai >= 60)                 # array True/False
print(nilai[nilai >= 60])          # hanya yang lulus
print((nilai >= 60).sum(), "lulus dari", nilai.size)
nilai[nilai < 60] = 60             # ubah yang di bawah 60
print(nilai)
~~~

### Mengapa NumPy cepat?

~~~python
import time
import numpy as np

n = 1_000_000
daftar = list(range(n))
larik = np.arange(n)

mulai = time.perf_counter()
hasil1 = [x * 2 for x in daftar]
t_list = time.perf_counter() - mulai

mulai = time.perf_counter()
hasil2 = larik * 2
t_np = time.perf_counter() - mulai

print("list :", round(t_list * 1000, 1), "ms")
print("numpy:", round(t_np * 1000, 1), "ms")
~~~

### Statistik dan acak

~~~python
import numpy as np

rng = np.random.default_rng(42)           # seed supaya hasil sama
data = rng.normal(loc=70, scale=10, size=1000)   # 1000 nilai berdistribusi normal

print(round(data.mean(), 1), round(data.std(), 1))
print(round(np.percentile(data, 90), 1))
~~~

## pandas: tabel data

Struktur utamanya adalah **DataFrame**: tabel dengan baris berindeks dan kolom bernama; satu kolom adalah **Series**.

~~~python
import pandas as pd

data = {
    "nama": ["Andi", "Budi", "Cici", "Dina", "Eka"],
    "jurusan": ["IF", "SI", "IF", "SI", "IF"],
    "nilai": [85, 70, 92, 66, 78],
}
df = pd.DataFrame(data)

print(df)
print(df.shape)
print(df.dtypes)
~~~

### Melihat dan memilih data

~~~python
import pandas as pd

df = pd.DataFrame({
    "nama": ["Andi", "Budi", "Cici", "Dina", "Eka"],
    "jurusan": ["IF", "SI", "IF", "SI", "IF"],
    "nilai": [85, 70, 92, 66, 78],
})

print(df.head(3))
print(df["nilai"].mean())                # satu kolom
print(df[["nama", "nilai"]])             # beberapa kolom
print(df[df["nilai"] >= 75])             # penyaringan baris
print(df.loc[1, "nama"])                 # baris 1, kolom nama
~~~

### Kolom baru dan pengurutan

~~~python
import pandas as pd

df = pd.DataFrame({"nama": ["Andi", "Budi", "Cici"], "nilai": [85, 70, 92]})

df["lulus"] = df["nilai"] >= 75
df["grade"] = pd.cut(df["nilai"], bins=[0, 70, 80, 100], labels=["C", "B", "A"])
print(df.sort_values("nilai", ascending=False))
~~~

### Merangkum dengan groupby

~~~python
import pandas as pd

df = pd.DataFrame({
    "jurusan": ["IF", "SI", "IF", "SI", "IF"],
    "nilai": [85, 70, 92, 66, 78],
})

print(df.groupby("jurusan")["nilai"].mean())
print(df.groupby("jurusan")["nilai"].agg(["count", "mean", "max"]))
print(df.describe())
~~~

### Membaca dan menulis berkas

Di komputermu, data biasanya datang dari berkas:

~~~py
df = pd.read_csv("nilai.csv")
df.to_csv("hasil.csv", index=False)
df = pd.read_json("data.json")
df = pd.read_excel("laporan.xlsx")      # butuh paket openpyxl
~~~

Di sini kita membuatnya dari teks supaya bisa dijalankan:

~~~python
import io
import pandas as pd

csv = """tanggal,penjualan
2026-10-01,120
2026-10-02,135
2026-10-03,98
2026-10-04,160
"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])
print(df)
print(df["penjualan"].sum(), df["tanggal"].dt.day_name().tolist())
~~~

### Data hilang

~~~python
import numpy as np
import pandas as pd

df = pd.DataFrame({"a": [1, None, 3], "b": [4, 5, np.nan]})
print(df.isna().sum())
print(df.fillna(0))
print(df.dropna())
~~~

## matplotlib: grafik

\`matplotlib.pyplot\` membuat grafik. Di halaman ini gambar tampil otomatis di bawah blok kode.

~~~python
import matplotlib.pyplot as plt

hari = [1, 2, 3, 4, 5]
suhu = [29, 31, 30, 33, 32]

plt.plot(hari, suhu, marker="o")
plt.title("Suhu 5 Hari")
plt.xlabel("Hari ke-")
plt.ylabel("Suhu (°C)")
plt.grid(True)
plt.show()
~~~

### Diagram batang dan histogram

~~~python
import matplotlib.pyplot as plt
import numpy as np

jurusan = ["IF", "SI", "TE"]
rata = [82, 74, 79]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3.5))

ax1.bar(jurusan, rata, color=["#4c8bf5", "#f5a94c", "#5cc28a"])
ax1.set_title("Rata-rata nilai")

data = np.random.default_rng(1).normal(70, 10, 500)
ax2.hist(data, bins=20, color="#8a5cf5")
ax2.set_title("Sebaran nilai")

plt.tight_layout()
plt.show()
~~~

### pandas + matplotlib

~~~python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "bulan": ["Jan", "Feb", "Mar", "Apr", "Mei"],
    "pemasukan": [12, 15, 14, 18, 21],
    "pengeluaran": [10, 11, 13, 14, 15],
})

df.plot(x="bulan", kind="line", marker="o", figsize=(7, 3.5), title="Keuangan (juta)")
plt.show()
~~~

## Alur kerja data yang umum

1. **Muat** data (\`read_csv\`, API, basis data).
2. **Bersihkan**: nilai hilang, duplikat, tipe salah.
3. **Jelajahi**: \`head\`, \`describe\`, \`groupby\`, grafik.
4. **Analisis/model**: statistik, pembelajaran mesin (scikit-learn).
5. **Sampaikan**: grafik dan laporan, sering di **notebook**: dokumen yang memadukan kode, hasil, dan narasi.

Itulah alasan Workspace situs ini menyediakan **Python Notebook (.ipynb)** yang kompatibel dengan Jupyter.

## Latihan mandiri

1. Buat array berisi 10 angka acak, lalu hitung rata-rata, standar deviasi, dan angka di atas rata-rata.
2. Buat DataFrame barang (nama, harga, stok), tambah kolom \`nilai_stok\`, urutkan dari terbesar, dan buat diagram batangnya.
3. Gambar grafik fungsi \`y = x²\` untuk x dari −5 sampai 5 dengan \`np.linspace\`.

## Rangkuman

- **NumPy**: array homogen dengan operasi vektor yang cepat; \`shape\`, indeks 2D, \`axis\`, dan *boolean masking*.
- **pandas**: \`DataFrame\`/\`Series\`; pilih dan saring (\`df[df["x"] > 5]\`), kolom baru, \`sort_values\`, \`groupby\`, \`describe\`, \`read_csv\`.
- **matplotlib**: \`plt.plot\`, \`bar\`, \`hist\`, lalu \`plt.show()\`; pandas punya \`df.plot(...)\`.
- Ketiganya berjalan cepat karena ditulis dalam C; alur data: muat → bersihkan → jelajahi → analisis → sampaikan (sering di notebook).
`,
};
