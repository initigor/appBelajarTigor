import { useState } from 'react';
import { useAkun } from '../state/akun.jsx';

const LABEL_STATUS = {
  tamu: ['⚪', 'Belum masuk'],
  sinkron: ['🔄', 'Menyinkronkan…'],
  menunggu: ['🟡', 'Ada perubahan, akan disimpan sebentar lagi'],
  tersimpan: ['🟢', 'Tersimpan di cloud'],
  offline: ['📴', 'Offline: progress disimpan di perangkat dan akan dikirim saat online'],
  galat: ['🔴', 'Gagal menyinkronkan'],
};

function FormMasuk() {
  const { masuk, daftar, pesanStatus } = useAkun();
  const [mode, setMode] = useState('masuk');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ulangi, setUlangi] = useState('');
  const [lihat, setLihat] = useState(false);
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  const kirim = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'daftar' && password !== ulangi) {
      setError('Konfirmasi password tidak sama.');
      return;
    }
    setProses(true);
    try {
      await (mode === 'masuk' ? masuk : daftar)(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setProses(false);
    }
  };

  return (
    <section className="kartu-setelan kartu-akun">
      <div className="tab-akun" role="tablist">
        {[
          ['masuk', 'Masuk'],
          ['daftar', 'Buat akun'],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={mode === id}
            className={mode === id ? 'aktif' : ''}
            onClick={() => {
              setMode(id);
              setError('');
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {pesanStatus && !error && <p className="pesan-akun peringatan-akun">{pesanStatus}</p>}

      <form className="form-akun" onSubmit={kirim}>
        <label>
          Username
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="misalnya: budi_2023"
            required
          />
        </label>
        {mode === 'daftar' && <small className="teks-redup">3–20 karakter: huruf kecil, angka, atau _</small>}
        <label>
          Password
          <input
            className="input"
            type={lihat ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
            required
          />
        </label>
        {mode === 'daftar' && (
          <label>
            Ulangi password
            <input
              className="input"
              type={lihat ? 'text' : 'password'}
              value={ulangi}
              onChange={(e) => setUlangi(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}
        <label className="cek-lihat">
          <input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} /> Tampilkan password
        </label>
        {error && <p className="pesan-akun galat-akun">{error}</p>}
        <button className="tombol tombol-besar" type="submit" disabled={proses}>
          {proses ? 'Memproses…' : mode === 'masuk' ? 'Masuk' : 'Buat akun'}
        </button>
      </form>

      <p className="teks-redup kecil-akun">
        {mode === 'daftar'
          ? 'Progress, riwayat ujian, dan project Workspace yang sudah ada di perangkat ini akan ikut tersimpan ke akun barumu. Simpan password baik-baik, karena belum ada fitur lupa password.'
          : 'Setelah masuk, progress, riwayat ujian, dan project Workspace di perangkat ini digabung dengan yang ada di akunmu. Tidak ada pelajaran yang hilang.'}
      </p>
    </section>
  );
}

function PanelAkun() {
  const { akun, status, pesanStatus, terakhirSinkron, keluar, sinkronSekarang, gantiPassword, hapusAkun } = useAkun();
  const [ikon, label] = LABEL_STATUS[status] ?? LABEL_STATUS.menunggu;
  const [bagian, setBagian] = useState(null); // 'password' | 'hapus'
  const [f, setF] = useState({ lama: '', baru: '', konfirmasi: '' });
  const [pesan, setPesan] = useState('');
  const [proses, setProses] = useState(false);

  const jalankan = async (fn, sukses) => {
    setProses(true);
    setPesan('');
    try {
      await fn();
      setPesan(sukses);
      setBagian(null);
      setF({ lama: '', baru: '', konfirmasi: '' });
    } catch (e) {
      setPesan(`❌ ${e.message}`);
    } finally {
      setProses(false);
    }
  };

  return (
    <>
      <section className="kartu-setelan kartu-akun">
        <div className="profil-akun">
          <div className="avatar-akun">{akun.username[0].toUpperCase()}</div>
          <div>
            <div className="nama-akun">{akun.username}</div>
            <div className="status-sinkron">
              {ikon} {label}
              {status === 'tersimpan' && terakhirSinkron && (
                <span className="teks-redup"> · {terakhirSinkron.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
            {pesanStatus && <div className="teks-redup">{pesanStatus}</div>}
          </div>
        </div>
        <div className="baris-tombol">
          <button className="tombol tombol-kedua" onClick={sinkronSekarang} disabled={status === 'sinkron'}>
            🔄 Sinkronkan sekarang
          </button>
          <button
            className="tombol tombol-kedua"
            onClick={() => {
              if (window.confirm('Keluar dari akun? Progress tetap tersimpan di perangkat ini dan di cloud.')) keluar();
            }}
          >
            Keluar
          </button>
        </div>
      </section>

      <section className="kartu-setelan">
        <h2>Keamanan</h2>
        <div className="baris-tombol">
          <button className="tombol tombol-kedua" onClick={() => setBagian(bagian === 'password' ? null : 'password')}>
            🔑 Ganti password
          </button>
          <button className="tombol tombol-kedua teks-bahaya" onClick={() => setBagian(bagian === 'hapus' ? null : 'hapus')}>
            🗑️ Hapus akun
          </button>
        </div>

        {bagian === 'password' && (
          <form
            className="form-akun"
            onSubmit={(e) => {
              e.preventDefault();
              if (f.baru !== f.konfirmasi) return setPesan('❌ Konfirmasi password baru tidak sama.');
              jalankan(() => gantiPassword(f.lama, f.baru), '✅ Password diganti. Perangkat lain yang memakai akun ini akan diminta masuk lagi.');
            }}
          >
            <input className="input" type="password" placeholder="Password lama" autoComplete="current-password" value={f.lama} onChange={(e) => setF({ ...f, lama: e.target.value })} required />
            <input className="input" type="password" placeholder="Password baru (min. 6 karakter)" autoComplete="new-password" value={f.baru} onChange={(e) => setF({ ...f, baru: e.target.value })} required />
            <input className="input" type="password" placeholder="Ulangi password baru" autoComplete="new-password" value={f.konfirmasi} onChange={(e) => setF({ ...f, konfirmasi: e.target.value })} required />
            <button className="tombol" disabled={proses}>
              Simpan password baru
            </button>
          </form>
        )}

        {bagian === 'hapus' && (
          <form
            className="form-akun"
            onSubmit={(e) => {
              e.preventDefault();
              jalankan(() => hapusAkun(f.lama), '✅ Akun dan progress di cloud sudah dihapus. Progress di perangkat ini tetap ada.');
            }}
          >
            <p className="teks-redup">
              Akun, progress, riwayat ujian, dan Workspace di cloud akan dihapus permanen. Progress di perangkat ini tidak ikut terhapus. Masukkan password untuk
              konfirmasi.
            </p>
            <input className="input" type="password" placeholder="Password" autoComplete="current-password" value={f.lama} onChange={(e) => setF({ ...f, lama: e.target.value })} required />
            <button className="tombol tombol-bahaya" disabled={proses}>
              Hapus akun permanen
            </button>
          </form>
        )}
        {pesan && <p className="pesan">{pesan}</p>}
      </section>
    </>
  );
}

export default function Akun() {
  const { akun } = useAkun();
  return (
    <main className="halaman sempit">
      <h1>👤 Akun</h1>
      <p className="teks-redup">
        Akun bersifat opsional. Tanpa akun, progress tetap tersimpan di perangkat ini. Dengan akun, progress tersimpan di
        cloud, jadi kamu bisa lanjut belajar dari HP, iPad, atau laptop mana pun.
      </p>
      {akun ? <PanelAkun /> : <FormMasuk />}
    </main>
  );
}
