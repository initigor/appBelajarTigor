export default {
  id: 'komentar-variabel',
  judul: 'Komentar, const, dan let',
  tipe: 'js',
  xp: 10,
  materi: `
# Komentar & Variabel

## Komentar
Komentar di JS **sama persis dengan C**:

~~~js
// komentar satu baris (di Python: # komentar)

/* komentar
   beberapa baris */
~~~

## const dan let
Di C kamu wajib menulis tipe (\`int umur = 20;\`). Di Python cukup \`umur = 20\`. JavaScript ada di tengah-tengah: tipenya tidak ditulis, tapi kamu **wajib** memilih kata kunci \`const\` atau \`let\`.

~~~js
const nama = "Budi";   // tidak bisa diganti lagi (mirip const di C)
let semester = 1;      // boleh diganti
semester = 2;          // ✅ boleh, karena let
// nama = "Andi";      // ❌ TypeError: Assignment to constant variable.
~~~

| | C | Python | JavaScript |
| --- | --- | --- | --- |
| Bisa diubah | \`int x = 1;\` | \`x = 1\` | \`let x = 1;\` |
| Tidak bisa diubah | \`const int X = 1;\` | (konvensi \`X = 1\`) | \`const x = 1;\` |

**Aturan praktis:** pakai \`const\` dulu. Ganti ke \`let\` hanya kalau nilainya memang perlu berubah.

> Kamu mungkin melihat \`var\` di kode lama. Itu cara lama sebelum ada \`let\`/\`const\`. Hindari saja.

Nama variabel biasanya ditulis dengan **camelCase**: \`nilaiAkhir\`, bukan \`nilai_akhir\` seperti di Python.
`,
  tugas: `
1. Buat variabel \`nama\` dengan **\`const\`**, isi dengan namamu (string).
2. Buat variabel \`semester\` dengan **\`let\`**, isi dengan angka \`1\`.
3. Di baris berikutnya, **ubah** nilai \`semester\` menjadi \`2\`.
4. Cetak \`nama\` lalu \`semester\` dengan \`console.log\`.
`,
  kodeAwal: `// 1. buat const nama

// 2. buat let semester = 1

// 3. ubah semester menjadi 2

// 4. cetak nama dan semester
`,
  solusi: `const nama = "Budi";
let semester = 1;
semester = 2;
console.log(nama);
console.log(semester);
`,
  petunjuk: [
    'Deklarasi: const nama = "Budi"; dan let semester = 1;',
    'Mengubah nilai tidak perlu let lagi, cukup: semester = 2;',
    'Cetak dengan console.log(nama); dan console.log(semester);',
  ],
  tes: [
    {
      nama: '`nama` dibuat dengan const dan berisi string',
      cek(ctx) {
        const nama = ctx.variabel('nama');
        if (!ctx.pakai(/\bconst\s+nama\b/)) return '`nama` harus dideklarasikan dengan const.';
        if (typeof nama !== 'string' || nama.trim() === '') return '`nama` harus berisi string yang tidak kosong, misalnya "Budi".';
        return true;
      },
    },
    {
      nama: '`semester` dibuat dengan let lalu diubah menjadi 2',
      cek(ctx) {
        const s = ctx.variabel('semester');
        if (!ctx.pakai(/\blet\s+semester\s*=\s*1\b/)) return 'Buat dulu `let semester = 1;`.';
        if ((ctx.kodeBersih.match(/\bsemester\s*=(?!=)/g) ?? []).length < 2) return 'Setelah dibuat, ubah nilainya di baris lain: `semester = 2;`.';
        if (s !== 2) return `Nilai akhir \`semester\` adalah ${JSON.stringify(s)}, seharusnya 2.`;
        return true;
      },
    },
    {
      nama: 'Mencetak nama dan semester',
      cek(ctx) {
        ctx.harusLog(String(ctx.ambil('nama')));
        return ctx.harusLog('2');
      },
    },
  ],
};
