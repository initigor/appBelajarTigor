export default {
  id: 'konsep-lingkungan',
  judul: 'Lingkungan Kerja Programmer: Editor, Terminal, Paket, Git',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Lingkungan Kerja Programmer: Editor, Terminal, Paket, Git 🛠️

Menguasai bahasa saja belum cukup. Programmer sehari-hari memakai seperangkat **alat**: editor, terminal, manajer paket, dan sistem kontrol versi. Pelajaran ini memperkenalkan peta alat itu supaya kamu tidak kebingungan ketika mulai bekerja dengan proyek nyata.

## Tempat menulis kode

| Alat | Ciri | Contoh |
| --- | --- | --- |
| **Editor teks** | Ringan, mengedit teks dengan penyorotan sintaks | Notepad++, Vim, Sublime Text |
| **Code editor modern** | Editor + ekstensi (autocomplete, debugger, git) | **VS Code** |
| **IDE** (*Integrated Development Environment*) | Alat lengkap terpadu untuk satu ekosistem | PyCharm, IntelliJ IDEA, Visual Studio |
| **Notebook** | Sel kode + hasil + catatan dalam satu dokumen | **Jupyter**, Google Colab, Notebook di Workspace situs ini |
| **Editor online** | Tanpa pemasangan, berjalan di browser | Replit, Colab, Workspace situs ini |

Fitur yang menolong: **syntax highlighting**, **autocomplete**, **linter** (menandai kode mencurigakan), **formatter** (merapikan gaya), dan **debugger**.

## Terminal dan shell

**Terminal** adalah jendela teks; **shell** adalah program di dalamnya yang menerima perintah (Bash, Zsh, PowerShell, Command Prompt). Banyak alat pengembang dioperasikan lewat perintah (CLI, *Command Line Interface*) karena mudah diotomatiskan dan dibagikan.

| Tujuan | Linux/macOS (Bash) | Windows (PowerShell) |
| --- | --- | --- |
| Lihat folder saat ini | \`pwd\` | \`pwd\` |
| Daftar isi folder | \`ls\` | \`ls\` / \`dir\` |
| Pindah folder | \`cd folder\` | \`cd folder\` |
| Buat folder | \`mkdir baru\` | \`mkdir baru\` |
| Tampilkan isi berkas | \`cat berkas.txt\` | \`cat berkas.txt\` |
| Jalankan Python | \`python3 skrip.py\` | \`python skrip.py\` |

### Variabel lingkungan dan PATH

Saat kamu mengetik \`python\`, shell mencari berkas bernama itu di deretan folder pada variabel **PATH**. Jika JDK, Python, atau Node "tidak dikenali", biasanya foldernya belum masuk PATH. Itu sebabnya pemasangan alat sering meminta menambahkan ke PATH, dan terminal baru perlu dibuka setelahnya.

## Pustaka, paket, dan manajer paket

Hampir tidak ada program modern yang ditulis dari nol. Kamu memakai **pustaka** (*library*): kode siap pakai yang ditulis orang lain.

| Istilah | Arti | Contoh |
| --- | --- | --- |
| **Library** | Kumpulan fungsi yang **kamu panggil** | \`math\`, NumPy, lodash |
| **Framework** | Kerangka yang **memanggil kodemu** (*inversion of control*) | Django, Flask, React, Spring |
| **API** | Antarmuka yang dibuka sebuah program/layanan untuk dipakai program lain | API cuaca, \`list.append\` |
| **Paket (package)** | Library yang dikemas dan diberi versi untuk dipasang | \`requests\` di PyPI |

**Manajer paket** memasang, memperbarui, dan mengelola kebergantungan:

| Ekosistem | Manajer | Contoh |
| --- | --- | --- |
| Python | **pip** (repositori PyPI) | \`pip install requests\` |
| JavaScript | **npm** | \`npm install react\` |
| Java | Maven / Gradle | dependensi di \`pom.xml\` |
| Sistem operasi | apt, brew, winget | \`apt install git\` |

Python selalu menyertakan **pustaka standar** (*batteries included*) yang tidak perlu dipasang. Coba beberapa:

~~~python
import math, random, datetime

print(math.sqrt(144))
print(math.pi)
print(datetime.date(2026, 10, 7).strftime("%A, %d %B %Y"))
print(random.choice(["merah", "hijau", "biru"]))   # hasil berbeda tiap dijalankan
~~~

### Lingkungan virtual (virtual environment)

Proyek A butuh pustaka versi 1, proyek B butuh versi 2. Memasang keduanya di satu tempat bertabrakan. **Virtual environment** membuat "ruang terpisah" untuk tiap proyek. (Praktiknya dibahas di bab Python dunia nyata.)

## Kontrol versi: Git

**Git** mencatat riwayat perubahan kode, memungkinkan kembali ke versi lama dan bekerja bersama tanpa saling menimpa. Konsep inti:

| Istilah | Arti |
| --- | --- |
| **Repository (repo)** | Folder proyek beserta seluruh riwayatnya |
| **Commit** | "Foto" perubahan dengan pesan penjelasan |
| **Branch** | Cabang pengembangan terpisah (mis. untuk fitur baru) |
| **Merge** | Menggabungkan cabang |
| **Remote** | Salinan repo di server (GitHub, GitLab) |
| **Pull request** | Usulan menggabungkan perubahan, ditinjau oleh rekan |

~~~bash
git init                        # mulai repo
git add skrip.py                # siapkan perubahan
git commit -m "Tambah skrip"    # rekam perubahan
git push                        # kirim ke GitHub
~~~

Kebiasaan baik: commit kecil dan sering, pesan commit yang jelas, dan jangan pernah meng-commit rahasia (password, kunci API).

## Membaca dokumentasi

Keterampilan paling diremehkan: **membaca dokumentasi resmi** dan pesan galat. Di Python, bantuan tersedia langsung dari interpreter:

~~~python
help(len)
~~~

~~~python
print(dir("teks")[-5:])      # beberapa nama method milik string
print("halo".upper.__doc__)  # dokumentasi sebuah method
~~~

## Rangkuman

- **Editor/IDE/notebook** adalah tempat menulis kode; fitur penting: highlighting, autocomplete, linter, formatter, debugger.
- **Terminal** dan **shell** menjalankan perintah (CLI); **PATH** menentukan di mana program dicari.
- **Library** (kamu memanggil), **framework** (memanggil kodemu), **API** (antarmuka), dikelola oleh **manajer paket** (pip, npm, Maven). **Virtual environment** memisahkan kebergantungan antarproyek.
- **Git** merekam riwayat kode: repo, commit, branch, merge, remote, pull request.
- Biasakan membaca dokumentasi dan pesan galat; Python punya \`help()\` dan \`dir()\`.
`,
};
