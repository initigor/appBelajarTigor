import { susunPelajaranJava } from './susun.js';

const modul = import.meta.glob('./*/*.js', { eager: true });

export const { semuaPelajaranJava, daftarChapterJava, pelajaranByIdJava } = susunPelajaranJava(modul);
