import { Link } from 'react-router-dom';
import { daftarChapter, semuaPelajaran } from '../lessons/index.js';
import { useProgress } from '../state/progress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import BannerInstall from '../components/BannerInstall.jsx';

export default function Beranda() {
  const { totalXp, streak, jumlahSelesai, berikutnya, isSelesai } = useProgress();
  const total = semuaPelajaran.length;
  const totalXpMaks = semuaPelajaran.reduce((a, p) => a + p.xp, 0);

  return (
    <main className="halaman">
      <section className="hero">
        <div>
          <p className="hero-kecil">Jalur belajar</p>
          <h1>
            JavaScript <span className="panah">→</span> React
          </h1>
          <p className="hero-deskripsi">
            Dari <code>console.log</code> sampai web portofolio dengan React. Setiap konsep dibandingkan dengan C dan
            Python yang sudah kamu kuasai.
          </p>
          {berikutnya ? (
            <Link className="tombol tombol-besar" to={`/belajar/${berikutnya.id}`}>
              {jumlahSelesai === 0 ? 'Mulai belajar' : 'Lanjutkan belajar'} → {berikutnya.judul}
            </Link>
          ) : (
            <p className="selamat">🎉 Semua pelajaran selesai. Keren!</p>
          )}
        </div>
        <div className="statistik">
          <div className="stat">
            <span className="stat-angka">⚡ {totalXp}</span>
            <span className="stat-label">dari {totalXpMaks} XP</span>
          </div>
          <div className="stat">
            <span className="stat-angka">🔥 {streak}</span>
            <span className="stat-label">hari beruntun</span>
          </div>
          <div className="stat">
            <span className="stat-angka">
              ✅ {jumlahSelesai}/{total}
            </span>
            <span className="stat-label">pelajaran</span>
          </div>
        </div>
      </section>

      <BannerInstall />

      <section className="peta">
        {daftarChapter.map((c) => {
          const n = c.pelajaran.length;
          const selesai = c.pelajaran.filter((p) => isSelesai(p.id)).length;
          const tuntas = n > 0 && selesai === n;
          return (
            <article key={c.id} className={`chapter ${tuntas ? 'chapter-tuntas' : ''} ${n === 0 ? 'chapter-kosong' : ''}`}>
              <div className="chapter-kepala">
                <div className="chapter-ikon">{c.ikon}</div>
                <div className="chapter-info">
                  <p className="chapter-nomor">Chapter {c.id}</p>
                  <h2>{c.judul}</h2>
                  <p className="chapter-deskripsi">{c.deskripsi}</p>
                </div>
                <div className="chapter-skor">
                  {selesai}/{n}
                </div>
              </div>
              <ProgressBar nilai={n ? selesai / n : 0} />
              {n === 0 ? (
                <p className="teks-redup">Belum ada pelajaran di chapter ini.</p>
              ) : (
                <ol className="daftar-pelajaran">
                  {c.pelajaran.map((p) => {
                    const done = isSelesai(p.id);
                    const next = berikutnya?.id === p.id;
                    return (
                      <li key={p.id}>
                        <Link to={`/belajar/${p.id}`} className={`item-pelajaran ${done ? 'done' : ''} ${next ? 'next' : ''}`}>
                          <span className="bulatan">{done ? '✓' : next ? '▶' : ''}</span>
                          <span className="item-judul">{p.judul}</span>
                          {p.proyek && <span className="label-proyek">proyek</span>}
                          <span className="item-xp">{p.xp} XP</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
