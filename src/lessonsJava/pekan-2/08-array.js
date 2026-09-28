export default {
  id: 'java-array',
  judul: 'Array: Sifat Rujukan dan Penyalinan',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 25,
  kelasUtama: 'Main',
  materi: `
# Array: Sifat Rujukan dan Penyalinan 📚

Array adalah wadah berukuran tetap. Ukurannya ditentukan saat dibuat dan **tidak bisa diubah** sesudahnya. Array adalah tipe **rujukan** — sifat ini sama seperti sifat kelas/objek yang akan diperdalam habis-habisan di Pekan 3.

~~~java
int[] a = new int[5];        // lima elemen, semuanya bernilai 0
int[] b = {4, 8, 15, 16, 23}; // ukuran disimpulkan dari isi

int[] p = {1, 2, 3};
int[] q = p;                  // q menunjuk ke array yang SAMA, bukan salinan
q[0] = 99;
System.out.println(p[0]);     // 99 <- p ikut berubah!
~~~

## Kapan ini jadi masalah nyata

Kalau kamu perlu menampilkan data dalam urutan aslinya **sekaligus** menghitung sesuatu dari urutan yang diurutkan (median, misalnya), \`Arrays.sort\` mengubah array **di tempat** — mengurutkannya akan merusak array aslinya kalau kamu tidak menyalinnya dulu.

~~~java
import java.util.Arrays;

int[] asli = {78, 92, 65, 88, 71};
int[] urut = Arrays.copyOf(asli, asli.length);  // salinan yang aman diurutkan
Arrays.sort(urut);
// asli tetap {78, 92, 65, 88, 71}; urut menjadi {65, 71, 78, 88, 92}
~~~

| Pemanggilan | Kegunaan |
| --- | --- |
| \`Arrays.toString(a)\` | Mencetak isi array sebagai teks — tanpa ini, \`println(a)\` mencetak alamat seperti \`[I@1b6d3586\` |
| \`Arrays.sort(a)\` | Mengurutkan naik, **mengubah \`a\` di tempat** |
| \`Arrays.copyOf(a, n)\` | Menyalin ke array baru — cara membuat salinan yang benar |
`,
  tugas: `
Buat \`Main.java\` yang membaca **5 bilangan bulat** (dipisah spasi, satu baris) ke dalam sebuah array, lalu mencetak **tiga baris**:

1. Nilai minimum dan maksimum, format: \`min=<x> maks=<y>\`.
2. Array **terurut naik** (\`Arrays.toString\` pada **salinan** yang sudah diurutkan — jangan mengurutkan array aslinya).
3. Array **asli**, untuk membuktikan urutannya tidak rusak.
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] data = new int[5];
        for (int i = 0; i < data.length; i++) data[i] = in.nextInt();

        // TODO: cetak min & maks, array terurut (salinan), lalu array asli

    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Main.java',
      isi: `import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] data = new int[5];
        for (int i = 0; i < data.length; i++) data[i] = in.nextInt();

        int min = data[0], maks = data[0];
        for (int nilai : data) {
            if (nilai < min) min = nilai;
            if (nilai > maks) maks = nilai;
        }
        System.out.println("min=" + min + " maks=" + maks);

        int[] urut = Arrays.copyOf(data, data.length);
        Arrays.sort(urut);
        System.out.println(Arrays.toString(urut));
        System.out.println(Arrays.toString(data));
    }
}
`,
    },
  ],
  petunjuk: [
    'Cari min/maks dengan perulangan: mulai dari data[0], lalu bandingkan setiap elemen berikutnya.',
    'int[] urut = Arrays.copyOf(data, data.length); Arrays.sort(urut); — jangan Arrays.sort(data) langsung.',
    'Arrays.toString(array) untuk mencetak isinya sebagai teks.',
  ],
  tes: [
    { nama: 'Data campuran', stdin: '78 92 65 88 71\n', harap: 'min=65 maks=92\n[65, 71, 78, 88, 92]\n[78, 92, 65, 88, 71]' },
    { nama: 'Sudah terurut', stdin: '1 2 3 4 5\n', harap: 'min=1 maks=5\n[1, 2, 3, 4, 5]\n[1, 2, 3, 4, 5]' },
  ],
};
