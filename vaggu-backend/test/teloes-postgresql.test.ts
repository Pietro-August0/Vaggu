import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { createTeloesService, agregarTelao } from '../src/teloes/service.js';
import request from 'supertest';
import { createApp } from '../src/app.js';

test('telão conta somente leituras operantes e categorias não duplicam total', () => {
  const vaga = { ativo: true, tipo: 'PCD', estadoAtual: 'LIVRE', monitoramento: { situacao: 'OPERANDO' } };
  const resultado = agregarTelao({ shopping: { nome: 'Teste' }, andares: [{ id: 'a', nome: 'A', ativo: true, setores: [{ id: 's', nome: 'S', ativo: true, vagas: [vaga, { ...vaga, monitoramento: { situacao: 'MANUTENCAO' } }, { ...vaga, ativo: false }] }] }] }, null, null);
  assert.equal(resultado.total, 2);
  assert.equal(resultado.livres, 1);
  assert.equal(resultado.parcial, true);
  assert.equal(resultado.categorias[0].livres, 1);
});

test('telão identifica a tela geral e por andar e nunca amplia recorte ausente', () => {
  const estrutura = { shopping: { nome: 'Teste' }, andares: [
    { id: 'a', nome: 'G1', ativo: true, setores: [{ id: 's', nome: 'A', ativo: true, vagas: [{ ativo: true, tipo: 'PCD', estadoAtual: 'LIVRE', monitoramento: { situacao: 'OPERANDO' } }] }] },
    { id: 'b', nome: 'G2', ativo: true, setores: [{ id: 't', nome: 'B', ativo: true, vagas: [{ ativo: true, tipo: 'IDOSO', estadoAtual: 'OCUPADA', monitoramento: { situacao: 'OPERANDO' } }] }] },
  ] };
  assert.equal(agregarTelao(estrutura, null, null).escopo.tipo, 'GERAL');
  const andar = agregarTelao(estrutura, 'b', null);
  assert.deepEqual(andar.escopo, { tipo: 'ANDAR', nome: 'G2' });
  assert.equal(andar.total, 1);
  assert.equal(andar.livres, 0);
  assert.deepEqual(andar.grupos.map(g => g.nome), ['B']);
  assert.equal(agregarTelao(estrutura, 'a', 's').escopo.tipo, 'SETOR');
  assert.throws(() => agregarTelao(estrutura, 'desconhecido', null), /não está disponível/);
  assert.throws(() => agregarTelao(estrutura, 'a', 't'), /não está disponível/);
});

