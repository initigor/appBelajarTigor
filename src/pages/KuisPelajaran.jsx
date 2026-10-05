import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { daftarChapter, pelajaranById } from '../lessons/index.js';
import { kuisById } from '../kuis/index.js';
import { useProgress } from '../state/progress.jsx';
import Markdown from '../components/Markdown.jsx';

/** Teks biasa dengan `kode` inline diubah menjadi <code>, dan **tebal** menjadi <b>. */
function TeksInline({ teks }) {
  return teks.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((bagian, i) => {
    if (bagian.length > 2 && bagian.startsWith('`') && bagian.endsWith('`')) return <code key={i}>{bagian.slice(1, -1)}</code>;
    if (bagian.length > 4 && bagian.startsWith('**') && bagian.endsWith('**')) return <b key={i}>{bagian.slice(2, -2)}</b>;
    return <span key={i}>{bagian}</span>;
  });
}

/** Acak urutan pilihan (Fisher–Yates) supaya posisi jawaban benar tidak bisa dihafal. */
function siapkanSoal(kuis) {
  return kuis.soal.map((s) => {
    const opsi = [{ teks: s.benar, benar: true }, ...s.salah.map((teks) => ({ teks, benar: false }))];
    for (let i = opsi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opsi[i], opsi[j]] = [opsi[j], opsi[i]];
    }
    return { tanya: s.tanya, jelas: s.jelas, opsi };
  });
}

export default function KuisPelajaran() {
  const { id } = useParams();
  const pelajaran = pelajaranById[id];
  const kuis = kuisById[id];
  if (!pelajaran || !kuis) {
    return (
      <main className="halaman sempit">
        <h1>Kuis tidak ditemukan 🤔</h1>
        <p className="teks-redup">Pelajaran ini belum punya rangkuman & kuis.</p>
        <Link className="tombol" to="/">
          ← Kembali ke beranda
        </Link>
      </main>
    );
  }
  return <IsiKuis key={id} pelajaran={pelajaran} kuis={kuis} />;
}

