export default {
  id: 'proyek-kartu-mahasiswa',
  judul: 'Mini Proyek: Generator Kartu Mahasiswa',
  tipe: 'js',
  xp: 35,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: Generator Kartu Mahasiswa

Kamu akan membuat beberapa fungsi kecil yang saling bekerja sama. Proyek ini memakai semua isi Chapter 3: method string, template literal, function, arrow function, dan parameter default.

## Teknik baru: kapitalisasi huruf pertama
~~~js
const kata = "budi";
const kapital = kata[0].toUpperCase() + kata.slice(1).toLowerCase();  // "Budi"
~~~

## Teknik baru: menggabung kembali hasil split
\`split\` memecah string menjadi array; \`join\` menggabungkannya kembali:

~~~js
"budi santoso".split(" ");          // ["budi", "santoso"]
["Budi", "Santoso"].join(" ");      // "Budi Santoso"
~~~

Untuk mengubah **setiap** kata, sementara pakai loop \`for...of\` dan tampung hasilnya di array baru dengan \`.push()\` (seperti \`append\` di Python):

~~~js
const hasil = [];
for (const k of ["a", "b"]) {
  hasil.push(k.toUpperCase());
}
hasil.join("-");   // "A-B"
~~~

(Di Chapter 4 kamu akan belajar \`map\`, yang membuat ini jadi satu baris.)

## Mengambil karakter terakhir
\`s.slice(-3)\` mengambil 3 karakter terakhir, sama dengan \`s[-3:]\` di Python.
`,
  tugas: `
Buat tiga fungsi:

1. \`kapitalkan(kata)\` → huruf pertama kapital, sisanya kecil. \`"bUDI"\` → \`"Budi"\`.
2. \`formatNama(nama)\` → rapikan spasi di awal/akhir, lalu kapitalkan **setiap kata**.
   \`"  budi SANTOSO "\` → \`"Budi Santoso"\`. (Gunakan \`kapitalkan\`!)
3. \`buatKartu(nama, nim, jurusan = "Teknik Informatika")\` → mengembalikan string:
   \`Budi Santoso (NIM 2301234) - Teknik Informatika | username: budi234\`
   - nama dirapikan dengan \`formatNama\`
   - username = nama depan dalam huruf kecil + **3 digit terakhir** NIM (NIM berupa string)
`,
  kodeAwal: `function kapitalkan(kata) {

}

function formatNama(nama) {

}

function buatKartu(nama, nim, jurusan) {

}

console.log(buatKartu("  budi SANTOSO ", "2301234"));
`,
  solusi: `function kapitalkan(kata) {
  return kata[0].toUpperCase() + kata.slice(1).toLowerCase();
}

function formatNama(nama) {
  const hasil = [];
  for (const kata of nama.trim().split(" ")) {
    hasil.push(kapitalkan(kata));
  }
  return hasil.join(" ");
}

function buatKartu(nama, nim, jurusan = "Teknik Informatika") {
  const rapi = formatNama(nama);
  const username = rapi.split(" ")[0].toLowerCase() + nim.slice(-3);
  return \`\${rapi} (NIM \${nim}) - \${jurusan} | username: \${username}\`;
}

console.log(buatKartu("  budi SANTOSO ", "2301234"));
`,
  petunjuk: [
    'kapitalkan: kata[0].toUpperCase() + kata.slice(1).toLowerCase()',
    'formatNama: trim(), split(" "), kapitalkan tiap kata dengan for...of + push, lalu join(" ").',
    'username: rapi.split(" ")[0].toLowerCase() + nim.slice(-3)',
  ],
  tes: [
    {
      nama: 'kapitalkan benar',
      cek(ctx) {
        for (const [k, h] of [['bUDI', 'Budi'], ['sinta', 'Sinta'], ['A', 'A']]) {
          const r = ctx.panggil('kapitalkan', k);
          if (r !== h) return `kapitalkan(${JSON.stringify(k)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
        }
        return true;
      },
    },
    {
      nama: 'formatNama merapikan setiap kata',
      cek(ctx) {
        for (const [k, h] of [['  budi SANTOSO ', 'Budi Santoso'], ['sinta ayu lestari', 'Sinta Ayu Lestari'], ['ANDI', 'Andi']]) {
          const r = ctx.panggil('formatNama', k);
          if (r !== h) return `formatNama(${JSON.stringify(k)}) mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
        }
        return true;
      },
    },
    {
      nama: 'buatKartu dengan jurusan default',
      cek(ctx) {
        const r = ctx.panggil('buatKartu', '  budi SANTOSO ', '2301234');
        const h = 'Budi Santoso (NIM 2301234) - Teknik Informatika | username: budi234';
        if (typeof r === 'string' && r.includes('undefined')) return `Hasilmu: ${JSON.stringify(r)}. Ada "undefined". Sudah beri default jurusan = "Teknik Informatika"?`;
        return r === h || `buatKartu("  budi SANTOSO ", "2301234") mengembalikan:\n${JSON.stringify(r)}\nseharusnya:\n"${h}"`;
      },
    },
    {
      nama: 'buatKartu dengan jurusan lain',
      cek(ctx) {
        const r = ctx.panggil('buatKartu', 'sinta dewi', '2209876', 'Sistem Informasi');
        const h = 'Sinta Dewi (NIM 2209876) - Sistem Informasi | username: sinta876';
        return r === h || `buatKartu("sinta dewi", "2209876", "Sistem Informasi") mengembalikan:\n${JSON.stringify(r)}\nseharusnya:\n"${h}"`;
      },
    },
  ],
};
