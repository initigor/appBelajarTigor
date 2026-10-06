export default {
  id: 'py-json-csv',
  judul: 'Format Data: JSON dan CSV',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Format Data: JSON dan CSV 🗃️

Program jarang bekerja sendirian: data datang dari API, aplikasi lain, atau spreadsheet. Dua format yang paling sering dijumpai adalah **JSON** (data bersarang, standar web) dan **CSV** (data tabel, standar spreadsheet). Python membawa modul bawaan untuk keduanya.

## JSON

**JSON** (*JavaScript Object Notation*) adalah format teks untuk data terstruktur. Bentuknya hampir identik dengan dict dan list Python.

~~~
{
  "nama": "Budi",
  "umur": 20,
  "aktif": true,
  "hobi": ["catur", "renang"],
  "alamat": {"kota": "Bandung", "kode_pos": null}
}
~~~

### Padanan tipe

| JSON | Python |
| --- | --- |
| object \`{}\` | \`dict\` |
| array \`[]\` | \`list\` |
| string | \`str\` |
| number | \`int\` / \`float\` |
| \`true\` / \`false\` | \`True\` / \`False\` |
| \`null\` | \`None\` |

### json.loads: teks → objek Python

~~~python
import json

teks = '{"nama": "Budi", "umur": 20, "hobi": ["catur", "renang"], "aktif": true}'
data = json.loads(teks)

print(type(data))
print(data["nama"], data["hobi"][1], data["aktif"])
~~~

### json.dumps: objek Python → teks

~~~python
import json

mahasiswa = {"nama": "Ani", "nilai": [80, 90], "lulus": True, "catatan": None}

print(json.dumps(mahasiswa))
print(json.dumps(mahasiswa, indent=2))
print(json.dumps({"kota": "Medan", "huruf": "é"}, ensure_ascii=False))
~~~

\`indent\` merapikan keluaran; \`ensure_ascii=False\` menjaga huruf non-ASCII tampil apa adanya.

### Ke dan dari berkas

\`json.dump\` / \`json.load\` (tanpa huruf s) bekerja dengan **objek berkas**:

~~~python
import json

pengaturan = {"tema": "gelap", "ukuran_huruf": 14, "favorit": ["a", "b"]}

with open("pengaturan.json", "w", encoding="utf-8") as f:
    json.dump(pengaturan, f, indent=2, ensure_ascii=False)

with open("pengaturan.json", encoding="utf-8") as f:
    dimuat = json.load(f)

print(dimuat == pengaturan)
print(dimuat["tema"])
~~~

### Galat JSON

~~~python
import json

try:
    json.loads("{nama: 'Budi'}")      # JSON harus memakai kutip dua
except json.JSONDecodeError as e:
    print("JSON tidak valid:", e.msg)
~~~

Tidak semua objek Python bisa jadi JSON (set, tanggal, objek buatan sendiri). Ubah dulu, misalnya set → list:

~~~python
import json
print(json.dumps({"tag": sorted({"b", "a"})}))
~~~

## CSV

**CSV** (*Comma-Separated Values*) menyimpan tabel: satu baris per record, kolom dipisah koma. Dibuka langsung oleh Excel/Google Sheets.

~~~
nama,jurusan,nilai
Andi,Informatika,85
Budi,Sistem Informasi,78
~~~

Jangan memecahnya dengan \`split(",")\`: data bisa berisi koma di dalam tanda kutip (\`"Jakarta, Indonesia"\`). Pakai modul \`csv\`.

### Membaca dengan DictReader

~~~python
import csv
import io

isi = """nama,jurusan,nilai
Andi,Informatika,85
Budi,"Sistem Informasi, Bisnis",78
Cici,Informatika,92
"""

pembaca = csv.DictReader(io.StringIO(isi))     # pada berkas asli: open("data.csv", newline="")
for baris in pembaca:
    print(baris["nama"], "-", baris["jurusan"], "-", int(baris["nilai"]))
~~~

Semua nilai dibaca sebagai **string**; ubah ke angka sendiri.

### Menulis dengan DictWriter

~~~python
import csv

data = [
    {"nama": "Andi", "nilai": 85},
    {"nama": "Budi", "nilai": 78},
]

with open("nilai.csv", "w", newline="", encoding="utf-8") as f:
    penulis = csv.DictWriter(f, fieldnames=["nama", "nilai"])
    penulis.writeheader()
    penulis.writerows(data)

print(open("nilai.csv", encoding="utf-8").read())
~~~

\`newline=""\` mencegah baris kosong ekstra di Windows.

### Memproses data CSV

~~~python
import csv

with open("nilai.csv", newline="", encoding="utf-8") as f:
    baris = list(csv.DictReader(f))

nilai = [int(b["nilai"]) for b in baris]
print("Rata-rata:", sum(nilai) / len(nilai))
print("Tertinggi:", max(baris, key=lambda b: int(b["nilai"]))["nama"])
~~~

## Mengubah antar-format

Contoh klasik: CSV → JSON.

~~~python
import csv
import io
import json

isi = "nama,umur\\nAndi,20\\nBudi,21\\n"
data = [{"nama": r["nama"], "umur": int(r["umur"])} for r in csv.DictReader(io.StringIO(isi))]
print(json.dumps(data, indent=2))
~~~

## Kapan memakai apa?

| | JSON | CSV |
| --- | --- | --- |
| Bentuk data | Bersarang (pohon) | Tabel datar |
| Tipe | Ada angka, boolean, null | Semua teks |
| Pemakaian | API web, konfigurasi | Spreadsheet, ekspor database |
| Ukuran | Lebih besar | Ringkas |

Untuk analisis tabel besar, **pandas** (\`pd.read_csv\`) jauh lebih nyaman; dibahas di pelajaran terakhir.

## Latihan mandiri

1. Simpan daftar teman (dict dengan nama dan nomor telepon) ke \`teman.json\` lalu muat kembali.
2. Baca CSV nilai dan cetak mahasiswa yang nilainya di bawah rata-rata.
3. Konversi JSON berisi list produk menjadi CSV.

## Rangkuman

- **JSON**: data bersarang; \`json.loads\`/\`dumps\` untuk teks, \`json.load\`/\`dump\` untuk berkas; \`indent\` merapikan, \`JSONDecodeError\` untuk teks tidak valid.
- Padanan: object↔dict, array↔list, \`true/false/null\`↔\`True/False/None\`.
- **CSV**: tabel teks; gunakan \`csv.DictReader\`/\`DictWriter\` (bukan \`split(",")\`), buka dengan \`newline=""\`; semua nilai dibaca sebagai string.
- JSON cocok untuk API/konfigurasi, CSV untuk data tabel dan spreadsheet.
`,
};
