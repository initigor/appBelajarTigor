export default {
  id: 'java-perulangan',
  judul: 'Perulangan',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 25,
  kelasUtama: 'Main',
  materi: `
# Perulangan: Menghitung Batas Sebelum Menjalankan 🔁

| Bentuk | Dipakai bila | Ciri |
| --- | --- | --- |
| \`for\` | Jumlah putaran diketahui sebelum perulangan dimulai | Pencacah, batas, dan kenaikan berkumpul di satu baris |
| \`while\` | Jumlah putaran bergantung keadaan yang berubah | Kondisi diperiksa sebelum badan; badan bisa tidak pernah dijalankan |
| \`do-while\` | Badan **harus** dijalankan minimal satu kali | Kondisi diperiksa **setelah** badan — lazim untuk validasi masukan |
| for-each | Menelusuri seluruh isi array/koleksi | Tidak menyediakan indeks; tidak bisa mengubah array melaluinya |

~~~java
int[] data = {4, 8, 15, 16, 23, 42};

for (int i = 0; i < data.length; i++) {          // dipakai bila indeksnya diperlukan
    System.out.printf("data[%d] = %d%n", i, data[i]);
}
for (int nilai : data) System.out.println(nilai); // for-each — lebih ringkas bila indeks tak diperlukan

int pilihan;
do {                                                // do-while — validasi masukan
    System.out.print("Pilih 1-3: ");
    pilihan = in.nextInt();
} while (pilihan < 1 || pilihan > 3);
~~~

## Batas perulangan: galat selisih satu

Kesalahan paling sering pada perulangan adalah batas yang bergeser satu langkah. Untuk array berukuran \`n\`, indeks yang sah adalah \`0\` sampai \`n - 1\`.

| Kondisi | Akibat pada array berukuran 6 |
| --- | --- |
| \`i = 0; i < data.length\` | Benar — enam putaran, semua indeks sah |
| \`i = 0; i <= data.length\` | \`ArrayIndexOutOfBoundsException\` pada putaran ketujuh |
| \`i = 1; i < data.length\` | Elemen pertama (indeks 0) terlewat — **tanpa pesan galat** |

**Kebiasaan yang berguna:** sebelum menjalankan perulangan bersarang atau rumit, hitung jumlah putaran di kepala (atau tuliskan di komentar) dan bandingkan dengan keluaran sungguhan — persis kebiasaan yang dilatih aktivitas prediksi.

\`break\` menghentikan **seluruh** perulangan terdekat; \`continue\` melewati sisa badan dan lanjut ke putaran berikutnya. Pada perulangan bersarang, keduanya hanya berlaku pada perulangan **terdalam** tempat ia dituliskan.
`,
  tugas: `
Buat \`Main.java\` yang membaca satu bilangan bulat \`n\`, lalu:

1. Cetak jumlah semua bilangan dari \`1\` sampai \`n\` (pakai \`for\`).
2. Cetak jumlah semua bilangan **genap** dari \`1\` sampai \`n\` saja (pakai \`for\` + \`continue\` untuk melewati bilangan ganjil).
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();

        // TODO: cetak total 1..n, lalu cetak total genap 1..n

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
        int n = in.nextInt();

        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        System.out.println(total);

        int totalGenap = 0;
        for (int i = 1; i <= n; i++) {
            if (i % 2 != 0) continue;
            totalGenap += i;
        }
        System.out.println(totalGenap);
    }
}
`,
    },
  ],
  petunjuk: [
    'for (int i = 1; i <= n; i++) total += i; — perhatikan i <= n, bukan i < n, karena batas atasnya inklusif.',
    'continue melewati sisa badan loop untuk putaran itu saja, lalu lanjut ke i berikutnya.',
  ],
  tes: [
    { nama: 'n = 5', stdin: '5\n', harap: '15\n6' },
    { nama: 'n = 10', stdin: '10\n', harap: '55\n30' },
    { nama: 'n = 1', stdin: '1\n', harap: '1\n0' },
  ],
};
