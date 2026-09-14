// Persiste prévias por shopping em PostgreSQL sem modificar a estrutura ou seu histórico.
import type { PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import type { PreviaImportacao } from './contratos.js';
import { criarPreviaCsv } from './parser-csv.js';
import { criarPreviaXlsx } from './parser-xlsx.js';

/** Valida identificadores recebidos pela rota antes de consultar o PostgreSQL. */
function idValido(valor: unknown, campo: 'shoppingId' | 'importacaoId'): string {
  if (typeof valor !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) {
    throw new ApiError(400, 'ID_INVALIDO', `Informe um ${campo} válido.`);
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

/** Cria e consulta prévias CSV/XLSX isoladas por shopping, sem confirmar a estrutura. */
export function createImportacaoService(prisma: PrismaClient) {
  // A mesma fotografia transacional identifica vagas e armazena a prévia resultante.
  const persistirPrevia = async (shoppingId: string, formato: 'CSV' | 'XLSX', previa: PreviaImportacao) => {
    return prisma.$transaction(async tx => {
      const shopping = await tx.shopping.findFirst({ where: { id: shoppingId, excluidoEm: null }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
      const vagas = await tx.vaga.findMany({ where: { shoppingId }, select: { id: true, codigo: true } });
      const resultado = identificarAcoes(previa, vagas);
      const importacao = await tx.importacaoEstrutura.create({ data: { shoppingId, formato, previa: resultado } });
      return { ...resultado, importacaoId: importacao.id, criadoEm: importacao.criadoEm };
    }, { isolationLevel: 'RepeatableRead' });
  };

  return {
    /** Consulta exige o ID e o shopping juntos para não revelar prévias de outro recorte. */
    async buscarPrevia(shoppingId: string, importacaoId: string) {
      const registro = await prisma.importacaoEstrutura.findFirst({
        where: { id: idValido(importacaoId, 'importacaoId'), shoppingId: idValido(shoppingId, 'shoppingId'), shopping: { excluidoEm: null } },
        select: { id: true, shoppingId: true, formato: true, previa: true, criadoEm: true },
      });
      if (!registro) throw new ApiError(404, 'IMPORTACAO_NAO_ENCONTRADA', 'Importação não encontrada.');
      return registro;
    },
    async criarPreviaCsv(shoppingId: string, conteudo: unknown) {
      const id = idValido(shoppingId, 'shoppingId');
      if (typeof conteudo !== 'string') {
        throw new ApiError(415, 'FORMATO_IMPORTACAO_INVALIDO', 'Envie o arquivo como text/csv ou text/plain.');
      }
      const shopping = await prisma.shopping.findUnique({ where: { id }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');

      const previa = criarPreviaCsv(conteudo);
      // A comparação lógica é insensível a caixa e acentos, como a detecção de duplicatas do arquivo.
      return persistirPrevia(id, 'CSV', previa);
    },

    async criarPreviaXlsx(shoppingId: string, conteudo: unknown) {
      const id = idValido(shoppingId, 'shoppingId');
      if (!Buffer.isBuffer(conteudo)) {
        throw new ApiError(415, 'FORMATO_IMPORTACAO_INVALIDO', 'Envie um arquivo XLSX válido.');
      }
      const shopping = await prisma.shopping.findUnique({ where: { id }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
      return persistirPrevia(id, 'XLSX', await criarPreviaXlsx(conteudo));
    },
  };
}
