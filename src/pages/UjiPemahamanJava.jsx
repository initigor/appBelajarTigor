import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { daftarChapterJava } from '../lessonsJava/index.js';
import { bankSoalPekan } from '../lessonsJava/_bersama/bank.js';
import { pilihSoalAttempt, cocokKunci } from '../lessonsJava/_bersama/soal.js';
import { useProgress } from '../state/progress.jsx';
import { useProgressJava } from '../state/progressJava.jsx';
import { cekStatusJdk, jalankanCuplikan, jalankanKodeOutput, samaOutput } from '../engine/javaClient.js';
import BelumPasangJdk from '../components/BelumPasangJdk.jsx';
import EditorJava from '../components/EditorJava.jsx';
import Markdown from '../components/Markdown.jsx';

export default function UjiPemahamanJava() {
  const { pekan } = useParams();
  const [params] = useSearchParams();
  const pekanNum = Number(pekan);
  const chapter = daftarChapterJava.find((c) => c.id === pekanNum);
  const [jdk, setJdk] = useState(null);
  useEffect(() => {
    cekStatusJdk().then(setJdk);
  }, []);
  if (!chapter) {
    return (
      <main className="halaman sempit">
        <h1>Pekan tidak ditemukan 🤔</h1>
        <Link className="tombol" to="/">
          ← Kembali ke beranda
        </Link>
      </main>
    );
  }
  // Uji Pemahaman menjalankan kode Java sungguhan, jadi butuh JDK. Materinya tetap bisa dibaca.
  if (jdk && !jdk.tersedia) return <BelumPasangJdk jdk={jdk} bacaTo={`/java/belajar/${chapter.pelajaran[0]?.id}`} />;
  // key menyertakan `remedial` supaya berpindah normal <-> remedial (atau menekan "Uji ulang") selalu me-remount
  // dengan state bersih, bukan menyisakan attempt/hasilAkhir dari percobaan sebelumnya.
  return <IsiUji key={`${pekan}-${params.get('remedial') ?? ''}-${params.get('v3') ?? ''}`} chapter={chapter} pekan={pekanNum} />;
}

