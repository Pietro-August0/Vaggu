/** Exige uma senha definitiva antes de qualquer acesso operacional. */
import { Check, Eye, EyeOff, X } from "lucide-react"
import { useRef, useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { useAppStore } from "@/app/app-store"
import { Brand } from "@/components/brand"
import { ErroApi } from "@/servicos/api"
import "./login-page.css"

type CampoSenha = "senhaAtual" | "novaSenha" | "confirmacao"
type ErrosSenha = Partial<Record<CampoSenha, string>>

const requisitosSenha = [
  { id: "tamanho", texto: "Entre 12 e 128 caracteres", testar: (senha: string) => senha.length >= 12 && senha.length <= 128 },
  { id: "minuscula", texto: "Uma letra minúscula", testar: (senha: string) => /\p{Ll}/u.test(senha) },
  { id: "maiuscula", texto: "Uma letra maiúscula", testar: (senha: string) => /\p{Lu}/u.test(senha) },
  { id: "numero", texto: "Um número", testar: (senha: string) => /\p{N}/u.test(senha) },
  { id: "simbolo", texto: "Um símbolo, como !, @ ou #", testar: (senha: string) => /[^\p{L}\p{N}\s]/u.test(senha) },
  { id: "espaco", texto: "Sem espaços", testar: (senha: string) => senha.length > 0 && !/\s/u.test(senha) },
] as const

const codigosNovaSenha = new Set([
  "SENHA_CURTA", "SENHA_LONGA", "SENHA_COM_ESPACO", "SENHA_SEM_MINUSCULA",
  "SENHA_SEM_MAIUSCULA", "SENHA_SEM_NUMERO", "SENHA_SEM_SIMBOLO", "SENHA_REPETIDA",
])

export function TrocarSenhaPage() {
  const { ready, currentUser, trocarSenha, logout, senhaProvisoriaPendente } = useAppStore()
  const [senhaAtual, setSenhaAtual] = useState(senhaProvisoriaPendente)
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [visiveis, setVisiveis] = useState<Record<CampoSenha, boolean>>({ senhaAtual: false, novaSenha: false, confirmacao: false })
  const [erros, setErros] = useState<ErrosSenha>({})
  const [erroGeral, setErroGeral] = useState("")
  const [enviando, setEnviando] = useState(false)
  const trava = useRef(false)
  if (!ready) return <main className="grid min-h-screen place-items-center" role="status">Verificando seu acesso...</main>
  if (!currentUser) return <Navigate to="/login" replace />
  if (!currentUser.trocarSenhaObrigatoria) return <Navigate to={currentUser.role === "admin" ? "/admin" : "/painel"} replace />

  function alternarVisibilidade(campo: CampoSenha) {
    setVisiveis(estado => ({ ...estado, [campo]: !estado[campo] }))
  }

  function limparErro(campo: CampoSenha) {
    setErros(estado => ({ ...estado, [campo]: undefined }))
    setErroGeral("")
  }

  function validarFormulario() {
    const proximosErros: ErrosSenha = {}
    if (!senhaAtual) proximosErros.senhaAtual = "Digite a senha provisória recebida."
    const requisitosPendentes = requisitosSenha.filter(requisito => !requisito.testar(novaSenha))
    if (!novaSenha) proximosErros.novaSenha = "Crie uma nova senha."
    else if (novaSenha === senhaAtual) proximosErros.novaSenha = "A nova senha deve ser diferente da senha provisória."
    else if (requisitosPendentes.length) proximosErros.novaSenha = "Atenda a todos os requisitos indicados abaixo."
    if (!confirmacao) proximosErros.confirmacao = "Digite novamente a nova senha."
    else if (novaSenha !== confirmacao) proximosErros.confirmacao = "A confirmação não coincide com a nova senha."
    setErros(proximosErros)
    return Object.keys(proximosErros).length === 0
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (trava.current || !validarFormulario()) return
    trava.current = true
    setEnviando(true)
    setErroGeral("")
    try {
      await trocarSenha(senhaAtual, novaSenha)
    } catch (falha) {
      if (falha instanceof ErroApi && falha.codigo === "CREDENCIAIS_INVALIDAS") {
        setErros(estado => ({ ...estado, senhaAtual: falha.message }))
      } else if (falha instanceof ErroApi && codigosNovaSenha.has(falha.codigo)) {
        setErros(estado => ({ ...estado, novaSenha: falha.message }))
      } else {
        setErroGeral(falha instanceof Error ? falha.message : "Não foi possível alterar sua senha.")
      }
    } finally {
      trava.current = false
      setEnviando(false)
    }
  }

  async function sair() {
    if (trava.current) return
    trava.current = true
    setEnviando(true)
    setErroGeral("")
    try { await logout() }
    catch (falha) { setErroGeral(falha instanceof Error ? falha.message : "Não foi possível encerrar seu acesso.") }
    finally { trava.current = false; setEnviando(false) }
  }

  function campoSenha(campo: CampoSenha, rotulo: string, valor: string, atualizar: (valor: string) => void, autocomplete: string) {
    const erro = erros[campo]
    return <>
      <label htmlFor={campo}>{rotulo}</label>
      <div className="login-senha">
        <input
          id={campo}
          name={campo}
          type={visiveis[campo] ? "text" : "password"}
          autoComplete={autocomplete}
          maxLength={128}
          value={valor}
          onChange={evento => { atualizar(evento.target.value); limparErro(campo) }}
          aria-invalid={Boolean(erro)}
          aria-describedby={[campo === "novaSenha" ? "requisitos-senha" : "", erro ? `${campo}-erro` : ""].filter(Boolean).join(" ") || undefined}
          disabled={enviando}
        />
        <button type="button" className="login-olho" aria-label={visiveis[campo] ? `Ocultar ${rotulo.toLowerCase()}` : `Mostrar ${rotulo.toLowerCase()}`} aria-pressed={visiveis[campo]} onClick={() => alternarVisibilidade(campo)} disabled={enviando}>
          {visiveis[campo] ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
        </button>
      </div>
      {erro && <p id={`${campo}-erro`} className="login-erro-campo" role="alert">{erro}</p>}
    </>
  }

  return <main className="pagina-login">
    <section className="login-formulario">
      <Brand />
      <div className="login-conteudo login-conteudo-senha">
        <h1>Crie sua nova senha</h1>
        <p className="login-introducao">Para proteger seu acesso, substitua a senha provisória antes de continuar.</p>
        <form onSubmit={salvar} aria-busy={enviando} noValidate>
          {campoSenha("senhaAtual", "Senha provisória", senhaAtual, setSenhaAtual, "current-password")}
          {campoSenha("novaSenha", "Nova senha", novaSenha, setNovaSenha, "new-password")}
          <ul id="requisitos-senha" className="login-requisitos" aria-label="Requisitos da nova senha">
            {requisitosSenha.map(requisito => {
              const atendido = requisito.testar(novaSenha)
              return <li key={requisito.id} className={atendido ? "atendido" : undefined}>
                {atendido ? <Check aria-hidden="true" size={16} /> : <X aria-hidden="true" size={16} />}{requisito.texto}
              </li>
            })}
          </ul>
          {campoSenha("confirmacao", "Confirme a nova senha", confirmacao, setConfirmacao, "new-password")}
          {confirmacao && novaSenha === confirmacao && <p className="login-confirmacao-ok"><Check aria-hidden="true" size={16} />As senhas coincidem.</p>}
          {erroGeral && <p className="login-erro" role="alert">{erroGeral}</p>}
          <button className="login-enviar" type="submit" disabled={enviando}>{enviando ? "Salvando..." : "Salvar e continuar"}</button>
        </form>
        <button type="button" className="login-recuperar" disabled={enviando} onClick={() => void sair()}>Sair da conta</button>
      </div>
    </section>
    <aside className="login-apresentacao"><p className="login-manifesto">Seu espaço.<br /><strong>Seu acesso seguro.</strong></p></aside>
  </main>
}
