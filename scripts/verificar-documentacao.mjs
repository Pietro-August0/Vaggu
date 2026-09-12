// Confere se o mapa explica todos os arquivos versionáveis, sem percorrer dependências ou segredos ignorados.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const caminhoMapa = 'docs/mapa-do-projeto.md';
const mapa = readFileSync(resolve(raiz, caminhoMapa), 'utf8');

/** Lê os caminhos reais do Git; -z preserva espaços e caracteres especiais dos nomes. */
function listarArquivos() {
  const saida = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: raiz, encoding: 'utf8', windowsHide: true,
  });
  // Arquivos removidos ainda podem aparecer no índice antes do próximo commit.
  return [...new Set(saida.split('\0').filter((arquivo) => arquivo && existsSync(resolve(raiz, arquivo))))];
}

const arquivos = listarArquivos();
const entradas = [...mapa.matchAll(/^\| `([^`]+)` \| (.+) \|$/gm)];
const descritos = new Set(entradas.map((entrada) => entrada[1]));
const faltantes = arquivos.filter((arquivo) => !descritos.has(arquivo));
const obsoletos = [...descritos].filter((arquivo) => !arquivos.includes(arquivo));
const repetidos = entradas.map((entrada) => entrada[1]).filter((arquivo, indice, lista) => lista.indexOf(arquivo) !== indice);

if (faltantes.length || obsoletos.length || repetidos.length) {
  for (const arquivo of faltantes) console.error(`Falta explicar no mapa: ${arquivo}`);
  for (const arquivo of obsoletos) console.error(`Entrada sem arquivo correspondente: ${arquivo}`);
  for (const arquivo of repetidos) console.error(`Entrada repetida: ${arquivo}`);
  process.exitCode = 1;
} else {
  console.log(`Mapa atualizado: ${arquivos.length} arquivos cobertos. Revisar também o conteúdo das descrições e comentários.`);
}

// A cobertura automática não avalia clareza nem correção semântica: essa revisão continua sendo humana.
