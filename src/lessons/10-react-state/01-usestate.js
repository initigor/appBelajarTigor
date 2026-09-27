export default {
  id: 'react-usestate',
  judul: 'useState: Counter',
  tipe: 'react',
  xp: 25,
  css: `.counter { text-align: center; max-width: 260px; }
.angka { font-size: 56px; font-weight: 800; margin: 8px 0; }
.counter button { margin: 0 4px; min-width: 48px; }`,
  materi: `
# State: data yang bisa berubah

Coba kode ini. Kenapa angkanya tidak berubah saat tombol diklik?

~~~jsx
function Counter() {
  let jumlah = 0;
  return <button onClick={() => { jumlah++; }}>{jumlah}</button>;
}
~~~

Variabel \`jumlah\` memang bertambah, tapi **React tidak tahu** bahwa tampilannya harus diperbarui. Selain itu, setiap kali komponen digambar ulang, fungsinya dijalankan dari awal sehingga \`jumlah\` kembali ke 0.

## useState
\`useState\` memberi komponen sebuah "ingatan" yang bertahan di antara render, **dan** memberi tahu React untuk menggambar ulang saat nilainya berubah:

~~~jsx
import { useState } from "react";

function Counter() {
  const [jumlah, setJumlah] = useState(0);   // 0 = nilai awal

  return (
    <button onClick={() => setJumlah(jumlah + 1)}>
      Diklik {jumlah} kali
    </button>
  );
}
~~~

- \`useState(0)\` mengembalikan array \`[nilaiSekarang, fungsiPengubah]\`, yang langsung kita destructure (Chapter 6!).
- **Jangan** mengubah langsung (\`jumlah++\`). Selalu pakai \`setJumlah(nilaiBaru)\`.
- Setiap kali \`setJumlah\` dipanggil, React menjalankan ulang fungsi \`Counter\` dengan nilai baru, lalu memperbarui DOM **hanya** di bagian yang berubah.

Bandingkan dengan Chapter 7: dulu kamu mengubah variabel **lalu** memperbarui \`textContent\` secara manual. Sekarang React yang mengurus bagian kedua itu.

## onClick
Event di React ditulis camelCase (\`onClick\`, \`onChange\`, \`onSubmit\`) dan menerima **fungsi**:

~~~jsx
<button onClick={() => setJumlah(0)}>Reset</button>   // ✅ kirim fungsi
<button onClick={setJumlah(0)}>Reset</button>         // ❌ dipanggil saat render → infinite loop!
~~~

## Aturan Hooks
Fungsi yang diawali \`use\` (\`useState\`, \`useEffect\`, ...) disebut **hooks**. Panggil hooks **hanya di level teratas** komponen, jangan di dalam if/loop.
`,
  tugas: `
Buat counter:
- \`<div class="counter">\` berisi \`<div class="angka">\` yang menampilkan angka (mulai dari **0**)
- tombol \`-1\`, \`Reset\`, dan \`+1\`
- Angka **tidak boleh kurang dari 0**. Jika sudah 0, tombol \`-1\` tidak mengurangi lagi.
`,
  kodeAwal: `import { useState } from "react";

function App() {
  let jumlah = 0;

  return (
    <div className="counter">
      <div className="angka">{jumlah}</div>
      <button onClick={() => { jumlah++; }}>+1</button>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

function App() {
  const [jumlah, setJumlah] = useState(0);

  return (
    <div className="counter">
      <div className="angka">{jumlah}</div>
      <button onClick={() => setJumlah(Math.max(jumlah - 1, 0))}>-1</button>
      <button onClick={() => setJumlah(0)}>Reset</button>
      <button onClick={() => setJumlah(jumlah + 1)}>+1</button>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'const [jumlah, setJumlah] = useState(0);',
    '+1: onClick={() => setJumlah(jumlah + 1)}',
    '-1 tanpa minus: setJumlah(Math.max(jumlah - 1, 0)) atau pakai if.',
  ],
  tes: [
    {
      nama: 'Awalnya 0, +1 tiga kali → 3',
      async cek(ctx) {
        if (ctx.teks('.angka') !== '0') return `Angka awal "${ctx.teks('.angka')}", seharusnya "0".`;
        const plus = ctx.tombol('+1');
        await ctx.klik(plus);
        await ctx.klik(plus);
        await ctx.klik(plus);
        const t = ctx.teks('.angka');
        if (t === '0') return 'Angka tidak berubah setelah diklik. Pakai useState dan setJumlah, bukan variabel biasa.';
        return t === '3' || `Setelah 3 klik, angka "${t}", seharusnya "3".`;
      },
    },
    {
      nama: '-1 mengurangi, Reset kembali ke 0',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('-1'));
        if (ctx.teks('.angka') !== '2') return `Setelah -1 dari 3, angka "${ctx.teks('.angka')}", seharusnya "2".`;
        await ctx.klik(ctx.tombol('Reset'));
        return ctx.teks('.angka') === '0' || `Setelah Reset, angka "${ctx.teks('.angka')}", seharusnya "0".`;
      },
    },
    {
      nama: 'Tidak bisa kurang dari 0',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('-1'));
        await ctx.klik(ctx.tombol('-1'));
        return ctx.teks('.angka') === '0' || `Angka menjadi "${ctx.teks('.angka')}". Seharusnya tetap 0.`;
      },
    },
  ],
};
