export default {
  id: 'arsikom-apa-itu',
  judul: 'Apa itu Arsitektur & Organisasi Komputer?',
  tipe: 'teks',
  xp: 15,
  materi: `
# Apa itu Arsitektur & Organisasi Komputer? 🖥️

Selama ini kamu menulis program di C, Python, dan Java tanpa perlu tahu apa yang terjadi di dalam laptopmu. Mata kuliah **Arsitektur dan Organisasi Komputer (Arsikom)** membuka "kotak hitam" itu: bagaimana sebuah baris seperti \`a = b + c;\` akhirnya menjadi aliran listrik di dalam chip, dan kenapa sebagian program berjalan 100× lebih cepat dari program lain yang hasilnya sama persis.

Memahami ini bukan hanya teori. Ini menjelaskan kenapa \`int\` di C bisa overflow, kenapa loop yang mengakses array baris-demi-baris lebih cepat daripada kolom-demi-kolom, dan kenapa CPU modern punya banyak inti tetapi program biasa tidak otomatis jadi lebih cepat.

## Dua istilah yang sering tertukar

| Istilah | Pertanyaan yang dijawab | Terlihat oleh programmer? |
| --- | --- | --- |
| **Arsitektur komputer** | *Apa* yang bisa dilakukan komputer? | Ya |
| **Organisasi komputer** | *Bagaimana* kemampuan itu diwujudkan secara fisik? | Tidak |

**Arsitektur** adalah atribut yang tampak oleh programmer dan berdampak langsung pada eksekusi program. Contohnya:

- **Set instruksi** (ISA, *Instruction Set Architecture*): daftar instruksi yang dipahami CPU.
- Jumlah bit untuk representasi data (8, 16, 32, 64 bit).
- Mekanisme I/O dan teknik pengalamatan memori.
- Jumlah dan fungsi register yang bisa dipakai programmer.

**Organisasi** adalah unit-unit operasional beserta interkoneksinya yang mewujudkan spesifikasi arsitektur. Contohnya sinyal kontrol, antarmuka antar komponen, teknologi memori yang dipakai, dan apakah ada cache.

### Contoh pembeda yang paling jelas

Misalkan arsitektur menyatakan: *"CPU ini punya instruksi perkalian \`MUL\`."* Itu keputusan **arsitektur**.

Lalu perancang chip memilih salah satu cara berikut:

1. Membuat **unit perkalian khusus** (cepat, memakai banyak transistor), atau
2. Mengimplementasikan \`MUL\` dengan **penjumlahan berulang** memakai ALU yang sudah ada (lambat, hemat transistor).

Itu keputusan **organisasi**. Program yang memakai \`MUL\` tidak perlu diubah. Hasilnya sama, hanya kecepatannya berbeda.

> Inilah alasan sebuah **keluarga** komputer bisa punya arsitektur sama tetapi organisasi berbeda. Program Intel Core i3 dan Core i9 sama-sama berjalan di keluarga x86-64, padahal isi chip-nya sangat berbeda: jumlah inti, ukuran cache, dan lebar jalur eksekusi. Arsitektur yang sama menjaga **kompatibilitas biner**, organisasi yang berbeda memberi pilihan harga dan kinerja.

## Struktur dan fungsi

Sistem komputer sangat kompleks, jadi cara menjelaskannya adalah **hierarki**: pada tiap level, kita hanya peduli pada **struktur** (bagaimana komponen saling terhubung) dan **fungsi** (apa yang dilakukan tiap komponen).

### Empat fungsi dasar komputer

~~~
              +-------------------------------+
   Data  ---> |  1. PENGOLAHAN DATA           | ---> Hasil
              |  2. PENYIMPANAN DATA          |
              |  3. PERPINDAHAN DATA (I/O)    |
              |  4. KONTROL                   |
              +-------------------------------+
~~~

1. **Pengolahan data**: menghitung, membandingkan, memanipulasi (oleh CPU).
2. **Penyimpanan data**: jangka pendek (register, RAM) dan jangka panjang (SSD/HDD).
3. **Perpindahan data**: ke dan dari dunia luar. Bila sumber/tujuannya perangkat langsung, disebut *input/output*; bila jauh (jaringan), disebut *komunikasi data*.
4. **Kontrol**: mengatur ketiga fungsi di atas lewat instruksi dari program.

### Empat komponen struktural utama

~~~
+-----------------------------------------------------+
|                    KOMPUTER                         |
|   +---------+      +-----------+      +--------+    |
|   |  CPU    |<---->|  MEMORI   |<---->|  I/O   |    |
|   | (ALU,   |      |  UTAMA    |      | (disk, |    |
|   | kontrol,|      |           |      | layar, |    |
|   | register)      +-----------+      | jaringan)   |
|   +----^----+                         +----^---+    |
|        |      Interkoneksi sistem (BUS)    |        |
|        +-----------------------------------+        |
+-----------------------------------------------------+
~~~

| Komponen | Peran |
| --- | --- |
| **CPU** | Mengendalikan operasi komputer dan melakukan pengolahan data |
| **Memori utama** | Menyimpan program dan data yang sedang dipakai |
| **I/O** | Memindahkan data antara komputer dan lingkungan luarnya |
| **Interkoneksi sistem** | Mekanisme komunikasi antar CPU, memori, dan I/O (misalnya bus) |

Lalu CPU sendiri bisa dibuka lagi: **ALU** (menghitung), **unit kontrol** (mengatur urutan), **register** (penyimpan super cepat), dan **interkoneksi internal CPU**. Kamu akan membedah semuanya satu per satu di bab-bab berikutnya.

## Lapisan abstraksi: dari Python sampai transistor

Komputer modern dirancang sebagai tumpukan **level**. Tiap level menyembunyikan detail level di bawahnya (*abstraksi*) dan hanya menampilkan "antarmuka" yang rapi.

~~~
Level 5  Bahasa tingkat tinggi     Python, Java, C
Level 4  Bahasa assembly           mov, add, jmp
Level 3  Sistem operasi            proses, file, memori virtual
Level 2  Arsitektur set instruksi  (ISA) x86-64, ARM, RISC-V
Level 1  Mikroarsitektur           pipeline, cache, unit kontrol
Level 0  Logika digital            gerbang, flip-flop, transistor
~~~

Program di level 5 diterjemahkan (oleh *compiler* atau *interpreter*) ke level di bawahnya sampai akhirnya berupa instruksi biner yang dijalankan hardware. **ISA adalah "kontrak"** antara perangkat lunak dan perangkat keras: software hanya perlu tahu ISA, hardware boleh mengubah isi di bawahnya selama kontraknya dipenuhi.

Kursus ini bergerak dari bawah ke atas: data & logika digital → CPU → instruksi → memori → I/O → paralelisme.

## Contoh: satu baris C, sampai ke hardware

~~~c
c = a + b;
~~~

Compiler dapat mengubahnya menjadi instruksi ISA seperti (pseudo-assembly):

~~~
LOAD  R1, a      ; ambil a dari memori ke register R1
LOAD  R2, b      ; ambil b dari memori ke register R2
ADD   R3, R1, R2 ; ALU menjumlahkan R1 + R2, hasil di R3
STORE c, R3      ; simpan R3 ke memori variabel c
~~~

Setiap instruksi itu dikodekan sebagai bilangan biner, diambil dari memori oleh CPU, diterjemahkan oleh unit kontrol, dan dieksekusi oleh ALU yang tersusun dari gerbang logika. Satu baris sederhana saja melibatkan **semua** komponen di atas: memori, bus, register, ALU, dan kontrol.

## Rangkuman

- **Arsitektur** = apa yang terlihat programmer (ISA, ukuran data, pengalamatan). **Organisasi** = bagaimana hardware mewujudkannya (kontrol, cache, teknologi memori).
- Arsitektur yang sama bisa diwujudkan dengan organisasi berbeda: itu sebabnya satu keluarga prosesor punya banyak varian harga/kinerja yang saling kompatibel.
- Komputer punya empat fungsi (olah data, simpan data, pindah data, kontrol) dan empat komponen utama (CPU, memori, I/O, interkoneksi).
- Komputer dipahami lewat **lapisan abstraksi**; ISA adalah batas antara software dan hardware.
`,
};
