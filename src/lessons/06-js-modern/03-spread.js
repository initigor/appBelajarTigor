export default {
  id: 'spread',
  judul: 'Spread Operator ...',
  tipe: 'js',
  xp: 25,
  materi: `
# Spread \`...\`

Spread "menumpahkan" isi array atau object ke tempat lain.

## Spread array
~~~js
const a = [1, 2];
const b = [3, 4];

const gabung = [...a, ...b];        // [1, 2, 3, 4]   (Python: a + b)
const salinan = [...a];             // salinan baru   (Python: a.copy())
const tambah = [0, ...a, 99];       // [0, 1, 2, 99]
Math.max(...b);                     // 4              (Python: max(*b))
~~~

## Spread object
~~~js
const user = { nama: "Budi", umur: 20 };

const salinan = { ...user };                    // salinan baru
const update = { ...user, umur: 21 };           // { nama: "Budi", umur: 21 }
const tambah = { ...user, kota: "Bandung" };    // tambah properti baru
~~~

Python: \`{**user, "umur": 21}\`.

**Urutan penting**: properti yang ditulis **belakangan menimpa** yang sebelumnya:

~~~js
{ ...user, umur: 21 }    // umur = 21
{ umur: 21, ...user }    // umur = 20 (ditimpa lagi oleh user)
~~~

## 🔥 Inti dari update state di React
React ingin **object/array baru**, bukan yang lama diubah. Spread adalah alat utamanya:

~~~js
setUser({ ...user, umur: user.umur + 1 });        // update object
setDaftar([...daftar, itemBaru]);                 // tambah ke array
~~~

⚠️ Spread hanya menyalin **satu tingkat** (shallow). Object di dalam object tetap berbagi referensi. Untuk mengubah properti bersarang, spread juga tingkat dalamnya:

~~~js
const baru = { ...user, alamat: { ...user.alamat, kota: "Jakarta" } };
~~~
`,
  tugas: `
Buat fungsi-fungsi berikut memakai **spread**, dan jangan ubah input:

1. \`gabungArray(a, b)\` → array gabungan a lalu b.
2. \`tambahDiAwal(arr, item)\` → array baru dengan \`item\` di depan.
3. \`perbaruiUser(user, perubahan)\` → object baru: isi \`user\` ditimpa isi \`perubahan\`.
4. \`pindahKota(user, kotaBaru)\` → object baru dengan \`user.alamat.kota\` diganti; \`user.alamat\` asli tidak boleh berubah.
`,
  kodeAwal: `function gabungArray(a, b) {

}

function tambahDiAwal(arr, item) {

}

function perbaruiUser(user, perubahan) {

}

function pindahKota(user, kotaBaru) {
  user.alamat.kota = kotaBaru;
  return user;
}
`,
  solusi: `function gabungArray(a, b) {
  return [...a, ...b];
}

function tambahDiAwal(arr, item) {
  return [item, ...arr];
}

function perbaruiUser(user, perubahan) {
  return { ...user, ...perubahan };
}

function pindahKota(user, kotaBaru) {
  return { ...user, alamat: { ...user.alamat, kota: kotaBaru } };
}

const budi = { nama: "Budi", alamat: { kota: "Bandung", jalan: "Dago" } };
console.log(pindahKota(budi, "Jakarta"), budi);
`,
  petunjuk: [
    'gabungArray: return [...a, ...b];',
    'perbaruiUser: return { ...user, ...perubahan };',
    'pindahKota: return { ...user, alamat: { ...user.alamat, kota: kotaBaru } };',
  ],
  tes: [
    {
      nama: 'Memakai spread',
      cek: (ctx) => (ctx.kodeBersih.match(/\.\.\./g) ?? []).length >= 4 || 'Gunakan spread (...) di keempat fungsi.',
    },
    {
      nama: 'gabungArray dan tambahDiAwal benar',
      cek(ctx) {
        const a = [1, 2];
        const g = ctx.panggil('gabungArray', a, [3]);
        if (JSON.stringify(g) !== '[1,2,3]') return `gabungArray([1,2], [3]) mengembalikan ${JSON.stringify(g)}.`;
        const t = ctx.panggil('tambahDiAwal', a, 0);
        if (JSON.stringify(t) !== '[0,1,2]') return `tambahDiAwal([1,2], 0) mengembalikan ${JSON.stringify(t)}.`;
        return a.length === 2 || 'Array input berubah. Jangan pakai push/unshift ke input.';
      },
    },
    {
      nama: 'perbaruiUser menimpa properti tanpa mengubah aslinya',
      cek(ctx) {
        const u = { nama: 'Budi', umur: 20 };
        const r = ctx.panggil('perbaruiUser', u, { umur: 21, kota: 'Bogor' });
        if (r === u) return 'perbaruiUser harus mengembalikan object BARU.';
        if (JSON.stringify(r) !== '{"nama":"Budi","umur":21,"kota":"Bogor"}') return `Hasil: ${JSON.stringify(r)}, seharusnya {"nama":"Budi","umur":21,"kota":"Bogor"}.`;
        return u.umur === 20 || 'Object user asli berubah.';
      },
    },
    {
      nama: 'pindahKota tidak mengubah alamat asli',
      cek(ctx) {
        const u = { nama: 'Budi', alamat: { kota: 'Bandung', jalan: 'Dago' } };
        const r = ctx.panggil('pindahKota', u, 'Jakarta');
        if (r?.alamat?.kota !== 'Jakarta') return 'Kota di hasil seharusnya "Jakarta".';
        if (r.alamat.jalan !== 'Dago') return 'Properti lain di alamat (jalan) hilang. Spread juga user.alamat.';
        if (u.alamat.kota !== 'Bandung') return 'user.alamat asli ikut berubah. Buat object alamat baru dengan { ...user.alamat, kota: kotaBaru }.';
        return r !== u || 'Kembalikan object baru.';
      },
    },
  ],
};
