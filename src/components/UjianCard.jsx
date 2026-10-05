import { Link } from 'react-router-dom';
import { daftarChapter } from '../lessons/index.js';
import { ringkasKomposisi } from '../ujian/susun.js';

/** "Chapter 1–3" untuk rentang berurutan, atau "Chapter 1, 4" jika tidak berurutan ("Bab ..." untuk Arsikom). */
export function labelRentang(ids) {
  const urut = [...ids].sort((a, b) => a - b).map((id) => daftarChapter.find((c) => c.id === id) ?? { id });
  const awalan = urut[0].awalan ?? 'Chapter';
  const nomor = urut.map((c) => c.nomor ?? c.id);
  if (nomor.length === 1) return `${awalan} ${nomor[0]}`;
  const berurutan = nomor.every((n, i) => i === 0 || n === nomor[i - 1] + 1);
  return berurutan ? `${awalan} ${nomor[0]}–${nomor.at(-1)}` : `${awalan} ${nomor.join(', ')}`;
}

/**
 * Kartu ujian di Beranda, ditempatkan setelah chapter terakhir yang diujikan.
 * `status` = data hasil ujian dari progress ({ terbaik, lulus, percobaan, ... }) atau undefined.
 */
export default function UjianCard({ ujian, status, isSelesai, jumlahRiwayat = 0 }) {
  const pelajaran = ujian.chapterIds.flatMap((id) => daftarChapter.find((c) => c.id === id)?.pelajaran ?? []);
  const selesai = pelajaran.filter((p) => isSelesai(p.id)).length;
  const siap = pelajaran.length > 0 && selesai === pelajaran.length;
  const komp = ringkasKomposisi(ujian);

  let chip;
  if (status?.lulus) chip = <span className="chip chip-lulus">✅ Lulus · terbaik {status.terbaik}%</span>;
  else if (status?.percobaan) chip = <span className="chip chip-belum">🔁 Belum lulus · terbaik {status.terbaik}%</span>;
  else if (siap) chip = <span className="chip chip-siap">🟢 Siap diuji</span>;
  else chip = <span className="chip">⏳ {selesai}/{pelajaran.length} pelajaran selesai</span>;

  const teksTombol = status?.lulus ? 'Ulangi ujian' : status?.percobaan ? 'Coba lagi' : 'Mulai ujian';

  return (
    <article className={`ujian-kartu ${status?.lulus ? 'lulus' : ''} ${siap && !status ? 'siap' : ''}`}>
      <div className="ujian-ikon">{ujian.ikon}</div>
      <div className="ujian-info">
        <p className="chapter-nomor">Ujian · {labelRentang(ujian.chapterIds)}</p>
        <h3>{ujian.judul}</h3>
        <p className="chapter-deskripsi">
          {komp.soal} soal · lulus ≥ {ujian.lulus}% · bonus +{ujian.xp} XP
        </p>
        <div className="ujian-status">
          {chip}
          {jumlahRiwayat > 0 && (
            <Link className="chip chip-tautan" to={`/riwayat?ujian=${ujian.id}`}>
              📜 Riwayat ({jumlahRiwayat})
            </Link>
          )}
        </div>
      </div>
      <Link className={`tombol ${status?.lulus ? 'tombol-kedua' : ''}`} to={`/ujian/${ujian.id}`}>
        {teksTombol} →
      </Link>
    </article>
  );
}
