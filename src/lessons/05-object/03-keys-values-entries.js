export default {
  id: 'object-keys-values-entries',
  judul: 'Object.keys, values, entries',
  tipe: 'js',
  xp: 25,
  materi: `
# Mengulang isi object

Object **tidak bisa** langsung dipakai di \`for...of\` atau \`.map\`. Ubah dulu menjadi array:

| Python (dict) | JavaScript (object) | Hasil untuk \`{a: 1, b: 2}\` |
| --- | --- | --- |
| \`d.keys()\` | \`Object.keys(obj)\` | \`["a", "b"]\` |
| \`d.values()\` | \`Object.values(obj)\` | \`[1, 2]\` |
| \`d.items()\` | \`Object.entries(obj)\` | \`[["a", 1], ["b", 2]]\` |
| \`"a" in d\` | \`"a" in obj\` | \`true\` |
| \`len(d)\` | \`Object.keys(obj).length\` | \`2\` |

~~~js
const stok = { apel: 10, jeruk: 0, mangga: 7 };

for (const [buah, jumlah] of Object.entries(stok)) {
  console.log(\`\${buah}: \${jumlah}\`);
}
// Python: for buah, jumlah in stok.items():
~~~

\`const [buah, jumlah]\` adalah **destructuring array**: memecah \`["apel", 10]\` menjadi dua variabel sekaligus, seperti unpacking tuple di Python. Detailnya ada di Chapter 6.

Karena hasilnya array, semua method array bisa dipakai:

~~~js
const total = Object.values(stok).reduce((a, b) => a + b, 0);        // 17
const habis = Object.keys(stok).filter((k) => stok[k] === 0);        // ["jeruk"]
~~~

## Membangun object dari entries
Kebalikan dari \`Object.entries\` adalah \`Object.fromEntries\` (mirip \`dict(pasangan)\` di Python):

~~~js
Object.fromEntries([["a", 1], ["b", 2]]);   // { a: 1, b: 2 }
~~~
`,
  tugas: `
Diberikan object nilai ujian, misalnya \`{ matematika: 80, fisika: 72, kimia: 91 }\`. Buat fungsi:

1. \`daftarMapel(nilai)\` → array nama mapel: \`["matematika", "fisika", "kimia"]\`
2. \`totalNilai(nilai)\` → jumlah semua nilai: \`243\`
3. \`mapelTertinggi(nilai)\` → nama mapel dengan nilai terbesar: \`"kimia"\`
4. \`formatNilai(nilai)\` → array string: \`["matematika: 80", "fisika: 72", "kimia: 91"]\`
`,
  kodeAwal: `const nilaiUjian = { matematika: 80, fisika: 72, kimia: 91 };

function daftarMapel(nilai) {

}

function totalNilai(nilai) {

}

function mapelTertinggi(nilai) {

}

function formatNilai(nilai) {

}
`,
  solusi: `const nilaiUjian = { matematika: 80, fisika: 72, kimia: 91 };

function daftarMapel(nilai) {
  return Object.keys(nilai);
}

function totalNilai(nilai) {
  return Object.values(nilai).reduce((a, b) => a + b, 0);
}

function mapelTertinggi(nilai) {
  let terbaik = null;
  for (const [mapel, skor] of Object.entries(nilai)) {
    if (terbaik === null || skor > nilai[terbaik]) {
      terbaik = mapel;
    }
  }
  return terbaik;
}

function formatNilai(nilai) {
  return Object.entries(nilai).map(([mapel, skor]) => \`\${mapel}: \${skor}\`);
}

console.log(daftarMapel(nilaiUjian), totalNilai(nilaiUjian), mapelTertinggi(nilaiUjian), formatNilai(nilaiUjian));
`,
  petunjuk: [
    'totalNilai: Object.values(nilai).reduce(...)',
    'mapelTertinggi: loop Object.entries(nilai), simpan mapel dengan skor terbesar.',
    'formatNilai: Object.entries(nilai).map(([mapel, skor]) => `${mapel}: ${skor}`)',
  ],
  tes: [
    {
      nama: 'daftarMapel dan totalNilai benar',
      cek(ctx) {
        const n = { matematika: 80, fisika: 72, kimia: 91 };
        const d = ctx.panggil('daftarMapel', n);
        if (JSON.stringify(d) !== '["matematika","fisika","kimia"]') return `daftarMapel mengembalikan ${JSON.stringify(d)}.`;
        const t = ctx.panggil('totalNilai', { a: 10, b: 5 });
        return t === 15 || `totalNilai({a: 10, b: 5}) mengembalikan ${t}, seharusnya 15.`;
      },
    },
    {
      nama: 'mapelTertinggi benar',
      cek(ctx) {
        for (const [n, h] of [[{ matematika: 80, fisika: 72, kimia: 91 }, 'kimia'], [{ a: 99, b: 10 }, 'a'], [{ x: -5, y: -1 }, 'y']]) {
          const r = ctx.panggil('mapelTertinggi', n);
          if (r !== h) return `mapelTertinggi(${JSON.stringify(n)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
        }
        return true;
      },
    },
    {
      nama: 'formatNilai menghasilkan array string',
      cek(ctx) {
        const r = ctx.panggil('formatNilai', { biologi: 88, sejarah: 70 });
        return JSON.stringify(r) === '["biologi: 88","sejarah: 70"]' || `formatNilai({biologi: 88, sejarah: 70}) mengembalikan ${JSON.stringify(r)}.`;
      },
    },
  ],
};
