const KODE_AWAL = [
  {
    nama: 'SlotParkir.java',
    isi: `public class SlotParkir {
    // TODO: field static private jumlahSlot (pencacah SEMUA slot yang pernah dibuat)
    // TODO: field private nomor (int, otomatis dari jumlahSlot), kapasitas (int), terisi (int, mulai 0)

    public SlotParkir(int kapasitas) {
        // TODO: naikkan jumlahSlot, this.nomor = jumlahSlot
        // TODO: kapasitas yang <= 0 dijadikan 1 (jangan biarkan slot tanpa kapasitas)
        // TODO: this.terisi = 0
    }

    public boolean masuk() {
        return false; // TODO: true & terisi++ bila masih ada ruang (terisi < kapasitas), selain itu false
    }

    public boolean keluar() {
        return false; // TODO: true & terisi-- bila ada kendaraan (terisi > 0), selain itu false
    }

    public int getNomor() { return 0; } // TODO
    public int getTerisi() { return 0; } // TODO
    public int getKapasitas() { return 0; } // TODO

    public double persenTerisi() {
        return 0; // TODO: (double) terisi / kapasitas * 100
    }

    public static int getJumlahSlot() {
        return 0; // TODO
    }
}
`,
  },
];

const KODE_SOLUSI = [
  {
    nama: 'SlotParkir.java',
    isi: `public class SlotParkir {
    private static int jumlahSlot = 0;
    private int nomor;
    private int kapasitas;
    private int terisi;

    public SlotParkir(int kapasitas) {
        jumlahSlot++;
        this.nomor = jumlahSlot;
        this.kapasitas = (kapasitas <= 0) ? 1 : kapasitas;
        this.terisi = 0;
    }

    public boolean masuk() {
        if (terisi >= kapasitas) return false;
        terisi++;
        return true;
    }

    public boolean keluar() {
        if (terisi <= 0) return false;
        terisi--;
        return true;
    }

    public int getNomor() { return nomor; }
    public int getTerisi() { return terisi; }
    public int getKapasitas() { return kapasitas; }

    public double persenTerisi() {
        return (double) terisi / kapasitas * 100;
    }

    public static int getJumlahSlot() {
        return jumlahSlot;
    }
}
`,
  },
];

const TES_UTAMA = `public class TesUtama {
    public static void main(String[] args) {
        try {
            SlotParkir s1 = new SlotParkir(4);
            SlotParkir s2 = new SlotParkir(-3);
            SlotParkir s3 = new SlotParkir(2);

            Penguji.cek("nomor slot otomatis berurutan (1, 2, 3)", s1.getNomor() == 1 && s2.getNomor() == 2 && s3.getNomor() == 3,
                "getNomor() = " + s1.getNomor() + ", " + s2.getNomor() + ", " + s3.getNomor());
            Penguji.cek("kapasitas <= 0 dijadikan 1", s2.getKapasitas() == 1, "SlotParkir(-3).getKapasitas() = " + s2.getKapasitas() + ", seharusnya 1");
            Penguji.cek("getJumlahSlot menghitung TOTAL slot yang dibuat", SlotParkir.getJumlahSlot() == 3, "getJumlahSlot() = " + SlotParkir.getJumlahSlot());
            Penguji.cek("getJumlahSlot bersifat static", Penguji.isStaticMethod(SlotParkir.class, "getJumlahSlot"), "getJumlahSlot() harus static");

            Penguji.cek("field kapasitas private", Penguji.isPrivateField(SlotParkir.class, "kapasitas"), "field 'kapasitas' harus private");
            Penguji.cek("field terisi private", Penguji.isPrivateField(SlotParkir.class, "terisi"), "field 'terisi' harus private");
            Penguji.cek("field jumlahSlot bertanda static", Penguji.isStaticField(SlotParkir.class, "jumlahSlot"), "field 'jumlahSlot' harus static");

            boolean m1 = s1.masuk();
            boolean m2 = s1.masuk();
            boolean m3 = s1.masuk();
            boolean m4 = s1.masuk();
            boolean m5 = s1.masuk();
            Penguji.cek("masuk() mengisi sampai penuh lalu menolak", m1 && m2 && m3 && m4 && !m5,
                "5x masuk() pada slot berkapasitas 4 menghasilkan " + m1 + "," + m2 + "," + m3 + "," + m4 + "," + m5 + " — seharusnya true,true,true,true,false");
            Penguji.cek("terisi tidak melebihi kapasitas", s1.getTerisi() == 4, "getTerisi() = " + s1.getTerisi() + ", seharusnya 4 (tidak boleh 5)");

            boolean k1 = s1.keluar();
            Penguji.cek("keluar() mengurangi terisi", k1 && s1.getTerisi() == 3, "Setelah keluar(), getTerisi() = " + s1.getTerisi() + ", seharusnya 3");

            boolean kKosong = s3.keluar();
            Penguji.cek("keluar() pada slot kosong ditolak (tidak jadi negatif)", !kKosong && s3.getTerisi() == 0,
                "keluar() pada slot kosong menghasilkan " + kKosong + " dan terisi=" + s3.getTerisi() + ", seharusnya false dan 0");

            double persen = s1.persenTerisi();
            Penguji.cek("persenTerisi menghitung dengan benar", Math.abs(persen - 75.0) < 0.001, "persenTerisi() = " + persen + ", seharusnya 75.0 (3 dari 4 slot)");
        } catch (Throwable e) {
            Penguji.cekError("tak terduga", e);
        }
    }
}
`;

