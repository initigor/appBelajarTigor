import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daftarChapter, semuaPelajaran } from '../lessons/index.js';
import { daftarChapterJava } from '../lessonsJava/index.js';
import { useProgress } from '../state/progress.jsx';
import { useProgressJava } from '../state/progressJava.jsx';
import ChapterCard from '../components/ChapterCard.jsx';
import BannerInstall from '../components/BannerInstall.jsx';

const KUNCI_TERBUKA = 'latihkode:chapter-terbuka:v1';
const KUNCI_TERBUKA_JAVA = 'latihkode:java:chapter-terbuka:v1';

/** Chapter mana saja yang kotaknya sedang terbuka di Beranda (disimpan di perangkat ini saja). */
function muatChapterTerbuka(kunci, idDefault) {
  try {
    const raw = localStorage.getItem(kunci);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    /* penyimpanan diblokir/rusak: pakai default */
  }
  return new Set(idDefault ? [idDefault] : []);
}

function useChapterTerbuka(kunci, idDefault) {
  const [terbuka, setTerbuka] = useState(() => muatChapterTerbuka(kunci, idDefault));
  useEffect(() => {
    try {
      localStorage.setItem(kunci, JSON.stringify([...terbuka]));
    } catch {
      /* penyimpanan penuh/diblokir: abaikan */
    }
  }, [kunci, terbuka]);
  const toggle = (id) =>
    setTerbuka((s) => {
      const baru = new Set(s);
      if (baru.has(id)) baru.delete(id);
      else baru.add(id);
      return baru;
    });
  return [terbuka, toggle];
}

export default function Beranda() {
  const { totalXp, streak, jumlahSelesai, berikutnya, isSelesai } = useProgress();
  const progJava = useProgressJava();
  const total = semuaPelajaran.length;
  const totalXpMaks = semuaPelajaran.reduce((a, p) => a + p.xp, 0);

  // Tiap chapter adalah "container" sendiri: bisa dibuka/tutup, dan sekali dibuka posisinya diingat.
  const [terbuka, toggleChapter] = useChapterTerbuka(KUNCI_TERBUKA, berikutnya?.chapterId ?? daftarChapter.find((c) => c.pelajaran.length > 0)?.id);
  const [terbukaJava, toggleChapterJava] = useChapterTerbuka(KUNCI_TERBUKA_JAVA, null);

  const totalJava = daftarChapterJava.reduce((a, c) => a + c.pelajaran.length, 0);
  const selesaiJava = daftarChapterJava.reduce((a, c) => a + c.pelajaran.filter((p) => progJava.isSelesai(p.id)).length, 0);

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
        {daftarChapter.map((c) => (
          <ChapterCard
            key={c.id}
            chapter={c}
            buka={terbuka.has(c.id)}
            onToggle={() => toggleChapter(c.id)}
            basePath="/belajar"
            isSelesai={isSelesai}
            berikutnyaId={berikutnya?.id}
            labelNomor={`Chapter ${c.id}`}
          />
        ))}
      </section>

      <section className="pemisah-jalur">
        <span className="pemisah-garis" />
        <h2>
          ☕ Jalur terpisah: Java — PBO
        </h2>
        <p className="teks-redup">
          Course sendiri, tidak bercampur dengan materi JavaScript di atas — kode Java dijalankan sungguhan di komputermu (butuh JDK
          terpasang).
        </p>
      </section>

      <div className="statistik statistik-java">
        <div className="stat">
          <span className="stat-angka">⚡ {progJava.totalXp}</span>
          <span className="stat-label">XP Java</span>
        </div>
        <div className="stat">
          <span className="stat-angka">
            ✅ {selesaiJava}/{totalJava}
          </span>
          <span className="stat-label">pelajaran Java</span>
        </div>
      </div>

      <section className="peta">
        {daftarChapterJava.map((c) => (
          <ChapterCard
            key={c.id}
            chapter={c}
            buka={terbukaJava.has(c.id)}
            onToggle={() => toggleChapterJava(c.id)}
            basePath="/java/belajar"
            isSelesai={progJava.isSelesai}
            isRemedial={(id) => progJava.isRemedial(c.id, id)}
            renderIsi={progJava.jalurPekan(c.id) === null ? () => <PilihJalurJava chapter={c} progJava={progJava} /> : undefined}
            footerIsi={
              c.id === 3 && progJava.jalurPekan(c.id) !== null ? (
                <Link className="tombol tombol-kedua kecil tombol-v3" to="/java/uji/3?v3=1">
                  🎯 Latihan V-3 (persiapan verifikasi di kelas)
                </Link>
              ) : undefined
            }
          />
        ))}
      </section>
    </main>
  );
}

function PilihJalurJava({ chapter, progJava }) {
  return (
    <div className="pilihan-jalur pilihan-jalur-kecil">
      <p className="teks-redup">Sudah menguasai materi ini di kelas, atau mau belajar dari awal?</p>
      <div className="tombol-jalur-baris">
        <Link className="tombol tombol-kedua" to={`/java/uji/${chapter.id}`} onClick={() => progJava.pilihJalur(chapter.id, 'uji')}>
          ✅ Uji Pemahaman
        </Link>
        <Link className="tombol" to={`/java/belajar/${chapter.pelajaran[0]?.id}`} onClick={() => progJava.pilihJalur(chapter.id, 'belajar')}>
          📖 Belajar dari awal
        </Link>
      </div>
    </div>
  );
}
