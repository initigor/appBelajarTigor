// Halaman uji kelayakan: satu editor + satu terminal, Run untuk JavaScript, Python (Pyodide, input() interaktif),
// dan Java (CheerpJ, kompilasi+jalan sungguhan di browser). Lihat README bagian "Uji Kelayakan /lab".
import { useEffect, useRef, useState } from 'react';
import Editor from '../components/Editor.jsx';
import { useTerminal } from '../lab/useTerminal.js';
import { bikinPembacaBaris, bikinSab, tulisBarisKeSab } from '../lab/stdinBridge.js';
import { jalankanJavaDiBrowser } from '../lab/javaRunner.js';

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
  java: `import java.util.Scanner;

class Helper {
    static int kali(int a, int b) {
        return a * b;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.print("Masukkan dua angka (pisah spasi): ");
        int a = in.nextInt();
        int b = in.nextInt();
        System.out.println("Hasil kali (lewat kelas Helper): " + Helper.kali(a, b));
    }
}
`,
};

const KELAS_UTAMA_JAVA = 'Main';

export default function Lab() {
  const [bahasa, setBahasa] = useState('javascript');
  const [kode, setKode] = useState(CONTOH);
  const [jalan, setJalan] = useState(false);
  const [status, setStatus] = useState(null); // { pesan, persen }
  const [isolasi, setIsolasi] = useState(null); // crossOriginIsolated?
  const [tungguInput, setTungguInput] = useState(false); // true = program sedang menunggu kamu mengetik di terminal

  const { elRef, termRef, tulis, tulisBaris, bersihkan } = useTerminal();
  const pembacaRef = useRef(null);
  const jsWorkerRef = useRef(null);
  const pyWorkerRef = useRef(null);
  const sabRef = useRef(null);

  useEffect(() => {
    setIsolasi(window.crossOriginIsolated ?? false);
  }, []);

  const ambilJsWorker = () => {
    if (!jsWorkerRef.current) jsWorkerRef.current = new Worker(new URL('../lab/jsWorkerLab.js', import.meta.url));
    return jsWorkerRef.current;
  };
  const ambilPyWorker = () => {
    if (!pyWorkerRef.current) {
      pyWorkerRef.current = new Worker(new URL('../lab/pyWorker.js', import.meta.url));
      sabRef.current = bikinSab();
      if (sabRef.current) pyWorkerRef.current.postMessage({ tipe: 'siapkan-stdin', sab: sabRef.current });
    }
    return pyWorkerRef.current;
  };

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

  const jalankanJava = async () => {
    try {
      const hasil = await jalankanJavaDiBrowser({
        berkas: [{ nama: `${KELAS_UTAMA_JAVA}.java`, isi: kode.java }],
        kelasUtama: KELAS_UTAMA_JAVA,
        onStatus: (pesan, persen) => setStatus({ pesan, persen }),
        onOutput: (teks) => tulis(teks.replace(/\n/g, '\r\n')),
      });
      if (!hasil.kompilasiOk) tulisBaris(`\x1b[31m[kompilasi gagal, kode keluar ${hasil.kodeKeluar}]\x1b[0m`);
      else if (hasil.kodeKeluar !== 0) tulisBaris(`\x1b[33m[program keluar dengan kode ${hasil.kodeKeluar}]\x1b[0m`);
    } catch (e) {
      tulisBaris(`\x1b[31m[galat: ${e?.message ?? e}]\x1b[0m`);
    } finally {
      setStatus(null);
    }
  };

  const jalankan = async () => {
    if (jalan) return;
    setJalan(true);
    setTungguInput(false);
    bersihkan();
    tulisBaris(`--- menjalankan ${bahasa} ---`);
    try {
      if (bahasa === 'javascript') await jalankanJs();
      else if (bahasa === 'python') await jalankanPython();
      else await jalankanJava();
    } finally {
      setJalan(false);
    }
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
            Satu editor, satu terminal. JavaScript (Worker), Python (Pyodide + <code>input()</code> interaktif), Java (CheerpJ — kompilasi &amp;
            jalan sungguhan, tanpa server).
          </p>
        </div>
        <span className={`chip ${isolasi ? 'chip-api' : 'chip-redup'}`} title="window.crossOriginIsolated">
          {isolasi === null ? '…' : isolasi ? '✅ Cross-origin isolated' : '⚠️ Belum cross-origin isolated'}
        </span>
      </div>

      <div className="lab-toolbar">
        <div className="lab-bahasa">
          {['javascript', 'python', 'java'].map((b) => (
            <button key={b} className={`tab ${bahasa === b ? 'aktif' : ''}`} onClick={() => setBahasa(b)} disabled={jalan}>
              {b === 'javascript' ? 'JavaScript' : b === 'python' ? 'Python' : 'Java'}
            </button>
          ))}
        </div>
        <button className="tombol tombol-jalan" onClick={jalankan} disabled={jalan}>
          {jalan ? 'Menjalankan…' : '▶ Jalankan'}
        </button>
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
          <Editor
            nilai={kode[bahasa]}
            onUbah={(v) => setKode((k) => ({ ...k, [bahasa]: v }))}
            onJalankan={jalankan}
            bahasa={bahasa}
            gelap
          />
        </div>
        <div className={`lab-terminal ${tungguInput ? 'lab-terminal-tunggu' : ''}`} ref={elRef} />
      </div>

      <p className="teks-redup lab-catatan">
        Ketik langsung di terminal saat program meminta input (Python <code>input()</code>, JS <code>prompt()</code>). Untuk Java: lihat catatan
        stdin di README — belum ada API resmi CheerpJ untuk stdin interaktif, jadi hasilnya diamati apa adanya di sini.
      </p>
    </main>
  );
}
