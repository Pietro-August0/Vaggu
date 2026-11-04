// Confere ponderação temporal, estado vazio e isolamento HTTP da análise histórica.
import test from 'node:test';
import assert from 'node:assert/strict';
test('cobertura incompatível com capacidade atual fica indisponível', () => {
  const inicio = new Date('2026-10-01T00:00:00Z'), fim = new Date('2026-10-01T01:00:00Z');
  const intervalo = { setor: 'A', estado: 'LIVRE' as const, inicioEm: inicio, fimEm: fim, entradaObservada: false };
  const resultado = calcularAnaliseHistorica([intervalo, intervalo], inicio, fim, { total: 1, porSetor: new Map([['A', 1]]) });
  assert.equal(resultado.resumo.coberturaPercentual, null);
  assert.equal(resultado.porDia[0].coberturaPercentual, null);
  assert.equal(resultado.porSetor[0].coberturaPercentual, null);
});

test('histórico sem capacidade ativa atual não produz cobertura estimada', () => {
  const inicio = new Date('2026-10-01T00:00:00Z'), fim = new Date('2026-10-01T01:00:00Z');
  const resultado = calcularAnaliseHistorica([
    { setor: 'Térreo / A', estado: 'LIVRE', inicioEm: inicio, fimEm: fim, entradaObservada: false },
  ], inicio, fim, { total: 0, porSetor: new Map() });
  assert.equal(resultado.resumo.coberturaPercentual, null);
  assert.equal(resultado.porDia[0].coberturaPercentual, null);
  assert.equal(resultado.porSetor[0].coberturaPercentual, null);
});
import request from 'supertest';
import { calcularAnaliseHistorica, createAnaliticosService } from '../src/analiticos/service.js';
import { createApp } from '../src/app.js';

const inicio = new Date('2026-09-01T00:00:00.000Z');
const fim = new Date('2026-09-08T00:00:00.000Z');

test('calcula ocupação e cobertura sem tratar indisponibilidade como livre', () => {
  const resultado = calcularAnaliseHistorica([
    { setor: 'A', estado: 'OCUPADA', inicioEm: inicio, fimEm: new Date('2026-09-01T01:00:00Z'), entradaObservada: true },
    { setor: 'A', estado: 'LIVRE', inicioEm: new Date('2026-09-01T01:00:00Z'), fimEm: new Date('2026-09-01T02:00:00Z'), entradaObservada: false },
    { setor: 'A', estado: 'INDISPONIVEL', inicioEm: new Date('2026-09-01T02:00:00Z'), fimEm: new Date('2026-09-01T03:00:00Z'), entradaObservada: false },
  ], inicio, fim);
  assert.equal(resultado.temHistorico, true);
  assert.equal(resultado.resumo.ocupacaoPercentual, 50);
  assert.equal(resultado.resumo.coberturaPercentual, 66.67);
  assert.equal(resultado.resumo.entradasObservadas, 1);
  assert.equal(resultado.porDia[0]?.entradasObservadas, 1);
});

test('retorna estado vazio quando ainda não existem intervalos confirmados', () => {
  const resultado = calcularAnaliseHistorica([], inicio, fim);
  assert.equal(resultado.temHistorico, false);
  assert.equal(resultado.resumo.ocupacaoPercentual, null);
  assert.deepEqual(resultado.porDia, []);
});

test('gera um bucket por dia civil UTC no período escolhido', () => {
  const resultado = calcularAnaliseHistorica([
    { setor: 'A', estado: 'OCUPADA', inicioEm: new Date('2026-09-30T23:00:00Z'),
      fimEm: new Date('2026-10-01T01:00:00Z'), entradaObservada: true },
  ], new Date('2026-09-30T00:00:00Z'), new Date('2026-10-02T00:00:00Z'));
  assert.deepEqual(resultado.porDia.map((dia) => dia.inicioEm), [
    '2026-09-30T00:00:00.000Z', '2026-10-01T00:00:00.000Z',
  ]);
  assert.deepEqual(resultado.porDia.map((dia) => dia.entradasObservadas), [1, 0]);
});

test('inclui vagas ativas sem leitura no denominador da cobertura', () => {
  const fimCurto = new Date('2026-09-01T02:00:00.000Z');
  const resultado = calcularAnaliseHistorica([
    { setor: 'A', estado: 'LIVRE', inicioEm: inicio, fimEm: fimCurto, entradaObservada: false },
  ], inicio, fimCurto, { total: 2, porSetor: new Map([['A', 2]]) });
  assert.equal(resultado.resumo.coberturaPercentual, 50);
  assert.equal(resultado.porSetor[0].coberturaPercentual, 50);
});

