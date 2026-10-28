/** A instalação usa credencial própria em cabeçalho e recebe somente contagens agregadas. */
import { useEffect, useState, type FormEvent } from "react"
import { TelaoApresentacao } from "@/components/telao-apresentacao"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { objeto } from "@/servicos/api"
import "./telao-page.css"
type Contagem = { total: number; livres: number; monitoradas: number; parcial: boolean }
type Dados = Contagem & { escopo: { tipo: "GERAL" | "ANDAR" | "SETOR"; nome: string }; nome: string; shopping: string; demonstracao: boolean; grupos: (Contagem & { nome: string })[]; categorias: (Contagem & { tipo: string })[] }
function contagemValida(valor: unknown): boolean {
 return objeto(valor) && Number.isSafeInteger(valor.livres) && Number.isSafeInteger(valor.monitoradas)
  && Number(valor.livres) >= 0 && Number(valor.monitoradas) >= Number(valor.livres)
}
function ler(d: unknown): Dados {
 if (!objeto(d) || typeof d.nome !== "string" || typeof d.shopping !== "string" || !contagemValida(d)
  || !objeto(d.escopo) || typeof d.escopo.nome !== "string" || !["GERAL", "ANDAR", "SETOR"].includes(String(d.escopo.tipo))
  || !Array.isArray(d.grupos) || !d.grupos.every(g => objeto(g) && typeof g.nome === "string" && contagemValida(g))
  || !Array.isArray(d.categorias) || !d.categorias.every(c => objeto(c) && typeof c.tipo === "string" && contagemValida(c))) throw new Error("Disponibilidade inválida.")
 return d as Dados
}
function chaveSalva(id: string) { try { return sessionStorage.getItem(`telao:${id}`) ?? "" } catch { return "" } }
export function TelaoInstaladoPage() {
 const { telaoId = "" } = useParams()
 const navegar = useNavigate()
 const [chave, setChave] = useState(() => chaveSalva(telaoId)), [dados, setDados] = useState<Dados | null>(null)
 const [erro, setErro] = useState(""), [valido, setValido] = useState(false)
 useEffect(() => {
  if (chave) return
  const sair = (evento: KeyboardEvent) => {
   if (!evento.altKey || evento.ctrlKey || evento.metaKey || evento.code !== "KeyS") return
   evento.preventDefault()
   if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
   navegar("/painel/teloes", { replace: true })
  }
  document.addEventListener("keydown", sair)
  return () => document.removeEventListener("keydown", sair)
 }, [chave, navegar])
 useEffect(() => {
  if (!chave) return
  let ativo = true, pendente = false
  let prazo: ReturnType<typeof setTimeout> | undefined
  let controle: AbortController | undefined
  const renovar = async () => {
   if (!ativo || pendente || document.visibilityState !== "visible") return
   pendente = true; controle = new AbortController()
   const timeout = setTimeout(() => controle?.abort(), 15_000), inicio = Date.now()
   try {
    const r = await fetch(`/api/v1/teloes/${encodeURIComponent(telaoId)}/disponibilidade`, { headers: { Authorization: `Telao ${chave}` }, credentials: "omit", cache: "no-store", signal: controle.signal })
    if (r.status === 401) { try { sessionStorage.removeItem(`telao:${telaoId}`) } catch { /* armazenamento opcional */ } if (ativo) setChave(""); throw new Error("Credencial inválida ou revogada.") }
    if (!r.ok) throw new Error("Não foi possível atualizar a disponibilidade.")
    const proximo = ler(await r.json())
    if (!ativo || !navigator.onLine) return
    setDados(proximo); setValido(true); setErro("")
    try { sessionStorage.setItem(`telao:${telaoId}`, chave) } catch { /* mantém somente em memória */ }
    clearTimeout(prazo); prazo = setTimeout(() => { if (ativo) setValido(false) }, Math.max(0, 30_000 - (Date.now() - inicio)))
   } catch(e) { if (ativo) { setValido(false); setErro(e instanceof Error ? e.message : "Sem conexão.") } }
   finally { clearTimeout(timeout); pendente = false }
  }
  const voltar = () => { if (document.visibilityState === "visible") { setValido(false); void renovar() } }
  const offline = () => { setValido(false); setErro("Sem conexão. Aguardando atualização.") }
  void renovar(); const intervalo = setInterval(() => { void renovar() }, 15_000)
  window.addEventListener("online", voltar); window.addEventListener("offline", offline); document.addEventListener("visibilitychange", voltar)
  return () => { ativo = false; controle?.abort(); clearTimeout(prazo); clearInterval(intervalo); window.removeEventListener("online", voltar); window.removeEventListener("offline", offline); document.removeEventListener("visibilitychange", voltar) }
 }, [chave, telaoId])
 function instalar(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setChave(String(new FormData(e.currentTarget).get("chave") ?? "").trim()); setDados(null); setValido(false) }
 if (!chave) return <main className="mx-auto grid min-h-screen max-w-lg content-center gap-4 p-6"><h1 className="text-2xl font-bold">Autorizar telão VAGGU</h1><p>Informe a credencial emitida na gestão dos telões para esta instalação. O acesso fica guardado somente nesta aba. Use Alt + S para voltar à gestão e Esc para sair da tela cheia.</p>{erro && <p role="alert">{erro}</p>}<form onSubmit={instalar} className="grid gap-3"><label className="grid gap-1">Credencial<Input name="chave" type="password" autoComplete="off" required minLength={43} maxLength={43}/></label><Button>Autorizar exibição</Button></form></main>
 return <TelaoApresentacao
  shopping={dados?.shopping ?? "Estacionamento"}
  escopo={dados?.escopo.nome ?? "Carregando disponibilidade"}
  porAndar={!!dados && dados.escopo.tipo !== "GERAL"}
  contagem={dados ?? { livres: 0, monitoradas: 0 }}
  grupos={dados?.grupos ?? []}
  categorias={dados?.categorias ?? []}
  disponivel={valido}
  demonstracao={dados?.demonstracao}
 />
}
