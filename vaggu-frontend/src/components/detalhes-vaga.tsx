/** Apresenta os dados disponíveis de uma vaga sem simular telemetria ainda não integrada. */
import { MapPin, Radio, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { nomesEstadoVaga, nomesTipoVaga } from "@/servicos/apresentacao-vaga"
import type { VagaEstrutura } from "@/types/estrutura"

const classesEstado: Record<VagaEstrutura["estadoAtual"], string> = {
  LIVRE: "bg-emerald-100 text-emerald-900",
  OCUPADA: "bg-red-100 text-red-900",
  DESCONHECIDA: "bg-neutral-200 text-neutral-800",
}

interface DetalhesVagaProps {
  vaga: VagaEstrutura | null
  andar: string
  setor: string
  aoFechar: () => void
}

/** Mantém o diálogo controlado pela seleção feita no mapa ou na lista. */
export function DetalhesVaga({ vaga, andar, setor, aoFechar }: DetalhesVagaProps) {
  return (
    <Dialog
      open={vaga !== null}
      onOpenChange={(aberto) => {
        if (!aberto) aoFechar()
      }}
    >
      {vaga ? (
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader className="pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl">Vaga {vaga.codigo}</DialogTitle>
              <Badge className={classesEstado[vaga.estadoAtual]}>
                {nomesEstadoVaga[vaga.estadoAtual]}
              </Badge>
            </div>
            <DialogDescription>
              Detalhes estruturais e situação de monitoramento desta vaga.
            </DialogDescription>
          </DialogHeader>

          <section
            className="grid gap-3 rounded-xl border bg-muted/30 p-4"
            aria-labelledby="localizacao-vaga"
          >
            <h3 id="localizacao-vaga" className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4 text-amber-500" aria-hidden="true" />
              Localização e categoria
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <LinhaDetalhe termo="Andar" descricao={andar} />
              <LinhaDetalhe termo="Setor" descricao={setor} />
              <LinhaDetalhe termo="Categoria" descricao={nomesTipoVaga[vaga.tipo]} />
              <LinhaDetalhe termo="Cadastro" descricao={vaga.ativo ? "Ativo" : "Inativo"} />
            </dl>
          </section>

          <section
            className="grid gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
            aria-labelledby="sensor-vaga"
          >
            <h3 id="sensor-vaga" className="flex items-center gap-2 font-semibold">
              <Radio className="size-4" aria-hidden="true" />
              Monitoramento do sensor
            </h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <LinhaDetalhe termo="Saúde do sensor" descricao="Aguardando telemetria" />
              <LinhaDetalhe termo="Comunicação" descricao="Ainda não monitorada" />
              <LinhaDetalhe termo="Última leitura" descricao="Não disponível" />
              <LinhaDetalhe termo="Fonte do status" descricao="Registro atual do sistema" />
            </dl>
            <p className="flex gap-2 rounded-lg bg-white/70 p-3 text-xs leading-relaxed">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                A saúde só será classificada quando o sistema receber observações individuais do
                sensor. O contato da placa, sozinho, não comprova que o sensor esteja funcionando.
              </span>
            </p>
          </section>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

interface LinhaDetalheProps {
  termo: string
  descricao: string
}

/** Padroniza pares de rótulo e valor para leitura visual e por tecnologias assistivas. */
function LinhaDetalhe({ termo, descricao }: LinhaDetalheProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{termo}</dt>
      <dd className="mt-0.5 break-words font-semibold">{descricao}</dd>
    </div>
  )
}
