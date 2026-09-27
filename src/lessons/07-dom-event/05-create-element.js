export default {
  id: 'dom-create-element',
  judul: 'createElement & append',
  tipe: 'dom',
  xp: 25,
  css: `.skill { display: inline-block; background: #ece6ff; color: #4b2fd0; border-radius: 999px; padding: 2px 12px; margin: 4px; }`,
  html: `<h2>Skill-ku</h2>
<div id="daftar-skill"></div>
<p><input id="skill-baru" placeholder="Skill baru"> <button id="tambah-skill">Tambah</button></p>`,
  materi: `
# Membuat elemen baru

Selain mengubah elemen yang sudah ada, JS bisa **membuat elemen baru** lalu memasangnya ke halaman:

~~~js
const li = document.createElement("li");   // 1. buat (belum tampil)
li.textContent = "Belajar DOM";            // 2. isi
li.classList.add("item");                  //    beri class
daftar.append(li);                          // 3. pasang ke halaman
~~~

| Method | Fungsi |
| --- | --- |
| \`parent.append(el)\` | tambah di akhir |
| \`parent.prepend(el)\` | tambah di awal |
| \`el.remove()\` | hapus elemen itu sendiri |
| \`parent.innerHTML = ""\` | kosongkan semua isi |

## Dari array menjadi elemen
Pola yang sangat umum: data ada di array, lalu ditampilkan sebagai elemen:

~~~js
const hobi = ["membaca", "coding"];
hobi.forEach((h) => {
  const span = document.createElement("span");
  span.textContent = h;
  wadah.append(span);
});
~~~

Kalau datanya berubah, cara paling sederhana adalah **mengosongkan wadah lalu menggambar ulang** dari array. Nanti, React melakukan hal ini untukmu secara otomatis dan efisien.
`,
  tugas: `
Array \`skills\` sudah disediakan.

1. Buat fungsi \`tampilkanSkill()\` yang **mengosongkan** \`#daftar-skill\`, lalu untuk setiap skill membuat \`<span>\` dengan class \`skill\` berisi nama skill tersebut.
2. Panggil \`tampilkanSkill()\` sekali di awal.
3. Saat \`#tambah-skill\` diklik: ambil isi \`#skill-baru\` (trim). Jika tidak kosong, \`push\` ke \`skills\`, panggil \`tampilkanSkill()\`, lalu kosongkan input.
`,
  kodeAwal: `const skills = ["HTML", "CSS", "JavaScript"];
const wadah = document.querySelector("#daftar-skill");

function tampilkanSkill() {

}
`,
  solusi: `const skills = ["HTML", "CSS", "JavaScript"];
const wadah = document.querySelector("#daftar-skill");

function tampilkanSkill() {
  wadah.innerHTML = "";
  skills.forEach((s) => {
    const span = document.createElement("span");
    span.classList.add("skill");
    span.textContent = s;
    wadah.append(span);
  });
}

tampilkanSkill();

const input = document.querySelector("#skill-baru");
document.querySelector("#tambah-skill").addEventListener("click", () => {
  const nilai = input.value.trim();
  if (nilai === "") return;
  skills.push(nilai);
  tampilkanSkill();
  input.value = "";
});
`,
  petunjuk: [
    'Di tampilkanSkill: wadah.innerHTML = ""; lalu skills.forEach(...)',
    'document.createElement("span"), span.classList.add("skill"), wadah.append(span)',
    'Di handler klik: if (nilai === "") return;',
  ],
  tes: [
    {
      nama: 'Menampilkan 3 skill awal sebagai span.skill',
      cek(ctx) {
        const s = ctx.cariSemua('#daftar-skill span.skill').map((x) => x.textContent.trim());
        return s.join() === 'HTML,CSS,JavaScript' || `Isi #daftar-skill: [${s.join(', ')}], seharusnya [HTML, CSS, JavaScript] sebagai <span class="skill">.`;
      },
    },
    {
      nama: 'Tombol Tambah menambah skill & mengosongkan input',
      async cek(ctx) {
        await ctx.ketik('#skill-baru', '  React ');
        await ctx.klik('#tambah-skill');
        const s = ctx.cariSemua('#daftar-skill span.skill').map((x) => x.textContent.trim());
        if (s.join() !== 'HTML,CSS,JavaScript,React') return `Setelah menambah "React", isinya: [${s.join(', ')}]. Pastikan tidak ada yang dobel (kosongkan wadah dulu).`;
        return ctx.cari('#skill-baru').value === '' || 'Input belum dikosongkan setelah menambah.';
      },
    },
    {
      nama: 'Input kosong diabaikan',
      async cek(ctx) {
        const sebelum = ctx.cariSemua('#daftar-skill span.skill').length;
        await ctx.ketik('#skill-baru', '   ');
        await ctx.klik('#tambah-skill');
        const sesudah = ctx.cariSemua('#daftar-skill span.skill').length;
        return sesudah === sebelum || 'Skill kosong seharusnya tidak ditambahkan.';
      },
    },
  ],
};
