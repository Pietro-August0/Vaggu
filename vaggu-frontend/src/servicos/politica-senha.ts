/** Centraliza no frontend a mesma política de senha definitiva aplicada pela API. */
export const requisitosSenha = [
  { id: "tamanho", texto: "Entre 12 e 128 caracteres", testar: (senha: string) => senha.length >= 12 && senha.length <= 128 },
  { id: "minuscula", texto: "Uma letra minúscula", testar: (senha: string) => /\p{Ll}/u.test(senha) },
  { id: "maiuscula", texto: "Uma letra maiúscula", testar: (senha: string) => /\p{Lu}/u.test(senha) },
  { id: "numero", texto: "Um número", testar: (senha: string) => /\p{N}/u.test(senha) },
  { id: "simbolo", texto: "Um símbolo, como !, @ ou #", testar: (senha: string) => /[^\p{L}\p{N}\s]/u.test(senha) },
  { id: "espaco", texto: "Sem espaços", testar: (senha: string) => senha.length > 0 && !/\s/u.test(senha) },
] as const

/** Identifica erros que pertencem ao campo de nova senha, sem esconder falhas de sessão. */
export const codigosNovaSenha = new Set([
  "SENHA_CURTA", "SENHA_LONGA", "SENHA_COM_ESPACO", "SENHA_SEM_MINUSCULA",
  "SENHA_SEM_MAIUSCULA", "SENHA_SEM_NUMERO", "SENHA_SEM_SIMBOLO", "SENHA_REPETIDA",
])

/** Valida os três campos antes da requisição e devolve mensagens próprias para cada entrada. */
export function validarTrocaDeSenha(senhaAtual: string, novaSenha: string, confirmacao: string) {
  const erros: Partial<Record<"senhaAtual" | "novaSenha" | "confirmacao", string>> = {}
  if (!senhaAtual) erros.senhaAtual = "Digite sua senha atual."
  if (!novaSenha) erros.novaSenha = "Crie uma nova senha."
  else if (novaSenha === senhaAtual) erros.novaSenha = "A nova senha deve ser diferente da senha atual."
  else if (requisitosSenha.some(requisito => !requisito.testar(novaSenha))) {
    erros.novaSenha = "Atenda a todos os requisitos indicados abaixo."
  }
  if (!confirmacao) erros.confirmacao = "Digite novamente a nova senha."
  else if (novaSenha !== confirmacao) erros.confirmacao = "A confirmação não coincide com a nova senha."
  return erros
}
