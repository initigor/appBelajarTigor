export default {
  id: 'arsikom-teknik-io',
  judul: 'Modul I/O dan Tiga Teknik Input/Output',
  tipe: 'teks',
  xp: 25,
  materi: `
# Modul I/O dan Tiga Teknik Input/Output 🖨️

CPU tidak berbicara langsung dengan keyboard, disk, atau jaringan. Perangkat I/O sangat beragam dalam kecepatan (keyboard ±10 byte/detik, SSD miliaran byte/detik), format data, dan cara kerja. Dibutuhkan lapisan penengah: **modul I/O** (*I/O controller*).

## Modul I/O

Fungsi modul I/O:

- **Kontrol dan pewaktuan**: menyelaraskan perangkat lambat dengan CPU cepat.
- **Komunikasi CPU**: menerima perintah, melaporkan status, mengenali alamat.
- **Komunikasi perangkat**: berbicara dengan perangkat fisik.
- **Buffering**: menampung data sementara karena beda kecepatan.
- **Deteksi galat**: parity, CRC, dan sebagainya.

Dari sisi CPU, modul I/O tampil sebagai beberapa **register** (data, status, kontrol) yang diakses lewat memory-mapped I/O atau port I/O (Bab 5):

| Register | Fungsi |
| --- | --- |
| **Data** | Byte yang dikirim/diterima |
| **Status** | Apakah perangkat sibuk? Sudah siap? Ada galat? |
| **Kontrol** | Perintah ke perangkat (mulai, hentikan, atur mode) |

## Tiga teknik I/O

Pertanyaan kuncinya: **bagaimana CPU tahu kapan perangkat siap, dan siapa yang memindahkan data?**

### 1. Programmed I/O (polling)

CPU **sendiri** mengendalikan segalanya: memberi perintah, **berulang kali memeriksa register status** sampai perangkat siap, lalu memindahkan data satu per satu.

~~~c
// Membaca N byte dari perangkat dengan polling
for (int i = 0; i < N; i++) {
    while ((STATUS & SIAP) == 0) { }   // sibuk menunggu (busy waiting)
    buffer[i] = DATA;                  // CPU memindahkan datanya
}
~~~

- **Kelebihan**: sangat sederhana, tanpa hardware tambahan.
- **Kekurangan**: CPU **terbuang** untuk menunggu dan menyalin data. Hanya cocok untuk sistem tertanam sederhana atau perangkat yang cepat dan sering siap.

### 2. Interrupt-driven I/O

CPU memberi perintah, lalu **mengerjakan hal lain**. Ketika perangkat siap, modul I/O mengirim **interupsi**; CPU menjalankan ISR yang memindahkan **satu unit data** (satu byte atau word), lalu kembali (Bab 5).

- **Kelebihan**: CPU tidak menunggu; cocok untuk perangkat yang jarang aktif (keyboard, mouse).
- **Kekurangan**: **setiap** unit data tetap melewati CPU, dan tiap interupsi punya overhead (simpan/pulihkan konteks, ratusan siklus). Untuk perangkat yang cepat, banjir interupsi membanjiri CPU.

### 3. DMA (Direct Memory Access)

**Pengontrol DMA** memindahkan **blok data besar langsung antara perangkat dan memori tanpa melewati CPU**. CPU hanya menyiapkan transfer (alamat memori, jumlah byte, arah), lalu bebas mengerjakan hal lain. Pengontrol memberi **satu interupsi di akhir blok**. (Dibahas lengkap di pelajaran berikutnya.)

~~~
Polling:    CPU ──► [cek status... cek status... baca data] ──► memori      (CPU sibuk penuh)
Interupsi:  CPU ──► kerja lain ─(IRQ)─► ISR salin 1 unit ──► memori         (CPU terlibat per unit)
DMA:        CPU ──► atur DMA ──► kerja lain ─ ... ─(1 IRQ di akhir)         (CPU nyaris tidak terlibat)
                    DMA ═════ memindahkan data ═════► memori
~~~

## Perbandingan

| Aspek | Polling | Interupsi | DMA |
| --- | --- | --- | --- |
| Siapa memindahkan data | CPU | CPU | **Pengontrol DMA** |
| CPU menunggu? | Ya (busy-wait) | Tidak | Tidak |
| Overhead per unit data | Polling + salin | Interupsi + salin | Hampir nol |
| Hardware tambahan | Tidak ada | Pengontrol interupsi | Pengontrol DMA |
| Cocok untuk | Perangkat sederhana/cepat dan sering siap | Perangkat jarang & lambat | Perangkat cepat dengan blok besar (disk, jaringan, GPU) |

## Contoh hitungan: dampak ke CPU

CPU 1 GHz. Sebuah perangkat memindahkan data 100 KB/detik, per transfer 4 byte (satu word). Biaya per kegiatan:

- 1 polling = **400 siklus**
- 1 interupsi (simpan konteks + ISR + pulihkan) = **500 siklus**
- Menyiapkan satu transfer DMA = **1000 siklus** (per blok 4 KB)

Jumlah transfer per detik: 100 KB / 4 B = **25.000 word/detik**.

| Teknik | Perhitungan | Siklus/detik | Beban CPU |
| --- | --- | --- | --- |
| Polling | 25.000 × 400 | 10.000.000 | **1%** |
| Interupsi | 25.000 × 500 | 12.500.000 | **1,25%** |
| DMA | (100 KB / 4 KB = 25 blok) × 1000 | 25.000 | **0,0025%** |

Pelajaran:

1. Untuk perangkat yang **aktif terus-menerus** dan cepat, **interupsi bisa lebih mahal daripada polling**. Keunggulan interupsi muncul bila perangkat **jarang aktif**, sehingga polling terus-menerus sia-sia.
2. **DMA** mengurangi beban CPU ratusan kali lipat untuk transfer blok.

Jika perangkat hanya aktif 1% dari waktu: polling tetap menghabiskan CPU (terus bertanya), sedangkan interupsi hanya memakai CPU saat ada data. Pilihan ditentukan oleh pola aktivitas perangkat.

## Prosesor I/O dan kanal

Pada mainframe, **prosesor I/O** (kanal) adalah prosesor khusus yang menjalankan program I/O sendiri; CPU hanya memulai dan menerima hasil. Kontroler modern (NVMe, kartu jaringan, GPU) sudah mencakup prosesor kecil dengan antrean perintah, mengikuti pola ini.

## Isu praktis

- **Polling masih dipakai** pada jaringan berkecepatan sangat tinggi (Linux NAPI, DPDK): bila paket datang tiap beberapa mikrodetik, interupsi per paket terlalu mahal, jadi beralih ke polling saat beban tinggi.
- **Interrupt coalescing**: perangkat menunda interupsi sampai beberapa data terkumpul, menukar sedikit latensi dengan beban CPU lebih ringan.
- **Prioritas dan latensi**: perangkat yang lebih penting (timer, rem) berprioritas interupsi lebih tinggi.

## Rangkuman

- **Modul I/O** menjembatani CPU dan perangkat (kontrol, buffering, deteksi galat) lewat register data, status, dan kontrol.
- **Polling**: CPU menunggu dan memindahkan data (sederhana, boros CPU). **Interupsi**: perangkat memberi tahu CPU, tetapi CPU tetap memindahkan tiap unit. **DMA**: pengontrol DMA memindahkan blok langsung ke memori, CPU hanya mengatur dan menerima satu interupsi akhir.
- Contoh: 25.000 word/detik → polling 1%, interupsi 1,25%, DMA 0,0025% dari CPU 1 GHz.
- Interupsi unggul untuk perangkat yang jarang aktif; DMA untuk transfer blok besar dan cepat.
`,
};
