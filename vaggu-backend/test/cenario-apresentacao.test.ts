/** Confere o cenário de apresentação em PostgreSQL descartável, sem tocar em produção. */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { createAnaliticosService } from '../src/analiticos/service.js';
import { createEstruturaService } from '../src/estrutura/service.js';
import { projectRoot } from '../src/config/database.js';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { garantirCenarioApresentacao } from '../scripts/criar-cenario-apresentacao.js';

const executar = promisify(execFile);

test('publicação garante um único Shopping Exemplo sem alterar acessos nas reinicializações', async (t) => {
  if (!process.env.TEST_DATABASE_URL) return t.skip('Configure TEST_DATABASE_URL para testar a inicialização publicada.');
  const prisma = await prepararBancoDeTeste(t, process.env.TEST_DATABASE_URL);
  await Promise.all([garantirCenarioApresentacao(prisma), garantirCenarioApresentacao(prisma)]);
  const shopping = await prisma.shopping.findUniqueOrThrow({ where: { id: 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001' } });
  assert.equal(shopping.nome, 'Shopping Exemplo');
  assert.equal(shopping.demonstracao, true);
  const gerentes = await prisma.usuario.findMany({ where: { shoppingId: shopping.id }, orderBy: { id: 'asc' } });
  assert.equal(gerentes.length, 3);
  const eventos = await prisma.historicoVaga.count({ where: { shoppingId: shopping.id } });
  assert.ok(eventos > 1000);
  await garantirCenarioApresentacao(prisma);
  assert.equal(await prisma.shopping.count(), 1);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 80);
  assert.equal(await prisma.historicoVaga.count({ where: { shoppingId: shopping.id } }), eventos);
  assert.deepEqual(await prisma.usuario.findMany({ where: { shoppingId: shopping.id }, orderBy: { id: 'asc' } }), gerentes);
});

test('cria cenário fictício completo e não sobrescreve acessos em segunda execução', async (t) => {
  const controle = process.env.TEST_DATABASE_URL;
  if (!controle) return t.skip('Configure TEST_DATABASE_URL para testar o seed em PostgreSQL descartável.');
  const prisma = await prepararBancoDeTeste(t, controle);
  const [{ nome }] = await prisma.$queryRaw<{ nome: string }[]>`SELECT current_database() AS nome`;
  const url = new URL(controle);
  url.pathname = `/${nome}`;
  const pasta = await mkdtemp(join(tmpdir(), 'vaggu-demo-'));
  t.after(() => rm(pasta, { recursive: true, force: true }));
  const arquivo = join(pasta, 'credenciais.local');
  const comando = join(projectRoot, 'dist/scripts/criar-cenario-apresentacao.js');
  const args = [comando, '--apply', `--credentials-file=${arquivo}`];
  const opcoes = { cwd: projectRoot, env: { ...process.env, DEMO_DATABASE_URL: url.href } };

  await executar(process.execPath, args, opcoes);
  const shopping = await prisma.shopping.findUnique({ where: { id: 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001' } });
  assert.equal(shopping?.demonstracao, true);
  assert.equal(shopping?.nome, 'Shopping Exemplo');
  assert.equal(await prisma.usuario.count({ where: { shoppingId: shopping?.id } }), 3);
  assert.equal(await prisma.andar.count({ where: { shoppingId: shopping?.id } }), 2);
  assert.equal(await prisma.setor.count({ where: { shoppingId: shopping?.id } }), 4);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping?.id } }), 80);
  assert.ok(await prisma.historicoVaga.count({ where: { shoppingId: shopping?.id } }) > 1000);
  const estrutura = await createEstruturaService(prisma, 120_000).buscarEstrutura(shopping!.id);
  const estados = estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas.map((vaga) => vaga.estadoAtual)));
  assert.ok(estados.includes('OCUPADA'));
  assert.ok(estados.includes('LIVRE'));
  const credenciais = JSON.parse(await readFile(arquivo, 'utf8'));
  assert.equal(credenciais.gerentes.length, 3);
  assert.ok(credenciais.gerentes.every((gerente: { senha: string }) => gerente.senha.length >= 12));
  const analise = await createAnaliticosService(prisma).buscarAnalise(shopping!.id);
  assert.equal(analise.temHistorico, true);
  assert.equal(analise.porDia.length, 7);
  // Reproduz a atualização de um cenário já publicado sem recriar seus acessos.
  const acessosAntes = await prisma.usuario.findMany({ where: { shoppingId: shopping!.id }, orderBy: { id: 'asc' } });
  await prisma.shopping.update({ where: { id: shopping!.id }, data: { nome: 'Shopping Aurora — DEMONSTRAÇÃO' } });
  const outroShopping = await prisma.shopping.create({ data: { nome: 'Shopping Aurora — DEMONSTRAÇÃO', demonstracao: true } });
  const migracaoNome = await readFile(join(projectRoot, 'prisma/migrations/20261015000100_nome_shopping_exemplo/migration.sql'), 'utf8');
  await prisma.$executeRawUnsafe(migracaoNome);
  assert.equal((await prisma.shopping.findUniqueOrThrow({ where: { id: shopping!.id } })).nome, 'Shopping Exemplo');
  assert.equal((await prisma.shopping.findUniqueOrThrow({ where: { id: outroShopping.id } })).nome, 'Shopping Aurora — DEMONSTRAÇÃO');
  assert.deepEqual(await prisma.usuario.findMany({ where: { shoppingId: shopping!.id }, orderBy: { id: 'asc' } }), acessosAntes);
  await assert.rejects(executar(process.execPath, [comando, '--apply', `--credentials-file=${join(pasta, 'novas.local')}`], opcoes));
  assert.equal(await prisma.usuario.count({ where: { shoppingId: shopping?.id } }), 3);
});
