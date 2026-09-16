/** Compartilha cabeçalho, menu responsivo e saída da sessão entre os painéis autenticados. */
import type { LucideIcon } from "lucide-react"
import {
  Building2,
  FilePlus2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { WHATSAPP_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

/** Exibe os atalhos recebidos e destaca aquele cujo endereço coincide com a rota atual. */
function Navigation({ items, admin = false }: { items: NavItem[]; admin?: boolean }) {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navegação do painel" className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const active = item.href === "/admin/shoppings" ? pathname.startsWith(item.href) : pathname === item.href

        return (
          <Button
            asChild
            className={cn(
              "h-11 justify-start gap-3 rounded-xl px-3",
              active
                ? admin ? "bg-neutral-950 text-[#ffe100] hover:bg-neutral-900" : "bg-[#ffe100] text-black hover:bg-[#ffe100]/90"
                : admin ? "text-neutral-950 hover:bg-black/10 hover:text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
            )}
            key={item.href}
            variant="ghost"
          >
            <Link to={item.href}>
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

/** Recebe títulos e conteúdo da página; escolhe os atalhos pelo perfil do contexto autenticado. */
export function DashboardShell({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: ReactNode
}) {
  const { currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const [saindo, setSaindo] = useState(false)
  const [erroSaida, setErroSaida] = useState("")
  const isAdmin = currentUser?.role === "admin"
  const navItems: NavItem[] = isAdmin
    ? [{ label: "Cadastrar", href: "/admin", icon: FilePlus2 }, { label: "Shoppings", href: "/admin/shoppings", icon: Building2 }]
    : [{ label: "Visão geral", href: "/painel", icon: LayoutDashboard }]

  /** Limpa a sessão na API e substitui a rota atual pela tela de entrada. */
  async function handleLogout() {
    if (saindo) return
    setSaindo(true)
    setErroSaida("")
    try {
      await logout()
      navigate("/login", { replace: true })
    } catch (error) {
      setErroSaida(error instanceof Error ? error.message : "Não foi possível encerrar a sessão. Tente novamente.")
    } finally {
      setSaindo(false)
    }
  }

  const sideContent = (
    <>
      <div className="mb-10">
        <Brand inverted={!isAdmin} />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          {isAdmin ? "Administração" : "Painel do shopping"}
        </p>
      </div>
      <Navigation items={navItems} admin={isAdmin} />
      <div className="mt-auto grid gap-2 pt-8">
        {!isAdmin && WHATSAPP_URL && (
          <Button asChild className="justify-start gap-3" variant="outline">
            <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">
              <MessageCircle className="size-4" aria-hidden="true" />
              Solicitar alteração
              <ExternalLink className="ml-auto size-3.5" aria-hidden="true" />
            </a>
          </Button>
        )}
        <Button
          className={isAdmin ? "justify-start gap-3 text-neutral-950 hover:bg-black/10 hover:text-black" : "justify-start gap-3 text-neutral-400 hover:bg-neutral-900 hover:text-white"}
          disabled={saindo}
          onClick={() => void handleLogout()}
          variant="ghost"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {saindo ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </>
  )

  return (
    <div className={isAdmin ? "min-h-screen bg-[#171717] text-neutral-950" : "min-h-screen bg-[#f5f5f3] text-neutral-950"}>
      <aside className={isAdmin ? "fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#ffe100] p-6 lg:flex" : "fixed inset-y-0 left-0 hidden w-64 flex-col bg-neutral-950 p-6 lg:flex"}>
        {sideContent}
      </aside>

      <div className="lg:pl-64">
        <header className={isAdmin ? "sticky top-0 z-30 border-b border-white/10 bg-[#171717]/90 text-white backdrop-blur-xl" : "sticky top-0 z-30 border-b border-black/5 bg-[#f5f5f3]/90 backdrop-blur-xl"}>
          <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button aria-label="Abrir navegação" className={isAdmin ? "border-white/20 bg-white/10 text-white hover:bg-white/20 lg:hidden" : "lg:hidden"} size="icon" variant="outline">
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent className={isAdmin ? "flex w-[86vw] max-w-sm flex-col border-yellow-300 bg-[#ffe100] p-6 text-black" : "flex w-[86vw] max-w-sm flex-col border-neutral-800 bg-neutral-950 p-6 text-white"} side="left">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navegação</SheetTitle>
                  <SheetDescription>Atalhos do painel VAGGU.</SheetDescription>
                </SheetHeader>
                {sideContent}
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
              <h1 className="break-words font-heading text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
            </div>
            <div className={isAdmin ? "ml-auto hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-300 sm:flex" : "ml-auto hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-neutral-600 sm:flex"}>
              <span className="size-2 rounded-full bg-[#ffe100]" aria-hidden="true" />
              Acesso autenticado
            </div>
          </div>
        </header>
        <main className={isAdmin ? "px-0 py-0" : "px-4 py-8 sm:px-6 lg:px-10 lg:py-10"}>{erroSaida && <p role="alert" className="m-5 text-red-700">{erroSaida}</p>}{children}</main>
      </div>
    </div>
  )
}
