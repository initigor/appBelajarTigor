// Menjalankan kode Java sungguhan di komputer lokal (javac lalu java), memakai JDK yang terpasang.
// Dipakai lewat plugin Vite `javaLokal()` di vite.config.js — HANYA aktif saat `npm run dev`/`npm run preview`,
// tidak pernah ikut di-deploy ke Vercel (di sana tidak ada JDK).
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const NAMA_BERKAS_VALID = /^[A-Za-z_$][A-Za-z0-9_$]*\.java$/;
const BATAS_KELUARAN = 200 * 1024; // 200 KB per stream, cukup untuk latihan pekan ini
const BATAS_KOMPILASI_MS = 10_000;
const BATAS_EKSEKUSI_MS = 5_000;

let cekJdk = null;
/** Cek sekali (di-cache) apakah javac & java tersedia di PATH. */
export function statusJdk() {
  if (!cekJdk) cekJdk = deteksiJdk();
  return cekJdk;
}
export function lupakanStatusJdk() {
  cekJdk = null;
}

function jalankanProses(perintah, argumen, { input, timeoutMs, cwd } = {}) {
  return new Promise((resolve) => {
    let proses;
    try {
      proses = spawn(perintah, argumen, { cwd, shell: false, windowsHide: true });
    } catch (e) {
      resolve({ error: `perintah "${perintah}" tidak ditemukan (${e.message})`, exitCode: null, stdout: '', stderr: '', waktuHabis: false });
      return;
    }
    let stdout = '';
    let stderr = '';
    let terpotongOut = false;
    let terpotongErr = false;
    let waktuHabis = false;
    let selesai = false;

    const bunuh = () => {
      if (process.platform === 'win32' && proses.pid) {
        // taskkill mematikan seluruh pohon proses (java kadang membuat sub-proses).
        spawn('taskkill', ['/pid', String(proses.pid), '/T', '/F'], { windowsHide: true }).on('error', () => {});
      } else {
        try {
          proses.kill('SIGKILL');
        } catch {
          /* abaikan */
        }
      }
    };

    const timer = setTimeout(() => {
      waktuHabis = true;
      bunuh();
    }, timeoutMs ?? BATAS_EKSEKUSI_MS);

    proses.stdout?.on('data', (d) => {
      if (stdout.length < BATAS_KELUARAN) stdout += d.toString('utf8');
      else terpotongOut = true;
    });
    proses.stderr?.on('data', (d) => {
      if (stderr.length < BATAS_KELUARAN) stderr += d.toString('utf8');
      else terpotongErr = true;
    });

    proses.on('error', (e) => {
      if (selesai) return;
      selesai = true;
      clearTimeout(timer);
      resolve({ error: e.message, exitCode: null, stdout, stderr, waktuHabis: false });
    });
    proses.on('close', (code) => {
      if (selesai) return;
      selesai = true;
      clearTimeout(timer);
      resolve({
        error: null,
        exitCode: code,
        stdout: terpotongOut ? stdout + '\n… (output dipotong, terlalu panjang)' : stdout,
        stderr: terpotongErr ? stderr + '\n… (output dipotong, terlalu panjang)' : stderr,
        waktuHabis,
      });
    });

    if (input !== undefined && proses.stdin) {
      proses.stdin.on('error', () => {
        /* program bisa saja berhenti sebelum membaca semua stdin (mis. tidak memakai Scanner) — abaikan EPIPE */
      });
      proses.stdin.write(input ?? '');
      proses.stdin.end();
    } else {
      proses.stdin?.end();
    }
  });
}

async function deteksiJdk() {
  const versiJavac = await jalankanProses('javac', ['-version'], { timeoutMs: 5000 });
  const versiJava = await jalankanProses('java', ['-version'], { timeoutMs: 5000 });
  const tersedia = versiJavac.exitCode === 0 && versiJava.exitCode === 0;
  return {
    tersedia,
    javac: (versiJavac.stdout + versiJavac.stderr).trim() || null, // javac -version mencetak ke stdout; java -version ke stderr
    java: (versiJava.stdout + versiJava.stderr).trim() || null,
  };
}

/**
 * Kompilasi lalu jalankan satu program Java multi-berkas di direktori sementara.
 * @param {{ berkas: {nama:string, isi:string}[], kelasUtama: string, stdin?: string, batasEksekusiMs?: number }} opsi
 */
