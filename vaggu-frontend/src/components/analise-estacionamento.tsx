/** Exibe a análise demonstrativa do shopping atual sem persistir eventos sintéticos no histórico real. */
import { useEffect, useMemo, useState } from "react"
import { Accessibility, CarFront, CircleParking, Clock3, Download, PlugZap, RefreshCw, type LucideIcon } from "lucide-react"

import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { lerEstrutura } from "@/servicos/estrutura"
import { lerAnaliseHistorica, type AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

const dias = ["11 Mai", "12 Mai", "13 Mai", "14 Mai", "15 Mai", "16 Mai", "17 Mai"]
const ocupacaoDiaria = [58, 62, 65, 70, 68, 72, 65]
const ocupacaoHoraria = [18, 12, 9, 14, 22, 36, 51, 63, 72, 79, 84, 87, 82, 73, 61, 48, 39]

const tipos: Record<TipoVaga, { nome: string; cor: string }> = {
  COMUM: { nome: "Convencional", cor: "#ffe100" },
  PCD: { nome: "PCD", cor: "#168df2" },
  IDOSO: { nome: "Idoso", cor: "#84bd21" },
  ELETRICA: { nome: "Elétrica", cor: "#23a55a" },
}

/** Produz valores estáveis para a demonstração e mantém a capacidade ligada ao shopping consultado. */
function criarDemonstracao(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null) {
  const vagas = estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas))
  const total = historico?.temHistorico ? vagas.length : Math.max(vagas.length, 16)
  const ocupadasAtuais = vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length
  const livresAtuais = vagas.filter((vaga) => vaga.estadoAtual === "LIVRE").length
  const ocupadas = historico?.temHistorico ? ocupadasAtuais : Math.round(total * 0.651)
  const livres = historico?.temHistorico ? livresAtuais : total - ocupadas
  const especiais = vagas.filter((vaga) => vaga.tipo !== "COMUM").length || Math.max(3, Math.round(total * 0.08))
  const setoresOriginais = estrutura.andares.flatMap((andar) => andar.setores.map((setor) => ({
    nome: setor.nome,
    total: setor.vagas.length,
  })))
  const setores = (setoresOriginais.length > 0 ? setoresOriginais : [
    { nome: "Setor A", total: Math.ceil(total / 4) },
    { nome: "Setor B", total: Math.floor(total / 4) },
    { nome: "Setor C", total: Math.floor(total / 4) },
    { nome: "Setor D", total: total - Math.ceil(total / 4) - Math.floor(total / 2) },
  ]).map((setor, indice) => {
    const taxaReal = historico?.porSetor.find((item) => item.setor === setor.nome)?.ocupacaoPercentual
    const taxa = taxaReal ?? [66.7, 65.8, 65.6, 62.3][indice % 4]
    const ocupadasSetor = Math.round(setor.total * taxa / 100)
    return { ...setor, ocupadas: ocupadasSetor, livres: Math.max(0, setor.total - ocupadasSetor), taxa, permanencia: ["01h22", "01h15", "01h20", "01h12"][indice % 4], rotatividade: [4.23, 4.67, 4.45, 4.19][indice % 4] }
  })
  const porTipo = Object.keys(tipos).map((tipo) => ({
    tipo: tipo as TipoVaga,
    quantidade: vagas.filter((vaga) => vaga.tipo === tipo).length,
  }))
  if (porTipo.every((item) => item.quantidade === 0)) porTipo[0].quantidade = total

  return { total, ocupadas, livres, especiais, setores, porTipo }
}

function GraficoLinha({ rotulos, valores }: { rotulos: string[]; valores: number[] }) {
  const maior = Math.max(...valores, 1)
  const pontos = valores.map((valor, indice) => `${8 + indice * (91 / Math.max(1, valores.length - 1))},${50 - valor / maior * 38}`).join(" ")
  return <div className="grafico-linha" role="group" aria-label={`Taxa de ocupação no período, entre ${Math.min(...valores).toFixed(0)}% e ${Math.max(...valores).toFixed(0)}%.`}>
    <svg viewBox="0 0 100 54" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="area-amarela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe100" stopOpacity=".42"/><stop offset="1" stopColor="#ffe100" stopOpacity="0"/></linearGradient></defs>
      <path d={`M ${pontos} L 99 52 L 8 52 Z`} fill="url(#area-amarela)" />
      <polyline className="grafico-linha-tracado" points={pontos} fill="none" stroke="#ffe100" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
    </svg>
    <TooltipProvider><div className="grafico-pontos" aria-label="Detalhes por dia">{valores.map((valor, indice) => <Tooltip key={rotulos[indice]}><TooltipTrigger asChild><button type="button" style={{ left: `${8 + indice * (91 / Math.max(1, valores.length - 1))}%`, top: `${(50 - valor / maior * 38) / 54 * 100}%` }} aria-label={`${rotulos[indice]}: ${valor.toFixed(1).replace(".", ",")}% de ocupação`}><span /></button></TooltipTrigger><TooltipContent side="top"><strong>{rotulos[indice]}</strong> · {valor.toFixed(1).replace(".", ",")}% ocupado</TooltipContent></Tooltip>)}</div></TooltipProvider>
    <div className="grafico-eixo">{rotulos.map((dia) => <span key={dia}>{dia}</span>)}</div>
  </div>
}

