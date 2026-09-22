/** Renderiza a mesma leitura espacial de andares, setores e vagas para Admin e gerente. */
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"

const nomesTipo: Record<TipoVaga, string> = { COMUM: "Comum", PCD: "PCD", IDOSO: "Idoso", ELETRICA: "Elétrica" }
const nomesEstado: Record<VagaEstrutura["estadoAtual"], string> = { LIVRE: "Livre", OCUPADA: "Ocupada", DESCONHECIDA: "Indisponível" }
const classesEstado: Record<VagaEstrutura["estadoAtual"], string> = {
  LIVRE: "bg-emerald-500 text-neutral-950",
  OCUPADA: "bg-red-600 text-white",
  DESCONHECIDA: "bg-neutral-600 text-white",
}

interface VisualizacaoVagasProps {
  estrutura: EstruturaEstacionamento
  modo: "admin" | "gerente"
}

type VagaComSetor = VagaEstrutura & { setorId: string; setor: string }

/** Mantém filtros locais e nunca converte ausência de leitura em vaga livre. */
export function VisualizacaoVagas({ estrutura, modo }: VisualizacaoVagasProps) {
  const [andarId, setAndarId] = useState(() => estrutura.andares[0]?.id ?? "")
  const [setorId, setSetorId] = useState("TODOS")
  const [tipo, setTipo] = useState<TipoVaga | "TODAS">("TODAS")
  const [estado, setEstado] = useState<VagaEstrutura["estadoAtual"] | "TODOS">("TODOS")
  const [busca, setBusca] = useState("")
  const [selecionada, setSelecionada] = useState("")

  const andar = estrutura.andares.find(item => item.id === andarId) ?? estrutura.andares[0]
  const vagas = useMemo<VagaComSetor[]>(() => andar?.setores.flatMap(setor => setor.vagas.map(vaga => ({
    ...vaga, setorId: setor.id, setor: setor.nome,
  }))) ?? [], [andar])
  const termo = busca.trim().toLocaleLowerCase("pt-BR")
  const filtradas = vagas.filter(vaga => vaga.ativo
    && (setorId === "TODOS" || vaga.setorId === setorId)
    && (tipo === "TODAS" || vaga.tipo === tipo)
    && (estado === "TODOS" || vaga.estadoAtual === estado)
    && (!termo || vaga.codigo.toLocaleLowerCase("pt-BR").includes(termo)))
  const posicionadas = filtradas.filter(vaga => vaga.posicao)
  const semPosicao = filtradas.filter(vaga => !vaga.posicao)

  function buscar(valor: string) {
    setBusca(valor)
    const codigo = valor.trim().toLocaleLowerCase("pt-BR")
    if (!codigo) return
    const encontrada = estrutura.andares.flatMap(item => item.setores.flatMap(setor => setor.vagas.map(vaga => ({ andarId: item.id, setorId: setor.id, vaga })))).find(item => item.vaga.codigo.toLocaleLowerCase("pt-BR") === codigo)
    if (encontrada) {
      setAndarId(encontrada.andarId)
      setSetorId(encontrada.setorId)
      setSelecionada(encontrada.vaga.id)
    }
  }

  if (!estrutura.andares.length) return <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-neutral-600">Nenhum andar configurado.</div>

  return <section className="grid min-w-0 gap-4" aria-label={modo === "admin" ? "Visualização das vagas para configuração" : "Visualização das vagas do estacionamento"}>
    <div className="rounded-2xl bg-white p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" aria-label="Selecionar andar">{estrutura.andares.map(item => <button key={item.id} type="button" onClick={() => { setAndarId(item.id); setSetorId("TODOS"); setSelecionada("") }} className={`cartao-clicavel rounded-full px-4 py-2 text-sm font-semibold ${andar?.id === item.id ? "bg-[#ffe100] text-black" : "bg-neutral-100 text-neutral-700"}`}>{item.nome}</button>)}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="grid gap-1"><Label htmlFor={`${modo}-busca-vaga`}>Buscar vaga</Label><Input id={`${modo}-busca-vaga`} placeholder="Ex.: A01" value={busca} onChange={evento => buscar(evento.target.value)}/></div>
        <div className="grid gap-1"><Label htmlFor={`${modo}-setor-vaga`}>Setor</Label><select id={`${modo}-setor-vaga`} className="rounded-md border bg-white px-3 py-2" value={setorId} onChange={evento => setSetorId(evento.target.value)}><option value="TODOS">Todos os setores</option>{andar?.setores.map(setor => <option key={setor.id} value={setor.id}>{setor.nome}</option>)}</select></div>
        <div className="grid gap-1"><Label htmlFor={`${modo}-tipo-vaga`}>Categoria</Label><select id={`${modo}-tipo-vaga`} className="rounded-md border bg-white px-3 py-2" value={tipo} onChange={evento => setTipo(evento.target.value as TipoVaga | "TODAS")}><option value="TODAS">Todas as categorias</option>{Object.entries(nomesTipo).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div>
        <div className="grid gap-1"><Label htmlFor={`${modo}-estado-vaga`}>Status</Label><select id={`${modo}-estado-vaga`} className="rounded-md border bg-white px-3 py-2" value={estado} onChange={evento => setEstado(evento.target.value as VagaEstrutura["estadoAtual"] | "TODOS")}><option value="TODOS">Todos os status</option>{Object.entries(nomesEstado).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div>
      </div>
    </div>

    <div className="rounded-2xl border border-neutral-300 bg-neutral-200 p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold text-neutral-950">{andar?.nome}</h3><p className="text-sm text-neutral-600">{setorId === "TODOS" ? "Todos os setores" : andar?.setores.find(setor => setor.id === setorId)?.nome}</p></div><Badge variant="secondary">{filtradas.length} vaga(s)</Badge></div>
      {filtradas.length === 0 ? <p className="rounded-xl bg-white p-6 text-center text-neutral-600">Nenhuma vaga corresponde aos filtros.</p> : <>
        <div className="relative hidden min-h-[30rem] overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 sm:block" aria-label={`Mapa 2D de ${andar?.nome}`}>
          {posicionadas.map(vaga => <button key={vaga.id} type="button" onClick={() => setSelecionada(vaga.id)} style={{ left: `${vaga.posicao!.x * 100}%`, top: `${vaga.posicao!.y * 100}%`, width: `${vaga.posicao!.largura * 100}%`, height: `${vaga.posicao!.altura * 100}%`, transform: `rotate(${vaga.posicao!.rotacao}deg)` }} className={`absolute min-h-12 min-w-16 overflow-hidden rounded-lg border-2 px-1 text-[11px] font-bold leading-tight shadow-sm ${classesEstado[vaga.estadoAtual]} ${selecionada === vaga.id ? "z-10 border-black ring-4 ring-[#ffe100]/70" : "border-white"}`}><span className="block truncate">{vaga.codigo}</span><span className="block truncate font-normal">{vaga.setor} · {nomesTipo[vaga.tipo]}</span><span className="sr-only">{nomesEstado[vaga.estadoAtual]}</span></button>)}
          {posicionadas.length === 0 && <p className="grid min-h-[30rem] place-items-center px-6 text-center text-neutral-600">As vagas deste recorte ainda não possuem posições salvas no mapa.</p>}
        </div>
        <ul className="grid gap-2 sm:hidden">{filtradas.map(vaga => <VagaLista key={vaga.id} vaga={vaga} selecionada={selecionada === vaga.id} aoSelecionar={() => setSelecionada(vaga.id)}/>)}</ul>
        {semPosicao.length > 0 && <div className="mt-3 rounded-xl border border-dashed border-neutral-400 bg-white/80 p-3"><p className="text-sm font-semibold text-neutral-800">Sem posição no mapa</p><ul className="mt-2 hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">{semPosicao.map(vaga => <VagaLista key={vaga.id} vaga={vaga} selecionada={selecionada === vaga.id} aoSelecionar={() => setSelecionada(vaga.id)}/>)}</ul></div>}
      </>}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-700">{Object.entries(nomesEstado).map(([valor, nome]) => <span key={valor} className="flex items-center gap-1.5"><span className={`size-3 rounded-sm ${classesEstado[valor as VagaEstrutura["estadoAtual"]]}`} aria-hidden="true"/>{nome}</span>)}</div>
    </div>
  </section>
}

function VagaLista({ vaga, selecionada, aoSelecionar }: { vaga: VagaComSetor; selecionada: boolean; aoSelecionar: () => void }) {
  return <li><button type="button" onClick={aoSelecionar} className={`cartao-clicavel flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left ${selecionada ? "border-black ring-4 ring-[#ffe100]/60" : "border-neutral-200"}`}><span className={`size-3 shrink-0 rounded-sm ${classesEstado[vaga.estadoAtual]}`} aria-hidden="true"/><span className="min-w-0 flex-1"><strong className="block truncate">{vaga.codigo}</strong><small className="block truncate text-neutral-600">{vaga.setor} · {nomesTipo[vaga.tipo]}</small></span><Badge variant="secondary">{nomesEstado[vaga.estadoAtual]}</Badge></button></li>
}
