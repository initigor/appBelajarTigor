export default {
  id: 'json',
  judul: 'JSON',
  tipe: 'js',
  xp: 20,
  materi: `
# JSON

**JSON** (JavaScript Object Notation) adalah format teks untuk bertukar data, misalnya antara server dan browser. Bentuknya mirip sekali dengan object JS:

~~~json
{
  "nama": "Budi",
  "umur": 20,
  "hobi": ["coding", "musik"],
  "menikah": false,
  "alamat": null
}
~~~

Aturan JSON lebih ketat daripada object JS:
- kunci **wajib** memakai kutip dua \`"..."\`
- string juga wajib kutip dua (tidak boleh kutip satu)
- tidak boleh ada koma di elemen terakhir
- tidak boleh berisi fungsi atau \`undefined\`

## Konversi

| Tujuan | JavaScript | Python |
| --- | --- | --- |
| object → teks JSON | \`JSON.stringify(obj)\` | \`json.dumps(obj)\` |
| teks JSON → object | \`JSON.parse(teks)\` | \`json.loads(teks)\` |

~~~js
const obj = { nama: "Budi", umur: 20 };
const teks = JSON.stringify(obj);          // '{"nama":"Budi","umur":20}'
JSON.stringify(obj, null, 2);              // versi rapi dengan indentasi 2 spasi

const kembali = JSON.parse(teks);
kembali.nama;                              // "Budi"
~~~

## Kegunaan sehari-hari
- Menerima data dari API: \`fetch(...)\` lalu \`.json()\` (Chapter 8).
- Menyimpan ke \`localStorage\`, yang hanya bisa menyimpan string. Website ini juga menyimpan progress-mu dengan \`JSON.stringify\`!
- **Salinan dalam (deep copy)**: \`JSON.parse(JSON.stringify(obj))\` membuat salinan sampai ke object di dalamnya. Cara modernnya \`structuredClone(obj)\`.
`,
  tugas: `
1. \`teksProfil\` berisi JSON (sudah disediakan). Ubah menjadi object dan simpan di \`profil\`.
2. Simpan hobi pertama dari \`profil\` ke \`hobiPertama\`.
3. Buat fungsi \`keJsonRapi(obj)\` → teks JSON dengan indentasi **2 spasi**.
4. Buat fungsi \`salinDalam(obj)\` → salinan dalam; mengubah salinan tidak boleh mengubah aslinya, termasuk array/object di dalamnya.
`,
  kodeAwal: `const teksProfil = '{"nama":"Sinta","umur":21,"hobi":["membaca","coding","badminton"]}';

const profil = teksProfil;
`,
  solusi: `const teksProfil = '{"nama":"Sinta","umur":21,"hobi":["membaca","coding","badminton"]}';

const profil = JSON.parse(teksProfil);
const hobiPertama = profil.hobi[0];

function keJsonRapi(obj) {
  return JSON.stringify(obj, null, 2);
}

function salinDalam(obj) {
  return JSON.parse(JSON.stringify(obj));
}

console.log(profil.nama, hobiPertama);
console.log(keJsonRapi({ a: 1 }));
`,
  petunjuk: [
    'const profil = JSON.parse(teksProfil);',
    'keJsonRapi: JSON.stringify(obj, null, 2)',
    'salinDalam: JSON.parse(JSON.stringify(obj))',
  ],
  tes: [
    {
      nama: 'profil adalah object hasil JSON.parse',
      cek(ctx) {
        const p = ctx.variabel('profil');
        if (typeof p === 'string') return 'profil masih berupa string. Ubah dengan JSON.parse(teksProfil).';
        return p.nama === 'Sinta' || 'profil.nama seharusnya "Sinta".';
      },
    },
    {
      nama: 'hobiPertama = "membaca"',
      cek: (ctx) => ctx.variabel('hobiPertama') === 'membaca' || `hobiPertama = ${JSON.stringify(ctx.ambil('hobiPertama'))}, seharusnya "membaca".`,
    },
    {
      nama: 'keJsonRapi memakai indentasi 2 spasi',
      cek(ctx) {
        const r = ctx.panggil('keJsonRapi', { a: 1, b: [2] });
        const h = JSON.stringify({ a: 1, b: [2] }, null, 2);
        return r === h || `keJsonRapi({a: 1, b: [2]}) menghasilkan:\n${r}\nseharusnya:\n${h}`;
      },
    },
    {
      nama: 'salinDalam membuat salinan yang terpisah',
      cek(ctx) {
        const asli = { nama: 'A', nilai: [1, 2], alamat: { kota: 'Bandung' } };
        const s = ctx.panggil('salinDalam', asli);
        if (s === asli) return 'salinDalam mengembalikan object yang sama. Buat salinan baru.';
        s.nilai.push(3);
        s.alamat.kota = 'Jakarta';
        if (asli.nilai.length !== 2 || asli.alamat.kota !== 'Bandung') return 'Mengubah isi salinan ikut mengubah aslinya. Salinanmu masih dangkal (shallow).';
        return true;
      },
    },
  ],
};
