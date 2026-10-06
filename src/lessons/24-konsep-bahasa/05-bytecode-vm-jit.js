export default {
  id: 'konsep-bytecode-jit',
  judul: 'Bytecode, Mesin Virtual, dan JIT',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Bytecode, Mesin Virtual, dan JIT 🧪

Dua pelajaran sebelumnya menggambarkan dua kutub: compiler langsung ke kode mesin, dan interpreter yang membaca kode sumber. Dunia nyata punya **jalan tengah** yang dipakai bahasa paling populer: **bytecode** yang dijalankan oleh **mesin virtual**, sering dibantu **JIT compiler**.

## Masalah yang mau diselesaikan

Kode mesin cepat tetapi **terikat CPU**. Kode sumber **portabel** tetapi lambat dibaca berulang. Bagaimana mendapat portabilitas **dan** kecepatan yang wajar?

**Jawaban:** terjemahkan kode sumber ke **bentuk antara** yang netral-CPU, lebih sederhana daripada kode sumber, dan mudah dijalankan oleh program kecil yang ada di setiap platform.

~~~
 kode sumber ──► compiler ──► BYTECODE ──► mesin virtual (VM) ──► jalan di CPU mana pun
 (portabel)                    (netral CPU)   (ada versi per platform)
~~~

## Bytecode

**Bytecode** adalah deretan instruksi sederhana untuk **komputer imajiner** (mesin virtual). Instruksinya mirip assembly, tetapi tidak menyebut register CPU nyata. Banyak VM berbasis **stack**: operand didorong ke stack, instruksi mengambilnya dari sana.

Lihat bytecode Python untuk fungsi penjumlahan sederhana. Setiap baris adalah satu instruksi VM:

~~~python
import dis

def tambah(a, b):
    return a + b

dis.dis(tambah)
~~~

Kamu akan melihat urutan seperti: muat \`a\`, muat \`b\`, \`BINARY_OP (+)\`, kembalikan hasil. Satu baris Python menjadi beberapa instruksi bytecode, dan tiap instruksi bytecode dikerjakan oleh banyak instruksi mesin di dalam VM.

Contoh percabangan memperlihatkan lompatan:

~~~python
import dis

def kategori(nilai):
    if nilai >= 70:
        return "lulus"
    return "ulang"

dis.dis(kategori)
~~~

Bytecode Python disimpan di folder \`__pycache__\` sebagai berkas \`.pyc\` supaya tidak perlu dikompilasi ulang bila sumbernya tidak berubah. Itu sebabnya modul yang sudah pernah diimpor terasa lebih cepat dimuat.

## Mesin virtual (VM)

**VM** adalah program yang membaca bytecode dan mengeksekusinya. Inti VM adalah loop sederhana (mirip siklus fetch-decode-execute CPU, tetapi dalam perangkat lunak):

~~~
while True:
    instruksi = bytecode[penunjuk]      # fetch
    penunjuk += 1
    if instruksi == TAMBAH:             # decode + execute
        b = stack.pop(); a = stack.pop(); stack.append(a + b)
    elif instruksi == KEMBALI:
        return stack.pop()
    ...
~~~

| Platform | Kode sumber | Bytecode | VM |
| --- | --- | --- | --- |
| **Java** | \`.java\` | \`.class\` (bytecode JVM) | **JVM** (HotSpot) |
| **Python** | \`.py\` | \`.pyc\` | **CPython** VM |
| **C#** | \`.cs\` | CIL | **.NET CLR** |
| **JavaScript** | \`.js\` | bytecode internal | **V8** (Chrome, Node.js), SpiderMonkey, JavaScriptCore |
| **WebAssembly** | dari C/Rust/dll | \`.wasm\` | VM di dalam browser |

Slogan Java: **"Write Once, Run Anywhere"**: \`.class\` yang sama jalan di Windows, Linux, macOS karena yang berbeda hanya JVM-nya. (Itu juga sebabnya situs ini menjalankan Python di browser: Pyodide adalah CPython yang dikompilasi ke WebAssembly.)

## JIT: mempercepat VM

Menjalankan bytecode lewat interpreter VM masih lambat dibanding kode mesin asli. **JIT compiler** (*Just-In-Time*) memperbaikinya: ia **memantau program saat berjalan**, menemukan bagian yang sering dipakai (**hot spot**, misalnya loop), dan **menerjemahkannya ke kode mesin saat itu juga**.

~~~
 bytecode ──► interpreter VM ──(bagian "panas" terdeteksi)──► JIT ──► kode mesin cepat
                  mulai cepat                                          dipakai berikutnya
~~~

Keunggulan JIT dibanding kompilasi di muka (**AOT**, *Ahead-Of-Time*):

- Tahu **perilaku nyata** program (tipe apa yang benar-benar lewat), sehingga bisa mengoptimasi spekulatif.
- Tetap **portabel**: bytecode sama, JIT menghasilkan kode untuk CPU yang sedang dipakai.

Kekurangannya: butuh waktu **pemanasan** (*warm-up*) dan memori ekstra. Contoh: **HotSpot** (Java), **V8 TurboFan** (JavaScript), **PyPy** (Python), **.NET RyuJIT**.

## Tiga strategi eksekusi

| Strategi | Cara | Awal jalan | Kecepatan puncak | Contoh |
| --- | --- | --- | --- | --- |
| **Interpretasi** | Eksekusi langsung bytecode/sumber | Cepat | Rendah | CPython, Bash |
| **AOT** | Terjemahkan semuanya sebelum jalan | Lambat (build) | Tinggi | C, C++, Rust, Go |
| **JIT** | Interpretasi dulu, bagian panas dikompilasi saat jalan | Cepat | Tinggi setelah warm-up | Java, JavaScript (V8), PyPy |

## Mengapa Python "lambat" dan apa solusinya?

CPython hanya menginterpretasi bytecode (sampai versi terbaru yang mulai memakai JIT eksperimental), ditambah **tipe dinamis** dan **GIL** (kunci global yang membuat satu proses Python hanya menjalankan satu thread bytecode pada satu waktu). Jalan keluar yang umum:

1. **Pakai pustaka native**: NumPy, pandas, dan PyTorch menjalankan komputasi berat dalam C/C++/CUDA.
2. **Implementasi lain**: PyPy (JIT), Cython atau Numba (mengompilasi ke kode mesin).
3. **Multiproses** untuk memakai banyak inti CPU.
4. **Tulis ulang** bagian kritis dalam bahasa terkompilasi.

## Transpiler dan WebAssembly

- **Transpiler** menerjemahkan antarbahasa berlevel serupa: TypeScript → JavaScript, atau Sass → CSS.
- **WebAssembly (Wasm)**: bytecode portabel dan cepat yang berjalan di browser. C, C++, dan Rust dapat dikompilasi ke Wasm sehingga aplikasi berat (editor foto, game, bahkan Python) berjalan di halaman web.

## Rangkuman

- **Bytecode** = bentuk antara netral-CPU; **VM** = program yang menjalankannya. Dipakai Java (JVM), Python, C#, dan JavaScript.
- Keuntungan: **portabilitas** (bytecode sama untuk semua platform). Kerugiannya lebih lambat daripada kode mesin asli.
- **JIT** menerjemahkan bagian program yang sering dipakai menjadi kode mesin saat berjalan: portabel dan cepat setelah warm-up.
- Tiga strategi: **interpretasi**, **AOT**, **JIT**; sebagian besar bahasa modern adalah hibrida.
- Python bisa dipercepat dengan pustaka native (NumPy), implementasi JIT (PyPy), atau kompilasi bagian kritis.
- Di Python, \`dis.dis(fungsi)\` memperlihatkan bytecode sebenarnya.
`,
};