export default {
  id: 'proyek-parkir',
  judul: 'Mini Proyek: Sistem Slot Parkir',
  tipe: 'java',
  subtipe: 'kode-kelas',
  pekan: 3,
  xp: 50,
  proyek: true,
  kodeAwal: KODE_AWAL,
  solusi: KODE_SOLUSI,
  tesUtamaNama: 'TesUtama',
  tesUtamaIsi: TES_UTAMA,
  daftarTes: [
    'nomor slot otomatis berurutan (1, 2, 3)',
    'kapasitas <= 0 dijadikan 1',
    'getJumlahSlot menghitung TOTAL slot yang dibuat',
    'getJumlahSlot bersifat static',
    'field kapasitas private',
    'field terisi private',
    'field jumlahSlot bertanda static',
    'masuk() mengisi sampai penuh lalu menolak',
    'terisi tidak melebihi kapasitas',
    'keluar() mengurangi terisi',
    'keluar() pada slot kosong ditolak (tidak jadi negatif)',
    'persenTerisi menghitung dengan benar',
  ],
  materi: `
# 🛠️ Mini Proyek: Sistem Slot Parkir

Gedung parkir kampus punya beberapa **slot** (petak parkir), masing-masing dengan kapasitas berbeda (misalnya satu slot untuk 4 motor, slot lain untuk 2 mobil). Kamu akan menulis kelas \`SlotParkir\` yang mengelola satu slot — persis pola yang sudah kamu praktikkan sepanjang pekan ini: field \`private\`, constructor yang memvalidasi, method yang menjaga aturannya sendiri, dan pencacah \`static\` untuk menghitung total slot yang pernah dibuat.

Proyek ini menggabungkan **semua** yang sudah kamu pelajari:
- **Constructor yang menjamin objek lahir dalam keadaan sah** (subbab 1.3) — kapasitas yang tidak masuk akal diperbaiki, bukan dibiarkan.
- **Access modifier** (subbab 1.5) — field \`private\`, hanya method yang boleh mengubahnya.
- **Static** (subbab 1.6) — pencacah \`jumlahSlot\` milik kelas, bukan milik satu slot.
- **Method yang menjaga aturannya sendiri** (subbab 1.4) — \`masuk()\`/\`keluar()\` menolak permintaan yang tidak masuk akal (slot penuh, atau slot yang memang kosong), bukan membiarkan \`terisi\` jadi negatif atau melebihi kapasitas.

Kelas tersembunyi akan menguji \`SlotParkir\`-mu lewat cara yang sama seperti lesson "Static" sebelumnya — kamu tidak perlu (dan tidak bisa) mengubah kelas penguji itu.
`,
  tugas: `
Lengkapi \`SlotParkir.java\`:

1. \`private static int jumlahSlot\` — pencacah **seluruh** slot yang pernah dibuat.
2. \`private int nomor\` — otomatis dari \`jumlahSlot\` (slot pertama bernomor 1, kedua bernomor 2, dst).
3. \`private int kapasitas\` — dari constructor; nilai \`<= 0\` **diperbaiki** jadi \`1\` (jangan biarkan slot tanpa kapasitas).
4. \`private int terisi\` — mulai dari \`0\`.
5. \`masuk()\` → \`true\` dan \`terisi++\` **hanya** bila \`terisi < kapasitas\`; kalau sudah penuh, \`false\` tanpa mengubah apa pun.
6. \`keluar()\` → \`true\` dan \`terisi--\` **hanya** bila \`terisi > 0\`; kalau sudah kosong, \`false\` tanpa mengubah apa pun (jangan sampai \`terisi\` jadi negatif).
7. \`getNomor()\`, \`getTerisi()\`, \`getKapasitas()\` — getter biasa.
8. \`persenTerisi()\` → \`(double) terisi / kapasitas * 100\`.
9. \`static int getJumlahSlot()\` — dipanggil lewat nama kelas: \`SlotParkir.getJumlahSlot()\`.
`,
  petunjuk: [
    'Constructor: jumlahSlot++; this.nomor = jumlahSlot; lalu this.kapasitas = (kapasitas <= 0) ? 1 : kapasitas;',
    'masuk(): if (terisi >= kapasitas) return false; terisi++; return true;',
    'keluar(): if (terisi <= 0) return false; terisi--; return true;',
    'persenTerisi harus melakukan casting ke double SEBELUM pembagian, supaya hasilnya tidak dipotong jadi bilangan bulat — persis akibat tipe data yang kamu pelajari di Pekan 2.',
  ],
};
