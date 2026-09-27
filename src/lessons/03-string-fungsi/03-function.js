export default {
  id: 'function-declaration',
  judul: 'Function Declaration',
  tipe: 'js',
  xp: 20,
  materi: `
# Fungsi

Fungsi di JS mirip C, tapi **tanpa tipe** seperti Python:

| C | Python | JavaScript |
| --- | --- | --- |
| \`int tambah(int a, int b) {\` | \`def tambah(a, b):\` | \`function tambah(a, b) {\` |
| \`  return a + b;\` | \`    return a + b\` | \`  return a + b;\` |
| \`}\` | | \`}\` |

~~~js
function luasLingkaran(r) {
  return Math.PI * r * r;
}

console.log(luasLingkaran(7));  // 153.93...
~~~

## Hal yang perlu diperhatikan
- Kalau tidak ada \`return\`, fungsi mengembalikan **\`undefined\`** (Python: \`None\`).
- JS **tidak mengecek jumlah argumen**. Argumen yang kurang akan bernilai \`undefined\`, dan argumen yang berlebih diabaikan.
- Karena tidak ada tipe, \`tambah("2", 3)\` tidak error, tapi hasilnya \`"23"\`. Hati-hati!

## return vs console.log
Ini kesalahan klasik pemula. \`console.log\` hanya **menampilkan** nilai, sedangkan \`return\` **mengembalikan** nilai supaya bisa dipakai lagi:

~~~js
function kaliDuaSalah(x) {
  console.log(x * 2);    // tampil, tapi...
}
const hasil = kaliDuaSalah(5) + 1;  // undefined + 1 = NaN 😢

function kaliDua(x) {
  return x * 2;
}
const hasil2 = kaliDua(5) + 1;     // 11 ✅
~~~

## Hoisting
Fungsi yang ditulis dengan \`function nama() {}\` bisa dipanggil **sebelum** baris definisinya. Di C kamu butuh prototype; di JS tidak perlu.
`,
  tugas: `
Buat tiga fungsi memakai \`function\`:

1. \`luasPersegiPanjang(p, l)\` → mengembalikan luas (p × l).
2. \`isGenap(n)\` → mengembalikan \`true\` jika \`n\` genap, \`false\` jika ganjil.
3. \`nilaiHuruf(nilai)\` → mengembalikan \`"Lulus"\` jika nilai ≥ 60, selain itu \`"Tidak lulus"\`.

Ingat: pakai **return**, bukan console.log!
`,
  kodeAwal: `function luasPersegiPanjang(p, l) {
  console.log(p * l);
}

// buat isGenap dan nilaiHuruf
`,
  solusi: `function luasPersegiPanjang(p, l) {
  return p * l;
}

function isGenap(n) {
  return n % 2 === 0;
}

function nilaiHuruf(nilai) {
  if (nilai >= 60) {
    return "Lulus";
  }
  return "Tidak lulus";
}

console.log(luasPersegiPanjang(4, 5));
console.log(isGenap(7));
console.log(nilaiHuruf(75));
`,
  petunjuk: [
    'luasPersegiPanjang harus memakai return p * l;',
    'isGenap cukup satu baris: return n % 2 === 0;',
  ],
  tes: [
    {
      nama: 'luasPersegiPanjang mengembalikan p × l',
      cek(ctx) {
        const hasil = ctx.panggil('luasPersegiPanjang', 4, 5);
        if (hasil === undefined) return 'luasPersegiPanjang(4, 5) mengembalikan undefined. Kamu pakai console.log? Ganti dengan return.';
        if (hasil !== 20) return `luasPersegiPanjang(4, 5) mengembalikan ${hasil}, seharusnya 20.`;
        return ctx.panggil('luasPersegiPanjang', 3, 7) === 21 || 'luasPersegiPanjang(3, 7) seharusnya 21.';
      },
    },
    {
      nama: 'isGenap benar',
      cek(ctx) {
        for (const [n, harap] of [[4, true], [7, false], [0, true], [13, false]]) {
          const h = ctx.panggil('isGenap', n);
          if (h !== harap) return `isGenap(${n}) mengembalikan ${JSON.stringify(h)}, seharusnya ${harap}.`;
        }
        return true;
      },
    },
    {
      nama: 'nilaiHuruf benar',
      cek(ctx) {
        for (const [n, harap] of [[75, 'Lulus'], [60, 'Lulus'], [59, 'Tidak lulus'], [10, 'Tidak lulus']]) {
          const h = ctx.panggil('nilaiHuruf', n);
          if (h !== harap) return `nilaiHuruf(${n}) mengembalikan ${JSON.stringify(h)}, seharusnya "${harap}".`;
        }
        return ctx.pakai(/function\s+nilaiHuruf/) || 'Tulis nilaiHuruf dengan kata kunci function.';
      },
    },
  ],
};
