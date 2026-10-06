export default {
  id: 'konsep-script',
  judul: 'Bahasa Script dan Pemrograman Script',
  tipe: 'teks',
  interaktif: 'python',
  xp: 20,
  materi: `
# Bahasa Script dan Pemrograman Script 📜

Kamu pasti pernah mendengar "bahasa script" atau "scripting". Istilah ini sering membingungkan, karena garis antara "script" dan "program" memang tidak tegas. Mari kita bedah artinya dan kapan ia berguna.

## Apa itu script?

**Script** adalah program (biasanya pendek) yang ditulis untuk **mengotomatiskan tugas** atau **menggerakkan program lain**. Secara tradisional ia ditulis dalam **bahasa script**: bahasa tingkat tinggi yang umumnya **diinterpretasi** dan tidak membutuhkan langkah *build*.

| Ciri umum bahasa script | Penjelasan |
| --- | --- |
| Tingkat tinggi | Sedikit kode untuk pekerjaan besar |
| Diinterpretasi (atau bytecode + VM) | Langsung dijalankan, tanpa menghasilkan berkas \`.exe\` terpisah |
| Tipe dinamis | Variabel tidak perlu dideklarasikan tipenya |
| Tersedia REPL | Bisa dicoba baris demi baris secara interaktif |
| Pustaka kaya | Pekerjaan umum (berkas, teks, jaringan) tersedia siap pakai |
| Berperan sebagai "lem" (*glue*) | Menyambungkan program dan sistem yang berbeda |

Contoh bahasa script: **Bash** dan **PowerShell** (shell), **Python**, **JavaScript**, **Perl**, **Ruby**, **PHP**, **Lua**.

> "Script" menggambarkan **peran** (otomasi, menyambungkan, menjalankan skenario), bukan jaminan teknis. Python dipakai menulis skrip pendek **dan** aplikasi besar. Perbedaan script vs program lebih tentang kebiasaan pemakaian daripada aturan.

## Untuk apa script dipakai?

1. **Otomasi tugas berulang**: mengganti nama ratusan berkas, mencadangkan folder, membersihkan data.
2. **Pemrosesan data**: membaca CSV/JSON, memfilter, merangkum, membuat laporan.
3. **Administrasi sistem dan DevOps**: menyiapkan server, menjalankan deployment, mengatur *cron job*.
4. **Menyambungkan layanan**: mengambil data dari API, mengirim notifikasi, memindahkan data antar-aplikasi.
5. **Pengembangan web**: JavaScript di browser (*client-side scripting*), PHP/Python di server.
6. **Perpanjangan aplikasi**: macro Excel (VBA), skrip game (Lua), plugin editor.
7. **Prototipe cepat** sebelum ditulis ulang dalam bahasa yang lebih cepat.

## Contoh: merapikan nama berkas

Bayangkan kamu punya banyak berkas bernama berantakan. Menggantinya satu per satu di Explorer membosankan, tetapi untuk script cukup beberapa baris. Contoh berikut bekerja pada **daftar nama** (agar aman dicoba di browser); di komputermu, daftar itu tinggal diganti dengan isi sebuah folder:

~~~python
nama_berkas = ["Laporan Akhir (1).DOCX", "foto liburan.JPG", "Catatan  Rapat.txt"]

def rapikan(nama):
    nama = nama.strip().lower()
    nama = nama.replace("(", "").replace(")", "")
    nama = "_".join(nama.split())      # ganti spasi (berapa pun) dengan garis bawah
    return nama

for lama in nama_berkas:
    print(lama, "->", rapikan(lama))
~~~

Skrip dengan logika yang sama bisa membereskan 10.000 berkas dalam sedetik. Itulah inti pemrograman script: **mengubah pekerjaan manual berulang menjadi beberapa baris kode**.

## Menjalankan script

Sebuah script hanyalah berkas teks. Cara menjalankannya:

~~~bash
python rapikan.py          # Python
node rapikan.js            # JavaScript (Node.js)
bash cadangkan.sh          # Bash
pwsh bersihkan.ps1         # PowerShell
~~~

Di Linux dan macOS, baris pertama berupa **shebang** (\`#!\`) memberi tahu sistem interpreter mana yang harus dipakai, sehingga script bisa dijalankan seperti program:

~~~bash
#!/usr/bin/env python3
print("Halo dari script!")
~~~

~~~bash
chmod +x halo.py    # beri izin eksekusi
./halo.py           # jalankan langsung
~~~

### Skrip yang bisa dipakai sebagai modul

Pola penting di Python: bagian di bawah \`if __name__ == "__main__":\` **hanya berjalan bila berkas dijalankan langsung**, tidak saat diimpor sebagai modul oleh berkas lain.

~~~python
def sapa(nama):
    return f"Halo, {nama}!"

if __name__ == "__main__":
    print(sapa("Dunia"))
~~~

## REPL: ngobrol dengan interpreter

**REPL** (*Read-Eval-Print Loop*) adalah mode interaktif: ketik satu ekspresi, interpreter **membaca (Read)**, **mengevaluasi (Eval)**, **mencetak hasilnya (Print)**, lalu **mengulang (Loop)**. Ketik \`python\` di terminal untuk masuk ke REPL. Sel-sel di halaman ini bekerja serupa: ekspresi terakhir otomatis menampilkan nilainya.

~~~python
2 + 3 * 4
~~~

REPL sangat cocok untuk mencoba hal kecil, menjelajahi pustaka, atau menguji ide sebelum ditulis ke berkas. Notebook (Jupyter, dan editor di Workspace situs ini) adalah REPL yang lebih nyaman: sel kode, hasil, dan catatan tersimpan bersama.

## Kelebihan dan kekurangan

| Kelebihan | Kekurangan |
| --- | --- |
| Cepat ditulis dan diubah (tanpa build) | Lebih lambat daripada program terkompilasi |
| Mudah dipelajari dan dibaca | Banyak galat baru ketahuan saat dijalankan |
| Portabel antar-OS | Pengguna perlu memasang interpreter |
| Pustaka sangat kaya | Kode sumber ikut dibagikan (sulit menyembunyikan) |
| Cocok untuk prototipe dan otomasi | Kurang cocok untuk komputasi yang sangat berat atau sistem tingkat rendah |

## Rangkuman

- **Script** = program (biasanya pendek) untuk mengotomatiskan tugas atau menyambungkan sistem; **bahasa script** umumnya tingkat tinggi, diinterpretasi, bertipe dinamis, dan punya REPL.
- Contoh: Bash, PowerShell, Python, JavaScript, Perl, Ruby, PHP, Lua. Pembedaan "script vs program" bersifat longgar.
- Kegunaan: otomasi, pemrosesan data, administrasi sistem, integrasi layanan, web, dan prototipe.
- Dijalankan dengan \`python skrip.py\` atau lewat **shebang** (\`#!/usr/bin/env python3\`); \`if __name__ == "__main__":\` memisahkan kode utama dari kode yang bisa diimpor.
- **REPL** dan notebook mempercepat eksperimen karena hasilnya langsung terlihat.
`,
};
