export default {
  id: 'proyek-pengaturan-profil',
  judul: 'Mini Proyek: Profil dari API',
  tipe: 'js',
  xp: 40,
  proyek: true,
  materi: `
# 🛠️ Mini Proyek: Merapikan Data Profil dari API

Bayangkan server mengirim data profil yang **tidak selalu lengkap**:

~~~js
const respon = {
  id: 42,
  nama: "Sinta Dewi",
  kontak: { email: "sinta@mail.com" },   // tidak ada telepon
  sosmed: null,
  pengaturan: { tema: "gelap" },         // tidak ada bahasa & notifikasi
};
~~~

Tugasmu: mengubahnya menjadi data rapi untuk ditampilkan, dengan semua fitur JS modern:
- **destructuring** (dengan nilai default) untuk mengambil data
- **\`?.\`** dan **\`??\`** untuk data yang mungkin tidak ada
- **spread** untuk menggabungkan pengaturan default dengan pengaturan user, tanpa mengubah object aslinya

## Menggabungkan pengaturan
~~~js
const DEFAULT = { tema: "terang", bahasa: "id" };
const user = { tema: "gelap" };
const final = { ...DEFAULT, ...user };  // { tema: "gelap", bahasa: "id" }
~~~
`,
  tugas: `
Konstanta \`PENGATURAN_DEFAULT\` sudah disediakan. Buat:

1. \`gabungPengaturan(pengaturanUser)\` → pengaturan default ditimpa milik user. \`notifikasi\` juga harus digabung **per properti** (bersarang). Jika \`pengaturanUser\` undefined, kembalikan salinan default. \`PENGATURAN_DEFAULT\` tidak boleh berubah.
2. \`rapikanProfil(respon)\` → object:
   ~~~js
   {
     id: 42,
     nama: "Sinta Dewi",
     namaDepan: "Sinta",
     email: "sinta@mail.com",       // "-" jika tidak ada
     telepon: "-",                   // "-" jika tidak ada
     instagram: "-",                 // dari respon.sosmed.instagram, "-" jika tidak ada
     pengaturan: { ...hasil gabungPengaturan }
   }
   ~~~
`,
  kodeAwal: `const PENGATURAN_DEFAULT = {
  tema: "terang",
  bahasa: "id",
  notifikasi: { email: true, push: false },
};

function gabungPengaturan(pengaturanUser) {

}

function rapikanProfil(respon) {

}

const respon = {
  id: 42,
  nama: "Sinta Dewi",
  kontak: { email: "sinta@mail.com" },
  sosmed: null,
  pengaturan: { tema: "gelap", notifikasi: { push: true } },
};
console.log(rapikanProfil(respon));
`,
  solusi: `const PENGATURAN_DEFAULT = {
  tema: "terang",
  bahasa: "id",
  notifikasi: { email: true, push: false },
};

function gabungPengaturan(pengaturanUser = {}) {
  return {
    ...PENGATURAN_DEFAULT,
    ...pengaturanUser,
    notifikasi: { ...PENGATURAN_DEFAULT.notifikasi, ...pengaturanUser.notifikasi },
  };
}

function rapikanProfil(respon) {
  const { id, nama, kontak, sosmed, pengaturan } = respon;
  return {
    id,
    nama,
    namaDepan: nama.split(" ")[0],
    email: kontak?.email ?? "-",
    telepon: kontak?.telepon ?? "-",
    instagram: sosmed?.instagram ?? "-",
    pengaturan: gabungPengaturan(pengaturan),
  };
}

const respon = {
  id: 42,
  nama: "Sinta Dewi",
  kontak: { email: "sinta@mail.com" },
  sosmed: null,
  pengaturan: { tema: "gelap", notifikasi: { push: true } },
};
console.log(rapikanProfil(respon));
`,
  petunjuk: [
    'Beri parameter default: function gabungPengaturan(pengaturanUser = {})',
    'notifikasi: { ...PENGATURAN_DEFAULT.notifikasi, ...pengaturanUser.notifikasi } (spread undefined itu aman).',
    'email: kontak?.email ?? "-"',
  ],
  tes: [
    {
      nama: 'gabungPengaturan menggabungkan termasuk notifikasi',
      cek(ctx) {
        const r = ctx.panggil('gabungPengaturan', { tema: 'gelap', notifikasi: { push: true } });
        const h = { tema: 'gelap', bahasa: 'id', notifikasi: { email: true, push: true } };
        if (JSON.stringify(r) !== JSON.stringify(h)) return `Hasil: ${JSON.stringify(r)}\nSeharusnya: ${JSON.stringify(h)}`;
        return true;
      },
    },
    {
      nama: 'gabungPengaturan aman tanpa argumen & tidak mengubah default',
      cek(ctx) {
        const r = ctx.panggil('gabungPengaturan');
        const d = ctx.ambil('PENGATURAN_DEFAULT');
        if (JSON.stringify(r) !== '{"tema":"terang","bahasa":"id","notifikasi":{"email":true,"push":false}}') return `gabungPengaturan() mengembalikan ${JSON.stringify(r)}.`;
        if (r === d || r.notifikasi === d.notifikasi) return 'Kembalikan salinan baru (termasuk object notifikasi), bukan object default itu sendiri.';
        ctx.panggil('gabungPengaturan', { bahasa: 'en', notifikasi: { email: false } });
        return (d.bahasa === 'id' && d.notifikasi.email === true) || 'PENGATURAN_DEFAULT ikut berubah!';
      },
    },
    {
      nama: 'rapikanProfil untuk data tidak lengkap',
      cek(ctx) {
        const respon = { id: 42, nama: 'Sinta Dewi', kontak: { email: 'sinta@mail.com' }, sosmed: null, pengaturan: { tema: 'gelap' } };
        const r = ctx.panggil('rapikanProfil', respon);
        const cek = { id: 42, nama: 'Sinta Dewi', namaDepan: 'Sinta', email: 'sinta@mail.com', telepon: '-', instagram: '-' };
        for (const [k, v] of Object.entries(cek)) {
          if (r?.[k] !== v) return `rapikanProfil(...).${k} = ${JSON.stringify(r?.[k])}, seharusnya ${JSON.stringify(v)}.`;
        }
        return r.pengaturan?.tema === 'gelap' && r.pengaturan?.bahasa === 'id' ? true : 'pengaturan seharusnya hasil gabungPengaturan(respon.pengaturan).';
      },
    },
    {
      nama: 'rapikanProfil untuk data lengkap',
      cek(ctx) {
        const respon = { id: 1, nama: 'Budi', kontak: { email: 'b@x.id', telepon: '0812' }, sosmed: { instagram: '@budi' } };
        const r = ctx.panggil('rapikanProfil', respon);
        if (r?.telepon !== '0812' || r?.instagram !== '@budi' || r?.namaDepan !== 'Budi') return `Hasil untuk data lengkap belum tepat: ${JSON.stringify(r)}`;
        return r.pengaturan?.tema === 'terang' || 'Jika respon tidak punya pengaturan, pakai default.';
      },
    },
  ],
};
