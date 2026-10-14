import type { AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento } from "@/types/estrutura"

export interface SetorRelatorio {
  nome: string
  total: number
  livres: number
  ocupadas: number
  semLeitura: number
  indisponiveis: number
}

/** A fotografia atual vem do mapa; métricas históricas só entram quando confirmadas. */
export function montarRelatorioAnalise(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null) {
  const setores: SetorRelatorio[] = estrutura.andares.flatMap((andar) => andar.setores.map((setor) => {
    const vagas = setor.vagas.filter((vaga) => vaga.ativo)
    return {
      nome: `${andar.nome} · ${setor.nome}`,
      total: vagas.length,
      livres: vagas.filter((vaga) => vaga.estadoAtual === "LIVRE").length,
      ocupadas: vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length,
      semLeitura: vagas.filter((vaga) => vaga.estadoAtual === "DESCONHECIDA").length,
      indisponiveis: vagas.filter((vaga) => vaga.estadoAtual === "INDISPONIVEL").length,
    }
  }))
  const totais = setores.reduce((acumulado, setor) => ({
    total: acumulado.total + setor.total,
    livres: acumulado.livres + setor.livres,
    ocupadas: acumulado.ocupadas + setor.ocupadas,
    semLeitura: acumulado.semLeitura + setor.semLeitura,
    indisponiveis: acumulado.indisponiveis + setor.indisponiveis,
  }), { total: 0, livres: 0, ocupadas: 0, semLeitura: 0, indisponiveis: 0 })
  return {
    shopping: estrutura.shopping.nome,
    geradoEm: new Date(),
    historico: historico?.temHistorico ? historico : null,
    totais,
    setores,
  }
}

export type RelatorioAnalise = ReturnType<typeof montarRelatorioAnalise>

export function nomeArquivoRelatorio(shopping: string, extensao: "xlsx" | "pdf") {
  const slug = shopping.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "shopping"
  return `vaggu-analise-${slug}-${new Date().toISOString().slice(0, 10)}.${extensao}`
}

export function baixarArquivo(arquivo: Blob, nome: string) {
  const url = URL.createObjectURL(arquivo)
  const link = document.createElement("a")
  link.href = url
  link.download = nome
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** A logo é opcional: falhas de decodificação não devem impedir o relatório. */
export async function carregarLogoRelatorio(): Promise<string | null> {
  try {
    const resposta = await fetch(`${import.meta.env.BASE_URL}assets/vaggu-logo-yellow.svg`)
    if (!resposta.ok) return null
    const svg = await resposta.blob()
    const url = URL.createObjectURL(svg)
    try {
      const imagem = new Image()
      imagem.src = url
      await imagem.decode()
      const canvas = document.createElement("canvas")
      canvas.width = 552
      canvas.height = 144
      const contexto = canvas.getContext("2d")
      if (!contexto) return null
      contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL("image/png")
    } finally {
      URL.revokeObjectURL(url)
    }
  } catch {
    return null
  }
}
