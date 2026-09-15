/** Contratos públicos da prévia e da confirmação da estrutura importada. */
export type AcaoImportacao = "CRIAR" | "ATUALIZAR"
export type CampoImportacao = "arquivo" | "codigo" | "andar" | "setor" | "tipo"

export interface RegistroImportacao {
  linha: number
  codigo: string
  andar: string
  setor: string
  tipo: "COMUM" | "PCD" | "IDOSO" | "ELETRICA"
  acao: AcaoImportacao
  vagaId: string | null
}

export interface ErroImportacao {
  linha: number
  campo: CampoImportacao
  codigo: string
  mensagem: string
}

export interface PreviaImportacao {
  importacaoId: string
  criadoEm: string
  registros: RegistroImportacao[]
  erros: ErroImportacao[]
  resumo: {
    totalLinhas: number
    registrosValidos: number
    totalErros: number
    novos: number
    atualizacoes: number
  }
  podeConfirmar: boolean
}

export interface ConfirmacaoImportacao {
  importacaoId: string
  confirmadoEm: string
  idempotente: boolean
  resultado: {
    andaresCriados: number
    setoresCriados: number
    vagasCriadas: number
    vagasAtualizadas: number
    vagasPreservadasForaDaPlanilha: number
  }
}
