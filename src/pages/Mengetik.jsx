import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PapanKetik, { LegendaJari } from '../components/PapanKetik.jsx';
import { useProgress } from '../state/progress.jsx';
import { buatLatihanBebas, jalurDariTahap, SEMUA_SIMBOL, tahapBerikutnya, tahapById } from '../mengetik/latihan.js';
import { hitungBintang, ketik, mulaiSesi, normalisasi, ringkas } from '../mengetik/mesin.js';
import { infoKarakter, namaTombol, petunjuk } from '../mengetik/papan.js';

const KUNCI_PREF = 'latihkode:mengetik-pref:v1';
const PREF_AWAL = { tangan: true, label: true, petunjuk: true };

function muatPref() {
  try {
    return { ...PREF_AWAL, ...JSON.parse(localStorage.getItem(KUNCI_PREF) ?? '{}') };
  } catch {
    return PREF_AWAL;
  }
}

const sebutKarakter = (c) => (c === ' ' ? 'Spasi' : c === '\n' ? 'Enter' : c);

/** Teks latihan: karakter yang sudah benar, yang sedang dituju, dan yang belum. */
function AreaTeks({ teks, pos, salah }) {
  const baris = teks.split('\n');
  let awal = 0;
  return (
    <div className="ketik-teks" aria-hidden="true">
      {baris.map((b, bi) => {
        const mulai = awal;
        awal += b.length + 1;
        const akhir = mulai + b.length;
        const status = (i) => (i < pos ? 'ok' : i === pos ? 'sekarang' : 'belum');
        return (
          <div key={bi} className={`ketik-baris ${pos > akhir ? 'tuntas' : ''} ${pos >= mulai && pos <= akhir ? 'aktif' : ''}`}>
            {[...b].map((c, i) => {
              const s = status(mulai + i);
              return (
                <span key={`${i}-${s === 'sekarang' ? (salah?.n ?? 0) : 0}`} className={`${s} ${s === 'sekarang' && salah ? 'salah' : ''}`}>
                  {c}
                </span>
              );
            })}
            {bi < baris.length - 1 && (
              <span key={`e-${status(akhir) === 'sekarang' ? (salah?.n ?? 0) : 0}`} className={`enter ${status(akhir)} ${status(akhir) === 'sekarang' && salah ? 'salah' : ''}`}>
                ↵
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Bintang({ n, besar = false }) {
  return (
    <span className={`bintang-baris ${besar ? 'besar' : ''}`} aria-label={`${n} dari 3 bintang`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'nyala' : ''} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export default function Mengetik() {
  const { id } = useParams();
  const [qs] = useSearchParams();
  const { data, terapkanHasilMengetik } = useProgress();

  const bebas = id === 'bebas';
  const simbolBebas = useMemo(() => [...new Set([...(qs.get('k') ?? '')].filter((c) => SEMUA_SIMBOL.includes(c)))], [qs]);
  const jumlahBebas = Math.min(15, Math.max(4, Number(qs.get('n')) || 8));
  const tahap = bebas ? null : tahapById(id);

  const [putaran, setPutaran] = useState(0);
  const baris = useMemo(
    () => (bebas ? buatLatihanBebas(simbolBebas, jumlahBebas) : (tahap?.baris ?? [])),
    // putaran: "Ulangi" pada latihan bebas menyusun baris acak yang baru
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bebas, simbolBebas, jumlahBebas, tahap, putaran],
  );

  const [sesi, setSesi] = useState(() => mulaiSesi(baris));
  useEffect(() => setSesi(mulaiSesi(baris)), [baris]);

  const [pref, setPref] = useState(muatPref);
  const ubahPref = (kunci) =>
    setPref((p) => {
      const baru = { ...p, [kunci]: !p[kunci] };
      try {
        localStorage.setItem(KUNCI_PREF, JSON.stringify(baru));
      } catch {
        /* penyimpanan diblokir: preferensi hanya berlaku selama sesi */
      }
      return baru;
    });

  // ---------- menangkap ketikan ----------
  const inputRef = useRef(null);
  const [fokus, setFokus] = useState(false);
  const kirim = useCallback((ch) => setSesi((s) => ketik(s, ch, Date.now())), []);

  const ulang = useCallback(() => {
    setSesi(mulaiSesi(baris));
    setPutaran((n) => n + 1);
    inputRef.current?.focus({ preventScroll: true });
  }, [baris]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return undefined;
    el.focus({ preventScroll: true });
    const proses = (teks) => {
      for (const ch of normalisasi(teks)) kirim(ch);
    };
    // Keyboard layar sentuh jarang mengirim `key` yang jelas, jadi dibaca dari beforeinput/input.
    const sebelumInput = (e) => {
      if (e.isComposing) return;
      if (e.inputType === 'insertText' && e.data) {
        e.preventDefault();
        proses(e.data);
      } else if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
        e.preventDefault();
        kirim('\n');
      } else if (e.inputType?.startsWith('insertFrom')) {
        e.preventDefault(); // tempel/seret tidak dihitung
      }
    };
    const sisa = () => {
      if (el.value) {
        proses(el.value);
        el.value = '';
      }
    };
    el.addEventListener('beforeinput', sebelumInput);
    el.addEventListener('input', sisa);
    return () => {
      el.removeEventListener('beforeinput', sebelumInput);
      el.removeEventListener('input', sisa);
    };
  }, [kirim, tahap, bebas]);

  const tekanTombol = (e) => {
    if (e.metaKey || e.ctrlKey) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      ulang();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      kirim('\n');
    } else if (e.key.length === 1) {
      e.preventDefault(); // juga mencegah spasi menggulir halaman
      kirim(normalisasi(e.key));
    }
  };

  // ---------- hasil ----------
  const hasil = useMemo(() => ringkas(sesi), [sesi]);
  const bintang = sesi.selesai ? hitungBintang(hasil, tahap?.target ?? 0) : 0;
  const tersimpan = useRef(null);
  useEffect(() => {
    if (!sesi.selesai) {
      tersimpan.current = null;
      return;
    }
    if (bebas || !tahap || tersimpan.current === sesi) return;
    tersimpan.current = sesi;
    terapkanHasilMengetik(tahap.id, { bintang, wpm: hasil.wpm, akurasi: hasil.akurasi });
  }, [sesi, bebas, tahap, bintang, hasil.wpm, hasil.akurasi, terapkanHasilMengetik]);

  if (!bebas && !tahap) {
    return (
      <main className="halaman sempit">
        <h1>Latihan tidak ditemukan 😵</h1>
        <Link className="tombol" to="/mengetik">
          Kembali ke daftar latihan
        </Link>
      </main>
    );
  }
  if (bebas && baris.length === 0) {
    return (
      <main className="halaman sempit">
        <h1>Pilih tanda baca dulu</h1>
        <p className="teks-redup">Latihan bebas dibuat dari tanda baca yang kamu pilih di halaman latihan mengetik.</p>
        <Link className="tombol" to="/mengetik">
          Pilih tanda baca
        </Link>
      </main>
    );
  }

  const sasaran = sesi.selesai ? null : sesi.teks[sesi.pos];
  const infoSasaran = sasaran != null ? infoKarakter(sasaran) : null;
  const judul = bebas ? 'Latihan bebas tanda baca' : tahap.judul;
  const jalur = bebas ? null : jalurDariTahap(tahap.id);
  const berikutnya = bebas ? null : tahapBerikutnya(tahap.id);
  const rekor = bebas ? null : data.mengetik?.[tahap.id];
  const salahSimbol = hasil.lemah.map((l) => l.ch).filter((c) => SEMUA_SIMBOL.includes(c));
  const urlLatihSalah = salahSimbol.length ? `/mengetik/bebas?${new URLSearchParams({ k: salahSimbol.join(''), n: '8' })}` : null;
  const mulaiMengetik = sesi.terakhir !== null;

  return (
    <main className="halaman ketik-halaman">
      <div className="ketik-atas">
        <Link to="/mengetik" className="link-kecil">
          ← Semua latihan
        </Link>
        <span className="teks-redup ketik-jalur">{bebas ? 'Latihan bebas' : jalur?.judul}</span>
      </div>

      <header className="ketik-kepala">
        <div>
          <h1>
            {!bebas && <span className="ketik-ikon">{tahap.ikon}</span>} {judul}
          </h1>
          <p className="teks-redup">
            {bebas ? `Fokus: ${simbolBebas.join('  ')}` : tahap.ringkas}
          </p>
        </div>
        {rekor && (
          <div className="ketik-rekor" title="Rekor terbaikmu di tahap ini">
            <Bintang n={rekor.bintang} />
            <span>
              {rekor.wpm} WPM · {rekor.akurasi}%
            </span>
          </div>
        )}
      </header>

      {!bebas && <p className="ketik-tip">💡 {tahap.tip}</p>}

      <section className="ketik-kartu" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div className="ketik-statistik" role="status">
          <span>
            <b>{hasil.wpm}</b> WPM
          </span>
          <span>
            <b>{hasil.akurasi}%</b> akurasi
          </span>
          <span className={hasil.salah ? 'ada-salah' : ''}>
            <b>{hasil.salah}</b> salah
          </span>
          <span className="ketik-progres">
            <i style={{ width: `${hasil.persen}%` }} />
          </span>
        </div>

        <div className="ketik-area">
          <AreaTeks teks={sesi.teks} pos={sesi.pos} salah={sesi.salahTerakhir} />
          <textarea
            ref={inputRef}
            className="ketik-input"
            aria-label="Ketik teks latihan di sini"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            rows={1}
            onKeyDown={tekanTombol}
            onFocus={() => setFokus(true)}
            onBlur={() => setFokus(false)}
          />
          {!fokus && !sesi.selesai && (
            <button type="button" className="ketik-fokus" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
              <span>⌨️ Klik atau ketuk di sini, lalu mulai mengetik</span>
            </button>
          )}
        </div>

        {!sesi.selesai && (
          <div className="ketik-petunjuk" aria-live="polite">
            {pref.petunjuk && infoSasaran ? (
              <>
                <kbd className="ketik-kbd">{sebutKarakter(sasaran)}</kbd>
                <span>
                  {mulaiMengetik ? 'Berikutnya' : 'Mulai dengan'}: <b>{petunjuk(sasaran)}</b>
                  {infoSasaran.shift && <span className="teks-redup"> · tahan Shift lalu tekan tombolnya</span>}
                </span>
              </>
            ) : (
              <span className="teks-redup">Petunjuk jari disembunyikan. Aktifkan lagi lewat opsi di bawah bila perlu.</span>
            )}
          </div>
        )}
      </section>

      {sesi.selesai && (
        <section className="ketik-hasil" aria-live="polite">
          <h2>{bintang === 3 ? '🎉 Sempurna!' : bintang === 2 ? '👏 Bagus!' : '✅ Selesai'}</h2>
          <Bintang n={bintang} besar />
          <div className="ketik-hasil-angka">
            <div>
              <b>{hasil.wpm}</b>
              <span>WPM</span>
            </div>
            <div>
              <b>{hasil.akurasi}%</b>
              <span>akurasi</span>
            </div>
            <div>
              <b>{hasil.salah}</b>
              <span>salah ketik</span>
            </div>
            <div>
              <b>{Math.round(hasil.aktifMs / 1000)}s</b>
              <span>waktu aktif</span>
            </div>
          </div>
          {!bebas && (
            <p className="teks-redup">
              {bintang === 3
                ? 'Akurasi tinggi dan kecepatan mencapai target tahap ini.'
                : `Untuk ★★: akurasi ≥ 92%. Untuk ★★★: akurasi ≥ 97% dan ≥ ${tahap.target} WPM.`}
            </p>
          )}
          {hasil.lemah.length > 0 && (
            <div className="ketik-lemah">
              <h3>Yang masih sering salah</h3>
              <ul>
                {hasil.lemah.slice(0, 8).map((l) => (
                  <li key={l.ch} title={petunjuk(l.ch)}>
                    <kbd className="ketik-kbd">{sebutKarakter(l.ch)}</kbd>
                    <span>
                      {l.salah}× salah · {namaTombol(l.ch)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="ketik-aksi">
            <button type="button" className="tombol" onClick={ulang}>
              🔁 Ulangi
            </button>
            {berikutnya && (
              <Link className="tombol tombol-kedua" to={`/mengetik/${berikutnya.id}`}>
                Berikutnya: {berikutnya.judul} →
              </Link>
            )}
            {urlLatihSalah && (
              <Link className="tombol tombol-kedua" to={urlLatihSalah}>
                🎯 Latih tanda baca yang salah
              </Link>
            )}
            <Link className="tombol tombol-kedua" to="/mengetik">
              Semua latihan
            </Link>
          </div>
        </section>
      )}

      <section className="ketik-papan" aria-label="Panduan papan ketik dan tangan">
        <div className="ketik-opsi">
          <label>
            <input type="checkbox" checked={pref.tangan} onChange={() => ubahPref('tangan')} /> Tampilkan tangan
          </label>
          <label>
            <input type="checkbox" checked={pref.label} onChange={() => ubahPref('label')} /> Label tombol
          </label>
          <label>
            <input type="checkbox" checked={pref.petunjuk} onChange={() => ubahPref('petunjuk')} /> Petunjuk jari
          </label>
          <button type="button" className="tombol tombol-kedua kecil" onClick={ulang}>
            🔁 Mulai ulang <span className="teks-redup">(Esc)</span>
          </button>
        </div>
        <PapanKetik karakter={sasaran} salah={sesi.salahTerakhir} tangan={pref.tangan} label={pref.label} />
        <LegendaJari />
        <p className="teks-redup ketik-catatan">
          Salah ketik tidak memajukan teks: cari tombol yang tepat dengan jari yang tepat. Paling nyaman dengan keyboard fisik
          (laptop, atau keyboard iPad).
        </p>
      </section>
    </main>
  );
}
