/** Exibe a análise demonstrativa do shopping atual sem persistir eventos sintéticos no histórico real. */
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Accessibility, CarFront, CircleParking, Clock3, Download, PlugZap, RefreshCw, type LucideIcon } from "lucide-react"

import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { lerEstrutura } from "@/servicos/estrutura"
import { lerAnaliseHistorica, type AnaliseHistorica } from "@/servicos/analise"
import { gerarPlanilhaAnalise } from "@/servicos/exportar-analise-xlsx"
import { gerarPdfAnalise } from "@/servicos/exportar-analise-pdf"
import { baixarArquivo, DIAS_DEMONSTRACAO, montarRelatorioAnalise, nomeArquivoRelatorio, OCUPACAO_DIARIA_DEMONSTRACAO, OCUPACAO_HORARIA_DEMONSTRACAO } from "@/servicos/modelo-relatorio-analise"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

const dias = DIAS_DEMONSTRACAO
const ocupacaoDiaria = OCUPACAO_DIARIA_DEMONSTRACAO
const ocupacaoHoraria = OCUPACAO_HORARIA_DEMONSTRACAO
const UM_DIA = 86_400_000

function validarPeriodo(inicio: string, fim: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fim)) return "Informe as duas datas."
  const inicioMs = Date.parse(`${inicio}T00:00:00.000Z`)
  const fimMs = Date.parse(`${fim}T00:00:00.000Z`)
  if (!Number.isFinite(inicioMs) || !Number.isFinite(fimMs) || new Date(inicioMs).toISOString().slice(0, 10) !== inicio || new Date(fimMs).toISOString().slice(0, 10) !== fim) return "Informe datas válidas."
  if (fimMs < inicioMs) return "A data final deve ser igual ou posterior à inicial."
  if (fimMs > Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`)) return "A data final não pode estar no futuro."
  if ((fimMs - inicioMs) / UM_DIA >= 31) return "Selecione até 31 dias."
  return ""
}

const tipos: Record<TipoVaga, { nome: string; cor: string }> = {
  COMUM: { nome: "Convencional", cor: "#ffe100" },
  PCD: { nome: "PCD", cor: "#168df2" },
  IDOSO: { nome: "Idoso", cor: "#84bd21" },
  ELETRICA: { nome: "Elétrica", cor: "#23a55a" },
}

/** Produz valores estáveis para a demonstração e mantém a capacidade ligada ao shopping consultado. */
function criarDemonstracao(estrutura: EstruturaEstacionamento, historico: AnaliseHistorica | null, demonstrar = true) {
  const vagas = estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas))
  const total = historico?.temHistorico || !demonstrar ? vagas.length : Math.max(vagas.length, 16)
  const ocupadasAtuais = vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length
  const livresAtuais = vagas.filter((vaga) => vaga.estadoAtual === "LIVRE").length
  const ocupadas = historico?.temHistorico || !demonstrar ? ocupadasAtuais : Math.round(total * 0.651)
  const livres = historico?.temHistorico || !demonstrar ? livresAtuais : total - ocupadas
  const especiaisReais = vagas.filter((vaga) => vaga.tipo !== "COMUM").length
  const especiais = historico?.temHistorico || !demonstrar ? especiaisReais : especiaisReais || Math.max(3, Math.round(total * 0.08))
  const setoresOriginais = estrutura.andares.flatMap((andar) => andar.setores.map((setor) => ({
    nome: setor.nome,
    total: setor.vagas.length,
    ocupadasAtuais: setor.vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length,
    livresAtuais: setor.vagas.filter((vaga) => vaga.estadoAtual === "LIVRE").length,
  })))
  const setores = (setoresOriginais.length > 0 || !demonstrar ? setoresOriginais : [
    { nome: "Setor A", total: Math.ceil(total / 4), ocupadasAtuais: 0, livresAtuais: 0 },
    { nome: "Setor B", total: Math.floor(total / 4), ocupadasAtuais: 0, livresAtuais: 0 },
    { nome: "Setor C", total: Math.floor(total / 4), ocupadasAtuais: 0, livresAtuais: 0 },
    { nome: "Setor D", total: total - Math.ceil(total / 4) - Math.floor(total / 2), ocupadasAtuais: 0, livresAtuais: 0 },
  ]).map((setor, indice) => {
    const taxaReal = historico?.porSetor.find((item) => item.setor === setor.nome)?.ocupacaoPercentual
    const taxa = taxaReal ?? (historico?.temHistorico || !demonstrar ? 0 : [66.7, 65.8, 65.6, 62.3][indice % 4])
    const ocupadasSetor = historico?.temHistorico || !demonstrar ? setor.ocupadasAtuais : Math.round(setor.total * taxa / 100)
    return { ...setor, ocupadas: ocupadasSetor, livres: historico?.temHistorico || !demonstrar ? setor.livresAtuais : Math.max(0, setor.total - ocupadasSetor), taxa, permanencia: historico?.temHistorico || !demonstrar ? null : ["01h22", "01h15", "01h20", "01h12"][indice % 4], rotatividade: historico?.temHistorico || !demonstrar ? null : [4.23, 4.67, 4.45, 4.19][indice % 4] }
  })
  const porTipo = Object.keys(tipos).map((tipo) => ({
    tipo: tipo as TipoVaga,
    quantidade: vagas.filter((vaga) => vaga.tipo === tipo).length,
  }))
  if (porTipo.every((item) => item.quantidade === 0)) porTipo[0].quantidade = total

  return { total, ocupadas, livres, especiais, setores, porTipo }
}

function GraficoLinha({ rotulos, valores }: { rotulos: string[]; valores: number[] }) {
  const [selecionado, setSelecionado] = useState<number | null>(null)
  const pontos = valores.map((valor, indice) => `${8 + indice * (91 / Math.max(1, valores.length - 1))},${50 - Math.min(100, Math.max(0, valor)) / 100 * 38}`).join(" ")
  return <div className="grafico-linha" role="group" aria-label={`Taxa de ocupação no período, entre ${Math.min(...valores).toFixed(0)}% e ${Math.max(...valores).toFixed(0)}%.`}>
    <svg viewBox="0 0 100 54" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="area-amarela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe100" stopOpacity=".42"/><stop offset="1" stopColor="#ffe100" stopOpacity="0"/></linearGradient></defs>
      <path d={`M ${pontos} L 99 52 L 8 52 Z`} fill="url(#area-amarela)" />
      <polyline className="grafico-linha-tracado" points={pontos} fill="none" stroke="#ffe100" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
    </svg>
    <TooltipProvider><div className="grafico-pontos" aria-label="Detalhes por dia">{valores.map((valor, indice) => <Tooltip key={rotulos[indice]}><TooltipTrigger asChild><button type="button" style={{ left: `${8 + indice * (91 / Math.max(1, valores.length - 1))}%`, top: `${(50 - Math.min(100, Math.max(0, valor)) / 100 * 38) / 54 * 100}%` }} aria-label={`${rotulos[indice]}: ${valor.toFixed(1).replace(".", ",")}% de ocupação`} aria-pressed={selecionado === indice} onClick={() => setSelecionado(indice)}><span /></button></TooltipTrigger><TooltipContent side="top"><strong>{rotulos[indice]}</strong> · {valor.toFixed(1).replace(".", ",")}% ocupado</TooltipContent></Tooltip>)}</div></TooltipProvider>
    <div className="grafico-eixo">{rotulos.map((dia) => <span key={dia}>{dia}</span>)}</div>
    {selecionado !== null && <p className="analise-detalhe-toque" role="status">{rotulos[selecionado]}: {valores[selecionado].toFixed(1).replace(".", ",")}% de ocupação</p>}
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
  const [erroExportacao, setErroExportacao] = useState("")
  const [exportando, setExportando] = useState<"xlsx" | "pdf" | null>(null)
  const [barraSelecionada, setBarraSelecionada] = useState("")
  const [horarioSelecionado, setHorarioSelecionado] = useState("")
  const [inicio, setInicio] = useState("")
  const [fim, setFim] = useState("")
  const [filtro, setFiltro] = useState<{ inicio: string; fim: string } | null>(null)
  const [comparacao, setComparacao] = useState<AnaliseHistorica | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erroPeriodo, setErroPeriodo] = useState("")
  const [revisaoFiltro, setRevisaoFiltro] = useState(0)

  useEffect(() => {
    let ativo = true
    if (filtro) return () => { ativo = false }
    Promise.all([
      consultar("/estacionamento/estrutura").then(lerEstrutura),
      consultar("/estacionamento/analise").then(lerAnaliseHistorica),
    ]).then(([estruturaRecebida, historicoRecebido]) => {
      if (ativo) { setEstrutura(estruturaRecebida); setHistorico(historicoRecebido) }
    }).catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível carregar a análise.") })
    return () => { ativo = false }
  }, [consultar, filtro])

  useEffect(() => {
    if (!filtro) return
    let ativo = true
    const duracao = (Date.parse(`${filtro.fim}T00:00:00Z`) - Date.parse(`${filtro.inicio}T00:00:00Z`)) / UM_DIA + 1
    const anteriorFim = new Date(Date.parse(`${filtro.inicio}T00:00:00Z`) - UM_DIA).toISOString().slice(0, 10)
    const anteriorInicio = new Date(Date.parse(`${anteriorFim}T00:00:00Z`) - (duracao - 1) * UM_DIA).toISOString().slice(0, 10)
    const consulta = (periodo: { inicio: string; fim: string }) => consultar(`/estacionamento/analise?inicio=${periodo.inicio}&fim=${periodo.fim}`).then(lerAnaliseHistorica)
    Promise.all([consulta(filtro), consulta({ inicio: anteriorInicio, fim: anteriorFim }).catch(() => null)])
      .then(([atual, anterior]) => { if (ativo) { setHistorico(atual); setComparacao(anterior?.temHistorico ? anterior : null); setCarregando(false) } })
      .catch((falha) => { if (ativo) { setErroPeriodo(falha instanceof Error ? falha.message : "Não foi possível carregar o período."); setCarregando(false) } })
    return () => { ativo = false }
  }, [consultar, filtro, revisaoFiltro])

  function aplicarFiltro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const validacao = validarPeriodo(inicio, fim)
    setErroPeriodo(validacao)
    if (validacao) return
    setCarregando(true)
    setHistorico(null)
    setComparacao(null)
    setBarraSelecionada("")
    setFiltro({ inicio, fim })
    setRevisaoFiltro((anterior) => anterior + 1)
  }

  const demonstracao = useMemo(() => estrutura ? criarDemonstracao(estrutura, historico, !filtro) : null, [estrutura, historico, filtro])

  async function exportar(formato: "xlsx" | "pdf") {
    if (!estrutura || exportando) return
    setErroExportacao("")
    setExportando(formato)
    try {
      const relatorio = montarRelatorioAnalise(estrutura, historico, filtro ? { periodoSelecionado: filtro, comparacao, permitirDemonstracao: false } : undefined)
      const arquivo = formato === "xlsx" ? await gerarPlanilhaAnalise(relatorio) : await gerarPdfAnalise(relatorio)
      baixarArquivo(arquivo, nomeArquivoRelatorio(estrutura.shopping.nome, formato))
    } catch (falha) {
      setErroExportacao(falha instanceof Error ? falha.message : "Não foi possível exportar a análise.")
    } finally {
      setExportando(null)
    }
  }
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
  const serieDiaria = dadosReais ? historico.porDia.map((item) => item.ocupacaoPercentual) : filtro ? [] : ocupacaoDiaria
  const rotulosDiarios = dadosReais ? historico.porDia.map((item) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(item.inicioEm)).replaceAll(" de ", " ")) : filtro ? [] : dias
  const periodo = filtro ? `${filtro.inicio.split("-").reverse().join("/")} a ${filtro.fim.split("-").reverse().join("/")}` : dadosReais ? `${rotulosDiarios[0]} a ${rotulosDiarios.at(-1)}` : "11 a 17 de maio"

  return <section className="analise-estacionamento" aria-labelledby="titulo-analise">
    <header className="analise-cabecalho">
      <div><p className={`analise-selo ${dadosReais ? "analise-selo-real" : ""}`}>{dadosReais ? "Histórico confirmado" : filtro ? "Sem medições no período" : "Dados genéricos · demonstração"}</p><h2 id="titulo-analise">Análise do estacionamento</h2><p>{estrutura.shopping.nome} · período de {periodo}</p></div>
      <div className="analise-acoes"><span className="analise-status" role="status">{dadosReais ? "Histórico carregado" : filtro ? "Sem medições" : "Demonstração"}</span><Button type="button" disabled={exportando !== null || carregando} onClick={() => void exportar("xlsx")}><Download aria-hidden="true"/>{exportando === "xlsx" ? "Preparando Excel..." : "Exportar Excel"}</Button><Button type="button" disabled={exportando !== null || carregando} onClick={() => void exportar("pdf")}><Download aria-hidden="true"/>{exportando === "pdf" ? "Preparando PDF..." : "Exportar PDF"}</Button></div>
    </header>
    <form className="analise-filtro" onSubmit={aplicarFiltro}>
      <label>De <input type="date" value={inicio} max={new Date().toISOString().slice(0, 10)} onChange={(evento) => setInicio(evento.target.value)} required /></label>
      <label>Até <input type="date" value={fim} max={new Date().toISOString().slice(0, 10)} onChange={(evento) => setFim(evento.target.value)} required /></label>
      <Button type="submit" disabled={carregando}>{carregando ? "Consultando..." : "Aplicar período"}</Button>
      {filtro && <Button type="button" variant="outline" onClick={() => { setFiltro(null); setInicio(""); setFim(""); setComparacao(null); setErroPeriodo(""); setHistorico(null) }}>Limpar filtro</Button>}
      <small>Até 31 dias corridos. Datas em UTC.</small>
    </form>
    {erroPeriodo && <p role="alert" className="analise-erro-exportacao">{erroPeriodo}</p>}
    {carregando && <p role="status">Carregando medições do período...</p>}
    {erroExportacao && <p role="alert" className="analise-erro-exportacao">{erroExportacao}</p>}

    {filtro && !carregando && !dadosReais && <p role="status" className="analise-vazio">Não há medições confirmadas neste intervalo. Os cartões abaixo mostram apenas a situação atual das vagas.</p>}

    <h3 className="analise-grupo-titulo" id="titulo-situacao-atual">{!filtro && !dadosReais ? "Visão demonstrativa das vagas" : "Situação atual das vagas"}</h3>
    <div className="analise-metricas" aria-labelledby="titulo-situacao-atual">
      <CartaoMetrica titulo="Vagas totais" valor={demonstracao.total.toLocaleString("pt-BR")} apoio="100% da capacidade" cor="#ffe100" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas livres" valor={demonstracao.livres.toLocaleString("pt-BR")} apoio={`${(demonstracao.livres / Math.max(1, demonstracao.total) * 100).toFixed(1).replace(".", ",")}% do total`} cor="#20bf39" icone={CircleParking}/>
      <CartaoMetrica titulo="Vagas ocupadas" valor={demonstracao.ocupadas.toLocaleString("pt-BR")} apoio={`${(demonstracao.ocupadas / Math.max(1, demonstracao.total) * 100).toFixed(1).replace(".", ",")}% do total`} cor="#f1161c" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas especiais" valor={demonstracao.especiais.toLocaleString("pt-BR")} apoio="PCD, idoso e elétrica" cor="#168df2" icone={Accessibility}/>
    </div>

    {!carregando && (!filtro || dadosReais) && <div className="analise-grade-principal">
      <article className="analise-painel analise-linha"><div className="analise-titulo"><div><h3>Taxa de ocupação</h3><p>Média diária do período · escala de 0 a 100%</p></div><span>Por dia</span></div>{rotulosDiarios.length > 14 ? <div className="analise-serie-lista"><p>Lista diária, deslize para ver todos os dias.</p><ul>{rotulosDiarios.map((rotulo, indice) => <li key={rotulo}><span>{rotulo}</span><strong>{serieDiaria[indice].toFixed(1).replace(".", ",")}%</strong></li>)}</ul></div> : <GraficoLinha rotulos={rotulosDiarios} valores={serieDiaria}/>}</article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Vagas ocupadas por setor</h3><p>Situação atual · até quatro setores</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca" style={{ background: totalOcupadoSetores ? `conic-gradient(${gradienteSetores})` : "var(--an-inset)" }}><span><strong>{totalOcupadoSetores}</strong>ocupadas agora</span></div><ul>{setoresDoGrafico.map((setor, indice) => <li key={setor.nome}><i style={{ background: coresSetor[indice] }}/><span>{setor.nome}</span><strong>{setor.ocupadas}</strong></li>)}</ul></div></article>
      <article className="analise-painel analise-resumo"><div className="analise-titulo"><div><h3>Resumo do período</h3><p>{dadosReais ? "Calculado sobre eventos confirmados" : "Dados demonstrativos"}</p></div></div><dl><div><Clock3/><dt>Taxa de ocupação</dt><dd>{dadosReais ? `${historico.resumo.ocupacaoPercentual.toFixed(1).replace(".", ",")}%` : "65,1%"}</dd></div><div><CarFront/><dt>Entradas observadas</dt><dd>{dadosReais ? historico.resumo.entradasObservadas.toLocaleString("pt-BR") : "5.842"}</dd></div><div><RefreshCw/><dt>Rotatividade</dt><dd>{dadosReais ? "Não apurada" : "4,51"}</dd></div><div><PlugZap/><dt>Cobertura dos sensores</dt><dd>{dadosReais ? `${historico.resumo.coberturaPercentual.toFixed(1).replace(".", ",")}%` : "92%"}</dd></div></dl></article>
    </div>}
    {filtro && !carregando && <article className="analise-painel analise-comparacao"><h3>Comparação com o período anterior</h3>{dadosReais && comparacao ? <p>Ocupação: {historico.resumo.ocupacaoPercentual.toFixed(1).replace(".", ",")}% ante {comparacao.resumo.ocupacaoPercentual.toFixed(1).replace(".", ",")}% ({(historico.resumo.ocupacaoPercentual - comparacao.resumo.ocupacaoPercentual >= 0 ? "+" : "") + (historico.resumo.ocupacaoPercentual - comparacao.resumo.ocupacaoPercentual).toFixed(1).replace(".", ",")} p.p.). Entradas: {historico.resumo.entradasObservadas.toLocaleString("pt-BR")} ante {comparacao.resumo.entradasObservadas.toLocaleString("pt-BR")}.</p> : <p>{comparacao ? "Sem medições no período selecionado; o período anterior possui medições confirmadas." : "Sem medições confirmadas no período anterior de mesma duração."}</p>}</article>}

    {!carregando && (!filtro || dadosReais) && <div className="analise-grade-secundaria">
      <article className="analise-painel"><div className="analise-titulo"><div><h3>{dadosReais ? "Entradas observadas" : "Entradas x saídas"}</h3><p>Movimentação diária{dadosReais ? " confirmada" : " demonstrativa"}</p></div></div><TooltipProvider><div className="barras-duplas">{rotulosDiarios.map((dia, indice) => { const entradas = dadosReais ? historico.porDia[indice].entradasObservadas : (42 + indice * 5 + (indice % 2) * 9) * 10; const saidas = (38 + indice * 5 + ((indice + 1) % 2) * 8) * 10; const escala = dadosReais ? Math.max(1, ...historico.porDia.map((item) => item.entradasObservadas)) : 1000; return <div key={dia}><Tooltip><TooltipTrigger asChild><button type="button" className="barra-entrada" style={{ height: `${Math.max(entradas > 0 ? 4 : 0, entradas / escala * 90)}%` }} aria-label={`${dia}: ${entradas} entradas`} onClick={() => setBarraSelecionada(`${dia}: ${entradas} entradas`)} /></TooltipTrigger><TooltipContent>{dia} · {entradas} entradas</TooltipContent></Tooltip>{!dadosReais && <Tooltip><TooltipTrigger asChild><button type="button" className="barra-saida" style={{ height: `${saidas / escala * 90}%` }} aria-label={`${dia}: ${saidas} saídas`} onClick={() => setBarraSelecionada(`${dia}: ${saidas} saídas`)} /></TooltipTrigger><TooltipContent>{dia} · {saidas} saídas</TooltipContent></Tooltip>}<small>{dia.split(" ")[0]}</small></div> })}</div></TooltipProvider>{barraSelecionada && <p className="analise-detalhe-toque" role="status">{barraSelecionada}</p>}</article>
      {!dadosReais && <article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por horário</h3><p>Média demonstrativa ao longo do dia</p></div></div><TooltipProvider><div className="barras-horario">{ocupacaoHoraria.map((valor, indice) => <Tooltip key={indice}><TooltipTrigger asChild><button type="button" style={{ height: `${valor}%` }} aria-label={`${String(indice + 6).padStart(2, "0")}h: ${valor}% de ocupação`} aria-pressed={horarioSelecionado === `${String(indice + 6).padStart(2, "0")}h: ${valor}% de ocupação`} onClick={() => setHorarioSelecionado(`${String(indice + 6).padStart(2, "0")}h: ${valor}% de ocupação`)} /></TooltipTrigger><TooltipContent>{String(indice + 6).padStart(2, "0")}h · {valor}% ocupado</TooltipContent></Tooltip>)}</div></TooltipProvider><div className="grafico-eixo"><span>06h</span><span>12h</span><span>18h</span><span>22h</span></div>{horarioSelecionado && <p className="analise-detalhe-toque" role="status">{horarioSelecionado}</p>}</article>}
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Tipo de vaga</h3><p>Distribuição da capacidade</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca compacta" style={{ background: `conic-gradient(${gradienteTipos})` }}><span><strong>{demonstracao.total}</strong>total</span></div><ul>{demonstracao.porTipo.map((item) => <li key={item.tipo}><i style={{ background: tipos[item.tipo].cor }}/><span>{tipos[item.tipo].nome}</span><strong>{item.quantidade}</strong></li>)}</ul></div></article>
    </div>}

    {!carregando && (!filtro || dadosReais) && <article className="analise-painel analise-tabela"><div className="analise-titulo"><div><h3>Desempenho por setor</h3><p>{dadosReais ? "Ocupação histórica e vagas atuais com leitura válida" : "Indicadores demonstrativos associados à estrutura atual"}</p></div></div><p className="analise-scroll-dica">Deslize horizontalmente para ver todas as colunas.</p><div className="analise-tabela-scroll"><table><caption>Indicadores por setor: histórico do período e situação atual das vagas</caption><thead><tr><th>Setor</th><th>Vagas totais</th><th>Ocupadas agora</th><th>Livres agora</th><th>Taxa de ocupação</th><th>{dadosReais ? "Cobertura" : "Tempo médio"}</th><th>{dadosReais ? "Entradas" : "Rotatividade"}</th></tr></thead><tbody>{demonstracao.setores.map((setor, indice) => <tr key={`${setor.nome}-${indice}`}><th scope="row"><i style={{ background: coresSetor[indice % 4] }}/>{setor.nome}</th><td>{setor.total}</td><td>{setor.ocupadas}</td><td>{setor.livres}</td><td><span className="taxa-setor"><b style={{ width: `${setor.taxa}%` }}/></span>{setor.taxa.toFixed(1).replace(".", ",")}%</td><td>{dadosReais ? `${(historico.porSetor.find((item) => item.setor === setor.nome)?.coberturaPercentual ?? 0).toFixed(1).replace(".", ",")}%` : setor.permanencia}</td><td>{dadosReais ? (historico.porSetor.find((item) => item.setor === setor.nome)?.entradasObservadas ?? 0).toLocaleString("pt-BR") : setor.rotatividade?.toFixed(2).replace(".", ",")}</td></tr>)}</tbody></table></div></article>}
  </section>
}
