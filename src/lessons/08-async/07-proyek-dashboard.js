import { buatFetchPalsu, DAFTAR_ENDPOINT } from '../_bersama/apiPalsu.js';

export default {
  id: 'proyek-dashboard-async',
  judul: 'Mini Proyek: Dashboard Pengguna',
  tipe: 'js',
  xp: 50,
  proyek: true,
  batasWaktu: 8000,
  globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) }),
  materi: `
# 🛠️ Mini Proyek: Dashboard Pengguna

Kamu akan membuat fungsi yang menyiapkan data untuk halaman dashboard seorang blogger. Datanya berasal dari **dua endpoint**:

- \`/api/users/<id>\` → profil
- \`/api/posts?userId=<id>\` → daftar tulisan

Keduanya tidak saling bergantung, jadi ambil **secara paralel**. Jangan lupa menangani kasus user yang tidak ada (404).

## Mengurutkan tanggal
Tanggal berformat \`"2025-03-02"\` (ISO) bisa langsung dibandingkan sebagai string, karena urutan abjadnya sama dengan urutan waktunya:

~~~js
posts.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal));   // terbaru dulu
~~~

## Endpoint latihan
${DAFTAR_ENDPOINT}
`,
  tugas: `
Buat \`async function muatDashboard(userId)\` yang mengembalikan object:

~~~js
{
  nama: "Sinta Dewi",
  kota: "Bandung",
  jumlahTulisan: 3,
  tulisanTerbaru: "Portofolio Pertamaku",   // judul dengan tanggal paling baru
  semuaJudul: ["Portofolio Pertamaku", "Mengenal React", "Belajar JavaScript"]  // urut terbaru dulu
}
~~~

- Ambil user & posts secara **paralel** (\`Promise.all\`).
- Jika user tidak ditemukan (\`!res.ok\`), kembalikan \`null\`.
- User tanpa tulisan: \`jumlahTulisan: 0\`, \`tulisanTerbaru: "-"\`, \`semuaJudul: []\`.
`,
  kodeAwal: `async function muatDashboard(userId) {

}

console.log(await muatDashboard(1));
`,
  solusi: `async function muatDashboard(userId) {
  const [resUser, resPosts] = await Promise.all([
    fetch(\`/api/users/\${userId}\`),
    fetch(\`/api/posts?userId=\${userId}\`),
  ]);
  if (!resUser.ok) return null;

  const user = await resUser.json();
  const posts = await resPosts.json();
  const urut = posts.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return {
    nama: user.nama,
    kota: user.kota,
    jumlahTulisan: posts.length,
    tulisanTerbaru: urut[0]?.judul ?? "-",
    semuaJudul: urut.map((p) => p.judul),
  };
}

console.log(await muatDashboard(1));
`,
  petunjuk: [
    'const [resUser, resPosts] = await Promise.all([fetch(...), fetch(...)]);',
    'if (!resUser.ok) return null;',
    'tulisanTerbaru: urut[0]?.judul ?? "-"',
  ],
  tes: [
    {
      nama: 'Dashboard user 1 lengkap',
      async cek(ctx) {
        const r = await ctx.panggil('muatDashboard', 1);
        const h = {
          nama: 'Sinta Dewi',
          kota: 'Bandung',
          jumlahTulisan: 3,
          tulisanTerbaru: 'Portofolio Pertamaku',
          semuaJudul: ['Portofolio Pertamaku', 'Mengenal React', 'Belajar JavaScript'],
        };
        for (const k of Object.keys(h)) {
          if (JSON.stringify(r?.[k]) !== JSON.stringify(h[k])) return `muatDashboard(1).${k} = ${JSON.stringify(r?.[k])}, seharusnya ${JSON.stringify(h[k])}.`;
        }
        return true;
      },
    },
    {
      nama: 'User 2 & request paralel',
      async cek(ctx) {
        const t0 = Date.now();
        const r = await ctx.panggil('muatDashboard', 2);
        const lama = Date.now() - t0;
        if (r?.nama !== 'Budi Santoso' || r?.jumlahTulisan !== 1 || r?.tulisanTerbaru !== 'Tips Kuliah Online') return `muatDashboard(2) menghasilkan ${JSON.stringify(r)}.`;
        return lama < 350 || `Butuh ${lama} ms. Ambil user dan posts bersamaan dengan Promise.all.`;
      },
    },
    {
      nama: 'User tidak ada → null',
      async cek(ctx) {
        try {
          const r = await ctx.panggil('muatDashboard', 99);
          return r === null || `muatDashboard(99) menghasilkan ${JSON.stringify(r)}, seharusnya null.`;
        } catch (e) {
          return `muatDashboard(99) melempar error: ${e.message}. Cek res.ok dan kembalikan null.`;
        }
      },
    },
  ],
};
