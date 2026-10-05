export default {
  id: 'arsikom-cpu-mini',
  judul: 'Menjalankan Program di CPU Mini (Simulasi Python)',
  tipe: 'teks',
  xp: 25,
  materi: `
# Menjalankan Program di CPU Mini (Simulasi Python) 🧪

Cara terbaik memahami siklus instruksi adalah **menjalankannya sendiri**. Di pelajaran ini kita mendefinisikan CPU super kecil, menulis simulatornya dalam beberapa baris Python, lalu menelusuri program yang berjalan di atasnya. Hampir semua soal ujian Arsikom tentang "trace program" mengikuti pola persis seperti ini.

## Spesifikasi CPU mini

| Komponen | Spesifikasi |
| --- | --- |
| Memori | 16 sel × 8 bit (alamat 4 bit: 0–15) |
| Register | **AC** (akumulator, 8 bit), **PC** (4 bit), **IR** (8 bit) |
| Format instruksi | 8 bit: **[opcode 4 bit \\| alamat 4 bit]** |

Set instruksi (ISA):

| Opcode | Mnemonik | Arti |
| --- | --- | --- |
| \`0x1\` | \`LOAD x\` | AC ← M[x] |
| \`0x2\` | \`ADD x\` | AC ← AC + M[x] |
| \`0x3\` | \`STORE x\` | M[x] ← AC |
| \`0x4\` | \`SUB x\` | AC ← AC − M[x] |
| \`0x5\` | \`JMP x\` | PC ← x |
| \`0x6\` | \`JZ x\` | jika AC = 0 maka PC ← x |
| \`0xF\` | \`HALT\` | berhenti |

Kode mesin diperoleh dengan menggabungkan opcode dan alamat: \`LOAD 12\` → opcode 1, alamat 12 (0xC) → \`0x1C\`. Ini adalah **assembly → kode mesin** versi kecil.

## Simulator (siklus fetch-decode-execute)

~~~python
def jalankan(mem, jejak=False):
    pc, ac, langkah = 0, 0, 0
    while True:
        ir = mem[pc]; pc += 1                  # FETCH (PC naik saat fetch)
        op, alamat = ir >> 4, ir & 0xF         # DECODE: pecah opcode & alamat
        langkah += 1
        if   op == 0x1: ac = mem[alamat]                 # LOAD
        elif op == 0x2: ac = (ac + mem[alamat]) & 0xFF   # ADD  (8 bit)
        elif op == 0x3: mem[alamat] = ac                 # STORE
        elif op == 0x4: ac = (ac - mem[alamat]) & 0xFF   # SUB
        elif op == 0x5: pc = alamat                      # JMP
        elif op == 0x6:                                  # JZ
            if ac == 0: pc = alamat
        elif op == 0xF: break                            # HALT
        if jejak: print(f"PC={pc:2} IR={ir:02X} AC={ac}")
    return mem, langkah
~~~

Perhatikan kesesuaiannya dengan teori: \`ir = mem[pc]; pc += 1\` adalah fetch, \`ir >> 4\` dan \`ir & 0xF\` adalah decode (memisahkan field), dan rantai \`if/elif\` adalah *control unit* yang memilih tindakan.

## Program 1: M[14] = M[12] + M[13]

Memori awal: M[12] = 5, M[13] = 3.

| Alamat | Kode mesin | Assembly |
| --- | --- | --- |
| 0 | \`0x1C\` | \`LOAD 12\` |
| 1 | \`0x2D\` | \`ADD 13\` |
| 2 | \`0x3E\` | \`STORE 14\` |
| 3 | \`0xF0\` | \`HALT\` |

Penelusuran (sesudah tiap instruksi):

| Instruksi | PC setelah fetch | AC sesudah | Catatan |
| --- | --- | --- | --- |
| \`LOAD 12\` | 1 | 5 | AC ← M[12] |
| \`ADD 13\` | 2 | 8 | AC ← 5 + 3 |
| \`STORE 14\` | 3 | 8 | M[14] ← 8 |
| \`HALT\` | 4 | 8 | berhenti |

Akhirnya **M[14] = 8**. Program ini setara dengan \`c = a + b;\` dalam C.

## Program 2: perkalian lewat penjumlahan berulang (loop!)

CPU mini tidak punya instruksi perkalian. Hitung **3 × 4** dengan menjumlahkan 3 sebanyak 4 kali.

Data: M[12] = 3 (pengali), M[13] = 0 (hasil), M[14] = 4 (penghitung), M[15] = 1 (konstanta satu).

| Alamat | Kode mesin | Assembly | Keterangan |
| --- | --- | --- | --- |
| 0 | \`0x1E\` | \`LOAD 14\` | AC ← penghitung |
| 1 | \`0x68\` | \`JZ 8\` | jika penghitung = 0, selesai |
| 2 | \`0x4F\` | \`SUB 15\` | AC ← penghitung − 1 |
| 3 | \`0x3E\` | \`STORE 14\` | simpan penghitung baru |
| 4 | \`0x1D\` | \`LOAD 13\` | AC ← hasil |
| 5 | \`0x2C\` | \`ADD 12\` | AC ← hasil + 3 |
| 6 | \`0x3D\` | \`STORE 13\` | simpan hasil |
| 7 | \`0x50\` | \`JMP 0\` | kembali ke awal loop |
| 8 | \`0xF0\` | \`HALT\` | |

Ekuivalen C:

~~~c
int hasil = 0, hitung = 4;
while (hitung != 0) {
    hitung = hitung - 1;
    hasil = hasil + 3;
}
~~~

Nilai pada awal tiap putaran:

| Putaran | penghitung (M[14]) | hasil (M[13]) |
| --- | --- | --- |
| awal | 4 | 0 |
| 1 | 3 | 3 |
| 2 | 2 | 6 |
| 3 | 1 | 9 |
| 4 | 0 | 12 |
| 5 | LOAD 14 → AC = 0, \`JZ 8\` melompat ke \`HALT\` | **12** |

Hasil akhir **M[13] = 12**. Total instruksi yang dieksekusi: 4 putaran × 8 instruksi + 3 instruksi terakhir (\`LOAD\`, \`JZ\`, \`HALT\`) = **35 instruksi**. Jika setiap instruksi dikerjakan dalam 4 siklus clock (CPI = 4), program butuh 140 siklus.

## Apa yang diajarkan simulasi ini?

1. **Program dan data berbagi memori yang sama** (von Neumann). Alamat 0–8 berisi instruksi, alamat 12–15 berisi data, keduanya hanyalah angka 8 bit. Jika \`STORE 3\` dijalankan, ia menimpa instruksi \`HALT\`. Program yang berubah sendiri (*self-modifying code*) dan kelemahan keamanan buffer overflow bersumber dari sini.
2. **Lompatan adalah penugasan pada PC.** \`while\`, \`if\`, dan \`for\` dalam bahasa tingkat tinggi diterjemahkan menjadi pola \`JZ\` dan \`JMP\`.
3. **Kekuatan komputasi muncul dari hal yang sangat sederhana.** Tujuh instruksi saja sudah cukup menghitung perkalian lewat loop. CPU nyata hanya menambah banyak instruksi, register, dan kecepatan.
4. **Lebar bit membatasi.** \`& 0xFF\` memastikan AC berukuran 8 bit: 200 + 100 pada CPU ini menghasilkan 44 (overflow), sama seperti yang dibahas di Bab 3.
5. **CPI dan jumlah instruksi bisa dihitung.** Rumus waktu CPU = IC × CPI × T dapat langsung diterapkan.

## Latihan mandiri (tulis di kertas)

1. Tulis program untuk menghitung M[15] = M[12] − M[13] (gunakan LOAD, SUB, STORE) dan ubah ke kode mesin.
2. Jalankan program 2 dengan M[14] = 0 sejak awal. Berapa instruksi yang dieksekusi? (\`LOAD\`, \`JZ\`, \`HALT\` = 3.)
3. Mengapa alamat memori pada CPU ini hanya 4 bit? Berapa lokasi yang bisa dialamati? (2⁴ = 16.)

Cobalah menjalankan simulator di atas di Python di komputermu, lalu ubah programnya. Menulis emulator CPU kecil adalah proyek klasik untuk benar-benar memahami arsitektur.

## Rangkuman

- Siklus fetch-decode-execute dapat disimulasikan dengan beberapa baris kode: **fetch** = \`ir = mem[pc]; pc += 1\`, **decode** = memisahkan opcode dan alamat, **execute** = memilih tindakan.
- Kode mesin dibentuk dari opcode dan operand: \`LOAD 12\` = \`0x1C\`.
- Program dan data berbagi satu memori; lompat/loop = menulis ke PC. \`while\` dibuat dari \`JZ\` dan \`JMP\`.
- Jumlah instruksi dan CPI memungkinkan menghitung waktu eksekusi; lebar register menentukan kapan overflow terjadi.
`,
};
