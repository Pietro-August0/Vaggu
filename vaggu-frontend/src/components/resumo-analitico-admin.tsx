/** Resumo administrativo usando somente estrutura e histórico recebidos da API. */
import { useEffect, useState } from "react"
import { Activity } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { lerAnaliseHistorica, formatarMetrica, type AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento } from "@/types/estrutura"
export function ResumoAnaliticoAdmin({ shoppingId, estrutura }: { shoppingId: string; estrutura: EstruturaEstacionamento }) {
  const { consultar } = useAppStore()
  const [resposta, setResposta] = useState<{ id: string; historico: AnaliseHistorica } | null>(null)
  const [erro, setErro] = useState("")
  useEffect(() => {
    let ativo = true
    consultar(`/shoppings/${shoppingId}/analise`).then(lerAnaliseHistorica).then(historico => { if (ativo) { setResposta({ id: shoppingId, historico }); setErro("") } }).catch(() => { if (ativo) setErro("Histórico indisponível. Tente novamente ao reabrir esta ficha.") })
    return () => { ativo = false }
  }, [consultar, shoppingId])
  const historico = resposta?.id === shoppingId ? resposta.historico : null
  const vagas = estrutura.andares.filter(a => a.ativo).flatMap(a => a.setores.filter(s => s.ativo).flatMap(s => s.vagas.filter(v => v.ativo)))
  const conhecidas = vagas.filter(v => v.estadoAtual === "LIVRE" || v.estadoAtual === "OCUPADA")
  const ocupacao = conhecidas.length ? conhecidas.filter(v => v.estadoAtual === "OCUPADA").length / conhecidas.length * 100 : null
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity aria-hidden="true"/>Análise compacta</CardTitle><CardDescription>{estrutura.shopping.demonstracao ? "Cenário de demonstração." : "Últimos sete dias UTC."}</CardDescription></CardHeader><CardContent className="grid gap-4"><dl className="grid gap-3 sm:grid-cols-2"><div><dt>Ocupação entre vagas com leitura atual</dt><dd className="text-xl font-bold">{formatarMetrica(ocupacao, "%")}</dd></div><div><dt>Cobertura histórica</dt><dd className="text-xl font-bold">{formatarMetrica(historico?.resumo.coberturaPercentual, "%")}</dd></div></dl>{erro ? <p role="alert">{erro}</p> : !historico ? <p role="status">Consultando histórico...</p> : historico.resumo.ocupacaoPercentual === null ? <p>Sem observação histórica suficiente. Ausência de leitura não significa estacionamento vazio.</p> : <ul className="grid gap-2 sm:grid-cols-2">{historico.porDia.map(dia => <li key={dia.inicioEm} className="flex justify-between gap-2 rounded-md bg-muted p-2 text-sm"><span>{new Date(dia.inicioEm).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span><strong>{formatarMetrica(dia.ocupacaoPercentual, "%")}</strong></li>)}</ul>}</CardContent></Card>
}
