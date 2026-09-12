// Serviço de conta própria. Só permite alterações pessoais simples, mantendo
// perfil, shopping, e-mail e status sob regras administrativas.
import { ApiError, publicUser } from '../auth/service.js';

/** Valida um campo textual quando presente na alteração; ausência é tratada pelo chamador. */
function validarTextoOpcional(value, nomeCampo, min = 2, max = 120) {
  if (typeof value !== 'string') {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ser texto.`);
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new ApiError(400, 'DADOS_INVALIDOS', `${nomeCampo} deve ter entre ${min} e ${max} caracteres.`);
  }
  return text;
}

/** Permite limpar o telefone com valor vazio e limita seu tamanho, sem impor formato internacional. */
function validarTelefone(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') {
    throw new ApiError(400, 'DADOS_INVALIDOS', 'telefone deve ser texto.');
  }
  const text = value.trim();
  if (text.length > 40) {
    throw new ApiError(400, 'DADOS_INVALIDOS', 'telefone deve ter até 40 caracteres.');
  }
  return text || null;
}

// Minha conta permite somente dados pessoais permitidos pela especificação.
// Perfil, shopping, e-mail, senhaHash e status ativo continuam sob controle do backend/Admin.
export function createContaService(prisma) {
  return {
    /** Consulta dados públicos da própria conta; o ID deve vir da sessão validada pela rota. */
    async buscarMinhaConta(usuarioId) {
      const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
      if (!usuario) throw new ApiError(401, 'NAO_AUTENTICADO', 'Sessão inválida ou expirada.');
      return { usuario: publicUser(usuario) };
    },

    /** Copia somente nome e telefone para a gravação, ignorando campos de privilégio enviados no corpo. */
    async atualizarMinhaConta(usuarioId, body: Record<string, any> = {}) {
      const dados = body ?? {};
      const data: Record<string, unknown> = {};
      if ('nome' in dados) data.nome = validarTextoOpcional(dados.nome, 'nome');
      if ('telefone' in dados) data.telefone = validarTelefone(dados.telefone);
      if (Object.keys(data).length === 0) {
        throw new ApiError(400, 'DADOS_INVALIDOS', 'Informe nome ou telefone para alterar.');
      }
      const usuario = await prisma.usuario.update({ where: { id: usuarioId }, data });
      return { usuario: publicUser(usuario) };
    },
  };
}
