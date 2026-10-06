export default {
  id: 'py-venv-pip',
  judul: 'Virtual Environment dan pip',
  tipe: 'teks',
  interaktif: 'python',
  xp: 25,
  materi: `
# Virtual Environment dan pip 📦

Setelah kamu menguasai bahasanya, langkah berikutnya adalah memakai **pustaka milik orang lain** dan mengelola proyek dengan rapi. Dua alat utamanya adalah **pip** (pemasang paket) dan **virtual environment** (ruang kerja terpisah per proyek).

> Perintah di pelajaran ini dijalankan di **terminal komputermu**, bukan di browser. Karena itu blok perintah di bawah hanya contoh yang ditampilkan, bukan kode yang dijalankan di halaman.

## pip: pemasang paket Python

**pip** mengunduh paket dari **PyPI** (*Python Package Index*, pusat paket Python resmi) dan memasangnya.

~~~bash
python -m pip --version               # cek pip
python -m pip install requests        # pasang paket
python -m pip install "requests==2.32.3"   # versi tertentu
python -m pip install --upgrade requests   # perbarui
python -m pip uninstall requests      # hapus
python -m pip list                    # daftar paket terpasang
python -m pip show requests           # info satu paket
~~~

Memakai \`python -m pip\` (bukan hanya \`pip\`) memastikan pip yang dipakai **cocok dengan Python yang kamu jalankan**, menghindari salah paham bila ada beberapa versi Python.

Setelah dipasang, paket langsung bisa di-\`import\`:

~~~py
import requests
respons = requests.get("https://api.github.com")
print(respons.status_code)
~~~

## Masalah: bentrok kebergantungan

Bayangkan dua proyek di komputermu:

- Proyek A memakai pustaka \`tampilan\` versi 1.x.
- Proyek B memakai \`tampilan\` versi 2.x yang tidak kompatibel.

Jika semua paket dipasang di satu tempat bersama, salah satu proyek akan rusak. Memasang paket untuk seluruh sistem juga bisa mengganggu program Python milik sistem operasi.

## Virtual environment (venv)

**Virtual environment** adalah **folder terisolasi** berisi salinan interpreter Python dan paket **khusus untuk satu proyek**. Tiap proyek punya lingkungan sendiri, tanpa saling mengganggu.

~~~bash
# 1. buat folder proyek dan masuk ke dalamnya
mkdir proyek-saya
cd proyek-saya

# 2. buat lingkungan virtual bernama .venv
python -m venv .venv

# 3. aktifkan
.venv\\Scripts\\activate          # Windows (Command Prompt/PowerShell)
source .venv/bin/activate        # Linux / macOS

# 4. (nama lingkungan muncul di prompt) pasang paket dengan bebas
python -m pip install requests

# 5. selesai bekerja
deactivate
~~~

Ketika lingkungan aktif, \`python\` dan \`pip\` merujuk ke **salinan di dalam \`.venv\`**. Paket yang dipasang hanya ada di sana.

Kamu bisa memeriksanya dari dalam Python. Di browser ini hasilnya menunjukkan lingkungan bawaan Pyodide, sedangkan di terminal dengan venv aktif \`sys.prefix\` akan menunjuk ke folder \`.venv\`:

~~~python
import sys
print(sys.prefix)
print(sys.base_prefix)
print("Sedang di virtual environment?", sys.prefix != sys.base_prefix)
~~~

## requirements.txt: mencatat kebergantungan

Supaya orang lain (atau dirimu di komputer lain) bisa membuat ulang lingkungan yang sama, simpan daftar paket dan versinya:

~~~bash
python -m pip freeze > requirements.txt     # simpan
python -m pip install -r requirements.txt   # pasang semuanya dari berkas
~~~

Contoh isi \`requirements.txt\`:

~~~
requests==2.32.3
numpy==2.1.0
pandas>=2.2,<3
~~~

| Penulisan | Arti |
| --- | --- |
| \`paket==1.2.3\` | tepat versi itu |
| \`paket>=1.2\` | minimal versi itu |
| \`paket~=1.2\` | kompatibel (1.2 sampai < 2.0) |
| \`paket>=2.2,<3\` | rentang versi |

## Struktur proyek yang rapi

~~~
proyek-saya/
├── .venv/              ← lingkungan virtual (JANGAN di-commit ke Git)
├── .gitignore          ← mencantumkan .venv/ dan __pycache__/
├── requirements.txt
├── README.md
├── main.py
└── paket_saya/
    ├── __init__.py
    └── utilitas.py
~~~

Berkas \`.gitignore\` berisi baris yang diabaikan Git:

~~~
.venv/
__pycache__/
*.pyc
~~~

## Memeriksa versi paket dari dalam Python

Setiap paket umumnya menyimpan nomor versinya, dan modul \`importlib.metadata\` bisa membacanya:

~~~py
import importlib.metadata as meta

print(meta.version("requests"))     # versi paket terpasang bernama "requests"
~~~

Cara lain yang sering dipakai: \`import numpy; print(numpy.__version__)\`.

## Alat modern

| Alat | Fungsi |
| --- | --- |
| **venv** | Bawaan Python, cukup untuk sebagian besar kebutuhan |
| **pipx** | Memasang aplikasi CLI Python dalam lingkungan terisolasi |
| **uv** | Pemasang dan pengelola proyek yang sangat cepat |
| **Poetry**, **pipenv** | Mengelola kebergantungan dan lingkungan sekaligus |
| **conda** | Populer di data science; mengelola paket non-Python juga |

Konsepnya sama: **satu lingkungan per proyek**, dan **catat kebergantungannya**.

## Mengamankan rantai pasok

- Pasang paket hanya dari sumber yang kamu percaya dan periksa nama paketnya dengan teliti (ada serangan *typosquatting*: nama mirip tetapi berbahaya).
- Kunci versi (\`==\`) pada proyek yang harus stabil.
- Perbarui berkala untuk menambal celah keamanan.

## Memasang paket di halaman ini?

Notebook dan blok kode di situs ini menjalankan Python di browser (Pyodide). Paket populer seperti \`numpy\`, \`pandas\`, \`matplotlib\` **dimuat otomatis** saat di-\`import\`. Paket murni Python lainnya bisa dipasang lewat \`micropip\` di sel notebook:

~~~py
import micropip
await micropip.install("pyfiglet")
~~~

Tidak semua paket tersedia, terutama yang bergantung pada kode C yang belum dikompilasi untuk browser.

## Latihan mandiri

1. Buat virtual environment baru di komputermu, aktifkan, lalu pasang \`requests\` dan jalankan \`pip list\`.
2. Buat \`requirements.txt\` dari lingkungan itu, hapus \`.venv\`, lalu buat ulang dari berkas tersebut.
3. Tambahkan \`.venv/\` ke \`.gitignore\`.

## Rangkuman

- **pip** memasang paket dari PyPI; gunakan \`python -m pip ...\`.
- **Virtual environment** (\`python -m venv .venv\`, lalu aktifkan) memberi tiap proyek kebergantungan yang terpisah.
- \`pip freeze > requirements.txt\` mencatat paket; \`pip install -r requirements.txt\` memasangnya lagi.
- Jangan meng-commit \`.venv/\`; cantumkan di \`.gitignore\`.
- Alat lain: pipx, uv, Poetry, conda. Waspadai paket berbahaya dengan nama yang menyerupai.
`,
};
