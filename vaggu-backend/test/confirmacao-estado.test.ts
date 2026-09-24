// Confere o núcleo temporal do P06 sem conexão com banco, hardware ou relógio real.
import test from 'node:test';
import assert from 'node:assert/strict';
import { criarConfirmacaoEstado, observarEstado } from '../src/telemetria/confirmacao-estado.js';

const lacunaMaximaMs = 15_000;

test('confirma apenas após observações consistentes durante trinta segundos', () => {
  const inicial = criarConfirmacaoEstado();
  const primeira = observarEstado(inicial, { estado: 'LIVRE', recebidoEmMs: 0 }, lacunaMaximaMs);
  const segunda = observarEstado(primeira.proximo, { estado: 'LIVRE', recebidoEmMs: 15_000 }, lacunaMaximaMs);
  const terceira = observarEstado(segunda.proximo, { estado: 'LIVRE', recebidoEmMs: 30_000 }, lacunaMaximaMs);

  assert.equal(primeira.situacao, 'PENDENTE');
  assert.equal(segunda.proximo.estadoConfirmado, 'DESCONHECIDA');
  assert.equal(terceira.situacao, 'CONFIRMADA');
  assert.equal(terceira.proximo.estadoConfirmado, 'LIVRE');
  assert.equal(terceira.proximo.candidato, null);
  assert.equal(inicial.estadoConfirmado, 'DESCONHECIDA');
});

test('uma leitura isolada não confirma ao avançar o relógio', () => {
  const primeira = observarEstado(criarConfirmacaoEstado(), { estado: 'OCUPADA', recebidoEmMs: 1_000 }, lacunaMaximaMs);
  assert.equal(primeira.proximo.estadoConfirmado, 'DESCONHECIDA');
  assert.equal(primeira.proximo.candidato?.iniciadoEmMs, 1_000);

  const atrasada = observarEstado(primeira.proximo, { estado: 'OCUPADA', recebidoEmMs: 31_000 }, lacunaMaximaMs);
  assert.equal(atrasada.situacao, 'PENDENTE');
  assert.equal(atrasada.proximo.candidato?.iniciadoEmMs, 31_000);
});

test('alternância de estado reinicia a janela de confirmação', () => {
  const primeira = observarEstado(criarConfirmacaoEstado(), { estado: 'LIVRE', recebidoEmMs: 0 }, lacunaMaximaMs);
  const alternada = observarEstado(primeira.proximo, { estado: 'OCUPADA', recebidoEmMs: 10_000 }, lacunaMaximaMs);
  const continua = observarEstado(alternada.proximo, { estado: 'OCUPADA', recebidoEmMs: 25_000 }, lacunaMaximaMs);

  assert.equal(alternada.proximo.candidato?.iniciadoEmMs, 10_000);
  assert.equal(continua.proximo.estadoConfirmado, 'DESCONHECIDA');
  assert.equal(continua.situacao, 'PENDENTE');
});

test('observação igual ao estado confirmado cancela o candidato oposto', () => {
  const inicial = criarConfirmacaoEstado('LIVRE');
  const ocupada = observarEstado(inicial, { estado: 'OCUPADA', recebidoEmMs: 0 }, lacunaMaximaMs);
  const livre = observarEstado(ocupada.proximo, { estado: 'LIVRE', recebidoEmMs: 10_000 }, lacunaMaximaMs);

  assert.equal(livre.situacao, 'SEM_MUDANCA');
  assert.equal(livre.proximo.candidato, null);
  assert.equal(livre.proximo.estadoConfirmado, 'LIVRE');
});

test('ignora instante antigo ou repetido sem prolongar a janela', () => {
  const primeira = observarEstado(criarConfirmacaoEstado(), { estado: 'LIVRE', recebidoEmMs: 5_000 }, lacunaMaximaMs);
  const repetida = observarEstado(primeira.proximo, { estado: 'LIVRE', recebidoEmMs: 5_000 }, lacunaMaximaMs);
  const antiga = observarEstado(primeira.proximo, { estado: 'OCUPADA', recebidoEmMs: 4_000 }, lacunaMaximaMs);

  assert.equal(repetida.situacao, 'IGNORADA');
  assert.equal(antiga.situacao, 'IGNORADA');
  assert.deepEqual(repetida.proximo, primeira.proximo);
  assert.deepEqual(antiga.proximo, primeira.proximo);
});

test('exige lacuna menor que a janela para impedir confirmação após silêncio', () => {
  assert.throws(() => observarEstado(criarConfirmacaoEstado(), { estado: 'LIVRE', recebidoEmMs: 0 }, 30_000), RangeError);
  assert.throws(() => observarEstado(criarConfirmacaoEstado(), { estado: 'LIVRE', recebidoEmMs: -1 }, lacunaMaximaMs), RangeError);
});
