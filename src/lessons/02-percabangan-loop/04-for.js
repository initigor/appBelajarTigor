export default {
  id: 'for-loop',
  judul: 'Loop for',
  tipe: 'js',
  xp: 15,
  materi: `
# Loop for

Loop \`for\` klasik di JS **identik dengan C**, hanya saja \`int i\` diganti \`let i\`:

~~~js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
~~~

| C | Python | JavaScript |
| --- | --- | --- |
| \`for (int i = 0; i < n; i++)\` | \`for i in range(n):\` | \`for (let i = 0; i < n; i++)\` |
| \`for (int i = 1; i <= n; i++)\` | \`for i in range(1, n + 1):\` | \`for (let i = 1; i <= n; i++)\` |
| \`for (int i = 10; i > 0; i -= 2)\` | \`for i in range(10, 0, -2):\` | \`for (let i = 10; i > 0; i -= 2)\` |

⚠️ Pakai **\`let\`**, bukan \`const\`, untuk variabel penghitung, karena nilainya berubah (\`i++\`).

## Pola akumulator
Sama seperti di C/Python, untuk menjumlahkan kamu butuh variabel penampung di luar loop:

~~~js
let total = 0;
for (let i = 1; i <= 4; i++) {
  total += i;      // 1 + 2 + 3 + 4
}
console.log(total); // 10
~~~
`,
  tugas: `
Diberikan \`const n = 5;\`.

1. Pakai loop **for** untuk mencetak angka \`1\` sampai \`n\`, satu angka per baris.
2. Hitung \`jumlah\` = 1 + 2 + ... + n memakai loop (untuk n = 5 hasilnya 15).
3. Hitung \`faktorial\` = 1 × 2 × ... × n (untuk n = 5 hasilnya 120).

Tes akan mencoba nilai \`n\` yang lain juga.
`,
  kodeAwal: `const n = 5;
let jumlah = 0;
let faktorial = 1;

// tulis loop for di sini
`,
  solusi: `const n = 5;
let jumlah = 0;
let faktorial = 1;

for (let i = 1; i <= n; i++) {
  console.log(i);
  jumlah += i;
  faktorial *= i;
}

console.log("Jumlah:", jumlah);
console.log("Faktorial:", faktorial);
`,
  petunjuk: [
    'for (let i = 1; i <= n; i++) { ... }',
    'Di dalam loop: console.log(i); jumlah += i; faktorial *= i;',
  ],
  tes: [
    {
      nama: 'Memakai loop for',
      cek: (ctx) => ctx.pakai(/for\s*\(\s*let\s+\w+\s*=/) || 'Gunakan loop for (let i = ...; ...; ...).',
    },
    {
      nama: 'Mencetak 1 sampai n',
      async cek(ctx) {
        for (const n of [5, 3]) {
          const r = await ctx.jalankanDengan({ n });
          const angka = r.logs.filter((l) => /^\d+$/.test(l));
          const harap = Array.from({ length: n }, (_, i) => String(i + 1));
          if (angka.join() !== harap.join()) return `Untuk n = ${n}, console seharusnya mencetak ${harap.join(', ')} (satu per baris). Yang tercetak: ${angka.join(', ') || '(tidak ada)'}.`;
        }
        return true;
      },
    },
    {
      nama: 'jumlah dan faktorial benar',
      async cek(ctx) {
        for (const [n, j, f] of [[5, 15, 120], [3, 6, 6], [7, 28, 5040]]) {
          const r = await ctx.jalankanDengan({ n });
          if (r.ambil('jumlah') !== j) return `Untuk n = ${n}, jumlah = ${r.ambil('jumlah')}, seharusnya ${j}.`;
          if (r.ambil('faktorial') !== f) return `Untuk n = ${n}, faktorial = ${r.ambil('faktorial')}, seharusnya ${f}.`;
        }
        return true;
      },
    },
  ],
};
