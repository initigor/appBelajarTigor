export default {
  id: 'konversi-tipe',
  judul: 'Konversi Tipe',
  tipe: 'js',
  xp: 15,
  materi: `
# Konversi Tipe

Operator \`+\` punya dua fungsi di JS: **menjumlah angka** dan **menggabung string**. Kalau salah satunya string, JS akan menggabung:

~~~js
console.log(2 + 3);       // 5
console.log("2" + "3");   // "23"  ← digabung, bukan dijumlah!
console.log("2" + 3);     // "23"  ← angka ikut diubah jadi string
console.log("10" - 3);    // 7     ← operator - selalu matematika (membingungkan, kan?)
~~~

Di Python, \`"2" + 3\` langsung error. JS justru diam-diam mengonversi tipenya. Ini sumber bug yang sangat umum, terutama karena **input dari form HTML selalu berupa string**.

## Konversi eksplisit

| Tujuan | JavaScript | Python |
| --- | --- | --- |
| string → number | \`Number("42")\` | \`int("42")\` / \`float("4.2")\` |
| ambil angka di depan string | \`parseInt("42px")\` → 42 | – |
| desimal | \`parseFloat("3.5kg")\` → 3.5 | – |
| number → string | \`String(42)\` | \`str(42)\` |

~~~js
Number("42");        // 42
Number("abc");       // NaN  (Not a Number)
parseInt("3.9 kg");  // 3
String(2025);        // "2025"
~~~

## NaN
\`NaN\` artinya "hasil hitungan yang bukan angka". Anehnya, \`typeof NaN\` adalah \`"number"\`, dan \`NaN === NaN\` hasilnya \`false\`! Untuk mengecek, pakai \`Number.isNaN(x)\`.
`,
  tugas: `
Ada dua input dari form: \`input1 = "20"\` dan \`input2 = "22"\`. Saat ini \`total\` bernilai \`"2022"\`. Itu salah!

1. Perbaiki \`total\` supaya hasilnya **angka \`42\`**. Ubah kedua input dengan \`Number()\`.
2. Buat \`berat\` = hasil \`parseInt\` dari string \`"65 kg"\` (hasilnya 65).
3. Buat \`bukanAngka\` = \`Number("halo")\`, lalu \`cekNaN\` = hasil \`Number.isNaN(bukanAngka)\`.
`,
  kodeAwal: `const input1 = "20";
const input2 = "22";

const total = input1 + input2;
console.log(total);
`,
  solusi: `const input1 = "20";
const input2 = "22";

const total = Number(input1) + Number(input2);
console.log(total);

const berat = parseInt("65 kg");
const bukanAngka = Number("halo");
const cekNaN = Number.isNaN(bukanAngka);
console.log(berat, bukanAngka, cekNaN);
`,
  petunjuk: [
    'Number(input1) mengubah "20" menjadi 20.',
    'parseInt("65 kg") mengambil angka di depan string.',
    'Number.isNaN(bukanAngka) menghasilkan true.',
  ],
  tes: [
    {
      nama: 'total bernilai angka 42',
      cek(ctx) {
        const t = ctx.variabel('total');
        if (t === '2022') return 'total masih "2022" (string). Kamu menggabungkan string, bukan menjumlahkan. Ubah dulu dengan Number().';
        if (typeof t !== 'number') return `total bertipe ${typeof t}, seharusnya number.`;
        if (!ctx.pakai('Number(')) return 'Gunakan Number() untuk mengonversi input.';
        return t === 42 || `total bernilai ${t}, seharusnya 42.`;
      },
    },
    {
      nama: 'berat = 65 memakai parseInt',
      cek(ctx) {
        if (!ctx.pakai('parseInt')) return 'Gunakan parseInt("65 kg").';
        const b = ctx.variabel('berat');
        return b === 65 || `berat bernilai ${JSON.stringify(b)}, seharusnya 65.`;
      },
    },
    {
      nama: 'bukanAngka adalah NaN dan cekNaN = true',
      cek(ctx) {
        if (!Number.isNaN(ctx.ambil('bukanAngka'))) return 'bukanAngka seharusnya NaN (hasil Number("halo")).';
        if (!ctx.pakai('Number.isNaN')) return 'Gunakan Number.isNaN() untuk cekNaN.';
        return ctx.variabel('cekNaN') === true || 'cekNaN seharusnya true.';
      },
    },
  ],
};
