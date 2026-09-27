export default {
  id: 'arrow-function',
  judul: 'Arrow Function',
  tipe: 'js',
  xp: 20,
  materi: `
# Arrow Function =>

JavaScript modern punya cara singkat menulis fungsi, yaitu **arrow function**. Cara ini dipakai di **mana-mana** dalam kode React, jadi wajib dikuasai.

~~~js
// function declaration
function kuadrat(x) {
  return x * x;
}

// arrow function (disimpan di variabel)
const kuadrat2 = (x) => {
  return x * x;
};

// arrow function singkat: kalau isinya hanya return satu ekspresi,
// kurawal dan kata "return" boleh dihapus
const kuadrat3 = (x) => x * x;
~~~

Ini mirip \`lambda\` di Python: \`kuadrat = lambda x: x * x\`. Bedanya, arrow function **boleh** punya banyak baris (pakai kurawal).

## Variasi penulisan

~~~js
const sapa = () => "Halo!";                  // tanpa parameter: () wajib
const dobel = x => x * 2;                    // satu parameter: kurung boleh dihapus
const tambah = (a, b) => a + b;              // dua parameter: kurung wajib
const buatObjek = (n) => ({ nama: n });      // return object: bungkus dengan ( )
~~~

⚠️ Kalau pakai kurawal \`{ }\`, kamu **wajib** menulis \`return\`:

~~~js
const salah = (x) => { x * 2 };   // mengembalikan undefined!
const benar = (x) => { return x * 2; };
~~~

## Kapan pakai yang mana?
Untuk latihan ini, keduanya sama saja. Di React nanti, komponen biasanya ditulis dengan \`function\`, sedangkan fungsi kecil (event handler, callback) memakai arrow function.
`,
  tugas: `
Buat fungsi-fungsi berikut sebagai **arrow function** yang disimpan di \`const\`:

1. \`kuadrat\` → menerima \`x\`, mengembalikan \`x * x\` (pakai bentuk singkat tanpa kurawal).
2. \`sapa\` → menerima \`nama\`, mengembalikan \`"Halo, <nama>!"\` (pakai template literal).
3. \`maksimum\` → menerima \`a\` dan \`b\`, mengembalikan yang lebih besar (pakai ternary).
4. \`celciusKeFahrenheit\` → menerima \`c\`, mengembalikan \`c * 9 / 5 + 32\`.
`,
  kodeAwal: `function kuadrat(x) {
  return x * x;
}

// ubah kuadrat menjadi arrow function, lalu buat sisanya
`,
  solusi: `const kuadrat = (x) => x * x;
const sapa = (nama) => \`Halo, \${nama}!\`;
const maksimum = (a, b) => (a > b ? a : b);
const celciusKeFahrenheit = (c) => c * 9 / 5 + 32;

console.log(kuadrat(5), sapa("Budi"), maksimum(3, 8), celciusKeFahrenheit(100));
`,
  petunjuk: [
    'const kuadrat = (x) => x * x;',
    'const maksimum = (a, b) => (a > b ? a : b);',
  ],
  tes: [
    {
      nama: 'Semua fungsi ditulis sebagai arrow function',
      cek(ctx) {
        for (const n of ['kuadrat', 'sapa', 'maksimum', 'celciusKeFahrenheit']) {
          if (!ctx.pakai(new RegExp(`const\\s+${n}\\s*=\\s*(\\([^)]*\\)|\\w+)\\s*=>`))) return `Tulis ${n} sebagai arrow function: const ${n} = (...) => ...`;
        }
        return true;
      },
    },
    {
      nama: 'kuadrat dan sapa benar',
      cek(ctx) {
        if (ctx.panggil('kuadrat', 5) !== 25) return `kuadrat(5) mengembalikan ${ctx.panggil('kuadrat', 5)}, seharusnya 25.`;
        const s = ctx.panggil('sapa', 'Budi');
        return s === 'Halo, Budi!' || `sapa("Budi") mengembalikan ${JSON.stringify(s)}, seharusnya "Halo, Budi!".`;
      },
    },
    {
      nama: 'maksimum dan celciusKeFahrenheit benar',
      cek(ctx) {
        for (const [a, b, h] of [[3, 8, 8], [10, 2, 10], [-1, -5, -1]]) {
          const r = ctx.panggil('maksimum', a, b);
          if (r !== h) return `maksimum(${a}, ${b}) mengembalikan ${r}, seharusnya ${h}.`;
        }
        for (const [c, f] of [[100, 212], [0, 32], [37, 98.6]]) {
          const r = ctx.panggil('celciusKeFahrenheit', c);
          if (typeof r !== 'number' || Math.abs(r - f) > 1e-9) return `celciusKeFahrenheit(${c}) mengembalikan ${r}, seharusnya ${f}.`;
        }
        return true;
      },
    },
  ],
};
