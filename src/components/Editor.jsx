import { useEffect, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap, EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { resetUkuran, setUkuran, toggleBungkus, ubahUkuran, ukuranSaatIni, useEditorPref } from '../state/editorPref.js';

// Dua jari: cubit untuk zoom, seperti di editor kode HP lain. touch-action di CSS membiarkan
// geser satu jari tetap menggulir kode, tapi menyerahkan cubitan ke sini (bukan zoom halaman).
function useCubitZoom(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let awal = null;
    const jarak = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mulai = (e) => {
      if (e.touches.length === 2) awal = { jarak: jarak(e.touches), ukuran: ukuranSaatIni() };
    };
    // Pasif: listener non-pasif pada touchmove memaksa iOS menunggu JavaScript tiap gerakan jari,
    // yang mengganggu pemilihan teks (blok) dan menggulir. Cubitan sudah dicegah zoom halamannya oleh touch-action.
    const gerak = (e) => {
      if (!awal || e.touches.length !== 2) return;
      setUkuran((awal.ukuran * jarak(e.touches)) / awal.jarak);
    };
    const selesai = (e) => {
      if (e.touches.length < 2) awal = null;
    };
    el.addEventListener('touchstart', mulai, { passive: true });
    el.addEventListener('touchmove', gerak, { passive: true });
    el.addEventListener('touchend', selesai, { passive: true });
    el.addEventListener('touchcancel', selesai, { passive: true });
    return () => {
      el.removeEventListener('touchstart', mulai);
      el.removeEventListener('touchmove', gerak);
      el.removeEventListener('touchend', selesai);
      el.removeEventListener('touchcancel', selesai);
    };
  }, [ref]);
}

/** `otomatis`: tinggi mengikuti isi (dipakai sel notebook & blok kode di pelajaran), bukan memenuhi induknya. */
export default function Editor({ nilai, onUbah, onJalankan, gelap, jsx, bahasa = 'javascript', readOnly, onView, otomatis }) {
  const { ukuran, bungkus } = useEditorPref();
  const kotakRef = useRef(null);
  useCubitZoom(kotakRef);
  // Disimpan di ref supaya `ekstensi` stabil: kalau berubah tiap render (mis. onJalankan berupa fungsi inline),
  // CodeMirror mengonfigurasi ulang editor di tengah pemilihan teks dan seleksi di iPad ikut terganggu.
  const jalankanRef = useRef(onJalankan);
  jalankanRef.current = onJalankan;

  const ekstensi = useMemo(
    () => [
      bahasa === 'java' ? java() : bahasa === 'python' ? python() : javascript({ jsx }),
      // Default tanpa pembungkusan: baris panjang tetap satu baris & digulir ke samping,
      // supaya struktur kode (indentasi, baris) tidak tampak rusak di layar sempit.
      ...(bungkus ? [EditorView.lineWrapping] : []),
      EditorView.editable.of(!readOnly),
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              jalankanRef.current?.();
              return true;
            },
          },
        ]),
      ),
    ],
    [jsx, bahasa, readOnly, bungkus],
  );

  return (
    <div className={`editor-kotak ${bungkus ? 'bungkus' : ''} ${readOnly ? 'baca-saja' : ''} ${otomatis ? 'otomatis' : ''}`} ref={kotakRef}>
      <CodeMirror
        className="editor"
        style={{ '--ukuran-kode': `${ukuran}px` }}
        value={nilai}
        onChange={onUbah}
        extensions={ekstensi}
        theme={gelap ? oneDark : 'light'}
        height={otomatis ? 'auto' : '100%'}
        minHeight={otomatis ? '60px' : undefined}
        maxHeight={otomatis ? '420px' : undefined}
        basicSetup={{ tabSize: 2, foldGutter: false, autocompletion: true }}
        indentWithTab
        onCreateEditor={(view) => onView?.(view)}
      />
      {!readOnly && (
        // preventDefault supaya editor tidak kehilangan fokus (keyboard HP tidak tertutup)
        <div className="editor-zoom" role="group" aria-label="Tampilan editor" onPointerDown={(e) => e.preventDefault()}>
          <button type="button" onClick={() => ubahUkuran(-1)} aria-label="Perkecil huruf" title={`Perkecil huruf (${ukuran}px)`}>
            A−
          </button>
          <button type="button" onClick={() => ubahUkuran(1)} aria-label="Perbesar huruf" title={`Perbesar huruf (${ukuran}px)`}>
            A+
          </button>
          <button type="button" onClick={resetUkuran} aria-label="Ukuran huruf standar" title="Ukuran huruf standar" className="zoom-angka">
            {ukuran}
          </button>
          <button
            type="button"
            onClick={toggleBungkus}
            aria-pressed={bungkus}
            aria-label="Bungkus baris panjang"
            title={bungkus ? 'Baris dibungkus — ketuk untuk melebar ke samping' : 'Baris melebar ke samping — ketuk untuk membungkus'}
            className={bungkus ? 'aktif' : ''}
          >
            ↩
          </button>
        </div>
      )}
    </div>
  );
}
