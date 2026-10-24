/** Análise por período e recorte, sem substituir ausência de histórico por números genéricos. */
import { useEffect, useId, useState, type FormEvent } from "react"
import { Download, CarFront, CircleParking, Clock3, Activity, Accessibility, UserRound, PlugZap, RefreshCw, type LucideIcon } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
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
function Cartao({ titulo, valor, apoio, icone: Icone }: { titulo: string; valor: string; apoio: string; icone: LucideIcon }) {
  return <article className="analise-card-metrica"><div className="analise-icone text-[#b39c00] dark:text-[#ffe100]"><Icone aria-hidden="true"/></div><div><p>{titulo}</p><strong>{valor}</strong><small>{apoio}</small></div></article>
}
function GraficoOcupacao({ dias }: { dias: AnaliseHistorica["porDia"] }) {
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const areaId = useId()
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
    <svg viewBox="0 0 106 54" preserveAspectRatio="none" role="img" aria-label="Ocupação por dia; lacunas indicam ausência de observação"><defs><linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe100" stopOpacity=".35"/><stop offset="1" stopColor="#ffe100" stopOpacity="0"/></linearGradient></defs>{areas.map((area, i) => <path key={i} d={area} fill={`url(#${areaId})`}/>)}<path d={caminho} fill="none" stroke="#bca600" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /></svg>
    <div className="grafico-pontos">{dias.map((dia, i) => dia.ocupacaoPercentual !== null && <button key={dia.inicioEm} type="button" style={{ left: `${(8 + i * 90 / Math.max(1, dias.length - 1)) / 106 * 100}%`, top: `${(50 - dia.ocupacaoPercentual * .4) / 54 * 100}%` }} aria-pressed={selecionado?.startsWith(dataUtc(dia.inicioEm)) ?? false} aria-label={`${dataUtc(dia.inicioEm)}: ${formatarMetrica(dia.ocupacaoPercentual, "%")}`} onClick={() => setSelecionado(`${dataUtc(dia.inicioEm)}: ocupação ${formatarMetrica(dia.ocupacaoPercentual, "%")}; cobertura ${formatarMetrica(dia.coberturaPercentual, "%")}.`)}><span/></button>)}</div>
  </div><div className="grafico-eixo" style={{ minWidth: larguraSerie }}>{dias.filter((_, i) => i === 0 || i === Math.floor((dias.length - 1) / 2) || i === dias.length - 1).map(dia => <span key={dia.inicioEm}>{dataUtc(dia.inicioEm)}</span>)}</div></div>{larguraSerie && <p className="analise-scroll-dica">Deslize para consultar todos os dias.</p>}{selecionado && <p role="status" className="analise-detalhe-toque">{selecionado}</p>}</div>
}


function Rosca({ itens, centro, legenda }: { itens: { nome: string; quantidade: number; cor: string }[]; centro: string; legenda: string }) {
  const total = itens.reduce((soma, item) => soma + item.quantidade, 0)
  let acumulado = 0
  const fatias = itens.map(item => {
    const inicio = acumulado
    acumulado += total ? item.quantidade / total * 100 : 0
    return `${item.cor} ${inicio}% ${acumulado}%`
  })
  return <div className="analise-rosca-bloco"><div className="analise-rosca" aria-hidden="true" style={{ background: total ? `conic-gradient(${fatias.join(",")})` : "var(--an-border)" }}><span><strong>{centro}</strong><small>{legenda}</small></span></div><ul>{itens.map(item => <li key={item.nome}><i style={{ background: item.cor }}/><span>{item.nome}</span><strong>{formatarMetrica(item.quantidade, "", 0)}</strong></li>)}</ul></div>
}
function GraficoMovimento({ dias }: { dias: AnaliseHistorica["porDia"] }) {
  const [detalhe, setDetalhe] = useState("")
  const maximo = Math.max(1, ...dias.flatMap(d => [d.entradasObservadas, d.saidasObservadas]))
  return <><p className="analise-legenda"><span>● Entradas</span><span>● Saídas</span></p><div className="analise-movimento">{dias.map(d => <div key={d.inicioEm}><div>{d.ocupacaoPercentual === null ? <span className="analise-dia-sem-leitura" aria-label="Sem observação">—</span> : (["entradasObservadas", "saidasObservadas"] as const).map((campo, i) => <button key={campo} type="button" style={{ height: `${d[campo] / maximo * 100}%` }} aria-label={`${dataUtc(d.inicioEm)}: ${d.ocupacaoPercentual === null ? "sem observação" : `${d[campo]} ${i ? "saídas" : "entradas"}`}`} onClick={() => setDetalhe(`${dataUtc(d.inicioEm)}: ${d.ocupacaoPercentual === null ? "sem observação" : `${d.entradasObservadas} entradas e ${d.saidasObservadas} saídas`}.`)} />)}</div><small>{dataUtc(d.inicioEm).slice(0, 5)}</small></div>)}</div><p className="analise-scroll-dica">Deslize para ver todos os dias. — indica ausência de observação.</p>{detalhe && <p role="status" className="analise-detalhe-toque">{detalhe}</p>}</>
}

