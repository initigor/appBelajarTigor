// Model Notebook (.ipynb) untuk Workspace. Fungsi murni: tanpa React/DOM, sehingga bisa dites di Node.
//
// Di dalam aplikasi, notebook disimpan sebagai TEKS JSON berformat Jupyter (nbformat 4) di dalam
// `project.files['main.ipynb']`, jadi bisa diimpor/diekspor dari/ke Jupyter dan ikut tersinkron lewat akun.
//
// Model internal: { sel: [{ id, tipe: 'code' | 'markdown', sumber, keluaran: [], hitung: number | null }] }
// Bentuk `keluaran`: lihat src/engine/keluaranPython.js.

const MAKS_TEKS_KELUARAN = 50_000;
const MAKS_GAMBAR_TERSIMPAN = 150_000; // karakter base64 per gambar yang ikut disimpan; yang lebih besar dibuang saat disimpan
const MAKS_SEL = 300;

let penghitungId = 0;
export const idSelBaru = () => `sel-${Date.now().toString(36)}-${(penghitungId++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const selBaru = (tipe = 'code', sumber = '') => ({ id: idSelBaru(), tipe, sumber, keluaran: [], hitung: null });

export function notebookAwal() {
  return {
    sel: [
      selBaru(
        'markdown',
        '# Notebook Python 🐍\n\nSel **teks** ditulis dengan Markdown, sel **kode** dijalankan dengan Python sungguhan di browser.\n\nTekan **Shift+Enter** (atau tombol ▶) untuk menjalankan sel.',
      ),
      selBaru('code', 'nama = "Dunia"\nprint(f"Halo, {nama}!")\n\n2 + 3 * 4'),
      selBaru('code', '# Variabel dari sel sebelumnya masih ada\nfor i in range(3):\n    print(i, nama)'),
    ],
  };
}

const bagiBaris = (teks) => {
  if (teks === '') return [];
  const bagian = teks.split('\n');
  return bagian.map((b, i) => (i < bagian.length - 1 ? `${b}\n` : b));
};
const gabungSumber = (s) => (Array.isArray(s) ? s.join('') : typeof s === 'string' ? s : '');
const potong = (t) => (t.length > MAKS_TEKS_KELUARAN ? `${t.slice(0, MAKS_TEKS_KELUARAN)}\n… (keluaran dipotong)` : t);
// eslint-disable-next-line no-control-regex
const buangAnsi = (t) => t.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

function keluaranKeIpynb(k, hitung) {
  if (k.jenis === 'stream') return { output_type: 'stream', name: k.nama, text: bagiBaris(potong(k.teks)) };
  if (k.jenis === 'hasil') return { output_type: 'execute_result', execution_count: hitung, data: { 'text/plain': bagiBaris(potong(k.teks)) }, metadata: {} };
  if (k.jenis === 'gambar') return { output_type: 'display_data', data: { 'image/png': k.data, 'text/plain': ['<Figure>'] }, metadata: {} };
  const teks = potong(k.teks);
  const barisTerakhir = teks.trim().split('\n').pop() ?? '';
  const m = barisTerakhir.match(/^([A-Za-z_][\w.]*)(?::\s*(.*))?$/);
  return { output_type: 'error', ename: m ? m[1] : 'Error', evalue: m ? m[2] ?? '' : barisTerakhir, traceback: teks.split('\n') };
}

/** Model -> teks JSON .ipynb. */
export function keIpynb(model) {
  const sel = model.sel.map((s) => {
    if (s.tipe === 'markdown') return { cell_type: 'markdown', metadata: {}, source: bagiBaris(s.sumber) };
    const outputs = s.keluaran.filter((k) => !(k.jenis === 'gambar' && k.data.length > MAKS_GAMBAR_TERSIMPAN)).map((k) => keluaranKeIpynb(k, s.hitung));
    return { cell_type: 'code', execution_count: s.hitung, metadata: {}, outputs, source: bagiBaris(s.sumber) };
  });
  return JSON.stringify(
    {
      cells: sel,
      metadata: { kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' }, language_info: { name: 'python' } },
      nbformat: 4,
      nbformat_minor: 4,
    },
    null,
    1,
  );
}

function keluaranDariIpynb(o) {
  if (!o || typeof o !== 'object') return [];
  if (o.output_type === 'stream') return [{ jenis: 'stream', nama: o.name === 'stderr' ? 'stderr' : 'stdout', teks: potong(gabungSumber(o.text)) }];
  if (o.output_type === 'execute_result' || o.output_type === 'display_data') {
    const d = o.data ?? {};
    const png = gabungSumber(d['image/png']).replace(/\s+/g, '');
    if (png) return [{ jenis: 'gambar', data: png }];
    const teks = gabungSumber(d['text/plain']);
    return teks ? [{ jenis: 'hasil', teks: potong(teks) }] : [];
  }
  if (o.output_type === 'error') {
    const tb = Array.isArray(o.traceback) && o.traceback.length ? o.traceback.map(buangAnsi).join('\n') : `${o.ename ?? 'Error'}: ${o.evalue ?? ''}`;
    return [{ jenis: 'galat', teks: potong(tb) }];
  }
  return [];
}

/** Teks JSON .ipynb -> model. Melempar Error berpesan jelas bila bukan notebook yang bisa dibaca. */
export function dariIpynb(teks) {
  let nb;
  try {
    nb = JSON.parse(teks);
  } catch {
    throw new Error('Berkas ini bukan JSON yang valid, jadi bukan notebook .ipynb.');
  }
  if (!nb || typeof nb !== 'object' || !Array.isArray(nb.cells)) throw new Error('Tidak ada daftar sel (cells). Pastikan ini berkas .ipynb.');
  if (typeof nb.nbformat === 'number' && nb.nbformat < 4) throw new Error('Format notebook terlalu lama (nbformat 3). Simpan ulang sebagai nbformat 4 di Jupyter.');
  if (nb.cells.length > MAKS_SEL) throw new Error(`Notebook terlalu besar (${nb.cells.length} sel, maksimal ${MAKS_SEL}).`);
  const sel = nb.cells.map((c) => {
    const sumber = gabungSumber(c?.source);
    if (c?.cell_type === 'code') {
      const hitung = Number.isInteger(c.execution_count) ? c.execution_count : null;
      return { id: idSelBaru(), tipe: 'code', sumber, keluaran: (c.outputs ?? []).flatMap(keluaranDariIpynb), hitung };
    }
    return { id: idSelBaru(), tipe: 'markdown', sumber, keluaran: [], hitung: null }; // markdown & raw
  });
  return { sel: sel.length ? sel : [selBaru('code')] };
}

export const teksNotebookAwal = () => keIpynb(notebookAwal());

/** Angka `In [n]` berikutnya: lebih besar dari semua yang sudah dipakai. */
export const hitungBerikutnya = (model) => model.sel.reduce((m, s) => Math.max(m, s.hitung ?? 0), 0) + 1;
