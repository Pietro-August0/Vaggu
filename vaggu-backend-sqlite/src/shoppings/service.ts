// Serviço administrativo de shoppings e gerentes. Centraliza a regra de que
// contas de gerente só nascem pela equipe VAGGU após a parceria.
import { randomBytes } from 'node:crypto';
import { hashPassword } from '../auth/password.js';
import { ApiError, normalizeEmail, publicUser } from '../auth/service.js';

function validarId(value, nomeCampo = 'id') {
  if (typeof value !== 'string' || !/^[0-9a-f-]{36}$/i.test(value)) {
    throw new ApiError(400, 'ID_INVALIDO', `Informe um ${nomeCampo} válido.`);
  }
  return value;
}

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

function publicShopping(shopping) {
  return {
    id: shopping.id,
    nome: shopping.nome,
    endereco: shopping.endereco ?? null,
    ativo: shopping.ativo,
    criadoEm: shopping.criadoEm,
    totalGerentes: shopping._count?.usuarios,
  };
}

function gerarSenhaProvisoria() {
  return randomBytes(18).toString('base64url');
}

async function exigirShopping(prisma, shoppingId) {
  const id = validarId(shoppingId, 'shoppingId');
  const shopping = await prisma.shopping.findUnique({ where: { id } });
  if (!shopping) throw new ApiError(404, 'SHOPPING_NAO_ENCONTRADO', 'Shopping não encontrado.');
  return shopping;
}

function tratarConflitoUnico(error) {
  if (error?.code === 'P2002') {
    throw new ApiError(409, 'EMAIL_EM_USO', 'Esse e-mail já está cadastrado.');
  }
  throw error;
}

// Regras administrativas da parceria: shoppings e gerentes nascem pelo Admin,
// nunca por cadastro público ou por dados enviados por um gerente autenticado.
export function createShoppingsService(prisma) {
  return {
    async listarShoppings() {
      const rows = await prisma.shopping.findMany({
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
        include: { _count: { select: { usuarios: true } } },
      });
      return { shoppings: rows.map(publicShopping) };
    },

    async criarShopping(body) {
      const nome = textoObrigatorio(body?.nome, 'nome do shopping');
      const endereco = textoOpcional(body?.endereco, 'endereço');
      const shopping = await prisma.shopping.create({
        data: { nome, endereco },
        include: { _count: { select: { usuarios: true } } },
      });
      return { shopping: publicShopping(shopping) };
    },

    async listarGerentes(shoppingId) {
      await exigirShopping(prisma, shoppingId);
      const gerentes = await prisma.usuario.findMany({
        where: { shoppingId, perfil: 'SHOPPING' },
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
      });
      return { gerentes: gerentes.map(publicUser) };
    },

    async criarGerente(shoppingId, body) {
      const shopping = await exigirShopping(prisma, shoppingId);
      if (!shopping.ativo) throw new ApiError(409, 'SHOPPING_INATIVO', 'Reative o shopping antes de criar gerentes.');
      const nome = textoObrigatorio(body?.nome, 'nome do gerente');
      const email = normalizeEmail(body?.email);
      const telefone = textoOpcional(body?.telefone, 'telefone', 40);
      if (!email) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um e-mail válido.');

      const senha = gerarSenhaProvisoria();
      const senhaHash = await hashPassword(senha);
      try {
        const usuario = await prisma.usuario.create({
          data: {
            nome,
            email,
            telefone,
            senhaHash,
            perfil: 'SHOPPING',
            shoppingId: shopping.id,
            trocarSenhaObrigatoria: true,
          },
        });
        return { gerente: publicUser(usuario), senhaProvisoria: senha };
      } catch (error) {
        tratarConflitoUnico(error);
      }
    },

    async atualizarGerente(gerenteId, body: Record<string, any> = {}) {
      const dados = body ?? {};
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING') {
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
      return { gerente: publicUser(await prisma.usuario.update({ where: { id }, data })) };
    },

    async redefinirSenhaGerente(gerenteId) {
      const id = validarId(gerenteId, 'id do gerente');
      const gerente = await prisma.usuario.findUnique({ where: { id } });
      if (!gerente || gerente.perfil !== 'SHOPPING') {
        throw new ApiError(404, 'GERENTE_NAO_ENCONTRADO', 'Gerente não encontrado.');
      }
      const senha = gerarSenhaProvisoria();
      const senhaHash = await hashPassword(senha);
      const usuario = await prisma.$transaction(async (tx) => {
        const updated = await tx.usuario.update({
          where: { id },
          data: { senhaHash, trocarSenhaObrigatoria: true },
        });
        await tx.sessao.deleteMany({ where: { usuarioId: id } });
        return updated;
      });
      return { gerente: publicUser(usuario), senhaProvisoria: senha };
    },
  };
}
