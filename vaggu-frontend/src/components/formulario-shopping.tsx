/** Divide cadastro e edição do shopping em etapas curtas, com validação local. */
import { useEffect, useRef, useState, type ComponentProps, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buscarEnderecoPorCep, ErroCep } from "@/servicos/cep"
import type { DadosShopping, ShoppingAdmin } from "@/types/admin"

interface FormularioShoppingProps {
  shopping?: ShoppingAdmin
  ocupado: boolean
  rotuloBotao: string
  aoEnviar: (dados: DadosShopping, formulario: HTMLFormElement) => void
}

const valor = (dados: FormData, campo: keyof DadosShopping) => String(dados.get(campo) ?? "").trim()
const etapas = ["Identificação", "Endereço", "Operação"] as const

/** Preserva os campos entre etapas; validação local melhora o retorno, mas a API decide a persistência. */
export function FormularioShopping({ shopping, ocupado, rotuloBotao, aoEnviar }: FormularioShoppingProps) {
  const [etapa, setEtapa] = useState(0)
  const [cep, setCep] = useState("")
  const [avisoCep, setAvisoCep] = useState("")
  const formularioRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const digitos = cep.replace(/\D/g, "")
    if (!cep || digitos.length < 8) { return }
    if (digitos.length !== 8 || /[^\d-]/.test(cep)) { return }
    const controle = new AbortController()
    const prazo = window.setTimeout(() => {
      setAvisoCep("Buscando endereço...")
      void buscarEnderecoPorCep(cep, controle.signal).then(endereco => {
        if (controle.signal.aborted) return
        const formulario = formularioRef.current
        if (!formulario) return
        for (const nome of ["logradouro", "bairro", "cidade", "uf"] as const) {
          const campo = formulario.elements.namedItem(nome)
          if (campo instanceof HTMLInputElement && endereco[nome]) campo.value = endereco[nome]
        }
        setAvisoCep("Endereço preenchido. Confira os dados e informe o número.")
      }).catch(erro => {
        if (erro instanceof DOMException && erro.name === "AbortError") return
        setAvisoCep(erro instanceof ErroCep ? erro.message : "Não foi possível buscar o endereço automaticamente. Preencha o endereço manualmente.")
      })
    }, 400)
    return () => { window.clearTimeout(prazo); controle.abort() }
  }, [cep])

  /** Valida somente controles da etapa visível e leva o foco ao primeiro campo inválido. */
  function validarEtapa(formulario: HTMLFormElement, indice: number) {
    const campos = formulario.querySelectorAll<HTMLInputElement>(`[data-etapa="${indice}"] input`)
    const invalido = Array.from(campos).find(campo => !campo.checkValidity())
    if (!invalido) return true
    setEtapa(indice)
    window.requestAnimationFrame(() => invalido.reportValidity())
    return false
  }

  function avancar() {
    const formulario = formularioRef.current
    if (formulario && validarEtapa(formulario, etapa)) setEtapa(etapa + 1)
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    for (let indice = 0; indice < etapas.length; indice++) {
      if (!validarEtapa(formulario, indice)) return
    }
    const dados = new FormData(formulario)
    aoEnviar({
      nome: valor(dados, "nome"), cnpj: valor(dados, "cnpj"), responsavelNome: valor(dados, "responsavelNome"),
      responsavelCpf: valor(dados, "responsavelCpf"), emailCorporativo: valor(dados, "emailCorporativo"), telefone: valor(dados, "telefone"),
      cep: valor(dados, "cep"), uf: valor(dados, "uf"), cidade: valor(dados, "cidade"), bairro: valor(dados, "bairro"),
      logradouro: valor(dados, "logradouro"), numero: valor(dados, "numero"), complemento: valor(dados, "complemento"),
      horarioAbertura: valor(dados, "horarioAbertura"), horarioFechamento: valor(dados, "horarioFechamento"),
    }, formulario)
  }

  const campo = (nome: keyof DadosShopping, rotulo: string, props: ComponentProps<"input"> = {}) => <div className="grid gap-2">
    <Label htmlFor={`shopping-${nome}`} className="text-neutral-950 dark:text-neutral-100">{rotulo}{props.required && <span className="text-amber-700 dark:text-[#ffe100]" aria-hidden="true"> *</span>}</Label>
    <Input id={`shopping-${nome}`} name={nome} defaultValue={shopping?.[nome] ?? ""} className="h-11 border-white/15 bg-white/5 text-white placeholder:text-neutral-600" disabled={ocupado} {...props} />
  </div>

  return <form ref={formularioRef} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5" onSubmit={enviar} autoComplete="off" noValidate>
    <div className="flex flex-wrap gap-2" aria-label="Etapas do cadastro">{etapas.map((rotulo, indice) => <span key={rotulo} aria-current={etapa === indice ? "step" : undefined} className={`rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm ${etapa === indice ? "border-[#ffe100] bg-[#ffe100] text-black" : "border-white/20 text-neutral-300"}`}>{indice + 1}. {rotulo}</span>)}</div>
    <p className="text-sm text-neutral-300" role="status">Etapa {etapa + 1} de {etapas.length}: {etapas[etapa]}</p>
    <fieldset data-etapa="0" hidden={etapa !== 0} style={{ display: etapa === 0 ? undefined : "none" }} className="grid min-w-0 gap-5">
      <legend className="sr-only">Identificação do shopping</legend>
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(14rem,1fr)]">{campo("nome", "Nome do shopping", { required: true, minLength: 2, maxLength: 120, placeholder: "Ex.: Shopping Central" })}{campo("cnpj", "CNPJ", { required: true, inputMode: "numeric", maxLength: 18, placeholder: "00.000.000/0000-00" })}</div>
      <div className="grid gap-5 md:grid-cols-2">{campo("responsavelNome", "Responsável", { required: true, maxLength: 120 })}{campo("responsavelCpf", "CPF do responsável", { inputMode: "numeric", maxLength: 14, placeholder: "Opcional" })}</div>
      <div className="grid gap-5 md:grid-cols-2">{campo("emailCorporativo", "E-mail corporativo", { required: true, type: "email", maxLength: 254 })}{campo("telefone", "Telefone", { required: true, type: "tel", maxLength: 40 })}</div>
    </fieldset>
    <fieldset data-etapa="1" hidden={etapa !== 1} style={{ display: etapa === 1 ? undefined : "none" }} className="grid min-w-0 gap-5">
      <legend className="sr-only">Endereço do shopping</legend>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_8rem]">{campo("cep", "CEP", { required: true, inputMode: "numeric", maxLength: 9, onChange: evento => { const valor = evento.currentTarget.value; setCep(valor); setAvisoCep(valor && (valor.replace(/\D/g, "").length > 8 || /[^\d-]/.test(valor)) ? "Informe um CEP válido com 8 números." : "") } })}{campo("uf", "Estado (UF)", { required: true, minLength: 2, maxLength: 2, placeholder: "SP" })}</div>
      {avisoCep && <p className="text-sm text-neutral-300" role="status">{avisoCep}</p>}
      <div className="grid gap-5 md:grid-cols-2">{campo("cidade", "Cidade", { required: true, maxLength: 100 })}{campo("bairro", "Bairro", { required: true, maxLength: 100 })}</div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_8rem_minmax(12rem,1fr)]">{campo("logradouro", "Logradouro", { required: true, maxLength: 160 })}{campo("numero", "Número", { required: true, maxLength: 20 })}{campo("complemento", "Complemento", { maxLength: 80, placeholder: "Opcional" })}</div>
    </fieldset>
    <fieldset data-etapa="2" hidden={etapa !== 2} style={{ display: etapa === 2 ? undefined : "none" }} className="grid min-w-0 gap-5">
      <legend className="sr-only">Operação do shopping</legend>
      <div className="grid gap-5 md:grid-cols-2">{campo("horarioAbertura", "Abertura", { type: "time" })}{campo("horarioFechamento", "Fechamento", { type: "time" })}</div>
    </fieldset>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {etapa > 0 && <Button type="button" variant="outline" className="h-11 border-white/20 bg-transparent text-white" disabled={ocupado} onClick={() => setEtapa(etapa - 1)}>Voltar</Button>}
      {etapa < etapas.length - 1 ? <Button type="button" className="h-11 px-8 font-bold" disabled={ocupado} onClick={avancar}>Continuar</Button> : <Button type="submit" className="h-11 px-8 font-bold" disabled={ocupado}>{ocupado ? "Salvando..." : rotuloBotao}</Button>}
    </div>
  </form>
}
