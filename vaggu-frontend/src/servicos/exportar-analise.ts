import type { AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento } from "@/types/estrutura"

function celula(valor: string | number) {
  const texto = String(valor)
  const seguro = /^[=+@-]/.test(texto) ? `'${texto}` : texto
  return `"${seguro.replaceAll('"', '""')}"`
}

function linha(...valores: Array<string | number>) {
  return valores.map(celula).join(";")
}

/** Exporta somente indicadores observados; a ausência de histórico fica explícita no arquivo. */
export function gerarCsvAnalise(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null) {
  const linhas = [
    linha("VAGGU", "Análise do estacionamento"),
    linha("Shopping", estrutura.shopping.nome),
    linha("Origem", historico?.temHistorico ? "Histórico confirmado" : "Sem histórico confirmado"),
    linha("Início UTC", historico?.periodo.inicioEm ?? ""),
    linha("Fim UTC", historico?.periodo.fimEm ?? ""),
    "",
  ]
  if (historico?.temHistorico) {
    linhas.push(
      linha("Resumo", "Valor"),
      linha("Ocupação percentual", historico.resumo.ocupacaoPercentual),
      linha("Cobertura percentual", historico.resumo.coberturaPercentual),
      linha("Entradas observadas", historico.resumo.entradasObservadas),
      "",
      linha("Dia UTC", "Ocupação percentual", "Cobertura percentual", "Entradas observadas"),
      ...historico.porDia.map((dia) => linha(dia.inicioEm, dia.ocupacaoPercentual, dia.coberturaPercentual, dia.entradasObservadas)),
      "",
      linha("Setor", "Ocupação percentual", "Cobertura percentual", "Entradas observadas"),
      ...historico.porSetor.map((setor) => linha(setor.setor, setor.ocupacaoPercentual, setor.coberturaPercentual, setor.entradasObservadas)),
    )
  } else {
    linhas.push(linha("Aviso", "Os gráficos demonstrativos não foram exportados como dados observados."))
  }
  return `\uFEFF${linhas.join("\r\n")}\r\n`
}

export function baixarCsvAnalise(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null) {
  const blob = new Blob([gerarCsvAnalise(estrutura, historico)], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `vaggu-analise-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
