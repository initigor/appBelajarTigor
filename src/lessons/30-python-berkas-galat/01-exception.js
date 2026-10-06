export default {
  id: 'py-exception',
  judul: 'Penanganan Galat: try, except, finally, dan raise',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Penanganan Galat: try, except, finally, dan raise 🛡️

Galat saat runtime (exception) tidak selalu berarti programmu salah: pengguna bisa mengetik huruf saat diminta angka, berkas bisa hilang, koneksi bisa putus. Program yang baik **mengantisipasi** hal itu dan bereaksi dengan anggun, bukan langsung mati.

## Exception menghentikan program

~~~python
# galat
angka = int("dua puluh")
print("tidak akan sampai ke sini")
~~~

## try / except

Bungkus kode yang berisiko dalam \`try\`; tangani galatnya di \`except\`.

~~~python
try:
    angka = int("dua puluh")
    print("hasil:", angka)
except ValueError:
    print("Masukan harus berupa angka!")

print("program tetap berjalan")
~~~

Alur: kode di \`try\` dijalankan; **begitu terjadi exception, sisanya dilewati** dan lompat ke \`except\` yang cocok.

### Menangkap beberapa jenis galat

~~~python
def bagi_dari_teks(a, b):
    try:
        return int(a) / int(b)
    except ValueError:
        return "keduanya harus angka"
    except ZeroDivisionError:
        return "tidak bisa membagi dengan nol"

print(bagi_dari_teks("10", "2"))
print(bagi_dari_teks("10", "0"))
print(bagi_dari_teks("sepuluh", "2"))
~~~

Atau satu \`except\` untuk beberapa jenis, serta menangkap objek galat dengan \`as\`:

~~~python
try:
    daftar = [1, 2, 3]
    print(daftar[10])
except (IndexError, KeyError) as e:
    print("Galat:", type(e).__name__, "-", e)
~~~

## else dan finally

| Blok | Dijalankan |
| --- | --- |
| \`try\` | kode yang berisiko |
| \`except\` | **bila** terjadi exception yang cocok |
| \`else\` | **bila tidak ada** exception |
| \`finally\` | **selalu**, apa pun yang terjadi (untuk pembersihan) |

~~~python
def baca_angka(teks):
    try:
        n = int(teks)
    except ValueError:
        print("  gagal mengubah", repr(teks))
        return None
    else:
        print("  berhasil:", n)
        return n
    finally:
        print("  (selesai memeriksa)")

baca_angka("42")
baca_angka("x")
~~~

\`finally\` dipakai untuk **membersihkan sumber daya** (menutup berkas, koneksi) walau terjadi galat. Cara yang lebih rapi untuk berkas adalah \`with\` (pelajaran berikutnya).

## Meminta input sampai benar

Pola yang sangat berguna:

~~~python
jawaban = ["abc", "-5", "25"]          # simulasi tiga percobaan pengguna

while True:
    teks = jawaban.pop(0)
    try:
        umur = int(teks)
        if umur < 0:
            raise ValueError("umur tidak boleh negatif")
        break
    except ValueError as e:
        print(f"Masukan '{teks}' tidak valid ({e}). Coba lagi.")

print("Umur diterima:", umur)
~~~

Pada program sungguhan, \`teks = input("Umur: ")\` menggantikan \`jawaban.pop(0)\`.

## raise: melempar galat sendiri

Gunakan \`raise\` bila fungsimu mendapat masukan yang tidak masuk akal:

~~~python
def hitung_rata(nilai):
    if not nilai:
        raise ValueError("daftar nilai tidak boleh kosong")
    return sum(nilai) / len(nilai)

print(hitung_rata([80, 90]))

try:
    hitung_rata([])
except ValueError as e:
    print("Ditangkap:", e)
~~~

Pilih jenis exception yang **sesuai artinya**: \`ValueError\` (nilai salah), \`TypeError\` (tipe salah), \`KeyError\`, \`FileNotFoundError\`, dll.

## Exception buatan sendiri

Turunkan dari \`Exception\` agar pesan galat lebih bermakna di domainmu:

~~~python
class SaldoTidakCukup(Exception):
    def __init__(self, saldo, diminta):
        super().__init__(f"saldo {saldo} kurang dari yang diminta {diminta}")
        self.saldo = saldo
        self.diminta = diminta

def tarik(saldo, jumlah):
    if jumlah > saldo:
        raise SaldoTidakCukup(saldo, jumlah)
    return saldo - jumlah

try:
    tarik(50_000, 80_000)
except SaldoTidakCukup as e:
    print("Gagal:", e)
    print("Kurang:", e.diminta - e.saldo)
~~~

## Hirarki exception

Semua exception turun dari \`BaseException\`. \`except Exception\` menangkap hampir semuanya. Urutan \`except\` penting: tulis yang **spesifik dulu**, yang umum belakangan.

~~~python
print(ZeroDivisionError.__mro__)       # rantai pewarisan
print(issubclass(KeyError, LookupError), issubclass(IndexError, LookupError))
~~~

## Praktik yang baik

1. **Tangkap yang spesifik**, bukan semuanya. \`except:\` kosong menelan semua galat (termasuk Ctrl+C) dan menyembunyikan bug.
2. Jangan **mendiamkan** galat tanpa alasan: minimal catat (log) atau beri tahu pengguna.
3. Letakkan **sesedikit mungkin kode** di dalam \`try\`.
4. **EAFP** ("lebih mudah minta maaf daripada minta izin") adalah gaya Python: coba dulu, tangani galat bila ada, ketimbang memeriksa semua kemungkinan di muka.

~~~python
data = {"nama": "Budi"}

# LBYL (look before you leap)
if "umur" in data:
    umur = data["umur"]
else:
    umur = 0

# EAFP (Pythonic)
try:
    umur = data["umur"]
except KeyError:
    umur = 0

print(umur)
~~~

## Latihan mandiri

1. Buat fungsi \`ke_angka(teks)\` yang mengembalikan \`int\` atau \`None\` bila tidak valid.
2. Buat kalkulator yang menangani pembagian nol dan masukan bukan angka.
3. Buat exception \`UmurTidakValid\` dan fungsi yang melemparnya untuk umur negatif atau di atas 150.

## Rangkuman

- \`try\`/\`except\` menangani exception; \`else\` bila tidak ada galat; \`finally\` selalu dijalankan.
- Tangkap exception yang **spesifik** (\`except ValueError as e\`), jangan \`except:\` kosong.
- \`raise\` melempar exception; buat exception sendiri dengan mewarisi \`Exception\`.
- Gaya Python **EAFP**: coba dulu, tangani galatnya.
- Pola "ulangi sampai valid": \`while True\` + \`try\` + \`break\`.
`,
};
