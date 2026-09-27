import {
  CSS_PORTOFOLIO, DATA_MENU, NAVBAR, HERO, DATA_INFO, ABOUT, DATA_SKILLS, SKILLS, DATA_PROYEK, PROJECTS,
  EL, buatApp, susun, cekSection,
} from '../_bersama/portofolio.js';

const PROJECTS_AWAL = `function ProjectCard({ judul, deskripsi, tech, status, link }) {
  return (
    <article className="proyek">
      <h3>{judul}</h3>
    </article>
  );
}

function Projects({ data }) {
  return (
    <section id="projects">
      <h2>Proyek</h2>
    </section>
  );
}`;

export default {
  id: 'portofolio-projects',
  judul: 'Portofolio 5: ProjectCard',
  tipe: 'react',
  xp: 45,
  css: CSS_PORTOFOLIO,
  materi: `
# Projects: komponen kartu yang dipakai ulang

Bagian terpenting portofolio adalah **daftar proyek**. Pecah menjadi dua komponen:
- \`ProjectCard\` → tampilan **satu** proyek (menerima props)
- \`Projects\` → section yang me-\`map\` data menjadi banyak \`ProjectCard\`

## Spread props
Kalau nama properti data **sama** dengan nama props komponen, kirim semuanya sekaligus dengan spread:

~~~jsx
{data.map((p) => (
  <ProjectCard key={p.id} {...p} />
))}
// sama dengan:
// <ProjectCard key={p.id} judul={p.judul} deskripsi={p.deskripsi} tech={p.tech} ... />
~~~

## Link ke luar
Untuk membuka tab baru, pakai \`target="_blank"\` dan (demi keamanan) \`rel="noreferrer"\`:

~~~jsx
<a href={link} target="_blank" rel="noreferrer">Lihat kode →</a>
~~~

## Kondisional
Proyek yang belum selesai tidak punya \`link\`. Tampilkan label lain dengan ternary.
`,
  tugas: `
1. Lengkapi \`ProjectCard({ judul, deskripsi, tech, status, link })\`:
   ~~~html
   <article class="proyek">
     <h3>judul</h3>
     <p>deskripsi</p>
     <div><span class="tag">React</span>...</div>
     <!-- status "selesai": --> <a href="link" target="_blank" rel="noreferrer">Lihat kode →</a>
     <!-- selain itu:       --> <span class="wip">🚧 Dalam pengerjaan</span>
   </article>
   ~~~
2. \`Projects({ data })\` → \`<section id="projects">\` berisi \`<h2>Proyek</h2>\` dan \`<div class="grid">\` berisi ProjectCard untuk setiap data (pakai \`{...p}\`).
3. Tampilkan \`<Projects data={PROYEK} />\` di App, di bawah Skills.
`,
  kodeAwal: susun(
    [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK, NAVBAR, HERO, ABOUT, SKILLS, PROJECTS_AWAL],
    buatApp([EL.navbar, EL.hero, EL.about, EL.skills]),
  ),
  solusi: susun(
    [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK, NAVBAR, HERO, ABOUT, SKILLS, PROJECTS],
    buatApp([EL.navbar, EL.hero, EL.about, EL.skills, EL.projects]),
  ),
  petunjuk: [
    '{data.map((p) => <ProjectCard key={p.id} {...p} />)}',
    '{status === "selesai" ? <a href={link} ...>Lihat kode →</a> : <span className="wip">🚧 Dalam pengerjaan</span>}',
  ],
  tes: [
    {
      nama: 'section#projects dengan 3 kartu',
      cek(ctx) {
        const c = cekSection(ctx, 'projects', 'Proyek');
        if (c !== true) return c;
        const k = ctx.cariSemua('#projects .grid article.proyek');
        if (k.length !== 3) return `Ada ${k.length} article.proyek di dalam .grid, seharusnya 3.`;
        const j = k.map((x) => x.querySelector('h3')?.textContent);
        return j.join() === 'Kalkulator Nilai,Todo React,Cuaca Kita' || `Judul proyek: [${j.join(', ')}].`;
      },
    },
    {
      nama: 'Deskripsi & tag teknologi',
      cek(ctx) {
        const k = ctx.cariSemua('#projects article.proyek');
        if (k[0]?.querySelector('p')?.textContent !== 'Menghitung nilai akhir dan grade mahasiswa.') return 'Tampilkan deskripsi di dalam <p>.';
        const tags = k[1]?.querySelectorAll('.tag') ?? [];
        return [...tags].map((t) => t.textContent).join() === 'React,CSS' || 'Proyek "Todo React" harus menampilkan tag React dan CSS (span.tag).';
      },
    },
    {
      nama: 'Link untuk proyek selesai, label untuk yang belum',
      cek(ctx) {
        const k = ctx.cariSemua('#projects article.proyek');
        const a = k[0]?.querySelector('a');
        if (!a || a.getAttribute('href') !== 'https://github.com/budi/kalkulator-nilai') return 'Proyek selesai harus punya <a href={link}>.';
        if (a.getAttribute('target') !== '_blank') return 'Link harus membuka tab baru: target="_blank".';
        if (a.textContent !== 'Lihat kode →') return `Teks link "${a.textContent}", seharusnya "Lihat kode →".`;
        if (k[2]?.querySelector('a')) return 'Proyek yang belum selesai tidak boleh punya link.';
        return k[2]?.querySelector('.wip')?.textContent === '🚧 Dalam pengerjaan' || 'Proyek belum selesai harus menampilkan <span className="wip">🚧 Dalam pengerjaan</span>.';
      },
    },
    {
      nama: 'Memakai spread props',
      cek: (ctx) => /<ProjectCard[^>]*\{\s*\.\.\.\s*\w+\s*\}/.test(ctx.kode) || 'Kirim data dengan spread: <ProjectCard key={p.id} {...p} />',
    },
  ],
};
