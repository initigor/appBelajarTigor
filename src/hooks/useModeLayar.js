import { useEffect, useState } from 'react';

// Batas lebar layar (px):
//   < 700        -> 'hp'      : tab Materi | Kode | Hasil
//   700 – 1023   -> 'tablet'  : tab Materi | Kode (editor + output bertumpuk), mis. iPad portrait
//   >= 1024      -> 'desktop' : dua kolom berdampingan, mis. laptop / iPad landscape
function hitungMode() {
  const w = window.innerWidth;
  if (w < 700) return 'hp';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function useModeLayar() {
  const [mode, setMode] = useState(hitungMode);
  useEffect(() => {
    const ubah = () => setMode(hitungMode());
    window.addEventListener('resize', ubah);
    window.addEventListener('orientationchange', ubah);
    return () => {
      window.removeEventListener('resize', ubah);
      window.removeEventListener('orientationchange', ubah);
    };
  }, []);
  return mode;
}

/** true jika perangkat utamanya layar sentuh (HP/tablet). */
export const layarSentuh = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches ?? false);
