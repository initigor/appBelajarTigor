import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { daftarChapter } from '../lessons/index.js';
import { labelBab } from '../lessons/chapters.js';
import { kuisById } from '../kuis/index.js';
import { useProgress } from '../state/progress.jsx';
import Markdown from '../components/Markdown.jsx';

/** Perkiraan waktu baca (menit), dari jumlah kata dengan kecepatan ±170 kata/menit (teks teknis). */
function menitBaca(materi) {
  const kata = materi.replace(/~~~[\s\S]*?~~~/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(kata / 170));
}

/** Halaman pelajaran bacaan (tipe 'teks', mis. Arsikom): materi panjang, lalu kuis yang menentukan selesainya pelajaran. */
export default function PelajaranTeks({ pelajaran }) {
  const prog = useProgress();
  const chapter = daftarChapter.find((c) => c.id === pelajaran.chapterId);
  const posisi = chapter.pelajaran.findIndex((p) => p.id === pelajaran.id) + 1;
  const selesai = prog.isSelesai(pelajaran.id);
  const statusKuis = prog.data.kuis?.[pelajaran.id];
  const punyaKuis = Boolean(kuisById[pelajaran.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pelajaran.id]);

  const sebelum = pelajaran.sebelum;
  const sesudah = pelajaran.sesudah;

  return (
    <main className="halaman baca">
      <div className="bar-pelajaran">
        <Link to="/" className="link-kecil">
          ← Beranda
        </Link>
        <span className="breadcrumb">
          {chapter.ikon} {labelBab(chapter)}: {chapter.judul} · {posisi}/{chapter.pelajaran.length}
        </span>
        <span className="nav-pelajaran">
          <Link className={`link-kecil ${sebelum ? '' : 'nonaktif'}`} to={sebelum ? `/belajar/${sebelum}` : '#'} aria-disabled={!sebelum}>
            ‹ Sebelumnya
          </Link>
          <Link className={`link-kecil ${sesudah ? '' : 'nonaktif'}`} to={sesudah ? `/belajar/${sesudah}` : '#'} aria-disabled={!sesudah}>
            Berikutnya ›
          </Link>
        </span>
      </div>

      <article className="bacaan">
        <div className="judul-pelajaran">
          <h1>{pelajaran.judul}</h1>
          <div className="label-baris">
            <span className="chip">⚡ {pelajaran.xp} XP</span>
            <span className="chip">⏱️ ±{menitBaca(pelajaran.materi)} menit baca</span>
            {selesai && <span className="chip chip-lulus">✓ Selesai</span>}
            {statusKuis && <span className="chip">🧠 kuis terbaik {statusKuis.terbaik}%</span>}
          </div>
        </div>

        <Markdown>{pelajaran.materi}</Markdown>
      </article>

      <section className="kotak-kuis-baca">
        <h2>🧠 Sudah paham? Buktikan lewat kuis</h2>
        <p className="teks-redup">
          {selesai
            ? 'Pelajaran ini sudah selesai. Kuis boleh diulang kapan saja untuk menyegarkan ingatan.'
            : `Pelajaran ini dianggap selesai (dan XP-nya masuk) saat skor kuis minimal 60%. Kuisnya diawali rangkuman, jadi sekalian untuk mengulang.`}
        </p>
        <div className="baris-tombol">
          {punyaKuis ? (
            <Link className="tombol tombol-besar" to={`/belajar/${pelajaran.id}/kuis`}>
              📝 {statusKuis ? 'Ulangi' : 'Mulai'} rangkuman & kuis →
            </Link>
          ) : (
            <p className="teks-redup">Kuis untuk pelajaran ini belum tersedia.</p>
          )}
          {sesudah ? (
            <Link className="tombol tombol-kedua tombol-besar" to={`/belajar/${sesudah}`}>
              Lewati ke pelajaran berikutnya →
            </Link>
          ) : (
            <Link className="tombol tombol-kedua tombol-besar" to="/">
              Ke beranda
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
