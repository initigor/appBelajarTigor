import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress.jsx';
import { semuaPelajaran } from '../lessons/index.js';

const PILIHAN_TEMA = [
  { id: 'sistem', label: '🖥️ Ikuti sistem' },
  { id: 'terang', label: '☀️ Terang' },
  { id: 'gelap', label: '🌙 Gelap' },
];

export default function Pengaturan() {
  const prog = useProgress();
  const [konfirmasi, setKonfirmasi] = useState('');
  const [pesan, setPesan] = useState('');
  const fileRef = useRef(null);

  const ekspor = () => {
    const blob = new Blob([JSON.stringify(prog.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `latihkode-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const impor = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const obj = JSON.parse(await file.text());
      if (typeof obj !== 'object' || !obj.selesai) throw new Error('format tidak dikenali');
      prog.imporData(obj);
      setPesan('✅ Progress berhasil diimpor.');
    } catch (err) {
      setPesan(`❌ Gagal mengimpor: ${err.message}`);
    }
    e.target.value = '';
  };

  const reset = () => {
    prog.resetProgress();
    setKonfirmasi('');
    setPesan('✅ Progress sudah direset.');
  };

  return (
    <main className="halaman sempit">
      <h1>Pengaturan</h1>

      <section className="kartu-setelan">
        <h2>Tema</h2>
        <div className="pilihan">
          {PILIHAN_TEMA.map((t) => (
            <label key={t.id} className={`pil ${prog.data.tema === t.id ? 'aktif' : ''}`}>
              <input type="radio" name="tema" checked={prog.data.tema === t.id} onChange={() => prog.setTema(t.id)} />
              {t.label}
            </label>
          ))}
        </div>
      </section>

      <section className="kartu-setelan">
        <h2>Akun & sinkronisasi</h2>
        <p className="teks-redup">Simpan progress di cloud supaya bisa lanjut belajar dari perangkat lain.</p>
        <Link className="tombol tombol-kedua" to="/akun">
          👤 Buka halaman akun
        </Link>
      </section>

      <section className="kartu-setelan">
        <h2>Aplikasi</h2>
        <p className="teks-redup">Pasang LatihKode di layar utama HP, iPad, atau laptop supaya bisa dibuka seperti aplikasi, termasuk saat offline.</p>
        <Link className="tombol tombol-kedua" to="/install">
          📲 Cara pasang aplikasi
        </Link>
      </section>

      <section className="kartu-setelan">
        <h2>Ringkasan</h2>
        <ul className="ringkasan">
          <li>
            Pelajaran selesai: <b>{prog.jumlahSelesai}</b> dari {semuaPelajaran.length}
          </li>
          <li>
            Total XP: <b>{prog.totalXp}</b>
          </li>
          <li>
            Streak: <b>{prog.streak}</b> hari
          </li>
          <li>
            Total percobaan: <b>{Object.values(prog.data.percobaan).reduce((a, b) => a + b, 0)}</b>
          </li>
        </ul>
      </section>

      <section className="kartu-setelan">
        <h2>Cadangkan progress</h2>
        <p className="teks-redup">Progress disimpan di localStorage browser ini. Ekspor ke file kalau mau pindah browser/komputer.</p>
        <div className="baris-tombol">
          <button className="tombol tombol-kedua" onClick={ekspor}>
            ⬇️ Ekspor progress
          </button>
          <button className="tombol tombol-kedua" onClick={() => fileRef.current?.click()}>
            ⬆️ Impor progress
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={impor} />
        </div>
      </section>

      <section className="kartu-setelan kartu-bahaya">
        <h2>Reset progress</h2>
        <p className="teks-redup">
          Menghapus semua XP, streak, status selesai, dan kode yang tersimpan. Tidak bisa dibatalkan. Ketik <b>RESET</b>{' '}
          untuk mengonfirmasi.
        </p>
        <div className="baris-tombol">
          <input value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} placeholder="RESET" className="input" />
          <button className="tombol tombol-bahaya" disabled={konfirmasi !== 'RESET'} onClick={reset}>
            Reset semua progress
          </button>
        </div>
      </section>

      {pesan && <p className="pesan">{pesan}</p>}
    </main>
  );
}
