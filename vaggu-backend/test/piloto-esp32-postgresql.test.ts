// Provisionamento é exercitado somente em banco descartável, nunca na conexão do piloto hospedado.
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { criarPilotoEsp32 } from '../src/telemetria/piloto.js';
import { verifyPassword } from '../src/auth/password.js';
import { createEstruturaService } from '../src/estrutura/service.js';

const url = process.env.TEST_DATABASE_URL;
test('piloto cria três vagas isoladas, hashes e gerente; repetição não redefine ou duplica', {
  skip: url ? false : 'PENDENTE: configure TEST_DATABASE_URL para testar provisionamento do piloto.',
}, async t => {
  if (!url) throw new Error('TEST_DATABASE_URL ausente.');
  const p = await prepararBancoDeTeste(t, url);
  const anterior = await p.shopping.create({ data: { nome: 'Shopping já existente' } });
  const resultado = await criarPilotoEsp32(p);
  assert.notEqual(resultado.shoppingId, anterior.id);
  const placa = await p.dispositivo.findUniqueOrThrow({ where: { codigo: resultado.codigo } });
  assert.ok(await verifyPassword(resultado.chave, placa.chaveApiHash));
  assert.notEqual(placa.chaveApiHash, resultado.chave);
  const gerente = await p.usuario.findUniqueOrThrow({ where: { email: resultado.email } });
  assert.equal(gerente.shoppingId, resultado.shoppingId);
  assert.equal(gerente.perfil, 'SHOPPING');
  assert.equal(gerente.trocarSenhaObrigatoria, true);
  assert.ok(await verifyPassword(resultado.senhaProvisoria, gerente.senhaHash));
  const estrutura = await createEstruturaService(p, 120000).buscarEstrutura(resultado.shoppingId);
  const vagas = estrutura.andares.flatMap(a => a.setores.flatMap(s => s.vagas));
  assert.deepEqual(vagas.map(v => v.codigo), ['P01', 'P02', 'P03']);
  assert.ok(vagas.every(v => v.estadoAtual === 'INDISPONIVEL' && v.monitoramento?.placaCodigo === resultado.codigo));
  assert.doesNotMatch(JSON.stringify(estrutura), /chaveApiHash|senhaHash|senhaProvisoria/);
  assert.equal(await p.vaga.count({ where: { shoppingId: anterior.id } }), 0);
  await assert.rejects(() => criarPilotoEsp32(p), /já existe/);
  assert.equal(await p.shopping.count(), 2);
  assert.equal(await p.vaga.count(), 3);
  assert.equal(await p.sensor.count(), 3);
  assert.equal((await p.dispositivo.findUniqueOrThrow({ where: { id: placa.id } })).chaveApiHash, placa.chaveApiHash);
});
