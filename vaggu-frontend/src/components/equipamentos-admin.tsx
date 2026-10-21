/** Cadastro operacional e manutenção por shopping, com credencial exibida uma única vez. */
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { objeto } from "@/servicos/api"
import type { EstruturaEstacionamento } from "@/types/estrutura"
type Sensor = { id: string; codigo: string; vagaId: string; emManutencao: boolean }
type Placa = { id: string; codigo: string; nome: string; ativo: boolean; emManutencao: boolean; sensores: Sensor[] }
type Ocorrencia = { id: string; dispositivoId: string; sensorId: string | null; tipo: string; motivo: string; conclusao: string | null; abertaEm: string; encerradaEm: string | null }
function lerDados(dados: unknown): { placas: Placa[]; ocorrencias: Ocorrencia[] } {
  if (!objeto(dados) || !Array.isArray(dados.placas) || !Array.isArray(dados.ocorrencias)) throw new Error("Resposta de equipamentos inválida.")
  for (const p of dados.placas) if (!objeto(p) || typeof p.id !== "string" || typeof p.nome !== "string" || !Array.isArray(p.sensores)) throw new Error("Placa recebida inválida.")
  for (const o of dados.ocorrencias) if (!objeto(o) || typeof o.id !== "string" || typeof o.motivo !== "string") throw new Error("Ocorrência recebida inválida.")
  return dados as { placas: Placa[]; ocorrencias: Ocorrencia[] }
}
export function EquipamentosAdmin({ shoppingId, estrutura, aoAlterar }: { shoppingId: string; estrutura: EstruturaEstacionamento; aoAlterar: () => Promise<void> }) {
  const { consultar } = useAppStore()
  const [dados, setDados] = useState<{ placas: Placa[]; ocorrencias: Ocorrencia[] } | null>(null)
  const [erro, setErro] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [chave, setChave] = useState("")
  const [alvo, setAlvo] = useState<{ id: string; nome: string; sensorId?: string; encerrar?: boolean } | null>(null)
  const base = `/shoppings/${shoppingId}`
  const carregar = useCallback(async () => setDados(lerDados(await consultar(`${base}/equipamentos`))), [base, consultar])
  useEffect(() => { let ativo = true; consultar(`${base}/equipamentos`).then(lerDados).then(r => { if (ativo) setDados(r) }).catch(e => { if (ativo) setErro(e.message) }); return () => { ativo = false } }, [consultar, base])
  async function executar(tarefa: () => Promise<unknown>, sucesso: string) {
    setOcupado(true); setErro(""); setMensagem("")
    try {
      const r = await tarefa()
      if (objeto(r) && typeof r.chave === "string") setChave(r.chave)
      await carregar(); await aoAlterar(); setMensagem(sucesso); setAlvo(null)
    } catch (e) { setErro(e instanceof Error ? e.message : "Não foi possível concluir a operação.") }
    finally { setOcupado(false) }
  }
  function criarPlaca(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget, f = new FormData(form)
    void executar(async () => { const r = await consultar(`${base}/equipamentos`, { nome: f.get("nome"), codigo: f.get("codigo") }); form.reset(); return r }, "Placa cadastrada.")
  }
  function criarSensor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget, f = new FormData(form)
    void executar(async () => { const r = await consultar(`${base}/equipamentos/${f.get("placa")}/sensores`, { codigo: f.get("codigo"), vagaId: f.get("vaga") }); form.reset(); return r }, "Sensor vinculado. A vaga aguarda leituras consistentes.")
  }
  function manutencao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!alvo) return
    const texto = new FormData(e.currentTarget).get("texto")
    void executar(() => alvo.encerrar ? consultar(`${base}/ocorrencias/${alvo.id}/encerrar`, { conclusao: texto }) : consultar(`${base}/equipamentos/${alvo.id}/manutencao`, { motivo: texto, sensorId: alvo.sensorId }), alvo.encerrar ? "Manutenção encerrada. Novas leituras serão confirmadas antes de liberar a vaga." : "Manutenção aberta. As vagas afetadas estão indisponíveis.")
  }
  const vinculadas = new Set(dados?.placas.flatMap(p => p.sensores.map(s => s.vagaId)))
  const vagas = estrutura.andares.filter(a => a.ativo).flatMap(a => a.setores.filter(s => s.ativo).flatMap(s => s.vagas.filter(v => v.ativo).map(v => ({ ...v, nome: `${a.nome} · ${s.nome} · ${v.codigo}` }))))
  return <section className="grid min-w-0 gap-4 rounded-2xl border bg-card p-4 text-card-foreground sm:p-6" aria-label="Equipamentos e manutenção"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-semibold">Equipamentos e manutenção</h3><p className="text-sm text-muted-foreground">Cadastre placas, vincule sensores às vagas e registre intervenções.</p></div><Button variant="outline" disabled={ocupado} onClick={() => void executar(carregar, "Lista atualizada.")}>Atualizar</Button></div>
    {erro && <p role="alert" className="text-red-700 dark:text-red-300">{erro}</p>}{mensagem && <p role="status">{mensagem}</p>}
    {!dados ? <p role="status">Carregando equipamentos...</p> : <>
      <div className="grid gap-4 lg:grid-cols-2"><form className="grid gap-3 rounded-xl border p-4" onSubmit={criarPlaca}><h4 className="font-semibold">Nova placa</h4><label className="grid gap-1">Nome<Input name="nome" required maxLength={120}/></label><label className="grid gap-1">Código<Input name="codigo" required maxLength={60} pattern="[A-Za-z0-9_-]+" placeholder="PLACA-G1"/></label><Button disabled={ocupado}>Cadastrar placa</Button></form>
      <form className="grid gap-3 rounded-xl border p-4" onSubmit={criarSensor}><h4 className="font-semibold">Vincular sensor</h4><label className="grid gap-1">Placa<select name="placa" required className="min-h-11 rounded-md border bg-background p-2"><option value="">Selecione</option>{dados.placas.filter(p => p.ativo).map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select></label><label className="grid gap-1">Código do sensor<Input name="codigo" required maxLength={60}/></label><label className="grid gap-1">Vaga disponível<select name="vaga" required className="min-h-11 min-w-0 rounded-md border bg-background p-2"><option value="">Selecione</option>{vagas.filter(v => !vinculadas.has(v.id)).map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></label><Button disabled={ocupado || !dados.placas.some(p => p.ativo)}>Vincular sensor</Button></form></div>
      {!dados.placas.length && <p>Nenhuma placa cadastrada neste shopping.</p>}
      {dados.placas.map(p => <article key={p.id} className="min-w-0 rounded-xl border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="font-bold">{p.nome} · {p.codigo}</h4><p className="text-sm">{!p.ativo ? "Desativada" : p.emManutencao ? "Em manutenção" : "Ativa"} · {p.sensores.length} sensores</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={ocupado} onClick={() => { if (window.confirm("Emitir uma nova chave? A chave anterior deixará de funcionar.")) void executar(() => consultar(`${base}/equipamentos/${p.id}/chave`, {}), "Chave renovada.") }}>Renovar chave</Button><Button variant="outline" disabled={ocupado || p.emManutencao} onClick={() => setAlvo({ id: p.id, nome: p.nome })}>Abrir manutenção</Button><Button variant="outline" disabled={ocupado} onClick={() => { if (window.confirm(p.ativo ? "Desativar a placa e indisponibilizar suas vagas?" : "Reativar a placa para receber novas leituras?")) void executar(() => consultar(`${base}/equipamentos/${p.id}`, { ativo: !p.ativo }, "PATCH"), "Estado da placa atualizado.") }}>{p.ativo ? "Desativar" : "Reativar"}</Button></div></div><ul className="mt-3 grid gap-2">{p.sensores.map(s => <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 border-t pt-2"><span>{s.codigo} → {vagas.find(v => v.id === s.vagaId)?.codigo ?? "Vaga inativa"}{s.emManutencao ? " · Em manutenção" : ""}</span><Button variant="outline" disabled={ocupado || s.emManutencao} onClick={() => setAlvo({ id: p.id, nome: s.codigo, sensorId: s.id })}>Manutenção do sensor</Button></li>)}</ul></article>)}
      <h4 className="font-semibold">Ocorrências recentes</h4>{!dados.ocorrencias.length && <p>Nenhuma ocorrência registrada.</p>}{dados.ocorrencias.map(o => <article key={o.id} className="rounded-xl border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{o.tipo === "MANUTENCAO" ? "Manutenção" : "Comunicação"} · {dados.placas.find(p => p.id === o.dispositivoId)?.nome}</strong><span>{o.encerradaEm ? "Encerrada" : "Aberta"}</span></div><p>{o.motivo}</p><p className="text-sm text-muted-foreground">{new Date(o.abertaEm).toLocaleString("pt-BR")}{o.conclusao ? ` · ${o.conclusao}` : ""}</p>{!o.encerradaEm && o.tipo === "MANUTENCAO" && <Button className="mt-2" disabled={ocupado} onClick={() => setAlvo({ id: o.id, nome: "Concluir manutenção", encerrar: true })}>Concluir manutenção</Button>}</article>)}
    </>}
    <Dialog open={!!chave} onOpenChange={aberto => { if (!aberto) setChave("") }}><DialogContent><DialogHeader><DialogTitle>Guarde a chave da placa</DialogTitle><DialogDescription>Ela aparece somente nesta emissão. A renovação invalida a chave anterior.</DialogDescription></DialogHeader><code className="break-all rounded-md bg-muted p-3">{chave}</code><DialogFooter><Button onClick={() => { void navigator.clipboard.writeText(chave).then(() => setMensagem("Chave copiada."), () => setErro("Não foi possível copiar. Selecione a chave manualmente.")) }}>Copiar chave</Button><Button variant="outline" onClick={() => setChave("")}>Fechar</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={!!alvo} onOpenChange={aberto => { if (!aberto && !ocupado) setAlvo(null) }}><DialogContent><DialogHeader><DialogTitle>{alvo?.encerrar ? "Concluir manutenção" : `Manutenção: ${alvo?.nome}`}</DialogTitle><DialogDescription>{alvo?.encerrar ? "Registre o resultado. As vagas aguardarão novas leituras confirmadas." : "As vagas afetadas ficarão indisponíveis até a conclusão manual."}</DialogDescription></DialogHeader><form onSubmit={manutencao} className="grid gap-3"><label className="grid gap-1">{alvo?.encerrar ? "Conclusão" : "Motivo"}<textarea name="texto" required maxLength={500} className="min-h-24 rounded-md border bg-background p-2"/></label><Button disabled={ocupado}>{ocupado ? "Salvando..." : "Confirmar"}</Button></form></DialogContent></Dialog>
  </section>
}