test('limita o dia atual ao instante da consulta no cálculo da cobertura', async () => {
  const agora = new Date('2026-10-14T12:00:00.000Z');
  const banco = {
    $queryRaw: async () => [{ setor: 'A', estado: 'LIVRE',
      inicioEm: new Date('2026-10-14T00:00:00.000Z'), fimEm: agora, entradaObservada: false }],
    vaga: { findMany: async () => [{ setor: { nome: 'A' } }] },
  };
  const servico = createAnaliticosService(banco as never, () => agora);
  const resultado = await servico.buscarAnalise('11111111-1111-4111-8111-111111111111', {
    inicio: new Date('2026-10-14T00:00:00.000Z'), fim: new Date('2026-10-15T00:00:00.000Z'),
  });
  assert.equal(resultado.periodo.fimEm, agora.toISOString());
  assert.equal(resultado.resumo.coberturaPercentual, 100);
  assert.equal(resultado.porDia[0]?.coberturaPercentual, 100);
});

test('padrão também termina agora e rejeita período inteiramente futuro', async () => {
  const agora = new Date('2026-10-14T12:00:00.000Z');
  const banco = { $queryRaw: async () => [], vaga: { findMany: async () => [] } };
  const servico = createAnaliticosService(banco as never, () => agora);
  const padrao = await servico.buscarAnalise('11111111-1111-4111-8111-111111111111');
  assert.equal(padrao.periodo.inicioEm, '2026-10-08T00:00:00.000Z');
  assert.equal(padrao.periodo.fimEm, agora.toISOString());
  await assert.rejects(
    servico.buscarAnalise('11111111-1111-4111-8111-111111111111', {
      inicio: new Date('2026-10-15T00:00:00.000Z'), fim: new Date('2026-10-16T00:00:00.000Z'),
    }),
    { codigo: 'PERIODO_INVALIDO' },
  );
});

test('rota usa exclusivamente o shopping da sessão', async () => {
  let shoppingConsultado = '';
  const usuario = { perfil: 'SHOPPING', shoppingId: '11111111-1111-4111-8111-111111111111', trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async (shoppingId: string) => {
    shoppingConsultado = shoppingId;
    return { temHistorico: false, periodo: {}, resumo: {}, porDia: [], porSetor: [] };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos, estrutura: {}, importacao: {} });
  const resposta = await request(app).get('/api/v1/estacionamento/analise?shoppingId=outro')
    .set('Authorization', 'Bearer teste').expect(200);
  assert.equal(shoppingConsultado, '11111111-1111-4111-8111-111111111111');
  assert.equal(resposta.headers['cache-control'], 'no-store');
});

