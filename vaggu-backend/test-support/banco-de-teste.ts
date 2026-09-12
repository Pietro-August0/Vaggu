// Prepara um banco PostgreSQL exclusivo por execução e aplica as migrations versionadas.
import { randomUUID } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { TestContext } from 'node:test';
import { Client } from 'pg';
import { createPrisma } from '../src/lib/prisma.js';
import { projectRoot } from '../src/config/database.js';

/** Exige uma conexão explicitamente destinada a testes, sem recorrer a DATABASE_URL. */
export function validarUrlDeTeste(valor: string): URL {
  let url: URL;
  try {
    url = new URL(valor);
  } catch {
    throw new Error('TEST_DATABASE_URL deve ser uma URL PostgreSQL válida de teste.');
  }
  if (!['postgres:', 'postgresql:'].includes(url.protocol)
    || !/^\/[a-z0-9_]+_(teste|test)$/.test(url.pathname)
    || url.search || url.hash) {
    throw new Error('TEST_DATABASE_URL deve indicar um banco terminado em _teste ou _test, sem parâmetros adicionais.');
  }
  return url;
}

/** Cria recursos exclusivos; registra a limpeza antes de executar migrations e fixtures. */
export async function prepararBancoDeTeste(t: TestContext, valor: string) {
  const url = validarUrlDeTeste(valor);
  const controle = new Client({ connectionString: url.href, connectionTimeoutMillis: 5000 });
  // Identificador gerado internamente: nenhum nome recebido do ambiente entra no SQL de descarte.
  const nomeBanco = `vaggu_teste_${randomUUID().replaceAll('-', '')}`;
  const identificador = `"${nomeBanco}"`;
  let bancoCriado = false;
  url.pathname = `/${nomeBanco}`;
  const prisma = createPrisma(url.href);

  t.after(async () => {
    try {
      await prisma.$disconnect();
    } finally {
      try {
        if (bancoCriado) await controle.query(`DROP DATABASE ${identificador}`);
      } finally {
        await controle.end();
      }
    }
  });

  try {
    await controle.connect();
    await controle.query(`CREATE DATABASE ${identificador} TEMPLATE template0`);
    bancoCriado = true;
  } catch {
    throw new Error('Não foi possível criar o banco isolado. Confira o PostgreSQL de teste e a permissão CREATEDB do usuário.');
  }

  const migracao = new Client({ connectionString: url.href, connectionTimeoutMillis: 5000 });
  try {
    await migracao.connect();
    const pasta = join(projectRoot, 'prisma/migrations');
    const entradas = await readdir(pasta, { withFileTypes: true });
    // A ordem dos diretórios reproduz a sequência incremental; falhas desfazem a migration atual.
    for (const entrada of entradas.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      const sql = await readFile(join(pasta, entrada.name, 'migration.sql'), 'utf8');
      await migracao.query('BEGIN');
      try {
        await migracao.query(sql);
        await migracao.query('COMMIT');
      } catch {
        await migracao.query('ROLLBACK');
        throw new Error(`Falha ao aplicar a migration de teste ${entrada.name}.`);
      }
    }
  } finally {
    await migracao.end();
  }
  return prisma;
}
