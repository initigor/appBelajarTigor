export default {
  id: 'parameter-default',
  judul: 'Parameter Default',
  tipe: 'js',
  xp: 15,
  materi: `
# Parameter Default

Masih ingat? Di JS, argumen yang tidak diberikan akan bernilai \`undefined\`:

~~~js
function salam(nama) {
  return \`Halo, \${nama}!\`;
}
salam();   // "Halo, undefined!" 😬
~~~

Solusinya adalah **parameter default**, persis seperti di Python:

| Python | JavaScript |
| --- | --- |
| \`def salam(nama="Kawan"):\` | \`function salam(nama = "Kawan") {\` |

~~~js
function salam(nama = "Kawan") {
  return \`Halo, \${nama}!\`;
}
salam();          // "Halo, Kawan!"
salam("Budi");    // "Halo, Budi!"

// Berlaku juga untuk arrow function
const pangkat = (x, n = 2) => x ** n;
pangkat(3);       // 9
pangkat(2, 10);   // 1024
~~~

- Nilai default dipakai jika argumen **tidak diberikan** atau bernilai \`undefined\`.
- Kalau yang dikirim \`null\`, \`0\`, atau \`""\`, default **tidak** dipakai. Nilai itu dianggap "sudah diberikan".
- Parameter default sebaiknya diletakkan di **akhir** daftar parameter, sama seperti aturan di Python.
`,
  tugas: `
1. Buat fungsi \`buatSalam(nama, waktu = "pagi")\` yang mengembalikan \`"Selamat pagi, Budi!"\`.
   - \`buatSalam("Budi")\` → \`"Selamat pagi, Budi!"\`
   - \`buatSalam("Sinta", "malam")\` → \`"Selamat malam, Sinta!"\`
2. Buat arrow function \`hargaAkhir(harga, diskonPersen = 0)\` yang mengembalikan harga setelah diskon.
   - \`hargaAkhir(100000)\` → \`100000\`
   - \`hargaAkhir(100000, 20)\` → \`80000\`
`,
  kodeAwal: `function buatSalam(nama, waktu) {
  return \`Selamat \${waktu}, \${nama}!\`;
}

// buat hargaAkhir
`,
  solusi: `function buatSalam(nama, waktu = "pagi") {
  return \`Selamat \${waktu}, \${nama}!\`;
}

const hargaAkhir = (harga, diskonPersen = 0) => harga - (harga * diskonPersen) / 100;

console.log(buatSalam("Budi"));
console.log(hargaAkhir(100000, 20));
`,
  petunjuk: [
    'Cukup tambahkan = "pagi" setelah parameter waktu.',
    'hargaAkhir = harga - harga * diskonPersen / 100',
  ],
  tes: [
    {
      nama: 'buatSalam memakai default "pagi"',
      cek(ctx) {
        const a = ctx.panggil('buatSalam', 'Budi');
        if (a === 'Selamat undefined, Budi!') return 'buatSalam("Budi") menghasilkan "Selamat undefined, Budi!". Beri nilai default: waktu = "pagi".';
        if (a !== 'Selamat pagi, Budi!') return `buatSalam("Budi") mengembalikan ${JSON.stringify(a)}, seharusnya "Selamat pagi, Budi!".`;
        const b = ctx.panggil('buatSalam', 'Sinta', 'malam');
        return b === 'Selamat malam, Sinta!' || `buatSalam("Sinta", "malam") mengembalikan ${JSON.stringify(b)}.`;
      },
    },
    {
      nama: 'hargaAkhir benar dengan dan tanpa diskon',
      cek(ctx) {
        for (const [args, h] of [[[100000], 100000], [[100000, 20], 80000], [[50000, 50], 25000]]) {
          const r = ctx.panggil('hargaAkhir', ...args);
          if (Number.isNaN(r)) return `hargaAkhir(${args.join(', ')}) menghasilkan NaN. Beri default diskonPersen = 0.`;
          if (r !== h) return `hargaAkhir(${args.join(', ')}) mengembalikan ${r}, seharusnya ${h}.`;
        }
        return ctx.pakai(/diskonPersen\s*=\s*0/) || 'Gunakan parameter default diskonPersen = 0.';
      },
    },
  ],
};
