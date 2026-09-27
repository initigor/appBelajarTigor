export default {
  id: 'destructuring-object',
  judul: 'Destructuring Object',
  tipe: 'js',
  xp: 20,
  materi: `
# Destructuring Object

Destructuring = "membongkar" isi object ke beberapa variabel sekaligus.

~~~js
const user = { nama: "Budi", umur: 20, kota: "Bandung" };

// cara lama
const nama = user.nama;
const umur = user.umur;

// destructuring
const { nama, umur } = user;
~~~

Nama variabel harus **sama** dengan nama properti.

## Ganti nama, nilai default, bersarang
~~~js
const { nama: namaUser } = user;            // simpan ke variabel bernama namaUser
const { hobi = "tidak ada" } = user;         // default jika properti undefined
const data = { profil: { email: "b@x.id" } };
const { profil: { email } } = data;          // ambil yang bersarang
~~~

## Di parameter fungsi 🔥
Ini **sangat sering** dipakai di React untuk props:

~~~js
function kartu({ nama, umur = 17 }) {
  return \`\${nama} (\${umur})\`;
}
kartu({ nama: "Sinta" });   // "Sinta (17)"
~~~

Mirip keyword argument di Python (\`def kartu(*, nama, umur=17)\`), tapi yang dikirim adalah **satu object**.
`,
  tugas: `
1. Dari object \`pengguna\`, pakai **satu baris destructuring** untuk membuat variabel \`nama\` dan \`email\`.
2. Pakai destructuring bersarang untuk mengambil \`pengguna.alamat.kota\` ke variabel bernama **\`kotaAsal\`**.
3. Buat fungsi \`kartuNama({ nama, jabatan = "Mahasiswa" })\` yang mengembalikan \`"Budi - Mahasiswa"\`. Parameter harus di-destructure langsung.
`,
  kodeAwal: `const pengguna = {
  nama: "Budi",
  email: "budi@kampus.ac.id",
  alamat: { kota: "Bandung", kodePos: "40132" },
};

const nama = pengguna.nama;
`,
  solusi: `const pengguna = {
  nama: "Budi",
  email: "budi@kampus.ac.id",
  alamat: { kota: "Bandung", kodePos: "40132" },
};

const { nama, email } = pengguna;
const { alamat: { kota: kotaAsal } } = pengguna;

function kartuNama({ nama, jabatan = "Mahasiswa" }) {
  return \`\${nama} - \${jabatan}\`;
}

console.log(nama, email, kotaAsal);
console.log(kartuNama({ nama: "Sinta", jabatan: "Asisten Lab" }));
`,
  petunjuk: [
    'const { nama, email } = pengguna;',
    'Bersarang + ganti nama: const { alamat: { kota: kotaAsal } } = pengguna;',
    'function kartuNama({ nama, jabatan = "Mahasiswa" }) { ... }',
  ],
  tes: [
    {
      nama: 'nama dan email diambil dengan destructuring',
      cek(ctx) {
        if (!ctx.pakai(/const\s*\{[^}]*\bnama\b[^}]*\bemail\b[^}]*\}\s*=\s*pengguna|const\s*\{[^}]*\bemail\b[^}]*\bnama\b[^}]*\}\s*=\s*pengguna/)) return 'Gunakan satu baris: const { nama, email } = pengguna;';
        return (ctx.variabel('nama') === 'Budi' && ctx.variabel('email') === 'budi@kampus.ac.id') || 'nama/email belum benar.';
      },
    },
    {
      nama: 'kotaAsal = "Bandung" dengan destructuring bersarang',
      cek(ctx) {
        if (!ctx.pakai(/kota\s*:\s*kotaAsal/)) return 'Gunakan destructuring bersarang dengan ganti nama: { alamat: { kota: kotaAsal } }';
        return ctx.variabel('kotaAsal') === 'Bandung' || `kotaAsal = ${JSON.stringify(ctx.ambil('kotaAsal'))}, seharusnya "Bandung".`;
      },
    },
    {
      nama: 'kartuNama men-destructure parameter dengan default',
      cek(ctx) {
        if (!ctx.pakai(/function\s+kartuNama\s*\(\s*\{/)) return 'Parameter kartuNama harus di-destructure: function kartuNama({ nama, jabatan = "Mahasiswa" })';
        const a = ctx.panggil('kartuNama', { nama: 'Budi' });
        if (a !== 'Budi - Mahasiswa') return `kartuNama({ nama: "Budi" }) mengembalikan ${JSON.stringify(a)}, seharusnya "Budi - Mahasiswa".`;
        const b = ctx.panggil('kartuNama', { nama: 'Sinta', jabatan: 'Dosen' });
        return b === 'Sinta - Dosen' || `kartuNama({ nama: "Sinta", jabatan: "Dosen" }) mengembalikan ${JSON.stringify(b)}.`;
      },
    },
  ],
};
