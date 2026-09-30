/** Mantém o painel operacional e a edição da própria conta do gerente autenticado. */
import { useLocation } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { AnaliseEstacionamento } from "@/components/analise-estacionamento"
import "@/components/analise-estacionamento.css"
import { MapaEstacionamento } from "@/components/mapa-estacionamento"
import { MinhaConta } from "@/components/minha-conta"

/** Exibe somente recursos autorizados ao gerente do shopping da sessão. */
export function AreaAutenticada() {
  const { currentUser } = useAppStore()
  const { pathname } = useLocation()
  if (!currentUser) return null

  const conta = pathname === "/painel/conta"
  const analise = pathname === "/painel/analise"
  const titulo = conta ? "Minha conta" : analise ? "Análise do estacionamento" : "Estacionamento"
  return <DashboardShell eyebrow="Área do cliente" title={titulo}>
    <div className="grid max-w-6xl gap-6">{conta ? <MinhaConta /> : analise ? <AnaliseEstacionamento /> : <MapaEstacionamento />}</div>
  </DashboardShell>
}
