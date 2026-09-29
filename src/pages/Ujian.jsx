import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { daftarChapter, pelajaranById } from '../lessons/index.js';
import { soalKodeById, ujianById } from '../ujian/index.js';
import {
  AMBANG_CHAPTER_LEMAH,
  BOBOT,
  LABEL_TIPE,
  hitungHasil,
  nilaiStatis,
  pilihSoal,
  ringkasKomposisi,
  teksJawabanBenar,
  urutanPilihan,
} from '../ujian/susun.js';
import { htmlPreview, jalankanPelajaran } from '../engine/runner.js';
import { useProgress } from '../state/progress.jsx';
import { layarSentuh } from '../hooks/useModeLayar.js';
import Editor from '../components/Editor.jsx';
import BarSimbol from '../components/BarSimbol.jsx';
import Markdown from '../components/Markdown.jsx';
import Confetti from '../components/Confetti.jsx';

// ---------- Draf: jawaban tersimpan otomatis supaya tidak hilang kalau tab tertutup / halaman dimuat ulang ----------

const kunciDraf = (id) => `latihkode:ujian-draf:v1:${id}`;

function muatDraf(ujian) {
  try {
    const d = JSON.parse(localStorage.getItem(kunciDraf(ujian.id)) ?? 'null');
    if (!d || !Array.isArray(d.soalIds) || d.soalIds.length === 0) return null;
    const daftarSoal = d.soalIds.map((id) => ujian.soal.find((s) => s.id === id));
    if (daftarSoal.some((s) => !s)) return null; // bank soal berubah sejak draf dibuat
    const urutan = d.urutan ?? {};
    for (const s of daftarSoal) {
      if (s.tipe !== 'pilihan-ganda') continue;
      const u = urutan[s.id];
      if (!Array.isArray(u) || u.length !== s.pilihan.length) return null;
    }
    return { daftarSoal, urutan, jawaban: d.jawaban ?? {}, indeks: Math.min(d.indeks ?? 0, daftarSoal.length - 1) };
  } catch {
    return null;
  }
}

function simpanDraf(ujian, isi) {
  try {
    localStorage.setItem(kunciDraf(ujian.id), JSON.stringify(isi));
  } catch {
    /* penyimpanan penuh / diblokir: abaikan */
  }
}

function hapusDraf(ujian) {
  try {
    localStorage.removeItem(kunciDraf(ujian.id));
  } catch {
    /* abaikan */
  }
}

// ---------- Helper tampilan ----------

function labelChapter(cid) {
  const c = daftarChapter.find((x) => x.id === cid);
  return c ? `Chapter ${cid}: ${c.judul}` : `Chapter ${cid}`;
}

function bahasaKode(soal) {
  return soal.jenis === 'react' ? 'jsx' : 'js';
}

/** Blok kode berwarna (memakai renderer Markdown yang sama dengan materi). */
function BlokKode({ kode, bahasa = 'js' }) {
  return <Markdown>{`~~~${bahasa}\n${kode.replace(/\n$/, '')}\n~~~`}</Markdown>;
}

