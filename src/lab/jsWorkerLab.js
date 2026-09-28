// Worker classic sederhana untuk menjalankan JavaScript bebas di /lab (tanpa sistem tes, beda dari engine/jsWorker.js).
function kirim(tipe, data) {
  postMessage({ tipe, ...data });
}

let resolverInput = null;
onmessage = async (ev) => {
  if (ev.data.tipe === 'input-tersedia') {
    resolverInput?.(ev.data.teks);
    resolverInput = null;
    return;
  }
  if (ev.data.tipe !== 'jalankan') return;

  // prompt() asinkron: minta baris ke thread utama (yang membaca dari terminal), tunggu balasannya.
  const prompt = (pertanyaan) => {
    if (pertanyaan !== undefined) kirim('stdout', { teks: String(pertanyaan) });
    kirim('perlu-input', {});
    return new Promise((resolve) => (resolverInput = resolve));
  };
  const konsol = {
    log: (...a) => kirim('stdout', { teks: a.map(String).join(' ') + '\n' }),
    info: (...a) => kirim('stdout', { teks: a.map(String).join(' ') + '\n' }),
    warn: (...a) => kirim('stdout', { teks: a.map(String).join(' ') + '\n' }),
    error: (...a) => kirim('stderr', { teks: a.map(String).join(' ') + '\n' }),
  };

  try {
    const fn = new Function('console', 'prompt', `return (async () => {\n${ev.data.kode}\n})();`);
    await fn(konsol, prompt);
    kirim('selesai', { kode: 0 });
  } catch (e) {
    kirim('stderr', { teks: `${e?.name ?? 'Error'}: ${e?.message ?? e}\n` });
    kirim('selesai', { kode: 1 });
  }
};
