/** Permite trocar a própria senha dentro da sessão, com validação acessível e feedback por campo. */
import { Check, Eye, EyeOff, ShieldCheck, X } from "lucide-react"
import { useRef, useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErroApi } from "@/servicos/api"
import { codigosNovaSenha, requisitosSenha, validarTrocaDeSenha } from "@/servicos/politica-senha"

type CampoSenha = "senhaAtual" | "novaSenha" | "confirmacao"
type ErrosSenha = Partial<Record<CampoSenha, string>>

export function FormularioAlterarSenha() {
  const { trocarSenha } = useAppStore()
  const [valores, setValores] = useState<Record<CampoSenha, string>>({ senhaAtual: "", novaSenha: "", confirmacao: "" })
  const [visiveis, setVisiveis] = useState<Record<CampoSenha, boolean>>({ senhaAtual: false, novaSenha: false, confirmacao: false })
  const [erros, setErros] = useState<ErrosSenha>({})
  const [mensagem, setMensagem] = useState("")
  const [erroGeral, setErroGeral] = useState("")
  const [enviando, setEnviando] = useState(false)
  const trava = useRef(false)

  function atualizar(campo: CampoSenha, valor: string) {
    setValores(estado => ({ ...estado, [campo]: valor }))
    setErros(estado => ({ ...estado, [campo]: undefined }))
    setMensagem("")
    setErroGeral("")
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (trava.current) return
    const proximosErros = validarTrocaDeSenha(valores.senhaAtual, valores.novaSenha, valores.confirmacao)
    setErros(proximosErros)
    if (Object.keys(proximosErros).length > 0) return

    trava.current = true
    setEnviando(true)
    setMensagem("")
    setErroGeral("")
    try {
      await trocarSenha(valores.senhaAtual, valores.novaSenha)
      setValores({ senhaAtual: "", novaSenha: "", confirmacao: "" })
      setMensagem("Senha alterada com segurança.")
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

  function campo(campoId: CampoSenha, rotulo: string, autocomplete: string) {
    const erro = erros[campoId]
    return <div className="grid gap-2">
      <Label htmlFor={`conta-${campoId}`}>{rotulo}</Label>
      <div className="relative">
        <Input
          id={`conta-${campoId}`}
          name={campoId}
          type={visiveis[campoId] ? "text" : "password"}
          autoComplete={autocomplete}
          className="pr-11"
          maxLength={128}
          value={valores[campoId]}
          onChange={evento => atualizar(campoId, evento.target.value)}
          aria-invalid={Boolean(erro)}
          aria-describedby={[campoId === "novaSenha" ? "conta-requisitos-senha" : "", erro ? `conta-${campoId}-erro` : ""].filter(Boolean).join(" ") || undefined}
          disabled={enviando}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-neutral-500 transition hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe100] dark:text-neutral-400 dark:hover:text-white"
          aria-label={visiveis[campoId] ? `Ocultar ${rotulo.toLowerCase()}` : `Mostrar ${rotulo.toLowerCase()}`}
          aria-pressed={visiveis[campoId]}
          onClick={() => setVisiveis(estado => ({ ...estado, [campoId]: !estado[campoId] }))}
          disabled={enviando}
        >
          {visiveis[campoId] ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
      {erro ? <p id={`conta-${campoId}-erro`} role="alert" className="text-sm text-red-700 dark:text-red-300">{erro}</p> : null}
    </div>
  }

  return <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#242424] dark:text-white">
    <div className="flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ffe100] text-neutral-950"><ShieldCheck aria-hidden="true" /></span>
      <div><h2 className="text-xl font-semibold">Segurança</h2><p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">Troque sua senha sempre que precisar. A senha atual é exigida para confirmar sua identidade.</p></div>
    </div>
    <form className="mt-6 grid gap-4" onSubmit={salvar} aria-busy={enviando} noValidate>
      {campo("senhaAtual", "Senha atual", "current-password")}
      {campo("novaSenha", "Nova senha", "new-password")}
      <ul id="conta-requisitos-senha" className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-300" aria-label="Requisitos da nova senha">
        {requisitosSenha.map(requisito => {
          const atendido = requisito.testar(valores.novaSenha)
          return <li key={requisito.id} className={`flex items-center gap-2 ${atendido ? "text-green-700 dark:text-green-300" : ""}`}>
            {atendido ? <Check aria-hidden="true" size={15} /> : <X aria-hidden="true" size={15} />}{requisito.texto}
          </li>
        })}
      </ul>
      {campo("confirmacao", "Confirme a nova senha", "new-password")}
      {mensagem ? <p role="status" className="text-sm text-green-700 dark:text-green-300">{mensagem}</p> : null}
      {erroGeral ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">{erroGeral}</p> : null}
      <Button className="w-fit" disabled={enviando}>{enviando ? "Alterando..." : "Alterar senha"}</Button>
    </form>
  </section>
}
