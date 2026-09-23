// Persiste prévias por shopping em PostgreSQL sem modificar a estrutura ou seu histórico.
import { Prisma, type PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';
import { TIPOS_VAGA_IMPORTACAO, type ConfirmacaoImportacao, type ErroImportacao,
  type PreviaImportacao, type RegistroImportacao, type ResumoConfirmacaoImportacao } from './contratos.js';
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

function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function inteiro(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;
}

function tipoVagaValido(valor: unknown): valor is RegistroImportacao['tipo'] {
  return typeof valor === 'string' && TIPOS_VAGA_IMPORTACAO.some(tipo => tipo === valor);
}

function campoErroValido(valor: unknown): valor is ErroImportacao['campo'] {
  return valor === 'arquivo' || valor === 'codigo' || valor === 'andar' || valor === 'setor' || valor === 'tipo';
}

function idOpcional(valor: unknown): valor is string | null {
  return valor === null || typeof valor === 'string';
}

/** Reconstrói a prévia persistida sem confiar em JSON alterado fora da aplicação. */
function lerPreviaPersistida(valor: unknown): PreviaImportacao {
  if (!objeto(valor) || !Array.isArray(valor.registros) || !Array.isArray(valor.erros) || !objeto(valor.resumo)) {
    throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'A prévia armazenada não pode ser confirmada.');
  }
  const registros: RegistroImportacao[] = valor.registros.map(registro => {
    if (!objeto(registro) || !inteiro(registro.linha) || typeof registro.codigo !== 'string'
      || typeof registro.andar !== 'string' || typeof registro.setor !== 'string'
      || !tipoVagaValido(registro.tipo)
      || (registro.acao !== 'CRIAR' && registro.acao !== 'ATUALIZAR')
      || !idOpcional(registro.vagaId)) {
      throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'A prévia armazenada não pode ser confirmada.');
    }
    return { linha: registro.linha, codigo: registro.codigo, andar: registro.andar, setor: registro.setor,
      tipo: registro.tipo, acao: registro.acao, vagaId: registro.vagaId };
  });
  const erros: ErroImportacao[] = valor.erros.map(erro => {
    if (!objeto(erro) || !inteiro(erro.linha) || !campoErroValido(erro.campo)
      || typeof erro.codigo !== 'string' || typeof erro.mensagem !== 'string') {
      throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'A prévia armazenada não pode ser confirmada.');
    }
    return { linha: erro.linha, campo: erro.campo, codigo: erro.codigo, mensagem: erro.mensagem };
  });
  const resumo = valor.resumo;
  if (!inteiro(resumo.totalLinhas) || !inteiro(resumo.registrosValidos) || !inteiro(resumo.totalErros)
    || !inteiro(resumo.novos) || !inteiro(resumo.atualizacoes) || !inteiro(resumo.preservadasAusentes)) {
    throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'A prévia armazenada não pode ser confirmada.');
  }
  return { registros, erros, podeConfirmar: valor.podeConfirmar === true && erros.length === 0 && registros.length > 0,
    resumo: { totalLinhas: resumo.totalLinhas, registrosValidos: resumo.registrosValidos, totalErros: resumo.totalErros,
      novos: resumo.novos, atualizacoes: resumo.atualizacoes, preservadasAusentes: resumo.preservadasAusentes } };
}

/** Recupera o resumo gravado na primeira confirmação para responder repetições sem nova escrita. */
function lerResumoConfirmacao(valor: unknown): ResumoConfirmacaoImportacao {
  if (!objeto(valor) || !inteiro(valor.novos) || !inteiro(valor.atualizacoes)
    || !inteiro(valor.preservadasAusentes)) {
    throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'O resultado armazenado da importação não pode ser consultado.');
  }
  return { novos: valor.novos, atualizacoes: valor.atualizacoes, preservadasAusentes: valor.preservadasAusentes };
}

