export default {
  id: 'arsikom-sram-dram',
  judul: 'Teknologi Memori: SRAM, DRAM, ROM, Flash',
  tipe: 'teks',
  xp: 20,
  materi: `
# Teknologi Memori: SRAM, DRAM, ROM, Flash 🧩

Di balik istilah "RAM 16 GB" dan "SSD 512 GB" ada beberapa teknologi sel memori yang berbeda. Pelajaran ini menjelaskan dua keluarga besar: memori **volatil** (isi hilang saat daya mati: SRAM, DRAM) dan **nonvolatil** (isi bertahan: ROM, flash).

## SRAM: cepat dan mahal

**SRAM** (*Static RAM*) menyimpan satu bit dalam sebuah **flip-flop** (sepasang inverter yang saling mengunci, ingat umpan balik di Bab 4), biasanya dibuat dari **6 transistor** (6T).

- **Kelebihan**: sangat cepat (±1 ns), tidak perlu di-refresh, desainnya sederhana.
- **Kekurangan**: 6 transistor per bit → boros ruang dan mahal. Kapasitas kecil.
- **Dipakai untuk**: register file dan **cache** CPU (L1, L2, L3).

Disebut "statik" karena data bertahan selama ada daya, tanpa perlu dibaca ulang.

## DRAM: besar dan murah

**DRAM** (*Dynamic RAM*) menyimpan satu bit sebagai **muatan di sebuah kapasitor** dengan **1 transistor** sebagai saklar (1T1C).

- **Kelebihan**: hanya 1 transistor + 1 kapasitor per bit → sangat padat dan murah (±100× lebih murah per bit daripada SRAM).
- **Kekurangan**:
  - Kapasitor **bocor**: muatan hilang dalam puluhan milidetik. Setiap baris harus **di-refresh** (dibaca dan ditulis ulang) secara berkala, biasanya tiap **64 ms**. Selama refresh, baris itu tidak bisa diakses.
  - Pembacaan bersifat **destruktif**: membaca sel menghabiskan muatannya sehingga harus ditulis balik.
  - Lebih lambat daripada SRAM (±50–100 ns untuk akses acak).
- **Dipakai untuk**: **memori utama** (RAM).

### Organisasi DRAM: baris dan kolom

Sel-sel DRAM tersusun dalam **matriks** (baris × kolom). Alamat dibagi menjadi alamat baris dan alamat kolom yang dikirim **bergantian** lewat pin yang sama (menghemat pin):

1. **RAS** (*Row Address Strobe*): pilih satu baris; seluruh baris dibaca ke *row buffer*.
2. **CAS** (*Column Address Strobe*): pilih kolom pada baris itu; data keluar.

Karena seluruh baris sudah ada di row buffer, mengakses lokasi lain di **baris yang sama** jauh lebih cepat (*row hit*) daripada pindah baris (*row miss*). Ini alasan DRAM bekerja baik untuk akses berurutan (burst) dan mengapa lokalitas spasial menolong sampai level DRAM.

Memori modern: **SDRAM** (sinkron dengan clock), **DDR** (*Double Data Rate*: mentransfer data pada tepi naik **dan** turun clock). Generasi DDR3 → DDR4 → DDR5 menaikkan laju transfer dan menurunkan tegangan. Kecepatan ditulis sebagai laju transfer (DDR4-3200 = 3200 juta transfer per detik, jadi clock sebenarnya 1600 MHz).

## SRAM vs DRAM

| Aspek | SRAM | DRAM |
| --- | --- | --- |
| Sel | Flip-flop 6T | 1 transistor + 1 kapasitor |
| Kecepatan | Sangat cepat (±1 ns) | Lebih lambat (±50–100 ns) |
| Refresh | Tidak perlu | **Wajib** (tiap ±64 ms) |
| Kepadatan | Rendah | Tinggi |
| Harga per bit | Mahal | Murah |
| Pemakaian | Cache, register | Memori utama |

## ROM dan memori nonvolatil

Memori yang isinya **bertahan tanpa daya**:

| Jenis | Cara ditulis | Catatan |
| --- | --- | --- |
| **ROM** (Mask ROM) | Dicetak saat produksi | Tidak bisa diubah |
| **PROM** | Diprogram sekali oleh pengguna | Satu kali tulis |
| **EPROM** | Dihapus dengan sinar UV, diprogram ulang | Jendela kaca di atas chip |
| **EEPROM** | Dihapus/ditulis secara listrik per byte | Lambat, untuk data konfigurasi kecil |
| **Flash** | Dihapus per **blok**, ditulis per halaman | Dominan sekarang: SSD, USB, kartu SD, firmware |

### Memori flash: NOR vs NAND

| Aspek | NOR flash | NAND flash |
| --- | --- | --- |
| Akses | Acak per byte (bisa mengeksekusi kode langsung) | Per halaman/blok (seperti disk) |
| Kepadatan dan harga | Rendah, mahal | **Tinggi, murah** |
| Pemakaian | Firmware, BIOS | **SSD, USB, kartu SD, ponsel** |

Ciri khas flash yang berdampak ke desain SSD:

- Sel **tidak bisa ditimpa langsung**: harus **dihapus per blok** (ratusan KiB) sebelum ditulis, lalu ditulis per halaman (4–16 KiB).
- **Daya tahan terbatas**: tiap sel hanya bisa dihapus ribuan kali (TLC ±1.000–3.000 siklus). Pengendali SSD memakai **wear leveling** (meratakan penulisan) dan **TRIM**.
- Menyimpan lebih dari satu bit per sel (SLC 1, MLC 2, TLC 3, QLC 4 bit): lebih murah per GB tetapi lebih lambat dan kurang tahan lama.

## Membangun memori dari chip kecil

Soal klasik: **membangun memori 64 KiB (65.536 × 8 bit) dari chip 16 K × 4 bit** (16.384 lokasi × 4 bit).

- **Lebar**: butuh 8 bit per lokasi, chip hanya 4 bit → pasang **2 chip berdampingan** (satu menyediakan 4 bit atas, satu 4 bit bawah).
- **Kedalaman**: 65.536 / 16.384 = **4 baris (bank)**.
- Total chip = 2 × 4 = **8 chip**.
- Alamat: 64 KiB → **16 bit**. 14 bit rendah (A13–A0) ke semua chip, 2 bit tinggi (A15–A14) masuk **decoder 2-ke-4** yang memilih bank.

~~~
A15 A14 ─► decoder 2→4 ─► CS bank0 | CS bank1 | CS bank2 | CS bank3
A13..A0 ─► semua chip
Setiap bank = 2 chip (16K×4) → 16K × 8 bit
~~~

Prinsip ini (lebar dengan memparalel, kedalaman dengan decoder) dipakai dalam modul DIMM nyata.

## Interleaving: menambah bandwidth

Satu chip DRAM punya jeda antar-akses. **Interleaving** menyebar alamat berurutan ke **beberapa bank** sehingga akses berurutan dapat tumpang tindih:

~~~
Alamat 0 → bank 0,  alamat 1 → bank 1,  alamat 2 → bank 2,  alamat 3 → bank 3,  alamat 4 → bank 0 ...
~~~

Selagi bank 0 menyiapkan data berikutnya, bank 1, 2, 3 sudah menjawab. Hasilnya bandwidth mendekati jumlah bank × kecepatan satu bank. Dual-channel memory pada PC memakai prinsip yang sama.

## Rangkuman

- **SRAM**: flip-flop 6T, cepat, mahal, tanpa refresh → cache dan register.
- **DRAM**: 1T1C, padat dan murah, **harus di-refresh** (±64 ms), dibaca lewat baris + kolom (RAS/CAS) → memori utama. DDR mentransfer dua kali per siklus clock.
- Nonvolatil: ROM → PROM → EPROM → EEPROM → **Flash**. NAND flash (SSD) dihapus per blok, daya tahan terbatas, memakai wear leveling.
- Membangun memori dari chip kecil: lebar lewat chip paralel, kedalaman lewat decoder bank (64 KiB dari 16K×4 = 8 chip).
- **Interleaving** menyebar alamat berurutan ke banyak bank untuk menaikkan bandwidth.
`,
};
