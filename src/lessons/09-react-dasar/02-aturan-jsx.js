export default {
  id: 'react-aturan-jsx',
  judul: 'Aturan JSX & Ekspresi {}',
  tipe: 'react',
  xp: 20,
  css: `.kartu { border: 2px solid #7c5cff; border-radius: 12px; padding: 12px 16px; max-width: 320px; }
.kartu h2 { margin: 0 0 4px; }`,
  materi: `
# Aturan-aturan JSX

JSX terlihat seperti HTML, tapi sebenarnya JavaScript. Karena itu ada beberapa aturan:

### 1. Harus ada satu elemen pembungkus
Fungsi hanya bisa me-\`return\` **satu** nilai. Kalau tidak mau menambah \`<div>\`, pakai **Fragment** \`<>...</>\`:

~~~jsx
return (
  <>
    <h1>Judul</h1>
    <p>Paragraf</p>
  </>
);
~~~

### 2. \`class\` → \`className\`
\`class\` adalah kata kunci di JavaScript, jadi atribut HTML \`class\` ditulis **\`className\`**.

~~~jsx
<div className="kartu">...</div>
~~~

### 3. Semua tag harus ditutup
\`<img>\`, \`<br>\`, \`<input>\` wajib ditulis **self-closing**: \`<img src="..." />\`, \`<br />\`, \`<input />\`.

### 4. \`{ }\` untuk menyisipkan JavaScript
Di dalam JSX, kurung kurawal membuka "jendela" ke JavaScript. Apa pun **ekspresi** JS bisa ditaruh di sana:

~~~jsx
function App() {
  const nama = "Budi";
  const tahunLahir = 2005;
  return (
    <div>
      <h2>{nama}</h2>
      <p>Umur: {2025 - tahunLahir} tahun</p>
      <p>{nama.toUpperCase()}</p>
    </div>
  );
}
~~~

Ini mirip f-string di Python: \`f"Umur: {2025 - tahun_lahir}"\`.
`,
  tugas: `
Kode di editor punya **3 kesalahan JSX**. Perbaiki semuanya supaya:

1. Elemen pembungkus \`<div>\` memakai class \`kartu\` (pakai atribut yang benar!).
2. \`<h2>\` menampilkan **isi variabel** \`nama\` (bukan teks "nama").
3. \`<p>\` menampilkan \`Semester: \` diikuti **isi variabel** \`semester\`, jadi hasilnya \`Semester: 3\`.
4. Tag \`<br>\` ditulis dengan benar.
`,
  kodeAwal: `function App() {
  const nama = "Sinta";
  const semester = 3;

  return (
    <div class="kartu">
      <h2>nama</h2>
      <br>
      <p>Semester: semester</p>
    </div>
  );
}

export default App;
`,
  solusi: `function App() {
  const nama = "Sinta";
  const semester = 3;

  return (
    <div className="kartu">
      <h2>{nama}</h2>
      <br />
      <p>Semester: {semester}</p>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Kode awal belum bisa jalan karena <br> tidak ditutup. Tulis <br />.',
    'class di JSX ditulis className.',
    'Untuk menampilkan isi variabel, bungkus dengan kurung kurawal: {nama}',
  ],
  tes: [
    {
      nama: '<div> memakai className "kartu"',
      cek(ctx) {
        if (/<div[^>]*\sclass\s*=/.test(ctx.kode)) return 'Di JSX, atribut class ditulis `className`.';
        return ctx.ada('div.kartu') || 'Belum ada <div> dengan class "kartu".';
      },
    },
    {
      nama: '<h2> menampilkan isi variabel nama',
      cek(ctx) {
        const t = ctx.teks('h2');
        if (t === 'nama') return '<h2> masih menampilkan tulisan "nama". Bungkus dengan kurung kurawal: {nama}.';
        return t === 'Sinta' || `<h2> menampilkan "${t}", seharusnya "Sinta".`;
      },
    },
    {
      nama: '<p> menampilkan "Semester: 3"',
      cek(ctx) {
        const t = ctx.teks('p');
        return t === 'Semester: 3' || `<p> menampilkan "${t}", seharusnya "Semester: 3".`;
      },
    },
  ],
};
