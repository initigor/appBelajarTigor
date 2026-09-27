export default {
  id: 'react-children',
  judul: 'children',
  tipe: 'react',
  xp: 25,
  css: `.kartu { border: 2px solid #6d4aff; border-radius: 12px; padding: 0 16px 12px; margin-bottom: 12px; max-width: 360px; }
.kartu h3 { margin: 12px 0 6px; color: #6d4aff; }
.peringatan { border-color: #d93f5c; }
.peringatan h3 { color: #d93f5c; }`,
  materi: `
# children: isi di antara tag pembuka dan penutup

Tag HTML bisa membungkus elemen lain: \`<div><p>...</p></div>\`. Komponen buatanmu juga bisa! Apa pun yang ditulis di antara \`<Kartu>\` dan \`</Kartu>\` dikirim sebagai prop khusus bernama **\`children\`**:

~~~jsx
function Kartu({ judul, children }) {
  return (
    <div className="kartu">
      <h3>{judul}</h3>
      {children}
    </div>
  );
}

function App() {
  return (
    <Kartu judul="Tentang Aku">
      <p>Mahasiswa TI yang suka ngoding.</p>
      <p>Hobi: badminton 🏸</p>
    </Kartu>
  );
}
~~~

\`Kartu\` tidak perlu tahu isinya apa. Tugasnya hanya menyediakan "bingkai" (border, judul, padding). Komponen seperti ini disebut **wrapper** atau **layout component**: \`Card\`, \`Modal\`, \`Section\`, \`Layout\`, dan sebagainya.

## Menggabung className
Kadang wrapper perlu variasi gaya:

~~~jsx
function Kartu({ judul, jenis = "biasa", children }) {
  const kelas = jenis === "peringatan" ? "kartu peringatan" : "kartu";
  return <div className={kelas}>...</div>;
}
~~~
`,
  tugas: `
1. Buat komponen \`Kartu\` dengan props \`judul\`, \`jenis\` (default \`"biasa"\`), dan \`children\`. Tampilkan:
   ~~~html
   <section class="kartu">          <!-- "kartu peringatan" jika jenis === "peringatan" -->
     <h3>judul</h3>
     ...children...
   </section>
   ~~~
2. Di \`App\`, tampilkan dua kartu:
   - judul \`Tentang Aku\` berisi \`<p>Mahasiswa TI semester 3</p>\`
   - judul \`Perhatian\`, jenis \`peringatan\`, berisi \`<p>Website masih dibangun</p>\` **dan** \`<button>Oke</button>\`
`,
  kodeAwal: `function Kartu({ judul }) {
  return (
    <section className="kartu">
      <h3>{judul}</h3>
    </section>
  );
}

function App() {
  return (
    <div>
      <Kartu judul="Tentang Aku" />
    </div>
  );
}

export default App;
`,
  solusi: `function Kartu({ judul, jenis = "biasa", children }) {
  const kelas = jenis === "peringatan" ? "kartu peringatan" : "kartu";
  return (
    <section className={kelas}>
      <h3>{judul}</h3>
      {children}
    </section>
  );
}

function App() {
  return (
    <div>
      <Kartu judul="Tentang Aku">
        <p>Mahasiswa TI semester 3</p>
      </Kartu>
      <Kartu judul="Perhatian" jenis="peringatan">
        <p>Website masih dibangun</p>
        <button>Oke</button>
      </Kartu>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Tambahkan children ke parameter, lalu tulis {children} di bawah <h3>.',
    'Pakai <Kartu judul="..."> ... </Kartu> (bukan self-closing) supaya ada isinya.',
    'className={jenis === "peringatan" ? "kartu peringatan" : "kartu"}',
  ],
  tes: [
    {
      nama: 'Ada 2 section.kartu dengan judul yang benar',
      cek(ctx) {
        const k = ctx.cariSemua('section.kartu');
        if (k.length !== 2) return `Ada ${k.length} section.kartu, seharusnya 2.`;
        const j = k.map((x) => x.querySelector('h3')?.textContent);
        return j.join() === 'Tentang Aku,Perhatian' || `Judul kartu: ${j.join(', ')}.`;
      },
    },
    {
      nama: 'children ditampilkan di dalam kartu',
      cek(ctx) {
        const [k1, k2] = ctx.cariSemua('section.kartu');
        if (k1?.querySelector('p')?.textContent !== 'Mahasiswa TI semester 3') return 'Kartu pertama harus berisi <p>Mahasiswa TI semester 3</p>. Sudah menulis {children}?';
        if (k2?.querySelector('p')?.textContent !== 'Website masih dibangun') return 'Kartu kedua harus berisi <p>Website masih dibangun</p>.';
        return k2.querySelector('button')?.textContent === 'Oke' || 'Kartu kedua juga harus berisi <button>Oke</button>.';
      },
    },
    {
      nama: 'Kartu peringatan punya class "peringatan"',
      cek(ctx) {
        const [k1, k2] = ctx.cariSemua('section.kartu');
        if (k1?.classList.contains('peringatan')) return 'Kartu pertama (jenis default) tidak boleh punya class "peringatan".';
        return k2?.classList.contains('peringatan') || 'Kartu kedua harus punya class "kartu peringatan".';
      },
    },
  ],
};
