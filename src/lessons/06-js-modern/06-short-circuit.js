export default {
  id: 'short-circuit',
  judul: 'Short-circuit && dan ||',
  tipe: 'js',
  xp: 20,
  materi: `
# Short-circuit: && dan || tidak selalu menghasilkan boolean

Di C, \`a && b\` menghasilkan \`0\` atau \`1\`. Di JavaScript (dan Python!), \`&&\` dan \`||\` mengembalikan **salah satu operand-nya**:

| Ekspresi | Aturan | Contoh | Hasil |
| --- | --- | --- | --- |
| \`a \\|\\| b\` | kembalikan \`a\` jika truthy, kalau tidak \`b\` | \`"" \\|\\| "Anonim"\` | \`"Anonim"\` |
| \`a && b\` | kembalikan \`a\` jika falsy, kalau tidak \`b\` | \`true && "Halo"\` | \`"Halo"\` |

Python sama persis: \`"" or "Anonim"\` → \`"Anonim"\`, \`True and "Halo"\` → \`"Halo"\`.

"Short-circuit" artinya bagian kanan **tidak dievaluasi** jika hasil sudah pasti dari bagian kiri:

~~~js
false && console.log("tidak pernah dijalankan");
true || console.log("tidak pernah dijalankan");
~~~

## Pola umum
~~~js
// nilai default (tapi ingat jebakan 0 dan "" → pakai ?? kalau perlu)
const nama = inputNama || "Anonim";

// "jalankan jika"
user && console.log(user.nama);
isAdmin && hapusSemua();
~~~

## 🔥 Di JSX React
~~~jsx
{jumlahPesan > 0 && <p>Kamu punya {jumlahPesan} pesan</p>}
~~~
Jika kondisi \`false\`, React tidak menampilkan apa-apa.

⚠️ Jebakan di React: \`{jumlah && <p>...</p>}\` saat \`jumlah\` = \`0\` akan menampilkan **angka 0** di layar, karena \`0 && x\` menghasilkan \`0\`. Pakai kondisi boolean: \`{jumlah > 0 && ...}\`.
`,
  tugas: `
Pakai \`&&\` dan \`||\` (tanpa if dan ternary):

1. \`namaTampilan(nama)\` → \`nama\`, atau \`"Anonim"\` jika nama kosong/undefined.
2. \`pesanNotif(jumlah)\` → string \`"Kamu punya 3 pesan"\` jika jumlah > 0, selain itu \`false\`.
3. \`aksesAdmin(user)\` → \`"Selamat datang, Admin"\` jika \`user\` ada **dan** \`user.admin\` truthy; selain itu nilai falsy apa saja.
`,
  kodeAwal: `function namaTampilan(nama) {

}

function pesanNotif(jumlah) {

}

function aksesAdmin(user) {

}
`,
  solusi: `function namaTampilan(nama) {
  return nama || "Anonim";
}

function pesanNotif(jumlah) {
  return jumlah > 0 && \`Kamu punya \${jumlah} pesan\`;
}

function aksesAdmin(user) {
  return user && user.admin && "Selamat datang, Admin";
}

console.log(namaTampilan(""), pesanNotif(3), aksesAdmin({ admin: true }));
`,
  petunjuk: ['namaTampilan: return nama || "Anonim";', 'pesanNotif: return jumlah > 0 && `Kamu punya ${jumlah} pesan`;'],
  tes: [
    {
      nama: 'Tanpa if dan ternary',
      cek(ctx) {
        if (ctx.pakai(/\bif\s*\(/)) return 'Coba selesaikan tanpa if. Pakai && dan ||.';
        if (ctx.pakai(/\?[^.?]/)) return 'Coba selesaikan tanpa ternary. Pakai && dan ||.';
        return true;
      },
    },
    {
      nama: 'namaTampilan',
      cek(ctx) {
        for (const [n, h] of [['Budi', 'Budi'], ['', 'Anonim'], [undefined, 'Anonim']]) {
          const r = ctx.panggil('namaTampilan', n);
          if (r !== h) return `namaTampilan(${JSON.stringify(n)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
        }
        return true;
      },
    },
    {
      nama: 'pesanNotif',
      cek(ctx) {
        if (ctx.panggil('pesanNotif', 3) !== 'Kamu punya 3 pesan') return `pesanNotif(3) mengembalikan ${JSON.stringify(ctx.panggil('pesanNotif', 3))}.`;
        return ctx.panggil('pesanNotif', 0) === false || `pesanNotif(0) mengembalikan ${JSON.stringify(ctx.panggil('pesanNotif', 0))}, seharusnya false.`;
      },
    },
    {
      nama: 'aksesAdmin',
      cek(ctx) {
        if (ctx.panggil('aksesAdmin', { admin: true }) !== 'Selamat datang, Admin') return 'aksesAdmin({ admin: true }) seharusnya "Selamat datang, Admin".';
        if (ctx.panggil('aksesAdmin', { admin: false })) return 'aksesAdmin({ admin: false }) seharusnya falsy.';
        if (ctx.panggil('aksesAdmin', null)) return 'aksesAdmin(null) seharusnya falsy (dan tidak error).';
        return true;
      },
    },
  ],
};
