/** Mantém mapa e monitoramento do gerente sincronizados com a estrutura autorizada. */
import { VisualizacaoVagas } from "@/components/visualizacao-vagas"
import { EstadoConsultaOperacional } from "@/components/estado-consulta-operacional"
import { useEstruturaAtualizada } from "@/hooks/use-estrutura-atualizada"

export function MapaEstacionamento() {
  const { estrutura, erro, vencida, atualizando, atualizar } = useEstruturaAtualizada("/estacionamento/estrutura")
  return <div className="grid gap-4">
    <EstadoConsultaOperacional carregando={!estrutura} erro={erro} vencida={vencida} atualizando={atualizando} aoTentar={() => void atualizar()} />
    {estrutura && <>
      {estrutura.shopping.situacaoImplantacao !== "ATIVO" && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-neutral-950 dark:border-[#ffe100]/35 dark:bg-[#292929] dark:text-white"><h2 className="text-lg font-semibold">Seu estacionamento está em configuração</h2><p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">A estrutura cadastrada já pode ser consultada; estados sem leitura confirmada permanecem indisponíveis.</p></div>}
      <VisualizacaoVagas key={estrutura.shopping.id} estrutura={estrutura} modo="gerente"/>
    </>}
  </div>
}
