/** Define o conjunto sintético compartilhado entre testes analíticos e Power BI. */

export type EstadoIntervalo = 'LIVRE' | 'OCUPADA' | 'INDISPONIVEL';

export type IntervaloOcupacao = {
  cenarioId: string;
  origem: 'SINTETICO';
  shoppingCodigo: string;
  andar: string;
  setor: string;
  vagaCodigo: string;
  tipoVaga: 'COMUM' | 'PCD' | 'IDOSO' | 'ELETRICA';
  estado: EstadoIntervalo;
  inicioEm: string;
  fimEm: string;
  entradaObservada: boolean;
};

export type MetricasOcupacao = {
  tempoAtivoSegundos: number;
  tempoOcupadoSegundos: number;
  tempoLivreSegundos: number;
  tempoIndisponivelSegundos: number;
  tempoConhecidoSegundos: number;
  ocupacaoPercentual: number;
  coberturaPercentual: number;
  entradasObservadas: number;
  duracaoCompletaObservadaSegundos: number;
  ocupacaoAtualPercentual: number;
};

const CENARIO_ID = 'power-bi-duas-vagas-uma-hora';
const CENARIO_DEMONSTRACAO_ID = 'power-bi-demonstracao-sete-dias';

const VAGAS_DEMONSTRACAO = [
  { codigo: 'A01', andar: 'G1', setor: 'Setor A', tipo: 'COMUM' },
  { codigo: 'A02', andar: 'G1', setor: 'Setor A', tipo: 'COMUM' },
  { codigo: 'A03', andar: 'G1', setor: 'Setor A', tipo: 'PCD' },
  { codigo: 'A04', andar: 'G1', setor: 'Setor A', tipo: 'IDOSO' },
  { codigo: 'B01', andar: 'G1', setor: 'Setor B', tipo: 'COMUM' },
  { codigo: 'B02', andar: 'G1', setor: 'Setor B', tipo: 'COMUM' },
  { codigo: 'B03', andar: 'G1', setor: 'Setor B', tipo: 'ELETRICA' },
  { codigo: 'B04', andar: 'G1', setor: 'Setor B', tipo: 'IDOSO' },
  { codigo: 'C01', andar: 'G2', setor: 'Setor C', tipo: 'COMUM' },
  { codigo: 'C02', andar: 'G2', setor: 'Setor C', tipo: 'COMUM' },
  { codigo: 'C03', andar: 'G2', setor: 'Setor C', tipo: 'PCD' },
  { codigo: 'C04', andar: 'G2', setor: 'Setor C', tipo: 'ELETRICA' },
  { codigo: 'D01', andar: 'G2', setor: 'Setor D', tipo: 'COMUM' },
  { codigo: 'D02', andar: 'G2', setor: 'Setor D', tipo: 'COMUM' },
  { codigo: 'D03', andar: 'G2', setor: 'Setor D', tipo: 'IDOSO' },
  { codigo: 'D04', andar: 'G2', setor: 'Setor D', tipo: 'ELETRICA' },
] as const satisfies readonly {
  codigo: string;
  andar: string;
  setor: string;
  tipo: IntervaloOcupacao['tipoVaga'];
}[];

/** Intervalos já confirmados; não simulam mensagens brutas nem substituem o teste do ESP32. */
export const conjuntoControladoPowerBi: readonly IntervaloOcupacao[] = [
  criarIntervalo('A', 'COMUM', 'LIVRE', 0, 15, false),
  criarIntervalo('A', 'COMUM', 'OCUPADA', 15, 45, true),
  criarIntervalo('A', 'COMUM', 'LIVRE', 45, 60, false),
  criarIntervalo('B', 'PCD', 'OCUPADA', 0, 30, false),
  criarIntervalo('B', 'PCD', 'INDISPONIVEL', 30, 50, false),
  criarIntervalo('B', 'PCD', 'LIVRE', 50, 60, false),
];

/**
 * Amplia a demonstração com sete dias e vários recortes, sem representar leituras reais de sensores.
 * Cada intervalo tem duas horas e usa uma sequência determinística para manter o CSV reproduzível.
 */
export const conjuntoDemonstracaoPowerBi: readonly IntervaloOcupacao[] = gerarConjuntoDemonstracao();

function gerarConjuntoDemonstracao(): readonly IntervaloOcupacao[] {
  const intervalos: IntervaloOcupacao[] = [];
  const horasDeInicio = [8, 10, 12, 14, 16, 18, 20] as const;

  for (let dia = 0; dia < 7; dia += 1) {
    for (const [indiceVaga, vaga] of VAGAS_DEMONSTRACAO.entries()) {
      let estadoAnterior: EstadoIntervalo | undefined;

      for (const [indiceFaixa, hora] of horasDeInicio.entries()) {
        const estado = determinarEstadoDemonstracao(dia, indiceVaga, indiceFaixa);
        const inicio = new Date(Date.UTC(2026, 4, 11 + dia, hora));
        const fim = new Date(Date.UTC(2026, 4, 11 + dia, hora + 2));
        intervalos.push({
          cenarioId: CENARIO_DEMONSTRACAO_ID,
          origem: 'SINTETICO',
          shoppingCodigo: 'SHOPPING-DEMONSTRACAO',
          andar: vaga.andar,
          setor: vaga.setor,
          vagaCodigo: vaga.codigo,
          tipoVaga: vaga.tipo,
          estado,
          inicioEm: inicio.toISOString(),
          fimEm: fim.toISOString(),
          entradaObservada: estado === 'OCUPADA' && estadoAnterior !== undefined && estadoAnterior !== 'OCUPADA',
        });
        estadoAnterior = estado;
      }
    }
  }

  return intervalos;
}

