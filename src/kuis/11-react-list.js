// Chapter 11 — React List & Kondisional. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'react-map-key': {
    intisari: 'Daftar data ditampilkan dengan `map` di dalam JSX, dan setiap elemen hasilnya wajib punya `key` yang **unik** dan **stabil** (idealnya id dari data, bukan indeks bila urutan bisa berubah).',
    rangkuman: [
      'JSX bisa menampilkan **array berisi elemen**, jadi pola umumnya `{daftar.map((d) => <li key={d.id}>{d.nama}</li>)}`.',
      'Kurung `( )` setelah `=>` berarti arrow function langsung me-return JSX (bentuk singkat).',
      '`key` harus **unik** di antara saudaranya dan **stabil** (tidak berubah antar-render). React memakainya untuk mengenali item yang ditambah, dihapus, atau dipindah.',
      'Pakai id dari data (`key={p.id}`). Hindari `key={index}` bila urutan list bisa berubah. `{...p}` (spread props) mengirim semua properti `p` sebagai props.',
    ],
    soal: [
      {
        tanya: 'Nilai `key` mana yang paling tepat untuk daftar proyek `{ id, judul }`?',
        benar: '`key={p.id}`',
        salah: ['`key={Math.random()}`', '`key={p.judul.length}`', 'Tidak perlu `key`'],
        jelas: '`key` harus unik dan stabil. `Math.random()` berubah di tiap render, dan panjang judul bisa kembar.',
      },
      {
        tanya: 'Kenapa `key={index}` berisiko jika daftar bisa dihapus atau diurutkan ulang?',
        benar: 'Indeks item bergeser sehingga React bisa salah mengenali item mana yang berubah',
        salah: ['Karena indeks selalu bernilai string, sedangkan `key` hanya boleh berupa angka', 'Karena `index` tidak bisa dipakai dalam JSX', 'Karena React melarang angka sebagai `key`'],
        jelas: 'Identitas item seharusnya melekat pada datanya, bukan pada posisinya. Posisi bergeser setelah penghapusan atau pengurutan.',
      },
      {
        tanya: 'Apa fungsi `key` pada elemen hasil `map`?',
        benar: 'Membantu React mengenali item mana yang ditambah, dihapus, atau dipindah',
        salah: ['Menentukan warna elemen', 'Menjadi nilai prop yang bisa dibaca komponen anak lewat `props.key` di dalam komponen', 'Mengurutkan item secara otomatis'],
        jelas: '`key` hanya dipakai internal oleh React untuk melacak elemen; ia tidak diteruskan sebagai prop biasa.',
      },
      {
        tanya: 'Apa arti `{...p}` pada `<KartuProyek key={p.id} {...p} />`?',
        benar: 'Mengirim semua properti object `p` sebagai props',
        salah: ['Menghapus semua properti `p`', 'Menyalin komponen `KartuProyek` sebanyak jumlah properti yang ada di `p`', 'Membuat `p` menjadi string'],
        jelas: 'Spread pada props membuka object menjadi atribut: `nama={p.nama} tahun={p.tahun} ...`.',
      },
    ],
  },

  'react-render-kondisional': {
    intisari: 'JSX hanya menerima ekspresi, jadi tampilan bersyarat memakai `&&` (tampil atau tidak), ternary (pilih salah satu), atau `if` / early return di luar JSX; waspadai angka `0` yang tampil di layar.',
    rangkuman: [
      '`{isAdmin && <Tombol />}` untuk tampil atau tidak sama sekali; `{isLogin ? <Profil /> : <TombolLogin />}` untuk memilih salah satu.',
      'Untuk logika panjang, pakai `if` biasa sebelum `return`, termasuk **early return**: `if (items.length === 0) return <p>Belum ada data</p>;`.',
      '**Jebakan angka 0:** `{pesan.length && <span>...</span>}` menampilkan angka `0` bila kosong. `false`, `null`, `undefined` tidak tampil, tetapi `0` tampil.',
      'Solusinya memakai kondisi boolean: `{pesan.length > 0 && <span>...</span>}`.',
    ],
    soal: [
      {
        tanya: 'Apa yang tampil di layar?\n\n~~~jsx\nconst pesan = [];\n{pesan.length && <span>Ada pesan</span>}\n~~~',
        benar: 'Angka `0`',
        salah: ['Tulisan "Ada pesan"', 'Tidak ada apa-apa', 'Error'],
        jelas: '`0 && x` menghasilkan `0`, dan React menampilkan angka 0. Gunakan `pesan.length > 0`.',
      },
      {
        tanya: 'Kenapa `if` tidak bisa langsung ditulis di dalam `{ }` pada JSX?',
        benar: 'JSX hanya menerima ekspresi, sedangkan `if` adalah statement',
        salah: ['Karena `if` tidak ada di React', 'Karena `if` hanya boleh dipakai di dalam fungsi yang bernama persis `render`', 'Karena kurung kurawal tidak boleh berisi kode'],
        jelas: 'Untuk kondisi di dalam JSX gunakan `&&` atau ternary. Untuk `if`, taruh di luar JSX sebelum `return`.',
      },
      {
        tanya: 'Pola mana yang tepat untuk memilih salah satu dari dua komponen?',
        benar: '`{isLogin ? <Profil /> : <TombolLogin />}`',
        salah: ['`{isLogin && <Profil /> && <TombolLogin />}`', '`{if (isLogin) <Profil /> else <TombolLogin />}`', '`{isLogin || <Profil />}`'],
        jelas: 'Ternary memilih tepat satu dari dua pilihan dan merupakan ekspresi yang valid di JSX.',
      },
      {
        tanya: 'Apa itu *early return* di komponen?',
        benar: '`return` lebih awal bila kondisi tertentu terpenuhi, misalnya data kosong',
        salah: ['Menjalankan komponen sebelum halaman selesai dimuat oleh browser pengunjung', 'Mengembalikan state ke nilai awal', 'Menghentikan seluruh aplikasi React'],
        jelas: 'Contoh: `if (items.length === 0) return <p>Belum ada data</p>;` sebelum JSX utama.',
      },
    ],
  },

  'react-ternary-komponen': {
    intisari: 'Dalam komponen, tampilan bisa dipilih dengan early return, object sebagai tabel pencarian (`LABEL[status] ?? "default"`) untuk banyak pilihan, dan `return null` untuk tidak menampilkan apa pun.',
    rangkuman: [
      '**Early return:** `if (!user) return <button>Login</button>;` lalu `return` tampilan utama di bawahnya.',
      '**Object sebagai tabel pencarian:** untuk banyak pilihan (seperti `switch`) lebih rapi daripada ternary bertumpuk: `LABEL[status] ?? "❓ Tidak diketahui"`.',
      'Padanan Python: `dict.get(status, "default")`.',
      'Komponen boleh `return null` untuk **tidak menampilkan apa pun**, mis. `if (!pesan) return null;`.',
    ],
    soal: [
      {
        tanya: 'Apa yang dilakukan komponen ini bila `pesan` kosong?\n\n~~~jsx\nfunction Peringatan({ pesan }) {\n  if (!pesan) return null;\n  return <div className="peringatan">{pesan}</div>;\n}\n~~~',
        benar: 'Tidak menampilkan apa pun',
        salah: ['Menampilkan `<div>` kosong', 'Melempar error', 'Menampilkan tulisan `null`'],
        jelas: 'Komponen yang me-return `null` tidak menghasilkan elemen apa pun di DOM.',
      },
      {
        tanya: 'Untuk memilih label dari banyak status (selesai, proses, rencana, ...), cara yang rapi adalah ...',
        benar: 'Object sebagai tabel pencarian: `LABEL[status]`',
        salah: ['Ternary yang bertumpuk sangat dalam', 'Satu `if` besar di dalam JSX', 'Membuat komponen terpisah untuk tiap huruf dari nama status yang ada'],
        jelas: 'Object tabel pencarian mudah dibaca dan ditambah, mirip `dict` di Python.',
      },
      {
        tanya: 'Apa hasil `LABEL["lain"] ?? "❓ Tidak diketahui"` jika `LABEL` tidak punya kunci `"lain"`?',
        benar: '`"❓ Tidak diketahui"`',
        salah: ['`undefined`', 'Error `KeyError` seperti yang terjadi pada dictionary Python', '`"lain"`'],
        jelas: 'Properti yang tidak ada bernilai `undefined`, sehingga `??` memberi nilai cadangan.',
      },
      {
        tanya: 'Apa padanan `dict.get(kunci, "default")` Python di JavaScript?',
        benar: '`obj[kunci] ?? "default"`',
        salah: ['`obj.get(kunci, "default")`', '`obj[kunci] && "default"`', '`obj.kunci("default")`'],
        jelas: 'Object JS tidak punya method `get`. Akses dengan bracket lalu pakai `??` untuk nilai cadangan.',
      },
    ],
  },

  'react-filter-pencarian': {
    intisari: 'Fitur pencarian menyimpan kata kunci di state (input terkontrol) lalu **menghitung** hasilnya dengan `filter` setiap render, tanpa state tambahan, dan menyamakan huruf dengan `toLowerCase()`.',
    rangkuman: [
      'Kata kunci disimpan di state lewat input terkontrol; daftar yang cocok **dihitung** dari data dengan `filter` (bukan disimpan di state lain).',
      'Setiap ketikan mengubah state → render ulang → `hasil` dihitung ulang otomatis. Tidak perlu `addEventListener` atau `innerHTML = ""`.',
      'Tidak peka huruf besar/kecil: samakan keduanya, `item.nama.toLowerCase().includes(kunci.toLowerCase())`.',
      'Mencari di beberapa properti: gabungkan dengan `||`. Tampilkan hasil kosong dengan render kondisional.',
    ],
    soal: [
      {
        tanya: 'Di mana daftar hasil pencarian sebaiknya disimpan?',
        benar: 'Tidak perlu disimpan, cukup dihitung dari data dan kata kunci tiap render',
        salah: ['Di state terpisah yang diperbarui manual setiap ketikan lewat `useEffect` tambahan', 'Di variabel global di luar komponen', 'Di atribut `value` input'],
        jelas: 'Daftar hasil adalah nilai turunan. Menghitungnya setiap render menjaga agar selalu sesuai dengan kata kunci terbaru.',
      },
      {
        tanya: 'Cara membuat pencarian tidak peka huruf besar/kecil?',
        benar: 'Mengubah kedua sisi ke huruf kecil dengan `toLowerCase()` sebelum `includes`',
        salah: ['Menambahkan opsi `ignoreCase` pada `includes` sebagai argumen kedua', 'Memakai `==` bukan `===`', 'Mengubah input menjadi number'],
        jelas: '`"BUDI".toLowerCase()` dan `"budi".toLowerCase()` sama-sama `"budi"`, sehingga cocok.',
      },
      {
        tanya: 'Cara mencocokkan kata kunci di **nama atau jurusan**?',
        benar: '`m.nama.toLowerCase().includes(k) || m.jurusan.toLowerCase().includes(k)`',
        salah: ['`m.nama.includes(k) && m.jurusan.includes(k)`', '`m.nama.includes(m.jurusan, k)` dengan dua argumen sekaligus', '`[m.nama, m.jurusan] === k`'],
        jelas: '`||` meloloskan item bila salah satu properti cocok. `&&` menuntut keduanya cocok.',
      },
      {
        tanya: 'Apa yang terjadi di React setiap kali user mengetik di kotak pencarian terkontrol?',
        benar: 'State kata kunci berubah, komponen dirender ulang, dan hasil dihitung ulang',
        salah: ['Seluruh halaman dimuat ulang dari server', 'Hanya `<input>` yang berubah, daftar menunggu klik tombol cari', 'React menghapus state agar tidak menumpuk'],
        jelas: 'Itulah alur data React: state → tampilan. Tidak ada manipulasi DOM manual.',
      },
    ],
  },

  'react-useeffect': {
    intisari: '`useEffect` menjalankan "efek samping" (ubah `document.title`, timer, fetch, simpan ke `localStorage`) setelah render; dependency array menentukan kapan ia dijalankan, dan fungsi yang di-return dipakai untuk cleanup.',
    rangkuman: [
      'Komponen sebaiknya hanya menghitung tampilan. Efek samping (timer, `fetch`, `document.title`, `localStorage`) ditaruh di `useEffect`.',
      '`useEffect(fn, [a, b])` jalan setelah render pertama dan setiap `a`/`b` berubah; `useEffect(fn, [])` hanya sekali; `useEffect(fn)` setelah **setiap** render.',
      '**Cleanup:** kembalikan fungsi dari efek (mis. `return () => clearInterval(id)`). React memanggilnya sebelum efek dijalankan ulang atau saat komponen dilepas.',
      'Dalam `setInterval` pakai updater function `setDetik((d) => d + 1)` karena callback "mengingat" nilai lama. `setState` tanpa kondisi di efek tanpa dependency menyebabkan loop tak berujung.',
    ],
    soal: [
      {
        tanya: 'Kapan efek ini dijalankan?\n\n~~~jsx\nuseEffect(() => {\n  document.title = `Diklik ${jumlah} kali`;\n}, [jumlah]);\n~~~',
        benar: 'Setelah render pertama dan setiap kali `jumlah` berubah',
        salah: ['Hanya sekali, setelah render pertama, dan tidak pernah dijalankan lagi sesudahnya', 'Setiap kali komponen lain di aplikasi dirender', 'Hanya saat komponen dilepas dari layar'],
        jelas: 'Dependency array `[jumlah]` memberi tahu React untuk menjalankan ulang efek tiap `jumlah` berubah.',
      },
      {
        tanya: 'Untuk menjalankan efek **sekali saja** setelah render pertama, dependency array-nya adalah ...',
        benar: 'Array kosong `[]`',
        salah: ['Tidak diberi dependency array', '`[undefined]`', '`null`'],
        jelas: 'Array kosong berarti tidak ada nilai yang perlu dipantau, jadi efek hanya jalan sekali. Tanpa array, efek jalan setiap render.',
      },
      {
        tanya: 'Untuk apa fungsi yang di-`return` dari dalam `useEffect`?',
        benar: 'Membersihkan efek, misalnya menghentikan timer atau listener',
        salah: ['Menentukan nilai yang akan ditampilkan komponen pada render berikutnya', 'Mengubah dependency array', 'Menjalankan efek sekali lagi'],
        jelas: 'Itu fungsi cleanup. React memanggilnya sebelum efek berikutnya atau saat komponen dilepas.',
      },
      {
        tanya: 'Kenapa di `setInterval` memakai `setDetik((d) => d + 1)` dan bukan `setDetik(detik + 1)`?',
        benar: 'Callback interval mengingat nilai `detik` lama, updater function selalu mendapat nilai terbaru',
        salah: ['Karena `setDetik(detik + 1)` tidak valid secara sintaks', 'Karena updater function lebih cepat', 'Karena `detik` adalah `const` yang tidak bisa dibaca'],
        jelas: 'Closure menangkap `detik` saat efek dibuat. Updater function menghindari nilai usang itu.',
      },
    ],
  },

  'proyek-daftar-kontak': {
    intisari: 'Daftar Kontak memadukan state array of object (tanpa mutasi), input terkontrol, nilai turunan (filter lalu sort) dari state, serta komponen anak yang mengubah state induk lewat **fungsi yang dikirim sebagai props** (`onToggleFavorit`).',
    rangkuman: [
      'State array of object diperbarui tanpa mutasi: `kontak.map((k) => (k.id === id ? { ...k, favorit: !k.favorit } : k))`.',
      'Daftar yang tampil adalah **nilai turunan**: dihitung dari state (filter pencarian → filter favorit → sort), tidak disimpan terpisah.',
      'Komponen anak tidak mengubah state induk langsung. Induk mengirim **fungsi**, anak memanggilnya: `onClick={() => onToggleFavorit(data.id)}`. Konvensi nama props fungsi: `onSesuatu`.',
      'Checkbox terkontrol memakai `checked={...}` dan `e.target.checked` (bukan `value`).',
    ],
    soal: [
      {
        tanya: 'Bagaimana komponen anak `Kontak` mengubah state favorit milik `App`?',
        benar: 'Memanggil fungsi yang dikirim induk lewat props, mis. `onToggleFavorit(data.id)`',
        salah: ['Mengubah langsung variabel state milik induk', 'Membuat state sendiri dengan nama yang sama lalu menimpa state milik induk', 'Tidak bisa, anak tidak boleh memicu perubahan'],
        jelas: 'Aliran data di React turun lewat props, dan perubahan naik lewat fungsi yang diberikan induk.',
      },
      {
        tanya: 'Properti mana yang dibaca dari checkbox terkontrol saat `onChange`?',
        benar: '`e.target.checked`',
        salah: ['`e.target.value`', '`e.target.text`', '`e.target.selected`'],
        jelas: 'Untuk checkbox, nilai yang bermakna adalah status `checked` (true/false).',
      },
      {
        tanya: 'Kenapa daftar kontak yang tampil (hasil filter dan sort) tidak perlu disimpan di state sendiri?',
        benar: 'Karena bisa dihitung dari state lain, menyimpannya hanya memberi peluang tidak sinkron',
        salah: ['Karena React tidak mengizinkan lebih dari tiga state', 'Karena state hanya boleh berupa angka dan string', 'Karena hasil filter selalu kosong'],
        jelas: 'Itulah prinsip derived state: simpan sumber kebenarannya saja, hitung sisanya saat render.',
      },
      {
        tanya: 'Konvensi penamaan prop yang berisi fungsi penangan event adalah ...',
        benar: 'Diawali `on`, mis. `onToggleFavorit`',
        salah: ['Diawali `fn` lalu diikuti nama aksi, mis. `fnToggleFavorit`', 'Diawali `set`, mis. `setToggle`', 'Huruf besar semua, mis. `TOGGLE`'],
        jelas: 'Konvensi ini membuat jelas bahwa prop tersebut dipanggil saat sebuah kejadian terjadi.',
      },
    ],
  },
};
