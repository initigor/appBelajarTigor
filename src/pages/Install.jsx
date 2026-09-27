import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstall } from '../state/install.js';

// Ikon-ikon yang meniru tombol di Safari, supaya tutorial mudah dicocokkan dengan layar.
function IkonBagikan() {
  return (
    <svg className="ikon-ios" viewBox="0 0 24 24" aria-label="ikon Bagikan">
      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IkonTambah() {
  return (
    <svg className="ikon-ios" viewBox="0 0 24 24" aria-label="ikon Tambahkan ke Layar Utama">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IkonMenuTitik() {
  return <b className="ikon-teks">⋮</b>;
}

function Langkah({ nomor, children }) {
  return (
    <li className="langkah">
      <span className="langkah-nomor">{nomor}</span>
      <div>{children}</div>
    </li>
  );
}

function TutorialIos({ ipad }) {
  return (
    <section className="kartu-setelan kartu-install">
      <h2>🍎 {ipad ? 'iPad' : 'iPhone'} (Safari)</h2>
      <ol className="daftar-langkah">
        <Langkah nomor={1}>
          Buka website LatihKode di <b>Safari</b>. Di iOS 16.4 ke atas, Chrome juga bisa dipakai.
        </Langkah>
        <Langkah nomor={2}>
          Ketuk tombol <b>Bagikan</b> <IkonBagikan />{' '}
          {ipad ? 'di kanan atas, di samping kolom alamat.' : 'di bar bawah Safari. Kalau bar-nya tidak terlihat, gulir sedikit ke atas.'}
        </Langkah>
        <Langkah nomor={3}>
          Gulir daftar menu, lalu pilih <b>Tambahkan ke Layar Utama</b> <IkonTambah />. Jika bahasa perangkatmu
          Inggris, tulisannya <i>Add to Home Screen</i>.
        </Langkah>
        <Langkah nomor={4}>
          Pastikan <b>Buka sebagai Aplikasi Web</b> aktif (jika ada), lalu ketuk <b>Tambah</b> di pojok kanan atas.
        </Langkah>
        <Langkah nomor={5}>
          Ikon <span className="ikon-app-mini">{'{ }'}</span> <b>LatihKode</b> muncul di layar utama. Buka dari sana supaya
          tampil layar penuh tanpa bar Safari.
        </Langkah>
      </ol>
      <p className="teks-redup">
        iOS tidak menyediakan tombol install otomatis untuk website. Karena itu, langkah-langkah di atas harus dilakukan
        manual lewat menu Bagikan.
      </p>
    </section>
  );
}

function BagianAndroid({ bisaInstall, onInstall, pesan }) {
  return (
    <section className="kartu-setelan kartu-install">
      <h2>🤖 Android (Chrome)</h2>
      {bisaInstall ? (
        <>
          <p>Ketuk tombol ini, lalu pilih <b>Instal</b> pada dialog yang muncul.</p>
          <button className="tombol tombol-besar tombol-install" onClick={onInstall}>
            📲 Install LatihKode
          </button>
        </>
      ) : (
        <>
          <p className="teks-redup">
            Tombol install belum tersedia di browser ini. Kamu tetap bisa memasangnya lewat menu:
          </p>
          <ol className="daftar-langkah">
            <Langkah nomor={1}>
              Buka LatihKode di <b>Chrome</b> lewat alamat <b>https://</b> (misalnya link Vercel-mu).
            </Langkah>
            <Langkah nomor={2}>
              Ketuk menu <IkonMenuTitik /> di kanan atas.
            </Langkah>
            <Langkah nomor={3}>
              Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>, lalu <b>Instal</b>.
            </Langkah>
          </ol>
        </>
      )}
      {pesan && <p className="pesan">{pesan}</p>}
    </section>
  );
}

function BagianDesktop({ bisaInstall, onInstall }) {
  return (
    <section className="kartu-setelan kartu-install">
      <h2>💻 Laptop (Chrome / Edge)</h2>
      {bisaInstall ? (
        <button className="tombol tombol-install" onClick={onInstall}>
          📲 Install LatihKode
        </button>
      ) : (
        <p className="teks-redup">
          Klik ikon install <b>⊕</b> di ujung kanan kolom alamat, atau buka menu browser lalu pilih{' '}
          <b>Instal LatihKode</b> / <b>Aplikasi → Instal situs ini sebagai aplikasi</b>.
        </p>
      )}
    </section>
  );
}

export default function Install() {
  const { platform, ios, bisaInstall, sudahTerpasang, install } = useInstall();
  const [pesan, setPesan] = useState('');

  const pasang = async () => {
    const hasil = await install();
    if (hasil === 'accepted') setPesan('✅ LatihKode sedang dipasang. Cek layar utama atau laci aplikasimu.');
    else if (hasil === 'dismissed') setPesan('Instalasi dibatalkan. Kamu bisa mencoba lagi kapan saja.');
  };

  const android = <BagianAndroid key="android" bisaInstall={bisaInstall} onInstall={pasang} pesan={pesan} />;
  const iphone = <TutorialIos key="iphone" ipad={platform === 'ipad'} />;
  const desktop = <BagianDesktop key="desktop" bisaInstall={bisaInstall} onInstall={pasang} />;
  // Tampilkan panduan untuk perangkat yang sedang dipakai lebih dulu.
  const urutan = ios ? [iphone, android, desktop] : platform === 'android' ? [android, iphone, desktop] : [desktop, android, iphone];

  return (
    <main className="halaman sempit">
      <h1>📲 Pasang Aplikasi</h1>
      <p className="teks-redup">
        LatihKode bisa dipasang di layar utama HP, iPad, atau laptop seperti aplikasi biasa: terbuka layar penuh, punya
        ikon sendiri, dan <b>tetap bisa dipakai offline</b> setelah dibuka sekali.
      </p>

      {sudahTerpasang ? (
        <div className="banner-lulus banner-terpasang">✅ Kamu sedang memakai LatihKode versi aplikasi. Selamat belajar!</div>
      ) : (
        urutan
      )}

      <section className="kartu-setelan">
        <h2>ℹ️ Catatan</h2>
        <ul className="ringkasan">
          <li>Pemasangan butuh alamat <b>https://</b> (misalnya deploy di Vercel). Lewat alamat Wi-Fi seperti http://192.168.x.x, hanya iOS yang bisa menambahkan ke layar utama.</li>
          <li>
            Progress tersimpan per perangkat. Pindahkan dengan <Link to="/pengaturan">Pengaturan → Ekspor/Impor progress</Link>.
          </li>
          <li>Aplikasi memperbarui dirinya sendiri setiap kali kamu membukanya sambil online.</li>
        </ul>
      </section>
    </main>
  );
}
