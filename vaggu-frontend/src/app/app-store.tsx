/** Controla a identidade validada pela API. Não lê contas, hashes ou permissões do navegador. */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { ErroApi, objeto, requisitarApi } from "@/servicos/api"
import type { GeneratedAccess, Mall, NewMallInput, UserAccount } from "@/types/app"

interface AppStoreValue {
  ready: boolean
  currentUser: UserAccount | null
  currentMall: Mall | null
  malls: Mall[]
  erroSessao: string
  mensagemSessao: string
  login: (email: string, senha: string) => Promise<UserAccount>
  logout: () => Promise<void>
  trocarSenha: (senhaAtual: string, novaSenha: string) => Promise<UserAccount>
  verificarSessao: () => Promise<void>
  consultar: (caminho: string, corpo?: unknown, metodo?: "GET" | "POST" | "PATCH") => Promise<unknown>
  atualizarMinhaConta: (nome: string, telefone: string) => Promise<UserAccount>
  createMall: (input: NewMallInput) => Promise<GeneratedAccess>
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

/** Mantém a sessão na aba; recarregar a página exige novo login, conforme o contrato atual. */
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [expiraEm, setExpiraEm] = useState(0)
  const [erroSessao, setErroSessao] = useState("")
  const [mensagemSessao, setMensagemSessao] = useState("")
  const tokenAtual = useRef<string | null>(null)
  const versao = useRef(0)

  const limparSessao = useCallback((mensagem = "") => {
    versao.current++
    tokenAtual.current = null
    setCurrentUser(null)
    setExpiraEm(0)
    setErroSessao("")
    setMensagemSessao(mensagem)
  }, [])

  /** Não confunde senha atual incorreta com uma sessão revogada. */
  const consultar = useCallback(async (caminho: string, corpo?: unknown, metodo?: "GET" | "POST" | "PATCH") => {
    const token = tokenAtual.current
    if (!token) throw new ErroApi("NAO_AUTENTICADO", "Entre novamente para continuar.")
    try {
      const dados = await requisitarApi(caminho, token, corpo, metodo)
      if (tokenAtual.current !== token) throw new ErroApi("SESSAO_ALTERADA", "O acesso foi encerrado. Entre novamente.")
      return dados
    } catch (erro) {
      if (tokenAtual.current === token && erro instanceof ErroApi) {
        if (erro.codigo === "NAO_AUTENTICADO") limparSessao("Sua sessão expirou ou foi encerrada. Entre novamente.")
        if (erro.codigo === "TROCA_SENHA_OBRIGATORIA") {
          setCurrentUser(usuario => usuario ? { ...usuario, trocarSenhaObrigatoria: true } : null)
        }
      }
      throw erro
    }
  }, [limparSessao])

  const verificarSessao = useCallback(async () => {
    const token = tokenAtual.current
    if (!token) return
    const revisao = ++versao.current
    try {
      const usuario = lerUsuario(await consultar("/auth/me"))
      if (tokenAtual.current === token && versao.current === revisao) {
        setCurrentUser(usuario)
        setErroSessao("")
      }
    } catch (erro) {
      if (tokenAtual.current === token && versao.current === revisao) {
        setErroSessao(erro instanceof Error ? erro.message : "Não foi possível verificar seu acesso.")
      }
    }
  }, [consultar])

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
    const dados = await requisitarApi("/auth/login", undefined, { email: email.trim().toLowerCase(), senha })
    if (!objeto(dados) || typeof dados.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(dados.token)
      || dados.tipo !== "Bearer" || typeof dados.expiraEm !== "string"
      || !Number.isFinite(Date.parse(dados.expiraEm)) || Date.parse(dados.expiraEm) <= Date.now()) {
      throw new ErroApi("RESPOSTA_INVALIDA", "Não foi possível confirmar seu acesso. Tente novamente.")
    }
    const usuario = lerUsuario(await requisitarApi("/auth/me", dados.token))
    if (revisao !== versao.current) throw new ErroApi("SESSAO_ALTERADA", "Tente entrar novamente.")
    tokenAtual.current = dados.token
    setCurrentUser(usuario)
    setExpiraEm(Date.parse(dados.expiraEm))
    setErroSessao("")
    setMensagemSessao("")
    return usuario
  }

  /** A navegação só anuncia saída após a revogação confirmada ou sessão já inválida. */
  async function logout() {
    if (!tokenAtual.current) return
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
    return usuario
  }

  /** Atualiza apenas os campos pessoais aceitos pelo backend e sincroniza a identidade exibida. */
  async function atualizarMinhaConta(nome: string, telefone: string) {
    const usuario = lerUsuario(await consultar("/minha-conta", { nome, telefone }, "PATCH"))
    setCurrentUser(usuario)
    return usuario
  }

  /** Compatibilidade temporária com a antiga tela: nunca cria contas locais como alternativa à API. */
  async function createMall(_input: NewMallInput): Promise<GeneratedAccess> {
    void _input
    throw new Error("O cadastro de shoppings estará disponível após a integração administrativa.")
  }

  return <AppStoreContext.Provider value={{
    ready: true, currentUser, currentMall: null, malls: [], erroSessao, mensagemSessao,
    login, logout, trocarSenha, verificarSessao, consultar, atualizarMinhaConta, createMall,
  }}>{children}</AppStoreContext.Provider>
}

/** Exige o provedor para evitar acesso fora do ciclo de sessão. */
export function useAppStore() {
  const contexto = useContext(AppStoreContext)
  if (!contexto) throw new Error("useAppStore requer AppStoreProvider.")
  return contexto
}
