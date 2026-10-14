/** Produz o PDF da análise com o período, a comparação e a origem de cada série. */
import type { RelatorioAnalise } from "@/servicos/modelo-relatorio-analise"
import { carregarLogoRelatorio } from "@/servicos/modelo-relatorio-analise"

const ESCURO = "#171717"
const AMARELO = "#FFE100"
const CINZA = "#5E5E5E"

/** Exporta os dados disponíveis; séries sintéticas são identificadas como demonstração. */
export async function gerarPdfAnalise(relatorio: RelatorioAnalise): Promise<Blob> {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), carregarLogoRelatorio()])
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const largura = 210
  let y = 0

  function cabecalho(continuacao = false) {
    pdf.setFillColor(ESCURO)
    pdf.rect(0, 0, largura, continuacao ? 30 : 53, "F")
    if (logo) pdf.addImage(logo, "PNG", 15, 9, 47, 12)
    else {
      pdf.setTextColor(AMARELO)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(22)
      pdf.text("vaggu", 15, 19)
    }
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
    const textos = valores.map((valor, indice) => pdf.splitTextToSize(valor, larguras[indice] - 4) as string[])
    const altura = Math.max(9, ...textos.map((linhas) => linhas.length * 4 + 3))
    espaco(altura + 2)
    pdf.setFillColor(cabeca ? ESCURO : y % 2 < 1 ? "#F5F5F5" : "#FFFFFF")
    pdf.rect(15, y, 180, altura, "F")
    pdf.setTextColor(cabeca ? "#FFFFFF" : ESCURO)
    pdf.setFont("helvetica", cabeca ? "bold" : "normal")
    pdf.setFontSize(cabeca ? 8 : 8.5)
    let x = 18
    valores.forEach((valor, indice) => {
      const larguraColuna = larguras[indice]
      pdf.text(textos[indice], x, y + 5)
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
  if (relatorio.filtro) {
    pdf.text(`Filtro: ${relatorio.filtro.inicio} a ${relatorio.filtro.fim} (dias UTC inclusivos)`, 15, y)
    y += 7
  }
  const selo = relatorio.historico ? "HISTÓRICO CONFIRMADO + SITUAÇÃO ATUAL" : "SITUAÇÃO ATUAL · SEM HISTÓRICO CONFIRMADO"
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
    titulo("Histórico confirmado · período selecionado")
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
    const aviso = relatorio.demonstracaoAtiva
      ? "Ainda não há histórico confirmado. As séries abaixo são DEMONSTRAÇÃO — NÃO MEDIÇÃO."
      : "Não há medições confirmadas no período selecionado. Nenhuma série demonstrativa substitui esses dados."
    const linhas = pdf.splitTextToSize(aviso, 165)
    espaco(linhas.length * 5 + 5)
    pdf.text(linhas, 15, y)
    y += linhas.length * 5 + 7
  }

  if (relatorio.serieDiaria.length) {
    titulo(relatorio.historico ? "Gráficos diários · histórico confirmado" : "Gráficos diários · DEMONSTRAÇÃO — NÃO MEDIÇÃO")
    linhaTabela(["Dia", "Ocupação", "Entradas", "Saídas"], [55, 42, 42, 41], true)
    for (const dia of relatorio.serieDiaria) linhaTabela([
      dia.origem === "confirmado" ? new Date(dia.rotulo).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : dia.rotulo,
      `${dia.ocupacao.toFixed(1)}%`, String(dia.entradas), "saidas" in dia ? String(dia.saidas) : "Não apurado",
    ], [55, 42, 42, 41])
  }

  if (relatorio.comparacao) {
    titulo("Comparação com o período anterior · histórico confirmado")
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.text(`Anterior UTC: ${relatorio.comparacao.periodo.inicioEm} a ${relatorio.comparacao.periodo.fimEm}`, 15, y)
    y += 7
    linhaTabela(["Métrica", "Selecionado", "Anterior", "Variação"], [60, 40, 40, 40], true)
    const atual = relatorio.historico?.resumo
    const anterior = relatorio.comparacao.resumo
    for (const [nome, chave, unidade] of [["Ocupação", "ocupacaoPercentual", "%"], ["Cobertura", "coberturaPercentual", "%"], ["Entradas", "entradasObservadas", ""]] as const) {
      linhaTabela([nome, atual ? `${atual[chave]}${unidade}` : "Sem medição", `${anterior[chave]}${unidade}`, atual ? `${Number((atual[chave] - anterior[chave]).toFixed(2))}${unidade}` : "Não apurado"], [60, 40, 40, 40])
    }
  }

  if (relatorio.serieHoraria.length) {
    titulo("Ocupação por horário · DEMONSTRAÇÃO — NÃO MEDIÇÃO")
    linhaTabela(["Horário", "Ocupação", "Horário", "Ocupação"], [45, 45, 45, 45], true)
    for (let indice = 0; indice < relatorio.serieHoraria.length; indice += 2) {
      const primeiro = relatorio.serieHoraria[indice]
      const segundo = relatorio.serieHoraria[indice + 1]
      linhaTabela([primeiro.horario, `${primeiro.ocupacao}%`, segundo?.horario ?? "", segundo ? `${segundo.ocupacao}%` : ""], [45, 45, 45, 45])
    }
  }

  titulo(relatorio.origemTipos === "demonstração" ? "Tipo de vaga · DEMONSTRAÇÃO — NÃO MEDIÇÃO" : "Tipo de vaga · situação atual")
  linhaTabela(["Tipo", "Vagas no gráfico"], [120, 60], true)
  for (const tipo of relatorio.porTipo) linhaTabela([tipo.nome, String(tipo.quantidade)], [120, 60])

  titulo(relatorio.demonstracaoAtiva ? "Gráfico por setor · DEMONSTRAÇÃO — NÃO MEDIÇÃO" : "Gráfico por setor · situação atual")
  linhaTabela(["Setor", "Ocupadas"], [120, 60], true)
  for (const setor of relatorio.participacaoSetores) linhaTabela([setor.nome, String(setor.ocupadas)], [120, 60])

  if (relatorio.historico?.porSetor.length) {
    titulo("Ocupação por setor · histórico confirmado")
    linhaTabela(["Setor", "Ocupação", "Cobertura", "Entradas"], [75, 35, 35, 35], true)
    for (const setor of relatorio.historico.porSetor) linhaTabela([
      setor.setor, `${setor.ocupacaoPercentual.toFixed(1)}%`, `${setor.coberturaPercentual.toFixed(1)}%`, String(setor.entradasObservadas),
    ], [75, 35, 35, 35])
  }

  titulo("Setores · situação atual")
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
