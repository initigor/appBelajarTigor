export default {
  id: 'py-dict',
  judul: 'Dictionary: Pasangan Kunci dan Nilai',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Dictionary: Pasangan Kunci dan Nilai 🗝️

**Dictionary** (\`dict\`) menyimpan data sebagai pasangan **kunci → nilai**. Pencarian lewat kunci sangat cepat (tabel hash, rata-rata O(1)). Dict adalah struktur data yang paling sering muncul di dunia nyata: data JSON, konfigurasi, hasil API, dan objek sederhana.

~~~python
mahasiswa = {
    "nama": "Budi",
    "umur": 20,
    "jurusan": "Informatika",
    "aktif": True,
}

print(mahasiswa)
print(mahasiswa["nama"])
print(len(mahasiswa))
~~~

> Sejak Python 3.7, dict **mempertahankan urutan penyisipan**.

## Aturan kunci

Kunci harus **unik** dan **hashable** (immutable): string, angka, tuple. List dan dict tidak boleh jadi kunci. Nilai boleh apa saja.

## Mengakses nilai

~~~python
data = {"nama": "Budi", "umur": 20}

print(data["nama"])             # kunci tidak ada -> KeyError
print(data.get("kota"))         # kunci tidak ada -> None
print(data.get("kota", "-"))    # dengan nilai bawaan
print("umur" in data)           # cek kunci
~~~

~~~python
# galat
data = {"nama": "Budi"}
print(data["alamat"])
~~~

Gunakan \`get\` bila kunci mungkin tidak ada.

## Menambah, mengubah, menghapus

~~~python
data = {"nama": "Budi"}

data["umur"] = 20               # tambah
data["nama"] = "Budi S."        # ubah
data.update({"kota": "Jakarta", "umur": 21})   # banyak sekaligus
print(data)

umur = data.pop("umur")         # hapus + ambil nilainya
del data["kota"]
print(umur, data)
~~~

## Menelusuri dict

| Method | Menghasilkan |
| --- | --- |
| \`keys()\` | semua kunci |
| \`values()\` | semua nilai |
| \`items()\` | pasangan (kunci, nilai) |

~~~python
nilai = {"Andi": 80, "Budi": 75, "Cici": 90}

for nama in nilai:                       # menelusuri kunci
    print(nama)

for nama, skor in nilai.items():         # pasangan sekaligus
    print(f"{nama}: {skor}")

print(list(nilai.keys()))
print(list(nilai.values()))
print(sum(nilai.values()) / len(nilai))
~~~

## Pola: menghitung kemunculan

Pola dict yang paling sering dipakai: hitung frekuensi kata/huruf.

~~~python
teks = "kucing dan kucing dan anjing dan kuda"

hitung = {}
for kata in teks.split():
    hitung[kata] = hitung.get(kata, 0) + 1
print(hitung)
~~~

Python menyediakan alat bantu di modul \`collections\`:

~~~python
from collections import Counter, defaultdict

print(Counter("mississippi"))
print(Counter("kucing dan kucing dan kuda".split()).most_common(2))

kelompok = defaultdict(list)
for kata in ["apel", "ara", "buah", "bola", "apung"]:
    kelompok[kata[0]].append(kata)
print(dict(kelompok))
~~~

## Dict bersarang (seperti JSON)

~~~python
kelas = {
    "Andi": {"uts": 80, "uas": 90},
    "Budi": {"uts": 70, "uas": 85},
}

print(kelas["Budi"]["uas"])
kelas["Cici"] = {"uts": 95, "uas": 88}

for nama, n in kelas.items():
    rata = (n["uts"] + n["uas"]) / 2
    print(f"{nama}: {rata}")
~~~

List di dalam dict dan sebaliknya sangat umum:

~~~python
toko = {
    "nama": "Toko Maju",
    "barang": [
        {"nama": "pensil", "harga": 2500},
        {"nama": "buku", "harga": 15000},
    ],
}
total = sum(b["harga"] for b in toko["barang"])
print(toko["nama"], total)
~~~

## Menggabungkan dan membalik

~~~python
a = {"x": 1, "y": 2}
b = {"y": 20, "z": 30}

print({**a, **b})       # b menimpa kunci yang sama
print(a | b)            # operator gabung (Python 3.9+)

kebalikan = {nilai: kunci for kunci, nilai in a.items()}
print(kebalikan)
~~~

## Menyalin dict

~~~python
asli = {"a": 1}
alias = asli                # BUKAN salinan
salinan = asli.copy()       # salinan dangkal
alias["a"] = 99
print(asli, salinan)
~~~

## Mengurutkan dict

Dict tidak diurutkan di tempat, tetapi kamu bisa membuat daftar terurut dari itemnya:

~~~python
nilai = {"Andi": 80, "Budi": 75, "Cici": 90}

urut = sorted(nilai.items(), key=lambda pasangan: pasangan[1], reverse=True)
print(urut)
print(max(nilai, key=nilai.get))      # kunci dengan nilai terbesar
~~~

## Kapan memakai apa?

| Kebutuhan | Pilihan |
| --- | --- |
| Data berurutan, diakses via posisi | list / tuple |
| Pencarian via kunci/nama | **dict** |
| Cek keanggotaan dan keunikan | set |
| Objek dengan field tetap | dict sederhana, \`dataclass\` (bab OOP) |

## Latihan mandiri

1. Hitung frekuensi huruf pada kalimat pilihanmu, lalu cetak tiga huruf paling sering.
2. Buat "buku telepon" (dict nama → nomor) dan cari nama yang tidak ada dengan \`get\`.
3. Kelompokkan daftar angka menjadi \`{"genap": [...], "ganjil": [...]}\`.

## Rangkuman

- **dict**: pasangan kunci → nilai, pencarian cepat; kunci unik dan hashable; urutan penyisipan terjaga.
- Akses: \`d[k]\` (KeyError bila tidak ada) atau \`d.get(k, bawaan)\`; ubah dengan \`d[k] = v\`, \`update\`, \`pop\`, \`del\`.
- Telusuri dengan \`keys()\`, \`values()\`, \`items()\`; pola hitung: \`d[k] = d.get(k, 0) + 1\`, atau \`Counter\`/\`defaultdict\`.
- Dict bersarang menyerupai JSON; gabung dengan \`{**a, **b}\` atau \`a | b\`.
- \`b = a\` tidak menyalin; pakai \`copy()\`.
`,
};
