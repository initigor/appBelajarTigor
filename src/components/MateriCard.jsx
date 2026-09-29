import { useId } from 'react';
import ProgressBar from './ProgressBar.jsx';

/**
 * Container level atas di Beranda: satu "materi" (mis. JavaScript, React) yang berisi banyak chapter.
 * Isinya (chapter-chapter) baru terlihat setelah kotaknya diklik.
 * `meta` = teks kecil tambahan di header (mis. XP), `catatan` = keterangan di dalam kotak sebelum daftar chapter.
 */
export default function MateriCard({ materi, buka, onToggle, isSelesai, meta, catatan, children }) {
  const idIsi = useId();
  const semuaPelajaran = materi.chapters.flatMap((c) => c.pelajaran);
  const total = semuaPelajaran.length;
  const selesai = semuaPelajaran.filter((p) => isSelesai(p.id)).length;
  const chapterTuntas = materi.chapters.filter((c) => c.pelajaran.length > 0 && c.pelajaran.every((p) => isSelesai(p.id))).length;
  const tuntas = total > 0 && selesai === total;

  return (
    <section className={`materi ${buka ? 'terbuka' : ''} ${tuntas ? 'materi-tuntas' : ''}`}>
      <button type="button" className="materi-kepala" onClick={onToggle} aria-expanded={buka} aria-controls={idIsi}>
        <div className="materi-ikon">{materi.ikon}</div>
        <div className="materi-info">
          <h2>{materi.judul}</h2>
          <p className="materi-deskripsi">{materi.deskripsi}</p>
          <p className="materi-ringkas">
            <span>
              📚 {chapterTuntas}/{materi.chapters.length} chapter
            </span>
            <span>
              ✅ {selesai}/{total} pelajaran
            </span>
            {meta}
          </p>
        </div>
        <div className="materi-persen">{total ? Math.round((selesai / total) * 100) : 0}%</div>
        <span className={`chapter-panah ${buka ? 'terbuka' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <ProgressBar nilai={total ? selesai / total : 0} />
      <div id={idIsi} className={`materi-isi ${buka ? 'terbuka' : ''}`} inert={!buka}>
        <div className="materi-isi-dalam">
          {catatan && <p className="materi-catatan">{catatan}</p>}
          <div className="peta">{children}</div>
        </div>
      </div>
    </section>
  );
}
