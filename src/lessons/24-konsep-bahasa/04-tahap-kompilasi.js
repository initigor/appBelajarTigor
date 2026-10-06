export default {
  id: 'konsep-tahap-kompilasi',
  judul: 'Tahap-Tahap Kompilasi: Dari Teks ke Kode Mesin',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Tahap-Tahap Kompilasi: Dari Teks ke Kode Mesin 🏭

Di dalam compiler (dan juga interpreter), kode sumber melewati **jalur produksi** beberapa tahap. Tiap tahap menerima satu bentuk data dan menghasilkan bentuk lain yang lebih dekat ke mesin. Mengetahuinya membuat pesan galat dan perilaku bahasa jauh lebih masuk akal.

## Gambaran besar

~~~
 Kode sumber (teks)
       │  1. Analisis leksikal (lexer)        → deretan TOKEN
       ▼
     Token
       │  2. Analisis sintaks (parser)        → pohon sintaks (AST)
       ▼
      AST
       │  3. Analisis semantik                → cek tipe, cek nama variabel
       ▼
  AST terverifikasi
       │  4. Representasi antara (IR)         → bentuk netral-mesin
       ▼
      IR
       │  5. Optimasi                         → IR yang lebih efisien
       ▼
      IR'
       │  6. Pembangkitan kode (code gen)     → assembly / kode mesin
       ▼
  Berkas objek (.o)
       │  7. Linking                          → menyatukan banyak berkas + pustaka
       ▼
  Program (.exe)  ──► 8. Loader memuatnya ke memori lalu CPU menjalankannya
~~~

Tahap 1–3 disebut **front end** (memahami bahasa sumber), tahap 5–6 **back end** (menghasilkan kode untuk CPU tertentu). Pemisahan ini yang membuat satu compiler (misalnya LLVM) mendukung banyak bahasa dan banyak CPU.

## 1. Analisis leksikal: memecah teks menjadi token

**Lexer** membaca deretan karakter dan mengelompokkannya menjadi **token**: satuan terkecil yang bermakna (kata kunci, nama, angka, operator). Spasi dan komentar dibuang.

Teks \`total = harga * 3\` dipecah menjadi: nama \`total\`, operator \`=\`, nama \`harga\`, operator \`*\`, angka \`3\`. Python menyediakan lexernya lewat modul \`tokenize\`:

~~~python
import io
import tokenize

kode = "total = harga * 3"
for token in tokenize.generate_tokens(io.StringIO(kode).readline):
    if token.string.strip():
        print(tokenize.tok_name[token.type].ljust(7), repr(token.string))
~~~

Galat leksikal contohnya karakter ilegal atau string yang tidak ditutup.

## 2. Analisis sintaks: membangun pohon

**Parser** memeriksa apakah urutan token sesuai **tata bahasa** (grammar) lalu membangun **pohon sintaks abstrak** (*Abstract Syntax Tree*, AST) yang menyatakan struktur dan prioritas operator. Ini sebabnya \`1 + 2 * 3\` dihitung sebagai \`1 + (2 * 3)\` dan bukan \`(1 + 2) * 3\`:

~~~
        =
       / \\
  total   *
         / \\
    harga   3
~~~

Lihat AST yang sebenarnya dibuat Python:

~~~python
import ast

pohon = ast.parse("x = 1 + 2 * 3")
print(ast.dump(pohon, indent=2))
~~~

Perhatikan bahwa \`BinOp(Add)\` membungkus \`BinOp(Mult)\`: perkalian berada **lebih dalam** pada pohon karena dikerjakan lebih dulu. *Syntax error* berasal dari tahap ini:

~~~python
# galat
print("halo"
~~~

## 3. Analisis semantik

Sintaks benar belum tentu bermakna. Tahap ini memeriksa **arti**: apakah variabel sudah dideklarasikan, apakah tipenya cocok, apakah fungsi dipanggil dengan jumlah argumen yang benar. Pada bahasa bertipe statis (C, Java) tahap ini menolak \`int x = "teks";\` sebelum program jalan. Pada Python sebagian pemeriksaan semacam itu baru terjadi saat runtime.

## 4–5. Representasi antara dan optimasi

Compiler menerjemahkan AST ke **IR** (*Intermediate Representation*) lalu **mengoptimasinya** tanpa mengubah hasil. Beberapa optimasi klasik:

| Optimasi | Sebelum | Sesudah |
| --- | --- | --- |
| **Constant folding** | \`x = 60 * 60 * 24\` | \`x = 86400\` (dihitung saat kompilasi) |
| **Dead code elimination** | \`if (false) { ... }\` | blok dibuang |
| **Inlining** | pemanggilan fungsi kecil | isi fungsi disisipkan langsung |
| **Loop unrolling** | loop 4 iterasi | 4 salinan badan loop, tanpa pengecekan |
| **Common subexpression** | \`a*b\` dihitung dua kali | dihitung sekali, hasil dipakai ulang |

Python pun melakukan constant folding. Pada bytecode di bawah, \`60 * 60 * 24\` sudah menjadi satu konstanta:

~~~python
import dis

def detik_sehari():
    return 60 * 60 * 24

dis.dis(detik_sehari)
~~~

Opsi kompilator C: \`gcc -O0\` (tanpa optimasi, mudah di-debug) vs \`-O2\`/\`-O3\` (optimasi agresif, jauh lebih cepat).

## 6. Pembangkitan kode

*Back end* menerjemahkan IR ke instruksi CPU target: memilih instruksi, mengalokasikan **register** (CPU hanya punya belasan), dan menjadwalkan urutan. Menghasilkan **berkas objek** (\`.o\` atau \`.obj\`) berisi kode mesin tetapi **belum lengkap**: pemanggilan ke fungsi di berkas lain belum diketahui alamatnya.

## 7. Linking

Program nyata terdiri dari banyak berkas dan memakai pustaka (\`printf\` milik pustaka standar C). **Linker** menyatukan semuanya dan menyelesaikan referensi antarberkas.

| | **Static linking** | **Dynamic linking** |
| --- | --- | --- |
| Pustaka | Disalin ke dalam program | Dimuat saat program jalan (\`.dll\`, \`.so\`) |
| Ukuran program | Besar | Kecil |
| Pembaruan pustaka | Harus kompilasi ulang | Cukup ganti berkas pustaka |
| Kebergantungan | Mandiri | Butuh pustaka terpasang |

Galat khas tahap ini: *undefined reference to ...* (fungsi dipakai tetapi tidak ditemukan).

## 8. Loader

Saat program dijalankan, **loader** milik sistem operasi menyalin kode ke memori, menyiapkan stack dan heap, memuat pustaka dinamis, lalu mengarahkan CPU ke instruksi pertama (**entry point**). Setelah itu barulah CPU menjalankan siklus fetch-decode-execute (lihat Arsikom).

## Dari C ke program: empat langkah yang terlihat

Pada \`gcc\` semua tahap tadi dibungkus empat langkah utama yang bisa dijalankan terpisah:

~~~bash
gcc -E hitung.c -o hitung.i    # 1. preprocessor: proses #include dan #define
gcc -S hitung.i -o hitung.s    # 2. compiler: C → assembly
gcc -c hitung.s -o hitung.o    # 3. assembler: assembly → berkas objek
gcc hitung.o -o hitung         # 4. linker: berkas objek + pustaka → program
~~~

Menjalankan \`gcc hitung.c -o hitung\` otomatis melakukan keempatnya sekaligus.

## Rangkuman

- Jalur kompilasi: **lexer → parser (AST) → analisis semantik → IR → optimasi → code generation → linking → loader**.
- **Token** adalah satuan terkecil; **AST** menyatakan struktur dan prioritas operator; galat sintaks datang dari parser, galat tipe dari analisis semantik.
- Optimasi (constant folding, inlining, loop unrolling) mempercepat program tanpa mengubah hasil.
- **Linker** menyatukan berkas objek dan pustaka (static vs dynamic); **loader** memuat program ke memori.
- Python memiliki alat bantu \`tokenize\`, \`ast\`, dan \`dis\` untuk melihat tahap-tahap ini secara langsung.
`,
};
