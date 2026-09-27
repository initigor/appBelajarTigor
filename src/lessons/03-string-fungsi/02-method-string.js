export default {
  id: 'method-string',
  judul: 'Method String',
  tipe: 'js',
  xp: 20,
  materi: `
# Method String

String di JS punya banyak method bawaan, mirip di Python. Bedanya: \`len(s)\` di Python adalah **fungsi**, sedangkan di JS \`s.length\` adalah **properti** (tanpa kurung).

| Python | JavaScript | Hasil untuk \`s = "Halo Dunia"\` |
| --- | --- | --- |
| \`len(s)\` | \`s.length\` | \`10\` |
| \`s.upper()\` | \`s.toUpperCase()\` | \`"HALO DUNIA"\` |
| \`s.lower()\` | \`s.toLowerCase()\` | \`"halo dunia"\` |
| \`s.strip()\` | \`s.trim()\` | buang spasi di awal/akhir |
| \`"Dun" in s\` | \`s.includes("Dun")\` | \`true\` |
| \`s.startswith("Ha")\` | \`s.startsWith("Ha")\` | \`true\` |
| \`s[0]\` | \`s[0]\` | \`"H"\` |
| \`s[-1]\` | \`s.at(-1)\` atau \`s[s.length - 1]\` | \`"a"\` |
| \`s[0:4]\` | \`s.slice(0, 4)\` | \`"Halo"\` |
| \`s.split(" ")\` | \`s.split(" ")\` | \`["Halo", "Dunia"]\` |
| \`s.replace("a", "o")\` | \`s.replaceAll("a", "o")\` | \`"Holo Dunio"\` |
| \`s.find("D")\` | \`s.indexOf("D")\` | \`5\` (atau \`-1\` jika tidak ada) |

⚠️ \`s[-1]\` di JS menghasilkan \`undefined\`, bukan huruf terakhir. Pakai \`s.at(-1)\`.

⚠️ \`s.replace("a", "o")\` di JS hanya mengganti **kemunculan pertama**. Untuk mengganti semua, pakai \`replaceAll\`.

## String itu immutable
Sama seperti Python, method string **tidak mengubah** string aslinya, tapi mengembalikan string baru:

~~~js
const s = "halo";
s.toUpperCase();            // hasilnya dibuang!
console.log(s);             // "halo"
const besar = s.toUpperCase();
console.log(besar);         // "HALO"
~~~

## Method bisa dirantai (chaining)
~~~js
const hasil = "  Budi  ".trim().toUpperCase();  // "BUDI"
~~~
`,
  tugas: `
Diberikan \`input\` dari form yang berantakan: \`"  budi santoso  "\`. Buat variabel berikut:

| Variabel | Isi | Contoh hasil |
| --- | --- | --- |
| \`bersih\` | \`input\` tanpa spasi di awal/akhir | \`"budi santoso"\` |
| \`panjang\` | panjang \`bersih\` | \`12\` |
| \`besar\` | \`bersih\` dalam huruf kapital semua | \`"BUDI SANTOSO"\` |
| \`namaDepan\` | kata pertama dari \`bersih\` | \`"budi"\` |
| \`hurufTerakhir\` | karakter terakhir dari \`bersih\` | \`"o"\` |
| \`adaSpasi\` | apakah \`bersih\` mengandung spasi | \`true\` |
`,
  kodeAwal: `const input = "  budi santoso  ";

const bersih = input;
`,
  solusi: `const input = "  budi santoso  ";

const bersih = input.trim();
const panjang = bersih.length;
const besar = bersih.toUpperCase();
const namaDepan = bersih.split(" ")[0];
const hurufTerakhir = bersih.at(-1);
const adaSpasi = bersih.includes(" ");

console.log(bersih, panjang, besar, namaDepan, hurufTerakhir, adaSpasi);
`,
  petunjuk: [
    'bersih = input.trim()',
    'namaDepan: pecah dengan split(" ") lalu ambil indeks [0].',
    'hurufTerakhir: bersih.at(-1)',
  ],
  tes: [
    {
      nama: 'bersih, panjang, dan besar benar',
      async cek(ctx) {
        for (const input of ['  budi santoso  ', ' Sinta Ayu Lestari ']) {
          const r = await ctx.jalankanDengan({ input });
          const b = input.trim();
          if (r.ambil('bersih') !== b) return `Untuk input ${JSON.stringify(input)}, bersih = ${JSON.stringify(r.ambil('bersih'))}, seharusnya ${JSON.stringify(b)}.`;
          if (r.ambil('panjang') !== b.length) return `panjang = ${r.ambil('panjang')}, seharusnya ${b.length}. Hitung panjang dari bersih, bukan input.`;
          if (r.ambil('besar') !== b.toUpperCase()) return `besar = ${JSON.stringify(r.ambil('besar'))}, seharusnya ${JSON.stringify(b.toUpperCase())}.`;
        }
        return true;
      },
    },
    {
      nama: 'namaDepan dan hurufTerakhir benar',
      async cek(ctx) {
        for (const input of ['  budi santoso  ', ' Sinta Ayu Lestari ']) {
          const r = await ctx.jalankanDengan({ input });
          const b = input.trim();
          if (r.ambil('namaDepan') !== b.split(' ')[0]) return `Untuk input ${JSON.stringify(input)}, namaDepan = ${JSON.stringify(r.ambil('namaDepan'))}, seharusnya ${JSON.stringify(b.split(' ')[0])}.`;
          if (r.ambil('hurufTerakhir') !== b.at(-1)) return `hurufTerakhir = ${JSON.stringify(r.ambil('hurufTerakhir'))}, seharusnya ${JSON.stringify(b.at(-1))}.`;
        }
        return true;
      },
    },
    {
      nama: 'adaSpasi benar',
      async cek(ctx) {
        const r1 = await ctx.jalankanDengan({ input: ' budi santoso ' });
        const r2 = await ctx.jalankanDengan({ input: '  budi  ' });
        if (r1.ambil('adaSpasi') !== true) return 'Untuk "budi santoso", adaSpasi seharusnya true.';
        return r2.ambil('adaSpasi') === false || 'Untuk input "  budi  ", adaSpasi seharusnya false. Cek dari bersih, bukan input.';
      },
    },
  ],
};
