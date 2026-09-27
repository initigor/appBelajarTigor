export default {
  id: 'object-method-shorthand',
  judul: 'Method & Shorthand Property',
  tipe: 'js',
  xp: 20,
  materi: `
# Fungsi di dalam object (method)

Properti object boleh berisi fungsi. Fungsi seperti itu disebut **method**, sama seperti \`s.toUpperCase()\` yang sudah sering kamu pakai.

~~~js
const kalkulator = {
  merek: "Casio",
  tambah(a, b) {          // cara singkat menulis method
    return a + b;
  },
};
kalkulator.tambah(2, 3);  // 5
~~~

## this
Di dalam method, **\`this\`** merujuk ke object pemilik method, mirip \`self\` di Python (bedanya, \`this\` tidak ditulis sebagai parameter):

~~~js
const mhs = {
  nama: "Budi",
  sapa() {
    return \`Halo, saya \${this.nama}\`;
  },
};
mhs.sapa();   // "Halo, saya Budi"
~~~

⚠️ Arrow function **tidak punya** \`this\` sendiri. Untuk method yang memakai \`this\`, gunakan bentuk \`sapa() { ... }\`, bukan \`sapa: () => ...\`.

## Shorthand property
Kalau nama variabel sama dengan nama kunci, cukup tulis sekali:

~~~js
const nama = "Sinta";
const umur = 20;

const orang1 = { nama: nama, umur: umur };   // panjang
const orang2 = { nama, umur };               // singkat, hasilnya sama
~~~

Pola ini sangat sering dipakai, termasuk di React.

## Fungsi "pabrik" object
Fungsi yang membuat object dengan format tetap mirip constructor sederhana:

~~~js
function buatTitik(x, y) {
  return { x, y };
}
~~~
`,
  tugas: `
Buat fungsi \`buatMahasiswa(nama, nim)\` yang mengembalikan object berisi:

- \`nama\` dan \`nim\` (pakai **shorthand property**)
- \`sks\` bernilai awal \`0\`
- method \`ambilMatkul(jumlahSks)\` → menambah \`this.sks\` sebanyak \`jumlahSks\`
- method \`perkenalan()\` → mengembalikan \`"Halo, saya Budi (2301234), sudah mengambil 6 SKS"\`
`,
  kodeAwal: `function buatMahasiswa(nama, nim) {
  return {
    nama: nama,
    nim: nim,
  };
}

const budi = buatMahasiswa("Budi", "2301234");
`,
  solusi: `function buatMahasiswa(nama, nim) {
  return {
    nama,
    nim,
    sks: 0,
    ambilMatkul(jumlahSks) {
      this.sks += jumlahSks;
    },
    perkenalan() {
      return \`Halo, saya \${this.nama} (\${this.nim}), sudah mengambil \${this.sks} SKS\`;
    },
  };
}

const budi = buatMahasiswa("Budi", "2301234");
budi.ambilMatkul(3);
budi.ambilMatkul(3);
console.log(budi.perkenalan());
`,
  petunjuk: [
    'Shorthand: return { nama, nim, sks: 0, ... }',
    'Method: ambilMatkul(jumlahSks) { this.sks += jumlahSks; }',
  ],
  tes: [
    {
      nama: 'Memakai shorthand property dan sks awal 0',
      cek(ctx) {
        if (ctx.pakai(/nama\s*:\s*nama/)) return 'Gunakan shorthand: tulis { nama, nim } saja.';
        const m = ctx.panggil('buatMahasiswa', 'Sinta', '2209876');
        if (m?.nama !== 'Sinta' || m?.nim !== '2209876') return 'Object yang dikembalikan harus berisi nama dan nim dari parameter.';
        return m.sks === 0 || `sks awal seharusnya 0, sekarang ${m.sks}.`;
      },
    },
    {
      nama: 'ambilMatkul menambah sks',
      cek(ctx) {
        const m = ctx.panggil('buatMahasiswa', 'Sinta', '2209876');
        if (typeof m.ambilMatkul !== 'function') return 'Belum ada method ambilMatkul.';
        m.ambilMatkul(3);
        m.ambilMatkul(2);
        return m.sks === 5 || `Setelah ambilMatkul(3) dan ambilMatkul(2), sks = ${m.sks}, seharusnya 5.`;
      },
    },
    {
      nama: 'perkenalan memakai this',
      cek(ctx) {
        const m = ctx.panggil('buatMahasiswa', 'Budi', '2301234');
        if (typeof m.perkenalan !== 'function') return 'Belum ada method perkenalan.';
        m.ambilMatkul?.(6);
        const r = m.perkenalan();
        const h = 'Halo, saya Budi (2301234), sudah mengambil 6 SKS';
        return r === h || `perkenalan() mengembalikan ${JSON.stringify(r)}, seharusnya "${h}".`;
      },
    },
  ],
};
