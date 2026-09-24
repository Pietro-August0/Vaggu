/** Fluxo administrativo de cadastro, listagem e ficha completa dos shoppings VAGGU. */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, Check, CircleParking, Copy, Plus, Search, Trash2, Upload, UserRound, UsersRound } from "lucide-react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { EstruturaAdmin } from "@/components/estrutura-admin"
import { ExportacaoEstrutura } from "@/components/exportacao-estrutura"
import { FormularioShopping } from "@/components/formulario-shopping"
import { FotoShopping } from "@/components/foto-shopping"
import { ImportacaoEstrutura } from "@/components/importacao-estrutura"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { objeto } from "@/servicos/api"
import { lerEstrutura } from "@/servicos/estrutura"
import { lerGerentesAdmin, lerListaShoppings, lerRespostaShopping } from "@/servicos/shoppings"
import type { DadosShopping, GerenteAdmin, ShoppingAdmin } from "@/types/admin"
import type { EstruturaEstacionamento } from "@/types/estrutura"

const rotulosSituacao: Record<string, string> = {
  NOVO_ATENDIMENTO: "Novo atendimento", EM_ANALISE: "Em análise", DOCUMENTACAO_PENDENTE: "Documentação pendente",
  APROVADO: "Aprovado", EM_CONFIGURACAO: "Em configuração", AGUARDANDO_INSTALACAO: "Aguardando instalação",
  ATIVO: "Operação ativa", REJEITADO: "Rejeitado", INATIVO: "Inativo",
}

function enderecoResumido(shopping: ShoppingAdmin) {
  const linha = [shopping.logradouro, shopping.numero, shopping.bairro, shopping.cidade, shopping.uf].filter(Boolean).join(", ")
  return linha || shopping.endereco || "Cadastro de endereço pendente"
}

/** Exibe o formulário inicial solicitado e abre a ficha do registro recém-criado. */
function CadastroShopping() {
  const { consultar, enviarArquivo } = useAppStore()
  const navigate = useNavigate()
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState("")

  function criar(dados: DadosShopping, formulario: HTMLFormElement, foto: File | null) {
    setOcupado(true); setErro("")
    void (async () => {
      try {
        const shopping = lerRespostaShopping(await consultar("/shoppings", dados))
        if (foto) {
          try { await enviarArquivo(`/shoppings/${shopping.id}/foto`, foto, foto.type) }
          catch (falha) { toast.warning(falha instanceof Error ? `Shopping cadastrado, mas a foto não foi salva: ${falha.message}` : "Shopping cadastrado, mas a foto não foi salva.") }
        }
        formulario.reset()
        toast.success(`${shopping.nome} foi cadastrado.`)
        navigate(`/admin/shoppings/${shopping.id}`)
      } catch (falha) {
        setErro(falha instanceof Error ? falha.message : "Não foi possível cadastrar o shopping.")
      } finally {
        setOcupado(false)
      }
    })()
  }

  return <section className="mx-auto grid max-w-6xl gap-7">
    <header><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffe100]">Nova parceria</p><h2 className="mt-2 text-3xl font-black text-white">Cadastro do shopping</h2><p className="mt-2 max-w-2xl text-neutral-400">Registre os dados institucionais e operacionais. Gerentes e estrutura são configurados depois, na ficha do shopping.</p></header>
    {erro && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">{erro}</p>}
    <div className="rounded-3xl border border-white/10 bg-[#202020] p-5 shadow-2xl sm:p-8"><FormularioShopping ocupado={ocupado} rotuloBotao="Cadastrar shopping" aoEnviar={criar} /></div>
  </section>
}

