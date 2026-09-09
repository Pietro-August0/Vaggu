import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAppStore } from "@/app/app-store"
import type { UserRole } from "@/types/app"

export function ProtectedRoute({
  role,
  children,
}: {
  role: UserRole
  children: ReactNode
}) {
  const { ready, currentUser } = useAppStore()

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 size-3 animate-pulse rounded-full bg-[#ffe100]" />
          <p className="text-sm text-neutral-400">Preparando a experiência VAGGU...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) return <Navigate replace to="/login" />
  if (currentUser.role !== role) {
    return <Navigate replace to={currentUser.role === "admin" ? "/admin" : "/painel"} />
  }

  return children
}
