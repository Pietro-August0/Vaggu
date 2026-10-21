/** Consulta o mapa sem sobrepor requisições ou exibir leituras antigas após falha. */
import { useEffect, useState } from "react"
import { useAppStore } from "@/app/app-store"
import { VisualizacaoVagas } from "@/components/visualizacao-vagas"
import { lerEstrutura } from "@/servicos/estrutura"
import type { EstruturaEstacionamento } from "@/types/estrutura"

export function MapaAoVivo({ caminho, modo }: { caminho: string; modo: "admin" | "gerente" }) {
  const { consultar } = useAppStore()
  const [resposta, setResposta] = useState<{ caminho: string; estrutura: EstruturaEstacionamento } | null>(null)
  const [erro, setErro] = useState("")
  useEffect(() => {
    let ativo = true
    let consultando = false
    let prazo: ReturnType<typeof setTimeout> | undefined
    async function atualizar() {
      if (!ativo || consultando) return
      clearTimeout(prazo)
      if (document.visibilityState === "hidden") return
      consultando = true
      try {
        const estrutura = lerEstrutura(await consultar(caminho))
        if (ativo) { setResposta({ caminho, estrutura }); setErro("") }
      } catch (falha) {
        if (ativo) {
          setResposta(null)
          setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar as vagas.")
        }
      } finally {
        consultando = false
        if (ativo) prazo = setTimeout(() => { void atualizar() }, 500)
      }
    }
    function aoRetornar() { if (document.visibilityState === "visible") void atualizar() }
    void atualizar()
    document.addEventListener("visibilitychange", aoRetornar)
    return () => { ativo = false; clearTimeout(prazo); document.removeEventListener("visibilitychange", aoRetornar) }
  }, [caminho, consultar])
  if (erro) return <div role="alert" className="rounded-2xl border border-destructive p-6 text-destructive">{erro} A consulta será repetida automaticamente.</div>
  if (!resposta || resposta.caminho !== caminho) return <div role="status" className="rounded-2xl bg-background p-6">Carregando estacionamento...</div>
  const { estrutura } = resposta
  return <div className="grid gap-4">
    <p className="text-sm text-muted-foreground">Atualização automática das vagas a cada meio segundo. A confirmação depende de leituras consistentes do sensor.</p>
    {modo === "gerente" && estrutura.shopping.situacaoImplantacao !== "ATIVO" && <div className="rounded-2xl border border-border bg-background p-5"><h2 className="text-lg font-semibold">Seu estacionamento está em configuração</h2><p className="mt-1 text-sm text-muted-foreground">A estrutura cadastrada já pode ser consultada; estados sem leitura confirmada permanecem indisponíveis.</p></div>}
    <VisualizacaoVagas key={estrutura.shopping.id} estrutura={estrutura} modo={modo} />
  </div>
}
