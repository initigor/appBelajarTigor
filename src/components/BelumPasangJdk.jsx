import { Link } from 'react-router-dom';

/** Ditampilkan di halaman pelajaran Java saat JDK tidak terdeteksi di komputer/dev server ini. */
export default function BelumPasangJdk({ jdk, bacaTo }) {
  return (
    <main className="halaman sempit">
      <h1>☕ Fitur ini butuh JDK di komputermu</h1>
      <p>
        Course Java — PBO menjalankan kode Java <b>sungguhan</b> (bukan simulasi) lewat <code>javac</code> dan{' '}
        <code>java</code> di komputer ini. {jdk?.jangkauan === false ? 'Server dev lokal (`npm run dev`) tidak bisa dihubungi dari sini.' : 'JDK tidak terdeteksi di PATH komputer ini.'}
      </p>
      <div className="kotak-petunjuk">
        <p>
          <b>Cara memasang:</b>
        </p>
        <ol>
          <li>
            Pasang <b>Java Development Kit 21</b> (LTS) atau lebih baru — misalnya{' '}
            <a href="https://adoptium.net/" target="_blank" rel="noreferrer">
              Eclipse Temurin
            </a>{' '}
            atau{' '}
            <a href="https://learn.microsoft.com/java/openjdk/download" target="_blank" rel="noreferrer">
              Microsoft Build of OpenJDK
            </a>
            .
          </li>
          <li>
            Pastikan JDK (bukan hanya JRE) masuk ke <code>PATH</code>. Cek dengan membuka terminal baru dan menjalankan:
            <pre className="log log-log">javac -version{'\n'}java -version</pre>
            Keduanya harus mencetak nomor versi. Kalau hanya <code>java -version</code> yang berhasil, yang terpasang adalah JRE, bukan JDK.
          </li>
          <li>
            Hentikan <code>npm run dev</code> (Ctrl+C di terminal) lalu jalankan lagi, supaya server dev membaca <code>PATH</code> yang baru.
          </li>
        </ol>
        <p className="teks-redup">Course JavaScript &amp; React tetap bisa dipakai tanpa JDK — hanya course Java yang butuh ini.</p>
      </div>
      <div className="baris-tombol">
        {bacaTo && (
          <Link className="tombol tombol-lanjut" to={bacaTo}>
            📖 Baca materinya tanpa JDK →
          </Link>
        )}
        <Link className="tombol tombol-kedua" to="/">
          ← Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
