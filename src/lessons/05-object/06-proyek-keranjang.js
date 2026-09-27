export default {
  id: 'proyek-keranjang-belanja',
  judul: 'Mini Proyek: Keranjang Belanja',
  tipe: 'js',
  xp: 40,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: Keranjang Belanja

Kamu akan membuat logika keranjang belanja untuk toko online kecil. Keranjang disimpan sebagai **array of object**:

~~~js
const keranjang = [
  { nama: "Kopi", harga: 25000, jumlah: 2 },
  { nama: "Roti", harga: 15000, jumlah: 1 },
];
~~~

## Format Rupiah
JS punya fitur bawaan untuk memformat angka sesuai bahasa/negara:

~~~js
(65000).toLocaleString("id-ID");   // "65.000"
\`Rp\${(65000).toLocaleString("id-ID")}\`;   // "Rp65.000"
~~~

## Rencana
Pecah masalah menjadi fungsi-fungsi kecil. Ini kebiasaan yang juga baik di C dan Python.
1. Hitung subtotal satu item (harga × jumlah).
2. Total = jumlah semua subtotal (reduce).
3. Menambah produk: jika sudah ada di keranjang, **tambah jumlahnya**. Jika belum, **tambahkan** sebagai item baru dengan jumlah 1.
`,
  tugas: `
Buat fungsi-fungsi berikut (\`keranjang\` = array of \`{ nama, harga, jumlah }\`):

1. \`totalHarga(keranjang)\` → total semua harga × jumlah.
2. \`totalItem(keranjang)\` → total jumlah barang (\`2 + 1 = 3\`).
3. \`tambahProduk(keranjang, produk)\` → \`produk\` berbentuk \`{ nama, harga }\`. Jika nama sudah ada, jumlahnya +1; jika belum, masukkan \`{ nama, harga, jumlah: 1 }\`. Kembalikan \`keranjang\`.
4. \`ringkasan(keranjang)\` → \`"3 barang, total Rp65.000"\`
`,
  kodeAwal: `const keranjang = [
  { nama: "Kopi", harga: 25000, jumlah: 2 },
  { nama: "Roti", harga: 15000, jumlah: 1 },
];

function totalHarga(keranjang) {

}

function totalItem(keranjang) {

}

function tambahProduk(keranjang, produk) {

}

function ringkasan(keranjang) {

}

console.log(ringkasan(keranjang));
`,
  solusi: `const keranjang = [
  { nama: "Kopi", harga: 25000, jumlah: 2 },
  { nama: "Roti", harga: 15000, jumlah: 1 },
];

function totalHarga(keranjang) {
  return keranjang.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
}

function totalItem(keranjang) {
  return keranjang.reduce((acc, item) => acc + item.jumlah, 0);
}

function tambahProduk(keranjang, produk) {
  const ada = keranjang.find((item) => item.nama === produk.nama);
  if (ada) {
    ada.jumlah += 1;
  } else {
    keranjang.push({ nama: produk.nama, harga: produk.harga, jumlah: 1 });
  }
  return keranjang;
}

function ringkasan(keranjang) {
  return \`\${totalItem(keranjang)} barang, total Rp\${totalHarga(keranjang).toLocaleString("id-ID")}\`;
}

console.log(ringkasan(keranjang));
tambahProduk(keranjang, { nama: "Kopi", harga: 25000 });
tambahProduk(keranjang, { nama: "Teh", harga: 8000 });
console.log(ringkasan(keranjang));
`,
  petunjuk: [
    'totalHarga: reduce dengan acc + item.harga * item.jumlah',
    'tambahProduk: pakai find untuk mencari item dengan nama yang sama.',
    'Format rupiah: totalHarga(keranjang).toLocaleString("id-ID")',
  ],
  tes: [
    {
      nama: 'totalHarga dan totalItem benar',
      cek(ctx) {
        const k = [{ nama: 'A', harga: 1000, jumlah: 3 }, { nama: 'B', harga: 500, jumlah: 2 }];
        if (ctx.panggil('totalHarga', k) !== 4000) return `totalHarga mengembalikan ${ctx.panggil('totalHarga', k)}, seharusnya 4000.`;
        if (ctx.panggil('totalHarga', []) !== 0) return 'totalHarga([]) seharusnya 0.';
        return ctx.panggil('totalItem', k) === 5 || `totalItem mengembalikan ${ctx.panggil('totalItem', k)}, seharusnya 5.`;
      },
    },
    {
      nama: 'tambahProduk menambah jumlah jika sudah ada',
      cek(ctx) {
        const k = [{ nama: 'Kopi', harga: 25000, jumlah: 2 }];
        ctx.panggil('tambahProduk', k, { nama: 'Kopi', harga: 25000 });
        if (k.length !== 1) return 'Kopi sudah ada di keranjang, jadi jangan ditambahkan sebagai item baru. Tambah jumlahnya saja.';
        return k[0].jumlah === 3 || `Setelah menambah Kopi, jumlahnya ${k[0].jumlah}, seharusnya 3.`;
      },
    },
    {
      nama: 'tambahProduk memasukkan produk baru dengan jumlah 1',
      cek(ctx) {
        const k = [{ nama: 'Kopi', harga: 25000, jumlah: 2 }];
        const r = ctx.panggil('tambahProduk', k, { nama: 'Teh', harga: 8000 });
        const teh = (r ?? k).find?.((i) => i.nama === 'Teh');
        if (!teh) return 'Produk baru (Teh) belum masuk ke keranjang.';
        if (teh.jumlah !== 1 || teh.harga !== 8000) return `Item Teh seharusnya { nama: "Teh", harga: 8000, jumlah: 1 }, sekarang ${JSON.stringify(teh)}.`;
        return r === k || 'tambahProduk harus mengembalikan keranjang.';
      },
    },
    {
      nama: 'ringkasan berformat Rupiah',
      cek(ctx) {
        const k = [{ nama: 'Kopi', harga: 25000, jumlah: 2 }, { nama: 'Roti', harga: 15000, jumlah: 1 }];
        const r = ctx.panggil('ringkasan', k);
        const h = '3 barang, total Rp65.000';
        return r === h || `ringkasan mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
      },
    },
  ],
};
