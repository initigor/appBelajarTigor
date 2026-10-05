// Mengecek daftar "sintaks penting" per chapter (src/lessons/sintaks-js.js & src/lessonsJava/sintaks-java.js):
//   - setiap chapter pemrograman (JS/React/Node dan pekan Java) punya daftar sintaks,
//   - tidak ada daftar untuk chapter yang tidak ada, dan bentuk butirnya valid [sintaks, fungsi, catatan?],
//   - tidak ada sintaks kembar dalam satu chapter (dipakai sebagai key di tampilan).
// Chapter bacaan (mis. Arsikom, bertanda `awalan`) tidak punya sintaks kode, jadi tidak diwajibkan.
//
// Pemakaian: npm run check-sintaks
import { chapters } from '../src/lessons/chapters.js';
import { chaptersJava } from '../src/lessonsJava/chapters.js';
import { sintaksJs } from '../src/lessons/sintaks-js.js';
import { sintaksJava } from '../src/lessonsJava/sintaks-java.js';

const masalah = [];

function periksa(nama, daftarChapter, data) {
  const ids = new Set(daftarChapter.map((c) => c.id));
  for (const id of Object.keys(data)) if (!ids.has(Number(id))) masalah.push(`${nama}: ada sintaks untuk chapter ${id} yang tidak terdaftar`);
  for (const c of daftarChapter) {
    const grup = data[c.id];
    if (!grup) {
      if (!c.awalan) masalah.push(`${nama}: chapter ${c.id} (${c.judul}) belum punya daftar sintaks`);
      continue;
    }
    const lihat = new Set();
    if (!Array.isArray(grup) || grup.length === 0) masalah.push(`${nama} ${c.id}: daftar sintaks kosong`);
    for (const g of grup) {
      if (!g.grup || !Array.isArray(g.butir) || g.butir.length === 0) {
        masalah.push(`${nama} ${c.id}: grup "${g.grup}" tidak valid`);
        continue;
      }
      for (const b of g.butir) {
        const [kode, fungsi, catatan] = b;
        if (!Array.isArray(b) || b.length < 2 || b.length > 3) masalah.push(`${nama} ${c.id}: butir harus [sintaks, fungsi, catatan?] → ${JSON.stringify(b)}`);
        else if (typeof kode !== 'string' || !kode.trim() || typeof fungsi !== 'string' || !fungsi.trim()) masalah.push(`${nama} ${c.id}: sintaks/fungsi kosong → ${JSON.stringify(b)}`);
        else if (catatan !== undefined && (typeof catatan !== 'string' || !catatan.trim())) masalah.push(`${nama} ${c.id}: catatan kosong → ${kode}`);
        else if (lihat.has(kode)) masalah.push(`${nama} ${c.id}: sintaks kembar → ${kode}`);
        lihat.add(kode);
      }
    }
  }
}

periksa('JS', chapters, sintaksJs);
periksa('Java', chaptersJava, sintaksJava);

const hitung = (data) => Object.values(data).reduce((a, grup) => a + grup.reduce((n, g) => n + g.butir.length, 0), 0);
for (const m of masalah) console.log(`❌ ${m}`);
if (masalah.length > 0) {
  console.log(`\n${masalah.length} masalah pada daftar sintaks.`);
  process.exit(1);
}
console.log(`✅ Sintaks penting OK: JS ${Object.keys(sintaksJs).length} chapter (${hitung(sintaksJs)} sintaks), Java ${Object.keys(sintaksJava).length} pekan (${hitung(sintaksJava)} sintaks)`);
