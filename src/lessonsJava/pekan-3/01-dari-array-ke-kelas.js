export default {
  id: 'java-array-ke-kelas',
  judul: 'Dari Array Sejajar ke Kelas',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 3,
  xp: 20,
  kelasUtama: 'Main',
  materi: `
# Dari Array Sejajar ke Kelas 🧩

Di Pekan 2, menyimpan data tentang "sesuatu" berarti memakai **beberapa array sejajar**:

~~~java
// Dua fakta tentang SATU produk disimpan di DUA tempat yang terpisah
String[] nama  = {"Kopi", "Teh", "Roti"};
double[] harga = {15000, 8000, 12000};
~~~

Ini rawan: tidak ada yang memberitahu compiler bahwa \`nama[1]\` dan \`harga[1]\` adalah dua sifat dari **satu benda yang sama**. Kalau salah satu array ikut diurutkan sementara yang lain tidak, atau satu elemen ditambahkan ke satu array tapi lupa ke array lainnya, keduanya jadi **tidak sinkron** — dan itu terjadi tanpa pesan galat apa pun (galat logika, seperti yang kamu bahas di lesson terakhir Pekan 2).

## Kelas menyatakan kesatuan itu

**Kelas** adalah cara memberi tahu bahasa: "benda jenis ini memiliki sifat-sifat berikut, dan dapat melakukan hal-hal berikut." Setelah kelas didefinisikan, kamu membuat sebanyak apa pun benda dari jenis itu, dan setiap benda membawa sifatnya sendiri — tidak mungkin tertukar.

~~~java
class Produk {
    String nama;      // sifat (field)
    double harga;      // sifat

    Produk(String nama, double harga) {   // constructor: cara membuat
        this.nama = nama;
        this.harga = harga;
    }

    String info() {                         // perilaku (method)
        return nama + " (Rp" + harga + ")";
    }
}

Produk p = new Produk("Kopi", 15000);
System.out.println(p.info());   // Kopi (Rp15000.0)
~~~

Sekarang nama dan harga **satu produk** berada dalam **satu wadah** yang tidak bisa dipisah. Pekan ini seluruhnya membahas bagaimana menulis kelas seperti ini dengan benar — kamu akan menulis kelas pertamamu sendiri sebentar lagi.
`,
  tugas: `
Lengkapi kelas \`Produk\` (field \`nama\` bertipe \`String\`, \`harga\` bertipe \`double\`; constructor menerima keduanya; method \`info()\` mengembalikan \`"<nama> (Rp<harga>)"\`), lalu di \`main\`, buat **dua** objek \`Produk\` dan cetak \`info()\` masing-masing, satu per baris.

Contoh: \`new Produk("Kopi", 15000)\` → \`info()\` mengembalikan \`"Kopi (Rp15000.0)"\`.
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `class Produk {
    // TODO: field nama (String) dan harga (double)

    // TODO: constructor Produk(String nama, double harga)

    // TODO: method String info() mengembalikan "<nama> (Rp<harga>)"
}

public class Main {
    public static void main(String[] args) {
        // TODO: buat 2 objek Produk, cetak info() masing-masing

    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Main.java',
      isi: `class Produk {
    String nama;
    double harga;

    Produk(String nama, double harga) {
        this.nama = nama;
        this.harga = harga;
    }

    String info() {
        return nama + " (Rp" + harga + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Produk a = new Produk("Kopi", 15000);
        Produk b = new Produk("Teh", 8000);
        System.out.println(a.info());
        System.out.println(b.info());
    }
}
`,
    },
  ],
  petunjuk: [
    'this.nama = nama; this.harga = harga; di dalam constructor.',
    'return nama + " (Rp" + harga + ")"; — penggabungan String dengan +.',
    'Produk a = new Produk("Kopi", 15000); lalu System.out.println(a.info());',
  ],
  tes: [{ nama: 'Dua produk', stdin: '', harap: 'Kopi (Rp15000.0)\nTeh (Rp8000.0)' }],
};
