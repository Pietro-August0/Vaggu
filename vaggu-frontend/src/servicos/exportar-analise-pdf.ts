import type { RelatorioAnalise } from "@/servicos/modelo-relatorio-analise"
import { carregarLogoRelatorio } from "@/servicos/modelo-relatorio-analise"

const ESCURO = "#171717"
const AMARELO = "#FFE100"
const CINZA = "#5E5E5E"

export async function gerarPdfAnalise(relatorio: RelatorioAnalise): Promise<Blob> {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), carregarLogoRelatorio()])
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const largura = 210
  let y = 0

  function cabecalho(continuacao = false) {
    pdf.setFillColor(ESCURO)
    pdf.rect(0, 0, largura, continuacao ? 30 : 53, "F")
    pdf.addImage(logo, "PNG", 15, 9, 47, 12)
    pdf.setTextColor(AMARELO)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(continuacao ? 12 : 21)
    pdf.text(continuacao ? "Análise do estacionamento · continuação" : "Análise do estacionamento", 15, continuacao ? 26 : 37)
    y = continuacao ? 39 : 62
    pdf.setTextColor(ESCURO)
  }

  function espaco(altura: number) {
    if (y + altura <= 273) return
    pdf.addPage()
    cabecalho(true)
  }

  function titulo(texto: string) {
    espaco(35)
    pdf.setFillColor(AMARELO)
    pdf.roundedRect(15, y, 3, 9, 1, 1, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.setTextColor(ESCURO)
    pdf.text(texto, 22, y + 6.5)
    y += 15
  }

  function linhaTabela(valores: string[], larguras: number[], cabeca = false) {
    const altura = 9
    espaco(altura + 2)
    pdf.setFillColor(cabeca ? ESCURO : y % 2 < 1 ? "#F5F5F5" : "#FFFFFF")
    pdf.rect(15, y, 180, altura, "F")
    pdf.setTextColor(cabeca ? "#FFFFFF" : ESCURO)
    pdf.setFont("helvetica", cabeca ? "bold" : "normal")
    pdf.setFontSize(cabeca ? 8 : 8.5)
    let x = 18
    valores.forEach((valor, indice) => {
      const larguraColuna = larguras[indice]
      const texto = pdf.splitTextToSize(valor, larguraColuna - 4)[0] ?? ""
      pdf.text(texto, x, y + 6)
      x += larguraColuna
    })
    y += altura
  }

  cabecalho()
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(15)
  pdf.text(pdf.splitTextToSize(relatorio.shopping, 178), 15, y)
  y += Math.max(10, pdf.splitTextToSize(relatorio.shopping, 178).length * 7)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(CINZA)
  pdf.text(`Gerado em ${relatorio.geradoEm.toLocaleString("pt-BR")}`, 15, y)
  y += 7
  const selo = relatorio.historico ? "HISTÓRICO CONFIRMADO + FOTOGRAFIA ATUAL" : "FOTOGRAFIA ATUAL · SEM HISTÓRICO CONFIRMADO"
  pdf.setFillColor(AMARELO)
  pdf.roundedRect(15, y, 180, 10, 2, 2, "F")
  pdf.setTextColor(ESCURO)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8.5)
  pdf.text(selo, 20, y + 6.7)
  y += 19

  titulo("Situação atual das vagas")
  const cards = [
    ["VAGAS ATIVAS", relatorio.totais.total], ["LIVRES", relatorio.totais.livres],
    ["OCUPADAS", relatorio.totais.ocupadas], ["SEM LEITURA", relatorio.totais.semLeitura],
    ["INDISPONÍVEIS", relatorio.totais.indisponiveis],
  ] as const
  cards.forEach(([rotulo, valor], indice) => {
    const coluna = indice % 3
    const linha = Math.floor(indice / 3)
    const x = 15 + coluna * 62
    const topo = y + linha * 27
    pdf.setFillColor("#F3F3F3")
    pdf.roundedRect(x, topo, 57, 23, 3, 3, "F")
    pdf.setTextColor(CINZA)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(7.5)
    pdf.text(rotulo, x + 4, topo + 7)
    pdf.setTextColor(ESCURO)
    pdf.setFontSize(17)
    pdf.text(String(valor), x + 4, topo + 18)
  })
  y += 60
  pdf.setTextColor(CINZA)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8.5)
  pdf.text("Sem leitura e indisponível não são vagas livres.", 15, y)
  y += 8

  titulo("Distribuição do estado atual")
  const barras = [
    ["Livres", relatorio.totais.livres, "#23A55A"],
    ["Ocupadas", relatorio.totais.ocupadas, "#EF4938"],
    ["Sem leitura", relatorio.totais.semLeitura, "#777777"],
    ["Indisponíveis", relatorio.totais.indisponiveis, "#D49B00"],
  ] as const
  for (const [rotulo, valor, cor] of barras) {
    espaco(12)
    pdf.setFontSize(8.5)
    pdf.setTextColor(ESCURO)
    pdf.text(rotulo, 15, y + 5)
    pdf.setFillColor("#EAEAEA")
    pdf.roundedRect(57, y, 119, 6, 2, 2, "F")
    const proporcao = relatorio.totais.total > 0 ? valor / relatorio.totais.total : 0
    if (proporcao > 0) {
      pdf.setFillColor(cor)
      pdf.roundedRect(57, y, Math.max(2, 119 * proporcao), 6, 2, 2, "F")
    }
    pdf.text(String(valor), 181, y + 5)
    y += 12
  }

  if (relatorio.historico) {
    titulo("Histórico confirmado · últimos 7 dias")
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(CINZA)
    pdf.setFontSize(8)
    pdf.text(`Período UTC: ${relatorio.historico.periodo.inicioEm} a ${relatorio.historico.periodo.fimEm}`, 15, y)
    y += 8
    linhaTabela(["Ocupação", "Cobertura", "Entradas observadas"], [60, 60, 60], true)
    linhaTabela([
      `${relatorio.historico.resumo.ocupacaoPercentual.toFixed(1)}%`,
      `${relatorio.historico.resumo.coberturaPercentual.toFixed(1)}%`,
      String(relatorio.historico.resumo.entradasObservadas),
    ], [60, 60, 60])
    y += 7
    linhaTabela(["Dia UTC", "Ocupação", "Cobertura", "Entradas"], [55, 42, 42, 41], true)
    for (const dia of relatorio.historico.porDia) linhaTabela([
      new Date(dia.inicioEm).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
      `${dia.ocupacaoPercentual.toFixed(1)}%`, `${dia.coberturaPercentual.toFixed(1)}%`, String(dia.entradasObservadas),
    ], [55, 42, 42, 41])
  } else {
    titulo("Leitura do período")
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(CINZA)
    const aviso = "Ainda não há histórico confirmado para este período. Os gráficos demonstrativos do painel não foram incluídos como dados observados neste relatório."
    const linhas = pdf.splitTextToSize(aviso, 165)
    espaco(linhas.length * 5 + 5)
    pdf.text(linhas, 15, y)
    y += linhas.length * 5 + 7
  }

  titulo("Setores · fotografia atual")
  linhaTabela(["Andar · setor", "Ativas", "Livres", "Ocupadas", "Sem leitura", "Indisp."], [69, 20, 20, 25, 26, 20], true)
  if (relatorio.setores.length === 0) linhaTabela(["Nenhum setor cadastrado", "0", "0", "0", "0", "0"], [69, 20, 20, 25, 26, 20])
  for (const setor of relatorio.setores) linhaTabela([
    setor.nome, String(setor.total), String(setor.livres), String(setor.ocupadas),
    String(setor.semLeitura), String(setor.indisponiveis),
  ], [69, 20, 20, 25, 26, 20])

  for (let pagina = 1; pagina <= pdf.getNumberOfPages(); pagina += 1) {
    pdf.setPage(pagina)
    pdf.setDrawColor("#DDDDDD")
    pdf.line(15, 281, 195, 281)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(CINZA)
    pdf.text("VAGGU · Análise do estacionamento", 15, 287)
    pdf.text(`${pagina} / ${pdf.getNumberOfPages()}`, 195, 287, { align: "right" })
  }
  return pdf.output("blob")
}
