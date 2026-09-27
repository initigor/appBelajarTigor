export default {
  id: 'dom-query-selector',
  judul: 'querySelector & textContent',
  tipe: 'dom',
  xp: 20,
  html: `<h1 id="judul">Judul lama</h1>
<p class="deskripsi">Deskripsi lama</p>
<ul id="menu">
  <li class="item">Beranda</li>
  <li class="item">Tentang</li>
  <li class="item">Kontak</li>
</ul>`,
  materi: `
# DOM: JavaScript bertemu HTML

Saat browser membuka halaman HTML, ia membangun **DOM** (Document Object Model), yaitu pohon object yang mewakili setiap elemen. Dengan JavaScript, kamu bisa membaca dan mengubah pohon itu, dan tampilan halaman langsung ikut berubah.

Di pelajaran ini, tab **Preview** berisi halaman HTML kecil. Kodemu dijalankan di halaman itu.

## Mencari elemen
\`document.querySelector\` menerima **selector CSS**, lalu mengembalikan elemen **pertama** yang cocok:

~~~js
document.querySelector("#judul");       // berdasarkan id
document.querySelector(".deskripsi");   // berdasarkan class
document.querySelector("ul li");        // li di dalam ul
~~~

Kalau tidak ketemu, hasilnya \`null\`, sehingga mengakses propertinya akan error (\`Cannot set properties of null\`).

Untuk mengambil **semua** yang cocok, pakai \`querySelectorAll\`. Hasilnya mirip array (punya \`.length\` dan \`.forEach\`):

~~~js
const semuaItem = document.querySelectorAll(".item");
semuaItem.length;                        // 3
semuaItem.forEach((li) => console.log(li.textContent));
~~~

## Membaca & mengubah teks
~~~js
const judul = document.querySelector("#judul");
console.log(judul.textContent);          // "Judul lama"
judul.textContent = "Judul baru!";       // halaman langsung berubah
~~~

> Ada juga \`innerHTML\` yang bisa berisi tag HTML. Tapi hati-hati: memasukkan teks dari user ke \`innerHTML\` bisa membuka celah keamanan (XSS). Untuk teks biasa, pakai \`textContent\`.
`,
  tugas: `
1. Ubah teks \`#judul\` menjadi \`Halo, DOM!\`
2. Ubah teks elemen class \`deskripsi\` menjadi \`Aku sedang belajar DOM\`
3. Simpan **jumlah** elemen \`.item\` di \`const jumlahItem\` (pakai \`querySelectorAll\`).
4. Ubah teks item **terakhir** menjadi \`Hubungi Aku\`.
`,
  kodeAwal: `const judul = document.querySelector("#judul");
console.log(judul.textContent);
`,
  solusi: `const judul = document.querySelector("#judul");
judul.textContent = "Halo, DOM!";

document.querySelector(".deskripsi").textContent = "Aku sedang belajar DOM";

const semuaItem = document.querySelectorAll(".item");
const jumlahItem = semuaItem.length;
semuaItem[semuaItem.length - 1].textContent = "Hubungi Aku";

console.log(jumlahItem);
`,
  petunjuk: [
    'judul.textContent = "Halo, DOM!";',
    'const semuaItem = document.querySelectorAll(".item"); lalu semuaItem.length',
    'Item terakhir: semuaItem[semuaItem.length - 1]',
  ],
  tes: [
    {
      nama: '#judul berisi "Halo, DOM!"',
      cek: (ctx) => ctx.teks('#judul') === 'Halo, DOM!' || `#judul berisi "${ctx.teks('#judul')}", seharusnya "Halo, DOM!".`,
    },
    {
      nama: '.deskripsi berisi "Aku sedang belajar DOM"',
      cek: (ctx) => ctx.teks('.deskripsi') === 'Aku sedang belajar DOM' || `.deskripsi berisi "${ctx.teks('.deskripsi')}".`,
    },
    {
      nama: 'jumlahItem = 3 dari querySelectorAll',
      cek(ctx) {
        if (!ctx.pakai('querySelectorAll')) return 'Gunakan document.querySelectorAll(".item").';
        return ctx.ambil('jumlahItem') === 3 || `jumlahItem = ${ctx.ambil('jumlahItem')}, seharusnya 3.`;
      },
    },
    {
      nama: 'Item terakhir menjadi "Hubungi Aku"',
      cek(ctx) {
        const items = ctx.cariSemua('.item').map((li) => li.textContent.trim());
        if (items.length !== 3) return 'Jangan menghapus atau menambah item.';
        if (items[0] !== 'Beranda' || items[1] !== 'Tentang') return 'Hanya item terakhir yang diubah.';
        return items[2] === 'Hubungi Aku' || `Item terakhir berisi "${items[2]}", seharusnya "Hubungi Aku".`;
      },
    },
  ],
};
