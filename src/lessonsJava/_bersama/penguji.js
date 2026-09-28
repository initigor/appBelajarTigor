// Kelas pembantu tersembunyi untuk latihan tipe "kode-kelas": dikompilasi bersama kode kelas milik siswa
// dan satu kelas TesUtama per pelajaran. Mencetak baris "@@TES@@1@@nama" (lulus) atau
// "@@TES@@0@@nama@@pesan" (gagal) yang diurai oleh src/engine/javaClient.js (uraiProtokolTes).
export const PENGUJI_JAVA = `import java.lang.reflect.*;

/** Alat bantu tes tersembunyi. Jangan diubah dari sisi latihan. */
class Penguji {
    static void ok(String nama) {
        System.out.println("@@TES@@1@@" + nama);
    }
    static void gagal(String nama, String pesan) {
        System.out.println("@@TES@@0@@" + nama + "@@" + pesan.replace("\\n", " "));
    }
    static void cek(String nama, boolean kondisi, String pesanGagal) {
        if (kondisi) ok(nama); else gagal(nama, pesanGagal);
    }
    static void cekError(String nama, Throwable e) {
        gagal(nama, "Kodemu melempar " + e.getClass().getSimpleName() + ": " + e.getMessage());
    }
    static Field field(Class<?> kelas, String nama) throws Exception {
        Field f = kelas.getDeclaredField(nama);
        f.setAccessible(true);
        return f;
    }
    static boolean isPrivateField(Class<?> kelas, String namaField) throws Exception {
        return Modifier.isPrivate(field(kelas, namaField).getModifiers());
    }
    static Object nilaiField(Object objek, String namaField) throws Exception {
        return field(objek.getClass(), namaField).get(objek);
    }
    static boolean adaConstructor(Class<?> kelas, Class<?>... tipe) {
        try {
            kelas.getDeclaredConstructor(tipe);
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
    static boolean isStaticMethod(Class<?> kelas, String nama, Class<?>... tipe) throws Exception {
        Method m = kelas.getDeclaredMethod(nama, tipe);
        return Modifier.isStatic(m.getModifiers());
    }
    static boolean isStaticField(Class<?> kelas, String nama) throws Exception {
        return Modifier.isStatic(field(kelas, nama).getModifiers());
    }
    static boolean adaMethod(Class<?> kelas, String nama, Class<?>... tipe) {
        try {
            kelas.getDeclaredMethod(nama, tipe);
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
}
`;
