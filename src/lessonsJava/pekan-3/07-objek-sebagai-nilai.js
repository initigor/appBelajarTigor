export default {
  id: 'java-objek-sebagai-nilai',
  judul: 'Objek sebagai Nilai: toString, Perbandingan, Parameter',
  tipe: 'java',
  subtipe: 'kode-output',
  pekan: 3,
  xp: 30,
  kelasUtama: 'Main',
  materi: `
# Objek sebagai Nilai 📦

## Mencetak objek: method toString

Setiap kelas **mewarisi** method \`toString()\` dari kelas \`Object\`, dan \`println\` memanggilnya secara otomatis. Bawaannya menghasilkan nama kelas diikuti kode heksadesimal yang tidak bermakna bagi pembaca — **menimpanya** adalah kebiasaan yang wajib kamu bangun mulai sekarang.

~~~java
public class Lokasi {
    private double x, y;
    // ... constructor ...
    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
Lokasi t = new Lokasi(3, 4);
System.out.println(t);   // (3.0, 4.0) — bukan Lokasi@1b6d3586
~~~

Anotasi \`@Override\` memberi tahu kompilator kamu bermaksud menimpa method warisan. Kalau kamu salah mengetik namanya, **tanpa** anotasi kode tetap lolos dan diam-diam membuat method baru yang tidak pernah dipanggil; **dengan** anotasi, kompilator menolak dan memberitahumu.

## Membandingkan objek

\`==\` pada objek membandingkan **rujukan** (alamat), sama seperti pada \`String\` dan array — dua objek dengan isi sama adalah dua objek yang berbeda. Kalau kelasmu perlu pengertian "sama isinya", kamu harus menulis method-nya sendiri:

~~~java
public boolean sama(Lokasi lain) {
    return this.x == lain.x && this.y == lain.y;
}
~~~

## Objek sebagai parameter dan sebagai nilai kembalian

Method boleh menerima objek dari kelasnya sendiri, dan boleh mengembalikan objek **baru**:

~~~java
public double jarakKe(Lokasi lain) {
    double dx = this.x - lain.x, dy = this.y - lain.y;
    return Math.sqrt(dx * dx + dy * dy);
}
public Lokasi geser(double dx, double dy) {
    return new Lokasi(x + dx, y + dy);   // objek BARU; objek ini sendiri tidak berubah
}
~~~

Mengembalikan objek baru (bukan mengubah objek yang ada) disebut gaya **immutable** — sama seperti perilaku \`String\` yang sudah kamu kenal. Ini lebih aman ketika objek ditunjuk oleh banyak rujukan sekaligus, karena tidak ada yang bisa "mengejutkan" pemilik rujukan lain dengan perubahan diam-diam.
`,
  tugas: `
Lengkapi kelas \`Lokasi\` (field private \`x\`, \`y\` bertipe \`double\`):

1. \`@Override public String toString()\` → \`"(x, y)"\`, contoh \`"(3.0, 4.0)"\`.
2. \`double jarakKe(Lokasi lain)\` → jarak Euclid ke \`lain\`.
3. \`Lokasi geser(double dx, double dy)\` → **objek baru** dengan koordinat \`(x+dx, y+dy)\`; \`this\` sendiri tidak berubah.
`,
  kodeAwal: [
    {
      nama: 'Main.java',
      isi: `class Lokasi {
    private double x, y;

    Lokasi(double x, double y) {
        this.x = x;
        this.y = y;
    }

    // TODO: @Override toString() -> "(x, y)"

    // TODO: double jarakKe(Lokasi lain)

    // TODO: Lokasi geser(double dx, double dy) -> objek BARU
}

public class Main {
    public static void main(String[] args) {
        Lokasi asal = new Lokasi(0, 0);
        Lokasi p = new Lokasi(3, 4);
        System.out.println(asal.jarakKe(p));
        Lokasi q = p.geser(1, -1);
        System.out.println(q);
        System.out.println(p);
    }
}
`,
    },
  ],
  solusi: [
    {
      nama: 'Main.java',
      isi: `class Lokasi {
    private double x, y;

    Lokasi(double x, double y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }

    double jarakKe(Lokasi lain) {
        double dx = this.x - lain.x;
        double dy = this.y - lain.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    Lokasi geser(double dx, double dy) {
        return new Lokasi(x + dx, y + dy);
    }
}

public class Main {
    public static void main(String[] args) {
        Lokasi asal = new Lokasi(0, 0);
        Lokasi p = new Lokasi(3, 4);
        System.out.println(asal.jarakKe(p));
        Lokasi q = p.geser(1, -1);
        System.out.println(q);
        System.out.println(p);
    }
}
`,
    },
  ],
  petunjuk: [
    'return "(" + x + ", " + y + ")"; di dalam toString().',
    'jarakKe: Math.sqrt(dx*dx + dy*dy) dengan dx = this.x - lain.x, dy = this.y - lain.y.',
    'geser: return new Lokasi(x + dx, y + dy); — buat objek BARU, jangan mengubah x/y milik this.',
  ],
  tes: [{ nama: 'Jarak, geser, dan bukti p tidak berubah', stdin: '', harap: '5.0\n(4.0, 3.0)\n(3.0, 4.0)' }],
};
