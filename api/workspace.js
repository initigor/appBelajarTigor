// GET /api/workspace  →  { workspace | null }
// PUT /api/workspace  { workspace: { projects, dihapus } }  →  { disimpan }
// Project Workspace per akun (berkas kode JavaScript/Python), supaya bisa dilanjutkan di semua perangkat.
// Penggabungan antarperangkat dilakukan di klien (src/state/gabungWorkspace.js); server hanya memvalidasi
// bentuk & ukuran lalu menyimpan.
import { ambilDb } from '../server/db.js';
import { aman, bacaJson, HttpError, json } from '../server/http.js';
import { kunciWorkspace, penggunaAktif } from '../server/sesi.js';

const MAKS_PROJECT = 100;
const MAKS_BERKAS_PER_PROJECT = 100;
const MAKS_DIHAPUS = 200;

export const GET = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const workspace = await db.get(kunciWorkspace(username));
  return json(200, { workspace: workspace ?? null });
});

export const PUT = aman(async (req) => {
  const db = ambilDb();
  const { username } = await penggunaAktif(req, db);
  const { workspace } = await bacaJson(req, 900 * 1024);

  if (!workspace || typeof workspace !== 'object' || Array.isArray(workspace)) throw new HttpError(400, 'Data workspace tidak valid.');
  const { projects, dihapus } = workspace;
  if (!projects || typeof projects !== 'object' || Array.isArray(projects)) throw new HttpError(400, 'Daftar project tidak valid.');
  const daftar = Object.entries(projects);
  if (daftar.length > MAKS_PROJECT) throw new HttpError(400, `Maksimal ${MAKS_PROJECT} project yang bisa disinkronkan.`);
  for (const [id, p] of daftar) {
    const ok =
      p &&
      typeof p === 'object' &&
      p.id === id &&
      id.length <= 60 &&
      typeof p.nama === 'string' &&
      p.nama.length <= 200 &&
      typeof p.bahasa === 'string' &&
      p.bahasa.length <= 20 &&
      typeof p.entryPoint === 'string' &&
      Number.isFinite(p.diubah) &&
      p.files &&
      typeof p.files === 'object' &&
      !Array.isArray(p.files) &&
      Object.keys(p.files).length <= MAKS_BERKAS_PER_PROJECT &&
      Object.values(p.files).every((isi) => typeof isi === 'string');
    if (!ok) throw new HttpError(400, 'Ada project yang bentuknya tidak valid.');
  }

  const nisan = {};
  if (dihapus && typeof dihapus === 'object' && !Array.isArray(dihapus)) {
    for (const [id, t] of Object.entries(dihapus).slice(0, MAKS_DIHAPUS)) if (id.length <= 60 && Number.isFinite(t)) nisan[id] = t;
  }

  const disimpan = Date.now();
  await db.set(kunciWorkspace(username), { projects, dihapus: nisan, disimpan });
  return json(200, { disimpan });
});
