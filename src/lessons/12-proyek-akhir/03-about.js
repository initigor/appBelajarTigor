import { CSS_PORTOFOLIO, DATA_MENU, NAVBAR, HERO, DATA_INFO, ABOUT, EL, buatApp, susun, cekSection } from '../_bersama/portofolio.js';

const ABOUT_AWAL = `function About({ info }) {
  return (
    <section id="about">
      <h2>Tentang Saya</h2>
      <p>Aku suka membangun aplikasi web yang sederhana tapi berguna.</p>
      {/* tampilkan isi info di sini */}
    </section>
  );
}`;

export default {
  id: 'portofolio-about',
  judul: 'Portofolio 3: About',
  tipe: 'react',
  xp: 40,
  css: CSS_PORTOFOLIO,
  materi: `
# About: data diri dari object

Data diri seperti kampus, jurusan, dan domisili cocok disimpan sebagai **object** (Chapter 5):

~~~js
const INFO = {
  Kampus: "Universitas Nusantara",
  Jurusan: "Teknik Informatika",
  Semester: 5,
  Domisili: "Bandung",
};
~~~

Object tidak bisa langsung di-\`map\`, jadi ubah dulu dengan \`Object.entries\`, lalu destructure setiap pasangannya:

~~~jsx
{Object.entries(info).map(([kunci, nilai]) => (
  <li key={kunci}>
    <b>{kunci}:</b> {nilai}
  </li>
))}
~~~

Hasilnya, menambah data diri cukup dengan menambah satu baris di \`INFO\`, tanpa menyentuh JSX.

## Komentar di JSX
Di dalam JSX, komentar ditulis \`{/* ... */}\`. Komentar \`//\` biasa tidak bisa dipakai di antara tag.
`,
  tugas: `
1. Di komponen \`About\`, tampilkan isi props \`info\` sebagai:
   ~~~html
   <ul class="info">
     <li><b>Kampus:</b> Universitas Nusantara</li>
     ...
   </ul>
   ~~~
   memakai \`Object.entries\` + \`map\` + \`key\`.
2. Tampilkan \`<About info={INFO} />\` di App, di bawah Hero.
`,
  kodeAwal: susun([DATA_MENU, DATA_INFO, NAVBAR, HERO, ABOUT_AWAL], buatApp([EL.navbar, EL.hero])),
  solusi: susun([DATA_MENU, DATA_INFO, NAVBAR, HERO, ABOUT], buatApp([EL.navbar, EL.hero, EL.about])),
  petunjuk: [
    '<ul className="info">{Object.entries(info).map(([kunci, nilai]) => ( ... ))}</ul>',
    'Isi <li>: <b>{kunci}:</b> {nilai}',
  ],
  tes: [
    {
      nama: 'section#about dengan judul "Tentang Saya"',
      cek: (ctx) => cekSection(ctx, 'about', 'Tentang Saya'),
    },
    {
      nama: 'ul.info berisi 4 data diri',
      cek(ctx) {
        const li = ctx.cariSemua('#about ul.info li').map((x) => x.textContent.replace(/\s+/g, ' ').trim());
        const h = ['Kampus: Universitas Nusantara', 'Jurusan: Teknik Informatika', 'Semester: 5', 'Domisili: Bandung'];
        if (li.length !== 4) return `ul.info berisi ${li.length} <li>, seharusnya 4.`;
        for (let i = 0; i < 4; i++) if (li[i] !== h[i]) return `<li> ke-${i + 1}: "${li[i]}", seharusnya "${h[i]}".`;
        return ctx.cariSemua('#about ul.info li b').length === 4 || 'Bungkus nama data dengan <b>...</b>.';
      },
    },
    {
      nama: 'Memakai Object.entries & urutan section',
      cek(ctx) {
        if (!/Object\.entries\(\s*info\s*\)/.test(ctx.kode)) return 'Gunakan Object.entries(info).';
        const urut = ctx.cariSemua('.halaman > *').map((e) => e.id || e.tagName.toLowerCase());
        return urut.join() === 'nav,home,about' || `Urutan: ${urut.join(' → ')}, seharusnya nav → home → about.`;
      },
    },
  ],
};
