export default {
  id: 'arsikom-stack-prosedur',
  judul: 'Stack dan Pemanggilan Prosedur',
  tipe: 'teks',
  xp: 25,
  materi: `
# Stack dan Pemanggilan Prosedur 📚

Fungsi adalah abstraksi terpenting di pemrograman. Tapi CPU tidak mengenal "fungsi", hanya instruksi dan lompatan. Pelajaran ini menjelaskan bagaimana \`rekursi\`, variabel lokal, dan \`return\` diwujudkan dengan satu struktur sederhana: **stack**.

## Apa itu stack?

**Stack** adalah daerah memori dengan aturan **LIFO** (*Last In, First Out*): yang terakhir masuk adalah yang pertama keluar. Register khusus **SP** (*stack pointer*) selalu menunjuk puncaknya.

- \`PUSH x\`: kurangi SP (stack **tumbuh ke alamat lebih rendah** pada x86, ARM, MIPS), lalu tulis x di SP.
- \`POP r\`: baca isi di SP ke r, lalu naikkan SP.

~~~
alamat tinggi
  ┌──────────┐
  │   ...    │
  ├──────────┤
  │  data A  │   ← dimasukkan pertama
  ├──────────┤
  │  data B  │
  ├──────────┤
  │  data C  │  ← SP (puncak)
  └──────────┘
alamat rendah        stack tumbuh ke bawah ↓
~~~

Pada x86-64 satu \`push\` mengurangi SP sebesar 8 byte.

## Memanggil dan kembali dari fungsi

Saat \`f\` memanggil \`g\`, CPU harus mengingat **ke mana kembali** setelah \`g\` selesai.

| Instruksi | Tindakan |
| --- | --- |
| **x86** \`call g\` | Dorong alamat instruksi berikutnya (alamat kembali) ke stack, lalu PC ← g |
| **x86** \`ret\` | Ambil alamat dari puncak stack ke PC |
| **MIPS** \`jal g\` | Simpan alamat kembali di register \`$ra\`, PC ← g |
| **MIPS** \`jr $ra\` | PC ← \`$ra\` |

MIPS menyimpan alamat kembali di **register**. Jika \`g\` memanggil fungsi lain, \`$ra\` akan tertimpa, jadi \`g\` harus **menyimpan \`$ra\` di stack** lebih dulu.

## Stack frame (bingkai tumpukan)

Setiap pemanggilan fungsi mendapat satu **frame** di stack, berisi hal-hal milik pemanggilan itu:

~~~
alamat tinggi
 ┌─────────────────────────┐
 │ argumen (jika di stack) │
 ├─────────────────────────┤
 │ alamat kembali          │  ← diisi call/jal
 ├─────────────────────────┤
 │ nilai register tersimpan│  ← mis. $s0, $ra, base pointer lama
 ├─────────────────────────┤
 │ variabel lokal          │
 ├─────────────────────────┤  ← SP
alamat rendah
~~~

Saat fungsi selesai, frame dilepas hanya dengan **menaikkan SP kembali**: tidak ada penghapusan data, memorinya cukup dianggap kosong. Itu sebabnya variabel lokal "hilang" setelah fungsi selesai, dan membuka alamatnya sesudah itu adalah bug klasik di C (*dangling pointer*).

## Konvensi pemanggilan (calling convention)

Agar fungsi yang ditulis dan dikompilasi terpisah dapat bekerja sama, ada kesepakatan:

- Argumen pertama dilewatkan di register (\`$a0\`–\`$a3\` di MIPS; \`rdi\`, \`rsi\`, \`rdx\`, \`rcx\`, \`r8\`, \`r9\` di x86-64 System V), sisanya di stack.
- Nilai hasil dikembalikan di \`$v0\` (MIPS) atau \`rax\` (x86-64).
- **Caller-saved** (\`$t0–$t9\`): fungsi yang dipanggil bebas menimpanya. Pemanggil yang menyimpannya bila butuh.
- **Callee-saved** (\`$s0–$s7\`, \`$ra\`, \`$sp\`): fungsi yang dipanggil harus mengembalikan nilainya seperti semula, jadi bila memakainya ia **menyimpan lalu memulihkannya** di stack.

## Contoh: fungsi bukan-daun di MIPS (rekursi faktorial)

~~~c
int fact(int n) {
    if (n < 1) return 1;
    else return n * fact(n - 1);
}
~~~

~~~
fact:
    addi $sp, $sp, -8        # sediakan 8 byte di stack
    sw   $ra, 4($sp)         # simpan alamat kembali
    sw   $a0, 0($sp)         # simpan argumen n

    slti $t0, $a0, 1         # t0 = (n < 1)
    beq  $t0, $zero, L1      # jika n >= 1, ke L1
    addi $v0, $zero, 1       # hasil = 1
    addi $sp, $sp, 8         # lepas frame
    jr   $ra                 # kembali

L1: addi $a0, $a0, -1        # argumen n-1
    jal  fact                # fact(n-1)  (hasil di $v0)
    lw   $a0, 0($sp)         # pulihkan n
    lw   $ra, 4($sp)         # pulihkan alamat kembali
    addi $sp, $sp, 8         # lepas frame
    mul  $v0, $a0, $v0       # n * fact(n-1)
    jr   $ra
~~~

Setiap panggilan rekursif menumpuk satu frame (8 byte). \`fact(4)\` membuat 5 frame sebelum mulai kembali satu per satu dengan mengalikan hasil. Tanpa stack, rekursi mustahil karena nilai \`n\` setiap level tidak punya tempat disimpan.

## Kedalaman rekursi dan stack overflow

Stack berukuran terbatas (biasanya 1–8 MiB per thread). Rekursi tanpa kondisi berhenti, atau kedalaman yang terlalu besar, menghabiskannya dan menyebabkan **stack overflow**:

- Python: \`RecursionError\` (batas default ±1000 level).
- Java: \`StackOverflowError\`.
- C: *segmentation fault*.

## Stack dan keamanan: buffer overflow

Karena alamat kembali berada di stack **di atas** variabel lokal, array lokal yang ditulis melebihi batasnya akan menimpa alamat kembali:

~~~c
void rentan(char *input) {
    char buf[16];
    strcpy(buf, input);     // tidak mengecek panjang!
}
~~~

Jika \`input\` lebih dari 16 byte, kelebihannya menimpa alamat kembali. Penyerang memilih byte-byte itu sehingga \`ret\` melompat ke kode buatannya. Karena stack hanyalah memori dan instruksi pun hanya data (von Neumann), ini sangat mungkin. Pertahanan modern:

- **Stack canary**: nilai rahasia disisipkan sebelum alamat kembali dan diperiksa sebelum \`ret\`.
- **NX / DEP**: stack ditandai tidak dapat dieksekusi.
- **ASLR**: alamat memori diacak tiap menjalankan program.
- Menulis kode aman: pakai \`strncpy\`, \`snprintf\`, atau bahasa yang memeriksa batas array.

## Rangkuman

- **Stack** = area memori LIFO yang ditunjuk **SP**; biasanya tumbuh ke alamat rendah. \`PUSH\` mengurangi SP lalu menulis; \`POP\` membaca lalu menaikkan SP.
- Pemanggilan fungsi menyimpan **alamat kembali** (x86: di stack lewat \`call\`/\`ret\`; MIPS: di \`$ra\` lewat \`jal\`/\`jr\`).
- Setiap pemanggilan punya **stack frame**: alamat kembali, register tersimpan, variabel lokal. Dibebaskan dengan menaikkan SP.
- **Konvensi pemanggilan**: argumen di register, hasil di \`$v0\`/\`rax\`, pembagian caller-saved vs callee-saved.
- Rekursi bergantung pada stack; kedalaman berlebih menyebabkan **stack overflow**; array lokal yang melewati batas menimpa alamat kembali (**buffer overflow**).
`,
};
