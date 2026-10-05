export default {
  id: 'arsikom-multicore',
  judul: 'Multicore, Koherensi Cache (MESI), dan Sinkronisasi',
  tipe: 'teks',
  xp: 30,
  materi: `
# Multicore, Koherensi Cache (MESI), dan Sinkronisasi 🤝

Chip **multicore** menaruh beberapa inti lengkap pada satu keping silikon. Masing-masing inti punya cache L1 (dan L2) sendiri, berbagi L3 dan memori utama. Ini memberi kinerja nyata, tetapi menimbulkan masalah baru yang tidak ada pada inti tunggal: **bagaimana semua inti melihat data yang konsisten?**

## Organisasi multicore umum

~~~
  Inti 0          Inti 1          Inti 2          Inti 3
 [L1 I/D]        [L1 I/D]        [L1 I/D]        [L1 I/D]
 [  L2  ]        [  L2  ]        [  L2  ]        [  L2  ]
     └───────────────┴───────┬───────┴───────────────┘
                       [  L3 bersama  ]
                              │
                      pengontrol memori ──► RAM
~~~

Karena semua inti mengakses satu ruang alamat (**shared memory**), mereka dapat saling bertukar data lewat variabel bersama, itulah yang dilakukan program multi-thread.

## Masalah koherensi cache

Setiap inti menyimpan **salinan** data di cache pribadinya. Jika satu inti mengubah salinannya, salinan di inti lain menjadi **basi**.

**Contoh** (variabel \`X = 0\` di memori):

| Langkah | Peristiwa | Cache inti 0 | Cache inti 1 | Memori |
| --- | --- | --- | --- | --- |
| 1 | Inti 0 membaca X | X = 0 | – | X = 0 |
| 2 | Inti 1 membaca X | X = 0 | X = 0 | X = 0 |
| 3 | Inti 0 menulis X = 5 | X = **5** | X = **0** (basi!) | X = 0 (write-back) |
| 4 | Inti 1 membaca X | – | membaca **0** | – |

Inti 1 membaca nilai 0, padahal nilai sebenarnya 5. Program multi-thread akan salah. Perlu **protokol koherensi** yang menjamin bahwa semua inti selalu melihat nilai terbaru untuk satu alamat.

Syarat koherensi:

1. Suatu inti yang membaca setelah ia sendiri menulis akan membaca nilai itu.
2. Pembacaan sebuah inti atas nilai yang ditulis inti lain akan mengembalikan nilai tersebut (cepat atau lambat).
3. Penulisan ke alamat yang sama **diurutkan secara serial**: semua inti sepakat atas urutannya.

## Snooping dan invalidasi

Cara paling umum: setiap cache **mengintip (snoop)** bus bersama (atau jaringan interkoneksi). Ketika satu cache akan menulis, ia memberi tahu cache lain untuk **membatalkan (invalidate)** salinan mereka. Ini protokol **write-invalidate**.

## Protokol MESI

Tiap baris cache memiliki salah satu dari empat **keadaan**:

| Keadaan | Arti | Memori sama? | Salinan di cache lain? |
| --- | --- | --- | --- |
| **M** – Modified | Salinan **satu-satunya** dan sudah **diubah** (dirty) | Tidak (basi) | Tidak |
| **E** – Exclusive | Salinan **satu-satunya** dan **bersih** | Ya | Tidak |
| **S** – Shared | Bersih, **mungkin ada di cache lain** | Ya | Mungkin |
| **I** – Invalid | Baris **tidak sah** | – | – |

Perilaku ringkas:

- **Read miss**: jika tak ada cache lain yang punya → muat dalam **E**. Jika ada yang punya → muat dalam **S** (yang lain juga jadi S; yang M menulis balik dulu).
- **Write ke baris S**: kirim sinyal **invalidate** ke semua cache lain → baris lokal jadi **M**.
- **Write ke baris E**: langsung jadi **M** tanpa memberi tahu siapa pun (alasan ada keadaan E!).
- **Cache lain mengintip read pada baris M**: pemilik **menulis balik** (atau memasok langsung) lalu keduanya jadi **S**.
- **Cache lain mengintip write pada baris**: salinan lokal jadi **I**.

### Penelusuran contoh yang sama dengan MESI

| Langkah | Peristiwa | Inti 0 | Inti 1 |
| --- | --- | --- | --- |
| 1 | Inti 0 membaca X (tak ada yang lain) | **E** | I |
| 2 | Inti 1 membaca X | **S** | **S** |
| 3 | Inti 0 menulis X = 5 (kirim invalidate) | **M** (5) | **I** |
| 4 | Inti 1 membaca X (miss; inti 0 memasok) | **S** (5) | **S** (5) |

Pada langkah 4 inti 1 kini membaca **5**. Koherensi terjaga.

Varian lain: **MOESI** (AMD, menambah keadaan Owned), **MESIF** (Intel, menambah Forward). Pada banyak inti, snooping bus tak lagi skalabel sehingga dipakai **directory-based coherence** (sebuah direktori mencatat siapa saja yang memiliki salinan tiap blok, sehingga pesan dikirim hanya ke yang relevan).

## False sharing: bug kinerja yang halus

Koherensi bekerja pada tingkat **baris cache (64 byte)**, bukan variabel. Jika dua thread menulis **variabel berbeda yang kebetulan berada di baris cache yang sama**, baris itu **bolak-balik (ping-pong)** antar-cache walau tidak ada data bersama sebenarnya.

~~~c
struct { long hitung_a; long hitung_b; } s;   // keduanya dalam 16 byte, satu baris cache

// Thread 1: loop jutaan kali  s.hitung_a++
// Thread 2: loop jutaan kali  s.hitung_b++
~~~

Tiap penulisan menginvalidasi baris di inti lain, memaksanya memuat ulang. Program bisa **beberapa kali lebih lambat** daripada versi satu thread. Perbaikan: beri **padding** agar tiap variabel berada di baris cache sendiri (\`alignas(64)\`, \`@Contended\` di Java), atau gunakan variabel lokal per thread dan gabungkan di akhir.

## Konsistensi memori (sekilas)

Koherensi mengatur **satu alamat**. **Konsistensi** mengatur **urutan** operasi ke **alamat berbeda** yang terlihat oleh inti lain. CPU dan kompilator boleh mengubah urutan baca/tulis demi kecepatan (out-of-order, write buffer). Akibatnya, tanpa instruksi khusus, inti 2 bisa melihat penulisan inti 1 dalam urutan berbeda dari yang ditulis program.

- x86 relatif **ketat** (TSO).
- ARM/RISC-V lebih **longgar**: perlu **memory barrier/fence** eksplisit.
- Bahasa pemrograman menyediakan model memori (\`std::atomic\` C++, \`volatile\`/\`synchronized\` Java) yang menerjemahkan ke instruksi fence yang tepat.

## Sinkronisasi dan race condition

Ketika dua thread mengubah data bersama tanpa koordinasi terjadi **race condition**:

~~~c
// counter dipakai bersama; kedua thread menjalankan counter++ seribu kali
counter++;     // sebenarnya 3 langkah: LOAD counter → ADD 1 → STORE counter
~~~

~~~
Thread A: LOAD counter (=7)
Thread B: LOAD counter (=7)
Thread A: ADD → 8, STORE 8
Thread B: ADD → 8, STORE 8       ← seharusnya 9! satu penambahan hilang
~~~

Solusi memerlukan **operasi atomik** di hardware, misalnya:

| Instruksi atomik | Prinsip |
| --- | --- |
| **Test-and-Set** | Baca nilai lama dan tulis 1 dalam satu langkah tak terpisahkan |
| **Compare-and-Swap (CAS)** | "Jika nilai sekarang = harapan, ganti dengan nilai baru", sebagai satu operasi atomik |
| **Fetch-and-Add** | Tambah dan kembalikan nilai lama secara atomik |
| **Load-Linked / Store-Conditional** | Pasangan instruksi RISC (ARM/RISC-V) untuk membangun atomik |

Dari sini dibangun **lock (mutex)**, **semaphore**, dan struktur data *lock-free*. Hardware menjamin atomik dengan **mengunci baris cache** (protokol MESI membuat inti menahan baris dalam M selama operasi).

Bahaya sinkronisasi:

- **Race condition**: hasil bergantung pada urutan penjadwalan.
- **Deadlock**: dua thread saling menunggu lock yang dipegang lawannya.
- **Lock contention**: terlalu banyak thread berebut satu lock → paralelisme hilang (Amdahl: lock memperbesar bagian serial).

Python (CPython) memakai **GIL** (*Global Interpreter Lock*) sehingga thread biasa tidak berjalan paralel untuk kode Python murni; kinerja paralel memakai proses terpisah atau perpustakaan native. Java menyediakan \`synchronized\`, \`AtomicInteger\`, dan \`java.util.concurrent\`.

## NUMA: tidak semua memori sama dekat

Server multi-prosesor (multi-socket) memakai **NUMA** (*Non-Uniform Memory Access*): tiap prosesor punya memori lokal sendiri; mengakses memori milik prosesor lain melalui interkoneksi lebih lambat (sekitar 1,5–2× latensinya). Sistem operasi dan programmer sebaiknya menaruh data dekat thread yang memakainya (*NUMA-aware*).

## Rangkuman

- **Multicore**: banyak inti satu chip, cache L1/L2 pribadi, L3 dan memori bersama.
- **Koherensi cache** memastikan semua inti melihat nilai terbaru satu alamat. Protokol **MESI** (Modified, Exclusive, Shared, Invalid) dengan **snooping + write-invalidate**; skala besar memakai **directory**.
- **False sharing**: variabel berbeda di satu baris cache menyebabkan ping-pong; atasi dengan padding.
- **Konsistensi memori** mengatur urutan antar-alamat; ARM/RISC-V butuh fence eksplisit.
- Sinkronisasi memakai instruksi atomik (**test-and-set, CAS, fetch-and-add**) untuk membangun lock; hindari race condition, deadlock, dan lock contention.
- **NUMA**: akses memori jauh lebih lambat daripada memori lokal.
`,
};
