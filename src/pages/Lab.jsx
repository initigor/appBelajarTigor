// Uji kelayakan runtime browser: satu editor + satu terminal, Run/Stop untuk JavaScript (Worker) dan
// Python (Pyodide, input() interaktif). Java TIDAK dipakai di sini -- lihat README bagian
// "/lab: Uji Kelayakan Runtime Browser" utk kesimpulan (CheerpJ menggantung tanpa akhir, dikonfirmasi
// juga di Safari iPad sungguhan). Materi Java tetap memakai course terpisah (runner javac/java lokal).
import { useEffect, useRef, useState } from 'react';
import Editor from '../components/Editor.jsx';
import { useTerminal } from '../lab/useTerminal.js';
import { bikinPembacaBaris, bikinSab, tulisBarisKeSab } from '../lab/stdinBridge.js';

const CONTOH = {
  javascript: `console.log("Halo dari JavaScript!");
const nama = await prompt("Siapa namamu? ");
console.log("Salam, " + nama + "!");
`,
  python: `nama = input("Siapa namamu? ")
print(f"Salam, {nama}!")
for i in range(3):
    print("Hitung:", i)
`,
};

export default function Lab() {
  const [bahasa, setBahasa] = useState('javascript');
  const [kode, setKode] = useState(CONTOH);
  const [jalan, setJalan] = useState(false);
  const [status, setStatus] = useState(null); // { pesan, persen }
  const [isolasi, setIsolasi] = useState(null); // crossOriginIsolated?
  const [tungguInput, setTungguInput] = useState(false);

  const { elRef, termRef, tulis, tulisBaris, bersihkan } = useTerminal();
  const pembacaRef = useRef(null);
  const jsWorkerRef = useRef(null);
  const pyWorkerRef = useRef(null);
  const sabRef = useRef(null);
  const dihentikanRef = useRef(false);

  useEffect(() => {
    setIsolasi(window.crossOriginIsolated ?? false);
  }, []);

  const buatJsWorker = () => new Worker(new URL('../lab/jsWorkerLab.js', import.meta.url));
  const buatPyWorker = () => {
    const w = new Worker(new URL('../lab/pyWorker.js', import.meta.url));
    sabRef.current = bikinSab();
    if (sabRef.current) w.postMessage({ tipe: 'siapkan-stdin', sab: sabRef.current });
    return w;
  };

  const ambilJsWorker = () => (jsWorkerRef.current ??= buatJsWorker());
  const ambilPyWorker = () => (pyWorkerRef.current ??= buatPyWorker());

  const mintaBaris = async () => {
    if (!pembacaRef.current) pembacaRef.current = bikinPembacaBaris(termRef.current);
    setTungguInput(true);
    try {
      return await pembacaRef.current.bacaBaris();
    } finally {
      setTungguInput(false);
    }
  };

  const jalankanJs = () =>
    new Promise((resolve) => {
      const w = ambilJsWorker();
      w.onmessage = async (ev) => {
        const d = ev.data;
        if (d.tipe === 'stdout') tulis(d.teks.replace(/\n/g, '\r\n'));
        else if (d.tipe === 'stderr') tulis(`\x1b[31m${d.teks.replace(/\n/g, '\r\n')}\x1b[0m`);
        else if (d.tipe === 'perlu-input') {
          const baris = await mintaBaris();
          w.postMessage({ tipe: 'input-tersedia', teks: baris });
        } else if (d.tipe === 'selesai') resolve();
      };
      w.postMessage({ tipe: 'jalankan', kode: kode.javascript });
    });

  const jalankanPython = () =>
    new Promise((resolve) => {
      const w = ambilPyWorker();
      w.onmessage = async (ev) => {
        const d = ev.data;
        if (d.tipe === 'status') setStatus({ pesan: d.pesan, persen: d.persen });
        else if (d.tipe === 'stdout') tulis(d.teks.replace(/\n/g, '\r\n'));
        else if (d.tipe === 'stderr') tulis(`\x1b[31m${d.teks.replace(/\n/g, '\r\n')}\x1b[0m`);
        else if (d.tipe === 'perlu-stdin') {
          if (!sabRef.current) {
            tulisBaris('\x1b[31m[stdin tidak tersedia: SharedArrayBuffer nonaktif — situs ini belum cross-origin isolated]\x1b[0m');
            return;
          }
          const baris = await mintaBaris();
          tulisBarisKeSab(sabRef.current, baris);
        } else if (d.tipe === 'selesai') {
          setStatus(null);
          resolve();
        }
      };
      w.postMessage({ tipe: 'jalankan', kode: kode.python });
    });

  const jalankan = async () => {
    if (jalan) return;
    dihentikanRef.current = false;
    setJalan(true);
    setTungguInput(false);
    bersihkan();
    tulisBaris(`--- menjalankan ${bahasa} ---`);
    try {
      if (bahasa === 'javascript') await jalankanJs();
      else await jalankanPython();
    } finally {
      setJalan(false);
      setStatus(null);
      setTungguInput(false);
    }
  };

  /** Hentikan paksa: terminate worker (satu-satunya cara menghentikan kode yang macet/infinite loop),
   * lalu buat worker baru untuk percobaan berikutnya — persis pola yang diminta. */
  const hentikan = () => {
    dihentikanRef.current = true;
    if (bahasa === 'javascript') {
      jsWorkerRef.current?.terminate();
      jsWorkerRef.current = null;
    } else {
      pyWorkerRef.current?.terminate();
      pyWorkerRef.current = null;
      sabRef.current = null;
    }
    tulisBaris('\r\n\x1b[33m[dihentikan]\x1b[0m');
    setJalan(false);
    setStatus(null);
    setTungguInput(false);
  };

  useEffect(
    () => () => {
      jsWorkerRef.current?.terminate();
      pyWorkerRef.current?.terminate();
    },
    [],
  );

  return (
    <main className="halaman lab-halaman">
      <div className="lab-kepala">
        <div>
          <h1>🧪 Lab: Uji Kelayakan Runtime Browser</h1>
          <p className="teks-redup">
            Satu editor, satu terminal. JavaScript (Worker) dan Python (Pyodide + <code>input()</code> interaktif) — keduanya jalan sungguhan di
            browser, tanpa server. (Java tidak dipakai di sini — lihat README.)
          </p>
        </div>
        <span className={`chip ${isolasi ? 'chip-api' : 'chip-redup'}`} title="window.crossOriginIsolated">
          {isolasi === null ? '…' : isolasi ? '✅ Cross-origin isolated' : '⚠️ Belum cross-origin isolated'}
        </span>
      </div>

      <div className="lab-toolbar">
        <div className="lab-bahasa">
          {['javascript', 'python'].map((b) => (
            <button key={b} className={`tab ${bahasa === b ? 'aktif' : ''}`} onClick={() => setBahasa(b)} disabled={jalan}>
              {b === 'javascript' ? 'JavaScript' : 'Python'}
            </button>
          ))}
        </div>
        {jalan ? (
          <button className="tombol tombol-berhenti" onClick={hentikan}>
            ⏹ Stop
          </button>
        ) : (
          <button className="tombol tombol-jalan" onClick={jalankan}>
            ▶ Jalankan
          </button>
        )}
      </div>

      {status && (
        <div className="lab-status">
          <div className="progress">
            <div className="progress-isi" style={{ width: `${status.persen}%` }} />
          </div>
          <span>{status.pesan}</span>
        </div>
      )}

      {tungguInput && (
        <div className="lab-tunggu-input">
          ⌨️ Program sedang menunggu input — ketik di dalam kotak terminal di bawah, lalu tekan Enter.
        </div>
      )}

      <div className="lab-split">
        <div className="lab-editor">
          <Editor nilai={kode[bahasa]} onUbah={(v) => setKode((k) => ({ ...k, [bahasa]: v }))} onJalankan={jalankan} bahasa={bahasa} gelap />
        </div>
        <div className={`lab-terminal ${tungguInput ? 'lab-terminal-tunggu' : ''}`} ref={elRef} />
      </div>

      <p className="teks-redup lab-catatan">
        Ketik langsung di terminal saat program meminta input (Python <code>input()</code>, JS <code>prompt()</code>). Tombol Stop mematikan
        worker secara paksa (satu-satunya cara menghentikan infinite loop) dan membuat worker baru untuk percobaan berikutnya.
      </p>
    </main>
  );
}
