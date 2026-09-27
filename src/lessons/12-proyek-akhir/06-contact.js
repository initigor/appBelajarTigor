import {
  CSS_PORTOFOLIO, DATA_MENU, NAVBAR, HERO, DATA_INFO, ABOUT, DATA_SKILLS, SKILLS, DATA_PROYEK, PROJECTS, CONTACT,
  EL, buatApp, susun, cekSection,
} from '../_bersama/portofolio.js';

const CONTACT_AWAL = `function Contact() {
  return (
    <section id="contact">
      <h2>Kontak</h2>
      <form>
        <input name="nama" placeholder="Nama" />
        <input name="email" placeholder="Email" />
        <textarea name="pesan" placeholder="Pesan (min. 10 karakter)" />
        <button type="submit">Kirim</button>
      </form>
    </section>
  );
}`;

export default {
  id: 'portofolio-contact',
  judul: 'Portofolio 6: Contact Form',
  tipe: 'react',
  xp: 45,
  css: CSS_PORTOFOLIO,
  materi: `
# Contact: form terkontrol + validasi

Ini pengulangan Chapter 10, sekarang dalam konteks nyata. Gunakan **satu state object** untuk semua field, dan **satu handler**:

~~~jsx
const [form, setForm] = useState({ nama: "", email: "", pesan: "" });

function handleChange(e) {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
}
~~~

## Validasi sebagai nilai turunan
~~~jsx
const valid =
  form.nama.trim() !== "" &&
  form.email.includes("@") &&
  form.pesan.trim().length >= 10;
~~~

## Ganti tampilan setelah terkirim
~~~jsx
{terkirim ? <p className="sukses">...</p> : <form>...</form>}
~~~

> Di website sungguhan, isi form biasanya dikirim ke server atau layanan seperti Formspree/EmailJS lewat \`fetch\` (Chapter 8). Di latihan ini cukup tampilkan pesan sukses.
`,
  tugas: `
Lengkapi \`Contact()\`:

1. State object \`form\` (\`nama\`, \`email\`, \`pesan\`) + satu \`handleChange\` untuk ketiga field (terkontrol).
2. Tombol \`Kirim\` **disabled** kecuali: nama tidak kosong, email mengandung \`@\`, dan pesan ≥ 10 karakter (setelah trim).
3. Saat submit (\`preventDefault\`), form **diganti** dengan:
   \`<p class="sukses">Terima kasih, Sinta! Aku akan membalas ke sinta@mail.com.</p>\`
4. Tampilkan \`<Contact />\` di App, di bawah Projects.
`,
  kodeAwal: susun(
    [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK, NAVBAR, HERO, ABOUT, SKILLS, PROJECTS, CONTACT_AWAL],
    buatApp([EL.navbar, EL.hero, EL.about, EL.skills, EL.projects]),
  ),
  solusi: susun(
    [DATA_MENU, DATA_INFO, DATA_SKILLS, DATA_PROYEK, NAVBAR, HERO, ABOUT, SKILLS, PROJECTS, CONTACT],
    buatApp([EL.navbar, EL.hero, EL.about, EL.skills, EL.projects, EL.contact]),
  ),
  petunjuk: [
    'const [form, setForm] = useState({ nama: "", email: "", pesan: "" }); dan const [terkirim, setTerkirim] = useState(false);',
    'Setiap field: value={form.nama} onChange={handleChange} (sesuaikan nama field).',
    '{terkirim ? <p className="sukses">...</p> : <form onSubmit={handleSubmit}>...</form>}',
  ],
  tes: [
    {
      nama: 'section#contact & form',
      cek(ctx) {
        const c = cekSection(ctx, 'contact', 'Kontak');
        if (c !== true) return c;
        return ctx.ada('#contact form') || 'Belum ada <form> di #contact.';
      },
    },
    {
      nama: 'Tombol Kirim hanya aktif jika valid',
      async cek(ctx) {
        const btn = () => ctx.cari('#contact button[type="submit"]');
        if (!btn().disabled) return 'Saat form kosong, tombol Kirim harus disabled.';
        await ctx.ketik('#contact input[name="nama"]', 'Sinta');
        await ctx.ketik('#contact input[name="email"]', 'sinta.mail.com');
        await ctx.ketik('#contact textarea[name="pesan"]', 'Halo Budi, aku tertarik kolaborasi.');
        if (!btn().disabled) return 'Email tanpa "@" → tombol harus disabled.';
        await ctx.ketik('#contact input[name="email"]', 'sinta@mail.com');
        if (btn().disabled) return 'Semua field valid, tapi tombol masih disabled.';
        return ctx.cari('#contact input[name="nama"]').value === 'Sinta' || 'Nama hilang saat mengetik field lain. Jangan lupa ...form.';
      },
    },
    {
      nama: 'Submit menampilkan pesan sukses',
      async cek(ctx) {
        await ctx.kirim('#contact form');
        if (ctx.ada('#contact form')) return 'Setelah terkirim, form diganti dengan pesan sukses.';
        const t = ctx.ada('#contact .sukses') ? ctx.teks('#contact .sukses') : '(tidak ada)';
        return t === 'Terima kasih, Sinta! Aku akan membalas ke sinta@mail.com.' || `Pesan sukses: "${t}".`;
      },
    },
  ],
};
