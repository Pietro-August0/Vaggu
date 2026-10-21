import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { createAnaliticosService } from '../src/analiticos/service.js';
const url = process.env.TEST_DATABASE_URL;
test('classificação permanece após edição e filtros não cruzam shoppings', { skip: url ? false : 'Configure TEST_DATABASE_URL.' }, async t => {
  const prisma = await prepararBancoDeTeste(t, url!);
  const shopping = await prisma.shopping.create({ data: { nome: 'Histórico' } });
  const outro = await prisma.shopping.create({ data: { nome: 'Outro' } });
  const andar = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: 'G1', ordem: 1 } });
  const setor = await prisma.setor.create({ data: { shoppingId: shopping.id, andarId: andar.id, nome: 'A' } });
  const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andar.id, setorId: setor.id, codigo: 'A01', tipo: 'PCD' } });
  for (const [ordem, estado, estadoAnterior] of [[0, 'LIVRE', null], [1, 'OCUPADA', 'LIVRE'], [2, 'LIVRE', 'OCUPADA']] as const) {
    await prisma.historicoVaga.create({ data: { shoppingId: shopping.id, vagaId: vaga.id, eventoId: `teste-${ordem}`, estado, estadoAnterior, efetivoEm: new Date(`2026-10-19T${10 + ordem}:00:00Z`), recebidoEm: new Date(), origem: 'TESTE', motivo: 'TESTE' } });
  }
  await prisma.vaga.update({ where: { id: vaga.id }, data: { tipo: 'COMUM', codigo: 'NOVO' } });
  await prisma.setor.update({ where: { id: setor.id }, data: { nome: 'Renomeado' } });
  const intervalos = await prisma.$queryRaw<any[]>`SELECT * FROM power_bi_intervalos_ocupacao WHERE shopping_codigo = ${shopping.id}`;
  assert.ok(intervalos.every(i => i.setor === 'A' && i.tipo_vaga === 'PCD' && i.vaga_codigo === 'A01' && i.classificacao_confirmada));
  assert.equal(intervalos.filter(i => i.saida_observada).length, 1);
  const servico = createAnaliticosService(prisma, () => new Date('2026-10-19T13:00:00Z'));
  const periodo = { inicio: new Date('2026-10-19T10:00:00Z'), fim: new Date('2026-10-19T13:00:00Z') };
  const r = await servico.buscarAnalise(shopping.id, periodo, { tipo: 'PCD', setorId: setor.id });
  assert.equal(r.resumo.ciclosCompletos, 1);
  assert.equal(r.resumo.permanenciaMediaMinutos, 60);
  await assert.rejects(servico.buscarAnalise(outro.id, periodo, { setorId: setor.id }), /Setor não encontrado/);

  // Setores homônimos em andares distintos mantêm linhas históricas separadas.
  const andar2 = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: 'G2', ordem: 2 } });
  const setor2 = await prisma.setor.create({ data: { shoppingId: shopping.id, andarId: andar2.id, nome: 'A' } });
  const vaga2 = await prisma.vaga.create({ data: { shoppingId: shopping.id, andarId: andar2.id, setorId: setor2.id, codigo: 'G2-A01', tipo: 'PCD' } });
  await prisma.historicoVaga.create({ data: { shoppingId: shopping.id, vagaId: vaga2.id, eventoId: 'outro-andar', estado: 'LIVRE', efetivoEm: periodo.inicio, recebidoEm: periodo.inicio, origem: 'TESTE', motivo: 'TESTE' } });
  const combinado = await servico.buscarAnalise(shopping.id, periodo, { tipo: 'PCD' });
  assert.deepEqual(new Set(combinado.porSetor.map(s => s.setor)), new Set(['G1 / A', 'G2 / A']));
});
