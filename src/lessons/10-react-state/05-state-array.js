export default {
  id: 'react-state-array',
  judul: 'State Array (Tanpa Mutasi)',
  tipe: 'react',
  xp: 30,
  css: `ul { padding-left: 0; list-style: none; max-width: 300px; }
li { display: flex; justify-content: space-between; padding: 4px 8px; border-bottom: 1px solid #eee; }`,
  materi: `
# State berupa array

Ingat pelajaran **referensi vs salinan** di Chapter 4? Sekarang kamu akan melihat kenapa itu penting.

~~~jsx
const [skills, setSkills] = useState(["HTML", "CSS"]);

// ❌ SALAH: mengubah array lama, referensinya tetap sama
skills.push("JS");
setSkills(skills);       // React: "array-nya sama, tidak perlu render ulang"

// ✅ BENAR: buat array baru
setSkills([...skills, "JS"]);
~~~

React membandingkan state lama dan baru dengan \`===\`. Jika referensinya sama, React menganggap **tidak ada perubahan**.

| Aksi | Cara tanpa mutasi |
| --- | --- |
| tambah | \`[...arr, item]\` |
| hapus | \`arr.filter((x) => x !== item)\` |
| ubah | \`arr.map((x) => (x === lama ? baru : x))\` |

Hindari \`push\`, \`pop\`, \`splice\`, \`sort\`, dan \`arr[i] = ...\` pada state secara langsung.

## Menampilkan array: map + key
Sekilas dulu (dibahas lebih dalam di Chapter 11):

~~~jsx
<ul>
  {skills.map((s) => (
    <li key={s}>{s}</li>
  ))}
</ul>
~~~
\`key\` adalah identitas unik setiap item supaya React bisa melacaknya.
`,
  tugas: `
Buat daftar skill:

1. State awal: \`["HTML", "CSS"]\`, ditampilkan sebagai \`<li>\` di dalam \`<ul>\`. Setiap \`<li>\` berisi \`<span>\` nama skill dan tombol \`Hapus\`.
2. \`<input>\` terkontrol + tombol \`Tambah\` untuk menambah skill (trim; abaikan jika kosong atau **sudah ada**), lalu kosongkan input.
3. Tombol \`Hapus\` di setiap item menghapus skill itu.
4. Tampilkan \`<p class="jumlah">2 skill</p>\` sesuai jumlah.

**Jangan** memakai \`push\`/\`splice\` pada state.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  const [skills, setSkills] = useState(["HTML", "CSS"]);
  const [input, setInput] = useState("");

  function tambah() {
    skills.push(input);
    setSkills(skills);
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={tambah}>Tambah</button>
      <ul>
        {skills.map((s) => (
          <li key={s}><span>{s}</span></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

function App() {
  const [skills, setSkills] = useState(["HTML", "CSS"]);
  const [input, setInput] = useState("");

  function tambah() {
    const baru = input.trim();
    if (baru === "" || skills.includes(baru)) return;
    setSkills([...skills, baru]);
    setInput("");
  }

  function hapus(target) {
    setSkills(skills.filter((s) => s !== target));
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={tambah}>Tambah</button>
      <ul>
        {skills.map((s) => (
          <li key={s}>
            <span>{s}</span>
            <button onClick={() => hapus(s)}>Hapus</button>
          </li>
        ))}
      </ul>
      <p className="jumlah">{skills.length} skill</p>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Tambah: setSkills([...skills, baru]);',
    'Hapus: setSkills(skills.filter((s) => s !== target));',
    'Tombol hapus per item: <button onClick={() => hapus(s)}>Hapus</button>',
  ],
  tes: [
    {
      nama: 'Tidak memakai push/splice pada state',
      cek: (ctx) => !/\bskills\.(push|splice|pop|shift|unshift)\(/.test(ctx.kode) || 'Jangan ubah array state langsung. Pakai spread atau filter.',
    },
    {
      nama: 'Menambah skill',
      async cek(ctx) {
        await ctx.ketik('input', '  React ');
        await ctx.klik(ctx.tombol('Tambah'));
        const li = ctx.cariSemua('li span').map((s) => s.textContent);
        if (li.join() !== 'HTML,CSS,React') return `Daftar skill: [${li.join(', ')}], seharusnya [HTML, CSS, React].`;
        if (ctx.cari('input').value !== '') return 'Kosongkan input setelah menambah.';
        return ctx.teks('.jumlah') === '3 skill' || `.jumlah berisi "${ctx.teks('.jumlah')}", seharusnya "3 skill".`;
      },
    },
    {
      nama: 'Mengabaikan input kosong & duplikat',
      async cek(ctx) {
        await ctx.ketik('input', 'CSS');
        await ctx.klik(ctx.tombol('Tambah'));
        await ctx.ketik('input', '   ');
        await ctx.klik(ctx.tombol('Tambah'));
        const n = ctx.cariSemua('li').length;
        return n === 3 || `Ada ${n} item. Skill kosong atau yang sudah ada tidak boleh ditambahkan.`;
      },
    },
    {
      nama: 'Menghapus skill',
      async cek(ctx) {
        const liCss = ctx.cariSemua('li').find((li) => li.querySelector('span')?.textContent === 'CSS');
        const btn = liCss?.querySelector('button');
        if (!btn) return 'Setiap <li> harus punya tombol Hapus.';
        await ctx.klik(btn);
        const li = ctx.cariSemua('li span').map((s) => s.textContent);
        if (li.join() !== 'HTML,React') return `Setelah menghapus CSS: [${li.join(', ')}].`;
        return ctx.teks('.jumlah') === '2 skill' || `.jumlah berisi "${ctx.teks('.jumlah')}".`;
      },
    },
  ],
};
