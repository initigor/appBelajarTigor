export default {
  id: 'java-banyak-kelas',
  judul: 'Program dengan Banyak Kelas',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 3,
  xp: 30,
  kelasUtama: 'Main',
  materi: `
# Program dengan Banyak Kelas 📂

Mulai pekan ini, programmu sebaiknya punya **minimal dua kelas**: kelas **model** (menyimpan data dan perilaku) dan kelas **pengendali** (memuat \`main\`). Memisahkan keduanya ke berkas berbeda adalah kebiasaan yang perlu dibentuk sekarang — mulai Pekan 9, kelas modelmu akan diuji oleh JUnit **tanpa pernah melewati \`main\`** sama sekali.

| Berkas | Isi dan tanggung jawab |
| --- | --- |
| \`Buku.java\` | Kelas **model**: field private, constructor dengan validasi, method perhitungan/status, \`toString\`. **Tidak ada** \`System.out\` di dalamnya (kecuali kalau memang diminta). Tidak ada \`main\`. |
| \`Main.java\` | Kelas **pengendali**: membuat objek, memanggil method-nya, mencetak hasil. Tidak ada logika perhitungan di sini. |

**Ujian sederhana** untuk membedakan kedua peran: bila kamu menghapus **seluruh** \`System.out\` dari kelas model, kelas pengendali harus tetap bisa memperoleh **semua** informasi lewat method yang mengembalikan nilai. Kalau tidak bisa, ada logika yang salah tempat.

~~~text
$ javac *.java      # mengompilasi SEMUA berkas .java di direktori ini sekaligus
$ java Main          # menjalankan kelas yang memuat main
~~~

Aturannya: setiap kelas \`public\` berada pada berkasnya sendiri dengan nama yang sama persis. Kalau kamu mengubah satu berkas, kompilasi ulang dengan perintah yang sama (\`javac *.java\`) — kompilator cukup cepat untuk itu, tidak perlu menyebut satu-satu.
`,
  tugas: `
Lengkapi **dua berkas**:

- \`Buku.java\`: kelas model, field private \`judul\` (String) dan \`stok\` (int); constructor menerima keduanya (stok awal negatif dijadikan 0); method \`pinjam()\` mengembalikan \`boolean\` (kurangi stok & \`true\` bila \`stok > 0\`, kalau tidak \`false\` tanpa mengubah apa pun); \`getStok()\`; \`toString()\` → \`"<judul>: <stok> eksemplar"\`.
- \`Main.java\` (sudah lengkap, jangan diubah): membuat dua objek \`Buku\`, meminjam salah satunya, lalu mencetak keduanya.
`,
  kodeAwal: [
    {
      nama: 'Buku.java',
      isi: `public class Buku {
    // TODO: field private judul (String) dan stok (int)

    public Buku(String judul, int stokAwal) {
        // TODO: this.judul = judul; stok awal negatif dijadikan 0
    }

    public boolean pinjam() {
        return false; // TODO
    }

    public int getStok() {
        return 0; // TODO
    }

    @Override
    public String toString() {
        return ""; // TODO: "<judul>: <stok> eksemplar"
    }
}
`,
    },
    {
      nama: 'Main.java',
      isi: `public class Main {
    public static void main(String[] args) {
        Buku a = new Buku("Laskar Pelangi", 2);
        Buku b = new Buku("Bumi Manusia", -5);
        a.pinjam();
        System.out.println(a);
        System.out.println(b);
    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Buku.java',
      isi: `public class Buku {
    private String judul;
    private int stok;

    public Buku(String judul, int stokAwal) {
        this.judul = judul;
        this.stok = (stokAwal < 0) ? 0 : stokAwal;
    }

    public boolean pinjam() {
        if (stok <= 0) return false;
        stok--;
        return true;
    }

    public int getStok() {
        return stok;
    }

    @Override
    public String toString() {
        return judul + ": " + stok + " eksemplar";
    }
}
`,
    },
    {
      nama: 'Main.java',
      isi: `public class Main {
    public static void main(String[] args) {
        Buku a = new Buku("Laskar Pelangi", 2);
        Buku b = new Buku("Bumi Manusia", -5);
        a.pinjam();
        System.out.println(a);
        System.out.println(b);
    }
}
`,
    },
  ],
  petunjuk: [
    'stok = (stokAwal < 0) ? 0 : stokAwal; di constructor.',
    'pinjam(): if (stok <= 0) return false; stok--; return true;',
    'toString: return judul + ": " + stok + " eksemplar";',
  ],
  tes: [{ nama: 'Dua buku, satu dipinjam', stdin: '', harap: 'Laskar Pelangi: 1 eksemplar\nBumi Manusia: 0 eksemplar' }],
};
