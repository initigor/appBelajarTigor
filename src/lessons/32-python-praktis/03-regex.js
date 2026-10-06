export default {
  id: 'py-regex',
  judul: 'Ekspresi Reguler (Regex) dengan re',
  tipe: 'teks',
  interaktif: 'python',
  xp: 30,
  materi: `
# Ekspresi Reguler (Regex) dengan re 🔍

**Ekspresi reguler** (*regular expression*, **regex**) adalah bahasa kecil untuk mendeskripsikan **pola teks**. Dengannya kamu bisa mencari, memvalidasi, mengekstrak, dan mengganti teks yang sulit dilakukan dengan \`split\` atau \`find\`: menemukan semua email di sebuah dokumen, memeriksa format nomor telepon, atau membersihkan data.

Di Python regex ada di modul \`re\`. Pola ditulis sebagai **raw string** (\`r"..."\`) agar garis miring terbalik tidak diproses Python.

~~~python
import re

teks = "Hubungi kami di 0812-3456-7890 atau 021-555-1234."
print(re.findall(r"\\d+", teks))       # semua urutan angka
~~~

## Fungsi utama modul re

| Fungsi | Tugas |
| --- | --- |
| \`re.search(pola, teks)\` | cari **pola pertama** di mana pun dalam teks |
| \`re.match(pola, teks)\` | cocokkan hanya di **awal** teks |
| \`re.fullmatch(pola, teks)\` | seluruh teks harus cocok |
| \`re.findall(pola, teks)\` | **semua** kecocokan (list) |
| \`re.finditer(pola, teks)\` | semua kecocokan sebagai objek match |
| \`re.sub(pola, ganti, teks)\` | **ganti** kecocokan |
| \`re.split(pola, teks)\` | **pecah** teks di tiap kecocokan |
| \`re.compile(pola)\` | siapkan pola untuk dipakai berulang |

~~~python
import re

teks = "Kode pesanan: AB-1234, status: selesai"

m = re.search(r"[A-Z]{2}-\\d{4}", teks)
if m:
    print("ditemukan:", m.group())
    print("posisi:", m.start(), "sampai", m.end())

print(re.match(r"Kode", teks) is not None)       # cocok di awal?
print(re.match(r"pesanan", teks))                # tidak di awal -> None
~~~

\`search\` dan \`match\` mengembalikan **objek match** bila cocok dan \`None\` bila tidak, jadi selalu periksa sebelum memakai hasilnya.

## Sintaks pola

### Karakter biasa dan kelas karakter

| Pola | Arti |
| --- | --- |
| \`abc\` | teks persis "abc" |
| \`.\` | **satu karakter apa saja** (kecuali baris baru) |
| \`\\d\` | satu digit (0–9); \`\\D\` kebalikannya |
| \`\\w\` | huruf, angka, atau garis bawah; \`\\W\` kebalikannya |
| \`\\s\` | spasi/tab/baris baru; \`\\S\` kebalikannya |
| \`[abc]\` | salah satu dari a, b, c |
| \`[a-z]\`, \`[0-9]\` | rentang |
| \`[^abc]\` | **bukan** a, b, c |

### Pengulangan (kuantifier)

| Pola | Arti |
| --- | --- |
| \`*\` | nol atau lebih |
| \`+\` | satu atau lebih |
| \`?\` | nol atau satu (opsional) |
| \`{3}\` | tepat 3 kali |
| \`{2,4}\` | 2 sampai 4 kali |

### Posisi dan pilihan

| Pola | Arti |
| --- | --- |
| \`^\` / \`$\` | awal / akhir teks (atau baris) |
| \`\\b\` | batas kata |
| \`a\\|b\` | a **atau** b |
| \`( )\` | **grup**: mengelompokkan sekaligus menangkap |

~~~python
import re

print(re.findall(r"\\b\\w+\\b", "Halo, dunia Python!"))
print(re.findall(r"colou?r", "color colour colr"))        # u opsional
print(re.findall(r"\\d{2,3}", "1 22 333 4444"))
print(re.findall(r"kucing|anjing", "kucing, anjing, dan kuda"))
~~~

## Validasi dengan fullmatch

Untuk memeriksa **seluruh teks** sesuai format:

~~~python
import re

def kode_pos_valid(teks):
    return re.fullmatch(r"\\d{5}", teks) is not None

def plat_valid(teks):
    return re.fullmatch(r"[A-Z]{1,2} \\d{1,4} [A-Z]{1,3}", teks) is not None

print(kode_pos_valid("40132"), kode_pos_valid("4013"))
print(plat_valid("D 1234 ABC"), plat_valid("1234 D ABC"))
~~~

## Grup: mengekstrak bagian

Tanda kurung menangkap bagian yang cocok. Beri nama dengan \`(?P<nama>...)\`:

~~~python
import re

tanggal = "Rapat pada 07-10-2026 pukul 14:30"
m = re.search(r"(\\d{2})-(\\d{2})-(\\d{4})", tanggal)
hari, bulan, tahun = m.groups()
print(hari, bulan, tahun)

m = re.search(r"(?P<jam>\\d{2}):(?P<menit>\\d{2})", tanggal)
print(m["jam"], m["menit"], m.groupdict())
~~~

## Mengekstrak banyak data: findall dan finditer

~~~python
import re

teks = "Budi: budi@contoh.com, Ani: ani.s@kampus.ac.id, Cici: cici@mail.co"
pola = r"[\\w.]+@[\\w.]+\\.[a-z]{2,}"

print(re.findall(pola, teks))

for m in re.finditer(r"(\\w+): ([\\w.]+@[\\w.]+)", teks):
    print(m.group(1), "->", m.group(2))
~~~

## Mengganti dan memecah

~~~python
import re

teks = "Harga: Rp 15.000, diskon Rp 2.500"

print(re.sub(r"\\d", "#", "PIN 4821"))                  # sensor angka
print(re.sub(r"\\s+", " ", "terlalu     banyak    spasi"))
print(re.split(r"[,;]\\s*", "apel, mangga;jeruk,  pisang"))

# ganti memakai fungsi: ubah tiap angka jadi dua kalinya
print(re.sub(r"\\d+", lambda m: str(int(m.group()) * 2), "3 apel dan 12 jeruk"))

# merujuk grup di pengganti: balik urutan tanggal
print(re.sub(r"(\\d{2})-(\\d{2})-(\\d{4})", r"\\3-\\2-\\1", "07-10-2026"))
~~~

## Greedy vs non-greedy

Kuantifier secara bawaan **serakah** (*greedy*): mengambil sebanyak mungkin. Tambahkan \`?\` untuk mengambil sesedikit mungkin.

~~~python
import re

html = "<b>tebal</b> dan <i>miring</i>"
print(re.findall(r"<.+>", html))        # serakah: menelan semuanya
print(re.findall(r"<.+?>", html))       # non-greedy: tiap tag
print(re.findall(r"<(\\w+)>(.+?)</\\1>", html))   # \\1 merujuk grup pertama
~~~

## Flag

~~~python
import re

print(re.findall(r"python", "Python python PYTHON", re.IGNORECASE))
teks = "baris1\\nbaris2\\nbaris3"
print(re.findall(r"^baris\\d$", teks, re.MULTILINE))
~~~

## compile: pola yang dipakai berulang

~~~python
import re

nomor = re.compile(r"(\\+62|0)8\\d{8,11}")

for kontak in ["081234567890", "+6281234567890", "0212345678", "08123"]:
    print(kontak, bool(nomor.fullmatch(kontak)))
~~~

## Contoh: membersihkan data

~~~python
import re

mentah = ["  Budi   Santoso ", "ANI-wijaya", "cici   lestari!!"]

def bersihkan(nama):
    nama = re.sub(r"[^A-Za-z\\s-]", "", nama)     # buang simbol aneh
    nama = re.sub(r"[-\\s]+", " ", nama).strip()
    return nama.title()

print([bersihkan(n) for n in mentah])
~~~

## Tips dan peringatan

- **Mulai sederhana** dan uji dengan banyak contoh. Situs seperti regex101.com membantu memvisualisasikan pola.
- Regex **bukan untuk semua hal**: jangan menguraikan HTML atau JSON dengan regex; gunakan pustaka parser (\`html.parser\`, \`json\`).
- Pola kompleks sulit dibaca; pakai \`re.VERBOSE\` dan komentar, atau pecah menjadi beberapa langkah.
- Pola tertentu bisa sangat lambat pada masukan jahat (*ReDoS*). Hati-hati dengan pola bersarang seperti \`(a+)+\` pada data dari pengguna.

## Latihan mandiri

1. Ekstrak semua hashtag (\`#python\`) dari sebuah kalimat.
2. Validasi format tanggal \`DD/MM/YYYY\` (cukup bentuknya).
3. Ganti semua nomor telepon di teks dengan \`[DISENSOR]\`.

## Rangkuman

- Regex mendeskripsikan pola teks; di Python dipakai lewat modul \`re\` dengan **raw string** (\`r"..."\`).
- \`search\` (di mana saja), \`match\` (awal), \`fullmatch\` (seluruh teks), \`findall\`/\`finditer\`, \`sub\`, \`split\`, \`compile\`.
- Elemen: kelas karakter (\`\\d \\w \\s [a-z]\`), kuantifier (\`* + ? {n,m}\`), jangkar (\`^ $ \\b\`), pilihan (\`|\`), grup (\`( )\`, \`(?P<nama>...)\`).
- Kuantifier serakah secara bawaan; \`?\` membuatnya non-greedy. Flag: \`re.IGNORECASE\`, \`re.MULTILINE\`.
- Jangan memakai regex untuk menguraikan HTML/JSON; waspadai pola yang lambat (ReDoS).
`,
};
