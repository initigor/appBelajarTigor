const KODE_CUPLIKAN = `public class Main {
    public static void main(String[] args) {
        String a = "PBO";
        String b = new String("PBO");
        System.out.println(a == b);
        System.out.println(a.equals(b));
        a = a.toUpperCase();
        System.out.println(a);
    }
}
`;

export default {
  id: 'java-string-objek',
  judul: 'String sebagai Objek',
  tipe: 'java',
  subtipe: 'prediksi',
  pekan: 2,
  xp: 20,
  kodeCuplikan: KODE_CUPLIKAN,
  kelasUtamaCuplikan: 'Main',
  materi: `
# String sebagai Objek 🧵

Di banyak bahasa (termasuk anggapan pemula tentang Java), \`String\` terasa seperti tipe primitif. Sebenarnya **\`String\` adalah kelas** — variabel \`String\` menyimpan **rujukan** ke objek, sama seperti variabel array yang sudah kamu pelajari di Chapter 8.

## Akibat pertama: bandingkan dengan \`equals\`, bukan \`==\`

\`==\` pada tipe rujukan membandingkan **alamat** ("apakah ini objek yang sama persis"), bukan isinya. \`equals\` membandingkan **isi**.

~~~java
String s1 = "PBO";
String s2 = "PBO";
String s3 = new String("PBO");
System.out.println(s1 == s2);       // true  <- literal sama dipakai bersama (string pool)
System.out.println(s1 == s3);       // false <- new selalu membuat objek baru
System.out.println(s1.equals(s3));  // true  <- satu-satunya cara yang benar
~~~

Bahayanya: kode yang membandingkan literal dengan \`==\` kadang **kebetulan** benar, lalu gagal begitu teksnya datang dari \`Scanner\` atau digabung dari potongan lain saat program berjalan.

## Akibat kedua: String tidak bisa diubah (immutable)

Setiap operasi yang tampak "mengubah" String sebenarnya menghasilkan **objek String baru**. Objek lama tidak berubah.

~~~java
String nama = "hasanuddin";
nama.toUpperCase();          // hasilnya DIBUANG; nama tidak berubah
System.out.println(nama);    // hasanuddin
nama = nama.toUpperCase();   // hasil harus ditampung kembali
System.out.println(nama);    // HASANUDDIN
~~~

Mirip \`str.upper()\` di Python — juga mengembalikan string baru, tidak mengubah yang lama.
`,
  tugas: `
Baca cuplikan di bawah, lalu tulis **prediksi semua baris keluaran** (3 baris) di kotak yang disediakan — sebelum menjalankannya. Setelah kamu menekan "Jalankan & Bandingkan", kodenya benar-benar dijalankan dan dibandingkan dengan prediksimu.
`,
  penjelasan: `
1. \`a == b\` → **false**. \`a\` adalah literal ("PBO", dari string pool), \`b\` dibuat dengan \`new String("PBO")\` — \`new\` selalu membuat objek baru di alamat yang berbeda, walau isinya sama.
2. \`a.equals(b)\` → **true**. \`equals\` membandingkan isi, dan isinya memang sama.
3. Baris ketiga: \`a.toUpperCase()\` **tidak mengubah** \`a\` yang lama — ia mengembalikan String baru, yang di sini **ditampung kembali** ke \`a\` (\`a = a.toUpperCase();\`). Jadi baris ketiga mencetak \`PBO\` dalam huruf besar: **PBO** (karena "PBO" sudah huruf besar semua, hasilnya sama persis — perhatikan ini tetap objek String yang baru, walau tampilannya tidak berubah).
`,
  petunjuk: [],
  tes: [],
};
