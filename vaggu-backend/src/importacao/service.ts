// Serviço de prévia da importação. Consulta IDs existentes, mas não grava estrutura nem histórico.
import type { PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import type { PreviaImportacao } from './contratos.js';
import { criarPreviaCsv } from './parser-csv.js';
import { criarPreviaXlsx } from './parser-xlsx.js';

/** Valida o shopping antes de consultar dados e mantém erros iguais aos demais módulos administrativos. */
function shoppingIdValido(valor: unknown): string {
  if (typeof valor !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) {
    throw new ApiError(400, 'ID_INVALIDO', 'Informe um shoppingId válido.');
  }
  return valor;
}

function codigoComparavel(valor: string): string {
  return valor.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

/** Marca atualizações com o ID persistido para que a confirmação posterior possa preservá-lo. */
export function identificarAcoes(previa: PreviaImportacao, vagas: Array<{ id: string; codigo: string }>): PreviaImportacao {
  const vagasPorCodigo = new Map(vagas.map(vaga => [codigoComparavel(vaga.codigo), vaga]));
  const registros = previa.registros.map(registro => {
    const existente = vagasPorCodigo.get(codigoComparavel(registro.codigo));
    return existente ? { ...registro, acao: 'ATUALIZAR' as const, vagaId: existente.id } : registro;
  });
  const atualizacoes = registros.filter(registro => registro.acao === 'ATUALIZAR').length;
  return { ...previa, registros, resumo: { ...previa.resumo, novos: registros.length - atualizacoes, atualizacoes } };
}

/** Cria prévias isoladas por shopping e não aceita arquivos fora do contrato textual CSV. */
export function createImportacaoService(prisma: PrismaClient) {
  const identificarNoShopping = async (shoppingId: string, previa: PreviaImportacao) => {
    if (previa.registros.length === 0) return previa;
    const vagas = await prisma.vaga.findMany({ where: { shoppingId }, select: { id: true, codigo: true } });
    return identificarAcoes(previa, vagas);
  };

  return {
    async criarPreviaCsv(shoppingId: string, conteudo: unknown) {
      const id = shoppingIdValido(shoppingId);
      if (typeof conteudo !== 'string') {
        throw new ApiError(415, 'FORMATO_IMPORTACAO_INVALIDO', 'Envie o arquivo como text/csv ou text/plain.');
      }
      const shopping = await prisma.shopping.findUnique({ where: { id }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');

      const previa = criarPreviaCsv(conteudo);
      // A comparação lógica é insensível a caixa e acentos, como a detecção de duplicatas do arquivo.
      return identificarNoShopping(id, previa);
    },

    async criarPreviaXlsx(shoppingId: string, conteudo: unknown) {
      const id = shoppingIdValido(shoppingId);
      if (!Buffer.isBuffer(conteudo)) {
        throw new ApiError(415, 'FORMATO_IMPORTACAO_INVALIDO', 'Envie um arquivo XLSX válido.');
      }
      const shopping = await prisma.shopping.findUnique({ where: { id }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
      return identificarNoShopping(id, await criarPreviaXlsx(conteudo));
    },
  };
}
