/** Abre a exportação da estrutura em diálogo curto, com contexto e resultado visível. */
import { useMemo, useState } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { gerarPlanilhaEstrutura, resumirEstrutura } from "@/servicos/exportacao-estrutura"
import type { EstruturaEstacionamento } from "@/types/estrutura"

export function ExportacaoEstrutura({ estrutura }: { estrutura: EstruturaEstacionamento | null }) {
  const [aberto, setAberto] = useState(false)
  const [baixando, setBaixando] = useState(false)
  const [erro, setErro] = useState("")
  const resumo = useMemo(() => estrutura ? resumirEstrutura(estrutura) : null, [estrutura])

  async function baixar() {
    if (!estrutura || baixando) return
    setBaixando(true)
    setErro("")
    try {
      const { arquivo, nome } = await gerarPlanilhaEstrutura(estrutura)
      const url = URL.createObjectURL(arquivo)
      const link = document.createElement("a")
      link.href = url
      link.download = nome
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setAberto(false)
    } catch {
      setErro("Não foi possível preparar a planilha. Tente novamente.")
    } finally {
      setBaixando(false)
    }
  }

  return <Dialog open={aberto} onOpenChange={valor => { if (!baixando) { setAberto(valor); setErro("") } }}>
    <DialogTrigger asChild>
      <Button type="button" variant="outline" disabled={!estrutura} className="w-full sm:w-auto">
        <FileSpreadsheet aria-hidden="true" /> Exportar estrutura
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Exportar estrutura</DialogTitle>
        <DialogDescription>Confira o shopping e baixe uma fotografia da configuração atual em Excel.</DialogDescription>
      </DialogHeader>
      {estrutura && resumo && <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
        <p className="font-semibold">{estrutura.shopping.nome}</p>
        <p className="mt-2 text-sm text-muted-foreground">{resumo.andares} {resumo.andares === 1 ? "andar" : "andares"} · {resumo.setores} {resumo.setores === 1 ? "setor" : "setores"} · {resumo.vagas} {resumo.vagas === 1 ? "vaga" : "vagas"}</p>
        <p className="mt-1 text-sm text-muted-foreground">{resumo.ativas} ativas · {resumo.inativas} inativas</p>
      </div>}
      <p className="text-sm text-muted-foreground">O arquivo terá as abas Vagas e Resumo, com filtros, cabeçalhos fixos e códigos preservados como texto. É uma exportação para consulta; importar este arquivo não restaura estados ou desativações.</p>
      {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}
      <DialogFooter>
        <Button type="button" variant="outline" disabled={baixando} onClick={() => setAberto(false)}>Cancelar</Button>
        <Button type="button" disabled={baixando || !estrutura} onClick={() => void baixar()}>
          <Download aria-hidden="true" /> {baixando ? "Preparando planilha..." : "Baixar XLSX"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
