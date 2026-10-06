export default {
  id: 'py-percabangan',
  judul: 'Percabangan: if, elif, else, dan match',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Percabangan: if, elif, else, dan match 🔀

**Percabangan** membuat program mengambil keputusan: menjalankan blok kode tertentu **hanya jika** sebuah kondisi terpenuhi.

## if

~~~python
suhu = 35

if suhu > 30:
    print("Panas, minum air putih!")
print("Selesai memeriksa suhu")
~~~

Anatomi: kata kunci \`if\`, **kondisi** (ekspresi bernilai True/False), titik dua \`:\`, lalu **blok yang menjorok**. Baris di luar blok tetap dijalankan.

## if – else

~~~python
nilai = 62

if nilai >= 70:
    print("Lulus")
else:
    print("Belum lulus")
~~~

## if – elif – else

Untuk lebih dari dua pilihan. Python memeriksa dari atas dan menjalankan **blok pertama yang kondisinya benar**, lalu melewati sisanya.

~~~python
nilai = 78

if nilai >= 85:
    grade = "A"
elif nilai >= 75:
    grade = "B"
elif nilai >= 60:
    grade = "C"
else:
    grade = "D"

print(f"Nilai {nilai} -> grade {grade}")
~~~

**Urutan menentukan hasil.** Bila kondisi \`nilai >= 60\` diletakkan paling atas, nilai 90 akan salah masuk "C". Susun dari kondisi yang paling spesifik.

## Kondisi majemuk

~~~python
umur = 20
punya_ktp = True

if umur >= 17 and punya_ktp:
    print("Boleh mendaftar")

hari = "Sabtu"
if hari == "Sabtu" or hari == "Minggu":
    print("Akhir pekan")

if hari in ("Sabtu", "Minggu"):     # lebih ringkas
    print("Akhir pekan (versi ringkas)")
~~~

## Kondisi truthy

Kondisi tidak harus True/False: nilai kosong dianggap salah.

~~~python
pesan = ""
if not pesan:
    print("Pesan kosong!")

keranjang = ["apel"]
if keranjang:
    print("Ada isinya:", keranjang)
~~~

## if bersarang

Blok \`if\` boleh berisi \`if\` lagi.

~~~python
umur = 20
punya_sim = False

if umur >= 17:
    if punya_sim:
        print("Boleh menyetir")
    else:
        print("Perlu membuat SIM dulu")
else:
    print("Belum cukup umur")
~~~

Terlalu banyak tingkat membuat kode sulit dibaca. Sering lebih rapi digabung: \`if umur >= 17 and punya_sim:\`.

## Ekspresi kondisional (ternary)

Untuk memilih satu nilai dalam satu baris: \`nilai_jika_benar if kondisi else nilai_jika_salah\`.

~~~python
umur = 16
status = "dewasa" if umur >= 17 else "anak"
print(status)

angka = 7
print("genap" if angka % 2 == 0 else "ganjil")
~~~

## match-case (Python 3.10+)

Pencocokan pola, mirip \`switch\` di bahasa lain tetapi lebih kuat. Berguna bila satu nilai dibandingkan dengan banyak kemungkinan.

~~~python
hari = 3

match hari:
    case 1:
        print("Senin")
    case 2:
        print("Selasa")
    case 3:
        print("Rabu")
    case 6 | 7:
        print("Akhir pekan")
    case _:
        print("Hari lainnya")
~~~

\`_\` adalah kasus bawaan (wildcard). \`match\` juga bisa memecah struktur:

~~~python
perintah = ("pindah", 10, 5)

match perintah:
    case ("diam",):
        print("Tidak bergerak")
    case ("pindah", x, y):
        print(f"Pindah ke ({x}, {y})")
    case _:
        print("Perintah tidak dikenal")
~~~

## Contoh: validasi kata sandi sederhana

~~~python
sandi = "Python2026"

panjang_ok = len(sandi) >= 8
ada_angka = any(ch.isdigit() for ch in sandi)
ada_besar = any(ch.isupper() for ch in sandi)

if panjang_ok and ada_angka and ada_besar:
    print("Kata sandi kuat")
else:
    print("Kata sandi lemah")
    if not panjang_ok:
        print("- minimal 8 karakter")
    if not ada_angka:
        print("- harus ada angka")
    if not ada_besar:
        print("- harus ada huruf besar")
~~~

## Kesalahan umum

- Memakai \`=\` alih-alih \`==\` pada kondisi (\`if x = 5\` → \`SyntaxError\`).
- Lupa titik dua atau indentasi salah.
- Membandingkan string tanpa memperhatikan huruf besar-kecil (\`"Ya" != "ya"\`); gunakan \`.lower()\`.
- Urutan \`elif\` yang salah sehingga kondisi spesifik tak pernah tercapai.

~~~python
# galat
x = 5
if x = 5:
    print("lima")
~~~

## Latihan mandiri

1. Tentukan apakah sebuah tahun kabisat.
2. Buat kalkulator tarif parkir: motor Rp2.000, mobil Rp5.000, lainnya Rp10.000 (pakai \`match\`).
3. Ubah nilai angka (0–100) menjadi grade A/B/C/D/E.

## Rangkuman

- \`if\`/\`elif\`/\`else\` memilih blok berdasarkan kondisi; blok pertama yang benar dijalankan; **urutan** penting.
- Gabungkan kondisi dengan \`and\`, \`or\`, \`not\`; nilai kosong dianggap falsy.
- Ekspresi ternary: \`a if kondisi else b\`.
- \`match\`/\`case\` (3.10+) mencocokkan pola; \`_\` adalah kasus bawaan.
- Hindari \`=\` pada kondisi dan nesting yang terlalu dalam.
`,
};
