/** Mantém mapa e monitoramento do gerente sincronizados com a estrutura autorizada. */
import { VisualizacaoVagas } from "@/components/visualizacao-vagas"
import { Button } from "@/components/ui/button"
import { useEstruturaAtualizada } from "@/hooks/use-estrutura-atualizada"

export function MapaEstacionamento() {
  const { estrutura, erro, vencida, atualizando, atualizar, consultadoEm } = useEstruturaAtualizada("/estacionamento/estrutura")
  return <div className="grid gap-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-card-foreground">
      <p role="status" className="text-sm">{vencida ? "Leituras indisponíveis até a próxima atualização." : consultadoEm ? `Atualizado às ${new Date(consultadoEm).toLocaleTimeString("pt-BR")}. Atualização automática a cada meio segundo.` : "Carregando estacionamento..."}</p>
      <Button variant="outline" disabled={atualizando} onClick={() => void atualizar()}>{atualizando ? "Atualizando..." : "Atualizar agora"}</Button>
      {erro && <p role="alert" className="w-full text-sm text-red-700 dark:text-red-300">{erro}</p>}
    </div>
    {estrutura && <>
      {estrutura.shopping.situacaoImplantacao !== "ATIVO" && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-neutral-950 dark:border-[#ffe100]/35 dark:bg-[#292929] dark:text-white"><h2 className="text-lg font-semibold">Seu estacionamento está em configuração</h2><p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">A estrutura cadastrada já pode ser consultada; estados sem leitura confirmada permanecem indisponíveis.</p></div>}
      <VisualizacaoVagas key={estrutura.shopping.id} estrutura={estrutura} modo="gerente"/>
    </>}
  </div>
}
