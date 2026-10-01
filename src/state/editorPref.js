// Preferensi tampilan editor kode (ukuran huruf/zoom & pembungkusan baris), dibagi ke semua editor
// dan disimpan di localStorage. Memakai useSyncExternalStore supaya semua editor ikut berubah bersamaan.
import { useSyncExternalStore } from 'react';

const KUNCI = 'latihkode:editor:v1';
export const UKURAN_MIN = 9;
export const UKURAN_MAKS = 28;

const sentuh = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches ?? false);
// 16px di layar sentuh = batas agar iOS tidak otomatis memperbesar halaman saat editor difokus.
const UKURAN_AWAL = sentuh ? 16 : 14.5;

const jepit = (n) => Math.min(UKURAN_MAKS, Math.max(UKURAN_MIN, Math.round(n * 2) / 2));

function muat() {
  try {
    const d = JSON.parse(localStorage.getItem(KUNCI) ?? '{}');
    return { ukuran: jepit(Number(d.ukuran) || UKURAN_AWAL), bungkus: d.bungkus === true };
  } catch {
    return { ukuran: UKURAN_AWAL, bungkus: false };
  }
}

let state = muat();
const pendengar = new Set();

function set(baru) {
  state = { ...state, ...baru };
  try {
    localStorage.setItem(KUNCI, JSON.stringify(state));
  } catch {
    /* penyimpanan diblokir: preferensi hanya berlaku selama sesi */
  }
  pendengar.forEach((f) => f());
}

const langganan = (f) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};
const ambil = () => state;

export const setUkuran = (n) => set({ ukuran: jepit(n) });
export const ubahUkuran = (delta) => setUkuran(state.ukuran + delta);
export const resetUkuran = () => set({ ukuran: UKURAN_AWAL });
export const toggleBungkus = () => set({ bungkus: !state.bungkus });
export const ukuranSaatIni = () => state.ukuran;

export function useEditorPref() {
  return useSyncExternalStore(langganan, ambil, ambil);
}
