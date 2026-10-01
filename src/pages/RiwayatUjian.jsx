import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ujianById } from '../ujian/index.js';
import { ambilPercobaan, daftarRiwayat, hapusPercobaan, hapusSemuaRiwayat, MAKS_PER_UJIAN } from '../state/riwayatUjian.js';
import { HasilUjian, formatWaktu } from './Ujian.jsx';

// ---------- Daftar riwayat ----------

export function RiwayatDaftar() {
  const [params, setParams] = useSearchParams();
  const [semua, setSemua] = useState(() => daftarRiwayat().filter((p) => ujianById[p.ujianId]));
  const filter = ujianById[params.get('ujian')] ? params.get('ujian') : null;

  const ujianAda = useMemo(() => [...new Set(semua.map((p) => p.ujianId))].map((id) => ujianById[id]), [semua]);
  const tampil = filter ? semua.filter((p) => p.ujianId === filter) : semua;

  const hapus = (p) => {
    if (!window.confirm('Hapus percobaan ini dari riwayat? Skor terbaik dan status lulusmu tidak berubah.')) return;
    hapusPercobaan(p.id);
    setSemua((s) => s.filter((x) => x.id !== p.id));
  };
  const hapusSemua = () => {
    if (!window.confirm('Hapus SELURUH riwayat ujian di perangkat ini? Skor terbaik dan status lulusmu tidak berubah.')) return;
    hapusSemuaRiwayat();
    setSemua([]);
  };

  return (
    <main className="halaman sempit">
      <p className="hero-kecil">Belajar dari kesalahan</p>
      <h1>📜 Riwayat Ujian</h1>
      <p className="teks-redup">
        Setiap kali selesai ujian, jawaban dan pembahasannya tersimpan di sini. Buka lagi kapan saja untuk melihat soal mana yang keliru dan kenapa. Riwayat
        disimpan di perangkat ini (maksimal {MAKS_PER_UJIAN} percobaan terakhir per ujian).
      </p>

      {semua.length === 0 ? (
        <section className="kartu-setelan">
          <p>Belum ada riwayat. Selesaikan satu ujian dan hasilnya akan muncul di sini.</p>
          <Link className="tombol" to="/">
            ← Ke beranda
          </Link>
        </section>
      ) : (
        <>
          {ujianAda.length > 1 && (
            <div className="filter-tinjauan filter-riwayat" role="tablist" aria-label="Filter ujian">
              <button role="tab" aria-selected={!filter} className={!filter ? 'aktif' : ''} onClick={() => setParams({})}>
                Semua ({semua.length})
              </button>
              {ujianAda.map((u) => (
                <button
                  key={u.id}
                  role="tab"
                  aria-selected={filter === u.id}
                  className={filter === u.id ? 'aktif' : ''}
                  onClick={() => setParams({ ujian: u.id })}
                >
                  {u.ikon} {u.judul} ({semua.filter((p) => p.ujianId === u.id).length})
                </button>
              ))}
            </div>
          )}

          {filter && <RingkasanTren ujian={ujianById[filter]} percobaan={tampil} />}

          <div className="daftar-riwayat">
            {tampil.map((p, i) => {
              const u = ujianById[p.ujianId];
              const salah = p.soal.filter((s) => !s.benar).length;
              // bandingkan dengan percobaan sebelumnya pada ujian yang sama (daftar terurut terbaru → lama)
              const sebelumnya = tampil.slice(i + 1).find((x) => x.ujianId === p.ujianId);
              const selisih = sebelumnya ? p.persen - sebelumnya.persen : null;
              return (
                <article key={p.id} className={`kartu-riwayat ${p.lulus ? 'lulus' : ''}`}>
                  <Link to={`/riwayat/${p.id}`} className="kartu-riwayat-isi">
                    <div className="riwayat-skor">{p.persen}%</div>
                    <div className="riwayat-info">
                      <b>
                        {u.ikon} {u.judul}
                      </b>
                      <span className="teks-redup">{formatWaktu(p.waktu)}</span>
                      <span className="riwayat-chip-baris">
                        <span className={`chip ${p.lulus ? 'chip-lulus' : 'chip-belum'}`}>{p.lulus ? '✅ Lulus' : '🔁 Belum lulus'}</span>
                        <span className="chip">
                          {p.soal.length - salah}/{p.soal.length} benar
                        </span>
                        {salah > 0 && <span className="chip chip-belum">❌ {salah} keliru</span>}
                        {selisih !== null && selisih !== 0 && (
                          <span className={`chip ${selisih > 0 ? 'chip-lulus' : ''}`}>
                            {selisih > 0 ? '▲' : '▼'} {Math.abs(selisih)}%
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="riwayat-tinjau">Tinjau →</span>
                  </Link>
                  <button className="tombol-ikon" title="Hapus dari riwayat" aria-label="Hapus dari riwayat" onClick={() => hapus(p)}>
                    🗑️
                  </button>
                </article>
              );
            })}
          </div>

          <div className="baris-tombol">
            <Link className="tombol tombol-kedua" to="/">
              ← Ke beranda
            </Link>
            <button className="tombol tombol-kedua kecil" onClick={hapusSemua}>
              🗑️ Hapus semua riwayat
            </button>
          </div>
        </>
      )}
    </main>
  );
}

/** Grafik batang sederhana: skor tiap percobaan (kiri = paling lama), dengan garis batas lulus. */
function RingkasanTren({ ujian, percobaan }) {
  const urut = [...percobaan].reverse();
  const terbaik = Math.max(...percobaan.map((p) => p.persen));
  return (
    <section className="kartu-setelan">
      <h2>
        {ujian.ikon} {ujian.judul}
      </h2>
      <p className="teks-redup">
        {percobaan.length} percobaan tersimpan · skor terbaik <b>{terbaik}%</b> · batas lulus {ujian.lulus}%
      </p>
      {urut.length > 1 && (
        <div className="tren-skor" role="img" aria-label={`Skor tiap percobaan: ${urut.map((p) => `${p.persen}%`).join(', ')}`}>
          <div className="tren-batas" style={{ bottom: `${ujian.lulus}%` }} />
          {urut.map((p) => (
            <div key={p.id} className="tren-kolom" title={`${formatWaktu(p.waktu)} — ${p.persen}%`}>
              <div className={`tren-batang ${p.lulus ? 'lulus' : ''}`} style={{ height: `${Math.max(p.persen, 3)}%` }} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- Tinjauan satu percobaan ----------

/** Susun ulang data percobaan menjadi bentuk yang dipakai HasilUjian; soal yang sudah hilang dari bank dilewati. */
function susunHasil(p, ujian) {
  const daftarSoal = [];
  const benar = {};
  const urutan = {};
  const jawaban = {};
  const pesan = {};
  let hilang = 0;
  for (const rec of p.soal) {
    const s = ujian.soal.find((x) => x.id === rec.id);
    const urutanSah = s?.tipe === 'pilihan-ganda' && Array.isArray(rec.urutan) && rec.urutan.length === s.pilihan.length;
    if (!s || (s.tipe === 'pilihan-ganda' && !urutanSah)) {
      hilang++;
      continue;
    }
    daftarSoal.push(s);
    benar[s.id] = rec.benar;
    jawaban[s.id] = rec.jawaban;
    pesan[s.id] = rec.pesan;
    if (urutanSah) urutan[s.id] = rec.urutan;
  }
  const { persen, poin, maks, lulus, perChapter } = p;
  return { hilang, hasil: { ringkasan: { persen, poin, maks, lulus, perChapter }, benar, pesan, pertamaLulus: false, daftarSoal, urutan, jawaban } };
}

export function RiwayatDetail() {
  const { rid } = useParams();
  const p = useMemo(() => ambilPercobaan(rid), [rid]);
  const ujian = p ? ujianById[p.ujianId] : null;
  const disusun = useMemo(() => (p && ujian ? susunHasil(p, ujian) : null), [p, ujian]);

  if (!p || !ujian || !disusun) {
    return (
      <main className="halaman sempit">
        <h1>Riwayat tidak ditemukan 🤔</h1>
        <p className="teks-redup">Percobaan ini mungkin sudah dihapus, atau tersimpan di perangkat lain.</p>
        <Link className="tombol" to="/riwayat">
          ← Semua riwayat
        </Link>
      </main>
    );
  }
  return <HasilUjian key={p.id} ujian={ujian} hasil={disusun.hasil} riwayatWaktu={p.waktu} jumlahHilang={disusun.hilang} />;
}
