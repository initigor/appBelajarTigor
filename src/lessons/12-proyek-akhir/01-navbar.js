import { CSS_PORTOFOLIO, DATA_MENU, NAVBAR, EL, buatApp, susun } from '../_bersama/portofolio.js';

const NAVBAR_AWAL = `function Navbar({ nama, menu }) {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">???</a>
    </nav>
  );
}`;

export default {
  id: 'portofolio-navbar',
  judul: 'Portofolio 1: Navbar',
  tipe: 'react',
  xp: 40,
  css: CSS_PORTOFOLIO,
  materi: `
# 🏆 Proyek Akhir: Web Portofolio

Selamat, kamu sudah sampai di chapter terakhir! Di sini kamu akan membangun **web portofolio** lengkap, satu komponen per pelajaran. Setiap pelajaran melanjutkan kode dari pelajaran sebelumnya.

Rancangan akhirnya:

~~~
App  (state: tema gelap/terang)
├── Navbar     ← pelajaran ini
├── Hero       (sapaan & peran)
├── About      (data diri dari object)
├── Skills     (array + filter kategori)
├── Projects   (ProjectCard + props)
├── Contact    (form terkontrol + validasi)
└── Footer
~~~

CSS-nya sudah disiapkan, jadi kamu cukup fokus pada **struktur dan logika React**. Class yang tersedia: \`navbar\`, \`logo\`, \`menu\`, \`hero\`, \`peran\`, \`tombol\`, \`info\`, \`filter\`, \`grid\`, \`skill\`, \`level\`, \`proyek\`, \`tag\`, \`wip\`, \`sukses\`, \`gelap\`.

## Navbar dari data
Daripada menulis 5 link satu per satu, simpan menu sebagai **array of object** lalu tampilkan dengan \`map\`. Dengan cara ini, menambah menu cukup dengan menambah satu baris data.

~~~jsx
<ul className="menu">
  {menu.map((m) => (
    <li key={m.href}>
      <a href={m.href}>{m.label}</a>
    </li>
  ))}
</ul>
~~~

Link \`href="#about"\` akan menggulir halaman ke elemen dengan \`id="about"\`. Section-section itu akan kamu buat di pelajaran-pelajaran berikutnya.
`,
  tugas: `
Lengkapi komponen \`Navbar({ nama, menu })\`:

~~~html
<nav class="navbar">
  <a href="#home" class="logo">Budi.dev</a>      <!-- nama + ".dev" -->
  <ul class="menu">
    <li><a href="#home">Beranda</a></li>
    ... satu <li> untuk setiap item MENU (pakai map + key)
  </ul>
</nav>
~~~
`,
  kodeAwal: susun([DATA_MENU, NAVBAR_AWAL], buatApp([EL.navbar])),
  solusi: susun([DATA_MENU, NAVBAR], buatApp([EL.navbar])),
  petunjuk: [
    'Logo: <a href="#home" className="logo">{nama}.dev</a>',
    'Menu: <ul className="menu">{menu.map((m) => <li key={m.href}><a href={m.href}>{m.label}</a></li>)}</ul>',
  ],
  tes: [
    {
      nama: 'Logo "Budi.dev" mengarah ke #home',
      cek(ctx) {
        const logo = ctx.cari('nav.navbar a.logo');
        if (logo.textContent !== 'Budi.dev') return `Logo berisi "${logo.textContent}", seharusnya "Budi.dev" (dari props nama).`;
        return logo.getAttribute('href') === '#home' || 'Logo harus punya href="#home".';
      },
    },
    {
      nama: 'Menu berisi 5 link sesuai data',
      cek(ctx) {
        const a = ctx.cariSemua('nav.navbar ul.menu li a');
        if (a.length !== 5) return `Ada ${a.length} link di ul.menu, seharusnya 5.`;
        const h = [['Beranda', '#home'], ['Tentang', '#about'], ['Skill', '#skills'], ['Proyek', '#projects'], ['Kontak', '#contact']];
        for (let i = 0; i < 5; i++) {
          if (a[i].textContent !== h[i][0] || a[i].getAttribute('href') !== h[i][1]) return `Link ke-${i + 1} seharusnya <a href="${h[i][1]}">${h[i][0]}</a>.`;
        }
        return true;
      },
    },
    {
      nama: 'Memakai map + key',
      cek: (ctx) => (/menu\.map\(/.test(ctx.kode) && /key=\{/.test(ctx.kode)) || 'Tampilkan menu dengan menu.map(...) dan beri key pada <li>.',
    },
  ],
};
