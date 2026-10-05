export default {
  id: 'arsikom-cache-mapping',
  judul: 'Cache: Pemetaan Alamat (Direct, Associative, Set-Associative)',
  tipe: 'teks',
  xp: 30,
  materi: `
# Cache: Pemetaan Alamat 🗃️

**Cache** adalah memori kecil dan cepat (SRAM) di antara CPU dan RAM yang menyimpan **salinan** blok-blok memori yang sedang dipakai. Pertanyaan inti cache: **ketika CPU meminta alamat A, bagaimana cache mengetahui apakah A ada di dalamnya, dan di mana?** Jawabannya adalah **fungsi pemetaan** (*mapping*).

## Anatomi cache

Cache terdiri dari **baris (line)** atau **blok**, tiap baris menyimpan:

~~~
 +-------+-------+------+--------------------------+
 | valid | dirty | tag  |  data (satu blok, mis. 64 B) |
 +-------+-------+------+--------------------------+
~~~

- **Data**: salinan satu blok memori (ukuran blok biasanya 64 byte).
- **Tag**: bagian alamat yang mengidentifikasi **blok memori mana** yang tersimpan di baris itu (sebab banyak blok memori dipetakan ke tempat yang sama).
- **Valid bit**: apakah baris berisi data sah (saat start semua belum valid).
- **Dirty bit**: apakah isi telah diubah dan belum ditulis ke memori (dibahas di pelajaran berikutnya).

## Pembagian alamat

Alamat dipecah menjadi tiga bagian:

~~~
 | ──────── Tag ──────── | ── Index ── | ─ Offset ─ |
~~~

- **Offset**: posisi byte di dalam blok. Untuk blok B byte: **log₂ B bit**.
- **Index**: memilih **baris** (atau **set**) di cache.
- **Tag**: sisa bit teratas; dibandingkan dengan tag tersimpan untuk memastikan baris benar-benar blok yang diminta.

Lookup: pakai **index** untuk menemukan baris → **bandingkan tag** → jika sama dan valid bit = 1 → **hit**, ambil byte dari **offset**. Selain itu: **miss**.

## Tiga cara pemetaan

### 1. Direct-mapped (pemetaan langsung)

Setiap blok memori **hanya boleh** berada di **satu** baris cache tertentu:

~~~
baris cache = (nomor blok memori) mod (jumlah baris cache)
~~~

~~~
Blok memori:  0  1  2  3  4  5  6  7  8 ...
Cache 4 baris: 0  1  2  3  0  1  2  3  0 ...   ← dipetakan berulang
~~~

- **Kelebihan**: paling sederhana, paling cepat, murah (hanya satu perbandingan tag).
- **Kekurangan**: dua blok yang dipetakan ke baris yang sama **saling menimpa terus-menerus** walau cache masih kosong di tempat lain. Ini **conflict miss**.

### 2. Fully associative (asosiatif penuh)

Blok memori boleh ditaruh di **baris mana saja**. Tidak ada index; **seluruh tag dibandingkan** (paralel) pada setiap akses.

- **Kelebihan**: tidak ada conflict miss; fleksibel.
- **Kekurangan**: perbandingan tag di **semua** baris sekaligus → mahal, lambat, boros daya. Hanya praktis untuk cache sangat kecil (mis. TLB).

### 3. Set-associative (asosiatif set) ← kompromi yang dipakai

Cache dibagi menjadi **set**, setiap set berisi **N baris (N-way)**. Blok memori dipetakan ke **satu set tertentu** (lewat index), tetapi boleh menempati **salah satu dari N baris** di set itu.

~~~
set = (nomor blok) mod (jumlah set)
~~~

~~~
         Way 0     Way 1    Way 2    Way 3
Set 0:   [ ... ]   [ ... ]  [ ... ]  [ ... ]
Set 1:   [ ... ]   [ ... ]  [ ... ]  [ ... ]
...
~~~

N tag dalam set dibandingkan paralel. Ini kompromi antara keduanya: N = 1 menjadi direct-mapped, N = jumlah seluruh baris menjadi fully associative. L1 cache umumnya 4–8-way, L2 dan L3 8–16-way.

## Menghitung pembagian alamat

Rumus-rumusnya (alamat berukuran A bit, ukuran cache C byte, ukuran blok B byte, asosiativitas N):

~~~
Jumlah baris  = C / B
Jumlah set    = C / (B × N)
Bit offset    = log₂ B
Bit index     = log₂ (jumlah set)
Bit tag       = A − bit index − bit offset
~~~

### Contoh 1: direct-mapped

Alamat 32 bit, cache 32 KiB, blok 64 B, direct-mapped (N = 1).

~~~
Jumlah baris = 32768 / 64 = 512 → set = 512
Offset = log₂ 64 = 6 bit
Index  = log₂ 512 = 9 bit
Tag    = 32 − 9 − 6 = 17 bit
~~~

### Contoh 2: 4-way set associative

Cache dan blok yang sama, tetapi 4-way.

~~~
Jumlah set = 32768 / (64 × 4) = 128
Offset = 6 bit
Index  = log₂ 128 = 7 bit
Tag    = 32 − 7 − 6 = 19 bit
~~~

Tag **bertambah** (19 vs 17) karena index berkurang: makin tinggi asosiativitas, makin banyak bit tag per baris.

### Contoh 3: fully associative

Tidak ada index: Tag = 32 − 6 = **26 bit**.

### Contoh 4: menentukan lokasi alamat

Alamat \`0x1234ABCD\`, memakai Contoh 2 (offset 6 bit, index 7 bit, tag 19 bit).

~~~
0x1234ABCD = 0001 0010 0011 0100 1010 1011 1100 1101
             └────── tag (19) ───────┘└ index(7)┘└offset(6)┘
~~~

Cara praktisnya, tanpa memotong bit satu per satu:

- **Offset** = alamat mod 64: 0xCD = 205, dan 205 mod 64 = **13**.
- **Nomor blok** = alamat >> 6 = 0x48D2AF.
- **Index** = nomor blok mod 128 = 0x48D2AF mod 0x80 = 0x2F = **47**.
- **Tag** = nomor blok >> 7 = 0x91A5.

Jadi alamat itu berada di **set 47**, byte ke-13 dalam blok, dengan tag 0x91A5.

## Contoh penelusuran: kebanyakan miss pada direct-mapped

Cache berisi 4 blok (nomor blok memori yang diakses: 0, 8, 0, 6, 8). Anggap tiap akses adalah satu blok.

**Direct-mapped** (baris = blok mod 4):

| Akses | Baris | Hasil | Isi |
| --- | --- | --- | --- |
| 0 | 0 | miss | baris 0 = {0} |
| 8 | 0 | miss (menimpa 0) | baris 0 = {8} |
| 0 | 0 | miss (menimpa 8) | baris 0 = {0} |
| 6 | 2 | miss | baris 2 = {6} |
| 8 | 0 | miss (menimpa 0) | baris 0 = {8} |

Hasil: **5 miss** dari 5 akses. Blok 0 dan 8 bertabrakan di baris 0 padahal baris 1 dan 3 kosong.

**2-way set associative** (2 set, set = blok mod 2; ganti yang paling lama tidak dipakai, LRU):

| Akses | Set | Hasil | Isi set |
| --- | --- | --- | --- |
| 0 | 0 | miss | {0} |
| 8 | 0 | miss | {0, 8} |
| 0 | 0 | **hit** | {0, 8} (0 terbaru) |
| 6 | 0 | miss (gantikan 8, LRU) | {0, 6} |
| 8 | 0 | miss (gantikan 0, LRU) | {6, 8} |

Hasil: **4 miss**.

**Fully associative** (4 baris, LRU):

| Akses | Hasil |
| --- | --- |
| 0 | miss |
| 8 | miss |
| 0 | **hit** |
| 6 | miss |
| 8 | **hit** |

Hasil: **3 miss**. Makin tinggi asosiativitas, makin sedikit conflict miss: 5 → 4 → 3.

## Pengaruh ukuran blok

Blok yang lebih besar memanfaatkan **lokalitas spasial** lebih baik (satu miss membawa lebih banyak data berguna), tetapi:

- **Miss penalty** lebih besar (mentransfer lebih banyak byte).
- Terlalu besar → sedikit baris, sehingga lebih banyak conflict, dan data yang tidak terpakai ikut terbawa (*cache pollution*).

Ukuran optimal biasanya 32–128 byte; 64 byte paling umum.

## Rangkuman

- Cache menyimpan salinan blok memori; setiap baris punya **valid, dirty, tag, data**.
- Alamat dibagi **tag | index | offset**; offset = log₂(ukuran blok), index = log₂(jumlah set).
- **Direct-mapped** (1 baris per blok; cepat, banyak conflict), **fully associative** (di mana saja; fleksibel, mahal), **set-associative** N-way (kompromi yang dipakai nyata).
- Rumus: set = C / (B × N); tag = A − index − offset. Contoh: 32 KiB, 64 B, 4-way, 32 bit → offset 6, index 7, tag 19.
- Pada urutan akses 0, 8, 0, 6, 8: direct-mapped 5 miss, 2-way 4 miss, fully associative 3 miss.
- Ukuran blok lebih besar memanfaatkan lokalitas spasial, tetapi menaikkan miss penalty.
`,
};
