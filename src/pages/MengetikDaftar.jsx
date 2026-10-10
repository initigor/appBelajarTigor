import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PapanKetik, { LegendaJari } from '../components/PapanKetik.jsx';
import { useProgress } from '../state/progress.jsx';
import { GRUP_SIMBOL, JALUR, semuaTahap, tahapDisarankan } from '../mengetik/latihan.js';

const sebut = (c) => (c === ' ' ? '␣' : c);

function KartuTahap({ tahap, hasil, disarankan }) {
  const bintang = hasil?.bintang ?? 0;
  return (
    <Link to={`/mengetik/${tahap.id}`} className={`kartu-ketik ${hasil ? 'selesai' : ''} ${disarankan ? 'disarankan' : ''}`}>
      <div className="kartu-ketik-atas">
        <span className="kartu-ketik-ikon" aria-hidden="true">
          {tahap.ikon}
        </span>
        <span className="bintang-baris" aria-label={`${bintang} dari 3 bintang`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= bintang ? 'nyala' : ''} aria-hidden="true">
              ★
            </span>
          ))}
        </span>
      </div>
      <h3>{tahap.judul}</h3>
      <p className="teks-redup">{tahap.ringkas}</p>
      <div className="kartu-ketik-fokus" aria-label="Karakter yang dilatih">
        {tahap.fokus.slice(0, 12).map((c, i) => (
          <kbd key={`${c}-${i}`}>{sebut(c)}</kbd>
        ))}
      </div>
      <p className="kartu-ketik-bawah">
        {hasil ? (
          <span>
            Terbaik: {hasil.wpm} WPM · {hasil.akurasi}%
          </span>
        ) : disarankan ? (
          <span className="aksen">Mulai dari sini →</span>
        ) : (
          <span className="teks-redup">Belum dicoba</span>
        )}
      </p>
    </Link>
  );
}

