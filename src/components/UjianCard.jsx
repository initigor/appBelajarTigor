import { Link } from 'react-router-dom';
import { daftarChapter } from '../lessons/index.js';
import { ringkasKomposisi } from '../ujian/susun.js';

/** "Chapter 1–3" untuk rentang berurutan, atau "Chapter 1, 4" jika tidak berurutan. */
export function labelRentang(ids) {
  if (ids.length === 1) return `Chapter ${ids[0]}`;
  const urut = [...ids].sort((a, b) => a - b);
  const berurutan = urut.every((n, i) => i === 0 || n === urut[i - 1] + 1);
  return berurutan ? `Chapter ${urut[0]}–${urut.at(-1)}` : `Chapter ${urut.join(', ')}`;
}

/**
 * Kartu ujian di Beranda, ditempatkan setelah chapter terakhir yang diujikan.
 * `status` = data hasil ujian dari progress ({ terbaik, lulus, percobaan, ... }) atau undefined.
 */
export default function UjianCard({ ujian, status, isSelesai }) {
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
        <div className="ujian-status">{chip}</div>
      </div>
      <Link className={`tombol ${status?.lulus ? 'tombol-kedua' : ''}`} to={`/ujian/${ujian.id}`}>
        {teksTombol} →
      </Link>
    </article>
  );
}
