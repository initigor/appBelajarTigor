// Progress course Java — PBO. Sengaja disimpan TERPISAH dari progress JavaScript/React (state/progress.jsx),
// termasuk riwayat Uji Pemahaman, supaya keduanya tidak saling campur.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { semuaPelajaranJava } from '../lessonsJava/index.js';
import { tanggalLokal } from './progress.jsx';

const KUNCI = 'latihkode:java:progress:v1';

const awal = () => ({
  selesai: {}, // { [id]: { tanggal, xp, lewatUji?: true } }
  kode: {}, // { [id]: {nama,isi}[] } kode terakhir di editor per pelajaran
  percobaan: {}, // { [id]: number }
  streak: { jumlah: 0, terakhir: null },
  jalur: {}, // { [pekan]: 'uji' | 'belajar' } — jalur yang dipilih untuk pekan itu
  remedial: {}, // { [pekan]: string[] } — id pelajaran yang "perlu diulang" setelah Uji Pemahaman
  riwayatUji: {}, // { [pekan]: { tanggal, benar, total, perLesson: {[id]: {benar,total}} }[] }
  soalDipakai: {}, // { [pekan]: string[] } — id soal yang sudah pernah muncul, supaya uji ulang beda soal
  v3: null, // { tanggal, benar, total } — hasil Latihan V-3 terakhir (Pekan 3), sekadar catatan latihan
  diubah: 0,
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

const Ctx = createContext(null);

export function ProgressJavaProvider({ children }) {
  const [data, setData] = useState(muat);

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(data));
    } catch {
      /* penyimpanan penuh/diblokir: abaikan */
    }
  }, [data]);

  const ubah = useCallback(
    (fn) =>
      setData((d) => {
        const baru = fn(d);
        return baru === d ? d : { ...baru, diubah: Date.now() };
      }),
    [],
  );

  const simpanKode = useCallback((id, berkas) => ubah((d) => ({ ...d, kode: { ...d.kode, [id]: berkas } })), [ubah]);
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

  const catatStreak = (d) => {
    const hariIni = tanggalLokal();
    let { jumlah, terakhir } = d.streak;
    if (terakhir !== hariIni) {
      const selisih = terakhir ? Math.round((new Date(hariIni + 'T00:00:00') - new Date(terakhir + 'T00:00:00')) / 86400000) : null;
      jumlah = selisih === 1 ? jumlah + 1 : 1;
      terakhir = hariIni;
    }
    return { jumlah, terakhir };
  };

  const tandaiSelesai = useCallback(
    (pelajaran, extra) => {
      ubah((d) => {
        if (d.selesai[pelajaran.id]) return d;
        return {
          ...d,
          selesai: { ...d.selesai, [pelajaran.id]: { tanggal: tanggalLokal(), xp: pelajaran.xp, ...extra } },
          streak: catatStreak(d),
        };
      });
    },
    [ubah],
  );

  /** Set jalur ('uji' | 'belajar') untuk satu pekan. */
  const pilihJalur = useCallback((pekan, jalur) => ubah((d) => ({ ...d, jalur: { ...d.jalur, [pekan]: jalur } })), [ubah]);

  /**
   * Terapkan hasil Uji Pemahaman: tandai pelajaran yang semua soalnya benar sebagai selesai,
   * sisanya masuk daftar remedial. Menyimpan satu entri riwayat.
   * @param {number} pekan
   * @param {Record<string, {benar:number, total:number}>} perLesson
   */
  const terapkanHasilUji = useCallback(
    (pekan, perLesson, idSoalDipakaiBaru = []) => {
      ubah((d) => {
        const lolos = [];
        const gagal = [];
        for (const [id, r] of Object.entries(perLesson)) (r.benar === r.total ? lolos : gagal).push(id);
        const selesaiBaru = { ...d.selesai };
        const hariIni = tanggalLokal();
        for (const id of lolos) {
          if (!selesaiBaru[id]) {
            const p = semuaPelajaranJava.find((x) => x.id === id);
            selesaiBaru[id] = { tanggal: hariIni, xp: p?.xp ?? 0, lewatUji: true };
          }
        }
        const totalBenar = Object.values(perLesson).reduce((a, r) => a + r.benar, 0);
        const totalSoal = Object.values(perLesson).reduce((a, r) => a + r.total, 0);
        const riwayat = { ...d.riwayatUji, [pekan]: [...(d.riwayatUji[pekan] ?? []), { tanggal: hariIni, benar: totalBenar, total: totalSoal, perLesson }] };
        const dipakaiBaru = new Set([...(d.soalDipakai[pekan] ?? []), ...idSoalDipakaiBaru]);
        return {
          ...d,
          selesai: selesaiBaru,
          remedial: { ...d.remedial, [pekan]: gagal },
          riwayatUji: riwayat,
          soalDipakai: { ...d.soalDipakai, [pekan]: [...dipakaiBaru] },
          streak: lolos.length > 0 ? catatStreak(d) : d.streak,
        };
      });
    },
    [ubah],
  );

  /** Hapus satu id dari daftar remedial pekan (dipanggil setelah pelajaran itu benar-benar dikerjakan & lulus). */
  const bersihkanRemedial = useCallback(
    (pekan, id) =>
      ubah((d) => {
        const daftar = d.remedial[pekan];
        if (!daftar || !daftar.includes(id)) return d;
        return { ...d, remedial: { ...d.remedial, [pekan]: daftar.filter((x) => x !== id) } };
      }),
    [ubah],
  );

  const catatV3 = useCallback((hasil) => ubah((d) => ({ ...d, v3: hasil })), [ubah]);

  const resetProgress = useCallback(() => setData((d) => ({ ...awal(), diubah: Date.now() })), []);

  const nilai = useMemo(() => {
    const totalXp = Object.values(data.selesai).reduce((a, s) => a + (s.xp ?? 0), 0);
    return {
      data,
      totalXp,
      streak: data.streak.jumlah,
      isSelesai: (id) => Boolean(data.selesai[id]),
      isLewatUji: (id) => Boolean(data.selesai[id]?.lewatUji),
      isRemedial: (pekan, id) => (data.remedial[pekan] ?? []).includes(id),
      jalurPekan: (pekan) => data.jalur[pekan] ?? null,
      riwayatUjiPekan: (pekan) => data.riwayatUji[pekan] ?? [],
      soalDipakaiPekan: (pekan) => data.soalDipakai[pekan] ?? [],
      simpanKode,
      hapusKode,
      tambahPercobaan,
      tandaiSelesai,
      pilihJalur,
      terapkanHasilUji,
      bersihkanRemedial,
      catatV3,
      resetProgress,
    };
  }, [data, simpanKode, hapusKode, tambahPercobaan, tandaiSelesai, pilihJalur, terapkanHasilUji, bersihkanRemedial, catatV3, resetProgress]);

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useProgressJava() {
  return useContext(Ctx);
}
