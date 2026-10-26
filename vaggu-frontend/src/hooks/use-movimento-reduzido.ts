/** Acompanha também mudanças de preferência enquanto a página está aberta. */
import { useSyncExternalStore } from "react"

const consulta = "(prefers-reduced-motion: reduce)"
function assinar(atualizar: () => void) {
  const midia = window.matchMedia(consulta)
  midia.addEventListener("change", atualizar)
  return () => midia.removeEventListener("change", atualizar)
}
const lerPreferencia = () => window.matchMedia(consulta).matches
const lerNoServidor = () => true

export function useMovimentoReduzido() {
  return useSyncExternalStore(assinar, lerPreferencia, lerNoServidor)
}
