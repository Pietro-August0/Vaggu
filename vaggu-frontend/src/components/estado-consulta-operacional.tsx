import { Button } from "@/components/ui/button"

interface EstadoConsultaOperacionalProps {
  carregando: boolean
  vencida: boolean
  erro: string
  atualizando: boolean
  aoTentar: () => void
}

/** Anuncia apenas carregamento ou problemas; o polling saudável não altera a interface. */
export function EstadoConsultaOperacional({ carregando, vencida, erro, atualizando, aoTentar }: EstadoConsultaOperacionalProps) {
  if (!carregando && !vencida && !erro) return null

  const falha = Boolean(erro) || vencida
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm ${falha ? "border-amber-400/50 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100" : "bg-card text-card-foreground"}`}>
      <p role={falha ? "alert" : "status"}>
        {falha ? erro || "Leituras desatualizadas. A disponibilidade voltará após uma nova consulta válida." : "Carregando estacionamento..."}
      </p>
      {falha && <Button type="button" variant="outline" disabled={atualizando} onClick={aoTentar}>Tentar novamente</Button>}
    </div>
  )
}
