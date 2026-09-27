// Semua pemakaian Babel ada di sini: analisis nama top-level, compile JSX,
// konversi import/export ke require, dan pengaman loop.
import Babel from '@babel/standalone';

const BATAS_LOOP_MS = 2000;

/** Plugin: kumpulkan nama variabel/fungsi/class di level paling atas. */
function pluginNamaTopLevel(nama) {
  return ({ types: t }) => ({
    visitor: {
      Program(path) {
        for (let node of path.node.body) {
          if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration') node = node.declaration;
          if (!node) continue;
          if ((node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') && node.id) nama.add(node.id.name);
          if (node.type === 'VariableDeclaration') {
            for (const d of node.declarations) Object.keys(t.getBindingIdentifiers(d.id)).forEach((n) => nama.add(n));
          }
        }
      },
    },
  });
}

/** Plugin: sisipkan pengecekan waktu di setiap loop supaya infinite loop berhenti sendiri. */
function pluginPengamanLoop({ types: t, template }) {
  const buatCek = template.statement(
    `if (Date.now() - MULAI > ${BATAS_LOOP_MS}) throw new RangeError("Loop berjalan lebih dari ${BATAS_LOOP_MS / 1000} detik, kemungkinan infinite loop. Cek kondisi berhentinya.");`,
  );
  return {
    visitor: {
      'WhileStatement|DoWhileStatement|ForStatement|ForInStatement|ForOfStatement'(path) {
        if (path.node._dijaga) return;
        path.node._dijaga = true;
        const mulai = path.scope.generateUidIdentifier('mulai');
        const cek = buatCek({ MULAI: mulai });
        const body = path.get('body');
        if (body.isBlockStatement()) body.unshiftContainer('body', cek);
        else body.replaceWith(t.blockStatement([cek, body.node]));
        const deklarasi = t.variableDeclaration('const', [
          t.variableDeclarator(mulai, t.callExpression(t.memberExpression(t.identifier('Date'), t.identifier('now')), [])),
        ]);
        const target = path.parentPath.isLabeledStatement() ? path.parentPath : path;
        target.insertBefore(deklarasi);
      },
    },
  };
}

/**
 * Analisis & (opsional) compile kode user.
 * Melempar error Babel (dengan .loc) jika ada syntax error.
 */
export function olahKode(kode, { jsx = false, modul = false, jagaLoop = false } = {}) {
  const nama = new Set();
  const presets = jsx ? [['react', { runtime: 'classic' }]] : [];
  const opsiDasar = {
    filename: 'kode-kamu.js',
    babelrc: false,
    configFile: false,
    sourceType: modul ? 'module' : 'script',
    parserOpts: { allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true },
    retainLines: true,
  };

  // Versi tanpa komentar (untuk tes statis seperti "harus memakai for...of").
  const bersih = Babel.transform(kode, {
    ...opsiDasar,
    presets,
    plugins: [pluginNamaTopLevel(nama)],
    comments: false,
    retainLines: false,
  }).code;

  let hasil = kode;
  if (jsx || modul || jagaLoop) {
    const plugins = [];
    if (jagaLoop) plugins.push(pluginPengamanLoop);
    if (modul) plugins.push('transform-modules-commonjs');
    hasil = Babel.transform(kode, { ...opsiDasar, presets, plugins }).code;
  }

  return { nama: [...nama], bersih, hasil };
}
