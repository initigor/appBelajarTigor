import { buatFetchPalsu, DAFTAR_ENDPOINT } from '../_bersama/apiPalsu.js';

export default {
  id: 'async-promise-then',
  judul: 'Promise & fetch: then / catch',
  tipe: 'js',
  xp: 25,
  batasWaktu: 6000,
  globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) }),
  materi: `
# Promise: janji akan ada hasil

Mengambil data dari server butuh waktu. Fungsi seperti \`fetch\` tidak langsung mengembalikan datanya. Yang dikembalikan adalah sebuah **Promise**, yaitu object yang "berjanji" akan berisi hasil **nanti**.

Promise punya 3 keadaan:
- ⏳ **pending**: masih menunggu
- ✅ **fulfilled**: berhasil, ada nilainya
- ❌ **rejected**: gagal, ada error-nya

## then dan catch
~~~js
fetch("/api/mahasiswa")
  .then((res) => res.json())          // ubah respons menjadi data (juga Promise!)
  .then((data) => {
    console.log(data[0].nama);        // dijalankan setelah data siap
  })
  .catch((err) => {
    console.log("Gagal:", err.message);
  });

console.log("Ini tercetak DULUAN!");
~~~

- \`.then(callback)\` → dijalankan saat Promise berhasil. Nilai yang di-return dari callback diteruskan ke \`.then\` berikutnya (berantai).
- \`.catch(callback)\` → dijalankan jika ada error di mana pun dalam rantai.
- \`res.json()\` juga mengembalikan Promise, karena itu perlu \`.then\` lagi.

## API latihan
Di latihan ini \`fetch\` adalah **tiruan** yang berjalan offline. Endpoint yang tersedia:
${DAFTAR_ENDPOINT}
`,
  tugas: `
1. Ambil \`/api/mahasiswa\` dengan \`fetch\` + \`.then\`.
2. Isi variabel \`daftarNama\` (sudah disediakan) dengan array **nama** semua mahasiswa (pakai \`map\`), lalu cetak \`Jumlah mahasiswa: 3\`.
3. Tambahkan \`.catch\` yang mencetak \`Gagal: <pesan error>\`.
`,
  kodeAwal: `let daftarNama = [];

const hasil = fetch("/api/mahasiswa");
console.log(hasil); // kenapa bukan data?
`,
  solusi: `let daftarNama = [];

fetch("/api/mahasiswa")
  .then((res) => res.json())
  .then((data) => {
    daftarNama = data.map((m) => m.nama);
    console.log(\`Jumlah mahasiswa: \${data.length}\`);
  })
  .catch((err) => {
    console.log("Gagal:", err.message);
  });
`,
  petunjuk: [
    'fetch("/api/mahasiswa").then((res) => res.json()).then((data) => { ... })',
    'Di dalam then terakhir: daftarNama = data.map((m) => m.nama);',
  ],
  tes: [
    {
      nama: 'Memakai .then dan .catch',
      cek: (ctx) => (ctx.pakai('.then(') && ctx.pakai('.catch(')) || 'Gunakan .then(...) dan .catch(...).',
    },
    {
      nama: 'daftarNama berisi nama mahasiswa',
      cek(ctx) {
        const d = ctx.ambil('daftarNama');
        return JSON.stringify(d) === '["Budi","Sinta","Andi"]' || `daftarNama = ${JSON.stringify(d)}, seharusnya ["Budi","Sinta","Andi"].`;
      },
    },
    {
      nama: 'Mencetak "Jumlah mahasiswa: 3"',
      cek: (ctx) => ctx.harusLog('Jumlah mahasiswa: 3'),
    },
  ],
};
