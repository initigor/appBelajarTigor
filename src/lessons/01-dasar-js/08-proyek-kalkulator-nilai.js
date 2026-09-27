export default {
  id: 'proyek-kalkulator-nilai',
  judul: 'Mini Proyek: Kalkulator Nilai Akhir',
  tipe: 'js',
  xp: 30,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: Kalkulator Nilai Akhir

Saatnya menggabungkan semua yang sudah kamu pelajari di Chapter 1: variabel, operator, perbandingan, dan console.log.

Nilai akhir mata kuliah dihitung dengan bobot:

| Komponen | Bobot |
| --- | --- |
| Tugas | 20% |
| UTS | 30% |
| UAS | 50% |

## Tips: hati-hati dengan desimal
Seperti di C dan Python, angka desimal disimpan dalam format floating point, jadi \`0.1 + 0.2\` hasilnya \`0.30000000000000004\`. Supaya hasilnya rapi, hitung dengan **persen bulat** lalu bagi 100:

~~~js
// kurang rapi:  0.3 * 75  -> 22.499999999999996
// lebih rapi:   (30 * 75) / 100 -> 22.5
~~~

## Menggabung teks dengan +
Kamu sudah tahu \`+\` bisa menggabung string. Gunakan itu untuk membuat kalimat:

~~~js
const nama = "Budi";
console.log("Halo, " + nama + "!");   // Halo, Budi!
~~~
(Nanti di Chapter 3 ada cara yang lebih enak: template literal.)
`,
  tugas: `
Diberikan \`nilaiTugas\`, \`nilaiUTS\`, dan \`nilaiUAS\`.

1. Buat \`nilaiAkhir\` dengan bobot 20% / 30% / 50%. **Gunakan ketiga variabel**, jangan tulis hasilnya langsung.
2. Buat \`lulus\` bernilai \`true\` jika \`nilaiAkhir\` **minimal 70**.
3. Cetak dua baris:
   - \`Nilai akhir: 83.5\`
   - \`Lulus: true\`

   (Gunakan \`+\` untuk menggabung teks dengan variabel.)
`,
  kodeAwal: `const nilaiTugas = 80;
const nilaiUTS = 75;
const nilaiUAS = 90;

// hitung nilaiAkhir

// tentukan lulus

// cetak hasil
`,
  solusi: `const nilaiTugas = 80;
const nilaiUTS = 75;
const nilaiUAS = 90;

const nilaiAkhir = (20 * nilaiTugas + 30 * nilaiUTS + 50 * nilaiUAS) / 100;
const lulus = nilaiAkhir >= 70;

console.log("Nilai akhir: " + nilaiAkhir);
console.log("Lulus: " + lulus);
`,
  petunjuk: [
    'nilaiAkhir = (20 * nilaiTugas + 30 * nilaiUTS + 50 * nilaiUAS) / 100',
    '"Minimal 70" berarti >= 70.',
    'console.log("Nilai akhir: " + nilaiAkhir);',
  ],
  tes: [
    {
      nama: 'nilaiAkhir = 83.5 dihitung dari ketiga variabel',
      cek(ctx) {
        const n = ctx.variabel('nilaiAkhir');
        for (const v of ['nilaiTugas', 'nilaiUTS', 'nilaiUAS']) {
          if ((ctx.kodeBersih.match(new RegExp(`\\b${v}\\b`, 'g')) ?? []).length < 2) return `Gunakan variabel ${v} di rumus nilaiAkhir.`;
        }
        if (typeof n !== 'number') return `nilaiAkhir bertipe ${typeof n}, seharusnya number.`;
        return Math.abs(n - 83.5) < 1e-9 || `nilaiAkhir bernilai ${n}, seharusnya 83.5. Cek bobotnya: 20%, 30%, 50%.`;
      },
    },
    {
      nama: 'lulus bernilai true memakai perbandingan >= 70',
      cek(ctx) {
        if (!ctx.pakai(/nilaiAkhir\s*>=\s*70|70\s*<=\s*nilaiAkhir/)) return 'Tentukan lulus dengan perbandingan nilaiAkhir >= 70.';
        return ctx.variabel('lulus') === true || 'lulus seharusnya true.';
      },
    },
    {
      nama: 'Mencetak "Nilai akhir: 83.5" dan "Lulus: true"',
      cek(ctx) {
        ctx.harusLog('Nilai akhir: 83.5');
        return ctx.harusLog('Lulus: true');
      },
    },
  ],
};
