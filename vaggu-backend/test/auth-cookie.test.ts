// Verifica o transporte da sessão por cookie sem depender de PostgreSQL real.
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const token = 'a'.repeat(43);
const expiraEm = new Date(Date.now() + 60_000);
const usuario = { id: 'usuario', nome: 'Admin', email: 'admin@example.com', perfil: 'VAGGU', shoppingId: null, trocarSenhaObrigatoria: false };

test('navegador restaura a sessão pelo cookie HttpOnly e revoga no logout', async () => {
  let revogada = false;
  const auth = {
    login: async () => ({ token, tipo: 'Bearer', expiraEm, usuario }),
    authenticate: async (header: string) => {
      assert.equal(header, `Bearer ${token}`);
      return { sessionId: 'sessao', usuario, expiraEm };
    },
    logout: async () => { revogada = true; },
  };
  const app = createApp({ checkDatabase: async () => 1, auth });
  const login = await request(app).post('/api/v1/auth/login').set('X-VAGGU-Request', '1')
    .send({ email: usuario.email, senha: 'senha-de-teste' }).expect(200);
  assert.equal(login.body.token, undefined);
  const cookie = login.headers['set-cookie']?.[0];
  assert.match(cookie, /vaggu_sessao=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  const identificador = cookie.split(';')[0];
  const identidade = await request(app).get('/api/v1/auth/me').set('Cookie', identificador).expect(200);
  assert.equal(identidade.body.usuario.email, usuario.email);
  assert.ok(identidade.body.expiraEm);
  await request(app).post('/api/v1/auth/logout').set('Cookie', identificador).expect(403);
  const saida = await request(app).post('/api/v1/auth/logout').set('Cookie', identificador)
    .set('X-VAGGU-Request', '1').expect(204);
  assert.equal(revogada, true);
  assert.match(saida.headers['set-cookie']?.[0], /vaggu_sessao=;/);
});
