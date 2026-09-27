export default {
  id: 'array-foreach-map',
  judul: 'forEach & map',
  tipe: 'js',
  xp: 20,
  materi: `
# forEach dan map

Ingat callback dari Chapter 3? Sekarang saatnya dipakai! Array punya method yang menerima **callback** dan menjalankannya untuk setiap elemen.

## forEach: lakukan sesuatu untuk setiap elemen
~~~js
const nama = ["budi", "sinta"];
nama.forEach((n, i) => {
  console.log(\`\${i + 1}. \${n}\`);
});
// 1. budi
// 2. sinta
~~~
Callback menerima \`(elemen, indeks)\`, mirip \`for i, n in enumerate(nama)\` di Python. \`forEach\` **tidak mengembalikan apa-apa**.

## map: ubah setiap elemen → array baru
~~~js
const angka = [1, 2, 3];
const kuadrat = angka.map((x) => x * x);   // [1, 4, 9]
~~~

Ini sama dengan **list comprehension** di Python:

| Python | JavaScript |
| --- | --- |
| \`[x * x for x in angka]\` | \`angka.map((x) => x * x)\` |
| \`[s.upper() for s in nama]\` | \`nama.map((s) => s.toUpperCase())\` |

- \`map\` selalu menghasilkan array baru dengan **panjang yang sama**.
- Array aslinya **tidak berubah**.
- Callback-nya **harus return** sesuatu. Kalau pakai kurawal, jangan lupa \`return\`!

~~~js
angka.map((x) => { x * 2 });           // [undefined, undefined, undefined] 😱
angka.map((x) => { return x * 2; });   // [2, 4, 6]
~~~

🔥 \`map\` sangat penting di React: begitulah cara menampilkan daftar data menjadi elemen HTML (Chapter 11).
`,
  tugas: `
1. Dari \`suhuCelcius\`, buat \`suhuFahrenheit\` memakai **map** (rumus: \`c * 9 / 5 + 32\`).
2. Dari \`nama\`, buat \`namaKapital\` (semua huruf kapital) memakai **map**.
3. Pakai **forEach** untuk mencetak setiap nama dengan nomor urut: \`1. budi\`, \`2. sinta\`, dst.
`,
  kodeAwal: `const suhuCelcius = [0, 100, 37, -10];
const nama = ["budi", "sinta", "andi"];

// 1. suhuFahrenheit

// 2. namaKapital

// 3. forEach
`,
  solusi: `const suhuCelcius = [0, 100, 37, -10];
const nama = ["budi", "sinta", "andi"];

const suhuFahrenheit = suhuCelcius.map((c) => c * 9 / 5 + 32);
const namaKapital = nama.map((n) => n.toUpperCase());

nama.forEach((n, i) => {
  console.log(\`\${i + 1}. \${n}\`);
});
`,
  petunjuk: [
    'const suhuFahrenheit = suhuCelcius.map((c) => c * 9 / 5 + 32);',
    'forEach menerima (elemen, indeks). Nomor urut = indeks + 1.',
  ],
  tes: [
    {
      nama: 'suhuFahrenheit dibuat dengan map',
      async cek(ctx) {
        if (!ctx.pakai(/suhuCelcius\s*\.map\(/)) return 'Gunakan suhuCelcius.map(...).';
        const r = await ctx.jalankanDengan({ suhuCelcius: [0, 100, 20] });
        const h = r.ambil('suhuFahrenheit');
        return JSON.stringify(h) === '[32,212,68]' || `Untuk suhuCelcius [0, 100, 20], suhuFahrenheit = ${JSON.stringify(h)}, seharusnya [32,212,68].`;
      },
    },
    {
      nama: 'namaKapital dibuat dengan map',
      async cek(ctx) {
        if (!ctx.pakai(/nama\s*\.map\(/)) return 'Gunakan nama.map(...).';
        const r = await ctx.jalankanDengan({ nama: ['rudi', 'ayu'] });
        const h = r.ambil('namaKapital');
        if (JSON.stringify(r.ambil('nama')) !== '["rudi","ayu"]') return 'Array nama asli ikut berubah. map seharusnya membuat array baru.';
        return JSON.stringify(h) === '["RUDI","AYU"]' || `Untuk nama ["rudi","ayu"], namaKapital = ${JSON.stringify(h)}, seharusnya ["RUDI","AYU"].`;
      },
    },
    {
      nama: 'forEach mencetak nama bernomor',
      async cek(ctx) {
        if (!ctx.pakai('.forEach(')) return 'Gunakan nama.forEach(...).';
        const r = await ctx.jalankanDengan({ nama: ['rudi', 'ayu'] });
        const h = r.logs.filter((l) => /^\d+\. /.test(l));
        return h.join('|') === '1. rudi|2. ayu' || `Untuk nama ["rudi","ayu"], seharusnya tercetak "1. rudi" dan "2. ayu". Yang tercetak: ${r.logs.join(', ') || '(kosong)'}.`;
      },
    },
  ],
};
