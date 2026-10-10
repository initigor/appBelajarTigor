// Mengecek latihan mengetik (src/mengetik/*):
//   - semua karakter latihan bisa diketik di papan QWERTY US (tidak ada karakter "gaib"),
//   - id tahap unik, baris tidak kosong/terlalu panjang, tiap karakter fokus benar-benar dilatih,
//   - mesin: kesalahan tidak maju, akurasi/WPM/bintang masuk akal, kutip melengkung dinormalkan,
//   - pembuat latihan bebas hanya memakai simbol yang dipilih.
//
// Pemakaian: npm run check-mengetik
import { JALUR, semuaTahap, buatLatihanBebas, SEMUA_SIMBOL, tahapBerikutnya } from '../src/mengetik/latihan.js';
import { bisaDiketik, infoKarakter, petunjuk, TOMBOL, urutanJari } from '../src/mengetik/papan.js';
import { ketik, mulaiSesi, normalisasi, ringkas, hitungBintang, wpmDari } from '../src/mengetik/mesin.js';

let galat = 0;
const gagal = (pesan) => {
  galat++;
  console.log(`❌ ${pesan}`);
};

// ---------- papan ----------
for (const t of TOMBOL) if (!urutanJari.includes(t.jari)) gagal(`tombol ${t.id} memakai jari tak dikenal (${t.jari})`);
if (petunjuk('(') !== 'Shift kiri (kelingking kiri) + 9 (jari manis kanan)') gagal(`petunjuk "(" tidak sesuai: ${petunjuk('(')}`);
if (petunjuk('A') !== 'Shift kanan (kelingking kanan) + A (kelingking kiri)') gagal(`petunjuk "A" tidak sesuai: ${petunjuk('A')}`);
if (infoKarakter('f')?.jari !== 'L2' || infoKarakter('j')?.jari !== 'R2') gagal('telunjuk F/J tidak di posisi rumah');
if (!bisaDiketik('\n') || !bisaDiketik(' ')) gagal('Enter/spasi harus bisa diketik');
for (const c of SEMUA_SIMBOL) if (!bisaDiketik(c)) gagal(`simbol latihan bebas "${c}" tidak ada di papan`);

// ---------- kurikulum ----------
const idDipakai = new Set();
for (const jalur of JALUR) {
  if (jalur.tahap.length === 0) gagal(`jalur ${jalur.id} kosong`);
  for (const t of jalur.tahap) {
    if (idDipakai.has(t.id)) gagal(`id tahap ganda: ${t.id}`);
    idDipakai.add(t.id);
    if (!t.judul || !t.tip || !t.ringkas) gagal(`${t.id}: judul/ringkas/tip belum lengkap`);
    if (!(t.target > 0)) gagal(`${t.id}: target WPM harus > 0`);
    if (t.baris.length < 5) gagal(`${t.id}: minimal 5 baris (ada ${t.baris.length})`);
    const semuaTeks = t.baris.join('');
    for (const [i, b] of t.baris.entries()) {
      if (!b.trim()) gagal(`${t.id} baris ${i + 1} kosong`);
      if (b !== b.trim()) gagal(`${t.id} baris ${i + 1}: spasi di ujung baris`);
      if (b.length > 44) gagal(`${t.id} baris ${i + 1} terlalu panjang (${b.length})`);
      for (const c of b) if (!bisaDiketik(c)) gagal(`${t.id} baris ${i + 1}: karakter "${c}" tidak bisa diketik di papan`);
    }
    for (const f of t.fokus) if (!semuaTeks.includes(f)) gagal(`${t.id}: karakter fokus "${f}" tidak muncul di latihan`);
    const panjang = t.baris.join('\n').length;
    if (panjang < 90 || panjang > 420) gagal(`${t.id}: panjang latihan ${panjang} karakter di luar 90–420`);
  }
}

