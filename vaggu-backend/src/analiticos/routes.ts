/** Expõe métricas históricas somente para o shopping derivado da sessão autenticada. */
import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, shoppingScope } from '../auth/middleware.js';

type ServicoAnaliticos = ReturnType<typeof import('./service.js').createAnaliticosService>;

export function analiticosGerenteRoutes(auth: unknown, analiticos: ServicoAnaliticos) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, shoppingScope);
  router.get('/', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await analiticos.buscarAnalise(res.locals.shoppingId));
  });
  return router;
}

/** Permite ao Admin consultar um shopping escolhido, mantendo o recorte explícito na rota. */
export function analiticosAdminRoutes(auth: unknown, analiticos: ServicoAnaliticos) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
  router.get('/shoppings/:shoppingId/analise', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await analiticos.buscarAnalise(req.params.shoppingId));
  });
  return router;
}
