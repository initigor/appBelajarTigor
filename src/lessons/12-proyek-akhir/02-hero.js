import { CSS_PORTOFOLIO, DATA_MENU, NAVBAR, HERO, EL, buatApp, susun } from '../_bersama/portofolio.js';

const HERO_AWAL = `// Buat komponen Hero di sini`;

export default {
  id: 'portofolio-hero',
  judul: 'Portofolio 2: Hero',
  tipe: 'react',
  xp: 40,
  css: CSS_PORTOFOLIO,
  materi: `
# Hero: kesan pertama

**Hero** adalah bagian paling atas halaman, yang pertama kali dilihat pengunjung. Isinya biasanya:
- sapaan & nama
- peran / keahlian utama
- satu kalimat deskripsi
- tombol ajakan (*call to action*)

Semua teks dikirim lewat **props**, sehingga komponennya bisa dipakai ulang oleh siapa saja (termasuk teman sekelasmu 😉).

~~~jsx
function Hero({ nama, peran, deskripsi }) {
  return (
    <section id="home" className="hero">
      ...
    </section>
  );
}
~~~

\`id="home"\` membuat link \`#home\` di Navbar berfungsi.

## Props yang panjang
Kalau props-nya banyak, tulis satu per baris supaya mudah dibaca:

~~~jsx
<Hero
  nama="Budi"
  peran="..."
  deskripsi="..."
/>
~~~
`,
  tugas: `
1. Buat \`Hero({ nama, peran, deskripsi })\`:
   ~~~html
   <section id="home" class="hero">
     <h1>Halo, saya Budi 👋</h1>
     <p class="peran">peran</p>
     <p>deskripsi</p>
     <a href="#projects" class="tombol">Lihat Proyek</a>
   </section>
   ~~~
2. Tampilkan \`Hero\` di \`App\` **di bawah** Navbar dengan:
   - nama: \`Budi\`
   - peran: \`Mahasiswa Teknik Informatika & Frontend Developer\`
   - deskripsi: \`Aku sedang belajar membangun website modern dengan React.\`
`,
  kodeAwal: susun([DATA_MENU, NAVBAR, HERO_AWAL], buatApp([EL.navbar])),
  solusi: susun([DATA_MENU, NAVBAR, HERO], buatApp([EL.navbar, EL.hero])),
  petunjuk: ['<h1>Halo, saya {nama} 👋</h1>', 'Di App: <Hero nama="Budi" peran="..." deskripsi="..." /> di bawah <Navbar />.'],
  tes: [
    {
      nama: 'section#home.hero berisi sapaan & peran',
      cek(ctx) {
        const s = ctx.document.getElementById('home');
        if (!s || !s.classList.contains('hero')) return 'Belum ada <section id="home" className="hero">.';
        if (ctx.teks('#home h1') !== 'Halo, saya Budi 👋') return `<h1> berisi "${ctx.teks('#home h1')}", seharusnya "Halo, saya Budi 👋".`;
        return ctx.teks('#home .peran') === 'Mahasiswa Teknik Informatika & Frontend Developer' || `.peran berisi "${ctx.teks('#home .peran')}".`;
      },
    },
    {
      nama: 'Deskripsi & tombol Lihat Proyek',
      cek(ctx) {
        const p = ctx.cariSemua('#home p').map((x) => x.textContent);
        if (!p.includes('Aku sedang belajar membangun website modern dengan React.')) return 'Deskripsi belum tampil di dalam <p>.';
        const a = ctx.cari('#home a.tombol');
        return (a.textContent === 'Lihat Proyek' && a.getAttribute('href') === '#projects') || 'Tombol harus <a href="#projects" className="tombol">Lihat Proyek</a>.';
      },
    },
    {
      nama: 'Hero berada di bawah Navbar & memakai props',
      cek(ctx) {
        const urut = ctx.cariSemua('.halaman > *').map((e) => e.tagName.toLowerCase());
        if (urut.join() !== 'nav,section') return `Urutan isi .halaman: ${urut.join(' → ')}, seharusnya nav → section.`;
        return /function\s+Hero\s*\(\s*\{/.test(ctx.kode) || 'Hero harus menerima props: function Hero({ nama, peran, deskripsi }).';
      },
    },
  ],
};
