export default {
  id: 'array-of-object',
  judul: 'Array of Object',
  tipe: 'js',
  xp: 25,
  materi: `
# Array of Object: bentuk data paling umum di web

Hampir semua data di aplikasi web (daftar produk, postingan, kontak, proyek portofolio) berbentuk **array berisi object**:

~~~js
const mahasiswa = [
  { nama: "Budi", ipk: 3.4, angkatan: 2023 },
  { nama: "Sinta", ipk: 3.8, angkatan: 2022 },
  { nama: "Andi", ipk: 2.9, angkatan: 2023 },
];
~~~

Di C ini adalah **array of struct**, dan di Python **list of dict**. Semua method array bisa dipakai, dan di dalam callback kamu mengakses properti object-nya:

~~~js
// ambil satu kolom (Python: [m["nama"] for m in mahasiswa])
mahasiswa.map((m) => m.nama);                    // ["Budi", "Sinta", "Andi"]

// saring
mahasiswa.filter((m) => m.angkatan === 2023);    // Budi & Andi

// cari satu
mahasiswa.find((m) => m.nama === "Sinta");       // { nama: "Sinta", ... }

// urutkan berdasarkan properti (salin dulu!)
mahasiswa.slice().sort((a, b) => b.ipk - a.ipk); // Sinta, Budi, Andi

// hitung rata-rata
mahasiswa.reduce((acc, m) => acc + m.ipk, 0) / mahasiswa.length;
~~~

🔥 Di React, kamu akan menulis \`proyek.map((p) => <ProjectCard ... />)\` dengan data berbentuk persis seperti ini.
`,
  tugas: `
Setiap fungsi menerima \`data\` berupa array of object \`{ nama, ipk, angkatan }\`:

1. \`ambilNama(data)\` → array nama saja.
2. \`cariMahasiswa(data, nama)\` → object mahasiswa dengan nama itu, atau \`undefined\`.
3. \`ipkDiAtas(data, batas)\` → array **nama** mahasiswa dengan ipk ≥ batas.
4. \`urutkanIpk(data)\` → array object baru, diurutkan dari ipk **tertinggi**. \`data\` asli jangan diubah.
`,
  kodeAwal: `const mahasiswa = [
  { nama: "Budi", ipk: 3.4, angkatan: 2023 },
  { nama: "Sinta", ipk: 3.8, angkatan: 2022 },
  { nama: "Andi", ipk: 2.9, angkatan: 2023 },
];

function ambilNama(data) {

}

function cariMahasiswa(data, nama) {

}

function ipkDiAtas(data, batas) {

}

function urutkanIpk(data) {

}
`,
  solusi: `const mahasiswa = [
  { nama: "Budi", ipk: 3.4, angkatan: 2023 },
  { nama: "Sinta", ipk: 3.8, angkatan: 2022 },
  { nama: "Andi", ipk: 2.9, angkatan: 2023 },
];

function ambilNama(data) {
  return data.map((m) => m.nama);
}

function cariMahasiswa(data, nama) {
  return data.find((m) => m.nama === nama);
}

function ipkDiAtas(data, batas) {
  return data.filter((m) => m.ipk >= batas).map((m) => m.nama);
}

function urutkanIpk(data) {
  return data.slice().sort((a, b) => b.ipk - a.ipk);
}

console.log(ambilNama(mahasiswa), ipkDiAtas(mahasiswa, 3), urutkanIpk(mahasiswa));
`,
  petunjuk: [
    'ipkDiAtas: filter dulu, lalu map ke nama.',
    'urutkanIpk: data.slice().sort((a, b) => b.ipk - a.ipk)',
  ],
  tes: [
    {
      nama: 'ambilNama dan cariMahasiswa benar',
      cek(ctx) {
        const data = [{ nama: 'X', ipk: 3 }, { nama: 'Y', ipk: 2 }];
        const n = ctx.panggil('ambilNama', data);
        if (JSON.stringify(n) !== '["X","Y"]') return `ambilNama mengembalikan ${JSON.stringify(n)}, seharusnya ["X","Y"].`;
        if (ctx.panggil('cariMahasiswa', data, 'Y') !== data[1]) return 'cariMahasiswa(data, "Y") seharusnya mengembalikan object milik Y.';
        return ctx.panggil('cariMahasiswa', data, 'Z') === undefined || 'Jika tidak ditemukan, cariMahasiswa harus mengembalikan undefined.';
      },
    },
    {
      nama: 'ipkDiAtas mengembalikan nama',
      cek(ctx) {
        const data = [{ nama: 'A', ipk: 3.5 }, { nama: 'B', ipk: 2.5 }, { nama: 'C', ipk: 3.0 }];
        const r = ctx.panggil('ipkDiAtas', data, 3);
        if (Array.isArray(r) && typeof r[0] === 'object') return 'ipkDiAtas harus mengembalikan array NAMA (string), bukan object. Tambahkan .map((m) => m.nama).';
        return JSON.stringify(r) === '["A","C"]' || `ipkDiAtas(data, 3) mengembalikan ${JSON.stringify(r)}, seharusnya ["A","C"].`;
      },
    },
    {
      nama: 'urutkanIpk dari tertinggi tanpa mengubah data',
      cek(ctx) {
        const data = [{ nama: 'A', ipk: 3.1 }, { nama: 'B', ipk: 3.9 }, { nama: 'C', ipk: 2.0 }];
        const r = ctx.panggil('urutkanIpk', data);
        const nama = Array.isArray(r) ? r.map((m) => m.nama).join('') : '';
        if (nama !== 'BAC') return `Urutan hasil urutkanIpk: ${nama || JSON.stringify(r)}, seharusnya B, A, C.`;
        return data.map((m) => m.nama).join('') === 'ABC' || 'Array asli ikut terurut. Salin dulu dengan slice().';
      },
    },
  ],
};
