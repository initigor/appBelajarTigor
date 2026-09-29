import { baris, kode, output, pg, pgk } from './_bersama/buat.js';
import { buatFetchPalsu } from '../lessons/_bersama/apiPalsu.js';

const globalsApi = ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) });

export default {
  id: 'ujian-3-dom-async',
  judul: 'Ujian 3: DOM, Event & Async',
  ikon: '📝',
  deskripsi: 'Mengubah halaman web dengan JavaScript, event, Promise, async/await, dan fetch.',
  chapterIds: [7, 8],
  setelahChapter: 8,
  lulus: 70,
  xp: 120,
  komposisi: { 'pilihan-ganda': 7, 'prediksi-output': 3, kode: 2 },
  soal: [
    // ---------- Chapter 7: DOM & Event ----------
    pg('u3-01', 7, 'Apa yang dikembalikan `document.querySelector(".item")` jika di halaman ada **tiga** elemen berclass `item`?',
      ['Elemen `.item` yang pertama', 'Array berisi ketiga elemen', 'Elemen `.item` yang terakhir', 'null'], 0,
      '`querySelector` hanya mengembalikan elemen pertama yang cocok. Untuk semuanya gunakan `querySelectorAll`.', 'dom-query-selector'),
    pg('u3-02', 7, 'Apa yang dikembalikan `querySelector` jika **tidak ada** elemen yang cocok?', ['null', 'undefined', '[] (array kosong)', 'Terjadi error'], 0,
      'Hasilnya `null`. Karena itu `document.querySelector("#salah").textContent = "x"` menimbulkan error "Cannot set properties of null".', 'dom-query-selector'),
    pg('u3-03', 7, 'Apa beda `textContent` dan `innerHTML` saat **mengisi** elemen?',
      ['`textContent` memperlakukan isi sebagai teks biasa, `innerHTML` mem-parse tag HTML', 'Keduanya sama persis', '`innerHTML` hanya bisa dibaca, tidak bisa diisi', '`textContent` hanya menerima angka'], 0,
      'Dengan `textContent`, tag seperti `<b>` tampil apa adanya sebagai teks (aman). `innerHTML` menafsirkannya sebagai HTML, sehingga berbahaya jika berisi input dari user.', 'dom-query-selector'),
    pg('u3-04', 7, 'Apa yang dilakukan `elemen.classList.toggle("aktif")`?',
      ['Menambahkan class jika belum ada, dan menghapusnya jika sudah ada', 'Selalu menambahkan class "aktif"', 'Selalu menghapus class "aktif"', 'Mengganti seluruh class elemen menjadi "aktif"'], 0,
      '`toggle` membalik keberadaan class, sangat cocok untuk tombol yang menyalakan/mematikan sesuatu.', 'dom-classlist-style'),
    pgk('u3-05', 7, 'Manakah cara yang benar memasang aksi `tampilkan` saat sebuah tombol diklik?',
      ['tombol.addEventListener("click", () => tampilkan())', 'tombol.addEventListener("click", tampilkan())', 'tombol.addEventListener(click, tampilkan)', 'tombol.click(tampilkan)'], 0,
      'Argumen kedua harus berupa **fungsi** yang dijalankan nanti. `tampilkan()` (dengan kurung) langsung memanggilnya sekarang dan mengirim hasilnya.', 'dom-event-click'),
    pg('u3-06', 7, 'Untuk apa `e.preventDefault()` pada event `submit` sebuah form?',
      ['Mencegah browser me-reload halaman (perilaku bawaan submit)', 'Menghapus isi semua input', 'Menghentikan event agar tidak menjalar ke elemen induk', 'Mengirim data form ke server'], 0,
      'Secara bawaan, submit form memuat ulang halaman. `preventDefault()` membatalkannya supaya kamu bisa memproses form dengan JavaScript.', 'dom-input-form'),
    pg('u3-07', 7, 'Nilai `input.value` dari sebuah `<input>` bertipe apa?', ['string', 'number', 'boolean', 'Tergantung isinya'], 0,
      'Nilainya **selalu string**, walaupun user mengetik angka. Ubah dengan `Number(input.value)` jika perlu dihitung.', 'dom-input-form'),
    pg('u3-08', 7, 'Urutan yang benar untuk menambahkan `<li>` baru ke `<ul id="daftar">`?',
      ['createElement("li") → isi textContent → append ke #daftar', 'append ke #daftar → createElement("li") → isi textContent', 'Isi textContent → append → createElement("li")', 'innerHTML = "li" pada document'], 0,
      'Buat elemennya dulu (belum tampil), isi, baru pasang ke halaman dengan `append`.', 'dom-create-element'),
    pg('u3-09', 7, 'Tombol "Hapus" berada **di dalam** `<li>` yang juga punya event klik. Apa fungsi `e.stopPropagation()` di handler tombol?',
      ['Mencegah klik menjalar (bubbling) ke `<li>` di atasnya', 'Mencegah halaman di-reload', 'Menghapus event listener milik `<li>`', 'Menonaktifkan tombol'], 0,
      'Klik pada elemen anak "menggelembung" ke elemen induk. `stopPropagation()` menghentikannya, sehingga klik tombol tidak ikut memicu handler `<li>`.', 'proyek-todo-dom'),

    // ---------- Chapter 8: Async ----------
    pg('u3-10', 8, 'Apa yang terjadi pada baris kode **setelah** `setTimeout(fn, 1000)`?',
      ['Langsung dijalankan; `fn` baru berjalan 1 detik kemudian', 'Menunggu 1 detik dulu, lalu lanjut (seperti sleep)', '`fn` dijalankan saat itu juga', 'Terjadi error'], 0,
      '`setTimeout` hanya **menjadwalkan**. Program tidak berhenti menunggu, dan itulah yang membuat halaman tetap responsif.', 'async-settimeout'),
    pg('u3-11', 8, 'Sebuah Promise selalu berada di salah satu dari tiga keadaan. Apa saja?',
      ['pending, fulfilled, rejected', 'start, running, done', 'open, closed, error', 'waiting, success, timeout'], 0,
      '`pending` (menunggu), `fulfilled` (berhasil, punya nilai), dan `rejected` (gagal, punya error).', 'async-promise-then'),
    pg('u3-12', 8, 'Apa yang **selalu** dikembalikan oleh sebuah fungsi `async`?', ['Sebuah Promise', 'Nilai yang di-return secara langsung', 'undefined', 'Object berisi properti data'], 0,
      'Fungsi `async` selalu mengembalikan Promise. Nilai `return`-nya menjadi nilai Promise itu, jadi pemanggil harus memakai `await` atau `.then`.', 'async-await'),
    pg('u3-13', 8, 'Di mana `await` boleh dipakai?',
      ['Di dalam fungsi `async` (atau di level teratas sebuah modul)', 'Di fungsi biasa mana saja', 'Hanya di dalam loop', 'Hanya di dalam blok try/catch'], 0,
      '`await` hanya valid di dalam fungsi yang ditandai `async`. Di fungsi biasa, itu SyntaxError.', 'async-await'),
    pg('u3-14', 8, 'Server menjawab **404** untuk `fetch("/api/x")`. Apa yang terjadi pada Promise `fetch` tersebut?',
      ['Promise tetap berhasil; kamu perlu mengecek `res.ok` sendiri', 'Promise otomatis di-reject', 'Program berhenti dengan error', '`res.json()` otomatis melempar error'], 0,
      '`fetch` hanya reject jika **koneksinya** gagal. Jawaban 404/500 tetap dianggap berhasil, jadi cek `res.ok` (atau `res.status`) sendiri.', 'async-try-catch'),
    pg('u3-15', 8, 'Mengapa `await Promise.all([a(), b(), c()])` lebih cepat daripada tiga `await` berurutan?',
      ['Ketiga operasi dimulai bersamaan (paralel)', 'Promise.all memakai koneksi internet yang lebih cepat', '`await` membuat browser macet', 'Promise.all melewati error'], 0,
      'Dengan `Promise.all` semua Promise dimulai sekaligus, jadi total waktunya kira-kira sama dengan yang paling lama, bukan jumlah ketiganya.', 'async-promise-all'),
    pg('u3-16', 8, 'Pada `try { await gagal(); } catch (e) { ... }`, kapan blok `catch` dijalankan?',
      ['Saat Promise yang di-await di-reject (gagal)', 'Selalu, setelah blok try', 'Hanya jika ada SyntaxError', 'Saat blok try selesai tanpa masalah'], 0,
      'Promise yang reject berubah menjadi exception saat di-`await`, sehingga bisa ditangkap `try/catch` biasa.', 'async-try-catch'),
    pg('u3-17', 8, 'Apa fungsi `clearInterval(id)`?',
      ['Menghentikan pengulangan yang dibuat oleh `setInterval`', 'Mengosongkan semua timer di halaman', 'Menjalankan callback interval sekarang juga', 'Menghapus variabel `id`'], 0,
      '`setInterval` mengembalikan id. Tanpa `clearInterval(id)`, callback akan terus dijalankan berulang-ulang.', 'async-settimeout'),
    pg('u3-18', 8, 'Bagaimana menangkap error dari rantai Promise bergaya `then`?',
      ['Menambahkan `.catch((e) => ...)` di akhir rantai', 'Menambahkan `.error((e) => ...)`', 'Menambahkan `.fail((e) => ...)`', 'Menambahkan `.onError((e) => ...)`'], 0,
      '`.catch` menangkap error dari bagian mana pun di rantai sebelumnya.', 'async-promise-then'),

    // ---------- Prediksi output ----------
    output('u3-o1', 8,
      baris('console.log("A");', 'setTimeout(() => console.log("B"), 0);', 'console.log("C");'),
      baris('A', 'C', 'B'),
      'Callback `setTimeout` (walaupun 0 ms) selalu berjalan **setelah** kode sinkron yang sedang berjalan selesai. Urutannya: A, C, lalu B.', 'async-settimeout'),
    output('u3-o2', 8,
      baris('Promise.resolve().then(() => console.log("promise"));', 'setTimeout(() => console.log("timeout"), 0);', 'console.log("sync");'),
      baris('sync', 'promise', 'timeout'),
      'Urutan prioritas: kode sinkron dulu (`sync`), lalu callback Promise (microtask), baru callback timer (`timeout`).', 'async-promise-then'),
    output('u3-o3', 8,
      baris('async function ambil() {', '  console.log("mulai");', '  await null;', '  console.log("selesai");', '}', 'ambil();', 'console.log("lanjut");'),
      baris('mulai', 'lanjut', 'selesai'),
      'Fungsi async berjalan sinkron sampai bertemu `await` pertama (mencetak "mulai"). Setelah itu ia "menunggu" dan kode pemanggil lanjut ("lanjut"), baru sisa fungsi berjalan.', 'async-await'),
    output('u3-o4', 8,
      baris(
        'const p = new Promise((resolve, reject) => {',
        '  reject(new Error("gagal"));',
        '});',
        'p.then(() => console.log("ok"))',
        '  .catch((e) => console.log("error:", e.message))',
        '  .then(() => console.log("akhir"));',
      ),
      baris('error: gagal', 'akhir'),
      '`then` pertama dilewati karena Promise reject. `catch` menangani error dan mengembalikan promise yang berhasil, sehingga `then` terakhir tetap berjalan ("akhir").', 'async-membuat-promise'),
    output('u3-o5', 8,
      baris(
        'const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));',
        'async function main() {',
        '  await tunggu(30);',
        '  console.log("dua");',
        '}',
        'main();',
        'setTimeout(() => console.log("satu"), 10);',
      ),
      baris('satu', 'dua'),
      '`main` menunggu 30 ms sebelum mencetak "dua", sedangkan timer di bawahnya hanya 10 ms, sehingga "satu" lebih dulu.', 'async-membuat-promise'),
    output('u3-o6', 8,
      baris(
        'async function f() {',
        '  try {',
        '    await Promise.reject(new Error("x"));',
        '    console.log("tidak");',
        '  } catch (e) {',
        '    console.log("tangkap", e.message);',
        '  } finally {',
        '    console.log("selesai");',
        '  }',
        '}',
        'f();',
        'console.log("luar");',
      ),
      baris('luar', 'tangkap x', 'selesai'),
      '`f()` berhenti di `await` sehingga "luar" tercetak lebih dulu. Lalu Promise yang reject melempar error ke `catch`, dan `finally` selalu dijalankan. Baris "tidak" dilewati.', 'async-try-catch'),

    // ---------- Menulis kode ----------
    kode('u3-k1', 7, {
      jenis: 'dom',
      pelajaran: 'dom-classlist-style',
      html: '<p id="pesan">Halo</p>\n<button id="toggle">Ubah</button>',
      css: '.aktif { color: #6d4aff; font-weight: bold; }',
      tugas: baris(
        'Halaman punya `<p id="pesan">` (isi awal `Halo`) dan tombol `#toggle`.',
        '',
        'Setiap kali tombol **diklik**, ubah `#pesan` bergantian:',
        '- klik ke-1: teks menjadi `Selamat tinggal` **dan** `#pesan` mendapat class `aktif`',
        '- klik ke-2: teks kembali `Halo` **dan** class `aktif` dihapus',
        '- dan seterusnya (klik ke-3 seperti ke-1)',
      ),
      kodeAwal: 'const pesan = document.querySelector("#pesan");\nconst tombol = document.querySelector("#toggle");\n\n// tulis kodemu di sini\n',
      solusi: baris(
        'const pesan = document.querySelector("#pesan");',
        'const tombol = document.querySelector("#toggle");',
        '',
        'tombol.addEventListener("click", () => {',
        '  const aktif = pesan.classList.toggle("aktif");',
        '  pesan.textContent = aktif ? "Selamat tinggal" : "Halo";',
        '});',
        '',
      ),
      penjelasan: '`classList.toggle` mengembalikan `true` jika class baru saja ditambahkan, jadi hasilnya bisa dipakai langsung untuk memilih teks lewat ternary.',
      tes: [
        {
          nama: 'toggle pesan',
          async cek(ctx) {
            const pesan = ctx.cari('#pesan');
            if (ctx.teks('#pesan') !== 'Halo') return 'Awalnya teks #pesan harus tetap "Halo".';
            await ctx.klik('#toggle');
            if (ctx.teks('#pesan') !== 'Selamat tinggal') return `Setelah klik pertama, #pesan berisi "${ctx.teks('#pesan')}", seharusnya "Selamat tinggal".`;
            if (!pesan.classList.contains('aktif')) return 'Setelah klik pertama, #pesan harus punya class "aktif".';
            await ctx.klik('#toggle');
            if (ctx.teks('#pesan') !== 'Halo') return `Setelah klik kedua, #pesan berisi "${ctx.teks('#pesan')}", seharusnya "Halo".`;
            if (pesan.classList.contains('aktif')) return 'Setelah klik kedua, class "aktif" harus dihapus.';
            await ctx.klik('#toggle');
            return ctx.teks('#pesan') === 'Selamat tinggal' || 'Setelah klik ketiga, teks harus kembali "Selamat tinggal".';
          },
        },
      ],
    }),
    kode('u3-k2', 7, {
      jenis: 'dom',
      pelajaran: 'dom-input-form',
      html: '<textarea id="teks" rows="3"></textarea>\n<p id="hitung">0 karakter</p>',
      css: '.batas { color: #d93f5c; font-weight: bold; }',
      tugas: baris(
        'Setiap kali isi `<textarea id="teks">` **berubah** (event `input`), perbarui `<p id="hitung">`:',
        '',
        '- teksnya menjadi `<jumlah> karakter` (jumlah = panjang isi textarea), mis. `4 karakter`',
        '- jika panjangnya **lebih dari 20**, beri class `batas`; jika tidak, class itu harus tidak ada',
      ),
      kodeAwal: 'const teks = document.querySelector("#teks");\nconst hitung = document.querySelector("#hitung");\n\n// tulis kodemu di sini\n',
      solusi: baris(
        'const teks = document.querySelector("#teks");',
        'const hitung = document.querySelector("#hitung");',
        '',
        'teks.addEventListener("input", () => {',
        '  const panjang = teks.value.length;',
        '  hitung.textContent = panjang + " karakter";',
        '  hitung.classList.toggle("batas", panjang > 20);',
        '});',
        '',
      ),
      penjelasan: 'Event `input` terpicu di setiap perubahan isi. `classList.toggle("batas", kondisi)` dengan argumen kedua boolean menambah/menghapus class sesuai kondisi.',
      tes: [
        {
          nama: 'hitung karakter',
          async cek(ctx) {
            const hitung = ctx.cari('#hitung');
            await ctx.ketik('#teks', 'halo');
            if (ctx.teks('#hitung') !== '4 karakter') return `Setelah mengetik "halo", #hitung berisi "${ctx.teks('#hitung')}", seharusnya "4 karakter".`;
            if (hitung.classList.contains('batas')) return 'Untuk 4 karakter, class "batas" tidak boleh ada.';
            await ctx.ketik('#teks', 'x'.repeat(25));
            if (ctx.teks('#hitung') !== '25 karakter') return `Untuk 25 karakter, #hitung berisi "${ctx.teks('#hitung')}", seharusnya "25 karakter".`;
            if (!hitung.classList.contains('batas')) return 'Untuk 25 karakter (lebih dari 20), #hitung harus punya class "batas".';
            await ctx.ketik('#teks', 'x'.repeat(20));
            if (hitung.classList.contains('batas')) return 'Tepat 20 karakter belum melewati batas, jadi class "batas" harus tidak ada.';
            await ctx.ketik('#teks', '');
            return ctx.teks('#hitung') === '0 karakter' || `Untuk teks kosong, #hitung berisi "${ctx.teks('#hitung')}", seharusnya "0 karakter".`;
          },
        },
      ],
    }),
    kode('u3-k3', 8, {
      jenis: 'js',
      pelajaran: 'async-try-catch',
      globals: globalsApi,
      batasWaktu: 6000,
      tugas: baris(
        'Buat fungsi **`async ambilNamaMahasiswa(id)`** yang mengambil data dari server tiruan `GET /api/mahasiswa/<id>` dengan `fetch`.',
        '',
        '- Jika berhasil, server membalas `{ id, nama, ipk }` → kembalikan **nama**-nya.',
        '- Jika mahasiswa tidak ada, server membalas status **404** → kembalikan string `"Tidak ditemukan"`.',
        '',
        '(`fetch` di latihan ini tiruan yang berjalan offline, dengan perilaku yang sama seperti `fetch` sungguhan.)',
      ),
      kodeAwal: 'async function ambilNamaMahasiswa(id) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'async function ambilNamaMahasiswa(id) {',
        '  const res = await fetch("/api/mahasiswa/" + id);',
        '  if (!res.ok) return "Tidak ditemukan";',
        '  const data = await res.json();',
        '  return data.nama;',
        '}',
        '',
      ),
      penjelasan: '`fetch` tidak reject untuk 404, jadi harus dicek lewat `res.ok`. `res.json()` juga Promise sehingga perlu `await`.',
      tes: [
        {
          nama: 'ambilNamaMahasiswa',
          async cek(ctx) {
            for (const [id, harap] of [[2, 'Sinta'], [1, 'Budi'], [99, 'Tidak ditemukan']]) {
              const r = await ctx.panggil('ambilNamaMahasiswa', id);
              if (r !== harap) return `ambilNamaMahasiswa(${id}) menghasilkan ${JSON.stringify(r)}, seharusnya ${JSON.stringify(harap)}.`;
            }
            return true;
          },
        },
      ],
    }),
    kode('u3-k4', 8, {
      jenis: 'js',
      pelajaran: 'async-promise-all',
      globals: globalsApi,
      batasWaktu: 6000,
      tugas: baris(
        'Buat fungsi **`async ambilDuaNama(idA, idB)`** yang mengambil dua mahasiswa dari server tiruan (`GET /api/mahasiswa/<id>`, membalas `{ id, nama, ipk }`) dan mengembalikan string `"<namaA> & <namaB>"`, mis. `"Budi & Sinta"`.',
        '',
        'Setiap request butuh ±0,2 detik. Kedua request harus dijalankan **bersamaan**, bukan satu per satu: tes akan mengukur waktunya.',
      ),
      kodeAwal: 'async function ambilDuaNama(idA, idB) {\n  // tulis kodemu di sini\n}\n',
      solusi: baris(
        'async function ambilNama(id) {',
        '  const res = await fetch("/api/mahasiswa/" + id);',
        '  const data = await res.json();',
        '  return data.nama;',
        '}',
        '',
        'async function ambilDuaNama(idA, idB) {',
        '  const [a, b] = await Promise.all([ambilNama(idA), ambilNama(idB)]);',
        '  return a + " & " + b;',
        '}',
        '',
      ),
      penjelasan: 'Mulai kedua request dulu (tanpa `await` di antaranya), lalu tunggu semuanya dengan `Promise.all`. Total waktunya ±0,2 detik, bukan ±0,4 detik.',
      tes: [
        {
          nama: 'ambilDuaNama',
          async cek(ctx) {
            const mulai = Date.now();
            const r = await ctx.panggil('ambilDuaNama', 1, 2);
            const lama = Date.now() - mulai;
            if (r !== 'Budi & Sinta') return `ambilDuaNama(1, 2) menghasilkan ${JSON.stringify(r)}, seharusnya "Budi & Sinta".`;
            if (lama > 340) return `Butuh ${lama} ms. Request tampaknya berjalan satu per satu; jalankan bersamaan dengan Promise.all supaya cukup ±200 ms.`;
            const r2 = await ctx.panggil('ambilDuaNama', 3, 1);
            return r2 === 'Andi & Budi' || `ambilDuaNama(3, 1) menghasilkan ${JSON.stringify(r2)}, seharusnya "Andi & Budi".`;
          },
        },
      ],
    }),
  ],
};
