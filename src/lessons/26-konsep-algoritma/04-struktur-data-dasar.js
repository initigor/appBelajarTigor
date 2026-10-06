export default {
  id: 'konsep-struktur-data',
  judul: 'Struktur Data Dasar: Array, Stack, Queue, Hash, Tree',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Struktur Data Dasar: Array, Stack, Queue, Hash, Tree 🗃️

**Struktur data** adalah cara menyimpan dan mengatur data supaya operasi tertentu (cari, tambah, hapus, urutkan) bisa dilakukan **efisien**. Memilih struktur data yang tepat sering lebih menentukan kecepatan program daripada hal lain. Pelajaran ini memberi peta konsepnya; bab Python selanjutnya membahas cara pemakaiannya.

> Rumus klasik Niklaus Wirth: **Algoritma + Struktur Data = Program**.

## Array / list: berderet di memori

Elemen disimpan **berurutan** dan diakses lewat **indeks**.

~~~
indeks:   0     1     2     3     4
nilai :  [ 10 ][ 20 ][ 30 ][ 40 ][ 50 ]
~~~

Karena posisinya dihitung langsung (alamat awal + indeks × ukuran elemen), akses \`daftar[i]\` **O(1)**. Menyisipkan di tengah harus menggeser elemen berikutnya, sehingga **O(n)**. Di Python, tipe ini bernama **list** (array dinamis yang tumbuh otomatis).

## Linked list: berantai lewat penunjuk

Tiap simpul menyimpan **nilai** dan **penunjuk ke simpul berikutnya**:

~~~
[10 | •]──►[20 | •]──►[30 | •]──►[None]
~~~

Menyisipkan di tengah hanya mengubah penunjuk (**O(1)** bila posisinya sudah ketahuan), tetapi mengakses elemen ke-i harus berjalan dari awal (**O(n)**). Kebalikan dari array.

~~~python
class Simpul:
    def __init__(self, nilai):
        self.nilai = nilai
        self.berikut = None

kepala = Simpul(10)
kepala.berikut = Simpul(20)
kepala.berikut.berikut = Simpul(30)

sekarang = kepala
while sekarang:
    print(sekarang.nilai)
    sekarang = sekarang.berikut
~~~

## Stack: terakhir masuk, pertama keluar (LIFO)

Seperti tumpukan piring: hanya bisa menaruh dan mengambil dari **atas**. Operasi: **push** (taruh), **pop** (ambil).

Pemakaian: tombol *Undo*, tanda kurung seimbang, pemanggilan fungsi (**call stack**), tombol Back di browser.

~~~python
tumpukan = []
tumpukan.append("halaman A")    # push
tumpukan.append("halaman B")
tumpukan.append("halaman C")

print(tumpukan.pop())           # pop: C (yang terakhir masuk)
print(tumpukan.pop())           # B
print(tumpukan)
~~~

Contoh klasik: memeriksa apakah tanda kurung seimbang.

~~~python
def seimbang(teks):
    pasangan = {")": "(", "]": "[", "}": "{"}
    tumpukan = []
    for ch in teks:
        if ch in "([{":
            tumpukan.append(ch)
        elif ch in ")]}":
            if not tumpukan or tumpukan.pop() != pasangan[ch]:
                return False
    return not tumpukan

print(seimbang("{[()]}"))
print(seimbang("{[(])}"))
~~~

## Queue: pertama masuk, pertama keluar (FIFO)

Seperti antrean di kasir: masuk dari **belakang**, keluar dari **depan**. Pemakaian: antrean cetak, antrean tugas, penjadwalan proses, pencarian melebar (BFS).

Untuk queue di Python gunakan \`collections.deque\` (menghapus dari depan list biasa itu O(n), sedangkan deque O(1)):

~~~python
from collections import deque

antrean = deque()
antrean.append("Andi")       # enqueue
antrean.append("Budi")
antrean.append("Cici")

print(antrean.popleft())     # dequeue: Andi (yang pertama masuk)
print(list(antrean))
~~~

## Hash table: pencarian secepat kilat

Menyimpan pasangan **kunci → nilai**. Sebuah **fungsi hash** mengubah kunci menjadi nomor posisi, sehingga pencarian langsung ke posisinya: rata-rata **O(1)**.

~~~
"budi" ──hash──► 7 ──► [ ... ][ ... ][ nilai Budi ][ ... ]
~~~

Dua kunci kadang menghasilkan posisi sama (**tabrakan/collision**) dan ditangani lewat teknik tertentu. Di Python: **dict** dan **set**.

~~~python
nilai = {"andi": 80, "budi": 92, "cici": 75}

print(nilai["budi"])              # akses langsung lewat kunci
nilai["dina"] = 88                # tambah
print("andi" in nilai)            # cek keberadaan: cepat
print(len(nilai))
~~~

## Tree (pohon) dan graph

**Tree** menyimpan data **hierarkis**: satu akar, tiap simpul punya anak. Contoh: struktur folder, DOM HTML, silsilah, dan **binary search tree** yang menjaga data terurut sehingga pencarian O(log n).

~~~
         8
       /   \\
      3     10
     / \\      \\
    1   6      14
~~~

**Graph** menyimpan **hubungan antar-objek**: simpul dan sisi. Contoh: peta jalan (kota dan jalan), jejaring sosial (orang dan pertemanan), internet.

~~~python
# Graph sederhana sebagai dict: simpul -> tetangganya
teman = {
    "Andi": ["Budi", "Cici"],
    "Budi": ["Andi", "Dina"],
    "Cici": ["Andi"],
    "Dina": ["Budi"],
}
print("Teman Andi:", teman["Andi"])
~~~

## Perbandingan

| Struktur | Akses | Cari | Sisip / hapus | Catatan |
| --- | --- | --- | --- | --- |
| **Array/list** | O(1) | O(n) | O(n) (tengah), O(1) di ujung | Berurutan, kompak di memori |
| **Linked list** | O(n) | O(n) | O(1) bila posisi diketahui | Fleksibel, boros penunjuk |
| **Stack** | – | – | O(1) push/pop | LIFO |
| **Queue (deque)** | – | – | O(1) enqueue/dequeue | FIFO |
| **Hash table (dict/set)** | O(1) rata-rata | O(1) rata-rata | O(1) rata-rata | Tidak berurutan (secara logis) |
| **Balanced tree** | O(log n) | O(log n) | O(log n) | Terurut, serbaguna |

## Memilih struktur data

Tanyakan: **operasi apa yang paling sering?**

- Butuh akses via indeks → list.
- Butuh pencarian cepat berdasarkan kunci → dict/set.
- Memproses berurutan terbaru dulu (undo) → stack.
- Memproses berdasarkan urutan kedatangan → queue.
- Butuh data terurut dan dinamis → tree / \`sorted\` + \`bisect\`.
- Menyimpan hubungan → graph.

Contoh dampak nyata: mengecek keberadaan di **list** (O(n)) vs **set** (O(1)) untuk 100.000 pencarian:

~~~python
import time

data_list = list(range(20_000))
data_set = set(data_list)
cari = list(range(19_000, 21_000))

mulai = time.perf_counter()
n1 = sum(1 for x in cari if x in data_list)
t_list = time.perf_counter() - mulai

mulai = time.perf_counter()
n2 = sum(1 for x in cari if x in data_set)
t_set = time.perf_counter() - mulai

print("ditemukan:", n1, n2)
print("list:", round(t_list * 1000, 1), "ms | set:", round(t_set * 1000, 2), "ms")
~~~

## Rangkuman

- **Struktur data** menentukan efisiensi operasi; pilih berdasarkan operasi yang paling sering dilakukan.
- **Array/list**: akses indeks O(1), sisip tengah O(n). **Linked list**: sisip mudah, akses O(n).
- **Stack** (LIFO: undo, call stack), **queue** (FIFO: antrean tugas; pakai \`deque\`).
- **Hash table** (dict/set): cari/sisip/hapus rata-rata O(1) lewat fungsi hash.
- **Tree** menyimpan hierarki, **graph** menyimpan hubungan; keduanya dipakai di folder, peta, dan jejaring sosial.
`,
};
