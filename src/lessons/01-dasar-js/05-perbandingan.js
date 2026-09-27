export default {
  id: 'perbandingan-logika',
  judul: '=== vs == dan Operator Logika',
  tipe: 'js',
  xp: 15,
  materi: `
# Perbandingan: === vs ==

JS punya **dua** operator "sama dengan":

| Operator | Nama | Cara kerja |
| --- | --- | --- |
| \`===\` | sama ketat | nilai **dan** tipe harus sama |
| \`==\` | sama longgar | tipe dikonversi dulu, baru dibandingkan |

~~~js
console.log(5 === 5);    // true
console.log(5 === "5");  // false  (number vs string)
console.log(5 == "5");   // true   😱 "5" diubah jadi 5 dulu
console.log(0 == "");    // true   😱😱
~~~

\`==\` sering menghasilkan kejutan. **Aturan emas: selalu pakai \`===\` dan \`!==\`.** Di Python, \`5 == "5"\` hasilnya \`False\`, sehingga \`===\` adalah yang paling mirip dengan \`==\` di Python.

Operator lainnya sama dengan C: \`<\`, \`>\`, \`<=\`, \`>=\`, dan \`!==\` (tidak sama ketat).

# Operator logika
Sama dengan C, beda tulisan dengan Python:

| C / JavaScript | Python |
| --- | --- |
| \`&&\` | \`and\` |
| \`\\|\\|\` | \`or\` |
| \`!\` | \`not\` |

~~~js
const umur = 20;
const punyaKTP = true;
console.log(umur >= 17 && punyaKTP);  // true
console.log(umur < 13 || umur > 60);  // false
console.log(!punyaKTP);               // false
~~~

⚠️ Di Python kamu bisa menulis \`1 < x < 10\`. Di JS **tidak bisa** (hasilnya aneh). Tulis \`x > 1 && x < 10\`.
`,
  tugas: `
Sudah ada \`const angka = 5;\` dan \`const teks = "5";\`. Buat:

| Variabel | Isi |
| --- | --- |
| \`samaLonggar\` | \`angka\` dibandingkan dengan \`teks\` memakai \`==\` |
| \`samaKetat\` | \`angka\` dibandingkan dengan \`teks\` memakai \`===\` |
| \`bedaKetat\` | \`angka\` dibandingkan dengan \`teks\` memakai \`!==\` |
| \`diAntara\` | \`true\` jika \`angka\` lebih dari 1 **dan** kurang dari 10 |
`,
  kodeAwal: `const angka = 5;
const teks = "5";

const samaLonggar = true;
`,
  solusi: `const angka = 5;
const teks = "5";

const samaLonggar = angka == teks;
const samaKetat = angka === teks;
const bedaKetat = angka !== teks;
const diAntara = angka > 1 && angka < 10;

console.log(samaLonggar, samaKetat, bedaKetat, diAntara);
`,
  petunjuk: [
    'Hasil perbandingan bisa langsung disimpan: const samaKetat = angka === teks;',
    'Untuk "di antara", gabungkan dua perbandingan dengan &&.',
  ],
  tes: [
    {
      nama: 'samaLonggar dan samaKetat benar',
      cek(ctx) {
        if (!ctx.pakai(/angka\s*==\s*teks|teks\s*==\s*angka/)) return 'samaLonggar harus membandingkan angka == teks (bukan menulis true langsung).';
        if (ctx.variabel('samaLonggar') !== true) return 'samaLonggar seharusnya true.';
        if (!ctx.pakai(/angka\s*===\s*teks|teks\s*===\s*angka/)) return 'samaKetat harus membandingkan angka === teks.';
        if (ctx.variabel('samaKetat') !== false) return 'samaKetat seharusnya false, karena tipenya berbeda.';
        return true;
      },
    },
    {
      nama: 'bedaKetat memakai !==',
      cek(ctx) {
        if (!ctx.pakai('!==')) return 'Pakai operator !==.';
        return ctx.variabel('bedaKetat') === true || 'bedaKetat seharusnya true.';
      },
    },
    {
      nama: 'diAntara memakai &&',
      cek(ctx) {
        if (!ctx.pakai('&&')) return 'Gabungkan dua perbandingan dengan &&.';
        return ctx.variabel('diAntara') === true || 'diAntara seharusnya true (5 ada di antara 1 dan 10).';
      },
    },
  ],
};
