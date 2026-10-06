import { useState } from 'react';
import { Link } from 'react-router-dom';
import Markdown from './Markdown.jsx';

// Mode baca untuk pelajaran Java saat JDK tidak tersedia (mis. situs dibuka dari Vercel, HP, atau iPad).
// Materi, tugas, petunjuk, kode, dan solusi tetap bisa dipelajari; kode dicoba di online compiler.
// Progress & XP tidak dicatat karena kodenya tidak dijalankan/diperiksa di sini.

const COMPILER_ONLINE = [
  { nama: 'OneCompiler', url: 'https://onecompiler.com/java' },
  { nama: 'Programiz', url: 'https://www.programiz.com/java-programming/online-compiler/' },
  { nama: 'JDoodle', url: 'https://www.jdoodle.com/online-java-compiler' },
];

/** Salin teks ke clipboard (dengan cadangan untuk browser yang membatasi Clipboard API). */
async function salin(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = teks;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Kumpulan berkas yang relevan untuk dicoba: kode awal / cuplikan / kode bermasalah. */
function berkasLatihan(p) {
  if (Array.isArray(p.kodeAwal)) return p.kodeAwal;
  if (Array.isArray(p.kodeBermasalah)) return p.kodeBermasalah;
  if (typeof p.kodeCuplikan === 'string') return [{ nama: `${p.kelasUtamaCuplikan ?? 'Main'}.java`, isi: p.kodeCuplikan }];
  return [];
}

function BlokBerkas({ berkas }) {
  const [status, setStatus] = useState('');
  const klik = async () => {
    setStatus((await salin(berkas.isi)) ? 'Tersalin ✓' : 'Gagal menyalin');
    setTimeout(() => setStatus(''), 2000);
  };
  return (
    <div className="berkas-baca">
      <div className="berkas-baca-kepala">
        <code>{berkas.nama}</code>
        <button type="button" className="tombol tombol-kedua kecil" onClick={klik}>
          📋 {status || 'Salin kode'}
        </button>
      </div>
      <Markdown>{`~~~java\n${berkas.isi.replace(/\n$/, '')}\n~~~`}</Markdown>
    </div>
  );
}

function PertanyaanLatihan({ judul, teks, pilihan }) {
  const [dipilih, setDipilih] = useState(null);
  return (
    <div className="pertanyaan-diagram">
      {judul && (
        <p>
          <b>{judul}</b>
        </p>
      )}
      {teks && <Markdown>{teks}</Markdown>}
      <div className="pilihan-ganda">
        {pilihan.map((p, i) => (
          <label key={i} className={`pilihan-item ${dipilih === i ? 'dipilih' : ''}`}>
            <input type="radio" checked={dipilih === i} onChange={() => setDipilih(i)} />
            {p.teks}
          </label>
        ))}
      </div>
      {dipilih !== null && (
        <p className={pilihan[dipilih].benar ? 'jawaban-benar' : 'jawaban-salah'}>
          {pilihan[dipilih].benar ? '✅ Tepat!' : `❌ Belum tepat. Yang benar: ${pilihan.find((x) => x.benar)?.teks}`}
        </p>
      )}
    </div>
  );
}

export default function ModeBacaJava({ pelajaran, chapter, posisi }) {
  const [jumlahPetunjuk, setJumlahPetunjuk] = useState(0);
  const berkas = berkasLatihan(pelajaran);
  const solusi = Array.isArray(pelajaran.solusi) ? pelajaran.solusi : [];
  const pertanyaanDiagram = pelajaran.subtipe === 'diagram-memori' ? pelajaran.pertanyaan : [];

  return (
    <main className="halaman baca">
      <div className="bar-pelajaran">
        <Link to="/" className="link-kecil">
          ← Beranda
        </Link>
        <span className="breadcrumb">
          {chapter.ikon} {chapter.judul} · {posisi}/{chapter.pelajaran.length}
        </span>
        <span className="nav-pelajaran">
          <Link className={`link-kecil ${pelajaran.sebelum ? '' : 'nonaktif'}`} to={pelajaran.sebelum ? `/java/belajar/${pelajaran.sebelum}` : '#'} aria-disabled={!pelajaran.sebelum}>
            ‹ Sebelumnya
          </Link>
          <Link className={`link-kecil ${pelajaran.sesudah ? '' : 'nonaktif'}`} to={pelajaran.sesudah ? `/java/belajar/${pelajaran.sesudah}` : '#'} aria-disabled={!pelajaran.sesudah}>
            Berikutnya ›
          </Link>
        </span>
      </div>

      <p className="pemberitahuan-ujian">
        📖 <b>Mode baca.</b> JDK tidak terdeteksi di perangkat ini (misalnya karena situs dibuka lewat internet, HP, atau iPad), jadi kode tidak dijalankan dan
        progress/XP tidak tercatat. Kamu tetap bisa belajar penuh dan mencoba kodenya di online compiler. Untuk progress, XP, dan pengecekan otomatis,
        buka lewat <code>npm run dev</code> di laptop yang sudah memasang JDK.
      </p>

      <article className="bacaan">
        <div className="judul-pelajaran">
          <h1>{pelajaran.judul}</h1>
        </div>
        <Markdown>{pelajaran.materi}</Markdown>
      </article>

      <section className="kotak-tugas">
        <h2>📝 Tugas</h2>
        <Markdown>{pelajaran.tugas}</Markdown>
      </section>

      {pelajaran.petunjuk.length > 0 && (
        <div className="kotak-petunjuk">
          {pelajaran.petunjuk.slice(0, jumlahPetunjuk).map((h, i) => (
            <div key={i} className="petunjuk">
              <b>Petunjuk {i + 1}:</b> <Markdown>{h}</Markdown>
            </div>
          ))}
          {jumlahPetunjuk < pelajaran.petunjuk.length && (
            <button className="tombol tombol-kedua" onClick={() => setJumlahPetunjuk((n) => n + 1)}>
              💡 {jumlahPetunjuk === 0 ? 'Lihat petunjuk' : 'Petunjuk berikutnya'} ({jumlahPetunjuk + 1}/{pelajaran.petunjuk.length})
            </button>
          )}
        </div>
      )}

      {berkas.length > 0 && (
        <section className="kartu-setelan">
          <h2>💻 Kode untuk dicoba</h2>
          <p className="teks-redup">
            {pelajaran.subtipe === 'prediksi' || pelajaran.subtipe === 'diagram-memori'
              ? 'Baca kodenya dan jawab dulu di kepalamu. Lalu salin dan jalankan di online compiler untuk membuktikannya.'
              : 'Salin kode awal di bawah, tempel di online compiler, lalu selesaikan tugasnya. Pastikan nama kelas dan berkasnya sesuai.'}
          </p>
          {berkas.map((b) => (
            <BlokBerkas key={b.nama} berkas={b} />
          ))}
          <p>
            <b>Buka online compiler</b> (salin kode dulu, lalu tempel):
          </p>
          <div className="baris-tombol">
            {COMPILER_ONLINE.map((c) => (
              <a key={c.nama} className="tombol tombol-kedua" href={c.url} target="_blank" rel="noreferrer">
                ▶ {c.nama} ↗
              </a>
            ))}
          </div>
          <p className="teks-redup kecil-soal">
            Beberapa online compiler mewajibkan kelas utama bernama <code>Main</code>. Bila programmu butuh banyak berkas, buat berkas tambahan dengan nama yang sama
            (OneCompiler mendukung banyak berkas).
          </p>
        </section>
      )}

      {pertanyaanDiagram.map((q, i) => (
        <PertanyaanLatihan key={i} judul={q.judul ?? `Pertanyaan ${i + 1}`} teks={q.teks} pilihan={q.pilihan} />
      ))}

      {pelajaran.subtipe === 'bedah-galat' && (
        <section className="kartu-setelan">
          <h2>🔍 Apa penyebab galatnya?</h2>
          <PertanyaanLatihan pilihan={pelajaran.pilihanPenyebab} />
          <p className="teks-redup">
            Jenis galat yang benar: <b>{pelajaran.jenisGalatBenar}</b>.
          </p>
        </section>
      )}

      {(pelajaran.penjelasan || solusi.length > 0) && (
        <section className="kartu-setelan">
          <h2>👀 Pembahasan</h2>
          {pelajaran.penjelasan && (
            <details>
              <summary>Lihat penjelasan</summary>
              <Markdown>{pelajaran.penjelasan}</Markdown>
            </details>
          )}
          {solusi.length > 0 && (
            <details>
              <summary>Lihat solusi</summary>
              {solusi.map((b) => (
                <BlokBerkas key={b.nama} berkas={b} />
              ))}
            </details>
          )}
        </section>
      )}

      <div className="baris-tombol">
        {pelajaran.sesudah ? (
          <Link className="tombol tombol-lanjut tombol-besar" to={`/java/belajar/${pelajaran.sesudah}`}>
            Pelajaran berikutnya →
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
