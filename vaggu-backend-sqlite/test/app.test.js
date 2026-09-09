import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp({ checkDatabase: async () => 1 });

test('health responde sem consultar o banco', async () => {
  let called = false;
  const localApp = createApp({ checkDatabase: async () => { called = true; } });
  const response = await request(localApp).get('/api/v1/health').expect(200);
  assert.deepEqual(response.body, { status: 'ok', servico: 'vaggu-api' });
  assert.equal(called, false);
  assert.equal(response.headers['x-powered-by'], undefined);
});

test('readiness confirma a consulta ao banco', async () => {
  let calls = 0;
  const localApp = createApp({ checkDatabase: async () => { calls += 1; } });
  const response = await request(localApp).get('/api/v1/health/ready').expect(200);
  assert.equal(calls, 1);
  assert.equal(response.body.banco, 'conectado');
  assert.equal(response.headers['cache-control'], 'no-store');
});

test('readiness devolve 503 sem vazar erro interno', async () => {
  const localApp = createApp({ checkDatabase: async () => { throw new Error('SEGREDO_DO_BANCO'); } });
  const response = await request(localApp).get('/api/v1/health/ready').expect(503);
  assert.equal(response.body.erro.codigo, 'BANCO_INDISPONIVEL');
  assert.ok(!response.text.includes('SEGREDO_DO_BANCO'));
});

test('rota de negócio ainda não existe e não expõe dados', async () => {
  const response = await request(app).get('/api/v1/shoppings').expect(404);
  assert.equal(response.body.erro.codigo, 'ROTA_NAO_ENCONTRADA');
});

test('JSON inválido retorna 400', async () => {
  const response = await request(app).post('/api/v1/shoppings')
    .set('Content-Type', 'application/json').send('{').expect(400);
  assert.equal(response.body.erro.codigo, 'JSON_INVALIDO');
});

test('corpo acima do limite retorna 413', async () => {
  const response = await request(app).post('/api/v1/shoppings')
    .send({ valor: 'x'.repeat(40000) }).expect(413);
  assert.equal(response.body.erro.codigo, 'CORPO_MUITO_GRANDE');
});
