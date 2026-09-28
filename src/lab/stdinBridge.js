// Jembatan input interaktif: baca satu baris dari terminal (xterm), dengan echo manual + backspace.
// Dipakai untuk prompt JS dan input() Python (lewat SharedArrayBuffer, lihat bikinSab()).

/** @param {import('@xterm/xterm').Terminal} term */
export function bikinPembacaBaris(term) {
  let buffer = '';
  let resolver = null;
  const sub = term.onData((data) => {
    if (!resolver) return;
    for (const ch of data) {
      if (ch === '\r' || ch === '\n') {
        term.write('\r\n');
        const hasil = buffer;
        buffer = '';
        const r = resolver;
        resolver = null;
        r(hasil);
        return;
      }
      if (ch === '\u007f' || ch === '\b') {
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          term.write('\b \b');
        }
        continue;
      }
      if (ch >= ' ' || ch === '\t') {
        buffer += ch;
        term.write(ch);
      }
    }
  });
  return {
    bacaBaris: () => new Promise((resolve) => (resolver = resolve)),
    dispose: () => sub.dispose(),
  };
}

const UKURAN_SAB = 8 + 8192; // 2x Int32 (sinyal, panjang) + 8 KB data

/** SharedArrayBuffer utk jembatan stdin sinkron worker Pyodide. null bila cross-origin isolation tidak aktif. */
export function bikinSab() {
  if (typeof SharedArrayBuffer === 'undefined') return null;
  return new SharedArrayBuffer(UKURAN_SAB);
}

/** Tulis satu baris (dari pembaca terminal) ke SAB lalu bangunkan worker yang sedang Atomics.wait. */
export function tulisBarisKeSab(sab, baris) {
  const int32 = new Int32Array(sab);
  const bytes = new TextEncoder().encode(baris + '\n');
  const area = new Uint8Array(sab, 8, sab.byteLength - 8);
  area.set(bytes.subarray(0, area.length));
  Atomics.store(int32, 1, Math.min(bytes.length, area.length));
  Atomics.store(int32, 0, 1);
  Atomics.notify(int32, 0);
}
