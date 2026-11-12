/** Consulta por sensor; exemplos são fotografias fictícias, nunca telemetria ao vivo. */
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { MonitoramentoSensor, VagaEstrutura } from "@/types/estrutura"

export const nomesSituacaoSensor: Record<MonitoramentoSensor["situacao"], string> = {
  OPERANDO: "Operando", CONFIRMANDO: "Confirmando mudança", SEM_RESPOSTA: "Sem resposta", MANUTENCAO: "Em manutenção", SEM_LEITURA: "Sem leitura confirmada",
}
export function horarioSensor(valor: string | null) {
  return valor ? new Date(valor).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" }) : "Sem registro"
}

export function MonitoramentoSensores({ vagas, demonstracao, aoSelecionar }: {
  vagas: (VagaEstrutura & { setor: string })[]; demonstracao: boolean; aoSelecionar: (id: string) => void
}) {
  const filtroId = useId()
  const [situacao, setSituacao] = useState("TODOS")
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [situacaoRascunho, setSituacaoRascunho] = useState("TODOS")
  const [busca, setBusca] = useState("")
  const termo = busca.trim().toLocaleLowerCase("pt-BR")
  const exibidas = vagas.filter(vaga => (situacao === "TODOS" || vaga.monitoramento?.situacao === situacao || situacao === "SEM_SENSOR" && !vaga.monitoramento || situacao === "ATENCAO" && (!vaga.monitoramento || !["OPERANDO", "CONFIRMANDO"].includes(vaga.monitoramento.situacao)))
    && (!termo || `${vaga.codigo} ${vaga.setor} ${vaga.monitoramento?.sensorCodigo ?? ""} ${vaga.monitoramento?.placaNome ?? ""}`.toLocaleLowerCase("pt-BR").includes(termo)))
  const precisamAtencao = vagas.filter(vaga => !vaga.monitoramento || !["OPERANDO", "CONFIRMANDO"].includes(vaga.monitoramento.situacao)).length
  return <section aria-label="Monitoramento dos sensores" className="grid min-w-0 gap-4">
    <div className="rounded-xl border bg-background p-4"><h3 className="font-bold">Monitoramento por sensor</h3><p className="mt-1 text-sm text-muted-foreground">{demonstracao ? "Situação individual, última observação e vínculo de cada sensor com a placa ESP32." : "Situação individual na última consulta. O contato da placa não substitui a leitura de cada sensor."}</p>
      <p className="mt-3 text-sm"><strong>{precisamAtencao}</strong> vaga(s) precisam de atenção.</p>
    </div>
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid min-w-0 flex-1 gap-1 text-sm font-semibold"><label htmlFor={`${filtroId}-busca`}>Buscar vaga ou sensor</label><input id={`${filtroId}-busca`} type="search" className="min-h-11 min-w-0 rounded-md border bg-background px-3" placeholder="Código, setor, sensor ou placa" value={busca} onChange={e => setBusca(e.target.value)} /></div>
      <Dialog open={filtrosAbertos} onOpenChange={aberto => { if (aberto) setSituacaoRascunho(situacao); setFiltrosAbertos(aberto) }}>
        <DialogTrigger asChild><Button type="button" variant="outline" className="min-h-11">Filtros{situacao !== "TODOS" ? " (1)" : ""}</Button></DialogTrigger>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto [&_button]:min-h-11">
          <DialogHeader><DialogTitle>Filtros do diagnóstico</DialogTitle><DialogDescription>Encontre sensores que precisam de atenção.</DialogDescription></DialogHeader>
          <form className="grid gap-4" onSubmit={evento => { evento.preventDefault(); setSituacao(situacaoRascunho); setFiltrosAbertos(false) }}>
            <div className="grid gap-1 text-sm font-semibold"><label htmlFor={filtroId}>Situação do sensor</label><select id={filtroId} className="min-h-11 min-w-0 rounded-md border bg-background px-3" value={situacaoRascunho} onChange={e => setSituacaoRascunho(e.target.value)}><option value="TODOS">Todas as situações ({vagas.length})</option><option value="ATENCAO">Precisam de atenção ({precisamAtencao})</option>{Object.entries(nomesSituacaoSensor).map(([chave, nome]) => <option key={chave} value={chave}>{nome} ({vagas.filter(vaga => vaga.monitoramento?.situacao === chave).length})</option>)}<option value="SEM_SENSOR">Sem sensor vinculado ({vagas.filter(vaga => !vaga.monitoramento).length})</option></select></div>
            <DialogFooter><Button type="button" variant="ghost" onClick={() => { setSituacao("TODOS"); setFiltrosAbertos(false) }}>Limpar filtros</Button><Button type="button" variant="outline" onClick={() => setFiltrosAbertos(false)}>Cancelar</Button><Button type="submit">Aplicar filtros</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    {situacao !== "TODOS" && <p className="text-xs text-muted-foreground">Situação: {situacao === "ATENCAO" ? "Precisam de atenção" : situacao === "SEM_SENSOR" ? "Sem sensor vinculado" : nomesSituacaoSensor[situacao as MonitoramentoSensor["situacao"]]}</p>}
    <p role="status" className="text-sm text-muted-foreground">{exibidas.length} de {vagas.length} vagas no recorte.</p>
    <ul className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">{exibidas.map(vaga => <li key={vaga.id} className="min-w-0 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><strong>Vaga {vaga.codigo}</strong><span className={`rounded-full px-2 py-1 text-xs font-semibold ${vaga.monitoramento?.situacao === "OPERANDO" ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"}`}>{vaga.monitoramento ? nomesSituacaoSensor[vaga.monitoramento.situacao] : "Sem sensor vinculado"}</span></div>
      <p className="mt-1 text-sm text-muted-foreground">{vaga.setor}</p>
      <dl className="my-3 grid gap-2 text-sm"><div><dt className="text-muted-foreground">Sensor</dt><dd className="break-all font-medium">{vaga.monitoramento?.sensorCodigo ?? "Não configurado"}</dd></div><div><dt className="text-muted-foreground">Placa ESP32</dt><dd className="break-words">{vaga.monitoramento?.placaNome ?? "Não vinculada"}</dd></div><div><dt className="text-muted-foreground">Última observação individual</dt><dd>{horarioSensor(vaga.monitoramento?.ultimaObservacaoEm ?? null)}</dd></div></dl>
      <Button variant="outline" onClick={() => aoSelecionar(vaga.id)} aria-label={`Ver monitoramento da vaga ${vaga.codigo}`}>Ver detalhes</Button>
    </li>)}</ul>
    {exibidas.length === 0 && <p className="rounded-xl border p-5">Nenhuma vaga corresponde à busca e à situação selecionadas.</p>}
  </section>
}
