// Rotas HTTP administrativas de shoppings e gerentes. Todas exigem Admin VAGGU
// com senha definitiva antes de executar as regras do serviço.
import { Router, raw } from 'express';
import { requireAuth, requirePasswordReady, requirePerfil } from '../auth/middleware.js';

/** Expõe cadastro/listagem de shoppings e criação/listagem de seus gerentes para o administrador. */
export function shoppingsRoutes(auth, shoppings) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));

  router.get('/', async (_req, res) => {
    res.json(await shoppings.listarShoppings());
  });

  router.post('/', async (req, res) => {
    res.status(201).json(await shoppings.criarShopping(req.body));
  });

  router.get('/:shoppingId/foto', async (req, res) => {
    const foto = await shoppings.buscarFotoShopping(req.params.shoppingId);
    res.set('Cache-Control', 'private, no-store');
    res.type(foto.mime).send(foto.dados);
  });

  router.post('/:shoppingId/foto', raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '2mb' }), async (req, res) => {
    res.json(await shoppings.salvarFotoShopping(req.params.shoppingId, req.body, req.headers['content-type']));
  });

  router.get('/:shoppingId', async (req, res) => {
    res.json(await shoppings.buscarShopping(req.params.shoppingId));
  });

  router.patch('/:shoppingId', async (req, res) => {
    res.json(await shoppings.atualizarShopping(req.params.shoppingId, req.body));
  });

  router.delete('/:shoppingId', async (req, res) => {
    res.json(await shoppings.excluirShopping(req.params.shoppingId));
  });

  router.patch('/:shoppingId/implantacao', async (req, res) => {
    res.json(await shoppings.atualizarImplantacao(req.params.shoppingId, req.body));
  });

  router.get('/:shoppingId/gerentes', async (req, res) => {
    res.json(await shoppings.listarGerentes(req.params.shoppingId));
  });

  router.post('/:shoppingId/gerentes', async (req, res) => {
    res.status(201).json(await shoppings.criarGerente(req.params.shoppingId, req.body));
  });

  return router;
}

/** Expõe alteração individual e redefinição de senha de gerente para o administrador. */
export function gerentesRoutes(auth, shoppings) {
  const router = Router();
  router.use(requireAuth(auth), requirePasswordReady, requirePerfil('VAGGU'));

  router.patch('/:gerenteId', async (req, res) => {
    res.json(await shoppings.atualizarGerente(req.params.gerenteId, req.body));
  });

  router.post('/:gerenteId/redefinir-senha', async (req, res) => {
    res.json(await shoppings.redefinirSenhaGerente(req.params.gerenteId));
  });

  router.delete('/:gerenteId', async (req, res) => {
    res.json(await shoppings.excluirGerente(req.params.gerenteId));
  });

  router.post('/:gerenteId/desfazer-exclusao', async (req, res) => {
    res.json(await shoppings.desfazerExclusaoGerente(req.params.gerenteId));
  });

  return router;
}
