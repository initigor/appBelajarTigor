export default {
  id: 'array-slice-includes',
  judul: 'slice, includes, indexOf',
  tipe: 'js',
  xp: 15,
  materi: `
# Mencari & Memotong Array

| Tujuan | JavaScript | Python |
| --- | --- | --- |
| ada atau tidak? | \`arr.includes(x)\` | \`x in arr\` |
| posisi elemen | \`arr.indexOf(x)\` → \`-1\` jika tidak ada | \`arr.index(x)\` → error jika tidak ada |
| potong | \`arr.slice(awal, akhir)\` | \`arr[awal:akhir]\` |
| n terakhir | \`arr.slice(-n)\` | \`arr[-n:]\` |
| gabung jadi string | \`arr.join(", ")\` | \`", ".join(arr)\` |
| gabung dua array | \`a.concat(b)\` | \`a + b\` |

~~~js
const hari = ["Sen", "Sel", "Rab", "Kam", "Jum"];
hari.includes("Rab");   // true
hari.indexOf("Kam");    // 3
hari.indexOf("Min");    // -1
hari.slice(1, 3);       // ["Sel", "Rab"]   (indeks 3 tidak ikut)
hari.slice(-2);         // ["Kam", "Jum"]
hari.join(" - ");       // "Sen - Sel - Rab - Kam - Jum"
~~~

⚠️ \`a + b\` untuk dua array **tidak** menggabungkan array seperti di Python. Hasilnya string aneh: \`[1,2] + [3]\` → \`"1,23"\`. Pakai \`concat\` (atau spread \`[...a, ...b]\` yang akan dibahas di Chapter 6).

## slice tidak mengubah array asli
\`slice\` mengembalikan **array baru**. Ada method mirip bernama \`splice\` yang **mengubah** array asli (menghapus/menyisipkan). Namanya mirip, perilakunya berbeda. Kalau ragu, pakai \`slice\`.
`,
  tugas: `
Buat tiga fungsi:

1. \`ambilTengah(arr)\` → mengembalikan array tanpa elemen pertama dan terakhir.
   \`ambilTengah([1, 2, 3, 4])\` → \`[2, 3]\`
2. \`cekKehadiran(daftar, nama)\` → mengembalikan \`"Hadir"\` jika \`nama\` ada di \`daftar\`, selain itu \`"Tidak hadir"\`.
3. \`posisiDalamAntrian(antrian, nama)\` → nomor urut (mulai dari **1**), atau \`0\` jika tidak ada.
   \`posisiDalamAntrian(["A", "B", "C"], "B")\` → \`2\`
`,
  kodeAwal: `function ambilTengah(arr) {

}

function cekKehadiran(daftar, nama) {

}

function posisiDalamAntrian(antrian, nama) {

}
`,
  solusi: `function ambilTengah(arr) {
  return arr.slice(1, -1);
}

function cekKehadiran(daftar, nama) {
  return daftar.includes(nama) ? "Hadir" : "Tidak hadir";
}

function posisiDalamAntrian(antrian, nama) {
  return antrian.indexOf(nama) + 1;
}

console.log(ambilTengah([1, 2, 3, 4]));
console.log(cekKehadiran(["Budi", "Sinta"], "Sinta"));
console.log(posisiDalamAntrian(["A", "B", "C"], "B"));
`,
  petunjuk: [
    'ambilTengah: arr.slice(1, -1)',
    'posisiDalamAntrian: indexOf mengembalikan -1 jika tidak ada. Perhatikan apa yang terjadi kalau ditambah 1.',
  ],
  tes: [
    {
      nama: 'ambilTengah benar dan tidak mengubah array asli',
      cek(ctx) {
        const asli = [1, 2, 3, 4];
        const r = ctx.panggil('ambilTengah', asli);
        if (JSON.stringify(r) !== '[2,3]') return `ambilTengah([1, 2, 3, 4]) mengembalikan ${JSON.stringify(r)}, seharusnya [2,3].`;
        if (asli.length !== 4) return 'ambilTengah mengubah array aslinya. Pakai slice, bukan splice/pop/shift.';
        const r2 = ctx.panggil('ambilTengah', ['a', 'b', 'c', 'd', 'e']);
        return JSON.stringify(r2) === '["b","c","d"]' || `ambilTengah(["a","b","c","d","e"]) mengembalikan ${JSON.stringify(r2)}.`;
      },
    },
    {
      nama: 'cekKehadiran benar',
      cek(ctx) {
        const d = ['Budi', 'Sinta', 'Andi'];
        if (ctx.panggil('cekKehadiran', d, 'Sinta') !== 'Hadir') return 'cekKehadiran(daftar, "Sinta") seharusnya "Hadir".';
        return ctx.panggil('cekKehadiran', d, 'Rudi') === 'Tidak hadir' || 'cekKehadiran(daftar, "Rudi") seharusnya "Tidak hadir".';
      },
    },
    {
      nama: 'posisiDalamAntrian benar',
      cek(ctx) {
        const a = ['A', 'B', 'C'];
        for (const [n, h] of [['A', 1], ['B', 2], ['C', 3], ['Z', 0]]) {
          const r = ctx.panggil('posisiDalamAntrian', a, n);
          if (r !== h) return `posisiDalamAntrian(["A","B","C"], "${n}") mengembalikan ${r}, seharusnya ${h}.`;
        }
        return true;
      },
    },
  ],
};
