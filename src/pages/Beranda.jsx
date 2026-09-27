import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daftarChapter, semuaPelajaran } from '../lessons/index.js';
import { useProgress } from '../state/progress.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import BannerInstall from '../components/BannerInstall.jsx';

const KUNCI_TERBUKA = 'latihkode:chapter-terbuka:v1';

/** Chapter mana saja yang kotaknya sedang terbuka di Beranda (disimpan di perangkat ini saja). */
function muatChapterTerbuka(idDefault) {
  try {
    const raw = localStorage.getItem(KUNCI_TERBUKA);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    /* penyimpanan diblokir/rusak: pakai default */
  }
  return new Set(idDefault ? [idDefault] : []);
}

export default function Beranda() {
  const { totalXp, streak, jumlahSelesai, berikutnya, isSelesai } = useProgress();
  const total = semuaPelajaran.length;
  const totalXpMaks = semuaPelajaran.reduce((a, p) => a + p.xp, 0);

  // Tiap chapter adalah "container" sendiri: bisa dibuka/tutup, dan sekali dibuka posisinya diingat.
  const [terbuka, setTerbuka] = useState(() =>
    muatChapterTerbuka(berikutnya?.chapterId ?? daftarChapter.find((c) => c.pelajaran.length > 0)?.id),
  );
  useEffect(() => {
    try {
      localStorage.setItem(KUNCI_TERBUKA, JSON.stringify([...terbuka]));
    } catch {
      /* penyimpanan penuh/diblokir: abaikan */
    }
  }, [terbuka]);
  const toggleChapter = (id) =>
    setTerbuka((s) => {
      const baru = new Set(s);
      if (baru.has(id)) baru.delete(id);
      else baru.add(id);
      return baru;
    });

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
          const buka = terbuka.has(c.id);
          return (
            <article key={c.id} className={`chapter ${tuntas ? 'chapter-tuntas' : ''} ${n === 0 ? 'chapter-kosong' : ''}`}>
              <button type="button" className="chapter-kepala" onClick={() => toggleChapter(c.id)} aria-expanded={buka}>
                <div className="chapter-ikon">{c.ikon}</div>
                <div className="chapter-info">
                  <p className="chapter-nomor">Chapter {c.id}</p>
                  <h2>{c.judul}</h2>
                  <p className="chapter-deskripsi">{c.deskripsi}</p>
                </div>
                <div className="chapter-skor">
                  {selesai}/{n}
                </div>
                <span className={`chapter-panah ${buka ? 'terbuka' : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>
              <ProgressBar nilai={n ? selesai / n : 0} />
              <div className={`chapter-isi ${buka ? 'terbuka' : ''}`}>
                <div className="chapter-isi-dalam">
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
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
