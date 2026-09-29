// Logika inti ujian: validasi bank soal, pemilihan soal acak, penilaian, dan perhitungan skor.
// Semuanya fungsi murni (tanpa React/DOM), dipakai oleh halaman ujian dan oleh scripts/check-ujian.js.

/** Bobot poin per tipe soal: soal yang lebih sulit (mengetik kode) bernilai lebih besar. */
export const BOBOT = { 'pilihan-ganda': 1, 'prediksi-output': 2, kode: 3 };
export const TIPE_SOAL = Object.keys(BOBOT);
export const LABEL_TIPE = { 'pilihan-ganda': 'Pilihan ganda', 'prediksi-output': 'Prediksi output', kode: 'Menulis kode' };

/** Chapter dianggap "perlu diulang" jika skornya di bawah persen ini. */
export const AMBANG_CHAPTER_LEMAH = 60;

const JENIS_KODE = ['js', 'dom', 'react'];

function wajib(kondisi, pesan) {
  if (!kondisi) throw new Error(pesan);
}

function validasiSoal(s, ujian, path) {
  const di = `${path} → soal "${s?.id}"`;
  wajib(s && typeof s.id === 'string' && s.id, `${path}: ada soal tanpa id`);
  wajib(TIPE_SOAL.includes(s.tipe), `${di}: tipe harus salah satu dari ${TIPE_SOAL.join(', ')}`);
  wajib(ujian.chapterIds.includes(s.chapterId), `${di}: chapterId ${s.chapterId} tidak termasuk chapterIds ujian (${ujian.chapterIds.join(', ')})`);
  wajib(typeof s.penjelasan === 'string' && s.penjelasan.trim(), `${di}: penjelasan wajib diisi (ditampilkan setelah ujian)`);

  if (s.tipe === 'pilihan-ganda') {
    wajib(typeof s.pertanyaan === 'string' && s.pertanyaan.trim(), `${di}: pertanyaan kosong`);
    wajib(Array.isArray(s.pilihan) && s.pilihan.length >= 3 && s.pilihan.every((p) => typeof p === 'string' && p), `${di}: pilihan harus array berisi minimal 3 string`);
    wajib(new Set(s.pilihan).size === s.pilihan.length, `${di}: ada pilihan jawaban yang kembar`);
    wajib(Number.isInteger(s.benar) && s.benar >= 0 && s.benar < s.pilihan.length, `${di}: "benar" harus indeks pilihan yang valid`);
  } else if (s.tipe === 'prediksi-output') {
    wajib(typeof s.kode === 'string' && s.kode.trim(), `${di}: kode kosong`);
    wajib(typeof s.kunci === 'string' && s.kunci.trim(), `${di}: kunci (output yang benar) kosong`);
  } else {
    wajib(JENIS_KODE.includes(s.jenis), `${di}: jenis harus salah satu dari ${JENIS_KODE.join(', ')}`);
    wajib(typeof s.tugas === 'string' && s.tugas.trim(), `${di}: tugas kosong`);
    wajib(typeof s.kodeAwal === 'string' && typeof s.solusi === 'string', `${di}: kodeAwal dan solusi wajib`);
    wajib(Array.isArray(s.tes) && s.tes.length > 0 && s.tes.every((t) => typeof t.nama === 'string' && typeof t.cek === 'function'), `${di}: tes harus array { nama, cek }`);
  }
}

/**
 * @param {Record<string, object>} modulPerPath  { './ujian-1-dasar.js': { default: {...} } }
 * @param {{ chapterAda?: (id:number)=>boolean, pelajaran?: (id:string)=>{chapterId:number}|undefined }} [acuan]
 *        Jika diberikan, chapterIds dan `pelajaran` pada soal ikut diperiksa terhadap data pelajaran yang ada.
 */
