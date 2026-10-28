/** Solicita tela cheia no clique e mantém a apresentação na mesma aba. */
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

export function ApresentarTelao({ destino, children, ...props }: ComponentProps<typeof Button> & { destino: string }) {
  const navegar = useNavigate()
  function apresentar() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      void document.documentElement.requestFullscreen().catch(() => undefined)
    }
    navegar(destino)
  }
  return <Button {...props} onClick={apresentar}>{children}</Button>
}
