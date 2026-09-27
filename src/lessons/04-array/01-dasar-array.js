export default {
  id: 'array-dasar',
  judul: 'Dasar Array: push, pop, shift',
  tipe: 'js',
  xp: 15,
  materi: `
# Array

Array di JS = **list di Python**. Isinya boleh campur tipe dan ukurannya bisa berubah. Array di C berbeda karena ukurannya tetap dan tipenya harus satu.

~~~js
const buah = ["apel", "jeruk", "mangga"];
buah[0];            // "apel"
buah.length;        // 3            (Python: len(buah))
buah.at(-1);        // "mangga"     (Python: buah[-1])
buah[1] = "pisang"; // boleh mengubah isi walaupun const!
~~~

> \`const\` hanya melarang variabel **diganti dengan array lain** (\`buah = [...]\`). Isi array tetap boleh diubah.

## Menambah dan mengambil elemen

| Aksi | JavaScript | Python |
| --- | --- | --- |
| tambah di akhir | \`arr.push(x)\` | \`arr.append(x)\` |
| ambil & hapus dari akhir | \`arr.pop()\` | \`arr.pop()\` |
| tambah di awal | \`arr.unshift(x)\` | \`arr.insert(0, x)\` |
| ambil & hapus dari awal | \`arr.shift()\` | \`arr.pop(0)\` |

~~~js
const antrian = ["Andi", "Budi"];
antrian.push("Citra");           // ["Andi", "Budi", "Citra"]
const dilayani = antrian.shift(); // dilayani = "Andi", antrian = ["Budi", "Citra"]
~~~

\`pop()\` dan \`shift()\` **mengembalikan** elemen yang diambil, jadi hasilnya bisa disimpan di variabel.

## Array kosong & indeks di luar batas
~~~js
const kosong = [];
kosong.length;   // 0
kosong[5];       // undefined (tidak error seperti Python IndexError!)
~~~
`,
  tugas: `
Mulai dari \`const belanja = ["beras", "telur"];\`. Lakukan secara berurutan:

1. Tambahkan \`"minyak"\` di **akhir**.
2. Tambahkan \`"gula"\` di **awal**.
3. Ambil elemen terakhir dengan \`pop()\` dan simpan di \`const terakhir\`.
4. Simpan panjang array saat ini di \`const jumlahItem\`.
5. Simpan elemen pertama di \`const pertama\`.

Hasil akhir \`belanja\` seharusnya \`["gula", "beras", "telur"]\`.
`,
  kodeAwal: `const belanja = ["beras", "telur"];

// 1. push

// 2. unshift

// 3. pop

console.log(belanja);
`,
  solusi: `const belanja = ["beras", "telur"];

belanja.push("minyak");
belanja.unshift("gula");
const terakhir = belanja.pop();
const jumlahItem = belanja.length;
const pertama = belanja[0];

console.log(belanja, terakhir, jumlahItem, pertama);
`,
  petunjuk: ['belanja.push("minyak"); belanja.unshift("gula");', 'const terakhir = belanja.pop();'],
  tes: [
    {
      nama: 'Memakai push, unshift, dan pop',
      cek(ctx) {
        for (const m of ['push', 'unshift', 'pop']) if (!ctx.pakai(`.${m}(`)) return `Gunakan method ${m}().`;
        return true;
      },
    },
    {
      nama: 'Isi akhir belanja = ["gula", "beras", "telur"]',
      cek(ctx) {
        const b = ctx.variabel('belanja');
        return JSON.stringify(b) === '["gula","beras","telur"]' || `belanja sekarang ${JSON.stringify(b)}, seharusnya ["gula","beras","telur"].`;
      },
    },
    {
      nama: 'terakhir, jumlahItem, pertama benar',
      cek(ctx) {
        if (ctx.variabel('terakhir') !== 'minyak') return `terakhir = ${JSON.stringify(ctx.ambil('terakhir'))}, seharusnya "minyak" (hasil pop()).`;
        if (ctx.variabel('jumlahItem') !== 3) return `jumlahItem = ${ctx.ambil('jumlahItem')}, seharusnya 3.`;
        return ctx.variabel('pertama') === 'gula' || `pertama = ${JSON.stringify(ctx.ambil('pertama'))}, seharusnya "gula".`;
      },
    },
  ],
};
