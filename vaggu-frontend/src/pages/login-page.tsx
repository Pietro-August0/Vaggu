/** Entrada única para Admin e gerente; composição baseada no frame Figma 2580:30. */
import { Eye, EyeOff } from "lucide-react"
import { useRef, useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import { WHATSAPP_SUPPORT_URL } from "@/lib/constants"
import "./login-page.css"

/** Não exibe nem preenche contas de demonstração; erros de rede não concedem acesso. */
export function LoginPage() {
  const { currentUser, login, mensagemSessao } = useAppStore()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [ajuda, setAjuda] = useState(false)
  const envioAtivo = useRef(false)
  if (currentUser) return <Navigate replace to={currentUser.trocarSenhaObrigatoria ? "/trocar-senha" : currentUser.role === "admin" ? "/admin" : "/painel"} />

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (envioAtivo.current) return
    envioAtivo.current = true
    setEnviando(true)
    setErro("")
    try { await login(email, senha) }
    catch (falha) { setErro(falha instanceof Error ? falha.message : "Não foi possível entrar. Tente novamente.") }
    finally { envioAtivo.current = false; setEnviando(false) }
  }

  return <main className="pagina-login">
    <section className="login-formulario" aria-labelledby="titulo-login">
      <header className="login-marca"><Brand /></header>
      <div className="login-conteudo">
        <h1 id="titulo-login">Acesse a VAGGU</h1>
        <p className="login-introducao">Use as credenciais enviadas pela equipe VAGGU.</p>
        <form onSubmit={entrar} aria-busy={enviando}>
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="username" maxLength={254} placeholder="Digite seu e-mail" value={email} onChange={evento => setEmail(evento.target.value)} required disabled={enviando} />
          <label htmlFor="senha">Senha</label>
          <div className="login-senha">
            <input id="senha" name="senha" type={mostrarSenha ? "text" : "password"} autoComplete="current-password" maxLength={128} placeholder="Digite sua senha" value={senha} onChange={evento => setSenha(evento.target.value)} required disabled={enviando} />
            <button type="button" className="login-olho" aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} aria-pressed={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}</button>
          </div>
          <button type="button" className="login-recuperar" onClick={() => setAjuda(!ajuda)} aria-expanded={ajuda} aria-controls="ajuda-acesso">Esqueci minha senha</button>
          {ajuda && <p id="ajuda-acesso" className="login-aviso">Solicite a redefinição à equipe VAGGU pelo canal de atendimento utilizado na sua parceria.{WHATSAPP_SUPPORT_URL && <> <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer">Falar no WhatsApp</a></>}</p>}
          {(erro || mensagemSessao) && <p className="login-erro" role="alert">{erro || mensagemSessao}</p>}
          <button className="login-enviar" type="submit" disabled={enviando}>{enviando ? "Entrando..." : "Entrar no painel"}</button>
        </form>
      </div>
      <footer className="login-suporte"><p>Está sem acesso?</p>
        {WHATSAPP_SUPPORT_URL ? <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer">Falar no WhatsApp</a> : <button type="button" onClick={() => setAjuda(true)}>Fale com a equipe VAGGU</button>}
        <Link className="login-voltar" to="/">Voltar para o site</Link>
      </footer>
    </section>
    <aside className="login-apresentacao" aria-label="Sobre a VAGGU">
      <img className="login-foto" src="/assets/vaggu-foto-homem-login-sem-fundo.png" alt="" aria-hidden="true" />
      <p className="login-manifesto">Não é sobre<br /><strong>ter mais <span className="login-vagas">vagas<img src="/assets/vaggu-circulado.png" alt="" aria-hidden="true" /></span>,</strong> é sobre gerenciar cada espaço com inteligência e segurança.</p>
      <div className="login-parceria"><span>Acesso enviado pelo WhatsApp</span><p>O shopping é tratado com nosso<br />time pelo WhatsApp.</p></div>
    </aside>
  </main>
}
