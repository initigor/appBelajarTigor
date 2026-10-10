// Tata letak keyboard QWERTY (US, yang dipakai untuk ngoding) beserta pemetaan jari.
// Fungsi murni tanpa React/DOM, jadi bisa dites di Node (scripts/check-mengetik.js).
//
// Satuan geometri: lebar satu tombol = 1. Titik (0,0) = pojok kiri-atas tombol "`".
// Jari diberi kode L1..L5 (tangan kiri) dan R1..R5 (kanan); 1 = ibu jari ... 5 = kelingking.

export const NAMA_JARI = {
  1: 'ibu jari',
  2: 'telunjuk',
  3: 'jari tengah',
  4: 'jari manis',
  5: 'kelingking',
};

export const namaJari = (kode) => `${NAMA_JARI[kode[1]]} ${kode[0] === 'L' ? 'kiri' : 'kanan'}`;
export const urutanJari = ['L5', 'L4', 'L3', 'L2', 'L1', 'R1', 'R2', 'R3', 'R4', 'R5'];

// [id, label, w, jari, karakter polos, karakter dengan Shift]
const BARIS_DEF = [
  [
    ['`', 1, 'L5', '`', '~'], ['1', 1, 'L5', '1', '!'], ['2', 1, 'L4', '2', '@'], ['3', 1, 'L3', '3', '#'],
    ['4', 1, 'L2', '4', '$'], ['5', 1, 'L2', '5', '%'], ['6', 1, 'R2', '6', '^'], ['7', 1, 'R2', '7', '&'],
    ['8', 1, 'R3', '8', '*'], ['9', 1, 'R4', '9', '('], ['0', 1, 'R5', '0', ')'], ['-', 1, 'R5', '-', '_'],
    ['=', 1, 'R5', '=', '+'], ['Backspace', 2, 'R5', null, null, '⌫'],
  ],
  [
    ['Tab', 1.5, 'L5', null, null, 'Tab'], ['q', 1, 'L5', 'q', 'Q'], ['w', 1, 'L4', 'w', 'W'], ['e', 1, 'L3', 'e', 'E'],
    ['r', 1, 'L2', 'r', 'R'], ['t', 1, 'L2', 't', 'T'], ['y', 1, 'R2', 'y', 'Y'], ['u', 1, 'R2', 'u', 'U'],
    ['i', 1, 'R3', 'i', 'I'], ['o', 1, 'R4', 'o', 'O'], ['p', 1, 'R5', 'p', 'P'], ['[', 1, 'R5', '[', '{'],
    [']', 1, 'R5', ']', '}'], ['\\', 1.5, 'R5', '\\', '|'],
  ],
  [
    ['Caps', 1.75, 'L5', null, null, 'Caps'], ['a', 1, 'L5', 'a', 'A'], ['s', 1, 'L4', 's', 'S'], ['d', 1, 'L3', 'd', 'D'],
    ['f', 1, 'L2', 'f', 'F'], ['g', 1, 'L2', 'g', 'G'], ['h', 1, 'R2', 'h', 'H'], ['j', 1, 'R2', 'j', 'J'],
    ['k', 1, 'R3', 'k', 'K'], ['l', 1, 'R4', 'l', 'L'], [';', 1, 'R5', ';', ':'], ["'", 1, 'R5', "'", '"'],
    ['Enter', 2.25, 'R5', '\n', null, '↵'],
  ],
  [
    ['ShiftL', 2.25, 'L5', null, null, 'Shift'], ['z', 1, 'L5', 'z', 'Z'], ['x', 1, 'L4', 'x', 'X'], ['c', 1, 'L3', 'c', 'C'],
    ['v', 1, 'L2', 'v', 'V'], ['b', 1, 'L2', 'b', 'B'], ['n', 1, 'R2', 'n', 'N'], ['m', 1, 'R2', 'm', 'M'],
    [',', 1, 'R3', ',', '<'], ['.', 1, 'R4', '.', '>'], ['/', 1, 'R5', '/', '?'], ['ShiftR', 2.75, 'R5', null, null, 'Shift'],
  ],
  [['Space', 6.25, 'R1', ' ', null, 'spasi']],
];

