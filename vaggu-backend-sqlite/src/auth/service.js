import { createHash, randomBytes } from 'node:crypto';
import { dummyHash, verifyPassword } from './password.js';

export class ApiError extends Error {
  constructor(status, codigo, mensagem) {
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
  return { id: user.id, nome: user.nome, email: user.email,
    perfil: user.perfil, shoppingId: user.shoppingId };
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

    async logout(sessionId) {
      await prisma.sessao.deleteMany({ where: { id: sessionId } });
    },
  };
}
