// Menjalankan Java sungguhan di browser lewat CheerpJ (JVM di WebAssembly) — TANPA server.
// Kompilasi memakai javac itu sendiri (com.sun.tools.javac.Main), yang berjalan DI DALAM CheerpJ,
// memakai tools.jar (dari proyek open-source leaningtech/javafiddle, OpenJDK GPL+Classpath Exception)
// yang disajikan statis di /java/tools.jar. Pola ini persis meniru javafiddle.
//
// CATATAN PENTING (temuan uji kelayakan): CheerpJ TIDAK punya API terdokumentasi untuk stdin interaktif
// (tidak ada di cheerpjRunMain, tidak ada di cheerpjInit, dan javafiddle sendiri tidak mengimplementasikannya).
// Lihat README bagian "Uji Kelayakan /lab" untuk detail & hasil pengujian nyata.

const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const CLASS_PATH = '/app/java/tools.jar:/files/';

let cheerpjSiapPromise = null;
let elemenKonsol = null;
let elemenDisplay = null;

function pastikanElemenTersembunyi() {
  if (elemenKonsol) return;
  elemenKonsol = document.createElement('pre');
  elemenKonsol.id = 'console';
  elemenDisplay = document.createElement('div');
  elemenDisplay.id = 'cheerpjDisplay';
  for (const el of [elemenKonsol, elemenDisplay]) {
    el.style.position = 'absolute';
    el.style.left = '-99999px';
    el.style.top = '0';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.overflow = 'hidden';
    document.body.appendChild(el);
  }
}

function muatSkrip(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    document.head.appendChild(s);
  });
}

async function pastikanCheerpjSiap(onStatus) {
  if (!cheerpjSiapPromise) {
    cheerpjSiapPromise = (async () => {
      pastikanElemenTersembunyi();
      onStatus?.('Memuat Java (CheerpJ)…', 10);
      await muatSkrip(CHEERPJ_LOADER);
      onStatus?.('Menyiapkan JVM…', 40);
      // eslint-disable-next-line no-undef
      await cheerpjInit({ status: 'none' });
      // eslint-disable-next-line no-undef
      cheerpjCreateDisplay(-1, -1, elemenDisplay);
      onStatus?.('Java siap.', 100);
    })();
  }
  return cheerpjSiapPromise;
}

/**
 * @param {{ berkas: {nama:string, isi:string}[], kelasUtama: string, onStatus?: (pesan:string, persen:number)=>void, onOutput: (teks:string)=>void }} opsi
 * @returns {Promise<{ kompilasiOk: boolean, kodeKeluar: number }>}
 */
export async function jalankanJavaDiBrowser({ berkas, kelasUtama, onStatus, onOutput }) {
  await pastikanCheerpjSiap(onStatus);

  // Bersihkan output lama & pasang pengamat: CheerpJ menulis stdout/stderr sebagai teks langsung ke #console.
  elemenKonsol.textContent = '';
  let sudahDibaca = 0;
  const observer = new MutationObserver(() => {
    const teks = elemenKonsol.textContent;
    if (teks.length > sudahDibaca) {
      onOutput(teks.slice(sudahDibaca));
      sudahDibaca = teks.length;
    }
  });
  observer.observe(elemenKonsol, { childList: true, subtree: true, characterData: true });

  try {
    const encoder = new TextEncoder();
    for (const b of berkas) {
      // eslint-disable-next-line no-undef
      cheerpjAddStringFile('/str/' + b.nama, encoder.encode(b.isi));
    }
    const sourcePaths = berkas.map((b) => '/str/' + b.nama);

    onStatus?.('Mengompilasi (javac, di dalam CheerpJ)…', 60);
    // eslint-disable-next-line no-undef
    const kodeKompilasi = await cheerpjRunMain('com.sun.tools.javac.Main', CLASS_PATH, ...sourcePaths, '-d', '/files/', '-Xlint');
    if (kodeKompilasi !== 0) {
      return { kompilasiOk: false, kodeKeluar: kodeKompilasi };
    }

    onStatus?.('Menjalankan…', 90);
    // eslint-disable-next-line no-undef
    const kodeEksekusi = await cheerpjRunMain(kelasUtama, CLASS_PATH);
    onStatus?.('Selesai.', 100);
    return { kompilasiOk: true, kodeKeluar: kodeEksekusi };
  } finally {
    // Beri waktu MutationObserver menangkap perubahan terakhir sebelum dilepas.
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();
  }
}
