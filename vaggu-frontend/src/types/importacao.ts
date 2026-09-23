/** Contratos validados da prévia e da confirmação de importação exibidas ao Admin. */
import { objeto } from "@/servicos/api"
import type { TipoVaga } from "@/types/estrutura"

export interface RegistroImportacao {
  linha: number
  codigo: string
  andar: string
  setor: string
  tipo: TipoVaga
  acao: "CRIAR" | "ATUALIZAR"
}

export interface ErroImportacao {
  linha: number
  campo: string
  codigo: string
  mensagem: string
}

export interface PreviaImportacao {
  importacaoId: string
  registros: RegistroImportacao[]
  erros: ErroImportacao[]
  resumo: { totalLinhas: number; registrosValidos: number; totalErros: number; novos: number; atualizacoes: number; preservadasAusentes: number }
  podeConfirmar: boolean
}

export interface ConfirmacaoImportacao {
  importacaoId: string
  repetida: boolean
  resumo: { novos: number; atualizacoes: number; preservadasAusentes: number }
}

function inteiro(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0
}

function tipoValido(valor: unknown): valor is TipoVaga {
  return valor === "COMUM" || valor === "PCD" || valor === "IDOSO" || valor === "ELETRICA"
}

function acaoValida(valor: unknown): valor is RegistroImportacao["acao"] {
  return valor === "CRIAR" || valor === "ATUALIZAR"
}

/** Rejeita respostas parciais para a tela nunca autorizar confirmação por dado malformado. */
export function lerPreviaImportacao(dados: unknown): PreviaImportacao {
  if (!objeto(dados) || typeof dados.importacaoId !== "string" || !Array.isArray(dados.registros)
    || !Array.isArray(dados.erros) || !objeto(dados.resumo) || typeof dados.podeConfirmar !== "boolean") {
    throw new Error("A prévia recebida não pôde ser validada.")
  }
  const registros = dados.registros.map(registro => {
    if (!objeto(registro) || !inteiro(registro.linha) || typeof registro.codigo !== "string"
      || typeof registro.andar !== "string" || typeof registro.setor !== "string" || !tipoValido(registro.tipo)
      || !acaoValida(registro.acao)) throw new Error("A prévia recebida não pôde ser validada.")
    return { linha: registro.linha, codigo: registro.codigo, andar: registro.andar, setor: registro.setor,
      tipo: registro.tipo, acao: registro.acao }
  })
  const erros = dados.erros.map(erro => {
    if (!objeto(erro) || !inteiro(erro.linha) || typeof erro.campo !== "string"
      || typeof erro.codigo !== "string" || typeof erro.mensagem !== "string") throw new Error("A prévia recebida não pôde ser validada.")
    return { linha: erro.linha, campo: erro.campo, codigo: erro.codigo, mensagem: erro.mensagem }
  })
  const resumo = dados.resumo
  if (!inteiro(resumo.totalLinhas) || !inteiro(resumo.registrosValidos) || !inteiro(resumo.totalErros)
    || !inteiro(resumo.novos) || !inteiro(resumo.atualizacoes) || !inteiro(resumo.preservadasAusentes)) throw new Error("A prévia recebida não pôde ser validada.")
  return { importacaoId: dados.importacaoId, registros, erros, resumo: {
    totalLinhas: resumo.totalLinhas, registrosValidos: resumo.registrosValidos, totalErros: resumo.totalErros,
    novos: resumo.novos, atualizacoes: resumo.atualizacoes, preservadasAusentes: resumo.preservadasAusentes,
  }, podeConfirmar: dados.podeConfirmar }
}

/** Valida os totais persistidos devolvidos pela confirmação idempotente. */
export function lerConfirmacaoImportacao(dados: unknown): ConfirmacaoImportacao {
  const resumo = objeto(dados) ? dados.resumo : null
  if (!objeto(dados) || typeof dados.importacaoId !== "string" || typeof dados.repetida !== "boolean" || !objeto(resumo)
    || !inteiro(resumo.novos) || !inteiro(resumo.atualizacoes) || !inteiro(resumo.preservadasAusentes)) {
    throw new Error("A confirmação recebida não pôde ser validada.")
  }
  return { importacaoId: dados.importacaoId, repetida: dados.repetida,
    resumo: { novos: resumo.novos, atualizacoes: resumo.atualizacoes, preservadasAusentes: resumo.preservadasAusentes } }
}
