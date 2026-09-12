/** Exige uma senha definitiva antes de qualquer acesso operacional. */
import { useRef, useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import "./login-page.css"

export function TrocarSenhaPage() {
  const { currentUser, trocarSenha, logout } = useAppStore()
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)
  const trava = useRef(false)
  if (!currentUser) return <Navigate to="/login" replace />
  if (!currentUser.trocarSenhaObrigatoria) return <Navigate to={currentUser.role === "admin" ? "/admin" : "/painel"} replace />

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (trava.current) return
    if (novaSenha !== confirmacao) { setErro("As novas senhas não coincidem."); return }
    if (novaSenha === senhaAtual) { setErro("Escolha uma senha diferente da senha provisória."); return }
    trava.current = true
    setEnviando(true)
    setErro("")
    try { await trocarSenha(senhaAtual, novaSenha) }
    catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível alterar sua senha.") }
    finally { trava.current = false; setEnviando(false) }
  }
  async function sair() {
    if (trava.current) return
    trava.current = true
    setEnviando(true)
    try { await logout() }
    catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível encerrar seu acesso.") }
    finally { trava.current = false; setEnviando(false) }
  }
  return <main className="pagina-login">
    <section className="login-formulario">
      <Brand />
      <div className="login-conteudo">
        <h1>Crie sua nova senha</h1>
        <p className="login-introducao">Para proteger seu acesso, substitua a senha provisória antes de continuar.</p>
        <form onSubmit={salvar} aria-busy={enviando}>
          <label htmlFor="senha-atual">Senha provisória</label>
          <input id="senha-atual" type="password" autoComplete="current-password" required maxLength={128} value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} disabled={enviando} />
          <label htmlFor="nova-senha">Nova senha</label>
          <input id="nova-senha" type="password" autoComplete="new-password" required minLength={12} maxLength={128} aria-describedby="regra-senha" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} disabled={enviando} />
          <p id="regra-senha" className="login-introducao">Use entre 12 e 128 caracteres.</p>
          <label htmlFor="confirmacao-senha">Confirme a nova senha</label>
          <input id="confirmacao-senha" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirmacao} onChange={e => setConfirmacao(e.target.value)} disabled={enviando} />
          {erro && <p className="login-erro" role="alert">{erro}</p>}
          <button className="login-enviar" disabled={enviando}>{enviando ? "Aguarde..." : "Salvar e continuar"}</button>
        </form>
        <button type="button" className="login-recuperar" disabled={enviando} onClick={() => void sair()}>Sair da conta</button>
      </div>
    </section>
    <aside className="login-apresentacao"><p className="login-manifesto">Seu espaço.<br /><strong>Seu acesso seguro.</strong></p></aside>
  </main>
}
