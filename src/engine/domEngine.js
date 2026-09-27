// Menjalankan pelajaran bertipe 'dom' dan 'react' di sebuah document (iframe di browser, jsdom di Node).
import { olahKode } from './babel.js';
import { buatKonsol, OFFSET_DASAR } from './jsEngine.js';
import { formatValue } from './format.js';
import { buatCtxDasar, formatError, formatSyntaxError, gagal, jalankanTes, semuaGagal } from './tes.js';

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

function modulReact(React) {
  // Tanpa __esModule, sehingga `import React from 'react'` menghasilkan objek ini sendiri.
  const m = { ...React };
  delete m.__esModule;
  delete m.default;
  return m;
}

/**
 * @param {object} o
 * @param {string} o.kode
 * @param {object} o.pelajaran
 * @param {Document} o.doc   document tempat kode dijalankan (sudah berisi html pelajaran)
 * @param {Window} o.win     window milik doc
 * @param {object} [o.React] wajib untuk tipe 'react'
 * @param {object} [o.ReactDOMClient] wajib untuk tipe 'react' (react-dom/client)
 * @param {Function} [o.flushSync] dari react-dom
 * @param {(entri)=>void} [o.onLog]
 * @param {(root)=>void} [o.onRoot] menerima React root supaya bisa di-unmount nanti
 * @param {boolean} [o.denganTes=true]
 */
