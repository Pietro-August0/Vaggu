// Rotas administrativas da importação estrutural, separadas das operações manuais do P04.
import { raw, Router, text } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil } from '../auth/middleware.js';

/** Recebe CSV textual com limite explícito e devolve somente uma prévia sem persistência. */
export function importacaoRoutes(auth: unknown, importacao: ReturnType<typeof import('./service.js').createImportacaoService>) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
  router.post('/shoppings/:shoppingId/importacoes/previa-csv', text({ type: ['text/csv', 'text/plain'], limit: '1mb' }),
    async (req, res) => res.json(await importacao.criarPreviaCsv(req.params.shoppingId, req.body)));
  router.post('/shoppings/:shoppingId/importacoes/previa-xlsx',
    raw({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', limit: '2mb' }),
    async (req, res) => res.json(await importacao.criarPreviaXlsx(req.params.shoppingId, req.body)));
  return router;
}
