export default {
  id: 'node-apa-itu',
  judul: 'Node.js: JavaScript di Luar Browser',
  tipe: 'js',
  xp: 15,
  materi: `
# Node.js: JavaScript di Luar Browser 🖥️

Selama ini kodemu jalan **di dalam browser** (lewat tombol "Jalankan" di web ini). **Node.js** adalah cara menjalankan JavaScript **di luar browser** — di terminal, di server, di mana saja — pakai mesin JS yang sama dengan Chrome (bernama V8).

| | Di browser | Di Node.js |
| --- | --- | --- |
| Jalan di mana | Halaman web pengunjung | Server / komputermu / terminal |
| Ada \`window\`, \`document\`? | Ya | Tidak (tidak ada halaman web!) |
| Ada akses file, network mentah? | Dibatasi (demi keamanan) | Bebas (\`fs\`, \`http\`, dll.) |
| Cara jalankan | Buka halaman HTML | \`node app.js\` di terminal |

Mirip seperti kamu menjalankan program C dengan \`./program\` atau Python dengan \`python app.py\` — bedanya Node.js menjalankan file \`.js\`.

Node.js dipakai untuk:
- **Backend / server API** — inti chapter ini.
- **Script otomatisasi** (misalnya \`scripts/check-lessons.js\` di proyek LatihKode ini sendiri!).
- **Tools build** — Vite yang menjalankan web ini juga adalah program Node.js.

## npm & package.json

**npm** (Node Package Manager) mengelola *paket* (library) pihak ketiga, mirip \`pip\` di Python. Setiap proyek Node punya file **\`package.json\`** yang mencatat identitas proyek dan daftar paket yang dipakai (\`dependencies\`) — mirip \`requirements.txt\`, tapi dikelola otomatis:

~~~json
{
  "name": "kalkulator-umkm",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  }
}
~~~

- \`npm install express\` → memasang paket **express** dan menambahkannya ke \`dependencies\`.
- \`npm install\` (tanpa nama) → memasang **semua** paket yang tercatat di \`package.json\` (biasanya ke folder \`node_modules\`).

## Sistem modul

Kode Node biasanya dipecah jadi banyak file (modul) yang saling \`import\`. Ada dua gaya penulisan:

~~~js
// Gaya lama (CommonJS)
const express = require('express');
module.exports = { tambah };

// Gaya modern (ES Modules) — dipakai proyek LatihKode ini
import express from 'express';
export function tambah(a, b) { return a + b; }
~~~

Chapter ini akan menulis **logika backend** (fungsi murni) yang nantinya dipakai di dalam file Node.js sungguhan — kita fokus ke cara berpikirnya dulu.
`,
  tugas: `
Bayangkan kamu mulai proyek backend "kalkulator-umkm". Buat dua fungsi:

1. \`infoPaket()\` → mengembalikan object seperti isi \`package.json\`:
   \`{ nama: "kalkulator-umkm", versi: "1.0.0", main: "app.js" }\`
2. \`tambahDependency(daftar, nama, versi)\` → \`daftar\` adalah object \`dependencies\` yang sudah ada. Kembalikan **object baru** (jangan ubah \`daftar\` aslinya!) dengan \`nama: versi\` ditambahkan.
   \`tambahDependency({ express: "^4.18.0" }, "dotenv", "^16.0.0")\` → \`{ express: "^4.18.0", dotenv: "^16.0.0" }\`
`,
  kodeAwal: `function infoPaket() {

}

function tambahDependency(daftar, nama, versi) {

}
`,
  solusi: `function infoPaket() {
  return { nama: "kalkulator-umkm", versi: "1.0.0", main: "app.js" };
}

function tambahDependency(daftar, nama, versi) {
  return { ...daftar, [nama]: versi };
}
`,
  petunjuk: [
    'infoPaket: tinggal return object literalnya langsung.',
    'tambahDependency: return { ...daftar, [nama]: versi }; — pakai spread supaya object asli tidak berubah.',
  ],
  tes: [
    {
      nama: 'infoPaket berisi field yang benar',
      cek(ctx) {
        const r = ctx.panggil('infoPaket');
        const h = { nama: 'kalkulator-umkm', versi: '1.0.0', main: 'app.js' };
        for (const k of Object.keys(h)) {
          if (r?.[k] !== h[k]) return `infoPaket().${k} = ${JSON.stringify(r?.[k])}, seharusnya ${JSON.stringify(h[k])}.`;
        }
        return true;
      },
    },
    {
      nama: 'tambahDependency menambah entri baru',
      cek(ctx) {
        const r = ctx.panggil('tambahDependency', { express: '^4.18.0' }, 'dotenv', '^16.0.0');
        const h = { express: '^4.18.0', dotenv: '^16.0.0' };
        return JSON.stringify(r) === JSON.stringify(h) || `Hasilnya ${JSON.stringify(r)}, seharusnya ${JSON.stringify(h)}.`;
      },
    },
    {
      nama: 'tambahDependency tidak mengubah object asli',
      cek(ctx) {
        const asli = { express: '^4.18.0' };
        ctx.panggil('tambahDependency', asli, 'dotenv', '^16.0.0');
        return Object.keys(asli).length === 1 || 'Object `daftar` yang asli ikut berubah. Buat object baru, jangan ubah langsung (mutasi) yang lama.';
      },
    },
  ],
};
