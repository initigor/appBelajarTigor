import { susunPelajaran } from './susun.js';

const modul = import.meta.glob('./*/*.js', { eager: true });

export const { semuaPelajaran, daftarChapter, pelajaranById } = susunPelajaran(modul);