export async function jalankanJava({ berkas, kelasUtama, stdin = '', batasEksekusiMs }) {
  const status = await statusJdk();
  if (!status.tersedia) {
    return {
      fase: 'jdk-tidak-ada',
      berhasil: false,
      pesan: 'JDK (javac & java) tidak ditemukan di PATH komputer ini. Pasang Java Development Kit 21+ lalu mulai ulang `npm run dev`.',
    };
  }
  for (const b of berkas) {
    if (!NAMA_BERKAS_VALID.test(b.nama)) {
      return { fase: 'internal', berhasil: false, pesan: `Nama berkas tidak sah: "${b.nama}".` };
    }
  }

  const dir = await mkdtemp(join(tmpdir(), 'latihkode-java-'));
  try {
    await Promise.all(berkas.map((b) => writeFile(join(dir, b.nama), b.isi, 'utf8')));

    const kompilasi = await jalankanProses('javac', berkas.map((b) => b.nama), { cwd: dir, timeoutMs: BATAS_KOMPILASI_MS });
    if (kompilasi.error) {
      return { fase: 'internal', berhasil: false, pesan: `Gagal menjalankan javac: ${kompilasi.error}` };
    }
    if (kompilasi.waktuHabis) {
      return { fase: 'kompilasi', berhasil: false, stdout: kompilasi.stdout, stderr: kompilasi.stderr, waktuHabis: true };
    }
    if (kompilasi.exitCode !== 0) {
      return { fase: 'kompilasi', berhasil: false, stdout: kompilasi.stdout, stderr: kompilasi.stderr, exitCode: kompilasi.exitCode };
    }

    const eksekusi = await jalankanProses('java', ['-XX:+UseSerialGC', '-Xss4m', '-Xmx256m', kelasUtama], {
      cwd: dir,
      input: stdin,
      timeoutMs: batasEksekusiMs ?? BATAS_EKSEKUSI_MS,
    });
    if (eksekusi.error) {
      return { fase: 'internal', berhasil: false, pesan: `Gagal menjalankan java: ${eksekusi.error}` };
    }
    return {
      fase: 'eksekusi',
      berhasil: eksekusi.exitCode === 0 && !eksekusi.waktuHabis,
      stdout: eksekusi.stdout,
      stderr: eksekusi.stderr,
      exitCode: eksekusi.exitCode,
      waktuHabis: eksekusi.waktuHabis,
    };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Kompilasi SEKALI, lalu jalankan kelasUtama berkali-kali dengan stdin berbeda (satu per "kasus").
 * Dipakai untuk latihan "kode-output" yang punya beberapa tes stdin/stdout, supaya tidak kompilasi ulang tiap tes.
 * @param {{ berkas: {nama:string, isi:string}[], kelasUtama: string, kasus: {nama:string, stdin?:string}[], batasEksekusiMs?: number }} opsi
 */
export async function jalankanUji({ berkas, kelasUtama, kasus, batasEksekusiMs }) {
  const status = await statusJdk();
  if (!status.tersedia) {
    return {
      fase: 'jdk-tidak-ada',
      berhasil: false,
      pesan: 'JDK (javac & java) tidak ditemukan di PATH komputer ini. Pasang Java Development Kit 21+ lalu mulai ulang `npm run dev`.',
    };
  }
  for (const b of berkas) {
    if (!NAMA_BERKAS_VALID.test(b.nama)) {
      return { fase: 'internal', berhasil: false, pesan: `Nama berkas tidak sah: "${b.nama}".` };
    }
  }

  const dir = await mkdtemp(join(tmpdir(), 'latihkode-java-'));
  try {
    await Promise.all(berkas.map((b) => writeFile(join(dir, b.nama), b.isi, 'utf8')));

    const kompilasi = await jalankanProses('javac', berkas.map((b) => b.nama), { cwd: dir, timeoutMs: BATAS_KOMPILASI_MS });
    if (kompilasi.error) {
      return { fase: 'internal', berhasil: false, pesan: `Gagal menjalankan javac: ${kompilasi.error}` };
    }
    if (kompilasi.waktuHabis || kompilasi.exitCode !== 0) {
      return {
        fase: 'kompilasi',
        berhasil: false,
        stdout: kompilasi.stdout,
        stderr: kompilasi.stderr,
        exitCode: kompilasi.exitCode,
        waktuHabis: kompilasi.waktuHabis,
      };
    }

    const hasil = [];
    for (const k of kasus) {
      const eksekusi = await jalankanProses('java', ['-XX:+UseSerialGC', '-Xss4m', '-Xmx256m', kelasUtama], {
        cwd: dir,
        input: k.stdin ?? '',
        timeoutMs: batasEksekusiMs ?? BATAS_EKSEKUSI_MS,
      });
      hasil.push({
        nama: k.nama,
        berhasilJalan: !eksekusi.error && eksekusi.exitCode === 0 && !eksekusi.waktuHabis,
        stdout: eksekusi.stdout,
        stderr: eksekusi.stderr,
        exitCode: eksekusi.exitCode,
        waktuHabis: eksekusi.waktuHabis,
        errorInternal: eksekusi.error ?? null,
      });
    }
    return { fase: 'eksekusi', berhasil: true, hasil };
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
