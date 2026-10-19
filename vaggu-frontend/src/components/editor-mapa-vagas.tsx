/** Edição direta das vagas; mantém o rascunho até salvar a revisão do piso. */
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import type { AndarEstrutura, PosicaoVaga } from "@/types/estrutura"

function caixa(p: PosicaoVaga, aspecto: number) {
  const radianos = p.rotacao * Math.PI / 180
  const larguraVisual = Math.abs(p.largura * Math.cos(radianos)) + Math.abs(p.altura / aspecto * Math.sin(radianos))
  const alturaVisual = Math.abs(p.largura * aspecto * Math.sin(radianos)) + Math.abs(p.altura * Math.cos(radianos))
  return { x: p.x + (p.largura - larguraVisual) / 2, y: p.y + (p.altura - alturaVisual) / 2, largura: larguraVisual, altura: alturaVisual }
}
function limitar(p: PosicaoVaga, aspecto: number): PosicaoVaga {
  const b = caixa(p, aspecto)
  return { ...p, x: Math.max(0, Math.min(1 - p.largura, p.x + Math.max(0, -b.x) - Math.max(0, b.x + b.largura - 1))),
    y: Math.max(0, Math.min(1 - p.altura, p.y + Math.max(0, -b.y) - Math.max(0, b.y + b.altura - 1))) }
}

