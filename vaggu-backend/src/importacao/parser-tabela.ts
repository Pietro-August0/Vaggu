// Validação tabular comum aos formatos CSV e XLSX, sem conhecer transporte ou persistência.
import { TIPOS_VAGA_IMPORTACAO, type CampoImportacao, type ErroImportacao,
  type PreviaImportacao, type RegistroImportacao, type TipoVagaImportacao } from './contratos.js';

export type LinhaTabelaImportacao = { numero: number; valores: string[] };
const COLUNAS_OBRIGATORIAS = ['codigo', 'andar', 'setor', 'tipo'] as const;
const TIPOS_PERMITIDOS = new Set<string>(TIPOS_VAGA_IMPORTACAO);

/** Remove diferenças de caixa, espaços e acentos somente para comparações de domínio. */
export function normalizarImportacao(valor: string): string {
  return valor.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function nomeColuna(valor: string): CampoImportacao | undefined {
  const nome = normalizarImportacao(valor).toLowerCase();
  return COLUNAS_OBRIGATORIAS.find(coluna => coluna === nome);
}

function erro(linha: number, campo: CampoImportacao, codigo: string, mensagem: string): ErroImportacao {
  return { linha, campo, codigo, mensagem };
}

/** Valida cabeçalho e registros mantendo números de linha originados no arquivo. */
export function criarPreviaTabela(tabela: LinhaTabelaImportacao[]): PreviaImportacao {
  const [cabecalho, ...linhas] = tabela;
  const registros: RegistroImportacao[] = [];
  const erros: ErroImportacao[] = [];
  if (!cabecalho) {
    erros.push(erro(1, 'arquivo', 'ARQUIVO_VAZIO', 'O arquivo não possui cabeçalho.'));
    return finalizarPrevia(registros, erros, 0);
  }
  const indices = new Map<CampoImportacao, number>();
  cabecalho.valores.forEach((valor, indice) => {
    const coluna = nomeColuna(valor);
    if (coluna && coluna !== 'arquivo' && !indices.has(coluna)) indices.set(coluna, indice);
  });
  for (const coluna of COLUNAS_OBRIGATORIAS) {
    if (!indices.has(coluna)) erros.push(erro(cabecalho.numero, coluna, 'COLUNA_OBRIGATORIA_AUSENTE', `A coluna ${coluna} é obrigatória.`));
  }
  if (erros.length > 0) return finalizarPrevia(registros, erros, linhas.length);

  const codigos = new Map<string, number>();
  for (const linha of linhas) {
    const valores = Object.fromEntries(COLUNAS_OBRIGATORIAS.map(coluna =>
      [coluna, linha.valores[indices.get(coluna)!]?.trim() ?? ''])) as Record<typeof COLUNAS_OBRIGATORIAS[number], string>;
    const errosAntes = erros.length;
    for (const coluna of COLUNAS_OBRIGATORIAS) {
      if (!valores[coluna]) erros.push(erro(linha.numero, coluna, 'CAMPO_OBRIGATORIO', `Informe ${coluna}.`));
    }
    const codigoNormalizado = normalizarImportacao(valores.codigo);
    const primeiraLinha = codigos.get(codigoNormalizado);
    if (codigoNormalizado && primeiraLinha !== undefined) {
      erros.push(erro(linha.numero, 'codigo', 'CODIGO_DUPLICADO', `O código também aparece na linha ${primeiraLinha}.`));
    } else if (codigoNormalizado) codigos.set(codigoNormalizado, linha.numero);
    const tipoNormalizado = normalizarImportacao(valores.tipo);
    if (valores.tipo && !TIPOS_PERMITIDOS.has(tipoNormalizado)) {
      erros.push(erro(linha.numero, 'tipo', 'TIPO_VAGA_INVALIDO', 'Use COMUM, PCD, IDOSO ou ELETRICA.'));
    }
    if (erros.length === errosAntes) {
      registros.push({ linha: linha.numero, codigo: valores.codigo, andar: valores.andar, setor: valores.setor,
        tipo: tipoNormalizado as TipoVagaImportacao, acao: 'CRIAR', vagaId: null });
    }
  }
  return finalizarPrevia(registros, erros, linhas.length);
}

/** Consolida contagens usadas pela interface e impede confirmação de uma prévia vazia. */
export function finalizarPrevia(registros: RegistroImportacao[], erros: ErroImportacao[], totalLinhas: number): PreviaImportacao {
  return { registros, erros, resumo: { totalLinhas, registrosValidos: registros.length, totalErros: erros.length,
    novos: registros.length, atualizacoes: 0, preservadasAusentes: 0 }, podeConfirmar: erros.length === 0 && registros.length > 0 };
}
