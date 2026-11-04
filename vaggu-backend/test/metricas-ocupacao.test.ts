// Valida o conjunto sintético do Power BI sem acessar hardware ou banco persistente.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  calcularMetricasOcupacao,
  conjuntoControladoPowerBi,
  conjuntoDemonstracaoPowerBi,
  gerarCsvConjuntoControlado,
} from '../src/analiticos/conjunto-controlado.js';

test('reproduz as métricas controladas de duas vagas durante uma hora', () => {
  const metricas = calcularMetricasOcupacao(conjuntoControladoPowerBi);

  assert.equal(metricas.tempoAtivoSegundos, 7_200);
  assert.equal(metricas.tempoOcupadoSegundos, 3_600);
  assert.equal(metricas.tempoLivreSegundos, 2_400);
  assert.equal(metricas.tempoIndisponivelSegundos, 1_200);
  assert.equal(metricas.tempoConhecidoSegundos, 6_000);
  assert.equal(metricas.ocupacaoPercentual, 60);
  assert.ok(Math.abs(metricas.coberturaPercentual - 83.33333333333334) < 0.000001);
  assert.equal(metricas.entradasObservadas, 1);
  assert.equal(metricas.duracaoCompletaObservadaSegundos, 1_800);
  assert.equal(metricas.ocupacaoAtualPercentual, 0);
});

test('mantém o CSV versionado igual ao conjunto tipado', async () => {
  const caminho = resolve('test/fixtures/power-bi/conjunto-controlado-ocupacao.csv');
  const csvVersionado = await readFile(caminho, 'utf8');
  assert.equal(csvVersionado.replaceAll('\r\n', '\n'), gerarCsvConjuntoControlado(conjuntoControladoPowerBi));
});

test('mantém a demonstração ampliada reproduzível e com todos os recortes esperados', async () => {
  const caminho = resolve('test/fixtures/power-bi/demonstracao-ampliada-ocupacao.csv');
  const csvVersionado = await readFile(caminho, 'utf8');
  assert.equal(csvVersionado.replaceAll('\r\n', '\n'), gerarCsvConjuntoControlado(conjuntoDemonstracaoPowerBi));
  assert.equal(conjuntoDemonstracaoPowerBi.length, 784);
  assert.deepEqual(new Set(conjuntoDemonstracaoPowerBi.map((intervalo) => intervalo.andar)), new Set(['G1', 'G2']));
  assert.deepEqual(
    new Set(conjuntoDemonstracaoPowerBi.map((intervalo) => intervalo.setor)),
    new Set(['Setor A', 'Setor B', 'Setor C', 'Setor D']),
  );
  assert.deepEqual(
    new Set(conjuntoDemonstracaoPowerBi.map((intervalo) => intervalo.tipoVaga)),
    new Set(['COMUM', 'PCD', 'IDOSO', 'ELETRICA']),
  );
  assert.ok(conjuntoDemonstracaoPowerBi.every((intervalo) => intervalo.origem === 'SINTETICO'));
});

test('recusa intervalo vazio ou com duração inválida', () => {
  assert.throws(() => calcularMetricasOcupacao([]), RangeError);
  assert.throws(() => calcularMetricasOcupacao([{
    ...conjuntoControladoPowerBi[0],
    fimEm: conjuntoControladoPowerBi[0].inicioEm,
  }]), RangeError);
});
