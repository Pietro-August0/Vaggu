// Exercita prévia e confirmação em PostgreSQL descartável, incluindo atomicidade e idempotência.
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { createImportacaoService } from '../src/importacao/service.js';
import { ApiError } from '../src/auth/service.js';

const url = process.env.TEST_DATABASE_URL;
test('importação confirma de forma atômica, idempotente e isolada por shopping', {
  skip: url ? false : 'PENDENTE: configure TEST_DATABASE_URL para testar a persistência do P05.',
}, async t => {
  if (!url) throw new Error('TEST_DATABASE_URL ausente.');
  const prisma = await prepararBancoDeTeste(t, url);
  const servico = createImportacaoService(prisma);
  const shopping = await prisma.shopping.create({ data: { nome: 'Shopping importação' } });
  const outro = await prisma.shopping.create({ data: { nome: 'Outro shopping' } });
  const andarAntigo = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: 'Subsolo', ordem: 0 } });
  const setorAntigo = await prisma.setor.create({ data: { shoppingId: shopping.id, andarId: andarAntigo.id, nome: 'Antigo' } });
  const dispositivo = await prisma.dispositivo.create({ data: { shoppingId: shopping.id, nome: 'ESP32 teste', chaveApiHash: 'hash-teste' } });
  const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andarAntigo.id, setorId: setorAntigo.id,
    dispositivoId: dispositivo.id, canalSensor: 'sensor-1', codigo: 'A-001', posicaoX: 0.1, posicaoY: 0.2,
    largura: 0.1, altura: 0.1, rotacao: 0 } });
  const ausente = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andarAntigo.id,
    setorId: setorAntigo.id, codigo: 'A-999' } });
  const historico = await prisma.historicoVaga.create({ data: { vagaId: vaga.id, eventoId: 'evento-p05', estado: 'OCUPADA' } });
  const previa = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-001,Térreo,A,PCD\nA-002,Térreo,A,COMUM');
  assert.equal(previa.registros[0]?.vagaId, vaga.id);
  assert.equal(previa.resumo.preservadasAusentes, 1);
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
  await assert.rejects(servico.confirmarPrevia(shopping.id, invalida.importacaoId),
    erro => erro instanceof ApiError && erro.codigo === 'IMPORTACAO_COM_ERROS');
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 2);

  const confirmacao = await servico.confirmarPrevia(shopping.id, previa.importacaoId);
  assert.deepEqual(confirmacao.resumo, { novos: 1, atualizacoes: 1, preservadasAusentes: 1 });
  assert.equal(confirmacao.repetida, false);
  const atualizada = await prisma.vaga.findUniqueOrThrow({ where: { id: vaga.id } });
  assert.equal(atualizada.id, vaga.id);
  assert.equal(atualizada.tipo, 'PCD');
  assert.equal(atualizada.dispositivoId, dispositivo.id);
  assert.equal(atualizada.canalSensor, 'sensor-1');
  assert.equal(atualizada.posicaoX, null);
  assert.equal(await prisma.historicoVaga.count({ where: { vagaId: vaga.id } }), 1);
  assert.deepEqual(await prisma.vaga.findUnique({ where: { id: ausente.id } }), ausente);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 3);
  const repetida = await servico.confirmarPrevia(shopping.id, previa.importacaoId);
  assert.deepEqual(repetida.resumo, confirmacao.resumo);
  assert.equal(repetida.repetida, true);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), 3);

  const concorrente = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-003,Térreo,A,ELETRICA');
  const confirmacoes = await Promise.all([
    servico.confirmarPrevia(shopping.id, concorrente.importacaoId),
    servico.confirmarPrevia(shopping.id, concorrente.importacaoId),
  ]);
  assert.deepEqual(confirmacoes.map(resultado => resultado.repetida).sort(), [false, true]);
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id, codigo: 'A-003' } }), 1);
  assert.equal(await prisma.importacaoEstrutura.count({ where: { shoppingId: shopping.id, ativa: true } }), 1);

  const desatualizada = await servico.criarPreviaCsv(shopping.id, 'codigo,andar,setor,tipo\nA-004,Térreo,A,COMUM');
  await prisma.vaga.create({ data: { shoppingId: shopping.id, codigo: 'A-004' } });
  const totalAntesDaFalha = await prisma.vaga.count({ where: { shoppingId: shopping.id } });
  await assert.rejects(servico.confirmarPrevia(shopping.id, desatualizada.importacaoId),
    erro => erro instanceof ApiError && erro.codigo === 'IMPORTACAO_DESATUALIZADA');
  assert.equal(await prisma.vaga.count({ where: { shoppingId: shopping.id } }), totalAntesDaFalha);
  await assert.rejects(servico.confirmarPrevia(outro.id, previa.importacaoId),
    erro => erro instanceof ApiError && erro.status === 404);

  await prisma.shopping.update({ where: { id: shopping.id }, data: { excluidoEm: new Date() } });
  await assert.rejects(servico.buscarPrevia(shopping.id, previa.importacaoId),
    erro => erro instanceof ApiError && erro.status === 404);
  await assert.rejects(servico.confirmarPrevia(shopping.id, previa.importacaoId),
    erro => erro instanceof ApiError && erro.status === 404);
});
