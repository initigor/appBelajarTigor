export default {
  id: 'java-operator',
  judul: 'Operator',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 20,
  kelasUtama: 'Main',
  materi: `
# Operator 🧮

| Kelompok | Operator | Catatan |
| --- | --- | --- |
| Aritmatika | \`+ - * / %\` | Perilaku \`/\` dan \`%\` bergantung tipe operan (lihat lesson Tipe Data) |
| Penugasan | \`= += -= *= /= %=\` | \`x += 1\` setara \`x = x + 1\` |
| Penaikan | \`++ --\` | Bentuk awalan/akhiran hasilnya berbeda |
| Perbandingan | \`== != < <= > >=\` | Pada tipe rujukan, \`==\` membandingkan alamat, bukan isi |
| Logika | \`&& \|\| !\` | **Menghubung-singkat**: operan kedua tidak dievaluasi kalau hasil sudah pasti |
| Logika penuh | \`& \|\` | Selalu mengevaluasi kedua operan — hampir selalu bukan yang kamu inginkan |
| Ternari | \`kondisi ? a : b\` | Ekspresi, menghasilkan nilai (bukan pernyataan) |

## Hubung-singkat: bukan sekadar hemat, tapi pelindung

\`&&\` berhenti begitu operan kiri \`false\`, \`\|\|\` berhenti begitu operan kiri \`true\`. Pola ini dipakai sebagai **pelindung**: periksa syarat aman di kiri sebelum melakukan operasi berisiko di kanan.

~~~java
int[] arr = {3, 0, 9};
if (arr.length > 5 && arr[7] == 1) { }   // aman: arr[7] tidak pernah dievaluasi
int x = 0;
boolean r = (x != 0) && (10 / x > 1);    // false, tanpa pembagian oleh nol
~~~

Ini hanya berlaku dengan \`&&\`/\`\|\|\`, **bukan** dengan \`&\`/\`\|\` — keduanya selalu mengevaluasi kedua sisi.

## Urutan pengerjaan

Dari yang paling awal: tanda kurung; awalan \`++\`/\`--\` serta \`!\` dan casting; \`* / %\`; \`+ -\`; perbandingan; \`== !=\`; \`&&\`; \`\|\|\`; ternari; penugasan. Kalau ragu, tambahkan tanda kurung eksplisit — itu bukan tanda kelemahan.
`,
  tugas: `
Buat \`Main.java\` yang membaca **tiga bilangan bulat** \`a\`, \`b\`, \`c\` (dipisah spasi, satu baris), lalu mencetak **tiga baris**:

1. Hasil \`a + b * c\` (perhatikan urutan pengerjaan — perkalian dulu).
2. \`"aman"\` jika \`c\` tidak nol **dan** \`a / c\` lebih dari \`1\`; kalau tidak, cetak \`"tidak aman"\`. Gunakan **satu ekspresi** dengan \`&&\` yang memakai sifat hubung-singkat supaya tidak pernah membagi dengan nol.
3. Hasil ternari: \`"genap"\` jika \`b\` genap, \`"ganjil"\` jika tidak (gunakan operator \`%\` dan \`?:\`).
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();

        // TODO: tiga baris sesuai instruksi

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
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();

        System.out.println(a + b * c);
        System.out.println((c != 0 && a / c > 1) ? "aman" : "tidak aman");
        System.out.println(b % 2 == 0 ? "genap" : "ganjil");
    }
}
`,
    },
  ],
  petunjuk: [
    'a + b * c — perkalian dikerjakan lebih dulu daripada penjumlahan, tanpa perlu kurung.',
    '(c != 0 && a / c > 1) ? "aman" : "tidak aman" — && berhenti di kiri kalau c == 0, jadi a / c tidak pernah dihitung.',
    'b % 2 == 0 ? "genap" : "ganjil"',
  ],
  tes: [
    { nama: 'a=10, b=3, c=4', stdin: '10 3 4\n', harap: '22\naman\nganjil' },
    { nama: 'c=0 (harus tetap aman dari pembagian nol)', stdin: '5 6 0\n', harap: '5\ntidak aman\ngenap' },
  ],
};
