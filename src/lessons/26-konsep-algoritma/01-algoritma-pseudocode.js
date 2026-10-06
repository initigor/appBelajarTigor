export default {
  id: 'konsep-algoritma',
  judul: 'Algoritma, Pseudocode, dan Flowchart',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Algoritma, Pseudocode, dan Flowchart 🗺️

Sebelum menulis kode, programmer yang baik **merancang algoritmanya** lebih dulu. Cara yang umum adalah menuliskannya dalam bentuk yang tidak terikat bahasa: bahasa sehari-hari, **pseudocode**, atau **flowchart**. Setelah logikanya benar, menerjemahkannya ke Python, C, atau Java menjadi pekerjaan hampir mekanis.

## Tiga cara menyatakan algoritma

| Cara | Kelebihan | Kekurangan |
| --- | --- | --- |
| **Bahasa alami** | Mudah dipahami siapa saja | Ambigu, bertele-tele |
| **Pseudocode** | Mirip kode tetapi bebas sintaks; mudah diterjemahkan | Tidak ada standar baku |
| **Flowchart** (diagram alir) | Alur terlihat jelas secara visual | Cepat membesar dan sulit dirawat |

### Simbol flowchart

| Bentuk | Arti |
| --- | --- |
| Oval | Mulai / Selesai |
| Jajar genjang | Masukan / Keluaran |
| Persegi panjang | Proses (perhitungan, penugasan) |
| Belah ketupat | Keputusan (ya/tidak) |
| Panah | Arah alur |

## Contoh 1: bilangan genap atau ganjil

**Bahasa alami:** minta sebuah bilangan. Jika sisa baginya dengan 2 adalah nol, katakan "genap", jika tidak, katakan "ganjil".

**Pseudocode:**

~~~
MULAI
  BACA n
  JIKA n MOD 2 = 0 MAKA
      TULIS "genap"
  SELAIN ITU
      TULIS "ganjil"
  SELESAI JIKA
SELESAI
~~~

**Flowchart (ASCII):**

~~~
   (Mulai)
      │
   /baca n/
      │
   ◇ n mod 2 = 0 ? ◇──ya──►/tulis "genap"/──┐
      │ tidak                                  │
      ▼                                        │
   /tulis "ganjil"/ ───────────────────────────┤
                                               ▼
                                           (Selesai)
~~~

**Python:**

~~~python
n = 7
if n % 2 == 0:
    print("genap")
else:
    print("ganjil")
~~~

## Contoh 2: mencari nilai terbesar

**Ide:** anggap bilangan pertama sebagai calon terbesar. Periksa bilangan berikutnya satu per satu; jika ada yang lebih besar dari calon, ganti calonnya.

~~~
MULAI
  BACA daftar
  terbesar ← elemen pertama daftar
  UNTUK SETIAP x DALAM sisa daftar
      JIKA x > terbesar MAKA
          terbesar ← x
  TULIS terbesar
SELESAI
~~~

~~~python
daftar = [34, 7, 91, 15, 62]

terbesar = daftar[0]
for x in daftar[1:]:
    if x > terbesar:
        terbesar = x

print("Terbesar:", terbesar)
~~~

Algoritmanya selalu sama, entah daftarnya 5 atau 5 juta elemen. Itulah **generalisasi** yang membuat algoritma berguna.

## Contoh 3: algoritma Euclid untuk FPB

Faktor Persekutuan Terbesar dua bilangan ditemukan dengan mengganti pasangan (a, b) menjadi (b, sisa a ÷ b) berulang kali sampai sisanya nol. Algoritma ini berusia sekitar 2.300 tahun dan masih dipakai, contohnya dalam kriptografi.

~~~
MULAI
  BACA a, b
  SELAMA b ≠ 0
      sisa ← a MOD b
      a ← b
      b ← sisa
  TULIS a
SELESAI
~~~

~~~python
a, b = 48, 18

while b != 0:
    a, b = b, a % b
    print("a =", a, " b =", b)

print("FPB =", a)
~~~

Telusuri tabelnya (dikenal sebagai **dry run** atau uji meja): (48, 18) → (18, 12) → (12, 6) → (6, 0) → FPB = 6.

## Mengerjakan *dry run*

Sebelum menjalankan kode, **jalankan di kepala atau di kertas** dengan contoh kecil, dan catat nilai variabel setelah tiap langkah. Kebiasaan ini menangkap banyak bug logika sebelum kamu mengetik kode.

| Langkah | a | b | sisa |
| --- | --- | --- | --- |
| awal | 48 | 18 | |
| 1 | 18 | 12 | 12 |
| 2 | 12 | 6 | 6 |
| 3 | 6 | 0 | 0 |

## Pseudocode yang baik

- Pakai kata kerja jelas (BACA, TULIS, HITUNG, ULANGI).
- **Indentasi** menunjukkan blok.
- Tidak perlu sintaks bahasa tertentu, tetapi harus **tidak ambigu**.
- Fokus pada **logika**, bukan detail teknis (misalnya cara membaca berkas).

## Dari masalah ke program

1. **Pahami masalah**: apa masukannya, apa keluarannya, apa batasannya?
2. **Rancang algoritma** (pseudocode/flowchart), lalu uji dengan contoh kecil (*dry run*).
3. **Terjemahkan** ke bahasa pemrograman.
4. **Uji** dengan banyak kasus, termasuk kasus tepi.
5. **Perbaiki dan optimasi** bila perlu.

## Rangkuman

- Algoritma dapat dinyatakan sebagai **bahasa alami**, **pseudocode**, atau **flowchart**; ketiganya bebas bahasa pemrograman.
- Contoh klasik: genap/ganjil, nilai terbesar (satu perulangan dengan "calon terbesar"), dan **algoritma Euclid** untuk FPB.
- **Dry run** (menelusuri nilai variabel dengan tangan) menangkap bug logika sebelum kode dijalankan.
- Alur kerja: pahami masalah → rancang algoritma → terjemahkan → uji → perbaiki.
`,
};
