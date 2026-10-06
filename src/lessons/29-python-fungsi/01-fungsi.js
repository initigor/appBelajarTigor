export default {
  id: 'py-fungsi',
  judul: 'Fungsi: def, return, dan Docstring',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Fungsi: def, return, dan Docstring 🧩

**Fungsi** adalah blok kode bernama yang bisa dipakai berulang. Ia adalah alat utama **dekomposisi** dan **abstraksi** (lihat bab konsep): pecah program besar menjadi bagian kecil yang masing-masing punya satu tugas.

## Mendefinisikan dan memanggil

~~~python
def sapa():
    print("Halo!")
    print("Selamat belajar Python.")

sapa()
sapa()
~~~

Anatomi: kata kunci \`def\`, **nama fungsi**, kurung \`( )\` untuk parameter, titik dua, lalu **badan** yang menjorok. Mendefinisikan fungsi **belum menjalankannya**; fungsi baru jalan saat **dipanggil**.

## Parameter dan argumen

**Parameter** adalah nama di definisi, **argumen** adalah nilai yang dikirim saat memanggil.

~~~python
def sapa(nama):
    print(f"Halo, {nama}!")

sapa("Budi")
sapa("Ani")
~~~

~~~python
def luas_persegi_panjang(panjang, lebar):
    print("Luas:", panjang * lebar)

luas_persegi_panjang(5, 3)
~~~

## return: mengembalikan hasil

\`print\` hanya **menampilkan**; \`return\` **menghasilkan nilai** yang bisa disimpan atau dipakai lagi. Perbedaan ini penting!

~~~python
def kuadrat(x):
    return x * x

hasil = kuadrat(7)
print(hasil)
print(kuadrat(3) + kuadrat(4))      # hasil bisa dipakai dalam ekspresi
~~~

~~~python
def kuadrat_cetak(x):
    print(x * x)        # tidak return: hasilnya None

nilai = kuadrat_cetak(5)
print("nilai =", nilai)
~~~

Fungsi **berhenti begitu \`return\` dieksekusi**; kode setelahnya tak dijalankan. Fungsi tanpa \`return\` mengembalikan \`None\`.

~~~python
def kategori(umur):
    if umur < 13:
        return "anak"
    if umur < 18:
        return "remaja"
    return "dewasa"

print(kategori(10), kategori(15), kategori(30))
~~~

### Mengembalikan beberapa nilai

Sebenarnya mengembalikan **tuple** yang bisa di-unpack:

~~~python
def statistik(angka):
    return min(angka), max(angka), sum(angka) / len(angka)

terkecil, terbesar, rata = statistik([70, 85, 90, 65])
print(terkecil, terbesar, rata)
~~~

## Docstring: dokumentasi fungsi

String di baris pertama badan fungsi menjelaskan tugasnya. Bisa dibaca dengan \`help()\` atau \`__doc__\`.

~~~python
def luas_lingkaran(r):
    """Menghitung luas lingkaran dengan jari-jari r."""
    return 3.14159 * r ** 2

print(luas_lingkaran(10))
print(luas_lingkaran.__doc__)
help(luas_lingkaran)
~~~

## Type hint (opsional)

Anotasi tipe membantu pembaca dan alat bantu, tetapi **tidak dipaksa** saat runtime:

~~~python
def gabung(nama: str, umur: int) -> str:
    return f"{nama} ({umur} tahun)"

print(gabung("Budi", 20))
~~~

## Fungsi memanggil fungsi

Fungsi kecil yang disusun menjadi fungsi lebih besar adalah inti desain yang baik:

~~~python
def hitung_pajak(harga, persen=11):
    return harga * persen / 100

def harga_akhir(harga):
    return harga + hitung_pajak(harga)

print(harga_akhir(100_000))
~~~

## Fungsi sebagai objek

Di Python fungsi adalah **objek biasa**: bisa disimpan di variabel, dimasukkan list, dan dikirim ke fungsi lain.

~~~python
def kali_dua(x):
    return x * 2

def terapkan(fungsi, nilai):
    return fungsi(nilai)

print(terapkan(kali_dua, 21))
print(terapkan(str.upper, "halo"))

operasi = {"kuadrat": lambda x: x * x, "kali_dua": kali_dua}
for nama, f in operasi.items():
    print(nama, f(5))
~~~

## Contoh: validator dan kalkulator

~~~python
def bilangan_prima(n):
    """Mengembalikan True bila n bilangan prima."""
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def prima_hingga(batas):
    return [n for n in range(2, batas + 1) if bilangan_prima(n)]

print(prima_hingga(30))
~~~

## Prinsip fungsi yang baik

1. **Satu tugas**: nama berupa kata kerja yang jelas (\`hitung_total\`, \`cek_prima\`).
2. **Pendek**: idealnya muat di satu layar.
3. **Hindari efek samping** bila memungkinkan: hasilkan nilai dengan \`return\`, jangan mengubah data global.
4. **Dokumentasikan** dengan docstring.
5. **Mudah diuji**: masukan tertentu selalu menghasilkan keluaran tertentu.

## Kesalahan umum

- Lupa memanggil fungsi: \`sapa\` (objek fungsinya) beda dari \`sapa()\` (menjalankannya).
- Memakai \`print\` padahal butuh \`return\`.
- Menaruh \`return\` di dalam loop sehingga fungsi berhenti di iterasi pertama.

~~~python
def jumlah_salah(angka):
    total = 0
    for a in angka:
        total += a
        return total      # BUG: return di dalam loop

print(jumlah_salah([1, 2, 3]))
~~~

## Latihan mandiri

1. Tulis fungsi \`celsius_ke_fahrenheit(c)\`.
2. Tulis fungsi yang mengembalikan huruf terbanyak dalam sebuah teks.
3. Tulis fungsi \`faktorial(n)\` dengan loop, lalu versi rekursifnya.

## Rangkuman

- \`def nama(parameter):\` mendefinisikan fungsi; memanggilnya dengan \`nama(argumen)\`.
- \`return\` menghasilkan nilai dan menghentikan fungsi; tanpa \`return\` hasilnya \`None\`; beberapa nilai dikembalikan sebagai tuple.
- **Docstring** menjelaskan fungsi; **type hint** bersifat opsional.
- Fungsi adalah objek: bisa disimpan, dikirim, dan dikembalikan.
- Fungsi yang baik: satu tugas, pendek, bebas efek samping, terdokumentasi.
`,
};
