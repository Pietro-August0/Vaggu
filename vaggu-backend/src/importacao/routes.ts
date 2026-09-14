// Rotas administrativas da importação estrutural, separadas das operações manuais do P04.
import { raw, Router, text } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil } from '../auth/middleware.js';

/** Recebe arquivos limitados, persiste a prévia e permite consultar seu resultado ao Admin. */
export function importacaoRoutes(auth: unknown, importacao: ReturnType<typeof import('./service.js').createImportacaoService>) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
  router.get('/shoppings/:shoppingId/importacoes/:importacaoId', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await importacao.buscarPrevia(req.params.shoppingId, req.params.importacaoId));
  });
  router.post('/shoppings/:shoppingId/importacoes/previa-csv', text({ type: ['text/csv', 'text/plain'], limit: '1mb' }),
    async (req, res) => res.json(await importacao.criarPreviaCsv(req.params.shoppingId, req.body)));
  router.post('/shoppings/:shoppingId/importacoes/previa-xlsx',
    raw({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', limit: '2mb' }),
    async (req, res) => res.json(await importacao.criarPreviaXlsx(req.params.shoppingId, req.body)));
  return router;
}
