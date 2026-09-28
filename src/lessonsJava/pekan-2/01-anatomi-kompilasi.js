export default {
  id: 'java-anatomi-kompilasi',
  judul: 'Anatomi Program Java & Kompilasi',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 2,
  xp: 15,
  kelasUtama: 'Main',
  materi: `
# Anatomi Program Java & Kompilasi ☕

Beda dengan C (yang langsung kamu compile jadi \`.exe\`) atau Python (yang langsung dijalankan interpreternya), Java punya **dua langkah terpisah**:

~~~text
$ javac Main.java     # langkah 1: KOMPILASI -> menghasilkan Main.class
$ java Main            # langkah 2: EKSEKUSI -> tanpa akhiran .java/.class
~~~

- \`javac\` (Java **c**ompiler) mengubah kode sumber \`.java\` jadi bytecode \`.class\` yang bisa dibaca JVM (Java Virtual Machine). Ini yang memeriksa **tata bahasa** — kalau ada yang salah, kompilasi gagal dan \`.class\` tidak pernah dibuat.
- \`java\` menjalankan bytecode itu di JVM. Ini yang memeriksa **apa yang terjadi saat program benar-benar jalan** dengan data tertentu.

Di LatihKode, kedua langkah ini otomatis dilakukan saat kamu menekan **▶ Jalankan** — persis seperti kamu mengetik dua perintah itu di terminal.

## Kerangka program terkecil

~~~java
public class Main {
    public static void main(String[] args) {
        System.out.println("Selamat pagi, PBO");
    }
}
~~~

| Bagian | Peran |
| --- | --- |
| \`public class Main\` | Nama kelas **harus sama** dengan nama berkasnya (\`Main.java\`), termasuk huruf besar-kecil. |
| \`public static void main(String[] args)\` | Titik masuk program. JVM mencari method dengan tanda tangan **persis** seperti ini. |
| \`System.out.println(...)\` | Memanggil method \`println\` pada objek \`out\` milik kelas \`System\`. Mirip \`printf\` di C atau \`print\` di Python, tapi selalu lewat objek. |

Perhatikan: **titik koma \`;\` wajib** di setiap pernyataan (beda dengan JavaScript yang kadang membolehkannya opsional), dan setiap blok kode diapit \`{ }\` — mirip C, beda dengan Python yang memakai indentasi.
`,
  tugas: `
Lengkapi \`Main.java\` supaya mencetak **dua baris** berikut, persis sama:

1. \`Halo dari Java!\`
2. \`javac mengompilasi, java menjalankan.\`
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `public class Main {
    public static void main(String[] args) {
        // Tulis kodemu di bawah ini

    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Main.java',
      isi: `public class Main {
    public static void main(String[] args) {
        System.out.println("Halo dari Java!");
        System.out.println("javac mengompilasi, java menjalankan.");
    }
}
`,
    },
  ],
  petunjuk: [
    'Bentuknya: System.out.println("teks yang mau dicetak");',
    'Kamu butuh dua baris println, satu untuk tiap baris keluaran. Jangan lupa titik koma di akhir tiap baris.',
  ],
  tes: [
    { nama: 'Mencetak dua baris yang diminta', stdin: '', harap: 'Halo dari Java!\njavac mengompilasi, java menjalankan.' },
  ],
};
