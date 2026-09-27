import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstall } from '../state/install.js';

const KUNCI_TUTUP = 'latihkode:banner-install-ditutup';

function sudahDitutup() {
  try {
    return localStorage.getItem(KUNCI_TUTUP) === '1';
  } catch {
    return false;
  }
}

/** Ajakan memasang aplikasi di beranda. Muncul di Android (tombol install) dan iOS (link tutorial). */
export default function BannerInstall() {
  const { ios, bisaInstall, sudahTerpasang, install } = useInstall();
  const [ditutup, setDitutup] = useState(sudahDitutup);

  if (sudahTerpasang || ditutup || (!bisaInstall && !ios)) return null;

  const tutup = () => {
    try {
      localStorage.setItem(KUNCI_TUTUP, '1');
    } catch {
      /* abaikan */
    }
    setDitutup(true);
  };

  return (
    <aside className="banner-install">
      <div className="banner-install-ikon">{'{ }'}</div>
      <div className="banner-install-teks">
        <b>Pasang LatihKode di layar utama</b>
        <span>Buka layar penuh seperti aplikasi, dan tetap bisa belajar saat offline.</span>
      </div>
      {bisaInstall ? (
        <button className="tombol tombol-install" onClick={install}>
          📲 Install
        </button>
      ) : (
        <Link className="tombol tombol-install" to="/install">
          Lihat caranya
        </Link>
      )}
      <button className="banner-tutup" onClick={tutup} aria-label="Tutup">
        ✕
      </button>
    </aside>
  );
}
