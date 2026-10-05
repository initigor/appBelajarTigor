// Akses gabungan ke daftar "sintaks penting" kedua jalur belajar (JavaScript → React, dan Java — PBO).
import { sintaksJs } from './sintaks-js.js';
import { sintaksJava } from '../lessonsJava/sintaks-java.js';

export const dataSintaks = { js: sintaksJs, java: sintaksJava };

/** Jumlah butir sintaks pada satu chapter/pekan; 0 jika chapter itu belum punya daftar. */
export function jumlahSintaks(jalur, chapterId) {
  const grup = dataSintaks[jalur]?.[chapterId];
  return grup ? grup.reduce((a, g) => a + g.butir.length, 0) : 0;
}
