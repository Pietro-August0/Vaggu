/** Permite ao Admin revisar CSV/XLSX e confirmar a alteração estrutural de forma explícita. */
import { useState, type FormEvent } from "react"
import { useAppStore } from "@/app/app-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lerConfirmacaoImportacao, lerPreviaImportacao, type PreviaImportacao } from "@/types/importacao"

const LIMITE_EXIBICAO = 100

/** A troca de shopping descarta a prévia anterior para impedir confirmação no recorte errado. */
export function ImportacaoAdmin({ shoppingId, aoConfirmar }: { shoppingId: string; aoConfirmar: () => Promise<void> }) {
  const { consultar, enviarArquivo } = useAppStore()
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [previa, setPrevia] = useState<PreviaImportacao | null>(null)
  const [erro, setErro] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [ocupado, setOcupado] = useState(false)
  async function gerarPrevia(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!arquivo) return setErro("Selecione um arquivo CSV ou XLSX.")
    const nome = arquivo.name.toLocaleLowerCase("pt-BR")
    const formato = nome.endsWith(".csv") ? "csv" : nome.endsWith(".xlsx") ? "xlsx" : null
    if (!formato) return setErro("Use um arquivo com extensão .csv ou .xlsx.")
    setOcupado(true); setErro(""); setMensagem(""); setPrevia(null)
    try {
      const dados = await enviarArquivo(`/shoppings/${shoppingId}/importacoes/previa-${formato}`, arquivo)
      setPrevia(lerPreviaImportacao(dados))
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível gerar a prévia.")
    } finally { setOcupado(false) }
  }

  async function confirmar() {
    if (!previa?.podeConfirmar) return
    setOcupado(true); setErro(""); setMensagem("")
    try {
      const resultado = lerConfirmacaoImportacao(await consultar(
        `/shoppings/${shoppingId}/importacoes/${previa.importacaoId}/confirmar`, {}, "POST"))
      await aoConfirmar()
      setMensagem(`${resultado.resumo.novos} vaga(s) criada(s), ${resultado.resumo.atualizacoes} atualizada(s) e ${resultado.resumo.preservadasAusentes} ausente(s) preservada(s).`)
      setPrevia(null); setArquivo(null)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível confirmar a importação.")
    } finally { setOcupado(false) }
  }

  return <section className="rounded-2xl bg-white p-6" aria-labelledby="titulo-importacao">
    <h2 id="titulo-importacao" className="text-xl font-semibold">Importar estrutura</h2>
    <p className="mt-1 text-sm text-neutral-600">Envie CSV ou XLSX com código, andar, setor e tipo. A prévia não altera vagas; somente a confirmação aplica os registros válidos.</p>
    <form className="mt-5 flex flex-wrap items-end gap-3" onSubmit={gerarPrevia}>
      <div className="min-w-64 flex-1"><Label htmlFor="arquivo-importacao">Arquivo da estrutura</Label><Input id="arquivo-importacao" type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={ocupado} onChange={evento => setArquivo(evento.target.files?.[0] ?? null)} /></div>
      <Button disabled={ocupado || !arquivo}>{ocupado ? "Processando..." : "Gerar prévia"}</Button>
    </form>
    {erro && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
    {mensagem && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{mensagem}</p>}
    {previa && <div className="mt-6 grid gap-5">
      <div className="flex flex-wrap gap-2" aria-label="Resumo da prévia">
        <Badge variant="secondary">{previa.resumo.registrosValidos} válidas</Badge>
        <Badge variant="secondary">{previa.resumo.novos} novas</Badge>
        <Badge variant="secondary">{previa.resumo.atualizacoes} atualizações</Badge>
        <Badge variant="secondary">{previa.resumo.preservadasAusentes} ausentes preservadas</Badge>
        <Badge variant={previa.erros.length ? "destructive" : "default"}>{previa.resumo.totalErros} erros</Badge>
      </div>
      {previa.erros.length > 0 && <div><h3 className="font-semibold">Erros que bloqueiam a confirmação</h3><div className="mt-2 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th className="p-2">Linha</th><th className="p-2">Campo</th><th className="p-2">Código</th><th className="p-2">Motivo</th></tr></thead><tbody>{previa.erros.slice(0, LIMITE_EXIBICAO).map((item, indice) => <tr className="border-t" key={`${item.linha}-${item.campo}-${indice}`}><td className="p-2">{item.linha}</td><td className="p-2">{item.campo}</td><td className="p-2">{item.codigo || "—"}</td><td className="p-2">{item.mensagem}</td></tr>)}</tbody></table></div></div>}
      {previa.registros.length > 0 && <div><h3 className="font-semibold">Registros válidos</h3><div className="mt-2 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th className="p-2">Linha</th><th className="p-2">Código</th><th className="p-2">Andar</th><th className="p-2">Setor</th><th className="p-2">Tipo</th><th className="p-2">Ação</th></tr></thead><tbody>{previa.registros.slice(0, LIMITE_EXIBICAO).map(item => <tr className="border-t" key={`${item.linha}-${item.codigo}`}><td className="p-2">{item.linha}</td><td className="p-2 font-medium">{item.codigo}</td><td className="p-2">{item.andar}</td><td className="p-2">{item.setor}</td><td className="p-2">{item.tipo}</td><td className="p-2">{item.acao === "CRIAR" ? "Criar" : "Atualizar"}</td></tr>)}</tbody></table></div></div>}
      {(previa.registros.length > LIMITE_EXIBICAO || previa.erros.length > LIMITE_EXIBICAO) && <p className="text-sm text-neutral-600">A tela mostra os primeiros {LIMITE_EXIBICAO} itens de cada lista.</p>}
      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4"><p className="text-sm">{previa.resumo.preservadasAusentes} vaga(s) ausente(s) deste arquivo serão preservadas. IDs, sensores e histórico das vagas atualizadas também permanecem.</p><Button className="mt-3" disabled={ocupado || !previa.podeConfirmar} onClick={() => void confirmar()}>{ocupado ? "Confirmando..." : "Confirmar importação"}</Button></div>
    </div>}
  </section>
}
