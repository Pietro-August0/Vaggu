import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from 'pg';
import { conexaoBackup, criarBackup, restaurarBackupLocal } from '../scripts/backup-banco.js';
import { prepararBancoDeTeste, validarUrlDeTeste } from '../test-support/banco-de-teste.js';

test('restauração exige destino local de teste e rejeita parâmetros/nomes perigosos', () => {
  for (const valor of ['postgresql://u@servidor/abc_teste', 'postgresql://u@localhost/producao',
    'postgresql://u@localhost/abc_teste?sslmode=disable', 'postgresql://u@localhost/abc%22_teste']) {
    assert.throws(() => conexaoBackup(valor, true));
  }
  assert.equal(conexaoBackup('postgresql://u@127.0.0.1/novo_teste', true).pathname, '/novo_teste');
});

test('dump e restore preservam schema, dados e restrições sem sobrescrever arquivo/banco', {
  skip: !process.env.TEST_DATABASE_URL || !process.env.PG_BIN,
}, async (t) => {
  const url = validarUrlDeTeste(process.env.TEST_DATABASE_URL!);
  const prisma = await prepararBancoDeTeste(t, url.href);
  const [{ nome }] = await prisma.$queryRawUnsafe<Array<{ nome: string }>>('SELECT current_database() AS nome');
  url.pathname = '/' + nome;
  await prisma.$executeRawUnsafe('CREATE TABLE "EnsaioBackup" (id integer PRIMARY KEY, mensagem text NOT NULL)');
  await prisma.$executeRawUnsafe("INSERT INTO \"EnsaioBackup\" VALUES (1, 'VAGGU: restauração íntegra')");
  const pasta = await mkdtemp(join(tmpdir(), 'vaggu-backup-'));
  t.after(() => rm(pasta, { recursive: true, force: true }));
  const arquivo = join(pasta, 'ensaio.dump');
  await criarBackup(url.href, arquivo, process.env.PG_BIN);
  await assert.rejects(criarBackup(url.href, arquivo, process.env.PG_BIN));
  const alvo = new URL(url.href);
  alvo.pathname = '/vaggu_restauro_' + randomUUID().replaceAll('-', '') + '_teste';
  const controle = new Client({ connectionString: process.env.TEST_DATABASE_URL });
  await controle.connect();
  let criado = false;
  t.after(async () => {
    try { if (criado) await controle.query(`DROP DATABASE "${alvo.pathname.slice(1)}"`); }
    finally { await controle.end(); }
  });
  await restaurarBackupLocal(alvo.href, arquivo, process.env.PG_BIN);
  criado = true;
  const restaurado = new Client({ connectionString: alvo.href });
  await restaurado.connect();
  try {
    assert.deepEqual((await restaurado.query('SELECT * FROM "EnsaioBackup"')).rows,
      [{ id: 1, mensagem: 'VAGGU: restauração íntegra' }]);
    await assert.rejects(restaurado.query("INSERT INTO \"EnsaioBackup\" VALUES (1, 'duplicado')"));
    const original = await prisma.$queryRawUnsafe<Array<{ total: number }>>(
      "SELECT count(*)::int AS total FROM information_schema.tables WHERE table_schema='public'");
    assert.equal((await restaurado.query("SELECT count(*)::int AS total FROM information_schema.tables WHERE table_schema='public'")).rows[0].total, original[0].total);
    await assert.rejects(restaurarBackupLocal(alvo.href, arquivo, process.env.PG_BIN), /Nenhum banco existente/);
    assert.equal((await restaurado.query('SELECT count(*)::int AS total FROM "EnsaioBackup"')).rows[0].total, 1);
  } finally { await restaurado.end(); }
});
