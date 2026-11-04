/** Gera os CSVs sintéticos e reproduzíveis usados na validação e na demonstração do Power BI. */
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  conjuntoControladoPowerBi,
  conjuntoDemonstracaoPowerBi,
  gerarCsvConjuntoControlado,
} from '../src/analiticos/conjunto-controlado.js';

const diretorio = resolve('test/fixtures/power-bi');

await Promise.all([
  writeFile(
    resolve(diretorio, 'conjunto-controlado-ocupacao.csv'),
    gerarCsvConjuntoControlado(conjuntoControladoPowerBi),
    'utf8',
  ),
  writeFile(
    resolve(diretorio, 'demonstracao-ampliada-ocupacao.csv'),
    gerarCsvConjuntoControlado(conjuntoDemonstracaoPowerBi),
    'utf8',
  ),
]);

console.log(`Fixtures do Power BI geradas em ${diretorio}.`);
