import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createWhatsappService } from '../src/whatsapp/service.js';
import { signMetaPayload } from '../src/whatsapp/signature.js';
import { testMenuText } from '../src/whatsapp/payload.js';

const secret = 'segredo-ficticio';
const verifyToken = 'token-ficticio';

function jsonBuffer(value) {
  return Buffer.from(JSON.stringify(value));
}

function signedPost(app, body, appSecret = secret) {
  const raw = Buffer.isBuffer(body) ? body : jsonBuffer(body);
  return request(app)
    .post('/api/v1/whatsapp/webhook')
    .set('Content-Type', 'application/json')
    .set('X-Hub-Signature-256', signMetaPayload(raw, appSecret))
    .send(raw.toString('utf8'));
}

function messagePayload(messages) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'waba-1',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          messages,
        },
      }],
    }],
  };
}

function statusPayload(statuses) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'waba-1',
      changes: [{ field: 'messages', value: { statuses } }],
    }],
  };
}

function createFakePrisma() {
  const rows = new Map();
  return {
    rows,
    whatsappEvento: {
      async create({ data }) {
        if (rows.has(data.metaMessageId)) {
          const error = new Error('Unique constraint failed');
          error.code = 'P2002';
          throw error;
        }
        const row = {
          id: `evt-${rows.size + 1}`,
          erroCodigo: null,
          processadoEm: null,
          recebidoEm: new Date(),
          atualizadoEm: new Date(),
          ...data,
        };
        rows.set(data.metaMessageId, row);
        return row;
      },
      async findUnique({ where }) {
        return rows.get(where.metaMessageId) || null;
      },
      async update({ where, data }) {
        const row = [...rows.values()].find((item) => item.id === where.id);
        Object.assign(row, data, { atualizadoEm: new Date() });
        return row;
      },
      async updateMany({ where, data }) {
        const row = [...rows.values()].find((item) => item.id === where.id && item.status === where.status);
        if (!row) return { count: 0 };
        const { tentativas, ...rest } = data;
        Object.assign(row, rest, { atualizadoEm: new Date() });
        if (data.tentativas?.increment) row.tentativas += data.tentativas.increment;
        return { count: 1 };
      },
    },
  };
}

function createWhatsappApp({ autoReplyEnabled = false, sendText } = {}) {
  const prisma = createFakePrisma();
  const sent = [];
  const client = {
    async sendText(to, body) {
      sent.push({ to, body });
      if (sendText) return sendText(to, body);
      return { messages: [{ id: 'wamid.sent' }] };
    },
  };
  const config = { verifyToken, appSecret: secret, autoReplyEnabled };
  const service = createWhatsappService(prisma, client, config);
  return {
    app: createApp({
      checkDatabase: async () => 1,
      whatsapp: { config, service },
    }),
    prisma,
    sent,
  };
}

test('GET valido devolve o challenge exato', async () => {
  const { app } = createWhatsappApp();
  const response = await request(app)
    .get('/api/v1/whatsapp/webhook')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': verifyToken, 'hub.challenge': 'abc123' })
    .expect(200);

  assert.equal(response.text, 'abc123');
  assert.match(response.headers['content-type'], /^text\/plain/);
});

test('GET rejeita token incorreto, parametros ausentes e configuracao ausente', async () => {
  const { app } = createWhatsappApp();
  await request(app).get('/api/v1/whatsapp/webhook')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'errado', 'hub.challenge': 'abc123' })
    .expect(403);
  await request(app).get('/api/v1/whatsapp/webhook')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': verifyToken })
    .expect(400);

  const service = createWhatsappService(createFakePrisma(), { sendText: async () => ({}) }, {});
  const misconfigured = createApp({
    checkDatabase: async () => 1,
    whatsapp: { config: { verifyToken: '', appSecret: secret }, service },
  });
  await request(misconfigured).get('/api/v1/whatsapp/webhook')
    .query({ 'hub.mode': 'subscribe', 'hub.verify_token': '', 'hub.challenge': 'abc123' })
    .expect(503);
});

test('POST com assinatura valida e multiplas mensagens processa todas', async () => {
  const { app, prisma } = createWhatsappApp();
  await signedPost(app, messagePayload([
    { id: 'wamid.1', from: '5511999990001', type: 'text', text: { body: 'Oi' } },
    { id: 'wamid.2', from: '5511999990002', type: 'image', image: { id: 'midia' } },
  ])).expect(200);

  assert.equal(prisma.rows.get('wamid.1').status, 'PROCESSADO');
  assert.equal(prisma.rows.get('wamid.2').status, 'PROCESSADO');
});

