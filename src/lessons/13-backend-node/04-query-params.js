export default {
  id: 'node-query-params',
  judul: 'req.query & req.params: Membaca Input dari URL',
  tipe: 'js',
  xp: 25,
  materi: `
# req.query & req.params 🔎

Ada dua cara input "menempel" di URL:

- **Route param** (\`req.params\`) — bagian tetap dari path, sudah kamu buat mesin pencocoknya di lesson sebelumnya. Contoh: \`/produk/:id\`.
- **Query string** (\`req.query\`) — bagian setelah tanda \`?\`, berupa pasangan \`kunci=nilai\` dipisah \`&\`. Contoh: \`/produk?kota=Bandung&limit=5\`.

Di Express, keduanya sudah otomatis diubah jadi object:

~~~js
// GET /produk?kota=Bandung&limit=5
app.get('/produk', (req, res) => {
  console.log(req.query); // { kota: "Bandung", limit: "5" }
});

// GET /produk/7
app.get('/produk/:id', (req, res) => {
  console.log(req.params); // { id: "7" }
});
~~~

Perhatikan: nilai di \`req.query\` dan \`req.params\` **selalu string**, walau kelihatan seperti angka — kamu sendiri yang perlu mengubahnya (\`Number(...)\`) kalau perlu dihitung.

Query string juga bisa berisi karakter yang di-*encode*, misalnya spasi jadi \`%20\`. Fungsi bawaan \`decodeURIComponent\` membalikkannya:

~~~js
decodeURIComponent("Toko%20Maju"); // "Toko Maju"
~~~
`,
  tugas: `
Buat dua fungsi:

1. \`parseQuery(query)\` → \`query\` adalah string setelah \`?\` (tanpa tanda \`?\` itu sendiri), contoh \`"kota=Bandung&limit=5"\`. Kembalikan object \`{ kota: "Bandung", limit: "5" }\`. String kosong \`""\` → \`{}\`. Nilai perlu di-\`decodeURIComponent\`.
2. \`buatReq(method, path, query, params)\` → object request sederhana:
   \`{ method, path, query: parseQuery(query), params }\`
`,
  kodeAwal: `function parseQuery(query) {

}

function buatReq(method, path, query, params) {

}
`,
  solusi: `function parseQuery(query) {
  if (!query) return {};
  const hasil = {};
  for (const pasangan of query.split('&')) {
    const [kunci, nilai] = pasangan.split('=');
    hasil[decodeURIComponent(kunci)] = decodeURIComponent(nilai ?? '');
  }
  return hasil;
}

function buatReq(method, path, query, params) {
  return { method, path, query: parseQuery(query), params };
}
`,
  petunjuk: [
    'parseQuery: query.split("&") lalu untuk tiap bagian, pasangan.split("=") memisah kunci dan nilai.',
    'Jangan lupa: string kosong ("") harus mengembalikan {}, bukan { "": "" }.',
    'buatReq tinggal memanggil parseQuery(query) di dalamnya.',
  ],
  tes: [
    {
      nama: 'parseQuery memisah beberapa pasangan',
      cek(ctx) {
        const r = ctx.panggil('parseQuery', 'kota=Bandung&limit=5');
        const h = { kota: 'Bandung', limit: '5' };
        return JSON.stringify(r) === JSON.stringify(h) || `Hasilnya ${JSON.stringify(r)}, seharusnya ${JSON.stringify(h)}.`;
      },
    },
    {
      nama: 'parseQuery string kosong → {}',
      cek(ctx) {
        const r = ctx.panggil('parseQuery', '');
        return JSON.stringify(r) === '{}' || `parseQuery("") menghasilkan ${JSON.stringify(r)}, seharusnya {}.`;
      },
    },
    {
      nama: 'parseQuery men-decode karakter ter-encode',
      cek(ctx) {
        const r = ctx.panggil('parseQuery', 'nama=Toko%20Maju');
        return r?.nama === 'Toko Maju' || `parseQuery("nama=Toko%20Maju").nama = ${JSON.stringify(r?.nama)}, seharusnya "Toko Maju".`;
      },
    },
    {
      nama: 'buatReq menggabungkan semuanya',
      cek(ctx) {
        const r = ctx.panggil('buatReq', 'GET', '/produk', 'kota=Bandung', { id: '3' });
        const h = { method: 'GET', path: '/produk', query: { kota: 'Bandung' }, params: { id: '3' } };
        return JSON.stringify(r) === JSON.stringify(h) || `Hasilnya ${JSON.stringify(r)}, seharusnya ${JSON.stringify(h)}.`;
      },
    },
  ],
};
