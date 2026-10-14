/** Reúne a fotografia do mapa, o histórico confirmado e as séries de demonstração exibidas no painel. */
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

export const DIAS_DEMONSTRACAO = ["11 Mai", "12 Mai", "13 Mai", "14 Mai", "15 Mai", "16 Mai", "17 Mai"]
export const OCUPACAO_DIARIA_DEMONSTRACAO = [58, 62, 65, 70, 68, 72, 65]
export const OCUPACAO_HORARIA_DEMONSTRACAO = [18, 12, 9, 14, 22, 36, 51, 63, 72, 79, 84, 87, 82, 73, 61, 48, 39]

const NOMES_TIPO = { COMUM: "Convencional", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" } as const

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
  // Os gráficos do painel usam todas as vagas cadastradas; o resumo acima mantém apenas as ativas.
  const vagasDoPainel = estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas))
  const totalDoPainel = historico?.temHistorico ? vagasDoPainel.length : Math.max(vagasDoPainel.length, 16)
  const porTipo = (Object.keys(NOMES_TIPO) as (keyof typeof NOMES_TIPO)[]).map((tipo) => ({
    nome: NOMES_TIPO[tipo], quantidade: vagasDoPainel.filter((vaga) => vaga.tipo === tipo).length,
  }))
  const tiposDemonstrativos = porTipo.every((tipo) => tipo.quantidade === 0)
  // O painel preenche a categoria convencional apenas quando não existe nenhuma vaga cadastrada.
  if (tiposDemonstrativos) porTipo[0].quantidade = totalDoPainel
  const dadosConfirmados = historico?.temHistorico ? historico : null
  const setoresDoGrafico = (estrutura.andares.flatMap((andar) => andar.setores.map((setor) => ({
    nome: setor.nome, total: setor.vagas.length, ocupadasAtuais: setor.vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length,
  }))).slice(0, 4))
  const setoresDemonstrados = setoresDoGrafico.length ? setoresDoGrafico : [
    { nome: "Setor A", total: Math.ceil(totalDoPainel / 4), ocupadasAtuais: 0 },
    { nome: "Setor B", total: Math.floor(totalDoPainel / 4), ocupadasAtuais: 0 },
    { nome: "Setor C", total: Math.floor(totalDoPainel / 4), ocupadasAtuais: 0 },
    { nome: "Setor D", total: totalDoPainel - Math.ceil(totalDoPainel / 4) - Math.floor(totalDoPainel / 2), ocupadasAtuais: 0 },
  ]
  return {
    shopping: estrutura.shopping.nome,
    geradoEm: new Date(),
    historico: dadosConfirmados,
    totais,
    setores,
    porTipo,
    origemTipos: tiposDemonstrativos ? "demonstração" : "fotografia atual",
    participacaoSetores: setoresDemonstrados.map((setor, indice) => ({
      nome: setor.nome,
      ocupadas: dadosConfirmados ? setor.ocupadasAtuais : Math.round(setor.total * [66.7, 65.8, 65.6, 62.3][indice] / 100),
      origem: dadosConfirmados ? "fotografia atual" : "demonstração",
    })),
    serieDiaria: dadosConfirmados
      ? dadosConfirmados.porDia.map((dia) => ({ rotulo: dia.inicioEm, ocupacao: dia.ocupacaoPercentual, entradas: dia.entradasObservadas, origem: "confirmado" as const }))
      : DIAS_DEMONSTRACAO.map((rotulo, indice) => ({ rotulo, ocupacao: OCUPACAO_DIARIA_DEMONSTRACAO[indice], entradas: (42 + indice * 5 + (indice % 2) * 9) * 10, saidas: (38 + indice * 5 + ((indice + 1) % 2) * 8) * 10, origem: "demonstração" as const })),
    serieHoraria: dadosConfirmados ? [] : OCUPACAO_HORARIA_DEMONSTRACAO.map((ocupacao, indice) => ({ horario: `${String(indice + 6).padStart(2, "0")}h`, ocupacao })),
  }
}

export type RelatorioAnalise = ReturnType<typeof montarRelatorioAnalise>

/** Gera nome estável e seguro para download, sem usar o nome bruto do shopping como caminho. */
export function nomeArquivoRelatorio(shopping: string, extensao: "xlsx" | "pdf") {
  const slug = shopping.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "shopping"
  return `vaggu-analise-${slug}-${new Date().toISOString().slice(0, 10)}.${extensao}`
}

/** Inicia o download e libera a URL temporária após o navegador receber o clique. */
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