/** Teks biasa dengan `kode` inline diubah menjadi <code>. */
function TeksInline({ teks }) {
  return teks.split(/(`[^`]+`)/).map((bagian, i) => (bagian.length > 2 && bagian.startsWith('`') && bagian.endsWith('`') ? <code key={i}>{bagian.slice(1, -1)}</code> : <span key={i}>{bagian}</span>));
}

function terjawab(soal, jawaban) {
  if (soal.tipe === 'pilihan-ganda') return typeof jawaban === 'number';
  if (soal.tipe === 'prediksi-output') return typeof jawaban === 'string' && jawaban.trim() !== '';
  return typeof jawaban === 'string' && jawaban.trim() !== '' && jawaban !== soal.kodeAwal;
}

/** Jalankan kode jawaban + tes tersembunyi. Benar hanya jika SEMUA tes lolos. */
async function nilaiKode(soal, kode, iframe) {
  try {
    const r = await jalankanPelajaran({ kode: kode ?? soal.kodeAwal, pelajaran: soalKodeById[soal.id], iframe, onLog: () => {}, batasMs: 30000 });
    const gagal = r.hasil.find((h) => !h.lulus);
    return { benar: r.hasil.length > 0 && !gagal, pesan: gagal?.pesan ?? null };
  } catch (e) {
    return { benar: false, pesan: `Kode tidak dapat dijalankan: ${e.message}` };
  }
}

// ---------- Halaman ----------

export default function Ujian() {
  const { id } = useParams();
  const ujian = ujianById[id];
  if (!ujian) {
    return (
      <main className="halaman sempit">
        <h1>Ujian tidak ditemukan 🤔</h1>
        <p>
          Tidak ada ujian dengan id <code>{id}</code>.
        </p>
        <Link className="tombol" to="/">
          ← Kembali ke beranda
        </Link>
      </main>
    );
  }
  return <IsiUjian key={ujian.id} ujian={ujian} />;
}

function IsiUjian({ ujian }) {
  const prog = useProgress();
  const dataUjian = prog.data.ujian?.[ujian.id];
  const draf = useMemo(() => muatDraf(ujian), [ujian]);

  const [fase, setFase] = useState(draf ? 'ujian' : 'intro'); // 'intro' | 'ujian' | 'menilai' | 'hasil'
  const [daftarSoal, setDaftarSoal] = useState(draf?.daftarSoal ?? []);
  const [urutan, setUrutan] = useState(draf?.urutan ?? {});
  const [jawaban, setJawaban] = useState(draf?.jawaban ?? {});
  const [indeks, setIndeks] = useState(draf?.indeks ?? 0);
  const [hasil, setHasil] = useState(null);
  const [tahap, setTahap] = useState('');
  const [dilanjutkan] = useState(Boolean(draf));
  const iframePenilaian = useRef(null);

  // Simpan draf setiap ada perubahan (ditunda sedikit supaya tidak menulis di tiap ketikan).
  useEffect(() => {
    if (fase !== 'ujian') return;
    const t = setTimeout(() => simpanDraf(ujian, { soalIds: daftarSoal.map((s) => s.id), urutan, jawaban, indeks }), 300);
    return () => clearTimeout(t);
  }, [fase, ujian, daftarSoal, urutan, jawaban, indeks]);

  const mulai = () => {
    const pilih = pilihSoal(ujian, { terakhir: dataUjian?.soalTerakhir ?? [] });
    const u = {};
    const j = {};
    for (const s of pilih) {
      if (s.tipe === 'pilihan-ganda') u[s.id] = urutanPilihan(s);
      else if (s.tipe === 'kode') j[s.id] = s.kodeAwal;
      else j[s.id] = '';
    }
    setDaftarSoal(pilih);
    setUrutan(u);
    setJawaban(j);
    setIndeks(0);
    setHasil(null);
    setFase('ujian');
    window.scrollTo(0, 0);
  };

  const selesai = async () => {
    const kosong = daftarSoal.filter((s) => !terjawab(s, jawaban[s.id])).length;
    if (kosong > 0 && !window.confirm(`Masih ada ${kosong} soal yang belum dijawab. Tetap selesaikan ujian?`)) return;

    setFase('menilai');
    window.scrollTo(0, 0);
    const benar = {};
    const pesan = {};
    let n = 0;
    for (const s of daftarSoal) {
      setTahap(`Menilai soal ${++n} dari ${daftarSoal.length}…`);
      if (s.tipe === 'kode') {
        const r = await nilaiKode(s, jawaban[s.id], iframePenilaian.current);
        benar[s.id] = r.benar;
        pesan[s.id] = r.pesan;
      } else {
        benar[s.id] = nilaiStatis(s, jawaban[s.id], urutan[s.id]);
      }
    }
    const ringkasan = hitungHasil(ujian, daftarSoal, benar);
    const pertamaLulus = ringkasan.lulus && !dataUjian?.lulus;
    prog.terapkanHasilUjian(ujian, { ...ringkasan, soalIds: daftarSoal.map((s) => s.id) });
    hapusDraf(ujian);
    setHasil({ ringkasan, benar, pesan, pertamaLulus, daftarSoal, urutan, jawaban });
    setFase('hasil');
  };

  return (
    <>
      {/* Iframe tersembunyi untuk menilai soal DOM/React di akhir ujian */}
      <iframe ref={iframePenilaian} title="Penilaian" className="iframe-penilaian" tabIndex={-1} aria-hidden="true" />

      {fase === 'intro' && <Intro ujian={ujian} dataUjian={dataUjian} prog={prog} onMulai={mulai} />}

      {fase === 'ujian' && (
        <Pengerjaan
          ujian={ujian}
          daftarSoal={daftarSoal}
          urutan={urutan}
          jawaban={jawaban}
          setJawaban={(id, v) => setJawaban((j) => ({ ...j, [id]: v }))}
          indeks={indeks}
          setIndeks={setIndeks}
          onSelesai={selesai}
          gelap={prog.temaAktif === 'gelap'}
          dilanjutkan={dilanjutkan}
        />
      )}

      {fase === 'menilai' && (
        <main className="halaman sempit menilai-ujian">
          <div className="spinner" aria-hidden="true" />
          <h1>Menilai jawabanmu…</h1>
          <p className="teks-redup">{tahap}</p>
        </main>
      )}

      {fase === 'hasil' && hasil && <HasilUjian ujian={ujian} hasil={hasil} onUlangi={mulai} xpTotal={prog.totalXp} />}
    </>
  );
}

// ---------- Intro ----------

function Intro({ ujian, dataUjian, prog, onMulai }) {
  const komp = ringkasKomposisi(ujian);
  const chapters = ujian.chapterIds.map((id) => daftarChapter.find((c) => c.id === id)).filter(Boolean);
  const semuaPelajaran = chapters.flatMap((c) => c.pelajaran);
  const selesai = semuaPelajaran.filter((p) => prog.isSelesai(p.id)).length;
  const belumPertama = semuaPelajaran.find((p) => !prog.isSelesai(p.id));

  return (
    <main className="halaman ujian-halaman">
      <p className="hero-kecil">{ujian.ikon} Ujian pemahaman</p>
      <h1>{ujian.judul}</h1>
      <p className="teks-redup">{ujian.deskripsi}</p>

      {dataUjian && (
        <div className={`riwayat-ujian ${dataUjian.lulus ? 'lulus' : ''}`}>
          {dataUjian.lulus ? '✅ Sudah lulus' : '🔁 Belum lulus'} · skor terbaik <b>{dataUjian.terbaik}%</b> · {dataUjian.percobaan}× percobaan
          {dataUjian.tanggalLulus && <span className="teks-redup"> · lulus {dataUjian.tanggalLulus}</span>}
        </div>
      )}

      <section className="kartu-setelan">
        <h2>Materi yang diujikan</h2>
        <ul className="daftar-topik-ujian">
          {chapters.map((c) => {
            const n = c.pelajaran.length;
            const done = c.pelajaran.filter((p) => prog.isSelesai(p.id)).length;
            return (
              <li key={c.id}>
                <span>
                  {c.ikon} Chapter {c.id}: {c.judul}
                </span>
                <span className={done === n ? 'chip chip-lulus' : 'chip'}>
                  {done}/{n} pelajaran
                </span>
              </li>
            );
          })}
        </ul>
        {selesai < semuaPelajaran.length && (
          <p className="pemberitahuan-ujian">
            ⚠️ Baru {selesai} dari {semuaPelajaran.length} pelajaran yang kamu selesaikan. Ujian tetap boleh dicoba, tetapi hasilnya lebih menggambarkan
            pemahamanmu kalau materinya sudah dipelajari.{' '}
            {belumPertama && (
              <Link to={`/belajar/${belumPertama.id}`}>
                Lanjut belajar: {belumPertama.judul} →
              </Link>
            )}
          </p>
        )}
      </section>

      <section className="kartu-setelan">
        <h2>Aturan ujian</h2>
        <ul className="aturan-ujian">
          <li>
            📋 <b>{komp.soal} soal</b>, total <b>{komp.poin} poin</b>:{' '}
            {Object.entries(komp.perTipe)
              .map(([tipe, n]) => `${n} ${LABEL_TIPE[tipe].toLowerCase()} (${BOBOT[tipe]} poin)`)
              .join(', ')}
          </li>
          <li>
            🎯 Lulus jika skor minimal <b>{ujian.lulus}%</b>. Saat pertama kali lulus kamu mendapat bonus <b>+{ujian.xp} XP</b>.
          </li>
          <li>♻️ Soal diacak dan berbeda di setiap percobaan. Boleh diulang sebanyak yang kamu mau.</li>
          <li>🙈 Hasil tes dan kunci jawaban tidak ditampilkan selama ujian. Semuanya muncul beserta pembahasan setelah kamu menekan Selesai.</li>
          <li>💾 Jawabanmu tersimpan otomatis di perangkat ini. Kalau tab tertutup, kamu bisa melanjutkan.</li>
          <li>⏱️ Tidak ada batas waktu. Kerjakan dengan tenang, tanpa membuka materi, supaya hasilnya jujur.</li>
        </ul>
      </section>

      <div className="baris-tombol">
        <button className="tombol tombol-besar" onClick={onMulai}>
          {dataUjian ? '🔁 Mulai percobaan baru' : '🚀 Mulai ujian'}
        </button>
        <Link className="tombol tombol-kedua tombol-besar" to="/">
          ← Kembali
        </Link>
      </div>
    </main>
  );
}

// ---------- Pengerjaan ----------

function Pengerjaan({ ujian, daftarSoal, urutan, jawaban, setJawaban, indeks, setIndeks, onSelesai, gelap, dilanjutkan }) {
  const soal = daftarSoal[indeks];
  const jumlahTerjawab = daftarSoal.filter((s) => terjawab(s, jawaban[s.id])).length;
  const [tampilLanjut, setTampilLanjut] = useState(dilanjutkan);

  return (
    <main className="halaman ujian-halaman uji-pemahaman">
      <div className="bar-pelajaran">
        <Link to="/" className="link-kecil" title="Jawabanmu tersimpan otomatis">
          ← Keluar
        </Link>
        <span className="breadcrumb">
          {ujian.ikon} {ujian.judul}
        </span>
        <span className="teks-redup">
          {indeks + 1}/{daftarSoal.length} · terjawab {jumlahTerjawab}
        </span>
      </div>

      {tampilLanjut && (
        <p className="pemberitahuan-ujian" onClick={() => setTampilLanjut(false)}>
          💾 Melanjutkan ujian yang belum selesai. Jawabanmu sebelumnya sudah dipulihkan.
        </p>
      )}

      <div className="kartu-soal">
        <div className="kepala-soal">
          <span className="chip">
            Soal {indeks + 1} · {LABEL_TIPE[soal.tipe]} · {BOBOT[soal.tipe]} poin
          </span>
          <span className="teks-redup kecil-soal">{labelChapter(soal.chapterId)}</span>
        </div>

        {soal.tipe === 'pilihan-ganda' && (
          <SoalPilihanGanda key={soal.id} soal={soal} urutan={urutan[soal.id]} jawaban={jawaban[soal.id]} setJawaban={(v) => setJawaban(soal.id, v)} />
        )}
        {soal.tipe === 'prediksi-output' && <SoalOutput key={soal.id} soal={soal} jawaban={jawaban[soal.id]} setJawaban={(v) => setJawaban(soal.id, v)} />}
        {soal.tipe === 'kode' && <SoalKode key={soal.id} soal={soal} kode={jawaban[soal.id] ?? soal.kodeAwal} setKode={(v) => setJawaban(soal.id, v)} gelap={gelap} />}
      </div>

      <div className="nav-soal">
        <button className="tombol tombol-kedua" disabled={indeks === 0} onClick={() => setIndeks(indeks - 1)}>
          ‹ Sebelumnya
        </button>
        <div className="titik-soal">
          {daftarSoal.map((s, i) => (
            <button
              key={s.id}
              className={`titik ${i === indeks ? 'aktif' : ''} ${terjawab(s, jawaban[s.id]) ? 'terisi' : ''}`}
              onClick={() => setIndeks(i)}
              aria-label={`Soal ${i + 1}${terjawab(s, jawaban[s.id]) ? ' (sudah dijawab)' : ''}`}
            />
          ))}
        </div>
        {indeks < daftarSoal.length - 1 ? (
          <button className="tombol tombol-kedua" onClick={() => setIndeks(indeks + 1)}>
            Berikutnya ›
          </button>
        ) : (
          <button className="tombol tombol-lanjut" onClick={onSelesai}>
            Selesai ✓
          </button>
        )}
      </div>
      {indeks < daftarSoal.length - 1 && jumlahTerjawab === daftarSoal.length && (
        <p className="teks-redup kecil-soal rata-tengah">
          Semua soal sudah dijawab.{' '}
          <button className="tautan-tombol" onClick={onSelesai}>
            Selesaikan ujian sekarang
          </button>
        </p>
      )}
    </main>
  );
}

function SoalPilihanGanda({ soal, urutan, jawaban, setJawaban }) {
  return (
    <div className="panel-soal-uji">
      <Markdown>{soal.pertanyaan}</Markdown>
      <div className="pilihan-ganda">
        {urutan.map((asli, i) => (
          <label key={asli} className={`pilihan-item ${jawaban === i ? 'dipilih' : ''}`}>
            <input type="radio" name={soal.id} checked={jawaban === i} onChange={() => setJawaban(i)} />
            {soal.kodePilihan ? <code className="teks-pilihan-kode">{soal.pilihan[asli]}</code> : <span className="teks-pilihan"><TeksInline teks={soal.pilihan[asli]} /></span>}
          </label>
        ))}
      </div>
    </div>
  );
}

function SoalOutput({ soal, jawaban, setJawaban }) {
  return (
    <div className="panel-soal-uji">
      <p className="label-panel-soal">
        Tulis <b>semua baris</b> yang akan tercetak di console (satu baris untuk setiap <code>console.log</code>), <b>tanpa menjalankan</b> kodenya:
      </p>
      <BlokKode kode={soal.kode} />
      <textarea
        className="area-prediksi"
        rows={Math.max(3, soal.kunci.split('\n').length + 1)}
        value={jawaban ?? ''}
        onChange={(e) => setJawaban(e.target.value)}
        placeholder="Tulis prediksi output di sini…"
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
      />
      <p className="teks-redup kecil-soal">Baris kosong dan spasi berlebih diabaikan. Untuk array/object, spasi dan jenis tanda kutip tidak dipersoalkan.</p>
    </div>
  );
}

function SoalKode({ soal, kode, setKode, gelap }) {
  const pelajaran = soalKodeById[soal.id];
  const pakaiPreview = soal.jenis !== 'js';
  const iframeRef = useRef(null);
  const viewRef = useRef(null);
  const kodeRef = useRef(kode);
  kodeRef.current = kode;
  const jalanRef = useRef(false);
  const [logs, setLogs] = useState([]);
  const [jalan, setJalan] = useState(false);
  const [sudah, setSudah] = useState(false);

  useEffect(() => {
    if (pakaiPreview && iframeRef.current) iframeRef.current.srcdoc = htmlPreview(pelajaran);
  }, [pakaiPreview, pelajaran]);

  const jalankan = useCallback(async () => {
    if (jalanRef.current) return;
    jalanRef.current = true;
    setJalan(true);
    setSudah(true);
    setLogs([]);
    try {
      await jalankanPelajaran({ kode: kodeRef.current, pelajaran, iframe: iframeRef.current, onLog: (e) => setLogs((l) => [...l, e]) });
    } catch (e) {
      setLogs((l) => [...l, { level: 'error', text: `Terjadi kesalahan: ${e.message}` }]);
    } finally {
      jalanRef.current = false;
      setJalan(false);
    }
  }, [pelajaran]);

  return (
    <div className="panel-soal-uji">
      <Markdown>{soal.tugas}</Markdown>
      {layarSentuh && <BarSimbol viewRef={viewRef} />}
      <div className="editor-ujian">
        <Editor nilai={kode} onUbah={setKode} onJalankan={jalankan} gelap={gelap} jsx={soal.jenis === 'react'} onView={(v) => (viewRef.current = v)} />
      </div>
      <div className="baris-tombol">
        <button className="tombol tombol-jalan" onClick={jalankan} disabled={jalan}>
          {jalan ? 'Menjalankan…' : '▶ Coba jalankan'}
        </button>
        <button className="tombol tombol-kedua kecil" onClick={() => setKode(soal.kodeAwal)}>
          ↺ Reset kode
        </button>
      </div>
      {pakaiPreview && <iframe ref={iframeRef} title="Preview soal" className="preview preview-ujian" />}
      {sudah && (
        <div className="console console-ujian">
          {logs.length === 0 ? (
            <p className="teks-redup">{jalan ? 'Menjalankan…' : 'Tidak ada output console.'}</p>
          ) : (
            logs.map((l, i) => (
              <pre key={i} className={`log log-${l.level}`}>
                {l.text}
              </pre>
            ))
          )}
        </div>
      )}
      <p className="teks-redup kecil-soal">
        Hasil tes disembunyikan selama ujian. Gunakan “Coba jalankan” untuk melihat output kodemu, lalu periksa sendiri apakah sudah sesuai tugas.
      </p>
    </div>
  );
}

// ---------- Hasil ----------

function HasilUjian({ ujian, hasil, onUlangi }) {
  const { ringkasan, benar, pesan, pertamaLulus, daftarSoal, urutan, jawaban } = hasil;
  const { persen, poin, maks, lulus, perChapter } = ringkasan;

  const salah = daftarSoal.filter((s) => !benar[s.id]);
  const topikUlang = [...new Set(salah.map((s) => s.pelajaran).filter(Boolean))].map((id) => pelajaranById[id]).filter(Boolean);
  const judul = lulus ? '🎉 Selamat, kamu lulus!' : persen >= ujian.lulus - 20 ? '💪 Sedikit lagi!' : '📚 Belum lulus, yuk ulangi materinya';

  return (
    <main className="halaman ujian-halaman">
      {lulus && <Confetti />}
      <h1>{judul}</h1>

      <section className={`kartu-skor ${lulus ? 'lulus' : 'belum'}`}>
        <div className="skor-besar">{persen}%</div>
        <div className="skor-info">
          <div>
            <b>
              {poin} dari {maks} poin
            </b>{' '}
            · {daftarSoal.length - salah.length}/{daftarSoal.length} soal benar
          </div>
          <div className="teks-redup">Batas lulus {ujian.lulus}%</div>
          <div className="bar-skor" aria-hidden="true">
            <div className="bar-skor-isi" style={{ width: `${persen}%` }} />
            <div className="bar-skor-batas" style={{ left: `${ujian.lulus}%` }} />
          </div>
          {pertamaLulus && ujian.xp > 0 && <div className="bonus-xp">+{ujian.xp} XP bonus ujian! 🏆</div>}
        </div>
      </section>

      <section className="kartu-setelan">
        <h2>Hasil per chapter</h2>
        <div className="daftar-hasil-uji">
          {ujian.chapterIds
            .filter((cid) => perChapter[cid])
            .map((cid) => {
              const { poin: p, maks: m } = perChapter[cid];
              const pc = m ? Math.round((p / m) * 100) : 0;
              const lemah = pc < AMBANG_CHAPTER_LEMAH;
              return (
                <div key={cid} className={`hasil-uji-lesson ${lemah ? 'gagal' : 'lolos'}`}>
                  <span className="tes-ikon">{lemah ? '⚠️' : '✅'}</span>
                  <span className="item-judul">{labelChapter(cid)}</span>
                  <span className="teks-redup">
                    {p}/{m} poin
                  </span>
                  <b>{pc}%</b>
                </div>
              );
            })}
        </div>
      </section>

      {topikUlang.length > 0 && (
        <section className="kartu-setelan">
          <h2>Topik yang perlu diulang</h2>
          <p className="teks-redup">Soal yang keliru berkaitan dengan pelajaran berikut:</p>
          <ul className="daftar-topik-ujian">
            {topikUlang.map((p) => (
              <li key={p.id}>
                <span>{p.judul}</span>
                <Link className="tombol tombol-kedua kecil" to={`/belajar/${p.id}`}>
                  Buka pelajaran →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {salah.length > 0 && (
        <section className="tinjauan-soal">
          <h2>Pembahasan soal yang keliru ({salah.length})</h2>
          {salah.map((s) => (
            <Tinjauan key={s.id} soal={s} nomor={daftarSoal.indexOf(s) + 1} urutan={urutan[s.id]} jawaban={jawaban[s.id]} pesan={pesan[s.id]} />
          ))}
        </section>
      )}

      {salah.length < daftarSoal.length && (
        <details className="kartu-setelan soal-benar">
          <summary>✅ Soal yang sudah benar ({daftarSoal.length - salah.length})</summary>
          <ul>
            {daftarSoal
              .filter((s) => benar[s.id])
              .map((s) => (
                <li key={s.id}>
                  <b>Soal {daftarSoal.indexOf(s) + 1}</b> · {LABEL_TIPE[s.tipe]}: {s.penjelasan.split('\n')[0]}
                </li>
              ))}
          </ul>
        </details>
      )}

      <div className="baris-tombol">
        <button className="tombol tombol-besar" onClick={onUlangi}>
          🔁 {lulus ? 'Coba lagi untuk skor lebih tinggi' : 'Ulangi ujian (soal baru)'}
        </button>
        <Link className="tombol tombol-kedua tombol-besar" to="/">
          Ke beranda →
        </Link>
      </div>
    </main>
  );
}

function Tinjauan({ soal, nomor, urutan, jawaban, pesan }) {
  return (
    <article className="tinjauan-item">
      <div className="kepala-soal">
        <span className="chip">
          Soal {nomor} · {LABEL_TIPE[soal.tipe]}
        </span>
        <span className="teks-redup kecil-soal">{labelChapter(soal.chapterId)}</span>
      </div>

      {soal.tipe === 'pilihan-ganda' && (
        <>
          <Markdown>{soal.pertanyaan}</Markdown>
          <p className="jawaban-salah">
            ❌ Jawabanmu:{' '}
            {typeof jawaban === 'number' ? <code>{soal.pilihan[urutan[jawaban]]}</code> : <i>tidak dijawab</i>}
          </p>
          <p className="jawaban-benar">
            ✅ Jawaban benar: <code>{teksJawabanBenar(soal)}</code>
          </p>
        </>
      )}

      {soal.tipe === 'prediksi-output' && (
        <>
          <BlokKode kode={soal.kode} />
          <p className="jawaban-salah">❌ Jawabanmu:</p>
          <pre className="blok-jawaban">{jawaban?.trim() ? jawaban : '(tidak dijawab)'}</pre>
          <p className="jawaban-benar">✅ Output yang benar:</p>
          <pre className="blok-jawaban">{soal.kunci}</pre>
        </>
      )}

      {soal.tipe === 'kode' && (
        <>
          <Markdown>{soal.tugas}</Markdown>
          <p className="jawaban-salah">❌ Kodemu belum lolos tes{pesan ? ':' : '.'}</p>
          {pesan && <pre className="blok-jawaban">{pesan}</pre>}
          <details>
            <summary>Lihat kodemu</summary>
            <BlokKode kode={jawaban ?? soal.kodeAwal} bahasa={bahasaKode(soal)} />
          </details>
          <details>
            <summary>Lihat contoh solusi</summary>
            <BlokKode kode={soal.solusi} bahasa={bahasaKode(soal)} />
          </details>
        </>
      )}

      <div className="kotak-petunjuk">
        <b>Pembahasan:</b> <Markdown>{soal.penjelasan}</Markdown>
        {soal.pelajaran && pelajaranById[soal.pelajaran] && (
          <Link className="link-kecil" to={`/belajar/${soal.pelajaran}`}>
            📖 Pelajari lagi: {pelajaranById[soal.pelajaran].judul}
          </Link>
        )}
      </div>
    </article>
  );
}
