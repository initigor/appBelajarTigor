import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { daftarChapter, semuaPelajaran } from '../lessons/index.js';
import { daftarMateriJs, susunMateri } from '../lessons/materi.js';
import { daftarChapterJava } from '../lessonsJava/index.js';
import { daftarUjian } from '../ujian/index.js';
import { useProgress } from '../state/progress.jsx';
import { useProgressJava } from '../state/progressJava.jsx';
import ChapterCard from '../components/ChapterCard.jsx';
import MateriCard from '../components/MateriCard.jsx';
import UjianCard from '../components/UjianCard.jsx';
import BannerInstall from '../components/BannerInstall.jsx';

const KUNCI_TERBUKA = 'latihkode:chapter-terbuka:v1';
const KUNCI_TERBUKA_JAVA = 'latihkode:java:chapter-terbuka:v1';
const KUNCI_MATERI_TERBUKA = 'latihkode:materi-terbuka:v1';

/** Set id yang kotaknya sedang terbuka di Beranda (disimpan di perangkat ini saja). */
function muatTerbuka(kunci, idDefault) {
  try {
    const raw = localStorage.getItem(kunci);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    /* penyimpanan diblokir/rusak: pakai default */
  }
  return new Set(idDefault ? [idDefault] : []);
}

function useTerbuka(kunci, idDefault) {
  const [terbuka, setTerbuka] = useState(() => muatTerbuka(kunci, idDefault));
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
  const { data, totalXp, streak, jumlahSelesai, berikutnya, isSelesai } = useProgress();
  const progJava = useProgressJava();
  const total = semuaPelajaran.length;
  // XP maksimum = semua pelajaran + bonus semua ujian.
  const totalXpMaks = semuaPelajaran.reduce((a, p) => a + p.xp, 0) + daftarUjian.reduce((a, u) => a + u.xp, 0);

  // Dua tingkat container: materi (JavaScript, React, ...) berisi chapter, dan tiap chapter berisi pelajaran.
  // Keduanya bisa dibuka/tutup, dan posisi terakhirnya diingat. Awalnya hanya materi & chapter tempat
  // pelajaran berikutnya yang terbuka, supaya Beranda tidak panjang.
  const daftarMateri = useMemo(() => susunMateri(daftarMateriJs, daftarChapter), []);
  const chapterAwal = berikutnya?.chapterId ?? daftarChapter.find((c) => c.pelajaran.length > 0)?.id;
  const materiAwal = daftarMateri.find((m) => m.chapters.some((c) => c.id === chapterAwal))?.id ?? daftarMateri[0]?.id;
  const [materiTerbuka, toggleMateri] = useTerbuka(KUNCI_MATERI_TERBUKA, materiAwal);
  const [terbuka, toggleChapter] = useTerbuka(KUNCI_TERBUKA, chapterAwal);
  const [terbukaJava, toggleChapterJava] = useTerbuka(KUNCI_TERBUKA_JAVA, null);

  const totalJava = daftarChapterJava.reduce((a, c) => a + c.pelajaran.length, 0);
  const materiJava = {
    id: 'java',
    judul: 'Java: Pemrograman Berorientasi Objek',
    ikon: '☕',
    deskripsi: 'Course terpisah dari JavaScript, disusun per pekan.',
    chapters: daftarChapterJava,
  };

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

      <div className="daftar-materi">
        {daftarMateri.map((m) => {
          const ujianMateri = daftarUjian.filter((u) => m.chapters.some((c) => c.id === u.setelahChapter));
          const ujianLulus = ujianMateri.filter((u) => data.ujian?.[u.id]?.lulus).length;
          return (
          <MateriCard
            key={m.id}
            materi={m}
            buka={materiTerbuka.has(m.id)}
            onToggle={() => toggleMateri(m.id)}
            isSelesai={isSelesai}
            meta={
              ujianMateri.length > 0 ? (
                <span>
                  📝 {ujianLulus}/{ujianMateri.length} ujian lulus
                </span>
              ) : undefined
            }
          >
            {m.chapters.map((c) => (
              <Fragment key={c.id}>
                <ChapterCard
                  chapter={c}
                  buka={terbuka.has(c.id)}
                  onToggle={() => toggleChapter(c.id)}
                  basePath="/belajar"
                  isSelesai={isSelesai}
                  berikutnyaId={berikutnya?.id}
                  labelNomor={`Chapter ${c.id}`}
                />
                {/* Ujian muncul tepat setelah chapter terakhir yang diujikan */}
                {daftarUjian
                  .filter((u) => u.setelahChapter === c.id)
                  .map((u) => (
                    <UjianCard key={u.id} ujian={u} status={data.ujian?.[u.id]} isSelesai={isSelesai} />
                  ))}
              </Fragment>
            ))}
          </MateriCard>
          );
        })}

        {totalJava > 0 && (
          <MateriCard
            materi={materiJava}
            buka={materiTerbuka.has('java')}
            onToggle={() => toggleMateri('java')}
            isSelesai={progJava.isSelesai}
            meta={<span>⚡ {progJava.totalXp} XP</span>}
            catatan="Kode Java dijalankan sungguhan di komputermu, jadi butuh JDK terpasang. Progress & XP Java terpisah dari JavaScript."
          >
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
          </MateriCard>
        )}
      </div>
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
