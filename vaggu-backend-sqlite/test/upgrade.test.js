import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { projectRoot } from '../src/config/database.js';
import { createPrisma } from '../src/lib/prisma.js';

test('atualização da base 0.2.1 preserva registros e adiciona sessões sem reset', async (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'vaggu upgrade teste-'));
  const databaseUrl = pathToFileURL(join(directory, 'upgrade.db')).href;
  let prisma = createPrisma(databaseUrl);
  let primaryError;
  try {
    // Reproduz a estrutura antiga numa base temporária vazia.
    const baseline = '20260902000200_inicial_sqlite';
    const sql = readFileSync(join(projectRoot, 'prisma/migrations', baseline, 'migration.sql'), 'utf8');
    for (const statement of sql.split(';').map((value) => value.trim()).filter(Boolean)) {
      await prisma.$executeRawUnsafe(statement);
    }
    const shopping = await prisma.shopping.create({ data: { nome: 'Shopping existente' } });
    const user = await prisma.usuario.create({ data: {
      nome: 'Usuário existente', email: 'existente@example.com', senhaHash: 'hash-antigo-preservado',
      perfil: 'SHOPPING', shoppingId: shopping.id,
    } });
    const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, codigo: 'EX01' } });
    await assert.rejects(() => prisma.sessao.count());
    await prisma.$disconnect();
    const options = { cwd: projectRoot, env: { ...process.env, DATABASE_URL: databaseUrl,
      CHECKPOINT_DISABLE: '1', PRISMA_HIDE_UPDATE_MESSAGE: '1' },
      timeout: 60000, encoding: 'utf8', stdio: 'pipe' };
    const cli = 'node_modules/prisma/build/index.js';
    // Baseline somente neste teste isolado; instalação normal usa db:setup.
    execFileSync(process.execPath, [cli, 'migrate', 'resolve', '--applied', baseline], options);
    execFileSync(process.execPath, [cli, 'migrate', 'deploy'], options);
    prisma = createPrisma(databaseUrl);
    assert.equal((await prisma.shopping.findUnique({ where: { id: shopping.id } })).nome, shopping.nome);
    assert.equal((await prisma.usuario.findUnique({ where: { id: user.id } })).senhaHash, user.senhaHash);
    assert.equal((await prisma.vaga.findUnique({ where: { id: vaga.id } })).codigo, vaga.codigo);
    assert.equal(await prisma.sessao.count(), 0);
    assert.equal(await prisma.whatsappEvento.count(), 0);
  } catch (error) {
    primaryError = error;
    if (error.stdout) t.diagnostic(String(error.stdout));
    if (error.stderr) t.diagnostic(String(error.stderr));
  } finally {
    try { await prisma.$disconnect(); } catch (error) { primaryError ??= error; }
    try {
      await rm(directory, { recursive: true, force: true, maxRetries: 6, retryDelay: 150 });
    } catch (error) {
      if (process.platform !== 'win32' || !['EPERM', 'EBUSY', 'ENOTEMPTY'].includes(error.code)) {
        primaryError ??= error;
      }
      t.diagnostic(`Limpeza pendente (${error.code}): ${directory}. Somente dados fictícios.`);
    }
    if (primaryError) throw primaryError;
  }
});
