// Rotas do P04. Admin configura a estrutura; gerente apenas consulta o shopping derivado da sessão.
import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil, shoppingScope } from '../auth/middleware.js';

/** Monta as operações administrativas de andares, setores, vagas e posições. */
export function estruturaAdminRoutes(auth: unknown, estrutura: ReturnType<typeof import('./service.js').createEstruturaService>) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));
  router.get('/shoppings/:shoppingId/estrutura', async (req, res) => res.json(await estrutura.buscarEstrutura(req.params.shoppingId)));
  router.post('/shoppings/:shoppingId/andares', async (req, res) => res.status(201).json(await estrutura.criarAndar(req.params.shoppingId, req.body)));
  router.post('/andares/:andarId/setores', async (req, res) => res.status(201).json(await estrutura.criarSetor(req.params.andarId, req.body)));
  router.patch('/andares/:andarId/mapa', async (req, res) => res.json(await estrutura.salvarMapa(req.params.andarId, req.body)));
  router.post('/setores/:setorId/vagas', async (req, res) => res.status(201).json(await estrutura.criarVaga(req.params.setorId, req.body)));
  return router;
}

/** Permite ao gerente consultar apenas a estrutura do shopping da própria sessão. */
export function estruturaGerenteRoutes(auth: unknown, estrutura: ReturnType<typeof import('./service.js').createEstruturaService>) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, shoppingScope);
  router.get('/', async (_req, res) => res.json(await estrutura.buscarEstrutura(res.locals.shoppingId)));
  return router;
}
