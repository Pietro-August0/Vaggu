/** Valida o resumo histórico antes de os gráficos substituírem a demonstração local. */
import { objeto } from "@/servicos/api"

export interface AnaliseHistorica {
  temHistorico: boolean
  periodo: { inicioEm: string; fimEm: string }
  resumo: { ocupacaoPercentual: number; coberturaPercentual: number; entradasObservadas: number }
  porDia: { inicioEm: string; ocupacaoPercentual: number; coberturaPercentual: number }[]
  porSetor: { setor: string; ocupacaoPercentual: number; coberturaPercentual: number; entradasObservadas: number }[]
}

function numero(valor: unknown) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) throw new Error("Uma métrica histórica recebida é inválida.")
  return valor
}

export function lerAnaliseHistorica(dados: unknown): AnaliseHistorica {
  if (!objeto(dados) || typeof dados.temHistorico !== "boolean" || !objeto(dados.periodo)
    || typeof dados.periodo.inicioEm !== "string" || typeof dados.periodo.fimEm !== "string"
    || !objeto(dados.resumo) || !Array.isArray(dados.porDia) || !Array.isArray(dados.porSetor)) {
    throw new Error("Não foi possível consultar a análise histórica.")
  }
  return {
    temHistorico: dados.temHistorico,
    periodo: { inicioEm: dados.periodo.inicioEm, fimEm: dados.periodo.fimEm },
    resumo: {
      ocupacaoPercentual: numero(dados.resumo.ocupacaoPercentual),
      coberturaPercentual: numero(dados.resumo.coberturaPercentual),
      entradasObservadas: numero(dados.resumo.entradasObservadas),
    },
    porDia: dados.porDia.map((item) => {
      if (!objeto(item) || typeof item.inicioEm !== "string") throw new Error("Uma série histórica recebida é inválida.")
      return { inicioEm: item.inicioEm, ocupacaoPercentual: numero(item.ocupacaoPercentual), coberturaPercentual: numero(item.coberturaPercentual) }
    }),
    porSetor: dados.porSetor.map((item) => {
      if (!objeto(item) || typeof item.setor !== "string") throw new Error("Um setor histórico recebido é inválido.")
      return { setor: item.setor, ocupacaoPercentual: numero(item.ocupacaoPercentual), coberturaPercentual: numero(item.coberturaPercentual), entradasObservadas: numero(item.entradasObservadas) }
    }),
  }
}
