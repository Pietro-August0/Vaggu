/** Restaura a identidade pelo cookie HttpOnly; dados de conta continuam vindo da API. */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { ErroApi, objeto, requisitarApi, requisitarArquivoApi } from "@/servicos/api"
import type { UserAccount } from "@/types/app"

interface AppStoreValue {
  ready: boolean
  currentUser: UserAccount | null
  erroSessao: string
  mensagemSessao: string
  senhaProvisoriaPendente: string
  login: (email: string, senha: string) => Promise<UserAccount>
  logout: () => Promise<void>
  trocarSenha: (senhaAtual: string, novaSenha: string) => Promise<UserAccount>
  verificarSessao: () => Promise<void>
  consultar: (caminho: string, corpo?: unknown, metodo?: "GET" | "POST" | "PATCH" | "DELETE") => Promise<unknown>
  enviarArquivo: (caminho: string, arquivo: File, tipoConteudo: string) => Promise<unknown>
  atualizarMinhaConta: (nome: string, telefone: string) => Promise<UserAccount>
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

/** Aceita somente o DTO público e a combinação de perfil/vínculo definida no backend. */
function lerUsuario(dados: unknown): UserAccount {
  const usuario = objeto(dados) ? dados.usuario : null
  if (!objeto(usuario) || typeof usuario.id !== "string" || typeof usuario.nome !== "string"
    || typeof usuario.email !== "string" || typeof usuario.trocarSenhaObrigatoria !== "boolean"
    || !((usuario.perfil === "VAGGU" && usuario.shoppingId === null)
      || (usuario.perfil === "SHOPPING" && typeof usuario.shoppingId === "string" && usuario.shoppingId.length > 0))) {
    throw new ErroApi("RESPOSTA_INVALIDA", "Não foi possível confirmar seu acesso. Tente novamente.")
  }
  return {
    id: usuario.id, nome: usuario.nome, email: usuario.email,
    telefone: typeof usuario.telefone === "string" ? usuario.telefone : null,
    role: usuario.perfil === "VAGGU" ? "admin" : "shopping",
    mallId: typeof usuario.shoppingId === "string" ? usuario.shoppingId : undefined,
    trocarSenhaObrigatoria: usuario.trocarSenhaObrigatoria,
  }
}

/** Mantém somente identidade pública em memória e restaura a sessão no carregamento. */
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [expiraEm, setExpiraEm] = useState(0)
  const [erroSessao, setErroSessao] = useState("")
  const [mensagemSessao, setMensagemSessao] = useState("")
  const [senhaProvisoriaPendente, setSenhaProvisoriaPendente] = useState("")
  const versao = useRef(0)

  const limparSessao = useCallback((mensagem = "") => {
    versao.current++
    setCurrentUser(null)
    setExpiraEm(0)
    setErroSessao("")
    setMensagemSessao(mensagem)
    setSenhaProvisoriaPendente("")
  }, [])

  /** Não confunde senha atual incorreta com uma sessão revogada. */
  const consultar = useCallback(async (caminho: string, corpo?: unknown, metodo?: "GET" | "POST" | "PATCH" | "DELETE") => {
    const revisao = versao.current
    try {
      const dados = await requisitarApi(caminho, undefined, corpo, metodo)
      if (versao.current !== revisao) throw new ErroApi("SESSAO_ALTERADA", "O acesso foi encerrado. Entre novamente.")
      return dados
    } catch (erro) {
      if (versao.current === revisao && erro instanceof ErroApi) {
        if (erro.codigo === "NAO_AUTENTICADO") limparSessao("Sua sessão expirou ou foi encerrada. Entre novamente.")
        if (erro.codigo === "TROCA_SENHA_OBRIGATORIA") {
          setCurrentUser(usuario => usuario ? { ...usuario, trocarSenhaObrigatoria: true } : null)
        }
      }
      throw erro
    }
  }, [limparSessao])

  const verificarSessao = useCallback(async () => {
    const revisao = ++versao.current
    try {
      const resposta = await requisitarApi("/auth/me")
      const usuario = lerUsuario(resposta)
      if (versao.current === revisao) {
        setCurrentUser(usuario)
        if (objeto(resposta) && typeof resposta.expiraEm === "string") setExpiraEm(Date.parse(resposta.expiraEm))
        setErroSessao("")
      }
    } catch (erro) {
      if (versao.current === revisao) {
        if (erro instanceof ErroApi && erro.codigo === "NAO_AUTENTICADO") limparSessao()
        else setErroSessao(erro instanceof Error ? erro.message : "Não foi possível verificar seu acesso.")
      }
    }
  }, [limparSessao])

