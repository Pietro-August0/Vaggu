import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { objeto } from "@/servicos/api"
import type { EstruturaEstacionamento } from "@/types/estrutura"
type Telao = { id: string; nome: string; ativo: boolean; andarId: string | null; setorId: string | null }
function ler(d: unknown): Telao[] {
 if (!objeto(d) || !Array.isArray(d.teloes) || d.teloes.some(t => !objeto(t) || typeof t.id !== "string" || typeof t.nome !== "string")) throw new Error("Resposta de telões inválida.")
 return d.teloes as Telao[]
}
export function TeloesAdmin({ shoppingId, estrutura }: { shoppingId: string; estrutura: EstruturaEstacionamento }) {
 const { consultar } = useAppStore()
 const [teloes, setTeloes] = useState<Telao[]>([]), [andarId, setAndarId] = useState("")
 const [emissao, setEmissao] = useState<{ id: string; chave: string } | null>(null)
 const [erro, setErro] = useState(""), [ocupado, setOcupado] = useState(false)
 const base = `/shoppings/${shoppingId}/teloes`
 const carregar = useCallback(async () => setTeloes(ler(await consultar(base))), [base, consultar])
 useEffect(() => { let ativo = true; consultar(base).then(ler).then(d => { if (ativo) setTeloes(d) }).catch(e => { if (ativo) setErro(e.message) }); return () => { ativo = false } }, [base, consultar])
 async function criar(e: FormEvent<HTMLFormElement>) {
  e.preventDefault(); const f = new FormData(e.currentTarget); setOcupado(true); setErro("")
  try { const r = await consultar(base, { nome: f.get("nome"), andarId: andarId || null, setorId: f.get("setor") || null }); if (!objeto(r) || !objeto(r.telao) || typeof r.telao.id !== "string" || typeof r.chave !== "string") throw new Error("Emissão inválida."); setEmissao({ id: r.telao.id, chave: r.chave }); await carregar() }
  catch(e) { setErro(e instanceof Error ? e.message : "Falha ao cadastrar.") } finally { setOcupado(false) }
 }
 async function revogar(t: Telao) {
  if (!window.confirm(`Revogar o acesso do telão ${t.nome}?`)) return
  setOcupado(true); setErro("")
  try { await consultar(`${base}/${t.id}`, undefined, "DELETE"); if (emissao?.id === t.id) setEmissao(null); await carregar() } catch(e) { setErro(e instanceof Error ? e.message : "Falha ao revogar.") } finally { setOcupado(false) }
 }
 return <section className="grid gap-4 rounded-2xl border bg-card p-4 text-card-foreground sm:p-6"><h3 className="text-xl font-semibold">Instalações de telão</h3><p>Configure o recorte e emita um acesso exclusivo para a tela de exibição.</p>{erro && <p role="alert" className="text-red-700 dark:text-red-300">{erro}</p>}
 <form onSubmit={criar} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="grid gap-1">Nome<Input name="nome" required maxLength={120} placeholder="Entrada principal"/></label><label className="grid gap-1">Andar<select className="min-h-11 rounded-md border bg-background p-2" value={andarId} onChange={e => setAndarId(e.target.value)}><option value="">Shopping inteiro</option>{estrutura.andares.filter(a => a.ativo).map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select></label><label className="grid gap-1">Setor<select key={andarId} name="setor" className="min-h-11 rounded-md border bg-background p-2" disabled={!andarId}><option value="">Todos os setores</option>{estrutura.andares.find(a => a.id === andarId)?.setores.filter(s => s.ativo).map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></label><Button disabled={ocupado}>Criar instalação</Button></form>
 {emissao && <div className="grid gap-2 rounded-xl border border-amber-400 bg-amber-50 p-4 text-black"><strong>Credencial exibida somente agora</strong><code className="break-all">{emissao.chave}</code><p>Abra o endereço abaixo na tela de exibição e informe esta chave. Não compartilhe com visitantes.</p><Link className="underline" to={`/telao/${emissao.id}`} target="_blank" rel="noopener noreferrer">Abrir telão</Link><Button variant="outline" onClick={() => setEmissao(null)}>Já guardei a credencial</Button></div>}
 {!teloes.length && <p>Nenhuma instalação cadastrada.</p>}{teloes.map(t => <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"><span><strong>{t.nome}</strong> · {t.ativo ? "Autorizado" : "Revogado"}</span><div className="flex gap-2"><Button asChild variant="outline"><Link to={`/telao/${t.id}`} target="_blank" rel="noopener noreferrer">Abrir</Link></Button><Button variant="outline" disabled={ocupado || !t.ativo} onClick={() => void revogar(t)}>Revogar</Button></div></div>)}
 </section>
}
