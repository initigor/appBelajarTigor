import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import KodePythonInteraktif from './KodePythonInteraktif.jsx';

const teksNode = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(teksNode).join(''));

/** Blok ```python menjadi blok yang bisa dijalankan; bahasa lain (dan ```py) tetap tampil sebagai kode biasa. */
function PreInteraktif({ node, children }) {
  const kode = node?.children?.[0];
  const kelas = kode?.properties?.className ?? [];
  if (kode?.tagName === 'code' && kelas.includes('language-python')) {
    return <KodePythonInteraktif kodeAwal={teksNode(kode).replace(/\n$/, '')} />;
  }
  return <pre>{children}</pre>;
}

const KOMPONEN_INTERAKTIF = { pre: PreInteraktif };

/** `interaktifPython`: jadikan blok ```python bisa dijalankan di browser (Pyodide). */
export default function Markdown({ children, interaktifPython = false }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { detect: false }]]} components={interaktifPython ? KOMPONEN_INTERAKTIF : undefined}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
