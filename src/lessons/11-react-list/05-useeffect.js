export default {
  id: 'react-useeffect',
  judul: 'useEffect Sederhana',
  tipe: 'react',
  xp: 30,
  css: `.waktu { font-size: 40px; font-family: monospace; font-weight: bold; }`,
  materi: `
# useEffect: melakukan sesuatu setelah render

Komponen React seharusnya hanya **menghitung tampilan**. Tapi kadang kita butuh "efek samping" yang terjadi di luar tampilan:
- mengubah \`document.title\`
- menjalankan timer (\`setInterval\`)
- mengambil data dari API (\`fetch\`)
- menyimpan ke \`localStorage\`

Tempatnya di **\`useEffect\`**:

~~~jsx
import { useState, useEffect } from "react";

function App() {
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    document.title = \`Diklik \${jumlah} kali\`;
  }, [jumlah]);          // ← dependency array

  ...
}
~~~

## Dependency array (argumen kedua)

| Penulisan | Kapan efek dijalankan |
| --- | --- |
| \`useEffect(fn, [a, b])\` | setelah render pertama, **dan** setiap kali \`a\` atau \`b\` berubah |
| \`useEffect(fn, [])\` | **sekali saja** setelah render pertama |
| \`useEffect(fn)\` | setelah **setiap** render (jarang dibutuhkan) |

## Cleanup
Kalau efeknya memulai sesuatu yang terus berjalan (timer, listener), **kembalikan fungsi** untuk menghentikannya. React memanggil fungsi itu sebelum efek dijalankan ulang atau saat komponen dihilangkan:

~~~jsx
useEffect(() => {
  if (!jalan) return;                         // tidak melakukan apa-apa
  const id = setInterval(() => {
    setDetik((d) => d + 1);                   // updater function!
  }, 1000);
  return () => clearInterval(id);             // cleanup
}, [jalan]);
~~~

Kenapa \`setDetik((d) => d + 1)\` dan bukan \`setDetik(detik + 1)\`? Callback interval "mengingat" nilai \`detik\` saat efek dibuat (nilai lama). Updater function selalu mendapat nilai terbaru.

⚠️ Jangan memanggil \`setState\` langsung di badan efek tanpa kondisi, apalagi tanpa dependency array. Hasilnya: render → efek → setState → render → efek... tanpa henti.
`,
  tugas: `
Buat stopwatch sederhana (satuan **0,1 detik**):

1. State \`sepersepuluh\` (angka, awal 0) dan \`jalan\` (boolean, awal false).
2. \`<div class="waktu">\` menampilkan detik dengan satu desimal: \`0.0\`, \`0.1\`, ... \`12.3\` (petunjuk: \`(sepersepuluh / 10).toFixed(1)\`).
3. Tombol \`Mulai\` / \`Jeda\` (teks berganti sesuai \`jalan\`). Saat jalan, \`useEffect\` menjalankan \`setInterval\` setiap **100 ms** yang menambah \`sepersepuluh\`. Jangan lupa **cleanup**!
4. Tombol \`Reset\` menghentikan stopwatch dan mengembalikan ke \`0.0\`.
5. \`useEffect\` lain yang mengubah \`document.title\` menjadi \`⏱️ 1.5 detik\` setiap waktunya berubah.
`,
  kodeAwal: `import { useState, useEffect } from "react";

function App() {
  const [sepersepuluh, setSepersepuluh] = useState(0);
  const [jalan, setJalan] = useState(false);

  return (
    <div>
      <div className="waktu">0.0</div>
      <button>Mulai</button>
      <button>Reset</button>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState, useEffect } from "react";

function App() {
  const [sepersepuluh, setSepersepuluh] = useState(0);
  const [jalan, setJalan] = useState(false);
  const teks = (sepersepuluh / 10).toFixed(1);

  useEffect(() => {
    if (!jalan) return;
    const id = setInterval(() => {
      setSepersepuluh((s) => s + 1);
    }, 100);
    return () => clearInterval(id);
  }, [jalan]);

  useEffect(() => {
    document.title = \`⏱️ \${teks} detik\`;
  }, [teks]);

  return (
    <div>
      <div className="waktu">{teks}</div>
      <button onClick={() => setJalan(!jalan)}>{jalan ? "Jeda" : "Mulai"}</button>
      <button
        onClick={() => {
          setJalan(false);
          setSepersepuluh(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'useEffect(() => { if (!jalan) return; const id = setInterval(...); return () => clearInterval(id); }, [jalan]);',
    'Di dalam interval: setSepersepuluh((s) => s + 1);',
    'Efek kedua: useEffect(() => { document.title = `⏱️ ${teks} detik`; }, [teks]);',
  ],
  tes: [
    {
      nama: 'Awal 0.0 dan tombol Mulai',
      cek(ctx) {
        if (ctx.teks('.waktu') !== '0.0') return `.waktu berisi "${ctx.teks('.waktu')}", seharusnya "0.0".`;
        return ctx.pakai('useEffect') || 'Gunakan useEffect.';
      },
    },
    {
      nama: 'Mulai → waktu berjalan',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Mulai'));
        await ctx.tunggu(450);
        const v = parseFloat(ctx.teks('.waktu'));
        if (!(v >= 0.3 && v <= 0.7)) return `Setelah ±0,45 detik, .waktu menunjukkan "${ctx.teks('.waktu')}". Seharusnya sekitar 0.4. Interval 100 ms?`;
        if (!/^\d+\.\d$/.test(ctx.teks('.waktu'))) return 'Tampilkan dengan satu desimal, misalnya 0.4 (pakai toFixed(1)).';
        return ctx.cariSemua('button').some((b) => b.textContent.trim() === 'Jeda') || 'Saat berjalan, tombol berubah menjadi "Jeda".';
      },
    },
    {
      nama: 'Jeda menghentikan waktu (cleanup bekerja)',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Jeda'));
        const a = ctx.teks('.waktu');
        await ctx.tunggu(350);
        const b = ctx.teks('.waktu');
        return a === b || `Setelah Jeda, waktu masih bertambah (${a} → ${b}). Kembalikan fungsi cleanup: return () => clearInterval(id);`;
      },
    },
    {
      nama: 'document.title mengikuti waktu & Reset',
      async cek(ctx) {
        const t = ctx.teks('.waktu');
        if (ctx.document.title !== `⏱️ ${t} detik`) return `document.title = "${ctx.document.title}", seharusnya "⏱️ ${t} detik".`;
        await ctx.klik(ctx.tombol('Reset'));
        if (ctx.teks('.waktu') !== '0.0') return 'Reset harus mengembalikan waktu ke 0.0.';
        return ctx.document.title === '⏱️ 0.0 detik' || `Setelah reset, title = "${ctx.document.title}".`;
      },
    },
  ],
};
