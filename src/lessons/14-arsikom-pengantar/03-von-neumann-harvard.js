export default {
  id: 'arsikom-von-neumann',
  judul: 'Arsitektur von Neumann vs Harvard',
  tipe: 'teks',
  xp: 15,
  materi: `
# Arsitektur von Neumann vs Harvard 🏛️

Hampir semua komputer yang pernah kamu pakai mengikuti salah satu dari dua "cetak biru" dasar. Memahami perbedaannya menjelaskan banyak keputusan desain, dari mikrokontroler Arduino sampai prosesor di laptopmu.

## Arsitektur von Neumann (1945)

Dalam laporan *First Draft of a Report on the EDVAC* (1945), John von Neumann menggambarkan komputer dengan prinsip **stored-program**:

1. **Instruksi dan data disimpan di memori yang sama**, dalam format biner yang sama.
2. Memori dialamati berdasarkan **lokasi** (alamat), tanpa peduli isinya instruksi atau data.
3. Instruksi dijalankan **berurutan**, kecuali ada instruksi lompatan.

~~~
        +------------------------------+
        |      CPU                     |
        |  +-------+   +------------+  |
        |  |  ALU  |<->|  Register  |  |
        |  +-------+   +------------+  |
        |        Unit Kontrol          |
        +--------------^---------------+
                       |  satu bus (alamat + data)
        +--------------v---------------+
        |   MEMORI: instruksi + data   |
        +------------------------------+
~~~

### Kenapa ini revolusioner?

Karena program adalah **data**. Akibatnya:

- Mengganti program cukup dengan **memuat ulang isi memori**, tidak perlu mengubah kabel seperti ENIAC.
- Sebuah program bisa **menghasilkan program lain**: compiler, loader, sistem operasi, dan *self-modifying code* semuanya bergantung pada kenyataan ini.
- Konsekuensi gelap: program juga bisa **ditimpa** sebagai data. Serangan *buffer overflow* memanfaatkan hal ini untuk menyuntikkan kode berbahaya.

### Kelemahan: von Neumann bottleneck

CPU harus mengambil instruksi **dan** data lewat **satu jalur** yang sama ke memori. Pada satu waktu, jalur itu hanya bisa melayani satu hal. Jika CPU jauh lebih cepat daripada memori, CPU banyak **menganggur menunggu memori**. Inilah yang disebut *von Neumann bottleneck*, dan alasan utama adanya cache (Bab 8).

## Arsitektur Harvard

Nama berasal dari komputer **Harvard Mark I** (1944), yang menyimpan instruksi pada pita kertas berlubang dan data pada penghitung elektromekanik terpisah.

Ciri utama: **memori instruksi dan memori data terpisah**, masing-masing dengan **bus sendiri**.

~~~
        +------------------------------+
        |             CPU              |
        +------^----------------^------+
               | bus instruksi  | bus data
        +------v------+  +------v------+
        |  MEMORI     |  |  MEMORI     |
        |  INSTRUKSI  |  |  DATA       |
        +-------------+  +-------------+
~~~

Keuntungan:

- CPU bisa **mengambil instruksi berikutnya sambil membaca/menulis data** di waktu yang sama (paralelisme dasar).
- Lebar bit dan teknologi tiap memori boleh berbeda. Misalnya memori program 14 bit, memori data 8 bit (seperti pada mikrokontroler PIC).
- Program tidak bisa tertimpa tidak sengaja oleh operasi data, jadi lebih aman dan cocok untuk sistem tertanam.

Kekurangan: lebih rumit, dan **tidak fleksibel**. Ruang instruksi dan ruang data masing-masing punya ukuran tetap, sehingga sisa ruang di satu sisi tidak bisa dipakai sisi lain. Memuat program dinamis juga sulit.

## Perbandingan

| Aspek | von Neumann | Harvard |
| --- | --- | --- |
| Memori instruksi & data | Satu, bersama | Terpisah |
| Jumlah bus ke memori | Satu | Dua |
| Ambil instruksi + akses data | Bergantian | Bisa bersamaan |
| Fleksibilitas ruang memori | Tinggi | Rendah |
| Pemakaian khas | Komputer serbaguna (PC, server) | Mikrokontroler, DSP (Arduino/AVR, PIC) |

## Yang dipakai komputer modern: Harvard yang "dimodifikasi"

Prosesor di laptop atau HP-mu adalah **hibrida** yang disebut *modified Harvard architecture*:

- **Dari sisi programmer dan memori utama (RAM): von Neumann.** Instruksi dan data berbagi satu ruang alamat, sehingga OS bisa memuat program dari disk ke RAM.
- **Di dalam CPU, level cache terdekat: Harvard.** Cache L1 dipisah menjadi **L1 instruksi (I-cache)** dan **L1 data (D-cache)** sehingga *fetch* instruksi dan akses data bisa berjalan serentak tanpa saling tunggu. Pipeline (Bab 7) sangat bergantung pada ini.

~~~
          CPU
     +----------+
     | I-cache  |   D-cache |     <- Harvard (terpisah)
     +----+-----+-----+-----+
          |   L2 / L3 (gabungan)  <- von Neumann (bersama)
          +-----------+
                      |
                    RAM (instruksi + data)
~~~

Jadi pertanyaan "komputerku von Neumann atau Harvard?" jawabannya: **keduanya**, tergantung level mana yang kamu lihat.

## Catatan: data memori vs register

Dalam model von Neumann murni, CPU punya sedikit **register** yang jadi tempat kerja super cepat, sementara data besar ada di memori. Hampir semua operasi aritmetika terjadi pada register. Arsitektur *load-store* (RISC, Bab 6) bahkan **mewajibkan** hal itu: ALU hanya boleh mengoperasikan register, memori hanya diakses lewat instruksi \`load\`/\`store\`.

## Rangkuman

- **von Neumann**: instruksi dan data di memori yang sama dengan satu bus. Fleksibel (program = data), tetapi punya *bottleneck* karena fetch instruksi dan akses data berebut jalur.
- **Harvard**: memori dan bus untuk instruksi dan data terpisah. Bisa serentak dan aman, tetapi kurang fleksibel. Umum di mikrokontroler dan DSP.
- Prosesor modern adalah **modified Harvard**: ruang alamat RAM bersama (von Neumann), tetapi cache L1 dipisah menjadi cache instruksi dan cache data.
- Konsep stored-program menjadi dasar compiler dan OS, sekaligus celah keamanan bagi buffer overflow.
`,
};