function LatihanBebas() {
  const [dipilih, setDipilih] = useState(() => new Set());
  const [jumlah, setJumlah] = useState(8);
  const toggle = (c) =>
    setDipilih((s) => {
      const baru = new Set(s);
      if (baru.has(c)) baru.delete(c);
      else baru.add(c);
      return baru;
    });
  const grupPenuh = (g) => g.simbol.every((c) => dipilih.has(c));
  const toggleGrup = (g) =>
    setDipilih((s) => {
      const baru = new Set(s);
      const penuh = g.simbol.every((c) => baru.has(c));
      for (const c of g.simbol) {
        if (penuh) baru.delete(c);
        else baru.add(c);
      }
      return baru;
    });
  const tujuan = `/mengetik/bebas?${new URLSearchParams({ k: [...dipilih].join(''), n: String(jumlah) })}`;

  return (
    <section className="ketik-bebas">
      <h2>🎛️ Latihan Bebas: pilih tanda baca yang mau difokuskan</h2>
      <p className="teks-redup">
        Merasa kurang lancar di beberapa simbol saja? Pilih simbolnya, lalu dapatkan baris latihan acak yang hanya berisi simbol
        itu (dicampur kata pendek).
      </p>
      <div className="bebas-grup">
        {GRUP_SIMBOL.map((g) => (
          <div key={g.label} className="bebas-grup-baris">
            <button type="button" className={`bebas-judul ${grupPenuh(g) ? 'aktif' : ''}`} onClick={() => toggleGrup(g)} title="Pilih/batalkan seluruh kelompok">
              {g.label}
            </button>
            <div className="bebas-simbol">
              {g.simbol.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`bebas-chip ${dipilih.has(c) ? 'aktif' : ''}`}
                  aria-pressed={dipilih.has(c)}
                  onClick={() => toggle(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bebas-aksi">
        <label>
          Jumlah baris{' '}
          <select value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))}>
            {[5, 8, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {dipilih.size > 0 ? (
          <Link className="tombol" to={tujuan}>
            Mulai latihan ({dipilih.size} simbol) →
          </Link>
        ) : (
          <button type="button" className="tombol" disabled>
            Pilih minimal satu simbol
          </button>
        )}
      </div>
    </section>
  );
}

export default function MengetikDaftar() {
  const { data } = useProgress();
  const hasil = data.mengetik ?? {};
  const disarankan = useMemo(() => tahapDisarankan(hasil), [hasil]);

  const selesai = semuaTahap.filter((t) => hasil[t.id]).length;
  const bintang = semuaTahap.reduce((a, t) => a + (hasil[t.id]?.bintang ?? 0), 0);
  const wpmTerbaik = Object.values(hasil).reduce((a, h) => Math.max(a, h.wpm ?? 0), 0);

  return (
    <main className="halaman">
      <section className="hero ketik-hero">
        <div>
          <p className="hero-kecil">Latihan jari</p>
          <h1>⌨️ Latihan Mengetik untuk Ngoding</h1>
          <p className="hero-deskripsi">
            Bukan menghafal sintaks, tapi melatih jari untuk tanda baca yang paling sering dipakai programmer:{' '}
            <code>( ) [ ] {'{ }'} &lt; &gt; ; : &quot; ` _ = + - * / !</code>. Ada animasi tangan yang menunjukkan tombol
            dan jari yang tepat untuk setiap karakter.
          </p>
          {disarankan ? (
            <Link className="tombol tombol-besar" to={`/mengetik/${disarankan.id}`}>
              {selesai === 0 ? 'Mulai latihan' : 'Lanjutkan'} → {disarankan.judul}
            </Link>
          ) : (
            <p className="selamat">🎉 Semua tahap sudah dicoba. Ulangi untuk mengejar ★★★!</p>
          )}
        </div>
        <div className="statistik">
          <div className="stat">
            <span className="stat-angka">
              ✅ {selesai}/{semuaTahap.length}
            </span>
            <span className="stat-label">tahap dicoba</span>
          </div>
          <div className="stat">
            <span className="stat-angka">
              ★ {bintang}/{semuaTahap.length * 3}
            </span>
            <span className="stat-label">bintang</span>
          </div>
          <div className="stat">
            <span className="stat-angka">🚀 {wpmTerbaik}</span>
            <span className="stat-label">WPM terbaik</span>
          </div>
        </div>
      </section>

      <section className="ketik-panduan">
        <div className="ketik-panduan-papan">
          <h2>Posisi awal jari</h2>
          <PapanKetik />
          <LegendaJari />
        </div>
        <ul className="ketik-panduan-tips">
          <li>
            <b>Telunjuk di F dan J.</b> Rasakan tonjolan kecil di kedua tombol itu; jari lain bersebelahan di barisan rumah.
          </li>
          <li>
            <b>Setiap jari punya wilayah.</b> Warna di papan menunjukkan jari mana yang menekan tombol itu.
          </li>
          <li>
            <b>Shift dari tangan yang berlawanan.</b> <code>(</code> adalah 9 (kanan), jadi Shift ditekan kelingking kiri.
          </li>
          <li>
            <b>Kembali ke barisan rumah</b> setelah menekan, jangan melayang. Pelan dan benar dulu, cepat menyusul.
          </li>
        </ul>
      </section>

      {JALUR.map((j) => (
        <section key={j.id} className="ketik-jalur-blok">
          <div className="ketik-jalur-kepala">
            <h2>
              <span aria-hidden="true">{j.ikon}</span> {j.judul}
            </h2>
            <p className="teks-redup">{j.deskripsi}</p>
          </div>
          <div className="kartu-ketik-grid">
            {j.tahap.map((t) => (
              <KartuTahap key={t.id} tahap={t} hasil={hasil[t.id]} disarankan={disarankan?.id === t.id} />
            ))}
          </div>
        </section>
      ))}

      <LatihanBebas />
    </main>
  );
}
