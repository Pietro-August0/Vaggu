/** Contratos públicos da estrutura e do monitoramento, sem credenciais dos equipamentos. */
export type TipoVaga = "COMUM" | "PCD" | "IDOSO" | "ELETRICA"
export type SituacaoImplantacao = "NOVO_ATENDIMENTO" | "EM_ANALISE" | "DOCUMENTACAO_PENDENTE" | "APROVADO" | "EM_CONFIGURACAO" | "AGUARDANDO_INSTALACAO" | "ATIVO" | "REJEITADO" | "INATIVO"
export interface PosicaoVaga { x: number; y: number; largura: number; altura: number; rotacao: number }
export interface MonitoramentoSensor {
  sensorCodigo: string; placaCodigo: string | null; placaNome: string | null
  ultimaObservacaoEm: string | null; ultimoContatoPlacaEm: string | null
  estadoConfirmado: VagaEstrutura["estadoAtual"]; estadoCandidato: VagaEstrutura["estadoAtual"] | null
  candidatoIniciadoEm: string | null; situacao: "OPERANDO" | "CONFIRMANDO" | "SEM_RESPOSTA" | "MANUTENCAO" | "SEM_LEITURA"; demonstracao: boolean
}
export interface VagaEstrutura { id: string; codigo: string; tipo: TipoVaga; estadoAtual: "LIVRE" | "OCUPADA" | "DESCONHECIDA" | "INDISPONIVEL"; ativo: boolean; posicao: PosicaoVaga | null; monitoramento?: MonitoramentoSensor | null }
export interface SetorEstrutura { id: string; nome: string; ativo: boolean; vagas: VagaEstrutura[] }
export interface AndarEstrutura { id: string; nome: string; ordem: number; imagemMapa: string | null; revisaoMapa: number; ativo: boolean; setores: SetorEstrutura[] }
export interface EstruturaEstacionamento { shopping: { id: string; nome: string; situacaoImplantacao: SituacaoImplantacao; demonstracao?: boolean }; andares: AndarEstrutura[] }
