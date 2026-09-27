// Potongan kode untuk Chapter 12 (Proyek Akhir: Portofolio).
// Setiap pelajaran memakai hasil pelajaran sebelumnya sebagai kodeAwal,
// jadi potongan-potongan ini disusun ulang di setiap file pelajaran.

export const CSS_PORTOFOLIO = `
* { box-sizing: border-box; }
body { margin: 0; }
.halaman { font-family: system-ui, sans-serif; color: #1d1b2c; background: #ffffff; min-height: 100vh; transition: background .3s, color .3s; }
.halaman.gelap { background: #14131f; color: #ecebf5; }
section { padding: 32px 24px; max-width: 860px; margin: 0 auto; }
h2 { font-size: 26px; margin: 0 0 16px; }
.navbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid #e3e1ee; position: sticky; top: 0; background: inherit; }
.gelap .navbar { border-color: #2d2b40; }
.logo { font-weight: 800; font-size: 20px; color: #6d4aff; text-decoration: none; }
.menu { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
.menu a { color: inherit; text-decoration: none; font-weight: 500; }
.menu a:hover { color: #6d4aff; }
.tema { border: 1px solid #ccc; background: transparent; border-radius: 8px; padding: 4px 8px; cursor: pointer; font-size: 16px; }
.hero { padding-top: 64px; padding-bottom: 64px; }
.hero h1 { font-size: 40px; margin: 0; }
.hero .peran { color: #6d4aff; font-size: 20px; font-weight: 600; margin: 8px 0; }
.tombol { display: inline-block; margin-top: 12px; background: #6d4aff; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: 600; }
.info { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.info li { background: #f3f1fb; padding: 8px 12px; border-radius: 8px; }
.gelap .info li, .gelap .skill, .gelap .proyek { background: #1f1d2e; }
.filter { display: flex; gap: 8px; margin-bottom: 12px; }
.filter button { border: 1px solid #ccc; background: transparent; color: inherit; border-radius: 999px; padding: 4px 14px; cursor: pointer; }
.filter button.aktif { background: #6d4aff; border-color: #6d4aff; color: white; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.skill { display: flex; justify-content: space-between; background: #f3f1fb; border-radius: 10px; padding: 10px 14px; }
.level { color: #f5b301; letter-spacing: 2px; }
.proyek { background: #f3f1fb; border-radius: 12px; padding: 14px 16px; }
.proyek h3 { margin: 0 0 6px; }
.proyek a { color: #6d4aff; font-weight: 600; }
.tag { display: inline-block; background: #ece6ff; color: #4b2fd0; border-radius: 999px; padding: 0 10px; margin: 0 4px 8px 0; font-size: 12px; }
.wip { color: #a55a00; font-size: 14px; }
form { display: grid; gap: 8px; max-width: 420px; }
form input, form textarea { font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid #ccc; }
form textarea { min-height: 80px; }
form button { background: #6d4aff; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; }
form button:disabled { opacity: .5; cursor: not-allowed; }
.sukses { background: #e1f7ec; color: #15a36a; padding: 12px 16px; border-radius: 10px; }
footer { text-align: center; padding: 24px; color: #888; border-top: 1px solid #e3e1ee; }
.gelap footer { border-color: #2d2b40; }
`;

export const IMPORT = 'import { useState } from "react";';

export const DATA_MENU = `const MENU = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Skill", href: "#skills" },
  { label: "Proyek", href: "#projects" },
  { label: "Kontak", href: "#contact" },
];`;

export const NAVBAR = `function Navbar({ nama, menu }) {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">{nama}.dev</a>
      <ul className="menu">
        {menu.map((m) => (
          <li key={m.href}>
            <a href={m.href}>{m.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`;

export const NAVBAR_TEMA = `function Navbar({ nama, menu, gelap, onToggleTema }) {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">{nama}.dev</a>
      <ul className="menu">
        {menu.map((m) => (
          <li key={m.href}>
            <a href={m.href}>{m.label}</a>
          </li>
        ))}
      </ul>
      <button className="tema" onClick={onToggleTema} aria-label="Ganti tema">
        {gelap ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}`;

export const HERO = `function Hero({ nama, peran, deskripsi }) {
  return (
    <section id="home" className="hero">
      <h1>Halo, saya {nama} 👋</h1>
      <p className="peran">{peran}</p>
      <p>{deskripsi}</p>
      <a href="#projects" className="tombol">Lihat Proyek</a>
    </section>
  );
}`;

export const DATA_INFO = `const INFO = {
  Kampus: "Universitas Nusantara",
  Jurusan: "Teknik Informatika",
  Semester: 5,
  Domisili: "Bandung",
};`;

export const ABOUT = `function About({ info }) {
  return (
    <section id="about">
      <h2>Tentang Saya</h2>
      <p>Aku suka membangun aplikasi web yang sederhana tapi berguna.</p>
      <ul className="info">
        {Object.entries(info).map(([kunci, nilai]) => (
          <li key={kunci}>
            <b>{kunci}:</b> {nilai}
          </li>
        ))}
      </ul>
    </section>
  );
}`;

