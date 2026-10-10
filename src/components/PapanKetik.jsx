import '../mengetik/mengetik.css';
import { TOMBOL, infoKarakter, pusat, posisiRumah, PANGKAL, tombolById, urutanJari, petunjuk, NAMA_JARI } from '../mengetik/papan.js';

const PUSAT_RUMAH = { f: true, j: true };
const KUNCI_JARI = ['5', '4', '3', '2', '1'];

/** Satu jari: batang dari pangkal telapak sampai ujung, dan lingkaran ujung jari. Posisi digerakkan transisi CSS. */
function Jari({ kode, ujung, aktif }) {
  const pangkal = PANGKAL[kode];
  const dx = ujung.x - pangkal.x;
  const dy = ujung.y - pangkal.y;
  const panjang = Math.hypot(dx, dy);
  const sudut = (Math.atan2(-dx, dy) * 180) / Math.PI;
  return (
    <g className={`jari j${kode[1]} ${aktif ? 'aktif' : ''}`}>
      <rect
        className="jari-badan"
        x={-0.23}
        y={0}
        width={0.46}
        height={1}
        style={{ transform: `translate(${pangkal.x}px, ${pangkal.y}px) rotate(${sudut}deg) scaleY(${panjang})` }}
      />
      <circle className="jari-pangkal" cx={pangkal.x} cy={pangkal.y} r={0.3} />
      <circle className="jari-ujung" cx={0} cy={0} r={0.31} style={{ transform: `translate(${ujung.x}px, ${ujung.y}px)` }} />
    </g>
  );
}

/**
 * Papan ketik QWERTY + dua tangan beranimasi.
 * `karakter`: karakter yang harus diketik berikutnya (atau null = posisi istirahat).
 * `salah`: { n } bertambah tiap salah ketik, untuk memicu kilatan merah pada tombol yang dituju.
 */
export default function PapanKetik({ karakter = null, salah = null, tangan = true, label = true }) {
  const info = karakter != null ? infoKarakter(karakter) : null;
  const tombolSasaran = info ? tombolById(info.tombol) : null;
  const tombolShift = info?.shift ? tombolById(info.tombolShift) : null;

  const ujungJari = (kode) => {
    if (info && kode === info.jari && tombolSasaran) return pusat(tombolSasaran);
    if (info?.shift && kode === info.jariShift && tombolShift) return pusat(tombolShift);
    return posisiRumah(kode);
  };
  const jariAktif = new Set(info ? [info.jari, ...(info.shift ? [info.jariShift] : [])] : []);

  const tinggi = tangan ? 8.3 : 5.6;
  const deskripsi = karakter != null && info ? `Ketik ${petunjuk(karakter)}` : 'Posisi awal jari di atas papan ketik';

  return (
    <svg className="papan-ketik" viewBox={`-0.3 -0.3 15.6 ${tinggi}`} role="img" aria-label={deskripsi}>
      {TOMBOL.map((t) => {
        const sasaran = tombolSasaran?.id === t.id;
        const sebagaiShift = tombolShift?.id === t.id;
        const hurufTunggal = t.polos && t.atas && /[a-z]/.test(t.polos);
        const kilat = sasaran && salah ? salah.n : 0;
        return (
          <g
            key={`${t.id}-${kilat}`}
            className={`tb j${t.jari[1]} ${sasaran ? 'sasaran' : ''} ${sebagaiShift ? 'sasaran shift' : ''} ${kilat ? 'kilat-salah' : ''}`}
            transform={`translate(${t.x} ${t.y})`}
          >
            <rect x={0.04} y={0.04} width={t.w - 0.08} height={0.92} rx={0.14} />
            {/* Teks digambar dalam skala 100x lalu diperkecil, supaya ukuran huruf tidak terkena batas minimum font browser. */}
            {label && (
              <g transform="scale(0.01)">
                {hurufTunggal && (
                  <text x={(t.w / 2) * 100} y={64} className="huruf">
                    {t.atas}
                  </text>
                )}
                {!hurufTunggal && t.polos && t.atas && (
                  <>
                    <text x={(t.w / 2) * 100} y={40} className="kecil">
                      {t.atas}
                    </text>
                    <text x={(t.w / 2) * 100} y={80} className="kecil">
                      {t.polos}
                    </text>
                  </>
                )}
                {!t.atas && t.label && (
                  <text x={(t.w / 2) * 100} y={60} className="khusus">
                    {t.label}
                  </text>
                )}
              </g>
            )}
            {PUSAT_RUMAH[t.id] && <rect className="tonjolan" x={t.w / 2 - 0.2} y={0.8} width={0.4} height={0.05} rx={0.025} />}
          </g>
        );
      })}

      {tangan && (
        <g className="tangan" aria-hidden="true">
          <rect className="telapak" x={1.15} y={5.95} width={6.05} height={1.9} rx={0.95} />
          <rect className="telapak" x={7.8} y={5.95} width={6.05} height={1.9} rx={0.95} />
          {urutanJari.map((kode) => (
            <Jari key={kode} kode={kode} ujung={ujungJari(kode)} aktif={jariAktif.has(kode)} />
          ))}
        </g>
      )}
    </svg>
  );
}

const NAMA_WARNA = { 5: 'Kelingking', 4: 'Jari manis', 3: 'Jari tengah', 2: 'Telunjuk', 1: 'Ibu jari' };

/** Penjelasan warna jari (sama untuk tangan kiri dan kanan). */
export function LegendaJari() {
  return (
    <ul className="legenda-jari" aria-label="Warna setiap jari">
      {KUNCI_JARI.map((k) => (
        <li key={k} className={`j${k}`}>
          <span className="titik" aria-hidden="true" />
          {NAMA_WARNA[k] ?? NAMA_JARI[k]}
        </li>
      ))}
    </ul>
  );
}
