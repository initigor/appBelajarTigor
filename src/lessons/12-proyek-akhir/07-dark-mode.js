import {
  CSS_PORTOFOLIO, DATA_MENU, NAVBAR, NAVBAR_TEMA, HERO, DATA_INFO, ABOUT, DATA_SKILLS, SKILLS, DATA_PROYEK, PROJECTS, CONTACT,
  EL, buatApp, susun,
} from '../_bersama/portofolio.js';

const DATA = [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK];
const LAIN = [HERO, ABOUT, SKILLS, PROJECTS, CONTACT];
const ISI = [EL.hero, EL.about, EL.skills, EL.projects, EL.contact];

export default {
  id: 'portofolio-dark-mode',
  judul: 'Portofolio 7: Toggle Dark Mode',
  tipe: 'react',
  xp: 45,
  css: CSS_PORTOFOLIO,
  materi: `
# Dark mode: state di App, tombol di Navbar

Tema berlaku untuk **seluruh halaman**, jadi state-nya harus ada di komponen paling atas, yaitu \`App\`. Tapi tombolnya ada di \`Navbar\`. Bagaimana Navbar bisa mengubah state milik App?

Jawabannya adalah pola **"lifting state up"**:
1. State disimpan di induk (\`App\`).
2. Induk mengirim **nilai** (\`gelap\`) dan **fungsi pengubah** (\`onToggleTema\`) ke anak lewat props.
3. Anak memanggil fungsi itu saat tombol diklik.

~~~jsx
function App() {
  const [gelap, setGelap] = useState(false);
  return (
    <div className={gelap ? "halaman gelap" : "halaman"}>
      <Navbar ... gelap={gelap} onToggleTema={() => setGelap(!gelap)} />
      ...
    </div>
  );
}

function Navbar({ nama, menu, gelap, onToggleTema }) {
  ...
  <button className="tema" onClick={onToggleTema}>{gelap ? "☀️" : "🌙"}</button>
}
~~~

Data mengalir **ke bawah** lewat props, sedangkan kejadian naik **ke atas** lewat fungsi callback. Inilah pola dasar komunikasi antar-komponen di React.

CSS untuk \`.halaman.gelap\` sudah tersedia, jadi cukup tambahkan class \`gelap\`.
`,
  tugas: `
1. Di \`App\`: buat state \`gelap\` (awal \`false\`). Wrapper \`<div>\` memakai class \`halaman\` ditambah \`gelap\` jika tema gelap.
2. Kirim props \`gelap\` dan \`onToggleTema\` ke \`Navbar\`.
3. Di \`Navbar\`: tambahkan \`<button class="tema">\` setelah menu, bertuliskan \`🌙\` saat terang dan \`☀️\` saat gelap. Klik → panggil \`onToggleTema\`.
`,
  kodeAwal: susun([...DATA, NAVBAR, ...LAIN], buatApp([EL.navbar, ...ISI])),
  solusi: susun([...DATA, NAVBAR_TEMA, ...LAIN], buatApp([EL.navbarTema, ...ISI], { tema: true })),
  petunjuk: [
    'Di App: const [gelap, setGelap] = useState(false);',
    '<div className={gelap ? "halaman gelap" : "halaman"}>',
    '<Navbar nama="Budi" menu={MENU} gelap={gelap} onToggleTema={() => setGelap(!gelap)} />',
  ],
  tes: [
    {
      nama: 'Tombol tema di dalam navbar',
      cek(ctx) {
        const b = ctx.cari('nav.navbar button.tema');
        if (b.textContent.trim() !== '🌙') return `Saat terang, tombol tema bertuliskan "${b.textContent.trim()}", seharusnya "🌙".`;
        return !ctx.cari('.halaman').classList.contains('gelap') || 'Awalnya halaman belum gelap.';
      },
    },
    {
      nama: 'Klik → gelap, klik lagi → terang',
      async cek(ctx) {
        await ctx.klik('nav.navbar button.tema');
        if (!ctx.cari('.halaman').classList.contains('gelap')) return 'Setelah diklik, wrapper harus punya class "halaman gelap".';
        if (ctx.teks('nav.navbar button.tema') !== '☀️') return 'Saat gelap, tombol tema bertuliskan "☀️".';
        await ctx.klik('nav.navbar button.tema');
        if (ctx.cari('.halaman').classList.contains('gelap')) return 'Klik kedua harus kembali ke terang.';
        return ctx.teks('nav.navbar button.tema') === '🌙' || 'Saat terang, tombol kembali "🌙".';
      },
    },
    {
      nama: 'State di App, dikirim lewat props',
      cek(ctx) {
        if (!/function\s+Navbar\s*\(\s*\{[^}]*onToggleTema/.test(ctx.kode)) return 'Navbar harus menerima props onToggleTema.';
        return /<Navbar[^>]*onToggleTema=\{/.test(ctx.kode) || 'Kirim onToggleTema dari App ke <Navbar />.';
      },
    },
  ],
};
