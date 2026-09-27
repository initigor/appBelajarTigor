export default {
  id: 'proyek-kartu-profil',
  judul: 'Mini Proyek: Kartu Profil Tim',
  tipe: 'react',
  xp: 40,
  proyek: true,
  css: `.tim { display: flex; gap: 12px; flex-wrap: wrap; }
.profil { width: 200px; border-radius: 14px; padding: 16px; text-align: center; background: #f6f5fb; border: 1px solid #ddd; }
.avatar { font-size: 48px; }
.profil h2 { margin: 6px 0 2px; font-size: 18px; }
.peran { color: #6d4aff; margin: 0 0 8px; font-weight: 600; }
.badge { display: inline-block; background: #1d1b2c; color: white; border-radius: 999px; padding: 1px 10px; font-size: 12px; margin: 2px; }
.badge.baru { background: #15a36a; }`,
  materi: `
# 🛠️ Mini Proyek: Kartu Profil Tim

Kamu akan membuat halaman "Tim Kami" untuk proyek kelompok. Proyek ini memakai semua isi Chapter 9: komponen, JSX, props (termasuk default), \`children\`, dan ekspresi \`{ }\`.

Rancangan komponennya:

~~~
App
└── Tim (judul, children)
    ├── KartuProfil (nama, peran, avatar, angkatan)
    │   └── Badge (children, baru)
    ├── KartuProfil ...
    └── KartuProfil ...
~~~

## Menampilkan sesuatu berdasarkan kondisi
Ternary bisa dipakai di dalam \`{ }\`, termasuk untuk className:

~~~jsx
<span className={baru ? "badge baru" : "badge"}>{children}</span>
~~~

## Menghitung di JSX
~~~jsx
<p>Semester {(2025 - angkatan) * 2 + 1}</p>
~~~
`,
  tugas: `
1. \`Badge({ children, baru = false })\` → \`<span class="badge">\` (atau \`"badge baru"\` jika \`baru\`) berisi children.
2. \`KartuProfil({ nama, peran, avatar = "🧑‍💻", angkatan })\` →
   ~~~html
   <div class="profil">
     <div class="avatar">🧑‍💻</div>
     <h2>nama</h2>
     <p class="peran">peran</p>
     <Badge>Angkatan 2023</Badge>
     <!-- tambahkan <Badge baru>Anggota baru</Badge> HANYA jika angkatan >= 2024 -->
   </div>
   ~~~
3. \`Tim({ judul, children })\` → \`<section>\` berisi \`<h1>{judul}</h1>\` dan \`<div class="tim">{children}</div>\`.
4. \`App\` → \`Tim\` berjudul \`Tim Kami\` berisi 3 kartu:
   - Budi, \`Frontend\`, avatar 👨‍💻, angkatan 2023
   - Sinta, \`UI/UX Designer\`, avatar 👩‍🎨, angkatan 2022
   - Andi, \`Backend\`, avatar **default**, angkatan 2024
`,
  kodeAwal: `function Badge() {

}

function KartuProfil() {

}

function Tim() {

}

function App() {
  return <Tim judul="Tim Kami"></Tim>;
}

export default App;
`,
  solusi: `function Badge({ children, baru = false }) {
  return <span className={baru ? "badge baru" : "badge"}>{children}</span>;
}

function KartuProfil({ nama, peran, avatar = "🧑‍💻", angkatan }) {
  return (
    <div className="profil">
      <div className="avatar">{avatar}</div>
      <h2>{nama}</h2>
      <p className="peran">{peran}</p>
      <Badge>Angkatan {angkatan}</Badge>
      {angkatan >= 2024 ? <Badge baru>Anggota baru</Badge> : null}
    </div>
  );
}

function Tim({ judul, children }) {
  return (
    <section>
      <h1>{judul}</h1>
      <div className="tim">{children}</div>
    </section>
  );
}

function App() {
  return (
    <Tim judul="Tim Kami">
      <KartuProfil nama="Budi" peran="Frontend" avatar="👨‍💻" angkatan={2023} />
      <KartuProfil nama="Sinta" peran="UI/UX Designer" avatar="👩‍🎨" angkatan={2022} />
      <KartuProfil nama="Andi" peran="Backend" angkatan={2024} />
    </Tim>
  );
}

export default App;
`,
  petunjuk: [
    'Angka sebagai props pakai kurung kurawal: angkatan={2023}',
    'Badge "Anggota baru": {angkatan >= 2024 ? <Badge baru>Anggota baru</Badge> : null}',
    'Props boolean cukup ditulis namanya: <Badge baru> sama dengan <Badge baru={true}>',
  ],
  tes: [
    {
      nama: 'Judul & 3 kartu profil di dalam .tim',
      cek(ctx) {
        if (ctx.teks('section h1') !== 'Tim Kami') return `<h1> berisi "${ctx.teks('section h1')}", seharusnya "Tim Kami".`;
        const n = ctx.cariSemua('.tim .profil').length;
        return n === 3 || `Ada ${n} .profil di dalam .tim, seharusnya 3.`;
      },
    },
    {
      nama: 'Nama, peran, dan avatar benar (termasuk default)',
      cek(ctx) {
        const p = ctx.cariSemua('.profil');
        const data = [['Budi', 'Frontend', '👨‍💻'], ['Sinta', 'UI/UX Designer', '👩‍🎨'], ['Andi', 'Backend', '🧑‍💻']];
        for (let i = 0; i < 3; i++) {
          const [nama, peran, avatar] = data[i];
          if (p[i]?.querySelector('h2')?.textContent !== nama) return `Kartu ke-${i + 1} seharusnya bernama ${nama}.`;
          if (p[i].querySelector('.peran')?.textContent !== peran) return `Peran ${nama} seharusnya "${peran}".`;
          if (p[i].querySelector('.avatar')?.textContent !== avatar) return `Avatar ${nama} seharusnya ${avatar}${i === 2 ? ' (dari nilai default)' : ''}.`;
        }
        return true;
      },
    },
    {
      nama: 'Badge angkatan di setiap kartu',
      cek(ctx) {
        const p = ctx.cariSemua('.profil');
        const th = [2023, 2022, 2024];
        for (let i = 0; i < 3; i++) {
          const b = p[i]?.querySelector('span.badge');
          if (b?.textContent.replace(/\s+/g, ' ') !== `Angkatan ${th[i]}`) return `Kartu ke-${i + 1} harus punya <span class="badge">Angkatan ${th[i]}</span>.`;
        }
        return true;
      },
    },
    {
      nama: 'Badge "Anggota baru" hanya untuk angkatan ≥ 2024',
      cek(ctx) {
        const p = ctx.cariSemua('.profil');
        const baru = p.map((x) => x.querySelectorAll('.badge.baru').length);
        if (baru[2] !== 1) return 'Andi (angkatan 2024) harus punya <span class="badge baru">Anggota baru</span>.';
        if (baru[0] || baru[1]) return 'Budi dan Sinta tidak boleh punya badge "Anggota baru".';
        return p[2].querySelector('.badge.baru').textContent === 'Anggota baru' || 'Teks badge harus "Anggota baru".';
      },
    },
  ],
};
