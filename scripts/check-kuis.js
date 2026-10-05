// Mengecek bank kuis per pelajaran (src/kuis/*.js):
//   - setiap pelajaran punya kuis (rangkuman + 3–5 soal pilihan ganda), tidak ada kuis yatim,
//   - format soal valid (pilihan tidak kembar, penjelasan terisi, dst.).
//
// Pemakaian: npm run check-kuis
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { susunPelajaran } from '../src/lessons/susun.js';
import { periksaKuis, peringatanKuis } from '../src/kuis/validasi.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const modulPelajaran = {};
const folderPelajaran = join(root, 'src', 'lessons');
for (const folder of readdirSync(folderPelajaran).sort()) {
  const p = join(folderPelajaran, folder);
  if (!statSync(p).isDirectory()) continue;
  for (const file of readdirSync(p).filter((f) => f.endsWith('.js')).sort()) {
    modulPelajaran[`./${folder}/${file}`] = await import(pathToFileURL(join(p, file)).href);
  }
}
const { pelajaranById } = susunPelajaran(modulPelajaran);

const folderKuis = join(root, 'src', 'kuis');
const kuisById = {};
for (const file of readdirSync(folderKuis).filter((f) => f.endsWith('.js') && f !== 'index.js' && f !== 'validasi.js').sort()) {
  const m = await import(pathToFileURL(join(folderKuis, file)).href);
  for (const [id, k] of Object.entries(m.default ?? m)) {
    if (kuisById[id]) console.log(`❌ kuis "${id}" ada di lebih dari satu berkas (${file})`);
    kuisById[id] = k;
  }
}

const masalah = periksaKuis(kuisById, pelajaranById);
const peringatan = peringatanKuis(kuisById);
const totalSoal = Object.values(kuisById).reduce((a, k) => a + (k.soal?.length ?? 0), 0);

for (const m of masalah) console.log(`❌ ${m}`);
for (const w of peringatan) console.log(`⚠️  ${w}`);
console.log(`\n${Object.keys(kuisById).length}/${Object.keys(pelajaranById).length} pelajaran punya kuis · ${totalSoal} soal · ${masalah.length} masalah · ${peringatan.length} peringatan`);
process.exit(masalah.length > 0 ? 1 : 0);
