import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { daftarProject, buatProject, hapusProject, TEMPLAT } from '../state/workspace.js';

export default function WorkspaceDaftar() {
  const [projects, setProjects] = useState(() => daftarProject());
  const [bahasaBaru, setBahasaBaru] = useState('javascript');
  const navigate = useNavigate();

  const buat = () => {
    const nama = window.prompt('Nama project baru:', TEMPLAT[bahasaBaru].label);
    if (nama === null) return;
    const p = buatProject(nama.trim(), bahasaBaru);
    navigate(`/workspace/${p.id}`);
  };

  const hapus = (id, nama) => {
    if (!window.confirm(`Hapus project "${nama}"? Tidak bisa dibatalkan.`)) return;
    hapusProject(id);
    setProjects(daftarProject());
  };

  return (
    <main className="halaman">
      <section className="hero hero-workspace">
        <div>
          <p className="hero-kecil">Ngoding bebas</p>
          <h1>🗂️ Workspace</h1>
          <p className="hero-deskripsi">
            IDE mini di browser: banyak project, banyak berkas, JavaScript dan Python — jalan sungguhan tanpa server. Cocok untuk latihan bebas
            di luar kurikulum pelajaran.
          </p>
        </div>
      </section>

      <div className="workspace-buat">
        <select className="workspace-pilih-bahasa" value={bahasaBaru} onChange={(e) => setBahasaBaru(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button className="tombol tombol-besar" onClick={buat}>
          + Project baru
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="teks-redup">Belum ada project. Buat satu di atas untuk mulai.</p>
      ) : (
        <div className="daftar-workspace">
          {projects.map((p) => (
            <div key={p.id} className="kartu-workspace">
              <Link to={`/workspace/${p.id}`} className="kartu-workspace-isi">
                <span className={`chip-bahasa chip-bahasa-${p.bahasa}`}>{p.bahasa === 'javascript' ? 'JS' : 'PY'}</span>
                <div>
                  <b>{p.nama}</b>
                  <p className="teks-redup">
                    {Object.keys(p.files).length} berkas · diubah {new Date(p.diubah).toLocaleDateString('id-ID')}
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
