// Serviço de autenticação humana: valida credenciais, emite sessões opacas,
// expõe a identidade pública e aplica a troca de senha sem vazar hashes.
import { createHash, randomBytes } from 'node:crypto';
import { dummyHash, hashPassword, verifyPassword } from './password.js';

export class ApiError extends Error {
  status: number;
  codigo: string;

  constructor(status: number, codigo: string, mensagem: string) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

export function normalizeEmail(value) {
  if (typeof value !== 'string' || value.length > 254) return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export const digestToken = (token) => createHash('sha256').update(token).digest('hex');
const unauthorized = () => new ApiError(401, 'NAO_AUTENTICADO', 'Sessão inválida ou expirada.');

function allowedUser(user) {
  return user?.ativo && (
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
    trocarSenhaObrigatoria: Boolean(user.trocarSenhaObrigatoria),
  };
}

export function createAuthService(prisma, { now = () => new Date() } = {}) {
  const durationMs = 8 * 60 * 60 * 1000;
  let activeChecks = 0;
  return {
    async login(body) {
      const email = normalizeEmail(body?.email);
      const senha = body?.senha;
      if (!email || typeof senha !== 'string' || senha.length < 1 || senha.length > 128) {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe e-mail válido e senha de até 128 caracteres.');
      }
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

    async changePassword(sessionId, body) {
      const senhaAtual = body?.senhaAtual;
      const novaSenha = body?.novaSenha;
      if (typeof senhaAtual !== 'string' || typeof novaSenha !== 'string') {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe a senha atual e a nova senha.');
      }
      if (novaSenha.length < 12 || novaSenha.length > 128) {
        throw new ApiError(400, 'SENHA_INVALIDA', 'A nova senha deve ter entre 12 e 128 caracteres.');
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
      const senhaHash = await hashPassword(novaSenha);
      const usuario = await prisma.usuario.update({
        where: { id: session.usuario.id },
        data: { senhaHash, trocarSenhaObrigatoria: false },
        include: { shopping: true },
      });
      return { usuario: publicUser(usuario) };
    },

    async logout(sessionId) {
      await prisma.sessao.deleteMany({ where: { id: sessionId } });
    },
  };
}
