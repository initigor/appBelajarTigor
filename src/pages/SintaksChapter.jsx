import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { daftarChapter } from '../lessons/index.js';
import { dataSintaks } from '../lessons/sintaks.js';
import { daftarChapterJava } from '../lessonsJava/index.js';
import '../sintaks.css';

// Dua jalur belajar punya daftar chapter & data sintaks sendiri-sendiri.
const JALUR = {
  js: {
    label: 'JavaScript → React',
    chapters: daftarChapter,
    data: dataSintaks.js,
    basePath: '/sintaks',
    labelNomor: (c) => `Chapter ${c.id}`,
    bahasa: 'JavaScript',
  },
  java: {
    label: 'Java — PBO',
    chapters: daftarChapterJava,
    data: dataSintaks.java,
    basePath: '/java/sintaks',
    labelNomor: (c) => `Pekan ${c.id}`,
    bahasa: 'Java',
  },
};

function SalinKode({ teks }) {
  const [tersalin, setTersalin] = useState(false);
  const salin = async () => {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1400);
    } catch {
      /* clipboard diblokir: abaikan, kodenya tetap bisa diseleksi manual */
    }
  };
  return (
    <button type="button" className="sintaks-salin" onClick={salin} aria-label="Salin sintaks" title="Salin sintaks">
      {tersalin ? '✓' : '⧉'}
    </button>
  );
}

export default function SintaksChapter({ jalur }) {
  const { id } = useParams();
  const konfig = JALUR[jalur];
  const chapter = konfig.chapters.find((c) => String(c.id) === id);
  const grup = chapter ? konfig.data[chapter.id] : undefined;
  const [kata, setKata] = useState('');

  const hasil = useMemo(() => {
    if (!grup) return [];
    const k = kata.trim().toLowerCase();
    if (!k) return grup;
    return grup
      .map((g) => ({ ...g, butir: g.butir.filter((b) => b.join(' ').toLowerCase().includes(k)) }))
      .filter((g) => g.butir.length > 0);
  }, [grup, kata]);

  if (!chapter || !grup) {
    return (
      <main className="halaman sempit">
        <h1>Sintaks tidak ditemukan 🤔</h1>
        <p className="teks-redup">Chapter ini belum punya daftar sintaks penting.</p>
        <Link className="tombol" to="/">
          ← Kembali ke beranda
        </Link>
      </main>
    );
  }

  const total = grup.reduce((a, g) => a + g.butir.length, 0);
  const tampil = hasil.reduce((a, g) => a + g.butir.length, 0);
  // Chapter sebelum/sesudah yang punya daftar sintaks, untuk navigasi cepat antar-chapter.
  const bersintaks = konfig.chapters.filter((c) => konfig.data[c.id]);
  const posisi = bersintaks.findIndex((c) => c.id === chapter.id);
  const sebelum = bersintaks[posisi - 1];
  const sesudah = bersintaks[posisi + 1];

  return (
    <main className="halaman sintaks-halaman">
      <div className="bar-pelajaran sintaks-bar">
        <Link to="/" className="link-kecil">
          ← Beranda
        </Link>
        <span className="breadcrumb">
          {chapter.ikon} {konfig.labelNomor(chapter)}: {chapter.judul}
        </span>
        <span className="chip">📌 {total} sintaks</span>
      </div>

      <p className="hero-kecil">Refresh ingatan · {konfig.label}</p>
      <h1>📌 Sintaks penting: {chapter.judul}</h1>
      <p className="teks-redup sintaks-intro">
        Rangkuman sintaks {konfig.bahasa} yang muncul di seluruh pelajaran chapter ini, lengkap dengan fungsinya. Baris{' '}
        <span className="sintaks-label-industri">💡 Praktik industri</span> berisi kebiasaan yang dipakai programmer profesional atau jebakan yang perlu diingat.
      </p>

      <div className="sintaks-cari">
        <input
          type="search"
          value={kata}
          onChange={(e) => setKata(e.target.value)}
          placeholder="Cari sintaks atau fungsi… (mis. map, async, private)"
          aria-label="Cari sintaks"
        />
        {kata.trim() && (
          <span className="teks-redup sintaks-hitung">
            {tampil} dari {total}
          </span>
        )}
      </div>

      {hasil.length === 0 ? (
        <p className="teks-redup sintaks-kosong">Tidak ada sintaks yang cocok dengan “{kata}”.</p>
      ) : (
        hasil.map((g) => (
          <section key={g.grup} className="sintaks-grup">
            <h2>{g.grup}</h2>
            <ul className="sintaks-daftar">
              {g.butir.map(([kode, fungsi, catatan]) => (
                <li key={kode} className="sintaks-butir">
                  <div className="sintaks-kode-baris">
                    <code className="sintaks-kode">{kode}</code>
                    <SalinKode teks={kode} />
                  </div>
                  <p className="sintaks-fungsi">{fungsi}</p>
                  {catatan && (
                    <p className="sintaks-catatan">
                      <span aria-hidden="true">💡</span> {catatan}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <nav className="sintaks-nav" aria-label="Chapter lain">
        {sebelum ? (
          <Link className="tombol tombol-kedua" to={`${konfig.basePath}/${sebelum.id}`}>
            ← {konfig.labelNomor(sebelum)}
          </Link>
        ) : (
          <span />
        )}
        {sesudah ? (
          <Link className="tombol tombol-kedua" to={`${konfig.basePath}/${sesudah.id}`}>
            {konfig.labelNomor(sesudah)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
