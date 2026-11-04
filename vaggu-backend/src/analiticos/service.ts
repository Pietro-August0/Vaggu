/** Consulta e agrega o histórico confirmado do shopping sem expor eventos de outro cliente. */
import { Prisma, type PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';

export type IntervaloHistorico = {
  setor: string;
  estado: 'LIVRE' | 'OCUPADA' | 'INDISPONIVEL' | 'DESCONHECIDA';
  inicioEm: Date;
  fimEm: Date;
  entradaObservada: boolean;
  saidaObservada?: boolean;
};

type Acumulador = { ocupadoMs: number; conhecidoMs: number; ativoMs: number; entradas: number };
type CapacidadesAtivas = { total: number; porSetor: ReadonlyMap<string, number> };
export type FiltrosAnalise = { setorId?: string; tipo?: 'COMUM' | 'PCD' | 'IDOSO' | 'ELETRICA' };
export type PeriodoAnalise = { inicio: Date; fim: Date };
const DIA_MS = 86_400_000;

function acumular(destino: Acumulador, estado: IntervaloHistorico['estado'], duracaoMs: number, entrada: boolean) {
  destino.ativoMs += duracaoMs;
  if (estado === 'LIVRE' || estado === 'OCUPADA') destino.conhecidoMs += duracaoMs;
  if (estado === 'OCUPADA') destino.ocupadoMs += duracaoMs;
  if (entrada) destino.entradas += 1;
}

function percentual(numerador: number, denominador: number) {
  return denominador > 0 ? Number((numerador / denominador * 100).toFixed(2)) : 0;
}

// A capacidade atual é apenas referência; inconsistência histórica não vira percentual impossível.
function cobertura(observado: number, referencia: number) {
  return referencia <= 0 || observado > referencia ? null : percentual(observado, referencia);
}

function shoppingIdValido(valor: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) {
    throw new ApiError(400, 'SHOPPING_ID_INVALIDO', 'O shopping informado é inválido.');
  }
  return valor;
}

/** Atribui ciclos ao encerramento e preserva sua duração integral. */
function metricasCiclos(intervalos: readonly IntervaloHistorico[], inicio: Date, fim: Date, entradas: number, capacidade?: number) {
  const encerrados = intervalos.filter(i => i.saidaObservada && i.fimEm >= inicio && i.fimEm < fim);
  const completos = encerrados.filter(i => i.entradaObservada && i.estado === 'OCUPADA');
  return {
    saidasObservadas: encerrados.length,
    ciclosCompletos: completos.length,
    permanenciaMediaMinutos: completos.length ? Number((completos.reduce((total, i) => total + (i.fimEm.getTime() - i.inicioEm.getTime()) / 60_000, 0) / completos.length).toFixed(2)) : null,
    rotatividadeObservada: capacidade && capacidade > 0 ? Number((entradas / capacidade).toFixed(2)) : null,
  };
}

