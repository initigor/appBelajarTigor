// Menjalankan kode JavaScript murni (tanpa DOM) lalu menjalankan tes pelajaran.
// Di browser file ini dipanggil dari Web Worker; di Node dipanggil oleh scripts/check-lessons.js.
import { olahKode } from './babel.js';
import { formatValue } from './format.js';
import { buatCtxDasar, formatError, formatSyntaxError, gagal, jalankanTes, semuaGagal, tampil } from './tes.js';

const AsyncFunction = (async () => {}).constructor;

// Selisih nomor baris antara stack trace `new Function` dan baris asli kode user.
export const OFFSET_DASAR = (() => {
  try {
    new Function('\nthrow new Error("x")\n//# sourceURL=kode-kamu.js')();
  } catch (e) {
    const m = String(e.stack).match(/kode-kamu\.js:(\d+)/);
    if (m) return Number(m[1]) - 2;
  }
  return 2;
})();
// +1 karena ada baris pendaftaran scope di atas kode user
const OFFSET = OFFSET_DASAR + 1;

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

export function buatKonsol(dorong) {
  const log = (level) => (...args) => dorong(level, args.map((a) => formatValue(a)).join(' '));
  return {
    log: log('log'),
    info: log('info'),
    debug: log('log'),
    warn: log('warn'),
    error: log('error'),
    table: (data) => dorong('log', formatValue(data)),
    clear: () => {},
    group: log('log'),
    groupEnd: () => {},
  };
}

/**
 * Menjalankan kode sekali di "sandbox" baru.
 * @returns {Promise<{logs, error, scope, alat}>}
 */
async function eksekusi({ kode, olah, pelajaran, onLog, tungguMaks = 2000 }) {
  const logs = [];
  const alat = { rekam: null }; // jika diisi array, log dialihkan ke sana (dipakai saat tes)
  const dorong = (level, text) => {
    const entri = { level, text };
    if (alat.rekam) {
      alat.rekam.push(entri);
      return;
    }
    logs.push(entri);
    onLog?.(entri);
  };
  let errorPertama = null;
  const lapor = (err) => {
    const teks = formatError(err, OFFSET);
    if (!errorPertama) errorPertama = teks;
    dorong('error', teks);
  };

  // Timer yang dilacak, supaya kita bisa menunggu setTimeout/Promise selesai sebelum mengetes.
  const aktif = new Set();
  const semuaInterval = new Set();
  const _setTimeout = (fn, ms = 0, ...args) => {
    const id = setTimeout(() => {
      aktif.delete(id);
      try {
        if (typeof fn === 'function') fn(...args);
      } catch (e) {
        lapor(e);
      }
    }, ms);
    aktif.add(id);
    return id;
  };
  const _clearTimeout = (id) => {
    clearTimeout(id);
    aktif.delete(id);
  };
  const _setInterval = (fn, ms = 0, ...args) => {
    const id = setInterval(() => {
      try {
        fn(...args);
      } catch (e) {
        lapor(e);
      }
    }, Math.max(ms, 10));
    aktif.add(id);
    semuaInterval.add(id);
    return id;
  };
  const _clearInterval = (id) => {
    clearInterval(id);
    aktif.delete(id);
    semuaInterval.delete(id);
  };
  const tunda = (ms, nilai) => new Promise((r) => _setTimeout(() => r(nilai), ms));

  const global = {
    console: buatKonsol(dorong),
    setTimeout: _setTimeout,
    clearTimeout: _clearTimeout,
    setInterval: _setInterval,
    clearInterval: _clearInterval,
    alert: (x) => dorong('log', `[alert] ${formatValue(x)}`),
    prompt: () => null,
    ...(pelajaran.globals ? pelajaran.globals({ tunda }) : {}),
  };

  // Daftarkan "getter" untuk setiap nama top-level supaya tes bisa membaca nilainya,
  // bahkan jika kode user error di tengah jalan.
  const namaValid = olah.nama.filter((n) => !(n in global) && /^[A-Za-z_$][\w$]*$/.test(n));
  const getter = namaValid.map((n) => `get ${n}(){try{return ${n}}catch(e){return undefined}}`).join(',');
  const body = `__daftarScope({${getter}});\n${kode}\n//# sourceURL=kode-kamu.js`;

  let scope = {};
  try {
    const fn = new AsyncFunction(...Object.keys(global), '__daftarScope', body);
    await fn(...Object.values(global), (s) => (scope = s));
  } catch (e) {
    lapor(e);
  }

  // Tunggu timer & promise yang masih berjalan (maksimal `tungguMaks` ms).
  const batas = Date.now() + tungguMaks;
  await tidur(0);
  while (aktif.size > 0 && Date.now() < batas) await tidur(10);
  await tidur(0);

  alat.tunda = tunda;
  alat.bersihkan = () => {
    for (const id of aktif) {
      clearTimeout(id);
      clearInterval(id);
    }
  };
  return { logs, error: errorPertama, scope, alat };
}

