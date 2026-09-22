/** Carrega a estrutura autorizada do gerente e a entrega à visualização compartilhada. */
import { useEffect, useState } from "react"
import { useAppStore } from "@/app/app-store"
import { VisualizacaoVagas } from "@/components/visualizacao-vagas"
import { lerEstrutura } from "@/servicos/estrutura"
import type { EstruturaEstacionamento } from "@/types/estrutura"

/** Consulta uma única árvore consistente; navegação e busca posteriores não disparam respostas concorrentes. */
export function MapaEstacionamento() {
  const { consultar } = useAppStore()
  const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [erro, setErro] = useState("")
  useEffect(() => { let ativo = true; consultar("/estacionamento/estrutura").then(lerEstrutura).then(valor => { if (ativo) setEstrutura(valor) }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao carregar o mapa.") }); return () => { ativo = false } }, [consultar])
  if (erro) return <div role="alert" className="rounded-2xl bg-white p-6 text-red-700">{erro}</div>
  if (!estrutura) return <div className="rounded-2xl bg-white p-6" role="status">Carregando estacionamento...</div>
  return <div className="grid gap-4">{estrutura.shopping.situacaoImplantacao !== "ATIVO" && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5"><h2 className="text-lg font-semibold">Seu estacionamento está em configuração</h2><p className="mt-1 text-sm text-neutral-700">A estrutura cadastrada já pode ser consultada; estados sem leitura confirmada permanecem indisponíveis.</p></div>}<VisualizacaoVagas key={estrutura.shopping.id} estrutura={estrutura} modo="gerente"/></div>
}
