import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgress } from './state/progress.jsx';
import Beranda from './pages/Beranda.jsx';
import Pelajaran from './pages/Pelajaran.jsx';
import Pengaturan from './pages/Pengaturan.jsx';
import { panaskanWorker } from './engine/runner.js';

function Header() {
  const { totalXp, streak, sudahBelajarHariIni, temaAktif, setTema } = useProgress();
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-ikon">{'{ }'}</span>
        <span>
          Latih<b>Kode</b>
        </span>
      </Link>
      <nav className="nav">
        <NavLink to="/" end>
          Beranda
        </NavLink>
        <NavLink to="/pengaturan">Pengaturan</NavLink>
      </nav>
      <div className="header-kanan">
        <span className="chip" title="Total XP">
          ⚡ {totalXp} XP
        </span>
        <span className={`chip ${sudahBelajarHariIni ? 'chip-api' : 'chip-redup'}`} title="Streak harian">
          🔥 {streak}
        </span>
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
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="*" element={<TidakDitemukan />} />
      </Routes>
    </div>
  );
}
