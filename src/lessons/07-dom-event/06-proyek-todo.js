export default {
  id: 'proyek-todo-dom',
  judul: 'Mini Proyek: Todo List (DOM)',
  tipe: 'dom',
  xp: 50,
  proyek: true,
  css: `#daftar-todo { list-style: none; padding: 0; max-width: 360px; }
#daftar-todo li { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; border: 1px solid #ddd; border-radius: 8px; margin: 6px 0; cursor: pointer; }
#daftar-todo li.selesai span { text-decoration: line-through; color: #999; }
.hapus { border: none; background: #fde8ec; color: #b00020; }`,
  html: `<h2>📝 Tugasku</h2>
<form id="form-todo">
  <input id="input-todo" placeholder="Tugas baru...">
  <button type="submit">Tambah</button>
</form>
<ul id="daftar-todo"></ul>
<p id="sisa">0 tugas tersisa</p>`,
  materi: `
# 🛠️ Mini Proyek: Todo List

Waktunya membuat aplikasi kecil yang utuh dengan DOM murni! Kamu akan memakai semua isi Chapter 7: querySelector, createElement, classList, event, dan form.

## Arsitektur: data → tampilan
Simpan data di array of object, lalu buat satu fungsi \`render()\` yang menggambar ulang seluruh daftar dari data:

~~~js
const todos = [];   // { teks: "Belajar", selesai: false }

function render() {
  daftar.innerHTML = "";
  todos.forEach((todo, i) => {
    // buat <li>, isi, pasang event, append
  });
  // perbarui teks "x tugas tersisa"
}
~~~

Setiap kali data berubah (tambah, centang, hapus), **ubah array-nya lalu panggil \`render()\`**. Dengan begitu, tampilan selalu sinkron dengan data. Inilah cara berpikir yang juga dipakai React.

## stopPropagation
Tombol hapus ada **di dalam** \`<li>\`. Tanpa penanganan khusus, klik tombol hapus juga ikut dianggap sebagai klik pada \`<li>\` (event "menggelembung" ke atas). Hentikan dengan:

~~~js
tombolHapus.addEventListener("click", (e) => {
  e.stopPropagation();
  // hapus...
});
~~~
`,
  tugas: `
Struktur setiap todo di \`#daftar-todo\`:
~~~html
<li class="selesai?">
  <span>Teks tugas</span>
  <button class="hapus">✕</button>
</li>
~~~

1. Submit \`#form-todo\` → tambahkan todo dari \`#input-todo\` (trim; abaikan jika kosong), lalu kosongkan input.
2. Klik \`<li>\` → toggle status selesai (class \`selesai\` pada \`<li>\`).
3. Klik tombol \`.hapus\` → hapus todo itu.
4. \`#sisa\` selalu berisi \`<n> tugas tersisa\` (jumlah yang **belum** selesai).
`,
  kodeAwal: `const todos = [];
const form = document.querySelector("#form-todo");
const input = document.querySelector("#input-todo");
const daftar = document.querySelector("#daftar-todo");
const sisa = document.querySelector("#sisa");

function render() {

}

render();
`,
  solusi: `const todos = [];
const form = document.querySelector("#form-todo");
const input = document.querySelector("#input-todo");
const daftar = document.querySelector("#daftar-todo");
const sisa = document.querySelector("#sisa");

function render() {
  daftar.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    if (todo.selesai) li.classList.add("selesai");

    const span = document.createElement("span");
    span.textContent = todo.teks;

    const hapus = document.createElement("button");
    hapus.classList.add("hapus");
    hapus.textContent = "✕";
    hapus.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(i, 1);
      render();
    });

    li.addEventListener("click", () => {
      todo.selesai = !todo.selesai;
      render();
    });

    li.append(span, hapus);
    daftar.append(li);
  });
  const belum = todos.filter((t) => !t.selesai).length;
  sisa.textContent = \`\${belum} tugas tersisa\`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const teks = input.value.trim();
  if (teks === "") return;
  todos.push({ teks, selesai: false });
  input.value = "";
  render();
});

render();
`,
  petunjuk: [
    'Di handler submit: e.preventDefault(), trim, return jika kosong, push { teks, selesai: false }, lalu render().',
    'Di render: buat li, span, dan button.hapus untuk setiap todo; li.append(span, hapus).',
    'Hapus: todos.splice(i, 1). Toggle: todo.selesai = !todo.selesai. Keduanya diikuti render().',
  ],
  tes: [
    {
      nama: 'Menambah todo lewat form',
      async cek(ctx) {
        await ctx.ketik('#input-todo', 'Belajar DOM');
        await ctx.kirim('#form-todo');
        await ctx.ketik('#input-todo', 'Kerjakan tugas');
        await ctx.kirim('#form-todo');
        const li = ctx.cariSemua('#daftar-todo li');
        if (li.length !== 2) return `Setelah menambah 2 todo, ada ${li.length} <li> di #daftar-todo.`;
        const span = li[0].querySelector('span');
        if (!span || span.textContent.trim() !== 'Belajar DOM') return 'Teks todo harus berada di dalam <span> di setiap <li>.';
        return ctx.cari('#input-todo').value === '' || 'Kosongkan input setelah menambah.';
      },
    },
    {
      nama: 'Todo kosong diabaikan & #sisa benar',
      async cek(ctx) {
        await ctx.ketik('#input-todo', '   ');
        await ctx.kirim('#form-todo');
        if (ctx.cariSemua('#daftar-todo li').length !== 2) return 'Todo kosong seharusnya tidak ditambahkan.';
        return ctx.teks('#sisa') === '2 tugas tersisa' || `#sisa berisi "${ctx.teks('#sisa')}", seharusnya "2 tugas tersisa".`;
      },
    },
    {
      nama: 'Klik li menandai selesai',
      async cek(ctx) {
        await ctx.klik(ctx.cariSemua('#daftar-todo li')[0]);
        const li = ctx.cariSemua('#daftar-todo li');
        if (!li[0].classList.contains('selesai')) return 'Setelah diklik, <li> pertama harus punya class "selesai".';
        if (li[1].classList.contains('selesai')) return 'Hanya todo yang diklik yang ditandai selesai.';
        if (ctx.teks('#sisa') !== '1 tugas tersisa') return `#sisa berisi "${ctx.teks('#sisa')}", seharusnya "1 tugas tersisa".`;
        await ctx.klik(ctx.cariSemua('#daftar-todo li')[0]);
        return !ctx.cariSemua('#daftar-todo li')[0].classList.contains('selesai') || 'Klik kedua harus membatalkan status selesai (toggle).';
      },
    },
    {
      nama: 'Tombol .hapus menghapus todo yang tepat',
      async cek(ctx) {
        const tombol = ctx.cariSemua('#daftar-todo li')[0].querySelector('.hapus');
        if (!tombol) return 'Setiap <li> harus punya <button class="hapus">.';
        await ctx.klik(tombol);
        const li = ctx.cariSemua('#daftar-todo li');
        if (li.length !== 1) return `Setelah menghapus, seharusnya tersisa 1 todo, ada ${li.length}.`;
        if (li[0].querySelector('span')?.textContent.trim() !== 'Kerjakan tugas') return 'Todo yang terhapus salah.';
        if (li[0].classList.contains('selesai')) return 'Klik tombol hapus ikut men-toggle li. Pakai e.stopPropagation().';
        return ctx.teks('#sisa') === '1 tugas tersisa' || `#sisa berisi "${ctx.teks('#sisa')}", seharusnya "1 tugas tersisa".`;
      },
    },
  ],
};
