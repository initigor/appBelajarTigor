export default {
  id: 'proyek-daftar-kontak',
  judul: 'Mini Proyek: Daftar Kontak',
  tipe: 'react',
  xp: 50,
  proyek: true,
  css: `.kontak { display: flex; align-items: center; gap: 8px; border: 1px solid #ddd; border-radius: 10px; padding: 6px 10px; margin: 6px 0; max-width: 380px; }
.kontak .nama { flex: 1; font-weight: 600; }
.kontak .telp { color: #666; font-size: 13px; }
.bintang { border: none; background: none; font-size: 18px; cursor: pointer; }
.kontrol { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }`,
  materi: `
# 🛠️ Mini Proyek: Daftar Kontak

Gabungkan semua isi Chapter 10 dan 11 menjadi satu aplikasi kecil:
- **state array of object** yang diperbarui tanpa mutasi (tandai favorit)
- **input terkontrol** untuk pencarian dan **checkbox** untuk filter
- **nilai turunan**: daftar yang tampil dihitung dari state (filter → sort)
- **map + key**, dan **render kondisional** untuk hasil kosong
- **komponen terpisah** dengan props, termasuk fungsi sebagai props

## Fungsi sebagai props
Komponen anak tidak boleh mengubah state milik induk secara langsung. Induk mengirimkan **fungsi**, lalu anak memanggilnya:

~~~jsx
function Kontak({ data, onToggleFavorit }) {
  return <button onClick={() => onToggleFavorit(data.id)}>⭐</button>;
}

// di App:
<Kontak data={k} onToggleFavorit={toggleFavorit} />
~~~

Konvensinya, props berisi fungsi event diberi nama \`onSesuatu\`.

## Checkbox terkontrol
~~~jsx
<input type="checkbox" checked={hanyaFavorit} onChange={(e) => setHanyaFavorit(e.target.checked)} />
~~~
(Untuk checkbox, yang dibaca \`checked\`, bukan \`value\`.)
`,
  tugas: `
Data awal \`KONTAK_AWAL\` sudah disediakan.

1. Komponen \`Kontak({ data, onToggleFavorit })\` → \`<div class="kontak">\` berisi \`<span class="nama">\`, \`<span class="telp">\`, dan \`<button class="bintang">\` yang menampilkan \`⭐\` jika favorit atau \`☆\` jika bukan. Klik bintang memanggil \`onToggleFavorit(data.id)\`.
2. Di \`App\`: state \`kontak\`, kata kunci pencarian, dan \`hanyaFavorit\`.
   - \`<input placeholder="Cari kontak...">\` → filter berdasarkan nama (tidak peka huruf besar/kecil).
   - \`<input type="checkbox">\` "Hanya favorit".
   - Urutan tampil: **favorit dulu**, lalu **abjad** nama.
   - Jika kosong: \`<p class="kosong">Tidak ada kontak</p>\`.
   - \`<p class="jumlah">\` = \`<n> favorit\` (jumlah total favorit, bukan hanya yang tampil).
`,
  kodeAwal: `import { useState } from "react";

const KONTAK_AWAL = [
  { id: 1, nama: "Sinta", telp: "0812-1111", favorit: false },
  { id: 2, nama: "Andi", telp: "0813-2222", favorit: true },
  { id: 3, nama: "Budi", telp: "0814-3333", favorit: false },
  { id: 4, nama: "Citra", telp: "0815-4444", favorit: false },
];

function Kontak({ data, onToggleFavorit }) {

}

function App() {
  return <div></div>;
}

export default App;
`,
  solusi: `import { useState } from "react";

const KONTAK_AWAL = [
  { id: 1, nama: "Sinta", telp: "0812-1111", favorit: false },
  { id: 2, nama: "Andi", telp: "0813-2222", favorit: true },
  { id: 3, nama: "Budi", telp: "0814-3333", favorit: false },
  { id: 4, nama: "Citra", telp: "0815-4444", favorit: false },
];

function Kontak({ data, onToggleFavorit }) {
  return (
    <div className="kontak">
      <span className="nama">{data.nama}</span>
      <span className="telp">{data.telp}</span>
      <button className="bintang" onClick={() => onToggleFavorit(data.id)}>
        {data.favorit ? "⭐" : "☆"}
      </button>
    </div>
  );
}

function App() {
  const [kontak, setKontak] = useState(KONTAK_AWAL);
  const [kunci, setKunci] = useState("");
  const [hanyaFavorit, setHanyaFavorit] = useState(false);

  function toggleFavorit(id) {
    setKontak(kontak.map((k) => (k.id === id ? { ...k, favorit: !k.favorit } : k)));
  }

  const tampil = kontak
    .filter((k) => k.nama.toLowerCase().includes(kunci.trim().toLowerCase()))
    .filter((k) => !hanyaFavorit || k.favorit)
    .sort((a, b) => {
      if (a.favorit !== b.favorit) return a.favorit ? -1 : 1;
      return a.nama.localeCompare(b.nama);
    });

  const jumlahFavorit = kontak.filter((k) => k.favorit).length;

  return (
    <div>
      <div className="kontrol">
        <input placeholder="Cari kontak..." value={kunci} onChange={(e) => setKunci(e.target.value)} />
        <label>
          <input type="checkbox" checked={hanyaFavorit} onChange={(e) => setHanyaFavorit(e.target.checked)} /> Hanya favorit
        </label>
      </div>
      <p className="jumlah">{jumlahFavorit} favorit</p>
      {tampil.length === 0 ? (
        <p className="kosong">Tidak ada kontak</p>
      ) : (
        tampil.map((k) => <Kontak key={k.id} data={k} onToggleFavorit={toggleFavorit} />)
      )}
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'toggleFavorit: setKontak(kontak.map((k) => (k.id === id ? { ...k, favorit: !k.favorit } : k)));',
    'Rantai: kontak.filter(cari).filter(favorit).sort(...). filter sudah membuat array baru, jadi sort aman.',
    'Sort: if (a.favorit !== b.favorit) return a.favorit ? -1 : 1; return a.nama.localeCompare(b.nama);',
  ],
  tes: [
    {
      nama: 'Urutan awal: favorit dulu, lalu abjad',
      cek(ctx) {
        const n = ctx.cariSemua('.kontak .nama').map((x) => x.textContent);
        if (n.join() !== 'Andi,Budi,Citra,Sinta') return `Urutan tampil: [${n.join(', ')}], seharusnya [Andi, Budi, Citra, Sinta].`;
        const b = ctx.cariSemua('.kontak .bintang').map((x) => x.textContent);
        if (b.join('') !== '⭐☆☆☆') return `Bintang: ${b.join(' ')}. Andi favorit (⭐), lainnya ☆.`;
        return ctx.teks('.jumlah') === '1 favorit' || `.jumlah berisi "${ctx.teks('.jumlah')}".`;
      },
    },
    {
      nama: 'Klik bintang menjadikan favorit & mengubah urutan',
      async cek(ctx) {
        const sinta = ctx.cariSemua('.kontak').find((k) => k.querySelector('.nama')?.textContent === 'Sinta');
        await ctx.klik(sinta.querySelector('.bintang'));
        const n = ctx.cariSemua('.kontak .nama').map((x) => x.textContent);
        if (n.join() !== 'Andi,Sinta,Budi,Citra') return `Setelah Sinta jadi favorit, urutan: [${n.join(', ')}], seharusnya [Andi, Sinta, Budi, Citra].`;
        return ctx.teks('.jumlah') === '2 favorit' || `.jumlah berisi "${ctx.teks('.jumlah')}".`;
      },
    },
    {
      nama: 'Filter hanya favorit & pencarian',
      async cek(ctx) {
        await ctx.klik('input[type="checkbox"]');
        let n = ctx.cariSemua('.kontak .nama').map((x) => x.textContent);
        if (n.join() !== 'Andi,Sinta') return `Hanya favorit: [${n.join(', ')}], seharusnya [Andi, Sinta].`;
        await ctx.ketik('input[placeholder="Cari kontak..."]', 'SIN');
        n = ctx.cariSemua('.kontak .nama').map((x) => x.textContent);
        if (n.join() !== 'Sinta') return `Cari "SIN" + favorit: [${n.join(', ')}].`;
        await ctx.ketik('input[placeholder="Cari kontak..."]', 'budi');
        return ctx.teks('.kosong') === 'Tidak ada kontak' || 'Budi bukan favorit, jadi harus muncul <p class="kosong">Tidak ada kontak</p>.';
      },
    },
  ],
};
