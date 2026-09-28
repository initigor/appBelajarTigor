const KODE_AWAL = [
  {
    nama: 'Kalkulator.java',
    isi: `public class Kalkulator {
    // TODO: method int tambah(int a, int b) -> mengembalikan a + b

    // TODO: method double tambah(double a, double b) -> mengembalikan a + b (overload: nama sama, tipe beda)

    // TODO: method void gandakan(int[] arr) -> ubah SETIAP elemen arr menjadi dua kali lipatnya (di tempat)
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'Kalkulator.java',
    isi: `public class Kalkulator {
    int tambah(int a, int b) {
        return a + b;
    }

    double tambah(double a, double b) {
        return a + b;
    }

    void gandakan(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] = arr[i] * 2;
        }
    }
}
`,
  },
];

const TES_UTAMA = `public class TesUtama {
    public static void main(String[] args) {
        try {
            Kalkulator k = new Kalkulator();
            Penguji.cek("tambah(int,int) dipilih untuk argumen int", k.tambah(2, 3) == 5, "tambah(2, 3) = " + k.tambah(2, 3) + ", seharusnya 5");
            Penguji.cek("tambah(double,double) dipilih untuk argumen double", k.tambah(2.5, 1.5) == 4.0, "tambah(2.5, 1.5) = " + k.tambah(2.5, 1.5) + ", seharusnya 4.0");
            Penguji.cek("adaMethod tambah(int,int)", Penguji.adaMethod(Kalkulator.class, "tambah", int.class, int.class), "method tambah(int, int) tidak ditemukan");
            Penguji.cek("adaMethod tambah(double,double)", Penguji.adaMethod(Kalkulator.class, "tambah", double.class, double.class), "method tambah(double, double) tidak ditemukan (overloading belum dibuat)");

            int[] arr = {1, 2, 3};
            k.gandakan(arr);
            boolean benar = arr[0] == 2 && arr[1] == 4 && arr[2] == 6;
            Penguji.cek("gandakan mengubah array LEWAT rujukan (parameter array)", benar, "Setelah gandakan(arr), isi arr = [" + arr[0] + ", " + arr[1] + ", " + arr[2] + "], seharusnya [2, 4, 6]");
        } catch (Throwable e) {
            Penguji.cekError("tak terduga", e);
        }
    }
}
`;

export default {
  id: 'java-method',
  judul: 'Method: Perilaku di Sebelah Datanya',
  tipe: 'java',
  subtipe: 'kode-kelas',
  pekan: 3,
  xp: 25,
  kodeAwal: KODE_AWAL,
  solusi: KODE_SOLUSI,
  tesUtamaNama: 'TesUtama',
  tesUtamaIsi: TES_UTAMA,
  daftarTes: [
    'tambah(int,int) dipilih untuk argumen int',
    'tambah(double,double) dipilih untuk argumen double',
    'adaMethod tambah(int,int)',
    'adaMethod tambah(double,double)',
    'gandakan mengubah array LEWAT rujukan (parameter array)',
  ],
  materi: `
# Method: Perilaku di Sebelah Datanya 🛠️

Method adalah blok kode bernama yang dipanggil pada sebuah objek (atau, untuk method \`static\`, lewat nama kelas). Bagian luarnya — **tanda tangan** — menyatakan apa yang ia terima dan apa yang ia kembalikan.

~~~java
public boolean tarik(double jumlah) {   // menerima double, mengembalikan boolean
    if (jumlah > saldo) return false;    // return menghentikan method SEKETIKA
    saldo -= jumlah;
    return true;
}
~~~

## Parameter: nilai disalin, rujukan disalin

Java **selalu** menyalin argumen ke parameter. Bila argumennya primitif, yang disalin adalah **nilainya** — perubahan pada parameter tidak terlihat dari luar. Bila argumennya rujukan (array, objek), yang disalin adalah **rujukannya** — perubahan **lewat** rujukan itu (misalnya \`arr[0] = 99\`) **terlihat** dari luar, tapi mengganti rujukannya sendiri (\`arr = new int[3]\`) tidak.

~~~java
static void tambah(int n)    { n = n + 1; }              // mengubah SALINAN nilai
static void isi(int[] arr)    { arr[0] = 99; }             // mengubah OBJEK yang dirujuk
static void ganti(int[] arr)  { arr = new int[5]; }        // mengubah SALINAN rujukan

int n = 1;        tambah(n);   System.out.println(n);   // 1 <- tidak berubah
int[] a = {1,2};  isi(a);       System.out.println(a[0]); // 99 <- berubah!
                   ganti(a);    System.out.println(a[0]); // 99 <- tetap, "a" di sini tidak tersentuh
~~~

## Overloading: satu nama, beberapa tanda tangan

Dua method boleh bernama sama selama **daftar parameternya berbeda** (jumlah atau tipe). Kompilator memilih yang paling cocok berdasarkan tipe argumen **saat kompilasi**. Tipe kembalian **tidak** ikut membedakan — dua method dengan nama & parameter sama tapi tipe kembalian beda adalah galat kompilasi.
`,
  tugas: `
Lengkapi \`Kalkulator.java\`:

1. \`int tambah(int a, int b)\` — mengembalikan \`a + b\`.
2. \`double tambah(double a, double b)\` — **overload** dari yang pertama, mengembalikan \`a + b\` sebagai \`double\`.
3. \`void gandakan(int[] arr)\` — ubah **setiap elemen** \`arr\` jadi dua kali lipatnya, langsung di array yang sama (memanfaatkan sifat parameter array: rujukannya disalin, tapi objek yang dirujuk tetap sama).
`,
  petunjuk: [
    'tambah(int, int) dan tambah(double, double) adalah dua method yang BERBEDA bagi Java — tulis keduanya.',
    'gandakan: for (int i = 0; i < arr.length; i++) arr[i] = arr[i] * 2; — ini mengubah array yang sama, bukan membuat array baru.',
  ],
};
