// Serviço administrativo de shoppings e gerentes. Centraliza a regra de que
// contas de gerente só nascem pela equipe VAGGU após a parceria.
import { randomBytes } from 'node:crypto';
import { hashPassword } from '../auth/password.js';
import { ApiError, normalizeEmail, publicUser } from '../auth/service.js';
import type { ArmazenamentoFotosShopping } from './armazenamento-fotos.js';

const SITUACOES_IMPLANTACAO = new Set(['NOVO_ATENDIMENTO', 'EM_ANALISE', 'DOCUMENTACAO_PENDENTE', 'APROVADO', 'EM_CONFIGURACAO', 'AGUARDANDO_INSTALACAO', 'ATIVO', 'REJEITADO', 'INATIVO']);
const PRAZO_DESFAZER_EXCLUSAO_MS = 7_000;
const MARGEM_TRANSPORTE_DESFAZER_MS = 1_000;
const LIMITE_FOTO_SHOPPING_BYTES = 2 * 1024 * 1024;
const TIPOS_FOTO_SHOPPING = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Confere a assinatura real do arquivo para não confiar somente no Content-Type enviado. */
function detectarTipoFoto(dados: Buffer): string | null {
  if (dados.length >= 8 && dados.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (dados.length >= 3 && dados[0] === 0xff && dados[1] === 0xd8 && dados[2] === 0xff) return 'image/jpeg';
  if (dados.length >= 12 && dados.subarray(0, 4).toString('ascii') === 'RIFF' && dados.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
}

/** Limita tamanho e formatos antes de encaminhar os bytes ao armazenamento externo. */
function validarFotoShopping(conteudo: unknown, tipoInformado: unknown) {
  if (!Buffer.isBuffer(conteudo) || conteudo.length === 0) {
    throw new ApiError(400, 'FOTO_INVALIDA', 'Selecione uma foto JPEG, PNG ou WebP.');
  }
  if (conteudo.length > LIMITE_FOTO_SHOPPING_BYTES) {
    throw new ApiError(413, 'FOTO_MUITO_GRANDE', 'A foto deve ter no máximo 2 MB.');
  }
  const tipo = typeof tipoInformado === 'string' ? tipoInformado.split(';', 1)[0].trim().toLowerCase() : '';
  const tipoDetectado = detectarTipoFoto(conteudo);
  if (!TIPOS_FOTO_SHOPPING.has(tipo) || tipoDetectado !== tipo) {
    throw new ApiError(400, 'FOTO_INVALIDA', 'O conteúdo da foto deve corresponder a JPEG, PNG ou WebP.');
  }
  return { conteudo, tipoConteudo: tipo };
}

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

/** Mantém apenas dígitos e valida documentos/CEP pelo tamanho esperado. */
function digitosOpcionais(value: unknown, nomeCampo: string, tamanho: number): string | null {
  const texto = textoOpcional(value, nomeCampo, tamanho + 6);
  if (texto === null) return null;
  const digitos = texto.replace(/\D/g, '');
  if (digitos.length !== tamanho) {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ter ${tamanho} dígitos.`);
  }
  return digitos;
}

/** Normaliza e valida e-mail corporativo sem alterar o e-mail de acesso dos gerentes. */
function emailOpcional(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  const email = normalizeEmail(value);
  if (!email) throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um e-mail corporativo válido.');
  return email;
}

/** Aceita somente horários de 24 horas e fusos IANA reconhecidos pelo servidor. */
function horarioOpcional(value: unknown, nomeCampo: string): string | null {
  const horario = textoOpcional(value, nomeCampo, 5);
  if (horario !== null && !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve usar o formato HH:MM.`);
  }
  return horario;
}

function fusoOpcional(value: unknown): string | null {
  const fuso = textoOpcional(value, 'fuso horário', 80);
  if (fuso === null) return null;
  try { new Intl.DateTimeFormat('pt-BR', { timeZone: fuso }).format(); }
  catch { throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe um fuso horário válido.'); }
  return fuso;
}

/** Converte os campos permitidos em dados prontos para criação ou atualização. */
function dadosShopping(body: Record<string, unknown> = {}, exigeNome = false) {
  const data: Record<string, unknown> = {};
  const campo = (nome: string, converter: (valor: unknown) => unknown): void => {
    if (nome in body) data[nome] = converter(body[nome]);
  };
  if (exigeNome || 'nome' in body) data.nome = textoObrigatorio(body.nome, 'nome do shopping');
  campo('cnpj', valor => digitosOpcionais(valor, 'CNPJ', 14));
  campo('responsavelNome', valor => textoOpcional(valor, 'nome do responsável', 120));
  campo('responsavelCpf', valor => digitosOpcionais(valor, 'CPF do responsável', 11));
  campo('emailCorporativo', emailOpcional);
  campo('telefone', valor => textoOpcional(valor, 'telefone', 40));
  campo('cep', valor => digitosOpcionais(valor, 'CEP', 8));
  campo('uf', valor => {
    const uf = textoOpcional(valor, 'UF', 2)?.toUpperCase() ?? null;
    if (uf !== null && !/^[A-Z]{2}$/.test(uf)) throw new ApiError(400, 'DADOS_INVALIDOS', 'UF deve ter duas letras.');
    return uf;
  });
  campo('cidade', valor => textoOpcional(valor, 'cidade', 100));
  campo('bairro', valor => textoOpcional(valor, 'bairro', 100));
  campo('logradouro', valor => textoOpcional(valor, 'logradouro', 160));
  campo('numero', valor => textoOpcional(valor, 'número', 20));
  campo('complemento', valor => textoOpcional(valor, 'complemento', 80));
  campo('horarioAbertura', valor => horarioOpcional(valor, 'horário de abertura'));
  campo('horarioFechamento', valor => horarioOpcional(valor, 'horário de fechamento'));
  campo('fusoHorario', fusoOpcional);
  campo('endereco', valor => textoOpcional(valor, 'endereço', 240));
  return data;
}

/** Seleciona os dados cadastrais públicos e a contagem de usuários quando consultada. */
function publicShopping(shopping) {
  return {
    id: shopping.id,
    nome: shopping.nome,
    cnpj: shopping.cnpj ?? null,
    responsavelNome: shopping.responsavelNome ?? null,
    responsavelCpf: shopping.responsavelCpf ?? null,
    emailCorporativo: shopping.emailCorporativo ?? null,
    telefone: shopping.telefone ?? null,
    cep: shopping.cep ?? null,
    uf: shopping.uf ?? null,
    cidade: shopping.cidade ?? null,
    bairro: shopping.bairro ?? null,
    logradouro: shopping.logradouro ?? null,
    numero: shopping.numero ?? null,
    complemento: shopping.complemento ?? null,
    endereco: shopping.endereco ?? null,
    horarioAbertura: shopping.horarioAbertura ?? null,
    horarioFechamento: shopping.horarioFechamento ?? null,
    fusoHorario: shopping.fusoHorario ?? null,
    imagemUrl: shopping.imagemUrl ?? null,
    possuiFoto: Boolean(shopping.imagemUrl),
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
  armazenamentoFotos,
}: {
  now?: () => Date;
  armazenamentoFotos?: ArmazenamentoFotosShopping;
} = {}) {
  const contagemGerentesVisiveis = {
    select: { usuarios: { where: { perfil: 'SHOPPING', excluidoEm: null } } },
  };
  const detalhesPublicos = {
    _count: contagemGerentesVisiveis,
  };

  return {
    /** Ordena clientes ativos primeiro e inclui a quantidade de usuários de cada shopping. */
    async listarShoppings() {
      const rows = await prisma.shopping.findMany({
        where: { excluidoEm: null },
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
        include: detalhesPublicos,
      });
      return { shoppings: rows.map(publicShopping) };
    },

    /** Cria somente os dados institucionais; acessos individuais são cadastrados separadamente. */
    async criarShopping(body) {
      const shopping = await prisma.shopping.create({
        data: dadosShopping(body, true),
        include: detalhesPublicos,
      });
      return { shopping: publicShopping(shopping) };
    },

    /** Consulta a ficha completa para que o Admin não dependa de dados mantidos no navegador. */
    async buscarShopping(shoppingId) {
      const shopping = await exigirShopping(prisma, shoppingId);
      return { shopping: publicShopping(shopping) };
    },

    /** Atualiza somente dados cadastrais permitidos, preservando estrutura e vínculos. */
    async atualizarShopping(shoppingId, body: Record<string, unknown> = {}) {
      const shopping = await exigirShopping(prisma, shoppingId);
      const data = dadosShopping(body);
      if (Object.keys(data).length === 0) {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe ao menos um dado do shopping para alterar.');
      }
      const atualizado = await prisma.shopping.update({ where: { id: shopping.id }, data, include: detalhesPublicos });
      return { shopping: publicShopping(atualizado) };
    },

    /** Envia a foto ao Blob e grava somente sua URL, removendo a versão anterior após a troca. */
    async salvarFotoShopping(shoppingId, conteudo: unknown, tipoConteudo: unknown) {
      const shopping = await exigirShopping(prisma, shoppingId);
      const foto = validarFotoShopping(conteudo, tipoConteudo);
      if (!armazenamentoFotos) {
        throw new ApiError(503, 'ARMAZENAMENTO_NAO_CONFIGURADO', 'O armazenamento de fotos ainda não foi configurado neste ambiente.');
      }
      const imagemUrl = await armazenamentoFotos.salvar(shopping.id, foto.conteudo, foto.tipoConteudo);
      try {
        await prisma.shopping.update({ where: { id: shopping.id }, data: { imagemUrl } });
      } catch (erro) {
        // Uma falha no banco não deve deixar o arquivo recém-enviado sem referência.
        await armazenamentoFotos.remover(imagemUrl).catch(() => undefined);
        throw erro;
      }
      if (shopping.imagemUrl && shopping.imagemUrl !== imagemUrl) {
        await armazenamentoFotos.remover(shopping.imagemUrl).catch(() => undefined);
      }
      return { imagemUrl, possuiFoto: true };
    },

    /** Remove a referência antes de apagar o arquivo para nunca manter uma URL quebrada no cadastro. */
    async removerFotoShopping(shoppingId) {
      const shopping = await exigirShopping(prisma, shoppingId);
      if (!shopping.imagemUrl) return { imagemUrl: null, possuiFoto: false };
      if (!armazenamentoFotos) {
        throw new ApiError(503, 'ARMAZENAMENTO_NAO_CONFIGURADO', 'O armazenamento de fotos ainda não foi configurado neste ambiente.');
      }
      await prisma.shopping.update({ where: { id: shopping.id }, data: { imagemUrl: null } });
      await armazenamentoFotos.remover(shopping.imagemUrl).catch(() => undefined);
      return { imagemUrl: null, possuiFoto: false };
    },

    /** Oculta o shopping sem apagar sua estrutura ou histórico e encerra os acessos vinculados. */
    async excluirShopping(shoppingId) {
      const shopping = await exigirShopping(prisma, shoppingId);
      const atualizado = await prisma.$transaction(async (tx) => {
        const excluido = await tx.shopping.update({
          where: { id: shopping.id },
          data: { ativo: false, excluidoEm: now() },
          include: detalhesPublicos,
        });
        await tx.usuario.updateMany({
          where: { shoppingId: shopping.id, perfil: 'SHOPPING', excluidoEm: null },
          data: { ativo: false },
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
      const atualizado = await prisma.shopping.update({ where: { id: shopping.id }, data: { situacaoImplantacao: body.situacao }, include: detalhesPublicos });
      return { shopping: publicShopping(atualizado) };
    },

    /** Restringe a busca ao shopping validado e ao perfil de gerente, sem retornar credenciais. */
    async listarGerentes(shoppingId) {
      await exigirShopping(prisma, shoppingId);
      const gerentes = await prisma.usuario.findMany({
        where: { shoppingId, perfil: 'SHOPPING', excluidoEm: null },
        orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
      });
      return { gerentes: gerentes.map(gerente => ({ ...publicUser(gerente), senhaProvisoria: null })) };
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
      try {
        const existente = await prisma.usuario.findUnique({ where: { email } });
        if (existente && (existente.perfil !== 'SHOPPING' || !existente.excluidoEm
          || now().getTime() <= existente.excluidoEm.getTime() + PRAZO_DESFAZER_EXCLUSAO_MS + MARGEM_TRANSPORTE_DESFAZER_MS)) {
          throw new ApiError(409, 'EMAIL_EM_USO', 'Esse e-mail já está cadastrado.');
        }
        const data = {
          nome, email, telefone, senhaHash, perfil: 'SHOPPING', shoppingId: shopping.id,
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
