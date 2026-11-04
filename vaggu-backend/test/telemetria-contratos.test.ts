// Valida o contrato público do ESP32 sem depender de banco ou de uma placa física.
import test from 'node:test';
import assert from 'node:assert/strict';
import { extrairChaveDispositivo, validarHeartbeat, validarMensagemEstados } from '../src/telemetria/contratos.js';

const base = {
  placaCodigo: 'PLACA-001',
  inicializacaoId: 'inicio-teste-001',
  sequencia: 0,
  capturadoEm: '2026-09-28T12:00:00.000Z',
};

test('aceita heartbeat e lote de estados do contrato P06', () => {
  assert.deepEqual(validarHeartbeat(base), base);
  assert.equal(validarMensagemEstados({
    ...base,
    leituras: [{ sensorCodigo: 'PLACA-001-S01', estadoDetectado: 'OCUPADA' }],
  }).leituras[0]?.estadoDetectado, 'OCUPADA');
});

test('rejeita sensor repetido e estado que maquie leitura inválida como livre', () => {
  assert.throws(() => validarMensagemEstados({
    ...base,
    leituras: [
      { sensorCodigo: 'PLACA-001-S01', estadoDetectado: 'LIVRE' },
      { sensorCodigo: 'PLACA-001-S01', estadoDetectado: 'OCUPADA' },
    ],
  }), { name: 'Error' });
  assert.throws(() => validarMensagemEstados({
    ...base,
    leituras: [{ sensorCodigo: 'PLACA-001-S01', estadoDetectado: 'ERRO' }],
  }), { name: 'Error' });
});

test('exige credencial Device somente no cabeçalho', () => {
  assert.equal(extrairChaveDispositivo('Device segredo-seguro-123'), 'segredo-seguro-123');
  for (const valor of [undefined, 'Bearer segredo-seguro-123', 'Device curta']) {
    assert.throws(() => extrairChaveDispositivo(valor), { name: 'Error' });
  }
});
