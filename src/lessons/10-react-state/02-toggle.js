export default {
  id: 'react-toggle-boolean',
  judul: 'State Boolean & Toggle',
  tipe: 'react',
  xp: 25,
  css: `.post { border: 1px solid #ddd; border-radius: 12px; padding: 12px 16px; max-width: 360px; }
.suka { background: #fde8ec; border-color: #ff5d8f; }
.detail { color: #555; }`,
  materi: `
# State boolean

State tidak harus angka. Boolean cocok untuk hal-hal yang punya dua kondisi: tampil/sembunyi, suka/tidak, terbuka/tertutup, gelap/terang.

~~~jsx
const [terbuka, setTerbuka] = useState(false);

<button onClick={() => setTerbuka(!terbuka)}>
  {terbuka ? "Tutup" : "Buka"}
</button>
{terbuka && <p>Isi rahasia</p>}
~~~

- \`!terbuka\` membalik nilai boolean (toggle).
- \`{kondisi && <elemen />}\` menampilkan elemen hanya jika kondisi \`true\` (short-circuit, Chapter 6).
- \`{kondisi ? a : b}\` memilih salah satu (ternary, Chapter 2).

## Beberapa state dalam satu komponen
Boleh! Setiap \`useState\` berdiri sendiri:

~~~jsx
const [disukai, setDisukai] = useState(false);
const [jumlahSuka, setJumlahSuka] = useState(10);
~~~

## Updater function
Kalau nilai baru bergantung pada nilai lama, cara paling aman adalah memberi **fungsi** ke setter:

~~~jsx
setJumlahSuka((lama) => lama + 1);
setTerbuka((t) => !t);
~~~

React akan memanggil fungsimu dengan nilai **terbaru**. Ini penting ketika ada beberapa update beruntun dalam satu event.
`,
  tugas: `
Buat kartu postingan \`<div class="post">\` (tambahkan class \`suka\` ketika disukai):

1. Tombol like: teks \`🤍 Suka (10)\`. Setelah diklik menjadi \`❤️ Disukai (11)\`. Klik lagi kembali ke \`🤍 Suka (10)\`.
2. Tombol \`Lihat detail\` menampilkan \`<p class="detail">Diposting oleh Budi, 2 jam lalu</p>\` dan teks tombolnya berubah menjadi \`Sembunyikan detail\`. Klik lagi untuk menyembunyikan (elemennya **tidak dirender** sama sekali).
`,
  kodeAwal: `import { useState } from "react";

function App() {
  return (
    <div className="post">
      <p>Hari ini aku belajar React! 🎉</p>
      <button>🤍 Suka (10)</button>
      <button>Lihat detail</button>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

function App() {
  const [disukai, setDisukai] = useState(false);
  const [jumlahSuka, setJumlahSuka] = useState(10);
  const [tampilDetail, setTampilDetail] = useState(false);

  function toggleSuka() {
    setJumlahSuka((j) => (disukai ? j - 1 : j + 1));
    setDisukai((d) => !d);
  }

  return (
    <div className={disukai ? "post suka" : "post"}>
      <p>Hari ini aku belajar React! 🎉</p>
      <button onClick={toggleSuka}>
        {disukai ? "❤️ Disukai" : "🤍 Suka"} ({jumlahSuka})
      </button>
      <button onClick={() => setTampilDetail((t) => !t)}>
        {tampilDetail ? "Sembunyikan detail" : "Lihat detail"}
      </button>
      {tampilDetail && <p className="detail">Diposting oleh Budi, 2 jam lalu</p>}
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Butuh 3 state: disukai (boolean), jumlahSuka (angka), tampilDetail (boolean).',
    'Teks tombol: {disukai ? "❤️ Disukai" : "🤍 Suka"} ({jumlahSuka})',
    '{tampilDetail && <p className="detail">...</p>}',
  ],
  tes: [
    {
      nama: 'Tombol suka toggle (teks & jumlah)',
      async cek(ctx) {
        const btn = ctx.tombol('Suka');
        if (btn.textContent.replace(/\s+/g, ' ').trim() !== '🤍 Suka (10)') return `Teks awal tombol: "${btn.textContent}", seharusnya "🤍 Suka (10)".`;
        await ctx.klik(btn);
        const t1 = ctx.tombol('Disukai').textContent.replace(/\s+/g, ' ').trim();
        if (t1 !== '❤️ Disukai (11)') return `Setelah diklik: "${t1}", seharusnya "❤️ Disukai (11)".`;
        await ctx.klik(ctx.tombol('Disukai'));
        const t2 = ctx.tombol('Suka').textContent.replace(/\s+/g, ' ').trim();
        return t2 === '🤍 Suka (10)' || `Setelah diklik lagi: "${t2}", seharusnya "🤍 Suka (10)".`;
      },
    },
    {
      nama: 'Class "suka" pada .post saat disukai',
      async cek(ctx) {
        const post = () => ctx.cari('.post');
        if (post().classList.contains('suka')) return 'Awalnya .post belum boleh punya class "suka".';
        await ctx.klik(ctx.tombol('Suka'));
        if (!post().classList.contains('suka')) return 'Saat disukai, .post harus punya class "suka".';
        await ctx.klik(ctx.tombol('Disukai'));
        return !post().classList.contains('suka') || 'Setelah batal suka, class "suka" harus hilang.';
      },
    },
    {
      nama: 'Detail tampil/sembunyi',
      async cek(ctx) {
        if (ctx.ada('.detail')) return '.detail belum boleh dirender di awal.';
        await ctx.klik(ctx.tombol('Lihat detail'));
        if (ctx.teks('.detail') !== 'Diposting oleh Budi, 2 jam lalu') return 'Setelah klik "Lihat detail", tampilkan <p class="detail">Diposting oleh Budi, 2 jam lalu</p>.';
        await ctx.klik(ctx.tombol('Sembunyikan detail'));
        return !ctx.ada('.detail') || 'Setelah klik "Sembunyikan detail", .detail harus hilang dari DOM.';
      },
    },
  ],
};
