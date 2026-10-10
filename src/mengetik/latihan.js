// Kurikulum latihan mengetik untuk ngoding. Sengaja TANPA sintaks bahasa pemrograman: yang dilatih
// adalah otot jari untuk tanda baca (kurung, kutip, operator, simbol) dan bentuk nama (camelCase, snake_case).
//
// Tiap tahap: { id, judul, ikon, ringkas, fokus: [karakter yang dilatih], tip, target: WPM untuk 3★, baris: [...] }.
// Semua karakter harus bisa diketik di papan QWERTY US (diperiksa scripts/check-mengetik.js).

export const JALUR = [
  {
    id: 'dasar',
    judul: 'Dasar: Posisi Jari',
    ikon: '🖐️',
    deskripsi: 'Belum hafal letak tombol? Mulai dari sini: barisan rumah, atas, bawah, angka, lalu Shift.',
    tahap: [
      {
        id: 'dasar-rumah',
        judul: 'Barisan Rumah',
        ikon: '🏠',
        ringkas: 'Posisi awal jari: A S D F dan J K L ;',
        fokus: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        tip: 'Letakkan telunjuk di F dan J (rasakan tonjolan kecilnya), jari lain di sebelahnya. Setelah menekan tombol, kembalikan jari ke barisan rumah.',
        target: 10,
        baris: [
          'asdf jkl; asdf jkl; asdf jkl;',
          'ff jj dd kk ss ll aa ;; ff jj dd kk',
          'fjf dkd sls a;a fjf dkd sls a;a',
          'ada ada sad sad lad lad fad fad',
          'dad ask all fall salad flask',
          'a lad asks; a sad dad falls; all add',
        ],
      },
      {
        id: 'dasar-gh',
        judul: 'Telunjuk Menjangkau G & H',
        ikon: '☝️',
        ringkas: 'Telunjuk menyamping ke G (kiri) dan H (kanan)',
        fokus: ['g', 'h'],
        tip: 'G dan H diketik telunjuk yang sama dengan F dan J: geser ke samping lalu kembali ke F/J.',
        target: 12,
        baris: [
          'fgf jhj fgf jhj gg hh gg hh',
          'gag hah gaf hag gal hal',
          'has had hag gas gad sag lag',
          'hash gash dash lash flag glad',
          'shall shag half hall gall flash',
          'a glad lad has a flag; a sad hag',
        ],
      },
      {
        id: 'dasar-atas',
        judul: 'Barisan Atas',
        ikon: '⬆️',
        ringkas: 'Q W E R T  Y U I O P',
        fokus: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        tip: 'Jari bergerak lurus ke atas dari barisan rumah, bukan menyamping. Telunjuk ke R dan U (T dan Y menjangkau ke samping).',
        target: 12,
        baris: [
          'qaq wsw ede frf tgt yhy uju iki olo p;p',
          'we or it up to ow ye pi',
          'type write power your quote',
          'tree route pour query poetry',
          'pretty quiet outputs; true poet',
          'we write; you type; they try it',
        ],
      },
      {
        id: 'dasar-bawah',
        judul: 'Barisan Bawah',
        ikon: '⬇️',
        ringkas: 'Z X C V B  N M , . /',
        fokus: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        tip: 'Jari melengkung ke bawah dari barisan rumah. Koma, titik, dan garis miring diketik jari tengah, manis, dan kelingking kanan.',
        target: 12,
        baris: [
          'zaz sxs dcd fvf fbf jnj jmj k,k l.l ;/;',
          'can van man ban zoo box vex',
          'zinc mix bunch cabin number',
          'next combine vanish convex',
          'a,b,c. x/y/z. m,n. b.v.c',
          'bring many boxes, maybe nine zebras.',
        ],
      },
      {
        id: 'dasar-angka',
        judul: 'Baris Angka',
        ikon: '🔢',
        ringkas: '1 2 3 4 5  6 7 8 9 0',
        fokus: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        tip: 'Angka 1–5 tangan kiri, 6–0 tangan kanan. Setiap jari menjangkau dua baris ke atas lalu kembali ke rumah.',
        target: 12,
        baris: [
          '1q1 2w2 3e3 4r4 5t5 6y6 7u7 8i8 9o9 0p0',
          '12 34 56 78 90 12 34 56 78 90',
          '10 20 30 40 50 60 70 80 90',
          '1024 2048 4096 8192 65536',
          '3.14 2.71 1.41 9.81 0.5',
          '2024 1999 2005 1945 2000',
          '1,000 2,500 10,000 75,000',
        ],
      },
      {
        id: 'dasar-shift',
        judul: 'Shift & Huruf Besar',
        ikon: '⇧',
        ringkas: 'Shift ditekan kelingking tangan yang BERLAWANAN',
        fokus: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        tip: 'Huruf di tangan kanan = Shift kiri; huruf di tangan kiri = Shift kanan. Tahan Shift sambil menekan hurufnya, lalu lepas keduanya.',
        target: 12,
        baris: [
          'Aa Ss Dd Ff Jj Kk Ll Qq Pp',
          'Andi Budi Citra Dewi Eko Fajar',
          'Gita Hana Indra Joko Kiki Lina',
          'Mira Nanda Oki Putri Rina Sari',
          'Tono Umar Vina Wati Yuda Zahra',
          'Jakarta Bandung Medan Makassar',
          'Halo Dunia; Selamat Pagi, Indonesia',
        ],
      },
    ],
  },

  {
    id: 'tanda-baca',
    judul: 'Latihan Khusus Tanda Baca',
    ikon: '🎯',
    deskripsi: 'Satu kelompok tanda baca per tahap, supaya jari benar-benar hafal letaknya. Tidak ada sintaks, hanya latihan jari.',
    tahap: [
      {
        id: 'tb-titik-koma',
        judul: 'Titik & Koma',
        ikon: '·',
        ringkas: 'Pemisah paling sering: . dan ,',
        fokus: ['.', ','],
        tip: 'Koma (,) diketik jari tengah kanan, titik (.) jari manis kanan. Keduanya tanpa Shift.',
        target: 15,
        baris: [
          '. , . , . , . , . , . , . ,',
          'a.b.c.d.e.f.g.h',
          'a,b,c,d,e,f,g,h',
          '1.2.3.4 5,6,7,8 9.0,1.2',
          'satu, dua, tiga. empat, lima.',
          'x.y, y.z, z.x. a.b, b.c, c.a.',
          'kata.kata, kata.kata, kata.kata.',
        ],
      },
      {
        id: 'tb-titikkoma-titikdua',
        judul: 'Titik Koma & Titik Dua',
        ikon: ':',
        ringkas: 'Akhir pernyataan ; dan pemisah :',
        fokus: [';', ':'],
        tip: 'Titik koma (;) ada di barisan rumah, kelingking kanan. Titik dua (:) adalah Shift + ; dengan Shift kiri.',
        target: 15,
        baris: [
          '; : ; : ; : ; : ; : ; : ; :',
          'a;b;c;d;e;f;g',
          'a:b:c:d:e:f:g',
          'x: 1; y: 2; z: 3;',
          'nama: budi; umur: 20; kota: solo;',
          '10:30; 12:45; 18:00; 23:59;',
          'a:b; c:d; e:f; g:h; i:j; k:l;',
        ],
      },
      {
        id: 'tb-kutip',
        judul: 'Tanda Kutip',
        ikon: '❝',
        ringkas: "Kutip satu ', kutip dua \" dan backtick `",
        fokus: ["'", '"', '`'],
        tip: "Kutip satu (') di sebelah Enter dengan kelingking kanan; kutip dua (\") = Shift + '. Backtick (`) ada di kiri angka 1, kelingking kiri.",
        target: 14,
        baris: [
          "' ' ' ' ' ' ' '",
          '" " " " " " " "',
          '` ` ` ` ` ` ` `',
          "'a' 'b' 'c' 'd' 'e'",
          '"a" "b" "c" "d" "e"',
          '`a` `b` `c` `d` `e`',
          `"kata" 'kata' \`kata\``,
          `"nama", 'umur', \`kota\``,
        ],
      },
      {
        id: 'tb-kurung-bulat',
        judul: 'Kurung Bulat ( )',
        ikon: '( )',
        ringkas: 'Kurung bulat: Shift + 9 dan Shift + 0',
        fokus: ['(', ')'],
        tip: '"(" = Shift kiri + 9 (jari manis kanan). ")" = Shift kiri + 0 (kelingking kanan). Jangan lupa: Shift selalu dari tangan yang berlawanan.',
        target: 14,
        baris: [
          '( ) ( ) ( ) ( ) ( ) ( ) ( )',
          '() () () () () () () ()',
          '(a) (b) (c) (d) (e) (f)',
          '(1) (2) (3) (4) (5) (6)',
          '(kata) (kata) (kata) (kata)',
          'a(b) c(d) e(f) g(h) i(j)',
          '(a, b) (c, d) (e, f) (g, h)',
          '((a)) ((b)) ((c)) ((d))',
        ],
      },
      {
        id: 'tb-kurung-siku',
        judul: 'Kurung Siku [ ]',
        ikon: '[ ]',
        ringkas: 'Kurung siku: dua tombol di kanan P, tanpa Shift',
        fokus: ['[', ']'],
        tip: '[ dan ] diketik kelingking kanan, menjangkau dua tombol ke kanan dari P (tanpa Shift).',
        target: 14,
        baris: [
          '[ ] [ ] [ ] [ ] [ ] [ ] [ ]',
          '[] [] [] [] [] [] [] []',
          '[a] [b] [c] [d] [e] [f]',
          '[1] [2] [3] [4] [5] [6]',
          '[kata] [kata] [kata] [kata]',
          'a[b] c[d] e[f] g[h] i[j]',
          '[a, b] [c, d] [e, f] [g, h]',
          '[[a]] [[b]] [[c]] [[d]]',
        ],
      },
      {
        id: 'tb-kurung-kurawal',
        judul: 'Kurung Kurawal { }',
        ikon: '{ }',
        ringkas: 'Kurawal: Shift + [ dan Shift + ]',
        fokus: ['{', '}'],
        tip: '{ dan } adalah Shift + [ atau ]. Kelingking kanan menjangkau, Shift ditekan kelingking kiri.',
        target: 14,
        baris: [
          '{ } { } { } { } { } { } { }',
          '{} {} {} {} {} {} {} {}',
          '{a} {b} {c} {d} {e} {f}',
          '{ a } { b } { c } { d }',
          '{kata} {kata} {kata} {kata}',
          'a{b} c{d} e{f} g{h} i{j}',
          '{a, b} {c, d} {e, f} {g, h}',
          '{{a}} {{b}} {{c}} {{d}}',
        ],
      },
      {
        id: 'tb-sudut-sama',
        judul: 'Kurung Sudut & Sama Dengan',
        ikon: '< >',
        ringkas: 'Lebih-kecil <, lebih-besar >, dan =',
        fokus: ['<', '>', '='],
        tip: '< dan > adalah Shift + koma dan Shift + titik. "=" ada di ujung baris angka, kelingking kanan.',
        target: 14,
        baris: [
          '< > < > < > < > < > < >',
          '<> <> <> <> <> <> <>',
          '<a> <b> <c> <d> <e>',
          'a<b c>d e<f g>h',
          '= = = = = = = = = =',
          'a=b c=d e=f g=h',
          'a<b b>c c=d d<e e>f',
          '<kata> <kata> a=b c=d',
        ],
      },
      {
        id: 'tb-operator',
        judul: 'Operator Hitung',
        ikon: '±',
        ringkas: '+  -  *  /  %',
        fokus: ['+', '-', '*', '/', '%'],
        tip: '+ = Shift + =, * = Shift + 8, % = Shift + 5 (telunjuk kiri). - dan / tanpa Shift, kelingking kanan.',
        target: 14,
        baris: [
          '+ - + - + - + - + - + -',
          '* / * / * / * / * / * /',
          '% % % % % % % % % % % %',
          '1+2 3-4 5*6 7/8 9%2',
          '12+34 56-78 90*12 34/56 78%90',
          'a+b a-b a*b a/b a%b',
          '1 + 2 - 3 * 4 / 5 % 6',
          'x * y + z / w - v % u',
        ],
      },
      {
        id: 'tb-garis',
        judul: 'Garis Bawah & Strip',
        ikon: '_',
        ringkas: '_ untuk snake_case, - untuk kebab-case',
        fokus: ['_', '-'],
        tip: '- ada di kanan angka 0 (kelingking kanan). _ adalah Shift + - dengan Shift kiri.',
        target: 15,
        baris: [
          '_ - _ - _ - _ - _ - _ -',
          '__ -- __ -- __ -- __ --',
          'a_b a-b c_d c-d e_f e-f',
          'nama_depan nama-depan',
          'total_harga total-harga',
          '_a _b _c a_ b_ c_ a- b- c-',
          'kata_kata kata-kata kata__kata',
        ],
      },
      {
        id: 'tb-logika',
        judul: 'Simbol Logika & Bit',
        ikon: '!',
        ringkas: '!  &  |  ^  ~',
        fokus: ['!', '&', '|', '^', '~'],
        tip: '! = Shift+1 (kelingking kiri), & = Shift+7, ^ = Shift+6 (telunjuk kanan), | = Shift+\\ (kelingking kanan), ~ = Shift+` (kelingking kiri).',
        target: 13,
        baris: [
          '! & | ^ ~ ! & | ^ ~ ! & | ^ ~',
          '!!! &&& ||| ^^^ ~~~',
          '!a &b |c ^d ~e',
          'a&b a|b a^b ~a !a',
          '!! && || ^^ ~~ !! && || ^^ ~~',
          'a && b || !c & d | e ^ f',
          '~~a !!b &&c ||d',
        ],
      },
      {
        id: 'tb-khusus',
        judul: 'Simbol Khusus',
        ikon: '@',
        ringkas: '@  #  $  \\  ?',
        fokus: ['@', '#', '$', '\\', '?'],
        tip: '@ = Shift+2, # = Shift+3, $ = Shift+4 (tangan kiri). ? = Shift+/ dan \\ ada di atas Enter (kelingking kanan).',
        target: 13,
        baris: [
          '@ # $ \\ ? @ # $ \\ ? @ # $ \\ ?',
          '@@@ ### $$$ \\\\\\ ???',
          '@a #b $c ?d \\e',
          'a@b c#d e$f g?h i\\j',
          '@nama #tag $harga ?cari',
          'user@mail #1 $50 ?q=1 C:\\data',
          'a@b.c #d $e ?f \\g @h #i $j',
        ],
      },
    ],
  },

  {
    id: 'kombinasi',
    judul: 'Kombinasi Tanda Baca',
    ikon: '🧩',
    deskripsi: 'Pasangan, bersarang, operator ganda, dan campuran. Ritme berpindah antar-simbol seperti saat ngoding sungguhan.',
    tahap: [
      {
        id: 'kb-pasangan',
        judul: 'Pasangan Tanda',
        ikon: '()',
        ringkas: 'Buka dan tutup langsung berurutan',
        fokus: ['(', ')', '[', ']', '{', '}', '<', '>'],
        tip: 'Biasakan mengetik pembuka lalu penutup tanpa melihat tangan. Pada Shift, ganti-ganti tangan kiri dan kanan.',
        target: 16,
        baris: [
          '() [] {} <> () [] {} <>',
          '(){} []() {}[] <>() ()<>',
          '"" \'\' `` "" \'\' ``',
          '("a") [\'b\'] {`c`} <"d">',
          '(a) [b] {c} <d> (e) [f] {g} <h>',
          `("kata") ['kata'] {\`kata\`}`,
        ],
      },
      {
        id: 'kb-bersarang',
        judul: 'Tanda Bersarang',
        ikon: '{[(',
        ringkas: 'Kurung di dalam kurung',
        fokus: ['(', ')', '[', ']', '{', '}', '<', '>'],
        tip: 'Mulai dari yang paling luar. Tutupnya urutan terbalik: yang dibuka terakhir ditutup pertama.',
        target: 16,
        baris: [
          '([]) ([]) ([]) ([])',
          '{[]} {[]} {[]} {[]}',
          '([{}]) ([{}]) ([{}])',
          '{[()]} {[()]} {[()]}',
          '(([])) [[()]] {{[]}}',
          '<([{a}])> <([{b}])>',
          '([{<>}]) ({[<>]}) <{[()]}>',
          '(a[b{c}d]e) {f(g[h]i)j}',
        ],
      },
      {
        id: 'kb-ganda',
        judul: 'Operator Ganda',
        ikon: '==',
        ringkas: '==  !=  <=  >=  &&  ||  ++  --  +=  =>',
        fokus: ['=', '!', '<', '>', '&', '|', '+', '-'],
        tip: 'Dua simbol berurutan sering diketik berpindah tangan. Latih ritmenya, jangan buru-buru.',
        target: 16,
        baris: [
          '== != <= >= == != <= >=',
          '&& || && || && || && ||',
          '++ -- ++ -- ++ -- ++ --',
          '+= -= *= /= %= += -= *= /=',
          '=> -> => -> => -> => ->',
          'a == b; c != d; e <= f; g >= h',
          'a && b || c && d || e && f',
          'x += 1; y -= 2; z *= 3; w /= 4',
          '<< >> << >> ** // :: ::',
        ],
      },
      {
        id: 'kb-campur',
        judul: 'Campuran Tanpa Sintaks',
        ikon: '🔀',
        ringkas: 'Kata + tanda baca dalam satu baris',
        fokus: ['(', '[', '{', ',', ';', '"', '='],
        tip: 'Ini bukan bahasa pemrograman tertentu, hanya pola tanda baca yang sering muncul bersama kata.',
        target: 18,
        baris: [
          'a(b), c[d], e{f}; g<h>.',
          '(a + b) * [c - d] / {e % f}',
          '"a", \'b\', `c`, "d", \'e\', `f`',
          'a = b; c = d; e = f; g = h;',
          'one(1) two[2] six{6} ten<10>',
          'x: [1, 2, 3]; y: {a, b, c};',
          '@a #b $c %d ^e &f *g (h) _i +j',
          '!a != b; ~c == d; e <= f || g',
        ],
      },
      {
        id: 'kb-tantangan',
        judul: 'Tantangan Tanda Baca',
        ikon: '🏆',
        ringkas: 'Semua simbol sekaligus, ritme lebih cepat',
        fokus: ['(', ')', '[', ']', '{', '}', '"', "'", '`', ';', ':', '_', '='],
        tip: 'Tantangan akhir jalur tanda baca. Tenang dulu, akurasi lebih penting daripada kecepatan.',
        target: 20,
        baris: [
          '([{ "a": 1, \'b\': 2 }]);',
          '{ nama_depan: "budi", umur: [20, 21] }',
          '(a <= b) && (c != d) || !(e >= f)',
          'kata[0] = "isi"; kata[1] = \'lain\';',
          '[(a + b) * c] - {d / (e % f)}',
          '<a> | <b> & <c> ^ <d> ~ <e>',
          '`a` + `b` = `c`; "d" - \'e\' : `f`',
          'user@mail.com #tag $100 ?id=7',
          '(((a))) [[[b]]] {{{c}}} <<<d>>>',
        ],
      },
    ],
  },

  {
    id: 'kata',
    judul: 'Kata untuk Ngoding',
    ikon: '🔤',
    deskripsi: 'Bentuk nama yang sering dipakai programmer: camelCase, snake_case, kebab-case, KONSTANTA, dan angka dalam nama.',
    tahap: [
      {
        id: 'kt-camel',
        judul: 'camelCase',
        ikon: 'aB',
        ringkas: 'Huruf besar di tengah kata',
        fokus: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        tip: 'Tiap huruf besar butuh Shift dari tangan yang berlawanan. Latih berpindah tangan dengan lancar.',
        target: 20,
        baris: [
          'namaDepan namaBelakang',
          'totalHarga jumlahBarang',
          'hargaSatuan diskonPersen',
          'tanggalLahir alamatEmail',
          'nomorTelepon kataSandi',
          'userName firstName lastName',
          'getData setData isValid hasItem',
          'getAlamat setKota findCity',
          'toJson keyGen isFull',
        ],
      },
      {
        id: 'kt-snake',
        judul: 'snake_case',
        ikon: 'a_b',
        ringkas: 'Kata dihubungkan garis bawah',
        fokus: ['_'],
        tip: 'Garis bawah = Shift kiri + - . Biarkan kelingking kanan menjangkau dan kelingking kiri menekan Shift.',
        target: 20,
        baris: [
          'nama_depan nama_belakang',
          'total_harga jumlah_barang',
          'harga_satuan diskon_persen',
          'tanggal_lahir alamat_email',
          'user_name first_name last_name',
          'get_data set_data is_valid has_item',
        ],
      },
      {
        id: 'kt-kebab-konstanta',
        judul: 'kebab-case & KONSTANTA',
        ikon: 'A-B',
        ringkas: 'Strip di antara kata, dan HURUF_BESAR_SEMUA',
        fokus: ['-', '_', 'A', 'M', 'X'],
        tip: 'Untuk satu kata kapital panjang, bisa tahan Shift dan tekan banyak huruf; lepas saat berganti ke garis bawah.',
        target: 18,
        baris: [
          'nama-depan nama-belakang',
          'total-harga jumlah-barang',
          'MAX_SIZE MIN_SIZE MAX_VALUE',
          'API_KEY BASE_URL TIME_OUT',
          'DEFAULT_PORT MAX_RETRY_COUNT',
          'Nama-Depan File-Name Title-Case',
        ],
      },
      {
        id: 'kt-angka',
        judul: 'Angka dalam Nama',
        ikon: 'x1',
        ringkas: 'Huruf, angka, garis bawah, dan titik bergantian',
        fokus: ['1', '2', '3', '_', '.'],
        tip: 'Berpindah antara baris huruf dan baris angka tanpa melihat tangan. Pelan dulu sampai jari hafal jaraknya.',
        target: 18,
        baris: [
          'data1 data2 data3 data4',
          'item_10 item_20 item_30',
          'x1 y1 x2 y2 x3 y3',
          'file2 file3 file_v2 file_v3',
          'user_01 user_02 user_03',
          'test1_a test2_b test3_c',
          'v1.0 v2.5 v3.14.1 v10.0.2',
        ],
      },
    ],
  },
];

