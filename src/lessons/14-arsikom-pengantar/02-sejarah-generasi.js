export default {
  id: 'arsikom-sejarah',
  judul: 'Sejarah & Generasi Komputer',
  tipe: 'teks',
  xp: 15,
  materi: `
# Sejarah & Generasi Komputer 🕰️

Mempelajari sejarah bukan untuk menghafal tahun. Setiap generasi lahir karena **satu masalah teknis** di generasi sebelumnya, dan masalah itu masih membentuk komputer yang kamu pakai hari ini. Cara mengingat paling mudah: tanyakan *"apa yang menjadi penghambat, dan teknologi apa yang menyelesaikannya?"*

## Generasi 0 dan 1: mesin hitung dan tabung vakum (1940-an – 1950-an)

**ENIAC** (*Electronic Numerical Integrator and Computer*, 1946, Universitas Pennsylvania) umumnya disebut komputer elektronik serbaguna pertama.

| Ciri | ENIAC |
| --- | --- |
| Komponen | ±17.000 tabung vakum |
| Berat | ±30 ton |
| Daya | ±140 kW |
| Kecepatan | ±5.000 penjumlahan per detik |
| Bilangan | **Desimal**, bukan biner |
| Pemrograman | Mengubah kabel & saklar secara manual (berhari-hari) |

Masalahnya: memprogram ENIAC berarti **menyambung ulang kabel**. Program tidak tersimpan di memori. Dari sinilah lahir gagasan **stored-program** (program disimpan di memori seperti data) yang dikembangkan John von Neumann dan kawan-kawan, dan diwujudkan di mesin **IAS** (selesai 1952) serta komputer komersial pertama seperti **UNIVAC I** dan **IBM 701**.

Masalah generasi ini: tabung vakum besar, panas, boros listrik, dan sering putus.

## Generasi 2: transistor (akhir 1950-an – 1960-an)

**Transistor** (ditemukan di Bell Labs, 1947) menggantikan tabung vakum: lebih kecil, lebih dingin, lebih murah, lebih tahan lama. Di era ini muncul:

- Bahasa pemrograman tingkat tinggi awal (FORTRAN, COBOL).
- Sistem operasi batch sederhana.
- Memori inti magnetik (*magnetic core*).

Masalah baru: ribuan transistor dan komponen harus **disolder satu per satu**. Komputer jadi rumit dan mahal dirakit.

## Generasi 3: sirkuit terpadu / IC (1960-an – awal 1970-an)

**Sirkuit terpadu** (*Integrated Circuit*) menaruh banyak transistor sekaligus di satu keping silikon. Komponen tidak lagi dirakit satu-satu, melainkan **dicetak** lewat proses fotolitografi, sehingga biaya per transistor anjlok.

Tonggak penting: **IBM System/360 (1964)**. Inilah komputer pertama yang memperkenalkan konsep **keluarga**: satu arsitektur (set instruksi yang sama) dengan beberapa model berbeda harga dan kecepatan. Persis pembedaan *arsitektur vs organisasi* yang kamu pelajari di pelajaran pertama. Program tidak perlu ditulis ulang saat pelanggan membeli model yang lebih besar.

## Generasi 4: LSI, VLSI, dan mikroprosesor (1970-an – sekarang)

Kepadatan terus naik: **LSI** (*Large Scale Integration*, ribuan komponen), lalu **VLSI** (*Very Large*, ratusan ribu hingga jutaan), kemudian ULSI. Titik baliknya: seluruh CPU bisa ditaruh di **satu chip**, yaitu **mikroprosesor**.

| Chip | Tahun | Transistor | Lebar data | Catatan |
| --- | --- | --- | --- | --- |
| Intel 4004 | 1971 | ±2.300 | 4 bit | Mikroprosesor komersial pertama |
| Intel 8086 | 1978 | ±29.000 | 16 bit | Leluhur keluarga x86 |
| Intel 80386 | 1985 | ±275.000 | 32 bit | Memori virtual pada PC |
| Pentium 4 | 2000 | ±42 juta | 32 bit | Mengejar frekuensi clock tinggi |
| Prosesor modern | 2020-an | puluhan miliar | 64 bit | Banyak inti, cache besar |

Dari 4004 ke chip hari ini, jumlah transistor naik **jutaan kali lipat**. Pertumbuhan sebesar itu bukan kebetulan, ada polanya.

## Hukum Moore

Pada 1965, **Gordon Moore** (kemudian salah satu pendiri Intel) mengamati bahwa jumlah transistor pada sebuah chip berlipat ganda secara teratur. Ia merevisinya pada 1975 menjadi **berlipat dua kira-kira setiap dua tahun**.

Jika sekarang ada N transistor, maka t tahun kemudian ada kira-kira:

~~~
N(t) = N0 × 2^(t / 2)
~~~

Contoh: mulai dari 2.300 transistor (4004, 1971), setelah 50 tahun (25 kali penggandaan): 2.300 × 2^25 ≈ 2.300 × 33,5 juta ≈ 77 miliar. Cocok dengan chip kelas atas masa kini.

> Hukum Moore adalah **pengamatan empiris dan target industri**, bukan hukum alam. Pertumbuhannya melambat karena transistor sudah sekecil beberapa puluh atom.

## Masalah besar abad ini: dinding daya (*power wall*)

Selama puluhan tahun, transistor yang makin kecil membuat chip **lebih cepat sekaligus tidak lebih boros**. Pola ini disebut **Dennard scaling**. Sekitar 2005 pola itu berhenti: kebocoran arus membuat chip terlalu panas jika frekuensi clock terus dinaikkan. Daya dinamis chip kira-kira:

~~~
P ≈ α × C × V² × f
~~~

(α = aktivitas switching, C = kapasitansi, V = tegangan, f = frekuensi). Menaikkan f juga menuntut V naik, jadi daya naik jauh lebih cepat daripada kecepatan. Frekuensi mentok di kisaran 3–5 GHz sejak itu.

Solusi industri: jangan lagi memperkencang **satu** inti, tetapi pasang **banyak inti**. Itulah asal era **multicore**, dan sebab kenapa program modern harus ditulis paralel agar benar-benar memanfaatkan chip (dibahas di Bab 10).

## Ringkasan generasi

| Generasi | Teknologi kunci | Masalah yang diselesaikan | Masalah baru |
| --- | --- | --- | --- |
| 1 | Tabung vakum | Perhitungan elektronik | Besar, panas, tidak andal |
| 2 | Transistor | Ukuran, panas, keandalan | Perakitan manual |
| 3 | IC | Perakitan & biaya | Satu CPU masih banyak chip |
| 4 | LSI/VLSI, mikroprosesor | CPU satu chip | Dinding daya, multicore |

## Rangkuman

- Generasi komputer ditandai teknologi komponen: tabung vakum → transistor → IC → LSI/VLSI (mikroprosesor).
- Konsep **stored-program** menjawab masalah ENIAC yang harus dikabel ulang; **IBM System/360** memperkenalkan keluarga komputer satu arsitektur.
- **Hukum Moore**: jumlah transistor per chip berlipat dua kira-kira tiap dua tahun.
- Berakhirnya Dennard scaling (±2005) membuat frekuensi mentok dan memaksa industri beralih ke **multicore**.
`,
};
