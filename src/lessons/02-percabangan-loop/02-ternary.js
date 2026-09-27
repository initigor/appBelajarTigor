export default {
  id: 'ternary',
  judul: 'Operator Ternary',
  tipe: 'js',
  xp: 15,
  materi: `
# Operator Ternary \`? :\`

Kalau \`if/else\`-mu hanya untuk memilih **satu dari dua nilai**, ada versi singkatnya:

~~~js
kondisi ? nilaiJikaTrue : nilaiJikaFalse
~~~

Ini sama dengan ternary di C, dan mirip "conditional expression" di Python:

| C / JavaScript | Python |
| --- | --- |
| \`x > 0 ? "positif" : "bukan"\` | \`"positif" if x > 0 else "bukan"\` |

~~~js
const umur = 15;

// versi if/else:
let tiket;
if (umur < 17) {
  tiket = "anak";
} else {
  tiket = "dewasa";
}

// versi ternary: satu baris, dan bisa pakai const!
const tiket2 = umur < 17 ? "anak" : "dewasa";
~~~

Ternary adalah **ekspresi** (menghasilkan nilai), sedangkan \`if\` adalah **statement**. Karena itu, ternary bisa langsung dipakai di dalam \`console.log(...)\`, di dalam penggabungan string, dan nanti **di dalam JSX React**, tempat \`if\` tidak bisa dipakai. Karena itu ternary sangat penting untuk dikuasai.

~~~js
console.log("Status: " + (umur >= 17 ? "boleh" : "belum boleh") + " membuat KTP");
~~~

⚠️ Jangan menumpuk ternary terlalu dalam (\`a ? b : c ? d : e\`). Kalau sudah lebih dari dua pilihan, \`if/else\` lebih mudah dibaca.
`,
  tugas: `
1. Buat \`const status\` bernilai \`"dewasa"\` jika \`umur\` minimal 17, selain itu \`"anak-anak"\`. **Pakai ternary.**
2. Buat \`const pesan\` bernilai \`"Bisa beli"\` jika \`saldo\` cukup untuk \`harga\` (saldo >= harga), selain itu \`"Saldo kurang"\`. **Pakai ternary.**
3. Cetak \`status\` dan \`pesan\`.
`,
  kodeAwal: `const umur = 20;
const saldo = 50000;
const harga = 35000;

// const status = ...

// const pesan = ...
`,
  solusi: `const umur = 20;
const saldo = 50000;
const harga = 35000;

const status = umur >= 17 ? "dewasa" : "anak-anak";
const pesan = saldo >= harga ? "Bisa beli" : "Saldo kurang";

console.log(status);
console.log(pesan);
`,
  petunjuk: ['Bentuk: const status = umur >= 17 ? "dewasa" : "anak-anak";'],
  tes: [
    {
      nama: 'Memakai ternary (tanpa if)',
      cek(ctx) {
        if (!ctx.pakai(/\?[^?.]*:/)) return 'Gunakan operator ternary: kondisi ? a : b';
        return !ctx.pakai(/\bif\s*\(/) || 'Di latihan ini, coba selesaikan tanpa if. Pakai ternary saja.';
      },
    },
    {
      nama: 'status benar untuk umur 20, 17, dan 12',
      async cek(ctx) {
        for (const [umur, harap] of [[20, 'dewasa'], [17, 'dewasa'], [12, 'anak-anak']]) {
          const r = await ctx.jalankanDengan({ umur });
          if (r.ambil('status') !== harap) return `Untuk umur ${umur}, status-mu ${JSON.stringify(r.ambil('status'))}, seharusnya "${harap}".`;
        }
        return true;
      },
    },
    {
      nama: 'pesan benar untuk saldo cukup dan kurang',
      async cek(ctx) {
        for (const [saldo, harap] of [[50000, 'Bisa beli'], [35000, 'Bisa beli'], [10000, 'Saldo kurang']]) {
          const r = await ctx.jalankanDengan({ saldo });
          if (r.ambil('pesan') !== harap) return `Untuk saldo ${saldo} (harga 35000), pesan-mu ${JSON.stringify(r.ambil('pesan'))}, seharusnya "${harap}".`;
        }
        return ctx.adaLog('dewasa') && ctx.adaLog('Bisa beli') ? true : 'Cetak status dan pesan dengan console.log.';
      },
    },
  ],
};
