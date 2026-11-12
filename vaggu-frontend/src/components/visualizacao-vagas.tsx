/** Renderiza a mesma leitura espacial de andares, setores e vagas para Admin e gerente. */
import { useMemo, useRef, useState, type CSSProperties } from "react"
import { SlidersHorizontal, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { DetalhesVaga } from "@/components/detalhes-vaga"
import { MonitoramentoSensores } from "@/components/monitoramento-sensores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { nomesEstadoVaga, nomesTipoVaga } from "@/servicos/apresentacao-vaga"
import type { EstruturaEstacionamento, TipoVaga, VagaEstrutura } from "@/types/estrutura"

const classesEstado: Record<VagaEstrutura["estadoAtual"], string> = {
  LIVRE: "bg-emerald-500 text-neutral-950",
  OCUPADA: "bg-red-600 text-white",
  DESCONHECIDA: "bg-neutral-600 text-white",
  INDISPONIVEL: "bg-amber-600 text-white",
}

const classesInteracaoEstado: Record<VagaEstrutura["estadoAtual"], string> = {
  LIVRE: "hover:bg-emerald-400 active:bg-emerald-600",
  OCUPADA: "hover:bg-red-500 active:bg-red-700",
  DESCONHECIDA: "hover:bg-neutral-500 active:bg-neutral-700",
  INDISPONIVEL: "hover:bg-amber-500 active:bg-amber-700",
}

interface VisualizacaoVagasProps {
  estrutura: EstruturaEstacionamento
  modo: "admin" | "gerente"
}

type VagaComContexto = VagaEstrutura & {
  andarId: string
  andar: string
  setorId: string
  setor: string
}

/** Mantém filtros locais, abre os detalhes da vaga e nunca converte ausência de leitura em vaga livre. */
export function VisualizacaoVagas({ estrutura, modo }: VisualizacaoVagasProps) {
  const [andarId, setAndarId] = useState(() => estrutura.andares[0]?.id ?? "")
  const [setorId, setSetorId] = useState("TODOS")
  const [tipo, setTipo] = useState<TipoVaga | "TODAS">("TODAS")
  const [estado, setEstado] = useState<VagaEstrutura["estadoAtual"] | "TODOS">("TODOS")
  const [busca, setBusca] = useState("")
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState<string | null>(null)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [diagnosticoAberto, setDiagnosticoAberto] = useState(false)
  const [rascunhoFiltros, setRascunhoFiltros] = useState({ setorId, tipo, estado })
  const origemDetalhe = useRef<HTMLElement | null>(null)
  const botaoDiagnostico = useRef<HTMLButtonElement>(null)

  function abrirDetalhes(id: string) {
    origemDetalhe.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setVagaSelecionadaId(id)
  }

  const vagas = useMemo<VagaComContexto[]>(
    () =>
      estrutura.andares.flatMap((andar) =>
        andar.setores.flatMap((setor) =>
          setor.vagas.map((vaga) => ({
            ...vaga,
            andarId: andar.id,
            andar: andar.nome,
            setorId: setor.id,
            setor: setor.nome,
          })),
        ),
      ),
    [estrutura.andares],
  )

  const andar = estrutura.andares.find((item) => item.id === andarId) ?? estrutura.andares[0]
  const termo = busca.trim().toLocaleLowerCase("pt-BR")
  const filtradas = vagas.filter(
    (vaga) =>
      vaga.ativo &&
      vaga.andarId === andar?.id &&
      (setorId === "TODOS" || vaga.setorId === setorId) &&
      (tipo === "TODAS" || vaga.tipo === tipo) &&
      (estado === "TODOS" || vaga.estadoAtual === estado) &&
      (!termo || `${vaga.codigo} ${vaga.monitoramento?.sensorCodigo ?? ""} ${vaga.monitoramento?.placaNome ?? ""}`.toLocaleLowerCase("pt-BR").includes(termo)),
  )
  const totalFiltros = Number(setorId !== "TODOS") + Number(tipo !== "TODAS") + Number(estado !== "TODOS")
  const resumoFiltros = [setorId !== "TODOS" ? andar?.setores.find(setor => setor.id === setorId)?.nome : null, tipo !== "TODAS" ? nomesTipoVaga[tipo] : null, estado !== "TODOS" ? nomesEstadoVaga[estado] : null].filter(Boolean)
  const atencao = filtradas.filter(vaga => !vaga.monitoramento || !["OPERANDO", "CONFIRMANDO"].includes(vaga.monitoramento.situacao)).length
  const posicionadas = filtradas.filter((vaga) => vaga.posicao)
  const semPosicao = filtradas.filter((vaga) => !vaga.posicao)
  const vagaSelecionada = vagas.find((vaga) => vaga.id === vagaSelecionadaId) ?? null

  /** Procura códigos exatos em todos os andares e abre a vaga encontrada. */
  function buscar(valor: string) {
    setBusca(valor)
    const codigo = valor.trim().toLocaleLowerCase("pt-BR")

    if (!codigo) return

    const encontrada = vagas.find(
      (vaga) => vaga.codigo.toLocaleLowerCase("pt-BR") === codigo,
    )

    if (encontrada) {
      setAndarId(encontrada.andarId)
      setSetorId(encontrada.setorId)
      abrirDetalhes(encontrada.id)
    }
  }

  /** Troca o recorte do mapa e remove uma seleção pertencente ao andar anterior. */
  function selecionarAndar(novoAndarId: string) {
    setAndarId(novoAndarId)
    setSetorId("TODOS")
    setVagaSelecionadaId(null)
  }

  if (!estrutura.andares.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-neutral-600">
        Nenhum andar configurado.
      </div>
    )
  }

  return (
    <section
      className="grid min-w-0 gap-4"
      aria-label={
        modo === "admin"
          ? "Visualização das vagas para configuração"
          : "Visualização das vagas do estacionamento"
      }
    >
      <div className="rounded-2xl bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid w-full min-w-0 gap-1 sm:min-w-56 sm:flex-1">
            <Label htmlFor={`${modo}-busca-vaga`}>Buscar vaga, sensor ou placa</Label>
            <Input id={`${modo}-busca-vaga`} type="search" placeholder="Código da vaga, sensor ou placa" value={busca} onChange={evento => buscar(evento.target.value)} />
          </div>
          <Dialog open={filtrosAbertos} onOpenChange={aberto => { if (aberto) setRascunhoFiltros({ setorId, tipo, estado }); setFiltrosAbertos(aberto) }}>
            <DialogTrigger asChild><Button type="button" variant="outline" className="min-h-11"><SlidersHorizontal aria-hidden="true" />Filtros{totalFiltros > 0 ? ` (${totalFiltros})` : ""}</Button></DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md [&_button]:min-h-11">
              <DialogHeader><DialogTitle>Filtros do estacionamento</DialogTitle><DialogDescription>Escolha o recorte das vagas em {andar?.nome}.</DialogDescription></DialogHeader>
              <form className="grid gap-4" onSubmit={evento => { evento.preventDefault(); setSetorId(rascunhoFiltros.setorId); setTipo(rascunhoFiltros.tipo); setEstado(rascunhoFiltros.estado); setFiltrosAbertos(false) }}>
                <div className="grid gap-1"><Label htmlFor={`${modo}-setor-vaga`}>Setor</Label><select id={`${modo}-setor-vaga`} className="min-h-11 rounded-md border bg-background px-3" value={rascunhoFiltros.setorId} onChange={evento => setRascunhoFiltros({ ...rascunhoFiltros, setorId: evento.target.value })}><option value="TODOS">Todos os setores</option>{andar?.setores.map(setor => <option key={setor.id} value={setor.id}>{setor.nome}</option>)}</select></div>
                <div className="grid gap-1"><Label htmlFor={`${modo}-tipo-vaga`}>Categoria</Label><select id={`${modo}-tipo-vaga`} className="min-h-11 rounded-md border bg-background px-3" value={rascunhoFiltros.tipo} onChange={evento => setRascunhoFiltros({ ...rascunhoFiltros, tipo: evento.target.value as TipoVaga | "TODAS" })}><option value="TODAS">Todas as categorias</option>{Object.entries(nomesTipoVaga).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div>
                <div className="grid gap-1"><Label htmlFor={`${modo}-estado-vaga`}>Estado da vaga</Label><select id={`${modo}-estado-vaga`} className="min-h-11 rounded-md border bg-background px-3" value={rascunhoFiltros.estado} onChange={evento => setRascunhoFiltros({ ...rascunhoFiltros, estado: evento.target.value as VagaEstrutura["estadoAtual"] | "TODOS" })}><option value="TODOS">Todos os estados</option>{Object.entries(nomesEstadoVaga).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => { setSetorId("TODOS"); setTipo("TODAS"); setEstado("TODOS"); setFiltrosAbertos(false) }}>Limpar filtros</Button><Button type="button" variant="outline" onClick={() => setFiltrosAbertos(false)}>Cancelar</Button><Button type="submit">Aplicar filtros</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={diagnosticoAberto} onOpenChange={setDiagnosticoAberto}>
            <DialogTrigger asChild><Button ref={botaoDiagnostico} type="button" variant="ghost" className="min-h-11"><Activity aria-hidden="true" />Diagnóstico{atencao > 0 ? ` (${atencao})` : ""}</Button></DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl" onCloseAutoFocus={evento => { if (vagaSelecionadaId) evento.preventDefault() }}>
              <DialogHeader><DialogTitle>Diagnóstico dos sensores</DialogTitle><DialogDescription>Sensores e placas das vagas deste recorte.</DialogDescription></DialogHeader>
              <MonitoramentoSensores vagas={filtradas} demonstracao={estrutura.shopping.demonstracao === true} aoSelecionar={id => { abrirDetalhes(id); setDiagnosticoAberto(false) }} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Selecionar andar">
          {estrutura.andares.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selecionarAndar(item.id)}
              aria-pressed={andar?.id === item.id}
              className={`cartao-clicavel rounded-full px-4 py-2 text-sm font-semibold ${
                andar?.id === item.id
                  ? "bg-[#ffe100] text-black hover:bg-[#f2d500] active:bg-[#e0c600]"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300"
              }`}
            >
              {item.nome}
            </button>
          ))}
        </div>
        {totalFiltros > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted-foreground">Recorte: {resumoFiltros.join(" · ")}</span><Button type="button" variant="link" onClick={() => { setSetorId("TODOS"); setTipo("TODAS"); setEstado("TODOS") }}>Limpar filtros</Button></div>}
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-xl border bg-card p-3 text-card-foreground sm:gap-4 sm:p-4" aria-label="Situação das vagas no recorte">
        <div><dt className="text-xs text-muted-foreground sm:text-sm">Livres</dt><dd className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{filtradas.filter(vaga => vaga.estadoAtual === "LIVRE").length}</dd></div>
        <div><dt className="text-xs text-muted-foreground sm:text-sm">Ocupadas</dt><dd className="text-2xl font-bold tabular-nums">{filtradas.filter(vaga => vaga.estadoAtual === "OCUPADA").length}</dd></div>
        <div><dt className="text-xs text-muted-foreground sm:text-sm">Indisponíveis</dt><dd className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">{filtradas.filter(vaga => ["INDISPONIVEL", "DESCONHECIDA"].includes(vaga.estadoAtual)).length}</dd></div>
      </dl>
      <div className="rounded-2xl border border-neutral-300 bg-neutral-200 p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-neutral-950">{andar?.nome}</h3>
            <p className="text-sm text-neutral-600">
              {setorId === "TODOS"
                ? "Todos os setores"
                : andar?.setores.find((setor) => setor.id === setorId)?.nome}
            </p>
          </div>
          <Badge variant="secondary">{filtradas.length} {filtradas.length === 1 ? "vaga" : "vagas"}</Badge>
        </div>

        <ul aria-label="Legenda de estados das vagas" className="mb-3 flex flex-wrap gap-x-4 gap-y-2 rounded-lg bg-neutral-100 px-3 py-2.5 text-sm text-neutral-800">
          {Object.entries(nomesEstadoVaga).map(([valor, nome]) => (
            <li key={valor} className="flex items-center gap-2">
              <span
                className={`size-3 shrink-0 rounded-sm ${classesEstado[valor as VagaEstrutura["estadoAtual"]]}`}
                aria-hidden="true"
              />
              {nome}
            </li>
          ))}
        </ul>

        {filtradas.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-neutral-600">
            Nenhuma vaga corresponde aos filtros.
          </p>
        ) : (
          <>
            <div
              className="relative hidden min-h-[30rem] overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 sm:block"
              aria-label={`Mapa 2D de ${andar?.nome}`}
            >
              {posicionadas.map((vaga) => (
                <button
                  key={vaga.id}
                  type="button"
                  aria-label={`Abrir detalhes da vaga ${vaga.codigo}, ${nomesEstadoVaga[vaga.estadoAtual]}`}
                  onClick={() => abrirDetalhes(vaga.id)}
                  style={{
                    left: `${vaga.posicao!.x * 100}%`,
                    top: `${vaga.posicao!.y * 100}%`,
                    width: `${vaga.posicao!.largura * 100}%`,
                    height: `${vaga.posicao!.altura * 100}%`,
                    "--rotacao-vaga": `${vaga.posicao!.rotacao}deg`,
                  } as CSSProperties}
                  className={`cartao-clicavel vaga-mapa-clicavel absolute min-h-12 min-w-16 overflow-hidden rounded-lg border-2 px-1 text-[11px] font-bold leading-tight shadow-sm ${
                    classesEstado[vaga.estadoAtual]
                  } ${classesInteracaoEstado[vaga.estadoAtual]} ${
                    vagaSelecionadaId === vaga.id
                      ? "z-10 border-black ring-4 ring-[#ffe100]/70"
                      : "border-white hover:border-[#ffe100]"
                  }`}
                >
                  <span className="block truncate">{vaga.codigo}</span>
                  <span className="block truncate font-normal">
                    {vaga.setor} · {nomesTipoVaga[vaga.tipo]}
                  </span>
                  <span className="sr-only">{nomesEstadoVaga[vaga.estadoAtual]}</span>
                </button>
              ))}

              {posicionadas.length === 0 ? (
                <p className="grid min-h-[30rem] place-items-center px-6 text-center text-neutral-600">
                  As vagas deste recorte ainda não possuem posições salvas no mapa.
                </p>
              ) : null}
            </div>

            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-2 sm:hidden">
              {filtradas.map((vaga) => (
                <VagaLista
                  key={vaga.id}
                  vaga={vaga}
                  selecionada={vagaSelecionadaId === vaga.id}
                  aoSelecionar={() => abrirDetalhes(vaga.id)}
                />
              ))}
            </ul>

            {semPosicao.length > 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-neutral-400 bg-white/80 p-3 dark:bg-neutral-950/85">
                <p className="text-sm font-semibold text-neutral-800">Sem posição no mapa</p>
                <ul className="mt-2 hidden grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-2 sm:grid">
                  {semPosicao.map((vaga) => (
                    <VagaLista
                      key={vaga.id}
                      vaga={vaga}
                      selecionada={vagaSelecionadaId === vaga.id}
                      aoSelecionar={() => abrirDetalhes(vaga.id)}
                    />
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

      </div>

      <DetalhesVaga
        vaga={vagaSelecionada}
        andar={vagaSelecionada?.andar ?? ""}
        setor={vagaSelecionada?.setor ?? ""}
        aoFechar={() => setVagaSelecionadaId(null)}
        aoRestaurarFoco={() => {
          if (origemDetalhe.current?.isConnected) origemDetalhe.current.focus()
          else botaoDiagnostico.current?.focus()
        }}
      />
    </section>
  )
}

interface VagaListaProps {
  vaga: VagaComContexto
  selecionada: boolean
  aoSelecionar: () => void
}

/** Oferece no celular e para vagas sem posição a mesma ação de detalhes do mapa. */
function VagaLista({ vaga, selecionada, aoSelecionar }: VagaListaProps) {
  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={aoSelecionar}
        className={`cartao-clicavel flex h-full w-full min-w-0 flex-col items-start gap-2 rounded-lg border bg-white p-3 text-left ${
          selecionada
            ? "border-black ring-4 ring-[#ffe100]/60"
            : "border-neutral-200 hover:border-[#ffe100] hover:bg-[#fffbe0] active:bg-[#fff49d]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`size-3 shrink-0 rounded-sm ${classesEstado[vaga.estadoAtual]}`}
            aria-hidden="true"
          />
          <strong className="break-all">{vaga.codigo}</strong>
        </span>
        <small className="break-words text-neutral-600">
          {vaga.setor} · {nomesTipoVaga[vaga.tipo]}
        </small>
        <Badge variant="secondary">{nomesEstadoVaga[vaga.estadoAtual]}</Badge>
      </button>
    </li>
  )
}
