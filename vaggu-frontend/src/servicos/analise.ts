/** Valida métricas históricas; null significa ausência de observação, nunca zero. */
import { objeto } from "@/servicos/api"

export interface MetricasHistoricas {
  ocupacaoPercentual: number | null
  coberturaPercentual: number | null
  entradasObservadas: number
  saidasObservadas: number
  ciclosCompletos: number
  permanenciaMediaMinutos: number | null
  rotatividadeObservada: number | null
}
export interface AnaliseHistorica {
  temHistorico: boolean
  periodo: { inicioEm: string; fimEm: string }
  resumo: MetricasHistoricas
  porDia: (MetricasHistoricas & { inicioEm: string })[]
  porSetor: (MetricasHistoricas & { setor: string })[]
}
function numero(valor: unknown) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) throw new Error("Uma métrica histórica recebida é inválida.")
  return valor
}
function metrica(dados: unknown): MetricasHistoricas {
  if (!objeto(dados)) throw new Error("Métricas históricas inválidas.")
  const anulavel = (valor: unknown) => valor === null ? null : numero(valor)
  return {
    ocupacaoPercentual: anulavel(dados.ocupacaoPercentual), coberturaPercentual: anulavel(dados.coberturaPercentual),
    entradasObservadas: numero(dados.entradasObservadas), saidasObservadas: numero(dados.saidasObservadas),
    ciclosCompletos: numero(dados.ciclosCompletos), permanenciaMediaMinutos: anulavel(dados.permanenciaMediaMinutos),
    rotatividadeObservada: anulavel(dados.rotatividadeObservada),
  }
}
export function formatarMetrica(valor: number | null | undefined, unidade = "", casas = 1) {
  return valor == null ? "Sem observação" : `${valor.toLocaleString("pt-BR", { maximumFractionDigits: casas })}${unidade}`
}
/** Arredonda apenas a apresentação; a API e as exportações preservam os minutos originais. */
export function formatarDuracao(minutos: number | null | undefined) {
  if (minutos == null) return "Sem observação"
  if (minutos > 0 && minutos < 1) return "< 1 min"
  const total = Math.round(minutos)
  const horas = Math.floor(total / 60), restante = total % 60
  return horas ? `${horas} h${restante ? ` ${restante} min` : ""}` : `${total} min`
}
export function lerAnaliseHistorica(dados: unknown): AnaliseHistorica {
  if (!objeto(dados) || typeof dados.temHistorico !== "boolean" || !objeto(dados.periodo)
    || typeof dados.periodo.inicioEm !== "string" || typeof dados.periodo.fimEm !== "string"
    || !Array.isArray(dados.porDia) || !Array.isArray(dados.porSetor)) throw new Error("Não foi possível consultar a análise histórica.")
  return {
    temHistorico: dados.temHistorico,
    periodo: { inicioEm: dados.periodo.inicioEm, fimEm: dados.periodo.fimEm },
    resumo: metrica(dados.resumo),
    porDia: dados.porDia.map(item => {
      if (!objeto(item) || typeof item.inicioEm !== "string") throw new Error("Série histórica inválida.")
      return { ...metrica(item), inicioEm: item.inicioEm }
    }),
    porSetor: dados.porSetor.map(item => {
      if (!objeto(item) || typeof item.setor !== "string") throw new Error("Setor histórico inválido.")
      return { ...metrica(item), setor: item.setor }
    }),
  }
}
