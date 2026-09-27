import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { daftarChapter, pelajaranById } from '../lessons/index.js';
import { useProgress } from '../state/progress.jsx';
import { htmlPreview, jalankanPelajaran } from '../engine/runner.js';
import Editor from '../components/Editor.jsx';
import Markdown from '../components/Markdown.jsx';
import Confetti from '../components/Confetti.jsx';

const MIN_PERCOBAAN_SOLUSI = 3;

export default function Pelajaran() {
  const { id } = useParams();
  const pelajaran = pelajaranById[id];
  if (!pelajaran) {
    return (
      <main className="halaman sempit">
        <h1>Pelajaran tidak ditemukan 🤔</h1>
        <p>
          Tidak ada pelajaran dengan id <code>{id}</code>.
        </p>
        <Link className="tombol" to="/">
          Kembali ke beranda
        </Link>
      </main>
    );
  }
  // key memastikan semua state di-reset ketika pindah pelajaran.
  return <HalamanPelajaran key={pelajaran.id} pelajaran={pelajaran} />;
}

function HalamanPelajaran({ pelajaran }) {
  const prog = useProgress();
  const navigate = useNavigate();
  const chapter = daftarChapter.find((c) => c.id === pelajaran.chapterId);
  const posisi = chapter.pelajaran.findIndex((p) => p.id === pelajaran.id) + 1;
  const pakaiPreview = pelajaran.tipe !== 'js';

  const kodeTersimpan = prog.data.kode[pelajaran.id];
  const [kode, setKode] = useState(kodeTersimpan ?? pelajaran.kodeAwal);
  const kodeRef = useRef(kode);
  kodeRef.current = kode;

  const [logs, setLogs] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [jalan, setJalan] = useState(false);
  const [tab, setTab] = useState(pakaiPreview ? 'preview' : 'console');
  const [jumlahPetunjuk, setJumlahPetunjuk] = useState(0);
  const [lihatSolusi, setLihatSolusi] = useState(false);
  const [rayakan, setRayakan] = useState(null); // { xp } saat baru lulus
  const iframeRef = useRef(null);

  const percobaan = prog.data.percobaan[pelajaran.id] ?? 0;
  const selesai = prog.isSelesai(pelajaran.id);
  const semuaLulus = hasil !== null && hasil.length > 0 && hasil.every((h) => h.lulus);
  const bolehLanjut = selesai || semuaLulus;
  const jumlahLulus = hasil?.filter((h) => h.lulus).length ?? 0;

  // Simpan kode ke localStorage (ditunda sedikit supaya tidak menyimpan di setiap ketikan).
  const { simpanKode } = prog;
  useEffect(() => {
    if (kode === (kodeTersimpan ?? pelajaran.kodeAwal)) return;
    const t = setTimeout(() => simpanKode(pelajaran.id, kode), 500);
    return () => clearTimeout(t);
  }, [kode, kodeTersimpan, pelajaran, simpanKode]);

  // Tampilkan HTML awal di preview.
  useEffect(() => {
    if (pakaiPreview && iframeRef.current) iframeRef.current.srcdoc = htmlPreview(pelajaran);
  }, [pakaiPreview, pelajaran]);

  const { tambahPercobaan, tandaiSelesai } = prog;
  const sudahSelesaiRef = useRef(selesai);
  sudahSelesaiRef.current = selesai;
  const jalanRef = useRef(false);

  const jalankan = useCallback(async () => {
    if (jalanRef.current) return;
    jalanRef.current = true;
    setJalan(true);
    setLogs([]);
    tambahPercobaan(pelajaran.id);
    try {
      const r = await jalankanPelajaran({
        kode: kodeRef.current,
        pelajaran,
        iframe: iframeRef.current,
        onLog: (e) => setLogs((l) => [...l, e]),
      });
      setHasil(r.hasil);
      const lulus = r.hasil.length > 0 && r.hasil.every((h) => h.lulus);
      if (lulus) {
        if (!sudahSelesaiRef.current) {
          tandaiSelesai(pelajaran);
          setRayakan({ xp: pelajaran.xp });
        }
        setTab((t) => (t === 'tes' ? (pakaiPreview ? 'preview' : 'console') : t));
      } else {
        setTab('tes');
      }
    } catch (e) {
      setLogs((l) => [...l, { level: 'error', text: `Terjadi kesalahan internal: ${e.message}` }]);
    } finally {
      jalanRef.current = false;
      setJalan(false);
    }
  }, [pelajaran, pakaiPreview, tambahPercobaan, tandaiSelesai]);

  const resetKode = () => {
    if (!window.confirm('Kembalikan kode ke kondisi awal? Kodemu saat ini akan hilang.')) return;
    setKode(pelajaran.kodeAwal);
    prog.hapusKode(pelajaran.id);
  };

  const pakaiSolusi = () => {
    if (!window.confirm('Ganti isi editor dengan solusi?')) return;
    setKode(pelajaran.solusi);
  };

  const keBerikutnya = () => navigate(pelajaran.sesudah ? `/belajar/${pelajaran.sesudah}` : '/');

  const tabs = [
    ...(pakaiPreview ? [{ id: 'preview', label: 'Preview' }] : []),
    { id: 'console', label: 'Console', badge: logs.some((l) => l.level === 'error') ? '!' : logs.length || null },
    { id: 'tes', label: 'Tes', badge: hasil ? `${jumlahLulus}/${hasil.length}` : null },
  ];

  return (
    <main className="pelajaran">
      <div className="bar-pelajaran">
        <Link to="/" className="link-kecil">
          ← Beranda
        </Link>
        <span className="breadcrumb">
          {chapter.ikon} Chapter {chapter.id}: {chapter.judul} · {posisi}/{chapter.pelajaran.length}
        </span>
        <span className="nav-pelajaran">
          <Link
            className={`link-kecil ${pelajaran.sebelum ? '' : 'nonaktif'}`}
            to={pelajaran.sebelum ? `/belajar/${pelajaran.sebelum}` : '#'}
            aria-disabled={!pelajaran.sebelum}
          >
            ‹ Sebelumnya
          </Link>
          <Link
            className={`link-kecil ${pelajaran.sesudah ? '' : 'nonaktif'}`}
            to={pelajaran.sesudah ? `/belajar/${pelajaran.sesudah}` : '#'}
            aria-disabled={!pelajaran.sesudah}
          >
            Berikutnya ›
          </Link>
        </span>
      </div>

      <div className="split">
        <section className="panel-kiri">
          <div className="judul-pelajaran">
            <h1>{pelajaran.judul}</h1>
            <div className="label-baris">
              <span className="chip">⚡ {pelajaran.xp} XP</span>
              {pelajaran.proyek && <span className="chip chip-proyek">🛠️ Mini proyek</span>}
              {selesai && <span className="chip chip-lulus">✓ Selesai</span>}
            </div>
          </div>

          <Markdown>{pelajaran.materi}</Markdown>

          <div className="kotak-tugas">
            <h2>📝 Tugas</h2>
            <Markdown>{pelajaran.tugas}</Markdown>
          </div>

          {pelajaran.petunjuk.length > 0 && (
            <div className="kotak-petunjuk">
              {pelajaran.petunjuk.slice(0, jumlahPetunjuk).map((h, i) => (
                <div key={i} className="petunjuk">
                  <b>Petunjuk {i + 1}:</b> <Markdown>{h}</Markdown>
                </div>
              ))}
              {jumlahPetunjuk < pelajaran.petunjuk.length && (
                <button className="tombol tombol-kedua" onClick={() => setJumlahPetunjuk((n) => n + 1)}>
                  💡 {jumlahPetunjuk === 0 ? 'Lihat petunjuk' : 'Petunjuk berikutnya'} ({jumlahPetunjuk + 1}/
                  {pelajaran.petunjuk.length})
                </button>
              )}
            </div>
          )}

          <div className="kotak-solusi">
            {percobaan >= MIN_PERCOBAAN_SOLUSI || selesai ? (
              lihatSolusi ? (
                <>
                  <div className="solusi-kepala">
                    <b>Solusi</b>
                    <span>
                      <button className="tombol tombol-kedua kecil" onClick={pakaiSolusi}>
                        Salin ke editor
                      </button>{' '}
                      <button className="tombol tombol-kedua kecil" onClick={() => setLihatSolusi(false)}>
                        Sembunyikan
                      </button>
                    </span>
                  </div>
                  <Markdown>{'~~~' + (pelajaran.tipe === 'react' ? 'jsx' : 'js') + '\n' + pelajaran.solusi + '\n~~~'}</Markdown>
                </>
              ) : (
                <button className="tombol tombol-kedua" onClick={() => setLihatSolusi(true)}>
                  👀 Lihat solusi
                </button>
              )
            ) : (
              <p className="teks-redup">
                🔒 Tombol solusi muncul setelah kamu mencoba {MIN_PERCOBAAN_SOLUSI} kali ({percobaan}/{MIN_PERCOBAAN_SOLUSI}).
              </p>
            )}
          </div>
        </section>

        <section className="panel-kanan">
          <div className="toolbar">
            <span className="nama-file">{pelajaran.tipe === 'react' ? 'App.jsx' : 'script.js'}</span>
            <span className="toolbar-tombol">
              <button className="tombol tombol-kedua kecil" onClick={resetKode} title="Kembalikan kode awal">
                ↺ Reset
              </button>
              <button className="tombol tombol-jalan" onClick={jalankan} disabled={jalan} title="Ctrl+Enter">
                {jalan ? 'Menjalankan…' : '▶ Jalankan'}
              </button>
              <button
                className={`tombol ${bolehLanjut ? 'tombol-lanjut' : 'tombol-kedua'}`}
                onClick={keBerikutnya}
                disabled={!bolehLanjut}
                title={bolehLanjut ? '' : 'Loloskan semua tes dulu'}
              >
                {pelajaran.sesudah ? 'Lanjut →' : 'Selesai 🏁'}
              </button>
            </span>
          </div>

          <div className="area-editor">
            <Editor
              nilai={kode}
              onUbah={setKode}
              onJalankan={jalankan}
              gelap={prog.temaAktif === 'gelap'}
              jsx={pelajaran.tipe === 'react'}
            />
          </div>

          <div className="area-output">
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tab ${tab === t.id ? 'aktif' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  {t.badge !== null && t.badge !== undefined && <span className="badge">{t.badge}</span>}
                </button>
              ))}
              <span className="tips-pintas">Ctrl+Enter untuk menjalankan</span>
            </div>

            <div className="isi-tab">
              {pakaiPreview && (
                <iframe ref={iframeRef} title="Preview" className="preview" style={{ display: tab === 'preview' ? 'block' : 'none' }} />
              )}

              {tab === 'console' && (
                <div className="console">
                  {logs.length === 0 ? (
                    <p className="teks-redup">{jalan ? 'Menjalankan…' : 'Tekan ▶ Jalankan untuk melihat output.'}</p>
                  ) : (
                    logs.map((l, i) => (
                      <pre key={i} className={`log log-${l.level}`}>
                        {l.text}
                      </pre>
                    ))
                  )}
                </div>
              )}

              {tab === 'tes' && (
                <div className="daftar-tes">
                  {hasil === null ? (
                    <>
                      <p className="teks-redup">Tes yang harus diloloskan:</p>
                      {pelajaran.tes.map((t, i) => (
                        <div key={i} className="tes tes-belum">
                          <span className="tes-ikon">○</span>
                          <span>{t.nama}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {semuaLulus && <div className="banner-lulus">🎉 Semua tes lolos!</div>}
                      {hasil.map((h, i) => (
                        <div key={i} className={`tes ${h.lulus ? 'tes-lulus' : 'tes-gagal'}`}>
                          <span className="tes-ikon">{h.lulus ? '✅' : '❌'}</span>
                          <div>
                            <div>{h.nama}</div>
                            {!h.lulus && h.pesan && <div className="tes-pesan">{h.pesan}</div>}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {rayakan && (
        <div className="modal-latar" onClick={() => setRayakan(null)}>
          <Confetti />
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ikon">🏆</div>
            <h2>Pelajaran selesai!</h2>
            <p className="xp-naik">+{rayakan.xp} XP</p>
            <p className="teks-redup">
              Total XP: {prog.totalXp} · 🔥 Streak {prog.streak} hari
            </p>
            <div className="modal-tombol">
              <button className="tombol tombol-kedua" onClick={() => setRayakan(null)}>
                Tetap di sini
              </button>
              <button className="tombol tombol-lanjut" onClick={keBerikutnya} autoFocus>
                {pelajaran.sesudah ? 'Lanjut →' : 'Ke beranda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
