export default {
  id: 'dom-classlist-style',
  judul: 'classList & style',
  tipe: 'dom',
  xp: 20,
  css: `.kartu { padding: 12px 16px; border: 2px solid #ccc; border-radius: 10px; margin-bottom: 10px; transition: all .2s; }
.aktif { border-color: #6d4aff; background: #ece6ff; }
.tersembunyi { display: none; }
.peringatan { color: #b00020; font-weight: bold; }`,
  html: `<div id="kartu1" class="kartu">Kartu 1</div>
<div id="kartu2" class="kartu aktif">Kartu 2</div>
<p id="pesan" class="tersembunyi">Pesan rahasia 🎉</p>
<p id="status">Status: normal</p>`,
  materi: `
# Mengubah tampilan: classList & style

Cara terbaik mengubah tampilan elemen adalah **menambah/menghapus class CSS**. Aturan CSS-nya sudah ditulis di stylesheet, dan JS cukup mengatur class mana yang dipakai.

## classList
~~~js
const kartu = document.querySelector("#kartu1");
kartu.classList.add("aktif");        // tambah class
kartu.classList.remove("aktif");     // hapus class
kartu.classList.toggle("aktif");     // ada → hapus, tidak ada → tambah
kartu.classList.contains("aktif");   // true / false
~~~

Stylesheet halaman latihan ini punya class berikut:

~~~css
.aktif        { border-color: ungu; background: ungu muda; }
.tersembunyi  { display: none; }
.peringatan   { color: merah; font-weight: bold; }
~~~

## style (untuk kasus khusus)
Properti CSS juga bisa diubah langsung. Nama properti yang pakai tanda hubung ditulis **camelCase**:

~~~js
kartu.style.backgroundColor = "yellow";   // CSS: background-color
kartu.style.fontSize = "20px";            // CSS: font-size
~~~

Gunakan \`style\` untuk nilai yang dinamis (misalnya posisi hasil hitungan). Untuk hal lain, **class lebih rapi**.

## Atribut
~~~js
link.setAttribute("href", "https://github.com");
gambar.getAttribute("src");
tombol.disabled = true;
~~~
`,
  tugas: `
1. Tambahkan class \`aktif\` ke \`#kartu1\`.
2. Hapus class \`aktif\` dari \`#kartu2\`.
3. Tampilkan \`#pesan\` dengan menghapus class \`tersembunyi\`.
4. Ubah \`#status\`: teksnya menjadi \`Status: bahaya\`, tambahkan class \`peringatan\`, dan set \`style.fontSize\` menjadi \`"20px"\`.
`,
  kodeAwal: `const kartu1 = document.querySelector("#kartu1");
`,
  solusi: `const kartu1 = document.querySelector("#kartu1");
kartu1.classList.add("aktif");

document.querySelector("#kartu2").classList.remove("aktif");
document.querySelector("#pesan").classList.remove("tersembunyi");

const status = document.querySelector("#status");
status.textContent = "Status: bahaya";
status.classList.add("peringatan");
status.style.fontSize = "20px";
`,
  petunjuk: ['kartu1.classList.add("aktif");', 'status.style.fontSize = "20px";'],
  tes: [
    {
      nama: '#kartu1 aktif, #kartu2 tidak aktif',
      cek(ctx) {
        if (!ctx.cari('#kartu1').classList.contains('aktif')) return '#kartu1 belum punya class "aktif".';
        if (ctx.cari('#kartu2').classList.contains('aktif')) return '#kartu2 masih punya class "aktif".';
        if (!ctx.cari('#kartu1').classList.contains('kartu')) return 'Class "kartu" pada #kartu1 hilang. Pakai classList.add, jangan menimpa className.';
        return true;
      },
    },
    {
      nama: '#pesan ditampilkan',
      cek: (ctx) => !ctx.cari('#pesan').classList.contains('tersembunyi') || '#pesan masih punya class "tersembunyi".',
    },
    {
      nama: '#status berubah (teks, class, style)',
      cek(ctx) {
        const s = ctx.cari('#status');
        if (ctx.teks('#status') !== 'Status: bahaya') return `Teks #status "${ctx.teks('#status')}", seharusnya "Status: bahaya".`;
        if (!s.classList.contains('peringatan')) return '#status belum punya class "peringatan".';
        return s.style.fontSize === '20px' || `style.fontSize #status = "${s.style.fontSize}", seharusnya "20px".`;
      },
    },
  ],
};
