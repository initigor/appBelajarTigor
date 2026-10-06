import { useState } from 'react';

/** Kotak input kecil yang muncul saat Python memanggil input(). */
function KotakInput({ onKirim }) {
  const [isi, setIsi] = useState('');
  return (
    <form
      className="py-input"
      onSubmit={(e) => {
        e.preventDefault();
        onKirim(isi);
        setIsi('');
      }}
    >
      <span aria-hidden="true">⌨️</span>
      <input autoFocus value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Ketik input lalu Enter…" aria-label="Input untuk program" spellCheck={false} autoComplete="off" />
      <button className="tombol kecil" type="submit">
        Kirim
      </button>
    </form>
  );
}

/** Menampilkan keluaran sebuah sel/blok Python (lihat src/engine/keluaranPython.js). */
export default function HasilPython({ keluaran, status, menungguInput, onKirimInput }) {
  const kosong = keluaran.length === 0 && !menungguInput && !status;
  if (kosong) return null;
  return (
    <div className="py-keluaran" aria-live="polite">
      {status && <p className="py-status">⏳ {status}</p>}
      {keluaran.map((k, i) => {
        if (k.jenis === 'stream') {
          return (
            <pre key={i} className={`py-stream ${k.nama === 'stderr' ? 'py-galat' : ''}`}>
              {k.teks}
            </pre>
          );
        }
        if (k.jenis === 'hasil') {
          return (
            <pre key={i} className="py-hasil">
              <span className="py-out" aria-hidden="true">
                Out:{' '}
              </span>
              {k.teks}
            </pre>
          );
        }
        if (k.jenis === 'gambar') return <img key={i} className="py-gambar" src={`data:image/png;base64,${k.data}`} alt="Grafik hasil kode" />;
        return (
          <pre key={i} className="py-galat py-traceback">
            {k.teks}
          </pre>
        );
      })}
      {menungguInput && <KotakInput onKirim={onKirimInput} />}
    </div>
  );
}
