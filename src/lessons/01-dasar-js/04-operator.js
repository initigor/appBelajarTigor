export default {
  id: 'operator-aritmatika',
  judul: 'Operator Aritmatika',
  tipe: 'js',
  xp: 15,
  materi: `
# Operator Aritmatika

Sebagian besar operatornya sama dengan C dan Python:

| Operator | Arti | Contoh | Hasil |
| --- | --- | --- | --- |
| \`+\` | tambah | \`7 + 2\` | \`9\` |
| \`-\` | kurang | \`7 - 2\` | \`5\` |
| \`*\` | kali | \`7 * 2\` | \`14\` |
| \`/\` | bagi | \`7 / 2\` | \`3.5\` ⚠️ |
| \`%\` | sisa bagi (modulo) | \`7 % 2\` | \`1\` |
| \`**\` | pangkat | \`7 ** 2\` | \`49\` |

## ⚠️ Pembagian beda dengan C
Di C, \`7 / 2\` untuk dua \`int\` menghasilkan \`3\` (dibulatkan). Di JS hasilnya **\`3.5\`**, karena semua angka adalah \`number\`. Ini sama seperti \`/\` di Python 3.

Untuk pembagian bulat (seperti \`//\` di Python), pakai **\`Math.floor()\`**:

~~~js
console.log(7 / 2);             // 3.5
console.log(Math.floor(7 / 2)); // 3   (Python: 7 // 2)
~~~

## Operator gabungan & increment
Sama persis dengan C:

~~~js
let skor = 10;
skor += 5;   // skor = skor + 5  -> 15
skor *= 2;   // 30
skor++;      // 31  (Python tidak punya ++)
skor--;      // 30
~~~

## Objek Math
\`Math\` berisi fungsi matematika, mirip \`math.h\` atau modul \`math\` di Python:
\`Math.round(2.5)\` → 3, \`Math.sqrt(16)\` → 4, \`Math.max(3, 9, 1)\` → 9, \`Math.abs(-4)\` → 4.
`,
  tugas: `
Sudah ada \`const a = 17;\` dan \`const b = 5;\`. Buat variabel berikut **dengan memakai \`a\` dan \`b\`** (jangan tulis angka hasilnya langsung):

| Variabel | Isi |
| --- | --- |
| \`hasilBagi\` | \`a\` dibagi \`b\` |
| \`bagiBulat\` | \`a\` dibagi \`b\`, dibulatkan ke bawah |
| \`sisa\` | sisa bagi \`a\` oleh \`b\` |
| \`pangkat\` | \`b\` pangkat 2 |

Lalu buat \`let poin = 10;\`, tambahkan 5 dengan \`+=\`, lalu naikkan 1 dengan \`++\` (hasil akhir 16).
`,
  kodeAwal: `const a = 17;
const b = 5;

const hasilBagi = 0;
// lanjutkan...
`,
  solusi: `const a = 17;
const b = 5;

const hasilBagi = a / b;
const bagiBulat = Math.floor(a / b);
const sisa = a % b;
const pangkat = b ** 2;

let poin = 10;
poin += 5;
poin++;

console.log(hasilBagi, bagiBulat, sisa, pangkat, poin);
`,
  petunjuk: [
    'Pembagian bulat: Math.floor(a / b)',
    'Sisa bagi memakai operator %, pangkat memakai **',
    'poin += 5; lalu poin++;',
  ],
  tes: [
    {
      nama: 'hasilBagi = 3.4 dan bagiBulat = 3',
      cek(ctx) {
        const hb = ctx.variabel('hasilBagi');
        if (hb !== 17 / 5) return `hasilBagi bernilai ${hb}, seharusnya 3.4 (17 / 5).`;
        const bb = ctx.variabel('bagiBulat');
        if (bb !== 3) return `bagiBulat bernilai ${bb}, seharusnya 3. Pakai Math.floor().`;
        if (!ctx.pakai('Math.floor')) return 'Gunakan Math.floor() untuk bagiBulat.';
        return true;
      },
    },
    {
      nama: 'sisa = 2 dan pangkat = 25 (memakai % dan **)',
      cek(ctx) {
        if (ctx.variabel('sisa') !== 2) return `sisa bernilai ${ctx.ambil('sisa')}, seharusnya 2 (17 % 5).`;
        if (ctx.variabel('pangkat') !== 25) return `pangkat bernilai ${ctx.ambil('pangkat')}, seharusnya 25 (5 ** 2).`;
        if (!ctx.pakai(/a\s*%\s*b/)) return 'Hitung sisa dengan a % b.';
        if (!ctx.pakai(/b\s*\*\*\s*2/)) return 'Hitung pangkat dengan b ** 2.';
        return true;
      },
    },
    {
      nama: 'poin menjadi 16 memakai += dan ++',
      cek(ctx) {
        const p = ctx.variabel('poin');
        if (!ctx.pakai(/poin\s*\+=\s*5/)) return 'Tambahkan 5 dengan poin += 5;';
        if (!ctx.pakai(/poin\s*\+\+|\+\+\s*poin/)) return 'Naikkan 1 dengan poin++;';
        return p === 16 || `poin bernilai ${p}, seharusnya 16.`;
      },
    },
  ],
};
