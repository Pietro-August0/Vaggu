// Confere a validação das variáveis de ambiente antes de iniciar a API.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readEnv } from '../src/config/env.js';
import { resolveDatabaseUrl } from '../src/config/database.js';

const databaseUrl = 'postgresql://vaggu:vaggu@localhost:5432/vaggu';

test('configuração usa porta 3000 e host local por padrão', () => {
  const config = readEnv({ DATABASE_URL: databaseUrl });
  assert.equal(config.port, 3000);
  assert.equal(config.host, '127.0.0.1');
  assert.equal(config.telemetria.janelaConfirmacaoMs, 30_000);
});

test('bancada pode reduzir confirmação sem aceitar lacuna maior que a janela', () => {
  const config = readEnv({ DATABASE_URL: databaseUrl, TELEMETRIA_CONFIRMACAO_MS: '5000', TELEMETRIA_LACUNA_MAXIMA_MS: '4500' });
  assert.equal(config.telemetria.janelaConfirmacaoMs, 5000);
  assert.equal(config.telemetria.lacunaMaximaMs, 4500);
  for (const valor of ['0', '999', 'abc']) assert.throws(() => readEnv({ DATABASE_URL: databaseUrl, TELEMETRIA_CONFIRMACAO_MS: valor }));
  assert.equal(readEnv({ DATABASE_URL: databaseUrl, TELEMETRIA_CONFIRMACAO_MS: '2000', TELEMETRIA_LACUNA_MAXIMA_MS: '4500' }).telemetria.janelaConfirmacaoMs, 2000);
  assert.throws(() => readEnv({ DATABASE_URL: databaseUrl, TELEMETRIA_CONFIRMACAO_MS: '2000', TELEMETRIA_LACUNA_MAXIMA_MS: '30000' }));
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

test('telemetria usa parâmetros provisórios configuráveis e lacuna menor que trinta segundos', () => {
  const config = readEnv({
    DATABASE_URL: databaseUrl,
    TELEMETRIA_LACUNA_MAXIMA_MS: '10000',
    TELEMETRIA_TIMEOUT_SENSOR_MS: '90000',
  });
  assert.equal(config.telemetria.lacunaMaximaMs, 10_000);
  assert.equal(config.telemetria.timeoutSensorMs, 90_000);
  assert.throws(() => readEnv({ DATABASE_URL: databaseUrl, TELEMETRIA_LACUNA_MAXIMA_MS: '30000' }));
});
