/** Monta uma fotografia XLSX da estrutura já autorizada e carregada para o Admin. */
import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"

const CORES = {
  escuro: "FF171717",
  amarelo: "FFFFE100",
  branco: "FFFFFFFF",
  texto: "FF343231",
  alternado: "FFF7F7F7",
  borda: "FFE5E5E5",
  indisponivel: "FFE8E8E8",
} as const

const NOMES_TIPO: Record<TipoVaga, string> = {
  COMUM: "Comum",
  PCD: "PCD",
  IDOSO: "Idoso",
  ELETRICA: "Elétrica",
}

export interface ResumoEstrutura {
  andares: number
  setores: number
  vagas: number
  ativas: number
  inativas: number
  tipos: Record<TipoVaga, number>
}

/** Conta cada vaga uma vez; as categorias especiais já integram o total. */
export function resumirEstrutura(estrutura: EstruturaEstacionamento): ResumoEstrutura {
  const resumo: ResumoEstrutura = {
    andares: estrutura.andares.length,
    setores: 0,
    vagas: 0,
    ativas: 0,
    inativas: 0,
    tipos: { COMUM: 0, PCD: 0, IDOSO: 0, ELETRICA: 0 },
  }
  for (const andar of estrutura.andares) {
    resumo.setores += andar.setores.length
    for (const setor of andar.setores) {
      for (const vaga of setor.vagas) {
        resumo.vagas += 1
        resumo.tipos[vaga.tipo] += 1
        if (vaga.ativo) resumo.ativas += 1
        else resumo.inativas += 1
      }
    }
  }
  return resumo
}

function nomeArquivo(nomeShopping: string): string {
  const nomeSeguro = nomeShopping.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)
  return `vaggu-estrutura-${nomeSeguro || "shopping"}.xlsx`
}

function situacaoVaga(vaga: VagaEstrutura): string {
  if (vaga.estadoAtual === "DESCONHECIDA") return "Indisponível"
  return vaga.estadoAtual === "LIVRE" ? "Livre" : "Ocupada"
}

/** A biblioteca pesada só entra no navegador ao solicitar o download. */
export async function gerarPlanilhaEstrutura(estrutura: EstruturaEstacionamento): Promise<{ arquivo: Blob; nome: string }> {
  const { default: ExcelJS } = await import("exceljs")
  const livro = new ExcelJS.Workbook()
  livro.creator = "VAGGU"
  livro.created = new Date()
  livro.subject = `Estrutura do estacionamento de ${estrutura.shopping.nome}`

  const vagas = livro.addWorksheet("Vagas", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: CORES.amarelo } },
  })
  vagas.columns = [
    { header: "Código", key: "codigo", width: 20, style: { numFmt: "@" } },
    { header: "Andar", key: "andar", width: 26 },
    { header: "Setor", key: "setor", width: 24 },
    { header: "Categoria", key: "tipo", width: 18 },
    { header: "Estado", key: "estado", width: 20 },
    { header: "Cadastro", key: "cadastro", width: 16 },
  ]
  vagas.autoFilter = { from: "A1", to: "F1" }
  vagas.getRow(1).height = 30
  vagas.getRow(1).eachCell(celula => {
    celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CORES.escuro } }
    celula.font = { name: "Arial", size: 11, bold: true, color: { argb: CORES.branco } }
    celula.alignment = { vertical: "middle", horizontal: "center" }
    celula.border = { bottom: { style: "medium", color: { argb: CORES.amarelo } } }
  })

  // Códigos são identificadores textuais: zeros à esquerda e símbolos precisam sobreviver à abertura no Excel.
  for (const andar of estrutura.andares) {
    for (const setor of andar.setores) {
      for (const vaga of setor.vagas) {
        const linha = vagas.addRow({
          codigo: vaga.codigo,
          andar: andar.nome,
          setor: setor.nome,
          tipo: NOMES_TIPO[vaga.tipo],
          estado: situacaoVaga(vaga),
          cadastro: vaga.ativo ? "Ativa" : "Inativa",
        })
        linha.height = 23
        linha.eachCell(celula => {
          celula.font = { name: "Arial", size: 10, color: { argb: CORES.texto } }
          celula.alignment = { vertical: "middle" }
          if (linha.number % 2 === 0) celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CORES.alternado } }
          celula.border = { bottom: { style: "hair", color: { argb: CORES.borda } } }
        })
        linha.getCell(1).numFmt = "@"
        linha.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: CORES.escuro } }
        if (vaga.estadoAtual === "DESCONHECIDA") {
          linha.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: CORES.indisponivel } }
        }
        if (!vaga.ativo) linha.getCell(6).font = { name: "Arial", size: 10, italic: true, color: { argb: CORES.texto } }
      }
    }
  }

  const resumo = resumirEstrutura(estrutura)
  const geral = livro.addWorksheet("Resumo", { properties: { tabColor: { argb: CORES.escuro } } })
  geral.columns = [{ width: 30 }, { width: 22 }, { width: 10 }, { width: 42 }]
  geral.getCell("A1").value = "Estrutura do estacionamento"
  geral.getCell("A1").font = { name: "Arial", size: 16, bold: true, color: { argb: CORES.escuro } }
  geral.getCell("A2").value = estrutura.shopping.nome
  geral.getCell("A2").font = { name: "Arial", size: 12, color: { argb: CORES.texto } }
  geral.getCell("A4").value = "Indicador"
  geral.getCell("B4").value = "Quantidade"
  for (const celula of [geral.getCell("A4"), geral.getCell("B4")]) {
    celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CORES.escuro } }
    celula.font = { name: "Arial", size: 10, bold: true, color: { argb: CORES.branco } }
    celula.alignment = { vertical: "middle", horizontal: "center" }
  }
  geral.getRow(4).height = 28
  const indicadores: Array<[string, number]> = [
    ["Andares", resumo.andares], ["Setores", resumo.setores], ["Vagas cadastradas", resumo.vagas],
    ["Vagas ativas", resumo.ativas], ["Vagas inativas", resumo.inativas],
    ["Comuns", resumo.tipos.COMUM], ["PCD", resumo.tipos.PCD],
    ["Idosos", resumo.tipos.IDOSO], ["Elétricas", resumo.tipos.ELETRICA],
  ]
  for (const [rotulo, quantidade] of indicadores) {
    const linha = geral.addRow([rotulo, quantidade])
    linha.height = 23
    linha.getCell(1).font = { name: "Arial", size: 10, color: { argb: CORES.texto } }
    linha.getCell(2).font = { name: "Arial", size: 10, bold: true, color: { argb: CORES.escuro } }
    linha.getCell(2).numFmt = "#,##0"
    linha.getCell(2).alignment = { horizontal: "right", vertical: "middle" }
    if (linha.number % 2 === 0) for (const celula of [linha.getCell(1), linha.getCell(2)]) {
      celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CORES.alternado } }
    }
  }
  geral.getCell("A15").value = "Categorias PCD, idoso e elétrica já fazem parte do total de vagas."
  geral.getCell("A16").value = "Estado indisponível representa leitura desconhecida; não equivale a vaga livre."
  geral.getCell("A17").value = "Arquivo para consulta; uma importação não restaura estados ou desativações."
  for (const linha of [15, 16, 17]) {
    geral.getCell(`A${linha}`).font = { name: "Arial", size: 10, italic: true, color: { argb: CORES.texto } }
  }

  const dados = await livro.xlsx.writeBuffer()
  return {
    arquivo: new Blob([dados], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    nome: nomeArquivo(estrutura.shopping.nome),
  }
}
