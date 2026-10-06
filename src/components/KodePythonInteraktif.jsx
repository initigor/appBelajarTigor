import { useEffect, useRef, useState } from 'react';
import Editor from './Editor.jsx';
import HasilPython from './HasilPython.jsx';
import { kernelBersama } from '../engine/pythonKernel.js';
import { useProgress } from '../state/progress.jsx';

/**
 * Blok kode Python di dalam pelajaran: bisa dijalankan dan diubah langsung di halaman (Pyodide di browser).
 * Semua blok di satu halaman berbagi satu kernel, jadi variabel dari blok atas masih ada di blok bawah.
 */
export default function KodePythonInteraktif({ kodeAwal }) {
  const prog = useProgress();
  const [kode, setKode] = useState(kodeAwal);
  const [ubah, setUbah] = useState(false);
  const [keluaran, setKeluaran] = useState([]);
  const [status, setStatus] = useState('');
  const [jalan, setJalan] = useState(false);
  const [menungguInput, setMenungguInput] = useState(null); // resolver
  const kodeRef = useRef(kode);
  kodeRef.current = kode;
  const hidup = useRef(true);
  // hidup harus disetel ulang saat mount: StrictMode (dev) menjalankan mount → cleanup → mount.
  useEffect(() => {
    hidup.current = true;
    return () => {
      hidup.current = false;
    };
  }, []);

  const jalankan = async () => {
    if (jalan) return;
    setJalan(true);
    setKeluaran([]);
    setStatus('Menjalankan…');
    const k = kernelBersama();
    const hasil = await k.jalankan(kodeRef.current, {
      onKeluaran: (d) => hidup.current && setKeluaran(d),
      onStatus: ({ pesan }) => hidup.current && setStatus(pesan),
      mintaInput: () =>
        new Promise((resolve) => {
          if (hidup.current) setMenungguInput(() => resolve);
          else resolve('');
        }),
    });
    if (!hidup.current) return;
    setKeluaran(hasil);
    setStatus('');
    setMenungguInput(null);
    setJalan(false);
  };

  const kirimInput = (baris) => {
    const resolve = menungguInput;
    setMenungguInput(null);
    resolve?.(baris);
  };

  const reset = () => {
    kernelBersama().reset('Sesi Python di-reset (semua variabel dihapus).');
  };

  return (
    <div className="py-blok">
      <div className="py-blok-bar">
        <span className="py-label">🐍 Python</span>
        <span className="py-aksi">
          <button className="tombol tombol-jalan kecil" onClick={jalankan} disabled={jalan}>
            {jalan ? 'Menjalankan…' : '▶ Jalankan'}
          </button>
          <button className="tombol tombol-kedua kecil" onClick={() => setUbah((u) => !u)}>
            {ubah ? '✓ Selesai ubah' : '✏️ Ubah kode'}
          </button>
          {kode !== kodeAwal && (
            <button className="tombol tombol-kedua kecil" onClick={() => setKode(kodeAwal)}>
              ↺ Asli
            </button>
          )}
          <button className="tombol tombol-kedua kecil" onClick={reset} title="Hapus semua variabel dan mulai sesi baru">
            ♻️ Reset sesi
          </button>
        </span>
      </div>
      <div className="py-editor-kotak">
        <Editor nilai={kode} onUbah={setKode} onJalankan={jalankan} bahasa="python" gelap={prog.temaAktif === 'gelap'} readOnly={!ubah} otomatis />
      </div>
      <HasilPython keluaran={keluaran} status={jalan ? status : ''} menungguInput={Boolean(menungguInput)} onKirimInput={kirimInput} />
    </div>
  );
}
