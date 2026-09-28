import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgress } from './state/progress.jsx';
import Beranda from './pages/Beranda.jsx';
import Pelajaran from './pages/Pelajaran.jsx';
import PelajaranJava from './pages/PelajaranJava.jsx';
import UjiPemahamanJava from './pages/UjiPemahamanJava.jsx';
import Pengaturan from './pages/Pengaturan.jsx';
import Install from './pages/Install.jsx';
import Akun from './pages/Akun.jsx';
import { useAkun } from './state/akun.jsx';
import { useInstall } from './state/install.js';
import { panaskanWorker } from './engine/runner.js';

function Header() {
  const { totalXp, streak, sudahBelajarHariIni, temaAktif, setTema } = useProgress();
  const { bisaInstall, install } = useInstall();
  const { akun, status } = useAkun();
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-ikon">{'{ }'}</span>
        <span>
          Latih<b>Kode</b>
        </span>
      </Link>
      <nav className="nav">
        <NavLink to="/" end aria-label="Beranda">
          <span className="nav-ikon-header">🏠</span>
          <span className="nav-teks">Beranda</span>
        </NavLink>
        <NavLink to="/pengaturan" aria-label="Pengaturan">
          <span className="nav-ikon-header">⚙️</span>
          <span className="nav-teks">Pengaturan</span>
        </NavLink>
      </nav>
      <div className="header-kanan">
        {bisaInstall && (
          <button className="tombol tombol-install kecil" onClick={install} title="Pasang LatihKode sebagai aplikasi">
            📲 <span className="nav-teks">Install</span>
          </button>
        )}
        <span className="chip" title="Total XP">
          ⚡ {totalXp} XP
        </span>
        <span className={`chip ${sudahBelajarHariIni ? 'chip-api' : 'chip-redup'}`} title="Streak harian">
          🔥 {streak}
        </span>
        <Link to="/akun" className={`chip chip-akun ${akun ? 'masuk' : ''}`} title={akun ? `Masuk sebagai ${akun.username}` : 'Masuk / buat akun'}>
          {akun ? (
            <>
              <span className={`titik-sinkron ${status}`} />
              <span className="nav-teks">{akun.username}</span>
              <span className="nav-ikon-header">👤</span>
            </>
          ) : (
            <>
              👤 <span className="nav-teks">Masuk</span>
            </>
          )}
        </Link>
        <button
          className="tombol-ikon"
          onClick={() => setTema(temaAktif === 'gelap' ? 'terang' : 'gelap')}
          title="Ganti tema"
          aria-label="Ganti tema"
        >
          {temaAktif === 'gelap' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

function TidakDitemukan() {
  return (
    <main className="halaman sempit">
      <h1>404 😵</h1>
      <p>Halaman ini tidak ada.</p>
      <Link className="tombol" to="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Muat worker di latar belakang supaya "Jalankan" pertama cepat.
    const t = setTimeout(panaskanWorker, 500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!pathname.startsWith('/belajar')) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/belajar/:id" element={<Pelajaran />} />
        <Route path="/java/belajar/:id" element={<PelajaranJava />} />
        <Route path="/java/uji/:pekan" element={<UjiPemahamanJava />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="/install" element={<Install />} />
        <Route path="/akun" element={<Akun />} />
        <Route path="*" element={<TidakDitemukan />} />
      </Routes>
    </div>
  );
}