/** Calcula métricas ponderadas pelo tempo e limita cada intervalo ao período solicitado. */
export function calcularAnaliseHistorica(
  intervalos: readonly IntervaloHistorico[],
  inicio: Date,
  fim: Date,
  capacidades?: CapacidadesAtivas,
) {
  const resumo: Acumulador = { ocupadoMs: 0, conhecidoMs: 0, ativoMs: 0, entradas: 0 };
  const setores = new Map<string, Acumulador>();
  const primeiroDiaUtc = Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate());
  const quantidadeDias = Math.ceil((fim.getTime() - primeiroDiaUtc) / DIA_MS);
  const dias = Array.from({ length: quantidadeDias }, (_, indice) => {
    const diaInicio = new Date(primeiroDiaUtc + indice * DIA_MS);
    const diaFim = new Date(Math.min(fim.getTime(), diaInicio.getTime() + DIA_MS));
    return { inicio: diaInicio, fim: diaFim, acumulador: { ocupadoMs: 0, conhecidoMs: 0, ativoMs: 0, entradas: 0 } as Acumulador };
  });

  for (const intervalo of intervalos) {
    const inicioMs = Math.max(inicio.getTime(), intervalo.inicioEm.getTime());
    const fimMs = Math.min(fim.getTime(), intervalo.fimEm.getTime());
    if (fimMs <= inicioMs) continue;
    const duracaoMs = fimMs - inicioMs;
    const entradaNoPeriodo = intervalo.entradaObservada
      && intervalo.inicioEm.getTime() >= inicio.getTime()
      && intervalo.inicioEm.getTime() < fim.getTime();
    acumular(resumo, intervalo.estado, duracaoMs, entradaNoPeriodo);
    const setor = setores.get(intervalo.setor) ?? { ocupadoMs: 0, conhecidoMs: 0, ativoMs: 0, entradas: 0 };
    acumular(setor, intervalo.estado, duracaoMs, entradaNoPeriodo);
    setores.set(intervalo.setor, setor);

    for (const dia of dias) {
      const intersecao = Math.min(fimMs, dia.fim.getTime()) - Math.max(inicioMs, dia.inicio.getTime());
      const entradaNoDia = intervalo.entradaObservada
        && intervalo.inicioEm.getTime() >= dia.inicio.getTime()
        && intervalo.inicioEm.getTime() < dia.fim.getTime();
      if (intersecao > 0) acumular(dia.acumulador, intervalo.estado, intersecao, entradaNoDia);
    }
  }

  const duracaoPeriodoMs = fim.getTime() - inicio.getTime();
  const tempoAtivoTotalMs = capacidades ? capacidades.total * duracaoPeriodoMs : resumo.ativoMs;

  return {
    temHistorico: resumo.ativoMs > 0,
    periodo: { inicioEm: inicio.toISOString(), fimEm: fim.toISOString() },
    resumo: {
      ocupacaoPercentual: resumo.conhecidoMs > 0 ? percentual(resumo.ocupadoMs, resumo.conhecidoMs) : null,
      coberturaPercentual: cobertura(resumo.conhecidoMs, tempoAtivoTotalMs),
      entradasObservadas: resumo.entradas,
      ...metricasCiclos(intervalos, inicio, fim, resumo.entradas, capacidades?.total),
      capacidadeAtivaReferencia: capacidades?.total ?? null,
      regraCobertura: 'Estimativa sobre capacidade atual. Indisponível se o histórico exceder a referência; mudanças de cadastro limitam a comparação.',
      regraRotatividade: 'Entradas observadas no período / vagas atualmente ativas no filtro.',
      regraPermanencia: 'Ciclos completos encerrados no período UTC, com duração total observada, sem falha intermediária.',
    },
    porDia: resumo.ativoMs > 0 ? dias.map((dia) => ({
      inicioEm: dia.inicio.toISOString(),
      ocupacaoPercentual: dia.acumulador.conhecidoMs > 0 ? percentual(dia.acumulador.ocupadoMs, dia.acumulador.conhecidoMs) : null,
      entradasObservadas: dia.acumulador.entradas,
      ...metricasCiclos(intervalos, new Date(Math.max(inicio.getTime(), dia.inicio.getTime())), dia.fim, dia.acumulador.entradas, capacidades?.total),
      coberturaPercentual: cobertura(
        dia.acumulador.conhecidoMs,
        capacidades ? capacidades.total * (dia.fim.getTime() - dia.inicio.getTime()) : dia.acumulador.ativoMs,
      ),
    })) : [],
    porSetor: [...setores.entries()].map(([setor, valor]) => ({
      setor,
      ocupacaoPercentual: valor.conhecidoMs > 0 ? percentual(valor.ocupadoMs, valor.conhecidoMs) : null,
      coberturaPercentual: cobertura(
        valor.conhecidoMs,
        capacidades ? (capacidades.porSetor.get(setor) ?? 0) * duracaoPeriodoMs : valor.ativoMs,
      ),
      entradasObservadas: valor.entradas,
      ...metricasCiclos(intervalos.filter(i => i.setor === setor), inicio, fim, valor.entradas, capacidades?.porSetor.get(setor)),
    })).sort((a, b) => a.setor.localeCompare(b.setor, 'pt-BR')),
  };
}

/** Usa a view analítica para restringir a leitura ao período UTC do shopping autenticado. */
export function createAnaliticosService(prisma: PrismaClient, agora = () => new Date()) {
  return {
    async buscarAnalise(shoppingId: string, periodo?: PeriodoAnalise, filtros: FiltrosAnalise = {}) {
      const idShopping = shoppingIdValido(shoppingId);
      if (filtros.setorId && !await prisma.setor.findFirst({ where: { id: filtros.setorId, shoppingId: idShopping }, select: { id: true } })) {
        throw new ApiError(404, 'SETOR_NAO_ENCONTRADO', 'Setor não encontrado neste shopping.');
      }
      const hoje = agora();
      const inicioHoje = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate());
      const inicio = periodo?.inicio ?? new Date(inicioHoje - 6 * DIA_MS);
      if (inicio >= hoje) {
        throw new ApiError(400, 'PERIODO_INVALIDO', 'O período não pode estar inteiramente no futuro.');
      }
      // O dia atual termina no instante da consulta: horas futuras não entram no denominador da cobertura.
      const fim = new Date(Math.min(periodo?.fim.getTime() ?? hoje.getTime(), hoje.getTime()));
      const [intervalos, vagasAtivas] = await Promise.all([
        prisma.$queryRaw<IntervaloHistorico[]>(Prisma.sql`
        SELECT andar || ' / ' || setor AS setor,
               estado::text AS estado,
               inicio_em AS "inicioEm",
               fim_em AS "fimEm",
               entrada_observada AS "entradaObservada",
               saida_observada AS "saidaObservada"
          FROM power_bi_intervalos_ocupacao
         WHERE shopping_codigo = ${idShopping}
           AND fim_em >= ${inicio}
           ${filtros.setorId ? Prisma.sql`AND setor_id = ${filtros.setorId}` : Prisma.empty}
           ${filtros.tipo ? Prisma.sql`AND tipo_vaga = ${filtros.tipo}` : Prisma.empty}
           AND inicio_em < ${fim}
         ORDER BY inicio_em
      `),
        prisma.vaga.findMany({
          where: { shoppingId: idShopping, ativo: true, ...filtros },
          select: { andar: { select: { nome: true } }, setor: { select: { nome: true } } },
        }),
      ]);
      const porSetor = new Map<string, number>();
      for (const vaga of vagasAtivas) {
        const setor = `${vaga.andar?.nome ?? 'Sem andar'} / ${vaga.setor?.nome ?? 'Sem setor'}`;
        porSetor.set(setor, (porSetor.get(setor) ?? 0) + 1);
      }
      return calcularAnaliseHistorica(intervalos, inicio, fim, { total: vagasAtivas.length, porSetor });
    },
  };
}
