// Cenários P04 em PostgreSQL real: hierarquia, mapa concorrente e isolamento do gerente.
import assert from 'node:assert/strict';
import type { TestContext } from 'node:test';
import type { PrismaClient, Shopping } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createAuthService } from '../src/auth/service.js';
import { createEstruturaService } from '../src/estrutura/service.js';
import { createShoppingsService } from '../src/shoppings/service.js';
import { hashPassword } from '../src/auth/password.js';

/** Verifica CA08–CA12 sem depender de telemetria ainda inexistente. */
export async function runEstruturaCases(t: TestContext, prisma: PrismaClient, shoppingA: Shopping, shoppingB: Shopping, senhaAdmin: string) {
  const auth = createAuthService(prisma); const estrutura = createEstruturaService(prisma);
  const app = createApp({ checkDatabase: () => prisma.$queryRaw`SELECT 1`, auth, estrutura, shoppings: createShoppingsService(prisma) });
  const admin = await request(app).post('/api/v1/auth/login').send({ email: 'vaggu@example.com', senha: senhaAdmin }).expect(200);
  const adminHeader = { Authorization: `Bearer ${admin.body.token}` };
  let andarA1: string; let andarA2: string; let andarB: string; let vagaA: string; let vagaB: string;

  await t.test('Admin configura dois andares, setores e tipos de vaga', async () => {
    const criarAndar = async (shoppingId: string, nome: string, ordem: number) => (await request(app).post(`/api/v1/shoppings/${shoppingId}/andares`).set(adminHeader).send({ nome, ordem }).expect(201)).body.andar.id;
    andarA1 = await criarAndar(shoppingA.id, 'Térreo', 0); andarA2 = await criarAndar(shoppingA.id, 'Subsolo 1', 1); andarB = await criarAndar(shoppingB.id, 'Térreo', 0);
    const setorA = (await request(app).post(`/api/v1/andares/${andarA1}/setores`).set(adminHeader).send({ nome: 'Setor A' }).expect(201)).body.setor.id;
    const setorB = (await request(app).post(`/api/v1/andares/${andarB}/setores`).set(adminHeader).send({ nome: 'Setor B' }).expect(201)).body.setor.id;
    vagaA = (await request(app).post(`/api/v1/setores/${setorA}/vagas`).set(adminHeader).send({ codigo: 'P04-A-PCD', tipo: 'PCD' }).expect(201)).body.vaga.id;
    vagaB = (await request(app).post(`/api/v1/setores/${setorB}/vagas`).set(adminHeader).send({ codigo: 'P04-B-ELETRICA', tipo: 'ELETRICA' }).expect(201)).body.vaga.id;
    const resposta = await request(app).get(`/api/v1/shoppings/${shoppingA.id}/estrutura`).set(adminHeader).expect(200);
    assert.equal(resposta.body.andares.length, 2); assert.equal(resposta.body.andares[0].setores[0].vagas[0].tipo, 'PCD');
    assert.equal(resposta.body.shopping.situacaoImplantacao, 'EM_CONFIGURACAO');
  });

  await t.test('mapa rejeita vaga de outro andar e preserva a revisão', async () => {
    const posicao = (vagaId: string) => ({ vagaId, x: 0.1, y: 0.2, largura: 0.08, altura: 0.12, rotacao: 0 });
    await request(app).patch(`/api/v1/andares/${andarA1}/mapa`).set(adminHeader).send({ revisao: 0, posicoes: [posicao(vagaB)] }).expect(400);
    assert.equal((await prisma.andar.findUniqueOrThrow({ where: { id: andarA1 } })).revisaoMapa, 0);
    await request(app).patch(`/api/v1/andares/${andarA1}/mapa`).set(adminHeader).send({ revisao: 0, posicoes: [posicao(vagaA)] }).expect(200);
    const vaga = await prisma.vaga.findUniqueOrThrow({ where: { id: vagaA } }); assert.equal(Number(vaga.posicaoX), 0.1);
  });

  await t.test('revisão impede sobrescrita silenciosa do mapa', async () => {
    const corpo = { revisao: 1, posicoes: [{ vagaId: vagaA, x: 0.2, y: 0.2, largura: 0.08, altura: 0.12, rotacao: 90 }] };
    await request(app).patch(`/api/v1/andares/${andarA1}/mapa`).set(adminHeader).send(corpo).expect(200);
    const conflito = await request(app).patch(`/api/v1/andares/${andarA1}/mapa`).set(adminHeader).send(corpo).expect(409);
    assert.equal(conflito.body.erro.codigo, 'MAPA_DESATUALIZADO');
  });

  await t.test('gerente vê configuração e somente a estrutura do próprio shopping', async () => {
    const senhaHash = await hashPassword('SenhaEstruturaP04!');
    await prisma.usuario.create({ data: { nome: 'Gerente estrutura A', email: 'estrutura.a@example.test', senhaHash, perfil: 'SHOPPING', shoppingId: shoppingA.id } });
    const login = await request(app).post('/api/v1/auth/login').send({ email: 'estrutura.a@example.test', senha: 'SenhaEstruturaP04!' }).expect(200);
    const resposta = await request(app).get('/api/v1/estacionamento/estrutura').set('Authorization', `Bearer ${login.body.token}`).expect(200);
    assert.equal(resposta.body.shopping.id, shoppingA.id); assert.equal(resposta.body.shopping.situacaoImplantacao, 'EM_CONFIGURACAO');
    assert.ok(resposta.text.includes('P04-A-PCD')); assert.ok(!resposta.text.includes('P04-B-ELETRICA'));
    assert.ok(resposta.body.andares.some((andar: { id: string }) => andar.id === andarA2)); assert.ok(!resposta.text.includes(andarB));
  });
}
