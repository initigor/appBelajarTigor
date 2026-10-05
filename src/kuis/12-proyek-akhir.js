// Chapter 12 — Proyek Akhir: Web Portofolio. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'portofolio-navbar': {
    intisari: 'Menu navbar sebaiknya disimpan sebagai array of object lalu ditampilkan dengan `map` + `key`, sehingga menambah menu cukup menambah satu baris data; `href="#id"` menggulir ke elemen dengan id tersebut.',
    rangkuman: [
      'Rancangan portofolio: `App` (state tema) berisi Navbar, Hero, About, Skills, Projects, Contact, dan Footer, masing-masing satu komponen.',
      'Daripada menulis link satu per satu, simpan menu sebagai **array of object** (`{ label, href }`) lalu `menu.map((m) => <li key={m.href}>...</li>)`.',
      'Menambah menu = menambah satu baris data, tidak perlu menyentuh JSX.',
      '`href="#about"` menggulir halaman ke elemen ber-`id="about"`, yaitu section yang dibuat di pelajaran berikutnya.',
    ],
    soal: [
      {
        tanya: 'Kenapa menu navbar disimpan sebagai array of object lalu di-`map`, bukan ditulis satu per satu?',
        benar: 'Menambah atau mengubah menu cukup mengedit datanya tanpa menyentuh JSX',
        salah: ['Karena `<li>` tidak boleh ditulis manual di React', 'Karena `map` membuat link menjadi lebih cepat dimuat oleh browser pengunjung', 'Karena React hanya menerima array sebagai JSX'],
        jelas: 'Memisahkan data dari tampilan membuat komponen lebih mudah dirawat dan dikembangkan.',
      },
      {
        tanya: 'Apa yang dilakukan link `<a href="#about">`?',
        benar: 'Menggulir halaman ke elemen yang ber-`id="about"`',
        salah: ['Membuka halaman baru bernama `about`', 'Memanggil komponen `About` secara langsung dan menggantinya dengan Navbar', 'Mengubah state bernama `about`'],
        jelas: 'Tanda `#` pada `href` menunjuk id elemen di halaman yang sama (anchor).',
      },
      {
        tanya: 'Nilai `key` yang cocok untuk item menu dengan data `{ label, href }` adalah ...',
        benar: '`m.href`',
        salah: ['`m.label.length`', 'Indeks acak dari `Math.random()`', 'Tidak perlu `key` karena hanya lima item'],
        jelas: 'Setiap item hasil `map` butuh `key` yang unik dan stabil, berapa pun jumlah itemnya.',
      },
    ],
  },

  'portofolio-hero': {
    intisari: 'Hero adalah bagian paling atas halaman (sapaan, peran, deskripsi, tombol ajakan); semua teksnya dikirim lewat props agar komponen bisa dipakai ulang, dan `id="home"` membuat link `#home` berfungsi.',
    rangkuman: [
      '**Hero** adalah kesan pertama pengunjung: sapaan & nama, peran/keahlian, satu kalimat deskripsi, dan *call to action* (tombol ajakan).',
      'Semua teks dikirim lewat **props** (`nama`, `peran`, `deskripsi`) sehingga komponennya reusable.',
      '`id="home"` pada `<section>` membuat link `#home` di Navbar berfungsi.',
      'Bila props banyak, tulis satu per baris agar mudah dibaca.',
    ],
    soal: [
      {
        tanya: 'Apa itu *call to action* pada bagian Hero?',
        benar: 'Tombol atau tautan yang mengajak pengunjung melakukan sesuatu, mis. "Lihat Proyek"',
        salah: ['Animasi yang berjalan otomatis', 'Kode yang mengambil data dari server lalu menyimpannya ke database milik pengunjung halaman', 'Komponen yang menyimpan state tema'],
        jelas: 'Hero biasanya diakhiri tombol ajakan yang mengarahkan pengunjung ke bagian penting lain.',
      },
      {
        tanya: 'Kenapa teks Hero (nama, peran, deskripsi) dikirim lewat props, bukan ditulis tetap di komponen?',
        benar: 'Agar komponen bisa dipakai ulang dengan data siapa saja',
        salah: ['Karena React melarang teks ditulis langsung di dalam komponen apa pun', 'Karena props membuat komponen lebih cepat', 'Karena JSX tidak bisa menampilkan teks biasa'],
        jelas: 'Props memisahkan "bingkai" dari data, jadi satu komponen cocok untuk banyak isi.',
      },
      {
        tanya: 'Kenapa `<section id="home">` diberi `id`?',
        benar: 'Agar link `#home` di Navbar tahu ke mana harus menggulir',
        salah: ['Agar React bisa membuat state otomatis', 'Agar section tidak ikut dirender', 'Karena `id` wajib ada di semua elemen JSX agar React bisa merendernya'],
        jelas: 'Anchor `#home` mencocokkan elemen dengan `id="home"`.',
      },
    ],
  },

  'portofolio-about': {
    intisari: 'Data diri disimpan sebagai object lalu ditampilkan dengan `Object.entries(info).map(([kunci, nilai]) => ...)`, sehingga menambah data cukup menambah satu properti; komentar di JSX ditulis `{/* ... */}`.',
    rangkuman: [
      'Data diri (kampus, jurusan, domisili) cocok disimpan sebagai **object** `INFO`.',
      'Object tidak bisa langsung di-`map`: ubah dengan `Object.entries(info)` lalu destructure pasangan `([kunci, nilai])`.',
      'Hasilnya menambah data diri cukup menambah satu baris di `INFO`, tanpa menyentuh JSX. Beri `key={kunci}` pada tiap `<li>`.',
      'Komentar di JSX ditulis `{/* ... */}`; komentar `//` tidak bisa dipakai di antara tag.',
    ],
    soal: [
      {
        tanya: 'Kenapa object `INFO` tidak bisa langsung di-`map`?',
        benar: '`map` adalah method array',
        salah: ['Karena object tidak boleh berisi string', 'Karena `map` hanya bisa dipakai pada angka', 'Karena JSX tidak menerima object sama sekali, hanya string, angka, dan array biasa yang bukan hasil `map`'],
        jelas: '`Object.entries(info)` menghasilkan array pasangan `[kunci, nilai]` yang bisa di-`map`.',
      },
      {
        tanya: 'Apa arti `([kunci, nilai])` pada `Object.entries(info).map(([kunci, nilai]) => ...)`?',
        benar: 'Destructuring array: tiap pasangan `[kunci, nilai]` dibongkar menjadi dua variabel',
        salah: ['Membuat array baru bernama `kunci`', 'Menghapus properti `nilai` dari object lalu mengembalikan sisa propertinya sebagai array', 'Mengubah kunci menjadi string'],
        jelas: 'Setiap elemen hasil `Object.entries` berupa array dua elemen, yang langsung dibongkar di parameter.',
      },
      {
        tanya: 'Cara menulis komentar di antara tag JSX?',
        benar: '`{/* komentar */}`',
        salah: ['`// komentar`', '`<!-- komentar -->`', '`# komentar`'],
        jelas: 'Di dalam JSX komentar harus berada di dalam kurung kurawal.',
      },
    ],
  },

  'portofolio-skills': {
    intisari: 'Letakkan state **sedekat mungkin** dengan tempat state itu dipakai: kategori filter hanya dipakai di `Skills`, jadi state-nya ada di dalam komponen itu, sedangkan daftar yang tampil dihitung dengan `filter`.',
    rangkuman: [
      'Level skill sebagai bintang: `"★".repeat(s.level) + "☆".repeat(5 - s.level)` (level 3 → `★★★☆☆`).',
      'State kategori yang dipilih hanya dipakai di `Skills`, jadi simpan **di dalam `Skills`**, bukan di `App`.',
      'Daftar tampil dihitung: `kategori === "Semua" ? daftar : daftar.filter((s) => s.kategori === kategori)`.',
      'Tombol filter bisa dibuat dari array lewat `map`, dengan class `aktif` bila `k === kategori` dan `onClick={() => setKategori(k)}`.',
    ],
    soal: [
      {
        tanya: 'Di mana state `kategori` sebaiknya disimpan jika hanya dipakai oleh komponen `Skills`?',
        benar: 'Di dalam komponen `Skills` itu sendiri',
        salah: ['Di `App`, supaya semua komponen bisa mengubahnya', 'Di variabel global di luar semua komponen', 'Di komponen `Footer`'],
        jelas: 'Aturan praktis: letakkan state sedekat mungkin dengan tempat ia dipakai agar komponen lain tidak ikut terpengaruh.',
      },
      {
        tanya: 'Apa hasil `"★".repeat(3) + "☆".repeat(2)`?',
        benar: '`"★★★☆☆"`',
        salah: ['`"★☆"`', '`"★★★★★"`', '`"3★2☆"`'],
        jelas: '`repeat(n)` mengulang string n kali, lalu hasilnya digabung.',
      },
      {
        tanya: 'Bagaimana daftar skill yang tampil ditentukan saat kategori dipilih?',
        benar: 'Dihitung dengan `filter` dari `daftar` setiap render, tanpa state tambahan',
        salah: ['Disimpan di state terpisah yang diubah manual', 'Diambil dari server tiap kali tombol filter diklik, lalu ditempelkan ke state komponen', 'Ditentukan oleh `key` dari tombol'],
        jelas: 'Hasil filter adalah nilai turunan dari `daftar` dan `kategori`.',
      },
      {
        tanya: 'Apa fungsi class `aktif` pada tombol filter yang sedang dipilih?',
        benar: 'Menandai secara visual kategori yang sedang aktif',
        salah: ['Mengaktifkan event `onClick` pada tombol supaya bisa merespons klik pengguna', 'Mengubah state `kategori` otomatis', 'Menghapus tombol lain'],
        jelas: 'Itu hanya class CSS untuk tampilan. Perubahan data tetap dilakukan oleh `setKategori`.',
      },
    ],
  },

  'portofolio-projects': {
    intisari: 'Pecah daftar proyek menjadi `ProjectCard` (satu proyek, menerima props) dan `Projects` (me-`map` data); kirim semua properti sekaligus dengan spread `{...p}`, dan pakai kondisional untuk proyek tanpa link.',
    rangkuman: [
      '`ProjectCard` = tampilan **satu** proyek (props); `Projects` = section yang me-`map` data menjadi banyak `ProjectCard`.',
      'Bila nama properti data sama dengan nama props, kirim sekaligus: `<ProjectCard key={p.id} {...p} />`.',
      'Link ke tab baru: `target="_blank"` dengan `rel="noreferrer"` (demi keamanan).',
      'Proyek yang belum selesai tidak punya `link`: tampilkan label lain dengan ternary.',
    ],
    soal: [
      {
        tanya: 'Apa kegunaan spread pada `<ProjectCard key={p.id} {...p} />`?',
        benar: 'Mengirim semua properti `p` sekaligus sebagai props',
        salah: ['Menghapus `key` dari kartu', 'Membuat salinan komponen `ProjectCard`', 'Menggabungkan semua proyek menjadi satu kartu besar dengan satu judul'],
        jelas: 'Sama dengan menulis `judul={p.judul} deskripsi={p.deskripsi} ...` satu per satu.',
      },
      {
        tanya: 'Kenapa link yang dibuka di tab baru sebaiknya diberi `rel="noreferrer"`?',
        benar: 'Demi keamanan: halaman baru tidak diberi informasi tentang halaman asal',
        salah: ['Agar link terbuka lebih cepat', 'Agar teks link otomatis berubah warna', 'Agar React mengenali link sebagai komponen dan bukan sebagai tag HTML biasa'],
        jelas: 'Dengan `target="_blank"` praktik amannya adalah menambahkan `rel="noreferrer"` (atau `noopener`).',
      },
      {
        tanya: 'Proyek yang belum selesai tidak punya `link`. Bagaimana menampilkannya?',
        benar: 'Dengan ternary/kondisional: tampilkan link bila ada, label lain bila tidak',
        salah: ['Menghapus proyek tersebut dari data', 'Memakai `link={undefined}` agar elemen otomatis tersembunyi dari halaman tanpa kondisi apa pun', 'Membuat komponen terpisah untuk setiap proyek'],
        jelas: 'Render kondisional memungkinkan satu komponen menangani dua keadaan.',
      },
    ],
  },

  'portofolio-contact': {
    intisari: 'Form kontak memakai satu state object untuk semua field dan satu `handleChange` (`[name]: value`); validasi cukup nilai turunan (`valid`), dan setelah terkirim form diganti pesan sukses lewat ternary.',
    rangkuman: [
      'Satu state object `form = { nama, email, pesan }` dan satu handler: `setForm({ ...form, [name]: value })`.',
      'Validasi sebagai **nilai turunan**: `const valid = form.nama.trim() !== "" && form.email.includes("@") && form.pesan.trim().length >= 10;`.',
      'Tombol Kirim `disabled={!valid}`. Saat submit panggil `e.preventDefault()`.',
      'Ganti tampilan setelah terkirim dengan ternary: `{terkirim ? <p className="sukses">...</p> : <form>...</form>}`.',
    ],
    soal: [
      {
        tanya: 'Kenapa `valid` tidak disimpan sebagai state sendiri?',
        benar: 'Karena bisa dihitung dari state `form`',
        salah: ['Karena state hanya boleh berisi string', 'Karena `valid` harus selalu `true`', 'Karena React tidak mengizinkan boolean disimpan di dalam state komponen mana pun'],
        jelas: 'Itu nilai turunan: menyimpannya terpisah berisiko tidak sinkron dengan isi form.',
      },
      {
        tanya: 'Bagaimana tiga input (nama, email, pesan) bisa memakai **satu** `handleChange`?',
        benar: 'Dengan atribut `name` pada tiap input dan `[name]: value` saat memperbarui state',
        salah: ['Dengan membuat tiga fungsi terpisah yang kebetulan diberi nama yang sama persis di komponen', 'Dengan `useState` tunggal berisi angka', 'Tidak bisa, harus satu fungsi per input'],
        jelas: '`name` input dibaca dari `e.target` untuk menentukan properti mana pada state yang diubah.',
      },
      {
        tanya: 'Kondisi `valid` mana yang memeriksa email dasar dan pesan minimal 10 karakter?',
        benar: '`form.email.includes("@") && form.pesan.trim().length >= 10`',
        salah: ['`form.email === "@" || form.pesan.length === 10`', '`form.email.length && form.pesan`', '`form.email.includes("@") || form.pesan.trim().length >= 10`'],
        jelas: '`&&` menuntut kedua syarat terpenuhi, sedangkan `||` cukup salah satu.',
      },
    ],
  },

  'portofolio-dark-mode': {
    intisari: 'Pola *lifting state up*: state tema disimpan di komponen induk (`App`), lalu **nilai** dan **fungsi pengubahnya** dikirim ke anak lewat props; data mengalir ke bawah, kejadian naik ke atas lewat callback.',
    rangkuman: [
      'Tema berlaku untuk seluruh halaman, jadi state-nya ada di komponen paling atas (`App`), padahal tombolnya ada di `Navbar`.',
      '**Lifting state up:** (1) state di induk, (2) induk mengirim nilai (`gelap`) dan fungsi pengubah (`onToggleTema`) lewat props, (3) anak memanggil fungsi itu saat tombol diklik.',
      'Data mengalir **ke bawah** lewat props; kejadian naik **ke atas** lewat fungsi callback.',
      'Class tema diterapkan di wrapper: `className={gelap ? "halaman gelap" : "halaman"}`.',
    ],
    soal: [
      {
        tanya: 'Navbar perlu mengubah tema, tetapi state `gelap` ada di `App`. Apa solusi yang benar?',
        benar: '`App` mengirim fungsi pengubah (mis. `onToggleTema`) ke `Navbar` lewat props',
        salah: ['`Navbar` mengubah variabel `gelap` milik `App` secara langsung lewat props yang diterimanya', 'Membuat dua state `gelap` di dua komponen dan berharap sinkron', 'Mengubah `document.body` dari `Navbar` tanpa state'],
        jelas: 'Itulah *lifting state up*: anak tidak mengubah state induk langsung; ia memanggil fungsi yang diberikan induk.',
      },
      {
        tanya: 'Ke arah mana data dan kejadian mengalir dalam pola ini?',
        benar: 'Data turun lewat props, kejadian naik lewat fungsi callback',
        salah: ['Keduanya turun lewat props', 'Data naik lewat props ke induk, sedangkan kejadian turun lewat state', 'Keduanya bebas, tidak ada aturan'],
        jelas: 'Aliran satu arah ini membuat komunikasi antar-komponen di React mudah dilacak.',
      },
      {
        tanya: 'Kenapa state tema diletakkan di `App`, bukan di `Navbar`?',
        benar: 'Karena tema memengaruhi seluruh halaman, bukan hanya `Navbar`',
        salah: ['Karena `Navbar` tidak boleh punya state', 'Karena `App` selalu dirender lebih cepat', 'Karena state di `Navbar` tidak bisa diubah oleh tombol yang ada di dalamnya'],
        jelas: 'State ditaruh di leluhur terdekat dari semua komponen yang membutuhkannya.',
      },
    ],
  },

  'portofolio-final': {
    intisari: 'Footer mengambil tahun otomatis dengan `new Date().getFullYear()` agar tidak diganti manual setiap tahun, dan proyek React di editor bisa dipindahkan ke proyek sungguhan lewat Vite lalu dipublikasikan gratis.',
    rangkuman: [
      'Tahun otomatis: `new Date().getFullYear()`. Jangan menulis tahun manual karena harus diganti tiap tahun.',
      'Membawa proyek ke dunia nyata: `npm create vite@latest portofolio-ku -- --template react`, `npm install`, `npm run dev`.',
      'Ganti isi `src/App.jsx` dengan kodemu, salin CSS, ganti data dengan data dirimu, dan (opsional) pecah komponen ke file masing-masing dengan `export default` / `import`.',
      'Publikasikan gratis ke GitHub Pages, Vercel, atau Netlify.',
    ],
    soal: [
      {
        tanya: 'Cara menampilkan tahun sekarang di Footer secara otomatis?',
        benar: '`{new Date().getFullYear()}`',
        salah: ['`{Date.year}`', '`{new Date().year}`', '`{2025}`'],
        jelas: '`getFullYear()` mengembalikan tahun saat ini sehingga footer tidak perlu diubah manual.',
      },
      {
        tanya: 'Perintah mana yang membuat proyek React baru dengan Vite?',
        benar: '`npm create vite@latest portofolio-ku -- --template react`',
        salah: ['`npm install react-create portofolio-ku --global --template vite`', '`node create react app`', '`git init react`'],
        jelas: 'Vite menyediakan template React. Setelah itu jalankan `npm install` lalu `npm run dev`.',
      },
      {
        tanya: 'Layanan mana yang bisa dipakai untuk mempublikasikan portofolio React secara gratis?',
        benar: 'GitHub Pages, Vercel, atau Netlify',
        salah: ['Hanya Microsoft Word', 'Hanya lewat kabel LAN ke komputer teman', 'Tidak ada, harus membeli server dulu'],
        jelas: 'Ketiganya menyediakan hosting situs statis gratis.',
      },
    ],
  },
};
