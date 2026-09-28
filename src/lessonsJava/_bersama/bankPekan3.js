// Bank soal "Uji Pemahaman" Pekan 3. Minimal 4 varian per pelajaran, kasus baru (bukan salinan modul).
export const bankPekan3 = {
  'java-kelas-objek-rujukan': [
    {
      id: 'p3-rujukan-1',
      lessonId: 'java-kelas-objek-rujukan',
      tipe: 'pilihan-ganda',
      kode: `Rak a = new Rak();
Rak b = a;
b.isi = 5;
System.out.println(a.isi);
`,
      pertanyaan: 'Kelas `Rak` punya field `int isi`. Apa yang tercetak?',
      pilihan: [
        { teks: '5 — karena a dan b menunjuk objek yang sama', benar: true },
        { teks: '0 — karena a punya objeknya sendiri', benar: false },
      ],
      penjelasan: '`Rak b = a;` menyalin rujukan, bukan membuat objek baru. `a` dan `b` menunjuk objek yang sama, jadi perubahan lewat `b` terlihat lewat `a`.',
    },
    {
      id: 'p3-rujukan-2',
      lessonId: 'java-kelas-objek-rujukan',
      tipe: 'isian-singkat',
      pertanyaan: 'Kata kunci apa yang dipakai untuk membuat objek baru di memori (bukan sekadar menyalin rujukan)?',
      kunci: 'new',
      penjelasan: '`new NamaKelas(...)` adalah satu-satunya cara membuat objek baru. Penugasan biasa (`b = a;`) hanya menyalin rujukan.',
    },
    {
      id: 'p3-rujukan-3',
      lessonId: 'java-kelas-objek-rujukan',
      tipe: 'pilihan-ganda',
      kode: `Rak[] daftar = new Rak[3];
System.out.println(daftar[0].isi);
`,
      pertanyaan: 'Apa yang terjadi saat baris kedua dijalankan?',
      pilihan: [
        { teks: 'NullPointerException, karena daftar[0] masih null (array objek belum diisi new)', benar: true },
        { teks: 'Mencetak 0, karena isi bertipe int', benar: false },
        { teks: 'Galat kompilasi', benar: false },
      ],
      penjelasan: '`new Rak[3]` membuat array berisi 3 rujukan `null`, BUKAN 3 objek Rak. Membaca field lewat rujukan `null` melempar `NullPointerException`.',
    },
    {
      id: 'p3-rujukan-4',
      lessonId: 'java-kelas-objek-rujukan',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        Rak x = new Rak();
        Rak y = new Rak();
        System.out.println(x == y);
        System.out.println(x == x);
    }
}
class Rak { int isi; }
`,
      penjelasan: '`x` dan `y` adalah dua objek yang benar-benar berbeda (masing-masing dibuat dengan `new`), jadi `x == y` bernilai `false`. `x == x` selalu `true` karena membandingkan objek dengan dirinya sendiri.',
    },
  ],
  'java-constructor': [
    {
      id: 'p3-constructor-1',
      lessonId: 'java-constructor',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Ciri sebuah method benar-benar constructor (bukan method biasa yang kebetulan bernama sama) adalah…',
      pilihan: [
        { teks: 'Namanya sama persis dengan kelasnya DAN tidak punya tipe kembalian sama sekali', benar: true },
        { teks: 'Namanya sama dengan kelasnya, tipe kembaliannya boleh void', benar: false },
        { teks: 'Selalu ditandai kata kunci public', benar: false },
      ],
      penjelasan: 'Constructor tidak punya tipe kembalian — bahkan bukan `void`. Kalau ada tipe kembalian (termasuk `void`), itu jadi method biasa.',
    },
    {
      id: 'p3-constructor-2',
      lessonId: 'java-constructor',
      tipe: 'pilihan-ganda',
      kode: `public class Pelanggan {
    private String nama;
    public Pelanggan(String nama) {
        nama = nama;
    }
    public String getNama() { return nama; }
}
`,
      pertanyaan: '`new Pelanggan("Sinta").getNama()` menghasilkan `null`, padahal kompilasi berhasil tanpa pesan apa pun. Kenapa?',
      pilihan: [
        { teks: 'nama = nama; menugaskan parameter ke dirinya sendiri (shadowing) — field nama tidak pernah diisi. Seharusnya this.nama = nama;', benar: true },
        { teks: 'Constructor tidak boleh punya parameter bernama sama dengan field', benar: false },
        { teks: 'getNama() seharusnya static', benar: false },
      ],
      penjelasan: 'Di dalam constructor, `nama` (tanpa `this`) merujuk ke **parameter**, karena parameter "menutupi" (shadowing) field yang senama. `nama = nama;` sah secara tata bahasa tapi tidak melakukan apa-apa yang berguna — field `nama` tetap `null`. Perbaikannya: `this.nama = nama;`.',
    },
    {
      id: 'p3-constructor-3',
      lessonId: 'java-constructor',
      tipe: 'isian-singkat',
      pertanyaan: 'Kata kunci apa yang dipakai di baris pertama sebuah constructor untuk memanggil constructor **lain** di kelas yang sama?',
      kunci: 'this',
      penjelasan: '`this(...)` memanggil constructor lain di kelas yang sama, dan harus menjadi pernyataan pertama.',
    },
    {
      id: 'p3-constructor-4',
      lessonId: 'java-constructor',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        Kotak k = new Kotak();
        System.out.println(k.sisi);
    }
}
class Kotak {
    int sisi;
    Kotak() { this(10); }
    Kotak(int sisi) { this.sisi = sisi; }
}
`,
      penjelasan: 'Constructor tanpa parameter memanggil `this(10);`, yang melompat ke constructor kedua dan mengisi `sisi = 10`. Jadi `k.sisi` bernilai `10`.',
    },
  ],
  'java-static': [
    {
      id: 'p3-static-1',
      lessonId: 'java-static',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa maksud field bertanda `static`?',
      pilihan: [
        { teks: 'Field itu milik KELAS — satu untuk seluruh objek, bukan disalin per objek', benar: true },
        { teks: 'Field itu tidak boleh diubah nilainya', benar: false },
        { teks: 'Field itu otomatis private', benar: false },
      ],
      penjelasan: '`static` membuat anggota (field/method) menjadi milik kelas, dibagi bersama oleh seluruh objek — beda dengan anggota instance yang disalin per objek.',
    },
    {
      id: 'p3-static-2',
      lessonId: 'java-static',
      tipe: 'pilihan-ganda',
      kode: `public class Main {
    int nilai = 5;
    public static void main(String[] args) {
        System.out.println(nilai);
    }
}
`,
      pertanyaan: 'Kenapa kode ini gagal dikompilasi?',
      pilihan: [
        { teks: 'main bersifat static (tanpa objek), tapi nilai adalah field instance yang butuh objek', benar: true },
        { teks: 'nilai seharusnya bertipe String', benar: false },
        { teks: 'System.out.println tidak bisa dipanggil dari main', benar: false },
      ],
      penjelasan: '`main` berjalan tanpa objek dari kelasnya. Field instance seperti `nilai` hanya ada di dalam objek, jadi mengaksesnya langsung dari `main` ditolak kompilator: "non-static variable nilai cannot be referenced from a static context".',
    },
    {
      id: 'p3-static-3',
      lessonId: 'java-static',
      tipe: 'isian-singkat',
      pertanyaan: 'Kata kunci apa yang membuat sebuah field/method menjadi milik kelas, bukan milik objek?',
      kunci: 'static',
      penjelasan: '`static` adalah kata kuncinya.',
    },
    {
      id: 'p3-static-4',
      lessonId: 'java-static',
      tipe: 'kode-singkat',
      instruksi:
        'Lengkapi `Main.java`: buat kelas `Pelanggan` dengan field `private static int jumlah` yang bertambah tiap kali constructor `Pelanggan()` (tanpa parameter) dipanggil, dan method `static int getJumlah()` yang mengembalikannya. Di `main`, buat **3** objek `Pelanggan`, lalu cetak `Pelanggan.getJumlah()`.',
      kelasUtama: 'Main',
      kodeAwal: [
        {
          nama: 'Main.java',
          isi: `class Pelanggan {
    // TODO: field static private jumlah, constructor menaikkannya, getter static
}

public class Main {
    public static void main(String[] args) {
        // TODO: buat 3 objek Pelanggan, lalu cetak Pelanggan.getJumlah()
    }
}
`,
        },
      ],
      tes: [{ nama: 'Mencetak jumlah pelanggan', stdin: '', harap: '3' }],
      penjelasan:
        'Field `jumlah` harus `static` supaya satu nilai dibagi oleh semua objek `Pelanggan`, dinaikkan di constructor, dan dibaca lewat method `static` yang dipanggil lewat nama kelas: `Pelanggan.getJumlah()`.',
    },
  ],
  'java-array-ke-kelas': [
    {
      id: 'p3-arraykelas-1',
      lessonId: 'java-array-ke-kelas',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Kenapa menyimpan data satu benda di beberapa array sejajar (`String[] nama`, `double[] harga`) berisiko?',
      pilihan: [
        { teks: 'Tidak ada yang memberitahu compiler bahwa elemen pada indeks yang sama adalah sifat dari SATU benda — keduanya bisa jadi tidak sinkron tanpa pesan galat', benar: true },
        { teks: 'Array tidak boleh berisi lebih dari satu jenis data', benar: false },
        { teks: 'Java tidak mengizinkan dua array dideklarasikan di method yang sama', benar: false },
      ],
      penjelasan: 'Kelas menyatukan sifat-sifat satu benda dalam satu wadah, sehingga tidak mungkin "tertukar" — beda dengan array sejajar yang keterkaitannya hanya ada di kepala pemrogram.',
    },
    {
      id: 'p3-arraykelas-2',
      lessonId: 'java-array-ke-kelas',
      tipe: 'isian-singkat',
      pertanyaan: 'Kata kunci apa yang dipakai untuk mendefinisikan sebuah kelas baru?',
      kunci: 'class',
      penjelasan: '`class NamaKelas { ... }` mendefinisikan kelas.',
    },
    {
      id: 'p3-arraykelas-3',
      lessonId: 'java-array-ke-kelas',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        Siswa s = new Siswa("Dewi", 88);
        System.out.println(s.info());
    }
}
class Siswa {
    String nama;
    int nilai;
    Siswa(String nama, int nilai) { this.nama = nama; this.nilai = nilai; }
    String info() { return nama + ": " + nilai; }
}
`,
      penjelasan: 'Constructor mengisi `nama = "Dewi"` dan `nilai = 88`. `info()` mengembalikan `nama + ": " + nilai`, dicetak sebagai satu baris: "Dewi: 88".',
    },
    {
      id: 'p3-arraykelas-4',
      lessonId: 'java-array-ke-kelas',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa peran constructor dalam sebuah kelas?',
      pilihan: [
        { teks: 'Cara membuat objek baru dan mengisi sifat-sifat awalnya', benar: true },
        { teks: 'Mencetak isi objek ke layar', benar: false },
        { teks: 'Menghapus objek dari memori', benar: false },
      ],
      penjelasan: 'Constructor dijalankan saat objek dibuat dengan `new`, biasanya untuk mengisi field-field awal objek itu.',
    },
  ],
  'java-method': [
    {
      id: 'p3-method-1',
      lessonId: 'java-method',
      tipe: 'prediksi-output',
      kode: `public class Main {
    static void naikkan(int n) { n = n + 10; }
    static void isiPertama(int[] a) { a[0] = 100; }
    public static void main(String[] args) {
        int x = 5;
        naikkan(x);
        System.out.println(x);

        int[] arr = {1, 2, 3};
        isiPertama(arr);
        System.out.println(arr[0]);
    }
}
`,
      penjelasan: 'Argumen primitif (`int x`) disalin **nilainya** ke parameter — perubahan pada `n` di dalam `naikkan` tidak terlihat dari luar, jadi `x` tetap `5`. Argumen array disalin **rujukannya**, tapi objek yang dirujuk tetap sama, jadi `a[0] = 100;` terlihat lewat `arr[0]`: `100`.',
    },
    {
      id: 'p3-method-2',
      lessonId: 'java-method',
      tipe: 'isian-singkat',
      pertanyaan: 'Istilah apa untuk dua (atau lebih) method dengan nama sama tapi daftar parameter berbeda?',
      kunci: 'overloading',
      penjelasan: 'Ini disebut **overloading** — kompilator memilih method yang paling cocok berdasarkan tipe argumen saat kompilasi.',
    },
    {
      id: 'p3-method-3',
      lessonId: 'java-method',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Dua method `tampil(int x)` dan `tampil(String x)` ada di kelas yang sama. Apakah ini sah?',
      pilihan: [
        { teks: 'Sah — daftar parameternya berbeda tipe, jadi keduanya dianggap method yang berbeda (overloading)', benar: true },
        { teks: 'Tidak sah — dua method tidak boleh bernama sama sama sekali', benar: false },
        { teks: 'Sah hanya jika tipe kembaliannya juga berbeda', benar: false },
      ],
      penjelasan: 'Overloading sah selama daftar parameternya berbeda (jumlah atau tipe) — tipe kembalian tidak ikut membedakan, dan tidak perlu berbeda.',
    },
    {
      id: 'p3-method-4',
      lessonId: 'java-method',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Bagian mana dari sebuah method yang disebut "tanda tangan" (signature)?',
      pilihan: [
        { teks: 'Nama method beserta daftar tipe parameternya', benar: true },
        { teks: 'Isi/badan method di dalam kurung kurawal', benar: false },
        { teks: 'Nama variabel lokal di dalam method', benar: false },
      ],
      penjelasan: 'Tanda tangan method adalah nama dan daftar tipe parameternya — inilah yang dipakai kompilator untuk membedakan method saat overloading.',
    },
  ],
  'java-access-modifier': [
    {
      id: 'p3-akses-1',
      lessonId: 'java-access-modifier',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Kenapa field sebaiknya `private`, bukan `public`, walau `public` lebih ringkas ditulis?',
      pilihan: [
        { teks: 'Field private memaksa setiap perubahan lewat method yang bisa memeriksa/menjaga aturan; field public membuat aturan itu harus ditegakkan di setiap tempat pemakaian', benar: true },
        { teks: 'Field public tidak bisa dibaca dari kelas lain sama sekali', benar: false },
        { teks: 'Java tidak mengizinkan field public pada kelas non-static', benar: false },
      ],
      penjelasan: 'Dengan field `private`, satu-satunya jalan mengubahnya adalah lewat method kelas itu — dan method itulah yang menjaga aturannya. Field `public` membuat siapa pun bisa mengubahnya sembarangan.',
    },
    {
      id: 'p3-akses-2',
      lessonId: 'java-access-modifier',
      tipe: 'isian-singkat',
      pertanyaan: 'Modifier akses apa yang membuat sebuah field hanya bisa disentuh dari DALAM kelasnya sendiri?',
      kunci: 'private',
      penjelasan: '`private` membatasi akses hanya dari dalam kelas itu sendiri.',
    },
    {
      id: 'p3-akses-3',
      lessonId: 'java-access-modifier',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Kelas `Mahasiswa` punya field `nim` yang tidak pernah berubah setelah objek dibuat. Method apa yang sebaiknya DIHINDARI?',
      pilihan: [
        { teks: 'setNim(...) — karena nim memang tidak boleh diubah, menulis setter untuknya mengurangi nilai rancangan', benar: true },
        { teks: 'getNim() — karena getter selalu berbahaya', benar: false },
        { teks: 'Constructor Mahasiswa(...)', benar: false },
      ],
      penjelasan: 'Setter hanya ditulis kalau pemakai kelas memang perlu mengubah nilainya. `nim` tidak pernah berubah, jadi `setNim` tidak seharusnya ada.',
    },
    {
      id: 'p3-akses-4',
      lessonId: 'java-access-modifier',
      tipe: 'kode-singkat',
      instruksi: 'Lengkapi kelas `Akun`: field `private double saldo` (mulai dari parameter constructor), method `getSaldo()` (getter), dan `setor(double jumlah)` yang menambah saldo **hanya** bila `jumlah > 0`. Di `main`, buat `Akun a = new Akun(1000)`, panggil `a.setor(500)` lalu `a.setor(-200)`, dan cetak `a.getSaldo()`.',
      kelasUtama: 'Main',
      kodeAwal: [
        {
          nama: 'Main.java',
          isi: `class Akun {
    // TODO: field private saldo, constructor, getSaldo(), setor(double)
}

