/** Reúne dados pessoais e segurança da própria conta para qualquer perfil autenticado. */
import { useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { FormularioAlterarSenha } from "@/components/formulario-alterar-senha"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MinhaConta() {
  const { currentUser, atualizarMinhaConta } = useAppStore()
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const [ocupado, setOcupado] = useState(false)

  if (!currentUser) return null

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setOcupado(true)
    setErro("")
    setMensagem("")
    const dados = new FormData(evento.currentTarget)
    try {
      await atualizarMinhaConta(String(dados.get("nome") ?? ""), String(dados.get("telefone") ?? ""))
      setMensagem("Dados atualizados.")
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível atualizar seus dados.")
    } finally {
      setOcupado(false)
    }
  }

  return <div className="grid w-full max-w-2xl gap-6">
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 dark:border-white/10 dark:bg-[#242424] dark:text-white">
      <h2 className="text-xl font-semibold">Dados pessoais</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        O e-mail e {currentUser.role === "shopping" ? "o vínculo com o shopping" : "o perfil administrativo"} são controlados pela VAGGU.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={salvar}>
        <div className="grid gap-2"><Label htmlFor="conta-nome">Nome</Label><Input id="conta-nome" name="nome" defaultValue={currentUser.nome} required minLength={2} maxLength={120} /></div>
        <div className="grid gap-2"><Label htmlFor="conta-email">E-mail</Label><Input id="conta-email" value={currentUser.email} readOnly aria-describedby="conta-email-ajuda" /><p id="conta-email-ajuda" className="text-xs text-neutral-500 dark:text-neutral-400">Somente leitura. Solicite à equipe VAGGU para alterar.</p></div>
        <div className="grid gap-2"><Label htmlFor="conta-telefone">Telefone</Label><Input id="conta-telefone" name="telefone" defaultValue={currentUser.telefone ?? ""} maxLength={40} /></div>
        {erro ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">{erro}</p> : null}
        {mensagem ? <p role="status" className="text-sm text-green-700 dark:text-green-300">{mensagem}</p> : null}
        <Button className="w-fit" disabled={ocupado}>{ocupado ? "Salvando..." : "Salvar dados"}</Button>
      </form>
    </section>
    <FormularioAlterarSenha />
  </div>
}
