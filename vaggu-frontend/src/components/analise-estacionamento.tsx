/** Análise por período e recorte, sem substituir ausência de histórico por números genéricos. */
import { useEffect, useState, type FormEvent } from "react"
import { Download, CarFront, CircleParking, Clock3, Activity, type LucideIcon } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { lerEstrutura } from "@/servicos/estrutura"
import { lerAnaliseHistorica, formatarMetrica, type AnaliseHistorica } from "@/servicos/analise"
import { montarRelatorioAnalise, baixarArquivo, nomeArquivoRelatorio } from "@/servicos/modelo-relatorio-analise"
import { gerarPlanilhaAnalise } from "@/servicos/exportar-analise-xlsx"
import { gerarPdfAnalise } from "@/servicos/exportar-analise-pdf"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

const DIA = 86_400_000
const categorias: Record<TipoVaga, string> = { COMUM: "Convencional", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" }
const dataUtc = (valor: string) => new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
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
  // Cada lacuna encerra o traçado; não ligar medições através de um dia sem cobertura.
  let caminho = "", continuar = false
  for (const [i, dia] of dias.entries()) {
    if (dia.ocupacaoPercentual === null) { continuar = false; continue }
    caminho += `${continuar ? " L" : " M"} ${8 + i * 90 / Math.max(1, dias.length - 1)} ${50 - dia.ocupacaoPercentual * .4}`
    continuar = true
  }
  return <div className="grafico-linha"><div className="grafico-linha-viewport"><div className="grafico-plot">
    <svg viewBox="0 0 106 54" preserveAspectRatio="none" role="img" aria-label="Ocupação por dia; lacunas indicam ausência de observação"><path d={caminho} fill="none" stroke="#bca600" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
    <div className="grafico-pontos">{dias.map((dia, i) => dia.ocupacaoPercentual !== null && <button key={dia.inicioEm} type="button" style={{ left: `${(8 + i * 90 / Math.max(1, dias.length - 1)) / 106 * 100}%`, top: `${(50 - dia.ocupacaoPercentual * .4) / 54 * 100}%` }} aria-label={`${dataUtc(dia.inicioEm)}: ${formatarMetrica(dia.ocupacaoPercentual, "%")}`} onClick={() => setSelecionado(`${dataUtc(dia.inicioEm)}: ocupação ${formatarMetrica(dia.ocupacaoPercentual, "%")}; cobertura ${formatarMetrica(dia.coberturaPercentual, "%")}.`)}><span/></button>)}</div>
  </div><div className="grafico-eixo">{dias.filter((_, i) => i === 0 || i === Math.floor((dias.length - 1) / 2) || i === dias.length - 1).map(dia => <span key={dia.inicioEm}>{dataUtc(dia.inicioEm)}</span>)}</div></div>{selecionado && <p role="status" className="analise-detalhe-toque">{selecionado}</p>}</div>
}

