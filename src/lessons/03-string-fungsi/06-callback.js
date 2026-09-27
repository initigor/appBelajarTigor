export default {
  id: 'callback',
  judul: 'Callback: Fungsi sebagai Nilai',
  tipe: 'js',
  xp: 25,
  materi: `
# Callback

Di JavaScript, fungsi adalah **nilai biasa**, sama seperti angka atau string. Fungsi bisa disimpan di variabel, dikirim sebagai argumen, dan dikembalikan dari fungsi lain.

Fungsi yang dikirim sebagai argumen ke fungsi lain disebut **callback**.

~~~js
function jalankanDuaKali(aksi) {
  aksi();
  aksi();
}

jalankanDuaKali(() => console.log("Halo!"));  // Halo! Halo!
~~~

Di C kamu bisa melakukan hal serupa dengan **function pointer** (\`void (*aksi)(void)\`), dan di Python dengan mengirim nama fungsi (\`map(str.upper, daftar)\`). Di JS caranya jauh lebih ringan dan sangat sering dipakai.

## Callback dengan argumen

~~~js
function hitung(a, b, operasi) {
  return operasi(a, b);
}

hitung(3, 4, (x, y) => x + y);   // 7
hitung(3, 4, (x, y) => x * y);   // 12
~~~

## ⚠️ Kirim fungsinya, jangan panggil
~~~js
function sapa() { console.log("hai"); }

jalankanDuaKali(sapa);     // ✅ mengirim fungsinya
jalankanDuaKali(sapa());   // ❌ memanggil sapa sekarang, lalu mengirim hasilnya (undefined)
~~~

## Kenapa penting?
Callback adalah dasar dari banyak hal yang akan kamu pelajari berikutnya:
- \`map\`, \`filter\`, \`forEach\` pada array (Chapter 4)
- \`addEventListener("click", callback)\` di DOM (Chapter 7)
- \`setTimeout(callback, 1000)\` (Chapter 8)
- \`onClick={() => ...}\` di React (Chapter 10)
`,
  tugas: `
1. Buat fungsi \`ulangi(n, aksi)\` yang memanggil \`aksi(i)\` sebanyak \`n\` kali, dengan \`i\` dari 1 sampai n.
   Contoh: \`ulangi(3, (i) => console.log("Putaran " + i))\` mencetak Putaran 1, Putaran 2, Putaran 3.
2. Buat fungsi \`terapkan(angka, fn)\` yang mengembalikan hasil \`fn(angka)\`.
3. Panggil \`ulangi(3, ...)\` dengan callback yang mencetak \`Putaran 1\`, \`Putaran 2\`, \`Putaran 3\`.
`,
  kodeAwal: `function ulangi(n, aksi) {
  // panggil aksi(i) untuk i = 1..n
}

function terapkan(angka, fn) {
  // kembalikan hasil fn(angka)
}

// panggil ulangi di sini
`,
  solusi: `function ulangi(n, aksi) {
  for (let i = 1; i <= n; i++) {
    aksi(i);
  }
}

function terapkan(angka, fn) {
  return fn(angka);
}

ulangi(3, (i) => console.log("Putaran " + i));
console.log(terapkan(5, (x) => x * 10));
`,
  petunjuk: [
    'Di dalam ulangi: for (let i = 1; i <= n; i++) { aksi(i); }',
    'terapkan cukup satu baris: return fn(angka);',
    'ulangi(3, (i) => console.log("Putaran " + i));',
  ],
  tes: [
    {
      nama: 'ulangi memanggil aksi(i) sebanyak n kali',
      cek(ctx) {
        const dicatat = [];
        ctx.panggil('ulangi', 4, (i) => dicatat.push(i));
        if (dicatat.length !== 4) return `ulangi(4, aksi) memanggil aksi ${dicatat.length} kali, seharusnya 4 kali.`;
        if (dicatat.join() !== '1,2,3,4') return `aksi dipanggil dengan argumen ${dicatat.join(', ')}, seharusnya 1, 2, 3, 4.`;
        return true;
      },
    },
    {
      nama: 'terapkan mengembalikan fn(angka)',
      cek(ctx) {
        const a = ctx.panggil('terapkan', 5, (x) => x * 10);
        if (a !== 50) return `terapkan(5, x => x * 10) mengembalikan ${a}, seharusnya 50.${a === undefined ? ' Lupa return?' : ''}`;
        const b = ctx.panggil('terapkan', 'hai', (s) => s.toUpperCase());
        return b === 'HAI' || `terapkan("hai", s => s.toUpperCase()) mengembalikan ${JSON.stringify(b)}, seharusnya "HAI".`;
      },
    },
    {
      nama: 'Mencetak Putaran 1 sampai 3 lewat ulangi',
      cek(ctx) {
        if (!ctx.pakai(/ulangi\s*\(\s*3\s*,/)) return 'Panggil ulangi(3, ...) dengan sebuah callback.';
        ctx.harusLog('Putaran 1');
        ctx.harusLog('Putaran 2');
        return ctx.harusLog('Putaran 3');
      },
    },
  ],
};
