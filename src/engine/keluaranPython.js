// Model keluaran sel kode Python (dipakai Notebook dan blok kode interaktif). Fungsi murni.
//
// Satu keluaran: { jenis: 'stream', nama: 'stdout' | 'stderr', teks }
//              | { jenis: 'hasil', teks }      nilai ekspresi terakhir (seperti Out[n] di Jupyter)
//              | { jenis: 'gambar', data }     PNG base64 (mis. dari matplotlib)
//              | { jenis: 'galat', teks }      traceback

/** Tambah keluaran ke daftar; potongan stream bernama sama yang berurutan digabung. */
export function tambahKeluaran(daftar, item) {
  if (item.jenis === 'stream') {
    const akhir = daftar[daftar.length - 1];
    if (akhir && akhir.jenis === 'stream' && akhir.nama === item.nama) {
      return [...daftar.slice(0, -1), { ...akhir, teks: akhir.teks + item.teks }];
    }
  }
  return [...daftar, item];
}

/** Susun keluaran akhir dari hasil `selesai` kernel. */
export function keluaranDariSelesai(daftar, { hasil, gambar, galat }) {
  let d = daftar;
  if (hasil !== null && hasil !== undefined) d = tambahKeluaran(d, { jenis: 'hasil', teks: hasil });
  for (const g of gambar ?? []) d = tambahKeluaran(d, { jenis: 'gambar', data: g });
  if (galat) d = tambahKeluaran(d, { jenis: 'galat', teks: galat });
  return d;
}
