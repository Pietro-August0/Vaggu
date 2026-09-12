// Executa os cenários HTTP de autenticação e administração em PostgreSQL descartável.
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste, validarUrlDeTeste } from '../test-support/banco-de-teste.js';
import { runAuthCases } from '../test-support/auth-cases.js';
import { runAdminCases } from '../test-support/admin-cases.js';
import { hashPassword } from '../src/auth/password.js';
import { runEstruturaCases } from '../test-support/estrutura-cases.js';

test('configuração de integração recusa banco comum e parâmetros que desviam a conexão', () => {
  for (const url of ['inválida', 'postgresql://localhost/vaggu', 'https://localhost/vaggu_teste',
    'postgresql://localhost/vaggu_teste?database=vaggu', 'postgresql://localhost/vaggu_teste#outro']) {
    assert.throws(() => validarUrlDeTeste(url));
  }
  assert.equal(validarUrlDeTeste('postgresql://localhost/vaggu_teste').pathname, '/vaggu_teste');
});

const urlDeTeste = process.env.TEST_DATABASE_URL;
test('integração de autenticação, primeira senha, gerentes e isolamento', {
  skip: urlDeTeste !== undefined ? false : 'PENDENTE: configure TEST_DATABASE_URL para executar com PostgreSQL real.',
}, async (t) => {
  if (!urlDeTeste) throw new Error('TEST_DATABASE_URL ausente.');
  const prisma = await prepararBancoDeTeste(t, urlDeTeste);
  const senha = 'SenhaFicticiaSomenteTeste!';
  const senhaHash = await hashPassword(senha);
  const shoppingA = await prisma.shopping.create({ data: { nome: 'Shopping de teste A' } });
  const shoppingB = await prisma.shopping.create({ data: { nome: 'Shopping de teste B' } });
  await prisma.usuario.createMany({ data: [
    { nome: 'Admin de teste', email: 'vaggu@example.com', senhaHash, perfil: 'VAGGU' },
    { nome: 'Gerente de teste', email: 'shopping@example.com', senhaHash, perfil: 'SHOPPING', shoppingId: shoppingA.id },
  ] });
  await prisma.vaga.create({ data: { shoppingId: shoppingA.id, codigo: 'A01' } });

  // Os casos dependem de etapas anteriores: login, troca e bloqueio devem executar em sequência.
  await runAuthCases(t, prisma, shoppingA, shoppingB);
  await runAdminCases(t, prisma, senha);
  await runEstruturaCases(t, prisma, shoppingA, shoppingB, senha);
});
