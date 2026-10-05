export default {
  id: 'arsikom-cache-kebijakan',
  judul: 'Kebijakan Cache: Penggantian, Penulisan, dan Jenis Miss',
  tipe: 'teks',
  xp: 25,
  materi: `
# Kebijakan Cache: Penggantian, Penulisan, dan Jenis Miss ♻️

Setelah tahu **di mana** sebuah blok boleh ditaruh, masih ada dua keputusan penting: **blok mana yang dikeluarkan** saat cache penuh, dan **kapan data yang ditulis CPU diteruskan ke memori**. Keduanya memengaruhi kinerja dan kebenaran data.

## 1. Kebijakan penggantian (replacement policy)

Saat terjadi miss dan semua posisi yang boleh dipakai sudah terisi, satu blok harus **diusir (evict)**. Pada **direct-mapped** tidak ada pilihan (hanya satu kemungkinan). Pada **set-associative** dan **fully associative** harus dipilih:

| Kebijakan | Cara memilih korban | Catatan |
| --- | --- | --- |
| **LRU** (*Least Recently Used*) | Blok yang **paling lama tidak diakses** | Terbaik secara umum (memanfaatkan lokalitas temporal), tetapi mahal untuk asosiativitas tinggi |
| **FIFO** | Blok yang **paling lama berada** di cache | Sederhana; bisa mengusir blok yang masih sering dipakai |
| **Random** | Pilih acak | Murah dan hasilnya mengejutkan baik |
| **Pseudo-LRU** | Aproksimasi LRU dengan sedikit bit (pohon bit) | Dipakai nyata pada cache 8-way ke atas |
| **LFU** | Blok yang paling jarang dipakai | Jarang untuk cache hardware |

**Contoh LRU, set 2-way** (blok A, B, C dipetakan ke set yang sama, urutan akses A, B, A, C):

| Akses | Hasil | Isi set (urut: paling lama → terbaru) |
| --- | --- | --- |
| A | miss | A |
| B | miss | A, B |
| A | hit | B, A (A diperbarui) |
| C | miss → usir **B** (LRU) | A, C |

Dengan FIFO, korban akan **A** (masuk lebih dulu), padahal A baru saja dipakai. Itulah kelemahan FIFO.

LRU didasarkan pada lokalitas temporal: blok yang lama tidak disentuh paling kecil kemungkinannya dipakai lagi.

## 2. Kebijakan penulisan (write policy)

Ketika CPU **menulis** ke alamat yang ada di cache (write hit), data cache berubah. Bagaimana dengan memori utama, yang masih menyimpan nilai lama?

### Write-through

Setiap penulisan **langsung ditulis ke cache dan memori** sekaligus.

- **Kelebihan**: memori selalu konsisten dengan cache, sederhana. Penting bila ada perangkat lain (DMA) yang membaca memori.
- **Kekurangan**: setiap penulisan menyebabkan lalu lintas ke memori yang lambat. Untuk mengatasinya dipakai **write buffer** (antrean kecil): CPU menaruh data di buffer lalu lanjut bekerja, buffer menulis ke memori di latar belakang. Bila buffer penuh, CPU menunggu.

### Write-back

Penulisan **hanya ke cache**. Baris ditandai **dirty** (ubah). Data baru ditulis ke memori **hanya saat baris itu diusir**.

- **Kelebihan**: beberapa penulisan ke blok yang sama hanya menghasilkan **satu** tulis balik. Lalu lintas memori jauh berkurang, lebih cepat.
- **Kekurangan**: memori sementara **tidak konsisten** dengan cache (bermasalah dengan banyak inti/DMA, perlu protokol koherensi). Saat mengusir baris dirty butuh waktu ekstra.

~~~
Write-through:   CPU ──tulis──► Cache ──tulis──► Memori   (setiap kali)
Write-back:      CPU ──tulis──► Cache [dirty=1]            (memori belum berubah)
                      ...nanti saat diusir... Cache ──tulis──► Memori
~~~

**Contoh hitungan:** sebuah variabel penghitung ditulis 1.000 kali dalam loop. Write-through: 1.000 tulis ke memori. Write-back: **1** tulis ke memori (saat baris diusir).

### Pada write miss: apa yang dilakukan?

| Kebijakan | Perilaku saat penulisan **miss** | Pasangan lazim |
| --- | --- | --- |
| **Write-allocate** | Muat blok ke cache dulu, lalu tulis di cache | Write-back |
| **No-write-allocate** | Langsung tulis ke memori tanpa memuat ke cache | Write-through |

Pasangan umum: **write-back + write-allocate** (CPU modern), atau **write-through + no-write-allocate** (sederhana).

## 3. Tiga jenis miss: model "3C"

Mengetahui **penyebab** miss membantu memperbaikinya:

| Jenis | Penyebab | Cara mengurangi |
| --- | --- | --- |
| **Compulsory** (cold) | Akses **pertama kali** ke sebuah blok; pasti tak ada di cache | Blok lebih besar, *prefetching* |
| **Capacity** | Cache **terlalu kecil** untuk menampung seluruh data yang aktif | Cache lebih besar |
| **Conflict** | Terlalu banyak blok dipetakan ke **set yang sama** meski cache belum penuh | Asosiativitas lebih tinggi |

Contoh sebelumnya (0, 8, 0, 6, 8 pada direct-mapped) memperlihatkan **conflict miss**: blok 0 dan 8 saling menimpa walau baris 1 dan 3 kosong; saat dijadikan 2-way dan fully associative, miss yang hilang adalah conflict miss.

(Jenis keempat pada sistem multiprosesor: **coherence miss**, yaitu blok diinvalidasi karena inti lain menulisnya, dibahas di Bab 10.)

## 4. Prefetching

CPU atau program dapat **mengambil blok sebelum diminta**. Contoh sederhana: ketika dua blok berurutan diakses, hardware menebak blok berikutnya dan memuatnya lebih dulu (*next-line / stream prefetcher*). Efektif untuk akses berurutan, sia-sia (dan mencemari cache) untuk akses acak.

## 5. Cache instruksi dan data terpisah

L1 hampir selalu **dipisah** (I-cache dan D-cache) agar fetch instruksi dan akses data tidak bentrok (hazard struktural di pipeline). L2 dan L3 biasanya **gabungan** (unified).

## 6. Cache inklusif dan eksklusif

- **Inklusif**: isi L1 selalu juga ada di L2 (memudahkan koherensi).
- **Eksklusif**: sebuah blok hanya ada di salah satu level (menghemat ruang total).

## Rangkuman

- **Penggantian**: LRU (usir yang paling lama tak dipakai) paling baik secara umum; FIFO dan random lebih sederhana; direct-mapped tidak punya pilihan.
- **Write-through**: tulis ke cache dan memori sekaligus (konsisten, lalu lintas tinggi, pakai write buffer). **Write-back**: tulis ke cache saja dengan dirty bit, tulis ke memori saat diusir (hemat lalu lintas).
- **Write-allocate** (muat dulu saat write miss) cocok dengan write-back; **no-write-allocate** dengan write-through.
- Jenis miss **3C**: **compulsory** (pertama kali), **capacity** (cache kecil), **conflict** (set bentrok).
- Prefetching, I/D cache terpisah di L1, dan hierarki inklusif/eksklusif menyempurnakan desain cache.
`,
};