/** Ganti nilai awal deklarasi `const/let nama = ...` di kode. */
function gantiNilai(kode, pengganti) {
  let hasil = kode;
  for (const [nama, nilai] of Object.entries(pengganti)) {
    const re = new RegExp(`((?:const|let|var)\\s+${nama}\\s*=\\s*)([^;\\n]+)`);
    if (!re.test(hasil)) gagal(`Deklarasi \`${nama}\` tidak ditemukan. Jangan hapus baris \`const ${nama} = ...\`.`);
    hasil = hasil.replace(re, (_, awal) => awal + JSON.stringify(nilai));
  }
  return hasil;
}

function buatAksesScope(scope) {
  return {
    scope,
    ambil: (n) => scope[n],
    ada: (n) => scope[n] !== undefined,
    variabel(n) {
      const v = scope[n];
      if (v === undefined) gagal(`Variabel \`${n}\` belum dibuat (atau nilainya masih undefined).`);
      return v;
    },
    fungsi(n) {
      const f = scope[n];
      if (f === undefined) gagal(`Fungsi \`${n}\` belum dibuat. Pastikan namanya persis \`${n}\`.`);
      if (typeof f !== 'function') gagal(`\`${n}\` harus berupa fungsi, tapi isinya ${tampil(f)}.`);
      return f;
    },
  };
}

/**
 * @returns {Promise<{logs: {level:string,text:string}[], error: string|null, hasil: {nama,lulus,pesan?}[]}>}
 */
export async function jalankanJs({ kode, pelajaran, onLog, tungguMaks = 2000 }) {
  let olah;
  try {
    olah = olahKode(kode);
  } catch (e) {
    const teks = formatSyntaxError(e);
    onLog?.({ level: 'error', text: teks });
    return {
      logs: [{ level: 'error', text: teks }],
      error: teks,
      hasil: semuaGagal(pelajaran.tes, 'Perbaiki SyntaxError dulu, lalu jalankan lagi.'),
    };
  }

  const run = await eksekusi({ kode, olah, pelajaran, onLog, tungguMaks });
  const { scope, alat } = run;
  const sampah = [alat];

  const ctx = buatCtxDasar({ kode, kodeBersih: olah.bersih, logs: run.logs, error: run.error });
  Object.assign(ctx, buatAksesScope(scope), {
    tunda: alat.tunda,
    /** Panggil fungsi user. Error dari fungsi user diubah jadi pesan tes yang ramah. */
    panggil(n, ...args) {
      const f = ctx.fungsi(n);
      try {
        return f(...args);
      } catch (e) {
        gagal(`${n}(${args.map(tampil).join(', ')}) melempar error: ${formatError(e, OFFSET)}`);
      }
    },
    /** Jalankan fn, kembalikan semua teks yang dicetak console selama fn berjalan. */
    async tangkapLog(fn) {
      const sebelum = alat.rekam;
      alat.rekam = [];
      try {
        await fn();
        return alat.rekam.filter((l) => l.level !== 'error').map((l) => l.text);
      } finally {
        alat.rekam = sebelum;
      }
    },
    /**
     * Jalankan ulang kode user dengan nilai awal variabel diganti.
     * Contoh: await ctx.jalankanDengan({ nilai: 50 }) -> { logs, error, ambil, variabel, ... }
     */
    async jalankanDengan(pengganti) {
      const kodeBaru = gantiNilai(kode, pengganti);
      const r = await eksekusi({ kode: kodeBaru, olah, pelajaran, tungguMaks });
      sampah.push(r.alat);
      const teks = r.logs.filter((l) => l.level !== 'error').map((l) => l.text);
      return { logs: teks, error: r.error, ...buatAksesScope(r.scope) };
    },
  });

  alat.rekam = [];
  const hasil = await jalankanTes(pelajaran.tes, ctx);
  alat.rekam = null;

  for (const a of sampah) a.bersihkan();
  return { logs: run.logs, error: run.error, hasil };
}
