/** Mapa operacional do P04: troca local de andar, busca global e filtros sem corrida de rede. */
import { useEffect, useMemo, useState } from "react"
import { useAppStore } from "@/app/app-store"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { lerEstrutura } from "@/servicos/estrutura"
import type { EstruturaEstacionamento, TipoVaga } from "@/types/estrutura"

const nomesTipo: Record<TipoVaga, string> = { COMUM: "Comum", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" }

/** Consulta uma única árvore consistente; navegação e busca posteriores não disparam respostas concorrentes. */
export function MapaEstacionamento() {
  const { consultar } = useAppStore(); const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null); const [erro, setErro] = useState("")
  const [andarId, setAndarId] = useState(""); const [busca, setBusca] = useState(""); const [tipo, setTipo] = useState<TipoVaga | "TODAS">("TODAS"); const [selecionada, setSelecionada] = useState("")
  useEffect(() => { let ativo = true; consultar("/estacionamento/estrutura").then(lerEstrutura).then(valor => { if (ativo) { setEstrutura(valor); setAndarId(valor.andares[0]?.id ?? "") } }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao carregar o mapa.") }); return () => { ativo = false } }, [consultar])
  const andar = estrutura?.andares.find(item => item.id === andarId); const vagas = useMemo(() => andar?.setores.flatMap(setor => setor.vagas.map(vaga => ({ ...vaga, setor: setor.nome }))) ?? [], [andar])
  const filtradas = vagas.filter(vaga => (tipo === "TODAS" || vaga.tipo === tipo) && vaga.codigo.toLowerCase().includes(busca.trim().toLowerCase()))
  function buscar(valor: string) { setBusca(valor); const achada = estrutura?.andares.flatMap(a => a.setores.flatMap(s => s.vagas.map(v => ({ andarId: a.id, vaga: v })))).find(item => item.vaga.codigo.toLowerCase() === valor.trim().toLowerCase()); if (achada) { setAndarId(achada.andarId); setSelecionada(achada.vaga.id) } }
  if (erro) return <div role="alert" className="rounded-2xl bg-white p-6 text-red-700">{erro}</div>
  if (!estrutura) return <div className="rounded-2xl bg-white p-6" role="status">Carregando estacionamento...</div>
  if (estrutura.shopping.situacaoImplantacao !== "ATIVO") return <div className="rounded-2xl bg-white p-6"><h2 className="text-xl font-semibold">Seu estacionamento está em configuração</h2><p className="mt-2 text-neutral-600">Situação atual: {estrutura.shopping.situacaoImplantacao.replaceAll("_", " ").toLowerCase()}.</p></div>
  return <div className="grid gap-5"><div className="rounded-2xl bg-white p-5"><div className="flex flex-wrap gap-2">{estrutura.andares.map(item => <button key={item.id} type="button" onClick={() => { setAndarId(item.id); setSelecionada("") }} className={`rounded-full px-4 py-2 text-sm font-medium ${andarId === item.id ? "bg-yellow-400" : "bg-neutral-100"}`}>{item.nome}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input aria-label="Buscar vaga" placeholder="Buscar pelo código da vaga" value={busca} onChange={e => buscar(e.target.value)}/><select aria-label="Filtrar por tipo" className="rounded-md border bg-white px-3 py-2" value={tipo} onChange={e => setTipo(e.target.value as TipoVaga | "TODAS")}><option value="TODAS">Todos os tipos</option>{Object.entries(nomesTipo).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div></div>
    <div className="relative min-h-[32rem] overflow-hidden rounded-2xl border bg-neutral-200 p-4" aria-label={`Mapa ${andar?.nome ?? ""}`}>{filtradas.filter(v => v.posicao).map(vaga => <button key={vaga.id} type="button" onClick={() => setSelecionada(vaga.id)} style={{ left: `${vaga.posicao!.x * 100}%`, top: `${vaga.posicao!.y * 100}%`, width: `${vaga.posicao!.largura * 100}%`, minWidth: "3.5rem", height: `${vaga.posicao!.altura * 100}%`, transform: `rotate(${vaga.posicao!.rotacao}deg)` }} className={`absolute min-h-10 rounded-md border-2 px-1 text-[10px] font-bold leading-tight ${selecionada === vaga.id ? "z-10 border-black ring-4 ring-yellow-300" : "border-white"} ${vaga.estadoAtual === "LIVRE" ? "bg-green-500" : vaga.estadoAtual === "OCUPADA" ? "bg-red-500 text-white" : "bg-neutral-500 text-white"}`}><span>{vaga.codigo}</span><span className="block font-normal">{nomesTipo[vaga.tipo]}</span></button>)}</div>
    <div className="rounded-2xl bg-white p-5"><h2 className="font-semibold">Vagas de {andar?.nome}</h2><ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{filtradas.map(vaga => <li key={vaga.id}><button className="flex w-full items-center justify-between rounded-lg border p-3 text-left" onClick={() => setSelecionada(vaga.id)}><span><strong>{vaga.codigo}</strong><small className="block text-neutral-600">{vaga.setor} · {nomesTipo[vaga.tipo]}</small></span><Badge variant="secondary">{vaga.estadoAtual}</Badge></button></li>)}</ul></div>
  </div>
}
