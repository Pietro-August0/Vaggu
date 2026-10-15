/** Consulta por sensor; exemplos são fotografias fictícias, nunca telemetria ao vivo. */
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
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
  const exibidas = vagas.filter(vaga => situacao === "TODOS" || vaga.monitoramento?.situacao === situacao || situacao === "SEM_SENSOR" && !vaga.monitoramento)
  return <section aria-label="Monitoramento dos sensores" className="grid min-w-0 gap-4">
    <div className="rounded-xl border bg-background p-4"><h3 className="font-bold">Monitoramento por sensor</h3><p className="mt-1 text-sm text-muted-foreground">{demonstracao ? "Situação individual, última observação e vínculo de cada sensor com a placa ESP32." : "Situação individual na última consulta. O contato da placa não substitui a leitura de cada sensor."}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">{Object.entries(nomesSituacaoSensor).map(([chave, nome]) => <span className="rounded-lg border px-2 py-1" key={chave}>{nome}: <strong>{vagas.filter(vaga => vaga.monitoramento?.situacao === chave).length}</strong></span>)}</div>
    </div>
    <div className="grid max-w-sm gap-1 text-sm font-semibold"><label htmlFor={filtroId}>Situação do sensor</label><select id={filtroId} className="min-h-11 rounded-md border bg-background px-3" value={situacao} onChange={e => setSituacao(e.target.value)}><option value="TODOS">Todas as situações</option>{Object.entries(nomesSituacaoSensor).map(([chave, nome]) => <option key={chave} value={chave}>{nome}</option>)}<option value="SEM_SENSOR">Sem sensor vinculado</option></select></div>
    <p role="status" className="text-sm text-muted-foreground">{exibidas.length} sensor(es)/vaga(s) no recorte.</p>
    <ul className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">{exibidas.map(vaga => <li key={vaga.id} className="min-w-0 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><strong>Vaga {vaga.codigo}</strong><span className={`rounded-full px-2 py-1 text-xs font-semibold ${vaga.monitoramento?.situacao === "OPERANDO" ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"}`}>{vaga.monitoramento ? nomesSituacaoSensor[vaga.monitoramento.situacao] : "Sem sensor vinculado"}</span></div>
      <p className="mt-1 text-sm text-muted-foreground">{vaga.setor}</p>
      <dl className="my-3 grid gap-2 text-sm"><div><dt className="text-muted-foreground">Sensor</dt><dd className="break-all font-medium">{vaga.monitoramento?.sensorCodigo ?? "Não configurado"}</dd></div><div><dt className="text-muted-foreground">Placa ESP32</dt><dd className="break-words">{vaga.monitoramento?.placaNome ?? "Não vinculada"}</dd></div><div><dt className="text-muted-foreground">Última observação individual</dt><dd>{horarioSensor(vaga.monitoramento?.ultimaObservacaoEm ?? null)}</dd></div></dl>
      <Button variant="outline" onClick={() => aoSelecionar(vaga.id)} aria-label={`Ver monitoramento da vaga ${vaga.codigo}`}>Ver detalhes</Button>
    </li>)}</ul>
    {exibidas.length === 0 && <p className="rounded-xl border p-5">Nenhum sensor corresponde aos filtros.</p>}
  </section>
}
