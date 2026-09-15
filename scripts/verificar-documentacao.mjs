// Confere se o mapa explica todos os arquivos versionáveis, sem percorrer dependências ou segredos ignorados.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const caminhoMapa = 'segunda-mente/Vaggu/Documentação/mapa-do-projeto.md';
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
const faltantes = arquivos.filter((arquivo) => {
  if (arquivo.startsWith('segunda-mente/') && descritos.has('segunda-mente/')) return false;
  return !descritos.has(arquivo);
});
const obsoletos = [...descritos].filter((arquivo) => {
  if (arquivo.endsWith('/')) return !arquivos.some((caminho) => caminho.startsWith(arquivo));
  return !arquivos.includes(arquivo);
});
const repetidos = entradas.map((entrada) => entrada[1]).filter((arquivo, indice, lista) => lista.indexOf(arquivo) !== indice);

/** Percorre somente Markdown do cofre para conferir a navegação compartilhada. */
function listarMarkdown(diretorio) {
  return readdirSync(diretorio, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = resolve(diretorio, entrada.name);
    if (entrada.isDirectory()) return listarMarkdown(caminho);
    return entrada.isFile() && extname(entrada.name).toLowerCase() === '.md' ? [caminho] : [];
  });
}

const raizCofre = resolve(raiz, 'segunda-mente');
const arquivosCofre = readdirSync(raizCofre, { recursive: true, withFileTypes: true })
  .filter((entrada) => entrada.isFile())
  .map((entrada) => resolve(entrada.parentPath, entrada.name));
const caminhosCofre = new Set(arquivosCofre.map((arquivo) => relative(raizCofre, arquivo).split(sep).join('/').toLowerCase()));
const porNome = new Map();
for (const arquivo of arquivosCofre) {
  const nome = basename(arquivo, extname(arquivo)).toLowerCase();
  porNome.set(nome, (porNome.get(nome) ?? 0) + 1);
}

const linksInvalidos = [];
const sintaxeInvalida = [];
for (const arquivo of listarMarkdown(raizCofre)) {
  const conteudo = readFileSync(arquivo, 'utf8');
  const caminhoNota = relative(raizCofre, arquivo).split(sep).join('/');
  for (const [indice, linha] of conteudo.split(/\r?\n/).entries()) {
    if (linha.includes(']]]')) sintaxeInvalida.push(`${caminhoNota}:${indice + 1}`);
  }
  for (const correspondencia of conteudo.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const alvo = correspondencia[1].trim().split('\\').join('/');
    if (!alvo || alvo.includes('{{')) continue;
    const extensao = extname(alvo);
    const candidatos = extensao ? [alvo] : [`${alvo}.md`];
    const diretorioNota = dirname(caminhoNota).split(sep).join('/');
    const existe = candidatos.some((candidato) => {
      const absoluto = relative(raizCofre, resolve(raizCofre, diretorioNota, candidato)).split(sep).join('/').toLowerCase();
      return caminhosCofre.has(candidato.toLowerCase()) || caminhosCofre.has(absoluto);
    });
    const nome = basename(alvo, extensao).toLowerCase();
    if (!existe && porNome.get(nome) !== 1) linksInvalidos.push(`${caminhoNota}: [[${alvo}]]`);
  }
  for (const correspondencia of conteudo.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const destinoBruto = correspondencia[1].trim().replace(/^<|>$/g, '');
    if (!destinoBruto || destinoBruto.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(destinoBruto)) continue;
    const destino = decodeURIComponent(destinoBruto.split('#')[0].split('?')[0]);
    if (!existsSync(resolve(dirname(arquivo), destino))) linksInvalidos.push(`${caminhoNota}: (${destinoBruto})`);
  }
}

if (faltantes.length || obsoletos.length || repetidos.length || linksInvalidos.length || sintaxeInvalida.length) {
  for (const arquivo of faltantes) console.error(`Falta explicar no mapa: ${arquivo}`);
  for (const arquivo of obsoletos) console.error(`Entrada sem arquivo correspondente: ${arquivo}`);
  for (const arquivo of repetidos) console.error(`Entrada repetida: ${arquivo}`);
  for (const link of linksInvalidos) console.error(`Link interno sem destino único: ${link}`);
  for (const local of sintaxeInvalida) console.error(`Fechamento de link inválido: ${local}`);
  process.exitCode = 1;
} else {
  console.log(`Mapa atualizado: ${arquivos.length} arquivos cobertos; links internos da segunda mente válidos.`);
}

// A cobertura automática não avalia clareza nem correção semântica: essa revisão continua sendo humana.