test('Admin consulta somente o shopping indicado na rota administrativa', async () => {
  let shoppingConsultado = '';
  const usuario = { perfil: 'VAGGU', shoppingId: null, trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async (shoppingId: string) => {
    shoppingConsultado = shoppingId;
    return { temHistorico: false, periodo: {}, resumo: {}, porDia: [], porSetor: [] };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
  await request(app).get('/api/v1/shoppings/22222222-2222-4222-8222-222222222222/analise')
    .set('Authorization', 'Bearer teste').expect(200);
  assert.equal(shoppingConsultado, '22222222-2222-4222-8222-222222222222');
});

test('gerente não pode consultar a análise administrativa de outro shopping', async () => {
  let consultas = 0;
  const usuario = { perfil: 'SHOPPING', shoppingId: '11111111-1111-4111-8111-111111111111', trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async () => { consultas += 1; return {}; } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
  await request(app).get('/api/v1/shoppings/22222222-2222-4222-8222-222222222222/analise')
    .set('Authorization', 'Bearer teste').expect(403);
  assert.equal(consultas, 0);
});

test('gerente filtra datas sem alterar o shopping da sessão', async () => {
  let parametros: unknown[] = [];
  const usuario = { perfil: 'SHOPPING', shoppingId: '11111111-1111-4111-8111-111111111111', trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async (...args: unknown[]) => {
    parametros = args;
    return { temHistorico: false, periodo: {}, resumo: {}, porDia: [], porSetor: [] };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
  await request(app).get('/api/v1/estacionamento/analise?shoppingId=outro&inicio=2026-09-30&fim=2026-10-01')
    .set('Authorization', 'Bearer teste').expect(200);
  assert.equal(parametros[0], usuario.shoppingId);
  assert.deepEqual(parametros[1], {
    inicio: new Date('2026-09-30T00:00:00Z'), fim: new Date('2026-10-02T00:00:00Z'),
  });
});

test('Admin usa o mesmo filtro na rota administrativa', async () => {
  let periodo: unknown;
  const usuario = { perfil: 'VAGGU', shoppingId: null, trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async (_shoppingId: string, filtro: unknown) => {
    periodo = filtro;
    return {};
  } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
  await request(app).get('/api/v1/shoppings/22222222-2222-4222-8222-222222222222/analise?inicio=2026-10-01&fim=2026-10-01')
    .set('Authorization', 'Bearer teste').expect(200);
  assert.deepEqual(periodo, {
    inicio: new Date('2026-10-01T00:00:00Z'), fim: new Date('2026-10-02T00:00:00Z'),
  });
});

test('rejeita data impossível, intervalo invertido e período superior a 31 dias', async () => {
  let consultas = 0;
  const usuario = { perfil: 'SHOPPING', shoppingId: '11111111-1111-4111-8111-111111111111', trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async () => { consultas += 1; return {}; } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
  for (const query of [
    'inicio=2026-02-30&fim=2026-03-01',
    'inicio=2026-10-02&fim=2026-10-01',
    'inicio=2026-09-01&fim=2026-10-02',
    'inicio=2026-09-01',
  ]) {
    const resposta = await request(app).get(`/api/v1/estacionamento/analise?${query}`)
      .set('Authorization', 'Bearer teste').expect(400);
    assert.equal(resposta.body.erro.codigo, 'PERIODO_INVALIDO');
  }
  assert.equal(consultas, 0);
});

test('cobertura zero não vira ocupação zero, mas vaga livre observada continua em zero', () => {
  const inicio = new Date('2026-10-01T00:00:00Z'), fim = new Date('2026-10-01T01:00:00Z');
  const base = { setor: 'A', inicioEm: inicio, fimEm: fim, entradaObservada: false };
  const semLeitura = calcularAnaliseHistorica([{ ...base, estado: 'INDISPONIVEL' }], inicio, fim);
  assert.equal(semLeitura.temHistorico, true);
  assert.equal(semLeitura.resumo.ocupacaoPercentual, null);
  assert.equal(semLeitura.resumo.coberturaPercentual, 0);
  assert.equal(semLeitura.porDia[0].ocupacaoPercentual, null);
  assert.equal(semLeitura.porSetor[0].ocupacaoPercentual, null);
  assert.equal(calcularAnaliseHistorica([{ ...base, estado: 'LIVRE' }], inicio, fim).resumo.ocupacaoPercentual, 0);
});

test('permanência inclui ciclo completo iniciado antes do período e exclui falha e ciclo aberto', () => {
  const inicio = new Date('2026-10-01T10:00:00Z'), fim = new Date('2026-10-01T12:00:00Z');
  const intervalos = [
    { setor: 'A', estado: 'OCUPADA' as const, inicioEm: new Date('2026-10-01T09:00:00Z'), fimEm: new Date('2026-10-01T11:00:00Z'), entradaObservada: true, saidaObservada: true },
    { setor: 'A', estado: 'OCUPADA' as const, inicioEm: inicio, fimEm: fim, entradaObservada: true, saidaObservada: false },
    { setor: 'A', estado: 'OCUPADA' as const, inicioEm: inicio, fimEm: new Date('2026-10-01T11:00:00Z'), entradaObservada: false, saidaObservada: true },
  ];
  const r = calcularAnaliseHistorica(intervalos, inicio, fim, { total: 3, porSetor: new Map([['A', 3]]) });
  assert.equal(r.resumo.saidasObservadas, 2);
  assert.equal(r.resumo.ciclosCompletos, 1);
  assert.equal(r.resumo.permanenciaMediaMinutos, 120);
  assert.equal(r.resumo.entradasObservadas, 1);
  assert.equal(r.resumo.rotatividadeObservada, 0.33);
});

test('rejeita filtros inválidos e preserva setor/categoria no contrato', async () => {
  const shoppingId = '11111111-1111-4111-8111-111111111111';
  const setorId = '22222222-2222-4222-8222-222222222222';
  let filtros: unknown;
  const auth = { authenticate: async () => ({ usuario: { perfil: 'SHOPPING', shoppingId, trocarSenhaObrigatoria: false } }) };
  const app = createApp({ checkDatabase: () => 1, auth, analiticos: { buscarAnalise: async (_id: string, _periodo: unknown, f: unknown) => { filtros = f; return {}; } } });
  for (const query of ['tipo=MOTO', 'setorId=outro', 'tipo=PCD&tipo=IDOSO']) await request(app).get(`/api/v1/estacionamento/analise?${query}`).expect(400);
  await request(app).get(`/api/v1/estacionamento/analise?setorId=${setorId}&tipo=PCD`).expect(200);
  assert.deepEqual(filtros, { setorId, tipo: 'PCD' });
});