function determinarEstadoDemonstracao(
  dia: number,
  indiceVaga: number,
  indiceFaixa: number,
): EstadoIntervalo {
  const ciclo = (dia * 3 + indiceVaga * 2 + indiceFaixa) % 12;
  if (ciclo === 11) return 'INDISPONIVEL';
  if (ciclo >= 4 && ciclo <= 9) return 'OCUPADA';
  return 'LIVRE';
}

function criarIntervalo(
  vagaCodigo: string,
  tipoVaga: IntervaloOcupacao['tipoVaga'],
  estado: EstadoIntervalo,
  inicioMinuto: number,
  fimMinuto: number,
  entradaObservada: boolean,
): IntervaloOcupacao {
  const inicio = new Date(Date.UTC(2026, 0, 1, 0, inicioMinuto));
  const fim = new Date(Date.UTC(2026, 0, 1, 0, fimMinuto));
  return {
    cenarioId: CENARIO_ID,
    origem: 'SINTETICO',
    shoppingCodigo: 'SHOPPING-DEMONSTRACAO',
    andar: 'Piso demonstração',
    setor: 'Setor A',
    vagaCodigo,
    tipoVaga,
    estado,
    inicioEm: inicio.toISOString(),
    fimEm: fim.toISOString(),
    entradaObservada,
  };
}

/** Calcula métricas ponderadas pelo tempo conhecido, sem contar indisponibilidade como vaga livre. */
export function calcularMetricasOcupacao(intervalos: readonly IntervaloOcupacao[]): MetricasOcupacao {
  if (intervalos.length === 0) {
    throw new RangeError('As métricas exigem ao menos um intervalo confirmado.');
  }

  let tempoLivreSegundos = 0;
  let tempoOcupadoSegundos = 0;
  let tempoIndisponivelSegundos = 0;
  let entradasObservadas = 0;
  let duracaoCompletaObservadaSegundos = 0;
  const ultimoIntervaloPorVaga = new Map<string, { fimMs: number; estado: EstadoIntervalo }>();

  for (const intervalo of intervalos) {
    const inicioMs = Date.parse(intervalo.inicioEm);
    const fimMs = Date.parse(intervalo.fimEm);
    if (!Number.isFinite(inicioMs) || !Number.isFinite(fimMs) || fimMs <= inicioMs) {
      throw new RangeError(`Intervalo inválido para a vaga ${intervalo.vagaCodigo}.`);
    }

    const duracaoSegundos = (fimMs - inicioMs) / 1_000;
    if (intervalo.estado === 'LIVRE') tempoLivreSegundos += duracaoSegundos;
    if (intervalo.estado === 'OCUPADA') tempoOcupadoSegundos += duracaoSegundos;
    if (intervalo.estado === 'INDISPONIVEL') tempoIndisponivelSegundos += duracaoSegundos;
    if (intervalo.entradaObservada) {
      entradasObservadas += 1;
      duracaoCompletaObservadaSegundos += duracaoSegundos;
    }

    const ultimo = ultimoIntervaloPorVaga.get(intervalo.vagaCodigo);
    if (ultimo === undefined || fimMs > ultimo.fimMs) {
      ultimoIntervaloPorVaga.set(intervalo.vagaCodigo, { fimMs, estado: intervalo.estado });
    }
  }

  const tempoAtivoSegundos = tempoLivreSegundos + tempoOcupadoSegundos + tempoIndisponivelSegundos;
  const tempoConhecidoSegundos = tempoLivreSegundos + tempoOcupadoSegundos;
  const vagasAtuais = [...ultimoIntervaloPorVaga.values()];
  const vagasOcupadas = vagasAtuais.filter((intervalo) => intervalo.estado === 'OCUPADA').length;

  return {
    tempoAtivoSegundos,
    tempoOcupadoSegundos,
    tempoLivreSegundos,
    tempoIndisponivelSegundos,
    tempoConhecidoSegundos,
    ocupacaoPercentual: tempoConhecidoSegundos === 0 ? 0 : (tempoOcupadoSegundos / tempoConhecidoSegundos) * 100,
    coberturaPercentual: tempoAtivoSegundos === 0 ? 0 : (tempoConhecidoSegundos / tempoAtivoSegundos) * 100,
    entradasObservadas,
    duracaoCompletaObservadaSegundos,
    ocupacaoAtualPercentual: vagasAtuais.length === 0 ? 0 : (vagasOcupadas / vagasAtuais.length) * 100,
  };
}

/** Serializa os intervalos em um CSV simples e reproduzível para importação no Power BI Desktop. */
export function gerarCsvConjuntoControlado(intervalos: readonly IntervaloOcupacao[]): string {
  const cabecalho = [
    'cenario_id', 'origem', 'shopping_codigo', 'andar', 'setor', 'vaga_codigo', 'tipo_vaga',
    'estado', 'inicio_em', 'fim_em', 'entrada_observada',
  ];
  const linhas = intervalos.map((intervalo) => [
    intervalo.cenarioId,
    intervalo.origem,
    intervalo.shoppingCodigo,
    intervalo.andar,
    intervalo.setor,
    intervalo.vagaCodigo,
    intervalo.tipoVaga,
    intervalo.estado,
    intervalo.inicioEm,
    intervalo.fimEm,
    String(intervalo.entradaObservada),
  ].map(escaparCsv).join(','));
  return `${cabecalho.join(',')}\n${linhas.join('\n')}\n`;
}

function escaparCsv(valor: string): string {
  return /[",\r\n]/.test(valor) ? `"${valor.replaceAll('"', '""')}"` : valor;
}
