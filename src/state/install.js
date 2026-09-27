// Status "Install aplikasi" (PWA).
// - Android/Chrome/Edge: browser mengirim event `beforeinstallprompt`. Kita simpan event itu
//   supaya bisa memunculkan dialog install dari tombol kita sendiri.
// - iOS/iPadOS: tidak ada event itu. User harus lewat Safari → Bagikan → Tambahkan ke Layar Utama,
//   jadi kita tampilkan tutorial.
import { useEffect, useReducer } from 'react';

let promptTertunda = null;
let baruTerpasang = false;
const pendengar = new Set();
const beritahu = () => pendengar.forEach((f) => f());

/** Panggil sekali saat aplikasi dimulai (sebelum React render), karena event bisa datang sangat awal. */
export function mulaiDengarInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // jangan tampilkan mini-infobar bawaan; kita pakai tombol sendiri
    promptTertunda = e;
    beritahu();
  });
  window.addEventListener('appinstalled', () => {
    promptTertunda = null;
    baruTerpasang = true;
    beritahu();
  });
}

export function deteksiPlatform() {
  const ua = navigator.userAgent;
  // iPadOS 13+ mengaku sebagai "Macintosh", jadi cek juga layar sentuhnya.
  const iPadBaru = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (/iPhone|iPod/.test(ua)) return 'iphone';
  if (/iPad/.test(ua) || iPadBaru) return 'ipad';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export function sedangStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function useInstall() {
  const [, render] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    pendengar.add(render);
    return () => pendengar.delete(render);
  }, []);

  const platform = deteksiPlatform();
  return {
    platform,
    ios: platform === 'iphone' || platform === 'ipad',
    /** Browser siap menampilkan dialog install (Android / Chrome / Edge). */
    bisaInstall: promptTertunda !== null,
    sudahTerpasang: baruTerpasang || sedangStandalone(),
    /** Tampilkan dialog install bawaan browser. Mengembalikan 'accepted' | 'dismissed' | 'tidak-tersedia'. */
    async install() {
      if (!promptTertunda) return 'tidak-tersedia';
      const e = promptTertunda;
      promptTertunda = null;
      beritahu();
      await e.prompt();
      const { outcome } = await e.userChoice;
      return outcome;
    },
  };
}
