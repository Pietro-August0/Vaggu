// Confere ponderação temporal, estado vazio e isolamento HTTP da análise histórica.
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { calcularAnaliseHistorica } from '../src/analiticos/service.js';
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
});

test('retorna estado vazio quando ainda não existem intervalos confirmados', () => {
  const resultado = calcularAnaliseHistorica([], inicio, fim);
  assert.equal(resultado.temHistorico, false);
  assert.equal(resultado.resumo.ocupacaoPercentual, 0);
});

test('inclui vagas ativas sem leitura no denominador da cobertura', () => {
  const fimCurto = new Date('2026-09-01T02:00:00.000Z');
  const resultado = calcularAnaliseHistorica([
    { setor: 'A', estado: 'LIVRE', inicioEm: inicio, fimEm: fimCurto, entradaObservada: false },
  ], inicio, fimCurto, { total: 2, porSetor: new Map([['A', 2]]) });
  assert.equal(resultado.resumo.coberturaPercentual, 50);
  assert.equal(resultado.porSetor[0].coberturaPercentual, 50);
});

test('rota usa exclusivamente o shopping da sessão', async () => {
  let shoppingConsultado = '';
  const usuario = { perfil: 'SHOPPING', shoppingId: '11111111-1111-4111-8111-111111111111', trocarSenhaObrigatoria: false };
  const auth = { authenticate: async () => ({ sessionId: 'sessao', usuario }) };
  const analiticos = { buscarAnalise: async (shoppingId: string) => {
    shoppingConsultado = shoppingId;
    return { temHistorico: false, periodo: {}, resumo: {}, porDia: [], porSetor: [] };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth, analiticos });
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
