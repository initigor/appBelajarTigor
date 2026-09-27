export default {
  id: 'proyek-statistik-nilai',
  judul: 'Mini Proyek: Statistik Nilai Kelas',
  tipe: 'js',
  xp: 40,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: Statistik Nilai Kelas

Dosenmu minta dibuatkan program kecil untuk merangkum nilai ujian satu kelas. Gunakan method array yang sudah kamu pelajari: \`map\`, \`filter\`, \`reduce\`, \`sort\`, dan \`slice\`.

## Membulatkan desimal
Rata-rata sering punya banyak angka di belakang koma. Untuk membulatkan ke 1 desimal:

~~~js
Math.round(72.4567 * 10) / 10;   // 72.5
(72.4567).toFixed(1);            // "72.5"  ← hasilnya STRING
~~~

## Nilai minimum & maksimum
~~~js
Math.max(3, 9, 2);   // 9
// untuk array, "buka" isinya dengan spread (...), dibahas di Chapter 6
Math.max(...[3, 9, 2]);   // 9
~~~
Atau pakai \`reduce\` seperti di pelajaran sebelumnya.
`,
  tugas: `
Buat fungsi-fungsi berikut. Semua menerima array angka \`nilai\` (dijamin tidak kosong):

1. \`rataRata(nilai)\` → rata-rata, **dibulatkan 1 desimal** (number, bukan string).
2. \`jumlahLulus(nilai, batas = 60)\` → berapa nilai yang **≥ batas**.
3. \`tambahBonus(nilai, bonus)\` → array baru, setiap nilai ditambah \`bonus\`, **maksimal 100**.
4. \`laporan(nilai)\` → string:
   \`Rata-rata: 68.8 | Tertinggi: 95 | Terendah: 40 | Lulus: 3/5\`
   (untuk \`[70, 95, 40, 84, 55]\`)
`,
  kodeAwal: `function rataRata(nilai) {

}

function jumlahLulus(nilai, batas) {

}

function tambahBonus(nilai, bonus) {

}

function laporan(nilai) {

}

console.log(laporan([70, 95, 40, 84, 55]));
`,
  solusi: `function rataRata(nilai) {
  const total = nilai.reduce((acc, n) => acc + n, 0);
  return Math.round((total / nilai.length) * 10) / 10;
}

function jumlahLulus(nilai, batas = 60) {
  return nilai.filter((n) => n >= batas).length;
}

function tambahBonus(nilai, bonus) {
  return nilai.map((n) => Math.min(n + bonus, 100));
}

function laporan(nilai) {
  const tertinggi = Math.max(...nilai);
  const terendah = Math.min(...nilai);
  return \`Rata-rata: \${rataRata(nilai)} | Tertinggi: \${tertinggi} | Terendah: \${terendah} | Lulus: \${jumlahLulus(nilai)}/\${nilai.length}\`;
}

console.log(laporan([70, 95, 40, 84, 55]));
`,
  petunjuk: [
    'rataRata: jumlahkan dengan reduce, bagi nilai.length, lalu Math.round(x * 10) / 10.',
    'jumlahLulus: filter lalu ambil .length.',
    'tambahBonus: map dengan Math.min(n + bonus, 100).',
    'laporan: pakai Math.max(...nilai), Math.min(...nilai), dan fungsi-fungsi sebelumnya.',
  ],
  tes: [
    {
      nama: 'rataRata dibulatkan 1 desimal',
      cek(ctx) {
        for (const [a, h] of [[[70, 95, 40, 84, 55], 68.8], [[80, 90], 85], [[1, 2, 2], 1.7]]) {
          const r = ctx.panggil('rataRata', a);
          if (typeof r === 'string') return `rataRata mengembalikan string ${JSON.stringify(r)}. Kembalikan number (toFixed menghasilkan string).`;
          if (r !== h) return `rataRata(${JSON.stringify(a)}) mengembalikan ${r}, seharusnya ${h}.`;
        }
        return true;
      },
    },
    {
      nama: 'jumlahLulus dengan batas default 60',
      cek(ctx) {
        const a = [70, 95, 40, 84, 55, 60];
        if (ctx.panggil('jumlahLulus', a) !== 4) return `jumlahLulus(${JSON.stringify(a)}) mengembalikan ${ctx.panggil('jumlahLulus', a)}, seharusnya 4 (nilai 60 termasuk lulus).`;
        return ctx.panggil('jumlahLulus', a, 80) === 2 || 'jumlahLulus(nilai, 80) seharusnya 2.';
      },
    },
    {
      nama: 'tambahBonus maksimal 100 dan tidak mengubah array asli',
      cek(ctx) {
        const a = [70, 95, 40];
        const r = ctx.panggil('tambahBonus', a, 10);
        if (JSON.stringify(r) !== '[80,100,50]') return `tambahBonus([70,95,40], 10) mengembalikan ${JSON.stringify(r)}, seharusnya [80,100,50].`;
        return JSON.stringify(a) === '[70,95,40]' || 'Array asli berubah. Pakai map untuk membuat array baru.';
      },
    },
    {
      nama: 'laporan berformat benar',
      cek(ctx) {
        const r = ctx.panggil('laporan', [70, 95, 40, 84, 55]);
        const h = 'Rata-rata: 68.8 | Tertinggi: 95 | Terendah: 40 | Lulus: 3/5';
        if (r !== h) return `laporan([70, 95, 40, 84, 55]) mengembalikan:\n${JSON.stringify(r)}\nseharusnya:\n"${h}"`;
        const r2 = ctx.panggil('laporan', [100, 30]);
        return r2 === 'Rata-rata: 65 | Tertinggi: 100 | Terendah: 30 | Lulus: 1/2' || `laporan([100, 30]) mengembalikan ${JSON.stringify(r2)}.`;
      },
    },
  ],
};