export function EditorMapaVagas({ andar, ocupado, aoSalvar, aoMudarRascunho }: {
  andar: AndarEstrutura; ocupado: boolean
  aoSalvar: (posicoes: Record<string, PosicaoVaga>) => void
  aoMudarRascunho: (alterado: boolean) => void
}) {
  const selecaoId = useId()
  const vagas = useMemo(() => andar.setores.flatMap(setor => setor.vagas.filter(vaga => vaga.ativo).map(vaga => ({ ...vaga, setor: setor.nome }))), [andar])
  const [iniciais] = useState(() => Object.fromEntries(vagas.map((vaga, indice) => [vaga.id, vaga.posicao ?? {
    x: 0.04 + (indice % 6) * 0.15, y: 0.03 + Math.floor(indice / 6) / Math.max(8, Math.ceil(vagas.length / 6)),
    largura: 0.11, altura: Math.min(0.09, 0.7 / Math.ceil(vagas.length / 6)), rotacao: 0,
  }])))
  const [posicoes, setPosicoes] = useState<Record<string, PosicaoVaga>>(iniciais)
  const [selecionada, setSelecionada] = useState(vagas[0]?.id ?? "")
  const [buscaVaga, setBuscaVaga] = useState("")
  const [setorFiltro, setSetorFiltro] = useState("TODOS")
  const [alterado, setAlterado] = useState(false)
  const [aviso, setAviso] = useState("")
  const mapa = useRef<HTMLDivElement>(null)
  const [aspecto, setAspecto] = useState(720 / 640)
  const arraste = useRef<{ id: string; pointerId: number; x: number; y: number; inicial: PosicaoVaga; largura: number; altura: number } | null>(null)
  const vaga = vagas.find(item => item.id === selecionada)
  const setores = [...new Set(vagas.map(item => item.setor))]
  const termoVaga = buscaVaga.trim().toLocaleLowerCase("pt-BR")
  const vagasEncontradas = vagas.filter(item => (setorFiltro === "TODOS" || item.setor === setorFiltro)
    && (!termoVaga || `${item.codigo} ${item.setor} ${item.monitoramento?.sensorCodigo ?? ""}`.toLocaleLowerCase("pt-BR").includes(termoVaga)))

  useEffect(() => {
    const elemento = mapa.current!
    const observar = new ResizeObserver(() => setAspecto(elemento.clientWidth / elemento.clientHeight))
    observar.observe(elemento)
    return () => observar.disconnect()
  }, [])

  useEffect(() => {
    if (!alterado) return
    const proteger = (evento: BeforeUnloadEvent) => { evento.preventDefault() }
    window.addEventListener("beforeunload", proteger)
    return () => window.removeEventListener("beforeunload", proteger)
  }, [alterado])

  function alterar(id: string, p: PosicaoVaga) {
    const area = mapa.current!.getBoundingClientRect()
    setPosicoes(atuais => ({ ...atuais, [id]: limitar(p, area.width / area.height) }))
    setAlterado(true)
    aoMudarRascunho(true)
    setAviso("Alterações ainda não salvas.")
  }
  function iniciar(evento: PointerEvent<HTMLButtonElement>, id: string) {
    if (ocupado || (evento.pointerType === "mouse" && evento.button !== 0)) return
    const area = mapa.current!.getBoundingClientRect()
    setSelecionada(id)
    evento.currentTarget.focus()
    evento.currentTarget.setPointerCapture(evento.pointerId)
    arraste.current = { id, pointerId: evento.pointerId, x: evento.clientX, y: evento.clientY,
      inicial: posicoes[id], largura: area.width, altura: area.height }
  }
  function mover(evento: PointerEvent<HTMLButtonElement>) {
    const inicio = arraste.current
    if (!inicio || inicio.pointerId !== evento.pointerId || ocupado) return
    const dx = evento.clientX - inicio.x
    const dy = evento.clientY - inicio.y
    if (Math.abs(dx) + Math.abs(dy) < 3) return
    alterar(inicio.id, { ...inicio.inicial, x: inicio.inicial.x + dx / inicio.largura, y: inicio.inicial.y + dy / inicio.altura })
  }
  function teclado(evento: KeyboardEvent<HTMLButtonElement>, id: string) {
    const direcoes: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direcao = direcoes[evento.key]
    if (!direcao || ocupado) return
    evento.preventDefault()
    const passo = evento.shiftKey ? 0.05 : 0.01
    alterar(id, { ...posicoes[id], x: posicoes[id].x + direcao[0] * passo, y: posicoes[id].y + direcao[1] * passo })
  }
  function redimensionar(fator: number) {
    if (!vaga) return
    const p = posicoes[vaga.id]
    alterar(vaga.id, { ...p, largura: Math.max(0.04, Math.min(0.35, p.largura * fator)), altura: Math.max(0.04, Math.min(0.3, p.altura * fator)) })
  }
  const sobrepostas = vagas.some((item, i) => vagas.slice(i + 1).some(outra => {
    const a = caixa(posicoes[item.id], aspecto), b = caixa(posicoes[outra.id], aspecto)
    return a.x < b.x + b.largura - 0.00001 && a.x + a.largura > b.x + 0.00001 && a.y < b.y + b.altura - 0.00001 && a.y + a.altura > b.y + 0.00001
  }))
  return <section className="mt-5 grid min-w-0 gap-4" aria-label="Editor visual das vagas">
    <div><h3 className="text-lg font-bold">Organize as vagas no mapa</h3><p id="instrucoes-editor" className="mt-1 text-sm text-muted-foreground">Arraste uma vaga ou selecione-a e toque no lugar desejado. Use as setas do teclado para ajustes; Shift move mais rápido. No celular, deslize a área ao redor das vagas para navegar.</p></div>
    <div className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-1 text-sm font-semibold"><label htmlFor={`${selecaoId}-busca`}>Buscar vaga ou sensor</label><input id={`${selecaoId}-busca`} type="search" className="min-h-11 min-w-0 rounded-md border bg-background px-3" placeholder="Código, setor ou sensor" value={buscaVaga} onChange={e => setBuscaVaga(e.target.value)} /></div>
        <div className="grid gap-1 text-sm font-semibold"><label htmlFor={`${selecaoId}-setor`}>Setor</label><select id={`${selecaoId}-setor`} className="min-h-11 min-w-0 rounded-md border bg-background px-3" value={setorFiltro} onChange={e => setSetorFiltro(e.target.value)}><option value="TODOS">Todos os setores</option>{setores.map(setor => <option key={setor} value={setor}>{setor}</option>)}</select></div>
        <div className="grid gap-1 text-sm font-semibold"><label htmlFor={selecaoId}>Vaga selecionada</label><select id={selecaoId} className="min-h-11 min-w-0 rounded-md border bg-background px-3" value={selecionada} disabled={ocupado || vagas.length === 0} onChange={e => setSelecionada(e.target.value)}>{vaga && !vagasEncontradas.some(item => item.id === vaga.id) && <option value={vaga.id}>{vaga.codigo} · {vaga.setor} (fora do filtro)</option>}{vagasEncontradas.map(item => <option key={item.id} value={item.id}>{item.codigo} · {item.setor}{item.monitoramento ? ` · ${item.monitoramento.sensorCodigo}` : ""}</option>)}</select></div>
        <p role="status" className="text-xs font-normal text-muted-foreground sm:col-span-2 lg:col-span-3">{vagasEncontradas.length} de {vagas.length} vagas encontradas. {vaga ? `Selecionada: ${vaga.codigo} · ${vaga.setor}.` : ""}</p>
      </div>
      <Button variant="outline" disabled={ocupado || !vaga} onClick={() => redimensionar(1.1)}>Aumentar vaga</Button>
      <Button variant="outline" disabled={ocupado || !vaga} onClick={() => redimensionar(1 / 1.1)}>Diminuir vaga</Button>
      <Button variant="outline" disabled={ocupado || !vaga} onClick={() => vaga && alterar(vaga.id, { ...posicoes[vaga.id], rotacao: (posicoes[vaga.id].rotacao + 90) % 360 })}>Girar 90°</Button>
    </div>
    <div className="max-w-full overflow-auto rounded-xl border bg-neutral-100" aria-label="Área de navegação do editor" tabIndex={0}>
      <div ref={mapa} role="group" aria-label={`Editar mapa de ${andar.nome}`} aria-describedby="instrucoes-editor" className="relative min-w-[720px] h-[640px] bg-[radial-gradient(#a3a3a3_1px,transparent_1px)] bg-[size:20px_20px]" onClick={e => {
        if (e.target !== e.currentTarget || !vaga || ocupado) return
        const area = e.currentTarget.getBoundingClientRect()
        const p = posicoes[vaga.id]
        alterar(vaga.id, { ...p, x: (e.clientX - area.left) / area.width - p.largura / 2, y: (e.clientY - area.top) / area.height - p.altura / 2 })
      }}>
        {vagas.map(item => { const p = posicoes[item.id]; return <button key={item.id} type="button" disabled={ocupado} aria-label={`Mover vaga ${item.codigo}`} aria-pressed={selecionada === item.id} onClick={() => setSelecionada(item.id)} onFocus={() => setSelecionada(item.id)} onKeyDown={e => teclado(e, item.id)} onPointerDown={e => iniciar(e, item.id)} onPointerMove={mover} onPointerUp={() => { arraste.current = null }} onPointerCancel={() => { arraste.current = null }} onLostPointerCapture={() => { arraste.current = null }}
          style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: `${p.largura * 100}%`, height: `${p.altura * 100}%`, transform: `rotate(${p.rotacao}deg)`, touchAction: "none" }}
          className={`absolute flex cursor-grab select-none flex-col items-center justify-center overflow-hidden rounded-lg border-2 p-1 text-xs text-neutral-950 shadow-sm active:cursor-grabbing focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black ${selecionada === item.id ? "z-10 border-black bg-[#ffe100] ring-2 ring-black/20" : "border-neutral-400 bg-white hover:bg-yellow-100"}`}><strong>{item.codigo}</strong><span className="max-w-full truncate">{item.setor}</span></button> })}
      </div>
    </div>
    <p role="status" className="text-sm text-muted-foreground">{aviso || "Selecione uma vaga para começar."}{sobrepostas ? " Há vagas sobrepostas: afaste-as antes de salvar." : ""}</p>
    <div className="flex flex-wrap gap-2"><Button disabled={ocupado || !alterado || !vagas.length || sobrepostas} onClick={() => aoSalvar(posicoes)}>{ocupado ? "Salvando..." : "Salvar posições"}</Button><Button variant="outline" disabled={ocupado || !alterado} onClick={() => { setPosicoes(iniciais); setAlterado(false); aoMudarRascunho(false); setAviso("Alterações desfeitas.") }}>Desfazer alterações</Button></div>
  </section>
}
