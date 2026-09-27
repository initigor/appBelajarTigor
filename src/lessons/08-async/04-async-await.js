import { buatFetchPalsu, DAFTAR_ENDPOINT } from '../_bersama/apiPalsu.js';

export default {
  id: 'async-await',
  judul: 'async / await',
  tipe: 'js',
  xp: 30,
  batasWaktu: 6000,
  globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) }),
  materi: `
# async / await: Promise yang terasa seperti kode biasa

Rantai \`.then\` cepat membuat kode berantakan. \`async/await\` membuat kode asynchronous **terbaca dari atas ke bawah**, mirip kode C/Python biasa:

~~~js
// versi then
function ambilNama() {
  return fetch("/api/mahasiswa/1")
    .then((res) => res.json())
    .then((mhs) => mhs.nama);
}

// versi async/await
async function ambilNama() {
  const res = await fetch("/api/mahasiswa/1");
  const mhs = await res.json();
  return mhs.nama;
}
~~~

Aturannya:
- \`await\` **menunggu** Promise selesai lalu memberikan nilainya. Fungsi ini "berhenti sejenak", tapi halaman tetap responsif.
- \`await\` hanya boleh dipakai di dalam fungsi \`async\` (atau di level teratas modul).
- Fungsi \`async\` **selalu mengembalikan Promise**. Jadi pemanggilnya juga harus \`await\` atau \`.then\`:

~~~js
const nama = await ambilNama();   // ✅ "Budi"
const salah = ambilNama();        // ❌ Promise { <pending> }
~~~

Python punya sintaks yang sama persis: \`async def\` dan \`await\` (asyncio).

## Endpoint latihan
${DAFTAR_ENDPOINT}
`,
  tugas: `
Pakai **async/await** (tanpa \`.then\`):

1. \`ambilMahasiswa(id)\` → object mahasiswa dari \`/api/mahasiswa/<id>\`.
2. \`ambilSemuaNama()\` → array nama dari \`/api/mahasiswa\`.
3. \`rataRataIpk()\` → rata-rata IPK semua mahasiswa, dibulatkan 2 desimal (\`Math.round(x * 100) / 100\`).
`,
  kodeAwal: `function ambilMahasiswa(id) {
  return fetch(\`/api/mahasiswa/\${id}\`)
    .then((res) => res.json());
}

// buat ambilSemuaNama dan rataRataIpk dengan async/await
`,
  solusi: `async function ambilMahasiswa(id) {
  const res = await fetch(\`/api/mahasiswa/\${id}\`);
  return await res.json();
}

async function ambilSemuaNama() {
  const res = await fetch("/api/mahasiswa");
  const data = await res.json();
  return data.map((m) => m.nama);
}

async function rataRataIpk() {
  const res = await fetch("/api/mahasiswa");
  const data = await res.json();
  const total = data.reduce((acc, m) => acc + m.ipk, 0);
  return Math.round((total / data.length) * 100) / 100;
}

console.log(await ambilSemuaNama());
console.log(await rataRataIpk());
`,
  petunjuk: [
    'async function ambilSemuaNama() { const res = await fetch("/api/mahasiswa"); const data = await res.json(); ... }',
    'Jangan lupa await di depan res.json().',
  ],
  tes: [
    {
      nama: 'Memakai async/await tanpa .then',
      cek(ctx) {
        if (!ctx.pakai('async function') && !ctx.pakai(/async\s*\(/)) return 'Tandai fungsinya dengan async.';
        if (!ctx.pakai('await')) return 'Gunakan await.';
        return !ctx.pakai('.then(') || 'Di latihan ini, ganti semua .then dengan await.';
      },
    },
    {
      nama: 'ambilMahasiswa(2) → Sinta',
      async cek(ctx) {
        const m = await ctx.panggil('ambilMahasiswa', 2);
        return m?.nama === 'Sinta' || `ambilMahasiswa(2) menghasilkan ${JSON.stringify(m)}, seharusnya object dengan nama "Sinta".`;
      },
    },
    {
      nama: 'ambilSemuaNama',
      async cek(ctx) {
        const p = ctx.panggil('ambilSemuaNama');
        if (!p || typeof p.then !== 'function') return 'ambilSemuaNama harus berupa fungsi async.';
        const r = await p;
        return JSON.stringify(r) === '["Budi","Sinta","Andi"]' || `ambilSemuaNama() menghasilkan ${JSON.stringify(r)}.`;
      },
    },
    {
      nama: 'rataRataIpk = 3.4',
      async cek(ctx) {
        const r = await ctx.panggil('rataRataIpk');
        return r === 3.4 || `rataRataIpk() menghasilkan ${JSON.stringify(r)}, seharusnya 3.4.`;
      },
    },
  ],
};
