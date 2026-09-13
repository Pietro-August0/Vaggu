// Serviço administrativo de shoppings e gerentes. Centraliza a regra de que
// contas de gerente só nascem pela equipe VAGGU após a parceria.
import { randomBytes } from 'node:crypto';
import { hashPassword } from '../auth/password.js';
import { ApiError, normalizeEmail, publicUser } from '../auth/service.js';
import { protegerSenhaProvisoria, revelarSenhaProvisoria } from '../auth/credencial-provisoria.js';

const SITUACOES_IMPLANTACAO = new Set(['NOVO_ATENDIMENTO', 'EM_ANALISE', 'DOCUMENTACAO_PENDENTE', 'APROVADO', 'EM_CONFIGURACAO', 'AGUARDANDO_INSTALACAO', 'ATIVO', 'REJEITADO', 'INATIVO']);
const PRAZO_DESFAZER_EXCLUSAO_MS = 7_000;
const MARGEM_TRANSPORTE_DESFAZER_MS = 1_000;

/** Recusa identificadores fora do formato básico esperado antes de consultar o banco. */
function validarId(value, nomeCampo = 'id') {
  if (typeof value !== 'string' || !/^[0-9a-f-]{36}$/i.test(value)) {
    throw new ApiError(400, 'ID_INVALIDO', `Informe um ${nomeCampo} válido.`);
  }
  return value;
}

