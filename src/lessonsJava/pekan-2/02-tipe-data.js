const KODE_CUPLIKAN = `public class Main {
    public static void main(String[] args) {
        int a = 9, b = 4;
        System.out.println(a / b);
        System.out.println((double) a / b);

        int besar = 2_000_000_000;
        System.out.println(besar + 800_000_000);

        System.out.println((int) 7.9);
        System.out.println(Math.round(-6.5));
    }
}
`;

export default {
  id: 'java-tipe-data',
  judul: 'Tipe Data: Rentang, Overflow, dan Casting',
  tipe: 'java',
  subtipe: 'prediksi',
  pekan: 2,
  xp: 20,
  kodeCuplikan: KODE_CUPLIKAN,
  kelasUtamaCuplikan: 'Main',
  materi: `
# Tipe Data: Pilihan yang Membawa Akibat 🔢

Java **bertipe statis** — setiap variabel dideklarasikan dengan tipenya, dan tipe itu tidak berubah (beda dengan Python, mirip C). Delapan tipe **primitif** menyimpan nilai secara langsung; sisanya (\`String\`, array, kelas) adalah **rujukan** ke objek — sudah kamu lihat sendiri di Chapter 8 JS untuk array dan akan diperdalam lagi di Pekan 3.

| Tipe | Ukuran | Dipakai untuk |
| --- | --- | --- |
| \`int\` | 32 bit | Bilangan bulat — pilihan baku |
| \`long\` | 64 bit | Bilangan bulat sangat besar (akhiran \`L\`) |
| \`double\` | 64 bit | Bilangan pecahan — pilihan baku |
| \`char\` | 16 bit | Satu karakter (petik tunggal) |
| \`boolean\` | — | \`true\`/\`false\` |

## Tiga akibat yang wajib kamu pahami

**1. Pembagian bulat memotong, bukan membulatkan.** Kalau kedua operand \`int\`, hasilnya juga \`int\` — bagian pecahannya **dibuang** (dipotong ke arah nol), bukan dibulatkan. \`9 / 4\` menghasilkan \`2\`, bukan \`2.25\` atau \`2\` hasil pembulatan.

**2. Bilangan bulat bisa meluap (overflow) secara diam-diam.** Kalau hasil hitungan melampaui rentang tipenya, Java **tidak melaporkan galat apa pun** — nilainya berputar ke ujung yang berlawanan. Ini beda total dengan Python (yang bilangan bulatnya tidak terbatas) dan mirip dengan bagaimana C berperilaku.

**3. \`double\` tidak eksak.** Sama seperti bahasa lain, \`double\` menyimpan pecahan dalam basis dua, sehingga banyak nilai desimal tidak punya representasi tepat.

## Casting

~~~java
int i = 42;
double d = i;        // otomatis: int -> double (melebar, aman)
int j = (int) d;      // wajib eksplisit: double -> int (mempersempit, bisa hilang info)
~~~

\`(int) 7.9\` memotong jadi \`7\` (bukan membulatkan), sedangkan \`Math.round(...)\` betul-betul membulatkan — dan Java **selalu membulatkan setengah ke arah positif**, jadi \`Math.round(-6.5)\` menghasilkan \`-6\`, bukan \`-7\`.
`,
  tugas: `
Baca cuplikan di sebelah, lalu tulis prediksi **semua baris** keluarannya sebelum menjalankan.
`,
  penjelasan: `
1. \`a / b\` = \`9 / 4\` → kedua operand \`int\`, hasilnya dipotong jadi \`2\`.
2. \`(double) a / b\` → \`a\` dijadikan \`double\` dulu **sebelum** pembagian, jadi hasilnya \`2.25\`.
3. \`besar + 800_000_000\` → \`2.000.000.000 + 800.000.000 = 2.800.000.000\`, melampaui batas \`int\` (\`2.147.483.647\`) dan **meluap** jadi negatif tanpa peringatan apa pun: \`-1494967296\`.
4. \`(int) 7.9\` → casting memotong bagian pecahan: \`7\`.
5. \`Math.round(-6.5)\` → dibulatkan ke arah positif: \`-6\` (bukan \`-7\`).
`,
};
