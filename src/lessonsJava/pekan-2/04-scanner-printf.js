export default {
  id: 'java-scanner-printf',
  judul: 'Masukan dan Keluaran: Scanner & printf',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 25,
  kelasUtama: 'Main',
  materi: `
# Scanner & printf: Masukan dan Keluaran Terkendali ⌨️

## Membaca masukan

~~~java
import java.util.Scanner;   // wajib, di atas deklarasi kelas

Scanner in = new Scanner(System.in);
int umur = in.nextInt();          // satu bilangan bulat
double ipk = in.nextDouble();     // satu bilangan pecahan
String kata = in.next();          // satu kata (berhenti di spasi)
String baris = in.nextLine();     // satu baris PENUH (termasuk spasi)
~~~

**Jebakan paling umum:** \`nextInt()\`/\`nextDouble()\` hanya mengambil angkanya dan **meninggalkan penanda akhir baris** di dalam antrean. Kalau setelah itu kamu memanggil \`nextLine()\`, ia langsung menemui penanda kosong itu dan mengembalikan string kosong \`""\` — bukan menunggu masukan baru. Perbaikannya: tambahkan satu \`in.nextLine();\` pembuang setelah membaca angka yang akan diikuti pembacaan baris.

## Mencetak dengan format

\`printf\` mencetak dengan **lebar kolom** yang bisa dikendalikan — kunci membuat tabel teks yang rapi.

| Penentu | Untuk | Contoh | Keluaran |
| --- | --- | --- | --- |
| \`%d\` | bilangan bulat | \`printf("%5d", 42)\` | \`"   42"\` (rata kanan, lebar 5) |
| \`%s\` | teks | \`printf("%-8s\\|", "PBO")\` | \`"PBO     \\|"\` (rata kiri) |
| \`%f\` | pecahan | \`printf("%.2f", 3.14159)\` | \`"3.14"\` |
| \`%c\` | karakter | \`printf("%c", 65)\` | \`"A"\` |
| \`%n\` | pindah baris | | baris baru sesuai sistem operasi |

Angka setelah \`%\` adalah lebar minimum kolom; tanda minus membuat isinya rata kiri. Kombinasi keduanya adalah cara membuat tabel teks yang lurus — kolom berikutnya tidak akan terdorong walau isinya panjangnya beda-beda, selama lebarnya cukup.
`,
  tugas: `
Buat \`Main.java\` yang membaca **dua baris masukan**: nama barang (\`nextLine()\`) lalu harga dan jumlah (dua bilangan, dipisah spasi, dibaca dengan \`nextInt()\`), lalu mencetak **satu baris**:

\`\`\`
<nama> x<jumlah> = Rp<total>
\`\`\`

di mana \`total = harga * jumlah\`. Gunakan \`printf\` dengan penentu \`%s\`, \`%d\`, dan \`%n\` (bukan \`println\` biasa yang digabung dengan \`+\`).

Contoh: masukan \`Kopi\` lalu \`15000 3\` → keluaran \`Kopi x3 = Rp45000\`.
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String nama = in.nextLine();
        int harga = in.nextInt();
        int jumlah = in.nextInt();

        // TODO: cetak "<nama> x<jumlah> = Rp<total>" dengan printf

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
        String nama = in.nextLine();
        int harga = in.nextInt();
        int jumlah = in.nextInt();

        int total = harga * jumlah;
        System.out.printf("%s x%d = Rp%d%n", nama, jumlah, total);
    }
}
`,
    },
  ],
  petunjuk: [
    'total = harga * jumlah;',
    'System.out.printf("%s x%d = Rp%d%n", nama, jumlah, total);',
    'Urutan argumen printf harus sama persis dengan urutan %s/%d di dalam teks formatnya.',
  ],
  tes: [
    { nama: 'Kopi, harga 15000, jumlah 3', stdin: 'Kopi\n15000 3\n', harap: 'Kopi x3 = Rp45000' },
    { nama: 'Teh Manis, harga 8000, jumlah 5', stdin: 'Teh Manis\n8000 5\n', harap: 'Teh Manis x5 = Rp40000' },
  ],
};
