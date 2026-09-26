/** Centraliza os rótulos de categoria e estado usados nas diferentes visões de vaga. */
import type { TipoVaga, VagaEstrutura } from "@/types/estrutura"

export const nomesTipoVaga: Record<TipoVaga, string> = {
  COMUM: "Comum",
  PCD: "PCD",
  IDOSO: "Idoso",
  ELETRICA: "Elétrica",
}

export const nomesEstadoVaga: Record<VagaEstrutura["estadoAtual"], string> = {
  LIVRE: "Livre",
  OCUPADA: "Ocupada",
  DESCONHECIDA: "Indisponível",
}
