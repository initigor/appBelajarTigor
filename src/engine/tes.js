// Sistem tes bersama untuk semua tipe pelajaran (js, dom, react).
// Setiap tes: { nama: string, cek: async (ctx) => true | string }
//   - return true            -> lulus
//   - return 'pesan'         -> gagal dengan pesan itu
//   - throw gagal('pesan')   -> gagal dengan pesan itu (berguna di helper)
//   - return false / lainnya -> gagal dengan pesan umum

import { tampil } from './format.js';

export class TesGagal extends Error {
  constructor(pesan) {
    super(pesan);
    this.name = 'TesGagal';
    this.tesGagal = true;
  }
}

export function gagal(pesan) {
  throw new TesGagal(pesan);
}

export { tampil };

/** Perbandingan dalam (deep equal) sederhana untuk array/object/primitif. */
export function samaDalam(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && samaDalam(a[k], b[k]));
}

/** Terjemahkan error JS umum menjadi penjelasan berbahasa Indonesia. */
export function penjelasanError(err) {
  const msg = String(err?.message ?? err);
  let m;
  if ((m = msg.match(/^(\S+) is not defined/))) {
    return `\`${m[1]}\` belum dibuat atau salah ketik. Ingat: JavaScript membedakan huruf besar dan kecil.`;
  }
  if (/Assignment to constant variable/.test(msg)) {
    return 'Kamu mengubah nilai variabel `const`. Pakai `let` kalau nilainya memang perlu diubah.';
  }
  if ((m = msg.match(/Cannot access '(\S+)' before initialization/))) {
    return `\`${m[1]}\` dipakai sebelum baris deklarasinya dijalankan. Pindahkan deklarasinya ke atas.`;
  }
  if ((m = msg.match(/(\S+) is not a function/))) {
    return `\`${m[1]}\` bukan fungsi, jadi tidak bisa dipanggil dengan (). Cek lagi nama dan isinya.`;
  }
  if (/Cannot read propert(y|ies) of (undefined|null)/.test(msg)) {
    return 'Kamu mengambil properti dari nilai `undefined`/`null`. Cek apakah variabel atau elemennya benar-benar ada.';
  }
  if (/Cannot set propert(y|ies) of (undefined|null)/.test(msg)) {
    return 'Kamu mengisi properti pada nilai `undefined`/`null`. Mungkin `querySelector` tidak menemukan elemennya?';
  }
  if (/has already been declared/.test(msg)) {
    return 'Nama variabel yang sama dideklarasikan dua kali. Di JS, `let`/`const` tidak boleh dideklarasikan ulang di scope yang sama.';
  }
  if (/Maximum call stack size exceeded/.test(msg)) {
    return 'Fungsi memanggil dirinya sendiri terus-menerus (rekursi tanpa berhenti).';
  }
  if (/Too many re-renders/.test(msg)) {
    return 'Komponen mengubah state saat render sehingga render berulang terus. Jangan panggil setState langsung di badan komponen; taruh di event handler, misalnya onClick={() => setX(...)}.';
  }
  if (/Objects are not valid as a React child/.test(msg)) {
    return 'Kamu mencoba menampilkan object langsung di JSX. Tampilkan propertinya, misalnya {user.nama}.';
  }
  return null;
}

const OFFSET_KEY = '__offsetBaris';

/** Ambil nomor baris kode user dari stack trace (best effort). */
export function barisDariStack(err, offset) {
  const stack = String(err?.stack ?? '');
  const m = stack.match(/kode-kamu\.js:(\d+):(\d+)/);
  if (!m) return null;
  const baris = Number(m[1]) - offset;
  return baris > 0 ? baris : null;
}

export function formatError(err, offset = 0) {
  if (err && err[OFFSET_KEY] !== undefined) offset = err[OFFSET_KEY];
  const nama = err?.name ?? 'Error';
  const pesan = err?.message ?? String(err);
  const baris = err && typeof err === 'object' ? barisDariStack(err, offset) : null;
  let teks = `${nama}: ${pesan}${baris ? ` (baris ${baris})` : ''}`;
  const jelas = penjelasanError(err);
  if (jelas) teks += `\n💡 ${jelas}`;
  return teks;
}

/** Format error dari parser Babel (syntax error). */
export function formatSyntaxError(err) {
  const loc = err?.loc;
  let pesan = String(err?.message ?? err).replace(/^\/?kode-kamu\.js:\s*/, '');
  const [pertama, ...sisa] = pesan.split('\n');
  const judul = pertama.replace(/\s*\(\d+:\d+\)\s*$/, '');
  const frame = sisa.join('\n').replace(/^\s*\n/, '').trimEnd();
  let teks = `SyntaxError${loc ? ` (baris ${loc.line})` : ''}: ${judul}`;
  if (frame) teks += `\n${frame}`;
  teks += '\n💡 Periksa kurung (), kurawal {}, kutip, dan koma di sekitar baris tersebut.';
  return teks;
}

/** Konteks dasar yang tersedia di semua tipe tes. */
export function buatCtxDasar({ kode, kodeBersih, logs, error }) {
  const teksLogs = logs.filter((l) => l.level !== 'error').map((l) => l.text);
  const ctx = {
    kode,
    kodeBersih,
    /** Semua baris yang dicetak console.log (tanpa error). */
    logs: teksLogs,
    /** Pesan error runtime pertama (atau null). */
    error,
    /** Cek apakah kode (tanpa komentar) memakai pola tertentu. */
    pakai(pola) {
      return typeof pola === 'string' ? kodeBersih.includes(pola) : pola.test(kodeBersih);
    },
    adaLog(teks) {
      return teksLogs.includes(teks);
    },
    /** Gagal dengan pesan ramah jika `teks` tidak pernah dicetak. */
    harusLog(teks) {
      if (teksLogs.includes(teks)) return true;
      const norm = (s) => s.toLowerCase().replace(/[\s.,!?'"]/g, '');
      const mirip = teksLogs.find((l) => norm(l) === norm(teks));
      if (mirip !== undefined) {
        gagal(`Hampir! Console mencetak "${mirip}", seharusnya "${teks}". Perhatikan huruf besar/kecil, spasi, dan tanda baca.`);
      }
      if (teksLogs.length === 0) gagal(`Console belum mencetak "${teks}". Console masih kosong. Sudah pakai console.log?`);
      const contoh = teksLogs.slice(0, 6).map((l) => `"${l}"`).join(', ');
      gagal(`Console belum mencetak "${teks}". Yang tercetak: ${contoh}${teksLogs.length > 6 ? ', ...' : ''}.`);
    },
  };
  return ctx;
}

export async function jalankanTes(daftarTes, ctx) {
  const hasil = [];
  for (const t of daftarTes) {
    try {
      const r = await t.cek(ctx);
      if (r === true) hasil.push({ nama: t.nama, lulus: true });
      else hasil.push({ nama: t.nama, lulus: false, pesan: typeof r === 'string' ? r : 'Belum sesuai dengan yang diminta.' });
    } catch (e) {
      if (e && e.tesGagal) {
        hasil.push({ nama: t.nama, lulus: false, pesan: e.message });
      } else {
        hasil.push({ nama: t.nama, lulus: false, pesan: `Kodemu melempar error saat dites: ${formatError(e)}` });
      }
    }
  }
  return hasil;
}

export function semuaGagal(daftarTes, pesan) {
  return daftarTes.map((t) => ({ nama: t.nama, lulus: false, pesan }));
}
