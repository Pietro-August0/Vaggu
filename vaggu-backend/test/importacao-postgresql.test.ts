// Exercita a persistência das prévias em PostgreSQL descartável, incluindo isolamento e preservação.
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { createImportacaoService } from '../src/importacao/service.js';
import { ApiError } from '../src/auth/service.js';

const url = process.env.TEST_DATABASE_URL;
test('prévia persistida preserva vagas e isola consultas por shopping', {
  skip: url ? false : 'PENDENTE: configure TEST_DATABASE_URL para testar a persistência do P05.',
}, async t => {
  if (!url) throw new Error('TEST_DATABASE_URL ausente.');
  const prisma = await prepararBancoDeTeste(t, url);
  const servico = createImportacaoService(prisma);
  const shopping = await prisma.shopping.create({ data: { nome: 'Shopping importação' } });
  const outro = await prisma.shopping.create({ data: { nome: 'Outro shopping' } });
  const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, codigo: 'A-001' } });
  const ausente = await prisma.vaga.create({ data: { shoppingId: shopping.id, codigo: 'A-999' } });
  const historico = await prisma.historicoVaga.create({ data: { vagaId: vaga.id, eventoId: 'evento-p05', estado: 'OCUPADA' } });
  const previa = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-001,Térreo,A,PCD\nA-002,Térreo,A,COMUM');
  assert.equal(previa.registros[0]?.vagaId, vaga.id);
  const armazenada = await servico.buscarPrevia(shopping.id, previa.importacaoId);
  assert.equal(armazenada.formato, 'CSV');
  assert.deepEqual(armazenada.previa, {
    registros: previa.registros, erros: previa.erros, resumo: previa.resumo, podeConfirmar: previa.podeConfirmar,
  });
  await assert.rejects(servico.buscarPrevia(outro.id, previa.importacaoId),
    erro => erro instanceof ApiError && erro.status === 404);
  assert.deepEqual(await prisma.vaga.findUnique({ where: { id: vaga.id } }), vaga);
  assert.deepEqual(await prisma.vaga.findUnique({ where: { id: ausente.id } }), ausente);
  assert.deepEqual(await prisma.historicoVaga.findUnique({ where: { id: historico.id } }), historico);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 2);

  const invalida = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-003,Térreo,A,MOTO');
  assert.equal(invalida.podeConfirmar, false);
  assert.equal(await prisma.importacaoEstrutura.count({ where: { shoppingId: shopping.id } }), 2);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 2);
  await prisma.shopping.update({ where: { id: shopping.id }, data: { excluidoEm: new Date() } });
  await assert.rejects(servico.buscarPrevia(shopping.id, previa.importacaoId),
    erro => erro instanceof ApiError && erro.status === 404);
});

test('confirma prévia uma única vez preservando IDs, histórico e vagas ausentes', {
  skip: url ? false : 'PENDENTE: configure TEST_DATABASE_URL para testar a confirmação do P05.',
}, async t => {
  if (!url) throw new Error('TEST_DATABASE_URL ausente.');
  const prisma = await prepararBancoDeTeste(t, url);
  const servico = createImportacaoService(prisma);
  const shopping = await prisma.shopping.create({ data: { nome: 'Shopping confirma importação' } });
  const andar = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: 'Térreo', ordem: 0 } });
  const setor = await prisma.setor.create({ data: { shoppingId: shopping.id, andarId: andar.id, nome: 'A' } });
  const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andar.id, setorId: setor.id, codigo: 'A-001', tipo: 'COMUM' } });
  const ausente = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andar.id, setorId: setor.id, codigo: 'A-999', tipo: 'PCD' } });
  const historico = await prisma.historicoVaga.create({ data: { vagaId: vaga.id, eventoId: 'evento-confirmacao-p05', estado: 'OCUPADA' } });

  const previa = await servico.criarPreviaCsv(shopping.id,
    'codigo,andar,setor,tipo\nA-001,Térreo,B,IDOSO\nA-002,Subsolo 1,C,ELETRICA');
  const confirmacoes = await Promise.all([
    servico.confirmarImportacao(shopping.id, previa.importacaoId),
    servico.confirmarImportacao(shopping.id, previa.importacaoId),
  ]);
  const confirmacao = confirmacoes.find(resultado => !resultado.idempotente);
  assert.ok(confirmacao);
  assert.equal(confirmacoes.filter(resultado => resultado.idempotente).length, 1);
  assert.deepEqual(confirmacao.resultado, {
    andaresCriados: 1,
    setoresCriados: 2,
    vagasCriadas: 1,
    vagasAtualizadas: 1,
    vagasPreservadasForaDaPlanilha: 1,
  });

  const atualizada = await prisma.vaga.findUniqueOrThrow({ where: { id: vaga.id } });
  assert.equal(atualizada.id, vaga.id);
  assert.equal(atualizada.tipo, 'IDOSO');
  assert.equal(await prisma.historicoVaga.count({ where: { id: historico.id, vagaId: vaga.id } }), 1);
  assert.deepEqual(await prisma.vaga.findUnique({ where: { id: ausente.id } }), ausente);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 3);

  const repetida = await servico.confirmarImportacao(shopping.id, previa.importacaoId);
  assert.equal(repetida.idempotente, true);
  assert.deepEqual(repetida.resultado, confirmacao.resultado);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 3);

  const invalida = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-003,Térreo,A,MOTO');
  await assert.rejects(servico.confirmarImportacao(shopping.id, invalida.importacaoId),
    erro => erro instanceof ApiError && erro.status === 409 && erro.codigo === 'PREVIA_NAO_CONFIRMAVEL');
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 3);
});
