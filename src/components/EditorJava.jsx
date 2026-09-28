import { useState } from 'react';
import Editor from './Editor.jsx';

/**
 * Editor Java multi-berkas dengan tab, dipakai untuk latihan Pekan 3 yang punya beberapa kelas.
 * `berkas`: [{ nama, isi }]. `onUbah(nama, isiBaru)` dipanggil saat berkas aktif diedit.
 */
export default function EditorJava({ berkas, onUbah, onJalankan, gelap, readOnly }) {
  const [aktif, setAktif] = useState(berkas[0]?.nama);
  const berkasAktif = berkas.find((b) => b.nama === aktif) ?? berkas[0];

  return (
    <div className="editor-java">
      {berkas.length > 1 && (
        <div className="tab-berkas" role="tablist">
          {berkas.map((b) => (
            <button
              key={b.nama}
              role="tab"
              aria-selected={b.nama === berkasAktif.nama}
              className={`tab-berkas-item ${b.nama === berkasAktif.nama ? 'aktif' : ''}`}
              onClick={() => setAktif(b.nama)}
            >
              {b.nama}
            </button>
          ))}
        </div>
      )}
      <Editor
        key={berkasAktif.nama}
        nilai={berkasAktif.isi}
        onUbah={(isiBaru) => onUbah(berkasAktif.nama, isiBaru)}
        onJalankan={onJalankan}
        gelap={gelap}
        bahasa="java"
        readOnly={readOnly}
      />
    </div>
  );
}
