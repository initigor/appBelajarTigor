export default {
  id: 'react-render-kondisional',
  judul: 'Render Kondisional',
  tipe: 'react',
  xp: 25,
  css: `.badge { background: #d93f5c; color: white; border-radius: 999px; padding: 0 8px; font-size: 12px; margin-left: 6px; }
.kosong { color: #888; font-style: italic; }
.pesan { border-bottom: 1px solid #eee; padding: 4px 0; }`,
  materi: `
# Menampilkan sesuatu berdasarkan kondisi

Di dalam JSX tidak bisa menulis \`if\`, karena JSX hanya menerima **ekspresi**. Ada tiga pola umum:

## 1. && : tampil atau tidak sama sekali
~~~jsx
{isAdmin && <button>Hapus semua</button>}
~~~

## 2. Ternary: pilih salah satu
~~~jsx
{isLogin ? <Profil /> : <TombolLogin />}
~~~

## 3. if di luar JSX / early return
Untuk logika yang lebih panjang, siapkan dulu hasilnya dengan \`if\` biasa **sebelum** \`return\`:

~~~jsx
function Daftar({ items }) {
  if (items.length === 0) {
    return <p className="kosong">Belum ada data</p>;   // early return
  }
  return <ul>{items.map(...)}</ul>;
}
~~~

## ⚠️ Jebakan angka 0
~~~jsx
{pesan.length && <span className="badge">{pesan.length}</span>}
~~~
Saat \`pesan.length\` bernilai \`0\`, hasil ekspresi adalah \`0\`, dan **React menampilkan angka 0** di layar! (\`false\`, \`null\`, dan \`undefined\` tidak ditampilkan, tapi \`0\` ditampilkan.) Pakai kondisi boolean:

~~~jsx
{pesan.length > 0 && <span className="badge">{pesan.length}</span>}
~~~
`,
  tugas: `
Buat kotak masuk sederhana. State \`pesan\` berisi array string, awalnya **kosong**.

1. \`<h2>Kotak Masuk</h2>\`, dan di dalam h2 tambahkan \`<span class="badge">n</span>\` **hanya jika** ada pesan. Pastikan tidak muncul angka 0!
2. Jika tidak ada pesan: tampilkan \`<p class="kosong">Kotak masuk kosong 📭</p>\`.
   Jika ada: tampilkan setiap pesan sebagai \`<div class="pesan">\`.
3. Tombol \`Pesan baru\` menambah pesan \`"Pesan #1"\`, \`"Pesan #2"\`, dst.
4. Tombol \`Hapus semua\` hanya tampil jika ada pesan, dan mengosongkan pesan.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  const [pesan, setPesan] = useState([]);

  return (
    <div>
      <h2>Kotak Masuk {pesan.length && <span className="badge">{pesan.length}</span>}</h2>
      <button onClick={() => setPesan([...pesan, \`Pesan #\${pesan.length + 1}\`])}>Pesan baru</button>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

function App() {
  const [pesan, setPesan] = useState([]);
  const ada = pesan.length > 0;

  return (
    <div>
      <h2>
        Kotak Masuk {ada && <span className="badge">{pesan.length}</span>}
      </h2>
      <button onClick={() => setPesan([...pesan, \`Pesan #\${pesan.length + 1}\`])}>Pesan baru</button>
      {ada && <button onClick={() => setPesan([])}>Hapus semua</button>}

      {ada ? (
        pesan.map((p) => (
          <div key={p} className="pesan">{p}</div>
        ))
      ) : (
        <p className="kosong">Kotak masuk kosong 📭</p>
      )}
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Ganti {pesan.length && ...} dengan {pesan.length > 0 && ...}',
    'Pilih tampilan: {pesan.length > 0 ? pesan.map(...) : <p className="kosong">...</p>}',
  ],
  tes: [
    {
      nama: 'Kondisi awal: kosong, tanpa badge, tanpa angka 0',
      cek(ctx) {
        const h2 = ctx.teks('h2');
        if (h2 !== 'Kotak Masuk') return `<h2> berisi "${h2}". Seharusnya hanya "Kotak Masuk"${/0/.test(h2) ? ' (ada angka 0 nyasar dari &&!)' : ''}.`;
        if (ctx.ada('.badge')) return 'Badge tidak boleh tampil saat tidak ada pesan.';
        if (ctx.teks('.kosong') !== 'Kotak masuk kosong 📭') return 'Tampilkan <p class="kosong">Kotak masuk kosong 📭</p> saat tidak ada pesan.';
        return ![...ctx.document.querySelectorAll('button')].some((b) => b.textContent.includes('Hapus semua')) || 'Tombol "Hapus semua" belum boleh tampil.';
      },
    },
    {
      nama: 'Pesan baru menampilkan pesan & badge',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Pesan baru'));
        await ctx.klik(ctx.tombol('Pesan baru'));
        const p = ctx.cariSemua('.pesan').map((x) => x.textContent);
        if (p.join() !== 'Pesan #1,Pesan #2') return `Pesan tampil: [${p.join(', ')}].`;
        if (ctx.ada('.kosong')) return '.kosong harus hilang jika ada pesan.';
        return ctx.teks('.badge') === '2' || 'Badge harus menampilkan jumlah pesan (2).';
      },
    },
    {
      nama: 'Hapus semua',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Hapus semua'));
        if (ctx.ada('.pesan')) return 'Semua pesan harus terhapus.';
        if (ctx.teks('h2') !== 'Kotak Masuk') return `Setelah dihapus, <h2> berisi "${ctx.teks('h2')}". Awas angka 0!`;
        return ctx.ada('.kosong') || 'Tampilkan lagi pesan kosong.';
      },
    },
  ],
};
