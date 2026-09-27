import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap, EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';

export default function Editor({ nilai, onUbah, onJalankan, gelap, jsx }) {
  const ekstensi = useMemo(
    () => [
      javascript({ jsx }),
      EditorView.lineWrapping,
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
    [jsx, onJalankan],
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
    />
  );
}
