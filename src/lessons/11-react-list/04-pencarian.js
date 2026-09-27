export default {
  id: 'react-filter-pencarian',
  judul: 'Filter & Pencarian',
  tipe: 'react',
  xp: 30,
  css: `input { width: 260px; }
.info { color: #666; font-size: 14px; }
li { padding: 2px 0; }`,
  materi: `
# Membuat fitur pencarian

Gabungkan semua yang sudah kamu pelajari:
- **input terkontrol** menyimpan kata kunci di state
- **filter** menghitung daftar yang cocok (tidak perlu state tambahan!)
- **map** menampilkan hasilnya
- **render kondisional** untuk hasil kosong

~~~jsx
const [kunci, setKunci] = useState("");

const hasil = data.filter((item) =>
  item.nama.toLowerCase().includes(kunci.toLowerCase())
);
~~~

Setiap kali user mengetik, state \`kunci\` berubah, komponen di-render ulang, dan \`hasil\` dihitung ulang secara otomatis. Tidak perlu \`addEventListener\` atau \`innerHTML = ""\` seperti di Chapter 7!

## Tidak peka huruf besar/kecil
Samakan dulu keduanya dengan \`toLowerCase()\`, sehingga "BUDI", "budi", dan "Budi" sama-sama cocok.

## Mencari di beberapa properti
~~~js
const k = kunci.toLowerCase();
data.filter((m) => m.nama.toLowerCase().includes(k) || m.jurusan.toLowerCase().includes(k));
~~~
`,
  tugas: `
Array \`mahasiswa\` sudah disediakan.

1. \`<input placeholder="Cari nama atau jurusan...">\` terkontrol.
2. Tampilkan hasil sebagai \`<li>\` berformat \`Budi - Teknik Informatika\` di dalam \`<ul>\`. Cocokkan kata kunci dengan **nama atau jurusan**, tanpa peka huruf besar/kecil, dan abaikan spasi di awal/akhir kata kunci.
3. \`<p class="info">Menampilkan 2 dari 5 mahasiswa</p>\`.
4. Jika tidak ada yang cocok: jangan tampilkan \`<ul>\`, tapi tampilkan \`<p class="kosong">Tidak ada hasil untuk "xyz"</p>\`.
`,
  kodeAwal: `import { useState } from "react";

const mahasiswa = [
  { id: 1, nama: "Budi", jurusan: "Teknik Informatika" },
  { id: 2, nama: "Sinta", jurusan: "Sistem Informasi" },
  { id: 3, nama: "Andi", jurusan: "Teknik Elektro" },
  { id: 4, nama: "Citra", jurusan: "Teknik Informatika" },
  { id: 5, nama: "Dewi", jurusan: "Desain Komunikasi Visual" },
];

function App() {
  return (
    <div>
      <input placeholder="Cari nama atau jurusan..." />
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

const mahasiswa = [
  { id: 1, nama: "Budi", jurusan: "Teknik Informatika" },
  { id: 2, nama: "Sinta", jurusan: "Sistem Informasi" },
  { id: 3, nama: "Andi", jurusan: "Teknik Elektro" },
  { id: 4, nama: "Citra", jurusan: "Teknik Informatika" },
  { id: 5, nama: "Dewi", jurusan: "Desain Komunikasi Visual" },
];

function App() {
  const [kunci, setKunci] = useState("");
  const k = kunci.trim().toLowerCase();
  const hasil = mahasiswa.filter(
    (m) => m.nama.toLowerCase().includes(k) || m.jurusan.toLowerCase().includes(k)
  );

  return (
    <div>
      <input placeholder="Cari nama atau jurusan..." value={kunci} onChange={(e) => setKunci(e.target.value)} />
      <p className="info">
        Menampilkan {hasil.length} dari {mahasiswa.length} mahasiswa
      </p>
      {hasil.length > 0 ? (
        <ul>
          {hasil.map((m) => (
            <li key={m.id}>
              {m.nama} - {m.jurusan}
            </li>
          ))}
        </ul>
      ) : (
        <p className="kosong">Tidak ada hasil untuk "{kunci.trim()}"</p>
      )}
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'const k = kunci.trim().toLowerCase();',
    'const hasil = mahasiswa.filter((m) => m.nama.toLowerCase().includes(k) || m.jurusan.toLowerCase().includes(k));',
  ],
  tes: [
    {
      nama: 'Awalnya menampilkan semua',
      cek(ctx) {
        const n = ctx.cariSemua('ul li').length;
        if (n !== 5) return `Ada ${n} <li>, seharusnya 5 saat pencarian kosong.`;
        if (ctx.teks('ul li') !== 'Budi - Teknik Informatika') return `Format <li>: "${ctx.teks('ul li')}", seharusnya "Budi - Teknik Informatika".`;
        return ctx.teks('.info') === 'Menampilkan 5 dari 5 mahasiswa' || `.info berisi "${ctx.teks('.info')}".`;
      },
    },
    {
      nama: 'Cari berdasarkan jurusan (tidak peka huruf besar/kecil)',
      async cek(ctx) {
        await ctx.ketik('input', '  INFORMATIKA ');
        const li = ctx.cariSemua('ul li').map((x) => x.textContent.replace(/\s+/g, ' ').trim());
        if (li.join('|') !== 'Budi - Teknik Informatika|Citra - Teknik Informatika') return `Hasil untuk "INFORMATIKA": [${li.join(', ')}].`;
        return ctx.teks('.info') === 'Menampilkan 2 dari 5 mahasiswa' || `.info berisi "${ctx.teks('.info')}".`;
      },
    },
    {
      nama: 'Cari berdasarkan nama',
      async cek(ctx) {
        await ctx.ketik('input', 'sin');
        const li = ctx.cariSemua('ul li').map((x) => x.textContent.replace(/\s+/g, ' ').trim());
        return li.join('|') === 'Sinta - Sistem Informasi' || `Hasil untuk "sin": [${li.join(', ')}].`;
      },
    },
    {
      nama: 'Hasil kosong',
      async cek(ctx) {
        await ctx.ketik('input', 'xyz');
        if (ctx.ada('ul')) return 'Jika tidak ada hasil, <ul> tidak perlu ditampilkan.';
        return ctx.teks('.kosong') === 'Tidak ada hasil untuk "xyz"' || `Tampilkan <p class="kosong">Tidak ada hasil untuk "xyz"</p>.`;
      },
    },
  ],
};
