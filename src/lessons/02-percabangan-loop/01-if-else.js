export default {
  id: 'if-else',
  judul: 'if, else if, else',
  tipe: 'js',
  xp: 15,
  materi: `
# if / else if / else

Kabar baik: sintaks \`if\` di JavaScript **sama persis dengan C**.

~~~js
const suhu = 31;

if (suhu > 30) {
  console.log("Panas!");
} else if (suhu > 20) {
  console.log("Sejuk");
} else {
  console.log("Dingin");
}
~~~

Bandingkan dengan Python:

~~~python
if suhu > 30:
    print("Panas!")
elif suhu > 20:        # JS: else if
    print("Sejuk")
else:
    print("Dingin")
~~~

Perbedaannya dengan Python:
- Kondisi **wajib** dalam kurung \`( )\`.
- Blok ditandai kurung kurawal \`{ }\`, bukan indentasi (tapi tetap rapikan indentasinya!).
- \`elif\` ditulis \`else if\`.

## Variabel yang diisi di dalam if
Kalau nilainya ditentukan di dalam cabang, deklarasikan dulu di luar dengan \`let\`:

~~~js
let kategori;            // belum ada nilai
if (suhu > 30) {
  kategori = "panas";
} else {
  kategori = "normal";
}
console.log(kategori);
~~~

Kalau \`let kategori\` ditulis **di dalam** blok \`{ }\`, variabel itu tidak bisa diakses dari luar blok. Ini sama dengan aturan scope blok di C.
`,
  tugas: `
Buat variabel \`grade\` berdasarkan \`nilai\`:

| Nilai | Grade |
| --- | --- |
| 85 ke atas | \`"A"\` |
| 70 – 84 | \`"B"\` |
| 55 – 69 | \`"C"\` |
| di bawah 55 | \`"D"\` |

Lalu cetak \`grade\`. Tes akan mencoba kodemu dengan beberapa nilai berbeda, jadi jangan menulis hasilnya langsung!
`,
  kodeAwal: `const nilai = 85;
let grade;

// tulis if / else if / else di sini

console.log(grade);
`,
  solusi: `const nilai = 85;
let grade;

if (nilai >= 85) {
  grade = "A";
} else if (nilai >= 70) {
  grade = "B";
} else if (nilai >= 55) {
  grade = "C";
} else {
  grade = "D";
}

console.log(grade);
`,
  petunjuk: [
    'Mulai dari syarat paling tinggi: if (nilai >= 85) { grade = "A"; }',
    'Karena urutannya dari atas, cabang kedua cukup else if (nilai >= 70).',
  ],
  tes: [
    {
      nama: 'Memakai if dan else if',
      cek: (ctx) => (ctx.pakai(/\bif\s*\(/) && ctx.pakai(/else\s+if/)) || 'Gunakan if dan else if.',
    },
    {
      nama: 'Nilai 85 → "A" dan nilai 100 → "A"',
      async cek(ctx) {
        for (const nilai of [85, 100]) {
          const r = await ctx.jalankanDengan({ nilai });
          if (r.ambil('grade') !== 'A') return `Untuk nilai ${nilai}, grade-mu ${JSON.stringify(r.ambil('grade'))}, seharusnya "A".`;
        }
        return true;
      },
    },
    {
      nama: 'Nilai 84 → "B", 70 → "B", 69 → "C", 55 → "C"',
      async cek(ctx) {
        for (const [nilai, harap] of [[84, 'B'], [70, 'B'], [69, 'C'], [55, 'C']]) {
          const r = await ctx.jalankanDengan({ nilai });
          if (r.ambil('grade') !== harap) return `Untuk nilai ${nilai}, grade-mu ${JSON.stringify(r.ambil('grade'))}, seharusnya "${harap}". Cek batasnya (>= atau >).`;
        }
        return true;
      },
    },
    {
      nama: 'Nilai 54 → "D" dan grade dicetak',
      async cek(ctx) {
        const r = await ctx.jalankanDengan({ nilai: 54 });
        if (r.ambil('grade') !== 'D') return `Untuk nilai 54, grade-mu ${JSON.stringify(r.ambil('grade'))}, seharusnya "D".`;
        return r.logs.includes('D') || 'Jangan lupa console.log(grade).';
      },
    },
  ],
};
