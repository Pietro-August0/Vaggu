import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { createTeloesService, agregarTelao } from '../src/teloes/service.js';

test('telão conta somente leituras operantes e categorias não duplicam total', () => {
  const vaga = { ativo: true, tipo: 'PCD', estadoAtual: 'LIVRE', monitoramento: { situacao: 'OPERANDO' } };
  const resultado = agregarTelao({ shopping: { nome: 'Teste' }, andares: [{ id: 'a', nome: 'A', ativo: true, setores: [{ id: 's', nome: 'S', ativo: true, vagas: [vaga, { ...vaga, monitoramento: { situacao: 'MANUTENCAO' } }, { ...vaga, ativo: false }] }] }] }, null, null);
  assert.equal(resultado.total, 2);
  assert.equal(resultado.livres, 1);
  assert.equal(resultado.parcial, true);
  assert.equal(resultado.categorias[0].livres, 1);
});

const url = process.env.TEST_DATABASE_URL;
test('telão isola recortes e credenciais, oculta segredos e revoga acesso', { skip: url ? false : 'Configure TEST_DATABASE_URL.' }, async t => {
  const prisma = await prepararBancoDeTeste(t, url!);
  const shopping = await prisma.shopping.create({ data: { nome: 'Teste telão' } });
  const outro = await prisma.shopping.create({ data: { nome: 'Outro' } });
  const andar = await prisma.andar.create({ data: { shoppingId: outro.id, nome: 'G1', ordem: 1 } });
  const service = createTeloesService(prisma, 120_000);
  await assert.rejects(service.criar(shopping.id, { nome: 'Inválido', andarId: andar.id }), /incompatível/);
  const criado = await service.criar(shopping.id, { nome: 'Entrada' });
  const lista = JSON.stringify(await service.listar(shopping.id));
  assert.equal(lista.includes(criado.chave), false);
  assert.equal(lista.includes('chaveHash'), false);
  await assert.rejects(service.consultar(criado.telao.id), /credencial/);
  await assert.rejects(service.consultar(criado.telao.id, `Telao ${'x'.repeat(43)}`), /inválida/);
  const dados = await service.consultar(criado.telao.id, `Telao ${criado.chave}`);
  assert.equal(dados.shopping, shopping.nome);
  assert.equal(dados.total, 0);
  await assert.rejects(service.revogar(outro.id, criado.telao.id), /não encontrado/);
  await service.revogar(shopping.id, criado.telao.id);
  await assert.rejects(service.consultar(criado.telao.id, `Telao ${criado.chave}`), /revogada/);
});
