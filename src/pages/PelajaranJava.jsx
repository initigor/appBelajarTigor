import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { daftarChapterJava, pelajaranByIdJava } from '../lessonsJava/index.js';
import { PENGUJI_JAVA } from '../lessonsJava/_bersama/penguji.js';
import { useProgress } from '../state/progress.jsx';
import { useProgressJava } from '../state/progressJava.jsx';
import {
  cekStatusJdk,
  jalankanCuplikan,
  jalankanDiagnostik,
  jalankanKodeKelas,
  jalankanKodeOutput,
  samaOutput,
} from '../engine/javaClient.js';
import EditorJava from '../components/EditorJava.jsx';
import Markdown from '../components/Markdown.jsx';
import Confetti from '../components/Confetti.jsx';
import { useModeLayar } from '../hooks/useModeLayar.js';
import ModeBacaJava from '../components/ModeBacaJava.jsx';

const MIN_PERCOBAAN_SOLUSI = 3;

export default function PelajaranJava() {
  const { id } = useParams();
  const pelajaran = pelajaranByIdJava[id];
  if (!pelajaran) {
    return (
      <main className="halaman sempit">
        <h1>Pelajaran tidak ditemukan 🤔</h1>
        <p>
          Tidak ada pelajaran Java dengan id <code>{id}</code>.
        </p>
        <Link className="tombol" to="/">
          Kembali ke beranda
        </Link>
      </main>
    );
  }
  return <HalamanPelajaranJava key={pelajaran.id} pelajaran={pelajaran} />;
}

function namaBerkasKodeAwal(pelajaran) {
  if (pelajaran.subtipe === 'bedah-galat') return pelajaran.kodeBermasalah;
  return pelajaran.kodeAwal;
}

