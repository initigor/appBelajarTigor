export default {
  id: 'async-settimeout',
  judul: 'setTimeout & setInterval',
  tipe: 'js',
  xp: 20,
  batasWaktu: 6000,
  materi: `
# Kode yang berjalan "nanti"

Di C dan Python, \`sleep(2)\` **menghentikan** program selama 2 detik. Di browser, cara itu akan membuat seluruh halaman macet: tombol tidak bisa diklik, animasi berhenti.

JavaScript memakai cara lain: **jadwalkan** sebuah fungsi untuk dijalankan nanti, lalu **lanjutkan** kode berikutnya tanpa menunggu.

~~~js
console.log("1. Pesan kopi");
setTimeout(() => {
  console.log("3. Kopi jadi ☕");
}, 1000);               // milidetik: 1000 ms = 1 detik
console.log("2. Duduk sambil main HP");
~~~

Output:
~~~
1. Pesan kopi
2. Duduk sambil main HP
3. Kopi jadi ☕
~~~

Bahkan \`setTimeout(fn, 0)\` tetap dijalankan **setelah** semua kode yang sedang berjalan selesai. JavaScript hanya punya **satu thread**. Callback yang dijadwalkan masuk ke antrian (*event loop*) dan baru diproses ketika thread sedang kosong.

## setInterval: berulang
~~~js
let detik = 0;
const id = setInterval(() => {
  detik++;
  console.log(detik);
  if (detik === 3) clearInterval(id);   // WAJIB dihentikan
}, 1000);
~~~

\`setTimeout\` dan \`setInterval\` mengembalikan **id** yang bisa dipakai untuk membatalkan: \`clearTimeout(id)\` / \`clearInterval(id)\`.
`,
  tugas: `
**Bagian 1:** Tulis kode yang menghasilkan output dengan urutan berikut, **tanpa mengubah urutan penulisan baris**. Tulis \`console.log("Mulai")\` paling atas, lalu \`setTimeout\` (300 ms) yang mencetak \`Selesai\`, lalu \`console.log("Menunggu...")\`:
~~~
Mulai
Menunggu...
Selesai
~~~

**Bagian 2:** Buat hitung mundur dengan \`setInterval\` (setiap 200 ms) yang mencetak \`3\`, \`2\`, \`1\`, lalu \`Waktu habis!\`, kemudian menghentikan interval dengan \`clearInterval\`.
`,
  kodeAwal: `console.log("Mulai");
console.log("Selesai");
console.log("Menunggu...");

let hitung = 3;
`,
  solusi: `console.log("Mulai");
setTimeout(() => {
  console.log("Selesai");
}, 300);
console.log("Menunggu...");

let hitung = 3;
const id = setInterval(() => {
  if (hitung > 0) {
    console.log(hitung);
    hitung--;
  } else {
    console.log("Waktu habis!");
    clearInterval(id);
  }
}, 200);
`,
  petunjuk: [
    'Bungkus console.log("Selesai") di dalam setTimeout(() => { ... }, 300).',
    'Simpan id dari setInterval: const id = setInterval(...); lalu clearInterval(id) setelah "Waktu habis!".',
  ],
  tes: [
    {
      nama: 'Urutan: Mulai → Menunggu... → Selesai',
      cek(ctx) {
        if (!ctx.pakai('setTimeout')) return 'Gunakan setTimeout untuk "Selesai".';
        const urut = ctx.logs.filter((l) => ['Mulai', 'Menunggu...', 'Selesai'].includes(l));
        return urut.join(' → ') === 'Mulai → Menunggu... → Selesai' || `Urutan yang tercetak: ${urut.join(' → ')}.`;
      },
    },
    {
      nama: 'Hitung mundur 3, 2, 1, Waktu habis! dengan setInterval',
      cek(ctx) {
        if (!ctx.pakai('setInterval')) return 'Gunakan setInterval.';
        const urut = ctx.logs.filter((l) => ['3', '2', '1', 'Waktu habis!'].includes(l));
        return urut.join(',') === '3,2,1,Waktu habis!' || `Yang tercetak: ${urut.join(', ') || '(tidak ada)'}. Seharusnya 3, 2, 1, Waktu habis!`;
      },
    },
    {
      nama: 'Interval dihentikan dengan clearInterval',
      cek(ctx) {
        if (!ctx.pakai('clearInterval')) return 'Hentikan interval dengan clearInterval(id).';
        const n = ctx.logs.filter((l) => l === 'Waktu habis!').length;
        return n === 1 || `"Waktu habis!" tercetak ${n} kali. Interval belum berhenti dengan benar.`;
      },
    },
  ],
};
