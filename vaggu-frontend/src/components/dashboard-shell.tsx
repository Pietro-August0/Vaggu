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
  Moon,
  Sun,
  Map,
  ChartNoAxesCombined,
  ArrowLeft,
  Settings,
  UsersRound,
  UserRound,
  Monitor,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import { MinhaConta } from "@/components/minha-conta"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { EMAIL_CONTATO, WHATSAPP_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

/** Exibe os atalhos recebidos e destaca aquele cujo endereço coincide com a rota atual. */
function Navigation({ items, admin = false, aoNavegar }: { items: NavItem[]; admin?: boolean; aoNavegar: () => void }) {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Navegação do painel" className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href || (item.href === "/painel/teloes" && pathname.startsWith("/painel/telao"))

        return (
          <Button
            asChild
            className={cn(
              "h-11 justify-start gap-3 rounded-xl px-3",
              active
                ? admin ? "bg-neutral-950 text-[#ffe100] hover:bg-neutral-900 hover:text-[#ffe100]" : "bg-[#ffe100] text-black hover:bg-[#ffe100]/90 hover:text-black"
                : admin ? "text-neutral-950 hover:bg-black/10 hover:text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
            )}
            key={item.href}
            variant="ghost"
          >
            <Link to={item.href} onClick={aoNavegar} aria-current={active ? "page" : undefined}>
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
  shoppingId,
  children,
}: {
  title: string
  eyebrow: string
  shoppingId?: string
  children: ReactNode
}) {
  const { currentUser, logout } = useAppStore()
  const { pathname } = useLocation()
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false)
  const [secaoConfiguracoes, setSecaoConfiguracoes] = useState<"geral" | "conta">("geral")
  const [saindo, setSaindo] = useState(false)
  const [erroSaida, setErroSaida] = useState("")
  const conteudoRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const origemConfiguracoes = useRef<HTMLButtonElement | null>(null)
  const voltarRef = useRef<HTMLButtonElement>(null)
  const contaRef = useRef<HTMLButtonElement>(null)
  const rotaInicial = useRef(pathname)
  const isAdmin = currentUser?.role === "admin"
  const navItems: NavItem[] = isAdmin
    ? [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Cadastrar shopping", href: "/admin/cadastrar", icon: FilePlus2 },
      { label: "Shoppings", href: "/admin/shoppings", icon: Building2 },
    ]
    : [{ label: "Estacionamento", href: "/painel", icon: LayoutDashboard }, { label: "Análise", href: "/painel/analise", icon: ChartNoAxesCombined }, { label: "Telões", href: "/painel/teloes", icon: Monitor }]
  const shoppingItems: NavItem[] = shoppingId ? [
    { label: "Visão geral", href: `/admin/shoppings/${shoppingId}`, icon: LayoutDashboard },
    { label: "Estrutura e mapa", href: `/admin/shoppings/${shoppingId}/estrutura`, icon: Map },
    { label: "Gerentes", href: `/admin/shoppings/${shoppingId}/gerentes`, icon: UsersRound },
  ] : []
  const escuro = resolvedTheme === "dark"
  const rotaConta = pathname === (isAdmin ? "/admin/conta" : "/painel/conta")
  const configuracoesVisiveis = configuracoesAbertas || rotaConta
  const contaVisivel = rotaConta || secaoConfiguracoes === "conta"

  function abrirConfiguracoes(gatilho: HTMLButtonElement) {
    origemConfiguracoes.current = gatilho
    setErroSaida("")
    setSecaoConfiguracoes("geral")
    setMenuAberto(false)
    setConfiguracoesAbertas(true)
  }

  function fecharConfiguracoes() {
    if (saindo) return
    setConfiguracoesAbertas(false)
    setSecaoConfiguracoes("geral")
    if (rotaConta) navigate(isAdmin ? "/admin" : "/painel", { replace: true })
  }

  function abrirConta() {
    setSecaoConfiguracoes("conta")
    requestAnimationFrame(() => voltarRef.current?.focus())
  }

  function voltarConfiguracoes() {
    setConfiguracoesAbertas(true)
    setSecaoConfiguracoes("geral")
    if (rotaConta) navigate(isAdmin ? "/admin" : "/painel", { replace: true })
    requestAnimationFrame(() => contaRef.current?.focus())
  }

  function fecharNavegacao() {
    setMenuAberto(false)
    setConfiguracoesAbertas(false)
    setSecaoConfiguracoes("geral")
  }

  /** Anuncia o contexto pelo conteúdo principal sem repetir uma faixa de títulos. */
  useEffect(() => {
    if (pathname === rotaInicial.current) return
    rotaInicial.current = pathname
    conteudoRef.current?.focus()
  }, [pathname])

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
      </div>
      <p className={cn("mb-2 text-xs font-bold uppercase tracking-[0.18em]", isAdmin ? "text-neutral-800/70" : "text-neutral-500")}>{isAdmin ? "Administração" : "Shopping"}</p>
      <Navigation items={navItems} admin={isAdmin} aoNavegar={fecharNavegacao} />
      {shoppingItems.length > 0 && <div className="mt-6 border-t border-black/15 pt-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-800/70">Shopping atual</p>
        <Navigation items={shoppingItems} admin aoNavegar={fecharNavegacao} />
      </div>}
      <div className="mt-auto border-t border-current/15 pt-5">
        <Button
          type="button"
          variant="ghost"
          className={isAdmin ? "h-11 w-full justify-start gap-3 text-neutral-950 hover:bg-black/10 hover:text-black" : "h-11 w-full justify-start gap-3 text-neutral-300 hover:bg-neutral-900 hover:text-white"}
          aria-haspopup="dialog"
          aria-expanded={configuracoesVisiveis}
          data-configuracoes-trigger=""
          onClick={evento => abrirConfiguracoes(evento.currentTarget)}
        >
          <Settings className="size-4" aria-hidden="true" />
          Configurações
        </Button>
      </div>
    </>
  )

  return (
    <div className="painel-vaggu min-h-screen bg-[#f5f5f3] text-neutral-950 dark:bg-[#171717] dark:text-neutral-100">
      <a href="#conteudo-principal" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-neutral-950 px-4 py-2 font-semibold text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#ffe100]">
        Ir para o conteúdo principal
      </a>
      <aside className={isAdmin ? "fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto bg-[#ffe100] p-6 lg:flex" : "fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto bg-neutral-950 p-6 lg:flex"}>
        {sideContent}
      </aside>

      <div className="min-w-0 max-w-full lg:pl-64">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[#f5f5f3]/95 px-4 py-2 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#171717]/95">
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button ref={menuRef} aria-label="Abrir navegação" className="h-11 w-11 border-black/15 bg-white/80 text-neutral-950 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" size="icon" variant="outline"><Menu aria-hidden="true" /></Button>
            </SheetTrigger>
            <SheetContent onCloseAutoFocus={evento => { if (configuracoesVisiveis) evento.preventDefault() }} className={isAdmin ? "flex w-[86vw] max-w-sm flex-col overflow-y-auto border-yellow-300 bg-[#ffe100] p-6 text-black" : "flex w-[86vw] max-w-sm flex-col overflow-y-auto border-neutral-800 bg-neutral-950 p-6 text-white"} side="left">
              <SheetHeader className="sr-only"><SheetTitle>Navegação</SheetTitle><SheetDescription>Atalhos do painel VAGGU.</SheetDescription></SheetHeader>
              {sideContent}
            </SheetContent>
          </Sheet>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            aria-label="Abrir configurações"
            aria-haspopup="dialog"
            aria-expanded={configuracoesVisiveis}
            data-configuracoes-trigger=""
            onClick={evento => abrirConfiguracoes(evento.currentTarget)}
          ><Settings aria-hidden="true" /></Button>
        </div>
        <main ref={conteudoRef} id="conteudo-principal" aria-label={title} tabIndex={-1} className={isAdmin ? "min-w-0 max-w-full overflow-x-hidden px-0 py-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a58b00] dark:focus-visible:ring-[#ffe100]" : "min-w-0 max-w-full overflow-x-hidden px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a58b00] sm:px-6 lg:px-10 lg:py-8 dark:focus-visible:ring-[#ffe100]"}><h1 className="sr-only">{title}</h1>{children}</main>
      </div>
      <Dialog open={configuracoesVisiveis} onOpenChange={aberto => { if (!aberto) fecharConfiguracoes() }}>
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:max-w-2xl sm:p-7"
          showCloseButton={!saindo}
          onCloseAutoFocus={evento => {
            const origem = origemConfiguracoes.current
            const destino = origem?.isConnected && origem.getClientRects().length > 0
              ? origem
              : menuRef.current && menuRef.current.getClientRects().length > 0
                ? menuRef.current
                : [...document.querySelectorAll<HTMLButtonElement>("[data-configuracoes-trigger]")].find(gatilho => gatilho.getClientRects().length > 0)
            if (destino) { evento.preventDefault(); destino.focus() }
          }}
        >
          <DialogHeader className="pr-9">
            <DialogTitle className="font-heading text-2xl">{contaVisivel ? "Minha conta" : "Configurações"}</DialogTitle>
            <DialogDescription>{contaVisivel ? "Atualize seus dados pessoais e gerencie sua senha." : "Gerencie sua conta, a aparência e o acesso ao painel."}</DialogDescription>
          </DialogHeader>
          {contaVisivel ? <>
            <Button ref={voltarRef} type="button" variant="ghost" className="mb-1 w-fit gap-2" onClick={voltarConfiguracoes}><ArrowLeft aria-hidden="true" />Voltar às configurações</Button>
            <MinhaConta />
          </> : <div className="grid divide-y divide-neutral-200 dark:divide-white/10">
            <section className="pb-5" aria-labelledby="configuracoes-conta">
              <h2 id="configuracoes-conta" className="text-sm font-semibold">Conta</h2>
              <div className="mt-3 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{currentUser?.nome}</p><p className="mt-1 truncate text-xs text-neutral-600 dark:text-neutral-400">{currentUser?.email}</p></div>
                <Button ref={contaRef} type="button" variant="outline" disabled={saindo} onClick={abrirConta}><UserRound aria-hidden="true" />Minha conta</Button>
              </div>
            </section>
            <section className="py-5" aria-labelledby="configuracoes-aparencia">
              <h2 id="configuracoes-aparencia" className="text-sm font-semibold">Aparência</h2>
              <div role="group" aria-label="Tema da interface" className="mt-3 flex gap-3">
                <Button type="button" className="h-11 flex-1" variant={escuro ? "outline" : "default"} aria-pressed={!escuro} disabled={saindo} onClick={() => setTheme("light")}><Sun aria-hidden="true" />Modo claro</Button>
                <Button type="button" className="h-11 flex-1" variant={escuro ? "default" : "outline"} aria-pressed={escuro} disabled={saindo} onClick={() => setTheme("dark")}><Moon aria-hidden="true" />Modo escuro</Button>
              </div>
            </section>
            {!isAdmin && <section className="py-5" aria-labelledby="configuracoes-alteracoes">
              <h2 id="configuracoes-alteracoes" className="text-sm font-semibold">Solicitar alterações</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Fale com a equipe VAGGU sobre mudanças no seu shopping.</p>
              <Button asChild variant="outline" className="mt-3 min-h-11 w-full sm:w-auto"><a href={WHATSAPP_URL ?? `mailto:${EMAIL_CONTATO}`} target={WHATSAPP_URL ? "_blank" : undefined} rel={WHATSAPP_URL ? "noreferrer" : undefined} aria-label={WHATSAPP_URL ? "Solicitar alterações pelo WhatsApp (abre em nova aba)" : "Solicitar alterações por e-mail"}><MessageCircle aria-hidden="true" />Solicitar alterações{WHATSAPP_URL && <ExternalLink aria-hidden="true" />}</a></Button>
            </section>}
            <section className="pt-5" aria-labelledby="configuracoes-sessao">
              <h2 id="configuracoes-sessao" className="text-sm font-semibold">Sessão</h2>
              {erroSaida && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{erroSaida}</p>}
              <Button type="button" variant="outline" className="mt-3 h-11 w-full gap-2 sm:w-auto" disabled={saindo} onClick={() => void handleLogout()}><LogOut aria-hidden="true" />{saindo ? "Saindo..." : "Sair"}</Button>
            </section>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
