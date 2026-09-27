export default {
  id: 'proyek-kalkulator-umkm',
  judul: 'Proyek Akhir: API Kalkulator Bisnis UMKM',
  tipe: 'js',
  xp: 60,
  proyek: true,
  materi: `
# 🛠️ Proyek Akhir: API Kalkulator Bisnis UMKM

Saatnya menggabungkan semua yang sudah dipelajari — HTTP, routing, req/res, validasi — jadi satu **backend nyata**: API kalkulator harga untuk pemilik UMKM (Usaha Mikro, Kecil, Menengah), misalnya pemilik warung atau toko kue rumahan yang ingin tahu berapa harga jual yang pas.

Di Node.js sungguhan, ini akan jadi satu endpoint:

~~~js
app.post('/api/hitung', (req, res) => {
  const hasil = handlerHitung(req);
  res.status(hasil.status).json(hasil.body);
});
~~~

## Rumus bisnis yang dipakai

- **HPP** (Harga Pokok Produksi) = biaya bahan + biaya tenaga kerja + biaya operasional, per unit.
- **Harga jual** = HPP + margin keuntungan (\`%\`): \`hpp * (1 + margin / 100)\`, dibulatkan ke rupiah terdekat.
- **Keuntungan per unit** = harga jual − HPP.
- **BEP** (Break-Even Point / titik impas, dalam unit) = berapa unit yang harus terjual supaya biaya tetap (sewa, listrik, dll — yang tidak berubah walau produksi naik/turun) balik modal:
  \`bep = biayaTetap / (hargaJual − biayaVariabelPerUnit)\`, dibulatkan **ke atas** (\`Math.ceil\`) karena unit tidak bisa pecahan.
  Kalau \`hargaJual\` tidak lebih besar dari \`biayaVariabelPerUnit\`, BEP mustahil tercapai (rugi terus per unit) — kembalikan \`null\`.
`,
  tugas: `
Buat empat fungsi:

1. \`hitungHpp({ bahan, tenagaKerja, operasional })\` → jumlah ketiganya.
2. \`hitungHargaJual(hpp, marginPersen)\` → \`Math.round(hpp * (1 + marginPersen / 100))\`.
3. \`hitungBep({ biayaTetap, hargaJual, biayaVariabelPerUnit })\` → \`Math.ceil(biayaTetap / (hargaJual - biayaVariabelPerUnit))\`, atau \`null\` kalau \`hargaJual <= biayaVariabelPerUnit\`.
4. \`handlerHitung(req)\` — "route handler" yang membaca \`req.body\`:
   \`{ bahan, tenagaKerja, operasional, marginPersen, biayaTetap, biayaVariabelPerUnit }\` (semua harus **angka**, dan \`marginPersen\` harus \`> 0\`).
   - Kalau ada field yang hilang / bukan angka / \`marginPersen <= 0\` → kembalikan \`{ status: 400, body: { pesan: "Data tidak lengkap atau tidak valid" } }\`.
   - Kalau valid → hitung semuanya, lalu kembalikan:
     \`{ status: 200, body: { hpp, hargaJual, keuntunganPerUnit, bep } }\`
`,
  kodeAwal: `function hitungHpp({ bahan, tenagaKerja, operasional }) {

}

function hitungHargaJual(hpp, marginPersen) {

}

function hitungBep({ biayaTetap, hargaJual, biayaVariabelPerUnit }) {

}

function handlerHitung(req) {

}
`,
  solusi: `function hitungHpp({ bahan, tenagaKerja, operasional }) {
  return bahan + tenagaKerja + operasional;
}

function hitungHargaJual(hpp, marginPersen) {
  return Math.round(hpp * (1 + marginPersen / 100));
}

function hitungBep({ biayaTetap, hargaJual, biayaVariabelPerUnit }) {
  if (hargaJual <= biayaVariabelPerUnit) return null;
  return Math.ceil(biayaTetap / (hargaJual - biayaVariabelPerUnit));
}

function handlerHitung(req) {
  const { bahan, tenagaKerja, operasional, marginPersen, biayaTetap, biayaVariabelPerUnit } = req.body ?? {};
  const semuaField = [bahan, tenagaKerja, operasional, marginPersen, biayaTetap, biayaVariabelPerUnit];
  const validAngka = semuaField.every((v) => typeof v === 'number' && !Number.isNaN(v));
  if (!validAngka || marginPersen <= 0) {
    return { status: 400, body: { pesan: 'Data tidak lengkap atau tidak valid' } };
  }

  const hpp = hitungHpp({ bahan, tenagaKerja, operasional });
  const hargaJual = hitungHargaJual(hpp, marginPersen);
  const keuntunganPerUnit = hargaJual - hpp;
  const bep = hitungBep({ biayaTetap, hargaJual, biayaVariabelPerUnit });

  return { status: 200, body: { hpp, hargaJual, keuntunganPerUnit, bep } };
}
`,
  petunjuk: [
    'hitungHpp: return bahan + tenagaKerja + operasional;',
    'hitungHargaJual: Math.round(hpp * (1 + marginPersen / 100))',
    'hitungBep: cek dulu hargaJual <= biayaVariabelPerUnit -> null, baru Math.ceil(biayaTetap / (hargaJual - biayaVariabelPerUnit))',
    'handlerHitung: destructure req.body, cek semua field dengan .every(v => typeof v === "number"), baru panggil 3 fungsi di atas.',
  ],
  tes: [
    {
      nama: 'hitungHpp menjumlahkan biaya',
      cek(ctx) {
        const r = ctx.panggil('hitungHpp', { bahan: 5000, tenagaKerja: 2000, operasional: 1000 });
        return r === 8000 || `hitungHpp(...) = ${JSON.stringify(r)}, seharusnya 8000.`;
      },
    },
    {
      nama: 'hitungHargaJual menambah margin',
      cek(ctx) {
        const r = ctx.panggil('hitungHargaJual', 8000, 25);
        return r === 10000 || `hitungHargaJual(8000, 25) = ${JSON.stringify(r)}, seharusnya 10000.`;
      },
    },
    {
      nama: 'hitungBep menghitung titik impas',
      cek(ctx) {
        const r = ctx.panggil('hitungBep', { biayaTetap: 500000, hargaJual: 10000, biayaVariabelPerUnit: 6000 });
        return r === 125 || `hitungBep(...) = ${JSON.stringify(r)}, seharusnya 125.`;
      },
    },
    {
      nama: 'hitungBep null kalau harga jual tidak menutup biaya variabel',
      cek(ctx) {
        const r = ctx.panggil('hitungBep', { biayaTetap: 500000, hargaJual: 5000, biayaVariabelPerUnit: 6000 });
        return r === null || `Seharusnya null karena hargaJual <= biayaVariabelPerUnit, dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'handlerHitung: request valid → 200 dengan hasil lengkap',
      cek(ctx) {
        const req = { body: { bahan: 5000, tenagaKerja: 2000, operasional: 1000, marginPersen: 25, biayaTetap: 500000, biayaVariabelPerUnit: 6000 } };
        const r = ctx.panggil('handlerHitung', req);
        const h = { hpp: 8000, hargaJual: 10000, keuntunganPerUnit: 2000, bep: 125 };
        if (r?.status !== 200) return `status = ${JSON.stringify(r?.status)}, seharusnya 200.`;
        for (const k of Object.keys(h)) {
          if (r?.body?.[k] !== h[k]) return `body.${k} = ${JSON.stringify(r?.body?.[k])}, seharusnya ${JSON.stringify(h[k])}.`;
        }
        return true;
      },
    },
    {
      nama: 'handlerHitung: field hilang → 400',
      cek(ctx) {
        const req = { body: { bahan: 5000, tenagaKerja: 2000, operasional: 1000, marginPersen: 25, biayaTetap: 500000 } };
        const r = ctx.panggil('handlerHitung', req);
        return r?.status === 400 || `Data tanpa biayaVariabelPerUnit seharusnya status 400, dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'handlerHitung: marginPersen <= 0 → 400',
      cek(ctx) {
        const req = { body: { bahan: 5000, tenagaKerja: 2000, operasional: 1000, marginPersen: 0, biayaTetap: 500000, biayaVariabelPerUnit: 6000 } };
        const r = ctx.panggil('handlerHitung', req);
        return r?.status === 400 || `marginPersen 0 seharusnya ditolak (status 400), dapat ${JSON.stringify(r)}.`;
      },
    },
  ],
};
