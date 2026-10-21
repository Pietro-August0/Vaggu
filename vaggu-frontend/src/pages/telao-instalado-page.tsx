/** A instalação usa credencial própria em cabeçalho e recebe somente contagens agregadas. */
import { useEffect, useState, type FormEvent } from "react"
import { Accessibility, PersonStanding, Zap } from "lucide-react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { objeto } from "@/servicos/api"
import "./telao-page.css"
type Contagem = { total: number; livres: number; monitoradas: number; parcial: boolean }
type Dados = Contagem & { nome: string; shopping: string; demonstracao: boolean; grupos: (Contagem & { nome: string })[]; categorias: (Contagem & { tipo: string })[] }
function ler(d: unknown): Dados {
 if (!objeto(d) || typeof d.nome !== "string" || typeof d.shopping !== "string" || typeof d.livres !== "number" || !Array.isArray(d.grupos) || !Array.isArray(d.categorias)) throw new Error("Disponibilidade inválida.")
 return d as Dados
}
function chaveSalva(id: string) { try { return sessionStorage.getItem(`telao:${id}`) ?? "" } catch { return "" } }
export function TelaoInstaladoPage() {
 const { telaoId = "" } = useParams()
 const [chave, setChave] = useState(() => chaveSalva(telaoId)), [dados, setDados] = useState<Dados | null>(null)
 const [erro, setErro] = useState(""), [valido, setValido] = useState(false), [consultadoEm, setConsultadoEm] = useState<number | null>(null)
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
    if (!ativo) return
    setDados(proximo); setValido(true); setErro(""); setConsultadoEm(inicio)
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
 if (!chave) return <main className="mx-auto grid min-h-screen max-w-lg content-center gap-4 p-6"><h1 className="text-2xl font-bold">Autorizar telão VAGGU</h1><p>Informe a credencial emitida pelo Admin para esta instalação. O acesso fica guardado somente nesta aba.</p>{erro && <p role="alert">{erro}</p>}<form onSubmit={instalar} className="grid gap-3"><label className="grid gap-1">Credencial<Input name="chave" type="password" autoComplete="off" required minLength={43} maxLength={43}/></label><Button>Autorizar exibição</Button></form></main>
 return <main className="telao-vaggu telao-vaggu--instalado">
  <header className="telao-vaggu__topo"><img src="/assets/vaggu-logo-yellow.svg" alt="VAGGU" className="telao-vaggu__logo"/><h1>{dados?.shopping ?? "Estacionamento"}<span> · {dados?.nome}</span></h1></header>
  <section className="telao-vaggu__principal">
   <div className="telao-vaggu__total"><h2>Vagas disponíveis</h2><strong>{valido && dados?.monitoradas ? dados.livres : "—"}</strong></div>
   <p className="telao-vaggu__mensagem" role="status">{!valido ? erro || "Aguardando disponibilidade atualizada" : dados?.parcial ? "Disponibilidade parcial" : "Siga a sinalização para o melhor acesso"}</p>
  </section>
  <section className="telao-vaggu__andares" aria-label="Disponibilidade por área">
   {valido && dados?.grupos.map(g => <article key={g.nome} className={`telao-vaggu__andar telao-vaggu__andar--${g.parcial || !g.monitoradas ? "parcial" : g.livres === 0 ? "alta" : "baixa"}`}><h2>{g.nome}</h2><p><strong>{g.monitoradas ? g.livres : "—"}</strong><span>vagas livres</span></p><span className="telao-vaggu__situacao">{g.parcial ? "Dados parciais" : g.livres === 0 ? "Lotado" : "Vagas disponíveis"}</span></article>)}
  </section>
  <section className="telao-vaggu__categorias" aria-label="Categorias especiais">
   <h2>Vagas por categoria</h2>
   <div className="telao-vaggu__categorias-grade">{dados?.categorias.map(c => {
    const Icone = c.tipo === "ELETRICA" ? Zap : c.tipo === "IDOSO" ? PersonStanding : Accessibility
    return <div key={c.tipo} className={`telao-vaggu__categoria telao-vaggu__categoria--${c.tipo.toLowerCase()}`}>
     <span className="telao-vaggu__categoria-icone" aria-hidden="true"><Icone strokeWidth={2.5}/></span>
     <h3>{c.tipo === "ELETRICA" ? "Elétrica" : c.tipo === "IDOSO" ? "Idoso" : c.tipo}</h3>
     <p><strong>{valido && c.monitoradas ? c.livres : "—"}</strong><span>livres</span></p>
    </div>
   })}</div>
  </section>
  <footer className="telao-vaggu__rodape"><span>{dados?.demonstracao ? "Dados de demonstração" : "Categorias especiais incluídas no total"}</span><span>{consultadoEm && valido ? `Atualizado às ${new Date(consultadoEm).toLocaleTimeString("pt-BR")}` : "Aguardando atualização"}</span></footer>
 </main>
}