  useEffect(() => {
    let ativo = true
    queueMicrotask(() => { if (ativo) void verificarSessao().finally(() => { if (ativo) setReady(true) }) })
    return () => { ativo = false }
  }, [verificarSessao])

  /** Usa o cookie da mesma origem para arquivos e preserva as regras de revogação. */
  const enviarArquivo = useCallback(async (caminho: string, arquivo: File, tipoConteudo: string) => {
    const revisao = versao.current
    try {
      return await requisitarArquivoApi(caminho, arquivo, tipoConteudo)
    } catch (erro) {
      if (versao.current === revisao && erro instanceof ErroApi && erro.codigo === "NAO_AUTENTICADO") {
        limparSessao("Sua sessão expirou ou foi encerrada. Entre novamente.")
      }
      throw erro
    }
  }, [limparSessao])

  useEffect(() => {
    if (!expiraEm) return
    const prazo = window.setTimeout(() => limparSessao("Sua sessão expirou. Entre novamente."), Math.max(0, expiraEm - Date.now()))
    const intervalo = window.setInterval(() => { if (document.visibilityState === "visible") void verificarSessao() }, 30000)
    const aoRetornar = () => { if (document.visibilityState === "visible") void verificarSessao() }
    window.addEventListener("focus", aoRetornar)
    document.addEventListener("visibilitychange", aoRetornar)
    return () => {
      window.clearTimeout(prazo)
      window.clearInterval(intervalo)
      window.removeEventListener("focus", aoRetornar)
      document.removeEventListener("visibilitychange", aoRetornar)
    }
  }, [expiraEm, limparSessao, verificarSessao])

  /** Login nunca cai para dados demonstrativos caso o serviço esteja fora do ar. */
  async function login(email: string, senha: string) {
    const revisao = ++versao.current
    setSenhaProvisoriaPendente("")
    const dados = await requisitarApi("/auth/login", undefined, { email: email.trim().toLowerCase(), senha })
    if (!objeto(dados) || typeof dados.expiraEm !== "string"
      || !Number.isFinite(Date.parse(dados.expiraEm)) || Date.parse(dados.expiraEm) <= Date.now()) {
      throw new ErroApi("RESPOSTA_INVALIDA", "Não foi possível confirmar seu acesso. Tente novamente.")
    }
    const usuario = lerUsuario(await requisitarApi("/auth/me"))
    if (revisao !== versao.current) throw new ErroApi("SESSAO_ALTERADA", "Tente entrar novamente.")
    setCurrentUser(usuario)
    setExpiraEm(Date.parse(dados.expiraEm))
    setErroSessao("")
    setMensagemSessao("")
    // A senha permanece somente na memória desta aba e apenas durante a troca obrigatória.
    setSenhaProvisoriaPendente(usuario.trocarSenhaObrigatoria ? senha : "")
    return usuario
  }

  /** A navegação só anuncia saída após a revogação confirmada ou sessão já inválida. */
  async function logout() {
    if (!currentUser) return
    try {
      await consultar("/auth/logout", {})
      limparSessao()
    } catch (erro) {
      if (erro instanceof ErroApi && erro.codigo === "NAO_AUTENTICADO") return
      throw erro
    }
  }

  async function trocarSenha(senhaAtual: string, novaSenha: string) {
    const usuario = lerUsuario(await consultar("/auth/change-password", { senhaAtual, novaSenha }))
    versao.current++
    setCurrentUser(usuario)
    setErroSessao("")
    setSenhaProvisoriaPendente("")
    return usuario
  }

  /** Atualiza apenas os campos pessoais aceitos pelo backend e sincroniza a identidade exibida. */
  async function atualizarMinhaConta(nome: string, telefone: string) {
    const usuario = lerUsuario(await consultar("/minha-conta", { nome, telefone }, "PATCH"))
    setCurrentUser(usuario)
    return usuario
  }

  return <AppStoreContext.Provider value={{
    ready, currentUser, erroSessao, mensagemSessao, senhaProvisoriaPendente,
    login, logout, trocarSenha, verificarSessao, consultar, enviarArquivo, atualizarMinhaConta,
  }}>{children}</AppStoreContext.Provider>
}

/** Exige o provedor para evitar acesso fora do ciclo de sessão. */
export function useAppStore() {
  const contexto = useContext(AppStoreContext)
  if (!contexto) throw new Error("useAppStore requer AppStoreProvider.")
  return contexto
}
