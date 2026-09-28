// Bank soal "Uji Pemahaman" Pekan 2. Minimal 4 varian per pelajaran (id pelajaran = key object ini),
// supaya uji ulang bisa memakai soal yang berbeda. Semua kasus baru, bukan salinan modul.
export const bankPekan2 = {
  'java-anatomi-kompilasi': [
    {
      id: 'p2-anatomi-1',
      lessonId: 'java-anatomi-kompilasi',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa yang dilakukan `javac`?',
      pilihan: [
        { teks: 'Memeriksa tata bahasa lalu menghasilkan berkas .class (bytecode)', benar: true },
        { teks: 'Menjalankan program dan mencetak hasilnya ke layar', benar: false },
        { teks: 'Menghapus berkas .java setelah selesai', benar: false },
      ],
      penjelasan: '`javac` adalah kompilator: memeriksa tata bahasa kode sumber lalu menghasilkan bytecode `.class`. Yang menjalankan program adalah `java`.',
    },
    {
      id: 'p2-anatomi-2',
      lessonId: 'java-anatomi-kompilasi',
      tipe: 'isian-singkat',
      pertanyaan: 'Tuliskan perintah lengkap (tanpa akhiran apa pun) untuk **menjalankan** kelas `Toko` yang sudah berhasil dikompilasi.',
      kunci: ['java Toko'],
      penjelasan: 'Menjalankan program memakai `java NamaKelas`, tanpa akhiran `.java` maupun `.class`.',
    },
    {
      id: 'p2-anatomi-3',
      lessonId: 'java-anatomi-kompilasi',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Berkas `Toko.java` berisi `public class Toko { ... }`. Apa syarat supaya berkas ini bisa dikompilasi?',
      pilihan: [
        { teks: 'Nama kelas public (Toko) harus sama persis dengan nama berkasnya', benar: true },
        { teks: 'Nama kelas boleh berbeda asal ada method main', benar: false },
        { teks: 'Nama berkas harus huruf kecil semua', benar: false },
      ],
      penjelasan: 'Kelas `public` wajib disimpan dalam berkas bernama sama persis (termasuk huruf besar-kecil), diakhiri `.java`.',
    },
    {
      id: 'p2-anatomi-4',
      lessonId: 'java-anatomi-kompilasi',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        System.out.print("Nilai: ");
        System.out.println(75 + 25);
    }
}
`,
      penjelasan: '`System.out.print` tidak pindah baris, jadi hasilnya menyambung dengan `println` berikutnya: satu baris "Nilai: 100" (75+25 dihitung dulu sebagai bilangan, baru dicetak).',
    },
  ],
  'java-string-objek': [
    {
      id: 'p2-string-1',
      lessonId: 'java-string-objek',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Sebuah program membaca nama dari `Scanner` lalu membandingkannya dengan `"admin"` memakai `==`. Kenapa ini berbahaya?',
      pilihan: [
        { teks: '== pada String membandingkan alamat objek, bukan isinya — teks dari Scanner bukan literal yang sama alamatnya', benar: true },
        { teks: 'Scanner tidak bisa membaca teks yang mengandung huruf', benar: false },
        { teks: '== hanya berlaku untuk angka, jadi programnya tidak akan bisa dikompilasi', benar: false },
      ],
      penjelasan: 'Teks yang datang dari Scanner adalah objek String baru (bukan literal dari string pool), jadi `==` hampir selalu `false` walau isinya sama. Selalu pakai `equals`.',
    },
    {
      id: 'p2-string-2',
      lessonId: 'java-string-objek',
      tipe: 'isian-singkat',
      pertanyaan: 'Method String apa yang membandingkan dua teks **tanpa peduli huruf besar/kecil**?',
      kunci: ['equalsignorecase', 'equalsIgnoreCase'],
      penjelasan: '`equalsIgnoreCase(...)` membandingkan isi tanpa membedakan huruf besar/kecil.',
    },
    {
      id: 'p2-string-3',
      lessonId: 'java-string-objek',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        String kota = "bandung";
        kota.toUpperCase();
        System.out.println(kota);
        String hasil = kota.toUpperCase();
        System.out.println(hasil);
    }
}
`,
      penjelasan: 'Baris `kota.toUpperCase();` tanpa ditampung tidak mengubah `kota` (String immutable), jadi baris pertama tetap mencetak "bandung". Baris kedua hasilnya ditampung ke `hasil`, jadi mencetak "BANDUNG".',
    },
    {
      id: 'p2-string-4',
      lessonId: 'java-string-objek',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Kenapa `String` disebut **immutable**?',
      pilihan: [
        { teks: 'Karena setiap operasi yang tampak mengubah isinya sebenarnya menghasilkan objek String baru', benar: true },
        { teks: 'Karena String tidak bisa dibandingkan sama sekali', benar: false },
        { teks: 'Karena String hanya bisa dipakai di dalam Scanner', benar: false },
      ],
      penjelasan: 'Objek String yang sudah dibuat tidak pernah berubah isinya; method seperti `toUpperCase()`/`substring()` selalu mengembalikan objek String yang baru.',
    },
  ],
  'java-tipe-data': [
    {
      id: 'p2-tipe-1',
      lessonId: 'java-tipe-data',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Variabel `int total = 7; int n = 2;`. Apa hasil `total / n`?',
      pilihan: [
        { teks: '3 — dibulatkan ke bawah, bukan ke bilangan terdekat', benar: true },
        { teks: '3.5', benar: false },
        { teks: '4 — dibulatkan ke atas', benar: false },
      ],
      penjelasan: 'Pembagian dua `int` menghasilkan `int`: bagian pecahan dibuang (dipotong ke arah nol), bukan dibulatkan. `7 / 2` = `3`.',
    },
    {
      id: 'p2-tipe-2',
      lessonId: 'java-tipe-data',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        int besar = 2147483647;
        System.out.println(besar + 1);
    }
}
`,
      penjelasan: '`besar` sudah bernilai batas maksimum `int` (2.147.483.647). Menambah 1 membuatnya **meluap** dan berputar ke nilai minimum: `-2147483648`, tanpa pesan galat apa pun.',
    },
    {
      id: 'p2-tipe-3',
      lessonId: 'java-tipe-data',
      tipe: 'isian-singkat',
      pertanyaan: 'Lengkapi baris berikut supaya `d` (bertipe `double`) disimpan secara sadar ke `x` (bertipe `int`), memotong bagian pecahannya: `int x = ___ d;`',
      kunci: ['(int)', 'int'],
      penjelasan: 'Casting eksplisit `(int) d` diperlukan karena mempersempit tipe (double -> int) bisa kehilangan informasi, dan Java menolak melakukannya diam-diam.',
    },
    {
      id: 'p2-tipe-4',
      lessonId: 'java-tipe-data',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa hasil `Math.round(-2.5)`?',
      pilihan: [
        { teks: '-2 — Math.round selalu membulatkan setengah ke arah positif', benar: true },
        { teks: '-3 — dibulatkan menjauhi nol', benar: false },
        { teks: '-2.5 tidak berubah karena sudah bilangan bulat setengah', benar: false },
      ],
      penjelasan: '`Math.round` di Java selalu membulatkan nilai setengah ke arah **positif**, sehingga `-2.5` menjadi `-2`, bukan `-3`.',
    },
  ],
  'java-scanner-printf': [
    {
      id: 'p2-scanner-1',
      lessonId: 'java-scanner-printf',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Setelah `int umur = in.nextInt();`, baris berikutnya `String nama = in.nextLine();` sering menghasilkan `nama` berupa **string kosong**. Kenapa?',
      pilihan: [
        { teks: 'nextInt() hanya mengambil angkanya dan meninggalkan penanda akhir baris; nextLine() langsung menemuinya', benar: true },
        { teks: 'nextLine() tidak bisa dipanggil setelah nextInt() sama sekali', benar: false },
        { teks: 'Scanner harus dibuat ulang untuk setiap pembacaan', benar: false },
      ],
      penjelasan: '`nextInt()` mengambil angkanya saja, menyisakan penanda akhir baris di antrean. `nextLine()` berikutnya langsung menemui penanda kosong itu. Perbaikannya: tambahkan `in.nextLine();` pembuang setelah `nextInt()`.',
    },
    {
      id: 'p2-scanner-2',
      lessonId: 'java-scanner-printf',
      tipe: 'isian-singkat',
      pertanyaan: 'Tuliskan penentu format `printf` untuk mencetak sebuah `String` rata **kiri** dengan lebar kolom minimum **10**.',
      kunci: ['%-10s'],
      penjelasan: 'Tanda minus sebelum angka lebar membuat isinya rata kiri: `%-10s`.',
    },
    {
      id: 'p2-scanner-3',
      lessonId: 'java-scanner-printf',
      tipe: 'kode-singkat',
      instruksi: 'Lengkapi `Main.java`: baca dua bilangan bulat `a` dan `b` (dipisah spasi), lalu cetak `a + b` dengan `printf` dalam format `"Total: %d%n"`.',
      kelasUtama: 'Main',
      kodeAwal: [
        {
          nama: 'Main.java',
          isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        // TODO: printf("Total: %d%n", a + b)
    }
}
`,
        },
      ],
      tes: [
        { nama: '3 + 4', stdin: '3 4\n', harap: 'Total: 7' },
        { nama: '10 + 25', stdin: '10 25\n', harap: 'Total: 35' },
      ],
      penjelasan: '`System.out.printf("Total: %d%n", a + b);` — `%d` untuk bilangan bulat, `%n` untuk pindah baris.',
    },
    {
      id: 'p2-scanner-4',
      lessonId: 'java-scanner-printf',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Method Scanner mana yang membaca **satu baris penuh**, termasuk spasi di dalamnya?',
      pilihan: [
        { teks: 'nextLine()', benar: true },
        { teks: 'next()', benar: false },
        { teks: 'nextInt()', benar: false },
      ],
      penjelasan: '`nextLine()` membaca sampai akhir baris, termasuk spasi. `next()` berhenti di spasi pertama (satu kata saja).',
    },
  ],
  'java-operator': [
    {
      id: 'p2-operator-1',
      lessonId: 'java-operator',
      tipe: 'pilihan-ganda',
      kode: `int x = 0;
boolean r = (x != 0) & (10 / x > 1);
`,
      pertanyaan: 'Apa yang terjadi saat baris kedua dijalankan?',
      pilihan: [
        { teks: 'ArithmeticException — operator & selalu mengevaluasi kedua sisi, sehingga 10/x tetap dihitung walau x == 0', benar: true },
        { teks: 'r bernilai false tanpa masalah, karena x != 0 sudah false', benar: false },
        { teks: 'Galat kompilasi karena & tidak boleh dipakai pada boolean', benar: false },
      ],
      penjelasan: 'Beda dengan `&&`, operator `&` **selalu** mengevaluasi kedua operan — tidak menghubung-singkat. `10 / x` tetap dihitung walau `x == 0`, melempar `ArithmeticException: / by zero`.',
    },
    {
      id: 'p2-operator-2',
      lessonId: 'java-operator',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        int i = 3;
        System.out.println(i++);
        System.out.println(i);
        System.out.println(++i);
    }
}
`,
      penjelasan: '`i++` (akhiran) mencetak nilai **sebelum** dinaikkan: `3`, lalu `i` menjadi `4`. Baris kedua mencetak `4`. `++i` (awalan) menaikkan dulu baru mencetak: `5`.',
    },
    {
      id: 'p2-operator-3',
      lessonId: 'java-operator',
      tipe: 'isian-singkat',
      pertanyaan: 'Lengkapi ekspresi ternari berikut supaya `hasil` berisi `"positif"` bila `n > 0`, selain itu `"non-positif"`: `String hasil = n > 0 ___ "positif" : "non-positif";`',
      kunci: '?',
      penjelasan: 'Bentuk ternari adalah `kondisi ? nilaiJikaBenar : nilaiJikaSalah`.',
    },
    {
      id: 'p2-operator-4',
      lessonId: 'java-operator',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Urutan pengerjaan operator: `2 + 3 * 4 > 10 && 5 > 2` — bagian mana yang dikerjakan **paling awal**?',
      pilihan: [
        { teks: '3 * 4 (perkalian sebelum penjumlahan dan perbandingan)', benar: true },
        { teks: '5 > 2 (karena letaknya paling kanan)', benar: false },
        { teks: '2 + 3 (karena letaknya paling kiri)', benar: false },
      ],
      penjelasan: 'Perkalian/pembagian dikerjakan sebelum penjumlahan/pengurangan, yang dikerjakan sebelum perbandingan, yang dikerjakan sebelum `&&`. Jadi `3 * 4` dikerjakan paling awal.',
    },
  ],
  'java-percabangan': [
    {
      id: 'p2-percabangan-1',
      lessonId: 'java-percabangan',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        int n = 1;
        switch (n) {
            case 1: System.out.println("A");
            case 2: System.out.println("B"); break;
            case 3: System.out.println("C"); break;
            default: System.out.println("D");
        }
    }
}
`,
      penjelasan: 'Eksekusi masuk pada `case 1`, mencetak "A", lalu **meloloskan diri** ke `case 2` (tidak ada `break` di case 1), mencetak "B", baru berhenti pada `break` di sana.',
    },
    {
      id: 'p2-percabangan-2',
      lessonId: 'java-percabangan',
      tipe: 'pilihan-ganda',
      kode: `int suhu = 40;
if (suhu > 30);
{
    System.out.println("Panas!");
}
`,
      pertanyaan: '"Panas!" tercetak walau `suhu` diganti jadi `10`. Kenapa?',
      pilihan: [
        { teks: 'Titik koma setelah if (suhu > 30) membuat if punya badan kosong; blok { } di bawahnya selalu dijalankan apa pun kondisinya', benar: true },
        { teks: 'suhu > 30 selalu bernilai true di Java', benar: false },
        { teks: 'System.out.println tidak bisa dikondisikan', benar: false },
      ],
      penjelasan: '`if (suhu > 30);` sah secara tata bahasa — titik koma membuatnya jadi `if` dengan badan kosong (tidak melakukan apa-apa). Blok `{ ... }` di baris berikutnya berdiri sendiri dan **selalu** dijalankan. Ini galat logika: tidak ada pesan apa pun.',
    },
    {
      id: 'p2-percabangan-3',
      lessonId: 'java-percabangan',
      tipe: 'isian-singkat',
      pertanyaan: 'Pada bentuk `switch` klasik, kata kunci apa yang mencegah eksekusi meloloskan diri ke case berikutnya?',
      kunci: 'break',
      penjelasan: '`break` menghentikan `switch` seketika, mencegah pelolosan ke case berikutnya.',
    },
    {
      id: 'p2-percabangan-4',
      lessonId: 'java-percabangan',
      tipe: 'pilihan-ganda',
      pertanyaan: '`switch` bisa dipakai untuk menyeleksi nilai bertipe apa saja **kecuali**…',
      pilihan: [
        { teks: 'double', benar: true },
        { teks: 'String', benar: false },
        { teks: 'int', benar: false },
      ],
      penjelasan: '`switch` bekerja pada `int`, `char`, `String`, dan `enum` — tidak pada `double` (dan tidak untuk rentang nilai; untuk itu tetap pakai rantai `if`).',
    },
  ],
  'java-perulangan': [
    {
      id: 'p2-perulangan-1',
      lessonId: 'java-perulangan',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Kapan `do-while` lebih cocok dipakai dibanding `while` biasa?',
      pilihan: [
        { teks: 'Ketika badan perulangan harus dijalankan MINIMAL satu kali, misalnya validasi masukan', benar: true },
        { teks: 'Ketika jumlah putaran sudah diketahui pasti sebelum perulangan dimulai', benar: false },
        { teks: 'Ketika ingin menelusuri seluruh isi array tanpa indeks', benar: false },
      ],
      penjelasan: '`do-while` memeriksa kondisinya **setelah** badan dijalankan, sehingga badan pasti dijalankan minimal sekali — cocok untuk pola "minta input, validasi, ulangi kalau salah".',
    },
    {
      id: 'p2-perulangan-2',
      lessonId: 'java-perulangan',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        int[] data = {10, 20, 30};
        int total = 0;
        for (int i = 0; i <= data.length; i++) {
            total += data[i];
        }
        System.out.println(total);
    }
}
`,
      penjelasan: 'Array `data` berukuran 3, indeks sah 0-2. Kondisi `i <= data.length` mengizinkan `i` mencapai `3`, sehingga `data[3]` melempar `ArrayIndexOutOfBoundsException` — program berhenti sebelum sempat mencetak apa pun (bukan mencetak angka).',
    },
    {
      id: 'p2-perulangan-3',
      lessonId: 'java-perulangan',
      tipe: 'isian-singkat',
      pertanyaan: 'Kata kunci apa yang melewati **sisa badan** perulangan untuk putaran itu saja, lalu lanjut ke putaran berikutnya (bukan menghentikan seluruh perulangan)?',
      kunci: 'continue',
      penjelasan: '`continue` melewati sisa badan untuk putaran saat itu; `break` yang menghentikan seluruh perulangan.',
    },
    {
      id: 'p2-perulangan-4',
      lessonId: 'java-perulangan',
      tipe: 'kode-singkat',
      instruksi: 'Lengkapi `Main.java`: baca satu bilangan bulat `n`, lalu cetak **hasil kali** semua bilangan dari `1` sampai `n` (faktorial). Untuk `n = 0`, cetak `1`.',
      kelasUtama: 'Main',
      kodeAwal: [
        {
          nama: 'Main.java',
          isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        // TODO: hitung dan cetak n!
    }
}
`,
        },
      ],
      tes: [
        { nama: 'n = 5', stdin: '5\n', harap: '120' },
        { nama: 'n = 0', stdin: '0\n', harap: '1' },
      ],
      penjelasan: '`int hasil = 1; for (int i = 1; i <= n; i++) hasil *= i;` — untuk `n = 0`, badan perulangan tidak pernah dijalankan sama sekali, jadi `hasil` tetap `1`.',
    },
  ],
  'java-array': [
    {
      id: 'p2-array-1',
      lessonId: 'java-array',
      tipe: 'prediksi-output',
      kode: `public class Main {
    public static void main(String[] args) {
        int[] p = {5, 10, 15};
        int[] q = p;
        q[1] = 99;
        System.out.println(p[1]);
    }
}
`,
      penjelasan: '`int[] q = p;` menyalin **rujukan**, bukan isinya. `p` dan `q` menunjuk array yang sama, jadi `q[1] = 99;` juga terlihat lewat `p[1]`: hasilnya `99`.',
    },
    {
      id: 'p2-array-2',
      lessonId: 'java-array',
      tipe: 'isian-singkat',
      pertanyaan: 'Method `java.util.Arrays` apa yang dipakai untuk membuat **salinan** array yang aman diurutkan tanpa merusak array aslinya?',
      kunci: ['copyof', 'copyOf'],
      penjelasan: '`Arrays.copyOf(a, a.length)` membuat array baru berisi salinan isi `a`.',
    },
    {
      id: 'p2-array-3',
      lessonId: 'java-array',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa isi elemen array `String[] nama = new String[3];` sebelum diisi?',
      pilihan: [
        { teks: 'null pada setiap elemen (array rujukan diisi null secara otomatis)', benar: true },
        { teks: 'String kosong "" pada setiap elemen', benar: false },
        { teks: '0 pada setiap elemen', benar: false },
      ],
      penjelasan: 'Nilai awal elemen array bergantung tipenya: `0` untuk tipe bilangan, `false` untuk `boolean`, dan `null` untuk tipe rujukan seperti `String`.',
    },
    {
      id: 'p2-array-4',
      lessonId: 'java-array',
      tipe: 'pilihan-ganda',
      pertanyaan: 'Apa akibat memanggil `Arrays.sort(data)` langsung pada array `data`?',
      pilihan: [
        { teks: 'data diurutkan DI TEMPAT (isinya berubah); tidak menghasilkan array baru', benar: true },
        { teks: 'Menghasilkan array baru yang terurut, data asli tidak berubah', benar: false },
        { teks: 'Galat kompilasi karena Arrays.sort butuh dua argumen', benar: false },
      ],
      penjelasan: '`Arrays.sort(a)` mengurutkan `a` **di tempat** (mengubah array itu sendiri). Untuk menjaga array asli, urutkan salinannya: `Arrays.copyOf(a, a.length)` dulu.',
    },
  ],
  'java-tiga-jenis-galat': [
    {
      id: 'p2-galat-1',
      lessonId: 'java-tiga-jenis-galat',
      tipe: 'pilihan-ganda',
      kode: `int total = 0
System.out.println(total);
`,
      pertanyaan: 'Termasuk jenis galat apa, dan kapan diketahui?',
      pilihan: [
        { teks: 'Kompilasi — javac menolak sebelum program sempat dijalankan (kurang titik koma)', benar: true },
        { teks: 'Eksekusi — program berhenti saat dijalankan', benar: false },
        { teks: 'Logika — program berjalan tapi hasilnya salah', benar: false },
      ],
      penjelasan: 'Baris pertama kekurangan titik koma — kesalahan tata bahasa, ditolak `javac` sebelum program sempat dikompilasi menjadi `.class`, apalagi dijalankan.',
    },
    {
      id: 'p2-galat-2',
      lessonId: 'java-tiga-jenis-galat',
      tipe: 'pilihan-ganda',
      kode: `int[] a = {1, 2, 3};
System.out.println(a[5]);
`,
      pertanyaan: 'Termasuk jenis galat apa?',
      pilihan: [
        { teks: 'Eksekusi — kompilasi berhasil, tapi program berhenti paksa saat dijalankan (indeks di luar batas)', benar: true },
        { teks: 'Kompilasi — javac tidak bisa memeriksa isi array', benar: false },
        { teks: 'Logika — hasilnya hanya sedikit meleset', benar: false },
      ],
      penjelasan: 'Tata bahasanya sah (kompilasi berhasil), tapi array `a` hanya berukuran 3 sehingga `a[5]` melempar `ArrayIndexOutOfBoundsException` saat program benar-benar dijalankan — galat eksekusi.',
    },
    {
      id: 'p2-galat-3',
      lessonId: 'java-tiga-jenis-galat',
      tipe: 'pilihan-ganda',
      kode: `int jumlahSiswa = 2;
int totalNilai = 150;
System.out.println(totalNilai / jumlahSiswa);
`,
      pertanyaan: 'Program ini bermaksud mencetak rata-rata (75.0) tapi mencetak `75`. Termasuk jenis galat apa?',
      pilihan: [
        { teks: 'Logika — program berjalan sampai selesai tanpa pesan apa pun, tapi tipe hasilnya (int, bukan double) membuat presisi hilang', benar: true },
        { teks: 'Kompilasi — javac seharusnya menolak pembagian int', benar: false },
        { teks: 'Eksekusi — akan melempar ArithmeticException', benar: false },
      ],
      penjelasan: 'Tidak ada pesan galat apa pun di sini — programnya berjalan sampai selesai. Masalahnya murni logika: pembagian dua `int` menghasilkan `int`, membuang bagian pecahan tanpa peringatan.',
    },
    {
      id: 'p2-galat-4',
      lessonId: 'java-tiga-jenis-galat',
      tipe: 'isian-singkat',
      pertanyaan: 'Jenis galat mana yang paling berbahaya karena tidak menghasilkan pesan apa pun, dan hanya bisa ditemukan dengan membandingkan keluaran terhadap nilai yang sudah diketahui benar?',
      kunci: 'logika',
      penjelasan: 'Galat logika tidak menghasilkan pesan apa pun — program berjalan sampai selesai dan memberi jawaban salah dengan tenang.',
    },
  ],
};
