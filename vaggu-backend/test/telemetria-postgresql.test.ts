// Exercita P06 em PostgreSQL descartável: isolamento, confirmação, reenvio e expiração individual.
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararBancoDeTeste } from '../test-support/banco-de-teste.js';
import { hashPassword } from '../src/auth/password.js';
import { createTelemetriaService } from '../src/telemetria/service.js';
import { expirarSensores } from '../src/telemetria/expiracao.js';

const url = process.env.TEST_DATABASE_URL;
test('telemetria confirma após 30 s, deduplica e não usa heartbeat para renovar sensor', {
  skip: url ? false : 'PENDENTE: configure TEST_DATABASE_URL para testar a persistência do P06.',
}, async (t) => {
  if (!url) throw new Error('TEST_DATABASE_URL ausente.');
  const prisma = await prepararBancoDeTeste(t, url);
  const chave = 'ChaveFicticiaDispositivo!';
  const configuracao = { lacunaMaximaMs: 15_000, timeoutSensorMs: 120_000, timeoutPlacaMs: 120_000 };
  let instante = new Date('2026-09-28T12:00:00.000Z');
  const shopping = await prisma.shopping.create({ data: { nome: 'Shopping P06' } });
  const vaga = await prisma.vaga.create({ data: { shoppingId: shopping.id, codigo: 'A-001' } });
  const placa = await prisma.dispositivo.create({ data: {
    shoppingId: shopping.id,
    codigo: 'PLACA-P06',
    nome: 'Placa P06',
    chaveApiHash: await hashPassword(chave),
  } });
  const sensor = await prisma.sensor.create({ data: {
    shoppingId: shopping.id,
    dispositivoId: placa.id,
    vagaId: vaga.id,
    codigo: 'SENSOR-P06',
  } });
  const servico = createTelemetriaService(prisma, configuracao, { now: () => instante });
  const autorizacao = `Device ${chave}`;
  const base = { placaCodigo: 'PLACA-P06', inicializacaoId: 'inicio-p06-a' };

  for (const [sequencia, segundos] of [[0, 0], [1, 15], [2, 30]] as const) {
    instante = new Date(`2026-09-28T12:00:${String(segundos).padStart(2, '0')}.000Z`);
    await servico.receberEstados(autorizacao, {
      ...base,
      sequencia,
      leituras: [{ sensorCodigo: sensor.codigo, estadoDetectado: 'OCUPADA' }],
    });
  }
  assert.equal((await prisma.vaga.findUnique({ where: { id: vaga.id } }))?.estadoAtual, 'OCUPADA');
  assert.equal(await prisma.historicoVaga.count({ where: { vagaId: vaga.id } }), 1);

  const duplicado = await servico.receberEstados(autorizacao, {
    ...base,
    sequencia: 2,
    leituras: [{ sensorCodigo: sensor.codigo, estadoDetectado: 'OCUPADA' }],
  });
  assert.equal(duplicado.status, 'DUPLICADO');
  assert.equal(await prisma.historicoVaga.count({ where: { vagaId: vaga.id } }), 1);

  instante = new Date('2026-09-28T12:00:35.000Z');
  await servico.receberHeartbeat(autorizacao, { ...base, sequencia: 3 });
  const expirados = await expirarSensores(prisma, configuracao, new Date('2026-09-28T12:02:31.000Z'));
  assert.equal(expirados.length, 1);
  assert.equal((await prisma.vaga.findUnique({ where: { id: vaga.id } }))?.estadoAtual, 'INDISPONIVEL');
  assert.equal(await prisma.historicoVaga.count({ where: { vagaId: vaga.id } }), 2);
  assert.equal((await prisma.dispositivo.findUnique({ where: { id: placa.id } }))?.ultimoContatoEm?.toISOString(), instante.toISOString());
});
