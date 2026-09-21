/** Contratos da identidade autenticada compartilhados pela interface. */
export type UserRole = "admin" | "shopping"

export interface UserAccount {
  id: string
  email: string
  nome: string
  trocarSenhaObrigatoria: boolean
  telefone?: string | null
  role: UserRole
  mallId?: string
}