function IsiUji({ chapter, pekan }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const remedialSaja = params.get('remedial') === '1';
  const modeV3 = params.get('v3') === '1';
  const progJs = useProgress();
  const prog = useProgressJava();
  const jalur = prog.jalurPekan(pekan);

  useEffect(() => {
    if (jalur === 'belajar' && !remedialSaja && !modeV3) {
      const pertama = chapter.pelajaran[0];
      if (pertama) navigate(`/java/belajar/${pertama.id}`, { replace: true });
    }
  }, [jalur, remedialSaja, modeV3, chapter, navigate]);

  const [attempt, setAttempt] = useState(null); // { daftarSoal, idDipakaiBaru }
  const [indeks, setIndeks] = useState(0);
  const [jawaban, setJawaban] = useState({}); // { [soalId]: teks | index | berkas[] }
  const [menilai, setMenilai] = useState(false);
  const [hasilAkhir, setHasilAkhir] = useState(null); // { perLesson, perSoal }

  const mulaiUji = (jalurBaru) => {
    if (jalurBaru) prog.pilihJalur(pekan, jalurBaru);
    if (jalurBaru === 'belajar') return;
    const bank = bankSoalPekan[pekan] ?? {};
    const lessonIds = remedialSaja ? prog.data.remedial[pekan] ?? [] : chapter.pelajaran.map((p) => p.id);
    const { soalPerLesson, idDipakaiBaru } = pilihSoalAttempt(bank, lessonIds, prog.soalDipakaiPekan(pekan), 2);
    const daftarSoal = lessonIds.flatMap((id) => soalPerLesson[id] ?? []);
    const jawabanAwal = {};
    for (const s of daftarSoal) if (s.tipe === 'kode-singkat') jawabanAwal[s.id] = s.kodeAwal;
    setJawaban(jawabanAwal);
    setAttempt({ daftarSoal, idDipakaiBaru, lessonIds });
    setIndeks(0);
    setHasilAkhir(null);
  };

  // Mulai otomatis kalau jalur sudah dipilih sebelumnya (atau ini uji ulang remedial / Latihan V-3).
  useEffect(() => {
    if ((jalur === 'uji' || remedialSaja || modeV3) && !attempt && !hasilAkhir) mulaiUji();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jalur, remedialSaja, modeV3]);

  const selesaikanUji = async () => {
    setMenilai(true);
    const perSoal = {};
    for (const s of attempt.daftarSoal) {
      perSoal[s.id] = await nilaiSatuSoal(s, jawaban[s.id]);
    }
    const perLesson = {};
    for (const id of attempt.lessonIds) {
      const soalLesson = attempt.daftarSoal.filter((s) => s.lessonId === id);
      if (soalLesson.length === 0) continue; // belum ada bank soal utk pelajaran ini -> jangan ikut dinilai
      perLesson[id] = { benar: soalLesson.filter((s) => perSoal[s.id].benar).length, total: soalLesson.length };
    }
    const totalBenar = Object.values(perLesson).reduce((a, r) => a + r.benar, 0);
    const totalSoal = Object.values(perLesson).reduce((a, r) => a + r.total, 0);
    if (modeV3) {
      // Latihan V-3 murni catatan latihan: TIDAK menandai pelajaran selesai / remedial.
      prog.catatV3({ tanggal: new Date().toISOString(), benar: totalBenar, total: totalSoal, perLesson });
    } else {
      prog.terapkanHasilUji(pekan, perLesson, attempt.idDipakaiBaru);
    }
    setHasilAkhir({ perLesson, perSoal });
    setMenilai(false);
  };

  if (jalur === null && !remedialSaja && !modeV3) {
    return (
      <main className="halaman sempit">
        <h1>
          {chapter.ikon} {chapter.judul}
        </h1>
        <p>Kamu belum pernah membuka pekan ini di LatihKode. Sudah menguasai materinya di kelas, atau mau belajar dari awal di sini?</p>
        <div className="pilihan-jalur">
          <button className="tombol tombol-besar" onClick={() => mulaiUji('uji')}>
            ✅ Aku sudah menguasai {chapter.judul.split(':')[0]} → Uji Pemahaman
          </button>
          <button className="tombol tombol-kedua tombol-besar" onClick={() => mulaiUji('belajar')}>
            📖 Belajar {chapter.judul.split(':')[0]} dari awal
          </button>
        </div>
      </main>
    );
  }

  if (!attempt && !hasilAkhir) {
    return (
      <main className="halaman sempit">
        <p className="teks-redup">Menyiapkan soal…</p>
      </main>
    );
  }

  if (hasilAkhir) {
    return <HasilUji chapter={chapter} pekan={pekan} attempt={attempt} hasilAkhir={hasilAkhir} remedialSaja={remedialSaja} modeV3={modeV3} onUjiUlangSemua={() => mulaiUji()} />;
  }

  const soal = attempt.daftarSoal[indeks];
  const totalDijawab = attempt.daftarSoal.filter((s) => jawabanTerisi(s, jawaban[s.id])).length;

  return (
    <main className="halaman sempit uji-pemahaman">
      <div className="bar-pelajaran">
        <span className="breadcrumb">
          {chapter.ikon} {modeV3 ? 'Latihan V-3' : 'Uji Pemahaman'} — {chapter.judul}
        </span>
        <span className="teks-redup">
          Soal {indeks + 1}/{attempt.daftarSoal.length} · terjawab {totalDijawab}/{attempt.daftarSoal.length}
        </span>
      </div>

      <div className="kartu-soal">
        <SoalTampil soal={soal} jawaban={jawaban[soal.id]} setJawaban={(v) => setJawaban((j) => ({ ...j, [soal.id]: v }))} gelap={progJs.temaAktif === 'gelap'} />
      </div>

      <div className="nav-soal">
        <button className="tombol tombol-kedua" disabled={indeks === 0} onClick={() => setIndeks((i) => i - 1)}>
          ‹ Sebelumnya
        </button>
        <div className="titik-soal">
          {attempt.daftarSoal.map((s, i) => (
            <button key={s.id} className={`titik ${i === indeks ? 'aktif' : ''} ${jawabanTerisi(s, jawaban[s.id]) ? 'terisi' : ''}`} onClick={() => setIndeks(i)} aria-label={`Soal ${i + 1}`} />
          ))}
        </div>
        {indeks < attempt.daftarSoal.length - 1 ? (
          <button className="tombol tombol-kedua" onClick={() => setIndeks((i) => i + 1)}>
            Berikutnya ›
          </button>
        ) : (
          <button className="tombol tombol-lanjut" disabled={menilai} onClick={selesaikanUji}>
            {menilai ? 'Menilai…' : 'Selesai ✓'}
          </button>
        )}
      </div>
    </main>
  );
}

