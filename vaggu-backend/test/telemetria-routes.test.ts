// Confere o transporte HTTP da placa; regras de domínio permanecem no serviço injetado.
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import type { TelemetriaHttpService } from '../src/telemetria/routes.js';

function appCom(telemetria: TelemetriaHttpService) {
  return createApp({ checkDatabase: () => true, telemetria });
}

test('retorna 202 para evento novo e encaminha credencial e corpo ao serviço', async () => {
  let recebido: { autorizacao?: string; corpo?: unknown } = {};
  const app = appCom({
    receberHeartbeat: async () => ({ status: 'PROCESSADO' }),
    receberEstados: async (autorizacao, corpo) => {
      recebido = { autorizacao, corpo };
      return { status: 'PROCESSADO', leituras: [] };
    },
  });
  const corpo = { placaCodigo: 'PLACA-001', inicializacaoId: 'inicio-teste-001', sequencia: 0, leituras: [] };
  const resposta = await request(app).post('/api/v1/telemetria/estados')
    .set('Authorization', 'Device segredo-seguro-123')
    .send(corpo);
  assert.equal(resposta.status, 202);
  assert.equal(recebido.autorizacao, 'Device segredo-seguro-123');
  assert.deepEqual(recebido.corpo, corpo);
});

test('duplicata idempotente responde 200 sem fingir novo processamento', async () => {
  const telemetria: TelemetriaHttpService = {
    receberHeartbeat: async () => ({ status: 'DUPLICADO' }),
    receberEstados: async () => ({ status: 'DUPLICADO' }),
  };
  const resposta = await request(appCom(telemetria)).post('/api/v1/telemetria/heartbeat').send({});
  assert.equal(resposta.status, 200);
  assert.equal(resposta.body.status, 'DUPLICADO');
});
