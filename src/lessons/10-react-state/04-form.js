export default {
  id: 'react-form-terkontrol',
  judul: 'Form Terkontrol & onSubmit',
  tipe: 'react',
  xp: 30,
  css: `form { display: grid; gap: 8px; max-width: 320px; }
.error { color: #d93f5c; margin: 0; }
.sukses { background: #e1f7ec; color: #15a36a; padding: 8px 12px; border-radius: 8px; }`,
  materi: `
# Form di React

Gabungkan input terkontrol dengan event \`onSubmit\` pada \`<form>\`:

~~~jsx
function FormLogin() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();          // tetap wajib, sama seperti Chapter 7
    console.log("Kirim:", email);
    setEmail("");                // kosongkan form
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Masuk</button>
    </form>
  );
}
~~~

- Pasang \`onSubmit\` di \`<form>\`, bukan \`onClick\` di tombol. Dengan begitu, menekan Enter juga berfungsi.
- Karena nilainya ada di state, mengosongkan form cukup dengan \`setEmail("")\`.

## Validasi & tombol nonaktif
~~~jsx
const valid = email.includes("@");
<button type="submit" disabled={!valid}>Masuk</button>
~~~

## Menyimpan pesan hasil
State juga bisa menyimpan pesan yang ditampilkan setelah submit:

~~~jsx
const [pesan, setPesan] = useState("");
...
{pesan && <p className="sukses">{pesan}</p>}
~~~
`,
  tugas: `
Buat form kontak dengan field **nama** (\`<input name="nama">\`) dan **pesan** (\`<textarea name="pesan">\`), serta tombol submit \`Kirim\`.

1. Tombol \`Kirim\` **disabled** jika nama kosong **atau** pesan kurang dari 10 karakter (setelah trim).
2. Jika pesan ada isinya tapi kurang dari 10 karakter, tampilkan \`<p class="error">Pesan minimal 10 karakter</p>\`.
3. Saat submit (\`preventDefault\`!): tampilkan \`<p class="sukses">Terima kasih, <nama>! Pesanmu terkirim.</p>\` lalu kosongkan kedua field.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  return (
    <form>
      <input name="nama" placeholder="Nama" />
      <textarea name="pesan" placeholder="Pesan" />
      <button type="submit">Kirim</button>
    </form>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

function App() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [terkirim, setTerkirim] = useState("");

  const pesanPendek = pesan.trim().length > 0 && pesan.trim().length < 10;
  const valid = nama.trim() !== "" && pesan.trim().length >= 10;

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    setTerkirim(\`Terima kasih, \${nama.trim()}! Pesanmu terkirim.\`);
    setNama("");
    setPesan("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nama" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
      <textarea name="pesan" placeholder="Pesan" value={pesan} onChange={(e) => setPesan(e.target.value)} />
      {pesanPendek && <p className="error">Pesan minimal 10 karakter</p>}
      <button type="submit" disabled={!valid}>Kirim</button>
      {terkirim && <p className="sukses">{terkirim}</p>}
    </form>
  );
}

export default App;
`,
  petunjuk: [
    'Buat state nama, pesan, dan terkirim (string pesan sukses).',
    'const valid = nama.trim() !== "" && pesan.trim().length >= 10;',
    '<form onSubmit={handleSubmit}> dan panggil e.preventDefault() di handleSubmit.',
  ],
  tes: [
    {
      nama: 'Tombol Kirim disabled sampai form valid',
      async cek(ctx) {
        const btn = () => ctx.tombol('Kirim');
        if (!btn().disabled) return 'Saat form kosong, tombol Kirim harus disabled.';
        await ctx.ketik('input[name="nama"]', 'Budi');
        await ctx.ketik('textarea[name="pesan"]', 'halo');
        if (!btn().disabled) return 'Pesan 4 karakter: tombol harus masih disabled.';
        await ctx.ketik('textarea[name="pesan"]', 'Halo, salam kenal ya!');
        return !btn().disabled || 'Nama terisi & pesan ≥ 10 karakter: tombol harus aktif.';
      },
    },
    {
      nama: 'Pesan error untuk pesan pendek',
      async cek(ctx) {
        await ctx.ketik('textarea[name="pesan"]', 'pendek');
        if (ctx.teks('.error') !== 'Pesan minimal 10 karakter') return 'Tampilkan <p class="error">Pesan minimal 10 karakter</p> saat pesan 1–9 karakter.';
        await ctx.ketik('textarea[name="pesan"]', '');
        return !ctx.ada('.error') || 'Saat pesan kosong, pesan error tidak perlu ditampilkan.';
      },
    },
    {
      nama: 'Submit menampilkan pesan sukses & mengosongkan form',
      async cek(ctx) {
        await ctx.ketik('input[name="nama"]', 'Sinta');
        await ctx.ketik('textarea[name="pesan"]', 'Aku mau kolaborasi proyek.');
        await ctx.kirim('form');
        const s = ctx.ada('.sukses') ? ctx.teks('.sukses') : '';
        if (s !== 'Terima kasih, Sinta! Pesanmu terkirim.') return `Pesan sukses: "${s}", seharusnya "Terima kasih, Sinta! Pesanmu terkirim.".`;
        if (ctx.cari('input[name="nama"]').value !== '' || ctx.cari('textarea[name="pesan"]').value !== '') return 'Setelah terkirim, kosongkan field nama dan pesan.';
        return true;
      },
    },
  ],
};
