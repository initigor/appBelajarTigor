import { buatFetchPalsu, DAFTAR_ENDPOINT } from '../_bersama/apiPalsu.js';

export default {
  id: 'async-promise-all',
  judul: 'Promise.all: Paralel',
  tipe: 'js',
  xp: 30,
  batasWaktu: 6000,
  globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) }),
  materi: `
# Menjalankan beberapa request sekaligus

Kalau kamu butuh 3 data yang **tidak saling bergantung**, jangan tunggu satu per satu:

~~~js
// ❌ berurutan: 0,2 + 0,2 + 0,2 = 0,6 detik
const a = await ambilJson("/api/cuaca?kota=Bandung");
const b = await ambilJson("/api/cuaca?kota=Jakarta");
const c = await ambilJson("/api/cuaca?kota=Medan");
~~~

Jalankan semuanya **bersamaan** dengan \`Promise.all\`:

~~~js
// ✅ paralel: ±0,2 detik
const [a, b, c] = await Promise.all([
  ambilJson("/api/cuaca?kota=Bandung"),
  ambilJson("/api/cuaca?kota=Jakarta"),
  ambilJson("/api/cuaca?kota=Medan"),
]);
~~~

- \`Promise.all\` menerima **array Promise** dan menghasilkan **array hasil** dengan urutan yang sama.
- Jika **salah satu** gagal, seluruhnya reject.
- Perhatikan: tidak ada \`await\` di dalam array. Kita memulai ketiga request dulu, **baru** menunggu semuanya.

Pola ini sering dipakai bersama \`map\`:

~~~js
const kota = ["Bandung", "Jakarta"];
const hasil = await Promise.all(kota.map((k) => ambilJson(\`/api/cuaca?kota=\${k}\`)));
~~~

Mirip \`asyncio.gather(...)\` di Python.

## Endpoint latihan
${DAFTAR_ENDPOINT}
`,
  tugas: `
1. \`ambilJson(url)\` → fetch lalu kembalikan hasil \`res.json()\`.
2. \`cuacaBanyakKota(daftarKota)\` → array string \`"Kota: suhu°C"\` untuk setiap kota, diambil **secara paralel** dengan \`Promise.all\` + \`map\`.
   \`cuacaBanyakKota(["Bandung", "Jakarta"])\` → \`["Bandung: 24°C", "Jakarta: 32°C"]\`
3. \`kotaTerpanas(daftarKota)\` → nama kota dengan suhu tertinggi (juga paralel).

Tes akan mengukur waktu: 3 kota harus selesai jauh lebih cepat dari 0,6 detik.
`,
  kodeAwal: `async function ambilJson(url) {

}

async function cuacaBanyakKota(daftarKota) {
  const hasil = [];
  for (const kota of daftarKota) {
    const data = await ambilJson(\`/api/cuaca?kota=\${kota}\`);
    hasil.push(\`\${data.kota}: \${data.suhu}°C\`);
  }
  return hasil;
}

async function kotaTerpanas(daftarKota) {

}
`,
  solusi: `async function ambilJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function cuacaBanyakKota(daftarKota) {
  const semua = await Promise.all(daftarKota.map((kota) => ambilJson(\`/api/cuaca?kota=\${kota}\`)));
  return semua.map((data) => \`\${data.kota}: \${data.suhu}°C\`);
}

async function kotaTerpanas(daftarKota) {
  const semua = await Promise.all(daftarKota.map((kota) => ambilJson(\`/api/cuaca?kota=\${kota}\`)));
  const panas = semua.reduce((maks, c) => (c.suhu > maks.suhu ? c : maks));
  return panas.kota;
}

console.log(await cuacaBanyakKota(["Bandung", "Jakarta", "Medan"]));
console.log(await kotaTerpanas(["Bandung", "Jakarta", "Medan"]));
`,
  petunjuk: [
    'ambilJson: const res = await fetch(url); return res.json();',
    'await Promise.all(daftarKota.map((kota) => ambilJson(`/api/cuaca?kota=${kota}`)))',
  ],
  tes: [
    {
      nama: 'ambilJson mengembalikan data',
      async cek(ctx) {
        const r = await ctx.panggil('ambilJson', '/api/kutipan');
        return r?.oleh === 'Linus Torvalds' || `ambilJson("/api/kutipan") menghasilkan ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'cuacaBanyakKota benar & paralel',
      async cek(ctx) {
        const t0 = Date.now();
        const r = await ctx.panggil('cuacaBanyakKota', ['Bandung', 'Jakarta', 'Medan']);
        const lama = Date.now() - t0;
        if (JSON.stringify(r) !== '["Bandung: 24°C","Jakarta: 32°C","Medan: 29°C"]') return `Hasil: ${JSON.stringify(r)}.`;
        return lama < 450 || `Butuh ${lama} ms. Sepertinya request masih berurutan. Gunakan Promise.all supaya paralel.`;
      },
    },
    {
      nama: 'kotaTerpanas',
      async cek(ctx) {
        const r = await ctx.panggil('kotaTerpanas', ['Bandung', 'Medan', 'Jakarta']);
        if (r !== 'Jakarta') return `kotaTerpanas(...) menghasilkan ${JSON.stringify(r)}, seharusnya "Jakarta".`;
        return ctx.pakai('Promise.all') || 'Gunakan Promise.all.';
      },
    },
  ],
};
