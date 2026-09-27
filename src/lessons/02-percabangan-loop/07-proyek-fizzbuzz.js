export default {
  id: 'proyek-fizzbuzz',
  judul: 'Mini Proyek: FizzBuzz',
  tipe: 'js',
  xp: 30,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: FizzBuzz

FizzBuzz adalah soal klasik wawancara kerja programmer. Soalnya sederhana, tapi menguji pemahaman **loop**, **modulo**, dan **urutan if/else**.

Untuk setiap angka dari 1 sampai \`n\`:
- Jika habis dibagi **3 dan 5** → cetak \`FizzBuzz\`
- Jika habis dibagi **3** saja → cetak \`Fizz\`
- Jika habis dibagi **5** saja → cetak \`Buzz\`
- Selain itu → cetak angkanya

Contoh untuk n = 15:
~~~
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
~~~

## Petunjuk logika
"Habis dibagi 3" artinya \`i % 3 === 0\`.

**Urutan pengecekan itu penting!** Kalau kamu mengecek \`i % 3 === 0\` lebih dulu, angka 15 akan tercetak "Fizz" dan tidak pernah sampai ke cabang "FizzBuzz". Pikirkan: cabang mana yang harus dicek paling awal?
`,
  tugas: `
Tulis FizzBuzz untuk angka 1 sampai \`n\`. Setiap hasil dicetak pada baris sendiri dengan \`console.log\`.

Tes akan mencoba beberapa nilai \`n\`.
`,
  kodeAwal: `const n = 15;

// tulis FizzBuzz di sini
`,
  solusi: `const n = 15;

for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
`,
  petunjuk: [
    'Mulai dengan for (let i = 1; i <= n; i++).',
    'Cek FizzBuzz lebih dulu: i % 3 === 0 && i % 5 === 0 (atau i % 15 === 0).',
  ],
  tes: [
    {
      nama: 'Output benar untuk n = 15',
      async cek(ctx) {
        const harap = ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'];
        const r = await ctx.jalankanDengan({ n: 15 });
        for (let i = 0; i < harap.length; i++) {
          if (r.logs[i] !== harap[i]) {
            return `Baris ke-${i + 1} seharusnya "${harap[i]}", tapi ${r.logs[i] === undefined ? 'tidak ada' : `tercetak "${r.logs[i]}"`}.${harap[i] === 'FizzBuzz' ? ' Apakah FizzBuzz dicek paling awal?' : ''}`;
          }
        }
        return r.logs.length === 15 || `Seharusnya ada tepat 15 baris, tapi tercetak ${r.logs.length} baris.`;
      },
    },
    {
      nama: 'Menyesuaikan dengan nilai n lain (n = 5 dan n = 30)',
      async cek(ctx) {
        const fb = (i) => (i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i));
        for (const n of [5, 30]) {
          const r = await ctx.jalankanDengan({ n });
          const harap = Array.from({ length: n }, (_, i) => fb(i + 1));
          if (r.logs.join() !== harap.join()) return `Untuk n = ${n}, outputmu belum tepat. Pastikan loop berjalan dari 1 sampai n (bukan angka tetap).`;
        }
        return true;
      },
    },
  ],
};
