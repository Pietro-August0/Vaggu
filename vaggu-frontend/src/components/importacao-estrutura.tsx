/** Conduz upload, revisão e confirmação da estrutura de um shopping. */
import { useState } from "react"
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react"
import { useAppStore } from "@/app/app-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { lerConfirmacaoImportacao, lerPreviaImportacao, MODELO_CSV_IMPORTACAO } from "@/servicos/importacao"
import type { ConfirmacaoImportacao, PreviaImportacao } from "@/types/importacao"

const LIMITE_CSV = 1024 * 1024
const LIMITE_XLSX = 2 * 1024 * 1024
const LIMITE_LINHAS_VISIVEIS = 100

function configuracaoArquivo(arquivo: File) {
  const extensao = arquivo.name.split(".").pop()?.toLowerCase()
  if (extensao === "csv") return { rota: "previa-csv", tipo: "text/csv", limite: LIMITE_CSV }
  if (extensao === "xlsx") return { rota: "previa-xlsx", tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", limite: LIMITE_XLSX }
  throw new Error("Selecione um arquivo CSV ou XLSX.")
}

export function ImportacaoEstrutura({ shoppingId, aoConfirmar }: { shoppingId: string; aoConfirmar: () => void }) {
  const { consultar, enviarArquivo } = useAppStore()
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [previa, setPrevia] = useState<PreviaImportacao | null>(null)
  const [confirmacao, setConfirmacao] = useState<ConfirmacaoImportacao | null>(null)
  const [erro, setErro] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [dialogoAberto, setDialogoAberto] = useState(false)

  /** Gera localmente um exemplo sem acessar a API ou incluir dados do shopping. */
  function baixarModeloCsv() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", MODELO_CSV_IMPORTACAO], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url; link.download = "modelo-importacao-vaggu.csv"
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url)
  }

  async function gerarPrevia() {
    if (!arquivo) return setErro("Selecione um arquivo CSV ou XLSX.")
    setOcupado(true); setErro(""); setPrevia(null); setConfirmacao(null)
    try {
      const configuracao = configuracaoArquivo(arquivo)
      if (arquivo.size > configuracao.limite) {
        throw new Error(`O arquivo excede o limite de ${configuracao.limite === LIMITE_CSV ? "1 MB" : "2 MB"}.`)
      }
      const dados = await enviarArquivo(`/shoppings/${shoppingId}/importacoes/${configuracao.rota}`, arquivo, configuracao.tipo)
      setPrevia(lerPreviaImportacao(dados))
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível gerar a prévia.")
    } finally {
      setOcupado(false)
    }
  }

  async function confirmar() {
    if (!previa?.podeConfirmar) return
    setOcupado(true); setErro("")
    try {
      const dados = await consultar(`/shoppings/${shoppingId}/importacoes/${previa.importacaoId}/confirmar`, {})
      setConfirmacao(lerConfirmacaoImportacao(dados)); setDialogoAberto(false); aoConfirmar()
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível confirmar a importação.")
      setDialogoAberto(false)
    } finally {
      setOcupado(false)
    }
  }

  const registrosVisiveis = previa?.registros.slice(0, LIMITE_LINHAS_VISIVEIS) ?? []
  return <section className="rounded-2xl bg-card p-6 text-card-foreground" aria-labelledby="titulo-importacao">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 id="titulo-importacao" className="text-xl font-semibold">Importar estrutura</h2>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">Envie uma planilha com as colunas código, andar, setor e tipo. A estrutura só muda depois da confirmação.</p>
      </div>
      <Button type="button" variant="outline" className="w-full sm:w-fit" onClick={baixarModeloCsv}>
        <Download aria-hidden="true" />Baixar modelo CSV
      </Button>
    </div>
    <div className="mt-5 flex w-full flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-end sm:justify-start">
        <div className="grid min-w-0 gap-1.5 sm:min-w-72">
          <Label htmlFor={`arquivo-importacao-${shoppingId}`}>Arquivo CSV ou XLSX</Label>
          <Input id={`arquivo-importacao-${shoppingId}`} type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={ocupado} onChange={evento => { setArquivo(evento.target.files?.[0] ?? null); setPrevia(null); setConfirmacao(null); setErro("") }} />
          <p className="text-xs text-neutral-500 dark:text-neutral-300">CSV até 1 MB · XLSX até 2 MB</p>
        </div>
        <Button type="button" className="sm:self-end" disabled={ocupado || !arquivo} onClick={() => void gerarPrevia()}>
          <Upload aria-hidden="true" />{ocupado ? "Processando..." : "Gerar prévia"}
        </Button>
    </div>

    {erro && <div role="alert" className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{erro}</span></div>}

    {confirmacao && <div role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
      <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="size-5" aria-hidden="true" />Importação confirmada</div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <span><strong>{confirmacao.resultado.andaresCriados}</strong> andares criados</span>
        <span><strong>{confirmacao.resultado.setoresCriados}</strong> setores criados</span>
        <span><strong>{confirmacao.resultado.vagasCriadas}</strong> vagas criadas</span>
        <span><strong>{confirmacao.resultado.vagasAtualizadas}</strong> vagas atualizadas</span>
        <span><strong>{confirmacao.resultado.vagasPreservadasForaDaPlanilha}</strong> vagas preservadas</span>
      </div>
    </div>}

    {previa && <div className="mt-6 grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[['Linhas', previa.resumo.totalLinhas], ['Válidas', previa.resumo.registrosValidos], ['Novas', previa.resumo.novos], ['Atualizações', previa.resumo.atualizacoes], ['Erros', previa.resumo.totalErros]].map(([rotulo, valor]) =>
          <div key={String(rotulo)} className="rounded-lg border border-neutral-200 p-3"><p className="text-xs text-neutral-500">{rotulo}</p><p className="mt-1 text-xl font-semibold">{valor}</p></div>)}
      </div>

      {previa.erros.length > 0 && <div className="overflow-hidden rounded-lg border border-red-200">
        <div className="bg-red-50 px-4 py-3 font-medium text-red-900">Erros que impedem a confirmação</div>
        <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Linha</TableHead><TableHead>Campo</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader>
          <TableBody>{previa.erros.map((item, indice) => <TableRow key={`${item.linha}-${item.codigo}-${indice}`}><TableCell>{item.linha}</TableCell><TableCell>{item.campo}</TableCell><TableCell className="min-w-72">{item.mensagem}</TableCell></TableRow>)}</TableBody>
        </Table></div>
      </div>}

      {registrosVisiveis.length > 0 && <div className="overflow-hidden rounded-lg border border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3"><span className="font-medium">Registros válidos</span>{previa.registros.length > LIMITE_LINHAS_VISIVEIS && <span className="text-xs text-neutral-500">Exibindo os primeiros {LIMITE_LINHAS_VISIVEIS}</span>}</div>
        <div className="max-h-96 overflow-auto"><Table><TableHeader><TableRow><TableHead>Linha</TableHead><TableHead>Código</TableHead><TableHead>Andar</TableHead><TableHead>Setor</TableHead><TableHead>Tipo</TableHead><TableHead>Ação</TableHead></TableRow></TableHeader>
          <TableBody>{registrosVisiveis.map(item => <TableRow key={`${item.linha}-${item.codigo}`}><TableCell>{item.linha}</TableCell><TableCell className="font-medium">{item.codigo}</TableCell><TableCell>{item.andar}</TableCell><TableCell>{item.setor}</TableCell><TableCell>{item.tipo}</TableCell><TableCell><Badge variant={item.acao === "CRIAR" ? "default" : "secondary"}>{item.acao === "CRIAR" ? "Criar" : "Atualizar"}</Badge></TableCell></TableRow>)}</TableBody>
        </Table></div>
      </div>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5">
        <p className="text-sm text-neutral-600">{previa.podeConfirmar ? "A prévia está pronta para aplicação." : "Corrija a planilha e gere uma nova prévia."}</p>
        <Button type="button" disabled={ocupado || !previa.podeConfirmar || Boolean(confirmacao)} onClick={() => setDialogoAberto(true)}>
          <FileSpreadsheet aria-hidden="true" />{confirmacao ? "Importação confirmada" : "Confirmar importação"}
        </Button>
      </div>
    </div>}

    <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
      <DialogContent>
        <DialogHeader><DialogTitle>Confirmar importação da estrutura?</DialogTitle><DialogDescription>Vagas existentes serão atualizadas pelo código e manterão seu histórico. Vagas ausentes da planilha não serão removidas.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="button" disabled={ocupado} onClick={() => void confirmar()}>{ocupado ? "Confirmando..." : "Confirmar importação"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
}
