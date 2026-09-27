export default {
  id: 'console-log',
  judul: 'Halo, console.log!',
  tipe: 'js',
  xp: 10,
  materi: `
# Halo, JavaScript! 👋

Di C kamu mencetak teks dengan \`printf\`, di Python dengan \`print\`. Di JavaScript, caranya pakai **\`console.log()\`**.

| Bahasa | Cara mencetak |
| --- | --- |
| C | \`printf("Halo\\n");\` |
| Python | \`print("Halo")\` |
| JavaScript | \`console.log("Halo");\` |

~~~js
console.log("Halo, Dunia!");
console.log(42);
console.log("Umurku", 20, "tahun"); // beberapa nilai dipisah koma -> dicetak dengan spasi
~~~

Beberapa hal yang perlu kamu tahu:

- \`console.log\` otomatis pindah baris, sama seperti \`print\` di Python. Tidak perlu \`\\n\`.
- String boleh ditulis dengan kutip dua \`"..."\` atau kutip satu \`'...'\`, sama seperti Python.
- **Titik koma \`;\`** di akhir baris sifatnya opsional di JS. Tapi biasakan menulisnya, mirip C, supaya tidak ada kejutan.
- Hasil \`console.log\` muncul di tab **Console** di sebelah kanan. Di browser sungguhan, hasilnya ada di DevTools (F12 → Console).
`,
  tugas: `
Cetak **dua baris** berikut ke console, persis sama (huruf besar/kecil dan tanda baca harus sama):

1. \`Halo, Dunia!\`
2. \`Aku sedang belajar JavaScript\`
`,
  kodeAwal: `// Tulis kodemu di bawah ini
`,
  solusi: `console.log("Halo, Dunia!");
console.log("Aku sedang belajar JavaScript");
`,
  petunjuk: [
    'Bentuknya: console.log("teks yang mau dicetak");',
    'Kamu butuh dua console.log, satu untuk setiap baris.',
  ],
  tes: [
    { nama: 'Mencetak "Halo, Dunia!"', cek: (ctx) => ctx.harusLog('Halo, Dunia!') },
    { nama: 'Mencetak "Aku sedang belajar JavaScript"', cek: (ctx) => ctx.harusLog('Aku sedang belajar JavaScript') },
  ],
};