function jawabanTerisi(soal, v) {
  if (soal.tipe === 'pilihan-ganda') return typeof v === 'number';
  if (soal.tipe === 'kode-singkat') return true; // selalu ada kodeAwal
  return typeof v === 'string' && v.trim() !== '';
}

async function nilaiSatuSoal(soal, jawabanUser) {
  if (soal.tipe === 'pilihan-ganda') {
    const idxBenar = soal.pilihan.findIndex((p) => p.benar);
    return { benar: jawabanUser === idxBenar };
  }
  if (soal.tipe === 'isian-singkat') {
    return { benar: cocokKunci(jawabanUser, soal.kunci) };
  }
  if (soal.tipe === 'prediksi-output') {
    const run = await jalankanCuplikan(soal.kode, soal.kelasUtama ?? 'Main');
    return { benar: run.berhasil && samaOutput(jawabanUser ?? '', run.stdout), keluaranAsli: run.stdout };
  }
  if (soal.tipe === 'kode-singkat') {
    const r = await jalankanKodeOutput({ berkas: jawabanUser ?? soal.kodeAwal, kelasUtama: soal.kelasUtama, tes: soal.tes });
    return { benar: r.hasil.length > 0 && r.hasil.every((h) => h.lulus) };
  }
  return { benar: false };
}

