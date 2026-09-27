export default {
  id: 'react-state-object',
  judul: 'State Object',
  tipe: 'react',
  xp: 30,
  css: `.form { display: grid; gap: 6px; max-width: 300px; }
.kartu { margin-top: 12px; border: 2px solid #6d4aff; border-radius: 12px; padding: 10px 14px; max-width: 300px; }
.kartu h2 { margin: 0; }`,
  materi: `
# State berupa object

Kalau beberapa nilai saling berkaitan (misalnya isi satu form), kamu bisa menyimpannya dalam satu object:

~~~jsx
const [profil, setProfil] = useState({ nama: "", kota: "", bio: "" });
~~~

Aturannya sama seperti array: **jangan ubah object lama**, buat object baru dengan spread:

~~~jsx
// ❌ profil.nama = "Budi"; setProfil(profil);
// ✅
setProfil({ ...profil, nama: "Budi" });
~~~

\`setProfil\` **mengganti** seluruh object. Jadi kalau kamu lupa \`...profil\`, properti lain akan hilang!

## Satu handler untuk banyak input
Gunakan atribut \`name\` dan **computed property** \`[kunci]\`:

~~~jsx
function handleChange(e) {
  const { name, value } = e.target;       // destructuring
  setProfil({ ...profil, [name]: value }); // [name] = kunci dinamis
}

<input name="nama" value={profil.nama} onChange={handleChange} />
<input name="kota" value={profil.kota} onChange={handleChange} />
~~~

\`{ [name]: value }\` artinya "buat properti yang **namanya** diambil dari isi variabel \`name\`". Jika \`name\` berisi \`"kota"\`, hasilnya \`{ kota: value }\`.
`,
  tugas: `
Buat editor profil dengan **satu** state object \`profil\` berisi \`{ nama, kota, bio }\` (awal semua string kosong):

1. Tiga input terkontrol: \`<input name="nama">\`, \`<input name="kota">\`, \`<textarea name="bio">\`, yang **semuanya memakai satu fungsi** \`handleChange\`.
2. Kartu preview \`<div class="kartu">\`:
   - \`<h2>\` = nama, atau \`Tanpa Nama\` jika kosong
   - \`<p class="kota">\` = \`📍 <kota>\`, dan **hanya tampil** jika kota diisi
   - \`<p class="bio">\` = bio
3. Tombol \`Reset\` mengembalikan semua field ke kosong.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  const [profil, setProfil] = useState({ nama: "", kota: "", bio: "" });

  return (
    <div>
      <div className="form">
        <input name="nama" placeholder="Nama" />
        <input name="kota" placeholder="Kota" />
        <textarea name="bio" placeholder="Bio" />
        <button>Reset</button>
      </div>
      <div className="kartu">
        <h2>Tanpa Nama</h2>
      </div>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

const KOSONG = { nama: "", kota: "", bio: "" };

function App() {
  const [profil, setProfil] = useState(KOSONG);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfil({ ...profil, [name]: value });
  }

  return (
    <div>
      <div className="form">
        <input name="nama" placeholder="Nama" value={profil.nama} onChange={handleChange} />
        <input name="kota" placeholder="Kota" value={profil.kota} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={profil.bio} onChange={handleChange} />
        <button onClick={() => setProfil(KOSONG)}>Reset</button>
      </div>
      <div className="kartu">
        <h2>{profil.nama || "Tanpa Nama"}</h2>
        {profil.kota && <p className="kota">📍 {profil.kota}</p>}
        <p className="bio">{profil.bio}</p>
      </div>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'function handleChange(e) { const { name, value } = e.target; setProfil({ ...profil, [name]: value }); }',
    'Setiap input: value={profil.nama} onChange={handleChange}',
    '{profil.kota && <p className="kota">📍 {profil.kota}</p>}',
  ],
  tes: [
    {
      nama: 'Memakai satu state object & computed key',
      cek(ctx) {
        if ((ctx.kode.match(/useState\(/g) ?? []).length !== 1) return 'Gunakan tepat satu useState berisi object profil.';
        return /\[\s*name\s*\]\s*:/.test(ctx.kode) || 'Gunakan computed property: { ...profil, [name]: value }';
      },
    },
    {
      nama: 'Mengetik nama & bio memperbarui kartu tanpa menghapus field lain',
      async cek(ctx) {
        if (ctx.teks('.kartu h2') !== 'Tanpa Nama') return 'Saat nama kosong, <h2> berisi "Tanpa Nama".';
        await ctx.ketik('input[name="nama"]', 'Budi');
        await ctx.ketik('textarea[name="bio"]', 'Suka ngoding');
        if (ctx.teks('.kartu h2') !== 'Budi') return `<h2> berisi "${ctx.teks('.kartu h2')}", seharusnya "Budi".`;
        if (ctx.teks('.kartu .bio') !== 'Suka ngoding') return `.bio berisi "${ctx.teks('.kartu .bio')}".`;
        return ctx.cari('input[name="nama"]').value === 'Budi' || 'Nama hilang setelah mengisi bio. Jangan lupa ...profil.';
      },
    },
    {
      nama: 'Kota hanya tampil jika diisi',
      async cek(ctx) {
        if (ctx.ada('.kota')) return '<p class="kota"> belum boleh tampil saat kota kosong.';
        await ctx.ketik('input[name="kota"]', 'Bandung');
        return ctx.teks('.kota') === '📍 Bandung' || `.kota berisi "${ctx.ada('.kota') ? ctx.teks('.kota') : '(tidak ada)'}", seharusnya "📍 Bandung".`;
      },
    },
    {
      nama: 'Reset mengosongkan semua',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Reset'));
        const v = ['input[name="nama"]', 'input[name="kota"]', 'textarea[name="bio"]'].map((s) => ctx.cari(s).value);
        if (v.some((x) => x !== '')) return 'Setelah Reset, semua field harus kosong.';
        return ctx.teks('.kartu h2') === 'Tanpa Nama' || 'Setelah Reset, <h2> kembali "Tanpa Nama".';
      },
    },
  ],
};
