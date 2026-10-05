// Sintaks penting per chapter JavaScript → React → Backend, untuk "refresh ingatan" setelah belajar.
// Kunci = id chapter di chapters.js. Isinya hanya sintaks yang benar-benar muncul di materi chapter itu
// dan dipakai di kode profesional. Bentuk butir: [sintaks, fungsi, catatan (opsional)].
// `catatan` dipakai untuk jebakan atau kebiasaan di industri (mis. "pakai === bukan ==").
export const sintaksJs = {
  1: [
    {
      grup: 'Output & komentar',
      butir: [
        ['console.log(a, b)', 'Mencetak satu atau beberapa nilai ke Console (dipisah spasi, otomatis pindah baris).', 'Alat debug paling dasar di semua proyek JS.'],
        ['// satu baris   /* banyak baris */', 'Komentar. Sama dengan C; di Python memakai #.'],
      ],
    },
    {
      grup: 'Variabel & tipe data',
      butir: [
        ['const x = 1;', 'Variabel yang tidak bisa diganti nilainya (di-assign ulang).', 'Standar industri: pakai const dulu.'],
        ['let x = 1; x = 2;', 'Variabel yang boleh diubah. Dipakai untuk penghitung loop dan akumulator.', 'Hindari var (cara lama).'],
        ['typeof nilai', 'Mengecek tipe: "number", "string", "boolean", "undefined", "object", "function".', 'Jebakan: typeof null === "object".'],
        ['null  /  undefined', 'null = sengaja dikosongkan; undefined = belum diberi nilai.'],
        ['camelCase', 'Konvensi nama variabel & fungsi: nilaiAkhir, bukan nilai_akhir.'],
      ],
    },
    {
      grup: 'Operator',
      butir: [
        ['+  -  *  /  %  **', 'Tambah, kurang, kali, bagi (hasil desimal), sisa bagi, pangkat.'],
        ['+=  -=  *=  ++  --', 'Operator gabungan dan increment/decrement.'],
        ['Math.floor(7 / 2)', 'Pembagian bulat (padanan // di Python).'],
        ['Math.round / sqrt / max / abs', 'Fungsi matematika bawaan (setara math.h / modul math).'],
        ['===  !==', 'Sama / tidak sama ketat (nilai DAN tipe).', 'Selalu pakai === dan !==, hindari == yang melakukan konversi tipe diam-diam.'],
        ['<  >  <=  >=', 'Perbandingan. Python boleh 1 < x < 10, di JS tulis x > 1 && x < 10.'],
        ['&&   ||   !', 'AND, OR, NOT (Python: and, or, not).'],
      ],
    },
    {
      grup: 'Konversi tipe & truthy/falsy',
      butir: [
        ['Number("42")   parseInt("42px")   parseFloat("3.5kg")', 'String → angka. parseInt/parseFloat membaca angka di awal string.', 'Nilai dari input form selalu string: konversi dulu sebelum menghitung.'],
        ['String(42)', 'Angka → string.'],
        ['Number.isNaN(x)', 'Mengecek NaN. NaN === NaN itu false!'],
        ['Boolean(x)   !!x', 'Mengubah nilai apa pun menjadi true/false.'],
        ['Falsy: false, 0, "", null, undefined, NaN', 'Hanya 6 nilai ini yang falsy; [] dan {} itu truthy (beda dengan Python).', 'Cek array kosong dengan arr.length === 0.'],
        ['"2" + 3  →  "23"', '+ menggabung string jika salah satu operand string, sedangkan - * / selalu matematika.'],
      ],
    },
  ],

  2: [
    {
      grup: 'Percabangan',
      butir: [
        ['if (kondisi) { } else if (k2) { } else { }', 'Percabangan. Kondisi wajib dalam kurung ( ), blok dalam { } (Python: elif → else if).'],
        ['kondisi ? nilaiA : nilaiB', 'Ternary: memilih satu dari dua nilai dalam satu ekspresi.', 'Dipakai terus di JSX React, tempat if tidak bisa dipakai. Jangan ditumpuk lebih dari dua tingkat.'],
        ['switch (x) { case 1: ...; break; default: ... }', 'Memilih cabang berdasarkan nilai (dibandingkan dengan ===, boleh string).', 'Tanpa break eksekusi jatuh ke case berikutnya (fall-through).'],
      ],
    },
    {
      grup: 'Perulangan',
      butir: [
        ['for (let i = 0; i < n; i++) { }', 'Loop for klasik dengan penghitung (pakai let, bukan const).'],
        ['while (kondisi) { }', 'Ulangi selama kondisi true. Waspadai infinite loop.'],
        ['do { } while (kondisi);', 'Badan loop jalan minimal sekali, baru cek kondisi (Python tidak punya).'],
        ['for (const x of array) { }', 'Mengambil tiap elemen array (Python: for x in list).', 'Untuk array jangan pakai for...in; ia menghasilkan indeks sebagai string.'],
        ['break   continue', 'Keluar dari loop / lewati ke putaran berikutnya.'],
        ['let total = 0; ... total += i;', 'Pola akumulator: variabel penampung di luar loop.'],
        ['arr[0]   arr.length', 'Akses elemen dengan indeks dan jumlah elemen (properti, tanpa kurung).'],
        ['i % 3 === 0', 'Cek "habis dibagi" memakai modulo. Urutan if penting (cek kondisi paling spesifik dulu).'],
      ],
    },
  ],

  3: [
    {
      grup: 'String',
      butir: [
        ['`Halo ${nama}, ${a + b}`', 'Template literal (backtick): sisipkan variabel/ekspresi dengan ${ }, boleh multi-baris. Setara f-string Python.', 'Standar industri untuk menyusun string; hindari "a" + b + "c".'],
        ['s.length', 'Panjang string (properti, bukan fungsi).'],
        ['s.toUpperCase()  s.toLowerCase()  s.trim()', 'Ubah huruf besar/kecil, buang spasi di awal/akhir.'],
        ['s.includes("x")  s.startsWith("x")  s.indexOf("x")', 'Cek isi string; indexOf mengembalikan -1 jika tidak ada.'],
        ['s.slice(awal, akhir)   s.at(-1)', 'Memotong string; at(-1) = karakter terakhir (s[-1] hasilnya undefined).'],
        ['s.split(" ")   arr.join(" ")', 'Memecah string menjadi array dan sebaliknya.'],
        ['s.replaceAll("a", "o")', 'Ganti semua kemunculan (replace hanya yang pertama).'],
        ['s.toUpperCase();  // hasil dibuang', 'String itu immutable: method mengembalikan string baru. Simpan hasilnya, dan method bisa dirantai: s.trim().toUpperCase().'],
      ],
    },
    {
      grup: 'Fungsi',
      butir: [
        ['function nama(a, b) { return a + b; }', 'Deklarasi fungsi (hoisting: boleh dipanggil sebelum definisi).', 'Tanpa return, fungsi mengembalikan undefined. return ≠ console.log.'],
        ['const f = (a, b) => a + b;', 'Arrow function. Tanpa kurawal = langsung return.', 'Dipakai di mana-mana pada kode React (callback, event handler).'],
        ['(n) => ({ nama: n })', 'Arrow function yang mengembalikan object: bungkus object dengan ( ).', 'Jebakan: (x) => { x * 2 } mengembalikan undefined karena kurawal butuh return.'],
        ['function salam(nama = "Kawan") { }', 'Parameter default; dipakai bila argumen tidak diberikan / undefined.'],
        ['panggil(() => console.log("hai"))', 'Callback: kirim fungsi sebagai argumen. Kirim fungsinya, jangan memanggilnya: panggil(sapa), bukan panggil(sapa()).'],
        ['arr.push(x)', 'Menambah elemen di akhir array (dipakai pada mini proyek, dibahas penuh di chapter 4).'],
      ],
    },
  ],

  4: [
    {
      grup: 'Dasar array',
      butir: [
        ['const a = [1, "dua", true];', 'Array literal: campur tipe, ukuran bisa berubah (setara list Python).'],
        ['a[0]   a.at(-1)   a.length', 'Akses elemen, elemen terakhir, jumlah elemen. Indeks di luar batas = undefined, bukan error.'],
        ['a.push(x)   a.pop()', 'Tambah / ambil dari akhir.'],
        ['a.unshift(x)   a.shift()', 'Tambah / ambil dari awal (antrian).'],
        ['a.includes(x)   a.indexOf(x)', 'Cek keberadaan elemen / cari posisinya (-1 jika tidak ada).'],
        ['a.slice(awal, akhir)   a.slice(-n)', 'Potong menjadi array baru, tidak mengubah aslinya. (splice mengubah array asli.)'],
        ['a.join(", ")   a.concat(b)', 'Gabung jadi string / gabung dua array. Jangan pakai a + b.'],
      ],
    },
    {
      grup: 'Method fungsional (callback)',
      butir: [
        ['a.forEach((x, i) => { })', 'Lakukan sesuatu untuk tiap elemen; tidak mengembalikan apa-apa.'],
        ['a.map((x) => x * 2)', 'Ubah tiap elemen menjadi array baru (panjang sama).', 'Inti menampilkan daftar di React. Callback harus return.'],
        ['a.filter((x) => x > 7)', 'Ambil elemen yang lolos syarat menjadi array baru.'],
        ['a.find((x) => x.id === 3)   a.findIndex(...)', 'Elemen / indeks PERTAMA yang cocok (undefined / -1 jika tidak ada).'],
        ['a.some(...)   a.every(...)', 'Apakah ada minimal satu / semua elemen yang memenuhi syarat (Python: any / all).'],
        ['a.reduce((acc, x) => acc + x, 0)', 'Meringkas array menjadi satu nilai (jumlah, hitungan, object).', 'Selalu beri nilai awal (argumen ke-2).'],
        ['a.filter(...).map(...)', 'Chaining: rangkai method karena masing-masing mengembalikan array.'],
      ],
    },
    {
      grup: 'Mengurutkan & menyalin',
      butir: [
        ['a.sort((x, y) => x - y)', 'Urut angka naik (y - x untuk turun). Tanpa pembanding, sort() mengurutkan sebagai string.', 'sort() mengubah array asli.'],
        ['a.sort((x, y) => x.localeCompare(y))', 'Urut string A–Z yang aman untuk huruf besar/kecil & bahasa.'],
        ['[...a].sort(...)   a.toSorted(...)', 'Urutkan tanpa merusak array asli (salin dulu / cara modern).'],
        ['const b = [...a];   a.slice();   Array.from(a)', 'Membuat salinan. b = a hanya menyalin referensi.'],
        ['[...lama, baru]   lama.filter(...)   lama.map(...)', 'Cara tambah / hapus / ubah tanpa mengubah array lama (pola wajib di state React).'],
        ['(72.4567).toFixed(1)   Math.round(x * 10) / 10', 'Membulatkan desimal. toFixed menghasilkan STRING.'],
        ['Math.max(...a)', 'Nilai terbesar dari isi array memakai spread.'],
      ],
    },
  ],

  5: [
    {
      grup: 'Object dasar',
      butir: [
        ['const o = { nama: "Budi", ipk: 3.4 };', 'Object literal: pasangan kunci: nilai (gabungan struct C dan dict Python).'],
        ['o.nama   o["nama"]   o[kunci]', 'Akses properti. Bracket wajib bila nama kunci ada di variabel.'],
        ['o.baru = 1;   delete o.lama;', 'Tambah / ubah / hapus properti (properti yang tidak ada = undefined, bukan error). const hanya mengunci variabelnya.'],
        ['{ nama, umur }', 'Shorthand property: sama dengan { nama: nama, umur: umur }.'],
        ['{ sapa() { return this.nama; } }', 'Method di dalam object. this = object pemilik method.', 'Jangan pakai arrow function untuk method yang memakai this.'],
        ['"nama" in o', 'Cek apakah kunci ada.'],
      ],
    },
    {
      grup: 'Mengulang & mengubah object',
      butir: [
        ['Object.keys(o)   Object.values(o)', 'Array kunci / array nilai (panjang: Object.keys(o).length).'],
        ['Object.entries(o)', 'Array pasangan [kunci, nilai]; dipakai dengan for (const [k, v] of Object.entries(o)).'],
        ['Object.fromEntries(pasangan)', 'Kebalikan entries: bangun object dari array pasangan.'],
      ],
    },
    {
      grup: 'Array of object & JSON',
      butir: [
        ['[{ id: 1, nama: "A" }, { id: 2, nama: "B" }]', 'Array of object: bentuk data paling umum di aplikasi web.', 'Cukup map/filter/find/reduce dengan akses m.properti.'],
        ['data.map((m) => m.nama)', 'Mengambil satu "kolom" dari array of object.'],
        ['JSON.stringify(obj)   JSON.stringify(obj, null, 2)', 'Object → teks JSON (versi kedua dengan indentasi rapi).'],
        ['JSON.parse(teks)', 'Teks JSON → object.', 'Dipakai untuk localStorage dan data API. Kunci & string JSON wajib kutip dua.'],
        ['structuredClone(obj)', 'Salinan dalam (deep copy) cara modern.'],
        ['(65000).toLocaleString("id-ID")', 'Format angka sesuai lokal, mis. "65.000".'],
      ],
    },
  ],

  6: [
    {
      grup: 'Destructuring',
      butir: [
        ['const { nama, umur } = user;', 'Membongkar properti object ke variabel (nama variabel = nama properti).'],
        ['const { nama: n, hobi = "-" } = user;', 'Ganti nama variabel dan beri nilai default.'],
        ['const { profil: { email } } = data;', 'Destructuring bersarang.'],
        ['function Kartu({ nama, umur = 17 }) { }', 'Destructuring di parameter fungsi.', 'Pola standar menerima props di React.'],
        ['const [a, b] = arr;   const [, , c] = arr;', 'Destructuring array berdasarkan posisi (lewati dengan koma kosong).'],
        ['[x, y] = [y, x];', 'Menukar dua variabel tanpa variabel sementara.'],
        ['const [jumlah, setJumlah] = useState(0);', 'Pola yang akan sering terlihat di React (destructuring array dari hook).'],
      ],
    },
    {
      grup: 'Spread & rest (...)',
      butir: [
        ['[...a, ...b]   [...a]   [0, ...a, 99]', 'Spread array: gabung, salin, sisipkan.'],
        ['{ ...user, umur: 21 }', 'Spread object: salin + timpa properti (yang ditulis belakangan menang).', 'Inti update state di React: object/array baru, bukan mengubah yang lama. Spread hanya menyalin satu tingkat (shallow).'],
        ['{ ...user, alamat: { ...user.alamat, kota: "X" } }', 'Update properti bersarang dengan spread di tiap tingkat.'],
        ['function jumlah(...angka) { }', 'Rest parameter: kumpulkan sisa argumen jadi array (Python: *args). Harus paling akhir.'],
        ['const { password, ...aman } = user;', 'Rest di destructuring: ambil sebagian, kumpulkan sisanya (cara membuang properti tanpa mengubah aslinya).'],
        ['Math.max(...angka)', 'Spread saat memanggil fungsi.'],
      ],
    },
    {
      grup: 'Data tidak lengkap & short-circuit',
      butir: [
        ['user.alamat?.kota   arr?.[0]   obj.fn?.()', 'Optional chaining: berhenti aman dengan undefined jika bagian kiri null/undefined.', 'Wajib untuk data dari API yang tidak selalu lengkap.'],
        ['nilai ?? "cadangan"', 'Nullish coalescing: cadangan hanya jika null/undefined (0, "" dan false tetap dipakai).', 'Lebih aman daripada || untuk nilai default.'],
        ['a || b', 'Kembalikan a jika truthy, kalau tidak b. Dipakai untuk nilai default (jebakan: 0 dan "").'],
        ['a && b', 'Kembalikan a jika falsy, kalau tidak b. Bagian kanan tidak dievaluasi jika tak perlu.'],
        ['{jumlah > 0 && <p>...</p>}', 'Render kondisional di JSX. Pakai kondisi boolean: {jumlah && ...} saat jumlah 0 menampilkan angka 0.'],
        ['{ ...DEFAULT, ...user }', 'Menggabungkan pengaturan default dengan pengaturan user.'],
      ],
    },
  ],

  7: [
    {
      grup: 'Mencari & membaca elemen',
      butir: [
        ['document.querySelector("#id / .kelas / tag")', 'Ambil elemen PERTAMA yang cocok dengan selector CSS (null jika tidak ada).', 'Mengakses properti dari null = error, cek dulu.'],
        ['document.querySelectorAll(".item")', 'Ambil SEMUA yang cocok (mirip array: .length dan .forEach).'],
        ['el.textContent = "teks"', 'Baca / ubah teks elemen.', 'Aman untuk teks dari user. innerHTML dengan input user membuka celah XSS.'],
        ['input.value', 'Isi <input>. Selalu string.'],
        ['el.getAttribute("src")   el.setAttribute("href", url)   el.disabled = true', 'Baca / ubah atribut HTML.'],
      ],
    },
    {
      grup: 'Mengubah tampilan & struktur',
      butir: [
        ['el.classList.add / remove / toggle / contains("kelas")', 'Mengatur class CSS (cara yang disarankan mengubah tampilan).'],
        ['el.style.backgroundColor = "yellow"', 'Ubah CSS langsung (properti camelCase), hanya untuk nilai dinamis.'],
        ['document.createElement("li")', 'Membuat elemen baru (belum tampil sampai dipasang).'],
        ['parent.append(el)   parent.prepend(el)   el.remove()', 'Memasang di akhir / awal, dan menghapus elemen.'],
        ['wadah.innerHTML = ""', 'Mengosongkan isi wadah sebelum menggambar ulang dari data.'],
      ],
    },
    {
      grup: 'Event',
      butir: [
        ['el.addEventListener("click", (e) => { })', 'Menjalankan callback setiap kali event terjadi (click, input, change, submit, ...).'],
        ['e.target', 'Elemen yang memicu event. e.target.value = isi input.'],
        ['form.addEventListener("submit", (e) => { e.preventDefault(); })', 'Mencegah form me-reload halaman, lalu proses data lewat JS.'],
        ['e.stopPropagation()', 'Menghentikan event "menggelembung" ke elemen induk (mis. tombol hapus di dalam <li>).'],
        ['function render() { wadah.innerHTML = ""; data.forEach(...) }', 'Pola data → tampilan: ubah array, lalu gambar ulang semuanya. Inilah yang diotomatisasi React.'],
      ],
    },
  ],

  8: [
    {
      grup: 'Menjadwalkan kode',
      butir: [
        ['setTimeout(() => { }, 1000)', 'Jalankan callback SEKALI setelah N milidetik tanpa memblokir kode lain (JS single-thread, ada event loop).'],
        ['const id = setInterval(fn, 1000);  clearInterval(id)', 'Jalankan berulang; wajib dihentikan dengan clearInterval. clearTimeout(id) membatalkan setTimeout.'],
      ],
    },
    {
      grup: 'Promise',
      butir: [
        ['fetch(url).then((res) => res.json()).then((data) => { }).catch((err) => { })', 'Rantai Promise: then dijalankan saat sukses (nilai return diteruskan), catch menangkap error di mana pun dalam rantai.'],
        ['res.json()', 'Mengubah isi respons menjadi data JS (juga Promise).'],
        ['new Promise((resolve, reject) => { ... })', 'Membungkus pekerjaan yang butuh waktu. resolve(nilai) = sukses, reject(new Error("...")) = gagal.', 'Selalu reject dengan new Error(...), bukan string.'],
        ['const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));', '"sleep" versi JavaScript.'],
        ['Promise.all([p1, p2, p3])', 'Jalankan beberapa Promise bersamaan, hasil array berurutan; gagal jika salah satu gagal.', 'Gunakan untuk request yang tidak saling bergantung (lebih cepat daripada await berurutan).'],
        ['await Promise.all(arr.map((k) => ambil(k)))', 'Pola paralel yang umum: map membuat array Promise lalu Promise.all menunggunya.'],
      ],
    },
    {
      grup: 'async / await & error handling',
      butir: [
        ['async function f() { const x = await janji; return x; }', 'Menulis kode asinkron seperti kode biasa. await hanya di dalam fungsi async; fungsi async selalu mengembalikan Promise.', 'Standar industri menggantikan rantai .then().'],
        ['try { } catch (e) { e.message } finally { }', 'Menangani error (Python: try/except/finally). Promise yang di-await dan reject menjadi exception.'],
        ['throw new Error("pesan")', 'Melempar error (Python: raise).'],
        ['if (!res.ok) throw new Error(`Server ${res.status}`);', 'fetch TIDAK reject untuk 404/500; cek res.ok sendiri.', 'Wajib di setiap pemanggilan fetch di kode produksi.'],
        ['`/api/cuaca?kota=${k}`', 'Menyusun URL dengan query string memakai template literal.'],
      ],
    },
  ],

  9: [
    {
      grup: 'Komponen & JSX',
      butir: [
        ['function App() { return <h1>Halo</h1>; }', 'Komponen = fungsi yang mengembalikan JSX. Nama WAJIB diawali huruf kapital.'],
        ['export default App;   import App from "./App"', 'Mengekspor / mengimpor komponen utama sebuah file (satu komponen per file di proyek nyata).'],
        ['return ( <div>...</div> );', 'Bungkus JSX multi-baris dengan kurung ( ).'],
        ['<>...</>', 'Fragment: pembungkus tanpa menambah elemen DOM (JSX hanya boleh mengembalikan satu elemen akar).'],
        ['className="kartu"', 'Atribut class di JSX ditulis className (class adalah kata kunci JS).'],
        ['<img src="x" />  <br />  <input />', 'Semua tag wajib ditutup (self-closing).'],
        ['{ekspresi}', 'Menyisipkan JavaScript di dalam JSX: {nama}, {2025 - lahir}, {nama.toUpperCase()}.'],
        ['{/* komentar */}', 'Komentar di dalam JSX.'],
        ['<Header />  <Footer />', 'Menyusun komponen seperti tag HTML (komposisi). Huruf kapital = komponen, huruf kecil = tag HTML.'],
      ],
    },
    {
      grup: 'Props & children',
      butir: [
        ['<Sapaan nama="Budi" umur={20} aktif={true} />', 'Mengirim props. String boleh dikutip, nilai lain (angka, boolean, array, object, fungsi) pakai { }.'],
        ['function Sapaan({ nama, umur = 17 }) { }', 'Menerima props dengan destructuring + nilai default.', 'Gaya standar industri; props bersifat read-only.'],
        ['function Kartu({ judul, children }) { return <div>{children}</div>; }', 'children = isi di antara tag pembuka dan penutup; dasar komponen wrapper/layout (Card, Modal, Section).'],
        ['<div className={jenis === "x" ? "kartu a" : "kartu"}>', 'className dinamis dengan ternary di dalam { }.'],
        ['<Kartu {...p} />', 'Spread props: kirim semua properti object sebagai props.'],
      ],
    },
  ],

  10: [
    {
      grup: 'useState',
      butir: [
        ['import { useState } from "react";', 'Mengimpor hook state.'],
        ['const [nilai, setNilai] = useState(awal);', 'Membuat state: nilai sekarang + fungsi pengubah. Memanggil setter memicu render ulang.', 'Jangan ubah langsung (jumlah++); selalu lewat setter.'],
        ['setNilai((lama) => lama + 1)', 'Updater function: pakai bila nilai baru bergantung pada nilai lama (selalu dapat nilai terbaru).'],
        ['setTerbuka(!terbuka)   setTerbuka((t) => !t)', 'Toggle state boolean.'],
        ['Hooks hanya di level teratas komponen', 'Aturan Hooks: jangan memanggil useState/useEffect di dalam if, loop, atau fungsi bersarang.'],
        ['const jumlahKarakter = teks.length;', 'Derived state: nilai yang bisa dihitung dari state lain cukup berupa variabel biasa, bukan state baru.'],
      ],
    },
    {
      grup: 'Event & form',
      butir: [
        ['onClick={() => setJumlah(jumlah + 1)}', 'Event handler di React: camelCase (onClick, onChange, onSubmit) dan menerima FUNGSI.', 'Jebakan: onClick={setJumlah(0)} dipanggil saat render → loop tak terbatas.'],
        ['<input value={nama} onChange={(e) => setNama(e.target.value)} />', 'Input terkontrol: tampilan input selalu mengikuti state. value tanpa onChange = input tidak bisa diketik.'],
        ['<input type="checkbox" checked={x} onChange={(e) => setX(e.target.checked)} />', 'Checkbox terkontrol memakai checked, bukan value.'],
        ['<form onSubmit={handleSubmit}>  e.preventDefault()', 'Tangani submit di form (bukan onClick tombol) supaya Enter berfungsi; preventDefault mencegah reload.'],
        ['<button type="submit" disabled={!valid}>', 'Menonaktifkan tombol berdasarkan validasi turunan.'],
        ['{pesan && <p>{pesan}</p>}', 'Menampilkan pesan hasil submit dari state.'],
      ],
    },
    {
      grup: 'State array & object (tanpa mutasi)',
      butir: [
        ['setList([...list, item])', 'Tambah ke state array tanpa mutasi.'],
        ['setList(list.filter((x) => x.id !== id))', 'Hapus dari state array.'],
        ['setList(list.map((x) => (x.id === id ? { ...x, selesai: !x.selesai } : x)))', 'Ubah satu item (immutable update).', 'Jangan pakai push/splice/sort langsung pada state: referensi sama = React tidak render ulang.'],
        ['setProfil({ ...profil, nama: "Budi" })', 'Update state object dengan spread (tanpa ...profil, properti lain hilang).'],
        ['const { name, value } = e.target; setForm({ ...form, [name]: value });', 'Satu handler untuk banyak input memakai atribut name + computed property [name].'],
        ['{ id: Date.now(), teks, selesai: false }', 'Membuat id unik sederhana untuk item baru.'],
      ],
    },
  ],

  11: [
    {
      grup: 'List & key',
      butir: [
        ['{data.map((p) => ( <li key={p.id}>{p.judul}</li> ))}', 'Menampilkan array sebagai daftar elemen. Setiap item wajib punya key yang unik & stabil.', 'Pakai id dari data; hindari key={index} jika urutan bisa berubah.'],
        ['<KartuProyek key={p.id} {...p} />', 'Map ke komponen sendiri + spread props.'],
        ['data.filter((i) => i.nama.toLowerCase().includes(k.toLowerCase()))', 'Pencarian tak peka huruf besar/kecil; hasil filter dihitung dari state, bukan disimpan sebagai state.'],
        ['[...data].sort(...)', 'Urutkan salinan sebelum ditampilkan (jangan mengurutkan state langsung).'],
      ],
    },
    {
      grup: 'Render kondisional',
      butir: [
        ['{kondisi && <Elemen />}', 'Tampil hanya jika true.', 'Jebakan angka 0: pakai {arr.length > 0 && ...}.'],
        ['{isLogin ? <Profil /> : <Login />}', 'Memilih salah satu tampilan.'],
        ['if (items.length === 0) return <p>Kosong</p>;', 'Early return: tampilan berbeda sama sekali; if hanya bisa di luar JSX.'],
        ['if (!pesan) return null;', 'Komponen yang tidak menampilkan apa-apa.'],
        ['const LABEL = { selesai: "✅" }; {LABEL[status] ?? "?"}', 'Object sebagai tabel pencarian pengganti switch/ternary bertumpuk.'],
      ],
    },
    {
      grup: 'useEffect & komunikasi komponen',
      butir: [
        ['useEffect(() => { ... }, [a, b])', 'Efek samping setelah render, dijalankan ulang saat a atau b berubah. [] = sekali saja; tanpa array = setiap render.', 'Untuk fetch data, timer, document.title, localStorage.'],
        ['useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, [jalan])', 'Cleanup: kembalikan fungsi untuk menghentikan timer/listener.', 'Gunakan updater function (setX((d) => d + 1)) di dalam interval.'],
        ['<Kontak data={k} onToggleFavorit={toggle} />', 'Mengirim fungsi sebagai props; anak memanggilnya untuk memberi tahu induk. Konvensi nama onSesuatu.'],
      ],
    },
  ],

  12: [
    {
      grup: 'Pola yang dirangkum dari proyek portofolio',
      butir: [
        ['const menu = [{ href: "#about", label: "Tentang" }];  {menu.map((m) => <li key={m.href}>...</li>)}', 'Menu/daftar dari array of object: menambah item cukup menambah data.'],
        ['{Object.entries(info).map(([kunci, nilai]) => <li key={kunci}>...</li>)}', 'Menampilkan object di JSX lewat Object.entries + destructuring.'],
        ['"★".repeat(n) + "☆".repeat(5 - n)', 'String.repeat: membuat rating bintang.'],
        ['<a href={link} target="_blank" rel="noreferrer">', 'Link ke luar yang aman (rel="noreferrer" mencegah akses ke jendela asal).'],
        ['const [kategori, setKategori] = useState("Semua");', 'Letakkan state sedekat mungkin dengan tempat dipakai (mis. filter di dalam Skills).'],
        ['<Navbar gelap={gelap} onToggleTema={() => setGelap(!gelap)} />', 'Lifting state up: state di induk, nilai + fungsi pengubah diteruskan ke anak lewat props.', 'Data mengalir ke bawah (props), kejadian naik ke atas (callback).'],
        ['<div className={gelap ? "halaman gelap" : "halaman"}>', 'Tema/gaya dinamis lewat class.'],
        ['const valid = form.nama.trim() !== "" && form.email.includes("@")', 'Validasi form sebagai nilai turunan.'],
        ['new Date().getFullYear()', 'Tahun otomatis untuk footer.'],
        ['npm create vite@latest nama -- --template react', 'Membuat proyek React sungguhan dengan Vite.'],
        ['npm install   npm run dev   npm run build', 'Pasang dependensi, jalankan server dev, dan build untuk produksi (deploy ke Vercel/Netlify/GitHub Pages).'],
      ],
    },
  ],

  13: [
    {
      grup: 'Node.js & npm',
      butir: [
        ['node app.js', 'Menjalankan file JavaScript di Node.js (di luar browser; tidak ada window/document).'],
        ['npm install   npm install express', 'Memasang semua paket di package.json / memasang satu paket dan mencatatnya di dependencies.'],
        ['package.json  →  "dependencies": { "express": "^4.18.0" }', 'Identitas proyek + daftar paket (setara requirements.txt).'],
        ['import express from "express";   export function tambah() { }', 'ES Modules (gaya modern, memerlukan "type": "module").'],
        ['const express = require("express");   module.exports = { tambah };', 'CommonJS (gaya lama; masih banyak ditemui di proyek lama).'],
      ],
    },
    {
      grup: 'HTTP & status code',
      butir: [
        ['GET   POST   PUT / PATCH   DELETE', 'Method HTTP: ambil, buat, ubah, hapus data.'],
        ['200 OK   201 Created', 'Status sukses (201 untuk data baru yang berhasil dibuat).'],
        ['400 Bad Request   401 Unauthorized   404 Not Found', 'Kesalahan di sisi pengirim: data tidak valid, belum login, tidak ditemukan.'],
        ['500 Internal Server Error', 'Kesalahan di sisi server.'],
        ['res.status(404).json({ pesan: "Tidak ditemukan" })', 'Mengirim status + body JSON dari server.'],
      ],
    },
    {
      grup: 'Express: routing, input, middleware',
      butir: [
        ['const app = express();   app.listen(3000);', 'Membuat aplikasi Express dan menjalankannya di port 3000.'],
        ['app.get("/produk", (req, res) => { res.json(data); })', 'Mendaftarkan route (method + path) dan handler-nya.'],
        ['app.get("/produk/:id", ...)   req.params.id', 'Route param: bagian path yang berubah-ubah.'],
        ['req.query   (GET /produk?kota=Bandung&limit=5)', 'Query string menjadi object { kota, limit }.', 'req.params dan req.query SELALU string; ubah dengan Number(...).'],
        ['decodeURIComponent("Toko%20Maju")', 'Mengubah karakter ter-encode di URL kembali menjadi teks.'],
        ['req.body', 'Isi request (JSON) pada POST/PUT.'],
        ['app.post("/produk", cekLogin, (req, res) => { })', 'Middleware: fungsi yang jalan sebelum handler utama.'],
        ['function cekLogin(req, res, next) { if (!ok) return res.status(401).json({ ... }); next(); }', 'Middleware memanggil next() untuk lanjut atau menjawab sendiri untuk berhenti.', 'Jangan pernah percaya input client: validasi lalu balas 400 bila salah.'],
      ],
    },
    {
      grup: 'REST & CRUD',
      butir: [
        ['GET /produk · GET /produk/:id · POST /produk · PUT/PATCH /produk/:id · DELETE /produk/:id', 'REST: resource sebagai path, HTTP method sebagai aksi (CRUD: Create, Read, Update, Delete).'],
        ['[...arr, baru]   arr.filter(...)   arr.map(...)', 'Fungsi CRUD yang tidak memutasi data asli (mengembalikan array/object baru).'],
        ['Math.ceil(biayaTetap / (harga - variabel))', 'Pembulatan ke atas untuk unit (mis. BEP).'],
        ['return { status: 400, body: { error: "..." } }', 'Pola handler murni: kembalikan status + body agar mudah diuji.'],
      ],
    },
  ],
};
