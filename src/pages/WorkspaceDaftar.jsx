import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { daftarProject, buatProject, hapusProject, simpanProject, TEMPLAT, useVersiWorkspace } from '../state/workspace.js';
import { dariIpynb, keIpynb } from '../state/notebook.js';
import { useAkun } from '../state/akun.jsx';

export default function WorkspaceDaftar() {
  const { akun, sinkronWorkspace, masalahWorkspace } = useAkun();
  const versi = useVersiWorkspace();
  // Ambil project terbaru dari cloud (mis. yang dibuat di perangkat lain) setiap halaman ini dibuka.
  useEffect(() => {
    sinkronWorkspace?.();
  }, [sinkronWorkspace]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projects = useMemo(() => daftarProject(), [versi]);
  const [bahasaBaru, setBahasaBaru] = useState('javascript');
  const navigate = useNavigate();
  const inputImporRef = useRef(null);

  // Impor notebook Jupyter (.ipynb) dari komputer sebagai project baru.
  const imporIpynb = async (e) => {
    const berkas = e.target.files?.[0];
    e.target.value = '';
    if (!berkas) return;
    try {
      if (berkas.size > 3 * 1024 * 1024) throw new Error('Berkas terlalu besar (maksimal 3 MB).');
      const teks = keIpynb(dariIpynb(await berkas.text())); // divalidasi dan dinormalkan
      const p = buatProject(berkas.name.replace(/\.ipynb$/i, '') || 'Notebook', 'notebook', false);
      simpanProject({ ...p, files: { 'main.ipynb': teks } });
      navigate(`/workspace/${p.id}`);
    } catch (err) {
      window.alert(`Gagal mengimpor notebook: ${err.message}`);
    }
  };

  const buat = () => {
    const nama = window.prompt('Nama project baru:', TEMPLAT[bahasaBaru].label);
    if (nama === null) return;
    const p = buatProject(nama.trim(), bahasaBaru);
    navigate(`/workspace/${p.id}`);
  };

  const hapus = (id, nama) => {
    if (!window.confirm(`Hapus project "${nama}"? Tidak bisa dibatalkan.`)) return;
    hapusProject(id);
  };

  return (
    <main className="halaman">
      <section className="hero hero-workspace">
        <div>
          <p className="hero-kecil">Ngoding bebas</p>
          <h1>🗂️ Workspace</h1>
          <p className="hero-deskripsi">
            IDE mini di browser: banyak project, banyak berkas, JavaScript, Python, dan Notebook Python (.ipynb) — jalan sungguhan tanpa server. Cocok untuk latihan bebas
            di luar kurikulum pelajaran.
          </p>
          <p className="teks-redup">
            {akun ? (
              <>☁️ Tersinkron dengan akun <b>{akun.username}</b>: project yang sama muncul di HP dan laptop.</>
            ) : (
              <>
                Project tersimpan di perangkat ini. <Link to="/akun">Masuk ke akun</Link> supaya project juga muncul di perangkat lain.
              </>
            )}
          </p>
          {akun && masalahWorkspace && <p className="pemberitahuan-ujian">⚠️ {masalahWorkspace}</p>}
        </div>
      </section>

      <div className="workspace-buat">
        <select className="workspace-pilih-bahasa" value={bahasaBaru} onChange={(e) => setBahasaBaru(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python (skrip .py)</option>
          <option value="notebook">Python Notebook (.ipynb)</option>
        </select>
        <button className="tombol tombol-besar" onClick={buat}>
          + Project baru
        </button>
        <button className="tombol tombol-kedua tombol-besar" onClick={() => inputImporRef.current?.click()} title="Impor notebook Jupyter dari komputermu">
          ⬆️ Impor .ipynb
        </button>
        <input ref={inputImporRef} type="file" accept=".ipynb,application/json" hidden onChange={imporIpynb} />
      </div>

      {projects.length === 0 ? (
        <p className="teks-redup">Belum ada project. Buat satu di atas untuk mulai.</p>
      ) : (
        <div className="daftar-workspace">
          {projects.map((p) => (
            <div key={p.id} className="kartu-workspace">
              <Link to={`/workspace/${p.id}`} className="kartu-workspace-isi">
                <span className={`chip-bahasa chip-bahasa-${p.bahasa}`}>{p.bahasa === 'javascript' ? 'JS' : p.bahasa === 'notebook' ? 'NB' : 'PY'}</span>
                <div>
                  <b>{p.nama}</b>
                  <p className="teks-redup">
                    {p.bahasa === 'notebook' ? 'Notebook' : `${Object.keys(p.files).length} berkas`} · diubah {new Date(p.diubah).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </Link>
              <button className="tombol-ikon" title="Hapus project" onClick={() => hapus(p.id, p.nama)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
