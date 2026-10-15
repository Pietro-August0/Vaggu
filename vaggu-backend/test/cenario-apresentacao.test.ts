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

function conferirPosicoes(estrutura: Awaited<ReturnType<ReturnType<typeof createEstruturaService>['buscarEstrutura']>>) {
  for (const andar of estrutura.andares) {
    const vagas = andar.setores.flatMap((setor) => setor.vagas);
    assert.equal(vagas.length, 40);
    for (const [indice, vaga] of vagas.entries()) {
      const p = vaga.posicao!;
      assert.ok(p.x >= 0 && p.y >= 0 && p.x + p.largura <= 1 && p.y + p.altura <= 1);
      for (const outra of vagas.slice(indice + 1)) {
        const q = outra.posicao!;
        assert.ok(p.x + p.largura <= q.x || q.x + q.largura <= p.x
          || p.y + p.altura <= q.y || q.y + q.altura <= p.y,
        `${vaga.codigo} e ${outra.codigo} não podem se sobrepor no mesmo piso`);
      }
    }
  }
}

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
  conferirPosicoes(await createEstruturaService(prisma, 120_000).buscarEstrutura(shopping.id));
  assert.equal(await prisma.historicoVaga.count({ where: { shoppingId: shopping.id } }), eventos);
  assert.deepEqual(await prisma.usuario.findMany({ where: { shoppingId: shopping.id }, orderBy: { id: 'asc' } }), gerentes);
});

test('corrige o mapa já publicado preservando posições editadas e outros shoppings', async (t) => {
  if (!process.env.TEST_DATABASE_URL) return t.skip('Configure TEST_DATABASE_URL para testar a correção do mapa.');
  const prisma = await prepararBancoDeTeste(t, process.env.TEST_DATABASE_URL);
  await garantirCenarioApresentacao(prisma);
  const shoppingId = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001';
  const vagas = await prisma.vaga.findMany({ where: { shoppingId } });
  await prisma.$transaction(vagas.map((vaga) => {
    const indice = Number(vaga.codigo.slice(2)) - 1;
    return prisma.vaga.update({ where: { id: vaga.id }, data: { posicaoY: 0.08 + Math.floor(indice / 5) * 0.21 } });
  }));
  const editada = vagas.find((vaga) => vaga.codigo === 'N-01')!;
  await prisma.vaga.update({ where: { id: editada.id }, data: { posicaoX: 0.01, posicaoY: 0.001, altura: 0.03 } });
  const outro = await prisma.shopping.create({ data: { nome: 'Outro shopping' } });
  const vagaOutro = await prisma.vaga.create({ data: { shoppingId: outro.id, codigo: 'S-01', posicaoX: 0.06, posicaoY: 0.08, largura: 0.12, altura: 0.1, rotacao: 0 } });
  const historico = await prisma.historicoVaga.count({ where: { shoppingId } });
  const migracao = await readFile(join(projectRoot, 'prisma/migrations/20261015000200_mapa_exemplo_sem_sobreposicao/migration.sql'), 'utf8');
  await prisma.$executeRawUnsafe(migracao);
  const estrutura = await createEstruturaService(prisma, 120_000).buscarEstrutura(shoppingId);
  conferirPosicoes(estrutura);
  assert.ok(estrutura.andares.every((andar) => andar.revisaoMapa === 1));
  const preservada = await prisma.vaga.findUniqueOrThrow({ where: { id: editada.id } });
  assert.equal(Number(preservada.posicaoX), 0.01);
  assert.equal(Number(preservada.posicaoY), 0.001);
  assert.equal(Number(preservada.altura), 0.03);
  assert.deepEqual(await prisma.vaga.findUniqueOrThrow({ where: { id: vagaOutro.id } }), vagaOutro);
  assert.equal(await prisma.historicoVaga.count({ where: { shoppingId } }), historico);
  await prisma.$executeRawUnsafe(migracao);
  assert.deepEqual(await createEstruturaService(prisma, 120_000).buscarEstrutura(shoppingId), estrutura);
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
