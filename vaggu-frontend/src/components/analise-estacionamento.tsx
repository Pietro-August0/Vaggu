/** Exibe a análise demonstrativa do shopping atual sem persistir eventos sintéticos no histórico real. */
import { useEffect, useMemo, useState } from "react"
import { Accessibility, CarFront, CircleParking, Clock3, Download, PlugZap, RefreshCw, type LucideIcon } from "lucide-react"

import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { lerEstrutura } from "@/servicos/estrutura"
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
function criarDemonstracao(estrutura: EstruturaEstacionamento) {
  const vagas = estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas))
  const total = Math.max(vagas.length, 16)
  const ocupadas = Math.round(total * 0.651)
  const livres = total - ocupadas
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
    const taxa = [66.7, 65.8, 65.6, 62.3][indice % 4]
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

function GraficoLinha() {
  const pontos = ocupacaoDiaria.map((valor, indice) => `${8 + indice * 15.3},${88 - valor}`).join(" ")
  return <div className="grafico-linha" role="img" aria-label={`Taxa de ocupação entre ${dias[0]} e ${dias[dias.length - 1]}, variando de 58% a 72%.`}>
    <svg viewBox="0 0 100 54" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="area-amarela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe100" stopOpacity=".42"/><stop offset="1" stopColor="#ffe100" stopOpacity="0"/></linearGradient></defs>
      <path d={`M ${pontos} L 99 52 L 8 52 Z`} fill="url(#area-amarela)" />
      <polyline points={pontos} fill="none" stroke="#ffe100" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      {ocupacaoDiaria.map((valor, indice) => <circle key={dias[indice]} cx={8 + indice * 15.3} cy={88 - valor} r="1.7" fill="#ffe100" />)}
    </svg>
    <div className="grafico-eixo">{dias.map((dia) => <span key={dia}>{dia}</span>)}</div>
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
  const [erro, setErro] = useState("")

  useEffect(() => {
    let ativo = true
    consultar("/estacionamento/estrutura").then(lerEstrutura).then((valor) => { if (ativo) setEstrutura(valor) }).catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível carregar a análise.") })
    return () => { ativo = false }
  }, [consultar])

  const demonstracao = useMemo(() => estrutura ? criarDemonstracao(estrutura) : null, [estrutura])
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

  return <section className="analise-estacionamento" aria-labelledby="titulo-analise">
    <header className="analise-cabecalho">
      <div><p className="analise-selo">Dados genéricos · demonstração</p><h2 id="titulo-analise">Análise do estacionamento</h2><p>{estrutura.shopping.nome} · período de 11 a 17 de maio</p></div>
      <div className="analise-acoes"><Button type="button" variant="outline" disabled><RefreshCw aria-hidden="true"/>Atualização simulada</Button><Button type="button" disabled><Download aria-hidden="true"/>Exportar</Button></div>
    </header>

    <div className="analise-metricas">
      <CartaoMetrica titulo="Vagas totais" valor={demonstracao.total.toLocaleString("pt-BR")} apoio="100% da capacidade" cor="#ffe100" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas livres" valor={demonstracao.livres.toLocaleString("pt-BR")} apoio={`${(demonstracao.livres / demonstracao.total * 100).toFixed(1).replace(".", ",")}% do total`} cor="#20bf39" icone={CircleParking}/>
      <CartaoMetrica titulo="Vagas ocupadas" valor={demonstracao.ocupadas.toLocaleString("pt-BR")} apoio={`${(demonstracao.ocupadas / demonstracao.total * 100).toFixed(1).replace(".", ",")}% do total`} cor="#f1161c" icone={CarFront}/>
      <CartaoMetrica titulo="Vagas especiais" valor={demonstracao.especiais.toLocaleString("pt-BR")} apoio="PCD, idoso e elétrica" cor="#168df2" icone={Accessibility}/>
    </div>

    <div className="analise-grade-principal">
      <article className="analise-painel analise-linha"><div className="analise-titulo"><div><h3>Taxa de ocupação</h3><p>Média diária do período</p></div><span>Por dia</span></div><GraficoLinha/></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por setor</h3><p>Participação no total ocupado</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca" style={{ background: `conic-gradient(${setoresDoGrafico.map((setor, indice) => `${coresSetor[indice]} ${indice / setoresDoGrafico.length * 100}% ${(indice + 1) / setoresDoGrafico.length * 100}%`).join(",")})` }}><span><strong>{demonstracao.ocupadas}</strong>ocupadas</span></div><ul>{setoresDoGrafico.map((setor, indice) => <li key={setor.nome}><i style={{ background: coresSetor[indice] }}/><span>{setor.nome}</span><strong>{setor.ocupadas}</strong></li>)}</ul></div></article>
      <article className="analise-painel analise-resumo"><div className="analise-titulo"><div><h3>Resumo do período</h3><p>Comparação com a semana anterior</p></div></div><dl><div><Clock3/><dt>Tempo médio de ocupação</dt><dd>01h18 <span>↓ 6,4%</span></dd></div><div><CarFront/><dt>Entradas</dt><dd>5.842 <span>↑ 12,7%</span></dd></div><div><RefreshCw/><dt>Rotatividade</dt><dd>4,51 <span>↑ 8,6%</span></dd></div><div><PlugZap/><dt>Cobertura dos sensores</dt><dd>92% <span>↑ 2,1%</span></dd></div></dl></article>
    </div>

    <div className="analise-grade-secundaria">
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Entradas x saídas</h3><p>Movimentação diária</p></div></div><div className="barras-duplas">{dias.map((dia, indice) => <div key={dia}><span className="barra-entrada" style={{ height: `${42 + indice * 5 + (indice % 2) * 9}%` }}/><span className="barra-saida" style={{ height: `${38 + indice * 5 + ((indice + 1) % 2) * 8}%` }}/><small>{dia.replace(" Mai", "")}</small></div>)}</div></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Ocupação por horário</h3><p>Média ao longo do dia</p></div></div><div className="barras-horario">{ocupacaoHoraria.map((valor, indice) => <span key={indice} style={{ height: `${valor}%` }} title={`${String(indice + 6).padStart(2, "0")}h: ${valor}%`} />)}</div><div className="grafico-eixo"><span>06h</span><span>12h</span><span>18h</span><span>22h</span></div></article>
      <article className="analise-painel"><div className="analise-titulo"><div><h3>Tipo de vaga</h3><p>Distribuição da capacidade</p></div></div><div className="analise-rosca-bloco"><div className="analise-rosca compacta" style={{ background: `conic-gradient(${gradienteTipos})` }}><span><strong>{demonstracao.total}</strong>total</span></div><ul>{demonstracao.porTipo.map((item) => <li key={item.tipo}><i style={{ background: tipos[item.tipo].cor }}/><span>{tipos[item.tipo].nome}</span><strong>{item.quantidade}</strong></li>)}</ul></div></article>
    </div>

    <article className="analise-painel analise-tabela"><div className="analise-titulo"><div><h3>Desempenho por setor</h3><p>Indicadores demonstrativos associados à estrutura atual</p></div></div><div className="analise-tabela-scroll"><table><thead><tr><th>Setor</th><th>Vagas totais</th><th>Ocupadas</th><th>Livres</th><th>Taxa de ocupação</th><th>Tempo médio</th><th>Rotatividade</th></tr></thead><tbody>{demonstracao.setores.map((setor, indice) => <tr key={`${setor.nome}-${indice}`}><th scope="row"><i style={{ background: coresSetor[indice % 4] }}/>{setor.nome}</th><td>{setor.total}</td><td>{setor.ocupadas}</td><td>{setor.livres}</td><td><span className="taxa-setor"><b style={{ width: `${setor.taxa}%` }}/></span>{setor.taxa.toFixed(1).replace(".", ",")}%</td><td>{setor.permanencia}</td><td>{setor.rotatividade.toFixed(2).replace(".", ",")}</td></tr>)}</tbody></table></div></article>
  </section>
}
