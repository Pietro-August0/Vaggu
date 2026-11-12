import { useMovimentoReduzido } from "@/hooks/use-movimento-reduzido"
/** Análise por período e recorte, sem substituir ausência de histórico por números genéricos. */
import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { motion, useInView } from "motion/react"
import { Download, CarFront, CircleParking, Clock3, Activity, Accessibility, UserRound, PlugZap, RefreshCw, SlidersHorizontal, CalendarDays, type LucideIcon } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { lerEstrutura } from "@/servicos/estrutura"
import { lerAnaliseHistorica, formatarMetrica, formatarDuracao, type AnaliseHistorica } from "@/servicos/analise"
import { montarRelatorioAnalise, baixarArquivo, nomeArquivoRelatorio } from "@/servicos/modelo-relatorio-analise"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

const DIA = 86_400_000
const categorias: Record<TipoVaga, string> = { COMUM: "Convencional", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" }
const dataUtc = (valor: string) => new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
const iconesCategorias = [CircleParking, Accessibility, UserRound, PlugZap]

type Filtro = { inicio: string; fim: string; setorId: string; tipo: TipoVaga | "" }
function periodoPadrao(): Filtro {
  const fim = new Date().toISOString().slice(0, 10)
  return { inicio: new Date(Date.parse(fim) - 6 * DIA).toISOString().slice(0, 10), fim, setorId: "", tipo: "" }
}
function validar(filtro: Filtro) {
  const inicio = Date.parse(filtro.inicio), fim = Date.parse(filtro.fim)
  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || new Date(inicio).toISOString().slice(0, 10) !== filtro.inicio || new Date(fim).toISOString().slice(0, 10) !== filtro.fim) return "Informe datas válidas."
  if (fim < inicio || fim - inicio >= 31 * DIA) return "Escolha um período de até 31 dias, com a data final igual ou posterior à inicial."
  if (filtro.fim > new Date().toISOString().slice(0, 10)) return "A data final não pode estar no futuro."
  return ""
}
function Cartao({ titulo, valor, formato = "inteiro", ausente = "—", apoio, tom = "amarelo", icone: Icone }: { titulo: string; valor: number | null; formato?: "inteiro" | "decimal" | "percentual" | "duracao"; ausente?: string; apoio?: string; tom?: "amarelo" | "azul" | "verde" | "roxo"; icone: LucideIcon }) {
  const texto = valor === null ? ausente : formato === "duracao" ? formatarDuracao(valor) : formatarMetrica(valor, formato === "percentual" ? "%" : "", formato === "inteiro" ? 0 : formato === "decimal" ? 2 : 1)
  return <article className={`analise-card-metrica analise-card-metrica--${tom}`}><div className="analise-metrica-titulo"><span className="analise-icone"><Icone aria-hidden="true"/></span><p>{titulo}</p></div><strong>{texto}</strong>{apoio && <small>{apoio}</small>}</article>
}
function GraficoOcupacao({ dias }: { dias: AnaliseHistorica["porDia"] }) {
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const areaId = useId()
  const elemento = useRef<SVGSVGElement>(null)
  const visivel = useInView(elemento, { once: true, amount: .3 })
  const recorteId = `${areaId}-tracado`
  const reduzirMovimento = useMovimentoReduzido()
  const larguraSerie = dias.length > 10 ? `${dias.length * 48}px` : undefined
  // Cada lacuna encerra o traçado; não ligar medições através de um dia sem cobertura.
  let caminho = "", continuar = false
  const areas: string[] = []
  let segmento = "", primeiroX = 0, ultimoX = 0
  for (const [i, dia] of dias.entries()) {
    if (dia.ocupacaoPercentual === null) {
      if (segmento) areas.push(`${segmento} L ${ultimoX} 50 L ${primeiroX} 50 Z`)
      segmento = ""; continuar = false; continue
    }
    const x = 8 + i * 90 / Math.max(1, dias.length - 1)
    if (!continuar) primeiroX = x
    ultimoX = x
    segmento += `${continuar ? " L" : " M"} ${x} ${50 - dia.ocupacaoPercentual * .4}`
    caminho += `${continuar ? " L" : " M"} ${8 + i * 90 / Math.max(1, dias.length - 1)} ${50 - dia.ocupacaoPercentual * .4}`
    continuar = true
  }
  if (segmento) areas.push(`${segmento} L ${ultimoX} 50 L ${primeiroX} 50 Z`)
  return <div className="grafico-linha"><div className="grafico-linha-viewport"><div className="grafico-plot" style={{ minWidth: larguraSerie }}>
    <svg ref={elemento} viewBox="0 0 106 54" preserveAspectRatio="none" role="img" aria-label="Ocupação por dia; lacunas indicam ausência de observação"><defs><linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe100" stopOpacity=".35"/><stop offset="1" stopColor="#ffe100" stopOpacity="0"/></linearGradient><clipPath id={recorteId}><motion.rect x="0" y="0" width={reduzirMovimento ? 106 : 0} height="54" initial={false} animate={{ width: reduzirMovimento || visivel ? 106 : 0 }} transition={{ duration: reduzirMovimento ? 0 : 1, ease: "easeOut" }}/></clipPath></defs>{areas.map((area, i) => <motion.path key={i} clipPath={`url(#${recorteId})`} d={area} fill={`url(#${areaId})`} initial={reduzirMovimento ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .15 }}/>)}<path d={caminho} clipPath={`url(#${recorteId})`} fill="none" stroke="#bca600" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/></svg>
    <div className="grafico-pontos">{dias.map((dia, i) => dia.ocupacaoPercentual !== null && <button key={dia.inicioEm} type="button" style={{ left: `${(8 + i * 90 / Math.max(1, dias.length - 1)) / 106 * 100}%`, top: `${(50 - dia.ocupacaoPercentual * .4) / 54 * 100}%` }} aria-pressed={selecionado?.startsWith(dataUtc(dia.inicioEm)) ?? false} aria-label={`${dataUtc(dia.inicioEm)}: ${formatarMetrica(dia.ocupacaoPercentual, "%")}`} onClick={() => setSelecionado(`${dataUtc(dia.inicioEm)}: ocupação ${formatarMetrica(dia.ocupacaoPercentual, "%")}; cobertura ${formatarMetrica(dia.coberturaPercentual, "%")}.`)}><span/></button>)}</div>
  </div><div className="grafico-eixo" style={{ minWidth: larguraSerie }}>{dias.filter((_, i) => i === 0 || i === Math.floor((dias.length - 1) / 2) || i === dias.length - 1).map(dia => <span key={dia.inicioEm}>{dataUtc(dia.inicioEm)}</span>)}</div></div>{larguraSerie && <p className="analise-scroll-dica">Deslize para consultar todos os dias.</p>}{selecionado && <p role="status" className="analise-detalhe-toque">{selecionado}</p>}</div>
}


