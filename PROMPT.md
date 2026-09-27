# Prompt (versi yang sudah dirapikan)

Ini versi prompt awal yang sudah diperbaiki. Bagian yang tadinya ambigu sudah diberi keputusan teknis, jadi Claude Code tidak perlu menebak-nebak.

```text
Buatkan aku website latihan coding interaktif yang mirip Codédex, khusus untuk belajar JavaScript lalu React. Website ini hanya dijalankan di komputerku sendiri (localhost): tanpa deploy, tanpa login, dan tanpa backend.

## Tentang aku (penting untuk isi materi)
- Mahasiswa Teknik Informatika. Sudah mahir C dan Python (if/else, for, while, do-while, fungsi, array, struct/dict).
- Dari JavaScript aku baru tahu const dan let.
- Tujuan akhir: bisa membuat web portofolio sederhana dengan React.
- Semua teks UI dan materi ditulis dalam Bahasa Indonesia. Setiap konsep JS dibandingkan dengan C dan Python
  (contoh: "for...of di JS = for x in list di Python").

## Tampilan & alur (seperti Codédex)
- Halaman pelajaran dibagi dua kolom:
  - Kiri: materi (markdown), contoh kode, kotak "Tugas" berisi instruksi yang jelas.
  - Kanan: editor kode dengan syntax highlighting, tombol "Jalankan" (juga Ctrl+Enter), tab Console,
    tab Tes (✅/❌ per syarat), dan tab Preview untuk pelajaran DOM/React.
  - Di layar sempit, kedua kolom ditumpuk.
- Pelajaran dianggap selesai jika semua tes lolos. Setelah itu tombol "Lanjut" aktif.
  Pelajaran TIDAK dikunci; semua boleh dibuka, tapi pelajaran berikutnya yang disarankan ditandai.
- Tombol "Petunjuk" membuka hint satu per satu. Tombol "Lihat solusi" baru muncul setelah minimal 3 kali
  menekan "Jalankan" di pelajaran itu.
- Beranda: peta chapter, progress bar per chapter, total XP, streak harian, dan tombol "Lanjutkan belajar".
- Streak: bertambah 1 jika aku menyelesaikan minimal satu pelajaran pada hari berturut-turut; kembali ke 0
  jika ada hari yang terlewat.
- Progress, XP, jumlah percobaan, dan kode terakhir di tiap pelajaran disimpan di localStorage.
- Halaman Pengaturan: pilih tema (terang/gelap/ikuti sistem), reset progress (dengan konfirmasi).

## Stack teknis
- Vite + React + JavaScript (bukan TypeScript) + React Router.
- Editor: CodeMirror 6 lewat @uiw/react-codemirror (lebih ringan dari Monaco).
- Semua dependensi dari npm, jalan offline setelah `npm install`. Tanpa CDN, tanpa Sandpack online.
- Latihan JavaScript murni: dijalankan di Web Worker. console.log dan error ditangkap lalu ditampilkan.
  Jika belum selesai dalam ±3 detik, worker dimatikan (infinite loop tidak membuat tab macet).
- Latihan DOM dan React: dijalankan di iframe (preview). Karena iframe tidak bisa dimatikan seperti worker,
  kode user ditransformasi dulu dengan @babel/standalone (dari npm) untuk menyisipkan pengaman loop
  (loop yang berjalan > 2 detik dihentikan dengan pesan error).
- JSX dikompilasi dengan @babel/standalone. Kode React user boleh memakai `import { useState } from 'react'`
  dan `export default App` seperti proyek sungguhan. React 19 tidak punya build UMD, jadi React yang
  dipakai di iframe diambil dari bundle aplikasi (tetap dari node_modules lokal).
- Sistem tes:
  - Latihan JS: tes bisa membaca variabel/fungsi top-level buatan user dan isi console.
    Contoh: "tambah(2, 3) harus mengembalikan 5", "console harus mencetak 'Halo'".
  - Latihan DOM/React: tes memeriksa DOM hasil render dan boleh mensimulasikan klik/ketik.
    Contoh: "ada h1 berisi 'Halo'", "setelah tombol diklik 2 kali, teks jadi 2".
  - Pesan gagal ramah dan spesifik dalam Bahasa Indonesia, misalnya:
    "tambah(2, 3) mengembalikan '23', seharusnya 5. Apakah kamu menjumlahkan string?"

## Struktur konten
- Satu file JS per pelajaran: `src/lessons/<nn-nama-chapter>/<nn-nama-pelajaran>.js`, `export default { ... }`.
- Field: id, judul, tipe ('js' | 'dom' | 'react'), xp, materi (markdown), tugas (markdown), kodeAwal,
  tes[] ({ nama, cek(ctx) }), petunjuk[], solusi. Opsional: html (HTML awal untuk DOM), css.
- Daftar chapter (judul, deskripsi) di `src/lessons/chapters.js`. Urutan pelajaran mengikuti nama file.

Chapter (tiap chapter 4–8 pelajaran pendek, diakhiri satu mini proyek):
1. Dasar JS: console.log, komentar, const/let, tipe data, typeof, operator, === vs ==, konversi tipe, truthy/falsy
2. Percabangan & Loop: if/else if, ternary, switch, for, while, do-while, for...of, break/continue
3. String & Fungsi: template literal, method string, function declaration, arrow function, parameter default, callback
4. Array: push/pop/slice/includes, sort dengan pembanding, map, filter, find, reduce, forEach, referensi vs salinan
5. Object: dot/bracket, Object.keys/values/entries, array of object, JSON
6. JS Modern: destructuring, spread/rest, optional chaining, ??, short-circuit &&/||
7. DOM & Event: querySelector, textContent, classList, addEventListener, createElement (HTML awal per pelajaran)
8. Async: setTimeout, Promise, async/await, try/catch (fetch disimulasikan dengan fungsi mock supaya offline)
9. React Dasar: komponen & JSX, aturan JSX, props, children
10. React State: useState, onClick, onChange, form terkontrol, state array/object tanpa mutasi
11. React List & Kondisional: map + key, &&, ternary, useEffect sederhana
12. Proyek Akhir: web portofolio mini langkah demi langkah (Navbar, Hero, About, Skills dari array,
    ProjectCard dengan props, Contact form, toggle dark mode)

## Urutan pengerjaan
Kerjakan bertahap, dan pastikan `npm run dev` / `npm run build` jalan tanpa error di tiap tahap:
1. Setup proyek, layout, routing, beranda, penyimpanan progress.
2. Engine JS (editor, worker, console capture, tes) + 3 pelajaran Chapter 1.
3. Engine DOM/React (Babel, iframe preview, pengaman loop, tes DOM) + 2 pelajaran Chapter 9.
4. Lengkapi konten semua chapter.
5. Poles UI: animasi saat lulus, XP, streak, halaman pengaturan.

## Verifikasi
- Script `npm run check-lessons` (Node + jsdom) menjalankan setiap pelajaran dan memastikan:
  (a) solusi lolos semua tesnya sendiri, (b) kodeAwal TIDAK langsung lolos semua tes.
- README.md: cara menjalankan, struktur folder, cara menambah pelajaran, dan API tes (ctx).
```

## Apa yang diubah dari prompt awal

- Karakter `＠` (full-width) di `＠babel/standalone` diganti `@` biasa; versi aslinya akan membuat `npm install` gagal.
- Pilihan editor sudah ditetapkan: CodeMirror 6.
- Ada solusi untuk infinite loop di iframe. Timeout pada worker tidak berlaku untuk iframe, jadi ditambahkan pengaman loop lewat Babel.
- React 19 tidak lagi punya file UMD, jadi React untuk iframe diambil dari bundle aplikasi.
- Format file pelajaran dan API tes (`ctx`) sekarang dijelaskan dengan rinci.
- Aturan yang tadinya belum jelas sudah diputuskan: pelajaran tidak dikunci, arti "3 kali mencoba", dan cara menghitung streak.
- `check-lessons` sekarang juga memeriksa bahwa kode awal belum lolos semua tes, supaya tidak ada latihan yang "gratis".