/** Lista os clientes cadastrados sem selecionar automaticamente um deles. */
function ListaShoppings() {
  const { consultar } = useAppStore()
  const [shoppings, setShoppings] = useState<ShoppingAdmin[] | null>(null)
  const [busca, setBusca] = useState("")
  const [erro, setErro] = useState("")
  useEffect(() => { let ativo = true; consultar("/shoppings").then(lerListaShoppings).then(lista => { if (ativo) setShoppings(lista) }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível consultar os shoppings.") }); return () => { ativo = false } }, [consultar])
  const filtrados = useMemo(() => shoppings?.filter(shopping => `${shopping.nome} ${enderecoResumido(shopping)}`.toLocaleLowerCase("pt-BR").includes(busca.toLocaleLowerCase("pt-BR"))) ?? [], [busca, shoppings])

  return <section className="mx-auto grid max-w-6xl gap-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffe100]">Clientes VAGGU</p><h2 className="mt-2 text-3xl font-black text-white">Shoppings cadastrados</h2></div><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" aria-hidden="true"/><Input className="h-11 border-white/15 bg-white/5 pl-10 text-white" value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar shopping ou cidade" aria-label="Buscar shoppings"/></div></div>
    {erro && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">{erro}</p>}
    {shoppings === null ? <p role="status" className="text-neutral-300">Carregando shoppings...</p> : filtrados.length === 0 ? <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-neutral-400">{busca ? "Nenhum shopping corresponde à busca." : "Nenhum shopping cadastrado."}</div>
      : <div className="grid gap-4">{filtrados.map(shopping => <Link key={shopping.id} to={`/admin/shoppings/${shopping.id}`} className="cartao-clicavel grid gap-4 rounded-2xl border border-white/10 bg-white p-5 text-neutral-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe100]/50 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <FotoShopping nome={shopping.nome} imagemUrl={shopping.imagemUrl} className="size-14 rounded-2xl"/><span><strong className="text-lg">{shopping.nome}</strong><span className="mt-1 block text-sm text-neutral-600">{enderecoResumido(shopping)}</span></span><span className="flex items-center gap-3"><Badge variant="secondary">{shopping.totalGerentes} gerente(s)</Badge><span className="rounded-lg bg-[#ffe100] px-4 py-2 text-sm font-bold">Abrir ficha</span></span>
      </Link>)}</div>}
    <Button asChild className="ml-auto h-11 px-5 font-bold"><Link to="/admin"><Plus aria-hidden="true"/>Criar shopping</Link></Button>
  </section>
}

/** Resume somente estados persistidos; não converte ausência de telemetria em vaga livre. */
function ResumoVagas({ estrutura }: { estrutura: EstruturaEstacionamento }) {
  const vagas = estrutura.andares.flatMap(andar => andar.setores.flatMap(setor => setor.vagas))
  const ativas = vagas.filter(vaga => vaga.ativo)
  const total = ativas.length
  const livres = ativas.filter(vaga => vaga.estadoAtual === "LIVRE").length
  const ocupadas = ativas.filter(vaga => vaga.estadoAtual === "OCUPADA").length
  const indisponiveis = ativas.filter(vaga => vaga.estadoAtual === "DESCONHECIDA").length
  const especiais = ativas.filter(vaga => vaga.tipo !== "COMUM").length
  const cartoes = [["Vagas totais", total, CircleParking], ["Livres", livres, CircleParking], ["Ocupadas", ocupadas, CircleParking], ["Indisponíveis", indisponiveis, CircleParking], ["Especiais", especiais, CircleParking]] as const
  return <section className="grid gap-5"><div><h3 className="text-2xl font-bold text-white">Visão atual das vagas</h3><p className="mt-1 text-sm text-neutral-400">Contagens da estrutura persistida. Vaga sem leitura confirmada permanece indisponível.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{cartoes.map(([rotulo, quantidade, Icone]) => <div key={rotulo} className="rounded-2xl border border-white/10 bg-[#202020] p-4"><Icone className="size-5 text-[#ffe100]" aria-hidden="true"/><strong className="mt-3 block text-3xl text-white">{quantidade}</strong><span className="text-sm text-neutral-400">{rotulo}</span></div>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#202020] p-5"><p className="text-sm text-neutral-400">{vagas.length === 0 ? "A estrutura ainda não possui vagas." : "Consulte os setores e as vagas no mapa do estacionamento."}</p><Button asChild><Link to={`estrutura`}>Abrir estrutura e mapa</Link></Button></div>
  </section>
}

/** Mantém criação, edição e exclusão reversível dos acessos dentro da ficha selecionada. */
function GerentesShopping({ shoppingId, gerentes, recarregar }: { shoppingId: string; gerentes: GerenteAdmin[]; recarregar: () => Promise<void> }) {
  const { consultar } = useAppStore()
  const [editando, setEditando] = useState<GerenteAdmin | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [credencial, setCredencial] = useState<{ email: string; senha: string } | null>(null)
  const [gerenteParaExcluir, setGerenteParaExcluir] = useState<GerenteAdmin | null>(null)
  const [senhaCopiada, setSenhaCopiada] = useState(false)
  const tempoCopia = useRef<number | null>(null)
  useEffect(() => () => { if (tempoCopia.current) window.clearTimeout(tempoCopia.current) }, [])

  function exibirCredencial(email: string, senha: string) {
    setCredencial({ email, senha }); setSenhaCopiada(false)
  }

  async function copiarSenha() {
    if (!credencial) return
    try {
      await navigator.clipboard.writeText(credencial.senha)
      setSenhaCopiada(true)
      if (tempoCopia.current) window.clearTimeout(tempoCopia.current)
      tempoCopia.current = window.setTimeout(() => setSenhaCopiada(false), 2500)
    } catch {
      toast.error("Não foi possível copiar a senha. Selecione o texto e copie manualmente.")
    }
  }

  async function executar(acao: () => Promise<void>) { setOcupado(true); try { await acao() } catch (falha) { toast.error(falha instanceof Error ? falha.message : "Não foi possível concluir a operação.") } finally { setOcupado(false) } }
  function criar(evento: FormEvent<HTMLFormElement>) { evento.preventDefault(); const formulario = evento.currentTarget; const dados = new FormData(formulario); void executar(async () => { const resposta = await consultar(`/shoppings/${shoppingId}/gerentes`, { nome: dados.get("nome"), email: dados.get("email"), telefone: dados.get("telefone") }); if (!objeto(resposta) || !objeto(resposta.gerente) || typeof resposta.gerente.email !== "string" || typeof resposta.senhaProvisoria !== "string") throw new Error("A credencial criada é inválida."); exibirCredencial(resposta.gerente.email, resposta.senhaProvisoria); formulario.reset(); await recarregar() }) }
  function salvarEdicao(evento: FormEvent<HTMLFormElement>) { evento.preventDefault(); if (!editando) return; const dados = new FormData(evento.currentTarget); void executar(async () => { await consultar(`/gerentes/${editando.id}`, { nome: dados.get("nome"), telefone: dados.get("telefone") }, "PATCH"); setEditando(null); await recarregar(); toast.success("Dados do gerente atualizados.") }) }
  function alternar(gerente: GerenteAdmin) { void executar(async () => { await consultar(`/gerentes/${gerente.id}`, { ativo: !gerente.ativo }, "PATCH"); await recarregar() }) }
  function redefinir(gerente: GerenteAdmin) { void executar(async () => { const resposta = await consultar(`/gerentes/${gerente.id}/redefinir-senha`, {}); if (!objeto(resposta) || typeof resposta.senhaProvisoria !== "string") throw new Error("A nova senha não pôde ser exibida."); exibirCredencial(gerente.email, resposta.senhaProvisoria); await recarregar() }) }

  /** Exclui o acesso e oferece restauração durante a mesma janela aceita pelo backend. */
  function excluirGerente() {
    const gerente = gerenteParaExcluir
    if (!gerente) return
    void executar(async () => {
      const resposta = await consultar(`/gerentes/${gerente.id}`, undefined, "DELETE")
      if (!objeto(resposta) || typeof resposta.desfazerAte !== "string") throw new Error("A exclusão não pôde ser confirmada.")
      setGerenteParaExcluir(null)
      setCredencial(null)
      await recarregar()
      toast.success(`${gerente.nome} foi excluído.`, {
        description: "O acesso foi encerrado. Você tem sete segundos para desfazer.",
        duration: 7000,
        action: {
          label: "Desfazer",
          onClick: () => {
            void consultar(`/gerentes/${gerente.id}/desfazer-exclusao`, {}).then(async () => {
              await recarregar()
              toast.success(`${gerente.nome} foi restaurado(a).`)
            }).catch(falha => toast.error(falha instanceof Error ? falha.message : "Não foi possível desfazer a exclusão."))
          },
        },
      })
    })
  }

  return <section className="grid gap-5"><div><h3 className="text-2xl font-bold text-white">Gerentes</h3><p className="mt-1 text-sm text-neutral-400">Cada gerente recebe um acesso individual vinculado somente a este shopping.</p></div>
    {credencial && <div role="status" className="rounded-xl border border-[#ffe100]/40 bg-[#ffe100]/10 p-4 text-white"><strong>Senha provisória</strong><p className="mt-1 text-sm text-neutral-300">Exibida somente agora. Entregue-a ao gerente por um canal seguro.</p><div className="mt-3 flex flex-col gap-3 rounded-lg bg-black/30 p-3 sm:flex-row sm:items-center"><span className="min-w-0 flex-1"><span className="block break-all text-xs text-neutral-400">{credencial.email}</span><code className="mt-1 block break-all text-base text-white">{credencial.senha}</code></span><Button type="button" variant="outline" className="border-white/30 bg-transparent text-white" onClick={() => void copiarSenha()}>{senhaCopiada ? <Check aria-hidden="true"/> : <Copy aria-hidden="true"/>}{senhaCopiada ? "Senha copiada" : "Copiar senha"}</Button></div></div>}
    {gerentes.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-neutral-400">Nenhum gerente cadastrado.</p> : <div className="grid gap-4 md:grid-cols-2">{gerentes.map(gerente => <article key={gerente.id} className="rounded-2xl bg-[#ffe100] p-5 text-neutral-950"><div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-full bg-neutral-950 text-[#ffe100]"><UserRound aria-hidden="true"/></span><div className="min-w-0 flex-1"><strong className="block truncate uppercase">{gerente.nome}</strong><span className="block truncate text-sm">{gerente.email}</span><span className="mt-1 block text-xs">{gerente.ativo ? "Acesso ativo" : "Acesso bloqueado"} · {gerente.trocarSenhaObrigatoria ? "troca de senha pendente" : "senha redefinida"}</span></div></div><div className="mt-4 flex flex-wrap gap-2"><Button type="button" size="sm" className="bg-neutral-950 text-white hover:bg-neutral-800" onClick={() => setEditando(gerente)}>Editar dados</Button><Button type="button" size="sm" variant="outline" className="border-black/30 bg-transparent" disabled={ocupado} onClick={() => alternar(gerente)}>{gerente.ativo ? "Bloquear" : "Reativar"}</Button><Button type="button" size="sm" variant="outline" className="border-black/30 bg-transparent" disabled={ocupado || !gerente.ativo} onClick={() => redefinir(gerente)}>Redefinir senha</Button><Button type="button" size="sm" variant="destructive" disabled={ocupado} onClick={() => setGerenteParaExcluir(gerente)}><Trash2 aria-hidden="true"/>Excluir</Button></div></article>)}</div>}
    {editando && <form onSubmit={salvarEdicao} className="grid gap-4 rounded-2xl border border-[#ffe100]/30 bg-[#202020] p-5 sm:grid-cols-2"><h4 className="sm:col-span-2 font-bold text-white">Editar {editando.nome}</h4><div className="grid gap-2"><Label htmlFor="editar-gerente-nome" className="text-white">Nome</Label><Input id="editar-gerente-nome" name="nome" defaultValue={editando.nome} required className="h-11 border-white/15 bg-white/5 text-white"/></div><div className="grid gap-2"><Label htmlFor="editar-gerente-telefone" className="text-white">Telefone</Label><Input id="editar-gerente-telefone" name="telefone" defaultValue={editando.telefone ?? ""} className="h-11 border-white/15 bg-white/5 text-white"/></div><div className="flex gap-2 sm:col-span-2"><Button disabled={ocupado}>Salvar gerente</Button><Button type="button" variant="outline" className="border-white/20 bg-transparent text-white" onClick={() => setEditando(null)}>Cancelar</Button></div></form>}
    <form onSubmit={criar} className="grid gap-4 rounded-2xl border border-white/10 bg-[#202020] p-5 md:grid-cols-3"><h4 className="flex items-center gap-2 font-bold text-white md:col-span-3"><UsersRound className="text-[#ffe100]" aria-hidden="true"/>Adicionar gerente</h4><div className="grid gap-2"><Label htmlFor="gerente-nome" className="text-white">Nome</Label><Input id="gerente-nome" name="nome" required className="h-11 border-white/15 bg-white/5 text-white"/></div><div className="grid gap-2"><Label htmlFor="gerente-email" className="text-white">E-mail</Label><Input id="gerente-email" name="email" type="email" required className="h-11 border-white/15 bg-white/5 text-white"/></div><div className="grid gap-2"><Label htmlFor="gerente-telefone" className="text-white">Telefone</Label><Input id="gerente-telefone" name="telefone" className="h-11 border-white/15 bg-white/5 text-white"/></div><Button disabled={ocupado} className="h-11 md:col-span-3 md:w-fit"><Plus aria-hidden="true"/>Adicionar gerente</Button></form>
    <Dialog open={gerenteParaExcluir !== null} onOpenChange={aberto => { if (!aberto) setGerenteParaExcluir(null) }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Excluir acesso de gerente?</DialogTitle><DialogDescription>O acesso de {gerenteParaExcluir?.nome} será encerrado imediatamente. Depois da confirmação, você terá sete segundos para desfazer.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="button" variant="destructive" disabled={ocupado} onClick={excluirGerente}>{ocupado ? "Excluindo..." : "Sim, excluir"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
}

/** Carrega somente os dados necessários para a seção atual do shopping. */
function FichaShopping({ shoppingId, secao }: { shoppingId: string; secao: "resumo" | "estrutura" | "gerentes" }) {
  const { consultar, enviarArquivo } = useAppStore()
  const navigate = useNavigate()
  const [shopping, setShopping] = useState<ShoppingAdmin | null>(null)
  const [estrutura, setEstrutura] = useState<EstruturaEstacionamento | null>(null)
  const [gerentes, setGerentes] = useState<GerenteAdmin[]>([])
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState("")
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [importacaoAberta, setImportacaoAberta] = useState(false)
  const [revisaoEstrutura, setRevisaoEstrutura] = useState(0)
  const buscarDados = useCallback(() => Promise.all([
    consultar(`/shoppings/${shoppingId}`),
    secao === "gerentes" ? Promise.resolve(null) : consultar(`/shoppings/${shoppingId}/estrutura`),
    secao === "gerentes" ? consultar(`/shoppings/${shoppingId}/gerentes`) : Promise.resolve(null),
  ]), [consultar, shoppingId, secao])
  const carregar = useCallback(async () => { const [dadosShopping, dadosEstrutura, dadosGerentes] = await buscarDados(); setShopping(lerRespostaShopping(dadosShopping)); if (dadosEstrutura) setEstrutura(lerEstrutura(dadosEstrutura)); if (dadosGerentes) setGerentes(lerGerentesAdmin(dadosGerentes)) }, [buscarDados])
  useEffect(() => { let ativo = true; buscarDados().then(([a,b,c]) => { if (ativo) { setShopping(lerRespostaShopping(a)); if (b) setEstrutura(lerEstrutura(b)); if (c) setGerentes(lerGerentesAdmin(c)) } }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Não foi possível abrir a ficha.") }); return () => { ativo = false } }, [buscarDados])
  function salvar(dados: DadosShopping, _formulario: HTMLFormElement, foto: File | null) { setOcupado(true); setErro(""); void (async () => { try { await consultar(`/shoppings/${shoppingId}`, dados, "PATCH"); let falhaFoto: unknown = null; if (foto) { try { await enviarArquivo(`/shoppings/${shoppingId}/foto`, foto, foto.type) } catch (falha) { falhaFoto = falha } } await carregar(); if (falhaFoto) { setErro(falhaFoto instanceof Error ? `Dados atualizados, mas a foto não foi salva: ${falhaFoto.message}` : "Dados atualizados, mas a foto não foi salva."); return } toast.success(foto ? "Dados e foto do shopping atualizados." : "Dados do shopping atualizados.") } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar o shopping.") } finally { setOcupado(false) } })() }
  function removerFoto() { setOcupado(true); setErro(""); void consultar(`/shoppings/${shoppingId}/foto`, undefined, "DELETE").then(() => carregar()).then(() => toast.success("Foto removida.")).catch(falha => setErro(falha instanceof Error ? falha.message : "Não foi possível remover a foto.")).finally(() => setOcupado(false)) }
  function excluirShopping() { setOcupado(true); setErro(""); void consultar(`/shoppings/${shoppingId}`, undefined, "DELETE").then(() => { setConfirmarExclusao(false); toast.success(`${shopping?.nome ?? "O shopping"} foi excluído.`); navigate("/admin/shoppings", { replace: true }) }).catch(falha => setErro(falha instanceof Error ? falha.message : "Não foi possível excluir o shopping.")).finally(() => setOcupado(false)) }
  function recarregarAposImportacao() { setRevisaoEstrutura(revisao => revisao + 1); void carregar() }
  if (erro && !shopping) return <section className="mx-auto max-w-6xl"><p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">{erro}</p><Button asChild className="mt-4"><Link to="/admin/shoppings">Voltar aos shoppings</Link></Button></section>
  if (!shopping || (secao !== "gerentes" && !estrutura)) return <p role="status" className="text-neutral-300">Carregando {secao === "gerentes" ? "acessos" : "ficha"} do shopping...</p>
  return <section className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-10"><header className="flex min-w-0 flex-wrap items-center gap-4"><Button asChild variant="outline" size="icon" className="border-white/20 bg-transparent text-white"><Link to="/admin/shoppings" aria-label="Voltar aos shoppings"><ArrowLeft aria-hidden="true"/></Link></Button><FotoShopping nome={shopping.nome} imagemUrl={shopping.imagemUrl} className="size-16 rounded-2xl"/><div className="min-w-0 flex-1"><h2 className="break-words text-3xl font-black text-white">{shopping.nome}</h2><p className="mt-1 break-words text-sm text-neutral-400">{enderecoResumido(shopping)}</p></div><Badge className="bg-[#ffe100] text-black sm:ml-auto">{rotulosSituacao[shopping.situacaoImplantacao] ?? shopping.situacaoImplantacao}</Badge><Button type="button" variant="destructive" disabled={ocupado} onClick={() => setConfirmarExclusao(true)}><Trash2 aria-hidden="true"/>Excluir shopping</Button></header>
    {erro && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">{erro}</p>}
    {secao === "resumo" && <><div className="min-w-0 rounded-3xl border border-white/10 bg-[#202020] p-5 sm:p-8"><h3 className="mb-6 text-xl font-bold text-white">Dados da administração</h3><FormularioShopping key={shopping.id + JSON.stringify(shopping)} shopping={shopping} ocupado={ocupado} rotuloBotao="Salvar alterações" aoEnviar={salvar} aoRemoverFoto={removerFoto}/></div>{estrutura && <ResumoVagas estrutura={estrutura}/>}</>}
    {secao === "estrutura" && <><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-2xl font-bold text-white">Estrutura do estacionamento</h3><p className="mt-1 text-sm text-neutral-400">Configure andares, setores e vagas; depois confira o mapa.</p></div><div className="flex w-full flex-wrap gap-2 sm:w-auto"><Button type="button" variant="outline" onClick={() => setImportacaoAberta(true)}><Upload aria-hidden="true"/>Importar estrutura</Button><ExportacaoEstrutura estrutura={estrutura}/></div></div><EstruturaAdmin key={`${shoppingId}-${revisaoEstrutura}`} shoppingId={shoppingId} aoAlterar={() => { void carregar().catch(falha => setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar o resumo.")) }}/><Dialog open={importacaoAberta} onOpenChange={setImportacaoAberta}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl"><DialogHeader className="sr-only"><DialogTitle>Importar estrutura</DialogTitle><DialogDescription>Revise a prévia antes de aplicar mudanças nas vagas.</DialogDescription></DialogHeader><ImportacaoEstrutura shoppingId={shoppingId} aoConfirmar={recarregarAposImportacao}/></DialogContent></Dialog></>}
    {secao === "gerentes" && <GerentesShopping shoppingId={shoppingId} gerentes={gerentes} recarregar={carregar}/>}
    <Dialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
      <DialogContent>
        <DialogHeader><DialogTitle>Excluir shopping?</DialogTitle><DialogDescription>{shopping.nome} será retirado da administração e todos os acessos de gerente serão encerrados. A estrutura e o histórico permanecem preservados.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="button" variant="destructive" disabled={ocupado} onClick={excluirShopping}>{ocupado ? "Excluindo..." : "Sim, excluir shopping"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
}

/** Seleciona a tela pela rota para permitir links diretos e navegação previsível. */
export function AdminPage() {
  const { shoppingId } = useParams()
  const { pathname } = useLocation()
  const secao = pathname.endsWith("/estrutura") ? "estrutura" : pathname.endsWith("/gerentes") ? "gerentes" : "resumo"
  const titulo = shoppingId ? secao === "estrutura" ? "Estrutura e mapa" : secao === "gerentes" ? "Gerentes" : "Ficha do shopping" : pathname === "/admin/shoppings" ? "Shoppings" : "Cadastrar shopping"
  return <DashboardShell eyebrow="Administração VAGGU" title={titulo} shoppingId={shoppingId}><div className="painel-admin min-h-[calc(100vh-5rem)] min-w-0 overflow-x-hidden bg-[#f5f5f3] px-4 py-8 text-neutral-950 sm:px-7 lg:px-10 dark:bg-[#171717] dark:text-white">{shoppingId ? <FichaShopping key={`${shoppingId}-${secao}`} shoppingId={shoppingId} secao={secao}/> : pathname === "/admin/shoppings" ? <ListaShoppings/> : <CadastroShopping/>}</div></DashboardShell>
}