export const semuaTahap = JALUR.flatMap((j) => j.tahap.map((t) => ({ ...t, jalurId: j.id })));
export const tahapById = (id) => semuaTahap.find((t) => t.id === id) ?? null;
export const jalurDariTahap = (id) => JALUR.find((j) => j.tahap.some((t) => t.id === id)) ?? null;
export const tahapBerikutnya = (id) => {
  const i = semuaTahap.findIndex((t) => t.id === id);
  return i >= 0 ? (semuaTahap[i + 1] ?? null) : null;
};
/** Tahap yang disarankan berikutnya: yang pertama belum pernah diselesaikan. */
export const tahapDisarankan = (hasil = {}) => semuaTahap.find((t) => !hasil[t.id]) ?? null;

// ---------- Latihan bebas: pilih sendiri tanda baca yang mau difokuskan ----------

export const GRUP_SIMBOL = [
  { label: 'Pemisah', simbol: ['.', ',', ';', ':'] },
  { label: 'Kutip', simbol: ["'", '"', '`'] },
  { label: 'Kurung', simbol: ['(', ')', '[', ']', '{', '}', '<', '>'] },
  { label: 'Operator', simbol: ['+', '-', '*', '/', '%', '='] },
  { label: 'Logika & bit', simbol: ['!', '&', '|', '^', '~'] },
  { label: 'Khusus', simbol: ['_', '@', '#', '$', '\\', '?'] },
];
export const SEMUA_SIMBOL = GRUP_SIMBOL.flatMap((g) => g.simbol);

