/** Permite ao gerente escolher a apresentação de cada telão do seu shopping. */
import { Monitor } from "lucide-react"
import { ApresentarTelao } from "@/components/apresentar-telao"
import { DashboardShell } from "@/components/dashboard-shell"
import { TeloesAdmin } from "@/components/teloes-admin"
import { Button } from "@/components/ui/button"
import { useEstruturaAtualizada } from "@/hooks/use-estrutura-atualizada"

export function TeloesPage() {
  const { estrutura, erro, atualizando, atualizar } = useEstruturaAtualizada("/estacionamento/estrutura")

  return <DashboardShell title="Telões" eyebrow={estrutura?.shopping.nome ?? "Estacionamento"}>
    <div className="grid min-w-0 gap-6">
      <section className="grid gap-4 rounded-2xl border bg-card p-4 text-card-foreground sm:p-6" aria-label="Prévia das telas">
        <div className="flex items-start gap-3"><Monitor className="mt-0.5 size-6 shrink-0 text-muted-foreground" aria-hidden="true"/><div><h2 className="text-xl font-semibold">Prévia das telas</h2><p className="mt-1 text-sm text-muted-foreground">Apresente a visão geral ou um andar nesta tela. Use Esc para sair da tela cheia e Alt + S para voltar à gestão.</p></div></div>
        <div className="flex flex-wrap gap-2">
          <ApresentarTelao destino="/painel/telao">Apresentar visão geral</ApresentarTelao>
          {estrutura?.andares.filter(andar => andar.ativo).map(andar => <ApresentarTelao variant="outline" key={andar.id} destino={`/painel/telao/andares/${andar.id}`}>Apresentar {andar.nome}</ApresentarTelao>)}
        </div>
      </section>
      {erro && <div role="alert" className="grid gap-3 rounded-xl border border-red-300 p-4"><p>{erro}</p><Button disabled={atualizando} variant="outline" className="w-fit" onClick={() => void atualizar()}>Tentar novamente</Button></div>}
      {!estrutura && !erro && <p role="status">Carregando configuração dos telões…</p>}
      {estrutura && <TeloesAdmin estrutura={estrutura}/>}
    </div>
  </DashboardShell>
}
