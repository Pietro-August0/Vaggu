/** Configurador do P04 para criar a hierarquia e salvar posições proporcionais no mapa. */
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditorMapaVagas } from "@/components/editor-mapa-vagas"
import { MapaAoVivo } from "@/components/mapa-ao-vivo"
import { lerEstrutura } from "@/servicos/estrutura"
import { obterSituacaoImplantacao, situacoesImplantacao } from "@/servicos/situacao-implantacao"
import type { EstruturaEstacionamento, PosicaoVaga, SituacaoImplantacao, TipoVaga } from "@/types/estrutura"

const situacoes: SituacaoImplantacao[] = ["NOVO_ATENDIMENTO", "EM_ANALISE", "DOCUMENTACAO_PENDENTE", "APROVADO", "EM_CONFIGURACAO", "AGUARDANDO_INSTALACAO", "ATIVO", "REJEITADO", "INATIVO"]

/** Mantém formulários pequenos e atualiza a árvore sempre a partir da resposta do servidor. */
export function EstruturaAdmin({ shoppingId, aoAlterar }: { shoppingId: string; aoAlterar?: () => void }) {
  const { consultar } = useAppStore(); const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [erro, setErro] = useState(""); const [mensagem, setMensagem] = useState(""); const [ocupado, setOcupado] = useState(false)
  const [andarMapaId, setAndarMapaId] = useState(""); const [rascunho, setRascunho] = useState(false)
  const [aba, setAba] = useState<"configurar" | "mapa" | "posicoes">("configurar")

  const carregar = useCallback(async () => {
    const valor = lerEstrutura(await consultar(`/shoppings/${shoppingId}/estrutura`))
    setEstrutura(valor)
    // Preserva o andar selecionado se ele ainda existir após atualizar a estrutura.
    setAndarMapaId(atual => valor.andares.some(andar => andar.id === atual) ? atual : valor.andares[0]?.id ?? "")
  }, [consultar, shoppingId])
  useEffect(() => {
    let ativo = true
    consultar(`/shoppings/${shoppingId}/estrutura`)
      .then(lerEstrutura)
      .then(valor => {
        if (!ativo) return
        setEstrutura(valor)
        setAndarMapaId(valor.andares[0]?.id ?? "")
      })
      .catch(falha => {
        if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao consultar a estrutura.")
      })
    return () => { ativo = false }
  }, [consultar, shoppingId])
  const andarMapa = estrutura?.andares.find(andar => andar.id === andarMapaId)
  const vagasMapa = useMemo(() => andarMapa?.setores.flatMap(setor => setor.vagas) ?? [], [andarMapa])

  async function executar(tarefa: () => Promise<void>, sucesso: string) {
    setOcupado(true)
    setErro("")
    setMensagem("")
    try {
      await tarefa()
      aoAlterar?.()
      setMensagem(sucesso)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível concluir.")
    } finally {
      setOcupado(false)
    }
  }
  const dados = (evento: FormEvent<HTMLFormElement>) => { evento.preventDefault(); return { elemento: evento.currentTarget, valores: new FormData(evento.currentTarget) } }

  function criarAndar(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/shoppings/${shoppingId}/andares`, { nome: valores.get("nome"), ordem: Number(valores.get("ordem")) }); elemento.reset(); await carregar() }, "Andar criado.") }
  function criarSetor(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/andares/${valores.get("andarId")}/setores`, { nome: valores.get("nome") }); elemento.reset(); await carregar() }, "Setor criado.") }
  function criarVaga(evento: FormEvent<HTMLFormElement>) { const { elemento, valores } = dados(evento); void executar(async () => { await consultar(`/setores/${valores.get("setorId")}/vagas`, { codigo: valores.get("codigo"), tipo: valores.get("tipo") as TipoVaga }); elemento.reset(); await carregar() }, "Vaga criada.") }
  function salvarMapa(posicoes: Record<string, PosicaoVaga>) { if (!andarMapa) return; void executar(async () => { await consultar(`/andares/${andarMapa.id}/mapa`, { revisao: andarMapa.revisaoMapa, posicoes: vagasMapa.filter(vaga => posicoes[vaga.id]).map(vaga => ({ vagaId: vaga.id, ...posicoes[vaga.id] })) }, "PATCH"); await carregar(); setRascunho(false) }, "Mapa salvo.") }
  function mudarSituacao(valor: SituacaoImplantacao) { void executar(async () => { await consultar(`/shoppings/${shoppingId}/implantacao`, { situacao: valor }, "PATCH"); await carregar() }, "Situação atualizada.") }

  if (!estrutura) return <div className="rounded-2xl bg-white p-6"><p role="status">Carregando estrutura...</p>{erro && <p role="alert" className="mt-2 text-red-700">{erro}</p>}</div>
  const setores = estrutura.andares.flatMap(andar => andar.setores.map(setor => ({ ...setor, andarNome: andar.nome })))
  const situacaoAtual = obterSituacaoImplantacao(estrutura.shopping.situacaoImplantacao)
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
    <div className="rounded-2xl bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-xl font-semibold">Situação da estrutura</h2><p className="mt-1 text-sm text-neutral-600">{estrutura.andares.length} andar(es) · {setores.length} setor(es)</p><p className="mt-3 flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-sm font-semibold ${situacaoAtual.classe}`}>{situacaoAtual.nome}</span></p><p className="mt-2 max-w-md text-sm text-neutral-700">{situacaoAtual.descricao}</p></div><div className="grid min-w-0 gap-2"><Label htmlFor="situacao">Implantação</Label><select id="situacao" className="min-h-11 min-w-0 rounded-md border bg-white px-3 py-2" value={estrutura.shopping.situacaoImplantacao} disabled={ocupado} onChange={evento => mudarSituacao(evento.target.value as SituacaoImplantacao)}>{situacoes.map(valor => <option key={valor} value={valor}>{situacoesImplantacao[valor].nome}</option>)}</select></div></div>{erro && <p role="alert" className="mt-4 text-red-700">{erro}</p>}{mensagem && <p role="status" className="mt-4 text-green-700">{mensagem}</p>}</div>
    <div role="group" aria-label="Etapas da estrutura" className="flex flex-wrap gap-2 rounded-2xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#242424]">
      {([ ["configurar", "Configurar vagas"], ["mapa", "Visualizar mapa"], ["posicoes", "Editar posições"] ] as const).map(([valor, rotulo]) => <button key={valor} type="button" aria-pressed={aba === valor} disabled={ocupado} onClick={() => { if (aba === valor) return; if (!rascunho || window.confirm("Descartar as posições ainda não salvas?")) { setRascunho(false); setAba(valor) } }} className={aba === valor ? "rounded-xl bg-[#ffe100] px-4 py-2 text-sm font-semibold text-black hover:bg-[#f2d500] active:bg-[#e0c600]" : "rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"}>{rotulo}</button>)}
    </div>
    {aba === "configurar" && <div id="painel-estrutura-configurar" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3">
      <form className="min-w-0 rounded-2xl bg-white p-5" onSubmit={criarAndar}><h3 className="font-semibold">Novo andar</h3><Label className="mt-4" htmlFor="andar-nome">Nome</Label><Input id="andar-nome" name="nome" required maxLength={120}/><Label className="mt-3" htmlFor="andar-ordem">Ordem</Label><Input id="andar-ordem" name="ordem" type="number" min={0} max={999} required/><Button className="mt-4" disabled={ocupado}>Criar andar</Button></form>
      <form className="min-w-0 rounded-2xl bg-white p-5" onSubmit={criarSetor}><h3 className="font-semibold">Novo setor</h3><Label className="mt-4" htmlFor="setor-andar">Andar</Label><select id="setor-andar" name="andarId" className="w-full rounded-md border bg-white px-3 py-2" required>{estrutura.andares.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select><Label className="mt-3" htmlFor="setor-nome">Nome</Label><Input id="setor-nome" name="nome" required maxLength={120}/><Button className="mt-4" disabled={ocupado || !estrutura.andares.length}>Criar setor</Button></form>
      <form className="min-w-0 rounded-2xl bg-white p-5" onSubmit={criarVaga}><h3 className="font-semibold">Nova vaga</h3><Label className="mt-4" htmlFor="vaga-setor">Setor</Label><select id="vaga-setor" name="setorId" className="w-full rounded-md border bg-white px-3 py-2" required>{setores.map(s => <option key={s.id} value={s.id}>{s.andarNome} · {s.nome}</option>)}</select><div className="mt-3 flex gap-2"><div className="min-w-0"><Label htmlFor="vaga-codigo">Código</Label><Input id="vaga-codigo" name="codigo" required maxLength={40}/></div><div className="min-w-0"><Label htmlFor="vaga-tipo">Tipo</Label><select id="vaga-tipo" name="tipo" className="w-full rounded-md border bg-white px-3 py-2">{["COMUM","PCD","IDOSO","ELETRICA"].map(t => <option key={t}>{t}</option>)}</select></div></div><Button className="mt-4" disabled={ocupado || !setores.length}>Criar vaga</Button></form>
    </div>}
    {aba === "mapa" && <div id="painel-estrutura-mapa"><h3 className="mb-4 text-xl font-semibold text-neutral-950 dark:text-white">Visualização 2D das vagas</h3><MapaAoVivo key={shoppingId} caminho={`/shoppings/${shoppingId}/estrutura`} modo="admin"/></div>}
    {aba === "posicoes" && <div id="painel-estrutura-posicoes">{estrutura.andares.length > 0 ? <div className="rounded-2xl bg-white p-4 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div className="grid w-full min-w-0 gap-2 sm:w-auto sm:grid-cols-[auto_minmax(10rem,1fr)] sm:items-center"><Label htmlFor="andar-mapa">Mapa do andar</Label><select id="andar-mapa" className="min-h-11 min-w-0 rounded-md border bg-white px-3 py-2" value={andarMapaId} disabled={ocupado} onChange={e => { if (!rascunho || window.confirm("Descartar as posições ainda não salvas?")) { setRascunho(false); setAndarMapaId(e.target.value) } }}>{estrutura.andares.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}</select></div></div>
      {andarMapa && <EditorMapaVagas key={`${andarMapa.id}-${andarMapa.revisaoMapa}`} andar={andarMapa} ocupado={ocupado} aoSalvar={salvarMapa} aoMudarRascunho={setRascunho}/>}
    </div> : <p className="rounded-2xl bg-white p-6 text-neutral-600">Crie um andar antes de editar as posições.</p>}</div>}
  </div>
}
