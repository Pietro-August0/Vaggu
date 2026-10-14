/** Monta a planilha da análise com séries dos gráficos e origem explícita de cada dado. */
import type { RelatorioAnalise } from "@/servicos/modelo-relatorio-analise"
import { carregarLogoRelatorio } from "@/servicos/modelo-relatorio-analise"

const COR = { escuro: "FF171717", amarelo: "FFFFE100", branco: "FFFFFFFF", cinza: "FFF4F4F4", texto: "FF343434" }

/** Impede que nomes fornecidos pelo shopping sejam interpretados como fórmulas pelo Excel. */
function textoSeguro(valor: string) {
  return /^[=+@-]/.test(valor) ? `'${valor}` : valor
}

/** Exporta a fotografia atual e as séries exibidas; valores genéricos recebem identificação de demonstração. */
export async function gerarPlanilhaAnalise(relatorio: RelatorioAnalise): Promise<Blob> {
  const [{ default: ExcelJS }, logo] = await Promise.all([import("exceljs"), carregarLogoRelatorio()])
  const livro = new ExcelJS.Workbook()
  livro.creator = "VAGGU"
  livro.subject = `Análise do estacionamento ${relatorio.shopping}`
  livro.created = relatorio.geradoEm
  const resumo = livro.addWorksheet("Resumo", { properties: { tabColor: { argb: COR.amarelo } } })
  resumo.columns = [{ width: 24 }, { width: 19 }, { width: 19 }, { width: 19 }, { width: 19 }, { width: 19 }]
  resumo.mergeCells("A1:F3")
  resumo.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR.escuro } }
  if (logo) {
    const imagemId = livro.addImage({ base64: logo, extension: "png" })
    resumo.addImage(imagemId, { tl: { col: 0.3, row: 0.45 }, ext: { width: 184, height: 48 } })
  } else {
    resumo.getCell("A1").value = "vaggu"
    resumo.getCell("A1").font = { name: "Arial", size: 26, bold: true, color: { argb: COR.amarelo } }
    resumo.getCell("A1").alignment = { vertical: "middle" }
  }
  resumo.getRow(1).height = 28
  resumo.getRow(2).height = 22
  resumo.getRow(3).height = 22
  resumo.mergeCells("A5:F5")
  resumo.getCell("A5").value = "ANÁLISE DO ESTACIONAMENTO"
  resumo.getCell("A5").font = { name: "Arial", size: 18, bold: true, color: { argb: COR.escuro } }
  resumo.getRow(5).height = 34
  resumo.mergeCells("A6:F6")
  resumo.getCell("A6").value = textoSeguro(relatorio.shopping)
  resumo.getCell("A6").font = { name: "Arial", size: 12, color: { argb: COR.texto } }
  resumo.mergeCells("A8:F8")
  resumo.getCell("A8").value = relatorio.cenarioFicticio ? "CENÁRIO FICTÍCIO · APRESENTAÇÃO" : relatorio.historico ? "HISTÓRICO CONFIRMADO + SITUAÇÃO ATUAL" : "SITUAÇÃO ATUAL · SEM HISTÓRICO CONFIRMADO"
  resumo.getCell("A8").fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR.amarelo } }
  resumo.getCell("A8").font = { name: "Arial", size: 10, bold: true, color: { argb: COR.escuro } }
  resumo.getRow(8).height = 28
  resumo.getCell("A10").value = "Gerado em"
  resumo.getCell("B10").value = relatorio.geradoEm
  resumo.getCell("B10").numFmt = "dd/mm/yyyy hh:mm"
  resumo.getCell("A12").value = "VAGAS ATIVAS"
  resumo.getCell("B12").value = "LIVRES"
  resumo.getCell("C12").value = "OCUPADAS"
  resumo.getCell("D12").value = "SEM LEITURA"
  resumo.getCell("E12").value = "INDISPONÍVEIS"
  resumo.getCell("A13").value = relatorio.totais.total
  resumo.getCell("B13").value = relatorio.totais.livres
  resumo.getCell("C13").value = relatorio.totais.ocupadas
  resumo.getCell("D13").value = relatorio.totais.semLeitura
  resumo.getCell("E13").value = relatorio.totais.indisponiveis
  for (const linha of [12, 13]) {
    resumo.getRow(linha).height = linha === 12 ? 28 : 38
    for (let coluna = 1; coluna <= 5; coluna += 1) {
      const celula = resumo.getCell(linha, coluna)
      celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: linha === 12 ? COR.escuro : COR.cinza } }
      celula.font = { name: "Arial", size: linha === 12 ? 9 : 21, bold: true, color: { argb: linha === 12 ? COR.branco : COR.escuro } }
      celula.alignment = { horizontal: "center", vertical: "middle" }
    }
  }
  resumo.mergeCells("A16:F16")
  resumo.getCell("A16").value = "Sem leitura e indisponível não são vagas livres. Os totais atuais vêm do mapa."
  resumo.getCell("A16").font = { name: "Arial", italic: true, size: 10, color: { argb: COR.texto } }
  resumo.mergeCells("A18:F18")
  resumo.getCell("A18").value = relatorio.filtro
    ? `Filtro aplicado (dias UTC inclusivos): ${relatorio.filtro.inicio} a ${relatorio.filtro.fim}`
    : relatorio.historico
      ? `Período histórico (UTC): ${relatorio.historico.periodo.inicioEm} a ${relatorio.historico.periodo.fimEm}`
      : "Período padrão: últimos sete dias UTC. Sem histórico confirmado."
  resumo.getCell("A18").alignment = { wrapText: true, vertical: "middle" }
  resumo.getRow(18).height = 38
  resumo.getCell("A18").font = { name: "Arial", size: 10, color: { argb: COR.texto } }
  resumo.mergeCells("A20:F20")
  resumo.getCell("A20").value = relatorio.comparacao
    ? `Comparação: ${relatorio.comparacao.periodo.inicioEm} a ${relatorio.comparacao.periodo.fimEm} (UTC)`
    : relatorio.filtro ? "Comparação: sem medições confirmadas no período anterior." : "Comparação: não aplicada."
  resumo.getCell("A20").alignment = { wrapText: true, vertical: "middle" }
  resumo.getRow(20).height = 38

  const setores = livro.addWorksheet("Setores", { views: [{ state: "frozen", ySplit: 1 }], properties: { tabColor: { argb: COR.escuro } } })
  setores.columns = [
    { header: "Andar · setor", width: 38 }, { header: "Vagas ativas", width: 18 },
    { header: "Livres", width: 16 }, { header: "Ocupadas", width: 16 },
    { header: "Sem leitura", width: 18 }, { header: "Indisponíveis", width: 18 },
  ]
  for (const setor of relatorio.setores) setores.addRow([textoSeguro(setor.nome), setor.total, setor.livres, setor.ocupadas, setor.semLeitura, setor.indisponiveis])
  if (relatorio.setores.length === 0) setores.addRow(["Nenhum setor cadastrado", 0, 0, 0, 0, 0])
  setores.autoFilter = { from: "A1", to: `F${Math.max(2, setores.rowCount)}` }
  for (const linha of setores.getRows(1, setores.rowCount) ?? []) {
    linha.height = linha.number === 1 ? 30 : 24
    linha.eachCell((celula) => {
      celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: linha.number === 1 ? COR.escuro : linha.number % 2 === 0 ? COR.branco : COR.cinza } }
      celula.font = { name: "Arial", size: 10, bold: linha.number === 1, color: { argb: linha.number === 1 ? COR.branco : COR.texto } }
      celula.alignment = { vertical: "middle" }
    })
  }
  if (relatorio.historico) {
    const historico = livro.addWorksheet("Histórico por dia", { views: [{ state: "frozen", ySplit: 1 }], properties: { tabColor: { argb: COR.amarelo } } })
    historico.columns = [
      { header: relatorio.cenarioFicticio ? "Dia fictício UTC" : "Dia UTC", width: 26 }, { header: "Ocupação %", width: 20 },
      { header: "Cobertura %", width: 20 }, { header: "Entradas observadas", width: 23 },
    ]
    for (const dia of relatorio.historico.porDia) historico.addRow([new Date(dia.inicioEm), dia.ocupacaoPercentual, dia.coberturaPercentual, dia.entradasObservadas])
    historico.getColumn(1).numFmt = "dd/mm/yyyy hh:mm"
    historico.getColumn(2).numFmt = '0.0"%"'
    historico.getColumn(3).numFmt = '0.0"%"'
    historico.autoFilter = { from: "A1", to: `D${Math.max(2, historico.rowCount)}` }
    for (const linha of historico.getRows(1, historico.rowCount) ?? []) {
      linha.height = 26
      linha.eachCell((celula) => {
        celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: linha.number === 1 ? COR.escuro : linha.number % 2 === 0 ? COR.branco : COR.cinza } }
        celula.font = { name: "Arial", size: 10, bold: linha.number === 1, color: { argb: linha.number === 1 ? COR.branco : COR.texto } }
        celula.alignment = { vertical: "middle" }
      })
    }
  }
  if (relatorio.comparacao) {
    const comparacao = livro.addWorksheet("Comparação")
    comparacao.columns = [{ header: "Métrica", width: 30 }, { header: "Período selecionado", width: 24 }, { header: "Período anterior", width: 24 }, { header: "Variação", width: 20 }]
    const atual = relatorio.historico?.resumo
    const anterior = relatorio.comparacao.resumo
    for (const [nome, chave] of [["Ocupação %", "ocupacaoPercentual"], ["Cobertura %", "coberturaPercentual"], ["Entradas observadas", "entradasObservadas"]] as const) {
      comparacao.addRow([nome, atual?.[chave] ?? "Sem medição", anterior[chave], atual ? Number((atual[chave] - anterior[chave]).toFixed(2)) : "Não apurado"])
    }
  }
  const series = livro.addWorksheet("Gráficos por dia", { views: [{ state: "frozen", ySplit: 1 }] })
  series.columns = [
    { header: "Origem", width: 20 }, { header: "Dia (UTC se histórico)", width: 27 },
    { header: "Ocupação %", width: 19 }, { header: "Entradas", width: 18 }, { header: "Saídas", width: 18 },
  ]
  for (const dia of relatorio.serieDiaria) series.addRow([
    dia.origem, textoSeguro(dia.rotulo), dia.ocupacao, dia.entradas, "saidas" in dia ? dia.saidas : "Não apurado",
  ])
  if (!relatorio.serieDiaria.length) series.addRow(["Sem medições confirmadas", "", "Não apurado", "Não apurado", "Não apurado"])
  series.getColumn(3).numFmt = '0.0"%"'
  const tipos = livro.addWorksheet("Tipos de vaga")
  tipos.columns = [{ header: "Origem", width: 22 }, { header: "Tipo", width: 24 }, { header: "Vagas no gráfico", width: 20 }]
  for (const tipo of relatorio.porTipo) tipos.addRow([relatorio.origemTipos, tipo.nome, tipo.quantidade])
  const participacao = livro.addWorksheet("Gráfico por setor")
  participacao.columns = [{ header: "Origem", width: 25 }, { header: "Setor", width: 42 }, { header: "Ocupadas", width: 18 }]
  for (const setor of relatorio.participacaoSetores) participacao.addRow([setor.origem, textoSeguro(setor.nome), setor.ocupadas])
  const horarios = livro.addWorksheet("Ocupação por horário")
  horarios.columns = [{ header: "Origem", width: 22 }, { header: "Horário", width: 18 }, { header: "Ocupação %", width: 20 }]
  if (relatorio.serieHoraria.length) {
    for (const horario of relatorio.serieHoraria) horarios.addRow(["Demonstração", horario.horario, horario.ocupacao])
  } else horarios.addRow(["Sem histórico horário confirmado", "", "Não apurado"])
  horarios.getColumn(3).numFmt = '0.0"%"'
  const setoresHistoricos = livro.addWorksheet("Ocupação histórica setor")
  setoresHistoricos.columns = [
    { header: "Origem", width: 22 }, { header: "Setor", width: 42 },
    { header: "Ocupação %", width: 20 }, { header: "Cobertura %", width: 20 }, { header: "Entradas", width: 18 },
  ]
  if (relatorio.historico?.porSetor.length) {
    for (const setor of relatorio.historico.porSetor) setoresHistoricos.addRow([
      relatorio.cenarioFicticio ? "Histórico fictício" : "Histórico confirmado", textoSeguro(setor.setor), setor.ocupacaoPercentual, setor.coberturaPercentual, setor.entradasObservadas,
    ])
  } else setoresHistoricos.addRow(["Sem histórico confirmado", "", "Não apurado", "Não apurado", "Não apurado"])
  setoresHistoricos.getColumn(3).numFmt = '0.0"%"'
  setoresHistoricos.getColumn(4).numFmt = '0.0"%"'
  const dados = await livro.xlsx.writeBuffer()
  return new Blob([dados], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}
