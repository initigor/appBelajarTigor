export default {
  id: 'array-sort',
  judul: 'sort dengan Pembanding',
  tipe: 'js',
  xp: 25,
  materi: `
# sort: jebakan terbesar untuk pemula JS

Coba tebak:

~~~js
[10, 1, 5, 100].sort();   // hasilnya [1, 10, 100, 5] 🤯
~~~

Tanpa argumen, \`sort()\` mengubah semua elemen menjadi **string** lalu mengurutkannya seperti kamus: "1" < "10" < "100" < "5". Aman untuk string, **salah untuk angka**.

## Fungsi pembanding
Untuk angka, berikan fungsi pembanding \`(a, b) => ...\`:
- hasil **negatif** → \`a\` diletakkan sebelum \`b\`
- hasil **positif** → \`b\` diletakkan sebelum \`a\`
- \`0\` → urutan tetap

Ini **sama persis** dengan fungsi pembanding untuk \`qsort\` di C!

~~~js
angka.sort((a, b) => a - b);   // naik:  [1, 5, 10, 100]
angka.sort((a, b) => b - a);   // turun: [100, 10, 5, 1]
~~~

Di Python: \`sorted(angka)\` dan \`sorted(angka, reverse=True)\`.

## Mengurutkan string
~~~js
nama.sort((a, b) => a.localeCompare(b));   // A-Z, aman untuk huruf besar-kecil & bahasa
~~~

## ⚠️ sort MENGUBAH array asli
\`sort\` mengurutkan array di tempat (in-place), seperti \`list.sort()\` di Python, bukan \`sorted()\`. Untuk membuat versi terurut tanpa mengubah aslinya:

~~~js
const urut = angka.slice().sort((a, b) => a - b);   // slice() membuat salinan dulu
const urut2 = angka.toSorted((a, b) => a - b);      // cara modern (JS 2023)
~~~
`,
  tugas: `
Diberikan \`nilai = [70, 9, 100, 45, 8]\` dan \`nama\`. Buat **tanpa mengubah array aslinya**:

1. \`urutNaik\` → nilai dari kecil ke besar: \`[8, 9, 45, 70, 100]\`
2. \`urutTurun\` → nilai dari besar ke kecil
3. \`namaUrut\` → nama urut abjad A–Z
4. \`tigaTerbesar\` → 3 nilai terbesar, dari yang terbesar: \`[100, 70, 45]\`
`,
  kodeAwal: `const nilai = [70, 9, 100, 45, 8];
const nama = ["Sinta", "andi", "Budi", "citra"];

const urutNaik = nilai.sort();
console.log(urutNaik);
`,
  solusi: `const nilai = [70, 9, 100, 45, 8];
const nama = ["Sinta", "andi", "Budi", "citra"];

const urutNaik = nilai.slice().sort((a, b) => a - b);
const urutTurun = nilai.slice().sort((a, b) => b - a);
const namaUrut = nama.slice().sort((a, b) => a.localeCompare(b));
const tigaTerbesar = urutTurun.slice(0, 3);

console.log(urutNaik, urutTurun, namaUrut, tigaTerbesar);
`,
  petunjuk: [
    'Salin dulu dengan slice(), baru sort: nilai.slice().sort((a, b) => a - b)',
    'Untuk nama: sort((a, b) => a.localeCompare(b))',
    'tigaTerbesar = urutTurun.slice(0, 3)',
  ],
  tes: [
    {
      nama: 'urutNaik dan urutTurun benar (numerik)',
      cek(ctx) {
        const n = JSON.stringify(ctx.variabel('urutNaik'));
        if (n === '[100,45,70,8,9]') return 'urutNaik = [100,45,70,8,9]. Itu hasil sort() tanpa pembanding (diurutkan sebagai string). Pakai (a, b) => a - b.';
        if (n !== '[8,9,45,70,100]') return `urutNaik = ${n}, seharusnya [8,9,45,70,100].`;
        const t = JSON.stringify(ctx.variabel('urutTurun'));
        return t === '[100,70,45,9,8]' || `urutTurun = ${t}, seharusnya [100,70,45,9,8].`;
      },
    },
    {
      nama: 'Array asli nilai & nama tidak berubah',
      cek(ctx) {
        if (JSON.stringify(ctx.ambil('nilai')) !== '[70,9,100,45,8]') return `nilai berubah menjadi ${JSON.stringify(ctx.ambil('nilai'))}. Salin dulu dengan slice() sebelum sort.`;
        return JSON.stringify(ctx.ambil('nama')) === '["Sinta","andi","Budi","citra"]' || 'Array nama ikut berubah. Salin dulu sebelum sort.';
      },
    },
    {
      nama: 'namaUrut A-Z (tidak peka huruf besar/kecil)',
      cek(ctx) {
        const n = JSON.stringify(ctx.variabel('namaUrut'));
        if (n === '["Budi","Sinta","andi","citra"]') return 'Huruf kapital diurutkan duluan. Pakai a.localeCompare(b) sebagai pembanding.';
        return n === '["andi","Budi","citra","Sinta"]' || `namaUrut = ${n}, seharusnya ["andi","Budi","citra","Sinta"].`;
      },
    },
    {
      nama: 'tigaTerbesar = [100, 70, 45]',
      cek(ctx) {
        const t = JSON.stringify(ctx.variabel('tigaTerbesar'));
        return t === '[100,70,45]' || `tigaTerbesar = ${t}, seharusnya [100,70,45].`;
      },
    },
  ],
};