function Rosca({ itens }: { itens: { nome: string; quantidade: number; cor: string }[] }) {
  const reduzirMovimento = useMovimentoReduzido()
  const total = itens.reduce((soma, item) => soma + item.quantidade, 0)
  let acumulado = 0
  const fatias = itens.map(item => {
    const inicio = acumulado
    acumulado += total ? item.quantidade / total * 100 : 0
    return `${item.cor} ${inicio}% ${acumulado}%`
  })
  return <div className="analise-rosca-bloco"><motion.div className="analise-rosca" aria-hidden="true" initial={reduzirMovimento ? false : { opacity: 0, scale: .88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .65, ease: "easeOut" }} style={{ background: total ? `conic-gradient(${fatias.join(",")})` : "var(--an-border)" }}></motion.div><ul>{itens.map(item => <li key={item.nome}><i style={{ background: item.cor }}/><span>{item.nome}</span><strong>{item.quantidade}</strong></li>)}</ul></div>
}
function GraficoMovimento({ dias }: { dias: AnaliseHistorica["porDia"] }) {
  const [detalhe, setDetalhe] = useState("")
  const reduzirMovimento = useMovimentoReduzido()
  const maximo = Math.max(1, ...dias.flatMap(d => [d.entradasObservadas, d.saidasObservadas]))
  return <><p className="analise-legenda"><span>● Entradas</span><span>● Saídas</span></p><div className="analise-movimento">{dias.map(d => <div key={d.inicioEm}><div>{d.ocupacaoPercentual === null ? <span className="analise-dia-sem-leitura" aria-label="Sem observação">—</span> : (["entradasObservadas", "saidasObservadas"] as const).map((campo, i) => <motion.button key={campo} type="button" initial={reduzirMovimento ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: .7, delay: i * .08, ease: "easeOut" }} style={{ height: `${d[campo] / maximo * 100}%`, transformOrigin: "bottom" }} aria-label={`${dataUtc(d.inicioEm)}: ${d.ocupacaoPercentual === null ? "sem observação" : `${d[campo]} ${i ? "saídas" : "entradas"}`}`} onClick={() => setDetalhe(`${dataUtc(d.inicioEm)}: ${d.ocupacaoPercentual === null ? "sem observação" : `${d.entradasObservadas} entradas e ${d.saidasObservadas} saídas`}.`)} />)}</div><small>{dataUtc(d.inicioEm).slice(0, 5)}</small></div>)}</div><p className="analise-scroll-dica">Deslize para ver todos os dias. — indica ausência de observação.</p>{detalhe && <p role="status" className="analise-detalhe-toque">{detalhe}</p>}</>
}

