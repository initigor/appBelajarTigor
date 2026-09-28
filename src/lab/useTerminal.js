// Hook kecil untuk memasang xterm.js ke sebuah <div>. Dipakai oleh halaman /lab.
import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

/** @returns {{ elRef, term: React.MutableRefObject<Terminal|null>, tulis, tulisBaris, bersihkan }} */
export function useTerminal() {
  const elRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      convertEol: true,
      fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
      fontSize: 13,
      theme: { background: '#12111c' },
      cursorBlink: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(elRef.current);
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;

    const onResize = () => {
      try {
        fit.fit();
      } catch {
        /* elemen mungkin belum terlihat (0 lebar) — abaikan */
      }
    };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(elRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  const tulis = (teks) => termRef.current?.write(teks);
  const tulisBaris = (teks = '') => termRef.current?.writeln(teks);
  const bersihkan = () => termRef.current?.clear();

  return { elRef, termRef, tulis, tulisBaris, bersihkan };
}