/** Normaliza espaços externos e exige texto dentro dos limites do campo. */
function textoObrigatorio(value, nomeCampo, min = 2, max = 120) {
  if (typeof value !== 'string') {
    throw new ApiError(400, 'DADOS_INVALIDOS', `Informe ${nomeCampo}.`);
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ter entre ${min} e ${max} caracteres.`);
  }
  return text;
}

/** Converte ausência em null e limita textos opcionais recebidos da API. */
function textoOpcional(value, nomeCampo, max = 200) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ser texto.`);
  }
  const text = value.trim();
  if (text.length > max) {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ter até ${max} caracteres.`);
  }
  return text || null;
}

/** Seleciona os dados cadastrais públicos e a contagem de usuários quando consultada. */
function publicShopping(shopping) {
  return {
    id: shopping.id,
    nome: shopping.nome,
    endereco: shopping.endereco ?? null,
    ativo: shopping.ativo,
    situacaoImplantacao: shopping.situacaoImplantacao,
    criadoEm: shopping.criadoEm,
    totalGerentes: shopping._count?.usuarios,
  };
}

/** Gera uma credencial individual aleatória, entregue apenas na criação ou redefinição. */
function gerarSenhaProvisoria() {
  return randomBytes(18).toString('base64url');
}

/** Valida o ID e exige um shopping existente antes das operações com seus gerentes. */
async function exigirShopping(prisma, shoppingId) {
  const id = validarId(shoppingId, 'shoppingId');
  const shopping = await prisma.shopping.findUnique({ where: { id } });
  if (!shopping || shopping.excluidoEm) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
  return shopping;
}

/** Expõe a senha somente ao serviço administrativo e apenas enquanto ela ainda é provisória. */
function publicGerente(gerente, credencialSecret: string) {
  let senhaProvisoria: string | null = null;
  if (gerente.trocarSenhaObrigatoria && gerente.senhaProvisoriaProtegida) {
    try {
      senhaProvisoria = revelarSenhaProvisoria(gerente.senhaProvisoriaProtegida, credencialSecret);
    } catch {
      // Uma chave alterada não deve derrubar a listagem; o Admin pode gerar uma nova senha provisória.
      senhaProvisoria = null;
    }
  }
  return { ...publicUser(gerente), senhaProvisoria };
}

/** Traduz conflito de unicidade de e-mail; outros erros seguem para o tratamento geral. */
function tratarConflitoUnico(error) {
  if (error?.code === 'P2002') {
    throw new ApiError(409, 'EMAIL_EM_USO', 'Esse e-mail já está cadastrado.');
  }
  throw error;
}

// Regras administrativas da parceria: shoppings e gerentes nascem pelo Admin,
// nunca por cadastro público ou por dados enviados por um gerente autenticado.
export function createShoppingsService(prisma, {
  now = () => new Date(),
  credencialSecret = process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.DATABASE_URL || '',
} = {}) {
  const contagemGerentesVisiveis = {
    select: { usuarios: { where: { perfil: 'SHOPPING', excluidoEm: null } } },
  };

  return {
    /** Ordena clientes ativos primeiro e inclui a quantidade de usuários de cada shopping. */
    async listarShoppings() {
      const rows = await prisma.shopping.findMany({
        where: { excluidoEm: null },
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
        include: { _count: contagemGerentesVisiveis },
      });
      return { shoppings: rows.map(publicShopping) };
    },

    /** Cria somente os dados institucionais; acessos individuais são cadastrados separadamente. */
    async criarShopping(body) {
      const nome = textoObrigatorio(body?.nome, 'nome do shopping');
      const endereco = textoOpcional(body?.endereco, 'endereço');
      const shopping = await prisma.shopping.create({
        data: { nome, endereco },
        include: { _count: contagemGerentesVisiveis },
      });
      return { shopping: publicShopping(shopping) };
    },

    /** Oculta o shopping sem apagar sua estrutura ou histórico e encerra os acessos vinculados. */
    async excluirShopping(shoppingId) {
      const shopping = await exigirShopping(prisma, shoppingId);
      const atualizado = await prisma.$transaction(async (tx) => {
        const excluido = await tx.shopping.update({
          where: { id: shopping.id },
          data: { ativo: false, excluidoEm: now() },
          include: { _count: contagemGerentesVisiveis },
        });
        await tx.usuario.updateMany({
          where: { shoppingId: shopping.id, perfil: 'SHOPPING', excluidoEm: null },
          data: { ativo: false, senhaProvisoriaProtegida: null },
        });
        await tx.sessao.deleteMany({ where: { usuario: { shoppingId: shopping.id } } });
        return excluido;
      });
      return { shopping: publicShopping(atualizado) };
    },

    /** Atualiza a etapa operacional separadamente do bloqueio institucional do shopping. */
    async atualizarImplantacao(shoppingId, body: Record<string, unknown> = {}) {
      const shopping = await exigirShopping(prisma, shoppingId);
      if (typeof body.situacao !== 'string' || !SITUACOES_IMPLANTACAO.has(body.situacao)) {
        throw new ApiError(400, 'SITUACAO_INVALIDA', 'Informe uma situação de implantação válida.');
      }
      const atualizado = await prisma.shopping.update({ where: { id: shopping.id }, data: { situacaoImplantacao: body.situacao } });
      return { shopping: publicShopping(atualizado) };
    },

    /** Restringe a busca ao shopping validado e ao perfil de gerente, sem retornar credenciais. */
    async listarGerentes(shoppingId) {
      await exigirShopping(prisma, shoppingId);
      const gerentes = await prisma.usuario.findMany({
        where: { shoppingId, perfil: 'SHOPPING', excluidoEm: null },
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
      });
      return { gerentes: gerentes.map(gerente => publicGerente(gerente, credencialSecret)) };
    },

    /** Exige shopping ativo e cria uma conta com senha provisória e troca obrigatória. */
    async criarGerente(shoppingId, body) {
      const shopping = await exigirShopping(prisma, shoppingId);
      if (!shopping.ativo) throw new ApiError(409, 'SHOPPING_INATIVO', 'Reative o shopping antes de criar gerentes.');
      const nome = textoObrigatorio(body?.nome, 'nome do gerente');
      const email = normalizeEmail(body?.email);
      const telefone = textoOpcional(body?.telefone, 'telefone', 40);
      if (!email) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um e-mail válido.');

      const senha = gerarSenhaProvisoria();
      const senhaHash = await hashPassword(senha);
      const senhaProvisoriaProtegida = protegerSenhaProvisoria(senha, credencialSecret);
      try {
        const existente = await prisma.usuario.findUnique({ where: { email } });
        if (existente && (existente.perfil !== 'SHOPPING' || !existente.excluidoEm
          || now().getTime() <= existente.excluidoEm.getTime() + PRAZO_DESFAZER_EXCLUSAO_MS + MARGEM_TRANSPORTE_DESFAZER_MS)) {
          throw new ApiError(409, 'EMAIL_EM_USO', 'Esse e-mail já está cadastrado.');
        }
        const data = {
          nome, email, telefone, senhaHash, senhaProvisoriaProtegida, perfil: 'SHOPPING', shoppingId: shopping.id,
          ativo: true, trocarSenhaObrigatoria: true, excluidoEm: null, ativoAntesExclusao: null,
        };
        // Após o prazo de desfazer, o mesmo e-mail pode ganhar um novo acesso sem duplicar a identidade.
        const usuario = existente
          ? await prisma.usuario.update({ where: { id: existente.id }, data })
          : await prisma.usuario.create({ data });
        return { gerente: publicUser(usuario), senhaProvisoria: senha };
      } catch (error) {
        if (error instanceof ApiError) throw error;
        tratarConflitoUnico(error);
      }
    },

    /** Permite nome, telefone e bloqueio individual; preserva perfil, e-mail e vínculo existentes. */
    async atualizarGerente(gerenteId, body: Record<string, any> = {}) {
      const dados = body ?? {};
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING' || gerente.excluidoEm) {
        throw new ApiError(404, 'GERENTE_NAO_ENCONTRADO', 'Gerente não encontrado.');
      }
      const data: Record<string, unknown> = {};
      if ('nome' in dados) data.nome = textoObrigatorio(dados.nome, 'nome do gerente');
      if ('telefone' in dados) data.telefone = textoOpcional(dados.telefone, 'telefone', 40);
      if ('ativo' in dados) {
        if (typeof dados.ativo !== 'boolean') {
          throw new ApiError(400, 'DADOS_INVALIDOS', 'ativo deve ser verdadeiro ou falso.');
        }
        data.ativo = dados.ativo;
      }
      if (Object.keys(data).length === 0) {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe ao menos um campo permitido para alteração.');
      }
      const usuario = await prisma.$transaction(async (tx) => {
        const atualizado = await tx.usuario.update({ where: { id }, data });
        // O bloqueio administrativo encerra imediatamente todas as sessões desse acesso.
        if (data.ativo === false) {
          await tx.sessao.deleteMany({ where: { usuarioId: id } });
        }
        return atualizado;
      });
      return { gerente: publicUser(usuario) };
    },

    /** Substitui a senha e revoga todas as sessões do gerente na mesma transação. */
    async redefinirSenhaGerente(gerenteId) {
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING' || gerente.excluidoEm) {
        throw new ApiError(404, 'GERENTE_NAO_ENCONTRADO', 'Gerente não encontrado.');
      }
      const senha = gerarSenhaProvisoria();
      const senhaHash = await hashPassword(senha);
      const senhaProvisoriaProtegida = protegerSenhaProvisoria(senha, credencialSecret);
      const usuario = await prisma.$transaction(async (tx) => {
        const updated = await tx.usuario.update({
          where: { id },
          data: { senhaHash, senhaProvisoriaProtegida, trocarSenhaObrigatoria: true },
        });
        await tx.sessao.deleteMany({ where: { usuarioId: id } });
        return updated;
      });
      return { gerente: publicUser(usuario), senhaProvisoria: senha };
    },

    /** Oculta o gerente, encerra suas sessões e abre uma janela curta para desfazer. */
    async excluirGerente(gerenteId) {
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING' || gerente.excluidoEm) {
        throw new ApiError(404, 'GERENTE_NAO_ENCONTRADO', 'Gerente não encontrado.');
      }
      const excluidoEm = now();
      const usuario = await prisma.$transaction(async (tx) => {
        const atualizado = await tx.usuario.update({
          where: { id },
          data: { ativoAntesExclusao: gerente.ativo, ativo: false, excluidoEm },
        });
        await tx.sessao.deleteMany({ where: { usuarioId: id } });
        return atualizado;
      });
      return {
        gerente: publicUser(usuario),
        desfazerAte: new Date(excluidoEm.getTime() + PRAZO_DESFAZER_EXCLUSAO_MS),
      };
    },

    /** Restaura o estado anterior somente dentro da janela informada na exclusão. */
    async desfazerExclusaoGerente(gerenteId) {
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING' || !gerente.excluidoEm) {
        throw new ApiError(404, 'EXCLUSAO_NAO_ENCONTRADA', 'Não há uma exclusão para desfazer.');
      }
      // A margem absorve o tempo da requisição; o aviso continua visível por sete segundos.
      if (now().getTime() > gerente.excluidoEm.getTime() + PRAZO_DESFAZER_EXCLUSAO_MS + MARGEM_TRANSPORTE_DESFAZER_MS) {
        throw new ApiError(409, 'PRAZO_DESFAZER_EXPIRADO', 'O prazo de sete segundos para desfazer terminou.');
      }
      const usuario = await prisma.usuario.update({
        where: { id },
        data: {
          ativo: gerente.ativoAntesExclusao ?? true,
          excluidoEm: null,
          ativoAntesExclusao: null,
        },
      });
      return { gerente: publicUser(usuario) };
    },
  };
}
