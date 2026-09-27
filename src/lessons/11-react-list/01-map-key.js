export default {
  id: 'react-map-key',
  judul: 'Menampilkan List: map + key',
  tipe: 'react',
  xp: 25,
  css: `.proyek { border: 1px solid #ddd; border-radius: 10px; padding: 8px 12px; margin: 8px 0; max-width: 360px; }
.proyek h3 { margin: 0; }
.tag { display: inline-block; background: #ece6ff; color: #4b2fd0; border-radius: 999px; padding: 0 8px; margin-right: 4px; font-size: 12px; }`,
  materi: `
# map di dalam JSX

JSX bisa menampilkan **array berisi elemen**. Karena itu, pola paling umum untuk menampilkan data adalah memakai \`map\`:

~~~jsx
const buah = ["Apel", "Jeruk", "Mangga"];

<ul>
  {buah.map((b) => (
    <li key={b}>{b}</li>
  ))}
</ul>
~~~

Untuk array of object (bentuk data paling umum, Chapter 5):

~~~jsx
const proyek = [
  { id: 1, judul: "Kalkulator", tags: ["JS"] },
  { id: 2, judul: "Todo App", tags: ["React", "CSS"] },
];

{proyek.map((p) => (
  <div key={p.id} className="proyek">
    <h3>{p.judul}</h3>
    {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
  </div>
))}
~~~

Perhatikan: kurung \`( )\` setelah \`=>\` artinya langsung me-return JSX (arrow function bentuk singkat).

## key
Setiap elemen hasil \`map\` **wajib** punya prop \`key\` yang:
- **unik** di antara saudaranya
- **stabil** (tidak berubah antar-render)

React memakai \`key\` untuk mengenali item mana yang ditambah, dihapus, atau dipindah. Tanpa key, React akan memberi peringatan dan bisa salah memperbarui DOM (misalnya isi input tertukar setelah item dihapus).

✅ Pakai id dari data: \`key={p.id}\`
⚠️ Hindari \`key={index}\` jika urutan list bisa berubah (dihapus/diurutkan/disisipkan).

Kalau lebih nyaman, isi map boleh dipindah ke komponen sendiri: \`proyek.map((p) => <KartuProyek key={p.id} {...p} />)\`. Tulisan \`{...p}\` adalah spread props, yang mengirim semua properti \`p\` sebagai props.
`,
  tugas: `
Array \`daftarProyek\` sudah disediakan. Tampilkan setiap proyek sebagai:

~~~html
<div class="proyek">
  <h3>Kalkulator</h3>
  <p>Tahun 2024</p>
  <span class="tag">JavaScript</span><span class="tag">CSS</span>
</div>
~~~

- Pakai \`map\` dengan \`key={p.id}\` untuk proyek, dan \`key\` juga untuk tag.
- Di atas daftar, tampilkan \`<h2>3 Proyek</h2>\` (jumlahnya dihitung dari array).
`,
  kodeAwal: `const daftarProyek = [
  { id: 1, judul: "Kalkulator", tahun: 2024, tags: ["JavaScript", "CSS"] },
  { id: 2, judul: "Todo App", tahun: 2025, tags: ["React"] },
  { id: 3, judul: "Cuaca Kita", tahun: 2025, tags: ["React", "API"] },
];

function App() {
  return (
    <div>
      <div className="proyek">
        <h3>{daftarProyek[0].judul}</h3>
      </div>
    </div>
  );
}

export default App;
`,
  solusi: `const daftarProyek = [
  { id: 1, judul: "Kalkulator", tahun: 2024, tags: ["JavaScript", "CSS"] },
  { id: 2, judul: "Todo App", tahun: 2025, tags: ["React"] },
  { id: 3, judul: "Cuaca Kita", tahun: 2025, tags: ["React", "API"] },
];

function App() {
  return (
    <div>
      <h2>{daftarProyek.length} Proyek</h2>
      {daftarProyek.map((p) => (
        <div key={p.id} className="proyek">
          <h3>{p.judul}</h3>
          <p>Tahun {p.tahun}</p>
          {p.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
`,
  petunjuk: [
    '{daftarProyek.map((p) => ( <div key={p.id} className="proyek"> ... </div> ))}',
    'Tag: {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}',
  ],
  tes: [
    {
      nama: 'Memakai map dan key',
      cek(ctx) {
        if (!ctx.pakai('.map(')) return 'Gunakan daftarProyek.map(...).';
        return (ctx.kode.match(/key=\{/g) ?? []).length >= 2 || 'Beri key pada elemen hasil map (proyek dan tag).';
      },
    },
    {
      nama: 'Judul jumlah proyek',
      cek: (ctx) => ctx.teks('h2') === '3 Proyek' || `<h2> berisi "${ctx.ada('h2') ? ctx.teks('h2') : '(tidak ada)'}", seharusnya "3 Proyek".`,
    },
    {
      nama: 'Semua proyek tampil dengan judul, tahun, dan tag',
      cek(ctx) {
        const k = ctx.cariSemua('.proyek');
        if (k.length !== 3) return `Ada ${k.length} .proyek, seharusnya 3.`;
        const h = [['Kalkulator', 'Tahun 2024', 'JavaScript,CSS'], ['Todo App', 'Tahun 2025', 'React'], ['Cuaca Kita', 'Tahun 2025', 'React,API']];
        for (let i = 0; i < 3; i++) {
          const [j, t, tags] = h[i];
          if (k[i].querySelector('h3')?.textContent !== j) return `Proyek ke-${i + 1}: judul seharusnya "${j}".`;
          if (k[i].querySelector('p')?.textContent.replace(/\s+/g, ' ') !== t) return `Proyek "${j}": <p> seharusnya "${t}".`;
          const tg = [...k[i].querySelectorAll('.tag')].map((x) => x.textContent).join();
          if (tg !== tags) return `Proyek "${j}": tag [${tg}], seharusnya [${tags}].`;
        }
        return true;
      },
    },
  ],
};
