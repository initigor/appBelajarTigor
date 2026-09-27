export default {
  id: 'object-literal',
  judul: 'Object: dot & bracket',
  tipe: 'js',
  xp: 20,
  materi: `
# Object

Object adalah kumpulan pasangan **kunci: nilai**. Bayangkan gabungan **\`struct\` di C** dan **\`dict\` di Python**:

~~~js
const mhs = {
  nama: "Budi",
  nim: "2301234",
  ipk: 3.45,
  aktif: true,
};
~~~

| C (struct) | Python (dict) | JavaScript (object) |
| --- | --- | --- |
| \`mhs.nama\` | \`mhs["nama"]\` | \`mhs.nama\` **atau** \`mhs["nama"]\` |
| field harus dideklarasikan dulu | kunci bebas | kunci bebas |

## Dot vs bracket
~~~js
mhs.nama;          // "Budi"   ← cara yang paling sering dipakai
mhs["nama"];       // "Budi"   ← sama saja

const kunci = "ipk";
mhs[kunci];        // 3.45     ← bracket WAJIB kalau nama kunci ada di variabel
mhs.kunci;         // undefined (mencari properti bernama "kunci")
~~~

## Menambah, mengubah, menghapus
~~~js
mhs.ipk = 3.6;            // ubah
mhs.jurusan = "TI";       // tambah properti baru
delete mhs.aktif;         // hapus
mhs.hobi;                 // undefined (tidak error seperti KeyError Python)
~~~

Sama seperti array, \`const\` pada object hanya mengunci variabelnya. Isinya tetap boleh diubah.

## Kunci di object literal
Kunci tidak perlu diberi kutip kecuali mengandung karakter khusus: \`{ "nama lengkap": "Budi" }\`. Dan jangan lupa: **koma** di antara properti (koma terakhir boleh ada).
`,
  tugas: `
1. Buat object \`mahasiswa\` dengan properti \`nama\` (string), \`nim\` (string), dan \`ipk\` (\`3.2\`).
2. Ubah \`ipk\` menjadi \`3.5\`.
3. Tambahkan properti \`jurusan\` bernilai \`"Teknik Informatika"\`.
4. Buat \`const kunci = "nim";\` lalu simpan nilai properti yang namanya ada di \`kunci\` ke \`const hasilKunci\` (pakai bracket).
5. Cetak \`mahasiswa.nama\`.
`,
  kodeAwal: `const mahasiswa = {
  // isi di sini
};
`,
  solusi: `const mahasiswa = {
  nama: "Budi",
  nim: "2301234",
  ipk: 3.2,
};

mahasiswa.ipk = 3.5;
mahasiswa.jurusan = "Teknik Informatika";

const kunci = "nim";
const hasilKunci = mahasiswa[kunci];

console.log(mahasiswa.nama);
console.log(mahasiswa);
`,
  petunjuk: [
    'Format: const mahasiswa = { nama: "Budi", nim: "2301234", ipk: 3.2 };',
    'Tambah properti: mahasiswa.jurusan = "Teknik Informatika";',
    'Bracket: mahasiswa[kunci]',
  ],
  tes: [
    {
      nama: 'mahasiswa punya nama, nim (string), dan ipk 3.5',
      cek(ctx) {
        const m = ctx.variabel('mahasiswa');
        if (typeof m.nama !== 'string' || !m.nama) return 'mahasiswa.nama harus string yang tidak kosong.';
        if (typeof m.nim !== 'string') return `mahasiswa.nim harus string (pakai kutip), sekarang ${typeof m.nim}.`;
        if (!ctx.pakai(/ipk\s*:\s*3\.2/)) return 'Isi awal ipk di object literal harus 3.2.';
        return m.ipk === 3.5 || `mahasiswa.ipk = ${m.ipk}, seharusnya diubah menjadi 3.5.`;
      },
    },
    {
      nama: 'jurusan ditambahkan',
      cek(ctx) {
        const m = ctx.variabel('mahasiswa');
        return m.jurusan === 'Teknik Informatika' || `mahasiswa.jurusan = ${JSON.stringify(m.jurusan)}, seharusnya "Teknik Informatika".`;
      },
    },
    {
      nama: 'hasilKunci diambil dengan bracket',
      cek(ctx) {
        if (!ctx.pakai(/mahasiswa\s*\[\s*kunci\s*\]/)) return 'Gunakan mahasiswa[kunci].';
        return ctx.variabel('hasilKunci') === ctx.ambil('mahasiswa').nim || 'hasilKunci seharusnya sama dengan mahasiswa.nim.';
      },
    },
    {
      nama: 'Mencetak nama',
      cek: (ctx) => ctx.harusLog(String(ctx.ambil('mahasiswa')?.nama)),
    },
  ],
};
