export default {
  id: 'dom-event-click',
  judul: 'addEventListener: Klik',
  tipe: 'dom',
  xp: 25,
  css: `.angka { font-size: 48px; font-weight: 800; margin: 8px 0; }
.lampu { width: 60px; height: 60px; border-radius: 50%; background: #444; margin-top: 12px; }
.lampu.nyala { background: #ffd23f; box-shadow: 0 0 20px #ffd23f; }`,
  html: `<div class="angka" id="hitungan">0</div>
<button id="tambah">+1</button>
<button id="reset">Reset</button>
<hr>
<button id="saklar">Nyalakan lampu</button>
<div class="lampu" id="lampu"></div>`,
  materi: `
# Event: membuat halaman interaktif

Program C dan Python yang kamu tulis biasanya berjalan dari atas ke bawah lalu selesai. Halaman web berbeda: ia **menunggu** aksi user (klik, ketik, scroll), lalu menjalankan kode sebagai **respons**. Pola ini disebut *event-driven programming*.

## addEventListener
~~~js
const tombol = document.querySelector("#tambah");

tombol.addEventListener("click", () => {
  console.log("Tombol diklik!");
});
~~~

Argumen kedua adalah **callback** (masih ingat Chapter 3?). Fungsi itu **tidak dijalankan sekarang**, melainkan disimpan dan baru dipanggil browser setiap kali tombol diklik.

## State di luar handler
Untuk mengingat sesuatu di antara klik, simpan di variabel **di luar** callback:

~~~js
let jumlah = 0;
tombol.addEventListener("click", () => {
  jumlah++;
  tampilan.textContent = jumlah;
});
~~~

Pola "ubah data → perbarui tampilan" ini adalah inti dari apa yang nanti diotomatisasi oleh React.

## Objek event
Callback menerima objek event yang berisi info tentang kejadiannya:

~~~js
tombol.addEventListener("click", (e) => {
  console.log(e.target);   // elemen yang diklik
});
~~~

Setelah menekan ▶ Jalankan, coba klik tombol-tombol di tab **Preview**!
`,
  tugas: `
1. Saat \`#tambah\` diklik, angka di \`#hitungan\` bertambah 1.
2. Saat \`#reset\` diklik, angka kembali ke \`0\`.
3. Saat \`#saklar\` diklik, **toggle** class \`nyala\` pada \`#lampu\`, dan ubah teks tombol:
   - lampu menyala → teks tombol \`Matikan lampu\`
   - lampu mati → teks tombol \`Nyalakan lampu\`
`,
  kodeAwal: `let jumlah = 0;
const hitungan = document.querySelector("#hitungan");
const tombolTambah = document.querySelector("#tambah");

`,
  solusi: `let jumlah = 0;
const hitungan = document.querySelector("#hitungan");
const tombolTambah = document.querySelector("#tambah");

tombolTambah.addEventListener("click", () => {
  jumlah++;
  hitungan.textContent = jumlah;
});

document.querySelector("#reset").addEventListener("click", () => {
  jumlah = 0;
  hitungan.textContent = jumlah;
});

const saklar = document.querySelector("#saklar");
const lampu = document.querySelector("#lampu");
saklar.addEventListener("click", () => {
  lampu.classList.toggle("nyala");
  saklar.textContent = lampu.classList.contains("nyala") ? "Matikan lampu" : "Nyalakan lampu";
});
`,
  petunjuk: [
    'tombolTambah.addEventListener("click", () => { jumlah++; hitungan.textContent = jumlah; });',
    'Reset: set jumlah = 0 lalu perbarui textContent.',
    'Setelah toggle, cek lampu.classList.contains("nyala") untuk memilih teks tombol.',
  ],
  tes: [
    {
      nama: 'Klik +1 dua kali → 2',
      async cek(ctx) {
        await ctx.klik('#tambah');
        await ctx.klik('#tambah');
        const t = ctx.teks('#hitungan');
        return t === '2' || `Setelah 2 klik, #hitungan berisi "${t}", seharusnya "2".`;
      },
    },
    {
      nama: 'Reset → 0, lalu +1 → 1',
      async cek(ctx) {
        await ctx.klik('#tambah');
        await ctx.klik('#reset');
        if (ctx.teks('#hitungan') !== '0') return `Setelah reset, #hitungan berisi "${ctx.teks('#hitungan')}", seharusnya "0".`;
        await ctx.klik('#tambah');
        return ctx.teks('#hitungan') === '1' || `Setelah reset lalu +1, seharusnya "1", tapi "${ctx.teks('#hitungan')}". Apakah variabel jumlah ikut di-reset?`;
      },
    },
    {
      nama: 'Saklar menyalakan & mematikan lampu',
      async cek(ctx) {
        const lampu = ctx.cari('#lampu');
        await ctx.klik('#saklar');
        if (!lampu.classList.contains('nyala')) return 'Setelah klik pertama, #lampu harus punya class "nyala".';
        if (ctx.teks('#saklar') !== 'Matikan lampu') return `Saat lampu menyala, teks tombol "${ctx.teks('#saklar')}", seharusnya "Matikan lampu".`;
        await ctx.klik('#saklar');
        if (lampu.classList.contains('nyala')) return 'Setelah klik kedua, lampu harus mati lagi.';
        return ctx.teks('#saklar') === 'Nyalakan lampu' || `Saat lampu mati, teks tombol "${ctx.teks('#saklar')}", seharusnya "Nyalakan lampu".`;
      },
    },
  ],
};
