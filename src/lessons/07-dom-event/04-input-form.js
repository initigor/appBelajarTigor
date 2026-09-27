export default {
  id: 'dom-input-form',
  judul: 'Input, value, & Form',
  tipe: 'dom',
  xp: 25,
  css: `form { display: flex; gap: 8px; margin: 12px 0; }
.error { color: #b00020; }
.sukses { color: #15a36a; }`,
  html: `<label>Nama: <input id="nama" placeholder="Ketik namamu"></label>
<p id="sapaan">Halo, siapa namamu?</p>
<hr>
<form id="form-email">
  <input id="email" placeholder="email@contoh.com">
  <button type="submit">Daftar</button>
</form>
<p id="hasil"></p>`,
  materi: `
# Membaca input user

Isi sebuah \`<input>\` ada di properti **\`value\`**, dan nilainya **selalu string** (masih ingat pelajaran konversi tipe?).

~~~js
const input = document.querySelector("#nama");
console.log(input.value);
~~~

## Event "input"
Event \`input\` terpicu **setiap kali isinya berubah** (setiap ketikan):

~~~js
input.addEventListener("input", (e) => {
  console.log(e.target.value);   // e.target = elemen input itu sendiri
});
~~~

Ada juga event \`change\`, yang baru terpicu setelah input kehilangan fokus.

## Form dan preventDefault
Secara default, menekan tombol submit di \`<form>\` akan **me-reload halaman**. Untuk menanganinya dengan JS, dengarkan event \`submit\` pada form dan panggil **\`e.preventDefault()\`**:

~~~js
form.addEventListener("submit", (e) => {
  e.preventDefault();          // jangan reload!
  const email = emailInput.value.trim();
  // validasi & proses...
});
~~~

Keuntungan memakai form: tombol Enter otomatis men-submit.

## Validasi sederhana
~~~js
if (email === "") { ... }
if (!email.includes("@")) { ... }
~~~
`,
  tugas: `
1. Setiap kali \`#nama\` diketik, ubah \`#sapaan\` menjadi \`Halo, <nama>!\`. Jika input kosong (setelah di-trim), kembalikan ke \`Halo, siapa namamu?\`
2. Saat \`#form-email\` di-submit (jangan lupa \`preventDefault\`):
   - email kosong → \`#hasil\` berisi \`Email wajib diisi\` dengan class \`error\`
   - email tanpa \`@\` → \`Email tidak valid\` dengan class \`error\`
   - selain itu → \`Terima kasih, <email> sudah terdaftar!\` dengan class \`sukses\` (dan tanpa class error)
`,
  kodeAwal: `const inputNama = document.querySelector("#nama");
const sapaan = document.querySelector("#sapaan");

const form = document.querySelector("#form-email");
const inputEmail = document.querySelector("#email");
const hasil = document.querySelector("#hasil");
`,
  solusi: `const inputNama = document.querySelector("#nama");
const sapaan = document.querySelector("#sapaan");

inputNama.addEventListener("input", () => {
  const nama = inputNama.value.trim();
  sapaan.textContent = nama === "" ? "Halo, siapa namamu?" : \`Halo, \${nama}!\`;
});

const form = document.querySelector("#form-email");
const inputEmail = document.querySelector("#email");
const hasil = document.querySelector("#hasil");

function tampilkanHasil(teks, kelas) {
  hasil.textContent = teks;
  hasil.classList.remove("error", "sukses");
  hasil.classList.add(kelas);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = inputEmail.value.trim();
  if (email === "") {
    tampilkanHasil("Email wajib diisi", "error");
  } else if (!email.includes("@")) {
    tampilkanHasil("Email tidak valid", "error");
  } else {
    tampilkanHasil(\`Terima kasih, \${email} sudah terdaftar!\`, "sukses");
  }
});
`,
  petunjuk: [
    'inputNama.addEventListener("input", () => { ... inputNama.value ... })',
    'form.addEventListener("submit", (e) => { e.preventDefault(); ... })',
    'Saat berhasil, hapus class "error" dulu: hasil.classList.remove("error").',
  ],
  tes: [
    {
      nama: 'Sapaan mengikuti ketikan',
      async cek(ctx) {
        await ctx.ketik('#nama', 'Sinta');
        if (ctx.teks('#sapaan') !== 'Halo, Sinta!') return `Setelah mengetik "Sinta", #sapaan berisi "${ctx.teks('#sapaan')}", seharusnya "Halo, Sinta!".`;
        await ctx.ketik('#nama', '   ');
        return ctx.teks('#sapaan') === 'Halo, siapa namamu?' || `Jika input kosong, #sapaan seharusnya "Halo, siapa namamu?", tapi "${ctx.teks('#sapaan')}".`;
      },
    },
    {
      nama: 'Submit memakai preventDefault',
      async cek(ctx) {
        const form = ctx.cari('#form-email');
        const W = ctx.window;
        const ev = new W.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(ev);
        await ctx.tunggu(20);
        return ev.defaultPrevented || 'Handler submit harus memanggil e.preventDefault() supaya halaman tidak reload.';
      },
    },
    {
      nama: 'Validasi email kosong & tidak valid',
      async cek(ctx) {
        const hasil = ctx.cari('#hasil');
        await ctx.ketik('#email', '');
        await ctx.kirim('#form-email');
        if (ctx.teks('#hasil') !== 'Email wajib diisi' || !hasil.classList.contains('error')) return `Untuk email kosong, #hasil harus "Email wajib diisi" dengan class error. Sekarang: "${ctx.teks('#hasil')}".`;
        await ctx.ketik('#email', 'budi.gmail.com');
        await ctx.kirim('#form-email');
        return (ctx.teks('#hasil') === 'Email tidak valid' && hasil.classList.contains('error')) || `Untuk "budi.gmail.com", #hasil harus "Email tidak valid" dengan class error. Sekarang: "${ctx.teks('#hasil')}".`;
      },
    },
    {
      nama: 'Email valid → pesan sukses',
      async cek(ctx) {
        const hasil = ctx.cari('#hasil');
        await ctx.ketik('#email', 'x');
        await ctx.kirim('#form-email');
        await ctx.ketik('#email', ' budi@kampus.ac.id ');
        await ctx.kirim('#form-email');
        const h = 'Terima kasih, budi@kampus.ac.id sudah terdaftar!';
        if (ctx.teks('#hasil') !== h) return `#hasil berisi "${ctx.teks('#hasil')}", seharusnya "${h}".`;
        if (!hasil.classList.contains('sukses')) return '#hasil harus punya class "sukses".';
        return !hasil.classList.contains('error') || 'Class "error" dari percobaan sebelumnya masih menempel. Hapus dulu.';
      },
    },
  ],
};