function CartaoMetrica({ titulo, valor, apoio, cor, icone: Icon }: { titulo: string; valor: string; apoio: string; cor: string; icone: LucideIcon }) {
  return <article className="analise-card-metrica">
    <div className="analise-icone" style={{ color: cor }}><Icon aria-hidden="true" /></div>
    <div><p>{titulo}</p><strong>{valor}</strong><small>{apoio}</small></div>
  </article>
}

/** Carrega o shopping real da sessão e monta os gráficos solicitados com dados explicitamente genéricos. */
export function AnaliseEstacionamento() {
  const { consultar } = useAppStore()
  const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [historico, setHistorico] = useState<AnaliseHistorica | null>(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    let ativo = true
    Promise.all([
      consultar("/estacionamento/estrutura").then(lerEstrutura),
      consultar("/estacionamento/analise").then(lerAnaliseHistorica).catch(() => null),
    ]).then(([estruturaRecebida, historicoRecebido]) => {
      if (ativo) { setEstrutura(estruturaRecebida); setHistorico(historicoRecebido) }
    }).catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível carregar a análise.") })
    return () => { ativo = false }
  }, [consultar])

  const demonstracao = useMemo(() => estrutura ? criarDemonstracao(estrutura, historico) : null, [estrutura, historico])
  if (erro) return <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-950/40 p-5 text-red-200">{erro}</p>
  if (!estrutura || !demonstracao) return <p role="status" className="rounded-2xl bg-[#232323] p-6 text-neutral-200">Carregando análise do estacionamento...</p>

  const coresSetor = ["#ffe100", "#84bd21", "#ef4938", "#4d79bd"]
  const totalTipos = demonstracao.porTipo.reduce((soma, item) => soma + item.quantidade, 0) || 1
  const gradienteTipos = demonstracao.porTipo.map((item, indice, itens) => {
    const inicio = itens.slice(0, indice).reduce((soma, anterior) => soma + anterior.quantidade, 0) / totalTipos * 100
    const fim = inicio + item.quantidade / totalTipos * 100
    return `${tipos[item.tipo].cor} ${inicio}% ${fim}%`
  }).join(", ")
  const setoresDoGrafico = demonstracao.setores.slice(0, 4)
  const totalOcupadoSetores = setoresDoGrafico.reduce((soma, setor) => soma + setor.ocupadas, 0)
  const gradienteSetores = setoresDoGrafico.map((setor, indice, setores) => {
    const pesos = totalOcupadoSetores > 0 ? setores.map((item) => item.ocupadas) : setores.map(() => 1)
    const totalPesos = pesos.reduce((soma, valor) => soma + valor, 0)
    const inicio = pesos.slice(0, indice).reduce((soma, valor) => soma + valor, 0) / totalPesos * 100
    const fim = inicio + pesos[indice] / totalPesos * 100
    return `${coresSetor[indice]} ${inicio}% ${fim}%`
  }).join(",")
  const dadosReais = historico?.temHistorico === true
  const serieDiaria = dadosReais ? historico.porDia.map((item) => item.ocupacaoPercentual) : ocupacaoDiaria
  const rotulosDiarios = dadosReais ? historico.porDia.map((item) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(item.inicioEm)).replace(" de ", " ")) : dias
  const periodo = dadosReais ? `${rotulosDiarios[0]} a ${rotulosDiarios.at(-1)}` : "11 a 17 de maio"

  return <section className="analise-estacionamento" aria-labelledby="titulo-analise">
    <header className="analise-cabecalho">
      <div><p className={`analise-selo ${dadosReais ? "analise-selo-real" : ""}`}>{dadosReais ? "Histórico confirmado" : "Dados genéricos · demonstração"}</p><h2 id="titulo-analise">Análise do estacionamento</h2><p>{estrutura.shopping.nome} · período de {periodo}</p></div>
      <div className="analise-acoes"><Button type="button" variant="outline" disabled><RefreshCw aria-hidden="true"/>{dadosReais ? "Histórico carregado" : "Atualização simulada"}</Button><Button type="button" disabled><Download aria-hidden="true"/>Exportar</Button></div>
    </header>

    <div className="analise-metricas">
      <CartaoMetrica titulo="Vagas totais" valor={demonstracao.total.toLocaleString("pt-BR")} apoio="100% da capacidade" cor="#ffe100" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas livres" valor={demonstracao.livres.toLocaleString("pt-BR")} apoio={`${(demonstracao.livres / demonstracao.total * 100).toFixed(1).replace(".", ",")}% do total`} cor="#20bf39" icone={CircleParking}/>
      <CartaoMetrica titulo="Vagas ocupadas" valor={demonstracao.ocupadas.toLocaleString("pt-BR")} apoio={`${(demonstracao.ocupadas / demonstracao.total * 100).toFixed(1).replace(".", ",")}% do total`} cor="#f1161c" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas especiais" valor={demonstracao.especiais.toLocaleString("pt-BR")} apoio="PCD, idoso e elétrica" cor="#168df2" icone={Accessibility}/>
    </div>

    <div className="analise-grade-principal">
      <article className="analise-painel analise-linha"><div className="analise-titulo"><div><h3>Taxa de ocupação</h3><p>Média diária do período</p></div><span>Por dia</span></div><GraficoLinha rotulos={rotulosDiarios} valores={serieDiaria}/></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por setor</h3><p>Participação no total ocupado</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca" style={{ background: `conic-gradient(${gradienteSetores})` }}><span><strong>{demonstracao.ocupadas}</strong>ocupadas</span></div><ul>{setoresDoGrafico.map((setor, indice) => <li key={setor.nome}><i style={{ background: coresSetor[indice] }}/><span>{setor.nome}</span><strong>{setor.ocupadas}</strong></li>)}</ul></div></article>
      <article className="analise-painel analise-resumo"><div className="analise-titulo"><div><h3>Resumo do período</h3><p>{dadosReais ? "Calculado sobre eventos confirmados" : "Comparação demonstrativa"}</p></div></div><dl><div><Clock3/><dt>Taxa de ocupação</dt><dd>{dadosReais ? `${historico.resumo.ocupacaoPercentual.toFixed(1).replace(".", ",")}%` : "65,1%"}</dd></div><div><CarFront/><dt>Entradas observadas</dt><dd>{dadosReais ? historico.resumo.entradasObservadas.toLocaleString("pt-BR") : "5.842"}</dd></div><div><RefreshCw/><dt>Rotatividade</dt><dd>{dadosReais ? "Em evolução" : "4,51"}</dd></div><div><PlugZap/><dt>Cobertura dos sensores</dt><dd>{dadosReais ? `${historico.resumo.coberturaPercentual.toFixed(1).replace(".", ",")}%` : "92%"}</dd></div></dl></article>
    </div>

    <div className="analise-grade-secundaria">
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Entradas x saídas</h3><p>Movimentação diária</p></div></div><TooltipProvider><div className="barras-duplas">{dias.map((dia, indice) => { const entradas = 42 + indice * 5 + (indice % 2) * 9; const saidas = 38 + indice * 5 + ((indice + 1) % 2) * 8; return <div key={dia}><Tooltip><TooltipTrigger asChild><button type="button" className="barra-entrada" style={{ height: `${entradas}%` }} aria-label={`${dia}: ${entradas * 10} entradas`} /></TooltipTrigger><TooltipContent>{dia} · {entradas * 10} entradas</TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><button type="button" className="barra-saida" style={{ height: `${saidas}%` }} aria-label={`${dia}: ${saidas * 10} saídas`} /></TooltipTrigger><TooltipContent>{dia} · {saidas * 10} saídas</TooltipContent></Tooltip><small>{dia.replace(" Mai", "")}</small></div> })}</div></TooltipProvider></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por horário</h3><p>Média ao longo do dia</p></div></div><TooltipProvider><div className="barras-horario">{ocupacaoHoraria.map((valor, indice) => <Tooltip key={indice}><TooltipTrigger asChild><button type="button" style={{ height: `${valor}%` }} aria-label={`${String(indice + 6).padStart(2, "0")}h: ${valor}% de ocupação`} /></TooltipTrigger><TooltipContent>{String(indice + 6).padStart(2, "0")}h · {valor}% ocupado</TooltipContent></Tooltip>)}</div></TooltipProvider><div className="grafico-eixo"><span>06h</span><span>12h</span><span>18h</span><span>22h</span></div></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Tipo de vaga</h3><p>Distribuição da capacidade</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca compacta" style={{ background: `conic-gradient(${gradienteTipos})` }}><span><strong>{demonstracao.total}</strong>total</span></div><ul>{demonstracao.porTipo.map((item) => <li key={item.tipo}><i style={{ background: tipos[item.tipo].cor }}/><span>{tipos[item.tipo].nome}</span><strong>{item.quantidade}</strong></li>)}</ul></div></article>
    </div>

    <article className="analise-painel analise-tabela"><div className="analise-titulo"><div><h3>Desempenho por setor</h3><p>Indicadores demonstrativos associados à estrutura atual</p></div></div><div className="analise-tabela-scroll"><table><thead><tr><th>Setor</th><th>Vagas totais</th><th>Ocupadas</th><th>Livres</th><th>Taxa de ocupação</th><th>Tempo médio</th><th>Rotatividade</th></tr></thead><tbody>{demonstracao.setores.map((setor, indice) => <tr key={`${setor.nome}-${indice}`}><th scope="row"><i style={{ background: coresSetor[indice % 4] }}/>{setor.nome}</th><td>{setor.total}</td><td>{setor.ocupadas}</td><td>{setor.livres}</td><td><span className="taxa-setor"><b style={{ width: `${setor.taxa}%` }}/></span>{setor.taxa.toFixed(1).replace(".", ",")}%</td><td>{setor.permanencia}</td><td>{setor.rotatividade.toFixed(2).replace(".", ",")}</td></tr>)}</tbody></table></div></article>
  </section>
}
