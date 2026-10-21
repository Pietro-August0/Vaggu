/** Reúne somente a fotografia atual e os eventos efetivamente recebidos da API. */
import type { AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

export interface OpcoesRelatorioAnalise {
  periodoSelecionado?: { inicio: string; fim: string }
  comparacao?: AnaliseHistorica | null
  setorId?: string
  tipo?: TipoVaga | ""
}
const NOMES_TIPO = { COMUM: "Convencional", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" } as const

export function montarRelatorioAnalise(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null, opcoes: OpcoesRelatorioAnalise = {}) {
  const setores = estrutura.andares.filter(a => a.ativo).flatMap(andar => andar.setores.filter(setor => setor.ativo && (!opcoes.setorId || setor.id === opcoes.setorId)).map(setor => {
    const vagas = setor.vagas.filter(vaga => vaga.ativo && (!opcoes.tipo || vaga.tipo === opcoes.tipo))
    return { nome: `${andar.nome} · ${setor.nome}`, vagas, total: vagas.length,
      livres: vagas.filter(v => v.estadoAtual === "LIVRE").length, ocupadas: vagas.filter(v => v.estadoAtual === "OCUPADA").length,
      semLeitura: vagas.filter(v => v.estadoAtual === "DESCONHECIDA").length, indisponiveis: vagas.filter(v => v.estadoAtual === "INDISPONIVEL").length }
  }))
  const vagas = setores.flatMap(s => s.vagas)
  const totais = setores.reduce((a, s) => ({ total: a.total + s.total, livres: a.livres + s.livres, ocupadas: a.ocupadas + s.ocupadas, semLeitura: a.semLeitura + s.semLeitura, indisponiveis: a.indisponiveis + s.indisponiveis }), { total: 0, livres: 0, ocupadas: 0, semLeitura: 0, indisponiveis: 0 })
  const confirmado = historico?.temHistorico ? historico : null
  return {
    shopping: estrutura.shopping.nome, cenarioFicticio: estrutura.shopping.demonstracao === true, geradoEm: new Date(),
    historico: confirmado, filtro: opcoes.periodoSelecionado ?? null, comparacao: opcoes.comparacao?.temHistorico ? opcoes.comparacao : null,
    recorte: `${opcoes.setorId ? setores.map(s => s.nome).join(", ") || "Setor selecionado" : "Todos os setores"} · ${opcoes.tipo ? NOMES_TIPO[opcoes.tipo] : "Todas as categorias"}`,
    demonstracaoAtiva: false, totais, setores,
    porTipo: (Object.keys(NOMES_TIPO) as TipoVaga[]).map(tipo => ({ nome: NOMES_TIPO[tipo], quantidade: vagas.filter(v => v.tipo === tipo).length })),
    origemTipos: "situação atual" as string,
    participacaoSetores: setores.map(s => ({ nome: s.nome, ocupadas: s.ocupadas, origem: "situação atual" })),
    serieDiaria: confirmado ? confirmado.porDia.map(d => ({ rotulo: d.inicioEm, ocupacao: d.ocupacaoPercentual, entradas: d.entradasObservadas, saidas: d.saidasObservadas, origem: estrutura.shopping.demonstracao ? "fictício" as string : "confirmado" })) : [],
    serieHoraria: [] as { horario: string; ocupacao: number }[],
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
