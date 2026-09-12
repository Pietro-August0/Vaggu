/** Contratos públicos da estrutura do estacionamento, sem dados técnicos dos sensores. */
export type TipoVaga = "COMUM" | "PCD" | "IDOSO" | "ELETRICA"
export type SituacaoImplantacao = "NOVO_ATENDIMENTO" | "EM_ANALISE" | "DOCUMENTACAO_PENDENTE" | "APROVADO" | "EM_CONFIGURACAO" | "AGUARDANDO_INSTALACAO" | "ATIVO" | "REJEITADO" | "INATIVO"
export interface PosicaoVaga { x: number; y: number; largura: number; altura: number; rotacao: number }
export interface VagaEstrutura { id: string; codigo: string; tipo: TipoVaga; estadoAtual: "LIVRE" | "OCUPADA" | "DESCONHECIDA"; ativo: boolean; posicao: PosicaoVaga | null }
export interface SetorEstrutura { id: string; nome: string; ativo: boolean; vagas: VagaEstrutura[] }
export interface AndarEstrutura { id: string; nome: string; ordem: number; imagemMapa: string | null; revisaoMapa: number; ativo: boolean; setores: SetorEstrutura[] }
export interface EstruturaEstacionamento { shopping: { id: string; nome: string; situacaoImplantacao: SituacaoImplantacao }; andares: AndarEstrutura[] }
