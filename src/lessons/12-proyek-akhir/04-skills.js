import { CSS_PORTOFOLIO, DATA_MENU, NAVBAR, HERO, DATA_INFO, ABOUT, DATA_SKILLS, SKILLS, EL, buatApp, susun, cekSection } from '../_bersama/portofolio.js';

const SKILLS_AWAL = `function Skills({ daftar }) {
  return (
    <section id="skills">
      <h2>Skill</h2>
    </section>
  );
}`;

export default {
  id: 'portofolio-skills',
  judul: 'Portofolio 4: Skills + Filter',
  tipe: 'react',
  xp: 45,
  css: CSS_PORTOFOLIO,
  materi: `
# Skills: array, state, dan filter

Bagian skill menampilkan keahlianmu beserta levelnya, dan bisa **difilter per kategori**.

## Level sebagai bintang
\`"★".repeat(3)\` menghasilkan \`"★★★"\`. Gabungkan bintang penuh dan kosong:

~~~js
"★".repeat(s.level) + "☆".repeat(5 - s.level)   // level 3 → "★★★☆☆"
~~~

## State di dalam komponen anak
State kategori yang dipilih **hanya dipakai di Skills**, jadi simpan di dalam komponen \`Skills\` itu sendiri, bukan di App. Aturan praktisnya: letakkan state **sedekat mungkin** dengan tempat state itu dipakai.

~~~jsx
function Skills({ daftar }) {
  const [kategori, setKategori] = useState("Semua");
  const tampil = kategori === "Semua" ? daftar : daftar.filter((s) => s.kategori === kategori);
  ...
}
~~~

Tombol filter juga bisa dibuat dari array:

~~~jsx
{["Semua", "Frontend", "Tools"].map((k) => (
  <button key={k} className={k === kategori ? "aktif" : ""} onClick={() => setKategori(k)}>
    {k}
  </button>
))}
~~~
`,
  tugas: `
Lengkapi \`Skills({ daftar })\` di dalam \`<section id="skills">\`:

1. \`<div class="filter">\` berisi tombol \`Semua\`, \`Frontend\`, \`Tools\`. Tombol yang dipilih diberi class \`aktif\` (awal: Semua).
2. \`<div class="grid">\` berisi setiap skill yang lolos filter:
   ~~~html
   <div class="skill"><span>HTML</span><span class="level">★★★★☆</span></div>
   ~~~
3. Tampilkan \`<Skills daftar={SKILLS} />\` di App, di bawah About.
`,
  kodeAwal: susun([DATA_MENU, DATA_INFO, DATA_SKILLS, NAVBAR, HERO, ABOUT, SKILLS_AWAL], buatApp([EL.navbar, EL.hero, EL.about])),
  solusi: susun([DATA_MENU, DATA_INFO, DATA_SKILLS, NAVBAR, HERO, ABOUT, SKILLS], buatApp([EL.navbar, EL.hero, EL.about, EL.skills])),
  petunjuk: [
    'const [kategori, setKategori] = useState("Semua"); di dalam Skills.',
    'const tampil = kategori === "Semua" ? daftar : daftar.filter((s) => s.kategori === kategori);',
    'Level: {"★".repeat(s.level) + "☆".repeat(5 - s.level)}',
  ],
  tes: [
    {
      nama: 'section#skills menampilkan 6 skill dengan bintang',
      cek(ctx) {
        const c = cekSection(ctx, 'skills', 'Skill');
        if (c !== true) return c;
        const s = ctx.cariSemua('#skills .grid .skill');
        if (s.length !== 6) return `Ada ${s.length} .skill, seharusnya 6.`;
        const html = s[0];
        if (html.querySelector('span')?.textContent !== 'HTML') return 'Skill pertama seharusnya HTML.';
        return html.querySelector('.level')?.textContent === '★★★★☆' || `Level HTML: "${html.querySelector('.level')?.textContent}", seharusnya "★★★★☆".`;
      },
    },
    {
      nama: 'Filter kategori bekerja',
      async cek(ctx) {
        const btn = (t) => ctx.cariSemua('#skills .filter button').find((b) => b.textContent.trim() === t);
        if (!btn('Semua') || !btn('Frontend') || !btn('Tools')) return 'Buat tombol Semua, Frontend, Tools di dalam .filter.';
        if (!btn('Semua').classList.contains('aktif')) return 'Awalnya tombol "Semua" punya class aktif.';
        await ctx.klik(btn('Tools'));
        const n = ctx.cariSemua('#skills .skill span:first-child').map((x) => x.textContent);
        if (n.join() !== 'Git,Figma') return `Filter Tools menampilkan [${n.join(', ')}], seharusnya [Git, Figma].`;
        if (!btn('Tools').classList.contains('aktif') || btn('Semua').classList.contains('aktif')) return 'Class aktif harus pindah ke tombol yang dipilih.';
        await ctx.klik(btn('Frontend'));
        if (ctx.cariSemua('#skills .skill').length !== 4) return 'Filter Frontend seharusnya menampilkan 4 skill.';
        await ctx.klik(btn('Semua'));
        return ctx.cariSemua('#skills .skill').length === 6 || 'Filter Semua seharusnya menampilkan 6 skill.';
      },
    },
    {
      nama: 'Urutan section',
      cek(ctx) {
        const urut = ctx.cariSemua('.halaman > *').map((e) => e.id || e.tagName.toLowerCase());
        return urut.join() === 'nav,home,about,skills' || `Urutan: ${urut.join(' → ')}.`;
      },
    },
  ],
};
