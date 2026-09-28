const KODE_BERMASALAH = [
  {
    nama: 'Main.java',
    isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] nilai = {80, 90, 70};
        int total = 0;
        for (int i = 0; i <= nilai.length; i++) {
            total += nilai[i];
        }
        System.out.println("Total: " + total);
    }
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'Main.java',
    isi: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] nilai = {80, 90, 70};
        int total = 0;
        for (int i = 0; i < nilai.length; i++) {
            total += nilai[i];
        }
        System.out.println("Total: " + total);
    }
}
`,
  },
];

export default {
  id: 'java-tiga-jenis-galat',
  judul: 'Tiga Jenis Galat: Kompilasi, Eksekusi, Logika',
  tipe: 'java',
  subtipe: 'bedah-galat',
  pekan: 2,
  xp: 20,
  kelasUtama: 'Main',
  kodeBermasalah: KODE_BERMASALAH,
  solusi: KODE_SOLUSI,
  materi: `
# Tiga Jenis Galat 🐞

Sepanjang Pekan 2 kamu sudah bertemu ketiganya satu per satu. Sekarang saatnya mengenali **polanya**:

| Jenis | Muncul saat | Ciri |
| --- | --- | --- |
| **Kompilasi** | \`javac\` | Tata bahasa salah. Program **tidak pernah** menghasilkan berkas \`.class\`. Pesannya memuat kata \`error:\` dan nomor baris. |
| **Eksekusi** | \`java\` | Tata bahasa sudah benar, tapi data/keadaan tertentu membuat program berhenti paksa. Pesannya memuat \`Exception in thread "main"\`. |
| **Logika** | Tidak ada pesan sama sekali | Program **berjalan sampai selesai** dan memberi jawaban yang **salah** dengan tenang. Paling berbahaya karena tidak ada yang memberitahumu. |

Urutan ini juga urutan **biaya**: semakin lambat sebuah galat ditemukan, semakin mahal akibatnya. Galat kompilasi ditemukan dalam hitungan detik; galat logika bisa lolos sampai data sungguhan dipakai orang lain.

**Kebiasaan yang menyelamatkan:** sebelum menjalankan, tuliskan prediksimu. Kalau prediksi meleset padahal tidak ada pesan galat, itu tandanya galat logika — dan satu-satunya cara menemukannya adalah membandingkan keluaran dengan nilai yang sudah kamu ketahui benar.
`,
  tugas: `
Kode di sebelah **berjalan tanpa pesan galat apa pun** untuk beberapa kasus, tapi sebenarnya salah. Jalankan untuk melihat apa yang terjadi, lalu:

1. Pilih penyebabnya.
2. Tetapkan jenis galatnya.
3. Perbaiki sampai lolos.
`,
  pilihanPenyebab: [
    { teks: 'Batas perulangan i <= nilai.length membuat indeks ke-3 (di luar array berukuran 3) ikut diakses', benar: true },
    { teks: 'Array nilai seharusnya diisi lewat Scanner, bukan ditulis langsung di kode', benar: false },
    { teks: 'Variabel total seharusnya bertipe double', benar: false },
  ],
  jenisGalatBenar: 'eksekusi',
  penjelasan: `
Array \`nilai\` berukuran 3, jadi indeks yang sah adalah \`0\`, \`1\`, \`2\`. Kondisi \`i <= nilai.length\` mengizinkan \`i\` mencapai \`3\` — satu langkah melewati batas — sehingga \`nilai[3]\` melempar \`ArrayIndexOutOfBoundsException\`. Ini **galat eksekusi**: tata bahasanya sah (kompilasi berhasil), tapi programnya berhenti paksa saat benar-benar dijalankan dengan data ini.

Perbaikannya sederhana: ganti \`<=\` menjadi \`<\`, supaya \`i\` berhenti di \`2\` (elemen terakhir yang sah).
`,
  petunjuk: ['Array nilai berukuran 3 — indeks sah cuma 0, 1, 2.', 'Bandingkan kondisi perulangan dengan kebiasaan yang sudah kamu pakai di lesson Perulangan.'],
  tes: [{ nama: 'Total tiga nilai', stdin: '', harap: 'Total: 240' }],
};
