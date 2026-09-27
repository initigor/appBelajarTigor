export default {
  id: 'react-komposisi',
  judul: 'Menyusun Banyak Komponen',
  tipe: 'react',
  xp: 20,
  css: `header { background: #1d1b2c; color: white; padding: 12px 16px; border-radius: 10px; }
main { padding: 16px 4px; }
footer { color: #777; font-size: 14px; border-top: 1px solid #ddd; padding-top: 8px; }`,
  materi: `
# Komponen di dalam komponen

Kekuatan React ada pada **komposisi**: halaman besar dipecah menjadi komponen-komponen kecil, lalu disusun seperti lego.

~~~jsx
function Header() {
  return <header>Logo & Menu</header>;
}

function Footer() {
  return <footer>© 2025</footer>;
}

function App() {
  return (
    <div>
      <Header />
      <main>Isi halaman</main>
      <Footer />
    </div>
  );
}
~~~

- Komponen dipakai seperti tag HTML: \`<Header />\`.
- Nama komponen **harus diawali huruf kapital**. \`<header>\` (kecil) adalah tag HTML biasa, sedangkan \`<Header>\` (kapital) adalah komponen buatanmu.
- Satu komponen bisa dipakai berkali-kali: \`<Header /><Header />\`.

Ini mirip memecah program C menjadi fungsi-fungsi kecil. Bedanya, di sini yang dipecah adalah **tampilan**.

## Satu file atau banyak?
Di proyek sungguhan, biasanya satu komponen = satu file (\`Header.jsx\`, \`Footer.jsx\`) yang di-\`import\`. Di latihan ini semuanya ditulis dalam satu file dulu.
`,
  tugas: `
Buat 3 komponen, lalu susun di \`App\` dengan urutan Header → Konten → Footer:

1. \`Header\` → elemen \`<header>\` berisi \`<h1>\` bertuliskan \`Portofolio Budi\`
2. \`Konten\` → elemen \`<main>\` berisi \`<p>\` bertuliskan \`Selamat datang di website-ku!\`
3. \`Footer\` → elemen \`<footer>\` berisi \`© 2025 Budi\`
`,
  kodeAwal: `function Header() {
  return <header>...</header>;
}

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
`,
  solusi: `function Header() {
  return (
    <header>
      <h1>Portofolio Budi</h1>
    </header>
  );
}

function Konten() {
  return (
    <main>
      <p>Selamat datang di website-ku!</p>
    </main>
  );
}

function Footer() {
  return <footer>© 2025 Budi</footer>;
}

function App() {
  return (
    <div>
      <Header />
      <Konten />
      <Footer />
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Buat function Konten() dan function Footer() seperti Header.',
    'Di App: <Header />, <Konten />, <Footer /> berurutan.',
  ],
  tes: [
    {
      nama: 'Komponen Header, Konten, Footer dibuat',
      cek(ctx) {
        for (const n of ['Header', 'Konten', 'Footer']) {
          if (!ctx.pakai(new RegExp(`function\\s+${n}\\s*\\(|const\\s+${n}\\s*=`))) return `Komponen ${n} belum dibuat.`;
          if (!ctx.pakai(new RegExp(`<${n}\\s*/>|React\\.createElement\\(${n}`))) return `Komponen ${n} belum dipakai di App.`;
        }
        return true;
      },
    },
    {
      nama: 'Isi header, main, footer benar',
      cek(ctx) {
        if (ctx.teks('header h1') !== 'Portofolio Budi') return `<h1> di <header> berisi "${ctx.teks('header h1')}".`;
        if (ctx.teks('main p') !== 'Selamat datang di website-ku!') return `<p> di <main> berisi "${ctx.teks('main p')}".`;
        return ctx.teks('footer') === '© 2025 Budi' || `<footer> berisi "${ctx.teks('footer')}".`;
      },
    },
    {
      nama: 'Urutan: header → main → footer',
      cek(ctx) {
        const urut = ctx.cariSemua('header, main, footer').map((e) => e.tagName.toLowerCase());
        return urut.join() === 'header,main,footer' || `Urutan elemen: ${urut.join(' → ')}.`;
      },
    },
  ],
};
