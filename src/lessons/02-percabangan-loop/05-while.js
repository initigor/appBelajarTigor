export default {
  id: 'while-do-while',
  judul: 'while & do...while',
  tipe: 'js',
  xp: 15,
  materi: `
# while dan do...while

Keduanya **sama persis dengan C**.

## while
Dipakai ketika jumlah perulangan belum diketahui, hanya syarat berhentinya:

~~~js
let angka = 1;
while (angka < 100) {
  angka *= 2;
}
console.log(angka); // 128
~~~

Python: \`while angka < 100:\`, sama saja kecuali kurung dan kurawal.

## do...while
Badan loop dijalankan **minimal sekali**, baru kondisinya dicek. Python **tidak punya** do-while (biasanya diakali dengan \`while True\` + \`break\`).

~~~js
let hitung = 0;
do {
  console.log("Dijalankan walau kondisi awal salah");
  hitung++;
} while (hitung < 0);
~~~

⚠️ Jangan lupa titik koma setelah \`while (...)\` pada do-while, sama seperti di C.

## Awas infinite loop!
Kalau kondisi tidak pernah menjadi \`false\`, loop jalan terus. Di website ini, kode yang berjalan lebih dari 3 detik akan dihentikan otomatis. Coba saja kalau penasaran 😉
`,
  tugas: `
**Bagian 1 (while):** Saldo tabungan \`saldo\` bertambah 10% setiap tahun (\`saldo *= 1.1\`). Hitung berapa \`tahun\` yang dibutuhkan sampai saldo **mencapai atau melebihi** \`target\`. Untuk data awal, jawabannya 8.

**Bagian 2 (do...while):** Buat hitung mundur dengan **do...while**: cetak \`3\`, \`2\`, \`1\` (satu per baris), lalu cetak \`Mulai!\`.
`,
  kodeAwal: `const target = 2000000;
let saldo = 1000000;
let tahun = 0;

// Bagian 1: while


// Bagian 2: do...while
let hitung = 3;
`,
  solusi: `const target = 2000000;
let saldo = 1000000;
let tahun = 0;

while (saldo < target) {
  saldo *= 1.1;
  tahun++;
}
console.log("Butuh", tahun, "tahun");

let hitung = 3;
do {
  console.log(hitung);
  hitung--;
} while (hitung > 0);
console.log("Mulai!");
`,
  petunjuk: [
    'while (saldo < target) { saldo *= 1.1; tahun++; }',
    'do { console.log(hitung); hitung--; } while (hitung > 0);',
  ],
  tes: [
    {
      nama: 'tahun dihitung dengan while',
      async cek(ctx) {
        if (!ctx.pakai(/while\s*\(/)) return 'Gunakan loop while.';
        for (const [target, harap] of [[2000000, 8], [1500000, 5], [1000000, 0]]) {
          const r = await ctx.jalankanDengan({ target });
          if (r.ambil('tahun') !== harap) return `Untuk target ${target}, tahun = ${r.ambil('tahun')}, seharusnya ${harap}.`;
        }
        return true;
      },
    },
    {
      nama: 'Hitung mundur dengan do...while',
      cek(ctx) {
        if (!ctx.pakai(/\bdo\s*\{/)) return 'Gunakan do { ... } while (...);';
        const urut = ctx.logs.filter((l) => ['3', '2', '1', 'Mulai!'].includes(l));
        return urut.join() === '3,2,1,Mulai!' || `Console seharusnya mencetak 3, 2, 1, Mulai! berurutan. Yang tercetak: ${ctx.logs.join(', ')}.`;
      },
    },
  ],
};
