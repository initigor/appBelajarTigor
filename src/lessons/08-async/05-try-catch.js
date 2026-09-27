import { buatFetchPalsu, DAFTAR_ENDPOINT } from '../_bersama/apiPalsu.js';

export default {
  id: 'async-try-catch',
  judul: 'try / catch & Error Handling',
  tipe: 'js',
  xp: 30,
  batasWaktu: 6000,
  globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) }),
  materi: `
# try / catch

Menangani error di JS mirip dengan Python:

| Python | JavaScript |
| --- | --- |
| \`try:\` | \`try {\` |
| \`except Exception as e:\` | \`} catch (e) {\` |
| \`finally:\` | \`} finally {\` |
| \`raise ValueError("x")\` | \`throw new Error("x")\` |

~~~js
try {
  const data = JSON.parse("{ bukan json }");
} catch (e) {
  console.log("Gagal parse:", e.message);
} finally {
  console.log("Selalu dijalankan");
}
~~~

C tidak punya exception, jadi di C kamu biasanya mengecek nilai return (\`if (f == NULL)\`).

## Dengan async/await
Promise yang **reject** akan menjadi **exception** saat di-\`await\`, sehingga bisa ditangkap dengan \`try/catch\` biasa:

~~~js
async function muat() {
  try {
    const res = await fetch("/api/error");
    ...
  } catch (e) {
    console.log("Koneksi bermasalah:", e.message);
  }
}
~~~

## ⚠️ fetch TIDAK error untuk 404!
\`fetch\` hanya reject kalau **koneksinya** gagal. Kalau server menjawab 404 atau 500, fetch tetap "berhasil". Kamu harus mengecek sendiri dengan \`res.ok\`:

~~~js
const res = await fetch("/api/mahasiswa/99");
if (!res.ok) {
  throw new Error(\`Server menjawab \${res.status}\`);
}
~~~

## Endpoint latihan
${DAFTAR_ENDPOINT}
`,
  tugas: `
1. \`ambilCuaca(kota)\` → fetch \`/api/cuaca?kota=<kota>\`.
   - jika \`!res.ok\` → \`\` throw new Error(\`Kota \${kota} tidak ditemukan\`) \`\`
   - jika berhasil → kembalikan string \`"Bandung: 24°C, Berawan"\`
2. \`cuacaAman(kota)\` → panggil \`ambilCuaca\` di dalam **try/catch**. Kembalikan hasilnya jika berhasil, atau \`"Gagal: <pesan error>"\` jika gagal.
3. \`cekKoneksi()\` → fetch \`/api/error\` di dalam try/catch. Kembalikan \`"Online"\` jika berhasil, \`"Offline"\` jika error.
`,
  kodeAwal: `async function ambilCuaca(kota) {
  const res = await fetch(\`/api/cuaca?kota=\${kota}\`);
  const data = await res.json();
  return \`\${data.kota}: \${data.suhu}°C, \${data.kondisi}\`;
}

async function cuacaAman(kota) {

}

async function cekKoneksi() {

}
`,
  solusi: `async function ambilCuaca(kota) {
  const res = await fetch(\`/api/cuaca?kota=\${kota}\`);
  if (!res.ok) {
    throw new Error(\`Kota \${kota} tidak ditemukan\`);
  }
  const data = await res.json();
  return \`\${data.kota}: \${data.suhu}°C, \${data.kondisi}\`;
}

async function cuacaAman(kota) {
  try {
    return await ambilCuaca(kota);
  } catch (e) {
    return \`Gagal: \${e.message}\`;
  }
}

async function cekKoneksi() {
  try {
    await fetch("/api/error");
    return "Online";
  } catch (e) {
    return "Offline";
  }
}

console.log(await cuacaAman("Bandung"));
console.log(await cuacaAman("Atlantis"));
`,
  petunjuk: [
    'Di ambilCuaca, cek if (!res.ok) sebelum res.json().',
    'cuacaAman: try { return await ambilCuaca(kota); } catch (e) { return `Gagal: ${e.message}`; }',
    'Perhatikan "return await" di dalam try. Tanpa await, error-nya tidak tertangkap oleh catch.',
  ],
  tes: [
    {
      nama: 'ambilCuaca berhasil untuk kota yang dikenal',
      async cek(ctx) {
        const r = await ctx.panggil('ambilCuaca', 'Jakarta');
        return r === 'Jakarta: 32°C, Cerah' || `ambilCuaca("Jakarta") menghasilkan ${JSON.stringify(r)}, seharusnya "Jakarta: 32°C, Cerah".`;
      },
    },
    {
      nama: 'ambilCuaca melempar Error untuk kota tak dikenal',
      async cek(ctx) {
        try {
          const r = await ctx.panggil('ambilCuaca', 'Atlantis');
          return `ambilCuaca("Atlantis") tidak melempar error, malah menghasilkan ${JSON.stringify(r)}. Cek res.ok!`;
        } catch (e) {
          return e?.message === 'Kota Atlantis tidak ditemukan' || `Pesan error: "${e?.message}", seharusnya "Kota Atlantis tidak ditemukan".`;
        }
      },
    },
    {
      nama: 'cuacaAman menangkap error',
      async cek(ctx) {
        const a = await ctx.panggil('cuacaAman', 'Medan');
        if (a !== 'Medan: 29°C, Hujan ringan') return `cuacaAman("Medan") menghasilkan ${JSON.stringify(a)}.`;
        let b;
        try {
          b = await ctx.panggil('cuacaAman', 'Atlantis');
        } catch (e) {
          return `cuacaAman("Atlantis") masih melempar error (${e.message}). Pastikan memakai "return await" di dalam try.`;
        }
        return b === 'Gagal: Kota Atlantis tidak ditemukan' || `cuacaAman("Atlantis") menghasilkan ${JSON.stringify(b)}.`;
      },
    },
    {
      nama: 'cekKoneksi → "Offline"',
      async cek(ctx) {
        try {
          const r = await ctx.panggil('cekKoneksi');
          return r === 'Offline' || `cekKoneksi() menghasilkan ${JSON.stringify(r)}, seharusnya "Offline" (karena /api/error selalu gagal).`;
        } catch (e) {
          return `cekKoneksi() melempar error: ${e.message}. Tangkap dengan try/catch.`;
        }
      },
    },
  ],
};
