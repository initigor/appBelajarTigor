export default {
  id: 'array-referensi-salinan',
  judul: 'Referensi vs Salinan',
  tipe: 'js',
  xp: 25,
  materi: `
# Referensi vs Salinan

Coba perhatikan:

~~~js
const a = [1, 2, 3];
const b = a;        // b BUKAN salinan!
b.push(4);
console.log(a);     // [1, 2, 3, 4]  😱 a ikut berubah
~~~

Variabel array (dan object) di JS menyimpan **referensi** (alamat), bukan isinya. Kalau kamu paham **pointer di C**, anggap \`b = a\` sama dengan menyalin pointer: keduanya menunjuk memori yang sama. Perilaku Python juga sama (\`b = a\` pada list).

## Membuat salinan
~~~js
const salinan1 = a.slice();     // cara klasik
const salinan2 = [...a];        // spread (Chapter 6), paling umum di React
const salinan3 = Array.from(a);
~~~

Python: \`a.copy()\` atau \`a[:]\`.

## === membandingkan referensi
~~~js
[1, 2] === [1, 2];   // false! dua array berbeda di memori
const x = [1, 2];
const y = x;
x === y;             // true, referensinya sama
~~~

## Kenapa ini penting untuk React? 🔥
React mendeteksi perubahan state dengan membandingkan **referensi**. Kalau kamu mengubah array lama (\`push\`), referensinya tetap sama, jadi React tidak tahu ada perubahan dan tampilan tidak ter-update. Di React kamu **selalu membuat array baru**:

~~~js
const baru = [...lama, itemBaru];         // tambah
const baru2 = lama.filter((x) => x !== 3); // hapus
const baru3 = lama.map((x) => x * 2);      // ubah
~~~

Fungsi yang tidak mengubah input-nya disebut **fungsi murni (pure)**.
`,
  tugas: `
Buat fungsi-fungsi berikut **tanpa mengubah array input** (fungsi murni):

1. \`tambahItem(arr, item)\` → array baru dengan \`item\` di akhir.
2. \`hapusItem(arr, item)\` → array baru tanpa semua elemen yang sama dengan \`item\`.
3. \`gantiItem(arr, indeks, nilaiBaru)\` → array baru dengan elemen di \`indeks\` diganti \`nilaiBaru\`.

Setiap fungsi harus mengembalikan **array yang berbeda** (bukan array input yang sama).
`,
  kodeAwal: `function tambahItem(arr, item) {
  arr.push(item);
  return arr;
}

function hapusItem(arr, item) {

}

function gantiItem(arr, indeks, nilaiBaru) {

}
`,
  solusi: `function tambahItem(arr, item) {
  return arr.concat([item]);
}

function hapusItem(arr, item) {
  return arr.filter((x) => x !== item);
}

function gantiItem(arr, indeks, nilaiBaru) {
  return arr.map((x, i) => (i === indeks ? nilaiBaru : x));
}

const asli = ["a", "b", "c"];
console.log(tambahItem(asli, "d"), hapusItem(asli, "b"), gantiItem(asli, 1, "B"), asli);
`,
  petunjuk: [
    'tambahItem: arr.concat([item]) atau arr.slice() lalu push ke salinannya.',
    'hapusItem: arr.filter((x) => x !== item)',
    'gantiItem: arr.map((x, i) => (i === indeks ? nilaiBaru : x))',
  ],
  tes: [
    {
      nama: 'tambahItem tidak mengubah array asli',
      cek(ctx) {
        const asli = [1, 2];
        const r = ctx.panggil('tambahItem', asli, 3);
        if (JSON.stringify(r) !== '[1,2,3]') return `tambahItem([1, 2], 3) mengembalikan ${JSON.stringify(r)}, seharusnya [1,2,3].`;
        if (r === asli) return 'tambahItem mengembalikan array yang SAMA (referensi sama). Buat array baru.';
        return JSON.stringify(asli) === '[1,2]' || `Array asli berubah menjadi ${JSON.stringify(asli)}. Jangan push ke array input.`;
      },
    },
    {
      nama: 'hapusItem benar dan murni',
      cek(ctx) {
        const asli = ['a', 'b', 'a', 'c'];
        const r = ctx.panggil('hapusItem', asli, 'a');
        if (JSON.stringify(r) !== '["b","c"]') return `hapusItem(["a","b","a","c"], "a") mengembalikan ${JSON.stringify(r)}, seharusnya ["b","c"].`;
        if (r === asli || asli.length !== 4) return 'hapusItem mengubah array asli. Pakai filter.';
        return true;
      },
    },
    {
      nama: 'gantiItem benar dan murni',
      cek(ctx) {
        const asli = [10, 20, 30];
        const r = ctx.panggil('gantiItem', asli, 1, 99);
        if (JSON.stringify(r) !== '[10,99,30]') return `gantiItem([10,20,30], 1, 99) mengembalikan ${JSON.stringify(r)}, seharusnya [10,99,30].`;
        if (r === asli || asli[1] !== 20) return 'gantiItem mengubah array asli. Buat array baru (misalnya dengan map).';
        return true;
      },
    },
  ],
};