export function AnaliseEstacionamento() {
  const { consultar } = useAppStore()
  const [formulario, setFormulario] = useState<Filtro>(periodoPadrao)
  const [pedido, setPedido] = useState({ filtro: formulario, revisao: 0 })
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [resultado, setResultado] = useState<{ estrutura: EstruturaEstacionamento; historico: AnaliseHistorica; anterior: AnaliseHistorica | null; comparacao: "carregando" | "pronta" | "erro"; filtro: Filtro } | null>(null)
  const [erro, setErro] = useState("")
  const [erroFormulario, setErroFormulario] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [exportando, setExportando] = useState<"pdf" | "xlsx" | null>(null)
  const [erroExportacao, setErroExportacao] = useState("")

  useEffect(() => {
    let ativo = true
    const filtro = pedido.filtro
    const consultarPeriodo = (inicio: string, fim: string) => {
      const params = new URLSearchParams({ inicio, fim })
      if (filtro.setorId) params.set("setorId", filtro.setorId)
      if (filtro.tipo) params.set("tipo", filtro.tipo)
      return consultar(`/estacionamento/analise?${params}`).then(lerAnaliseHistorica)
    }
    const duracao = Date.parse(filtro.fim) - Date.parse(filtro.inicio) + DIA
    const anteriorInicio = new Date(Date.parse(filtro.inicio) - duracao).toISOString().slice(0, 10)
    const anteriorFim = new Date(Date.parse(filtro.inicio) - DIA).toISOString().slice(0, 10)
    // A comparação começa em paralelo, mas não bloqueia a análise principal.
    const anteriorPendente = consultarPeriodo(anteriorInicio, anteriorFim).catch(() => null)
    Promise.all([consultar("/estacionamento/estrutura").then(lerEstrutura), consultarPeriodo(filtro.inicio, filtro.fim)])
      .then(([estrutura, historico]) => {
        if (!ativo) return
        setResultado({ estrutura, historico, anterior: null, comparacao: "carregando", filtro })
        setErro("")
        setCarregando(false)
        void anteriorPendente.then(anterior => {
          if (ativo) setResultado(atual => atual ? { ...atual, anterior, comparacao: anterior ? "pronta" : "erro" } : atual)
        })
      })
      .catch(falha => {
        if (ativo) {
          setErro(falha instanceof Error ? falha.message : "Não foi possível carregar a análise.")
          setCarregando(false)
        }
      })
    return () => { ativo = false }
  }, [consultar, pedido])

  function aplicar(evento: FormEvent) {
    evento.preventDefault()
    const mensagem = validar(formulario)
    setErroFormulario(mensagem)
    if (mensagem) return
    solicitarFiltro(formulario)
    setFiltrosAbertos(false)
  }
  function solicitarFiltro(filtro: Filtro) {
    setCarregando(true)
    setErro("")
    setErroExportacao("")
    setPedido(p => ({ filtro: { ...filtro }, revisao: p.revisao + 1 }))
  }
  function abrirFiltros(aberto: boolean) {
    if (aberto) {
      setFormulario({ ...pedido.filtro })
      setErroFormulario("")
    }
    setFiltrosAbertos(aberto)
  }
  function atualizar() {
    setCarregando(true)
    setErro("")
    setErroExportacao("")
    setPedido(p => ({ filtro: p.filtro, revisao: p.revisao + 1 }))
  }
  const relatorio = resultado ? montarRelatorioAnalise(resultado.estrutura, resultado.historico, { periodoSelecionado: resultado.filtro, comparacao: resultado.anterior, setorId: resultado.filtro.setorId, tipo: resultado.filtro.tipo }) : null
  async function exportar(formato: "pdf" | "xlsx") {
    if (!relatorio || carregando || erro || exportando || resultado?.comparacao === "carregando") return
    setExportando(formato); setErroExportacao("")
    try {
      const arquivo = formato === "pdf"
        ? await import("@/servicos/exportar-analise-pdf").then(modulo => modulo.gerarPdfAnalise(relatorio))
        : await import("@/servicos/exportar-analise-xlsx").then(modulo => modulo.gerarPlanilhaAnalise(relatorio))
      baixarArquivo(arquivo, nomeArquivoRelatorio(relatorio.shopping, formato))
    } catch (falha) { setErroExportacao(falha instanceof Error ? falha.message : "Falha na exportação.") }
    finally { setExportando(null) }
  }
  const resumo = resultado?.historico.resumo
  const temObservacao = resumo?.ocupacaoPercentual != null
  const delta = resumo?.ocupacaoPercentual != null && resultado?.anterior?.resumo.ocupacaoPercentual != null ? resumo.ocupacaoPercentual - resultado.anterior.resumo.ocupacaoPercentual : null
  const padrao = periodoPadrao()
  const quantidadeFiltros = Number(pedido.filtro.inicio !== padrao.inicio || pedido.filtro.fim !== padrao.fim) + Number(!!pedido.filtro.setorId) + Number(!!pedido.filtro.tipo)
  const setorSelecionado = resultado?.estrutura.andares.flatMap(a => a.setores.map(s => ({ id: s.id, nome: a.nome + " · " + s.nome }))).find(s => s.id === pedido.filtro.setorId)
  const diasObservados = resultado?.historico.porDia.filter(d => d.ocupacaoPercentual !== null) ?? []
  const pico = diasObservados.reduce<AnaliseHistorica["porDia"][number] | null>((maior, dia) => !maior || (dia.ocupacaoPercentual ?? -1) > (maior.ocupacaoPercentual ?? -1) ? dia : maior, null)

  return <section className="analise-estacionamento" aria-labelledby="titulo-analise" aria-busy={carregando}>
    <header className="analise-cabecalho">
      <div><h2 id="titulo-analise">{resultado?.estrutura.shopping.nome ?? "Resumo do período"}</h2></div>
      <div className="analise-acoes">
        <Button variant="outline" disabled={carregando || exportando !== null} onClick={atualizar}><RefreshCw aria-hidden="true"/>Atualizar</Button>
        <details className="analise-exportacoes">
          <summary><Download aria-hidden="true"/>Exportar relatório</summary>
          <div>{(["xlsx", "pdf"] as const).map(formato => <Button key={formato} disabled={!resultado || carregando || !!erro || exportando !== null || resultado.comparacao === "carregando"} onClick={() => void exportar(formato)}>{exportando === formato ? "Preparando..." : formato === "xlsx" ? "Excel" : "PDF"}</Button>)}</div>
        </details>
      </div>
    </header>
    <div className="analise-toolbar">
      <div className="analise-toolbar-acoes">
        <Dialog open={filtrosAbertos} onOpenChange={abrirFiltros}>
          <DialogTrigger asChild><Button variant="outline" aria-label={quantidadeFiltros ? "Filtros da análise: " + quantidadeFiltros + " ativos" : "Filtros da análise"}><SlidersHorizontal aria-hidden="true"/>Filtros{quantidadeFiltros > 0 && <span className="analise-filtros-contagem">{quantidadeFiltros}</span>}</Button></DialogTrigger>
          <DialogContent className="analise-dialogo sm:max-w-lg">
            <DialogHeader><DialogTitle>Filtros da análise</DialogTitle><DialogDescription>Escolha um período de até 31 dias. As datas usam UTC.</DialogDescription></DialogHeader>
            <form className="analise-filtro" onSubmit={aplicar}>
              <div className="analise-filtro-campos">
                <div className="analise-campo"><label htmlFor="analise-inicio">De</label><input id="analise-inicio" type="date" required value={formulario.inicio} max={padrao.fim} onChange={e => setFormulario(f => ({ ...f, inicio: e.target.value }))}/></div>
                <div className="analise-campo"><label htmlFor="analise-fim">Até</label><input id="analise-fim" type="date" required value={formulario.fim} max={padrao.fim} onChange={e => setFormulario(f => ({ ...f, fim: e.target.value }))}/></div>
                <div className="analise-campo"><label htmlFor="analise-setor">Setor</label><select id="analise-setor" value={formulario.setorId} onChange={e => setFormulario(f => ({ ...f, setorId: e.target.value }))}><option value="">Todos os setores</option>{resultado?.estrutura.andares.filter(a => a.ativo).flatMap(a => a.setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{a.nome} · {s.nome}</option>))}</select></div>
                <div className="analise-campo"><label htmlFor="analise-categoria">Categoria</label><select id="analise-categoria" value={formulario.tipo} onChange={e => setFormulario(f => ({ ...f, tipo: e.target.value as Filtro["tipo"] }))}><option value="">Todas as categorias</option>{Object.entries(categorias).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></div>
              </div>
              {erroFormulario && <p role="alert" className="analise-erro-exportacao">{erroFormulario}</p>}
              <div className="analise-filtro-acoes"><Button type="button" variant="ghost" onClick={() => { const filtro = periodoPadrao(); setFormulario(filtro); setErroFormulario(""); solicitarFiltro(filtro); setFiltrosAbertos(false) }}>Limpar filtros</Button><Button type="button" variant="outline" onClick={() => setFiltrosAbertos(false)}>Cancelar</Button><Button type="submit" disabled={carregando}>Aplicar filtros</Button></div>
            </form>
          </DialogContent>
        </Dialog>
        {quantidadeFiltros > 0 && <Button variant="ghost" onClick={() => solicitarFiltro(periodoPadrao())} disabled={carregando}>Limpar filtros</Button>}
      </div>
      <p className="analise-periodo"><strong>{dataUtc(pedido.filtro.inicio)} a {dataUtc(pedido.filtro.fim)}</strong><span>{setorSelecionado?.nome ?? (pedido.filtro.setorId ? "Setor selecionado" : "Todos os setores")} · {pedido.filtro.tipo ? categorias[pedido.filtro.tipo] : "Todas as categorias"}</span></p>
    </div>
    {erro && <div role="alert" className="analise-erro-exportacao"><p>{erro} {resultado ? "Exibindo a última consulta válida." : "Não foi possível carregar os dados."}</p><Button onClick={atualizar}>Tentar novamente</Button></div>}
    {erroExportacao && <p role="alert" className="analise-erro-exportacao">{erroExportacao}</p>}
    {carregando && <p role="status" className="analise-atualizando">{resultado ? "Consultando o recorte. A última análise permanece disponível." : "Carregando análise..."}</p>}
    {carregando && !resultado && <div className="analise-esqueleto" aria-hidden="true"><div className="analise-esqueleto-grafico"/></div>}
    {resultado && relatorio && resumo && <div className="analise-conteudo">
      {(carregando || erro) && <p className="analise-status">Última consulta válida: {dataUtc(resultado.filtro.inicio)} a {dataUtc(resultado.filtro.fim)} · {relatorio.recorte}</p>}
      {!temObservacao && <p className="analise-vazio" role="status">Não há leituras suficientes para calcular o histórico deste período.</p>}

      <section className="analise-resumo" aria-labelledby="titulo-resumo-periodo">
        <div className="analise-titulo"><h3 id="titulo-resumo-periodo">Resumo do período</h3></div>
        <div className="analise-metricas analise-metricas-principais">
          <Cartao titulo="Ocupação média" valor={resumo.ocupacaoPercentual} formato="percentual" apoio={temObservacao && resumo.coberturaPercentual !== null && resumo.coberturaPercentual < 100 ? `Cobertura parcial: ${formatarMetrica(resumo.coberturaPercentual, "%")}. Somente o tempo com leitura válida.` : "Somente o tempo com leitura válida"} icone={CircleParking}/>
          <Cartao titulo="Entradas registradas" valor={temObservacao ? resumo.entradasObservadas : null} icone={CarFront}/>
          <Cartao titulo="Saídas registradas" valor={temObservacao ? resumo.saidasObservadas : null} icone={CarFront}/>
          <Cartao titulo="Tempo médio na vaga" valor={resumo.permanenciaMediaMinutos} formato="duracao" apoio={resumo.permanenciaMediaMinutos === null ? "Sem entradas e saídas completas para calcular" : "Entradas e saídas confirmadas"} icone={Clock3}/>
        </div>
      </section>
      <section className="analise-categorias" aria-labelledby="titulo-categorias"><div className="analise-titulo"><h3 id="titulo-categorias">Vagas por categoria</h3></div><div className="analise-categorias-grade">{relatorio.porTipo.map((tipo, i) => { const Icone = iconesCategorias[i]; return <article key={tipo.nome} className={`analise-categoria analise-categoria--${i}`}><span className="analise-categoria-icone"><Icone aria-hidden="true"/></span><div><h4>{tipo.nome}</h4><strong>{formatarMetrica(tipo.quantidade, "", 0)}</strong></div></article> })}</div></section>
      <div className="analise-grade-principal">
        <article className="analise-painel"><div className="analise-titulo"><h3>Evolução da ocupação</h3></div>{temObservacao ? <GraficoOcupacao key={JSON.stringify(resultado.filtro)} dias={resultado.historico.porDia}/> : <p className="analise-vazio">Sem leituras suficientes para mostrar a ocupação por dia.</p>}
        </article>
            <article className="analise-painel analise-situacao"><div className="analise-titulo"><h3>Situação na última consulta</h3></div><p className="analise-total-vagas"><strong>{relatorio.totais.total}</strong> vagas no recorte atual</p><Rosca itens={[{ nome: "Livres", quantidade: relatorio.totais.livres, cor: "#84bd21" }, { nome: "Ocupadas", quantidade: relatorio.totais.ocupadas, cor: "#ffe100" }, { nome: "Sem leitura", quantidade: relatorio.totais.semLeitura, cor: "#858585" }, { nome: "Indisponíveis", quantidade: relatorio.totais.indisponiveis, cor: "#d06b50" }]}/><details className="analise-estados-detalhes"><summary>Entender os estados</summary><dl className="analise-estados-ajuda"><div><dt>Sem leitura</dt><dd>Ocupação desconhecida, sem sensor associado.</dd></div><div><dt>Indisponíveis</dt><dd>Sem leitura válida do sensor ou em manutenção.</dd></div></dl></details></article>
      </div>
      <section className="analise-comparacao" aria-label="Comparação com o período anterior"><h3>Em relação ao período anterior</h3>{resultado.comparacao === "carregando" ? <p>{carregando || erro ? "Comparação ainda não concluída." : "Consultando comparação..."}</p> : resultado.comparacao === "erro" ? <p>Comparação indisponível. Use Atualizar para tentar novamente.</p> : <p>{delta === null ? "Sem observação suficiente para comparar." : (delta > 0 ? "+" : "") + formatarMetrica(delta, " pontos percentuais")}</p>}</section>
      <div className="analise-grade-secundaria analise-movimento-setores">
            <article className="analise-painel"><div className="analise-titulo"><h3>Entradas e saídas por dia</h3></div>{temObservacao ? <GraficoMovimento key={JSON.stringify(resultado.filtro)} dias={resultado.historico.porDia}/> : <p className="analise-vazio">Sem leituras suficientes para mostrar entradas e saídas.</p>}</article>
        <article className="analise-painel"><div className="analise-titulo"><h3>Ocupação por setor</h3></div><ul className="analise-setores-lista">{resultado.historico.porSetor.map(setor => <li key={setor.setor}><div><span>{setor.setor}</span><strong>{formatarMetrica(setor.ocupacaoPercentual, "%")}</strong></div><div className="analise-setor-trilha" aria-hidden="true"><span style={{ width: (setor.ocupacaoPercentual ?? 0) + "%" }}/></div></li>)}</ul>{!resultado.historico.porSetor.length && <p className="analise-vazio">Sem histórico por setor no recorte.</p>}</article>
      </div>
      <details className="analise-detalhes">
        <summary>Dados avançados</summary>
        <div className="analise-detalhes-conteudo">
          <div className="analise-metricas">
            <Cartao titulo="Cobertura estimada" valor={resumo.coberturaPercentual} formato="percentual" apoio="do período com leitura" tom="azul" icone={Activity}/>

            <article className="analise-card-metrica analise-card-metrica--azul"><div className="analise-metrica-titulo"><span className="analise-icone"><CalendarDays aria-hidden="true"/></span><p>Dia de maior ocupação</p></div><strong>{pico ? dataUtc(pico.inicioEm) : "—"}</strong><small>{pico ? formatarMetrica(pico.ocupacaoPercentual, "%") + " de ocupação média" : "Sem observação no período"}</small></article>
            <Cartao titulo="Rotatividade observada" valor={resumo.rotatividadeObservada} formato="decimal" apoio="entradas por vaga ativa" icone={CircleParking}/>
          </div>
          <div className="analise-painel analise-tabela"><h3>Indicadores por setor</h3><div className="analise-tabela-scroll"><table><caption>Ocupação e cobertura no tempo observado.</caption><thead><tr><th>Setor</th><th>Ocupação</th><th>Cobertura</th><th>Entradas</th><th>Saídas</th><th>Permanência</th><th>Rotatividade</th></tr></thead><tbody>{resultado.historico.porSetor.map(setor => <tr key={setor.setor}><th scope="row">{setor.setor}</th><td>{formatarMetrica(setor.ocupacaoPercentual, "%")}</td><td>{formatarMetrica(setor.coberturaPercentual, "%")}</td><td>{setor.entradasObservadas}</td><td>{setor.saidasObservadas}</td><td>{formatarDuracao(setor.permanenciaMediaMinutos)}</td><td>{formatarMetrica(setor.rotatividadeObservada, "", 2)}</td></tr>)}</tbody></table>{!resultado.historico.porSetor.length && <p className="analise-vazio">Sem histórico por setor no recorte.</p>}</div></div>
          <details className="analise-ajuda"><summary>Como interpretar os dados</summary><p>Ocupação usa apenas tempo com leitura válida. Cobertura compara esse tempo com a capacidade atual; mudanças no cadastro limitam a comparação histórica. Entradas e saídas são transições confirmadas. Permanência considera ciclos completos, sem falhas intermediárias; rotatividade é o total de entradas por vaga ativa. — indica ausência de observação.</p></details>
        </div>
      </details>
    </div>}
  </section>
}
