// Akun & sinkronisasi progress ke cloud (Vercel Functions + database).
// Prinsip: app tetap offline-first. localStorage tetap sumber utama; cloud hanya cadangan & jembatan antar-perangkat.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from './progress.jsx';
import { bagianCloud, gabungProgress } from './gabungProgress.js';

const KUNCI_AKUN = 'latihkode:akun:v1';
const JEDA_SIMPAN_MS = 1500;

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
    } catch (e) {
      tanganiGalat(e);
    } finally {
      sedangSinkron.current = false;
    }
  }, [terapkanSinkron, tanganiGalat]);

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
    const online = () => (sudahSinkronAwal.current ? kirim() : sinkronPenuh());
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, [akun, sinkronPenuh, kirim]);

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
      async gantiPassword(passwordLama, passwordBaru) {
        const { token } = await api('akun', { method: 'POST', token: akun.token, body: { passwordLama, passwordBaru } });
        ganti({ ...akun, token });
      },
      async hapusAkun(password) {
        await api('akun', { method: 'DELETE', token: akun.token, body: { password } });
        ganti(null);
      },
    }),
    [akun, status, pesanStatus, terakhirSinkron, masukAtauDaftar, ganti, sinkronPenuh],
  );

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useAkun() {
  return useContext(Ctx);
}