export function AnaliseEstacionamento() {
  const { consultar } = useAppStore()
  const [formulario, setFormulario] = useState<Filtro>(periodoPadrao)
  const [pedido, setPedido] = useState({ filtro: formulario, revisao: 0 })
  const [resultado, setResultado] = useState<{ estrutura: EstruturaEstacionamento; historico: AnaliseHistorica; anterior: AnaliseHistorica | null; filtro: Filtro } | null>(null)
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
    Promise.all([consultar("/estacionamento/estrutura").then(lerEstrutura), consultarPeriodo(filtro.inicio, filtro.fim), consultarPeriodo(anteriorInicio, anteriorFim).catch(() => null)])
      .then(([estrutura, historico, anterior]) => { if (ativo) { setResultado({ estrutura, historico, anterior, filtro }); setErro("") } })
      .catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível carregar a análise.") })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [consultar, pedido])

  function aplicar(evento: FormEvent) {
    evento.preventDefault()
    const mensagem = validar(formulario)
    setErroFormulario(mensagem)
    if (mensagem) return
    setCarregando(true)
    setErro("")
    setPedido(p => ({ filtro: { ...formulario }, revisao: p.revisao + 1 }))
  }
  const relatorio = resultado ? montarRelatorioAnalise(resultado.estrutura, resultado.historico, { periodoSelecionado: resultado.filtro, comparacao: resultado.anterior, setorId: resultado.filtro.setorId, tipo: resultado.filtro.tipo }) : null
  async function exportar(formato: "pdf" | "xlsx") {
    if (!relatorio || carregando || erro || exportando) return
    setExportando(formato); setErroExportacao("")
    try {
      const arquivo = formato === "pdf" ? await gerarPdfAnalise(relatorio) : await gerarPlanilhaAnalise(relatorio)
      baixarArquivo(arquivo, nomeArquivoRelatorio(relatorio.shopping, formato))
    } catch (falha) { setErroExportacao(falha instanceof Error ? falha.message : "Falha na exportação.") }
    finally { setExportando(null) }
  }
  const resumo = resultado?.historico.resumo
  const temObservacao = resumo?.ocupacaoPercentual != null
  const delta = resumo?.ocupacaoPercentual != null && resultado?.anterior?.resumo.ocupacaoPercentual != null ? resumo.ocupacaoPercentual - resultado.anterior.resumo.ocupacaoPercentual : null
  return <section className="analise-estacionamento" aria-labelledby="titulo-analise" aria-busy={carregando}>
    <header className="analise-cabecalho"><div><p className="analise-selo">{resultado?.estrutura.shopping.demonstracao ? "Cenário de demonstração" : temObservacao ? "Histórico confirmado" : "Sem observação suficiente"}</p><h2 id="titulo-analise">Análise do estacionamento</h2><p>{resultado?.estrutura.shopping.nome}</p></div><div className="analise-acoes">{(["xlsx", "pdf"] as const).map(formato => <Button key={formato} disabled={!resultado || carregando || !!erro || exportando !== null} onClick={() => void exportar(formato)}><Download aria-hidden="true"/>{exportando === formato ? "Preparando..." : `Exportar ${formato === "xlsx" ? "Excel" : "PDF"}`}</Button>)}</div></header>
    <form className="analise-filtro" onSubmit={aplicar}><div className="analise-filtro-campos">
      <label>De<input type="date" required value={formulario.inicio} max={new Date().toISOString().slice(0, 10)} onChange={e => setFormulario(f => ({ ...f, inicio: e.target.value }))}/></label>
      <label>Até<input type="date" required value={formulario.fim} max={new Date().toISOString().slice(0, 10)} onChange={e => setFormulario(f => ({ ...f, fim: e.target.value }))}/></label>
      <label>Setor<select value={formulario.setorId} onChange={e => setFormulario(f => ({ ...f, setorId: e.target.value }))}><option value="">Todos os setores</option>{resultado?.estrutura.andares.flatMap(a => a.setores.map(s => <option key={s.id} value={s.id}>{a.nome} · {s.nome}</option>))}</select></label>
      <label>Categoria<select value={formulario.tipo} onChange={e => setFormulario(f => ({ ...f, tipo: e.target.value as Filtro["tipo"] }))}><option value="">Todas as categorias</option>{Object.entries(categorias).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}</select></label>
      <Button disabled={carregando}>{carregando ? "Consultando..." : "Aplicar filtros"}</Button>
    </div><small>Até 31 dias em UTC.<br/>Comparação com o período anterior de igual duração.</small></form>
    {erroFormulario && <p role="alert" className="analise-erro-exportacao">{erroFormulario}</p>}
    {erro && <p role="alert" className="analise-erro-exportacao">{erro} Aplique os filtros novamente para tentar de novo.</p>}
    {erroExportacao && <p role="alert" className="analise-erro-exportacao">{erroExportacao}</p>}
    {carregando && <p role="status">Consultando o período selecionado...</p>}
    {!carregando && !erro && resultado && relatorio && resumo && <>
      <p className="analise-status">Exibindo {dataUtc(resultado.filtro.inicio)} a {dataUtc(resultado.filtro.fim)} · {relatorio.recorte}</p>
      {!temObservacao && <p className="analise-vazio" role="status">Não há observações válidas suficientes neste período. Isso não significa que o estacionamento estava vazio. Os números abaixo da situação atual vêm das vagas cadastradas.</p>}
      <div className="analise-metricas"><Cartao titulo="Ocupação no período" valor={temObservacao ? formatarMetrica(resumo.ocupacaoPercentual, "%") : "—"} apoio="Tempo ocupado / tempo com leitura válida" icone={CircleParking}/><Cartao titulo="Cobertura estimada" valor={resumo.coberturaPercentual === null ? "Indisponível" : formatarMetrica(resumo.coberturaPercentual, "%")} apoio="Referência: capacidade atual. Mudanças no cadastro limitam a comparação histórica." icone={Activity}/><Cartao titulo="Entradas observadas" valor={temObservacao ? formatarMetrica(resumo.entradasObservadas, "", 0) : "—"} apoio="Transições confirmadas de livre para ocupada" icone={CarFront}/><Cartao titulo="Permanência média" valor={formatarMetrica(resumo.permanenciaMediaMinutos, " min")} apoio={`${resumo.ciclosCompletos} ciclos completos encerrados no período`} icone={Clock3}/></div>
      <div className="analise-grade-principal"><article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por dia</h3><p>Lacunas indicam dias sem observação.</p></div></div>{temObservacao ? <GraficoOcupacao key={JSON.stringify(resultado.filtro)} dias={resultado.historico.porDia}/> : <p className="analise-vazio">Sem série histórica observável.</p>}</article>
        <article className="analise-painel analise-resumo"><div className="analise-titulo"><h3>Situação atual do recorte</h3></div><dl>{[["Vagas ativas", relatorio.totais.total], ["Livres", relatorio.totais.livres], ["Ocupadas", relatorio.totais.ocupadas], ["Sem leitura / indisponíveis", relatorio.totais.semLeitura + relatorio.totais.indisponiveis]].map(([nome, valor]) => <div key={nome}><CircleParking aria-hidden="true"/><dt>{nome}</dt><dd>{valor}</dd></div>)}</dl><p className="analise-cobertura-nota">Fotografia consultada ao aplicar os filtros. Para acompanhar as leituras ao vivo, abra o mapa.</p></article>
        <article className="analise-painel analise-resumo"><div className="analise-titulo"><h3>Movimentação observada</h3></div><dl><div><CarFront aria-hidden="true"/><dt>Saídas</dt><dd>{temObservacao ? resumo.saidasObservadas : "—"}</dd></div><div><Activity aria-hidden="true"/><dt>Rotatividade</dt><dd>{temObservacao ? formatarMetrica(resumo.rotatividadeObservada, "", 2) : "—"}</dd></div></dl><p className="analise-cobertura-nota">Rotatividade: entradas observadas por vaga atualmente ativa no recorte. Permanência: duração completa dos ciclos encerrados, sem falhas intermediárias.</p></article></div>
      <article className="analise-painel analise-comparacao"><h3>Comparação com o período anterior</h3><p>{delta === null ? "Não há observação suficiente nos dois períodos para comparar ocupação." : `Variação de ocupação: ${formatarMetrica(delta, " pontos percentuais")}.`}{resultado.anterior === null ? " Não foi possível consultar o período anterior." : ""}</p></article>
      <article className="analise-painel analise-tabela"><div className="analise-titulo"><h3>Indicadores históricos por setor</h3></div><div className="analise-tabela-scroll"><table><caption>Ocupação e cobertura por tempo observado; permanência em minutos.</caption><thead><tr><th>Setor</th><th>Ocupação</th><th>Cobertura</th><th>Entradas</th><th>Saídas</th><th>Permanência</th><th>Rotatividade</th></tr></thead><tbody>{resultado.historico.porSetor.map(s => <tr key={s.setor}><th scope="row">{s.setor}</th><td>{formatarMetrica(s.ocupacaoPercentual, "%")}</td><td>{formatarMetrica(s.coberturaPercentual, "%")}</td><td>{s.entradasObservadas}</td><td>{s.saidasObservadas}</td><td>{formatarMetrica(s.permanenciaMediaMinutos, " min")}</td><td>{formatarMetrica(s.rotatividadeObservada, "", 2)}</td></tr>)}</tbody></table>{!resultado.historico.porSetor.length && <p className="analise-vazio">Sem histórico por setor no recorte.</p>}</div></article>
      <article className="analise-painel"><div className="analise-titulo"><h3>Vagas por categoria no recorte</h3></div><ul className="analise-cobertura-lista">{relatorio.porTipo.map(t => <li key={t.nome}><div><span>{t.nome}</span><strong>{t.quantidade}</strong></div><div className="analise-cobertura-trilha"><span style={{ width: `${relatorio.totais.total ? t.quantidade / relatorio.totais.total * 100 : 0}%` }}/></div></li>)}</ul></article>
    </>}
  </section>
}
