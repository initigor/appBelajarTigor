export default {
  id: 'py-operator',
  judul: 'Operator: Aritmetika, Perbandingan, dan Logika',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Operator: Aritmetika, Perbandingan, dan Logika ➕

**Operator** adalah simbol yang melakukan operasi pada nilai (**operand**). Python punya operator untuk menghitung, membandingkan, dan menggabungkan kondisi.

## Operator aritmetika

| Operator | Nama | Contoh | Hasil |
| --- | --- | --- | --- |
| \`+\` | Tambah | \`7 + 2\` | 9 |
| \`-\` | Kurang | \`7 - 2\` | 5 |
| \`*\` | Kali | \`7 * 2\` | 14 |
| \`/\` | Bagi (**selalu float**) | \`7 / 2\` | 3.5 |
| \`//\` | Bagi bulat (floor) | \`7 // 2\` | 3 |
| \`%\` | Sisa bagi (modulo) | \`7 % 2\` | 1 |
| \`**\` | Pangkat | \`7 ** 2\` | 49 |

~~~python
print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2)       # bagi biasa: float
print(7 // 2)      # bagi bulat: dibulatkan ke bawah
print(7 % 2)       # sisa
print(7 ** 2)      # pangkat
print(8 / 2)       # tetap float: 4.0
~~~

### Bagi bulat dan modulo pada bilangan negatif

Python membulatkan ke bawah (menuju −∞), **berbeda dari C dan Java** yang memotong ke nol:

~~~python
print(-7 // 2)     # -4 (bukan -3)
print(-7 % 2)      # 1  (tanda sisa mengikuti pembagi)
print(divmod(17, 5))   # (hasil bagi, sisa) sekaligus
~~~

### Kegunaan modulo

~~~python
angka = 14
print("genap" if angka % 2 == 0 else "ganjil")

jam = 23
print("2 jam lagi:", (jam + 2) % 24)       # berputar kembali ke 1
~~~

## Prioritas operator

Dari yang paling tinggi: \`**\` → perkalian/pembagian (\`* / // %\`) → \`+ -\` → perbandingan → \`not\` → \`and\` → \`or\`. Gunakan **tanda kurung** untuk memperjelas.

~~~python
print(2 + 3 * 4)       # 14
print((2 + 3) * 4)     # 20
print(2 ** 3 ** 2)     # pangkat dikerjakan dari kanan: 2 ** (3 ** 2) = 512
print(-2 ** 2)         # -(2 ** 2) = -4
~~~

## Operator penugasan gabungan

~~~python
skor = 10
skor += 5       # skor = skor + 5
skor *= 2       # skor = skor * 2
skor -= 3
skor //= 4
print(skor)
~~~

Python **tidak punya** \`x++\` dan \`x--\` seperti C; gunakan \`x += 1\`.

## Operator perbandingan

Hasilnya selalu \`True\` atau \`False\`.

| Operator | Arti |
| --- | --- |
| \`==\` | sama dengan |
| \`!=\` | tidak sama dengan |
| \`<\`, \`<=\`, \`>\`, \`>=\` | lebih kecil / besar |

~~~python
print(5 == 5.0)        # True: nilainya sama
print("a" < "b")       # True: urutan abjad (kode Unicode)
print("Zebra" < "apel")  # True: huruf besar berkode lebih kecil
print(5 != 3)
~~~

> \`=\` adalah **penugasan** (simpan nilai), \`==\` adalah **perbandingan** (apakah sama). Tertukarnya keduanya adalah bug klasik.

### Perbandingan berantai

Python mengizinkan penulisan seperti matematika:

~~~python
umur = 20
print(18 <= umur < 25)       # setara: umur >= 18 and umur < 25
~~~

## Operator logika

| Operator | Arti | Contoh |
| --- | --- | --- |
| \`and\` | **dan**: benar jika keduanya benar | \`x > 0 and x < 10\` |
| \`or\` | **atau**: benar jika salah satu benar | \`hari == "Sabtu" or hari == "Minggu"\` |
| \`not\` | **bukan**: membalik | \`not selesai\` |

~~~python
cuaca_cerah = True
punya_waktu = False

print(cuaca_cerah and punya_waktu)
print(cuaca_cerah or punya_waktu)
print(not punya_waktu)
~~~

### Short-circuit

\`and\` dan \`or\` **berhenti begitu hasilnya pasti**. \`and\` tidak mengevaluasi sisi kanan bila kiri salah; \`or\` tidak bila kiri benar. Ini dimanfaatkan untuk menghindari galat:

~~~python
data = []
print(len(data) > 0 and data[0] == 5)      # tidak error: data[0] tidak pernah dievaluasi
~~~

## Truthy dan falsy

Nilai apa pun bisa dipakai sebagai kondisi. Yang dianggap **salah (falsy)**: \`False\`, \`None\`, \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`()\`, \`set()\`. Sisanya **benar (truthy)**. Berbeda dengan JavaScript, list kosong \`[]\` itu falsy di Python.

~~~python
for nilai in [0, 1, "", "a", [], [0], None]:
    print(repr(nilai), "->", bool(nilai))
~~~

\`and\`/\`or\` di Python mengembalikan **salah satu operand-nya**, bukan sekadar True/False. Pola umum untuk nilai bawaan:

~~~python
nama = ""
tampil = nama or "Tamu"
print(tampil)
~~~

## Operator keanggotaan dan identitas

~~~python
print("a" in "banana")          # True
print(3 in [1, 2, 3])           # True
print("x" not in "banana")      # True

a = [1, 2]
b = [1, 2]
print(a == b, a is b)           # isi sama, objek berbeda
~~~

## Latihan mandiri

1. Ubah 3725 detik menjadi jam, menit, dan detik dengan \`//\` dan \`%\` (atau \`divmod\`).
2. Tulis ekspresi yang bernilai True bila sebuah tahun adalah tahun kabisat (habis dibagi 4, kecuali habis dibagi 100, tetapi tetap kabisat bila habis dibagi 400).
3. Prediksi dulu hasil \`not 0 or 0 and 5\`, lalu jalankan.

## Rangkuman

- Aritmetika: \`+ - * / // % **\`; \`/\` selalu float, \`//\` membulatkan **ke bawah**, \`%\` mengikuti tanda pembagi.
- Penugasan gabungan: \`+=\`, \`-=\`, \`*=\`, dll. (tidak ada \`++\`). \`=\` penugasan, \`==\` perbandingan.
- Perbandingan bisa berantai: \`18 <= umur < 25\`.
- Logika: \`and\`, \`or\`, \`not\` dengan **short-circuit**; nilai falsy: \`0\`, \`""\`, \`[]\`, \`{}\`, \`None\`, \`False\`.
- \`in\` untuk keanggotaan; \`is\` untuk identitas objek.
`,
};
