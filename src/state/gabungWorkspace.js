// Menggabungkan project Workspace dari dua sumber (perangkat ini & cloud). Fungsi murni, tanpa React/DOM.
//
// Bentuk data: { projects: { [id]: { id, nama, bahasa, entryPoint, files, dibuat, diubah } }, dihapus: { [id]: waktuHapus } }
// Aturan:
// - per project: versi dengan `diubah` paling baru yang dipakai (terakhir menang). Jika dua perangkat mengedit
//   project yang SAMA di waktu berdekatan, hanya satu versi yang bertahan, jadi hindari mengedit project yang
//   sama di dua perangkat sekaligus.
// - project yang hanya ada di satu sisi tetap dipakai (project baru dari perangkat mana pun ikut muncul)
// - dihapus: "batu nisan" berisi waktu hapus. Project hilang bila dihapus SETELAH perubahan terakhirnya;
//   kalau diedit lagi sesudah itu, project hidup kembali.

export const MAKS_DIHAPUS = 200;

export function rapikanWorkspace(w) {
  const projects = {};
  if (w?.projects && typeof w.projects === 'object') {
    for (const [id, p] of Object.entries(w.projects)) {
      if (p && typeof p === 'object' && typeof p.id === 'string' && p.files && typeof p.files === 'object') projects[id] = p;
    }
  }
  const dihapus = {};
  if (w?.dihapus && typeof w.dihapus === 'object') {
    for (const [id, t] of Object.entries(w.dihapus)) if (Number.isFinite(t)) dihapus[id] = t;
  }
  return { projects, dihapus };
}

const tanda = (p) => JSON.stringify([p.nama, p.bahasa, p.entryPoint, p.files]);

export function gabungWorkspace(a, b) {
  const x = rapikanWorkspace(a);
  const y = rapikanWorkspace(b);

  const dihapus = { ...x.dihapus };
  for (const [id, t] of Object.entries(y.dihapus)) dihapus[id] = Math.max(dihapus[id] ?? 0, t);

  const projects = {};
  for (const id of new Set([...Object.keys(x.projects), ...Object.keys(y.projects)])) {
    const p = x.projects[id];
    const q = y.projects[id];
    let menang = p ?? q;
    if (p && q) {
      const dp = p.diubah ?? 0;
      const dq = q.diubah ?? 0;
      // waktu sama: pilih berdasarkan isi supaya semua perangkat konvergen ke versi yang sama
      menang = dp > dq || (dp === dq && tanda(p) >= tanda(q)) ? p : q;
    }
    if ((dihapus[id] ?? -1) >= (menang.diubah ?? 0)) continue; // dihapus setelah perubahan terakhir
    projects[id] = menang;
  }

  const nisan = Object.entries(dihapus)
    .sort((m, n) => n[1] - m[1])
    .slice(0, MAKS_DIHAPUS);
  return { projects, dihapus: Object.fromEntries(nisan) };
}

/** Ukuran perkiraan (karakter JSON) untuk memastikan data muat di batas cloud. */
export const ukuranWorkspace = (w) => JSON.stringify(w).length;
