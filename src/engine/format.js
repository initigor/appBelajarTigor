// Mengubah nilai JS menjadi teks seperti yang tampil di console browser.
// Dipakai oleh console buatan kita dan oleh pesan tes (fungsi `tampil`).

const IDENT = /^[A-Za-z_$][\w$]*$/;

function isDomNode(v) {
  return v && typeof v === 'object' && typeof v.nodeType === 'number' && typeof v.nodeName === 'string';
}

export function formatValue(v, top = true, depth = 0, seen = new WeakSet()) {
  switch (typeof v) {
    case 'string':
      return top ? v : `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
    case 'number':
      return Object.is(v, -0) ? '-0' : String(v);
    case 'bigint':
      return `${v}n`;
    case 'undefined':
    case 'boolean':
      return String(v);
    case 'symbol':
      return v.toString();
    case 'function': {
      if (/^class[\s{]/.test(Function.prototype.toString.call(v))) return `[class ${v.name || '(anonim)'}]`;
      return v.name ? `[Function: ${v.name}]` : '[Function (anonim)]';
    }
  }
  if (v === null) return 'null';
  if (seen.has(v)) return '[Circular]';

  if (isDomNode(v)) {
    if (v.nodeType === 3) return `#text "${v.textContent}"`;
    if (v.nodeType === 9) return '#document';
    const html = v.outerHTML ?? v.nodeName;
    return html.length > 120 ? html.slice(0, 117) + '...' : html;
  }
  if (v instanceof Error || (v && typeof v.message === 'string' && typeof v.name === 'string' && 'stack' in v)) {
    return `${v.name}: ${v.message}`;
  }
  if (v instanceof Date) return isNaN(v) ? 'Invalid Date' : v.toISOString();
  if (v instanceof RegExp) return String(v);
  if (typeof v.then === 'function') return 'Promise { <pending> }';

  if (depth > 3) return Array.isArray(v) ? '[Array]' : '[Object]';
  seen.add(v);
  try {
    const f = (x) => formatValue(x, false, depth + 1, seen);
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      const items = [];
      for (let i = 0; i < v.length; i++) items.push(i in v ? f(v[i]) : '<kosong>');
      return `[${items.join(', ')}]`;
    }
    if (v instanceof Map) {
      const items = [...v].map(([k, val]) => `${f(k)} => ${f(val)}`);
      return `Map(${v.size}) {${items.length ? ' ' + items.join(', ') + ' ' : ''}}`;
    }
    if (v instanceof Set) {
      const items = [...v].map(f);
      return `Set(${v.size}) {${items.length ? ' ' + items.join(', ') + ' ' : ''}}`;
    }
    const keys = Object.keys(v);
    const ctorName = v.constructor && v.constructor !== Object ? v.constructor.name : '';
    const prefix = ctorName && ctorName !== 'Object' ? ctorName + ' ' : '';
    if (keys.length === 0) return prefix + '{}';
    const items = keys.map((k) => `${IDENT.test(k) ? k : `'${k}'`}: ${f(v[k])}`);
    return `${prefix}{ ${items.join(', ')} }`;
  } finally {
    seen.delete(v);
  }
}

/** Format nilai untuk pesan tes: string selalu diberi tanda kutip supaya kelihatan tipenya. */
export function tampil(v) {
  return formatValue(v, false);
}
