import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import JSZip from 'jszip';
import { ambilProject, simpanProject, namaFileTersedia } from '../state/workspace.js';
import { useProgress } from '../state/progress.jsx';
import Editor from '../components/Editor.jsx';
import { useTerminal } from '../lab/useTerminal.js';
import { bikinPembacaBaris, bikinSab, tulisBarisKeSab } from '../lab/stdinBridge.js';

const EKSTENSI = { javascript: '.js', python: '.py' };

function unduhBlob(nama, isi, tipe = 'text/plain') {
  const blob = new Blob([isi], { type: tipe });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function WorkspaceProyek() {
  const { id } = useParams();
  const progJs = useProgress();
  const [project, setProject] = useState(() => ambilProject(id));

  if (!project) {
    return (
      <main className="halaman sempit">
        <h1>Project tidak ditemukan 🤔</h1>
        <Link className="tombol" to="/workspace">
          ← Kembali ke Workspace
        </Link>
      </main>
    );
  }
  return <IsiWorkspace key={id} projectAwal={project} gelap={progJs.temaAktif === 'gelap'} />;
}

function IsiWorkspace({ projectAwal, gelap }) {
  const [project, setProject] = useState(projectAwal);
  const [tabTerbuka, setTabTerbuka] = useState([projectAwal.entryPoint]);
  const [aktif, setAktif] = useState(projectAwal.entryPoint);
  const [jalan, setJalan] = useState(false);
  const [status, setStatus] = useState(null);
  const [tungguInput, setTungguInput] = useState(false);

  const { elRef, termRef, tulis, tulisBaris, bersihkan } = useTerminal();
  const pembacaRef = useRef(null);
  const jsWorkerRef = useRef(null);
  const pyWorkerRef = useRef(null);
  const sabRef = useRef(null);
  const projectRef = useRef(project);
  projectRef.current = project;

  // Autosave (debounce kecil) setiap kali project berubah.
  useEffect(() => {
    const t = setTimeout(() => simpanProject(project), 400);
    return () => clearTimeout(t);
  }, [project]);

  useEffect(
    () => () => {
      jsWorkerRef.current?.terminate();
      pyWorkerRef.current?.terminate();
    },
    [],
  );

  const daftarFile = useMemo(() => Object.keys(project.files).sort(), [project.files]);

  const ubahIsiFile = (path, isi) => setProject((p) => ({ ...p, files: { ...p.files, [path]: isi } }));

  const bukaFile = (path) => {
    setAktif(path);
    setTabTerbuka((t) => (t.includes(path) ? t : [...t, path]));
  };
  const tutupTab = (path, ev) => {
    ev?.stopPropagation();
    setTabTerbuka((t) => t.filter((x) => x !== path));
    if (aktif === path) {
      const sisa = tabTerbuka.filter((x) => x !== path);
      setAktif(sisa[sisa.length - 1] ?? project.entryPoint);
    }
  };

  const buatFile = () => {
    const ext = EKSTENSI[project.bahasa];
    const nama = window.prompt(`Nama berkas baru (contoh: utils${ext}):`, `baru${ext}`);
    if (!nama) return;
    if (!namaFileTersedia(project.files, nama)) return window.alert('Nama berkas itu sudah dipakai.');
    setProject((p) => ({ ...p, files: { ...p.files, [nama]: '' } }));
    bukaFile(nama);
  };
  const renameFile = (path) => {
    const baru = window.prompt('Ganti nama menjadi:', path);
    if (!baru || baru === path) return;
    if (!namaFileTersedia(project.files, baru)) return window.alert('Nama berkas itu sudah dipakai.');
    setProject((p) => {
      const files = { ...p.files };
      files[baru] = files[path];
      delete files[path];
      return { ...p, files, entryPoint: p.entryPoint === path ? baru : p.entryPoint };
    });
    setTabTerbuka((t) => t.map((x) => (x === path ? baru : x)));
    if (aktif === path) setAktif(baru);
  };
  const hapusFile = (path) => {
    if (daftarFile.length <= 1) return window.alert('Project butuh minimal satu berkas.');
    if (!window.confirm(`Hapus "${path}"?`)) return;
    setProject((p) => {
      const files = { ...p.files };
      delete files[path];
      const entryPoint = p.entryPoint === path ? Object.keys(files)[0] : p.entryPoint;
      return { ...p, files, entryPoint };
    });
    tutupTab(path);
  };
  const jadikanEntry = (path) => setProject((p) => ({ ...p, entryPoint: path }));
  const gantiNamaProject = () => {
    const nama = window.prompt('Nama project:', project.nama);
    if (nama) setProject((p) => ({ ...p, nama }));
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
      if (!jsWorkerRef.current) jsWorkerRef.current = new Worker(new URL('../lab/jsWorkerLab.js', import.meta.url));
      const w = jsWorkerRef.current;
      w.onmessage = async (ev) => {
        const d = ev.data;
        if (d.tipe === 'stdout') tulis(d.teks.replace(/\n/g, '\r\n'));
        else if (d.tipe === 'stderr') tulis(`\x1b[31m${d.teks.replace(/\n/g, '\r\n')}\x1b[0m`);
        else if (d.tipe === 'perlu-input') {
          const baris = await mintaBaris();
          w.postMessage({ tipe: 'input-tersedia', teks: baris });
        } else if (d.tipe === 'selesai') resolve();
      };
      w.postMessage({ tipe: 'jalankan', kode: projectRef.current.files[projectRef.current.entryPoint] ?? '' });
    });

  const jalankanPython = () =>
    new Promise((resolve) => {
      if (!pyWorkerRef.current) {
        pyWorkerRef.current = new Worker(new URL('../lab/pyWorker.js', import.meta.url));
        sabRef.current = bikinSab();
        if (sabRef.current) pyWorkerRef.current.postMessage({ tipe: 'siapkan-stdin', sab: sabRef.current });
      }
      const w = pyWorkerRef.current;
      w.onmessage = async (ev) => {
        const d = ev.data;
        if (d.tipe === 'status') setStatus({ pesan: d.pesan, persen: d.persen });
        else if (d.tipe === 'stdout') tulis(d.teks.replace(/\n/g, '\r\n'));
        else if (d.tipe === 'stderr') tulis(`\x1b[31m${d.teks.replace(/\n/g, '\r\n')}\x1b[0m`);
        else if (d.tipe === 'perlu-stdin') {
          if (!sabRef.current) {
            tulisBaris('\x1b[31m[stdin tidak tersedia di sini]\x1b[0m');
            return;
          }
          const baris = await mintaBaris();
          tulisBarisKeSab(sabRef.current, baris);
        } else if (d.tipe === 'selesai') {
          setStatus(null);
          resolve();
        }
      };
      w.postMessage({ tipe: 'jalankan', berkas: projectRef.current.files, entryPoint: projectRef.current.entryPoint });
    });

  const jalankan = async () => {
    if (jalan) return;
    setJalan(true);
    setTungguInput(false);
    bersihkan();
    tulisBaris(`--- menjalankan ${project.entryPoint} ---`);
    try {
      if (project.bahasa === 'javascript') await jalankanJs();
      else await jalankanPython();
    } finally {
      setJalan(false);
      setStatus(null);
      setTungguInput(false);
    }
  };

  const hentikan = () => {
    if (project.bahasa === 'javascript') {
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

  const unduhFileAktif = () => unduhBlob(aktif.split('/').pop(), project.files[aktif] ?? '');
  const unduhZip = async () => {
    const zip = new JSZip();
    for (const [path, isi] of Object.entries(project.files)) zip.file(path, isi);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.nama.replace(/[^a-z0-9_-]+/gi, '_') || 'project'}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="halaman workspace-halaman">
      <div className="workspace-topbar">
        <Link to="/workspace" className="link-kecil">
          ← Workspace
        </Link>
        <button className="workspace-nama-tombol" onClick={gantiNamaProject} title="Ganti nama project">
          {project.nama} ✏️
        </button>
        <span className="chip-bahasa-kecil">{project.bahasa === 'javascript' ? 'JavaScript' : 'Python'}</span>
        <span className="header-kanan">
          <button className="tombol tombol-kedua kecil" onClick={unduhFileAktif} title="Unduh berkas aktif">
            ⬇️ Berkas
          </button>
          <button className="tombol tombol-kedua kecil" onClick={unduhZip} title="Unduh seluruh project sebagai .zip">
            ⬇️ .zip
          </button>
          {jalan ? (
            <button className="tombol tombol-berhenti" onClick={hentikan}>
              ⏹ Stop
            </button>
          ) : (
            <button className="tombol tombol-jalan" onClick={jalankan}>
              ▶ Jalankan
            </button>
          )}
        </span>
      </div>

      {status && (
        <div className="lab-status">
          <div className="progress">
            <div className="progress-isi" style={{ width: `${status.persen}%` }} />
          </div>
          <span>{status.pesan}</span>
        </div>
      )}
      {tungguInput && <div className="lab-tunggu-input">⌨️ Menunggu input — ketik di terminal, lalu Enter.</div>}

      <div className="workspace-body">
        <aside className="workspace-sidebar">
          <div className="workspace-sidebar-kepala">
            <b>Berkas</b>
            <button className="tombol-ikon" onClick={buatFile} title="Berkas baru">
              ➕
            </button>
          </div>
          <ul className="workspace-daftar-file">
            {daftarFile.map((path) => (
              <li key={path} className={`workspace-file-item ${aktif === path ? 'aktif' : ''}`}>
                <button className="workspace-file-nama" onClick={() => bukaFile(path)} title={path}>
                  {path === project.entryPoint ? '▶ ' : ''}
                  {path}
                </button>
                <span className="workspace-file-aksi">
                  {path !== project.entryPoint && (
                    <button className="tombol-ikon kecil" title="Jadikan entry point" onClick={() => jadikanEntry(path)}>
                      🎯
                    </button>
                  )}
                  <button className="tombol-ikon kecil" title="Ganti nama" onClick={() => renameFile(path)}>
                    ✏️
                  </button>
                  <button className="tombol-ikon kecil" title="Hapus" onClick={() => hapusFile(path)}>
                    🗑️
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="workspace-editor-area">
          <div className="tab-berkas">
            {tabTerbuka.map((path) => (
              <button key={path} className={`tab-berkas-item ${aktif === path ? 'aktif' : ''}`} onClick={() => setAktif(path)}>
                {path}
                <span className="workspace-tab-tutup" onClick={(e) => tutupTab(path, e)}>
                  ×
                </span>
              </button>
            ))}
          </div>
          <div className="workspace-split">
            <div className="lab-editor">
              <Editor nilai={project.files[aktif] ?? ''} onUbah={(v) => ubahIsiFile(aktif, v)} onJalankan={jalankan} bahasa={project.bahasa} gelap={gelap} />
            </div>
            <div className={`lab-terminal ${tungguInput ? 'lab-terminal-tunggu' : ''}`} ref={elRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
