export default {
  id: 'arsikom-register-counter',
  judul: 'Register, Counter, dan Mesin Keadaan (FSM)',
  tipe: 'teks',
  xp: 25,
  materi: `
# Register, Counter, dan Mesin Keadaan (FSM) 🧱

Flip-flop adalah satu bit. Dengan menyusun banyak flip-flop dan sedikit logika, kita mendapat bagian-bagian CPU yang akrab: **register**, **counter** (basis *program counter*), dan **mesin keadaan** (basis *unit kontrol*).

## Register: n flip-flop berbagi clock

**Register n bit** = n buah D flip-flop dengan clock yang sama. Pada tepi clock, semua n bit ditangkap serentak.

~~~
 D3 D2 D1 D0
  │  │  │  │
 [FF][FF][FF][FF] ◄── clock bersama
  │  │  │  │
 Q3 Q2 Q1 Q0
~~~

Namun register biasanya tidak menangkap data **setiap** siklus, hanya saat diperintah. Solusinya: sebuah **MUX di depan tiap flip-flop** dengan sinyal **Load**:

~~~
D flip-flop menerima:  Load = 1 → data baru
                       Load = 0 → keluaran Q sendiri (menahan nilai)
~~~

Register seperti ini muncul di mana-mana di CPU: register umum (R0–R31), **PC** (program counter), **IR** (instruction register), **MAR/MBR** (Bab 5).

### Register file

Sekumpulan register (misalnya 32 register × 32 bit) dengan banyak "pintu":

- **Tulis**: nomor register tujuan dipilih oleh **decoder** yang mengaktifkan Load register tersebut.
- **Baca**: nomor register dipilih oleh **MUX 32-ke-1** (satu per bit). CPU biasanya memiliki **2 port baca** dan **1 port tulis**, supaya satu instruksi \`ADD R3, R1, R2\` dapat membaca R1 dan R2 sekaligus dan menulis R3.

## Shift register

Register yang dapat **menggeser** isinya satu posisi tiap clock: keluaran tiap flip-flop menjadi masukan flip-flop berikutnya.

~~~
Serial in ─► [FF3] ─► [FF2] ─► [FF1] ─► [FF0] ─► Serial out
~~~

| Jenis | Masukan → Keluaran | Contoh pemakaian |
| --- | --- | --- |
| SISO | serial → serial | Penunda sinyal |
| SIPO | serial → paralel | Penerima UART/SPI: bit datang satu per satu menjadi 1 byte |
| PISO | paralel → serial | Pengirim UART/SPI: byte dikirim bit demi bit |

Geser kiri satu posisi sama dengan **× 2**, geser kanan **÷ 2**, itulah hardware di balik operasi shift di ALU dan di perkalian/pembagian (Bab 3).

## Counter

**Counter** adalah register yang nilainya **naik (atau turun) satu** tiap pulsa clock.

### Ripple (asinkron) counter

Susun **T flip-flop** (T = 1, selalu toggle) dengan clock tahap berikutnya diambil dari keluaran tahap sebelumnya. Tiap tahap **membagi frekuensi dua**.

~~~
clk ─► [T FF0] Q0 ─► [T FF1] Q1 ─► [T FF2] Q2
~~~

Barisan 3-bit: 000 → 001 → 010 → 011 → 100 → 101 → 110 → 111 → 000 …

Sederhana, tetapi tiap tahap menambah delay (efek *ripple*), sehingga hasilnya sesaat salah ketika berpindah banyak bit (111 → 000).

### Synchronous counter

Semua flip-flop memakai **clock yang sama**, dan logika menentukan flip-flop mana yang harus toggle. Aturan counter biner naik: bit ke-i toggle bila **semua bit di bawahnya bernilai 1**:

~~~
T0 = 1
T1 = Q0
T2 = Q1 · Q0
T3 = Q2 · Q1 · Q0
~~~

Perubahan terjadi serentak, jauh lebih cepat dan bersih. Counter pada CPU (PC, timer) bersifat sinkron.

### Variasi

- **Counter modulo-N** (misalnya mod-10 untuk BCD): reset ke 0 setelah mencapai N−1.
- **Up/down counter**, **counter dengan load** (isi nilai awal, dipakai untuk **lompatan** pada PC).
- **Ring counter** dan **Johnson counter**: shift register melingkar yang menghasilkan pola bit berputar.

Ingat: PC adalah counter dengan load. Biasanya +4 (instruksi berikutnya), tetapi bisa diisi alamat baru oleh instruksi lompat.

## Mesin keadaan hingga (FSM)

**Finite State Machine** adalah model untuk rangkaian sekuensial umum. Strukturnya selalu sama:

~~~
              ┌────────────────────────┐
  masukan ───►│ logika keadaan-         │──► keadaan berikutnya
              │ berikutnya (kombin.)    │         │
              └────────▲───────────────┘         ▼
                       │                  ┌──────────────┐
                       └──────────────────│ register     │ ◄─ clock
                         keadaan sekarang │ keadaan (FF) │
                                          └──────┬───────┘
                                                 ▼
                         masukan ──► [logika keluaran] ──► keluaran
~~~

- **Register keadaan** menyimpan keadaan sekarang.
- **Logika keadaan-berikutnya** (kombinasional) menentukan keadaan berikutnya dari keadaan sekarang dan masukan.
- **Logika keluaran** menghasilkan keluaran.

Dua gaya:

| Gaya | Keluaran bergantung pada |
| --- | --- |
| **Moore** | Keadaan sekarang saja (stabil, mudah) |
| **Mealy** | Keadaan sekarang **dan** masukan (bisa lebih sedikit keadaan, reaksi lebih cepat) |

### Contoh: pendeteksi urutan "101" (Moore)

Keluaran menyala saat tiga bit terakhir yang diterima adalah 1-0-1.

| Keadaan | Arti | Masukan 0 → | Masukan 1 → | Keluaran |
| --- | --- | --- | --- | --- |
| S0 | belum ada yang cocok | S0 | S1 | 0 |
| S1 | sudah melihat "1" | S2 | S1 | 0 |
| S2 | sudah melihat "10" | S0 | S3 | 0 |
| S3 | sudah melihat "101" | S2 | S1 | **1** |

Dengan 4 keadaan, diperlukan **2 flip-flop** (2² = 4). Kode keadaan: S0 = 00, S1 = 01, S2 = 10, S3 = 11. Untuk N keadaan dibutuhkan ⌈log₂ N⌉ flip-flop.

Memproses masukan 1,0,1,1,0,1: S0 →(1) S1 →(0) S2 →(1) **S3 (keluaran 1)** →(1) S1 →(0) S2 →(1) **S3 (keluaran 1)**. Perhatikan pola "101" tumpang tindih (bit terakhir dipakai ulang); dari S3 masukan 1 kembali ke S1.

### Kenapa FSM penting bagi Arsikom?

**Unit kontrol CPU adalah FSM**: keadaannya adalah tahap siklus instruksi (fetch, decode, execute, ...), masukannya adalah opcode dan flag, keluarannya adalah sinyal kontrol yang mengatur register, ALU, dan memori (Bab 5 dan 7). Controller memori, pengendali lampu lalu lintas, dan protokol komunikasi semuanya FSM.

## Rangkuman

- **Register** = n D flip-flop berbagi clock, dengan sinyal Load (MUX di tiap flip-flop). **Register file** = banyak register + decoder (tulis) + MUX (baca), umumnya 2 port baca dan 1 port tulis.
- **Shift register** menggeser bit tiap clock (SIPO/PISO untuk komunikasi serial); geser = × atau ÷ 2.
- **Counter** biner: bit ke-i toggle bila semua bit di bawahnya 1. Counter sinkron lebih cepat dan bersih dibanding ripple. PC adalah counter dengan load.
- **FSM** = register keadaan + logika keadaan-berikutnya + logika keluaran. Moore: keluaran dari keadaan; Mealy: keadaan + masukan. N keadaan butuh ⌈log₂ N⌉ flip-flop.
- Unit kontrol CPU pada dasarnya sebuah FSM.
`,
};
