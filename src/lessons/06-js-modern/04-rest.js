export default {
  id: 'rest-parameter',
  judul: 'Rest Parameter & Rest Object',
  tipe: 'js',
  xp: 20,
  materi: `
# Rest \`...\`

Tanda \`...\` yang sama punya dua peran:
- **Spread** → membongkar (di sisi *kanan* / saat memanggil)
- **Rest** → mengumpulkan (di sisi *kiri* / di parameter)

## Rest parameter
Mengumpulkan argumen berapa pun jumlahnya ke dalam satu array. Mirip \`*args\` di Python, atau \`...\` (variadic) di C tapi **jauh lebih mudah**:

~~~js
function jumlah(...angka) {
  return angka.reduce((a, b) => a + b, 0);
}
jumlah(1, 2);          // 3
jumlah(1, 2, 3, 4);    // 10
jumlah();              // 0
~~~

Boleh ada parameter biasa di depannya, tapi rest harus **paling akhir**:
~~~js
function log(level, ...pesan) {
  console.log(\`[\${level}]\`, pesan.join(" "));
}
log("INFO", "server", "jalan");   // [INFO] server jalan
~~~

## Rest dalam destructuring object
Ambil beberapa properti, lalu kumpulkan **sisanya**:

~~~js
const user = { id: 7, nama: "Budi", password: "rahasia", email: "b@x.id" };
const { password, ...userAman } = user;
// userAman = { id: 7, nama: "Budi", email: "b@x.id" }
~~~

Pola ini sering dipakai untuk "membuang" properti tertentu tanpa mengubah object asli, dan di React untuk meneruskan props lainnya: \`function Tombol({ label, ...sisa })\`.
`,
  tugas: `
1. \`jumlahSemua(...angka)\` → total semua argumen. \`jumlahSemua()\` → 0.
2. \`rataRata(...angka)\` → rata-rata semua argumen (tanpa argumen → 0).
3. \`sapaSemua(salam, ...nama)\` → array sapaan. \`sapaSemua("Hai", "Budi", "Sinta")\` → \`["Hai, Budi!", "Hai, Sinta!"]\`
4. \`tanpaPassword(user)\` → object baru tanpa properti \`password\` (pakai rest dalam destructuring).
`,
  kodeAwal: `function jumlahSemua() {

}

function rataRata() {

}

function sapaSemua() {

}

function tanpaPassword(user) {

}
`,
  solusi: `function jumlahSemua(...angka) {
  return angka.reduce((a, b) => a + b, 0);
}

function rataRata(...angka) {
  if (angka.length === 0) return 0;
  return jumlahSemua(...angka) / angka.length;
}

function sapaSemua(salam, ...nama) {
  return nama.map((n) => \`\${salam}, \${n}!\`);
}

function tanpaPassword(user) {
  const { password, ...sisa } = user;
  return sisa;
}

console.log(jumlahSemua(1, 2, 3), rataRata(2, 4), sapaSemua("Hai", "Budi", "Sinta"));
console.log(tanpaPassword({ nama: "Budi", password: "123" }));
`,
  petunjuk: [
    'function jumlahSemua(...angka) { return angka.reduce((a, b) => a + b, 0); }',
    'rataRata: cek dulu angka.length === 0.',
    'tanpaPassword: const { password, ...sisa } = user; return sisa;',
  ],
  tes: [
    {
      nama: 'jumlahSemua dan rataRata dengan rest parameter',
      cek(ctx) {
        if (ctx.panggil('jumlahSemua', 1, 2, 3, 4) !== 10) return `jumlahSemua(1, 2, 3, 4) mengembalikan ${ctx.panggil('jumlahSemua', 1, 2, 3, 4)}, seharusnya 10.`;
        if (ctx.panggil('jumlahSemua') !== 0) return 'jumlahSemua() seharusnya 0.';
        if (ctx.panggil('rataRata', 2, 4, 9) !== 5) return `rataRata(2, 4, 9) mengembalikan ${ctx.panggil('rataRata', 2, 4, 9)}, seharusnya 5.`;
        return ctx.panggil('rataRata') === 0 || `rataRata() mengembalikan ${ctx.panggil('rataRata')}, seharusnya 0 (bukan NaN).`;
      },
    },
    {
      nama: 'sapaSemua',
      cek(ctx) {
        const r = ctx.panggil('sapaSemua', 'Hai', 'Budi', 'Sinta');
        if (JSON.stringify(r) !== '["Hai, Budi!","Hai, Sinta!"]') return `sapaSemua("Hai", "Budi", "Sinta") mengembalikan ${JSON.stringify(r)}.`;
        return JSON.stringify(ctx.panggil('sapaSemua', 'Halo')) === '[]' || 'sapaSemua("Halo") tanpa nama seharusnya [].';
      },
    },
    {
      nama: 'tanpaPassword memakai rest object',
      cek(ctx) {
        if (!ctx.pakai(/\{\s*password\s*,\s*\.\.\.\s*\w+\s*\}/)) return 'Gunakan const { password, ...sisa } = user;';
        const u = { id: 1, nama: 'Budi', password: 'x' };
        const r = ctx.panggil('tanpaPassword', u);
        if (JSON.stringify(r) !== '{"id":1,"nama":"Budi"}') return `Hasil: ${JSON.stringify(r)}, seharusnya {"id":1,"nama":"Budi"}.`;
        return u.password === 'x' || 'Object asli jangan diubah (jangan pakai delete).';
      },
    },
  ],
};
