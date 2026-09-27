import { useMemo } from 'react';

const WARNA = ['#ffd23f', '#7c5cff', '#2ec4b6', '#ff5d8f', '#4cc9f0', '#80ed99'];

export default function Confetti({ jumlah = 80 }) {
  const potongan = useMemo(
    () =>
      Array.from({ length: jumlah }, (_, i) => ({
        kiri: Math.random() * 100,
        tunda: Math.random() * 0.6,
        durasi: 1.6 + Math.random() * 1.4,
        warna: WARNA[i % WARNA.length],
        putar: Math.random() * 360,
        lebar: 6 + Math.random() * 6,
      })),
    [jumlah],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {potongan.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.kiri}%`,
            background: p.warna,
            width: p.lebar,
            height: p.lebar * 0.45,
            animationDelay: `${p.tunda}s`,
            animationDuration: `${p.durasi}s`,
            transform: `rotate(${p.putar}deg)`,
          }}
        />
      ))}
    </div>
  );
}
