export default {
  id: 'switch',
  judul: 'switch',
  tipe: 'js',
  xp: 15,
  materi: `
# switch

\`switch\` di JavaScript **sama dengan di C**, termasuk kewajiban menulis \`break\`!

~~~js
const bulan = 2;
let namaBulan;

switch (bulan) {
  case 1:
    namaBulan = "Januari";
    break;
  case 2:
    namaBulan = "Februari";
    break;
  default:
    namaBulan = "Tidak dikenal";
}
~~~

- Tanpa \`break\`, eksekusi akan **"jatuh" (fall through)** ke \`case\` berikutnya, persis seperti di C.
- \`default\` = cabang jika tidak ada \`case\` yang cocok (seperti \`else\`).
- Perbandingannya memakai \`===\`, jadi \`case "1"\` **tidak** cocok dengan angka \`1\`.
- Beda dengan C: \`case\` di JS boleh berupa **string**. Di C hanya boleh integer/char.

Python 3.10+ punya padanannya, yaitu \`match\`/\`case\`, yang tidak butuh \`break\`.

## Fall-through yang disengaja
Beberapa \`case\` bisa berbagi satu blok:

~~~js
switch (hari) {
  case "Sabtu":
  case "Minggu":
    console.log("Libur!");
    break;
  default:
    console.log("Kuliah");
}
~~~
`,
  tugas: `
Buat \`namaHari\` berdasarkan \`hari\` (angka 1–7) memakai **switch**:
1 → \`"Senin"\`, 2 → \`"Selasa"\`, 3 → \`"Rabu"\`, 4 → \`"Kamis"\`, 5 → \`"Jumat"\`, 6 → \`"Sabtu"\`, 7 → \`"Minggu"\`.

Selain itu → \`"Tidak valid"\`. Lalu cetak \`namaHari\`.
`,
  kodeAwal: `const hari = 3;
let namaHari;

// tulis switch di sini

console.log(namaHari);
`,
  solusi: `const hari = 3;
let namaHari;

switch (hari) {
  case 1:
    namaHari = "Senin";
    break;
  case 2:
    namaHari = "Selasa";
    break;
  case 3:
    namaHari = "Rabu";
    break;
  case 4:
    namaHari = "Kamis";
    break;
  case 5:
    namaHari = "Jumat";
    break;
  case 6:
    namaHari = "Sabtu";
    break;
  case 7:
    namaHari = "Minggu";
    break;
  default:
    namaHari = "Tidak valid";
}

console.log(namaHari);
`,
  petunjuk: [
    'Struktur: switch (hari) { case 1: namaHari = "Senin"; break; ... }',
    'Jangan lupa break di setiap case, kalau tidak nilainya "jatuh" ke case berikutnya.',
    'Cabang terakhir: default: namaHari = "Tidak valid";',
  ],
  tes: [
    {
      nama: 'Memakai switch dengan default',
      cek: (ctx) => (ctx.pakai(/switch\s*\(/) && ctx.pakai(/default\s*:/)) || 'Gunakan switch (hari) { ... } dan cabang default.',
    },
    {
      nama: 'Hari 1 sampai 7 menghasilkan nama yang benar',
      async cek(ctx) {
        const nama = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        for (let i = 1; i <= 7; i++) {
          const r = await ctx.jalankanDengan({ hari: i });
          const hasil = r.ambil('namaHari');
          if (hasil !== nama[i - 1]) {
            const jatuh = nama.includes(hasil) && nama.indexOf(hasil) > i - 1;
            return `Untuk hari ${i}, namaHari = ${JSON.stringify(hasil)}, seharusnya "${nama[i - 1]}".${jatuh ? ' Sepertinya ada break yang terlupa.' : ''}`;
          }
        }
        return true;
      },
    },
    {
      nama: 'Hari 0 dan 9 → "Tidak valid"',
      async cek(ctx) {
        for (const hari of [0, 9]) {
          const r = await ctx.jalankanDengan({ hari });
          if (r.ambil('namaHari') !== 'Tidak valid') return `Untuk hari ${hari}, namaHari = ${JSON.stringify(r.ambil('namaHari'))}, seharusnya "Tidak valid".`;
        }
        return ctx.adaLog('Rabu') || 'Cetak namaHari dengan console.log.';
      },
    },
  ],
};
