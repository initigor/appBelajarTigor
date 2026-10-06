export default {
  id: 'py-modul',
  judul: 'Modul, Import, dan Pustaka Standar',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Modul, Import, dan Pustaka Standar 📦

Program yang besar tidak ditulis dalam satu berkas. Python memecahnya menjadi **modul**: berkas \`.py\` berisi fungsi, kelas, dan variabel yang bisa dipakai berkas lain lewat \`import\`. Python juga datang dengan **pustaka standar** yang sangat besar ("batteries included").

## import

~~~python
import math

print(math.sqrt(81))
print(math.pi)
print(math.ceil(4.2), math.floor(4.8))
~~~

Cara-cara import:

~~~python
import math                     # pakai: math.sqrt(...)
from math import sqrt, pi       # ambil nama tertentu: sqrt(...)
import math as m                # beri alias: m.sqrt(...)
from math import sqrt as akar   # alias untuk nama tertentu

print(math.sqrt(16), sqrt(25), m.sqrt(36), akar(49))
~~~

Hindari \`from modul import *\`: ia membanjiri namespace dan membuat sumber nama tidak jelas.

### Melihat isi modul

~~~python
import math
print([n for n in dir(math) if not n.startswith("_")][:12])
help(math.hypot)
~~~

## Membuat modul sendiri

Setiap berkas \`.py\` adalah modul. Misalkan berkas \`geometri.py\`:

~~~py
# geometri.py
PI = 3.14159

def luas_lingkaran(r):
    return PI * r ** 2

if __name__ == "__main__":
    print(luas_lingkaran(10))      # hanya jalan bila dijalankan langsung
~~~

Dipakai dari berkas lain di folder yang sama:

~~~py
import geometri
print(geometri.luas_lingkaran(5))
~~~

Di **Workspace Python** situs ini kamu bisa mencobanya: buat project Python dengan dua berkas dan \`import\` antar-berkas bekerja.

Beberapa hal penting:

- Python mencari modul di folder skrip, lalu di folder pustaka standar, lalu di paket yang dipasang (\`sys.path\`).
- Modul diimpor **sekali**; impor berikutnya memakai salinan di memori.
- **Package** adalah folder berisi modul (dan berkas \`__init__.py\`): \`import paket.modul\`.

## Pustaka standar yang wajib kamu kenal

### math: matematika

~~~python
import math

print(math.sqrt(2))
print(math.factorial(6))
print(math.gcd(48, 18))
print(math.log10(1000), math.log2(8))
print(math.sin(math.pi / 2))
print(round(math.degrees(math.pi), 1))
~~~

### random: bilangan acak

~~~python
import random

random.seed(42)               # hasil dapat diulang (berguna untuk uji)
print(random.randint(1, 6))               # dadu
print(random.choice(["batu", "gunting", "kertas"]))
daftar = [1, 2, 3, 4, 5]
random.shuffle(daftar)
print(daftar)
print(random.sample(range(1, 50), 6))     # 6 angka unik (mis. undian)
print(round(random.random(), 3))
~~~

### datetime: tanggal dan waktu

~~~python
from datetime import date, datetime, timedelta

lahir = date(2005, 8, 17)
hari_ini = date(2026, 10, 7)
print("Umur (hari):", (hari_ini - lahir).days)
print(hari_ini + timedelta(days=30))
print(hari_ini.strftime("%d/%m/%Y"), hari_ini.strftime("%A"))

sekarang = datetime(2026, 10, 7, 14, 30)
print(sekarang.strftime("%H:%M"), sekarang.isoformat())
~~~

### collections: struktur data tambahan

~~~python
from collections import Counter, deque, defaultdict

print(Counter("abracadabra").most_common(2))
antrean = deque([1, 2, 3])
antrean.appendleft(0)
print(antrean)
~~~

### statistics: statistik dasar

~~~python
import statistics as st

nilai = [80, 75, 90, 65, 88, 75]
print(st.mean(nilai), st.median(nilai), st.mode(nilai))
print(round(st.stdev(nilai), 2))
~~~

### os, sys, pathlib: sistem

~~~python
import sys
from pathlib import Path

print(sys.platform)
p = Path("laporan") / "2026" / "catatan.txt"
print(p, p.suffix, p.name, p.parent)
~~~

### itertools dan functools

~~~python
from itertools import permutations, combinations
from functools import reduce

print(list(combinations("ABC", 2)))
print(len(list(permutations(range(4)))))
print(reduce(lambda a, b: a * b, range(1, 6)))
~~~

### json, csv, re (dibahas di bab berikutnya)

| Modul | Kegunaan |
| --- | --- |
| \`json\` | baca/tulis data JSON |
| \`csv\` | baca/tulis berkas CSV |
| \`re\` | ekspresi reguler |
| \`argparse\` | argumen command-line |
| \`logging\` | pencatatan log |
| \`unittest\` | pengujian |
| \`urllib\`, \`http\` | akses web tingkat dasar |
| \`sqlite3\` | basis data SQLite bawaan |
| \`subprocess\` | menjalankan program lain |

## Pustaka pihak ketiga

Di luar pustaka standar ada ratusan ribu paket di **PyPI**, dipasang dengan **pip** (\`pip install requests\`). Beberapa yang populer: \`requests\` (HTTP), \`numpy\`, \`pandas\`, \`matplotlib\`, \`flask\`, \`django\`, \`pytest\`. Bab terakhir membahas cara memasangnya dengan benar memakai virtual environment.

## Kesalahan umum

- **Menamai berkasmu sama dengan modul bawaan** (mis. \`random.py\` atau \`math.py\`): Python mengimpor berkasmu, bukan yang bawaan, sehingga muncul galat aneh.
- **Impor melingkar** (A mengimpor B, B mengimpor A).
- Lupa memasang paket: \`ModuleNotFoundError: No module named 'xyz'\`.

~~~python
# galat
import modul_yang_tidak_ada
~~~

## Latihan mandiri

1. Pakai \`datetime\` untuk menghitung berapa hari lagi menuju ulang tahunmu.
2. Pakai \`random\` untuk membuat simulasi lempar dua dadu 1000 kali dan hitung frekuensi jumlahnya dengan \`Counter\`.
3. Pakai \`statistics\` untuk menghitung rata-rata dan simpangan baku nilai kelasmu.

## Rangkuman

- \`import modul\`, \`from modul import nama\`, \`import modul as alias\`; hindari \`import *\`.
- Setiap berkas \`.py\` adalah modul; **package** adalah folder berisi modul; Python mencari modul lewat \`sys.path\`.
- Pustaka standar yang penting: \`math\`, \`random\`, \`datetime\`, \`collections\`, \`statistics\`, \`pathlib\`, \`itertools\`, \`functools\`.
- Paket pihak ketiga dipasang dengan \`pip\` dari PyPI.
- Jangan menamai berkasmu sama dengan modul bawaan.
`,
};
