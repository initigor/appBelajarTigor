export default {
  id: 'konsep-apa-itu-program',
  judul: 'Apa itu Program, Algoritma, dan Bahasa Pemrograman?',
  tipe: 'teks',
  interaktif: 'python',
  xp: 15,
  materi: `
# Apa itu Program, Algoritma, dan Bahasa Pemrograman? 🧬

Komputer adalah mesin yang sangat patuh tetapi sama sekali tidak pintar: ia hanya mengerjakan **instruksi** yang diberikan, satu per satu, dengan sangat cepat. Semua yang kamu lihat di layar, dari game sampai aplikasi bank, adalah hasil dari ribuan sampai jutaan instruksi sederhana yang disusun dengan rapi.

## Tiga istilah dasar

| Istilah | Arti | Contoh |
| --- | --- | --- |
| **Algoritma** | Langkah-langkah **logis dan terurut** untuk menyelesaikan suatu masalah. Tidak terikat bahasa | "Cari angka terbesar: ambil angka pertama sebagai calon, bandingkan dengan tiap angka berikutnya, ganti calon jika ada yang lebih besar" |
| **Program** | Algoritma yang **ditulis dalam bahasa pemrograman** sehingga bisa dijalankan komputer | File \`hitung.py\` |
| **Bahasa pemrograman** | Bahasa formal dengan aturan ketat (sintaks) untuk menuliskan instruksi | Python, C, Java, JavaScript |

Hubungannya: **masalah → algoritma → program → hasil**. Algoritma yang buruk tidak akan diselamatkan oleh bahasa terbaik, dan algoritma yang bagus bisa ditulis di bahasa apa pun.

## Mengapa butuh bahasa pemrograman?

Mesin hanya memahami **kode mesin**: deretan angka biner yang tiap polanya adalah instruksi untuk CPU tertentu (lihat materi Arsikom). Manusia sangat sulit menulis dan membaca deretan seperti itu. Bahasa pemrograman adalah **jembatan**:

~~~
 ide manusia  ──►  kode sumber (source code)  ──►  [penerjemah]  ──►  kode mesin  ──►  CPU
 "jumlahkan"        total = a + b                  compiler/interpreter   0100 0011 ...
~~~

Dua sisi sebuah bahasa:

- **Sintaks**: aturan penulisan (tanda baca, kata kunci, indentasi). Pelanggaran → *syntax error*.
- **Semantik**: arti dari kode yang benar secara sintaks. Kode bisa benar sintaks tetapi artinya salah (bug logika).

## Program pertamamu

Program paling sederhana hanya satu instruksi. Klik **▶ Jalankan** pada kode berikut; Python berjalan sungguhan di browsermu:

~~~python
print("Halo, program!")
~~~

Kamu juga boleh klik **✏️ Ubah kode**, mengganti tulisannya, lalu menjalankannya lagi. Mengubah-ubah contoh adalah cara belajar terbaik.

## Ciri sebuah algoritma yang baik

1. **Berhingga**: akhirnya berhenti.
2. **Jelas (definite)**: tiap langkah tidak ambigu.
3. **Ada masukan** (nol atau lebih) dan **keluaran** (minimal satu).
4. **Efektif**: tiap langkah bisa dikerjakan dalam waktu wajar.

Contoh algoritma "menjumlahkan angka 1 sampai 5" yang ditulis sebagai program:

~~~python
total = 0
for angka in [1, 2, 3, 4, 5]:
    total = total + angka
print("Jumlahnya:", total)
~~~

Perhatikan polanya: **inisialisasi** (\`total = 0\`), **perulangan** (\`for\`), dan **keluaran** (\`print\`). Pola yang sama dipakai di hampir semua bahasa.

## Sejarah singkat bahasa pemrograman

| Dekade | Perkembangan |
| --- | --- |
| 1940-an | Menulis kode mesin langsung (kabel dan angka biner) |
| 1950-an | **Assembly** (kata singkat seperti \`ADD\`), lalu bahasa tingkat tinggi pertama: **FORTRAN** (1957), **LISP**, **COBOL** |
| 1970-an | **C** (1972), dibuat untuk menulis sistem operasi UNIX |
| 1980–90-an | C++, **Python** (1991), Java (1995), **JavaScript** (1995) |
| 2000-an–kini | Bahasa modern: C#, Go, Rust, Kotlin, Swift, TypeScript |

Ada ribuan bahasa. Mereka berbeda dalam **tingkat abstraksi**, **cara dijalankan**, **sistem tipe**, dan **paradigma**. Itulah empat pelajaran berikutnya.

## Bagaimana bahasa dibuat?

Sebuah bahasa pemrograman sebenarnya adalah **spesifikasi** (aturan sintaks dan arti) ditambah **implementasi** (program yang menjalankannya). Python adalah spesifikasinya, sedangkan **CPython** adalah implementasi resmi yang paling umum (ditulis dalam C). Ada implementasi lain seperti PyPy dan MicroPython. Satu bahasa bisa punya banyak implementasi dengan kecepatan berbeda.

~~~python
import sys
print(sys.implementation.name)   # nama implementasi Python yang sedang berjalan
~~~

## Rangkuman

- **Algoritma** = langkah-langkah penyelesaian masalah (bebas bahasa). **Program** = algoritma dalam bahasa pemrograman. **Bahasa** = sintaks + semantik.
- Komputer hanya mengerti **kode mesin**; bahasa pemrograman dan penerjemahnya (compiler/interpreter) menjembatani manusia dan mesin.
- Algoritma yang baik: berhingga, jelas, punya masukan/keluaran, dan efektif.
- Bahasa = spesifikasi + implementasi (Python vs CPython/PyPy).
`,
};
