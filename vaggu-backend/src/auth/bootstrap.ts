// Cria o primeiro administrador por uma operação de terminal, sem cadastro público.
import { randomBytes } from 'node:crypto';
import { hashPassword } from './password.js';
import { ApiError, normalizeEmail, publicUser } from './service.js';

/** Valida nome/e-mail e gera uma senha; recusa um administrador já existente sem sobrescrevê-lo. */
export async function createInitialAdmin(prisma, { nome, email: rawEmail }) {
  const email = normalizeEmail(rawEmail);
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 100 || !email) {
    throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe nome de 2 a 100 caracteres e e-mail válido.');
  }
  // A senha não vem de argumentos de terminal, .env, seed ou código-fonte.
  const senha = randomBytes(18).toString('base64url');
  const senhaHash = await hashPassword(senha);
  const usuario = await prisma.$transaction(async (tx) => {
    if (await tx.usuario.findFirst({ where: { perfil: 'VAGGU' } })) {
      throw new ApiError(409, 'ADMIN_JA_EXISTE', 'Já existe um administrador Vaggu. Nenhum usuário foi alterado.');
    }
    if (await tx.usuario.findUnique({ where: { email } })) {
      throw new ApiError(409, 'EMAIL_EM_USO', 'Esse e-mail já está cadastrado. Nenhum usuário foi alterado.');
    }
    return tx.usuario.create({ data: { nome: nome.trim(), email, senhaHash, perfil: 'VAGGU' } });
  });
  return { usuario: publicUser(usuario), senha };
}
