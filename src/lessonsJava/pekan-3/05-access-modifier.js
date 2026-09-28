const KODE_AWAL = [
  {
    nama: 'Produk.java',
    isi: `public class Produk {
    // TODO: field private nama (String) dan harga (double)

    public Produk(String nama, double harga) {
        // TODO: this.nama = nama; this.harga = harga;
    }

    // TODO: getNama() -> hanya getter, TANPA setter (nama tidak boleh berubah setelah dibuat)

    // TODO: getHarga() DAN setHarga(double) -> harga BOLEH berubah, tapi harus > 0
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'Produk.java',
    isi: `public class Produk {
    private String nama;
    private double harga;

    public Produk(String nama, double harga) {
        this.nama = nama;
        this.harga = harga;
    }

    public String getNama() {
        return nama;
    }

    public double getHarga() {
        return harga;
    }

    public void setHarga(double harga) {
        if (harga > 0) {
            this.harga = harga;
        }
    }
}
`,
  },
];

const TES_UTAMA = `public class TesUtama {
    public static void main(String[] args) {
        try {
            Produk p = new Produk("Kopi", 15000);
            Penguji.cek("field nama bertanda private", Penguji.isPrivateField(Produk.class, "nama"), "field 'nama' harus private");
            Penguji.cek("field harga bertanda private", Penguji.isPrivateField(Produk.class, "harga"), "field 'harga' harus private");
            Penguji.cek("getNama mengembalikan nama yang benar", p.getNama().equals("Kopi"), "getNama() = " + p.getNama());
            Penguji.cek("getHarga mengembalikan harga awal", p.getHarga() == 15000, "getHarga() = " + p.getHarga());
            Penguji.cek("tidak ada method setNama (nama tidak boleh diubah)", !Penguji.adaMethod(Produk.class, "setNama", String.class), "Produk tidak seharusnya punya setNama — nama bersifat tetap setelah dibuat");

            p.setHarga(20000);
            Penguji.cek("setHarga mengubah harga yang valid", p.getHarga() == 20000, "Setelah setHarga(20000), getHarga() = " + p.getHarga());

            p.setHarga(-500);
            Penguji.cek("setHarga menolak nilai <= 0", p.getHarga() == 20000, "Setelah setHarga(-500), getHarga() seharusnya tetap 20000, dapat " + p.getHarga());
        } catch (Throwable e) {
            Penguji.cekError("tak terduga", e);
        }
    }
}
`;

export default {
  id: 'java-access-modifier',
  judul: 'Access Modifier: private, Getter, Setter',
  tipe: 'java',
  subtipe: 'kode-kelas',
  pekan: 3,
  xp: 25,
  kodeAwal: KODE_AWAL,
  solusi: KODE_SOLUSI,
  tesUtamaNama: 'TesUtama',
  tesUtamaIsi: TES_UTAMA,
  daftarTes: [
    'field nama bertanda private',
    'field harga bertanda private',
    'getNama mengembalikan nama yang benar',
    'getHarga mengembalikan harga awal',
    'tidak ada method setNama (nama tidak boleh diubah)',
    'setHarga mengubah harga yang valid',
    'setHarga menolak nilai <= 0',
  ],
  materi: `
# Access Modifier: Memutuskan Apa yang Boleh Dilihat dari Luar 🔐

Setiap field, method, dan constructor punya tingkat akses. Pekan ini kamu hanya perlu dua di antaranya, dan aturan pemakaiannya sengaja dibuat kaku:

| Modifier | Dapat diakses dari | Pemakaian pekan ini |
| --- | --- | --- |
| \`private\` | Hanya dari dalam kelas itu sendiri | **Seluruh field**, tanpa kecuali |
| \`public\` | Dari mana pun | Constructor dan method yang memang merupakan layanan kelas |

**Mengapa field harus \`private\` padahal membuatnya \`public\` jauh lebih ringkas?** Karena field \`public\` membuat aturan tentang data itu harus ditegakkan **di setiap tempat pemakaian**, bukan di satu tempat. Dengan field \`private\`, satu-satunya jalan mengubahnya adalah lewat method kelas itu sendiri — dan method itulah yang menjaga aturannya.

## Getter dan setter: bukan ritual

**Getter** adalah method yang mengembalikan nilai field (biasanya \`getNama()\`). **Setter** adalah method yang mengubahnya (biasanya \`setNama(...)\`). Keduanya lazim, tapi **keduanya adalah keputusan, bukan kewajiban otomatis**. Untuk setiap field, tanyakan dua hal: apakah pemakai kelas perlu **membacanya**, dan apakah pemakai kelas perlu **mengubahnya** setelah objek dibuat. Kalau jawaban kedua adalah tidak, jangan tulis setter-nya — itu bukan kemalasan, itu keputusan rancangan yang sadar.

~~~java
public class Mahasiswa {
    private String nim;    // tidak pernah berubah setelah lahir: getter saja
    private String nama;    // boleh dikoreksi: getter DAN setter
    private double ipk;     // dihitung dari nilai, bukan diatur langsung: getter saja

    public String getNim()  { return nim; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public double getIpk()  { return ipk; }
}
~~~

Kelas yang menyediakan setter untuk **setiap** field hanyalah struct dengan tata cara yang lebih panjang — field-nya secara efektif tetap \`public\`. Setter yang tidak diminta spesifikasi justru **mengurangi** nilai pada penilaian rancangan.
`,
  tugas: `
Lengkapi \`Produk.java\`:

- Field \`private String nama\` dan \`private double harga\`.
- Constructor mengisi keduanya.
- \`getNama()\` — **hanya getter**. Nama tidak boleh berubah setelah produk dibuat, jadi **jangan** buat \`setNama\`.
- \`getHarga()\` dan \`setHarga(double harga)\` — harga **boleh** berubah, tapi \`setHarga\` harus **menolak** nilai \`<= 0\` (biarkan harga lama kalau nilainya tidak masuk akal).
`,
  petunjuk: [
    'Kedua field wajib private, tanpa kecuali.',
    'setHarga: if (harga > 0) { this.harga = harga; } — kalau tidak masuk akal, jangan diubah sama sekali.',
    'Jangan buat setNama — spesifikasi tidak memintanya, dan nama memang tidak boleh berubah.',
  ],
};
