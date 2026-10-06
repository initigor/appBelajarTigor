export default {
  id: 'konsep-compiler-interpreter',
  judul: 'Compiler vs Interpreter',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Compiler vs Interpreter ⚙️

Kode sumber yang kamu tulis tidak bisa langsung dijalankan CPU. Harus ada **penerjemah**. Ada dua cara besar menerjemahkan, dan perbedaannya menjelaskan banyak hal: mengapa C menghasilkan file \`.exe\`, mengapa Python bisa langsung dijalankan tanpa langkah "build", dan mengapa sebagian galat muncul sebelum program berjalan sementara yang lain muncul di tengah jalan.

## Compiler: terjemahkan semuanya dulu

**Compiler** menerjemahkan **seluruh** kode sumber menjadi kode mesin (atau bentuk lain) **sebelum** program dijalankan. Hasilnya berkas baru yang bisa dijalankan sendiri.

~~~
 hitung.c ──► [ compiler (gcc) ] ──► hitung.exe ──► dijalankan CPU
 (kode sumber)       sekali, di muka     (kode mesin)
~~~

Cara pakai bahasa C:

~~~bash
gcc hitung.c -o hitung     # langkah 1: kompilasi
./hitung                   # langkah 2: jalankan hasilnya
~~~

**Ciri-ciri**: ada langkah *build* terpisah; hasilnya **cepat** saat dijalankan; kesalahan sintaks dan tipe **terdeteksi sebelum** program jalan; berkas hasil biasanya **terikat pada OS/CPU** tertentu. Contoh: C, C++, Rust, Go.

## Interpreter: terjemahkan sambil menjalankan

**Interpreter** membaca kode sumber dan **langsung mengeksekusinya** (baris demi baris atau statement demi statement), tanpa menghasilkan berkas program terpisah.

~~~
 hitung.py ──► [ interpreter (python) ] ──► hasil di layar
 (kode sumber)    membaca dan mengerjakan sekarang juga
~~~

~~~bash
python hitung.py     # satu langkah: langsung jalan
~~~

**Ciri-ciri**: tanpa langkah build, siklus coba-ubah-coba sangat cepat; lebih mudah dibawa ke platform lain (selama interpreter-nya ada); biasanya **lebih lambat** karena menerjemahkan saat berjalan; sebagian galat baru ketahuan **saat baris itu dieksekusi**. Contoh klasik: Python, Ruby, PHP, shell script.

## Perbandingan

| Aspek | **Compiler** | **Interpreter** |
| --- | --- | --- |
| Kapan menerjemahkan | Sekali, **sebelum** dijalankan | **Saat** dijalankan |
| Hasil | Berkas program (mis. \`.exe\`) | Tidak ada berkas hasil terpisah |
| Kecepatan jalan | Cepat | Lebih lambat |
| Waktu mulai | Ada langkah build (bisa lama) | Langsung jalan |
| Deteksi galat | Banyak galat ditemukan di muka | Banyak galat muncul saat berjalan |
| Portabilitas hasil | Per platform (butuh kompilasi ulang) | Kode sumber sama, interpreter yang menyesuaikan |
| Distribusi | Cukup bagikan program hasil | Pengguna butuh interpreter terpasang |
| Contoh | C, C++, Go, Rust | Python, Ruby, PHP, Bash |

## Kenyataannya: sebagian besar bahasa hibrida

Perbedaan murni di atas hanyalah ujung spektrum. Hampir semua bahasa populer **menggabungkan keduanya**:

~~~
Java:       Main.java ─► javac ─► Main.class (bytecode) ─► JVM (interpreter + JIT) ─► jalan
Python:     hitung.py ─► kompilasi ke bytecode (.pyc) ─► VM CPython (interpreter) ─► jalan
JavaScript: kode ─► mesin V8: parse ─► bytecode ─► interpreter + JIT ─► kode mesin
~~~

Python itu **sebenarnya juga "dikompilasi"**: kode sumber lebih dulu diterjemahkan ke **bytecode**, baru bytecode dijalankan oleh mesin virtual. Karena itu label "Python = interpreter" hanyalah penyederhanaan. Yang lebih tepat adalah menggolongkan bahasa berdasarkan **implementasinya** (bytecode dan JIT dibahas di pelajaran terakhir bab ini).

## Bukti: Python membaca seluruh berkas dulu

Karena Python mengompilasi ke bytecode lebih dulu, **galat sintaks muncul sebelum satu pun baris dijalankan**, tetapi **galat runtime** baru muncul saat barisnya tercapai. Lihat sendiri:

~~~python
# Galat SINTAKS: tanda kurung kurang. Python menolaknya saat kompilasi,
# sehingga baris "print('A')" yang ada SEBELUMNYA pun tidak sempat jalan.
kode = "print('A')\\nprint('B'"
try:
    compile(kode, "contoh.py", "exec")
except SyntaxError as e:
    print("SyntaxError terdeteksi sebelum menjalankan apa pun:", e.msg)
~~~

~~~python
# Galat RUNTIME: sintaksnya benar, jadi baris pertama sempat jalan dulu.
kode = "print('A')\\nprint(1 / 0)"
objek_kode = compile(kode, "contoh.py", "exec")   # kompilasi berhasil
try:
    exec(objek_kode)                              # baru gagal saat dijalankan
except ZeroDivisionError as e:
    print("ZeroDivisionError saat berjalan:", e)
~~~

Pada bahasa yang dikompilasi penuh seperti C, kamu akan mendapat banyak galat (termasuk salah tipe) sebelum program sempat dibuat.

## Tahap-tahap lain di luar keduanya

- **Assembler**: assembly → kode mesin.
- **Transpiler** (*source-to-source compiler*): bahasa A → bahasa B yang levelnya sama. Contoh: TypeScript → JavaScript.
- **Linker** dan **loader**: menyatukan potongan kode dan memuatnya ke memori (dibahas di pelajaran berikut).
- **Mesin virtual (VM)**: "komputer imajiner" yang menjalankan bytecode (JVM, VM Python).

## Mana yang "lebih baik"?

Tidak ada. Compiler cocok bila **kinerja dan deteksi galat dini** penting (sistem operasi, game). Interpreter cocok bila **kecepatan pengembangan dan fleksibilitas** penting (skrip, prototipe, analisis data). Banyak tim memakai keduanya: prototipe dengan Python, lalu menulis ulang bagian paling lambat dengan bahasa terkompilasi.

## Rangkuman

- **Compiler** menerjemahkan **seluruh** kode sebelum dijalankan dan menghasilkan program; cepat dijalankan, galat tertangkap di muka (C, C++, Go, Rust).
- **Interpreter** menerjemahkan **sambil** menjalankan; praktis dan fleksibel tetapi lebih lambat (Python, Ruby, PHP).
- Banyak bahasa **hibrida**: dikompilasi ke **bytecode**, lalu dijalankan mesin virtual (Java, Python, JavaScript).
- Python mengompilasi seluruh berkas ke bytecode lebih dulu: galat sintaks muncul sebelum eksekusi, galat runtime saat baris tercapai.
- Pilih berdasarkan kebutuhan: kinerja dan keamanan tipe (compiler) vs kecepatan pengembangan (interpreter).
`,
};
