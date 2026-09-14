// Contratos intermediários da importação de estrutura, compartilháveis pelos leitores CSV e XLSX.

export const TIPOS_VAGA_IMPORTACAO = ['COMUM', 'PCD', 'IDOSO', 'ELETRICA'] as const;

export type TipoVagaImportacao = typeof TIPOS_VAGA_IMPORTACAO[number];
export type CampoImportacao = 'arquivo' | 'codigo' | 'andar' | 'setor' | 'tipo';

export type RegistroImportacao = {
  linha: number;
  codigo: string;
  andar: string;
  setor: string;
  tipo: TipoVagaImportacao;
  acao: 'CRIAR' | 'ATUALIZAR';
  vagaId: string | null;
};

export type ErroImportacao = {
  linha: number;
  campo: CampoImportacao;
  codigo: string;
  mensagem: string;
};

export type PreviaImportacao = {
  registros: RegistroImportacao[];
  erros: ErroImportacao[];
  resumo: {
    totalLinhas: number;
    registrosValidos: number;
    totalErros: number;
    novos: number;
    atualizacoes: number;
  };
  podeConfirmar: boolean;
};
