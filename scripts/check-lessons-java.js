// Mengecek semua pelajaran Java lewat runner sungguhan (javac + java):
//   1. `solusi` (atau tesUtama, atau kodeBermasalah yang sudah diperbaiki) harus lolos tesnya sendiri.
//   2. `kodeAwal` (kode-output/kode-kelas) TIDAK boleh langsung lolos semua tes.
//   3. `kodeBermasalah` (bedah-galat) harus benar-benar menghasilkan galat (bukan lolos begitu saja).
//   4. Cuplikan (prediksi/diagram-memori) harus bisa dikompilasi & dijalankan tanpa galat internal.
//
// Pemakaian:
//   npm run check-lessons-java
//   npm run check-lessons-java -- array   -> cek pelajaran yang id/file-nya mengandung "array"
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { jalankanUji, statusJdk } from '../server/javaRunner.js';
import { PENGUJI_JAVA } from '../src/lessonsJava/_bersama/penguji.js';
import { susunPelajaranJava } from '../src/lessonsJava/susun.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const folderPelajaran = join(root, 'src', 'lessonsJava');
const filter = process.argv[2]?.toLowerCase();

const status = await statusJdk();
if (!status.tersedia) {
  console.log('⚠️  JDK (javac/java) tidak terdeteksi di PATH — pelajaran Java dilewati (bukan galat).');
  console.log('   Pasang JDK 21+ (lihat README, bagian "Course Java — PBO") untuk memeriksanya.');
  process.exit(0);
}
console.log(`JDK terdeteksi: ${status.javac}\n`);

const modul = {};
for (const folder of readdirSync(folderPelajaran).sort()) {
  const p = join(folderPelajaran, folder);
  if (!statSync(p).isDirectory() || folder.startsWith('_')) continue;
  for (const file of readdirSync(p).filter((f) => f.endsWith('.js')).sort()) {
    modul[`./${folder}/${file}`] = await import(pathToFileURL(join(p, file)).href);
  }
}
const { semuaPelajaranJava } = susunPelajaranJava(modul);
const target = semuaPelajaranJava.filter((p) => !filter || p.id.toLowerCase().includes(filter) || p.file.toLowerCase().includes(filter));

function samaOutput(dapat, harap) {
  const bersih = (s) =>
    (s ?? '')
      .replace(/\r/g, '')
      .split('\n')
      .map((b) => b.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/\n+$/, '');
  return bersih(dapat) === bersih(harap);
}

async function cekKodeOutput(berkas, pelajaran) {
  const r = await jalankanUji({ berkas, kelasUtama: pelajaran.kelasUtama, kasus: pelajaran.tes.map((t) => ({ nama: t.nama, stdin: t.stdin ?? '' })) });
  if (r.fase !== 'eksekusi') return { lolos: false, alasan: `${r.fase}: ${r.stderr ?? r.pesan ?? ''}`.trim() };
  const gagal = [];
  r.hasil.forEach((h, i) => {
    const t = pelajaran.tes[i];
    if (!h.berhasilJalan || !samaOutput(h.stdout, t.harap)) gagal.push(`"${t.nama}": dapat ${JSON.stringify(h.stdout)}, harap ${JSON.stringify(t.harap)}${h.stderr ? `, stderr: ${h.stderr.split('\n')[0]}` : ''}`);
  });
  return { lolos: gagal.length === 0, alasan: gagal.join(' | ') };
}

async function cekKodeKelas(berkasUser, pelajaran) {
  const berkas = [...berkasUser, { nama: 'Penguji.java', isi: PENGUJI_JAVA }, { nama: `${pelajaran.tesUtamaNama}.java`, isi: pelajaran.tesUtamaIsi }];
  const r = await jalankanUji({ berkas, kelasUtama: pelajaran.tesUtamaNama, kasus: [{ nama: 'utama', stdin: '' }] });
  if (r.fase !== 'eksekusi') return { lolos: false, alasan: `${r.fase}: ${r.stderr ?? r.pesan ?? ''}`.trim() };
  const satu = r.hasil[0];
  const baris = (satu.stdout ?? '').split(/\r?\n/).filter((b) => b.startsWith('@@TES@@'));
  const namaLulus = new Set(baris.filter((b) => b.startsWith('@@TES@@1@@')).map((b) => b.slice('@@TES@@1@@'.length)));
  const gagalBaris = baris.filter((b) => b.startsWith('@@TES@@0@@'));
  const belumMuncul = pelajaran.daftarTes.filter((n) => !namaLulus.has(n) && !gagalBaris.some((b) => b.includes(n)));
  const semua = pelajaran.daftarTes.every((n) => namaLulus.has(n));
  const alasan = [...gagalBaris.map((b) => b.slice('@@TES@@0@@'.length)), ...belumMuncul.map((n) => `"${n}" tidak pernah muncul di output`)].join(' | ');
  return { lolos: semua, alasan: satu.berhasilJalan ? alasan : `program berhenti: ${satu.stderr?.split('\n')[0] ?? ''} | ${alasan}` };
}

