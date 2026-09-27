export default {
  id: 'truthy-falsy',
  judul: 'Truthy & Falsy',
  tipe: 'js',
  xp: 15,
  materi: `
# Truthy & Falsy

Di C, \`if (x)\` berarti "jika x bukan 0". Di Python, \`if x:\` berarti "jika x tidak kosong". JavaScript punya aturan serupa. Setiap nilai dianggap **truthy** (seperti \`true\`) atau **falsy** (seperti \`false\`) ketika dipakai sebagai kondisi.

## Nilai falsy hanya ada 6 (hafalkan!)

| Nilai | Keterangan |
| --- | --- |
| \`false\` | |
| \`0\` (dan \`-0\`) | angka nol |
| \`""\` | string kosong |
| \`null\` | |
| \`undefined\` | |
| \`NaN\` | |

**Semua nilai lain truthy**, termasuk yang mungkin mengejutkan:

~~~js
Boolean("0");      // true  ← string berisi karakter "0", bukan kosong
Boolean(" ");      // true  ← ada spasi
Boolean([]);       // true  ← array kosong itu TRUTHY (beda dengan Python!)
Boolean({});       // true  ← object kosong juga truthy
~~~

⚠️ Perbedaan penting dengan Python: di Python \`[]\` dan \`{}\` bernilai falsy, sedangkan di JS keduanya **truthy**. Untuk mengecek array kosong di JS, pakai \`arr.length === 0\`.

## Mengecek dengan Boolean() atau !!
\`Boolean(x)\` mengubah nilai apa pun menjadi \`true\`/\`false\` (seperti \`bool(x)\` di Python). Kamu juga akan sering melihat \`!!x\` yang artinya sama.
`,
  tugas: `
**Tebak dulu tanpa menjalankan**, lalu isi variabel \`tebakan1\` sampai \`tebakan5\` dengan \`true\` atau \`false\`: apakah nilai berikut truthy?

| Variabel | Nilai yang ditebak |
| --- | --- |
| \`tebakan1\` | \`0\` |
| \`tebakan2\` | \`"0"\` |
| \`tebakan3\` | \`""\` |
| \`tebakan4\` | \`[]\` |
| \`tebakan5\` | \`null\` |

Setelah itu, buktikan: cetak \`Boolean(...)\` dari kelima nilai itu dengan \`console.log\` (sesuai urutan).
`,
  kodeAwal: `// Isi dengan true atau false
const tebakan1 = ;
const tebakan2 = ;
const tebakan3 = ;
const tebakan4 = ;
const tebakan5 = ;

// Buktikan:
console.log(Boolean(0));
`,
  solusi: `const tebakan1 = false;
const tebakan2 = true;
const tebakan3 = false;
const tebakan4 = true;
const tebakan5 = false;

console.log(Boolean(0));
console.log(Boolean("0"));
console.log(Boolean(""));
console.log(Boolean([]));
console.log(Boolean(null));
`,
  petunjuk: [
    'Kode awal belum bisa jalan karena ada "= ;". Isi setiap tebakan dengan true atau false.',
    'Ingat 6 nilai falsy: false, 0, "", null, undefined, NaN. Selain itu truthy.',
  ],
  tes: [
    {
      nama: 'Semua tebakan benar',
      cek(ctx) {
        const benar = [false, true, false, true, false];
        const nilai = ['0', '"0"', '""', '[]', 'null'];
        const salah = [];
        benar.forEach((b, i) => {
          const t = ctx.ambil(`tebakan${i + 1}`);
          if (t !== b) salah.push(`tebakan${i + 1} (${nilai[i]})`);
        });
        if (salah.length) return `Tebakan yang belum tepat: ${salah.join(', ')}. Cek lagi daftar 6 nilai falsy.`;
        return true;
      },
    },
    {
      nama: 'Membuktikan dengan Boolean() untuk kelima nilai',
      cek(ctx) {
        const harapan = ['false', 'true', 'false', 'true', 'false'];
        const cocok = (ctx.kodeBersih.match(/Boolean\(/g) ?? []).length >= 5;
        if (!cocok) return 'Cetak Boolean(...) untuk kelima nilai.';
        const log = ctx.logs.filter((l) => l === 'true' || l === 'false');
        return log.join() === harapan.join() || `Console seharusnya mencetak ${harapan.join(', ')}. Yang tercetak: ${ctx.logs.join(', ')}.`;
      },
    },
  ],
};
