import type { RelatorioAnalise } from "@/servicos/modelo-relatorio-analise"
import { carregarLogoRelatorio } from "@/servicos/modelo-relatorio-analise"

const COR = { escuro: "FF171717", amarelo: "FFFFE100", branco: "FFFFFFFF", cinza: "FFF4F4F4", texto: "FF343434" }

function textoSeguro(valor: string) {
  return /^[=+@-]/.test(valor) ? `'${valor}` : valor
}

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
  resumo.getCell("A8").value = relatorio.historico ? "HISTÓRICO CONFIRMADO + FOTOGRAFIA ATUAL" : "FOTOGRAFIA ATUAL · SEM HISTÓRICO CONFIRMADO"
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
  resumo.getCell("A18").value = relatorio.historico
    ? `Período histórico (UTC): ${relatorio.historico.periodo.inicioEm} a ${relatorio.historico.periodo.fimEm}`
    : "Ainda não há leituras confirmadas para o período. Nenhuma métrica demonstrativa foi incluída neste arquivo."
  resumo.getCell("A18").alignment = { wrapText: true, vertical: "middle" }
  resumo.getRow(18).height = 38
  resumo.getCell("A18").font = { name: "Arial", size: 10, color: { argb: COR.texto } }

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
    const historico = livro.addWorksheet("Histórico 7 dias", { views: [{ state: "frozen", ySplit: 1 }], properties: { tabColor: { argb: COR.amarelo } } })
    historico.columns = [
      { header: "Dia UTC", width: 26 }, { header: "Ocupação %", width: 20 },
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
  const dados = await livro.xlsx.writeBuffer()
  return new Blob([dados], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}