function SoalTampil({ soal, jawaban, setJawaban, gelap }) {
  if (soal.tipe === 'pilihan-ganda') {
    return (
      <div className="panel-soal-uji">
        <Markdown>{soal.pertanyaan}</Markdown>
        {soal.kode && <EditorJava berkas={[{ nama: 'Cuplikan.java', isi: soal.kode }]} onUbah={() => {}} onJalankan={() => {}} gelap={gelap} readOnly />}
        <div className="pilihan-ganda">
          {soal.pilihan.map((p, i) => (
            <label key={i} className={`pilihan-item ${jawaban === i ? 'dipilih' : ''}`}>
              <input type="radio" name={soal.id} checked={jawaban === i} onChange={() => setJawaban(i)} />
              {p.teks}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (soal.tipe === 'isian-singkat') {
    return (
      <div className="panel-soal-uji">
        <Markdown>{soal.pertanyaan}</Markdown>
        {soal.kode && <EditorJava berkas={[{ nama: 'Cuplikan.java', isi: soal.kode }]} onUbah={() => {}} onJalankan={() => {}} gelap={gelap} readOnly />}
        <input className="isian-singkat" type="text" value={jawaban ?? ''} onChange={(e) => setJawaban(e.target.value)} placeholder="Jawabanmu…" />
      </div>
    );
  }
  if (soal.tipe === 'prediksi-output') {
    return (
      <div className="panel-soal-uji">
        <p className="label-panel-soal">Tulis prediksi SEMUA baris keluaran cuplikan berikut (tanpa menjalankannya):</p>
        <EditorJava berkas={[{ nama: `${soal.kelasUtama ?? 'Main'}.java`, isi: soal.kode }]} onUbah={() => {}} onJalankan={() => {}} gelap={gelap} readOnly />
        <textarea className="area-prediksi" rows={6} value={jawaban ?? ''} onChange={(e) => setJawaban(e.target.value)} placeholder="Prediksi keluaran…" />
      </div>
    );
  }
  // kode-singkat
  return (
    <div className="panel-soal-uji">
      <Markdown>{soal.instruksi}</Markdown>
      <div style={{ height: 260 }}>
        <EditorJava berkas={jawaban ?? soal.kodeAwal} onUbah={(nama, isi) => setJawaban((b) => (b ?? soal.kodeAwal).map((f) => (f.nama === nama ? { ...f, isi } : f)))} onJalankan={() => {}} gelap={gelap} />
      </div>
    </div>
  );
}

function HasilUji({ chapter, pekan, attempt, hasilAkhir, remedialSaja, modeV3, onUjiUlangSemua }) {
  const navigate = useNavigate();
  const totalBenar = Object.values(hasilAkhir.perLesson).reduce((a, r) => a + r.benar, 0);
  const totalSoal = Object.values(hasilAkhir.perLesson).reduce((a, r) => a + r.total, 0);
  const semuaLolos = Object.values(hasilAkhir.perLesson).every((r) => r.benar === r.total);
  const gagalIds = Object.entries(hasilAkhir.perLesson).filter(([, r]) => r.benar !== r.total).map(([id]) => id);

  return (
    <main className="halaman sempit">
      <h1>{modeV3 ? '🎯 Hasil Latihan V-3' : semuaLolos ? '🎉 Semua benar!' : '📋 Hasil Uji Pemahaman'}</h1>
      <p>
        {totalBenar}/{totalSoal} soal benar.{' '}
        {modeV3
          ? 'Ini murni catatan latihan untuk persiapan V-3 di kelas — tidak mengubah status pelajaran atau progress-mu.'
          : semuaLolos
            ? `Seluruh ${remedialSaja ? 'bagian yang diulang' : chapter.judul} ditandai selesai.`
            : `${gagalIds.length} pelajaran perlu diulang — sisanya sudah ditandai selesai.`}
      </p>

      <div className="daftar-hasil-uji">
        {chapter.pelajaran
          .filter((p) => hasilAkhir.perLesson[p.id])
          .map((p) => {
            const r = hasilAkhir.perLesson[p.id];
            const lolos = r.benar === r.total;
            return (
              <div key={p.id} className={`hasil-uji-lesson ${lolos ? 'lolos' : 'gagal'}`}>
                <span className="tes-ikon">{lolos ? '✅' : '❌'}</span>
                <span className="item-judul">{p.judul}</span>
                <span className="teks-redup">
                  {r.benar}/{r.total}
                </span>
                {!lolos && !modeV3 && (
                  <Link className="tombol tombol-kedua kecil" to={`/java/belajar/${p.id}`}>
                    Kerjakan →
                  </Link>
                )}
              </div>
            );
          })}
      </div>

      {!semuaLolos && (
        <div className="tinjauan-soal">
          <h2>Tinjauan soal yang keliru</h2>
          {attempt.daftarSoal
            .filter((s) => !hasilAkhir.perSoal[s.id].benar)
            .map((s) => (
              <div key={s.id} className="kotak-petunjuk">
                <Markdown>{s.penjelasan}</Markdown>
              </div>
            ))}
        </div>
      )}

      <div className="modal-tombol">
        {!semuaLolos && !remedialSaja && !modeV3 && (
          <button className="tombol tombol-kedua" onClick={() => navigate(`/java/uji/${pekan}?remedial=1`)}>
            🔁 Uji ulang bagian yang salah
          </button>
        )}
        {!semuaLolos && (
          <button className="tombol tombol-kedua" onClick={onUjiUlangSemua}>
            {modeV3 ? 'Latihan V-3 lagi (soal baru)' : remedialSaja ? 'Coba lagi (soal baru)' : 'Uji ulang semua (soal baru)'}
          </button>
        )}
        <Link className="tombol tombol-lanjut" to="/">
          Ke beranda →
        </Link>
      </div>
    </main>
  );
}