let gagalTotal = 0;
for (const p of target) {
  const masalah = [];
  try {
    if (p.subtipe === 'kode-output') {
      const solusi = await cekKodeOutput(p.solusi, p);
      if (!solusi.lolos) masalah.push(`solusi gagal: ${solusi.alasan}`);
      const awal = await cekKodeOutput(p.kodeAwal, p);
      if (awal.lolos) masalah.push('kodeAwal sudah lolos semua tes (latihan jadi "gratis")');
    } else if (p.subtipe === 'kode-kelas') {
      const solusi = await cekKodeKelas(p.solusi, p);
      if (!solusi.lolos) masalah.push(`solusi gagal: ${solusi.alasan}`);
      const awal = await cekKodeKelas(p.kodeAwal, p);
      if (awal.lolos) masalah.push('kodeAwal sudah lolos semua tes (latihan jadi "gratis")');
    } else if (p.subtipe === 'bedah-galat') {
      const bermasalah = await jalankanUji({ berkas: p.kodeBermasalah, kelasUtama: p.kelasUtama, kasus: [{ nama: 'diagnosis', stdin: '' }] });
      const genuineError = bermasalah.fase === 'kompilasi' || (bermasalah.fase === 'eksekusi' && !bermasalah.hasil[0].berhasilJalan);
      if (bermasalah.fase === 'eksekusi' && bermasalah.hasil[0].berhasilJalan && p.jenisGalatBenar !== 'logika') {
        masalah.push('kodeBermasalah berjalan tanpa galat, tapi jenisGalatBenar bukan "logika"');
      } else if (!genuineError && p.jenisGalatBenar !== 'logika') {
        masalah.push(`kodeBermasalah seharusnya menghasilkan galat (${p.jenisGalatBenar}) tapi tidak (fase: ${bermasalah.fase})`);
      }
      if (!p.pilihanPenyebab.some((x) => x.benar)) masalah.push('pilihanPenyebab tidak punya satu pun yang benar:true');
      const solusi = await cekKodeOutput(p.solusi, p);
      if (!solusi.lolos) masalah.push(`solusi gagal: ${solusi.alasan}`);
    } else if (p.subtipe === 'prediksi' || p.subtipe === 'diagram-memori') {
      const r = await jalankanUji({ berkas: [{ nama: `${p.kelasUtamaCuplikan ?? 'Main'}.java`, isi: p.kodeCuplikan }], kelasUtama: p.kelasUtamaCuplikan ?? 'Main', kasus: [{ nama: 'cuplikan', stdin: '' }] });
      if (r.fase !== 'eksekusi' || !r.hasil[0].berhasilJalan) masalah.push(`kodeCuplikan gagal dijalankan: ${r.fase} ${r.stderr ?? r.hasil?.[0]?.stderr ?? r.pesan ?? ''}`);
      if (p.subtipe === 'diagram-memori') {
        for (const q of p.pertanyaan) if (!q.pilihan.some((x) => x.benar)) masalah.push(`pertanyaan "${q.judul}" tidak punya pilihan benar:true`);
      }
    }
  } catch (e) {
    masalah.push(`crash: ${e.stack ?? e}`);
  }
  if (masalah.length) {
    gagalTotal++;
    console.log(`❌ ${p.file}  (${p.id})`);
    for (const m of masalah) console.log(`     - ${m}`);
  } else {
    console.log(`✅ ${p.file}`);
  }
}

console.log(`\n${target.length - gagalTotal}/${target.length} pelajaran Java OK.`);
process.exit(gagalTotal ? 1 : 0);
