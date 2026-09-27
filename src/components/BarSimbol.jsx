// Baris tombol simbol di atas editor untuk perangkat layar sentuh,
// karena simbol seperti { } ( ) ; => sulit diketik di keyboard HP/iPad.

import { undo } from '@codemirror/commands';

// [label, teks yang disisipkan, posisi kursor setelah disisipkan (default: di akhir)]
const SIMBOL = [
  ['⇥', '  '],
  ['( )', '()', 1],
  ['{ }', '{}', 1],
  ['[ ]', '[]', 1],
  [';', ';'],
  ['=', ' = '],
  ['=>', ' => '],
  ['" "', '""', 1],
  ["' '", "''", 1],
  ['` `', '``', 1],
  ['${ }', '${}', 2],
  ['.', '.'],
  [',', ', '],
  [':', ': '],
  ['< >', '<>', 1],
  ['/>', ' />'],
  ['===', ' === '],
  ['!', '!'],
  ['&&', ' && '],
  ['||', ' || '],
  ['+', ' + '],
  ['-', ' - '],
  ['?', ' ? '],
];

export default function BarSimbol({ viewRef }) {
  const sisip = (teks, kursor = teks.length) => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    view.dispatch({
      changes: { from, to, insert: teks },
      selection: { anchor: from + kursor },
      scrollIntoView: true,
    });
    view.focus();
  };

  // Ctrl+Z tidak ada di keyboard sentuh.
  const batalkan = () => {
    const view = viewRef.current;
    if (!view) return;
    undo(view);
    view.focus();
  };

  return (
    <div className="bar-simbol" role="toolbar" aria-label="Sisipkan simbol">
      <button type="button" onPointerDown={(e) => e.preventDefault()} onClick={batalkan} title="Undo" className="simbol-undo">
        ↶
      </button>
      {SIMBOL.map(([label, teks, kursor]) => (
        <button
          key={label}
          type="button"
          // preventDefault supaya editor tidak kehilangan fokus (keyboard HP tidak tertutup)
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => sisip(teks, kursor)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