export function susunUjian(modulPerPath, acuan = {}) {
  const daftar = [];
  const idUjian = new Set();
  const idSoal = new Set();

  for (const path of Object.keys(modulPerPath).sort()) {
    const u = modulPerPath[path].default ?? modulPerPath[path];
    wajib(typeof u.id === 'string' && u.id, `${path}: id ujian wajib`);
    wajib(!idUjian.has(u.id), `${path}: id ujian "${u.id}" dipakai lebih dari sekali`);
    wajib(typeof u.judul === 'string' && u.judul, `${path}: judul wajib`);
    wajib(Array.isArray(u.chapterIds) && u.chapterIds.length > 0, `${path}: chapterIds wajib (array chapter yang diujikan)`);
    wajib(Number.isFinite(u.lulus) && u.lulus > 0 && u.lulus <= 100, `${path}: lulus harus persen 1–100`);
    wajib(Number.isFinite(u.xp) && u.xp >= 0, `${path}: xp wajib`);
    wajib(u.komposisi && typeof u.komposisi === 'object', `${path}: komposisi wajib, mis. { 'pilihan-ganda': 8, kode: 2 }`);
    wajib(Array.isArray(u.soal) && u.soal.length > 0, `${path}: soal kosong`);
    idUjian.add(u.id);

    for (const id of u.chapterIds) wajib(acuan.chapterAda?.(id) ?? true, `${path}: chapter ${id} tidak ada`);

    for (const s of u.soal) {
      validasiSoal(s, u, path);
      wajib(!idSoal.has(s.id), `${path}: id soal "${s.id}" dipakai lebih dari sekali (id harus unik di SEMUA ujian)`);
      idSoal.add(s.id);
      if (s.pelajaran && acuan.pelajaran) {
        const p = acuan.pelajaran(s.pelajaran);
        wajib(p, `${path} → soal "${s.id}": pelajaran "${s.pelajaran}" tidak ada`);
        wajib(p.chapterId === s.chapterId, `${path} → soal "${s.id}": pelajaran "${s.pelajaran}" bukan bagian dari chapter ${s.chapterId}`);
      }
    }

    for (const [tipe, n] of Object.entries(u.komposisi)) {
      wajib(TIPE_SOAL.includes(tipe), `${path}: komposisi memuat tipe tak dikenal "${tipe}"`);
      const tersedia = u.soal.filter((s) => s.tipe === tipe).length;
      wajib(tersedia >= n, `${path}: komposisi meminta ${n} soal "${tipe}", tetapi bank hanya punya ${tersedia}`);
    }

    daftar.push({ ...u, file: path.replace(/^\.\//, ''), setelahChapter: u.setelahChapter ?? Math.max(...u.chapterIds) });
  }
  return daftar;
}

/** Bungkus soal bertipe 'kode' menjadi objek "pelajaran" supaya bisa dijalankan oleh engine yang sama dengan pelajaran biasa. */
export function jadikanPelajaran(soal) {
  return {
    id: soal.id,
    judul: `Soal ${soal.id}`,
    tipe: soal.jenis,
    xp: 0,
    tugas: soal.tugas,
    kodeAwal: soal.kodeAwal,
    solusi: soal.solusi,
    tes: soal.tes,
    html: soal.html,
    css: soal.css,
    globals: soal.globals,
    batasWaktu: soal.batasWaktu,
  };
}

// ---------- Pemilihan soal ----------

/** Fisher–Yates; mengembalikan salinan. `acak` = fungsi yang mengembalikan angka 0..1 (bisa diganti saat testing). */
export function acakUrutan(arr, acak = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pilih soal untuk satu percobaan sesuai `ujian.komposisi`.
 * - Soal tersebar merata antar-chapter (round-robin).
 * - Soal yang muncul di percobaan sebelumnya (`terakhir`) dipakai paling akhir, jadi ulangan terasa segar.
 * - Urutan hasil: pilihan ganda → prediksi output → kode, masing-masing diacak.
 */
export function pilihSoal(ujian, { terakhir = [], acak = Math.random } = {}) {
  const dulu = new Set(terakhir);
  const hasil = [];
  for (const tipe of TIPE_SOAL) {
    const butuh = ujian.komposisi[tipe] ?? 0;
    if (butuh <= 0) continue;
    const kandidat = ujian.soal.filter((s) => s.tipe === tipe);
    const urut = [...acakUrutan(kandidat.filter((s) => !dulu.has(s.id)), acak), ...acakUrutan(kandidat.filter((s) => dulu.has(s.id)), acak)];

    const antrean = new Map();
    for (const s of urut) {
      if (!antrean.has(s.chapterId)) antrean.set(s.chapterId, []);
      antrean.get(s.chapterId).push(s);
    }
    const chapterAcak = acakUrutan([...antrean.keys()], acak);
    const terpilih = [];
    while (terpilih.length < butuh && [...antrean.values()].some((q) => q.length > 0)) {
      // Dalam satu putaran, chapter yang soal terdepannya belum pernah keluar didahulukan (urutan acak tetap di antara yang setara).
      const putaran = [...chapterAcak].sort((x, y) => Number(dulu.has(antrean.get(x)[0]?.id)) - Number(dulu.has(antrean.get(y)[0]?.id)));
      for (const cid of putaran) {
        const q = antrean.get(cid);
        if (q.length > 0 && terpilih.length < butuh) terpilih.push(q.shift());
      }
    }
    hasil.push(...acakUrutan(terpilih, acak));
  }
  return hasil;
}

/** Urutan acak untuk pilihan jawaban: `urutan[i]` = indeks pilihan asli yang ditampilkan di posisi ke-i. */
export function urutanPilihan(soal, acak = Math.random) {
  return acakUrutan(soal.pilihan.map((_, i) => i), acak);
}

// ---------- Penilaian ----------

const barisBersih = (teks) =>
  String(teks ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter((l) => l !== '');
const punyaStruktur = (l) => /[[\]{}]/.test(l);
const longgar = (l) => l.replace(/\s+/g, '').replace(/"/g, "'");

/**
 * Bandingkan jawaban "prediksi output" dengan kunci. Baris kosong & spasi berlebih diabaikan.
 * Khusus baris yang memuat array/object ([ ] { }), spasi dan jenis kutip ' vs " tidak dipersoalkan.
 */
export function samaOutput(jawaban, kunci) {
  const a = barisBersih(jawaban);
  const b = barisBersih(kunci);
  if (a.length !== b.length) return false;
  return a.every((baris, i) => baris === b[i] || (punyaStruktur(baris) && punyaStruktur(b[i]) && longgar(baris) === longgar(b[i])));
}

/** Nilai soal yang bisa dinilai langsung (tanpa menjalankan kode). Soal 'kode' dinilai terpisah oleh halaman ujian. */
export function nilaiStatis(soal, jawaban, urutan) {
  if (soal.tipe === 'pilihan-ganda') {
    if (typeof jawaban !== 'number') return false;
    const asli = urutan ? urutan[jawaban] : jawaban;
    return asli === soal.benar;
  }
  if (soal.tipe === 'prediksi-output') return samaOutput(jawaban, soal.kunci);
  return false;
}

/** Jawaban benar dalam bentuk teks (untuk tinjauan setelah ujian). */
export function teksJawabanBenar(soal) {
  if (soal.tipe === 'pilihan-ganda') return soal.pilihan[soal.benar];
  if (soal.tipe === 'prediksi-output') return soal.kunci;
  return soal.solusi;
}

/**
 * @param {object[]} daftarSoal  soal yang dikerjakan
 * @param {Record<string, boolean>} benarPerId
 * @returns {{ poin:number, maks:number, persen:number, lulus:boolean, perChapter: Record<number,{poin:number,maks:number}> }}
 */
export function hitungHasil(ujian, daftarSoal, benarPerId) {
  let poin = 0;
  let maks = 0;
  const perChapter = {};
  for (const s of daftarSoal) {
    const bobot = BOBOT[s.tipe];
    const c = (perChapter[s.chapterId] ??= { poin: 0, maks: 0 });
    c.maks += bobot;
    maks += bobot;
    if (benarPerId[s.id]) {
      c.poin += bobot;
      poin += bobot;
    }
  }
  const persen = maks > 0 ? Math.round((poin / maks) * 100) : 0;
  return { poin, maks, persen, lulus: persen >= ujian.lulus, perChapter };
}

/** Ringkasan komposisi ujian, mis. { soal: 13, poin: 20, perTipe: { 'pilihan-ganda': 8, ... } }. */
export function ringkasKomposisi(ujian) {
  const perTipe = {};
  let soal = 0;
  let poin = 0;
  for (const tipe of TIPE_SOAL) {
    const n = Math.min(ujian.komposisi[tipe] ?? 0, ujian.soal.filter((s) => s.tipe === tipe).length);
    if (n > 0) perTipe[tipe] = n;
    soal += n;
    poin += n * BOBOT[tipe];
  }
  return { soal, poin, perTipe };
}
