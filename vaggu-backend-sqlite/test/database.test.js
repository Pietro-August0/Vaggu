import test from 'node:test';
import assert from 'node:assert/strict';
import { closeSync, existsSync, mkdtempSync, openSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import request from 'supertest';
import { projectRoot } from '../src/config/database.js';
import { createPrisma } from '../src/lib/prisma.js';
import { createApp } from '../src/app.js';
import { runAuthCases } from '../test-support/auth-cases.js';
import { createInitialAdmin } from '../src/auth/bootstrap.js';
import { verifyPassword } from '../src/auth/password.js';

test('integração com SQLite real em arquivo temporário', async (t) => {
  // Usa um diretório novo por execução; nunca usa prisma/dev.db.
  const directory = mkdtempSync(join(tmpdir(), 'vaggu sqlite teste-'));
  const databasePath = join(directory, 'teste.db');
  const databaseUrl = pathToFileURL(databasePath).href;
  let prisma;
  let primaryError;

  try {
    closeSync(openSync(databasePath, 'a'));
    const args = ['node_modules/prisma/build/index.js', 'migrate', 'deploy'];
    const options = {
      cwd: projectRoot,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        CHECKPOINT_DISABLE: '1',
        PRISMA_HIDE_UPDATE_MESSAGE: '1',
      },
      timeout: 60000,
      encoding: 'utf8',
      stdio: 'pipe',
    };
    execFileSync(process.execPath, args, options);
    assert.ok(existsSync(databasePath), 'A migration deve criar o arquivo no caminho indicado.');
    // Repetir deploy não pode apagar ou recriar as tabelas existentes.
    execFileSync(process.execPath, args, options);
    prisma = createPrisma(databaseUrl);

    await t.test('CLI e adapter usam o mesmo arquivo e ativam foreign keys', async () => {
      assert.equal(await prisma.shopping.count(), 0);
      const rows = await prisma.$queryRawUnsafe('PRAGMA foreign_keys');
      assert.equal(Number(rows[0].foreign_keys), 1);
    });

    const shoppingA = await prisma.shopping.create({ data: { nome: 'Shopping A — teste' } });
    const shoppingB = await prisma.shopping.create({ data: { nome: 'Shopping B — teste' } });
    await t.test('cria primeiro administrador com senha aleatória e somente hash no banco', async () => {
      const initial = await createInitialAdmin(prisma, { nome: 'Admin inicial', email: ' INICIAL@EXAMPLE.COM ' });
      const stored = await prisma.usuario.findUnique({ where: { id: initial.usuario.id } });
      assert.equal(initial.usuario.email, 'inicial@example.com');
      assert.equal(initial.senha.length, 24);
      assert.equal(stored.perfil, 'VAGGU');
      assert.equal(stored.shoppingId, null);
      assert.notEqual(stored.senhaHash, initial.senha);
      assert.equal(await verifyPassword(initial.senha, stored.senhaHash), true);
      await prisma.usuario.delete({ where: { id: stored.id } });
    });
    const dispositivo = await prisma.dispositivo.create({ data: {
      nome: 'Placa de teste', shoppingId: shoppingA.id, chaveApiHash: 'HASH_FICTICIO_NAO_USAR',
    } });
    const vaga = await prisma.vaga.create({ data: {
      shoppingId: shoppingA.id, dispositivoId: dispositivo.id,
      codigo: 'A01', canalSensor: 'sensor-01',
    } });

    await t.test('UUID, estado inicial e datas são recuperados corretamente', async () => {
      assert.match(shoppingA.id, /^[0-9a-f-]{36}$/);
      assert.ok(shoppingA.criadoEm instanceof Date);
      assert.equal(vaga.estadoAtual, 'DESCONHECIDA');
    });

    await t.test('aceita os dois perfis válidos e restringe e-mail repetido', async () => {
      await prisma.usuario.create({ data: {
        nome: 'Administrador de teste', email: 'vaggu@example.com',
        senhaHash: 'HASH_FICTICIO_NAO_USAR', perfil: 'VAGGU',
      } });
      await prisma.usuario.create({ data: {
        nome: 'Gestor de teste', email: 'shopping@example.com',
        senhaHash: 'HASH_FICTICIO_NAO_USAR', perfil: 'SHOPPING', shoppingId: shoppingA.id,
      } });
      await assert.rejects(() => prisma.usuario.create({ data: {
        nome: 'Duplicado', email: 'shopping@example.com',
        senhaHash: 'HASH_FICTICIO_NAO_USAR', perfil: 'SHOPPING', shoppingId: shoppingA.id,
      } }));
    });

    await t.test('recusa perfil com vínculo de shopping incorreto', async () => {
      for (const data of [
        { perfil: 'SHOPPING', shoppingId: null },
        { perfil: 'VAGGU', shoppingId: shoppingA.id },
      ]) {
        await assert.rejects(() => prisma.usuario.create({ data: {
          nome: 'Inválido', email: `${randomUUID()}@example.com`,
          senhaHash: 'HASH_FICTICIO_NAO_USAR', ...data,
        } }));
      }
    });

    await t.test('recusa vaga ligada à placa de outro shopping', async () => {
      await assert.rejects(() => prisma.vaga.create({ data: {
        shoppingId: shoppingB.id, dispositivoId: dispositivo.id,
        codigo: 'B01', canalSensor: 'sensor-02',
      } }));
    });

    await t.test('recusa código e canal duplicados', async () => {
      await assert.rejects(() => prisma.vaga.create({ data: {
        shoppingId: shoppingA.id, codigo: 'A01',
      } }));
      await assert.rejects(() => prisma.vaga.create({ data: {
        shoppingId: shoppingA.id, dispositivoId: dispositivo.id,
        codigo: 'A02', canalSensor: 'sensor-01',
      } }));
    });

    await t.test('exige dispositivo e canal configurados juntos', async () => {
      await assert.rejects(() => prisma.vaga.create({ data: {
        shoppingId: shoppingA.id, dispositivoId: dispositivo.id, codigo: 'A03',
      } }));
    });

    const eventoId = randomUUID();
    await t.test('transação grava leitura e atualiza vaga; evento não se repete', async () => {
      await prisma.$transaction(async (tx) => {
        await tx.historicoVaga.create({ data: { vagaId: vaga.id, eventoId, estado: 'OCUPADA' } });
        await tx.vaga.update({ where: { id: vaga.id }, data: {
          estadoAtual: 'OCUPADA', ultimaLeituraEm: new Date(),
        } });
      });
      assert.equal((await prisma.vaga.findUnique({ where: { id: vaga.id } })).estadoAtual, 'OCUPADA');
      await assert.rejects(() => prisma.historicoVaga.create({ data: {
        vagaId: vaga.id, eventoId, estado: 'LIVRE',
      } }));
    });

    await t.test('CHECK recusa estado inválido mesmo em SQL direto', async () => {
      await assert.rejects(() => prisma.$executeRaw`UPDATE vagas SET estado_atual = 'INVALIDO' WHERE id = ${vaga.id}`);
    });

    await t.test('não permite apagar vaga que possui histórico', async () => {
      await assert.rejects(() => prisma.vaga.delete({ where: { id: vaga.id } }));
    });

    await t.test('readiness conecta realmente ao SQLite', async () => {
      const app = createApp({ checkDatabase: () => prisma.$queryRaw`SELECT 1` });
      const response = await request(app).get('/api/v1/health/ready').expect(200);
      assert.equal(response.body.banco, 'conectado');
    });

    await t.test('dados permanecem após fechar e reabrir a conexão', async () => {
      await prisma.$disconnect();
      prisma = createPrisma(databaseUrl);
      assert.equal(await prisma.shopping.count(), 2);
      assert.equal(await prisma.historicoVaga.count(), 1);
    });
    await runAuthCases(t, prisma, shoppingA, shoppingB);
  } catch (error) {
    primaryError = error;
    if (error.stdout) t.diagnostic(String(error.stdout));
    if (error.stderr) t.diagnostic(String(error.stderr));
    throw error;
  } finally {
    try {
      if (prisma) await prisma.$disconnect();
    } catch (error) {
      if (!primaryError) primaryError = error;
      t.diagnostic(`Falha ao fechar o banco temporário: ${error.message}`);
    }

    // Remove somente a pasta temporária criada acima, nunca prisma/dev.db.
    // No Windows, arquivos nativos podem demorar para liberar seus handles.
    try {
      await rm(directory, {
        recursive: true, force: true, maxRetries: 6, retryDelay: 150,
      });
    } catch (error) {
      const windowsLock = process.platform === 'win32'
        && ['EPERM', 'EBUSY', 'ENOTEMPTY'].includes(error.code);
      if (!windowsLock && !primaryError) throw error;
      t.diagnostic(`Limpeza pendente (${error.code}): ${directory}. Apenas dados fictícios de teste foram mantidos.`);
    }

    // Uma falha de limpeza nunca deve esconder a falha original do teste.
    if (primaryError) throw primaryError;
  }
});
