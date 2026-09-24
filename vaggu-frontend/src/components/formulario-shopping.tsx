/** Divide cadastro e edição do shopping em etapas curtas, com validação local e foto opcional. */
import { useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type FormEvent } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FotoShopping } from "@/components/foto-shopping"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DadosShopping, ShoppingAdmin } from "@/types/admin"

interface FormularioShoppingProps {
  shopping?: ShoppingAdmin
  ocupado: boolean
  rotuloBotao: string
  aoEnviar: (dados: DadosShopping, formulario: HTMLFormElement, foto: File | null) => void
  aoRemoverFoto?: () => void
}

const valor = (dados: FormData, campo: keyof DadosShopping) => String(dados.get(campo) ?? "").trim()
const etapas = ["Identificação", "Endereço", "Operação e foto"] as const

/** Preserva os campos entre etapas; validação local melhora o retorno, mas a API decide a persistência. */
export function FormularioShopping({ shopping, ocupado, rotuloBotao, aoEnviar, aoRemoverFoto }: FormularioShoppingProps) {
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState("")
  const [erroFoto, setErroFoto] = useState("")
  const [etapa, setEtapa] = useState(0)
  const formularioRef = useRef<HTMLFormElement>(null)

  useEffect(() => () => { if (fotoPreview) URL.revokeObjectURL(fotoPreview) }, [fotoPreview])

  function selecionarFoto(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0] ?? null
    if (fotoPreview) URL.revokeObjectURL(fotoPreview)
    setFotoPreview("")
    setFoto(null)
    setErroFoto("")
    if (!arquivo) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErroFoto("Escolha uma foto JPEG, PNG ou WebP.")
      evento.target.value = ""
      return
    }
    if (arquivo.size === 0 || arquivo.size > 2 * 1024 * 1024) {
      setErroFoto("A foto deve ter no máximo 2 MB.")
      evento.target.value = ""
      return
    }
    setFoto(arquivo)
    setFotoPreview(URL.createObjectURL(arquivo))
  }

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
    }, formulario, foto)
  }

  const campo = (nome: keyof DadosShopping, rotulo: string, props: ComponentProps<"input"> = {}) => <div className="grid gap-2">
    <Label htmlFor={`shopping-${nome}`} className="text-neutral-100">{rotulo}{props.required && <span className="text-[#ffe100]" aria-hidden="true"> *</span>}</Label>
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
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_8rem]">{campo("cep", "CEP", { required: true, inputMode: "numeric", maxLength: 9 })}{campo("uf", "Estado (UF)", { required: true, minLength: 2, maxLength: 2, placeholder: "SP" })}</div>
      <div className="grid gap-5 md:grid-cols-2">{campo("cidade", "Cidade", { required: true, maxLength: 100 })}{campo("bairro", "Bairro", { required: true, maxLength: 100 })}</div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_8rem_minmax(12rem,1fr)]">{campo("logradouro", "Logradouro", { required: true, maxLength: 160 })}{campo("numero", "Número", { required: true, maxLength: 20 })}{campo("complemento", "Complemento", { maxLength: 80, placeholder: "Opcional" })}</div>
    </fieldset>
    <fieldset data-etapa="2" hidden={etapa !== 2} style={{ display: etapa === 2 ? undefined : "none" }} className="grid min-w-0 gap-5">
      <legend className="sr-only">Operação e foto do shopping</legend>
      <div className="grid gap-5 md:grid-cols-2">{campo("horarioAbertura", "Abertura", { type: "time" })}{campo("horarioFechamento", "Fechamento", { type: "time" })}</div>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
        <div className="grid gap-2"><Label htmlFor="shopping-foto" className="text-neutral-100">Foto do shopping</Label>
          <div className="flex min-h-11 items-center gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-1">
            <Input id="shopping-foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" disabled={ocupado} onChange={selecionarFoto} className="peer sr-only" />
            <label htmlFor="shopping-foto" className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#ffe100] px-3 text-center text-sm font-semibold text-black transition hover:bg-[#ffeb54] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ffe100] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#171717]">Escolher arquivo</label>
            <span className="min-w-0 truncate text-sm text-neutral-200">{foto?.name ?? "Nenhum arquivo escolhido"}</span>
          </div>
          <p className="text-xs text-neutral-400">
            JPEG, PNG ou WebP, com até 2 MB. Uma nova foto substitui a anterior.
          </p>
          {erroFoto && <p role="alert" className="text-sm text-red-300">{erroFoto}</p>}
        </div>
        {fotoPreview ? <img src={fotoPreview} alt="Prévia da foto selecionada para o shopping" className="aspect-square w-28 rounded-xl object-cover sm:w-full" /> : shopping && <div className="grid gap-2"><FotoShopping nome={shopping.nome} imagemUrl={shopping.imagemUrl} className="aspect-square w-28 rounded-xl sm:w-full" />{shopping.imagemUrl && aoRemoverFoto && <Button type="button" variant="outline" size="sm" className="border-white/20 bg-transparent text-white" disabled={ocupado} onClick={aoRemoverFoto}><Trash2 aria-hidden="true" />Remover</Button>}</div>}
      </div>
    </fieldset>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {etapa > 0 && <Button type="button" variant="outline" className="h-11 border-white/20 bg-transparent text-white" disabled={ocupado} onClick={() => setEtapa(etapa - 1)}>Voltar</Button>}
      {etapa < etapas.length - 1 ? <Button type="button" className="h-11 px-8 font-bold" disabled={ocupado} onClick={avancar}>Continuar</Button> : <Button type="submit" className="h-11 px-8 font-bold" disabled={ocupado || Boolean(erroFoto)}>{ocupado ? "Salvando..." : rotuloBotao}</Button>}
    </div>
  </form>
}
