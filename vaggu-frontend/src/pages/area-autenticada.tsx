/** Área autenticada do P03: administra shoppings e acessos ou permite editar a própria conta. */
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { objeto } from "@/servicos/api"
import { EstruturaAdmin } from "@/components/estrutura-admin"
import { MapaEstacionamento } from "@/components/mapa-estacionamento"

interface ShoppingResumo { id: string; nome: string; endereco: string | null; ativo: boolean; totalGerentes: number }
interface GerenteResumo { id: string; nome: string; email: string; telefone: string | null; ativo: boolean; trocarSenhaObrigatoria: boolean }

/** Valida a coleção de shoppings recebida da API. */
function lerShoppings(dados: unknown): ShoppingResumo[] {
  if (!objeto(dados) || !Array.isArray(dados.shoppings)) throw new Error("Não foi possível consultar os shoppings.")
  return dados.shoppings.map(valor => {
    if (!objeto(valor) || typeof valor.id !== "string" || typeof valor.nome !== "string" || typeof valor.ativo !== "boolean" || typeof valor.totalGerentes !== "number") throw new Error("Não foi possível consultar os shoppings.")
    return { id: valor.id, nome: valor.nome, endereco: typeof valor.endereco === "string" ? valor.endereco : null, ativo: valor.ativo, totalGerentes: valor.totalGerentes }
  })
}

/** Valida gerentes com estado explícito para bloquear e reativar cada acesso. */
function lerGerentes(dados: unknown): GerenteResumo[] {
  if (!objeto(dados) || !Array.isArray(dados.gerentes)) throw new Error("Não foi possível consultar os gerentes.")
  return dados.gerentes.map(valor => {
    if (!objeto(valor) || typeof valor.id !== "string" || typeof valor.nome !== "string" || typeof valor.email !== "string" || typeof valor.ativo !== "boolean" || typeof valor.trocarSenhaObrigatoria !== "boolean") throw new Error("Não foi possível consultar os gerentes.")
    return { id: valor.id, nome: valor.nome, email: valor.email, telefone: typeof valor.telefone === "string" ? valor.telefone : null, ativo: valor.ativo, trocarSenhaObrigatoria: valor.trocarSenhaObrigatoria }
  })
}

