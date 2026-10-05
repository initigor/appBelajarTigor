// Penyimpanan project Workspace (mode ngoding bebas), localStorage. Hanya JavaScript & Python
// (Java tetap lewat course terpisah — lihat README bagian "/lab: Uji Kelayakan Runtime Browser").
// Bila sudah masuk akun, project disinkronkan ke cloud (src/state/akun.jsx); penggabungannya ada di
// src/state/gabungWorkspace.js.
import { useSyncExternalStore } from 'react';
import { rapikanWorkspace } from './gabungWorkspace.js';

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
    return rapikanWorkspace(raw ? JSON.parse(raw) : null);
  } catch {
    return rapikanWorkspace(null);
  }
}

function simpan(data) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    /* penyimpanan penuh/diblokir: abaikan */
  }
}

// ---------- Pemberitahuan perubahan ----------
// jenis 'lokal'   : pengguna mengubah project -> perlu dikirim ke cloud
// jenis 'sinkron' : isi diganti oleh hasil sinkron -> hanya perlu menyegarkan tampilan
let versi = 0;
const pendengar = new Set();
function umumkan(jenis) {
  versi++;
  pendengar.forEach((f) => f(jenis));
}
export function langgananWorkspace(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}
/** Angka yang naik setiap Workspace berubah; dipakai komponen supaya ikut menyegarkan tampilan. */
export function useVersiWorkspace() {
  return useSyncExternalStore(langgananWorkspace, () => versi, () => versi);
}

const idBaru = () => `wp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function daftarProject() {
  return Object.values(muat().projects).sort((a, b) => b.diubah - a.diubah);
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
  umumkan('lokal');
  return data.projects[id];
}

export function hapusProject(id) {
  const data = muat();
  delete data.projects[id];
  data.dihapus[id] = Date.now();
  simpan(data);
  umumkan('lokal');
}

/** Tanda tangan isi project (tanpa waktu), untuk mengetahui apakah isinya benar-benar berubah. */
export const tandaProject = (p) => JSON.stringify([p.nama, p.bahasa, p.entryPoint, p.files]);

/**
 * Simpan seluruh state project (files, entryPoint, nama) sekaligus.
 * Tidak menyimpan bila isinya sama: waktu `diubah` hanya boleh naik karena perubahan sungguhan,
 * kalau tidak, sekadar membuka project di perangkat lama akan menimpa hasil edit dari perangkat lain.
 */
export function simpanProject(project) {
  const data = muat();
  const ada = data.projects[project.id];
  if (!ada) return;
  if (tandaProject(ada) === tandaProject(project)) return;
  data.projects[project.id] = { ...project, diubah: Date.now() };
  simpan(data);
  umumkan('lokal');
}

export function namaFileTersedia(files, nama) {
  return !Object.prototype.hasOwnProperty.call(files, nama);
}

// ---------- Sinkron ----------

/** Isi lengkap (termasuk batu nisan) untuk digabung dengan cloud. */
export function ambilUntukSinkron() {
  return muat();
}

/** Ganti isi lokal dengan hasil gabungan dari sinkron. */
export function terapkanDariSinkron(gabungan) {
  simpan(rapikanWorkspace(gabungan));
  umumkan('sinkron');
}