export async function jalankanDom({ kode, pelajaran, doc, win, React, ReactDOMClient, flushSync, onLog, onRoot, denganTes = true }) {
  const isReact = pelajaran.tipe === 'react';
  // Baris tambahan sebelum kode user: header new Function (+1 baris __daftarScope untuk tipe dom).
  const offsetBaris = isReact ? OFFSET_DASAR : OFFSET_DASAR + 1;
  const logs = [];
  let sedangTes = false;
  const dorong = (level, text) => {
    const entri = { level, text };
    if (sedangTes && level !== 'error') return; // log akibat simulasi tes tidak ditampilkan
    logs.push(entri);
    onLog?.(entri);
  };
  let errorPertama = null;
  const lapor = (err) => {
    const teks = formatError(err, offsetBaris);
    if (!errorPertama) errorPertama = teks;
    dorong('error', teks);
  };

  let olah;
  try {
    olah = olahKode(kode, { jsx: isReact, modul: isReact, jagaLoop: true });
  } catch (e) {
    const teks = formatSyntaxError(e);
    dorong('error', teks);
    return { logs, error: teks, hasil: semuaGagal(pelajaran.tes, 'Perbaiki SyntaxError dulu, lalu jalankan lagi.') };
  }

  // Tangkap error yang terjadi belakangan (misalnya di dalam event handler).
  const onError = (ev) => {
    lapor(ev.error ?? ev.message);
    ev.preventDefault?.();
  };
  const onReject = (ev) => {
    lapor(ev.reason);
    ev.preventDefault?.();
  };
  win.addEventListener('error', onError);
  win.addEventListener('unhandledrejection', onReject);

  const konsol = buatKonsol(dorong);
  const global = {
    document: doc,
    window: win,
    console: konsol,
    alert: (x) => dorong('log', `[alert] ${formatValue(x)}`),
  };

  // Buat fungsi di "dunia" iframe supaya error di event handler dilaporkan ke window iframe.
  const Fn = win.Function && win.Function !== Function ? win.Function : Function;
  const scopeLuar = {};
  let komponen;

  if (isReact) {
    const modReact = modulReact(React);
    const modul = { exports: {} };
    const require = (nama) => {
      if (nama === 'react') return modReact;
      if (nama === 'react-dom/client' || nama === 'react-dom') return ReactDOMClient;
      throw new Error(`Modul '${nama}' tidak tersedia di latihan ini. Yang bisa di-import hanya 'react'.`);
    };
    try {
      const body = `${olah.hasil}\n;return typeof App !== 'undefined' ? App : undefined;\n//# sourceURL=kode-kamu.js`;
      const fn = new Fn('React', 'require', 'exports', 'module', ...Object.keys(global), body);
      const app = fn(modReact, require, modul.exports, modul, ...Object.values(global));
      komponen = modul.exports.default ?? app;
    } catch (e) {
      lapor(e);
    }

    if (!errorPertama) {
      if (typeof komponen !== 'function') {
        lapor(new Error('Komponen App tidak ditemukan. Buat `function App() { ... }` lalu `export default App`.'));
      } else {
        const wadah = doc.getElementById('root') ?? doc.body.appendChild(doc.createElement('div'));
        wadah.id = 'root';
        const root = ReactDOMClient.createRoot(wadah, {
          onUncaughtError: (e) => lapor(e),
          onCaughtError: (e) => lapor(e),
          onRecoverableError: () => {},
        });
        onRoot?.(root);
        try {
          flushSync(() => root.render(React.createElement(komponen)));
        } catch (e) {
          lapor(e);
        }
      }
    }
  } else {
    const nama = olah.nama.filter((n) => !(n in global) && /^[A-Za-z_$][\w$]*$/.test(n));
    const getter = nama.map((n) => `get ${n}(){try{return ${n}}catch(e){return undefined}}`).join(',');
    try {
      const body = `__daftarScope({${getter}});\n${olah.hasil}\n//# sourceURL=kode-kamu.js`;
      const fn = new Fn(...Object.keys(global), '__daftarScope', body);
      fn(...Object.values(global), (s) => Object.assign(scopeLuar, { s }));
    } catch (e) {
      lapor(e);
    }
  }

  await tidur(30); // beri waktu useEffect & microtask

  if (!denganTes) return { logs, error: errorPertama, hasil: [], lepas };

  const cari = (sel) => {
    const el = doc.querySelector(sel);
    if (!el) gagal(`Elemen \`${sel}\` tidak ditemukan di halaman.`);
    return el;
  };
  const elemen = (t) => (typeof t === 'string' ? cari(t) : t);
  const ctx = buatCtxDasar({ kode, kodeBersih: olah.bersih, logs, error: errorPertama });
  Object.assign(ctx, {
    document: doc,
    window: win,
    tunggu: tidur,
    cari,
    cariSemua: (sel) => [...doc.querySelectorAll(sel)],
    ada: (sel) => doc.querySelector(sel) !== null,
    teks: (t) => (elemen(t).textContent ?? '').replace(/\s+/g, ' ').trim(),
    /** Cari tombol berdasarkan tulisannya (tidak peka huruf besar-kecil). */
    tombol(tulisan) {
      const b = [...doc.querySelectorAll('button')].find((x) => x.textContent.toLowerCase().includes(tulisan.toLowerCase()));
      if (!b) gagal(`Tombol bertuliskan "${tulisan}" tidak ditemukan.`);
      return b;
    },
    async klik(t) {
      elemen(t).click();
      await tidur(20);
    },
    async ketik(t, nilai) {
      const el = elemen(t);
      const proto = Object.getPrototypeOf(el);
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(el, nilai);
      else el.value = nilai;
      const W = el.ownerDocument.defaultView;
      el.dispatchEvent(new W.Event('input', { bubbles: true }));
      el.dispatchEvent(new W.Event('change', { bubbles: true }));
      await tidur(20);
    },
    async kirim(t) {
      const form = elemen(t);
      const W = form.ownerDocument.defaultView;
      form.dispatchEvent(new W.Event('submit', { bubbles: true, cancelable: true }));
      await tidur(20);
    },
    ambil: (n) => scopeLuar.s?.[n],
  });

  sedangTes = true;
  const hasil = await jalankanTes(pelajaran.tes, ctx);
  sedangTes = false;
  return { logs, error: errorPertama, hasil, lepas };

  function lepas() {
    win.removeEventListener('error', onError);
    win.removeEventListener('unhandledrejection', onReject);
  }
}
