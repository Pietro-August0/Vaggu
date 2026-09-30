/** Consulta e agrega o histórico confirmado do shopping sem expor eventos de outro cliente. */
import { Prisma, type PrismaClient } from '@prisma/client';
import { ApiError } from '../auth/service.js';

export type IntervaloHistorico = {
  setor: string;
  estado: 'LIVRE' | 'OCUPADA' | 'INDISPONIVEL' | 'DESCONHECIDA';
  inicioEm: Date;
  fimEm: Date;
  entradaObservada: boolean;
};

type Acumulador = { ocupadoMs: number; conhecidoMs: number; ativoMs: number; entradas: number };
type CapacidadesAtivas = { total: number; porSetor: ReadonlyMap<string, number> };

function acumular(destino: Acumulador, estado: IntervaloHistorico['estado'], duracaoMs: number, entrada: boolean) {
  destino.ativoMs += duracaoMs;
  if (estado === 'LIVRE' || estado === 'OCUPADA') destino.conhecidoMs += duracaoMs;
  if (estado === 'OCUPADA') destino.ocupadoMs += duracaoMs;
  if (entrada) destino.entradas += 1;
}

function percentual(numerador: number, denominador: number) {
  return denominador > 0 ? Number((numerador / denominador * 100).toFixed(2)) : 0;
}

function shoppingIdValido(valor: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)) {
    throw new ApiError(400, 'SHOPPING_ID_INVALIDO', 'O shopping informado é inválido.');
  }
  return valor;
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
  const dias = Array.from({ length: 7 }, (_, indice) => {
    const diaInicio = new Date(inicio.getTime() + indice * 86_400_000);
    const diaFim = new Date(Math.min(fim.getTime(), diaInicio.getTime() + 86_400_000));
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
  const tempoAtivoTotalMs = capacidades && capacidades.total > 0
    ? capacidades.total * duracaoPeriodoMs
    : resumo.ativoMs;

  return {
    temHistorico: resumo.ativoMs > 0,
    periodo: { inicioEm: inicio.toISOString(), fimEm: fim.toISOString() },
    resumo: {
      ocupacaoPercentual: percentual(resumo.ocupadoMs, resumo.conhecidoMs),
      coberturaPercentual: percentual(resumo.conhecidoMs, tempoAtivoTotalMs),
      entradasObservadas: resumo.entradas,
    },
    porDia: dias.map((dia) => ({
      inicioEm: dia.inicio.toISOString(),
      ocupacaoPercentual: percentual(dia.acumulador.ocupadoMs, dia.acumulador.conhecidoMs),
      coberturaPercentual: percentual(
        dia.acumulador.conhecidoMs,
        capacidades && capacidades.total > 0
          ? capacidades.total * (dia.fim.getTime() - dia.inicio.getTime())
          : dia.acumulador.ativoMs,
      ),
    })),
    porSetor: [...setores.entries()].map(([setor, valor]) => ({
      setor,
      ocupacaoPercentual: percentual(valor.ocupadoMs, valor.conhecidoMs),
      coberturaPercentual: percentual(
        valor.conhecidoMs,
        (capacidades?.porSetor.get(setor) ?? 0) > 0
          ? (capacidades?.porSetor.get(setor) ?? 0) * duracaoPeriodoMs
          : valor.ativoMs,
      ),
      entradasObservadas: valor.entradas,
    })).sort((a, b) => a.setor.localeCompare(b.setor, 'pt-BR')),
  };
}

/** Usa a view analítica para restringir a leitura aos últimos sete dias do shopping autenticado. */
export function createAnaliticosService(prisma: PrismaClient, agora = () => new Date()) {
  return {
    async buscarAnalise(shoppingId: string) {
      const idShopping = shoppingIdValido(shoppingId);
      const fim = agora();
      const inicio = new Date(fim.getTime() - 7 * 86_400_000);
      const [intervalos, vagasAtivas] = await Promise.all([
        prisma.$queryRaw<IntervaloHistorico[]>(Prisma.sql`
        SELECT setor,
               estado::text AS estado,
               inicio_em AS "inicioEm",
               fim_em AS "fimEm",
               entrada_observada AS "entradaObservada"
          FROM power_bi_intervalos_ocupacao
         WHERE shopping_codigo = ${idShopping}
           AND fim_em > ${inicio}
           AND inicio_em < ${fim}
         ORDER BY inicio_em
      `),
        prisma.vaga.findMany({
          where: { shoppingId: idShopping, ativo: true },
          select: { setor: { select: { nome: true } } },
        }),
      ]);
      const porSetor = new Map<string, number>();
      for (const vaga of vagasAtivas) {
        const setor = vaga.setor?.nome ?? 'Sem setor';
        porSetor.set(setor, (porSetor.get(setor) ?? 0) + 1);
      }
      return calcularAnaliseHistorica(intervalos, inicio, fim, { total: vagasAtivas.length, porSetor });
    },
  };
}
