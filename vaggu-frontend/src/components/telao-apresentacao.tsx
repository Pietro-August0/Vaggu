/** Apresentação compartilhada pela prévia e pelas instalações autorizadas. */
import { useEffect, useRef, useState } from "react"
import { Accessibility, PersonStanding, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "@/pages/telao-page.css"

export type ContagemTelao = { livres: number; monitoradas: number }
export type GrupoTelao = ContagemTelao & { nome: string }
export type CategoriaTelao = ContagemTelao & { tipo: string }
type Props = {
  shopping: string; escopo: string; porAndar: boolean; contagem: ContagemTelao
  grupos: GrupoTelao[]; categorias: CategoriaTelao[]; disponivel: boolean
  demonstracao?: boolean; retorno?: string
}
const categoriasFixas = [
  { tipo: "PCD", nome: "PCD", Icone: Accessibility },
  { tipo: "IDOSO", nome: "Idoso", Icone: PersonStanding },
  { tipo: "ELETRICA", nome: "Elétrica", Icone: Zap },
]

export function TelaoApresentacao({ shopping, escopo, porAndar, contagem, grupos, categorias, disponivel, demonstracao, retorno }: Props) {
  const tela = useRef<HTMLElement>(null)
  const navegar = useNavigate()
  const [aviso, setAviso] = useState(true)
  const [erroTelaCheia, setErroTelaCheia] = useState("")
  const [compacto, setCompacto] = useState(() => window.matchMedia("(max-width: 600px), (max-height: 500px)").matches)
  const [pagina, setPagina] = useState(0)
  const capacidade = compacto ? 2 : 4
  const paginas = Math.max(1, Math.ceil(grupos.length / capacidade))
  const atual = pagina % paginas
  const visiveis = grupos.slice(atual * capacidade, (atual + 1) * capacidade)
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px), (max-height: 500px)")
    const ajustar = () => setCompacto(media.matches)
    media.addEventListener("change", ajustar)
    return () => media.removeEventListener("change", ajustar)
  }, [])
  useEffect(() => {
    if (paginas <= 1) return
    const intervalo = window.setInterval(() => setPagina(p => (p + 1) % paginas), 8_000)
    return () => window.clearInterval(intervalo)
  }, [paginas, escopo])
  useEffect(() => {
    const prazo = window.setTimeout(() => setAviso(false), 8_000)
    return () => window.clearTimeout(prazo)
  }, [aviso])
  useEffect(() => {
    const mudou = () => { if (!document.fullscreenElement) setAviso(true) }
    const comando = (evento: KeyboardEvent) => {
      if (evento.repeat || evento.target instanceof HTMLElement && evento.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (evento.altKey && !evento.ctrlKey && !evento.metaKey && evento.code === "KeyS") {
        evento.preventDefault()
        const sair = async () => {
          if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined)
          navegar(retorno ?? "/painel/teloes", { replace: true })
        }
        void sair()
      } else if (!evento.altKey && !evento.ctrlKey && !evento.metaKey && evento.code === "KeyF") {
        evento.preventDefault()
        setErroTelaCheia("")
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) void document.documentElement.requestFullscreen().catch(() => setErroTelaCheia("Use F11 ou a opção de tela cheia do navegador."))
          else setErroTelaCheia("Use a opção de tela cheia do navegador.")
        }
      } else if (evento.key === "Escape" && document.fullscreenElement) {
        void document.exitFullscreen().catch(() => undefined)
      }
    }
    document.addEventListener("fullscreenchange", mudou)
    document.addEventListener("keydown", comando)
    return () => { document.removeEventListener("fullscreenchange", mudou); document.removeEventListener("keydown", comando) }
  }, [navegar, retorno])
  return <main ref={tela} className="telao-vaggu" aria-label="Disponibilidade do estacionamento">
    <header className="telao-vaggu__topo">
      <img src="/assets/vaggu-logo-yellow.svg" alt="VAGGU" className="telao-vaggu__logo" />
      <div className="telao-vaggu__identidade"><h1 title={shopping}>{shopping}</h1><p title={escopo}>{escopo}{demonstracao && <span> · Demonstração</span>}</p></div>
    </header>
    {aviso && <p className="telao-vaggu__atalhos" role="status"><span><kbd>F</kbd> Tela cheia</span><span><kbd>Esc</kbd> Sair da tela cheia</span><span><kbd>Alt + S</kbd> Voltar à gestão</span></p>}
    {erroTelaCheia && <p className="telao-vaggu__aviso" role="alert">{erroTelaCheia}</p>}
    <div className="telao-vaggu__conteudo">
      <section className="telao-vaggu__total" aria-label="Vagas livres">
        <h2>Vagas livres</h2><strong className={contagem.livres >= 1000 ? "telao-vaggu__numero-longo" : undefined}>{disponivel && contagem.monitoradas > 0 ? contagem.livres : "—"}</strong>
        <p>{disponivel ? (porAndar ? "neste andar" : "no estacionamento") : "Consulte a sinalização local"}</p>
      </section>
      <section className="telao-vaggu__distribuicao" aria-label={porAndar ? "Disponibilidade por setor" : "Disponibilidade por andar"}>
        <div className="telao-vaggu__titulo-grupos"><h2>{porAndar ? "Por setor" : "Por andar"}</h2>{paginas > 1 && <span>{atual + 1} / {paginas}</span>}</div>
        <div className="telao-vaggu__grupos">
          {visiveis.map((g, i) => <article key={`${atual}-${i}-${g.nome}`} className="telao-vaggu__grupo"><h3 title={g.nome}>{g.nome}</h3><p><strong>{disponivel && g.monitoradas > 0 ? g.livres : "—"}</strong><span>livres</span></p></article>)}
          {!visiveis.length && <p className="telao-vaggu__sem-grupos">{disponivel ? "Siga a sinalização local" : "Disponibilidade indisponível"}</p>}
        </div>
      </section>
    </div>
    <footer className="telao-vaggu__categorias" aria-label="Vagas livres por categoria">
      {categoriasFixas.map(({ tipo, nome, Icone }) => {
        const categoria = categorias.find(c => c.tipo === tipo)
        return <div key={tipo} className={`telao-vaggu__categoria telao-vaggu__categoria--${tipo.toLowerCase()}`}><Icone aria-hidden="true"/><h2>{nome}</h2><strong>{disponivel && categoria && categoria.monitoradas > 0 ? categoria.livres : "—"}</strong><span>livres</span></div>
      })}
    </footer>
  </main>
}
