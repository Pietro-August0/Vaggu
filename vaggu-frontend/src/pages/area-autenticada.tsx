/** Mantém o painel operacional e a edição da própria conta do gerente autenticado. */
import { useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { DashboardShell } from "@/components/dashboard-shell"
import { MapaEstacionamento } from "@/components/mapa-estacionamento"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Minha conta usa o usuário da sessão e não aceita selecionar outro ID. */
function MinhaConta() {
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

  return <section className="max-w-2xl rounded-2xl bg-white p-6">
    <h2 className="text-xl font-semibold">Minha conta</h2>
    <p className="mt-2 text-sm text-neutral-600">O e-mail e o vínculo com o shopping são administrados pela equipe VAGGU.</p>
    <form className="mt-6 grid gap-4" onSubmit={salvar}>
      <div className="grid gap-2"><Label htmlFor="conta-nome">Nome</Label><Input id="conta-nome" name="nome" defaultValue={currentUser.nome} required minLength={2} maxLength={120} /></div>
      <div className="grid gap-2"><Label htmlFor="conta-email">E-mail</Label><Input id="conta-email" value={currentUser.email} disabled /></div>
      <div className="grid gap-2"><Label htmlFor="conta-telefone">Telefone</Label><Input id="conta-telefone" name="telefone" defaultValue={currentUser.telefone ?? ""} maxLength={40} /></div>
      {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
      {mensagem && <p role="status" className="text-sm text-green-700">{mensagem}</p>}
      <Button className="w-fit" disabled={ocupado}>{ocupado ? "Salvando..." : "Salvar dados"}</Button>
    </form>
  </section>
}

/** Exibe somente recursos autorizados ao gerente do shopping da sessão. */
export function AreaAutenticada() {
  const { currentUser } = useAppStore()
  if (!currentUser) return null

  return <DashboardShell eyebrow="Área do cliente" title="Painel do shopping">
    <div className="grid max-w-6xl gap-6"><MapaEstacionamento /><MinhaConta /></div>
  </DashboardShell>
}
