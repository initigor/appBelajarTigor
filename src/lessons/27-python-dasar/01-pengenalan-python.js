export default {
  id: 'py-pengenalan',
  judul: 'Mengenal Python: print, Komentar, dan Indentasi',
  tipe: 'teks',
  interaktif: 'python',
  xp: 15,
  materi: `
# Mengenal Python: print, Komentar, dan Indentasi 🐍

**Python** diciptakan Guido van Rossum dan dirilis pada 1991. Namanya berasal dari grup komedi *Monty Python*, bukan dari ular. Python dirancang agar **mudah dibaca**: kodenya menyerupai bahasa Inggris sederhana dan hampir tanpa tanda baca tambahan. Itulah sebabnya ia menjadi bahasa pertama yang paling populer di dunia.

## Untuk apa Python dipakai?

| Bidang | Contoh |
| --- | --- |
| Otomasi dan skrip | Mengolah berkas, mengambil data dari web |
| Data science dan AI | pandas, NumPy, scikit-learn, PyTorch |
| Web backend | Django, Flask, FastAPI |
| Sains dan riset | Simulasi, analisis, visualisasi |
| Pendidikan | Bahasa pengantar di banyak kampus |
| Perangkat dan IoT | MicroPython, Raspberry Pi |

Python bahasa **tingkat tinggi**, **diinterpretasi** (lewat bytecode), dan bertipe **dinamis**: konsep yang sudah kamu pelajari di bab konsep pemrograman.

## Semua contoh di sini bisa dijalankan

Setiap kotak kode Python di halaman ini punya tombol **▶ Jalankan**. Kodenya benar-benar dieksekusi di browsermu. Pada penggunaan pertama Python perlu dimuat sebentar. Tekan juga **✏️ Ubah kode** untuk mengganti isinya, dan **♻️ Reset sesi** untuk menghapus semua variabel dan mulai dari nol. Semua kotak di satu halaman **berbagi satu sesi**, jadi variabel yang dibuat di kotak atas masih ada di kotak bawah.

### Halo, Dunia!

~~~python
print("Halo, Dunia!")
~~~

\`print()\` mencetak nilai ke layar dan otomatis pindah baris. Teks (**string**) ditulis di antara tanda kutip, boleh kutip dua \`"..."\` atau kutip satu \`'...'\`.

~~~python
print('Python itu menyenangkan')
print("Nama saya", "Budi")      # beberapa nilai dipisah koma, dicetak dengan spasi
print(2026)
print(3 + 4)
~~~

## Python sebagai kalkulator

Di Python (REPL, notebook, atau sel ini) **nilai ekspresi terakhir otomatis ditampilkan**, tanpa \`print\`:

~~~python
12 * 7
~~~

~~~python
(5 + 3) * 2 ** 3 / 4
~~~

## Komentar

Baris yang diawali \`#\` **diabaikan** Python. Gunakan untuk menjelaskan **mengapa** kodenya begitu, bukan sekadar mengulang apa yang sudah jelas.

~~~python
# ini komentar satu baris, tidak dijalankan
print("tampil")       # komentar di akhir baris juga boleh

# print("baris ini tidak jalan karena dikomentari")
~~~

Untuk catatan yang panjang dipakai **docstring** (teks di antara \`"""..."""\`), terutama di dalam fungsi:

~~~python
"""Ini dokumentasi
yang bisa terdiri dari beberapa baris."""
print("docstring di atas tidak mencetak apa-apa")
~~~

## Indentasi: spasi yang bermakna

Ini ciri paling khas Python. Bahasa lain (C, Java, JavaScript) memakai kurung kurawal \`{ }\` untuk membentuk blok; Python memakai **indentasi** (spasi di awal baris). Satu level biasanya **4 spasi**.

~~~python
umur = 20

if umur >= 17:
    print("Boleh membuat KTP")     # menjorok = bagian dari if
    print("Silakan datang")
print("Selesai")                    # tidak menjorok = di luar if
~~~

Indentasi yang tidak konsisten menimbulkan \`IndentationError\`:

~~~python
# galat
umur = 20
if umur >= 17:
print("Boleh")
~~~

Tanda titik dua \`:\` di akhir baris \`if\`, \`for\`, \`while\`, \`def\`, dan \`class\` mengumumkan "blok baru dimulai di baris berikutnya".

## Zen of Python

Python punya filosofi desain yang bisa dibaca dengan satu baris kode. Beberapa prinsipnya: *"Beautiful is better than ugly"*, *"Simple is better than complex"*, *"Readability counts"*.

~~~python
import this
~~~

## Menjalankan Python di komputermu

Ada tiga cara umum:

1. **REPL**: ketik \`python\` di terminal, lalu ketik kode satu per satu.
2. **Script**: simpan di berkas \`halo.py\`, jalankan \`python halo.py\`.
3. **Notebook**: Jupyter, atau **Python Notebook** di Workspace situs ini.

Cek versi yang kamu pakai (pada situs ini yang berjalan adalah Python 3.13):

~~~python
import sys
print(sys.version)
~~~

## Latihan mandiri

1. Cetak namamu dan jurusanmu dalam dua baris.
2. Hitung berapa detik dalam satu hari dengan satu ekspresi.
3. Tambahkan komentar yang menjelaskan tujuan kodemu.

## Rangkuman

- Python: bahasa tingkat tinggi, mudah dibaca, bertipe dinamis, banyak dipakai untuk skrip, data, AI, dan web.
- \`print()\` mencetak nilai; string ditulis dengan kutip; di REPL/notebook nilai ekspresi terakhir ditampilkan otomatis.
- Komentar diawali \`#\`; docstring memakai \`"""..."""\`.
- **Indentasi** (4 spasi) membentuk blok; baris pembuka blok diakhiri titik dua \`:\`.
- Python dijalankan lewat REPL, script \`.py\`, atau notebook.
`,
};
