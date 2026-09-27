import {
  CSS_PORTOFOLIO, DATA_MENU, NAVBAR_TEMA, HERO, DATA_INFO, ABOUT, DATA_SKILLS, SKILLS, DATA_PROYEK, PROJECTS, CONTACT, FOOTER,
  EL, buatApp, susun,
} from '../_bersama/portofolio.js';

const DATA = [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK];
const KOMPONEN = [NAVBAR_TEMA, HERO, ABOUT, SKILLS, PROJECTS, CONTACT];
const ISI = [EL.navbarTema, EL.hero, EL.about, EL.skills, EL.projects, EL.contact];

const FOOTER_AWAL = `// Buat komponen Footer di sini`;

export default {
  id: 'portofolio-final',
  judul: 'Portofolio 8: Footer & Finishing 🎓',
  tipe: 'react',
  xp: 60,
  proyek: true,
  css: CSS_PORTOFOLIO,
  materi: `
# 🎓 Sentuhan terakhir

Tinggal satu komponen lagi: **Footer**. Setelah itu, portofoliomu lengkap!

## Tahun otomatis
Jangan menulis tahun secara manual, karena nanti harus diganti setiap tahun. Pakai \`Date\`:

~~~js
new Date().getFullYear();   // mis. 2025
~~~

## Membawa proyek ini ke dunia nyata 🚀
Kode di editor ini adalah **satu file App.jsx** yang siap dipindahkan ke proyek React sungguhan:

~~~bash
npm create vite@latest portofolio-ku -- --template react
cd portofolio-ku
npm install
npm run dev
~~~

Lalu:
1. Ganti isi \`src/App.jsx\` dengan kodemu.
2. Salin CSS dari latihan ini ke \`src/index.css\` (lihat file \`src/lessons/_bersama/portofolio.js\` di proyek LatihKode).
3. Ganti datanya dengan data dirimu sendiri: nama, info, skill, dan proyek.
4. (Opsional) Pecah setiap komponen ke file sendiri: \`src/components/Navbar.jsx\`, dan seterusnya, dengan \`export default\` & \`import\`.
5. Publikasikan gratis ke **GitHub Pages**, **Vercel**, atau **Netlify**.

Selamat! Kamu sudah berjalan dari \`console.log("Halo, Dunia!")\` sampai web portofolio React. 🎉
`,
  tugas: `
1. Buat \`Footer({ nama })\` → \`<footer>© 2025 Budi. Dibuat dengan React ⚛️</footer>\`, dengan tahun diambil dari \`new Date().getFullYear()\`.
2. Tampilkan \`<Footer nama="Budi" />\` di **paling bawah** App.

Tes terakhir juga memeriksa seluruh halaman: setiap link di menu harus menuju section yang benar-benar ada.
`,
  kodeAwal: susun([...DATA, ...KOMPONEN, FOOTER_AWAL], buatApp(ISI, { tema: true })),
  solusi: susun([...DATA, ...KOMPONEN, FOOTER], buatApp([...ISI, EL.footer], { tema: true })),
  petunjuk: [
    'const tahun = new Date().getFullYear();',
    'return <footer>© {tahun} {nama}. Dibuat dengan React ⚛️</footer>;',
  ],
  tes: [
    {
      nama: 'Footer dengan tahun otomatis',
      cek(ctx) {
        const tahun = new Date().getFullYear();
        const t = ctx.teks('footer');
        if (t !== `© ${tahun} Budi. Dibuat dengan React ⚛️`) return `<footer> berisi "${t}", seharusnya "© ${tahun} Budi. Dibuat dengan React ⚛️".`;
        return /getFullYear\(\)/.test(ctx.kode) || 'Ambil tahun dengan new Date().getFullYear(), jangan ditulis manual.';
      },
    },
    {
      nama: 'Footer berada paling bawah',
      cek(ctx) {
        const anak = ctx.cariSemua('.halaman > *');
        return anak.at(-1)?.tagName === 'FOOTER' || 'Letakkan <Footer /> paling bawah di dalam .halaman.';
      },
    },
    {
      nama: 'Setiap link menu menuju section yang ada',
      cek(ctx) {
        const link = ctx.cariSemua('nav.navbar .menu a').map((a) => a.getAttribute('href'));
        if (link.length !== 5) return 'Menu navbar seharusnya punya 5 link.';
        for (const h of link) {
          const el = ctx.document.getElementById(h.slice(1));
          if (!el || el.tagName !== 'SECTION') return `Link ${h} tidak menemukan <section id="${h.slice(1)}">.`;
        }
        return true;
      },
    },
    {
      nama: 'Semua fitur masih berjalan (tema & filter skill)',
      async cek(ctx) {
        await ctx.klik('nav.navbar button.tema');
        if (!ctx.cari('.halaman').classList.contains('gelap')) return 'Toggle dark mode tidak berjalan.';
        const tools = ctx.cariSemua('#skills .filter button').find((b) => b.textContent.trim() === 'Tools');
        await ctx.klik(tools);
        return ctx.cariSemua('#skills .skill').length === 2 || 'Filter skill tidak berjalan.';
      },
    },
  ],
};
