export default {
  id: 'konsep-paradigma',
  judul: 'Paradigma Pemrograman',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Paradigma Pemrograman 🎭

**Paradigma** adalah *gaya berpikir* dalam menyusun program. Bahasa yang sama bisa dipakai dengan paradigma berbeda, dan bahasa modern biasanya **multi-paradigma**. Memahami paradigma membuatmu lebih mudah berpindah bahasa karena ide dasarnya terbawa.

## Peta paradigma

~~~
 Paradigma
 ├── Imperatif ("BAGAIMANA": perintah langkah demi langkah)
 │    ├── Prosedural   → program = kumpulan prosedur/fungsi          (C, Pascal)
 │    └── Berorientasi objek (OOP) → program = objek yang berinteraksi (Java, C#, Python)
 └── Deklaratif ("APA": menyatakan hasil yang diinginkan)
      ├── Fungsional   → program = komposisi fungsi murni            (Haskell, Elixir)
      └── Logika/Query → menyatakan fakta/aturan/kondisi             (SQL, Prolog)
~~~

## Satu masalah, tiga gaya

**Masalah:** dari daftar angka, jumlahkan kuadrat dari bilangan **genap** saja. Daftar: \`[1, 2, 3, 4, 5, 6]\` → \`2² + 4² + 6² = 56\`.

### 1. Imperatif / prosedural: perintah, variabel yang berubah

Ceritakan **langkah-langkahnya** dan simpan hasil sementara di variabel yang terus diubah (**state**).

~~~python
angka = [1, 2, 3, 4, 5, 6]

total = 0
for n in angka:
    if n % 2 == 0:
        total = total + n * n
print(total)
~~~

### 2. Fungsional: ekspresi dan transformasi data

Susun masalah sebagai **rangkaian transformasi** tanpa mengubah variabel: saring genap, kuadratkan, jumlahkan.

~~~python
angka = [1, 2, 3, 4, 5, 6]

hasil = sum(map(lambda n: n * n, filter(lambda n: n % 2 == 0, angka)))
print(hasil)

# versi yang lebih "Pythonic": generator expression
print(sum(n * n for n in angka if n % 2 == 0))
~~~

Ciri fungsional: **fungsi murni** (keluaran hanya bergantung pada masukan, tanpa efek samping), **data immutable**, dan **fungsi sebagai nilai** (bisa dikirim ke fungsi lain, seperti \`map\` dan \`filter\`).

### 3. Berorientasi objek (OOP): data + perilaku dalam satu objek

Bungkus data dan operasi yang terkait ke dalam **kelas**; program adalah objek-objek yang saling mengirim pesan.

~~~python
class Penghitung:
    def __init__(self, angka):
        self.angka = angka

    def jumlah_kuadrat_genap(self):
        return sum(n * n for n in self.angka if n % 2 == 0)

print(Penghitung([1, 2, 3, 4, 5, 6]).jumlah_kuadrat_genap())
~~~

Untuk soal sekecil ini OOP berlebihan, tetapi untuk sistem besar (ratusan konsep dengan data dan perilaku masing-masing) OOP membantu menata kompleksitas.

## Empat pilar OOP

| Pilar | Arti | Contoh |
| --- | --- | --- |
| **Enkapsulasi** | Data dan operasinya dibungkus; detail disembunyikan | Kelas \`Rekening\` menyembunyikan saldo di balik method |
| **Pewarisan** | Kelas baru mewarisi sifat kelas lain | \`Kucing\` mewarisi dari \`Hewan\` |
| **Polimorfisme** | Satu antarmuka, banyak perilaku | \`bersuara()\` berbeda hasilnya pada kucing dan anjing |
| **Abstraksi** | Fokus pada apa yang penting, sembunyikan sisanya | Kamu memakai \`mobil.jalan()\` tanpa tahu mesinnya |

Bab Python OOP akan membahasnya dengan kode.

## Deklaratif: katakan APA, bukan BAGAIMANA

**SQL** adalah contoh paling sehari-hari. Kamu menyatakan hasil yang diinginkan; basis data yang memilih cara terbaik mengambilnya:

~~~sql
SELECT nama, nilai FROM mahasiswa WHERE nilai >= 70 ORDER BY nilai DESC;
~~~

HTML dan CSS juga deklaratif: kamu mendeskripsikan tampilan, bukan langkah menggambarnya.

## Imperatif vs deklaratif

| | Imperatif | Deklaratif |
| --- | --- | --- |
| Fokus | **Bagaimana** mengerjakannya | **Apa** hasil yang diinginkan |
| State | Variabel yang berubah | Minim atau tanpa perubahan state |
| Kontrol alur | Eksplisit (\`for\`, \`if\`) | Diatur sistem/runtime |
| Kelebihan | Kendali penuh, dekat mesin | Ringkas, mudah diparalelkan dan diuji |

## Paradigma lain yang perlu dikenal

- **Event-driven**: program bereaksi terhadap kejadian (klik, pesan masuk); dasar JavaScript di browser dan GUI.
- **Konkuren / paralel**: banyak tugas berjalan bersamaan (thread, async/await).
- **Generik**: kode berlaku untuk banyak tipe (template C++, generics Java).

## Memilih paradigma

Bahasa modern menyediakan beberapa sekaligus, dan programmer yang baik **memakai yang paling pas** untuk tiap bagian: fungsi murni untuk transformasi data, kelas untuk model domain, perulangan imperatif untuk logika yang sederhana dan jelas.

## Rangkuman

- **Paradigma** = gaya berpikir dalam menyusun program; kebanyakan bahasa modern multi-paradigma.
- **Imperatif** (prosedural, OOP) menjelaskan *bagaimana*; **deklaratif** (fungsional, SQL) menjelaskan *apa*.
- **OOP**: enkapsulasi, pewarisan, polimorfisme, abstraksi. **Fungsional**: fungsi murni, data immutable, fungsi sebagai nilai.
- Soal yang sama dapat dipecahkan dengan semua gaya; pilih yang paling jelas untuk masalahnya.
`,
};
