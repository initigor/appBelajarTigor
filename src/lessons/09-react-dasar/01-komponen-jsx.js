export default {
  id: 'react-komponen-jsx',
  judul: 'Komponen Pertamamu',
  tipe: 'react',
  xp: 20,
  materi: `
# Selamat datang di React ⚛️

Di chapter DOM kamu mengubah halaman satu per satu: cari elemen, lalu ganti isinya. Cara itu cepat berantakan kalau halamannya besar.

React membalik cara berpikirnya: kamu cukup **mendeskripsikan tampilan** dalam bentuk fungsi, dan React yang mengurus perubahan DOM-nya.

## Komponen = fungsi yang mengembalikan tampilan

~~~jsx
function App() {
  return <h1>Halo, React!</h1>;
}

export default App;
~~~

- **Komponen** adalah fungsi JavaScript biasa yang namanya diawali **huruf kapital** (\`App\`, bukan \`app\`).
- Yang di-\`return\` adalah **JSX**, yaitu sintaks mirip HTML di dalam JavaScript. JSX bukan string (tidak pakai kutip) dan bukan HTML sungguhan. Babel mengubahnya menjadi pemanggilan fungsi JavaScript.
- \`export default App\` artinya komponen ini diekspor sebagai "komponen utama" dari file, mirip \`if __name__ == "__main__"\` di Python. Di latihan ini, komponen yang di-export default akan ditampilkan di tab **Preview**.

## JSX yang lebih dari satu baris
Bungkus dengan kurung \`( )\` supaya rapi:

~~~jsx
function App() {
  return (
    <div>
      <h1>Portofolio Budi</h1>
      <p>Mahasiswa Teknik Informatika</p>
    </div>
  );
}
~~~
`,
  tugas: `
Ubah komponen \`App\` supaya menampilkan:

1. Sebuah \`<h1>\` berisi teks **\`Halo, React!\`**
2. Di bawahnya, sebuah \`<p>\` berisi teks **\`Ini komponen pertamaku\`**

Bungkus keduanya dengan satu \`<div>\`.
`,
  kodeAwal: `function App() {
  return <h1>Ganti aku</h1>;
}

export default App;
`,
  solusi: `function App() {
  return (
    <div>
      <h1>Halo, React!</h1>
      <p>Ini komponen pertamaku</p>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Karena ada dua elemen, bungkus dengan <div> ... </div> dan beri kurung ( ) setelah return.',
    'Isi <h1> dan <p> ditulis langsung tanpa tanda kutip: <h1>Halo, React!</h1>',
  ],
  tes: [
    {
      nama: 'Ada <h1> berisi "Halo, React!"',
      cek(ctx) {
        const t = ctx.teks('h1');
        return t === 'Halo, React!' || `Isi <h1> sekarang "${t}", seharusnya "Halo, React!".`;
      },
    },
    {
      nama: 'Ada <p> berisi "Ini komponen pertamaku"',
      cek(ctx) {
        const t = ctx.teks('p');
        return t === 'Ini komponen pertamaku' || `Isi <p> sekarang "${t}", seharusnya "Ini komponen pertamaku".`;
      },
    },
    {
      nama: '<h1> dan <p> dibungkus satu <div>',
      cek(ctx) {
        const h1 = ctx.cari('h1');
        const p = ctx.cari('p');
        if (h1.parentElement?.tagName !== 'DIV' || h1.parentElement !== p.parentElement) return 'Letakkan <h1> dan <p> di dalam <div> yang sama.';
        return true;
      },
    },
  ],
};