export const DATA_SKILLS = `const SKILLS = [
  { nama: "HTML", kategori: "Frontend", level: 4 },
  { nama: "CSS", kategori: "Frontend", level: 3 },
  { nama: "JavaScript", kategori: "Frontend", level: 4 },
  { nama: "React", kategori: "Frontend", level: 3 },
  { nama: "Git", kategori: "Tools", level: 3 },
  { nama: "Figma", kategori: "Tools", level: 2 },
];`;

export const SKILLS = `function Skills({ daftar }) {
  const [kategori, setKategori] = useState("Semua");
  const tampil = kategori === "Semua" ? daftar : daftar.filter((s) => s.kategori === kategori);

  return (
    <section id="skills">
      <h2>Skill</h2>
      <div className="filter">
        {["Semua", "Frontend", "Tools"].map((k) => (
          <button key={k} className={k === kategori ? "aktif" : ""} onClick={() => setKategori(k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="grid">
        {tampil.map((s) => (
          <div key={s.nama} className="skill">
            <span>{s.nama}</span>
            <span className="level">{"★".repeat(s.level) + "☆".repeat(5 - s.level)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}`;

export const DATA_PROYEK = `const PROYEK = [
  {
    id: 1,
    judul: "Kalkulator Nilai",
    deskripsi: "Menghitung nilai akhir dan grade mahasiswa.",
    tech: ["JavaScript"],
    status: "selesai",
    link: "https://github.com/budi/kalkulator-nilai",
  },
  {
    id: 2,
    judul: "Todo React",
    deskripsi: "Todo list dengan filter dan hitungan tugas.",
    tech: ["React", "CSS"],
    status: "selesai",
    link: "https://github.com/budi/todo-react",
  },
  {
    id: 3,
    judul: "Cuaca Kita",
    deskripsi: "Informasi cuaca dari API publik.",
    tech: ["React", "API"],
    status: "proses",
  },
];`;

export const PROJECTS = `function ProjectCard({ judul, deskripsi, tech, status, link }) {
  return (
    <article className="proyek">
      <h3>{judul}</h3>
      <p>{deskripsi}</p>
      <div>
        {tech.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      {status === "selesai" ? (
        <a href={link} target="_blank" rel="noreferrer">Lihat kode →</a>
      ) : (
        <span className="wip">🚧 Dalam pengerjaan</span>
      )}
    </article>
  );
}

function Projects({ data }) {
  return (
    <section id="projects">
      <h2>Proyek</h2>
      <div className="grid">
        {data.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}`;

export const CONTACT = `function Contact() {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [terkirim, setTerkirim] = useState(false);
  const valid = form.nama.trim() !== "" && form.email.includes("@") && form.pesan.trim().length >= 10;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    setTerkirim(true);
  }

  return (
    <section id="contact">
      <h2>Kontak</h2>
      {terkirim ? (
        <p className="sukses">
          Terima kasih, {form.nama.trim()}! Aku akan membalas ke {form.email.trim()}.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <textarea name="pesan" placeholder="Pesan (min. 10 karakter)" value={form.pesan} onChange={handleChange} />
          <button type="submit" disabled={!valid}>Kirim</button>
        </form>
      )}
    </section>
  );
}`;

export const FOOTER = `function Footer({ nama }) {
  const tahun = new Date().getFullYear();
  return (
    <footer>
      © {tahun} {nama}. Dibuat dengan React ⚛️
    </footer>
  );
}`;


/** Elemen JSX yang dipakai di dalam App. */
export const EL = {
  navbar: '<Navbar nama="Budi" menu={MENU} />',
  navbarTema: '<Navbar nama="Budi" menu={MENU} gelap={gelap} onToggleTema={() => setGelap(!gelap)} />',
  hero: `<Hero\n        nama="Budi"\n        peran="Mahasiswa Teknik Informatika & Frontend Developer"\n        deskripsi="Aku sedang belajar membangun website modern dengan React."\n      />`,
  about: '<About info={INFO} />',
  skills: '<Skills daftar={SKILLS} />',
  projects: '<Projects data={PROYEK} />',
  contact: '<Contact />',
  footer: '<Footer nama="Budi" />',
};

/** Buat komponen App yang merender elemen-elemen `isi` secara berurutan. */
export function buatApp(isi, { tema = false } = {}) {
  const baris = isi.map((x) => `      ${x}`).join('\n');
  if (!tema) return `function App() {\n  return (\n    <div className="halaman">\n${baris}\n    </div>\n  );\n}`;
  return `function App() {\n  const [gelap, setGelap] = useState(false);\n\n  return (\n    <div className={gelap ? "halaman gelap" : "halaman"}>\n${baris}\n    </div>\n  );\n}`;
}

/** Susun satu file App.jsx dari potongan-potongan kode. */
export function susun(bagian, app) {
  return [IMPORT, ...bagian, app, 'export default App;'].join('\n\n') + '\n';
}

/** Tes umum: cek sebuah section dengan id tertentu ada. */
export function cekSection(ctx, id, judul) {
  const s = ctx.document.getElementById(id);
  if (!s || s.tagName !== 'SECTION') return `Belum ada <section id="${id}">.`;
  if (judul && s.querySelector('h2')?.textContent.trim() !== judul) return `<section id="${id}"> harus punya <h2>${judul}</h2>.`;
  return true;
}
