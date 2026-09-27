export default {
  id: 'tipe-data',
  judul: 'Tipe Data & typeof',
  tipe: 'js',
  xp: 15,
  materi: `
# Tipe Data di JavaScript

JavaScript punya beberapa tipe dasar. Bandingkan dengan yang sudah kamu kenal:

| JavaScript | Contoh | Mirip di C | Mirip di Python |
| --- | --- | --- | --- |
| \`number\` | \`20\`, \`3.14\`, \`-7\` | \`int\` **dan** \`double\` sekaligus | \`int\` dan \`float\` |
| \`string\` | \`"halo"\`, \`'halo'\` | \`char[]\` | \`str\` |
| \`boolean\` | \`true\`, \`false\` | \`bool\` (\`stdbool.h\`) | \`True\`, \`False\` (huruf kecil di JS!) |
| \`undefined\` | variabel yang belum diberi nilai | (sampah memori) | tidak ada padanan pas |
| \`null\` | "sengaja dikosongkan" | \`NULL\` | \`None\` |

Yang penting: JS **tidak membedakan int dan float**. Semua angka bertipe \`number\`.

## typeof
Untuk mengecek tipe sebuah nilai, pakai \`typeof\`. Ini mirip \`type()\` di Python:

~~~js
console.log(typeof 20);        // "number"
console.log(typeof 3.14);      // "number"
console.log(typeof "halo");    // "string"
console.log(typeof true);      // "boolean"

let kosong;                     // belum diberi nilai
console.log(kosong);            // undefined
console.log(typeof kosong);     // "undefined"

console.log(typeof null);       // "object"  ← keanehan JS!
~~~

⚠️ \`typeof null\` menghasilkan \`"object"\`. Ini bug lama JS yang tidak pernah diperbaiki demi kompatibilitas. Hafalkan saja.
`,
  tugas: `
Buat variabel-variabel berikut:

| Nama | Isi |
| --- | --- |
| \`umur\` | sebuah **number** |
| \`jurusan\` | sebuah **string** |
| \`aktif\` | sebuah **boolean** |
| \`pacar\` | \`null\` 😅 |
| \`nilaiUjian\` | dideklarasikan dengan \`let\` **tanpa** nilai (jadi \`undefined\`) |

Lalu cetak \`typeof\` dari **kelima** variabel itu, satu per baris, sesuai urutan tabel.
`,
  kodeAwal: `const umur = 20;
// lanjutkan...

console.log(typeof umur);
`,
  solusi: `const umur = 20;
const jurusan = "Teknik Informatika";
const aktif = true;
const pacar = null;
let nilaiUjian;

console.log(typeof umur);
console.log(typeof jurusan);
console.log(typeof aktif);
console.log(typeof pacar);
console.log(typeof nilaiUjian);
`,
  petunjuk: [
    'Boolean di JS ditulis huruf kecil: true / false (bukan True seperti Python).',
    'Variabel tanpa nilai: cukup tulis let nilaiUjian;',
    'Hasil yang diharapkan di console: number, string, boolean, object, undefined.',
  ],
  tes: [
    {
      nama: 'Variabel umur, jurusan, aktif, pacar memiliki tipe yang benar',
      cek(ctx) {
        const harapan = { umur: 'number', jurusan: 'string', aktif: 'boolean' };
        for (const [n, tipe] of Object.entries(harapan)) {
          const v = ctx.variabel(n);
          if (typeof v !== tipe) return `\`${n}\` seharusnya ${tipe}, tapi tipenya ${typeof v}.`;
        }
        if (!('pacar' in ctx.scope)) return 'Variabel `pacar` belum dibuat.';
        if (ctx.ambil('pacar') !== null) return '`pacar` harus bernilai null.';
        return true;
      },
    },
    {
      nama: '`nilaiUjian` dideklarasikan tanpa nilai',
      cek(ctx) {
        if (!('nilaiUjian' in ctx.scope)) return 'Variabel `nilaiUjian` belum dibuat. Tulis: let nilaiUjian;';
        if (ctx.ambil('nilaiUjian') !== undefined) return '`nilaiUjian` harus dibiarkan tanpa nilai (undefined).';
        return true;
      },
    },
    {
      nama: 'Mencetak typeof kelima variabel sesuai urutan',
      cek(ctx) {
        const harapan = ['number', 'string', 'boolean', 'object', 'undefined'];
        const tipeLog = ctx.logs.filter((l) => harapan.includes(l));
        if (tipeLog.join() !== harapan.join()) {
          return `Console seharusnya mencetak: ${harapan.join(', ')}. Yang tercetak: ${ctx.logs.join(', ') || '(kosong)'}.`;
        }
        if (!ctx.pakai(/typeof\s+\(?\s*pacar/)) return 'Cetak dengan typeof, misalnya console.log(typeof pacar);';
        return true;
      },
    },
  ],
};
