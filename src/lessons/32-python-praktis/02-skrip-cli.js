export default {
  id: 'py-script-cli',
  judul: 'Skrip Command-Line: sys.argv dan argparse',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Skrip Command-Line: sys.argv dan argparse 🖥️

Skrip yang berguna biasanya dijalankan dari terminal dengan **opsi** dan **argumen**: \`python hitung.py --kali 3 4\`. Dengan begitu satu skrip bisa dipakai berkali-kali dengan masukan berbeda tanpa mengedit kodenya, dan mudah digabungkan dengan alat lain. Ini juga cara kerja hampir semua program berbasis terminal.

## sys.argv: argumen mentah

\`sys.argv\` adalah list berisi **kata-kata yang diketik di command-line**. Elemen pertama adalah nama skrip.

Simpan sebagai \`sapa.py\`:

~~~py
import sys

print("Argumen:", sys.argv)
if len(sys.argv) > 1:
    print(f"Halo, {sys.argv[1]}!")
else:
    print("Pemakaian: python sapa.py NAMA")
~~~

~~~bash
python sapa.py Budi
# Argumen: ['sapa.py', 'Budi']
# Halo, Budi!
~~~

Karena di halaman ini tidak ada terminal, kita simulasikan dengan mengganti isi \`sys.argv\`:

~~~python
import sys

sys.argv = ["sapa.py", "Budi"]       # seolah-olah dijalankan: python sapa.py Budi
print("Argumen:", sys.argv)
print(f"Halo, {sys.argv[1]}!")
~~~

Semua argumen berupa **string**. Mengurusnya sendiri (opsi, nilai bawaan, pesan bantuan, validasi) cepat melelahkan. Karena itu ada \`argparse\`.

## argparse: argumen yang rapi

\`argparse\` mendefinisikan argumen apa saja yang diterima, mengubah tipenya, memberi nilai bawaan, dan **otomatis membuat pesan bantuan** (\`--help\`) serta pesan galat yang ramah.

~~~python
import argparse

parser = argparse.ArgumentParser(description="Menghitung luas persegi panjang")
parser.add_argument("panjang", type=float, help="panjang (cm)")
parser.add_argument("lebar", type=float, help="lebar (cm)")
parser.add_argument("--bulat", action="store_true", help="bulatkan hasil")

# Di terminal: parser.parse_args()  -> membaca sys.argv
# Di sini kita berikan daftar argumen secara langsung:
args = parser.parse_args(["12.5", "4", "--bulat"])

luas = args.panjang * args.lebar
print(round(luas) if args.bulat else luas)
~~~

Di skrip sungguhan cukup \`args = parser.parse_args()\`, lalu jalankan: \`python luas.py 12.5 4 --bulat\`.

### Jenis argumen

| Jenis | Contoh definisi | Contoh pemakaian |
| --- | --- | --- |
| **Posisional** (wajib) | \`add_argument("nama")\` | \`python s.py Budi\` |
| **Opsi** (diawali \`--\`) | \`add_argument("--kota", default="Jakarta")\` | \`--kota Bandung\` |
| **Flag** (saklar) | \`add_argument("--verbose", action="store_true")\` | \`--verbose\` |
| **Pilihan terbatas** | \`add_argument("--mode", choices=["cepat","akurat"])\` | \`--mode cepat\` |
| **Banyak nilai** | \`add_argument("berkas", nargs="+")\` | \`a.txt b.txt c.txt\` |
| **Bertipe** | \`type=int\` | \`--jumlah 5\` |

~~~python
import argparse

parser = argparse.ArgumentParser(prog="salam")
parser.add_argument("nama", help="nama orang yang disapa")
parser.add_argument("--ulang", type=int, default=1, help="berapa kali menyapa")
parser.add_argument("--keras", action="store_true", help="pakai huruf besar")
parser.add_argument("--bahasa", choices=["id", "en"], default="id")

args = parser.parse_args(["Ani", "--ulang", "2", "--keras"])

sapaan = {"id": "Halo", "en": "Hello"}[args.bahasa]
pesan = f"{sapaan}, {args.nama}!"
if args.keras:
    pesan = pesan.upper()
for _ in range(args.ulang):
    print(pesan)
~~~

### Pesan bantuan otomatis

~~~python
import argparse

parser = argparse.ArgumentParser(prog="salam", description="Menyapa seseorang")
parser.add_argument("nama", help="nama orang yang disapa")
parser.add_argument("--ulang", type=int, default=1, help="jumlah sapaan (default: 1)")

parser.print_help()
~~~

### Galat masukan ditangani otomatis

Bila pengguna memasukkan sesuatu yang tidak valid, \`argparse\` menampilkan pesan dan mengakhiri program dengan kode galat. Di sini kita tangkap agar halaman tidak berhenti:

~~~python
import argparse

parser = argparse.ArgumentParser(prog="hitung")
parser.add_argument("angka", type=int)

try:
    parser.parse_args(["bukan-angka"])
except SystemExit:
    print("(argparse menghentikan program dengan pesan galat di atas)")
~~~

## Pola skrip yang baik

~~~py
# hitung.py
import argparse

def hitung(a, b, operasi):
    if operasi == "tambah":
        return a + b
    if operasi == "kali":
        return a * b
    raise ValueError(f"operasi tidak dikenal: {operasi}")

def main(argumen=None):
    parser = argparse.ArgumentParser(description="Kalkulator kecil")
    parser.add_argument("a", type=float)
    parser.add_argument("b", type=float)
    parser.add_argument("--operasi", choices=["tambah", "kali"], default="tambah")
    args = parser.parse_args(argumen)

    print(hitung(args.a, args.b, args.operasi))

if __name__ == "__main__":
    main()
~~~

Pola ini punya tiga keunggulan:

1. Logika (\`hitung\`) **terpisah** dari urusan command-line, sehingga mudah diuji.
2. \`main(argumen=None)\` bisa dipanggil dengan daftar argumen langsung (untuk pengujian).
3. \`if __name__ == "__main__":\` membuat berkas bisa **dijalankan** sebagai skrip **dan diimpor** sebagai modul.

Coba versi yang dapat dijalankan di halaman:

~~~python
import argparse

def hitung(a, b, operasi):
    return a + b if operasi == "tambah" else a * b

def main(argumen=None):
    parser = argparse.ArgumentParser(description="Kalkulator kecil")
    parser.add_argument("a", type=float)
    parser.add_argument("b", type=float)
    parser.add_argument("--operasi", choices=["tambah", "kali"], default="tambah")
    args = parser.parse_args(argumen)
    print(hitung(args.a, args.b, args.operasi))

main(["3", "4"])
main(["3", "4", "--operasi", "kali"])
~~~

## Variabel lingkungan dan kode keluar

~~~python
import os

# variabel lingkungan: konfigurasi dari luar program (jangan menaruh kata sandi di kode!)
print(os.environ.get("PENGGUNA_SAYA", "(tidak diatur)"))
~~~

Program memberi tahu keberhasilannya lewat **kode keluar** (*exit code*): \`0\` = sukses, selain 0 = gagal. Alat lain (misalnya skrip CI dan shell) membacanya.

~~~py
import sys

if not berkas_ada:
    print("Berkas tidak ditemukan", file=sys.stderr)   # pesan galat ke stderr
    sys.exit(1)                                        # keluar dengan kode galat
~~~

## stdin dan stdout: bekerja dalam pipa

Program CLI yang baik bisa membaca dari **stdin** dan menulis ke **stdout** sehingga bisa dirangkai dengan perintah lain:

~~~bash
cat log.txt | python hitung_error.py | sort
~~~

~~~py
import sys

jumlah = sum(1 for baris in sys.stdin if "ERROR" in baris)
print(jumlah)
~~~

## Menjadikan skrip dapat dipakai di mana saja

- Tambahkan **shebang** (\`#!/usr/bin/env python3\`) dan \`chmod +x\` di Linux/macOS.
- Atau kemas sebagai paket dengan titik masuk (\`console_scripts\`) agar bisa dijalankan dengan satu nama perintah setelah \`pip install\`.

## Latihan mandiri

1. Buat skrip \`ucapan.py\` dengan argumen \`nama\` dan opsi \`--bahasa\` (id/en).
2. Buat skrip yang menerima daftar angka (\`nargs="+"\`) dan mencetak jumlah serta rata-ratanya.
3. Tambahkan opsi \`--verbose\` yang mencetak langkah-langkah perhitungan.

## Rangkuman

- \`sys.argv\` berisi argumen command-line mentah (semua string; elemen pertama nama skrip).
- \`argparse\`: definisikan argumen posisional, opsi (\`--x\`), flag (\`store_true\`), \`type\`, \`choices\`, \`nargs\`, dan dapatkan \`--help\` serta pesan galat otomatis.
- Pola baik: fungsi logika terpisah + \`main(argumen=None)\` + \`if __name__ == "__main__":\`.
- Variabel lingkungan untuk konfigurasi (\`os.environ\`); **kode keluar** 0 = sukses, selain itu gagal (\`sys.exit(1)\`); pesan galat ke \`stderr\`.
- Skrip yang membaca stdin dan menulis stdout bisa dirangkai dalam pipa.
`,
};
