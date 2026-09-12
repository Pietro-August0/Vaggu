// Serviço da estrutura física e do mapa. Todas as relações são derivadas no banco
// para que IDs enviados pelo cliente não consigam cruzar shoppings ou andares.
import type { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../auth/service.js';

const TIPOS = new Set(['COMUM', 'PCD', 'IDOSO', 'ELETRICA']);

/** Valida UUIDs antes de qualquer consulta e evita respostas diferentes para formatos arbitrários. */
function idValido(valor: unknown, campo = 'id'): string {
  if (typeof valor !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) {
    throw new ApiError(400, 'ID_INVALIDO', `Informe um ${campo} válido.`);
  }
  return valor;
}

/** Normaliza rótulos administrativos curtos. */
function texto(valor: unknown, campo: string, max = 120): string {
  if (typeof valor !== 'string') throw new ApiError(400, 'DADOS_INVALIDOS', `Informe ${campo}.`);
  const resultado = valor.trim();
  if (resultado.length < 1 || resultado.length > max) throw new ApiError(400, 'DADOS_INVALIDOS', `${campo} deve ter entre 1 e ${max} caracteres.`);
  return resultado;
}

/** Converte posições proporcionais sem aceitar NaN, infinito ou medidas fora da planta. */
function proporcao(valor: unknown, campo: string, permiteZero = true): number {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < (permiteZero ? 0 : Number.EPSILON) || valor > 1) {
    throw new ApiError(400, 'POSICAO_INVALIDA', `${campo} deve estar entre ${permiteZero ? 0 : 'mais de 0'} e 1.`);
  }
  return valor;
}

/** Converte Decimals do Prisma em números adequados ao contrato JSON do mapa. */
function vagaPublica(vaga: Record<string, unknown>) {
  const numero = (valor: unknown) => valor === null || valor === undefined ? null : Number(valor);
  return { id: vaga.id, codigo: vaga.codigo, tipo: vaga.tipo, estadoAtual: vaga.estadoAtual,
    ativo: vaga.ativo, posicao: numero(vaga.posicaoX) === null ? null : { x: numero(vaga.posicaoX), y: numero(vaga.posicaoY),
      largura: numero(vaga.largura), altura: numero(vaga.altura), rotacao: numero(vaga.rotacao) } };
}

/** Mantém o formato de leitura igual para Admin e gerente, sem incluir credenciais de sensores. */
function estruturaPublica(shopping: Record<string, unknown> & { andares: Array<Record<string, unknown> & { setores: Array<Record<string, unknown> & { vagas: Array<Record<string, unknown>> }> }> }) {
  return { shopping: { id: shopping.id, nome: shopping.nome, situacaoImplantacao: shopping.situacaoImplantacao },
    andares: shopping.andares.map(andar => ({ id: andar.id, nome: andar.nome, ordem: andar.ordem,
      imagemMapa: andar.imagemMapa, revisaoMapa: andar.revisaoMapa, ativo: andar.ativo,
      setores: andar.setores.map(setor => ({ id: setor.id, nome: setor.nome, ativo: setor.ativo,
        vagas: setor.vagas.map(vagaPublica) })) })) };
}

/** Traduz conflitos estruturais para mensagens de domínio sem expor detalhes do PostgreSQL. */
function conflito(error: unknown): never {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
    throw new ApiError(409, 'ESTRUTURA_DUPLICADA', 'Já existe um registro com esse nome, ordem ou código nesse recorte.');
  }
  throw error;
}

