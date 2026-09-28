// Klien di sisi browser untuk runner Java lokal (lihat server/javaRunner.js + plugin `javaLokal()` di vite.config.js).
// HANYA berfungsi saat situs dibuka lewat `npm run dev` / `npm run preview` di komputer sendiri (ada JDK terpasang);
// endpoint /devjava/* tidak ada di situs produksi (Vercel), sehingga panggilan di bawah akan gagal di sana secara aman.
import { jelaskanGalat } from '../../server/javaGalat.js';

let statusCache = null;
/** Cek (sekali, di-cache di sesi ini) apakah JDK tersedia di server dev lokal. */
export async function cekStatusJdk() {
  if (statusCache) return statusCache;
  try {
    const res = await fetch('/devjava/status');
    if (!res.ok) throw new Error('status ' + res.status);
    statusCache = { ...(await res.json()), jangkauan: true };
  } catch {
    statusCache = { tersedia: false, jangkauan: false };
  }
  return statusCache;
}
export function lupakanStatusJdk() {
  statusCache = null;
}

async function panggilUji(payload) {
  const res = await fetch('/devjava/uji', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/** Pisahkan baris "@@TES@@1@@nama" / "@@TES@@0@@nama@@pesan" dari stdout menjadi hasil tes + log biasa. */
export function uraiProtokolTes(stdout) {
  const baris = (stdout ?? '').split(/\r?\n/);
  const hasilTes = [];
  const logsLain = [];
  for (const b of baris) {
    const m = b.match(/^@@TES@@([01])@@([^@]*)(?:@@(.*))?$/);
    if (m) {
      hasilTes.push({ nama: m[2], lulus: m[1] === '1', pesan: m[3] || undefined });
    } else if (b.trim() !== '') {
      logsLain.push(b);
    }
  }
  return { hasilTes, logsLain };
}

/** Bandingkan output program dengan acuan: per baris, spasi/CR di akhir baris diabaikan. */
export function samaOutput(dapat, harap) {
  const bersih = (s) =>
    (s ?? '')
      .replace(/\r/g, '')
      .split('\n')
      .map((b) => b.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/\n+$/, '');
  return bersih(dapat) === bersih(harap);
}

function pesanGalatEksekusi(stderr) {
  const jelas = jelaskanGalat(stderr);
  const baris = (stderr ?? '').trim().split(/\r?\n/)[0] ?? '';
  return jelas ? `${baris}\n💡 ${jelas.penjelasan}` : baris;
}

function pesanGalatKompilasi(stderr) {
  const jelas = jelaskanGalat(stderr);
  return jelas ? `${(stderr ?? '').trim()}\n\n💡 ${jelas.penjelasan}` : (stderr ?? '').trim();
}

/**
 * Jalankan latihan tipe "kode-output": kompilasi sekali, jalankan tiap tes.stdin, bandingkan stdout.
 * @param {{ berkas: {nama,isi}[], kelasUtama: string, tes: {nama:string, stdin?:string, harap:string}[] }} opsi
 * @returns {{ logs: {level,text}[], error: string|null, hasil: {nama,lulus,pesan?}[] }}
 */
export async function jalankanKodeOutput({ berkas, kelasUtama, tes }) {
  const status = await cekStatusJdk();
  if (!status.tersedia) return hasilJdkTidakAda(status, tes.length);

  const r = await panggilUji({ berkas, kelasUtama, kasus: tes.map((t) => ({ nama: t.nama, stdin: t.stdin ?? '' })) });
  if (r.fase === 'jdk-tidak-ada') return hasilJdkTidakAda(r, tes.length);
  if (r.fase === 'internal') {
    return { logs: [{ level: 'error', text: r.pesan }], error: r.pesan, hasil: tes.map((t) => ({ nama: t.nama, lulus: false, pesan: r.pesan })) };
  }
  if (r.fase === 'kompilasi') {
    const teks = r.waktuHabis
      ? '⏱️ Kompilasi tidak selesai dalam waktu yang wajar.'
      : `❌ Kompilasi gagal:\n${pesanGalatKompilasi(r.stderr)}`;
    return { logs: [{ level: 'error', text: teks }], error: teks, hasil: tes.map((t) => ({ nama: t.nama, lulus: false, pesan: 'Kompilasi gagal, perbaiki dulu galatnya (lihat tab Console).' })) };
  }

  const logs = [];
  const hasil = r.hasil.map((h, i) => {
    const t = tes[i];
    if (h.waktuHabis) {
      logs.push({ level: 'error', text: `⏱️ [${t.nama}] Program berjalan lebih dari batas waktu dan dihentikan (kemungkinan infinite loop, atau Scanner menunggu input yang tidak pernah datang).` });
      return { nama: t.nama, lulus: false, pesan: 'Waktu habis saat dijalankan.' };
    }
    if (!h.berhasilJalan) {
      const teks = pesanGalatEksekusi(h.stderr);
      logs.push({ level: 'error', text: `[${t.nama}] ${teks}` });
      return { nama: t.nama, lulus: false, pesan: `Program berhenti dengan galat: ${teks.split('\n')[0]}` };
    }
    logs.push({ level: 'log', text: `[${t.nama}] ${h.stdout}` });
    if (samaOutput(h.stdout, t.harap)) return { nama: t.nama, lulus: true };
    return {
      nama: t.nama,
      lulus: false,
      pesan: `Output tidak sesuai.\nDiharapkan:\n${t.harap}\n\nDapat:\n${h.stdout || '(kosong)'}`,
    };
  });
  return { logs, error: null, hasil };
}

/**
 * Jalankan latihan tipe "kode-kelas": kompilasi kode user + Penguji.java + penguji khusus lesson,
 * lalu urai baris "@@TES@@" dari stdout jadi hasil tes.
 */
export async function jalankanKodeKelas({ berkasUser, pengujiIsi, tesUtamaNama, tesUtamaIsi, daftarTes }) {
  const status = await cekStatusJdk();
  if (!status.tersedia) return hasilJdkTidakAda(status, daftarTes.length);

  const berkas = [...berkasUser, { nama: 'Penguji.java', isi: pengujiIsi }, { nama: `${tesUtamaNama}.java`, isi: tesUtamaIsi }];
  const r = await panggilUji({ berkas, kelasUtama: tesUtamaNama, kasus: [{ nama: 'utama', stdin: '' }] });

  if (r.fase === 'jdk-tidak-ada') return hasilJdkTidakAda(r, daftarTes.length);
  if (r.fase === 'internal') {
    return { logs: [{ level: 'error', text: r.pesan }], error: r.pesan, hasil: daftarTes.map((nama) => ({ nama, lulus: false, pesan: r.pesan })) };
  }
  if (r.fase === 'kompilasi') {
    const teks = r.waktuHabis ? '⏱️ Kompilasi tidak selesai dalam waktu yang wajar.' : `❌ Kompilasi gagal:\n${pesanGalatKompilasi(r.stderr)}`;
    return { logs: [{ level: 'error', text: teks }], error: teks, hasil: daftarTes.map((nama) => ({ nama, lulus: false, pesan: 'Kompilasi gagal, perbaiki dulu galatnya (lihat tab Console).' })) };
  }

  const satu = r.hasil[0];
  if (satu.waktuHabis) {
    const teks = '⏱️ Program berjalan lebih dari batas waktu dan dihentikan.';
    return { logs: [{ level: 'error', text: teks }], error: teks, hasil: daftarTes.map((nama) => ({ nama, lulus: false, pesan: 'Waktu habis.' })) };
  }
  const { hasilTes, logsLain } = uraiProtokolTes(satu.stdout);
  const logs = logsLain.map((l) => ({ level: 'log', text: l }));
  if (!satu.berhasilJalan) {
    const teks = pesanGalatEksekusi(satu.stderr);
    logs.push({ level: 'error', text: teks });
    // Beberapa tes mungkin sempat lulus sebelum program berhenti; sisanya ditandai gagal.
    const namaSudah = new Set(hasilTes.map((h) => h.nama));
    for (const nama of daftarTes) {
      if (!namaSudah.has(nama)) hasilTes.push({ nama, lulus: false, pesan: `Program berhenti sebelum tes ini sempat berjalan: ${teks.split('\n')[0]}` });
    }
  }
  return { logs, error: satu.berhasilJalan ? null : satu.stderr, hasil: hasilTes };
}

function hasilJdkTidakAda(status, jumlahTes) {
  const teks =
    status.pesan ??
    'JDK (Java Development Kit) tidak terdeteksi di komputer ini, atau server dev tidak dapat dihubungi. Pasang JDK 21+ lalu jalankan ulang `npm run dev`.';
  return {
    logs: [{ level: 'error', text: `⚠️ ${teks}` }],
    error: teks,
    hasil: Array.from({ length: jumlahTes }, (_, i) => ({ nama: `tes-${i + 1}`, lulus: false, pesan: teks })),
  };
}

/** Jalankan kode bermasalah apa adanya untuk latihan "bedah galat", kembalikan pesan galat mentah + terjemahannya. */
export async function jalankanDiagnostik({ berkas, kelasUtama }) {
  const status = await cekStatusJdk();
  if (!status.tersedia) return { fase: 'jdk-tidak-ada', pesanAsli: status.pesan ?? 'JDK tidak tersedia.', jelas: null };

  const r = await panggilUji({ berkas, kelasUtama, kasus: [{ nama: 'diagnostik', stdin: '' }] });
  if (r.fase === 'jdk-tidak-ada') return { fase: 'jdk-tidak-ada', pesanAsli: r.pesan, jelas: null };
  if (r.fase === 'internal') return { fase: 'internal', pesanAsli: r.pesan, jelas: null };
  if (r.fase === 'kompilasi') {
    const pesanAsli = (r.stderr ?? '').trim();
    return { fase: 'kompilasi', pesanAsli, jelas: jelaskanGalat(pesanAsli) };
  }
  const satu = r.hasil[0];
  if (satu.waktuHabis) return { fase: 'eksekusi', pesanAsli: '(program tidak pernah berhenti — waktu habis)', jelas: null, waktuHabis: true };
  if (!satu.berhasilJalan) {
    const pesanAsli = (satu.stderr ?? '').trim();
    return { fase: 'eksekusi', pesanAsli, jelas: jelaskanGalat(pesanAsli) };
  }
  // Program berjalan sampai selesai tanpa pesan apa pun -> galat logika (khas Bagian 4.3 kedua modul).
  return { fase: 'logika', pesanAsli: '', jelas: null, stdout: satu.stdout };
}

/** Jalankan satu cuplikan kode (dibungkus kelas Main) untuk latihan "prediksi" / "diagram-memori", kembalikan stdout mentahnya. */
export async function jalankanCuplikan(isiKelasMain, kelasUtama = 'Main') {
  const status = await cekStatusJdk();
  if (!status.tersedia) return { berhasil: false, stdout: '', stderr: status.pesan ?? 'JDK tidak tersedia.', jdkTidakAda: true };
  const r = await panggilUji({ berkas: [{ nama: `${kelasUtama}.java`, isi: isiKelasMain }], kelasUtama, kasus: [{ nama: 'utama', stdin: '' }] });
  if (r.fase === 'kompilasi') return { berhasil: false, stdout: '', stderr: pesanGalatKompilasi(r.stderr), kompilasi: true };
  if (r.fase !== 'eksekusi') return { berhasil: false, stdout: '', stderr: r.pesan ?? 'Gagal menjalankan.' };
  const satu = r.hasil[0];
  return { berhasil: satu.berhasilJalan, stdout: satu.stdout, stderr: satu.berhasilJalan ? '' : pesanGalatEksekusi(satu.stderr) };
}
