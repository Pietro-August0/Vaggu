/** Resume a análise de um shopping para o Admin sem misturar dados entre unidades. */
import { useEffect, useMemo, useState } from "react"
import { Activity, Radio, TrendingUp } from "lucide-react"

import { useAppStore } from "@/app/app-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { lerAnaliseHistorica, type AnaliseHistorica } from "@/servicos/analise"
import type { EstruturaEstacionamento } from "@/types/estrutura"

const serieDemonstrativa = [42, 48, 45, 61, 68, 64, 72]

export function ResumoAnaliticoAdmin({ shoppingId, estrutura }: { shoppingId: string; estrutura: EstruturaEstacionamento }) {
  const { consultar } = useAppStore()
  const [historico, setHistorico] = useState<AnaliseHistorica | null>(null)
  const [indisponivel, setIndisponivel] = useState(false)

  useEffect(() => {
    let ativo = true
    consultar(`/shoppings/${shoppingId}/analise`)
      .then(lerAnaliseHistorica)
      .then((dados) => { if (ativo) setHistorico(dados) })
      .catch(() => { if (ativo) setIndisponivel(true) })
    return () => { ativo = false }
  }, [consultar, shoppingId])

  const vagas = useMemo(() => estrutura.andares.flatMap((andar) => andar.setores.flatMap((setor) => setor.vagas)), [estrutura])
  const dadosReais = historico?.temHistorico === true
  const valores = dadosReais ? historico.porDia.map((dia) => dia.ocupacaoPercentual) : serieDemonstrativa
  const ocupadas = vagas.filter((vaga) => vaga.estadoAtual === "OCUPADA").length
  const ocupacaoAtual = vagas.length > 0 ? ocupadas / vagas.length * 100 : 0
  const cobertura = dadosReais ? historico.resumo.coberturaPercentual : 0
  const maior = Math.max(...valores, 1)

  return <Card className="border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg dark:shadow-black/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2"><Activity className="size-4 text-[#d1b900] dark:text-[#ffe100]" aria-hidden="true"/>Análise compacta</CardTitle>
      <CardDescription>Indicadores operacionais para conferência administrativa.</CardDescription>
      <CardAction><Badge variant="outline" className={dadosReais ? "border-emerald-600/40 text-emerald-700 dark:text-emerald-300" : "border-[#b49d00]/50 text-[#6b5d00] dark:text-[#ffe100]"}>{dadosReais ? "Histórico real" : "Demonstração"}</Badge></CardAction>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,1.3fr)]">
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted p-3"><dt className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3.5" aria-hidden="true"/>Ocupação atual</dt><dd className="mt-1 text-xl font-bold">{ocupacaoAtual.toFixed(1).replace(".", ",")}%</dd></div>
        <div className="rounded-lg bg-muted p-3"><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Radio className="size-3.5" aria-hidden="true"/>Cobertura</dt><dd className="mt-1 text-xl font-bold">{dadosReais ? `${cobertura.toFixed(1).replace(".", ",")}%` : "—"}</dd></div>
      </dl>
      <div><p className="mb-2 text-xs font-medium text-muted-foreground">Ocupação nos últimos 7 dias</p><TooltipProvider><div className="flex h-20 items-end gap-1 rounded-lg bg-muted/70 px-3 pt-3" role="group" aria-label="Ocupação nos últimos sete dias">{valores.map((valor, indice) => <Tooltip key={indice}><TooltipTrigger asChild><button type="button" className="min-w-2 flex-1 origin-bottom rounded-t-sm bg-[#d1b900] transition-[filter,transform] duration-300 motion-safe:animate-in motion-safe:slide-in-from-bottom-2 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:bg-[#ffe100]" style={{ height: `${Math.max(8, valor / maior * 100)}%` }} aria-label={`Dia ${indice + 1}: ${valor.toFixed(1).replace(".", ",")}% de ocupação`}/></TooltipTrigger><TooltipContent>Dia {indice + 1} · {valor.toFixed(1).replace(".", ",")}% ocupado</TooltipContent></Tooltip>)}</div></TooltipProvider></div>
      {indisponivel && <p role="status" className="col-span-full text-xs text-muted-foreground">O histórico não pôde ser consultado; a prévia demonstrativa continua identificada.</p>}
    </CardContent>
  </Card>
}
