// Akun & sinkronisasi progress ke cloud (Vercel Functions + database).
// Prinsip: app tetap offline-first. localStorage tetap sumber utama; cloud hanya cadangan & jembatan antar-perangkat.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from './progress.jsx';
import { bagianCloud, gabungProgress } from './gabungProgress.js';
import { gabungRiwayat, potongUkuranRiwayat } from './gabungRiwayat.js';
import { ambilUntukSinkron, langgananRiwayat, terapkanDariSinkron } from './riwayatUjian.js';
import { gabungWorkspace, ukuranWorkspace } from './gabungWorkspace.js';
import {
  ambilUntukSinkron as ambilWorkspace,
  langgananWorkspace,
  terapkanDariSinkron as terapkanWorkspace,
} from './workspace.js';

const KUNCI_AKUN = 'latihkode:akun:v1';
const JEDA_SIMPAN_MS = 1500;
const JEDA_SEGARKAN_MS = 20000; // minimal selang antar-sinkron riwayat/workspace saat tab kembali aktif
// Workspace diedit terus-menerus saat mengetik, jadi dikirim setelah berhenti mengetik cukup lama
// (menghemat jatah perintah database gratis).
const JEDA_WORKSPACE_MS = 6000;
const BATAS_WORKSPACE = 700 * 1024; // karakter JSON; di bawah batas server (900 KB) & batas request database

function muatAkun() {
  try {
    const a = JSON.parse(localStorage.getItem(KUNCI_AKUN) ?? 'null');
    return a?.username && a?.token ? a : null;
  } catch {
    return null;
  }
}

function simpanAkun(a) {
  try {
    if (a) localStorage.setItem(KUNCI_AKUN, JSON.stringify(a));
    else localStorage.removeItem(KUNCI_AKUN);
  } catch {
    /* abaikan */
  }
}

class GagalApi extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

