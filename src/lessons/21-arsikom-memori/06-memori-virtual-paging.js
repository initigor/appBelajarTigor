export default {
  id: 'arsikom-memori-virtual',
  judul: 'Memori Virtual dan Paging',
  tipe: 'teks',
  xp: 30,
  materi: `
# Memori Virtual dan Paging 🧭

Kamu menjalankan Chrome, VS Code, dan Spotify bersamaan. Masing-masing "merasa" memiliki seluruh memori sendiri, mulai dari alamat 0, padahal RAM-mu hanya 16 GB dan dibagi untuk semuanya. Bahkan program yang membutuhkan lebih banyak memori daripada RAM tetap bisa berjalan. Itulah **memori virtual**.

## Masalah yang diselesaikan

1. **Program lebih besar dari RAM** tetap harus bisa berjalan.
2. **Banyak program berjalan bersamaan** dan tidak boleh saling merusak data.
3. **Alamat tidak boleh bergantung pada tempat program dimuat** (relokasi).
4. **Perlindungan**: program A tidak boleh membaca memori program B atau kernel.

## Ide: alamat virtual dan alamat fisik

Setiap proses memakai **alamat virtual** (*virtual address*, VA). Hardware (**MMU**, *Memory Management Unit*) menerjemahkannya ke **alamat fisik** (*physical address*, PA) di RAM, setiap kali program mengakses memori.

~~~
   CPU ──VA──► [ MMU + tabel halaman ] ──PA──► RAM
~~~

Ruang alamat virtual bisa **jauh lebih besar** daripada RAM fisik (48 bit = 256 TiB pada x86-64), sedangkan RAM hanya menampung sebagian. Sisanya berada di disk (area **swap**).

## Paging: memori dibagi halaman

Ruang virtual dibagi menjadi potongan berukuran tetap yang disebut **halaman (page)**, dan RAM fisik dibagi menjadi **frame** berukuran sama. Ukuran umum: **4 KiB**. Satu halaman dapat ditaruh di **frame mana pun**.

~~~
Ruang alamat virtual      Tabel halaman         RAM fisik
 Halaman 0 ────────────►   0 → frame 5  ───►    Frame 5
 Halaman 1 ────────────►   1 → disk     ─ ─►    (tidak di RAM)
 Halaman 2 ────────────►   2 → frame 2  ───►    Frame 2
~~~

Karena ukuran halaman dan frame sama, tidak ada **fragmentasi eksternal** (hanya fragmentasi internal kecil di halaman terakhir).

## Terjemahan alamat

Alamat virtual dipecah menjadi dua bagian:

~~~
| Nomor halaman virtual (VPN) | Offset di halaman |
~~~

Dengan halaman 4 KiB (2¹²): **offset = 12 bit**. Pada VA 32 bit: **VPN = 32 − 12 = 20 bit**.

**Tabel halaman** (*page table*) dimiliki tiap proses. Entrinya (*PTE*) berindeks VPN dan berisi **nomor frame fisik** plus bit penting:

| Bit di PTE | Arti |
| --- | --- |
| **Valid / Present** | Halaman ada di RAM? (0 → *page fault* bila diakses) |
| **Dirty** | Halaman sudah diubah (perlu ditulis ke disk sebelum dibuang) |
| **Referenced / Accessed** | Baru-baru ini diakses (dipakai penggantian halaman) |
| **Izin** (R/W/X, user/kernel) | Perlindungan akses |

Terjemahan: **PA = (nomor frame dari PTE[VPN]) | offset**. Offset tidak berubah (ia hanya posisi di dalam halaman), hanya nomor halaman yang diganti nomor frame.

### Contoh terjemahan

Halaman 4 KiB, VA = \`0x00403A7C\`.

~~~
Offset = 12 bit terendah  = 0xA7C
VPN    = VA >> 12         = 0x00403
~~~

Misalkan tabel halaman: VPN 0x403 → frame 0x12 (valid).

~~~
PA = (0x12 << 12) + 0xA7C = 0x12000 + 0xA7C = 0x12A7C
~~~

### Ukuran tabel halaman

VA 32 bit, halaman 4 KiB, PTE 4 byte.

~~~
Jumlah entri = 2^20 = 1.048.576
Ukuran tabel = 2^20 × 4 byte = 4 MiB per proses
~~~

Setiap proses butuh tabel 4 MiB; untuk 100 proses itu 400 MiB hanya untuk tabel. Pada VA 64 bit, satu tabel datar tidak mungkin (2⁵² entri), sehingga dipakai **tabel halaman bertingkat**.

### Tabel halaman bertingkat (multi-level)

Pecah VPN menjadi beberapa bagian, tiap bagian mengindeks satu tingkat tabel. Hanya tabel untuk wilayah yang **dipakai** yang perlu dialokasikan.

~~~
VA 32 bit, 2 tingkat:   | 10 bit | 10 bit | 12 bit offset |
                          tingkat-1  tingkat-2

x86-64: 4 tingkat, VA 48 bit:  9 + 9 + 9 + 9 bit + 12 bit offset = 48 bit
~~~

Program yang hanya memakai sedikit memori tidak mengalokasikan tabel besar. Harga: **4 akses memori** untuk satu terjemahan pada x86-64, tanpa bantuan TLB (pelajaran berikutnya).

## Page fault dan demand paging

Halaman **tidak dimuat sebelum dibutuhkan**: **demand paging**. Bila program mengakses halaman yang bit *valid*-nya 0:

1. MMU memicu **page fault** (sebuah exception, mirip interupsi di Bab 5).
2. Sistem operasi memeriksa apakah akses sah. Jika tidak (alamat ilegal), proses dihentikan (*segmentation fault*).
3. Jika sah: OS mencari **frame bebas** (atau mengusir halaman lain bila penuh).
4. OS membaca halaman dari disk ke frame itu (proses lain boleh berjalan selama menunggu disk).
5. OS memperbarui PTE (valid = 1, frame baru).
6. Instruksi yang gagal **diulang** dan kali ini berhasil.

### Biaya page fault

Akses RAM ±100 ns. Page fault harus ke disk: HDD ±8 ms, SSD ±100 µs. Satu page fault pada HDD setara **±80.000 kali** akses RAM.

**Contoh EAT** (*Effective Access Time*): akses memori 200 ns, page fault 8 ms = 8.000.000 ns, tingkat page fault **p = 1/1000**.

~~~
EAT = (1 − p) × 200 + p × 8.000.000
    = 0,999 × 200 + 0,001 × 8.000.000
    = 199,8 + 8000 = 8199,8 ns ≈ 8,2 µs
~~~

Hanya 1 dari 1000 akses yang fault, tetapi sistem **40× lebih lambat**. Agar slowdown di bawah 10%, p harus < 1 dari 400.000 akses.

## Penggantian halaman

Bila RAM penuh, halaman yang paling tak berguna diusir. Pilihan algoritma:

| Algoritma | Cara | Catatan |
| --- | --- | --- |
| **FIFO** | Usir halaman yang paling lama di memori | Sederhana, bisa buruk; mengalami **anomali Belady** (lebih banyak frame bisa menambah fault) |
| **LRU** | Usir halaman yang paling lama tidak dipakai | Baik, mahal diimplementasi persis |
| **Clock (second chance)** | Aproksimasi LRU memakai bit referenced | Dipakai nyata (varian) |
| **Optimal** | Usir yang paling lama tidak dipakai **di masa depan** | Mustahil di praktik; patokan teoretis |

Halaman bertanda **dirty** harus ditulis ke disk sebelum diusir; yang bersih cukup dibuang.

**Thrashing**: bila jumlah frame terlalu sedikit dibanding halaman yang aktif dipakai (*working set*), sistem menghabiskan hampir seluruh waktu untuk memindahkan halaman, dan hampir tidak ada kemajuan. Gejalanya: disk sibuk terus, komputer terasa membeku.

## Manfaat tambahan memori virtual

- **Isolasi dan perlindungan**: tiap proses punya tabel halaman sendiri; proses tidak bisa menyentuh halaman proses lain atau kernel.
- **Berbagi memori**: dua proses dapat memetakan frame yang sama (pustaka bersama seperti libc dimuat sekali di RAM).
- **Copy-on-write**: \`fork()\` menyalin tabel halaman, bukan data; halaman baru disalin hanya saat salah satu proses menulis.
- **File memory-mapped** (\`mmap\`): berkas diakses seperti array di memori.
- **Alokasi malas**: \`malloc\` sebesar 1 GB tidak langsung menghabiskan RAM; frame baru disediakan saat halaman pertama kali disentuh.

## Rangkuman

- Memori virtual: tiap proses memakai **alamat virtual**; **MMU** menerjemahkan ke **alamat fisik** lewat **tabel halaman** (per proses). Halaman umumnya 4 KiB.
- VA dipecah menjadi **VPN | offset**; PA = frame dari PTE + offset. Contoh: 0x00403A7C, VPN 0x403 → frame 0x12 → PA 0x12A7C.
- Tabel datar VA 32 bit memakai 4 MiB per proses; tabel **bertingkat** (x86-64: 4 tingkat) hanya mengalokasikan bagian yang dipakai.
- **Page fault** → OS memuat halaman dari disk (demand paging). Fault mahal: EAT dengan p = 1/1000 ≈ 8,2 µs dibanding 200 ns.
- Penggantian halaman: FIFO, LRU, Clock; **thrashing** bila working set tidak muat.
- Manfaat: isolasi, berbagi pustaka, copy-on-write, mmap, alokasi malas.
`,
};
