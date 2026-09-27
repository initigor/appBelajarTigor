export default {
  id: 'async-membuat-promise',
  judul: 'Membuat Promise Sendiri',
  tipe: 'js',
  xp: 25,
  batasWaktu: 6000,
  materi: `
# new Promise

Kamu bisa membungkus pekerjaan yang butuh waktu menjadi Promise:

~~~js
const janji = new Promise((resolve, reject) => {
  // lakukan sesuatu...
  if (berhasil) {
    resolve(nilai);      // → masuk ke .then
  } else {
    reject(new Error("alasan gagal"));   // → masuk ke .catch
  }
});
~~~

\`resolve\` dan \`reject\` adalah **fungsi** yang diberikan kepadamu. Panggil salah satunya sekali saja.

## Contoh: versi Promise dari setTimeout
Ini fungsi yang sangat sering dibuat, yaitu "sleep" versi JavaScript:

~~~js
function tunggu(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

tunggu(1000).then(() => console.log("1 detik kemudian"));
~~~

## Contoh: validasi
~~~js
function bagi(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) reject(new Error("Tidak bisa membagi dengan nol"));
    else resolve(a / b);
  });
}

bagi(10, 2).then(console.log);                          // 5
bagi(1, 0).catch((e) => console.log(e.message));        // Tidak bisa membagi dengan nol
~~~

Selalu \`reject\` dengan \`new Error(...)\` (bukan string), supaya penerima bisa membaca \`.message\`.
`,
  tugas: `
1. Buat \`tunggu(ms)\` → Promise yang resolve setelah \`ms\` milidetik.
2. Buat \`cekUmur(umur)\` → Promise yang:
   - resolve dengan \`"Boleh masuk"\` jika umur ≥ 17
   - reject dengan \`new Error("Belum cukup umur")\` jika umur < 17
3. Buat \`masakMie()\` → Promise yang resolve dengan \`"Mie siap 🍜"\` setelah **300 ms** (pakai \`tunggu\`).
`,
  kodeAwal: `function tunggu(ms) {

}

function cekUmur(umur) {

}

function masakMie() {

}
`,
  solusi: `function tunggu(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cekUmur(umur) {
  return new Promise((resolve, reject) => {
    if (umur >= 17) {
      resolve("Boleh masuk");
    } else {
      reject(new Error("Belum cukup umur"));
    }
  });
}

function masakMie() {
  return tunggu(300).then(() => "Mie siap 🍜");
}

masakMie().then(console.log);
cekUmur(15).catch((e) => console.log(e.message));
`,
  petunjuk: [
    'tunggu: return new Promise((resolve) => setTimeout(resolve, ms));',
    'cekUmur: return new Promise((resolve, reject) => { if (...) resolve("Boleh masuk"); else reject(new Error("Belum cukup umur")); });',
    'masakMie: return tunggu(300).then(() => "Mie siap 🍜");',
  ],
  tes: [
    {
      nama: 'tunggu mengembalikan Promise yang menunggu',
      async cek(ctx) {
        const p = ctx.panggil('tunggu', 150);
        if (!p || typeof p.then !== 'function') return 'tunggu(ms) harus mengembalikan Promise.';
        const t0 = Date.now();
        await p;
        const lama = Date.now() - t0;
        return lama >= 130 || `tunggu(150) selesai dalam ${lama} ms. Seharusnya menunggu sekitar 150 ms.`;
      },
    },
    {
      nama: 'cekUmur resolve untuk umur ≥ 17',
      async cek(ctx) {
        const p = ctx.panggil('cekUmur', 20);
        if (!p || typeof p.then !== 'function') return 'cekUmur harus mengembalikan Promise.';
        const r = await p;
        if (r !== 'Boleh masuk') return `cekUmur(20) resolve dengan ${JSON.stringify(r)}, seharusnya "Boleh masuk".`;
        return (await ctx.panggil('cekUmur', 17)) === 'Boleh masuk' || 'cekUmur(17) seharusnya "Boleh masuk".';
      },
    },
    {
      nama: 'cekUmur reject dengan Error untuk umur < 17',
      async cek(ctx) {
        try {
          const r = await ctx.panggil('cekUmur', 15);
          return `cekUmur(15) malah resolve dengan ${JSON.stringify(r)}. Seharusnya reject.`;
        } catch (e) {
          if (!(e && typeof e === 'object' && 'message' in e)) return 'Reject dengan new Error("Belum cukup umur"), bukan string.';
          return e.message === 'Belum cukup umur' || `Pesan error: "${e.message}", seharusnya "Belum cukup umur".`;
        }
      },
    },
    {
      nama: 'masakMie resolve setelah ±300 ms',
      async cek(ctx) {
        const t0 = Date.now();
        const p = ctx.panggil('masakMie');
        if (!p || typeof p.then !== 'function') return 'masakMie harus mengembalikan Promise.';
        const r = await p;
        const lama = Date.now() - t0;
        if (r !== 'Mie siap 🍜') return `masakMie resolve dengan ${JSON.stringify(r)}, seharusnya "Mie siap 🍜".`;
        return lama >= 270 || `masakMie selesai dalam ${lama} ms, seharusnya sekitar 300 ms.`;
      },
    },
  ],
};
