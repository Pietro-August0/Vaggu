/** Rótulos e explicações dos estados de implantação definidos pelo backend. */
import type { SituacaoImplantacao } from "@/types/estrutura"

export const situacoesImplantacao: Record<SituacaoImplantacao, { nome: string; descricao: string; classe: string }> = {
  NOVO_ATENDIMENTO: { nome: "Novo atendimento", descricao: "Parceria em contato inicial, sem estrutura operacional.", classe: "bg-neutral-200 text-neutral-950" },
  EM_ANALISE: { nome: "Em análise", descricao: "Dados do shopping em avaliação pela equipe.", classe: "bg-sky-100 text-sky-900" },
  DOCUMENTACAO_PENDENTE: { nome: "Documentação pendente", descricao: "Há informações ou documentos a completar.", classe: "bg-amber-100 text-amber-900" },
  APROVADO: { nome: "Aprovado", descricao: "Parceria aprovada; configuração ainda não concluída.", classe: "bg-sky-100 text-sky-900" },
  EM_CONFIGURACAO: { nome: "Em configuração", descricao: "Andares, setores e vagas estão sendo preparados.", classe: "bg-amber-100 text-amber-900" },
  AGUARDANDO_INSTALACAO: { nome: "Aguardando instalação", descricao: "Estrutura cadastrada, aguardando instalação dos equipamentos.", classe: "bg-amber-100 text-amber-900" },
  ATIVO: { nome: "Operação ativa", descricao: "Implantação ativada; cada vaga ainda depende de leitura confirmada.", classe: "bg-emerald-100 text-emerald-900" },
  REJEITADO: { nome: "Rejeitado", descricao: "Parceria não aprovada; não há operação ativa.", classe: "bg-red-100 text-red-900" },
  INATIVO: { nome: "Inativo", descricao: "Shopping sem operação ativa no momento.", classe: "bg-neutral-200 text-neutral-950" },
}

/** Mantém um estado desconhecido explícito caso a API passe a trazer outro valor. */
export function obterSituacaoImplantacao(valor: string) {
  if (Object.prototype.hasOwnProperty.call(situacoesImplantacao, valor)) {
    return situacoesImplantacao[valor as SituacaoImplantacao]
  }
  return { nome: valor, descricao: "Situação não reconhecida pela interface.", classe: "bg-neutral-200 text-neutral-950" }
}
