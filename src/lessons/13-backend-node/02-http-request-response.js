export default {
  id: 'node-http-siklus',
  judul: 'Cara Kerja HTTP: Request & Response',
  tipe: 'js',
  xp: 20,
  materi: `
# Cara Kerja HTTP: Request & Response 📨

Ingat \`fetch()\` di Chapter 8? Kamu mengirim **request** dan menerima **response** dengan \`res.ok\` dan \`res.status\`. Sekarang kita lihat dari sisi **server** yang membuat response itu.

Bayangkan seperti memesan makanan di restoran:
1. Kamu (**client**) mengirim **request** — pesanan — ke dapur.
2. Dapur (**server**) memprosesnya, lalu mengirim **response** — makanan (atau permintaan maaf kalau habis).

## Bagian sebuah HTTP request
- **Method** — jenis aksi: \`GET\` (ambil data), \`POST\` (kirim data baru), \`PUT\`/\`PATCH\` (ubah data), \`DELETE\` (hapus data).
- **URL / path** — alamat yang dituju, misalnya \`/api/produk\`.
- **Body** — data yang dikirim (biasanya JSON), dipakai di \`POST\`/\`PUT\`.

## Bagian sebuah HTTP response
- **Status code** — angka 3 digit yang menandai hasilnya. Digit pertama menunjukkan kategori:

| Kategori | Arti | Contoh |
| --- | --- | --- |
| \`2xx\` | Sukses | \`200\` OK, \`201\` Created (data baru berhasil dibuat) |
| \`4xx\` | Salah dari sisi **pengirim** | \`400\` Bad Request (data tidak valid), \`404\` Not Found |
| \`5xx\` | Salah di sisi **server** | \`500\` Internal Server Error |

- **Body** — data balasan (biasanya JSON juga).

Di Node.js (misalnya dengan Express), server menentukan status dan body ini secara eksplisit:

~~~js
res.status(404).json({ pesan: "Produk tidak ditemukan" });
~~~

\`res.ok\` yang kamu baca di Chapter 8 sebenarnya cuma singkatan dari "status-nya 2xx".
`,
  tugas: `
Buat dua fungsi untuk sisi **server**:

1. \`namaStatus(kode)\` → nama resmi status HTTP:
   - \`200\` → \`"OK"\`, \`201\` → \`"Created"\`, \`400\` → \`"Bad Request"\`, \`404\` → \`"Not Found"\`, \`500\` → \`"Internal Server Error"\`
   - Kode lain → \`"Unknown"\`
2. \`buatResponse(status, data)\` → object response server:
   \`{ status, ok, body: data }\` — \`ok\` bernilai \`true\` jika \`status\` antara 200–299.
`,
  kodeAwal: `function namaStatus(kode) {

}

function buatResponse(status, data) {

}
`,
  solusi: `function namaStatus(kode) {
  const peta = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    404: "Not Found",
    500: "Internal Server Error",
  };
  return peta[kode] ?? "Unknown";
}

function buatResponse(status, data) {
  return { status, ok: status >= 200 && status < 300, body: data };
}
`,
  petunjuk: [
    'namaStatus: buat object { 200: "OK", ... } lalu ambil peta[kode] ?? "Unknown".',
    'buatResponse: ok: status >= 200 && status < 300',
  ],
  tes: [
    {
      nama: 'namaStatus mengenali kode umum',
      cek(ctx) {
        const kasus = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 404: 'Not Found', 500: 'Internal Server Error' };
        for (const [k, v] of Object.entries(kasus)) {
          const r = ctx.panggil('namaStatus', Number(k));
          if (r !== v) return `namaStatus(${k}) menghasilkan ${JSON.stringify(r)}, seharusnya "${v}".`;
        }
        return true;
      },
    },
    {
      nama: 'namaStatus("Unknown") untuk kode asing',
      cek(ctx) {
        const r = ctx.panggil('namaStatus', 999);
        return r === 'Unknown' || `namaStatus(999) menghasilkan ${JSON.stringify(r)}, seharusnya "Unknown".`;
      },
    },
    {
      nama: 'buatResponse sukses (2xx)',
      cek(ctx) {
        const r = ctx.panggil('buatResponse', 200, { pesan: 'ok' });
        const h = { status: 200, ok: true, body: { pesan: 'ok' } };
        return JSON.stringify(r) === JSON.stringify(h) || `Hasilnya ${JSON.stringify(r)}, seharusnya ${JSON.stringify(h)}.`;
      },
    },
    {
      nama: 'buatResponse gagal (4xx) → ok: false',
      cek(ctx) {
        const r = ctx.panggil('buatResponse', 404, null);
        if (r?.ok !== false) return `buatResponse(404, null).ok = ${JSON.stringify(r?.ok)}, seharusnya false.`;
        return r?.status === 404 || `status = ${JSON.stringify(r?.status)}, seharusnya 404.`;
      },
    },
  ],
};
