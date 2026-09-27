export default {
  id: 'react-onchange-input',
  judul: 'onChange & Input Terkontrol',
  tipe: 'react',
  xp: 25,
  css: `textarea { width: 100%; max-width: 360px; height: 70px; display: block; }
.info { color: #555; font-size: 14px; }
.info.lebih { color: #d93f5c; font-weight: bold; }
.preview { background: #f6f5fb; border-radius: 10px; padding: 8px 12px; max-width: 360px; white-space: pre-wrap; }`,
  materi: `
# Input terkontrol (controlled input)

Di Chapter 7 kamu membaca \`input.value\` kapan pun dibutuhkan. Di React, pola yang dipakai adalah **input terkontrol**: isi input disimpan di **state**, dan input selalu menampilkan isi state itu.

~~~jsx
function Nama() {
  const [nama, setNama] = useState("");

  return (
    <>
      <input value={nama} onChange={(e) => setNama(e.target.value)} />
      <p>Halo, {nama || "..."}!</p>
    </>
  );
}
~~~

Alurnya:
1. User mengetik satu huruf → event \`onChange\` terpicu.
2. \`setNama(e.target.value)\` memperbarui state.
3. React me-render ulang: input menampilkan \`value={nama}\` yang baru, dan \`<p>\` ikut berubah.

Keuntungannya, nilai input **selalu tersedia** di variabel \`nama\`, sehingga mudah divalidasi, dihitung, atau ditampilkan di tempat lain.

⚠️ Kalau kamu menulis \`value={nama}\` **tanpa** \`onChange\`, input tidak bisa diketik (read-only).

## Nilai turunan (derived state)
Jangan buat state untuk sesuatu yang bisa **dihitung** dari state lain:

~~~jsx
const [teks, setTeks] = useState("");
const jumlahKarakter = teks.length;   // ✅ cukup variabel biasa
// ❌ jangan: const [jumlahKarakter, setJumlahKarakter] = useState(0);
~~~
`,
  tugas: `
Buat editor status singkat (maks **50** karakter):

1. \`<textarea>\` terkontrol dengan state \`teks\`.
2. \`<p class="info">\` berisi \`12/50 karakter\` (sesuai panjang teks). Jika lebih dari 50, tambahkan class \`lebih\` dan teksnya menjadi \`Kelebihan 3 karakter!\`.
3. \`<div class="preview">\` menampilkan teks dalam **huruf kapital**; jika teks kosong tampilkan \`(kosong)\`.
4. Tombol \`Hapus\` mengosongkan teks.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  return (
    <div>
      <textarea />
      <p className="info">0/50 karakter</p>
      <div className="preview">(kosong)</div>
      <button>Hapus</button>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

const MAKS = 50;

function App() {
  const [teks, setTeks] = useState("");
  const panjang = teks.length;
  const lebih = panjang > MAKS;

  return (
    <div>
      <textarea value={teks} onChange={(e) => setTeks(e.target.value)} />
      <p className={lebih ? "info lebih" : "info"}>
        {lebih ? \`Kelebihan \${panjang - MAKS} karakter!\` : \`\${panjang}/\${MAKS} karakter\`}
      </p>
      <div className="preview">{teks ? teks.toUpperCase() : "(kosong)"}</div>
      <button onClick={() => setTeks("")}>Hapus</button>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    '<textarea value={teks} onChange={(e) => setTeks(e.target.value)} />',
    'Hitung const panjang = teks.length; tanpa state tambahan.',
    'Preview: {teks ? teks.toUpperCase() : "(kosong)"}',
  ],
  tes: [
    {
      nama: 'Textarea terkontrol & preview kapital',
      async cek(ctx) {
        await ctx.ketik('textarea', 'halo react');
        const p = ctx.teks('.preview');
        if (p !== 'HALO REACT') return `Setelah mengetik "halo react", .preview berisi "${p}", seharusnya "HALO REACT".`;
        return ctx.cari('textarea').value === 'halo react' || 'Nilai textarea harus mengikuti state (value={teks}).';
      },
    },
    {
      nama: 'Hitungan karakter',
      async cek(ctx) {
        await ctx.ketik('textarea', 'abcdefghijkl');
        const t = ctx.teks('.info');
        if (t !== '12/50 karakter') return `.info berisi "${t}", seharusnya "12/50 karakter".`;
        return !ctx.cari('.info').classList.contains('lebih') || 'Class "lebih" hanya jika teks > 50 karakter.';
      },
    },
    {
      nama: 'Peringatan saat lebih dari 50 karakter',
      async cek(ctx) {
        await ctx.ketik('textarea', 'x'.repeat(53));
        const info = ctx.cari('.info');
        if (ctx.teks('.info') !== 'Kelebihan 3 karakter!') return `Untuk 53 karakter, .info berisi "${ctx.teks('.info')}", seharusnya "Kelebihan 3 karakter!".`;
        return info.classList.contains('lebih') || '.info harus punya class "lebih".';
      },
    },
    {
      nama: 'Tombol Hapus mengosongkan',
      async cek(ctx) {
        await ctx.ketik('textarea', 'sesuatu');
        await ctx.klik(ctx.tombol('Hapus'));
        if (ctx.cari('textarea').value !== '') return 'Setelah Hapus, textarea harus kosong.';
        return ctx.teks('.preview') === '(kosong)' || `Setelah Hapus, .preview berisi "${ctx.teks('.preview')}", seharusnya "(kosong)".`;
      },
    },
  ],
};