function IsiKuis({ pelajaran, kuis }) {
  const prog = useProgress();
  const chapter = daftarChapter.find((c) => c.id === pelajaran.chapterId);
  const status = prog.data.kuis?.[pelajaran.id];

  const [fase, setFase] = useState('rangkuman'); // 'rangkuman' | 'kuis' | 'hasil'
  const [soal, setSoal] = useState(() => siapkanSoal(kuis));
  const [indeks, setIndeks] = useState(0);
  const [pilihan, setPilihan] = useState(null); // indeks opsi yang dipilih untuk soal saat ini
  const [jawaban, setJawaban] = useState([]); // pilihan tiap soal yang sudah dijawab

  const mulai = () => {
    setSoal(siapkanSoal(kuis));
    setIndeks(0);
    setPilihan(null);
    setJawaban([]);
    setFase('kuis');
    window.scrollTo(0, 0);
  };

  const lanjut = () => {
    const baru = [...jawaban, pilihan];
    if (indeks < soal.length - 1) {
      setJawaban(baru);
      setIndeks(indeks + 1);
      setPilihan(null);
      window.scrollTo(0, 0);
      return;
    }
    setJawaban(baru);
    const benar = baru.filter((p, i) => soal[i].opsi[p].benar).length;
    prog.terapkanHasilKuis(pelajaran.id, Math.round((benar / soal.length) * 100));
    setFase('hasil');
    window.scrollTo(0, 0);
  };

  const kembali = (
    <Link to={`/belajar/${pelajaran.id}`} className="link-kecil">
      ← Pelajaran
    </Link>
  );
  const kepala = (
    <div className="bar-pelajaran kuis-bar">
      {kembali}
      <span className="breadcrumb">
        {chapter?.ikon} {pelajaran.judul}
      </span>
      {status ? <span className="chip chip-lulus">🧠 terbaik {status.terbaik}%</span> : <span className="chip">🧠 Kuis</span>}
    </div>
  );

  // ---------- Rangkuman ----------
  if (fase === 'rangkuman') {
    return (
      <main className="halaman sempit kuis-halaman">
        {kepala}
        <p className="hero-kecil">Langkah 1 dari 2 · Rangkuman</p>
        <h1>📌 {pelajaran.judul}</h1>

        <section className="kuis-intisari">
          <b>Kesimpulan</b>
          <p>
            <TeksInline teks={kuis.intisari} />
          </p>
        </section>

        <section className="kartu-setelan">
          <h2>Yang harus kamu ingat</h2>
          <ul className="kuis-rangkuman">
            {kuis.rangkuman.map((r, i) => (
              <li key={i}>
                <TeksInline teks={r} />
              </li>
            ))}
          </ul>
        </section>

        <p className="teks-redup kuis-tips">
          💡 Baca pelan-pelan, lalu coba jelaskan ulang dengan kata-katamu sendiri sebelum lanjut. Mengingat tanpa melihat itulah yang membuat materi menetap, bukan sekadar menyalin
          sintaks.
        </p>

        <div className="baris-tombol">
          <button className="tombol tombol-besar" onClick={mulai}>
            ✍️ Mulai kuis ({kuis.soal.length} soal) →
          </button>
          <Link className="tombol tombol-kedua tombol-besar" to={`/belajar/${pelajaran.id}`}>
            Kembali ke pelajaran
          </Link>
        </div>
      </main>
    );
  }

  // ---------- Pengerjaan ----------
  if (fase === 'kuis') {
    const s = soal[indeks];
    const terjawab = pilihan !== null;
    const benar = terjawab && s.opsi[pilihan].benar;
    return (
      <main className="halaman sempit kuis-halaman">
        {kepala}
        <p className="hero-kecil">
          Langkah 2 dari 2 · Soal {indeks + 1} dari {soal.length}
        </p>
        <div className="kuis-titik" aria-hidden="true">
          {soal.map((_, i) => (
            <span key={i} className={i < indeks ? 'selesai' : i === indeks ? 'aktif' : ''} />
          ))}
        </div>

        <section className="kartu-soal kuis-soal">
          <Markdown>{s.tanya}</Markdown>
          <div className="kuis-opsi" role="group" aria-label="Pilihan jawaban">
            {s.opsi.map((o, i) => {
              let kelas = 'kuis-pilihan';
              if (terjawab) {
                if (o.benar) kelas += ' benar';
                else if (i === pilihan) kelas += ' salah';
                else kelas += ' redup';
              }
              return (
                <button key={i} className={kelas} disabled={terjawab} onClick={() => setPilihan(i)}>
                  <span className="kuis-huruf">{terjawab ? (o.benar ? '✓' : i === pilihan ? '✕' : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}</span>
                  <span className="kuis-teks">
                    <TeksInline teks={o.teks} />
                  </span>
                </button>
              );
            })}
          </div>

          {terjawab && (
            <div className={`kuis-umpan ${benar ? 'benar' : 'salah'}`} role="status">
              <b>{benar ? '✅ Tepat!' : '❌ Belum tepat.'}</b>
              <div className="kuis-jelas">
                <Markdown>{s.jelas}</Markdown>
              </div>
            </div>
          )}
        </section>

        <div className="baris-tombol">
          <button className="tombol tombol-besar" disabled={!terjawab} onClick={lanjut}>
            {indeks < soal.length - 1 ? 'Soal berikutnya →' : 'Lihat hasil 🏁'}
          </button>
        </div>
      </main>
    );
  }

  // ---------- Hasil ----------
  const salah = soal.map((s, i) => ({ s, i, p: jawaban[i] })).filter(({ s, p }) => !s.opsi[p].benar);
  const jumlahBenar = soal.length - salah.length;
  const persen = Math.round((jumlahBenar / soal.length) * 100);
  const sempurna = salah.length === 0;
  const berikutnya = pelajaran.sesudah ? pelajaranById[pelajaran.sesudah] : null;

  return (
    <main className="halaman sempit kuis-halaman">
      {kepala}
      <h1>{sempurna ? '🎉 Sempurna!' : persen >= 60 ? '👍 Lumayan, tinggal diperkuat' : '📚 Yuk baca rangkumannya lagi'}</h1>

      <section className={`kartu-skor ${sempurna ? 'lulus' : 'belum'}`}>
        <div className="skor-besar">{persen}%</div>
        <div className="skor-info">
          <div>
            <b>
              {jumlahBenar} dari {soal.length} soal benar
            </b>
          </div>
          <div className="teks-redup">{status && status.terbaik > persen ? `Skor terbaikmu ${status.terbaik}%` : 'Kuis boleh diulang sebanyak yang kamu mau (soalnya diacak pilihannya).'}</div>
        </div>
      </section>

      {salah.length > 0 && (
        <section className="tinjauan-soal">
          <h2>Yang masih keliru ({salah.length})</h2>
          {salah.map(({ s, i, p }) => (
            <article key={i} className="tinjauan-item">
              <Markdown>{s.tanya}</Markdown>
              <p className="jawaban-salah">
                ❌ Jawabanmu: <TeksInline teks={s.opsi[p].teks} />
              </p>
              <p className="jawaban-benar">
                ✅ Yang benar: <TeksInline teks={s.opsi.find((o) => o.benar).teks} />
              </p>
              <div className="kotak-petunjuk">
                <b>Kenapa:</b> <Markdown>{s.jelas}</Markdown>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="baris-tombol">
        <button className="tombol tombol-besar" onClick={mulai}>
          🔁 Ulangi kuis
        </button>
        <button className="tombol tombol-kedua tombol-besar" onClick={() => setFase('rangkuman')}>
          📌 Baca rangkuman
        </button>
      </div>
      <div className="baris-tombol kuis-lanjut">
        {berikutnya ? (
          <Link className="tombol tombol-lanjut tombol-besar" to={`/belajar/${berikutnya.id}`}>
            Lanjut: {berikutnya.judul} →
          </Link>
        ) : (
          <Link className="tombol tombol-lanjut tombol-besar" to="/">
            Ke beranda →
          </Link>
        )}
      </div>
    </main>
  );
}
