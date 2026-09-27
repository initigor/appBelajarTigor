// fetch() tiruan untuk Chapter 8, supaya latihan async bisa berjalan offline.
// Dipakai lewat field `globals` di file pelajaran:
//   globals: ({ tunda }) => ({ fetch: buatFetchPalsu(tunda) })

export const DATA = {
  mahasiswa: [
    { id: 1, nama: 'Budi', ipk: 3.4 },
    { id: 2, nama: 'Sinta', ipk: 3.8 },
    { id: 3, nama: 'Andi', ipk: 3.0 },
  ],
  cuaca: {
    Bandung: { suhu: 24, kondisi: 'Berawan' },
    Jakarta: { suhu: 32, kondisi: 'Cerah' },
    Medan: { suhu: 29, kondisi: 'Hujan ringan' },
  },
  users: [
    { id: 1, nama: 'Sinta Dewi', kota: 'Bandung' },
    { id: 2, nama: 'Budi Santoso', kota: 'Jakarta' },
  ],
  posts: [
    { id: 11, userId: 1, judul: 'Belajar JavaScript', tanggal: '2025-01-10' },
    { id: 12, userId: 1, judul: 'Mengenal React', tanggal: '2025-03-02' },
    { id: 13, userId: 2, judul: 'Tips Kuliah Online', tanggal: '2025-02-14' },
    { id: 14, userId: 1, judul: 'Portofolio Pertamaku', tanggal: '2025-04-20' },
  ],
  kutipan: { teks: 'Talk is cheap. Show me the code.', oleh: 'Linus Torvalds' },
};

function respon(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => JSON.parse(JSON.stringify(data)),
    text: async () => JSON.stringify(data),
  };
}

export function buatFetchPalsu(tunda, jeda = 200) {
  return async function fetch(url) {
    await tunda(jeda);
    const u = new URL(String(url), 'http://localhost');
    const p = u.pathname.replace(/\/$/, '');
    let m;
    if (p === '/api/error') throw new TypeError('Failed to fetch (koneksi terputus)');
    if (p === '/api/mahasiswa') return respon(200, DATA.mahasiswa);
    if ((m = p.match(/^\/api\/mahasiswa\/(\d+)$/))) {
      const mhs = DATA.mahasiswa.find((x) => x.id === Number(m[1]));
      return mhs ? respon(200, mhs) : respon(404, { pesan: 'Mahasiswa tidak ditemukan' });
    }
    if (p === '/api/cuaca') {
      const kota = u.searchParams.get('kota');
      const c = DATA.cuaca[kota];
      return c ? respon(200, { kota, ...c }) : respon(404, { pesan: `Kota ${kota} tidak ditemukan` });
    }
    if ((m = p.match(/^\/api\/users\/(\d+)$/))) {
      const user = DATA.users.find((x) => x.id === Number(m[1]));
      return user ? respon(200, user) : respon(404, { pesan: 'User tidak ditemukan' });
    }
    if (p === '/api/posts') {
      const userId = Number(u.searchParams.get('userId'));
      return respon(200, DATA.posts.filter((x) => !userId || x.userId === userId));
    }
    if (p === '/api/kutipan') return respon(200, DATA.kutipan);
    return respon(404, { pesan: `Alamat ${p} tidak ada` });
  };
}

/** Teks markdown berisi daftar endpoint, untuk ditampilkan di materi. */
export const DAFTAR_ENDPOINT = `
| Alamat | Isi |
| --- | --- |
| \`/api/mahasiswa\` | array \`{ id, nama, ipk }\` |
| \`/api/mahasiswa/1\` | satu mahasiswa (404 jika tidak ada) |
| \`/api/cuaca?kota=Bandung\` | \`{ kota, suhu, kondisi }\` (404 jika kota tidak dikenal) |
| \`/api/users/1\` | \`{ id, nama, kota }\` (404 jika tidak ada) |
| \`/api/posts?userId=1\` | array \`{ id, userId, judul, tanggal }\` |
| \`/api/kutipan\` | \`{ teks, oleh }\` |
| \`/api/error\` | selalu gagal (simulasi koneksi putus) |

Setiap request butuh waktu ±0,2 detik, seperti internet sungguhan.
`;
