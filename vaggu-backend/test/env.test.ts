import test from 'node:test';
import assert from 'node:assert/strict';
import { readEnv } from '../src/config/env.js';
import { resolveDatabaseUrl } from '../src/config/database.js';

const databaseUrl = 'postgresql://vaggu:vaggu@localhost:5432/vaggu';

test('configuração usa porta 3000 e host local por padrão', () => {
  const config = readEnv({ DATABASE_URL: databaseUrl });
  assert.equal(config.port, 3000);
  assert.equal(config.host, '127.0.0.1');
});

test('configuração exige PostgreSQL e recusa SQLite ou formato inválido', () => {
  for (const value of ['', 'SEGREDO', 'mysql://u:p@localhost/banco', 'file:./prisma/dev.db', 'file:', 'file::memory:']) {
    assert.throws(() => readEnv({ DATABASE_URL: value }));
  }
});

test('configuração preserva a URL PostgreSQL informada', () => {
  assert.equal(readEnv({ DATABASE_URL: databaseUrl }).databaseUrl, resolveDatabaseUrl(databaseUrl));
  assert.equal(resolveDatabaseUrl('postgres://vaggu:vaggu@localhost:5432/vaggu'), 'postgres://vaggu:vaggu@localhost:5432/vaggu');
});

test('configuração recusa portas inválidas', () => {
  for (const port of ['0', '65536', 'abc', '3.14', '-1', '1e3']) {
    assert.throws(() => readEnv({ DATABASE_URL: databaseUrl, PORT: port }));
  }
});