/** Implementa configuração e leitura da estrutura com isolamento por shopping. */
export function createEstruturaService(prisma: PrismaClient) {
  const obter = async (shoppingId: string) => {
    const shopping = await prisma.shopping.findUnique({ where: { id: idValido(shoppingId, 'shoppingId') },
      include: { andares: { orderBy: { ordem: 'asc' }, include: { setores: { orderBy: { nome: 'asc' }, include: { vagas: { orderBy: { codigo: 'asc' } } } } } } } });
    if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
    return estruturaPublica(shopping as unknown as Parameters<typeof estruturaPublica>[0]);
  };
  return {
    buscarEstrutura: obter,

    /** Cria um andar no shopping escolhido pelo Admin. */
    async criarAndar(shoppingId: string, body: Record<string, unknown> = {}) {
      const shopping = await prisma.shopping.findUnique({ where: { id: idValido(shoppingId, 'shoppingId') }, select: { id: true } });
      if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
      if (!Number.isInteger(body.ordem) || Number(body.ordem) < 0 || Number(body.ordem) > 999) throw new ApiError(400, 'DADOS_INVALIDOS', 'ordem deve ser um inteiro entre 0 e 999.');
      try { const andar = await prisma.andar.create({ data: { shoppingId: shopping.id, nome: texto(body.nome, 'nome do andar'), ordem: Number(body.ordem) } }); return { andar }; }
      catch (error) { conflito(error); }
    },

    /** Deriva shopping e andar pelo registro persistido, sem aceitar shoppingId no corpo. */
    async criarSetor(andarId: string, body: Record<string, unknown> = {}) {
      const andar = await prisma.andar.findUnique({ where: { id: idValido(andarId, 'id do andar') } });
      if (!andar) throw new ApiError(404, 'ANDAR_NAO_ENCONTRADO', 'Andar não encontrado.');
      try { const setor = await prisma.setor.create({ data: { shoppingId: andar.shoppingId, andarId: andar.id, nome: texto(body.nome, 'nome do setor') } }); return { setor }; }
      catch (error) { conflito(error); }
    },

    /** Cria vaga vinculada ao setor e andar persistidos, com tipo separado do estado operacional. */
    async criarVaga(setorId: string, body: Record<string, unknown> = {}) {
      const setor = await prisma.setor.findUnique({ where: { id: idValido(setorId, 'id do setor') } });
      if (!setor) throw new ApiError(404, 'SETOR_NAO_ENCONTRADO', 'Setor não encontrado.');
      if (typeof body.tipo !== 'string' || !TIPOS.has(body.tipo)) throw new ApiError(400, 'TIPO_VAGA_INVALIDO', 'Use COMUM, PCD, IDOSO ou ELETRICA.');
      try { const vaga = await prisma.vaga.create({ data: { shoppingId: setor.shoppingId, andarId: setor.andarId, setorId: setor.id,
        codigo: texto(body.codigo, 'código da vaga', 40), tipo: body.tipo as 'COMUM' | 'PCD' | 'IDOSO' | 'ELETRICA' } }); return { vaga: vagaPublica(vaga as unknown as Record<string, unknown>) }; }
      catch (error) { conflito(error); }
    },

    /** Salva todas as posições em uma revisão atômica e rejeita vaga de outro andar. */
    async salvarMapa(andarId: string, body: Record<string, unknown> = {}) {
      const id = idValido(andarId, 'id do andar');
      if (!Number.isInteger(body.revisao) || Number(body.revisao) < 0) throw new ApiError(400, 'REVISAO_INVALIDA', 'Informe a revisão atual do mapa.');
      if (!Array.isArray(body.posicoes)) throw new ApiError(400, 'POSICAO_INVALIDA', 'Informe a lista de posições.');
      const ids = new Set<string>();
      const posicoes = body.posicoes.map((valor: unknown) => {
        if (typeof valor !== 'object' || valor === null) throw new ApiError(400, 'POSICAO_INVALIDA', 'Posição inválida.');
        const p = valor as Record<string, unknown>; const vagaId = idValido(p.vagaId, 'id da vaga');
        if (ids.has(vagaId)) throw new ApiError(400, 'VAGA_DUPLICADA_NO_MAPA', 'Uma vaga não pode aparecer duas vezes no mapa.'); ids.add(vagaId);
        const rotacao = typeof p.rotacao === 'number' && Number.isFinite(p.rotacao) && p.rotacao >= -360 && p.rotacao <= 360 ? p.rotacao : 0;
        return { vagaId, x: proporcao(p.x, 'x'), y: proporcao(p.y, 'y'), largura: proporcao(p.largura, 'largura', false), altura: proporcao(p.altura, 'altura', false), rotacao };
      });
      await prisma.$transaction(async tx => {
        const atualizado = await tx.andar.updateMany({ where: { id, revisaoMapa: Number(body.revisao) }, data: { revisaoMapa: { increment: 1 } } });
        if (atualizado.count !== 1) throw new ApiError(409, 'MAPA_DESATUALIZADO', 'O mapa foi alterado em outra sessão. Atualize antes de salvar novamente.');
        const vagas = await tx.vaga.findMany({ where: { id: { in: [...ids] }, andarId: id }, select: { id: true } });
        if (vagas.length !== ids.size) throw new ApiError(400, 'VAGA_FORA_DO_ANDAR', 'Todas as vagas devem pertencer ao andar do mapa.');
        await Promise.all(posicoes.map(p => tx.vaga.update({ where: { id: p.vagaId }, data: { posicaoX: p.x, posicaoY: p.y, largura: p.largura, altura: p.altura, rotacao: p.rotacao } })));
      }, { isolationLevel: 'Serializable' as Prisma.TransactionIsolationLevel });
      const andar = await prisma.andar.findUniqueOrThrow({ where: { id }, select: { revisaoMapa: true } });
      return { revisaoMapa: andar.revisaoMapa };
    },
  };
}
