/** Expõe métricas históricas somente para o shopping derivado da sessão autenticada. */
import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, shoppingScope } from '../auth/middleware.js';
import { ApiError } from '../auth/service.js';

type ServicoAnaliticos = ReturnType<typeof import('./service.js').createAnaliticosService>;

/** Aceita datas civis UTC inclusivas; o serviço converte o fim em limite exclusivo. */
function lerPeriodo(query: Record<string, unknown>) {
  const { inicio, fim } = query;
  if (inicio === undefined && fim === undefined) return undefined;
  if (typeof inicio !== 'string' || typeof fim !== 'string') {
    throw new ApiError(400, 'PERIODO_INVALIDO', 'Informe as datas inicial e final no formato AAAA-MM-DD.');
  }
  const converter = (valor: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
    const data = new Date(`${valor}T00:00:00.000Z`);
    return Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor ? null : data;
  };
  const dataInicio = converter(inicio);
  const dataFim = converter(fim);
  if (!dataInicio || !dataFim || dataFim < dataInicio ||
      (dataFim.getTime() - dataInicio.getTime()) / 86_400_000 >= 31) {
    throw new ApiError(400, 'PERIODO_INVALIDO', 'Escolha um período válido de até 31 dias em UTC.');
  }
  return { inicio: dataInicio, fim: new Date(dataFim.getTime() + 86_400_000) };
}

function lerFiltros(query: Record<string, unknown>): import('./service.js').FiltrosAnalise {
  const { setorId, tipo } = query;
  if (setorId !== undefined && (typeof setorId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(setorId))) {
    throw new ApiError(400, 'SETOR_ID_INVALIDO', 'Informe um setor válido.');
  }
  if (tipo !== undefined && (typeof tipo !== 'string' || !['COMUM', 'PCD', 'IDOSO', 'ELETRICA'].includes(tipo))) {
    throw new ApiError(400, 'TIPO_VAGA_INVALIDO', 'Informe uma categoria de vaga válida.');
  }
  return { ...(setorId ? { setorId: setorId as string } : {}), ...(tipo ? { tipo: tipo as import('./service.js').FiltrosAnalise['tipo'] } : {}) };
}

export function analiticosGerenteRoutes(auth: unknown, analiticos: ServicoAnaliticos) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, shoppingScope);
  router.get('/', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await analiticos.buscarAnalise(res.locals.shoppingId, lerPeriodo(req.query), lerFiltros(req.query)));
  });
  return router;
}

/** Permite ao Admin consultar um shopping escolhido, mantendo o recorte explícito na rota. */
export function analiticosAdminRoutes(auth: unknown, analiticos: ServicoAnaliticos) {
  const router = Router();
  router.get('/shoppings/:shoppingId/analise', requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'), async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await analiticos.buscarAnalise(req.params.shoppingId, lerPeriodo(req.query), lerFiltros(req.query)));
  });
  return router;
}
