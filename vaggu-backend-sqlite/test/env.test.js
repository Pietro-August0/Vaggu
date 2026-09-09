import test from 'node:test';
import assert from 'node:assert/strict';
import { readEnv } from '../src/config/env.js';
import { resolveDatabaseUrl, prismaDatabaseUrl } from '../src/config/database.js';
import { fileURLToPath } from 'node:url';

const databaseUrl = 'file:./prisma/dev.db';

test('configuração usa porta 3000 e host local por padrão', () => {
  const config = readEnv({ DATABASE_URL: databaseUrl });
  assert.equal(config.port, 3000);
  assert.equal(config.host, '127.0.0.1');
});

test('configuração exige SQLite local e recusa a configuração antiga', () => {
  for (const value of ['', 'SEGREDO', 'mysql://u:p@localhost/banco', 'postgresql://localhost', 'file:', 'file::memory:']) {
    assert.throws(() => readEnv({ DATABASE_URL: value }));
  }
});

test('configuração funciona sem .env com arquivo SQLite padrão', () => {
  assert.equal(readEnv({}).databaseUrl, resolveDatabaseUrl(databaseUrl));
});

test('caminho do banco é absoluto e suporta espaços', () => {
  const url = resolveDatabaseUrl('file:./prisma/pasta com espaco/teste.db');
  assert.ok(url.startsWith('file:///'));
  assert.ok(fileURLToPath(url).includes('pasta com espaco'));
  assert.equal(resolveDatabaseUrl(url), url);
  assert.ok(prismaDatabaseUrl(url).includes('pasta com espaco'));
  assert.ok(!prismaDatabaseUrl(url).includes('%20'));
});

test('configuração recusa portas inválidas', () => {
  for (const port of ['0', '65536', 'abc', '3.14', '-1', '1e3']) {
    assert.throws(() => readEnv({ DATABASE_URL: databaseUrl, PORT: port }));
  }
});
