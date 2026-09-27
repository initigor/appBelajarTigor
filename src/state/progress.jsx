import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { semuaPelajaran } from '../lessons/index.js';

const KUNCI = 'latihkode:progress:v1';

const awal = () => ({
  selesai: {}, // { [id]: { tanggal: 'YYYY-MM-DD', xp: number } }
  kode: {}, // { [id]: string } kode terakhir di editor
  percobaan: {}, // { [id]: number } berapa kali "Jalankan" ditekan
  streak: { jumlah: 0, terakhir: null },
  tema: 'sistem', // 'sistem' | 'terang' | 'gelap'
  diubah: 0, // timestamp perubahan terakhir (untuk sinkron antar-perangkat)
  resetPada: 0, // timestamp reset terakhir
});

function muat() {
  try {
    const raw = localStorage.getItem(KUNCI);
    if (!raw) return awal();
    return { ...awal(), ...JSON.parse(raw) };
  } catch {
    return awal();
  }
}

export function tanggalLokal(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function selisihHari(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [data, setData] = useState(muat);

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(data));
    } catch {
      /* penyimpanan penuh / diblokir: abaikan */
    }
  }, [data]);

  // Tema
  const [sistemGelap, setSistemGelap] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const f = (e) => setSistemGelap(e.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  const temaAktif = data.tema === 'sistem' ? (sistemGelap ? 'gelap' : 'terang') : data.tema;
  useEffect(() => {
    document.documentElement.dataset.theme = temaAktif === 'gelap' ? 'dark' : 'light';
  }, [temaAktif]);

  // Semua perubahan progress lewat sini supaya timestamp "diubah" selalu ikut diperbarui.
  const ubah = useCallback(
    (fn) =>
      setData((d) => {
        const baru = fn(d);
        return baru === d ? d : { ...baru, diubah: Date.now() };
      }),
    [],
  );

  const simpanKode = useCallback((id, kode) => ubah((d) => ({ ...d, kode: { ...d.kode, [id]: kode } })), [ubah]);
  const hapusKode = useCallback(
    (id) =>
      ubah((d) => {
        const kode = { ...d.kode };
        delete kode[id];
        return { ...d, kode };
      }),
    [ubah],
  );
  const tambahPercobaan = useCallback(
    (id) => ubah((d) => ({ ...d, percobaan: { ...d.percobaan, [id]: (d.percobaan[id] ?? 0) + 1 } })),
    [ubah],
  );
  const tandaiSelesai = useCallback((pelajaran) => {
    ubah((d) => {
      if (d.selesai[pelajaran.id]) return d;
      const hariIni = tanggalLokal();
      let { jumlah, terakhir } = d.streak;
      if (terakhir !== hariIni) {
        jumlah = terakhir && selisihHari(terakhir, hariIni) === 1 ? jumlah + 1 : 1;
        terakhir = hariIni;
      }
      return {
        ...d,
        selesai: { ...d.selesai, [pelajaran.id]: { tanggal: hariIni, xp: pelajaran.xp } },
        streak: { jumlah, terakhir },
      };
    });
  }, [ubah]);
  const setTema = useCallback((tema) => setData((d) => ({ ...d, tema })), []);
  const resetProgress = useCallback(() => {
    const kini = Date.now();
    setData((d) => ({ ...awal(), tema: d.tema, diubah: kini, resetPada: kini }));
  }, []);
  /** Ganti seluruh progress (impor file). Tema di perangkat ini tetap. */
  const imporData = useCallback((obj) => setData((d) => ({ ...awal(), ...obj, tema: d.tema, diubah: Date.now() })), []);
  /** Ganti seluruh progress dengan hasil sinkron (timestamp dari hasil gabungan dipertahankan). */
  const terapkanSinkron = useCallback((obj) => setData((d) => ({ ...awal(), ...obj, tema: d.tema })), []);

  const nilai = useMemo(() => {
    const hariIni = tanggalLokal();
    const streakAktif =
      data.streak.terakhir && selisihHari(data.streak.terakhir, hariIni) <= 1 ? data.streak.jumlah : 0;
    const totalXp = Object.values(data.selesai).reduce((a, s) => a + (s.xp ?? 0), 0);
    const berikutnya = semuaPelajaran.find((p) => !data.selesai[p.id]) ?? null;
    return {
      data,
      totalXp,
      streak: streakAktif,
      sudahBelajarHariIni: data.streak.terakhir === hariIni,
      jumlahSelesai: Object.keys(data.selesai).filter((id) => semuaPelajaran.some((p) => p.id === id)).length,
      berikutnya,
      temaAktif,
      isSelesai: (id) => Boolean(data.selesai[id]),
      simpanKode,
      hapusKode,
      tambahPercobaan,
      tandaiSelesai,
      setTema,
      resetProgress,
      imporData,
      terapkanSinkron,
    };
  }, [data, temaAktif, simpanKode, hapusKode, tambahPercobaan, tandaiSelesai, setTema, resetProgress, imporData, terapkanSinkron]);

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useProgress() {
  return useContext(Ctx);
}
