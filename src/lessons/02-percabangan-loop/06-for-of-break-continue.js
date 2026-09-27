export default {
  id: 'for-of-break-continue',
  judul: 'for...of, break, continue',
  tipe: 'js',
  xp: 20,
  materi: `
# for...of

Sekilas tentang **array** (dibahas lengkap di Chapter 4): array ditulis dengan kurung siku, sama seperti list di Python.

~~~js
const buah = ["apel", "jeruk", "mangga"];
console.log(buah[0]);      // "apel"
console.log(buah.length);  // 3   (Python: len(buah))
~~~

Untuk mengambil setiap elemen tanpa indeks, pakai **\`for...of\`**:

~~~js
for (const b of buah) {
  console.log(b);
}
~~~

| Python | JavaScript |
| --- | --- |
| \`for b in buah:\` | \`for (const b of buah) { }\` |

Boleh pakai \`const\` karena setiap putaran membuat variabel \`b\` yang baru.

⚠️ **Jebakan:** ada juga \`for...in\`, tapi di array ia menghasilkan **indeks** (sebagai string!), bukan isinya. Untuk array, selalu pakai \`for...of\`.

# break dan continue
Sama dengan C dan Python:
- \`break\` → keluar dari loop sekarang juga.
- \`continue\` → lewati sisa badan loop, lanjut ke putaran berikutnya.

~~~js
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 2) continue;  // lewati 2
  if (n === 4) break;     // berhenti di 4
  console.log(n);         // 1, 3
}
~~~
`,
  tugas: `
Diberikan array \`nilai\`.

1. Pakai **for...of** untuk menghitung \`total\` semua nilai.
2. Pakai for...of dan **continue** untuk mencetak hanya nilai yang **>= 60** (sesuai urutan).
3. Pakai for...of dan **break** untuk mencari nilai pertama yang **< 50** dan simpan di \`pertamaGagal\`. Jika tidak ada, biarkan \`null\`.
`,
  kodeAwal: `const nilai = [80, 45, 90, 30, 75];
let total = 0;
let pertamaGagal = null;

// 1. total

// 2. cetak nilai >= 60 (pakai continue)

// 3. pertamaGagal (pakai break)
`,
  solusi: `const nilai = [80, 45, 90, 30, 75];
let total = 0;
let pertamaGagal = null;

for (const n of nilai) {
  total += n;
}

for (const n of nilai) {
  if (n < 60) continue;
  console.log(n);
}

for (const n of nilai) {
  if (n < 50) {
    pertamaGagal = n;
    break;
  }
}

console.log("Total:", total, "| Pertama gagal:", pertamaGagal);
`,
  petunjuk: [
    'for (const n of nilai) { total += n; }',
    'Di loop kedua: if (n < 60) continue; lalu console.log(n);',
    'Di loop ketiga: if (n < 50) { pertamaGagal = n; break; }',
  ],
  tes: [
    {
      nama: 'Memakai for...of, continue, dan break',
      cek(ctx) {
        if (!ctx.pakai(/for\s*\(\s*(const|let)\s+\w+\s+of\s+/)) return 'Gunakan for (const n of nilai).';
        if (ctx.pakai(/for\s*\(\s*(const|let)\s+\w+\s+in\s+/)) return 'Jangan pakai for...in untuk array. Pakai for...of.';
        if (!ctx.pakai(/\bcontinue\b/)) return 'Gunakan continue untuk melewati nilai < 60.';
        if (!ctx.pakai(/\bbreak\b/)) return 'Gunakan break setelah menemukan nilai < 50.';
        return true;
      },
    },
    {
      nama: 'total benar',
      async cek(ctx) {
        for (const nilai of [[80, 45, 90, 30, 75], [10, 20]]) {
          const r = await ctx.jalankanDengan({ nilai });
          const harap = nilai.reduce((a, b) => a + b, 0);
          if (r.ambil('total') !== harap) return `Untuk nilai ${JSON.stringify(nilai)}, total = ${r.ambil('total')}, seharusnya ${harap}.`;
        }
        return true;
      },
    },
    {
      nama: 'Hanya mencetak nilai >= 60',
      async cek(ctx) {
        const nilai = [60, 59, 100, 12, 61];
        const r = await ctx.jalankanDengan({ nilai });
        const angka = r.logs.filter((l) => /^\d+$/.test(l));
        return angka.join() === '60,100,61' || `Untuk nilai ${JSON.stringify(nilai)}, seharusnya tercetak 60, 100, 61. Yang tercetak: ${angka.join(', ') || '(tidak ada)'}.`;
      },
    },
    {
      nama: 'pertamaGagal benar (atau null jika tidak ada)',
      async cek(ctx) {
        for (const [nilai, harap] of [[[80, 45, 90, 30], 45], [[70, 49, 10], 49], [[90, 80], null]]) {
          const r = await ctx.jalankanDengan({ nilai });
          if (r.ambil('pertamaGagal') !== harap) return `Untuk nilai ${JSON.stringify(nilai)}, pertamaGagal = ${r.ambil('pertamaGagal')}, seharusnya ${harap}.`;
        }
        return true;
      },
    },
  ],
};
