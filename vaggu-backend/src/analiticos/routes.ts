/** Expõe métricas históricas somente para o shopping derivado da sessão autenticada. */
import { Router } from 'express';
import { requireAuth, requirePasswordReady, shoppingScope } from '../auth/middleware.js';

export function analiticosRoutes(auth: unknown, analiticos: ReturnType<typeof import('./service.js').createAnaliticosService>) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, shoppingScope);
  router.get('/', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await analiticos.buscarAnalise(res.locals.shoppingId));
  });
  return router;
}
