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
  let agoraAdministrativa = new Date();
  const credencialSecret = 'segredo-fixo-exclusivo-dos-testes-de-integracao';
  const shoppings = createShoppingsService(prisma, { now: () => agoraAdministrativa, credencialSecret });
  const app = createApp({ checkDatabase: () => prisma.$queryRaw`SELECT 1`, auth, shoppings });
  const adminLogin = await request(app).post('/api/v1/auth/login')
    .send({ email: 'vaggu@example.com', senha: senhaAdmin }).expect(200);
  const adminHeader = { Authorization: `Bearer ${adminLogin.body.token}` };
  let shoppingCentralId = '';

  await t.test('Admin cadastra shopping e dois gerentes com senhas individuais', async () => {
    const shoppingResponse = await request(app).post('/api/v1/shoppings')
      .set(adminHeader).send({
        nome: 'Shopping Central', cnpj: '12.345.678/0001-90', responsavelNome: 'Ana Responsável',
        emailCorporativo: 'contato@shopping.example', telefone: '+55 11 90000-0000', cep: '01001-000',
        uf: 'sp', cidade: 'São Paulo', bairro: 'Centro', logradouro: 'Rua de teste', numero: '100',
        horarioAbertura: '06:00', horarioFechamento: '23:59', fusoHorario: 'America/Sao_Paulo',
      }).expect(201);
    const shopping = shoppingResponse.body.shopping;
    shoppingCentralId = shopping.id;
    assert.equal(shopping.nome, 'Shopping Central');
    assert.equal(shopping.totalGerentes, 0);
    assert.equal(shopping.cnpj, '12345678000190');
    assert.equal(shopping.cep, '01001000');
    assert.equal(shopping.uf, 'SP');

    const ficha = await request(app).get(`/api/v1/shoppings/${shopping.id}`)
      .set(adminHeader).expect(200);
    assert.equal(ficha.body.shopping.responsavelNome, 'Ana Responsável');
    const atualizada = await request(app).patch(`/api/v1/shoppings/${shopping.id}`)
      .set(adminHeader).send({ bairro: 'Bela Vista', horarioAbertura: '07:00' }).expect(200);
    assert.equal(atualizada.body.shopping.bairro, 'Bela Vista');
    assert.equal(atualizada.body.shopping.horarioAbertura, '07:00');

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
    assert.equal(list.body.gerentes.find((item) => item.id === gerenteA.body.gerente.id).senhaProvisoria, gerenteA.body.senhaProvisoria);
    const persistido = await prisma.usuario.findUniqueOrThrow({ where: { id: gerenteA.body.gerente.id } });
    assert.ok(persistido.senhaProvisoriaProtegida);
    assert.notEqual(persistido.senhaProvisoriaProtegida, gerenteA.body.senhaProvisoria);
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
      .send({ senhaAtual: reset.body.senhaProvisoria, novaSenha: 'SenhaDefinitivaGerenteA1!' }).expect(200);
    assert.equal(changed.body.usuario.trocarSenhaObrigatoria, false);
    const listaDepoisDaTroca = await request(app).get(`/api/v1/shoppings/${gerente.shoppingId}/gerentes`)
      .set(adminHeader).expect(200);
    const gerenteDepoisDaTroca = listaDepoisDaTroca.body.gerentes.find((item) => item.id === gerente.id);
    assert.equal(gerenteDepoisDaTroca.senhaProvisoria, null);
    assert.equal(gerenteDepoisDaTroca.trocarSenhaObrigatoria, false);
    assert.equal((await prisma.usuario.findUniqueOrThrow({ where: { id: gerente.id } })).senhaProvisoriaProtegida, null);
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
      .send({ email: 'gerente.a@example.com', senha: 'SenhaDefinitivaGerenteA1!' }).expect(200)).body.token;
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

  await t.test('excluir gerente encerra acesso, permite desfazer por sete segundos e preserva identidade', async () => {
    const gerenteB = await prisma.usuario.findUnique({ where: { email: 'gerente.b@example.com' } });
    assert.ok(gerenteB);

    const exclusao = await request(app).delete(`/api/v1/gerentes/${gerenteB.id}`)
      .set(adminHeader).expect(200);
    assert.equal(exclusao.body.gerente.ativo, false);
    assert.equal(await prisma.sessao.count({ where: { usuarioId: gerenteB.id } }), 0);
    const listaSemGerente = await request(app).get(`/api/v1/shoppings/${gerenteB.shoppingId}/gerentes`)
      .set(adminHeader).expect(200);
    assert.equal(listaSemGerente.body.gerentes.some((item) => item.id === gerenteB.id), false);

    const restauracao = await request(app).post(`/api/v1/gerentes/${gerenteB.id}/desfazer-exclusao`)
      .set(adminHeader).expect(200);
    assert.equal(restauracao.body.gerente.id, gerenteB.id);
    assert.equal(restauracao.body.gerente.ativo, true);

    await request(app).delete(`/api/v1/gerentes/${gerenteB.id}`).set(adminHeader).expect(200);
    agoraAdministrativa = new Date(agoraAdministrativa.getTime() + 8_001);
    const expirado = await request(app).post(`/api/v1/gerentes/${gerenteB.id}/desfazer-exclusao`)
      .set(adminHeader).expect(409);
    assert.equal(expirado.body.erro.codigo, 'PRAZO_DESFAZER_EXPIRADO');

    const recriado = await request(app).post(`/api/v1/shoppings/${gerenteB.shoppingId}/gerentes`)
      .set(adminHeader).send({ nome: 'Gerente B corrigido', email: gerenteB.email }).expect(201);
    assert.equal(recriado.body.gerente.id, gerenteB.id);
    assert.equal(recriado.body.gerente.nome, 'Gerente B corrigido');

    const gerenteA = await prisma.usuario.findUniqueOrThrow({ where: { email: 'gerente.a@example.com' } });
    await request(app).delete(`/api/v1/gerentes/${gerenteA.id}`).set(adminHeader).expect(200);
    const bloqueadoRestaurado = await request(app).post(`/api/v1/gerentes/${gerenteA.id}/desfazer-exclusao`)
      .set(adminHeader).expect(200);
    assert.equal(bloqueadoRestaurado.body.gerente.ativo, false);
  });

  await t.test('excluir shopping oculta a operação, encerra acessos e preserva os registros', async () => {
    const gerente = await prisma.usuario.findFirstOrThrow({
      where: { shoppingId: shoppingCentralId, perfil: 'SHOPPING', excluidoEm: null },
    });
    const reset = await request(app).post(`/api/v1/gerentes/${gerente.id}/redefinir-senha`)
      .set(adminHeader).expect(200);
    const login = await request(app).post('/api/v1/auth/login')
      .send({ email: gerente.email, senha: reset.body.senhaProvisoria }).expect(200);

    await request(app).delete(`/api/v1/shoppings/${shoppingCentralId}`)
      .set(adminHeader).expect(200);

    const shoppingPreservado = await prisma.shopping.findUniqueOrThrow({ where: { id: shoppingCentralId } });
    assert.equal(shoppingPreservado.ativo, false);
    assert.ok(shoppingPreservado.excluidoEm);
    assert.ok(await prisma.usuario.count({ where: { shoppingId: shoppingCentralId } }));
    assert.equal(await prisma.sessao.count({ where: { usuario: { shoppingId: shoppingCentralId } } }), 0);
    await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${login.body.token}`).expect(401);
    const lista = await request(app).get('/api/v1/shoppings').set(adminHeader).expect(200);
    assert.equal(lista.body.shoppings.some((item) => item.id === shoppingCentralId), false);
    await request(app).get(`/api/v1/shoppings/${shoppingCentralId}/gerentes`).set(adminHeader).expect(404);
  });
}
