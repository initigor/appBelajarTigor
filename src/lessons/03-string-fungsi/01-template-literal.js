export default {
  id: 'template-literal',
  judul: 'Template Literal',
  tipe: 'js',
  xp: 15,
  materi: `
# Template Literal: f-string versi JavaScript

Menggabung string dengan \`+\` cepat membuat mata lelah:

~~~js
console.log("Halo, " + nama + "! Umurmu " + umur + " tahun.");
~~~

JavaScript punya **template literal**: string yang ditulis dengan **backtick** (\\\`, tombol di kiri angka 1), lalu variabel disisipkan dengan \`\${...}\`:

~~~js
const nama = "Budi";
const umur = 20;
console.log(\`Halo, \${nama}! Umurmu \${umur} tahun.\`);
~~~

| Python | C | JavaScript |
| --- | --- | --- |
| \`f"Halo, {nama}"\` | \`printf("Halo, %s", nama)\` | \`\` \`Halo, \${nama}\` \`\` |

## Isi \`\${ }\` boleh ekspresi apa pun

~~~js
console.log(\`Tahun depan umurmu \${umur + 1}\`);
console.log(\`Status: \${umur >= 17 ? "dewasa" : "anak"}\`);
~~~

## Bisa beberapa baris
String biasa \`"..."\` tidak boleh ganti baris. Template literal **boleh**, mirip triple-quote \`"""\` di Python:

~~~js
const kartu = \`Nama : \${nama}
Umur : \${umur}\`;
~~~
`,
  tugas: `
Diberikan \`nama\`, \`umur\`, dan \`kota\`. Pakai **template literal** untuk membuat:

1. \`perkenalan\` = \`Halo, nama saya Budi, umur 20 tahun.\`
2. \`asal\` = \`Aku tinggal di Bandung. Tahun depan aku berumur 21.\` (angka 21 harus **dihitung** dari \`umur + 1\` di dalam \`\${}\`)

Cetak keduanya. Tes akan mencoba nama, umur, dan kota yang berbeda.
`,
  kodeAwal: `const nama = "Budi";
const umur = 20;
const kota = "Bandung";

const perkenalan = "Halo, nama saya " + nama + ", umur " + umur + " tahun.";
// ubah perkenalan menjadi template literal, lalu buat asal
`,
  solusi: `const nama = "Budi";
const umur = 20;
const kota = "Bandung";

const perkenalan = \`Halo, nama saya \${nama}, umur \${umur} tahun.\`;
const asal = \`Aku tinggal di \${kota}. Tahun depan aku berumur \${umur + 1}.\`;

console.log(perkenalan);
console.log(asal);
`,
  petunjuk: [
    'Template literal diawali dan diakhiri backtick (`), bukan tanda kutip.',
    'Sisipkan variabel dengan ${nama}. Untuk umur tahun depan: ${umur + 1}',
  ],
  tes: [
    {
      nama: 'Memakai template literal dengan ${...}',
      cek: (ctx) => (ctx.pakai('`') && ctx.pakai('${')) || 'Gunakan backtick (`) dan ${...}.',
    },
    {
      nama: 'perkenalan benar',
      async cek(ctx) {
        if (ctx.pakai(/perkenalan\s*=\s*"/)) return 'perkenalan masih memakai tanda kutip dan +. Ubah menjadi template literal.';
        const r = await ctx.jalankanDengan({ nama: 'Sinta', umur: 19 });
        const harap = 'Halo, nama saya Sinta, umur 19 tahun.';
        return r.ambil('perkenalan') === harap || `Dengan nama "Sinta" dan umur 19, perkenalan = ${JSON.stringify(r.ambil('perkenalan'))}, seharusnya "${harap}".`;
      },
    },
    {
      nama: 'asal benar dan umur tahun depan dihitung',
      async cek(ctx) {
        const r = await ctx.jalankanDengan({ umur: 30, kota: 'Medan' });
        const harap = 'Aku tinggal di Medan. Tahun depan aku berumur 31.';
        if (r.ambil('asal') === 'Aku tinggal di Medan. Tahun depan aku berumur 301.') return 'Umurnya jadi "301"? Tulis ${umur + 1} di dalam satu ${ }, bukan ${umur}1.';
        return r.ambil('asal') === harap || `Dengan umur 30 dan kota "Medan", asal = ${JSON.stringify(r.ambil('asal'))}, seharusnya "${harap}".`;
      },
    },
  ],
};
