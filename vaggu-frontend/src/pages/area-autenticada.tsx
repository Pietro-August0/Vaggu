/** Mantém o painel operacional e a edição da própria conta do gerente autenticado. */
import { useLocation } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { MapaEstacionamento } from "@/components/mapa-estacionamento"
import { MinhaConta } from "@/components/minha-conta"

/** Exibe somente recursos autorizados ao gerente do shopping da sessão. */
export function AreaAutenticada() {
  const { currentUser } = useAppStore()
  const { pathname } = useLocation()
  if (!currentUser) return null

  const conta = pathname === "/painel/conta"
  return <DashboardShell eyebrow="Área do cliente" title={conta ? "Minha conta" : "Estacionamento"}>
    <div className="grid max-w-6xl gap-6">{conta ? <MinhaConta /> : <MapaEstacionamento />}</div>
  </DashboardShell>
}
