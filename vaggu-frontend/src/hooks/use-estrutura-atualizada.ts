/** Sincroniza a consulta operacional e invalida leituras quando a conexão ou o prazo falha. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppStore } from "@/app/app-store"
import { lerEstrutura } from "@/servicos/estrutura"
import { invalidarLeituras } from "@/servicos/validade-estrutura"
import type { EstruturaEstacionamento } from "@/types/estrutura"

const INTERVALO_MS = 500
const VALIDADE_MS = 30_000
type Consulta = { caminho: string; estrutura: EstruturaEstacionamento; consultadoEm: number }

export function useEstruturaAtualizada(caminho: string, automatica = true) {
  const { consultar } = useAppStore()
  const [consulta, setConsulta] = useState<Consulta | null>(null)
  const [erro, setErro] = useState("")
  const [atualizando, setAtualizando] = useState(false)
  const [vencida, setVencida] = useState(false)
  const sequencia = useRef(0)
  const pendente = useRef(false)
  const prazo = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const atualizar = useCallback(async () => {
    const revisao = ++sequencia.current
    pendente.current = true
    setAtualizando(true)
    const iniciadoEm = Date.now()
    try {
      const estrutura = lerEstrutura(await consultar(caminho))
      if (revisao !== sequencia.current) return
      setConsulta({ caminho, estrutura, consultadoEm: iniciadoEm })
      setErro("")
      setVencida(false)
      clearTimeout(prazo.current)
      prazo.current = setTimeout(() => setVencida(true), Math.max(0, VALIDADE_MS - (Date.now() - iniciadoEm)))
    } catch (falha) {
      if (revisao !== sequencia.current) return
      setVencida(true)
      setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar as vagas.")
    } finally {
      if (revisao === sequencia.current) { pendente.current = false; setAtualizando(false) }
    }
  }, [caminho, consultar])

  const cancelarConsulta = useCallback(() => {
    sequencia.current++
    pendente.current = false
    clearTimeout(prazo.current)
  }, [])

  useEffect(() => {
    const primeira = setTimeout(() => { void atualizar() }, 0)
    const renovar = () => { if (automatica && document.visibilityState === "visible" && !pendente.current) void atualizar() }
    const intervalo = setInterval(renovar, INTERVALO_MS)
    const retornar = () => {
      if (document.visibilityState === "visible" && automatica) { setVencida(true); renovar() }
    }
    const offline = () => { setVencida(true); setErro("Sem conexão. As leituras estão temporariamente indisponíveis.") }
    window.addEventListener("online", renovar)
    window.addEventListener("offline", offline)
    document.addEventListener("visibilitychange", retornar)
    return () => {
      cancelarConsulta()
      clearTimeout(primeira)
      clearInterval(intervalo)
      window.removeEventListener("online", renovar)
      window.removeEventListener("offline", offline)
      document.removeEventListener("visibilitychange", retornar)
    }
  }, [atualizar, automatica, cancelarConsulta])

  const original = consulta?.caminho === caminho ? consulta.estrutura : null
  const estrutura = useMemo(() => original && vencida ? invalidarLeituras(original) : original, [original, vencida])
  return { estrutura, erro, atualizando, vencida, atualizar, consultadoEm: consulta?.caminho === caminho ? consulta.consultadoEm : null }
}