async function api(path, { method = 'GET', token, body } = {}) {
  let res;
  try {
    res = await fetch(`/api/${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new GagalApi(0, 'Tidak ada koneksi internet.');
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* respons bukan JSON */
  }
  if (!res.ok) {
    const pesan = data.pesan ?? (res.status === 404 ? 'Server akun tidak ditemukan. Fitur akun hanya aktif di Vercel atau `npm run dev`.' : `Server error (${res.status}).`);
    throw new GagalApi(res.status, pesan);
  }
  return data;
}

const Ctx = createContext(null);

export function AkunProvider({ children }) {
  const prog = useProgress();
  const { data, terapkanSinkron } = prog;
  const [akun, setAkun] = useState(muatAkun);
  // status: 'tamu' | 'sinkron' (sedang) | 'tersimpan' | 'menunggu' (ada perubahan) | 'offline' | 'galat'
  const [status, setStatus] = useState(akun ? 'menunggu' : 'tamu');
  const [pesanStatus, setPesanStatus] = useState('');
  const [terakhirSinkron, setTerakhirSinkron] = useState(null);

  const dataRef = useRef(data);
  dataRef.current = data;
  const akunRef = useRef(akun);
  akunRef.current = akun;
  const terakhirTerkirim = useRef(-1); // nilai data.diubah yang terakhir tersimpan di cloud
  const sudahSinkronAwal = useRef(false);
  const sedangSinkron = useRef(false);
  const sedangSinkronRiwayat = useRef(false);
  const terakhirSinkronRiwayat = useRef(0);
  const ulangRiwayat = useRef(false);
  const fnRiwayat = useRef(null);
  const sedangSinkronWorkspace = useRef(false);
  const terakhirSinkronWorkspace = useRef(0);
  const ulangWorkspace = useRef(false);
  const fnWorkspace = useRef(null);
  const [masalahWorkspace, setMasalahWorkspace] = useState(null);

  const ganti = useCallback((a) => {
    simpanAkun(a);
    setAkun(a);
    sudahSinkronAwal.current = false;
    terakhirTerkirim.current = -1;
    setStatus(a ? 'menunggu' : 'tamu');
    setPesanStatus('');
  }, []);

  const tanganiGalat = useCallback(
    (e) => {
      if (e.status === 401) {
        ganti(null);
        setPesanStatus(e.message);
        return;
      }
      setStatus(e.status === 0 ? 'offline' : 'galat');
      setPesanStatus(e.message);
    },
    [ganti],
  );

  /**
   * Riwayat ujian: ambil dari cloud, gabungkan dengan lokal, simpan hasilnya di kedua tempat.
   * Sengaja tidak mengubah status akun: riwayat bukan data kritis, jadi galat jaringan/server diabaikan
   * (kecuali sesi tidak valid) dan dicoba lagi pada sinkron berikutnya.
   */
  const sinkronRiwayat = useCallback(async () => {
    const a = akunRef.current;
    if (!a) return;
    if (sedangSinkronRiwayat.current) {
      ulangRiwayat.current = true; // ada perubahan baru saat sinkron berjalan: ulangi setelah selesai
      return;
    }
    sedangSinkronRiwayat.current = true;
    try {
      const { riwayat: cloud } = await api('riwayat', { token: a.token });
      const gabungan = gabungRiwayat(ambilUntukSinkron(), cloud);
      terapkanDariSinkron(gabungan);
      await api('riwayat', { method: 'PUT', token: a.token, body: { riwayat: potongUkuranRiwayat(gabungan) } });
      terakhirSinkronRiwayat.current = Date.now();
    } catch (e) {
      if (e.status === 401) tanganiGalat(e);
    } finally {
      sedangSinkronRiwayat.current = false;
      if (ulangRiwayat.current) {
        ulangRiwayat.current = false;
        setTimeout(() => fnRiwayat.current?.(), 300);
      }
    }
  }, [tanganiGalat]);
  fnRiwayat.current = sinkronRiwayat;

  /**
   * Workspace: sama seperti riwayat (ambil, gabung, simpan di kedua tempat). Bila datanya terlalu besar
   * untuk batas gratis, hanya digabung ke lokal dan tidak dikirim (lihat `masalahWorkspace`).
   */
  const sinkronWorkspace = useCallback(async () => {
    const a = akunRef.current;
    if (!a) return;
    if (sedangSinkronWorkspace.current) {
      ulangWorkspace.current = true;
      return;
    }
    sedangSinkronWorkspace.current = true;
    try {
      const { workspace: cloud } = await api('workspace', { token: a.token });
      const gabungan = gabungWorkspace(ambilWorkspace(), cloud);
      terapkanWorkspace(gabungan);
      if (ukuranWorkspace(gabungan) > BATAS_WORKSPACE) {
        setMasalahWorkspace('Project Workspace terlalu besar untuk disinkronkan (maksimal ±700 KB kode). Hapus project/berkas yang tidak dipakai.');
        return;
      }
      setMasalahWorkspace(null);
      await api('workspace', { method: 'PUT', token: a.token, body: { workspace: gabungan } });
      terakhirSinkronWorkspace.current = Date.now();
    } catch (e) {
      if (e.status === 401) tanganiGalat(e);
    } finally {
      sedangSinkronWorkspace.current = false;
      if (ulangWorkspace.current) {
        ulangWorkspace.current = false;
        setTimeout(() => fnWorkspace.current?.(), 300);
      }
    }
  }, [tanganiGalat]);
  fnWorkspace.current = sinkronWorkspace;

  /** Ambil progress cloud, gabungkan dengan lokal, lalu simpan hasilnya di kedua tempat. */
  const sinkronPenuh = useCallback(async () => {
    const a = akunRef.current;
    if (!a || sedangSinkron.current) return;
    sedangSinkron.current = true;
    setStatus('sinkron');
    try {
      const { progress: cloud } = await api('progress', { token: a.token });
      const gabungan = gabungProgress(dataRef.current, cloud);
      terapkanSinkron(gabungan);
      await api('progress', { method: 'PUT', token: a.token, body: { progress: bagianCloud(gabungan) } });
      terakhirTerkirim.current = gabungan.diubah;
      sudahSinkronAwal.current = true;
      setStatus('tersimpan');
      setPesanStatus('');
      setTerakhirSinkron(new Date());
      sinkronRiwayat();
      sinkronWorkspace();
    } catch (e) {
      tanganiGalat(e);
    } finally {
      sedangSinkron.current = false;
    }
  }, [terapkanSinkron, tanganiGalat, sinkronRiwayat, sinkronWorkspace]);

  /** Kirim progress lokal ke cloud (dipakai setelah ada perubahan). */
  const kirim = useCallback(async () => {
    const a = akunRef.current;
    if (!a) return;
    const p = dataRef.current;
    setStatus('sinkron');
    try {
      await api('progress', { method: 'PUT', token: a.token, body: { progress: bagianCloud(p) } });
      terakhirTerkirim.current = p.diubah;
      setStatus(dataRef.current.diubah === p.diubah ? 'tersimpan' : 'menunggu');
      setPesanStatus('');
      setTerakhirSinkron(new Date());
    } catch (e) {
      tanganiGalat(e);
    }
  }, [tanganiGalat]);

  // Sinkron penuh saat app dibuka (jika sudah masuk) dan setiap kali kembali online.
  useEffect(() => {
    if (!akun) return;
    if (!sudahSinkronAwal.current) sinkronPenuh();
    const online = () => {
      if (!sudahSinkronAwal.current) return sinkronPenuh();
      kirim();
      sinkronRiwayat();
      return sinkronWorkspace();
    };
    // Riwayat ujian & Workspace bisa berubah dari perangkat lain: segarkan saat tab/app kembali dibuka.
    const terlihat = () => {
      if (document.visibilityState !== 'visible' || !sudahSinkronAwal.current) return;
      if (Date.now() - terakhirSinkronRiwayat.current > JEDA_SEGARKAN_MS) sinkronRiwayat();
      if (Date.now() - terakhirSinkronWorkspace.current > JEDA_SEGARKAN_MS) sinkronWorkspace();
    };
    window.addEventListener('online', online);
    document.addEventListener('visibilitychange', terlihat);
    return () => {
      window.removeEventListener('online', online);
      document.removeEventListener('visibilitychange', terlihat);
    };
  }, [akun, sinkronPenuh, kirim, sinkronRiwayat, sinkronWorkspace]);

  // Riwayat ujian berubah di perangkat ini (selesai ujian / hapus): kirim ke cloud setelah jeda singkat.
  useEffect(() => {
    if (!akun) return undefined;
    let t;
    const off = langgananRiwayat((jenis) => {
      if (jenis !== 'lokal' || !sudahSinkronAwal.current) return;
      clearTimeout(t);
      t = setTimeout(sinkronRiwayat, JEDA_SIMPAN_MS);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [akun, sinkronRiwayat]);

  // Workspace berubah di perangkat ini (mengetik, berkas baru, hapus project): kirim setelah berhenti mengubah.
  useEffect(() => {
    if (!akun) return undefined;
    let t;
    const off = langgananWorkspace((jenis) => {
      if (jenis !== 'lokal' || !sudahSinkronAwal.current) return;
      clearTimeout(t);
      t = setTimeout(sinkronWorkspace, JEDA_WORKSPACE_MS);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [akun, sinkronWorkspace]);

  // Setiap progress berubah: kirim ke cloud setelah jeda singkat.
  useEffect(() => {
    if (!akun || !sudahSinkronAwal.current) return;
    if (data.diubah === terakhirTerkirim.current) return;
    setStatus((s) => (s === 'offline' ? s : 'menunggu'));
    const t = setTimeout(kirim, JEDA_SIMPAN_MS);
    return () => clearTimeout(t);
  }, [akun, data.diubah, kirim]);

  const masukAtauDaftar = useCallback(
    async (jenis, username, password) => {
      const hasil = await api(jenis, { method: 'POST', body: { username, password } });
      ganti({ username: hasil.username, token: hasil.token });
      // efek di atas akan menjalankan sinkronPenuh untuk menggabungkan progress
    },
    [ganti],
  );

  const nilai = useMemo(
    () => ({
      akun,
      status,
      pesanStatus,
      terakhirSinkron,
      masuk: (u, p) => masukAtauDaftar('masuk', u, p),
      daftar: (u, p) => masukAtauDaftar('daftar', u, p),
      keluar: () => ganti(null),
      sinkronSekarang: sinkronPenuh,
      sinkronRiwayat,
      sinkronWorkspace,
      masalahWorkspace,
      async gantiPassword(passwordLama, passwordBaru) {
        const { token } = await api('akun', { method: 'POST', token: akun.token, body: { passwordLama, passwordBaru } });
        ganti({ ...akun, token });
      },
      async hapusAkun(password) {
        await api('akun', { method: 'DELETE', token: akun.token, body: { password } });
        ganti(null);
      },
    }),
    [akun, status, pesanStatus, terakhirSinkron, masukAtauDaftar, ganti, sinkronPenuh, sinkronRiwayat, sinkronWorkspace, masalahWorkspace],
  );

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useAkun() {
  return useContext(Ctx);
}
