// Serviço de autenticação humana: valida credenciais, emite sessões opacas,
// expõe a identidade pública e aplica a troca de senha sem vazar hashes.
import { createHash, randomBytes } from 'node:crypto';
import { dummyHash, hashPassword, verifyPassword } from './password.js';

/** Erro de domínio com status HTTP e mensagem preparada para ser apresentada ao usuário. */
export class ApiError extends Error {
  status: number;
  codigo: string;

  constructor(status: number, codigo: string, mensagem: string) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

/** Remove espaços externos e padroniza maiúsculas; retorna null quando o formato não é aceito. */
export function normalizeEmail(value) {
  if (typeof value !== 'string' || value.length > 254) return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Gera a representação persistida da sessão; o token original é entregue somente ao cliente. */
export const digestToken = (token) => createHash('sha256').update(token).digest('hex');
const unauthorized = () => new ApiError(401, 'NAO_AUTENTICADO', 'Sessão inválida ou expirada.');

/** Aplica a política de senha definitiva e informa exatamente qual requisito falhou. */
export function validateNewPassword(password) {
  if (password.length < 12) {
    throw new ApiError(400, 'SENHA_CURTA', 'A nova senha deve ter pelo menos 12 caracteres.');
  }
  if (password.length > 128) {
    throw new ApiError(400, 'SENHA_LONGA', 'A nova senha deve ter no máximo 128 caracteres.');
  }
  if (/\s/u.test(password)) {
    throw new ApiError(400, 'SENHA_COM_ESPACO', 'A nova senha não pode conter espaços.');
  }
  if (!/\p{Ll}/u.test(password)) {
    throw new ApiError(400, 'SENHA_SEM_MINUSCULA', 'Inclua pelo menos uma letra minúscula na nova senha.');
  }
  if (!/\p{Lu}/u.test(password)) {
    throw new ApiError(400, 'SENHA_SEM_MAIUSCULA', 'Inclua pelo menos uma letra maiúscula na nova senha.');
  }
  if (!/\p{N}/u.test(password)) {
    throw new ApiError(400, 'SENHA_SEM_NUMERO', 'Inclua pelo menos um número na nova senha.');
  }
  if (!/[^\p{L}\p{N}\s]/u.test(password)) {
    throw new ApiError(400, 'SENHA_SEM_SIMBOLO', 'Inclua pelo menos um símbolo na nova senha.');
  }
}

/** Exige conta ativa e vínculo coerente; gerente de shopping inativo também perde acesso. */
function allowedUser(user) {
  return user?.ativo && !user.excluidoEm && (
    (user.perfil === 'VAGGU' && user.shoppingId === null)
    || (user.perfil === 'SHOPPING' && user.shoppingId && user.shopping?.ativo)
  );
}

// Lista explícita: nunca devolver senhaHash, tokenHash ou chaves de dispositivos.
export function publicUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone ?? null,
    perfil: user.perfil,
    shoppingId: user.shoppingId,
    ativo: Boolean(user.ativo),
    trocarSenhaObrigatoria: Boolean(user.trocarSenhaObrigatoria),
  };
}

/** Reúne operações de sessão; o relógio injetável permite verificar expiração sem espera real. */
export function createAuthService(prisma, { now = () => new Date() } = {}) {
  const durationMs = 8 * 60 * 60 * 1000;
  let activeChecks = 0;
  return {
    /** Confere credenciais e emite uma sessão de oito horas, retornando somente dados públicos. */
    async login(body) {
      const email = normalizeEmail(body?.email);
      const senha = body?.senha;
      if (!email || typeof senha !== 'string' || senha.length < 1 || senha.length > 128) {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe e-mail válido e senha de até 128 caracteres.');
      }
      // Limita o trabalho de scrypt simultâneo nesta instância para reduzir pressão de memória.
      if (activeChecks >= 4) {
        throw new ApiError(429, 'MUITAS_TENTATIVAS', 'Aguarde um pouco antes de tentar novamente.');
      }
      activeChecks++;
      try {
        const user = await prisma.usuario.findUnique({ where: { email }, include: { shopping: true } });
        const correct = await verifyPassword(senha, user?.senhaHash ?? dummyHash);
        if (!correct || !allowedUser(user)) {
          throw new ApiError(401, 'CREDENCIAIS_INVALIDAS', 'E-mail ou senha inválidos.');
        }
        const token = randomBytes(32).toString('base64url');
        const expiraEm = new Date(now().getTime() + durationMs);
        // Higiene do armazenamento: remove somente sessões já expiradas.
        await prisma.sessao.deleteMany({ where: { expiraEm: { lte: now() } } });
        await prisma.sessao.create({ data: {
          tokenHash: digestToken(token), usuarioId: user.id, expiraEm,
        } });
        return { token, tipo: 'Bearer', expiraEm, usuario: publicUser(user) };
      } finally {
        activeChecks--;
      }
    },

    /** Reconsulta sessão, conta e shopping em cada requisição para aplicar bloqueios atuais. */
    async authenticate(header) {
      const match = typeof header === 'string' && /^Bearer ([A-Za-z0-9_-]{43})$/i.exec(header);
      if (!match) throw unauthorized();
      const session = await prisma.sessao.findUnique({
        where: { tokenHash: digestToken(match[1]) },
        include: { usuario: { include: { shopping: true } } },
      });
      if (!session || session.expiraEm <= now() || !allowedUser(session.usuario)) throw unauthorized();
      return { sessionId: session.id, usuario: publicUser(session.usuario) };
    },

    /** Exige a senha atual, grava um novo hash e libera a troca obrigatória da conta. */
    async changePassword(sessionId, body) {
      const senhaAtual = body?.senhaAtual;
      const novaSenha = body?.novaSenha;
      if (typeof senhaAtual !== 'string' || typeof novaSenha !== 'string') {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe a senha atual e a nova senha.');
      }
      const session = await prisma.sessao.findUnique({
        where: { id: sessionId },
        include: { usuario: { include: { shopping: true } } },
      });
      if (!session || session.expiraEm <= now() || !allowedUser(session.usuario)) throw unauthorized();
      if (!await verifyPassword(senhaAtual, session.usuario.senhaHash)) {
        throw new ApiError(401, 'CREDENCIAIS_INVALIDAS', 'Senha atual inválida.');
      }
      if (senhaAtual === novaSenha) {
        throw new ApiError(400, 'SENHA_REPETIDA', 'A nova senha deve ser diferente da senha atual.');
      }
      validateNewPassword(novaSenha);
      const senhaHash = await hashPassword(novaSenha);
      const usuario = await prisma.usuario.update({
        where: { id: session.usuario.id },
        // A senha recuperável deixa de existir assim que a conta passa a usar a senha definitiva.
        data: { senhaHash, senhaProvisoriaProtegida: null, trocarSenhaObrigatoria: false },
        include: { shopping: true },
      });
      return { usuario: publicUser(usuario) };
    },

    /** Remove somente a sessão informada, preservando as demais sessões do usuário. */
    async logout(sessionId) {
      await prisma.sessao.deleteMany({ where: { id: sessionId } });
    },
  };
}
