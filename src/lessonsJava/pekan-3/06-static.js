const KODE_AWAL = [
  {
    nama: 'Anggota.java',
    isi: `public class Anggota {
    // TODO: field static private jumlahAnggota (int), field instance private nama (String) dan nomor (int)

    public Anggota(String nama) {
        // TODO: this.nama = nama; naikkan jumlahAnggota; this.nomor = jumlahAnggota;
    }

    public String getNama() {
        return null; // TODO
    }

    public int getNomor() {
        return 0; // TODO
    }

    public static int getJumlahAnggota() {
        return 0; // TODO
    }
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'Anggota.java',
    isi: `public class Anggota {
    private static int jumlahAnggota = 0;
    private String nama;
    private int nomor;

    public Anggota(String nama) {
        this.nama = nama;
        jumlahAnggota++;
        this.nomor = jumlahAnggota;
    }

    public String getNama() {
        return nama;
    }

    public int getNomor() {
        return nomor;
    }

    public static int getJumlahAnggota() {
        return jumlahAnggota;
    }
}
`,
  },
];

const TES_UTAMA = `public class TesUtama {
    public static void main(String[] args) {
        try {
            Anggota a1 = new Anggota("Sinta");
            Anggota a2 = new Anggota("Budi");
            Penguji.cek("Nomor otomatis bertambah (1 lalu 2)", a1.getNomor() == 1 && a2.getNomor() == 2,
                "getNomor() seharusnya 1 lalu 2, dapat " + a1.getNomor() + " dan " + a2.getNomor());
            Penguji.cek("getNama mengembalikan nama yang benar", a2.getNama().equals("Budi"), "getNama() = " + a2.getNama());
            Penguji.cek("field nama bertanda private", Penguji.isPrivateField(Anggota.class, "nama"), "field 'nama' harus private");
            Penguji.cek("field nomor bertanda private", Penguji.isPrivateField(Anggota.class, "nomor"), "field 'nomor' harus private");
            Penguji.cek("constructor Anggota(String) ada", Penguji.adaConstructor(Anggota.class, String.class), "constructor Anggota(String) tidak ditemukan");
            Penguji.cek("getJumlahAnggota bersifat static", Penguji.isStaticMethod(Anggota.class, "getJumlahAnggota"), "getJumlahAnggota() harus memakai kata kunci static");
            Penguji.cek("getJumlahAnggota menghitung TOTAL semua objek", Anggota.getJumlahAnggota() == 2, "getJumlahAnggota() = " + Anggota.getJumlahAnggota() + ", seharusnya 2 (dipanggil setelah 2 objek dibuat)");
        } catch (Throwable e) {
            Penguji.cekError("tak terduga", e);
        }
    }
}
`;

export default {
  id: 'java-static',
  judul: 'Static: Anggota Kelas vs Instance',
  tipe: 'java',
  subtipe: 'kode-kelas',
  pekan: 3,
  xp: 30,
  kodeAwal: KODE_AWAL,
  solusi: KODE_SOLUSI,
  tesUtamaNama: 'TesUtama',
  tesUtamaIsi: TES_UTAMA,
  daftarTes: [
    'Nomor otomatis bertambah (1 lalu 2)',
    'getNama mengembalikan nama yang benar',
    'field nama bertanda private',
    'field nomor bertanda private',
    'constructor Anggota(String) ada',
    'getJumlahAnggota bersifat static',
    'getJumlahAnggota menghitung TOTAL semua objek',
  ],
  materi: `
# Static: Anggota Kelas, Bukan Anggota Objek 🔢

Semua yang dibahas sejak subbab 1.2 adalah anggota **instance**: setiap objek punya salinannya sendiri. Kata kunci **\`static\`** membuat sebuah field atau method menjadi milik **kelas**, satu untuk semua objek, bahkan sebelum objek pertama dibuat. Kamu sudah memakainya sejak Pekan 2 tanpa disadari: \`main\` bersifat static, begitu juga \`Math.round\`.

~~~java
public class Sensor {
    private static int jumlah = 0;   // satu untuk SELURUH Sensor
    private int id;                   // satu per objek

    public Sensor() {
        jumlah++;        // menambah pencacah bersama
        id = jumlah;      // menyalin nilainya ke objek ini
    }
    public int getId() { return id; }
    public static int getJumlah() { return jumlah; }
}

Sensor s1 = new Sensor(), s2 = new Sensor();
System.out.println(s2.getId());      // 2
System.out.println(Sensor.getJumlah());  // 2 <- dipanggil lewat nama KELAS
~~~

Pola **pencacah objek** ini (field \`static\` yang dinaikkan tiap constructor dipanggil) adalah pemakaian \`static\` paling umum dan akan banyak kamu pakai.

## Mengapa \`main\` tidak bisa memanggil method biasa

\`main\` bersifat static — ia berjalan **tanpa** ada objek dari kelasnya. Method instance (bukan static) butuh objek untuk dipanggil, karena ia mengakses field milik objek itu. Memanggil method instance langsung dari \`main\` (tanpa objek) ditolak kompilator dengan pesan \`non-static method ... cannot be referenced from a static context\` — pesan yang akan sering kamu temui.
`,
  tugas: `
Lengkapi \`Anggota.java\` (dites lewat kelas tersembunyi, mirip kelas *tester* di JUnit — nanti kamu akan bertemu JUnit sungguhan di Pekan 9):

- Field \`private static int jumlahAnggota\` — pencacah **bersama** untuk seluruh objek Anggota.
- Field \`private String nama\` dan \`private int nomor\` — milik **masing-masing** objek.
- \`Anggota(String nama)\` — menaikkan \`jumlahAnggota\`, lalu \`nomor\` objek ini disalin dari nilai \`jumlahAnggota\` saat itu (jadi anggota pertama bernomor 1, kedua bernomor 2, dst).
- \`getNama()\`, \`getNomor()\` — getter biasa (instance).
- \`static int getJumlahAnggota()\` — getter untuk pencacah bersama, dipanggil lewat nama kelas: \`Anggota.getJumlahAnggota()\`.
`,
  petunjuk: [
    'private static int jumlahAnggota = 0; — static supaya SATU pencacah dipakai bersama semua objek.',
    'Di constructor: jumlahAnggota++; lalu this.nomor = jumlahAnggota;',
    'getJumlahAnggota() memakai kata kunci static di depan tipe kembaliannya, sama seperti main.',
  ],
};
