export default {
  id: 'proyek-todo-react',
  judul: 'Mini Proyek: Todo List React',
  tipe: 'react',
  xp: 50,
  proyek: true,
  css: `.app { max-width: 380px; }
form { display: flex; gap: 6px; }
form input { flex: 1; }
ul { list-style: none; padding: 0; }
li { display: flex; align-items: center; gap: 8px; padding: 6px 4px; border-bottom: 1px solid #eee; }
li.selesai span { text-decoration: line-through; color: #999; }
li span { flex: 1; }
.filter button.aktif { background: #6d4aff; color: white; }`,
  materi: `
# 🛠️ Mini Proyek: Todo List versi React

Kamu sudah membuat todo list dengan DOM murni di Chapter 7. Sekarang buat ulang dengan React, lalu rasakan bedanya: **tidak ada \`createElement\`, tidak ada \`render()\` manual**. Kamu cukup mengubah state.

## Bentuk data
~~~js
{ id: 1, teks: "Belajar React", selesai: false }
~~~

\`id\` dipakai sebagai \`key\` dan untuk mencari item yang mau diubah/dihapus. Cara sederhana membuat id unik: \`Date.now()\` atau sebuah counter.

## Update item tertentu (tanpa mutasi)
~~~js
// toggle selesai
setTodos(todos.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)));

// hapus
setTodos(todos.filter((t) => t.id !== id));
~~~

## Filter tampilan
Simpan filter di state (\`"semua" | "aktif" | "selesai"\`), lalu **hitung** daftar yang ditampilkan dari \`todos\` + \`filter\`. Jangan simpan daftar hasil filter di state terpisah.
`,
  tugas: `
Buat todo list di dalam \`<div class="app">\`:

1. \`<form>\` berisi input + tombol \`Tambah\`. Submit menambah todo (trim, abaikan jika kosong), lalu kosongkan input.
2. Setiap todo ditampilkan sebagai \`<li>\` (tambahkan class \`selesai\` jika selesai) berisi:
   \`<input type="checkbox">\` (checked = selesai, onChange = toggle), \`<span>\` teks, dan tombol \`Hapus\`.
3. \`<div class="filter">\` berisi tombol \`Semua\`, \`Aktif\`, \`Selesai\`. Tombol filter yang sedang dipakai diberi class \`aktif\`.
4. \`<p class="sisa">\` = \`<n> tugas belum selesai\`.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <div className="app">
      <h2>Todo React ⚛️</h2>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

let idBerikut = 1;

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("semua");

  function tambah(e) {
    e.preventDefault();
    const teks = input.trim();
    if (!teks) return;
    setTodos([...todos, { id: idBerikut++, teks, selesai: false }]);
    setInput("");
  }

  function toggle(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)));
  }

  function hapus(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  const tampil = todos.filter((t) => {
    if (filter === "aktif") return !t.selesai;
    if (filter === "selesai") return t.selesai;
    return true;
  });
  const sisa = todos.filter((t) => !t.selesai).length;

  return (
    <div className="app">
      <h2>Todo React ⚛️</h2>
      <form onSubmit={tambah}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tugas baru..." />
        <button type="submit">Tambah</button>
      </form>

      <div className="filter">
        {["semua", "aktif", "selesai"].map((f) => (
          <button key={f} className={filter === f ? "aktif" : ""} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul>
        {tampil.map((t) => (
          <li key={t.id} className={t.selesai ? "selesai" : ""}>
            <input type="checkbox" checked={t.selesai} onChange={() => toggle(t.id)} />
            <span>{t.teks}</span>
            <button onClick={() => hapus(t.id)}>Hapus</button>
          </li>
        ))}
      </ul>

      <p className="sisa">{sisa} tugas belum selesai</p>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'State: todos (array), input (string), filter ("semua" | "aktif" | "selesai").',
    'Toggle: todos.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t))',
    'Daftar yang ditampilkan dihitung: const tampil = todos.filter(...) sesuai filter.',
  ],
  tes: [
    {
      nama: 'Menambah todo lewat form',
      async cek(ctx) {
        for (const t of ['Belajar React', 'Push ke GitHub', 'Tidur']) {
          await ctx.ketik('form input', t);
          await ctx.kirim('form');
        }
        if (ctx.cari('form input').value !== '') return 'Kosongkan input setelah menambah.';
        await ctx.ketik('form input', '   ');
        await ctx.kirim('form');
        const isi = ctx.cariSemua('li span').map((s) => s.textContent);
        if (isi.join('|') !== 'Belajar React|Push ke GitHub|Tidur') return `Isi daftar: [${isi.join(', ')}]. Todo kosong harus diabaikan.`;
        return ctx.teks('.sisa') === '3 tugas belum selesai' || `.sisa berisi "${ctx.teks('.sisa')}".`;
      },
    },
    {
      nama: 'Checkbox menandai selesai',
      async cek(ctx) {
        const cb = ctx.cariSemua('li input[type="checkbox"]')[0];
        if (!cb) return 'Setiap <li> harus punya <input type="checkbox">.';
        await ctx.klik(cb);
        const li = ctx.cariSemua('li')[0];
        if (!li.classList.contains('selesai')) return 'Setelah dicentang, <li> harus punya class "selesai".';
        if (!ctx.cariSemua('li input[type="checkbox"]')[0].checked) return 'Checkbox harus tercentang (checked={t.selesai}).';
        return ctx.teks('.sisa') === '2 tugas belum selesai' || `.sisa berisi "${ctx.teks('.sisa')}".`;
      },
    },
    {
      nama: 'Filter Aktif / Selesai / Semua',
      async cek(ctx) {
        const filter = (n) => [...ctx.cariSemua('.filter button')].find((b) => b.textContent.trim().toLowerCase() === n);
        if (!filter('aktif') || !filter('selesai') || !filter('semua')) return 'Buat tombol Semua, Aktif, Selesai di dalam .filter.';
        await ctx.klik(filter('aktif'));
        let isi = ctx.cariSemua('li span').map((s) => s.textContent);
        if (isi.join('|') !== 'Push ke GitHub|Tidur') return `Filter Aktif menampilkan [${isi.join(', ')}].`;
        if (!filter('aktif').classList.contains('aktif')) return 'Tombol filter yang dipilih harus punya class "aktif".';
        await ctx.klik(filter('selesai'));
        isi = ctx.cariSemua('li span').map((s) => s.textContent);
        if (isi.join('|') !== 'Belajar React') return `Filter Selesai menampilkan [${isi.join(', ')}].`;
        await ctx.klik(filter('semua'));
        return ctx.cariSemua('li').length === 3 || 'Filter Semua harus menampilkan 3 todo.';
      },
    },
    {
      nama: 'Hapus todo',
      async cek(ctx) {
        const li = ctx.cariSemua('li').find((x) => x.querySelector('span')?.textContent === 'Push ke GitHub');
        const btn = [...(li?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('Hapus'));
        if (!btn) return 'Setiap <li> harus punya tombol Hapus.';
        await ctx.klik(btn);
        const isi = ctx.cariSemua('li span').map((s) => s.textContent);
        if (isi.join('|') !== 'Belajar React|Tidur') return `Setelah menghapus: [${isi.join(', ')}].`;
        return ctx.teks('.sisa') === '1 tugas belum selesai' || `.sisa berisi "${ctx.teks('.sisa')}".`;
      },
    },
  ],
};