export function AnaliseEstacionamento() {
  const { consultar } = useAppStore()
  const [formulario, setFormulario] = useState<Filtro>(periodoPadrao)
  const [pedido, setPedido] = useState({ filtro: formulario, revisao: 0 })
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
    setCarregando(true)
    setErro("")
    setErroExportacao("")
    setPedido(p => ({ filtro: { ...formulario }, revisao: p.revisao + 1 }))
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
  return <section className="analise-estacionamento" aria-labelledby="titulo-analise" aria-busy={carregando}>
    <header className="analise-cabecalho"><div><p className="analise-selo">{!resultado ? carregando ? "Consultando análise" : "Consulta indisponível" : resultado.estrutura.shopping.demonstracao ? "Cenário de demonstração" : temObservacao ? "Histórico confirmado" : "Sem observação suficiente"}</p><h2 id="titulo-analise">Análise do estacionamento</h2><p>{resultado?.estrutura.shopping.nome}</p></div><div className="analise-acoes"><Button disabled={carregando || exportando !== null} onClick={atualizar}><RefreshCw aria-hidden="true"/>Atualizar análise</Button>{(["xlsx", "pdf"] as const).map(formato => <Button key={formato} disabled={!resultado || carregando || !!erro || exportando !== null || resultado.comparacao === "carregando"} onClick={() => void exportar(formato)}><Download aria-hidden="true"/>{exportando === formato ? "Preparando..." : `Exportar ${formato === "xlsx" ? "Excel" : "PDF"}`}</Button>)}</div></header>
    {relatorio ? <section className="analise-categorias" aria-labelledby="titulo-categorias"><div className="analise-faixa-titulo"><div><h3 id="titulo-categorias">Vagas por categoria</h3><p>Cadastro atual · {relatorio.recorte}</p></div><span>{formatarMetrica(relatorio.totais.total, "", 0)} vagas ativas</span></div><div className="analise-categorias-grade">{relatorio.porTipo.map((tipo, i) => {
      const Icone = iconesCategorias[i]
      return <article key={tipo.nome} className="analise-categoria"><Icone aria-hidden="true"/><div><h4>{tipo.nome}</h4><p><strong>{formatarMetrica(tipo.quantidade, "", 0)}</strong><span>cadastradas</span></p></div></article>
    })}</div></section> : carregando ? <section className="analise-categorias"><div className="analise-faixa-titulo"><div><h3>Vagas por categoria</h3><p>Consultando o cadastro atual...</p></div></div><div className="analise-esqueleto" aria-hidden="true"><div className="analise-categorias-grade">{Object.keys(categorias).map(tipo => <div key={tipo}/>)}</div></div></section> : null}
    <form className="analise-filtro" onSubmit={aplicar}><div className="analise-filtro-campos">
      <div className="analise-campo"><label htmlFor="analise-inicio">De</label><input id="analise-inicio" type="date" required value={formulario.inicio} max={new Date().toISOString().slice(0, 10)} onChange={e => setFormulario(f => ({ ...f, inicio: e.target.value }))}/></div>
      <div className="analise-campo"><label htmlFor="analise-fim">Até</label><input id="analise-fim" type="date" required value={formulario.fim} max={new Date().toISOString().slice(0, 10)} onChange={e => setFormulario(f => ({ ...f, fim: e.target.value }))}/></div>
      <div className="analise-campo"><label htmlFor="analise-setor">Setor</label><select id="analise-setor" value={formulario.setorId} onChange={e => setFormulario(f => ({ ...f, setorId: e.target.value }))}><option value="">Todos os setores</option>{resultado?.estrutura.andares.filter(a => a.ativo).flatMap(a => a.setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{a.nome} · {s.nome}</option>))}</select></div>
      <div className="analise-campo"><label htmlFor="analise-categoria">Categoria</label><select id="analise-categoria" value={formulario.tipo} onChange={e => setFormulario(f => ({ ...f, tipo: e.target.value as Filtro["tipo"] }))}><option value="">Todas as categorias</option>{Object.entries(categorias).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></div>
      <Button disabled={carregando}>{carregando ? "Consultando..." : "Aplicar filtros"}</Button>
    </div><small>Até 31 dias em UTC. <br/>Comparação com o período anterior de igual duração.</small></form>
    {erroFormulario && <p role="alert" className="analise-erro-exportacao">{erroFormulario}</p>}
    {erro && <div role="alert" className="analise-erro-exportacao"><p>{erro} {resultado ? "A última consulta válida permanece abaixo; os dados não foram atualizados." : "Não foi possível carregar os dados."}</p><Button onClick={atualizar}>Tentar novamente</Button></div>}
    {erroExportacao && <p role="alert" className="analise-erro-exportacao">{erroExportacao}</p>}
    {carregando && <p role="status" className="analise-atualizando"><RefreshCw aria-hidden="true"/>{resultado ? "Atualizando análise. Abaixo permanece a última consulta válida até a conclusão." : "Carregando vagas e histórico do período..."}</p>}
    {carregando && !resultado && <div className="analise-esqueleto" aria-hidden="true"><div className="analise-esqueleto-grafico"/></div>}
    {resultado && relatorio && resumo && <div className={`analise-conteudo${carregando || erro ? " analise-conteudo-anterior" : ""}`}>
      <p className="analise-status">{carregando || erro ? "Última consulta válida: " : "Exibindo "} {dataUtc(resultado.filtro.inicio)} a {dataUtc(resultado.filtro.fim)} · {relatorio.recorte}</p>
      {!temObservacao && <p className="analise-vazio" role="status">Não há observações válidas suficientes neste período. Isso não significa que o estacionamento estava vazio. As contagens por categoria e situação atual vêm do cadastro.</p>}
      <div className="analise-metricas"><Cartao titulo="Ocupação no período" valor={temObservacao ? formatarMetrica(resumo.ocupacaoPercentual, "%", 0) : "—"} apoio="Tempo ocupado / tempo com leitura válida" icone={CircleParking}/><Cartao titulo="Cobertura estimada" valor={resumo.coberturaPercentual === null ? "Indisponível" : formatarMetrica(resumo.coberturaPercentual, "%", 0)} apoio="Referência: capacidade atual. Mudanças no cadastro limitam a comparação histórica." icone={Activity}/><Cartao titulo="Entradas observadas" valor={temObservacao ? formatarMetrica(resumo.entradasObservadas, "", 0) : "—"} apoio="Transições confirmadas de livre para ocupada" icone={CarFront}/><Cartao titulo="Permanência média" valor={formatarDuracao(resumo.permanenciaMediaMinutos)} apoio={`${resumo.ciclosCompletos} ciclos completos encerrados no período`} icone={Clock3}/></div>
      <div className="analise-grade-principal"><article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por dia</h3><p>Lacunas indicam dias sem observação.</p></div></div>{temObservacao ? <GraficoOcupacao key={JSON.stringify(resultado.filtro)} dias={resultado.historico.porDia}/> : <p className="analise-vazio">Sem série histórica observável.</p>}</article>
        <article className="analise-painel"><div className="analise-titulo"><div><h3>Situação atual do recorte</h3><p>Vagas cadastradas, ao aplicar os filtros.</p></div></div><Rosca centro={formatarMetrica(relatorio.totais.total, "", 0)} legenda="vagas ativas" itens={[{ nome: "Livres", quantidade: relatorio.totais.livres, cor: "#84bd21" }, { nome: "Ocupadas", quantidade: relatorio.totais.ocupadas, cor: "#ffe100" }, { nome: "Sem leitura", quantidade: relatorio.totais.semLeitura, cor: "#858585" }, { nome: "Indisponíveis", quantidade: relatorio.totais.indisponiveis, cor: "#d06b50" }]}/><p className="analise-cobertura-nota">Para acompanhar as leituras ao vivo, abra o mapa.</p></article></div>
      <div className="analise-grade-secundaria">
        <article className="analise-painel"><div className="analise-titulo"><div><h3>Entradas e saídas</h3><p>Movimentação confirmada por dia.</p></div></div>{temObservacao ? <GraficoMovimento key={JSON.stringify(resultado.filtro)} dias={resultado.historico.porDia}/> : <p className="analise-vazio">Sem movimentação observável.</p>}</article>
        <article className="analise-painel"><div className="analise-titulo"><div><h3>Tipo de vaga</h3><p>Categorias do cadastro atual.</p></div></div><Rosca centro={formatarMetrica(relatorio.totais.total, "", 0)} legenda="vagas no recorte" itens={relatorio.porTipo.map((t, i) => ({ ...t, cor: ["#ffe100", "#168df2", "#84bd21", "#23a55a"][i] }))}/></article>
        <article className="analise-painel"><div className="analise-titulo"><div><h3>Cobertura por setor</h3><p>Tempo com leitura válida no período.</p></div></div><ul className="analise-cobertura-lista">{resultado.historico.porSetor.map(s => <li key={s.setor}><div><span>{s.setor}</span><strong>{formatarMetrica(s.coberturaPercentual, "%", 0)}</strong></div><div className="analise-cobertura-trilha"><span style={{ width: `${s.coberturaPercentual ?? 0}%` }}/></div></li>)}</ul>{!resultado.historico.porSetor.length && <p className="analise-vazio">Sem histórico por setor.</p>}<p className="analise-cobertura-nota">Cobertura não representa disponibilidade de vagas.</p></article>
      </div>
      <article className="analise-painel analise-comparacao"><h3>Comparação com o período anterior</h3>{resultado.comparacao === "carregando" && (carregando || erro) ? <p>Comparação pendente na última consulta.</p> : resultado.comparacao === "carregando" ? <p role="status">Consultando o período anterior. Os gráficos atuais já estão disponíveis.</p> : resultado.comparacao === "erro" ? <p>Não foi possível consultar o período anterior. Use Atualizar análise para tentar novamente.</p> : <p>{delta === null ? "Não há observação suficiente nos dois períodos para comparar ocupação." : `Variação de ocupação: ${delta > 0 ? "+" : ""}${formatarMetrica(delta, " pontos percentuais")}.`}</p>}</article>
      <details className="analise-painel analise-tabela"><summary>Ver indicadores detalhados por setor</summary><div className="analise-tabela-scroll"><table><caption>Ocupação e cobertura por tempo observado; permanência em horas e minutos.</caption><thead><tr><th>Setor</th><th>Ocupação</th><th>Cobertura</th><th>Entradas</th><th>Saídas</th><th>Permanência</th><th>Rotatividade</th></tr></thead><tbody>{resultado.historico.porSetor.map(s => <tr key={s.setor}><th scope="row">{s.setor}</th><td>{formatarMetrica(s.ocupacaoPercentual, "%")}</td><td>{formatarMetrica(s.coberturaPercentual, "%")}</td><td>{s.entradasObservadas}</td><td>{s.saidasObservadas}</td><td>{formatarDuracao(s.permanenciaMediaMinutos)}</td><td>{formatarMetrica(s.rotatividadeObservada, "", 2)}</td></tr>)}</tbody></table>{!resultado.historico.porSetor.length && <p className="analise-vazio">Sem histórico por setor no recorte.</p>}</div><p className="analise-cobertura-nota">Rotatividade: entradas observadas por vaga ativa. Permanência: ciclos completos encerrados, sem falhas intermediárias.</p></details>

    </div>}
  </section>
}
