// Cenários administrativos sequenciais, com usuários fictícios no banco exclusivo do runner.
import assert from 'node:assert/strict';
import type { TestContext } from 'node:test';
import type { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createAuthService } from '../src/auth/service.js';
import { createShoppingsService } from '../src/shoppings/service.js';

/** Confere múltiplos gerentes, primeira senha e bloqueio individual após preparar o admin. */
export async function runAdminCases(t: TestContext, prisma: PrismaClient, senhaAdmin: string) {
  const auth = createAuthService(prisma);
  const shoppings = createShoppingsService(prisma);
  const app = createApp({ checkDatabase: () => prisma.$queryRaw`SELECT 1`, auth, shoppings });
  const adminLogin = await request(app).post('/api/v1/auth/login')
    .send({ email: 'vaggu@example.com', senha: senhaAdmin }).expect(200);
  const adminHeader = { Authorization: `Bearer ${adminLogin.body.token}` };

  await t.test('Admin cadastra shopping e dois gerentes com senhas individuais', async () => {
    const shoppingResponse = await request(app).post('/api/v1/shoppings')
      .set(adminHeader).send({ nome: 'Shopping Central', endereco: 'Rua de teste, 100' }).expect(201);
    const shopping = shoppingResponse.body.shopping;
    assert.equal(shopping.nome, 'Shopping Central');
    assert.equal(shopping.totalGerentes, 0);

    const gerenteA = await request(app).post(`/api/v1/shoppings/${shopping.id}/gerentes`)
      .set(adminHeader).send({
        nome: 'Gerente A',
        email: 'gerente.a@example.com',
        telefone: '+55 11 90000-0001',
      }).expect(201);
    const gerenteB = await request(app).post(`/api/v1/shoppings/${shopping.id}/gerentes`)
      .set(adminHeader).send({
        nome: 'Gerente B',
        email: 'gerente.b@example.com',
        telefone: '+55 11 90000-0002',
      }).expect(201);

    assert.notEqual(gerenteA.body.senhaProvisoria, gerenteB.body.senhaProvisoria);
    assert.equal(gerenteA.body.gerente.shoppingId, shopping.id);
    assert.equal(gerenteA.body.gerente.ativo, true);
    assert.equal(gerenteA.body.gerente.trocarSenhaObrigatoria, true);
    assert.equal(gerenteA.body.gerente.senhaHash, undefined);

    const list = await request(app).get(`/api/v1/shoppings/${shopping.id}/gerentes`)
      .set(adminHeader).expect(200);
    assert.equal(list.body.gerentes.length, 2);
  });

  await t.test('senha provisória bloqueia área administrativa e troca libera a sessão', async () => {
    const login = await request(app).post('/api/v1/auth/login')
      .send({ email: 'gerente.a@example.com', senha: 'SenhaIncorretaTeste!' }).expect(401);
    assert.equal(login.body.erro.codigo, 'CREDENCIAIS_INVALIDAS');

    const gerente = await prisma.usuario.findUnique({ where: { email: 'gerente.a@example.com' } });
    assert.ok(gerente);
    const reset = await request(app).post(`/api/v1/gerentes/${gerente.id}/redefinir-senha`)
      .set(adminHeader).expect(200);
    const acessoProvisorio = await request(app).post('/api/v1/auth/login')
      .send({ email: 'gerente.a@example.com', senha: reset.body.senhaProvisoria }).expect(200);
    await request(app).get('/api/v1/shoppings')
      .set('Authorization', `Bearer ${acessoProvisorio.body.token}`).expect(403);

    const changed = await request(app).post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${acessoProvisorio.body.token}`)
      .send({ senhaAtual: reset.body.senhaProvisoria, novaSenha: 'SenhaDefinitivaGerenteA!' }).expect(200);
    assert.equal(changed.body.usuario.trocarSenhaObrigatoria, false);
    const stillNotAdmin = await request(app).get('/api/v1/shoppings')
      .set('Authorization', `Bearer ${acessoProvisorio.body.token}`).expect(403);
    assert.equal(stillNotAdmin.body.erro.codigo, 'ACESSO_NEGADO');
  });

  await t.test('bloquear um gerente invalida sua sessão sem suspender outro gerente', async () => {
    const gerenteA = await prisma.usuario.findUnique({ where: { email: 'gerente.a@example.com' } });
    const gerenteB = await prisma.usuario.findUnique({ where: { email: 'gerente.b@example.com' } });
    assert.ok(gerenteA);
    assert.ok(gerenteB);
    const redefinicaoB = await request(app).post(`/api/v1/gerentes/${gerenteB.id}/redefinir-senha`)
      .set(adminHeader).expect(200);
    const tokenA = (await request(app).post('/api/v1/auth/login')
      .send({ email: 'gerente.a@example.com', senha: 'SenhaDefinitivaGerenteA!' }).expect(200)).body.token;
    const tokenB = (await request(app).post('/api/v1/auth/login')
      .send({ email: 'gerente.b@example.com', senha: redefinicaoB.body.senhaProvisoria }).expect(200)).body.token;

    await request(app).patch(`/api/v1/gerentes/${gerenteA.id}`)
      .set(adminHeader).send({ ativo: false }).expect(200);
    assert.equal(await prisma.sessao.count({ where: { usuarioId: gerenteA.id } }), 0);
    await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${tokenA}`).expect(401);
    const gerenteBMe = await request(app).get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tokenB}`).expect(200);
    assert.equal(gerenteBMe.body.usuario.email, 'gerente.b@example.com');
  });
}
