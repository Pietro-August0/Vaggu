// Testes HTTP da prévia de importação: autorização, transporte e consulta da persistência.
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { ApiError } from '../src/auth/service.js';

const usuarioAdmin = { perfil: 'VAGGU', trocarSenhaObrigatoria: false };
const auth = (usuario = usuarioAdmin) => ({ authenticate: async () => ({ sessionId: 'sessao', usuario }) });
const shoppingId = '11111111-1111-4111-8111-111111111111';
const importacaoId = '22222222-2222-4222-8222-222222222222';

test('Admin consulta uma prévia persistida sem permitir cache', async () => {
  let consulta: { shoppingId: string; importacaoId: string } | undefined;
  const importacao = { buscarPrevia: async (idShopping: string, idImportacao: string) => {
    consulta = { shoppingId: idShopping, importacaoId: idImportacao };
    return { id: idImportacao, shoppingId: idShopping, formato: 'CSV', previa: {}, criadoEm: new Date() };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth(), importacao });
  const resposta = await request(app).get(`/api/v1/shoppings/${shoppingId}/importacoes/${importacaoId}`)
    .set('Authorization', 'Bearer teste').expect(200);
  assert.deepEqual(consulta, { shoppingId, importacaoId });
  assert.equal(resposta.headers['cache-control'], 'no-store');
  assert.equal(resposta.body.id, importacaoId);
});

test('Admin envia CSV e recebe a prévia sem confirmação', async () => {
  let chamada: { shoppingId: string; conteudo: unknown } | undefined;
  const importacao = { criarPreviaCsv: async (id: string, conteudo: unknown) => {
    chamada = { shoppingId: id, conteudo };
    return { registros: [], erros: [], resumo: { totalLinhas: 0, registrosValidos: 0, totalErros: 0, novos: 0, atualizacoes: 0 }, podeConfirmar: false };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth(), importacao });
  const resposta = await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/previa-csv`)
    .set('Authorization', 'Bearer teste').set('Content-Type', 'text/csv').send('codigo,andar,setor,tipo').expect(200);
  assert.deepEqual(chamada, { shoppingId, conteudo: 'codigo,andar,setor,tipo' });
  assert.equal(resposta.body.podeConfirmar, false);
});

test('Admin confirma uma prévia persistida pela rota administrativa', async () => {
  let chamada: { shoppingId: string; importacaoId: string } | undefined;
  const importacao = { confirmarImportacao: async (idShopping: string, idImportacao: string) => {
    chamada = { shoppingId: idShopping, importacaoId: idImportacao };
    return { importacaoId: idImportacao, confirmadoEm: new Date(), resultado: { vagasCriadas: 1 }, idempotente: false };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth(), importacao });
  const resposta = await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/${importacaoId}/confirmar`)
    .set('Authorization', 'Bearer teste').expect(200);
  assert.deepEqual(chamada, { shoppingId, importacaoId });
  assert.equal(resposta.body.importacaoId, importacaoId);
  assert.equal(resposta.body.idempotente, false);
});

test('Gerente não pode confirmar importação estrutural', async () => {
  const importacao = { confirmarImportacao: async () => { throw new Error('não deveria executar'); } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth({ perfil: 'SHOPPING', trocarSenhaObrigatoria: false }), importacao });
  const resposta = await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/${importacaoId}/confirmar`)
    .set('Authorization', 'Bearer teste').expect(403);
  assert.equal(resposta.body.erro.codigo, 'ACESSO_NEGADO');
});

test('Gerente não pode gerar prévia administrativa', async () => {
  const importacao = { criarPreviaCsv: async () => { throw new Error('não deveria executar'); } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth({ perfil: 'SHOPPING', trocarSenhaObrigatoria: false }), importacao });
  const resposta = await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/previa-csv`)
    .set('Authorization', 'Bearer teste').set('Content-Type', 'text/csv').send('codigo,andar,setor,tipo').expect(403);
  assert.equal(resposta.body.erro.codigo, 'ACESSO_NEGADO');
});

test('conteúdo JSON é rejeitado como formato de importação', async () => {
  const importacao = { criarPreviaCsv: async (_id: string, conteudo: unknown) => {
    if (typeof conteudo !== 'string') {
      throw new ApiError(415, 'FORMATO_IMPORTACAO_INVALIDO', 'Envie o arquivo como text/csv ou text/plain.');
    }
  } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth(), importacao });
  await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/previa-csv`)
    .set('Authorization', 'Bearer teste').send({ codigo: 'A-001' }).expect(415);
});

test('Admin envia XLSX como corpo binário ao serviço de prévia', async () => {
  let recebido: unknown;
  const importacao = { criarPreviaXlsx: async (_id: string, conteudo: unknown) => {
    recebido = conteudo;
    return { registros: [], erros: [], resumo: { totalLinhas: 0, registrosValidos: 0, totalErros: 0, novos: 0, atualizacoes: 0 }, podeConfirmar: false };
  } };
  const app = createApp({ checkDatabase: async () => 1, auth: auth(), importacao });
  await request(app).post(`/api/v1/shoppings/${shoppingId}/importacoes/previa-xlsx`)
    .set('Authorization', 'Bearer teste')
    .set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    .send(Buffer.from('xlsx')).expect(200);
  assert.equal(Buffer.isBuffer(recebido), true);
});