test('POST rejeita assinatura ausente, malformada, incorreta e corpo alterado', async () => {
  const { app } = createWhatsappApp();
  const payload = messagePayload([{ id: 'wamid.3', from: '5511999990003', type: 'text', text: { body: 'Oi' } }]);
  const raw = jsonBuffer(payload);

  await request(app).post('/api/v1/whatsapp/webhook')
    .set('Content-Type', 'application/json')
    .send(raw.toString('utf8'))
    .expect(401);
  await request(app).post('/api/v1/whatsapp/webhook')
    .set('Content-Type', 'application/json')
    .set('X-Hub-Signature-256', 'sha256=abc')
    .send(raw.toString('utf8'))
    .expect(401);
  await signedPost(app, raw, 'segredo-errado').expect(401);

  const changed = jsonBuffer({ ...payload, extra: true });
  await request(app).post('/api/v1/whatsapp/webhook')
    .set('Content-Type', 'application/json')
    .set('X-Hub-Signature-256', signMetaPayload(raw, secret))
    .send(changed.toString('utf8'))
    .expect(401);
});

test('payload invalido nao derruba a aplicacao', async () => {
  const { app } = createWhatsappApp();
  await signedPost(app, Buffer.from('{')).expect(400);
  await signedPost(app, { object: 'whatsapp_business_account', entry: [{ changes: 'invalido' }] }).expect(200);
});

test('status de entrega nao gera resposta automatica', async () => {
  const { app, sent } = createWhatsappApp({ autoReplyEnabled: true });
  await signedPost(app, statusPayload([{ id: 'wamid.status', status: 'failed', errors: [{ code: 130497 }] }])).expect(200);
  assert.equal(sent.length, 0);
});

test('evento duplicado, inclusive concorrente, nao gera novo processamento normal', async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const { app, sent } = createWhatsappApp({
    autoReplyEnabled: true,
    sendText: async () => gate,
  });
  const payload = messagePayload([{ id: 'wamid.dup', from: '5511999990004', type: 'text', text: { body: 'MENU' } }]);

  const first = signedPost(app, payload);
  const second = signedPost(app, payload);
  release({});
  await Promise.all([first.expect(200), second.expect(200)]);
  assert.equal(sent.length, 1);

  await signedPost(app, payload).expect(200);
  assert.equal(sent.length, 1);
});

test('falha transitoria nao perde definitivamente o evento', async () => {
  let calls = 0;
  const { app, prisma } = createWhatsappApp({
    autoReplyEnabled: true,
    sendText: async () => {
      calls += 1;
      if (calls === 1) throw new Error('META_ENVIO_TIMEOUT');
      return {};
    },
  });
  const payload = messagePayload([{ id: 'wamid.retry', from: '5511999990005', type: 'text', text: { body: 'OI' } }]);

  await signedPost(app, payload).expect(500);
  assert.equal(prisma.rows.get('wamid.retry').status, 'FALHOU');
  await signedPost(app, payload).expect(200);
  assert.equal(prisma.rows.get('wamid.retry').status, 'PROCESSADO');
  assert.equal(prisma.rows.get('wamid.retry').tentativas, 2);
});

test('flag desativada impede envio e OI/MENU gera menu quando habilitado', async () => {
  const disabled = createWhatsappApp({ autoReplyEnabled: false });
  await signedPost(disabled.app, messagePayload([
    { id: 'wamid.off', from: '5511999990006', type: 'text', text: { body: 'OI' } },
  ])).expect(200);
  assert.equal(disabled.sent.length, 0);

  const enabled = createWhatsappApp({ autoReplyEnabled: true });
  await signedPost(enabled.app, messagePayload([
    { id: 'wamid.on', from: '5511999990007', type: 'text', text: { body: 'menu' } },
  ])).expect(200);
  assert.deepEqual(enabled.sent, [{ to: '5511999990007', body: testMenuText }]);
});

test('falha da Meta e timeout sao tratados sem expor credenciais', async () => {
  for (const error of [new Error('META_ENVIO_FALHOU:130497'), new Error('META_ENVIO_TIMEOUT')]) {
    const { app, prisma } = createWhatsappApp({
      autoReplyEnabled: true,
      sendText: async () => { throw error; },
    });
    const id = `wamid.${error.message}`;
    await signedPost(app, messagePayload([{ id, from: '5511999990008', type: 'text', text: { body: 'OI' } }])).expect(500);
    assert.equal(prisma.rows.get(id).status, 'FALHOU');
    assert.equal(prisma.rows.get(id).erroCodigo.includes(secret), false);
  }
});

test('rotas existentes continuam funcionando', async () => {
  const { app } = createWhatsappApp();
  const response = await request(app).get('/api/v1/health').expect(200);
  assert.equal(response.body.status, 'ok');
});
