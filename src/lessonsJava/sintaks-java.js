// Sintaks penting per pekan untuk course Java — PBO, untuk "refresh ingatan".
// Kunci = id pekan di chapters.js. Bentuk butir: [sintaks, fungsi, catatan (opsional)].
export const sintaksJava = {
  2: [
    {
      grup: 'Kerangka program & kompilasi',
      butir: [
        ['javac Main.java   →   java Main', 'Dua langkah: kompilasi ke bytecode (.class), lalu jalankan di JVM (tanpa akhiran .java/.class).', 'Galat tata bahasa muncul saat javac; galat data muncul saat java.'],
        ['public class Main { }', 'Kelas; nama WAJIB sama dengan nama berkas (Main.java), termasuk huruf besar-kecil.'],
        ['public static void main(String[] args) { }', 'Titik masuk program; tanda tangannya harus persis seperti ini.'],
        ['System.out.println(x)   System.out.print(x)', 'Cetak dengan / tanpa pindah baris.'],
        ['; di setiap pernyataan, { } untuk blok', 'Titik koma wajib; blok memakai kurung kurawal (bukan indentasi).'],
      ],
    },
    {
      grup: 'Tipe data & casting',
      butir: [
        ['int  long  double  char  boolean', 'Tipe primitif utama (32 bit, 64 bit, pecahan 64 bit, satu karakter, true/false). Tipe bersifat statis.'],
        ['long besar = 3_000_000_000L;', 'Akhiran L untuk literal long.'],
        ['9 / 4  →  2', 'Pembagian bulat memotong (bukan membulatkan) jika kedua operand int.'],
        ['Integer.MAX_VALUE + 1', 'Overflow terjadi diam-diam: nilai berputar ke ujung lawan, tanpa galat.'],
        ['double d = i;   int j = (int) d;', 'Casting melebar otomatis; mempersempit wajib eksplisit (memotong, (int) 7.9 = 7).'],
        ['Math.round(x)', 'Pembulatan sungguhan (setengah ke arah positif: Math.round(-6.5) = -6).'],
        ['String  array  kelas', 'Tipe rujukan: variabel menyimpan alamat objek, bukan nilainya.'],
      ],
    },
    {
      grup: 'String',
      butir: [
        ['s1.equals(s2)', 'Membandingkan ISI string.', 'Jangan pakai == untuk String: ia membandingkan alamat objek dan hasilnya bisa kebetulan benar.'],
        ['new String("PBO")', 'Selalu membuat objek baru (beda dengan literal "PBO" yang dipakai bersama lewat string pool).'],
        ['nama = nama.toUpperCase();', 'String immutable: method mengembalikan String baru, hasilnya harus ditampung.'],
      ],
    },
    {
      grup: 'Masukan & keluaran',
      butir: [
        ['import java.util.Scanner;   Scanner in = new Scanner(System.in);', 'Membaca masukan keyboard (import di atas deklarasi kelas).'],
        ['in.nextInt()   in.nextDouble()   in.next()   in.nextLine()', 'Baca bilangan bulat / pecahan / satu kata / satu baris penuh.', 'Jebakan: setelah nextInt()/nextDouble(), tambahkan in.nextLine(); pembuang sebelum nextLine() sungguhan.'],
        ['System.out.printf("%5d|%-8s|%.2f%n", a, b, c)', 'Cetak berformat: %d bulat, %s teks, %f pecahan, %c karakter, %n baris baru. Angka = lebar kolom, minus = rata kiri, .2 = 2 desimal.', 'Dasar membuat tabel teks yang rapi.'],
      ],
    },
    {
      grup: 'Operator & percabangan',
      butir: [
        ['+  -  *  /  %   +=  -=  *=   ++  --', 'Aritmatika, penugasan gabungan, increment/decrement (awalan vs akhiran beda hasil).'],
        ['==  !=  <  <=  >  >=', 'Perbandingan (pada tipe rujukan == membandingkan alamat).'],
        ['&&   ||   !', 'Logika dengan hubung-singkat: operan kanan tidak dievaluasi bila hasil sudah pasti.', 'Dipakai sebagai pelindung: if (arr.length > 5 && arr[7] == 1). & dan | selalu mengevaluasi kedua sisi.'],
        ['kondisi ? a : b', 'Operator ternari (ekspresi yang menghasilkan nilai).'],
        ['if (...) { } else if (...) { } else { }', 'Berhenti pada cabang pertama yang benar; urutan cabang menentukan hasil.', 'Jebakan: if (x > 0); (titik koma) membuat badan if kosong dan blok di bawahnya selalu jalan.'],
        ['switch (n) { case 1: ...; break; default: ... }', 'Switch klasik; tanpa break eksekusi jatuh ke case berikutnya.'],
        ['String t = switch (h) { case "Sabtu", "Minggu" -> "Libur"; default -> "Kerja"; };', 'Switch ekspresi bentuk anak panah (Java 14+): tanpa fall-through, langsung menghasilkan nilai. Hanya int/char/String/enum.'],
      ],
    },
    {
      grup: 'Perulangan',
      butir: [
        ['for (int i = 0; i < data.length; i++) { }', 'Jumlah putaran diketahui; i dari 0 sampai length - 1.', 'Galat selisih satu: i <= length → ArrayIndexOutOfBoundsException; i = 1 melewatkan elemen pertama tanpa pesan.'],
        ['for (int nilai : data) { }', 'for-each: telusuri seluruh isi array/koleksi (tanpa indeks).'],
        ['while (kondisi) { }', 'Cek kondisi sebelum badan (bisa tidak pernah jalan).'],
        ['do { ... } while (kondisi);', 'Badan jalan minimal sekali; lazim untuk validasi masukan.'],
        ['break   continue', 'Hentikan / lewati putaran; pada loop bersarang hanya berlaku untuk loop terdalam.'],
      ],
    },
    {
      grup: 'Array',
      butir: [
        ['int[] a = new int[5];   int[] b = {4, 8, 15};', 'Membuat array (ukuran tetap; elemen awal 0). a.length = jumlah elemen.'],
        ['int[] q = p;', 'Hanya menyalin rujukan: q dan p menunjuk array yang sama.'],
        ['import java.util.Arrays;   Arrays.toString(a)', 'Cetak isi array sebagai teks (tanpa ini println(a) mencetak alamat seperti [I@1b6d3586).'],
        ['Arrays.sort(a)', 'Urut naik DI TEMPAT (mengubah array asli).'],
        ['Arrays.copyOf(a, n)', 'Salinan sungguhan ke array baru; salin dulu sebelum sort bila urutan asli masih dibutuhkan.'],
      ],
    },
    {
      grup: 'Tiga jenis galat',
      butir: [
        ['error: ...   (javac)', 'Galat kompilasi: tata bahasa salah, .class tidak dibuat.'],
        ['Exception in thread "main" ...   (java)', 'Galat eksekusi: tata bahasa benar tapi data/keadaan membuat program berhenti.'],
        ['(tanpa pesan, jawaban salah)', 'Galat logika: paling berbahaya. Prediksikan keluaran lebih dulu, lalu bandingkan.'],
      ],
    },
  ],

  3: [
    {
      grup: 'Kelas, objek, constructor',
      butir: [
        ['class Produk { String nama; double harga; }', 'Kelas = cetakan: field (sifat) dan method (perilaku) dalam satu wadah, menggantikan array sejajar.'],
        ['Produk p = new Produk("Kopi", 15000);', 'new membuat objek; p adalah variabel rujukan yang menunjuk objek itu.'],
        ['Buku b = a;', 'TIDAK membuat objek baru: b dan a menunjuk objek yang sama (sifat yang sama dengan array).'],
        ['a == b   (tipe rujukan)', 'Membandingkan alamat, bukan isi; dua objek berisi sama tetap berbeda.'],
        ['public Ruang(String nama) { this.nama = nama; }', 'Constructor: nama sama dengan kelas, TANPA tipe kembalian (bahkan bukan void); jalan sekali saat new. this.field membedakan field dari parameter.', 'Jebakan: method bernama sama dengan kelas tetapi diberi tipe kembalian = method biasa, bukan constructor.'],
      ],
    },
    {
      grup: 'Method & parameter',
      butir: [
        ['public boolean tarik(double jumlah) { ...; return true; }', 'Method: tanda tangan = nama + parameter + tipe kembalian; return menghentikan method seketika.'],
        ['static void tambah(int n) { n = n + 1; }', 'Primitif disalin: perubahan pada parameter tidak terlihat dari luar.'],
        ['static void isi(int[] arr) { arr[0] = 99; }', 'Rujukan disalin: perubahan LEWAT rujukan terlihat dari luar, tetapi mengganti rujukannya (arr = new int[5]) tidak.'],
        ['double luas(double r)  /  double luas(double p, double l)', 'Overloading: nama sama, daftar parameter berbeda (jumlah/tipe). Tipe kembalian tidak ikut membedakan.'],
      ],
    },
    {
      grup: 'Enkapsulasi',
      butir: [
        ['private String nama;', 'Seluruh field private: hanya bisa diubah lewat method kelasnya sendiri, sehingga aturannya ditegakkan di satu tempat.'],
        ['public String getNama() { return nama; }', 'Getter: mengembalikan nilai field.'],
        ['public void setNama(String nama) { this.nama = nama; }', 'Setter: mengubah field (dengan validasi).', 'Keputusan rancangan, bukan ritual: tulis hanya jika pemakai memang perlu mengubahnya. Setter untuk setiap field = struct bertele-tele.'],
        ['public', 'Boleh diakses dari mana pun: untuk constructor dan method yang menjadi layanan kelas.'],
      ],
    },
    {
      grup: 'static & objek sebagai nilai',
      butir: [
        ['private static int jumlah = 0;   jumlah++;', 'Field static milik kelas (satu untuk semua objek). Pola pencacah objek: dinaikkan di constructor.'],
        ['public static int getJumlah()   Sensor.getJumlah()', 'Method static dipanggil lewat nama kelas; tidak butuh objek. main dan Math.round adalah static.', 'Error "non-static method ... cannot be referenced from a static context": method instance butuh objek.'],
        ['@Override public String toString() { return "(" + x + ", " + y + ")"; }', 'Menimpa toString() agar println(objek) tidak mencetak Lokasi@1b6d3586.', '@Override membuat kompilator menolak jika nama salah ketik.'],
        ['public boolean sama(Lokasi lain) { return this.x == lain.x && this.y == lain.y; }', 'Method sendiri untuk "sama isinya" (karena == membandingkan alamat).'],
        ['public Lokasi geser(double dx, double dy) { return new Lokasi(x + dx, y + dy); }', 'Mengembalikan objek BARU (gaya immutable) lebih aman daripada mengubah objek yang ditunjuk banyak rujukan.'],
        ['this.x   this.y', 'Merujuk objek yang sedang menjalankan method.'],
      ],
    },
    {
      grup: 'Banyak kelas',
      butir: [
        ['Buku.java (model)   Main.java (pengendali)', 'Pisahkan kelas model (field private, constructor dengan validasi, method, toString, tanpa main/System.out) dari kelas pengendali (main, membuat objek, mencetak).', 'Kelas model bisa diuji unit test tanpa main.'],
        ['javac *.java   →   java Main', 'Kompilasi semua berkas .java sekaligus, lalu jalankan kelas yang memuat main.'],
        ['Satu kelas public per berkas, nama berkas = nama kelas', 'Aturan Java untuk kelas public.'],
        ['if (kapasitas <= 0) kapasitas = 1;   if (terisi >= kapasitas) return false;', 'Constructor dan method yang menjaga aturan (validasi) supaya objek tidak pernah berada dalam keadaan tidak sah.'],
      ],
    },
  ],
};
