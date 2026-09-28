const KODE_BERMASALAH = [
  {
    nama: 'Main.java',
    isi: `class TiketParkir {
    private String plat;

    void TiketParkir(String plat) {
        this.plat = plat;
    }

    String getPlat() { return plat; }
}

public class Main {
    public static void main(String[] args) {
        TiketParkir t = new TiketParkir("DD 1 ABC");
        System.out.println("Plat: " + t.getPlat());
    }
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'Main.java',
    isi: `class TiketParkir {
    private String plat;

    TiketParkir(String plat) {
        this.plat = plat;
    }

    String getPlat() { return plat; }
}

public class Main {
    public static void main(String[] args) {
        TiketParkir t = new TiketParkir("DD 1 ABC");
        System.out.println("Plat: " + t.getPlat());
    }
}
`,
  },
];

export default {
  id: 'java-constructor',
  judul: 'Constructor: Objek Lahir dalam Keadaan Sah',
  tipe: 'java',
  subtipe: 'bedah-galat',
  pekan: 3,
  xp: 25,
  kelasUtama: 'Main',
  kodeBermasalah: KODE_BERMASALAH,
  solusi: KODE_SOLUSI,
  materi: `
# Constructor: Objek Lahir dalam Keadaan Sah 🏗️

**Constructor** adalah blok kode yang dijalankan tepat satu kali saat objek dibuat dengan \`new\`. Namanya **sama persis** dengan nama kelasnya, dan **tidak punya tipe kembalian** — bahkan bukan \`void\`.

~~~java
public class Ruang {
    private String nama;

    public Ruang(String nama) {   // constructor: TIDAK ada tipe kembalian
        this.nama = nama;
    }
}
~~~

Kalau kamu menulis method dengan nama sama seperti kelasnya **tapi memberinya tipe kembalian** (termasuk \`void\`), Java tidak menganggapnya constructor — itu jadi method biasa yang kebetulan bernama sama. Constructor bawaan (tanpa parameter, tanpa isi) memang tetap tersedia otomatis **kalau kamu belum menulis constructor apa pun**, tapi begitu kamu menulis method seperti di atas, Java tetap menyediakan constructor bawaan **tanpa parameter** — bukan yang menerima \`String\` seperti yang kamu maksud.
`,
  tugas: `
Kode di sebelah gagal dikompilasi. Jalankan untuk melihat pesan galat sungguhan, lalu:

1. Pilih penyebabnya (pilihan ganda).
2. Tetapkan jenis galatnya.
3. Setelah itu, perbaiki kodenya di editor sampai lolos kompilasi **dan** tesnya.
`,
  pilihanPenyebab: [
    { teks: 'TiketParkir(String plat) di atas sebenarnya bukan constructor — punya tipe kembalian void, jadi jadi method biasa. Constructor yang tersedia untuk new TiketParkir(String) tidak ada.', benar: true },
    { teks: 'Nama parameter plat sama dengan nama field plat, dan itu tidak diperbolehkan Java', benar: false },
    { teks: 'Kelas TiketParkir seharusnya public karena dipakai dari kelas Main', benar: false },
  ],
  jenisGalatBenar: 'kompilasi',
  penjelasan: `
Baris \`void TiketParkir(String plat) { ... }\` **punya tipe kembalian** \`void\`, jadi Java membacanya sebagai **method biasa** yang kebetulan bernama sama dengan kelasnya — bukan constructor. Karena itu, kelas \`TiketParkir\` sebenarnya **tidak punya** constructor yang menerima satu \`String\`; yang tersedia hanyalah constructor bawaan tanpa parameter (karena kamu belum menulis constructor sungguhan).

Saat \`new TiketParkir("DD 1 ABC")\` dipanggil, kompilator mencari constructor dengan tanda tangan \`(String)\` dan tidak menemukannya — muncul galat \`constructor TiketParkir in class TiketParkir cannot be applied to given types\`.

**Perbaikannya:** hapus kata \`void\` di depan \`TiketParkir(String plat)\`, supaya benar-benar jadi constructor, bukan method.
`,
  petunjuk: ['Bandingkan baris constructor dengan contoh di materi — ada satu kata yang seharusnya tidak ada di sana.', 'Constructor TIDAK PERNAH punya tipe kembalian, bahkan bukan void.'],
  tes: [{ nama: 'Program mencetak plat dengan benar', stdin: '', harap: 'Plat: DD 1 ABC' }],
};
