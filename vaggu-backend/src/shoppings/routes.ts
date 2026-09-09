// Rotas HTTP administrativas de shoppings e gerentes. Todas exigem Admin VAGGU
// com senha definitiva antes de executar as regras do serviço.
import { Router } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil } from '../auth/middleware.js';

export function shoppingsRoutes(auth, shoppings) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));

  router.get('/', async (_req, res) => {
    res.json(await shoppings.listarShoppings());
  });

  router.post('/', async (req, res) => {
    res.status(201).json(await shoppings.criarShopping(req.body));
  });

  router.get('/:shoppingId/gerentes', async (req, res) => {
    res.json(await shoppings.listarGerentes(req.params.shoppingId));
  });

  router.post('/:shoppingId/gerentes', async (req, res) => {
    res.status(201).json(await shoppings.criarGerente(req.params.shoppingId, req.body));
  });

  return router;
}

export function gerentesRoutes(auth, shoppings) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));

  router.patch('/:gerenteId', async (req, res) => {
    res.json(await shoppings.atualizarGerente(req.params.gerenteId, req.body));
  });

  router.post('/:gerenteId/redefinir-senha', async (req, res) => {
    res.json(await shoppings.redefinirSenhaGerente(req.params.gerenteId));
  });

  return router;
}
