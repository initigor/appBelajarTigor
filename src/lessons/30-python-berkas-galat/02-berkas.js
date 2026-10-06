export default {
  id: 'py-file',
  judul: 'Membaca dan Menulis Berkas',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Membaca dan Menulis Berkas 🗂️

Variabel hilang saat program selesai. Agar data **bertahan**, program menyimpannya ke **berkas**. Operasi berkas juga dasar dari hampir semua skrip otomasi: memproses log, membaca konfigurasi, menyimpan hasil.

> Catatan: di halaman ini Python berjalan di browser dengan **sistem berkas virtual** di memori. Contoh berkas di bawah benar-benar bekerja, tetapi berkasnya hilang saat halaman ditutup. Di komputermu, berkas disimpan di disk sungguhan dengan kode yang sama persis.

## open(): membuka berkas

\`open(nama, mode)\` mengembalikan objek berkas.

| Mode | Arti |
| --- | --- |
| \`"r"\` | baca (default); galat bila berkas tidak ada |
| \`"w"\` | tulis; **menimpa** isi lama atau membuat baru |
| \`"a"\` | tambah di akhir (*append*) |
| \`"x"\` | buat baru; galat bila sudah ada |
| \`"b"\` | digabung untuk mode biner (\`"rb"\`, \`"wb"\`) |

## Menulis berkas

~~~python
with open("catatan.txt", "w", encoding="utf-8") as f:
    f.write("Baris pertama\\n")
    f.write("Baris kedua\\n")
    f.writelines(["Baris ketiga\\n", "Baris keempat\\n"])

print("berkas ditulis")
~~~

\`write\` **tidak** menambah baris baru otomatis: tulis \`\\n\` sendiri.

## with: cara aman membuka berkas

Pernyataan \`with\` memastikan berkas **ditutup otomatis**, bahkan bila terjadi galat (setara \`try/finally\` tetapi lebih rapi). Selalu pakai \`with\`.

## Membaca berkas

~~~python
with open("catatan.txt", encoding="utf-8") as f:
    isi = f.read()

print(isi)
print(len(isi), "karakter")
~~~

Beberapa cara membaca:

~~~python
with open("catatan.txt", encoding="utf-8") as f:
    print(repr(f.readline()))        # satu baris
    print(f.readlines())             # sisa baris sebagai list

# cara terbaik untuk berkas besar: telusuri objek berkas (hemat memori)
with open("catatan.txt", encoding="utf-8") as f:
    for nomor, baris in enumerate(f, start=1):
        print(nomor, baris.rstrip("\\n"))
~~~

Menelusuri objek berkas langsung (\`for baris in f\`) membaca **satu baris pada satu waktu**, sehingga berkas sebesar apa pun aman.

## Menambah ke berkas

~~~python
with open("catatan.txt", "a", encoding="utf-8") as f:
    f.write("Baris tambahan\\n")

with open("catatan.txt", encoding="utf-8") as f:
    print(f.read())
~~~

## Galat berkas

~~~python
try:
    with open("tidak_ada.txt") as f:
        print(f.read())
except FileNotFoundError:
    print("Berkas tidak ditemukan!")
~~~

Galat lain yang umum: \`PermissionError\` (tidak punya izin), \`IsADirectoryError\`, dan \`UnicodeDecodeError\` (salah encoding). Sebutkan \`encoding="utf-8"\` agar konsisten di semua sistem.

## pathlib: jalur berkas modern

Modul \`pathlib\` lebih rapi daripada merangkai string jalur, dan bekerja lintas OS.

~~~python
from pathlib import Path

p = Path("catatan.txt")
print(p.exists(), p.suffix, p.stem)

p.write_text("Halo dari pathlib\\nBaris dua\\n", encoding="utf-8")
print(p.read_text(encoding="utf-8"))

folder = Path("laporan") / "2026"
folder.mkdir(parents=True, exist_ok=True)
(folder / "ringkasan.txt").write_text("isi laporan", encoding="utf-8")

for item in sorted(Path(".").rglob("*.txt")):
    print(item)
~~~

## Contoh: menganalisis berkas teks

Menghitung frekuensi kata dalam sebuah berkas:

~~~python
from collections import Counter
from pathlib import Path

Path("puisi.txt").write_text("hujan turun pelan\\nhujan turun deras\\nlangit kelabu\\n", encoding="utf-8")

hitung = Counter()
with open("puisi.txt", encoding="utf-8") as f:
    for baris in f:
        hitung.update(baris.split())

for kata, n in hitung.most_common(3):
    print(kata, n)
~~~

## Contoh: log sederhana

~~~python
from datetime import datetime

def catat(pesan, berkas="aplikasi.log"):
    stempel = datetime(2026, 10, 7, 14, 30).strftime("%Y-%m-%d %H:%M")
    with open(berkas, "a", encoding="utf-8") as f:
        f.write(f"[{stempel}] {pesan}\\n")

catat("Program dimulai")
catat("Memproses 3 berkas")
print(open("aplikasi.log", encoding="utf-8").read())
~~~

## Berkas biner

Gambar, PDF, dan berkas terkompresi dibuka dengan mode \`"rb"\`/\`"wb"\` dan memakai \`bytes\`, bukan string:

~~~python
data = bytes([72, 97, 108, 111])
with open("data.bin", "wb") as f:
    f.write(data)

with open("data.bin", "rb") as f:
    isi = f.read()
print(isi, list(isi), isi.decode("ascii"))
~~~

## Menghapus dan memeriksa

~~~python
import os

print(os.path.exists("data.bin"))
os.remove("data.bin")
print(os.path.exists("data.bin"))
~~~

## Latihan mandiri

1. Tulis program yang menyimpan daftar nama (satu per baris) lalu membacanya kembali dan mencetak dengan nomor.
2. Hitung jumlah baris, kata, dan karakter sebuah berkas teks.
3. Buat fungsi yang menambahkan satu entri ke berkas "todo.txt" tiap dipanggil.

## Rangkuman

- \`open(nama, mode)\`; mode \`"r"\` baca, \`"w"\` tulis (menimpa), \`"a"\` tambah, \`"b"\` biner.
- **Selalu pakai \`with\`** agar berkas ditutup otomatis; sebutkan \`encoding="utf-8"\`.
- Baca dengan \`read()\`, \`readline()\`, \`readlines()\`, atau menelusuri objek berkas baris demi baris (hemat memori).
- \`write\` tidak menambah baris baru otomatis.
- Tangani \`FileNotFoundError\`; gunakan \`pathlib.Path\` untuk jalur dan operasi berkas yang rapi.
`,
};
