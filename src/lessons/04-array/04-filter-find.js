export default {
  id: 'array-filter-find',
  judul: 'filter, find, some, every',
  tipe: 'js',
  xp: 20,
  materi: `
# filter dan find

## filter: ambil elemen yang lolos syarat
Callback-nya mengembalikan \`true\`/\`false\`. Elemen yang menghasilkan \`true\` masuk ke array baru.

~~~js
const angka = [5, 12, 8, 21, 3];
const besar = angka.filter((x) => x > 7);   // [12, 8, 21]
~~~

| Python | JavaScript |
| --- | --- |
| \`[x for x in angka if x > 7]\` | \`angka.filter((x) => x > 7)\` |

## find: ambil elemen PERTAMA yang cocok
~~~js
angka.find((x) => x > 10);       // 12
angka.find((x) => x > 100);      // undefined (tidak ada)
angka.findIndex((x) => x > 10);  // 1   (-1 jika tidak ada)
~~~

Python tidak punya padanan langsung; biasanya pakai \`next((x for x in angka if x > 10), None)\`.

## some dan every
~~~js
angka.some((x) => x > 20);    // true  → ada minimal satu   (Python: any(...))
angka.every((x) => x > 0);    // true  → semuanya           (Python: all(...))
~~~

## Merangkai (chaining)
Karena \`filter\` dan \`map\` sama-sama mengembalikan array, keduanya bisa dirangkai:

~~~js
const hasil = angka
  .filter((x) => x % 2 === 1)   // [5, 21, 3]
  .map((x) => x * 10);           // [50, 210, 30]
~~~
`,
  tugas: `
Diberikan array \`angka\` dan \`kata\`. Buat:

| Variabel | Isi | Method |
| --- | --- | --- |
| \`genap\` | semua angka genap | \`filter\` |
| \`kataPanjang\` | kata yang panjangnya **lebih dari 5** huruf | \`filter\` |
| \`pertamaNegatif\` | angka negatif pertama (\`undefined\` jika tidak ada) | \`find\` |
| \`adaNol\` | apakah ada angka 0? | \`some\` |
| \`semuaPendek\` | apakah semua kata panjangnya ≤ 10? | \`every\` |
`,
  kodeAwal: `const angka = [4, -3, 0, 7, -8, 12];
const kata = ["api", "jendela", "pisang", "es", "komputer"];

`,
  solusi: `const angka = [4, -3, 0, 7, -8, 12];
const kata = ["api", "jendela", "pisang", "es", "komputer"];

const genap = angka.filter((n) => n % 2 === 0);
const kataPanjang = kata.filter((k) => k.length > 5);
const pertamaNegatif = angka.find((n) => n < 0);
const adaNol = angka.some((n) => n === 0);
const semuaPendek = kata.every((k) => k.length <= 10);

console.log(genap, kataPanjang, pertamaNegatif, adaNol, semuaPendek);
`,
  petunjuk: ['genap: angka.filter((n) => n % 2 === 0)', 'pertamaNegatif: angka.find((n) => n < 0)'],
  tes: [
    {
      nama: 'genap dan kataPanjang memakai filter',
      async cek(ctx) {
        if ((ctx.kodeBersih.match(/\.filter\(/g) ?? []).length < 2) return 'Gunakan filter untuk genap dan kataPanjang.';
        const r = await ctx.jalankanDengan({ angka: [1, 2, 3, 4, -6], kata: ['sepeda', 'bus', 'pesawat'] });
        if (JSON.stringify(r.ambil('genap')) !== '[2,4,-6]') return `Untuk angka [1,2,3,4,-6], genap = ${JSON.stringify(r.ambil('genap'))}, seharusnya [2,4,-6].`;
        return JSON.stringify(r.ambil('kataPanjang')) === '["sepeda","pesawat"]' || `Untuk kata ["sepeda","bus","pesawat"], kataPanjang = ${JSON.stringify(r.ambil('kataPanjang'))}, seharusnya ["sepeda","pesawat"].`;
      },
    },
    {
      nama: 'pertamaNegatif memakai find',
      async cek(ctx) {
        if (!ctx.pakai('.find(')) return 'Gunakan find untuk pertamaNegatif.';
        const r1 = await ctx.jalankanDengan({ angka: [3, -1, -9] });
        if (r1.ambil('pertamaNegatif') !== -1) return `Untuk [3, -1, -9], pertamaNegatif = ${r1.ambil('pertamaNegatif')}, seharusnya -1.`;
        const r2 = await ctx.jalankanDengan({ angka: [1, 2] });
        return r2.ambil('pertamaNegatif') === undefined || 'Jika tidak ada angka negatif, pertamaNegatif seharusnya undefined.';
      },
    },
    {
      nama: 'adaNol memakai some, semuaPendek memakai every',
      async cek(ctx) {
        if (!ctx.pakai('.some(') || !ctx.pakai('.every(')) return 'Gunakan some untuk adaNol dan every untuk semuaPendek.';
        const r1 = await ctx.jalankanDengan({ angka: [1, 0], kata: ['a', 'abcdefghijk'] });
        if (r1.ambil('adaNol') !== true) return 'Untuk angka [1, 0], adaNol seharusnya true.';
        if (r1.ambil('semuaPendek') !== false) return 'Jika ada kata 11 huruf, semuaPendek seharusnya false.';
        const r2 = await ctx.jalankanDengan({ angka: [1, 2], kata: ['abc'] });
        if (r2.ambil('adaNol') !== false) return 'Untuk angka [1, 2], adaNol seharusnya false.';
        return r2.ambil('semuaPendek') === true || 'Untuk kata ["abc"], semuaPendek seharusnya true.';
      },
    },
  ],
};
