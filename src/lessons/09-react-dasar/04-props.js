export default {
  id: 'react-props',
  judul: 'Props',
  tipe: 'react',
  xp: 25,
  css: `.sapaan { border: 1px solid #ddd; border-radius: 10px; padding: 8px 12px; margin: 6px 0; }
.sapaan b { color: #6d4aff; }`,
  materi: `
# Props: argumen untuk komponen

Komponen adalah fungsi, dan fungsi bisa menerima argumen. Di React, argumen komponen disebut **props** (properties), ditulis seperti atribut HTML:

~~~jsx
<Sapaan nama="Budi" umur={20} />
~~~

React mengumpulkan semua atribut itu menjadi **satu object** dan mengirimkannya sebagai parameter pertama:

~~~jsx
function Sapaan(props) {
  return <p>Halo {props.nama}, umurmu {props.umur}</p>;
}
~~~

Cara yang lebih umum adalah memakai **destructuring** (Chapter 6):

~~~jsx
function Sapaan({ nama, umur }) {
  return <p>Halo {nama}, umurmu {umur}</p>;
}
~~~

## Aturan penulisan
- String boleh pakai kutip: \`nama="Budi"\`
- Nilai lain (angka, boolean, array, object, fungsi) pakai \`{ }\`: \`umur={20}\`, \`aktif={true}\`, \`skills={["JS", "React"]}\`
- Default props memakai default destructuring: \`function Sapaan({ nama, umur = 17 })\`

## Props itu read-only
Komponen **tidak boleh mengubah** props-nya sendiri. Anggap props seperti parameter \`const\`. Data yang berubah-ubah disimpan di **state** (Chapter 10).

Dengan props, satu komponen bisa dipakai ulang untuk data yang berbeda-beda, sama seperti satu fungsi dipanggil dengan argumen berbeda.
`,
  tugas: `
1. Buat komponen \`Sapaan\` yang menerima props \`nama\` dan \`jurusan\` (default \`"Teknik Informatika"\`), lalu menampilkan:
   ~~~html
   <div class="sapaan">Halo, <b>Budi</b> dari Teknik Informatika!</div>
   ~~~
2. Di \`App\`, tampilkan **3** Sapaan:
   - Budi (jurusan default)
   - Sinta, jurusan \`Sistem Informasi\`
   - Andi, jurusan \`Desain Komunikasi Visual\`
`,
  kodeAwal: `function Sapaan() {
  return <div className="sapaan">Halo!</div>;
}

function App() {
  return (
    <div>
      <Sapaan />
    </div>
  );
}

export default App;
`,
  solusi: `function Sapaan({ nama, jurusan = "Teknik Informatika" }) {
  return (
    <div className="sapaan">
      Halo, <b>{nama}</b> dari {jurusan}!
    </div>
  );
}

function App() {
  return (
    <div>
      <Sapaan nama="Budi" />
      <Sapaan nama="Sinta" jurusan="Sistem Informasi" />
      <Sapaan nama="Andi" jurusan="Desain Komunikasi Visual" />
    </div>
  );
}

export default App;
`,
  petunjuk: [
    'function Sapaan({ nama, jurusan = "Teknik Informatika" }) { ... }',
    'Halo, <b>{nama}</b> dari {jurusan}!',
    '<Sapaan nama="Sinta" jurusan="Sistem Informasi" />',
  ],
  tes: [
    {
      nama: 'Ada 3 elemen .sapaan',
      cek: (ctx) => ctx.cariSemua('.sapaan').length === 3 || `Ada ${ctx.cariSemua('.sapaan').length} elemen .sapaan, seharusnya 3.`,
    },
    {
      nama: 'Isi setiap sapaan benar',
      cek(ctx) {
        const h = ['Halo, Budi dari Teknik Informatika!', 'Halo, Sinta dari Sistem Informasi!', 'Halo, Andi dari Desain Komunikasi Visual!'];
        const isi = ctx.cariSemua('.sapaan').map((e) => e.textContent.replace(/\s+/g, ' ').trim());
        for (let i = 0; i < 3; i++) {
          if (isi[i] !== h[i]) return `Sapaan ke-${i + 1}: "${isi[i] ?? '(tidak ada)'}", seharusnya "${h[i]}".`;
        }
        return true;
      },
    },
    {
      nama: 'Nama dibungkus <b> dan jurusan memakai default props',
      cek(ctx) {
        const b = ctx.cariSemua('.sapaan b').map((e) => e.textContent);
        if (b.join() !== 'Budi,Sinta,Andi') return 'Nama harus berada di dalam <b>...</b>.';
        return ctx.pakai(/jurusan\s*=\s*["']Teknik Informatika["']/) || 'Beri nilai default jurusan = "Teknik Informatika" di parameter Sapaan (jangan tulis jurusan untuk Budi di App).';
      },
    },
  ],
};