const KATA = ['data', 'nama', 'kode', 'nilai', 'list', 'item', 'total', 'kunci', 'hasil', 'baris', 'user', 'file', 'kata', 'jumlah', 'index'];
const MAKS_PANJANG = 38;

/**
 * Susun baris latihan acak dari tanda baca yang dipilih. `rng` bisa diganti agar hasilnya deterministik di tes.
 * Pola bergilir: deret simbol, pola berulang, kata dibungkus simbol, kata dipisah simbol.
 */
export function buatLatihanBebas(simbol, jumlah = 8, rng = Math.random) {
  const pilihan = [...new Set(simbol)].filter((c) => SEMUA_SIMBOL.includes(c));
  if (pilihan.length === 0) return [];
  const acak = (arr) => arr[Math.floor(rng() * arr.length)];
  const deret = (n) => Array.from({ length: n }, () => acak(pilihan)).join('');
  const potong = (s) => (s.length > MAKS_PANJANG ? s.slice(0, s.lastIndexOf(' ', MAKS_PANJANG)).trimEnd() : s);
  const baris = [];
  for (let i = 0; i < jumlah; i++) {
    let b;
    switch (i % 4) {
      case 0:
        b = Array.from({ length: 6 }, () => deret(2 + Math.floor(rng() * 3))).join(' ');
        break;
      case 1: {
        const pola = deret(2 + Math.floor(rng() * 2));
        b = Array.from({ length: 6 }, () => pola).join(' ');
        break;
      }
      case 2:
        b = Array.from({ length: 4 }, () => `${acak(pilihan)}${acak(KATA)}${acak(pilihan)}`).join(' ');
        break;
      default:
        b = Array.from({ length: 4 }, () => `${acak(KATA)}${acak(pilihan)}`).join(' ');
    }
    baris.push(potong(b).trim());
  }
  return baris;
}
