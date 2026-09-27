export default {
  id: 'node-routing',
  judul: 'Routing ala Express: Mencocokkan Alamat',
  tipe: 'js',
  xp: 25,
  materi: `
# Routing ala Express 🧭

**Express** adalah framework Node.js paling populer untuk membuat web server. Intinya: kamu **mendaftarkan route** — pasangan (method, path) dengan fungsi yang menanganinya:

~~~js
import express from 'express';
const app = express();

app.get('/produk', (req, res) => {
  res.json(daftarProduk);
});

app.get('/produk/:id', (req, res) => {
  const produk = cariProduk(req.params.id);
  res.json(produk);
});

app.listen(3000);
~~~

Tanda \`:id\` di path adalah **route param** — bagian yang bisa berubah-ubah, hasilnya bisa dibaca lewat \`req.params.id\`. Misalnya request ke \`/produk/7\` akan membuat \`req.params\` menjadi \`{ id: "7" }\`.

Di balik layar, saat request datang, Express **mencocokkan** method + path request dengan daftar route yang terdaftar, segmen demi segmen. Chapter ini akan membuat sendiri "mesin pencocok" sederhana itu, supaya kamu paham bagaimana routing bekerja di baliknya.
`,
  tugas: `
Buat \`cocokkanRoute(daftarRoute, method, path)\`:

- \`daftarRoute\` = array \`{ method, path, handler }\`, contoh: \`{ method: "GET", path: "/produk/:id", handler: fn }\`.
- Cari route **pertama** yang method-nya sama (case-sensitive) dan path-nya cocok segmen demi segmen — segmen yang diawali \`:\` di path route dianggap cocok dengan **apa saja** pada path request, dan nilainya dikumpulkan sebagai params.
- Jumlah segmen path juga harus sama persis (tidak boleh kurang/lebih).
- Kalau cocok → kembalikan \`{ handler, params }\`. Kalau tidak ada yang cocok → kembalikan \`null\`.

Contoh: route \`{ method: "GET", path: "/produk/:id" }\` cocok dengan \`GET /produk/7\` → \`params: { id: "7" }\`, tapi tidak cocok dengan \`POST /produk/7\` atau \`GET /produk/7/detail\`.
`,
  kodeAwal: `function cocokkanRoute(daftarRoute, method, path) {

}
`,
  solusi: `function cocokkanRoute(daftarRoute, method, path) {
  const segPath = path.split('/').filter(Boolean);
  for (const route of daftarRoute) {
    if (route.method !== method) continue;
    const segRoute = route.path.split('/').filter(Boolean);
    if (segRoute.length !== segPath.length) continue;
    const params = {};
    let cocok = true;
    for (let i = 0; i < segRoute.length; i++) {
      if (segRoute[i].startsWith(':')) {
        params[segRoute[i].slice(1)] = segPath[i];
      } else if (segRoute[i] !== segPath[i]) {
        cocok = false;
        break;
      }
    }
    if (cocok) return { handler: route.handler, params };
  }
  return null;
}
`,
  petunjuk: [
    'Pecah path jadi segmen dengan path.split("/").filter(Boolean) supaya "/produk/7" jadi ["produk", "7"].',
    'Loop setiap route, skip kalau method beda atau jumlah segmen beda.',
    'Segmen yang diawali ":" selalu cocok, dan nilainya disimpan ke params[nama tanpa titik dua].',
  ],
  tes: [
    {
      nama: 'Cocok tanpa param',
      cek(ctx) {
        const h = () => 'daftar produk';
        const routes = [{ method: 'GET', path: '/produk', handler: h }];
        const r = ctx.panggil('cocokkanRoute', routes, 'GET', '/produk');
        if (!r) return 'Seharusnya cocok dengan route GET /produk.';
        if (r.handler !== h) return 'handler yang dikembalikan bukan handler dari route yang cocok.';
        return JSON.stringify(r.params) === '{}' || `params seharusnya {}, dapat ${JSON.stringify(r.params)}.`;
      },
    },
    {
      nama: 'Cocok dengan route param',
      cek(ctx) {
        const routes = [{ method: 'GET', path: '/produk/:id', handler: () => {} }];
        const r = ctx.panggil('cocokkanRoute', routes, 'GET', '/produk/7');
        if (!r) return 'Seharusnya cocok dengan /produk/:id.';
        return r.params?.id === '7' || `params.id seharusnya "7", dapat ${JSON.stringify(r.params)}.`;
      },
    },
    {
      nama: 'Method beda → tidak cocok',
      cek(ctx) {
        const routes = [{ method: 'GET', path: '/produk/:id', handler: () => {} }];
        const r = ctx.panggil('cocokkanRoute', routes, 'POST', '/produk/7');
        return r === null || `Seharusnya null karena method POST tidak terdaftar, dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'Jumlah segmen beda → tidak cocok',
      cek(ctx) {
        const routes = [{ method: 'GET', path: '/produk/:id', handler: () => {} }];
        const r = ctx.panggil('cocokkanRoute', routes, 'GET', '/produk/7/detail');
        return r === null || `Seharusnya null karena segmen path lebih banyak, dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'Memilih route pertama yang cocok di antara beberapa route',
      cek(ctx) {
        const hProduk = () => 'produk';
        const hUser = () => 'user';
        const routes = [
          { method: 'GET', path: '/user/:id', handler: hUser },
          { method: 'GET', path: '/produk/:id', handler: hProduk },
        ];
        const r = ctx.panggil('cocokkanRoute', routes, 'GET', '/produk/3');
        return r?.handler === hProduk || 'Seharusnya cocok dengan route /produk/:id, bukan /user/:id.';
      },
    },
  ],
};
