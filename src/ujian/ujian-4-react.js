import { baris, kode, output, pg, pgk } from './_bersama/buat.js';

export default {
  id: 'ujian-4-react',
  judul: 'Ujian 4: React',
  ikon: '📝',
  deskripsi: 'Komponen & JSX, props, state, form terkontrol, list, render kondisional, dan useEffect.',
  chapterIds: [9, 10, 11],
  setelahChapter: 11,
  lulus: 70,
  xp: 150,
  komposisi: { 'pilihan-ganda': 8, 'prediksi-output': 2, kode: 2 },
  soal: [
    // ---------- Chapter 9: React Dasar ----------
    pg('u4-01', 9, 'Manakah aturan yang benar tentang **nama komponen** React?',
      ['Harus diawali huruf kapital, misalnya `Kartu`', 'Harus diawali huruf kecil, misalnya `kartu`', 'Harus diakhiri kata "Component"', 'Boleh diawali huruf apa saja'], 0,
      'React membedakan komponen buatanmu dari tag HTML lewat huruf kapital. `<kartu />` dianggap tag HTML biasa, sedangkan `<Kartu />` dipanggil sebagai komponen.', 'react-komposisi'),
    pg('u4-02', 9, baris('Mengapa kode berikut error?', '', '~~~jsx', 'return (', '  <h1>Judul</h1>', '  <p>Isi</p>', ');', '~~~'),
      ['JSX harus memiliki satu elemen pembungkus (mis. `<div>` atau `<>...</>`)', 'Tag `<h1>` tidak boleh dipakai di JSX', 'Kurung `( )` tidak boleh dipakai setelah return', 'Teks di dalam JSX harus diberi tanda kutip'], 0,
      'Sebuah fungsi hanya bisa me-return satu nilai. Bungkus elemen-elemen itu dengan satu `<div>` atau Fragment `<>...</>`.', 'react-aturan-jsx'),
    pgk('u4-03', 9, 'Bagaimana menulis atribut `class` HTML di dalam JSX?', ['class', 'className', 'cssClass', 'klass'], 1,
      '`class` adalah kata kunci JavaScript, jadi di JSX ditulis `className`.', 'react-aturan-jsx'),
    pg('u4-04', 9, 'Apa fungsi kurung kurawal `{ }` di dalam JSX, misalnya `<h1>{nama}</h1>`?',
      ['Menyisipkan ekspresi JavaScript ke dalam tampilan', 'Membuat sebuah object baru', 'Menandai komentar', 'Membuat blok kode sebuah fungsi'], 0,
      'Kurung kurawal membuka "jendela" ke JavaScript: isinya berupa ekspresi (variabel, perhitungan, pemanggilan fungsi, ternary, dll.).', 'react-aturan-jsx'),
    pgk('u4-05', 9, 'Bagaimana cara yang benar mengirim **angka** 20 sebagai prop `umur`?',
      ['<Sapaan umur={20} />', '<Sapaan umur="20" />', '<Sapaan umur=20 />', '<Sapaan umur:20 />'], 0,
      '`umur="20"` mengirim **string**. Nilai selain string (angka, boolean, array, object, fungsi) ditulis di dalam `{ }`.', 'react-props'),
    pg('u4-06', 9, 'Bagaimana sifat **props** bagi komponen yang menerimanya?',
      ['Read-only: komponen tidak boleh mengubah props-nya sendiri', 'Boleh diubah bebas di dalam komponen', 'Hanya bisa berupa string', 'Hanya bisa dikirim ke satu komponen'], 0,
      'Props adalah masukan dari komponen induk. Data yang berubah-ubah di dalam komponen disimpan sebagai **state**.', 'react-props'),
    pg('u4-07', 9, 'Apa itu `children` pada komponen React?',
      ['Isi yang ditulis di antara tag pembuka dan tag penutup komponen', 'Daftar komponen anak yang dibuat otomatis oleh React', 'Prop khusus yang berisi jumlah elemen', 'Fungsi untuk membuat komponen baru'], 0,
      'Pada `<Kartu>isi</Kartu>`, teks `isi` dikirim ke `Kartu` sebagai prop `children`, dan bisa ditampilkan dengan `{children}`.', 'react-children'),
    pg('u4-08', 9, 'Mengapa `<img src="foto.png">` (tanpa penutup) menyebabkan error di JSX?',
      ['Semua tag di JSX harus ditutup, misalnya `<img src="foto.png" />`', 'Atribut `src` tidak boleh dipakai di JSX', 'Tag `<img>` tidak didukung React', 'Nama file gambar harus diberi kurung kurawal'], 0,
      'Berbeda dengan HTML, JSX mewajibkan setiap tag ditutup. Tag yang tidak punya isi ditulis self-closing dengan `/>`.', 'react-aturan-jsx'),

    // ---------- Chapter 10: React State ----------
    pg('u4-09', 10, baris('Mengapa tampilan **tidak** ikut berubah ketika tombol diklik?', '', '~~~jsx', 'function Counter() {', '  let jumlah = 0;', '  return <button onClick={() => { jumlah++; }}>{jumlah}</button>;', '}', '~~~'),
      ['React tidak tahu variabel itu berubah; nilainya harus disimpan dengan `useState`', 'Karena `let` tidak boleh dipakai di dalam komponen', 'Karena `onClick` hanya bisa dipakai pada `<div>`', 'Karena `jumlah++` tidak valid di JavaScript'], 0,
      'Variabel biasa tidak memicu render ulang, dan nilainya juga kembali ke 0 setiap komponen dijalankan ulang. `useState` menyimpan nilai antar-render dan memberi tahu React saat berubah.', 'react-usestate'),
    pg('u4-10', 10, 'Apa yang dikembalikan oleh `useState(0)`?',
      ['Sebuah array berisi [nilai sekarang, fungsi pengubah]', 'Hanya nilai awalnya, yaitu 0', 'Sebuah object `{ nilai, ubah }`', 'Sebuah Promise'], 0,
      '`const [jumlah, setJumlah] = useState(0)` memakai destructuring array untuk mengambil kedua elemen yang dikembalikan.', 'react-usestate'),
    pgk('u4-11', 10, 'Manakah cara yang **benar** menambahkan `item` ke state array `daftar`?',
      ['setDaftar([...daftar, item])', 'daftar.push(item)', 'setDaftar(daftar.push(item))', 'daftar = [...daftar, item]'], 0,
      'State tidak boleh diubah langsung. Buat array **baru** (dengan spread) lalu berikan ke setter, supaya React mengenali perubahannya.', 'react-state-array'),
    pg('u4-12', 10, 'Apa masalah pada `<button onClick={setJumlah(0)}>Reset</button>`?',
      ['`setJumlah(0)` langsung dipanggil saat render, bukan saat diklik, sehingga terjadi render berulang', 'Tombol tidak bisa diklik', '`onClick` harus ditulis dengan huruf kecil semua', 'Tidak ada masalah, kode itu benar'], 0,
      'Yang harus diberikan ke `onClick` adalah **fungsi**: `onClick={() => setJumlah(0)}`. Dengan kurung, fungsi dipanggil saat render dan memicu "Too many re-renders".', 'react-usestate'),
    pg('u4-13', 10, 'Apa yang dimaksud **input terkontrol** (controlled input) di React?',
      ['Input yang nilainya (`value`) disimpan di state dan diperbarui lewat `onChange`', 'Input yang hanya bisa diisi oleh administrator', 'Input yang tidak boleh diketik user', 'Input yang otomatis divalidasi oleh browser'], 0,
      'Dengan `value={teks}` dan `onChange={(e) => setTeks(e.target.value)}`, state menjadi satu-satunya sumber kebenaran isi input.', 'react-onchange-input'),
    pg('u4-14', 10, baris('State `profil` berisi `{ nama, kota, bio }`. Mengapa harus menulis `setProfil({ ...profil, nama: "Budi" })`, dan bukan `setProfil({ nama: "Budi" })`?'),
      ['`setProfil` **mengganti** seluruh object, jadi tanpa spread properti `kota` dan `bio` akan hilang', 'Karena spread membuat kode lebih cepat berjalan', 'Karena `nama` tidak boleh ditulis tanpa spread', 'Tidak ada bedanya'], 0,
      'Setter state menggantikan nilai lama secara utuh (tidak menggabungkan otomatis seperti object update di Python). Spread menyalin properti lama dulu, baru menimpa yang berubah.', 'react-state-object'),
    pg('u4-15', 10, 'Untuk apa `e.preventDefault()` di dalam handler `onSubmit` pada sebuah form React?',
      ['Mencegah browser memuat ulang halaman saat form dikirim', 'Menghapus semua state', 'Menonaktifkan tombol submit', 'Mengirim form ke server'], 0,
      'Perilaku bawaan submit adalah me-reload halaman, yang akan menghapus seluruh state. `preventDefault()` membatalkannya.', 'react-form-terkontrol'),

    // ---------- Chapter 11: React List & Kondisional ----------
    pg('u4-16', 11, 'Apa fungsi prop `key` pada elemen hasil `map`?',
      ['Membantu React mengenali elemen mana yang ditambah, dihapus, atau berpindah', 'Mengatur urutan tampil elemen', 'Memberi nama class CSS otomatis', 'Mengunci elemen agar tidak bisa diubah'], 0,
      '`key` adalah identitas setiap item dalam daftar. Ia harus **unik** di antara saudaranya dan **stabil** (tidak berubah antar-render).', 'react-map-key'),
    pg('u4-17', 11, 'Mengapa `key={index}` kurang baik untuk daftar yang itemnya bisa dihapus atau diurutkan ulang?',
      ['Indeks bergeser saat urutan berubah, sehingga React bisa salah mengenali item', 'Indeks tidak boleh berupa angka', 'Indeks membuat komponen tidak bisa di-render', 'Karena `index` adalah kata kunci JavaScript'], 0,
      'Jika item dihapus atau dipindah, indeks item lain ikut berubah. React lalu bisa mempertahankan state/tampilan pada item yang salah. Pakai id dari data.', 'react-map-key'),
    pg('u4-18', 11, 'Apa masalah pada `{jumlah && <p>Ada {jumlah} pesan</p>}` ketika `jumlah` bernilai `0`?',
      ['React menampilkan angka 0 di layar', 'Terjadi error', 'Paragraf tetap tampil', 'Tidak ada masalah'], 0,
      '`0 && x` menghasilkan `0`, dan React menampilkan angka `0` (berbeda dengan `false`/`null` yang tidak tampil). Gunakan kondisi boolean: `jumlah > 0 && ...`.', 'react-render-kondisional'),
    pg('u4-19', 11, 'Kapan efek pada `useEffect(() => { ... }, [])` dijalankan?',
      ['Sekali saja, setelah render pertama', 'Setiap kali komponen di-render', 'Hanya saat komponen dihapus', 'Tidak pernah dijalankan'], 0,
      'Dependency array kosong `[]` berarti efek tidak bergantung pada apa pun, sehingga dijalankan sekali setelah render pertama.', 'react-useeffect'),
    pg('u4-20', 11, 'Untuk apa fungsi yang di-**return** di dalam `useEffect` (misalnya `return () => clearInterval(id)`)?',
      ['Cleanup: dijalankan sebelum efek diulang atau saat komponen dilepas', 'Menentukan nilai yang ditampilkan komponen', 'Membatalkan render berikutnya', 'Mengulang efek setiap detik'], 0,
      'Fungsi cleanup membersihkan hal yang dimulai efek (timer, listener), supaya tidak menumpuk atau bocor.', 'react-useeffect'),
    pg('u4-21', 10, 'Manakah pernyataan yang benar tentang aturan **hooks** seperti `useState` dan `useEffect`?',
      ['Hanya boleh dipanggil di level teratas komponen, bukan di dalam if atau loop', 'Boleh dipanggil di mana saja, termasuk di dalam loop', 'Hanya boleh dipanggil di dalam event handler', 'Harus dipanggil setelah `return`'], 0,
      'React mengandalkan urutan pemanggilan hooks yang sama di setiap render, sehingga hooks tidak boleh berada di dalam kondisi atau perulangan.', 'react-usestate'),

    // ---------- Prediksi output (logika JavaScript di balik React) ----------
    output('u4-o1', 10,
      baris(
        'const todos = [{ id: 1, selesai: false }, { id: 2, selesai: false }];',
        'const baru = todos.map((t) => (t.id === 1 ? { ...t, selesai: true } : t));',
        'console.log(todos[0].selesai, baru[0].selesai);',
        'console.log(todos[1] === baru[1]);',
      ),
      baris('false true', 'true'),
      'Update tanpa mutasi: item yang berubah diganti object **baru** (`{ ...t, selesai: true }`) sehingga `todos` asli tetap `false`. Item yang tidak berubah dipakai ulang apa adanya, jadi `todos[1] === baru[1]`.', 'react-state-array'),
    output('u4-o2', 11,
      baris('const pesan = [];', 'console.log(pesan.length && "Ada pesan");', 'console.log(pesan.length > 0 && "Ada pesan");', 'console.log(pesan.length ? "Ada" : "Kosong");'),
      baris('0', 'false', 'Kosong'),
      '`0 && ...` menghasilkan `0`: inilah asal muasal angka 0 yang "nyasar" di layar React. Kondisi boolean `> 0` menghasilkan `false` (tidak ditampilkan), dan ternary memilih "Kosong".', 'react-render-kondisional'),
    output('u4-o3', 11,
      baris(
        'const tugas = [',
        '  { id: 1, judul: "Belajar", selesai: true },',
        '  { id: 2, judul: "Ngoding", selesai: false },',
        '  { id: 3, judul: "Tidur", selesai: false },',
        '];',
        'const tampil = tugas.filter((t) => !t.selesai).map((t) => t.judul.toUpperCase());',
        'console.log(tampil);',
        'console.log(tampil.length);',
      ),
      baris("['NGODING', 'TIDUR']", '2'),
      '`filter` menyaring tugas yang belum selesai, lalu `map` mengubah judulnya menjadi huruf kapital. Pola `filter().map()` inilah yang dipakai untuk menampilkan daftar di React.', 'react-filter-pencarian'),
    output('u4-o4', 9,
      baris(
        'function Salam({ nama, waktu = "pagi" }) {',
        '  return "Selamat " + waktu + ", " + nama;',
        '}',
        'console.log(Salam({ nama: "Budi" }));',
        'console.log(Salam({ nama: "Sinta", waktu: "malam" }));',
      ),
      baris('Selamat pagi, Budi', 'Selamat malam, Sinta'),
      'Komponen hanyalah fungsi yang menerima satu object props. Destructuring dengan nilai default (`waktu = "pagi"`) dipakai saat prop tidak dikirim.', 'react-props'),

    // ---------- Menulis kode ----------
    kode('u4-k1', 9, {
      jenis: 'react',
      pelajaran: 'react-props',
      css: '.lencana { display: inline-block; padding: 2px 10px; border-radius: 999px; margin: 2px; color: white; font-size: 14px; }\n.biru { background: #2f6bff; }\n.merah { background: #d93f5c; }',
      tugas: baris(
        'Buat komponen **`Lencana({ teks, warna })`** yang menampilkan:',
        '',
        '~~~html',
        '<span class="lencana biru">Baru</span>',
        '~~~',
        '',
        '- class pertama selalu `lencana`, class kedua adalah nilai prop `warna`',
        '- prop `warna` **default**-nya `"biru"`',
        '',
        'Lalu di `App`, tampilkan dua lencana: **`Baru`** (warna default) dan **`Diskon`** dengan warna `"merah"`.',
      ),
      kodeAwal: 'function App() {\n  return <div></div>;\n}\n\nexport default App;\n',
      solusi: baris(
        'function Lencana({ teks, warna = "biru" }) {',
        '  return <span className={"lencana " + warna}>{teks}</span>;',
        '}',
        '',
        'function App() {',
        '  return (',
        '    <div>',
        '      <Lencana teks="Baru" />',
        '      <Lencana teks="Diskon" warna="merah" />',
        '    </div>',
        '  );',
        '}',
        '',
        'export default App;',
        '',
      ),
      penjelasan: 'Prop `warna` diberi nilai default lewat destructuring (`warna = "biru"`), lalu dipakai untuk menyusun `className`.',
      tes: [
        {
          nama: 'Lencana',
          cek(ctx) {
            const l = ctx.cariSemua('span.lencana');
            if (l.length !== 2) return `Ada ${l.length} elemen span.lencana, seharusnya 2.`;
            if (l[0].textContent !== 'Baru') return `Lencana pertama berisi "${l[0].textContent}", seharusnya "Baru".`;
            if (!l[0].classList.contains('biru')) return 'Lencana pertama (tanpa prop warna) harus memakai warna default "biru".';
            if (l[1].textContent !== 'Diskon') return `Lencana kedua berisi "${l[1].textContent}", seharusnya "Diskon".`;
            if (!l[1].classList.contains('merah')) return 'Lencana kedua harus punya class "merah".';
            return !l[1].classList.contains('biru') || 'Lencana kedua tidak boleh ikut memakai class "biru".';
          },
        },
      ],
    }),
    kode('u4-k2', 10, {
      jenis: 'react',
      pelajaran: 'react-usestate',
      tugas: baris(
        'Buat komponen **`App`** berisi penghitung dengan state `jumlah` (awal **0**):',
        '',
        '- `<span class="jumlah">` menampilkan angkanya',
        '- tombol **`+`** menambah 1, tetapi **maksimal 5**',
        '- tombol **`-`** mengurangi 1, tetapi **minimal 0**',
        '- saat `jumlah` sudah 5, tampilkan `<p class="penuh">Sudah maksimal</p>` (dan hanya saat itu)',
      ),
      kodeAwal: 'import { useState } from "react";\n\nfunction App() {\n  // tulis kodemu di sini\n  return <div></div>;\n}\n\nexport default App;\n',
      solusi: baris(
        'import { useState } from "react";',
        '',
        'function App() {',
        '  const [jumlah, setJumlah] = useState(0);',
        '',
        '  return (',
        '    <div>',
        '      <button onClick={() => setJumlah(Math.max(jumlah - 1, 0))}>-</button>',
        '      <span className="jumlah">{jumlah}</span>',
        '      <button onClick={() => setJumlah(Math.min(jumlah + 1, 5))}>+</button>',
        '      {jumlah === 5 && <p className="penuh">Sudah maksimal</p>}',
        '    </div>',
        '  );',
        '}',
        '',
        'export default App;',
        '',
      ),
      penjelasan: 'Batas atas/bawah dijaga dengan `Math.min`/`Math.max` (atau `if`). Pesan "penuh" cukup dengan `{jumlah === 5 && ...}`; hindari `{jumlah && ...}` karena angka 0 akan ikut tampil.',
      tes: [
        {
          nama: 'penghitung bertingkat',
          async cek(ctx) {
            if (ctx.teks('.jumlah') !== '0') return `Angka awal "${ctx.teks('.jumlah')}", seharusnya "0".`;
            await ctx.klik(ctx.tombol('-'));
            if (ctx.teks('.jumlah') !== '0') return 'Tombol "-" pada angka 0 tidak boleh membuat angka menjadi negatif.';
            for (let i = 0; i < 7; i++) await ctx.klik(ctx.tombol('+'));
            if (ctx.teks('.jumlah') !== '5') return `Setelah menekan "+" 7 kali, angka "${ctx.teks('.jumlah')}", seharusnya berhenti di "5".`;
            if (ctx.teks('.penuh') !== 'Sudah maksimal') return 'Saat jumlah 5, tampilkan <p class="penuh">Sudah maksimal</p>.';
            await ctx.klik(ctx.tombol('-'));
            if (ctx.teks('.jumlah') !== '4') return `Setelah "-" dari 5, angka "${ctx.teks('.jumlah')}", seharusnya "4".`;
            return !ctx.ada('.penuh') || 'Pesan "Sudah maksimal" harus hilang saat jumlah kurang dari 5.';
          },
        },
      ],
    }),
    kode('u4-k3', 10, {
      jenis: 'react',
      pelajaran: 'react-onchange-input',
      tugas: baris(
        'Buat komponen **`App`** berisi:',
        '',
        '- sebuah `<input>` **terkontrol** (nilainya disimpan di state)',
        '- `<p class="balik">` yang menampilkan teks yang diketik **dibalik**. Contoh: mengetik `abc` → `cba`. Jika input kosong, tampilkan `(kosong)`',
        '- tombol **`Bersihkan`** yang mengosongkan input',
        '',
        'Petunjuk: `"abc".split("").reverse().join("")`',
      ),
      kodeAwal: 'import { useState } from "react";\n\nfunction App() {\n  // tulis kodemu di sini\n  return <div></div>;\n}\n\nexport default App;\n',
      solusi: baris(
        'import { useState } from "react";',
        '',
        'function App() {',
        '  const [teks, setTeks] = useState("");',
        '  const balik = teks.split("").reverse().join("");',
        '',
        '  return (',
        '    <div>',
        '      <input value={teks} onChange={(e) => setTeks(e.target.value)} />',
        '      <p className="balik">{teks ? balik : "(kosong)"}</p>',
        '      <button onClick={() => setTeks("")}>Bersihkan</button>',
        '    </div>',
        '  );',
        '}',
        '',
        'export default App;',
        '',
      ),
      penjelasan: 'Teks yang dibalik adalah **nilai turunan**: cukup dihitung dari state `teks` saat render, tidak perlu state tersendiri.',
      tes: [
        {
          nama: 'teks dibalik',
          async cek(ctx) {
            if (ctx.teks('.balik') !== '(kosong)') return `Awalnya .balik berisi "${ctx.teks('.balik')}", seharusnya "(kosong)".`;
            await ctx.ketik('input', 'abc');
            if (ctx.teks('.balik') !== 'cba') return `Setelah mengetik "abc", .balik berisi "${ctx.teks('.balik')}", seharusnya "cba".`;
            if (ctx.cari('input').value !== 'abc') return 'Nilai input harus mengikuti state (value={teks}).';
            await ctx.ketik('input', 'react');
            if (ctx.teks('.balik') !== 'tcaer') return `Untuk "react", .balik berisi "${ctx.teks('.balik')}", seharusnya "tcaer".`;
            await ctx.klik(ctx.tombol('Bersihkan'));
            if (ctx.cari('input').value !== '') return 'Setelah "Bersihkan", input harus kosong.';
            return ctx.teks('.balik') === '(kosong)' || 'Setelah "Bersihkan", .balik harus kembali "(kosong)".';
          },
        },
      ],
    }),
    kode('u4-k4', 11, {
      jenis: 'react',
      pelajaran: 'react-map-key',
      css: 'li.selesai { text-decoration: line-through; color: #888; }',
      tugas: baris(
        'Data `TUGAS` sudah ada di kode awal. Buat komponen **`App`** yang menampilkan:',
        '',
        '- tiap tugas sebagai `<li>` di dalam `<ul>` (pakai `map` dan `key`). Tugas yang selesai diberi class **`selesai`**',
        '- checkbox terkontrol `<input type="checkbox" id="sembunyi">`. Jika **dicentang**, tugas yang sudah selesai **tidak ditampilkan**',
        '- `<p class="sisa">` berisi `<n> tugas belum selesai`. Angkanya selalu jumlah tugas yang belum selesai, **terlepas dari filter**',
      ),
      kodeAwal: baris(
        'import { useState } from "react";',
        '',
        'const TUGAS = [',
        '  { id: 1, judul: "Belajar React", selesai: true },',
        '  { id: 2, judul: "Kerjakan latihan", selesai: false },',
        '  { id: 3, judul: "Push ke GitHub", selesai: false },',
        '  { id: 4, judul: "Istirahat", selesai: true },',
        '];',
        '',
        'function App() {',
        '  // tulis kodemu di sini',
        '  return <div></div>;',
        '}',
        '',
        'export default App;',
        '',
      ),
      solusi: baris(
        'import { useState } from "react";',
        '',
        'const TUGAS = [',
        '  { id: 1, judul: "Belajar React", selesai: true },',
        '  { id: 2, judul: "Kerjakan latihan", selesai: false },',
        '  { id: 3, judul: "Push ke GitHub", selesai: false },',
        '  { id: 4, judul: "Istirahat", selesai: true },',
        '];',
        '',
        'function App() {',
        '  const [sembunyi, setSembunyi] = useState(false);',
        '  const tampil = sembunyi ? TUGAS.filter((t) => !t.selesai) : TUGAS;',
        '  const sisa = TUGAS.filter((t) => !t.selesai).length;',
        '',
        '  return (',
        '    <div>',
        '      <label>',
        '        <input type="checkbox" id="sembunyi" checked={sembunyi} onChange={(e) => setSembunyi(e.target.checked)} /> Sembunyikan yang selesai',
        '      </label>',
        '      <ul>',
        '        {tampil.map((t) => (',
        '          <li key={t.id} className={t.selesai ? "selesai" : ""}>',
        '            {t.judul}',
        '          </li>',
        '        ))}',
        '      </ul>',
        '      <p className="sisa">{sisa} tugas belum selesai</p>',
        '    </div>',
        '  );',
        '}',
        '',
        'export default App;',
        '',
      ),
      penjelasan: 'Daftar yang tampil dihitung dari `TUGAS` + state `sembunyi` (nilai turunan), sedangkan `sisa` selalu dihitung dari data lengkap sehingga tidak terpengaruh filter.',
      tes: [
        {
          nama: 'daftar tugas dengan filter',
          async cek(ctx) {
            const isi = () => ctx.cariSemua('ul li').map((x) => x.textContent.trim());
            if (isi().length !== 4) return `Awalnya ada ${isi().length} <li>, seharusnya 4.`;
            const selesai = ctx.cariSemua('ul li.selesai').map((x) => x.textContent.trim());
            if (selesai.join('|') !== 'Belajar React|Istirahat') return `<li> dengan class "selesai": [${selesai.join(', ')}], seharusnya [Belajar React, Istirahat].`;
            if (ctx.teks('.sisa') !== '2 tugas belum selesai') return `.sisa berisi "${ctx.teks('.sisa')}", seharusnya "2 tugas belum selesai".`;
            await ctx.klik('#sembunyi');
            if (isi().join('|') !== 'Kerjakan latihan|Push ke GitHub') return `Setelah dicentang, daftar: [${isi().join(', ')}], seharusnya [Kerjakan latihan, Push ke GitHub].`;
            if (ctx.teks('.sisa') !== '2 tugas belum selesai') return '.sisa tidak boleh berubah karena filter (tetap "2 tugas belum selesai").';
            await ctx.klik('#sembunyi');
            return isi().length === 4 || 'Setelah centang dihapus, keempat tugas harus tampil lagi.';
          },
        },
      ],
    }),
    kode('u4-k5', 11, {
      jenis: 'react',
      pelajaran: 'react-useeffect',
      tugas: baris(
        'Buat komponen **`App`** berisi `<span class="jumlah">` (awal **0**) dan tombol **`Tambah`** yang menambah jumlah 1.',
        '',
        'Gunakan **`useEffect`** supaya `document.title` selalu bernilai `Jumlah: <angka>` (mis. `Jumlah: 0`, lalu `Jumlah: 1`, ...). Efek harus dijalankan **setiap kali jumlah berubah**.',
      ),
      kodeAwal: 'import { useState, useEffect } from "react";\n\nfunction App() {\n  // tulis kodemu di sini\n  return <div></div>;\n}\n\nexport default App;\n',
      solusi: baris(
        'import { useState, useEffect } from "react";',
        '',
        'function App() {',
        '  const [jumlah, setJumlah] = useState(0);',
        '',
        '  useEffect(() => {',
        '    document.title = "Jumlah: " + jumlah;',
        '  }, [jumlah]);',
        '',
        '  return (',
        '    <div>',
        '      <span className="jumlah">{jumlah}</span>',
        '      <button onClick={() => setJumlah(jumlah + 1)}>Tambah</button>',
        '    </div>',
        '  );',
        '}',
        '',
        'export default App;',
        '',
      ),
      penjelasan: 'Nilai di dalam dependency array (`[jumlah]`) menentukan kapan efek dijalankan ulang: setiap kali `jumlah` berubah.',
      tes: [
        {
          nama: 'title mengikuti jumlah',
          async cek(ctx) {
            if (!ctx.pakai('useEffect(')) return 'Gunakan useEffect untuk memperbarui document.title.';
            if (ctx.document.title !== 'Jumlah: 0') return `Awalnya document.title = "${ctx.document.title}", seharusnya "Jumlah: 0".`;
            await ctx.klik(ctx.tombol('Tambah'));
            await ctx.klik(ctx.tombol('Tambah'));
            if (ctx.teks('.jumlah') !== '2') return `Setelah 2 klik, .jumlah berisi "${ctx.teks('.jumlah')}", seharusnya "2".`;
            await ctx.tunggu(30);
            return ctx.document.title === 'Jumlah: 2' || `Setelah 2 klik, document.title = "${ctx.document.title}", seharusnya "Jumlah: 2". Cek dependency array useEffect.`;
          },
        },
      ],
    }),
  ],
};
