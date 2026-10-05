export default {
  id: 'arsikom-flipflop',
  judul: 'Rangkaian Sekuensial: Latch dan Flip-Flop',
  tipe: 'teks',
  xp: 25,
  materi: `
# Rangkaian Sekuensial: Latch dan Flip-Flop 🔁

Rangkaian kombinasional tidak bisa **mengingat**. Padahal komputer perlu menyimpan data (register, memori) dan mengingat "sedang di langkah ke berapa" (program counter, kontrol). Untuk itu dibutuhkan rangkaian **sekuensial**: keluarannya bergantung pada masukan **dan keadaan sebelumnya**.

Rahasia memori satu bit adalah **umpan balik** (*feedback*): keluaran gerbang disambungkan kembali ke masukannya sendiri, sehingga rangkaian "mengunci" suatu nilai.

## SR latch: memori 1 bit paling sederhana

Dua gerbang NOR yang keluarannya saling disilangkan ke masukan lawannya:

~~~
Q  = NOR(R, Q')
Q' = NOR(S, Q)
~~~

| S | R | Q berikutnya | Arti |
| --- | --- | --- | --- |
| 0 | 0 | tidak berubah | **Tahan** (memori) |
| 1 | 0 | 1 | **Set** |
| 0 | 1 | 0 | **Reset** |
| 1 | 1 | tidak valid | Dilarang: Q dan Q' sama-sama 0 |

Ketika S = R = 0, umpan balik menjaga nilai Q yang terakhir. Itulah ingatan. Kombinasi S = R = 1 dilarang karena keluaran tidak lagi saling berlawanan, dan jika kedua masukan kembali ke 0 bersamaan, hasilnya tak menentu.

## Gated D latch: menambahkan "izin tulis"

Latch SR sulit dipakai karena dua masukan yang bisa bertabrakan. **D latch** memiliki satu data **D** dan satu **Enable (E/clock)**:

- E = 1 → latch **transparan**: Q mengikuti D.
- E = 0 → latch **menahan** nilai terakhir.

Kelemahan: selama E = 1, perubahan D langsung merambat ke Q (sensitif **level**). Jika Q diumpankan ke rangkaian yang kembali ke D, bisa terjadi osilasi atau balapan data (*race*). Prosesor sinkron butuh sesuatu yang lebih presisi.

## D flip-flop: sensitif tepi (edge-triggered)

**Flip-flop D** hanya memotret nilai D pada **satu saat tertentu**: tepi naik clock (perubahan 0 → 1). Di luar saat itu, perubahan D diabaikan.

~~~
clock  ___┌───┐___┌───┐___
          ↑       ↑          tepi naik: nilai D ditangkap
D      ──X───────X──────
Q      ──────Y─────────Y──   Q baru muncul sesaat setelah tepi
~~~

Biasanya dibangun dari dua D latch berseri (**master-slave**) dengan enable berlawanan: master transparan saat clock rendah, slave saat clock tinggi, sehingga data bergeser satu tahap per siklus clock dan tidak pernah "tembus" langsung.

Persamaan karakteristik: **Q(berikutnya) = D**. Itu saja: flip-flop D menyalin D ke Q pada tepi clock.

### Jenis flip-flop lain

| Jenis | Persamaan | Perilaku |
| --- | --- | --- |
| **D** | Q⁺ = D | Menyalin D |
| **T** (toggle) | Q⁺ = T ⊕ Q | T=1 membalik Q, T=0 menahan; dasar counter |
| **JK** | Q⁺ = JQ' + K'Q | J=K=0 tahan, J=1,K=0 set, J=0,K=1 reset, J=K=1 toggle (tak ada keadaan terlarang) |

D flip-flop yang paling banyak dipakai di desain digital modern karena paling sederhana.

Kebanyakan flip-flop punya masukan tambahan: **Reset** (atau Preset) **asinkron** untuk memaksa Q = 0 (atau 1) seketika, misalnya saat prosesor dinyalakan.

## Waktu: setup, hold, dan clock-to-Q

Flip-flop nyata punya syarat waktu di sekitar tepi clock:

- **Setup time (t_setup)**: D harus **stabil sebelum** tepi clock selama minimal waktu ini.
- **Hold time (t_hold)**: D harus **tetap stabil setelah** tepi clock selama minimal waktu ini.
- **Clock-to-Q (t_cq)**: waktu dari tepi clock sampai Q benar-benar berubah.

Jika D berubah dalam jendela terlarang, flip-flop bisa jatuh ke keadaan **metastabil** (tegangan di antara 0 dan 1 dalam waktu tak tentu). Itu sebabnya sinyal asinkron dari luar (misalnya tombol) dilewatkan dua flip-flop berurutan sebelum dipakai (*synchronizer*).

### Batas kecepatan clock

Antara dua flip-flop berurutan ada logika kombinasional. Sebuah data harus: keluar dari flip-flop pertama (t_cq), melewati logika (t_logika terlama), dan tiba sebelum jendela setup flip-flop berikutnya.

~~~
Periode clock  T  ≥  t_cq + t_logika(maks) + t_setup
Frekuensi maks f  =  1 / T
~~~

**Contoh:** t_cq = 0,5 ns, jalur logika terlama 3,5 ns, t_setup = 0,5 ns.

~~~
T ≥ 0,5 + 3,5 + 0,5 = 4,5 ns   →   f ≤ 1 / 4,5 ns ≈ 222 MHz
~~~

Jalur logika terpanjang (*critical path*) menentukan kecepatan seluruh chip. Menaikkan frekuensi berarti memperpendek critical path, salah satu alasan pipeline (Bab 7) memecah pekerjaan menjadi tahap-tahap kecil.

## Latch vs flip-flop: ringkasan

| Aspek | Latch | Flip-flop |
| --- | --- | --- |
| Pemicu | **Level** clock (E = 1) | **Tepi** clock |
| Transparan? | Ya, selama E = 1 | Tidak |
| Dipakai untuk | Blok bangunan, cache/memori tertentu | Register, counter, kontrol (desain sinkron) |

## Rangkuman

- Rangkaian **sekuensial** = keluaran bergantung masukan dan keadaan sebelumnya; ingatan berasal dari **umpan balik**.
- **SR latch**: S=1 set, R=1 reset, 00 tahan, 11 terlarang. **D latch**: transparan saat E=1.
- **D flip-flop** menangkap D hanya pada **tepi** clock (Q⁺ = D); T flip-flop toggle (Q⁺ = T⊕Q); JK tidak punya keadaan terlarang.
- Syarat waktu: **setup**, **hold**, **clock-to-Q**. Pelanggaran dapat menyebabkan metastabilitas.
- Periode clock minimum: T ≥ t_cq + t_logika(maks) + t_setup. Critical path menentukan frekuensi maksimum.
`,
};
