// Persiste e confirma importações estruturais por shopping sem apagar histórico operacional.
import { Prisma, type PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import type { PreviaImportacao, RegistroImportacao } from './contratos.js';
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

type ResultadoConfirmacao = {
  andaresCriados: number;
  setoresCriados: number;
  vagasCriadas: number;
  vagasAtualizadas: number;
  vagasPreservadasForaDaPlanilha: number;
};

function previaPersistida(valor: unknown): PreviaImportacao {
  if (typeof valor !== 'object' || valor === null || !Array.isArray((valor as PreviaImportacao).registros)) {
    throw new ApiError(409, 'PREVIA_INVALIDA', 'A prévia armazenada não pode ser confirmada.');
  }
  return valor as PreviaImportacao;
}

function criarResultadoVazio(): ResultadoConfirmacao {
  return { andaresCriados: 0, setoresCriados: 0, vagasCriadas: 0, vagasAtualizadas: 0, vagasPreservadasForaDaPlanilha: 0 };
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

    /** Aplica a prévia uma única vez, preservando IDs de vagas e sem remover registros ausentes. */
    async confirmarImportacao(shoppingId: string, importacaoId: string) {
      const idShopping = idValido(shoppingId, 'shoppingId');
      const idImportacao = idValido(importacaoId, 'importacaoId');
      return prisma.$transaction(async tx => {
        // Uma importacao estrutural por shopping evita disputas de ordem, setores e codigos de vaga.
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${idShopping}, 0))`;
        const importacao = await tx.importacaoEstrutura.findFirst({
          where: { id: idImportacao, shoppingId: idShopping, shopping: { excluidoEm: null } },
          select: { id: true, previa: true, confirmadoEm: true, resultadoConfirmacao: true },
        });
        if (!importacao) throw new ApiError(404, 'IMPORTACAO_NAO_ENCONTRADA', 'Importação não encontrada.');
        if (importacao.confirmadoEm) {
          return { importacaoId: importacao.id, confirmadoEm: importacao.confirmadoEm,
            resultado: importacao.resultadoConfirmacao as ResultadoConfirmacao, idempotente: true };
        }

        const previa = previaPersistida(importacao.previa);
        if (!previa.podeConfirmar || previa.erros.length > 0 || previa.registros.length === 0) {
          throw new ApiError(409, 'PREVIA_NAO_CONFIRMAVEL', 'Corrija os erros da prévia antes de confirmar a importação.');
        }

        const resultado = criarResultadoVazio();
        const andares = await tx.andar.findMany({ where: { shoppingId: idShopping }, select: { id: true, nome: true, ordem: true } });
        const andaresPorNome = new Map(andares.map(andar => [codigoComparavel(andar.nome), andar]));
        let proximaOrdem = andares.reduce((maior, andar) => Math.max(maior, andar.ordem), -1) + 1;

        const setores = await tx.setor.findMany({ where: { shoppingId: idShopping }, select: { id: true, andarId: true, nome: true } });
        const setoresPorAndarENome = new Map(setores.map(setor => [`${setor.andarId}:${codigoComparavel(setor.nome)}`, setor]));

        const vagas = await tx.vaga.findMany({ where: { shoppingId: idShopping }, select: { id: true, codigo: true } });
        const vagasPorCodigo = new Map(vagas.map(vaga => [codigoComparavel(vaga.codigo), vaga]));
        const codigosNaPlanilha = new Set(previa.registros.map(registro => codigoComparavel(registro.codigo)));

        for (const registro of previa.registros) {
          const andar = await obterOuCriarAndar(tx, idShopping, registro, andaresPorNome, proximaOrdem);
          if (andar.criado) { resultado.andaresCriados += 1; proximaOrdem += 1; }
          const setor = await obterOuCriarSetor(tx, idShopping, andar.id, registro, setoresPorAndarENome);
          if (setor.criado) resultado.setoresCriados += 1;

          const codigo = codigoComparavel(registro.codigo);
          const vagaExistente = vagasPorCodigo.get(codigo);
          if (vagaExistente) {
            await tx.vaga.update({ where: { id: vagaExistente.id }, data: { andarId: andar.id, setorId: setor.id, tipo: registro.tipo } });
            resultado.vagasAtualizadas += 1;
          } else {
            const vaga = await tx.vaga.create({ data: { shoppingId: idShopping, andarId: andar.id, setorId: setor.id,
              codigo: registro.codigo.trim(), tipo: registro.tipo } });
            vagasPorCodigo.set(codigo, { id: vaga.id, codigo: vaga.codigo });
            resultado.vagasCriadas += 1;
          }
        }

        resultado.vagasPreservadasForaDaPlanilha = vagas.filter(vaga => !codigosNaPlanilha.has(codigoComparavel(vaga.codigo))).length;
        const confirmada = await tx.importacaoEstrutura.update({
          where: { id: idImportacao },
          data: { confirmadoEm: new Date(), resultadoConfirmacao: resultado as unknown as Prisma.InputJsonObject },
          select: { id: true, confirmadoEm: true, resultadoConfirmacao: true },
        });
        return { importacaoId: confirmada.id, confirmadoEm: confirmada.confirmadoEm,
          resultado: confirmada.resultadoConfirmacao as ResultadoConfirmacao, idempotente: false };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
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

async function obterOuCriarAndar(
  tx: Prisma.TransactionClient,
  shoppingId: string,
  registro: RegistroImportacao,
  andaresPorNome: Map<string, { id: string; nome: string; ordem: number }>,
  ordem: number,
) {
  const chave = codigoComparavel(registro.andar);
  const existente = andaresPorNome.get(chave);
  if (existente) return { ...existente, criado: false };
  const andar = await tx.andar.create({ data: { shoppingId, nome: registro.andar.trim(), ordem } });
  andaresPorNome.set(chave, andar);
  return { ...andar, criado: true };
}

async function obterOuCriarSetor(
  tx: Prisma.TransactionClient,
  shoppingId: string,
  andarId: string,
  registro: RegistroImportacao,
  setoresPorAndarENome: Map<string, { id: string; andarId: string; nome: string }>,
) {
  const chave = `${andarId}:${codigoComparavel(registro.setor)}`;
  const existente = setoresPorAndarENome.get(chave);
  if (existente) return { ...existente, criado: false };
  const setor = await tx.setor.create({ data: { shoppingId, andarId, nome: registro.setor.trim() } });
  setoresPorAndarENome.set(chave, setor);
  return { ...setor, criado: true };
}
