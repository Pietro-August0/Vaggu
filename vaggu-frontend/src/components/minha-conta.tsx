/** Reúne dados pessoais e segurança da própria conta para qualquer perfil autenticado. */
import { useState, type FormEvent } from "react"
import { ShieldCheck } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { FormularioAlterarSenha } from "@/components/formulario-alterar-senha"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

  return <div className="grid w-full max-w-4xl gap-6">
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-950 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#242424] dark:text-white">
      <div className="grid items-start gap-5 border-b border-neutral-200 pb-5 md:grid-cols-[minmax(0,1fr)_auto] dark:border-white/10">
        <div><h2 className="text-xl font-semibold">Dados pessoais</h2><p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">O e-mail e {currentUser.role === "shopping" ? "o vínculo com o shopping" : "o perfil administrativo"} são controlados pela VAGGU.</p></div>
        <Dialog>
          <DialogTrigger asChild><Button type="button" variant="outline" className="w-full gap-2 md:w-auto"><ShieldCheck aria-hidden="true"/>Alterar senha</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader><DialogTitle>Alterar senha</DialogTitle><DialogDescription>Confirme sua senha atual e escolha uma nova senha segura.</DialogDescription></DialogHeader>
            <FormularioAlterarSenha />
          </DialogContent>
        </Dialog>
      </div>
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={salvar}>
        <div className="grid gap-2"><Label htmlFor="conta-nome">Nome</Label><Input id="conta-nome" name="nome" defaultValue={currentUser.nome} required minLength={2} maxLength={120} /></div>
        <div className="grid gap-2"><Label htmlFor="conta-telefone">Telefone</Label><Input id="conta-telefone" name="telefone" defaultValue={currentUser.telefone ?? ""} maxLength={40} /></div>
        <div className="grid gap-2 sm:col-span-2"><Label htmlFor="conta-email">E-mail</Label><Input id="conta-email" value={currentUser.email} readOnly aria-describedby="conta-email-ajuda" /><p id="conta-email-ajuda" className="text-xs text-neutral-500 dark:text-neutral-400">Somente leitura. Solicite à equipe VAGGU para alterar.</p></div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">{erro ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">{erro}</p> : null}{mensagem ? <p role="status" className="text-sm text-green-700 dark:text-green-300">{mensagem}</p> : null}<Button className="w-fit sm:ml-auto" disabled={ocupado}>{ocupado ? "Salvando..." : "Salvar dados"}</Button></div>
      </form>
    </section>
  </div>
}
