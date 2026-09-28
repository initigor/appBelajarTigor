import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap, EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';

export default function Editor({ nilai, onUbah, onJalankan, gelap, jsx, bahasa = 'javascript', readOnly, onView }) {
  const ekstensi = useMemo(
    () => [
      bahasa === 'java' ? java() : javascript({ jsx }),
      EditorView.lineWrapping,
      EditorView.editable.of(!readOnly),
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onJalankan();
              return true;
            },
          },
        ]),
      ),
    ],
    [jsx, bahasa, readOnly, onJalankan],
  );
  return (
    <CodeMirror
      className="editor"
      value={nilai}
      onChange={onUbah}
      extensions={ekstensi}
      theme={gelap ? oneDark : 'light'}
      height="100%"
      basicSetup={{ tabSize: 2, foldGutter: false, autocompletion: true }}
      indentWithTab
      onCreateEditor={(view) => onView?.(view)}
    />
  );
}
