export default {
  id: 'java-percabangan',
  judul: 'Percabangan',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 20,
  kelasUtama: 'Main',
  materi: `
# Percabangan: if/else if/else dan switch 🔀

Rantai \`if / else if / else\` **berhenti pada cabang pertama yang benar**. Urutan cabang menentukan hasil — menuliskan syarat yang sudah pasti benar di cabang berikutnya bukan salah, tapi menambah kemungkinan galat tanpa menambah kebenaran.

~~~java
int skor = 82;
String huruf;
if (skor >= 85)      huruf = "A";
else if (skor >= 75) huruf = "B";   // dievaluasi hanya bila skor < 85
else if (skor >= 60) huruf = "C";
else                  huruf = "D";
~~~

**Dua kesalahan struktural yang sering terjadi:** meletakkan titik koma tepat setelah tanda tutup kurung kondisi (\`if (x > 0);\`) — Java membacanya sebagai \`if\` dengan badan kosong, dan blok \`{ ... }\` di baris berikutnya selalu dijalankan apa pun kondisinya. Kedua-duanya sah menurut tata bahasa dan **tidak menghasilkan pesan galat apa pun** — masuk kategori galat logika.

## switch

**Bentuk klasik** meloloskan diri ke \`case\` berikutnya kalau tidak ada \`break\` — perilaku yang disengaja perancang bahasa, dan sumber galat yang khas.

~~~java
int n = 2;
switch (n) {
    case 1: System.out.println("Satu"); break;
    case 2: System.out.println("Dua");        // tidak ada break -> lanjut ke case 3
    case 3: System.out.println("Tiga"); break;
    default: System.out.println("Lain");
}
// Dua
// Tiga
~~~

**Bentuk anak panah** (Java 14+, dipakai mata kuliah ini) tidak meloloskan diri dan bisa langsung menghasilkan nilai:

~~~java
String hari = "Sabtu";
String tipe = switch (hari) {
    case "Sabtu", "Minggu" -> "Akhir pekan";
    default -> "Hari kerja";
};
~~~

\`switch\` bekerja pada \`int\`, \`char\`, \`String\`, dan \`enum\` — **tidak** pada \`double\` dan tidak untuk rentang nilai (\`60..75\`); untuk itu tetap pakai rantai \`if\`.
`,
  tugas: `
Buat \`Main.java\` yang membaca satu bilangan bulat \`skor\` (0–100), lalu:

1. Cetak huruf mutu dengan rantai \`if/else if/else\`: \`skor >= 85\` → \`"A"\`, \`>= 75\` → \`"B"\`, \`>= 60\` → \`"C"\`, sisanya → \`"D"\`.
2. Baca satu kata \`hari\` (Senin/.../Minggu), lalu cetak \`"Akhir pekan"\` untuk Sabtu/Minggu, \`"Hari kerja"\` untuk lainnya — pakai bentuk \`switch\` anak panah.
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int skor = in.nextInt();
        String hari = in.next();

        // TODO: cetak huruf mutu, lalu cetak jenis hari

    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Main.java',
      isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int skor = in.nextInt();
        String hari = in.next();

        String huruf;
        if (skor >= 85) huruf = "A";
        else if (skor >= 75) huruf = "B";
        else if (skor >= 60) huruf = "C";
        else huruf = "D";
        System.out.println(huruf);

        String tipe = switch (hari) {
            case "Sabtu", "Minggu" -> "Akhir pekan";
            default -> "Hari kerja";
        };
        System.out.println(tipe);
    }
}
`,
    },
  ],
  petunjuk: [
    'Rantai if/else if berhenti pada cabang pertama yang benar — urutkan dari syarat terbesar ke terkecil.',
    'switch (hari) { case "Sabtu", "Minggu" -> "Akhir pekan"; default -> "Hari kerja"; };',
  ],
  tes: [
    { nama: 'skor 90, Senin', stdin: '90 Senin\n', harap: 'A\nHari kerja' },
    { nama: 'skor 78, Minggu', stdin: '78 Minggu\n', harap: 'B\nAkhir pekan' },
    { nama: 'skor 40, Sabtu', stdin: '40 Sabtu\n', harap: 'D\nAkhir pekan' },
  ],
};
