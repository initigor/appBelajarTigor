export default {
  id: 'konsep-low-high',
  judul: 'Bahasa Tingkat Rendah vs Tingkat Tinggi',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Bahasa Tingkat Rendah vs Tingkat Tinggi 🪜

Bahasa pemrograman tersusun dalam **tingkat (level) abstraksi**. Makin **rendah**, makin dekat ke cara kerja hardware. Makin **tinggi**, makin dekat ke cara berpikir manusia. Memahami tingkatan ini menjelaskan mengapa C bisa menulis sistem operasi sementara Python lebih cepat dipakai untuk menulis skrip.

## Tangga abstraksi

~~~
 Tinggi   ┌──────────────────────────────────────────┐
  ▲       │ Bahasa tingkat tinggi  Python, Java, JS  │  dekat dengan manusia
  │       ├──────────────────────────────────────────┤
  │       │ Tingkat menengah       C, C++, Rust      │  kontrol memori + abstraksi
  │       ├──────────────────────────────────────────┤
  │       │ Bahasa assembly        mov, add, jmp     │  1 baris ≈ 1 instruksi CPU
  ▼       ├──────────────────────────────────────────┤
 Rendah   │ Kode mesin             01001000 11000011 │  dekat dengan hardware
          └──────────────────────────────────────────┘
~~~

### Kode mesin (machine code)

Deretan **bit** yang langsung dimengerti CPU. Setiap arsitektur (x86, ARM, RISC-V) punya kode mesinnya sendiri. Biasanya ditulis dalam heksadesimal:

~~~
01 D8        ← pada CPU x86-64 berarti: tambahkan isi register EBX ke EAX
~~~

### Bahasa assembly

Representasi teks yang mudah dibaca untuk kode mesin: tiap instruksi punya nama singkat (**mnemonik**). Penerjemahnya disebut **assembler**.

~~~
add eax, ebx       ; EAX = EAX + EBX
~~~

Satu baris assembly ≈ satu instruksi mesin, dan **terikat pada satu arsitektur CPU**. Program assembly untuk x86 tidak bisa jalan di ARM.

### Bahasa tingkat tinggi

Memakai kata-kata dan konsep yang mirip bahasa manusia dan matematika. Satu baris bisa berarti puluhan sampai ribuan instruksi mesin, dan **tidak terikat pada satu CPU**.

~~~py
c = a + b
~~~

## Satu tugas, empat tingkat

Tugas: **\`c = a + b\`**.

| Tingkat | Kode | Catatan |
| --- | --- | --- |
| Python (tinggi) | \`c = a + b\` | Tidak perlu tahu tipe, register, atau memori |
| C (menengah) | \`int c = a + b;\` | Harus menyebut tipe \`int\`; kompilator memilih instruksi |
| Assembly x86 | \`mov eax, [a]\`, \`add eax, [b]\`, \`mov [c], eax\` | Kamu mengatur register dan alamat memori |
| Kode mesin | \`8B 05 ...\`, \`03 05 ...\`, \`89 05 ...\` | Deretan byte untuk tiga instruksi di atas |

Makin ke bawah, makin banyak detail yang harus kamu urus sendiri, tetapi makin besar kendalimu.

## Perbandingan

| Aspek | Tingkat rendah (assembly, C) | Tingkat tinggi (Python, JavaScript) |
| --- | --- | --- |
| **Abstraksi** | Rendah: kamu mengatur memori dan register | Tinggi: banyak hal diurus otomatis |
| **Kecepatan eksekusi** | Sangat cepat (dekat hardware) | Lebih lambat (ada lapisan abstraksi) |
| **Kecepatan menulis program** | Lambat, banyak kode | Cepat, sedikit kode |
| **Portabilitas** | Assembly: terikat CPU. C: perlu kompilasi ulang per platform | Tinggi: kode yang sama berjalan di banyak OS |
| **Manajemen memori** | Manual (C: \`malloc\`/\`free\`) | Otomatis (garbage collector) |
| **Risiko bug** | Tinggi (buffer overflow, memory leak) | Lebih rendah |
| **Pemakaian khas** | OS, driver, game engine, mikrokontroler | Web, skrip otomasi, data science, AI |

> C sering disebut **bahasa tingkat menengah**: ia punya sintaks tingkat tinggi (fungsi, tipe, \`if\`) tetapi memberi akses langsung ke memori lewat pointer.

## Mengapa bahasa tingkat tinggi lebih lambat?

Karena ada **kerja tambahan** yang tidak kamu lihat. Dalam Python, ketika menjumlahkan dua angka, interpreter harus memeriksa tipe tiap objek, mencari cara menjumlahkannya, membuat objek hasil di memori, dan menghitung referensi. Dalam C, kompilator tahu kedua variabel adalah \`int\`, sehingga cukup satu instruksi \`add\`.

Coba ukur sendiri: dua cara yang sama-sama menjumlahkan sejuta angka. Cara kedua memakai fungsi bawaan \`sum\` yang **ditulis dalam C** di dalam Python:

~~~python
import time

n = 1_000_000

mulai = time.perf_counter()
total = 0
for i in range(n):
    total += i
lambat = time.perf_counter() - mulai

mulai = time.perf_counter()
total2 = sum(range(n))
cepat = time.perf_counter() - mulai

print("loop Python :", round(lambat * 1000, 1), "ms")
print("sum() (C)   :", round(cepat * 1000, 1), "ms")
print("sama hasilnya?", total == total2)
~~~

Hasilnya biasanya **beberapa kali lebih cepat** untuk \`sum\`, bukan karena Python "tidak bisa cepat", tetapi karena pekerjaannya dilakukan oleh kode tingkat rendah. Inilah strategi umum: **tulis logika di bahasa tingkat tinggi, serahkan bagian berat ke pustaka yang ditulis di bahasa tingkat rendah** (NumPy, pandas, dan TensorFlow semuanya begitu).

## Memilih bahasa

Tidak ada bahasa terbaik, yang ada adalah **bahasa yang paling cocok untuk masalahnya**:

- Butuh kinerja maksimum dan kendali memori (OS, game, embedded)? → C, C++, Rust.
- Butuh menulis cepat, otomasi, atau analisis data? → Python.
- Pengembangan web di browser? → JavaScript.
- Aplikasi bisnis skala besar? → Java, C#.

Banyak sistem nyata memakai **beberapa bahasa sekaligus**: antarmuka dalam JavaScript, logika server dalam Python, dan bagian paling kritis dalam C++.

## Rangkuman

- Tingkat bahasa: **kode mesin → assembly → C (menengah) → Python/Java/JS (tinggi)**. Makin tinggi, makin mudah dan portabel tetapi biasanya makin lambat.
- Kode mesin dan assembly **terikat arsitektur CPU**; bahasa tingkat tinggi tidak.
- Assembly diterjemahkan oleh **assembler**; bahasa tingkat tinggi oleh **compiler atau interpreter**.
- Bahasa tingkat tinggi lebih lambat karena lapisan abstraksi, tetapi bagian beratnya sering diserahkan ke pustaka yang ditulis dalam C.
- Pilih bahasa sesuai masalah; sistem nyata sering memadukan beberapa bahasa.
`,
};
