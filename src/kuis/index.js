import { pelajaranById } from '../lessons/index.js';
import { periksaKuis } from './validasi.js';

// Satu berkas per chapter; isinya { [idPelajaran]: { intisari, rangkuman, soal } }.
const modul = import.meta.glob('./*.js', { eager: true });

export const kuisById = {};
for (const [path, m] of Object.entries(modul)) {
  if (path === './index.js' || path === './validasi.js') continue;
  Object.assign(kuisById, m.default ?? m);
}

if (import.meta.env?.DEV) {
  const masalah = periksaKuis(kuisById, pelajaranById);
  if (masalah.length > 0) console.warn(`Bank kuis bermasalah:\n- ${masalah.join('\n- ')}`);
}
