import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

/**
 * Satu "container" chapter/pekan di Beranda: kotak yang bisa dibuka/tutup sendiri.
 * `renderIsi`, kalau diberikan, menggantikan daftar pelajaran bawaan (dipakai course Java untuk
 * menampilkan pilihan jalur "Uji Pemahaman" / "Belajar dari awal" sebelum daftar pelajaran muncul).
 */
export default function ChapterCard({ chapter, buka, onToggle, basePath, isSelesai, berikutnyaId, isRemedial, labelNomor, renderIsi, footerIsi }) {
  const n = chapter.pelajaran.length;
  const selesai = chapter.pelajaran.filter((p) => isSelesai(p.id)).length;
  const tuntas = n > 0 && selesai === n;

  return (
    <article className={`chapter ${tuntas ? 'chapter-tuntas' : ''} ${n === 0 ? 'chapter-kosong' : ''}`}>
      <button type="button" className="chapter-kepala" onClick={onToggle} aria-expanded={buka}>
        <div className="chapter-ikon">{chapter.ikon}</div>
        <div className="chapter-info">
          {labelNomor && <p className="chapter-nomor">{labelNomor}</p>}
          <h2>{chapter.judul}</h2>
          <p className="chapter-deskripsi">{chapter.deskripsi}</p>
        </div>
        <div className="chapter-skor">
          {selesai}/{n}
        </div>
        <span className={`chapter-panah ${buka ? 'terbuka' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <ProgressBar nilai={n ? selesai / n : 0} />
      <div className={`chapter-isi ${buka ? 'terbuka' : ''}`} inert={!buka}>
        <div className="chapter-isi-dalam">
          {renderIsi ? (
            renderIsi()
          ) : n === 0 ? (
            <p className="teks-redup">Belum ada pelajaran di chapter ini.</p>
          ) : (
            <ol className="daftar-pelajaran">
              {chapter.pelajaran.map((p) => {
                const done = isSelesai(p.id);
                const next = berikutnyaId === p.id;
                const remedial = isRemedial?.(p.id);
                return (
                  <li key={p.id}>
                    <Link to={`${basePath}/${p.id}`} className={`item-pelajaran ${done ? 'done' : ''} ${next ? 'next' : ''} ${remedial ? 'remedial' : ''}`}>
                      <span className="bulatan">{done ? '✓' : next ? '▶' : ''}</span>
                      <span className="item-judul">{p.judul}</span>
                      {remedial && <span className="label-remedial">perlu diulang</span>}
                      {p.proyek && <span className="label-proyek">proyek</span>}
                      <span className="item-xp">{p.xp} XP</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
          {footerIsi}
        </div>
      </div>
    </article>
  );
}
