/** Contratos da administração de shoppings e acessos, sempre validados ao entrar no frontend. */
export interface ShoppingAdmin {
  id: string
  nome: string
  cnpj: string | null
  responsavelNome: string | null
  responsavelCpf: string | null
  emailCorporativo: string | null
  telefone: string | null
  cep: string | null
  uf: string | null
  cidade: string | null
  bairro: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  endereco: string | null
  horarioAbertura: string | null
  horarioFechamento: string | null
  fusoHorario: string | null
  ativo: boolean
  situacaoImplantacao: string
  totalGerentes: number
}

export interface GerenteAdmin {
  id: string
  nome: string
  email: string
  telefone: string | null
  ativo: boolean
  trocarSenhaObrigatoria: boolean
  senhaProvisoria: string | null
}

export type DadosShopping = Omit<ShoppingAdmin, "id" | "ativo" | "situacaoImplantacao" | "totalGerentes" | "endereco">
