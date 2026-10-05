export default {
  id: 'arsikom-interupsi',
  judul: 'Interupsi dan Exception',
  tipe: 'teks',
  xp: 20,
  materi: `
# Interupsi dan Exception ⚡

Bayangkan kamu mengetik di keyboard sementara CPU sedang menghitung sesuatu yang lain. Bagaimana CPU tahu kamu menekan tombol? Ada dua cara, dan yang dipilih komputer modern menjelaskan banyak hal tentang sistem operasi dan efisiensi.

## Masalah: menunggu perangkat lambat

Perangkat I/O jauh lebih lambat daripada CPU. Keyboard mengirim paling banyak beberapa karakter per detik, sedangkan CPU mengerjakan miliaran instruksi per detik.

**Cara 1: polling.** CPU berulang kali bertanya, "Sudah ada data?"

~~~c
while (!(STATUS_KEYBOARD & 1)) { /* tunggu... */ }   // sibuk menunggu
char c = DATA_KEYBOARD;
~~~

CPU **terbuang menunggu** (*busy waiting*), padahal bisa mengerjakan hal lain.

**Cara 2: interupsi.** CPU bekerja seperti biasa. Ketika perangkat siap, **perangkat sendiri yang memberi tahu CPU** lewat sinyal interupsi. CPU menghentikan sementara pekerjaannya, melayani perangkat, lalu melanjutkan persis di tempat semula.

Analogi: polling = membuka pintu tiap lima menit untuk melihat apakah tamu sudah datang. Interupsi = memasang bel pintu.

## Jenis interupsi dan exception

| Jenis | Sumber | Sinkron? | Contoh |
| --- | --- | --- | --- |
| **Interupsi hardware (eksternal)** | Perangkat luar | Asinkron (kapan saja) | Keyboard, mouse, paket jaringan tiba, disk selesai |
| **Timer** | Pewaktu | Asinkron | Memicu penjadwalan proses oleh OS |
| **Exception / trap (internal)** | Instruksi yang sedang berjalan | **Sinkron** | Pembagian dengan nol, overflow, instruksi ilegal, *page fault* |
| **Software interrupt / system call** | Instruksi khusus | Sinkron | \`syscall\`, \`int 0x80\`: program meminta layanan OS |
| **Kegagalan hardware** | Perangkat keras | Asinkron | Galat paritas memori, daya hampir habis |

Istilah bervariasi antar-vendor, tetapi pembedaan penting: **interupsi** datang dari luar (tidak berkaitan dengan instruksi yang sedang berjalan), sedangkan **exception** berasal dari instruksi itu sendiri.

Pemanggilan fungsi OS seperti \`read()\` atau \`printf()\` pada akhirnya adalah *system call*: program mengeksekusi instruksi khusus yang berpindah ke mode kernel dengan prosedur yang sama seperti interupsi.

## Siklus interupsi

Setelah **setiap instruksi selesai**, CPU memeriksa apakah ada interupsi menunggu:

~~~
[Fetch] → [Decode] → [Execute] → ada interupsi & diizinkan?
                                    │tidak          │ya
                                    ▼               ▼
                              [instruksi berikut]  [Siklus interupsi]
~~~

Pada siklus interupsi, CPU:

1. **Menyimpan konteks**: PC (alamat instruksi berikutnya) dan **PSW/flag** disimpan, biasanya di **stack**. Register lain disimpan oleh *interrupt service routine* (ISR) bila dipakainya.
2. **Mencari alamat ISR** pada **tabel vektor interupsi**, yaitu array alamat yang diindeks nomor interupsi.
3. **Mengisi PC** dengan alamat ISR, sehingga eksekusi berlanjut di sana.
4. ISR melayani perangkat (misalnya membaca tombol yang ditekan).
5. ISR diakhiri dengan instruksi khusus (\`IRET\` / \`RTI\`) yang **memulihkan PC dan PSW** dari stack. Program asli melanjutkan seakan-akan tidak terjadi apa-apa.

~~~
Program utama                      ISR
 ...                                 │
 instruksi 100 ──── interupsi! ────► simpan konteks
 (PC=101 disimpan di stack)          layani perangkat
 instruksi 101 ◄──── IRET ──────────  pulihkan konteks
~~~

Keunggulan: program utama tidak perlu tahu bahwa ia pernah disela. Syaratnya, ISR **tidak boleh merusak** keadaan program (register harus disimpan dan dikembalikan).

### Tabel vektor interupsi

Pada x86, tabel ini disebut **IDT** (*Interrupt Descriptor Table*): 256 entri. Contoh: nomor 0 = pembagian dengan nol, 14 = *page fault*, 32+ = interupsi dari perangkat melalui pengontrol interupsi.

## Mengatur interupsi

- **Masking**: interupsi dapat dimatikan sementara (\`CLI\`/disable) untuk melindungi bagian kode kritis. Terlalu lama dimatikan akan membuat perangkat kehilangan data.
- **Prioritas**: bila beberapa interupsi muncul bersamaan, yang berprioritas lebih tinggi dilayani lebih dulu. Interupsi prioritas rendah **ditunda**. Pengontrol interupsi (PIC/APIC) menentukan urutannya.
- **Interupsi bersarang (nested)**: ISR prioritas rendah dapat disela interupsi prioritas tinggi, lalu dilanjutkan. Alternatif sederhana: nonaktifkan interupsi selama ISR dan layani berurutan.
- **Non-maskable interrupt (NMI)**: tidak bisa dimatikan, untuk kejadian kritis (kegagalan daya/hardware).

### Latensi interupsi

Waktu dari perangkat menaikkan sinyal sampai baris pertama ISR dieksekusi disebut **latensi interupsi**. Ia terdiri dari penyelesaian instruksi saat ini, penyimpanan konteks, dan pencarian vektor. Pada sistem waktu nyata (pengendali rem mobil, pesawat), latensi harus dijamin kecil.

## Hubungan dengan sistem operasi

Interupsi adalah fondasi sistem operasi modern:

- **Timer interrupt** memungkinkan OS merebut CPU dari proses mana pun secara berkala (*preemptive multitasking*) sehingga satu program yang macet tidak membekukan komputer.
- **System call** adalah pintu aman dari program pengguna ke kernel (perpindahan mode user → kernel).
- **Page fault** memberi tahu OS bahwa program mengakses halaman memori yang belum ada di RAM, sehingga OS memuatnya dari disk (Bab 8).
- **Perangkat I/O** (disk, jaringan) memberi tahu OS ketika transfer selesai, sehingga proses yang menunggu dapat dibangunkan.

## Contoh perhitungan: manfaat interupsi

Suatu program mencetak 1 baris yang butuh 1 ms CPU untuk menyiapkan data, lalu printer butuh 100 ms untuk mencetak.

- **Polling**: CPU menunggu 100 ms → CPU terpakai 1 ms dari 101 ms ≈ **1%**.
- **Interupsi**: setelah menyerahkan data ke printer, CPU mengerjakan tugas lain selama ±99 ms. Saat selesai, printer menginterupsi. Utilisasi CPU naik drastis.

Namun interupsi punya overhead (simpan/pulihkan konteks). Untuk perangkat yang sangat cepat (jaringan 100 Gbps) interupsi per paket terlalu mahal, sehingga dipakai **DMA** dan **interrupt coalescing** (Bab 9).

## Rangkuman

- **Polling** membuat CPU menunggu sia-sia; **interupsi** membiarkan perangkat memberi tahu CPU saat siap.
- Interupsi berasal dari luar (hardware, timer); **exception** berasal dari instruksi (bagi nol, page fault); **system call** adalah software interrupt.
- Siklus interupsi: setelah tiap instruksi, jika ada interupsi dan diizinkan → simpan PC + PSW (stack) → ambil alamat ISR dari tabel vektor → jalankan ISR → \`IRET\` memulihkan keadaan.
- Interupsi dapat di-mask, diprioritaskan, dan dibuat bersarang; NMI tidak bisa dimatikan.
- Interupsi menjadi dasar multitasking (timer), system call, memori virtual (page fault), dan I/O di sistem operasi.
`,
};
