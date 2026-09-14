// Leitor CSV do P05. Interpreta o transporte textual e delega regras à validação tabular comum.
import type { ErroImportacao, PreviaImportacao } from './contratos.js';
import { criarPreviaTabela } from './parser-tabela.js';

type CelulaCsv = { valor: string; linha: number };

/** Escolhe vírgula ou ponto e vírgula pela primeira linha, ignorando separadores entre aspas. */
function detectarDelimitador(conteudo: string): ',' | ';' {
  let aspas = false; let virgulas = 0; let pontosEVirgulas = 0;
  for (let indice = 0; indice < conteudo.length; indice += 1) {
    const caractere = conteudo[indice];
    if (caractere === '"') {
      if (aspas && conteudo[indice + 1] === '"') indice += 1;
      else aspas = !aspas;
    } else if (!aspas && (caractere === '\n' || caractere === '\r')) break;
    else if (!aspas && caractere === ',') virgulas += 1;
    else if (!aspas && caractere === ';') pontosEVirgulas += 1;
  }
  return pontosEVirgulas > virgulas ? ';' : ',';
}

/** Lê campos com aspas escapadas e preserva a linha física onde cada registro começou. */
function lerCsv(conteudo: string, delimitador: ',' | ';'): { linhas: CelulaCsv[][]; erro?: ErroImportacao } {
  const linhas: CelulaCsv[][] = [];
  let registro: CelulaCsv[] = []; let valor = ''; let linhaAtual = 1; let linhaRegistro = 1; let aspas = false;
  const adicionarCelula = () => { registro.push({ valor, linha: linhaRegistro }); valor = ''; };
  const adicionarRegistro = () => {
    adicionarCelula();
    if (registro.some(celula => celula.valor.trim() !== '')) linhas.push(registro);
    registro = []; linhaRegistro = linhaAtual;
  };
  for (let indice = 0; indice < conteudo.length; indice += 1) {
    const caractere = conteudo[indice];
    if (caractere === '"') {
      if (aspas && conteudo[indice + 1] === '"') { valor += '"'; indice += 1; }
      else aspas = !aspas;
    } else if (caractere === delimitador && !aspas) adicionarCelula();
    else if ((caractere === '\n' || caractere === '\r') && !aspas) {
      if (caractere === '\r' && conteudo[indice + 1] === '\n') indice += 1;
      linhaAtual += 1; adicionarRegistro();
    } else { valor += caractere; if (caractere === '\n') linhaAtual += 1; }
  }
  if (aspas) return { linhas, erro: { linha: linhaRegistro, campo: 'arquivo', codigo: 'CSV_ASPAS_NAO_FECHADAS', mensagem: 'Há um campo entre aspas que não foi fechado.' } };
  if (valor.length > 0 || registro.length > 0) adicionarRegistro();
  return { linhas };
}

/** Converte um CSV em registros normalizados e erros por linha/campo, sem persistência. */
export function criarPreviaCsv(conteudo: string): PreviaImportacao {
  const texto = conteudo.replace(/^\uFEFF/, '');
  const leitura = lerCsv(texto, detectarDelimitador(texto));
  const previa = criarPreviaTabela(leitura.linhas.map(linha =>
    ({ numero: linha[0]?.linha ?? 1, valores: linha.map(celula => celula.valor) })));
  if (!leitura.erro) return previa;
  const erros = [...previa.erros, leitura.erro];
  return { ...previa, erros, resumo: { ...previa.resumo, totalErros: erros.length }, podeConfirmar: false };
}

