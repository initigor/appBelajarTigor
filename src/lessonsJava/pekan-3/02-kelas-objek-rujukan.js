const KODE_CUPLIKAN = `public class Main {
    public static void main(String[] args) {
        Buku a = new Buku("Laskar Pelangi");
        Buku b = a;
        Buku c = new Buku("Laskar Pelangi");

        b.pinjam();

        System.out.println("a == b : " + (a == b));
        System.out.println("a == c : " + (a == c));
        System.out.println("a.dipinjam : " + a.dipinjam());
    }
}

class Buku {
    private String judul;
    private boolean dipinjam = false;

    Buku(String judul) { this.judul = judul; }
    void pinjam() { dipinjam = true; }
    boolean dipinjam() { return dipinjam; }
}
`;

export default {
  id: 'java-kelas-objek-rujukan',
  judul: 'Kelas, Objek, dan Variabel Rujukan',
  tipe: 'java',
  subtipe: 'diagram-memori',
  pekan: 3,
  xp: 25,
  kodeCuplikan: KODE_CUPLIKAN,
  kelasUtamaCuplikan: 'Main',
  materi: `
# Kelas, Objek, dan Variabel Rujukan: Tiga Hal yang Berbeda 🧩

Kebingungan paling mahal di mata kuliah ini adalah menganggap **kelas**, **objek**, dan **variabel rujukan** sebagai satu hal. Sebenarnya:

- **Kelas** adalah definisi/cetakan — ditulis satu kali (\`class Buku { ... }\`).
- **Objek** adalah benda di memori, dibuat oleh \`new\` — boleh sebanyak apa pun.
- **Variabel rujukan** adalah nama yang menunjuk ke objek — satu objek boleh ditunjuk oleh **banyak** nama sekaligus, atau tidak ditunjuk nama apa pun.

~~~java
Buku a = new Buku("R1");   // (1) buat objek, (2) buat variabel a, (3) a menunjuk objek itu
Buku b = a;                 // b menunjuk objek YANG SAMA — tidak ada objek baru!
Buku c = new Buku("R1");   // objek baru, walau isinya kebetulan sama

System.out.println(a == b);   // true  <- satu objek, dua nama
System.out.println(a == c);   // false <- dua objek berbeda, isinya sama pun tidak dihitung
~~~

Ini **sifat yang sama persis** dengan array yang sudah kamu pelajari di Pekan 2 (\`int[] p = {1,2,3}; int[] q = p;\`) — karena array memang juga objek! Kebiasaan yang paling menyelamatkanmu di sini: **gambarkan** situasinya di kertas — kotak untuk tiap objek, panah untuk tiap variabel rujukan — setiap kali kode terasa membingungkan.

## Akibat: perubahan lewat satu nama terlihat dari nama lain

Karena \`a\` dan \`b\` menunjuk objek yang **sama**, memanggil method lewat \`b\` mengubah objek yang juga "dilihat" oleh \`a\`.
`,
  tugas: `
Baca cuplikan di sebelah, lalu jawab dua pertanyaan berikut. Setelah kamu menekan "Jalankan", kodenya dijalankan sungguhan untuk mengonfirmasi jawabanmu.
`,
  penjelasan: `
- \`a == b\` bernilai **true** karena \`b = a;\` hanya menyalin **rujukan** (alamat), bukan membuat objek baru. \`a\` dan \`b\` adalah dua nama untuk **satu** objek Buku yang sama.
- \`a == c\` bernilai **false** karena \`c\` dibuat dengan \`new Buku(...)\` tersendiri — objek yang benar-benar berbeda, walau judulnya kebetulan sama persis.
- Karena \`a\` dan \`b\` menunjuk objek yang sama, memanggil \`b.pinjam()\` **juga** mengubah apa yang terlihat lewat \`a\` — makanya \`a.dipinjam()\` bernilai **true**, padahal kita tidak pernah menulis \`a.pinjam()\`.
`,
  pertanyaan: [
    {
      judul: 'a == b?',
      teks: 'Apakah `a` dan `b` menunjuk **objek yang sama**?',
      pilihan: [
        { teks: 'Ya, karena b = a; hanya menyalin rujukannya', benar: true },
        { teks: 'Tidak, karena setiap variabel punya objeknya sendiri', benar: false },
      ],
    },
    {
      judul: 'a.dipinjam() setelah b.pinjam()',
      teks: 'Setelah `b.pinjam()` dipanggil, apakah `a.dipinjam()` ikut bernilai `true`?',
      pilihan: [
        { teks: 'Tidak, karena pinjam() dipanggil lewat b, bukan a', benar: false },
        { teks: 'Ya, karena a dan b menunjuk objek yang sama', benar: true },
      ],
    },
  ],
};
