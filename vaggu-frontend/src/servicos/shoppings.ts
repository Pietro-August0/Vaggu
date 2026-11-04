/** Valida respostas administrativas para impedir que dados incompletos quebrem os formulários. */
import { objeto } from "@/servicos/api"
import type { GerenteAdmin, ShoppingAdmin } from "@/types/admin"

const camposOpcionais = ["cnpj", "responsavelNome", "responsavelCpf", "emailCorporativo", "telefone", "cep", "uf", "cidade", "bairro", "logradouro", "numero", "complemento", "endereco", "horarioAbertura", "horarioFechamento"] as const

export function lerShopping(valor: unknown): ShoppingAdmin {
  if (!objeto(valor) || typeof valor.id !== "string" || typeof valor.nome !== "string" || typeof valor.ativo !== "boolean"
    || typeof valor.situacaoImplantacao !== "string") throw new Error("Não foi possível consultar os dados do shopping.")
  const opcionais: Record<string, string | null> = {}
  for (const campo of camposOpcionais) {
    if (!(typeof valor[campo] === "string" || valor[campo] === null || valor[campo] === undefined)) throw new Error("Um dado cadastral do shopping é inválido.")
    opcionais[campo] = typeof valor[campo] === "string" ? valor[campo] : null
  }
  return { id: valor.id, nome: valor.nome, ativo: valor.ativo, situacaoImplantacao: valor.situacaoImplantacao,
    totalGerentes: typeof valor.totalGerentes === "number" ? valor.totalGerentes : 0,
    totalAndares: typeof valor.totalAndares === "number" ? valor.totalAndares : 0,
    totalSetores: typeof valor.totalSetores === "number" ? valor.totalSetores : 0,
    totalVagas: typeof valor.totalVagas === "number" ? valor.totalVagas : 0,
    ...opcionais } as ShoppingAdmin
}

export function lerListaShoppings(dados: unknown): ShoppingAdmin[] {
  if (!objeto(dados) || !Array.isArray(dados.shoppings)) throw new Error("Não foi possível consultar os shoppings.")
  return dados.shoppings.map(lerShopping)
}

export function lerRespostaShopping(dados: unknown): ShoppingAdmin {
  if (!objeto(dados)) throw new Error("Não foi possível confirmar os dados do shopping.")
  return lerShopping(dados.shopping)
}

export function lerGerentesAdmin(dados: unknown): GerenteAdmin[] {
  if (!objeto(dados) || !Array.isArray(dados.gerentes)) throw new Error("Não foi possível consultar os gerentes.")
  return dados.gerentes.map(valor => {
    if (!objeto(valor) || typeof valor.id !== "string" || typeof valor.nome !== "string" || typeof valor.email !== "string"
      || typeof valor.ativo !== "boolean" || typeof valor.trocarSenhaObrigatoria !== "boolean") throw new Error("Um gerente recebido é inválido.")
    return { id: valor.id, nome: valor.nome, email: valor.email, ativo: valor.ativo,
      telefone: typeof valor.telefone === "string" ? valor.telefone : null,
      trocarSenhaObrigatoria: valor.trocarSenhaObrigatoria,
      senhaProvisoria: typeof valor.senhaProvisoria === "string" ? valor.senhaProvisoria : null }
  })
}