/** Impede escolher silenciosamente entre nomes equivalentes já duplicados na estrutura. */
function indexarUnico<T>(itens: T[], chave: (item: T) => string): Map<string, T> {
  const indice = new Map<string, T>();
  for (const item of itens) {
    const normalizada = codigoComparavel(chave(item));
    if (indice.has(normalizada)) throw new ApiError(409, 'ESTRUTURA_AMBIGUA', 'Existem nomes ou códigos equivalentes na estrutura atual. Corrija-os e gere outra prévia.');
    indice.set(normalizada, item);
  }
  return indice;
}

/** Marca atualizações com o ID persistido para que a confirmação posterior possa preservá-lo. */
export function identificarAcoes(previa: PreviaImportacao, vagas: Array<{ id: string; codigo: string }>): PreviaImportacao {
  const vagasPorCodigo = new Map(vagas.map(vaga => [codigoComparavel(vaga.codigo), vaga]));
  const registros = previa.registros.map(registro => {
    const existente = vagasPorCodigo.get(codigoComparavel(registro.codigo));
    return existente ? { ...registro, acao: 'ATUALIZAR' as const, vagaId: existente.id } : registro;
  });
  const atualizacoes = registros.filter(registro => registro.acao === 'ATUALIZAR').length;
  const codigosImportados = new Set(registros.map(registro => codigoComparavel(registro.codigo)));
  const preservadasAusentes = vagas.filter(vaga => !codigosImportados.has(codigoComparavel(vaga.codigo))).length;
  return { ...previa, registros, resumo: { ...previa.resumo,
    novos: registros.length - atualizacoes, atualizacoes, preservadasAusentes } };
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
      return { ...resultado, importacaoId: importacao.id, criadoEm: importacao.criadoEm,
        confirmadaEm: importacao.confirmadaEm, ativa: importacao.ativa };
    }, { isolationLevel: 'RepeatableRead' });
  };

  /** Confirma sob bloqueio do shopping para tornar repetição e concorrência determinísticas. */
  const confirmar = async (shoppingId: string, importacaoId: string): Promise<ConfirmacaoImportacao> => {
    try {
      return await prisma.$transaction(async tx => {
        const bloqueio = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "shoppings"
          WHERE "id" = ${shoppingId}::uuid AND "excluido_em" IS NULL
          FOR UPDATE`;
        if (bloqueio.length === 0) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
        const importacao = await tx.importacaoEstrutura.findFirst({
          where: { id: importacaoId, shoppingId },
          select: { id: true, previa: true, resultadoConfirmacao: true, confirmadaEm: true },
        });
        if (!importacao) throw new ApiError(404, 'IMPORTACAO_NAO_ENCONTRADA', 'Importação não encontrada.');
        if (importacao.confirmadaEm) {
          return { importacaoId: importacao.id, confirmadaEm: importacao.confirmadaEm,
            resumo: lerResumoConfirmacao(importacao.resultadoConfirmacao), repetida: true };
        }
        const previa = lerPreviaPersistida(importacao.previa);
        if (!previa.podeConfirmar) throw new ApiError(409, 'IMPORTACAO_COM_ERROS', 'Corrija os erros da prévia antes de confirmar a importação.');

        const vagasAtuais = await tx.vaga.findMany({ where: { shoppingId },
          select: { id: true, codigo: true, andarId: true } });
        const vagasPorCodigo = indexarUnico(vagasAtuais, vaga => vaga.codigo);
        for (const registro of previa.registros) {
          const atual = vagasPorCodigo.get(codigoComparavel(registro.codigo));
          if (registro.acao === 'ATUALIZAR' ? !atual || atual.id !== registro.vagaId : atual !== undefined) {
            throw new ApiError(409, 'IMPORTACAO_DESATUALIZADA', 'A estrutura mudou depois da prévia. Gere uma nova prévia para confirmar.');
          }
        }

        let andares = await tx.andar.findMany({ where: { shoppingId }, select: { id: true, nome: true, ordem: true } });
        let andaresPorNome = indexarUnico(andares, andar => andar.nome);
        const nomesAndaresNovos = [...new Map(previa.registros
          .filter(registro => !andaresPorNome.has(codigoComparavel(registro.andar)))
          .map(registro => [codigoComparavel(registro.andar), registro.andar])).values()];
        const proximaOrdem = Math.max(-1, ...andares.map(andar => andar.ordem)) + 1;
        if (proximaOrdem + nomesAndaresNovos.length > 1000) throw new ApiError(409, 'LIMITE_ANDARES', 'A importação ultrapassa o limite de andares do shopping.');
        if (nomesAndaresNovos.length > 0) {
          await tx.andar.createMany({ data: nomesAndaresNovos.map((nome, indice) => ({ shoppingId, nome, ordem: proximaOrdem + indice })) });
          andares = await tx.andar.findMany({ where: { shoppingId }, select: { id: true, nome: true, ordem: true } });
          andaresPorNome = indexarUnico(andares, andar => andar.nome);
        }

        let setores = await tx.setor.findMany({ where: { shoppingId }, select: { id: true, andarId: true, nome: true } });
        const chaveSetor = (andarId: string, nome: string) => `${andarId}:${codigoComparavel(nome)}`;
        let setoresPorNome = indexarUnico(setores, setor => chaveSetor(setor.andarId, setor.nome));
        const setoresNovos = new Map<string, { shoppingId: string; andarId: string; nome: string }>();
        for (const registro of previa.registros) {
          const andar = andaresPorNome.get(codigoComparavel(registro.andar));
          if (!andar) throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'Não foi possível resolver o andar da importação.');
          const chave = chaveSetor(andar.id, registro.setor);
          if (!setoresPorNome.has(codigoComparavel(chave))) setoresNovos.set(codigoComparavel(chave), { shoppingId, andarId: andar.id, nome: registro.setor });
        }
        if (setoresNovos.size > 0) {
          await tx.setor.createMany({ data: [...setoresNovos.values()] });
          setores = await tx.setor.findMany({ where: { shoppingId }, select: { id: true, andarId: true, nome: true } });
          setoresPorNome = indexarUnico(setores, setor => chaveSetor(setor.andarId, setor.nome));
        }

        const resolvidos = previa.registros.map(registro => {
          const andar = andaresPorNome.get(codigoComparavel(registro.andar));
          const setor = andar ? setoresPorNome.get(codigoComparavel(chaveSetor(andar.id, registro.setor))) : undefined;
          if (!andar || !setor) throw new ApiError(500, 'IMPORTACAO_CORROMPIDA', 'Não foi possível resolver a estrutura da importação.');
          return { ...registro, andarId: andar.id, setorId: setor.id };
        });
        const novos = resolvidos.filter(registro => registro.acao === 'CRIAR');
        const atualizacoes = resolvidos.filter(registro => registro.acao === 'ATUALIZAR');
        if (novos.length > 0) {
          await tx.$executeRaw`
            INSERT INTO "vagas" ("id", "shopping_id", "andar_id", "setor_id", "codigo", "tipo")
            SELECT gen_random_uuid(), ${shoppingId}::uuid, dados."andarId"::uuid, dados."setorId"::uuid,
              dados.codigo, dados.tipo::"TipoVaga"
            FROM jsonb_to_recordset(${JSON.stringify(novos)}::jsonb)
              AS dados(codigo text, tipo text, "andarId" text, "setorId" text)`;
        }
        if (atualizacoes.length > 0) {
          await tx.$executeRaw`
            UPDATE "vagas" AS vaga SET
              "andar_id" = dados."andarId"::uuid,
              "setor_id" = dados."setorId"::uuid,
              "codigo" = dados.codigo,
              "tipo" = dados.tipo::"TipoVaga",
              "ativo" = true,
              "posicao_x" = CASE WHEN vaga."andar_id" IS DISTINCT FROM dados."andarId"::uuid THEN NULL ELSE vaga."posicao_x" END,
              "posicao_y" = CASE WHEN vaga."andar_id" IS DISTINCT FROM dados."andarId"::uuid THEN NULL ELSE vaga."posicao_y" END,
              "largura" = CASE WHEN vaga."andar_id" IS DISTINCT FROM dados."andarId"::uuid THEN NULL ELSE vaga."largura" END,
              "altura" = CASE WHEN vaga."andar_id" IS DISTINCT FROM dados."andarId"::uuid THEN NULL ELSE vaga."altura" END,
              "rotacao" = CASE WHEN vaga."andar_id" IS DISTINCT FROM dados."andarId"::uuid THEN NULL ELSE vaga."rotacao" END
            FROM jsonb_to_recordset(${JSON.stringify(atualizacoes)}::jsonb)
              AS dados("vagaId" text, codigo text, tipo text, "andarId" text, "setorId" text)
            WHERE vaga."id" = dados."vagaId"::uuid AND vaga."shopping_id" = ${shoppingId}::uuid`;
        }
        const andaresAfetados = new Set(resolvidos.map(registro => registro.andarId));
        vagasAtuais.filter(vaga => vaga.andarId && atualizacoes.some(registro => registro.vagaId === vaga.id))
          .forEach(vaga => { if (vaga.andarId) andaresAfetados.add(vaga.andarId); });
        await tx.andar.updateMany({ where: { id: { in: [...andaresAfetados] } }, data: { ativo: true, revisaoMapa: { increment: 1 } } });
        await tx.setor.updateMany({ where: { id: { in: [...new Set(resolvidos.map(registro => registro.setorId))] } }, data: { ativo: true } });

        const codigosImportados = new Set(resolvidos.map(registro => codigoComparavel(registro.codigo)));
        const resumo: ResumoConfirmacaoImportacao = { novos: novos.length, atualizacoes: atualizacoes.length,
          preservadasAusentes: vagasAtuais.filter(vaga => !codigosImportados.has(codigoComparavel(vaga.codigo))).length };
        await tx.importacaoEstrutura.updateMany({ where: { shoppingId, ativa: true }, data: { ativa: false } });
        const confirmadaEm = new Date();
        await tx.importacaoEstrutura.update({ where: { id: importacao.id },
          data: { confirmadaEm, ativa: true, resultadoConfirmacao: resumo } });
        return { importacaoId: importacao.id, confirmadaEm, resumo, repetida: false };
      }, { isolationLevel: 'Serializable', maxWait: 5000, timeout: 30000 });
    } catch (erro) {
      if (erro instanceof ApiError) throw erro;
      if (erro instanceof Prisma.PrismaClientKnownRequestError && (erro.code === 'P2002' || erro.code === 'P2034')) {
        throw new ApiError(409, 'IMPORTACAO_DESATUALIZADA', 'A estrutura mudou durante a confirmação. Gere uma nova prévia e tente novamente.');
      }
      throw erro;
    }
  };

  return {
    /** Consulta exige o ID e o shopping juntos para não revelar prévias de outro recorte. */
    async buscarPrevia(shoppingId: string, importacaoId: string) {
      const registro = await prisma.importacaoEstrutura.findFirst({
        where: { id: idValido(importacaoId, 'importacaoId'), shoppingId: idValido(shoppingId, 'shoppingId'), shopping: { excluidoEm: null } },
        select: { id: true, shoppingId: true, formato: true, previa: true, criadoEm: true, confirmadaEm: true, ativa: true, resultadoConfirmacao: true },
      });
      if (!registro) throw new ApiError(404, 'IMPORTACAO_NAO_ENCONTRADA', 'Importação não encontrada.');
      return registro;
    },
    confirmarPrevia(shoppingId: string, importacaoId: string) {
      return confirmar(idValido(shoppingId, 'shoppingId'), idValido(importacaoId, 'importacaoId'));
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
