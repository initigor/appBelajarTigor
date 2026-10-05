// Daftar chapter. `folder` harus sama dengan nama folder di src/lessons/.
export const chapters = [
  { id: 1, folder: '01-dasar-js', judul: 'Dasar JavaScript', ikon: '🌱', deskripsi: 'console.log, variabel, tipe data, operator, dan konversi tipe.' },
  { id: 2, folder: '02-percabangan-loop', judul: 'Percabangan & Loop', ikon: '🔀', deskripsi: 'if/else, ternary, switch, for, while, for...of, break/continue.' },
  { id: 3, folder: '03-string-fungsi', judul: 'String & Fungsi', ikon: '🧵', deskripsi: 'Template literal, method string, function, arrow function, callback.' },
  { id: 4, folder: '04-array', judul: 'Array', ikon: '📚', deskripsi: 'push/pop, slice, map, filter, find, reduce, sort, dan salinan array.' },
  { id: 5, folder: '05-object', judul: 'Object', ikon: '🗂️', deskripsi: 'Object literal, Object.keys/values/entries, array of object, JSON.' },
  { id: 6, folder: '06-js-modern', judul: 'JS Modern', ikon: '✨', deskripsi: 'Destructuring, spread/rest, optional chaining, ??, short-circuit.' },
  { id: 7, folder: '07-dom-event', judul: 'DOM & Event', ikon: '🖱️', deskripsi: 'Mengubah halaman web dengan querySelector, classList, dan event.' },
  { id: 8, folder: '08-async', judul: 'Async', ikon: '⏳', deskripsi: 'setTimeout, Promise, async/await, try/catch, dan fetch (simulasi).' },
  { id: 9, folder: '09-react-dasar', judul: 'React Dasar', ikon: '⚛️', deskripsi: 'Komponen, JSX, props, dan children.' },
  { id: 10, folder: '10-react-state', judul: 'React State', ikon: '🔁', deskripsi: 'useState, event, form terkontrol, state array & object.' },
  { id: 11, folder: '11-react-list', judul: 'React List & Kondisional', ikon: '📋', deskripsi: 'map + key, render kondisional, dan useEffect.' },
  { id: 12, folder: '12-proyek-akhir', judul: 'Proyek Akhir: Portofolio', ikon: '🏆', deskripsi: 'Bangun web portofolio mini langkah demi langkah.' },
  { id: 13, folder: '13-backend-node', judul: 'Backend Node.js & API', ikon: '🔌', deskripsi: 'Node.js, npm, cara kerja HTTP, routing ala Express, REST API, middleware, sampai proyek kalkulator bisnis UMKM.' },
  // ---------- Arsitektur & Organisasi Komputer (Arsikom): pelajaran berupa bacaan + kuis (tipe 'teks') ----------
  { id: 14, folder: '14-arsikom-pengantar', awalan: 'Bab', nomor: 1, judul: 'Pengantar Arsikom & Kinerja', ikon: '🖥️', deskripsi: 'Arsitektur vs organisasi, sejarah, von Neumann vs Harvard, dan cara mengukur kinerja (CPI, Amdahl).' },
  { id: 15, folder: '15-arsikom-data', awalan: 'Bab', nomor: 2, judul: 'Representasi Data', ikon: '🔢', deskripsi: 'Sistem bilangan, konversi, bilangan bertanda (komplemen 2), karakter, dan urutan byte (endianness).' },
  { id: 16, folder: '16-arsikom-aritmetika', awalan: 'Bab', nomor: 3, judul: 'Aritmetika Komputer', ikon: '➕', deskripsi: 'Penjumlahan & overflow, operasi logika/geser, perkalian Booth, pembagian, dan floating point IEEE 754.' },
  { id: 17, folder: '17-arsikom-digital', awalan: 'Bab', nomor: 4, judul: 'Logika Digital', ikon: '🔌', deskripsi: 'Gerbang logika, aljabar Boolean, K-map, rangkaian kombinasional dan sekuensial, register & counter.' },
  { id: 18, folder: '18-arsikom-cpu', awalan: 'Bab', nomor: 5, judul: 'Struktur CPU & Siklus Instruksi', ikon: '🧠', deskripsi: 'Komponen CPU, register, bus, siklus fetch-decode-execute, dan interupsi.' },
  { id: 19, folder: '19-arsikom-instruksi', awalan: 'Bab', nomor: 6, judul: 'Set Instruksi & Pengalamatan', ikon: '📜', deskripsi: 'Format instruksi, jenis operasi, mode pengalamatan, CISC vs RISC, dan assembly dasar.' },
  { id: 20, folder: '20-arsikom-kontrol-pipeline', awalan: 'Bab', nomor: 7, judul: 'Unit Kontrol & Pipeline', ikon: '🚦', deskripsi: 'Hardwired vs microprogrammed, pipeline, hazard, prediksi cabang, superscalar & out-of-order.' },
  { id: 21, folder: '21-arsikom-memori', awalan: 'Bab', nomor: 8, judul: 'Memori & Cache', ikon: '💾', deskripsi: 'Hierarki memori, SRAM/DRAM, pemetaan cache, kebijakan tulis, AMAT, dan memori virtual.' },
  { id: 22, folder: '22-arsikom-io', awalan: 'Bab', nomor: 9, judul: 'I/O, Bus & Penyimpanan', ikon: '🔗', deskripsi: 'Interkoneksi bus, teknik I/O (polling, interupsi, DMA), HDD/SSD, dan RAID.' },
  { id: 23, folder: '23-arsikom-paralel', awalan: 'Bab', nomor: 10, judul: 'Paralelisme & Arsitektur Modern', ikon: '🚀', deskripsi: 'Taksonomi Flynn, multicore & koherensi cache, GPU, dan tren arsitektur modern.' },
];

/** Label nomor chapter untuk tampilan: "Chapter 3" (JavaScript) atau "Bab 3" (Arsikom). */
export const labelBab = (c) => `${c.awalan ?? 'Chapter'} ${c.nomor ?? c.id}`;
