// Menjalankan SEMUA blok ```python di pelajaran bertanda `interaktif: 'python'` memakai Python di komputermu,
// supaya contoh di materi tidak berisi kode yang rusak.
//
// Aturan:
//   - Blok dalam satu pelajaran dijalankan berurutan di SATU namespace (sama seperti di halaman: kernel dipakai bersama).
//   - Blok yang sengaja menampilkan galat harus punya komentar "# galat" di baris pertama; blok itu HARUS gagal.
//   - input() dijawab otomatis dengan "10", atau dengan isi komentar "# contoh input: ..." di blok itu (satu baris jawaban).
//   - Blok yang butuh internet/paket berat (numpy, pandas, matplotlib) dilewati bila paketnya tidak terpasang.
//
// Pemakaian: npm run check-python            (semua)
//            npm run check-python -- py-list  (id/berkas mengandung "py-list")
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { susunPelajaran } from '../src/lessons/susun.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const filter = process.argv[2]?.toLowerCase();

const cek = spawnSync('python', ['--version'], { encoding: 'utf8' });
if (cek.error || cek.status !== 0) {
  console.log('⚠️  Python tidak ditemukan di PATH, pemeriksaan contoh kode dilewati.');
  process.exit(0);
}

const modul = {};
const folderPelajaran = join(root, 'src', 'lessons');
for (const folder of readdirSync(folderPelajaran).sort()) {
  const p = join(folderPelajaran, folder);
  if (!statSync(p).isDirectory()) continue;
  for (const file of readdirSync(p).filter((f) => f.endsWith('.js')).sort()) {
    modul[`./${folder}/${file}`] = await import(pathToFileURL(join(p, file)).href);
  }
}
const { semuaPelajaran } = susunPelajaran(modul);

const PENJALAN = `
import sys, json, builtins, io, contextlib, traceback
data = json.load(sys.stdin)
import re
ns = {"__name__": "__main__"}
hasil = []
for blok in data["blok"]:
    keluar = io.StringIO()
    galat = None
    m = re.search(r"^#\\s*contoh input:\\s*(.*)$", blok, re.M)
    jawaban = [m.group(1)] if m else []
    builtins.input = lambda prompt="", j=jawaban: j.pop(0) if j else "10"
    try:
        with contextlib.redirect_stdout(keluar), contextlib.redirect_stderr(keluar):
            exec(compile(blok, "<sel>", "exec"), ns)
    except BaseException:
        galat = traceback.format_exc(limit=3).strip().splitlines()[-1]
    hasil.append({"galat": galat, "keluar": keluar.getvalue()[-300:]})
print(json.dumps(hasil))
`;

function ambilBlok(materi) {
  const hasil = [];
  const re = /^```python\r?\n([\s\S]*?)^```/gm;
  const re2 = /^~~~python\r?\n([\s\S]*?)^~~~/gm;
  for (const r of [re, re2]) {
    let m;
    while ((m = r.exec(materi))) hasil.push({ pos: m.index, kode: m[1].replace(/\r/g, '') });
  }
  return hasil.sort((a, b) => a.pos - b.pos).map((x) => x.kode);
}

const target = semuaPelajaran.filter((p) => p.interaktif === 'python').filter((p) => !filter || p.id.includes(filter) || p.file.toLowerCase().includes(filter));
let gagal = 0;
let totalBlok = 0;

for (const p of target) {
  const blok = ambilBlok(p.materi);
  totalBlok += blok.length;
  // cwd sementara: contoh yang menulis berkas tidak boleh mengotori proyek
  const cwd = mkdtempSync(join(tmpdir(), 'latihkode-py-'));
  const r = spawnSync('python', ['-X', 'utf8', '-c', PENJALAN], { input: JSON.stringify({ blok }), encoding: 'utf8', timeout: 120000, cwd, env: { ...process.env, MPLBACKEND: 'Agg' } });
  if (r.status !== 0) {
    gagal++;
    console.log(`❌ ${p.file} — penjalan gagal: ${(r.stderr || r.error?.message || '').split('\n').slice(-3).join(' ')}`);
    continue;
  }
  const hasil = JSON.parse(r.stdout);
  const masalah = [];
  hasil.forEach((h, i) => {
    const sengaja = /^\s*# galat/.test(blok[i]);
    const modulHilang = h.galat && /ModuleNotFoundError: No module named '(numpy|pandas|matplotlib)'/.test(h.galat);
    if (modulHilang) return;
    if (sengaja && !h.galat) masalah.push(`blok ${i + 1}: ditandai "# galat" tetapi berjalan tanpa galat`);
    if (!sengaja && h.galat) masalah.push(`blok ${i + 1}: ${h.galat}`);
  });
  if (masalah.length) {
    gagal++;
    console.log(`❌ ${p.file}`);
    for (const m of masalah) console.log(`     - ${m}`);
  } else {
    console.log(`✅ ${p.file} (${blok.length} blok)`);
  }
}

console.log(`\n${target.length - gagal}/${target.length} pelajaran Python OK · ${totalBlok} blok kode dijalankan.`);
process.exit(gagal ? 1 : 0);
