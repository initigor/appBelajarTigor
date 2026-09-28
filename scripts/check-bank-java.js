// Cek cepat: semua soal "prediksi-output" di bank Uji Pemahaman harus bisa dikompilasi & dijalankan tanpa galat.
import { jalankanUji, statusJdk } from '../server/javaRunner.js';
import { bankSoalPekan } from '../src/lessonsJava/_bersama/bank.js';

const status = await statusJdk();
if (!status.tersedia) {
  console.log('JDK tidak tersedia.');
  process.exit(1);
}

let gagal = 0;
let total = 0;
for (const [pekan, bank] of Object.entries(bankSoalPekan)) {
  for (const [lessonId, soalList] of Object.entries(bank)) {
    for (const s of soalList) {
      if (s.tipe !== 'prediksi-output') continue;
      total++;
      const kelasUtama = s.kelasUtama ?? 'Main';
      const r = await jalankanUji({ berkas: [{ nama: `${kelasUtama}.java`, isi: s.kode }], kelasUtama, kasus: [{ nama: 'x', stdin: '' }] });
      if (r.fase !== 'eksekusi' || !r.hasil[0].berhasilJalan) {
        gagal++;
        console.log(`❌ pekan ${pekan} / ${lessonId} / ${s.id}: ${r.fase} ${r.stderr ?? r.hasil?.[0]?.stderr ?? r.pesan ?? ''}`);
      } else {
        console.log(`✅ ${s.id} -> ${JSON.stringify(r.hasil[0].stdout)}`);
      }
    }
  }
}
console.log(`\n${total - gagal}/${total} soal prediksi-output OK.`);
process.exit(gagal ? 1 : 0);
