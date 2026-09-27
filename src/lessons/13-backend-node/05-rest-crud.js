export default {
  id: 'node-rest-crud',
  judul: 'REST API: CRUD dengan Database Sederhana',
  tipe: 'js',
  xp: 30,
  materi: `
# REST API & CRUD 🗄️

**REST** adalah konvensi menamai endpoint berdasarkan *resource* (benda), bukan aksi, dan memakai HTTP method untuk menentukan aksinya:

| Method | Path | Aksi | Disebut |
| --- | --- | --- | --- |
| \`GET\` | \`/produk\` | Ambil semua produk | **R**ead |
| \`GET\` | \`/produk/:id\` | Ambil satu produk | **R**ead |
| \`POST\` | \`/produk\` | Buat produk baru | **C**reate |
| \`PUT\`/\`PATCH\` | \`/produk/:id\` | Ubah produk | **U**pdate |
| \`DELETE\` | \`/produk/:id\` | Hapus produk | **D**elete |

Empat aksi ini disingkat **CRUD**. Server sungguhan menyimpan datanya di database (MySQL, MongoDB, dst.), tapi untuk belajar, kita simulasikan dengan **array di memori** — pola yang juga sering dipakai saat prototyping cepat.

Karena tes di web ini menjalankan fungsimu berkali-kali, fungsi CRUD di bawah **tidak boleh mengubah array asli langsung** (mutasi) — selalu kembalikan **array/object baru**, sama seperti prinsip yang sudah kamu pakai di Chapter 4 dan 6.
`,
  tugas: `
Anggap \`daftar\` = array produk \`{ id, nama, harga }\`. Buat:

1. \`tambahProduk(daftar, data)\` → \`data\` = \`{ nama, harga }\` (tanpa id). Kembalikan **array baru** dengan item baru ditambahkan, id-nya otomatis: \`(id terbesar di daftar) + 1\` (atau \`1\` jika \`daftar\` kosong).
2. \`ambilProduk(daftar, id)\` → cari produk dengan \`id\` itu. Kembalikan produknya, atau \`null\` kalau tidak ada.
3. \`ubahProduk(daftar, id, perubahan)\` → kembalikan **array baru** dengan produk ber-\`id\` itu digabung (\`{ ...produk, ...perubahan }\`); produk lain tetap. Kalau \`id\` tidak ketemu, kembalikan \`null\`.
4. \`hapusProduk(daftar, id)\` → kembalikan **array baru** tanpa produk ber-\`id\` itu.
`,
  kodeAwal: `function tambahProduk(daftar, data) {

}

function ambilProduk(daftar, id) {

}

function ubahProduk(daftar, id, perubahan) {

}

function hapusProduk(daftar, id) {

}
`,
  solusi: `function tambahProduk(daftar, data) {
  const idBaru = daftar.length === 0 ? 1 : Math.max(...daftar.map((p) => p.id)) + 1;
  return [...daftar, { id: idBaru, ...data }];
}

function ambilProduk(daftar, id) {
  return daftar.find((p) => p.id === id) ?? null;
}

function ubahProduk(daftar, id, perubahan) {
  if (!daftar.some((p) => p.id === id)) return null;
  return daftar.map((p) => (p.id === id ? { ...p, ...perubahan } : p));
}

function hapusProduk(daftar, id) {
  return daftar.filter((p) => p.id !== id);
}
`,
  petunjuk: [
    'tambahProduk: Math.max(...daftar.map(p => p.id)) + 1 untuk id baru, lalu [...daftar, { id: idBaru, ...data }].',
    'ambilProduk: daftar.find(p => p.id === id) ?? null',
    'ubahProduk: cek dulu produknya ada, baru daftar.map(p => p.id === id ? { ...p, ...perubahan } : p).',
    'hapusProduk: daftar.filter(p => p.id !== id)',
  ],
  tes: [
    {
      nama: 'tambahProduk memberi id otomatis & tidak mengubah array asli',
      cek(ctx) {
        const asli = [{ id: 1, nama: 'Kopi', harga: 15000 }, { id: 2, nama: 'Teh', harga: 8000 }];
        const r = ctx.panggil('tambahProduk', asli, { nama: 'Roti', harga: 12000 });
        if (asli.length !== 2) return 'Array `daftar` yang asli ikut berubah. Kembalikan array baru, jangan push ke yang lama.';
        if (r?.length !== 3) return `Hasil tambahProduk panjangnya ${r?.length}, seharusnya 3.`;
        const baru = r[2];
        return (baru?.id === 3 && baru?.nama === 'Roti' && baru?.harga === 12000) || `Item baru: ${JSON.stringify(baru)}, seharusnya { id: 3, nama: "Roti", harga: 12000 }.`;
      },
    },
    {
      nama: 'tambahProduk ke array kosong → id 1',
      cek(ctx) {
        const r = ctx.panggil('tambahProduk', [], { nama: 'Kopi', harga: 15000 });
        return r?.[0]?.id === 1 || `id item pertama = ${JSON.stringify(r?.[0]?.id)}, seharusnya 1.`;
      },
    },
    {
      nama: 'ambilProduk menemukan / null',
      cek(ctx) {
        const daftar = [{ id: 1, nama: 'Kopi', harga: 15000 }];
        const r = ctx.panggil('ambilProduk', daftar, 1);
        if (r?.nama !== 'Kopi') return `ambilProduk(daftar, 1) = ${JSON.stringify(r)}, seharusnya produk Kopi.`;
        const r2 = ctx.panggil('ambilProduk', daftar, 99);
        return r2 === null || `ambilProduk(daftar, 99) = ${JSON.stringify(r2)}, seharusnya null.`;
      },
    },
    {
      nama: 'ubahProduk menggabungkan perubahan',
      cek(ctx) {
        const daftar = [{ id: 1, nama: 'Kopi', harga: 15000 }, { id: 2, nama: 'Teh', harga: 8000 }];
        const r = ctx.panggil('ubahProduk', daftar, 1, { harga: 17000 });
        const item = r?.find((p) => p.id === 1);
        if (item?.harga !== 17000 || item?.nama !== 'Kopi') return `Produk id 1 jadi ${JSON.stringify(item)}, seharusnya harga 17000 dan nama tetap "Kopi".`;
        const r2 = ctx.panggil('ubahProduk', daftar, 99, { harga: 1 });
        return r2 === null || `ubahProduk untuk id yang tidak ada seharusnya null, dapat ${JSON.stringify(r2)}.`;
      },
    },
    {
      nama: 'hapusProduk menghilangkan item',
      cek(ctx) {
        const daftar = [{ id: 1, nama: 'Kopi', harga: 15000 }, { id: 2, nama: 'Teh', harga: 8000 }];
        const r = ctx.panggil('hapusProduk', daftar, 1);
        if (r?.length !== 1) return `Panjang hasil ${r?.length}, seharusnya 1.`;
        return r[0]?.id === 2 || `Item tersisa: ${JSON.stringify(r[0])}, seharusnya produk id 2.`;
      },
    },
  ],
};
