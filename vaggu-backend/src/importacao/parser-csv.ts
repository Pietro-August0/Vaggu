// Leitor CSV do P05. Produz somente uma prévia em memória e nunca acessa o banco.
import {
  TIPOS_VAGA_IMPORTACAO,
  type CampoImportacao,
  type ErroImportacao,
  type PreviaImportacao,
  type RegistroImportacao,
  type TipoVagaImportacao,
} from './contratos.js';

type CelulaCsv = { valor: string; linha: number };

const COLUNAS_OBRIGATORIAS = ['codigo', 'andar', 'setor', 'tipo'] as const;
const TIPOS_PERMITIDOS = new Set<string>(TIPOS_VAGA_IMPORTACAO);

/** Remove diferenças de caixa, espaços e acentos somente para comparar cabeçalhos e tipos. */
function normalizar(valor: string): string {
  return valor.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function nomeColuna(valor: string): CampoImportacao | undefined {
  const nome = normalizar(valor).toLowerCase();
  return COLUNAS_OBRIGATORIAS.find(coluna => coluna === nome);
}

/** Escolhe vírgula ou ponto e vírgula pela primeira linha, ignorando separadores entre aspas. */
function detectarDelimitador(conteudo: string): ',' | ';' {
  let aspas = false;
  let virgulas = 0;
  let pontosEVirgulas = 0;
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
  let registro: CelulaCsv[] = [];
  let valor = '';
  let linhaAtual = 1;
  let linhaRegistro = 1;
  let aspas = false;

  const adicionarCelula = () => { registro.push({ valor, linha: linhaRegistro }); valor = ''; };
  const adicionarRegistro = () => {
    adicionarCelula();
    if (registro.some(celula => celula.valor.trim() !== '')) linhas.push(registro);
    registro = [];
    linhaRegistro = linhaAtual;
  };

  for (let indice = 0; indice < conteudo.length; indice += 1) {
    const caractere = conteudo[indice];
    if (caractere === '"') {
      if (aspas && conteudo[indice + 1] === '"') { valor += '"'; indice += 1; }
      else aspas = !aspas;
    } else if (caractere === delimitador && !aspas) adicionarCelula();
    else if ((caractere === '\n' || caractere === '\r') && !aspas) {
      if (caractere === '\r' && conteudo[indice + 1] === '\n') indice += 1;
      linhaAtual += 1;
      adicionarRegistro();
    } else {
      valor += caractere;
      if (caractere === '\n') linhaAtual += 1;
    }
  }

  if (aspas) {
    return { linhas, erro: { linha: linhaRegistro, campo: 'arquivo', codigo: 'CSV_ASPAS_NAO_FECHADAS', mensagem: 'Há um campo entre aspas que não foi fechado.' } };
  }
  if (valor.length > 0 || registro.length > 0) adicionarRegistro();
  return { linhas };
}

function erro(linha: number, campo: CampoImportacao, codigo: string, mensagem: string): ErroImportacao {
  return { linha, campo, codigo, mensagem };
}

/** Converte um CSV em registros normalizados e erros por linha/campo, sem persistência. */
export function criarPreviaCsv(conteudo: string): PreviaImportacao {
  const texto = conteudo.replace(/^\uFEFF/, '');
  const leitura = lerCsv(texto, detectarDelimitador(texto));
  const erros: ErroImportacao[] = leitura.erro ? [leitura.erro] : [];
  const [cabecalho, ...linhas] = leitura.linhas;
  const registros: RegistroImportacao[] = [];

  if (!cabecalho) {
    erros.push(erro(1, 'arquivo', 'CSV_VAZIO', 'O arquivo CSV não possui cabeçalho.'));
    return finalizar(registros, erros, 0);
  }

  const indices = new Map<CampoImportacao, number>();
  cabecalho.forEach((celula, indice) => {
    const coluna = nomeColuna(celula.valor);
    if (coluna && coluna !== 'arquivo' && !indices.has(coluna)) indices.set(coluna, indice);
  });
  for (const coluna of COLUNAS_OBRIGATORIAS) {
    if (!indices.has(coluna)) erros.push(erro(1, coluna, 'COLUNA_OBRIGATORIA_AUSENTE', `A coluna ${coluna} é obrigatória.`));
  }
  if (erros.length > 0) return finalizar(registros, erros, linhas.length);

  const codigos = new Map<string, number>();
  for (const linha of linhas) {
    const numeroLinha = linha[0]?.linha ?? 1;
    const valores = Object.fromEntries(COLUNAS_OBRIGATORIAS.map(coluna => [coluna, linha[indices.get(coluna)!]?.valor.trim() ?? ''])) as Record<typeof COLUNAS_OBRIGATORIAS[number], string>;
    const errosAntes = erros.length;
    for (const coluna of COLUNAS_OBRIGATORIAS) {
      if (!valores[coluna]) erros.push(erro(numeroLinha, coluna, 'CAMPO_OBRIGATORIO', `Informe ${coluna}.`));
    }

    const codigoNormalizado = normalizar(valores.codigo);
    const primeiraLinha = codigos.get(codigoNormalizado);
    if (codigoNormalizado && primeiraLinha !== undefined) {
      erros.push(erro(numeroLinha, 'codigo', 'CODIGO_DUPLICADO', `O código também aparece na linha ${primeiraLinha}.`));
    } else if (codigoNormalizado) codigos.set(codigoNormalizado, numeroLinha);

    const tipoNormalizado = normalizar(valores.tipo);
    if (valores.tipo && !TIPOS_PERMITIDOS.has(tipoNormalizado)) {
      erros.push(erro(numeroLinha, 'tipo', 'TIPO_VAGA_INVALIDO', 'Use COMUM, PCD, IDOSO ou ELETRICA.'));
    }

    if (erros.length === errosAntes) {
      registros.push({ linha: numeroLinha, codigo: valores.codigo, andar: valores.andar, setor: valores.setor, tipo: tipoNormalizado as TipoVagaImportacao });
    }
  }
  return finalizar(registros, erros, linhas.length);
}

function finalizar(registros: RegistroImportacao[], erros: ErroImportacao[], totalLinhas: number): PreviaImportacao {
  return {
    registros,
    erros,
    resumo: { totalLinhas, registrosValidos: registros.length, totalErros: erros.length },
    podeConfirmar: erros.length === 0 && registros.length > 0,
  };
}