/** Cadastro e seleção de shopping, seguidos pela gestão dos acessos vinculados. */
function PainelAdmin() {
  const { consultar } = useAppStore()
  const [shoppings, setShoppings] = useState<ShoppingResumo[] | null>(null)
  const [shoppingId, setShoppingId] = useState("")
  const [gerentes, setGerentes] = useState<GerenteResumo[] | null>(null)
  const [erro, setErro] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [credencial, setCredencial] = useState<{ email: string; senha: string } | null>(null)

  const carregarShoppings = useCallback(async () => {
    const lista = lerShoppings(await consultar("/shoppings"))
    setShoppings(lista)
    setShoppingId(atual => atual || lista[0]?.id || "")
  }, [consultar])
  const carregarGerentes = useCallback(async (id: string) => {
    if (!id) return setGerentes([])
    setGerentes(lerGerentes(await consultar(`/shoppings/${id}/gerentes`)))
  }, [consultar])

  useEffect(() => {
    let ativo = true
    consultar("/shoppings").then(lerShoppings).then(lista => {
      if (ativo) { setShoppings(lista); setShoppingId(atual => atual || lista[0]?.id || "") }
    }).catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao consultar.") })
    return () => { ativo = false }
  }, [consultar])
  useEffect(() => {
    let ativo = true
    if (shoppingId) consultar(`/shoppings/${shoppingId}/gerentes`).then(lerGerentes).then(lista => { if (ativo) setGerentes(lista) })
      .catch(falha => { if (ativo) setErro(falha instanceof Error ? falha.message : "Falha ao consultar.") })
    return () => { ativo = false }
  }, [consultar, shoppingId])

  async function executar(acao: () => Promise<void>) {
    setOcupado(true); setErro(""); setCredencial(null)
    try { await acao() } catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível concluir a operação.") }
    finally { setOcupado(false) }
  }

  function criarShopping(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); const elemento = evento.currentTarget; const formulario = new FormData(elemento)
    void executar(async () => { await consultar("/shoppings", { nome: formulario.get("nome"), endereco: formulario.get("endereco") }); elemento.reset(); await carregarShoppings() })
  }
  function criarGerente(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); const elemento = evento.currentTarget; const formulario = new FormData(elemento)
    void executar(async () => {
      const dados = await consultar(`/shoppings/${shoppingId}/gerentes`, { nome: formulario.get("nome"), email: formulario.get("email"), telefone: formulario.get("telefone") })
      if (!objeto(dados) || !objeto(dados.gerente) || typeof dados.gerente.email !== "string" || typeof dados.senhaProvisoria !== "string") throw new Error("A credencial criada não pôde ser confirmada.")
      setCredencial({ email: dados.gerente.email, senha: dados.senhaProvisoria }); elemento.reset()
      await Promise.all([carregarGerentes(shoppingId), carregarShoppings()])
    })
  }
  function alterarStatus(gerente: GerenteResumo) {
    void executar(async () => { await consultar(`/gerentes/${gerente.id}`, { ativo: !gerente.ativo }, "PATCH"); await carregarGerentes(shoppingId) })
  }
  function redefinirSenha(gerente: GerenteResumo) {
    void executar(async () => {
      const dados = await consultar(`/gerentes/${gerente.id}/redefinir-senha`, {})
      if (!objeto(dados) || typeof dados.senhaProvisoria !== "string") throw new Error("A nova senha não pôde ser exibida.")
      setCredencial({ email: gerente.email, senha: dados.senhaProvisoria }); await carregarGerentes(shoppingId)
    })
  }

  return <section className="grid max-w-6xl gap-6">
    {erro && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{erro}</div>}
    {credencial && <div role="status" className="rounded-xl border border-yellow-300 bg-yellow-50 p-4"><strong>Guarde e entregue esta senha uma única vez.</strong><p className="mt-2 break-all">{credencial.email} · <code>{credencial.senha}</code></p></div>}
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
      <div className="rounded-2xl bg-white p-6"><h2 className="text-xl font-semibold">Shoppings cadastrados</h2>
        {shoppings === null ? <p role="status" className="mt-4">Carregando...</p> : shoppings.length === 0 ? <p className="mt-4 text-neutral-600">Nenhum shopping cadastrado.</p>
          : <div className="mt-4 grid gap-2">{shoppings.map(shopping => <button key={shopping.id} type="button" onClick={() => setShoppingId(shopping.id)} className={`rounded-xl border p-4 text-left ${shoppingId === shopping.id ? "border-yellow-400 bg-yellow-50" : "border-neutral-200"}`}><span className="flex justify-between gap-3"><strong>{shopping.nome}</strong><Badge variant="secondary">{shopping.totalGerentes} gerente(s)</Badge></span><span className="mt-1 block text-sm text-neutral-600">{shopping.endereco || "Endereço não informado"}</span></button>)}</div>}
      </div>
      <form className="rounded-2xl bg-white p-6" onSubmit={criarShopping}><h2 className="text-xl font-semibold">Cadastrar shopping</h2>
        <div className="mt-4 grid gap-2"><Label htmlFor="shopping-nome">Nome</Label><Input id="shopping-nome" name="nome" required minLength={2} maxLength={120} /></div>
        <div className="mt-4 grid gap-2"><Label htmlFor="shopping-endereco">Endereço</Label><Input id="shopping-endereco" name="endereco" maxLength={200} /></div><Button className="mt-5" disabled={ocupado}>Cadastrar shopping</Button>
      </form>
    </div>
    {shoppingId && <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <div className="rounded-2xl bg-white p-6"><h2 className="text-xl font-semibold">Acessos de gerentes</h2>
        {gerentes === null ? <p role="status" className="mt-4">Carregando acessos...</p> : gerentes.length === 0 ? <p className="mt-4 text-neutral-600">Nenhum gerente cadastrado neste shopping.</p>
          : <ul className="mt-4 divide-y divide-neutral-200">{gerentes.map(gerente => <li key={gerente.id} className="py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{gerente.nome}</strong><p className="text-sm text-neutral-600">{gerente.email}{gerente.telefone ? ` · ${gerente.telefone}` : ""}</p></div><Badge variant={gerente.ativo ? "default" : "destructive"}>{gerente.ativo ? "Ativo" : "Bloqueado"}</Badge></div><div className="mt-3 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" disabled={ocupado} onClick={() => alterarStatus(gerente)}>{gerente.ativo ? "Bloquear" : "Reativar"}</Button><Button type="button" size="sm" variant="outline" disabled={ocupado || !gerente.ativo} onClick={() => redefinirSenha(gerente)}>Redefinir senha</Button></div></li>)}</ul>}
      </div>
      <form className="rounded-2xl bg-white p-6" onSubmit={criarGerente}><h2 className="text-xl font-semibold">Criar acesso individual</h2>
        <div className="mt-4 grid gap-2"><Label htmlFor="gerente-nome">Nome</Label><Input id="gerente-nome" name="nome" required minLength={2} maxLength={120} /></div>
        <div className="mt-4 grid gap-2"><Label htmlFor="gerente-email">E-mail</Label><Input id="gerente-email" name="email" type="email" required maxLength={254} /></div>
        <div className="mt-4 grid gap-2"><Label htmlFor="gerente-telefone">Telefone</Label><Input id="gerente-telefone" name="telefone" maxLength={40} /></div><Button className="mt-5" disabled={ocupado}>Criar acesso</Button>
      </form>
    </div>}
    {shoppingId && <EstruturaAdmin shoppingId={shoppingId} />}
  </section>
}

/** Minha conta usa o usuário da sessão e não aceita selecionar outro ID. */
function MinhaConta() {
  const { currentUser, atualizarMinhaConta } = useAppStore()
  const [mensagem, setMensagem] = useState(""); const [erro, setErro] = useState(""); const [ocupado, setOcupado] = useState(false)
  if (!currentUser) return null
  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); setOcupado(true); setErro(""); setMensagem(""); const dados = new FormData(evento.currentTarget)
    try { await atualizarMinhaConta(String(dados.get("nome") ?? ""), String(dados.get("telefone") ?? "")); setMensagem("Dados atualizados.") }
    catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar seus dados.") } finally { setOcupado(false) }
  }
  return <section className="max-w-2xl rounded-2xl bg-white p-6"><h2 className="text-xl font-semibold">Minha conta</h2><p className="mt-2 text-sm text-neutral-600">O e-mail e o vínculo com o shopping são administrados pela equipe VAGGU.</p>
    <form className="mt-6 grid gap-4" onSubmit={salvar}><div className="grid gap-2"><Label htmlFor="conta-nome">Nome</Label><Input id="conta-nome" name="nome" defaultValue={currentUser.nome} required minLength={2} maxLength={120} /></div><div className="grid gap-2"><Label htmlFor="conta-email">E-mail</Label><Input id="conta-email" value={currentUser.email} disabled /></div><div className="grid gap-2"><Label htmlFor="conta-telefone">Telefone</Label><Input id="conta-telefone" name="telefone" defaultValue={currentUser.telefone ?? ""} maxLength={40} /></div>{erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}{mensagem && <p role="status" className="text-sm text-green-700">{mensagem}</p>}<Button className="w-fit" disabled={ocupado}>{ocupado ? "Salvando..." : "Salvar dados"}</Button></form>
  </section>
}

/** Direciona cada perfil para as operações permitidas. */
export function AreaAutenticada() {
  const { currentUser } = useAppStore(); if (!currentUser) return null; const admin = currentUser.role === "admin"
  return <DashboardShell eyebrow={admin ? "Administração VAGGU" : "Área do cliente"} title={admin ? "Gestão de shoppings e acessos" : "Painel do shopping"}>{admin ? <PainelAdmin /> : <div className="grid max-w-6xl gap-6"><MapaEstacionamento/><MinhaConta /></div>}</DashboardShell>
}