public class Main {
    public static void main(String[] args) {
        // TODO
    }
}
`,
        },
      ],
      tes: [{ nama: 'Setor valid diterima, setor negatif ditolak', stdin: '', harap: '1500.0' }],
      penjelasan: '`setor`: `if (jumlah > 0) saldo += jumlah;` — setelah setor(500) saldo jadi 1500, lalu setor(-200) ditolak sehingga saldo tetap 1500.0.',
    },
  ],
  'java-objek-sebagai-nilai': [
    {
      id: 'p3-nilai-1',
      lessonId: 'java-objek-sebagai-nilai',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa gunanya anotasi `@Override` sebelum method `toString()`?',
      pilihan: [
        { teks: 'Memberi tahu kompilator kamu bermaksud menimpa method warisan — kalau namanya salah ketik, kompilator menolak (bukan diam-diam membuat method baru)', benar: true },
        { teks: 'Membuat method itu berjalan lebih cepat', benar: false },
        { teks: 'Wajib ada supaya println bisa dipanggil', benar: false },
      ],
      penjelasan: 'Tanpa `@Override`, salah ketik nama method (misalnya `tostring`) tetap lolos kompilasi dan diam-diam membuat method baru yang tidak pernah dipanggil. Dengan `@Override`, kompilator memeriksa dan menolak kalau tidak cocok dengan method yang diwarisi.',
    },
    {
      id: 'p3-nilai-2',
      lessonId: 'java-objek-sebagai-nilai',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        Produk p = new Produk("Buku", 25000);
        System.out.println(p);
    }
}
class Produk {
    String nama; double harga;
    Produk(String nama, double harga) { this.nama = nama; this.harga = harga; }
    @Override
    public String toString() { return nama + " - Rp" + harga; }
}
`,
      penjelasan: '`println(p)` memanggil `p.toString()` secara otomatis, yang sudah ditimpa untuk mengembalikan `"Buku - Rp25000.0"`.',
    },
    {
      id: 'p3-nilai-3',
      lessonId: 'java-objek-sebagai-nilai',
      tipe: 'isian-singkat',
      pertanyaan: 'Method apa yang dipanggil OTOMATIS oleh `System.out.println(objek)`?',
      kunci: 'tostring',
      penjelasan: '`println` memanggil `toString()` pada objek secara otomatis untuk mendapatkan representasi teksnya.',
    },
    {
      id: 'p3-nilai-4',
      lessonId: 'java-objek-sebagai-nilai',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Method `geser(dx, dy)` mengembalikan **objek baru** alih-alih mengubah objek yang ada. Gaya rancangan ini disebut…',
      pilihan: [
        { teks: 'immutable — sama seperti perilaku String yang sudah kamu kenal', benar: true },
        { teks: 'static — karena tidak memerlukan objek', benar: false },
        { teks: 'overloading — karena ada dua versi method', benar: false },
      ],
      penjelasan: 'Mengembalikan objek baru tanpa mengubah objek asal disebut gaya **immutable**, kebalikan dari gaya **mutator** yang mengubah objek di tempat dan mengembalikan `void`.',
    },
  ],
  'java-banyak-kelas': [
    {
      id: 'p3-banyak-1',
      lessonId: 'java-banyak-kelas',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa perbedaan tanggung jawab kelas "model" dan kelas "pengendali" (yang memuat main)?',
      pilihan: [
        { teks: 'Model menyimpan data & perilaku (tanpa System.out kecuali diminta); pengendali membuat objek, memanggil method, dan mencetak hasil', benar: true },
        { teks: 'Model memuat main; pengendali menyimpan field', benar: false },
        { teks: 'Keduanya harus berada dalam satu berkas yang sama', benar: false },
      ],
      penjelasan: 'Kelas model fokus pada data dan logika; kelas pengendali (dengan `main`) mengoordinasikan: membuat objek, memanggil method-nya, dan menampilkan hasil.',
    },
    {
      id: 'p3-banyak-2',
      lessonId: 'java-banyak-kelas',
      tipe: 'isian-singkat',
      pertanyaan: 'Tuliskan perintah untuk mengompilasi SEMUA berkas `.java` di direktori kerja sekaligus.',
      kunci: ['javac *.java'],
      penjelasan: '`javac *.java` mengompilasi seluruh berkas `.java` di direktori itu dalam satu perintah.',
    },
    {
      id: 'p3-banyak-3',
      lessonId: 'java-banyak-kelas',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Bagaimana cara menguji apakah logika sudah berada di kelas model, bukan di kelas pengendali?',
      pilihan: [
        { teks: 'Hapus semua System.out dari kelas model — kelas pengendali harus tetap bisa memperoleh SEMUA informasi lewat method yang mengembalikan nilai', benar: true },
        { teks: 'Pastikan kelas model punya method main sendiri', benar: false },
        { teks: 'Pastikan kelas model dan pengendali berada dalam satu berkas', benar: false },
      ],
      penjelasan: 'Kalau kelas pengendali tidak bisa memperoleh informasi tanpa `System.out` di kelas model, berarti ada logika yang salah tempat — seharusnya lewat method yang mengembalikan nilai.',
    },
    {
      id: 'p3-banyak-4',
      lessonId: 'java-banyak-kelas',
      tipe: 'kode-singkat',
      instruksi: 'Lengkapi `Kucing.java` (field private `nama`, constructor, method `suara()` mengembalikan `nama + " berkata: Meong!"`) dan `Main.java` (sudah lengkap, jangan diubah) yang membuat satu objek `Kucing` bernama "Milo" dan mencetak `suara()`-nya.',
      kelasUtama: 'Main',
      kodeAwal: [
        {
          nama: 'Kucing.java',
          isi: `public class Kucing {
    // TODO: field private nama, constructor, method suara()
}
`,
        },
        {
          nama: 'Main.java',
          isi: `public class Main {
    public static void main(String[] args) {
        Kucing k = new Kucing("Milo");
        System.out.println(k.suara());
    }
}
`,
        },
      ],
      tes: [{ nama: 'Kucing bernama Milo', stdin: '', harap: 'Milo berkata: Meong!' }],
      penjelasan: '`suara()` mengembalikan `nama + " berkata: Meong!"`, memakai field `nama` yang diisi lewat constructor.',
    },
  ],
  'proyek-parkir': [
    {
      id: 'p3-parkir-1',
      lessonId: 'proyek-parkir',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Pada `SlotParkir`, mengapa `jumlahSlot` harus `static` sedangkan `terisi` harus TIDAK `static` (instance)?',
      pilihan: [
        { teks: 'jumlahSlot menghitung TOTAL slot yang pernah dibuat (satu untuk semua objek); terisi adalah keadaan MASING-MASING slot (berbeda per objek)', benar: true },
        { teks: 'Keduanya seharusnya static supaya bisa diakses dari main', benar: false },
        { teks: 'Keduanya seharusnya instance supaya lebih aman', benar: false },
      ],
      penjelasan: '`static` dipakai untuk data yang dibagi seluruh objek (pencacah total). `terisi` adalah sifat milik satu slot tertentu — kalau dibuat `static`, semua slot akan berbagi satu nilai `terisi` yang sama, yang jelas salah.',
    },
    {
      id: 'p3-parkir-2',
      lessonId: 'proyek-parkir',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Constructor `SlotParkir(int kapasitas)` memperbaiki `kapasitas <= 0` menjadi `1`, bukan membiarkannya. Prinsip apa yang diterapkan di sini?',
      pilihan: [
        { teks: 'Constructor menjamin objek lahir dalam keadaan sah — validasi ada di SATU tempat (constructor), bukan di setiap tempat pemakaian', benar: true },
        { teks: 'Overloading — constructor punya beberapa versi', benar: false },
        { teks: 'Static — kapasitas dibagi semua objek', benar: false },
      ],
      penjelasan: 'Ini prinsip yang sama dengan lesson Constructor: memastikan objek lahir dalam keadaan sah, sehingga tidak ada satu pun `SlotParkir` yang bisa dibuat dengan kapasitas yang tidak masuk akal.',
    },
    {
      id: 'p3-parkir-3',
      lessonId: 'proyek-parkir',
      tipe: 'isian-singkat',
      pertanyaan: 'Method `masuk()` mengembalikan `boolean` alih-alih langsung mencetak pesan. Kata sifat/prinsip apa (dalam Bahasa Indonesia) yang menjelaskan kenapa method model sebaiknya begitu — supaya pemakai kelas bebas memutuskan sendiri apa yang dilakukan dengan hasilnya?',
      kunci: ['mengembalikan nilai', 'return', 'nilai'],
      penjelasan: 'Method pada kelas model sebaiknya **mengembalikan nilai**, bukan langsung mencetak — pencetakan adalah urusan kelas pengendali, yang bebas menampilkannya dengan caranya sendiri.',
    },
    {
      id: 'p3-parkir-4',
      lessonId: 'proyek-parkir',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        Antrean a1 = new Antrean();
        Antrean a2 = new Antrean();
        Antrean a3 = new Antrean();
        System.out.println(a2.getNomor());
        System.out.println(Antrean.getJumlah());
    }
}
class Antrean {
    private static int jumlah = 0;
    private int nomor;
    Antrean() { jumlah++; nomor = jumlah; }
    int getNomor() { return nomor; }
    static int getJumlah() { return jumlah; }
}
`,
      penjelasan: 'Pola pencacah objek: setiap `new Antrean()` menaikkan `jumlah` (static, dibagi bersama) dan menyalinnya ke `nomor` milik objek itu. `a2` adalah objek kedua, jadi `getNomor()` = `2`. Setelah 3 objek dibuat, `getJumlah()` = `3`.',
    },
  ],
};
