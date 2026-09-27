export default {
  id: 'optional-chaining-nullish',
  judul: 'Optional Chaining ?. & Nullish ??',
  tipe: 'js',
  xp: 25,
  materi: `
# Optional chaining \`?.\`

Data dari luar (API, form) sering tidak lengkap. Mengakses properti dari \`undefined\` langsung error:

~~~js
const user = { nama: "Budi" };          // tidak punya alamat
user.alamat.kota;     // ❌ TypeError: Cannot read properties of undefined
user.alamat?.kota;    // ✅ undefined (berhenti dengan aman)
~~~

\`a?.b\` artinya: "kalau \`a\` null/undefined, hasilnya undefined; kalau tidak, ambil \`a.b\`". Bisa juga untuk:
~~~js
arr?.[0]           // akses indeks
obj.fungsi?.()     // panggil hanya jika fungsinya ada
~~~

Di C kamu harus menulis \`if (p != NULL && p->alamat != NULL)\`. Di JS cukup \`p?.alamat?.kota\`.

# Nullish coalescing \`??\`
Memberi nilai cadangan jika nilainya **\`null\` atau \`undefined\`**:

~~~js
const kota = user.alamat?.kota ?? "Tidak diketahui";
~~~

## ?? vs ||
\`||\` memakai nilai cadangan untuk **semua nilai falsy**, termasuk \`0\` dan \`""\`, yang mungkin justru data valid!

~~~js
const stok = 0;
stok || 10;   // 10  ❌ padahal stoknya memang 0
stok ?? 10;   // 0   ✅
~~~

| Nilai | \`x \\|\\| "cadangan"\` | \`x ?? "cadangan"\` |
| --- | --- | --- |
| \`undefined\` | cadangan | cadangan |
| \`null\` | cadangan | cadangan |
| \`0\` | cadangan | \`0\` |
| \`""\` | cadangan | \`""\` |
| \`false\` | cadangan | \`false\` |
`,
  tugas: `
1. \`ambilKota(user)\` → \`user.alamat.kota\`, atau \`"Tidak diketahui"\` jika tidak ada. Tidak boleh error walaupun \`user\` tidak punya \`alamat\`, atau bahkan \`user\` sendiri \`undefined\`.
2. \`ambilLimit(pengaturan)\` → \`pengaturan.limit\`, default \`10\` jika null/undefined. **Nilai 0 harus tetap 0.**
3. \`tagPertama(post)\` → tag pertama dari \`post.tags\` (array), atau \`"umum"\` jika tidak ada.
4. \`selesai(tugas)\` → panggil \`tugas.onSelesai()\` **hanya jika** fungsinya ada, lalu kembalikan \`true\`.
`,
  kodeAwal: `function ambilKota(user) {
  return user.alamat.kota;
}

function ambilLimit(pengaturan) {
  return pengaturan.limit || 10;
}

function tagPertama(post) {

}

function selesai(tugas) {

}
`,
  solusi: `function ambilKota(user) {
  return user?.alamat?.kota ?? "Tidak diketahui";
}

function ambilLimit(pengaturan) {
  return pengaturan?.limit ?? 10;
}

function tagPertama(post) {
  return post?.tags?.[0] ?? "umum";
}

function selesai(tugas) {
  tugas.onSelesai?.();
  return true;
}

console.log(ambilKota({ nama: "Budi" }), ambilLimit({ limit: 0 }), tagPertama({ tags: ["js"] }));
`,
  petunjuk: [
    'ambilKota: user?.alamat?.kota ?? "Tidak diketahui"',
    'Ganti || dengan ?? supaya 0 tidak dianggap kosong.',
    'Akses indeks opsional: post?.tags?.[0]. Panggil opsional: tugas.onSelesai?.()',
  ],
  tes: [
    {
      nama: 'ambilKota aman untuk data tidak lengkap',
      cek(ctx) {
        for (const [u, h, ket] of [[{ alamat: { kota: 'Solo' } }, 'Solo', '{ alamat: { kota: "Solo" } }'], [{ nama: 'Budi' }, 'Tidak diketahui', '{ nama: "Budi" }'], [undefined, 'Tidak diketahui', 'undefined']]) {
          const r = ctx.panggil('ambilKota', u);
          if (r !== h) return `ambilKota(${ket}) mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
        }
        return true;
      },
    },
    {
      nama: 'ambilLimit mempertahankan 0',
      cek(ctx) {
        if (ctx.panggil('ambilLimit', { limit: 0 }) !== 0) return 'ambilLimit({ limit: 0 }) seharusnya 0. Gunakan ?? bukan ||.';
        if (ctx.panggil('ambilLimit', { limit: 25 }) !== 25) return 'ambilLimit({ limit: 25 }) seharusnya 25.';
        return ctx.panggil('ambilLimit', {}) === 10 || 'ambilLimit({}) seharusnya 10.';
      },
    },
    {
      nama: 'tagPertama',
      cek(ctx) {
        if (ctx.panggil('tagPertama', { tags: ['react', 'js'] }) !== 'react') return 'tagPertama({ tags: ["react", "js"] }) seharusnya "react".';
        if (ctx.panggil('tagPertama', { tags: [] }) !== 'umum') return 'tagPertama({ tags: [] }) seharusnya "umum".';
        return ctx.panggil('tagPertama', {}) === 'umum' || 'tagPertama({}) seharusnya "umum".';
      },
    },
    {
      nama: 'selesai memanggil callback hanya jika ada',
      cek(ctx) {
        let dipanggil = 0;
        if (ctx.panggil('selesai', { onSelesai: () => dipanggil++ }) !== true) return 'selesai harus mengembalikan true.';
        if (dipanggil !== 1) return 'onSelesai belum dipanggil.';
        return ctx.panggil('selesai', {}) === true || 'selesai({}) harus tetap mengembalikan true tanpa error.';
      },
    },
  ],
};