/** Daftar tombol datar: { id, x, y, w, jari, polos, atas, label }. */
export const TOMBOL = [];
BARIS_DEF.forEach((baris, y) => {
  let x = y === 4 ? 3.75 : 0;
  for (const [id, w, jari, polos, atas, label] of baris) {
    TOMBOL.push({ id, x, y, w, jari, polos, atas, label: label ?? null });
    x += w;
  }
});

export const LEBAR_PAPAN = 15;
export const TINGGI_PAPAN = 5;

const TOMBOL_ID = new Map(TOMBOL.map((t) => [t.id, t]));
export const tombolById = (id) => TOMBOL_ID.get(id) ?? null;

/** Titik tengah sebuah tombol (satuan papan). */
export const pusat = (t) => ({ x: t.x + t.w / 2, y: t.y + 0.5 });

// Posisi siap: telunjuk di F & J, lainnya di A S D ; dan kedua ibu jari di spasi.
const RUMAH = { L5: 'a', L4: 's', L3: 'd', L2: 'f', R2: 'j', R3: 'k', R4: 'l', R5: ';' };
export const posisiRumah = (jari) => {
  if (RUMAH[jari]) return pusat(tombolById(RUMAH[jari]));
  const ruang = pusat(tombolById('Space'));
  return { x: ruang.x + (jari === 'L1' ? -1.25 : 1.25), y: ruang.y + 0.05 };
};

// Pangkal jari (buku jari) tempat tiap jari "tumbuh" dari telapak, di bawah papan.
export const PANGKAL = {
  L5: { x: 1.9, y: 6.1 },
  L4: { x: 3.0, y: 5.85 },
  L3: { x: 4.1, y: 5.75 },
  L2: { x: 5.2, y: 5.85 },
  L1: { x: 6.2, y: 6.35 },
  R1: { x: 8.8, y: 6.35 },
  R2: { x: 9.8, y: 5.85 },
  R3: { x: 10.9, y: 5.75 },
  R4: { x: 12.0, y: 5.85 },
  R5: { x: 13.1, y: 6.1 },
};

// Peta karakter -> info tombol. Huruf besar & simbol atas memakai Shift tangan yang berlawanan.
const PETA = new Map();
for (const t of TOMBOL) {
  if (t.polos !== null) PETA.set(t.polos, { tombol: t.id, jari: t.jari, shift: false, label: t.polos === ' ' ? 'Spasi' : t.polos === '\n' ? 'Enter' : t.polos });
  if (t.atas !== null) {
    PETA.set(t.atas, { tombol: t.id, jari: t.jari, shift: true, jariShift: t.jari[0] === 'L' ? 'R5' : 'L5', tombolShift: t.jari[0] === 'L' ? 'ShiftR' : 'ShiftL', label: t.atas });
  }
}

/** Info cara mengetik sebuah karakter, atau null bila tidak ada di papan. */
export const infoKarakter = (ch) => PETA.get(ch) ?? null;
export const bisaDiketik = (ch) => PETA.has(ch);

/** Nama tombol fisik yang ditekan untuk sebuah karakter ('a' dan 'A' sama-sama tombol A). */
export function namaTombol(ch) {
  const info = infoKarakter(ch);
  if (!info) return '';
  if (info.tombol === 'Space') return 'Spasi';
  return info.tombol.length === 1 ? info.tombol.toUpperCase() : info.tombol;
}

/** Kalimat petunjuk, mis. "Shift kiri (kelingking kiri) + 9 (jari manis kanan)". */
export function petunjuk(ch) {
  const info = infoKarakter(ch);
  if (!info) return '';
  const tombol = namaTombol(ch);
  if (!info.shift) return `${tombol} dengan ${namaJari(info.jari)}`;
  const sisi = info.jariShift[0] === 'L' ? 'kiri' : 'kanan';
  return `Shift ${sisi} (${namaJari(info.jariShift)}) + ${tombol} (${namaJari(info.jari)})`;
}
