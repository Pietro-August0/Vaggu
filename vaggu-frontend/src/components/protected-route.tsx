/** Protege a navegação com identidade da API; autorização de recursos continua no backend. */
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import type { UserRole } from "@/types/app"

export function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { currentUser, erroSessao, verificarSessao } = useAppStore()
  if (!currentUser) return <Navigate replace to="/login" />
  if (currentUser.trocarSenhaObrigatoria) return <Navigate replace to="/trocar-senha" />
  if (erroSessao) return <main className="grid min-h-screen place-items-center bg-white p-8">
    <div role="alert" className="max-w-lg text-center"><h1 className="text-2xl font-semibold">Não foi possível verificar seu acesso</h1><p className="my-4">{erroSessao}</p><button className="rounded-lg bg-[#ffe100] px-6 py-3" onClick={() => void verificarSessao()}>Tentar novamente</button></div>
  </main>
  if (currentUser.role !== role) return <Navigate replace to={currentUser.role === "admin" ? "/admin" : "/painel"} />
  return children
}
