export default {
  id: 'destructuring-array',
  judul: 'Destructuring Array',
  tipe: 'js',
  xp: 20,
  materi: `
# Destructuring Array

Untuk array, destructuring berdasarkan **posisi**, persis seperti unpacking tuple di Python:

| Python | JavaScript |
| --- | --- |
| \`x, y = [3, 4]\` | \`const [x, y] = [3, 4];\` |
| \`a, b = b, a\` | \`[a, b] = [b, a];\` |
| \`pertama, *sisa = arr\` | \`const [pertama, ...sisa] = arr;\` |

~~~js
const warna = ["merah", "hijau", "biru"];
const [w1, w2] = warna;          // w1 = "merah", w2 = "hijau"
const [, , ketiga] = warna;      // lewati dengan koma kosong → "biru"
const [a, b, c, d = "hitam"] = warna;   // d memakai default
~~~

## Menukar nilai tanpa variabel sementara
Di C kamu butuh \`temp\`. Di JS:
~~~js
let x = 1, y = 2;
[x, y] = [y, x];   // x = 2, y = 1
~~~

## Fungsi yang mengembalikan beberapa nilai
Seperti mengembalikan tuple di Python:
~~~js
function bagiDanSisa(a, b) {
  return [Math.floor(a / b), a % b];
}
const [hasil, sisa] = bagiDanSisa(17, 5);  // 3, 2
~~~

## 🔥 Kamu akan melihat ini di React
~~~jsx
const [jumlah, setJumlah] = useState(0);
~~~
\`useState\` mengembalikan array berisi 2 elemen, lalu kita langsung destructure. Sekarang kamu sudah paham sintaksnya!
`,
  tugas: `
1. Dari \`koordinat = [106.8, -6.2]\`, destructure menjadi \`bujur\` dan \`lintang\`.
2. Dari \`podium\`, ambil \`juara1\` dan array \`sisanya\` (semua selain juara 1) memakai \`...\`.
3. Tukar nilai \`kiri\` dan \`kanan\` dengan destructuring (tanpa variabel sementara).
4. Buat fungsi \`minMax(arr)\` yang mengembalikan array \`[terkecil, terbesar]\`.
`,
  kodeAwal: `const koordinat = [106.8, -6.2];
const podium = ["Sinta", "Budi", "Andi", "Citra"];
let kiri = "sepatu kanan";
let kanan = "sepatu kiri";

`,
  solusi: `const koordinat = [106.8, -6.2];
const podium = ["Sinta", "Budi", "Andi", "Citra"];
let kiri = "sepatu kanan";
let kanan = "sepatu kiri";

const [bujur, lintang] = koordinat;
const [juara1, ...sisanya] = podium;
[kiri, kanan] = [kanan, kiri];

function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}

const [kecil, besar] = minMax([4, 9, 1]);
console.log(bujur, lintang, juara1, sisanya, kiri, kanan, kecil, besar);
`,
  petunjuk: [
    'const [bujur, lintang] = koordinat;',
    'const [juara1, ...sisanya] = podium;',
    '[kiri, kanan] = [kanan, kiri];',
  ],
  tes: [
    {
      nama: 'bujur dan lintang',
      cek(ctx) {
        if (!ctx.pakai(/\[\s*bujur\s*,\s*lintang\s*\]\s*=/)) return 'Gunakan const [bujur, lintang] = koordinat;';
        return (ctx.variabel('bujur') === 106.8 && ctx.variabel('lintang') === -6.2) || 'Nilai bujur/lintang belum benar.';
      },
    },
    {
      nama: 'juara1 dan sisanya dengan rest (...)',
      cek(ctx) {
        if (!ctx.pakai(/\[\s*juara1\s*,\s*\.\.\.\s*sisanya\s*\]/)) return 'Gunakan const [juara1, ...sisanya] = podium;';
        if (ctx.variabel('juara1') !== 'Sinta') return 'juara1 seharusnya "Sinta".';
        return JSON.stringify(ctx.variabel('sisanya')) === '["Budi","Andi","Citra"]' || `sisanya = ${JSON.stringify(ctx.ambil('sisanya'))}.`;
      },
    },
    {
      nama: 'kiri dan kanan tertukar',
      cek(ctx) {
        if (!ctx.pakai(/\[\s*kiri\s*,\s*kanan\s*\]\s*=\s*\[\s*kanan\s*,\s*kiri\s*\]/)) return 'Tukar dengan [kiri, kanan] = [kanan, kiri];';
        return (ctx.ambil('kiri') === 'sepatu kiri' && ctx.ambil('kanan') === 'sepatu kanan') || 'Nilai kiri dan kanan belum tertukar.';
      },
    },
    {
      nama: 'minMax mengembalikan [terkecil, terbesar]',
      cek(ctx) {
        for (const [a, h] of [[[4, 9, 1], '[1,9]'], [[-3, 7], '[-3,7]'], [[5], '[5,5]']]) {
          const r = JSON.stringify(ctx.panggil('minMax', a));
          if (r !== h) return `minMax(${JSON.stringify(a)}) mengembalikan ${r}, seharusnya ${h}.`;
        }
        return true;
      },
    },
  ],
};
