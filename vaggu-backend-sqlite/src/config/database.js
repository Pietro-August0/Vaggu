import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const defaultDatabaseUrl = 'file:./prisma/dev.db';

// O engine de migrations espera o caminho local sem percent-encoding;
// o adapter libsql espera uma URL de arquivo. Ambos apontam para o mesmo arquivo.
export function prismaDatabaseUrl(value = defaultDatabaseUrl) {
  const path = fileURLToPath(resolveDatabaseUrl(value));
  return `file:${path.replaceAll('\\', '/')}`;
}

export function resolveDatabaseUrl(value = defaultDatabaseUrl) {
  if (typeof value !== 'string' || !value.startsWith('file:')) {
    throw new Error('Use SQLite local: DATABASE_URL="file:./prisma/dev.db".');
  }
  if (value.startsWith('file:///')) {
    const url = new URL(value);
    if (url.search || url.hash) throw new Error('A URL do banco não aceita parâmetros.');
    return pathToFileURL(fileURLToPath(url)).href;
  }
  const path = value.slice(5);
  if (!path || path === ':memory:' || /[?#]/.test(path)) {
    throw new Error('Indique um arquivo SQLite persistente, como file:./prisma/dev.db.');
  }
  return pathToFileURL(resolve(projectRoot, path)).href;
}