function HalamanPelajaranJava({ pelajaran }) {
  const progJs = useProgress(); // hanya dipakai untuk tema terang/gelap (dibagi dengan course JS)
  const prog = useProgressJava();
  const navigate = useNavigate();
  const chapter = daftarChapterJava.find((c) => c.id === pelajaran.chapterId);
  const posisi = chapter.pelajaran.findIndex((p) => p.id === pelajaran.id) + 1;
  const berkasi = pelajaran.subtipe === 'kode-output' || pelajaran.subtipe === 'kode-kelas';

  const [jdk, setJdk] = useState(null);
  useEffect(() => {
    cekStatusJdk().then(setJdk);
  }, []);

  const kodeTersimpan = prog.data.kode[pelajaran.id];
  const [kode, setKode] = useState(kodeTersimpan ?? namaBerkasKodeAwal(pelajaran));
  const kodeRef = useRef(kode);
  kodeRef.current = kode;

  // Untuk "bedah-galat": fase 'diagnosis' (baca kode+galat, jawab pilihan ganda) lalu 'perbaikan' (edit sampai lolos tes).
  const [faseGalat, setFaseGalat] = useState('diagnosis');
  const [diagnosis, setDiagnosis] = useState(null); // { pesanAsli, jelas } dari jalankanDiagnostik
  const [jawabPenyebab, setJawabPenyebab] = useState(null);
  const [jawabJenis, setJawabJenis] = useState(null);
  const [hasilDiagnosis, setHasilDiagnosis] = useState(null);

  useEffect(() => {
    if (pelajaran.subtipe !== 'bedah-galat') return;
    let batal = false;
    jalankanDiagnostik({ berkas: pelajaran.kodeBermasalah, kelasUtama: pelajaran.kelasUtama }).then((r) => {
      if (!batal) setDiagnosis(r);
    });
    return () => {
      batal = true;
    };
  }, [pelajaran]);

  // Untuk "prediksi"
  const [prediksiTeks, setPrediksiTeks] = useState('');
  // Untuk "diagram-memori"
  const [jawabDiagram, setJawabDiagram] = useState(() => (pelajaran.subtipe === 'diagram-memori' ? pelajaran.pertanyaan.map(() => null) : []));

  const [logs, setLogs] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [jalan, setJalan] = useState(false);
  const [tab, setTab] = useState('console');
  const [jumlahPetunjuk, setJumlahPetunjuk] = useState(0);
  const [lihatSolusi, setLihatSolusi] = useState(false);
  const [rayakan, setRayakan] = useState(null);

  const mode = useModeLayar();
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [panel, setPanel] = useState('materi');
  useEffect(() => {
    if (mode === 'tablet' && panel === 'hasil') setPanel('kode');
  }, [mode, panel]);

  const percobaan = prog.data.percobaan[pelajaran.id] ?? 0;
  const selesai = prog.isSelesai(pelajaran.id);
  const semuaLulus = hasil !== null && hasil.length > 0 && hasil.every((h) => h.lulus);
  const bolehLanjut = selesai || semuaLulus;
  const jumlahLulus = hasil?.filter((h) => h.lulus).length ?? 0;

  const { simpanKode, tambahPercobaan, tandaiSelesai, bersihkanRemedial } = prog;
  const sudahSelesaiRef = useRef(selesai);
  sudahSelesaiRef.current = selesai;
  const jalanRef = useRef(false);

  useEffect(() => {
    if (berkasi && kode !== (kodeTersimpan ?? namaBerkasKodeAwal(pelajaran))) {
      const t = setTimeout(() => simpanKode(pelajaran.id, kode), 500);
      return () => clearTimeout(t);
    }
  }, [kode, kodeTersimpan, pelajaran, berkasi, simpanKode]);

  const selesaikanJikaLulus = useCallback(
    (hasilBaru) => {
      const lulus = hasilBaru.length > 0 && hasilBaru.every((h) => h.lulus);
      if (lulus) {
        if (!sudahSelesaiRef.current) {
          tandaiSelesai(pelajaran);
          setRayakan({ xp: pelajaran.xp });
        }
        bersihkanRemedial(pelajaran.pekan, pelajaran.id);
        setTab((t) => (t === 'tes' ? 'console' : t));
      } else {
        setTab('tes');
      }
    },
    [pelajaran, tandaiSelesai, bersihkanRemedial],
  );

  const jalankan = useCallback(async () => {
    if (jalanRef.current) return;
    jalanRef.current = true;
    setJalan(true);
    if (modeRef.current === 'hp') setPanel('hasil');
    else if (modeRef.current === 'tablet') setPanel('kode');
    tambahPercobaan(pelajaran.id);
    try {
      let r;
      if (pelajaran.subtipe === 'kode-output') {
        r = await jalankanKodeOutput({ berkas: kodeRef.current, kelasUtama: pelajaran.kelasUtama, tes: pelajaran.tes });
      } else if (pelajaran.subtipe === 'kode-kelas') {
        r = await jalankanKodeKelas({
          berkasUser: kodeRef.current,
          pengujiIsi: PENGUJI_JAVA,
          tesUtamaNama: pelajaran.tesUtamaNama,
          tesUtamaIsi: pelajaran.tesUtamaIsi,
          daftarTes: pelajaran.daftarTes,
        });
      } else if (pelajaran.subtipe === 'bedah-galat' && faseGalat === 'perbaikan') {
        const rPerbaikan = await jalankanKodeOutput({ berkas: kodeRef.current, kelasUtama: pelajaran.kelasUtama, tes: pelajaran.tes });
        r = { logs: rPerbaikan.logs, error: rPerbaikan.error, hasil: [...(hasilDiagnosis ?? []), ...rPerbaikan.hasil] };
      } else if (pelajaran.subtipe === 'prediksi') {
        const run = await jalankanCuplikan(pelajaran.kodeCuplikan, pelajaran.kelasUtamaCuplikan ?? 'Main');
        if (!run.berhasil) {
          r = { logs: [{ level: 'error', text: run.stderr }], error: run.stderr, hasil: [{ nama: 'Prediksi output', lulus: false, pesan: 'Kode contoh gagal dijalankan (laporkan ke pengajar).' }] };
        } else {
          const lulus = samaOutput(prediksiTeks, run.stdout);
          r = {
            logs: [{ level: 'log', text: run.stdout }],
            error: null,
            hasil: [{ nama: 'Prediksi output', lulus, pesan: lulus ? undefined : `Prediksimu:\n${prediksiTeks || '(kosong)'}\n\nKeluaran sebenarnya:\n${run.stdout}` }],
          };
        }
      } else if (pelajaran.subtipe === 'diagram-memori') {
        const run = await jalankanCuplikan(pelajaran.kodeCuplikan, pelajaran.kelasUtamaCuplikan ?? 'Main');
        const hasilPertanyaan = pelajaran.pertanyaan.map((q, i) => {
          const dipilih = jawabDiagram[i];
          const benarIdx = q.pilihan.findIndex((p) => p.benar);
          const lulus = dipilih === benarIdx;
          return { nama: q.judul ?? `Pertanyaan ${i + 1}`, lulus, pesan: lulus ? undefined : `Jawabanmu: "${q.pilihan[dipilih]?.teks ?? '(belum dijawab)'}". Yang benar: "${q.pilihan[benarIdx].teks}".` };
        });
        r = {
          logs: run.berhasil ? [{ level: 'log', text: run.stdout }] : [{ level: 'error', text: run.stderr }],
          error: null,
          hasil: hasilPertanyaan,
        };
      }
      setLogs(r.logs);
      setHasil(r.hasil);
      selesaikanJikaLulus(r.hasil);
    } catch (e) {
      setLogs((l) => [...l, { level: 'error', text: `Terjadi kesalahan internal: ${e.message}` }]);
    } finally {
      jalanRef.current = false;
      setJalan(false);
    }
  }, [pelajaran, faseGalat, hasilDiagnosis, prediksiTeks, jawabDiagram, tambahPercobaan, selesaikanJikaLulus]);

  const periksaJawabanGalat = () => {
    const benarPenyebab = jawabPenyebab !== null && pelajaran.pilihanPenyebab[jawabPenyebab]?.benar;
    const benarJenis = jawabJenis === pelajaran.jenisGalatBenar;
    const h = [
      { nama: 'Penyebab galat', lulus: benarPenyebab, pesan: benarPenyebab ? undefined : 'Bukan itu penyebabnya. Baca penjelasan di bawah, lalu coba perbaiki kodenya.' },
      { nama: 'Jenis galat', lulus: benarJenis, pesan: benarJenis ? undefined : `Jenis galat yang benar: ${pelajaran.jenisGalatBenar}.` },
    ];
    setHasilDiagnosis(h);
    setFaseGalat('perbaikan');
    setKode(pelajaran.kodeBermasalah);
    setTab('console');
  };

  const resetKode = () => {
    if (!window.confirm('Kembalikan kode ke kondisi awal? Kodemu saat ini akan hilang.')) return;
    setKode(namaBerkasKodeAwal(pelajaran));
    prog.hapusKode(pelajaran.id);
  };

  const pakaiSolusi = () => {
    if (!window.confirm('Ganti isi editor dengan solusi?')) return;
    setKode(pelajaran.solusi);
    if (pelajaran.subtipe === 'bedah-galat') setFaseGalat('perbaikan');
  };

  const keBerikutnya = () => navigate(pelajaran.sesudah ? `/java/belajar/${pelajaran.sesudah}` : '/');

  const tabs = [
    { id: 'console', label: 'Console', badge: logs.some((l) => l.level === 'error') ? '!' : logs.length || null },
    { id: 'tes', label: 'Tes', badge: hasil ? `${jumlahLulus}/${hasil.length}` : null },
  ];

  const solusiTeks = Array.isArray(pelajaran.solusi)
    ? pelajaran.solusi.map((b) => `**\`${b.nama}\`**\n~~~java\n${b.isi}\n~~~`).join('\n\n')
    : '';

  // Tanpa JDK (mis. situs di Vercel, HP, iPad): tetap bisa belajar lewat mode baca + online compiler.
  if (jdk && !jdk.tersedia) return <ModeBacaJava pelajaran={pelajaran} chapter={chapter} posisi={posisi} />;

  return (
    <main className="pelajaran" data-mode={mode} data-panel={panel}>
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

      <div className="split">
        <section className="panel-kiri">
          <div className="judul-pelajaran">
            <h1>{pelajaran.judul}</h1>
            <div className="label-baris">
              <span className="chip">⚡ {pelajaran.xp} XP</span>
              {pelajaran.proyek && <span className="chip chip-proyek">🛠️ Mini proyek</span>}
              {selesai && <span className="chip chip-lulus">✓ Selesai{prog.isLewatUji(pelajaran.id) ? ' (lolos uji)' : ''}</span>}
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
                  💡 {jumlahPetunjuk === 0 ? 'Lihat petunjuk' : 'Petunjuk berikutnya'} ({jumlahPetunjuk + 1}/{pelajaran.petunjuk.length})
                </button>
              )}
            </div>
          )}

          {berkasi && (
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
                    <Markdown>{solusiTeks}</Markdown>
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
          )}

          {mode !== 'desktop' && (
            <button className="tombol tombol-besar tombol-mulai-kode" onClick={() => setPanel('kode')}>
              💻 Mulai ngoding →
            </button>
          )}
        </section>

        <section className="panel-kanan">
          <div className="toolbar">
            <span className="nama-file">
              {pelajaran.subtipe === 'bedah-galat' ? (faseGalat === 'diagnosis' ? '🔍 Diagnosis' : '🛠️ Perbaikan') : pelajaran.judul}
            </span>
            <span className="toolbar-tombol">
              {(berkasi || (pelajaran.subtipe === 'bedah-galat' && faseGalat === 'perbaikan')) && (
                <button className="tombol tombol-kedua kecil" onClick={resetKode} title="Kembalikan kode awal">
                  ↺ Reset
                </button>
              )}
              {!(pelajaran.subtipe === 'bedah-galat' && faseGalat === 'diagnosis') && (
                <button className="tombol tombol-jalan" onClick={jalankan} disabled={jalan} title="Ctrl+Enter">
                  {jalan ? 'Menjalankan…' : '▶ Jalankan'}
                </button>
              )}
              <button className={`tombol ${bolehLanjut ? 'tombol-lanjut' : 'tombol-kedua'}`} onClick={keBerikutnya} disabled={!bolehLanjut} title={bolehLanjut ? '' : 'Loloskan semua tes dulu'}>
                {pelajaran.sesudah ? 'Lanjut →' : 'Selesai 🏁'}
              </button>
            </span>
          </div>

          <div className="area-editor">
            {berkasi && <EditorJava berkas={kode} onUbah={(nama, isi) => setKode((b) => b.map((f) => (f.nama === nama ? { ...f, isi } : f)))} onJalankan={jalankan} gelap={progJs.temaAktif === 'gelap'} />}

            {pelajaran.subtipe === 'bedah-galat' && (
              <PanelBedahGalat
                pelajaran={pelajaran}
                fase={faseGalat}
                diagnosis={diagnosis}
                jawabPenyebab={jawabPenyebab}
                setJawabPenyebab={setJawabPenyebab}
                jawabJenis={jawabJenis}
                setJawabJenis={setJawabJenis}
                onPeriksa={periksaJawabanGalat}
                editorKode={faseGalat === 'perbaikan' ? <EditorJava berkas={kode} onUbah={(nama, isi) => setKode((b) => b.map((f) => (f.nama === nama ? { ...f, isi } : f)))} onJalankan={jalankan} gelap={progJs.temaAktif === 'gelap'} /> : null}
              />
            )}

            {pelajaran.subtipe === 'prediksi' && (
              <PanelPrediksi pelajaran={pelajaran} gelap={progJs.temaAktif === 'gelap'} teks={prediksiTeks} setTeks={setPrediksiTeks} onJalankan={jalankan} />
            )}

            {pelajaran.subtipe === 'diagram-memori' && (
              <PanelDiagramMemori pelajaran={pelajaran} gelap={progJs.temaAktif === 'gelap'} jawaban={jawabDiagram} setJawaban={setJawabDiagram} />
            )}
          </div>

          <div className="area-output">
            <div className="tabs" role="tablist">
              {tabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'aktif' : ''}`} onClick={() => setTab(t.id)}>
                  {t.label}
                  {t.badge !== null && t.badge !== undefined && <span className="badge">{t.badge}</span>}
                </button>
              ))}
              <span className="tips-pintas">Ctrl+Enter untuk menjalankan</span>
            </div>

            <div className="isi-tab">
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
                    <p className="teks-redup">Jalankan dulu untuk melihat hasil.</p>
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

      {mode !== 'desktop' && (
        <nav className="nav-bawah" aria-label="Panel pelajaran">
          <button className={panel === 'materi' ? 'aktif' : ''} onClick={() => setPanel('materi')}>
            <span className="nav-ikon">📖</span>Materi
          </button>
          <button className={panel === 'kode' ? 'aktif' : ''} onClick={() => setPanel('kode')}>
            <span className="nav-ikon">💻</span>Latihan
          </button>
          <button className="nav-jalan" onClick={jalankan} disabled={jalan}>
            <span className="nav-ikon">{jalan ? '⏳' : '▶'}</span>
            {jalan ? 'Jalan…' : 'Jalankan'}
          </button>
          {mode === 'hp' && (
            <button className={panel === 'hasil' ? 'aktif' : ''} onClick={() => setPanel('hasil')}>
              <span className="nav-ikon">{hasil === null ? '📊' : semuaLulus ? '✅' : '❌'}</span>
              Hasil{hasil ? ` ${jumlahLulus}/${hasil.length}` : ''}
            </button>
          )}
        </nav>
      )}

      {rayakan && (
        <div className="modal-latar" onClick={() => setRayakan(null)}>
          <Confetti />
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ikon">🏆</div>
            <h2>Pelajaran selesai!</h2>
            <p className="xp-naik">+{rayakan.xp} XP</p>
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

function PanelPrediksi({ pelajaran, gelap, teks, setTeks, onJalankan }) {
  return (
    <div className="panel-soal">
      <p className="label-panel-soal">Baca cuplikan berikut, lalu tulis prediksi SEMUA baris yang akan tercetak (satu baris per baris keluaran):</p>
      <EditorJava berkas={[{ nama: pelajaran.kelasUtamaCuplikan ? `${pelajaran.kelasUtamaCuplikan}.java` : 'Main.java', isi: pelajaran.kodeCuplikan }]} onUbah={() => {}} onJalankan={onJalankan} gelap={gelap} readOnly />
      <textarea className="area-prediksi" placeholder="Tulis prediksi keluaran di sini, satu baris per baris…" value={teks} onChange={(e) => setTeks(e.target.value)} rows={6} />
    </div>
  );
}

function PanelDiagramMemori({ pelajaran, gelap, jawaban, setJawaban }) {
  return (
    <div className="panel-soal">
      <EditorJava berkas={[{ nama: pelajaran.kelasUtamaCuplikan ? `${pelajaran.kelasUtamaCuplikan}.java` : 'Main.java', isi: pelajaran.kodeCuplikan }]} onUbah={() => {}} onJalankan={() => {}} gelap={gelap} readOnly />
      {pelajaran.pertanyaan.map((q, i) => (
        <div key={i} className="pertanyaan-diagram">
          <p>
            <Markdown>{q.teks}</Markdown>
          </p>
          <div className="pilihan-ganda">
            {q.pilihan.map((p, j) => (
              <label key={j} className={`pilihan-item ${jawaban[i] === j ? 'dipilih' : ''}`}>
                <input type="radio" name={`diagram-${i}`} checked={jawaban[i] === j} onChange={() => setJawaban((arr) => arr.map((v, k) => (k === i ? j : v)))} />
                {p.teks}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelBedahGalat({ pelajaran, fase, diagnosis, jawabPenyebab, setJawabPenyebab, jawabJenis, setJawabJenis, onPeriksa, editorKode }) {
  if (fase === 'perbaikan') {
    return (
      <div className="panel-soal">
        <div className="kotak-petunjuk">
          <Markdown>{pelajaran.penjelasan}</Markdown>
        </div>
        {editorKode}
      </div>
    );
  }
  return (
    <div className="panel-soal">
      <EditorJava berkas={pelajaran.kodeBermasalah} onUbah={() => {}} onJalankan={() => {}} gelap readOnly />
      <div className="galat-asli">
        {diagnosis === null ? (
          <p className="teks-redup">Menjalankan kode untuk melihat pesan galat sungguhan…</p>
        ) : diagnosis.fase === 'logika' ? (
          <p>
            ⚠️ Program berjalan sampai selesai <b>tanpa pesan galat apa pun</b> — inilah galat logika, jenis yang paling berbahaya. Keluarannya:
            <pre className="log log-log">{diagnosis.stdout}</pre>
          </p>
        ) : (
          <pre className="log log-error">{diagnosis.pesanAsli}</pre>
        )}
      </div>
      {diagnosis !== null && (
        <>
          <div className="pertanyaan-diagram">
            <p>
              <b>Apa penyebabnya?</b>
            </p>
            <div className="pilihan-ganda">
              {pelajaran.pilihanPenyebab.map((p, i) => (
                <label key={i} className={`pilihan-item ${jawabPenyebab === i ? 'dipilih' : ''}`}>
                  <input type="radio" name="penyebab" checked={jawabPenyebab === i} onChange={() => setJawabPenyebab(i)} />
                  {p.teks}
                </label>
              ))}
            </div>
          </div>
          <div className="pertanyaan-diagram">
            <p>
              <b>Termasuk jenis galat apa?</b>
            </p>
            <div className="pilihan-ganda">
              {['kompilasi', 'eksekusi', 'logika'].map((j) => (
                <label key={j} className={`pilihan-item ${jawabJenis === j ? 'dipilih' : ''}`}>
                  <input type="radio" name="jenis" checked={jawabJenis === j} onChange={() => setJawabJenis(j)} />
                  {j}
                </label>
              ))}
            </div>
          </div>
          <button className="tombol tombol-besar" disabled={jawabPenyebab === null || jawabJenis === null} onClick={onPeriksa}>
            Periksa jawaban →
          </button>
        </>
      )}
    </div>
  );
}
