/** Reúne os dados institucionais e de endereço usados no cadastro e na edição do shopping. */
import type { ComponentProps, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DadosShopping, ShoppingAdmin } from "@/types/admin"

interface FormularioShoppingProps {
  shopping?: ShoppingAdmin
  ocupado: boolean
  rotuloBotao: string
  aoEnviar: (dados: DadosShopping, formulario: HTMLFormElement) => void
}

const valor = (dados: FormData, campo: keyof DadosShopping) => String(dados.get(campo) ?? "").trim()

/** Mantém os nomes do payload alinhados ao contrato administrativo da API. */
export function FormularioShopping({ shopping, ocupado, rotuloBotao, aoEnviar }: FormularioShoppingProps) {
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const dados = new FormData(formulario)
    aoEnviar({
      nome: valor(dados, "nome"), cnpj: valor(dados, "cnpj"), responsavelNome: valor(dados, "responsavelNome"),
      responsavelCpf: valor(dados, "responsavelCpf"), emailCorporativo: valor(dados, "emailCorporativo"), telefone: valor(dados, "telefone"),
      cep: valor(dados, "cep"), uf: valor(dados, "uf"), cidade: valor(dados, "cidade"), bairro: valor(dados, "bairro"),
      logradouro: valor(dados, "logradouro"), numero: valor(dados, "numero"), complemento: valor(dados, "complemento"),
      horarioAbertura: valor(dados, "horarioAbertura"), horarioFechamento: valor(dados, "horarioFechamento"), fusoHorario: valor(dados, "fusoHorario"),
    }, formulario)
  }

  const campo = (nome: keyof DadosShopping, rotulo: string, props: ComponentProps<"input"> = {}) => <div className="grid gap-2">
    <Label htmlFor={`shopping-${nome}`} className="text-neutral-100">{rotulo}{props.required && <span className="text-[#ffe100]" aria-hidden="true"> *</span>}</Label>
    <Input id={`shopping-${nome}`} name={nome} defaultValue={shopping?.[nome] ?? ""} className="h-11 border-white/15 bg-white/5 text-white placeholder:text-neutral-600" disabled={ocupado} {...props} />
  </div>

  return <form className="grid gap-5" onSubmit={enviar} autoComplete="off">
    <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(14rem,1fr)]">{campo("nome", "Nome do shopping", { required: true, minLength: 2, maxLength: 120, placeholder: "Ex.: Shopping Central" })}{campo("cnpj", "CNPJ", { required: true, inputMode: "numeric", maxLength: 18, placeholder: "00.000.000/0000-00" })}</div>
    <div className="grid gap-5 md:grid-cols-3">{campo("responsavelNome", "Responsável", { required: true, maxLength: 120 })}{campo("emailCorporativo", "E-mail corporativo", { required: true, type: "email", maxLength: 254 })}{campo("telefone", "Telefone", { required: true, type: "tel", maxLength: 40 })}</div>
    <div className="grid gap-5 md:grid-cols-3">{campo("responsavelCpf", "CPF do responsável", { inputMode: "numeric", maxLength: 14, placeholder: "Opcional" })}{campo("cep", "CEP", { required: true, inputMode: "numeric", maxLength: 9 })}{campo("uf", "Estado (UF)", { required: true, minLength: 2, maxLength: 2, placeholder: "SP" })}</div>
    <div className="grid gap-5 md:grid-cols-2">{campo("cidade", "Cidade", { required: true, maxLength: 100 })}{campo("bairro", "Bairro", { required: true, maxLength: 100 })}</div>
    <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_8rem_minmax(12rem,1fr)]">{campo("logradouro", "Logradouro", { required: true, maxLength: 160 })}{campo("numero", "Número", { required: true, maxLength: 20 })}{campo("complemento", "Complemento", { maxLength: 80, placeholder: "Opcional" })}</div>
    <div className="grid gap-5 md:grid-cols-3">{campo("horarioAbertura", "Abertura", { type: "time" })}{campo("horarioFechamento", "Fechamento", { type: "time" })}{campo("fusoHorario", "Fuso horário", { maxLength: 80, placeholder: "America/Sao_Paulo" })}</div>
    <Button type="submit" className="mt-2 h-11 w-full px-8 font-bold sm:w-fit" disabled={ocupado}>{ocupado ? "Salvando..." : rotuloBotao}</Button>
  </form>
}
