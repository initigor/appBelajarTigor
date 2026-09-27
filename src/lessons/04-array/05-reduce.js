export default {
  id: 'array-reduce',
  judul: 'reduce',
  tipe: 'js',
  xp: 25,
  materi: `
# reduce: meringkas array menjadi satu nilai

\`reduce\` adalah "pola akumulator" dari loop, tapi dalam bentuk method.

~~~js
const angka = [5, 10, 15];

// versi loop (seperti di C/Python):
let total = 0;
for (const n of angka) {
  total = total + n;
}

// versi reduce:
const total2 = angka.reduce((acc, n) => acc + n, 0);
~~~

Cara bacanya:
~~~
arr.reduce((akumulator, elemen) => nilaiAkumulatorBaru, nilaiAwal)
~~~

| Putaran | \`acc\` | \`n\` | hasil (\`acc + n\`) |
| --- | --- | --- | --- |
| 1 | 0 (nilai awal) | 5 | 5 |
| 2 | 5 | 10 | 15 |
| 3 | 15 | 15 | **30** ← hasil akhir |

Di Python ada \`functools.reduce\`, tapi lebih sering orang memakai \`sum()\`. JS **tidak punya** \`sum()\` bawaan, jadi \`reduce\` sering dipakai untuk itu.

## Contoh lain
~~~js
// nilai terbesar
angka.reduce((maks, n) => (n > maks ? n : maks), angka[0]);
// (atau lebih mudah: Math.max(...angka), dengan spread dari Chapter 6)

// menghitung jumlah yang memenuhi syarat
angka.reduce((jml, n) => (n > 7 ? jml + 1 : jml), 0);   // 2
~~~

⚠️ **Selalu beri nilai awal** (argumen kedua). Tanpa nilai awal, \`reduce\` pada array kosong akan error.
`,
  tugas: `
Buat tiga fungsi yang memakai **reduce**:

1. \`jumlahkan(arr)\` → total semua angka. Array kosong → \`0\`.
2. \`kalikan(arr)\` → hasil kali semua angka. Array kosong → \`1\`.
3. \`hitungKata(kalimat)\` → jumlah total huruf dari semua kata (spasi tidak dihitung).
   \`hitungKata("aku suka js")\` → \`9\`. (Petunjuk: \`split(" ")\` lalu reduce panjangnya.)
`,
  kodeAwal: `function jumlahkan(arr) {

}

function kalikan(arr) {

}

function hitungKata(kalimat) {

}
`,
  solusi: `function jumlahkan(arr) {
  return arr.reduce((acc, n) => acc + n, 0);
}

function kalikan(arr) {
  return arr.reduce((acc, n) => acc * n, 1);
}

function hitungKata(kalimat) {
  return kalimat.split(" ").reduce((acc, kata) => acc + kata.length, 0);
}

console.log(jumlahkan([5, 10, 15]), kalikan([2, 3, 4]), hitungKata("aku suka js"));
`,
  petunjuk: [
    'jumlahkan: return arr.reduce((acc, n) => acc + n, 0);',
    'Nilai awal untuk perkalian adalah 1, bukan 0.',
  ],
  tes: [
    {
      nama: 'Memakai reduce',
      cek: (ctx) => (ctx.kodeBersih.match(/\.reduce\(/g) ?? []).length >= 3 || 'Gunakan reduce di ketiga fungsi.',
    },
    {
      nama: 'jumlahkan dan kalikan benar (termasuk array kosong)',
      cek(ctx) {
        for (const [a, h] of [[[5, 10, 15], 30], [[], 0], [[-2, 2], 0]]) {
          const r = ctx.panggil('jumlahkan', a);
          if (r !== h) return `jumlahkan(${JSON.stringify(a)}) mengembalikan ${r}, seharusnya ${h}.`;
        }
        for (const [a, h] of [[[2, 3, 4], 24], [[], 1], [[7], 7]]) {
          const r = ctx.panggil('kalikan', a);
          if (r !== h) return `kalikan(${JSON.stringify(a)}) mengembalikan ${r}, seharusnya ${h}.${h === 24 && r === 0 ? ' Nilai awal perkalian harus 1.' : ''}`;
        }
        return true;
      },
    },
    {
      nama: 'hitungKata benar',
      cek(ctx) {
        for (const [k, h] of [['aku suka js', 9], ['halo', 4], ['a b c d', 4]]) {
          const r = ctx.panggil('hitungKata', k);
          if (r !== h) return `hitungKata(${JSON.stringify(k)}) mengembalikan ${JSON.stringify(r)}, seharusnya ${h}.`;
        }
        return true;
      },
    },
  ],
};
