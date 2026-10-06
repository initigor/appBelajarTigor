import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Editor from '../components/Editor.jsx';
import HasilPython from '../components/HasilPython.jsx';
import Markdown from '../components/Markdown.jsx';
import { buatKernel } from '../engine/pythonKernel.js';
import { ambilProject, simpanProject, useVersiWorkspace } from '../state/workspace.js';
import { dariIpynb, hitungBerikutnya, keIpynb, notebookAwal, selBaru } from '../state/notebook.js';

const BERKAS = 'main.ipynb';

function unduh(nama, isi, tipe = 'application/json') {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const namaAman = (n) => n.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'notebook';

function muatModel(teks) {
  try {
    return { model: dariIpynb(teks), galat: null };
  } catch (e) {
    return { model: notebookAwal(), galat: e.message };
  }
}

/** Editor notebook (.ipynb) untuk Workspace: sel kode Python (Pyodide) dan sel teks Markdown. */
export default function NotebookProyek({ projectAwal, gelap }) {
  const entry = projectAwal.files[BERKAS] !== undefined ? BERKAS : Object.keys(projectAwal.files).find((n) => n.endsWith('.ipynb')) ?? BERKAS;
  const awal = useMemo(() => muatModel(projectAwal.files[entry] ?? ''), [projectAwal, entry]);

  const [project, setProject] = useState(projectAwal);
  const [model, setModel] = useState(awal.model);
  const [aktif, setAktif] = useState(awal.model.sel[0].id);
  const [editMd, setEditMd] = useState(() => new Set());
  const [antri, setAntri] = useState(() => new Set()); // id sel yang menunggu / sedang berjalan
  const [status, setStatus] = useState('');
  const [info, setInfo] = useState(awal.galat ? `Notebook tidak terbaca (${awal.galat}). Dibuat notebook baru.` : '');
  const [inputSel, setInputSel] = useState(null); // { id, resolve }

  const modelRef = useRef(model);
  modelRef.current = model;
  const projectRef = useRef(project);
  projectRef.current = project;
  const kernelRef = useRef(null);
  const batalRef = useRef(false);
  const nomorRef = useRef(hitungBerikutnya(awal.model) - 1);
  const diSimpanRef = useRef(projectAwal.files[entry] ?? ''); // teks mentah yang sama dengan penyimpanan lokal
  const terakhirRef = useRef(keIpynb(awal.model)); // bentuk normal model pada penyimpanan terakhir
  const menuUnduhRef = useRef(null);
  const versi = useVersiWorkspace();

  const kernel = () => {
    if (!kernelRef.current) kernelRef.current = buatKernel();
    return kernelRef.current;
  };
  useEffect(
    () => () => {
      kernelRef.current?.reset('');
    },
    [],
  );

  // Autosave: hanya saat isi notebook benar-benar berubah (bukan sekadar membuka), supaya tidak menimpa hasil edit dari perangkat lain.
  useEffect(() => {
    const t = setTimeout(() => {
      const teks = keIpynb(model);
      if (teks === terakhirRef.current) return;
      const baru = { ...projectRef.current, files: { ...projectRef.current.files, [entry]: teks } };
      setProject(baru);
      simpanProject(baru);
      terakhirRef.current = teks;
      diSimpanRef.current = teks;
    }, 700);
    return () => clearTimeout(t);
  }, [model, entry]);

  // Versi baru dari perangkat lain (hasil sinkron): ambil bila tidak ada perubahan lokal yang belum tersimpan.
  useEffect(() => {
    const baru = ambilProject(projectAwal.id);
    const teksBaru = baru?.files?.[entry];
    if (teksBaru === undefined || teksBaru === diSimpanRef.current) return;
    if (keIpynb(modelRef.current) !== terakhirRef.current) return;
    try {
      const m = dariIpynb(teksBaru);
      diSimpanRef.current = teksBaru;
      terakhirRef.current = keIpynb(m);
      setProject(baru);
      setModel(m);
      setAktif(m.sel[0].id);
    } catch {
      /* abaikan versi yang tidak terbaca */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versi]);

  const perbarui = useCallback((id, fn) => setModel((m) => ({ ...m, sel: m.sel.map((s) => (s.id === id ? fn(s) : s)) })), []);
  const tandaiAntri = (id, ada) =>
    setAntri((a) => {
      const b = new Set(a);
      if (ada) b.add(id);
      else b.delete(id);
      return b;
    });

  // ---------- Eksekusi ----------

  const jalankanSel = async (id) => {
    const sel = modelRef.current.sel.find((s) => s.id === id);
    if (!sel || sel.tipe !== 'code') return true;
    const hitung = ++nomorRef.current;
    perbarui(id, (s) => ({ ...s, keluaran: [], hitung }));
    tandaiAntri(id, true);
    setInfo('');
    const hasil = await kernel().jalankan(sel.sumber, {
      onKeluaran: (d) => perbarui(id, (s) => ({ ...s, keluaran: d })),
      onStatus: ({ pesan }) => setStatus(pesan),
      mintaInput: () => new Promise((resolve) => setInputSel({ id, resolve })),
    });
    setStatus('');
    setInputSel((x) => (x?.id === id ? null : x));
    perbarui(id, (s) => ({ ...s, keluaran: hasil }));
    tandaiAntri(id, false);
    return !hasil.some((k) => k.jenis === 'galat');
  };

  const jalankanSemua = async () => {
    batalRef.current = false;
    for (const s of modelRef.current.sel.filter((x) => x.tipe === 'code')) {
      if (batalRef.current) break;
      const ok = await jalankanSel(s.id);
      if (!ok) break;
    }
  };

  const hentikan = () => {
    batalRef.current = true;
    kernel().reset('Eksekusi dihentikan. Kernel di-restart, semua variabel dihapus.');
    setAntri(new Set());
    setInputSel(null);
    setStatus('');
  };

  const restart = () => {
    batalRef.current = true;
    kernel().reset('');
    setAntri(new Set());
    setInputSel(null);
    setStatus('');
    setInfo('Kernel di-restart: semua variabel dihapus. Jalankan ulang selnya dari atas.');
  };

  const kirimInput = (baris) => {
    const x = inputSel;
    if (!x) return;
    setInputSel(null);
    x.resolve(baris);
  };

  // ---------- Operasi sel ----------

  const sisipSetelah = (idAcuan, tipe) => {
    const baru = selBaru(tipe);
    setModel((m) => {
      const i = idAcuan ? m.sel.findIndex((s) => s.id === idAcuan) : m.sel.length - 1;
      const sel = [...m.sel];
      sel.splice(i + 1, 0, baru);
      return { ...m, sel };
    });
    setAktif(baru.id);
    if (tipe === 'markdown') setEditMd((e) => new Set(e).add(baru.id));
    return baru.id;
  };
  const hapusSel = (id) => {
    setModel((m) => {
      const sel = m.sel.filter((s) => s.id !== id);
      return { ...m, sel: sel.length ? sel : [selBaru('code')] };
    });
  };
  const pindah = (id, arah) =>
    setModel((m) => {
      const i = m.sel.findIndex((s) => s.id === id);
      const j = i + arah;
      if (i < 0 || j < 0 || j >= m.sel.length) return m;
      const sel = [...m.sel];
      [sel[i], sel[j]] = [sel[j], sel[i]];
      return { ...m, sel };
    });
  const duplikat = (id) =>
    setModel((m) => {
      const i = m.sel.findIndex((s) => s.id === id);
      const salinan = { ...selBaru(m.sel[i].tipe, m.sel[i].sumber) };
      const sel = [...m.sel];
      sel.splice(i + 1, 0, salinan);
      return { ...m, sel };
    });
  const gantiTipe = (id) =>
    perbarui(id, (s) => ({ ...s, tipe: s.tipe === 'code' ? 'markdown' : 'code', keluaran: [], hitung: null }));

  const jalankanLanjut = async (id) => {
    const i = modelRef.current.sel.findIndex((s) => s.id === id);
    const sel = modelRef.current.sel[i];
    if (sel.tipe === 'markdown') setEditMd((e) => (e.delete(id), new Set(e)));
    const berikut = modelRef.current.sel[i + 1];
    if (berikut) setAktif(berikut.id);
    else sisipSetelah(id, 'code');
    if (sel.tipe === 'code') await jalankanSel(id);
  };

  const keyDownSel = (e, id) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      jalankanLanjut(id);
    }
  };

  const gantiNama = () => {
    const nama = window.prompt('Nama notebook:', project.nama);
    if (!nama) return;
    const baru = { ...project, nama };
    setProject(baru);
    simpanProject(baru);
  };

  const tutupMenu = () => menuUnduhRef.current?.removeAttribute('open');
  const unduhIpynb = () => {
    tutupMenu();
    unduh(`${namaAman(project.nama)}.ipynb`, keIpynb(model));
  };
  const unduhPy = () => {
    tutupMenu();
    const kode = model.sel
      .map((s) => (s.tipe === 'code' ? s.sumber : s.sumber.split('\n').map((b) => `# ${b}`).join('\n')))
      .join('\n\n');
    unduh(`${namaAman(project.nama)}.py`, `${kode}\n`, 'text/x-python');
  };

  const sedangJalan = antri.size > 0;

  return (
    <main className="halaman notebook-halaman">
      <div className="notebook-bar">
        <div className="notebook-bar-atas">
          <Link to="/workspace" className="link-kecil" aria-label="Kembali ke daftar Workspace">
            ← <span className="teks-aksi">Workspace</span>
          </Link>
          <button className="workspace-nama-tombol" onClick={gantiNama} title="Ganti nama notebook">
            {project.nama} ✏️
          </button>
          <span className="chip-bahasa-kecil">Python Notebook</span>
        </div>
        <div className="notebook-aksi">
          {sedangJalan ? (
            <button className="tombol tombol-berhenti kecil" onClick={hentikan}>
              ⏹ Stop
            </button>
          ) : (
            <button className="tombol tombol-jalan kecil" onClick={jalankanSemua}>
              ▶▶ Jalankan semua
            </button>
          )}
          <button className="tombol tombol-kedua kecil" onClick={() => sisipSetelah(aktif, 'code')}>
            ＋ Kode
          </button>
          <button className="tombol tombol-kedua kecil" onClick={() => sisipSetelah(aktif, 'markdown')}>
            ＋ Teks
          </button>
          <button className="tombol tombol-kedua kecil" onClick={restart} title="Hapus semua variabel dan mulai kernel baru">
            ♻️ Restart
          </button>
          <details className="menu-unduh" ref={menuUnduhRef}>
            <summary className="tombol tombol-kedua kecil">⬇️ Unduh</summary>
            <div className="menu-unduh-isi">
              <button onClick={unduhIpynb}>Notebook (.ipynb)</button>
              <button onClick={unduhPy}>Skrip Python (.py)</button>
            </div>
          </details>
        </div>
      </div>

      {status && <div className="notebook-status">⏳ {status}</div>}
      {info && (
        <p className="pemberitahuan-ujian" onClick={() => setInfo('')}>
          {info}
        </p>
      )}

      <div className="notebook-daftar">
        {model.sel.map((s, i) => {
          const berjalan = antri.has(s.id);
          const mdEdit = s.tipe === 'markdown' && (editMd.has(s.id) || s.sumber.trim() === '');
          return (
            <div key={s.id} className="notebook-blok">
              <div className={`nb-sel ${aktif === s.id ? 'aktif' : ''} nb-${s.tipe}`} onClick={() => setAktif(s.id)} onKeyDownCapture={(e) => keyDownSel(e, s.id)}>
                <div className="nb-gutter" title={s.tipe === 'code' ? 'Nomor eksekusi' : 'Sel teks'}>
                  {s.tipe === 'code' ? `[${berjalan ? '*' : s.hitung ?? ' '}]` : '¶'}
                </div>
                <div className="nb-isi">
                  {s.tipe === 'code' ? (
                    <>
                      <div className="nb-editor">
                        <Editor
                          nilai={s.sumber}
                          onUbah={(v) => perbarui(s.id, (x) => ({ ...x, sumber: v }))}
                          onJalankan={() => jalankanSel(s.id)}
                          bahasa="python"
                          gelap={gelap}
                          otomatis
                        />
                      </div>
                      <HasilPython keluaran={s.keluaran} menungguInput={inputSel?.id === s.id} onKirimInput={kirimInput} />
                    </>
                  ) : mdEdit ? (
                    <textarea
                      className="nb-markdown-edit"
                      value={s.sumber}
                      autoFocus={s.sumber === ''}
                      rows={Math.max(3, s.sumber.split('\n').length + 1)}
                      placeholder="Tulis catatan dengan Markdown… (Shift+Enter untuk menampilkan)"
                      onChange={(e) => perbarui(s.id, (x) => ({ ...x, sumber: e.target.value }))}
                      onBlur={() => setEditMd((e) => (e.delete(s.id), new Set(e)))}
                      spellCheck={false}
                    />
                  ) : (
                    <div className="nb-markdown-tampil" onDoubleClick={() => setEditMd((e) => new Set(e).add(s.id))} title="Klik dua kali untuk mengubah">
                      <Markdown>{s.sumber}</Markdown>
                    </div>
                  )}
                </div>
                <div className="nb-alat">
                  {s.tipe === 'code' && (
                    <button className="nb-alat-tombol nb-jalan" onClick={() => jalankanSel(s.id)} disabled={berjalan} title="Jalankan sel (Ctrl+Enter)" aria-label="Jalankan sel">
                      ▶
                    </button>
                  )}
                  {s.tipe === 'markdown' && !mdEdit && (
                    <button className="nb-alat-tombol" onClick={() => setEditMd((e) => new Set(e).add(s.id))} title="Ubah teks" aria-label="Ubah teks">
                      ✏️
                    </button>
                  )}
                  <button className="nb-alat-tombol" onClick={() => pindah(s.id, -1)} disabled={i === 0} title="Pindah ke atas" aria-label="Pindah ke atas">
                    ▲
                  </button>
                  <button className="nb-alat-tombol" onClick={() => pindah(s.id, 1)} disabled={i === model.sel.length - 1} title="Pindah ke bawah" aria-label="Pindah ke bawah">
                    ▼
                  </button>
                  <button className="nb-alat-tombol" onClick={() => duplikat(s.id)} title="Gandakan sel" aria-label="Gandakan sel">
                    ⧉
                  </button>
                  <button className="nb-alat-tombol" onClick={() => gantiTipe(s.id)} title={s.tipe === 'code' ? 'Jadikan sel teks' : 'Jadikan sel kode'} aria-label="Ganti jenis sel">
                    ⇄
                  </button>
                  <button className="nb-alat-tombol" onClick={() => hapusSel(s.id)} title="Hapus sel" aria-label="Hapus sel">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="nb-sisip">
                <button onClick={() => sisipSetelah(s.id, 'code')}>＋ Kode</button>
                <button onClick={() => sisipSetelah(s.id, 'markdown')}>＋ Teks</button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="teks-redup notebook-catatan">
        Python berjalan sungguhan di browsermu (Pyodide), jadi tidak butuh server. Pustaka seperti <code>numpy</code>, <code>pandas</code>, dan <code>matplotlib</code> dimuat
        otomatis saat di-<code>import</code> (butuh internet pada pemakaian pertama). Pintasan: <b>Ctrl+Enter</b> jalankan sel, <b>Shift+Enter</b> jalankan lalu pindah ke sel berikut.
        Notebook tersimpan otomatis dan kompatibel dengan Jupyter (.ipynb).
      </p>
    </main>
  );
}
