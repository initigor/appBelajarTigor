// Terjemahan pesan galat javac/java ke penjelasan ramah berbahasa Indonesia.
// Sumber: Bagian 4 modul Pekan 2 (Daftar Galat Umum) dan Bagian 4 modul Pekan 3 (Peta Galat Umum Pekan 3).
// Dipakai oleh runner Java (server) dan oleh UI latihan "Bedah galat" untuk menunjukkan penjelasan setelah dicoba.

/** @type {{ cocok: RegExp, jenis: 'kompilasi'|'eksekusi', judul: string, penjelasan: string }[]} */
const POLA = [
  // --- Kompilasi: Pekan 2 §4.1 ---
  {
    cocok: /class (\S+) is public, should be declared in a file named/,
    jenis: 'kompilasi',
    judul: 'Nama kelas dan nama berkas tidak sama',
    penjelasan: 'Nama kelas `public` wajib sama persis dengan nama berkasnya (termasuk huruf besar-kecil). Samakan salah satu, bukan keduanya.',
  },
  {
    cocok: /';' expected/,
    jenis: 'kompilasi',
    judul: 'Kurang titik koma',
    penjelasan: "Periksa baris yang disebut dan satu baris sebelumnya — penunjuk galat javac sering menandai baris berikutnya, bukan baris yang benar-benar kurang `;`.",
  },
  {
    cocok: /cannot find symbol[\s\S]*?variable (\S+)/,
    jenis: 'kompilasi',
    judul: 'Variabel tidak dikenal',
    penjelasan: 'Nama variabel salah eja, salah huruf besar-kecil, dideklarasikan di dalam blok `{ }` lain, atau deklarasinya belum tercapai (dipakai sebelum dibuat).',
  },
  {
    cocok: /cannot find symbol[\s\S]*?class Scanner/,
    jenis: 'kompilasi',
    judul: 'Kelas Scanner tidak diimpor',
    penjelasan: 'Tambahkan `import java.util.Scanner;` di baris paling atas berkas, sebelum `public class`.',
  },
  {
    cocok: /incompatible types: possible lossy conversion from double to int/,
    jenis: 'kompilasi',
    judul: 'Penugasan double ke int tanpa casting',
    penjelasan: 'Menyimpan `double` ke variabel `int` membuang bagian pecahannya, jadi Java memaksamu menuliskannya secara sadar: `int x = (int) nilaiDouble;`.',
  },
  {
    cocok: /incompatible types: String cannot be converted to/,
    jenis: 'kompilasi',
    judul: 'String tidak bisa langsung jadi angka',
    penjelasan: 'Biasanya karena memakai `Scanner.nextLine()` padahal yang dibutuhkan angka. Pakai `nextInt()`/`nextDouble()`, atau ubah dengan `Integer.parseInt(...)`/`Double.parseDouble(...)`.',
  },
  {
    cocok: /variable (\S+) might not have been initialized/,
    jenis: 'kompilasi',
    judul: 'Variabel lokal belum diberi nilai',
    penjelasan: 'Beda dengan field, variabel lokal di dalam method tidak punya nilai awal otomatis. Beri nilai saat deklarasi, misalnya `int jumlah = 0;`.',
  },
  {
    cocok: /reached end of file while parsing/,
    jenis: 'kompilasi',
    judul: 'Kurung kurawal tidak seimbang',
    penjelasan: 'Hitung jumlah `{` dan `}` — ada yang kurang menutup. Merapikan indentasi kode biasanya membuat ketidakseimbangannya lebih terlihat.',
  },
  {
    cocok: /illegal start of expression/,
    jenis: 'kompilasi',
    judul: 'Struktur pernyataan rusak',
    penjelasan: 'Sering terjadi karena ada satu kurung kurawal penutup `}` yang terlalu awal, sehingga pernyataan berikutnya dianggap berada di luar method/kelas.',
  },
  {
    cocok: /unclosed string literal/,
    jenis: 'kompilasi',
    judul: 'Tanda kutip tidak ditutup',
    penjelasan: 'Periksa baris yang disebut. Ingat: petik tunggal `\'x\'` untuk `char`, petik ganda `"teks"` untuk `String`.',
  },
  {
    cocok: /bad operand types? for binary operator '<'/,
    jenis: 'kompilasi',
    judul: 'Operator tidak berlaku untuk tipe itu',
    penjelasan: 'Sering terjadi karena membandingkan `String` dengan `<`/`>`. Pakai method `compareTo(...)` untuk urutan String, atau `equals(...)` untuk kesamaan.',
  },
  {
    cocok: /int cannot be dereferenced/,
    jenis: 'kompilasi',
    judul: 'Method dipanggil pada tipe primitif',
    penjelasan: 'Tipe primitif (`int`, `double`, dst.) tidak punya method. Kalau butuh method seperti `.length()`, ubah dulu jadi String/objek, misalnya `String.valueOf(angka)`.',
  },
  // --- Kompilasi: Pekan 3 §4.1 (khusus kelas/objek) ---
  {
    cocok: /non-static method \S+ cannot be referenced from a static context/,
    jenis: 'kompilasi',
    judul: 'Method instance dipanggil tanpa objek',
    penjelasan: '`main` bersifat static dan berjalan tanpa objek. Method biasa (instance) hanya bisa dipanggil lewat objek: buat objeknya dulu dengan `new NamaKelas()`, baru panggil method-nya.',
  },
  {
    cocok: /non-static variable \S+ cannot be referenced from a static context/,
    jenis: 'kompilasi',
    judul: 'Field instance diakses tanpa objek',
    penjelasan: 'Sama seperti method instance, field instance (bukan `static`) hanya ada di dalam objek. Akses lewat objek: `objek.field`, bukan langsung dari method static.',
  },
  {
    cocok: / has private access in /,
    jenis: 'kompilasi',
    judul: 'Field/method private disentuh dari luar',
    penjelasan: 'Anggota `private` hanya boleh disentuh dari dalam kelasnya sendiri. Jangan ubah jadi `public`; tambahkan method (getter/setter) di kelas itu yang melakukan apa yang kamu perlukan, lalu panggil method-nya.',
  },
  {
    cocok: /constructor \S+ in class \S+ cannot be applied to given types/,
    jenis: 'kompilasi',
    judul: 'Argumen new tidak cocok dengan constructor',
    penjelasan: 'Baca bagian `required` (yang diminta constructor) dan `found` (yang kamu berikan) pada pesan galat. Jumlah atau tipe argumen `new NamaKelas(...)` harus sama persis dengan salah satu constructor yang ada.',
  },
  {
    cocok: /cannot find symbol[\s\S]*?class \S+/,
    jenis: 'kompilasi',
    judul: 'Kelas tidak ditemukan',
    penjelasan: 'Pastikan berkas kelas itu ikut dikompilasi (`javac *.java`, bukan hanya satu berkas), dan namanya dieja persis sama termasuk huruf besar-kecil.',
  },
  {
    cocok: /cannot find symbol[\s\S]*?method \S+\(/,
    jenis: 'kompilasi',
    judul: 'Method tidak ditemukan / tanda tangan tidak cocok',
    penjelasan: 'Periksa nama method, jumlah parameter, dan tipe parameternya. Method dengan parameter yang berbeda dianggap method yang sama sekali berbeda oleh Java.',
  },
  {
    cocok: /invalid method declaration; return type required/,
    jenis: 'kompilasi',
    judul: 'Constructor tertukar dengan method',
    penjelasan: 'Kamu menulis method dengan nama sama seperti kelasnya tapi memberinya tipe kembalian (termasuk `void`) — itu membuatnya jadi method biasa, bukan constructor. Hapus tipe kembaliannya kalau memang bermaksud membuat constructor.',
  },
  {
    cocok: /call to this\(\) must be first statement in constructor/,
    jenis: 'kompilasi',
    judul: 'this(...) bukan pernyataan pertama',
    penjelasan: 'Pemanggilan constructor lain dengan `this(...)` wajib menjadi baris pertama di dalam constructor. Pindahkan ke atas.',
  },
  {
    cocok: /method does not override or implement a method from a supertype/,
    jenis: 'kompilasi',
    judul: '@Override tidak cocok dengan method manapun',
    penjelasan: 'Nama atau tanda tangan method tidak persis sama dengan yang diwarisi. Untuk `toString`, pastikan tulisannya persis `public String toString()`.',
  },
  {
    cocok: /missing return statement/,
    jenis: 'kompilasi',
    judul: 'ada jalur kode yang tidak mengembalikan nilai',
    penjelasan: 'Method yang tipe kembaliannya bukan `void` harus mengembalikan nilai di **setiap** kemungkinan jalur. Biasanya karena rantai `if` tidak punya `else` di ujung.',
  },
  {
    cocok: /incompatible types: \S+ cannot be converted to String/,
    jenis: 'kompilasi',
    judul: 'Objek dipakai di tempat yang mengharapkan String',
    penjelasan: 'Panggil `.toString()` secara eksplisit, atau gabungkan dengan `"" + objek` supaya Java memanggil `toString()` otomatis.',
  },
  // --- Eksekusi: Pekan 2 §4.2 ---
  {
    cocok: /Main method not found in class|can't find main\(String\[\]\) method/,
    jenis: 'eksekusi',
    judul: 'Titik masuk (main) tidak ditemukan',
    penjelasan: 'Tanda tangan `main` harus persis `public static void main(String[] args)`. Periksa huruf kecil pada kata `main`, dan pastikan ada `static`.',
  },
  {
    cocok: /Could not find or load main class/,
    jenis: 'eksekusi',
    judul: 'Kelas tidak ditemukan saat dijalankan',
    penjelasan: 'Jalankan `java NamaKelas` (tanpa akhiran `.class`/`.java`) dari direktori yang berisi berkas `.class` hasil kompilasi.',
  },
  {
    cocok: /ArrayIndexOutOfBoundsException/,
    jenis: 'eksekusi',
    judul: 'Indeks array di luar batas',
    penjelasan: 'Indeks array yang sah adalah `0` sampai `panjang - 1`. Kesalahan paling umum: memakai `i <= panjang` alih-alih `i < panjang`.',
  },
  {
    cocok: /StringIndexOutOfBoundsException/,
    jenis: 'eksekusi',
    judul: 'Indeks teks di luar batas',
    penjelasan: '`charAt`/`substring` melewati akhir teks. Ingat: `substring(a, b)` tidak menyertakan indeks `b` (batas kanan eksklusif).',
  },
  {
    cocok: /NullPointerException/,
    jenis: 'eksekusi',
    judul: 'Method/field dipanggil pada rujukan kosong (null)',
    penjelasan: 'Variabel rujukan bernilai `null` (belum menunjuk objek apa pun) dipakai memanggil method atau field. Buat objeknya dengan `new` dulu, atau periksa `!= null` sebelum memakainya.',
  },
  {
    cocok: /ArithmeticException: \/ by zero/,
    jenis: 'eksekusi',
    judul: 'Pembagian bulat oleh nol',
    penjelasan: 'Pembagian `int` oleh `0` melempar pengecualian (beda dengan `double / 0.0` yang menghasilkan `Infinity`). Periksa pembaginya sebelum membagi.',
  },
  {
    cocok: /InputMismatchException/,
    jenis: 'eksekusi',
    judul: 'Masukan tidak sesuai tipe',
    penjelasan: '`nextInt()`/`nextDouble()` menerima teks yang bukan angka, atau `nextDouble()` menerima titik padahal setelan sistem menuntut koma (atau sebaliknya).',
  },
  {
    cocok: /NoSuchElementException/,
    jenis: 'eksekusi',
    judul: 'Tidak ada masukan lagi',
    penjelasan: 'Scanner sudah kehabisan baris masukan (atau sudah ditutup dengan `close()` lalu dipakai lagi). Periksa jumlah baris `stdin` yang disediakan tes ini.',
  },
  {
    cocok: /NumberFormatException/,
    jenis: 'eksekusi',
    judul: 'Teks tidak bisa diubah menjadi angka',
    penjelasan: '`Integer.parseInt(...)`/`Double.parseDouble(...)` menerima teks yang memuat spasi atau bukan angka. Tambahkan `.trim()` sebelum mengubahnya.',
  },
  // --- Eksekusi: Pekan 3 §4.2 ---
  {
    cocok: /NullPointerException: Cannot invoke "\S+\(\)"/,
    jenis: 'eksekusi',
    judul: 'Method dipanggil pada elemen array yang masih kosong',
    penjelasan: '`new NamaKelas[n]` membuat array berisi `n` slot `null`, BUKAN `n` objek. Setiap slot harus diisi satu per satu dengan `new NamaKelas(...)` sebelum method-nya dipanggil.',
  },
  {
    cocok: /NullPointerException: Cannot read field/,
    jenis: 'eksekusi',
    judul: 'Field dibaca lewat rujukan kosong',
    penjelasan: 'Sama seperti di atas: elemen array objek masih `null` (belum diisi `new`) saat field-nya dibaca.',
  },
  {
    cocok: /because "this\.\S+" is null/,
    jenis: 'eksekusi',
    judul: 'Field String tidak pernah diisi',
    penjelasan: "Hampir selalu karena baris di constructor tertulis `nama = nama;` (menugaskan parameter ke dirinya sendiri, bukan ke field). Perbaiki jadi `this.nama = nama;`.",
  },
];

/** @returns {{ jenis: string, judul: string, penjelasan: string } | null} */
export function jelaskanGalat(teks) {
  if (!teks) return null;
  for (const p of POLA) {
    if (p.cocok.test(teks)) return { jenis: p.jenis, judul: p.judul, penjelasan: p.penjelasan };
  }
  return null;
}

/** Klasifikasi tiga jenis galat (dipakai lesson "Tiga Jenis Galat" Pekan 2 #9). */
export function jenisGalat({ fase, exitCode, stderr }) {
  if (fase === 'kompilasi') return 'kompilasi';
  if (fase === 'eksekusi' && exitCode !== 0) return 'eksekusi';
  return 'logika'; // keluar dengan sukses tapi hasilnya salah -> baru diketahui dari perbandingan output
}
