/** Valida as respostas da importação antes que a interface use dados externos. */
import { objeto } from "@/servicos/api"
import type { ConfirmacaoImportacao, ErroImportacao, PreviaImportacao, RegistroImportacao } from "@/types/importacao"

const tipos = new Set(["COMUM", "PCD", "IDOSO", "ELETRICA"])
const acoes = new Set(["CRIAR", "ATUALIZAR"])
const campos = new Set(["arquivo", "codigo", "andar", "setor", "tipo"])

export const MODELO_CSV_IMPORTACAO = [
  "codigo,andar,setor,tipo",
  "A-001,Terreo,A,COMUM",
  "A-002,Terreo,A,PCD",
  "A-003,Terreo,B,IDOSO",
  "A-004,Terreo,B,ELETRICA",
  "",
].join("\r\n")

function numero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0
}

function lerRegistro(valor: unknown): RegistroImportacao {
  if (!objeto(valor) || !numero(valor.linha) || typeof valor.codigo !== "string" || typeof valor.andar !== "string"
    || typeof valor.setor !== "string" || typeof valor.tipo !== "string" || !tipos.has(valor.tipo)
    || typeof valor.acao !== "string" || !acoes.has(valor.acao)
    || !(valor.vagaId === null || typeof valor.vagaId === "string")) {
    throw new Error("A prévia contém um registro inválido.")
  }
  return valor as unknown as RegistroImportacao
}

function lerErro(valor: unknown): ErroImportacao {
  if (!objeto(valor) || !numero(valor.linha) || typeof valor.campo !== "string" || !campos.has(valor.campo)
    || typeof valor.codigo !== "string" || typeof valor.mensagem !== "string") {
    throw new Error("A prévia contém um erro inválido.")
  }
  return valor as unknown as ErroImportacao
}

/** Exige o resumo completo e impede habilitar confirmação com resposta parcial. */
export function lerPreviaImportacao(dados: unknown): PreviaImportacao {
  if (!objeto(dados) || typeof dados.importacaoId !== "string" || typeof dados.criadoEm !== "string"
    || !Array.isArray(dados.registros) || !Array.isArray(dados.erros) || !objeto(dados.resumo)
    || typeof dados.podeConfirmar !== "boolean") throw new Error("A prévia recebida é inválida.")
  const resumo = dados.resumo
  if (![resumo.totalLinhas, resumo.registrosValidos, resumo.totalErros, resumo.novos, resumo.atualizacoes].every(numero)) {
    throw new Error("O resumo da prévia é inválido.")
  }
  return {
    importacaoId: dados.importacaoId,
    criadoEm: dados.criadoEm,
    registros: dados.registros.map(lerRegistro),
    erros: dados.erros.map(lerErro),
    resumo: resumo as unknown as PreviaImportacao["resumo"],
    podeConfirmar: dados.podeConfirmar,
  }
}

/** Valida o resultado gravado para informar exatamente o que mudou. */
export function lerConfirmacaoImportacao(dados: unknown): ConfirmacaoImportacao {
  if (!objeto(dados) || typeof dados.importacaoId !== "string" || typeof dados.confirmadoEm !== "string"
    || typeof dados.idempotente !== "boolean" || !objeto(dados.resultado)) {
    throw new Error("A confirmação recebida é inválida.")
  }
  const resultado = dados.resultado
  if (![resultado.andaresCriados, resultado.setoresCriados, resultado.vagasCriadas,
    resultado.vagasAtualizadas, resultado.vagasPreservadasForaDaPlanilha].every(numero)) {
    throw new Error("O resultado da confirmação é inválido.")
  }
  return { importacaoId: dados.importacaoId, confirmadoEm: dados.confirmadoEm,
    idempotente: dados.idempotente, resultado: resultado as unknown as ConfirmacaoImportacao["resultado"] }
}
