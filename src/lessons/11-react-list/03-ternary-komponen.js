export default {
  id: 'react-ternary-komponen',
  judul: 'Kondisional dengan Komponen',
  tipe: 'react',
  xp: 25,
  css: `.status { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; margin: 2px; }
.status.selesai { background: #e1f7ec; color: #15a36a; }
.status.proses { background: #fff1d6; color: #a55a00; }
.status.rencana { background: #eee; color: #555; }`,
  materi: `
# Memilih tampilan di dalam komponen

## Early return
Kalau ada kondisi yang membuat seluruh tampilan berbeda, \`return\` lebih awal:

~~~jsx
function Profil({ user }) {
  if (!user) {
    return <button>Login</button>;
  }
  return <p>Selamat datang, {user.nama}</p>;
}
~~~

## Object sebagai "tabel pencarian"
Untuk banyak pilihan (seperti \`switch\`), object sering lebih rapi daripada ternary bertumpuk:

~~~jsx
const LABEL = {
  selesai: "✅ Selesai",
  proses: "🚧 Dalam proses",
  rencana: "📝 Rencana",
};

function Status({ status }) {
  return <span className={\`status \${status}\`}>{LABEL[status] ?? "❓ Tidak diketahui"}</span>;
}
~~~

Bandingkan dengan \`dict.get(status, "default")\` di Python.

## Mengembalikan null
Komponen boleh me-\`return null\` untuk **tidak menampilkan apa pun**:

~~~jsx
function Peringatan({ pesan }) {
  if (!pesan) return null;
  return <div className="peringatan">{pesan}</div>;
}
~~~
`,
  tugas: `
1. Buat komponen \`Status({ status })\` → \`<span class="status <status>">label</span>\` dengan label:
   \`selesai\` → \`✅ Selesai\`, \`proses\` → \`🚧 Dalam proses\`, \`rencana\` → \`📝 Rencana\`, lainnya → \`❓ Tidak diketahui\` (class tetap \`status <status>\`).
2. Buat komponen \`Salam({ user })\`: jika \`user\` null → \`<p class="tamu">Halo, tamu! Silakan login.</p>\`, jika ada → \`<p class="member">Halo, <nama>!</p>\`.
3. Di \`App\`: state \`user\` (awal \`null\`). Tampilkan \`<Salam user={user} />\`, tombol \`Login\` (set user \`{ nama: "Budi" }\`) yang **berganti** menjadi tombol \`Logout\` saat sudah login. Di bawahnya tampilkan \`<Status>\` untuk masing-masing: \`selesai\`, \`proses\`, \`rencana\`, \`batal\`.
`,
  kodeAwal: `import { useState } from "react";

function Status({ status }) {

}

function Salam({ user }) {

}

function App() {
  return (
    <div>
    </div>
  );
}

export default App;
`,
  solusi: `import { useState } from "react";

const LABEL = {
  selesai: "✅ Selesai",
  proses: "🚧 Dalam proses",
  rencana: "📝 Rencana",
};

function Status({ status }) {
  return <span className={\`status \${status}\`}>{LABEL[status] ?? "❓ Tidak diketahui"}</span>;
}

function Salam({ user }) {
  if (!user) {
    return <p className="tamu">Halo, tamu! Silakan login.</p>;
  }
  return <p className="member">Halo, {user.nama}!</p>;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Salam user={user} />
      {user ? (
        <button onClick={() => setUser(null)}>Logout</button>
      ) : (
        <button onClick={() => setUser({ nama: "Budi" })}>Login</button>
      )}
      <div>
        <Status status="selesai" />
        <Status status="proses" />
        <Status status="rencana" />
        <Status status="batal" />
      </div>
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'Buat object LABEL, lalu {LABEL[status] ?? "❓ Tidak diketahui"}',
    'className={`status ${status}`}',
    'Di Salam: if (!user) return <p className="tamu">...</p>;',
  ],
  tes: [
    {
      nama: 'Komponen Status menampilkan label & class',
      cek(ctx) {
        const s = ctx.cariSemua('span.status');
        if (s.length !== 4) return `Ada ${s.length} span.status, seharusnya 4.`;
        const h = [['selesai', '✅ Selesai'], ['proses', '🚧 Dalam proses'], ['rencana', '📝 Rencana'], ['batal', '❓ Tidak diketahui']];
        for (let i = 0; i < 4; i++) {
          if (!s[i].classList.contains(h[i][0])) return `Status ke-${i + 1} harus punya class "status ${h[i][0]}".`;
          if (s[i].textContent !== h[i][1]) return `Status "${h[i][0]}" berlabel "${s[i].textContent}", seharusnya "${h[i][1]}".`;
        }
        return true;
      },
    },
    {
      nama: 'Awalnya tamu dengan tombol Login',
      cek(ctx) {
        if (ctx.teks('.tamu') !== 'Halo, tamu! Silakan login.') return 'Saat user null, tampilkan <p class="tamu">Halo, tamu! Silakan login.</p>.';
        if (ctx.ada('.member')) return '.member tidak boleh tampil saat belum login.';
        const tombol = ctx.cariSemua('button').map((b) => b.textContent.trim());
        return (tombol.includes('Login') && !tombol.includes('Logout')) || `Tombol yang tampil: [${tombol.join(', ')}]. Seharusnya hanya Login.`;
      },
    },
    {
      nama: 'Login → member & Logout; Logout → kembali tamu',
      async cek(ctx) {
        await ctx.klik(ctx.tombol('Login'));
        if (ctx.teks('.member') !== 'Halo, Budi!') return 'Setelah login tampilkan <p class="member">Halo, Budi!</p>.';
        const tombol = ctx.cariSemua('button').map((b) => b.textContent.trim());
        if (!tombol.includes('Logout') || tombol.includes('Login')) return `Setelah login, tombol yang tampil: [${tombol.join(', ')}]. Seharusnya hanya Logout.`;
        await ctx.klik(ctx.tombol('Logout'));
        return ctx.ada('.tamu') || 'Setelah logout, kembali ke tampilan tamu.';
      },
    },
  ],
};
