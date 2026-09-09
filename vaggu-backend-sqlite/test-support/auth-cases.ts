import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createAuthService, digestToken } from '../src/auth/service.js';
import { hashPassword, verifyPassword } from '../src/auth/password.js';
import { requireAuth, requirePerfil, shoppingScope, loginLimiter } from '../src/auth/middleware.js';
import { createInitialAdmin } from '../src/auth/bootstrap.js';
import { createContaService } from '../src/conta/service.js';

export async function runAuthCases(t, prisma, shoppingA, shoppingB) {
  const password = 'SenhaFicticiaSomenteTeste!';
  const senhaHash = await hashPassword(password);
  await prisma.usuario.updateMany({ data: { senhaHash } });
  const auth = createAuthService(prisma);
  const conta = createContaService(prisma);
  const newApp = () => createApp({ checkDatabase: () => prisma.$queryRaw`SELECT 1`, auth, conta });
  const app = newApp();
  const login = (email = 'vaggu@example.com') => request(newApp())
    .post('/api/v1/auth/login').send({ email, senha: password });
  const me = (token) => request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
  let adminToken;
  let shoppingToken;

  await t.test('hash usa sal aleatório e não aceita senha incorreta ou hash inválido', async () => {
    assert.notEqual(await hashPassword(password), senhaHash);
    assert.equal(await verifyPassword(password, senhaHash), true);
    assert.equal(await verifyPassword('senha errada', senhaHash), false);
    assert.equal(await verifyPassword(password, 'hash inválido'), false);
    await assert.rejects(() => hashPassword('curta'));
  });

  await t.test('login VAGGU normaliza e-mail, não aceita perfil enviado e armazena só hash do token', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: ' VAGGU@EXAMPLE.COM ', senha: password, perfil: 'SHOPPING', shoppingId: shoppingB.id,
    }).expect(200);
    adminToken = response.body.token;
    assert.match(adminToken, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(response.body.usuario.perfil, 'VAGGU');
    assert.equal(response.body.usuario.shoppingId, null);
    assert.equal(response.body.usuario.senhaHash, undefined);
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.headers['set-cookie'], undefined);
    const session = await prisma.sessao.findUnique({ where: { tokenHash: digestToken(adminToken) } });
    assert.ok(session);
    assert.ok(!JSON.stringify(session).includes(adminToken));
  });

  await t.test('senha incorreta e e-mail inexistente dão a mesma resposta', async () => {
    const responses = [];
    for (const email of ['vaggu@example.com', 'naoexiste@example.com']) {
      responses.push(await request(app).post('/api/v1/auth/login')
        .send({ email, senha: 'errada' }).expect(401));
    }
    assert.deepEqual(responses[0].body, responses[1].body);
  });

  await t.test('login valida corpo, tipos, e-mail e tamanho da senha', async () => {
    for (const body of [{}, { email: 'errado', senha: password },
      { email: 'vaggu@example.com', senha: {} }, { email: 'vaggu@example.com', senha: 'x'.repeat(129) }]) {
      await request(newApp()).post('/api/v1/auth/login').send(body).expect(400);
    }
  });

  await t.test('me exige Bearer válido e não aceita token por query', async () => {
    await request(app).get(`/api/v1/auth/me?token=${adminToken}`).expect(401);
    await me('inventado').expect(401);
    await me('a'.repeat(43)).expect(401);
    const response = await me(adminToken).expect(200);
    assert.equal(response.body.usuario.email, 'vaggu@example.com');
    assert.deepEqual(Object.keys(response.body.usuario).sort(), [
      'email', 'id', 'nome', 'perfil', 'shoppingId', 'telefone', 'trocarSenhaObrigatoria',
    ]);
  });

  await t.test('conta SHOPPING recebe seu vínculo vindo do banco', async () => {
    const response = await login('shopping@example.com').expect(200);
    shoppingToken = response.body.token;
    assert.equal(response.body.usuario.perfil, 'SHOPPING');
    assert.equal(response.body.usuario.shoppingId, shoppingA.id);
  });

  await t.test('minha conta permite dados pessoais sem aceitar perfil ou shopping forjados', async () => {
    const before = await request(app).get('/api/v1/minha-conta')
      .set('Authorization', `Bearer ${shoppingToken}`).expect(200);
    assert.equal(before.body.usuario.shoppingId, shoppingA.id);

    const changed = await request(app).patch('/api/v1/minha-conta')
      .set('Authorization', `Bearer ${shoppingToken}`)
      .send({
        nome: 'Gerente Atualizado',
        telefone: '+55 11 91111-1111',
        perfil: 'VAGGU',
        shoppingId: shoppingB.id,
        email: 'forjado@example.com',
      }).expect(200);
    assert.equal(changed.body.usuario.nome, 'Gerente Atualizado');
    assert.equal(changed.body.usuario.telefone, '+55 11 91111-1111');
    assert.equal(changed.body.usuario.perfil, 'SHOPPING');
    assert.equal(changed.body.usuario.shoppingId, shoppingA.id);
    assert.equal(changed.body.usuario.email, 'shopping@example.com');
  });

  await t.test('senha provisória exige troca e não permanece válida depois da alteração', async () => {
    const senhaProvisoria = 'SenhaProvisoriaTeste!';
    const senhaNova = 'NovaSenhaDefinitivaTeste!';
    await prisma.usuario.create({ data: {
      nome: 'Gerente provisório',
      email: 'provisorio@example.com',
      senhaHash: await hashPassword(senhaProvisoria),
      perfil: 'SHOPPING',
      shoppingId: shoppingA.id,
      trocarSenhaObrigatoria: true,
    } });
    const loginProvisorio = await request(app).post('/api/v1/auth/login')
      .send({ email: 'provisorio@example.com', senha: senhaProvisoria }).expect(200);
    assert.equal(loginProvisorio.body.usuario.trocarSenhaObrigatoria, true);
    await request(app).post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${loginProvisorio.body.token}`)
      .send({ senhaAtual: 'errada', novaSenha: senhaNova }).expect(401);
    await request(app).post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${loginProvisorio.body.token}`)
      .send({ senhaAtual: senhaProvisoria, novaSenha: 'curta' }).expect(400);
    const changed = await request(app).post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${loginProvisorio.body.token}`)
      .send({ senhaAtual: senhaProvisoria, novaSenha: senhaNova }).expect(200);
    assert.equal(changed.body.usuario.trocarSenhaObrigatoria, false);
    await request(app).post('/api/v1/auth/login')
      .send({ email: 'provisorio@example.com', senha: senhaProvisoria }).expect(401);
    await request(app).post('/api/v1/auth/login')
      .send({ email: 'provisorio@example.com', senha: senhaNova }).expect(200);
  });

  // Rotas de teste somente aqui, nunca montadas na API entregue.
  const guarded = express();
  guarded.get('/admin', requireAuth(auth), requirePerfil('VAGGU'), (_req, res) => res.json({ ok: true }));
  guarded.get('/vagas', requireAuth(auth), shoppingScope, async (_req, res) => {
    res.json(await prisma.vaga.findMany({ where: { shoppingId: res.locals.shoppingId }, select: { codigo: true } }));
  });
  guarded.use((error, _req, res, _next) => res.status(error.status ?? 500).json({ codigo: error.codigo }));

  await t.test('middleware permite admin e bloqueia SHOPPING em operação administrativa', async () => {
    await request(guarded).get('/admin').expect(401);
    await request(guarded).get('/admin').set('Authorization', `Bearer ${adminToken}`).expect(200);
    await request(guarded).get('/admin').set('Authorization', `Bearer ${shoppingToken}`).expect(403);
  });

  await t.test('escopo ignora shoppingId forjado e só consulta vagas do shopping autenticado', async () => {
    const foreign = await prisma.vaga.create({ data: { shoppingId: shoppingB.id, codigo: 'SEGREDO-B' } });
    const response = await request(guarded).get(`/vagas?shoppingId=${shoppingB.id}`)
      .set('Authorization', `Bearer ${shoppingToken}`).expect(200);
    assert.ok(response.body.some((vaga) => vaga.codigo === 'A01'));
    assert.ok(!response.text.includes('SEGREDO-B'));
    await request(guarded).get('/vagas').set('Authorization', `Bearer ${adminToken}`).expect(403);
    await prisma.vaga.delete({ where: { id: foreign.id } });
  });

  await t.test('desativar usuário bloqueia sessão existente e novo login', async () => {
    await prisma.usuario.update({ where: { email: 'shopping@example.com' }, data: { ativo: false } });
    await me(shoppingToken).expect(401);
    await login('shopping@example.com').expect(401);
    await prisma.usuario.update({ where: { email: 'shopping@example.com' }, data: { ativo: true } });
  });

  await t.test('desativar shopping bloqueia sessão e login de seu usuário', async () => {
    await prisma.shopping.update({ where: { id: shoppingA.id }, data: { ativo: false } });
    await me(shoppingToken).expect(401);
    await login('shopping@example.com').expect(401);
    await prisma.shopping.update({ where: { id: shoppingA.id }, data: { ativo: true } });
  });

  await t.test('sessão persistida continua válida com nova instância do serviço', async () => {
    const another = createApp({ checkDatabase: async () => 1, auth: createAuthService(prisma) });
    await request(another).get('/api/v1/auth/me').set('Authorization', `Bearer ${adminToken}`).expect(200);
  });

  await t.test('sessão expirada é recusada e limpa no próximo login', async () => {
    const response = await login().expect(200);
    const tokenHash = digestToken(response.body.token);
    await prisma.sessao.update({ where: { tokenHash }, data: { expiraEm: new Date(0) } });
    await me(response.body.token).expect(401);
    await login().expect(200);
    assert.equal(await prisma.sessao.findUnique({ where: { tokenHash } }), null);
  });

  await t.test('logout revoga somente a sessão usada e token não pode ser reutilizado', async () => {
    await request(app).post('/api/v1/auth/logout').set('Authorization', `Bearer ${adminToken}`).expect(204);
    await me(adminToken).expect(401);
    await me(shoppingToken).expect(200);
    await request(app).post('/api/v1/auth/logout').set('Authorization', `Bearer ${adminToken}`).expect(401);
  });

  await t.test('login limita tentativas por IP e devolve Retry-After', async () => {
    const limited = newApp();
    for (let n = 0; n < 10; n++) await request(limited).post('/api/v1/auth/login').send({}).expect(400);
    const response = await request(limited).post('/api/v1/auth/login').send({}).expect(429);
    assert.ok(Number(response.headers['retry-after']) > 0);
  });

  await t.test('janela do limitador vence sem bloquear permanentemente', async () => {
    let clock = 0;
    const limited = express();
    limited.get('/', loginLimiter({ now: () => clock, limit: 1, windowMs: 1000 }), (_req, res) => res.sendStatus(200));
    limited.use((error, _req, res, _next) => res.sendStatus(error.status ?? 500));
    await request(limited).get('/').expect(200);
    await request(limited).get('/').expect(429);
    clock = 1001;
    await request(limited).get('/').expect(200);
  });

  await t.test('erro de banco no login não vaza detalhes', async () => {
    const broken = createApp({ checkDatabase: async () => 1, auth: createAuthService({
      usuario: { findUnique: async () => { throw new Error('SEGREDO_INTERNO'); } },
    }) });
    const response = await request(broken).post('/api/v1/auth/login')
      .send({ email: 'vaggu@example.com', senha: password }).expect(500);
    assert.ok(!response.text.includes('SEGREDO_INTERNO'));
  });

  await t.test('bootstrap não sobrescreve administrador existente', async () => {
    await assert.rejects(() => createInitialAdmin(prisma, { nome: 'Outro admin', email: 'outro@example.com' }),
      (error: any) => error.codigo === 'ADMIN_JA_EXISTE');
    assert.equal(await prisma.usuario.count({ where: { perfil: 'VAGGU' } }), 1);
  });
}
