export default {
  id: 'arsikom-tlb',
  judul: 'TLB dan Alur Lengkap Akses Memori',
  tipe: 'teks',
  xp: 25,
  materi: `
# TLB dan Alur Lengkap Akses Memori 🔎

Memori virtual punya masalah kinerja: **setiap akses memori** membutuhkan terjemahan alamat, dan terjemahan itu sendiri membaca tabel halaman **di memori**. Artinya setiap akses data berubah menjadi **dua akses** (tabel halaman + data), atau **lima** pada tabel 4 tingkat x86-64! Solusinya: **cache khusus untuk terjemahan alamat**.

## TLB: Translation Lookaside Buffer

**TLB** adalah cache kecil di dalam CPU yang menyimpan **terjemahan terbaru**: pasangan **VPN → nomor frame** (plus bit izin). Karena lokalitas, program memakai sedikit halaman secara berulang sehingga TLB kecil pun sangat efektif.

- Ukuran: 32 sampai beberapa ribu entri; sering **bertingkat** (L1 TLB kecil, L2 TLB lebih besar), dan terpisah untuk instruksi dan data.
- Sering **fully associative** atau set-associative tinggi (karena kecil, lookup paralel masih murah).
- Waktu akses: kurang dari 1 ns (sekitar satu siklus).

~~~
VA ──► [ TLB ] ──hit──► nomor frame ──► PA ──► cache ──► data
          │
         miss
          ▼
   telusuri tabel halaman (page table walk) → isi TLB → ulangi
~~~

### Alur saat TLB miss

- Pada **x86 / ARM**: **hardware** (*page table walker*) menelusuri tabel halaman di memori dan mengisi TLB.
- Pada beberapa RISC lama (MIPS): **perangkat lunak** (OS) yang mengisi TLB lewat exception.

Jika PTE ditemukan tetapi bit valid = 0 → **page fault** → OS yang menangani (pelajaran sebelumnya).

### TLB reach

**Jangkauan TLB** = jumlah entri × ukuran halaman: seberapa banyak memori yang bisa dialamati tanpa TLB miss.

~~~
64 entri × 4 KiB = 256 KiB
~~~

Program yang menyebarkan akses pada lebih banyak halaman dari itu akan sering TLB miss. Solusi: **halaman besar (huge pages)**, misalnya 2 MiB atau 1 GiB: satu entri TLB menjangkau 512 kali lebih banyak memori. Basis data dan mesin virtual memakainya untuk menghindari TLB miss.

## Waktu akses efektif dengan TLB

Misalkan TLB hit rate α, waktu TLB t_TLB, waktu akses memori t_mem, dan tabel halaman satu tingkat (1 akses memori).

~~~
EAT = α × (t_TLB + t_mem) + (1 − α) × (t_TLB + 2 × t_mem)
~~~

(Pada miss: akses TLB + membaca tabel halaman di memori + membaca data.)

**Contoh:** t_TLB = 1 ns, t_mem = 100 ns, α = 98%.

~~~
EAT = 0,98 × (1 + 100) + 0,02 × (1 + 200)
    = 0,98 × 101 + 0,02 × 201
    = 98,98 + 4,02
    = 103,0 ns
~~~

Hanya **3% lebih lambat** daripada tanpa memori virtual (100 ns). Tanpa TLB, setiap akses 200 ns. TLB menyelamatkan memori virtual.

Jika α turun menjadi 80%: EAT = 0,8×101 + 0,2×201 = 80,8 + 40,2 = **121 ns**.

## Gabungan TLB, cache, dan memori

Dalam satu akses data, ada dua mekanisme cache: **TLB** (untuk terjemahan) dan **cache data** (untuk isinya). Kombinasi yang mungkin:

| TLB | Tabel halaman | Cache | Mungkin? | Penjelasan |
| --- | --- | --- | --- | --- |
| hit | (tidak dicek) | hit | Ya | Kasus terbaik, tercepat |
| hit | (tidak dicek) | miss | Ya | Terjemahan cepat, data ambil dari RAM |
| miss | hit (valid) | hit | Ya | PTE di tabel; datanya sudah di cache |
| miss | hit | miss | Ya | Ambil PTE dari memori, lalu data dari RAM |
| miss | **miss (page fault)** | miss | Ya | Halaman di disk → OS memuat |
| hit | **miss** | — | **Tidak** | Entri TLB hanya ada bila PTE valid |
| miss | miss | hit | **Tidak** | Data tidak mungkin ada di cache jika halamannya tidak ada di memori |

Dua kombinasi terakhir mustahil: itu pertanyaan klasik di ujian. **TLB hit ⇒ halaman pasti ada di memori** (entri hanya ada bila PTE valid), dan **halaman tidak di memori ⇒ datanya tidak bisa berada di cache**.

## Cache fisik vs virtual

Cache bisa diindeks dengan alamat fisik atau virtual:

| Jenis | Indeks / tag | Catatan |
| --- | --- | --- |
| **PIPT** (physically indexed, physically tagged) | Alamat fisik | Tidak ambigu, tetapi harus menunggu terjemahan dulu |
| **VIVT** | Alamat virtual | Cepat (tanpa TLB), tetapi bermasalah: alias, saat pindah proses harus dikosongkan |
| **VIPT** | Index dari VA, tag dari PA | **Yang dipakai L1 modern**: indeks cache dan lookup TLB berjalan **paralel**, lalu tag dibandingkan dengan PA hasil TLB |

VIPT berhasil bila bit index cache seluruhnya berada di dalam **offset halaman** (tidak berubah saat terjemahan). Itulah salah satu alasan L1 cache 32–48 KiB dengan asosiativitas 8–12-way: ukuran ≤ halaman × asosiativitas.

## Konteks switch dan TLB

Karena tiap proses punya tabel halaman sendiri, saat OS berpindah proses, isi TLB bisa salah. Solusi:

- **Flush TLB**: kosongkan seluruhnya (mahal; proses baru memulai dengan miss).
- **ASID/PCID** (*Address Space ID*): tiap entri TLB diberi tanda proses pemiliknya, sehingga tidak perlu flush.

## Segmentasi (sekilas)

Selain paging, ada **segmentasi**: ruang alamat dibagi menjadi segmen berukuran **bervariasi** sesuai fungsinya (kode, data, stack), masing-masing punya basis dan batas. Intel 8086 memakainya. x86-64 modern praktis hanya memakai paging (segmentasi hampir dinonaktifkan). Beberapa sistem menggabungkan **segmentasi + paging**.

| Aspek | Paging | Segmentasi |
| --- | --- | --- |
| Ukuran unit | Tetap (4 KiB) | Variabel |
| Terlihat programmer? | Tidak | Ya (secara logis) |
| Fragmentasi | Internal (kecil) | Eksternal |
| Perlindungan/berbagi | Per halaman | Per segmen (lebih alami) |

## Rangkuman

- **TLB** = cache untuk terjemahan VPN → frame; hit membuat terjemahan hampir gratis. Miss memicu *page table walk*; PTE tidak valid memicu page fault.
- **TLB reach** = entri × ukuran halaman (64 × 4 KiB = 256 KiB); **huge pages** memperluasnya.
- **EAT** = α × (t_TLB + t_mem) + (1 − α) × (t_TLB + 2 t_mem). Contoh α = 98% → 103 ns.
- TLB hit ⇒ halaman ada di memori; halaman tidak ada di memori ⇒ data tidak mungkin ada di cache.
- L1 modern memakai **VIPT**; konteks switch memakai flush TLB atau ASID/PCID.
- Paging memakai unit tetap; segmentasi memakai unit variabel dan jarang dipakai sendirian.
`,
};
