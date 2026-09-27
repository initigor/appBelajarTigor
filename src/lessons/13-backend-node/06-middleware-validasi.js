export default {
  id: 'node-middleware',
  judul: 'Middleware & Validasi Input',
  tipe: 'js',
  xp: 30,
  materi: `
# Middleware & Validasi Input 🧱

**Middleware** adalah fungsi yang jalan **sebelum** handler utama — untuk logging, cek login, atau **validasi input**. Di Express, tiap middleware memanggil \`next()\` untuk lanjut ke middleware berikutnya, atau berhenti dengan mengirim response sendiri:

~~~js
function cekLogin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ pesan: "Belum login" });
  }
  next(); // lanjut ke middleware/handler berikutnya
}

app.post('/produk', cekLogin, (req, res) => {
  // hanya jalan kalau cekLogin memanggil next()
});
~~~

Validasi input adalah pemakaian middleware yang paling umum: **jangan pernah percaya data dari client**. Sebelum data dipakai, cek dulu bentuknya benar — kalau tidak, balas \`400 Bad Request\` dengan pesan yang jelas, dan **jangan lanjutkan** ke logika bisnis.

Chapter ini menyederhanakan middleware jadi: setiap fungsi menerima \`req\`, lalu **mengembalikan** \`req\` (boleh sudah diubah) untuk lanjut, atau \`{ error, status }\` untuk berhenti — tanpa perlu \`next\` terpisah.
`,
  tugas: `
Buat dua fungsi:

1. \`jalankanMiddleware(daftarFn, req)\` — jalankan setiap fungsi di \`daftarFn\` **berurutan**, masing-masing menerima \`req\` saat ini:
   - Jika hasilnya object berisi \`error\` → **berhenti** langsung dan kembalikan object itu (jangan jalankan fungsi berikutnya).
   - Jika bukan → hasil itu jadi \`req\` baru untuk fungsi berikutnya.
   - Kalau semua fungsi selesai tanpa error → kembalikan \`req\` terakhir.
2. \`validasiProduk(req)\` — middleware validasi untuk \`req.body = { nama, harga }\`:
   - Kalau \`nama\` bukan string atau kosong → \`{ error: "nama produk wajib diisi", status: 400 }\`.
   - Kalau \`harga\` bukan angka atau \`<= 0\` → \`{ error: "harga harus angka lebih dari 0", status: 400 }\`.
   - Kalau valid → kembalikan \`req\` apa adanya.
`,
  kodeAwal: `function jalankanMiddleware(daftarFn, req) {

}

function validasiProduk(req) {

}
`,
  solusi: `function jalankanMiddleware(daftarFn, req) {
  let current = req;
  for (const fn of daftarFn) {
    const hasil = fn(current);
    if (hasil && typeof hasil === 'object' && 'error' in hasil) return hasil;
    current = hasil;
  }
  return current;
}

function validasiProduk(req) {
  const { nama, harga } = req.body ?? {};
  if (typeof nama !== 'string' || nama.trim() === '') {
    return { error: 'nama produk wajib diisi', status: 400 };
  }
  if (typeof harga !== 'number' || harga <= 0) {
    return { error: 'harga harus angka lebih dari 0', status: 400 };
  }
  return req;
}
`,
  petunjuk: [
    'jalankanMiddleware: loop biasa, cek "error" in hasil untuk berhenti lebih awal.',
    'validasiProduk: destructuring const { nama, harga } = req.body ?? {};',
    'typeof nama !== "string" || nama.trim() === "" untuk cek nama kosong.',
  ],
  tes: [
    {
      nama: 'jalankanMiddleware menjalankan semua fungsi berurutan',
      cek(ctx) {
        const tambahA = (req) => ({ ...req, a: true });
        const tambahB = (req) => ({ ...req, b: true });
        const r = ctx.panggil('jalankanMiddleware', [tambahA, tambahB], {});
        return (r?.a === true && r?.b === true) || `Hasilnya ${JSON.stringify(r)}, seharusnya punya a dan b bernilai true.`;
      },
    },
    {
      nama: 'jalankanMiddleware berhenti di middleware yang error',
      cek(ctx) {
        let cSampai = false;
        const tambahA = (req) => ({ ...req, a: true });
        const gagalDiB = () => ({ error: 'gagal', status: 400 });
        const tambahC = (req) => {
          cSampai = true;
          return { ...req, c: true };
        };
        const r = ctx.panggil('jalankanMiddleware', [tambahA, gagalDiB, tambahC], {});
        if (cSampai) return 'Middleware setelah yang error seharusnya tidak dijalankan.';
        return r?.error === 'gagal' || `Hasilnya ${JSON.stringify(r)}, seharusnya object error dari middleware kedua.`;
      },
    },
    {
      nama: 'validasiProduk menolak nama kosong',
      cek(ctx) {
        const r = ctx.panggil('validasiProduk', { body: { nama: '', harga: 1000 } });
        return r?.status === 400 || `Nama kosong seharusnya ditolak (status 400), dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'validasiProduk menolak harga <= 0',
      cek(ctx) {
        const r = ctx.panggil('validasiProduk', { body: { nama: 'Kopi', harga: 0 } });
        return r?.status === 400 || `Harga 0 seharusnya ditolak (status 400), dapat ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'validasiProduk meloloskan data valid',
      cek(ctx) {
        const req = { body: { nama: 'Kopi', harga: 15000 } };
        const r = ctx.panggil('validasiProduk', req);
        return r === req || `Data valid seharusnya diloloskan apa adanya, dapat ${JSON.stringify(r)}.`;
      },
    },
  ],
};
