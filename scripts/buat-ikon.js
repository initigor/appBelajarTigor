// Membuat ikon PNG untuk PWA dari public/ikon.svg.
// Jalankan ulang setelah mengubah ikon: npm run ikon
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/ikon.svg', 'utf8');
// Versi "maskable": latar penuh tanpa sudut membulat, karena Android memotong sendiri bentuknya.
const svgMaskable = svg.replace(/<rect[^>]*\/>/, '<rect width="512" height="512" fill="#6d4aff"/>');

const target = [
  ['public/ikon-180.png', svg, 180], // apple-touch-icon (iOS)
  ['public/ikon-192.png', svg, 192],
  ['public/ikon-512.png', svg, 512],
  ['public/ikon-maskable-512.png', svgMaskable, 512],
];

for (const [file, isi, ukuran] of target) {
  await sharp(Buffer.from(isi)).resize(ukuran, ukuran).png().toFile(file);
  console.log('✓', file);
}
