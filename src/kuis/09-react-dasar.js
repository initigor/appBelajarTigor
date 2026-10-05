// Chapter 9 — React Dasar. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'react-komponen-jsx': {
    intisari: 'Komponen React adalah fungsi JavaScript berawalan **huruf kapital** yang me-return JSX (sintaks mirip HTML), dan React yang mengurus perubahan DOM-nya.',
    rangkuman: [
      'React membalik cara berpikir: kamu **mendeskripsikan tampilan** dalam bentuk fungsi, dan React yang memperbarui DOM.',
      '**Komponen** = fungsi biasa yang namanya diawali huruf kapital (`App`, bukan `app`) dan me-`return` JSX.',
      'JSX bukan string dan bukan HTML sungguhan; Babel mengubahnya menjadi pemanggilan fungsi JavaScript. JSX multibaris dibungkus kurung `( )`.',
      '`export default App` menandai komponen utama file. Fungsi hanya bisa me-return satu elemen, jadi bungkus dengan satu `<div>` atau Fragment.',
    ],
    soal: [
      {
        tanya: 'Apa syarat penamaan sebuah komponen React?',
        benar: 'Diawali huruf kapital, mis. `App`',
        salah: ['Diawali huruf kecil, mis. `app`', 'Harus diakhiri kata `Component`', 'Harus ditulis semua huruf kapital'],
        jelas: 'React membedakan komponen dari tag HTML biasa lewat huruf kapital di awal nama.',
      },
      {
        tanya: 'Apa sebenarnya JSX?',
        benar: 'Sintaks mirip HTML di dalam JavaScript yang diubah Babel menjadi pemanggilan fungsi',
        salah: ['String HTML yang ditulis tanpa kutip', 'HTML sungguhan yang dijalankan langsung oleh browser', 'Bahasa pemrograman baru dari Facebook yang menggantikan JavaScript sepenuhnya di browser modern'],
        jelas: 'JSX adalah gula sintaks. Sebelum dijalankan, ia diterjemahkan menjadi kode JavaScript biasa.',
      },
      {
        tanya: 'Apa yang dilakukan komponen `App`?\n\n~~~jsx\nfunction App() {\n  return <h1>Halo, React!</h1>;\n}\n~~~',
        benar: 'Mengembalikan JSX yang menjadi tampilan komponen',
        salah: ['Mencetak teks ke console', 'Mengubah file HTML secara langsung', 'Membuat variabel global bernama `h1` yang isinya teks "Halo, React!"'],
        jelas: 'Komponen adalah fungsi yang hasil `return`-nya menjadi tampilan.',
      },
      {
        tanya: 'Kenapa JSX multibaris sebaiknya dibungkus kurung `( )` setelah `return`?',
        benar: 'Supaya rapi dan terhindar dari masalah titik koma otomatis setelah `return`',
        salah: ['Karena Babel hanya bisa membaca JSX yang dibungkus kurung, jika tidak kode langsung error', 'Karena kurung mempercepat render', 'Karena `return` hanya menerima kurung'],
        jelas: 'Kurung membuat JSX terbaca jelas dan aman untuk ditulis di banyak baris.',
      },
    ],
  },

  'react-aturan-jsx': {
    intisari: 'JSX harus punya satu elemen pembungkus (atau Fragment `<>...</>`), memakai `className` bukan `class`, menutup semua tag (`<img />`), dan menyisipkan JavaScript lewat `{ }`.',
    rangkuman: [
      'Harus ada **satu elemen pembungkus**. Bila tidak ingin menambah `<div>`, pakai Fragment `<>...</>`.',
      '`class` ditulis **`className`** karena `class` adalah kata kunci JavaScript.',
      'Semua tag harus ditutup: `<img src="..." />`, `<br />`, `<input />`.',
      '`{ }` membuka jendela ke JavaScript dan menerima **ekspresi**: `{nama}`, `{2025 - tahunLahir}`, `{nama.toUpperCase()}`. Mirip f-string Python.',
    ],
    soal: [
      {
        tanya: 'Atribut mana yang benar untuk memberi class CSS pada elemen di JSX?',
        benar: '`className="kartu"`',
        salah: ['`class="kartu"` seperti di HTML biasa', '`klass="kartu"`', '`css="kartu"`'],
        jelas: '`class` adalah kata kunci JavaScript, sehingga JSX memakai `className`.',
      },
      {
        tanya: 'Cara yang benar menampilkan isi variabel `nama` di dalam `<h2>`?',
        benar: '`<h2>{nama}</h2>`',
        salah: ['`<h2>nama</h2>`', '`<h2>${nama}</h2>`', '`<h2>"nama"</h2>`'],
        jelas: 'Teks tanpa kurung kurawal ditampilkan apa adanya. `{nama}` menyisipkan isi variabelnya. `${...}` milik template literal, bukan JSX.',
      },
      {
        tanya: 'Penulisan mana yang **valid** di JSX?',
        benar: '`<img src="a.png" />`',
        salah: ['`<img src="a.png">`', '`<br>`', '`<input type="text">`'],
        jelas: 'Berbeda dengan HTML, tag tanpa isi wajib ditutup sendiri dengan `/>` di JSX.',
      },
      {
        tanya: 'Komponen perlu me-return dua elemen sejajar tanpa menambah `<div>`. Solusinya adalah ...',
        benar: 'Membungkusnya dengan Fragment `<>...</>`',
        salah: ['Me-return dua kali', 'Memisahkannya dengan koma', 'Memakai tanda `&&` di antara kedua elemen agar keduanya digabung'],
        jelas: 'Fungsi hanya bisa me-return satu nilai. Fragment adalah pembungkus yang tidak menambah elemen ke DOM.',
      },
    ],
  },

  'react-komposisi': {
    intisari: 'Komposisi berarti memecah halaman besar menjadi komponen kecil yang disusun seperti lego; komponen dipakai seperti tag (`<Header />`) dan boleh dipakai berkali-kali.',
    rangkuman: [
      'Komponen dipakai seperti tag HTML: `<Header />`, dan satu komponen boleh dipakai berkali-kali.',
      'Nama komponen **harus berawalan huruf kapital**: `<header>` (kecil) adalah tag HTML biasa, `<Header>` (kapital) adalah komponen buatanmu.',
      'Ini seperti memecah program C menjadi fungsi kecil, tetapi yang dipecah adalah **tampilan**.',
      'Di proyek sungguhan biasanya satu komponen = satu file yang di-`import`.',
    ],
    soal: [
      {
        tanya: 'Apa perbedaan `<header>` dan `<Header />` di JSX?',
        benar: '`<header>` tag HTML biasa, `<Header />` komponen buatanmu',
        salah: ['Tidak ada perbedaan, keduanya sama', '`<Header />` hanya boleh dipakai sekali', '`<header>` tag buatan React, `<Header />` tag bawaan HTML'],
        jelas: 'Huruf kapital di awal membuat React memperlakukannya sebagai komponen, bukan tag HTML.',
      },
      {
        tanya: 'Bagaimana memakai komponen `Footer` di dalam `App`?',
        benar: '`<Footer />`',
        salah: ['`Footer()`', '`<footer />` dengan `f` kecil', '`{Footer}`'],
        jelas: 'Komponen dipakai dengan sintaks tag dan nama berawalan kapital.',
      },
      {
        tanya: 'Apa manfaat utama komposisi komponen?',
        benar: 'Halaman besar jadi bagian kecil yang mudah dipakai ulang dan dirawat',
        salah: ['File menjadi otomatis lebih kecil ukurannya sehingga halaman terbuka lebih cepat', 'Tidak perlu lagi memakai JSX', 'Komponen berjalan di server, bukan di browser'],
        jelas: 'Memecah tampilan menjadi komponen kecil memudahkan penggunaan ulang dan perawatan.',
      },
    ],
  },

  'react-props': {
    intisari: 'Props adalah argumen untuk komponen: atribut yang kamu tulis di tag dikumpulkan React menjadi satu object, dan komponen tidak boleh mengubah props-nya (read-only).',
    rangkuman: [
      '`<Sapaan nama="Budi" umur={20} />` mengirim props; komponen menerimanya sebagai satu object: `function Sapaan({ nama, umur })`.',
      'String boleh memakai kutip (`nama="Budi"`); nilai lain (angka, boolean, array, object, fungsi) memakai `{ }` (`umur={20}`).',
      'Default props memakai default destructuring: `function Sapaan({ nama, umur = 17 })`.',
      'Props bersifat **read-only**. Data yang berubah disimpan di **state**. Dengan props, satu komponen dipakai ulang untuk data berbeda.',
    ],
    soal: [
      {
        tanya: 'Cara yang benar mengirim angka 20 sebagai prop `umur`?',
        benar: '`<Sapaan umur={20} />`',
        salah: ['`<Sapaan umur="20" />` agar menjadi number', '`<Sapaan umur=20 />`', '`<Sapaan umur:20 />`'],
        jelas: 'Nilai non-string dikirim dengan kurung kurawal. `"20"` akan menjadi string.',
      },
      {
        tanya: 'Berapa umur yang tampil untuk `<Sapaan nama="Sinta" />`?\n\n~~~jsx\nfunction Sapaan({ nama, umur = 17 }) {\n  return <p>{nama} ({umur})</p>;\n}\n~~~',
        benar: '`17`, karena `umur` tidak dikirim lalu memakai nilai default',
        salah: ['`undefined`', 'Kosong, tidak tampil apa-apa', 'Error `ReferenceError` karena prop `umur` tidak dikirim dari pemakai komponen'],
        jelas: 'Default destructuring dipakai ketika prop bernilai `undefined` atau tidak dikirim.',
      },
      {
        tanya: 'Kenapa komponen tidak boleh mengubah props-nya?',
        benar: 'Props adalah masukan read-only; data yang berubah seharusnya disimpan sebagai state',
        salah: ['Karena props selalu berupa string, dan string di JavaScript tidak bisa diubah sama sekali', 'Karena `const` selalu membekukan semua object', 'Karena komponen hanya dijalankan sekali'],
        jelas: 'Anggap props seperti parameter `const`. Perubahan data dikelola oleh state.',
      },
      {
        tanya: 'Pada `function Sapaan(props)`, bagaimana mengakses prop `nama`?',
        benar: '`props.nama`',
        salah: ['`props(nama)`', '`Sapaan.nama`', '`this.nama`'],
        jelas: 'React mengirim seluruh props sebagai satu object parameter. Dengan destructuring bisa langsung `{ nama }`.',
      },
    ],
  },

  'react-children': {
    intisari: '`children` adalah prop khusus berisi apa pun yang ditulis di antara tag pembuka dan penutup komponen; ia memungkinkan komponen "bingkai" (wrapper) seperti Kartu atau Modal yang tidak perlu tahu isinya.',
    rangkuman: [
      'Apa pun di antara `<Kartu>` dan `</Kartu>` dikirim sebagai prop **`children`**.',
      'Komponen menampilkannya dengan `{children}` di tempat yang diinginkan.',
      'Komponen seperti ini disebut **wrapper / layout component**: `Card`, `Modal`, `Section`, `Layout`. Tugasnya menyediakan bingkai, bukan isi.',
      'Variasi gaya bisa diatur lewat prop tambahan, mis. `jenis`, lalu menentukan `className` dengan ternary.',
    ],
    soal: [
      {
        tanya: 'Apa isi `children` pada kode ini?\n\n~~~jsx\n<Kartu judul="Tentang">\n  <p>Halo</p>\n</Kartu>\n~~~',
        benar: 'Elemen `<p>Halo</p>` yang ditulis di antara tag `Kartu`',
        salah: ['String `"Tentang"`', '`undefined`', 'Nama komponen `Kartu` beserta seluruh props yang dikirim ke dalamnya'],
        jelas: '`judul` adalah prop biasa, sedangkan isi di antara tag pembuka dan penutup menjadi `children`.',
      },
      {
        tanya: 'Bagaimana komponen `Kartu` menampilkan isi yang dibungkusnya?',
        benar: 'Menaruh `{children}` di dalam JSX-nya',
        salah: ['Memanggil `Kartu.children()`', 'Menulis `<children />`', 'Tidak perlu apa-apa, `children` akan tampil otomatis di dalam komponen'],
        jelas: '`children` hanyalah prop; ia baru tampil bila kamu menyisipkannya dengan `{children}`.',
      },
      {
        tanya: 'Apa keuntungan komponen wrapper berbasis `children`?',
        benar: 'Komponen hanya menyediakan bingkai sehingga bisa dipakai untuk isi apa pun',
        salah: ['Props tidak diperlukan lagi', 'Komponen berjalan lebih cepat', 'Isinya otomatis diterjemahkan ke bahasa lain oleh React di browser pengunjung'],
        jelas: 'Pemisahan "bingkai" dan "isi" membuat komponen seperti Kartu dan Modal bisa dipakai ulang di banyak tempat.',
      },
    ],
  },

  'proyek-kartu-profil': {
    intisari: 'Proyek ini menyusun komponen bersarang (App → Tim → KartuProfil → Badge) dengan props, nilai default, `children`, dan ternary di dalam `{ }` untuk `className` dan perhitungan.',
    rangkuman: [
      'Rancang dulu pohon komponen: `App` → `Tim` (judul, children) → `KartuProfil` (nama, peran, avatar, angkatan) → `Badge`.',
      'Ternary bisa dipakai di dalam `{ }`, termasuk untuk className: `className={baru ? "badge baru" : "badge"}`.',
      'Ekspresi dihitung langsung di JSX: `<p>Semester {(2025 - angkatan) * 2 + 1}</p>`.',
      'Nilai default prop (`avatar = "🧑‍💻"`, `baru = false`) membuat komponen fleksibel tanpa memaksa pemakai mengisi semuanya.',
    ],
    soal: [
      {
        tanya: 'Cara memberi class `"badge baru"` hanya bila prop `baru` bernilai `true` adalah ...',
        benar: '`className={baru ? "badge baru" : "badge"}`',
        salah: ['`className="baru ? badge baru : badge"` (ditulis sebagai string biasa)', '`className=baru && "badge"`', '`className={if (baru) "badge baru"}`'],
        jelas: 'Ternary adalah ekspresi sehingga boleh di dalam `{ }`. `if` adalah statement dan tidak bisa di sana.',
      },
      {
        tanya: 'Kenapa `Badge` diberi default `baru = false`?',
        benar: 'Agar komponen tetap berfungsi bila prop `baru` tidak dikirim',
        salah: ['Agar `Badge` tidak bisa dipakai tanpa prop', 'Agar prop `baru` otomatis berubah saat diklik', 'Karena React mewajibkan setiap prop memiliki nilai default agar tidak error'],
        jelas: 'Tanpa default, `baru` akan `undefined`. Default menentukan perilaku bawaan yang aman.',
      },
      {
        tanya: 'Komponen mana yang paling cocok memakai `children` dalam rancangan Tim Kami?',
        benar: '`Tim`, sebagai bingkai yang membungkus banyak `KartuProfil`',
        salah: ['`Badge`, karena hanya menampilkan satu angka dan tidak punya anak', '`App`, karena tidak menerima props', '`KartuProfil`, karena selalu kosong'],
        jelas: '`Tim` hanya menyediakan judul dan bingkai sedangkan kartu-kartu di dalamnya dikirim sebagai `children`.',
      },
    ],
  },
};