// ---------- mesin ----------
{
  const t = semuaTahap[0];
  let s = mulaiSesi(t.baris);
  let waktu = 1000;
  for (const c of s.teks) s = ketik(s, c, (waktu += 200));
  const r = ringkas(s);
  if (!s.selesai) gagal('mesin: mengetik semua karakter harus menyelesaikan sesi');
  if (r.akurasi !== 100 || r.salah !== 0) gagal(`mesin: tanpa salah akurasi harus 100 (dapat ${r.akurasi})`);
  if (hitungBintang(r, 1) !== 3) gagal('mesin: sesi sempurna dengan target rendah harus 3★');
  if (!(r.wpm > 40 && r.wpm < 70)) gagal(`mesin: WPM untuk 200 ms/ketukan seharusnya ±60, dapat ${r.wpm}`);
}
{
  let s = mulaiSesi(['ab']);
  s = ketik(s, 'x', 100);
  if (s.pos !== 0 || s.salah !== 1) gagal('mesin: ketukan salah tidak boleh memajukan posisi');
  s = ketik(s, 'a', 200);
  s = ketik(s, 'b', 300);
  if (!s.selesai || s.benar !== 2 || s.salah !== 1) gagal('mesin: hitungan benar/salah tidak sesuai');
  const r = ringkas(s);
  if (r.akurasi !== 66.7) gagal(`mesin: akurasi 2/3 seharusnya 66.7, dapat ${r.akurasi}`);
  if (r.lemah[0]?.ch !== 'a') gagal('mesin: karakter yang salah harus tercatat pada karakter sasarannya');
  if (hitungBintang({ akurasi: 93, wpm: 5 }, 20) !== 2 || hitungBintang({ akurasi: 80, wpm: 99 }, 20) !== 1) gagal('mesin: aturan bintang tidak sesuai');
}
{
  // jeda panjang tidak menghukum WPM
  let s = mulaiSesi(['abcdefghij']);
  s = ketik(s, 'a', 0);
  s = ketik(s, 'b', 60 * 60 * 1000);
  if (s.aktifMs > 3000) gagal('mesin: jeda panjang harus dipotong');
  if (wpmDari(0, 0) !== 0) gagal('mesin: wpmDari(0,0) harus 0');
}
if (normalisasi('“halo” ‘a’') !== '"halo" \'a\'') gagal('normalisasi kutip melengkung tidak bekerja');

// ---------- latihan bebas ----------
{
  let seed = 42;
  const rng = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const pilih = ['(', ')', ';'];
  const hasil = buatLatihanBebas(pilih, 8, rng);
  if (hasil.length !== 8) gagal(`latihan bebas harus 8 baris (dapat ${hasil.length})`);
  for (const b of hasil) {
    if (!b || b.length > 40) gagal(`latihan bebas: baris tidak wajar "${b}"`);
    for (const c of b) {
      if (!bisaDiketik(c)) gagal(`latihan bebas: karakter tak bisa diketik "${c}"`);
      if (/[^a-z ]/.test(c) && !pilih.includes(c)) gagal(`latihan bebas: simbol di luar pilihan "${c}"`);
    }
  }
  if (buatLatihanBebas([], 5).length !== 0) gagal('latihan bebas tanpa simbol harus kosong');
  if (buatLatihanBebas(['a', '1', ' '], 5).length !== 0) gagal('huruf/angka/spasi bukan simbol latihan bebas');
}
if (tahapBerikutnya(semuaTahap.at(-1).id) !== null) gagal('tahap terakhir seharusnya tidak punya tahap berikutnya');

const jumlahBaris = semuaTahap.reduce((a, t) => a + t.baris.length, 0);
console.log(`${galat === 0 ? '✅' : '⚠️'} ${JALUR.length} jalur, ${semuaTahap.length} tahap, ${jumlahBaris} baris latihan, ${galat} masalah`);
process.exit(galat === 0 ? 0 : 1);
