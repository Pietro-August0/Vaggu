/** Configura a visão e o acesso exclusivo de cada telão instalado. */
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { ApresentarTelao } from "@/components/apresentar-telao"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { objeto } from "@/servicos/api"
import type { EstruturaEstacionamento } from "@/types/estrutura"

type Telao = { id: string; nome: string; ativo: boolean; andarId: string | null; setorId: string | null }
const estiloSelect = "min-h-11 w-full min-w-0 rounded-md border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function telaoValido(valor: unknown): valor is Telao {
  return objeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string"
    && typeof valor.ativo === "boolean" && (valor.andarId === null || typeof valor.andarId === "string")
    && (valor.setorId === null || typeof valor.setorId === "string")
}
function lerLista(dados: unknown): Telao[] {
  if (!objeto(dados) || !Array.isArray(dados.teloes) || !dados.teloes.every(telaoValido)) throw new Error("Não foi possível confirmar a lista de telões.")
  return dados.teloes
}
function OpcoesVisao({ estrutura }: { estrutura: EstruturaEstacionamento }) {
  return <><option value="">Geral · todos os andares</option>{estrutura.andares.filter(andar => andar.ativo).map(andar => <option key={andar.id} value={andar.id}>{andar.nome}</option>)}</>
}
function Instalacao({ telao, estrutura, ocupado, salvar, revogar, excluir }: {
  telao: Telao; estrutura: EstruturaEstacionamento; ocupado: boolean
  salvar: (telao: Telao, andarId: string | null) => Promise<void>
  revogar: (telao: Telao) => Promise<void>
  excluir: (telao: Telao) => Promise<void>
}) {
  const [selecao, setSelecao] = useState(telao.andarId ?? "")
  const andar = estrutura.andares.find(item => item.id === telao.andarId)
  const setor = andar?.setores.find(item => item.id === telao.setorId)
  const mudou = selecao !== (telao.andarId ?? "") || telao.setorId !== null
  const andarInativo = telao.andarId && !estrutura.andares.some(item => item.id === telao.andarId && item.ativo)
  const visaoSalva = telao.andarId ? `${andar?.nome ?? "Andar indisponível"}${telao.setorId ? ` · ${setor?.nome ?? "Setor indisponível"}` : ""}` : "Geral · todos os andares"
  return <article className="grid min-w-0 gap-4 rounded-xl border p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0"><h4 className="break-words font-semibold">{telao.nome}</h4><p className="mt-1 text-sm text-muted-foreground">Exibição salva: {visaoSalva}</p></div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${telao.ativo ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-muted text-muted-foreground"}`}>{telao.ativo ? "Ativo" : "Acesso revogado"}</span>
    </div>
    <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">Tela apresentada
        <select className={estiloSelect} value={selecao} disabled={ocupado || !telao.ativo} onChange={evento => setSelecao(evento.target.value)}>
          <OpcoesVisao estrutura={estrutura}/>
          {andarInativo && <option value={telao.andarId!} disabled>{andar?.nome ?? "Andar indisponível"} · inativo</option>}
        </select>
      </label>
      <Button disabled={ocupado || !telao.ativo || !mudou || (!!selecao && !estrutura.andares.some(item => item.id === selecao && item.ativo))} onClick={() => void salvar(telao, selecao || null)}>Salvar exibição</Button>
    </div>
    {telao.ativo && mudou && <p className="text-sm text-muted-foreground">Ao salvar, o telão receberá a nova exibição automaticamente.{telao.setorId && " O filtro por setor será substituído pela visão do andar ou geral."}</p>}
    <div className="flex flex-wrap gap-2">
      {telao.ativo && <ApresentarTelao variant="outline" destino={`/telao/${telao.id}`}>Apresentar telão<span className="sr-only"> {telao.nome}</span></ApresentarTelao>}
      {telao.ativo && <Button variant="outline" disabled={ocupado} onClick={() => void revogar(telao)}>Revogar acesso<span className="sr-only"> de {telao.nome}</span></Button>}
      <Button variant="destructive" disabled={ocupado} onClick={() => void excluir(telao)}>Excluir telão<span className="sr-only"> {telao.nome}</span></Button>
    </div>
  </article>
}
export function TeloesAdmin({ shoppingId, estrutura }: { shoppingId?: string; estrutura: EstruturaEstacionamento }) {
  const { consultar } = useAppStore()
  const [filtro, setFiltro] = useState("ativos")
  const [busca, setBusca] = useState("")
  const [teloes, setTeloes] = useState<Telao[]>([])
  const [andarId, setAndarId] = useState("")
  const [emissao, setEmissao] = useState<{ id: string; chave: string } | null>(null)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [falhouCarga, setFalhouCarga] = useState(false)
  const base = shoppingId ? `/shoppings/${shoppingId}/teloes` : "/estacionamento/teloes"
  const carregar = useCallback(async () => lerLista(await consultar(base)), [base, consultar])
  useEffect(() => {
    let ativo = true
    carregar().then(lista => { if (ativo) { setTeloes(lista); setFalhouCarga(false) } }).catch(falha => {
      if (ativo) { setErro(falha instanceof Error ? falha.message : "Não foi possível carregar os telões."); setFalhouCarga(true) }
    }).finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [carregar])
  async function tentarNovamente() {
    setCarregando(true); setErro("")
    try { setTeloes(await carregar()); setFalhouCarga(false) }
    catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível carregar os telões.") }
    finally { setCarregando(false) }
  }
  async function criar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const campos = new FormData(formulario)
    setOcupado(true); setErro(""); setSucesso(""); setEmissao(null)
    try {
      const resposta = await consultar(base, { nome: String(campos.get("nome") ?? "").trim(), andarId: andarId || null, setorId: null })
      if (!objeto(resposta) || !telaoValido(resposta.telao) || typeof resposta.chave !== "string") throw new Error("Não foi possível confirmar a emissão do acesso.")
      const novo = resposta.telao
      setTeloes(lista => [...lista, novo])
      setEmissao({ id: novo.id, chave: resposta.chave })
      setSucesso("Telão cadastrado. Guarde a credencial para ativá-lo na tela de exibição.")
      formulario.reset(); setAndarId("")
    } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível cadastrar o telão.") }
    finally { setOcupado(false) }
  }
  async function salvar(telao: Telao, novoAndarId: string | null) {
    setOcupado(true); setErro(""); setSucesso("")
    try {
      const resposta = await consultar(`${base}/${telao.id}`, { andarId: novoAndarId, setorId: null }, "PATCH")
      if (!objeto(resposta) || !telaoValido(resposta.telao)) throw new Error("Não foi possível confirmar a alteração. Atualize a lista antes de tentar novamente.")
      const atualizado = resposta.telao
      setTeloes(lista => lista.map(item => item.id === atualizado.id ? atualizado : item))
      setSucesso(`Exibição de ${telao.nome} salva. A tela será atualizada em até 15 segundos.`)
    } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível salvar a exibição.") }
    finally { setOcupado(false) }
  }
  async function revogar(telao: Telao) {
    if (!window.confirm(`Revogar o acesso do telão ${telao.nome}? A tela deixará de exibir as vagas.`)) return
    setOcupado(true); setErro(""); setSucesso("")
    try {
      await consultar(`${base}/${telao.id}`, undefined, "DELETE")
      if (emissao?.id === telao.id) setEmissao(null)
      setTeloes(lista => lista.map(item => item.id === telao.id ? { ...item, ativo: false } : item))
      setSucesso(`Acesso de ${telao.nome} revogado.`)
    } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível revogar o acesso.") }
    finally { setOcupado(false) }
  }
  async function excluir(telao: Telao) {
    if (!window.confirm(`Excluir definitivamente o telão ${telao.nome}? O cadastro será removido e sua credencial deixará de funcionar.`)) return
    setOcupado(true); setErro(""); setSucesso("")
    try {
      await consultar(`${base}/${telao.id}/cadastro`, undefined, "DELETE")
      if (emissao?.id === telao.id) setEmissao(null)
      setTeloes(lista => lista.filter(item => item.id !== telao.id))
      setSucesso(`Telão ${telao.nome} excluído.`)
    } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível excluir o telão.") }
    finally { setOcupado(false) }
  }
  return <section className="grid min-w-0 gap-5 rounded-2xl border bg-card p-4 text-card-foreground sm:p-6" aria-busy={carregando || ocupado}>
    <div><h3 className="text-xl font-semibold">Telões instalados</h3><p className="mt-1 text-sm text-muted-foreground">Escolha a visão geral ou um andar para cada tela do estacionamento.</p></div>
    {erro && <p role="alert" className="break-words rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">{erro}</p>}
    {sucesso && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{sucesso}</p>}
    <form onSubmit={criar} className="grid items-end gap-3 rounded-xl bg-muted/40 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">Nome do telão<Input name="nome" required maxLength={120} placeholder="Entrada principal" disabled={ocupado || carregando || falhouCarga}/></label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">Tela apresentada<select className={estiloSelect} value={andarId} onChange={evento => setAndarId(evento.target.value)} disabled={ocupado || carregando || falhouCarga}><OpcoesVisao estrutura={estrutura}/></select></label>
      <Button disabled={ocupado || carregando || falhouCarga}>Cadastrar telão</Button>
    </form>
    {emissao && <div className="grid min-w-0 gap-2 rounded-xl border border-amber-400 bg-amber-50 p-4 text-black">
      <strong>Credencial exibida somente agora</strong><code className="break-all select-all">{emissao.chave}</code><p className="text-sm">Abra o telão na tela de exibição e informe esta chave. Guarde-a em local seguro.</p>
      <Link className="w-fit underline underline-offset-4" to={`/telao/${emissao.id}`} target="_blank" rel="noopener noreferrer">Abrir telão em nova aba</Link>
      <Button className="w-fit" variant="outline" onClick={() => setEmissao(null)}>Já guardei a credencial</Button>
    </div>}
    {carregando && <p role="status" className="text-sm text-muted-foreground">Carregando telões…</p>}
    {falhouCarga && !carregando && <Button variant="outline" className="w-fit" onClick={() => void tentarNovamente()}>Tentar novamente</Button>}
    {!carregando && !falhouCarga && teloes.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Nenhum telão cadastrado. Adicione a primeira tela acima.</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium">Buscar telão<Input value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Nome do telão" /></label>
      <label className="grid gap-1 text-sm font-medium">Mostrar<select className={estiloSelect} value={filtro} onChange={evento => setFiltro(evento.target.value)}><option value="ativos">Ativos ({teloes.filter(t => t.ativo).length})</option><option value="revogados">Revogados ({teloes.filter(t => !t.ativo).length})</option><option value="todos">Todos ({teloes.length})</option></select></label>
    </div>
    {!carregando && teloes.length > 0 && !teloes.some(t => (filtro === "todos" || t.ativo === (filtro === "ativos")) && t.nome.toLocaleLowerCase("pt-BR").includes(busca.trim().toLocaleLowerCase("pt-BR"))) && <p role="status" className="text-sm text-muted-foreground">Nenhum telão corresponde aos filtros.</p>}
    {teloes.filter(t => (filtro === "todos" || t.ativo === (filtro === "ativos")) && t.nome.toLocaleLowerCase("pt-BR").includes(busca.trim().toLocaleLowerCase("pt-BR"))).map(telao => <Instalacao key={`${telao.id}:${telao.andarId}:${telao.setorId}`} telao={telao} estrutura={estrutura} ocupado={ocupado} salvar={salvar} revogar={revogar} excluir={excluir}/>)}
  </section>
}
