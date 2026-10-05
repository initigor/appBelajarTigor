// Chapter 10 — React State. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'react-usestate': {
    intisari: '`useState` memberi komponen "ingatan" yang bertahan antar-render **dan** memberi tahu React untuk menggambar ulang saat nilainya berubah; ubah state hanya lewat fungsi setter, bukan langsung.',
    rangkuman: [
      'Variabel biasa (`let jumlah = 0`) tidak membuat React menggambar ulang, dan nilainya kembali ke awal tiap render.',
      '`const [jumlah, setJumlah] = useState(0);` mengembalikan `[nilaiSekarang, fungsiPengubah]` (destructuring array). `0` adalah nilai awal.',
      '**Jangan** mengubah langsung (`jumlah++`). Selalu `setJumlah(nilaiBaru)`; React lalu menjalankan ulang komponen dan memperbarui DOM hanya di bagian yang berubah.',
      'Event ditulis camelCase dan menerima **fungsi**: `onClick={() => setJumlah(0)}`; `onClick={setJumlah(0)}` dipanggil saat render → loop tak berujung. Hooks hanya dipanggil di level teratas komponen.',
    ],
    soal: [
      {
        tanya: 'Kenapa angka tidak berubah di layar pada kode ini?\n\n~~~jsx\nfunction Counter() {\n  let jumlah = 0;\n  return <button onClick={() => { jumlah++; }}>{jumlah}</button>;\n}\n~~~',
        benar: 'React tidak tahu `jumlah` berubah, dan nilainya kembali ke 0 setiap render',
        salah: ['Karena `onClick` tidak bisa dipakai pada `<button>`', 'Karena `jumlah++` tidak valid di dalam arrow function yang dipakai sebagai event handler', 'Karena `let` tidak boleh dipakai di komponen'],
        jelas: 'Variabel biasa tidak memicu render ulang. Gunakan state (`useState`) agar React tahu kapan harus memperbarui tampilan.',
      },
      {
        tanya: 'Mana cara yang benar menambah state `jumlah`?',
        benar: '`setJumlah(jumlah + 1)`',
        salah: ['`jumlah = jumlah + 1`', '`jumlah++`', '`useState(jumlah + 1)`'],
        jelas: 'State hanya boleh diubah lewat fungsi setter. Mengubah variabelnya langsung tidak memicu render.',
      },
      {
        tanya: 'Apa yang terjadi pada `<button onClick={setJumlah(0)}>`?',
        benar: '`setJumlah(0)` dipanggil saat render, bukan saat diklik',
        salah: ['Tombol mereset angka ke 0 hanya saat diklik, tidak ada efek samping lain', 'Tidak terjadi apa-apa karena nilainya sudah 0', 'Tombol otomatis menjadi nonaktif'],
        jelas: 'Penulisan `setJumlah(0)` adalah pemanggilan langsung. Yang diberikan ke `onClick` harus fungsi: `() => setJumlah(0)`.',
      },
      {
        tanya: 'Apa yang dikembalikan `useState(0)`?',
        benar: 'Array berisi `[nilaiSekarang, fungsiPengubah]`',
        salah: ['Object `{ nilai, ubah }` dengan dua properti bernama tetap', 'Hanya angka `0`', 'Sebuah Promise'],
        jelas: 'Itu sebabnya hasilnya langsung dibongkar dengan destructuring array: `const [jumlah, setJumlah] = ...`.',
      },
    ],
  },

  'react-toggle-boolean': {
    intisari: 'State boolean cocok untuk dua kondisi (buka/tutup, suka/tidak); toggle dengan `!nilai`, dan bila nilai baru bergantung pada yang lama, pakai updater function `setX((lama) => ...)`.',
    rangkuman: [
      'Toggle: `setTerbuka(!terbuka)`. Tampil bersyarat: `{terbuka && <p>...</p>}` atau ternary `{terbuka ? "Tutup" : "Buka"}`.',
      'Satu komponen boleh punya **banyak** `useState`; masing-masing berdiri sendiri.',
      '**Updater function:** `setJumlahSuka((lama) => lama + 1)` dipanggil React dengan nilai **terbaru**, aman untuk beberapa update beruntun.',
      'Pakai updater function setiap kali nilai baru dihitung dari nilai lama.',
    ],
    soal: [
      {
        tanya: 'Cara yang benar membalik state boolean `terbuka` saat tombol diklik?',
        benar: '`setTerbuka(!terbuka)`',
        salah: ['`terbuka = !terbuka`', '`setTerbuka(terbuka)`', '`!setTerbuka(terbuka)`'],
        jelas: '`!terbuka` membalik nilainya, lalu setter memberi tahu React. Menugaskan langsung ke variabel tidak memicu render.',
      },
      {
        tanya: 'Kapan updater function, misalnya `setJumlah((lama) => lama + 1)`, sebaiknya dipakai?',
        benar: 'Saat nilai baru dihitung dari nilai lama',
        salah: ['Hanya saat state berupa array', 'Hanya untuk state boolean', 'Tidak pernah, `setJumlah(jumlah + 1)` selalu lebih baik'],
        jelas: 'React memberikan nilai terbaru ke fungsi itu, sehingga beberapa update beruntun tidak saling menimpa.',
      },
      {
        tanya: 'Apa yang ditampilkan `{terbuka && <p>Isi rahasia</p>}` ketika `terbuka` bernilai `false`?',
        benar: 'Tidak ada apa-apa',
        salah: ['Tulisan `false`', 'Paragraf kosong', 'Error'],
        jelas: 'React tidak menampilkan `false`. Karena short-circuit, `<p>` tidak pernah dibuat.',
      },
      {
        tanya: 'Bolehkah satu komponen memakai `useState` lebih dari sekali?',
        benar: 'Boleh, setiap `useState` menyimpan nilai sendiri',
        salah: ['Tidak boleh, setiap komponen hanya diizinkan memakai satu `useState`', 'Boleh, tetapi semuanya berbagi satu nilai', 'Hanya boleh bila berupa boolean'],
        jelas: 'Misalnya `disukai` dan `jumlahSuka` bisa menjadi dua state terpisah dalam komponen yang sama.',
      },
    ],
  },

  'react-onchange-input': {
    intisari: 'Pada input terkontrol, isi input disimpan di state: `value={state}` dan `onChange={(e) => setState(e.target.value)}`; jangan buat state untuk nilai yang bisa dihitung dari state lain.',
    rangkuman: [
      'Input terkontrol: `<input value={nama} onChange={(e) => setNama(e.target.value)} />`.',
      'Alur: user mengetik → `onChange` → `setNama(e.target.value)` → React render ulang → input dan bagian lain ikut menampilkan nilai baru.',
      '`value` **tanpa** `onChange` membuat input read-only (tidak bisa diketik).',
      '**Derived state:** nilai yang bisa dihitung dari state lain (mis. `teks.length`) cukup variabel biasa, tidak perlu state tambahan.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi pada `<input value={nama} />` yang **tidak** punya `onChange`?',
        benar: 'Input tidak bisa diketik (read-only)',
        salah: ['Input bisa diketik seperti biasa karena browser mengurus nilainya sendiri', 'State `nama` otomatis ikut berubah', 'Terjadi error `SyntaxError`'],
        jelas: 'Dengan `value` dikontrol state, input hanya menampilkan state. Tanpa `onChange` yang memperbarui state, isinya tidak bisa berubah.',
      },
      {
        tanya: 'Pada `onChange={(e) => setNama(e.target.value)}`, apa isi `e.target.value`?',
        benar: 'Teks terbaru yang ada di dalam input',
        salah: ['Nilai lama sebelum diketik', 'Nama elemen input', 'Angka jumlah karakter'],
        jelas: '`e.target` adalah elemen input yang memicu event, dan `value`-nya berisi teks terbarunya.',
      },
      {
        tanya: 'Manakah cara terbaik menampilkan jumlah karakter dari state `teks`?',
        benar: '`const jumlahKarakter = teks.length;` (variabel biasa)',
        salah: ['Membuat `useState(0)` terpisah dan memperbaruinya di `onChange`', 'Menyimpan jumlah karakter di `localStorage`', 'Mengubah `teks.length` langsung di JSX lewat `teks.length = n`'],
        jelas: 'Itu **derived state**: bisa dihitung dari state lain, jadi tidak perlu disimpan terpisah (dan bisa jadi tidak sinkron).',
      },
      {
        tanya: 'Apa keuntungan input terkontrol?',
        benar: 'Nilai input selalu tersedia di state sehingga mudah divalidasi dan dipakai di tempat lain',
        salah: ['Input tidak lagi memicu event apa pun', 'Browser otomatis memvalidasi isinya tanpa perlu kode tambahan sama sekali', 'Kode menjadi lebih pendek daripada input biasa'],
        jelas: 'Karena isi ada di state, kamu bisa menghitung, memvalidasi, atau menampilkannya di bagian lain dengan mudah.',
      },
    ],
  },

  'react-form-terkontrol': {
    intisari: 'Pasang `onSubmit` di `<form>` (bukan `onClick` di tombol), panggil `e.preventDefault()`, dan karena nilai ada di state, mengosongkan form cukup dengan `setState("")`.',
    rangkuman: [
      '`<form onSubmit={handleSubmit}>` dengan `e.preventDefault()` di dalamnya (tetap wajib seperti di DOM).',
      'Pakai `onSubmit` di form, bukan `onClick` di tombol, supaya menekan **Enter** juga berfungsi.',
      'Mengosongkan form: `setEmail("")`. Validasi dari state: `const valid = email.includes("@")` lalu `disabled={!valid}`.',
      'Pesan hasil juga disimpan di state: `{pesan && <p className="sukses">{pesan}</p>}`.',
    ],
    soal: [
      {
        tanya: 'Kenapa `onSubmit` dipasang di `<form>`, bukan `onClick` di tombol kirim?',
        benar: 'Agar menekan Enter di input juga mengirim form',
        salah: ['Karena `onClick` tidak bisa dipakai di React untuk tombol bertipe submit', 'Karena `onSubmit` lebih cepat', 'Karena tombol tidak boleh punya event'],
        jelas: 'Event `submit` terpicu baik lewat tombol maupun Enter.',
      },
      {
        tanya: 'Cara paling sederhana mengosongkan input terkontrol setelah submit?',
        benar: 'Memanggil `setEmail("")`',
        salah: ['`email = ""`', 'Me-reload halaman dengan `window.location`', '`document.querySelector("input").value = ""`'],
        jelas: 'Karena nilai input berasal dari state, cukup ubah state-nya.',
      },
      {
        tanya: 'Untuk apa `e.preventDefault()` di `handleSubmit`?',
        benar: 'Mencegah browser me-reload halaman saat form dikirim',
        salah: ['Mencegah state berubah', 'Menghapus semua input', 'Mengirim data form ke server secara otomatis tanpa fetch'],
        jelas: 'Perilaku bawaan submit form adalah memuat ulang halaman. Di aplikasi React hal itu dihindari.',
      },
      {
        tanya: 'Cara menonaktifkan tombol kirim bila email belum valid?',
        benar: '`<button disabled={!valid}>`',
        salah: ['`<button if={valid}>`', '`<button disabled="valid">` karena nilainya harus berupa string', '`<button hidden={valid}>`'],
        jelas: 'Atribut `disabled` menerima boolean dari ekspresi. Bila `valid` false, `!valid` menjadi true dan tombol nonaktif.',
      },
    ],
  },

  'react-state-array': {
    intisari: 'State array **tidak boleh dimutasi**: React membandingkan referensi dengan `===`, jadi selalu buat array baru (`[...arr, item]`, `filter`, `map`); dan item daftar butuh `key` unik.',
    rangkuman: [
      'Mutasi (`skills.push("JS"); setSkills(skills)`) mempertahankan referensi yang sama, jadi React menganggap **tidak ada perubahan**.',
      'Tambah: `[...arr, item]`; hapus: `arr.filter((x) => x !== item)`; ubah: `arr.map((x) => (x === lama ? baru : x))`.',
      'Hindari `push`, `pop`, `splice`, `sort`, dan `arr[i] = ...` langsung pada state.',
      'Menampilkan daftar: `skills.map((s) => <li key={s}>{s}</li>)`. `key` adalah identitas unik item agar React bisa melacaknya.',
    ],
    soal: [
      {
        tanya: 'Kenapa tampilan tidak diperbarui pada kode ini?\n\n~~~jsx\nskills.push("JS");\nsetSkills(skills);\n~~~',
        benar: 'Referensi array sama',
        salah: ['Karena `push` tidak ada di JavaScript', 'Karena `setSkills` hanya menerima string', 'Karena array tidak bisa disimpan di state'],
        jelas: 'React membandingkan state lama dan baru dengan `===`. Array yang sama referensinya dianggap tidak berubah.',
      },
      {
        tanya: 'Cara yang benar menambah `"JS"` ke state array `skills`?',
        benar: '`setSkills([...skills, "JS"])`',
        salah: ['`skills.push("JS")`', '`setSkills(skills.push("JS"))`', '`skills[skills.length] = "JS"`'],
        jelas: 'Spread membuat array baru. `push` memutasi array lama, dan hasilnya (angka panjang baru) bukan array.',
      },
      {
        tanya: 'Cara yang benar menghapus `"CSS"` dari state array tanpa mutasi?',
        benar: '`setSkills(skills.filter((s) => s !== "CSS"))`',
        salah: ['`skills.pop()`', '`skills.splice(1, 1); setSkills(skills);` lalu render ulang manual', '`setSkills(skills.delete("CSS"))`'],
        jelas: '`filter` menghasilkan array baru tanpa elemen itu. `pop` dan `splice` memutasi array lama.',
      },
      {
        tanya: 'Untuk apa atribut `key` pada `<li key={s}>` saat memakai `map`?',
        benar: 'Identitas unik tiap item agar React bisa melacak perubahan daftar',
        salah: ['Menentukan urutan tampil item di layar, dari yang terkecil', 'Mengubah item menjadi tombol', 'Menyimpan teks item ke state'],
        jelas: '`key` membantu React mencocokkan item lama dan baru dengan tepat saat daftar berubah.',
      },
    ],
  },

  'react-state-object': {
    intisari: 'State object juga tidak boleh dimutasi: buat object baru dengan spread (`setProfil({ ...profil, nama })`); lupa `...profil` menghapus properti lain, dan satu handler untuk banyak input memakai `name` serta computed property `[name]`.',
    rangkuman: [
      'Nilai yang saling berkaitan (mis. isi form) bisa disimpan dalam satu object: `useState({ nama: "", kota: "", bio: "" })`.',
      '`setProfil` **mengganti seluruh** object. Karena itu selalu sertakan `...profil`: `setProfil({ ...profil, nama: "Budi" })`.',
      'Satu handler untuk banyak input: beri atribut `name` pada input lalu `setProfil({ ...profil, [name]: value })`.',
      '`[name]: value` adalah **computed property**: nama properti diambil dari isi variabel `name`. Jika `name = "kota"`, hasilnya `{ kota: value }`.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi?\n\n~~~jsx\nconst [profil, setProfil] = useState({ nama: "", kota: "" });\nsetProfil({ nama: "Budi" });\n~~~',
        benar: 'Properti `kota` hilang karena object diganti seluruhnya',
        salah: ['Hanya `nama` yang berubah, `kota` tetap', 'Terjadi error karena properti kurang', '`kota` menjadi `undefined` tetapi tetap ada sebagai kunci'],
        jelas: 'Setter state mengganti nilai lama dengan yang baru, tidak menggabungkan. Gunakan `{ ...profil, nama: "Budi" }`.',
      },
      {
        tanya: 'Berapa isi object yang dibuat `{ [name]: value }` jika `name = "kota"` dan `value = "Bandung"`?',
        benar: '`{ kota: "Bandung" }`',
        salah: ['`{ name: "Bandung" }`', '`{ "name": "kota", "value": "Bandung" }`', '`["kota", "Bandung"]`'],
        jelas: 'Kurung siku membuat nama properti diambil dari isi variabel, bukan ditulis harfiah.',
      },
      {
        tanya: 'Cara memperbarui satu properti `nama` pada state object `profil` tanpa mutasi?',
        benar: '`setProfil({ ...profil, nama: "Budi" })`',
        salah: ['`profil.nama = "Budi"; setProfil(profil)`', '`setProfil(profil.nama = "Budi")`', '`setProfil.nama("Budi")`'],
        jelas: 'Spread menyalin semua properti lama ke object baru lalu menimpa `nama`. Mutasi langsung mempertahankan referensi yang sama.',
      },
      {
        tanya: 'Kenapa satu fungsi `handleChange` bisa dipakai oleh banyak input?',
        benar: 'Karena atribut `name` tiap input dibaca dari `e.target` untuk menentukan properti yang diubah',
        salah: ['Karena React otomatis menggabungkan semua input', 'Karena `onChange` hanya boleh dipakai sekali di satu komponen', 'Karena `e.target.value` selalu berisi seluruh object profil'],
        jelas: '`const { name, value } = e.target;` lalu `[name]: value` mengubah properti yang sesuai dengan input yang sedang diketik.',
      },
    ],
  },

  'proyek-todo-react': {
    intisari: 'Todo List React cukup mengubah state (tanpa `createElement` atau `render()` manual): item ditambah/diubah/dihapus dengan spread, `map`, dan `filter`, dan daftar yang ditampilkan dihitung dari `todos` + `filter` (bukan disimpan sebagai state terpisah).',
    rangkuman: [
      'Bentuk data: `{ id, teks, selesai }`. `id` dipakai sebagai `key` dan untuk mencari item yang diubah/dihapus (mis. `Date.now()` atau counter).',
      'Toggle selesai: `setTodos(todos.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)))`; hapus: `setTodos(todos.filter((t) => t.id !== id))`.',
      'Simpan **filter** di state (`"semua" | "aktif" | "selesai"`), lalu **hitung** daftar tampil dari `todos` dan `filter`.',
      'Jangan simpan hasil filter di state terpisah: ia akan tidak sinkron dengan `todos` (derived state).',
    ],
    soal: [
      {
        tanya: 'Cara menandai todo dengan `id` tertentu sebagai selesai **tanpa mengubah** array lama?',
        benar: '`setTodos(todos.map((t) => (t.id === id ? { ...t, selesai: true } : t)))`',
        salah: ['`todos.find((t) => t.id === id).selesai = true`', '`setTodos(todos.push({ id, selesai: true }));` lalu panggil render manual', '`setTodos(todos.filter((t) => t.id === id))`'],
        jelas: '`map` menghasilkan array baru dan hanya item yang cocok yang diganti dengan salinan yang diperbarui.',
      },
      {
        tanya: 'Di mana sebaiknya daftar todo yang **sedang ditampilkan** (hasil filter) disimpan?',
        benar: 'Tidak disimpan, melainkan dihitung dari `todos` dan `filter` saat render',
        salah: ['Di state terpisah yang diperbarui manual', 'Di `localStorage` saja', 'Di variabel global di luar komponen yang diubah setiap kali filter berganti'],
        jelas: 'Menghitungnya setiap render menjamin selalu sinkron dengan data asli. State terpisah mudah tidak konsisten.',
      },
      {
        tanya: 'Kenapa tiap todo diberi `id` unik?',
        benar: 'Untuk `key` di daftar dan untuk mencari item yang akan diubah atau dihapus',
        salah: ['Agar todo otomatis tersimpan di server', 'Agar React tidak perlu me-render item itu setiap kali daftar berubah', 'Agar teks todo tidak boleh sama'],
        jelas: '`id` membuat item bisa diidentifikasi dengan pasti, tidak bergantung posisi di array.',
      },
    ],
  },
};