test('rotas do gerente derivam shopping da sessão e recusam perfis e sessão provisória', async () => {
  const chamadas: unknown[][] = [];
  const servico = {
    listar: async (...args: unknown[]) => { chamadas.push(args); return { teloes: [] }; },
    criar: async (...args: unknown[]) => { chamadas.push(args); return { telao: { id: 'instalacao' }, chave: 'emissao' }; },
    editar: async (...args: unknown[]) => { chamadas.push(args); return { telao: { id: 'instalacao' } }; },
    revogar: async (...args: unknown[]) => { chamadas.push(args); return { revogado: true }; },
    excluir: async (...args: unknown[]) => { chamadas.push(args); return { excluido: true }; },
    consultar: async () => ({}),
  } as unknown as ReturnType<typeof createTeloesService>;
  const auth = { authenticate: async (header: string) => ({ usuario: { perfil: header === 'Bearer admin' ? 'VAGGU' : 'SHOPPING', shoppingId: 'shopping-da-sessao', trocarSenhaObrigatoria: header === 'Bearer provisoria' } }) };
  const app = createApp({ checkDatabase: () => 1, auth, teloes: servico });
  await request(app).get('/api/v1/estacionamento/teloes?shoppingId=outro').set('Authorization', 'Bearer gerente').expect(200);
  await request(app).post('/api/v1/estacionamento/teloes').set('Authorization', 'Bearer gerente').send({ nome: 'Entrada', shoppingId: 'outro' }).expect(201);
  await request(app).patch('/api/v1/estacionamento/teloes/instalacao').set('Authorization', 'Bearer gerente').send({ andarId: null, shoppingId: 'outro' }).expect(200);
  await request(app).delete('/api/v1/estacionamento/teloes/instalacao?shoppingId=outro').set('Authorization', 'Bearer gerente').expect(200);
  await request(app).delete('/api/v1/estacionamento/teloes/instalacao/cadastro?shoppingId=outro').set('Authorization', 'Bearer gerente').expect(200);
  assert.equal(chamadas.length, 5);
  assert.ok(chamadas.every(args => args[0] === 'shopping-da-sessao'));
  await request(app).get('/api/v1/estacionamento/teloes').set('Authorization', 'Bearer admin').expect(403);
  await request(app).patch('/api/v1/estacionamento/teloes/instalacao').set('Authorization', 'Bearer provisoria').send({ andarId: null }).expect(403);
  await request(app).patch('/api/v1/shoppings/outro/teloes/instalacao').set('Authorization', 'Bearer gerente').send({ andarId: null }).expect(403);
  await request(app).patch('/api/v1/estacionamento/teloes/instalacao').set('Authorization', 'Bearer gerente').send([]).expect(400);
  assert.equal(chamadas.length, 5);
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
  const andarProprio = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: 'G1', ordem: 1 } });
  const setor = await prisma.setor.create({ data: { shoppingId: shopping.id, andarId: andarProprio.id, nome: 'A' } });
  await assert.rejects(service.editar(outro.id, criado.telao.id, { nome: 'Intrusão' }), /não encontrado/);
  await assert.rejects(service.editar(shopping.id, criado.telao.id, { andarId: andar.id }), /incompatível/);
  await assert.rejects(service.editar(shopping.id, criado.telao.id, { andarId: false }), /Identificador/);
  await assert.rejects(service.editar(shopping.id, criado.telao.id, {}), /Informe/);
  await assert.rejects(service.editar(shopping.id, criado.telao.id, { nome: '' }), /Informe/);
  await service.editar(shopping.id, criado.telao.id, { andarId: andarProprio.id, setorId: setor.id });
  const hashAntes = (await prisma.telao.findUniqueOrThrow({ where: { id: criado.telao.id } })).chaveHash;
  const atualizado = await service.editar(shopping.id, criado.telao.id, { nome: 'Saída', andarId: andarProprio.id });
  assert.equal(atualizado.telao.setorId, null);
  const porAndar = await service.consultar(criado.telao.id, `Telao ${criado.chave}`);
  assert.equal(porAndar.nome, 'Saída');
  assert.equal(porAndar.escopo.nome, 'G1');
  assert.equal((await prisma.telao.findUniqueOrThrow({ where: { id: criado.telao.id } })).chaveHash, hashAntes);
  await service.editar(shopping.id, criado.telao.id, { andarId: null });
  assert.equal((await service.consultar(criado.telao.id, `Telao ${criado.chave}`)).escopo.tipo, 'GERAL');
  await prisma.andar.update({ where: { id: andarProprio.id }, data: { ativo: false } });
  await assert.rejects(service.editar(shopping.id, criado.telao.id, { andarId: andarProprio.id }), /incompatível/);
  await assert.rejects(service.revogar(outro.id, criado.telao.id), /não encontrado/);
  await service.revogar(shopping.id, criado.telao.id);
  await assert.rejects(service.editar(shopping.id, criado.telao.id, { nome: 'Reativar' }), /revogado/);
  await assert.rejects(service.consultar(criado.telao.id, `Telao ${criado.chave}`), /revogada/);
  await assert.rejects(service.excluir(outro.id, criado.telao.id), /não encontrado/);
  await service.excluir(shopping.id, criado.telao.id);
  assert.equal(await prisma.telao.findUnique({ where: { id: criado.telao.id } }), null);
  const ativo = await service.criar(shopping.id, { nome: 'Ativo removível' });
  await service.excluir(shopping.id, ativo.telao.id);
  await assert.rejects(service.consultar(ativo.telao.id, `Telao ${ativo.chave}`), /revogada/);
});
