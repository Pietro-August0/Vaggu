// Leitor XLSX do P05. Usa somente a primeira planilha e delega as regras à validação tabular comum.
import { readSheet } from 'read-excel-file/node';
import type { PreviaImportacao } from './contratos.js';
import { criarPreviaTabela, finalizarPrevia } from './parser-tabela.js';

type LeitorXlsx = (conteudo: Buffer) => Promise<readonly (readonly unknown[])[]>;
const lerPrimeiraPlanilha: LeitorXlsx = async conteudo => readSheet(conteudo);

function valorTextual(valor: unknown): string {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean') return String(valor);
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString();
  return '';
}

/** Converte um Buffer XLSX em prévia e transforma falhas do contêiner em erro de arquivo seguro. */
export async function criarPreviaXlsx(conteudo: Buffer, leitor: LeitorXlsx = lerPrimeiraPlanilha): Promise<PreviaImportacao> {
  try {
    const linhas = await leitor(conteudo);
    if (linhas.length > 10_001 || linhas.some(linha => linha.length > 50)) {
      return finalizarPrevia([], [{ linha: 1, campo: 'arquivo', codigo: 'LIMITE_PLANILHA_EXCEDIDO',
        mensagem: 'A planilha deve ter no máximo 10.000 registros e 50 colunas.' }], 0);
    }
    return criarPreviaTabela(linhas.map((linha, indice) => ({ numero: indice + 1, valores: linha.map(valorTextual) })));
  } catch {
    return finalizarPrevia([], [{ linha: 1, campo: 'arquivo', codigo: 'XLSX_INVALIDO',
      mensagem: 'Não foi possível ler a primeira planilha do arquivo XLSX.' }], 0);
  }
}

