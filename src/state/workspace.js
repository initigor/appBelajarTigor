// Penyimpanan project Workspace (mode ngoding bebas), localStorage. Hanya JavaScript & Python
// (Java tetap lewat course terpisah — lihat README bagian "/lab: Uji Kelayakan Runtime Browser").
const KUNCI = 'latihkode:workspace:v1';

export const TEMPLAT = {
  javascript: {
    label: 'JavaScript: Hello World',
    entryPoint: 'main.js',
    files: { 'main.js': 'console.log("Halo dari Workspace!");\n' },
  },
  python: {
    label: 'Python: Hello World',
    entryPoint: 'main.py',
    files: { 'main.py': 'print("Halo dari Workspace!")\n' },
  },
};

function muat() {
  try {
    const raw = localStorage.getItem(KUNCI);
    return raw ? JSON.parse(raw) : { projects: {} };
  } catch {
    return { projects: {} };
  }
}

function simpan(data) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    /* penyimpanan penuh/diblokir: abaikan */
  }
}

const idBaru = () => `wp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function daftarProject() {
  const data = muat();
  return Object.values(data.projects).sort((a, b) => b.diubah - a.diubah);
}

export function ambilProject(id) {
  return muat().projects[id] ?? null;
}

export function buatProject(nama, bahasa, dariTemplat = true) {
  const data = muat();
  const id = idBaru();
  const tpl = TEMPLAT[bahasa];
  const kini = Date.now();
  data.projects[id] = {
    id,
    nama: nama || tpl.label,
    bahasa,
    entryPoint: tpl.entryPoint,
    files: dariTemplat ? { ...tpl.files } : {},
    dibuat: kini,
    diubah: kini,
  };
  simpan(data);
  return data.projects[id];
}

export function hapusProject(id) {
  const data = muat();
  delete data.projects[id];
  simpan(data);
}

/** Simpan seluruh state project (files, entryPoint, nama) sekaligus. */
export function simpanProject(project) {
  const data = muat();
  if (!data.projects[project.id]) return;
  data.projects[project.id] = { ...project, diubah: Date.now() };
  simpan(data);
}

export function namaFileTersedia(files, nama) {
  return !Object.prototype.hasOwnProperty.call(files, nama);
}
