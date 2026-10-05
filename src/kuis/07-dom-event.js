// Chapter 7 — DOM & Event. Bentuk entri: lihat src/kuis/validasi.js.
export default {
  'dom-query-selector': {
    intisari: 'DOM adalah pohon object yang mewakili halaman HTML; `querySelector` mencari elemen **pertama** yang cocok dengan selector CSS (atau `null`), dan `textContent` membaca atau mengubah teksnya.',
    rangkuman: [
      '`document.querySelector("#id")`, `(".kelas")`, atau `("ul li")` mengembalikan elemen **pertama** yang cocok. Bila tidak ada hasilnya `null`.',
      'Mengakses properti dari `null` menimbulkan error (`Cannot set properties of null`), jadi pastikan selector-nya benar.',
      '`querySelectorAll(".item")` mengambil **semua** yang cocok; hasilnya mirip array (punya `.length` dan `.forEach`).',
      '`el.textContent` membaca/mengubah teks. Hindari memasukkan teks dari user ke `innerHTML` karena membuka celah XSS.',
    ],
    soal: [
      {
        tanya: 'Selector mana yang mengambil elemen dengan **id** `judul`?',
        benar: '`document.querySelector("#judul")`',
        salah: ['`document.querySelector(".judul")`', '`document.querySelector("judul")`', '`document.getId("judul")`'],
        jelas: 'Selector id memakai tanda `#`, sedangkan `.` untuk class. Tanpa awalan, `"judul"` dianggap nama tag.',
      },
      {
        tanya: 'Apa yang dikembalikan `document.querySelector(".tidak-ada")` jika tidak ada elemen yang cocok?',
        benar: '`null`',
        salah: ['`undefined`', 'Array kosong `[]`', 'Error langsung dilempar'],
        jelas: 'Hasilnya `null`. Error baru muncul ketika kamu mengakses propertinya, misalnya `.textContent`.',
      },
      {
        tanya: 'Method mana yang mengambil **semua** elemen berkelas `item`?',
        benar: '`document.querySelectorAll(".item")`',
        salah: ['`document.querySelector(".item")`', '`document.queryAll(".item")`', '`document.querySelector("*.item")`'],
        jelas: '`querySelector` hanya mengembalikan elemen pertama. `querySelectorAll` mengembalikan seluruh yang cocok.',
      },
      {
        tanya: 'Kenapa untuk teks biasa lebih aman memakai `textContent` daripada `innerHTML`?',
        benar: '`innerHTML` memproses tag HTML',
        salah: ['`textContent` lebih cepat dua kali lipat', '`innerHTML` tidak bisa mengubah teks', '`textContent` otomatis menerjemahkan teks'],
        jelas: '`textContent` menganggap isi sebagai teks murni. `innerHTML` menafsirkan HTML sehingga berisiko bila isinya dari pengguna.',
      },
    ],
  },

  'dom-classlist-style': {
    intisari: 'Cara terbaik mengubah tampilan adalah menambah/menghapus **class CSS** lewat `classList`; `style` dipakai untuk nilai dinamis, dengan nama properti ditulis camelCase (`backgroundColor`).',
    rangkuman: [
      '`el.classList.add("x")`, `.remove("x")`, `.toggle("x")` (ada → hapus, tidak ada → tambah), dan `.contains("x")` (cek).',
      'Aturan tampilan sebaiknya ada di CSS; JS cukup mengatur class mana yang dipakai.',
      '`el.style.backgroundColor = "yellow"`: properti CSS dengan tanda hubung ditulis **camelCase** (`background-color` → `backgroundColor`).',
      'Atribut diubah lewat `setAttribute` / `getAttribute`, atau properti langsung seperti `tombol.disabled = true`.',
    ],
    soal: [
      {
        tanya: 'Method `classList` mana yang menambah class bila belum ada dan menghapusnya bila sudah ada?',
        benar: '`toggle`',
        salah: ['`add`', '`contains`', '`replace`'],
        jelas: '`toggle` membalik keadaan class. `add` hanya menambah, `contains` hanya mengecek.',
      },
      {
        tanya: 'Cara yang benar mengubah warna latar elemen lewat properti `style` adalah ...',
        benar: '`el.style.backgroundColor = "yellow"`',
        salah: ['`el.style.background-color = "yellow"`', '`el.style["background_color"] = "yellow"`', '`el.style.setColor("yellow")`'],
        jelas: 'Tanda hubung tidak bisa dipakai di nama properti JS, jadi `background-color` menjadi `backgroundColor`.',
      },
      {
        tanya: 'Kapan `style` langsung lebih cocok dibanding `classList`?',
        benar: 'Saat nilainya dinamis, misalnya posisi atau ukuran hasil perhitungan',
        salah: ['Selalu, karena lebih ringkas', 'Saat ingin menyembunyikan dan menampilkan elemen', 'Tidak pernah, `style` tidak bisa dipakai'],
        jelas: 'Nilai yang hanya diketahui saat program berjalan tidak bisa ditulis di CSS lebih dulu. Untuk keadaan tetap, class lebih rapi.',
      },
      {
        tanya: 'Apa hasil `kartu.classList.contains("aktif")`?',
        benar: '`true` jika kartu punya class `aktif`, selain itu `false`',
        salah: ['Menambahkan class `aktif` ke kartu', 'Daftar semua class kartu', 'Selalu `true`'],
        jelas: '`contains` hanya mengecek dan mengembalikan boolean, tanpa mengubah elemen.',
      },
    ],
  },

  'dom-event-click': {
    intisari: '`addEventListener("click", callback)` menyimpan callback yang baru dipanggil browser **setiap kali** terjadi klik; data yang harus diingat antarklik disimpan di variabel di luar callback.',
    rangkuman: [
      'Halaman web bersifat **event-driven**: menunggu aksi user lalu menjalankan kode sebagai respons.',
      '`tombol.addEventListener("click", () => { ... })`: callback **tidak dijalankan sekarang**, hanya dipanggil browser saat tombol diklik.',
      'Untuk mengingat nilai di antara klik, simpan di variabel **di luar** callback (mis. `let jumlah = 0;`).',
      'Callback menerima objek event, mis. `e.target` adalah elemen yang diklik. Pola "ubah data → perbarui tampilan" inilah yang kelak diotomatisasi React.',
    ],
    soal: [
      {
        tanya: 'Kapan callback dijalankan pada `tombol.addEventListener("click", callback)`?',
        benar: 'Setiap kali tombol diklik',
        salah: ['Sekali, saat baris itu dijalankan', 'Setelah halaman selesai dimuat saja', 'Hanya pada klik pertama'],
        jelas: '`addEventListener` hanya mendaftarkan fungsinya. Browser memanggil callback itu setiap kali event terjadi.',
      },
      {
        tanya: 'Di mana `jumlah` sebaiknya dideklarasikan agar nilainya bertahan antar klik?\n\n~~~js\ntombol.addEventListener("click", () => {\n  jumlah++;\n});\n~~~',
        benar: 'Di luar callback, mis. `let jumlah = 0;` sebelum `addEventListener`',
        salah: ['Di dalam callback sebagai `let jumlah = 0;`', 'Tidak perlu dideklarasikan', 'Sebagai `const jumlah = 0;` di luar callback'],
        jelas: 'Variabel di dalam callback dibuat ulang setiap klik. Variabel di luar bertahan. Harus `let` karena nilainya berubah (`const` akan error pada `jumlah++`).',
      },
      {
        tanya: 'Apa isi `e.target` di dalam callback event klik?',
        benar: 'Elemen yang diklik',
        salah: ['Teks yang ada di dalam elemen', 'Jumlah klik sejauh ini', '`document` (seluruh halaman)'],
        jelas: 'Objek event membawa informasi kejadian; `target` menunjuk elemen sumber event.',
      },
      {
        tanya: 'Apa yang dimaksud *event-driven programming*?',
        benar: 'Program menunggu kejadian (klik, ketik, dsb.) lalu menjalankan kode sebagai responsnya',
        salah: ['Program dijalankan sekali dari atas ke bawah lalu selesai', 'Program hanya berjalan saat browser ditutup', 'Program yang tidak boleh memakai fungsi'],
        jelas: 'Berbeda dari program C/Python yang berjalan dari atas ke bawah, halaman web bereaksi terhadap aksi pengguna.',
      },
    ],
  },

  'dom-input-form': {
    intisari: 'Isi `<input>` ada di `value` dan **selalu string**; untuk form, dengarkan event `submit` dan panggil `e.preventDefault()` agar halaman tidak reload.',
    rangkuman: [
      '`input.value` berisi teks yang diketik, dan tipenya **selalu string**; ubah dengan `Number()` bila perlu menghitung.',
      'Event `input` terpicu **setiap ketikan**, sedangkan `change` baru terpicu setelah input kehilangan fokus.',
      'Menekan submit di `<form>` secara default me-reload halaman. Dengarkan `submit` dan panggil **`e.preventDefault()`**.',
      'Validasi sederhana: `email.trim() === ""` untuk kosong, `!email.includes("@")` untuk format dasar.',
    ],
    soal: [
      {
        tanya: 'Apa tipe data `input.value` pada `<input type="number">` yang berisi 25?',
        benar: 'String, yaitu `"25"`',
        salah: ['Number, yaitu `25`', 'Boolean `true`', '`undefined` sampai dikonversi'],
        jelas: 'Nilai input selalu string, bahkan untuk input angka. Gunakan `Number(input.value)` jika ingin menghitung.',
      },
      {
        tanya: 'Untuk apa `e.preventDefault()` pada event `submit` sebuah form?',
        benar: 'Mencegah halaman di-reload agar form bisa ditangani dengan JavaScript',
        salah: ['Mencegah user mengetik di input', 'Menghapus isi semua input', 'Mempercepat pengiriman form'],
        jelas: 'Perilaku bawaan submit adalah memuat ulang halaman. `preventDefault` menghentikannya.',
      },
      {
        tanya: 'Event mana yang terpicu pada **setiap ketikan** di sebuah input?',
        benar: '`input`',
        salah: ['`change`', '`submit`', '`blur`'],
        jelas: '`change` baru terpicu setelah input kehilangan fokus, sedangkan `input` terpicu setiap isi berubah.',
      },
      {
        tanya: 'Keuntungan membungkus input dengan `<form>` dibanding hanya tombol biasa adalah ...',
        benar: 'Tombol Enter otomatis men-submit form',
        salah: ['Input otomatis tervalidasi tanpa kode', 'Data otomatis tersimpan permanen', 'Halaman tidak perlu `preventDefault`'],
        jelas: 'Form memberi perilaku submit lewat Enter secara bawaan. Validasi dan penyimpanan tetap tanggung jawab kodemu.',
      },
    ],
  },

  'dom-create-element': {
    intisari: 'Elemen baru dibuat dengan `createElement`, diisi, lalu dipasang dengan `append`; untuk menampilkan data dari array, kosongkan wadah lalu gambar ulang dari data.',
    rangkuman: [
      'Tiga langkah: `const li = document.createElement("li");` → isi (`li.textContent = ...`) → pasang (`daftar.append(li)`).',
      '`append` menambah di akhir, `prepend` di awal, `el.remove()` menghapus elemen itu, `parent.innerHTML = ""` mengosongkan isi.',
      'Menampilkan data dari array: `hobi.forEach((h) => { const span = document.createElement("span"); ...; wadah.append(span); })`.',
      'Bila data berubah, cara sederhana: kosongkan wadah lalu **gambar ulang** dari array. React melakukan ini otomatis dan efisien.',
    ],
    soal: [
      {
        tanya: 'Apa yang terjadi jika kamu hanya menulis `const li = document.createElement("li");` lalu berhenti?',
        benar: 'Elemen dibuat di memori tetapi belum tampil',
        salah: ['`<li>` langsung muncul di bagian bawah halaman', '`<li>` muncul di awal `<body>`', 'Terjadi error karena belum diberi teks'],
        jelas: '`createElement` hanya membuat elemen. Ia baru tampil setelah dipasang, misalnya dengan `append`.',
      },
      {
        tanya: 'Method mana yang menambahkan elemen di **awal** isi parent?',
        benar: '`parent.prepend(el)`',
        salah: ['`parent.append(el)`', '`parent.insert(el)`', '`parent.push(el)`'],
        jelas: '`append` menambah di akhir; `prepend` di awal. `push` adalah method array.',
      },
      {
        tanya: 'Data di array berubah. Cara paling sederhana memperbarui tampilan adalah ...',
        benar: 'Mengosongkan wadah lalu menggambar ulang seluruh isi dari array',
        salah: ['Menambah elemen baru tanpa menghapus yang lama', 'Menunggu browser memperbarui otomatis', 'Mengubah array langsung, tampilan ikut berubah sendiri'],
        jelas: 'DOM tidak otomatis mengikuti data. Menggambar ulang dari data menjaga tampilan selalu sinkron, dan React mengotomatiskannya.',
      },
      {
        tanya: 'Cara menghapus sebuah elemen `el` dari halaman adalah ...',
        benar: '`el.remove()`',
        salah: ['`el = null`', '`document.delete(el)`', '`el.textContent = null`'],
        jelas: '`remove()` melepas elemen dari DOM. Mengosongkan teks hanya menghapus isinya, bukan elemennya.',
      },
    ],
  },

  'proyek-todo-dom': {
    intisari: 'Aplikasi todo dibangun dengan pola **data → tampilan**: simpan data di array, tulis satu fungsi `render()` yang menggambar ulang dari data, dan panggil `render()` setiap data berubah.',
    rangkuman: [
      'Simpan data di array of object, mis. `{ teks: "Belajar", selesai: false }`, dan buat satu fungsi `render()` yang membangun ulang daftar dari array itu.',
      'Setiap perubahan (tambah, centang, hapus): **ubah array lalu panggil `render()`** agar tampilan selalu sinkron dengan data.',
      'Event "menggelembung" ke elemen induk: klik tombol hapus di dalam `<li>` juga dianggap klik `<li>`. Hentikan dengan `e.stopPropagation()`.',
      'Pola ini mendasari cara berpikir React: tampilan adalah hasil dari data.',
    ],
    soal: [
      {
        tanya: 'Dalam pola data → tampilan, apa yang dilakukan **setiap kali** data todo berubah?',
        benar: 'Mengubah array datanya lalu memanggil `render()`',
        salah: ['Mengubah elemen di DOM satu per satu tanpa menyentuh array', 'Me-reload halaman', 'Menghapus array lalu membuat ulang event listener'],
        jelas: 'Sumber kebenaran adalah data. Setelah data berubah, `render()` menggambar ulang tampilan darinya.',
      },
      {
        tanya: 'Untuk apa `e.stopPropagation()` pada tombol hapus yang ada di dalam `<li>`?',
        benar: 'Agar klik tombol tidak ikut dianggap klik pada `<li>` (event menggelembung)',
        salah: ['Agar tombol tidak bisa diklik dua kali', 'Agar `<li>` otomatis terhapus', 'Agar halaman tidak reload'],
        jelas: 'Event naik ke elemen induk. Tanpa `stopPropagation`, handler klik `<li>` (toggle selesai) ikut jalan.',
      },
      {
        tanya: 'Kenapa data todo disimpan di array, bukan hanya di elemen HTML?',
        benar: 'Supaya data menjadi satu sumber kebenaran dan tampilan bisa dibuat ulang darinya',
        salah: ['Karena DOM tidak bisa menyimpan teks', 'Karena array lebih cepat daripada DOM dalam segala hal', 'Karena JavaScript tidak bisa membaca elemen HTML'],
        jelas: 'Kalau data hanya ada di DOM, menghitung/menyaring/menyimpan jadi rumit. Data terpisah dari tampilan membuat logika lebih mudah.',
      },
    ],
  },
};
